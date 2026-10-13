# 07 - Register page

Area: `/#/register`
Explored: 2026-10-13, Chrome via DevTools MCP (form values set through script with native setters and input events).
Source reviewed: `src/pages/Register.jsx`, `register()` in `src/contexts/AuthContext.jsx`

Severity scale: High (blocks a flow or loses data), Medium (wrong behavior, workaround exists),
Low (cosmetic, polish, convention violation).

## Verified working (no finding)

| Input                                                    | Result                                          |
| -------------------------------------------------------- | ----------------------------------------------- |
| All fields empty                                         | Four inline errors: name, email, password, confirm required |
| Password of 7 characters                                 | "Password must be at least 8 characters"        |
| Password and confirm differ                              | "Passwords do not match"                        |
| Email `a@b` (no TLD dot)                                 | "Please enter a valid email address"            |
| Email `ADMIN@Example.com` (existing, different case)     | "Email is already registered" (case-insensitive duplicate check works) |
| Successful registration                                  | Success message, fields cleared, redirect to `/#/login` after about 2 seconds |
| Name containing `<img src=x onerror=alert(1)>`           | Stored as plain text; no script executed (React escapes) |

Test data left behind: users `ws@test.com` and `selfadmin@test.com`.

---

## EF-040 - Whitespace-only password is accepted

- Severity: Low
- Type: Validation
- Steps: Register with a password and confirmation of eight space characters.
- Expected: Rejected ("Password cannot be blank").
- Actual: Accepted. Password stored as `"        "` and the user can log in with it. Validation only checks `password.length < 8`, not that the value contains a non-space character.

## EF-041 - Anyone can register as Admin through the Account Role select

- Severity: High (security), but see note
- Type: Authorization / privilege escalation
- Steps:
  1. Open `/#/register`.
  2. Choose "Admin" in "Account Role", fill the other fields, submit.
  3. Log in with the new account.
- Actual: Account is created with `role: "admin"` and gets access to `/#/admin-dashboard`, including all users, all appointments and the approve / cancel actions. No invite, code or existing-admin approval is needed. `register(email, name, password, role)` trusts the role sent by the client.
- Note: Likely deliberate for a test-automation sandbox (easy way to create an admin). Recorded because it is the single largest authorization gap and is a natural security-test target.

## EF-042 - Registration error banner is not announced (extends EF-007)

- Severity: Low
- Type: Accessibility
- Actual: "Email is already registered" appears in `data-testid="register-error"` without `role="alert"`; field-level errors do have `role="alert"`. Same pattern as the login banner.

## EF-043 - Entire success flow relies on an un-cancelled 2 second timer

- Severity: Low
- Type: Code / race (same pattern as EF-024)
- Source: `setTimeout(() => navigate('/login'), 2000)` with no cleanup. If the user clicks a nav link within two seconds, the delayed navigation still fires and pulls them to `/login`.
- Status: Source-based, not reproduced in the browser.

## EF-044 - Account Role stays on the chosen value after a successful registration

- Severity: Info
- Type: Form reset
- Actual: Name, email and both password fields are cleared on success, but the role select keeps "Admin" (observed `register-role` value `admin` right after success). Minor inconsistency; the user is redirected away shortly after.
