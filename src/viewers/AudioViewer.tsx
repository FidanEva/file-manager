import type { ViewerProps } from "../types/file.types";

export const AudioViewer = ({ file }: ViewerProps) => {
  return (
    <div className="audio-viewer">
      <div className="audio-viewer__icon">♪</div>
      <p className="audio-viewer__name">{file.fileName}</p>
      <audio controls className="audio-viewer__el">
        <source src={file.url} type={file.contentType} />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
};