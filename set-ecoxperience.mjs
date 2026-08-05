// Push the Ecoxperience case study into Sanity — text, result metrics and the
// gallery notes — reading the content straight from src/data/projects.js so it
// always matches the site (no retyping, no drift).
//
// WHAT IT DOES: finds the existing Ecoxperience / Casa Nova project document,
// and writes the content onto it. It keeps any cover image you already uploaded,
// and guarantees a dot-free _id (a dotted id would stay invisible to the public
// site — see fix-sanity-ids.mjs / gotcha #1). Gallery items get their NOTES
// pre-filled; open each one in the Studio and drop in the image.
//
// RUN ONCE, from the portfolio root, with a WRITE (Editor) token — server-side
// only, never shipped to the browser:
//
//   SANITY_TOKEN=sk_your_editor_token node set-ecoxperience.mjs

import { createClient } from '@sanity/client'
import { projects } from './src/data/projects.js'

const token = process.env.SANITY_TOKEN
if (!token) {
  console.error('✗ Missing SANITY_TOKEN (Editor). Run: SANITY_TOKEN=sk... node set-ecoxperience.mjs')
  process.exit(1)
}

const p = projects.find((x) => x.slug === 'ecoxperience')
if (!p) {
  console.error('✗ Could not find the "ecoxperience" project in src/data/projects.js')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'amrp5r6y',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2025-06-01',
  token,
  useCdn: false,
})

// The site stores long text as a single string with blank-line-separated
// paragraphs; our local data keeps arrays, so join them back.
const joinT = (v) => ({ pt: (v?.pt || []).join('\n\n'), en: (v?.en || []).join('\n\n') })

const fields = {
  title: p.title,
  slug: { _type: 'slug', current: p.slug },
  isCaseStudy: true,
  category: p.category,
  disciplines: p.disciplines,
  industry: p.industry,
  country: p.country,
  year: p.year,
  services: p.services,
  coverColors: p.cover,
  tagline: p.tagline,
  intro: p.intro,
  challenge: joinT(p.challenge),
  approach: joinT(p.approach),
  outcome: joinT(p.outcome),
  quote: p.quote ? { text: p.quote.text, author: p.quote.author, role: p.quote.role } : undefined,
  results: (p.results || []).map((r, i) => ({ _key: `r${i}`, value: r.value, label: r.label })),
  // Notes only (no image) — attach the images in the Studio; they render once added.
  gallery: (p.galleryImages || []).map((g, i) => ({
    _key: `g${i}`,
    _type: 'captionedImage',
    heading: g.heading,
    caption: g.caption,
  })),
}

const existing = await client.fetch(
  `*[_type=="project" && (slug.current in ["ecoxperience","casa-nova"] || title in ["Ecoxperience","Casa Nova"])][0]{_id, coverImage, order}`,
)

if (existing?._id && !existing._id.includes('.')) {
  // Dot-free id already — update in place, keep the cover image.
  await client.patch(existing._id).set(fields).commit()
  console.log(`✓ Updated ${existing._id}${existing.coverImage ? ' (kept your cover image)' : ''}`)
} else {
  // No doc yet, or a dotted id that the public site can't read — write a clean one.
  const newId = 'project-ecoxperience'
  await client.createOrReplace({
    _id: newId,
    _type: 'project',
    order: existing?.order ?? 4,
    ...(existing?.coverImage ? { coverImage: existing.coverImage } : {}),
    ...fields,
  })
  if (existing?._id && existing._id !== newId) await client.delete(existing._id)
  console.log(`✓ Wrote ${newId}${existing?._id ? ` (replaced ${existing._id})` : ''}`)
}

console.log('Done. Text + metrics are live on the next refresh. Add gallery images in the Studio — the notes are already there.')
