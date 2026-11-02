import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { linkedInFeed } from "#constants";
import useWindowStore from "#store/window";
import { useTranslation } from "#store/language";

const { elfsightWidgetId, elfsightScriptUrl, profileUrl } = linkedInFeed;

const LinkedInFeed = () => {
  const t = useTranslation();
  const isOpen = useWindowStore((state) => state.windows.safari.isOpen);
  // El plan de Elfsight cuenta vistas: el widget se carga solo si alguien abre la ventana
  const [wasOpened, setWasOpened] = useState(false);

  if (isOpen && !wasOpened) setWasOpened(true);

  const showWidget = Boolean(elfsightWidgetId) && wasOpened;

  useEffect(() => {
    if (!showWidget || document.querySelector(`script[src="${elfsightScriptUrl}"]`)) return;

    const script = document.createElement("script");
    script.src = elfsightScriptUrl;
    script.async = true;
    document.body.appendChild(script);
  }, [showWidget]);

  return (
    <div className="linkedin-feed">
      {showWidget && (
        <div className={`elfsight-app-${elfsightWidgetId}`} data-elfsight-app-lazy />
      )}

      {/* Siempre visible: es la salida si el widget no carga o agota sus vistas */}
      <a href={profileUrl} target="_blank" rel="noopener noreferrer">
        {t("See all my posts on LinkedIn")}
        <ExternalLink size={16} />
      </a>
    </div>
  );
};

export default LinkedInFeed;
