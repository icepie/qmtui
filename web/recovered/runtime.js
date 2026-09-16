/**
 * @module WebpackRuntime (Webpack 5 运行时内核)
 * @layer Microkernel (运行时内核)
 * @description 模块解析器 n()、异步 Chunk 加载器 n.e()、寻址路径计算 n.u()
 */
(() => {
  "use strict";
  var e,
    r,
    t,
    o = {},
    a = {};
  function n(e) {
    var r = a[e];
    if (void 0 !== r) return r.exports;
    var t = (a[e] = { id: e, loaded: !1, exports: {} });
    return (o[e].call(t.exports, t, t.exports, n), (t.loaded = !0), t.exports);
  }
  ((n.m = o),
    (e = []),
    (n.O = (r, t, o, a) => {
      if (!t) {
        var l = 1 / 0;
        for (u = 0; u < e.length; u++) {
          for (var [t, o, a] = e[u], i = !0, d = 0; d < t.length; d++)
            (!1 & a || l >= a) && Object.keys(n.O).every((e) => n.O[e](t[d]))
              ? t.splice(d--, 1)
              : ((i = !1), a < l && (l = a));
          i && (e.splice(u--, 1), (r = o()));
        }
        return r;
      }
      a = a || 0;
      for (var u = e.length; u > 0 && e[u - 1][2] > a; u--) e[u] = e[u - 1];
      e[u] = [t, o, a];
    }),
    (n.n = (e) => {
      var r = e && e.__esModule ? () => e.default : () => e;
      return (n.d(r, { a: r }), r);
    }),
    (n.d = (e, r) => {
      for (var t in r)
        n.o(r, t) &&
          !n.o(e, t) &&
          Object.defineProperty(e, t, { enumerable: !0, get: r[t] });
    }),
    (n.f = {}),
    (n.e = (e) =>
      Promise.all(Object.keys(n.f).reduce((r, t) => (n.f[t](e, r), r), []))),
    (n.u = (e) => e + ".js?max_age=2592000"),
    (n.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)),
    (r = {}),
    (t = "qqmusic:"),
    (n.l = (e, o, a, l) => {
      if (r[e]) r[e].push(o);
      else {
        var i, d;
        if (void 0 !== a)
          for (
            var u = document.getElementsByTagName("script"), s = 0;
            s < u.length;
            s++
          ) {
            var c = u[s];
            if (
              c.getAttribute("src") == e ||
              c.getAttribute("data-webpack") == t + a
            ) {
              i = c;
              break;
            }
          }
        (i ||
          ((d = !0),
          ((i = document.createElement("script")).charset = "utf-8"),
          (i.timeout = 120),
          n.nc && i.setAttribute("nonce", n.nc),
          i.setAttribute("data-webpack", t + a),
          (i.src = e)),
          (r[e] = [o]));
        var p = (t, o) => {
            ((i.onerror = i.onload = null), clearTimeout(f));
            var a = r[e];
            if (
              (delete r[e],
              i.parentNode && i.parentNode.removeChild(i),
              a && a.forEach((e) => e(o)),
              t)
            )
              return t(o);
          },
          f = setTimeout(
            p.bind(null, void 0, { type: "timeout", target: i }),
            12e4,
          );
        ((i.onerror = p.bind(null, i.onerror)),
          (i.onload = p.bind(null, i.onload)),
          d && document.head.appendChild(i));
      }
    }),
    (n.r = (e) => {
      ("undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 }));
    }),
    (n.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e)),
    (n.p = "./"),
    (() => {
      var e = { 666: 0 };
      ((n.f.j = (r, t) => {
        var o = n.o(e, r) ? e[r] : void 0;
        if (0 !== o)
          if (o) t.push(o[2]);
          else if (666 != r) {
            var a = new Promise((t, a) => (o = e[r] = [t, a]));
            t.push((o[2] = a));
            var l = n.p + n.u(r),
              i = new Error();
            n.l(
              l,
              (t) => {
                if (n.o(e, r) && (0 !== (o = e[r]) && (e[r] = void 0), o)) {
                  var a = t && ("load" === t.type ? "missing" : t.type),
                    l = t && t.target && t.target.src;
                  ((i.message =
                    "Loading chunk " + r + " failed.\n(" + a + ": " + l + ")"),
                    (i.name = "ChunkLoadError"),
                    (i.type = a),
                    (i.request = l),
                    o[1](i));
                }
              },
              "chunk-" + r,
              r,
            );
          } else e[r] = 0;
      }),
        (n.O.j = (r) => 0 === e[r]));
      var r = (r, t) => {
          var o,
            a,
            [l, i, d] = t,
            u = 0;
          for (o in i) n.o(i, o) && (n.m[o] = i[o]);
          for (d && d(n), r && r(t); u < l.length; u++)
            ((a = l[u]), n.o(e, a) && e[a] && e[a][0](), (e[l[u]] = 0));
          n.O();
        },
        t = (globalThis.webpackChunkqqmusic = globalThis.webpackChunkqqmusic || []);
      (t.forEach(r.bind(null, 0)), (t.push = r.bind(null, t.push.bind(t))));
    })());
})();
