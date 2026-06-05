import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import type { ViewerProps } from "../types/file.types";

export const XlsxViewer = ({ file }: ViewerProps) => {
  const [sheets, setSheets] = useState<{ name: string; rows: string[][] }[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  useEffect(() => {
    setLoading(true);
    fetch(file.url)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const workbook = XLSX.read(buf, { type: "array" });
        const parsed = workbook.SheetNames.map((name) => {
          const ws = workbook.Sheets[name];
          const rows = XLSX.utils.sheet_to_json<string[]>(ws, {
            header: 1,
            defval: "",
          }) as string[][];
          return { name, rows };
        });
        setSheets(parsed);
        setActiveSheet(0);
        setPage(0);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message ?? "Failed to parse spreadsheet");
        setLoading(false);
      });
  }, [file.url]);

  if (loading) return <div className="viewer-loading">Parsing spreadsheet…</div>;
  if (error)   return <div className="viewer-error">⚠ {error}</div>;
  if (!sheets.length) return <div className="viewer-error">No sheets found</div>;

  const sheet = sheets[activeSheet];
  if (!sheet) return null;

  const headers = sheet.rows[0] ?? [];
  const dataRows = sheet.rows.slice(1);
  const totalPages = Math.ceil(dataRows.length / PAGE_SIZE);
  const pageRows = dataRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="xlsx-viewer">
      {/* Sheet tabs */}
      {sheets.length > 1 && (
        <div className="xlsx-viewer__tabs">
          {sheets.map((s, i) => (
            <button
              key={s.name}
              className={`xlsx-tab ${i === activeSheet ? "xlsx-tab--active" : ""}`}
              onClick={() => { setActiveSheet(i); setPage(0); }}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div className="csv-viewer__meta">
        {dataRows.length.toLocaleString()} rows · {headers.length} columns
        {sheets.length > 1 && <> · sheet {activeSheet + 1} of {sheets.length}</>}
      </div>

      <div className="csv-viewer__scroll">
        <table className="csv-table">
          <thead>
            <tr>
              <th className="csv-table__row-num">#</th>
              {headers.map((h, i) => (
                <th key={i}>{String(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, ri) => (
              <tr key={ri}>
                <td className="csv-table__row-num">
                  {page * PAGE_SIZE + ri + 1}
                </td>
                {headers.map((_, ci) => (
                  <td key={ci} title={String(row[ci] ?? "")}>
                    {String(row[ci] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="csv-viewer__pager">
          <button onClick={() => setPage(0)} disabled={page === 0}>«</button>
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>‹</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>›</button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page === totalPages - 1}>»</button>
        </div>
      )}
    </div>
  );
};