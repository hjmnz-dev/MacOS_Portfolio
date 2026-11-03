import { ChevronLeft } from "lucide-react";
import useWindowStore from "#store/window";
import clsx from "clsx";
import { useTranslation } from "#store/language";

const MobileWindowHeader = ({ windowKey, title, onBack, className = "" }) => {
  const t = useTranslation();
  const { closeWindow } = useWindowStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      closeWindow(windowKey);
    }
  };

  return (
    <div
      id="mobile-window-header"
      className={clsx(
        // Fija bajo la barra de estado para que "Volver" siga a mano al desplazarse.
        // El tope se mide desde el relleno de la ventana (pt-20 o pt-13): el valor negativo lo sube hasta la barra
        "flex justify-between items-center gap-5 px-3 sticky -top-4 short:-top-4.5 z-10 bg-inherit",
        className
      )}
    >
      <div
        className="flex-1 flex items-center gap-2 min-h-12 cursor-pointer"
        onClick={handleBack}
      >
        <ChevronLeft className="icon" />
        <p className="text-sm text-blue-500">{t("Go Back")}</p>
      </div>

      <p className="flex-[1.5] text-lg font-georama text-black dark:text-white line-clamp-1">
        {title}
      </p>
    </div>
  );
};

export default MobileWindowHeader;
