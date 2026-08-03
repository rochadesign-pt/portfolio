import { defineType, defineField } from 'sanity'

// A project / case study.
export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'isCaseStudy',
      title: 'Is a full case study?',
      type: 'boolean',
      description: 'On = full case-study page. Off = shown as work, no deep story.',
      initialValue: true,
    }),
    defineField({ name: 'category', title: 'Category', type: 'string', description: 'e.g. Brand Identity, Website' }),
    defineField({
      name: 'disciplines',
      title: 'Disciplines',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['Branding', 'Web', 'Product'], layout: 'tags' },
    }),
    defineField({ name: 'industry', title: 'Industry', type: 'localeString' }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({ name: 'services', title: 'Services', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),

    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'coverColors',
      title: 'Cover fallback colours',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Two hex colours used as a duotone when there is no cover image.',
      validation: (r) => r.max(2),
    }),

    defineField({ name: 'tagline', title: 'Tagline (short line)', type: 'localeString' }),
    defineField({ name: 'intro', title: 'Intro / lead', type: 'localeText' }),
    defineField({ name: 'challenge', title: 'The challenge', type: 'localeText' }),
    defineField({ name: 'approach', title: 'The approach', type: 'localeText' }),
    defineField({ name: 'outcome', title: 'The outcome', type: 'localeText' }),

    defineField({
      name: 'quote',
      title: 'Client quote',
      type: 'object',
      fields: [
        { name: 'text', title: 'Quote', type: 'localeText' },
        { name: 'author', title: 'Author', type: 'string' },
        { name: 'role', title: 'Role', type: 'localeString' },
      ],
    }),

    defineField({
      name: 'results',
      title: 'Results / metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string', description: 'e.g. +38%, 2.4x' },
            { name: 'label', title: 'Label', type: 'localeString' },
          ],
          preview: { select: { title: 'value', subtitle: 'label.en' } },
        },
      ],
    }),

    defineField({ name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'order', title: 'Order', type: 'number', description: 'Lower shows first.' }),
  ],
  orderings: [{ title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'coverImage' },
  },
})
