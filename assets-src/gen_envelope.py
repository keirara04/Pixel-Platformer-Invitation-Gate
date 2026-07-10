# assets-src/gen_envelope.py
import json

W, H = 48, 40

PALETTE = {
    "bg": None,
    "envelope": "#ecdfc2",
    "envelope_shadow": "#d3c39a",
    "seal": "#ff5d8f",
    "seal_dark": "#e0446f",
    "paper": "#fffaf5",
    "ink": "#150f1a",
}

def blank():
    return [["bg"] * W for _ in range(H)]

def rect(grid, x, y, w, h, color):
    for row in range(y, y + h):
        for col in range(x, x + w):
            if 0 <= row < H and 0 <= col < W:
                grid[row][col] = color

def heart(grid, cx, cy, color, color_dark):
    cells = [
        (-2, -2, color), (-1, -2, color), (1, -2, color), (2, -2, color),
        (-2, -1, color), (-1, -1, color_dark), (0, -1, color), (1, -1, color_dark), (2, -1, color),
        (-1, 0, color), (0, 0, color_dark), (1, 0, color),
        (0, 1, color),
    ]
    for dx, dy, c in cells:
        x, y = cx + dx, cy + dy
        if 0 <= y < H and 0 <= x < W:
            grid[y][x] = c

def write(name, grid):
    with open(f"{name}.json", "w") as f:
        json.dump(
            {"version": "1", "width": W, "height": H, "palette": PALETTE,
             "frames": [{"duration": 1000, "grid": grid}]},
            f,
        )
    print(f"wrote {name}.json {W}x{H}")

# ---- Closed envelope: body + a downward-pointing flap triangle + wax seal.
closed = blank()
rect(closed, 2, 10, 44, 26, "envelope")
apex_y = 22
for row in range(10, apex_y + 1):
    shrink = (row - 10) * 2
    half = max(0, 22 - shrink)
    w = half * 2
    if w <= 0:
        continue
    rect(closed, 24 - half, row, w, 1, "envelope_shadow")
heart(closed, 24, 18, "seal", "seal_dark")
write("envelope_closed", closed)

# ---- Open envelope: body + small folded-back corner flaps + letter peeking out.
opened = blank()
rect(opened, 2, 10, 44, 26, "envelope")
for row in range(6, 11):
    shrink = (row - 6) * 2
    w = max(0, 10 - shrink)
    if w <= 0:
        continue
    rect(opened, 3, row, w, 1, "envelope_shadow")
    rect(opened, 45 - w, row, w, 1, "envelope_shadow")
rect(opened, 10, 0, 28, 14, "paper")
rect(opened, 13, 4, 22, 1, "ink")
rect(opened, 13, 7, 18, 1, "ink")
heart(opened, 24, 10, "seal", "seal_dark")
write("envelope_open", opened)
