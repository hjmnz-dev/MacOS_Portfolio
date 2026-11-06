import { AbsoluteFill, Audio, Img, Sequence, staticFile, useVideoConfig } from "remotion";

import "../../styles.css";
import "./fonts";

import { camera, cameraSpring, FRAME, project, worldTransform } from "../../kit/camera";
import { cursorAt, UserCursor } from "../../kit/cursor";
import { TargetLog } from "../../kit/debug";
import { Punchlines } from "../../kit/punchlines";
import { useTime } from "../../kit/time";
import { Dock, Home, Navbar } from "./acts/Desktop";
import { EndCard, MusicCredit, Welcome } from "./acts/Welcome";
import { ContactWindow, MusicWindow, ResumeWindow, TerminalWindow } from "./acts/Windows";
import { cameraKeys, clicks, cue, cursorKeys, cursorSweeps, punchlines } from "./cues";

export type PromoProps = { fps: number; debug: boolean };

const identity = (x: number, y: number) => ({ x, y });
const smooth = (u: number) => u * u * (3 - 2 * u);

// The frame never leaves the desktop, as there is nothing outside the wallpaper
function clampedCamera(t: number) {
  const view = camera(t, cameraKeys, { ...cameraSpring, stiffness: 170, damping: 34, mass: 1 });
  const halfW = FRAME.width / 2 / view.zoom;
  const halfH = FRAME.height / 2 / view.zoom;
  return {
    zoom: view.zoom,
    x: Math.min(FRAME.width - halfW, Math.max(halfW, view.x)),
    y: Math.min(FRAME.height - halfH, Math.max(halfH, view.y)),
  };
}

function cursorWorld(t: number) {
  const point = cursorAt(t, cursorKeys, identity);
  for (const sweep of cursorSweeps) {
    if (t >= sweep.start && t <= sweep.end) {
      const u = smooth((t - sweep.start) / (sweep.end - sweep.start));
      return { ...point, x: sweep.x0 + (sweep.x1 - sweep.x0) * u, y: sweep.y };
    }
  }
  return point;
}

export const PortfolioPromo = ({ debug }: PromoProps) => {
  const t = useTime();
  const { fps } = useVideoConfig();
  const view = clampedCamera(t);
  const cursor = cursorWorld(t);
  const screen = project(view, cursor.x, cursor.y);
  const open = {
    terminal: t >= cue.terminalOpen && t < cue.terminalClose,
    contact: t >= cue.contactOpen,
    music: t >= cue.musicOpen,
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Audio src={staticFile("audio/portfolio-promo/music/portfolio-promo-edit.wav")} volume={0.85} />
      {clicks.map((at) => (
        <Sequence key={at} from={Math.round(at * fps)} durationInFrames={Math.round(0.2 * fps)} layout="none">
          <Audio src={staticFile("audio/portfolio-promo/sfx/click.wav")} volume={0.4} />
        </Sequence>
      ))}

      <div style={{ position: "absolute", left: 0, top: 0, width: FRAME.width, height: FRAME.height, transformOrigin: "0 0", transform: worldTransform(view) }}>
        <main style={{ width: FRAME.width, height: FRAME.height }}>
          <Img
            src={staticFile("images/wallpaper-caribe.webp")}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -10 }}
          />
          <Navbar t={t} />
          <Welcome t={t} cursor={cursor} />
          <EndCard t={t} />
          <Dock t={t} cursor={cursor} open={open} musicPlaying={open.music} />
          <TerminalWindow t={t} cursor={cursor} />
          <ResumeWindow t={t} cursor={cursor} />
          <MusicWindow t={t} cursor={cursor} />
          <ContactWindow t={t} cursor={cursor} />
          <Home />
        </main>
      </div>

      <div style={{ fontStyle: "italic", textShadow: "0 2px 16px rgb(2 40 72 / 0.65)" }}>
        <Punchlines t={t} cards={punchlines} theme={{ font: '"Georama", sans-serif', color: "#ffffff", accent: "#ffffff", weight: 500 }} />
      </div>

      <MusicCredit t={t} />

      {t < cue.endSubtitle && <UserCursor x={screen.x} y={screen.y} squash={cursor.squash} />}

      {debug && <TargetLog />}
    </AbsoluteFill>
  );
};
