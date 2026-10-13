# 02 - Login page

Area: `/#/login`
Explored: 2026-10-13, Chrome via DevTools MCP, desktop viewport.
Source reviewed: `src/pages/Login.jsx`

Severity scale: High (blocks a flow or loses data), Medium (wrong behavior, workaround exists),
Low (cosmetic, polish, convention violation).

## Verified working (no finding)

- Empty submit shows "Email address is required" and "Password is required"; both inputs get `aria-invalid="true"`, error elements have `role="alert"` and `data-testid` (`login-password-error`, etc.).
- Wrong password shows banner "Invalid email or password"; entered values are preserved; stays on `/#/login`.
- Valid admin credentials redirect to `/#/admin-dashboard`.
- Trailing whitespace in email is accepted: this is the browser sanitizing `type="email"` values, not app logic. Not a bug.

---

## EF-007 - Login error banner is not announced to assistive tech

- Severity: Low
- Type: Accessibility
- Steps: Submit valid-format email with wrong password.
- Actual: The `data-testid="login-error"` banner ("Invalid email or password") has no `role="alert"` / `aria-live`. The per-field errors do have `role="alert"`, so behavior is inconsistent within the same form.
- Automation note: Locators using `getByRole('alert')` match field errors but miss the auth error banner.

## EF-008 - Nested `<main>` landmarks on every page

- Severity: Low
- Type: Accessibility / invalid HTML
- Actual: Accessibility tree shows `main` > `main`. `Layout` renders a `<main>` and the page renders its own `<main>` inside it.
- Counted `<main>` elements per route: `/login` 2, `/register` 2, `/book-appointment` 2, `/book-appointment/review` 2 (nested), `/admin-dashboard` 2 (nested); `/`, `/my-appointments`, `/settings` have 1.
- Impact: Two main landmarks; HTML spec allows only one visible `<main>`.

## EF-009 - `data-testid` names do not follow the documented convention

- Severity: Low
- Type: Project convention drift
- Actual: AGENTS.md example uses `login-email-input` and `login-submit-btn`. The app uses `login-email`, `login-password`, `login-submit` (no `-input` / `-btn` suffix). Error test ids follow a third form (`login-password-error`).
- Impact: Test authors who follow AGENTS.md write locators that do not exist. Either AGENTS.md or the ids should change; decide which is canonical.

## EF-010 - Plaintext credentials are displayed on the login page and stored in localStorage

- Severity: Info (intentional for sandbox)
- Type: Security observation
- Actual: Test credentials table is shown on `/#/login`; passwords are stored in plaintext under `clinicflow_users` in localStorage; the session object stores user profile in `clinicflow_currentUser`.
- Note: Recorded only so test authors know it exists (useful for security-oriented practice scenarios). Not a defect given the stated purpose.

## EF-011 - Low contrast for footer links and inactive nav link in dark theme

- Severity: Low
- Type: Accessibility / visual
- Observed: In dark theme the footer links (Privacy Policy, Terms of Service, Contact Support, Help Center) and the "Login" nav link render as mid-grey on slate; they look noticeably dimmer than body text. Visual estimate only, contrast ratio not yet measured; confirm with an a11y audit in a later pass.
