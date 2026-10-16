import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findDocs, findOne, mediaUrl, richTextToHtml, waLink, getSettings } from '@/lib/site'
import { SectionHead } from '@/components/section'
import { FaqAccordion } from '@/components/ui'
import { LeadForm } from '@/components/forms'
import { UniversityCard, CourseCard } from '@/components/cards'
import { Icon, WhatsAppIcon } from '@/components/icons'

export const revalidate = 60
// CMS-backed: render on demand instead of enumerating every slug at build time.
export const dynamicParams = true

export default async function UniversityDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [u, settings] = await Promise.all([
    findOne('universities', { slug: { equals: slug } }),
    getSettings(),
  ])
  if (!u) notFound()

  const courses = await findDocs('courses', { where: { university: { equals: u.id } } })
  const others = (await findDocs('universities')).filter((x) => x.id !== u.id).slice(0, 3)
  const cover = mediaUrl(u.cover)
  const gallery: string[] = (u.gallery ?? []).map((g: unknown) => mediaUrl(g)).filter(Boolean) as string[]
  const fees = u.fees ?? {}
  const wa = waLink(
    settings,
    `Hi Royal Med Global, I want to know more about admission at ${u.shortName || u.title}.`,
  )

  return (
    <>
      {/* ---------------- BANNER ---------------- */}
      <section className="hero-veil relative overflow-hidden bg-brand-950 text-white">
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-brand-950/85" />
          </>
        ) : null}
        <div className="relative mx-auto max-w-7xl px-4 py-14 lg:py-16">
          <p className="reveal text-sm font-bold tracking-widest text-brand-300 uppercase">
            {u?.country?.title || ''}
            {u?.city?.title ? ` • ${u.city.title}` : ''}
          </p>
          <h1 className="reveal mt-2 max-w-3xl text-3xl font-extrabold text-balance sm:text-4xl lg:text-5xl">
            {u.title}
          </h1>
          {u.tagline ? <p className="reveal mt-3 max-w-2xl text-base text-brand-100">{u.tagline}</p> : null}
          <div className="reveal mt-6 flex flex-wrap gap-2">
            {(u.recognition ?? []).map((r: string) => (
              <span
                key={r}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/20"
              >
                <Icon name="check" className="h-3.5 w-3.5 text-green-400" /> {r} Recognised
              </span>
            ))}
            {u.englishMedium ? (
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                100% English Medium
              </span>
            ) : null}
            {u.ieltsRequired === false ? (
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                No IELTS / TOEFL
              </span>
            ) : null}
            {u.neetRequired ? (
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                NEET Required
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {/* ---------------- QUICK STATS ---------------- */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
          {[
            [`${fees?.currency || '$'}${(fees?.tuitionPerYear ?? 0).toLocaleString('en-IN')}`, 'Tuition per year'],
            [u.duration || '—', 'Duration'],
            [`${u.hospitals ?? '—'}+`, 'Teaching hospitals'],
            [u.englishMedium ? '100%' : '—', 'English medium'],
          ].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-2xl font-extrabold text-brand-700 sm:text-3xl">{v}</p>
              <p className="mt-1 text-xs text-gray-500">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- OVERVIEW + FORM ---------------- */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1fr_380px]">
        <div>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={u.title}
              className="reveal mb-8 h-64 w-full rounded-2xl object-cover shadow-lg sm:h-96"
            />
          ) : null}

          <h2 className="text-2xl font-extrabold text-gray-900">Overview</h2>
          <div
            className="mt-4 space-y-3 leading-relaxed text-gray-600 [&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:text-gray-900 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-gray-900"
            dangerouslySetInnerHTML={{ __html: richTextToHtml(u.about) }}
          />

          {u?.facilities?.length ? (
            <>
              <h2 className="mt-10 text-2xl font-extrabold text-gray-900">Campus &amp; Facilities</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {u.facilities.map((f: { title: string; text?: string }, i: number) => (
                  <div key={i} className="card-lift rounded-2xl border border-gray-100 bg-white p-4">
                    <p className="flex items-start gap-2 text-sm font-bold text-gray-900">
                      <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      {f.title}
                    </p>
                    {f.text ? <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{f.text}</p> : null}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div
          id="apply"
          className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-32"
        >
          <h3 className="text-lg font-extrabold text-gray-900">Free Counselling</h3>
          <p className="mt-1 text-sm text-gray-600">We call you back within 24 hours.</p>
          <div className="mt-5">
            <LeadForm page={`university-${slug}`} compact />
          </div>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1ebe5d]"
          >
            <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
          </a>
        </div>
      </section>

      {/* ---------------- FEES ---------------- */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-16 lg:py-20">
          <SectionHead eyebrow="Fees" title="Fee Structure" sub="Flat tuition — the same fee every year." />
          <div className="reveal overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-5 py-3.5 ${i % 2 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <p className="text-sm font-semibold text-gray-900">Year {i + 1}</p>
                <p className="font-bold text-gray-900">
                  {fees?.currency || '$'}
                  {(fees?.tuitionPerYear ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between bg-brand-700 px-5 py-4 text-white">
              <p className="text-sm font-bold">
                Total{fees?.totalTuition ? ` (${fees.totalTuition})` : ''}
              </p>
              <p className="text-lg font-bold">{fees?.totalTuitionINR || ''}</p>
            </div>
          </div>
          {fees?.note ? <p className="mt-4 text-center text-xs text-gray-500">{fees.note}</p> : null}
        </div>
      </section>

      {/* ---------------- GALLERY ---------------- */}
      {gallery.length ? (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <SectionHead eyebrow="Campus" title="Campus Gallery" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${src}-${i}`}
                src={src}
                alt={`${u.shortName || 'Campus'} photo ${i + 1}`}
                loading="lazy"
                className="reveal h-44 w-full rounded-xl object-cover shadow-sm sm:h-56"
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------------- COURSES ---------------- */}
      {courses.length ? (
        <section className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
            <SectionHead eyebrow="Courses" title="Programmes Offered Here" />
            <div className="grid gap-6 md:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c.id} c={c} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------- FAQS ---------------- */}
      {u?.faqs?.length ? (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <SectionHead eyebrow="FAQ" title={`${u.shortName || ''} Frequently Asked Questions`} />
          <FaqAccordion items={u.faqs} />
        </section>
      ) : null}

      {/* ---------------- RELATED ---------------- */}
      {others.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <SectionHead eyebrow="Explore" title="Other Universities" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((x) => (
              <UniversityCard key={x.id} u={x} />
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/universities" className="text-sm font-bold text-brand-700 transition hover:text-brand-800">
              View all universities →
            </Link>
          </p>
        </section>
      ) : null}
    </>
  )
}