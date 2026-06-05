export type FileCategory =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "office"
  | "text"
  | "code"
  | "csv"
  | "json"
  | "svg"
  | "archive"
  | "unknown";

export interface FileItem {
  id?: string | number;
  fileName: string;
  url: string;
  contentType?: string;
  size?: number;
}

export interface ViewerProps {
  file: FileItem;
}