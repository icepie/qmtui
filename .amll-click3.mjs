import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1415, height: 784 } });
const posts = [];
page.on('request', (r) => { if (r.method() === 'POST' && r.url().includes('/api/')) posts.push(r.url().replace('http://127.0.0.1:9999', '')); });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).slice(0, 110)));
await page.goto('http://127.0.0.1:9999/amll/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(15000);
await page.locator('[class*="coverButton"]').first().click({ force: true }).catch(() => {});
await page.waitForTimeout(8000);
const results = [];
for (let i = 0; i < 3; i++) {
  const probe = await page.evaluate(() => {
    const lines = [...document.querySelectorAll('[class*="lyricLine"]')];
    const t = lines.find((l) => { const r = l.getBoundingClientRect(); const x = (l.textContent || '').trim(); return r.y > 110 && r.y < 650 && x.length > 1 && x.length < 24; });
    if (!t) return null;
    const r = t.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), text: (t.textContent || '').trim().slice(0, 16) };
  });
  if (!probe) break;
  posts.length = 0;
  await page.mouse.click(probe.x, probe.y);
  await page.waitForTimeout(3000);
  results.push({ ...probe, fired: [...new Set(posts)] });
}
console.log(JSON.stringify({ results, errs: errs.slice(0, 2) }, null, 1));
await browser.close();
