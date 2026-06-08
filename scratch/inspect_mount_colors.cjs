const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Hafiz SK\\.gemini\\antigravity-ide\\brain\\0f51a07a-ab3f-4ab3-b83f-ad4a2f17dfdf';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const files = ['mount_1.png', 'mount_2.png'];

  const analyze = async (filename) => {
    const filePath = path.join(artifactDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`${filename} does not exist.`);
      return;
    }
    const data = fs.readFileSync(filePath).toString('base64');
    const colors = await page.evaluate((base64) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const centerData = ctx.getImageData(img.width / 2, img.height / 2, 1, 1).data;
          
          resolve({
            center: `rgb(${centerData[0]}, ${centerData[1]}, ${centerData[2]})`
          });
        };
        img.src = 'data:image/png;base64,' + base64;
      });
    }, data);

    console.log(`[${filename}] Center: ${colors.center}`);
  };

  for (const f of files) {
    await analyze(f);
  }

  await browser.close();
})();
