import { es } from "#constants/translations";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const STORAGE_KEY = "language";

// Sin una elección guardada se usa el idioma del navegador
const getInitialLanguage = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;

    return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

const translate = (language, text) => language === "es" ? es[text] ?? text : text;

const applyToDocument = (language) => {
    document.documentElement.lang = language;
    document.title = translate(language, "Hamsell's Portfolio");
}

const initialLanguage = getInitialLanguage();
applyToDocument(initialLanguage);

const useLanguageStore = create(immer((set)=>({
    language: initialLanguage,

    setLanguage: (language) => set((state) => {
        state.language = language;
        localStorage.setItem(STORAGE_KEY, language);
        applyToDocument(language);
    }),
})))

export const useTranslation = () => {
    const language = useLanguageStore((state) => state.language);

    return (text) => translate(language, text);
}

export default useLanguageStore;
