# Automated Test Runner Report

**Generated on**: 7/8/2026, 3:29:53 PM
**Overall Status**: 🟢 PASSING

---

## 📊 Summary of Results

| Suite | Status | Test Suites | Test Cases | Execution Time |
| :--- | :--- | :--- | :--- | :--- |
| **Backend (NestJS)** | ✅ Passed | 12 | 118 | Unknown s |
| **Frontend (Next.js)** | ✅ Passed | 7 | 42 | Unknown s |

---

## 🔬 1. Backend Logs Summary

```

> hotstock-be-v1@0.0.1 test
> jest


```

---

## 🎨 2. Frontend Logs Summary

```

> hotstock@0.1.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.9 [39m[90mD:/Work/freelancer/hotstock-v2/hotstock[39m

 [32m✓[39m lib/utils/portfolioCalculations.spec.ts [2m([22m[2m16 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m lib/utils/cookies.spec.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 24[2mms[22m[39m
 [32m✓[39m app/admin/portfolio/_lib/portfolioHelpers.spec.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m hooks/usePortfolioData.spec.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 75[2mms[22m[39m
 [32m✓[39m src/components/portfolio/supportReasons.spec.tsx [2m([22m[2m4 tests[22m[2m)[22m[32m 131[2mms[22m[39m
 [32m✓[39m components/common/articleAccessOverlay.spec.tsx [2m([22m[2m5 tests[22m[2m)[22m[33m 400[2mms[22m[39m
 [32m✓[39m src/components/admin/portfolio/stockTable.spec.tsx [2m([22m[2m4 tests[22m[2m)[22m[33m 434[2mms[22m[39m

[2m Test Files [22m [1m[32m7 passed[39m[22m[90m (7)[39m
[2m      Tests [22m [1m[32m42 passed[39m[22m[90m (42)[39m
[2m   Start at [22m 15:29:49
[2m   Duration [22m 3.83s[2m (transform 1.07s, setup 1.73s, import 3.09s, tests 1.09s, environment 13.88s)[22m


```

---

## 💡 Notes & Recommendations

1. **Prisma & Redis Mocking**: Successfully mocked in backend.
2. **Vitest Worker Performance**: Tested on local threads without worker timeouts.
3. **CI/CD Execution**: This script can be run in any pipeline using `npm test`.
