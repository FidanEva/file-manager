"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FileUploader } from "../upload/FileUploader";
import { FilePreview } from "../preview/FilePreview";
import { getFileType } from "../utils/getFileType";
import { formatFileSize } from "../utils/formatFileSize";
import { getFileExtension } from "../utils/getFileExtension";

interface PreviewFile {
  id: string;
  file: File;
  fileName: string;
  url: string;
  size: number;
  contentType: string;
  previewOpen: boolean;
}

type ViewMode = "list" | "grid";

const TYPE_COLORS: Record<string, string> = {
  pdf: "#e05c5c",
  image: "#5c9ee0",
  video: "#9b5ce0",
  audio: "#e05cb8",
  office: "#5ce0a0",
  text: "#c8c8c8",
  code: "#e0a05c",
  csv: "#5cd4e0",
  json: "#e0d45c",
  svg: "#5ce08a",
  archive: "#a0a0a0",
  unknown: "#666",
};

const TYPE_ICONS: Record<string, string> = {
  pdf: "PDF",
  image: "IMG",
  video: "VID",
  audio: "AUD",
  office: "DOC",
  text: "TXT",
  code: "COD",
  csv: "CSV",
  json: "JSON",
  svg: "SVG",
  archive: "ZIP",
  unknown: "?",
};

function FileBadge({ fileName }: { fileName: string }) {
  const type = getFileType(fileName);
  const color = TYPE_COLORS[type] ?? TYPE_COLORS.unknown;
  const label = TYPE_ICONS[type] ?? "?";
  return (
    <span className="file-badge" style={{ "--badge-color": color } as React.CSSProperties}>
      {label}
    </span>
  );
}

function FileCard({ file, onRemove, onTogglePreview }: {
  file: PreviewFile;
  onRemove: (id: string) => void;
  onTogglePreview: (id: string) => void;
}) {
  return (
    <div className={`file-card ${file.previewOpen ? "file-card--open" : ""}`}>
      <div className="file-card__header">
        <FileBadge fileName={file.fileName} />
        <div className="file-card__info">
          <span className="file-card__name" title={file.fileName}>
            {file.fileName}
          </span>
          <span className="file-card__meta">
            {formatFileSize(file.size)} · .{getFileExtension(file.fileName)}
          </span>
        </div>
        <div className="file-card__actions">
          <button
            className={`file-card__btn file-card__btn--preview ${file.previewOpen ? "active" : ""}`}
            onClick={() => onTogglePreview(file.id)}
            title={file.previewOpen ? "Collapse preview" : "Expand preview"}
          >
            {file.previewOpen ? "▲" : "▼"}
          </button>
          <a
            className="file-card__btn"
            href={file.url}
            download={file.fileName}
            title="Download"
          >
            ↓
          </a>
          <button
            className="file-card__btn file-card__btn--remove"
            onClick={() => onRemove(file.id)}
            title="Remove"
          >
            ✕
          </button>
        </div>
      </div>

      {file.previewOpen && (
        <div className="file-card__preview">
          <FilePreview
            file={{
              fileName: file.fileName,
              url: file.url,
              size: file.size,
              contentType: file.contentType,
            }}
          />
        </div>
      )}
    </div>
  );
}

function FileGridCard({ file, onRemove, onTogglePreview }: {
  file: PreviewFile;
  onRemove: (id: string) => void;
  onTogglePreview: (id: string) => void;
}) {
  const type = getFileType(file.fileName);
  const color = TYPE_COLORS[type] ?? TYPE_COLORS.unknown;

  return (
    <div className="file-grid-card">
      <div
        className="file-grid-card__thumb"
        style={{ "--thumb-color": color } as React.CSSProperties}
        onClick={() => onTogglePreview(file.id)}
      >
        {type === "image" ? (
          <img src={file.url} alt={file.fileName} className="file-grid-card__img" />
        ) : type === "video" ? (
          <video src={file.url} className="file-grid-card__img" muted />
        ) : (
          <span className="file-grid-card__icon">{TYPE_ICONS[type] ?? "?"}</span>
        )}
        <div className="file-grid-card__overlay">
          <span>Preview</span>
        </div>
      </div>
      <div className="file-grid-card__footer">
        <span className="file-grid-card__name" title={file.fileName}>
          {file.fileName}
        </span>
        <span className="file-grid-card__size">{formatFileSize(file.size)}</span>
        <div className="file-grid-card__actions">
          <a href={file.url} download={file.fileName} className="file-grid-card__btn" title="Download">↓</a>
          <button className="file-grid-card__btn file-grid-card__btn--remove" onClick={() => onRemove(file.id)} title="Remove">✕</button>
        </div>
      </div>
    </div>
  );
}

