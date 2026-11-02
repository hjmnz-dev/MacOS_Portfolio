import { WindowControls } from "#components";
import { socials } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper"
import { useTranslation } from "#store/language";

const Contact = () => {
  const t = useTranslation();
  return <>
    <div id="window-header">
        <WindowControls target="contact"/>
        <h2>{t("Contact Me")}</h2>
    </div>

    <div className="p-5 space-y-5">
        <img src="/images/hamsell.jpg" alt="Hamsell Jiménez" className="w-20 rounded-full"/>
        <h3>{t("Let's Connect")}</h3>
        <p>{t("Got an idea? A bug to squash? Or just wanna talk tech? I'm in.")}</p>
        <p>hamselljimenez@gmail.com</p>

        <ul>{socials.map(({id,bg,link,icon,text}) => (
            <li key={id}
            style={{backgroundColor: bg}}>
                <a href={link} target="_blank" rel="noopener noreferrer" title={t(text)}>
                    <img src={icon} alt={t(text)} className="size-5"/>
                    <p>{t(text)}</p>
                </a>
            </li>
        )
        )}</ul>
    </div>
  </>
}

const ContactWindow = WindowWrapper(Contact,'contact')

export default ContactWindow;