# 03 - Admin Dashboard

Area: `/#/admin-dashboard` (logged in as `admin@example.com`)
Explored: 2026-10-13, Chrome via DevTools MCP, desktop viewport.
Source reviewed: `src/pages/AdminDashboard.jsx`, `src/contexts/AuthContext.jsx`

Severity scale: High (blocks a flow or loses data), Medium (wrong behavior, workaround exists),
Low (cosmetic, polish, convention violation).

Status of this file: in progress. Sections covered so far: Stats, Users Database,
Departments, Doctors, Appointments (approve/cancel). Still to cover: responsive layout,
Add Doctor duplicate/whitespace validation.

## Seed data coverage (observation)

- Seeded doctors: Dr. Sarah Smith (General Practice, Downtown), Dr. Marcus Jones (Cardiology, Downtown),
  Dr. Emily Williams (Pediatrics, Westside). Dental and Orthopedics departments and the Northside clinic
  have no doctor. Relevant to the booking cascade (empty-state handling), tracked in the booking file.
- Doctors tab "Add Doctor" with name + Dental + Westside saved correctly (`dr-<timestamp>`, `departmentId: dental`,
  `clinicId: clinic-2`). Test data left behind: "Dr. Test Dentist".

## Verified working (no finding)

- Admin login lands on `/#/admin-dashboard`; header shows "System Admin (admin)".
- Stats tab on a fresh state shows Total Appointments 0, Pending 0, Approved 0, Cancelled 0, Total Users 2.
- Users Database lists the 2 seeded accounts with name, email, role.
- Departments tab lists 5 seeded departments (cardiology, dental, general, pediatrics, orthopedics).
- Adding a valid, unique department appends a row and persists to `clinicflow_departments`.

---

## EF-012 - Duplicate department names are accepted

- Severity: Medium
- Type: Validation / data integrity
- Steps:
  1. Admin Dashboard, Departments tab, "Add Department".
  2. Enter `Cardiology` (already exists), click "Save Department".
- Expected: Rejected with a message such as "Department already exists".
- Actual: A second `Cardiology` row is created with id `dept-<timestamp>`. localStorage now holds two departments named "Cardiology". Name comparison is also case-sensitive in principle (not yet tested with `cardiology`).
- Verified downstream (Doctors tab): the "Add Doctor" modal's "Select Department" lists two indistinguishable "Cardiology" options. Admin cannot tell which one maps to the seeded doctor Dr. Marcus Jones.
- Verified downstream (Book Appointment): the department dropdown also shows two "Cardiology" options. Choosing the second one (`dept-<timestamp>`) leaves the doctor list empty (see EF-025 in `05-booking-flow.md`).
- Test data left behind: one duplicate "Cardiology" department in localStorage from this run.

## EF-013 - Whitespace-only department name is silently ignored

- Severity: Low
- Type: Validation feedback
- Steps:
  1. Open "Add Department" modal.
  2. Enter three spaces in "Department Name".
  3. Click "Save Department".
- Expected: Inline validation error, same pattern as Login (`FieldError`).
- Actual: Native `required` is satisfied by the spaces; the handler's `trim()` check then no-ops. Modal stays open, no message, nothing saved. The user gets no feedback at all.
- Source: `handleAddDepartment` does `if (newDeptName.trim()) { ... }` with no else branch. Same pattern in `handleAddDoctor`.

## EF-061 - Add Doctor: whitespace name is silently ignored and an exact duplicate doctor is accepted

- Severity: Medium
- Type: Validation (same pattern as EF-012 and EF-013, applied to doctors)
- Steps (Doctors tab, "Add Doctor"):
  1. Name `   ` (spaces), Department General Practice, Clinic Downtown, Save.
  2. Name `Dr. Sarah Smith`, same department and clinic as the seeded record, Save.
- Actual:
  1. Nothing saved, modal stays open, no message.
  2. A second identical record is created (`Dr. Sarah Smith`, `clinic-1`, `general`) with a new `dr-<timestamp>` id. The Book Appointment doctor list then shows two indistinguishable "Dr. Sarah Smith" entries for Downtown + General Practice.
