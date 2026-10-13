# Exploratory findings index

Session: 2026-10-13, exploratory pass on `http://localhost:5173/clinic-flow-appointment-system/`
using Chrome DevTools MCP. No application code was changed; findings only.

The app is a localStorage-only test automation sandbox, so items that follow from "no backend"
are marked Info rather than defects.

Severity: High (blocks a flow or loses data), Medium (wrong behavior, workaround exists),
Low (cosmetic, polish, convention violation), Info (observation for test design).

Finding ids (EF-nnn) are unique across all files. Within a file they are not always in numeric order
because findings were appended as they were discovered.

## Files

| File                              | Area                                  | Findings                                              |
| --------------------------------- | ------------------------------------- | ----------------------------------------------------- |
| `01-home-and-global.md`           | Home, footer, global resources        | EF-001 to EF-006, EF-062                              |
| `02-login.md`                     | Login                                 | EF-007 to EF-011                                      |
| `03-admin-dashboard.md`           | Admin: stats, users, depts, doctors, appointments | EF-012 to EF-017, EF-037 to EF-039, EF-061 |
| `04-routing-and-guards.md`        | Route guards, redirects               | EF-018 to EF-020                                      |
| `05-booking-flow.md`              | Book Appointment and Review           | EF-021 to EF-027                                      |
| `06-my-appointments.md`           | My Appointments: list, search, filter, pagination, cancel | EF-028 to EF-036                  |
| `07-register.md`                  | Register                              | EF-040 to EF-044                                      |
| `08-user-settings.md`             | Settings, password, avatar, purge     | EF-045 to EF-053, EF-060                              |
| `09-responsive-a11y-storage.md`   | Responsive, a11y, theme, storage      | EF-054 to EF-059                                      |

## Highest-impact findings

| Id     | Severity | Summary                                                                                     |
| ------ | -------- | ------------------------------------------------------------------------------------------- |
| EF-026 | High     | Same doctor, date and time can be booked repeatedly (no availability check)                 |
| EF-027 | High     | Rapid confirm creates several appointments sharing one id (`Date.now()` ids, no re-entry guard) |
| EF-029 | High     | Cancelling one appointment cancels every appointment with the same id                       |
| EF-036 | High     | Duplicate ids make pagination render ghost rows (React duplicate key)                       |
| EF-041 | High*    | Anyone can register as Admin through the role select (*sandbox convenience, security test target) |
| EF-012 | Medium   | Duplicate department names accepted; produces an empty doctor list for the duplicate        |
| EF-061 | Medium   | Duplicate doctors accepted; whitespace name silently ignored                                |
| EF-021 | Medium   | Past time slot for today can be booked                                                      |
| EF-025 | Medium   | Empty doctor dropdown with no explanation for clinic/department pairs without a doctor      |
| EF-033 | Medium   | Status filter offers "Scheduled"/"Confirmed" which never match the stored "Approved"        |
| EF-034 | Medium   | Pagination footer text is about 1.04:1 contrast in dark theme                               |
| EF-045 | Medium   | Change Password accepts a 1-character password (Register requires 8)                        |
| EF-054 | Medium   | Mobile viewport hides primary nav links with no menu replacement                            |

## Test data and cleanup

During the run the following were created, then removed with "Purge Data" in Settings at the end:
a duplicate "Cardiology" department, "Dr. Test Dentist", a duplicate "Dr. Sarah Smith", users
`ws@test.com` and `selfadmin@test.com`, about 20 appointments (14 injected directly into
localStorage), and a 1.9 MB junk avatar. The app was left on seeded defaults. The `theme` key is not
cleared by purge (EF-056) and was toggled during the run, so the stored theme may differ from the start.

Not covered: real keyboard-only traversal, screen reader behavior, cross-browser checks, Lighthouse score,
`Download Medical Records` (no handler), performance with large data sets.
