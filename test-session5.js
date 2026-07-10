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
    console.log(`${pass} | ${id} | ${name} | ${method} ${endpoint} | ${status} (expect ${expected.join('/')}) | ${bodyStr.slice(0, 250)}`);
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
  console.log('Test user ID:', USER_ID);

  // Get plan slugs
  r = await req('GET', '/plans', null);
  const plans = Array.isArray(r.b) ? r.b : [];
  const FREE_PLAN = plans.find(p => p.slug === 'free');
  const GOLD_PLAN = plans.find(p => p.slug === 'gold');
  const FREE_PLAN_ID = FREE_PLAN?.id || 1;
  const GOLD_PLAN_ID = GOLD_PLAN?.id || 4;
  console.log('Plans: free id=', FREE_PLAN_ID, 'gold id=', GOLD_PLAN_ID);

  // =========================================================
  // HEALTH CHECK
  // =========================================================

  r = await req('GET', '/health', null);
  log('HLT-01', 'GET /health', 'GET', '/health', r.s, [200], r.b);
  console.log('  -> Health:', JSON.stringify(r.b).slice(0, 200));

  // =========================================================
  // PLANS MODULE (public + admin)
  // =========================================================

  // PLN-01: GET /plans - public list
  r = await req('GET', '/plans', null);
  log('PLN-01', 'GET /plans public', 'GET', '/plans', r.s, [200], r.b);
  const plansList = Array.isArray(r.b) ? r.b : (r.b?.data || []);
  console.log('  -> Plans count:', plansList.length);
  if (plansList.length > 0) console.log('  -> Plan keys:', Object.keys(plansList[0]).join(', '));

  // PLN-02: GET /plans/admin - admin
  r = await req('GET', '/plans/admin', null, auth(ADMIN_TOKEN));
  log('PLN-02', 'GET /plans/admin admin', 'GET', '/plans/admin', r.s, [200], r.b);
  const adminPlans = Array.isArray(r.b) ? r.b : (r.b?.data || []);
  console.log('  -> Admin plans count:', adminPlans.length);

  // PLN-03: GET /plans/admin - non-admin
  r = await req('GET', '/plans/admin', null, auth(USER_TOKEN));
  log('PLN-03', 'GET /plans/admin non-admin', 'GET', '/plans/admin', r.s, [403], r.b);

  // PLN-04: GET /plans/admin - no token
  r = await req('GET', '/plans/admin', null);
  log('PLN-04', 'GET /plans/admin no token', 'GET', '/plans/admin', r.s, [401], r.b);

  // PLN-05: GET /plans/:slug - by slug
  r = await req('GET', '/plans/free', null);
  log('PLN-05', 'GET /plans/:slug (free)', 'GET', '/plans/free', r.s, [200], r.b);
  console.log('  -> Free plan:', JSON.stringify(r.b).slice(0, 200));

  // PLN-06: GET /plans/:slug - nonexistent
  r = await req('GET', '/plans/nonexistent-plan-xxx', null);
  log('PLN-06', 'GET /plans/:slug nonexistent', 'GET', '/plans/nonexistent-plan-xxx', r.s, [404], r.b);

  // PLN-07: POST /plans - admin create
  const planSlug = `test-plan-${ts}`;
  r = await req('POST', '/plans', {
    name: `Test Plan ${ts}`,
    slug: planSlug,
    tagline: 'Test plan tagline',
    icon: 'test',
    theme: 'purple',
    badge: 'Test',
    monthlyPrice: 99000,
    level: 99,
    sortOrder: 99,
    isActive: false,
    features: ['test_feature_1', 'test_feature_2']
  }, auth(ADMIN_TOKEN));
  log('PLN-07', 'POST /plans admin create', 'POST', '/plans', r.s, [201], r.b);
  console.log('  -> Created plan:', JSON.stringify(r.b).slice(0, 200));

  // PLN-08: POST /plans - non-admin
  r = await req('POST', '/plans', {
    name: 'Test Plan Unauthorized',
    slug: `test-plan-unauth-${ts}`,
    monthlyPrice: 0,
    level: 1,
    features: ['test']
  }, auth(USER_TOKEN));
  log('PLN-08', 'POST /plans non-admin', 'POST', '/plans', r.s, [403], r.b);

  // PLN-09: POST /plans - no token
  r = await req('POST', '/plans', { name: 'Test', slug: 'test', monthlyPrice: 0, level: 1, features: ['test'] });
  log('PLN-09', 'POST /plans no token', 'POST', '/plans', r.s, [401], r.b);

  // PLN-10: POST /plans - duplicate slug
  r = await req('POST', '/plans', {
    name: 'Duplicate Plan Free',
    slug: 'free',
    level: 1,
    monthlyPrice: 0,
    features: ['test_dup']
  }, auth(ADMIN_TOKEN));
  log('PLN-10', 'POST /plans duplicate slug', 'POST', '/plans', r.s, [409], r.b);

  // PLN-11: PATCH /plans/:slug - admin update
  r = await req('PATCH', `/plans/${planSlug}`, {
    description: 'Updated description',
    monthlyPrice: 149000,
    isActive: true
  }, auth(ADMIN_TOKEN));
  log('PLN-11', 'PATCH /plans/:slug admin', 'PATCH', `/plans/${planSlug}`, r.s, [200], r.b);
  console.log('  -> Updated plan:', JSON.stringify(r.b).slice(0, 200));

  // PLN-12: PATCH /plans/:slug - non-admin
  r = await req('PATCH', `/plans/${planSlug}`, { monthlyPrice: 50000 }, auth(USER_TOKEN));
  log('PLN-12', 'PATCH /plans/:slug non-admin', 'PATCH', `/plans/${planSlug}`, r.s, [403], r.b);

  // PLN-13: PATCH /plans/:slug - no token
  r = await req('PATCH', `/plans/${planSlug}`, { monthlyPrice: 50000 });
  log('PLN-13', 'PATCH /plans/:slug no token', 'PATCH', `/plans/${planSlug}`, r.s, [401], r.b);

  // PLN-14: PATCH /plans/:slug - nonexistent
  r = await req('PATCH', '/plans/nonexistent-plan-xxx', { monthlyPrice: 50000 }, auth(ADMIN_TOKEN));
  log('PLN-14', 'PATCH /plans/:slug nonexistent', 'PATCH', '/plans/nonexistent-plan-xxx', r.s, [404], r.b);

  // PLN-15: DELETE /plans/:slug - non-admin
  r = await req('DELETE', `/plans/${planSlug}`, null, auth(USER_TOKEN));
  log('PLN-15', 'DELETE /plans/:slug non-admin', 'DELETE', `/plans/${planSlug}`, r.s, [403], r.b);

  // PLN-16: DELETE /plans/:slug - no token
  r = await req('DELETE', `/plans/${planSlug}`, null);
  log('PLN-16', 'DELETE /plans/:slug no token', 'DELETE', `/plans/${planSlug}`, r.s, [401], r.b);

  // PLN-17: DELETE /plans/:slug - nonexistent
  r = await req('DELETE', '/plans/nonexistent-plan-xxx', null, auth(ADMIN_TOKEN));
  log('PLN-17', 'DELETE /plans/:slug nonexistent', 'DELETE', '/plans/nonexistent-plan-xxx', r.s, [404], r.b);

  // PLN-18: DELETE /plans/:slug - admin cleanup
  r = await req('DELETE', `/plans/${planSlug}`, null, auth(ADMIN_TOKEN));
  log('PLN-18', 'DELETE /plans/:slug admin (cleanup)', 'DELETE', `/plans/${planSlug}`, r.s, [200], r.b);
  console.log('  -> Delete response:', JSON.stringify(r.b).slice(0, 100));

  // =========================================================
  // CONTACT MODULE
  // =========================================================

  // CNT-01: POST /contact - valid request
  r = await req('POST', '/contact', {
    fullname: 'Nguyễn Văn Test',
    email: `${testUsername}@test.com`,
    message: 'Đây là nội dung test liên hệ từ automated test script',
    optIn: false
  });
  log('CNT-01', 'POST /contact valid', 'POST', '/contact', r.s, [200, 201], r.b);
  console.log('  -> Contact response:', JSON.stringify(r.b).slice(0, 200));

  // CNT-02: POST /contact - missing required fields (fullname)
  r = await req('POST', '/contact', {
    message: 'Test message'
  });
  log('CNT-02', 'POST /contact missing fullname', 'POST', '/contact', r.s, [400], r.b);

  // CNT-03: POST /contact - invalid email
  r = await req('POST', '/contact', {
    fullname: 'Test User',
    email: 'not-an-email',
    message: 'Test message'
  });
  log('CNT-03', 'POST /contact invalid email', 'POST', '/contact', r.s, [400], r.b);

  // CNT-04: POST /contact - empty body
  r = await req('POST', '/contact', {});
  log('CNT-04', 'POST /contact empty body', 'POST', '/contact', r.s, [400], r.b);

  // =========================================================
  // DASHBOARD
  // =========================================================

  // DSH-01: GET /dashboard/stats - admin
  r = await req('GET', '/dashboard/stats', null, auth(ADMIN_TOKEN));
  log('DSH-01', 'GET /dashboard/stats admin', 'GET', '/dashboard/stats', r.s, [200], r.b);
  console.log('  -> Stats:', JSON.stringify(r.b).slice(0, 300));

  // DSH-02: GET /dashboard/stats - non-admin
  r = await req('GET', '/dashboard/stats', null, auth(USER_TOKEN));
  log('DSH-02', 'GET /dashboard/stats non-admin', 'GET', '/dashboard/stats', r.s, [403], r.b);

  // DSH-03: GET /dashboard/stats - no token
  r = await req('GET', '/dashboard/stats', null);
  log('DSH-03', 'GET /dashboard/stats no token', 'GET', '/dashboard/stats', r.s, [401], r.b);

  // =========================================================
  // PORTFOLIOS - GET /portfolios (public - requires ?plan=)
  // =========================================================

  // PFL-01: GET /portfolios?plan=free - public
  r = await req('GET', '/portfolios?plan=free', null);
  log('PFL-01', 'GET /portfolios?plan=free public', 'GET', '/portfolios?plan=free', r.s, [200], r.b);
  console.log('  -> Portfolio response:', JSON.stringify(r.b).slice(0, 300));

  // PFL-02: GET /portfolios?plan=gold - authenticated (regular user cannot access gold plan)
  r = await req('GET', '/portfolios?plan=gold', null, auth(USER_TOKEN));
  log('PFL-02', 'GET /portfolios?plan=gold authenticated (no gold plan)', 'GET', '/portfolios?plan=gold', r.s, [200, 403], r.b);

  // PFL-03: GET /portfolios - missing plan param
  r = await req('GET', '/portfolios', null);
  log('PFL-03', 'GET /portfolios missing plan', 'GET', '/portfolios', r.s, [400], r.b);

  // PFL-04: GET /portfolios?plan=invalid - invalid plan slug
  r = await req('GET', '/portfolios?plan=nonexistent-plan', null);
  log('PFL-04', 'GET /portfolios?plan=invalid', 'GET', '/portfolios?plan=nonexistent-plan', r.s, [404], r.b);

  // =========================================================
  // PORTFOLIOS - GET /portfolios/all (Admin)
  // =========================================================

  // PFL-05: GET /portfolios/all - admin
  r = await req('GET', '/portfolios/all', null, auth(ADMIN_TOKEN));
  log('PFL-05', 'GET /portfolios/all admin', 'GET', '/portfolios/all', r.s, [200], r.b);
  const allPort = Array.isArray(r.b) ? r.b : (r.b?.data || []);
  console.log('  -> Admin portfolio count:', allPort.length || r.b?.total || 'unknown');
  if (allPort.length > 0) console.log('  -> Portfolio keys:', Object.keys(allPort[0]).join(', '));

  // PFL-06: GET /portfolios/all - non-admin
  r = await req('GET', '/portfolios/all', null, auth(USER_TOKEN));
  log('PFL-06', 'GET /portfolios/all non-admin', 'GET', '/portfolios/all', r.s, [403], r.b);

  // PFL-07: GET /portfolios/all - no token
  r = await req('GET', '/portfolios/all', null);
  log('PFL-07', 'GET /portfolios/all no token', 'GET', '/portfolios/all', r.s, [401], r.b);

  // =========================================================
  // PORTFOLIOS - POST /portfolios (Create - admin)
  // =========================================================

  // PFL-08: POST /portfolios - admin create (with all required arrays)
  const portfolioBody = {
    planId: FREE_PLAN_ID,
    publishedAt: new Date().toISOString(),
    stocks: [
      {
        symbol: 'VNM',
        purchaseDate: '2026-01-15',
        costBasis: 85000,
        marketPrice: 92000,
        quantity: 100,
        sector: 'Tiêu dùng',
        note: 'Test stock 1'
      },
      {
        symbol: 'FPT',
        purchaseDate: '2026-02-01',
        costBasis: 120000,
        marketPrice: 135000,
        quantity: 50,
        sector: 'Công nghệ',
        note: 'Test stock 2'
      }
    ],
    information: [],
    reasons: [],
    signals: []
  };
  r = await req('POST', '/portfolios', portfolioBody, auth(ADMIN_TOKEN));
  log('PFL-08', 'POST /portfolios admin create', 'POST', '/portfolios', r.s, [201, 200], r.b);
  console.log('  -> Created portfolio:', JSON.stringify(r.b).slice(0, 250));
  const PORTFOLIO_ID = r.b.id;
  console.log('  -> Portfolio ID:', PORTFOLIO_ID);

  // PFL-09: POST /portfolios - non-admin
  r = await req('POST', '/portfolios', portfolioBody, auth(USER_TOKEN));
  log('PFL-09', 'POST /portfolios non-admin', 'POST', '/portfolios', r.s, [403], r.b);

  // PFL-10: POST /portfolios - no token
  r = await req('POST', '/portfolios', portfolioBody);
  log('PFL-10', 'POST /portfolios no token', 'POST', '/portfolios', r.s, [401], r.b);

  // PFL-11: POST /portfolios - missing required arrays
  r = await req('POST', '/portfolios', { planId: FREE_PLAN_ID, publishedAt: new Date().toISOString(), stocks: [] }, auth(ADMIN_TOKEN));
  log('PFL-11', 'POST /portfolios missing arrays', 'POST', '/portfolios', r.s, [400], r.b);
  console.log('  -> Missing arrays response:', JSON.stringify(r.b).slice(0, 200));

  // PFL-12: POST /portfolios - invalid planId
  r = await req('POST', '/portfolios', { ...portfolioBody, planId: 99999 }, auth(ADMIN_TOKEN));
  log('PFL-12', 'POST /portfolios invalid planId', 'POST', '/portfolios', r.s, [404, 400], r.b);

  // =========================================================
  // PORTFOLIOS - PATCH /portfolios/:id (Update)
  // =========================================================

  if (PORTFOLIO_ID) {
    // PFL-13: PATCH /portfolios/:id - admin update
    r = await req('PATCH', '/portfolios/' + PORTFOLIO_ID, {
      stocks: [
        {
          symbol: 'VNM',
          purchaseDate: '2026-01-15',
          costBasis: 85000,
          marketPrice: 95000,
          quantity: 150,
          sector: 'Tiêu dùng',
          note: 'Updated stock'
        }
      ],
      information: [],
      reasons: [],
      signals: []
    }, auth(ADMIN_TOKEN));
    log('PFL-13', 'PATCH /portfolios/:id admin', 'PATCH', '/portfolios/:id', r.s, [200], r.b);
    console.log('  -> Updated portfolio:', JSON.stringify(r.b).slice(0, 200));

    // PFL-14: PATCH /portfolios/:id - non-admin
    r = await req('PATCH', '/portfolios/' + PORTFOLIO_ID, { stocks: [] }, auth(USER_TOKEN));
    log('PFL-14', 'PATCH /portfolios/:id non-admin', 'PATCH', '/portfolios/:id', r.s, [403], r.b);

    // PFL-15: PATCH /portfolios/:id - no token
    r = await req('PATCH', '/portfolios/' + PORTFOLIO_ID, { stocks: [] });
    log('PFL-15', 'PATCH /portfolios/:id no token', 'PATCH', '/portfolios/:id', r.s, [401], r.b);
  }

  // PFL-16: PATCH /portfolios/999999 - nonexistent
  r = await req('PATCH', '/portfolios/999999', { stocks: [] }, auth(ADMIN_TOKEN));
  log('PFL-16', 'PATCH /portfolios/:id nonexistent', 'PATCH', '/portfolios/999999', r.s, [404], r.b);

  // =========================================================
  // PORTFOLIOS - DELETE /portfolios/:id
  // =========================================================

  // PFL-17: DELETE /portfolios/:id - non-admin
  if (PORTFOLIO_ID) {
    r = await req('DELETE', '/portfolios/' + PORTFOLIO_ID, null, auth(USER_TOKEN));
    log('PFL-17', 'DELETE /portfolios/:id non-admin', 'DELETE', '/portfolios/:id', r.s, [403], r.b);
  }

  // PFL-18: DELETE /portfolios/:id - no token
  if (PORTFOLIO_ID) {
    r = await req('DELETE', '/portfolios/' + PORTFOLIO_ID, null);
    log('PFL-18', 'DELETE /portfolios/:id no token', 'DELETE', '/portfolios/:id', r.s, [401], r.b);
  }

  // PFL-19: DELETE /portfolios/999999 - nonexistent
  r = await req('DELETE', '/portfolios/999999', null, auth(ADMIN_TOKEN));
  log('PFL-19', 'DELETE /portfolios/:id nonexistent', 'DELETE', '/portfolios/999999', r.s, [404], r.b);

  // PFL-20: DELETE /portfolios/:id - admin (cleanup)
  if (PORTFOLIO_ID) {
    r = await req('DELETE', '/portfolios/' + PORTFOLIO_ID, null, auth(ADMIN_TOKEN));
    log('PFL-20', 'DELETE /portfolios/:id admin', 'DELETE', '/portfolios/:id', r.s, [200], r.b);
    console.log('  -> Delete response:', JSON.stringify(r.b).slice(0, 100));
  }

  // =========================================================
  // VERIFY /portfolios AFTER CREATE+DELETE cycle
  // =========================================================

  // PFL-21: GET /portfolios?plan=free after cleanup - check data consistency
  r = await req('GET', '/portfolios?plan=free', null, auth(ADMIN_TOKEN));
  log('PFL-21', 'GET /portfolios?plan=free after cleanup', 'GET', '/portfolios?plan=free', r.s, [200], r.b);

  // Cleanup: delete test user
  r = await req('DELETE', '/users/' + USER_ID, null, auth(ADMIN_TOKEN));
  console.log('CLEANUP test user:', r.s);

  // Summary
  const passed = results.filter(x => x.pass === 'PASS').length;
  const failed = results.filter(x => x.pass === 'FAIL').length;
  console.log(`\n=== SESSION 5 SUMMARY: ${passed} PASS, ${failed} FAIL out of ${results.length} tests ===`);

  if (failed > 0) {
    console.log('\nFAILED TESTS:');
    results.filter(x => x.pass === 'FAIL').forEach(x => {
      console.log(`  ${x.id}: ${x.name} - got ${x.status} expected ${x.expected.join('/')} - ${x.body.slice(0, 200)}`);
    });
  }
}

main().catch(e => console.error('FATAL:', e.message, e.stack));