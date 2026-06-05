import { useState, useEffect } from "react";
import hljs from "highlight.js";
import type { ViewerProps } from "../types/file.types";
import { getLanguageFromExt } from "../utils/getFileType";

export const CodeViewer = ({ file }: ViewerProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const lang = getLanguageFromExt(file.fileName);

  useEffect(() => {
    setLoading(true);

    fetch(file.url)
      .then((r) => r.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      });
  }, [file.url]);

  const highlighted = hljs.highlight(content, {
    language: lang || "plaintext",
  }).value;

  const lineCount = content.split("\n").length;

  if (loading) return <div>Loading…</div>;

  return (
    <div className="code-viewer">
      <div className="code-viewer__toolbar">
        <span>{lang}</span>
        <span>{lineCount} lines</span>
      </div>

      <div className="code-viewer__scroll">
        <div className="code-viewer__gutter">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>

        <pre className="code-viewer__pre">
          <code
            dangerouslySetInnerHTML={{
              __html: highlighted,
            }}
          />
        </pre>
      </div>
    </div>
  );
};