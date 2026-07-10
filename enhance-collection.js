const fs = require('fs');

const data = JSON.parse(fs.readFileSync('hotstock-postman-collection-generated.json', 'utf8'));

// 1. Set variables
data.variable = [
  { key: 'baseUrl', value: 'http://localhost:3001/api/v1', type: 'string' },
  { key: 'access_token', value: '', type: 'string' }
];

// 2. Set Collection level Auth
data.auth = {
  type: 'bearer',
  bearer: [
    { key: 'token', value: '{{access_token}}', type: 'string' }
  ]
};

const setTokenScript = [
  "if (pm.response.code === 200 || pm.response.code === 201) {",
  "    var jsonData = pm.response.json();",
  "    if (jsonData.access_token) {",
  "        pm.collectionVariables.set(\"access_token\", jsonData.access_token);",
  "        console.log(\"Saved access_token to collection variables\");",
  "    }",
  "}"
];

const defaultTestScript = [
  "pm.test(\"Status code is successful\", function () {",
  "    pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);",
  "});"
];

function traverse(items) {
  for (const item of items) {
    if (item.item) {
      traverse(item.item);
    } else if (item.request) {
      // Set test events
      if (!item.event) item.event = [];
      let testEvent = item.event.find(e => e.listen === 'test');
      if (!testEvent) {
        testEvent = { listen: 'test', script: { type: 'text/javascript', exec: [] } };
        item.event.push(testEvent);
      }
      
      const isLoginOrRefresh = item.name.toLowerCase().includes('login') || 
                               item.name.toLowerCase().includes('refresh') || 
                               item.name.includes('Đăng nhập') || 
                               item.name.includes('Làm mới token');
      
      if (isLoginOrRefresh) {
        testEvent.script.exec = [...defaultTestScript, ...setTokenScript];
      } else {
        testEvent.script.exec = defaultTestScript;
      }

      // Check request Auth (remove local auth to inherit from parent, except login maybe?)
      // Actually, just inheriting is fine, but openapi-to-postmanv2 might have set auth to specific requests.
      // Let's delete it so it inherits from parent, or set it to null.
      delete item.request.auth;
    }
  }
}

if (data.item) {
  traverse(data.item);
}

fs.writeFileSync('hotstock-postman-collection-generated.json', JSON.stringify(data, null, 2));
console.log('Successfully enhanced hotstock-postman-collection-generated.json');