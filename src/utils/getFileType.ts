import type { FileCategory } from "../types/file.types";
import { getFileExtension } from "./getFileExtension";

const EXT_MAP: Record<string, FileCategory> = {
  // PDF
  pdf: "pdf",

  // Images
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  bmp: "image",
  tiff: "image",
  tif: "image",
  avif: "image",
  ico: "image",
  heic: "image",
  heif: "image",

  // SVG (separate — rendered as inline SVG for safety/quality)
  svg: "svg",

  // Video
  mp4: "video",
  webm: "video",
  mov: "video",
  avi: "video",
  mkv: "video",
  ogv: "video",
  "3gp": "video",

  // Audio
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  flac: "audio",
  aac: "audio",
  m4a: "audio",
  opus: "audio",

  // Office
  doc: "office",
  docx: "office",
  xls: "office",
  xlsx: "office",
  ppt: "office",
  pptx: "office",
  odt: "office",
  ods: "office",
  odp: "office",

  // CSV
  csv: "csv",
  tsv: "csv",

  // JSON
  json: "json",
  jsonc: "json",

  // Plain text
  txt: "text",
  md: "text",
  markdown: "text",
  rtf: "text",
  log: "text",
  env: "text",

  // Code
  js: "code",
  jsx: "code",
  ts: "code",
  tsx: "code",
  html: "code",
  htm: "code",
  css: "code",
  scss: "code",
  less: "code",
  py: "code",
  rb: "code",
  java: "code",
  c: "code",
  cpp: "code",
  cs: "code",
  go: "code",
  rs: "code",
  php: "code",
  swift: "code",
  kt: "code",
  sh: "code",
  bash: "code",
  yaml: "code",
  yml: "code",
  toml: "code",
  xml: "code",
  sql: "code",
  graphql: "code",
  gql: "code",

  // Archives
  zip: "archive",
  tar: "archive",
  gz: "archive",
  rar: "archive",
  "7z": "archive",
  bz2: "archive",
};

export const getFileType = (fileName: string): FileCategory => {
  const ext = getFileExtension(fileName);
  return EXT_MAP[ext] ?? "unknown";
};

export const getLanguageFromExt = (fileName: string): string => {
  const ext = getFileExtension(fileName);
  const LANG_MAP: Record<string, string> = {
    js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
    py: "python", rb: "ruby", java: "java", c: "c", cpp: "cpp",
    cs: "csharp", go: "go", rs: "rust", php: "php", swift: "swift",
    kt: "kotlin", sh: "bash", bash: "bash", html: "html", htm: "html",
    css: "css", scss: "scss", less: "less", xml: "xml", yaml: "yaml",
    yml: "yaml", toml: "toml", sql: "sql", graphql: "graphql",
    gql: "graphql", json: "json", md: "markdown", markdown: "markdown",
  };
  return LANG_MAP[ext] ?? "plaintext";
};