import json

W, H = 24, 40

palette = {
    "bg": None,
    "hair": "#2b2330",
    "hair_dark": "#1c1720",
    "skin": "#f4c9a0",
    "skin_shadow": "#e3ad7f",
    "glasses": "#150f1a",
    "top": "#c9c3cc",
    "top_shadow": "#a89fb0",
    "pants": "#2e2a33",
    "pants_shadow": "#211d27",
    "shoe": "#f5efe0",
    "shoe_shadow": "#d8cfb8",
    "bag": "#a99a6b",
    "bag_shadow": "#8c7d52",
    "outline": "#150f1a",
}

grid = [["bg"] * W for _ in range(H)]

def rect(x, y, w, h, color):
    for row in range(y, y + h):
        for col in range(x, x + w):
            if 0 <= row < H and 0 <= col < W:
                grid[row][col] = color

# Paint order matters -- later calls overwrite earlier ones.
rect(8, 0, 8, 2, "hair")                # crown/bangs
rect(3, 2, 5, 15, "hair")               # left side hair
rect(16, 2, 5, 15, "hair")              # right side hair
rect(3, 17, 3, 6, "hair")               # left drape past shoulder
rect(18, 17, 3, 6, "hair")              # right drape past shoulder
rect(8, 2, 8, 13, "skin")               # face
rect(8, 15, 8, 2, "skin")               # neck (full jaw width, avoids gap next to hair)
rect(8, 7, 3, 3, "glasses")             # left lens
rect(13, 7, 3, 3, "glasses")            # right lens
rect(11, 7, 2, 1, "glasses")            # bridge
rect(4, 17, 16, 3, "top")               # shoulders
rect(6, 20, 12, 8, "top")               # waist
rect(6, 26, 12, 2, "top_shadow")        # hem shading
rect(2, 20, 3, 9, "skin")               # left arm
rect(19, 20, 3, 9, "skin")              # right arm
rect(2, 29, 3, 1, "skin")               # left hand
rect(19, 29, 3, 1, "skin")              # right hand
rect(15, 16, 2, 14, "bag")              # strap
rect(6, 28, 5, 8, "pants")              # left leg
rect(13, 28, 5, 8, "pants")             # right leg
rect(6, 34, 5, 2, "pants_shadow")       # ankle shading left
rect(13, 34, 5, 2, "pants_shadow")      # ankle shading right
rect(15, 27, 5, 5, "bag")               # hip pouch
rect(15, 30, 5, 2, "bag_shadow")        # pouch shading
rect(5, 36, 7, 4, "shoe")               # left shoe
rect(12, 36, 7, 4, "shoe")              # right shoe
rect(5, 38, 7, 2, "shoe_shadow")        # left shoe shading
rect(12, 38, 7, 2, "shoe_shadow")       # right shoe shading

data = {
    "version": "1",
    "width": W,
    "height": H,
    "palette": palette,
    "frames": [
        {"duration": 1000, "grid": grid}
    ],
}

with open("character.json", "w") as f:
    json.dump(data, f)

print("wrote character.json", W, "x", H)
