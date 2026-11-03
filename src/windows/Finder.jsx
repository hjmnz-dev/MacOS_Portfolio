import { WindowControls } from '#components'
import { locations } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import clsx from 'clsx'
import { Search } from 'lucide-react'
import React from 'react'
import { useTranslation } from "#store/language";

const Finder = () => {
  const t = useTranslation();

    const {openWindow} = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();
    // Solo las carpetas principales (las que tienen type) siguen el idioma; proyectos y archivos no
    const itemName = (item) => item.type ? t(item.name) : item.name;
    const openItem = (item)=>{
        if(item.fileType === 'pdf') return openWindow('resume');
        if(item.kind==='folder') return setActiveLocation(item);
        // Los proyectos aún no tienen enlace: sin href, estos archivos no abren nada
        if(['fig','url'].includes(item.fileType)) return item.href && window.open(item.href, "_blank", "noopener,noreferrer")

        openWindow(`${item.fileType}${item.kind}`, item)
    }
    const renderList = (name, items) => (
        <div>
            <h3>{t(name)}</h3>
            <ul>
                {items.map((item) => (
                    <li key={item.id} onClick={() => setActiveLocation(item)} className={clsx(item.id == activeLocation.id ? 'active' : 'not-active')}>
                        <img src={item.icon} className='w-4' alt={itemName(item)} />
                        <p className='text-sm font-medium truncate' title={itemName(item)}>{itemName(item)}</p>
                    </li>))}
            </ul>
        </div>
    )

    return <>
        <div id='window-header'>
            <WindowControls target="finder" />
            <Search className='icon' />
        </div>

        <div className='bg-white flex h-full'>
            <div className='sidebar'>
                {renderList("Favorites", Object.values(locations))}
                {renderList("My projects", locations.work.children)}
            </div>
            <ul className='content'>
            {activeLocation?.children.map((item) => (
                <li key={item.id} onClick={() => openItem(item)}>
                    <img src={item.icon} alt={item.name}/>
                    <p>{item.name}</p>
                </li>
            ))}
        </ul>
        </div>
        
    </>
}

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;