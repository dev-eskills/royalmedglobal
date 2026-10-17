# Admin Content Flow + Reviews + Production Media — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Client can run everything from `/admin` (countries → cities → universities → courses with images); the site renders the country/city/university flow + a reviews section; admin uploads persist in production via Vercel Blob.

**Architecture:** Additive-only changes to an existing Next.js 16 + Payload 3.91 app. Admin layer gains small hooks/fields; frontend gains new components + sections that reuse existing design tokens and cards. Storage adapter is conditional on `BLOB_READ_WRITE_TOKEN`, so local dev is unchanged.

**Tech Stack:** Next.js 16.4.2, Payload 3.91 (MongoDB Atlas adapter), Tailwind 4, `@payloadcms/storage-vercel-blob@^3.91.0`.

**Spec:** `docs/superpowers/specs/2026-10-17-admin-content-flow-design.md`

## Global Constraints

- Additive / surgical edits only. Never touch: header/footer/chrome, homepage hero + existing sections' markup, about/contact/gallery/blogs pages, popup, forms, `/api/enquiries`, existing seed content.
- Reuse existing design language: `brand-*` / `gold-*` tokens, `card-lift`, `reveal`, `SectionHead`, `PageHero`, `rounded-2xl`, `shadow-sm`.
- `src/lib/site.ts` is server-only — client components receive plain serialized props only.
- No commit steps in this plan (user has not asked for commits; verify with `git status`/`git diff --stat` instead).
- No test runner exists — verification = `npm run lint` (i.e. `eslint`), `npm run build`, and dev-server manual checks. Do not add a test framework (YAGNI + user constraint).
- Read the relevant Next 16.4.2 guides in `node_modules/next/dist/docs/01-app/` before writing route/component code (AGENTS.md requirement). Current `revalidate = 60` + `dynamicParams` pattern stays valid (cacheComponents not enabled).

## Review Focus

- DB unreachable → all pages must keep rendering from `fallback.ts`; the new reviews section must fall back, never crash or render an empty shell.
- Country with zero cities / zero universities → sections hide entirely (no empty headings, no `—` rows).
- Testimonial without a photo → initials avatar, never a broken `<img>`.
- Old media docs (filename only, no url) must keep resolving to `/media/...` after the `mediaUrl()` change.
- Country title absent from the flag map → `flagEmoji` stays empty without erroring the save.

---

### Task 1: Admin/data layer

**Files:**
- Create: `src/payload/flags.ts`
- Modify: `src/payload/collections.ts`
- Modify: `src/lib/fallback.ts`

**Interfaces:**
- Consumes: existing `autoSlug` hooks (`collections.ts:11-26`) — must be merged with, not replaced, on Countries.
- Produces:
  - `flagForCountry(title: string): string` from `src/payload/flags.ts`
  - Testimonials field `photo` (upload → media, optional)
  - `Testimonial` fallback docs in `FALLBACK_DOCS.testimonials` with shape `{ id, name, role, quote, rating, university }`

- [ ] **Step 1: Create `src/payload/flags.ts`** — `FLAG_EMOJI` map (lowercase country name → emoji; include: uzbekistan 🇺🇿, russia 🇷🇺, kazakhstan 🇰🇿, kyrgyzstan 🇰🇬, tajikistan 🇹🇯, georgia 🇬🇪, armenia 🇦🇲, azerbaijan 🇦🇿, turkey 🇹🇷, egypt 🇪🇬, china 🇨🇳, philippines 🇵🇭, bangladesh 🇧🇩, nepal 🇳🇵, ukraine 🇺🇦, belarus 🇧🇾, moldova 🇲🇩, romania 🇷🇴) + `flagForCountry` (trim/lowercase, return `''` when unknown).

- [ ] **Step 2: Modify `collections.ts`**
  - Countries: give it its own `hooks` object — `beforeChange: [...autoSlug.beforeChange, flagHook]` where `flagHook` falls back to `originalDoc?.title` and only fills `data.flagEmoji` when empty.
  - Universities: on the `city` field add `filterOptions: ({ data }) => (data?.country ? { country: { equals: data.country } } : true)`.
  - Testimonials: add optional `photo` upload field (`relationTo: 'media'`).

- [ ] **Step 3: Modify `fallback.ts`**
  - Add `flagEmoji: '🇺🇿'` to the `country` fallback doc.
  - Add 3 sample testimonials + `testimonials: [...]` to `FALLBACK_DOCS` (shape above; `university` = `'fallback-university-bitu'`).

- [ ] **Step 4: Verify** — Run `npm run lint`; expect no errors.

### Task 2: Frontend — reviews, cities, country page, homepage

**Files:**
- Create: `src/components/reviews.tsx`
- Modify: `src/components/cards.tsx`
- Modify: `src/app/(site)/countries/[slug]/page.tsx`
- Modify: `src/app/(site)/page.tsx`

**Interfaces:**
- Consumes: `mediaUrl`, `findDocs`, `getSettings` from `src/lib/site.ts` (server side only).
- Produces:
  - `CityCard({ c, count }: { c: Doc; count?: number })` export in `cards.tsx`
  - `Reviews({ reviews }: { reviews: Review[] })` client component where `Review = { id: string; name: string; role?: string; quote: string; rating?: number; universityTitle?: string; photoUrl?: string | null }`
  - Country page stats: universities count, cities count, min `fees.tuitionPerYear`

