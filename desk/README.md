# Desk

Welcome to my desk! In this file, you can find the code behind everything. I wanted my README to feel like my actual table: passport open, folders everywhere, stickers peeling off the cutting mat, a cigarette pack I definitely shouldn't have, and a terminal at the bottom about to start something new.

It's all pixel art, with ZERO image files. Every pixel is drawn in code and written out as one SVG with the fonts and animations baked in, so GitHub shows it like any other image.

## Run it

```bash
npm install
npm run build    # writes ../assets/desk.svg
```

You'll need Node 22 or later.

## What's in here

| File | What it does |
|---|---|
| `build.mjs` | Draws the whole desk. Each section (`about`, `teams`, `stack`, `projects`, `contact`) is its own function, and the words live in `TEAMS`, `TOOLS`, `PROJECTS` and `STAMPS` |
| `hero.mjs` | The terminal at the end. It types `whoami` and `./startproject`, then a cat shows up |
| `pixel-logos.mjs` | Shrinks the logos in `data/logos/` down to 18×18 pixel grids |
| `data/` | The cat (as pixels and as text), the logos, and their pixel versions |

## Adding a sticker

When I pick up a new tool, here's how it gets a sticker:

1. Drop the logo in `data/logos/<name>.svg` and add the name to `names` in `pixel-logos.mjs`
2. Run `npm run logos`
3. Add it to `TOOLS` in `build.mjs` and run `npm run build`

`npm run logos` needs Chromium. If Playwright can't find it, set `CHROMIUM_PATH`.
