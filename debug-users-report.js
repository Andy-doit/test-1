const fs = require('fs');
const report = JSON.parse(fs.readFileSync('users-report.json', 'utf8'));

report.run.executions.forEach(exec => {
    if (exec.item.name.includes('Setup') || exec.item.name.includes('Thành công')) {
        console.log('=== Request:', exec.item.name);
        console.log('URL:', exec.request.url.raw || exec.request.url);
        console.log('Method:', exec.request.method);
        console.log('Headers:', exec.request.header);
        console.log('Auth:', JSON.stringify(exec.request.auth));
        console.log('Response Status:', exec.response ? exec.response.code : 'N/A');
        if (exec.response) {
            try {
                const body = JSON.parse(Buffer.from(exec.response.stream).toString());
                console.log('Response Body:', body);
            } catch (e) {
                console.log('Response Body:', exec.response.stream.toString());
            }
        } else {
            console.log('Response Body: N/A');
        }
        console.log('====================================\n');
    }
});
