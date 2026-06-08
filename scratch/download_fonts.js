const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS = [
  { url: 'https://lukebaffait.fr/assets/fonts/Breton.woff2', dest: 'public/v2/fonts/Breton.woff2' },
  { url: 'https://lukebaffait.fr/assets/fonts/Machine.otf', dest: 'public/v2/fonts/Machine.otf' },
  { url: 'https://lukebaffait.fr/assets/fonts/Zirena.woff2', dest: 'public/v2/fonts/Zirena.woff2' }
];

const BASE_DIR = 'C:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const fullDest = path.join(BASE_DIR, dest);
    const destDir = path.dirname(fullDest);
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const file = fs.createWriteStream(fullDest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(fullDest);
        reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(fullDest)) fs.unlinkSync(fullDest);
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading fonts...');
  for (const font of FONTS) {
    try {
      await download(font.url, font.dest);
    } catch (e) {
      console.error(e.message);
    }
  }
  console.log('Font downloads complete!');
}

run();
