import { defineType, defineField } from 'sanity'

// A lab / exploration tile.
export default defineType({
  name: 'exploration',
  title: 'Exploration',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'category', title: 'Category', type: 'localeString' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'ratio',
      title: 'Aspect ratio',
      type: 'string',
      description: 'e.g. 3/4, 1/1, 16/10 — drives the mosaic variety.',
      initialValue: '3/4',
    }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  orderings: [{ title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'category.en', media: 'image' } },
})
