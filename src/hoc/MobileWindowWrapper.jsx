import { useLayoutEffect, useState, useEffect } from "react";
import useWindowStore from "#store/window";
import { isMobileViewport } from "#lib/utils";

const MobileWindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { windows } = useWindowStore();
    const { isOpen, isMinimized, zIndex } = windows[windowKey];
    // Una ventana minimizada en escritorio sigue oculta aquí hasta tocarla en el Dock
    const isVisible = isOpen && !isMinimized;
    const [isMobile, setIsMobile] = useState(() => isMobileViewport());

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(isMobileViewport());
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useLayoutEffect(() => {
      const el = document.getElementById(`mobile-${windowKey}`);
      if (!el) return;
      el.style.display = (isVisible && isMobile) ? "block" : "none";
    }, [isVisible, isMobile]);

    // Don't render on desktop
    if (!isMobile || !isVisible) return null;

    return (
      <section
        id={`mobile-${windowKey}`}
        style={{ zIndex }}
      >
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `MobileWindowWrapper(${Component.displayName || Component.name || "Component"})`;

  return Wrapped;
};

export default MobileWindowWrapper;