- Source: `handleAddDoctor` has the same `if (... .trim() && ...)` guard with no else branch and no duplicate check.
- Note: Doctors have no stable natural key; the second record is a different id, so selecting either one produces a booking with identical display data.

## EF-014 - Add Department modal is not a real dialog (no role, no Escape, no focus handling)

- Severity: Low
- Type: Accessibility / UX
- Actual:
  - Modal container has no `role="dialog"` and no `aria-modal`; the a11y tree exposes it as plain content after `main`.
  - Pressing Escape does not close it.
  - Close button's accessible name is `close` (icon ligature text).
- Automation note: `getByRole('dialog')` will not find it; tests must use `data-testid="add-dept-modal"`.

## EF-015 - Icon ligature text leaks into accessible names across the dashboard

- Severity: Low
- Type: Accessibility (extends EF-004)
- Examples from the a11y tree:
  - Sidebar buttons: `bar_chart Dashboard Stats`, `calendar_today Appointments`, `group Users Database`, `domain Departments`, `medical_services Doctors`
  - Section headings: `group Registered Users`, `domain Departments`
  - Buttons: `add Add Department`, `close`
  - Header link to settings: `settings`
- Cause: Material Symbols are rendered as text in a `<span>` without `aria-hidden="true"`.
- Impact: Role+name locators have to include the icon word; screen readers read "bar_chart Dashboard Stats".

## EF-016 - Several dashboard controls lack `data-testid`

- Severity: Low
- Type: Project convention violation (AGENTS.md rule 1)
- Elements without `data-testid` (DOM query while the Departments tab was open):
  - Sidebar tab buttons: Dashboard Stats, Appointments, Users Database, Departments, Doctors
  - "Administration Menu" heading (h3) and the "Departments" section heading (h2)
- Note: Department rows, table, modal and submit do have ids (`dept-item-*`, `admin-depts-table`, `add-dept-modal`, `new-dept-name-input`, `add-dept-submit`). Header Logout and settings link also have ids. The gap is the sidebar tabs, which every admin test must click first.

## Appointments tab and Stats (explored with 18 appointments, see test data note in `06-my-appointments.md`)

Verified working:

- Appointments tab lists all members' appointments with patient name, email, clinic, doctor, date and time, status, actions.
- Approve on a `Pending` row sets it to `Approved`; row then offers only Cancel. `Cancelled` rows show `--`.
- Stats tab counters matched the stored data exactly (Total 18, Pending 4, Approved 6, Cancelled 8, Total Users 2).

### EF-037 - Admin appointment list has no search, filter or pagination

- Severity: Low
- Type: Scalability / feature gap
- Actual: All 18 rows render in one table. The member page has debounced search, filters and 5-per-page pagination; the admin page, which sees every user's data, has none of them.
- Automation note: Fine for small data; any large-data test (seeded 100+ rows) makes this page a long scroll.

### EF-038 - Admin Cancel acts immediately, including on Approved appointments

- Severity: Low
- Type: UX / destructive action (same pattern as EF-028)
- Actual: Clicking Cancel on an `Approved` row sets it to `Cancelled` with no confirmation dialog and no reason field. There is no way to revert the status from the UI.
- Source: `updateAppointmentStatus` has no transition rules; the UI simply hides Approve on non-Pending rows.

### EF-039 - Duplicate `data-testid` values when appointment ids collide

- Severity: Low (derived from EF-027)
- Type: Test locator uniqueness
- Actual: With three appointments sharing id `apt-1791862581570`, `admin-appointment-item-apt-1791862581570`, `admin-approve-...`, `admin-cancel-...` each match three elements. Strict-mode locators (Playwright) throw on multiple matches.

## EF-017 - Departments cannot be edited or deleted

- Severity: Info
- Type: Feature gap / test-scope note
- Actual: Department and doctor tables are add-only. A mistaken or duplicate entry (see EF-012) can only be removed by "Purge data" in Settings, which resets everything.
