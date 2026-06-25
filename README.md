# ClinicFlow Appointment System

> [!IMPORTANT]
> **🤖 Practice Test Automation Sandbox**  
> This application is specifically designed and optimized as a sandbox for practicing modern web test automation (e.g., Playwright, Cypress, Selenium, Robot Framework). It features pre-configured test accounts, dynamic UI elements, form validation rules, local storage persistence, and comprehensive `data-testid` attributes.

A modern, responsive healthcare appointment management application built with React, Vite, and Tailwind CSS. It serves as a realistic target for UI testing, end-to-end (E2E) automation, accessibility auditing, and state validation.

---

## ⚡ TL;DR / Quick Start

Get the application up and running locally in seconds:

```bash
# 1. Clone the repository and navigate to the project directory
cd clinic-flow-appointment-system

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173/clinicflowapp/` (or the URL printed in your terminal).

### 🔑 Test Accounts
The application is pre-seeded with mock data. Use the following credentials to test different user roles:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Patient (Member)** | `johnyjohnyyespapa@mail.com` | `EatingSugarNoPapa` | Book and manage personal appointments, edit settings |
| **System Admin** | `admin@example.com` | `ThisIsNotAdmin` | View stats, approve/cancel all appointments, view user directory |

---

## 🤖 Test Automation Sandbox Scenarios

This application provides several complex front-end interaction patterns to write and run automation tests against:

### 1. Dynamic Dropdown Cascades
In the [Booking Page](./src/pages/BookAppointment.jsx), the doctor dropdown options are dynamically filtered based on both the selected **Clinic** and **Department**.
*   **Test Idea:** Assert that selecting a specific clinic and department correctly updates and filters the available doctors in the dropdown, and that changing them clears invalid selections.

### 2. Date & Field Validation Assertions
The booking form requires all fields to be filled and validates that the selected appointment date is not in the past relative to the client system date.
*   **Test Idea:** Attempt to submit the booking form with a past date or missing fields, and assert that the warning alert (`data-testid="appointment-error"`) is visible and contains correct error messaging.

### 3. Role-Based Navigation & Page Guards
Different pages are protected under different navigation guards defined in [App.jsx](./src/App.jsx).
*   **Test Idea:** Attempt to navigate directly to `/admin-dashboard` or `/book-appointment` without logging in, and verify that the application redirects to `/login`. Verify that logging in as a member redirects you away if you try to access admin paths.

### 4. Local Storage Persistence & State Erasure
All data (users list, current session, booked appointments) is maintained client-side in the browser's `localStorage`. The settings page contains a "Danger Zone" button to purge this cache.
*   **Test Idea:** Assert that after booking an appointment and refreshing the browser, the appointment remains in the list. Click the **Purge Data** button and verify that the local storage is cleared and the session resets.

### 5. Theme State Verification
Supports theme switching between Light and Dark modes via the theme toggle button in the navbar.
*   **Test Idea:** Click the theme toggle and verify that the `<html>` element toggle-switches the `.dark` class, changing UI color schemes.

---

## 📁 Codebase Architecture

Below is an overview of the key files and directories:

```
clinic-flow-appointment-system/
├── index.html                  # Main entry page structure and font imports
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite configuration (sets base path to /clinicflowapp/)
├── tailwind.config.js          # Custom Tailwind configuration (colors, spacing, typography)
├── postcss.config.js           # PostCSS setup
└── src/
    ├── main.jsx                # Application root mounting & Context nesting
    ├── App.jsx                 # Routing configuration & route protection guards
    ├── index.css               # Global stylesheets, custom variables, and components classes
    ├── contexts/
    │   ├── AuthContext.jsx     # Handles authentication state, storage, and booking operations
    │   └── ThemeContext.jsx    # Handles light/dark theme class and local storage persistence
    ├── data/
    │   └── mockData.js         # Pre-configured list of clinics, departments, doctors, and time slots
    ├── layouts/
    │   ├── Layout.jsx          # General page framing (Header, Navigation, Main viewport, Footer)
    │   └── Navigation.jsx      # Top navbar with responsive layout and action controls
    └── pages/
        ├── Home.jsx            # Application landing page & feature showcases
        ├── Login.jsx           # Secure user authentication page
        ├── Register.jsx        # Account registration page
        ├── BookAppointment.jsx # Form-driven dynamic scheduling flow
        ├── MyAppointments.jsx  # Patient dashboard to view and cancel appointments
        ├── AdminDashboard.jsx  # Administrator control panel for global records
        └── UserSettings.jsx    # Patient profile, emergency details, and system purge utility
```

---

## 🛠 Script Commands

Run these scripts from the root directory:

- **Start Local Server:**
  ```bash
  npm run dev
  ```
  Runs Vite dev server.

- **Production Build:**
  ```bash
  npm run build
  ```
  Builds optimized files to the `dist/` directory.

- **Preview Production Build:**
  ```bash
  npm run preview
  ```
  Bootstraps a local server to preview the built package.
