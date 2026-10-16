import { findDocs } from '@/lib/site'
import { SectionHead } from '@/components/section'
import { CourseCard } from '@/components/cards'
import type { IconName } from '@/components/icons'

export const revalidate = 60

const ICONS: IconName[] = ['heart', 'smile', 'capsule', 'book', 'pulse']

export default async function CoursesPage() {
  const list = await findDocs('courses', { sort: 'title' })
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
      <SectionHead
        eyebrow="Programmes"
        title="Courses for International Students"
        sub="MBBS, BDS and other faculties — with duration, fees and the university you will study at."
      />
      {list.length ? (
        <div className="grid gap-6 md:grid-cols-3">
          {list.map((c, i) => (
            <CourseCard key={c.id} c={c} icon={ICONS[i % ICONS.length]} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          Courses added from the admin panel will appear here.
        </p>
      )}
    </section>
  )
}