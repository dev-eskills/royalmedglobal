import { getPayload } from 'payload'
import type { SerializedEditorState } from 'lexical'
import path from 'path'
import { readFileSync, existsSync } from 'fs'
import config from '@/payload.config'

const SITE = 'https://royalmedglobal.in'

const IMAGES = [
  'logo.svg',
  'images/hero-campus.jpg',
  'images/campus-gate.jpg',
  'images/hospital.jpg',
  'images/bukhara-city.jpg',
  'images/library-1.jpg',
  'images/lab-anatomy.jpg',
  'images/lab-dentistry.jpg',
  'images/classroom.jpg',
  'images/it-room.jpg',
  'images/sports-hall.jpg',
  'images/gym.jpg',
  'images/stadium.jpg',
  'images/canteen.jpg',
  'images/dorm-building.jpg',
  'images/activist-hall.jpg',
] as const

const GALLERY_FILES = [
  'hospital.jpg',
  'library-1.jpg',
  'lab-anatomy.jpg',
  'lab-dentistry.jpg',
  'classroom.jpg',
  'it-room.jpg',
  'sports-hall.jpg',
  'gym.jpg',
  'stadium.jpg',
  'canteen.jpg',
  'dorm-building.jpg',
  'activist-hall.jpg',
] as const

function para(...lines: string[]): SerializedEditorState {
  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: lines.map((text) => ({
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
      })),
    },
  } as unknown as SerializedEditorState
}

/* Copy below is taken from royalmedglobal.in */
const FAQS = [
  {
    question: 'Is the MBBS degree recognised in India?',
    answer:
      'Yes. BITU is recognised by the WHO and the National Medical Commission (NMC). After completing your MBBS, you can appear for the NEXT/FMGE licensing exam to practise medicine in India.',
  },
  {
    question: 'Is NEET required for admission?',
    answer:
      'Yes. As per NMC rules, Indian students must qualify NEET to study MBBS abroad and to be eligible to practise in India later. You do not need IELTS or TOEFL.',
  },
  {
    question: 'What is the total cost of the MBBS programme?',
    answer:
      'Tuition is $2,900 per year — about ₹12,96,000 in total for the full 6-year programme. Hostel and living costs are separate and very affordable.',
  },
  {
    question: 'What language are classes taught in?',
    answer:
      'The entire MBBS programme is taught in English, so there is no language barrier for Indian students.',
  },
  {
    question: 'Is accommodation available?',
    answer:
      'Yes. The university provides on-campus hostels with mess facilities for international students, along with sports, gym and library access.',
  },
  {
    question: 'Is it safe for Indian students?',
    answer:
      'Bukhara is one of the safest cities in Central Asia, with a supportive, student-friendly environment and a growing Indian student community.',
  },
  {
    question: 'How do I apply?',
    answer:
      'Fill in the form on this page or send us a WhatsApp message. Our counsellor will guide you through the entire process for free.',
  },
]

const FACILITIES = [
  { title: 'University Teaching Hospital', text: 'An on-campus teaching hospital for clinical exposure from the start.' },
  { title: 'Modern Library', text: 'Books, journals and digital resources for students and faculty.' },
  { title: 'Anatomy Practice Lab', text: 'Hands-on anatomy training in modern laboratories.' },
  { title: 'Dental Practice Rooms', text: 'Dental simulation and practice rooms for dentistry students.' },
  { title: 'Smart Classrooms', text: 'Digital smart classes across every department.' },
  { title: 'IT & Computer Lab', text: 'High-speed computers and online learning resources.' },
  { title: 'Indoor Sports Complex', text: 'Indoor sports facilities alongside an outdoor stadium and gym.' },
  { title: 'Student Canteen', text: 'Student canteen and mess facilities on campus.' },
  { title: 'On-Campus Hostels', text: 'Secure on-campus hostels for international students.' },
    { title: 'Auditorium & Events', text: 'Auditorium and event spaces for college activities.' },
]

/* REPLACE ME — dummy Russia data for testing the admin→site flow. */
const KAZAN_GALLERY_FILES = [
  'hospital.jpg',
  'library-1.jpg',
  'lab-anatomy.jpg',
  'classroom.jpg',
  'canteen.jpg',
  'dorm-building.jpg',
] as const

