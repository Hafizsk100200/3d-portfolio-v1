const https = require('https');

const url = 'https://hafiz-sk-portfolio-v2.vercel.app/v2/js/core-renderer.js';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
    if (data.length > 500) {
      console.log('\n--- Content Snippet (first 500 chars) ---');
      console.log(data.substring(0, 500));
      res.destroy(); // stop reading
    }
  });

  res.on('end', () => {
    if (data.length <= 500) {
      console.log('\n--- Content Snippet (full) ---');
      console.log(data);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
