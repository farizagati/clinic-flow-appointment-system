# 05 - Booking flow (Book Appointment and Review)

Area: `/#/book-appointment`, `/#/book-appointment/review`
Explored: 2026-10-13, Chrome via DevTools MCP, logged in as the seeded member.
Environment timezone: Asia/Jakarta (UTC+7). Local time at test: about 10:35.
Source reviewed: `src/pages/BookAppointment.jsx`, `src/pages/ReviewAppointment.jsx`, `src/contexts/AuthContext.jsx`

Severity scale: High (blocks a flow or loses data), Medium (wrong behavior, workaround exists),
Low (cosmetic, polish, convention violation).

Status of this file: mostly complete. Covered: required-field validation, happy path, same-day
past time slot, double booking, empty doctor list, duplicate department option, notes with HTML,
navigating away during the 2s success delay, rapid confirm. Still to cover: Edit Details round
trip, reload on the review page, long unbroken notes layout.

## Verified working (no finding)

- Submitting the empty form shows five inline errors (`appointment-clinic-error`, `appointment-department-error`, `appointment-doctor-error`, `appointment-date-error`, `appointment-time-error`), each with `role="alert"`.
- Past dates are disabled in the date picker; "Today" is selectable.
- Choosing clinic + department filters the doctor list (Downtown + Cardiology gives only Dr. Marcus Jones).
- Review page shows patient, clinic, department, physician, date, time, notes ("None provided" when empty).
- "Confirm & Book Appointment" stores the appointment with status `Pending`, shows "Appointment successfully booked!", disables both buttons, then redirects to `/#/my-appointments` after about 2 seconds.
- Notes containing `<script>alert(1)</script>` plus 400 characters are shown as plain text on the review page; nothing executes (React escapes output).

---

## EF-021 - A time slot earlier than the current time is accepted for today

- Severity: Medium
- Type: Validation
- Steps:
  1. Log in as member; open Book Appointment at about 10:35 local time.
  2. Select ClinicFlow Downtown, Cardiology, Dr. Marcus Jones.
  3. Pick today's date and time slot `09:00`.
  4. Click "Review Appointment", then "Confirm & Book Appointment".
- Expected: Past slots for today are disabled or rejected with a message.
- Actual: Accepted. Appointment `apt-...` is stored with `date: 2026-10-13`, `time: 09:00`, status `Pending`.
- Source: `validate()` only compares the date (midnight-normalized) to today; `time` is only checked for non-empty.
- Test data left behind: this appointment is in localStorage.

## EF-025 - Doctor dropdown is empty with no message for combinations that have no doctor

- Severity: Medium
- Type: UX / empty state
- Steps:
  1. Open Book Appointment.
  2. Select clinic `ClinicFlow Northside` and department `Orthopedics` (seed data has no doctor for either).
- Expected: Doctor field disabled or an inline hint such as "No doctors available for this selection".
- Actual: "Select Doctor" stays enabled with only the empty placeholder option. No explanation. The user can only submit and receive "Please select a doctor", which cannot be satisfied.
- Also reproduces for: any clinic + the duplicate "Cardiology" department created in EF-012 (`dept-<timestamp>`), because the seeded doctor belongs to the original `cardiology` id.
- Seed data gaps that trigger it: Northside clinic has no doctor at all; Dental and Orthopedics have no doctor until an admin adds one.
- Resolution: When a clinic and department are selected and no doctor matches, a hint `appointment-doctor-empty` reads "No doctors available for this clinic and department." Select and validation unchanged (`src/pages/BookAppointment.jsx`).

## EF-026 - The same doctor, date and time slot can be booked repeatedly

- Severity: High
- Type: Business rule / data integrity
- Steps:
  1. Book Dr. Marcus Jones, Downtown, Cardiology, 2026-10-13 09:00 (succeeds).
  2. Book the identical slot again, as the same member.
- Expected: Rejected ("This time slot is no longer available") at least for the same doctor/date/time.
- Actual: Accepted every time; `clinicflow_appointments` ends up with multiple `Pending` rows for the same doctor, date and time. No availability check exists anywhere (`bookAppointment` just appends).
- Impact: The "View real-time availability" claim on Home is not backed by any logic. Also removes any realistic scenario for "slot already taken" tests.
- Test data left behind: several duplicate appointments for this slot.

## EF-027 - Rapid repeated "Confirm & Book" creates several appointments with the same id

- Severity: High
- Type: Race / data integrity
- Steps:
  1. Reach the review page.
  2. Trigger the Confirm button three times in the same tick (script: `btn.click(); btn.click(); btn.click();`).
- Actual: Three appointments are stored, all with the identical id `apt-1791862581570`. `isSubmitting` is set but the button is not disabled until React re-renders, so every click runs `bookAppointment`.
- Root causes:
  - No in-handler guard (`if (isSubmitting) return`).
  - Ids are `apt-${Date.now()}`, so any two bookings created in the same millisecond collide.
- Consequence: Approve/Cancel work by id, so acting on one of the duplicates will change all rows that share the id (to be verified in the admin and my-appointments files).
- Caveat: Reproduced with synchronous programmatic clicks. A real human double-click is slower and may be stopped by the disabled state; real double-click behavior is not yet verified.

## EF-022 - Review page shows the date as a raw ISO string

- Severity: Low
- Type: UX / formatting
- Actual: DATE row on the review page reads `2026-10-13`, while the rest of the app (header copy, picker) uses long human-readable dates. The date picker field also shows the raw ISO value.
- Automation note: Predictable for assertions (ISO is stable), but check My Appointments for the format used there (tracked in file 06).

## EF-023 - Appointments store display names instead of ids

- Severity: Low
- Type: Data model
- Actual: The stored appointment keeps `doctor`, `department`, `clinic` as display-name strings (`"Dr. Marcus Jones"`, `"Cardiology"`, `"ClinicFlow Downtown"`), not ids.
- Impact: With duplicate department names (EF-012) an appointment cannot be traced to a specific department record. Any future rename would orphan existing bookings.
- Source: `ReviewAppointment.jsx` passes `clinicName`, `departmentName`, `doctorName` to `bookAppointment`.

## EF-024 - Success redirect timer is not cancelled on unmount

- Severity: Low
- Type: Code / race
- Source observation: `handleConfirmBooking` calls `setTimeout(() => navigate('/my-appointments'), 2000)` with no cleanup. If the user logs out or navigates elsewhere within the 2 second window, the delayed `navigate` still fires.
- Status: Reproduced in the browser. After clicking "Confirm & Book Appointment", changing the route to `/#/settings` within the 2 second window still ends on `/#/my-appointments` about 2 seconds after the click; the user is pulled away from the page they chose.
