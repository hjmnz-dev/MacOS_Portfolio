"""Synthesizes the film's one sound effect: a short, dry click with its peak at the start.

    .venv/Scripts/python scripts/make-sfx.py
"""

import wave
from pathlib import Path

import numpy as np

SR = 48000
out = Path(__file__).resolve().parent.parent / "public/audio/portfolio-promo/sfx"
out.mkdir(parents=True, exist_ok=True)

length = int(0.03 * SR)
time = np.arange(length) / SR
noise = np.random.default_rng(7).normal(size=length)
click = (0.6 * noise + 0.8 * np.sin(2 * np.pi * 1900 * time)) * np.exp(-time * 320)
click = click / np.abs(click).max() * 0.8

with wave.open(str(out / "click.wav"), "wb") as handle:
    handle.setnchannels(1)
    handle.setsampwidth(2)
    handle.setframerate(SR)
    handle.writeframes((click * 32767).astype(np.int16).tobytes())
