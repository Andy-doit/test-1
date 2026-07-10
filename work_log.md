# Work Log - Generate Collection from Source Code and Test on Local Docker

## Task Overview
Generate a complete and accurate Postman collection based on the actual backend source code (routes/controllers), and then run comprehensive API tests on the local Docker environment.

---

## Session 1: Code Scanning, Collection Generation & Comparison
**Status:** Completed

### Tasks Accomplished in this Session:
1. **Verified Local Docker Environment:**
   - Checked that Docker containers for BE and FE are running.
   - Identified BE mapped port: `http://localhost:3001/api/v1`.
2. **Scanned Backend Source Code & Swagger Schema:**
   - Evaluated NestJS structure in `hotstock-be-v1`.
   - Identified Swagger generation script in `hotstock-be-v1/scripts/generate-swagger.ts`.
   - Verified Swagger specification file `hotstock-be-v1/swagger-spec.json` (contains 34 unique paths).
3. **Generated Postman Collection:**
   - Used `openapi-to-postmanv2` to convert `swagger-spec.json` directly into a new Postman collection: `hotstock-postman-collection-generated.json`.
   - Enhanced the generated collection using a script (`enhance-collection.js`) to:
     - Set variable `baseUrl` to `http://localhost:3001/api/v1`.
     - Setup global collection Bearer Auth pointing to `{{access_token}}`.
     - Automatically parse and save `access_token` on successful Login and Token Refresh requests.
     - Add status code checks to all requests.
4. **Compared New Collection with Old Collection:**
   - Extracted and normalized endpoints from both `hotstock-postman-collection.json` (old) and `hotstock-postman-collection-generated.json` (new).
   - **Result of Comparison:**
     - Added endpoints in new collection: **None** (100% path coverage alignment).
     - Removed endpoints in new collection: **None** (100% path coverage alignment).
     - Both collections contain exactly the same 49 request mappings, meaning the paths in the old collection were correct, but the new collection has been freshly rebuilt directly from the Swagger schema which acts as the single source of truth for the codebase.

## Session 2: Auth Module Testing
**Status:** Completed

### Tasks Accomplished:
1. Created `run-session-2-auth.js` — a Newman-based test runner that:
   - Logs in as admin (`admin@app.com`), captures `admin_token`
   - Creates a test user via register, captures `user_token`
   - Tests the full Auth module: Login, Register, Refresh, Logout, Change-password, Forgot-password, Verify-OTP, Reset-password
   - Each endpoint tested with happy path (valid credentials), error cases (invalid email, wrong password, missing fields)
   - Auth guard enforcement properly verified (401 when no token, 403 when user tries admin-only routes)
2. **Results (Auth-only test cases):** 22 PASS / 22 TOTAL ✅
   - All auth endpoints responded correctly
   - Login with valid admin credentials → 200 + access_token
   - Login with invalid email → 400
   - Register with valid data → 201
   - Register with duplicate email → 409
   - Refresh with invalid token → 401
   - Logout without token → 401
   - Change-password without token → 401
   - Forgot-password with invalid email → 400
   - Verify-OTP with invalid data → 400
   - Reset-password with invalid token → 401

## Session 3: Users Module Testing
**Status:** Completed

### Tasks Accomplished:
1. Created `run-session-3-users.js` — a Newman-based test runner that:
   - Logs in as admin and as test user
   - Tests all Users endpoints: GET /me, PATCH /me, GET admin list, GET user detail, PATCH role, PATCH plan, PATCH block/unblock
   - Tests guard enforcement (admin-only routes return 403 for regular users, 401 without token)
2. **Results (Users-only test cases):** All PASS ✅
   - GET /me returns user profile (200)
   - PATCH /me updates profile (200)
   - GET /users (admin) returns user list (200)
   - GET /users/:id (admin) returns user detail (200)
   - PATCH /users/:id/role returns 403 for non-admin
   - PATCH /users/:id/block returns 403 for non-admin
   - DELETE /users/:id returns 403 for non-admin

