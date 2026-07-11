import json

W, H = 16, 8

palette = {
    "bg": None,
    "spike": "#8a8a9a",
    "spike_shadow": "#5f5f6e",
    "outline": "#150f1a",
}

grid = [["bg"] * W for _ in range(H)]

def rect(x, y, w, h, color):
    for row in range(y, y + h):
        for col in range(x, x + w):
            if 0 <= row < H and 0 <= col < W:
                grid[row][col] = color

def triangle(cx, base_y, half_width, height, color):
    for row in range(height):
        y = base_y - row
        w = max(1, half_width * 2 - row * 2)
        x = cx - w // 2
        rect(x, y, w, 1, color)

triangle(2, 7, 3, 6, "spike")
triangle(8, 7, 3, 6, "spike")
triangle(13, 7, 3, 6, "spike")
rect(0, 7, 16, 1, "spike_shadow")
rect(0, 6, 16, 1, "outline")

data = {
    "version": "1",
    "width": W,
    "height": H,
    "palette": palette,
    "frames": [{"duration": 1000, "grid": grid}],
}

with open("hazard.json", "w") as f:
    json.dump(data, f)

print("wrote hazard.json", W, "x", H)
