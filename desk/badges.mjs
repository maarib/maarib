// Downloads the stack and contact badges from shields.io into ../assets/badges,
// so the README loads them from this repo instead of through GitHub's image proxy.
// Edit data/badges.json to add or change a badge, then run `npm run badges`.
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";

const badges = JSON.parse(await readFile(new URL("data/badges.json", import.meta.url), "utf8"));
const dir = new URL("../assets/badges/", import.meta.url);
await mkdir(dir, { recursive: true });

async function get(url) {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(url);
    if (res.ok) {
      const svg = await res.text();
      if (svg.startsWith("<svg")) return svg;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Could not download ${url}`);
}

const keep = new Set();
for (const b of badges) {
  for (const [file, url] of [[`${b.name}.svg`, b.light], [`${b.name}-dark.svg`, b.dark]]) {
    await writeFile(new URL(file, dir), await get(url));
    keep.add(file);
  }
}

// Remove badges that are no longer in the list.
for (const file of await readdir(dir)) if (!keep.has(file)) await unlink(new URL(file, dir));

console.log(`badges: ${badges.length} light and dark pairs in assets/badges`);
