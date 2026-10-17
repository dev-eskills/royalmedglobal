import { getPayload } from 'payload'
import config from '@/payload.config'
import { writeFileSync, existsSync, unlinkSync } from 'fs'
import path from 'path'

const run = async () => {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  )
  const tmp = path.join(process.env.TEMP || '.', 'rmg-upload-check.png')
  writeFileSync(tmp, png)

  const payload = await getPayload({ config })
  const doc = await payload.create({
    collection: 'media',
    data: { alt: 'upload check' },
    filePath: tmp,
  })
  const anyDoc = doc as unknown as { id: string | number; filename?: string; url?: string }
  const filename = anyDoc.filename || ''
  const publicPath = path.join('public', 'media', filename)
  console.log(
    'created=' + anyDoc.id + ' url=' + anyDoc.url + ' file-in-public-media=' + existsSync(publicPath),
  )

  await payload.delete({ collection: 'media', id: doc.id })
  if (existsSync(publicPath)) unlinkSync(publicPath)
  unlinkSync(tmp)
  console.log('cleaned')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
