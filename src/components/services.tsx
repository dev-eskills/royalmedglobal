'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon, type IconName } from './icons'
import { SectionHead } from './section'

type Service = {
  id: string
  label: string
  icon: IconName
  heading: string
  description: string
  features: [string, string, string, string]
}

const SERVICES: Service[] = [
  {
    id: 'research',
    label: 'Research',
    icon: 'globe',
    heading: 'Explore 50,000+ Expert Articles & University Profiles',
    description:
      'Dive into a world of diverse destinations, prestigious universities, and exciting courses. Our comprehensive database helps you make informed decisions about your future.',
    features: [
      'Country-wise university listings',
      'Detailed course breakdowns',
      'Fee comparisons & rankings',
      'Student reviews & experiences',
    ],
  },
  {
    id: 'shortlisting',
    label: 'Shortlisting',
    icon: 'checkCircle',
    heading: 'Find Your Right-Fit Universities & Courses',
    description:
      'Our AI-powered matching system analyzes your profile, budget, and preferences to curate a personalized list of universities where you have the best chances of admission.',
    features: [
      'Profile-based matching',
      'Budget-friendly options',
      'Eligibility checks',
      'Acceptance probability scores',
    ],
  },
  {
    id: 'counselling',
    label: 'Counselling',
    icon: 'chat',
    heading: 'Get Expert Advice from Our Certified Counsellors',
    description:
      'Take the pivotal first step and engage in a personalized conversation with our expert mentors who have guided thousands of students to their dream universities.',
    features: [
      '1-on-1 video sessions',
      'Career path guidance',
      'Country & course selection',
      'Scholarship advisory',
    ],
  },
  {
    id: 'test-prep',
    label: 'Test Prep',
    icon: 'book',
    heading: 'Ace IELTS, TOEFL & Other Standardized Tests',
    description:
      'Get comprehensive test preparation with live classes and free demos from our certified teachers for IELTS, TOEFL, PTE, NEET and other entrance exams.',
    features: [
      'Live online classes',
      'Practice mock tests',
      'Study material access',
      'Score improvement guarantee',
    ],
  },
  {
    id: 'admission',
    label: 'Admission',
    icon: 'clipboard',
    heading: 'Complete Application & Documentation Support',
    description:
      'From filling out application forms to document verification and submission — we handle everything so you can focus on what matters.',
    features: [
      'Application form filing',
      'Document verification',
      'University follow-ups',
      'Offer letter assistance',
    ],
  },
  {
    id: 'visa-travel',
    label: 'Visa & Travel',
    icon: 'send',
    heading: 'Hassle-Free Visa Processing & Travel Arrangements',
    description:
      'Our visa experts ensure a smooth process with high success rates. We also help with flight bookings, forex, and travel insurance.',
    features: [
      'Visa documentation',
      'Interview preparation',
      'Flight booking assistance',
      'Travel insurance & forex',
    ],
  },
]

