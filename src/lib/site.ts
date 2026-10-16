import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { FALLBACK_SETTINGS, fallbackFor } from './fallback'

/* eslint-disable @typescript-eslint/no-explicit-any */
// Payload docs stay loose on purpose: a new field added in the CMS should never
// break the site.
export type Doc = Record<string, any>

async function pb() {
  return getPayload({ config: configPromise })
}

/**
 * When Atlas is unreachable every request would otherwise sit for the full
 * server-selection timeout, so the first failure parks all calls for a short
 * window and pages fall back to defaults instead of hanging.
 */
const COOLDOWN_MS = 20_000
const PROBE_TIMEOUT_MS = 3500
let unavailableUntil = 0
let probePromise: Promise<boolean> | null = null

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('db-timeout')), ms)
  })
  return Promise.race([p, timeout]).finally(() => {
    if (timer) clearTimeout(timer)
  }) as Promise<T>
}

async function runProbe(): Promise<boolean> {
  try {
    const payload = await withTimeout(pb(), PROBE_TIMEOUT_MS)
    await withTimeout(payload.find({ collection: 'users', limit: 1 } as never), PROBE_TIMEOUT_MS)
    unavailableUntil = 0
    return true
  } catch {
    unavailableUntil = Date.now() + COOLDOWN_MS
    return false
  }
}

function dbAvailable(): Promise<boolean> {
  if (Date.now() < unavailableUntil) return Promise.resolve(false)
  if (!probePromise) {
    probePromise = runProbe().finally(() => {
      probePromise = null
    })
  }
  return probePromise
}

export async function findDocs(collection: string, options: Record<string, any> = {}): Promise<Doc[]> {
  if (!(await dbAvailable())) return fallbackFor(collection)
  try {
    const payload = await withTimeout(pb(), PROBE_TIMEOUT_MS)
    const res = await withTimeout(
      (payload.find as any)({ collection, limit: 100, depth: 2, ...options }),
      8000,
    )
    const docs = (res?.docs ?? []) as Doc[]
    return docs.length ? docs : fallbackFor(collection)
  } catch {
    unavailableUntil = Date.now() + COOLDOWN_MS
    return fallbackFor(collection)
  }
}

export async function findOne(collection: string, where: Record<string, any>): Promise<Doc | null> {
  const slug = where?.slug?.equals
  const docs = await findDocs(collection, { where, limit: 1 })
  if (docs.length) return docs[0]
  return fallbackFor(collection).find((d) => (slug ? d.slug === slug : true)) ?? null
}

export async function getSettings(): Promise<Doc> {
  if (!(await dbAvailable())) return FALLBACK_SETTINGS
  try {
    const payload = await withTimeout(pb(), PROBE_TIMEOUT_MS)
    const res = await withTimeout(
      (payload.findGlobal as any)({ slug: 'site-settings', depth: 2 }),
      8000,
    )
    return (res && Object.keys(res).length ? res : FALLBACK_SETTINGS) as Doc
  } catch {
    unavailableUntil = Date.now() + COOLDOWN_MS
    return FALLBACK_SETTINGS
  }
}

/**
 * Media is served statically from `public/media` rather than Payload's file
 * route — it is faster, survives a database outage, and needs no access check.
 */
export function mediaUrl(m: any): string | null {
  if (!m || typeof m !== 'object') return null
  if (typeof m.filename === 'string' && m.filename) return `/media/${m.filename}`
  if (typeof m.url === 'string' && m.url) {
    const file = m.url.split('/').pop()
    return file ? `/media/${file}` : m.url
  }
  return null
}

export function firstPhone(settings: Doc): string {
  const p = settings?.phones?.[0]?.number
  return typeof p === 'string' ? p : '+91 92512 13136'
}

export function waNumber(settings: Doc): string {
  const w = settings?.whatsappNumber
  if (typeof w === 'string' && w) return w.replace(/\D/g, '')
  return firstPhone(settings).replace(/\D/g, '')
}

export function waLink(settings: Doc, text: string): string {
  return `https://wa.me/${waNumber(settings)}?text=${encodeURIComponent(text)}`
}

/** Converts Lexical rich text into simple HTML (headings + paragraphs). */
export function richTextToHtml(data: any): string {
  try {
    const children = data?.root?.children ?? []
    return children
      .map((node: any) => {
        const text = (node?.children ?? []).map((c: any) => c?.text ?? '').join('')
        if (!text.trim()) return ''
        if (node?.type === 'heading') {
          const tag = node?.tag === 'h1' ? 'h3' : 'h4'
          return `<${tag}>${escapeHtml(text)}</${tag}>`
        }
        return `<p>${escapeHtml(text)}</p>`
      })
      .join('')
  } catch {
    return ''
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
