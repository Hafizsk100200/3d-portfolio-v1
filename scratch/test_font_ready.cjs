const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log("Navigating to http://localhost:5176/ ...");
  try {
    await page.goto('http://localhost:5176/', { waitUntil: 'networkidle2' });
    
    const fontStatus = await page.evaluate(async () => {
      // Wait for fonts to load
      await document.fonts.ready;
      
      const list = [];
      document.fonts.forEach(f => {
        list.push({
          family: f.family,
          status: f.status,
          weight: f.weight,
          style: f.style
        });
      });
      return list;
    });

    console.log("=== BROWSER FONTS STATUS ===");
    console.log(fontStatus);

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
