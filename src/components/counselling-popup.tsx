'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from './icons'

const OPEN_DELAY_MS = 1000

/** Call from any "Apply" button to open the counselling popup instantly. */
export function openCounselling() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-counselling'))
  }
}

/** Drop-in replacement for "Apply" links — opens the popup instead of navigating. */
export function ApplyButton({
  className,
  children,
  onClick,
}: {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        openCounselling()
        onClick?.()
      }}
      className={className}
    >
      {children}
    </button>
  )
}

const STATS: [string, string][] = [
  ['5,000+', 'Students Placed'],
  ['50+', 'Universities'],
  ['10+', 'Countries'],
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'sending' | 'done' | 'error'

export function CounsellingPopup() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setStatus('idle')
    setError('')
  }, [])

  // Auto-open on every homepage visit after a short delay.
  // Also listens for manual opens from any "Apply" button site-wide.
  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS)
    const manual = () => setOpen(true)
    window.addEventListener('open-counselling', manual)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('open-counselling', manual)
    }
  }, [])

  // Escape closes. Body scroll locks while open and always restores.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  if (!open) return null

  const input =
    'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    const name = String(data.name || '').trim()
    const email = String(data.email || '').trim()
    const phone = String(data.phone || '').trim()
    if (name.length < 2) {
      setError('Please enter your full name.')
      return
    }
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (phone.replace(/\D/g, '').length < 8) {
      setError('Please enter a valid phone number.')
      return
    }
    setError('')
    setStatus('sending')
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          city: String(data.city || '').trim(),
          courseInterest: String(data.course || '').trim(),
          countryInterest: String(data.country || '').trim(),
          page: 'popup-home',
        }),
      })
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'submit failed')
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="counselling-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]" aria-hidden="true" />

      <div className="animate-pop-in relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>

        {/* ------- Left: visual + trust ------- */}
        <div className="hero-veil relative flex min-h-44 flex-col justify-end overflow-hidden bg-brand-950 text-white md:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/hero-campus.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/70 to-brand-900/30" />
          <div className="relative p-6 sm:p-8">
            <p className="font-display text-5xl leading-none text-gold-400" aria-hidden="true">
              &ldquo;
            </p>
            <blockquote className="-mt-3 text-sm leading-relaxed font-medium text-white sm:text-[15px]">
              Education is the passport to the future, for tomorrow belongs to those who prepare for it
              today.
            </blockquote>
            <p className="mt-2 text-xs font-bold tracking-widest text-gold-300 uppercase">— Malcolm X</p>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/15 pt-4">
              {STATS.map(([v, l]) => (
                <div key={l} className="text-center">
                  <p className="text-gold-shine text-xl font-extrabold sm:text-2xl">{v}</p>
                  <p className="mt-0.5 text-[10px] font-semibold tracking-wide text-brand-100 uppercase sm:text-[11px]">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ------- Right: form ------- */}
        <div className="p-6 sm:p-8">
          {status === 'done' ? (
            <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-700 text-gold-300">
                <Icon name="check" className="h-7 w-7" />
              </span>
              <h2 id="counselling-title" className="mt-4 text-2xl font-extrabold text-gray-900">
                Request received
              </h2>
              <p className="mt-2 max-w-xs text-sm text-gray-600">
                Thank you! Our expert counsellor will call you back within 24 hours.
              </p>
              <button
                type="button"
                onClick={close}
                className="btn-gold mt-6 rounded-full px-7 py-2.5 text-sm font-bold"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/logo.png" alt="Royal Med Global" className="h-11 w-auto" />
              </div>
              <h2 id="counselling-title" className="mt-4 text-2xl font-extrabold text-gray-900">
                Get Free Counselling
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Fill in your details &amp; our expert will call you
              </p>

              <form onSubmit={onSubmit} className="mt-5 space-y-3" noValidate={false}>
                <div>
                  <label htmlFor="cp-name" className="mb-1 block text-xs font-bold text-gray-700">
                    Full Name *
                  </label>
                  <input id="cp-name" name="name" required autoComplete="name" className={input} />
                </div>
                <div>
                  <label htmlFor="cp-email" className="mb-1 block text-xs font-bold text-gray-700">
                    Email Address *
                  </label>
                  <input id="cp-email" name="email" type="email" required autoComplete="email" className={input} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cp-phone" className="mb-1 block text-xs font-bold text-gray-700">
                      Phone Number *
                    </label>
                    <input id="cp-phone" name="phone" type="tel" inputMode="tel" required autoComplete="tel" className={input} />
                  </div>
                  <div>
                    <label htmlFor="cp-city" className="mb-1 block text-xs font-bold text-gray-700">
                      City
                    </label>
                    <input id="cp-city" name="city" autoComplete="address-level2" className={input} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cp-course" className="mb-1 block text-xs font-bold text-gray-700">
                      Course
                    </label>
                    <input id="cp-course" name="course" className={input} />
                  </div>
                  <div>
                    <label htmlFor="cp-country" className="mb-1 block text-xs font-bold text-gray-700">
                      Country
                    </label>
                    <input id="cp-country" name="country" className={input} />
                  </div>
                </div>

                {error ? (
                  <p role="alert" className="rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm font-semibold text-brand-700">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-gold w-full rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending…' : 'Get Free Counselling →'}
                </button>
                <p className="text-center text-[11px] leading-relaxed text-gray-400">
                  By submitting, you agree to be contacted by our counsellors. We never share your
                  details.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}