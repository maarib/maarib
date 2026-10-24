// The launch terminal at the end of the desk: types whoami and npm install maarib, lists the packages,
// then a cat drawn in characters pops up from the bottom and blinks. build.mjs nests it in the desk.
import { readFileSync } from 'node:fs'
const HERE = new URL('.', import.meta.url).pathname
const FONTS = `${HERE}node_modules/@fontsource`
const b64 = (p) => readFileSync(p).toString('base64')
const face = (family, file, style = 'normal', weight = 400) => `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};src:url(data:font/woff2;base64,${b64(file)}) format('woff2')}`
const F = {
  mono: face('Mono', `${FONTS}/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2`),
  vt: face('VT', `${FONTS}/vt323/files/vt323-latin-400-normal.woff2`),
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const DARK = { ink: '#f0f6fc', muted: '#9198a1', faint: '#484f58', rule: '#3d444d', win: '#161b22', bar: '#1c2128', field: '#f0f6fc', shadow: 'rgba(0,0,0,0.6)' }
const MOTION = `@media (prefers-reduced-motion: reduce){*{animation:none!important}}`

// ── Hero: floating terminal ─────────────────────────────────────────────────
const cat = readFileSync(`${HERE}data/cat-ascii.txt`, 'utf8').replace(/\n+$/, '').split('\n')
function hero(t) {
  const W = 900, H = 500
  // Flow field: short strokes on a grid, each turning with a phase from a smooth wave, so the
  // rotation ripples across the canvas. Faded toward the edges and behind the window.
  const field = []
  for (let gy = 0; gy < 15; gy++) for (let gx = 0; gx < 40; gx++) {
    const x = 18 + gx * 22, y = 20 + gy * 28
    const phase = Math.sin(gx * 0.32) * 2 + Math.cos(gy * 0.45 + gx * 0.08) * 2
    const dur = 9
    field.push(`<line x1="${x - 5}" y1="${y}" x2="${x + 5}" y2="${y}" style="animation-delay:${(-((phase + 4) / 8) * dur).toFixed(2)}s"/>`)
  }
  // Window
  const ww = 580, wh = 410, wx = (W - ww) / 2, wy = 40
  const L1 = 'whoami', L2 = 'Product designer who builds'
  const cw = 8, tx = wx + 22, ty1 = wy + 64, ty2 = ty1 + 22, ty3 = ty2 + 30, ty4 = ty3 + 22
  const L3 = 'npm install maarib'
  const PKGS = ['+ figma@latest', '+ claude-code@latest', '+ react@19  next@15  tailwind@4', '+ coffee@∞'], SUM = 'added 312 packages, 1 cat'
  const t2 = 0.5 + L1.length * 0.07 + 0.5, t3 = t2 + L2.length * 0.07 + 0.6, t4 = t3 + L3.length * 0.07 + 0.4, tBarEnd = t4 + PKGS.length * 0.35 + 0.6
  const typed = (text, x, y, begin, id, prompt) => {
    const pw = prompt ? 18 * cw : 0
    const n = text.length, w = n * cw
    const vals = Array.from({ length: n + 1 }, (_, i) => (pw + i * cw).toFixed(1)).join(';')
    return `<clipPath id="${id}"><rect x="${x}" y="${y - 16}" width="${pw}" height="22"><animate attributeName="width" values="${vals}" dur="${(n * 0.07).toFixed(2)}s" begin="${begin}s" fill="freeze" calcMode="discrete"/></rect></clipPath>`
  }
  // Cat at 11px; find the eye holes (spaces enclosed by the body, upper face rows) for blinking.
  const ccw = 6.6, clh = 9.6
  const catW = Math.max(...cat.map((l) => l.length)) * ccw
  const cx = wx + ww - catW - 10, cy = wy + wh - cat.length * clh - 2
  const eyes = []
  cat.forEach((line, r) => {
    if (r < 10 || r > 15) return
    const m = [...line.matchAll(/ +/g)].filter((g) => g.index > 2 && g.index + g[0].length < line.trimEnd().length - 2)
    for (const g of m) eyes.push(`<rect x="${cx + g.index * ccw}" y="${cy + r * clh - 8}" width="${g[0].length * ccw}" height="${clh}" fill="${t.ink}" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.92;0.93;0.97;1" dur="4s" begin="${(tBarEnd + 1.6).toFixed(2)}s" repeatCount="indefinite"/></rect>`)
  })
  const catRows = cat.map((l, r) => `<text x="${cx}" y="${cy + r * clh}">${esc(l).replace(/ /g, ' ')}</text>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="A terminal window floating over moving lines. It types: maarib@toronto:~$ whoami. Product designer who builds. Then npm install maarib adds figma, claude-code, react, next, tailwind and coffee: added 312 packages, 1 cat. A black cat pops up in the corner of the window and blinks.">
<defs>
  <style>${F.mono}${F.vt}
    .field line { stroke: ${t.field}; stroke-width: 1.4; stroke-linecap: round; transform-box: fill-box; transform-origin: center; animation: turn 9s linear infinite; }
    @keyframes turn { to { transform: rotate(360deg); } }
    .win { animation: float 7s ease-in-out infinite; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
    .cat { animation: peek 1.1s cubic-bezier(.3,1.5,.5,1) var(--pop) both; }
    @keyframes peek { from { transform: translateY(215px); } to { transform: translateY(0); } }
    text { font-family: VT, ui-monospace, Menlo, monospace; white-space: pre; }
    .cat text { font-family: Mono, ui-monospace, Menlo, monospace; }
    ${MOTION}
  </style>
  <radialGradient id="fade" cx="50%" cy="48%" r="62%"><stop offset="0.35" stop-color="#fff" stop-opacity="0"/><stop offset="0.55" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <mask id="m"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="${t.shadow}"/></filter>
  <clipPath id="body"><rect x="${wx}" y="${wy + 34}" width="${ww}" height="${wh - 34}" rx="2"/></clipPath>
  ${typed(L1, tx, ty1, 0.5, 't1', true)}
  ${typed(L2, tx + 2 * cw, ty2, t2, 't2', false)}
  ${typed(L3, tx, ty3, t3, 't3', true)}
</defs>
<g class="field" mask="url(#m)" opacity="0.32">${field.join('')}</g>
<g class="win">
  <rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="12" fill="${t.win}" stroke="${t.rule}" filter="url(#sh)"/>
  <path d="M${wx} ${wy + 34}h${ww}" stroke="${t.rule}"/>
  <path d="M${wx + 12} ${wy}h${ww - 24}a12 12 0 0 1 12 12v22h-${ww}v-22a12 12 0 0 1 12-12z" fill="${t.bar}"/>
  <circle cx="${wx + 20}" cy="${wy + 17}" r="6" fill="#ff5f57"/><circle cx="${wx + 40}" cy="${wy + 17}" r="6" fill="#febc2e"/><circle cx="${wx + 60}" cy="${wy + 17}" r="6" fill="#28c840"/>
  <text x="${wx + ww / 2}" y="${wy + 22}" text-anchor="middle" font-size="17" fill="${t.muted}">maarib@toronto: ~ — zsh — 80×24</text>
  <g font-size="20">
    <text x="${tx}" y="${ty1}" clip-path="url(#t1)"><tspan fill="${t.ink}">maarib@toronto:~$</tspan><tspan fill="${t.ink}"> ${L1}</tspan></text>
    <text x="${tx + 2 * cw}" y="${ty2}" clip-path="url(#t2)" fill="${t.muted}">${L2}</text>
    <text x="${tx}" y="${ty3}" clip-path="url(#t3)"><tspan fill="${t.ink}">maarib@toronto:~$</tspan><tspan fill="${t.ink}"> ${L3}</tspan></text>
    ${PKGS.map((l, i) => `<text x="${tx + 2 * cw}" y="${ty4 + i * 20}" fill="${t.muted}" opacity="0">${esc(l)}<animate attributeName="opacity" values="0;1" dur="0.01s" begin="${(t4 + i * 0.35).toFixed(2)}s" fill="freeze"/></text>`).join('')}
    <text x="${tx + 2 * cw}" y="${ty4 + PKGS.length * 20 + 6}" fill="${t.ink}" opacity="0">${SUM}<animate attributeName="opacity" values="0;1" dur="0.01s" begin="${tBarEnd.toFixed(2)}s" fill="freeze"/></text>
    <rect x="${tx + (3 + SUM.length) * cw}" y="${ty4 + PKGS.length * 20 + 6 - 13}" width="8" height="16" fill="${t.ink}" opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;0.5;1" dur="1.1s" begin="${tBarEnd.toFixed(2)}s" repeatCount="indefinite" calcMode="discrete"/></rect>
  </g>
  <g clip-path="url(#body)"><g class="cat" font-size="11" fill="${t.ink}" style="--pop:${(tBarEnd + 0.3).toFixed(2)}s">${catRows}${eyes.join('')}</g></g>
</g>
</svg>
`
}


export const heroSvg = () => hero(DARK)