const KAZAN_FACILITIES = [
  { title: 'University Teaching Hospital', text: 'An on-campus teaching hospital for early clinical exposure.', image: 'hospital.jpg' },
  { title: 'Modern Library', text: 'Books, journals and digital resources for students and faculty.', image: 'library-1.jpg' },
  { title: 'Anatomy Practice Lab', text: 'Hands-on anatomy training in modern laboratories.', image: 'lab-anatomy.jpg' },
  { title: 'Smart Classrooms', text: 'Digital smart classes across every department.', image: 'classroom.jpg' },
  { title: 'Student Canteen', text: 'Student canteen and mess facilities on campus.', image: 'canteen.jpg' },
  { title: 'On-Campus Hostels', text: 'Secure on-campus hostels for international students.', image: 'dorm-building.jpg' },
]

/* REPLACE ME — sample reviews for testing the homepage section. */
const SAMPLE_TESTIMONIALS = [
  {
    name: 'Aarav Sharma',
    role: 'MBBS Student, Batch 2024',
    quote:
      'The counsellors guided me from NEET counselling to my hostel room in Bukhara. Everything they promised on paper is exactly what happened — no hidden charges at all.',
    rating: 5,
  },
  {
    name: 'Priya Verma',
    role: 'MBBS Student, Batch 2025',
    quote:
      'Being the first in my family to go abroad, I was nervous. The team handled my admission letter, visa and travel, and even met us at the airport.',
    rating: 5,
  },
  {
    name: 'Mohammed Irfan',
    role: 'Parent',
    quote:
      'As a parent, transparent fees and honest advice mattered most to me. Royal Med Global explained every cost in writing before we paid anything.',
    rating: 4,
  },
]

type Coll = 'countries' | 'cities' | 'universities' | 'courses' | 'faqs'

