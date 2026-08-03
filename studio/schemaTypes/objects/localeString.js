import { defineType } from 'sanity'

// Bilingual short text (PT + EN).
export default defineType({
  name: 'localeString',
  title: 'Text (PT / EN)',
  type: 'object',
  fields: [
    { name: 'pt', title: 'Português', type: 'string' },
    { name: 'en', title: 'English', type: 'string' },
  ],
})
