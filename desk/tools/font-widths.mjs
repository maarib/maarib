// Measures how wide each Pixelify letter is, so a script can place things right after a word.
// Run: npm run widths  (writes data/pixelify-widths.json, widths in em). Needs Chromium, like shot.mjs.
import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { FONT_CSS } from '../pixel.mjs'
const HERE = fileURLToPath(new URL('.', import.meta.url))
const chars = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i))
const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH }), args: ['--headless=new'] })
const p = await b.newPage()
await p.setContent(`<style>${FONT_CSS}</style><span style="font-family:Pixelify">x</span>`)
await p.evaluate(() => document.fonts.ready)
const widths = await p.evaluate((cs) => {
  const c = document.createElement('canvas').getContext('2d')
  c.font = '100px Pixelify'
  return Object.fromEntries(cs.map((ch) => [ch, +(c.measureText(ch).width / 100).toFixed(4)]))
}, chars)
await b.close()
writeFileSync(`${HERE}../data/pixelify-widths.json`, JSON.stringify(widths) + '\n')
console.log('measured', chars.length, 'letters; "Canopy" is', [...'Canopy'].reduce((s, ch) => s + widths[ch], 0).toFixed(3), 'em')
