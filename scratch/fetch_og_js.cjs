const fs = require('fs');
const https = require('https');

https.get('https://lukebaffait.fr/js/index.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('c:/Users/Hafiz SK/OneDrive/Documents/3D Protfolio/scratch/og_index.js', data);
    console.log('Saved original index.js!');
  });
}).on('error', (err) => {
  console.error('Error: ' + err.message);
});
