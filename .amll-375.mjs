import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: false });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).slice(0, 110)));
const out = [];
for (const [name, url] of [['库', '/amll/'], ['歌单', '/amll/playlist/2354318994'], ['搜索', '/amll/search'], ['设置', '/amll/settings']]) {
  await page.goto(`http://127.0.0.1:9999${url}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(12000);
  const info = await page.evaluate(() => {
    const vw = window.innerWidth;
    const overflow = [];
    for (const n of document.querySelectorAll('*')) {
      const r = n.getBoundingClientRect();
      if (r.width > 4 && (r.right > vw + 2 || r.left < -2)) {
        const cls = typeof n.className === 'string' ? n.className.slice(0, 30) : '';
        if (cls) overflow.push(`${n.tagName}.${cls} ${Math.round(r.left)}..${Math.round(r.right)}`);
      }
    }
    return {
      bodyScrollW: document.body.scrollWidth,
      vw,
      text: (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 60),
      overflow: [...new Set(overflow)].slice(0, 4),
      playbar: !!document.querySelector('[class*="mediaButton"], [class*="_coverButton_"]'),
    };
  });
  out.push({ page: name, ...info });
}
console.log(JSON.stringify({ out, errs: errs.slice(0, 3) }, null, 1));
await browser.close();
