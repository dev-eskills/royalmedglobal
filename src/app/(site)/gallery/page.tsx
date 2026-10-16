import { findDocs, mediaUrl } from '@/lib/site'
import { SectionHead } from '@/components/section'

export const revalidate = 60

export default async function GalleryPage() {
  const universities = await findDocs('universities')
  const photos: { src: string; label: string }[] = []
  universities.forEach((u) => {
    ;(u.facilities ?? []).forEach((f: { title?: string }, i: number) => {
      const src = mediaUrl((u.gallery ?? [])[i])
      if (src) photos.push({ src, label: f?.title || `${u.shortName || u.title} — ${i + 1}` })
    })
  })

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
      <SectionHead
        eyebrow="Campus Life"
        title="Gallery"
        sub="A look at the campus, laboratories, hostels and facilities."
      />
      {photos.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.map((p, i) => (
            <figure
              key={`${p.src}-${i}`}
              className="reveal group relative overflow-hidden rounded-xl shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.label}
                loading="lazy"
                className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 text-xs font-semibold text-white">
                {p.label}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          Photos added to a university will appear here.
        </p>
      )}
    </section>
  )
}