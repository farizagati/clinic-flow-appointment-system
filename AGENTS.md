# AGENTS.md

> This is the **single source of truth** for all AI coding agents working in this repository.
> If you are Antigravity, Claude (CLAUDE.md), GitHub Copilot (copilot-instructions.md),
> Cursor, Windsurf, or any other AI assistant -- follow the rules below.
> Do not create separate instruction files; refer back to this document.

---

## Project Overview

**ClinicFlow Appointment System** is a React + Vite + Tailwind CSS single-page application
that simulates a healthcare appointment booking workflow. It uses HashRouter for client-side
routing (base path `/clinicflowapp/`), localStorage for all persistence (no backend), and
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
| App URL             | `http://localhost:5173/clinicflowapp/#/`               |
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
  layouts/
    Layout.jsx           -- Page shell (header, nav, footer)
    Navigation.jsx       -- Top navbar
  pages/
    Home.jsx             -- Landing page
    Login.jsx            -- Login form
    Register.jsx         -- Registration form
    BookAppointment.jsx  -- Appointment booking (cascading dropdowns)
    MyAppointments.jsx   -- Patient appointment list
    AdminDashboard.jsx   -- Admin panel (stats, approve/cancel)
    UserSettings.jsx     -- Profile, password, purge data
test-result/             -- Test output artifacts
```

---

## Skills

This section lists available development workflows and tools. For Copilot auto-trigger keywords and skill usage, see [copilot-instructions.md](copilot-instructions.md).

### smart-commit

**Description:** Incrementally stage and commit git changes grouped by logical context, with conventional commit messages.

**Purpose:** Produces clean, readable git history where each commit is focused on one concern.

**When to use:** User says "smart commit", "commit by context", "gradual commit", "group my changes", "split commits", "organize commits", or "help me commit".

**Location:** [.agents/skills/smart-commit/SKILL.md](.agents/skills/smart-commit/SKILL.md)
