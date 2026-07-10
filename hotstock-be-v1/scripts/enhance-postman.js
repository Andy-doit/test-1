const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, '../postman-collection.json');
const outputPath = path.join(__dirname, '../../hotstock-postman-collection.json');

const data = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

// 1. Add/Update Collection Variables
if (!data.variable) {
  data.variable = [];
}

const baseUrlVar = data.variable.find(v => v.key === 'baseUrl');
if (baseUrlVar) {
  baseUrlVar.value = 'http://localhost:3000/api/v1';
} else {
  data.variable.push({ key: 'baseUrl', value: 'http://localhost:3000/api/v1', type: 'string' });
}

const tokenVar = data.variable.find(v => v.key === 'bearerToken');
if (!tokenVar) {
  data.variable.push({ key: 'bearerToken', value: '', type: 'string' });
}

// 2. Add test scripts to "login" and "refresh" requests
const setTokenScript = [
  "if (pm.response.code === 200 || pm.response.code === 201) {",
  "    var jsonData = pm.response.json();",
  "    if (jsonData.access_token) {",
  "        pm.collectionVariables.set(\"bearerToken\", jsonData.access_token);",
  "        console.log(\"Saved access_token to collection variables\");",
  "    }",
  "}"
];

function traverse(items) {
  for (const item of items) {
    if (item.item) {
      traverse(item.item);
    } else if (item.request) {
      if (item.name === 'Đăng nhập' || item.name === 'Làm mới token') {
        if (!item.event) item.event = [];
        let testEvent = item.event.find(e => e.listen === 'test');
        if (!testEvent) {
          testEvent = { listen: 'test', script: { type: 'text/javascript', exec: [] } };
          item.event.push(testEvent);
        }
        testEvent.script.exec = setTokenScript;
      }
    }
  }
}

if (data.item) {
  traverse(data.item);
}

// 3. Write enhanced collection to root
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log('Successfully enhanced and saved Postman collection to:', outputPath);