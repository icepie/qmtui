import { chromium } from '@playwright/test';
const label = process.argv[2] || 'run';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
let playlistRequests = 0;
page.on('request', (r) => { if (r.url().includes('/api/library/playlist')) playlistRequests++; });
const start = Date.now();
await page.goto('http://127.0.0.1:9999/amll/', { waitUntil: 'domcontentloaded' });
let elapsed = null;
for (let i = 0; i < 120; i++) {
  const ok = await page.evaluate(() => /我喜欢/.test(document.body.textContent || ''));
  if (ok) { elapsed = Date.now() - start; break; }
  await page.waitForTimeout(500);
}
console.log(JSON.stringify({ label, gridVisibleMs: elapsed, playlistRequests }, null, 1));
await browser.close();
