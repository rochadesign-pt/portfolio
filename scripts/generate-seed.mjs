// Generates an NDJSON seed of the current local content as Sanity documents.
// Run:  node scripts/generate-seed.mjs > studio/seed.ndjson
// Import (from /studio, after `sanity login`):
//   npx sanity dataset import ../studio/seed.ndjson production
import { projects } from '../src/data/projects.js'
import { explorations, social, contact } from '../src/data/site.js'

const lines = []
const push = (doc) => lines.push(JSON.stringify(doc))
const join = (arr) => (Array.isArray(arr) ? arr.join('\n\n') : arr || '')

// Projects
projects.forEach((p, i) => {
  push({
    _type: 'project',
    _id: `project.${p.slug}`,
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    isCaseStudy: p.isCaseStudy !== false,
    category: p.category,
    disciplines: p.disciplines || [],
    industry: p.industry,
    country: p.country,
    year: p.year,
    services: p.services || [],
    coverColors: p.cover,
    tagline: p.tagline,
    intro: p.intro,
    challenge: { pt: join(p.challenge?.pt), en: join(p.challenge?.en) },
    approach: { pt: join(p.approach?.pt), en: join(p.approach?.en) },
    outcome: { pt: join(p.outcome?.pt), en: join(p.outcome?.en) },
    quote: p.quote
      ? { text: p.quote.text, author: p.quote.author, role: p.quote.role }
      : undefined,
    results: (p.results || []).map((r, j) => ({ _key: `r${j}`, value: r.value, label: r.label })),
    order: i,
  })
})

// Explorations
explorations.forEach((e, i) => {
  push({
    _type: 'exploration',
    _id: `exploration.${i}`,
    name: e.name,
    category: e.category,
    ratio: e.ratio,
    order: i,
  })
})

// Site settings (single doc)
push({
  _type: 'siteSettings',
  _id: 'siteSettings',
  contactEmail: contact.email,
  location: { pt: contact.location, en: contact.locationEn },
  social: social.map((s, i) => ({ _key: `s${i}`, label: s.label, href: s.href })),
})

process.stdout.write(lines.join('\n') + '\n')
