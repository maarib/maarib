// "Say hi" under the side projects: a sticky note, then one big keycap per contact link, in the
// desk keyboard's style. Each key is its own image so the README can link it.
// Run: npm run build  (writes ../assets/sayhi/*.svg)
import { mkdirSync, writeFileSync } from 'node:fs'
import { P, C, R, box, disc, frame, t, logo, svg } from './pixel.mjs'
const HERE = new URL('.', import.meta.url).pathname
const OUT = `${HERE}../assets/sayhi`
mkdirSync(OUT, { recursive: true })

export const CONTACTS = [
  { slug: 'website', label: 'WEBSITE', sub: 'maaribs.com', face: ['#f7e08a', '#fdf0b8', '#d9bf55'] },
  { slug: 'linkedin', label: 'LINKEDIN', sub: "let's connect", face: ['#f1f0ec', '#ffffff', '#cfcdc6'] },
  { slug: 'dribbble', label: 'DRIBBBLE', sub: 'see my shots', face: ['#f1f0ec', '#ffffff', '#cfcdc6'] },
]

// An 18×18 globe for the website key, in place of a brand logo
function globe(x, y) {
  let o = disc(x + 9, y + 9, 9, C.line) + disc(x + 9, y + 9, 8, C.blue)
  for (const [dx, dy, w] of [[3, 4, 5], [2, 5, 6], [3, 6, 4], [10, 3, 4], [11, 4, 3], [9, 10, 5], [10, 11, 4], [10, 12, 3], [4, 12, 2]]) o += R(x + dx, y + dy, w, 1, C.green)
  o += R(x + 1, y + 9, 16, 0.5, 'rgba(255,255,255,.45)') + R(x + 9, y + 1, 0.5, 16, 'rgba(255,255,255,.45)') + frame(x + 5, y + 2, 8, 14, 'rgba(255,255,255,.25)')
  return o + R(x + 4, y + 4, 2, 1, 'rgba(255,255,255,.6)')
}

const KW = 300, KH = 152
function key(c, i) {
  const [f, l, d] = c.face
  // The case under the key, then the cap: its sides show below, the face sits on top and presses down
  let o = box(2, 9, 71, 28, '#cfd3da', '#e8ebf0', '#a4aab5')
  o += R(5, 12, 65, 22, '#4a4e5a')
  let cap = box(6, 5, 63, 27, d, f, d, { shadow: false }) + box(8, 5, 59, 23, f, l, d, { shadow: false })
  cap += c.slug === 'website' ? globe(12, 7.5) : logo(c.slug, 12, 7.5)
  cap += t(35 * P, 16 * P, c.label, { font: 'Pixel', size: 13, fill: C.ink })
  cap += t(35 * P, 23.5 * P, c.sub, { size: 22, fill: C.soft })
  o += `<g class="press" style="animation-delay:${(i * 1.1).toFixed(1)}s">${cap}</g>`
  const css = '.press{animation:press 3.3s steps(1) infinite}@keyframes press{0%,64%,72%,100%{transform:none}66%{transform:translateY(8px)}}@media (prefers-reduced-motion: reduce){*{animation:none!important}}'
  return svg(KW, KH, `${c.label[0] + c.label.slice(1).toLowerCase()}: ${c.sub}`, o, css)
}

function header() {
  const HW = 900, HH = 120, w = 46, x = (HW / P - w) / 2, y = 4
  let o = `<g transform="rotate(-3 ${HW / 2} ${HH / 2})">${box(x, y, w, 16, '#f7e08a', '#fdf0b8', '#d9bf55')}${R(x + 1, y + 1, w - 2, 3, '#f0d36a')}${t(HW / 2, (y + 11.4) * P, 'SAY HI', { font: 'Pixel', size: 16, anchor: 'middle', extra: ' letter-spacing="2"' })}</g>`
  o += t(HW / 2, 27 * P, 'PRESS A KEY', { font: 'Pixel', size: 7, fill: C.soft, anchor: 'middle', extra: ' letter-spacing="2"' })
  return svg(HW, HH, 'Say hi. Press a key.', o)
}

writeFileSync(`${OUT}/header.svg`, header())
CONTACTS.forEach((c, i) => writeFileSync(`${OUT}/${c.slug}.svg`, key(c, i)))
console.log('sayhi', CONTACTS.length + 1, 'images')
