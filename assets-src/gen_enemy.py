import json

W, H = 16, 16

palette = {
    "bg": None,
    "body": "#c97b8f",
    "body_shadow": "#a85c70",
    "eye": "#150f1a",
    "eye_white": "#f4f0e8",
    "outline": "#150f1a",
}

grid = [["bg"] * W for _ in range(H)]

def rect(x, y, w, h, color):
    for row in range(y, y + h):
        for col in range(x, x + w):
            if 0 <= row < H and 0 <= col < W:
                grid[row][col] = color

rect(2, 3, 12, 10, "body")           # main blob
rect(2, 11, 12, 2, "body_shadow")    # bottom shading
rect(4, 6, 3, 3, "eye_white")
rect(9, 6, 3, 3, "eye_white")
rect(5, 7, 1, 1, "eye")
rect(10, 7, 1, 1, "eye")
rect(1, 2, 1, 10, "outline")
rect(14, 2, 1, 10, "outline")
rect(2, 1, 12, 1, "outline")
rect(2, 13, 12, 1, "outline")

data = {
    "version": "1",
    "width": W,
    "height": H,
    "palette": palette,
    "frames": [{"duration": 1000, "grid": grid}],
}

with open("enemy.json", "w") as f:
    json.dump(data, f)

print("wrote enemy.json", W, "x", H)
