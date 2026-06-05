import { useState, useEffect, useMemo } from "react";
import type { ViewerProps } from "../types/file.types";

export const CsvViewer = ({ file }: ViewerProps) => {
  const [raw, setRaw] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  useEffect(() => {
    setLoading(true);
    fetch(file.url)
      .then((r) => r.text())
      .then((text) => {
        setRaw(text);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load file");
        setLoading(false);
      });
  }, [file.url]);

  const { headers, rows } = useMemo(() => {
    if (!raw) return { headers: [], rows: [] };
    const isTsv = file.fileName.endsWith(".tsv");
    const sep = isTsv ? "\t" : ",";
    const lines = raw.trim().split(/\r?\n/);
    const parseRow = (line: string) => {
      // Handles quoted fields
      const result: string[] = [];
      let cur = "";
      let inQuote = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuote = !inQuote; continue; }
        if (ch === sep && !inQuote) { result.push(cur); cur = ""; continue; }
        cur += ch;
      }
      result.push(cur);
      return result;
    };
    const [headerLine, ...dataLines] = lines;
    return {
      headers: parseRow(headerLine),
      rows: dataLines.filter(Boolean).map(parseRow),
    };
  }, [raw, file.fileName]);

  if (loading) return <div className="viewer-loading">Loading…</div>;
  if (error) return <div className="viewer-error">{error}</div>;

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const pageRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="csv-viewer">
      <div className="csv-viewer__meta">
        {rows.length.toLocaleString()} rows · {headers.length} columns
      </div>
      <div className="csv-viewer__scroll">
        <table className="csv-table">
          <thead>
            <tr>
              <th className="csv-table__row-num">#</th>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, ri) => (
              <tr key={ri}>
                <td className="csv-table__row-num">{page * PAGE_SIZE + ri + 1}</td>
                {row.map((cell, ci) => (
                  <td key={ci} title={cell}>
                    {cell}
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