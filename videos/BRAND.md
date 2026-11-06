# Portfolio video kit

The look, rules, assets and code for every film of this portfolio. Each film prompt points here and only adds its story.
Sources: `src/index.css`, `src/constants/index.js`, `src/components/`, `src/windows/`, `README.md`, and Hamsell's answers in the interview (2026-11-03). When this file and the repo disagree, the repo wins.

## The brief (from the interview)
- Plays: LinkedIn, with sound. Format: 16:9. Length: 20 to 30 s.
- Music: "Notanico Merengue", Kevin MacLeod, CC BY 4.0, from its opening, chosen by Hamsell after listening. "Lobby Time" and "Brain Dance" were not exciting enough. It is also in the site's playlist, so the film and the site agree. The credit is required, in the film and in the post.
- Must show: desktop and Dock, the Skills terminal, contact, resume and more (the Music app).
- Ingredients chosen: name and "Portfolio" as the brand · big punchlines in English · camera moves over one desktop · cursor interactions.
- Ending: role, name and the live site, hamselljimenez.dev.
- Not chosen: the Finder and its projects, the language and theme switch, the moving sea, the phone view.

## Hard rules
- Type: Georama for the welcome and big words, Roboto Mono only in the terminal, the system sans everywhere else (`src/index.css`).
- Surfaces: the Caribbean wallpaper and the windows' own surfaces. Nothing else (`src/index.css`).
- Light theme, as in `docs/preview.jpg`. The Music app is dark in both themes (`src/index.css`).
- Words: white with the welcome's shadow `0 2px 16px rgb(2 40 72 / 0.65)` (`#welcome` in `src/index.css`).
- Logo: the menu bar's Apple logo stays only as part of the macOS interface. It is never presented as Hamsell's brand (interview).
- Claims: see "Claims".

## Frame (1920x1080, 60 fps, light)
- Framing: full bleed, the desktop at the size of a 1920x1080 screen.
- Words: Georama italic, weight 500, 136 px, white.
- Scenes: UI text only.

## Color
| Token | Value | Use |
|---|---|---|
| window surface | `#ffffff` | terminal, resume, contact |
| window header | gray-50, border gray-200 | `#window-header` |
| terminal green | `#00A154` | checks and categories |
| music surfaces | `#000000`, `#121212`, `#1ed760` | Music app |
| traffic lights | `#ff6157`, `#ffc030`, `#2acb42` | window controls |

## Type
- Fonts: `@fontsource-variable/georama` and `@fontsource-variable/roboto-mono`, copied to `public/fonts` by `scripts/prepare-assets.py`.
- Sizes: subtitle 30 px, title 128 px, closing name 112 px, punchlines 136 px. The camera pushes in until UI text reads at 24 px or more.
- The subtitle rests at weight 250. The site uses 100, too thin to read in a feed (film decision, can be overruled).

## Signature elements
| Element | Look | Source | In films |
|---|---|---|---|
| Welcome letter weights | weights follow the cursor | `src/components/Welcome.jsx` | twin, same falloff |
| Dock magnification | scale and rise by distance | `src/components/Dock.jsx` | twin, same formula |
| Window open and minimize | GSAP tweens | `src/hoc/WindowWrapper.jsx` | same values, from `t` |

## Cursors
- The macOS arrow, black with a white edge, as in `docs/preview.jpg`. A click is a short squash, then the target reacts.

## Components
All are twins that copy the markup and class names, and import the real data from `src/constants/index.js`.

| Need | Component | Why it is a twin |
|---|---|---|
| Menu bar | `src/components/Navbar.jsx` | clock from `dayjs()`, Radix menus |
| Dock | `src/components/Dock.jsx` | GSAP and react-tooltip |
| Welcome | `src/components/Welcome.jsx` | GSAP and mouse events |
| Windows | `src/windows/*.jsx` | `WindowWrapper` runs GSAP and the Zustand stores |
| Resume | `src/windows/Resume.jsx` | react-pdf loads asynchronously, so the pages are images of the same PDF |
| Music | `src/components/MusicPlayer.jsx` | store state and a CSS keyframe equalizer |

## Motion
- Window values come from `WindowWrapper.jsx`: open with power3.out in 0.4 s, minimize with power2.in in 0.3 s.
- Camera: one desktop, push-ins on each window. It never leaves the wallpaper.

## Claims
- May show: what the README lists, with the UI's own text and real data.
- Must not show or imply: that Nike or any other brand is a client, or results no one can check.
- Approved source for the lines: the README's "Instead of a static resume page, this portfolio works like a small operating system."

## Workspace
- Folder: `videos/`, its own package. Remotion 4.0.540, pinned. Tailwind through `@remotion/tailwind-v4`, on the site's real `src/index.css`.
- No Bun or uv here: scripts run with Node 24 and a local `.venv` with numpy, imageio-ffmpeg and pymupdf.
- Scripts: `prepare-assets.py`, `beats.py`, `audio-edit.py`, `make-sfx.py`, `stills.ts`, `render.ts`, `verify.py`.
- `public/`, `out/` and `.venv/` stay out of git. To rebuild from a fresh clone, inside `videos/`:

```bash
npm install
python -m venv .venv
.venv/Scripts/python -m pip install numpy imageio-ffmpeg pymupdf
.venv/Scripts/python scripts/prepare-assets.py
.venv/Scripts/python scripts/audio-edit.py src/videos/portfolio-promo/edit.json
.venv/Scripts/python scripts/make-sfx.py
node scripts/render.ts PortfolioPromo hamsell-portfolio-promo --duration 30 --poster 28.5 --out out/portfolio-promo/v2
```
