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
    console.log(`${pass} | ${id} | ${name} | ${method} ${endpoint} | ${status} (expect ${expected.join('/')}) | ${bodyStr.slice(0, 220)}`);
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

  // Get an existing category for article creation
  r = await req('GET', '/categories', null, auth(ADMIN_TOKEN));
  const cats = Array.isArray(r.b) ? r.b : [];
  const CATEGORY_ID = cats[0]?.id;
  console.log('Using category:', CATEGORY_ID, cats[0]?.name);

  // =========================================================
  // ARTICLES - GET /articles (public list)
  // =========================================================

  // ART-01: GET /articles - public
  r = await req('GET', '/articles', null);
  log('ART-01', 'GET /articles public', 'GET', '/articles', r.s, [200], r.b);
  const pubList = Array.isArray(r.b) ? r.b : (r.b?.data || []);
  console.log('  -> Count:', pubList.length || r.b?.total, 'Keys:', Object.keys(r.b || {}).join(', '));
  if (pubList.length > 0) console.log('  -> Article keys:', Object.keys(pubList[0]).join(', '));

  // ART-02: GET /articles - with auth
  r = await req('GET', '/articles', null, auth(USER_TOKEN));
  log('ART-02', 'GET /articles authenticated', 'GET', '/articles', r.s, [200], r.b);

  // ART-03: GET /articles?page=1&limit=5 - pagination
  r = await req('GET', '/articles?page=1&limit=5', null);
  log('ART-03', 'GET /articles pagination', 'GET', '/articles?page=1&limit=5', r.s, [200], r.b);
  console.log('  -> Pagination result:', typeof r.b === 'object' ? JSON.stringify(r.b).slice(0, 150) : r.b);

  // ART-04: GET /articles?categorySlug=... - filter by category
  if (cats[0]?.slug) {
    r = await req('GET', '/articles?categorySlug=' + cats[0].slug, null);
    log('ART-04', 'GET /articles filter by category', 'GET', '/articles?categorySlug=...', r.s, [200, 400], r.b);
    console.log('  -> Category filter result:', JSON.stringify(r.b).slice(0, 150));
  }

  // ART-05: GET /articles?status=published - filter by status
  r = await req('GET', '/articles?status=published', null);
  log('ART-05', 'GET /articles filter status=published', 'GET', '/articles?status=published', r.s, [200, 400], r.b);
  console.log('  -> Status filter result:', JSON.stringify(r.b).slice(0, 150));

  // =========================================================
  // ARTICLES - POST /articles
  // =========================================================

  // ART-06: POST /articles - admin create
  const artSlug = `test-article-${ts}`;
  const articleBody = {
    title: 'Test Article Title',
    description: 'Test description',
    slug: artSlug,
    contentBlocks: [
      { content: 'Paragraph 1 content', id: 'block-1', type: 'paragraph' }
    ],
    categoryId: CATEGORY_ID || 1,
    publishedAt: new Date().toISOString(),
    coverUrl: null,
    tagIds: [],
    readPermission: 'free',
    planIds: []
  };
  r = await req('POST', '/articles', articleBody, auth(ADMIN_TOKEN));
  log('ART-06', 'POST /articles admin create (free)', 'POST', '/articles', r.s, [201, 200], r.b);
  console.log('  -> Created article:', r.b.slug, 'id:', r.b.id);
  const ART_SLUG = r.b.slug || artSlug;
  const ART_ID = r.b.id;

  // ART-07: POST /articles - create article with gold permission
  const artSlug2 = `test-article-gold-${ts}`;
  r = await req('POST', '/articles', {
    ...articleBody,
    title: 'Gold Article',
    slug: artSlug2,
    readPermission: 'gold',
    planIds: [2]
  }, auth(ADMIN_TOKEN));
  log('ART-07', 'POST /articles admin create (gold)', 'POST', '/articles', r.s, [201, 200], r.b);
  const ART_SLUG_GOLD = r.b.slug || artSlug2;
  console.log('  -> Gold article:', ART_SLUG_GOLD, 'readPermission:', r.b.readPermission);

  // ART-08: POST /articles - regular user cannot create
  r = await req('POST', '/articles', articleBody, auth(USER_TOKEN));
  log('ART-08', 'POST /articles non-admin', 'POST', '/articles', r.s, [403], r.b);

  // ART-09: POST /articles - no token
  r = await req('POST', '/articles', articleBody);
  log('ART-09', 'POST /articles no token', 'POST', '/articles', r.s, [401], r.b);

  // ART-10: POST /articles - missing required fields
  r = await req('POST', '/articles', { title: 'Missing slug' }, auth(ADMIN_TOKEN));
  log('ART-10', 'POST /articles missing fields', 'POST', '/articles', r.s, [400], r.b);

  // ART-11: POST /articles - duplicate slug
  r = await req('POST', '/articles', { ...articleBody }, auth(ADMIN_TOKEN));
  log('ART-11', 'POST /articles duplicate slug', 'POST', '/articles', r.s, [409, 400], r.b);

  // =========================================================
  // ARTICLES - GET /articles/:slug (public detail)
  // =========================================================

  // ART-12: GET /articles/:slug - free article public
  r = await req('GET', '/articles/' + ART_SLUG, null);
  log('ART-12', 'GET /articles/:slug free public', 'GET', '/articles/:slug', r.s, [200], r.b);
  console.log('  -> Article fields:', Object.keys(r.b || {}).join(', '));

  // ART-13: GET /articles/:slug - gold article no auth (should block or return limited)
  r = await req('GET', '/articles/' + ART_SLUG_GOLD, null);
  log('ART-13', 'GET /articles/:slug gold no auth', 'GET', '/articles/:slug (gold)', r.s, [200, 401, 403], r.b);
  console.log('  -> Gold no-auth response:', JSON.stringify(r.b).slice(0, 200));

  // ART-14: GET /articles/:slug - gold article user with free plan (should be restricted)
  r = await req('GET', '/articles/' + ART_SLUG_GOLD, null, auth(USER_TOKEN));
  log('ART-14', 'GET /articles/:slug gold free-user', 'GET', '/articles/:slug (gold)', r.s, [200, 403], r.b);
  console.log('  -> Gold free-user response:', JSON.stringify(r.b).slice(0, 200));

  // ART-15: GET /articles/:slug - gold article admin (should pass)
  r = await req('GET', '/articles/' + ART_SLUG_GOLD, null, auth(ADMIN_TOKEN));
  log('ART-15', 'GET /articles/:slug gold admin', 'GET', '/articles/:slug (gold)', r.s, [200], r.b);

  // ART-16: GET /articles/:slug - nonexistent slug
  r = await req('GET', '/articles/nonexistent-article-xyz', null);
  log('ART-16', 'GET /articles/:slug nonexistent', 'GET', '/articles/nonexistent-xyz', r.s, [404], r.b);

  // =========================================================
  // ARTICLES - GET /articles/me
  // =========================================================

  // ART-17: GET /articles/me - authenticated user
  r = await req('GET', '/articles/me', null, auth(ADMIN_TOKEN));
  log('ART-17', 'GET /articles/me admin', 'GET', '/articles/me', r.s, [200], r.b);
  console.log('  -> My articles:', JSON.stringify(r.b).slice(0, 150));

  // ART-18: GET /articles/me - regular user (no articles)
  r = await req('GET', '/articles/me', null, auth(USER_TOKEN));
  log('ART-18', 'GET /articles/me user no articles', 'GET', '/articles/me', r.s, [200], r.b);
  console.log('  -> User my articles:', JSON.stringify(r.b).slice(0, 100));

  // ART-19: GET /articles/me - no token
  r = await req('GET', '/articles/me', null);
  log('ART-19', 'GET /articles/me no token', 'GET', '/articles/me', r.s, [401], r.b);

  // =========================================================
  // ARTICLES - GET /articles/admin/list
  // =========================================================

  // ART-20: GET /articles/admin/list - admin
  r = await req('GET', '/articles/admin/list', null, auth(ADMIN_TOKEN));
  log('ART-20', 'GET /articles/admin/list admin', 'GET', '/articles/admin/list', r.s, [200], r.b);
  const adminList = Array.isArray(r.b) ? r.b : (r.b?.data || []);
  console.log('  -> Admin list count:', adminList.length || r.b?.total);
  if (adminList.length > 0) console.log('  -> Admin article keys:', Object.keys(adminList[0]).join(', '));

  // ART-21: GET /articles/admin/list - regular user
  r = await req('GET', '/articles/admin/list', null, auth(USER_TOKEN));
  log('ART-21', 'GET /articles/admin/list non-admin', 'GET', '/articles/admin/list', r.s, [403], r.b);

  // ART-22: GET /articles/admin/list - no token
  r = await req('GET', '/articles/admin/list', null);
  log('ART-22', 'GET /articles/admin/list no token', 'GET', '/articles/admin/list', r.s, [401], r.b);

  // =========================================================
  // ARTICLES - GET /articles/admin/:slug
  // =========================================================

  // ART-23: GET /articles/admin/:slug - admin
  r = await req('GET', '/articles/admin/' + ART_SLUG, null, auth(ADMIN_TOKEN));
  log('ART-23', 'GET /articles/admin/:slug admin', 'GET', '/articles/admin/:slug', r.s, [200], r.b);
  console.log('  -> Admin detail fields:', Object.keys(r.b || {}).join(', '));

  // ART-24: GET /articles/admin/:slug - non-admin
  r = await req('GET', '/articles/admin/' + ART_SLUG, null, auth(USER_TOKEN));
  log('ART-24', 'GET /articles/admin/:slug non-admin', 'GET', '/articles/admin/:slug', r.s, [403], r.b);

  // ART-25: GET /articles/admin/:slug - nonexistent
  r = await req('GET', '/articles/admin/nonexistent-xyz', null, auth(ADMIN_TOKEN));
  log('ART-25', 'GET /articles/admin/:slug nonexistent', 'GET', '/articles/admin/:slug', r.s, [404], r.b);

  // =========================================================
  // ARTICLES - PATCH /articles/:slug
  // =========================================================

  // ART-26: PATCH /articles/:slug - admin update
  r = await req('PATCH', '/articles/' + ART_SLUG, {
    title: 'Updated Article Title',
    description: 'Updated description'
  }, auth(ADMIN_TOKEN));
  log('ART-26', 'PATCH /articles/:slug admin', 'PATCH', '/articles/:slug', r.s, [200], r.b);
  console.log('  -> Updated title:', r.b.title);

  // ART-27: PATCH /articles/:slug - non-admin
  r = await req('PATCH', '/articles/' + ART_SLUG, { title: 'Hacked' }, auth(USER_TOKEN));
  log('ART-27', 'PATCH /articles/:slug non-admin', 'PATCH', '/articles/:slug', r.s, [403], r.b);

  // ART-28: PATCH /articles/:slug - no token
  r = await req('PATCH', '/articles/' + ART_SLUG, { title: 'Hacked' });
  log('ART-28', 'PATCH /articles/:slug no token', 'PATCH', '/articles/:slug', r.s, [401], r.b);

  // ART-29: PATCH /articles/:slug - nonexistent
  r = await req('PATCH', '/articles/nonexistent-xyz', { title: 'Ghost' }, auth(ADMIN_TOKEN));
  log('ART-29', 'PATCH /articles/:slug nonexistent', 'PATCH', '/articles/:slug', r.s, [404], r.b);

  // =========================================================
  // ARTICLES - DELETE /articles/:slug
  // =========================================================

  // ART-30: DELETE /articles/:slug - non-admin
  r = await req('DELETE', '/articles/' + ART_SLUG, null, auth(USER_TOKEN));
  log('ART-30', 'DELETE /articles/:slug non-admin', 'DELETE', '/articles/:slug', r.s, [403], r.b);

  // ART-31: DELETE /articles/:slug - no token
  r = await req('DELETE', '/articles/' + ART_SLUG, null);
  log('ART-31', 'DELETE /articles/:slug no token', 'DELETE', '/articles/:slug', r.s, [401], r.b);

  // ART-32: DELETE /articles/:slug - nonexistent
  r = await req('DELETE', '/articles/nonexistent-xyz', null, auth(ADMIN_TOKEN));
  log('ART-32', 'DELETE /articles/:slug nonexistent', 'DELETE', '/articles/:slug', r.s, [404], r.b);

  // ART-33: DELETE /articles/:slug - admin (gold article)
  r = await req('DELETE', '/articles/' + ART_SLUG_GOLD, null, auth(ADMIN_TOKEN));
  log('ART-33', 'DELETE /articles/:slug admin (gold)', 'DELETE', '/articles/:slug', r.s, [200], r.b);
  console.log('  -> Delete gold response:', JSON.stringify(r.b).slice(0, 100));

  // ART-34: DELETE /articles/:slug - admin (free article)
  r = await req('DELETE', '/articles/' + ART_SLUG, null, auth(ADMIN_TOKEN));
  log('ART-34', 'DELETE /articles/:slug admin (free)', 'DELETE', '/articles/:slug', r.s, [200], r.b);
  console.log('  -> Delete free response:', JSON.stringify(r.b).slice(0, 100));

  // Cleanup: delete test user
  r = await req('DELETE', '/users/' + USER_ID, null, auth(ADMIN_TOKEN));
  console.log('CLEANUP test user:', r.s);

  // Summary
  const passed = results.filter(x => x.pass === 'PASS').length;
  const failed = results.filter(x => x.pass === 'FAIL').length;
  console.log(`\n=== SESSION 4 SUMMARY: ${passed} PASS, ${failed} FAIL out of ${results.length} tests ===`);

  if (failed > 0) {
    console.log('\nFAILED TESTS:');
    results.filter(x => x.pass === 'FAIL').forEach(x => {
      console.log(`  ${x.id}: ${x.name} - got ${x.status} expected ${x.expected.join('/')} - ${x.body.slice(0, 200)}`);
    });
  }
}

main().catch(e => console.error('FATAL:', e.message, e.stack));