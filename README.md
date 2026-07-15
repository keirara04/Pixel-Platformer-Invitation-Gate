# Pixel Birthday Invitation

A single-page birthday party invitation styled like a retro game's "achievement unlocked" screen — HUD-bracket panels, an arcade-style countdown, a photo gallery framed as collected memories, and looping background music. Built with Next.js (App Router) and Tailwind CSS.

## The flow

Visiting the site walks through several stages (see [app/page.tsx](app/page.tsx)):

1. **Password gate** ([components/PasswordGate.tsx](components/PasswordGate.tsx)) — the site is locked behind a numeric password (`SITE_PASSWORD` in [lib/siteAccess.ts](lib/siteAccess.ts)), required on every visit/refresh. This is a fun "private link" gate, not real security — the check runs client-side.
2. **Welcome page** ([components/WelcomeContent.tsx](components/WelcomeContent.tsx)) — a short intro screen before the game starts. Skipped for returning guests who've already finished the game (they go straight to the invite).
3. **Character select** ([components/game/CharacterSelect.tsx](components/game/CharacterSelect.tsx)) — pick who to play as. Two bonus characters (panda, cat) unlock as bonus stars are collected across playthroughs — see "Characters" below.
4. **Platformer game** ([components/game/PixelGame.tsx](components/game/PixelGame.tsx)) — a short Kaplay-powered level per checkpoint; collect the memory photos and reach the cake. Between levels, a relationship-question gate ([components/game/QuestionGate.tsx](components/game/QuestionGate.tsx)) must be answered correctly to continue.
5. **Love letter** ([components/game/LoveLetter.tsx](components/game/LoveLetter.tsx)) — a placeholder final message shown after winning, before the invite.
6. **Invitation** ([components/InviteContent.tsx](components/InviteContent.tsx)) — the actual invite: mission briefing (date/time/location/dress code), schedule, an RSVP with a playful "no isn't really an option" button chain, countdown, photo gallery, and bonus star tally. Panels tilt interactively (mouse hover / touch drag) via [components/TiltCard.tsx](components/TiltCard.tsx), and the page has scroll-driven parallax via [lib/useParallaxScroll.ts](lib/useParallaxScroll.ts).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Customizing the invite

All party details currently use placeholders. To personalize:

- **Password** — set `SITE_PASSWORD` in [lib/siteAccess.ts](lib/siteAccess.ts).
- **Name, age, date, time, location, dress code** — edit the constants at the top of [components/InviteContent.tsx](components/InviteContent.tsx) (`GUEST_OF_HONOR`, `AGE_TURNING`, `PARTY_DATE`, `PARTY_TIME_LABEL`, `PARTY_LOCATION`, `DRESS_CODE`).
- **Schedule** — edit the `SCHEDULE` array in [components/InviteContent.tsx](components/InviteContent.tsx).
- **Photos** — The `MEMORY_PHOTOS` array in [components/photos.ts](components/photos.ts) points at 6 files in `public/images/` (`photo-1.jpg` … `photo-6.jpg`). Swap those files for your own; they're gitignored so personal photos never get committed. See `public/images/README.md`.
- **Background music** — drop a royalty-free chiptune/8-bit MP3 at `public/audio/theme.mp3`. See `public/audio/README.md`. Playback starts automatically as soon as the page loads (with a fallback to the first key/click if the browser blocks autoplay) via [components/BackgroundMusic.tsx](components/BackgroundMusic.tsx), and loops continuously through both the game and the invite. The speaker icon in the bottom-right corner mutes/unmutes it.
- **Game gate** — the site requires visitors to complete the pixel platformer game before viewing the invitation. The game's collectibles are pulled from `components/photos.ts` (the same photo source as the gallery), so customizing the photos automatically updates the game collectibles.
- **Level questions & love letter** — `components/game/questions.ts` has 2 placeholder relationship questions (shown between levels) and `components/game/LoveLetter.tsx` has a placeholder final message (shown after winning, before the invite). Replace the `answer`/`hint` values and the `LETTER_MESSAGE` constant with real ones — answer matching is case/whitespace-lenient, so it doesn't need to be exact.

## Characters

[components/characters.ts](components/characters.ts) defines the playable roster. The first character is always unlocked; the other two (panda, cat) unlock after collecting 3 and 7 bonus stars respectively (tracked in [lib/gameStats.ts](lib/gameStats.ts)). Sprite art for all three is generated with the `pixel-art` skill — see [assets-src/README.md](assets-src/README.md) for how to regenerate or add more.

## Theme

The pastel pixel look lives in [app/globals.css](app/globals.css):
- Color palette: pink, mint, lavender, butter, peach, plum ink (text/borders), and a coral-pink accent reserved for the HUD signature elements.
- `.pixel-border` / `.pixel-border-sm` / `.pixel-btn` utility classes give the stepped/blocky pixel-art border look via stacked `box-shadow`s. `.hud-panel` + `.hud-corner-*` add the bracket-cornered "viewfinder" frame used by [components/HudPanel.tsx](components/HudPanel.tsx) and the countdown tiles.
- Three fonts loaded via `next/font` in [app/layout.tsx](app/layout.tsx): `Press Start 2P` (blocky display headline, used sparingly), `VT323` (arcade-scoreboard digits for the countdown/HUD readouts), and `Nunito` (body text).
- All decorative icons (balloons, stars, sparks, speaker, replay, close) are hand-drawn pixel-grid SVGs in [components/icons/](components/icons/) rather than emoji, so they render identically everywhere.

## Verifying changes

```bash
npm run build   # production build — catches type/lint errors
npm run dev     # manual check in the browser
```

## Deploying

This project deploys cleanly to [Vercel](https://vercel.com/new). Connect the repo (or run `vercel deploy` from the CLI) — no environment variables are required.
