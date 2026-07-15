Source files for generated pixel-art assets, built with the `pixel-art`
Claude Code skill (composes a palette + grid JSON, then rasterizes it —
no external image generation tool involved).

## Main character

`gen_character.py` builds `character.json` (a 24×40 grid of rectangle
regions — hair, face, glasses, top, bag, pants, shoes) and validates/renders
it to a PNG. To regenerate after editing the script:

```bash
cd assets-src
python3 gen_character.py
python3 ~/.claude/skills/pixel-art/validate.py character.json
python3 ~/.claude/skills/pixel-art/render.py character.json ./output/character
cp output/character/frame.png ../public/images/character.png
```

The output PNG is consumed by:
- `components/icons/CharacterSprite.tsx` (invite-page mascot)
- `components/game/PixelGame.tsx` (in-game player sprite, loaded into Kaplay)

## Unlockable characters (panda, cat)

`gen_character_panda.py` and `gen_character_cat.py` build the two bonus
characters on the same 24×40 canvas and body proportions as the main
character, so they line up with the same collision box and jump pose.
To regenerate after editing a script:

```bash
cd assets-src
python3 gen_character_panda.py   # or gen_character_cat.py
python3 ~/.claude/skills/pixel-art/validate.py character_panda.json
python3 ~/.claude/skills/pixel-art/render.py character_panda.json ./output/character_panda
cp output/character_panda/frame.png ../public/images/character-panda.png
```

Consumed by `components/characters.ts` (roster entries `panda` and `cat`,
unlocked after collecting enough bonus stars — see `lib/gameStats.ts`) and
loaded into Kaplay the same way as the main character once selected.

## Enemy, hazard, and star sprites

`gen_enemy.py`, `gen_hazard.py`, and `gen_star.py` each build a small
palette + grid JSON and render it the same way as the character. To
regenerate after editing a script:

```bash
cd assets-src
python3 gen_enemy.py   # or gen_hazard.py / gen_star.py
python3 ~/.claude/skills/pixel-art/validate.py enemy.json
python3 ~/.claude/skills/pixel-art/render.py enemy.json ./output/enemy
cp output/enemy/frame.png ../public/images/enemy.png
```

Consumed by `components/game/PixelGame.tsx` (loaded into Kaplay as the
`enemy`, `hazard`, and `star` sprites).
