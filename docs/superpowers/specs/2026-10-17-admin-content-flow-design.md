# Admin-Driven Content Flow + Reviews + Production Media — Design

Date: 2026-10-17
Status: Approved (user approved the plan in session)

## Intent

The client is a non-technical "dealer": they will add new countries, cities,
universities and courses from `/admin` as the business expands — picking a
destination, uploading images, entering fees, facilities and courses — and the
public site must present that hierarchy automatically:

Homepage → country image card → country page (total universities, cities with
images, universities grouped by city) → university page (already exists).

Two gaps stop this today:

1. Nothing on the site shows **cities** (no list, no images), and there is no
   **reviews/testimonials** section (the collection exists but is dead).
2. Admin-uploaded images do not persist in production (local disk on Vercel is
   ephemeral), so the client's uploads would silently vanish.

## Goals

- Reviews section on the homepage, fully admin-managed (Testimonials collection).
- Country page: stats strip + cities section (with images) + universities
  grouped by city, all driven by admin data.
- Homepage country cards: university count + flag emoji.
- Admin ergonomics: flag auto-fills from the country name; university form's
  city dropdown is filtered by the selected country.
- Production media storage via Vercel Blob (conditional — dev unaffected).
- Dummy test data: Russia (Kazan + Kazan State Medical University + course) and
  3 sample reviews, all seeded idempotently and clearly replaceable.

## Non-goals

- No redesign of existing pages/sections; no refactors of working code.
- Hardcoded homepage sections (hero, why-us, process, mission/vision, services)
  stay hardcoded for now.
- No roles/access-control enforcement, no enquiry email notifications, no
  revalidation hooks (keep 60s ISR), no drafts/preview.

## Anti-goals (failure conditions)

- Breaking the existing premium look or structure; touching header/footer,
  popup, forms, the enquiries API, or existing seed content.
- A reviews UI that drags server-only modules (mongoose/sharp) into the client
  bundle.
- Blob changes that break existing `/media/...` URLs (public files + fallback).

## Constraints

- Next.js 16.4.2 (read `node_modules/next/dist/docs` guides before writing code),
  Payload CMS 3.91, MongoDB Atlas. No test runner in the repo — verification is
  `npm run lint`, `npm run build` and a manual dev-server flow test.
- Additive / surgical edits only. Reuse existing design tokens: `brand-*`,
  `gold-*`, `card-lift`, `reveal`, `SectionHead`, `rounded-2xl`, `shadow-sm`.
- `src/lib/site.ts` is server-only; client components receive pre-serialized
  props (e.g. resolved photo URL strings).

## Decided (user's calls)

- Reviews live on the homepage ("badhiya sa" slider), admin-managed.
- Client must be able to add country → city → university (+ courses, images,
  fees, facilities) through simple admin forms; site shows it automatically.
- Flag should be added automatically when creating a country.
- Dummy Russia entry + end-to-end test after the admin is fixed.

## My calls (builder)

- Testimonials get one optional `photo` upload field; UI falls back to initials.
- Auto-flag = name→emoji lookup map (common MBBS destinations), fills only when
  `flagEmoji` is empty, manual override always possible.
- `Universities.city` uses `filterOptions` on `data.country` (verified API in
  Payload 3.91 types).
- Vercel Blob adapter is conditional on `BLOB_READ_WRITE_TOKEN`; `mediaUrl()`
  prefers absolute URLs, then `/media/{filename}` (16 server call-sites checked
  — safe).
- Russia dummy: real university name (Kazan State Medical University) with
  indicative values, `featured: false` so BITU keeps the homepage hero; images
  reuse existing generic photos as placeholders (seed log marks REPLACE ME).
- `fallback.ts` gains `flagEmoji` for Uzbekistan + `testimonials` entries (DB
  down ⇒ reviews still render). Russia is NOT added to fallback (it is dummy).
- Reviews placement: after the home Universities section, before the Apply CTA.

## Left to the builder

- Exact sample-review copy and Russia description text; choice of placeholder
  images among existing media (keep gallery/facilities index counts aligned to
  avoid the existing caption pairing mislabeling).
