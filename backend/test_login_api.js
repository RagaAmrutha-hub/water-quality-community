const http = require('http');

const data = JSON.stringify({
  reg_number: 'ADMIN01',
  password: 'admin'
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log('Response Status:', res.statusCode, 'Body:', body));
});

req.on('error', (e) => console.error('Connection Error:', e.message));
req.write(data);
req.end();
