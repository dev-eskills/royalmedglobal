import Link from 'next/link'
import { findDocs, getSettings, mediaUrl } from '@/lib/site'
import { PageHero, SectionHead } from '@/components/section'
import { ImageSlider } from '@/components/slider'
import { Icon } from '@/components/icons'

export const revalidate = 60

const VALUES = [
  { icon: 'shield', t: 'Honesty First', d: 'Only government-licensed, globally recognised universities. If a college is not right for you, we say so — even if it costs us an admission.' },
  { icon: 'money', t: 'Transparent Pricing', d: 'Every rupee on paper before you pay a single fee. Tuition, hostel, visa, travel — the full cost breakdown, in writing.' },
  { icon: 'heart', t: 'Students Before Business', d: 'Free counselling with zero obligation. Most of our students come from referrals by doctors we already placed abroad.' },
  { icon: 'rocket', t: 'End-to-End Ownership', d: 'From NEET guidance and documentation to visa, forex, travel and settling into your hostel — one team owns your entire journey.' },
]

const JOURNEY = [
  { t: 'Free Counselling', d: 'Understand your NEET score, budget and goals with an expert counsellor.' },
  { t: 'University Selection', d: 'Shortlist only recognised universities that fit your profile.' },
  { t: 'Admission & Visa', d: 'Offer letter, documentation, visa filing and pre-departure briefing.' },
  { t: 'Fly & Settle', d: 'Travel, hostel allotment, local SIM, Indian mess — settled from day one.' },
]

export default async function AboutPage() {
  const [settings, universities] = await Promise.all([getSettings(), findDocs('universities')])
  const name = settings?.siteName || 'Royal Med Global'
  const logo = mediaUrl(settings?.logo)
  const featured = universities.find((u) => u.featured) ?? universities[0]
  const gallery: string[] = (featured?.gallery ?? []).map((g: unknown) => mediaUrl(g)).filter(Boolean) as string[]
  const slides = [
    { src: '/media/hero-campus.jpg', caption: 'BITU University Campus, Bukhara' },
    { src: '/media/campus-gate.jpg', caption: 'Grand Campus Entrance' },
    { src: '/media/hospital.jpg', caption: 'University Teaching Hospital' },
    { src: '/media/bukhara-city.jpg', caption: 'Historic City of Bukhara' },
    { src: '/media/library-1.jpg', caption: 'Modern Central Library' },
  ]

  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title={`${name} — ${settings?.tagline || 'Your Trusted Path to MBBS Abroad'}`}
        sub="An independent education consultancy helping Indian students secure admission to globally recognised medical universities abroad."
      />

      {/* ---------------- INTRO WITH LOGO ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[380px_1fr]">
          <div className="reveal mx-auto w-full max-w-sm">
            <div className="group relative overflow-hidden rounded-3xl border border-gold-300/60 bg-white p-8 shadow-xl">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={name}
                  className="animate-floaty mx-auto h-auto w-full max-w-[260px]"
                />
              ) : (
                <p className="text-center text-2xl font-extrabold text-brand-800">{name}</p>
              )}
              <span className="gold-rule mt-6 block" aria-hidden="true" />
              <p className="mt-4 text-center text-sm font-semibold tracking-widest text-gold-600 uppercase">
                MBBS Abroad Consultants
              </p>
            </div>
          </div>
          <div className="reveal">
            <p className="text-sm font-bold tracking-widest text-brand-600 uppercase">About Us</p>
            <h2 className="mt-2 text-3xl font-extrabold text-balance text-gray-900 sm:text-4xl">
              The team behind hundreds of future doctors
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
              <p>
                {name} is an independent education consultancy based in Indore, built for one purpose — getting
                Indian medical aspirants into genuine, globally recognised MBBS programmes abroad without the
                confusion, hidden charges and false promises this industry is known for.
              </p>
              <p>
                Our flagship partner is the{' '}
                <strong className="text-gray-900">
                  Bukhara Innovative Education and Medical University (BITU), Uzbekistan
                </strong>{' '}
                — a government-licensed university with its own teaching hospital, 36 affiliated clinics, full
                English-medium teaching and a flat tuition of just $2,900 per year.
              </p>
              <p>
                {settings?.footerAbout ||
                  'We guide you end-to-end — from application and admission to visa and travel.'}
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-gold rounded-full px-7 py-3 text-sm font-bold">
                Get Free Counselling
              </Link>
              <Link
                href="/universities"
                className="rounded-full border-2 border-brand-700 px-7 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-700 hover:text-white"
              >
                Explore Universities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="bg-brand-950">
        <div className="stagger mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">
          {[
            ['24 hrs', 'Callback guarantee'],
            ['100%', 'Free counselling'],
            ['36+', 'Teaching hospitals'],
            ['$2,900', 'Tuition per year'],
          ].map(([v, l], i) => (
            <div key={l} style={{ '--i': i } as React.CSSProperties} className="reveal text-center">
              <p className="text-gold-shine text-3xl font-extrabold sm:text-4xl">{v}</p>
              <p className="mt-1 text-sm font-medium text-brand-100">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- GALLERY SLIDER ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <SectionHead
          eyebrow="Campus Life"
          title="Where Our Students Study & Live"
          sub="A look at the BITU campus, hospitals, hostels and the historic city of Bukhara."
        />
        <div className="reveal">
          <ImageSlider slides={gallery.length >= 5 ? gallery.slice(0, 5).map((src, i) => ({ src, caption: featured?.facilities?.[i]?.title || `Campus — ${i + 1}` })) : slides} interval={1000} />
        </div>
      </section>

      {/* ---------------- VALUES ---------------- */}
      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <SectionHead
            eyebrow="Our Values"
            title="What We Stand For"
            sub="Four principles behind every admission we handle."
          />
          <div className="stagger mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <div
                key={v.t}
                style={{ '--i': i } as React.CSSProperties}
                className="card-lift reveal group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-700 text-white transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-white">
                  <Icon name={v.icon as 'shield'} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- JOURNEY ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <SectionHead
          eyebrow="How It Works"
          title="Your Journey With Us"
          sub="Four stages, one dedicated team — from your first call to your first day on campus."
        />
        <div className="stagger relative mt-4 grid gap-6 md:grid-cols-4">
          {JOURNEY.map((j, i) => (
            <div key={j.t} style={{ '--i': i } as React.CSSProperties} className="reveal relative">
              <div className="card-lift h-full rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <span className="btn-brand mx-auto grid h-12 w-12 place-items-center rounded-full text-lg font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-bold text-gray-900">{j.t}</h3>
                <p className="mt-2 text-sm text-gray-600">{j.d}</p>
              </div>
              {i < JOURNEY.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-12 -right-3 hidden h-0.5 w-6 bg-gradient-to-r from-brand-300 to-gold-400 md:block"
                />
              ) : null}
            </div>
          ))}
        </div>
        <div className="reveal mt-12 text-center">
          <Link href="/contact" className="btn-gold inline-block rounded-full px-8 py-3.5 text-sm font-bold">
            Start With a Free Call →
          </Link>
        </div>
      </section>
    </>
  )
}