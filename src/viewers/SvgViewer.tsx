import { useState, useEffect } from "react";
import type { ViewerProps } from "../types/file.types";

export const SvgViewer = ({ file }: ViewerProps) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(file.url)
      .then((r) => r.text())
      .then(setSvgContent)
      .catch(() => setError("Failed to load SVG"));
  }, [file.url]);

  if (error) return <div className="viewer-error">{error}</div>;

  return (
    <div className="svg-viewer">
      <div
        className="svg-viewer__render"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      <div className="svg-viewer__source">
        <pre className="code-block">{svgContent}</pre>
      </div>
    </div>
  );
};