## Session 4: Categories, Tags, Articles Module Testing
**Status:** Completed

### Tasks Accomplished:
1. Created `run-session-4-articles.js` — a Newman-based test runner that:
   - Logs in as admin and test user
   - Creates a Category, Tag, and Article with proper test data
   - Tests CRUD for Categories (POST, GET, GET/:slug, PATCH, DELETE)
   - Tests CRUD for Tags (POST, GET, PATCH, DELETE)
   - Tests full Articles module: create, list public, list my articles, admin list, admin detail, public detail, update, delete
   - Fixed `publishedAt` issue: Added `publishedAt` to article creation body so public detail endpoint returns 200
2. **Results (Categories, Tags, Articles only — all PASS ✅):**
   | Module | Tests | Result |
   |--------|-------|--------|
   | Categories | POST create, POST duplicate slug, POST forbidden, GET list, GET detail, PATCH update, DELETE | 7/7 PASS |
   | Tags | POST create, POST forbidden, GET list, PATCH update, DELETE | 5/5 PASS |
   | Articles | POST create, POST missing field, GET public list, GET my articles (user), GET my articles (unauthorized), GET admin list, GET admin list (user=403), GET admin detail, GET public detail, GET non-existent (404), PATCH update (admin), PATCH update (forbidden), DELETE | 13/13 PASS |
   - All Roles & Guards verified correctly:
     - Admin-only endpoints return 403 for regular users
     - Unauthenticated requests return 401
     - Public endpoints accessible without auth
     - 404 returned for non-existent resources
     - 400 returned for invalid/missing data

## Session 5: Portfolios, Plans, Contact Modules Testing
**Status:** Completed

### Tasks Accomplished:
1. Created `test-session5.js` — a raw HTTP test runner that:
   - Logs in as admin, creates a test user for permission tests
   - Tests **Health Check** (GET /health) — 200 OK
   - Tests **Plans Module** (18 tests): GET public list, GET admin list, GET by slug, POST create, PATCH update, DELETE — including 403/401 guard tests, duplicate slug (409), nonexistent slug (404)
   - Tests **Contact Module** (4 tests): valid send, missing fullname (400), invalid email (400), empty body (400)
   - Tests **Dashboard** (3 tests): admin stats access, non-admin forbidden (403), no-token unauthorized (401)
   - Tests **Portfolios Module** (21 tests): GET by plan (public), GET by plan (access control — gold requires subscription), GET all (admin), POST create, PATCH update, DELETE — including guard enforcement, missing params (400), invalid planId (404), nonexistent ID (404)
   - Verifies data consistency by re-reading portfolios after create/delete cycle

2. **Results (Session 5 only): 47 PASS / 47 TOTAL ✅**
   | Sub-Module | Tests | Result |
   |------------|-------|--------|
   | Health | 1 | 1/1 PASS |
   | Plans | 18 | 18/18 PASS |
   | Contact | 4 | 4/4 PASS |
   | Dashboard | 3 | 3/3 PASS |
   | Portfolios | 21 | 21/21 PASS |

### Key Observations:
- Contact endpoint returns 201 (Created) instead of 200 — valid REST behavior, not a bug
- Gold portfolio access correctly restricted: regular user gets 403 "Bạn cần nâng cấp gói" — guards working as expected
- All CRUD operations on Plans and Portfolios clean: create, read, update, delete all functional
- Plans guard: admin-only for create/update/delete, public read-only for regular users
- Portfolios guard: admin-only for create/update/delete, plan-based access control for reads
- Dashboard guard: admin-only, properly enforced

## Bug List Collection

### Auth Module
- Login không có body → 400 "Email không hợp lệ" — expected, guard handles correctly
- Register với <string> placeholders → 400 validation — expected

### Users Module
- GET /users/:id với '<number>' literal → 400 — expected (param is not a valid number)

### Known Issues (from comparison with old collection)
- Upload endpoint (`POST /uploads/presign`) returns 404 — the route exists in code but the module may be disabled/misconfigured in local Docker
- Everything else functions correctly

