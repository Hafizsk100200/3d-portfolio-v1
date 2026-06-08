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

  // Read screenshots
  const file1 = path.join(artifactDir, 'v2_hero_initial.png');
  const file2 = path.join(artifactDir, 'v2_hero_after_scroll.png');

  if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
    console.error("One of the screenshot files does not exist!");
    await browser.close();
    return;
  }

  // Load them in page as data URL
  const img1Data = fs.readFileSync(file1).toString('base64');
  const img2Data = fs.readFileSync(file2).toString('base64');

  const analyzeImage = async (base64Data, name) => {
    const result = await page.evaluate((base64) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          // Sample center pixel and some random points
          const points = [
            { x: Math.floor(img.width / 2), y: Math.floor(img.height / 2), label: 'Center' },
            { x: Math.floor(img.width * 0.25), y: Math.floor(img.height * 0.25), label: 'Top-Left' },
            { x: Math.floor(img.width * 0.75), y: Math.floor(img.height * 0.25), label: 'Top-Right' },
            { x: Math.floor(img.width * 0.25), y: Math.floor(img.height * 0.75), label: 'Bottom-Left' },
            { x: Math.floor(img.width * 0.75), y: Math.floor(img.height * 0.75), label: 'Bottom-Right' },
          ];

          const colors = points.map(pt => {
            const data = ctx.getImageData(pt.x, pt.y, 1, 1).data;
            return {
              label: pt.label,
              x: pt.x,
              y: pt.y,
              color: `rgb(${data[0]}, ${data[1]}, ${data[2]})`
            };
          });

          resolve(colors);
        };
        img.src = 'data:image/png;base64,' + base64;
      });
    }, base64Data);

    console.log(`\n=== Analysis of ${name} ===`);
    result.forEach(r => {
      console.log(`${r.label} (${r.x}, ${r.y}): ${r.color}`);
    });
  };

  await analyzeImage(img1Data, 'v2_hero_initial.png');
  await analyzeImage(img2Data, 'v2_hero_after_scroll.png');

  await browser.close();
})();
