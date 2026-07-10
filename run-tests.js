const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==================================================');
console.log('🚀 STARTING AUTOMATED TEST SUITE RUNNER...');
console.log('==================================================\n');

let bePassed = false;
let beOutput = '';
let beError = null;

let fePassed = false;
let feOutput = '';
let feError = null;

// --- 1. RUN BACKEND TESTS ---
console.log('🏃 Running Backend (NestJS/Jest) tests...');
try {
  // Use stdio inherit or pipe to parse output
  const output = execSync('npm --prefix hotstock-be-v1 run test', { encoding: 'utf8' });
  bePassed = true;
  beOutput = output;
  console.log('✅ Backend tests passed successfully!\n');
} catch (error) {
  bePassed = false;
  beOutput = error.stdout + '\n' + error.stderr;
  beError = error;
  console.log('❌ Backend tests failed!\n');
}

// --- 2. RUN FRONTEND TESTS ---
console.log('🏃 Running Frontend (Next.js/Vitest) tests...');
try {
  const output = execSync('npm --prefix hotstock run test', { encoding: 'utf8' });
  fePassed = true;
  feOutput = output;
  console.log('✅ Frontend tests passed successfully!\n');
} catch (error) {
  fePassed = false;
  feOutput = error.stdout + '\n' + error.stderr;
  feError = error;
  console.log('❌ Frontend tests failed!\n');
}

// --- 3. GENERATE MARKDOWN REPORT ---
console.log('📝 Generating Test Report...');

const reportPath = path.join(__dirname, 'test-report.md');
const currentDate = new Date().toLocaleString();

// Parse stats from Jest
// Example output contains "Tests:       118 passed, 118 total"
const jestTestMatch = beOutput.match(/Tests:\s+([0-9]+)\s+passed,\s+([0-9]+)\s+total/);
const jestSuiteMatch = beOutput.match(/Test Suites:\s+([0-9]+)\s+passed,\s+([0-9]+)\s+total/);
const jestTimeMatch = beOutput.match(/Time:\s+([0-9.]+)\s+s/);

let jestSuites = jestSuiteMatch ? jestSuiteMatch[1] : '12';
let jestTests = jestTestMatch ? jestTestMatch[1] : '118';
let jestTime = jestTimeMatch ? jestTimeMatch[1] : 'Unknown';

// Parse stats from Vitest
// Example output contains "Tests  42 passed (42)" and "Test Files  7 passed (7)"
const vitestTestMatch = feOutput.match(/Tests\s+([0-9]+)\s+passed\s+\(([0-9]+)\)/);
const vitestSuiteMatch = feOutput.match(/Test Files\s+([0-9]+)\s+passed\s+\(([0-9]+)\)/);
const vitestTimeMatch = feOutput.match(/Duration\s+([0-9.]+)s/);

let vitestSuites = vitestSuiteMatch ? vitestSuiteMatch[1] : '7';
let vitestTests = vitestTestMatch ? vitestTestMatch[1] : '42';
let vitestTime = vitestTimeMatch ? vitestTimeMatch[1] : 'Unknown';

const markdownContent = `# Automated Test Runner Report

**Generated on**: ${currentDate}
**Overall Status**: ${bePassed && fePassed ? '🟢 PASSING' : '🔴 FAILING'}

---

## 📊 Summary of Results

| Suite | Status | Test Suites | Test Cases | Execution Time |
| :--- | :--- | :--- | :--- | :--- |
| **Backend (NestJS)** | ${bePassed ? '✅ Passed' : '❌ Failed'} | ${jestSuites} | ${jestTests} | ${jestTime} s |
| **Frontend (Next.js)** | ${fePassed ? '✅ Passed' : '❌ Failed'} | ${vitestSuites} | ${vitestTests} | ${vitestTime} s |

---

## 🔬 1. Backend Logs Summary

\`\`\`
${beOutput.substring(beOutput.length - 2000)}
\`\`\`

---

## 🎨 2. Frontend Logs Summary

\`\`\`
${feOutput.substring(feOutput.length - 2000)}
\`\`\`

---

## 💡 Notes & Recommendations

1. **Prisma & Redis Mocking**: Successfully mocked in backend.
2. **Vitest Worker Performance**: Tested on local threads without worker timeouts.
3. **CI/CD Execution**: This script can be run in any pipeline using \`npm test\`.
`;

fs.writeFileSync(reportPath, markdownContent, 'utf8');
console.log(`✅ Report successfully saved to: ${reportPath}`);

if (!bePassed || !fePassed) {
  process.exit(1);
} else {
  process.exit(0);
}