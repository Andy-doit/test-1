const fs = require('fs');
const newman = require('newman');

const collectionFile = 'hotstock-postman-collection-generated.json';
const coll = JSON.parse(fs.readFileSync(collectionFile, 'utf8'));

const authFolder = coll.item.find(i => i.name === 'Auth');
const usersFolder = coll.item.find(i => i.name === 'Users');
const categoriesFolderIndex = coll.item.findIndex(i => i.name === 'Categories');
const categoriesFolder = coll.item[categoriesFolderIndex];
const tagsFolderIndex = coll.item.findIndex(i => i.name === 'Tags');
const tagsFolder = coll.item[tagsFolderIndex];
const articlesFolderIndex = coll.item.findIndex(i => i.name === 'Articles');
const articlesFolder = coll.item[articlesFolderIndex];

function createTestCase(original, name, bodyParams, expectedStatus, customUrl = null, authConfig = undefined) {
    const tc = JSON.parse(JSON.stringify(original));
    tc.name = `${original.name} - ${name}`;
    
    if (customUrl) {
        if (typeof tc.request.url === 'string') {
            tc.request.url = customUrl;
        } else {
            const urlObj = tc.request.url;
            const newPath = customUrl.replace('{{baseUrl}}', '').split('/').filter(p => p);
            urlObj.path = newPath;
            urlObj.raw = customUrl;
            
            // Re-parse query params if any
            if (customUrl.includes('?')) {
                const qStr = customUrl.split('?')[1];
                urlObj.query = qStr.split('&').map(pair => {
                    const [key, val] = pair.split('=');
                    return { key, value: val };
                });
            } else {
                urlObj.query = [];
            }
        }
    }

    if (bodyParams !== null && tc.request.body && tc.request.body.mode === 'raw') {
        tc.request.body.raw = JSON.stringify(bodyParams, null, 2);
    } else if (bodyParams !== null) {
        tc.request.body = { mode: 'raw', raw: JSON.stringify(bodyParams, null, 2), options: { raw: { language: 'json' } } };
    }
    
    if (authConfig === 'noauth') {
        tc.request.auth = null;
        if (tc.request.header) tc.request.header = tc.request.header.filter(h => h.key !== 'Authorization');
    } else if (authConfig) {
        tc.request.auth = null;
        if (!tc.request.header) tc.request.header = [];
        tc.request.header = tc.request.header.filter(h => h.key !== 'Authorization');
        tc.request.header.push({ key: 'Authorization', value: `Bearer ${authConfig}`, type: 'text' });
    }
    
    const ev = tc.event ? tc.event.find(e => e.listen === 'test') : null;
    if (ev) {
        ev.script.exec = [
            `pm.test("Status code is ${expectedStatus}", function () {`,
            `    pm.response.to.have.status(${expectedStatus});`,
            `});`
        ];
    } else {
        if (!tc.event) tc.event = [];
        tc.event.push({
            listen: 'test',
            script: {
                type: 'text/javascript',
                exec: [
                    `pm.test("Status code is ${expectedStatus}", function () {`,
                    `    pm.response.to.have.status(${expectedStatus});`,
                    `});`
                ]
            }
        });
    }
    return tc;
}

// Ensure pre-request scripts and variable capturing
const loginReq = authFolder.item.find(i => i.request.url.path.includes('login'));
const registerReq = authFolder.item.find(i => i.request.url.path.includes('register'));

const setupAdminReq = createTestCase(loginReq, 'Admin Login (Setup)', { email: 'admin@app.com', password: 'change-me-immediately' }, 200);
setupAdminReq.event.find(e => e.listen === 'test').script.exec.push(
    `if (pm.response.code === 200) {`,
    `    var token = pm.response.json().access_token;`,
    `    pm.collectionVariables.set("admin_token", token);`,
    `}`
);

const ts = Date.now();
const testUserEmail = `user${ts}@test.com`;
const setupUserReq = createTestCase(registerReq, 'Create Test User (Setup)', { 
    email: testUserEmail, 
    password: 'Test@12345', 
    confirmPassword: 'Test@12345', 
    username: `user${ts}`, 
    fullName: 'Test User' 
}, 201);
setupUserReq.event.find(e => e.listen === 'test').script.exec.push(
    `if (pm.response.code === 201) {`,
    `    var token = pm.response.json().access_token;`,
    `    pm.collectionVariables.set("user_token", token);`,
    `}`
);

