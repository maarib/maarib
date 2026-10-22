# Desk

Draws `../assets/desk.svg`, the image on the profile README: a wooden table seen from above with an open passport, team folders, logo stickers on a cutting mat, a side projects newspaper, an envelope, desk clutter and a launch terminal. It's pixel art written as SVG, with embedded fonts and CSS animation, so GitHub shows it as one image.

```bash
npm install
npm run build    # writes ../assets/desk.svg
```

Node 22 or later.

| File | What it is |
|---|---|
| `build.mjs` | Draws the desk. Each section (`about`, `teams`, `stack`, `projects`, `contact`) is a function; the text lives in `TEAMS`, `TOOLS`, `PROJECTS` and `STAMPS` |
| `hero.mjs` | The terminal at the end: types `whoami` and `./startproject`, then the cat pops up |
| `pixel-logos.mjs` | Turns the logos in `data/logos/` into 18×18 pixel grids in `data/pixel-logos.json` |
| `data/` | The cat as pixels and as characters, the logos, and their pixel grids |

## Changing the stack stickers

Add the logo as `data/logos/<name>.svg` and its name to `names` in `pixel-logos.mjs`, run `npm run logos`, then add it to `TOOLS` in `build.mjs` and run `npm run build`. `npm run logos` needs a Chromium; set `CHROMIUM_PATH` if Playwright doesn't find one.
