import { WindowControls } from "#components";
import { resumeFiles } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper"
import useLanguageStore, { useTranslation } from "#store/language";
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
    <Document className="resume-pdf" file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        {Array.from({ length: numPages }, (_, i) => (
            <Page key={i} pageNumber={i + 1}
             renderTextLayer
              renderAnnotationLayer/>
        ))}
    </Document>
  </>
}

const ResumeWindow = WindowWrapper(Resume, 'resume');

export default ResumeWindow;
