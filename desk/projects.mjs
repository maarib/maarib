// The side projects under the desk, as a newspaper: a masthead, then one clipping per project.
// Each clipping is its own image so the README can link it (links inside an image don't work).
// Run: npm run build  (writes ../assets/projects/*.svg)
import { mkdirSync, writeFileSync } from 'node:fs'
import { P, C, R, box, disc, frame, bitmap, t, wrap, seeded, svg } from './pixel.mjs'
const HERE = new URL('.', import.meta.url).pathname
const OUT = `${HERE}../assets/projects`
mkdirSync(OUT, { recursive: true })

export const PROJECTS = [
  { slug: 'canopy', name: 'Canopy', kicker: 'TRAVEL', desc: 'Fall colors across Canada, and what to explore in Ontario.', url: 'https://maarib.github.io/canopy/', cta: 'VISIT SITE' },
  { slug: 'leaf-icons', name: 'Leaf icons', kicker: 'DESIGN TOOLS', desc: 'Tree leaf icons, and a small SVG editor for their stems and layers.', url: 'https://maarib.github.io/leaf-icons/', cta: 'VISIT SITE' },
  { slug: 'fpl-dashboard', name: 'FPL Dashboard', kicker: 'SPORTS', desc: 'Fantasy Premier League players, sortable and side by side.', url: 'https://maarib.github.io/fpl-dashboard/', cta: 'VISIT SITE' },
  { slug: 'card-compare', name: 'CardCompare', kicker: 'PERSONAL FINANCE', desc: 'Canadian credit cards compared on fees, earn rates, insurance and perks.', url: 'https://github.com/maarib/card-compare', cta: 'VIEW CODE' },
  { slug: 'alert-engine', name: 'alert.engine', kicker: 'MARKETS', desc: 'A stock and ETF watchlist with alerts, market briefs and sector exposure.', url: 'https://github.com/maarib/alert.engine', cta: 'VIEW CODE' },
  { slug: 'page-comments', name: 'page-comments', kicker: 'DEV TOOLS', desc: 'A Claude Code skill for leaving notes on any web page.', url: 'https://github.com/maarib/page-comments', cta: 'VIEW CODE' },
]

