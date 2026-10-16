import Link from 'next/link'
import { findDocs, getSettings, mediaUrl, richTextToHtml, waLink } from '@/lib/site'
import { SectionHead } from '@/components/section'
import { FaqAccordion } from '@/components/ui'
import { LeadForm } from '@/components/forms'
import { ImageSlider } from '@/components/slider'
import { Services } from '@/components/services'
import { CounsellingPopup } from '@/components/counselling-popup'
import { UniversityCard, CountryCard, CourseCard, PostCard } from '@/components/cards'
import { Icon, WhatsAppIcon, type IconName } from '@/components/icons'

export const revalidate = 60

const PROCESS = [
  { t: 'Free Counselling', d: 'Talk to our expert and pick the right university and course.' },
  { t: 'Submit Documents', d: 'Share your marksheets, passport and NEET result — we do the rest.' },
  { t: 'Get Admission Letter', d: 'Receive your official offer letter from the university.' },
  { t: 'Visa & Travel', d: 'We assist with visa, tickets, forex and pre-departure briefing.' },
  { t: 'Fly & Study', d: 'Arrive in Uzbekistan and begin your MBBS journey.' },
]

const WHY: { icon: IconName; t: string; d: string }[] = [
  { icon: 'globe', t: 'Only Recognised Universities', d: 'We place you only in WHO-listed, NMC-recognised universities — so your degree stays valid for practice in India after the licensing exam.' },
  { icon: 'money', t: 'Transparent $2,900/year Fees', d: 'A written cost breakdown before you pay anything — tuition, hostel, visa and travel. Far cheaper than private colleges in India, with zero hidden charges.' },
  { icon: 'translate', t: '100% English-Medium Programmes', d: 'We work only with universities that teach the entire MBBS in English — no language barrier, no struggling with translators.' },
  { icon: 'clipboard', t: 'No IELTS / TOEFL Hassle', d: 'Straightforward admission with no English proficiency exams. If you are NEET qualified, you are already eligible.' },
  { icon: 'idCard', t: 'Indian Faculty & Mentorship', d: 'Learn under experienced Indian-qualified faculty with familiar guidance, mentorship and NEXT/FMGE exam preparation.' },
  { icon: 'hospital', t: '36+ Hospital Network', d: 'Training across 36 hospitals and clinics means real hands-on clinical practice — not just classroom theory.' },
  { icon: 'shield', t: 'Counselling to Post-Landing Cover', d: 'One team owns everything — free counselling, documentation, visa, forex, travel, hostel and settling in. Your one-stop solution.' },
  { icon: 'pulse', t: 'Modern Campus Facilities', d: 'Teaching hospitals, modern labs, libraries, simulation rooms, sports and hostels — verified on the ground by our own team.' },
  { icon: 'rocket', t: 'Career Roadmap Beyond Admission', d: 'Our job does not end at admission. NEXT/FMGE guidance and career planning for practice in India and abroad.' },
]

const TRUST: { icon: IconName; label: string }[] = [
  { icon: 'award', label: 'Govt. Licensed University' },
  { icon: 'globe', label: 'WHO Recognised' },
  { icon: 'cap', label: 'NMC Approved' },
  { icon: 'translate', label: 'English Medium' },
  { icon: 'hospital', label: '36 Hospitals' },
  { icon: 'clipboard', label: 'NEET Qualified Admissions' },
]

const COURSE_ICONS: IconName[] = ['heart', 'smile', 'capsule']

const SLIDES = [
  { src: '/media/hero-campus.jpg', caption: 'BITU University Campus, Bukhara' },
  { src: '/media/campus-gate.jpg', caption: 'Grand Campus Entrance' },
  { src: '/media/hospital.jpg', caption: 'University Teaching Hospital' },
  { src: '/media/bukhara-city.jpg', caption: 'Historic City of Bukhara' },
  { src: '/media/library-1.jpg', caption: 'Modern Central Library' },
]

const MISSION_VISION = [
  {
    eyebrow: 'Our Mission',
    title: 'Honest guidance for every future doctor',
    text: 'To guide every Indian medical aspirant to a globally recognised MBBS degree — with honest counselling, transparent fees and complete support from application to arrival. No hidden charges, no false promises, no shortcuts.',
    points: ['Free, unbiased counselling', 'Transparent fee breakdowns', 'Support until you settle on campus'],
    img: '/media/campus-gate.jpg',
    flip: false,
  },
  {
    eyebrow: 'Our Vision',
    title: 'Talent should decide — not the price of a seat',
    text: 'A future where becoming a doctor depends on merit and determination, not on the price of a private college seat. Royal Med Global exists to be the bridge that carries deserving students to world-class medical education abroad.',
    points: ['Globally recognised universities only', 'Safe, student-first destinations', 'Careers in India and abroad'],
    img: '/media/classroom.jpg',
    flip: true,
  },
]

