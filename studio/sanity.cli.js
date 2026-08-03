import { defineCliConfig } from 'sanity/cli'

// projectId + dataset are filled in when you run `sanity init` (or paste them
// from your Sanity project). Keep dataset "production".
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'amrp5r6y',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
})
