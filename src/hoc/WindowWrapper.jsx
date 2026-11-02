import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap';
import { Draggable } from 'gsap/all';
import clsx from 'clsx';
import { isMobileViewport } from '#lib/utils';

// Parte de la ventana que siempre queda a la vista al arrastrarla hacia los lados
const MIN_VISIBLE_WIDTH = 120;

// La barra de título no puede pasar bajo la barra de menú ni bajo el Dock: se perderían sus botones
const getDragBounds = (el, header) => {
    const { left, top, width } = el.getBoundingClientRect();
    const startLeft = left - gsap.getProperty(el, 'x');
    const startTop = top - gsap.getProperty(el, 'y');
    const dockTop = document.getElementById('dock').getBoundingClientRect().top;

    return {
        minX: MIN_VISIBLE_WIDTH - width - startLeft,
        maxX: window.innerWidth - MIN_VISIBLE_WIDTH - startLeft,
        minY: document.querySelector('nav').offsetHeight - startTop,
        maxY: dockTop - header.offsetHeight - startTop,
    };
};

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, toggleMaximize, windows } = useWindowStore();
        const { isOpen, isMinimized, isMaximized, zIndex } = windows[windowKey];
        const ref = useRef(null);
        const dragRef = useRef(null);
        // Posición arrastrada que se recupera al salir de maximizado
        const savedPosition = useRef({ x: 0, y: 0 });
        // En pantallas móviles se usa la ventana de MobileWindowWrapper
        const [isDesktop, setIsDesktop] = useState(() => !isMobileViewport());

        useEffect(() => {
            const checkDesktop = () => setIsDesktop(!isMobileViewport());

            window.addEventListener('resize', checkDesktop);

            return () => window.removeEventListener('resize', checkDesktop);
        }, [])

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            // Una animación anterior no debe terminar después de cambiar de estado:
            // al restaurar rápido, la de minimizar dejaría la ventana abierta pero oculta
            gsap.killTweensOf(el);

            if (!isOpen || !isDesktop) return;

            if (isMinimized) {
                // Se encoge hacia el dock y luego deja de ocupar la pantalla
                gsap.to(el, { scale: 0.5, opacity: 0, yPercent: 40, transformOrigin: '50% 100%', duration: 0.3, ease: "power2.in",
                    onComplete: () => { el.style.display = 'none'; } });
                return;
            }

            el.style.display = 'block';

            gsap.fromTo(el, { scale: 0.8, opacity: 0, yPercent: 0, y: 40, transformOrigin: '50% 50%' },
                 { scale: 1, opacity: 1, y: 0, duration: 0.4, ease:"power3.out"})

        }, [isOpen, isMinimized, isDesktop])

        useGSAP(()=>{
            const el = ref.current;
            if(!el || !isDesktop) return;

           // Estas ventanas tienen scroll o controles propios: se mueven solo desde su encabezado
           const header = el.querySelector('#window-header');
           const trigger = ['resume', 'music', 'safari'].includes(windowKey) ? header : el;
           const [instance] = Draggable.create(el,{
               trigger,
               onPress() {
                   this.applyBounds(getDragBounds(el, header));
               },
           })
           dragRef.current = instance;

           // Doble clic en la barra de título: maximizar o restaurar, como en macOS
           const onDoubleClick = (e) => {
               if (e.target.closest('button, a, input, [role="button"]')) return;
               toggleMaximize(windowKey);
           };
           header?.addEventListener('dblclick', onDoubleClick);

           return () => {
               header?.removeEventListener('dblclick', onDoubleClick);
               instance.kill();
           };
        },[isDesktop])

        useGSAP(() => {
            const el = ref.current;
            const drag = dragRef.current;
            if (!el || !isDesktop) return;

            if (isMaximized) {
                savedPosition.current = { x: gsap.getProperty(el, 'x'), y: gsap.getProperty(el, 'y') };
                gsap.set(el, { x: 0, y: 0 });
                drag?.disable();
            } else {
                gsap.set(el, savedPosition.current);
                drag?.enable();
            }
        }, [isMaximized, isDesktop])

        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;

            if (!isOpen) el.style.display = "none";
            else if (!isMinimized) el.style.display = "block";
        }, [isOpen, isMinimized, isDesktop])

        if (!isDesktop) return null;

        return <section id={windowKey} ref={ref} style={{ zIndex }} className={clsx('absolute', isMaximized && 'maximized')} onPointerDown={()=>focusWindow(windowKey)}>
            <Component {...props} />
        </section>
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName
        || Component.name
        || 'Component'
        })`

    return Wrapped;
}

export default WindowWrapper