- [ ] **Step 1: Add `CityCard` to `cards.tsx`** — image (reuse `Img`), title, description clamp, `{count} universities →` line; same card chrome as `CountryCard`. Also in `CountryCard`, render `c.flagEmoji` as a small chip next to the title only when present (old look unchanged otherwise).

- [ ] **Step 2: Create `src/components/reviews.tsx`** (`'use client'`, no `site.ts` import) — scroll-snap row + prev/next buttons + star row from `rating` (gold when filled), initials avatar from `name` when `photoUrl` missing. Section wrapper (eyebrow "Testimonials", title) can live in the homepage instead; component takes just the list.

- [ ] **Step 3: Homepage (`page.tsx`)** — two surgical edits:
  1. In the Promise.all add `findDocs('testimonials', { where: { featured: { equals: true } } })`; compute `countBy` (same logic as `countries/page.tsx:10-14`) and pass `count={countBy[c.id]}` to `CountryCard` in the COUNTRIES section.
  2. Insert `<Reviews reviews={serialized} />` between the UNIVERSITIES section and the APPLY CTA; serialize with `mediaUrl(t.photo)` and populated `t.university?.title`; render nothing when list is empty.

- [ ] **Step 4: Country page (`countries/[slug]/page.tsx`)** — keep hero + overview exactly as-is; ADD:
  - Stats strip (universities count • cities count • `From ${currency}${minFee}/year` when a `tuitionPerYear` exists)
  - Cities grid (`CityCard`, count per city) — hide when no cities
  - Universities grouped by city id with `SectionHead` per city + `UniversityCard` under each; universities without a city go in a trailing bucket; hide when none

- [ ] **Step 5: Verify** — `npm run lint` then `npm run build`; then `npm run dev` and check `/`, `/countries`, `/countries/uzbekistan` render (fallback path also acceptable with DB down).

### Task 3: Vercel Blob storage (conditional)

**Files:**
- Modify: `package.json` (dependency)
- Modify: `src/payload.config.ts`
- Modify: `src/lib/site.ts`

**Interfaces:**
- Consumes: env `BLOB_READ_WRITE_TOKEN` (absent in dev — plugin must stay off).
- Produces: `mediaUrl()` prefers absolute `http(s)` `m.url`, then `/media/{filename}`, then `m.url`.

- [ ] **Step 1: Install** — `npm install @payloadcms/storage-vercel-blob@^3.91.0` (verified version match with payload 3.91).
- [ ] **Step 2: `payload.config.ts`** — import `vercelBlobStorage`; add `plugins: [...]` populated only when the token env var exists (`collections: { media: true }`, `token: process.env.BLOB_READ_WRITE_TOKEN`).
- [ ] **Step 3: `site.ts` `mediaUrl()`** — reorder to: absolute-url check first, then filename → `/media/...`, then url. (Safe: 16 server call-sites checked; fallback `img()` objects only have `url`.)
- [ ] **Step 4: Verify** — `npm run lint` + `npm run build`; confirm dev upload on `/admin` still writes locally (no token set).

### Task 4: Seed — sample reviews + Russia dummy

**Files:**
- Modify: `src/seed/seed.ts`

**Interfaces:**
- Consumes: existing `upsert(collection, slug, data)` helper and `mediaIds` map.
- Produces: idempotent seed of — 3 testimonials (name lookup, skip if exists), country `russia`, city `kazan`, university `kazan-state-medical-university`, course `mbbs-ksmu`.

- [ ] **Step 1: Testimonials block** — after the FAQ rebuild: for each sample review, `payload.find({ collection: 'testimonials', where: { name: { equals } } })`, create only when missing; link `university: uniId`, `featured: true`, `rating` 5/4.
- [ ] **Step 2: Russia data** — via existing `upsert`: country (flagEmoji left empty to exercise the auto-flag hook, tagline, description `para(...)`, image = an existing `mediaIds` placeholder), city Kazan (image placeholder), university KSMU (`featured: false`, fees `tuitionPerYear: 4200`, `totalTuition: '$25,200'`, `totalTuitionINR: '₹22,68,000'`, hospitals 25, recognition `['WHO', 'NMC']`, 6 facilities + 6 gallery images **index-aligned** to avoid the caption-pairing mislabel), course `mbbs-ksmu`.
- [ ] **Step 3: Mark placeholders** — seed log lines contain `REPLACE ME` for every reused placeholder image and for the Russia entry (clearly dummy).
- [ ] **Step 4: Verify** — `npm run lint`; then `npm run seed` (requires `.env` DATABASE_URL) and check the log output.

### Task 5: End-to-end verification + report

- [ ] **Step 1: `npm run lint`** — clean.
- [ ] **Step 2: `npm run build`** — clean.
- [ ] **Step 3: `npm run dev` manual flow** — homepage shows reviews + country counts/flags; `/countries/uzbekistan` shows stats + cities + city-grouped universities (unchanged design otherwise); `/countries/russia` shows the dummy flow; `/universities/kazan-state-medical-university` renders.
- [ ] **Step 4: Admin smoke (profile `admin@royalmedglobal.in`)** — create a test country → flag auto-fills; University form city dropdown filters by selected country; Testimonials form shows the photo field; delete the test country.
- [ ] **Step 5: Report** — `git status` + `git diff --stat`; short summary: kya bana, kya test hua, kya bacha (Vercel Blob token step).
