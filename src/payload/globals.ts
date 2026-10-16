import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { description: 'Phone, email, address — edit once, updates everywhere on the site' },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Royal Med Global', required: true },
    { name: 'tagline', type: 'text', defaultValue: 'Your Trusted Path to MBBS Abroad' },
    { name: 'topBarText', type: 'text', defaultValue: 'Your Trusted Path to MBBS Abroad — 2026 Admissions Open' },
    { name: 'phones', type: 'array', fields: [{ name: 'number', type: 'text', required: true }] },
    { name: 'emails', type: 'array', fields: [{ name: 'address', type: 'email', required: true }] },
    { name: 'address', type: 'textarea' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'whatsappNumber', type: 'text', admin: { description: 'Without the + sign, e.g. 919251213136' } },
    { name: 'footerAbout', type: 'textarea' },
  ],
}