export async function runSeed() {
  const payload = await getPayload({ config })
  const log: string[] = []

  // 1. Admin user
  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { name: 'Admin', email: 'admin@royalmedglobal.in', password: 'Royal@123', role: 'admin' },
    })
    log.push('Created admin user (admin@royalmedglobal.in — change the password after logging in)')
  } else {
    log.push('Admin user already exists, skipped')
  }

  // 2. Media (images pulled from royalmedglobal.in)
  const mediaIds: Record<string, string> = {}
  const existingMedia = await payload.find({ collection: 'media', limit: 200 })
  for (const doc of existingMedia.docs) {
    if (typeof doc.filename === 'string') mediaIds[doc.filename] = String(doc.id)
  }
  for (const path of IMAGES) {
    const filename = path.split('/').pop() as string
    if (mediaIds[filename]) continue
    try {
      const res = await fetch(`${SITE}/${path}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      const mimetype = filename.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg'
      const doc = await payload.create({
        collection: 'media',
        data: { alt: filename.replace(/[-_.]/g, ' ') },
        file: { data: buf, mimetype, name: filename, size: buf.length },
      })
      mediaIds[filename] = doc.id as string
      log.push(`Uploaded image: ${filename}`)
    } catch {
      log.push(`Image not available, skipped: ${filename}`)
    }
  }

  // 2b. Brand logo from local disk (the new royal crest, not hosted on the old site).
  // Reuse any previously uploaded crest so re-seeds never stack duplicates.
  const existingCrest = Object.keys(mediaIds).find((f) => /^logo(-\d+)?\.png$/.test(f))
  if (!existingCrest) {
    const localLogoPath = path.resolve(process.cwd(), 'media', 'logo.png')
    if (existsSync(localLogoPath)) {
      try {
        const buf: Buffer = readFileSync(localLogoPath) as Buffer
        const doc = await payload.create({
          collection: 'media',
          data: { alt: 'Royal Med Global logo' },
          file: { data: buf, mimetype: 'image/png', name: 'logo.png', size: buf.length },
        })
        mediaIds['logo.png'] = doc.id as string
        log.push('Uploaded brand logo: logo.png')
      } catch {
        log.push('Brand logo upload failed')
      }
    }
  } else {
    log.push(`Brand logo already present: ${existingCrest}`)
  }
  // 3. Site settings
  const brandLogo =
    mediaIds['logo.png'] ??
    mediaIds['logo-1.png'] ??
    mediaIds['logo-2.png'] ??
    mediaIds['logo-3.png'] ??
    mediaIds['logo.svg']
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Royal Med Global',
      tagline: 'Your Trusted Path to MBBS Abroad',
      topBarText: 'Your Trusted Path to MBBS Abroad — 2026 Admissions Open',
      phones: [{ number: '+91 92512 13136' }, { number: '+91 89828 88882' }],
      emails: [{ address: 'royalmedglobal@gmail.com' }],
      address:
        'Office No. 100, Shri Nagar Colony Main, 101 Nikhil Apartment, Near Anand Bazar Square, Indore - 452018',
      whatsappNumber: '919251213136',
      footerAbout:
        'Royal Med Global helps Indian students secure admission to globally recognised medical universities abroad. We guide you end-to-end — from application and admission to visa and travel.',
      ...(brandLogo ? { logo: brandLogo } : {}),
    },
  })
  log.push('Site settings saved')

  // Upsert helper — existing docs are updated so stale copy never survives a re-seed.
  const upsert = async (collection: Coll, slug: string, data: Record<string, unknown>) => {
    const found = await payload.find({
      collection: collection as 'countries',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const existing = found.docs[0]
    if (existing) {
      await payload.update({
        collection: collection as 'countries',
        id: String(existing.id),
        data: { ...(existing as Record<string, unknown>), ...data },
      })
      log.push(`Updated ${collection}: ${slug}`)
      return String(existing.id)
    }
    const doc = await payload.create({
      collection: collection as 'countries',
      data: { ...data, slug } as never,
    })
    log.push(`Created ${collection}: ${slug}`)
    return String(doc.id)
  }

  // 4. Country: Uzbekistan
  const countryId = await upsert('countries', 'uzbekistan', {
    title: 'Uzbekistan',
    tagline: 'WHO & NMC recognised, fully English medium, $2,900 per year',
    description: para(
      'Uzbekistan hosts government-licensed medical universities that are listed by the World Health Organization and recognised by the National Medical Commission, so the degree is valid for practice in India after the licensing exam.',
      'The entire MBBS programme is taught in English, tuition is a flat $2,900 per year, and no IELTS or TOEFL is required — which is why it has become a leading destination for Indian medical students.',
    ),
    currencyNote: '$1 = about ₹90',
    featured: true,
    ...(mediaIds['bukhara-city.jpg'] ? { image: mediaIds['bukhara-city.jpg'] } : {}),
  })

  // 5. City: Bukhara
  const cityId = await upsert('cities', 'bukhara', {
    title: 'Bukhara',
    country: countryId,
    description:
      'Bukhara is one of the safest and most welcoming cities in Central Asia — rich in culture, affordable to live in, and home to a growing community of Indian medical students.',
    ...(mediaIds['campus-gate.jpg'] ? { image: mediaIds['campus-gate.jpg'] } : {}),
  })

  // 6. University: BITU
  const gallery = GALLERY_FILES.map((f) => mediaIds[f]).filter(Boolean)
  const uniId = await upsert('universities', 'bitu', {
    title: 'Bukhara Innovative Education and Medical University',
    shortName: 'BITU',
    country: countryId,
    city: cityId,
    tagline: 'A 6-year MBBS programme designed for international students',
    fees: {
      tuitionPerYear: 2900,
      currency: '$',
      totalTuition: '$14,400',
      totalTuitionINR: '₹12,96,000',
      note: 'Indicative tuition fees for the full 6-year MBBS programme. Hostel, mess and other charges are separate. Fees are subject to change by the university.',
    },
    duration: '6 Years',
    hospitals: 36,
    recognition: ['WHO', 'NMC'],
    englishMedium: true,
    ieltsRequired: false,
    neetRequired: true,
    about: para(
      'Located in the historic city of Bukhara, Uzbekistan, BITU is a government-licensed medical university offering a 6-year MBBS programme designed for international students.',
      'With its own teaching hospital on campus, 36 affiliated clinics, modern laboratories and Indian-qualified faculty, it offers a complete environment to train as a doctor.',
      'Bukhara is one of the safest and most welcoming cities in Central Asia — rich in culture, affordable to live in, and home to a growing community of Indian medical students.',
    ),
    facilities: FACILITIES,
    faqs: FAQS,
    featured: true,
    metaTitle: 'MBBS at BITU Uzbekistan — Fees $2$2,900/year | Royal Med Global',
    metaDescription:
      'Study MBBS at Bukhara Innovative Education & Medical University, Uzbekistan. WHO & NMC recognised, English medium, no IELTS/TOEFL, affordable fees.',
    ...(mediaIds['hero-campus.jpg'] ? { cover: mediaIds['hero-campus.jpg'] } : {}),
    ...(gallery.length ? { gallery } : {}),
  })

  // 7. Courses
  const courseSeed = [
    {
      title: 'MBBS (General Medicine)',
      slug: 'mbbs-general-medicine',
      shortName: 'MBBS',
      duration: '6 years',
      level: 'UG',
      description:
        'The flagship programme covering anatomy, physiology, surgery, internal medicine and full clinical training across affiliated hospitals.',
    },
    {
      title: 'Dentistry (BDS)',
      slug: 'dentistry-bds',
      shortName: 'BDS',
      duration: '5 years',
      level: 'UG',
      description:
        'Train as a dental surgeon with hands-on practice in modern dental simulation and practice rooms.',
    },
    {
      title: 'Other Faculties',
      slug: 'other-faculties',
      shortName: 'Other',
      duration: 'Varies',
      level: 'Other',
      description:
        'Pharmacy, Pediatria, Psychology and more — ask our counsellors which programme fits your goals.',
    },
  ] as const

  for (const c of courseSeed) {
    await upsert('courses', c.slug, {
      title: c.title,
      shortName: c.shortName,
      duration: c.duration,
      level: c.level,
      description: c.description,
      university: uniId,
      featured: true,
    })
  }

  // 7b. REPLACE ME — Russia dummy data (country, city, university, course).
  // Images below reuse existing placeholders; swap them from the admin later.
  const russiaId = await upsert('countries', 'russia', {
    title: 'Russia',
    tagline: 'Government medical universities, English-medium MBBS, WHO & NMC recognised',
    description: para(
      'Russia has been a leading destination for Indian medical students for decades. Government medical universities follow a 6-year MBBS programme taught in English with affordable, transparent fees.',
      'Indian students get direct admission after NEET, with no IELTS or TOEFL requirement, and the degrees are recognised by the WHO and listed with the National Medical Commission.',
    ),
    currencyNote: '$1 = about ₹90',
    // flagEmoji intentionally left empty — the auto-flag hook fills it in.
    featured: true,
    ...(mediaIds['campus-gate.jpg'] ? { image: mediaIds['campus-gate.jpg'] } : {}),
  })
  log.push('REPLACE ME: Russia country added with a placeholder image')

  const kazanId = await upsert('cities', 'kazan', {
    title: 'Kazan',
    country: russiaId,
    description:
      'Kazan is a modern, student-friendly city on the Volga river — home to one of the oldest and most respected medical universities in Russia, with a growing Indian student community.',
    ...(mediaIds['bukhara-city.jpg'] ? { image: mediaIds['bukhara-city.jpg'] } : {}),
  })
  log.push('REPLACE ME: Kazan city added with a placeholder image')

  const kazanGallery = KAZAN_GALLERY_FILES.map((f) => mediaIds[f]).filter(Boolean)
  const kazanFacilities = KAZAN_FACILITIES.map((f) => ({
    title: f.title,
    text: f.text,
    ...(mediaIds[f.image] ? { image: mediaIds[f.image] } : {}),
  }))
  const ksmId = await upsert('universities', 'kazan-state-medical-university', {
    title: 'Kazan State Medical University',
    shortName: 'KSMU',
    country: russiaId,
    city: kazanId,
    tagline: 'One of the oldest medical universities in Russia — 200+ years of medical education',
    fees: {
      tuitionPerYear: 4200,
      currency: '$',
      totalTuition: '$25,200',
      totalTuitionINR: '₹22,68,000',
      note: 'Indicative tuition for the full 6-year MBBS programme. Hostel, mess and other charges are separate. Fees are subject to change by the university.',
    },
    duration: '6 Years',
    hospitals: 25,
    recognition: ['WHO', 'NMC'],
    englishMedium: true,
    ieltsRequired: false,
    neetRequired: true,
    about: para(
      'Kazan State Medical University is one of the oldest medical universities in Russia, offering a 6-year English-medium MBBS programme designed for international students.',
      'The university is WHO-listed and recognised by the National Medical Commission, with clinical training across affiliated hospitals in Kazan.',
      'Kazan is a safe, modern and affordable student city with a growing Indian community, making it a comfortable first destination for Indian medical aspirants.',
    ),
    facilities: kazanFacilities,
    faqs: [
      {
        question: 'Is the MBBS degree from Russia recognised in India?',
        answer:
          'Yes. Russian government medical universities are WHO-listed and their degrees are recognised by the National Medical Commission (NMC). After completing MBBS you can appear for the NEXT/FMGE licensing exam to practise in India.',
      },
      {
        question: 'Is NEET required for admission?',
        answer:
          'Yes. As per NMC rules, Indian students must qualify NEET to study MBBS abroad and to be eligible to practise in India later. No IELTS or TOEFL is required.',
      },
      {
        question: 'What is the total cost of the programme?',
        answer:
          'Indicative tuition is $4,200 per year — about ₹22,68,000 in total for the full 6-year programme. Hostel and living costs are separate and affordable.',
      },
    ],
    featured: false,
    metaTitle: 'MBBS in Russia at Kazan State Medical University | Royal Med Global',
    metaDescription:
      'Study MBBS at Kazan State Medical University, Russia. English medium, WHO & NMC recognised, no IELTS/TOEFL, affordable fees.',
    ...(mediaIds['hero-campus.jpg'] ? { cover: mediaIds['hero-campus.jpg'] } : {}),
    ...(kazanGallery.length ? { gallery: kazanGallery } : {}),
  })
  log.push('REPLACE ME: Kazan State Medical University added with placeholder images and indicative fees')

  await upsert('courses', 'mbbs-ksmu', {
    title: 'MBBS (General Medicine)',
    shortName: 'MBBS',
    duration: '6 years',
    level: 'UG',
    description:
      'Six-year English-medium MBBS programme at Kazan State Medical University with clinical training across affiliated hospitals.',
    university: ksmId,
    featured: false,
  })

  // 8. FAQs — rebuilt from scratch so previous copy cannot linger.
  const existingFaqs = await payload.find({ collection: 'faqs', limit: 500 })
  for (const doc of existingFaqs.docs) {
    await payload.delete({ collection: 'faqs', id: String(doc.id) })
  }
  for (const [i, f] of FAQS.entries()) {
    await payload.create({ collection: 'faqs', data: { ...f, category: 'Admission', order: i + 1 } })
  }
  log.push(`Rebuilt ${FAQS.length} FAQs`)

  // 9. REPLACE ME — sample reviews so the homepage section is testable.
  // Swap these for real student reviews from /admin → Testimonials.
  for (const t of SAMPLE_TESTIMONIALS) {
    const found = await payload.find({
      collection: 'testimonials',
      where: { name: { equals: t.name } },
      limit: 1,
    })
    if (found.docs.length) {
      log.push(`Testimonial already present: ${t.name}`)
      continue
    }
    await payload.create({
      collection: 'testimonials',
      data: { ...t, university: uniId, featured: true },
    })
    log.push(`REPLACE ME: sample testimonial created — ${t.name}`)
  }

  return { ok: true, log }
}

runSeed()
  .then(({ log }) => {
    console.log('\nSeed complete:')
    log.forEach((l) => console.log('  - ' + l))
    process.exit(0)
  })
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })