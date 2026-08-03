import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Configure via env (Vercel → Environment Variables):
//   VITE_SANITY_PROJECT_ID=xxxxxxxx
//   VITE_SANITY_DATASET=production   (optional, defaults to production)
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'amrp5r6y'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

export const sanityConfigured = Boolean(projectId)

export const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: true })
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

const PROJECT_QUERY = `*[_type == "project"] | order(order asc){
  "slug": slug.current, title, isCaseStudy, category, disciplines, industry, country, year, services,
  coverColors, coverImage, tagline, intro, challenge, approach, outcome, quote, results, gallery
}`

const EXPLORATION_QUERY = `*[_type == "exploration"] | order(order asc){ name, category, image, ratio }`

// Map a Sanity project doc to the shape the site components expect.
function mapProject(p) {
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
    // Real gallery images (URLs). Rendering with images is wired at integration time.
    galleryImages: (p.gallery || []).map((g) => imgUrl(g, 1400)).filter(Boolean),
  }
}

export async function fetchProjects() {
  if (!client) return null
  const docs = await client.fetch(PROJECT_QUERY)
  return docs.map(mapProject)
}

export async function fetchExplorations() {
  if (!client) return null
  const docs = await client.fetch(EXPLORATION_QUERY)
  return docs.map((e) => ({
    name: e.name,
    category: e.category || { pt: '', en: '' },
    image: imgUrl(e.image, 900),
    ratio: (e.ratio || '3/4').replace('/', ' / '),
  }))
}
