import { useLayoutEffect, useState } from "react";
import { Laptop, MoonIcon, SunIcon } from "lucide-react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTranslation } from "#store/language";

const Theme = () => {
  const t = useTranslation();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system"
  );

  // useLayoutEffect evita que se vea un destello claro antes de aplicar el tema
  useLayoutEffect(() => {
    const root = document.documentElement;

    if (theme !== "system") {
      localStorage.setItem("theme", theme);
      root.classList.toggle("dark", theme === "dark");
      return;
    }

    localStorage.removeItem("theme");

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applySystemTheme = () => root.classList.toggle("dark", media.matches);

    applySystemTheme();
    media.addEventListener("change", applySystemTheme);

    return () => media.removeEventListener("change", applySystemTheme);
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("Change theme")}
          className="cursor-pointer mt-1.5 select-none outline-0"
        >
          <img src="/icons/mode.svg" alt="" className="icon dark:invert" />
        </button>
      </DropdownMenuTrigger>

      {/* Las ventanas empiezan en z-index 1000: el menú debe quedar por encima */}
      <DropdownMenuContent className="w-fit z-100000">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={clsx(
            theme === "light" && "bg-accent text-accent-foreground"
          )}
        >
          <SunIcon className="mr-2" fill={theme === "light" ? "#ffc030" : ""} />
          {t("Light")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={clsx(
            theme === "dark" && "bg-accent text-accent-foreground"
          )}
        >
          <MoonIcon
            className="mr-2"
            fill={theme === "dark" ? "#ff6157" : "transparent"}
          />
          {t("Dark")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={clsx(
            theme === "system" && "bg-accent text-accent-foreground"
          )}
        >
          <Laptop className="mr-2" />
          {t("System")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Theme;
