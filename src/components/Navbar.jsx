import dayjs from "dayjs"
import "dayjs/locale/es"

import { navLinks,navIcons } from "#constants"
import useWindowStore from "#store/window"
import Theme from "#components/Theme"
import Language from "#components/Language"
import useLanguageStore, { useTranslation } from "#store/language"

const Navbar = () => {

    const {openWindow} = useWindowStore();
    const {language} = useLanguageStore();
    const t = useTranslation();

    return (
        <nav>
            <div>
                <img src="/images/logo.svg" className="dark:invert" alt="logo" />
                <p className="font-bold">{t("Hamsell's Portfolio")}</p>

                <ul>
                    {navLinks.map(({id,name, type})=>(
                        <li key={id}>
                            <button type="button" onClick={()=>openWindow(type)}>{t(name)}</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <ul>
                    {navIcons.map(({id,img})=> (
                        <li key={id}>
                            {id === 4 ? <Theme/> : (
                                <img src={img} className="icon dark:invert dark:hover:bg-dark-500!" alt={`icon-${id}`} />
                            )}
                        </li>
                    ))}
                    <li><Language/></li>
                </ul>

                <time>{dayjs().locale(language).format(t('ddd MMMM D h:mm A'))}</time>
            </div>
        </nav>

    )
}

export default Navbar
