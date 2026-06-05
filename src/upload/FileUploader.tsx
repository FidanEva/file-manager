import { useDropzone } from "react-dropzone";

interface Props {
  onChange: (files: File[]) => void;
}

export const FileUploader = ({ onChange }: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onChange,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "dropzone--active" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="dropzone__inner">
        <div className="dropzone__icon">
          {isDragActive ? "⬇" : "⬆"}
        </div>
        <p className="dropzone__label">
          {isDragActive ? "Drop files here" : "Drag & drop files, or click to browse"}
        </p>
        <p className="dropzone__hint">
          PDF · Images · Video · Audio · Office · Code · CSV · JSON · SVG · Archives
        </p>
      </div>
    </div>
  );
};