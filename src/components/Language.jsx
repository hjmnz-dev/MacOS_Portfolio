import { Languages } from "lucide-react";
import clsx from "clsx";
import useLanguageStore, { useTranslation } from "#store/language";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const LANGUAGES = [
  { id: "en", name: "English" },
  { id: "es", name: "Español" },
];

const Language = ({ size = 24 }) => {
  const { language, setLanguage } = useLanguageStore();
  const t = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("Change language")}
          title={t("Change language")}
          className="flex cursor-pointer select-none outline-0"
        >
          <Languages size={size} className="icon" />
        </button>
      </DropdownMenuTrigger>

      {/* Igual que en Theme: por encima de las ventanas y de la barra móvil */}
      <DropdownMenuContent className="w-fit z-100000">
        {LANGUAGES.map(({ id, name }) => (
          <DropdownMenuItem
            key={id}
            lang={id}
            onClick={() => setLanguage(id)}
            className={clsx(
              language === id && "bg-accent text-accent-foreground"
            )}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Language;
