// The profile as a busy wooden table seen from above. Each README section is an object on
// it (an open passport, team folders, logo stickers on a cutting mat, a newspaper, an envelope),
// surrounded by clutter, with the launch terminal at the end. Pixel art at 4 screen px per art px.
// Run: npm install && npm run build  (writes ../assets/desk.svg)
import { readFileSync, writeFileSync } from 'node:fs'
import { heroSvg } from './hero.mjs'
const HERE = new URL('.', import.meta.url).pathname
const FONTS = `${HERE}node_modules/@fontsource`
const b64 = (p) => readFileSync(p).toString('base64')
const face = (family, file) => `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${b64(file)}) format('woff2')}`
const FONT_CSS = face('Pixelify', `${FONTS}/pixelify-sans/files/pixelify-sans-latin-400-normal.woff2`) + face('VT', `${FONTS}/vt323/files/vt323-latin-400-normal.woff2`) + face('Pixel', `${FONTS}/press-start-2p/files/press-start-2p-latin-400-normal.woff2`) + face('Sig', `${FONTS}/mrs-saint-delafield/files/mrs-saint-delafield-latin-400-normal.woff2`)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const W = 900, P = 4, WA = W / P
const C = {
  line: '#1b1e30',
  paper: '#f6ecd6', paperD: '#e2d2b0', paperL: '#fffaf0', rule: '#c9b894',
  manila: '#f4c15d', manilaD: '#d99a33', manilaL: '#fbd98a',
  blue: '#3d6fd6', blueD: '#2a4fa3', blueL: '#6b95ea',
  red: '#d6453d', redD: '#a3302a', redL: '#ec7065',
  orange: '#f2a33a', orangeD: '#c97a1e', orangeL: '#f8c46e',
  metal: '#b9c0cc', metalD: '#7d8596', metalL: '#e6eaf0',
  ink: '#2b2b3a', soft: '#6a6a7e', green: '#3fa45a', white: '#fbfbf8',
}
let seed = 11
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const R = (x, y, w, h, c, extra = '') => `<rect x="${+(x * P).toFixed(1)}" y="${+(y * P).toFixed(1)}" width="${+(w * P).toFixed(1)}" height="${+(h * P).toFixed(1)}" fill="${c}"${extra}/>`
// A pixel box: dark outline with clipped corners, flat fill, a light top edge, a shaded bottom edge.
function box(x, y, w, h, fill, light, dark, { outline = C.line, shadow = true } = {}) {
  let o = ''
  if (shadow) o += R(x + 1, y + h, w - 1, 1, 'rgba(0,0,0,.4)') + R(x + w, y + 1, 1, h, 'rgba(0,0,0,.4)')
  o += R(x + 1, y, w - 2, h, outline) + R(x, y + 1, w, h - 2, outline)
  o += R(x + 1, y + 1, w - 2, h - 2, fill)
  o += R(x + 1, y + 1, w - 2, 1, light) + R(x + 1, y + h - 2, w - 2, 1, dark)
  return o
}
// Filled ellipse in pixel rows.
function ell(cx, cy, rx, ry, c) {
  let o = ''
  for (let j = -ry; j < ry; j++) { const half = Math.round(rx * Math.sqrt(1 - ((j + 0.5) / ry) ** 2)); if (half > 0) o += R(Math.round(cx) - half, Math.round(cy) + j, 2 * half, 1, c) }
  return o
}
const disc = (cx, cy, r, c) => ell(cx, cy, r, r, c)
const t = (x, y, s, { font = 'VT', size = 22, fill = C.ink, anchor = 'start', extra = '' } = {}) => `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}" text-anchor="${anchor}"${extra}>${esc(s)}</text>`
const tilt = (deg, cx, cy, body) => `<g transform="rotate(${deg} ${cx * P} ${cy * P})">${body}</g>`
const frame = (x, y, w, h, c) => R(x, y, w, 1, c) + R(x, y + h - 1, w, 1, c) + R(x, y, 1, h, c) + R(x + w - 1, y, 1, h, c)
const bitmap = (rows, x, y, colors, s = 1) => rows.map((r, j) => [...r].map((v, i) => (colors[v] ? R(x + i * s, y + j * s, s, s, colors[v]) : '')).join('')).join('')
// Die-cut outline for a bitmap: every filled pixel grown by `d` in white, plus a drop shadow.
function dieCut(rows, x, y, d = 2, s = 1) {
  const on = new Set()
  rows.forEach((r, j) => [...r].forEach((v, i) => { if (v !== '.') for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++) if (Math.abs(dx) + Math.abs(dy) <= d + 1) on.add(`${i + dx},${j + dy}`) }))
  let sh = '', wh = ''
  for (const k of on) { const [i, j] = k.split(',').map(Number); sh += R(x + (i + 1) * s, y + (j + 1.5) * s, s, s, 'rgba(0,0,0,.35)'); wh += R(x + i * s, y + j * s, s, s, '#ffffff') }
  return sh + wh
}

const css = `${FONT_CSS}
  text { white-space: pre; }
  .in { animation: in .7s cubic-bezier(.2,.9,.3,1.2) both; }
  @keyframes in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  .stamp { transform-box: fill-box; transform-origin: center; animation: stamp .45s cubic-bezier(.3,1.6,.5,1) both; }
  @keyframes stamp { from { opacity: 0; transform: scale(1.8); } to { opacity: 1; transform: scale(1); } }
  .blink { animation: blink 1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  .steam { animation: steam 3s ease-in-out infinite both; }
  @keyframes steam { 0% { opacity: 0; transform: translate(0, 4px); } 40% { opacity: 1; } 100% { opacity: 0; transform: translate(6px, -10px); } }
  .holo { animation: holo 3s linear infinite; }
  @keyframes holo { 0%, 100% { fill: #bfe3ff; } 33% { fill: #e5c7ff; } 66% { fill: #c8f5d8; } }
  .press { animation: press 2.6s steps(1) infinite; }
  @keyframes press { 0%, 70%, 80%, 100% { transform: none; } 72% { transform: translateY(4px); } }
  .spin { transform-box: fill-box; transform-origin: center; animation: spin 1.6s steps(8) infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ember { animation: ember 1.8s ease-in-out infinite; }
  @keyframes ember { 50% { fill: #ffb347; } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`
const DEFS = `<filter id="aged"><feColorMatrix type="saturate" values="0.4"/><feComponentTransfer><feFuncR type="linear" slope=".85" intercept=".1"/><feFuncG type="linear" slope=".82" intercept=".08"/><feFuncB type="linear" slope=".75" intercept=".05"/></feComponentTransfer></filter>
<filter id="ink" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="5" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.15" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
<linearGradient id="flap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfcfcf"/></linearGradient>
<linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd166"/><stop offset=".5" stop-color="#ff6b8b"/><stop offset="1" stop-color="#8a4fff"/></linearGradient>
<linearGradient id="gloss" x1="0" y1="0" x2="1" y2="1"><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>`

// A sticky note label. Text sits in the middle of the paper below the glue strip.
function sticky(x, y, label, rot = -5) {
  const w = Math.ceil(label.length * 2.75) + 12
  return `<g transform="rotate(${rot} ${x * P} ${y * P})">${box(x, y, w, 14, '#f7e08a', '#fdf0b8', '#d9bf55')}${R(x + 1, y + 1, w - 2, 3, '#f0d36a')}${t((x + 6) * P, (y + 9.4) * P, label, { font: 'Pixel', size: 10, extra: ' letter-spacing="1"' })}</g>`
}

// ── The table ────────────────────────────────────────────────────────────────
function wood(Ha) {
  const tones = ['#c08d5c', '#b88555', '#c49360', '#b07e50', '#bc8a59'], pw = 45
  let o = ''
  tones.forEach((tone, k) => {
    const x0 = k * pw
    o += R(x0, 0, pw, Ha, tone)
    for (let g = 0; g < 7; g++) {
      let gx = x0 + 2 + Math.floor(rnd() * (pw - 4)), y = -Math.floor(rnd() * 20)
      const dark = rnd() < 0.65
      while (y < Ha) {
        const len = 18 + Math.floor(rnd() * 70)
        o += R(gx, y, 1, len, dark ? 'rgba(90,52,22,.20)' : 'rgba(255,214,160,.07)')
        y += len + Math.floor(rnd() * 5)
        gx = Math.min(x0 + pw - 2, Math.max(x0 + 2, gx + (rnd() < 0.5 ? -1 : 1)))
      }
    }
    for (let n = 0; n < 2; n++) { const kx = x0 + 10 + rnd() * (pw - 20), ky = 20 + rnd() * (Ha - 40); o += ell(kx, ky, 4, 8, 'rgba(90,52,22,.25)') + ell(kx, ky, 2, 4, 'rgba(90,52,22,.38)') }
    for (let n = 0; n < 2; n++) { const jy = Math.floor((0.15 + 0.45 * n + rnd() * 0.3) * Ha); o += R(x0, jy, pw, 1, '#7a5030') + R(x0, jy + 1, pw, 1, 'rgba(255,214,160,.12)') }
    o += R(x0, 0, 1, Ha, '#7a5030') + R(x0 + 1, 0, 1, Ha, 'rgba(255,214,160,.12)')
  })
  return o
}

