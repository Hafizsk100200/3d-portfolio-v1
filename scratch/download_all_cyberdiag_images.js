const fs = require('fs');
const path = require('path');
const https = require('https');

const baseDirWebsite = "c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\public\\v2\\projects\\CyberDiagWebsite";
const baseDirApp = "c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\public\\v2\\projects\\cyberdiag";

const download = (urlPath, outDir, fileName) => {
  const url = `https://lukebaffait.fr/${urlPath}`;
  const dest = path.join(outDir, fileName);
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const file = fs.createWriteStream(dest);
  
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  };

  return new Promise((resolve) => {
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        resolve(false);
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${urlPath} -> ${dest}`);
        resolve(true);
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      console.error(`Error downloading ${urlPath}:`, err.message);
      resolve(false);
    });
  });
};

const run = async () => {
  console.log("Probing CyberDiagWebsite images...");
  const websiteImages = ['image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png'];
  for (const img of websiteImages) {
    const success = await download(`assets/images/projects/CyberDiagWebsite/${img}`, baseDirWebsite, img);
    if (!success) {
      console.log(`No more images found for CyberDiagWebsite (failed at ${img})`);
      break;
    }
  }

  console.log("Probing cyberdiag app images...");
  const appImages = ['image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png'];
  for (const img of appImages) {
    const success = await download(`assets/images/projects/cyberdiag/${img}`, baseDirApp, img);
    if (!success) {
      console.log(`No more images found for cyberdiag app (failed at ${img})`);
      break;
    }
  }

  console.log("Download check complete.");
};

run();
