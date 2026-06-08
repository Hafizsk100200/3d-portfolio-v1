const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5176/');
  
  const types = await page.evaluate(() => {
    return {
      typeofURL: typeof URL,
      typeofWindowURL: typeof window.URL,
      windowURLKeys: Object.keys(window).filter(k => k.toLowerCase().includes('url'))
    };
  });

  console.log("Types inside browser window:", types);
  await browser.close();
})();
