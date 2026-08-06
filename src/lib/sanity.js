import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Configure via env (Vercel → Environment Variables):
//   VITE_SANITY_PROJECT_ID=xxxxxxxx
//   VITE_SANITY_DATASET=production   (optional, defaults to production)
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'amrp5r6y'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

export const sanityConfigured = Boolean(projectId)

// Deployed Studio URL — where click-to-edit overlays send the editor.
const studioUrl = import.meta.env.VITE_SANITY_STUDIO_URL || 'https://rocha-design-studio.sanity.studio'

// Visual editing is active ONLY when the site runs inside the Studio's
// Presentation iframe. Normal visitors are always the top window, so stega
// stays disabled for them (no invisible characters in the rendered copy).
export const isVisualEditing = typeof window !== 'undefined' && window.self !== window.top

// No token: published content on a public dataset is read anonymously. This
// only works when document _ids have no dots — a dotted _id is treated as a
// sub-path and is hidden from unauthenticated reads (see fix-sanity-ids.mjs).
// useCdn:false so content edits show up on the next refresh without CDN delay.
export const client = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2025-06-01',
      useCdn: false,
      // stega encodes invisible source pointers into strings so the overlay can
      // map rendered text back to its field. Enabled only inside Presentation.
      stega: { studioUrl, enabled: isVisualEditing },
    })
  : null

const builder = client ? imageUrlBuilder(client) : null
export const urlFor = (source) => (builder ? builder.image(source) : null)
const imgUrl = (source, w = 1600) =>
  builder && source ? builder.image(source).width(w).auto('format').quality(80).url() : undefined

// Split a bilingual long-text into paragraph arrays (blank-line separated).
const paras = (locale) => ({
  pt: (locale?.pt || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
  en: (locale?.en || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
})

export const PROJECT_QUERY = `*[_type == "project"] | order(order asc){
  "slug": slug.current, title, isCaseStudy, category, disciplines, industry, country, year, services,
  coverColors, coverImage, tagline, intro, challenge, approach, outcome, quote, results, gallery
}`

export const EXPLORATION_QUERY = `*[_type == "exploration"] | order(order asc){ name, category, image, ratio }`

// Direct asset URL for the logo so SVGs stay vector and aren't re-encoded.
export const CLIENTS_QUERY = `*[_type == "client"] | order(order asc){ name, "logo": logo.asset->url, url }`

// Map a Sanity project doc to the shape the site components expect.
export function mapProject(p) {
  const cover = p.coverColors?.length === 2 ? p.coverColors : ['#ffc700', '#0b0b0d']
  const a = cover[0]
  const gallery = [
    [a, '#0b0b0d'],
    ['#1d1d20', '#151517'],
    ['#0b0b0d', a],
    ['#151517', '#1d1d20'],
    [a, '#151517'],
    ['#0b0b0d', '#1d1d20'],
    ['#1d1d20', a],
    ['#151517', '#0b0b0d'],
  ]
  return {
    slug: p.slug,
    title: p.title,
    gallery,
    isCaseStudy: p.isCaseStudy !== false,
    category: p.category || '',
    disciplines: p.disciplines || [],
    industry: p.industry || { pt: '', en: '' },
    country: p.country || '',
    year: p.year || '',
    services: p.services || [],
    cover,
    coverImage: imgUrl(p.coverImage),
    tagline: p.tagline || { pt: '', en: '' },
    intro: p.intro || { pt: '', en: '' },
    challenge: paras(p.challenge),
    approach: paras(p.approach),
    outcome: paras(p.outcome),
    quote: p.quote
      ? { text: p.quote.text || { pt: '', en: '' }, author: p.quote.author || '', role: p.quote.role || { pt: '', en: '' } }
      : null,
    results: p.results || [],
    // Real gallery images with their editorial note. Each item:
    // { url, heading, caption } — heading/caption are bilingual or null.
    galleryImages: (p.gallery || [])
      .map((g) => ({ url: imgUrl(g?.image, 1400), heading: g?.heading || null, caption: g?.caption || null }))
      .filter((g) => g.url),
  }
}

export async function fetchProjects() {
  if (!client) return null
  const docs = await client.fetch(PROJECT_QUERY)
  return docs.map(mapProject)
}

export function mapExploration(e) {
  return {
    name: e.name,
    category: e.category || { pt: '', en: '' },
    image: imgUrl(e.image, 900),
    ratio: (e.ratio || '3/4').replace('/', ' / '),
  }
}

export async function fetchExplorations() {
  if (!client) return null
  const docs = await client.fetch(EXPLORATION_QUERY)
  return docs.map(mapExploration)
}

export function mapClient(c) {
  return { name: c.name, logo: c.logo || null, url: c.url || null }
}

export async function fetchClients() {
  if (!client) return null
  const docs = await client.fetch(CLIENTS_QUERY)
  return docs.map(mapClient)
}
