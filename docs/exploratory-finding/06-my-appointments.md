# 06 - My Appointments (member)

Area: `/#/my-appointments`
Explored: 2026-10-13, Chrome via DevTools MCP, logged in as the seeded member.
Source reviewed: `src/pages/MyAppointments.jsx`, `src/contexts/AuthContext.jsx`

Severity scale: High (blocks a flow or loses data), Medium (wrong behavior, workaround exists),
Low (cosmetic, polish, convention violation).

Status of this file: in progress. Covered so far: empty state, list after booking, cancel,
search, status and doctor filters, pagination. Still to cover: date range filter, department
filter with the duplicate "Cardiology", loading state, long notes display, narrow viewport.

## Verified working (no finding)

- Empty state text: "You have no booked appointments."
- After booking, the row appears with `YYYY-MM-DD at HH:MM`, clinic, doctor, department, status badge `Pending`.
- Cancelling a `Pending` appointment sets status to `Cancelled` immediately and removes the Cancel button from that row.

---

## EF-028 - Cancel appointment has no confirmation and cannot be undone

- Severity: Medium
- Type: UX / destructive action
- Steps:
  1. Have a `Pending` appointment in My Appointments.
  2. Click "Cancel" on its row.
- Expected: Confirmation step ("Cancel this appointment?"), or an undo path.
- Actual: Status flips to `Cancelled` on first click with no dialog (no `role="dialog"` or `alertdialog` present). A cancelled appointment has no action available to restore or rebook it from this page.
- Source: `onClick={() => cancelAppointment(apt.id)}` directly in the row.

## EF-029 - Cancelling one appointment cancels every appointment with the same id

- Severity: High
- Type: Data integrity (consequence of EF-027)
- Steps:
  1. Create three appointments with the same id using the rapid-confirm repro in `05-booking-flow.md` (EF-027).
  2. In My Appointments click "Cancel" on only one of the three duplicate-id rows.
- Expected: Only that row changes.
- Actual: All three become `Cancelled`; storage shows all `apt-1791862581570` entries as `Cancelled`. `cancelAppointment` maps over the array and updates every row whose `id` matches.
- Also: console logs `Encountered two children with the same key, apt-1791862581570` (React duplicate key error) on render, since rows use `key={apt.id}`.
- Automation note: The duplicate key console error appears only once duplicates exist; useful for "no console errors" assertions in booking tests that click fast.

## Test data note for the sections below

14 extra appointments (`apt-seed-0` .. `apt-seed-13`) were written directly into
`clinicflow_appointments` in localStorage and the page reloaded, to get 18 rows (5 per page, 4 pages),
mixed statuses (Pending / Approved / Cancelled), dates 2026-10-14 onward, and one appointment (`apt-seed-3`)
with notes containing `<b>bold</b> & "quotes"` plus 300 characters. Findings below were observed on that data.

## EF-031 - Search does not trim whitespace

- Severity: Low
- Type: Search
- Steps: In "Search appointments...", type `  dental  ` (leading and trailing spaces), wait for the debounce.
- Expected: Same 3 results as `dental`.
- Actual: "No matching appointments found." (0 results). `dental` and `DENTAL` both return 3 (case-insensitive works).
- Source: `debouncedQuery.trim()` is used only for the emptiness check; the comparison uses the untrimmed `q`.

## EF-032 - Search matches hidden notes but not date, time or status

- Severity: Low
- Type: Search / expectation mismatch
- Observed queries (18 appointments):
  - `Jones` -> 8 results (doctor), `dental` -> 3 (doctor / department)
  - `bold` -> 1 result: the match is inside the appointment notes, which are not displayed anywhere in this table, so the user sees a row with no visible match.
  - `pending` -> 0, `2026-10-14` -> 0, `13:00` -> 0 even though rows with that status, date and time exist.
  - `Downtown Cardiology` -> 0 (terms across different fields do not combine).
- Source: only `doctor`, `clinic`, `department`, `notes` are tested.
- Automation note: Good boundary-value material, but "search by date/status" is not supported although the placeholder is generic ("Search appointments...").

## EF-033 - Status filter options do not match the statuses the app produces

- Severity: Medium
- Type: Functional / naming
- Actual: Status checkboxes are `Confirmed`, `Scheduled`, `Pending`, `Cancelled`. The app only ever stores `Pending`, `Approved`, `Cancelled` (see `AuthContext`). `Scheduled` can never match any row. `Confirmed` is special-cased in code to also match `Approved`, but the row badge shows `Approved`, not `Confirmed`.
- Impact: Users looking for "Approved" appointments see no such option; "Scheduled" is a dead filter.
- Source: `MyAppointments.jsx` initial `status` object and `isMatch` logic.

## EF-034 - Pagination footer and page numbers are unreadable in dark theme

- Severity: Medium
- Type: Visual / accessibility
- Steps: Use dark theme (default here), open My Appointments with more than 5 rows.
- Actual: The "Showing X to Y of Z results" numbers and the inactive page buttons (2, 3, 4) render `rgb(241, 245, 249)` text on an `rgb(248, 249, 255)` background: contrast ratio about 1.04:1, effectively invisible. Only the active page button (white on green, 6.4:1) is readable. The table card itself is dark (`rgb(30, 41, 59)`), so the footer strip keeps a light background that is not themed.
- Automation note: Text is in the DOM and assertable, but screenshot/visual comparison and a11y contrast checks will flag it.

## EF-035 - "Cancelled" status checkbox in the filter panel has no `data-testid`

- Severity: Low
- Type: Project convention violation (AGENTS.md rule 1)
- Actual: `status-checkbox-confirmed`, `status-checkbox-scheduled`, `status-checkbox-pending` exist; the fourth checkbox (Cancelled) has no test id.

## EF-036 - Pagination renders ghost rows when duplicate appointment ids exist

- Severity: High (only reachable after EF-027 or any same-millisecond id collision)
- Type: Rendering / data integrity
- Steps:
  1. Have three appointments sharing id `apt-1791862581570` (EF-027) plus 15 others (18 total, 5 per page).
  2. Open My Appointments and click through pages 1 to 4.
- Expected: 5 rows on pages 1 to 3, 3 rows on page 4, each matching the "Showing X to Y of 18" text.
- Actual (DOM `data-testid="appointment-item-*"` counts): page 1 shows 7 rows, page 2 shows 9, page 3 shows 9, page 4 shows 7. Four rows with the duplicate id stay mounted on every page next to the real rows for that page. The footer text still says "Showing 16 to 18 of 18 results" while 7 rows are displayed.
- Cause: rows use `key={apt.id}`; React logs "Encountered two children with the same key ... duplicated and/or omitted".
- Automation note: Row-count assertions per page will fail intermittently depending on which page was visited first. This is a strong "flaky because of app data" teaching case.

## EF-030 - Empty list still shows pagination controls with "Showing 0 to 0 of 0 results"

- Severity: Low
- Type: UX
- Actual: With no appointments the footer reads "Showing 0 to 0 of 0 results", a page button "1" is rendered, and Previous/Next are disabled. Slightly noisy but not broken.
- Automation note: The page "1" button exists in the empty state, so `getByRole('button', { name: '1' })` does not imply there is data.
- Resolution: `pagination-container` is no longer rendered when the filtered list is empty (`src/pages/MyAppointments.jsx`).
