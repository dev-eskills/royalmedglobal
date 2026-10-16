'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from './icons'

export type Slide = { src: string; caption: string }

export function ImageSlider({ slides, interval = 4500 }: { slides: Slide[]; interval?: number }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length],
  )

  useEffect(() => {
    if (paused || slides.length < 2) return
    timer.current = setInterval(() => go(1), interval)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [paused, interval, go, slides.length])

  if (!slides.length) return null

  return (
    <div
      className="group relative overflow-hidden rounded-2xl shadow-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-80 sm:h-[440px] lg:h-[520px]">
        {slides.map((s, i) => (
          <figure
            key={s.src}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === index ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt={s.caption}
              loading={i === 0 ? 'eager' : 'lazy'}
              className={`h-full w-full object-cover ${i === index ? 'animate-drift' : ''}`}
            />
            <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-5 pt-14">
              <span className="inline-block rounded-full border border-gold-400/60 bg-black/40 px-3 py-1 text-xs font-semibold tracking-wide text-gold-200 backdrop-blur">
                {i + 1} / {slides.length}
              </span>
              <p className="mt-1.5 text-base font-bold text-white sm:text-lg">{s.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => go(-1)}
        className="absolute top-1/2 left-3 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-brand-700"
      >
        <Icon name="chevron" className="h-5 w-5 rotate-90" />
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => go(1)}
        className="absolute top-1/2 right-3 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-brand-700"
      >
        <Icon name="chevron" className="h-5 w-5 -rotate-90" />
      </button>

      {/* Dots */}
      <div className="absolute right-4 bottom-4 z-20 flex gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-gold-400' : 'w-1.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}