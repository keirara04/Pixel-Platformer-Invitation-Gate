import json

W, H = 10, 10

palette = {
    "bg": None,
    "star": "#fff3c4",
    "star_shadow": "#e0c96f",
    "outline": "#150f1a",
}

grid = [["bg"] * W for _ in range(H)]

def rect(x, y, w, h, color):
    for row in range(y, y + h):
        for col in range(x, x + w):
            if 0 <= row < H and 0 <= col < W:
                grid[row][col] = color

rect(4, 0, 2, 2, "star")
rect(3, 2, 4, 2, "star")
rect(0, 4, 10, 2, "star")
rect(1, 6, 8, 1, "star")
rect(2, 7, 2, 2, "star")
rect(6, 7, 2, 2, "star")
rect(3, 8, 1, 1, "star_shadow")
rect(6, 8, 1, 1, "star_shadow")
rect(4, 3, 2, 3, "star_shadow")
rect(4, 4, 2, 1, "outline")

data = {
    "version": "1",
    "width": W,
    "height": H,
    "palette": palette,
    "frames": [{"duration": 1000, "grid": grid}],
}

with open("star.json", "w") as f:
    json.dump(data, f)

print("wrote star.json", W, "x", H)
