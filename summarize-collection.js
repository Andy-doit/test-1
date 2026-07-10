const fs = require('fs');
if (!fs.existsSync('hotstock-postman-collection.json')) {
  console.log('Old collection hotstock-postman-collection.json not found in root.');
  process.exit(0);
}
const collection = JSON.parse(fs.readFileSync('hotstock-postman-collection.json', 'utf8'));

function listRequests(items, parentName = '') {
  for (const item of items) {
    if (item.item) {
      listRequests(item.item, parentName ? `${parentName} > ${item.name}` : item.name);
    } else if (item.request) {
      const method = item.request.method || 'GET';
      let url = '';
      if (item.request.url) {
        if (typeof item.request.url === 'string') {
          url = item.request.url;
        } else if (item.request.url.raw) {
          url = item.request.url.raw;
        }
      }
      console.log(`[OLD COLL] ${method} ${url} - Name: ${parentName ? parentName + ' / ' : ''}${item.name}`);
    }
  }
}

console.log('Collection Name:', collection.info?.name);
if (collection.item) {
  listRequests(collection.item);
}