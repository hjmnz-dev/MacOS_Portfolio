import { WindowControls } from "#components";
import ErrorBoundary from "#components/ErrorBoundary";
import { resumeFiles } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper"
import useLanguageStore, { useTranslation } from "#store/language";
import useWindowStore from "#store/window";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import {Document, Page } from "react-pdf";
import "#lib/resume";

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

const Resume = () => {
  const { language } = useLanguageStore();
  const { isOpen, isMaximized } = useWindowStore((state) => state.windows.resume);
  // En pantalla completa el CV crece, hasta una anchura en la que aún se lea bien
  const pageWidth = isMaximized ? Math.min(window.innerWidth - 48, 960) : undefined;
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
      <Document className="resume-pdf" file={file} suspense={false} loading={t("Loading resume…")} error={t("The resume could not be loaded.")} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from({ length: numPages }, (_, i) => (
              <Page key={i} pageNumber={i + 1}
               width={pageWidth}
               renderTextLayer
                renderAnnotationLayer/>
          ))}
      </Document>
    </ErrorBoundary>}
  </>
}

const ResumeWindow = WindowWrapper(Resume, 'resume');

export default ResumeWindow;
