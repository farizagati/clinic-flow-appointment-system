# 04 - Routing and route guards

Area: HashRouter routes and guards in `src/App.jsx`
Explored: 2026-10-13, Chrome via DevTools MCP, by changing `location.hash` in the running SPA.
Source reviewed: `src/App.jsx`, `src/pages/Login.jsx`

Severity scale: High (blocks a flow or loses data), Medium (wrong behavior, workaround exists),
Low (cosmetic, polish, convention violation).

## Verified working (no finding)

| State              | Target route                                              | Result                  |
| ------------------ | --------------------------------------------------------- | ----------------------- |
| Logged out         | `/book-appointment`, `/my-appointments`, `/admin-dashboard`, `/settings` | Redirect to `/#/login`  |
| Admin              | `/book-appointment`, `/book-appointment/review`, `/my-appointments`      | Redirect to `/#/`       |
| Admin              | `/settings`                                               | Allowed                 |
| Any                | Unknown path (`/#/nope`)                                  | Redirect to `/#/`       |
| Admin, click Logout | -                                                        | Session key removed, lands on `/#/login` |

---

## EF-018 - Authenticated users can still open Login and Register

- Severity: Low
- Type: Routing / UX
- Steps:
  1. Log in as admin.
  2. Navigate to `/#/login` (or `/#/register`).
- Expected: Redirect to the user's landing page (dashboard / my appointments), or at least no form.
- Actual: The full login form renders while the header shows "System Admin (admin)" and Logout. Submitting another account's credentials silently swaps the session. `/login` and `/register` have no guard.
- Automation note: Useful negative scenario; a test cannot assume that being on `/login` implies logged out.

## EF-019 - Deep link is lost after the login redirect

- Severity: Low
- Type: Routing / UX
- Steps:
  1. Logged out, open `/#/my-appointments` directly.
  2. Guard redirects to `/#/login`; log in as member.
- Expected: Return to `/#/my-appointments` (or the originally requested route).
- Actual: Redirect uses `<Navigate to="/login" replace />` with no `state.from`, and `Login` always navigates to `/my-appointments` (member) or `/admin-dashboard` (admin). For a member this happens to match the example above, but any other protected target (for example `/#/settings` or `/#/book-appointment`) is dropped.
- Source: `Login.jsx` `handleSubmit` navigates by role only.

## EF-020 - Footer `#` links produce an inconsistent location

- Severity: Info
- Type: Routing note
- See EF-002. Under HashRouter, `href="#"` moves the address bar from `/#/<route>` to `/#` and the app renders Home content only because the catch-all route redirects. Mentioned here so route-based tests account for it.
- Resolution: No `href="#"` remains; footer links route to dedicated info pages (see EF-002).
