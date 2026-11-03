import { pdfjs } from "react-pdf";

const workerUrl = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// Descarga el visor y el CV en segundo plano para que abrirlo sea inmediato,
// salvo que el visitante haya pedido ahorrar datos
export const preloadResume = (file) => {
  if (navigator.connection?.saveData) return () => {};

  const preload = () => {
    [workerUrl, file].forEach((url) => fetch(url, { priority: "low" }).catch(() => {}));
  };

  // Safari no tiene requestIdleCallback
  if (!window.requestIdleCallback) {
    const timer = setTimeout(preload, 2000);
    return () => clearTimeout(timer);
  }

  const id = requestIdleCallback(preload, { timeout: 5000 });
  return () => cancelIdleCallback(id);
};
