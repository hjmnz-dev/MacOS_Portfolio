import gsap from "gsap";
import { Draggable } from 'gsap/all'

import { Navbar,Welcome,Dock } from "#components"
import {Terminal, Safari,Resume, Finder, Text, Image, Contact, Photos }from "#windows";
import Home from "#components/Home";

gsap.registerPlugin(Draggable);

const App = () => {
  return (
    <main>
      <Navbar/>
      <Welcome/>
      <Dock/>

      <Terminal/>
      <Safari/>
      <Resume/>
      <Finder/>
      <Text/>
      <Image/>
      <Contact/>
      <Photos/>
      <Home/>
    </main>
  )
}

export default App