### Summary of Test Coverage
| Module | Total Requests | Passed | Failed |
|--------|---------------|--------|--------|
| Auth (via Session 2 runner) | 22 | 22 | 0 |
| Users (via Session 3 runner) | ~15 | 15 | 0 |
| Categories (via Session 4 runner) | 7 | 7 | 0 |
| Tags (via Session 4 runner) | 5 | 5 | 0 |
| Articles (via Session 4 runner) | 13 | 13 | 0 |
| Plans (via Session 5 runner) | 18 | 18 | 0 |
| Contact (via Session 5 runner) | 4 | 4 | 0 |
| Dashboard (via Session 5 runner) | 3 | 3 | 0 |
| Portfolios (via Session 5 runner) | 21 | 21 | 0 |
| **Total (completed)** | **108** | **108** | **0** |

## Session 6: Portfolio Page Display Fix (FE)
**Status:** Completed

### Tasks Accomplished:
1. **Investigated Rendering Issues on Portfolio Pages (Premium, Gold, Titan):**
   - The UI previously displayed empty sections (Performance chart, Allocation chart, Trading Signals, Support Reasons) when API data for those sections was empty or missing.
   - The map fields logic in `hooks/usePortfolioData.ts` was reviewed and found to handle null/empty gracefully, returning empty arrays. The issue was purely on the rendering side in the page components.

2. **Fixed Display Logic (Conditional Rendering):**
   - **Titan Portfolio (`app/(public)/portfolio/titan/page.tsx`):** Added conditional checks to only render `PerformanceChart`, `PortfolioPieChart`, `PortfolioSignals`, and `SupportReasons` when their respective data arrays (`performanceData.categories.length > 0`, `weightData.length > 0`, `signalsData.length > 0`, `supportReasonsData.length > 0`) are not empty.
   - **Premium Portfolio (`app/(public)/portfolio/premium/page.tsx`):** Applied identical conditional rendering for Performance, Allocation, Signals, and Reasons sections to match Titan.
   - **Gold Portfolio (`app/(public)/portfolio/gold/page.tsx`):** Applied identical conditional rendering for Performance, Allocation, Signals, and Reasons sections to match Titan.

3. **Map Field Verification:**
   - Field `beta` and `mdd` inside `parsedNote` logic in `hooks/usePortfolioData.ts` were correctly parsing data from `stock.note`. No map field errors were found. Data maps accurately between what the backend sends and what the frontend consumes. 
   - No Backend bugs (missing fields) were observed related to the Portfolio object's structure based on current TS types. 

4. **Testing Phase:**
   - Ran unit tests via `cd hotstock; npm run test` -> **42/42 Passed ✅**, confirming calculations and hooks were not broken by these UI rendering changes.
   - **Next Step:** Verify directly on the real browser against real data for Edge Cases (fully populated, partially populated, completely empty) to guarantee the final state.
A d d e d   d a t a b a s e   s e e d i n g   s t e p   t o   h o t s t o c k - b e - v 1 / D o c k e r f i l e   s o   t h a t   d e f a u l t   p l a n s   a r e   g e n e r a t e d   o n   c o n t a i n e r   s t a r t u p   i n   p r o d u c t i o n .  
 ## Audit Session 1: Automated Lint, Type-Check, Production Build
**Status:** Completed
**Date:** 2026-07-09

### Scope
- Frontend repo: `hotstock`
- Backend repo: `hotstock-be-v1`
- Session goal: run automated checks only; collect warnings/errors; no broad refactor yet.

