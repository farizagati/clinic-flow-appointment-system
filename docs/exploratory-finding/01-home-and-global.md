# 01 - Home page and global findings

Area: Landing page (`/#/`), layout shell, global resources.
Explored: 2026-10-13, Chrome via DevTools MCP, viewport default desktop, logged out.
URL base: `http://localhost:5173/clinic-flow-appointment-system/`

Severity scale: High (blocks a flow or loses data), Medium (wrong behavior, workaround exists),
Low (cosmetic, polish, convention violation).

---

## EF-001 - "Learn More" button on Home does nothing

- Severity: Low
- Type: Functional / dead control
- Steps:
  1. Open `/#/` while logged out.
  2. Click "Learn More" in the hero section.
- Expected: Scrolls to "Application Features" section or navigates somewhere meaningful.
- Actual: Nothing happens. URL unchanged, scroll position stays 0 (page is scrollable: document height 1191 vs viewport 982).
- Automation note: Click succeeds without error, so a test asserting "something happened" has no observable outcome to assert on.
- Resolution: Button now smooth-scrolls to `home-features` and has `data-testid="home-learn-more-btn"` (`src/pages/Home.jsx`).

## EF-002 - Footer links (Privacy Policy, Terms of Service, Contact Support, Help Center) are dead

- Severity: Low
- Type: Functional / dead link
- Steps:
  1. Open `/#/`.
  2. Click any footer link.
- Expected: Navigates to a page or opens a modal.
- Actual: All four have `href="#"`. Click navigates to `/clinic-flow-appointment-system/#` (hash becomes empty), page content unchanged.
- Note: The URL changes from `/#/` to `/#`, which under HashRouter is a distinct location string; the router still renders Home, but the address bar is altered with no visible change.
- Resolution: Links now route to `/#/privacy-policy`, `/#/terms-of-service`, `/#/contact-support`, `/#/help-center`, rendered by the new `src/pages/InfoPage.jsx` (`src/layouts/Layout.jsx`, `src/App.jsx`).

## EF-003 - Missing `data-testid` on several interactable / asserted elements (Home, global)

- Severity: Low
- Type: Project convention violation (AGENTS.md rule 1)
- Elements found without `data-testid` on Home:
  - Theme toggle button (accessible name is the icon ligature text `light_mode`)
  - "Learn More" button
  - Headings: "Application Features" (h2), "1. Find a Specialist", "2. Choose a Time", "3. Secure Your Slot" (h3)
  - Footer links: Privacy Policy, Terms of Service, Contact Support, Help Center
- Method: DOM query over `a, button, input, select, textarea, h1, h2, h3, [role=button]` filtering on missing `data-testid`.
- Resolution (partial): "Learn More" (`home-learn-more-btn`) and the four footer links (`footer-privacy-link`, `footer-terms-link`, `footer-support-link`, `footer-help-link`) now have test ids. Theme toggle and headings remain open.

## EF-004 - Theme toggle has a meaningless accessible name

- Severity: Low
- Type: Accessibility
- Actual: The theme toggle button's accessible name is `light_mode` (Material Symbols ligature text), not a human label such as "Switch to dark theme".
- Impact: Screen readers read the raw ligature name; locator strategies based on role + name (`getByRole('button', { name: ... })`) must use the ligature string, which flips to `dark_mode` when toggled.

## EF-005 - `favicon.ico` request returns 404 on every page load

- Severity: Low
- Type: Console error / resource
- Actual: `GET http://localhost:5173/favicon.ico` returns 404 and logs `Failed to load resource: the server responded with a status of 404` in the console on every load.
- Note: Request goes to the server root, not under the Vite base path. `index.html` has no `<link rel="icon">`.
- Automation note: Tests that assert "no console errors" will fail on a clean load of every page.
- Resolution: Added `<link rel="icon" href="data:," />` so the browser no longer requests `/favicon.ico` (`index.html`).

## EF-062 - Home call-to-action label does not adapt to existing members and reuses one test id for two roles

- Severity: Low
- Type: Copy / test id naming
- Observed (seeded accounts, fresh state and with existing appointments):
  - Logged out: "Book Your First Appointment" (`home-book-cta`) goes to `/#/login`.
  - Member: same label, goes to `/#/book-appointment`, even when the member already has many appointments ("first" is wrong).
  - Admin: label changes to "Go to Admin Dashboard" but the `data-testid` is still `home-book-cta`, and it goes to `/#/admin-dashboard`.
- Automation note: A locator on `home-book-cta` means three different destinations depending on session; assertions on its label need the role context.

## EF-006 - AGENTS.md documents a base path that does not match the app

- Severity: Low
- Type: Documentation mismatch
- Actual: AGENTS.md states base path `/clinicflowapp/` and app URL `http://localhost:5173/clinicflowapp/#/`. `vite.config.js` sets `base: '/clinic-flow-appointment-system/'`. The documented URL does not work.
- Impact: Anyone (or any automation suite) following AGENTS.md uses a wrong base URL.
- Related: AGENTS.md says the stack is "intentionally lean" but `date-fns` and `react-day-picker` are loaded (see network log), and the file structure list omits `CustomDatePicker.jsx`, `CustomDateRangePicker.jsx`, `ReviewAppointment.jsx`, `utils/statusUtils.js`.
