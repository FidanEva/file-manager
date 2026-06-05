import type { ViewerProps } from "../types/file.types";
import { formatFileSize } from "../utils/formatFileSize";

export const ArchiveViewer = ({ file }: ViewerProps) => {
  return (
    <div className="archive-viewer">
      <div className="archive-viewer__icon">⬡</div>
      <p className="archive-viewer__name">{file.fileName}</p>
      {file.size !== undefined && (
        <p className="archive-viewer__size">{formatFileSize(file.size)}</p>
      )}
      <p className="archive-viewer__note">
        Archive files cannot be previewed in the browser.
      </p>
      <a
        href={file.url}
        download={file.fileName}
        className="archive-viewer__download"
      >
        Download File
      </a>
    </div>
  );
};