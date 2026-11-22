// The small logos inside the Stack paragraph of the README.
// Reads data/stack/<name>.svg and writes ../assets/stack/<name>.svg at 16×16.
// Black-and-white logos (MONO) also get a <name>-dark.svg with white ink, for dark mode.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'

const SRC = new URL('./data/stack/', import.meta.url)
const OUT = new URL('../assets/stack/', import.meta.url)
const MONO = ['vercel']
const INK = { light: '#1f2328', dark: '#ffffff' }

mkdirSync(OUT, { recursive: true })
for (const file of readdirSync(SRC).filter((f) => f.endsWith('.svg')).sort()) {
  const name = file.slice(0, -4)
  let svg = readFileSync(new URL(file, SRC), 'utf8').trim()
    .replace(/<title>[\s\S]*?<\/title>/, '')
  // Every logo gets its own 16px size, so it never depends on the page's CSS
  if (!/^<svg[^>]*\swidth=/.test(svg)) svg = svg.replace('<svg', '<svg width="16" height="16"')
  writeFileSync(new URL(file, OUT), svg + '\n')
  if (MONO.includes(name)) writeFileSync(new URL(`${name}-dark.svg`, OUT), svg.replaceAll(INK.light, INK.dark) + '\n')
}
console.log('stack logos written')
