import type { ViewerProps } from "../types/file.types";

// PowerPoint files cannot be parsed in the browser without a server-side
// conversion step. The best UX is to offer a download and explain why.
export const PptxFallbackViewer = ({ file }: ViewerProps) => {
  return (
    <div className="unsupported-viewer">
      <div className="unsupported-viewer__icon">◱</div>
      <p className="unsupported-viewer__name">{file.fileName}</p>
      <p className="unsupported-viewer__note">
        PowerPoint files require server-side conversion and cannot be previewed
        directly in the browser.
      </p>
      <a
        href={file.url}
        download={file.fileName}
        className="unsupported-viewer__download"
      >
        Download File
      </a>
    </div>
  );
};