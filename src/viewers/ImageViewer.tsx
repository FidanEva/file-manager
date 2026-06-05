import { useState } from "react";
import type { ViewerProps } from "../types/file.types";

export const ImageViewer = ({ file }: ViewerProps) => {
  const [zoom, setZoom] = useState(false);

  return (
    <div className={`image-viewer ${zoom ? "image-viewer--zoomed" : ""}`}>
      <img
        src={file.url}
        alt={file.fileName}
        className="image-viewer__img"
        onClick={() => setZoom((z) => !z)}
        title={zoom ? "Click to zoom out" : "Click to zoom in"}
      />
      {zoom && (
        <div className="image-viewer__overlay" onClick={() => setZoom(false)}>
          <img src={file.url} alt={file.fileName} className="image-viewer__full" />
        </div>
      )}
    </div>
  );
};