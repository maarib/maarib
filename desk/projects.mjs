// The side projects under the desk, as an old Mac Finder window: a header, then one folder per project.
// Each folder is its own image so the README can link it (links inside an image don't work).
// Run: npm run build  (writes ../assets/projects/*.svg)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { P, R, t, wrap, bitmap, svg } from './pixel.mjs'
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
  const sx = x + 4, sw = w - 8
  o += R(sx, y + 3, sw, 5, F.out) + R(sx + 0.5, y + 3.5, sw - 1, 5, '#ffffff') + [5, 6.5].map((k) => R(sx + 2.5, y + k, sw - 6, 0.5, F.rule)).join('')
  o += R(x, y + 7, w, h - 7, F.out) + R(x + 1, y + 8, w - 2, h - 9, F.front) + R(x + 1, y + 8, w - 2, 0.5, F.hi) + R(x + 1, y + h - 1.5, w - 2, 0.5, F.lo) + R(x + w - 1.5, y + 8, 0.5, h - 9, F.lo)
  // Name, then the arrow right after it
  const size = Math.min(32, Math.floor(((w - 16) * P) / em(p.name)))
  o += t((x + 4) * P, (y + 17) * P, p.name, { font: 'Pixelify', size, fill: F.ink })
  o += bitmap(ARROW, x + 6 + (em(p.name) * size) / P, y + 11.5, { '#': F.ink }, 0.75)
  wrap(p.desc, 30).forEach((l, k) => { o += t((x + 4) * P, (y + 25 + k * 5) * P, l, { size: 20, fill: F.soft }) })
  const deg = [-1.2, 0.8, -0.6][i]
  return svg(TW, TH, `${p.name}: ${p.desc} ${p.cta === 'VISIT SITE' ? 'Opens the live site.' : 'Opens the code on GitHub.'}`, `<g transform="rotate(${deg} ${TW / 2} ${TH / 2})">${o}</g>`)
}

// ── Header: the top of a Platinum Finder window, title bar and info strip ──
const K = { out: '#000000', plat: '#dddddd', hi: '#ffffff', lo: '#999999', strip: '#eeeeee', text: '#333333' }
function header() {
  const MW = 900, MH = 146, x = 3, y = 3, w = MW / P - 7, h = MH / P - 7, tb = 14
  let o = R(x + 1.5, y + 2, w, h, 'rgba(0,0,0,.28)') + R(x, y, w, h, K.out) + R(x + 0.5, y + 0.5, w - 1, h - 1, K.plat)
  o += R(x + 0.5, y + 0.5, w - 1, 0.5, K.hi) + R(x + 0.5, y + 0.5, 0.5, h - 1, K.hi) + R(x + 1, y + h - 1, w - 1.5, 0.5, K.lo) + R(x + w - 1, y + 1, 0.5, h - 1.5, K.lo)
  // Pinstripes, then the close box on the left and the collapse and zoom boxes on the right
  for (let j = 0; j < 6; j++) o += R(x + 3, y + 2.5 + j * 1.5, w - 6, 0.5, K.lo) + R(x + 3, y + 3 + j * 1.5, w - 6, 0.5, K.hi)
  const box = (bx) => R(bx, y + 3, 8, 8, K.out) + R(bx + 0.5, y + 3.5, 7, 7, K.plat) + R(bx + 0.5, y + 3.5, 7, 0.5, K.hi) + R(bx + 0.5, y + 3.5, 0.5, 7, K.hi)
  o += box(x + 5) + box(x + w - 24) + R(x + w - 22, y + 6.5, 4, 1, K.out) + box(x + w - 13) + R(x + w - 10.5, y + 5.5, 3, 3, K.out) + R(x + w - 10, y + 6, 2, 2, K.plat)
  // Title: a small folder icon and the name, on a plain patch over the stripes
  const tw = 70, icon = shape(0, 0, 22, 17, 9, F.out) + shape(1, 1, 20, 15, 7, F.back) + R(0, 5, 22, 12, F.out) + R(1, 6, 20, 10, F.front) + R(1, 6, 20, 0.5, F.hi)
  o += R(x + w / 2 - tw / 2 - 3, y + 1.5, tw + 6, 11, K.plat)
  o += `<g transform="translate(${(x + w / 2 - tw / 2 - 2) * P} ${(y + 3) * P}) scale(.5)">${icon}</g>`
  o += t((x + w / 2 + 6) * P, (y + 10.5) * P, 'Side Projects', { font: 'Pixelify', size: 34, anchor: 'middle', fill: K.out })
  // Info strip
  o += R(x + 2, y + tb + 1, w - 4, h - tb - 3, K.out) + R(x + 2.5, y + tb + 1.5, w - 5, h - tb - 4, K.strip) + R(x + 2.5, y + tb + 1.5, w - 5, 0.5, K.hi)
  o += t((x + w / 2) * P, (y + tb + 9) * P, INFO, { size: 30, anchor: 'middle', fill: K.text })
  return svg(MW, MH, `Side projects, as the top of an old Mac Finder window: ${INFO}.`, o)
}
const INFO = 'Art, experiments & tools'

writeFileSync(`${OUT}/header.svg`, header())
PROJECTS.forEach((p, i) => writeFileSync(`${OUT}/${p.slug}.svg`, folder(p, i)))
console.log('projects', PROJECTS.length + 1, 'images')
