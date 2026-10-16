import { findDocs } from '@/lib/site'
import { SectionHead } from '@/components/section'
import { CountryCard } from '@/components/cards'

export const revalidate = 60

export default async function CountriesPage() {
  const list = await findDocs('countries', { sort: 'title' })
  const universities = await findDocs('universities')
  const countBy: Record<string, number> = {}
  universities.forEach((u) => {
    const id = typeof u.country === 'object' ? u.country?.id : u.country
    if (id) countBy[id] = (countBy[id] ?? 0) + 1
  })
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
      <SectionHead
        eyebrow="Destinations"
        title="Study Countries"
        sub="Universities, fees and the admission process for each destination we serve."
      />
      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CountryCard key={c.id} c={c} count={countBy[c.id]} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          Countries added from the admin panel will appear here.
        </p>
      )}
    </section>
  )
}