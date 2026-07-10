const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('hotstock-be-v1/swagger-spec.json', 'utf8'));
console.log('Total paths:', Object.keys(swagger.paths).length);
for (const [path, methods] of Object.entries(swagger.paths)) {
  for (const [method, detail] of Object.entries(methods)) {
    console.log(`${method.toUpperCase()} ${path} - Tag: ${detail.tags ? detail.tags.join(',') : 'None'} - Summary: ${detail.summary}`);
  }
}