import gsap from "gsap";
import { Draggable } from 'gsap/all'
import clsx from "clsx";

import { Navbar,Welcome,Dock,MobileNavbar } from "#components"
import {Terminal, Safari,Resume, Finder, Text, Image, Contact, Photos, Music }from "#windows";
import {MobileTerminal, MobileSafari, MobileResume, MobileFinder, MobileText, MobileImage, MobileContact, MobilePhotos, MobileMusic} from "#windows/mobile";
import Home from "#components/Home";
import AnimatedWallpaper from "#components/AnimatedWallpaper";
import MobileHome from "#components/mobile/Home";
import useWindowStore from "#store/window";

gsap.registerPlugin(Draggable);

const App = () => {
  const windows = useWindowStore((state) => state.windows);
  const visibleWindows = Object.values(windows).filter(({ isOpen, isMinimized }) => isOpen && !isMinimized);
  const hasMaximized = visibleWindows.some(({ isMaximized }) => isMaximized);
  // Como en macOS, la barra y el Dock se ocultan solo si la ventana del frente está en pantalla completa
  const isFullscreen = hasMaximized && visibleWindows.reduce((top, win) => (win.zIndex > top.zIndex ? win : top)).isMaximized;

  return (
    <main className={clsx(hasMaximized && "has-maximized", isFullscreen && "fullscreen")}>
      <AnimatedWallpaper/>
      <Navbar/>
      <MobileNavbar/>
      <Welcome/>
      <Dock/>

      <Terminal/>
      <MobileTerminal/>
      <Safari/>
      <MobileSafari/>
      <Resume/>
      <MobileResume/>
      <Finder/>
      <MobileFinder/>
      <Text/>
      <MobileText/>
      <Image/>
      <MobileImage/>
      <Contact/>
      <MobileContact/>
      <Photos/>
      <MobilePhotos/>
      <Music/>
      <MobileMusic/>
      <Home/>
      <MobileHome/>
    </main>
  )
}

export default App
