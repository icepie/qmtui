import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1415, height: 784 } });
const posts = [];
page.on('request', (r) => { if (r.method() === 'POST' && r.url().includes('/api/')) posts.push(r.url().replace('http://127.0.0.1:9999', '') + ' ' + (r.postData() || '').slice(0, 46)); });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).slice(0, 110)));
await page.goto('http://127.0.0.1:9999/amll/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(15000);
await page.locator('[class*="coverButton"]').first().click({ force: true }).catch(() => {});
await page.waitForTimeout(8000);
const targets = await page.evaluate(() => {
  const out = [];
  const page_ = document.querySelector('[class*="_lyricPage_"]');
  for (const n of (page_ || document).querySelectorAll('[class*="nowPlayingSlider"]')) {
    const r = n.getBoundingClientRect();
    if (r.width < 40 || r.y < 10 || r.y > 760) continue;
    out.push({ y: Math.round(r.y), x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) });
  }
  return out;
});
const results = [];
for (const t of targets) {
  posts.length = 0;
  const cy = t.y + t.h / 2;
  await page.mouse.move(t.x + t.w * 0.9, cy);
  await page.mouse.down();
  await page.mouse.move(t.x + t.w * 0.3, cy, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(2800);
  results.push({ slider: `y=${t.y} ${t.w}x${t.h}`, fired: [...new Set(posts)] });
}
console.log(JSON.stringify({ targets, results, errs: errs.slice(0, 2) }, null, 1));
await browser.close();
