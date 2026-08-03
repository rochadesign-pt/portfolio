import { defineType } from 'sanity'

// Bilingual long text (PT + EN). Separate paragraphs with a blank line — the
// website splits on blank lines into individual paragraphs.
export default defineType({
  name: 'localeText',
  title: 'Long text (PT / EN)',
  type: 'object',
  fields: [
    { name: 'pt', title: 'Português', type: 'text', rows: 4 },
    { name: 'en', title: 'English', type: 'text', rows: 4 },
  ],
})
