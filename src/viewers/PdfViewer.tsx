import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { ViewerProps } from "../types/file.types";

// `?url` tells Vite to resolve this to a URL string (works in both dev and prod).
// This is the only approach guaranteed to work without a CDN or static-copy plugin.
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  
export const PdfViewer = ({ file }: ViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [error, setError] = useState<string | null>(null);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  }, []);

  const onLoadError = useCallback((err: Error) => {
    setError(err.message);
  }, []);

  if (error) {
    return (
      <div className="pdf-error">
        <span className="pdf-error-icon">⚠</span>
        <p>Failed to load PDF: {error}</p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar">
        <div className="pdf-nav">
          <button
            className="pdf-btn"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
          >←</button>
          <span className="pdf-page-info">
            {pageNumber} / {numPages || "—"}
          </span>
          <button
            className="pdf-btn"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
          >→</button>
        </div>
        <div className="pdf-zoom">
          <button className="pdf-btn" onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}>−</button>
          <span className="pdf-zoom-label">{Math.round(scale * 100)}%</span>
          <button className="pdf-btn" onClick={() => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)))}>+</button>
        </div>
      </div>

      <div className="pdf-canvas-wrap">
        <Document
          file={file.url}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={<div className="pdf-loading">Loading PDF…</div>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer
            renderTextLayer
          />
        </Document>
      </div>
    </div>
  );
};