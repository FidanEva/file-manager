import { useState, useEffect } from "react";
import mammoth from "mammoth";
import type { ViewerProps } from "../types/file.types";
import { getFileExtension } from "../utils/getFileExtension";

export const DocxViewer = ({ file }: ViewerProps) => {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ext = getFileExtension(file.fileName);

  useEffect(() => {
    setLoading(true);
    setHtml("");
    setError(null);

    fetch(file.url)
      .then((r) => r.arrayBuffer())
      .then(async (buf) => {
        // mammoth only supports .docx (Office Open XML).
        // Binary .doc (OLE2) causes mammoth to throw synchronously inside the
        // promise — wrapping in try/catch here ensures we always catch it.
        try {
          const { value } = await mammoth.convertToHtml({ arrayBuffer: buf });
          if (!value || value.trim() === "") throw new Error("empty");
          setHtml(value);
        } catch {
          setError("doc");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("doc");
        setLoading(false);
      });
  }, [file.url]);

  if (loading) return <div className="viewer-loading">Converting document…</div>;

  // Render the converted HTML
  if (html) {
    return (
      <div
        className="docx-viewer"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // .doc or failed conversion — iframe fallback.
  // Blob URLs served as application/msword will prompt the browser's native
  // handler. On Windows this opens Word in the browser frame if Office is
  // installed; elsewhere it falls through to the download link.
  return (
    <div className="doc-fallback">
      <div className="doc-fallback__notice">
        <strong>.{ext}</strong>
        {ext === "doc"
          ? " — Legacy Word 97–2003 binary format. Showing browser native viewer:"
          : " — Conversion failed. Showing raw preview:"}
      </div>
      <iframe
        src={file.url}
        className="doc-fallback__iframe"
        title={file.fileName}
        // Telling the browser the MIME type helps it pick the right handler
        // (application/msword triggers the Office plugin on Windows)
      />
      <div className="doc-fallback__download">
        Can't see the document?&ensp;
        <a href={file.url} download={file.fileName} className="unsupported-viewer__download">
          Download {file.fileName}
        </a>
        &ensp;and open in Word or LibreOffice.
      </div>
    </div>
  );
};