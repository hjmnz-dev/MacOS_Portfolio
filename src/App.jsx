import { useEffect } from "react";
import gsap from "gsap";
import { Draggable } from 'gsap/all'
import clsx from "clsx";

import { Navbar,Welcome,Dock,MobileNavbar } from "#components"
import {Terminal, Safari,Resume, Finder, Text, Image, Contact, Photos, Music, Video }from "#windows";
import {MobileTerminal, MobileSafari, MobileResume, MobileFinder, MobileText, MobileImage, MobileContact, MobilePhotos, MobileMusic, MobileVideo} from "#windows/mobile";
import Home from "#components/Home";
import AnimatedWallpaper from "#components/AnimatedWallpaper";
import MobileHome from "#components/mobile/Home";
import useWindowStore from "#store/window";
import useLanguageStore from "#store/language";
import { resumeFiles } from "#constants";
import { preloadResume } from "#lib/resume";

gsap.registerPlugin(Draggable);

const App = () => {
  const windows = useWindowStore((state) => state.windows);
  const language = useLanguageStore((state) => state.language);

  useEffect(() => preloadResume(resumeFiles[language].file), [language]);

  const visibleWindows = Object.values(windows).filter(({ isOpen, isMinimized }) => isOpen && !isMinimized);
  const frontWindow = visibleWindows.reduce((top, win) => (!top || win.zIndex > top.zIndex ? win : top), null);

  return (
    // Como en macOS, la barra y el Dock se ocultan solo si la ventana del frente está en pantalla completa
    <main className={clsx(frontWindow?.isMaximized && "fullscreen")}>
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
      <Video/>
      <MobileVideo/>
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
