import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

// Replace projectId with the one from your Sanity project (sanity.io/manage),
// or set SANITY_STUDIO_PROJECT_ID in the environment.
export default defineConfig({
  name: 'rds',
  title: 'Rocha Design Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'amrp5r6y',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
