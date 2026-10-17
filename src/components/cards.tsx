import Link from 'next/link'
import { mediaUrl, type Doc } from '@/lib/site'
import { Icon, type IconName } from './icons'

function Img({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  if (!src)
    return (
      <div className={`grid place-items-center bg-brand-50 text-brand-300 ${className ?? ''}`}>
        <Icon name="university" className="h-10 w-10" />
      </div>
    )
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={className} />
}

export function UniversityCard({ u }: { u: Doc }) {
  const cover = mediaUrl(u.cover)
  return (
    <Link
      href={`/universities/${u.slug}`}
      className="card-lift group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <div className="relative h-44 overflow-hidden bg-brand-50">
        <Img src={cover} alt={u.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {u?.country?.title ? (
          <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {u.country.title}
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 transition group-hover:text-brand-700">{u.title}</h3>
        <p className="mt-1.5 text-sm font-semibold text-brand-600">
          {u?.fees?.currency || '$'}
          {u?.fees?.tuitionPerYear?.toLocaleString('en-IN') || '—'}
          <span className="font-normal text-gray-500"> / year</span>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {u.duration || ''}
          {u.hospitals ? ` • ${u.hospitals}+ hospitals` : ''}
        </p>
      </div>
    </Link>
  )
}

export function CountryCard({ c, count }: { c: Doc; count?: number }) {
  const img = mediaUrl(c.image)
  return (
    <Link
      href={`/countries/${c.slug}`}
      className="card-lift group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <div className="relative h-36 overflow-hidden bg-brand-50">
        <Img src={img} alt={c.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 pt-8">
          <span className="text-lg font-bold text-white">
            {c.flagEmoji ? <span className="mr-1.5">{c.flagEmoji}</span> : null}
            {c.title}
          </span>
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600">{c.tagline || ''}</p>
        {typeof count === 'number' && count > 0 ? (
          <p className="mt-1 text-xs font-semibold text-brand-600">
            {count} {count === 1 ? 'university' : 'universities'} →
          </p>
        ) : null}
      </div>
    </Link>
  )
}

export function CityCard({ c, count }: { c: Doc; count?: number }) {
  const img = mediaUrl(c.image)
  return (
    <div className="card-lift overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-36 overflow-hidden bg-brand-50">
        <Img src={img} alt={c.title} className="h-full w-full object-cover" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 pt-8">
          <span className="text-lg font-bold text-white">{c.title}</span>
        </span>
      </div>
      <div className="p-4">
        {c.description ? <p className="line-clamp-2 text-sm text-gray-600">{c.description}</p> : null}
        {typeof count === 'number' && count > 0 ? (
          <p className="mt-2 text-xs font-semibold text-brand-600">
            {count} {count === 1 ? 'university' : 'universities'}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function CourseCard({ c, icon = 'book' }: { c: Doc; icon?: IconName }) {
  return (
    <div className="card-lift flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-700 text-white">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-xl font-bold text-gray-900">{c.title}</h3>
      {c.duration ? <p className="mt-1 text-sm font-semibold text-brand-600">Duration: {c.duration}</p> : null}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{c.description || ''}</p>
      <Link href="/contact" className="mt-5 text-sm font-bold text-brand-700 transition hover:text-brand-800">
        Enquire about this course →
      </Link>
    </div>
  )
}

export function PostCard({ p }: { p: Doc }) {
  const img = mediaUrl(p.cover)
  return (
    <Link
      href={`/blogs/${p.slug}`}
      className="card-lift group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <div className="h-40 overflow-hidden bg-brand-50">
        <Img src={img} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-xs font-bold tracking-widest text-brand-600 uppercase">{p.category || 'Blog'}</p>
        <h3 className="mt-1.5 line-clamp-2 text-base font-bold text-gray-900 transition group-hover:text-brand-700">
          {p.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{p.excerpt || ''}</p>
      </div>
    </Link>
  )
}