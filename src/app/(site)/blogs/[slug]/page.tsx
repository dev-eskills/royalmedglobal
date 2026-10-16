import { notFound } from 'next/navigation'
import Link from 'next/link'
import { findDocs, findOne, mediaUrl, richTextToHtml } from '@/lib/site'
import { LeadForm } from '@/components/forms'

export const revalidate = 60
// CMS-backed: render on demand instead of enumerating every slug at build time.
export const dynamicParams = true

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await findOne('posts', { slug: { equals: slug } })
  if (!p) notFound()
  const img = mediaUrl(p.cover)
  const others = (await findDocs('posts')).filter((x) => x.id !== p.id).slice(0, 3)

  return (
    <>
      <section className="hero-veil bg-brand-950">
        <div className="relative mx-auto max-w-3xl px-4 py-14 text-center">
          <p className="reveal text-sm font-bold tracking-widest text-brand-300 uppercase">{p.category || 'Blog'}</p>
          <h1 className="reveal mt-2 text-3xl font-extrabold text-balance sm:text-4xl">{p.title}</h1>
          {p.publishedDate ? (
            <p className="reveal mt-3 text-sm text-brand-100">
              {new Date(p.publishedDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {p.readMinutes ? ` • ${p.readMinutes} min read` : ''}
            </p>
          ) : null}
        </div>
      </section>

      {img ? (
        <div className="mx-auto max-w-3xl px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={p.title}
            className="-mt-2 h-64 w-full rounded-2xl object-cover shadow-xl sm:h-80"
          />
        </div>
      ) : null}

      <article className="mx-auto max-w-3xl px-4 py-12">
        <div
          className="space-y-4 text-[17px] leading-relaxed text-gray-700 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:text-gray-900 [&_h4]:mt-6 [&_h4]:font-bold [&_h4]:text-gray-900"
          dangerouslySetInnerHTML={{ __html: richTextToHtml(p.content) || `<p>${p.excerpt ?? ''}</p>` }}
        />

        <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-extrabold text-gray-900">Need free guidance on this topic?</h3>
          <div className="mt-4">
            <LeadForm page={`blog-${slug}`} compact />
          </div>
        </div>

        {others.length ? (
          <div className="mt-10">
            <h3 className="text-lg font-extrabold text-gray-900">Read next</h3>
            <ul className="mt-3 space-y-2">
              {others.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/blogs/${o.slug}`}
                    className="text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                  >
                    → {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>
    </>
  )
}