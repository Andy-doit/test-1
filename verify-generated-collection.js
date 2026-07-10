const fs = require('fs');
const data = JSON.parse(fs.readFileSync('hotstock-postman-collection-generated.json', 'utf8'));

console.log('Variables:', data.variable);
console.log('Folders (first level):', data.item.map(i => i.name));

function findRequest(items, name) {
  for (const item of items) {
    if (item.item) {
      const found = findRequest(item.item, name);
      if (found) return found;
    } else if (item.request && item.name.toLowerCase().includes(name.toLowerCase())) {
      return item;
    }
  }
}

const loginReq = findRequest(data.item, 'login');
if (loginReq) {
  console.log('Login Request:', JSON.stringify(loginReq, null, 2).slice(0, 1000));
}