// ── Clutter ──────────────────────────────────────────────────────────────────
const paperclip = (x, y) => frame(x, y, 5, 15, C.metalD) + frame(x + 1, y + 2, 3, 10, C.metalL)
const ring = (x, y, r) => `<g shape-rendering="auto" fill="none" stroke="#5a3418" stroke-opacity=".3"><circle cx="${x * P}" cy="${y * P}" r="${r * P}" stroke-width="7"/><path d="M${(x - r - 2) * P} ${(y + 3) * P}a${(r + 2) * P} ${(r + 2) * P} 0 0 0 ${(r + 6) * P} ${(r - 1) * P}" stroke-width="3"/></g>`
function pencil(x, y, L, body = '#f2c230', light = '#f8d860', dark = '#c99a1c') {
  let o = box(x, y, L, 5, body, light, dark)
  o += R(x + 1, y + 1, 4, 3, '#f08a9a') + R(x + 5, y + 1, 2, 3, C.metal)
  o += R(x + L, y + 1, 3, 3, '#e8c99a') + R(x + L + 3, y + 2, 2, 1, C.ink)
  o += R(x + L - 1, y, 4, 1, C.line) + R(x + L - 1, y + 4, 4, 1, C.line) + R(x + L + 3, y + 1, 2, 1, C.line) + R(x + L + 3, y + 3, 2, 1, C.line) + R(x + L + 5, y + 2, 1, 1, C.line)
  return o
}
// A felt-tip marker: dark barrel with a label band, coloured cap at the tip end.
function marker(x, y, L, cap, capD) {
  let o = box(x, y, L, 6, '#2e2e36', '#4a4a55', '#1c1c22') + R(x + 6, y + 1, 12, 4, C.white) + R(x + 8, y + 2, 8, 1, cap)
  o += box(x + L - 12, y - 1, 14, 8, cap, cap, capD) + R(x + L - 10, y, 1, 6, 'rgba(255,255,255,.35)')
  return o
}
function highlighter(x, y, L, body, light, dark) {
  let o = box(x, y, L, 9, body, light, dark) + R(x + 4, y + 3, L - 22, 3, 'rgba(255,255,255,.35)')
  o += box(x + L - 14, y - 1, 16, 11, dark, body, C.ink) + R(x + L - 12, y + 1, 10, 2, 'rgba(255,255,255,.3)')
  return o
}
// Tape strip with torn ends.
function tape(x, y, w, h, c) {
  let o = R(x, y, w, h, c)
  for (let j = 0; j < h; j++) { if (j % 2) o += R(x - 1, y + j, 1, 1, c); else o += R(x + w, y + j, 1, 1, c) }
  return o
}
// Coffee mug from above: white rim, coffee with a crema heart, handle off to the side.
function mug(cx, cy) {
  let o = box(cx + 10, cy - 4, 10, 8, C.white, '#ffffff', '#d8d4cc') + R(cx + 12, cy - 2, 4, 4, '#d8d4cc')
  o += disc(cx + 1.5, cy + 2, 14, 'rgba(0,0,0,.35)') + disc(cx, cy, 14, C.line) + disc(cx, cy, 13, C.white) + disc(cx, cy, 11, '#d8d4cc') + disc(cx, cy, 10, '#4a2a14') + disc(cx - 1, cy - 1, 8, '#5c3519')
  o += bitmap(['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'], cx - 4, cy - 3, { '#': '#d9a877' })
  o += [0, 1, 2].map((i) => `<g class="steam" style="animation-delay:${i}s">${R(cx - 5 + i * 4, cy - 6 + i * 2, 1, 4, 'rgba(255,255,255,.45)')}${R(cx - 4 + i * 4, cy - 9 + i * 2, 1, 3, 'rgba(255,255,255,.35)')}</g>`).join('')
  return o
}
function keyboard(x, y) {
  const rows = [[['ESC', 1, 'esc'], '1', '2', '3', '4', '5', '6', '7', '8'], [['TAB', 1.5, 'mod'], 'Q', 'W', 'E', 'R', 'T', 'Y', 'U'], [['CAPS', 1.75, 'mod'], 'A', 'S', 'D', 'F', 'G', 'H', 'J'], [['SHIFT', 2.25, 'mod'], 'Z', 'X', 'C', 'V', 'B', 'N']]
  let o = box(x, y, 96, 48, '#cfd3da', '#e8ebf0', '#a4aab5')
  rows.forEach((row, j) => {
    let kx = x + 3
    row.forEach((k) => {
      const [label, u, kind] = Array.isArray(k) ? k : [k, 1, 'key']
      const w = u * 10 - 1, ky = y + 3 + j * 11
      const [f, l, d, ink] = kind === 'esc' ? [C.red, C.redL, C.redD, '#fff'] : kind === 'mod' ? ['#4a4e5a', '#646a78', '#33363f', '#fff'] : ['#f1f0ec', '#ffffff', '#cfcdc6', C.ink]
      const cap = box(kx, ky, w, 10, f, l, d, { shadow: false }) + t((kx + (kind === 'key' ? w / 2 : 3)) * P, (ky + 6.5) * P, label, { font: 'Pixel', size: 7, fill: ink, anchor: kind === 'key' ? 'middle' : 'start' })
      o += label === 'W' || label === 'D' ? `<g class="press" style="animation-delay:${label === 'D' ? 1.3 : 0}s">${cap}</g>` : cap
      kx += u * 10
    })
  })
  return o
}
function boardingPass(x, y) {
  let o = box(x, y, 74, 30, C.paperL, '#ffffff', C.paperD) + R(x + 1, y + 1, 72, 6, C.blue)
  o += t((x + 4) * P, (y + 5.6) * P, 'BOARDING PASS', { font: 'Pixel', size: 7, fill: '#fff', extra: ' letter-spacing="1"' })
  o += t((x + 4) * P, (y + 16) * P, 'YYZ → ANYWHERE', { font: 'Pixelify', size: 22 })
  o += t((x + 4) * P, (y + 24) * P, 'GATE UX · ON TIME', { size: 17, fill: C.soft })
  for (let i = 0; i < 10; i++) o += R(x + 52, y + 8 + i * 2, 1, 1, C.rule)
  o += t((x + 55) * P, (y + 13) * P, 'SEAT', { font: 'Pixel', size: 6, fill: C.soft }) + t((x + 55) * P, (y + 22) * P, '12A', { font: 'Pixelify', size: 26, fill: C.redD })
  return o
}
function ticket(x, y, seat) {
  let o = box(x, y, 80, 30, '#1f1d25', '#36323f', '#111015') + R(x + 1, y + 1, 78, 3, C.red)
  o += t((x + 5) * P, (y + 13) * P, 'METALLICA', { font: 'Pixel', size: 13, fill: '#dfe3ea', extra: ' letter-spacing="1"' })
  o += t((x + 5) * P, (y + 20) * P, 'LIVE · TORONTO', { size: 18, fill: '#a9a3b5' })
  o += t((x + 5) * P, (y + 26) * P, 'ADMIT ONE', { font: 'Pixel', size: 6, fill: '#f2c230', extra: ' letter-spacing="1"' })
  for (let i = 0; i < 12; i++) o += R(x + 58, y + 5 + i * 2, 1, 1, '#5a5566')
  o += t((x + 61) * P, (y + 11) * P, 'SEC 112', { size: 15, fill: '#a9a3b5' }) + t((x + 61) * P, (y + 17) * P, 'ROW F', { size: 15, fill: '#a9a3b5' }) + t((x + 61) * P, (y + 24) * P, seat, { font: 'Pixelify', size: 20, fill: '#dfe3ea' })
  return o
}
const cigarette = (x, y) => R(x + 1, y + 3, 26, 1, 'rgba(0,0,0,.35)') + R(x, y, 7, 3, '#e3a75a') + R(x + 1, y + 1, 1, 1, '#c98a3a') + R(x + 4, y, 1, 1, '#c98a3a') + R(x + 7, y, 18, 3, C.white) + R(x + 25, y, 2, 3, '#9a9a9a') + `<rect class="ember" x="${(x + 27) * P}" y="${y * P}" width="${P}" height="${3 * P}" fill="#e2552c"/>`
// A round glass ashtray from above: a thick rim with three rests, ash, and a stubbed-out butt.
function ashtray(cx, cy) {
  let o = disc(cx + 1.5, cy + 2, 13, 'rgba(0,0,0,.35)') + disc(cx, cy, 13, C.line) + disc(cx, cy, 12, '#8fa3b3') + disc(cx - 1, cy - 1, 11, '#b9cad6') + disc(cx, cy, 10, '#a3b5c3')
  o += disc(cx, cy, 8, '#3c4650') + disc(cx, cy + 1, 7, '#56626d')
  for (const [dx, dy, w, h] of [[-13, -1, 4, 3], [9, -1, 4, 3], [-1, 9, 3, 4]]) o += R(cx + dx, cy + dy, w, h, '#56626d') + R(cx + dx, cy + dy + h - 1, w, 1, '#3c4650')
  for (let k = 0; k < 16; k++) { const a = k * 2.3, r = (k * 7) % 6; o += R(cx + Math.round(Math.cos(a) * r), cy + 1 + Math.round(Math.sin(a) * r), 1, 1, k % 3 ? '#9a958d' : '#c9c4ba') }
  o += R(cx + 1, cy + 3, 5, 2, C.white) + R(cx + 6, cy + 3, 3, 2, '#e3a75a') + R(cx, cy + 3, 1, 2, '#6a6a6a') + R(cx + 7, cy + 3, 1, 1, '#c98a3a')
  return o + R(cx - 8, cy - 8, 3, 1, 'rgba(255,255,255,.7)') + R(cx - 9, cy - 7, 1, 2, 'rgba(255,255,255,.7)')
}
// A pixel ring between radii r0 and r1, with a real hole.
function annulus(cx, cy, r0, r1, c) {
  let o = ''
  for (let j = -Math.ceil(r1); j < r1; j++) {
    const yy = j + 0.5, a = Math.round(Math.sqrt(Math.max(0, r1 * r1 - yy * yy))), b = Math.abs(yy) < r0 ? Math.round(Math.sqrt(r0 * r0 - yy * yy)) : 0
    if (a <= 0) continue
    if (b > 0) { if (a > b) o += R(cx - a, cy + j, a - b, 1, c) + R(cx + b, cy + j, a - b, 1, c) }
    else o += R(cx - a, cy + j, 2 * a, 1, c)
  }
  return o
}
// A house key on a split ring: a brass bow with a hole, a grooved blade and cut teeth.
function houseKey(x, y) {
  const br = ['#d9b44a', '#f0d77a', '#a8862c']
  let o = annulus(x + 1, y + 1.5, 4, 7, 'rgba(0,0,0,.3)') + annulus(x, y, 4, 7, C.line) + annulus(x, y, 5, 6, C.metal) + R(x - 5, y - 4, 2, 1, C.metalL)
  const bx = x + 11, by = y + 2
  o += annulus(bx + 1, by + 1.5, 2, 7, 'rgba(0,0,0,.3)') + R(bx + 6, by - 1, 24, 6, 'rgba(0,0,0,.3)')
  o += R(bx + 5, by - 3, 24, 6, C.line) + R(bx + 29, by - 2, 1, 4, C.line)
  o += R(bx + 5, by - 2, 24, 4, br[0]) + R(bx + 5, by - 2, 24, 1, br[1]) + R(bx + 8, by, 19, 1, br[2])
  ;[2, 1, 2, 3, 1, 2, 2, 1, 3, 2, 1, 2, 1].forEach((h, i) => { o += R(bx + 10 + i * 1.5, by + 3, 1.5, h, C.line); if (h > 1) o += R(bx + 10 + i * 1.5, by + 3, 1.5, h - 1, br[0]) })
  o += annulus(bx, by, 2, 7, C.line) + annulus(bx, by, 3, 6, br[0]) + R(bx - 4, by - 4, 3, 1, br[1]) + R(bx - 5, by - 3, 1, 2, br[1]) + R(bx + 2, by + 4, 3, 1, br[2])
  return o + R(bx + 4, by - 2, 2, 4, br[2])
}
function receipt(x, y, h = 66) {
  let o = box(x, y, 42, h, C.white, '#ffffff', '#e6e2da')
  for (let i = 0; i < 21; i++) o += R(x + i * 2, y + h, 1, 1, C.white)
  o += t((x + 21) * P, (y + 8) * P, 'DESK CAFE', { font: 'Pixel', size: 8, anchor: 'middle' })
  ;[['FLAT WHITE', '4.75'], ['CROISSANT', '3.50'], ['OAT MILK', '0.80'], ['EXTRA SHOT', '1.25']].forEach(([a, b], i) => { o += t((x + 4) * P, (y + 17 + i * 6) * P, a, { size: 16, fill: C.soft }) + t((x + 38) * P, (y + 17 + i * 6) * P, b, { size: 16, fill: C.soft, anchor: 'end' }) })
  o += R(x + 4, y + 40, 34, 0.5, C.soft) + t((x + 4) * P, (y + 46) * P, 'TOTAL', { size: 18 }) + t((x + 38) * P, (y + 46) * P, '10.30', { size: 18, anchor: 'end' })
  for (let i = 0; i < 30; i++) if ((i * 7) % 3) o += R(x + 6 + i, y + 50, 1, 8, C.ink)
  return o + t((x + 21) * P, (y + 63) * P, 'THANK YOU!', { font: 'Pixel', size: 6, fill: C.soft, anchor: 'middle' })
}
function note(x, y, lines) {
  let o = box(x, y, 54, 50, '#fdfdf8', '#ffffff', '#e4e2d8')
  for (let i = 0; i < 27; i++) o += R(x + i * 2, y - (i % 2), 2, 1 + (i % 2), '#fdfdf8')
  for (let j = 0; j < 7; j++) o += R(x + 1, y + 8 + j * 6, 52, 0.5, '#a9c4e8')
  o += R(x + 8, y + 1, 0.5, 48, '#e8a0a0')
  for (let j = 0; j < 4; j++) o += disc(x + 4, y + 9 + j * 11, 1.5, 'rgba(0,0,0,.35)')
  lines.forEach((l, i) => { o += t((x + 10) * P, (y + 7.4 + i * 6) * P, l, { font: 'Pixelify', size: 19, fill: C.blueD }) })
  return o
}
function binderClip(x, y) {
  return frame(x + 2, y - 7, 5, 9, C.metalD) + frame(x + 11, y - 7, 5, 9, C.metalD) + box(x, y, 18, 9, '#26262c', '#44444c', '#141418')
}
function barcodeLabel(x, y) {
  let o = box(x, y, 36, 16, C.white, '#ffffff', '#e6e2da')
  for (let i = 0; i < 30; i++) if ((i * 5) % 3 !== 1) o += R(x + 3 + i, y + 2, (i % 4) ? 1 : 0.5, 8, C.ink)
  return o + t((x + 18) * P, (y + 14) * P, '0 42 MAARIB 7', { size: 14, anchor: 'middle' })
}
const CAT = JSON.parse(readFileSync(`${HERE}data/cat-pixels.json`, 'utf8'))
function polaroid(x, y, caption) {
  let o = box(x, y, 36, 48, '#ffffff', '#ffffff', '#dcd8cf') + R(x + 3, y + 3, 30, 29, C.orangeL)
  o += bitmap(CAT, x + 3, y + 9, { '#': C.ink })
  o += `<g class="blink" style="animation-duration:4s">${R(x + 10, y + 24, 1, 1, '#f2c230')}${R(x + 21, y + 24, 1, 1, '#f2c230')}</g>`
  return o + t((x + 18) * P, (y + 42) * P, caption, { font: 'Pixelify', size: 18, fill: C.blueD, anchor: 'middle' })
}

