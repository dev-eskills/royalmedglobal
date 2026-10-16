import type { CollectionConfig } from 'payload'

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Auto-fill slug from title when empty (create + update). */
const autoSlug = {
  beforeValidate: [
    ({ data, operation }: { data?: Record<string, unknown>; operation?: string }) => {
      if (
        (operation === 'create' || operation === 'update') &&
        data &&
        typeof data.title === 'string' &&
        data.title &&
        !data.slug
      ) {
        data.slug = slugify(data.title)
      }
      return data
    },
  ],
}

const seoFields = [
  {
    name: 'metaTitle',
    type: 'text',
    admin: { description: 'SEO title (falls back to the name when empty)' },
  },
  {
    name: 'metaDescription',
    type: 'textarea',
    admin: { description: 'SEO description (best kept under 155 characters)' },
  },
] as const

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'role', type: 'select', defaultValue: 'admin', options: ['admin', 'editor'] },
  ],
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'filename' },
  // Public marketing site — media must be readable without a session.
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: { useAsTitle: 'title' },
  hooks: autoSlug,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'tagline', type: 'text' },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'flagEmoji', type: 'text', admin: { description: 'e.g. GE, RU, UZ' } },
    { name: 'currencyNote', type: 'text', admin: { description: 'e.g. $1 = ₹90' } },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    ...seoFields,
  ],
}

export const Cities: CollectionConfig = {
  slug: 'cities',
  admin: { useAsTitle: 'title' },
  hooks: autoSlug,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'country', type: 'relationship', relationTo: 'countries', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const Universities: CollectionConfig = {
  slug: 'universities',
  admin: { useAsTitle: 'title' },
  hooks: autoSlug,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'shortName', type: 'text', admin: { description: 'e.g. BITU' } },
    { name: 'country', type: 'relationship', relationTo: 'countries', required: true },
    { name: 'city', type: 'relationship', relationTo: 'cities' },
    { name: 'tagline', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Campus photos (displayed in this order)' },
    },
    {
      name: 'fees',
      type: 'group',
      fields: [
        { name: 'tuitionPerYear', type: 'number', required: true, admin: { description: 'A plain number, e.g. 2900' } },
        { name: 'currency', type: 'text', defaultValue: '$' },
        { name: 'totalTuition', type: 'text', admin: { description: 'e.g. $14,400' } },
        { name: 'totalTuitionINR', type: 'text', admin: { description: 'e.g. ₹12,96,000' } },
        { name: 'note', type: 'textarea', admin: { description: 'Note about hostel/mess being a separate charge' } },
      ],
    },
    { name: 'duration', type: 'text', defaultValue: '6 Years' },
    { name: 'hospitals', type: 'number', admin: { description: 'Number of affiliated hospitals' } },
    {
      name: 'recognition',
      type: 'select',
      hasMany: true,
      options: ['WHO', 'NMC', 'FAIMER', 'WDOMS', 'ECFMG'],
    },
    { name: 'englishMedium', type: 'checkbox', defaultValue: true },
    { name: 'ieltsRequired', type: 'checkbox', defaultValue: false },
    { name: 'neetRequired', type: 'checkbox', defaultValue: true },
    { name: 'about', type: 'richText' },
    {
      name: 'facilities',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    ...seoFields,
  ],
}

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: { useAsTitle: 'title' },
  hooks: autoSlug,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'shortName', type: 'text', admin: { description: 'e.g. MBBS, BDS' } },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'UG',
      options: ['UG', 'PG', 'Diploma', 'Other'],
    },
    { name: 'duration', type: 'text', admin: { description: 'e.g. 6 Years' } },
    { name: 'university', type: 'relationship', relationTo: 'universities' },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: { useAsTitle: 'question' },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'category', type: 'text', defaultValue: 'General' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', admin: { description: 'e.g. MBBS Student, Batch 2024' } },
    { name: 'university', type: 'relationship', relationTo: 'universities' },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'featured', type: 'checkbox', defaultValue: true },
  ],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  hooks: autoSlug,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'category', type: 'text', defaultValue: 'MBBS Abroad' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText' },
    { name: 'publishedDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'readMinutes', type: 'number', defaultValue: 5 },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    ...seoFields,
  ],
}

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'phone', 'courseInterest', 'status', 'createdAt'] },
  access: { create: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'city', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'courseInterest', type: 'text' },
    { name: 'countryInterest', type: 'text' },
    { name: 'page', type: 'text', admin: { description: 'Which page the form was submitted from' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: ['new', 'contacted', 'admitted', 'closed'],
    },
    { name: 'notes', type: 'textarea' },
  ],
}

export const collections = [
  Users,
  Media,
  Countries,
  Cities,
  Universities,
  Courses,
  Faqs,
  Testimonials,
  Posts,
  Enquiries,
]
