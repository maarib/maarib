// The compact bio's images, in the style of a dot-matrix gallery poster: black ground, square dots
// on a grid, glitch dots in red, blue and orange, thin mono captions and a thin headline.
// Writes ../assets/compact/: projects.svg and links.svg (section headers), projects/<slug>.svg
// and links/<slug>.svg (one image each, so the README can link them).
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { PROJECTS } from './projects.mjs'
import { CONTACTS } from './sayhi.mjs'
const HERE = fileURLToPath(new URL('.', import.meta.url))
const FONTS = `${HERE}node_modules/@fontsource`
const b64 = (p) => readFileSync(`${FONTS}/${p}`).toString('base64')
const face = (n, p, w) => `@font-face{font-family:'${n}';font-weight:${w};src:url(data:font/woff2;base64,${b64(p)}) format('woff2')}`
const OUT = `${HERE}../assets/compact`
for (const d of ['', '/projects', '/links']) mkdirSync(OUT + d, { recursive: true })

const K = { w: '#f2f2f2', red: '#ff2b1c', blue: '#2140ff', orange: '#ff6a1a', green: '#3ee07c', yellow: '#e4ff4d', cyan: '#4fd8ff', dim: '#3c3c3c', mid: '#8a8a8a', bg: '#000' }
const GLITCH = [K.red, K.blue, K.orange, K.blue, K.red, K.green, K.yellow, K.cyan]
// Its own seed, so nothing here depends on the desk's randomness
let seed = 7
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const pick = () => GLITCH[Math.floor(rnd() * GLITCH.length)]
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const dot = (x, y, c, g) => `<rect x="${+x.toFixed(2)}" y="${+y.toFixed(2)}" width="${+(g * 0.62).toFixed(2)}" height="${+(g * 0.62).toFixed(2)}" fill="${c}"/>`
const text = (x, y, s, cls = 'm', extra = '') => `<text x="${x}" y="${y}" class="${cls}"${extra}>${esc(s)}</text>`
const CSS = face('Mono', 'jetbrains-mono/files/jetbrains-mono-latin-300-normal.woff2', 300) + face('Thin', 'inter/files/inter-latin-200-normal.woff2', 200) +
  `.m{font-family:Mono;font-weight:300;fill:${K.w};font-size:12px;letter-spacing:.08em;white-space:pre}.d{fill:${K.mid}}` +
  `.t{font-family:Thin;font-weight:200;fill:${K.w};letter-spacing:-.01em}` +
  `.ping{animation:ping 2.4s steps(1) infinite}@keyframes ping{0%{opacity:1}50%{opacity:0}}` +
  `@media (prefers-reduced-motion:reduce){*{animation:none!important}}`
