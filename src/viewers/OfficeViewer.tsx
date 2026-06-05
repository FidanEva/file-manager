import type { ViewerProps } from "../types/file.types";
import { getFileExtension } from "../utils/getFileExtension";
import { DocxViewer } from "./DocxViewer";
import { XlsxViewer } from "./XlsxViewer";
import { PptxFallbackViewer } from "./PptxFallbackViewer";

export const OfficeViewer = ({ file }: ViewerProps) => {
  const ext = getFileExtension(file.fileName);

  if (ext === "doc" || ext === "docx" || ext === "odt") {
    return <DocxViewer file={file} />;
  }

  if (ext === "xls" || ext === "xlsx" || ext === "ods" || ext === "csv" || ext === "tsv") {
    return <XlsxViewer file={file} />;
  }

  // PPT/PPTX — no viable in-browser renderer; offer Google Slides viewer
  return <PptxFallbackViewer file={file} />;
};