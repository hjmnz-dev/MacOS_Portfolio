import { socials } from "#constants";
import MobileWindowWrapper from "#hoc/MobileWindowWrapper";
import MobileWindowHeader from "#components/mobile/WindowHeader";
import { useTranslation } from "#store/language";

const MobileContactContent = () => {
  const t = useTranslation();
  return (
    <>
      <MobileWindowHeader windowKey="contact" title={t("Contact")} />

      <div className="content">
        <img
          src="/images/hamsell.jpg"
          alt="Hamsell Jiménez"
          className="w-20 rounded-full"
        />

        <h3>{t("Let's Connect")}</h3>
        <p>{t("Got an idea? A bug to squash? Or just wanna talk tech? I'm in.")}</p>
        <p>hamselljimenez@gmail.com</p>

        <ul>
          {socials.map(({ id, bg, link, icon, text }) => (
            <li key={id} style={{ backgroundColor: bg }}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={t(text)}
              >
                <img src={icon} alt={t(text)} className="size-5" />
                <p>{t(text)}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const MobileContact = MobileWindowWrapper(MobileContactContent, "contact");

export default MobileContact;
