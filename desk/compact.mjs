// The compact bio's two images, in the style of a dot-matrix gallery poster: black ground,
// square dots on a grid, glitch blocks in red, blue and orange, thin mono captions.
// Writes ../assets/compact/hero.svg (portrait + name) and ../assets/compact/stack.svg (tool logos).
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
const HERE = fileURLToPath(new URL('.', import.meta.url))
const FONTS = `${HERE}node_modules/@fontsource`
const b64 = (p) => readFileSync(`${FONTS}/${p}`).toString('base64')
const face = (n, p, w) => `@font-face{font-family:'${n}';font-weight:${w};src:url(data:font/woff2;base64,${b64(p)}) format('woff2')}`
const OUT = `${HERE}../assets/compact`
mkdirSync(OUT, { recursive: true })

const K = { w: '#f2f2f2', red: '#ff2b1c', blue: '#2140ff', orange: '#ff6a1a', green: '#3ee07c', yellow: '#e4ff4d', cyan: '#4fd8ff', dim: '#3c3c3c', mid: '#8a8a8a', bg: '#000' }
const GLITCH = [K.red, K.blue, K.orange, K.blue, K.red, K.green, K.yellow, K.cyan]
// Its own seed, so nothing here depends on the desk's randomness
let seed = 7
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
// A fixed per-cell coin, so the faces drop the same dots as the resting portrait
const hash = (r, c) => (((r * 73856093) ^ (c * 19349663)) >>> 0) % 1000 / 1000
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const dot = (x, y, c, g) => `<rect x="${+x.toFixed(2)}" y="${+y.toFixed(2)}" width="${+(g * 0.62).toFixed(2)}" height="${+(g * 0.62).toFixed(2)}" fill="${c}"/>`
const text = (x, y, s, extra = '') => `<text x="${x}" y="${y}" class="m"${extra}>${esc(s)}</text>`
const svg = (W, H, label, css, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}" shape-rendering="crispEdges">
<defs><style>${css}</style></defs>
<rect width="${W}" height="${H}" fill="${K.bg}"/>
${body}
</svg>
`
const MONO = face('Mono', 'jetbrains-mono/files/jetbrains-mono-latin-300-normal.woff2', 300)
const BASE_CSS = `${MONO}.m{font-family:Mono;font-weight:300;fill:${K.w};font-size:13px;letter-spacing:.08em;white-space:pre}`

// ── Tall dot-matrix lettering: 5×7 glyphs, each cell a short column of dots ──
const GL = {
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  I: ['111', '010', '010', '010', '010', '010', '111'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
}
function dotWord(x, y, word, { g = 6, tall = 4, gap = 2, glitch = 0.05 } = {}) {
  let o = '', cx = 0
  for (const ch of word) {
    const rows = GL[ch]
    rows.forEach((row, r) => [...row].forEach((on, c) => {
      if (on !== '1') return
      for (let k = 0; k < tall; k++) o += dot(x + (cx + c) * g, y + (r * tall + k) * g, rnd() < glitch ? GLITCH[Math.floor(rnd() * GLITCH.length)] : K.w, g)
    }))
    cx += rows[0].length + gap
  }
  return { o, w: (cx - gap) * g, h: 7 * tall * g }
}

// ── The passport portrait as a glitched dot-matrix, with the same blinks, glances and smiles ──
const read = (f) => JSON.parse(readFileSync(`${HERE}data/${f}`, 'utf8'))
const ME = read('me-colour.json')
const FACES = { blink: [[1.4, 1.58], [6.5, 6.68], [15, 15.18]], left: [[3, 3.9]], right: [[4.1, 5]], smile: [[9.5, 10.7], [12.3, 12.9]], teeth: [[10.7, 12.3]] }
const LOOP = 16
const pct = (s) => +(s / LOOP * 100).toFixed(2) + '%'
const FACE_CSS = Object.entries(FACES).map(([k, ws]) => `.me-${k}{opacity:0;animation:me-${k} ${LOOP}s steps(1) infinite}@keyframes me-${k}{0%{opacity:0}${ws.map(([a, b]) => `${pct(a)}{opacity:1}${pct(b)}{opacity:0}`).join('')}100%{opacity:0}}`).join('')
const MAP = { '#': K.w, g: K.mid, f: K.mid, k: K.w, B: K.w, M: K.mid, e: K.w, s: K.dim, h: K.dim, d: K.blue, n: K.blue, b: K.blue, l: K.red, r: K.red, t: K.w }
function portrait(x, y, g) {
  seed = 11
  const H = ME.length, W = ME[0].length
  const blocks = []
  for (let i = 0; i < 16; i++) blocks.push({ x: Math.floor(rnd() * (W - 8)) + 4, y: Math.floor(rnd() * (H - 14)) + 10, w: 2 + Math.floor(rnd() * 6), h: 2 + Math.floor(rnd() * 5), c: GLITCH[Math.floor(rnd() * GLITCH.length)] })
  const shift = Array.from({ length: H }, () => (rnd() < 0.12 ? Math.round((rnd() - 0.5) * 8) : 0))
  const colour = (r, c, ch) => (blocks.find((q) => c >= q.x && c < q.x + q.w && r >= q.y && r < q.y + q.h) || { c: MAP[ch] || K.mid }).c
  const draw = (rows, cover) => {
    let o = ''
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
      const ch = rows[r][c]
      if (ch === '.') continue
      const px = x + (c + shift[r]) * g, py = y + r * g
      // A face frame first blacks out its cell, then draws its own dot (p is plain background)
      if (cover) o += `<rect x="${+px.toFixed(2)}" y="${+py.toFixed(2)}" width="${g}" height="${g}" fill="${K.bg}"/>`
      if (ch === 'p' || hash(r, c) < 0.03) continue
      o += dot(px, py, colour(r, c, ch), g)
    }
    return o
  }
  let o = draw(ME, false)
  for (const k of Object.keys(FACES)) o += `<g class="me-${k}">${draw(read(`me-${k}.json`), true)}</g>`
  // Every few seconds, a burst of torn rows flashes across the face
  let tear = ''
  for (let i = 0; i < 7; i++) {
    const r = 12 + Math.floor(rnd() * (H - 20)), len = 6 + Math.floor(rnd() * 22), c0 = Math.floor(rnd() * (W - len))
    const col = GLITCH[Math.floor(rnd() * GLITCH.length)], dx = Math.round((rnd() - 0.5) * 14)
    for (let c = c0; c < c0 + len; c++) tear += dot(x + (c + dx) * g, y + r * g, col, g)
  }
  o += `<g class="tear">${tear}</g>`
  return { o, w: W * g, h: H * g }
}
const TEAR_CSS = `.tear{opacity:0;animation:tear 7s steps(1) infinite}@keyframes tear{0%{opacity:0}90%{opacity:1}91.5%{opacity:0}93%{opacity:1}94%{opacity:0}100%{opacity:0}}`
const QUIET = `@media (prefers-reduced-motion:reduce){*{animation:none!important}}`

// ── Hero: portrait, name, captions ──
{
  const W = 900, H = 400
  let o = portrait(36, 34, 4.5).o
  seed = 3
  const name = dotWord(372, 40, 'MAARIB', { g: 6, tall: 4, glitch: 0.06 })
  o += name.o
  o += text(372, 250, 'PRODUCT DESIGNER WHO BUILDS')
  o += text(372, 272, 'FINTECH · WEB3 · COMMERCE')
  o += text(372, 294, 'EST. 2011')
  o += text(372, 362, '43.65° N  79.38° W')
  o += text(372, 382, 'TORONTO, CANADA')
  o += text(874, 34, 'MAARIB SHAH — DESIGN + CODE', ` transform="rotate(90 874 34)"`)
  const label = 'Maarib Shah in tall dot-matrix letters beside a portrait of Maarib drawn in square dots on black, with glitch blocks of red, blue and orange; every so often a row tears sideways, and the portrait blinks, glances and smiles. Captions: product designer who builds; fintech, Web3, commerce; Toronto, Canada.'
  writeFileSync(`${OUT}/hero.svg`, svg(W, H, label, BASE_CSS + FACE_CSS + TEAR_CSS + QUIET, o))
}

// ── Stack: the real tool logos, in colour; the dark one-colour marks turn white for the black ground ──
{
  const STACK = [['figma', 'Figma'], ['framer', 'Framer'], ['claude', 'Claude'], ['cursor', 'Cursor'], ['github', 'GitHub'], ['react', 'React'], ['tailwind', 'Tailwind CSS'], ['storybook', 'Storybook'], ['vs-code', 'VS Code'], ['chatgpt', 'ChatGPT'], ['notion', 'Notion'], ['slack', 'Slack'], ['miro', 'Miro'], ['maze', 'Maze'], ['mural', 'Mural']]
  const W = 900, H = 120, size = 34, step = 55.4
  let o = text(36, 28, 'STACK') + text(864, 28, `${String(STACK.length).padStart(2, '0')} TOOLS`, ' text-anchor="end"')
  STACK.forEach(([n], i) => {
    let src = readFileSync(`${HERE}data/logos/${n}.svg`, 'utf8')
    const vb = src.match(/viewBox="([^"]+)"/)[1]
    let inner = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
    // Notion keeps its white page and black N; every other dark mark goes white
    if (n !== 'notion') inner = inner.replace(/fill="#1f2328"/gi, `fill="${K.w}"`).replace(/fill="#000"/gi, `fill="${K.w}"`)
    o += `<svg x="${(36 + i * step + (step - size) / 2 - 10).toFixed(1)}" y="52" width="${size}" height="${size}" viewBox="${vb}" shape-rendering="geometricPrecision"><g fill="${K.w}">${inner}</g></svg>`
  })
  const label = `Stack, as the real tool logos on black: ${STACK.map(([, t]) => t).join(', ')}.`
  writeFileSync(`${OUT}/stack.svg`, svg(W, H, label, BASE_CSS, o))
}
console.log('compact', 'hero + stack')
