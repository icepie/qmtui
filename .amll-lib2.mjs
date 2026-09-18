import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).slice(0, 100)));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 100)); });
await page.goto('http://127.0.0.1:9999/amll/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(20000);
const view = await page.evaluate(() => {
  const text = (document.body.innerText || '').replace(/\s+/g, ' ');
  return {
    hasNamedPlaylists: /滚石经典/.test(text) || /通勤随身听/.test(text) || /我喜欢/.test(text),
    sample: text.slice(0, 240),
  };
});
console.log(JSON.stringify({ view, errs: errs.slice(0, 4) }, null, 1));
await browser.close();
