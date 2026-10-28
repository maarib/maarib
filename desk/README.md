# Desk

Welcome to my desk! In this file, you can find the code behind everything. I wanted my README to feel like my actual table: passport open, folders everywhere, stickers peeling off the cutting mat, a cigarette pack I definitely shouldn't have, and a terminal at the bottom about to start something new.

It's all pixel art, with ZERO image files. Every pixel is drawn in code and written out as one SVG with the fonts and animations baked in, so GitHub shows it like any other image.

## Run it

```bash
npm install
npm run build    # writes the images in ../assets
```

You'll need Node 22 or later.

## What's in here

| File | What it does |
|---|---|
| `build.mjs` | Draws the whole desk. Each section (`about`, `teams`, `stack`, `projects`, `contact`) is its own function, and the words live in `TEAMS`, `TOOLS`, `PROJECTS` and `STAMPS` |
| `hero.mjs` | The terminal at the end. It types `whoami` and `npm install maarib`, times out after 5 seconds and starts over |
| `intro.mjs` | The intro on top, in a light and a dark version: "Hi, I'm Maarib" and the designer line whose first word keeps flipping (`WORDS`) |
| `projects.mjs` | The side projects newspaper under the desk, one clickable clipping per project (`PROJECTS`) |
| `sayhi.mjs` | The Say hi keys, one clickable key per link (`CONTACTS`) |
| `pixel.mjs` | Drawing helpers shared by the three above |
| `pixel-logos.mjs` | Shrinks the logos in `data/logos/` down to 18×18 pixel grids |
| `pixel-wordmark.mjs` | Turns "Canada" into the pixel wordmark on the passport |
| `tools/shot.mjs` | Takes screenshots of a built image the way GitHub shows it, cropped and zoomed, to check a change. It can also take a few frames in a row to catch an animation partway through |
| `tools/ds4-trace.py` | Traces the PS4 controller from a top-down photo into `data/ds4.json`. Needs Python with Pillow |
| `data/` | The cat (as pixels), my passport portrait (62×74 at half-pixel size: ink lines in `me-pixels`, coloured in `me-colour`, closed eyes for the blink in `me-blink`), the logos and their pixel versions, the Canada wordmark, and the PS4 controller |

## Adding a sticker

When I pick up a new tool, here's how it gets a sticker:

1. Drop the logo in `data/logos/<name>.svg` and add the name to `names` in `pixel-logos.mjs`
2. Run `npm run logos`
3. Add it to `TOOLS` in `build.mjs` and run `npm run build`

`npm run logos` and `tools/shot.mjs` need Chromium. If Playwright can't find it, set `CHROMIUM_PATH`.
