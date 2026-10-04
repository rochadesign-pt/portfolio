// Usage: [HTML=reel.html DUR=24 OUT=frames] node render.mjs [fps] [only-times-comma-separated]
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import http from 'node:http'
import path from 'node:path'

const root = path.dirname(new URL(import.meta.url).pathname)
const jsx = readFileSync(path.join(root, '../src/components/Wordmark.jsx'), 'utf8')
const svg = jsx
  .slice(jsx.indexOf('<svg'), jsx.lastIndexOf('</svg>') + 6)
  .replace(/\{\/\*.*?\*\/\}/g, '')
  .replace(/className=\{className\}/, '')
  .replace(/role="img"/, '')
writeFileSync(path.join(root, 'build.html'), readFileSync(path.join(root, process.env.HTML || 'reel.html'), 'utf8').replaceAll('{{WORDMARK}}', svg))

const types = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp' }
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])
  const f = url === '/eco.webp'
    ? path.join(root, '../public/ecoxperience-sustainable-detergents-ecommerce-uiuxdesign.webp')
    : path.join(root, url)
  try { res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f)) }
  catch { res.writeHead(404); res.end() }
}).listen(8765)

const fps = Number(process.argv[2] || 30)
const only = process.argv[3]?.split(',').map(Number)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
page.on('pageerror', (e) => console.error('PAGE ERROR', e))
page.on('console', (m) => console.log('console:', m.text()))
await page.goto('http://localhost:8765/build.html')
await page.evaluate(() => window.ready)
await page.waitForTimeout(300)

const out = path.join(root, only ? 'stills' : process.env.OUT || 'frames')
const ticks = await page.evaluate(() => window.ticks)
if (ticks) writeFileSync(path.join(root, 'ticks.json'), JSON.stringify(ticks))
const sfx = await page.evaluate(() => window.sfx)
if (sfx) writeFileSync(path.join(root, 'sfx.json'), JSON.stringify(sfx))
rmSync(out, { recursive: true, force: true }); mkdirSync(out)
const times = only || Array.from({ length: Math.round(Number(process.env.DUR || 24) * fps) }, (_, i) => i / fps)
for (let i = 0; i < times.length; i++) {
  await page.evaluate((t) => window.seek(t), times[i])
  await page.screenshot({ path: path.join(out, only ? `t${times[i]}.png` : `f${String(i).padStart(4, '0')}.png`) })
}
await browser.close(); server.close()
console.log('rendered', times.length)
