// "Say hi" under the side projects: a sticky note, then one big keycap per contact link, in the
// desk keyboard's style. Each key is its own image so the README can link it.
// Run: npm run build  (writes ../assets/sayhi/*.svg)
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { P, C, R, box, disc, frame, t, logo, svg } from './pixel.mjs'
const HERE = fileURLToPath(new URL('.', import.meta.url))
const OUT = `${HERE}../assets/sayhi`
mkdirSync(OUT, { recursive: true })

export const CONTACTS = [
  { slug: 'website', label: 'WEBSITE', sub: 'maaribs.com', url: 'https://www.maaribs.com', face: ['#f7e08a', '#fdf0b8', '#d9bf55'] },
  { slug: 'linkedin', label: 'LINKEDIN', sub: "Let's connect", url: 'https://www.linkedin.com/in/marib/', face: ['#f1f0ec', '#ffffff', '#cfcdc6'] },
  { slug: 'dribbble', label: 'DRIBBBLE', sub: 'Old work', url: 'https://dribbble.com/maaribou', face: ['#f1f0ec', '#ffffff', '#cfcdc6'] },
]

// An 18×18 globe for the website key, in place of a brand logo
function globe(x, y) {
  let o = disc(x + 9, y + 9, 9, C.line) + disc(x + 9, y + 9, 8, C.blue)
  for (const [dx, dy, w] of [[3, 4, 5], [2, 5, 6], [3, 6, 4], [10, 3, 4], [11, 4, 3], [9, 10, 5], [10, 11, 4], [10, 12, 3], [4, 12, 2]]) o += R(x + dx, y + dy, w, 1, C.green)
  o += R(x + 1, y + 9, 16, 0.5, 'rgba(255,255,255,.45)') + R(x + 9, y + 1, 0.5, 16, 'rgba(255,255,255,.45)') + frame(x + 5, y + 2, 8, 14, 'rgba(255,255,255,.25)')
  return o + R(x + 4, y + 4, 2, 1, 'rgba(255,255,255,.6)')
}

// A box with rounded pixel corners: outline, fill, a light top row and a shaded bottom row
function roundBox(x, y, w, h, r, fill, light, dark, outline = C.line) {
  const inset = (j, hh, rr) => { const k = j < rr ? j : j >= hh - rr ? hh - 1 - j : -1; return k < 0 ? 0 : rr - Math.round(Math.sqrt(rr * rr - (rr - k - 0.5) ** 2)) }
  let o = ''
  for (let j = 0; j < h; j++) { const a = inset(j, h, r); o += R(x + a, y + j, w - 2 * a, 1, outline) }
  for (let j = 0; j < h - 2; j++) { const a = inset(j, h - 2, r - 1); o += R(x + 1 + a, y + 1 + j, w - 2 - 2 * a, 1, j === 0 ? light : j === h - 3 ? dark : fill) }
  return o
}

const KW = 300, KH = 152
function key(c, i) {
  const [f, l, d] = c.face
  // The case under the key, then the cap: its sides show below, the face sits on top and presses down
  let o = roundBox(2.5, 10.5, 71, 28, 4, 'rgba(0,0,0,.35)', 'rgba(0,0,0,.35)', 'rgba(0,0,0,.35)', 'rgba(0,0,0,0)')
  o += roundBox(2, 9, 71, 28, 4, '#cfd3da', '#e8ebf0', '#a4aab5') + roundBox(5, 12, 65, 22, 3, '#4a4e5a', '#4a4e5a', '#4a4e5a', '#4a4e5a')
  let cap = roundBox(5, 5, 65, 27, 4, d, d, d) + roundBox(5, 5, 65, 23, 4, f, l, d)
  // Logo and the two lines of text, centred as one group on the face
  const tw = Math.max(c.label.length * 3.25, c.sub.length * 2.1), gw = 18 + 4 + tw, gx = 37.5 - gw / 2, tx = gx + 22 + tw / 2
  cap += c.slug === 'website' ? globe(gx, 7.5) : logo(c.slug, gx, 7.5)
  cap += t(tx * P, 15.6 * P, c.label, { font: 'Pixel', size: 13, fill: C.ink, anchor: 'middle' })
  cap += t(tx * P, 21.4 * P, c.sub, { size: 21, fill: C.soft, anchor: 'middle' })
  o += `<g class="press" style="animation-delay:${(i * 1.1).toFixed(1)}s">${cap}</g>`
  const css = '.press{animation:press 3.3s steps(1) infinite}@keyframes press{0%,64%,72%,100%{transform:none}66%{transform:translateY(8px)}}@media (prefers-reduced-motion: reduce){*{animation:none!important}}'
  return svg(KW, KH, `${c.label[0] + c.label.slice(1).toLowerCase()}: ${c.sub}`, o, css)
}

function header() {
  const HW = 900, HH = 92, w = 46, x = (HW / P - w) / 2, y = 4
  let o = `<g transform="rotate(-3 ${HW / 2} ${HH / 2})">${box(x, y, w, 16, '#f7e08a', '#fdf0b8', '#d9bf55')}${R(x + 1, y + 1, w - 2, 3, '#f0d36a')}${t(HW / 2, (y + 11.4) * P, 'SAY HI', { font: 'Pixel', size: 16, anchor: 'middle', extra: ' letter-spacing="2"' })}</g>`
  return svg(HW, HH, 'Say hi', o)
}

writeFileSync(`${OUT}/header.svg`, header())
CONTACTS.forEach((c, i) => writeFileSync(`${OUT}/${c.slug}.svg`, key(c, i)))
console.log('sayhi', CONTACTS.length + 1, 'images')
