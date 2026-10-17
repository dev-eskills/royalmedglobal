import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'
import { collections } from './payload/collections'
import { SiteSettings } from './payload/globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      beforeNavLinks: ['/components/admin/DataEntryLink'],
      views: {
        dataEntry: {
          Component: '/components/admin/DataEntryView#default',
          path: '/data-entry',
        },
      },
    },
  },
  collections,
  globals: [SiteSettings],
  // Uploads go to Vercel Blob in production (set BLOB_READ_WRITE_TOKEN there);
  // without the token everything stays local, so dev is unchanged.
  plugins: process.env.BLOB_READ_WRITE_TOKEN
    ? [
        vercelBlobStorage({
          collections: { media: true },
          token: process.env.BLOB_READ_WRITE_TOKEN,
        }),
      ]
    : [],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret-change-me',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
    // Fail fast instead of hanging ~30s per request when Atlas is unreachable.
    connectOptions: {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      socketTimeoutMS: 10000,
    },
  }),
  sharp,
})
