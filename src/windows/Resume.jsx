import { WindowControls } from "#components";
import ErrorBoundary from "#components/ErrorBoundary";
import { resumeFiles } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper"
import useLanguageStore, { useTranslation } from "#store/language";
import useWindowStore from "#store/window";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import {Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString()

const Resume = () => {
  const { language } = useLanguageStore();
  const isOpen = useWindowStore((state) => state.windows.resume.isOpen);
  const t = useTranslation();
  const [numPages, setNumPages] = useState(0);
  const { file, downloadName } = resumeFiles[language];

  return <>
    <div id="window-header">
        <WindowControls target="resume"/>
        <h2>Resume.pdf</h2>
        <a href={file} download={downloadName} className="cursor-pointer" title={t("Download resume")}>
            <DownloadIcon className="icon"/>
        </a>
    </div>
    {/* El visor solo existe con la ventana abierta: al cargar la página no se pide el PDF */}
    {isOpen && <ErrorBoundary key={file} fallback={<p className="p-10 text-center text-black dark:text-white">{t("The resume could not be loaded.")}</p>}>
      <Document className="resume-pdf" file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from({ length: numPages }, (_, i) => (
              <Page key={i} pageNumber={i + 1}
               renderTextLayer
                renderAnnotationLayer/>
          ))}
      </Document>
    </ErrorBoundary>}
  </>
}

const ResumeWindow = WindowWrapper(Resume, 'resume');

export default ResumeWindow;
