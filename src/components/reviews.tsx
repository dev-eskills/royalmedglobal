'use client'

import { useRef } from 'react'
import { Icon } from './icons'

export type Review = {
  id: string
  name: string
  role?: string
  quote: string
  rating?: number
  universityTitle?: string
  photoUrl?: string | null
}

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5 text-gold-500" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 ${i <= rating ? 'fill-current' : 'fill-gray-200'}`}
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.78l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  )
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function Reviews({ reviews }: { reviews: Review[] }) {
  const track = useRef<HTMLDivElement>(null)
  if (!reviews.length) return null

  const scroll = (dir: 1 | -1) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 440), behavior: 'smooth' })
  }

  return (
    <div className="group relative">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r) => (
          <figure
            key={r.id}
            className="flex min-w-[85%] snap-start flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:max-w-[400px] sm:min-w-[400px]"
          >
            <Stars rating={r.rating} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">
              “{r.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
              {r.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.photoUrl}
                  alt={r.name}
                  loading="lazy"
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white">
                  {initials(r.name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">{r.name}</p>
                <p className="truncate text-xs text-gray-500">
                  {r.role || 'Student'}
                  {r.universityTitle ? ` • ${r.universityTitle}` : ''}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {reviews.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => scroll(-1)}
            className="absolute top-1/2 left-3 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-brand-700 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Icon name="chevron" className="h-5 w-5 rotate-90" />
          </button>
          <button
            type="button"
            aria-label="Next review"
            onClick={() => scroll(1)}
            className="absolute top-1/2 right-3 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-brand-700 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Icon name="chevron" className="h-5 w-5 -rotate-90" />
          </button>
        </>
      ) : null}
    </div>
  )
}
