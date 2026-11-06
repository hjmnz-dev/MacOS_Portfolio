import { Maximize2, Minus, X } from "lucide-react";
import { Img, staticFile } from "remotion";

import { clamp01 } from "../../../kit/time";

export type Point = { x: number; y: number };

// The portfolio stores paths from the site root; Remotion serves them from videos/public
export const asset = (path: string) => staticFile(path.replace(/^\//, ""));

export const Image = ({ src, ...props }: { src: string; alt?: string; className?: string; style?: React.CSSProperties }) => (
  <Img src={asset(src)} {...props} />
);

/**
 * Twin of the GSAP tweens in src/hoc/WindowWrapper.jsx, with the same values:
 * opens with power3.out in 0.4 s, minimizes with power2.in in 0.3 s.
 */
export function windowStyle(t: number, open: number, minimize = Infinity): React.CSSProperties {
  const u = clamp01((t - open) / 0.4);
  const eased = 1 - (1 - u) ** 4;
  const m = clamp01((t - minimize) / 0.3);
  const shrink = m ** 3;
  if (m > 0) {
    return { scale: String(1 - 0.5 * shrink), opacity: 1 - shrink, translate: `0 ${40 * shrink}%`, transformOrigin: "50% 100%" };
  }
  return { scale: String(0.8 + 0.2 * eased), opacity: eased, translate: `0 ${8 * (1 - eased)}%`, transformOrigin: "50% 50%" };
}

// Twin of src/components/WindowControls.jsx: the glyphs show while the cursor is over the group
export function WindowControls({ cursor, name, target }: { cursor: Point; name: string; target: Point }) {
  const hover = Math.hypot(cursor.x - target.x, cursor.y - target.y) < 40;
  const glyph = { opacity: hover ? 1 : 0, transition: "none" };
  return (
    <div id="window-controls">
      <button type="button" className="close" data-target={`${name}-close`}>
        <X strokeWidth={3} style={glyph} />
      </button>
      <button type="button" className="minimize" data-target={`${name}-minimize`}>
        <Minus strokeWidth={3} style={glyph} />
      </button>
      <button type="button" className="maximize">
        <Maximize2 strokeWidth={3} style={glyph} />
      </button>
    </div>
  );
}