// ── Equipment, in the keyboard's style: light grey case, keycap buttons, dark mods, red accents ──
const CASE = ['#cfd3da', '#e8ebf0', '#a4aab5']
const KEY = { key: ['#f1f0ec', '#ffffff', '#cfcdc6', C.ink], mod: ['#4a4e5a', '#646a78', '#33363f', '#fff'], esc: [C.red, C.redL, C.redD, '#fff'], blue: [C.blue, C.blueL, C.blueD, '#fff'], green: ['#3fa45a', '#62c27a', '#2c7a40', '#fff'], yellow: ['#f2c230', '#f8d860', '#c99a1c', C.ink] }
function keycap(x, y, w, h, kind = 'key', label = '', size = 6) {
  const [f, l, d, ink] = KEY[kind]
  return box(x, y, w, h, f, l, d, { shadow: false }) + (label ? t((x + w / 2) * P, (y + h / 2 + size / 8 - 0.2) * P, label, { font: 'Pixel', size, fill: ink, anchor: 'middle' }) : '')
}
// Pixel cable along a cubic curve.
function cable(pts, c = '#f1f0ec') {
  const [a, b, c2, d] = pts, seen = new Set()
  let o = ''
  for (let k = 0; k <= 160; k++) {
    const u = k / 160, v = 1 - u
    const x = Math.round(v ** 3 * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c2[0] + u ** 3 * d[0]), y = Math.round(v ** 3 * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c2[1] + u ** 3 * d[1])
    if (seen.has(x + ',' + y)) continue
    seen.add(x + ',' + y)
    o += R(x + 0.5, y + 0.5, 1, 1, 'rgba(0,0,0,.3)') + R(x, y, 1, 1, c)
  }
  return o
}
function walkman(x, y) {
  let o = box(x, y, 58, 36, ...CASE) + R(x + 6, y - 2, 4, 2, C.metalD)
  o += box(x + 3, y + 4, 36, 24, '#33363f', '#4a4e5a', '#24262c', { shadow: false })
  o += box(x + 5, y + 6, 32, 20, '#2b2b33', '#3a3a44', '#1c1c22', { shadow: false }) + R(x + 7, y + 8, 28, 6, C.paper) + R(x + 7, y + 8, 28, 1, C.red)
  o += t((x + 21) * P, (y + 12.6) * P, 'MIXTAPE 01', { font: 'Pixel', size: 5, anchor: 'middle' })
  o += R(x + 13, y + 16, 16, 6, '#5a3a22')
  for (const rx of [x + 13, x + 29]) o += disc(rx, y + 19, 4, '#e8e7e2') + `<g class="spin">${disc(rx, y + 19, 2, '#ffffff')}${R(rx - 0.5, y + 17, 1, 4, C.line)}${R(rx - 2, y + 18.5, 4, 1, C.line)}</g>`
  o += keycap(x + 42, y + 3, 13, 7, 'esc', '>', 7) + keycap(x + 42, y + 10, 13, 7, 'key', 'II', 6) + keycap(x + 42, y + 17, 13, 7, 'key', '<<', 6) + keycap(x + 42, y + 24, 13, 7, 'key', '>>', 6)
  return o + t((x + 4) * P, (y + 33.5) * P, 'AUTO REVERSE', { font: 'Pixel', size: 5, fill: '#7d8596' })
}
// ── More desk things (from the references) ──
function floppy(x, y, color, label) {
  let o = box(x, y, 30, 30, color[0], color[1], color[2])
  o += R(x + 8, y + 1, 14, 9, C.metal) + R(x + 16, y + 2, 4, 7, C.metalD) + R(x + 8, y + 1, 14, 1, C.metalL)
  o += box(x + 4, y + 14, 22, 14, C.paperL, '#ffffff', C.paperD, { shadow: false }) + R(x + 5, y + 15, 20, 2, C.red)
  return o + t((x + 15) * P, (y + 23.5) * P, label, { font: 'Pixelify', size: 15, anchor: 'middle' }) + R(x + 2, y + 27, 2, 2, C.line)
}
function cd(cx, cy) {
  let o = disc(cx + 1, cy + 1.5, 15, 'rgba(0,0,0,.3)') + disc(cx, cy, 15, '#9aa3b3') + disc(cx, cy, 14, '#dfe4ec')
  o += `<g opacity=".55">${ell(cx - 5, cy - 4, 6, 3, '#f7b3e0')}${ell(cx + 4, cy + 5, 7, 3, '#a8f0e8')}${ell(cx + 6, cy - 6, 4, 2, '#fbe58a')}</g>`
  return o + disc(cx, cy, 5, '#b9c0cc') + disc(cx, cy, 3, '#9aa3b3') + disc(cx, cy, 2, 'rgba(0,0,0,0)')
}
function stapler(x, y) {
  return box(x, y + 2, 40, 9, '#2f8f8a', '#4fb3ad', '#1f6b67') + box(x + 2, y, 34, 7, '#3aa39d', '#62c2bb', '#2a7f7a', { shadow: false }) + R(x + 30, y + 2, 4, 3, C.metal)
}
function tapeDispenser(x, y) {
  let o = box(x, y, 34, 18, C.red, C.redL, C.redD)
  o += disc(x + 13, y + 9, 7, '#e8dfc8') + disc(x + 13, y + 9, 4, C.redD) + R(x + 22, y + 7, 10, 4, 'rgba(255,255,255,.45)')
  return o + R(x + 31, y + 6, 2, 6, C.metalD)
}
function penCup(cx, cy) {
  let o = disc(cx + 1, cy + 1.5, 12, 'rgba(0,0,0,.35)') + disc(cx, cy, 12, C.line) + disc(cx, cy, 11, '#3fa45a') + disc(cx, cy, 9, '#1e4f2c')
  o += disc(cx - 4, cy - 3, 2, C.blue) + disc(cx + 3, cy - 4, 2, '#f2c230') + disc(cx - 2, cy + 4, 2, C.red) + disc(cx + 4, cy + 3, 2, C.ink) + disc(cx, cy, 2, '#f08a9a')
  return o + R(cx - 9, cy - 1, 6, 2, C.metal) + R(cx - 13, cy - 2, 4, 4, C.red)
}
function soda(cx, cy) {
  let o = disc(cx + 1, cy + 1.5, 9, 'rgba(0,0,0,.35)') + disc(cx, cy, 9, C.line) + disc(cx, cy, 8, '#c62f2f') + disc(cx, cy, 7, C.metal) + disc(cx, cy, 6, C.metalL)
  return o + ell(cx, cy - 2, 2, 3, C.line) + box(cx - 2, cy, 5, 4, C.metalD, C.metal, '#5a6070', { shadow: false })
}
function paperBall(cx, cy) {
  let o = disc(cx + 1, cy + 1.5, 6, 'rgba(0,0,0,.3)') + disc(cx, cy, 6, '#b9b3a6') + disc(cx, cy, 5, '#f4f1ea')
  return o + R(cx - 3, cy - 2, 3, 1, '#cfc9bc') + R(cx + 1, cy + 1, 3, 1, '#cfc9bc') + R(cx - 1, cy + 3, 2, 1, '#cfc9bc') + R(cx + 2, cy - 3, 1, 2, '#cfc9bc')
}
function camera(x, y) {
  let o = box(x, y + 4, 46, 26, '#2b2b33', '#44444f', '#18181e') + box(x + 6, y, 14, 6, '#2b2b33', '#44444f', '#18181e', { shadow: false })
  o += R(x + 1, y + 6, 44, 6, '#3a3a44')
  for (let i = 0; i < 10; i++) o += R(x + 2 + i * 4, y + 16, 2, 12, '#24242b')
  o += disc(x + 30, y + 22, 11, C.line) + disc(x + 30, y + 22, 10, '#3a3a44') + disc(x + 30, y + 22, 7, '#15151a') + disc(x + 30, y + 22, 5, '#2a3a6a') + R(x + 27, y + 19, 2, 2, 'rgba(255,255,255,.6)')
  return o + keycap(x + 38, y + 1, 6, 4, 'esc') + R(x + 8, y + 1, 10, 3, '#9fb8d8')
}
function gameBox(x, y) {
  let o = box(x, y, 66, 46, '#2a4fa3', '#3d6fd6', '#1d3a7a') + R(x + 1, y + 1, 64, 10, C.red)
  o += t((x + 33) * P, (y + 8.4) * P, 'FAMILY GAME NIGHT', { font: 'Pixel', size: 7, fill: '#fff', anchor: 'middle' })
  o += t((x + 33) * P, (y + 24) * P, 'SHIP IT!', { font: 'Pixelify', size: 42, fill: '#f2c230', anchor: 'middle' })
  o += t((x + 33) * P, (y + 31) * P, 'the game of endless revisions', { size: 15, fill: '#dfe7ff', anchor: 'middle' })
  for (let i = 0; i < 12; i++) o += disc(x + 6 + i * 5, y + 38, 1.5, ['#f2c230', C.red, '#3fa45a', '#fff'][i % 4])
  return o + t((x + 62) * P, (y + 44) * P, 'AGES 8+', { font: 'Pixel', size: 5, fill: '#dfe7ff', anchor: 'end' })
}

