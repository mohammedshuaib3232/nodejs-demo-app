const http = require('node:http');

const port = Number(process.env.PORT || 3000);
const server = http.createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  response.end(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Node CI/CD Demo</title></head>
<body style="font: 1.1rem system-ui; max-width: 42rem; margin: 4rem auto; padding: 0 1rem; color: #172033">
<h1>It works! 🚀</h1><p>This small Node.js app is built and tested automatically with GitHub Actions.</p>
<p>Check <code>/health</code> to see the app's health status.</p></body></html>`);
});

server.listen(port, () => console.log(`Demo app listening on port ${port}`));
module.exports = server;
