'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/nav'
import { Icon } from './icons'

export function HeaderNav({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const tel = `tel:${phone.replace(/\s/g, '')}`

  return (
    <>
      <nav className="hidden items-center gap-7 xl:flex">
        {NAV_LINKS.map((l) => {
          const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={`group relative text-sm font-medium transition-colors ${
                active ? 'text-brand-700' : 'text-gray-700 hover:text-brand-700'
              }`}
            >
              {l.label}
              <span
                className={`absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-brand-600 transition-transform duration-300 ease-out ${
                  active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
          )
        })}
        <Link href="/contact" className="btn-gold rounded-full px-5 py-2.5 text-sm font-bold shadow-sm">
          Apply Free
        </Link>
      </nav>

      <div className="flex items-center gap-2 xl:hidden">
        <a href={tel} aria-label="Call us" className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-brand-700 transition hover:border-brand-200 hover:bg-brand-50">
          <Icon name="phone" className="h-5 w-5" />
        </a>
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-brand-50"
        >
          <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
        </button>
      </div>

      {open ? (
        <nav className="border-t border-brand-100 bg-white xl:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 font-medium text-gray-700 transition hover:bg-brand-50 hover:text-brand-700"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-gold mt-2 block rounded-full px-4 py-2.5 text-center font-bold"
            >
              Apply Free
            </Link>
          </div>
        </nav>
      ) : null}
    </>
  )
}