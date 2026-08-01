import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
];

let executablePath = '';
for (const p of chromePaths) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

if (!executablePath) {
  console.error("Chrome was not found in standard paths. Please specify the path.");
  process.exit(1);
}

(async () => {
  console.log("Launching headful Chrome using:", executablePath);
  try {
    const browser = await puppeteer.launch({
      executablePath: executablePath,
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });

    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    
    console.log("Navigating to http://localhost:3000/dashboard");
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });

    console.log("Waiting 2 seconds to show credentials pre-filled...");
    await new Promise(r => setTimeout(r, 2000));

    console.log("Clicking the login button...");
    await page.click('button[type="submit"]');
    
    console.log("Logged in! The browser window will stay open so you can inspect the dashboard.");
  } catch (err) {
    console.error("Error during automation:", err);
  }
})();
