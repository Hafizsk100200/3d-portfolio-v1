const fs = require('fs');
const path = require('path');
const https = require('https');

const baseDir = "c:\\Users\\Hafiz SK\\OneDrive\\Documents\\3D Protfolio\\public\\v2\\projects";

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
  const allProjects = [
    { id: 'cyberdiag', dirName: 'CyberDiagWebsite', imgs: ['image1.png', 'image2.png', 'image3.png'] },
    { id: 'cyberdiag-app', dirName: 'cyberdiag', imgs: ['image1.png', 'image2.png', 'image3.png'] },
    { id: 'anima', dirName: 'Anima', imgs: ['image1.png', 'image2.png', 'image3.png'] },
    { id: 'zenith', dirName: 'Zenith', imgs: ['image1.png', 'image2.png', 'image3.png'] },
    { id: 'skymcdb', dirName: 'skymcdb', imgs: ['image.png', 'image2.png', 'image3.png', 'image4.png'] },
    { id: 'chromablock', dirName: 'chromablock', imgs: ['image1.png', 'image2.png', 'image3.png'] },
    { id: 'symphony', dirName: 'symphony', imgs: ['image2.png', 'image.png', 'image3.png'] },
    { id: 'echo', dirName: 'echo', imgs: ['image.png'] }
  ];

  for (const proj of allProjects) {
    console.log(`Downloading images for project ${proj.id}...`);
    const outDir = path.join(baseDir, proj.dirName);
    for (const img of proj.imgs) {
      await download(`assets/images/projects/${proj.dirName}/${img}`, outDir, img);
    }
  }

  console.log("All project images downloaded successfully.");
};

run();