// We need an endpoint to get the Test User ID.
const getMeReqOriginal = usersFolder.item.find(i => i.request.url.path.includes('me') && i.request.method === 'GET');
const getMeSetupReq = createTestCase(getMeReqOriginal, 'Get Test User ID (Setup)', null, 200, null, '{{user_token}}');
getMeSetupReq.event.find(e => e.listen === 'test').script.exec.push(
    `if (pm.response.code === 200) {`,
    `    pm.collectionVariables.set("user_id", pm.response.json().id);`,
    `}`
);

const catCases = [];
const tagCases = [];
const artCases = [];

catCases.push(setupAdminReq);
catCases.push(setupUserReq);
catCases.push(getMeSetupReq);

// CATEGORIES
const catPost = categoriesFolder.item.find(i => i.request.method === 'POST');
const catGet = categoriesFolder.item.find(i => i.request.method === 'GET' && !i.request.url.path.some(p => p.includes(':') || p.includes('slug')));
const catGetOne = categoriesFolder.item.find(i => i.request.method === 'GET' && i.request.url.path.some(p => p.includes(':') || p.includes('slug')));
const catPatch = categoriesFolder.item.find(i => i.request.method === 'PATCH');
const catDelete = categoriesFolder.item.find(i => i.request.method === 'DELETE');

const catTs = Date.now();
const testCatSlug = `cat-${catTs}`;

const catPostAdmin = createTestCase(catPost, 'Thành công (Admin)', { name: 'Category Test', slug: testCatSlug }, 201, null, '{{admin_token}}');
catPostAdmin.event.find(e => e.listen === 'test').script.exec.push(
    `if (pm.response.code === 201) {`,
    `    pm.collectionVariables.set("cat_slug", pm.response.json().slug);`,
    `    pm.collectionVariables.set("cat_id", pm.response.json().id);`,
    `}`
);

catCases.push(catPostAdmin);
catCases.push(createTestCase(catPost, 'Trùng slug (Admin)', { name: 'Category Test 2', slug: testCatSlug }, 409, null, '{{admin_token}}'));
catCases.push(createTestCase(catPost, 'Forbidden (User)', { name: 'User Cat' }, 403, null, '{{user_token}}'));
catCases.push(createTestCase(catGet, 'Danh sách danh mục (Public)', null, 200, null, 'noauth'));
catCases.push(createTestCase(catGetOne, 'Chi tiết danh mục (Public)', null, 200, '{{baseUrl}}/categories/{{cat_slug}}', 'noauth'));
catCases.push(createTestCase(catPatch, 'Cập nhật danh mục (Admin)', { name: 'Category Test Updated' }, 200, '{{baseUrl}}/categories/{{cat_slug}}', '{{admin_token}}'));

// TAGS
const tagPost = tagsFolder.item.find(i => i.request.method === 'POST');
const tagGet = tagsFolder.item.find(i => i.request.method === 'GET' && !i.request.url.path.some(p => p.includes(':') || p.includes('id')));
const tagPatch = tagsFolder.item.find(i => i.request.method === 'PATCH');
const tagDelete = tagsFolder.item.find(i => i.request.method === 'DELETE');

const tagTs = Date.now();
const testTagSlug = `tag-${tagTs}`;

const tagPostAdmin = createTestCase(tagPost, 'Thành công (Admin)', { name: 'Tag Test', slug: testTagSlug }, 201, null, '{{admin_token}}');
tagPostAdmin.event.find(e => e.listen === 'test').script.exec.push(
    `if (pm.response.code === 201) {`,
    `    pm.collectionVariables.set("tag_id", pm.response.json().id);`,
    `    pm.collectionVariables.set("tag_slug", pm.response.json().slug);`,
    `}`
);

