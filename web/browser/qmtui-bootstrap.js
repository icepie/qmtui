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
  // loading that bundle so browser traffic never bypasses the authenticated C# API layer.
  const NativeXhr = window.XMLHttpRequest;
  class QmTuiXhr extends NativeXhr {
    open(method, url, ...args) {
      this.__qmtuiBlocked = /^https:\/\/(?:u|c)\.y\.qq\.com\//i.test(String(url));
      return super.open(method, this.__qmtuiBlocked ? '/api/browser/ufetch' : url, ...args);
    }

    send(body) {
      // Keep the body so /api/browser/ufetch can route playlist mutations
      // (addSongsToPlayList / createNewPlayList / deleteSongsFromPlayList) to
      // the authenticated C# library backend instead of a blind {code:0} noop.
      return super.send(body);
    }
  }

  window.XMLHttpRequest = QmTuiXhr;
})();