function gamepad(x, y) {
  // A pad from above: rounded ends, shoulder buttons, D-pad, four face keys, select and start
  const body = (dx, dy, c, g) => disc(x + 13 + dx, y + 13 + dy, 13 + g, c) + disc(x + 45 + dx, y + 13 + dy, 13 + g, c) + R(x + 13 + dx, y - g + dy, 32, 26 + 2 * g, c)
  let o = cable([[x + 29, y], [x + 29, y - 10], [x + 42, y - 14], [x + 46, y - 34]], '#3a3d45')
  o += keycap(x + 3, y - 3, 17, 6, 'mod') + keycap(x + 38, y - 3, 17, 6, 'mod')
  o += body(1, 1.5, 'rgba(0,0,0,.35)', 1) + body(0, 0, C.line, 1) + body(0, 0, CASE[0], 0) + R(x + 13, y + 1, 32, 1, CASE[1]) + R(x + 13, y + 24, 32, 1, CASE[2])
  o += disc(x + 13, y + 13, 9, '#bcc1c9') + disc(x + 45, y + 13, 10, '#bcc1c9')
  o += keycap(x + 6, y + 11, 15, 5, 'mod') + keycap(x + 11, y + 6, 5, 15, 'mod') + R(x + 12, y + 12, 3, 3, '#4a4e5a')
  o += keycap(x + 42, y + 4, 6, 6, 'blue', 'X', 5) + keycap(x + 49, y + 10, 6, 6, 'esc', 'A', 5) + keycap(x + 42, y + 16, 6, 6, 'yellow', 'B', 5) + keycap(x + 35, y + 10, 6, 6, 'green', 'Y', 5)
  o += keycap(x + 22, y + 15, 6, 3, 'mod') + keycap(x + 30, y + 15, 6, 3, 'mod')
  o += t((x + 29) * P, (y + 9) * P, 'PLAYER 1', { font: 'Pixel', size: 5, fill: '#7d8596', anchor: 'middle' })
  return o + `<g class="blink">${R(x + 28, y + 21, 2, 1, C.green)}</g>`
}
function mouse(cx, cy) {
  let o = ell(cx + 1, cy + 1.5, 12, 17, 'rgba(0,0,0,.35)') + ell(cx, cy, 12, 17, C.line) + ell(cx, cy, 11, 16, CASE[0]) + ell(cx - 1, cy - 1, 9, 14, CASE[1]) + ell(cx, cy + 1, 10, 14, CASE[0])
  o += keycap(cx - 8, cy - 11, 8, 12, 'key') + keycap(cx, cy - 11, 8, 12, 'key') + keycap(cx - 1.5, cy - 8, 3, 6, 'mod')
  return o + R(cx - 3, cy + 8, 6, 1, CASE[2])
}
// Over-ear headphones lying flat, in black and grey: a padded band arching over two oval cups,
// shells up, with the cushions peeking out on the inside and metal sliders into the band.
function headphones(cx, cy) {
  const K = { shell: '#2f3238', shellL: '#4a4e57', shellD: '#1d1f23', pad: '#141518', grey: '#6b707a' }
  const r0 = 25, r1 = 32
  const band = (a, b, c, dx = 0, dy = 0) => {
    let o = ''
    for (let j = -b; j < 0; j++) {
      const yy = j + 0.5, ho = Math.round(Math.sqrt(b * b - yy * yy)), hi = Math.abs(yy) < a ? Math.round(Math.sqrt(a * a - yy * yy)) : 0
      if (ho <= 0) continue
      o += hi > 0 ? R(cx - ho + dx, cy + j + dy, ho - hi, 1, c) + R(cx + hi + dx, cy + j + dy, ho - hi, 1, c) : R(cx - ho + dx, cy + j + dy, 2 * ho, 1, c)
    }
    return o
  }
  let o = band(r0, r1, 'rgba(0,0,0,.35)', 1, 1.5) + band(r0, r1, C.line) + band(r0 + 1, r1 - 1, K.shell) + band(r0 + 1, r0 + 3, K.grey) + band(r1 - 2, r1 - 1, K.shellL)
  for (let k = 1; k < 12; k++) { const a = Math.PI * (1 + k / 12); o += R(cx + Math.round(Math.cos(a) * (r0 + 2)), cy + Math.round(Math.sin(a) * (r0 + 2)), 1, 1, '#8a8f99') }
  for (const sx of [-1, 1]) {
    const ccx = cx + sx * (r0 + 3.5), ccy = cy + 15
    o += R(ccx - 1.5, cy - 1, 3, 3, C.metal) + R(ccx - 1.5, cy - 1, 1, 3, C.metalL)
    o += ell(ccx - sx * 3 + 1, ccy + 1.5, 12, 15, 'rgba(0,0,0,.35)') + ell(ccx - sx * 3, ccy, 12, 15, C.line) + ell(ccx - sx * 3, ccy, 11, 14, K.pad)
    o += ell(ccx + 1, ccy + 1.5, 12, 15, 'rgba(0,0,0,.3)') + ell(ccx, ccy, 12, 15, C.line) + ell(ccx, ccy, 11, 14, K.shellD) + ell(ccx - 1, ccy - 1, 10, 13, K.shell)
    o += ell(ccx, ccy, 7, 10, C.line) + ell(ccx, ccy, 6, 9, K.shellL) + ell(ccx + 1, ccy + 1, 5, 8, K.shell) + disc(ccx, ccy, 2, K.grey)
    o += R(ccx - 7, ccy - 9, 1, 4, 'rgba(255,255,255,.3)') + R(ccx - 6, ccy - 10, 2, 1, 'rgba(255,255,255,.3)')
  }
  const rx = cx + r0 + 3.5
  o += keycap(rx + 9, cy + 18, 4, 6, 'mod') + R(cx - r0 - 4.5, cy + 29, 3, 3, C.line)
  return o + `<g class="blink" style="animation-duration:2.4s">${R(rx + 10, cy + 10, 2, 1, C.green)}</g>`
}
// A small tactical watch: olive straps on lugs, a ridged bezel with five pushers, a reflective face.
function garmin(cx, cy) {
  const olive = '#4b513f', oliveD = '#383d2f', oliveL = '#5d6450', r = 13
  let o = R(cx - 6, cy - 33, 12, 22, C.line) + R(cx - 4, cy - 35, 8, 2, C.line) + R(cx - 5, cy - 33, 10, 22, olive) + R(cx - 3, cy - 34, 6, 1, olive) + R(cx - 5, cy - 33, 1, 22, oliveL) + R(cx + 4, cy - 33, 1, 22, oliveD)
  for (let i = 0; i < 4; i++) o += R(cx - 1, cy - 30 + i * 4, 2, 2, oliveD)
  o += R(cx - 6, cy + 11, 12, 20, C.line) + R(cx - 5, cy + 11, 10, 20, olive) + R(cx - 5, cy + 11, 1, 20, oliveL) + R(cx + 4, cy + 11, 1, 20, oliveD)
  o += R(cx - 6, cy + 20, 12, 3, oliveD) + R(cx - 6, cy + 20, 12, 1, oliveL)
  o += frame(cx - 7, cy + 30, 14, 6, C.line) + frame(cx - 6, cy + 31, 12, 4, C.metal) + R(cx - 0.5, cy + 31, 1, 3, C.metalL)
  o += R(cx - 7, cy - 14, 14, 4, C.line) + R(cx - 6, cy - 13, 12, 2, '#3f4346') + R(cx - 7, cy + 10, 14, 4, C.line) + R(cx - 6, cy + 11, 12, 2, '#3f4346')
  for (const [deg, red] of [[150, 0], [180, 0], [210, 0], [325, 1], [35, 0]]) {
    const a = deg * Math.PI / 180, px = cx + Math.cos(a) * (r + 1.5), py = cy + Math.sin(a) * (r + 1.5)
    o += R(px - 2.5, py - 2, 5, 4, C.line) + R(px - 1.5, py - 1, 3, 2, red ? C.red : C.metalD) + R(px - 1.5, py - 1, 3, 1, red ? C.redL : C.metal)
  }
  o += disc(cx + 1, cy + 1.5, r, 'rgba(0,0,0,.35)') + disc(cx, cy, r, C.line) + disc(cx, cy, r - 1, '#3f4346')
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; o += R(cx + Math.round(Math.cos(a) * (r - 2)) - 0.5, cy + Math.round(Math.sin(a) * (r - 2)) - 0.5, 1, 1, k % 3 ? '#5a5f66' : '#d6dbe3') }
  o += disc(cx, cy, r - 3, C.line) + disc(cx, cy, r - 4, '#c9d2b8') + R(cx - 6, cy - 6, 3, 1, 'rgba(255,255,255,.5)')
  o += t(cx * P, (cy + 1.6) * P, '09:41', { font: 'Pixel', size: 8, fill: '#1e2418', anchor: 'middle' })
  return o + t(cx * P, (cy + 6) * P, '8,412', { size: 12, fill: '#4a5340', anchor: 'middle' }) + R(cx - 4, cy - 6, 8, 1, C.red)
}
function plant(cx, cy) {
  let o = disc(cx + 1.5, cy + 2, 16, 'rgba(0,0,0,.35)') + disc(cx, cy, 16, C.line) + disc(cx, cy, 15, '#d98450') + disc(cx, cy, 13, '#b5612f') + disc(cx, cy, 12, '#4a2f1c')
  for (let k = 0; k < 14; k++) { const a = k * 2.4, r = 2 + (k * 5) % 9; o += R(cx + Math.round(Math.cos(a) * r), cy + Math.round(Math.sin(a) * r), 1, 1, '#6a4630') }
  const leaf = (deg, len, w, c, cD) => `<g transform="rotate(${deg} ${cx * P} ${cy * P})">${ell(cx, cy - len, w + 1, len - 1, C.line)}${ell(cx, cy - len, w, len - 2, c)}${R(cx - 0.5, cy - 2 * len + 4, 1, 2 * len - 6, cD)}</g>`
  for (let k = 0; k < 7; k++) o += leaf(k * 51 + 8, 10, 3, k % 2 ? '#3c8f4a' : '#4aa358', '#2c6e38')
  for (let k = 0; k < 4; k++) o += leaf(k * 90 + 40, 6, 2, '#6cc46c', '#3c8f4a')
  return o + disc(cx, cy, 2, '#7fd17f')
}
function cigarettes(x, y) {
  // Lying face up with the flip-top lid folded back flat: the lid's inside shows above the pack, and
  // the tops of the cigarettes show in the opening, one pulled further out over the lid.
  let o = box(x, y - 12, 30, 13, '#efebe2', '#ffffff', '#d8d4cc') + R(x + 2, y - 10, 26, 8, '#e4dfd2') + R(x + 1, y - 11, 28, 1, C.red)
  o += box(x, y, 30, 44, C.white, '#ffffff', '#d8d4cc')
  o += R(x + 1, y + 1, 28, 10, '#bfc3ca') + R(x + 1, y + 1, 28, 1, '#dfe3e9')
  for (let i = 0; i < 7; i++) {
    const fx = x + 1.6 + i * 3.85, top = i === 2 ? y - 9 : y + 2 + (i % 2) * 0.5, tip = top + 7
    if (i === 2) o += R(fx + 1, top + 1.5, 3.6, y + 2 - top, 'rgba(0,0,0,.2)')
    o += R(fx, top, 3.6, Math.min(tip, y + 10) - top, '#e3a75a') + (tip < y + 10 ? R(fx, tip, 3.6, y + 10 - tip, C.white) : '')
    o += R(fx, top, 0.8, y + 10 - top, 'rgba(255,255,255,.35)') + R(fx + 2.8, top, 0.8, y + 10 - top, 'rgba(120,70,20,.3)') + R(fx, top, 3.6, 0.8, '#f2c98f')
    o += R(fx + 1.2, top + 2, 0.8, 0.8, '#b4772e') + R(fx + 2, top + 4.2, 0.8, 0.8, '#b4772e')
  }
  o += R(x + 1, y + 10, 28, 2, '#efebe2') + R(x + 11, y + 10, 8, 1, '#ffffff') + R(x + 1, y + 12, 28, 1, C.red) + R(x + 1, y + 13, 28, 0.5, '#d9b44a')
  o += t((x + 15) * P, (y + 24) * P, 'KINGS', { font: 'Pixelify', size: 26, fill: C.redD, anchor: 'middle' })
  o += R(x + 1, y + 30, 28, 12, C.ink) + t((x + 15) * P, (y + 35) * P, 'SMOKING', { font: 'Pixel', size: 7, fill: '#fff', anchor: 'middle' }) + t((x + 15) * P, (y + 38.7) * P, 'THRILLS', { font: 'Pixel', size: 7, fill: '#fff', anchor: 'middle' })
  return o
}
// A scrap of newsprint, mostly tucked under something, with a headline and columns of grey type.
let clipId = 0
function clipping(x, y, w, h, head) {
  const np = '#e9e4d6', id = 'cl' + clipId++
  let o = R(x + 1, y + 1.5, w, h, 'rgba(0,0,0,.3)') + R(x, y, w, h, np)
  for (let i = 0; i < w; i++) { if (rnd() < 0.5) o += R(x + i, y - 1, 1, 1, np); if (rnd() < 0.5) o += R(x + i, y + h, 1, 1, np) }
  o += `<clipPath id="${id}"><rect x="${x * P}" y="${y * P}" width="${w * P}" height="${h * P}"/></clipPath><g clip-path="url(#${id})">`
  o += t((x + 3) * P, (y + 6) * P, head, { font: 'Pixelify', size: 17, fill: C.ink }) + R(x + 3, y + 8, w - 6, 0.5, C.ink)
  const cols = Math.max(1, Math.floor((w - 4) / 18))
  for (let c = 0; c < cols; c++) {
    const cx = x + 3 + c * 18
    if (c === 0 && h > 22) { o += R(cx, y + 10, 15, 9, '#b9b3a6'); for (let i = 0; i < 7; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) o += R(cx + 1 + i * 2, y + 11 + j * 2, 1, 1, '#8f897c') }
    for (let ly = y + (c === 0 && h > 22 ? 21 : 10); ly < y + h - 1; ly += 2) o += R(cx, ly, 15 - (rnd() < 0.2 ? 5 : 0), 0.7, '#9a968a')
  }
  return o + `</g>`
}

