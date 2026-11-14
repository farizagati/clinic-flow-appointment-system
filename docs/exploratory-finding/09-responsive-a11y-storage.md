# 09 - Cross-cutting: responsive, accessibility, theme, storage

Area: Layout shell and behaviors that apply across pages.
Explored: 2026-10-13, Chrome via DevTools MCP. Mobile checks at a 500 px wide viewport (the tool's minimum for the 390 px request); desktop at 1280 px.
Source reviewed: `src/layouts/Navigation.jsx` (via DOM), `src/contexts/ThemeContext.jsx` (via storage keys)

Severity scale: High (blocks a flow or loses data), Medium (wrong behavior, workaround exists),
Low (cosmetic, polish, convention violation).

## Verified working (no finding)

- No horizontal page scroll at 500 px on Home, Login, Register, Book Appointment, My Appointments, Settings (wide tables sit inside a scroll container).
- `<html lang="en">` and a viewport meta tag are present.
- All `<img>` elements on the checked routes have non-empty `alt`.
- Theme toggle switches `dark` / `light` on `<html>` and flips the button label between `light_mode` and `dark_mode`; choice is stored.
- Malformed stored data does not crash the app: an appointment record with only `id`, `userId`, `status` renders as a row with empty date ("at") and no console error.

---

## EF-054 - Primary navigation disappears on small screens and there is no menu

- Severity: Medium
- Type: Responsive / navigation
- Steps: Log in as member, set viewport width to 500 px, open any page.
- Expected: A hamburger/drawer or condensed nav exposing Book Appointment and My Appointments.
- Actual: `nav-home`, `nav-book-appointment`, `nav-my-appointments` and `nav-user-profile` are `display: none`. Only brand, theme toggle, settings icon and Logout remain; there is no menu button. From Settings a member cannot reach Book Appointment or My Appointments through the header (only the brand link to Home, then the Home CTA).
- Automation note: Mobile-viewport tests that click `nav-my-appointments` will fail with "element not visible".

## EF-055 - Document title is the same on every route

- Severity: Low
- Type: Accessibility / SEO / test observability
- Actual: `document.title` is `ClinicFlow Appointment System` on `/`, `/login`, `/register`, `/book-appointment`, `/my-appointments`, `/settings`.
- Impact: Screen reader users and browser history/tab lists cannot tell pages apart. Tests asserting on the page title cannot distinguish routes.

## EF-056 - Theme preference uses an un-namespaced storage key; the origin is shared with other apps

- Severity: Low
- Type: Storage hygiene
- Actual:
  - App data keys are prefixed `clinicflow_*`, but the theme is stored under the generic key `theme`. The origin `localhost:5173` also held keys written by other local projects (a `kb_theme`, `kb_*` data keys and an auth token key from another app), so a generic key can collide with them.
  - "Purge Data" does not remove `theme` (only the six `clinicflow_*` keys), so the theme survives a reset while everything else is cleared.
- Automation note: Running several sandboxes on the same port in sequence shares localStorage. Tests that assume a clean origin should clear storage explicitly.

## EF-057 - Authorization relies on a role value stored in editable localStorage

- Severity: Info (security observation for a client-only sandbox)
- Type: Authorization
- Steps: As a logged-in member, set `role` to `admin` inside the `clinicflow_currentUser` JSON and reload on `/#/admin-dashboard`.
- Actual: Admin Dashboard opens; header shows "Johny Member (admin)". Guards in `App.jsx` read the role from the same editable object, and no check against `clinicflow_users` is made.
- Note: Consistent with the "no backend" rule in AGENTS.md. Listed because it is the natural target for security-minded test cases, alongside EF-041 (self-register as admin).
- Original session value was restored after the check.

## EF-058 - Heading levels skip or are out of order on several pages

- Severity: Low
- Type: Accessibility
- Observed outlines:
  - `/login`: `h1 ClinicFlow` then `h3 Test Credentials` (no `h2`).
  - `/admin-dashboard`: `h1`, then `h3 Administration Menu`, then section `h2` after it.
  - `/settings`: `h3 warning Danger Zone` includes the icon ligature text `warning` in its accessible name (see EF-015).

## EF-059 - Long unbroken notes overflow the review card

- Severity: Low
- Type: Layout
- Steps:
  1. In Book Appointment, enter 500 characters with no spaces in "Reason / Notes".
  2. Click "Review Appointment".
- Actual: The notes text is rendered on one line, extends to about x = 6260 px while the card ends at x = 1280 px, and is simply cut off at the card edge; there is no wrapping (`overflow-wrap: normal`, `word-break: normal`) and no way to read the full text on this page. The value is still stored in full.
- Note: Normal prose with spaces wraps correctly (400 characters of text with spaces displayed fine earlier).
