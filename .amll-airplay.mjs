import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://127.0.0.1:9999/amll/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(16000);
const info = await page.evaluate(() => {
  const media = [...document.querySelectorAll('audio, video')];
  return {
    mediaElements: media.length,
    mediaSrcs: media.map((m) => m.currentSrc || m.src || '(no src)').slice(0, 3),
    remotePlaybackSupported: 'remote' in HTMLMediaElement.prototype,
    webkitAirplay: typeof HTMLMediaElement.prototype.webkitShowPlaybackTargetPicker === 'function',
    mediaSessionSupported: 'mediaSession' in navigator,
  };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
