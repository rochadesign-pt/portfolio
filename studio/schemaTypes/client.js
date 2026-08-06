import { defineType, defineField } from 'sanity'

// A client / partner shown in the logo strip on the home page.
export default defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description:
        'Prefer a monochrome / light logo (SVG or transparent PNG) — the strip renders it muted on a dark background.',
      options: { accept: '.svg,.png,.webp' },
    }),
    defineField({
      name: 'url',
      title: 'Website (optional)',
      type: 'url',
      description: 'If set, the logo links here.',
    }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  orderings: [{ title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', media: 'logo' } },
})
