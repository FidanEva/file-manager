import { getFileType } from "../utils/getFileType";
import { PdfViewer } from "../viewers/PdfViewer";
import { ImageViewer } from "../viewers/ImageViewer";
import { SvgViewer } from "../viewers/SvgViewer";
import { VideoViewer } from "../viewers/VideoViewer";
import { AudioViewer } from "../viewers/AudioViewer";
import { TextViewer } from "../viewers/TextViewer";
import { CodeViewer } from "../viewers/CodeViewer";
import { CsvViewer } from "../viewers/CsvViewer";
import { JsonViewer } from "../viewers/JsonViewer";
import { OfficeViewer } from "../viewers/OfficeViewer";
import { ArchiveViewer } from "../viewers/ArchiveViewer";
import { UnsupportedViewer } from "../viewers/UnsupportedViewer";
import type { FileItem } from "../types/file.types";

interface Props {
  file: FileItem;
}

export const FilePreview = ({ file }: Props) => {
  const type = getFileType(file.fileName);

  switch (type) {
    case "pdf":     return <PdfViewer file={file} />;
    case "image":   return <ImageViewer file={file} />;
    case "svg":     return <SvgViewer file={file} />;
    case "video":   return <VideoViewer file={file} />;
    case "audio":   return <AudioViewer file={file} />;
    case "text":    return <TextViewer file={file} />;
    case "code":    return <CodeViewer file={file} />;
    case "json":    return <JsonViewer file={file} />;
    case "csv":     return <CsvViewer file={file} />;
    case "office":  return <OfficeViewer file={file} />;
    case "archive": return <ArchiveViewer file={file} />;
    default:        return <UnsupportedViewer file={file} />;
  }
};