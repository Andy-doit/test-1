const http = require('http');

function req(method, path, body, headers) {
  return new Promise((resolve, reject) => {
    const h = { ...(headers || {}) };
    if (body !== null && body !== undefined) h['Content-Type'] = 'application/json';
    const opts = { hostname: 'localhost', port: 3001, path: '/api/v1' + path, method, headers: h };
    const r = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ s: res.statusCode, b: JSON.parse(d) }); }
        catch (e) { resolve({ s: res.statusCode, b: d }); }
      });
    });
    r.on('error', reject);
    if (body !== null && body !== undefined) r.write(JSON.stringify(body));
    r.end();
  });
}

function auth(token) { return { Authorization: 'Bearer ' + token }; }

async function main() {
  const results = [];
  function log(id, name, method, endpoint, status, expected, body) {
    const pass = expected.includes(status) ? 'PASS' : 'FAIL';
    console.log(`${pass} | ${id} | ${name} | ${method} ${endpoint} | ${status} (expect ${expected.join('/')}) | ${JSON.stringify(body).slice(0, 200)}`);
    results.push({ id, name, method, endpoint, status, expected, pass, body: JSON.stringify(body).slice(0, 300) });
  }

  let r;
  const ts = Date.now();

  // Login admin
  r = await req('POST', '/auth/login', { email: 'admin@app.com', password: 'change-me-immediately' });
  const ADMIN_TOKEN = r.b.access_token;
  const ADMIN_REFRESH = r.b.refresh_token;
  console.log('Admin login:', r.s, 'token:', !!ADMIN_TOKEN);

  // Create a regular test user for isolation tests
  const testUsername = `user${ts}`;
  r = await req('POST', '/auth/register', {
    email: `${testUsername}@test.com`,
    password: 'Test@12345',
    confirmPassword: 'Test@12345',
    username: testUsername,
    fullName: 'Test User'
  });
  const USER_TOKEN = r.b.access_token;
  const USER_REFRESH = r.b.refresh_token;
  console.log('Test user register:', r.s, 'token:', !!USER_TOKEN);
  
  // Get user ID from /users/me
  r = await req('GET', '/users/me', null, auth(USER_TOKEN));
  const USER_ID = r.b.id;
  console.log('Test user ID:', USER_ID, 'role:', r.b.role);

  // =========================================================
  // GET /users/me
  // =========================================================

  // USR-01: GET /users/me - admin valid token
  r = await req('GET', '/users/me', null, auth(ADMIN_TOKEN));
  log('USR-01', 'GET /users/me admin', 'GET', '/users/me', r.s, [200], r.b);
  console.log('  -> Fields:', Object.keys(r.b));
  const ADMIN_ID = r.b.id;

  // USR-02: GET /users/me - regular user
  r = await req('GET', '/users/me', null, auth(USER_TOKEN));
  log('USR-02', 'GET /users/me regular user', 'GET', '/users/me', r.s, [200], r.b);

  // USR-03: GET /users/me - no token
  r = await req('GET', '/users/me', null);
  log('USR-03', 'GET /users/me no token', 'GET', '/users/me', r.s, [401], r.b);

  // =========================================================
  // PATCH /users/me (Update own profile)
  // =========================================================

  // USR-04: PATCH /users/me - valid update
  r = await req('PATCH', '/users/me', { fullName: 'Updated Name' }, auth(USER_TOKEN));
  log('USR-04', 'PATCH /users/me valid update', 'PATCH', '/users/me', r.s, [200], r.b);
  console.log('  -> fullName updated:', r.b.fullName);

  // USR-05: PATCH /users/me - update phone
  r = await req('PATCH', '/users/me', { phoneNumber: '0901234567' }, auth(USER_TOKEN));
  log('USR-05', 'PATCH /users/me update phone', 'PATCH', '/users/me', r.s, [200], r.b);

  // USR-06: PATCH /users/me - no token
  r = await req('PATCH', '/users/me', { fullName: 'Hack' });
  log('USR-06', 'PATCH /users/me no token', 'PATCH', '/users/me', r.s, [401], r.b);

  // =========================================================
  // Admin: GET /users (list all users - admin only)
  // =========================================================

  // USR-07: GET /users - admin can list
  r = await req('GET', '/users', null, auth(ADMIN_TOKEN));
  log('USR-07', 'GET /users admin', 'GET', '/users', r.s, [200], r.b);
  console.log('  -> Response keys:', typeof r.b === 'object' ? Object.keys(r.b) : 'N/A');
  console.log('  -> Total users:', r.b.total || r.b.data?.length || 'N/A');

  // USR-08: GET /users - regular user should be forbidden
  r = await req('GET', '/users', null, auth(USER_TOKEN));
  log('USR-08', 'GET /users regular user (expect 403)', 'GET', '/users', r.s, [403], r.b);

  // USR-09: GET /users - no token
  r = await req('GET', '/users', null);
  log('USR-09', 'GET /users no token', 'GET', '/users', r.s, [401], r.b);

  // USR-10: GET /users - with pagination
  r = await req('GET', '/users?page=1&limit=5', null, auth(ADMIN_TOKEN));
  log('USR-10', 'GET /users pagination', 'GET', '/users?page=1&limit=5', r.s, [200], r.b);
  console.log('  -> Pagination response keys:', typeof r.b === 'object' ? Object.keys(r.b) : 'N/A');

  // USR-11: GET /users - with search
  r = await req('GET', '/users?search=admin', null, auth(ADMIN_TOKEN));
  log('USR-11', 'GET /users search', 'GET', '/users?search=admin', r.s, [200], r.b);
  console.log('  -> Search result count:', r.b.data?.length || 'N/A');

  // =========================================================
  // Admin: GET /users/:id
  // =========================================================

  // USR-12: GET /users/:id - admin get specific user
  r = await req('GET', '/users/' + USER_ID, null, auth(ADMIN_TOKEN));
  log('USR-12', 'GET /users/:id admin', 'GET', '/users/:id', r.s, [200], r.b);
  console.log('  -> User fields:', typeof r.b === 'object' ? Object.keys(r.b) : 'N/A');

  // USR-13: GET /users/:id - nonexistent user
  r = await req('GET', '/users/999999', null, auth(ADMIN_TOKEN));
  log('USR-13', 'GET /users/:id nonexistent', 'GET', '/users/999999', r.s, [404], r.b);

  // USR-14: GET /users/:id - regular user accessing other user (should be 403)
  r = await req('GET', '/users/' + ADMIN_ID, null, auth(USER_TOKEN));
  log('USR-14', 'GET /users/:id regular user accessing other', 'GET', '/users/:id', r.s, [403], r.b);

  // USR-15: GET /users/:id - no token
  r = await req('GET', '/users/' + USER_ID, null);
  log('USR-15', 'GET /users/:id no token', 'GET', '/users/:id', r.s, [401], r.b);

  // =========================================================
  // Admin: PATCH /users/:id (admin update user)
  // =========================================================

  // USR-16: PATCH /users/:id - admin update user
  r = await req('PATCH', '/users/' + USER_ID, { fullName: 'Admin Updated Name' }, auth(ADMIN_TOKEN));
  log('USR-16', 'PATCH /users/:id admin update', 'PATCH', '/users/:id', r.s, [200], r.b);
  console.log('  -> Updated fullName:', r.b.fullName);

  // USR-17: PATCH /users/:id - admin block user
  r = await req('PATCH', '/users/' + USER_ID, { blocked: true }, auth(ADMIN_TOKEN));
  log('USR-17', 'PATCH /users/:id block user', 'PATCH', '/users/:id', r.s, [200], r.b);
  console.log('  -> blocked:', r.b.blocked);

  // Unblock for cleanup
  await req('PATCH', '/users/' + USER_ID, { blocked: false }, auth(ADMIN_TOKEN));

  // USR-18: PATCH /users/:id - regular user cannot update another user
  r = await req('PATCH', '/users/' + ADMIN_ID, { fullName: 'Hacked' }, auth(USER_TOKEN));
  log('USR-18', 'PATCH /users/:id user cannot update other', 'PATCH', '/users/:id', r.s, [403], r.b);

  // USR-19: PATCH /users/:id - nonexistent
  r = await req('PATCH', '/users/999999', { fullName: 'Ghost' }, auth(ADMIN_TOKEN));
  log('USR-19', 'PATCH /users/:id nonexistent', 'PATCH', '/users/999999', r.s, [404], r.b);

  // USR-20: PATCH /users/:id - no token
  r = await req('PATCH', '/users/' + USER_ID, { fullName: 'Hack' });
  log('USR-20', 'PATCH /users/:id no token', 'PATCH', '/users/:id', r.s, [401], r.b);

  // =========================================================
  // Admin: DELETE /users/:id
  // =========================================================

  // USR-21: DELETE /users/:id - regular user cannot delete
  r = await req('DELETE', '/users/' + ADMIN_ID, null, auth(USER_TOKEN));
  log('USR-21', 'DELETE /users/:id user cannot delete other', 'DELETE', '/users/:id', r.s, [403], r.b);

  // USR-22: DELETE /users/:id - nonexistent
  r = await req('DELETE', '/users/999999', null, auth(ADMIN_TOKEN));
  log('USR-22', 'DELETE /users/:id nonexistent', 'DELETE', '/users/999999', r.s, [404], r.b);

  // USR-23: DELETE /users/:id - no token
  r = await req('DELETE', '/users/' + USER_ID, null);
  log('USR-23', 'DELETE /users/:id no token', 'DELETE', '/users/:id', r.s, [401], r.b);

  // USR-24: DELETE /users/:id - admin delete test user (cleanup + test)
  r = await req('DELETE', '/users/' + USER_ID, null, auth(ADMIN_TOKEN));
  log('USR-24', 'DELETE /users/:id admin delete', 'DELETE', '/users/:id', r.s, [200], r.b);
  console.log('  -> Delete response:', JSON.stringify(r.b).slice(0, 100));

  // Summary
  const passed = results.filter(x => x.pass === 'PASS').length;
  const failed = results.filter(x => x.pass === 'FAIL').length;
  console.log(`\n=== USERS SESSION SUMMARY: ${passed} PASS, ${failed} FAIL out of ${results.length} tests ===`);

  if (failed > 0) {
    console.log('\nFAILED TESTS:');
    results.filter(x => x.pass === 'FAIL').forEach(x => {
      console.log(`  ${x.id}: ${x.name} - got ${x.status} expected ${x.expected.join('/')} - ${x.body}`);
    });
  }
}

main().catch(e => console.error('FATAL:', e.message, e.stack));