"""Bake the 'photo melts' effect into a copy of the towers photo.

A Liquify-style downward smear: below a start line, each point takes its color from higher up the same column,
reaching further the deeper it is, so the photo stretches down in runs. Columns get different strengths
(smooth noise across x), so the runs have different lengths, and a gentle sideways wander curls them.

usage (from the repo root):
  python3 -I scripts/bake-melt.py assets/photography/port1-5.jpg assets/photography/port1-5-melt.jpg
Needs numpy, Pillow and scipy. The seed is fixed, so re-running gives the same image.
"""

import sys

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, gaussian_filter1d, map_coordinates

src, dst = sys.argv[1], sys.argv[2]
img = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
H, W, _ = img.shape
rng = np.random.default_rng(7)

Y0 = 0.30 * H  # where the melt begins (just above the ledge the light falls to)
Y1 = 0.58 * H  # where it is at full strength


def smooth_noise_1d(n, sigma):
    v = gaussian_filter1d(rng.standard_normal(n), sigma, mode="wrap")
    return (v - v.min()) / (v.max() - v.min())


# Column strength: broad variation plus narrower runs, 0.25..1
t = 0.6 * smooth_noise_1d(W, 110) + 0.4 * smooth_noise_1d(W, 22)
t = 0.25 + 0.75 * (t - t.min()) / (t.max() - t.min())

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
depth = np.clip((yy - Y0) / (Y1 - Y0), 0, 1)
depth = depth * depth * (3 - 2 * depth)  # ease in, so the start is seamless

# Reach back up the column: up to 88% of the distance to the start line
reach = 0.88 * t[None, :] * depth
src_y = yy - reach * np.maximum(yy - Y0, 0)

# Sideways wander, smooth in both directions, growing with depth
wander = gaussian_filter(rng.standard_normal((H // 48, W // 48)), 2)
wander = np.kron(wander / np.abs(wander).max(), np.ones((48, 48), dtype=np.float32))[:H, :W]
wander = gaussian_filter(wander, 24)  # smooth the block edges away
src_x = xx + 55 * wander / np.abs(wander).max() * depth

out = np.stack([map_coordinates(img[..., c], [src_y, src_x], order=1, mode="nearest") for c in range(3)], -1)

# A little vertical softening inside the runs, like wet paint, only where the melt is
soft = np.stack([gaussian_filter1d(out[..., c], 3, axis=0) for c in range(3)], -1)
out = out + (soft - out) * depth[..., None]

Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(dst, quality=88, optimize=True)
print("wrote", dst)