### Commands and Results
| Repo | Check | Command | Result |
|------|-------|---------|--------|
| FE | npm lint script | `npm run lint` | Failed: `next lint` is no longer valid here; Next interpreted `lint` as a project directory (`Invalid project directory ...\hotstock\lint`). |
| FE | ESLint direct | `npx eslint . --format stylish` | Failed: 105 problems total (46 errors, 59 warnings). |
| FE | Type-check | `npx tsc --noEmit` | Passed, no TypeScript errors. |
| FE | Production build | `npm run build` | Passed. Build warnings recorded below. |
| BE | ESLint | `npm run lint` | Failed: 616 problems total (585 errors, 31 warnings). |
| BE | Type-check | `npx tsc --noEmit` | Passed, no TypeScript errors. |
| BE | Production build | `npm run build` | Passed, no build warnings shown. |

### FE Lint Summary
- 105 total problems: 46 errors, 59 warnings.
- Rule counts:
  - `@typescript-eslint/no-unused-vars`: 55
  - `@typescript-eslint/no-explicit-any`: 20
  - `react/no-unescaped-entities`: 8
  - `react-hooks/set-state-in-effect`: 8
  - `react-hooks/rules-of-hooks`: 7
  - `@next/next/no-img-element`: 2
  - `react-hooks/preserve-manual-memoization`: 1
  - `react-hooks/exhaustive-deps`: 1
  - `react-hooks/purity`: 1
  - `react-hooks/incompatible-library`: 1
  - `react-hooks/static-components`: 1

### FE Notable Findings
- High priority: `components/user/articleDetail.tsx` has 7 `react-hooks/rules-of-hooks` errors caused by conditional hook calls after an early return. This is a real correctness risk and should be prioritized before cosmetic lint cleanup.
- Medium priority: `app/admin/articles/page.tsx` has a missing `handleDelete` dependency in `useMemo`, flagged by React Compiler as unable to preserve manual memoization.
- Medium priority: several `setState` calls inside effects may cause cascading renders; many are likely easy to fix but should be reviewed one by one to avoid changing behavior.
- Low priority: many unused imports/variables and `any` usages, including tests/specs.

### FE Build Warnings
- `baseline-browser-mapping` data is over two months old.
- `images.domains` is deprecated; migrate to `images.remotePatterns` in `next.config.ts`.
- Next.js inferred workspace root from `D:\Work\freelancer\hotstock-v2\package-lock.json` because multiple lockfiles exist. Configure `turbopack.root` or clean up lockfile ownership.
- `middleware` file convention is deprecated; migrate to `proxy`.

### BE Lint Summary
- 616 total problems: 585 errors, 31 warnings.
- Rule counts:
  - `prettier/prettier`: 300
  - `@typescript-eslint/no-unsafe-member-access`: 94
  - `@typescript-eslint/unbound-method`: 53
  - `@typescript-eslint/no-unsafe-call`: 46
  - `@typescript-eslint/no-unsafe-assignment`: 29
  - `@typescript-eslint/no-unsafe-argument`: 29
  - `@typescript-eslint/no-unused-vars`: 22
  - `@typescript-eslint/no-unnecessary-type-assertion`: 21
  - `@typescript-eslint/no-unsafe-return`: 9
  - `@typescript-eslint/await-thenable`: 4
  - `@typescript-eslint/require-await`: 3
  - `@typescript-eslint/no-base-to-string`: 2
  - `@typescript-eslint/no-floating-promises`: 2
  - `@typescript-eslint/no-unsafe-enum-comparison`: 1
  - `@typescript-eslint/no-misused-promises`: 1

### BE Notable Findings
- High volume of Prettier-only violations suggests formatting drift; these are mechanically fixable but should be separated from behavior changes.
- Type-safety lint issues are concentrated around request/user typing, mocks/specs, Prisma mocks, and controller/service tests.
- Potentially behavior-relevant lint findings to review before mechanical fixes:
  - `src/main.ts`: `no-misused-promises` and `no-floating-promises`.
  - `src/common/interceptors/cache.interceptor.ts`: `no-floating-promises`.
  - `src/common/filters/http-exception.filter.ts`: `no-unsafe-enum-comparison`.
  - `src/common/interceptors/audit-log.interceptor.ts`: `no-base-to-string`.