// Tiles sit on the README's own background, so a thin inset leaves a gap between neighbours
const svg = (W, H, label, body, { inset = 0 } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}" shape-rendering="crispEdges">
<defs><style>${CSS}</style></defs>
<rect x="${inset}" y="${inset}" width="${W - 2 * inset}" height="${H - 2 * inset}" fill="${K.bg}"/>
${body}
</svg>
`

// ── Tall dot-matrix lettering: 5×7 glyphs, each cell a short column of dots ──
const GL = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['111', '010', '010', '010', '010', '010', '111'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  ' ': ['00', '00', '00', '00', '00', '00', '00'],
}
function dotWord(x, y, word, { g = 4, tall = 3, gap = 2, glitch = 0.05 } = {}) {
  let o = '', cx = 0
  for (const ch of word) {
    const rows = GL[ch]
    rows.forEach((row, r) => [...row].forEach((on, c) => {
      if (on !== '1') return
      for (let k = 0; k < tall; k++) o += dot(x + (cx + c) * g, y + (r * tall + k) * g, rnd() < glitch ? pick() : K.w, g)
    }))
    cx += rows[0].length + gap
  }
  return o
}
// A bitmap of dots; each character picks a colour (or a function, for a colour per dot)
function bitmap(x, y, rows, g, pal) {
  let o = ''
  rows.forEach((row, r) => [...row].forEach((ch, c) => {
    const col = typeof pal[ch] === 'function' ? pal[ch]() : pal[ch]
    if (col) o += dot(x + c * g, y + r * g, col, g)
  }))
  return o
}
// A row of dim dots as a rule, with the odd colour in it
const rule = (x, y, w, g = 4) => Array.from({ length: Math.floor(w / g) }, (_, i) => dot(x + i * g, y, rnd() < 0.05 ? pick() : K.dim, g)).join('')

// ── Section headers ──
function header(word, left, right) {
  const W = 900, H = 132
  seed = word.length * 31
  let o = dotWord(36, 28, word, { g: 4, tall: 3 })
  o += text(864, 40, left, 'm', ' text-anchor="end"') + text(864, 60, right, 'm d', ' text-anchor="end"')
  o += rule(36, 120, 828)
  return svg(W, H, `${word[0] + word.slice(1).toLowerCase()}: ${right.toLowerCase()}`, o, { inset: 4 })
}
writeFileSync(`${OUT}/projects.svg`, header('SIDE PROJECTS', `${String(PROJECTS.length).padStart(2, '0')} ITEMS`, 'ART, EXPERIMENTS & TOOLS'))
writeFileSync(`${OUT}/links.svg`, header('SAY HI', 'ELSEWHERE', 'WEBSITE, LINKEDIN, DRIBBBLE'))

// ── Pictograms, 13 dots wide ──
const ICONS = {
  // A maple leaf in autumn colours
  canopy: { rows: ['......#......', '.....###.....', '..#..###..#..', '..##.###.##..', '#.#########.#', '.###########.', '..#########..', '...#######...', '..#########..', '.....###.....', '......#......', '......#......', '......#......'], pal: { '#': () => [K.red, K.orange, K.yellow, K.red][Math.floor(rnd() * 4)] } },
  // Rising bars on an axis; a red alert dot pings over the last one
  'alert-engine': { rows: ['.............', '.............', '..........#..', '.......#..#..', '.......#..#..', '....#..#..#..', '....#..#..#..', '.#..#..#..#..', '.#..#..#..#..', '.#..#..#..#..', '.#..#..#..#..', '.............', '#############'], pal: { '#': K.w } },
  // A speech bubble with two lines of text, and a cursor
  'page-comments': { rows: ['.###########.', '#...........#', '#.##.####...#', '#...........#', '#.#####.###.#', '#...........#', '.#.#########.', '.##..........', '.#.......B...', '.........BB..', '.........BBB.', '.........BB..', '..........B..'], pal: { '#': K.w, B: K.blue } },
}
const ARROW = ['..####', '....##', '...#.#', '..#..#', '.#....', '#.....']

// ── A side project: index, pictogram, thin name, mono description, call to action ──
PROJECTS.forEach((p, i) => {
  const W = 300, H = 188
  seed = 100 + i * 17
  let o = text(20, 30, String(i + 1).padStart(2, '0'), 'm d') + bitmap(262, 20, ARROW, 3, { '#': K.w })
  o += bitmap(20, 44, ICONS[p.slug].rows, 4.5, ICONS[p.slug].pal)
  if (p.slug === 'alert-engine') o += `<g class="ping">${dot(20 + 10 * 4.5, 44, K.red, 4.5)}</g>`
  o += text(96, 66, p.name, 't', ` font-size="${Math.min(30, Math.floor(184 / (p.name.length * 0.58)))}"`)
  // Up to three lines of description, split at words
  const words = p.desc.replace(/\.$/, '').toUpperCase().split(' '), lines = ['']
  for (const w of words) { if ((lines.at(-1) + ' ' + w).trim().length > 23) lines.push(''); lines[lines.length - 1] = (lines.at(-1) + ' ' + w).trim() }
  lines.forEach((l, k) => { o += text(96, 88 + k * 14, l, 'm d', ' font-size="10" letter-spacing=".04em"') })
  o += rule(20, 140, 260, 4)
  o += text(20, 166, p.cta, 'm')
  writeFileSync(`${OUT}/projects/${p.slug}.svg`, svg(W, H, `${p.name}: ${p.desc} ${p.cta === 'VISIT SITE' ? 'Opens the live site.' : 'Opens the code on GitHub.'}`, o, { inset: 4 }))
})

// ── A link: index, logo in dots, thin name, mono caption ──
const LOGOS = JSON.parse(readFileSync(`${HERE}data/pixel-logos.json`, 'utf8'))
const GLOBE = ['....#####....', '..##..#..##..', '.#...#.#...#.', '#...#...#...#', '#############', '#...#...#...#', '#...#...#...#', '#############', '#...#...#...#', '.#...#.#...#.', '..##..#..##..', '....#####....']
CONTACTS.forEach((c, i) => {
  const W = 300, H = 152
  seed = 300 + i * 23
  const name = { website: 'Website', linkedin: 'LinkedIn', dribbble: 'Dribbble' }[c.slug]
  let o = text(20, 30, String(i + 1).padStart(2, '0'), 'm d') + bitmap(262, 20, ARROW, 3, { '#': K.w })
  if (c.slug === 'website') o += bitmap(20, 48, GLOBE, 4.5, { '#': () => (rnd() < 0.08 ? pick() : K.w) })
  else LOGOS[c.slug].forEach((row, r) => row.forEach((col, j) => { if (col) o += dot(20 + j * 3.25, 46 + r * 3.25, col, 3.25) }))
  o += text(100, 78, name, 't', ' font-size="30"')
  o += text(100, 100, c.sub.toUpperCase(), 'm d', ' font-size="10.5"')
  o += rule(20, 124, 260, 4)
  writeFileSync(`${OUT}/links/${c.slug}.svg`, svg(W, H, `${name}: ${c.sub}`, o, { inset: 4 }))
})
console.log('compact', 'headers + projects + links')