// ── Pixel stickers ──
const LOGOS = JSON.parse(readFileSync(`${HERE}data/pixel-logos.json`, 'utf8'))
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
const toHex = (a) => '#' + a.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
const aged = (c) => { const [r, g, b] = hex(c), y = 0.3 * r + 0.59 * g + 0.11 * b; return toHex([r, g, b].map((v, i) => (v * 0.45 + y * 0.55) * 0.8 + [217, 205, 179][i] * 0.2)) }
// Rows of a pixel set drawn as runs.
function runs(N, on, x, y, c) {
  let o = ''
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { if (!on(i, j)) continue; let k = i; while (k + 1 < N && on(k + 1, j)) k++; o += R(x + i, y + j, k - i + 1, 1, c); i = k }
  return o
}
// A die-cut vinyl sticker of a pixel logo. `old` fades and scuffs it; `lift` peels its bottom-right
// corner back over itself, showing the backing paper and a shadow where it left the table.
function logoSticker(x, y, name, { old = false, lift = false, round = false } = {}) {
  const N = 24, L = 9, c = 2 * N - 2 - L
  const shape = (i, j) => i >= 0 && j >= 0 && i < N && j < N && (round ? (i - 11.5) ** 2 + (j - 11.5) ** 2 <= 144 : !((i === 0 || i === N - 1) && (j < 2 || j > N - 3)) && !((j === 0 || j === N - 1) && (i < 2 || i > N - 3)))
  const cut = (i, j) => lift && i + j > c
  const on = (i, j) => shape(i, j) && !cut(i, j)
  const core = (i, j) => on(i, j) && on(i - 1, j) && on(i + 1, j) && on(i, j - 1) && on(i, j + 1)
  let o = runs(N, on, x + 1, y + 1.5, 'rgba(0,0,0,.38)') + runs(N, on, x, y, C.line) + runs(N, core, x, y, old ? '#ece3cf' : '#ffffff')
  const px = LOGOS[name]
  px.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const col = row[i]
      if (!col || !core(i + 3, j + 3)) continue
      let k = i
      while (k + 1 < row.length && row[k + 1] === col && core(k + 4, j + 3)) k++
      o += R(x + i + 3, y + j + 3, k - i + 1, 1, old ? aged(col) : col)
      i = k
    }
  })
  if (old) for (let k = 0; k < 7; k++) { const i = 3 + Math.floor(rnd() * 18), j = 3 + Math.floor(rnd() * 18); if (core(i, j)) o += R(x + i, y + j, 1 + (k % 2), 1, '#ece3cf') }
  else o += runs(N, (i, j) => core(i, j) && (i - j === 9 || i - j === 10), x, y, 'rgba(255,255,255,.4)')
  if (lift) {
    const flap = (i, j) => shape(c - j, c - i) && cut(c - j, c - i)
    const fcore = (i, j) => flap(i, j) && flap(i - 1, j) && flap(i + 1, j) && flap(i, j - 1) && flap(i, j + 1)
    o += runs(N, (i, j) => shape(i, j) && cut(i, j), x, y, 'rgba(0,0,0,.22)')
    o += runs(N, (i, j) => flap(i - 1, j - 1), x, y, 'rgba(0,0,0,.25)') + runs(N, flap, x, y, C.line) + runs(N, fcore, x, y, '#dcdad3') + runs(N, (i, j) => fcore(i, j) && i + j === c - 1, x, y, '#f4f3ef')
  }
  return o
}
function gtaSticker(x, y) {
  let o = box(x, y, 30, 28, '#ffffff', '#ffffff', '#dddddd') + box(x + 2, y + 2, 26, 24, '#15111c', '#2a2333', '#0c0a10', { shadow: false })
  o += t((x + 15) * P, (y + 9) * P, 'GTA', { font: 'Pixel', size: 9, fill: '#fff', anchor: 'middle', extra: ' letter-spacing="1"' })
  return o + t((x + 15) * P, (y + 23.5) * P, 'VI', { font: 'Pixelify', size: 50, fill: 'url(#sunset)', anchor: 'middle' })
}
const PALM = ['..XX.XX..', '.XXXXXXX.', 'XX.XXX.XX', 'X..XXX..X', '....X....', '....X....', '...X.....', '...X.....', '...X.....', '..X......']
function viceSticker(cx, cy) {
  let o = disc(cx + 1, cy + 1.5, 15, 'rgba(0,0,0,.38)') + disc(cx, cy, 15, C.line) + disc(cx, cy, 14, '#ffffff')
  const bands = ['#ffd166', '#ffb36b', '#ff8a7a', '#ff6b8b', '#d45bc4', '#8a4fff']
  for (let j = -12; j < 12; j++) { const half = Math.round(Math.sqrt(144 - (j + 0.5) ** 2)); o += R(cx - half, cy + j, 2 * half, 1, j > 3 && j % 3 === 0 ? '#2b1840' : bands[Math.min(5, Math.floor((j + 12) / 4))]) }
  return o + bitmap(PALM, cx - 3, cy - 5, { X: '#1b1028' })
}
function toggleSticker(x, y) {
  let o = box(x, y, 30, 16, '#ffffff', '#ffffff', '#dddddd')
  o += ell(x + 15, y + 8, 11, 5, '#d6d6d2') + disc(x + 20, y + 8, 4, C.green) + disc(x + 10, y + 8, 5, C.line) + disc(x + 10, y + 8, 4, '#ffffff')
  return o
}

const DOG = ['..BB............BB..', '.BBBB..bbbbbb..BBBB.', 'BBBBBbbbbbbbbbbBBBBB', 'BBBBbbbbbbbbbbbbBBBB', 'BBBbbbbbbbbbbbbbbBBB', 'BBBbbkkbbbbbbkkbbBBB', 'BBBbbkkbbbbbbkkbbBBB', 'BBbbbbbbbbbbbbbbbbBB', 'BBbbbbbwwwwwwbbbbbBB', '.Bbbbbwwwkkwwwbbbbb.', '.Bbbbwwwwkkwwwwbbbb.', '..bbbwwwwwwwwwwbbb..', '..bbbbwwwkkwwwbbbb..', '...bbbbwwppwwbbbb...', '....bbbbbppbbbbb....', '......bbbbbbbb......']
const ARROW = ['X...........', 'XX..........', 'XyX.........', 'XyyX........', 'XyyyX.......', 'XyyyyX......', 'XyyyyyX.....', 'XyyyyyyX....', 'XyyyyyyyX...', 'XyyyyyyyyX..', 'XyyyyyXXXXX.', 'XyyXyyX.....', 'XyX.XyyX....', 'XX..XyyX....', 'X....XyyX...', '.....XyyX...', '......XX....']
const pixelSticker = (rows, colors, x, y, s, d = 2) => dieCut(rows, x, y, d, s) + bitmap(rows, x, y, colors, s)