tagCases.push(tagPostAdmin);
tagCases.push(createTestCase(tagPost, 'Forbidden (User)', { name: 'User Tag' }, 403, null, '{{user_token}}'));
tagCases.push(createTestCase(tagGet, 'Danh sách thẻ (Public)', null, 200, null, 'noauth'));
tagCases.push(createTestCase(tagPatch, 'Cập nhật thẻ (Admin)', { name: 'Tag Test Updated' }, 200, '{{baseUrl}}/tags/{{tag_slug}}', '{{admin_token}}'));

// ARTICLES
const artPost = articlesFolder.item.find(i => i.request.method === 'POST');
const artGetPublic = articlesFolder.item.find(i => i.request.method === 'GET' && !i.request.url.path.includes('me') && !i.request.url.path.includes('admin') && !i.request.url.path.some(p => p.includes(':')));
const artGetMe = articlesFolder.item.find(i => i.request.method === 'GET' && i.request.url.path.includes('me'));
const artGetAdmin = articlesFolder.item.find(i => i.request.method === 'GET' && i.request.url.path.includes('admin') && !i.request.url.path.some(p => p.includes(':')));
const artGetOneAdmin = articlesFolder.item.find(i => i.request.method === 'GET' && i.request.url.path.includes('admin') && i.request.url.path.some(p => p.includes(':')));
const artGetOne = articlesFolder.item.find(i => i.request.method === 'GET' && !i.request.url.path.includes('admin') && !i.request.url.path.includes('me') && i.request.url.path.some(p => p.includes(':')));
const artPatch = articlesFolder.item.find(i => i.request.method === 'PATCH');
const artDelete = articlesFolder.item.find(i => i.request.method === 'DELETE');

const testArtSlug = `article-${Date.now()}`;
const artBody = {
    title: 'Test Article Title',
    description: 'Test description',
    slug: testArtSlug,
    publishedAt: new Date().toISOString(),
    contentBlocks: [
        { content: 'Paragraph 1 content', type: 'text', id: 'block-1' }
    ],
    categoryId: 1, // Will be replaced by pre-request script dynamically if we could, but here we can't easily dynamically replace inside body JSON. 
    // Wait, let's just use JSON.stringify with string replacement for {{cat_id}} and {{tag_id}}!
};

const artPostAdmin = createTestCase(artPost, 'Tạo bài viết (Admin)', artBody, 201, null, '{{admin_token}}');
// Replace hardcoded categoryId with variable placeholder!
artPostAdmin.request.body.raw = JSON.stringify(artBody).replace('1', '{{cat_id}}');

artPostAdmin.event.find(e => e.listen === 'test').script.exec.push(
    `if (pm.response.code === 201) {`,
    `    pm.collectionVariables.set("art_slug", pm.response.json().slug);`,
    `}`
);

artCases.push(artPostAdmin);
artCases.push(createTestCase(artPost, 'Tạo bài viết - Lỗi thiếu field (Admin)', { title: 'No description' }, 400, null, '{{admin_token}}'));
artCases.push(createTestCase(artGetPublic, 'Danh sách bài viết (Public)', null, 200, null, 'noauth'));
artCases.push(createTestCase(artGetMe, 'Danh sách bài viết của tôi (User)', null, 200, null, '{{user_token}}'));
artCases.push(createTestCase(artGetMe, 'Danh sách bài viết của tôi (Unauthorized)', null, 401, null, 'noauth'));

artCases.push(createTestCase(artGetAdmin, 'Danh sách bài viết Admin', null, 200, '{{baseUrl}}/articles/admin/list', '{{admin_token}}'));
artCases.push(createTestCase(artGetAdmin, 'Danh sách bài viết Admin - Forbidden (User)', null, 403, '{{baseUrl}}/articles/admin/list', '{{user_token}}'));

artCases.push(createTestCase(artGetOneAdmin, 'Chi tiết bài viết Admin', null, 200, '{{baseUrl}}/articles/admin/{{art_slug}}', '{{admin_token}}'));
artCases.push(createTestCase(artGetOne, 'Chi tiết bài viết (Public)', null, 200, '{{baseUrl}}/articles/{{art_slug}}', 'noauth'));
artCases.push(createTestCase(artGetOne, 'Chi tiết bài viết (Non-existent)', null, 404, '{{baseUrl}}/articles/non-existent-999', 'noauth'));