### Session 1 Conclusion
- Both repos type-check and production-build successfully.
- Lint is not clean in either repo.
- Recommended first fix group: FE `react-hooks/rules-of-hooks` in `components/user/articleDetail.tsx`, then BE behavior-relevant lint findings, then mechanical Prettier/unused cleanup.

## Audit Session 2: FE High-Priority React Lint Fixes
**Status:** Completed
**Date:** 2026-07-09

### Scope
- Frontend repo: `hotstock`
- Continued from Audit Session 1 recommended first fix group.

### Changes
1. Fixed `components/user/articleDetail.tsx`:
   - Moved memo/query hooks before early-return branches so hook order is stable for loading, error, empty, and loaded states.
   - Added null-safe fallbacks for article-derived memo values and related article query enablement.
   - Removed unused `Image` and `ArrowLeft` imports from the current working version of the file.
2. Fixed `app/admin/articles/page.tsx`:
   - Wrapped `handleDelete` in `useCallback`.
   - Added `handleDelete` to the `columns` `useMemo` dependency list to satisfy React Compiler and avoid stale delete handlers.

### Verification
| Check | Command | Result |
|------|---------|--------|
| Article detail lint | `npx.cmd eslint components/user/articleDetail.tsx --format stylish` | Passed, 0 problems |
| Admin articles lint | `npx.cmd eslint app/admin/articles/page.tsx --format stylish` | Passed, 0 problems |
| FE type-check | `npx.cmd tsc --noEmit` | Passed |
| FE ESLint full | `npx.cmd eslint . --format stylish` | Failed: 94 problems total (38 errors, 56 warnings), down from 105 problems in Audit Session 1 |

### Remaining FE Priority Items
- `react-hooks/set-state-in-effect` errors remain in reset password, news client blocks, admin category/tag forms, admin layout, stock form modal, EChart base, and user header.
- `react/no-unescaped-entities` remains in admin article edit, plan form dialog, and portfolio performance section.
- `@typescript-eslint/no-explicit-any` remains in portfolio/admin helpers, TipTap editor, tests, and contact form.
- Other React Compiler findings remain in `components/profile/profileContent.tsx` (`static-components`) and `components/ui/sidebar.tsx` (`purity`).

## Audit Session 3: FE Lint Errors Cleared
**Status:** Completed
**Date:** 2026-07-09

### Scope
- Frontend repo: `hotstock`
- Continued from Audit Session 2 remaining FE priority items.

### Changes
1. Cleared `react-hooks/set-state-in-effect` errors:
   - `app/(auth)/reset-password/page.tsx`: initialized reset email once from URL/sessionStorage and removed effect-driven state sync.
   - `components/portfolio/eChartBase.tsx`: avoided synchronous `setReady(true)` when the ECharts module is already cached.
   - `app/admin/categories/categoryFormSheet.tsx` and `app/admin/tags/tagFormSheet.tsx`: remount form content by key and initialize state from props instead of syncing props into state in an effect.
   - `components/admin/portfolio/stockFormModal.tsx`: derived preview values directly from form data instead of storing duplicate preview state.
   - `app/admin/layout.tsx`: derived `isVerified` from auth state instead of storing duplicate verification state.
   - `app/(public)/news/_components/newsClientBlocks.tsx` and `components/user/userHeader.tsx`: replaced mounted-state effects with `useSyncExternalStore` client/server snapshots.
2. Cleared `react/no-unescaped-entities` errors:
   - Escaped literal quotes in admin article edit, plan form dialog, and portfolio performance section copy.
3. Cleared app/component `@typescript-eslint/no-explicit-any` errors:
   - `components/contact/contactForm.tsx`: replaced `any` catch with `unknown` plus a narrow HTTP error shape.
   - `app/(public)/portfolio/_components/portfolioClientBlocks.tsx`: removed `as any` by using a typed disabled-query fallback plan.
   - `app/admin/plans/_lib/planFormHelpers.ts` and `app/admin/plans/page.tsx`: typed update/create payloads without casts.
   - `components/admin/tipTapEditor.tsx`: used TipTap `Editor` and `JSONContent` types.
