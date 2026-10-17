# Admin "Data Entry" View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One admin screen (`/admin/data-entry`, sidebar item "Data Entry") where country → city → university (+ image, fees, course) are added/edited/deleted in a single nested form; the separate Countries / Cities / Universities / Courses items disappear from the sidebar.

**Architecture:** A custom Payload admin root view (client React component) registered in `payload.config.ts` (`admin.components.views` + `beforeNavLinks`). It talks to the Payload REST API same-origin with the admin session cookie and reuses the existing collection hooks (`autoSlug`, `autoFlag`). The four collections are hidden from the admin (`admin.hidden: true` — removes nav + routes); full-field editing (richText, SEO, facilities, FAQs, gallery…) stays reachable per-row through Payload's native document drawer (`useDocumentDrawer` with `overrideEntityVisibility: true`). Site code and DB schema untouched.

**Tech Stack:** Next.js 16.4.2, Payload 3.91 (`@payloadcms/ui` client exports, sonner toast), Tailwind-free admin styling via Payload CSS classes.

**Spec:** user conversation (Hinglish) 2026-10-17 — "Data Entry ke naam se ek hi jagah: country → city → university → image, add more buttons, sab kuch usi ke andar; yeh 3 sidebar me mat dikhao". Design calls by implementer: drawer-based full editing, find-or-create by title, cascade delete city→universities→courses.

## Global Constraints

