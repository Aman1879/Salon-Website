const http = require('http');

const data = JSON.stringify({
  name: 'Demo Tester',
  email: 'demo@example.com',
  phone: '9999999999',
  service: 'Signature Facial',
  preferredDate: '2026-01-15',
  preferredTime: '11:30',
  message: 'This is a demo booking',
  numberOfPeople: 1
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/inquiries',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (err) => {
  console.error('Request error:', err);
});

req.write(data);
req.end();