// ── Pictures, one per story, drawn in a 60×24 art-px panel at (x, y) ──
const MAPLE = ['.......D.......', '......DRD......', '..D..DRRRD..D..', '..DD.DRLRD.DD..', 'D.DRDRRLRRDRD.D', 'DRRRRRRLRRRRRRD', '.DRRLRRLRRLRRD.', '..DRRLRLRLRRD..', '.DRRRRLLLRRRRD.', 'DRRRRRRLRRRRRRD', '..DDRRRLRRRDD..', '....DDRLRDD....', '......DLD......', '.......D.......', '.......D.......']
const LEAF = ['...........DDDD', '.........DDGGGD', '.......DDGGGLGD', '.....DDGGGGLGGD', '....DGGGGGLGGD.', '...DGGGGLGGGD..', '...DGGGLGGGD...', '..DGGGLGGGD....', '..DGGLGGGD.....', '..DGLGGDD......', '.SLDDDD........', '.S.............', 'S..............']
const pics = {
  canopy(x, y) {
    let o = ''
    ;[[x + 14, y + 4, 0], [x + 30, y + 6, 1], [x + 44, y + 3, 2]].forEach(([lx, ly, k]) => {
      const pal = [{ D: '#8a2a1e', R: '#d6453d', L: '#ec7065' }, { D: '#a8541c', R: '#e8742c', L: '#f6a85a' }, { D: '#a8861c', R: '#e8b52c', L: '#f6d36a' }][k]
      o += bitmap(MAPLE, lx + 0.6, ly + 0.8, { D: 'rgba(0,0,0,.3)', R: 'rgba(0,0,0,.3)', L: 'rgba(0,0,0,.3)' }) + bitmap(MAPLE, lx, ly, pal)
    })
    return o
  },
  'leaf-icons'(x, y) {
    let o = bitmap(LEAF, x + 23.5, y + 5.8, { D: 'rgba(0,0,0,.3)', G: 'rgba(0,0,0,.3)', L: 'rgba(0,0,0,.3)', S: 'rgba(0,0,0,.3)' })
    o += bitmap(LEAF, x + 23, y + 5, { D: '#2c6e38', G: '#4aa358', L: '#8fd48f', S: '#7a5030' })
    // Bezier handles, as in the editor
    o += R(x + 12, y + 4, 22, 0.5, C.blueD) + R(x + 33, y + 15, 0.5, 6, C.blueD) + R(x + 33, y + 21, 10, 0.5, C.blueD)
    for (const [hx, hy, fill] of [[x + 11, y + 3, '#fff'], [x + 36, y + 3, C.blueD], [x + 32, y + 14, '#fff'], [x + 42, y + 20, '#fff']]) o += R(hx, hy, 3, 3, C.blueD) + R(hx + 0.5, hy + 0.5, 2, 2, fill)
    return o
  },
  'fpl-dashboard'(x, y) {
    let o = ''
    ;[[x + 30, 6, '#37003c'], [x + 36, 11, '#00c06b'], [x + 42, 16, '#e90052'], [x + 48, 9, '#37003c']].forEach(([bx, h, c]) => { o += R(bx + 0.6, y + 21 - h + 0.8, 4, h, 'rgba(0,0,0,.3)') + R(bx, y + 21 - h, 4, h, c) })
    o += R(x + 28, y + 21, 26, 0.5, C.ink)
    const cx = x + 17, cy = y + 12
    o += disc(cx + 0.7, cy + 0.9, 9, 'rgba(0,0,0,.3)') + disc(cx, cy, 9, C.line) + disc(cx, cy, 8, '#fbfbf8')
    o += bitmap(['..XXX..', '.XXXXX.', 'XXXXXXX', '.XXXXX.', '..XXX..'], cx - 3.5, cy - 2.5, { X: C.ink })
    for (const [dx, dy] of [[-7, -3], [5, -5], [-4, 5], [5, 4]]) o += R(cx + dx, cy + dy, 2, 2, C.ink)
    return o + R(cx - 5, cy - 6, 2, 1, '#fff')
  },
  'card-compare'(x, y) {
    const card = (cx, cy, base, light, dark) => box(cx, cy, 26, 17, base, light, dark) + R(cx + 3, cy + 5, 5, 4, '#e8c75a') + R(cx + 3, cy + 7, 5, 0.5, '#b8962a') + R(cx + 3, cy + 12, 18, 1, 'rgba(255,255,255,.55)') + R(cx + 17, cy + 3, 6, 2, 'rgba(255,255,255,.35)')
    let o = card(x + 12, y + 3, C.red, C.redL, C.redD) + card(x + 24, y + 6, C.blueD, C.blue, '#1d3a7a')
    return o + disc(x + 52, y + 5, 3, '#3fa45a') + R(x + 50, y + 4.5, 4, 1, '#fff') + R(x + 51.5, y + 3, 1, 4, '#fff')
  },
  'alert-engine'(x, y) {
    let o = ''
    for (let j = 0; j < 4; j++) o += R(x + 6, y + 4 + j * 5, 40, 0.5, 'rgba(43,43,58,.18)')
    const pts = [[6, 19], [12, 16], [17, 17], [23, 11], [28, 13], [34, 7], [40, 9], [46, 3]]
    for (let k = 0; k < pts.length - 1; k++) {
      const [x1, y1] = pts[k], [x2, y2] = pts[k + 1], n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))
      for (let s = 0; s <= n; s++) { const px = Math.round(x1 + ((x2 - x1) * s) / n), py = Math.round(y1 + ((y2 - y1) * s) / n); o += R(x + px, y + py, 1.5, 1.5, '#2c9a52') }
    }
    for (const [cx, top, h, up] of [[10, 13, 7, 1], [21, 9, 6, 1], [31, 9, 5, 0], [42, 2, 6, 1]]) o += R(x + cx + 0.5, y + top - 1, 0.5, h + 2, C.ink) + R(x + cx, y + top, 1.5, h, up ? '#2c9a52' : C.red)
    // A ringing bell
    const bx = x + 52, by = y + 9
    o += bitmap(['...X...', '..XXX..', '.XXXXX.', '.XXXXX.', '.XXXXX.', 'XXXXXXX', '...X...'], bx - 3.5, by - 4, { X: C.yellow }) + R(bx - 3.5, by + 1, 7, 0.5, '#c99a1c')
    return o + R(bx - 6, by - 4, 1, 3, C.ink) + R(bx + 5, by - 4, 1, 3, C.ink) + R(bx - 7.5, by - 5, 1, 1, C.ink) + R(bx + 6.5, by - 5, 1, 1, C.ink)
  },
  'page-comments'(x, y) {
    let o = box(x + 10, y + 1, 36, 22, '#ffffff', '#ffffff', '#dcd8cf') + R(x + 11, y + 2, 34, 4, '#e3e6ec')
    o += disc(x + 13.5, y + 4, 1, C.red) + disc(x + 16.5, y + 4, 1, C.yellow) + disc(x + 19.5, y + 4, 1, C.green)
    for (let j = 0; j < 5; j++) o += R(x + 14, y + 9 + j * 3, j % 2 ? 22 : 28, 1, '#c9ccd2')
    o += R(x + 14, y + 12, 14, 1, 'rgba(242,194,48,.8)')
    const cx = x + 38, cy = y + 6
    o += box(cx, cy, 15, 11, C.yellow, '#f8d860', '#c99a1c') + R(cx + 3, cy + 10, 3, 2, C.line) + R(cx + 3.5, cy + 10, 2, 1.5, C.yellow)
    return o + R(cx + 3, cy + 4, 9, 1, C.ink) + R(cx + 3, cy + 6.5, 6, 1, C.ink)
  },
}

