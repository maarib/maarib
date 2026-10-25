// Screenshot a built SVG the way GitHub shows it (as an <img>), to check a change.
// Run: node tools/shot.mjs ../assets/desk.svg /tmp/desk [--wait 3000] [--scale 2] [--frames 4 --every 300] [crop ...]
//   crop: "y:h" (full width) or "x:y:w:h", in the SVG's own pixels. No crops = the whole image.
//   Writes <out>-<crop>.png, or <out>-<crop>-<frame>.png with --frames (to catch an animation mid-way).
// Needs a Chromium: set CHROMIUM_PATH if Playwright can't find one.
import { chromium } from 'playwright-core'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2), opt = { wait: 3000, scale: 1, frames: 1, every: 300 }, crops = []
for (let i = 0; i < args.length; i++) { const a = args[i]; if (a.startsWith('--')) opt[a.slice(2)] = +args[++i]; else crops.push(a) }
const [svg, out] = crops.splice(0, 2).map((p) => resolve(p))
if (!svg || !out) { console.error('usage: node tools/shot.mjs <svg> <out-prefix> [options] [crop ...]'); process.exit(1) }

const [w, h] = readFileSync(svg, 'utf8').match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number)
// An <img> on a file:// page, so the SVG renders sandboxed like it does on GitHub
const page = join(tmpdir(), 'desk-shot.html')
writeFileSync(page, `<body style="margin:0"><img src="${pathToFileURL(svg)}" width="${w}" style="display:block"></body>`)
const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--headless=new'] })
const p = await b.newPage({ viewport: { width: Math.ceil(w), height: Math.ceil(Math.min(h, 8000)) }, deviceScaleFactor: opt.scale })
await p.goto(pathToFileURL(page).href)
await p.waitForTimeout(opt.wait)
const clips = (crops.length ? crops : [`0:${h}`]).map((c) => { const n = c.split(':').map(Number); return n.length === 2 ? { x: 0, y: n[0], width: w, height: n[1] } : { x: n[0], y: n[1], width: n[2], height: n[3] } })
for (let f = 0; f < opt.frames; f++) {
  for (const [i, clip] of clips.entries()) await p.screenshot({ path: `${out}-${i}${opt.frames > 1 ? '-' + f : ''}.png`, clip, fullPage: true })
  if (f < opt.frames - 1) await p.waitForTimeout(opt.every)
}
await b.close()
console.log('wrote', clips.length * opt.frames, 'screenshots')
