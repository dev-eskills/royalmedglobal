import { notFound } from 'next/navigation'
import { findDocs, findOne, mediaUrl, richTextToHtml, type Doc } from '@/lib/site'
import { PageHero, SectionHead } from '@/components/section'
import { UniversityCard, CityCard } from '@/components/cards'
import { Icon } from '@/components/icons'

export const revalidate = 60
// CMS-backed: render on demand instead of enumerating every slug at build time.
export const dynamicParams = true

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-extrabold text-brand-700">{value}</p>
      <p className="mt-1 text-xs font-semibold tracking-widest text-gray-500 uppercase">{label}</p>
    </div>
  )
}

const idOf = (rel: unknown) => (typeof rel === 'object' && rel ? (rel as Doc)?.id : rel)

export default async function CountryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = await findOne('countries', { slug: { equals: slug } })
  if (!c) notFound()
  const [allUniversities, allCities] = await Promise.all([findDocs('universities'), findDocs('cities')])
  const universities = allUniversities.filter((u) => idOf(u.country) === c.id)
  const cities = allCities.filter((city) => idOf(city.country) === c.id)
  const img = mediaUrl(c.image)

  const countByCity: Record<string, number> = {}
  universities.forEach((u) => {
    const id = idOf(u.city)
    if (id) countByCity[id] = (countByCity[id] ?? 0) + 1
  })

  const groups: { key: string; title: string; items: Doc[] }[] = []
  for (const city of cities) {
    const items = universities.filter((u) => idOf(u.city) === city.id)
    if (items.length) groups.push({ key: String(city.id), title: city.title, items })
  }
  const loose = universities.filter((u) => {
    const id = idOf(u.city)
    return !id || !cities.some((city) => city.id === id)
  })
  if (loose.length) {
    groups.push({
      key: 'other',
      title: cities.length ? `More universities in ${c.title}` : `Universities in ${c.title}`,
      items: loose,
    })
  }

  const feeNumbers = universities
    .map((u) => u?.fees?.tuitionPerYear)
    .filter((n): n is number => typeof n === 'number' && n > 0)
  const minFee = feeNumbers.length ? Math.min(...feeNumbers) : null
  const currency = universities.find((u) => u?.fees?.tuitionPerYear)?.fees?.currency || '$'

  return (
    <>
      <PageHero
        eyebrow="Study Abroad"
        title={`${c.flagEmoji ? `${c.flagEmoji} ` : ''}MBBS in ${c.title}`}
        sub={c.tagline || ''}
      />

      {universities.length || cities.length ? (
        <section className="mx-auto max-w-7xl px-4 pt-10">
          <div
            className={`grid gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${
              minFee !== null ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
            }`}
          >
            <Stat label="Universities" value={String(universities.length)} />
            <Stat label="Cities" value={String(cities.length)} />
            {minFee !== null ? (
              <Stat label="Fees from" value={`${currency}${minFee.toLocaleString('en-IN')}/year`} />
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-16 lg:grid-cols-2">
        <div className="reveal">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={c.title} className="h-80 w-full rounded-2xl object-cover shadow-lg" />
          ) : null}
          {c.currencyNote ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Icon name="money" className="h-4 w-4 text-brand-600" />
              {c.currencyNote}
            </p>
          ) : null}
        </div>
        <div className="reveal rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-extrabold text-gray-900">Overview</h2>
          <div
            className="mt-4 space-y-3 leading-relaxed text-gray-600 [&_h3]:text-lg [&_h3]:font-extrabold [&_h3]:text-gray-900 [&_h4]:font-bold [&_h4]:text-gray-900"
            dangerouslySetInnerHTML={{ __html: richTextToHtml(c.description) || `<p>${c.tagline ?? ''}</p>` }}
          />
        </div>
      </section>

      {cities.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <SectionHead eyebrow="Cities" title={`Cities in ${c.title}`} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <CityCard key={city.id} c={city} count={countByCity[city.id]} />
            ))}
          </div>
        </section>
      ) : null}

      {groups.length ? (
        <section className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
            <SectionHead eyebrow="Universities" title={`Universities in ${c.title}`} />
            {groups.map((g, i) => (
              <div key={g.key} className={i === 0 ? '' : 'mt-14'}>
                {cities.length ? <h3 className="text-lg font-extrabold text-gray-900">{g.title}</h3> : null}
                <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${cities.length ? 'mt-6' : ''}`}>
                  {g.items.map((u) => (
                    <UniversityCard key={u.id} u={u} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
