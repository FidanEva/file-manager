# FileVault - React File Previewer

FileVault is a comprehensive, in-browser file previewer built with React, TypeScript, and Vite. It allows users to upload multiple files via drag-and-drop and instantly view their contents without needing any server-side processing. It features a clean, modern UI with both list and grid views, and supports a wide array of file formats.

## Key Features

- **Drag-and-Drop Uploader:** An intuitive interface for uploading one or more files.
- **Dual View Modes:** Switch between a detailed list view with inline previews and a compact grid view with modal previews.
- **Extensive File Support:** Preview a wide variety of file types directly in the browser:
  - **Documents:**
    - **PDF:** Complete with page navigation and zoom controls (`react-pdf`).
    - **DOCX:** Renders `.docx` files as HTML (`mammoth.js`).
    - **XLSX / ODS:** Displays spreadsheet data in a paginated table view with support for multiple sheets (`xlsx`).
    - **PPTX / Legacy Office:** Provides a user-friendly fallback with download options.
  - **Images:** Native rendering for formats like PNG, JPG, GIF, WebP, with a zoom-in/out feature.
  - **Media:**
    - **Video:** Playback for MP4, WebM, MOV, and other browser-supported formats.
    - **Audio:** An embedded player for MP3, WAV, OGG, and more.
  - **Data & Code:**
    - **CSV / TSV:** Renders data in a paginated table.
    - **JSON:** Displays data in an interactive, collapsible tree view.
    - **Code:** Syntax highlighting for numerous languages (JS, Python, TS, CSS, etc.) with line numbers (`highlight.js`).
    - **SVG:** Shows both the rendered graphic and its underlying source code side-by-side.
  - **Archives:** Recognizes ZIP, RAR, 7z, etc., and provides a download prompt.
- **Client-Side Processing:** All file parsing and rendering happen directly in the user's browser for privacy and speed.

## Technology Stack

- **Frontend:** React, TypeScript
- **Build Tool:** Vite
- **File Handling & Previewing:**
  - `react-dropzone`: For the drag-and-drop upload functionality.
  - `react-pdf`: For rendering PDF documents.
  - `mammoth`: For converting `.docx` files to HTML.
  - `xlsx`: For parsing and reading spreadsheet files.
  - `highlight.js`: For code syntax highlighting.
- **Styling:** Plain CSS with Custom Properties for easy theming.

## Project Structure

The project is organized to separate concerns, making it easy to extend and maintain.

```
src/
├── pages/          # Main application page component.
├── upload/         # FileUploader component using react-dropzone.
├── preview/        # FilePreview component that routes to the correct viewer.
├── viewers/        # Individual components for rendering each file type (e.g., PdfViewer, CsvViewer).
├── utils/          # Helper functions (file type detection, size formatting).
├── types/          # Shared TypeScript type definitions.
├── App.css         # All application styles.
└── main.tsx        # Application entry point.
```

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/FidanEva/file-manager.git
    cd file-manager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Available Scripts

-   `npm run dev`: Starts the Vite development server with Hot Module Replacement.
-   `npm run build`: Compiles and bundles the application for production.
-   `npm run lint`: Lints the TypeScript and TSX files.
-   `npm run preview`: Serves the production build locally to preview it.
