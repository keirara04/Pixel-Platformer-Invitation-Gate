import json

W, H = 24, 40

palette = {
    "bg": None,
    "face": "#f6d9b0",
    "face_shadow": "#e6c199",
    "belly": "#fdf0dc",
    "ear_inner": "#f3a9c2",
    "stripe": "#d9a86b",
    "eye": "#8fbf7a",
    "pupil": "#2b2330",
    "nose": "#e8879e",
    "whisker": "#8a7361",
}

grid = [["bg"] * W for _ in range(H)]

def rect(x, y, w, h, color):
    for row in range(y, y + h):
        for col in range(x, x + w):
            if 0 <= row < H and 0 <= col < W:
                grid[row][col] = color

# Ears — pointed triangles, tapering from a 1px apex to a 5px base.
rect(5, 0, 1, 1, "face")
rect(4, 1, 3, 2, "face")
rect(3, 3, 5, 2, "face")
rect(18, 0, 1, 1, "face")
rect(17, 1, 3, 2, "face")
rect(16, 3, 5, 2, "face")
rect(5, 2, 1, 2, "ear_inner")
rect(18, 2, 1, 2, "ear_inner")

# Head / face
rect(7, 3, 10, 1, "face")     # top taper between ears
rect(6, 4, 12, 11, "face")    # main face block
rect(6, 13, 12, 2, "face_shadow")  # jaw shading
rect(7, 15, 10, 2, "face")    # neck taper

# Tabby forehead marks
rect(9, 4, 2, 2, "stripe")
rect(13, 4, 2, 2, "stripe")

# Eyes
rect(8, 7, 2, 2, "eye")
rect(14, 7, 2, 2, "eye")
rect(8, 8, 1, 1, "pupil")
rect(15, 8, 1, 1, "pupil")

# Nose
rect(11, 10, 2, 1, "nose")

# Whiskers — thin lines extending past the cheeks
rect(2, 10, 4, 1, "whisker")
rect(2, 12, 4, 1, "whisker")
rect(18, 10, 4, 1, "whisker")
rect(18, 12, 4, 1, "whisker")

# Body — a furry animal body (no clothes), same overall scale/positions as
# the other sprites so the collision box and jump pose still line up.
rect(4, 17, 16, 3, "face")           # shoulders
rect(6, 20, 12, 8, "face")           # torso
rect(9, 21, 6, 6, "belly")           # lighter belly patch
rect(6, 26, 12, 2, "face_shadow")    # haunch shading
rect(2, 20, 3, 9, "face")            # left arm / paw
rect(19, 20, 3, 9, "face")           # right arm / paw
rect(2, 29, 3, 1, "face_shadow")     # left paw toes
rect(19, 29, 3, 1, "face_shadow")    # right paw toes
rect(6, 28, 5, 8, "face")            # left leg
rect(13, 28, 5, 8, "face")           # right leg
rect(6, 34, 5, 2, "face_shadow")     # haunch/ankle shading left
rect(13, 34, 5, 2, "face_shadow")    # haunch/ankle shading right
rect(5, 36, 7, 4, "face")            # left foot
rect(12, 36, 7, 4, "face")           # right foot
rect(6, 38, 1, 1, "face_shadow")     # left foot toe dividers
rect(8, 38, 1, 1, "face_shadow")
rect(10, 38, 1, 1, "face_shadow")
rect(13, 38, 1, 1, "face_shadow")    # right foot toe dividers
rect(15, 38, 1, 1, "face_shadow")
rect(17, 38, 1, 1, "face_shadow")

# Small curled tail peeking out on the right side — a continuous S-curve
# tapering from the hip up and out, rather than disconnected blocks.
rect(21, 20, 2, 2, "face")
rect(22, 22, 2, 2, "face")
rect(21, 24, 2, 2, "face")
rect(20, 26, 2, 2, "face")
rect(19, 28, 2, 2, "face")

data = {
    "version": "1",
    "width": W,
    "height": H,
    "palette": palette,
    "frames": [
        {"duration": 1000, "grid": grid}
    ],
}

with open("character_cat.json", "w") as f:
    json.dump(data, f)

print("wrote character_cat.json", W, "x", H)
