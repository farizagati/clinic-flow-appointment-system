# AGENTS.md

> This is the **single source of truth** for all AI coding agents working in this repository.
> If you are Antigravity, Claude (CLAUDE.md), GitHub Copilot (copilot-instructions.md),
> Cursor, Windsurf, or any other AI assistant -- follow the rules below.
> Do not create separate instruction files; refer back to this document.

---

## Project Overview

**ClinicFlow Appointment System** is a React + Vite + Tailwind CSS single-page application
that simulates a healthcare appointment booking workflow. It uses HashRouter for client-side
routing (base path `/clinic-flow-appointment-system/`, set in `vite.config.js`), localStorage for all persistence (no backend), and
role-based route guards (member vs admin).

**This application exists as a test automation sandbox / playground.** Its primary purpose is
to serve as a realistic target for UI test automation frameworks such as Playwright, Cypress,
Selenium, and Robot Framework. Treat every code change through that lens.

---

## Rules

### 1. `data-testid` is mandatory

Every interactable element (buttons, links, inputs, selects, toggles) and every element that
is asserted against in tests (headings, status labels, error messages, tables, list items)
**must** have a `data-testid` attribute.

Naming convention -- use lowercase kebab-case scoped by page/component:

```
data-testid="login-email"
data-testid="login-submit"
data-testid="admin-approve-{id}"
```

### 2. No emojis in documentation

When writing or editing any documentation file (README, markdown reports, code comments,
JSDoc, commit messages), **do not use emojis**. Keep the tone plain and professional.

### 3. Preserve existing conventions

- Styling: Tailwind CSS utility classes. Custom design tokens are defined in
  `tailwind.config.js` and `src/index.css`.
- Routing: HashRouter with route guards in `src/App.jsx`.
- State: React Context (`AuthContext`, `ThemeContext`) backed by localStorage.
- Mock data lives in `src/data/mockData.js`.

### 4. Do not introduce a backend

All data is intentionally stored in localStorage. Do not add a database, API server, or
any network-dependent data layer. The app must remain fully client-side so it can be spun
up with a single `npm run dev` for test automation purposes.

### 5. Keep dependencies minimal

Do not add new npm packages without explicit user approval. The current stack
(React 19, react-router-dom 7, Vite 6, Tailwind 3) is intentionally lean.

---

## Quick Reference

| Item                | Detail                                                |
| ------------------- | ----------------------------------------------------- |
| Dev server          | `npm run dev` (Vite, default port 5173)               |
| App URL             | `http://localhost:5173/clinic-flow-appointment-system/#/` |
| Build               | `npm run build` (outputs to `dist/`)                  |
| Routing             | HashRouter (`/#/login`, `/#/book-appointment`, etc.)  |
| Auth                | localStorage-based, see `src/contexts/AuthContext.jsx`|
| Member test account | `johnyjohnyyespapa@mail.com` / `EatingSugarNoPapa`    |
| Admin test account  | `admin@example.com` / `ThisIsNotAdmin`                |

---

## File Structure (key paths)

