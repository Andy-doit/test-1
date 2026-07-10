const fs = require('fs');

function getPaths(collectionPath) {
  const data = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
  const paths = [];

  function traverse(items) {
    for (const item of items) {
      if (item.item) {
        traverse(item.item);
      } else if (item.request) {
        const method = item.request.method;
        let pathStr = '';
        if (item.request.url) {
          if (Array.isArray(item.request.url.path)) {
            pathStr = '/' + item.request.url.path.join('/');
          } else if (typeof item.request.url === 'string') {
            pathStr = item.request.url;
          } else if (item.request.url.raw) {
            pathStr = item.request.url.raw;
          }
        }
        // Normalize paths (replace variables, prefixes, etc.)
        // e.g. {{baseUrl}}/auth/login -> /auth/login
        pathStr = pathStr.replace(/\{\{baseUrl\}\}/g, '');
        pathStr = pathStr.replace(/\/api\/v1/g, '');
        pathStr = pathStr.split('?')[0]; // remove query
        paths.push(`${method} ${pathStr}`);
      }
    }
  }

  if (data.item) {
    traverse(data.item);
  }
  return [...new Set(paths)].sort();
}

const oldPaths = getPaths('hotstock-postman-collection.json');
const newPaths = getPaths('hotstock-postman-collection-generated.json');

console.log('--- OLD PATHS ---');
console.log(oldPaths.join('\n'));
console.log('\n--- NEW PATHS ---');
console.log(newPaths.join('\n'));

console.log('\n--- ADDED IN NEW (MISSING IN OLD) ---');
const added = newPaths.filter(p => !oldPaths.includes(p));
console.log(added.join('\n'));

console.log('\n--- REMOVED IN NEW (EXISTS ONLY IN OLD) ---');
const removed = oldPaths.filter(p => !newPaths.includes(p));
console.log(removed.join('\n'));