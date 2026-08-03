import { defineType, defineField } from 'sanity'

// Global site settings — contact + social. A single document.
export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'contactEmail', title: 'Contact email', type: 'string' }),
    defineField({ name: 'location', title: 'Location', type: 'localeString' }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'URL', type: 'url' },
          ],
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
