import { dockApps } from "#constants";
import { Tooltip } from "react-tooltip";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/window";
import useMusicStore from "#store/music";
import clsx from "clsx";
import { useTranslation } from "#store/language";

const Dock = () => {
  const t = useTranslation();
    const {openWindow,restoreWindow,focusWindow,windows}=useWindowStore();
    const isMusicPlaying = useMusicStore((state) => state.isPlaying);
    const dockRef = useRef(null);

    useGSAP(()=>{
        const dock = dockRef.current;
        if(!dock) return;

        const icons = dock.querySelectorAll(".dock-icon");

        const animateIcons = (mouseX) => {
            const {left} = dock.getBoundingClientRect();

            icons.forEach((icon) => {
                const {left: iconLeft, width} = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 2.5) / 20000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    duration: 0.2,
                    ease: "power1.out"

                })
            });
        }

        const handleMouseMove = (e) => {
            const {left} = dock.getBoundingClientRect();
            animateIcons(e.clientX - left)
        }

        const resetIcons = () => icons.forEach((icon) =>
            gsap.to(icon, {
                scale: 1,
                y:0,
                duration:0.3,
                ease: "power1.out"
            })
        )

        dock.addEventListener('mousemove',handleMouseMove)
        dock.addEventListener('mouseleave',resetIcons)

        return () => {
           dock.removeEventListener('mousemove',handleMouseMove)
            dock.removeEventListener('mouseleave',resetIcons) 
        }

    },[])


    const toggleApp = (app) => {
        if(!app.canOpen) return;

        const window = windows[app.id];

        // Como en macOS: abre, recupera si está minimizada o la trae al frente
        if(!window.isOpen){
            openWindow(app.id);
        }else if(window.isMinimized){
            restoreWindow(app.id);
        }else{
            focusWindow(app.id);
        }

    }

  return <section id="dock">
    <div ref={dockRef} className="dock-container">
        {dockApps.map(({id, name, icon, canOpen, showOnMobile}) => (
            <div key={id} className={clsx("relative flex justify-center", !showOnMobile && "max-sm:hidden")}>
                <button type="button"
                className="dock-icon"
                aria-label={t(name)}
                data-tooltip-id="dock-tooltip"
                data-tooltip-content={t(name)}
                data-tooltip-delay-show={150}
                disabled={!canOpen}
                onClick={(e) => {
                    toggleApp({id,canOpen});
                    // e.detail es 0 con teclado: solo quitamos el foco en clics de ratón
                    if(e.detail > 0) e.currentTarget.blur();
                }}>
                    <img src={`/images/${icon}`}
                     alt={t(name)}
                     loading="lazy"
                     className={canOpen ? '':'opacity-60'}/>
                </button>
                {/* Punto bajo las apps abiertas; la música también sigue sonando con la ventana cerrada */}
                {(windows[id]?.isOpen || (id === "music" && isMusicPlaying)) && <span className="absolute -bottom-1 size-1 rounded-full bg-white"/>}
            </div>
        ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip"/>
    </div>
  </section>
}

export default Dock