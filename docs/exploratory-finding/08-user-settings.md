# 08 - User Settings

Area: `/#/settings` (profile view, edit profile, change password, avatar upload, purge)
Explored: 2026-10-13, Chrome via DevTools MCP, logged in as the seeded member.
Source reviewed: `src/pages/UserSettings.jsx`, `updateUserSettings` and `purgeAndResetData` in `src/contexts/AuthContext.jsx`

Severity scale: High (blocks a flow or loses data), Medium (wrong behavior, workaround exists),
Low (cosmetic, polish, convention violation).

## Verified working (no finding)

- View mode shows name, gender, date of birth, blood type, address, emergency contact.
- Edit profile: blank name shows "Name field cannot be empty"; valid save shows "Profile updated successfully!" and the header name stays in sync.
- Change password: current password is verified against the stored user ("Current password is incorrect" path exists); a valid change persists and the new password works for login (restored to the original afterwards).
- Date of Birth uses a read-only picker (years 1926 to 2026); the field cannot be typed into.
- Avatar upload over about 2 MB fails: "Failed to upload profile picture" and no partial write (users and session unchanged).

---

## EF-045 - Change Password accepts a one-character password

- Severity: Medium
- Type: Validation inconsistency
- Steps: Settings, Change Password; current password correct; new and confirm both `a`.
- Expected: Same rule as Register (at least 8 characters).
- Actual: "Password updated successfully!" and `clinicflow_users` stores `"a"`. The page only checks "not empty" and "matches confirm". A new password equal to the current one is also accepted.
- Source: `handleChangePasswordSubmit` has no length rule.

## EF-046 - Profile name is saved with leading and trailing whitespace

- Severity: Low
- Type: Validation / data cleanliness
- Steps: Edit Profile, set Full Name to `  Johny Member  `, save.
- Actual: Validation uses `editName.trim()` but the untrimmed value is passed to `updateUserSettings`; storage holds `"  Johny Member  "`.
- Impact: Exact-match assertions and the admin user list will show padded names (HTML collapses visual whitespace, so it looks fine on screen).

## EF-047 - Emergency contact phone accepts any text

- Severity: Low
- Type: Validation
- Steps: Edit Profile, set emergency phone to `abc`, save.
- Actual: Saved and displayed as `abc`. Field is `type="tel"` with no pattern check.

## EF-048 - "Download Medical Records" button does nothing

- Severity: Low
- Type: Dead control
- Actual: The button (`download-records-btn`) has no `onClick`. No file, no message.
- Also: In dark theme its label (dark green on dark) is low contrast and looks disabled.
- Resolution: Button downloads `clinicflow-medical-records-YYYY-MM-DD.pdf` built by `src/services/medicalRecords.js` and shows the `settings-success` banner (`src/pages/UserSettings.jsx`). Dark-theme contrast fixed by the dark `--color-primary` token (`src/index.css`).

## EF-049 - Purge Data runs immediately with no confirmation (any role)

- Severity: Medium
- Type: Destructive action
- Source: `onClick={handlePurge}` calls `purgeAndResetData()` directly. It removes every user, appointment, and custom department and doctor, logs out, and redirects to login after 1 second.
- Impact: One click wipes all accounts, including for an admin session. Intentional as a reset hook for test automation, but there is no safeguard or typed confirmation.
- Automation note: Useful as a fast reset step in test setup; also a hazard if a test clicks it by mistake.

## EF-060 - Purge success message is never visible

- Severity: Low
- Type: UX / feedback
- Steps: Settings, click "Purge Data", observe immediately.
- Expected: "All data cleared and reset to defaults successfully!" shown before the redirect (the code schedules a 1 second delay for that purpose).
- Actual: `purgeAndResetData()` sets `currentUser` to `null`, so the `ProtectedRoute` for `/settings` redirects to `/login` right away (hash was `#/login` after 300 ms). The success banner lives on the unmounted Settings page and is never seen; the `setTimeout` redirect afterwards is redundant.
- Verified after purge: `clinicflow_users`, `clinicflow_departments`, `clinicflow_clinics`, `clinicflow_doctors` are re-seeded to defaults; `clinicflow_appointments` and `clinicflow_currentUser` are removed; `theme` is left untouched (see EF-056). The duplicate "Cardiology", "Dr. Test Dentist", the extra users and the 1.9 MB avatar were all cleared.

## EF-050 - Patient ID is hard-coded

- Severity: Low
- Type: Static data
- Source: `<p>Patient ID: #CF-8829</p>` is a literal. Every user (member, admin, newly registered) sees the same Patient ID.

## EF-051 - New accounts get someone else's profile defaults

- Severity: Low
- Type: Data / seed
- Source: `register()` and `login()` fall back to gender `Female`, date of birth `12 October 1985`, blood type `O Negative`, address `482 Clinical Heights Parkway ...`, emergency contact `Robert Sterling (Spouse)`, phone `+1 (555) 987-6543`. A newly registered user (and admin) starts with these as their own details. The page heading fallback is also the literal `Alexia Sterling`.
- Impact: Assertions on "empty profile for new user" cannot be written; users appear to have data they never entered.

## EF-052 - Avatar upload is applied immediately and Cancel does not revert it

- Severity: Low
- Type: UX / state
- Steps:
  1. Edit Profile, upload an image through the camera overlay.
  2. Click Cancel.
- Actual: Picture remains the new one (`updateUserSettings` is called from the file input handler, outside the Save flow). Success message "Profile picture updated successfully!" appears while still in edit mode.
- Also: The upload overlay is a clickable `<div>` (no button role, no keyboard access, no `data-testid`); only the hidden file input has an id.

## EF-053 - Avatar accepts any bytes labelled as an image and the real limit is lower than 2 MB

- Severity: Low
- Type: Validation / robustness
- Steps (script, since the OS file picker cannot be driven here):
  1. In edit mode set 1.9 MB of random bytes with MIME type `image/png` on the file input.
  2. Observe; then try 2.09 MB.
- Actual:
  - 1.9 MB random bytes is accepted and stored as a data URL (`clinicflow_users` and `clinicflow_currentUser` each about 2.5 million characters); the avatar renders as a broken image.
  - 2.09 MB (still under the stated "less than 2MB" check of 2,097,152 bytes) fails with the generic "Failed to upload profile picture" because the base64 copy is stored twice and exceeds the localStorage quota. The message does not explain why, and the 2 MB rule in the code does not match the effective limit.
- Side effect: After a large avatar, localStorage is near its quota, so unrelated later writes (bookings) can start to fail.
- Test data left behind: member profile picture is a 1.9 MB junk data URL (until purge).
