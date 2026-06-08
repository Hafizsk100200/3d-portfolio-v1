const fs = require('fs');
const https = require('https');

https.get('https://lukebaffait.fr/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('c:/Users/Hafiz SK/OneDrive/Documents/3D Protfolio/scratch/og_home.html', data);
    console.log('Saved original home html!');
  });
}).on('error', (err) => {
  console.error('Error: ' + err.message);
});
