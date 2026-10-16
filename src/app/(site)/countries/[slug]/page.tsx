import { notFound } from 'next/navigation'
import { findDocs, findOne, mediaUrl, richTextToHtml } from '@/lib/site'
import { PageHero, SectionHead } from '@/components/section'
import { UniversityCard } from '@/components/cards'
import { Icon } from '@/components/icons'

export const revalidate = 60
// CMS-backed: render on demand instead of enumerating every slug at build time.
export const dynamicParams = true

export default async function CountryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = await findOne('countries', { slug: { equals: slug } })
  if (!c) notFound()
  const universities = (await findDocs('universities')).filter((u) => {
    const id = typeof u.country === 'object' ? u.country?.id : u.country
    return id === c.id
  })
  const img = mediaUrl(c.image)

  return (
    <>
      <PageHero
        eyebrow="Study Abroad"
        title={`MBBS in ${c.title}`}
        sub={c.tagline || ''}
      />

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

      {universities.length ? (
        <section className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
            <SectionHead eyebrow="Universities" title={`Universities in ${c.title}`} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {universities.map((u) => (
                <UniversityCard key={u.id} u={u} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}