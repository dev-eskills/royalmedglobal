import type { ReactNode } from 'react'

export function PageHero({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string
  title: string
  sub?: string
  children?: ReactNode
}) {
  return (
    <section className="hero-veil relative overflow-hidden bg-brand-950 text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:py-16">
        <p className="reveal text-sm font-bold tracking-widest text-brand-300 uppercase">{eyebrow}</p>
        <h1 className="reveal mt-2 max-w-4xl text-3xl font-extrabold text-balance sm:text-4xl lg:text-5xl">{title}</h1>
        {sub ? <p className="reveal mt-4 max-w-2xl text-base text-brand-100 lg:text-lg">{sub}</p> : null}
        {children}
      </div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, sub, dark }: { eyebrow: string; title: ReactNode; sub?: string; dark?: boolean }) {
  return (
    <div className="reveal mx-auto mb-10 max-w-3xl text-center">
      <p className={`text-sm font-bold tracking-widest uppercase ${dark ? 'text-brand-300' : 'text-brand-600'}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-3xl font-extrabold text-balance sm:text-4xl ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      {sub ? <p className={`mt-3 text-base ${dark ? 'text-brand-100' : 'text-gray-600'}`}>{sub}</p> : null}
    </div>
  )
}