// ── About: an open passport on its data page ─────────────────────────────────
const LEAF = ['....#....', '...###...', '#.#####.#', '#########', '.#######.', '..#####..', '.###.###.', '....#....', '....#....']
let stampId = 0
function realStamp(cx, cy, deg, color, s, op = 0.85) {
  const id = 'sp' + stampId++, sw = `fill="none" stroke="${color}"`
  let o = ''
  if (s.shape === 'circle') {
    const r = s.r ?? 46, rt = r - 13, rb = r - 5
    o += `<circle cx="${cx}" cy="${cy}" r="${r}" ${sw} stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r - 17}" ${sw} stroke-width="1.5"/>`
    o += `<path id="${id}t" d="M${cx - rt} ${cy}A${rt} ${rt} 0 0 1 ${cx + rt} ${cy}" fill="none"/><path id="${id}b" d="M${cx - rb} ${cy}A${rb} ${rb} 0 0 0 ${cx + rb} ${cy}" fill="none"/>`
    for (const [k, txt] of [['t', s.top], ['b', s.bottom]]) o += `<text font-family="VT" font-size="13" fill="${color}"><textPath href="#${id}${k}" startOffset="50%" text-anchor="middle">${esc(txt)}</textPath></text>`
    o += t(cx, cy - 8, s.date, { size: 12, fill: color, anchor: 'middle' }) + t(cx, cy + 13, s.code, { size: s.codeSize ?? 28, fill: color, anchor: 'middle' })
  } else {
    const lines = s.lines
    const w = Math.max(...lines.map(([q, n]) => q.length * n * 0.44)) + 24, lh = lines.map(([, n]) => n * 0.9 + 3), h = lh.reduce((a, b) => a + b, 0) + 14
    const x0 = cx - w / 2, y0 = cy - h / 2
    o += {
      rect: `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="3" ${sw} stroke-width="3"/>`,
      double: `<rect x="${x0 - 5}" y="${y0 - 5}" width="${w + 10}" height="${h + 10}" rx="5" ${sw} stroke-width="3"/><rect x="${x0}" y="${y0}" width="${w}" height="${h}" ${sw} stroke-width="1.5"/>`,
      oval: `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2 + 12}" ry="${h / 2 + 8}" ${sw} stroke-width="3"/>`,
      oct: `<polygon points="${[[-1, -0.6], [-0.6, -1], [0.6, -1], [1, -0.6], [1, 0.6], [0.6, 1], [-0.6, 1], [-1, 0.6]].map(([a, b]) => `${cx + a * (w / 2 + 8)},${cy + b * (h / 2 + 8)}`).join(' ')}" ${sw} stroke-width="3"/>`,
    }[s.shape]
    let ty = y0 + 7
    lines.forEach(([q, n], i) => { ty += lh[i]; o += t(cx, ty - 2, q, { size: n, fill: color, anchor: 'middle' }) })
  }
  return `<g transform="rotate(${deg} ${cx} ${cy})"><g filter="url(#ink)" opacity="${op}" style="mix-blend-mode:multiply" shape-rendering="auto">${o}</g></g>`
}
// Older, fainter repeats of some stamps (by index into STAMPS), under the rest, so the page is full
const RESTAMPS = [[9, 7, 16, 0], [38, 6, -18, 2], [83, 66, -24, 3], [10, 98, -8, 6], [27, 67, 32, 5], [86, 12, 21, 1], [56, 37, -30, 7], [61, 99, 15, 9], [4, 38, -27, 4], [86, 84, 9, 10], [40, 84, -35, 11]]
// "Canada" in Baskerville, drawn at half-pixel scale, with the flag over its last "a"
const WORDMARK = JSON.parse(readFileSync(`${HERE}data/canada-wordmark.json`, 'utf8'))
const FLAG = ['RRWWWWWRR', 'RRWWRWWRR', 'RRWRRRWRR', 'RRWWRWWRR']
const STAMPS = [
  [20, 24, -12, '#2f7a3e', { shape: 'circle', top: 'PAKISTAN', bottom: 'KARACHI · ARRIVAL', code: 'KHI', date: '14 AUG 19' }],
  [44, 31, -24, '#2b2b33', { shape: 'rect', lines: [['PAKISTAN', 12], ['LHE  →', 22], ['DEPARTED 27 DEC 18', 11]] }],
  [64, 19, 8, '#b8322c', { shape: 'double', lines: [['CANADA', 15], ['YYZ', 30], ['02 JAN 24', 12], ['ADMITTED', 12]] }],
  [82, 38, 12, '#2f6e3e', { shape: 'rect', lines: [['FRANCE', 12], ['CDG', 22], ['15.06.22', 11]] }],
  [6, 58, 18, '#1e7a7a', { shape: 'circle', r: 40, top: 'MEXICO', bottom: 'CANCUN · ENTRADA', code: 'CUN', date: '11 FEB 21' }],
  [31, 51, 5, '#24489c', { shape: 'oval', lines: [['REP. DOMINICANA', 13], ['PUJ', 28], ['ENTRADA 21 DIC 22', 12]] }],
  [66, 54, -9, '#1f2f6e', { shape: 'oct', lines: [['U.S. IMMIGRATION', 12], ['JFK', 28], ['09 JUL 23', 12]] }],
  [46, 71, 22, '#5b3fa0', { shape: 'oval', lines: [['TURKIYE', 12], ['IST', 24], ['GIRIS', 11]] }],
  [21, 83, 11, '#7a1f3a', { shape: 'rect', lines: [['UNITED KINGDOM', 12], ['LHR', 26], ['LEAVE TO ENTER', 11], ['18 OCT 22', 11]] }],
  [67, 84, -16, '#8a5a1a', { shape: 'circle', top: 'DUBAI', bottom: 'U.A.E. · ARRIVAL', code: 'DXB', date: '03 MAR 23' }],
  [44, 96, -6, '#2b2b33', { shape: 'circle', r: 40, top: 'CANADA', bottom: 'YVR · ARRIVAL', code: 'YVR', date: '30 SEP 21' }],
  [84, 99, 4, '#b8322c', { shape: 'rect', lines: [['UNITED STATES', 11], ['LAX', 22], ['DEPARTED', 11]] }],
]
function passport(x, y) {
  const pw = 84, ph = 98, rx = x + pw
  let b = box(x - 3, y - 3, 2 * pw + 6, ph + 6, C.blueD, C.blue, '#1d3a7a')
  b += box(x, y, pw, ph, C.paper, C.paperL, C.paperD, { shadow: false }) + box(rx, y, pw, ph, C.paper, C.paperL, C.paperD, { shadow: false })
  b += R(rx - 2, y + 1, 2, ph - 2, C.paperD) + R(rx, y + 1, 2, ph - 2, C.paperD) + R(rx - 1, y + 1, 1, ph - 2, C.rule)
  // Visa page: a well-travelled page of overlapping stamps, running off its edges
  LEAF.forEach((r, j) => [...r].forEach((v, i) => { if (v === '#') b += R(x + 24 + i * 4, y + 30 + j * 4, 4, 4, 'rgba(214,69,61,.06)') }))
  b += t((x + 6) * P, (y + 8) * P, 'VISAS', { font: 'Pixel', size: 8, fill: C.soft, extra: ' letter-spacing="2"' }) + t((rx - 6) * P, (y + 8) * P, '07', { font: 'Pixel', size: 8, fill: C.soft, anchor: 'end' })
  b += `<clipPath id="visa"><rect x="${(x + 1) * P}" y="${(y + 1) * P}" width="${(pw - 3) * P}" height="${(ph - 2) * P}"/></clipPath><g clip-path="url(#visa)">`
  RESTAMPS.forEach(([ax, ay, deg, k]) => { const [, , , color, s] = STAMPS[k]; b += realStamp((x + ax) * P, (y + ay) * P, deg, color, s, 0.5) })
  STAMPS.forEach(([ax, ay, deg, color, s]) => { b += realStamp((x + ax) * P, (y + ay) * P, deg, color, s) })
  b += `</g>`
  // Data page, laid out like a Canadian passport's: guilloche, a faint maple leaf, photo on the left,
  // bilingual fields, the bearer's signature, a vertical number, and the machine-readable zone
  let g = ''
  for (let k = 0; k < 7; k++) {
    let d = ''
    for (let i = 0; i <= 40; i++) { const px = (rx + 3 + i * 2) * P, py = (y + 14 + k * 9 + Math.sin(i / 3 + k) * 2.2) * P; d += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1) }
    g += `<path d="${d}" fill="none" stroke="#c7d8f0" stroke-width="1.5"/>`
  }
  b += `<g shape-rendering="auto" opacity=".8">${g}</g>` + bitmap(LEAF, rx + 42, y + 30, { '#': 'rgba(214,69,61,.07)' }, 4)
  b += t((rx + 5) * P, (y + 7) * P, 'PASSPORT', { font: 'Pixel', size: 7, extra: ' letter-spacing="1"' }) + t((rx + 5) * P, (y + 11) * P, 'PASSEPORT', { font: 'Pixel', size: 6, fill: C.soft, extra: ' letter-spacing="1"' })
  const ww = WORDMARK[0].length / 2, wx = rx + pw - 5 - ww, wy = y + 4
  b += bitmap(WORDMARK, wx, wy, { '#': C.ink }, 0.5) + bitmap(FLAG, wx + (WORDMARK[0].length - 8) / 2, wy, { R: C.red, W: C.paperL }, 0.5)
  const phx = rx + 4, phy = y + 16
  b += box(phx, phy, 33, 36, '#cfe0f5', '#e6f0fb', '#b4c9e6', { shadow: false }) + bitmap(CAT, phx + 1.5, phy + 13, { '#': C.ink })
  const fld = (fx, fy, l, v, size = 19) => t(fx * P, fy * P, l, { size: 12, fill: C.soft }) + t(fx * P, (fy + 4.8) * P, v, { size })
  const fx = rx + 40
  b += fld(fx, y + 18, 'Type', 'P') + fld(fx + 9, y + 18, 'Code/Code', 'CAN') + fld(fx + 24, y + 18, 'No./N°', 'MS2026', 17)
  b += fld(fx, y + 27, 'Surname/Nom', 'MAARIB') + fld(fx, y + 36, 'Nationality/Nationalité', 'CANADIAN/CANADIENNE', 16)
  b += fld(fx, y + 45, 'Level/Niveau', '12+ YEARS') + fld(fx + 21, y + 45, 'Base/Base', 'TORONTO')
  b += fld(rx + 4, y + 58, 'Worlds/Mondes', 'FINTECH • DEFI') + fld(fx, y + 58, 'Issued/Délivré', '14 JAN/JAN 13')
  b += fld(rx + 4, y + 66, 'Occupation/Profession', 'PRODUCT DESIGNER WHO BUILDS')
  b += t((fx + 2) * P, (y + 74.5) * P, 'Signature/Signature', { size: 11, fill: C.soft })
  b += t((fx + 3) * P, (y + 83) * P, 'Maarib', { font: 'Sig', size: 44, fill: '#1f3f8f', extra: ' shape-rendering="auto"' })
  b += `<text transform="translate(${(rx + pw - 2) * P} ${(y + 20) * P}) rotate(90)" font-family="VT" font-size="13" fill="${C.soft}" letter-spacing="2">MS2026</text>`
  b += R(rx + 1, y + 85, pw - 2, ph - 87, '#efe3c6')
  const mrz = (s) => (s + '<'.repeat(42)).slice(0, 42)
  b += t((rx + 4) * P, (y + 89.6) * P, mrz('P<CANMAARIB<<PRODUCT<DESIGNER<WHO<BUILDS'), { size: 16 })
  b += t((rx + 4) * P, (y + 94.4) * P, mrz('MS20264365<7CAN<FINTECH<DEFI<<<<<<<<<<<<<12'), { size: 16 })
  return tilt(-2.5, x + pw, y + ph / 2, b)
}
function about() {
  let o = tilt(-14, 10, 112, clipping(-8, 98, 44, 30, 'DESIGNER SHIPS AGAIN')) + tilt(6, 140, 10, clipping(116, -2, 54, 24, 'MARKETS RALLY'))
  o += tilt(14, 196, 16, keyboard(150, -8))
  o += tilt(-9, 52, 145, ticket(12, 128, 'SEAT 7')) + tilt(5, 70, 150, ticket(30, 136, 'SEAT 8'))
  o += tilt(-12, 50, 176, houseKey(30, 176))
  o += tilt(7, 160, 146, boardingPass(122, 130))
  o += tilt(-8, 6, 20, tape(-2, 22, 20, 6, 'rgba(236,220,170,.85)'))
  o += passport(12, 26)
  o += mug(204, 82)
  o += tilt(72, 206, 136, pencil(184, 134, 44))
  o += sticky(5, 9, 'ABOUT', -6)
  return { H: 172 * P, body: o, label: 'About, as an open Canadian passport. The visa page is covered edge to edge in entry and exit stamps: Pakistan (Karachi, Lahore), Canada (Toronto, Vancouver), the Dominican Republic, the United States (New York, Los Angeles), the United Kingdom, France, Mexico, Turkey and Dubai. The data page, under a Canada wordmark: photo of a black cat. Surname: Maarib. Nationality: Canadian. Level: 12+ years. Base: Toronto. Worlds: Fintech, DeFi. Occupation: product designer who builds. Signed Maarib. Around it: part of a keyboard, a mug of coffee, two Metallica tickets with a house key below them, a boarding pass from YYZ to anywhere, and a pencil.' }
}

