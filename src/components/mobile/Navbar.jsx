import dayjs from "dayjs";
import { Battery, Wifi } from "lucide-react";
import clsx from "clsx";
import useWindowStore from "#store/window";
import Language from "#components/Language";

const MobileNavbar = () => {
  const { windows } = useWindowStore();
  // El wallpaper y el reproductor siempre son oscuros: ahí la barra va en blanco
  const openWindows = Object.entries(windows).filter(([, win]) => win.isOpen);
  const [topWindow] = openWindows.reduce(
    (top, entry) => (entry[1].zIndex > top[1].zIndex ? entry : top),
    openWindows[0] ?? []
  );
  const isOverDark = !topWindow || topWindow === "music";

  return (
    <section
      id="mobile-navbar"
      className={clsx(
        "flex justify-between items-center py-3 short:py-1 px-5 gap-5 sm:hidden relative z-10000",
        isOverDark && "text-white"
      )}
    >
      <time>{dayjs().format("h:mm A")}</time>

      <div className="bg-black short:bg-transparent flex-1 rounded-full px-2 py-5 short:py-0"></div>

      <ul className="flex items-center gap-2">
        <li>
          <Wifi size={26} className="icon" />
        </li>
        <li>
          <Battery size={26} className="icon" />
        </li>
        <li>
          <Language size={26} />
        </li>
      </ul>
    </section>
  );
};

export default MobileNavbar;
