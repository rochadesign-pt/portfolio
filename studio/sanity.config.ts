import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool, defineLocations } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

// Where Presentation loads the live site for click-to-edit. Set
// SANITY_STUDIO_PREVIEW_URL to https://rochadesign.pt once the domain is live.
const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_URL || 'https://portfolio-rouge-three-85.vercel.app'

// Replace projectId with the one from your Sanity project (sanity.io/manage),
// or set SANITY_STUDIO_PROJECT_ID in the environment.
export default defineConfig({
  name: 'rds',
  title: 'Rocha Design Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'amrp5r6y',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool(),
    // Visual editing — see the live site side-by-side and click any field to edit.
    presentationTool({
      previewUrl: { origin: previewOrigin, preview: '/' },
      resolve: {
        locations: {
          // Tell the Studio where each project appears on the site.
          project: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title || 'Projeto', href: `/work/${doc?.slug}` },
                { title: 'Todos os projetos', href: '/work' },
              ],
            }),
          }),
        },
      },
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
