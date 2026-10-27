// The side projects under the desk, as a newspaper: a masthead, then one clipping per project.
// Each clipping is its own image so the README can link it (links inside an image don't work).
// Run: npm run build  (writes ../assets/projects/*.svg)
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { P, C, R, box, t, wrap, seeded, svg } from './pixel.mjs'
const HERE = fileURLToPath(new URL('.', import.meta.url))
const OUT = `${HERE}../assets/projects`
mkdirSync(OUT, { recursive: true })

export const PROJECTS = [
  { slug: 'canopy', name: 'Canopy', desc: 'Fall colors across Canada, and what to explore in Ontario.', url: 'https://maarib.github.io/canopy/', cta: 'VISIT SITE' },
  { slug: 'leaf-icons', name: 'Leaf icons', desc: 'Tree leaf icons, with an SVG editor for stems and layers.', url: 'https://maarib.github.io/leaf-icons/', cta: 'VISIT SITE' },
  { slug: 'fpl-dashboard', name: 'FPL Dashboard', desc: 'Fantasy Premier League players, sortable and side by side.', url: 'https://maarib.github.io/fpl-dashboard/', cta: 'VISIT SITE' },
  { slug: 'card-compare', name: 'CardCompare', desc: 'Canadian credit cards compared on fees, rewards and perks.', url: 'https://github.com/maarib/card-compare', cta: 'VIEW CODE' },
  { slug: 'alert-engine', name: 'alert.engine', desc: 'A stock and ETF watchlist with alerts and market briefs.', url: 'https://github.com/maarib/alert.engine', cta: 'VIEW CODE' },
  { slug: 'page-comments', name: 'page-comments', desc: 'A Claude Code skill for leaving notes on any web page.', url: 'https://github.com/maarib/page-comments', cta: 'VIEW CODE' },
]

// ── A clipping: torn newsprint with a headline, standfirst and a button ──
const TW = 300, TH = 188, AW = TW / P, AH = TH / P
function clipping(p, i) {
  const rnd = seeded(31 + i * 17), x = 3, y = 3, w = AW - 6, h = AH - 6
  let o = R(x + 1, y + 1.5, w, h, 'rgba(0,0,0,.28)') + R(x, y, w, h, C.news)
  for (let k = 0; k < w; k++) { if (rnd() < 0.45) o += R(x + k, y - 1, 1, 1, C.news); if (rnd() < 0.45) o += R(x + k, y + h, 1, 1, C.news) }
  for (let k = 0; k < h; k++) { if (rnd() < 0.45) o += R(x - 1, y + k, 1, 1, C.news); if (rnd() < 0.45) o += R(x + w, y + k, 1, 1, C.news) }
  o += t((x + 4) * P, (y + 9.5) * P, p.name, { font: 'Pixelify', size: Math.min(34, Math.floor(((w - 8) * P) / (p.name.length * 0.64))) }) + R(x + 4, y + 12, w - 8, 0.5, C.ink)
  wrap(p.desc, 32).forEach((l, k) => { o += t((x + 4) * P, (y + 19 + k * 5) * P, l, { size: 20, fill: C.soft }) })
  // Button-like call to action, bottom right
  const label = p.cta + ' >', bw = Math.ceil(label.length * 1.8) + 6, bx = x + w - 4 - bw, by = y + h - 11
  o += box(bx, by, bw, 8, C.blueD, C.blue, '#1d3a7a') + t((bx + bw / 2) * P, (by + 5.4) * P, label, { font: 'Pixel', size: 7, fill: '#fff', anchor: 'middle' })
  const deg = [-1.2, 0.8, -0.6, 0.9, -1, 0.7][i]
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
PROJECTS.forEach((p, i) => writeFileSync(`${OUT}/${p.slug}.svg`, clipping(p, i)))
console.log('projects', PROJECTS.length + 1, 'images')
