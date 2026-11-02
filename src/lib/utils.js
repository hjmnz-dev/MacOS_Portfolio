import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Misma regla que las variantes sm y max-sm de index.css
export const isMobileViewport = () =>
  window.matchMedia("(width < 40rem), (height <= 31.25rem)").matches;

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