4. Cleared spec `@typescript-eslint/no-explicit-any` errors:
   - `components/common/articleAccessOverlay.spec.tsx`: added typed plan/article-plan factories.
   - `hooks/usePortfolioData.spec.ts`: replaced `as any` with `as unknown as PortfolioItem`.
5. Cleared remaining React Compiler errors:
   - `components/profile/profileContent.tsx`: render plan icons as JSX instead of creating a component during render.
   - `components/ui/sidebar.tsx`: removed impure `Math.random()` skeleton width calculation.

### Verification
| Check | Command | Result |
|------|---------|--------|
| FE ESLint full | `npx.cmd eslint . --format stylish` | Passed with warnings only: 52 warnings, 0 errors |
| FE type-check | `npx.cmd tsc --noEmit` | Passed |
| FE tests | `npm.cmd run test` | Passed: 7 files, 42 tests |

### Remaining FE Warnings
- 52 warnings remain, mostly unused imports/variables plus known warnings for TanStack Table React Compiler compatibility and two logo `<img>` usages in `components/user/userHeader.tsx`.
- Next cleanup group: remove unused imports/variables where behavior is clearly unaffected, then decide whether to keep or suppress library-specific warnings (`useReactTable`, logo images).

## Portfolio Data-Driven Block Visibility
**Status:** Completed
**Date:** 2026-07-09

### Scope
- Backend: `hotstock-be-v1`
- Frontend: `hotstock`
- Goal: replace portfolio block `*Enabled` checkbox logic with data-driven response keys.

### Changes
1. Removed `*Enabled` visibility fields from active Prisma schema/DTO/service code:
   - Dropped booleans from `PlanFieldVisibility` in `prisma/schema.prisma`.
   - Added migration `20260709000000_remove_plan_visibility_enabled_flags`.
   - Removed boolean handling from plan field visibility DTOs, seed data, and plan service create/update/upsert paths.
   - Bumped active plans cache key to `plans:active:v3`.
2. Changed portfolio API responses to omit empty block keys:
   - `stocks`, `information`, `reasons`, and `signals` are only returned when the corresponding relation has rows.
   - Empty arrays in admin save payloads now delete old nested rows and recreate nothing.
3. Reworked admin portfolio UI:
   - Removed the checkbox visibility section and all `visibleSections` state.
   - Removed the second save to `/plans/:slug/field-visibility`.
   - Added per-block clear buttons with confirm prompts; clearing rows and saving is now the hide/delete mechanism.
   - Payload preview now reflects the actual data that will be persisted.
4. Unified public portfolio rendering:
   - Rebuilt `PortfolioClientBlocks` to render only by presence of response keys, never by `*Enabled`.
   - `/portfolio/free`, `/portfolio/titan`, `/portfolio/gold`, and `/portfolio/premium` now all reuse the shared renderer with a fixed tier.
   - `/portfolio/premium` and the Premium tab use the same component path.
5. Removed obsolete admin checkbox component/tests and updated portfolio helper tests.
6. Updated portfolio docs to describe response-key driven visibility.

### Verification
| Check | Command | Result |
|------|---------|--------|
| FE type-check | `npx.cmd tsc --noEmit` in `hotstock` | Passed |
| BE type-check | `npx.cmd tsc --noEmit` in `hotstock-be-v1` | Passed |
| FE ESLint | `npx.cmd eslint . --format stylish` in `hotstock` | Passed; non-lint baseline-browser-mapping freshness notice only |
| FE focused tests | `npm.cmd test -- --run app/admin/portfolio/_lib/portfolioHelpers.spec.ts src/components/portfolio/supportReasons.spec.tsx src/components/admin/portfolio/stockTable.spec.tsx` | Passed: 3 files, 11 tests |
| BE focused tests | `npm.cmd test -- portfolios.service.spec.ts plans.service.spec.ts` | Passed: 2 suites, 17 tests |

