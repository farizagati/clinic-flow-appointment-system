# Plan 01 - Resolve dead links, dead pages and empty states

Audience: an implementing agent starting with a clean context. This file is self-contained;
read `AGENTS.md` in the repo root first (rules summarized below).

Source of truth for the problems: `docs/exploratory-finding/` (ids EF-nnn below refer to it).
Do not fix anything outside this plan's scope; other findings have their own future plans.

## Goal

Every link, button and route that a user can reach in the UI either does something meaningful
or no longer exists. No console 404 on load. Empty states explain themselves.

## Project rules that apply (from AGENTS.md)

1. Every interactable element and every asserted element needs a `data-testid`
   (lowercase kebab-case, scoped by page/component).
2. No emojis in docs, comments or commit messages.
3. Keep Tailwind utility classes, HashRouter, React Context, localStorage. Match the surrounding code.
4. No backend, no network-dependent data.
5. No new npm packages.

Also: do not commit or push unless the user asks. If asked to commit, use the `smart-commit`
skill and do not add any AI attribution lines.

## Environment

- Install/run: `npm install` (only if `node_modules` missing), `npm run dev`.
- App URL: `http://localhost:5173/clinic-flow-appointment-system/#/` (base path comes from
  `vite.config.js`; AGENTS.md still says `/clinicflowapp/`, which is wrong, see EF-006).
- Accounts: member `johnyjohnyyespapa@mail.com` / `EatingSugarNoPapa`,
  admin `admin@example.com` / `ThisIsNotAdmin`.
- Reset state: Settings, "Purge Data". Seeded doctors/departments are written to localStorage
  only when the key is absent, so seed-data edits do not reach a browser until purged.
- `package-lock.json` shows an unrelated modification in `git status`; leave it alone.

## Inventory (what is dead)

| # | Item | Findings | Where | Current behavior |
| - | ---- | -------- | ----- | ---------------- |
| 1 | Footer links: Privacy Policy, Terms of Service, Contact Support, Help Center | EF-002, EF-020 | `src/layouts/Layout.jsx` lines 23-26 | `href="#"`; click rewrites URL to `/#`, nothing else; no destination pages exist |
| 2 | Home "Learn More" button | EF-001, EF-003 | `src/pages/Home.jsx` line 53 | `<button>` with no handler |
| 3 | "Download Medical Records" button | EF-048 | `src/pages/UserSettings.jsx` line 380 | `<button>` with no handler |
| 4 | `favicon.ico` request | EF-005 | `index.html` (no `<link rel="icon">`, no `public/`) | 404 plus console error on every load |
| 5 | Doctor dropdown empty with no explanation | EF-025 | `src/pages/BookAppointment.jsx` lines 215-237 | Empty `<select>`, user only gets "Please select a doctor" |
| 6 | Empty appointment list still shows pagination | EF-030 | `src/pages/MyAppointments.jsx` line 395 (`pagination-container`) | "Showing 0 to 0 of 0 results" plus page button "1" |

Verified by script that these are the only `href="#"` anchors and the only `<button>` elements
without `onClick`/submit (apart from the date-picker day buttons, which spread `buttonProps`).

## Decisions (defaults chosen; change only if the owner says otherwise)

| Decision | Default | Rejected alternative |
| -------- | ------- | -------------------- |
| Footer destinations | Create four small public pages (one shared component) | Delete the four anchors (smaller, but removes realistic footer navigation tests may want) |
| Unknown routes | Keep the existing catch-all redirect to `/` (documented in `04-routing-and-guards.md`); no 404 page | Add a NotFound page (changes behavior existing tests may rely on) |
| Medical records format | JSON via `Blob` + temporary anchor | PDF/CSV libraries (violates rule 5) |
| Favicon | `<link rel="icon" href="data:,">` (blank icon, no new file) | Real SVG in `public/` |
| Empty doctor list | Inline hint text under the select | Add seed doctors for Northside/Dental/Orthopedics (also valid, see Phase 3 option) |

## Phase 1 - Footer links and destination pages (items 1)

Files: `src/pages/InfoPage.jsx` (new), `src/App.jsx`, `src/layouts/Layout.jsx`.

1. Create `src/pages/InfoPage.jsx`: one component that takes a `slug` prop and renders a title
   and a short plain-text body from a local object keyed by slug. Slugs and routes:

   | Slug / route path | Title | Footer link test id |
   | ----------------- | ----- | ------------------- |
   | `privacy-policy` | Privacy Policy | `footer-privacy-link` |
   | `terms-of-service` | Terms of Service | `footer-terms-link` |
   | `contact-support` | Contact Support | `footer-support-link` |
   | `help-center` | Help Center | `footer-help-link` |

   Body copy: two or three plain sentences each, stating this is a demo environment with
   localStorage-only data. No emojis, no invented legal text, no real contact details.
   Required test ids: `info-page` (wrapper), `info-title` (h1), `info-body` (content).
   Use one `<h1>`; do not nest another `<main>` (the layout already provides it, see EF-008).
2. In `src/App.jsx` add four public routes inside the `Layout` route (before the `*` route),
   no guard:
   `<Route path="privacy-policy" element={<InfoPage slug="privacy-policy" />} />` and so on.
