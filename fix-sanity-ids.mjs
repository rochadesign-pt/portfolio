// One-time migration: rename dotted _ids (e.g. "project.ferve") to non-dotted
// ("project-ferve").
//
// WHY: Sanity treats a dotted _id as a sub-path, and documents under a sub-path
// are NOT readable by unauthenticated requests — even on a public dataset. The
// Studio (authenticated) sees them, but the public site's anonymous fetch gets
// an empty array. Renaming the _ids removes the sub-path so published content is
// readable with no token at all.
//
// WHAT IT DOES: for every project/exploration doc whose _id contains a dot, it
// copies the doc to a new dot-free _id (keeping ALL fields, including image
// references — the underlying assets are shared, not moved) and deletes the
// original. Routing uses the slug, not the _id, so URLs are unaffected.
//
// RUN ONCE, from the portfolio root, with a WRITE (Editor) token. The token is
// used only here, server-side, and never ships to the browser:
//
//   SANITY_TOKEN=sk_your_editor_token node fix-sanity-ids.mjs
//
// After it finishes, delete the token in manage.sanity.io if you like — the
// public site needs no token to read the content.

import { createClient } from '@sanity/client'

const token = process.env.SANITY_TOKEN
if (!token) {
  console.error('✗ Missing SANITY_TOKEN. Create an Editor token in manage.sanity.io → API → Tokens, then run:')
  console.error('    SANITY_TOKEN=sk... node fix-sanity-ids.mjs')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'amrp5r6y',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2025-06-01',
  token,
  useCdn: false,
})

const all = await client.fetch('*[_type in ["project", "exploration"]]')
const dotted = all.filter((d) => d._id.includes('.') && !d._id.startsWith('drafts.'))

if (!dotted.length) {
  console.log('✓ No dotted-id documents found — nothing to migrate.')
  process.exit(0)
}

console.log(`Migrating ${dotted.length} document(s):\n`)

for (const doc of dotted) {
  const newId = doc._id.replace(/\./g, '-')
  // Strip system fields; keep everything else (title, slug, images, etc.).
  const { _id, _rev, _createdAt, _updatedAt, ...fields } = doc
  await client.createOrReplace({ _id: newId, ...fields })
  await client.delete(_id)
  console.log(`  ${_id}  →  ${newId}`)
}

console.log('\n✓ Done. The public site can now read these documents with no token.')
