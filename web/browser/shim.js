// Electron/Node browser shim.
//
// The deobfuscated QQ Music bundle is an Electron renderer build: it expects
// `require`, `process`, `Buffer`, `electron`, and Node's `path`/`fs`/`os`
// modules to exist as globals. This classic (non-module) script installs those
// globals before the vendor chunks are evaluated, so the bundle runs in a plain
// browser without a bundler or an Electron host.
//
// Load as a classic script before the vendor chunks. Publish Node-compatible
// names explicitly on window so CommonJS factories can resolve them globally.

try {
  localStorage.removeItem('__qqmusic_playback_state__');
} catch (_) {}

window.__bootErrors = [];
window.__bootRejections = [];
window.addEventListener('unhandledrejection', (e) =>
  window.__bootRejections.push(String(e.reason?.stack || e.reason))
);
window.addEventListener('error', (e) =>
  window.__bootErrors.push(String(e.error?.stack || e.message))
);

class BrowserEventEmitter {
  constructor() {
    this._events = {};
  }
  on(n, f) {
    this._events ??= {};
    this._events[n] ??= [];
    this._events[n].push(f);
    return this;
  }
  once(n, f) {
    const w = (...a) => {
      this.off(n, w);
      f(...a);
    };
    return this.on(n, w);
  }
  off(n, f) {
    this._events ??= {};
    const events = this._events;
    events[n] = (events[n] || []).filter((x) => x !== f);
    return this;
  }
  removeListener(n, f) {
    return this.off(n, f);
  }
  removeAllListeners(n) {
    this._events ??= {};
    const events = this._events;
    if (n) delete events[n];
    else this._events = {};
    return this;
  }
  listeners(n) {
    return [...(this._events?.[n] || [])];
  }
  emit(n, ...a) {
    for (const f of this._events?.[n] || []) f(...a);
    return true;
  }
}

const noop = () => {};

const ipc = new BrowserEventEmitter();
ipc.send = noop;
ipc.sendSync = noop;
ipc.invoke = async () => undefined;

const win = {
  on: noop,
  once: noop,
  show: noop,
  hide: noop,
  close: noop,
  minimize: noop,
  maximize: noop,
  unmaximize: noop,
  isMaximized: () => false,
  setAlwaysOnTop: noop,
  setResizable: noop,
  setMinimumSize: noop,
  setSize: noop,
  getSize: () => [1365, 768],
  webContents: { send: noop, on: noop },
};

const electron = {
  ipcRenderer: ipc,
  app: { getVersion: () => '', getPath: () => '' },
  remote: {
    getCurrentWindow: () => win,
    getGlobal: (name) => (name === 'mainWinId' ? 1 : undefined),
    BrowserWindow: { fromId: () => win },
    app: { getVersion: () => '', getPath: () => '' },
    dialog: { showOpenDialog: async () => ({ canceled: true, filePaths: [] }) },
  },
  shell: { openExternal: async () => {} },
  clipboard: { writeText: noop, readText: () => '' },
  nativeImage: { createFromPath: () => ({}) },
};

const pathShim = {
  join: (...a) => a.filter(Boolean).join('/').replace(/\/+/g, '/'),
  resolve: (...a) => a.filter(Boolean).join('/'),
  dirname: (p) => String(p).replace(/\/[^/]*$/, ''),
  basename: (p) => String(p).split('/').pop(),
  extname: (p) => {
    const b = String(p).split('/').pop();
    const i = b.lastIndexOf('.');
    return i > 0 ? b.slice(i) : '';
  },
  sep: '/',
};

BrowserEventEmitter.prototype.setMaxListeners = function () {
  return this;
};

const assertShim = Object.assign(
  (v, m) => {
    if (!v) throw Error(m || 'Assertion failed');
  },
  {
    equal: (a, b, m) => {
      // biome-ignore lint/suspicious/noDoubleEquals: Node assert.equal intentionally coerces types; strictEqual does not.
      if (a != b) throw Error(m || 'Assertion failed');
    },
    strictEqual: (a, b, m) => {
      if (a !== b) throw Error(m || 'Assertion failed');
    },
  }
);

const fsShim = {
  statSync: () => ({}),
  stat: (p, cb) => cb(null, {}),
  readFileSync: () => {
    const v = localStorage.getItem('__qq_settings__');
    return v || '{}';
  },
  readFile: (p, e, cb) => cb(null, localStorage.getItem('__qq_settings__') || '{}'),
  writeFileSync: (p, d) => localStorage.setItem('__qq_settings__', String(d)),
  writeFile: (p, d, o, cb) => (typeof o === 'function' ? o : cb)?.(null),
  existsSync: () => false,
  mkdirSync: () => {},
  promises: { readFile: async () => '{}', writeFile: async () => {}, mkdir: async () => {} },
};

window.require = (name) =>
  name === 'electron'
    ? electron
    : name === '@electron/remote'
      ? electron.remote
      : name === 'events'
        ? Object.assign(BrowserEventEmitter, { EventEmitter: BrowserEventEmitter })
        : name === 'path'
          ? pathShim
          : name === 'assert'
            ? assertShim
            : name === 'util'
              ? {
                  inherits: (c, p) => {
                    Object.setPrototypeOf(c.prototype, p.prototype);
                  },
                  isArray: Array.isArray,
                  promisify:
                    (fn) =>
                    (...a) =>
                      new Promise((resolve, reject) =>
                        fn(...a, (e, v) => (e ? reject(e) : resolve(v)))
                      ),
                }
              : name === 'os'
                ? { homedir: () => '', platform: () => 'browser' }
                : name === 'fs'
                  ? fsShim
                  : name === 'child_process'
                    ? {}
                    : name === 'worker_threads'
                      ? {}
                      : {};

window.process = {
  env: {},
  platform: 'linux',
  versions: { node: '', chrome: '', electron: '' },
  cwd: () => '',
  nextTick: (fn) => queueMicrotask(fn),
  on: () => process,
  once: () => process,
  removeListener: () => process,
  removeAllListeners: () => process,
  emit: () => false,
  setMaxListeners: () => process,
};
window.__dirname = '';
window.__filename = '';
window.Buffer = globalThis.Buffer || {
  from: (v) => new TextEncoder().encode(String(v)),
  isBuffer: () => false,
};
window.global = globalThis;
window.ipcRenderer = ipc;