```
src/
  App.jsx               -- Routes and role-based guards
  main.jsx              -- React root mount
  index.css             -- Global styles and custom CSS
  contexts/
    AuthContext.jsx      -- Auth state, user CRUD, booking ops
    ThemeContext.jsx      -- Light/dark theme toggle
  data/
    mockData.js          -- Clinics, departments, doctors, time slots
  components/
    FieldError.jsx       -- Inline field validation display
    CustomDatePicker.jsx -- Single date picker (booking date)
    CustomDateRangePicker.jsx -- Date range picker (appointment filters)
    SearchDropdown.jsx   -- Debounced searchable dropdown (booking doctor field)
    Modal.jsx            -- Dialog shell (role="dialog", closes on Escape)
    ConfirmDialog.jsx    -- Confirm step for destructive actions
    Pagination.jsx       -- Page controls (admin appointments)
    admin/
      AdminAppointments.jsx -- Admin appointment list (search, status filter, pagination)
      AdminDepartments.jsx  -- Department add, edit, delete
      AdminDoctors.jsx      -- Doctor add, edit, delete, search
  layouts/
    Layout.jsx           -- Page shell (header, nav, footer)
    Navigation.jsx       -- Top navbar and mobile menu
  pages/
    Home.jsx             -- Landing page
    Login.jsx            -- Login form
    Register.jsx         -- Registration form
    BookAppointment.jsx  -- Appointment booking (cascading dropdowns, doctor search)
    ReviewAppointment.jsx -- Booking review and confirm step
    MyAppointments.jsx   -- Patient appointment list (debounced search, filters, pagination)
    AdminDashboard.jsx   -- Admin panel shell (tabs, stats, users)
    UserSettings.jsx     -- Profile, password, purge data
    InfoPage.jsx         -- Footer info pages (privacy, terms, support, help)
  services/
    medicalRecords.js    -- Medical records PDF export
  utils/
    statusUtils.js       -- Appointment status badge class and icon helpers
```

---

## Testing Notes

### Mock doctors

- `DOCTORS` in `src/data/mockData.js` holds one record per doctor per clinic. A doctor
  who works at several clinics appears once per clinic with the same name and a
  different id (for example `dr-smith` at Downtown and `dr-smith-westside` at
  Westside). Always target doctors by id, not by name.
- Each doctor record belongs to one clinic. Do not add schedule checks across clinics
  unless asked.
- Doctors are stored in localStorage (`clinicflow_doctors`). On every load the seed
  doctors are refreshed from `mockData.js` (so renamed or removed seed doctors update in
  existing browsers), and doctors created by the admin are kept.
- Doctor names are plain ASCII (no accents, apostrophes or hyphens), so they render
  correctly in the medical records PDF, which uses the built-in Helvetica font.

### Doctor search dropdown (Book Appointment)

The doctor field is a combobox (`src/components/SearchDropdown.jsx`), not a native
`<select>`, so `selectOption` does not work on it.

- Searches doctor name only (case-insensitive substring). Department and clinic are
  shown under each name for display but are not searched.
- Results update 400ms after the last keystroke. While waiting, a "Searching..." row
  is shown.
- Typing after a doctor was picked clears the selection. A doctor only counts as
  selected once an option is picked from the list.
- The list is limited by the selected clinic and department.

| data-testid                         | Element                                  |
| ----------------------------------- | ---------------------------------------- |
| `appointment-doctor`                | Text input (`data-selected-value` = id)  |
| `appointment-doctor-listbox`        | Suggestion list                          |
| `appointment-doctor-option-{id}`    | One option, e.g. `...-option-dr-jones`   |
| `appointment-doctor-loading`        | "Searching..." row during debounce       |
| `appointment-doctor-empty`          | No results row                           |
| `appointment-doctor-no-options`     | List row when the clinic and department pair has no doctors |
| `appointment-doctor-clear`          | Clear button                             |
| `appointment-doctor-toggle`         | Open/close arrow button                  |
| `appointment-doctor-error`          | Validation message                       |
| `appointment-doctor-unavailable`    | Hint when a clinic and department pair has no doctors |

Example (Playwright):

```js
await page.getByTestId('appointment-doctor').fill('smith');
await page.getByTestId('appointment-doctor-option-dr-smith-westside').click();
await expect(page.getByTestId('appointment-doctor')).toHaveAttribute('data-selected-value', 'dr-smith-westside');
```

### Admin dashboard

- Tabs are buttons: `admin-tab-stats`, `admin-tab-appointments`, `admin-tab-users`,
  `admin-tab-departments`, `admin-tab-doctors`. The active tab has `aria-current="page"`.
- Seed departments and doctors are built-in and read-only (their row shows
  `dept-builtin-{id}` or `doc-builtin-{id}`). Only records created by the admin can be
  edited or deleted.
- Department names are unique (case-insensitive). A doctor is unique per name, clinic
  and department. A department with doctors assigned cannot be deleted.
