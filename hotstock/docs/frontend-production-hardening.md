# Frontend Production Hardening Report

This document summarizes the security and production hardening steps taken during the Principal Architecture Review, as well as recommendations for remaining structural improvements.

## 1. Accomplished Hardening Steps

### A. Strict CSP and Security Headers
- **File Updated:** `next.config.ts`
- **Actions Taken:** 
  - Tightened Content-Security-Policy (CSP) by restricting script-src, style-src, font-src, and img-src to known trusted origins and `self`.
  - Added strict anti-clickjacking headers (`X-Frame-Options: SAMEORIGIN`) and `X-Content-Type-Options: nosniff`.
  - Configured strict HTTP Strict Transport Security (HSTS).
  - Disabled `dangerouslyAllowSVG` in Next.js Image Optimization to mitigate SVG-based XSS attacks.

### B. Secure File Upload Handler
- **File Updated:** `app/api/upload/route.ts`
- **Actions Taken:** 
  - Added exact **Magic Byte Validation** (file signature checks) for incoming images.
  - Mitigates Polyglot File attacks where malicious executables or scripts are disguised as valid image extensions.
  - Now strictly enforces `jpeg`, `png`, `gif`, and `webp` by verifying the header bytes of the Buffer.

### C. Cookie Security Enhancements
- **File Updated:** `lib/utils/cookies.ts`
- **Actions Taken:**
  - Hardened client-side session cookie persistence by forcing `SameSite=Strict` and enforcing the `Secure` flag dynamically when operating under `https`.
  - Reduced token max-age from 30 days to 7 days to reduce risk windows for compromised credentials.

### D. Centralized UI Form Error Handling
- **File Updated:** `components/auth/AuthForm.tsx`
- **Actions Taken:**
  - Removed a highly problematic global event listener (`window.addEventListener("unhandledrejection", ...)`).
  - Event listeners mounted within UI components to capture global window events can trigger unpredictable side effects across the app's routing lifecycle and create memory leaks. Proper React Hook Form structure inherently avoids these Promise Rejection issues.

### E. Font Optimization and Hydration Fixes
- **File Updated:** `app/layout.tsx`
- **Actions Taken:**
  - Re-attached properly configured Next.js `next/font` (Geist and Geist_Mono) bindings to the `body` CSS class, ensuring FOIT/FOUT flashes are prevented and layout shifts (CLS) are zeroed.
  - Retained `suppressHydrationWarning` on `html` and `body` to properly support `next-themes` DOM manipulations.

## 2. Pending Refactoring & Architectural Debt

### A. Migration to Backend-For-Frontend (BFF) Auth Proxy
- **Current State:** The client receives JSON tokens directly from Next.js rewrites and stores them using `document.cookie` (accessible to JS).
- **Risk:** High exposure to XSS payload stealing `auth_token` and `refresh_token`.
- **Recommendation:** Implement Next.js App Router Route Handlers (`/api/auth/login`, `/api/auth/refresh`) that call the backend (port 3001) server-side and inject strictly `HttpOnly` cookies into the browser response.
- **Complexity:** Requires rewriting `httpClient.ts` (specifically Axios interceptors) to rely purely on the browser appending cookies via `withCredentials: true` rather than manually extracting strings via `getClientCookie`.

### B. Charting Library Consolidation
- **Current State:** Both `echarts` and `recharts` are listed as dependencies in `package.json`.
- **Risk:** Increases the main application bundle size dramatically. Duplicate visualization libraries cause maintenance overhead and performance degregation.
- **Recommendation:** Perform a UI audit across `/portfolio` and `/market` routes. Select a single library (preferably ECharts for high-density financial data) and refactor the conflicting components to use the chosen unified system.

### C. Remove React Hook Form Custom Resolvers
- **Current State:** The codebase uses `createSafeZodResolver` instead of standard `@hookform/resolvers/zod`.
- **Recommendation:** Standardize form validation by using the official `@hookform/resolvers/zod` package. Custom resolvers often fall out of sync with Zod updates, leading to silent validation failures and hard-to-trace TS type errors.