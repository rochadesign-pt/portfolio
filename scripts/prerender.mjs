// Per-route <head> prerender. After `vite build`, write dist/<route>/index.html
// for every route with that route's SEO baked into the <head> (title,
// description, canonical, Open Graph, Twitter) — so social scrapers and crawlers
// that don't run JS get the correct per-page metadata. The <body> stays the
// empty SPA shell: the client boots normally (createRoot), so there is no double
// render and no hydration mismatch from the localStorage-based language/theme.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
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

// Match a <meta> tag by one of its attributes, tolerant of multi-line
// formatting and attribute order ([^>] spans newlines but stops at the tag's >).
const metaRe = (attr, value) => new RegExp(`<meta\\b[^>]*\\b${attr}="${value}"[^>]*>`)
const CANONICAL_RE = /<link\b[^>]*\brel="canonical"[^>]*>/

// Rewrite the head tags that are route-specific.
function patchHead(html, { title, description, url }) {
  const t = esc(title)
  const d = esc(description)
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(CANONICAL_RE, `<link rel="canonical" href="${url}" />`)
    .replace(metaRe('property', 'og:url'), `<meta property="og:url" content="${url}" />`)
    .replace(metaRe('name', 'description'), `<meta name="description" content="${d}" />`)
    .replace(metaRe('property', 'og:title'), `<meta property="og:title" content="${t}" />`)
    .replace(metaRe('property', 'og:description'), `<meta property="og:description" content="${d}" />`)
    .replace(metaRe('name', 'twitter:title'), `<meta name="twitter:title" content="${t}" />`)
    .replace(metaRe('name', 'twitter:description'), `<meta name="twitter:description" content="${d}" />`)
}

const template = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
if (!metaRe('name', 'description').test(template) || !CANONICAL_RE.test(template)) {
  throw new Error('prerender: description meta or canonical link not found in built index.html')
}

let ok = 0
for (const [route, meta] of Object.entries(routeMeta)) {
  const url = route === '/' ? `${SITE}/` : `${SITE}${route}`
  const html = patchHead(template, { ...meta, url })
  const outPath =
    route === '/' ? resolve(root, 'dist/index.html') : resolve(root, `dist${route}/index.html`)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html)
  ok++
}

console.log(`[prerender] wrote per-route <head> for ${ok} pages`)
