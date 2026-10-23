// Rasterize each tool logo to an N×N pixel grid (Chromium canvas), for pixel-art stickers.
import { readFileSync, writeFileSync } from 'node:fs'
// Run: npm run logos  (needs a Chromium; set CHROMIUM_PATH if it isn't found)
import { chromium } from 'playwright-core'
const HERE = new URL('.', import.meta.url).pathname
const N = 18
const names = ['figma', 'framer', 'sketch', 'cursor', 'vs-code', 'github', 'react', 'nextjs', 'claude', 'chatgpt', 'miro', 'maze', 'usertesting', 'jira', 'confluence', 'notion', 'photoshop', 'illustrator', 'xd', 'javascript', 'tailwind', 'linkedin', 'dribbble']
const svgs = Object.fromEntries(names.map((n) => [n, readFileSync(`${HERE}data/logos/${n}.svg`, 'utf8')]))
const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--headless=new'] })
const p = await b.newPage()
const out = await p.evaluate(async ({ svgs, N }) => {
  const res = {}
  for (const [n, s] of Object.entries(svgs)) {
    const img = new Image()
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(s.replace(/ width="16" height="16"/, ` width="${N * 8}" height="${N * 8}"`))))
    await img.decode()
    const c = document.createElement('canvas'); c.width = c.height = N
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'
    // keep aspect ratio inside the square
    const r = img.naturalWidth / img.naturalHeight, w = r >= 1 ? N : N * r, h = r >= 1 ? N / r : N
    g.drawImage(img, (N - w) / 2, (N - h) / 2, w, h)
    const d = g.getImageData(0, 0, N, N).data, rows = []
    for (let y = 0; y < N; y++) { const row = []; for (let x = 0; x < N; x++) { const i = (y * N + x) * 4; row.push(d[i + 3] < 110 ? null : '#' + [0, 1, 2].map((k) => (Math.round(d[i + k] / 17) * 17).toString(16).padStart(2, '0')).join('')) } rows.push(row) }
    res[n] = rows
  }
  return res
}, { svgs, N })
await b.close()
writeFileSync(`${HERE}data/pixel-logos.json`, JSON.stringify(out))
console.log('wrote', Object.keys(out).length, 'logos')