const TEAMS = [
  ['FINTECH', ['Glow Finance', 'Megprime Pay', 'Concrete Finance', 'Credit Coop', 'Polymarket']],
  ['WEB3', ['XMTP', 'Koop', 'The Wall Street Journal', 'DC Pictures']],
  ['COMMERCE', ['Shop Bonsai', 'Suntory', 'Zala Hair', 'Complex']],
]
function teams() {
  const fw = 64, fh = 92, top = 24
  let o = tilt(7, 4, 70, clipping(-10, 52, 30, 40, 'CAT WINS AGAIN'))
  TEAMS.forEach(([name, list], i) => {
    const x = 8 + i * (fw + 6), y = top + [2, 0, 5][i]
    let f = box(x, y + 4, fw, fh - 4, C.manilaD, C.manila, C.orangeD)
    f += box(x + 2, y - 4, 28, 11, C.manila, C.manilaL, C.manilaD, { shadow: false })
    f += t((x + 5) * P, (y + 3.6) * P, name, { font: 'Pixel', size: 9, fill: C.ink, extra: ' letter-spacing="1"' })
    f += box(x + 5, y + 8, fw - 10, 20, C.paperL, '#ffffff', C.paperD, { shadow: false }) + [0, 1, 2].map((k) => R(x + 9, y + 12 + k * 4, fw - 22 - k * 6, 1, C.rule)).join('')
    f += box(x, y + 18, fw, fh - 18, C.manila, C.manilaL, C.manilaD)
    const lh = 7 + list.length * 6
    f += box(x + 4, y + 24, fw - 8, lh, C.paperL, '#ffffff', C.paperD, { shadow: false })
    list.forEach((n, k) => { f += t((x + 7) * P, (y + 30 + k * 6) * P + 1, n, { size: n.length > 19 ? 17 : 20 }) })
    if (i === 0) f += paperclip(x + fw - 12, y + 14)
    if (i === 1) f += ring(x + 22, y + 82, 9)
    if (i === 2) f += binderClip(x + 40, y + 8)
    o += tilt([-3, 1.5, -2][i], x + fw / 2, y + fh / 2, `<g class="in" style="animation-delay:${i * 0.15}s">${f}</g>`)
  })
  // On top of the folders: a stapler, a pack of cigarettes; below them, highlighters, an ashtray and a dog sticker
  o += tilt(18, 104, 92, stapler(84, 88))
  o += tilt(-20, 186, 122, cigarettes(172, 104))
  o += tilt(-6, 40, 126, highlighter(10, 122, 56, '#f2ee4a', '#fbf78a', '#c9c42a'))
  o += tilt(4, 96, 131, highlighter(66, 127, 56, '#ff6fa8', '#ff9cc4', '#d14a82'))
  o += ashtray(112, 151) + tilt(-8, 101, 150, cigarette(89, 148))
  o += tilt(-10, 146, 140, pixelSticker(CAT, { '#': C.ink }, 131, 130, 1))
  o += paperBall(16, 146) + paperBall(28, 150)
  o += tilt(10, 200, 16, pixelSticker(DOG, { B: '#6b3f1f', b: '#c58a4a', w: '#fbf3e6', k: C.ink, p: '#f08a9a' }, 185, 3, 1.5))
  o += sticky(146, 6, 'RANGE', 5)
  return { H: 160 * P, body: o, label: 'Range, as three manila folders. Fintech: ' + TEAMS[0][1].join(', ') + '. Web3: ' + TEAMS[1][1].join(', ') + '. Commerce: ' + TEAMS[2][1].join(', ') + '. On and around them, with a dog sticker by the label: a stapler, a pack of cigarettes, two highlighters, a cigarette resting in a glass ashtray, a cat sticker and balls of scrap paper.' }
}
// ── Stack: pixel logo stickers on a cutting mat ──────────────────────────────
function mat(x, y, w, h) {
  let o = box(x, y, w, h, '#2f7a4c', '#3d8e5c', '#24613c')
  for (let i = 5; i < w - 1; i += 5) o += R(x + i, y + 1, i % 25 ? 0.5 : 1, h - 2, 'rgba(255,255,255,.16)')
  for (let j = 5; j < h - 1; j += 5) o += R(x + 1, y + j, w - 2, j % 25 ? 0.5 : 1, 'rgba(255,255,255,.16)')
  for (let i = 5, n = 1; i < w - 10; i += 25, n += 5) o += t((x + i + 1) * P, (y + 4.4) * P, String(n), { font: 'Pixel', size: 6, fill: 'rgba(255,255,255,.55)' })
  return o + t((x + w - 4) * P, (y + h - 2.6) * P, 'SELF-HEALING CUTTING MAT · A2', { font: 'Pixel', size: 6, fill: 'rgba(255,255,255,.55)', anchor: 'end' })
}
const TOOLS = [
  ['figma'], ['sketch', { old: true, lift: true }], ['claude'], ['photoshop', { old: true, lift: true }], ['github', { round: true }], ['cursor'], ['framer'],
  ['jira', { old: true }], ['react', { round: true }], ['illustrator', { old: true }], ['tailwind'], ['chatgpt', { round: true }], ['xd', { old: true, lift: true }], ['nextjs', { round: true }],
  ['javascript'], ['confluence', { old: true, lift: true }], ['notion'], ['miro'], ['usertesting', { old: true }], ['vs-code'], ['maze'],
]
function stack() {
  const mx = 6, my = 16, mw = 213, mh = 118
  let o = tilt(-5, 180, 12, clipping(148, 0, 62, 22, 'FALL COLOURS PEAK'))
  o += tilt(-1.5, mx + mw / 2, my + mh / 2, mat(mx, my, mw, mh))
  const cols = 7, cw = (mw - 8) / cols, ch = (mh - 12) / 3
  TOOLS.forEach(([name, opt = {}], k) => {
    const sx = mx + 4 + (k % cols + 0.5) * cw - 12 + (rnd() - 0.5) * 3, sy = my + 7 + (Math.floor(k / cols) + 0.5) * ch - 12 + (rnd() - 0.5) * 3
    const deg = Math.round((rnd() - 0.5) * 28)
    o += `<g class="in" style="animation-delay:${(0.1 + k * 0.05).toFixed(2)}s">${tilt(deg, sx + 12, sy + 12, logoSticker(sx, sy, name, opt))}</g>`
  })
  o += tilt(-4, 60, 142, marker(30, 140, 50, C.red, C.redD)) + tilt(3, 130, 144, marker(100, 142, 50, C.blue, C.blueD))
  o += tilt(10, 172, 142, eraserBox(162, 138)) + tilt(-12, 202, 148, floppy(188, 134, ['#3d6fd6', '#6b95ea', '#2a4fa3'], 'BACKUP'))
  o += sticky(4, 8, 'STACK', -5)
  return { H: 160 * P, body: o, label: 'Stack, as pixel-art logo stickers on a green cutting mat: Figma, Framer, Claude, Cursor, GitHub, React, Next.js, JavaScript, Tailwind CSS, ChatGPT, Miro, Maze, Notion and VS Code look new; Sketch, Photoshop, Illustrator, XD, Jira, Confluence and UserTesting are older, faded and peeling. Below it: two markers, an eraser and a floppy disk.' }
}
const eraserBox = (x, y) => box(x, y, 18, 9, '#f08a9a', '#f7b3be', '#c9606f') + R(x + 1, y + 1, 7, 7, C.blue) + R(x + 1, y + 1, 7, 1, C.blueL)

