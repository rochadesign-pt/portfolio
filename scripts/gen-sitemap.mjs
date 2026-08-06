// Build-time sitemap generator. Reads the static route list and the local
// project slugs (the same fallback the app ships with) and writes
// public/sitemap.xml so it is copied into dist on build. Run before `vite build`.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const SITE = 'https://rochadesign.pt'
const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Static, indexable routes with their relative priority.
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/work', priority: '0.9', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/studio', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'yearly' },
]

// Pull project slugs out of the bundled data without importing JSX/deps.
function projectSlugs() {
  const src = readFileSync(resolve(root, 'src/data/projects.js'), 'utf8')
  const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  return [...new Set(slugs)]
}

const urls = [
  ...staticRoutes,
  ...projectSlugs().map((slug) => ({ path: `/work/${slug}`, priority: '0.8', changefreq: 'monthly' })),
]

const body = urls
  .map(
    ({ path, priority, changefreq }) =>
      `  <url>\n    <loc>${SITE}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

writeFileSync(resolve(root, 'public/sitemap.xml'), xml)
console.log(`[sitemap] wrote ${urls.length} urls`)
