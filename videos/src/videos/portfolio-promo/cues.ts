import type { CameraKey } from "../../kit/camera";
import type { CursorKey } from "../../kit/cursor";
import type { Card } from "../../kit/punchlines";
import { at, type Grid } from "../../kit/time";
import { contactMinimize, dockX, dockY, linkedInRest, musicMinimize, musicRow, navContactX, navResumeX, navY, resumeMinimize, terminalClose } from "./layout";

// Notanico Merengue, measured with scripts/beats.py: 120 BPM. The film plays the song from its
// opening, starting on the beat of its first hit, so the band enters on "desktop." (bar 4, beat 2)
export const grid: Grid = { bpm: 120, firstBeat: 0, pickupBeats: 0, beatsPerBar: 4 };
export const b = (bar: number, beat = 1, fraction = 0) => at(grid, bar, beat, fraction);

export const BARS = 15;
export const DURATION = b(BARS + 1);
export const SONG_START = 0.515;
export const SONG_LENGTH = 181.05;

export const cue = {
  navIn: b(1, 1),
  dockIn: b(1, 1, 0.5),
  subtitleIn: b(1, 1, 0.5),
  titleIn: b(1, 3),
  titleSweep: b(2, 1),
  titleSweepEnd: b(2, 4),
  welcomeOut: b(3, 1) - 0.15,

  dockSweep: b(4, 4),
  skillsClick: b(5, 3),
  terminalOpen: b(5, 3, 0.25),
  terminalType: b(5, 4),
  terminalLabel: b(6, 1, 0.5),
  terminalRows: [b(6, 2), b(6, 3), b(6, 4), b(7, 1), b(7, 2), b(7, 3)],
  terminalFoot: b(7, 4),
  terminalClose: b(8, 2),

  resumeClick: b(9, 3),
  resumeOpen: b(9, 3, 0.25),
  resumeScroll: [b(9, 4, 0.5), b(10, 1, 0.5), b(10, 2, 0.5)],
  resumeMinimize: b(10, 3),
  musicClick: b(10, 4),
  musicOpen: b(10, 4, 0.25),
  musicHover: b(11, 2),
  musicPullBack: b(12, 1),
  musicMinimize: b(12, 2),
  contactClick: b(12, 3),
  contactOpen: b(12, 3, 0.25),
  contactLinks: [b(12, 4), b(12, 4, 0.5), b(13, 1), b(13, 1, 0.5)],
  linkedInHover: b(13, 2),

  contactMinimize: b(13, 4),
  endSubtitle: b(14, 1),
  endTitle: b(14, 1, 0.5),
  endSweep: b(14, 3),
  endSweepEnd: b(15, 2),
  endLink: b(14, 3),
};

export const clicks = [
  cue.skillsClick,
  cue.terminalClose,
  cue.resumeClick,
  cue.resumeMinimize,
  cue.musicClick,
  cue.musicMinimize,
  cue.contactClick,
  cue.contactMinimize,
];

export const cameraKeys: CameraKey[] = [
  [0, 960, 540, 1.1],
  [0.02, 960, 540, 1],
  [cue.dockSweep - 0.35, 960, 760, 1.45],
  [cue.terminalOpen, 533, 340, 1.8],
  [cue.terminalClose + 0.05, 960, 540, 1],
  [cue.resumeOpen, 1320, 400, 1.6],
  [cue.resumeMinimize, 960, 540, 1],
  [cue.musicOpen, 960, 349, 1.8],
  [cue.musicPullBack, 960, 540, 1],
  [cue.contactOpen, 1136, 440, 1.7],
  [cue.contactMinimize, 960, 540, 1],
];

// Every stop is in world units, so the cursor stays on its target while the camera moves
export const cursorKeys: CursorKey[] = [
  { t: 0, x: 1500, y: 820 },
  { t: cue.titleSweep, x: 640, y: 668 },
  { t: cue.titleSweepEnd, x: 1280, y: 668 },
  { t: b(4, 1), x: 1120, y: 900 },
  { t: cue.dockSweep, x: dockX.finder, y: dockY },
  { t: cue.skillsClick - 0.02, x: dockX.terminal, y: dockY },
  { t: cue.skillsClick, x: dockX.terminal, y: dockY, click: true },
  { t: b(5, 4), x: 790, y: 400 },
  { t: cue.terminalClose, x: terminalClose.x, y: terminalClose.y, click: true },
  { t: b(8, 4), x: 1100, y: 150 },
  { t: cue.resumeClick, x: navResumeX, y: navY, click: true },
  { t: b(9, 4, 0.5), x: 1770, y: 460 },
  { t: cue.resumeMinimize, x: resumeMinimize.x, y: resumeMinimize.y, click: true },
  { t: cue.musicClick, x: dockX.music, y: dockY, click: true },
  { t: cue.musicHover, x: musicRow.x, y: musicRow.y },
  { t: cue.musicMinimize, x: musicMinimize.x, y: musicMinimize.y, click: true },
  { t: cue.contactClick, x: navContactX, y: navY, click: true },
  { t: cue.linkedInHover, x: linkedInRest.x, y: linkedInRest.y },
  { t: cue.contactMinimize, x: contactMinimize.x, y: contactMinimize.y, click: true },
  { t: cue.endSubtitle, x: 1500, y: 1130 },
];

// Long straight passes that keep a steady speed, on top of the stops above
export const cursorSweeps = [
  { start: cue.titleSweep, end: cue.titleSweepEnd, x0: 640, x1: 1280, y: 668 },
  { start: cue.dockSweep, end: cue.skillsClick - 0.02, x0: dockX.finder, x1: dockX.terminal, y: dockY },
];

export const punchlines: Card[] = [
  {
    lines: [
      [
        { text: "Not", at: b(3, 1) },
        { text: "a", at: b(3, 2) },
        { text: "resume.", at: b(3, 3) },
      ],
      [
        { text: "A", at: b(4, 1) },
        { text: "desktop.", at: b(4, 2) },
      ],
    ],
    out: b(4, 3, 0.25),
    y: 470,
    size: 136,
  },
  {
    lines: [
      [{ text: "Everything,", at: b(8, 3) }],
      [
        { text: "one", at: b(8, 4) },
        { text: "click", at: b(9, 1) },
        { text: "away.", at: b(9, 1, 0.5) },
      ],
    ],
    out: b(9, 2, 0.5),
    y: 470,
    size: 136,
  },
];
