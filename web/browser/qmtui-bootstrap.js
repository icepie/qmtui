(() => {
  if (window.__qmtuiBootstrapInstalled) return;
  window.__qmtuiBootstrapInstalled = true;
  window.__qmtuiBridgeErrors = [];

  window.addEventListener('error', (event) => {
    window.__qmtuiBridgeErrors.push(String(event.error?.stack || event.message || event));
  });
  window.addEventListener('unhandledrejection', (event) => {
    window.__qmtuiBridgeErrors.push(String(event.reason?.stack || event.reason || event));
  });

  // The Electron bundle starts network requests while it evaluates. Install this guard before
  // loading that bundle so browser traffic never bypasses the authenticated C# API layer: the
  // original URL and method travel with the rewritten request, so /api/browser/ufetch can
  // forward it upstream with the session credentials and answer the playlist writes itself.
  const NativeXhr = window.XMLHttpRequest;
  const QQ_TARGET = /^https:\/\/(?:u|c)\.y\.qq\.com\//i;
  class QmTuiXhr extends NativeXhr {
    open(method, url, ...args) {
      const target = String(url);
      this.__qmtuiBlocked = QQ_TARGET.test(target);
      const proxied = this.__qmtuiBlocked
        ? `/api/browser/ufetch?url=${encodeURIComponent(target)}&method=${encodeURIComponent(String(method))}`
        : target;
      return super.open(method, proxied, ...args);
    }

    send(body) {
      // Keep the body: the C# layer forwards it upstream and performs the playlist
      // mutations it owns (createNewPlayList / addSongsToPlayList / deleteSongsFromPlayList).
      return super.send(body);
    }
  }

  window.XMLHttpRequest = QmTuiXhr;
})();
