'use client'

import { useState } from 'react'
import { Icon } from './icons'

type Props = {
  page: string
  courseInterest?: string
  compact?: boolean
}

export function LeadForm({ page, courseInterest = '', compact }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setStatus('sending')
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, page }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('done')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl bg-brand-50 p-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-700 text-white">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <p className="mt-4 text-lg font-extrabold text-brand-900">Request received</p>
        <p className="mt-1 text-sm text-gray-600">
          Our admission counsellor will call you back within 24 hours.
        </p>
      </div>
    )
  }

  const input =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input name="name" required placeholder="Full name *" className={input} />
      <input
        name="phone"
        type="tel"
        inputMode="tel"
        required
        placeholder="Phone / WhatsApp number *"
        className={input}
      />
      {!compact ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="city" required placeholder="Your city *" className={input} />
          <input name="email" type="email" required placeholder="Email *" className={input} />
        </div>
      ) : null}
      <input
        name="courseInterest"
        defaultValue={courseInterest}
        placeholder="Course (MBBS / BDS)"
        className={input}
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-brand w-full rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Request a Free Call Back'}
      </button>
      {status === 'error' ? (
        <p className="text-center text-sm text-brand-700">Something went wrong — please message us on WhatsApp.</p>
      ) : null}
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
        <Icon name="lock" className="h-3.5 w-3.5" />
        Your details are safe. No spam — just genuine admission guidance.
      </p>
    </form>
  )
}