# Pixel Birthday Invitation

A single-page birthday party invitation with a pastel pixel-art theme — countdown timer, photo gallery, and background music toggle. Built with Next.js (App Router) and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Customizing the invite

All party details currently use placeholders. To personalize:

- **Name, age, date, time, location** — edit the constants at the top of [app/page.tsx](app/page.tsx) (`GUEST_OF_HONOR`, `AGE_TURNING`, `PARTY_DATE`, `PARTY_TIME_LABEL`, `PARTY_LOCATION`).
- **Photos** — [components/PhotoGallery.tsx](components/PhotoGallery.tsx) currently renders colored placeholder tiles with emoji. Replace the `PLACEHOLDER_TILES` array with real images (drop files in `public/images/` and swap the emoji `<div>` for an `<img>`/`next/image`).
- **Background music** — drop a royalty-free chiptune/8-bit MP3 at `public/audio/theme.mp3`. See `public/audio/README.md`. The mute/play button in the bottom-right corner ([components/MusicToggle.tsx](components/MusicToggle.tsx)) will pick it up automatically.

## Theme

The pastel pixel look lives in [app/globals.css](app/globals.css):
- Color palette: pink, mint, lavender, butter, peach, plus a plum ink color for text/borders.
- `.pixel-border` / `.pixel-border-sm` / `.pixel-btn` utility classes give the stepped/blocky pixel-art border look via stacked `box-shadow`s.
- `Press Start 2P` (pixel font, headings) and `Nunito` (body text) are loaded via `next/font` in [app/layout.tsx](app/layout.tsx).

## Verifying changes

```bash
npm run build   # production build — catches type/lint errors
npm run dev     # manual check in the browser
```

## Deploying

This project deploys cleanly to [Vercel](https://vercel.com/new). Connect the repo (or run `vercel deploy` from the CLI) — no environment variables are required.
