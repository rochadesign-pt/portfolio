// Static prerender. After the client and SSR bundles are built, render each
// route to HTML in Node, patch the <head> with that route's SEO (title,
// description, canonical, OG/Twitter) — since useSeo runs client-side only —
// and inline the app HTML into the built index.html template, writing
// dist/<route>/index.html. No browser involved — Vercel-friendly.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { dict } from '../src/i18n/dict.js'
import { projects } from '../src/data/projects.js'

const SITE = 'https://rochadesign.pt'
const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Route -> { title, description }. Mirrors what useSeo sets at runtime.
const seo = dict.pt.seo
const routeMeta = {
  '/': seo.home,
  '/work': seo.work,
  '/services': seo.services,
  '/studio': seo.studio,
  '/contact': seo.contact,
}
for (const p of projects) {
  routeMeta[`/work/${p.slug}`] = {
    title: `${p.title} — Rocha Design Studio`,
    description: `${p.category} · ${p.tagline.pt}`,
  }
}

const routes = Object.keys(routeMeta)

// Rewrite the head tags that are route-specific. Regexes tolerate the
// multi-line attribute formatting used in index.html.
function patchHead(html, { title, description, url }) {
  const t = esc(title)
  const d = esc(description)
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta name="description"[\s\S]*?>/, `<meta name="description" content="${d}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${t}" />`)
    .replace(/<meta property="og:description"[\s\S]*?>/, `<meta property="og:description" content="${d}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${t}" />`)
    .replace(/<meta name="twitter:description"[\s\S]*?>/, `<meta name="twitter:description" content="${d}" />`)
}

const template = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find <div id="root"></div> in template')
}
const { render } = await import(pathToFileURL(resolve(root, 'dist-server/entry-server.js')).href)

let ok = 0
for (const route of routes) {
  const meta = routeMeta[route]
  const url = route === '/' ? `${SITE}/` : `${SITE}${route}`
  const appHtml = render(route)
  const html = patchHead(template, { ...meta, url }).replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`,
  )
  const outPath =
    route === '/' ? resolve(root, 'dist/index.html') : resolve(root, `dist${route}/index.html`)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html)
  ok++
}

console.log(`[prerender] wrote ${ok} html pages`)
