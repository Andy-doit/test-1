const http = require('http');

function req(method, path, body, headers) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost', port: 3001,
      path: '/api/v1' + path, method,
      headers: { 'Content-Type': 'application/json', ...(headers || {}) }
    };
    const r = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ s: res.statusCode, b: JSON.parse(d) }); }
        catch (e) { resolve({ s: res.statusCode, b: d }); }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

function auth(token) { return { Authorization: 'Bearer ' + token }; }

async function main() {
  const results = [];
  function log(id, name, method, endpoint, status, expected, body) {
    const pass = expected.includes(status) ? 'PASS' : 'FAIL';
    const line = `${pass} | ${id} | ${name} | ${method} ${endpoint} | ${status} (expect ${expected.join('/')}) | ${JSON.stringify(body).slice(0, 150)}`;
    console.log(line);
    results.push({ id, name, method, endpoint, status, expected, pass, body: JSON.stringify(body).slice(0, 200) });
  }

  let r;
  const ts = Date.now();

  // === 1. Login - happy path ===
  r = await req('POST', '/auth/login', { email: 'admin@app.com', password: 'change-me-immediately' });
  log('AUTH-01', 'Login valid credentials', 'POST', '/auth/login', r.s, [201], r.b);
  const ADMIN_TOKEN = r.b.accessToken;
  const ADMIN_REFRESH = r.b.refreshToken;
  const ADMIN_ID = r.b.user?.id;

  // === 2. Login - wrong password ===
  r = await req('POST', '/auth/login', { email: 'admin@app.com', password: 'wrongpassword' });
  log('AUTH-02', 'Login wrong password', 'POST', '/auth/login', r.s, [401], r.b);

  // === 3. Login - nonexistent user ===
  r = await req('POST', '/auth/login', { email: 'nobody@test.com', password: 'anything' });
  log('AUTH-03', 'Login nonexistent user', 'POST', '/auth/login', r.s, [401], r.b);

  // === 4. Login - empty body ===
  r = await req('POST', '/auth/login', {});
  log('AUTH-04', 'Login empty body', 'POST', '/auth/login', r.s, [400, 401], r.b);

  // === 5. Login - missing password ===
  r = await req('POST', '/auth/login', { email: 'admin@app.com' });
  log('AUTH-05', 'Login missing password', 'POST', '/auth/login', r.s, [400, 401], r.b);

  // === 6. Register - happy path ===
  r = await req('POST', '/auth/register', { email: `testauth${ts}@test.com`, password: 'Test@12345', fullName: 'Auth Tester' });
  log('AUTH-06', 'Register new user', 'POST', '/auth/register', r.s, [201], r.b);
  const TEST_TOKEN = r.b.accessToken;
  const TEST_USER_ID = r.b.user?.id;

  // === 7. Register - duplicate ===
  r = await req('POST', '/auth/register', { email: `testauth${ts}@test.com`, password: 'Test@12345', fullName: 'Dup' });
  log('AUTH-07', 'Register duplicate email', 'POST', '/auth/register', r.s, [409], r.b);

  // === 8. Register - invalid email ===
  r = await req('POST', '/auth/register', { email: 'bad', password: 'Test@12345', fullName: 'Bad' });
  log('AUTH-08', 'Register invalid email', 'POST', '/auth/register', r.s, [400], r.b);

  // === 9. Register - weak password ===
  r = await req('POST', '/auth/register', { email: 'weak@test.com', password: '1', fullName: 'Weak' });
  log('AUTH-09', 'Register weak password', 'POST', '/auth/register', r.s, [400], r.b);

  // === 10. Register - empty body ===
  r = await req('POST', '/auth/register', {});
  log('AUTH-10', 'Register empty body', 'POST', '/auth/register', r.s, [400], r.b);

  // === 11. GET /auth/me - valid token ===
  r = await req('GET', '/auth/me', null, auth(ADMIN_TOKEN));
  log('AUTH-11', 'Get me valid token', 'GET', '/auth/me', r.s, [200], r.b);

  // === 12. GET /auth/me - no token ===
  r = await req('GET', '/auth/me', null);
  log('AUTH-12', 'Get me no token', 'GET', '/auth/me', r.s, [401], r.b);

  // === 13. GET /auth/me - invalid token ===
  r = await req('GET', '/auth/me', null, auth('invalidtoken123'));
  log('AUTH-13', 'Get me invalid token', 'GET', '/auth/me', r.s, [401], r.b);

  // === 14. Refresh - valid ===
  r = await req('POST', '/auth/refresh', { refreshToken: ADMIN_REFRESH });
  log('AUTH-14', 'Refresh valid token', 'POST', '/auth/refresh', r.s, [200, 201], r.b);
  const NEW_ADMIN_TOKEN = r.b.accessToken || ADMIN_TOKEN;

  // === 15. Refresh - invalid token ===
  r = await req('POST', '/auth/refresh', { refreshToken: 'invalid-refresh-token' });
  log('AUTH-15', 'Refresh invalid token', 'POST', '/auth/refresh', r.s, [401], r.b);

  // === 16. Refresh - empty body ===
  r = await req('POST', '/auth/refresh', {});
  log('AUTH-16', 'Refresh empty body', 'POST', '/auth/refresh', r.s, [400, 401], r.b);

  // === 17. Change password - valid ===
  if (TEST_TOKEN) {
    r = await req('POST', '/auth/change-password', { oldPassword: 'Test@12345', newPassword: 'NewTest@12345' }, auth(TEST_TOKEN));
    log('AUTH-17', 'Change password valid', 'POST', '/auth/change-password', r.s, [200, 201], r.b);
  }

  // === 18. Change password - wrong old password ===
  r = await req('POST', '/auth/change-password', { oldPassword: 'wrongold', newPassword: 'New@12345' }, auth(ADMIN_TOKEN));
  log('AUTH-18', 'Change password wrong old', 'POST', '/auth/change-password', r.s, [400, 401], r.b);

  // === 19. Change password - no auth ===
  r = await req('POST', '/auth/change-password', { oldPassword: 'Test@12345', newPassword: 'New@12345' });
  log('AUTH-19', 'Change password no auth', 'POST', '/auth/change-password', r.s, [401], r.b);

  // === 20. Forgot password - valid email ===
  r = await req('POST', '/auth/forgot-password', { email: 'admin@app.com' });
  log('AUTH-20', 'Forgot password valid email', 'POST', '/auth/forgot-password', r.s, [200, 201], r.b);

  // === 21. Forgot password - nonexistent email ===
  r = await req('POST', '/auth/forgot-password', { email: 'nobody@test.com' });
  log('AUTH-21', 'Forgot password unknown email', 'POST', '/auth/forgot-password', r.s, [200, 201], r.b);

  // === 22. Verify OTP - invalid ===
  r = await req('POST', '/auth/verify-otp', { email: 'admin@app.com', otp: '000000' });
  log('AUTH-22', 'Verify OTP invalid', 'POST', '/auth/verify-otp', r.s, [400, 401], r.b);

  // === 23. Reset password - invalid token ===
  r = await req('POST', '/auth/reset-password', { resetToken: 'bad-token', newPassword: 'New@12345' });
  log('AUTH-23', 'Reset password bad token', 'POST', '/auth/reset-password', r.s, [400, 401], r.b);

  // === 24. Logout - valid ===
  r = await req('POST', '/auth/logout', null, auth(NEW_ADMIN_TOKEN));
  log('AUTH-24', 'Logout valid token', 'POST', '/auth/logout', r.s, [200, 201], r.b);

  // === 25. Logout - no token ===
  r = await req('POST', '/auth/logout', null);
  log('AUTH-25', 'Logout no token', 'POST', '/auth/logout', r.s, [401], r.b);

  // Cleanup: delete test user
  if (TEST_USER_ID) {
    const loginR = await req('POST', '/auth/login', { email: 'admin@app.com', password: 'change-me-immediately' });
    const cleanToken = loginR.b.accessToken;
    r = await req('DELETE', '/users/' + TEST_USER_ID, null, auth(cleanToken));
    console.log('CLEANUP delete test user:', r.s);
  }

  // Summary
  const passed = results.filter(r => r.pass === 'PASS').length;
  const failed = results.filter(r => r.pass === 'FAIL').length;
  console.log(`\n=== AUTH SESSION SUMMARY: ${passed} PASS, ${failed} FAIL out of ${results.length} tests ===`);
  
  if (failed > 0) {
    console.log('\nFAILED TESTS:');
    results.filter(r => r.pass === 'FAIL').forEach(r => {
      console.log(`  ${r.id}: ${r.name} - got ${r.status} expected ${r.expected.join('/')} - ${r.body}`);
    });
  }
}

main().catch(e => console.error('FATAL:', e.message, e.stack));