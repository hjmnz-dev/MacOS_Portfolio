import { Easing } from "remotion";

import { clamp01 } from "../../../kit/time";
import { cue } from "../cues";
import { endTitleBox, subtitleBox, titleBox } from "../layout";

const land = Easing.bezier(0.22, 1, 0.36, 1);

// The same falloff as setupTextHover in src/components/Welcome.jsx and the same weights,
// except the subtitle's resting weight: 100 on the site, too thin to read in a feed
const WEIGHTS = {
  subtitle: { min: 250, max: 400 },
  title: { min: 400, max: 900 },
};

function Letters({
  text,
  className,
  kind,
  box,
  pointer,
  presence,
  t,
  start,
  gap,
}: {
  text: string;
  className: string;
  kind: keyof typeof WEIGHTS;
  box: { left: number; width: number };
  pointer: number;
  presence: number;
  t: number;
  start: number;
  gap: number;
}) {
  const { min, max } = WEIGHTS[kind];
  const letters = [...text];
  return (
    <>
      {letters.map((char, index) => {
        const center = box.left + ((index + 0.5) / letters.length) * box.width;
        const intensity = Math.exp(-((pointer - center) ** 2) / 20000) * presence;
        const u = land(clamp01((t - (start + index * gap)) / 0.3));
        return (
          <span
            key={index}
            className={className}
            style={{
              fontVariationSettings: `'wght' ${min + (max - min) * intensity}`,
              opacity: u,
              display: "inline-block",
              translate: `0 ${(1 - u) * 18}px`,
            }}
          >
            {char === " " ? " " : char}
          </span>
        );
      })}
    </>
  );
}

// Twin of src/components/Welcome.jsx: the cursor drives the letter weights instead of mouse events
export function Welcome({ t, cursor }: { t: number; cursor: { x: number; y: number } }) {
  if (t >= cue.welcomeOut + 0.2) return null;
  const leave = clamp01((t - cue.welcomeOut) / 0.2);
  const presence = clamp01((t - (cue.titleSweep - 0.3)) / 0.3) * (1 - clamp01((t - cue.titleSweepEnd) / 0.3));
  return (
    <section id="welcome" style={{ opacity: 1 - leave, filter: leave > 0 ? `blur(${leave * 12}px)` : undefined }}>
      <p data-target="welcome-subtitle">
        <Letters
          text="Hey, I'm Hamsell! Welcome to my"
          className="text-3xl font-georama"
          kind="subtitle"
          box={subtitleBox}
          pointer={cursor.x}
          presence={presence}
          t={t}
          start={cue.subtitleIn}
          gap={0.02}
        />
      </p>
      <h1 className="mt-7" data-target="welcome-title">
        <Letters
          text="Portfolio"
          className="text-9xl italic font-georama"
          kind="title"
          box={titleBox}
          pointer={cursor.x}
          presence={presence}
          t={t}
          start={cue.titleIn}
          gap={0.06}
        />
      </h1>
    </section>
  );
}

export const END_ROLE = "Software Developer";
export const END_NAME = "Hamsell Jiménez";
export const END_LINK = "hamselljimenez.dev";

// The closing card uses the same type as the welcome, with the name as the title
export function EndCard({ t }: { t: number }) {
  if (t < cue.endSubtitle) return null;
  const sweep = clamp01((t - cue.endSweep) / (cue.endSweepEnd - cue.endSweep));
  const pointer = endTitleBox.left - 150 + sweep * (endTitleBox.width + 300);
  const presence = clamp01((t - cue.endSweep) / 0.2) * (1 - clamp01((t - cue.endSweepEnd) / 0.2));
  const link = land(clamp01((t - cue.endLink) / 0.3));
  return (
    <section id="welcome">
      <p style={{ textAlign: "center" }} data-target="end-subtitle">
        <Letters
          text={END_ROLE}
          className="text-3xl font-georama"
          kind="subtitle"
          box={endTitleBox}
          pointer={pointer}
          presence={0}
          t={t}
          start={cue.endSubtitle}
          gap={0.015}
        />
      </p>
      <h1 className="mt-7" style={{ whiteSpace: "nowrap" }} data-target="end-title">
        <Letters
          text={END_NAME}
          className="text-[112px] leading-none italic font-georama"
          kind="title"
          box={endTitleBox}
          pointer={pointer}
          presence={presence}
          t={t}
          start={cue.endTitle}
          gap={0.03}
        />
      </h1>
      <p className="mt-7 text-3xl font-georama" style={{ opacity: link, translate: `0 ${(1 - link) * 18}px`, fontVariationSettings: "'wght' 400" }}>
        {END_LINK}
      </p>
    </section>
  );
}

// CC BY 4.0 asks for this credit, the same text the site keeps in its Music app
export function MusicCredit({ t }: { t: number }) {
  const u = clamp01((t - cue.endLink) / 0.3);
  return (
    <p
      className="font-georama text-white"
      style={{
        position: "absolute",
        right: 28,
        bottom: 20,
        fontSize: 20,
        opacity: u,
        fontVariationSettings: "'wght' 400",
        textShadow: "0 1px 8px rgb(0 0 0 / 0.7)",
      }}
    >
      Music: "Notanico Merengue" Kevin MacLeod (incompetech.com), CC BY 4.0
    </p>
  );
}
