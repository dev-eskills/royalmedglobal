import type { Metadata, Viewport } from 'next'
import { Instrument_Sans } from 'next/font/google'
import Link from 'next/link'
import '../globals.css'
import { getSettings } from '@/lib/site'
import { Header, Footer, FloatButtons } from '@/components/chrome'
import { RevealScript, JsFlag } from '@/components/ui'
import { Icon } from '@/components/icons'

const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const revalidate = 60

export const viewport: Viewport = {
  themeColor: '#911531',
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    title: `${s?.siteName || 'Royal Med Global'} — ${s?.tagline || 'Your Trusted Path to MBBS Abroad'}`,
    description:
      'Study MBBS abroad at Bukhara Innovative Education & Medical University, Uzbekistan. WHO & NMC recognised, English medium, no IELTS/TOEFL, affordable fees. Apply with Royal Med Global.',
    icons: { icon: '/media/logo.png', apple: '/media/logo.png' },
  }
}

const MOBILE_NAV = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/universities', label: 'Universities', icon: 'university' },
  { href: '/courses', label: 'Courses', icon: 'book' },
  { href: '/contact', label: 'Apply', icon: 'sparkle' },
] as const

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="en" className={instrument.variable} data-scroll-behavior="smooth">
      <body className="antialiased">
        <JsFlag />
        <Header settings={settings} />
        <main className="min-h-[60vh]">{children}</main>
        <Footer settings={settings} />
        <FloatButtons settings={settings} />
        <RevealScript />

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur sm:hidden">
          <div className="grid grid-cols-4">
            {MOBILE_NAV.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold tracking-wide text-gray-500 uppercase transition"
              >
                <Icon name={m.icon} className="h-5 w-5 text-brand-700" />
                {m.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="h-16 sm:hidden" />
      </body>
    </html>
  )
}