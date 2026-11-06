"""Copies the portfolio assets the film uses into videos/public and renders the resume to an image.

    .venv/Scripts/python scripts/prepare-assets.py
"""

import shutil
from pathlib import Path

import pymupdf

here = Path(__file__).resolve().parent.parent
site = here.parent / "public"
out = here / "public"

for folder in ("images", "icons"):
    target = out / folder
    target.mkdir(parents=True, exist_ok=True)
    for item in (site / folder).iterdir():
        if item.is_file():
            shutil.copy2(item, target / item.name)

music = out / "audio" / "portfolio-promo" / "music"
music.mkdir(parents=True, exist_ok=True)
shutil.copy2(site / "music" / "notanico-merengue.mp3", music / "notanico-merengue.mp3")

fonts = out / "fonts"
fonts.mkdir(parents=True, exist_ok=True)
sources = here / "node_modules" / "@fontsource-variable"
for name in (
    "georama/files/georama-latin-wght-normal.woff2",
    "georama/files/georama-latin-wght-italic.woff2",
    "roboto-mono/files/roboto-mono-latin-wght-normal.woff2",
):
    shutil.copy2(sources / name, fonts / Path(name).name)

# react-pdf draws the real viewer on its own clock, so the film uses the same page as an image
pdf = pymupdf.open(site / "files" / "resume-en.pdf")
for index, page in enumerate(pdf):
    print(f"resume page {index + 1}: {page.rect.width} x {page.rect.height}")
    page.get_pixmap(matrix=pymupdf.Matrix(3, 3)).save(out / "images" / f"resume-en-{index + 1}.png")