export default function MultiFileTestPage() {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeModal, setActiveModal] = useState<PreviewFile | null>(null);
  const urlsRef = useRef<Set<string>>(new Set());

  const handleFiles = useCallback((uploadedFiles: File[]) => {
    const mappedFiles: PreviewFile[] = uploadedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      urlsRef.current.add(url);
      return {
        id: crypto.randomUUID(),
        file,
        fileName: file.name,
        url,
        size: file.size,
        contentType: file.type,
        previewOpen: false,
      };
    });
    setFiles((prev) => [...prev, ...mappedFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const f = prev.find((f) => f.id === id);
      if (f) {
        URL.revokeObjectURL(f.url);
        urlsRef.current.delete(f.url);
      }
      return prev.filter((f) => f.id !== id);
    });
    setActiveModal((m) => (m?.id === id ? null : m));
  }, []);

  const togglePreview = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, previewOpen: !f.previewOpen } : f
      )
    );
  }, []);

  const openModal = useCallback((file: PreviewFile) => {
    setActiveModal(file);
  }, []);

  const clearAll = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => {
        URL.revokeObjectURL(f.url);
        urlsRef.current.delete(f.url);
      });
      return [];
    });
    setActiveModal(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <div className="app">
        {/* Header */}
        <header className="app-header">
          <div className="app-header__logo">
            <span className="app-header__logo-icon">◈</span>
            <span className="app-header__logo-text">FileVault</span>
          </div>
          <p className="app-header__tagline">
            Upload · Preview · Inspect
          </p>
        </header>

        {/* Upload zone */}
        <section className="app-upload">
          <FileUploader onChange={handleFiles} />
        </section>

        {/* File list */}
        {files.length > 0 && (
          <section className="app-files">
            <div className="app-files__toolbar">
              <div className="app-files__count">
                <span className="app-files__count-num">{files.length}</span>
                <span className="app-files__count-label">
                  {files.length === 1 ? "file" : "files"}
                </span>
              </div>
              <div className="app-files__controls">
                <button
                  className={`toolbar-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  ≡
                </button>
                <button
                  className={`toolbar-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  ⊞
                </button>
                <button
                  className="toolbar-btn toolbar-btn--danger"
                  onClick={clearAll}
                  title="Clear all"
                >
                  Clear all
                </button>
              </div>
            </div>

            {viewMode === "list" ? (
              <div className="files-list">
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onRemove={removeFile}
                    onTogglePreview={togglePreview}
                  />
                ))}
              </div>
            ) : (
              <div className="files-grid">
                {files.map((file) => (
                  <FileGridCard
                    key={file.id}
                    file={file}
                    onRemove={removeFile}
                    onTogglePreview={(id) => {
                      const f = files.find((x) => x.id === id);
                      if (f) openModal(f);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Empty state */}
        {files.length === 0 && (
          <div className="app-empty">
            <div className="app-empty__icon">◈</div>
            <p className="app-empty__text">No files uploaded yet</p>
            <p className="app-empty__sub">Drop any file above to preview it instantly</p>
          </div>
        )}
      </div>

      {/* Modal overlay for grid view */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div className="modal__title">
                <FileBadge fileName={activeModal.fileName} />
                <span>{activeModal.fileName}</span>
              </div>
              <button className="modal__close" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="modal__body">
              <FilePreview
                file={{
                  fileName: activeModal.fileName,
                  url: activeModal.url,
                  size: activeModal.size,
                  contentType: activeModal.contentType,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}