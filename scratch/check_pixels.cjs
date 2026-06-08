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
  
  // Set up blank page with canvas
  await page.setContent(`
    <html>
      <body>
        <canvas id="canvas"></canvas>
      </body>
    </html>
  `);

  async function analyzeImage(filename) {
    const filePath = path.join(artifactDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`${filename} does not exist.`);
      return;
    }

    console.log(`Analyzing ${filename}...`);
    
    // Read file as base64
    const data = fs.readFileSync(filePath).toString('base64');
    const dataUrl = `data:image/png;base64,${data}`;

    const stats = await page.evaluate(async (url) => {
      const img = new Image();
      img.src = url;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.getElementById('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      let totalPixels = canvas.width * canvas.height;
      let blackCount = 0;
      let darkRedCount = 0; // count colors close to #0a0a0a
      let nonBlackCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // Check if black or very dark grey (#0a0a0a is r:10, g:10, b:10)
        if (r <= 10 && g <= 10 && b <= 10) {
          blackCount++;
        } else {
          nonBlackCount++;
        }
      }

      return {
        width: img.width,
        height: img.height,
        totalPixels,
        blackCount,
        nonBlackCount,
        percentBlack: (blackCount / totalPixels) * 100
      };
    }, dataUrl);

    console.log(`Results for ${filename}:`, stats);
  }

  try {
    await analyzeImage('v2_hero_initial.png');
    await analyzeImage('v2_hero_after_scroll.png');
  } catch (err) {
    console.error("Analysis failed:", err.message);
  } finally {
    await browser.close();
  }
})();
