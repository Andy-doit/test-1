# Principal Frontend Architecture Review

## 1. Executive Summary
The `hotstock` frontend architecture demonstrates a robust and modern approach suited for a mid-scale SaaS application (~1,000 active users). It avoids over-engineering and leverages Next.js 16 App Router, React 19, Tailwind CSS v4, and shadcn/ui effectively. The separation between server state (TanStack Query) and global client state (Zustand) is structurally sound. However, the architecture is compromised by critical security flaws in the Authentication and API layers, specifically concerning token storage, middleware validation, and an unauthenticated upload endpoint. Until these security architectural flaws are resolved, the application is not fit for production.

## 2. Architecture Strengths
* **Clear State Boundary:** Excellent separation of concerns between server state caching (TanStack Query) and global client UI state (Zustand).
* **Modern Routing Hierarchy:** Logical use of Next.js Route Groups (`(auth)`, `(public)`, `(protected)`) that keeps the file tree organized and visually segments layout hierarchies.
* **Service-Oriented API Abstraction:** The `lib/services/` and `hooks/` pattern abstracts Axios logic away from the UI components, keeping React components clean and focused purely on rendering.

## 3. Architecture Weaknesses
* **Insecure Authentication Architecture:** Tokens are stored in `document.cookie` instead of secure `HttpOnly` server cookies, rendering the application highly susceptible to XSS token theft.
* **Client-driven Security Middleware:** `middleware.ts` attempts to enforce RBAC (Role-Based Access Control) by trusting client-accessible cookies and decoding unsigned JWTs, allowing for trivial privilege escalation in the UI.
* **Exposed File Upload Architecture:** `app/api/upload/route.ts` lacks any authentication mechanisms, representing a major Denial of Service and malicious hosting risk.
* **Duplicate Library Debt:** Utilizing both `recharts` and `echarts` introduces unnecessary bundle size overhead.

## 4. Frontend Architecture Review
* **Finding:** The folder structure (`app/`, `components/`, `lib/`, `hooks/`, `stores/`) is highly logical and scalable for a SaaS application of this size. The separation of domain-driven components (`components/admin/`, `components/portfolio/`) from reusable UI primitives (`components/ui/`) is a best practice.
* **Status:** Well-designed. No changes recommended.

## 5. Next.js Architecture Review
* **Finding:** App Router layout hierarchy and Server/Client Component usage is generally correct. However, in `app/layout.tsx`, `Geist` and `Geist_Mono` are imported from `next/font/google` but never applied to the `<body>` element.
* **Architectural Issue:** Next.js optimizes and downloads the font payload, but the browser never renders it, wasting network resources and causing a discrepancy in the design system.
* **Production Impact:** Wasted bandwidth and inconsistent UI typography.
* **Recommended Solution:** Apply `className={`${Geist.className} ${Geist_Mono.variable}`}` to the `<body>` tag.
* **Complexity:** Low

## 6. Component Architecture Review
* **Finding:** Component architecture correctly relies on shadcn/ui primitives. Domain features are properly extracted (e.g., `components/auth/authForm.tsx`). 
* **Architectural Issue:** In `components/auth/authForm.tsx`, there is a global `window.addEventListener("unhandledrejection", ...)` to explicitly suppress Zod errors globally.
* **Production Impact:** This is an anti-pattern. Global error suppression within a localized component mount can swallow unrelated errors across the entire app, leading to silent failures and difficult debugging.
* **Recommended Solution:** Remove the global listener. Handle promise rejections directly in the submit handler or within the `react-hook-form` `onError` callback.
* **Complexity:** Low

## 7. State Management Review
* **Finding:** TanStack Query is used exclusively for asynchronous server state, while Zustand is appropriately isolated to client UI state (e.g., `stores/adminStore.ts`, `stores/authStore.ts`). 
* **Status:** Well-designed. No changes recommended.

## 8. API Layer Review
* **Finding:** `lib/http/httpClient.ts` correctly establishes Axios instances with request/response interceptors to handle token attachment and refresh logic automatically.
* **Architectural Issue:** The `getToken()` and `getRefreshToken()` functions fallback to `getClientCookie()` which reads directly from `document.cookie`. This design inherently assumes tokens are exposed to JavaScript.
* **Production Impact:** Architectural lock-in to an insecure token storage mechanism.
* **Recommended Solution:** Transition the interceptor logic. If cookies are `HttpOnly`, `withCredentials: true` will automatically send the cookie to the backend. The Axios client should not manually attach `Authorization: Bearer <token>` if the backend can read the `HttpOnly` cookie directly. Alternatively, use Next.js Server Actions for authenticated mutations.
* **Complexity:** Medium