export default async function HomePage() {
  const [settings, universities, countries, courses, faqs, posts] = await Promise.all([
    getSettings(),
    findDocs('universities', { sort: 'title' }),
    findDocs('countries', { sort: 'title' }),
    findDocs('courses', { sort: 'title' }),
    findDocs('faqs', { sort: 'order' }),
    findDocs('posts', { sort: '-publishedDate', limit: 4 }),
  ])

  const featured = universities.find((u) => u.featured) ?? universities[0]
  const fees = featured?.fees ?? {}
  const cover = mediaUrl(featured?.cover)
  const gallery: string[] = (featured?.gallery ?? []).map((g: unknown) => mediaUrl(g)).filter(Boolean) as string[]
  const campusImages = gallery.length ? gallery : []
  const faqsToShow = (featured?.faqs?.length ? featured.faqs : faqs).slice(0, 7)
  const waText = 'Hi Royal Med Global, I want to know more about MBBS admission at BITU Uzbekistan.'
  const wa = waLink(settings, waText)
  const phones: string[] = (settings?.phones ?? []).map((p: { number: string }) => p?.number).filter(Boolean)
  const phone = phones[0] ?? '+91 92512 13136'

  return (
    <>
      <CounsellingPopup />
      {/* ---------------- HERO ---------------- */}
      <section className="hero-veil relative overflow-hidden bg-brand-950 text-white">
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-950/95 via-brand-900/85 to-brand-800/70" />
          </>
        ) : null}

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium ring-1 ring-white/20 sm:text-sm">
              <Icon name="cap" className="h-4 w-4" /> Admissions Open — 2026 Intake
            </span>
            <h1 className="mt-4 text-3xl leading-tight font-extrabold sm:text-4xl lg:mt-5 lg:text-5xl">
              Become a Doctor
              <span className="text-gold-shine block">Study MBBS Abroad</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-brand-100 lg:text-lg">
              Earn your MBBS at{' '}
              <strong className="text-white">
                {featured?.title || 'Bukhara Innovative Education and Medical University (BITU)'}
              </strong>
              , Uzbekistan. WHO &amp; NMC recognised, taught fully in English, with affordable fees of just{' '}
              <strong className="text-white">
                {fees?.currency || '$'}{(fees?.tuitionPerYear ?? 2900).toLocaleString('en-IN')}/year
              </strong>
              . No IELTS or TOEFL required.
            </p>

            <ul className="mt-5 grid max-w-xl grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {[
                'WHO & NMC Recognised Degree',
                'No IELTS / TOEFL Needed',
                '100% English Medium',
                '36+ Teaching Hospitals',
              ].map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-500 text-xs">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              {phones.map((p) => (
                <a
                  key={p}
                  href={waLink(settings, waText)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-base font-semibold transition hover:bg-white/10"
                >
                  <WhatsAppIcon className="h-5 w-5" /> {p}
                </a>
              ))}
              {!phones.length ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#1ebe5d]"
                >
                  <WhatsAppIcon className="h-5 w-5" /> {phone}
                </a>
              ) : null}
            </div>
          </div>

          <div id="apply" className="reveal rounded-2xl bg-white p-5 text-gray-900 shadow-2xl sm:p-8">
            <h2 className="text-xl font-extrabold text-brand-900">Get Free Admission Guidance</h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill the form, our counsellor calls you back within 24 hours.
            </p>
            <div className="mt-5">
              <LeadForm page="home-hero" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST STRIP ---------------- */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 text-sm font-semibold text-gray-600">
          {TRUST.map((t) => (
            <span key={t.label} className="flex items-center gap-2">
              <Icon name={t.icon} className="h-4 w-4 text-brand-600" />
              {t.label}
            </span>
          ))}
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="bg-brand-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">
          {[
            [`${fees?.currency || '$'}${(fees?.tuitionPerYear ?? 2900).toLocaleString('en-IN')}`, 'Tuition per year'],
            [featured?.duration || '6 Years', 'MBBS Duration'],
            [`${featured?.hospitals ?? 36}+`, 'Affiliated Hospitals'],
            ['100%', 'English Medium'],
          ].map(([v, l]) => (
            <div key={l} className="reveal text-center">
              <p className="text-3xl font-extrabold text-brand-700 sm:text-4xl">{v}</p>
              <p className="mt-1 text-sm font-medium text-gray-600">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- WHY ---------------- */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <SectionHead
          eyebrow="Why Choose Royal Med Global"
          title="India's Trusted MBBS Abroad Consultancy"
          sub="Your one-stop solution for MBBS abroad — from counselling to post-landing, we've got everything covered."
        />
        <div className="stagger mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <div
              key={w.t}
              style={{ '--i': i % 3 } as React.CSSProperties}
              className="card-lift reveal group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
                <Icon name={w.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{w.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <Services />

      {/* ---------------- ABOUT ---------------- */}
      {featured ? (
        <section className="overflow-hidden bg-gray-50">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-20">
            <div className="reveal relative grid grid-cols-2 gap-4">
              {campusImages.slice(0, 3).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  className={`rounded-2xl object-cover shadow transition duration-700 hover:scale-[1.02] hover:shadow-xl ${i === 0 ? 'col-span-2 h-56 w-full sm:h-64' : 'h-40 w-full sm:h-48'}`}
                />
              ))}
              {cover ? (
                <span className="animate-floaty absolute -bottom-5 left-1/2 grid h-24 w-24 -translate-x-1/2 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/media/logo.png" alt="Royal Med Global" className="h-full w-full object-contain" />
                </span>
              ) : null}
            </div>
            <div className="reveal">
              <p className="text-sm font-bold tracking-widest text-brand-600 uppercase">About the University</p>
              <h2 className="mt-2 text-3xl font-extrabold text-balance text-gray-900 sm:text-4xl">{featured.title}</h2>
              <span className="gold-rule mt-4 block w-24" aria-hidden="true" />
              <div
                className="mt-4 space-y-3 leading-relaxed text-gray-600 [&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:text-gray-900 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-gray-900"
                dangerouslySetInnerHTML={{ __html: richTextToHtml(featured.about) }}
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/universities/${featured.slug}`}
                  className="btn-gold rounded-full px-6 py-3 text-sm font-bold"
                >
                  Get Full Details Free →
                </Link>
                <Link
                  href="#apply-cta"
                  className="rounded-full border-2 border-brand-700 px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-700 hover:text-white"
                >
                  Talk to a Counsellor
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------- MISSION / VISION ---------------- */}
      <section className="bg-sand overflow-hidden">
        <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 lg:py-20">
          {MISSION_VISION.map((m) => (
            <div key={m.eyebrow} className="grid items-center gap-10 lg:grid-cols-2">
              <div className={`reveal order-2 ${m.flip ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.img}
                    alt={m.title}
                    loading="lazy"
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-96"
                  />
                  <span className="absolute inset-3 rounded-xl border border-gold-300/70" aria-hidden="true" />
                </div>
              </div>
              <div className={`reveal order-1 ${m.flip ? 'lg:order-2' : 'lg:order-1'}`}>
                <p className="text-sm font-bold tracking-widest text-brand-600 uppercase">{m.eyebrow}</p>
                <h2 className="mt-2 text-3xl font-extrabold text-balance text-gray-900 sm:text-4xl">{m.title}</h2>
                <span className="gold-rule mt-5 block w-24" aria-hidden="true" />
                <p className="mt-5 leading-relaxed text-gray-600">{m.text}</p>
                <ul className="mt-6 space-y-2.5">
                  {m.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-500 text-white">
                        <Icon name="check" className="h-3.5 w-3.5" />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- COURSES ---------------- */}
      <section id="courses" className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <SectionHead eyebrow="Courses" title="Programmes for International Students" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {courses.map((c, i) => (
            <CourseCard key={c.id} c={c} icon={COURSE_ICONS[i % COURSE_ICONS.length]} />
          ))}
        </div>
      </section>

      {/* ---------------- FEES ---------------- */}
      <section id="fees" className="bg-brand-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 lg:py-20">
          <SectionHead
            dark
            eyebrow="Transparent Fees"
            title="MBBS Fee Structure"
            sub="Simple, flat tuition — no hidden surprises. Same fee every year."
          />
          <div className="reveal mt-10 overflow-hidden rounded-2xl bg-white text-gray-900 shadow-xl">
            <div className="grid grid-cols-3 bg-brand-50 text-center sm:grid-cols-6">
              {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'].map((y) => (
                <p key={y} className="px-3 py-3 text-sm font-bold tracking-wide text-brand-800 uppercase">
                  {y}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-3 text-center sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <p key={i} className="border-t border-gray-100 px-3 py-4 text-lg font-bold">
                  {fees?.currency || '$'}
                  {(fees?.tuitionPerYear ?? 2900).toLocaleString('en-IN')}
                </p>
              ))}
            </div>
            <div className="flex flex-col items-center justify-between gap-2 bg-gradient-to-r from-brand-900 via-brand-700 to-gold-600 px-6 py-4 text-white sm:flex-row">
              <p className="text-lg font-bold">Total: {fees?.totalTuition || '$14,400'}</p>
              <p className="text-lg font-bold">{fees?.totalTuitionINR || '₹12,96,000'}</p>
            </div>
          </div>
          <p className="reveal mt-4 text-center text-xs text-brand-200">
            {fees?.note ||
              '*Indicative tuition fees for the full 6-year MBBS programme. Hostel, mess and other charges are separate. Fees are subject to change by the university.'}
          </p>
          <div className="reveal mt-8 text-center">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-white px-8 py-3.5 font-bold text-brand-800 shadow-lg transition hover:bg-brand-50"
            >
              Get the Full Cost Breakdown →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- CAMPUS ---------------- */}
      <section id="campus" className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <SectionHead
          eyebrow="Campus Life"
          title="World-Class Campus & Facilities"
          sub="Modern infrastructure for studying, training and living — all in one place."
        />
        <div className="reveal mx-auto mt-12 max-w-7xl">
          <ImageSlider slides={SLIDES} interval={1000} />
        </div>
        {campusImages.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {campusImages.slice(0, 8).map((src, i) => (
              <figure key={`${src}-${i}`} className="group relative overflow-hidden rounded-xl shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-44"
                />
                {featured?.facilities?.[i]?.title ? (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs font-semibold text-white">
                    {featured.facilities[i].title}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section id="process" className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <SectionHead
            eyebrow="Simple Process"
            title="5 Easy Steps to Admission"
            sub="We handle the paperwork — you focus on becoming a doctor."
          />
          <div className="stagger mt-12 grid gap-6 md:grid-cols-5">
            {PROCESS.map((s, i) => (
              <div
                key={s.t}
                style={{ '--i': i } as React.CSSProperties}
                className="card-lift reveal relative rounded-2xl bg-white p-6 text-center shadow-sm"
              >
                <span className="btn-brand mx-auto grid h-12 w-12 place-items-center rounded-full text-lg font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-bold text-gray-900">{s.t}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- COUNTRIES ---------------- */}
      {countries.length ? (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <SectionHead eyebrow="Destinations" title="Study Countries" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((c) => (
              <CountryCard key={c.id} c={c} />
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------------- UNIVERSITIES ---------------- */}
      {universities.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <SectionHead eyebrow="Universities" title="Featured Universities" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {universities.slice(0, 6).map((u) => (
              <UniversityCard key={u.id} u={u} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/universities"
              className="inline-block rounded-full border-2 border-brand-700 px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-700 hover:text-white"
            >
              View All Universities
            </Link>
          </div>
        </section>
      ) : null}

      {/* ---------------- APPLY ---------------- */}
      <section id="apply-cta" className="hero-veil relative overflow-hidden bg-brand-950 text-white">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-20">
          <div className="reveal">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Start Your MBBS Journey Today</h2>
            <p className="mt-4 max-w-lg text-lg text-brand-100">
              Seats are limited for the 2026 intake. Fill the form and our admission counsellor will call you back
              within 24 hours — completely free, no obligation.
            </p>
            <ul className="mt-6 space-y-2 text-brand-100">
              {[
                'Free, expert admission guidance',
                'End-to-end support — admission to visa',
                'Transparent fees, no hidden charges',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Icon name="checkCircle" className="h-5 w-5 text-green-400" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              {phones.length ? (
                phones.map((p) => (
                  <a
                    key={p}
                    href={waLink(settings, waText)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-base font-bold text-white transition hover:bg-[#1ebe5d]"
                  >
                    <WhatsAppIcon className="h-5 w-5" /> {p}
                  </a>
                ))
              ) : (
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-base font-bold text-white transition hover:bg-[#1ebe5d]"
                >
                  <WhatsAppIcon className="h-5 w-5" /> {phone}
                </a>
              )}
            </div>
          </div>
          <div className="reveal rounded-2xl bg-white p-6 text-gray-900 shadow-2xl sm:p-8">
            <h3 className="text-xl font-extrabold text-brand-900">Apply for MBBS Admission</h3>
            <p className="mt-1 text-sm text-gray-500">Free counselling • 24-hour call back • Limited seats</p>
            <div className="mt-5">
              <LeadForm page="home-apply" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <SectionHead eyebrow="FAQ" title="Frequently Asked Questions" />
        <FaqAccordion
          items={faqsToShow.map((f: { question: string; answer: string }) => ({
            question: f.question,
            answer: f.answer,
          }))}
        />
      </section>

      {/* ---------------- POSTS ---------------- */}
      {posts.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <SectionHead eyebrow="Blogs" title="Latest Insights" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((p) => (
              <PostCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}