// ── Side projects: a newspaper ───────────────────────────────────────────────
const PROJECTS = [
  ['Canopy', 'Fall colors across Canada, and what to explore in Ontario.', 'maarib.github.io/canopy'],
  ['Leaf icons', 'Tree leaf icons, and a small SVG editor for their stems and layers.', 'maarib.github.io/leaf-icons'],
  ['FPL Dashboard', 'Fantasy Premier League players, sortable and side by side.', 'maarib.github.io/fpl-dashboard'],
  ['CardCompare', 'Canadian credit cards compared on fees, earn rates, insurance and perks.', 'github.com/maarib/card-compare'],
  ['alert.engine', 'A stock and ETF watchlist with alerts, market briefs and sector exposure.', 'github.com/maarib/alert.engine'],
  ['page-comments', 'A Claude Code skill for leaving notes on any web page.', 'github.com/maarib/page-comments'],
]
const wrap = (s, n) => s.split(' ').reduce((ls, w) => { const l = ls.at(-1); if ((l + ' ' + w).trim().length > n) ls.push(w); else ls[ls.length - 1] = (l + ' ' + w).trim(); return ls }, [''])
function projects() {
  const x = 8, y = 22, w = 209, colW = 62, gap = 4, artH = 31, h = 44 + 2 * artH + 2
  let o = tilt(7, 186, 14, clipping(158, 2, 58, 24, 'TORONTO: SUNNY, 21°')) + tilt(9, 205, 120, receipt(186, 88)) + tilt(-10, 30, 150, note(4, 118, ['todo:', '- fewer meetings', '- more cats', '- ship it']))
  o += tilt(5, 104, 160, gameBox(72, 132))
  let n = box(x, y, w, h, C.paper, C.paperL, C.paperD)
  n += R(x + 6, y + 6, w - 12, 1, C.ink) + R(x + 6, y + 33, w - 12, 1, C.ink) + R(x + 6, y + 35, w - 12, 1, C.ink)
  n += t(W / 2, (y + 27) * P, 'SIDE PROJECTS', { font: 'Pixelify', size: 56, anchor: 'middle' })
  n += t((x + 8) * P, (y + 11) * P, 'VOL. XII', { font: 'Pixel', size: 8, fill: C.soft, extra: ' letter-spacing="1"' })
  n += t((x + w - 8) * P, (y + 11) * P, 'TORONTO, CANADA', { font: 'Pixel', size: 8, fill: C.soft, anchor: 'end', extra: ' letter-spacing="1"' })
  PROJECTS.forEach(([name, desc], i) => {
    const cx = x + 7 + (i % 3) * (colW + gap + 1), cy = y + 42 + Math.floor(i / 3) * artH
    let a = R(cx, cy - 2, colW, 1, C.rule)
    if (i === 0) a += R(cx - 1, cy + 1, 27, 8, 'rgba(242,238,74,.7)')
    a += t(cx * P, (cy + 7) * P, name, { font: 'Pixelify', size: 30 })
    wrap(desc, 30).forEach((l, k) => { a += t(cx * P, (cy + 14 + k * 5) * P, l, { size: 19, fill: C.soft }) })
    if (i % 3 < 2) a += R(cx + colW + 2, cy - 2, 1, artH - 3, C.rule)
    n += a
  })
  n += ring(x + w - 6, y + h - 3, 11)
  n += tilt(-35, x + 4, y + 2, tape(x - 8, y - 1, 24, 6, 'rgba(236,220,170,.85)'))
  o += tilt(-1.2, x + w / 2, y + h / 2, `<g class="in">${n}</g>`)
  o += cd(172, 162) + tilt(-14, 46, 168, tapeDispenser(30, 160))
  return { H: 182 * P, body: o, label: 'Side projects, as a newspaper front page headed Side Projects. ' + PROJECTS.map(([n, d]) => `${n}: ${d}`).join(' ') + ' A cat sticker is stuck on its corner; a cafe receipt, a todo note (fewer meetings, more cats, ship it) and a board game called Ship It! stick out from under it, next to a CD and a tape dispenser.' }
}

// ── Contact: envelope ────────────────────────────────────────────────────────
// A maple leaf stamp: perforated edges, a red frame, a shaded leaf, CANADA and a P for the permanent rate
const MAPLE = [
  '.......D.......',
  '......DRD......',
  '..D..DRRRD..D..',
  '..DD.DRLRD.DD..',
  'D.DRDRRLRRDRD.D',
  'DRRRRRRLRRRRRRD',
  '.DRRLRRLRRLRRD.',
  '..DRRLRLRLRRD..',
  '.DRRRRLLLRRRRD.',
  'DRRRRRRLRRRRRRD',
  '..DDRRRLRRRDD..',
  '....DDRLRDD....',
  '......DLD......',
  '.......D.......',
  '.......D.......',
]
function mapleStamp(x, y) {
  const w = 24, h = 28
  let o = R(x + 1, y + 1.5, w, h, 'rgba(0,0,0,.3)') + R(x, y, w, h, '#fffaf0')
  for (let i = 0; i < w; i += 2) o += R(x + i, y, 1, 1, C.orange) + R(x + i, y + h - 1, 1, 1, C.orange)
  for (let j = 0; j < h; j += 2) o += R(x, y + j, 1, 1, C.orange) + R(x + w - 1, y + j, 1, 1, C.orange)
  o += frame(x + 2, y + 2, w - 4, h - 4, C.red) + R(x + 3, y + 3, w - 6, h - 6, '#fbefe0')
  o += bitmap(MAPLE, x + 4.5, y + 4, { D: C.redD, R: C.red, L: C.redL })
  o += t((x + w / 2) * P, (y + 24) * P, 'CANADA', { font: 'Pixel', size: 5, fill: C.redD, anchor: 'middle' })
  return o + disc(x + 18.5, y + 6.5, 2.5, C.redD) + t((x + 18.5) * P, (y + 7.6) * P, 'P', { font: 'Pixel', size: 5, fill: '#fff', anchor: 'middle' })
}

function contact() {
  const x = 54, y = 18, w = 120, h = 66
  // Cables first, so they run under everything: the tape player's off the left edge and back to the headphones
  let o = tilt(-6, 180, 80, clipping(146, 70, 52, 30, 'LETTERS TO THE EDITOR'))
  o += cable([[18, 101], [14, 84], [-18, 96], [-12, 132]], '#2b2b33') + cable([[-12, 132], [-8, 176], [62, 178], [90, 150]], '#2b2b33')
  o += tilt(-8, 24, 40, `<g class="in" style="animation-delay:.2s">${polaroid(6, 16, 'the boss')}</g>`)
  o += tilt(10, 194, 50, `<g class="in" style="animation-delay:.3s">${gamepad(165, 36)}</g>`)
  let e = `<g class="in">` + box(x, y, w, h, C.orange, C.orangeL, C.orangeD)
  for (let i = 0; i < 30; i++) e += R(x + 1 + i * 2, y + 1 + i, 2, 1, C.orangeD) + R(x + w - 3 - i * 2, y + 1 + i, 2, 1, C.orangeD)
  e += box(x + 18, y + 33, 84, 25, C.paperL, '#ffffff', C.paperD, { shadow: false })
  e += t((x + 22) * P, (y + 40) * P, 'TO:', { size: 20, fill: C.soft })
  e += t((x + 22) * P, (y + 51) * P, 'iammaarib@gmail.com', { font: 'Pixelify', size: 27 })
  e += `</g>` + mapleStamp(x + w - 30, y + 4)
  // Toronto postmark over the stamp's edge, with wavy cancellation lines running left
  let wv = ''
  for (let k = 0; k < 5; k++) { let d = ''; for (let i = 0; i <= 28; i++) d += (i ? 'L' : 'M') + ((x + w - 78 + i * 1.6) * P).toFixed(1) + ' ' + ((y + 9 + k * 3 + Math.sin(i / 2.2) * 0.8) * P).toFixed(1); wv += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="2"/>` }
  e += `<g filter="url(#ink)" opacity=".75" style="mix-blend-mode:multiply" shape-rendering="auto">${wv}</g>`
  e += realStamp((x + w - 34) * P, (y + 15) * P, -8, C.ink, { shape: 'circle', r: 46, top: 'TORONTO ON', bottom: 'CANADA POST', code: 'M5V', date: '22 OCT 26', codeSize: 24 }, 0.8)
  o += tilt(4, x + w / 2, y + h / 2, e)
  o += tilt(-5, 40, 120, walkman(12, 104))
  o += tilt(-4, 122, 118, headphones(122, 116))
  o += tilt(14, 200, 112, garmin(200, 112))
  o += tilt(-10, 196, 6, viceSticker(196, 8))
  o += sticky(98, 4, 'SAY HI', -4)
  return { H: 158 * P, body: o, label: 'Contact, as an orange envelope with a maple leaf stamp and a Toronto postmark, addressed to iammaarib@gmail.com. Around it: a polaroid of the cat captioned the boss, a gamepad, a tape player wired to a pair of black over-ear headphones, a tactical watch and a sunset palm sticker.' }
}
// Around the terminal at the end
function terminalProps(top) {
  let o = tilt(-14, 18, top + 96, camera(-4, top + 82)) + soda(22, top + 30) + paperBall(30, top + 12)
  o += plant(206, top + 30) + tilt(8, 205, top + 74, gtaSticker(190, top + 60)) + tilt(-12, 203, top + 104, toggleSticker(188, top + 96))
  o += tilt(-6, 16, top + 60, pixelSticker(ARROW, { X: C.ink, y: '#f7e04a' }, 8, top + 46, 1.5))
  return o
}

// ── Compose ──────────────────────────────────────────────────────────────────
const heroInner = heroSvg().replace(/\.win \{ animation:[^}]*\}/, '').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  .replace(/<g class="field"[\s\S]*?<\/g>/, '')
  // Keep the terminal's text styles to the terminal.
  .replace(/(^|[{}\s])text \{/g, '$1.term text {').replace('.cat .term text {', '.term .cat text {')
const HERO_H = 490
const pieces = [about(), teams(), stack(), projects(), contact()]
let y = 0
const placed = pieces.map((p) => { const g = `<g transform="translate(0 ${y})">${p.body}</g>`; y += p.H; return g })
const heroY = y
const termProps = terminalProps(heroY / P)
const H = y + HERO_H
const label = "Maarib's desk, a busy wooden table seen from above. " + pieces.map((p) => p.label).join(' ') + ' At the end, beside a camera, a soda can, a plant and a few stickers, a terminal window types whoami, Product designer who builds, then ./startproject; a loading bar fills and a black cat pops up and blinks.'
const page = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}">
<defs><style>${css}</style><clipPath id="desk"><rect width="${W}" height="${H}" rx="16"/></clipPath>${DEFS}</defs>
<g clip-path="url(#desk)">
<g shape-rendering="crispEdges">${wood(H / P)}</g>
<g shape-rendering="crispEdges">${placed.join('\n')}</g>
<g shape-rendering="crispEdges">${termProps}</g>
<svg x="0" y="${heroY}" width="${W}" height="500" viewBox="0 0 900 500" class="term">${heroInner}</svg>
</g>
</svg>
`
writeFileSync(`${HERE}../assets/desk.svg`, page)
console.log('ok', H, Math.round(page.length / 1024) + 'K')