artCases.push(createTestCase(artPatch, 'Cập nhật bài viết (Admin)', { title: 'Updated Title' }, 200, '{{baseUrl}}/articles/{{art_slug}}', '{{admin_token}}'));
artCases.push(createTestCase(artPatch, 'Cập nhật bài viết - Forbidden (User)', { title: 'Hacked' }, 403, '{{baseUrl}}/articles/{{art_slug}}', '{{user_token}}'));

// DELETE ALL
artCases.push(createTestCase(artDelete, 'Xóa bài viết (Admin)', null, 200, '{{baseUrl}}/articles/{{art_slug}}', '{{admin_token}}'));
tagCases.push(createTestCase(tagDelete, 'Xóa thẻ (Admin)', null, 200, '{{baseUrl}}/tags/{{tag_slug}}', '{{admin_token}}'));
catCases.push(createTestCase(catDelete, 'Xóa danh mục (Admin)', null, 200, '{{baseUrl}}/categories/{{cat_slug}}', '{{admin_token}}'));

coll.item[categoriesFolderIndex].item = catCases;
coll.item[tagsFolderIndex].item = tagCases;
coll.item[articlesFolderIndex].item = artCases;

if (!coll.variable) coll.variable = [];
function setOrAddVariable(key, defaultValue) {
    let variable = coll.variable.find(v => v.key === key);
    if (!variable) coll.variable.push({ key, value: defaultValue, type: 'string' });
    else variable.value = defaultValue;
}

setOrAddVariable("admin_token", "");
setOrAddVariable("user_token", "");
setOrAddVariable("cat_slug", "");
setOrAddVariable("cat_id", "");
setOrAddVariable("tag_id", "");
setOrAddVariable("art_slug", "");
setOrAddVariable("baseUrl", "http://localhost:3001/api/v1");

const tempCollFile = 'temp-articles-collection.json';
fs.writeFileSync(tempCollFile, JSON.stringify(coll, null, 2));

console.log('Running Newman for Categories, Tags, and Articles modules...');

newman.run({
    collection: tempCollFile,
    envVar: [
        { key: 'baseUrl', value: 'http://localhost:3001/api/v1' }
    ],
    reporters: ['cli', 'json'],
    reporter: {
        json: {
            export: 'articles-report.json'
        }
    }
}, (err, summary) => {
    if (err) {
        console.error('Newman run failed:', err);
        process.exit(1);
    }
    
    let report = '## Giai đoạn 2 - Kết quả test module: Categories, Tags, Articles\n\n';
    let passedCnt = 0;
    let failedCnt = 0;
    
    summary.run.executions.forEach(exec => {
        const reqName = exec.item.name;
        const method = exec.request.method;
        const endpoint = exec.request.url.getPathWithQuery();
        const body = exec.request.body ? exec.request.body.raw : 'N/A';
        const status = exec.response ? exec.response.code : 'ERROR';
        const responseBody = exec.response ? exec.response.stream.toString() : 'N/A';
        
        if (reqName.includes('(Setup)') && status !== 500) return;
        
        let passed = true;
        let failMessage = [];
        if (exec.assertions) {
            exec.assertions.forEach(a => {
                if (a.error) {
                    passed = false;
                    failMessage.push(a.error.message);
                }
            });
        }
        
        if (passed) passedCnt++; else failedCnt++;
        
        report += `### ${reqName}\n`;
        report += `- **Method**: ${method}\n`;
        report += `- **Endpoint**: \`${endpoint}\`\n`;
        report += `- **Body**: \`${body}\`\n`;
        report += `- **Status**: ${status}\n`;
        report += `- **Kết quả**: ${passed ? '✅ PASS' : '❌ FAIL'}\n`;
        if (!passed) {
            report += `- **Lỗi Assertion**: ${failMessage.join(', ')}\n`;
            report += `- **Response Thực Tế**: \`${responseBody}\`\n`;
        }
        report += '\n---\n';
    });
    
    report += `\n**Tổng kết**: ${passedCnt} PASS / ${passedCnt + failedCnt} TOTAL\n`;
    fs.writeFileSync('articles-test-results.md', report);
    console.log('Results written to articles-test-results.md');
});