- Result messages show in `admin-success` or `admin-error`. They clear on tab change.
- Appointments: 10 rows per page. Search matches patient name, patient email, doctor,
  clinic and department. Approve and Cancel apply immediately.
- Add and edit forms are dialogs (`getByRole('dialog')` works). Escape closes them.
  Field errors use `{input-testid}-error`.

| data-testid                              | Element                                   |
| ---------------------------------------- | ----------------------------------------- |
| `stat-{name}-value`                      | Number inside a stat card                 |
| `admin-appointments-search`              | Appointment search input                  |
| `admin-appointments-status-filter`       | Status select (All, Pending, Approved, Cancelled) |
| `admin-appointment-item-{id}`            | Appointment row                           |
| `admin-apt-status-{id}`                  | Status badge                              |
| `admin-approve-{id}`, `admin-cancel-{id}` | Row actions                              |
| `admin-no-appointments`, `admin-no-matching-appointments` | Empty states             |
| `admin-appointments-pagination`          | Pagination wrapper (hidden when no rows)  |
| `admin-appointments-pagination-summary`  | "Showing 1 to 10 of 23 results"           |
| `admin-appointments-page-{n}`, `-page-prev`, `-page-next` | Page buttons             |
| `admin-add-dept-btn`, `admin-add-doc-btn` | Open the add dialog                      |
| `add-dept-modal`, `edit-dept-modal`      | Department dialogs (`-close`, `-title`)   |
| `new-dept-name-input`, `edit-dept-name-input` | Department name field                |
| `add-dept-submit`, `add-dept-cancel`, `edit-dept-submit`, `edit-dept-cancel` | Department dialog buttons |
| `dept-item-{id}`, `dept-name-{id}`, `dept-doctor-count-{id}` | Department row and cells |
| `admin-edit-dept-{id}`, `admin-delete-dept-{id}` | Department row actions            |
| `add-doc-modal`, `edit-doc-modal`        | Doctor dialogs (`-close`, `-title`)       |
| `new-doc-name-input`, `new-doc-dept-select`, `new-doc-clinic-select` | Add doctor fields |
| `edit-doc-name-input`, `edit-doc-dept-select`, `edit-doc-clinic-select` | Edit doctor fields |
| `add-doc-submit`, `add-doc-cancel`, `edit-doc-submit`, `edit-doc-cancel` | Doctor dialog buttons |
| `admin-doctors-search`                   | Doctor name search input                  |
| `doc-item-{id}`, `doc-name-{id}`, `doc-dept-{id}`, `doc-clinic-{id}` | Doctor row and cells |
| `admin-edit-doc-{id}`, `admin-delete-doc-{id}` | Doctor row actions                  |
| `admin-no-matching-doctors`              | Doctor search empty state                 |
| `confirm-dialog`, `confirm-dialog-message` | Delete confirmation                     |
| `confirm-dialog-confirm`, `confirm-dialog-cancel` | Confirmation buttons             |
| `user-item-{id}`, `user-role-{id}`       | User row and role badge                   |

### Navigation

- Below the `md` breakpoint the top links are hidden. `nav-menu-toggle` opens
  `nav-mobile-menu`, whose links are `nav-mobile-home`, `nav-mobile-book-appointment`,
  `nav-mobile-my-appointments` and `nav-mobile-admin-dashboard` (by role).
- Theme toggle: `nav-theme-toggle`.

---

## Skills

This section lists available development workflows and tools. For Copilot auto-trigger keywords and skill usage, see [copilot-instructions.md](copilot-instructions.md).

### smart-commit

**Description:** Incrementally stage and commit git changes grouped by logical context, with conventional commit messages.

**Purpose:** Produces clean, readable git history where each commit is focused on one concern.

**When to use:** User says "smart commit", "commit by context", "gradual commit", "group my changes", "split commits", "organize commits", or "help me commit".

**Location:** [.agents/skills/smart-commit/SKILL.md](.agents/skills/smart-commit/SKILL.md)
