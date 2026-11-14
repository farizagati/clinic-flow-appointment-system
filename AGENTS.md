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
data-testid="login-email-input"
data-testid="login-submit-btn"
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
  layouts/
    Layout.jsx           -- Page shell (header, nav, footer)
    Navigation.jsx       -- Top navbar
  pages/
    Home.jsx             -- Landing page
    Login.jsx            -- Login form
    Register.jsx         -- Registration form
    BookAppointment.jsx  -- Appointment booking (cascading dropdowns, doctor search)
    ReviewAppointment.jsx -- Booking review and confirm step
    MyAppointments.jsx   -- Patient appointment list (debounced search, filters, pagination)
    AdminDashboard.jsx   -- Admin panel (stats, approve/cancel)
    UserSettings.jsx     -- Profile, password, purge data
    InfoPage.jsx         -- Footer info pages (privacy, terms, support, help)
test-result/             -- Test output artifacts
```

---

## Testing Notes

### Mock doctors

- `DOCTORS` in `src/data/mockData.js` holds one record per doctor per clinic. A doctor
  who works at several clinics appears once per clinic with the same name and a
  different id (for example `dr-smith` at Downtown and `dr-smith-westside` at
  Westside). Always target doctors by id, not by name.
- Booking the same doctor at the same time in two clinics is allowed. This is a known,
  intentional gap; do not add a conflict check unless asked.
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

---

## Skills

This section lists available development workflows and tools. For Copilot auto-trigger keywords and skill usage, see [copilot-instructions.md](copilot-instructions.md).

### smart-commit

**Description:** Incrementally stage and commit git changes grouped by logical context, with conventional commit messages.

**Purpose:** Produces clean, readable git history where each commit is focused on one concern.

**When to use:** User says "smart commit", "commit by context", "gradual commit", "group my changes", "split commits", "organize commits", or "help me commit".

**Location:** [.agents/skills/smart-commit/SKILL.md](.agents/skills/smart-commit/SKILL.md)
