import type { ViewerProps } from "../types/file.types";

export const UnsupportedViewer = ({ file }: ViewerProps) => {
  return (
    <div className="unsupported-viewer">
      <div className="unsupported-viewer__icon">?</div>
      <p className="unsupported-viewer__name">{file.fileName}</p>
      <p className="unsupported-viewer__note">
        No preview available for this file type.
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