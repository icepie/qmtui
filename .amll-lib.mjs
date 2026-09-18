import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
const errs = [];
const reqs = [];
page.on('pageerror', (e) => errs.push('pageerror: ' + String(e).slice(0, 110)));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 110)); });
page.on('request', (r) => { if (r.url().includes('/api/library/')) reqs.push(r.url().replace('http://127.0.0.1:9999', '').slice(0, 52)); });
await page.goto('http://127.0.0.1:9999/amll/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(18000);
const view = await page.evaluate(() => {
  const text = (document.body.innerText || '').replace(/\s+/g, ' ');
  return {
    sample: text.slice(0, 220),
    hasRock: /滚石经典/.test(text),
    hasCommute: /通勤随身听/.test(text),
    playlistItems: [...document.querySelectorAll('[class*="playlist"], a')].map((n) => (n.textContent || '').trim().slice(0, 16)).filter((t) => t && t.length > 3).slice(0, 10),
  };
});
console.log(JSON.stringify({ view, apiCalls: [...new Set(reqs)].slice(0, 6), apiCallCount: reqs.length, errs: errs.slice(0, 4) }, null, 1));
await browser.close();
