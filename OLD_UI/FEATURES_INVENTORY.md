# HR360 — frontend feature inventory (from archived `OLD_UI`)

This document captures **screens, flows, and integration points** present in the pre-reset codebase so the new UI can **rebuild without losing coverage**. Paths are relative to `OLD_UI/app/`.

## Authentication

| Route / file | Purpose |
|--------------|---------|
| `(auth)/login.jsx` | Email/password login; stores `access_token`, `refresh_token`, `username`, `user` JSON in AsyncStorage; navigates to `/dashboard`. Optional Google sign-in placeholder. |
| `(auth)/signup.jsx` | Registration flow (pair with login). |
| `index.jsx` (root) | Boot: reads token → `/dashboard` or `/login`. |

**API (see `OLD_UI/src/services/api.js`):** `POST /api/login`, `POST /api/register`; mock mode can disable real backend.

## Tab shell (legacy)

| Area | Notes |
|------|--------|
| `(tabs)/_layout.jsx` | Tab bar (previously used experimental native tabs + glass). **New app should use standard Expo Router `Tabs`.** |

**Intended top-level areas (replicate in new tabs):** Dashboard (home), Employees, Payroll, Settings. Attendance existed as its own tab and/or under dashboard — see below.

## Dashboard stack (`(tabs)/dashboard/`)

Central hub with nested stacks/screens:

| Path | Purpose |
|------|---------|
| `index.jsx` | Main dashboard home. |
| `_layout.jsx` | Stack for dashboard subtree. |

### Employees (under dashboard — duplicate tree vs tab `employees/`)

| Path | Purpose |
|------|---------|
| `employees/index.jsx` | List employees. |
| `employees/add.jsx` | Add employee. |
| `employees/[id].jsx` | Employee detail / edit. |

### Projects

| Path | Purpose |
|------|---------|
| `projects/index.jsx` | Project list. |
| `projects/add.jsx` | Create project. |
| `projects/[id].jsx` | Project detail. |
| `projects/project-detaills.jsx` | Extra project details (typo in filename in legacy). |

### Jobs

| Path | Purpose |
|------|---------|
| `jobs/index.jsx` | Jobs list. |
| `jobs/add.jsx` | Add job. |
| `jobs/[id].jsx` | Job detail. |

### Leave

| Path | Purpose |
|------|---------|
| `leave/index.jsx` | Leave overview. |
| `leave/add.jsx` | Request leave. |
| `leave/balance.jsx` | Balances. |
| `leave/calendar.jsx` | Calendar view. |

### Payroll (under dashboard)

| Path | Purpose |
|------|---------|
| `payroll/payroll.jsx` | Payroll main. |
| `payroll/add.jsx` | Add payroll entry. |
| `payroll/dashboard.jsx` | Payroll dashboard. |
| `payroll/deductions.jsx` | Deductions. |
| `payroll/payslip.jsx` | Payslip. |
| `payroll/payroll-item.jsx` | Single payroll item. |

### Attendance (under dashboard)

| Path | Purpose |
|------|---------|
| `attendance/index.jsx` | Attendance analytics/charts (heavy UI). |
| `attendance/roster.jsx` | Roster. |

### Clocking / face

| Path | Purpose |
|------|---------|
| `clocking/face-register.jsx` | Face registration for clock-in. |
| `clocking/face-registeration.jsx` | Alternate/legacy registration screen (typo in name). |

### Documents

| Path | Purpose |
|------|---------|
| `documents/index.jsx` | Documents list. |
| `documents/upload.jsx` | Upload documents. |

### Application / screening

| Path | Purpose |
|------|---------|
| `application/index.jsx` | Applications list. |
| `application/[id].jsx` | Application detail. |
| `application/screening.jsx` | Screening workflow. |

### Other dashboard modules

| Path | Purpose |
|------|---------|
| `clients/index.jsx`, `clients/add.jsx` | Clients. |
| `department/index.jsx`, `department/add.jsx` | Departments. |
| `announcement/index.jsx`, `announcement/add.jsx` | Announcements. |
| `performance/performance.jsx` | Performance reviews. |
| `settings/settings.jsx` | Settings nested under dashboard (vs tab settings). |

## Top-level tab: Employees (`(tabs)/employees/`)

| Path | Purpose |
|------|---------|
| `_layout.jsx` | Stack. |
| `index.jsx` | Employees list (tab entry). |
| `add.jsx` | Add employee. |
| `[id].jsx` | Employee detail / edit (guarded for missing fields in later fixes). |

**Note:** Legacy duplicated “employees” under `dashboard/employees/` — new routing should pick **one** canonical tree (e.g. tab stack only, or dashboard hub only).

## Top-level tab: Attendance (`(tabs)/attendance/`)

| Path | Purpose |
|------|---------|
| `_layout.jsx` | Stack. |
| `index.jsx` | Attendance charts / stats (performance-sensitive). |
| `roster.jsx` | Roster. |

## Top-level tab: Payroll (`(tabs)/payroll/`)

| Path | Purpose |
|------|---------|
| `_layout.jsx` | Stack. |
| `index.jsx` | Payroll tab home. |
| `dashboard.jsx` | Payroll dashboard. |
| `payroll.jsx` | Payroll screen (duplicate naming with dashboard subtree — source of router warnings). |
| `add.jsx` | Add. |
| `deductions.jsx` | Deductions. |
| `payslip.jsx` | Payslip. |
| `payroll-item.jsx` | Item detail. |

## Top-level tab: Settings (`(tabs)/settings/`)

| Path | Purpose |
|------|---------|
| `_layout.jsx` | Stack. |
| `index.jsx` | Settings home. |
| `settings.jsx` | Extra settings screen (duplicate route name issues with `index` in legacy). |

## Shared services (`OLD_UI/src/`)

| File | Purpose |
|------|---------|
| `services/api.js` | Axios instance; mock adapter for offline UI (`BACKEND_ENABLED`). |
| `services/faceAuthService.jsx` | Face / clocking related API helpers. |

## Hooks & theme (`OLD_UI/hooks/`, `OLD_UI/constants/`)

- `use-color-scheme`, `use-theme-color`, `use-color-scheme.web.ts`
- `constants/theme.ts`

## Known legacy issues to avoid in the new UI

- **Duplicate route names:** e.g. `payroll/payroll.jsx` + `payroll/index.jsx`, `settings/settings.jsx` + `settings/index.jsx` — use **one screen per segment** or explicit `Stack.Screen` names.
- **Native tabs + mismatched `Trigger` names:** triggers must match route segments exactly.
- **Heavy attendance + chart-kit:** defer loading or isolate screen if reintroduced.

---

*Generated when moving the previous app into `OLD_UI/` for a clean Expo Router v2 rebuild.*
