'use client'

import { toast, useDocumentDrawer } from '@payloadcms/ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { flagForCountry } from '@/payload/flags'
import {
  buildCityPayload,
  buildCountryPayload,
  buildCoursePayload,
  buildUniversityPayload,
  matchByTitle,
  type Option,
} from './dataEntryHelpers'

type AnyDoc = Record<string, unknown> & {
  id: string | number
  title: string
  url?: string
  docs?: AnyDoc[]
  doc?: AnyDoc
  errors?: Array<{ message?: string }>
  message?: string
  shortName?: string
  duration?: string
  description?: string
  fees?: {
    tuitionPerYear?: number
    currency?: string
    totalTuition?: string
    totalTuitionINR?: string
  }
  image?: AnyDoc | string | number
  cover?: AnyDoc | string | number
  city?: AnyDoc | string | number
  country?: AnyDoc | string | number
  university?: AnyDoc | string | number
}

const msg = (e: unknown) => (e instanceof Error ? e.message : String(e))

const relId = (v: unknown): string | number | undefined => {
  if (typeof v === 'object' && v !== null) return (v as AnyDoc).id
  return (v as string | number) ?? undefined
}

const api = async (path: string, init?: RequestInit) => {
  const isJson = typeof init?.body === 'string'
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: isJson ? { 'Content-Type': 'application/json', ...(init?.headers || {}) } : init?.headers,
  })
  const json = (await res.json().catch(() => null)) as AnyDoc | null
  if (!res.ok) {
    if (res.status === 404 && (init?.method || 'GET').toUpperCase() === 'DELETE') return {} as AnyDoc
    const message = json?.errors?.[0]?.message || json?.message || `Request failed (${res.status})`
    throw new Error(message)
  }
  return json as AnyDoc
}

const docId = (json: AnyDoc): string | number => {
  const id = json?.doc?.id
  if (id === undefined || id === null) throw new Error('Server se id nahi mili — dobara Save kar dena')
  return id
}

const listAll = async (collection: string, query = ''): Promise<AnyDoc[]> => {
  const json = await api(`/${collection}?limit=200&depth=1&sort=title${query}`)
  return (json?.docs as AnyDoc[]) ?? []
}

const uploadImage = async (file: File, alt: string) => {
  const fd = new FormData()
  fd.append('_payload', JSON.stringify({ alt: alt || 'upload' }))
  fd.append('file', file)
  const res = await fetch('/api/media', { method: 'POST', body: fd })
  const json = (await res.json().catch(() => null)) as AnyDoc | null
  if (!res.ok) throw new Error(json?.errors?.[0]?.message || 'Upload failed')
  return (json?.doc ?? json) as AnyDoc
}

type UniRow = {
  key: number
  id?: string | number
  title: string
  shortName: string
  coverId?: string | number
  coverUrl?: string
  tuitionPerYear: string
  currency: string
  totalTuition: string
  totalTuitionINR: string
  duration: string
  courseId?: string | number
  courseTitle: string
  courseDuration: string
  courseDesc: string
}

type CityRow = {
  key: number
  id?: string | number
  title: string
  imageId?: string | number
  imageUrl?: string
  universities: UniRow[]
}

const emptyUni = (key: number): UniRow => ({
  key,
  title: '',
  shortName: '',
  tuitionPerYear: '',
  currency: '$',
  totalTuition: '',
  totalTuitionINR: '',
  duration: '6 Years',
  courseTitle: '',
  courseDuration: '',
  courseDesc: '',
})

const emptyCity = (key: number): CityRow => ({ key, title: '', universities: [emptyUni(key * 100 + 1)] })

const inputStyle: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150, #d1d5db)',
  borderRadius: 6,
  padding: '7px 10px',
  width: '100%',
  background: 'var(--theme-input-bg, #fff)',
  fontSize: 14,
}

const btnStyle: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150, #d1d5db)',
  borderRadius: 6,
  padding: '6px 12px',
  cursor: 'pointer',
  background: 'var(--theme-elevation-50, #f3f4f6)',
  fontSize: 13,
}

