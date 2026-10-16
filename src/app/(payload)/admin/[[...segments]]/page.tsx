import '@payloadcms/next/css'
import configPromise from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from './importMap.js'

type Args = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

// Payload admin kabhi static prerender nahi hota — hamesha live DB se chalega
export const dynamic = 'force-dynamic'

export async function generateMetadata(args: Args) {
  return generatePageMetadata({ config: configPromise, params: args.params, searchParams: args.searchParams })
}

export default async function AdminPage(args: Args) {
  const { params, searchParams } = args
  const { segments } = await params
  return RootPage({
    config: configPromise,
    params: Promise.resolve({ segments: segments ?? [] }),
    searchParams,
    importMap,
  })
}
