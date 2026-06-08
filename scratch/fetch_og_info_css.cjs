const fs = require('fs');
const https = require('https');

https.get('https://lukebaffait.fr/styles/info.css', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('c:/Users/Hafiz SK/OneDrive/Documents/3D Protfolio/scratch/og_info.css', data);
    console.log('Saved original info css!');
  });
}).on('error', (err) => {
  console.error('Error: ' + err.message);
});
