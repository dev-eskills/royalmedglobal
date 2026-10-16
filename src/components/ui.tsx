'use client'

import { useEffect, useState } from 'react'
import { Icon } from './icons'

/**
 * Flags JS availability on <html> during hydration so `.js .reveal` can hide
 * pre-animation. Runs synchronously in the client render — no <script> tag,
 * so it never trips the App Router's script-in-component error.
 */
export function JsFlag() {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('js')
  }
  return null
}

/**
 * Mounted once in the root layout. Adds `is-visible` to every `.reveal` element
 * as it enters the viewport. A MutationObserver re-scans on client-side
 * navigation, because the layout (and therefore this effect) never remounts.
 */
export function RevealScript() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue
                entry.target.classList.add('is-visible')
                io?.unobserve(entry.target)
              }
            },
            { threshold: 0.05, rootMargin: '0px 0px -40px 0px' },
          )
        : null

    const scan = () => {
      document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)').forEach((el) => {
        if (reduced) el.classList.add('is-visible')
        else io?.observe(el)
      })
    }

    scan()

    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      io?.disconnect()
    }
  }, [])
  return null
}

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  if (!items.length) return null
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            className={`reveal overflow-hidden rounded-2xl border bg-white transition ${isOpen ? 'border-brand-300 shadow-lg shadow-brand-900/5' : 'border-gray-100'}`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-bold text-gray-900">{f.question}</span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${isOpen ? 'btn-brand text-white' : 'bg-brand-50 text-brand-700'}`}
              >
                <Icon name={isOpen ? 'close' : 'chevron'} className="h-4 w-4" />
              </span>
            </button>
            {isOpen ? <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600">{f.answer}</p> : null}
          </div>
        )
      })}
    </div>
  )
}