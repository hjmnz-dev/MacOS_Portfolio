import { Check, Clock3, DownloadIcon, Flag, House, Library, Music2, Pause, Repeat, Search, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";
import clsx from "clsx";
import { Img } from "remotion";

import { musicTracks, socials, techStack } from "../../../../../src/constants/index.js";
import { track } from "../../../kit/spring";
import { clamp01 } from "../../../kit/time";
import { cue, grid, SONG_LENGTH, SONG_START } from "../cues";
import { contactMinimize, musicMinimize, musicRow, resumeMinimize, terminalClose } from "../layout";
import { asset, Image, type Point, windowStyle, WindowControls } from "./shared";

const reveal = (t: number, at: number) => {
  const u = clamp01((t - at) / 0.22);
  return { opacity: 1 - (1 - u) ** 3, translate: `0 ${(1 - u) * 8}px` };
};

// Twin of src/windows/Terminal.jsx: same markup and data, with the output arriving on the beat
export function TerminalWindow({ t, cursor }: { t: number; cursor: Point }) {
  if (t < cue.terminalOpen || t >= cue.terminalClose) return null;
  const command = "show tech stack";
  const typed = Math.floor(clamp01((t - cue.terminalType) / (cue.terminalLabel - cue.terminalType - 0.05)) * command.length);
  return (
    <section id="terminal" className="absolute" style={{ ...windowStyle(t, cue.terminalOpen), zIndex: 1001 }}>
      <div id="window-header">
        <WindowControls cursor={cursor} name="terminal" target={terminalClose} />
        <h2>Tech Stack</h2>
      </div>
      <div className="techstack">
        <p>
          <span className="font-bold">@hamsell % </span>
          {command.slice(0, typed)}
        </p>
        <div className="label" style={reveal(t, cue.terminalLabel)}>
          <p className="w-32">Category</p>
          <p>Technologies</p>
        </div>
        <ul className="content" style={{ opacity: clamp01((t - cue.terminalLabel) / 0.2) }}>
          {techStack.map(({ category, items }: { category: string; items: string[] }, row: number) => (
            <li key={category} className="flex items-center" style={reveal(t, cue.terminalRows[row])}>
              <Check className="check" size={20} />
              <h3>{category}</h3>
              <ul>
                {items.map((item, i) => (
                  <li key={i}>
                    {item}
                    {i < items.length - 1 ? ", " : ""}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="footnote" style={reveal(t, cue.terminalFoot)}>
          <p>
            <Check size={20} /> {techStack.length} of {techStack.length} stacks loaded successfully (100%)
          </p>
          <p className="text-black">
            <Flag size={15} fill="currentColor" />
            Render time: 6ms
          </p>
        </div>
      </div>
    </section>
  );
}

// Twin of src/windows/Resume.jsx: react-pdf draws on its own clock, so the pages are images of the same PDF
export function ResumeWindow({ t, cursor }: { t: number; cursor: Point }) {
  if (t < cue.resumeOpen || t > cue.resumeMinimize + 0.3) return null;
  const scroll = track(
    t,
    [
      [0, 0],
      [cue.resumeScroll[0], 110],
      [cue.resumeScroll[1], 220],
      [cue.resumeScroll[2], 330],
    ],
    { stiffness: 220, damping: 28 },
  );
  return (
    <section id="resume" className="absolute" style={{ ...windowStyle(t, cue.resumeOpen, cue.resumeMinimize), zIndex: 1002 }}>
      <div id="window-header">
        <WindowControls cursor={cursor} name="resume" target={resumeMinimize} />
        <h2>Resume.pdf</h2>
        <DownloadIcon className="icon" />
      </div>
      <div className="resume-pdf" style={{ overflow: "hidden" }}>
        <div style={{ translate: `0 ${-scroll}px` }}>
          <Image src="/images/resume-en-1.png" alt="" style={{ width: 595, display: "block" }} />
          <Image src="/images/resume-en-2.png" alt="" style={{ width: 595, display: "block" }} />
        </div>
      </div>
    </section>
  );
}

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

// Measured from the files in public/music
const DURATIONS: Record<number, string> = { 1: "3:07", 2: "3:10", 3: "3:13", 4: "3:01" };
const CURRENT = 3;
// The list scrolled past its header (168 px, measured), so nothing is cut and all four songs fit
const LIST_SCROLL = 168;
const PLAYLIST_COLOR = "#1db954";

const Cover = ({ color, className }: { color: string; className?: string }) => (
  <span className={clsx("cover", className)} style={{ "--cover": color } as React.CSSProperties}>
    <Music2 />
  </span>
);

// Twin of src/components/MusicPlayer.jsx: Notanico Merengue is the song the film really plays,
// so the progress bar shows its true position, and the equalizer follows the beat instead of a CSS keyframe
export function MusicWindow({ t, cursor }: { t: number; cursor: Point }) {
  if (t < cue.musicOpen || t > cue.musicMinimize + 0.3) return null;
  const songTime = t + SONG_START;
  const progress = (songTime / SONG_LENGTH) * 100;
  const current = musicTracks[CURRENT];
  const rowHover = Math.abs(cursor.x - musicRow.x) < 280 && Math.abs(cursor.y - musicRow.y) < 24;
  const beat = (t * grid.bpm) / 60;
  const bar = (offset: number) => 0.3 + 0.7 * Math.abs(Math.sin(Math.PI * (beat + offset)));
  return (
    <section id="music" className="absolute" style={{ ...windowStyle(t, cue.musicOpen, cue.musicMinimize), zIndex: 1003 }}>
      <div className="music-app">
        <div className="music-top">
          <div id="window-header">
            <WindowControls cursor={cursor} name="music" target={musicMinimize} />
          </div>
          <div className="top-search">
            <span className="home-icon">
              <House size={18} />
            </span>
            <label className="music-search">
              <Search size={18} />
              <input type="search" readOnly placeholder="Search songs" />
            </label>
          </div>
        </div>
        <div className="music-body">
          <aside>
            <h3>
              <Library size={20} />
              Your Library
            </h3>
            <div className="library-item">
              <Cover color={PLAYLIST_COLOR} />
              <div>
                <p>Hamsell's Playlist</p>
                <span>Playlist • {musicTracks.length} songs</span>
              </div>
            </div>
          </aside>
          <section className="music-main">
            <header className="hero" style={{ marginTop: -LIST_SCROLL }}>
              <Cover color={PLAYLIST_COLOR} className="large" />
              <div>
                <span>Playlist</span>
                <h2>Hamsell's Playlist</h2>
                <p>Hamsell • {musicTracks.length} songs</p>
              </div>
            </header>
            <div className="actions">
              <button type="button" className="big-play">
                <Pause size={24} fill="currentColor" />
              </button>
            </div>
            <div className="track-head">
              <span>#</span>
              <span>Title</span>
              <Clock3 size={16} />
            </div>
            <ul>
              {musicTracks.map(({ id, title, color }: { id: number; title: string; color: string }, index: number) => (
                <li key={id}>
                  <button
                    type="button"
                    className={clsx("track", index === CURRENT && "current")}
                    data-target={index === CURRENT ? "music-current" : undefined}
                    // The site's hover on a row, as the cursor rests on the current song
                    style={index === CURRENT && rowHover ? { background: "rgb(255 255 255 / 0.1)", transition: "none" } : { transition: "none" }}
                  >
                    <span className="number">
                      {index === CURRENT ? (
                        <span className="equalizer">
                          {[0, 0.5, 0.25].map((offset) => (
                            <i key={offset} style={{ animation: "none", transform: `scaleY(${bar(offset)})` }} />
                          ))}
                        </span>
                      ) : (
                        <span className="position">{index + 1}</span>
                      )}
                    </span>
                    <span className="title">
                      <Cover color={color} />
                      <span className="truncate">{title}</span>
                    </span>
                    <span className="time">{DURATIONS[id]}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="credit">
              {musicTracks.map(({ title }: { title: string }) => `"${title}"`).join(", ")} Kevin MacLeod (<a>incompetech.com</a>) Licensed under Creative Commons: <a>By Attribution 4.0 License</a>
            </p>
          </section>
        </div>
        <footer className="player-bar">
          <div className="now-playing">
            <Cover color={current.color} />
            <div className="min-w-0">
              <p className="truncate">{current.title}</p>
              <span>Playing</span>
            </div>
          </div>
          <div className="transport">
            <button type="button" className="toggle">
              <Shuffle size={18} />
            </button>
            <button type="button">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button type="button" className="main-play">
              <Pause size={18} fill="currentColor" />
            </button>
            <button type="button">
              <SkipForward size={20} fill="currentColor" />
            </button>
            <button type="button" className="toggle">
              <Repeat size={18} />
            </button>
          </div>
          <div className="progress">
            <span>{formatTime(songTime)}</span>
            <input type="range" readOnly className="music-slider" style={{ "--progress": `${progress}%` } as React.CSSProperties} min={0} max={SONG_LENGTH} value={songTime} />
            <span>{formatTime(SONG_LENGTH)}</span>
          </div>
          <div className="volume">
            <button type="button">
              <Volume2 size={20} />
            </button>
            <input type="range" readOnly className="music-slider" style={{ "--progress": "60%" } as React.CSSProperties} min={0} max={1} step={0.01} value={0.6} />
          </div>
        </footer>
      </div>
    </section>
  );
}

// Twin of src/windows/Contact.jsx: the links land one by one
export function ContactWindow({ t, cursor }: { t: number; cursor: Point }) {
  if (t < cue.contactOpen || t > cue.contactMinimize + 0.3) return null;
  // The site's hover on these cards, as the cursor rests on LinkedIn
  const hover = clamp01((t - (cue.linkedInHover - 0.1)) / 0.3) * (1 - clamp01((t - (cue.contactMinimize - 0.4)) / 0.2));
  return (
    <section id="contact" className="absolute" style={{ ...windowStyle(t, cue.contactOpen, cue.contactMinimize), zIndex: 1004 }}>
      <div id="window-header">
        <WindowControls cursor={cursor} name="contact" target={contactMinimize} />
        <h2>Contact Me</h2>
      </div>
      <div className="p-5 space-y-5">
        <Img src={asset("/images/hamsell.jpg")} alt="" className="w-20 rounded-full" />
        <h3>Let's Connect</h3>
        <p>Got an idea? A bug to squash? Or just wanna talk tech? I'm in.</p>
        <p>hamselljimenez@gmail.com</p>
        <ul>
          {socials.map(({ id, bg, icon, text }: { id: number; bg: string; icon: string; text: string }, index: number) => (
            <li
              key={id}
              data-target={`contact-${text}`}
              style={{ backgroundColor: bg, ...reveal(t, cue.contactLinks[index]), scale: text === "LinkedIn" ? String(1 + 0.05 * hover) : undefined }}
            >
              <a>
                <Image src={icon} alt="" className="size-5" />
                <p>{text}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

