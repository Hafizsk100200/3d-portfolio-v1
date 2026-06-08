const https = require('https');

const url = 'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif';

const req = https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  res.on('data', () => {}); // consume data
}).on('error', (err) => {
  console.error('Error:', err.message);
});

req.setTimeout(5000, () => {
  console.log('Request timed out after 5 seconds');
  req.destroy();
});
