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
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    console.log(`${pass} | ${id} | ${name} | ${method} ${endpoint} | ${status} (expect ${expected.join('/')}) | ${bodyStr.slice(0, 200)}`);
    results.push({ id, name, method, endpoint, status, expected, pass, body: bodyStr.slice(0, 300) });
  }

  let r;
  const ts = Date.now();

  // Login admin
  r = await req('POST', '/auth/login', { email: 'admin@app.com', password: 'change-me-immediately' });
  const ADMIN_TOKEN = r.b.access_token;
  console.log('Admin login:', r.s, 'token:', !!ADMIN_TOKEN);

  // Create a regular test user
  const testUsername = `user${ts}`;
  r = await req('POST', '/auth/register', {
    email: `${testUsername}@test.com`,
    password: 'Test@12345',
    confirmPassword: 'Test@12345',
    username: testUsername
  });
  const USER_TOKEN = r.b.access_token;
  r = await req('GET', '/users/me', null, auth(USER_TOKEN));
  const USER_ID = r.b.id;
  console.log('Test user ID:', USER_ID, 'role:', r.b.role);

  // =========================================================
  // USERS - Missing admin sub-endpoints
  // =========================================================

  // USR-A01: PATCH /users/:id/role - admin change role to admin
  r = await req('PATCH', '/users/' + USER_ID + '/role', { role: 'admin' }, auth(ADMIN_TOKEN));
  log('USR-A01', 'PATCH /users/:id/role to admin', 'PATCH', '/users/:id/role', r.s, [200], r.b);
  console.log('  -> role:', r.b.role);

  // USR-A02: PATCH /users/:id/role - change back to user
  r = await req('PATCH', '/users/' + USER_ID + '/role', { role: 'user' }, auth(ADMIN_TOKEN));
  log('USR-A02', 'PATCH /users/:id/role to user', 'PATCH', '/users/:id/role', r.s, [200], r.b);

  // USR-A03: PATCH /users/:id/role - invalid role
  r = await req('PATCH', '/users/' + USER_ID + '/role', { role: 'superadmin' }, auth(ADMIN_TOKEN));
  log('USR-A03', 'PATCH /users/:id/role invalid value', 'PATCH', '/users/:id/role', r.s, [400], r.b);

  // USR-A04: PATCH /users/:id/role - regular user cannot change role
  r = await req('PATCH', '/users/' + USER_ID + '/role', { role: 'admin' }, auth(USER_TOKEN));
  log('USR-A04', 'PATCH /users/:id/role non-admin', 'PATCH', '/users/:id/role', r.s, [403], r.b);

  // USR-A05: PATCH /users/:id/role - no token
  r = await req('PATCH', '/users/' + USER_ID + '/role', { role: 'admin' });
  log('USR-A05', 'PATCH /users/:id/role no token', 'PATCH', '/users/:id/role', r.s, [401], r.b);

  // Get first plan ID for plan assignment tests
  r = await req('GET', '/plans', null, auth(ADMIN_TOKEN));
  const plansList = Array.isArray(r.b) ? r.b : (r.b.data || []);
  const firstPlan = plansList[0];
  const PLAN_ID = firstPlan?.id;
  const PLAN_SLUG = firstPlan?.slug;
  console.log('First plan:', PLAN_ID, PLAN_SLUG, firstPlan?.name);

  // USR-A06: PATCH /users/:id/plan - admin assign plan
  if (PLAN_ID) {
    r = await req('PATCH', '/users/' + USER_ID + '/plan', { planId: PLAN_ID }, auth(ADMIN_TOKEN));
    log('USR-A06', 'PATCH /users/:id/plan assign plan', 'PATCH', '/users/:id/plan', r.s, [200], r.b);
    console.log('  -> plan:', r.b.plan?.name || r.b.plan);
  } else {
    console.log('USR-A06: SKIP - no plan available');
  }

  // USR-A07: PATCH /users/:id/plan - invalid planId
  r = await req('PATCH', '/users/' + USER_ID + '/plan', { planId: 999999 }, auth(ADMIN_TOKEN));
  log('USR-A07', 'PATCH /users/:id/plan invalid id', 'PATCH', '/users/:id/plan', r.s, [404, 400], r.b);

  // USR-A08: PATCH /users/:id/plan - no token
  r = await req('PATCH', '/users/' + USER_ID + '/plan', { planId: 1 });
  log('USR-A08', 'PATCH /users/:id/plan no token', 'PATCH', '/users/:id/plan', r.s, [401], r.b);

  // USR-A09: PATCH /users/:id/block
  r = await req('PATCH', '/users/' + USER_ID + '/block', null, auth(ADMIN_TOKEN));
  log('USR-A09', 'PATCH /users/:id/block admin', 'PATCH', '/users/:id/block', r.s, [200], r.b);
  console.log('  -> blocked:', r.b.blocked);

  // USR-A10: PATCH /users/:id/block - regular user cannot block
  r = await req('PATCH', '/users/1/block', null, auth(USER_TOKEN));
  log('USR-A10', 'PATCH /users/:id/block non-admin', 'PATCH', '/users/:id/block', r.s, [403], r.b);

  // USR-A11: PATCH /users/:id/unblock
  r = await req('PATCH', '/users/' + USER_ID + '/unblock', null, auth(ADMIN_TOKEN));
  log('USR-A11', 'PATCH /users/:id/unblock admin', 'PATCH', '/users/:id/unblock', r.s, [200], r.b);
  console.log('  -> blocked:', r.b.blocked);

  // USR-A12: PATCH /users/:id/unblock - no token
  r = await req('PATCH', '/users/' + USER_ID + '/unblock', null);
  log('USR-A12', 'PATCH /users/:id/unblock no token', 'PATCH', '/users/:id/unblock', r.s, [401], r.b);

  // =========================================================
  // PLANS
  // =========================================================

  // PLN-01: GET /plans - public list
  r = await req('GET', '/plans', null);
  log('PLN-01', 'GET /plans public', 'GET', '/plans', r.s, [200], r.b);
  console.log('  -> Count:', Array.isArray(r.b) ? r.b.length : r.b?.data?.length || r.b?.total || 'N/A');
  console.log('  -> Keys:', Array.isArray(r.b) ? Object.keys(r.b[0] || {}) : Object.keys(r.b));

  // PLN-02: GET /plans - with auth (same endpoint)
  r = await req('GET', '/plans', null, auth(USER_TOKEN));
  log('PLN-02', 'GET /plans authenticated', 'GET', '/plans', r.s, [200], r.b);

  // PLN-03: GET /plans/admin - admin list
  r = await req('GET', '/plans/admin', null, auth(ADMIN_TOKEN));
  log('PLN-03', 'GET /plans/admin admin', 'GET', '/plans/admin', r.s, [200], r.b);
  console.log('  -> Admin list count:', Array.isArray(r.b) ? r.b.length : r.b?.data?.length || 'N/A');

  // PLN-04: GET /plans/admin - regular user cannot
  r = await req('GET', '/plans/admin', null, auth(USER_TOKEN));
  log('PLN-04', 'GET /plans/admin non-admin', 'GET', '/plans/admin', r.s, [403], r.b);

  // PLN-05: GET /plans/admin - no token
  r = await req('GET', '/plans/admin', null);
  log('PLN-05', 'GET /plans/admin no token', 'GET', '/plans/admin', r.s, [401], r.b);

  // PLN-06: GET /plans/:slug - get specific plan
  if (PLAN_SLUG) {
    r = await req('GET', '/plans/' + PLAN_SLUG, null);
    log('PLN-06', 'GET /plans/:slug public', 'GET', '/plans/' + PLAN_SLUG, r.s, [200], r.b);
    console.log('  -> Plan fields:', Object.keys(r.b || {}));
  } else {
    console.log('PLN-06: SKIP - no plan slug');
  }

  // PLN-07: GET /plans/:slug - nonexistent
  r = await req('GET', '/plans/nonexistent-plan-xyz', null);
  log('PLN-07', 'GET /plans/:slug nonexistent', 'GET', '/plans/nonexistent-plan-xyz', r.s, [404], r.b);

  // PLN-08: POST /plans - create plan (admin)
  const newPlanSlug = `test-plan-${ts}`;
  r = await req('POST', '/plans', {
    name: 'Test Plan',
    slug: newPlanSlug,
    level: 99,
    monthlyPrice: 99000,
    features: ['Feature 1', 'Feature 2'],
    tagline: 'Test tagline',
    icon: 'star'
  }, auth(ADMIN_TOKEN));
  log('PLN-08', 'POST /plans create admin', 'POST', '/plans', r.s, [201, 200], r.b);
  console.log('  -> Created plan:', r.b.slug, 'id:', r.b.id);
  const NEW_PLAN_SLUG = r.b.slug || newPlanSlug;

  // PLN-09: POST /plans - regular user cannot create
  r = await req('POST', '/plans', {
    name: 'Hacked Plan',
    slug: 'hacked-plan',
    level: 1,
    monthlyPrice: 0
  }, auth(USER_TOKEN));
  log('PLN-09', 'POST /plans non-admin', 'POST', '/plans', r.s, [403], r.b);

  // PLN-10: POST /plans - no token
  r = await req('POST', '/plans', { name: 'Hack', slug: 'hack', level: 1 });
  log('PLN-10', 'POST /plans no token', 'POST', '/plans', r.s, [401], r.b);

  // PLN-11: POST /plans - duplicate slug
  r = await req('POST', '/plans', {
    name: 'Test Plan Dup',
    slug: newPlanSlug,
    level: 98,
    monthlyPrice: 50000
  }, auth(ADMIN_TOKEN));
  log('PLN-11', 'POST /plans duplicate slug', 'POST', '/plans', r.s, [409, 400], r.b);

  // PLN-12: PATCH /plans/:slug - update plan
  r = await req('PATCH', '/plans/' + NEW_PLAN_SLUG, { name: 'Updated Test Plan', monthlyPrice: 199000 }, auth(ADMIN_TOKEN));
  log('PLN-12', 'PATCH /plans/:slug update', 'PATCH', '/plans/:slug', r.s, [200], r.b);
  console.log('  -> Updated name:', r.b.name, 'price:', r.b.monthlyPrice);

  // PLN-13: PATCH /plans/:slug - non-admin
  r = await req('PATCH', '/plans/' + NEW_PLAN_SLUG, { name: 'Hack' }, auth(USER_TOKEN));
  log('PLN-13', 'PATCH /plans/:slug non-admin', 'PATCH', '/plans/:slug', r.s, [403], r.b);

  // PLN-14: PATCH /plans/:slug - nonexistent
  r = await req('PATCH', '/plans/nonexistent-xyz', { name: 'Ghost' }, auth(ADMIN_TOKEN));
  log('PLN-14', 'PATCH /plans/:slug nonexistent', 'PATCH', '/plans/:slug', r.s, [404], r.b);

  // PLN-15: PATCH /plans/:slug/field-visibility
  r = await req('PATCH', '/plans/' + NEW_PLAN_SLUG + '/field-visibility', {
    portfolioFields: ['price', 'change'],
    articleFields: ['title', 'excerpt']
  }, auth(ADMIN_TOKEN));
  log('PLN-15', 'PATCH /plans/:slug/field-visibility', 'PATCH', '/plans/:slug/field-visibility', r.s, [200], r.b);
  console.log('  -> Field visibility response:', JSON.stringify(r.b).slice(0, 200));

  // PLN-16: PATCH /plans/:slug/field-visibility - non-admin
  r = await req('PATCH', '/plans/' + NEW_PLAN_SLUG + '/field-visibility', {}, auth(USER_TOKEN));
  log('PLN-16', 'PATCH field-visibility non-admin', 'PATCH', '/plans/:slug/field-visibility', r.s, [403], r.b);

  // PLN-17: DELETE /plans/:slug - non-admin
  r = await req('DELETE', '/plans/' + NEW_PLAN_SLUG, null, auth(USER_TOKEN));
  log('PLN-17', 'DELETE /plans/:slug non-admin', 'DELETE', '/plans/:slug', r.s, [403], r.b);

  // PLN-18: DELETE /plans/:slug - nonexistent
  r = await req('DELETE', '/plans/nonexistent-xyz', null, auth(ADMIN_TOKEN));
  log('PLN-18', 'DELETE /plans/:slug nonexistent', 'DELETE', '/plans/:slug', r.s, [404], r.b);

  // PLN-19: DELETE /plans/:slug - admin delete
  r = await req('DELETE', '/plans/' + NEW_PLAN_SLUG, null, auth(ADMIN_TOKEN));
  log('PLN-19', 'DELETE /plans/:slug admin', 'DELETE', '/plans/:slug', r.s, [200], r.b);
  console.log('  -> Delete response:', JSON.stringify(r.b).slice(0, 100));

  // =========================================================
  // CATEGORIES
  // =========================================================

  // CAT-01: GET /categories - public
  r = await req('GET', '/categories', null);
  log('CAT-01', 'GET /categories public', 'GET', '/categories', r.s, [200], r.b);
  console.log('  -> Count:', Array.isArray(r.b) ? r.b.length : r.b?.data?.length || 'N/A');
  console.log('  -> Keys:', Array.isArray(r.b) && r.b[0] ? Object.keys(r.b[0]) : 'N/A');

  // CAT-02: POST /categories - admin create
  const catSlug = `test-cat-${ts}`;
  r = await req('POST', '/categories', {
    name: 'Test Category',
    slug: catSlug,
    isVisibleOnUI: true
  }, auth(ADMIN_TOKEN));
  log('CAT-02', 'POST /categories admin create', 'POST', '/categories', r.s, [201, 200], r.b);
  console.log('  -> Created cat:', r.b.slug, r.b.id);
  const NEW_CAT_SLUG = r.b.slug || catSlug;

  // CAT-03: POST /categories - non-admin
  r = await req('POST', '/categories', { name: 'Hack', slug: 'hack-cat', isVisibleOnUI: false }, auth(USER_TOKEN));
  log('CAT-03', 'POST /categories non-admin', 'POST', '/categories', r.s, [403], r.b);

  // CAT-04: POST /categories - no token
  r = await req('POST', '/categories', { name: 'Hack', slug: 'hack-cat2', isVisibleOnUI: false });
  log('CAT-04', 'POST /categories no token', 'POST', '/categories', r.s, [401], r.b);

  // CAT-05: POST /categories - duplicate slug
  r = await req('POST', '/categories', { name: 'Dup', slug: catSlug, isVisibleOnUI: false }, auth(ADMIN_TOKEN));
  log('CAT-05', 'POST /categories duplicate slug', 'POST', '/categories', r.s, [409, 400], r.b);

  // CAT-06: GET /categories/:slug - get specific
  r = await req('GET', '/categories/' + NEW_CAT_SLUG, null);
  log('CAT-06', 'GET /categories/:slug public', 'GET', '/categories/:slug', r.s, [200], r.b);
  console.log('  -> Category fields:', Object.keys(r.b || {}));

  // CAT-07: GET /categories/:slug - nonexistent
  r = await req('GET', '/categories/nonexistent-xyz', null);
  log('CAT-07', 'GET /categories/:slug nonexistent', 'GET', '/categories/:slug', r.s, [404], r.b);

  // CAT-08: PATCH /categories/:slug - admin update
  r = await req('PATCH', '/categories/' + NEW_CAT_SLUG, { name: 'Updated Category', isVisibleOnUI: false }, auth(ADMIN_TOKEN));
  log('CAT-08', 'PATCH /categories/:slug admin', 'PATCH', '/categories/:slug', r.s, [200], r.b);
  console.log('  -> Updated name:', r.b.name);

  // CAT-09: PATCH /categories/:slug - non-admin
  r = await req('PATCH', '/categories/' + NEW_CAT_SLUG, { name: 'Hack' }, auth(USER_TOKEN));
  log('CAT-09', 'PATCH /categories/:slug non-admin', 'PATCH', '/categories/:slug', r.s, [403], r.b);

  // CAT-10: PATCH /categories/:slug - nonexistent
  r = await req('PATCH', '/categories/nonexistent-xyz', { name: 'Ghost' }, auth(ADMIN_TOKEN));
  log('CAT-10', 'PATCH /categories/:slug nonexistent', 'PATCH', '/categories/:slug', r.s, [404], r.b);

  // CAT-11: DELETE /categories/:slug - non-admin
  r = await req('DELETE', '/categories/' + NEW_CAT_SLUG, null, auth(USER_TOKEN));
  log('CAT-11', 'DELETE /categories/:slug non-admin', 'DELETE', '/categories/:slug', r.s, [403], r.b);

  // CAT-12: DELETE /categories/:slug - nonexistent
  r = await req('DELETE', '/categories/nonexistent-xyz', null, auth(ADMIN_TOKEN));
  log('CAT-12', 'DELETE /categories/:slug nonexistent', 'DELETE', '/categories/:slug', r.s, [404], r.b);

  // CAT-13: DELETE /categories/:slug - admin delete
  r = await req('DELETE', '/categories/' + NEW_CAT_SLUG, null, auth(ADMIN_TOKEN));
  log('CAT-13', 'DELETE /categories/:slug admin', 'DELETE', '/categories/:slug', r.s, [200], r.b);
  console.log('  -> Delete response:', JSON.stringify(r.b).slice(0, 100));

  // =========================================================
  // TAGS
  // =========================================================

  // TAG-01: GET /tags - public find all
  r = await req('GET', '/tags', null);
  log('TAG-01', 'GET /tags public', 'GET', '/tags', r.s, [200], r.b);
  console.log('  -> Count:', Array.isArray(r.b) ? r.b.length : r.b?.data?.length || 'N/A');
  console.log('  -> Keys:', Array.isArray(r.b) && r.b[0] ? Object.keys(r.b[0]) : 'N/A');

  // TAG-02: GET /tags - with auth
  r = await req('GET', '/tags', null, auth(USER_TOKEN));
  log('TAG-02', 'GET /tags authenticated', 'GET', '/tags', r.s, [200], r.b);

  // TAG-03: POST /tags - admin create
  const tagSlug = `test-tag-${ts}`;
  r = await req('POST', '/tags', { name: 'Test Tag', slug: tagSlug }, auth(ADMIN_TOKEN));
  log('TAG-03', 'POST /tags admin create', 'POST', '/tags', r.s, [201, 200], r.b);
  console.log('  -> Created tag:', r.b.slug, r.b.id);
  const NEW_TAG_SLUG = r.b.slug || tagSlug;

  // TAG-04: POST /tags - non-admin
  r = await req('POST', '/tags', { name: 'Hack Tag', slug: 'hack-tag' }, auth(USER_TOKEN));
  log('TAG-04', 'POST /tags non-admin', 'POST', '/tags', r.s, [403], r.b);

  // TAG-05: POST /tags - no token
  r = await req('POST', '/tags', { name: 'Hack', slug: 'hack-tag2' });
  log('TAG-05', 'POST /tags no token', 'POST', '/tags', r.s, [401], r.b);

  // TAG-06: POST /tags - duplicate slug
  r = await req('POST', '/tags', { name: 'Dup Tag', slug: tagSlug }, auth(ADMIN_TOKEN));
  log('TAG-06', 'POST /tags duplicate slug', 'POST', '/tags', r.s, [409, 400], r.b);

  // TAG-07: PATCH /tags/:slug - admin update
  r = await req('PATCH', '/tags/' + NEW_TAG_SLUG, { name: 'Updated Tag' }, auth(ADMIN_TOKEN));
  log('TAG-07', 'PATCH /tags/:slug admin', 'PATCH', '/tags/:slug', r.s, [200], r.b);
  console.log('  -> Updated tag:', r.b.name);

  // TAG-08: PATCH /tags/:slug - non-admin
  r = await req('PATCH', '/tags/' + NEW_TAG_SLUG, { name: 'Hack' }, auth(USER_TOKEN));
  log('TAG-08', 'PATCH /tags/:slug non-admin', 'PATCH', '/tags/:slug', r.s, [403], r.b);

  // TAG-09: PATCH /tags/:slug - nonexistent
  r = await req('PATCH', '/tags/nonexistent-xyz', { name: 'Ghost' }, auth(ADMIN_TOKEN));
  log('TAG-09', 'PATCH /tags/:slug nonexistent', 'PATCH', '/tags/:slug', r.s, [404], r.b);

  // TAG-10: DELETE /tags/:slug - non-admin
  r = await req('DELETE', '/tags/' + NEW_TAG_SLUG, null, auth(USER_TOKEN));
  log('TAG-10', 'DELETE /tags/:slug non-admin', 'DELETE', '/tags/:slug', r.s, [403], r.b);

  // TAG-11: DELETE /tags/:slug - nonexistent
  r = await req('DELETE', '/tags/nonexistent-xyz', null, auth(ADMIN_TOKEN));
  log('TAG-11', 'DELETE /tags/:slug nonexistent', 'DELETE', '/tags/:slug', r.s, [404], r.b);

  // TAG-12: DELETE /tags/:slug - admin delete
  r = await req('DELETE', '/tags/' + NEW_TAG_SLUG, null, auth(ADMIN_TOKEN));
  log('TAG-12', 'DELETE /tags/:slug admin', 'DELETE', '/tags/:slug', r.s, [200], r.b);
  console.log('  -> Delete response:', JSON.stringify(r.b).slice(0, 100));

  // Cleanup: delete test user
  r = await req('DELETE', '/users/' + USER_ID, null, auth(ADMIN_TOKEN));
  console.log('CLEANUP test user:', r.s);

  // Summary
  const passed = results.filter(x => x.pass === 'PASS').length;
  const failed = results.filter(x => x.pass === 'FAIL').length;
  console.log(`\n=== SESSION 3 SUMMARY: ${passed} PASS, ${failed} FAIL out of ${results.length} tests ===`);

  if (failed > 0) {
    console.log('\nFAILED TESTS:');
    results.filter(x => x.pass === 'FAIL').forEach(x => {
      console.log(`  ${x.id}: ${x.name} - got ${x.status} expected ${x.expected.join('/')} - ${x.body.slice(0, 150)}`);
    });
  }
}

main().catch(e => console.error('FATAL:', e.message, e.stack));