// The intro above the desk: "Hi, I'm Maarib" in a serif, then "[product] designer at large" in
// mono word blocks, where the first word flips letter by letter through a list of others, and a
// suggestion pill pops up with the next word before each flip.
// Run: npm run build  (writes ../assets/intro.svg)
import { readFileSync, writeFileSync } from 'node:fs'
const HERE = new URL('.', import.meta.url).pathname
const FONTS = `${HERE}node_modules/@fontsource`
const b64 = (p) => readFileSync(p).toString('base64')
const face = (family, file, style = 'normal') => `@font-face{font-family:'${family}';font-style:${style};src:url(data:font/woff2;base64,${b64(file)}) format('woff2')}`
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const WORDS = ['product', 'founding', 'fun-doing', 'web', 'digital', 'lead', 'full-stack', 'principal', 'cat-approved']
const W = 900, H = 240, X0 = 48, FS = 42, CW = FS * 0.6, PAD = 14, GAP = 0, CH = 58, CY = 150
const HOLD = 2.6, FLIP = 0.09, STEPS = 6
const C = { bg0: '#2b2e31', bg1: '#3e4245', red: '#e2553f', grey: '#6b6b6b', dark: '#222326', ink: '#f4f4f2', pill: '#ebc34f', pillInk: '#1b1b1b', hi: '#ece8df' }

let seed = 7
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
// Frames from one word to the next: letters settle left to right while the rest still spin
function flips(a, b) {
  const out = []
  for (let f = 1; f < STEPS; f++) {
    const len = Math.round(a.length + ((b.length - a.length) * f) / STEPS), done = Math.floor((b.length * f) / STEPS)
    let s = ''
    for (let p = 0; p < len; p++) s += p < done ? b[p] : b[p] === '-' ? '-' : LETTERS[Math.floor(rnd() * 26)]
    out.push(s)
  }
  return out
}
// The timeline: each word holds, then flips into the next; the pill shows the next word late in the hold
const frames = []
WORDS.forEach((w, i) => {
  const next = WORDS[(i + 1) % WORDS.length]
  frames.push({ word: w, dur: HOLD, pill: next })
  for (const s of flips(w, next)) frames.push({ word: s, dur: FLIP })
})
const T = frames.reduce((a, f) => a + f.dur, 0)
let at = 0
for (const f of frames) { f.t0 = at; at += f.dur }
const pct = (s) => +((s / T) * 100).toFixed(3)

const chipW = (n) => n * CW + 2 * PAD
const textY = CY + CH / 2 + FS * 0.36
function zigzag(x, w, y, c) {
  let d = `M${x} ${y}`
  const n = Math.max(1, Math.round(w / 8)), step = w / n
  for (let i = 0; i < n; i++) d += `L${(x + (i + 0.5) * step).toFixed(1)} ${y + 6}L${(x + (i + 1) * step).toFixed(1)} ${y}`
  return `<path d="${d}Z" fill="${c}"/>`
}
const chip = (x, s, fill, zig = false) => {
  const w = chipW(s.length)
  return `<rect x="${x}" y="${CY}" width="${w}" height="${CH}" fill="${fill}"/>${zig ? zigzag(x, w, CY + CH, fill) : ''}<text x="${x + PAD}" y="${textY}" class="mono">${esc(s)}</text>`
}
// Show a group only between t0 and t1 of each cycle
let kf = '', n = 0
const during = (t0, t1, body) => {
  const k = 'k' + n++
  kf += `@keyframes ${k}{0%{opacity:0}${pct(t0)}%{opacity:1}${pct(t1)}%{opacity:0}100%{opacity:0}}`
  return `<g opacity="0" style="animation:${k} ${T.toFixed(2)}s step-end infinite">${body}</g>`
}

let word = '', pills = ''
frames.forEach((f, i) => { word += during(f.t0, f.t0 + f.dur, chip(X0, f.word, C.red, true)) })
// The rest of the line slides to sit after the first block
let slide = '@keyframes rest{'
frames.forEach((f) => { slide += `${pct(f.t0)}%{transform:translateX(${((f.word.length - WORDS[0].length) * CW).toFixed(1)}px)}` })
slide += '}'
const restX = X0 + chipW(WORDS[0].length) + GAP
const rest = chip(restX, 'designer', C.grey) + chip(restX + chipW(8) + GAP, 'at', C.dark) + chip(restX + chipW(8) + chipW(2) + 2 * GAP, 'large', C.grey)
// Suggestion pill: rounded on top, square where it sits on the block, with the next word and an ×
frames.forEach((f) => {
  if (!f.pill) return
  const label = f.pill + '?', pw = label.length * 17.4 + 64, ph = 46, px = X0 + 10, py = CY - ph + 4
  const body = `<path d="M${px} ${py + ph}V${py + 18}a18 18 0 0 1 18 -18H${px + pw - 23}a23 23 0 0 1 0 ${ph - 4}H${px}Z" fill="${C.pill}"/>` +
    `<text x="${px + 18}" y="${py + 30}" class="pill">${esc(label)}</text>` +
    `<path d="M${px + pw - 34} ${py + 15}l14 14M${px + pw - 20} ${py + 15}l-14 14" stroke="${C.pillInk}" stroke-width="2.2" fill="none"/>`
  pills += during(f.t0 + 0.9, f.t0 + f.dur, body)
})

const css = face('Instrument', `${FONTS}/instrument-serif/files/instrument-serif-latin-400-normal.woff2`) + face('Instrument', `${FONTS}/instrument-serif/files/instrument-serif-latin-400-italic.woff2`, 'italic') + face('Mono', `${FONTS}/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2`) +
  `.mono{font-family:Mono;font-size:${FS}px;fill:${C.ink};white-space:pre}.pill{font-family:Mono;font-size:29px;fill:${C.pillInk}}.hi{font-family:Instrument;font-size:60px;fill:${C.hi}}` +
  `.rest{animation:rest ${T.toFixed(2)}s step-end infinite}${slide}${kf}` +
  `@media (prefers-reduced-motion: reduce){*{animation:none!important}.first{opacity:1!important}}`
// The first frame also stands alone, for reduced motion and for the very first paint
const label = `Hi, I'm Maarib. ${WORDS[0]} designer at large; the first word keeps flipping: ${WORDS.join(', ')}.`
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}">
<defs><style>${css}</style><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bg0}"/><stop offset="1" stop-color="${C.bg1}"/></linearGradient></defs>
<rect width="${W}" height="${H}" rx="16" fill="url(#bg)"/>
<text x="${X0}" y="92" class="hi">Hi, I'm <tspan font-style="italic">Maarib</tspan></text>
<g class="rest">${rest}</g>
<g class="first" opacity="0">${chip(X0, WORDS[0], C.red, true)}</g>
${word}
${pills}
</svg>
`
writeFileSync(`${HERE}../assets/intro.svg`, svg)
console.log('intro', Math.round(svg.length / 1024) + 'K', 'cycle', T.toFixed(1) + 's')
