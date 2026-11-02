import useWindowStore from "#store/window";
import { useTranslation } from "#store/language";

const MobileHome = () => {
  const t = useTranslation();
  const { openWindow } = useWindowStore();

  return (
    <section id="mobile-home">
      <ul>
        <li onClick={() => openWindow("resume")}>
          <img src="/images/pages.png" alt={t("Resume")} />
        </li>
        <li onClick={() => openWindow("terminal")}>
          <img src="/images/terminal.png" alt="terminal" />
        </li>
      </ul>
    </section>
  );
};

export default MobileHome;
