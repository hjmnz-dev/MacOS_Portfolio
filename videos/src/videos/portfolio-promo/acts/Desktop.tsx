import { Languages } from "lucide-react";
import { Img } from "remotion";

import { dockApps, locations, navIcons, navLinks } from "../../../../../src/constants/index.js";
import { step } from "../../../kit/spring";
import { clamp01 } from "../../../kit/time";
import { cue } from "../cues";
import { asset, Image } from "./shared";

const uiSpring = { stiffness: 170, damping: 26 };

// Twin of src/components/Navbar.jsx: the clock is fixed and the menus stay closed
export function Navbar({ t }: { t: number }) {
  const u = step(t - cue.navIn, uiSpring);
  return (
    // The site's CSS points the menu bar glass at /images/...; Remotion serves that file from its public folder
    <nav style={{ translate: `0 ${(u - 1) * 100}%`, "--wallpaper-blur": `url("${asset("/images/wallpaper-caribe-blur.webp")}")` } as React.CSSProperties}>
      <div>
        <Image src="/images/logo.svg" alt="" />
        <p className="font-bold">Hamsell's Portfolio</p>
        <ul>
          {navLinks.map(({ id, name }: { id: number; name: string }) => (
            <li key={id}>
              <button type="button" data-target={`nav-${name}`}>
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul>
          {navIcons.map(({ id, img }: { id: number; img: string }) => (
            <li key={id}>
              {id === 4 ? (
                <button type="button" className="mt-1.5">
                  <Image src="/icons/mode.svg" alt="" className="icon" />
                </button>
              ) : (
                <Image src={img} className="icon" alt="" />
              )}
            </li>
          ))}
          <li>
            <button type="button" className="flex">
              <Languages size={24} className="icon" />
            </button>
          </li>
        </ul>
        <time>Tue November 3 9:41 AM</time>
      </div>
    </nav>
  );
}

// Twin of src/components/Home.jsx
export function Home() {
  return (
    <section id="home">
      <ul>
        {locations.work.children.map((project: { id: number; name: string }) => (
          <li key={project.id} className="group folder">
            <Image src="/images/folder.png" alt="" />
            <p>{project.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Twin of src/components/Dock.jsx with the same formula: scale 1 + 0.25 * i, y -15 * i,
 * i = exp(-(distance^2.5) / 20000). The site eases it with GSAP; here it reads the cursor directly.
 */
export function Dock({
  t,
  cursor,
  open,
  musicPlaying,
}: {
  t: number;
  cursor: { x: number; y: number };
  open: Record<string, boolean>;
  musicPlaying: boolean;
}) {
  const rise = step(t - cue.dockIn, uiSpring);
  // Same as the site's mouseleave: the effect only applies with the cursor on the Dock
  const over = clamp01((cursor.y - 940) / 30);
  return (
    <section id="dock" style={{ translate: `-50% ${(1 - rise) * 140}%` }}>
      <div className="dock-container">
        {dockApps.map(({ id, name, icon }: { id: string; name: string; icon: string }, index: number) => {
          const center = 745 + 86 * index;
          const distance = Math.abs(cursor.x - center);
          const intensity = Math.exp(-(distance ** 2.5) / 20000) * over;
          const tip = over > 0.9 && distance < 43;
          return (
            <div key={id} className="relative flex justify-center">
              <button
                type="button"
                className="dock-icon"
                data-target={`dock-${id}`}
                style={{ scale: String(1 + 0.25 * intensity), translate: `0 ${-15 * intensity}px` }}
              >
                <Img src={asset(`/images/${icon}`)} alt="" />
              </button>
              {(open[id] || (id === "music" && musicPlaying)) && <span className="absolute -bottom-1 size-1 rounded-full bg-white" />}
              {tip && (
                <div className="tooltip" style={{ position: "absolute", bottom: "calc(100% + 24px)", whiteSpace: "nowrap" }}>
                  {name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
