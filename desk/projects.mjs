// The side projects under the desk: a newspaper masthead, then one old Mac folder per project.
// Each folder is its own image so the README can link it (links inside an image don't work).
// Run: npm run build  (writes ../assets/projects/*.svg)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { P, C, R, t, wrap, bitmap, seeded, svg } from './pixel.mjs'
const HERE = fileURLToPath(new URL('.', import.meta.url))
const OUT = `${HERE}../assets/projects`
mkdirSync(OUT, { recursive: true })

export const PROJECTS = [
  { slug: 'canopy', name: 'Canopy', desc: 'Fall colors across Canada, and what to explore in Ontario.', url: 'https://maarib.github.io/canopy/', cta: 'VISIT SITE' },
  { slug: 'alert-engine', name: 'alert.engine', desc: 'A stock and ETF watchlist with alerts and market briefs.', url: 'https://github.com/maarib/alert.engine', cta: 'VIEW CODE' },
  { slug: 'page-comments', name: 'page-comments', desc: 'A Claude Code skill for leaving notes on any web page.', url: 'https://github.com/maarib/page-comments', cta: 'VIEW CODE' },
]

// ── A folder: Mac OS 8 Platinum, lavender, with a sheet of paper peeking out ──
const TW = 300, TH = 188, AW = TW / P, AH = TH / P
const F = { out: '#262640', back: '#9a9ae0', front: '#c4c4f6', hi: '#e6e6ff', lo: '#8686c8', ink: '#1b1b38', soft: '#3c3c66', rule: '#c8c8d8' }
// Silhouette: a tab with a stepped slope on the top left, then the body
const shape = (x, y, w, h, tw, c) =>
  R(x + 1, y, tw - 2, 1, c) + R(x, y + 1, tw, 4, c) + R(x + tw, y + 2, 1, 3, c) + R(x + tw + 1, y + 3, 1, 2, c) +
  R(x + 1, y + 4, w - 2, h - 4, c) + R(x, y + 5, w, h - 6, c)
// A 45° arrow, pointing up and right
// Pixelify letter widths in em, from npm run widths
const WIDTHS = JSON.parse(readFileSync(`${HERE}data/pixelify-widths.json`, 'utf8'))
const em = (s) => [...s].reduce((n, ch) => n + (WIDTHS[ch] ?? 0.6), 0)
const ARROW = ['..####', '....##', '...#.#', '..#..#', '.#....', '#.....']
function folder(p, i) {
  const x = 3, y = 3, w = AW - 7, h = AH - 7, tw = Math.round(w * 0.36)
  let o = R(x + 1.5, y + 2, w, h, 'rgba(0,0,0,.28)')
  o += shape(x, y, w, h, tw, F.out) + shape(x + 1, y + 1, w - 2, h - 2, tw - 2, F.back) + R(x + 1, y + 1, tw - 3, 0.5, F.hi)
  // The sheet sits behind the front flap and peeks out over the back
  const sx = x + tw + 3, sw = w - tw - 7
  o += R(sx, y + 2, sw, 6, F.out) + R(sx + 0.5, y + 2.5, sw - 1, 6, '#ffffff') + [4, 5.5].map((k) => R(sx + 2.5, y + k, sw - 6, 0.5, F.rule)).join('')
  o += R(x, y + 7, w, h - 7, F.out) + R(x + 1, y + 8, w - 2, h - 9, F.front) + R(x + 1, y + 8, w - 2, 0.5, F.hi) + R(x + 1, y + h - 1.5, w - 2, 0.5, F.lo) + R(x + w - 1.5, y + 8, 0.5, h - 9, F.lo)
  // Name, then the arrow right after it
  const size = Math.min(32, Math.floor(((w - 16) * P) / em(p.name)))
  o += t((x + 4) * P, (y + 17) * P, p.name, { font: 'Pixelify', size, fill: F.ink })
  o += bitmap(ARROW, x + 6 + (em(p.name) * size) / P, y + 11.5, { '#': F.ink }, 0.75)
  wrap(p.desc, 30).forEach((l, k) => { o += t((x + 4) * P, (y + 25 + k * 5) * P, l, { size: 20, fill: F.soft }) })
  const deg = [-1.2, 0.8, -0.6][i]
  return svg(TW, TH, `${p.name}: ${p.desc} ${p.cta === 'VISIT SITE' ? 'Opens the live site.' : 'Opens the code on GitHub.'}`, `<g transform="rotate(${deg} ${TW / 2} ${TH / 2})">${o}</g>`)
}

// ── Masthead ──
function masthead() {
  const MW = 900, MH = 146, w = MW / P - 6, x = 3, y = 3, h = MH / P - 6, rnd = seeded(5)
  let o = R(x + 1, y + 1.5, w, h, 'rgba(0,0,0,.28)') + R(x, y, w, h, C.news)
  for (let k = 0; k < w; k++) { if (rnd() < 0.45) o += R(x + k, y - 1, 1, 1, C.news); if (rnd() < 0.45) o += R(x + k, y + h, 1, 1, C.news) }
  o += R(x + 6, y + 9, w - 12, 0.5, C.ink) + R(x + 6, y + 27, w - 12, 0.5, C.ink) + R(x + 6, y + 28.5, w - 12, 0.5, C.ink)
  o += t((x + 6) * P, (y + 7) * P, 'VOL. XII', { font: 'Pixel', size: 8, fill: C.soft, extra: ' letter-spacing="1"' })
  o += t((x + w - 6) * P, (y + 7) * P, 'TORONTO, CANADA', { font: 'Pixel', size: 8, fill: C.soft, anchor: 'end', extra: ' letter-spacing="1"' })
  o += t(MW / 2, (y + 23.5) * P, 'SIDE PROJECTS', { font: 'Pixelify', size: 64, anchor: 'middle' })
  return svg(MW, MH, 'Side projects, a newspaper front page. Vol. XII, Toronto, Canada.', o)
}

writeFileSync(`${OUT}/masthead.svg`, masthead())
PROJECTS.forEach((p, i) => writeFileSync(`${OUT}/${p.slug}.svg`, folder(p, i)))
console.log('projects', PROJECTS.length + 1, 'images')