const primaryBtn: React.CSSProperties = { ...btnStyle, background: '#065f46', color: '#fff', border: 'none', fontWeight: 600 }
const dangerBtn: React.CSSProperties = { ...btnStyle, color: '#b91c1c' }

const box: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-100, #e5e7eb)',
  borderRadius: 10,
  padding: 16,
  marginTop: 14,
  background: 'var(--theme-elevation-0, #fff)',
}

const row: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }
const label: React.CSSProperties = { fontSize: 12, opacity: 0.65, display: 'block', marginBottom: 3 }

const Field: React.FC<{ title: string; children: React.ReactNode; grow?: boolean }> = ({ title, children, grow }) => (
  <div style={{ flex: grow ? '1 1 160px' : '0 1 140px', minWidth: grow ? 160 : 120 }}>
    <span style={label}>{title}</span>
    {children}
  </div>
)

const DrawerEdit: React.FC<{ collection: string; id: string | number; onSaved: () => void }> = ({
  collection,
  id,
  onSaved,
}) => {
  const [DocumentDrawer, DocumentToggler] = useDocumentDrawer({
    collectionSlug: collection,
    id,
    overrideEntityVisibility: true,
  })
  return (
    <>
      <DocumentDrawer onSave={onSaved} />
      <DocumentToggler style={btnStyle}>✎ Full edit</DocumentToggler>
    </>
  )
}

const ImageUpload: React.FC<{
  value?: string
  onUploaded: (id: string | number, url: string) => void
  nameHint: string
}> = ({ value, onUploaded, nameHint }) => {
  const [busy, setBusy] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {value ? <img src={value} alt="" style={{ height: 34, borderRadius: 6 }} /> : null}
      <label style={{ ...btnStyle, display: 'inline-block' }}>
        {busy ? 'Uploading…' : value ? 'Change image' : '＋ Image'}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (!file) return
            setBusy(true)
            try {
              const doc = await uploadImage(file, nameHint)
              onUploaded(doc.id, doc.url ?? '')
              toast.success('Image uploaded')
            } catch (err) {
              toast.error(msg(err))
            } finally {
              setBusy(false)
            }
          }}
        />
      </label>
    </div>
  )
}

