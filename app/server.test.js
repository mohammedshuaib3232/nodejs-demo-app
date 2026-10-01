const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const server = require('./server');

after(() => server.close());

test('home page returns the demo app', async () => {
  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Node CI\/CD Demo/);
});

test('health endpoint returns JSON status', async () => {
  const address = server.address();
  const result = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${address.port}/health`, (response) => {
      let data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, body: data }));
    }).on('error', reject);
  });
  assert.equal(result.status, 200);
  assert.deepEqual(JSON.parse(result.body), { status: 'ok' });
});
