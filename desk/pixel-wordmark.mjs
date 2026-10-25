// Rasterize "Canada" in a Baskerville bold (the official wordmark's face) to a pixel grid,
// for the passport's top corner. The flag over the last "a" is drawn by hand in build.mjs.
// Run: npm run wordmark  (needs a Chromium; set CHROMIUM_PATH if it isn't found)
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
const HERE = fileURLToPath(new URL('.', import.meta.url))
const font = readFileSync(`${HERE}node_modules/@fontsource/libre-baskerville/files/libre-baskerville-latin-700-normal.woff2`).toString('base64')
const SIZE = +(process.env.SIZE || 14)
// Alpha above which a pixel counts as ink; low enough that the thin hairlines stay joined
const THRESH = +(process.env.THRESH || 62)
const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--headless=new'] })
const p = await b.newPage()
const rows = await p.evaluate(async ({ font, SIZE, THRESH }) => {
  const f = new FontFace('Bask', `url(data:font/woff2;base64,${font})`); await f.load(); document.fonts.add(f)
  const c = document.createElement('canvas'); c.width = 80; c.height = 24
  const g = c.getContext('2d'); g.font = `${SIZE}px Bask`; g.textBaseline = 'alphabetic'; g.fillText('Canada', 1, 18)
  const d = g.getImageData(0, 0, c.width, c.height).data, out = []
  for (let y = 0; y < c.height; y++) { let r = ''; for (let x = 0; x < c.width; x++) r += d[(y * c.width + x) * 4 + 3] > THRESH ? '#' : '.'; out.push(r) }
  // trim empty rows and columns
  const ys = out.map((r, i) => (r.includes('#') ? i : -1)).filter((i) => i >= 0), t = out.slice(ys[0], ys.at(-1) + 1)
  const xs = [...t[0]].map((_, x) => t.some((r) => r[x] === '#')), x0 = xs.indexOf(true), x1 = xs.lastIndexOf(true)
  return t.map((r) => r.slice(x0, x1 + 1))
}, { font, SIZE, THRESH })
await b.close()
// Hand fixes for this size and threshold: the n's foot serif just touches the first a (one pixel apart
// keeps them separate), the n's right leg comes out a pixel thicker than its left, and the first a is the
// cleanest, so it stands in for the other two
if (SIZE === 14 && THRESH === 62) {
  const set = (y, x, c) => { rows[y] = rows[y].slice(0, x) + c + rows[y].slice(x + 1) }
  set(11, 29, '.')
  for (let y = 7; y <= 10; y++) set(y, 28, '.')
  const A = rows.slice(4, 12).map((r) => r.slice(12, 19))
  for (const x0 of [30, 48]) for (let j = 0; j < 8; j++) rows[4 + j] = rows[4 + j].slice(0, x0) + A[j] + '.' + rows[4 + j].slice(x0 + 8)
}
writeFileSync(`${HERE}data/canada-wordmark.json`, JSON.stringify(rows))
console.log(rows.join('\n'))
