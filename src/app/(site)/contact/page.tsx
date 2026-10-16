import { getSettings, waLink } from '@/lib/site'
import { SectionHead } from '@/components/section'
import { LeadForm } from '@/components/forms'
import { Icon, WhatsAppIcon } from '@/components/icons'

export const revalidate = 60

export default async function ContactPage() {
  const settings = await getSettings()
  const phones: string[] = (settings?.phones ?? []).map((p: { number: string }) => p?.number).filter(Boolean)
  const email = settings?.emails?.[0]?.address
  const wa = waLink(
    settings,
    'Hi Royal Med Global, I want to know more about MBBS admission at BITU Uzbekistan.',
  )

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
      <SectionHead
        eyebrow="Contact"
        title="Book Free Counselling"
        sub="Fill the form — our admission counsellor calls you back within 24 hours."
      />

      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <div id="apply" className="reveal rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-extrabold text-brand-900">Get Free Admission Guidance</h2>
          <p className="mt-1 text-sm text-gray-500">Our counsellor calls you back within 24 hours.</p>
          <div className="mt-5">
            <LeadForm page="contact" />
          </div>
        </div>

        <div className="space-y-4">
          {phones.length ? (
            <div className="reveal rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Icon name="phone" className="h-4 w-4 text-brand-600" /> Phone
              </p>
              {phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/\s/g, '')}`}
                  className="mt-2 block text-lg font-bold text-brand-700 transition hover:text-brand-800"
                >
                  {p}
                </a>
              ))}
            </div>
          ) : null}

          {email ? (
            <div className="reveal rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Icon name="mail" className="h-4 w-4 text-brand-600" /> Email
              </p>
              <a href={`mailto:${email}`} className="mt-2 block font-semibold text-brand-700 transition hover:text-brand-800">
                {email}
              </a>
            </div>
          ) : null}

          {settings?.address ? (
            <div className="reveal rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Icon name="pin" className="h-4 w-4 text-brand-600" /> Office
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{settings.address}</p>
            </div>
          ) : null}

          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="reveal flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] p-5 text-center font-bold text-white transition hover:bg-[#1ebe5d]"
          >
            <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}