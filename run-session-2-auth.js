const fs = require('fs');
const newman = require('newman');

// 1. Load the generated collection
const collectionFile = 'hotstock-postman-collection-generated.json';
const coll = JSON.parse(fs.readFileSync(collectionFile, 'utf8'));

// 2. Find Auth folder
const authFolderIndex = coll.item.findIndex(i => i.name === 'Auth');
const authFolder = coll.item[authFolderIndex];

// Helper to create a test case based on an original request
function createTestCase(original, name, bodyParams, expectedStatus, headers = {}) {
    // Deep clone
    const tc = JSON.parse(JSON.stringify(original));
    tc.name = `${original.name} - ${name}`;
    
    // Update body
    if (tc.request.body && tc.request.body.mode === 'raw') {
        tc.request.body.raw = JSON.stringify(bodyParams, null, 2);
    }
    
    // Update headers
    for (const [k, v] of Object.entries(headers)) {
        if (v === null) {
            tc.request.header = tc.request.header.filter(h => h.key !== k);
            if (k === 'Authorization') tc.request.auth = { type: "noauth" };
        } else {
            const h = tc.request.header.find(h => h.key === k);
            if (h) h.value = v;
            else tc.request.header.push({ key: k, value: v, type: "text" });
        }
    }
    
    // Ensure test script checks for specific status
    const ev = tc.event.find(e => e.listen === 'test');
    if (ev) {
        ev.script.exec = [
            `pm.test("Status code is ${expectedStatus}", function () {`,
            `    pm.response.to.have.status(${expectedStatus});`,
            `});`,
            `// Custom logic to capture tokens if this is login`,
            ...(expectedStatus === 200 || expectedStatus === 201 ? [
                `if (pm.response.code === 200 || pm.response.code === 201) {`,
                `    const res = pm.response.json();`,
                `    if (res.access_token) pm.collectionVariables.set("access_token", res.access_token);`,
                `    if (res.refresh_token) pm.collectionVariables.set("refresh_token", res.refresh_token);`,
                `}`
            ] : [])
        ];
    }
    return tc;
}

// 3. Build Auth Test Cases
const loginReq = authFolder.item.find(i => i.request.url.path.includes('login'));
const registerReq = authFolder.item.find(i => i.request.url.path.includes('register'));
const refreshReq = authFolder.item.find(i => i.request.url.path.includes('refresh'));
const logoutReq = authFolder.item.find(i => i.request.url.path.includes('logout'));
const changePwReq = authFolder.item.find(i => i.request.url.path.includes('change-password'));
const forgotPwReq = authFolder.item.find(i => i.request.url.path.includes('forgot-password'));
const verifyOtpReq = authFolder.item.find(i => i.request.url.path.includes('verify-otp'));
const resetPwReq = authFolder.item.find(i => i.request.url.path.includes('reset-password'));

const testCases = [];
const ts = Date.now();
const testUser = `tester${ts}`;

// LOGIN
testCases.push(createTestCase(loginReq, 'Thành công (Admin)', { email: 'admin@app.com', password: 'change-me-immediately' }, 200));
testCases.push(createTestCase(loginReq, 'Sai mật khẩu', { email: 'admin@app.com', password: 'wrong' }, 401));
testCases.push(createTestCase(loginReq, 'Email không tồn tại', { email: 'nobody@app.com', password: 'abc' }, 401));
testCases.push(createTestCase(loginReq, 'Thiếu field bắt buộc (password)', { email: 'admin@app.com' }, 400));

// REGISTER
testCases.push(createTestCase(registerReq, 'Thành công', { email: `${testUser}@test.com`, password: 'Test@12345', confirmPassword: 'Test@12345', username: testUser, fullName: 'Test User' }, 201));
testCases.push(createTestCase(registerReq, 'Trùng email', { email: `${testUser}@test.com`, password: 'Test@12345', confirmPassword: 'Test@12345', username: testUser+'_dup', fullName: 'Test User' }, 409));
testCases.push(createTestCase(registerReq, 'Mật khẩu yếu', { email: `weak@test.com`, password: '123', confirmPassword: '123', username: testUser+'_wk', fullName: 'Test' }, 400));

// GET CURRENT USER PROFILE (Just to verify token works, but we are testing Auth mostly. Let's just test the Auth endpoints)

// REFRESH
testCases.push(createTestCase(refreshReq, 'Lỗi thiếu token refresh', {}, 400, { Authorization: null })); 
testCases.push(createTestCase(refreshReq, 'Refresh hợp lệ (dùng token đăng ký)', { refresh_token: '{{refresh_token}}' }, 200)); 

// CHANGE PASSWORD
testCases.push(createTestCase(changePwReq, 'Thành công', { oldPassword: 'Test@12345', newPassword: 'New@12345' }, 200));
testCases.push(createTestCase(changePwReq, 'Sai mật khẩu cũ', { oldPassword: 'WrongOld', newPassword: 'New@12345' }, 401)); 
testCases.push(createTestCase(changePwReq, 'Không có Access Token', { oldPassword: 'Test@12345', newPassword: 'New@12345' }, 401, { Authorization: null }));

// FORGOT PASSWORD
testCases.push(createTestCase(forgotPwReq, 'Email hợp lệ', { email: 'admin@app.com' }, 200));
testCases.push(createTestCase(forgotPwReq, 'Email không tồn tại', { email: 'nobody@test.com' }, 200)); 
testCases.push(createTestCase(forgotPwReq, 'Sai định dạng email', { email: 'invalid' }, 400));

// VERIFY OTP
testCases.push(createTestCase(verifyOtpReq, 'Sai OTP', { email: 'admin@app.com', otp: '000000' }, 400)); 

// RESET PASSWORD
testCases.push(createTestCase(resetPwReq, 'Sai reset token', { resetToken: 'invalid', newPassword: 'New@12345' }, 401));

// LOGOUT
testCases.push(createTestCase(logoutReq, 'Đăng xuất thành công', { refresh_token: '{{refresh_token}}' }, 200));
testCases.push(createTestCase(logoutReq, 'Không có token', {}, 401, { Authorization: null }));


// Replace original items with test cases
coll.item[authFolderIndex].item = testCases;

// Create a temp collection file
const tempCollFile = 'temp-auth-collection.json';
fs.writeFileSync(tempCollFile, JSON.stringify(coll, null, 2));

console.log('Running Newman for Auth module with expanded test cases...');

newman.run({
    collection: tempCollFile,
    envVar: [{ key: 'baseUrl', value: 'http://localhost:3001/api/v1' }],
    reporters: ['cli', 'json'],
    reporter: {
        json: {
            export: 'auth-report.json'
        }
    }
}, (err, summary) => {
    if (err) {
        console.error('Newman run failed:', err);
        process.exit(1);
    }
    console.log('Newman run complete. Analyzing results...');
    
    let report = '## Giai đoạn 2 - Kết quả test module: Auth\n\n';
    let passedCnt = 0;
    let failedCnt = 0;
    
    summary.run.executions.forEach(exec => {
        const reqName = exec.item.name;
        const method = exec.request.method;
        const endpoint = exec.request.url.getPath();
        const body = exec.request.body ? exec.request.body.raw : 'N/A';
        const status = exec.response ? exec.response.code : 'ERROR';
        const responseBody = exec.response ? exec.response.stream.toString() : 'N/A';
        
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
    fs.writeFileSync('auth-test-results.md', report);
    console.log('Results written to auth-test-results.md');
});