- Site code untouched: `src/app/(site)/**`, `src/components/**` (except new `src/components/admin/**`), `src/lib/**`, `src/seed/**`.
- No DB schema or data migration; only `admin` config changes on the 4 collections + `payload.config.ts`.
- No commits; no new npm dependencies; `npm run lint` and `npm run build` stay clean.
- After admin component registration: `npm run generate:importmap` is REQUIRED (views/nav components won't render otherwise).
- Sidebar items Testimonials / Faqs / Posts / Enquiries / Media / Users unchanged.
- PowerShell 5.1: `$home`/`$HOME` is read-only; use `$hpg` style names. Kill any stale dev server (pid file `%TEMP%\rmg-dev3.pid`) before dev verification.
- Auth for verification: WebSession flow — POST `/api/users/login` `{email: 'admin@royalmedglobal.in', password: 'Royal@123'}` → cookie `payload-token` → GET admin HTML with session.

## Review Focus

- Typing a country name that already exists (any case, extra spaces) must REUSE it — never create a duplicate country.
- Same for a city inside the selected country (compare trimmed, case-insensitive).
- Empty university title → save blocked with a clear message; no half-created docs for that row.
- Blank tuition per year → sent as `0` (number), never `''`/`NaN` (payload field is `required: number`).
- Delete city → its universities AND their courses go too (after confirm); delete university → its courses go too.
- Site pages render unchanged after hiding the collections (hidden only affects admin nav/routes, not Local API/site reads).

---

### Task 1: Register view + nav link + hide the 4 collections

**Files:**
- Create: `src/components/admin/DataEntryLink.tsx`
- Create: `src/components/admin/DataEntryView.tsx` (skeleton for now)
- Modify: `src/payload.config.ts` (admin block)
- Modify: `src/payload/collections.ts` (add `admin.hidden: true` to Countries, Cities, Universities, Courses)
- Regenerate: `src/app/(payload)/admin/importMap.js` via `npm run generate:importmap`

**Interfaces:**
- Consumes: nothing.
- Produces: route `/admin/data-entry` rendering `DataEntryView`; nav link "Data Entry" at top of sidebar; collections `countries|cities|universities|courses` fully hidden.

- [ ] **Step 1: Create the nav link component** — client component rendering `<a className="nav__link" href="/admin/data-entry">Data Entry</a>` (Payload admin nav uses `nav__link` / `nav__link-label` classes).

- [ ] **Step 2: Create the view skeleton** — client component with stable marker heading `<h1>Data Entry</h1>` and a line "Country, city, university — sab yahin se add karo." (markers used by later HTML checks).

- [ ] **Step 3: Register both in `payload.config.ts`**

```ts
admin: {
  user: 'users',
  importMap: { baseDir: path.resolve(dirname) },
  components: {
    beforeNavLinks: ['/components/admin/DataEntryLink'],
    views: {
      dataEntry: {
        Component: '/components/admin/DataEntryView#default',
        path: '/data-entry',
      },
    },
  },
},
```

- [ ] **Step 4: Hide the 4 collections** — add `admin: { hidden: true }` alongside the existing admin options (keep `useAsTitle`; merge objects, don't replace).

- [ ] **Step 5: Regenerate import map + lint + build**

Run: `npm run generate:importmap; npm run lint; npm run build`
Expected: importMap.js gains `DataEntryView` + `DataEntryLink` entries; lint and build clean.

- [ ] **Step 6: Dev verification (authed)**

Kill stale dev server, start `npm run dev`, then with a PowerShell `WebSession` logged in via REST:
- GET `/admin` → HTML contains `Data Entry` and contains `href="/admin/data-entry"`; does NOT contain `href="/admin/collections/countries"` (and same for cities/universities/courses).
- GET `/admin/data-entry` → contains `Data Entry`, `Country, city, university`.

---

### Task 2: Pure helpers + country/city add flow

**Files:**
- Create: `src/components/admin/dataEntryHelpers.ts` (pure, React-free — unit-testable with tsx)
- Modify: `src/components/admin/DataEntryView.tsx`
- Test: throwaway tsx one-liner checks (pattern used in this repo; no test framework added)

**Interfaces:**
- Consumes: Task 1 route/nav.
- Produces:
  - `type Option = { id: string | number; title: string }`
  - `matchByTitle(list: Option[], name: string): Option | null` — trim + lowercase exact match.
  - `buildCountryPayload(title: string): { title: string }`
  - `buildCityPayload(title: string, countryId: string | number, imageId?: string | number): { title: string; country: string | number; image?: string | number }`
  - REST conventions used by ALL later tasks: list `GET /api/<collection>?limit=200&depth=0&sort=title`, filtered `?where[country][equals]=<id>`, create `POST /api/<collection>` JSON, update `PATCH /api/<collection>/<id>`, delete `DELETE /api/<collection>/<id>`, upload `POST /api/media` FormData `{ file, alt }`.

- [ ] **Step 1: tsx check (RED)** — `matchByTitle([{id:1,title:'India'}], '  india ')` should return the option; run before helpers exist → module-not-found FAIL.

- [ ] **Step 2: Implement helpers** (`matchByTitle`, `buildCountryPayload`, `buildCityPayload`; drop empty/undefined keys from payloads).

- [ ] **Step 3: tsx check (GREEN)** — same command passes: match with ' india ' → `{id:1}`, non-match → `null`, `buildCityPayload('Delhi', 'c1')` → `{title:'Delhi', country:'c1'}` (no `image` key).

- [ ] **Step 4: Build the country/city UI in `DataEntryView.tsx`**

Country: `<input list>` + `<datalist>` of fetched countries. On blur/change: `matchByTitle` → existing ⇒ `countryId` set, fetch and render its tree (Task 3 fills universities); no match ⇒ treat as NEW country (its cities start empty). Show a flag hint via `FLAG_EMOJI` map import from `@/payload/flags` (already exists) — display only, the DB value is filled by the existing `autoFlag` hook on save.

City rows: each has a title input (+ datalist of this country's existing cities so an old city can be reused), optional image upload placeholder, REMOVE button (only while unsaved/new), and an "＋ Add another city" button appending an empty row. A single bottom **Save** button orchestrates: resolve/create country via `matchByTitle` on a FRESH list fetch (dedupe), then create/update cities (skip empty names), then `toast.success` + refetch tree so returned ids stick.

- [ ] **Step 5: Manual dev check** — login + `/admin/data-entry` renders country input; type existing "Uzbekistan" → city "Bukhara" appears in the tree.

---

### Task 3: University + fees + course blocks, image upload, delete, full-edit drawers

**Files:**
- Modify: `src/components/admin/DataEntryView.tsx`
- Create (only if view exceeds ~450 lines): `src/components/admin/DataEntryUniversityBlock.tsx`
- Test: throwaway tsx checks

**Interfaces:**
- Consumes: helpers + REST conventions from Task 2.
- Produces:
  - `type UniForm = { id?: string | number; title: string; shortName: string; coverId?: string | number; tuitionPerYear: string; currency: string; totalTuition: string; totalTuitionINR: string; duration: string }`
  - `type CourseForm = { id?: string | number; title: string; duration: string; description: string }`
  - `buildUniversityPayload(u: UniForm, countryId: string | number, cityId: string | number): object` — sends `fees.tuitionPerYear = Number(u.tuitionPerYear) || 0`, omits empty optional strings, includes `cover` only when set.
  - `buildCoursePayload(c: CourseForm, universityId: string | number): { title: string; duration?: string; description?: string; university: string | number }`

- [ ] **Step 1: tsx checks (RED→GREEN)** — `buildUniversityPayload({...u, tuitionPerYear: ''}, 'c','k')` → `fees.tuitionPerYear === 0`; `'4200'` → `4200`; blank `totalTuition` key absent; `buildCoursePayload({title:'MBBS', duration:'', description:''}, 'u1')` → `{title:'MBBS', university:'u1'}`.

- [ ] **Step 2: University block UI** — inside each city row, list existing universities (thumbnail from `cover.url`, title) each with: **Full edit** (opens `useDocumentDrawer({ collectionSlug: 'universities', id, overrideEntityVisibility: true })`; `onSave` → refetch tree), **Delete** (`confirm()` → DELETE courses `?where[university][equals]=<id>` then DELETE university; `toast` result), and an "＋ Add another university" button appending the field form: title, shortName, image file input (uploads immediately: `POST /api/media` FormData `{ file, alt: title || 'university' }` → store `coverId`, show thumbnail + spinner/error), tuitionPerYear, currency (default `$`), totalTuition, totalTuitionINR, duration (default `6 Years`), then course sub-fields: course title (placeholder `MBBS`), duration, description (textarea).

- [ ] **Step 3: Save orchestration** — after Task 2's country/city resolve loop, for each university row: empty title ⇒ collect validation error and skip; existing id ⇒ PATCH; else POST; then for each course: create/PATCH with `university` id. One `toast` summary (`Saved`, or per-error list). Then refetch tree so ids/thumbnails update. Errors from the API (e.g., duplicate slug) surface their message in the toast.

- [ ] **Step 4: City delete with cascade** — confirm text warns universities + courses bhi delete honge; DELETE each university (courses first) then the city via REST; refetch tree.

- [ ] **Step 5: Dev smoke (mirrors the UI's exact REST calls)** — with logged-in WebSession via tsx script: create country `India` → run same find-or-create path again → still ONE India; create city `Delhi`; create university `AIIMS Delhi` with fees; create course `MBBS`; upload a 1×1 PNG to `/api/media`; duplicate-name university in a second city returns 400 (toast path); then delete university, city, country; confirm DB ends clean (no orphans).

---

### Task 4: Full verification + site regression + review

**Files:**
- No new files; verification only. Update ledger `.superpowers/sdd/2026-10-17-admin-content-flow/progress.md`.

- [ ] **Step 1: Lint + build** — `npm run lint; npm run build` both clean.

- [ ] **Step 2: Site regression (hidden collections must not break the site)** — dev server: `/` (reviews + flags), `/countries/uzbekistan`, `/countries/russia`, `/universities/kazan-state-medical-university` all render the same markers as the previous session.

- [ ] **Step 3: Admin checks (authed HTML)** — `/admin` nav: `Data Entry` present, `href="/admin/collections/{countries,cities,universities,courses}"` absent; `/admin/data-entry` renders; `/admin/collections/universities` no longer lists documents (hidden).

- [ ] **Step 4: Request code review** (superpowers:requesting-code-review) over the uncommitted diff; fix Critical/Important; ledger + final report.

---

## Self-Review

- User requirements covered: single screen with country→city→university→image (Tasks 2–3), "add more" buttons (Task 2 Step 4, Task 3 Step 2), fees/course/details in the same flow (Task 3), 3+1 collections out of the sidebar (Task 1), flag auto-detect preserved (existing hook + display hint), edit/delete inside the same screen incl. full-field drawer (Task 3), simplicity preserved (no DB/site changes).
- Review Focus items each have an owning task test: dedupe (Task 2 Steps 1–3 + Task 3 Step 5), blank title block (Task 3 Step 3), tuition→0 (Task 3 Step 1), cascade delete (Task 3 Steps 4–5), site regression (Task 4 Step 2).
- Type consistency: share one `Option`/REST convention block in Task 2; Task 3 consumes it; no naming drift (matchByTitle/build*Payload used consistently).
- Known limitation documented: two universities with the same title in different cities collide on the auto slug (existing `autoSlug` behavior) — surfaced as a toast error; slug can be adjusted via Full edit drawer.