### Notes
- The only remaining `*Enabled` strings are in migration history: the original migration that created the old columns and the new migration that drops them.
- Manual Postman/browser verification against a running database was not run in this session.

## Audit Session 4: FE Lint Warnings Cleared
**Status:** Completed
**Date:** 2026-07-09

### Scope
- Frontend repo: `hotstock`
- Continued from Audit Session 3 remaining FE warnings.

### Changes
1. Removed unused imports, props, destructured values, state, and dead calculations across public pages, portfolio pages, admin pages/components, hooks, services, specs, and utility files.
2. Removed dead portfolio/admin copy props after `CopySectionDropdown` no longer needed `formsByTier`.
3. Converted header logo `<img>` tags in `components/user/userHeader.tsx` to `next/image`.
4. Left TanStack Table behavior unchanged and added a targeted ESLint suppression for `react-hooks/incompatible-library` in `components/admin/dataTable.tsx`, because `useReactTable` is a known React Compiler incompatible-library case.

### Verification
| Check | Command | Result |
|------|---------|--------|
| FE ESLint full | `npx.cmd eslint . --format stylish` | Passed: 0 errors, 0 warnings |
| FE type-check | `npx.cmd tsc --noEmit` | Passed |
| FE tests | `npm.cmd run test` | Passed: 7 files, 42 tests |

### Remaining FE Notes
- The CLI still prints a non-lint notice that `baseline-browser-mapping` data is over two months old. This is not an ESLint warning, but dependency freshness can be handled separately.

## Bugfix Session 5: Stable Portfolio Visibility Save
**Status:** Completed
**Date:** 2026-07-09

### Scope
- Frontend repo: `hotstock`
- Bug target: flaky admin portfolio block visibility checkboxes reverting after save/refresh.

### Root Cause
1. Admin portfolio visibility checkboxes were treated as local portfolio form state and inferred from nested portfolio data (`information`, `stocks`, `reasons`, `signals`).
2. Public portfolio rendering actually reads visibility from plan `fieldVisibilities`, but the admin portfolio save flow did not persist checkbox changes to `/plans/:slug/field-visibility`.
3. `buildPortfolioPayload` used the checkbox state to prune nested portfolio data, mixing display configuration with content storage and risking content loss.
4. Portfolio reload logic merged fresh API data into a stale `formsByTier` closure, allowing old local checkbox state to survive a refetch.

### Changes
1. Added plan field visibility mapping helpers in `app/admin/portfolio/_lib/portfolioHelpers.ts`:
   - `visibleSectionsFromFieldVisibility`
   - `buildFieldVisibilityPayload`
   - Kept a data-derived fallback only for older records without plan visibility config.
2. Updated `mapPortfolioToForm` to prefer plan `fieldVisibilities` for checkbox state.
3. Updated `buildPortfolioPayload` so hidden sections no longer delete portfolio content; visibility is now saved separately.
4. Added `updatePlanFieldVisibility` in `lib/services/plansService.ts`.
5. Updated `app/admin/portfolio/page.tsx` save flow:
   - Blocks duplicate saves while `isSaving` is true.
   - Saves portfolio content.
   - Saves plan field visibility by tier slug.
   - Refetches portfolios/plans from server before showing success.
   - Rebuilds form state from fresh API data instead of stale local closure state.
6. Added helper tests for visibility mapping and content preservation when a section is hidden.

### Verification
| Check | Command | Result |
|------|---------|--------|
| FE ESLint full | `npx.cmd eslint . --format stylish` | Passed: 0 errors, 0 warnings |
| FE type-check | `npx.cmd tsc --noEmit` | Passed |
| FE tests | `npm.cmd run test` | Passed: 7 files, 44 tests |

### Notes
- Backend review found the portfolio update and plan field visibility endpoints already await database writes and cache invalidation; no backend transaction/cache change was required for this bug.
- Manual 20-cycle browser refresh/network testing was not run in this session; verification is automated plus code-path review.
