export type Option = { id: string | number; title: string }

/** Case-insensitive, whitespace-trimmed exact title match. */
export const matchByTitle = (list: Option[], name: string): Option | null => {
  const norm = name.trim().toLowerCase()
  if (!norm) return null
  return list.find((item) => item.title.trim().toLowerCase() === norm) ?? null
}

const drop = (obj: Record<string, unknown>): Record<string, unknown> => {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== '' && value !== undefined && value !== null) out[key] = value
  }
  return out
}

export const buildCountryPayload = (title: string, imageId?: string | number) =>
  drop({ title: title.trim(), image: imageId })

export const buildCityPayload = (
  title: string,
  countryId: string | number,
  imageId?: string | number,
) => drop({ title: title.trim(), country: countryId, image: imageId })

export type UniForm = {
  title: string
  shortName?: string
  coverId?: string | number
  tuitionPerYear: string
  currency?: string
  totalTuition?: string
  totalTuitionINR?: string
  duration?: string
}

export const buildUniversityPayload = (
  u: UniForm,
  countryId: string | number,
  cityId: string | number,
) =>
  drop({
    title: u.title.trim(),
    shortName: u.shortName,
    cover: u.coverId,
    country: countryId,
    city: cityId,
    duration: u.duration,
    fees: drop({
      tuitionPerYear: Number(u.tuitionPerYear) || 0,
      currency: u.currency || '$',
      totalTuition: u.totalTuition,
      totalTuitionINR: u.totalTuitionINR,
    }),
  })

export type CourseForm = { title: string; duration?: string; description?: string }

export const buildCoursePayload = (c: CourseForm, universityId: string | number) =>
  drop({
    title: c.title.trim(),
    duration: c.duration,
    description: c.description,
    university: universityId,
  })
