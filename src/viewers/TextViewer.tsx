import { useState, useEffect } from "react";
import type { ViewerProps } from "../types/file.types";
import { getFileExtension } from "../utils/getFileExtension";

export const TextViewer = ({ file }: ViewerProps) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ext = getFileExtension(file.fileName);
  const isMarkdown = ext === "md" || ext === "markdown";

  useEffect(() => {
    setLoading(true);
    fetch(file.url)
      .then((r) => r.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load file");
        setLoading(false);
      });
  }, [file.url]);

  if (loading) return <div className="viewer-loading">Loading…</div>;
  if (error) return <div className="viewer-error">{error}</div>;

  return (
    <div className="text-viewer">
      {isMarkdown && (
        <div className="text-viewer__badge">MD</div>
      )}
      <pre className="text-viewer__pre">{content}</pre>
    </div>
  );
};