export function Services() {
  const [activeId, setActiveId] = useState(SERVICES[0].id)
  const [page, setPage] = useState(0)
  const activeIndex = SERVICES.findIndex((s) => s.id === activeId)
  const active = SERVICES[activeIndex]
  const pages = [SERVICES.slice(0, 3), SERVICES.slice(3)]

  const select = (id: string) => {
    setActiveId(id)
    setPage(SERVICES.findIndex((s) => s.id === id) < 3 ? 0 : 1)
  }

  return (
    <section aria-labelledby="services-heading" className="bg-sand">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div id="services-heading">
          <SectionHead
            eyebrow="Service Offering"
            title={
              <>
                Everything You Need, <span className="text-brand-600">We Got It Covered</span>
              </>
            }
            sub="From research to post-landing — explore our comprehensive suite of services"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
          {/* ------- Mobile carousel: 3 per slide with arrows ------- */}
          <div className="lg:hidden">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  {pages.map((group, p) => (
                    <div key={p} className="grid w-full shrink-0 grid-cols-3 gap-2" aria-hidden={p !== page}>
                      {group.map((s) => {
                        const isActive = s.id === activeId
                        return (
                          <button
                            key={s.id}
                            type="button"
                            aria-pressed={isActive}
                            aria-controls="service-panel"
                            onClick={() => select(s.id)}
                            className={`flex flex-col items-center gap-1.5 rounded-2xl border px-1 py-3 text-center transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
                              isActive
                                ? 'border-brand-700 bg-brand-700 text-white shadow-lg shadow-brand-900/25'
                                : 'border-gray-200 bg-white text-gray-800'
                            }`}
                          >
                            <span
                              className={`grid h-8 w-8 place-items-center rounded-xl transition-colors ${
                                isActive ? 'bg-white/15 text-gold-300' : 'bg-brand-50 text-brand-700'
                              }`}
                            >
                              <Icon name={s.icon} className="h-4 w-4" />
                            </span>
                            <span className="block text-[11px] leading-tight font-bold">{s.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                aria-label="Previous services"
                disabled={page === 0}
                onClick={() => setPage(0)}
                className="absolute top-1/2 -left-2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-brand-700 shadow-md transition disabled:opacity-30"
              >
                <Icon name="chevron" className="h-4 w-4 rotate-90" />
              </button>
              <button
                type="button"
                aria-label="Next services"
                disabled={page === 1}
                onClick={() => setPage(1)}
                className="absolute top-1/2 -right-2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-brand-700 shadow-md transition disabled:opacity-30"
              >
                <Icon name="chevron" className="h-4 w-4 -rotate-90" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5">
              {[0, 1].map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-label={`Go to slide ${p + 1}`}
                  onClick={() => setPage(p)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    page === p ? 'w-6 bg-brand-600' : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ------- Desktop vertical sidebar ------- */}
          <div role="tablist" aria-label="Our services" className="hidden lg:flex lg:flex-col lg:gap-2.5">
            {SERVICES.map((s, i) => {
              const isActive = s.id === activeId
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="service-panel"
                  id={`service-tab-${s.id}`}
                  onClick={() => select(s.id)}
                  className={`group flex flex-col items-center gap-2 rounded-2xl border px-3 py-3.5 text-center transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none lg:w-full lg:flex-row lg:gap-3 lg:px-4 lg:text-left ${
                    isActive
                      ? 'border-brand-700 bg-brand-700 text-white shadow-lg shadow-brand-900/25'
                      : 'border-gray-200 bg-white text-gray-800 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md'
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors duration-300 lg:h-10 lg:w-10 ${
                      isActive ? 'bg-white/15 text-gold-300' : 'bg-brand-50 text-brand-700'
                    }`}
                  >
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="hidden text-[11px] font-bold tracking-widest uppercase opacity-60 lg:block">
                      Step {i + 1}
                    </span>
                    <span className="block text-[13px] leading-tight font-bold lg:text-sm">
                      {s.label}
                    </span>
                  </span>
                  <Icon
                    name="chevron"
                    className={`hidden h-4 w-4 -rotate-90 transition lg:block ${isActive ? 'text-gold-300' : 'text-gray-300'}`}
                  />
                </button>
              )
            })}
          </div>

          {/* ------- Dynamic content card ------- */}
          <div
            role="tabpanel"
            id="service-panel"
            aria-labelledby={`service-tab-${active.id}`}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div key={active.id} className="animate-card-in p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-700 text-gold-300">
                  <Icon name={active.icon} className="h-7 w-7" />
                </span>
                <span className="rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold tracking-widest text-brand-700 uppercase">
                  Step {activeIndex + 1} of {SERVICES.length}
                </span>
              </div>
              <div
                className="mt-4 h-1 overflow-hidden rounded-full bg-gray-100"
                role="progressbar"
                aria-valuenow={activeIndex + 1}
                aria-valuemin={1}
                aria-valuemax={SERVICES.length}
                aria-label="Service progress"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-gold-500 transition-all duration-500 ease-out"
                  style={{ width: `${((activeIndex + 1) / SERVICES.length) * 100}%` }}
                />
              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-balance text-gray-900 sm:text-3xl">
                {active.heading}
              </h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-gray-600">{active.description}</p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {active.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 rounded-xl bg-gray-50 px-4 py-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-500 text-white">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-gray-800">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold"
                >
                  Get Started <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}