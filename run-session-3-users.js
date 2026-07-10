const fs = require('fs');
const newman = require('newman');

// 1. Load the generated collection
const collectionFile = 'hotstock-postman-collection-generated.json';
const coll = JSON.parse(fs.readFileSync(collectionFile, 'utf8'));

// 2. Find Auth and Users folders
const authFolder = coll.item.find(i => i.name === 'Auth');
const usersFolderIndex = coll.item.findIndex(i => i.name === 'Users');
const usersFolder = coll.item[usersFolderIndex];

// Helper to create a test case
function createTestCase(original, name, bodyParams, expectedStatus, customUrl = null, authConfig = undefined) {
    const tc = JSON.parse(JSON.stringify(original));
    tc.name = `${original.name} - ${name}`;
    
    if (customUrl) {
        if (typeof tc.request.url === 'string') {
            tc.request.url = customUrl;
        } else {
            // Re-parse URL
            const urlObj = tc.request.url;
            const newPath = customUrl.replace('{{baseUrl}}', '').split('/').filter(p => p);
            urlObj.path = newPath;
            urlObj.raw = customUrl;
        }
    }

    if (bodyParams !== null && tc.request.body && tc.request.body.mode === 'raw') {
        tc.request.body.raw = JSON.stringify(bodyParams, null, 2);
    } else if (bodyParams !== null) {
        tc.request.body = { mode: 'raw', raw: JSON.stringify(bodyParams, null, 2), options: { raw: { language: 'json' } } };
    }
    
    // Handle auth via headers to avoid variable shadowing and serialization issues
    if (authConfig === 'noauth') {
        tc.request.auth = null;
        if (tc.request.header) {
            tc.request.header = tc.request.header.filter(h => h.key !== 'Authorization');
        }
    } else if (authConfig) {
        tc.request.auth = null;
        if (!tc.request.header) tc.request.header = [];
        tc.request.header = tc.request.header.filter(h => h.key !== 'Authorization');
        tc.request.header.push({
            key: 'Authorization',
            value: `Bearer ${authConfig}`,
            type: 'text'
        });
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
    `    pm.collectionVariables.set("access_token", token);`,
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
// We will call GET /users/me using the user_token
const getMeReqOriginal = usersFolder.item.find(i => i.request.url.path.includes('me') && i.request.method === 'GET');
const getMeSetupReq = createTestCase(getMeReqOriginal, 'Get Test User ID (Setup)', null, 200, null, '{{user_token}}');
getMeSetupReq.event.find(e => e.listen === 'test').script.exec.push(
    `if (pm.response.code === 200) {`,
    `    pm.collectionVariables.set("user_id", pm.response.json().id);`,
    `}`
);

// Original requests
const getMeReq = usersFolder.item.find(i => i.request.url.path.includes('me') && i.request.method === 'GET');
const patchMeReq = usersFolder.item.find(i => i.request.url.path.includes('me') && i.request.method === 'PATCH');
const getAllUsersReq = usersFolder.item.find(i => !i.request.url.path.includes('me') && !i.request.url.path.some(p => p.includes(':')) && i.request.method === 'GET');
const getUserReq = usersFolder.item.find(i => i.request.url.path.some(p => p.includes('id')) && i.request.method === 'GET');
const patchRoleReq = usersFolder.item.find(i => i.request.url.path.includes('role') && i.request.method === 'PATCH');
const patchPlanReq = usersFolder.item.find(i => i.request.url.path.includes('plan') && i.request.method === 'PATCH');
const blockReq = usersFolder.item.find(i => i.request.url.path.includes('block') && !i.request.url.path.includes('unblock'));
const unblockReq = usersFolder.item.find(i => i.request.url.path.includes('unblock'));
const deleteUserReq = usersFolder.item.find(i => i.request.url.path.some(p => p.includes('id')) && i.request.method === 'DELETE');

const testCases = [];

// SETUP: Insert setup requests at the beginning
testCases.push(setupAdminReq);
testCases.push(setupUserReq);
testCases.push(getMeSetupReq);

// =======================
// GET /users/me
// =======================
testCases.push(createTestCase(getMeReq, 'Thành công (User Token)', null, 200, null, '{{user_token}}'));
testCases.push(createTestCase(getMeReq, 'Không có Token', null, 401, null, 'noauth'));

// =======================
// PATCH /users/me
// =======================
testCases.push(createTestCase(patchMeReq, 'Thành công (Update Name)', { fullName: 'Updated Name' }, 200, null, '{{user_token}}'));
testCases.push(createTestCase(patchMeReq, 'Không có Token', { fullName: 'Hacked' }, 401, null, 'noauth'));

// =======================
// GET /users (Admin List)
// =======================
testCases.push(createTestCase(getAllUsersReq, 'Thành công (Admin)', null, 200, '{{baseUrl}}/users', '{{admin_token}}'));
testCases.push(createTestCase(getAllUsersReq, 'Phân trang & Tìm kiếm', null, 200, '{{baseUrl}}/users?page=1&limit=5&search=admin', '{{admin_token}}'));
testCases.push(createTestCase(getAllUsersReq, 'Forbidden (User)', null, 403, '{{baseUrl}}/users', '{{user_token}}'));

// =======================
// GET /users/:id
// =======================
testCases.push(createTestCase(getUserReq, 'Thành công (Admin)', null, 200, '{{baseUrl}}/users/{{user_id}}', '{{admin_token}}'));
testCases.push(createTestCase(getUserReq, 'Non-existent ID', null, 404, '{{baseUrl}}/users/999999', '{{admin_token}}'));
testCases.push(createTestCase(getUserReq, 'Forbidden (User)', null, 403, '{{baseUrl}}/users/1', '{{user_token}}'));

// =======================
// PATCH /users/:id/role
// =======================
testCases.push(createTestCase(patchRoleReq, 'Thành công (Admin thay đổi)', { role: 'admin' }, 200, '{{baseUrl}}/users/{{user_id}}/role', '{{admin_token}}'));
testCases.push(createTestCase(patchRoleReq, 'Forbidden (User tự đổi role)', { role: 'admin' }, 403, '{{baseUrl}}/users/{{user_id}}/role', '{{user_token}}'));

// =======================
// PATCH /users/:id/plan
// =======================
testCases.push(createTestCase(patchPlanReq, 'Thành công (Admin đổi plan)', { planId: 'titan' }, 200, '{{baseUrl}}/users/{{user_id}}/plan', '{{admin_token}}'));

// =======================
// PATCH /users/:id/block & unblock
// =======================
testCases.push(createTestCase(blockReq, 'Khóa tài khoản', {}, 200, '{{baseUrl}}/users/{{user_id}}/block', '{{admin_token}}'));
testCases.push(createTestCase(unblockReq, 'Mở khóa tài khoản', {}, 200, '{{baseUrl}}/users/{{user_id}}/unblock', '{{admin_token}}'));

// =======================
// DELETE /users/:id
// =======================
testCases.push(createTestCase(deleteUserReq, 'Forbidden (User xóa Admin)', null, 403, '{{baseUrl}}/users/1', '{{user_token}}'));
testCases.push(createTestCase(deleteUserReq, 'Thành công (Admin xóa User)', null, 200, '{{baseUrl}}/users/{{user_id}}', '{{admin_token}}'));
testCases.push(createTestCase(deleteUserReq, 'Non-existent ID', null, 404, '{{baseUrl}}/users/999999', '{{admin_token}}'));


// Replace original items with test cases
coll.item[usersFolderIndex].item = testCases;

// Initialize collection variables so Newman knows they exist
if (!coll.variable) coll.variable = [];

function setOrAddVariable(key, defaultValue) {
    let variable = coll.variable.find(v => v.key === key);
    if (!variable) {
        coll.variable.push({ key, value: defaultValue, type: 'string' });
    } else {
        variable.value = defaultValue;
    }
}

setOrAddVariable("admin_token", "");
setOrAddVariable("user_token", "");
setOrAddVariable("user_id", "");
setOrAddVariable("baseUrl", "http://localhost:3001/api/v1");

// Create a temp collection file
const tempCollFile = 'temp-users-collection.json';
fs.writeFileSync(tempCollFile, JSON.stringify(coll, null, 2));

console.log('Running Newman for Users module...');

newman.run({
    collection: tempCollFile,
    envVar: [
        { key: 'baseUrl', value: 'http://localhost:3001/api/v1' }
    ],
    reporters: ['cli', 'json'],
    reporter: {
        json: {
            export: 'users-report.json'
        }
    }
}, (err, summary) => {
    if (err) {
        console.error('Newman run failed:', err);
        process.exit(1);
    }
    
    let report = '## Giai đoạn 2 - Kết quả test module: Users\n\n';
    let passedCnt = 0;
    let failedCnt = 0;
    
    summary.run.executions.forEach(exec => {
        const reqName = exec.item.name;
        const method = exec.request.method;
        const endpoint = exec.request.url.getPathWithQuery();
        const body = exec.request.body ? exec.request.body.raw : 'N/A';
        const status = exec.response ? exec.response.code : 'ERROR';
        const responseBody = exec.response ? exec.response.stream.toString() : 'N/A';
        
        // Skip setup requests in report if they pass
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
    fs.writeFileSync('users-test-results.md', report);
    console.log('Results written to users-test-results.md');
});