import MobileWindowWrapper from "#hoc/MobileWindowWrapper";
import MobileWindowHeader from "#components/mobile/WindowHeader";
import { resumeFiles } from "#constants";
import useLanguageStore, { useTranslation } from "#store/language";
import { Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useRef, useLayoutEffect } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const MobileResumeContent = () => {
  const { language } = useLanguageStore();
  const t = useTranslation();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const { file, downloadName } = resumeFiles[language];

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial width
    updateWidth();

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <MobileWindowHeader windowKey="resume" title={t("Resume")} />

      <a
        href={file}
        download={downloadName}
        className="flex items-center justify-center gap-2 pb-3 text-sm text-blue-500"
      >
        <Download size={16} />
        {t("Download resume")}
      </a>

      <div ref={containerRef} className="w-full">
        <Document
          className="resume-pdf"
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={containerWidth || undefined}
              renderTextLayer
              renderAnnotationLayer
            />
          ))}
        </Document>
      </div>
    </>
  );
};

const MobileResume = MobileWindowWrapper(MobileResumeContent, "resume");

export default MobileResume;
