import { findDocs } from '@/lib/site'
import { SectionHead } from '@/components/section'
import { UniversityCard } from '@/components/cards'

export const revalidate = 60

export default async function UniversitiesPage() {
  const list = await findDocs('universities', { sort: 'title' })
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
      <SectionHead
        eyebrow="Explore"
        title="Partner Universities"
        sub="Complete profiles — fees, duration, facilities, campus gallery and FAQs for every university."
      />
      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((u) => (
            <UniversityCard key={u.id} u={u} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          No universities yet. Add your first one from the admin panel at <code className="text-brand-700">/admin</code>.
        </p>
      )}
    </section>
  )
}