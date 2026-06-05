import type { ViewerProps } from "../types/file.types";
import { getFileExtension } from "../utils/getFileExtension";

// Browsers need the correct MIME type to decode the container.
// MOV files are QuickTime — Safari plays them natively; Chrome/Firefox
// need `video/mp4` as the MIME since most .mov files use H.264/AAC.
const MIME_MAP: Record<string, string> = {
  mp4:  "video/mp4",
  webm: "video/webm",
  ogv:  "video/ogg",
  ogg:  "video/ogg",
  mov:  "video/mp4",   // QuickTime container; H.264 inside — treated as mp4
  "3gp": "video/3gpp",
  mkv:  "video/x-matroska",
  avi:  "video/x-msvideo",
};

export const VideoViewer = ({ file }: ViewerProps) => {
  const ext = getFileExtension(file.fileName);
  const mimeType = MIME_MAP[ext] ?? file.contentType ?? "video/mp4";

  return (
    <div className="video-viewer">
      <video
        controls
        className="video-viewer__el"
        preload="metadata"
        // Re-mount the element when the source changes so the browser
        // re-reads the src and doesn't cache the previous blob URL.
        key={file.url}
      >
        <source src={file.url} type={mimeType} />
        Your browser does not support video playback.
      </video>
    </div>
  );
};