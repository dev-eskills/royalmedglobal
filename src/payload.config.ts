import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync } from 'fs'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { collections } from './payload/collections'
import { SiteSettings } from './payload/globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Next.js loads .env itself, but standalone scripts (the seed runner) do not —
// so populate the environment here for both entry points.
for (const file of [path.resolve(dirname, '../.env'), path.resolve(dirname, '../.env.local')]) {
  if (!existsSync(file)) continue
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
    if (!match) continue
    const value = match[2].replace(/^["']|["']$/g, '')
    if (!process.env[match[1]]) process.env[match[1]] = value
  }
}

export default buildConfig({
  admin: {
    user: 'users',
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections,
  globals: [SiteSettings],
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
