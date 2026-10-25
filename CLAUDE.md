# maarib/maarib

My GitHub profile README. Everything on it is pixel art drawn in code: `desk/` holds the scripts, and `assets/` holds the SVGs they write. Never edit `assets/` by hand. Change the script, then rebuild.

## Build and check

```bash
cd desk
npm install
npm run build    # writes everything in ../assets
```

- Node 22 or later. `npm run logos` (re-pixelates `data/logos/`) and `tools/shot.mjs` need Chromium. On my Mac, set `CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`.
- Check every visual change with a screenshot before calling it done: `node tools/shot.mjs ../assets/desk.svg /tmp/desk --scale 2 <crop>`. Look at the screenshot itself, not just the code. Use `--frames` for animations.
- After a build, `git status` should only show the files you meant to change. If unrelated assets change, something shifted.

## How I like to work

- **Branch first.** Never commit straight to main. Push the branch, show me the result, and merge only when I say "merge it". Merge with a fast-forward.
- **Commits are mine.** Author: `Maarib <6995978+maarib@users.noreply.github.com>`. No `Co-Authored-By` or session lines, and no model names in commits.
- **No version numbers** in asset names or URLs (no `desk-v2.svg`, no `?v=6`). GitHub caches images for about 5 minutes, so wait for it.
- **Options first for bigger changes.** For a new object or a redesign, show me variations side by side before putting one on the desk.
- **Reference images.** If I send a photo, match the real object: trace its shape and proportions instead of guessing.
- **Writing:** plain, short sentences. `desk/README.md` is in my voice, first person.

## How the desk is drawn

- `desk/build.mjs` draws `assets/desk.svg`: sections stacked down the page (`about` with the passport, `teams` with the folders, `stack`, `classifieds` with The Big 6ix Times, `contact`), then the iPad terminal from `hero.mjs`. Each section returns `{ H, body, label }`.
- Units are art pixels, with `P = 4` screen px per art px and `shape-rendering="crispEdges"`. `R(x, y, w, h, colour)` draws a rect. Half-pixels (0.5) are fine for fine detail.
- `tilt(deg, cx, cy, body)` rotates around an art-pixel point. Most objects sit in one.
- **Randomness:** the global `rnd()` is seeded and shared, so adding or removing a `rnd()` call shifts everything drawn after it, such as the wood grain and sticker angles. New effects use their own local seed (see `wisps()`).
- **Animations** are CSS keyframes inside the SVG (`css` and `FX_CSS`). Every animation respects `prefers-reduced-motion`.
- **Fonts** are embedded from `@fontsource` as data URIs. Families: `Pixel` (Press Start 2P, monospaced), `Pixelify`, `VT`, `Sig`.
- **Labels:** every section has a written description, joined into the SVG's `aria-label`. When something on the desk changes, update its description and the alt text in the top-level `README.md`. `esc()` doesn't escape quotes, so use curly quotes (“ ”) in that text, or the SVG breaks.
- **Links** inside an SVG don't work in a README. Each clickable thing (the side-project clippings and the Say hi keys) is its own image inside an `<a>`. Plain images are wrapped in `<picture>` so GitHub doesn't link them to the raw file.

## Data

- `desk/data/me-colour.json` and `me-blink.json` hold the passport portrait (62×74 half-pixels) and its closed-eye frame. I edit the portrait in the Portrait Editor artifact (https://claude.ai/artifact/S53GkY5Vw9vRPegTXgVhne) and copy my saved state into these files.
- `desk/data/ds4.json` is the PS4 controller, traced by `tools/ds4-trace.py`.
- `desk/data/pixel-logos.json` comes from `npm run logos`. To add a sticker: put the SVG in `data/logos/`, add its name in `pixel-logos.mjs`, run `npm run logos`, then add it to `TOOLS` in `build.mjs`.