// ── A clipping: torn newsprint with a kicker, headline, picture, standfirst and a button ──
const TW = 300, TH = 316, AW = TW / P, AH = TH / P
function clipping(p, i) {
  const rnd = seeded(31 + i * 17), x = 3, y = 3, w = AW - 6, h = AH - 6
  let o = R(x + 1, y + 1.5, w, h, 'rgba(0,0,0,.28)') + R(x, y, w, h, C.news)
  for (let k = 0; k < w; k++) { if (rnd() < 0.45) o += R(x + k, y - 1, 1, 1, C.news); if (rnd() < 0.45) o += R(x + k, y + h, 1, 1, C.news) }
  for (let k = 0; k < h; k++) { if (rnd() < 0.45) o += R(x - 1, y + k, 1, 1, C.news); if (rnd() < 0.45) o += R(x + w, y + k, 1, 1, C.news) }
  o += t((x + 4) * P, (y + 6) * P, p.kicker, { font: 'Pixel', size: 7, fill: C.red, extra: ' letter-spacing="1"' })
  o += t((x + 4) * P, (y + 14.5) * P, p.name, { font: 'Pixelify', size: Math.min(34, Math.floor(((w - 8) * P) / (p.name.length * 0.64))) }) + R(x + 4, y + 17, w - 8, 0.5, C.ink)
  // Picture panel: halftone dots under the drawing, like a printed photo
  const px = x + 4, py = y + 20, pw = w - 8, ph = 24
  o += R(px, py, pw, ph, '#ddd3bd')
  for (let j = 1; j < ph; j += 2) for (let k = (j % 4 === 1 ? 1 : 2); k < pw; k += 2) o += R(px + k, py + j, 0.5, 0.5, 'rgba(120,105,80,.35)')
  o += frame(px, py, pw, ph, '#b9ae96') + pics[p.slug](px + 1, py)
  wrap(p.desc, 32).forEach((l, k) => { o += t((x + 4) * P, (y + 50 + k * 5) * P, l, { size: 20, fill: C.soft }) })
  // Button-like call to action, bottom right
  const label = p.cta + ' >', bw = Math.ceil(label.length * 1.8) + 6, bx = x + w - 4 - bw, by = y + h - 11
  o += box(bx, by, bw, 8, C.blueD, C.blue, '#1d3a7a') + t((bx + bw / 2) * P, (by + 5.4) * P, label, { font: 'Pixel', size: 7, fill: '#fff', anchor: 'middle' })
  const deg = [-1.2, 0.8, -0.6, 0.9, -1, 0.7][i]
  return svg(TW, TH, `${p.name}: ${p.desc} ${p.cta === 'VISIT SITE' ? 'Opens the live site.' : 'Opens the code on GitHub.'}`, `<g transform="rotate(${deg} ${TW / 2} ${TH / 2})">${o}</g>`)
}

// ── Masthead ──
function masthead() {
  const MW = 900, MH = 168, w = MW / P - 6, x = 3, y = 3, h = MH / P - 6, rnd = seeded(5)
  let o = R(x + 1, y + 1.5, w, h, 'rgba(0,0,0,.28)') + R(x, y, w, h, C.news)
  for (let k = 0; k < w; k++) { if (rnd() < 0.45) o += R(x + k, y - 1, 1, 1, C.news); if (rnd() < 0.45) o += R(x + k, y + h, 1, 1, C.news) }
  o += R(x + 6, y + 9, w - 12, 0.5, C.ink) + R(x + 6, y + 27, w - 12, 0.5, C.ink) + R(x + 6, y + 28.5, w - 12, 0.5, C.ink)
  o += t((x + 6) * P, (y + 7) * P, 'VOL. XII', { font: 'Pixel', size: 8, fill: C.soft, extra: ' letter-spacing="1"' })
  o += t((x + w - 6) * P, (y + 7) * P, 'TORONTO, CANADA', { font: 'Pixel', size: 8, fill: C.soft, anchor: 'end', extra: ' letter-spacing="1"' })
  o += t(MW / 2, (y + 23.5) * P, 'SIDE PROJECTS', { font: 'Pixelify', size: 64, anchor: 'middle' })
  o += t(MW / 2, (y + 33.5) * P, 'TAP A STORY TO OPEN IT', { font: 'Pixel', size: 7, fill: C.red, anchor: 'middle', extra: ' letter-spacing="2"' })
  return svg(MW, MH, 'Side projects, a newspaper front page. Vol. XII, Toronto, Canada. Tap a story to open it.', o)
}

writeFileSync(`${OUT}/masthead.svg`, masthead())
PROJECTS.forEach((p, i) => writeFileSync(`${OUT}/${p.slug}.svg`, clipping(p, i)))
console.log('projects', PROJECTS.length + 1, 'images')