3. In `src/layouts/Layout.jsx` replace the four `<a href="#">` with react-router `<Link to="/privacy-policy">`
   etc. Keep the existing class names; add the test ids from the table. Import `Link`.
4. Do not touch other footer markup (copyright span already has `footer-text`).

Acceptance:
- Each footer link navigates to its route, `info-title` matches the link text, URL is
  `/#/privacy-policy` etc., works logged out and logged in as member and admin.
- No `href="#"` remains in `src/` (`grep -rn 'href="#"' src` returns nothing).
- Direct load of each URL renders the page (HashRouter).

## Phase 2 - Dead buttons (items 2, 3)

### 2a. Home "Learn More" (`src/pages/Home.jsx`)

- Add `data-testid="home-learn-more-btn"` and `onClick` that scrolls to the existing section
  with id `home-features`:
  `document.getElementById('home-features')?.scrollIntoView({ behavior: 'smooth' })`.
- Do not use `href="#home-features"` or `window.location.hash`; both fight HashRouter.
- Acceptance: click scrolls the "Application Features" heading into view, URL unchanged.

### 2b. "Download Medical Records" (`src/pages/UserSettings.jsx`)

- Add `onClick={handleDownloadRecords}` to the existing `download-records-btn` button.
- Handler builds an object with:
  - `profile`: `currentUser` fields except `profilePic` (the avatar can be megabytes of base64);
    the session object already has no password.
  - `appointments`: `appointments.filter(a => a.userId === currentUser.id)` from `useAuth()`
    (add `appointments` to the existing destructure).
  - `exportedAt`: `new Date().toISOString()`.
  Serialize with `JSON.stringify(data, null, 2)`, create a `Blob` of type `application/json`,
  `URL.createObjectURL`, click a temporary `<a download="clinicflow-records-<currentUser.id>.json">`,
  then `URL.revokeObjectURL`.
- On completion call the existing `setSuccess('Medical records downloaded')` so
  `settings-success` shows feedback (clear `error` first, like the other handlers).
- Admin has no appointments of their own; export still works with an empty list.
- Acceptance: file downloads, parses as JSON, contains no `password` and no `profilePic` keys;
  success banner appears; button works for member and admin.

## Phase 3 - Resource 404 and empty states (items 4, 5, 6)

### 3a. Favicon (`index.html`)

Add `<link rel="icon" href="data:," />` inside `<head>`. Acceptance: reload shows no request to
`/favicon.ico` and the console has no 404 error on `/#/`, `/#/login`, `/#/register`.

### 3b. Empty doctor list (`src/pages/BookAppointment.jsx`)

- When `clinic` and `department` are both selected and `filteredDoctors.length === 0`, render a
  short hint under the doctor select, with `data-testid="appointment-doctor-empty"`, for example
  "No doctors available for this clinic and department."
- Keep the select and the existing required-field validation unchanged (do not disable it; the
  "Please select a doctor" error must still be reachable).
- Acceptance: Northside + Orthopedics shows the hint; Downtown + Cardiology does not; changing
  either select to a valid pair removes it.
- Optional follow-up (needs owner approval because tests may rely on empty combinations):
  add seed doctors for `clinic-3`, `dental`, `orthopedics` in `src/data/mockData.js`.

### 3c. Empty My Appointments (`src/pages/MyAppointments.jsx`)

- When `filteredAppointments.length === 0`, do not render the "Showing 0 to 0 of 0 results"
  line and page buttons (the table already shows "You have no booked appointments." or
  "No matching appointments found.").
- Keep the `pagination-container` element mounted if tests may locate it; hide its contents only.
  Confirm by grepping `test-result/` and any spec files for `pagination-container` before deciding;
  if referenced, keep the wrapper and hide children.
- Acceptance: empty state shows no page "1" button; with 1 or more rows pagination appears as before;
  search/filter that yields zero results behaves the same as the empty state.

## Out of scope (do not touch here)

Booking rules and id collisions (EF-026, EF-027, EF-029, EF-036), registration/authorization
(EF-041, EF-057), validation gaps (EF-012, EF-013, EF-021, EF-045, EF-061), dark-theme contrast
(EF-034), mobile nav (EF-054), nested `<main>` (EF-008), icon accessible names (EF-004, EF-015),
unrelated missing `data-testid` (EF-003 remainder, EF-016, EF-035).

## Verification checklist (run before reporting done)

1. `npm run build` completes without errors.
2. `grep -rn 'href="#"' src` is empty.
3. Browser pass on `/#/` logged out, member and admin: footer links all land on their page;
   Learn More scrolls; Settings download works for member and admin.
4. Console shows no errors on `/#/`, `/#/login`, `/#/register`, each new info page.
5. New or changed elements each have a `data-testid` from this plan (query the DOM; none missing).
6. `git status` shows only the files listed in this plan (plus docs updates below).

## Documentation follow-up

- Under each resolved finding in `docs/exploratory-finding/` add one line
  `Resolution: <what changed, file>`; do not delete the finding text.
- Add the new routes and test ids to the AGENTS.md "File Structure" list (`InfoPage.jsx`) and
  fix the base path mentioned in EF-006 only if the user asks for that doc change.