## 9. Authentication Review
* **Finding:** `lib/utils/cookies.ts` explicitly writes `auth_token` and `refresh_token` to `document.cookie`. Furthermore, `middleware.ts` decodes the token payload manually using `atob` and checks the user role.
* **Architectural Issue:** Storing JWTs in JS-accessible cookies completely invalidates XSS protections. Moreover, decoding a JWT in middleware without verifying its cryptographic signature (especially when the cookie is not HttpOnly) allows attackers to manually overwrite `auth_token` in the browser console with a fake payload (e.g., `{"role": "ADMIN", "exp": 9999999999}`) to gain access to protected admin UI routes.
* **Production Impact:** Complete account takeover via XSS and UI privilege escalation.
* **Recommended Solution:** The backend MUST set cookies using the `Set-Cookie` header with `HttpOnly`, `Secure`, and `SameSite=Strict` attributes. The Next.js frontend should only route requests. `middleware.ts` should either verify the JWT signature using `jose`, or rely entirely on a backend `/auth/verify` endpoint.
* **Complexity:** High

## 10. UI System Review
* **Finding:** UI consistency is maintained through Tailwind v4 CSS variables and Radix UI headless components. Dark mode is seamlessly integrated.
* **Status:** Well-designed. No changes recommended.

## 11. Performance Architecture Review
* **Finding:** The application bundle includes two massive charting libraries: `recharts` and `echarts`.
* **Architectural Issue:** Both libraries solve the exact same problem (data visualization) but require independent DOM manipulation engines and huge payloads.
* **Production Impact:** Increases Initial Load Time and Total Blocking Time (TBT) due to the redundant JS parsing of two large libraries.
* **Recommended Solution:** Audit the charts in `components/portfolio/` and unify the implementation to use only `recharts` OR `echarts`. Uninstall the unused dependency.
* **Complexity:** Medium

## 12. Security Architecture Review
* **Finding:** `app/api/upload/route.ts` is an exposed API endpoint intended for file uploads.
* **Architectural Issue:** The endpoint contains magic-byte validation and size limits, but ZERO authentication or authorization checks.
* **Production Impact:** Anonymous users can upload files to the server's public directory. This allows attackers to exhaust server disk space (Denial of Service) or host malicious HTML/phishing pages on the `hotstock` domain.
* **Recommended Solution:** Wrap the API route logic with an authentication check. Extract the `auth_token` cookie, verify the user session/role, and reject unauthorized requests with `401 Unauthorized`.
* **Complexity:** Medium

## 13. Technical Debt
1. **Security Debt:** Client-side token storage and client-trusted RBAC in middleware.
2. **Bundle Debt:** Duplicate charting libraries (`recharts` + `echarts`).
3. **Component Debt:** Global unhandled promise rejection listeners inside specific components.

## 14. Recommended Improvements
* **P0 (Critical):** Move JWT tokens to `HttpOnly` cookies set by the backend. Update `httpClient.ts` to rely on `withCredentials` instead of manual header attachment.
* **P0 (Critical):** Implement strict authentication checks in `app/api/upload/route.ts`.
* **P1 (High):** Refactor `middleware.ts` to verify the JWT cryptographic signature using the `jose` library, preventing fake payload injections.
* **P2 (Medium):** Consolidate charting dependencies to a single library to reduce bundle size.
* **P2 (Medium):** Fix unused Next.js font imports in `app/layout.tsx`.

## 15. Architecture Score
* **Score:** 5/10
* **Reasoning:** While React/Next.js component patterns are beautifully executed (9/10), the fundamental security architecture for Auth and APIs is fundamentally flawed (1/10), severely dragging down the overall maintainability and safety of the system.

---

# Final Decision

NOT APPROVED

**Justification:** 
While the UI, component architecture, and state management are well-designed for a SaaS application of this scale, the frontend contains major architectural security flaws. The explicit storage of authentication tokens in JavaScript-accessible cookies (`document.cookie`) combined with an unauthenticated public file upload endpoint (`app/api/upload/route.ts`) exposes the application to immediate account takeover via XSS and server disk exhaustion. Furthermore, the routing middleware trusts client-modifiable cookies for Role-Based Access Control without cryptographic verification. These are fundamental production blockers that must be remediated before deployment.