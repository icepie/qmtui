import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { chromium } from '@playwright/test';

const shellQuote = (value) => `'${value.replaceAll("'", "'\\''")}'`;

const port = Number(process.env.QMTUI_E2E_PORT || 19999);
const baseUrl = (process.env.QMTUI_BASE_URL || `http://127.0.0.1:${port}`).replace(/\/$/, '');
const executable = process.env.QMTUI_E2E_EXECUTABLE;
const ownsServer = !process.env.QMTUI_BASE_URL;
let server;
let serverExit;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  let lastError = '';
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/account`);
      if (response.ok) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error.message;
    }
    if (serverExit) {
      const result = await Promise.race([serverExit, sleep(500).then(() => null)]);
      if (result) throw new Error(`Web server exited before readiness: ${JSON.stringify(result)}`);
    } else {
      await sleep(500);
    }
  }
  throw new Error(`Web server did not become ready: ${lastError}`);
}

function startServer() {
  assert(executable, 'QMTUI_E2E_EXECUTABLE is required when QMTUI_BASE_URL is unset');
  const command = `${shellQuote(executable)} --web --web-port ${port} --debug`;
  server = spawn('script', ['-qefc', command, '/dev/null'], {
    cwd: process.cwd(),
    detached: true,
    stdio: 'ignore',
  });
  serverExit = new Promise((resolve) => {
    server.once('exit', (code, signal) => resolve({ code, signal }));
  });
  server.on('error', (error) => {
    throw error;
  });
}
async function stopServer() {
  if (!server || server.exitCode !== null) return;
  process.kill(-server.pid, 'SIGTERM');
  await Promise.race([serverExit, sleep(5000)]);
  if (server.exitCode === null) process.kill(-server.pid, 'SIGKILL');
}

async function expectPost(page, path, action) {
  const request = page.waitForRequest(
    (value) => value.method() === 'POST' && new URL(value.url()).pathname === path,
    { timeout: 10_000 }
  );
  await Promise.all([request, action()]);
}
async function waitForState(page, predicate, description) {
  try {
    const handle = await page.waitForFunction(
      (source) => {
        const states = window.__qmtuiE2eStates || [];
        return [...states].reverse().find((state) => {
          if (source.type && state.type !== source.type) return false;
          if (source.isPlaying !== undefined && state.isPlaying !== source.isPlaying) return false;
          if (source.mode !== undefined && state.mode !== source.mode) return false;
          if (source.isFavorite !== undefined && state.isFavorite !== source.isFavorite)
            return false;
          if (
            source.preferredQualityTier !== undefined &&
            state.preferredQualityTier !== source.preferredQualityTier
          )
            return false;
          if (source.positionAtLeast !== undefined && state.position < source.positionAtLeast)
            return false;
          return true;
        });
      },
      predicate,
      { timeout: 15_000 }
    );
    return handle.jsonValue();
  } catch (error) {
    const states = await page.evaluate(() => window.__qmtuiE2eStates || []);
    throw new Error(`${description}; received states: ${JSON.stringify(states.slice(-8))}`, {
      cause: error,
    });
  }
}

async function postJson(page, path, body) {
  return page.evaluate(
    async ({ requestPath, requestBody }) => {
      const response = await fetch(requestPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
      });
      return { status: response.status, body: await response.json() };
    },
    { requestPath: path, requestBody: body }
  );
}

async function run() {
  if (ownsServer) startServer();
  await waitForServer();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pageErrors = [];
  await page.addInitScript(() => {
    window.__qmtuiE2eStates = [];
    // 状态推送走 WebSocket：外层包一个构造函数来采集状态帧
    //（直接子类化 WebSocket 在部分实现里不可靠）。
    const NativeWebSocket = window.WebSocket;
    // biome-ignore lint/complexity/useArrowFunction: 桥接层用 new WebSocket(...)，箭头函数不能当构造函数
    window.WebSocket = function (...args) {
      const socket = new NativeWebSocket(...args);
      if (String(args[0] || '').includes('/api/ws')) {
        socket.addEventListener('message', (event) => {
          try {
            window.__qmtuiE2eStates.push(JSON.parse(event.data));
          } catch {}
        });
      }
      return socket;
    };
    window.WebSocket.prototype = NativeWebSocket.prototype;
  });
  const failedRequests = [];
  page.on('pageerror', (error) => pageErrors.push(String(error.stack || error)));
  page.on('requestfailed', (request) =>
    failedRequests.push(
      `${request.method()} ${request.url()} (${request.failure()?.errorText || 'unknown error'})`
    )
  );

  let initialState;
  let modeSteps = 0;
  let favoriteChanged = false;
  let favoriteBaseline = null;
  let qualityChanged = false;
  try {
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    await page.locator('#js_search').waitFor({ state: 'visible', timeout: 30_000 });
    initialState = await waitForState(
      page,
      { type: 'sync' },
      'initial CLI state did not reach Web'
    );

    const account = await page.evaluate(async () => (await fetch('/api/account')).json());
    assert.equal(account.loggedIn, true, 'the web session must be logged in');
    assert.notEqual(
      (await page.locator('body').innerText()).trim(),
      '',
      'the page must render visible content'
    );
    await page.waitForFunction(
      () =>
        document.documentElement.dataset.qmtuiBridge === 'connected' &&
        window.__QMTUI_PLAYER__?.audio?.isConnected,
      null,
      { timeout: 15_000 }
    );
    assert.equal(
      await page.evaluate(() => window.__QMTUI_PLAYER__.audio instanceof HTMLAudioElement),
      true,
      'the synchronized logical player must own a connected audio element'
    );

    await page.locator('a.nav_item[href="#/like"]').click();
    await page.waitForURL(/#\/like$/);
    const routeHost = page.locator('#qmtui-route-host');
    await routeHost.locator('.qmtui-page__head h1', { hasText: '我喜欢' }).waitFor({
      state: 'visible',
      timeout: 15_000,
    });
    assert.match(await routeHost.innerText(), /我喜欢/);

    await page.locator('#js_search').fill('周杰伦');
    await page.locator('#js_search').press('Enter');
    await page.waitForURL(/#\/search\/song\?query=/);
    await routeHost.waitFor({ state: 'visible' });
    await page.waitForFunction(
      () => !document.querySelector('#qmtui-route-host')?.innerText.includes('正在搜索')
    );
    assert.notEqual(
      (await routeHost.innerText()).trim(),
      '',
      'search must render a result or empty state'
    );

    const targetPlaying = !initialState.isPlaying;
    const playButton = page
      .locator('.player_btn_list_play:visible, .player_btn_list_pause:visible')
      .first();
    await expectPost(page, '/api/toggle', () => playButton.click());
    await waitForState(
      page,
      { isPlaying: targetPlaying },
      'Web play toggle did not update CLI state'
    );
    await expectPost(page, '/api/toggle', () =>
      page.locator('.player_btn_list_play:visible, .player_btn_list_pause:visible').first().click()
    );
    await waitForState(
      page,
      { isPlaying: initialState.isPlaying },
      'playback state was not restored'
    );

    const modes = ['list_loop', 'single_loop', 'shuffle', 'sequential'];
    const initialModeIndex = modes.indexOf(initialState.mode);
    assert.notEqual(initialModeIndex, -1, `unknown initial playback mode: ${initialState.mode}`);
    const nextMode = modes[(initialModeIndex + 1) % modes.length];
    await page.locator('.player_btn_list_mode:visible').click();
    const nextModeLabel = {
      list_loop: '列表循环',
      single_loop: '单曲模式',
      shuffle: '随机模式',
      sequential: '顺序模式',
    }[nextMode];
    await expectPost(page, '/api/mode', () =>
      page
        .locator('.player_mode_popover_list__item:visible')
        .filter({ hasText: nextModeLabel })
        .click()
    );
    modeSteps = 1;
    await waitForState(
      page,
      { type: 'mode_change', mode: nextMode },
      'Web mode toggle did not update CLI state'
    );
    while (modeSteps < modes.length) {
      await postJson(page, '/api/mode');
      modeSteps += 1;
    }
    await waitForState(
      page,
      { type: 'mode_change', mode: initialState.mode },
      'playback mode was not restored'
    );

    const seekResponse = await postJson(page, '/api/seek', { position: 37.5 });
    assert.equal(seekResponse.status, 200, 'seek request must be accepted');
    assert.equal(seekResponse.body.ok, true, 'seek request must acknowledge success');
    await waitForState(
      page,
      { type: 'progress', positionAtLeast: 37 },
      'CLI seek position did not synchronize back to Web'
    );
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll('.player_time_cur')].some(
          (node) => node.offsetWidth > 0 && node.textContent.startsWith('00:3')
        ),
      null,
      { timeout: 10_000 }
    );

    if (initialState.song) {
      // 点击前先记下“当前这首歌”的收藏态：服务端在 favorite_result 之前还会先广播一帧
      // favorite_change（已是新值），所以不能拿结果帧之前的帧去比较。
      favoriteBaseline = await page.evaluate(() => {
        const latest = [...(window.__qmtuiE2eStates || [])].reverse().find((state) => state.song);
        return { mid: latest?.song?.mid || '', isFavorite: Boolean(latest?.isFavorite) };
      });
      await expectPost(page, '/api/favorite', () =>
        page.locator('.player_cont_state_tool_love:visible').click()
      );
      // 失败路径会先弹 2.6s 的错误提示再收到状态帧，故“翻转”与“错误提示”要在同一个等待里竞速。
      let favoriteOutcome;
      try {
        favoriteOutcome = await page
          .waitForFunction(
            (baseline) => {
              const states = window.__qmtuiE2eStates || [];
              const result = [...states]
                .reverse()
                .find((state) => state.type === 'favorite_result');
              if (
                result &&
                (result.song?.mid || '') === baseline.mid &&
                Boolean(result.isFavorite) !== baseline.isFavorite
              ) {
                return 'flipped';
              }
              if (document.querySelector('.qmtui-toast.error')) return 'toast';
              return false;
            },
            favoriteBaseline,
            { timeout: 20_000 }
          )
          .then((handle) => handle.jsonValue());
      } catch {
        favoriteOutcome = 'timeout';
      }
      favoriteChanged = favoriteOutcome === 'flipped';
      if (favoriteOutcome === 'timeout') {
        const diagnostics = await page.evaluate(() => ({
          frames: (window.__qmtuiE2eStates || []).slice(-5).map((state) => ({
            type: state.type,
            isFavorite: state.isFavorite,
            mid: state.song?.mid || '',
          })),
          toasts: [...document.querySelectorAll('.qmtui-toast')].map((node) => node.textContent),
          loveLoved: Boolean(document.querySelector('.player_cont_state_tool_love.loved')),
        }));
        assert.fail(`喜欢切换既没有翻转状态，也没有给出错误提示: ${JSON.stringify(diagnostics)}`);
      }
      await page.locator('.player_cont_state_tool_comment:visible').click();
      await page.waitForURL(/#\/song_detail\/comment\?id=/);
      await page.locator('#qmtui-comment-text').waitFor({ state: 'visible', timeout: 15_000 });

      await page.locator('.player_quality_badge:visible').click();
      const targetBadge = await page.evaluate(() => {
        const selected = [...document.querySelectorAll('.quality_popover_content > div')].find(
          (element) => element.offsetWidth > 0 && element.style.cursor === 'pointer'
        );
        return selected?.querySelector('span')?.textContent?.trim() || null;
      });
      assert.notEqual(targetBadge, null, 'quality menu must expose an interactive tier');
      const targetTier = {
        'Hi-Res': 0,
        SQ: 1,
        HQ: 2,
        标准: 3,
        母带: 4,
        臻品: 5,
        5.1: 6,
        7.1: 7,
        杜比: 8,
      }[targetBadge];
      await expectPost(page, '/api/quality', () =>
        page.evaluate((label) => {
          const option = [...document.querySelectorAll('.quality_popover_content > div')].find(
            (element) =>
              element.offsetWidth > 0 &&
              element.querySelector('span')?.textContent?.trim() === label
          );
          const target = option?.querySelector('span');
          if (!target) throw new Error(`Visible quality option not found: ${label}`);
          target.click();
        }, targetBadge)
      );
      qualityChanged = targetTier !== initialState.preferredQualityTier;
      await waitForState(
        page,
        { preferredQualityTier: targetTier },
        'quality selection did not synchronize'
      );
    }

    const layout = await page.evaluate(() => ({
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      route: location.hash,
      title:
        [...document.querySelectorAll('.player_cont_state_inline_name')]
          .find((node) => node.offsetWidth > 0)
          ?.innerText?.trim() || '',
    }));
    assert.equal(
      layout.horizontalOverflow,
      false,
      'the desktop page must not horizontally overflow'
    );
    assert.notEqual(layout.title, '', 'the current track title must be rendered');
    assert.deepEqual(
      { pageErrors, failedRequests },
      { pageErrors: [], failedRequests: [] },
      `browser failures:\n${[...pageErrors, ...failedRequests].join('\n')}`
    );

    console.log(
      `E2E passed: ${layout.route}; account, navigation, search, controls, WebSocket progress, comments, favorite, quality`
    );
  } finally {
    try {
      if (initialState && !page.isClosed()) {
        while (modeSteps % 4 !== 0) {
          await postJson(page, '/api/mode');
          modeSteps += 1;
        }
        if (modeSteps > 0) {
          await waitForState(
            page,
            { type: 'mode_change', mode: initialState.mode },
            'playback mode cleanup failed'
          );
        }
        if (favoriteChanged) {
          await postJson(page, '/api/favorite');
          await waitForState(
            page,
            { type: 'favorite_result', isFavorite: favoriteBaseline?.isFavorite },
            'favorite state cleanup failed'
          );
        }
        if (qualityChanged) {
          await postJson(page, '/api/quality', { tier: initialState.preferredQualityTier });
          await waitForState(
            page,
            { preferredQualityTier: initialState.preferredQualityTier },
            'quality state cleanup failed'
          );
        }
        await postJson(page, `/api/seek?pos=${Number(initialState.position || 0).toFixed(2)}`);
      }
    } finally {
      await browser.close();
      await stopServer();
    }
  }
}

run().catch(async (error) => {
  console.error(`E2E failed: ${error.stack || error}`);
  await stopServer();
  process.exitCode = 1;
});
