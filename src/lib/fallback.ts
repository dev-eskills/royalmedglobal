import type { Doc } from './site'

/**
 * Content mirrored from royalmedglobal.in. Used only when the CMS has nothing to
 * return (database unreachable or not seeded yet) so the site is never blank.
 * Once the CMS returns documents it always wins over this.
 */

const img = (filename: string) => ({ url: `/media/${filename}` })

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
  { title: 'Modern Gym', text: 'On-campus gym and fitness facilities for students.' },
  { title: 'Outdoor Stadium', text: 'Outdoor sports ground for athletics and college events.' },
  { title: 'Student Canteen', text: 'Student canteen and mess facilities on campus.' },
  { title: 'On-Campus Hostels', text: 'Secure on-campus hostels for international students.' },
  { title: 'Auditorium & Events', text: 'Auditorium and event spaces for college activities.' },
]

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
]

export const FALLBACK_SETTINGS: Doc = {
  id: 'fallback-settings',
  siteName: 'Royal Med Global',
  tagline: 'Your Trusted Path to MBBS Abroad',
  topBarText: 'Your Trusted Path to MBBS Abroad — 2026 Admissions Open',
  phones: [{ number: '+91 92512 13136' }, { number: '+91 89828 88882' }],
  emails: [{ address: 'royalmedglobal@gmail.com' }],
  address:
    'Office No. 100, Shri Nagar Colony Main, 101 Nikhil Apartment, Near Anand Bazar Square, Indore - 452018',
  whatsappNumber: '919251213136',
  logo: img('logo.png'),
  footerAbout:
    'Royal Med Global helps Indian students secure admission to globally recognised medical universities abroad. We guide you end-to-end — from application and admission to visa and travel.',
}

const country: Doc = {
  id: 'fallback-country-uzbekistan',
  title: 'Uzbekistan',
  slug: 'uzbekistan',
  tagline: 'WHO & NMC recognised, fully English medium, $2,900 per year',
  description: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              text: 'Uzbekistan hosts government-licensed medical universities that are listed by the World Health Organization and recognised by the National Medical Commission, so the degree is valid for practice in India after the licensing exam.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              text: 'The entire MBBS programme is taught in English, tuition is a flat $2,900 per year, and no IELTS or TOEFL is required — which is why it has become a leading destination for Indian medical students.',
            },
          ],
        },
      ],
    },
  },
  currencyNote: '$1 = about ₹90',
  flagEmoji: '🇺🇿',
  featured: true,
  image: img('bukhara-city.jpg'),
}

const city: Doc = {
  id: 'fallback-city-bukhara',
  title: 'Bukhara',
  slug: 'bukhara',
  country: 'fallback-country-uzbekistan',
  description:
    'Bukhara is one of the safest and most welcoming cities in Central Asia — rich in culture, affordable to live in, and home to a growing community of Indian medical students.',
  image: img('campus-gate.jpg'),
}

const university: Doc = {
  id: 'fallback-university-bitu',
  title: 'Bukhara Innovative Education and Medical University',
  slug: 'bitu',
  shortName: 'BITU',
  country: 'fallback-country-uzbekistan',
  city: 'fallback-city-bukhara',
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
  about: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              text: 'Located in the historic city of Bukhara, Uzbekistan, BITU is a government-licensed medical university offering a 6-year MBBS programme designed for international students.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              text: 'With its own teaching hospital on campus, 36 affiliated clinics, modern laboratories and Indian-qualified faculty, it offers a complete environment to train as a doctor.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              text: 'Bukhara is one of the safest and most welcoming cities in Central Asia — rich in culture, affordable to live in, and home to a growing community of Indian medical students.',
            },
          ],
        },
      ],
    },
  },
  facilities: FACILITIES,
  faqs: FAQS,
  gallery: GALLERY_FILES.map(img),
  featured: true,
  cover: img('hero-campus.jpg'),
  metaTitle: 'MBBS at BITU Uzbekistan — Fees $2$2,900/year | Royal Med Global',
  metaDescription:
    'Study MBBS at Bukhara Innovative Education & Medical University, Uzbekistan. WHO & NMC recognised, English medium, no IELTS/TOEFL, affordable fees.',
}

const testimonials: Doc[] = [
  {
    id: 'fallback-testimonial-1',
    name: 'Aarav Sharma',
    role: 'MBBS Student, Batch 2024',
    quote:
      'The counsellors guided me from NEET counselling to my hostel room in Bukhara. Everything they promised on paper is exactly what happened — no hidden charges at all.',
    rating: 5,
    university: 'fallback-university-bitu',
  },
  {
    id: 'fallback-testimonial-2',
    name: 'Priya Verma',
    role: 'MBBS Student, Batch 2025',
    quote:
      'Being the first in my family to go abroad, I was nervous. The team handled my admission letter, visa and travel, and even met us at the airport.',
    rating: 5,
    university: 'fallback-university-bitu',
  },
  {
    id: 'fallback-testimonial-3',
    name: 'Mohammed Irfan',
    role: 'Parent',
    quote:
      'As a parent, transparent fees and honest advice mattered most to me. Royal Med Global explained every cost in writing before we paid anything.',
    rating: 4,
    university: 'fallback-university-bitu',
  },
]

const courses: Doc[] = [
  {
    id: 'fallback-course-mbbs',
    title: 'MBBS (General Medicine)',
    slug: 'mbbs-general-medicine',
    shortName: 'MBBS',
    duration: '6 years',
    level: 'UG',
    description:
      'The flagship programme covering anatomy, physiology, surgery, internal medicine and full clinical training across affiliated hospitals.',
    university: 'fallback-university-bitu',
    featured: true,
  },
  {
    id: 'fallback-course-bds',
    title: 'Dentistry (BDS)',
    slug: 'dentistry-bds',
    shortName: 'BDS',
    duration: '5 years',
    level: 'UG',
    description:
      'Train as a dental surgeon with hands-on practice in modern dental simulation and practice rooms.',
    university: 'fallback-university-bitu',
    featured: true,
  },
  {
    id: 'fallback-course-other',
    title: 'Other Faculties',
    slug: 'other-faculties',
    shortName: 'Other',
    duration: 'Varies',
    level: 'Other',
    description:
      'Pharmacy, Pediatria, Psychology and more — ask our counsellors which programme fits your goals.',
    university: 'fallback-university-bitu',
    featured: true,
  },
]

export const FALLBACK_DOCS: Record<string, Doc[]> = {
  countries: [country],
  cities: [city],
  universities: [university],
  courses,
  faqs: FAQS.map((f, i) => ({ ...f, id: `fallback-faq-${i}`, category: 'Admission', order: i + 1 })),
  testimonials,
  posts: [],
}

/** Media documents are never fallback — mediaUrl() turns each entry into a path. */
export function fallbackFor(collection: string): Doc[] {
  return FALLBACK_DOCS[collection] ?? []
}