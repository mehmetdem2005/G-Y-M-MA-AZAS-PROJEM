import { chromium } from 'playwright';

const url = process.env.SCREENSHOT_URL || 'http://localhost:3000';
const output = process.env.SCREENSHOT_PATH || 'artifacts/web-home.png';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: output, fullPage: true });

await browser.close();
console.log(`Saved screenshot to ${output}`);
