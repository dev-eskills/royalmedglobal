import { findDocs } from '@/lib/site'
import { SectionHead } from '@/components/section'
import { PostCard } from '@/components/cards'

export const revalidate = 60

export default async function BlogsPage() {
  const list = await findDocs('posts', { sort: '-publishedDate' })
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
      <SectionHead
        eyebrow="Guides"
        title="Blogs & Guides"
        sub="Expert articles on MBBS abroad, fees, universities and the admission process."
      />
      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PostCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          Articles added from the admin panel will appear here.
        </p>
      )}
    </section>
  )
}