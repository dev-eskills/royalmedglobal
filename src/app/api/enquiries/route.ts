import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Receives every lead form on the site (LeadForm + counselling popup) and
 * stores it in the `enquiries` collection, visible in /admin → Enquiries.
 * Returns 503 — never a fake success — when the database is unreachable.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

  const name = str(body.name)
  const phone = str(body.phone)
  const email = str(body.email)
  const city = str(body.city)
  const courseInterest = str(body.courseInterest || body.course)
  const countryInterest = str(body.countryInterest || body.country)
  const page = str(body.page) || 'unknown'

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: 'Please enter your full name.' }, { status: 400 })
  }
  if (phone.replace(/\D/g, '').length < 8) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid phone number.' }, { status: 400 })
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const doc = await payload.create({
      collection: 'enquiries',
      data: { name, phone, email, city, courseInterest, countryInterest, page, status: 'new' },
    })
    return NextResponse.json({ ok: true, id: doc.id })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'We could not save your request right now. Please try again or message us on WhatsApp.' },
      { status: 503 },
    )
  }
}