const DataEntryView: React.FC = () => {
  const keyRef = useRef(1000)
  const nextKey = () => (keyRef.current += 1)

  const [countries, setCountries] = useState<Option[]>([])
  const [countryTitle, setCountryTitle] = useState('')
  const [countryId, setCountryId] = useState<string | number | null>(null)
  const [countryImageId, setCountryImageId] = useState<string | number | undefined>()
  const [countryImageUrl, setCountryImageUrl] = useState<string | undefined>()
  const [cities, setCities] = useState<CityRow[]>([])
  const [saving, setSaving] = useState(false)
  const citiesRef = useRef<CityRow[]>([])

  useEffect(() => {
    citiesRef.current = cities
  }, [cities])

  useEffect(() => {
    listAll('countries')
      .then((docs) => setCountries(docs.map((d) => ({ id: d.id, title: d.title }))))
      .catch(() => {})
  }, [])

  const loadTree = useCallback(async (country: Option, preserveUnsaved = false) => {
    const [countryDocs, cityDocs, uniDocs, courseDocs] = await Promise.all([
      listAll('countries', `&where[id][equals]=${country.id}`),
      listAll('cities', `&where[country][equals]=${country.id}`),
      listAll('universities', `&where[country][equals]=${country.id}`),
      listAll('courses'),
    ])
    const courseByUni = new Map<string | number, AnyDoc>()
    for (const course of courseDocs) {
      const uid = relId(course.university)
      if (uid !== undefined && !courseByUni.has(uid)) courseByUni.set(uid, course)
    }
    const countryDoc = countryDocs[0]
    setCountryId(country.id)
    setCountryTitle(country.title)
    setCountryImageId(undefined)
    setCountryImageUrl(
      countryDoc && typeof countryDoc.image === 'object' && countryDoc.image ? countryDoc.image.url : undefined,
    )
    const next: CityRow[] = cityDocs.map((cd) => ({
      key: nextKey(),
      id: cd.id,
      title: cd.title,
      imageId: relId(cd.image),
      imageUrl: typeof cd.image === 'object' && cd.image ? cd.image.url : undefined,
      universities: uniDocs
        .filter((u) => relId(u.city) === cd.id)
        .map((u) => {
          const course = courseByUni.get(u.id)
          const uni = emptyUni(nextKey())
          return {
            ...uni,
            id: u.id,
            title: u.title ?? '',
            shortName: u.shortName ?? '',
            coverId: relId(u.cover),
            coverUrl: typeof u.cover === 'object' && u.cover ? u.cover.url : undefined,
            tuitionPerYear: u.fees?.tuitionPerYear != null ? String(u.fees.tuitionPerYear) : '',
            currency: u.fees?.currency ?? '$',
            totalTuition: u.fees?.totalTuition ?? '',
            totalTuitionINR: u.fees?.totalTuitionINR ?? '',
            duration: u.duration ?? '6 Years',
            courseId: course?.id,
            courseTitle: course?.title ?? '',
            courseDuration: course?.duration ?? '',
            courseDesc: course?.description ?? '',
          }
        }),
    }))
    if (preserveUnsaved) {
      for (const row of citiesRef.current) {
        if (!row.id) next.push(row)
        else {
          const target = next.find((c) => c.id === row.id)
          if (target) {
            const unsavedUnis = row.universities.filter((u) => !u.id)
            if (unsavedUnis.length) target.universities = [...target.universities, ...unsavedUnis]
          }
        }
      }
    }
    setCities(next)
  }, [])

  const refreshTree = async () => {
    try {
      const fresh = await listAll('countries')
      setCountries(fresh.map((d) => ({ id: d.id, title: d.title })))
      const current = countryId ? fresh.find((d) => d.id === countryId) : matchByTitle(fresh, countryTitle)
      if (current) await loadTree(current, true)
    } catch (e) {
      toast.error(msg(e))
    }
  }

  const onCountryChange = async (value: string) => {
    setCountryTitle(value)
    const match = matchByTitle(countries, value)
    if (match) {
      try {
        await loadTree(match)
      } catch (e) {
        toast.error(msg(e))
      }
    } else {
      setCountryId(null)
      setCities([])
      setCountryImageId(undefined)
      setCountryImageUrl(undefined)
    }
  }

  const patchCity = (key: number, patch: Partial<CityRow>) =>
    setCities((prev) => prev.map((c) => (c.key === key ? { ...c, ...patch } : c)))

  const patchUni = (cityKey: number, uniKey: number, patch: Partial<UniRow>) =>
    setCities((prev) =>
      prev.map((c) =>
        c.key === cityKey
          ? { ...c, universities: c.universities.map((u) => (u.key === uniKey ? { ...u, ...patch } : u)) }
          : c,
      ),
    )

  const deleteUniversity = async (cityKey: number, uni: UniRow) => {
    if (!uni.id) {
      setCities((prev) =>
        prev.map((c) => (c.key === cityKey ? { ...c, universities: c.universities.filter((u) => u.key !== uni.key) } : c)),
      )
      return
    }
    if (!window.confirm(`"${uni.title}" delete karni hai?`)) return
    try {
      const courses = await listAll('courses', `&where[university][equals]=${uni.id}`)
      for (const c of courses) await api(`/courses/${c.id}`, { method: 'DELETE' })
      await api(`/universities/${uni.id}`, { method: 'DELETE' })
      setCities((prev) =>
        prev.map((c) => (c.key === cityKey ? { ...c, universities: c.universities.filter((u) => u.key !== uni.key) } : c)),
      )
      toast.success('University deleted')
    } catch (e) {
      toast.error(msg(e))
    }
  }

  const deleteCity = async (city: CityRow) => {
    if (!city.id) {
      setCities((prev) => prev.filter((c) => c.key !== city.key))
      return
    }
    if (!window.confirm(`"${city.title}" aur uski saari universities + courses delete honge. Theek hai?`)) return
    try {
      for (const uni of city.universities) {
        if (!uni.id) continue
        const courses = await listAll('courses', `&where[university][equals]=${uni.id}`)
        for (const c of courses) await api(`/courses/${c.id}`, { method: 'DELETE' })
        await api(`/universities/${uni.id}`, { method: 'DELETE' })
      }
      await api(`/cities/${city.id}`, { method: 'DELETE' })
      setCities((prev) => prev.filter((c) => c.key !== city.key))
      toast.success('City deleted')
    } catch (e) {
      toast.error(msg(e))
    }
  }

  const save = async () => {
    if (!countryTitle.trim()) {
      toast.error('Country ka naam likho')
      return
    }
    setSaving(true)
    const errors: string[] = []
    const idUpdates: Array<{ cityKey: number; uniKey?: number; id: string | number; courseId?: string | number }> =
      []
    try {
      const freshCountries = await listAll('countries')
      const existing = matchByTitle(freshCountries, countryTitle)
      let cid = existing?.id
      if (existing) {
        cid = existing.id
        if (countryImageId) {
          await api(`/countries/${cid}`, {
            method: 'PATCH',
            body: JSON.stringify(buildCountryPayload(countryTitle, countryImageId)),
          })
        }
      } else {
        const created = await api('/countries', {
          method: 'POST',
          body: JSON.stringify(buildCountryPayload(countryTitle, countryImageId)),
        })
        cid = docId(created)
      }
      setCountryId(cid!)

      const existingCities = await listAll('cities', `&where[country][equals]=${cid}`)

      for (const city of cities) {
        if (!city.title.trim()) {
          if (city.universities.some((u) => u.title.trim())) errors.push('City ka naam khali hai (upar wali row)')
          continue
        }
        try {
          let cityId = city.id
          if (!cityId) {
            const reuse = matchByTitle(
              existingCities.map((d) => ({ id: d.id, title: d.title })),
              city.title,
            )
            if (reuse) {
              cityId = reuse.id
              if (city.imageId) {
                await api(`/cities/${cityId}`, {
                  method: 'PATCH',
                  body: JSON.stringify(buildCityPayload(city.title, cid!, city.imageId)),
                })
              }
            } else {
              const created = await api('/cities', {
                method: 'POST',
                body: JSON.stringify(buildCityPayload(city.title, cid!, city.imageId)),
              })
              cityId = docId(created)
              existingCities.push({ id: cityId, title: city.title })
            }
          } else {
            await api(`/cities/${cityId}`, {
              method: 'PATCH',
              body: JSON.stringify(buildCityPayload(city.title, cid!, city.imageId)),
            })
          }
          if (cityId !== city.id) idUpdates.push({ cityKey: city.key, id: cityId })

          for (const uni of city.universities) {
            if (!uni.title.trim()) {
              errors.push(`University ka naam khali hai (city: ${city.title})`)
              continue
            }
            let uniId = uni.id
            const uniPayload = buildUniversityPayload(uni, cid!, cityId)
            if (uniId) {
              await api(`/universities/${uniId}`, { method: 'PATCH', body: JSON.stringify(uniPayload) })
            } else {
              const created = await api('/universities', { method: 'POST', body: JSON.stringify(uniPayload) })
              uniId = docId(created)
              idUpdates.push({ cityKey: city.key, uniKey: uni.key, id: uniId })
            }
            let courseId = uni.courseId
            const hadCourse = Boolean(courseId)
            if (uni.courseTitle.trim()) {
              const coursePayload = buildCoursePayload(
                { title: uni.courseTitle, duration: uni.courseDuration, description: uni.courseDesc },
                uniId,
              )
              if (courseId) {
                await api(`/courses/${courseId}`, { method: 'PATCH', body: JSON.stringify(coursePayload) })
              } else {
                const created = await api('/courses', { method: 'POST', body: JSON.stringify(coursePayload) })
                courseId = docId(created)
              }
            }
            if (!hadCourse && courseId !== undefined) {
              idUpdates.push({ cityKey: city.key, uniKey: uni.key, id: uniId, courseId })
            }
          }
        } catch (e) {
          errors.push(`"${city.title}": ${msg(e)}`)
        }
      }
    } catch (e) {
      errors.push(msg(e))
    }

    if (idUpdates.length) {
      setCities((prev) =>
        prev.map((c) => {
          const cityUpdate = idUpdates.find((u) => u.cityKey === c.key && u.uniKey === undefined)
          const uniUpdates = idUpdates.filter((u) => u.cityKey === c.key && u.uniKey !== undefined)
          let nextCity = cityUpdate ? { ...c, id: cityUpdate.id } : c
          if (uniUpdates.length) {
            nextCity = {
              ...nextCity,
              universities: nextCity.universities.map((u) => {
                const matches = uniUpdates.filter((x) => x.uniKey === u.key)
                if (!matches.length) return u
                const id = matches[matches.length - 1].id
                const courseIds = matches.map((x) => x.courseId).filter((c) => c !== undefined && c !== null)
                const courseId = courseIds.length ? courseIds[courseIds.length - 1] : u.courseId
                return { ...u, id, courseId }
              }),
            }
          }
          return nextCity
        }),
      )
    }

    try {
      const fresh = await listAll('countries')
      setCountries(fresh.map((d) => ({ id: d.id, title: d.title })))
      if (errors.length === 0) {
        const updated = matchByTitle(fresh, countryTitle)
        if (updated) await loadTree(updated)
      }
    } catch {
      /* refresh is best-effort */
    }

    setSaving(false)

    if (errors.length) toast.error(errors.join(' | '))
    else toast.success('Saved')
  }

  const flag = flagForCountry(countryTitle)
  const cityOptions = cities.map((c) => c.title).filter(Boolean)
  const isKnown = Boolean(countryId) || Boolean(matchByTitle(countries, countryTitle))

  return (
    <div style={{ padding: '2rem', maxWidth: 980 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Data Entry</h1>
      <p style={{ opacity: 0.7, marginBottom: 20 }}>
        Country, city, university, fees aur course — sab yahin se. Purani country ka naam likho to uska pura data
        khud load ho jayega.
      </p>

      <div style={box}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Field title="Country (likho ya choose karo)" grow>
            <input
              list="de-countries"
              style={inputStyle}
              placeholder="e.g. India"
              value={countryTitle}
              onChange={(e) => onCountryChange(e.target.value)}
            />
          </Field>
          <datalist id="de-countries">
            {countries.map((c) => (
              <option key={c.id} value={c.title} />
            ))}
          </datalist>
          <Field title="Country image (optional)">
            <ImageUpload
              value={countryImageUrl}
              nameHint={countryTitle}
              onUploaded={(id, url) => {
                setCountryImageId(id)
                setCountryImageUrl(url)
              }}
            />
          </Field>
        </div>
        {flag ? (
          <div style={{ marginTop: 8, fontSize: 15 }}>
            {flag} <span style={{ opacity: 0.65, fontSize: 12 }}>flag auto-detect</span>
          </div>
        ) : null}
        {isKnown ? (
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.65 }}>
            Ye country pehle se hai — neeche uska data load hai. Naya university/city add karte jao.
          </div>
        ) : null}
      </div>

      {cities.map((city) => (
        <div key={city.key} style={box}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Field title="City" grow>
              <input
                list={`de-cities-${city.key}`}
                style={inputStyle}
                placeholder="e.g. Delhi"
                value={city.title}
                onChange={(e) => patchCity(city.key, { title: e.target.value })}
              />
            </Field>
            <datalist id={`de-cities-${city.key}`}>
              {cityOptions.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <Field title="City image (optional)">
              <ImageUpload
                value={city.imageUrl}
                nameHint={city.title}
                onUploaded={(id, url) => patchCity(city.key, { imageId: id, imageUrl: url })}
              />
            </Field>
            <div style={{ display: 'flex', gap: 8 }}>
              {city.id ? <DrawerEdit collection="cities" id={city.id} onSaved={() => void refreshTree()} /> : null}
              <button type="button" style={dangerBtn} onClick={() => deleteCity(city)}>
                {city.id ? 'Delete city' : 'Remove'}
              </button>
            </div>
          </div>

          {city.universities.map((uni) => (
            <div
              key={uni.key}
              style={{
                border: '1px dashed var(--theme-elevation-150, #d1d5db)',
                borderRadius: 8,
                padding: 12,
                marginTop: 10,
              }}
            >
              <div style={row}>
                <Field title="University" grow>
                  <input
                    style={inputStyle}
                    placeholder="e.g. AIIMS Delhi"
                    value={uni.title}
                    onChange={(e) => patchUni(city.key, uni.key, { title: e.target.value })}
                  />
                </Field>
                <Field title="Short name">
                  <input
                    style={inputStyle}
                    placeholder="e.g. AIIMS"
                    value={uni.shortName}
                    onChange={(e) => patchUni(city.key, uni.key, { shortName: e.target.value })}
                  />
                </Field>
                <Field title="University image">
                  <ImageUpload
                    value={uni.coverUrl}
                    nameHint={uni.title}
                    onUploaded={(id, url) => patchUni(city.key, uni.key, { coverId: id, coverUrl: url })}
                  />
                </Field>
              </div>

              <div style={row}>
                <Field title="Tuition / year">
                  <input
                    type="number"
                    style={inputStyle}
                    placeholder="e.g. 4200"
                    value={uni.tuitionPerYear}
                    onChange={(e) => patchUni(city.key, uni.key, { tuitionPerYear: e.target.value })}
                  />
                </Field>
                <Field title="Currency">
                  <input
                    style={inputStyle}
                    value={uni.currency}
                    onChange={(e) => patchUni(city.key, uni.key, { currency: e.target.value })}
                  />
                </Field>
                <Field title="Total tuition">
                  <input
                    style={inputStyle}
                    placeholder="e.g. $25,200"
                    value={uni.totalTuition}
                    onChange={(e) => patchUni(city.key, uni.key, { totalTuition: e.target.value })}
                  />
                </Field>
                <Field title="Total in ₹">
                  <input
                    style={inputStyle}
                    placeholder="e.g. ₹22,68,000"
                    value={uni.totalTuitionINR}
                    onChange={(e) => patchUni(city.key, uni.key, { totalTuitionINR: e.target.value })}
                  />
                </Field>
                <Field title="Duration">
                  <input
                    style={inputStyle}
                    value={uni.duration}
                    onChange={(e) => patchUni(city.key, uni.key, { duration: e.target.value })}
                  />
                </Field>
              </div>

              <div style={row}>
                <Field title="Course" grow>
                  <input
                    style={inputStyle}
                    placeholder="e.g. MBBS"
                    value={uni.courseTitle}
                    onChange={(e) => patchUni(city.key, uni.key, { courseTitle: e.target.value })}
                  />
                </Field>
                <Field title="Course duration">
                  <input
                    style={inputStyle}
                    placeholder="e.g. 6 Years"
                    value={uni.courseDuration}
                    onChange={(e) => patchUni(city.key, uni.key, { courseDuration: e.target.value })}
                  />
                </Field>
                <Field title="Course details (optional)" grow>
                  <input
                    style={inputStyle}
                    value={uni.courseDesc}
                    onChange={(e) => patchUni(city.key, uni.key, { courseDesc: e.target.value })}
                  />
                </Field>
                <div style={{ display: 'flex', gap: 8 }}>
                  {uni.id ? <DrawerEdit collection="universities" id={uni.id} onSaved={() => void refreshTree()} /> : null}
                  <button type="button" style={dangerBtn} onClick={() => deleteUniversity(city.key, uni)}>
                    {uni.id ? 'Delete' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            style={{ ...btnStyle, marginTop: 10 }}
            onClick={() => patchCity(city.key, { universities: [...city.universities, emptyUni(nextKey())] })}
          >
            ＋ Add another university in {city.title || 'this city'}
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
        <button
          type="button"
          style={btnStyle}
          onClick={() => setCities((prev) => [...prev, emptyCity(nextKey())])}
        >
          ＋ Add another city
        </button>
        <button type="button" style={primaryBtn} disabled={saving} onClick={() => void save()}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default DataEntryView
