import Link from 'next/link'
import { firstPhone, mediaUrl, waLink, type Doc } from '@/lib/site'
import { NAV_LINKS } from '@/lib/nav'
import { HeaderNav } from './header-nav'
import { ApplyButton } from './counselling-popup'
import { Icon, WhatsAppIcon } from './icons'

export function TopBar({ settings }: { settings: Doc }) {
  const phones: string[] = (settings?.phones ?? []).map((p: Doc) => p?.number).filter(Boolean)
  return (
    <div className="hidden bg-brand-900 text-white md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm">
        <p className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-float-pulse rounded-full bg-green-400" />
          {settings?.topBarText || 'Your Trusted Path to MBBS Abroad — 2026 Admissions Open'}
        </p>
        <div className="flex shrink-0 items-center gap-5">
          {phones.map((p) => (
            <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="flex items-center gap-1.5 transition hover:text-brand-200">
              <Icon name="phone" className="h-4 w-4" />
              {p}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * The brand crest already carries the wordmark, so it stands alone in the header.
 * `contain` keeps the whole crest visible at a prominent size.
 */
function BrandMark({ logo }: { logo: string | null }) {
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo} alt="Royal Med Global" width={200} height={140} className="h-12 w-auto sm:h-14" />
    )
  }
  return (
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 text-white">
      <Icon name="cap" className="h-5 w-5" />
    </span>
  )
}

export function Header({ settings }: { settings: Doc }) {
  const logo = mediaUrl(settings?.logo)
  const name = settings?.siteName || 'Royal Med Global'
  return (
    <div className="sticky top-0 z-40">
      <TopBar settings={settings} />
      <header className="border-b border-brand-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
          <Link href="/" aria-label={`${name} — home`} className="flex shrink-0 items-center">
            <BrandMark logo={logo} />
          </Link>
          <HeaderNav phone={firstPhone(settings)} />
        </nav>
      </header>
    </div>
  )
}

export function Footer({ settings }: { settings: Doc }) {
  const phones: string[] = (settings?.phones ?? []).map((p: Doc) => p?.number).filter(Boolean)
  const email = settings?.emails?.[0]?.address
  const name = settings?.siteName || 'Royal Med Global'
  const logo = mediaUrl(settings?.logo)
  return (
    <footer className="bg-ink text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={name} className="h-24 w-auto rounded-2xl bg-white p-2" />
          ) : (
            <p className="flex items-center gap-2.5 text-lg font-extrabold text-white">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700 text-white">
                <Icon name="cap" className="h-5 w-5" />
              </span>
              {name}
            </p>
          )}
          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">
            {settings?.footerAbout ||
              'Royal Med Global helps Indian students secure admission to globally recognised medical universities abroad. We guide you end-to-end — from application and admission to visa and travel.'}
          </p>
        </div>
        <div>
          <p className="text-sm font-bold tracking-widest text-white uppercase">Quick Links</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-line transition-colors hover:text-brand-300">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <ApplyButton className="link-line transition-colors hover:text-brand-300">
                Apply Now
              </ApplyButton>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold tracking-widest text-white uppercase">Contact</p>
          <ul className="mt-4 space-y-3 text-sm">
            {phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s/g, '')}`} className="group flex items-center gap-2">
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-brand-400" />
                  <span className="link-line transition-colors group-hover:text-brand-300">{p}</span>
                </a>
              </li>
            ))}
            {email ? (
              <li>
                <a href={`mailto:${email}`} className="group flex items-center gap-2">
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-brand-400" />
                  <span className="link-line transition-colors group-hover:text-brand-300">{email}</span>
                </a>
              </li>
            ) : null}
            {settings?.address ? (
              <li className="flex gap-2 text-gray-400">
                <Icon name="pin" className="h-4 w-4 shrink-0 text-brand-400" />
                <span>{settings.address}</span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl space-y-2 px-4 py-6 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p>
            Disclaimer: Royal Med Global is an independent education consultancy and is not the university itself.
            University names, logos, photographs and fees are the property of their respective owners and are shown for
            informational purposes. Fees and intake details are indicative and subject to change by the university.
          </p>
        </div>
      </div>
    </footer>
  )
}

export function FloatButtons({ settings }: { settings: Doc }) {
  const phone = firstPhone(settings).replace(/\s/g, '')
  const wa = waLink(settings, 'Hi Royal Med Global, I want to know more about MBBS admission at BITU Uzbekistan.')
  return (
    <div className="fixed right-4 bottom-24 z-40 flex flex-col gap-2.5 sm:bottom-6">
      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
      <a
        href={`tel:${phone}`}
        aria-label="Call us"
        className="grid h-12 w-12 place-items-center rounded-full bg-brand-700 text-white shadow-lg shadow-brand-900/30 transition hover:scale-105"
      >
        <Icon name="phone" className="h-5 w-5" />
      </a>
    </div>
  )
}