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
  const loginRes = await req('POST', '/auth/login', { email: 'admin@app.com', password: 'change-me-immediately' });
  const ADMIN_TOKEN = loginRes.b.access_token;
  if (!ADMIN_TOKEN) {
    console.error('Failed to login:', loginRes.s, loginRes.b);
    return;
  }
  
  const allPortfolios = await req('GET', '/portfolios/all', null, auth(ADMIN_TOKEN));
  const data = Array.isArray(allPortfolios.b) ? allPortfolios.b : (allPortfolios.b?.data || []);
  
  console.log(`Found ${data.length} portfolios.`);
  
  for (const p of data) {
    const planSlug = p.plan?.slug || 'unknown';
    console.log(`\n=== Portfolio ID: ${p.id} | Plan: ${planSlug} ===`);
    console.log(JSON.stringify(p, null, 2));
  }
}

main().catch(console.error);