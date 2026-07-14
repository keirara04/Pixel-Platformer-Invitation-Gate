import json

W, H = 24, 40

palette = {
    "bg": None,
    "face": "#fbfbf9",
    "face_shadow": "#e7e4df",
    "patch": "#2b2b2b",
    "sparkle": "#ffffff",
    "nose": "#3a3a3a",
    "top": "#bfe3c9",
    "top_shadow": "#9cc7a9",
    "pants": "#6e7f9c",
    "pants_shadow": "#57647a",
    "shoe": "#f5efe0",
    "shoe_shadow": "#d8cfb8",
}

grid = [["bg"] * W for _ in range(H)]

def rect(x, y, w, h, color):
    for row in range(y, y + h):
        for col in range(x, x + w):
            if 0 <= row < H and 0 <= col < W:
                grid[row][col] = color

# Ears — rounded blobs at the very top, tapering into the head.
rect(4, 0, 3, 2, "patch")
rect(17, 0, 3, 2, "patch")
rect(3, 2, 5, 3, "patch")
rect(16, 2, 5, 3, "patch")

# Head / face
rect(7, 3, 10, 1, "face")     # top taper between ears
rect(6, 4, 12, 11, "face")    # main face block
rect(6, 13, 12, 2, "face_shadow")  # jaw shading
rect(7, 15, 10, 2, "face")    # neck taper

# Eye patches, with a white nose-bridge gap left between them
rect(6, 6, 4, 5, "patch")
rect(14, 6, 4, 5, "patch")
rect(7, 7, 1, 1, "sparkle")
rect(15, 7, 1, 1, "sparkle")

# Nose
rect(11, 10, 2, 2, "nose")

# Body — same scale/positions as the human sprite for gameplay consistency
rect(4, 17, 16, 3, "top")            # shoulders
rect(6, 20, 12, 8, "top")            # waist
rect(6, 26, 12, 2, "top_shadow")     # hem shading
rect(2, 20, 3, 9, "face")            # left arm / paw
rect(19, 20, 3, 9, "face")           # right arm / paw
rect(2, 29, 3, 1, "face")            # left paw
rect(19, 29, 3, 1, "face")           # right paw
rect(6, 28, 5, 8, "pants")           # left leg
rect(13, 28, 5, 8, "pants")          # right leg
rect(6, 34, 5, 2, "pants_shadow")    # ankle shading left
rect(13, 34, 5, 2, "pants_shadow")   # ankle shading right
rect(5, 36, 7, 4, "shoe")            # left shoe
rect(12, 36, 7, 4, "shoe")           # right shoe
rect(5, 38, 7, 2, "shoe_shadow")     # left shoe shading
rect(12, 38, 7, 2, "shoe_shadow")    # right shoe shading

data = {
    "version": "1",
    "width": W,
    "height": H,
    "palette": palette,
    "frames": [
        {"duration": 1000, "grid": grid}
    ],
}

with open("character_panda.json", "w") as f:
    json.dump(data, f)

print("wrote character_panda.json", W, "x", H)
