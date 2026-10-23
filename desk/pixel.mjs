// Shared drawing helpers for the smaller images (side project clippings, Say hi keys).
// Same pixel grid as the desk: 4 screen px per art px.
import { readFileSync } from 'node:fs'
const HERE = new URL('.', import.meta.url).pathname
const FONTS = `${HERE}node_modules/@fontsource`
const b64 = (p) => readFileSync(p).toString('base64')
const face = (family, file) => `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${b64(file)}) format('woff2')}`
export const FONT_CSS = face('Pixelify', `${FONTS}/pixelify-sans/files/pixelify-sans-latin-400-normal.woff2`) + face('VT', `${FONTS}/vt323/files/vt323-latin-400-normal.woff2`) + face('Pixel', `${FONTS}/press-start-2p/files/press-start-2p-latin-400-normal.woff2`)
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
export const P = 4
export const C = {
  line: '#1b1e30', ink: '#2b2b3a', soft: '#6a6a7e', white: '#fbfbf8',
  paper: '#f6ecd6', paperD: '#e2d2b0', paperL: '#fffaf0', rule: '#c9b894', news: '#efe8d6',
  blue: '#3d6fd6', blueD: '#2a4fa3', blueL: '#6b95ea', red: '#d6453d', redD: '#a3302a', redL: '#ec7065',
  green: '#3fa45a', yellow: '#f2c230', metal: '#b9c0cc', metalD: '#7d8596', metalL: '#e6eaf0',
}
export const R = (x, y, w, h, c, extra = '') => `<rect x="${+(x * P).toFixed(1)}" y="${+(y * P).toFixed(1)}" width="${+(w * P).toFixed(1)}" height="${+(h * P).toFixed(1)}" fill="${c}"${extra}/>`
export function box(x, y, w, h, fill, light, dark, { outline = C.line, shadow = true } = {}) {
  let o = ''
  if (shadow) o += R(x + 1, y + h, w - 1, 1, 'rgba(0,0,0,.4)') + R(x + w, y + 1, 1, h, 'rgba(0,0,0,.4)')
  o += R(x + 1, y, w - 2, h, outline) + R(x, y + 1, w, h - 2, outline) + R(x + 1, y + 1, w - 2, h - 2, fill)
  return o + R(x + 1, y + 1, w - 2, 1, light) + R(x + 1, y + h - 2, w - 2, 1, dark)
}
export function ell(cx, cy, rx, ry, c) {
  let o = ''
  for (let j = -ry; j < ry; j++) { const half = Math.round(rx * Math.sqrt(1 - ((j + 0.5) / ry) ** 2)); if (half > 0) o += R(Math.round(cx) - half, Math.round(cy) + j, 2 * half, 1, c) }
  return o
}
export const disc = (cx, cy, r, c) => ell(cx, cy, r, r, c)
export const frame = (x, y, w, h, c) => R(x, y, w, 1, c) + R(x, y + h - 1, w, 1, c) + R(x, y, 1, h, c) + R(x + w - 1, y, 1, h, c)
export const bitmap = (rows, x, y, colors, s = 1) => rows.map((r, j) => [...r].map((v, i) => (colors[v] ? R(x + i * s, y + j * s, s, s, colors[v]) : '')).join('')).join('')
export const t = (x, y, s, { font = 'VT', size = 22, fill = C.ink, anchor = 'start', extra = '' } = {}) => `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}" text-anchor="${anchor}"${extra}>${esc(s)}</text>`
export const wrap = (s, n) => s.split(' ').reduce((ls, w) => { const l = ls.at(-1); if ((l + ' ' + w).trim().length > n) ls.push(w); else ls[ls.length - 1] = (l + ' ' + w).trim(); return ls }, [''])
export const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647
export const LOGOS = JSON.parse(readFileSync(`${HERE}data/pixel-logos.json`, 'utf8'))
// A pixel logo from data/pixel-logos.json, drawn as horizontal runs
export function logo(name, x, y, s = 1) {
  let o = ''
  LOGOS[name].forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      if (!row[i]) continue
      let k = i
      while (k + 1 < row.length && row[k + 1] === row[i]) k++
      o += R(x + i * s, y + j * s, (k - i + 1) * s, s, row[i])
      i = k
    }
  })
  return o
}
export const svg = (w, h, label, body, css = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
<defs><style>${FONT_CSS}text{white-space:pre}${css}</style></defs>
<g shape-rendering="crispEdges">${body}</g>
</svg>
`
