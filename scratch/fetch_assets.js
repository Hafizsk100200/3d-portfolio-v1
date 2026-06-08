const fs = require('fs');
const https = require('https');

const fetchFile = (path, outName) => {
  const url = `https://lukebaffait.fr/${path}`;
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  };

  https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      fs.writeFileSync(outName, data);
      console.log(`Success! Written ${path} to ${outName}`);
    });
  }).on('error', (err) => {
    console.error(`Error fetching ${path}:`, err);
  });
};

fetchFile('styles/index.css', 'index.css');
fetchFile('js/index.js', 'index.js');
