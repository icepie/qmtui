const isDev = typeof process !== "undefined" && process.env && !!process.env.QQMUSIC_DEBUG;
const logInfo = (...args) => { if (isDev) console.log(...args); };
const logWarn = (...args) => { if (isDev) console.warn(...args); };
const logError = (...args) => { if (isDev) console.error(...args); };

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(73935);
// EXTERNAL MODULE: ./src/entrys/main.less
var main = __webpack_require__(11733);
// EXTERNAL MODULE: ./src/lib/common/utils.ts
var utils = __webpack_require__(31603);
// EXTERNAL MODULE: ./src/client/modules/players/index.ts + 2 modules
var players = __webpack_require__(35229);
// EXTERNAL MODULE: ./src/main_process/util/setting.ts + 1 modules
var setting = __webpack_require__(62384);
// EXTERNAL MODULE: ./src/client/modules/tools/index.ts
var tools = __webpack_require__(32698);
// EXTERNAL MODULE: ./node_modules/antd/es/slider/index.js + 14 modules
var slider = __webpack_require__(75454);
// EXTERNAL MODULE: ./node_modules/antd/es/popover/index.js + 1 modules
var popover = __webpack_require__(19181);
;// CONCATENATED MODULE: ./src/assets/svg.tsx

const isDarkTheme = () => {
  try {
    // 1. 动态分析 body 的实际计算背景色亮度 (最真实客观的渲染结果)
    if (typeof document !== 'undefined' && document.body) {
      const bg = window.getComputedStyle(document.body).backgroundColor;
      if (bg) {
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
          const luminance = r * 0.299 + g * 0.587 + b * 0.114;
          // 浅色模式 #f8f9fc luminance ≈ 249 > 160
          if (luminance > 160) return false;
          // 深色模式 #1e2028 luminance ≈ 32 < 100
          if (luminance < 100) return true;
        }
      }
    }

    // 2. 检查 #js_skin_style 中的排他特征 (严禁匹配非排他的 color:#fff)
    const skinStyle = document.querySelector('#js_skin_style');
    if (skinStyle) {
      const text = skinStyle.innerHTML || skinStyle.textContent || '';
      // 浅色皮肤专属特征
      if (text.includes('#f8f9fc') || text.includes('.c_bg_floor{background-color:#fff}') || text.includes('.c_txt1{color:#111827 !important;}')) {
        return false;
      }
      // 深色皮肤专属特征
      if (text.includes('#1e2028') || text.includes('.c_bg_floor{background-color:#1e1f23}') || text.includes('.c_txt1 { color: #ffffff !important; }')) {
        return true;
      }
    }

    // 3. 检查官方 setting 配置
    if (typeof setting !== 'undefined' && setting.ZP && setting.ZP.settingInitialValue && setting.ZP.settingInitialValue.theme) {
      if (setting.ZP.settingInitialValue.theme === 'light') return false;
      if (setting.ZP.settingInitialValue.theme === 'dark') return true;
    }

    // 4. 检查 localStorage
    if (typeof localStorage !== 'undefined') {
      const t = localStorage.getItem('theme');
      if (t === 'light') return false;
      if (t === 'dark') return true;
    }

    // 5. 检查系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return false;
    }
  } catch (e) {}
  return false;
};

const useThemeDetector = () => {
  const [isDark, setIsDark] = (0, react.useState)(isDarkTheme);

  (0, react.useEffect)(() => {
    const updateTheme = () => {
      const next = isDarkTheme();
      setIsDark(prev => (prev !== next ? next : prev));
    };

    updateTheme();

    let mql = null;
    if (window.matchMedia) {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
      if (mql.addEventListener) {
        mql.addEventListener('change', updateTheme);
      } else if (mql.addListener) {
        mql.addListener(updateTheme);
      }
    }

    let observer = null;
    try {
      observer = new MutationObserver(updateTheme);
      const skinStyle = document.querySelector('#js_skin_style');
      if (skinStyle) {
        observer.observe(skinStyle, { childList: true, characterData: true, subtree: true });
      }
      if (document.head) {
        observer.observe(document.head, { childList: true, subtree: true });
      }
      if (document.body) {
        observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
      }
    } catch (e) {}

    const timer = setInterval(updateTheme, 800);

    return () => {
      clearInterval(timer);
      if (observer) observer.disconnect();
      if (mql) {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', updateTheme);
        } else if (mql.removeListener) {
          mql.removeListener(updateTheme);
        }
      }
    };
  }, []);

  return isDark;
};

const UserDropDownIcon = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    width: width,
    height: height,
    viewBox: "0 -64 1024 1024"
  }, /*#__PURE__*/react.createElement("g", {
    transform: "matrix(1 0 0 -1 0 960)"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M178 636q-8 10 -7 19q0 11 9 20q10 10 19 8q11 0 21 -10l320 -333l321 333q10 10 21 10q10 0 19 -8q10 -10 9.5 -20t-7.5 -19l-321 -334l-3 -2q-16 -16 -39 -16t-40 18z"
  })));
}; //收起歌单

const CollapsePlayList = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 0 32 32",
    width: width,
    height: height
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M17.052 10.508l8.673 8.673c0.26 0.26 0.26 0.682 0 0.943l-0.471 0.471c-0.26 0.26-0.682 0.26-0.943 0l-8.027-8.027-8.009 8.009c-0.24 0.24-0.618 0.259-0.88 0.055l-0.063-0.055-0.471-0.471c-0.26-0.26-0.26-0.682 0-0.943v0l8.656-8.656c0.212-0.212 0.495-0.309 0.772-0.291 0.274-0.015 0.553 0.082 0.763 0.291z"
  }));
}; //展开歌单

const ExpandPlayList = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 0 32 32",
    width: width,
    height: height
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M17.052 22.498l8.673-8.673c0.26-0.26 0.26-0.682 0-0.943l-0.471-0.471c-0.26-0.26-0.682-0.26-0.943 0l-8.027 8.027-8.009-8.009c-0.24-0.24-0.618-0.259-0.88-0.055l-0.063 0.055-0.471 0.471c-0.26 0.26-0.26 0.682 0 0.943v0l8.656 8.656c0.212 0.212 0.495 0.309 0.772 0.291 0.274 0.015 0.553-0.082 0.763-0.291z"
  }));
};
const AddPlayListIcon = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 0 32 32",
    width: width,
    height: height
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M15 15v-4h2v4h4v2h-4v4h-2v-4h-4v-2h4zM3 7.99c0-2.757 2.233-4.99 4.99-4.99h16.020c2.757 0 4.99 2.233 4.99 4.99v16.020c0 2.757-2.233 4.99-4.99 4.99h-16.020c-2.757 0-4.99-2.233-4.99-4.99v-16.020zM5 7.99v16.020c0 1.653 1.338 2.99 2.99 2.99h16.020c1.653 0 2.99-1.338 2.99-2.99v-16.020c0-1.653-1.338-2.99-2.99-2.99h-16.020c-1.653 0-2.99 1.338-2.99 2.99z"
  }));
};
const SkinChangeIcon = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 -64 1024 1024",
    width: width,
    height: height
  }, /*#__PURE__*/react.createElement("path", {
    d: "M706.545 128.019a63.985 63.985 0 0 1 48.599 22.363l172.835 201.763-63.996 127.857-41.374-41.371c-6.25-6.248-14.437-9.372-22.624-9.372-8.188 0-16.374 3.124-22.624 9.372a32.006 32.006 0 0 0-9.375 22.626v402.727c0 17.672-14.327 31.998-31.999 31.998H320.01c-17.671 0-31.998-14.326-31.998-31.998V461.256c0-17.672-14.328-31.998-32-31.998a31.997 31.997 0 0 0-22.624 9.372l-41.373 41.371L96.02 352.007l172.835-201.64a63.987 63.987 0 0 1 48.592-22.348h6.507a95.97 95.97 0 0 1 50.13 14.132C428.37 175.394 474.338 192.015 512 192.015s83.629-16.621 137.915-49.864a95.968 95.968 0 0 1 50.13-14.132h6.5m0-63.998h-6.5a159.89 159.89 0 0 0-83.557 23.558C561.904 121 529.537 128.018 512 128.018c-17.538 0-49.904-7.017-104.495-40.446a159.881 159.881 0 0 0-83.55-23.55h-6.508a127.823 127.823 0 0 0-97.182 44.701L47.428 310.36c-19.522 22.774-20.6 56.05-2.61 80.047L140.815 518.4a63.998 63.998 0 0 0 83.199 17.025v328.558c0 52.932 43.06 95.995 95.995 95.995h415.98c52.935 0 95.996-43.063 95.996-95.995V535.425a64.028 64.028 0 0 0 42.24 7.749 64.014 64.014 0 0 0 46.99-34.528l63.997-127.857c11.522-23.028 8.125-50.722-8.633-70.279L803.744 108.747c-24.336-28.422-59.77-44.726-97.2-44.726z",
    fill: "currentColor"
  }));
};
const MenuDropDown = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 -64 1024 1024",
    width: width,
    height: height
  }, /*#__PURE__*/react.createElement("g", {
    transform: "matrix(1 0 0 -1 0 960)"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M882 796q11 0 19.5 -8.5t8.5 -19.5t-8 -19.5t-20 -8.5h-683q-11 0 -19.5 8.5t-8.5 19.5t8 19.5t20 8.5h683zM882 512q11 0 19.5 -8.5t8.5 -20.5t-8 -20t-20 -8h-683q-11 0 -19.5 8t-8.5 20t8 20.5t20 8.5h683zM882 228q11 0 19.5 -8.5t8.5 -20.5t-8 -20t-20 -8h-683 q-11 0 -19.5 8t-8.5 20t8 20.5t20 8.5h683z"
  })));
};
const Minimize = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 -64 1024 1024",
    width: width,
    height: height
  }, /*#__PURE__*/react.createElement("g", {
    transform: "matrix(1 0 0 -1 0 960)"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M142 512h626q11 0 19.5 -8.5t8.5 -20.5t-8.5 -20t-19.5 -8h-626q-11 0 -19.5 8t-8.5 20t8.5 20.5t19.5 8.5z"
  })));
};
const Close = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 -64 1024 1024",
    width: width,
    height: height
  }, /*#__PURE__*/react.createElement("g", {
    transform: "matrix(1 0 0 -1 0 960)"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M512 556l288 288q10 10 22.5 9.5t21.5 -9.5t9 -22t-9 -22l-288 -288l288 -288q10 -10 9.5 -22.5t-9.5 -21.5t-22 -9t-22 9l-288 288l-288 -288q-10 -10 -22.5 -9.5t-21.5 9.5t-9 22t9 22l288 288l-288 288q-10 10 -9.5 22.5t9.5 21.5t22 9t22 -9z"
  })));
};
const MinMode = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 -64 1024 1024",
    width: width,
    height: height
  }, /*#__PURE__*/react.createElement("g", {
    transform: "matrix(1 0 0 -1 0 960)"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M341 284v-56h-113q-47 0 -80.5 33.5t-33.5 79.5v399q0 46 33 79.5t81 33.5h455q46 0 79.5 -33t33.5 -80v-285h-56v285q0 24 -17 40t-40 16h-455q-24 0 -40.5 -17t-16.5 -39v-399q0 -24 16.5 -40.5t40.5 -16.5h113zM455 398h398q24 0 40.5 -16.5t16.5 -40.5v-227 q0 -24 -16.5 -40.5t-40.5 -16.5h-398q-24 0 -40.5 16.5t-16.5 40.5v227q0 24 16.5 40.5t40.5 16.5zM484 341q-11 0 -20 -8t-9 -20v-171q0 -11 8 -19.5t21 -8.5h341q11 0 19.5 8t8.5 20v171q0 11 -8 19.5t-20 8.5h-341z"
  })));
};
const QQMusicLogo = ({
  className
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    width: 230,
    height: 63,
    className: className
  }, /*#__PURE__*/react.createElement("defs", null, /*#__PURE__*/react.createElement("path", {
    id: "a",
    d: "M0 .156h61.24v61.683H0z"
  }), /*#__PURE__*/react.createElement("linearGradient", {
    x1: "49.93%",
    y1: "-.01%",
    x2: "49.93%",
    y2: "100.023%",
    id: "d"
  }, /*#__PURE__*/react.createElement("stop", {
    stopColor: "#00CBCB",
    offset: "0%"
  }), /*#__PURE__*/react.createElement("stop", {
    stopColor: "#0FC8B2",
    offset: "16.17%"
  }), /*#__PURE__*/react.createElement("stop", {
    stopColor: "#28C48B",
    offset: "44.97%"
  }), /*#__PURE__*/react.createElement("stop", {
    stopColor: "#31C27C",
    offset: "60%"
  }), /*#__PURE__*/react.createElement("stop", {
    stopColor: "#21C077",
    offset: "70%"
  }), /*#__PURE__*/react.createElement("stop", {
    stopColor: "#09BD71",
    offset: "88.57%"
  }), /*#__PURE__*/react.createElement("stop", {
    stopColor: "#00BC6E",
    offset: "100%"
  })), /*#__PURE__*/react.createElement("path", {
    d: "M21.252 7.141a1.581 1.581 0 0 0-1.379 2.376l2.553 4.403 12.507 21.573a16.201 16.201 0 0 0-4.753-.28c-7.664.67-13.417 6.467-12.849 12.947.569 6.48 7.242 11.19 14.906 10.52 7.664-.67 13.417-6.467 12.848-12.947-.151-1.731-.738-3.145-1.669-4.745l-12.65-21.752C37.14 15.916 44.825 9.023 47.885 0c-7.898 5.778-17.88 7.208-26.634 7.141",
    id: "c"
  })), /*#__PURE__*/react.createElement("g", {
    fill: "none",
    fillRule: "evenodd"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M186.358 14.2l-14.224-.038-.906-3.006-5.178-.014.906 3.006-14.66-.04-.01 3.791 34.062.092zM179.712 39.194l-21.13-.056.011-4.03 20.066.054a1.062 1.062 0 0 1 1.06 1.064l-.007 2.968zm-.022 7.82l-21.128-.056.01-4.03 21.13.057-.012 4.03zm2.416-15.634l-28.003-.075-.02 7.82-.01 3.792-.022 7.82 30.13.08.046-17.308a2.125 2.125 0 0 0-2.12-2.129zM181.48 19.76l-4.49-.012-2.359 5.348-10.892-.029-2.33-5.36-4.49-.012 2.33 5.36-8.951-.023-.011 3.79 37.775.101.01-3.79-8.952-.025zM191.51 49.006l4.854.013 5.455-12.838-4.854-.013zM221.74 36.234l-4.854-.013 5.386 12.867 4.854.013z"
  }), /*#__PURE__*/react.createElement("path", {
    d: "M225.163 33.044l.01-3.79-12.903-.035.025-9.134-4.24-.87-.027 9.992-9.083-.024a1.062 1.062 0 0 1-1.056-1.158l1.031-11.285 24.427-.679.01-3.79-28.228.783-.611-.002-1.608 17.596a2.124 2.124 0 0 0 2.111 2.315l12.997.036-.038 14.09-5.256-.013 1.143 3.794 8.345.022.048-17.882 12.903.034zM91.472 46.123l-3.655-.01c-5.85-.016-10.596-4.781-10.58-10.623l.025-9.374c.015-5.843 4.787-10.584 10.637-10.567l3.655.01c5.85.015 10.597 4.78 10.581 10.623l-.025 9.374a10.519 10.519 0 0 1-1.325 5.09l-3.83-5.457-5.432-.014 6.238 8.887a10.55 10.55 0 0 1-6.289 2.061m15.09-10.555l.025-9.374c.022-8.307-6.703-15.06-15.021-15.082l-3.655-.01c-8.318-.022-15.079 6.695-15.101 15.001l-.025 9.374c-.023 8.308 6.702 15.06 15.02 15.082l3.656.01a15.003 15.003 0 0 0 8.863-2.854l2.025 2.883 5.43.015-4.241-6.044a14.962 14.962 0 0 0 3.024-9.001M130.258 46.227l-3.654-.01c-5.85-.016-10.597-4.781-10.581-10.624l.025-9.373c.015-5.843 4.788-10.584 10.638-10.568l3.654.01c5.85.015 10.597 4.781 10.581 10.624l-.025 9.374a10.519 10.519 0 0 1-1.325 5.09l-3.83-5.457-5.432-.014 6.238 8.887a10.547 10.547 0 0 1-6.289 2.06zm16.308 4.49l-4.242-6.044a14.962 14.962 0 0 0 3.024-9.002l.025-9.373c.023-8.307-6.703-15.06-15.02-15.082l-3.656-.01c-8.317-.022-15.079 6.694-15.101 15.001l-.025 9.374c-.023 8.308 6.703 15.06 15.02 15.082l3.656.01a15.003 15.003 0 0 0 8.864-2.854l2.024 2.883 5.43.015z",
    fill: "currentColor"
  }), /*#__PURE__*/react.createElement("mask", {
    id: "b",
    fill: "#fff"
  }, /*#__PURE__*/react.createElement("use", {
    xlinkHref: "#a"
  })), /*#__PURE__*/react.createElement("path", {
    d: "M48.566 6.48L47.59.157l-3.412 3.677A30.524 30.524 0 0 0 30.62.678C13.71.678 0 14.37 0 31.258c0 16.89 13.71 30.58 30.62 30.58s30.62-13.69 30.62-30.58c0-10.193-4.996-19.22-12.674-24.777",
    fill: "#FFDC00",
    mask: "url(#b)"
  }), /*#__PURE__*/react.createElement("use", {
    fill: "url(#d)",
    xlinkHref: "#c"
  })));
};
const BackForwardIcon = () => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: "18",
    height: "18"
  }, /*#__PURE__*/react.createElement("path", {
    d: "M675.328 765.626182L400.570182 512l274.757818-253.626182a34.909091 34.909091 0 1 0-47.36-51.316363l-302.545455 279.272727a34.909091 34.909091 0 0 0 0 51.316363l302.545455 279.272728a34.909091 34.909091 0 1 0 47.36-51.316364",
    fill: "currentColor"
  }));
};
const ForwardBtnIcon = () => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: "18",
    height: "18"
  }, /*#__PURE__*/react.createElement("path", {
    d: "M325.399273 235.124364L600.157091 488.727273 325.399273 742.353455a34.909091 34.909091 0 1 0 47.36 51.316363l302.545454-279.272727a34.909091 34.909091 0 0 0 0-51.316364l-302.545454-279.272727a34.909091 34.909091 0 1 0-47.36 51.316364",
    fill: "currentColor"
  }));
};
const SearchIcon = () => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: "16",
    height: "16"
  }, /*#__PURE__*/react.createElement("path", {
    d: "M875.264 855.872l-188.032-215.552C737.664 579.392 768 501.248 768 416 768 221.632 610.368 64 416 64 221.568 64 64 221.632 64 416S221.568 768 416 768c72.32 0 139.52-21.888 195.392-59.264l186.88 214.272c18.496 21.312 50.88 23.36 72 4.928C891.648 909.376 893.76 877.12 875.264 855.872zM160 416c0-141.184 114.816-256 256-256 141.184 0 256 114.816 256 256s-114.816 256-256 256C274.816 672 160 557.184 160 416z",
    fill: "currentColor"
  }));
};
const SplitIcon = () => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: "16",
    height: "16"
  }, /*#__PURE__*/react.createElement("g", null, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    strokeWidth: "4",
    d: "m486.400004,102.4l83.199995,0l0,819.2l-83.199995,0l0,-819.2z"
  })));
};
const Restore = ({
  width,
  height
}) => {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 -64 1024 1024",
    width: width,
    height: height
  }, /*#__PURE__*/React.createElement("g", {
    transform: "matrix(1 0 0 -1 0 960)"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M284 740q0 46 33.5 79.5t80.5 33.5h398q47 0 80.5 -33t33.5 -80v-399q0 -46 -33 -79.5t-81 -33.5q0 -47 -33.5 -80.5t-79.5 -33.5h-399q-46 0 -79.5 33t-33.5 81v398q0 46 33.5 80t79.5 34zM341 740h342q46 0 79.5 -33.5t33.5 -80.5v-342q24 0 40.5 17t16.5 40v399 q0 24 -16.5 40t-40.5 16h-398q-24 0 -40.5 -16t-16.5 -40zM228 626v-398q0 -24 17 -40.5t39 -16.5h399q24 0 40.5 16.5t16.5 40.5v398q0 24 -17 40.5t-40 16.5h-399q-24 0 -40 -16.5t-16 -40.5z"
  })));
};
const Maximize = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 -64 1024 1024",
    width: width,
    height: height
  }, /*#__PURE__*/react.createElement("g", {
    transform: "matrix(1 0 0 -1 0 960)"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M228 740v-512q0 -24 17 -40.5t39 -16.5h512q24 0 40.5 16.5t16.5 40.5v512q0 24 -16.5 40t-40.5 16h-512q-24 0 -40 -16t-16 -40zM284 853h512q47 0 80.5 -33t33.5 -80v-512q0 -47 -33 -80.5t-81 -33.5h-512q-46 0 -79.5 33t-33.5 81v512q0 46 33.5 79.5t79.5 33.5z"
  })));
};
const VoiceNormal = ({
  width,
  height
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 -64 1024 1024",
    width: width,
    height: height
  }, /*#__PURE__*/react.createElement("g", {
    transform: "matrix(1 0 0 -1 0 960)"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M658 229v45q51 41 80.5 97t29.5 123q0 64 -29.5 121.5t-80.5 96.5v46q67 -42 107.5 -112.5t40.5 -151.5t-40.5 -152t-107.5 -113zM218 329v329h162l205 148v-623l-205 146h-162zM550 256v474l-144 -108h-150v-256h146z"
  })));
};
const VoiceMuteX = ({
  width,
  height,
  className = ''
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: width,
    height: height,
    className: className
  }, /*#__PURE__*/react.createElement("g", {
    transform: "matrix(1 0 0 -1 0 960)"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M914 394l-28 -28l-103 102l-99 -102l-26 28l102 103l-102 99l30 29l103 -103l101 103l30 -29l-103 -102z"
  })));
};
const VoiceSilence = ({
  width,
  height,
  className = ''
}) => {
  return /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 -64 1024 1024",
    width: width,
    height: height,
    className: className
  }, /*#__PURE__*/react.createElement("g", {
    transform: "matrix(1 0 0 -1 0 960)"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M218 329v329h162l205 148v-623l-205 146h-162zM550 256v474l-144 -108h-150v-256h150z"
  })));
};
const VisiblePlayMode = ({
  width,
  height
}) => {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: width,
    height: height
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M875.008 295.424a34.133333 34.133333 0 1 0-58.197333 35.669333c35.328 57.514667 53.930667 123.562667 53.930666 191.488 0 201.898667-164.352 366.250667-366.250666 366.250667S138.24 724.48 138.24 522.581333 302.592 156.330667 504.490667 156.330667c18.773333 0 34.133333-15.36 34.133333-34.133334s-15.36-34.133333-34.133333-34.133333C264.874667 88.064 69.973333 282.965333 69.973333 522.581333s194.901333 434.517333 434.517334 434.517334 434.517333-194.901333 434.517333-434.517334c0.170667-80.384-22.016-159.061333-64-227.157333z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M501.248 389.973333c-77.653333 0-140.8 63.146667-140.8 140.8s63.146667 140.8 140.8 140.8 140.8-63.146667 140.8-140.8V224.256c0-19.456 15.872-35.328 35.328-35.328 19.456 0 35.328 15.872 35.328 35.328 0 18.773333 15.36 34.133333 34.133333 34.133333s34.133333-15.36 34.133334-34.133333c0-57.173333-46.421333-103.594667-103.594667-103.594667s-103.594667 46.421333-103.594667 103.594667v186.026667a140.526933 140.526933 0 0 0-72.533333-20.309334z m0 213.333334a72.704 72.704 0 0 1-72.533333-72.533334 72.704 72.704 0 0 1 72.533333-72.533333 72.704 72.704 0 0 1 72.533333 72.533333 72.704 72.704 0 0 1-72.533333 72.533334z"
  }));
};
// EXTERNAL MODULE: ./node_modules/electron-settings/dist/settings.js
var settings = __webpack_require__(44418);
var settings_default = /*#__PURE__*/__webpack_require__.n(settings);
// EXTERNAL MODULE: ./src/client/types/index.ts
var types = __webpack_require__(88943);
// EXTERNAL MODULE: ./node_modules/stook/dist/stook.esm.js + 2 modules
var stook_esm = __webpack_require__(49068);
// EXTERNAL MODULE: ./src/lib/common/dialog.tsx
var dialog = __webpack_require__(7273);
// EXTERNAL MODULE: ./src/pages/main/css/player.less
var player = __webpack_require__(9410);
// EXTERNAL MODULE: external "electron"
var external_electron_ = __webpack_require__(58933);
// EXTERNAL MODULE: ./src/hooks/assets.ts
var assets = __webpack_require__(67891);
// EXTERNAL MODULE: ./src/component/context_menu/index.tsx
var context_menu = __webpack_require__(77365);
// EXTERNAL MODULE: ./src/lib/common/jump.ts
var jump = __webpack_require__(54128);
// EXTERNAL MODULE: ./src/tool/bridge/index.ts
var bridge = __webpack_require__(53941);
;// CONCATENATED MODULE: ./src/client/modules/audio_data_bridge/index.ts


class AudioBridge {
  constructor() {
    this.audioContext = void 0;
    this.sourceNode = void 0;
    this.analyser = void 0;
    this.bufferArr = void 0;
    this.hasBindAudioSource = void 0;

    this.startTransferAudioData = () => {
      const {
        getFrequencyData,
        startTransferAudioData
      } = this;
      requestAnimationFrame(() => {
        getFrequencyData();
        requestAnimationFrame(startTransferAudioData);
      });
    };

    this.getFrequencyData = () => {
      this.analyser.getByteFrequencyData(this.bufferArr);
      (0,bridge/* emitIpcRenderMessage */.D)('player_message', 'visible_play_data', {
        frequencyData: this.bufferArr,
        frequencyBinCount: this.analyser.frequencyBinCount
      });
    };

    this.hasBindAudioSource = false;
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new AudioBridge();
    }

    return this._instance;
  }

  init(config) {
    this.initAudioContextNode(config);
  }

  initAudioContextNode(config) {
    const {
      fftSize = 512,
      audioElement
    } = config;
    this.audioContext = new AudioContext();

    if (!this.hasBindAudioSource) {
      this.hasBindAudioSource = true; // todo 1
      // const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
      // todo 2

      this.sourceNode = this.audioContext.createMediaElementSource(audioElement); // todo 3

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.smoothingTimeConstant = 0.3;
      this.analyser.fftSize = fftSize; // javascriptNode.connect(audioContext.destination);

      this.sourceNode.connect(this.analyser); // analyser.connect(javascriptNode);

      this.sourceNode.connect(this.audioContext.destination);
      this.analyser.connect(this.audioContext.destination);
      this.bufferArr = new Uint8Array(this.analyser.frequencyBinCount);
    }
  }

}

AudioBridge._instance = void 0;

const initAudioBridge = bridgeConfig => {
  AudioBridge.getInstance().init(bridgeConfig);
};


// EXTERNAL MODULE: ./src/tool/qmfeUnityReport/index.ts
var qmfeUnityReport = __webpack_require__(42643);
;// CONCATENATED MODULE: ./src/component/player/index.tsx



















const LogicalPlayer = players/* default.getInstance */.Z.getInstance();
window.__QMTUI_ATTACH_PLAYER__ = hook => hook && hook(LogicalPlayer);
window.dispatchEvent(new CustomEvent("qmtui-player-ready"));
const NORMAL_CONFIG_MODE = [{
  className: 'player_mode_dialog_list_mode--random',
  title: '随机模式',
  mode: types/* PLAY_MODE.RANDOM */.kV.RANDOM
}, {
  className: 'player_mode_dialog_list_mode--list',
  title: '顺序模式',
  mode: types/* PLAY_MODE.SEQUENTIAL */.kV.SEQUENTIAL
}, {
  className: 'player_mode_dialog_list_mode--single',
  title: '单曲模式',
  mode: types/* PLAY_MODE.SINGLE_CYCLE */.kV.SINGLE_CYCLE
}, {
  className: 'player_mode_dialog_list_mode--cycle',
  title: '列表循环',
  mode: types/* PLAY_MODE.LIST_CYCLE */.kV.LIST_CYCLE
}];
const RADIO_CONFIG_MODE = NORMAL_CONFIG_MODE.filter(item => item.mode === types/* PLAY_MODE.SINGLE_CYCLE */.kV.SINGLE_CYCLE || item.mode === types/* PLAY_MODE.SEQUENTIAL */.kV.SEQUENTIAL);
const DEFAULT_SONG = {
  title: 'QQ音乐，让生活充满音乐',
  track: {
    singer: [{
      name: ''
    }]
  }
};
/**
 * --------------非state变量-----------------
 * 需要保存在外部，不同的函数会对其进行拷贝，导致不同的闭包作用域，很麻烦
 */
// 以下为保存时间轴拖拽状态的临时变量

let isProcessDotMoving = false;
let prevProcessDotX = 0;
let prevProcess = 0;
const Player = ({
  isCoverPlayer = false,
  isPlayListVisible = false,
  onShowPlaylist
}) => {
  let hasBindEvent = false;
  const processDom = /*#__PURE__*/react.createRef(); // 音频资源加载进度

  const getInitialPlaybackState = () => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('__qqmusic_playback_state__') : null;
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
  };
  const _initialPlaybackState = getInitialPlaybackState();

  const [bufferProcess, setBufferProcess] = (0,react.useState)(0); // 当前时间轴

  const [currentPlaytime, setPlaytime] = (0,react.useState)(() => {
    if (_initialPlaybackState && typeof _initialPlaybackState.currentTime === 'number' && _initialPlaybackState.currentTime > 0) {
      return _initialPlaybackState.currentTime;
    }
    return 0;
  }); // 总时长

  const [duration, setDuration] = (0,react.useState)(() => {
    if (_initialPlaybackState && typeof _initialPlaybackState.duration === 'number' && _initialPlaybackState.duration > 0) {
      return _initialPlaybackState.duration;
    }
    if (_initialPlaybackState && _initialPlaybackState.currentSong) {
      const s = _initialPlaybackState.currentSong;
      const d = (s.track && s.track.interval) || s.interval;
      if (d) return d;
    }
    return 0;
  }); // 音量

  const [volume, setVolume] = (0,react.useState)(() => {
    if (_initialPlaybackState && typeof _initialPlaybackState.volume === 'number' && _initialPlaybackState.volume >= 0 && _initialPlaybackState.volume <= 1) {
      return Math.round(_initialPlaybackState.volume * 100);
    }
    try {
      const savedVolStr = localStorage.getItem('qqmusic_saved_volume');
      if (savedVolStr !== null) {
        const v = parseFloat(savedVolStr);
        if (!isNaN(v) && v >= 0 && v <= 1) return Math.round(v * 100);
      }
    } catch (_) {}
    return setting/* default.settingInitialValue.volume */.ZP.settingInitialValue.volume;
  }); // 是否静音

  const [isMuted, setMute] = (0,react.useState)(() => {
    if (_initialPlaybackState && typeof _initialPlaybackState.volume === 'number') {
      return _initialPlaybackState.volume === 0;
    }
    return setting/* default.settingInitialValue.volume */.ZP.settingInitialValue.volume === 0;
  }); // 播放模式

  const [playMode, setPlayMode] = (0,react.useState)(() => {
    if (_initialPlaybackState && typeof _initialPlaybackState.mode === 'number') {
      return _initialPlaybackState.mode;
    }
    return LogicalPlayer.mode;
  }); // 播放状态

  const [playState, setPlayState] = (0,react.useState)(LogicalPlayer.state); // 音量调整按钮

  const [isVolumePopoverVisible, setVolumePopoverVisible] = (0,react.useState)(false); // 是否展示进度条操控dot

  const [isProcessDotVisible, setProcessDotVisible] = (0,react.useState)(false); // 是否显示桌面歌词

  const [isDesktopLyricWindowVisible, setDesktopLyricWindowVisible] = (0,react.useState)(setting/* default.settingValue.AUTO_OPEN_DESKTOP_LYRIC */.ZP.settingValue.AUTO_OPEN_DESKTOP_LYRIC);
  const [isPlayModePopoverVisible, setModePopoverVisible] = (0,react.useState)(false);
  const [currentSong, setCurrentSong] = (0,react.useState)(() => {
    if (_initialPlaybackState && _initialPlaybackState.currentSong) {
      return _initialPlaybackState.currentSong;
    }
    return (LogicalPlayer === null || LogicalPlayer === void 0 ? void 0 : LogicalPlayer.currentSong) || DEFAULT_SONG;
  });
  const [playingInfo, setPlayingInfo] = (0,stook_esm/* useStore */.oR)('PlayingStore', () => {
    if (_initialPlaybackState && Array.isArray(_initialPlaybackState.songList) && _initialPlaybackState.songList.length > 0) {
      return {
        songOnPlaying: null,
        songOnPause: _initialPlaybackState.currentSong || _initialPlaybackState.songList[0] || null,
        songList: _initialPlaybackState.songList
      };
    }
    return {
      songOnPlaying: null,
      songOnPause: null,
      songList: []
    };
  });
  (0,react.useEffect)(() => {
    if (!hasBindEvent) {
      hasBindEvent = true;
      LogicalPlayer.initAudio().then(initData => {
        let restoredVol = null;
        if (_initialPlaybackState && typeof _initialPlaybackState.volume === 'number' && _initialPlaybackState.volume >= 0 && _initialPlaybackState.volume <= 1) {
          restoredVol = _initialPlaybackState.volume;
        } else {
          try {
            const savedVolStr = localStorage.getItem('qqmusic_saved_volume');
            if (savedVolStr !== null) {
              const v = parseFloat(savedVolStr);
              if (!isNaN(v) && v >= 0 && v <= 1) restoredVol = v;
            }
          } catch (_) {}
        }
        if (restoredVol !== null) {
          LogicalPlayer.setVolume(restoredVol);
          setVolume(Math.round(restoredVol * 100));
          setMute(restoredVol === 0);
        } else {
          const defaultVol = setting/* default.settingInitialValue.volume */.ZP.settingInitialValue.volume / 100;
          LogicalPlayer.setVolume(defaultVol);
          setVolume(Math.round(defaultVol * 100));
        }

        const targetSong = (initData && initData.song) || (_initialPlaybackState && _initialPlaybackState.currentSong) || LogicalPlayer.currentSong;
        if (targetSong) {
          setCurrentSong(targetSong);
          const dur = (targetSong.track && targetSong.track.interval) || targetSong.interval || (_initialPlaybackState && _initialPlaybackState.duration) || 0;
          if (dur > 0) setDuration(dur);
        }

        const targetList = (initData && initData.songList && initData.songList.length > 0)
          ? initData.songList
          : ((_initialPlaybackState && _initialPlaybackState.songList) || LogicalPlayer.songList || []);

        if (targetList && targetList.length > 0) {
          setPlayingInfo({
            songOnPlaying: null,
            songOnPause: targetSong || null,
            songList: targetList
          });
        }

        if (_initialPlaybackState && typeof _initialPlaybackState.currentTime === 'number' && _initialPlaybackState.currentTime > 0) {
          setPlaytime(_initialPlaybackState.currentTime);
        }

        if (_initialPlaybackState && typeof _initialPlaybackState.mode === 'number') {
          setPlayMode(_initialPlaybackState.mode);
        }

        registerEvent();
      });
    }

    return () => {
      removeListener();
    };
  }, []);
  /**
   * 注册player的事件，进行监听
   */

  const registerEvent = () => {
    // 全局空格键 (Space) 智能播放/暂停
    const handleGlobalSpaceKey = (e) => {
      if (e.code === 'Space' || e.keyCode === 32) {
        const activeEl = document.activeElement;
        const isInput = activeEl && (
          activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable ||
          activeEl.getAttribute('contenteditable') === 'true'
        );
        if (!isInput) {
          e.preventDefault();
          e.stopPropagation();
          if (LogicalPlayer.state === types/* PLAY_STATE.PLAYING */.tJ.PLAYING) {
            LogicalPlayer.pause();
          } else {
            LogicalPlayer.resume();
          }
        }
      }
    };
    window.addEventListener('keydown', handleGlobalSpaceKey);

    // 监听音量调整并持久化
    if (typeof LogicalPlayer.on === 'function') {
      try {
        LogicalPlayer.on('VOLUME_CHANGE', (vol) => {
          try { localStorage.setItem('qqmusic_saved_volume', String(vol)); } catch (e) {}
        });
      } catch (e) {}
    }

    const handleBeforeUnload = () => {
      try {
        if (LogicalPlayer && typeof LogicalPlayer.savePlaybackState === 'function') {
          LogicalPlayer.savePlaybackState();
        }
      } catch (_) {}
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    LogicalPlayer.on(types/* PLAY_STATE.PLAYING */.tJ.PLAYING, handlePlayerPlaying);
    LogicalPlayer.on(types/* PLAY_STATE.PAUSED */.tJ.PAUSED, handlePlayerPause);
    LogicalPlayer.on(types/* PLAY_STATE.TIME_UPDATE */.tJ.TIME_UPDATE, handlePlayerTimeUpdate);
    LogicalPlayer.on(types/* PLAY_STATE.RESUME */.tJ.RESUME, handlePlayerResume);
    LogicalPlayer.on(types/* PLAY_STATE.MODE_CHANGE */.tJ.MODE_CHANGE, handlePlayerPlayModeChange);
    LogicalPlayer.on(types/* PLAY_STATE.CLEAR_PLAY_LIST */.tJ.CLEAR_PLAY_LIST, handleClearPlayList);

    if (!isCoverPlayer) {
      external_electron_.ipcRenderer.on('player_message', onDesktopLyricMsg); // LogicalPlayer.on(PLAY_STATE.READY, handlePlayerReady);
    }

    external_electron_.ipcRenderer.on('player_main_pause', () => {
      LogicalPlayer.pause();
    });
  };
  /***********************************
   * 以下为绑定Player的事件，componentUnMount的时候，需要移除
   * 基于EventEmitter的事件绑定数量过多时，内存会大量增加
   * *********************************/


  const handlePlayerReady = () => {
    initAudioBridge({
      audioElement: LogicalPlayer.getAudioElement(),
      fftSize: 2048
    });
    AudioBridge.getInstance().startTransferAudioData();
  };

  const emitPlayerStateChange = data => {
    (0,bridge/* emitIpcRenderMessage */.D)('player_message', 'player_state_change', data);
  };

  const handlePlayerPlaying = data => {
    var _song$track;

    const {
      song,
      songList
    } = data;
    setCurrentSong(song);
    let dur = ((_song$track = song.track) === null || _song$track === void 0 ? void 0 : _song$track.interval) || song.interval || 0;
    if (!dur || dur <= 0) {
      try {
        const audioEl = LogicalPlayer.getAudioElement && LogicalPlayer.getAudioElement();
        if (audioEl && audioEl.duration && !isNaN(audioEl.duration) && isFinite(audioEl.duration)) {
          dur = Math.round(audioEl.duration);
        }
      } catch (_) {}
    }
    setDuration(dur);
    setPlayState(types/* PLAY_STATE.PLAYING */.tJ.PLAYING);
    setPlayingInfo({
      songOnPlaying: song,
      songOnPause: null,
      songList
    });
    emitPlayerStateChange('play');
  };

  const handlePlayerPause = ({
    song
  }) => {
    setPlayState(types/* PLAY_STATE.PAUSED */.tJ.PAUSED);
    setPlayingInfo({ ...(0,stook_esm/* getState */.y0)('PlayingStore'),
      songOnPlaying: null,
      songOnPause: song
    });
    emitPlayerStateChange('pause');
  };

  const handlePlayerTimeUpdate = ({
    timeStamp,
    duration: currentDuration,
    buffered,
    song
  }) => {
    setPlaytime(timeStamp);
    setBufferProcess(buffered);
    if (currentDuration && !isNaN(currentDuration) && isFinite(currentDuration) && currentDuration > 0) {
      const roundedDur = Math.round(currentDuration);
      setDuration(prev => (!prev || prev <= 0 || Math.abs(prev - roundedDur) > 2 ? roundedDur : prev));
      if (song && (!song.interval || song.interval <= 0)) {
        song.interval = roundedDur;
      }
    }
    try {
      const now = Date.now();
      if (!window.__lastTimeUpdateSave || now - window.__lastTimeUpdateSave > 1000) {
        window.__lastTimeUpdateSave = now;
        if (LogicalPlayer && typeof LogicalPlayer.savePlaybackState === 'function') {
          LogicalPlayer.savePlaybackState({
            currentTime: timeStamp,
            duration: currentDuration || (song && song.interval) || 0
          });
        }
      }
    } catch (_) {}
    (0,bridge/* emitIpcRenderMessage */.D)('player_message', 'lyric_message', {
      song,
      currentTime: timeStamp
    });
  };

  const handlePlayerResume = () => {
    setPlayState(types/* PLAY_STATE.PLAYING */.tJ.PLAYING);
  };

  const handlePlayerPlayModeChange = ({
    mode
  }) => {
    setPlayMode(mode);
  };

  const handleClearPlayList = () => {
    setPlayingInfo({
      songOnPlaying: null,
      songOnPause: null,
      songList: []
    });
    setCurrentSong(DEFAULT_SONG);
    setDuration(0);
    emitPlayerStateChange('clear');
  };

  const removeListener = () => {
    LogicalPlayer.off(types/* PLAY_STATE.PLAYING */.tJ.PLAYING, handlePlayerPlaying);
    LogicalPlayer.off(types/* PLAY_STATE.PAUSED */.tJ.PAUSED, handlePlayerPause);
    LogicalPlayer.off(types/* PLAY_STATE.TIME_UPDATE */.tJ.TIME_UPDATE, handlePlayerTimeUpdate);
    LogicalPlayer.off(types/* PLAY_STATE.RESUME */.tJ.RESUME, handlePlayerResume);
    LogicalPlayer.off(types/* PLAY_STATE.MODE_CHANGE */.tJ.MODE_CHANGE, handlePlayerPlayModeChange);
  };

  const onDesktopLyricMsg = (_, msg) => {
    switch (msg.command) {
      case 'next':
        LogicalPlayer.playNext();
        break;

      case 'prev':
        LogicalPlayer.playPrev();
        break;

      case 'pause':
        LogicalPlayer.pause();
        break;

      case 'play':
        {
          if (LogicalPlayer.state === types/* PLAY_STATE.PLAYING */.tJ.PLAYING) {
            LogicalPlayer.pause();
          } else {
            LogicalPlayer.resume();
          }

          break;
        }

      case 'play_pause':
        {
          if (LogicalPlayer.state === types/* PLAY_STATE.PLAYING */.tJ.PLAYING) {
            LogicalPlayer.pause();
          } else {
            LogicalPlayer.resume();
          }
          break;
        }

      case 'set_mode':
        if (typeof msg.args === 'number') {
          LogicalPlayer.setMode(msg.args);
        }
        break;

      case 'seek':
        if (typeof msg.args === 'number') {
          LogicalPlayer.setCurrentTime(Math.max(0, LogicalPlayer.getCurrentProcess() + msg.args));
        }
        break;

      case 'set_position':
        if (typeof msg.args === 'number') {
          LogicalPlayer.setCurrentTime(Math.max(0, msg.args));
        }
        break;

      case 'set_desktop_lyric':
        setDesktopLyricWindowVisible(msg.args);
        break;
    }
  };
  /**
   * 点击遮罩层，隐藏弹出窗口
   */


  const hidePopoverWindow = () => {
    setVolumePopoverVisible(false);
    setModePopoverVisible(false);
  };

  const handleWheelOnShadowWindow = ev => {
    if (isVolumePopoverVisible) {
      const delta = volume - ev.deltaY / 10;

      const _volume = Math.floor(parseInt((delta > 100 ? 100 : delta < 0 ? 0 : delta).toFixed(), 10));

      LogicalPlayer.setVolume(_volume / 100);
      setVolume(_volume);
      setMute(_volume <= 0);
    }
  };
  /**
   *  展示单曲播放页
   */


  const toShowCoverPlayPage = () => {
    var _playingInfo$songOnPa, _playingInfo$songOnPl;

    if (playingInfo !== null && playingInfo !== void 0 && (_playingInfo$songOnPa = playingInfo.songOnPause) !== null && _playingInfo$songOnPa !== void 0 && _playingInfo$songOnPa.id || playingInfo !== null && playingInfo !== void 0 && (_playingInfo$songOnPl = playingInfo.songOnPlaying) !== null && _playingInfo$songOnPl !== void 0 && _playingInfo$songOnPl.id || currentSong !== null && currentSong !== void 0 && currentSong.id) {
      qmfeUnityReport/* default.reportExposurePage */.ZP.reportExposurePage(qmfeUnityReport/* PAGE_HASH.SONG_PLAY_PAGE_EXPOSURE */.qt.SONG_PLAY_PAGE_EXPOSURE);
      (0,stook_esm/* mutate */.JG)('IsCoverPlayerVisible', true);
    }
  };

  const switchSongLikeState = () => {
    (0,assets/* switchLikeState */.Mb)(currentSong);
  };
  /**
   * 切换歌曲的喜欢状态
   */


  const toSwitchSongLikeState = () => {
    if (currentSong) {
      if (currentSong.isLocal || currentSong.isWebDav || currentSong.localFilePath || (typeof currentSong.mid === 'string' && (currentSong.mid.startsWith('local_') || currentSong.mid.startsWith('webdav_')))) {
        return;
      }
      if (currentSong.like) {
        dialog/* default.show */.ZP.show({
          mode: 'common',
          title: 'QQ音乐',
          icon_type: 1,
          sub_title: '确定要将这首歌曲从我喜欢的歌删除吗？',
          button_info1: {
            highlight: 1,
            title: '确定',
            fn: () => {
              dialog/* default.hide */.ZP.hide();
              switchSongLikeState();
            }
          },
          button_info2: {
            highlight: 0,
            title: '取消',
            fn: () => {
              dialog/* default.hide */.ZP.hide();
            }
          }
        });
      } else {
        switchSongLikeState();
      }
    }
  };
  /**
   * 显示菜单窗口
   */


  const showContextMenu = ev => {
    if (currentSong.id) {
      (0,context_menu/* showMenu */.A)(ev, {
        songList: [currentSong],
        songOnSelected: [currentSong],
        index: 0
      }, {
        showPlay: false
      });
    }
  };
  /**
   * @param val
   */


  const handleVolumeSlideChange = val => {
    const muted = val === 0;
    switchPlayerMuteState(muted);
    setVolume(val);
    LogicalPlayer.setVolume(val / 100);
  };

  const handleVolumeAfterSlide = () => {
    if (setting/* default.settingValue.REMEMBER_VOICE */.ZP.settingValue.REMEMBER_VOICE) {
      settings_default().set(setting/* INIT_PARAM.VOLUME */.cB.VOLUME, volume);
    }
  };
  /**
   * 切换播放模式
   * @param mode
   */


  const switchPlayMode = mode => {
    setPlayMode(mode);
    LogicalPlayer.setMode(mode);
    setModePopoverVisible(false);
  };
  /**
   * 切换播放器静音状态
   * @param val
   */


  const switchPlayerMuteState = val => {
    setMute(val);
    LogicalPlayer.setMute(val);
  };

  const switchDesktopLyricVisibleState = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    setDesktopLyricWindowVisible(!isDesktopLyricWindowVisible);
    (0,bridge/* emitIpcRenderMessage */.D)('player_message', 'set_desktop_lyric', {
      show: !isDesktopLyricWindowVisible
    });
  };

  const switchPlaylistVisibleState = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    onShowPlaylist === null || onShowPlaylist === void 0 ? void 0 : onShowPlaylist(!isPlayListVisible);
  };
  /**
   * 显示时间轴上的操作bar
   */


  const handleDotMouseOver = () => {
    setProcessDotVisible(true);
  };

  const handleDotMouseLeave = () => {
    if (!isProcessDotMoving) {
      setProcessDotVisible(false);
    }
  };
  /**
   * 点击
   */


  const jumpToCurrentTime = ev => {
    const distanceX = ev.pageX - processDom.current.getBoundingClientRect().left;
    let actualDuration = duration;
    if (!actualDuration || actualDuration <= 0) {
      try {
        const audioEl = LogicalPlayer.getAudioElement && LogicalPlayer.getAudioElement();
        if (audioEl && audioEl.duration && !isNaN(audioEl.duration) && isFinite(audioEl.duration)) {
          actualDuration = Math.round(audioEl.duration);
          setDuration(actualDuration);
        }
      } catch (_) {}
    }
    if (!actualDuration || actualDuration <= 0) return;

    let _process = Math.floor(distanceX / processDom.current.clientWidth * actualDuration);

    if (_process > actualDuration) {
      _process = actualDuration;
    } else if (_process < 0) {
      _process = 0;
    }

    LogicalPlayer.setCurrentTime(_process);
  };

  const handleMouseMoveOnProcessBar = ev => {
    if (isProcessDotMoving) {
      const distanceX = ev.pageX - prevProcessDotX;
      let actualDuration = duration;
      if (!actualDuration || actualDuration <= 0) {
        try {
          const audioEl = LogicalPlayer.getAudioElement && LogicalPlayer.getAudioElement();
          if (audioEl && audioEl.duration && !isNaN(audioEl.duration) && isFinite(audioEl.duration)) {
            actualDuration = Math.round(audioEl.duration);
            setDuration(actualDuration);
          }
        } catch (_) {}
      }
      if (!actualDuration || actualDuration <= 0) return;

      let _process = Math.floor(prevProcess + distanceX / processDom.current.clientWidth * actualDuration);

      if (_process > actualDuration) {
        _process = actualDuration;
      } else if (_process < 0) {
        _process = 0;
      }

      setPlaytime(_process);
    }
  };

  const handleMouseUpOnProcessBar = ev => {
    if (isProcessDotMoving) {
      isProcessDotMoving = false;
      prevProcess = 0;
      prevProcessDotX = 0;
      LogicalPlayer.resume();
      jumpToCurrentTime(ev);
    }
  };

  const handleMouseDownOnProcessBar = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    isProcessDotMoving = true;
    LogicalPlayer.pause();
    prevProcessDotX = ev.pageX;
    prevProcess = LogicalPlayer.getCurrentProcess();
  };

  const jumpToAlbumDetail = ev => {
    ev.stopPropagation();

    if (currentSong && currentSong !== null && currentSong !== void 0 && currentSong.album.mid) {
      (0,jump/* default */.Z)(jump/* PAGE_TYPE.ALBUM */.G.ALBUM, {
        mid: currentSong.album.mid
      });
    }
  };

  const jumpSinger = (ev, mid) => {
    ev.stopPropagation();

    if (mid) {
      (0,jump/* default */.Z)(jump/* PAGE_TYPE.SINGER */.G.SINGER, {
        mid
      });
    }
  };
  /**
   * 播放进度条
   */


  const renderProcess = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "player_process_wrapper",
      style: { width: "100%", position: "relative", marginBottom: "6px", padding: isCoverPlayer ? "0" : "0 34px", boxSizing: "border-box" }
    }, /*#__PURE__*/react.createElement("div", {
      className: "player_process",
      ref: processDom,
      onMouseOver: handleDotMouseOver,
      onMouseLeave: handleDotMouseLeave,
      onClick: jumpToCurrentTime,
      onMouseMove: handleMouseMoveOnProcessBar,
      onMouseUp: handleMouseUpOnProcessBar,
      style: { width: "100%", position: "relative", margin: 0, padding: 0 }
    }, /*#__PURE__*/react.createElement("div", {
      className: `player_process_cont c_bg2 ${isCoverPlayer ? "player_process_cont--fix" : ""}`
    }, /*#__PURE__*/react.createElement("div", {
      className: "player_process_buffer c_bg_normal",
      style: {
        width: duration !== 0 ? `${(bufferProcess / duration * 100).toFixed(2)}%` : "0%"
      }
    }), /*#__PURE__*/react.createElement("div", {
      className: "player_process_cent c_bg_highlight",
      style: {
        width: duration !== 0 ? `${(currentPlaytime / duration * 100).toFixed(2)}%` : "0%"
      }
    }), /*#__PURE__*/react.createElement("div", {
      className: "player_process_dot",
      style: {
        left: duration !== 0 ? `${(currentPlaytime / duration * 100).toFixed(2)}%` : "0%"
      }
    }))), /*#__PURE__*/react.createElement("div", {
      className: "player_process_time_row",
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        padding: "0",
        marginTop: "4px",
        fontSize: "14px",
        fontWeight: "700",
        color: "var(--play-text-sub, #a1a1aa)",
        fontVariantNumeric: "tabular-nums",
        userSelect: "none",
        pointerEvents: "none"
      }
    }, /*#__PURE__*/react.createElement("span", {
      className: "player_time_cur",
      style: { color: isCoverPlayer ? "inherit" : "#1ecc94" }
    }, (0,utils/* translateTime */.xj)(currentPlaytime)), /*#__PURE__*/react.createElement("span", {
      className: "player_time_total"
    }, (0,utils/* translateTime */.xj)(duration))));
  };
  const renderLeft = () => {
    var _currentSong$track, _playingInfo$songOnPl2, _playingInfo$songOnPa2, _currentSong$track2, _currentSong$track2$a, _currentSong$album;

    const singerInfo = (currentSong === null || currentSong === void 0 ? void 0 : currentSong.singer) || (currentSong === null || currentSong === void 0 ? void 0 : (_currentSong$track = currentSong.track) === null || _currentSong$track === void 0 ? void 0 : _currentSong$track.singer) || [];
    const coverClassName = isCoverPlayer ? 'cover' : '';
    const isLocalSong = !!(currentSong && (currentSong.isLocal || currentSong.isWebDav || currentSong.localFilePath || (typeof currentSong.mid === 'string' && (currentSong.mid.startsWith('local_') || currentSong.mid.startsWith('webdav_')))));
    const disabled = !(playingInfo !== null && playingInfo !== void 0 && (_playingInfo$songOnPl2 = playingInfo.songOnPlaying) !== null && _playingInfo$songOnPl2 !== void 0 && _playingInfo$songOnPl2.id || playingInfo !== null && playingInfo !== void 0 && (_playingInfo$songOnPa2 = playingInfo.songOnPause) !== null && _playingInfo$songOnPa2 !== void 0 && _playingInfo$songOnPa2.id || currentSong !== null && currentSong !== void 0 && currentSong.id);
    const disabledClass = (disabled || isLocalSong) ? 'disabled' : '';
    return /*#__PURE__*/react.createElement("div", {
      className: "player_cont_left"
    }, !isCoverPlayer && /*#__PURE__*/react.createElement("img", {
      alt: null,
      src: ((currentSong && currentSong.album && (currentSong.album.pic || currentSong.album.picurl)) || (currentSong && (currentSong.pic || currentSong.picurl)) || utils/* default.getAlbumPic */.ZP.getAlbumPic((currentSong === null || currentSong === void 0 ? void 0 : (_currentSong$track2 = currentSong.track) === null || _currentSong$track2 === void 0 ? void 0 : (_currentSong$track2$a = _currentSong$track2.album) === null || _currentSong$track2$a === void 0 ? void 0 : _currentSong$track2$a.mid) || (currentSong === null || currentSong === void 0 ? void 0 : (_currentSong$album = currentSong.album) === null || _currentSong$album === void 0 ? void 0 : _currentSong$album.mid) || null, 300)),
      className: "player_cont_album_img",
      onError: ev => (0,tools/* handleImgLoadErr */.GR)(tools/* IMG_TYPE.ALBUM */.Oe.ALBUM, ev),
      onClick: toShowCoverPlayPage
    }), /*#__PURE__*/react.createElement("div", {
      className: "player_cont_state"
    }, !isCoverPlayer && /*#__PURE__*/react.createElement("div", {
      className: "player_cont_state_inline"
    }, /*#__PURE__*/react.createElement("span", {
      className: "player_cont_state_inline_name",
      onClick: jumpToAlbumDetail
    }, currentSong && currentSong.title.replace(/<\/?[^>]*>/g, '') || '', " ", !disabled && '-'), singerInfo.map((item, idx) => {
      return /*#__PURE__*/react.createElement("span", {
        key: idx,
        className: "player_cont_state_inline_desc",
        onClick: e => jumpSinger(e, item.mid)
      }, item.name.replace(/<\/?[^>]*>/g, ''), " ", idx != singerInfo.length - 1 && '/');
    })), /*#__PURE__*/react.createElement("div", {
      className: `player_cont_state_tool ${isCoverPlayer ? 'player_cont_state_tool--cover' : ''}`
    }, /*#__PURE__*/react.createElement("a", {
      className: `action_button ${disabledClass} ${coverClassName} c_txt2 player_cont_state_tool_love ${currentSong !== null && currentSong !== void 0 && currentSong.like && !isLocalSong ? 'player_cont_state_tool_love--loved' : ''}`,
      style: isLocalSong ? { pointerEvents: 'none', opacity: 0.35, cursor: 'not-allowed' } : undefined,
      onClick: isLocalSong ? undefined : toSwitchSongLikeState
    }), /*#__PURE__*/react.createElement("a", {
      className: `action_button ${disabledClass} player_cont_state_tool_menu c_txt2 ${coverClassName}`,
      style: isLocalSong ? { pointerEvents: 'none', opacity: 0.35, cursor: 'not-allowed' } : undefined,
      onClick: isLocalSong ? undefined : showContextMenu
    }), /*#__PURE__*/react.createElement("a", {
      className: `action_button ${disabledClass} c_txt2 player_cont_state_tool_comment`,
      style: isLocalSong ? { pointerEvents: 'none', opacity: 0.35, cursor: 'not-allowed' } : undefined,
      onClick: isLocalSong ? undefined : () => {
        (0,jump/* default */.Z)(jump/* PAGE_TYPE.SONG */.G.SONG, {
          id: currentSong.id,
          type: currentSong.type
        });
      }
    }), isCoverPlayer && /*#__PURE__*/react.createElement("span", {
      className: "player_time player_time--cover c_txt2"
    }, `${(0,utils/* translateTime */.xj)(currentPlaytime)}/${(0,utils/* translateTime */.xj)(duration)}`))));
  };
  /**
   * 播放进度条
   */


  const renderBtnList = () => {
    var _configMode$find;

    let configMode = NORMAL_CONFIG_MODE;

    if (LogicalPlayer.isRadioMode) {
      configMode = RADIO_CONFIG_MODE;
    }

    const classMode = (_configMode$find = configMode.find(_ => _.mode === playMode)) === null || _configMode$find === void 0 ? void 0 : _configMode$find.className;
    const coverClassName = isCoverPlayer ? 'cover' : '';
    const modePopOverContent = /*#__PURE__*/react.createElement("ul", {
      className: "player_mode_popover__content c_bg4 c_txt1"
    }, configMode.map((item, index) => {
      return /*#__PURE__*/react.createElement("a", {
        className: "player_mode_popover_list__item",
        key: index,
        onClick: () => switchPlayMode(item.mode)
      }, /*#__PURE__*/react.createElement("span", {
        className: `list_item_icon ${item.className}`
      }), /*#__PURE__*/react.createElement("span", null, item.title), /*#__PURE__*/react.createElement("div", {
        className: "common_hover__bg c_bg_normal"
      }));
    }));
    const voicePopoverContent = /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
      className: "player_voice_slider__wrapper c_bg4 c_txt1",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
      }
    }, /*#__PURE__*/react.createElement(slider/* default */.Z, {
      vertical: true,
      defaultValue: volume,
      value: volume,
      onAfterChange: handleVolumeAfterSlide,
      onChange: handleVolumeSlideChange,
      className: "volume_slider"
    }), /*#__PURE__*/react.createElement("div", {
      className: "player_voice_value c_txt1"
    }, `${volume}%`), /*#__PURE__*/react.createElement("div", {
      className: "player_voice_split c_bg2"
    }), /*#__PURE__*/react.createElement("div", {
      className: "player_voice_icon c_txt2"
    }, /*#__PURE__*/react.createElement("a", {
      className: `svg_icon_btn voice ${isMuted ? 'muted' : ''}`,
      onClick: () => switchPlayerMuteState(!isMuted)
    }, isMuted ? /*#__PURE__*/react.createElement(VoiceSilence, {
      width: 23,
      height: 23
    }) : /*#__PURE__*/react.createElement(VoiceNormal, {
      width: 23,
      height: 23
    }), /*#__PURE__*/react.createElement("span", {
      className: "mutex"
    }, isMuted && /*#__PURE__*/react.createElement(VoiceMuteX, {
      width: 23,
      height: 23
    }))))));
    return /*#__PURE__*/react.createElement("div", {
      className: `player_btn_list`
    }, /*#__PURE__*/react.createElement(popover/* default */.Z, {
      content: modePopOverContent,
      trigger: "click",
      visible: isPlayModePopoverVisible,
      onVisibleChange: setModePopoverVisible
    }, /*#__PURE__*/react.createElement("a", {
      className: `action_button player_btn_list_mode ${classMode ? classMode : 'player_mode_dialog_list_mode--list'} ${coverClassName}`,
      onClick: ev => {
        ev.preventDefault();
        ev.stopPropagation();
        setModePopoverVisible(!isPlayModePopoverVisible);
      }
    })), /*#__PURE__*/react.createElement("a", {
      className: `action_button player_btn_list_prefore ${coverClassName}`,
      onClick: () => LogicalPlayer.playPrev()
    }), playState === types/* PLAY_STATE.PLAYING */.tJ.PLAYING ? /*#__PURE__*/react.createElement("a", {
      className: `action_button player_btn_list_pause ${coverClassName ? 'player_btn_list_pause--white' : ''}`,
      onClick: () => {
        LogicalPlayer.pause();
      }
    }) : /*#__PURE__*/react.createElement("a", {
      className: `action_button player_btn_list_play ${coverClassName}`,
      onClick: () => {
        if (currentSong && (currentSong.id || currentSong.mid)) {
          LogicalPlayer.resume(currentSong);
        } else {
          LogicalPlayer.resume();
        }
      }
    }), /*#__PURE__*/react.createElement("a", {
      className: `action_button player_btn_list_next ${coverClassName} `,
      onClick: () => {
        LogicalPlayer.playNext();
      }
    }), /*#__PURE__*/react.createElement(popover/* default */.Z, {
      content: voicePopoverContent,
      trigger: "click",
      visible: isVolumePopoverVisible,
      onVisibleChange: setVolumePopoverVisible
    }, /*#__PURE__*/react.createElement("a", {
      className: `svg_icon_btn voice c_txt1 ${isMuted ? 'muted' : ''} ${coverClassName}`,
      onClick: ev => {
        ev.preventDefault();
        ev.stopPropagation();
        setVolumePopoverVisible(!isVolumePopoverVisible);
      }
    }, isMuted ? /*#__PURE__*/react.createElement(VoiceSilence, {
      width: 23,
      height: 23
    }) : /*#__PURE__*/react.createElement(VoiceNormal, {
      width: 23,
      height: 23
    }), /*#__PURE__*/react.createElement("span", {
      className: "mutex"
    }, isMuted && /*#__PURE__*/react.createElement(VoiceMuteX, {
      width: 23,
      height: 23
    })))));
  };
  /**
   * 播放进度条
   */


  const renderRight = () => {
    var _playingInfo$songList;
    const [displayQuality, setDisplayQuality] = (0,react.useState)((typeof window !== "undefined" && window.__CURRENT_PLAYING_QUALITY__) || "SQ");
    const [audioMetrics, setAudioMetrics] = (0,react.useState)((typeof window !== "undefined" && window.__CURRENT_AUDIO_METRICS__) || null);
    const [activeSong, setActiveSong] = (0,react.useState)(currentSong);
    const [isQualityPopoverVisible, setQualityPopoverVisible] = (0,react.useState)(false);
    const [probedList, setProbedList] = (0,react.useState)(() => {
      const pMid = (currentSong && ((currentSong.track && currentSong.track.mid) || currentSong.mid)) || "";
      return (typeof window !== "undefined" && window.__PROBED_QUALITIES_MAP__ && window.__PROBED_QUALITIES_MAP__[pMid]) || null;
    });

    (0,react.useEffect)(() => {
      const qHandler = (e) => {
        setDisplayQuality(e.detail);
      };
      const mHandler = (e) => {
        setAudioMetrics(e.detail);
        if (e.detail && e.detail.song) {
          setActiveSong(e.detail.song);
        }
        if (e.detail && e.detail.probedQualities) {
          setProbedList(e.detail.probedQualities);
        }
      };
      const pHandler = (e) => {
        if (e.detail && e.detail.qualities) {
          setProbedList(e.detail.qualities);
        }
      };
      window.addEventListener && window.addEventListener("qqmusic_quality_change", qHandler);
      window.addEventListener && window.addEventListener("qqmusic_metrics_update", mHandler);
      window.addEventListener && window.addEventListener("qqmusic_qualities_probed", pHandler);
      return () => {
        window.removeEventListener && window.removeEventListener("qqmusic_quality_change", qHandler);
        window.removeEventListener && window.removeEventListener("qqmusic_metrics_update", mHandler);
        window.removeEventListener && window.removeEventListener("qqmusic_qualities_probed", pHandler);
      };
    }, []);

    const player = (typeof window !== "undefined" && window.__QQMUSIC_PLAYER_INSTANCE__);
    const song = activeSong || (player && player.currentSong) || currentSong;
    const file = (song && (song.file || (song.track && song.track.file))) || {};
    const mid = (song && ((song.track && song.track.mid) || song.mid)) || "";

    (0,react.useEffect)(() => {
      if (isQualityPopoverVisible && mid && (!probedList || probedList.length === 0)) {
        if (player && typeof player.probeSongQualities === 'function') {
          player.probeSongQualities(song).then(list => {
            if (Array.isArray(list) && list.length > 0) {
              setProbedList(list);
            }
          }).catch(() => {});
        }
      }
    }, [isQualityPopoverVisible, mid]);

    const isMetricsForThisSong = Boolean(audioMetrics && audioMetrics.songMid && audioMetrics.songMid === mid);

    const isLocalOrWebDav = Boolean(
      song && (
        song.isLocal || song.isWebDav || song.localFilePath ||
        (song.url && (song.url.indexOf('file:') === 0 || song.url.indexOf('http://127.0.0.1:') === 0)) ||
        (typeof song.mid === 'string' && (song.mid.startsWith('local_') || song.mid.startsWith('webdav_')))
      )
    );

    // 针对本地和 WebDAV，精确推导当前档次与实测码率
    let localCurrentQuality = displayQuality || "SQ";
    let localBitrateStr = (audioMetrics && audioMetrics.bitrateStr) || "";
    if (isLocalOrWebDav) {
      const rawHref = (song && (song.webDavHref || song.localFilePath || song.url)) || '';
      const cleanPath = rawHref.split('?')[0];
      const ext = cleanPath.split('.').pop().toLowerCase();
      const isLossless = ['flac', 'wav', 'ape', 'dts', 'dsd', 'dsf', 'dff'].includes(ext);
      const isHires = Boolean(
        song.isHires ||
        (Number(file.size_hires) > 0) ||
        (Number(file.size_96flac) > 0) ||
        (Number(file.size_24bit) > 0) ||
        (Number(file.hires_bitdepth) > 16) ||
        (Number(file.hires_sample) > 48000) ||
        (Number(song.bitDepth) > 16) ||
        (Number(song.sampleRate) > 48000)
      );

      const duration = song.interval || (player && player.audio && player.audio.duration) || 0;
      const fileSize = song.contentLength || song.fileSize || Number(file.size) || 0;
      let calculatedKbps = 0;
      if (fileSize > 0 && duration > 0) {
        calculatedKbps = Math.round((fileSize * 8) / (duration * 1000));
      }

      if (isHires) {
        localCurrentQuality = "Hi-Res";
        if (!localBitrateStr) localBitrateStr = calculatedKbps > 0 ? `${calculatedKbps}kbps` : "24bit/96kHz";
      } else if (isLossless) {
        localCurrentQuality = "SQ";
        if (!localBitrateStr) localBitrateStr = calculatedKbps > 0 ? `${calculatedKbps}kbps` : "16bit/44.1kHz";
      } else if (calculatedKbps >= 280 || (rawHref.toLowerCase().includes('320k'))) {
        localCurrentQuality = "HQ";
        if (!localBitrateStr) localBitrateStr = calculatedKbps > 0 ? `${calculatedKbps}kbps` : "320kbps";
      } else {
        localCurrentQuality = "标准";
        if (!localBitrateStr) localBitrateStr = calculatedKbps > 0 ? `${calculatedKbps}kbps` : "128kbps";
      }
    }

    const currentActiveQuality = isLocalOrWebDav ? localCurrentQuality : displayQuality;

    // 提取探测缓存或元数据可用性
    const getProbedItem = (key) => {
      if (Array.isArray(probedList)) {
        return probedList.find(p => p.key === key);
      }
      return null;
    };

    // 权威精准判定各音质在服务器中是否存在 (支持 0/1/2/3 与 13/14/15/16 索引)
    const rawHasMaster = Boolean(Array.isArray(file.size_new) && (Number(file.size_new[0]) > 0 || Number(file.size_new[13]) > 0));
    const rawHasDeluxe = Boolean(Array.isArray(file.size_new) && (Number(file.size_new[1]) > 0 || Number(file.size_new[14]) > 0));
    const rawHasAtmos51 = Boolean(Array.isArray(file.size_new) && (Number(file.size_new[2]) > 0 || Number(file.size_new[15]) > 0));
    const rawHasAtmos71 = Boolean(Array.isArray(file.size_new) && (Number(file.size_new[3]) > 0 || Number(file.size_new[16]) > 0));
    const rawHasDolby = Boolean(Number(file.size_dolby) > 0 || (Array.isArray(file.size_new) && Number(file.size_new[17]) > 0));
    const rawHasHires = Boolean(
      (Number(file.size_hires) > 0) ||
      (Number(file.size_96flac) > 0) ||
      (Number(file.size_24bit) > 0) ||
      (Number(file.hires_bitdepth) > 16) ||
      (Number(file.hires_sample) > 48000) ||
      (Array.isArray(file.size_new) && Number(file.size_new[11]) > 0)
    );
    const rawHasSQ = Boolean(
      (Number(file.size_flac) > 0) ||
      (Number(file.size_ape) > 0) ||
      (Number(file.size_dts) > 0) ||
      (Array.isArray(file.size_new) && Number(file.size_new[12]) > 0) ||
      rawHasHires
    );
    const rawHasHQ = Boolean(
      (Number(file.size_320mp3) > 0) ||
      (Array.isArray(file.size_new) && Number(file.size_new[3]) > 0) ||
      rawHasSQ
    );

    const checkAvailable = (key, rawFallback) => {
      if (isLocalOrWebDav) {
        return currentActiveQuality === (key === "hires" ? "Hi-Res" : key === "flac" ? "SQ" : key === "320k" ? "HQ" : "标准");
      }
      const probed = getProbedItem(key);
      if (probed && typeof probed.isAvailable === "boolean") {
        return probed.isAvailable;
      }
      return rawFallback;
    };

    // 统一显示规则：音质级别名称 (位深/kHz) [kbps]
    const formatOptionTitle = (key, optName, specStr, defaultKbps, isAvail) => {
      const isCurrentPlaying = currentActiveQuality === optName;
      const probed = getProbedItem(key);
      const measuredRate = (isCurrentPlaying && ((audioMetrics && audioMetrics.bitrateStr) || localBitrateStr)) ||
                           (probed && probed.bitrateStr) ||
                           "";

      const finalRateStr = (measuredRate && measuredRate !== "0kbps") ? measuredRate : `${defaultKbps}kbps`;

      if (isCurrentPlaying) {
        return `${optName} (${specStr}) [${finalRateStr}]`;
      }
      if (!isAvail) {
        return isLocalOrWebDav ? `${optName} (${specStr}) (单规格音频)` : `${optName} (${specStr}) (无音源)`;
      }
      return `${optName} (${specStr}) [${finalRateStr}]`;
    };

    const qualityOptions = [
      {
        key: "master",
        name: "母带",
        tag: "母带",
        available: checkAvailable("master", rawHasMaster),
        title: formatOptionTitle("master", "母带", "24bit / 192kHz", 4608, checkAvailable("master", rawHasMaster)),
        color: "#f59e0b"
      },
      {
        key: "deluxe",
        name: "臻品",
        tag: "臻品",
        available: checkAvailable("deluxe", rawHasDeluxe),
        title: formatOptionTitle("deluxe", "臻品", "24bit / 96kHz", 1720, checkAvailable("deluxe", rawHasDeluxe)),
        color: "#6366f1"
      },
      {
        key: "atmos51",
        name: "5.1",
        tag: "5.1",
        available: checkAvailable("atmos51", rawHasAtmos51),
        title: formatOptionTitle("atmos51", "5.1", "24bit / 48kHz", 2800, checkAvailable("atmos51", rawHasAtmos51)),
        color: "#06b6d4"
      },
      {
        key: "atmos71",
        name: "7.1",
        tag: "7.1",
        available: checkAvailable("atmos71", rawHasAtmos71),
        title: formatOptionTitle("atmos71", "7.1", "24bit / 48kHz", 3200, checkAvailable("atmos71", rawHasAtmos71)),
        color: "#0ea5e9"
      },
      {
        key: "dolby",
        name: "杜比",
        tag: "杜比",
        available: checkAvailable("dolby", rawHasDolby),
        title: formatOptionTitle("dolby", "杜比", "16bit / 48kHz", 768, checkAvailable("dolby", rawHasDolby)),
        color: "#8b5cf6"
      },
      {
        key: "hires",
        name: "Hi-Res",
        tag: "Hi-Res",
        available: checkAvailable("hires", rawHasHires),
        title: formatOptionTitle("hires", "Hi-Res", "24bit / 96kHz", 2304, checkAvailable("hires", rawHasHires)),
        color: "#e5a93c"
      },
      {
        key: "flac",
        name: "SQ",
        tag: "SQ",
        available: checkAvailable("flac", rawHasSQ),
        title: formatOptionTitle("flac", "SQ", "16bit / 44.1kHz", 860, checkAvailable("flac", rawHasSQ)),
        color: "#1ecc94"
      },
      {
        key: "320k",
        name: "HQ",
        tag: "HQ",
        available: checkAvailable("320k", rawHasHQ),
        title: formatOptionTitle("320k", "HQ", "16bit / 44.1kHz", 320, checkAvailable("320k", rawHasHQ)),
        color: "#10b981"
      },
      {
        key: "128k",
        name: "标准",
        tag: "标准",
        available: true,
        title: formatOptionTitle("128k", "标准", "16bit / 44.1kHz", 128, true),
        color: "#9ca3af"
      }
    ];

    const handleSelectQuality = async (targetKey) => {
      setQualityPopoverVisible(false);
      if (isLocalOrWebDav) return;
      if (window.__qmtuiBridgeInstalled) {
        const tiers = { "128k": 0, "320k": 1, flac: 2, hires: 3, dolby: 4, atmos71: 5, atmos51: 6, deluxe: 7, master: 8 };
        fetch("/api/quality", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier: tiers[targetKey] || 0 }) }).catch(() => {});
        return;
      }
      
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("qqmusic_quality", targetKey);
      }

      try {
        if (player && player.currentSong && player.audio) {
          const wasPaused = player.audio.paused;
          const curTime = player.audio.currentTime || 0;
          const [res] = await player.generateVKey([player.currentSong], targetKey);
          if (res && res.url) {
            player.audio.src = res.url;
            player.audio.currentTime = curTime;
            if (!wasPaused) {
              player.audio.play().catch(() => {});
            }
            const actualName = res.quality || (
              targetKey === "master" ? "母带" :
              targetKey === "deluxe" ? "臻品" :
              targetKey === "atmos51" ? "5.1" :
              targetKey === "atmos71" ? "7.1" :
              targetKey === "dolby" ? "杜比" :
              targetKey === "hires" ? "Hi-Res" :
              targetKey === "flac" ? "SQ" :
              targetKey === "320k" ? "HQ" : "标准"
            );
            setDisplayQuality(actualName);
          }
        }
      } catch(err) {}
    };

    const isDark = isDarkTheme();
    const qualityPopoverContent = /*#__PURE__*/react.createElement("div", {
      className: "quality_popover_content",
      style: {
        padding: "4px 0",
        minWidth: "260px",
        borderRadius: "8px",
        backgroundColor: isDark ? "#202227" : "#ffffff",
        boxShadow: isDark ? "0 8px 24px rgba(0, 0, 0, 0.55)" : "0 8px 24px rgba(0, 0, 0, 0.12)",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.08)",
        overflow: "hidden"
      }
    }, qualityOptions.map(opt => {
      const isSelected = currentActiveQuality === opt.name;
      const isAvail = opt.available;

      return /*#__PURE__*/react.createElement("div", {
        key: opt.key,
        onClick: (e) => {
          if (!isAvail) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          handleSelectQuality(opt.key);
        },
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 12px",
          cursor: isAvail ? "pointer" : "not-allowed",
          opacity: isAvail ? 1 : (isDark ? 0.35 : 0.4),
          filter: isAvail ? "none" : "grayscale(100%)",
          backgroundColor: isSelected ? (isDark ? "rgba(30, 204, 148, 0.14)" : "rgba(30, 204, 148, 0.12)") : "transparent",
          color: isSelected ? (isDark ? "#ffffff" : "#047857") : isAvail ? (isDark ? "rgba(255, 255, 255, 0.85)" : "#111827") : (isDark ? "#71717a" : "#9ca3af"),
          transition: "background 0.15s ease",
          fontSize: "12.5px",
          userSelect: "none"
        },
        onMouseEnter: e => {
          if (isAvail) {
            e.currentTarget.style.backgroundColor = isSelected ? (isDark ? "rgba(30, 204, 148, 0.22)" : "rgba(30, 204, 148, 0.20)") : (isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)");
          }
        },
        onMouseLeave: e => {
          if (isAvail) {
            e.currentTarget.style.backgroundColor = isSelected ? (isDark ? "rgba(30, 204, 148, 0.14)" : "rgba(30, 204, 148, 0.12)") : "transparent";
          }
        }
      }, /*#__PURE__*/react.createElement("div", {
        style: { display: "flex", alignItems: "center", gap: "8px" }
      }, /*#__PURE__*/react.createElement("span", {
        style: {
          fontSize: "10px",
          fontWeight: "bold",
          padding: "1px 5px",
          borderRadius: "3px",
          border: isAvail ? `1px solid ${opt.color}` : (isDark ? "1px solid #3f3f46" : "1px solid #e5e7eb"),
          color: isAvail ? opt.color : (isDark ? "#71717a" : "#9ca3af"),
          background: isAvail ? (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.03)") : (isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)"),
          lineHeight: "13px",
          display: "inline-block",
          minWidth: "42px",
          textAlign: "center"
        }
      }, opt.tag), /*#__PURE__*/react.createElement("span", {
        style: {
          fontWeight: isSelected ? "600" : "400",
          color: isSelected ? opt.color : isAvail ? (isDark ? "rgba(255,255,255,0.85)" : "#111827") : (isDark ? "#71717a" : "#9ca3af"),
          fontSize: "12px",
          fontVariantNumeric: "tabular-nums"
        }
      }, opt.title)), isSelected && /*#__PURE__*/react.createElement("span", {
        style: { color: opt.color, fontWeight: "bold", marginLeft: "10px", fontSize: "13px" }
      }, "✓"));
    }));

    const activeOpt = qualityOptions.find(o => o.name === currentActiveQuality);
    const badgeColor = (activeOpt && activeOpt.color) || (currentActiveQuality === "Hi-Res" ? "#e5a93c" : "#1ecc94");

    const currentBadgeTitle = (audioMetrics && audioMetrics.bitrateStr) ? `当前实测: ${audioMetrics.bitrateStr}` : (localBitrateStr ? `当前实际码率: ${localBitrateStr}` : "点击选择音质");

    return /*#__PURE__*/react.createElement("div", {
      className: "player_cont_right",
      style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px", marginRight: 0 }
    }, /*#__PURE__*/react.createElement(popover/* default */.Z, {
      content: qualityPopoverContent,
      trigger: "click",
      placement: "topRight",
      visible: isQualityPopoverVisible,
      onVisibleChange: setQualityPopoverVisible
    }, /*#__PURE__*/react.createElement("span", {
      className: "player_quality_badge",
      onClick: ev => {
        ev.preventDefault();
        ev.stopPropagation();
        setQualityPopoverVisible(!isQualityPopoverVisible);
      },
      title: currentBadgeTitle,
      style: {
        display: "inline-block",
        fontSize: "11px",
        fontWeight: "bold",
        padding: "2px 7px",
        borderRadius: "4px",
        border: `1px solid ${badgeColor}`,
        color: badgeColor,
        cursor: "pointer",
        userSelect: "none",
        lineHeight: "15px",
        background: `${badgeColor}26`,
        transition: "all 0.2s"
      }
    }, currentActiveQuality)), /*#__PURE__*/react.createElement("div", {
      className: "player_cont_list",
      onClick: switchPlaylistVisibleState,
      style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", color: "#1ecc94" }
    }, /*#__PURE__*/react.createElement("a", {
      className: "player_list_img",
      style: { color: "#1ecc94" }
    }), /*#__PURE__*/react.createElement("span", {
      className: "player_list_number",
      style: { color: "#1ecc94", fontSize: "13px", fontWeight: "600" }
    }, (playingInfo === null || playingInfo === void 0 ? void 0 : (_playingInfo$songList = playingInfo.songList) === null || _playingInfo$songList === void 0 ? void 0 : _playingInfo$songList.length) || 0)));
  };

  return /*#__PURE__*/react.createElement(react.Fragment, null, isPlayListVisible && /*#__PURE__*/react.createElement("div", {
    className: "player_voice_dialog--shadow",
    onClick: switchPlaylistVisibleState
  }), (isPlayModePopoverVisible || isVolumePopoverVisible) && /*#__PURE__*/react.createElement("div", {
    className: "player_voice_dialog--shadow",
    onClick: hidePopoverWindow,
    onWheel: handleWheelOnShadowWindow
  }), renderProcess(), /*#__PURE__*/react.createElement("div", {
    className: "player_cont"
  }, renderLeft(), renderBtnList(), renderRight()));
};
// EXTERNAL MODULE: ./node_modules/react-virtualized/styles.css
var styles = __webpack_require__(35012);
// EXTERNAL MODULE: ./node_modules/react-virtualized/dist/es/index.js + 69 modules
var es = __webpack_require__(80376);
// EXTERNAL MODULE: ./src/pages/main/css/playlist.less
var playlist = __webpack_require__(93128);
// EXTERNAL MODULE: ./src/lib/common/login.ts
var login = __webpack_require__(68010);
;// CONCATENATED MODULE: ./src/component/play_list/index.tsx











const play_list_player = players/* default.getInstance */.Z.getInstance();
/**
 * 这个是播放列表组件
 * @param isVisible
 * @param switchPlayListVisibleState
 * @constructor
 */

const PlayList = ({
  isVisible,
  switchPlayListVisibleState
}) => {
  let hasBindEvent = false;
  const playListWrapperRef = /*#__PURE__*/react.createRef();
  const [wrapperSize, setWrapperSize] = (0,react.useState)({
    width: 0,
    height: 0
  });
  const [playingInfo] = (0,stook_esm/* useStore */.oR)('PlayingStore');

  const handleInvokeContextMenu = ev => {
    ev.preventDefault();
  };

  const toPlayThisSong = index => {
    var _playingInfo$songOnPl, _playingInfo$songOnPa;

    const songToAction = playingInfo === null || playingInfo === void 0 ? void 0 : playingInfo.songList[index];

    if ((playingInfo === null || playingInfo === void 0 ? void 0 : (_playingInfo$songOnPl = playingInfo.songOnPlaying) === null || _playingInfo$songOnPl === void 0 ? void 0 : _playingInfo$songOnPl.id) === (songToAction === null || songToAction === void 0 ? void 0 : songToAction.id)) {
      play_list_player.pause();
    } else if ((playingInfo === null || playingInfo === void 0 ? void 0 : (_playingInfo$songOnPa = playingInfo.songOnPause) === null || _playingInfo$songOnPa === void 0 ? void 0 : _playingInfo$songOnPa.id) === (songToAction === null || songToAction === void 0 ? void 0 : songToAction.id)) {
      play_list_player.resume();
    } else if (!!login/* default.getUin */.Z.getUin()) {
      play_list_player.play({
        song: songToAction,
        index
      });
    }
  };

  const invokeMoreAction = (ev, song, index) => {
    (0,context_menu/* showMenu */.A)(ev, {
      songList: playingInfo.songList,
      songOnSelected: [song],
      index
    }, {
      isPlayAll: true
    });
  };

  const toSwitchLikeStatus = song => {
    (0,assets/* switchLikeState */.Mb)(song);
  };

  (0,react.useEffect)(() => {
    handleWindowResize();
  }, [playListWrapperRef.current]);
  (0,react.useEffect)(() => {
    if (!hasBindEvent) {
      window.addEventListener('resize', handleWindowResize);
      hasBindEvent = true;
      qmfeUnityReport/* default.reportExposureElement */.ZP.reportExposureElement(qmfeUnityReport/* ELEMENT_ID.PLAY_QUEUE_EXPOSURE */.AL.PLAY_QUEUE_EXPOSURE);
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const handleWindowResize = () => {
    if (playListWrapperRef.current) {
      setWrapperSize({
        width: playListWrapperRef.current.clientWidth,
        height: playListWrapperRef.current.clientHeight
      });
    }
  };

  const renderRow = ({
    key,
    index,
    style
  }) => {
    var _playingInfo$songOnPl2, _playingInfo$songOnPa2, _song$track, _song$track3, _ref, _song$track4, _song$track5;

    const song = playingInfo === null || playingInfo === void 0 ? void 0 : playingInfo.songList[index];
    const isThisSongOnPlaying = (song === null || song === void 0 ? void 0 : song.id) === (playingInfo === null || playingInfo === void 0 ? void 0 : (_playingInfo$songOnPl2 = playingInfo.songOnPlaying) === null || _playingInfo$songOnPl2 === void 0 ? void 0 : _playingInfo$songOnPl2.id);
    const isThisSongOnPause = (song === null || song === void 0 ? void 0 : song.id) === (playingInfo === null || playingInfo === void 0 ? void 0 : (_playingInfo$songOnPa2 = playingInfo.songOnPause) === null || _playingInfo$songOnPa2 === void 0 ? void 0 : _playingInfo$songOnPa2.id);
    let icon = null;

    if (song !== null && song !== void 0 && (_song$track = song.track) !== null && _song$track !== void 0 && _song$track.file || song !== null && song !== void 0 && song.file) {
      var _song$track2;

      const fileInfo = (song === null || song === void 0 ? void 0 : (_song$track2 = song.track) === null || _song$track2 === void 0 ? void 0 : _song$track2.file) || (song === null || song === void 0 ? void 0 : song.file);

      if ((fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.size_dts) > 0) {
        icon = /*#__PURE__*/react.createElement("i", {
          className: "tag_51 icon_skin c_bg_skin js_quality_icon",
          "data-type": "3"
        });
      } else if ((fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.size_ape) > 0 || (fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.size_flac) > 0) {
        icon = /*#__PURE__*/react.createElement("i", {
          className: "tag_sq icon_skin js_quality_icon",
          "data-type": "2"
        });
      } else if ((fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.size_320mp3) > 0) {
        icon = /*#__PURE__*/react.createElement("i", {
          className: "tag_hq icon_skin c_bg_skin js_quality_icon",
          "data-type": "1"
        });
      }
    }

    return /*#__PURE__*/react.createElement("li", {
      style: style,
      key: key,
      className: `playlist_list_item c_b_normal${isThisSongOnPlaying ? ' play' : ''}${isThisSongOnPause ? ' pause' : ''}`,
      onContextMenu: handleInvokeContextMenu,
      onDoubleClick: () => toPlayThisSong(index)
    }, /*#__PURE__*/react.createElement("div", {
      className: "playlist_list_item_songname"
    }, /*#__PURE__*/react.createElement("div", {
      className: "playlist_list_item_songname___tit"
    }, (song === null || song === void 0 ? void 0 : song.title) || (song === null || song === void 0 ? void 0 : (_song$track3 = song.track) === null || _song$track3 === void 0 ? void 0 : _song$track3.title)), /*#__PURE__*/react.createElement("div", {
      className: "playlist_list_item_songname___icon"
    }, icon), isThisSongOnPlaying && /*#__PURE__*/react.createElement("div", {
      className: "action_button playing_item_icon"
    })), /*#__PURE__*/react.createElement("div", {
      className: "playlist_list_item_desc"
    }, /*#__PURE__*/react.createElement("div", {
      className: "playlist_list_item_singer"
    }, (_ref = (song === null || song === void 0 ? void 0 : (_song$track4 = song.track) === null || _song$track4 === void 0 ? void 0 : _song$track4.singer) || (song === null || song === void 0 ? void 0 : song.singer)) === null || _ref === void 0 ? void 0 : _ref.map(singer => singer.name).join(' / ')), /*#__PURE__*/react.createElement("div", {
      className: "playlist_list_item_time"
    }, (0,utils/* translateTime */.xj)((song === null || song === void 0 ? void 0 : (_song$track5 = song.track) === null || _song$track5 === void 0 ? void 0 : _song$track5.interval) || (song === null || song === void 0 ? void 0 : song.interval) || 0))), /*#__PURE__*/react.createElement("div", {
      className: "playlist_menu",
      style: {
        display: isThisSongOnPlaying || isThisSongOnPause ? 'flex' : ''
      }
    }, isThisSongOnPlaying ? /*#__PURE__*/react.createElement("a", {
      className: "playlist_menu__item playlist_menu__pause icon_skin c_tx_thin",
      onClick: () => {
        play_list_player.pause();
      }
    }, "\u6682\u505C") : /*#__PURE__*/react.createElement("a", {
      className: "playlist_menu__item playlist_menu__play icon_skin c_tx_thin",
      onClick: () => toPlayThisSong(index)
    }, "\u64AD\u653E"), /*#__PURE__*/react.createElement("a", {
      className: `playlist_menu__item playlist__icon_love icon_skin c_tx_thin ${song !== null && song !== void 0 && song.like ? 'loved' : ''}`,
      onClick: () => toSwitchLikeStatus(song)
    }, "\u662F\u5426\u559C\u6B22"), /*#__PURE__*/react.createElement("a", {
      className: "playlist_menu__item playlist_menu__more icon_skin c_tx_thin",
      onClick: ev => invokeMoreAction(ev, song, index)
    }, "\u66F4\u591A\u64CD\u4F5C")), /*#__PURE__*/react.createElement("div", {
      className: "common_hover__bg c_bg_normal"
    }));
  };

  const renderList = () => {
    return /*#__PURE__*/react.createElement("ul", {
      className: "playlist_list",
      ref: playListWrapperRef
    }, /*#__PURE__*/react.createElement(es/* List */.aV, {
      rowCount: playingInfo === null || playingInfo === void 0 || !playingInfo.songList ? 0 : playingInfo.songList.length,
      rowHeight: 70,
      width: wrapperSize.width,
      height: wrapperSize.height,
      rowRenderer: renderRow
    }));
  };

  const handleBottomClick = () => {
    switchPlayListVisibleState && switchPlayListVisibleState(false);
  };

  const handleDeleteSongList = () => {
    play_list_player.clearPlayList();
  };

  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "playlist_cont c_bg4",
    style: {
      right: isVisible ? '0px' : '-100%'
    }
  }, /*#__PURE__*/react.createElement("div", {
    className: "playlist_cont_inner__wrapper"
  }, /*#__PURE__*/react.createElement("div", {
    className: "playlist_top"
  }, /*#__PURE__*/react.createElement("div", {
    className: "playlist_top_title"
  }, "\u64AD\u653E\u961F\u5217"), /*#__PURE__*/react.createElement("div", {
    className: "playlist_top_sub"
  }, /*#__PURE__*/react.createElement("div", {
    className: "playlist_top_sub_number"
  }, playingInfo === null || playingInfo === void 0 || !playingInfo.songList ? 0 : playingInfo.songList.length, "\u9996\u6B4C\u66F2"), /*#__PURE__*/react.createElement("a", {
    className: "delete_icon",
    onClick: handleDeleteSongList
  }))), (playingInfo === null || playingInfo === void 0 ? void 0 : playingInfo.songList) && renderList(), /*#__PURE__*/react.createElement("div", {
    className: "playlist_bottom",
    onClick: handleBottomClick
  }, /*#__PURE__*/react.createElement("a", {
    className: "player_list_img"
  }), /*#__PURE__*/react.createElement("a", {
    className: "player_list_number"
  }, "\u6536\u8D77")))));
};
;// CONCATENATED MODULE: ./src/pages/main/components/tab.tsx


const RecommendTab = () => /*#__PURE__*/react.createElement("div", {
  className: "tab_item_cont",
  onClick: () => {
    qmfeUnityReport/* default.reportClick */.ZP.reportClick(qmfeUnityReport/* CLICK_ID.ELECTRON_RECOMMEND_CLICK */.eF.ELECTRON_RECOMMEND_CLICK);
  }
}, /*#__PURE__*/react.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "15",
  height: "15",
  version: "1.1",
  viewBox: "0 -64 1024 1024",
  className: "tab_item_img"
}, /*#__PURE__*/react.createElement("g", {
  transform: "matrix(1 0 0 -1 0 960)"
}, /*#__PURE__*/react.createElement("path", {
  fill: "currentColor",
  d: "M512 1030q212 0 362 -150t150 -362.5t-150 -362t-362 -149.5t-362 149.5t-150 362t150 362.5t362 150zM533 840q-18 9 -37 2.5t-28 -24.5l-58 -120q-11 -23 -37 -27l-133 -19q-17 -2 -28 -14q-14 -15 -14 -35t15 -34l96 -93q19 -18 14 -44l-23 -131q-3 -17 5 -32 q9 -18 28.5 -23.5t37.5 3.5l118 63q23 12 46 0l118 -63q15 -8 31 -5q20 4 31.5 20.5t8.5 36.5l-23 131q-5 26 14 44l96 93q12 12 14 28q3 20 -9 36t-32 19l-133 19q-26 4 -37 27l-58 120q-8 15 -23 22z"
}))), "\u63A8\u8350");
function MusicRoomTab() {
  return /*#__PURE__*/react.createElement("div", {
    className: "tab_item_cont",
    onClick: () => {
      qmfeUnityReport/* default.reportClick */.ZP.reportClick(qmfeUnityReport/* CLICK_ID.ELECTRON_MUSIC_ROOM_CLICK */.eF.ELECTRON_MUSIC_ROOM_CLICK);
    }
  }, /*#__PURE__*/react.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "15",
    viewBox: "0 0 14 15",
    className: "tab_item_img"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M12 7.954V4.567L5 6.11v6.546C4.99 13.952 3.875 15 2.5 15 1.12 15 0 13.942 0 12.638c0-1.305 1.12-2.362 2.5-2.362.171 0 .338.016.5.047v-6.78A2 2 0 0 1 4.57 1.59l7-1.543a2 2 0 0 1 2.345 1.377c.055.124.085.26.085.404v8.67h-.001A2.504 2.504 0 0 1 11.5 12.92c-1.38 0-2.5-1.123-2.5-2.508a2.504 2.504 0 0 1 3-2.458z"
  })), "\u97F3\u4E50\u9986");
}
function VideoTab() {
  return /*#__PURE__*/react.createElement("div", {
    className: "tab_item_cont",
    onClick: () => {
      qmfeUnityReport/* default.reportClick */.ZP.reportClick(qmfeUnityReport/* CLICK_ID.ELECTRON_VIDEO_CLICK */.eF.ELECTRON_VIDEO_CLICK);
    }
  }, /*#__PURE__*/react.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "17",
    height: "13",
    viewBox: "0 0 17 13",
    className: "tab_item_img"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M14 4.751l1.96-1.618a.635.635 0 0 1 1.04.49v5.754a.635.635 0 0 1-1.028.499L14 8.326V11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2.751zM3 2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3zm1.767 1.25c.879 0 1.591.712 1.591 1.59v.07a1.59 1.59 0 0 1-3.182 0v-.07c0-.878.713-1.59 1.591-1.59z"
  })), "\u89C6\u9891");
}
function LikeTab() {
  return /*#__PURE__*/react.createElement("div", {
    className: "tab_item_cont",
    onClick: () => {
      qmfeUnityReport/* default.reportClick */.ZP.reportClick(qmfeUnityReport/* CLICK_ID.ELECTRON_FAVORITE_CLICK */.eF.ELECTRON_FAVORITE_CLICK);
    }
  }, /*#__PURE__*/react.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "14",
    viewBox: "0 0 16 14",
    className: "tab_item_img"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M7.113 1.247l.472.475c.107.112.21.218.409.42l.004-.004 1.147 1.156a.638.638 0 0 0 .905 0 .647.647 0 0 0 0-.912L8.877 1.2c2.647-2.655 7.902-.776 7.027 4.4-.457 2.705-6.372 7.375-6.372 7.375-.85.71-2.234.716-3.076.001 0 0-5.823-4.573-6.336-7.41-.28-1.559-.037-2.656.436-3.537C1.843-.374 5.22-.458 7.113 1.247z"
  })), "\u6211\u559C\u6B22");
}
function LocalMusicTab() {
  logInfo('[LocalMusic] LocalMusicTab rendered in sidebar');
  return /*#__PURE__*/react.createElement("div", {
    className: "tab_item_cont"
  }, /*#__PURE__*/react.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    className: "tab_item_img"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
  })), "\u672C\u5730\u97F3\u4E50");
}
function WebDavTab() {
  return /*#__PURE__*/react.createElement("div", {
    className: "tab_item_cont"
  }, /*#__PURE__*/react.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    className: "tab_item_img"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"
  })), "WebDAV");
}
function HistoryTab() {
  return /*#__PURE__*/react.createElement("div", {
    className: "tab_item_cont"
  }, /*#__PURE__*/react.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    className: "tab_item_img"
  }, /*#__PURE__*/react.createElement("path", {
    fill: "currentColor",
    d: "M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
  })), "最近播放");
}

function OnlineMusicTab() {
  return /*#__PURE__*/react.createElement("div", {
    className: "tab_item_cont c_txt2"
  }, /*#__PURE__*/react.createElement("div", {
    className: "tab_item_title"
  }, "\u5728\u7EBF\u97F3\u4E50"));
}
function MyMusicTab() {
  return /*#__PURE__*/react.createElement("div", {
    className: "tab_item_cont c_txt2"
  }, /*#__PURE__*/react.createElement("div", {
    className: "tab_item_title"
  }, "\u6211\u7684\u97F3\u4E50"));
}
// EXTERNAL MODULE: ./src/pages/search/css/search.less
var search = __webpack_require__(67800);
// EXTERNAL MODULE: ./node_modules/react-router-dom/esm/react-router-dom.js
var react_router_dom = __webpack_require__(73727);
// EXTERNAL MODULE: ./node_modules/react-router/esm/react-router.js
var react_router = __webpack_require__(16550);
// EXTERNAL MODULE: ./src/component/song_list/index.tsx + 1 modules
var song_list = __webpack_require__(57224);
// EXTERNAL MODULE: ./src/lib/network/index.ts + 1 modules
var network = __webpack_require__(32590);
// EXTERNAL MODULE: ./src/lib/network/search_api.ts
var search_api = __webpack_require__(940);
// EXTERNAL MODULE: ./src/lib/network/asset_api.ts
var asset_api = __webpack_require__(65972);
;// CONCATENATED MODULE: ./src/pages/search/component/Songlist/index.tsx








const SearchSongListConfig = {
  // 是否展示头部
  header: true,
  // 是否展示排序
  sort: false,
  // 展示number
  number: false,
  // 排名
  rank: false,
  // 速度
  speed: false,
  // 歌曲名字
  songname: true,
  // 歌手
  singer: true,
  // 专辑
  album: true,
  // 日期
  date: false,
  // 时长
  time: false,
  // 云
  cloud: false,
  // 电台
  isAudio: false,
  // 指数
  isExp: false,
  isPlayAll: false,
  isVirtualize: false
};
class Songlist extends react.Component {
  constructor(props) {
    super(props);
    this.search = void 0;
    this.page = void 0;
    this.number = void 0;
    this.isLoading = void 0;
    this.isEnd = void 0;
    this.hasBindEvent = void 0;

    this.reset = cb => {
      this.page = 0;
      this.setState({
        songList: []
      }, () => {
        cb && cb();
      });
    };

    this.getData = async (query, cb) => {
      this.isLoading = true;
      const {
        page,
        number
      } = this;

      try {
        const res = await (0,network/* ufetch */.D)({
          search: (0,search_api/* searchQQMusicAsset */.d$)({
            page,
            number,
            query: query || '',
            uin: `${login/* default.musicId */.Z.musicId}`,
            type: search_api/* SEARCH_TYPE.SONG */.VO.SONG
          })
        });

        if (res && res.code === 0 && res.search && res.search.code === 0 && res.search.data) {
          const resData = res.search.data.body;
          const rawSongs = resData && Array.isArray(resData.item_song) ? resData.item_song : [];
          const songList = await this.getLikeState(rawSongs.map(item => {
            const _item = (0,tools/* formatSongItemData */.cv)(item);

            return { ..._item,
              type: _item.type == 1 ? 0 : _item.type
            };
          }));
          this.isLoading = false;
          this.setState(prevState => {
            const existingIds = new Set((prevState.songList || []).map(item => item.mid || item.id));
            const uniqueList = songList.filter(item => !existingIds.has(item.mid || item.id));
            return {
              songList: [...(prevState.songList || []), ...uniqueList]
            };
          });
          cb && cb();
        } else {
          this.isLoading = false;
        }
      } catch (e) {
        this.isLoading = false;
      }
    };

    this.getLikeState = async songs => {
      const mids = songs.map(item => item.mid);
      const res = await (0,network/* ufetch */.D)({
        getSongsIsLiked: (0,asset_api/* getSongsIsLiked */.Sq)({
          v_songMid: mids
        })
      });

      if (res && res.code === 0 && res.getSongsIsLiked && res.getSongsIsLiked.code === 0 && res.getSongsIsLiked.data) {
        const likeSongsMap = res.getSongsIsLiked.data.m_fan;

        for (const key in likeSongsMap) {
          if (Object.prototype.hasOwnProperty.call(likeSongsMap, key) && likeSongsMap[key]) {
            songs = songs.map(item => {
              if (key === (item === null || item === void 0 ? void 0 : item.mid)) {
                item.like = true;
              }

              return item;
            });
          }
        }
      }

      return songs;
    };

    this.scrollLoad = ev => {
      const target = ev.target;
      const windowHeight = window.screen.height;

      if (target.scrollHeight - target.scrollTop - windowHeight < 500 && !this.isLoading && !this.isEnd) {
        this.page++;
        this.getData(this.search);
      }
    };

    this.page = 0;
    this.number = 15;
    this.isLoading = false;
    this.isEnd = false;
    this.hasBindEvent = false;
    this.state = {
      songList: []
    };
  }

  initRender() {
    const newSearch = utils/* default.getParam */.ZP.getParam('query');

    const {
      pageWrapperRef,
      routerViewWrapperRef
    } = this.props;

    if (pageWrapperRef.current && routerViewWrapperRef.current && !this.hasBindEvent) {
      pageWrapperRef.current.addEventListener('scroll', ev => {
        this.scrollLoad(ev);
      });
      this.hasBindEvent = true;
    }

    if (this.search !== newSearch) {
      this.search = newSearch;
      this.reset(() => {
        this.getData(newSearch);
      });
    }
  }

  componentDidMount() {
    this.initRender();
  }

  componentDidUpdate() {
    this.initRender();
  }

  render() {
    const {
      routerViewWrapperRef
    } = this.props;
    return /*#__PURE__*/react.createElement(song_list/* SongList */.J, {
      wrapper: routerViewWrapperRef,
      songList: this.state.songList,
      config: SearchSongListConfig
    });
  }

}
// EXTERNAL MODULE: ./src/component/playlist/index.tsx
var component_playlist = __webpack_require__(22865);
// EXTERNAL MODULE: ./src/client/index.tsx
var client = __webpack_require__(21209);
;// CONCATENATED MODULE: ./src/pages/search/component/Playlist/index.tsx








class Playlist_Songlist extends react.Component {
  constructor(props) {
    super(props);
    this.search = void 0;
    this.page = void 0;
    this.number = void 0;
    this.isLoading = void 0;
    this.isEnd = void 0;
    this.hasBindEvent = void 0;

    this.reset = cb => {
      this.page = 0;
      this.setState({
        playlist: []
      }, () => {
        cb && cb();
      });
    };

    this.getData = async query => {
      this.isLoading = true;
      const {
        page,
        number
      } = this;

      try {
        const res = await (0,network/* ufetch */.D)({
          search: (0,search_api/* searchQQMusicAsset */.d$)({
            page,
            number,
            query: query || '',
            uin: `${login/* default.musicId */.Z.musicId}`,
            type: search_api/* SEARCH_TYPE.PLAYLIST */.VO.PLAYLIST
          })
        });
        this.isLoading = false;

        if (res && res.code == 0 && res.search && res.search.code === 0) {
          const data = res.search.data;
          const playlist = data.body.item_songlist;

          if (playlist && playlist.length > 0) {
            const newItems = playlist.map(item => {
              const numId = parseInt(item.dissid, 10);
              return {
                id: numId,
                dissid: numId,
                title: item.dissname,
                picurl: item.logo,
                creator: {
                  nick: item.nickname,
                  uin: item.uin
                },
                info: item.description,
                subtitle: item.subhead,
                updatetime: parseInt(item.createtime, 10),
                listeners: item.listennum
              };
            });

            this.setState(prevState => {
              const existingIds = new Set(prevState.playlist.map(p => String(p.id || p.dissid)));
              const uniqueNewItems = newItems.filter(p => !existingIds.has(String(p.id || p.dissid)));
              return {
                playlist: [...prevState.playlist, ...uniqueNewItems]
              };
            });
          } else {
            this.isEnd = true;
          }
        }
      } catch (e) {
        this.isLoading = false;
      }
    };

    this.scrollLoad = ev => {
      const target = ev.currentTarget;
      const windowHeight = window.screen.height;

      if (target.scrollHeight - target.scrollTop - windowHeight < 500 && !this.isLoading && !this.isEnd) {
        this.page++;
        this.getData(this.search);
      }
    };

    this.handlePlay = item => {
      (0,assets/* getSearchPlayListSongs */.dm)(item.id).then(list => {
        client/* default.playSong */.Z.playSong({
          songList: list,
          playIndex: 0
        });
      });
    };

    this.search = '';
    this.page = 0;
    this.number = 15;
    this.isLoading = false;
    this.state = {
      playlist: []
    };
  }

  initRender() {
    const newSearch = utils/* default.getParam */.ZP.getParam('query');

    const {
      pageWrapperRef,
      routerViewWrapperRef
    } = this.props;

    if (pageWrapperRef.current && routerViewWrapperRef.current && !this.hasBindEvent) {
      pageWrapperRef.current.addEventListener('scroll', ev => {
        this.scrollLoad(ev);
      });
      this.hasBindEvent = true;
    }

    if (this.search !== newSearch) {
      this.search = newSearch;
      this.reset(() => {
        this.getData(newSearch);
      });
    }
  }

  componentDidMount() {
    this.initRender();
  }

  componentDidUpdate() {
    this.initRender();
  }

  render() {
    const {
      playlist
    } = this.state;
    const {
      routerViewWrapperRef
    } = this.props;
    const {
      handlePlay
    } = this;
    return /*#__PURE__*/react.createElement(component_playlist/* default */.Z, {
      wrapper: routerViewWrapperRef,
      list: playlist,
      onPlay: handlePlay,
      config: {
        user: true,
        name: true,
        info: false,
        listen: true,
        delete: false
      },
      className: "mod_adapter_4-6"
    });
  }

}
// EXTERNAL MODULE: ./src/component/albumlist/index.tsx
var albumlist = __webpack_require__(70025);
;// CONCATENATED MODULE: ./src/pages/search/component/Albumlist/index.tsx






class Albumlist_Songlist extends react.Component {
  constructor(props) {
    super(props);
    this.search = void 0;
    this.page = void 0;
    this.number = void 0;
    this.isLoading = void 0;
    this.isEnd = void 0;
    this.hasBindEvent = void 0;

    this.reset = cb => {
      this.page = 0;
      this.setState({
        albumList: []
      }, () => {
        cb && cb();
      });
    };

    this.getData = async query => {
      this.isLoading = true;
      const {
        page,
        number
      } = this;

      try {
        const res = await (0,network/* ufetch */.D)({
          search: (0,search_api/* searchQQMusicAsset */.d$)({
            page,
            number,
            query: query || '',
            uin: `${login/* default.musicId */.Z.musicId}`,
            type: search_api/* SEARCH_TYPE.ALBUM */.VO.ALBUM
          })
        });
        this.isLoading = false;

        if (res && res.code == 0 && res.search && res.search.code === 0) {
          const data = res.search.data;
          const album = data.body.item_album;

          if (album && album.length > 0) {
            const newAlbums = album.map(item => {
              return { ...item,
                mid: item.albummid,
                desc: item.description,
                subtitle: item.description,
                release_time: item.publish_date
              };
            });

            this.setState(prevState => {
              const existingMids = new Set(prevState.albumList.map(a => String(a.mid || a.albummid || a.id)));
              const uniqueAlbums = newAlbums.filter(a => !existingMids.has(String(a.mid || a.albummid || a.id)));
              return {
                albumList: [...prevState.albumList, ...uniqueAlbums]
              };
            });
          } else {
            this.isEnd = true;
            return;
          }
        }
      } catch (e) {
        this.isLoading = false;
      }
    };

    this.scrollLoad = ev => {
      const target = ev.currentTarget;
      const windowHeight = window.screen.height;

      if (target.scrollHeight - target.scrollTop - windowHeight < 500 && !this.isLoading && !this.isEnd) {
        this.page++;
        this.getData(this.search);
      }
    };

    this.search = '';
    this.page = 0;
    this.number = 15;
    this.isLoading = false;
    this.isEnd = false;
    this.hasBindEvent = false;
    this.state = {
      albumList: []
    };
  }

  initRender() {
    const newSearch = utils/* default.getParam */.ZP.getParam('query');

    const {
      pageWrapperRef,
      routerViewWrapperRef
    } = this.props;

    if (pageWrapperRef.current && routerViewWrapperRef.current && !this.hasBindEvent) {
      pageWrapperRef.current.addEventListener('scroll', ev => {
        this.scrollLoad(ev);
      });
      this.hasBindEvent = true;
    }

    if (this.search !== newSearch) {
      this.search = newSearch;
      this.reset(() => {
        this.getData(newSearch);
      });
    }
  }

  componentDidMount() {
    this.initRender();
  }

  componentDidUpdate() {
    this.initRender();
  }

  render() {
    const {
      albumList
    } = this.state;
    const {
      routerViewWrapperRef
    } = this.props;
    return /*#__PURE__*/react.createElement(albumlist/* default */.Z, {
      containerRef: routerViewWrapperRef,
      content: albumList,
      config: {
        singer: true,
        subtitle: true,
        name: true
      }
    });
  }

}
;// CONCATENATED MODULE: ./src/pages/search/router/index.ts



const routes = [{
  path: '/song',
  component: Songlist,
  exact: false,
  title: '歌曲',
  cache: true
}, {
  path: '/playlist',
  component: Playlist_Songlist,
  exact: false,
  title: '歌单',
  cache: true
}, {
  path: '/album',
  component: Albumlist_Songlist,
  exact: false,
  title: '专辑',
  cache: true
}];
/* harmony default export */ const router = (routes);
;// CONCATENATED MODULE: ./src/pages/search/index.tsx






const scrollHideMax = 70;
const SearchPage = ({
  match
}) => {
  const [headerVisible, setHeaderVisible] = (0,react.useState)(true);
  const query = utils/* default.getParam */.ZP.getParam('query');
  const pageHeaderRef = /*#__PURE__*/react.createRef();
  const pageWrapperRef = /*#__PURE__*/react.createRef();
  const routerViewWrapperRef = /*#__PURE__*/react.createRef();
  (0,react.useEffect)(() => {
    qmfeUnityReport/* default.reportExposurePage */.ZP.reportExposurePage(qmfeUnityReport/* PAGE_HASH.ELECTRON_SEARCH_PAGE_EXPOSURE */.qt.ELECTRON_SEARCH_PAGE_EXPOSURE);
  }, []);

  const scrollToEnd = ev => {
    const scrollTop = ev.currentTarget.scrollTop;

    if (pageHeaderRef.current) {
      if (scrollTop === 0) {
        pageHeaderRef.current.style.transform = 'translate(0)';
        setHeaderVisible(true);
      } else if (scrollTop < scrollHideMax) {
        pageHeaderRef.current.style.transform = `translateY(${-scrollTop}px)`;
        setHeaderVisible(false);
      } else if (scrollTop >= scrollHideMax) {
        setHeaderVisible(false);
        pageHeaderRef.current.style.transform = `translateY(${-scrollHideMax}px)`;
      }
    }
  };

  return /*#__PURE__*/react.createElement("div", {
    className: "layout_detail js_layout_detail",
    ref: pageWrapperRef,
    onScroll: scrollToEnd
  }, /*#__PURE__*/react.createElement("div", {
    className: "search_word",
    ref: pageHeaderRef
  }, "\u641C\u7D22\"", /*#__PURE__*/react.createElement("span", {
    className: "search_word--bold"
  }, `${query}`), "\""), /*#__PURE__*/react.createElement("nav", {
    className: "mod_tab mod_normal_nav",
    style: {
      top: headerVisible ? '70px' : '0px'
    }
  }, /*#__PURE__*/react.createElement("div", {
    className: "layout_cont"
  }, /*#__PURE__*/react.createElement(react_router_dom.NavLink, {
    to: {
      pathname: `${match.path}/song`,
      search: `?query=${encodeURIComponent(query || "")}`
    },
    activeClassName: "c_tx_current",
    className: "tab__item c_tx_normal"
  }, /*#__PURE__*/react.createElement("span", {
    className: "tab__label"
  }, "\u6B4C\u66F2")), /*#__PURE__*/react.createElement(react_router_dom.NavLink, {
    to: {
      pathname: `${match.path}/playlist`,
      search: `?query=${encodeURIComponent(query || "")}`
    },
    activeClassName: "c_tx_current",
    className: "tab__item c_tx_normal"
  }, /*#__PURE__*/react.createElement("span", {
    className: "tab__label"
  }, "\u6B4C\u5355")), /*#__PURE__*/react.createElement(react_router_dom.NavLink, {
    to: {
      pathname: `${match.path}/album`,
      search: `?query=${encodeURIComponent(query || "")}`
    },
    activeClassName: "c_tx_current",
    className: "tab__item c_tx_normal"
  }, /*#__PURE__*/react.createElement("span", {
    className: "tab__label"
  }, "\u4E13\u8F91")))), /*#__PURE__*/react.createElement(react_router/* Switch */.rs, null, /*#__PURE__*/react.createElement(react_router/* Redirect */.l_, {
    exact: true,
    from: match.path,
    to: {
      pathname: `${match.path}/song`,
      search: `?query=${encodeURIComponent(query || "")}`
    }
  }), router.map(item => {
    return /*#__PURE__*/react.createElement(react_router/* Route */.AW, {
      key: item.title,
      path: match.path + item.path,
      exact: true,
      render: () => {
        return /*#__PURE__*/react.createElement("div", {
          className: "router_view_content js_scroll_cont",
          ref: routerViewWrapperRef
        }, /*#__PURE__*/react.createElement(item.component, {
          pageWrapperRef: pageWrapperRef,
          routerViewWrapperRef: routerViewWrapperRef
        }));
      }
    });
  })));
};
// EXTERNAL MODULE: ./src/pages/setting/styles/index.less
var setting_styles = __webpack_require__(49545);
;// CONCATENATED MODULE: ./src/pages/setting/components/tabList.tsx


const TabList = ({
  tabList,
  onTabChange,
  currentTab
}) => {
  return /*#__PURE__*/react.createElement("div", {
    className: "tab_list"
  }, tabList && tabList.map(item => {
    const {
      label,
      id
    } = item;
    return /*#__PURE__*/react.createElement("div", {
      className: `tab_list__item c_txt1`,
      key: id,
      onClick: () => onTabChange(id)
    }, /*#__PURE__*/react.createElement("span", {
      className: `tab_list__item__text ${id === currentTab ? 'selected' : ''}`
    }, label), id === currentTab && /*#__PURE__*/react.createElement("span", {
      className: "tab_list_decoration"
    }));
  }));
};

/* harmony default export */ const tabList = (TabList);
// EXTERNAL MODULE: ./src/pages/setting/constants/index.ts + 1 modules
var constants = __webpack_require__(23560);
// EXTERNAL MODULE: ./src/pages/setting/constants/types.ts
var constants_types = __webpack_require__(80793);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/extends.js
var helpers_extends = __webpack_require__(67154);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);
;// CONCATENATED MODULE: ./src/pages/setting/components/square_radio.tsx



const SquareRadio = ({
  initialValue,
  onClick,
  label,
  identityKey
}) => {
  let initVal = initialValue;

  if (settings_default().getSync(identityKey) !== undefined) {
    initVal = settings_default().getSync(identityKey);
  }

  const [isSelected, setSelected] = (0,react.useState)(initVal);

  const handleClick = () => {
    setSelected(!isSelected);
    onClick(!isSelected);
  };

  return /*#__PURE__*/react.createElement("div", {
    className: "radio__wrapper"
  }, /*#__PURE__*/react.createElement("div", {
    className: `radio_block square ${isSelected ? 'selected' : ''}`,
    onClick: handleClick
  }, isSelected && /*#__PURE__*/react.createElement("span", {
    className: "square_radio_selected__icon"
  })), /*#__PURE__*/react.createElement("span", {
    className: "setting_form_item__label radio_label c_txt1",
    onClick: handleClick
  }, label));
};

/* harmony default export */ const square_radio = (SquareRadio);
// EXTERNAL MODULE: ./src/lib/common/event.ts
var common_event = __webpack_require__(67224);
;// CONCATENATED MODULE: ./src/pages/setting/components/circlr_radio.tsx



const CircleRadio = ({
  initialValue,
  value: _value,
  onClick,
  label,
  identityKey
}) => {
  const initVal = initialValue === _value;
  const [isSelected, setSelected] = (0,react.useState)(initVal);

  const switchSelected = args => {
    const {
      key,
      value
    } = args;

    if (key === identityKey) {
      setSelected(value === _value);
    }
  };

  (0,react.useEffect)(() => {
    common_event/* default.on */.Z.on('app_setting_change', switchSelected);
    return () => {
      common_event/* default.removeListener */.Z.removeListener('app_setting_change', switchSelected);
    };
  }, []);

  const handleClick = () => {
    onClick(_value);
  };

  return /*#__PURE__*/react.createElement("div", {
    className: "radio__wrapper"
  }, /*#__PURE__*/react.createElement("div", {
    className: `radio_block circle ${isSelected ? 'selected' : ''}`,
    onClick: handleClick
  }, isSelected && /*#__PURE__*/react.createElement("span", {
    className: "circle_radio_selected__icon"
  })), /*#__PURE__*/react.createElement("span", {
    className: "setting_form_item__label radio_label c_txt1",
    onClick: handleClick
  }, label));
};

/* harmony default export */ const circlr_radio = (CircleRadio);
;// CONCATENATED MODULE: ./src/pages/setting/components/input.tsx


const Input = ({
  onBlur,
  onKeyDown
}) => {
  const inputRef = (0,react.useRef)();

  const handleInputChange = ev => {
    onBlur(ev, inputRef);
  };

  const handleKeyDown = ev => {
    onKeyDown(ev, inputRef);
  };

  return /*#__PURE__*/react.createElement("input", {
    ref: inputRef,
    onBlur: handleInputChange,
    onKeyDown: handleKeyDown
  });
};

/* harmony default export */ const input = (Input);
;// CONCATENATED MODULE: ./src/pages/setting/components/select.tsx





const Select = ({
  initialValue,
  onSelectChange,
  identityKey,
  options
}) => {
  let initVal = initialValue;

  if (settings_default().getSync(identityKey) !== undefined) {
    initVal = settings_default().getSync(identityKey);
  }

  const [selectedVal, setSelectedVal] = (0,react.useState)(initVal);

  const handleSelectChange = ev => {
    setSelectedVal(ev.target.value);

    if (onSelectChange && (0,utils/* isFunction */.mf)(onSelectChange)) {
      onSelectChange(ev.target.value);
    }
  };

  const listenOnChange = ({
    key = '',
    value = ''
  }) => {
    if (key === identityKey) {
      setSelectedVal(value);
    }
  };

  (0,react.useEffect)(() => {
    common_event/* default.on */.Z.on('app_setting_change', listenOnChange);
    return () => {
      common_event/* default.removeListener */.Z.removeListener('app_setting_change', listenOnChange);
    };
  }, []);
  return /*#__PURE__*/react.createElement("select", {
    value: selectedVal,
    onChange: handleSelectChange,
    className: "select setting__select c_bg_normal c_txt2 c_btn1"
  }, options && options.map((option, index) => {
    const {
      label,
      value
    } = option;
    return /*#__PURE__*/react.createElement("option", {
      className: "c_txt2 c_bg4",
      value: value,
      key: index
    }, label);
  }));
};

/* harmony default export */ const components_select = (Select);
// EXTERNAL MODULE: ./node_modules/react-color/es/index.js + 217 modules
var react_color_es = __webpack_require__(63144);
;// CONCATENATED MODULE: ./src/pages/setting/components/color_pick.tsx





const ColorPick = ({
  initialValue,
  label,
  onColorChange,
  identityKey
}) => {
  const [color, setColor] = (0,react.useState)(initialValue);
  const [popoverVisible, setPopoverVisible] = (0,react.useState)(false);

  const handleChangeComplete = newColor => {
    const {
      r,
      g,
      b,
      a
    } = newColor.rgb;
    const newColorVal = `rgba(${r},${g},${b},${a})`;
    setColor(newColorVal);

    if (onColorChange && (0,utils/* isFunction */.mf)(onColorChange)) {
      onColorChange(newColorVal);
    }
  };

  const handleBlockClick = () => {
    setPopoverVisible(!popoverVisible);
  };

  const handleClose = ev => {
    if (!ev.target.contains(document.querySelector('.sketch-picker'))) {
      setPopoverVisible(false);
    }
  };

  const switchSelected = ({
    key = '',
    value = ''
  }) => {
    if (key === identityKey) {
      setColor(value);
    }
  };

  (0,react.useEffect)(() => {
    common_event/* default.on */.Z.on('app_setting_change', switchSelected);
    return () => {
      common_event/* default.removeListener */.Z.removeListener('app_setting_change', switchSelected);
    };
  }, []);
  return /*#__PURE__*/react.createElement("div", {
    className: "color_pick__wrapper"
  }, /*#__PURE__*/react.createElement("div", {
    className: "color_pick_block",
    style: {
      backgroundColor: String(color)
    },
    onClick: handleBlockClick
  }), label && /*#__PURE__*/react.createElement("span", {
    className: "color_pick_label c_txt1",
    onClick: handleBlockClick
  }, label), popoverVisible && /*#__PURE__*/react.createElement("div", {
    className: "color_pick__popover"
  }, /*#__PURE__*/react.createElement("div", {
    className: "color_pick__cover",
    onClick: handleClose
  }), /*#__PURE__*/react.createElement(react_color_es/* SketchPicker */.xS, {
    color: String(color),
    onChange: handleChangeComplete
  })));
};

/* harmony default export */ const color_pick = (ColorPick);
;// CONCATENATED MODULE: ./src/pages/setting/components/setting_form_render_factory.tsx









const ComponentMap = {
  [`${constants_types/* SETTING_ITEM_TYPE.SQUARE_RADIO */.X.SQUARE_RADIO}`]: square_radio,
  [`${constants_types/* SETTING_ITEM_TYPE.CIRCLE_RADIO */.X.CIRCLE_RADIO}`]: circlr_radio,
  [`${constants_types/* SETTING_ITEM_TYPE.INPUT */.X.INPUT}`]: input,
  [`${constants_types/* SETTING_ITEM_TYPE.SELECT */.X.SELECT}`]: components_select,
  [`${constants_types/* SETTING_ITEM_TYPE.COLOR_PICK */.X.COLOR_PICK}`]: color_pick
};
const StyleMap = {
  [`${constants_types/* SETTING_ITEM_TYPE.SQUARE_RADIO */.X.SQUARE_RADIO}`]: '',
  [`${constants_types/* SETTING_ITEM_TYPE.CIRCLE_RADIO */.X.CIRCLE_RADIO}`]: '',
  [`${constants_types/* SETTING_ITEM_TYPE.INPUT */.X.INPUT}`]: 'inner_input',
  [`${constants_types/* SETTING_ITEM_TYPE.SELECT */.X.SELECT}`]: 'inner_select'
}; // const SettingFormRenderFactory: React.FC<FormItem> = props => {
//
// };

class SettingFormRenderFactory extends react.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  async componentDidMount() {// if (this.props.identityKey === 'desktop_lyric.font_family') {
    //     const options = await getAvailableFontList();
    //     this.setState({
    //         options
    //     });
    // }
  }

  render() {
    const {
      DIY
    } = this.state;

    if (DIY) {
      const {
        component: SettingComponent
      } = this.props;
      return /*#__PURE__*/react.createElement(SettingComponent, null);
    } else {
      const {
        type,
        identityKey
      } = this.state;
      const SettingComponent = ComponentMap[type];
      let initialValue;

      if (settings_default().getSync(identityKey) !== undefined) {
        initialValue = settings_default().getSync(identityKey);
      } else {
        initialValue = (0,constants/* getDefaultSetting */.A5)(identityKey);
      }

      const newProps = { ...this.state,
        initialValue
      };
      return /*#__PURE__*/react.createElement("div", {
        className: `setting_form__item__wrapper ${StyleMap[type]}`
      }, /*#__PURE__*/react.createElement(SettingComponent, newProps));
    }
  }

}

/* harmony default export */ const setting_form_render_factory = (SettingFormRenderFactory);
// EXTERNAL MODULE: ./src/pages/setting/utils/sync_setting.ts
var sync_setting = __webpack_require__(96546);
;// CONCATENATED MODULE: ./src/pages/setting/components/setting_list.tsx





let SETTING_ITEM_LIST = [];

const SettingList = ({
  currentTab
}) => {
  const [isLoading, setIsLoading] = (0,react.useState)(false);
  (0,react.useEffect)(() => {
    (0,sync_setting/* listenOnAppSettingChange */.bR)();
    setIsLoading(true);
    (0,constants/* getSettingItemList */.GP)().then(res => {
      SETTING_ITEM_LIST = res;
      setIsLoading(false);
    });
    return () => {
      (0,sync_setting/* removeAppSettingListener */.xI)();
    };
  }, []);
  (0,react.useEffect)(() => {
    var _document$getElementB;

    (_document$getElementB = document.getElementById(`${currentTab}`)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.scrollIntoView({
      behavior: 'smooth'
    });
  }, [currentTab]);

  if (isLoading) {
    return null;
  }

  return /*#__PURE__*/react.createElement("ul", {
    className: "setting_list"
  }, SETTING_ITEM_LIST && SETTING_ITEM_LIST.map(item => {
    const {
      items
    } = item;
    return /*#__PURE__*/react.createElement("li", {
      className: "setting_list__item c_txt2",
      key: item.identityKey,
      id: item.identityKey
    }, /*#__PURE__*/react.createElement("p", {
      className: "setting_list__item__title c_txt1"
    }, item.label), /*#__PURE__*/react.createElement("div", {
      className: "setting_list__item_split_line c_bg_normal"
    }), items && items.map(subItem => {
      return /*#__PURE__*/react.createElement(SettingListItem, extends_default()({}, subItem, {
        key: subItem.identityKey
      }));
    }));
  }));
};

const SettingListItem = ({
  contents,
  label
}) => {
  return /*#__PURE__*/react.createElement("div", {
    className: "setting_list__item__content"
  }, /*#__PURE__*/react.createElement("span", {
    className: "setting_list__item__content__label c_txt2"
  }, label), /*#__PURE__*/react.createElement("div", {
    className: "setting_list__item__content__main c_txt2"
  }, contents && contents.map((subContentItem, index) => {
    return /*#__PURE__*/react.createElement(setting_form_render_factory, extends_default()({}, subContentItem, {
      key: index
    }));
  })));
};

/* harmony default export */ const setting_list = (SettingList);
;// CONCATENATED MODULE: ./src/pages/setting/index.tsx








const AppSetting = () => null;

/* harmony default export */ const pages_setting = ((0,react_router/* withRouter */.EN)(AppSetting));
// EXTERNAL MODULE: ./node_modules/react-loadable/lib/index.js
var lib = __webpack_require__(68356);
var lib_default = /*#__PURE__*/__webpack_require__.n(lib);
// EXTERNAL MODULE: ./src/component/loading/qqmusic_loading.tsx
var qqmusic_loading = __webpack_require__(4694);
;// CONCATENATED MODULE: ./src/routers/route_config.ts





const LazyPlayListDetail = lib_default()({
  loader: () => Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 767)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazyMyFav = lib_default()({
  loader: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(214)]).then(__webpack_require__.bind(__webpack_require__, 92214)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazyBatchOperation = lib_default()({
  loader: () => Promise.all(/* import() */[__webpack_require__.e(736), __webpack_require__.e(253)]).then(__webpack_require__.bind(__webpack_require__, 42253)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazyMusicRoom = lib_default()({
  loader: () => __webpack_require__.e(/* import() */ 876).then(__webpack_require__.bind(__webpack_require__, 9876)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazyVideo = lib_default()({
  loader: () => __webpack_require__.e(/* import() */ 433).then(__webpack_require__.bind(__webpack_require__, 67433)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazySongDetail = lib_default()({
  loader: () => __webpack_require__.e(/* import() */ 427).then(__webpack_require__.bind(__webpack_require__, 63427)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazyAlbumDetail = lib_default()({
  loader: () => __webpack_require__.e(/* import() */ 261).then(__webpack_require__.bind(__webpack_require__, 96261)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazySingerDetail = lib_default()({
  loader: () => __webpack_require__.e(/* import() */ 845).then(__webpack_require__.bind(__webpack_require__, 89845)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazyToplistDetail = lib_default()({
  loader: () => __webpack_require__.e(/* import() */ 163).then(__webpack_require__.bind(__webpack_require__, 74163)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazyCategoryDetail = lib_default()({
  loader: () => __webpack_require__.e(/* import() */ 552).then(__webpack_require__.bind(__webpack_require__, 68450)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazyMvSet = lib_default()({
  loader: () => __webpack_require__.e(/* import() */ 720).then(__webpack_require__.bind(__webpack_require__, 20720)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazyWebview = lib_default()({
  loader: () => __webpack_require__.e(/* import() */ 869).then(__webpack_require__.bind(__webpack_require__, 18869)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LazyRecommend = lib_default()({
  loader: () => __webpack_require__.e(/* import() */ 940).then(__webpack_require__.bind(__webpack_require__, 65940)),
  loading: qqmusic_loading/* LoadingComponent */.N
});
const LocalMusicPage = () => {
  logInfo("[LocalMusic] LocalMusicPage mounted");
  const isDark = useThemeDetector();

  const listWrapperRef = react.useRef(null);
  const songListRef = react.useRef(null);

  const [folders, setFolders] = react.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("__qqmusic_local_folders__") || "null");
      if (Array.isArray(saved) && saved.length > 0) return saved;
      if (typeof window !== "undefined" && window.require) {
        const fs = window.require("fs");
        if (fs && fs.existsSync && fs.existsSync("/mnt/Sun/Music")) return ["/mnt/Sun/Music"];
      }
      return [];
    } catch (e) {
      logError("[LocalMusic] load folders error:", e);
      return [];
    }
  });

  const [songs, setSongs] = react.useState(() => {
    try {
      const raw = localStorage.getItem("__qqmusic_local_songs__");
      if (!raw) return [];
      if (raw.length > 4 * 1024 * 1024 || raw.includes("data:image")) {
        logWarn("[LocalMusic] Purging legacy oversized base64 cache");
        localStorage.removeItem("__qqmusic_local_songs__");
        return [];
      }
      return JSON.parse(raw);
    } catch (e) {
      logError("[LocalMusic] load songs error:", e);
      try { localStorage.removeItem("__qqmusic_local_songs__"); } catch (_) {}
      return [];
    }
  });

  const [searchText, setSearchText] = react.useState("");
  const [showSearchInput, setShowSearchInput] = react.useState(false);
  const [showFolderManager, setShowFolderManager] = react.useState(false);
  const [inputFolderPath, setInputFolderPath] = react.useState("");
  const [isScanning, setIsScanning] = react.useState(false);
  const [scanStatusText, setScanStatusText] = react.useState("");

  const notifyResize = () => {
    setTimeout(() => {
      try { window.dispatchEvent(new Event("resize")); } catch (_) {}
    }, 60);
  };

  const doScanFolders = folderList => {
    logInfo("[LocalMusic] doScanFolders called with:", folderList);
    if (!folderList || folderList.length === 0) {
      setSongs([]);
      localStorage.setItem("__qqmusic_local_songs__", "[]");
      setScanStatusText("");
      notifyResize();
      return;
    }
    setIsScanning(true);
    setScanStatusText("正在深度扫描本地文件夹...");
    const scanPromise = (typeof window !== "undefined" && window.ipcRenderer && window.ipcRenderer.invoke)
      ? window.ipcRenderer.invoke("scan-local-music-folders", folderList)
      : new Promise(resolve => {
          try {
            const lm = window.require ? window.require("./local_music.js") : null;
            if (lm && lm.scanMusicFolders) {
              resolve(lm.scanMusicFolders(folderList));
            } else {
              resolve([]);
            }
          } catch (e) {
            resolve([]);
          }
        });

    scanPromise.then(scannedList => {
      logInfo("[LocalMusic] Scan finished, items found:", scannedList ? scannedList.length : 0);
      setIsScanning(false);
      if (Array.isArray(scannedList)) {
        setSongs(scannedList);
        try {
          localStorage.setItem("__qqmusic_local_songs__", JSON.stringify(scannedList));
        } catch (e) {
          logError("[LocalMusic] Save cache error:", e);
        }
        setScanStatusText("扫描完成，共找到 " + scannedList.length + " 首歌曲");
        try {
          __webpack_require__(43053).Z.show(1, "扫描完成，共 " + scannedList.length + " 首歌曲");
        } catch (e) {}
      } else {
        setScanStatusText("扫描失败，请检查路径有效性");
      }
      notifyResize();
    }).catch(err => {
      logError("[LocalMusic] Scan error:", err);
      setIsScanning(false);
      setScanStatusText("扫描出错: " + (err ? err.message : ""));
      notifyResize();
    });
  };

  react.useEffect(() => {
    logInfo("[LocalMusic] Component mounted. Folders:", folders.length, "Songs:", songs.length);
    if (folders.length > 0 && songs.length === 0) {
      doScanFolders(folders);
    }
    notifyResize();
    const t1 = setTimeout(notifyResize, 60);
    const t2 = setTimeout(notifyResize, 200);

    let ro = null;
    if (typeof ResizeObserver !== "undefined" && listWrapperRef.current) {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect && entry.contentRect.height > 0) {
            notifyResize();
          }
        }
      });
      ro.observe(listWrapperRef.current);
    }

    const onVisible = () => {
      if (!document.hidden) notifyResize();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", notifyResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (ro) ro.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", notifyResize);
    };
  }, []);

  const addFolder = pathToAdd => {
    logInfo("[LocalMusic] addFolder called:", pathToAdd);
    if (!pathToAdd || !pathToAdd.trim()) return;
    const trimmed = pathToAdd.trim();
    if (folders.includes(trimmed)) {
      try {
        __webpack_require__(43053).Z.show(0, "该文件夹已存在");
      } catch (e) {}
      return;
    }
    const updated = [...folders, trimmed];
    setFolders(updated);
    localStorage.setItem("__qqmusic_local_folders__", JSON.stringify(updated));
    setInputFolderPath("");
    doScanFolders(updated);
  };

  const removeFolder = pathToRemove => {
    logInfo("[LocalMusic] removeFolder called:", pathToRemove);
    const updated = folders.filter(f => f !== pathToRemove);
    setFolders(updated);
    localStorage.setItem("__qqmusic_local_folders__", JSON.stringify(updated));
    const remaining = songs.filter(s => !s.localFilePath || !s.localFilePath.startsWith(pathToRemove));
    setSongs(remaining);
    localStorage.setItem("__qqmusic_local_songs__", JSON.stringify(remaining));
    try {
      __webpack_require__(43053).Z.show(1, "已删除该文件夹");
    } catch (e) {}
    notifyResize();
  };

  const toggleLikeSong = songItem => {
    const updated = songs.map(s => {
      if (s.id === songItem.id || s.mid === songItem.mid) {
        const nextLike = !s.like;
        try {
          __webpack_require__(43053).Z.show(1, nextLike ? "已添加至喜欢" : "已取消喜欢");
        } catch (e) {}
        return { ...s, like: nextLike };
      }
      return s;
    });
    setSongs(updated);
    try {
      localStorage.setItem("__qqmusic_local_songs__", JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredSongs = react.useMemo(() => {
    if (!searchText || !searchText.trim()) return songs;
    const q = searchText.trim().toLowerCase();
    return songs.filter(s => {
      const titleMatch = (s.title && s.title.toLowerCase().includes(q)) || (s.rawTitle && s.rawTitle.toLowerCase().includes(q));
      const subMatch = s.subtitle && s.subtitle.toLowerCase().includes(q);
      const singerMatch = s.singer && s.singer.some(item => item.name && item.name.toLowerCase().includes(q));
      const albumMatch = (s.album && s.album.title && s.album.title.toLowerCase().includes(q)) || (s.album && s.album.name && s.album.name.toLowerCase().includes(q));
      return titleMatch || subMatch || singerMatch || albumMatch;
    });
  }, [songs, searchText]);

  const playerInst = players.Z.getInstance();

  const playSongAt = idx => {
    logInfo("[LocalMusic] playSongAt index:", idx);
    playerInst.playAll({
      songList: filteredSongs,
      index: idx
    });
  };

  const playAllSongs = () => {
    logInfo("[LocalMusic] playAllSongs called, total:", filteredSongs.length);
    if (filteredSongs.length === 0) {
      try {
        __webpack_require__(43053).Z.show(0, "本地音乐列表为空");
      } catch (e) {}
      return;
    }
    playerInst.playAll({
      songList: filteredSongs,
      index: 0
    });
  };

  const toggleFolderManager = e => {
    if (e && e.stopPropagation) e.stopPropagation();
    logInfo("[LocalMusic] toggleFolderManager triggered. Old state:", showFolderManager);
    setShowFolderManager(v => !v);
    notifyResize();
  };

  const SongListComp = __webpack_require__(57224).J;
  const ScrollButtonComp = __webpack_require__(32659).Z;
  const officialSongConfig = {
    header: true,
    songname: true,
    singer: true,
    album: true,
    time: false,
    sort: false,
    number: false,
    rank: false,
    speed: false,
    date: false,
    cloud: false,
    isAudio: false,
    isExp: false,
    isPlayAll: true,
    isVirtualize: true,
    eventActive: true
  };

  const scrollToTop = () => {
    try {
      if (songListRef.current && typeof songListRef.current.scrollToRow === "function") {
        songListRef.current.scrollToRow(0);
      }
    } catch (err) {
      logError("[LocalMusic] scrollToTop error:", err);
    }
  };

  const focusOnCurrentSong = () => {
    try {
      const playingSong = playerInst && playerInst.currentSong;
      if (!playingSong) {
        __webpack_require__(43053).Z.show(0, "当前没有正在播放的歌曲");
        return;
      }
      const idx = filteredSongs.findIndex(item =>
        (item.localFilePath && playingSong.localFilePath && item.localFilePath === playingSong.localFilePath) ||
        (item.id && playingSong.id && item.id === playingSong.id) ||
        (item.mid && playingSong.mid && item.mid === playingSong.mid) ||
        (item.name && playingSong.name && item.name === playingSong.name)
      );
      if (idx !== -1) {
        if (songListRef.current && typeof songListRef.current.scrollToRow === "function") {
          songListRef.current.scrollToRow(idx);
        }
      } else {
        __webpack_require__(43053).Z.show(0, "当前播放歌曲不在本地列表中");
      }
    } catch (err) {
      logError("[LocalMusic] focusOnCurrentSong error:", err);
    }
  };

  const authorColor = isDark ? "#ffffff" : "#000000";

  const styleEl = react.createElement("style", null, `
    .local_music_page .songlist__icon_love {
      visibility: hidden !important;
      pointer-events: none !important;
    }
    /* 歌手列颜色：亮色模式下黑色，深色模式下白色；禁止点击歌手与专辑跳转 */
    .local_music_page .songlist__author,
    .local_music_page .songlist__author a,
    .local_music_page .songlist__author .c_tx_disabled,
    .local_music_page .songlist__author .songlist__txt {
      color: ${authorColor} !important;
      opacity: 1 !important;
      cursor: default !important;
      pointer-events: none !important;
      text-decoration: none !important;
    }
    /* TODO: 本地歌曲歌手与专辑详情跳转待后续曲库关联实现，目前暂时禁止跳转 */
    .local_music_page .songlist__album,
    .local_music_page .songlist__album a,
    .local_music_page .songlist__album .songlist__txt {
      cursor: default !important;
      pointer-events: none !important;
      text-decoration: none !important;
    }
    .local_music_page .official_play_all:hover {
      background-color: #22d59c !important;
    }
    .local_music_page .official_play_all:active {
      background-color: #1ab382 !important;
      transform: scale(0.98);
    }
    .local_music_page .fast_side_bar {
      position: absolute !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 100 !important;
    }
  `);

  return react.createElement("div", {
    className: "my_favorite_page__wrapper local_music_page",
    style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", position: "relative" }
  }, styleEl, react.createElement("div", {
    className: "favorite__header",
    style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "16px 20px 8px 20px" }
  }, react.createElement("div", {
    style: { display: "flex", alignItems: "baseline", gap: 12 }
  }, react.createElement("span", {
    className: "favorite__header_title"
  }, "本地音乐"), react.createElement("span", {
    className: "c_tx_thin",
    style: { fontSize: 13 }
  }, "共 " + filteredSongs.length + " 首歌曲"))), react.createElement("div", {
    className: "favorite__body",
    style: { margin: 0, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }
  }, react.createElement("div", {
    className: "action__mod",
    style: { display: "flex", alignItems: "center", padding: "0 20px 12px 20px", gap: 12 }
  }, react.createElement("div", {
    className: "action__btn play official_play_all",
    style: {
      cursor: "pointer",
      userSelect: "none",
      height: 34,
      padding: "0 18px",
      borderRadius: 17,
      backgroundColor: "#1ecc94",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      fontSize: 13,
      fontWeight: 500,
      boxShadow: "0 2px 8px rgba(30, 204, 148, 0.25)",
      transition: "all 0.2s ease"
    },
    onClick: playAllSongs
  }, react.createElement("svg", {
    viewBox: "0 0 24 24",
    width: 15,
    height: 15,
    fill: "none",
    stroke: "#ffffff",
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { pointerEvents: "none" }
  }, react.createElement("polygon", { points: "6 3 20 12 6 21 6 3" })), react.createElement("span", {
    style: { pointerEvents: "none" }
  }, "播放全部")), react.createElement("div", {
    className: "action__btn c_btn " + (showFolderManager ? "c_btn_skin" : ""),
    style: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      borderRadius: 17,
      height: 34,
      background: showFolderManager ? "rgba(30, 204, 148, 0.2)" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"),
      color: showFolderManager ? "#1ecc94" : (isDark ? "#d0d2d6" : "#374151"),
      border: showFolderManager ? "1px solid rgba(30, 204, 148, 0.4)" : (isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.08)"),
      userSelect: "none"
    },
    onClick: toggleFolderManager
  }, react.createElement("svg", {
    viewBox: "0 0 24 24",
    width: 16,
    height: 16,
    style: { marginRight: 6, pointerEvents: "none" },
    fill: "currentColor"
  }, react.createElement("path", {
    d: "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z",
    style: { pointerEvents: "none" }
  })), react.createElement("span", {
    style: { pointerEvents: "none" }
  }, "文件夹")), react.createElement("div", {
    style: { marginLeft: "auto", display: "flex", alignItems: "center" }
  }, showSearchInput ? react.createElement("div", {
    className: "action__btn c_btn search input float_right",
    style: {
      width: 220,
      display: "flex",
      alignItems: "center",
      borderRadius: 17,
      padding: "0 12px",
      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"
    }
  }, react.createElement("input", {
    autoFocus: true,
    placeholder: "搜索歌曲、歌手、专辑...",
    value: searchText,
    style: { width: "100%", border: "none", background: "transparent", outline: "none", color: "inherit" },
    onChange: e => setSearchText(e.target.value)
  }), react.createElement("span", {
    className: "action__btn__icon search_close",
    style: { cursor: "pointer" },
    onClick: () => { setShowSearchInput(false); setSearchText(""); }
  })) : react.createElement("div", {
    className: "action__btn search normal float_right c_btn",
    style: { cursor: "pointer", display: "flex", alignItems: "center", borderRadius: 17, padding: "0 14px", height: 34, userSelect: "none" },
    onClick: () => setShowSearchInput(true)
  }, react.createElement("span", {
    className: "action__btn__icon search",
    style: { pointerEvents: "none" }
  }), react.createElement("span", {
    className: "c_txt1",
    style: { marginLeft: 4, pointerEvents: "none" }
  }, "搜索")))), showFolderManager && react.createElement("div", {
    style: {
      margin: "0 20px 14px 20px",
      padding: "16px 20px",
      background: isDark ? "#232530" : "#ffffff",
      borderRadius: 10,
      border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.08)",
      boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
      color: isDark ? "#ffffff" : "#111827",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, react.createElement("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center" }
  }, react.createElement("span", {
    style: { fontSize: 14, fontWeight: "bold" }
  }, "已添加的本地文件夹 (" + folders.length + ")"), react.createElement("span", {
    style: { cursor: "pointer", fontSize: 12, opacity: 0.7, padding: "2px 8px" },
    onClick: () => { setShowFolderManager(false); notifyResize(); }
  }, "收起 ▲")), react.createElement("div", {
    style: { display: "flex", flexDirection: "column", gap: 6, maxHeight: 150, overflowY: "auto" }
  }, folders.length === 0 ? react.createElement("div", {
    style: { fontSize: 12, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", padding: "6px 0" }
  }, "暂未添加任何本地音乐文件夹，请在下方添加") : folders.map((fPath, idx) => react.createElement("div", {
    key: fPath + "_" + idx,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "7px 12px",
      borderRadius: 6,
      background: isDark ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.03)",
      border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.06)",
      fontSize: 13
    }
  }, react.createElement("span", {
    style: { wordBreak: "break-all", marginRight: 12, opacity: 0.9 }
  }, fPath), react.createElement("span", {
    style: { color: "#ff5252", cursor: "pointer", fontSize: 12, flexShrink: 0, padding: "2px 6px" },
    onClick: () => removeFolder(fPath)
  }, "删除")))), react.createElement("div", {
    style: { display: "flex", gap: 8, alignItems: "center", paddingTop: 6, borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)" }
  }, react.createElement("input", {
    type: "text",
    placeholder: "输入本地文件夹绝对路径",
    value: inputFolderPath,
    onChange: e => setInputFolderPath(e.target.value),
    onKeyDown: e => { if (e.key === "Enter") addFolder(inputFolderPath); },
    style: {
      flex: 1,
      padding: "7px 12px",
      borderRadius: 6,
      border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0, 0, 0, 0.12)",
      background: isDark ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.03)",
      color: isDark ? "#fff" : "#111827",
      outline: "none",
      fontSize: 13
    }
  }), react.createElement("button", {
    onClick: () => addFolder(inputFolderPath),
    disabled: isScanning,
    style: {
      padding: "7px 16px",
      borderRadius: 6,
      border: "none",
      background: isScanning ? "#555" : "#1ecc94",
      color: "#fff",
      cursor: isScanning ? "not-allowed" : "pointer",
      fontSize: 13,
      fontWeight: "bold",
      whiteSpace: "nowrap"
    }
  }, isScanning ? "扫描中..." : "添加并扫描")), scanStatusText && react.createElement("div", {
    style: { fontSize: 12, color: "#1ecc94" }
  }, scanStatusText)), react.createElement("div", {
    className: "fav_main_cont__wrapper",
    ref: listWrapperRef,
    style: { flex: "1 1 0", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", marginLeft: 20 }
  }, filteredSongs.length === 0 ? react.createElement("div", {
    style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", gap: 12 }
  }, react.createElement("svg", {
    viewBox: "0 0 24 24",
    width: 48,
    height: 48,
    fill: "currentColor",
    style: { opacity: 0.3 }
  }, react.createElement("path", {
    d: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
  })), react.createElement("div", null, folders.length === 0 ? "暂无本地音乐文件夹，点击上方“文件夹”添加扫描目录" : "未找到匹配的本地歌曲")) : react.createElement(SongListComp, {
    ref: songListRef,
    wrapper: listWrapperRef,
    songList: filteredSongs,
    config: officialSongConfig,
    onSwitchCollectState: (songItem, idx) => toggleLikeSong(songItem),
    onAddTo: (idx, ev) => {
      try {
        const s = filteredSongs[idx];
        if (s) {
          playerInst.addToPlayList({ songList: [s] });
          __webpack_require__(43053).Z.show(1, "已添加到播放队列");
        }
      } catch (err) {}
    }
  }))), filteredSongs.length > 0 && react.createElement(ScrollButtonComp, {
    config: {
      show: true,
      reload: false
    },
    scrollToTopBtnVisible: true,
    focusBtnVisible: true,
    scrollToSong: focusOnCurrentSong,
    scrollToTopFunc: scrollToTop
  }));
};

const WebDavMusicPage = () => {
  logInfo("[WebDAV] WebDavMusicPage mounted");
  const isDark = useThemeDetector();

  const listWrapperRef = react.useRef(null);
  const songListRef = react.useRef(null);

  const [servers, setServers] = react.useState([]);
  const [activeServerId, setActiveServerId] = react.useState(null);
  const [songs, setSongs] = react.useState([]);
  const [searchText, setSearchText] = react.useState("");
  const [showSearchInput, setShowSearchInput] = react.useState(false);
  const [showServerManager, setShowServerManager] = react.useState(false);
  const [viewMode, setViewMode] = react.useState("songs"); // 'songs' | 'tree'

  // 目录树浏览状态
  const [currentDirPath, setCurrentDirPath] = react.useState("/");
  const [dirItems, setDirItems] = react.useState([]);
  const [isDirLoading, setIsDirLoading] = react.useState(false);
  const [dirErrorText, setDirErrorText] = react.useState("");
  const [isScanning, setIsScanning] = react.useState(false);
  const [scanStatusText, setScanStatusText] = react.useState("");

  // 表单状态
  const [showAddForm, setShowAddForm] = react.useState(false);
  const [editServerId, setEditServerId] = react.useState(null);
  const [formName, setFormName] = react.useState("");
  const [formUrl, setFormUrl] = react.useState("");
  const [formRootPath, setFormRootPath] = react.useState("/");
  const [formUsername, setFormUsername] = react.useState("");
  const [formPassword, setFormPassword] = react.useState("");
  const [formTrustSelfSigned, setFormTrustSelfSigned] = react.useState(false);

  const [isMatching, setIsMatching] = react.useState(false);
  const [matchProgress, setMatchProgress] = react.useState(null); // { text, current, total, percent, songs }
  const [isTesting, setIsTesting] = react.useState(false);
  const [testResultText, setTestResultText] = react.useState("");

  const notifyResize = () => {
    setTimeout(() => {
      try { window.dispatchEvent(new Event("resize")); } catch (_) {}
    }, 60);
  };

  const getIpc = () => {
    if (typeof window !== "undefined") {
      if (window.ipcRenderer) return window.ipcRenderer;
      if (typeof external_electron_ !== "undefined" && external_electron_.ipcRenderer) return external_electron_.ipcRenderer;
      if (window.require) {
        try { return window.require("electron").ipcRenderer; } catch (_) {}
      }
    }
    return null;
  };

  const loadData = () => {
    const ipc = getIpc();
    if (!ipc || !ipc.invoke) return;

    ipc.invoke("webdav-get-config").then(cfg => {
      if (cfg && Array.isArray(cfg.servers)) {
        setServers(cfg.servers);
        const curActive = cfg.activeServerId || (cfg.servers.length > 0 ? cfg.servers[0].id : null);
        setActiveServerId(curActive);

        if (curActive) {
          ipc.invoke("webdav-get-cached-songs", curActive).then(cached => {
            if (Array.isArray(cached)) {
              setSongs(cached);
              notifyResize();
            }
          }).catch(err => {
            logError("[WebDAV] Failed to load cached songs:", err);
          });
        } else {
          setSongs([]);
          notifyResize();
        }
      }
    }).catch(err => {
      logError("[WebDAV] Failed to get config:", err);
    });
  };

  react.useEffect(() => {
    loadData();

    const t1 = setTimeout(notifyResize, 60);
    const t2 = setTimeout(notifyResize, 200);

    let ro = null;
    if (typeof ResizeObserver !== "undefined" && listWrapperRef.current) {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect && entry.contentRect.height > 0) {
            notifyResize();
          }
        }
      });
      ro.observe(listWrapperRef.current);
    }

    const onVisible = () => {
      if (!document.hidden) notifyResize();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", notifyResize);

    const handleMatchProgress = (event, progress) => {
      if (progress) {
        setMatchProgress(progress);
        if (Array.isArray(progress.songs) && progress.songs.length > 0) {
          setSongs(progress.songs);
          notifyResize();
        }
        if (progress.done) {
          setIsMatching(false);
          setTimeout(() => setMatchProgress(null), 3000);
          try { __webpack_require__(43053).Z.show(1, "歌曲信息匹配完成，共 " + (progress.total || progress.count || 0) + " 首"); } catch (e) {}
        }
      }
    };

    const ipc = getIpc();
    if (ipc && ipc.on) {
      ipc.on("webdav-match-progress", handleMatchProgress);
      ipc.on("webdav-scan-progress", handleMatchProgress);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (ro) ro.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", notifyResize);
      if (ipc && ipc.removeListener) {
        ipc.removeListener("webdav-match-progress", handleMatchProgress);
        ipc.removeListener("webdav-scan-progress", handleMatchProgress);
      }
    };
  }, []);

  const handleSwitchServer = serverId => {
    if (!serverId || serverId === activeServerId) return;
    setActiveServerId(serverId);
    const ipc = getIpc();
    if (ipc && ipc.invoke) {
      ipc.invoke("webdav-set-active-server", serverId).then(() => {
        ipc.invoke("webdav-get-cached-songs", serverId).then(cached => {
          setSongs(Array.isArray(cached) ? cached : []);
          notifyResize();
        });
        if (viewMode === "tree") {
          fetchDir("/");
        }
      });
    }
  };

  const fetchDir = (dirPath, serverId = null) => {
    const sId = serverId || activeServerId;
    const ipc = getIpc();
    if (!ipc || !ipc.invoke || !sId) return;
    setIsDirLoading(true);
    setDirErrorText("");
    ipc.invoke("webdav-list-dir", { serverId: sId, dirPath }).then(res => {
      setIsDirLoading(false);
      if (res && res.success) {
        setCurrentDirPath(res.path || dirPath);
        setDirItems(res.items || []);
        notifyResize();
      } else {
        setDirErrorText(res ? res.msg : "获取目录失败");
      }
    }).catch(err => {
      setIsDirLoading(false);
      setDirErrorText(err ? err.message : "请求异常");
    });
  };

  const handleOpenServerDirectory = (srv) => {
    if (!srv) return;
    setActiveServerId(srv.id);
    setViewMode("tree");
    setShowServerManager(false);
    const targetPath = srv.rootPath || "/";
    setCurrentDirPath(targetPath);
    fetchDir(targetPath, srv.id);
    const ipc = getIpc();
    if (ipc && ipc.invoke) {
      ipc.invoke("webdav-set-active-server", srv.id);
    }
    notifyResize();
  };

  const handleScanCurrentFolder = (folderHref) => {
    const targetFolder = folderHref || currentDirPath;
    const ipc = getIpc();
    if (!ipc || !ipc.invoke || !activeServerId) return;

    setIsScanning(true);
    setScanStatusText("正在导入并扫描目录 " + targetFolder + " ...");

    ipc.invoke("webdav-import-folder", { serverId: activeServerId, folderHref: targetFolder }).then(res => {
      setIsScanning(false);
      if (res && res.success) {
        setSongs(res.songs || []);
        setScanStatusText("导入完成，曲库现有 " + (res.count || 0) + " 首歌曲");
        try { __webpack_require__(43053).Z.show(1, "目录已导入曲库，共 " + (res.count || 0) + " 首歌曲"); } catch (e) {}
        loadData();
      } else {
        setScanStatusText("导入失败: " + (res ? res.msg : ""));
        try { __webpack_require__(43053).Z.show(0, "导入失败: " + (res ? res.msg : "")); } catch (e) {}
      }
      notifyResize();
    }).catch(err => {
      setIsScanning(false);
      setScanStatusText("导入出错: " + (err ? err.message : ""));
      notifyResize();
    });
  };

  const handleOpenAddForm = (server = null) => {
    if (server) {
      setEditServerId(server.id);
      setFormName(server.name || "");
      setFormUrl(server.url || "");
      setFormRootPath(server.rootPath || "/");
      setFormUsername(server.username || "");
      setFormPassword("");
      setFormTrustSelfSigned(!!server.trustSelfSigned);
    } else {
      setEditServerId(null);
      setFormName("NAS 音乐");
      setFormUrl("http://");
      setFormRootPath("/");
      setFormUsername("");
      setFormPassword("");
      setFormTrustSelfSigned(false);
    }
    setTestResultText("");
    setShowAddForm(true);
    setShowServerManager(true);
    notifyResize();
  };

  const handleTestConnection = () => {
    if (!formUrl || !formUrl.trim() || formUrl.trim() === "http://" || formUrl.trim() === "https://") {
      setTestResultText("请输入有效的服务器地址");
      return;
    }
    const ipc = getIpc();
    if (!ipc || !ipc.invoke) {
      setTestResultText("✗ 无法连接 IPC 通信模块");
      return;
    }

    ipc.invoke("webdav-test-connection", sData).then(res => {
      setIsTesting(false);
      if (res && res.success) {
        setTestResultText("✓ " + (res.message || "连接成功"));
        try { __webpack_require__(43053).Z.show(1, "WebDAV 连接成功"); } catch (e) {}
      } else {
        setTestResultText("✗ " + (res ? res.message : "连接失败"));
        try { __webpack_require__(43053).Z.show(0, res ? res.message : "连接失败"); } catch (e) {}
      }
    }).catch(err => {
      setIsTesting(false);
      setTestResultText("✗ 连接异常: " + (err ? err.message : ""));
    });
  };

  const handleSaveServer = (shouldScan = false) => {
    if (!formUrl || !formUrl.trim() || formUrl.trim() === "http://" || formUrl.trim() === "https://") {
      try { __webpack_require__(43053).Z.show(0, "请输入有效的服务器地址"); } catch (e) {}
      return;
    }
    const sData = {
      id: editServerId,
      name: (formName && formName.trim()) || "WebDAV 服务器",
      url: formUrl.trim(),
      rootPath: (formRootPath && formRootPath.trim()) || "/",
      username: formUsername.trim(),
      password: formPassword,
      trustSelfSigned: formTrustSelfSigned
    };

    const ipc = getIpc();
    if (ipc && ipc.invoke) {
      ipc.invoke("webdav-save-server", sData).then(res => {
        if (res && res.success) {
          setShowAddForm(false);
          loadData();
          try { __webpack_require__(43053).Z.show(1, "WebDAV 服务器已保存"); } catch (e) {}
          if (shouldScan && res.serverId) {
            handleScanServer(res.serverId);
          }
        } else {
          try { __webpack_require__(43053).Z.show(0, "保存失败: " + (res ? res.msg : "")); } catch (e) {}
        }
      });
    }
  };

  const handleRemoveServer = serverId => {
    if (!serverId) return;
    const ipc = getIpc();
    if (ipc && ipc.invoke) {
      ipc.invoke("webdav-remove-server", serverId).then(res => {
        if (res && res.success) {
          try { __webpack_require__(43053).Z.show(1, "已删除 WebDAV 服务器"); } catch (e) {}
          loadData();
        }
      });
    }
  };

  const handleMatchMetadata = serverId => {
    const targetId = serverId || activeServerId;
    if (!targetId) {
      try { __webpack_require__(43053).Z.show(0, "请先选择或添加 WebDAV 服务器"); } catch (e) {}
      return;
    }
    if (songs.length === 0) {
      try { __webpack_require__(43053).Z.show(0, "当前曲库为空，请先在目录浏览中导入歌曲"); } catch (e) {}
      return;
    }

    setIsMatching(true);
    setMatchProgress({ percent: 0, text: "正在读取歌曲头信息..." });

    const ipc = getIpc();
    if (ipc && ipc.invoke) {
      ipc.invoke("webdav-match-metadata", targetId).then(res => {
        setIsMatching(false);
        if (res && res.success) {
          if (res.songs) setSongs(res.songs);
          try { __webpack_require__(43053).Z.show(1, "歌曲信息匹配完成，共 " + (res.count || 0) + " 首歌曲"); } catch (e) {}
          loadData();
        } else {
          setMatchProgress(null);
          try { __webpack_require__(43053).Z.show(0, "匹配失败: " + (res ? res.msg : "")); } catch (e) {}
        }
        notifyResize();
      }).catch(err => {
        setIsMatching(false);
        setMatchProgress(null);
        try { __webpack_require__(43053).Z.show(0, "匹配出错: " + (err ? err.message : "")); } catch (e) {}
        notifyResize();
      });
    }
  };

  const handleRemoveSong = (songHref) => {
    if (!activeServerId || !songHref) return;
    const ipc = getIpc();
    if (ipc && ipc.invoke) {
      ipc.invoke("webdav-remove-song", { serverId: activeServerId, href: songHref }).then(res => {
        if (res && res.success) {
          setSongs(res.songs || []);
          try { __webpack_require__(43053).Z.show(1, "已从曲库中移除"); } catch (_) {}
          loadData();
          notifyResize();
        }
      });
    }
  };

  const handleClearAllSongs = () => {
    if (!activeServerId) return;
    if (songs.length === 0) {
      try { __webpack_require__(43053).Z.show(0, "当前曲库已为空"); } catch (_) {}
      return;
    }
    const confirmed = window.confirm("确定清空当前 WebDAV 曲库列表吗？\n（注：WebDAV 为只读连接，此操作仅清除客户端本地索引，绝不会删除远程文件）");
    if (!confirmed) return;

    const ipc = getIpc();
    if (ipc && ipc.invoke) {
      ipc.invoke("webdav-clear-songs", { serverId: activeServerId }).then(res => {
        if (res && res.success) {
          setSongs([]);
          try { __webpack_require__(43053).Z.show(1, "已清空曲库列表"); } catch (_) {}
          loadData();
          notifyResize();
        }
      });
    }
  };


  const filteredSongs = react.useMemo(() => {
    if (!searchText || !searchText.trim()) return songs;
    const q = searchText.trim().toLowerCase();
    return songs.filter(s => {
      const titleMatch = (s.title && s.title.toLowerCase().includes(q)) || (s.rawTitle && s.rawTitle.toLowerCase().includes(q));
      const subMatch = s.subtitle && s.subtitle.toLowerCase().includes(q);
      const singerMatch = s.singer && s.singer.some(item => item.name && item.name.toLowerCase().includes(q));
      const albumMatch = (s.album && s.album.title && s.album.title.toLowerCase().includes(q)) || (s.album && s.album.name && s.album.name.toLowerCase().includes(q));
      return titleMatch || subMatch || singerMatch || albumMatch;
    });
  }, [songs, searchText]);

  const playerInst = players.Z.getInstance();

  const playSongAt = idx => {
    logInfo("[WebDAV] playSongAt index:", idx);
    playerInst.playAll({
      songList: filteredSongs,
      index: idx
    });
  };

  const playAllSongs = () => {
    logInfo("[WebDAV] playAllSongs called, total:", filteredSongs.length);
    if (filteredSongs.length === 0) {
      try { __webpack_require__(43053).Z.show(0, "当前 WebDAV 音乐列表为空"); } catch (e) {}
      return;
    }
    playerInst.playAll({
      songList: filteredSongs,
      index: 0
    });
  };

  const SongListComp = __webpack_require__(57224).J;
  const ScrollButtonComp = __webpack_require__(32659).Z;
  const officialSongConfig = {
    header: true,
    songname: true,
    singer: true,
    album: true,
    time: false,
    sort: false,
    number: false,
    rank: false,
    speed: false,
    date: false,
    cloud: false,
    isAudio: false,
    isExp: false,
    isPlayAll: true,
    isVirtualize: true,
    eventActive: true
  };

  const scrollToTop = () => {
    try {
      if (songListRef.current && typeof songListRef.current.scrollToRow === "function") {
        songListRef.current.scrollToRow(0);
      }
    } catch (err) {
      logError("[WebDAV] scrollToTop error:", err);
    }
  };

  const focusOnCurrentSong = () => {
    try {
      const playingSong = playerInst && playerInst.currentSong;
      if (!playingSong) {
        __webpack_require__(43053).Z.show(0, "当前没有正在播放的歌曲");
        return;
      }
      const idx = filteredSongs.findIndex(item =>
        (item.webDavHref && playingSong.webDavHref && item.webDavHref === playingSong.webDavHref) ||
        (item.id && playingSong.id && item.id === playingSong.id) ||
        (item.mid && playingSong.mid && item.mid === playingSong.mid) ||
        (item.name && playingSong.name && item.name === playingSong.name)
      );
      if (idx !== -1) {
        if (songListRef.current && typeof songListRef.current.scrollToRow === "function") {
          songListRef.current.scrollToRow(idx);
        }
      } else {
        __webpack_require__(43053).Z.show(0, "当前播放歌曲不在 WebDAV 列表中");
      }
    } catch (err) {
      logError("[WebDAV] focusOnCurrentSong error:", err);
    }
  };

  const authorColor = isDark ? "#ffffff" : "#000000";

  const getBreadcrumbs = () => {
    const raw = (currentDirPath || "/").replace(/\/+$/, "");
    if (!raw || raw === "") return [{ name: "根目录", path: "/" }];
    const parts = raw.split("/").filter(Boolean);
    const crumbs = [{ name: "根目录", path: "/" }];
    let acc = "";
    for (const p of parts) {
      acc += "/" + p;
      crumbs.push({ name: p, path: acc + "/" });
    }
    return crumbs;
  };

  const handleGoParentDir = () => {
    const raw = (currentDirPath || "/").replace(/\/+$/, "");
    const lastSlash = raw.lastIndexOf("/");
    if (lastSlash > 0) {
      const parent = raw.slice(0, lastSlash) + "/";
      fetchDir(parent);
    } else {
      fetchDir("/");
    }
  };

  const styleEl = react.createElement("style", null, `
    .webdav_music_page .songlist__icon_love {
      visibility: hidden !important;
      pointer-events: none !important;
    }
    .webdav_music_page .songlist__author,
    .webdav_music_page .songlist__author a,
    .webdav_music_page .songlist__author .c_tx_disabled,
    .webdav_music_page .songlist__author .songlist__txt {
      color: ${authorColor} !important;
      opacity: 1 !important;
      cursor: default !important;
      pointer-events: none !important;
      text-decoration: none !important;
    }
    .webdav_music_page .songlist__album,
    .webdav_music_page .songlist__album a,
    .webdav_music_page .songlist__album .songlist__txt {
      cursor: default !important;
      pointer-events: none !important;
      text-decoration: none !important;
    }
    .webdav_music_page .official_play_all:hover {
      background-color: #0f766e !important;
    }
    .webdav_music_page .official_play_all:active {
      background-color: #115e59 !important;
      transform: scale(0.98);
    }
    .webdav_music_page .fast_side_bar {
      position: absolute !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 100 !important;
    }
    .webdav_tree_row:hover {
      background: ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"} !important;
    }
  `);

  const activeServer = servers.find(s => s.id === activeServerId) || null;
  const themeAccent = isDark ? "#2dd4bf" : "#0f766e";
  const themeAccentSoft = isDark ? "rgba(45, 212, 191, 0.15)" : "rgba(15, 118, 110, 0.08)";
  const themeAccentBorder = isDark ? "rgba(45, 212, 191, 0.35)" : "rgba(15, 118, 110, 0.25)";
  const themeBtnBg = isDark ? "#0d9488" : "#14b8a6";

  const renderSongsView = () => {
    if (filteredSongs.length === 0) {
      return react.createElement("div", {
        style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", gap: 14 }
      },
      react.createElement("div", { style: { fontSize: 14 } }, servers.length === 0 ? "暂无 WebDAV 服务器配置" : "当前曲库尚未导入任何歌曲"),
      react.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginTop: 4 } },
        servers.length === 0 ? (
          react.createElement("button", {
            onClick: () => handleOpenAddForm(null),
            style: { padding: "7px 18px", borderRadius: 16, border: "none", background: themeBtnBg, color: "#ffffff", fontSize: 13, fontWeight: "500", cursor: "pointer" }
          }, "+ 添加 WebDAV 服务器")
        ) : (
          react.createElement(react.Fragment, null,
            react.createElement("button", {
              onClick: () => {
                setViewMode("tree");
                fetchDir(activeServer ? activeServer.rootPath : "/");
                notifyResize();
              },
              style: { padding: "7px 22px", borderRadius: 16, border: "none", background: themeBtnBg, color: "#ffffff", fontSize: 13, fontWeight: "500", cursor: "pointer" }
            }, "进入目录浏览导入歌曲")
          )
        )
      ));
    }


    return react.createElement(SongListComp, {
      ref: songListRef,
      wrapper: listWrapperRef,
      songList: filteredSongs,
      config: officialSongConfig,
      onSwitchCollectState: () => {},
      onAddTo: (idx, ev) => {
        try {
          const s = filteredSongs[idx];
          if (s) {
            playerInst.addToPlayList({ songList: [s] });
            __webpack_require__(43053).Z.show(1, "已添加到播放队列");
          }
        } catch (err) {}
      }
    });
  };

  const renderDirectoryView = () => {
    try {
      const safeDirItems = Array.isArray(dirItems) ? dirItems : [];
      const safeSongs = Array.isArray(songs) ? songs : [];
      const crumbs = getBreadcrumbs();

      return react.createElement("div", {
        style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", paddingRight: 20 }
      }, react.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
          borderRadius: 8,
          marginBottom: 10,
          fontSize: 13,
          flexShrink: 0
        }
      }, react.createElement("div", {
        style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }
      }, react.createElement("span", {
        style: { opacity: 0.6, fontSize: 12 }
      }, "当前路径:"), crumbs.map((bc, idx, arr) => react.createElement("span", {
        key: (bc.path || idx) + "_" + idx,
        style: { display: "flex", alignItems: "center", gap: 4 }
      }, react.createElement("span", {
        style: {
          cursor: idx === arr.length - 1 ? "default" : "pointer",
          color: idx === arr.length - 1 ? "#1ecc94" : (isDark ? "#ffffff" : "#111827"),
          fontWeight: idx === arr.length - 1 ? "bold" : "normal",
          textDecoration: idx === arr.length - 1 ? "none" : "underline"
        },
        onClick: () => { if (idx !== arr.length - 1) fetchDir(bc.path); }
      }, bc.name), idx !== arr.length - 1 && react.createElement("span", {
        style: { opacity: 0.4 }
      }, "/")))), react.createElement("div", {
        style: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }
      }, currentDirPath !== "/" && react.createElement("button", {
        onClick: handleGoParentDir,
        style: {
          padding: "4px 10px",
          borderRadius: 5,
          border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.12)",
          background: "transparent",
          color: isDark ? "#fff" : "#111827",
          fontSize: 12,
          cursor: "pointer",
          whiteSpace: "nowrap"
        }
      }, "返回上一级"), react.createElement("button", {
        onClick: () => fetchDir(currentDirPath),
        style: {
          padding: "4px 10px",
          borderRadius: 5,
          border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.12)",
          background: "transparent",
          color: isDark ? "#fff" : "#111827",
          fontSize: 12,
          cursor: "pointer",
          whiteSpace: "nowrap"
        }
      }, "刷新"), react.createElement("button", {
        onClick: () => handleScanCurrentFolder(currentDirPath),
        disabled: isScanning,
        style: {
          padding: "4px 12px",
          borderRadius: 5,
          border: "none",
          background: themeBtnBg,
          color: "#fff",
          fontSize: 12,
          fontWeight: "500",
          cursor: isScanning ? "not-allowed" : "pointer",
          whiteSpace: "nowrap"
        }
      }, isScanning ? "扫描中..." : "导入当前目录音频"))),
      dirErrorText ? react.createElement("div", {
        style: { padding: 30, color: "#ff5252", fontSize: 13, textAlign: "center" }
      }, dirErrorText, react.createElement("button", {
        onClick: () => fetchDir(currentDirPath),
        style: { marginLeft: 12, padding: "3px 10px", cursor: "pointer", borderRadius: 4, border: "1px solid #ff5252", background: "transparent", color: "#ff5252" }
      }, "重试")) : isDirLoading ? react.createElement("div", {
        style: { padding: 40, textAlign: "center", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 13 }
      }, "正在加载 WebDAV 目录内容...") : safeDirItems.length === 0 ? react.createElement("div", {
        style: { padding: 40, textAlign: "center", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", fontSize: 13 }
      }, "当前目录为空或无支持的音频文件") : react.createElement("div", {
        style: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }
      }, safeDirItems.map((item, idx) => {
        if (!item) return null;
        const isDir = Boolean(item.isDirectory);
        const isAdded = !isDir && safeSongs.some(s => Boolean(s && s.webDavHref && s.webDavHref === item.href));
        const displayName = item.name || (item.href ? item.href.split("/").filter(Boolean).pop() : "未知文件");
        const singerStr = (!isDir && item.song && Array.isArray(item.song.singer))
          ? item.song.singer.map(s => s && s.name).filter(Boolean).join(" / ")
          : "";

        return react.createElement("div", {
          key: (item.href || idx) + "_" + idx,
          className: "webdav_tree_row",
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "9px 14px",
            borderRadius: 6,
            cursor: "pointer",
            userSelect: "none",
            transition: "background 0.15s ease",
            fontSize: 13
          },
          onClick: () => {
            if (isDir) {
              fetchDir(item.href);
            } else if (item.song) {
              try { playerInst.playAll({ songList: [item.song], index: 0 }); } catch (_) {}
            }
          }
        }, react.createElement("div", {
          style: { display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }
        }, isDir && react.createElement("span", {
          style: { fontSize: 11, padding: "1px 5px", borderRadius: 3, background: themeAccentSoft, color: themeAccent, flexShrink: 0 }
        }, "目录"), react.createElement("span", {
          style: {
            fontWeight: isDir ? "bold" : "normal",
            color: isDir ? themeAccent : (isDark ? "#ffffff" : "#111827"),
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }
        }, displayName), singerStr && react.createElement("span", {
          style: { fontSize: 12, opacity: 0.6, flexShrink: 0 }
        }, singerStr)), react.createElement("div", {
          style: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }
        }, isDir ? react.createElement("div", {
          style: { display: "flex", alignItems: "center", gap: 8 }
        }, react.createElement("button", {
          onClick: (e) => {
            e.stopPropagation();
            handleScanCurrentFolder(item.href);
          },
          style: {
            padding: "2px 8px",
            borderRadius: 4,
            border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.1)",
            background: "transparent",
            color: themeAccent,
            fontSize: 11,
            cursor: "pointer"
          }
        }, "扫描"), react.createElement("span", {
          style: { fontSize: 12, opacity: 0.7, color: themeAccent }
        }, "进入")) : react.createElement("div", {
          style: { display: "flex", alignItems: "center", gap: 8 }
        }, (Number(item.contentLength) > 0) && react.createElement("span", {
          style: { fontSize: 12, opacity: 0.5 }
        }, (Number(item.contentLength) / (1024 * 1024)).toFixed(1) + " MB"),
        isAdded && react.createElement("span", {
          style: { fontSize: 11, padding: "1px 6px", borderRadius: 3, background: themeAccentSoft, color: themeAccent }
        }, "已添加"),
        react.createElement("button", {
          onClick: (e) => {
            e.stopPropagation();
            if (item.song) {
              try {
                playerInst.addToPlayList({ songList: [item.song] });
                __webpack_require__(43053).Z.show(1, "已加入播放列表");
              } catch (_) {}
            }
          },
          style: {
            padding: "2px 8px",
            borderRadius: 4,
            border: "none",
            background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
            color: "inherit",
            fontSize: 11,
            cursor: "pointer"
          }
        }, "加入队列"),
        isAdded ? react.createElement("button", {
          title: "从曲库移除",
          onClick: (e) => {
            e.stopPropagation();
            handleRemoveSong(item.href);
          },
          style: {
            padding: "2px 8px",
            borderRadius: 4,
            border: "none",
            background: isDark ? "rgba(248,113,113,0.15)" : "rgba(239,68,68,0.1)",
            color: "#f87171",
            fontSize: 11,
            cursor: "pointer"
          }
        }, "移除") : react.createElement("button", {
          title: "导入当前音频到曲库",
          onClick: (e) => {
            e.stopPropagation();
            handleScanCurrentFolder(item.href);
          },
          style: {
            padding: "2px 8px",
            borderRadius: 4,
            border: "none",
            background: themeAccentSoft,
            color: themeAccent,
            fontSize: 11,
            cursor: "pointer"
          }
        }, "导入"))));
      })));
    } catch (err) {
      logError("[WebDAV] renderDirectoryView error:", err);
      return react.createElement("div", {
        style: { padding: 40, textAlign: "center", color: "#ff5252", fontSize: 13 }
      }, "目录视图异常: " + (err ? err.message : "未知错误"));
    }
  };

  return react.createElement("div", {
    className: "my_favorite_page__wrapper webdav_music_page",
    style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", position: "relative" }
  }, styleEl, react.createElement("div", {
    className: "favorite__header",
    style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "16px 20px 8px 20px" }
  }, react.createElement("div", {
    style: { display: "flex", alignItems: "baseline", gap: 12 }
  }, react.createElement("span", {
    className: "favorite__header_title"
  }, "WebDAV 音乐"), react.createElement("span", {
    className: "c_tx_thin",
    style: { fontSize: 13 }
  }, activeServer ? `${activeServer.name} · 曲库共 ${filteredSongs.length} 首` : `共 ${filteredSongs.length} 首歌曲`))), react.createElement("div", {
    className: "favorite__body",
    style: { margin: 0, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }
  }, react.createElement("div", {
    className: "action__mod",
    style: { display: "flex", alignItems: "center", padding: "0 20px 12px 20px", gap: 10, flexWrap: "nowrap", overflow: "visible" }
  }, viewMode === "songs" && react.createElement("div", {
    className: "action__btn play official_play_all",
    style: {
      cursor: "pointer",
      userSelect: "none",
      height: 32,
      padding: "0 18px",
      borderRadius: 16,
      backgroundColor: themeBtnBg,
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      fontWeight: 500,
      transition: "all 0.15s ease",
      whiteSpace: "nowrap",
      flexShrink: 0
    },
    onClick: playAllSongs
  }, react.createElement("span", {
    style: { pointerEvents: "none", whiteSpace: "nowrap" }
  }, "播放全部")), react.createElement("div", {
    className: "action__btn c_btn " + (showServerManager ? "c_btn_skin" : ""),
    style: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      padding: "0 14px",
      borderRadius: 16,
      height: 32,
      background: showServerManager ? themeAccentSoft : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"),
      color: showServerManager ? themeAccent : (isDark ? "#d0d2d6" : "#374151"),
      border: showServerManager ? `1px solid ${themeAccentBorder}` : (isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)"),
      userSelect: "none",
      whiteSpace: "nowrap",
      flexShrink: 0
    },
    onClick: () => { setShowServerManager(v => !v); notifyResize(); }
  }, react.createElement("span", {
    style: { pointerEvents: "none", whiteSpace: "nowrap" }
  }, "WebDAV 设置")), react.createElement("div", {
    className: "action__btn c_btn",
    title: "提取当前曲库所有歌曲的音频头信息，匹配真实歌手、专辑、封面与歌词",
    style: {
      cursor: isMatching ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      padding: "0 14px",
      borderRadius: 16,
      height: 32,
      background: isMatching ? themeAccentSoft : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"),
      color: isMatching ? themeAccent : (isDark ? "#d0d2d6" : "#374151"),
      border: isMatching ? `1px solid ${themeAccentBorder}` : (isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)"),
      userSelect: "none",
      opacity: isMatching ? 0.9 : 1,
      whiteSpace: "nowrap",
      flexShrink: 0
    },
    onClick: () => { if (!isMatching) handleMatchMetadata(activeServerId); }
  }, react.createElement("span", {
    style: { pointerEvents: "none", whiteSpace: "nowrap" }
  }, isMatching ? (matchProgress ? `匹配中 (${matchProgress.current || 0}/${matchProgress.total || 0})` : "匹配中...") : "匹配信息")), react.createElement("div", {
    className: "action__btn c_btn",
    title: "清空当前 WebDAV 曲库列表 (只读清除本地索引，绝不删除远程文件)",
    style: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      padding: "0 14px",
      borderRadius: 16,
      height: 32,
      background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
      color: isDark ? "#d0d2d6" : "#374151",
      border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
      userSelect: "none",
      whiteSpace: "nowrap",
      flexShrink: 0
    },
    onClick: handleClearAllSongs
  }, react.createElement("span", {
    style: { pointerEvents: "none", whiteSpace: "nowrap" }
  }, "清空曲库")), react.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
      borderRadius: 16,
      padding: 2,
      userSelect: "none",
      flexShrink: 0
    }
  }, react.createElement("div", {
    style: {
      padding: "4px 14px",
      borderRadius: 14,
      cursor: "pointer",
      fontSize: 12,
      fontWeight: viewMode === "songs" ? "bold" : "normal",
      background: viewMode === "songs" ? themeBtnBg : "transparent",
      color: viewMode === "songs" ? "#ffffff" : (isDark ? "#d0d2d6" : "#374151"),
      transition: "all 0.15s ease",
      whiteSpace: "nowrap"
    },
    onClick: () => { setViewMode("songs"); notifyResize(); }
  }, "曲库歌曲 (" + filteredSongs.length + ")"), react.createElement("div", {
    style: {
      padding: "4px 14px",
      borderRadius: 14,
      cursor: "pointer",
      fontSize: 12,
      fontWeight: viewMode === "tree" ? "bold" : "normal",
      background: viewMode === "tree" ? themeBtnBg : "transparent",
      color: viewMode === "tree" ? "#ffffff" : (isDark ? "#d0d2d6" : "#374151"),
      transition: "all 0.15s ease",
      whiteSpace: "nowrap"
    },
    onClick: () => {
      setViewMode("tree");
      if (!dirItems || dirItems.length === 0) {
        fetchDir(activeServer ? activeServer.rootPath : "/");
      }
      notifyResize();
    }
  }, "目录浏览")), react.createElement("div", {
    style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }
  }, showSearchInput ? react.createElement("div", {
    className: "action__btn c_btn search input float_right",
    style: {
      width: 190,
      maxWidth: 220,
      flexShrink: 1,
      display: "flex",
      alignItems: "center",
      borderRadius: 16,
      padding: "0 12px",
      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"
    }
  }, react.createElement("input", {
    autoFocus: true,
    placeholder: "搜索歌曲、歌手、专辑...",
    value: searchText,
    style: { width: "100%", border: "none", background: "transparent", outline: "none", color: "inherit" },
    onChange: e => setSearchText(e.target.value)
  }), react.createElement("span", {
    className: "action__btn__icon search_close",
    style: { cursor: "pointer" },
    onClick: () => { setShowSearchInput(false); setSearchText(""); }
  })) : react.createElement("div", {
    className: "action__btn search normal float_right c_btn",
    style: { cursor: "pointer", display: "flex", alignItems: "center", borderRadius: 16, padding: "0 14px", height: 32, userSelect: "none" },
    onClick: () => setShowSearchInput(true)
  }, react.createElement("span", {
    className: "action__btn__icon search",
    style: { pointerEvents: "none" }
  }), react.createElement("span", {
    className: "c_txt1",
    style: { marginLeft: 4, pointerEvents: "none" }
  }, "搜索")))), showServerManager && react.createElement("div", {
    style: {
      margin: "0 20px 14px 20px",
      padding: "16px 20px",
      background: isDark ? "#232530" : "#ffffff",
      borderRadius: 10,
      border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.08)",
      boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
      color: isDark ? "#ffffff" : "#111827",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, react.createElement("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center" }
  }, react.createElement("div", {
    style: { display: "flex", alignItems: "center", gap: 12 }
  }, react.createElement("span", {
    style: { fontSize: 14, fontWeight: "bold" }
  }, "WebDAV 私有云服务 (" + servers.length + ")"), react.createElement("button", {
    onClick: () => handleOpenAddForm(null),
    style: {
      padding: "4px 10px",
      borderRadius: 4,
      border: `1px solid ${themeAccentBorder}`,
      background: "transparent",
      color: themeAccent,
      fontSize: 12,
      cursor: "pointer"
    }
  }, "+ 添加新服务器")), react.createElement("span", {
    style: { cursor: "pointer", fontSize: 12, opacity: 0.7, padding: "2px 8px" },
    onClick: () => { setShowServerManager(false); notifyResize(); }
  }, "收起 ▲")), react.createElement("div", {
    style: { display: "flex", flexDirection: "column", gap: 6, maxHeight: 160, overflowY: "auto" }
  }, servers.length === 0 ? react.createElement("div", {
    style: { fontSize: 12, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", padding: "6px 0" }
  }, "暂未配置任何 WebDAV 服务器，请在下方添加并配置") : servers.map(srv => {
    const isCur = srv.id === activeServerId;
    let cleanUrl = srv.url || '';
    try {
      const u = new URL(srv.url);
      const root = (srv.rootPath || '/').replace(/^\/+/, '');
      let p = u.pathname.replace(/\/+$/, '');
      if (root && !p.endsWith(root)) {
        p = p + '/' + root;
      }
      p = p.replace(/\/+/g, '/');
      cleanUrl = `${u.origin}${p}`;
    } catch (_) {
      cleanUrl = `${(srv.url || '').replace(/\/+$/, '')}/${(srv.rootPath || '/').replace(/^\/+/, '')}`.replace(/([^:])\/+/g, '$1/');
    }
    return react.createElement("div", {
      key: srv.id,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        borderRadius: 6,
        background: isCur ? themeAccentSoft : (isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.03)"),
        border: isCur ? `1px solid ${themeAccentBorder}` : (isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)"),
        fontSize: 13
      }
    }, react.createElement("div", {
      style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1, minWidth: 0 },
      title: "点击进入此 WebDAV 服务器目录浏览",
      onClick: () => handleOpenServerDirectory(srv)
    }, react.createElement("span", {
      style: { fontWeight: isCur ? "bold" : "normal", color: isCur ? themeAccent : "inherit" }
    }, srv.name), react.createElement("span", {
      style: { fontSize: 12, opacity: 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
    }, cleanUrl), react.createElement("span", {
      style: { fontSize: 11, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: 4, opacity: 0.8 }
    }, `${srv.songCount || 0} 首`)), react.createElement("div", {
      style: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }
    }, react.createElement("button", {
      style: {
        padding: "3px 10px",
        borderRadius: 4,
        border: `1px solid ${themeAccentBorder}`,
        background: themeAccentSoft,
        color: themeAccent,
        fontSize: 12,
        fontWeight: "500",
        cursor: "pointer"
      },
      onClick: () => handleOpenServerDirectory(srv)
    }, "进入目录"), react.createElement("span", {
      style: { color: "#60a5fa", cursor: "pointer", fontSize: 12, padding: "2px 4px" },
      onClick: () => handleOpenAddForm(srv)
    }, "编辑"), react.createElement("span", {
      style: { color: "#f87171", cursor: "pointer", fontSize: 12, padding: "2px 4px" },
      onClick: () => handleRemoveServer(srv.id)
    }, "删除")));
  })), showAddForm && react.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      paddingTop: 10,
      borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)"
    }
  }, react.createElement("div", {
    style: { fontSize: 13, fontWeight: "bold", color: themeAccent }
  }, editServerId ? "编辑 WebDAV 服务器" : "添加 WebDAV 服务器"), react.createElement("div", {
    style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }
  }, react.createElement("input", {
    type: "text",
    placeholder: "服务器备注名称 (如: 家庭 NAS)",
    value: formName,
    onChange: e => setFormName(e.target.value),
    style: {
      padding: "6px 10px",
      borderRadius: 6,
      border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.12)",
      background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.03)",
      color: isDark ? "#fff" : "#111827",
      fontSize: 12
    }
  }), react.createElement("input", {
    type: "text",
    placeholder: "服务器地址 (如: https://openlist.yuzuki74.xyz)",
    value: formUrl,
    onChange: e => setFormUrl(e.target.value.replace(/\/+$/, '')),
    style: {
      padding: "6px 10px",
      borderRadius: 6,
      border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.12)",
      background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.03)",
      color: isDark ? "#fff" : "#111827",
      fontSize: 12
    }
  }), react.createElement("input", {
    type: "text",
    placeholder: "音乐根路径 (如: /dav)",
    value: formRootPath,
    onChange: e => setFormRootPath(e.target.value),
    style: {
      padding: "6px 10px",
      borderRadius: 6,
      border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.12)",
      background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.03)",
      color: isDark ? "#fff" : "#111827",
      fontSize: 12
    }
  }), react.createElement("input", {
    type: "text",
    placeholder: "用户名 (选填)",
    value: formUsername,
    onChange: e => setFormUsername(e.target.value),
    style: {
      padding: "6px 10px",
      borderRadius: 6,
      border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.12)",
      background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.03)",
      color: isDark ? "#fff" : "#111827",
      fontSize: 12
    }
  }), react.createElement("input", {
    type: "password",
    placeholder: editServerId ? "密码 (若不修改请留空)" : "密码 (选填)",
    value: formPassword,
    onChange: e => setFormPassword(e.target.value),
    style: {
      padding: "6px 10px",
      borderRadius: 6,
      border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.12)",
      background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.03)",
      color: isDark ? "#fff" : "#111827",
      fontSize: 12
    }
  }), react.createElement("label", {
    style: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer", userSelect: "none" }
  }, react.createElement("input", {
    type: "checkbox",
    checked: formTrustSelfSigned,
    onChange: e => setFormTrustSelfSigned(e.target.checked)
  }), "信任自签名证书 (局域网 NAS)")), react.createElement("div", {
    style: { display: "flex", alignItems: "center", gap: 8, marginTop: 4 }
  }, react.createElement("button", {
    onClick: handleTestConnection,
    disabled: isTesting,
    style: {
      padding: "6px 14px",
      borderRadius: 5,
      border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)",
      background: "transparent",
      color: isDark ? "#fff" : "#111827",
      fontSize: 12,
      cursor: isTesting ? "not-allowed" : "pointer"
    }
  }, isTesting ? "测试中..." : "测试连接"), react.createElement("button", {
    onClick: () => handleSaveServer(false),
    style: {
      padding: "6px 16px",
      borderRadius: 5,
      border: "none",
      background: "#1ecc94",
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
      cursor: "pointer"
    }
  }, "保存配置"), react.createElement("button", {
    onClick: () => setShowAddForm(false),
    style: {
      padding: "6px 12px",
      borderRadius: 5,
      border: "none",
      background: "transparent",
      color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
      fontSize: 12,
      cursor: "pointer"
    }
  }, "取消"), testResultText && react.createElement("span", {
    style: {
      fontSize: 12,
      marginLeft: 8,
      color: testResultText.startsWith("✓") ? "#1ecc94" : "#ff5252"
    }
  }, testResultText))), scanStatusText && react.createElement("div", {
    style: { fontSize: 12, color: "#1ecc94" }
  }, scanStatusText)), react.createElement("div", {
    className: "fav_main_cont__wrapper",
    ref: listWrapperRef,
    style: { flex: "1 1 0", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", marginLeft: 20 }
  }, viewMode === "songs" ? renderSongsView() : renderDirectoryView())), viewMode === "songs" && filteredSongs.length > 0 && react.createElement(ScrollButtonComp, {
    config: {
      show: true,
      reload: false
    },
    scrollToTopBtnVisible: true,
    focusBtnVisible: true,
    scrollToSong: focusOnCurrentSong,
    scrollToTopFunc: scrollToTop
  }));
};

const route_config_routes = [{
  title: OnlineMusicTab,
  routes: [{
    path: '/recommend',
    component: LazyRecommend,
    exact: false,
    title: '推荐',
    cache: true,
    tab: RecommendTab
  }, {
    path: '/musicroom',
    component: LazyMusicRoom,
    exact: false,
    title: '音乐馆',
    cache: true,
    tab: MusicRoomTab
  }]
}, {
  title: MyMusicTab,
  routes: [{
    path: '/like',
    component: LazyMyFav,
    exact: false,
    title: '我喜欢',
    cache: true,
    tab: LikeTab
  }, {
    path: '/local',
    component: LocalMusicPage,
    exact: false,
    title: '本地音乐',
    cache: true,
    tab: LocalMusicTab
  }, {
    path: '/webdav',
    component: WebDavMusicPage,
    exact: false,
    title: 'WebDAV',
    cache: true,
    tab: WebDavTab
  }, {
    path: '/playlist_detail/recent',
    component: LazyPlayListDetail,
    exact: true,
    title: '最近播放',
    cache: false,
    tab: HistoryTab
  }]
}, {
  routes: [{
    path: '/playlist_detail/:tid?',
    component: LazyPlayListDetail,
    exact: false,
    cache: false
  }, {
    path: '/song_detail',
    component: LazySongDetail,
    exact: false,
    cache: false
  }, {
    path: '/album_detail',
    component: LazyAlbumDetail,
    exact: false,
    cache: false
  }, {
    path: '/singer_detail',
    component: LazySingerDetail,
    exact: false,
    cache: false
  }, {
    path: '/toplist_detail',
    component: LazyToplistDetail,
    exact: false,
    cache: false
  }, {
    path: '/category_detail',
    component: LazyCategoryDetail,
    exact: false,
    cache: false
  }, {
    path: '/mv_set',
    component: LazyMvSet,
    exact: false,
    cache: false
  }, {
    path: '/search',
    component: SearchPage,
    exact: false,
    cache: false
  }, {
    path: '/batch_operation',
    component: LazyBatchOperation,
    exact: false,
    cache: false
  }, {
    path: '*',
    component: LazyWebview,
    exact: false,
    cache: false
  }]
}];
/* harmony default export */ const route_config = (route_config_routes);
// EXTERNAL MODULE: ./src/component/play_list_detail/index.tsx + 24 modules
var play_list_detail = __webpack_require__(767);
// EXTERNAL MODULE: ./node_modules/react-router-cache-route/index.js
var react_router_cache_route = __webpack_require__(65117);
;// CONCATENATED MODULE: ./src/pages/main/components/RouterView.tsx






class RouterView extends react.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      list
    } = this.props;
    return /*#__PURE__*/react.createElement(react_router_cache_route.CacheSwitch, null, /*#__PURE__*/react.createElement(react_router/* Route */.AW, {
      exact: true,
      path: "/",
      render: () => /*#__PURE__*/react.createElement(react_router/* Redirect */.l_, {
        to: "/musicroom"
      })
    }), list.map(infos => {
      if (infos.playlists.length > 0) {
        return infos.playlists.map(playlist => {
          return /*#__PURE__*/react.createElement(react_router/* Route */.AW, {
            key: playlist.tid,
            path: `/playlist_detail/:tid`,
            component: play_list_detail.default
          });
        });
      }
    }), route_config.map(routeGroup => {
      return routeGroup.routes.map((route, index) => {
        if (route.cache) {
          return /*#__PURE__*/react.createElement(react_router_cache_route.CacheRoute, {
            path: route.path,
            key: index,
            exact: route.exact,
            className: "route_wrap js_playlist_scroll",
            render: props => {
              return /*#__PURE__*/react.createElement(route.component, props);
            }
          });
        } else {
          return /*#__PURE__*/react.createElement(react_router/* Route */.AW, {
            key: index,
            exact: route.exact,
            path: route.path,
            render: props => {
              return /*#__PURE__*/react.createElement("div", {
                className: "route_wrap js_playlist_scroll"
              }, /*#__PURE__*/react.createElement(route.component, props));
            }
          });
        }
      });
    }));
  }

}

/* harmony default export */ const components_RouterView = (RouterView);
// EXTERNAL MODULE: ./src/component/diy_menu/index.tsx
var diy_menu = __webpack_require__(90658);
// EXTERNAL MODULE: ./src/lib/components/add_playlist/index.tsx
var add_playlist = __webpack_require__(21599);
;// CONCATENATED MODULE: ./src/pages/main/components/CollectPlaylist.tsx










class CollectPlaylist extends react.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isCollapsed: false
    };

    this.toggleCollapse = () => {
      this.setState(prevState => ({
        isCollapsed: !prevState.isCollapsed
      }));
    };

    this.addPlayList = () => {
      qmfeUnityReport/* default.reportClick */.ZP.reportClick(qmfeUnityReport/* CLICK_ID.ELECTRON_CREATE_PLAYLIST_CLICK */.eF.ELECTRON_CREATE_PLAYLIST_CLICK);
      const opt = {
        dirname: '',
        songlist: []
      };
      dialog/* default.show */.ZP.show({
        mode: 'custom',
        title: '创建歌单',
        component: /*#__PURE__*/react.createElement(add_playlist/* default */.Z, {
          objArg: opt
        })
      });
    };
  }

  render() {
    const {
      list
    } = this.props;
    return /*#__PURE__*/react.createElement(react.Fragment, null, route_config.map((routeGroup, index) => {
      return /*#__PURE__*/react.createElement("div", {
        key: `${index}_${routeGroup.title}`
      }, routeGroup.title && /*#__PURE__*/react.createElement(routeGroup.title, null), routeGroup.routes.map((route, idx) => {
        if (route.tab) {
          return /*#__PURE__*/react.createElement(react_router_dom.NavLink, {
            key: `${idx}_${route.path}`,
            to: route.path,
            className: "nav_item c_btn1",
            activeClassName: "c_btn_skin txt_white"
          }, /*#__PURE__*/react.createElement(route.tab, null), /*#__PURE__*/react.createElement("div", {
            className: "nav_item_hover__bg c_bg_normal"
          }));
        }
      }));
    }), list.map((infos, index) => {
      if (infos.playlists.length > 0) {
        return /*#__PURE__*/react.createElement(react.Fragment, {
          key: `${infos.title}${index}`
        }, /*#__PURE__*/react.createElement("div", {
          className: "tab_item_cont"
        }, /*#__PURE__*/react.createElement("div", {
          className: "tab_item_title c_txt2"
        }, infos.title, infos.type === 'create' && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("a", {
          className: "tab_item_icon c_txt2",
          onClick: this.addPlayList
        }, /*#__PURE__*/react.createElement(AddPlayListIcon, {
          width: 16,
          height: 16
        })), /*#__PURE__*/react.createElement("a", {
          className: "tab_item_icon c_txt2",
          onClick: this.toggleCollapse
        }, this.state.isCollapsed ? /*#__PURE__*/react.createElement(ExpandPlayList, {
          width: 18,
          height: 18
        }) : /*#__PURE__*/react.createElement(CollapsePlayList, {
          width: 18,
          height: 18
        }))))), infos.playlists.map((playlist, idx) => {
          if (!(index == 0 && playlist.dirId == 201)) {
            // 我收藏的其它人的“我喜欢歌单”还是要显示
            let queryParams = '';

            if (infos.type === 'collect') {
              queryParams = 'collect=1';
            } else if (infos.type === 'create') {
              queryParams = 'create=1';
            }

            return /*#__PURE__*/react.createElement(react_router_dom.NavLink, {
              style: {
                display: this.state.isCollapsed && infos.type === 'create' && idx > 3 ? 'none' : ''
              },
              onContextMenu: e => {
                var _diyMenu$current;

                if (infos.type === 'collect') {
                  return;
                }

                const data = {
                  delete: {
                    text: '删除',
                    fn: () => {
                      (0,assets/* deleteSelfPlayList */.zG)(playlist, idx);
                    }
                  }
                };
                const list = [];
                list.push(data.delete);
                (_diyMenu$current = diy_menu/* default.current */.Z.current) === null || _diyMenu$current === void 0 ? void 0 : _diyMenu$current.showMenu(e, list);
              },
              key: `${(playlist === null || playlist === void 0 ? void 0 : playlist.dirName) + (playlist === null || playlist === void 0 ? void 0 : playlist.dirId)}_${idx}`,
              to: {
                pathname: `/playlist_detail/${playlist.tid}`,
                search: queryParams
              },
              className: "nav_item c_btn1",
              activeClassName: "c_btn_skin txt_white"
            }, /*#__PURE__*/react.createElement("div", {
              className: "tab_item_cont"
            }, playlist.dirName), /*#__PURE__*/react.createElement("div", {
              className: "nav_item_hover__bg c_bg_normal"
            }));
          }
        }));
      }
    }));
  }

}

/* harmony default export */ const components_CollectPlaylist = (CollectPlaylist);
// EXTERNAL MODULE: ./src/lib/common/ping.ts
var ping = __webpack_require__(20430);
// EXTERNAL MODULE: ./node_modules/antd/dist/antd.css
var antd = __webpack_require__(26946);
// EXTERNAL MODULE: ./src/pages/main/css/main.less
var css_main = __webpack_require__(17946);
;// CONCATENATED MODULE: ./src/pages/main/index.tsx
















const main_ping = new ping/* Ping */.J('https://y.qq.com/electron/index.html');

const Main = props => {
  let hasBindEventListener = false;
  const [isPlayListVisible, setPlayListVisible] = (0,stook_esm/* useStore */.oR)('PlayListVisible', false); // 自建歌单

  const [selfCreatePlayList, setSelfCreatePlayList] = (0,stook_esm/* useStore */.oR)('SelfCreatePlayList', []); // 收藏的歌单

  const [selfFavPlayList, setSelfFavPlayList] = (0,stook_esm/* useStore */.oR)('SelfFavPlayList', []);
  const [uin, setUin] = (0,stook_esm/* useStore */.oR)('uin', null);
  /**
   * 1. 上报
   * 2. 获取收藏的和创建的歌单
   * 3. init history
   * 4. 始化事件绑定
   */

  (0,react.useEffect)(() => {
    /* sdk上报-曝光上报-页面曝光-linux客户端首屏页面 */
    qmfeUnityReport/* default.reportExposurePage */.ZP.reportExposurePage(qmfeUnityReport/* PAGE_HASH.ELECTRON_INIT */.qt.ELECTRON_INIT);
    main_ping.pgvSendClick('electron.init');
    getSelfCreateAndFavPlayList();

    if (!hasBindEventListener) {
      bindEventListener();
      hasBindEventListener = true;
    }
  }, []);
  (0,react.useEffect)(() => {
    if (uin) {
      getSelfCreateAndFavPlayList();
    }
  }, [uin]);

  const getSelfCreateAndFavPlayList = () => {
    const uin = `${login/* default.musicId */.Z.musicId}`;
    if (!uin) return;
    const req = {
      getSelfCreatePLayList: (0,asset_api/* getCreatePlayList */.xu)({
        uin
      }),
      getPlaylistFavInfo: (0,asset_api/* getPlaylistFavInfo */.$H)({
        uin
      }),
      getFavSongList: (0,asset_api/* getFavSongList */.in)({
        uin
      })
    };
    (0,network/* ufetch */.D)(req).then(res => {
      if (res.code === 0) {
        if (res.getSelfCreatePLayList && res.getSelfCreatePLayList.code === 0 && res.getSelfCreatePLayList.data) {
          setSelfCreatePlayList(res.getSelfCreatePLayList.data.v_playlist.filter(item => item === null || item === void 0 ? void 0 : item.dirId));
        }

        if (res.getPlaylistFavInfo && res.getPlaylistFavInfo.code === 0 && res.getPlaylistFavInfo.data) {
          setSelfFavPlayList(res.getPlaylistFavInfo.data.v_list.map(item => {
            return { ...item,
              dirName: item.dirId === 201 ? '我喜欢' : item.name
            };
          }).filter(item => item === null || item === void 0 ? void 0 : item.dirId));
        }

        if (res.getFavSongList && res.getFavSongList.code === 0 && res.getFavSongList.data) {
          (0,stook_esm/* mutate */.JG)('FavoriteSingleSongs', res.getFavSongList.data.songlist.v_songinfo);
        }
      }
    });
  };

  const toSetPlayListVisibility = val => {
    setPlayListVisible(val);
  };

  const bindEventListener = () => {
    common_event/* default.on */.Z.on('loginStatus', status => {
      setUin(`${login/* default.musicId */.Z.musicId}`);

      if (status) {
        getSelfCreateAndFavPlayList();
      } else {
        if (props.history.location.pathname !== '/musicroom') {
          props.history.push('/musicroom');
        }

        setSelfCreatePlayList([]);
        setSelfFavPlayList([]);
      }
    });
  };

  const playlists = [{
    title: '我创建的歌单',
    playlists: selfCreatePlayList,
    type: 'create'
  }, {
    title: '我收藏的歌单',
    playlists: selfFavPlayList,
    type: 'collect'
  }];
  return /*#__PURE__*/react.createElement(react_router/* Router */.F0, {
    history: props.history
  }, /*#__PURE__*/react.createElement(PlayList, {
    isVisible: isPlayListVisible,
    switchPlayListVisibleState: toSetPlayListVisibility
  }), /*#__PURE__*/react.createElement("div", {
    className: "main c_bg1"
  }, /*#__PURE__*/react.createElement(components_CollectPlaylist, {
    list: playlists
  })), /*#__PURE__*/react.createElement("div", {
    className: "route_cont c_bg2"
  }, /*#__PURE__*/react.createElement(components_RouterView, {
    list: playlists
  }), /*#__PURE__*/react.createElement(Player, {
    isPlayListVisible: isPlayListVisible,
    onShowPlaylist: toSetPlayListVisibility
  })));
};

/* harmony default export */ const pages_main = (Main);
// EXTERNAL MODULE: ./src/lib/network/api.ts
var api = __webpack_require__(39124);
// EXTERNAL MODULE: ./src/pages/main/css/user_info_popover.less
var user_info_popover = __webpack_require__(7439);
;// CONCATENATED MODULE: ./src/pages/main/components/userInfo.tsx














class UserInfo extends react.Component {
  constructor(props) {
    super(props);

    this.emitLoginMessage = status => {
      (0,bridge/* emitIpcRenderMessage */.D)('login_message', 'login_status_change', {
        login: status
      });
    };

    this.handleVisibleChange = userInfoPopoverVisible => {
      this.setState({
        userInfoPopoverVisible
      });
    };

    this.jumpToILike = () => {
      (0,jump/* default */.Z)(jump/* PAGE_TYPE.ILIKE */.G.ILIKE, null);
      this.setState({
        userInfoPopoverVisible: false
      });
    };

    this.switchAccount = () => {
      (0,dialog/* confirm */.iG)('您确定要退出或更换其他账号登录吗？', null, '确定', () => {
        login/* default.reset */.Z.reset();
        common_event/* default.emit */.Z.emit('loginStatus', false);
        this.emitLoginMessage(false);
        setTimeout(() => {
          login/* default.loginMiniportal */.Z.loginMiniportal();
        }, 100);
      });
      this.setState({
        userInfoPopoverVisible: false
      });
    };

    this.handleShadowWindowClick = () => {
      this.setState({
        userInfoPopoverVisible: false
      });
    };

    this.state = {
      avatar: '',
      name: '',
      vipInfo: null,
      isLogin: false,
      userInfoPopoverVisible: false
    };
    this.loginout = this.loginout.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
  }

  componentDidMount() {
    external_electron_.ipcRenderer.on('login-message', this.onLoginSuccess);
    login/* default.loadLocalLoginData */.Z.loadLocalLoginData();
    login/* default.musicId */.Z.musicId && this.getUserInfo(login/* default.musicId */.Z.musicId);
    common_event/* default.on */.Z.on('launchLogin', () => {
      login/* default.loginMiniportal */.Z.loginMiniportal();
    });
    common_event/* default.on */.Z.on('loginStatus', arg => {
      if (!arg) {
        this.setState({
          name: '',
          avatar: '',
          isLogin: false
        });
      }
    });
  }

  onLoginSuccess(_, args) {
    if (args.login) {
      var _LoginMgr$loginWindow;

      login/* default */.Z === null || login/* default */.Z === void 0 ? void 0 : (_LoginMgr$loginWindow = login/* default.loginWindow */.Z.loginWindow) === null || _LoginMgr$loginWindow === void 0 ? void 0 : _LoginMgr$loginWindow.close();
      login/* default */.Z === null || login/* default */.Z === void 0 ? void 0 : login/* default.reload */.Z.reload();
      this.getUserInfo(args.uin);
      common_event/* default.emit */.Z.emit('loginStatus', true);
      this.emitLoginMessage(true);
    }
  }

  getUserInfo(uin) {
    try {
      const uin_list = [`${uin}`];
      (0,network/* ufetch */.D)({
        vip: (0,api/* getUserVipInfo */.vc)({
          uin_list
        }),
        base: (0,api/* getUserBaseInfo */.Gr)({
          vec_uin: uin_list
        })
      }).then(res => {
        const obj = {};

        if (res.code == 0 && res.base && res.base.code == 0 && res.base.data.code == 0 && res.base.data.map_userinfo) {
          if (res.base.data.map_userinfo[uin]) {
            const userInfo = res.base.data.map_userinfo[uin];
            obj.isLogin = true;
            obj.avatar = userInfo.headurl;
            obj.name = userInfo.nick;
            try { if (typeof window !== 'undefined' && window.localStorage) { localStorage.setItem('__qqmusic_user_profile__', JSON.stringify({ name: userInfo.nick, img: userInfo.headurl, uin: String(uin) })); } } catch(e) {}
          }
        }

        if (res.vip && res.base.code == 0 && res.base.data.code === 0 && res.vip.code === 0) {
          if (res.vip.data.infoMap[uin]) {
            const vipInfo = res.vip.data.infoMap[uin];
            obj.vipInfo = { ...vipInfo,
              vip: vipInfo.iVipFlag,
              svip: vipInfo.iSuperVip,
              level: vipInfo.iCurLevel
            };

            if (vipInfo.iVipFlag !== 1) {
              obj.svip = 0;
            }
          }
        }

        this.setState(obj);
      });
    } catch (e) {
      console.error(e);
    }
  }

  loginout() {
    (0,dialog/* confirm */.iG)('确定要退出登录吗？', '望三思而行！', '确定', () => {
      this.setState({
        name: '',
        avatar: '',
        isLogin: false
      });
      login/* default.reset */.Z.reset();
      common_event/* default.emit */.Z.emit('loginStatus', false);
      this.emitLoginMessage(false);
    });
  }

  onClickImg() {
    // this.props.history.push('/profile');
    // 跳转页面
    // 判断是否登录
    if (login/* default.isLogin */.Z.isLogin()) {
      (0,jump/* default */.Z)(jump/* PAGE_TYPE.PROFILE */.G.PROFILE, {});
    } else {
      login/* default.loginMiniportal */.Z.loginMiniportal();
    }
  }

  getIcon() {
    const {
      vipInfo
    } = this.state;
    let icon = '';

    if (vipInfo) {
      if (vipInfo.iVipFlag != 0 && vipInfo.ieight != 0) {
        icon = /*#__PURE__*/react.createElement(react.Fragment, null, vipInfo.iVipFlag == 1 ? /*#__PURE__*/react.createElement("img", {
          className: "top_cont_user_vip__img",
          src: utils/* default.getVipLogo */.ZP.getVipLogo(vipInfo, 0)
        }) : '', vipInfo.ieight == 1 ? /*#__PURE__*/react.createElement("img", {
          className: "top_cont_user_vip__img",
          src: utils/* default.getVipLogo */.ZP.getVipLogo(vipInfo, 1)
        }) : '');
      } else {
        icon = /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("img", {
          className: "top_cont_user_vip__img",
          src: utils/* default.getVipLogo */.ZP.getVipLogo(vipInfo, 0)
        }));
      }
    }

    return icon;
  }

  render() {
    const {
      isLogin,
      avatar,
      name,
      userInfoPopoverVisible
    } = this.state;
    const {
      jumpToILike,
      switchAccount,
      handleShadowWindowClick
    } = this;
    let maxErrorNum = 2;
    const icon = this.getIcon();
    const vip = isLogin ? /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
      className: "top_cont_user__name c_txt2"
    }, name), icon) : /*#__PURE__*/react.createElement("a", {
      className: "top_cont_user__name c_txt2",
      onClick: () => {
        login/* default.loginMiniportal */.Z.loginMiniportal();
      }
    }, "\u70B9\u51FB\u767B\u5F55");
    const UserPopOverContent = /*#__PURE__*/react.createElement("ul", {
      className: "user_info_popover__content c_bg4 c_txt1"
    }, /*#__PURE__*/react.createElement("a", {
      className: "user_info_popover__content__item",
      onClick: jumpToILike
    }, /*#__PURE__*/react.createElement("span", {
      className: "icon top_user"
    }), /*#__PURE__*/react.createElement("a", {
      className: "act_button"
    }, "\u8D44\u4EA7\u7BA1\u7406"), /*#__PURE__*/react.createElement("div", {
      className: "common_hover__bg c_bg_normal"
    })), /*#__PURE__*/react.createElement("div", {
      className: "split c_bg2"
    }), /*#__PURE__*/react.createElement("a", {
      className: "user_info_popover__content__item action",
      onClick: switchAccount
    }, /*#__PURE__*/react.createElement("span", {
      className: "icon setting__icon_exit_warn"
    }), /*#__PURE__*/react.createElement("a", {
      className: "act_button"
    }, "\u5207\u6362\u8D26\u53F7"), /*#__PURE__*/react.createElement("div", {
      className: "common_hover__bg c_bg_normal"
    })));
    return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("img", {
      src: isLogin ? avatar : 'https://y.qq.com/music/common/upload/t_cm3_photo_publish/2559244.png?max_age=2592000',
      onClick: () => this.onClickImg(),
      onError: e => {
        if (maxErrorNum > 0) {
          e.target.src = 'https://y.qq.com/mediastyle/global/img/person_300.png?max_age=2592000';
          maxErrorNum--;
        }
      },
      className: "top_cont_user__img"
    }), vip, login/* default.isLogin */.Z.isLogin() && /*#__PURE__*/react.createElement(popover/* default */.Z, {
      trigger: "click",
      content: UserPopOverContent,
      className: "user_info_drop_down__wrapper",
      onVisibleChange: this.handleVisibleChange,
      visible: userInfoPopoverVisible
    }, /*#__PURE__*/react.createElement("div", {
      className: "user_info_drop_down c_txt2"
    }, /*#__PURE__*/react.createElement(UserDropDownIcon, {
      width: 16,
      height: 16
    }))), userInfoPopoverVisible && /*#__PURE__*/react.createElement("div", {
      className: "shadow_window",
      onClick: handleShadowWindowClick
    }));
  }

}

/* harmony default export */ const userInfo = (UserInfo);
// EXTERNAL MODULE: ./src/lib/common/popup.tsx
var popup = __webpack_require__(43053);
// EXTERNAL MODULE: ./src/lib/common/update.ts
var update = __webpack_require__(74700);
;// CONCATENATED MODULE: ./src/pages/setting/components/setting_popup.tsx








const settingItemList = [{
  title: '关于',
  handleClick: () => {
    (0,bridge/* emitIpcRenderMessage */.D)('window_message', 'open_about_window');
  }
}, {
  title: '退出',
  handleClick: () => {
    (0,bridge/* emitIpcRenderMessage */.D)('app_message', 'quit');
  }
}];

const SettingPopUp = () => {
  const [popupVisible, setPopupVisible] = (0,react.useState)(false);

  const showPopup = () => {
    setPopupVisible(!popupVisible);
  };

  const popUpHandleClick = itemHandle => {
    if (itemHandle) {
      itemHandle();
    }

    showPopup();
  };

  const listenOnClick = ref => {
    if (ref) {
      ref.addEventListener('click', testClickContains);
    }
  };

  const testClickContains = ev => {
    if (!ev.target.contains(document.querySelector('.setting_popup'))) {
      document.querySelector('.shadow_window').removeEventListener('click', testClickContains);
      setPopupVisible(!popupVisible);
    }
  };

  const handleVisibleChange = val => {
    setPopupVisible(val);
  };

  const popoverContent = /*#__PURE__*/react.createElement("div", {
    className: "setting_popup c_bg4 c_txt1"
  }, /*#__PURE__*/react.createElement("ul", {
    className: "setting__list"
  }, settingItemList && settingItemList.map((item, index) => {
    const {
      title,
      handleClick
    } = item;
    return /*#__PURE__*/react.createElement("li", {
      className: "setting_list__item",
      key: index,
      onClick: () => popUpHandleClick(handleClick)
    }, title, /*#__PURE__*/react.createElement("div", {
      className: "common_hover__bg c_bg_normal"
    }));
  })));
  return /*#__PURE__*/react.createElement("div", {
    className: "top_setting_popup__wrapper"
  }, /*#__PURE__*/react.createElement(popover/* default */.Z, {
    visible: popupVisible,
    onVisibleChange: handleVisibleChange,
    trigger: "click",
    content: popoverContent
  }, /*#__PURE__*/react.createElement("div", {
    className: "setting_icon c_txt2",
    onClick: showPopup
  }, /*#__PURE__*/react.createElement(MenuDropDown, {
    width: 15,
    height: 15
  }))), popupVisible && /*#__PURE__*/react.createElement("div", {
    className: "shadow_window",
    ref: ref => listenOnClick(ref)
  }));
};

/* harmony default export */ const setting_popup = ((0,react_router/* withRouter */.EN)(SettingPopUp));
// EXTERNAL MODULE: ./src/lib/common/skin.ts
var skin = __webpack_require__(67087);
;// CONCATENATED MODULE: ./src/pages/setting/components/setting_skin.tsx







const changeSkinHandler = type => {
  (0,skin/* changeSkin */.p)(type);
};

const setting_skin_settingItemList = [{
  title: '霜茶白',
  icon: /*#__PURE__*/react.createElement("i", {
    className: "setting__icon_skin_light setting_item__icon c_bg1"
  }),
  handleClick: () => {
    changeSkinHandler('light');
  },
  className: 'white_theme'
}, {
  title: '玄潭黑',
  icon: /*#__PURE__*/react.createElement("i", {
    className: "setting__icon_skin_dark setting_item__icon c_txt1"
  }),
  handleClick: () => {
    changeSkinHandler('dark');
  },
  className: 'dark_theme'
}];

const SettingSkin = () => {
  const [popupVisible, setPopupVisible] = (0,react.useState)(false);

  const showPopup = () => {
    setPopupVisible(!popupVisible);
  };

  const popUpHandleClick = itemHandle => {
    if (itemHandle && typeof itemHandle === 'function') {
      itemHandle();
    }

    showPopup();
  };

  const listenOnClick = ref => {
    if (ref) {
      ref.addEventListener('click', testClickContains);
    }
  };

  const testClickContains = ev => {
    if (!ev.target.contains(document.querySelector('.setting_popup'))) {
      document.querySelector('.shadow_window').removeEventListener('click', testClickContains);
      setPopupVisible(!popupVisible);
    }
  };

  const handleVisibleChange = val => {
    setPopupVisible(val);
  };

  const popoverContent = /*#__PURE__*/react.createElement("div", {
    className: "setting_popup c_bg4 c_txt1"
  }, /*#__PURE__*/react.createElement("ul", {
    className: "setting__list skin"
  }, setting_skin_settingItemList && setting_skin_settingItemList.map((item, index) => {
    const {
      className,
      handleClick
    } = item;
    return /*#__PURE__*/react.createElement("li", {
      className: "setting_list__item skin",
      key: index,
      onClick: () => popUpHandleClick(handleClick)
    }, /*#__PURE__*/react.createElement("div", {
      className: `theme_block ${className}`
    }), /*#__PURE__*/react.createElement("div", {
      className: "common_hover__bg c_bg_normal"
    }));
  })));
  return /*#__PURE__*/react.createElement("div", {
    className: "top_setting_popup__wrapper"
  }, /*#__PURE__*/react.createElement(popover/* default */.Z, {
    visible: popupVisible,
    onVisibleChange: handleVisibleChange,
    trigger: "click",
    content: popoverContent
  }, /*#__PURE__*/react.createElement("div", {
    className: "setting_icon c_txt2",
    onClick: showPopup
  }, /*#__PURE__*/react.createElement(SkinChangeIcon, {
    width: 15,
    height: 15
  }))), popupVisible && /*#__PURE__*/react.createElement("div", {
    className: "shadow_window",
    ref: ref => listenOnClick(ref)
  }));
};

/* harmony default export */ const setting_skin = ((0,react_router/* withRouter */.EN)(SettingSkin));
// EXTERNAL MODULE: ./src/types/index.ts
var src_types = __webpack_require__(91713);
;// CONCATENATED MODULE: ./src/pages/main/components/topArea.tsx

// ==================== 原生声学特征识别与系统音频预内录集成 ====================
const getElectronModule = modName => {
  try {
    if (typeof window !== "undefined" && window.require) {
      return window.require(modName);
    }
  } catch (e) {}
  return null;
};

const writeRecLog = msg => {
  console.log(`[Recognize] ${msg}`);
};

const getAudioRecModule = () => {
  return getElectronModule("./audio_recognition.js");
};

// 1. 获取 Linux PulseAudio/PipeWire 默认 Sink Monitor 设备
const getDefaultSinkMonitor = () => {
  try {
    const cp = getElectronModule("child_process");
    if (cp) {
      const out = cp.execSync("pactl get-default-sink", { timeout: 1000, encoding: "utf-8" }).trim();
      if (out && !out.includes("\n")) {
        return `${out}.monitor`;
      }
    }
  } catch (e) {}
  return "@DEFAULT_SINK@.monitor";
};

// 1b. 获取 Linux PulseAudio/PipeWire 默认麦克风物理 Source 设备
const getDefaultMicrophoneDevice = () => {
  try {
    const cp = getElectronModule("child_process");
    if (cp) {
      const out = cp.execSync("pactl get-default-source", { timeout: 1000, encoding: "utf-8" }).trim();
      if (out && !out.includes("\n") && !out.toLowerCase().endsWith(".monitor")) {
        return out;
      }
      const listOut = cp.execSync("pactl list short sources", { timeout: 1000, encoding: "utf-8" });
      const lines = listOut.split("\n");
      for (const line of lines) {
        const parts = line.trim().split("\t");
        const name = parts.length > 1 ? parts[1] : line.trim();
        if (name && !name.toLowerCase().endsWith(".monitor") && !name.includes("auto_null") && !name.includes("dummy")) {
          return name;
        }
      }
    }
  } catch (e) {}
  return "@DEFAULT_SOURCE@";
};

// 检查系统命令行工具是否存在
const checkCommandExists = cmd => {
  try {
    const cp = getElectronModule("child_process");
    if (cp) {
      cp.execSync(`which ${cmd}`, { stdio: "ignore" });
      return true;
    }
  } catch (e) {}
  return false;
};

// 2. 流式音频采集会话 (麦克风优先 Web Audio，系统声卡在 Linux 优先使用 PulseAudio parec)
class StreamingAudioSession {
  constructor(sourceType = "system") {
    this.sourceType = sourceType;
    this.isCancelled = false;
    this.pcmChunks = [];
    this.totalSamples = 0;
    this.proc = null;
    this.audioContext = null;
    this.mediaStream = null;
    this.scriptNode = null;
    this.init();
  }

  init() {
    if (checkCommandExists("parec")) {
      this.initProcessAudio();
      return;
    }
    this.initWebAudio();
  }

  initWebAudio() {
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        writeRecLog("环境不支持 navigator.mediaDevices.getUserMedia，回退进程录音");
        this.initProcessAudio();
        return;
      }

      writeRecLog(`启动 Web Audio 录音会话 [${this.sourceType}]`);
      navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      }).then(stream => {
        if (this.isCancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        this.mediaStream = stream;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        let ctx;
        try {
          ctx = new AudioContextClass({ sampleRate: 16000 });
        } catch (_) {
          ctx = new AudioContextClass();
        }
        this.audioContext = ctx;
        const source = ctx.createMediaStreamSource(stream);

        const inputSampleRate = ctx.sampleRate;
        const targetSampleRate = 16000;
        const bufferSize = 2048;
        const scriptNode = ctx.createScriptProcessor ? ctx.createScriptProcessor(bufferSize, 1, 1) : null;
        if (!scriptNode) {
          writeRecLog("无法创建 ScriptProcessorNode，回退进程录音");
          this.initProcessAudio();
          return;
        }
        this.scriptNode = scriptNode;

        scriptNode.onaudioprocess = ev => {
          if (this.isCancelled) return;
          const inputData = ev.inputBuffer.getChannelData(0);
          let resampled;
          if (Math.abs(inputSampleRate - targetSampleRate) < 100) {
            resampled = inputData;
          } else {
            const ratio = inputSampleRate / targetSampleRate;
            const outputLength = Math.floor(inputData.length / ratio);
            resampled = new Float32Array(outputLength);
            for (let i = 0; i < outputLength; i++) {
              const srcPos = i * ratio;
              const idx0 = Math.floor(srcPos);
              const idx1 = Math.min(inputData.length - 1, idx0 + 1);
              const frac = srcPos - idx0;
              resampled[i] = inputData[idx0] * (1 - frac) + inputData[idx1] * frac;
            }
          }
          const count = resampled.length;
          const samples = new Int16Array(count);
          for (let i = 0; i < count; i++) {
            const s = Math.max(-1, Math.min(1, resampled[i]));
            samples[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          this.pcmChunks.push(samples);
          this.totalSamples += count;
        };

        source.connect(scriptNode);
        scriptNode.connect(ctx.destination);
      }).catch(err => {
        writeRecLog(`Web Audio 录音申请失败: ${err.message}，回退进程录音`);
        this.initProcessAudio();
      });
    } catch (e) {
      writeRecLog(`Web Audio 初始化异常: ${e.message}，回退进程录音`);
      this.initProcessAudio();
    }
  }

  initProcessAudio() {
    const cp = getElectronModule("child_process");
    if (!cp) {
      writeRecLog("无法加载 child_process 模块");
      return;
    }

    try {
      const inputDevice = this.sourceType === "system"
        ? getDefaultSinkMonitor()
        : getDefaultMicrophoneDevice();

      writeRecLog(`启动进程录音管道 [${this.sourceType}], 目标设备: ${inputDevice}`);

      const startProc = (useParec = true) => {
        if (useParec && checkCommandExists("parec")) {
          return cp.spawn("parec", [
            "-d", inputDevice,
            "--rate=16000",
            "--channels=1",
            "--format=s16le",
            "--latency-msec=64",
            "--raw"
          ]);
        } else {
          return cp.spawn("ffmpeg", [
            "-nostats",
            "-loglevel", "warning",
            "-f", "pulse",
            "-i", inputDevice,
            "-ar", "16000",
            "-ac", "1",
            "-f", "s16le",
            "pipe:1"
          ]);
        }
      };

      this.proc = startProc(true);

      const attachListeners = proc => {
        proc.stdout.on("data", chunk => {
          if (!this.isCancelled) {
            const count = Math.floor(chunk.length / 2);
            const samples = new Int16Array(count);
            for (let i = 0; i < count; i++) {
              samples[i] = chunk.readInt16LE(i * 2);
            }
            this.pcmChunks.push(samples);
            this.totalSamples += count;
          }
        });

        proc.stderr?.on("data", errChunk => {
          writeRecLog(`录音进程 stderr (${this.sourceType}): ${errChunk.toString().trim()}`);
        });

        proc.on("exit", (code, signal) => {
          writeRecLog(`录音进程退出: code=${code}, signal=${signal}, 已采集样本=${this.totalSamples}`);
          if (!this.isCancelled && this.totalSamples === 0 && code !== 0) {
            writeRecLog("parec 异常退出且无采样，回退至 ffmpeg");
            this.proc = startProc(false);
            attachListeners(this.proc);
          }
        });

        proc.on("error", err => {
          writeRecLog(`录音进程启动错误: ${err.message}`);
          if (!this.isCancelled && this.totalSamples === 0) {
            writeRecLog("录音错误，回退至 ffmpeg");
            this.proc = startProc(false);
            attachListeners(this.proc);
          }
        });
      };

      attachListeners(this.proc);
    } catch (e) {
      writeRecLog(`启动进程录音异常 (${this.sourceType}): ${e.message}`);
    }
  }

  hasMeaningfulSignal() {
    if (this.totalSamples === 0) return false;
    const windowSamples = 8000;
    const startSample = Math.max(0, this.totalSamples - windowSamples);
    const count = this.totalSamples - startSample;
    if (count <= 0) return false;

    let remaining = count;
    let sumSquares = 0;
    for (let i = this.pcmChunks.length - 1; i >= 0 && remaining > 0; i--) {
      const chunk = this.pcmChunks[i];
      const take = Math.min(remaining, chunk.length);
      const chunkStart = chunk.length - take;
      for (let j = chunkStart; j < chunk.length; j++) {
        const val = chunk[j];
        sumSquares += val * val;
      }
      remaining -= take;
    }
    const rms = Math.sqrt(sumSquares / count);
    return rms > 15;
  }

  getSnapshot() {
    if (this.totalSamples === 0) return new Int16Array(0);
    const samples = new Int16Array(this.totalSamples);
    let offset = 0;
    for (const chunk of this.pcmChunks) {
      samples.set(chunk, offset);
      offset += chunk.length;
    }

    const sampleCount = samples.length;
    if (this.sourceType === "mic" && sampleCount > 1) {
      let dcSum = 0;
      for (let i = 0; i < sampleCount; i++) dcSum += samples[i];
      const dcOffset = Math.floor(dcSum / sampleCount);

      const alpha = 0.87;
      let prev = samples[0] - dcOffset;
      samples[0] = Math.max(-32768, Math.min(32767, prev));
      for (let i = 1; i < sampleCount; i++) {
        const orig = samples[i] - dcOffset;
        const cur = orig - Math.round(alpha * prev);
        samples[i] = Math.max(-32768, Math.min(32767, cur));
        prev = orig;
      }
    }

    const agcWindowSamples = 24000;
    const agcStart = Math.max(0, sampleCount - agcWindowSamples);
    const agcCount = sampleCount - agcStart;

    let sumSquares = 0;
    for (let i = agcStart; i < sampleCount; i++) {
      sumSquares += samples[i] * samples[i];
    }
    const rms = agcCount > 0 ? Math.sqrt(sumSquares / agcCount) : 0;

    if ((this.sourceType === "mic" || rms < 2000) && rms > 80 && rms < 3000) {
      const gain = Math.min(8.0, 3200.0 / rms);
      if (gain > 1.2) {
        for (let i = 0; i < sampleCount; i++) {
          samples[i] = Math.max(-32768, Math.min(32767, Math.round(samples[i] * gain)));
        }
      }
    }

    return samples;
  }

  stop() {
    this.isCancelled = true;
    if (this.proc) {
      try { this.proc.kill("SIGKILL"); } catch (e) {}
      this.proc = null;
    }
    if (this.scriptNode) {
      try { this.scriptNode.disconnect(); } catch (_) {}
      this.scriptNode = null;
    }
    if (this.mediaStream) {
      try { this.mediaStream.getTracks().forEach(t => t.stop()); } catch (_) {}
      this.mediaStream = null;
    }
    if (this.audioContext) {
      try { this.audioContext.close(); } catch (_) {}
      this.audioContext = null;
    }
  }
}

// 3. 根据识别结果中的歌曲标识规范化官方曲库对象
const fetchNormalizedSong = async (mid, title, artist) => {
  try {
    const netMod = (typeof network !== "undefined" && network?.D) ? network : __webpack_require__(32590);
    const searchMod = (typeof search_api !== "undefined" && search_api?.d$) ? search_api : __webpack_require__(940);
    const toolMod = (typeof tools !== "undefined" && tools?.cv) ? tools : __webpack_require__(32698);

    if (!netMod?.D || !searchMod?.d$ || !toolMod?.cv) return null;

    const uinVal = (typeof login !== "undefined" && login?.Z?.musicId) ? `${login.Z.musicId}` : "0";
    const q = mid || `${title} ${artist || ""}`.trim();
    const res = await (0, netMod.D)({
      search: (0, searchMod.d$)({
        page: 0,
        number: 10,
        query: q,
        uin: uinVal,
        type: searchMod.VO.SONG
      })
    });

    if (res?.search?.data?.body?.item_song?.length > 0) {
      const items = res.search.data.body.item_song;
      const matched = items.find(it => (it.mid === mid || it.songmid === mid)) || items[0];
      const chosen = (0, toolMod.cv)(matched);
      return {
        ...chosen,
        type: chosen.type == 1 ? 0 : chosen.type
      };
    }
  } catch (e) {
    writeRecLog(`曲库歌曲规范化失败: ${e.message}`);
  }
  return null;
};

// 4. 听歌识曲顶栏组件 (RecognizeAudioComp - 支持预内录与原生声学指纹引擎)
const RecognizeAudioComp = ({ history }) => {
  const isDark = useThemeDetector();
  const [isOpen, setIsOpen] = (0, react.useState)(false);
  const [status, setStatus] = (0, react.useState)("IDLE"); // IDLE, RECORDING, ANALYZING, SUCCESS, FAILED
  const [sourceType, setSourceType] = (0, react.useState)("system");
  const [recordSec, setRecordSec] = (0, react.useState)(0);
  const [result, setResult] = (0, react.useState)(null);
  const [matchedSong, setMatchedSong] = (0, react.useState)(null);
  const [errorMsg, setErrorMsg] = (0, react.useState)("");

  const [preRollEnabled, setPreRollEnabled] = (0, react.useState)(() => {
    try {
      const saved = localStorage.getItem("audio_preroll_enabled");
      return saved === null ? true : saved === "1";
    } catch (_) {
      return true;
    }
  });

  const sessionRef = (0, react.useRef)(null);
  const timerRef = (0, react.useRef)(null);
  const containerRef = (0, react.useRef)(null);
  const isRecognizedRef = (0, react.useRef)(false);
  const songPromiseRef = (0, react.useRef)(null);

  (0, react.useEffect)(() => {
    const audioRecMod = getAudioRecModule();
    audioRecMod?.audioPreRollManager?.setEnabled(preRollEnabled);
  }, []);

  const handleTogglePreRoll = () => {
    const nextVal = !preRollEnabled;
    setPreRollEnabled(nextVal);
    try {
      localStorage.setItem("audio_preroll_enabled", nextVal ? "1" : "0");
    } catch (_) {}
    const audioRecMod = getAudioRecModule();
    audioRecMod?.audioPreRollManager?.setEnabled(nextVal);
  };

  const stopAll = () => {
    isRecognizedRef.current = true;
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const closePanel = () => {
    stopAll();
    setStatus("IDLE");
    setIsOpen(false);
  };

  (0, react.useEffect)(() => {
    const handleOutsideClick = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closePanel();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleRecognizeSuccess = recResult => {
    isRecognizedRef.current = true;
    stopAll();
    setResult(recResult);
    setStatus("SUCCESS");

    const matchPromise = fetchNormalizedSong(recResult.song?.mid, recResult.title, recResult.artist);
    songPromiseRef.current = matchPromise;
    matchPromise.then(song => {
      if (song) {
        writeRecLog(`曲库歌曲绑定成功: ${song.name || song.title}`);
        setMatchedSong(song);
      } else if (recResult.song) {
        setMatchedSong(recResult.song);
      }
    });
  };

  const startRecognition = async forcedSource => {
    stopAll();
    isRecognizedRef.current = false;
    const source = forcedSource || sourceType;
    setStatus("RECORDING");
    setRecordSec(0);
    setErrorMsg("");
    setResult(null);
    setMatchedSong(null);

    const audioRecMod = getAudioRecModule();

    // 优先检查预内录切片 (仅在开关开启且为系统声音模式时有效)
    if (preRollEnabled && audioRecMod && source === "system" && audioRecMod.audioPreRollManager?.hasReadyPreRoll(2.5)) {
      const preRollSamples = audioRecMod.audioPreRollManager.takePreRollSamples(3.5);
      if (preRollSamples && preRollSamples.length >= 16000 * 2.0) {
        writeRecLog(`预内录切片命中 (${(preRollSamples.length / 16000).toFixed(2)}s)，直接发起识别`);
        setStatus("ANALYZING");
        audioRecMod.recognizePcmAsync(preRollSamples).then(recResult => {
          if (recResult && recResult.success && !isRecognizedRef.current) {
            handleRecognizeSuccess(recResult);
          } else {
            if (!isRecognizedRef.current) {
              setStatus("RECORDING");
            }
          }
        }).catch(err => {
          writeRecLog(`预内录切片识别异常: ${err.message}`);
          if (!isRecognizedRef.current) {
            setStatus("RECORDING");
          }
        });
      }
    }

    const session = new StreamingAudioSession(source);
    sessionRef.current = session;

    const totalSeconds = 15.0;
    const sliceCheckpoints = [3.2, 5.0, 7.5, 11.0, 15.0];
    const checkedSlices = [false, false, false, false, false];
    let inflightRequests = 0;
    const startTime = Date.now();

    timerRef.current = setInterval(async () => {
      if (isRecognizedRef.current) return;
      const elapsed = (Date.now() - startTime) / 1000;
      setRecordSec(Math.min(totalSeconds, elapsed));

      for (let i = 0; i < sliceCheckpoints.length; i++) {
        if (elapsed >= sliceCheckpoints[i] && !checkedSlices[i]) {
          const samples = session.getSnapshot();
          const hasSignal = session.hasMeaningfulSignal();
          writeRecLog(`切片 [${i}] 触发 (${sliceCheckpoints[i]}s): totalSamples=${session.totalSamples}, hasSignal=${hasSignal}`);

          if (!hasSignal && session.totalSamples > 0 && elapsed < sliceCheckpoints[i] + 1.5) {
            break;
          }

          checkedSlices[i] = true;
          if (samples && samples.length >= 16000 * 1.8) {
            writeRecLog(`发起原生声学特征识别: 样本数=${samples.length} (时长 ${(samples.length / 16000).toFixed(2)}s)`);
            inflightRequests++;
            const doRec = audioRecMod
              ? audioRecMod.recognizePcmAsync(samples)
              : Promise.reject(new Error("声学识别模块加载失败"));

            doRec.then(recResult => {
              inflightRequests--;
              writeRecLog(`识别结果返回: success=${recResult?.success}, title=${recResult?.title}, artist=${recResult?.artist}`);
              if (recResult && recResult.success && !isRecognizedRef.current) {
                handleRecognizeSuccess(recResult);
              }
            }).catch(err => {
              inflightRequests--;
              writeRecLog(`识别网络异常: ${err.message}`);
            });
          }
          break;
        }
      }

      if (elapsed >= totalSeconds && !isRecognizedRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setStatus("ANALYZING");

        let waitCount = 30;
        const waitInterval = setInterval(() => {
          if (isRecognizedRef.current) {
            clearInterval(waitInterval);
            return;
          }
          if (inflightRequests <= 0 || --waitCount <= 0) {
            clearInterval(waitInterval);
            if (!isRecognizedRef.current) {
              const finalSamples = session.totalSamples;
              stopAll();
              if (finalSamples === 0) {
                setErrorMsg("未采集到有效音频信号，请检查系统音频输出或麦克风设备");
              } else {
                setErrorMsg("未能识别到匹配的歌曲信息");
              }
              setStatus("FAILED");
            }
          }
        }, 100);
      }
    }, 100);
  };

  const handleToggleOpen = () => {
    if (isOpen) {
      closePanel();
    } else {
      setIsOpen(true);
      const audioRecMod = getAudioRecModule();
      if (preRollEnabled) {
        audioRecMod?.audioPreRollManager?.wakeUp();
      }
      startRecognition();
    }
  };

  const handlePlayNow = async () => {
    try {
      const playerInst = players.Z.getInstance();
      let target = matchedSong;

      if (!target) {
        if (songPromiseRef.current) {
          __webpack_require__(43053).Z.show(0, "正在准备歌曲...");
          target = await songPromiseRef.current;
        }
        if (!target && result) {
          target = await fetchNormalizedSong(result.song?.mid, result.title, result.artist);
        }
      }

      if (target) {
        playerInst.playAll({ songList: [target], index: 0 });
        __webpack_require__(43053).Z.show(1, `正在播放: ${target.name || target.title || result.title}`);
        closePanel();
      } else {
        __webpack_require__(43053).Z.show(0, "曲库暂未收录该歌曲，可尝试前往搜索");
      }
    } catch (e) {
      logError("[Recognize] 播放错误:", e);
      __webpack_require__(43053).Z.show(0, "播放失败: " + e.message);
    }
  };

  const handleGoSearch = () => {
    if (result) {
      const query = `${result.title} ${result.artist || ""}`.trim();
      const searchInput = document.getElementById("js_search");
      if (searchInput) {
        searchInput.value = query;
      }
      const navHistory = history || (typeof common_history !== "undefined" && (common_history?.Z || common_history)) || __webpack_require__(1642).Z;
      if (navHistory && typeof navHistory.push === "function") {
        navHistory.push({
          pathname: "/search/song",
          search: `?query=${encodeURIComponent(query)}`
        });
      }
      closePanel();
    }
  };

  const isRecording = isOpen && (status === "RECORDING" || status === "ANALYZING");

  return react.createElement("div", {
    ref: containerRef,
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      marginLeft: 8,
      WebkitAppRegion: "no-drag"
    }
  },
    react.createElement("div", {
      className: "top_oper_recognize_btn" + (isRecording ? " is_active" : ""),
      title: "听歌识曲",
      onClick: handleToggleOpen,
      style: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: isRecording
          ? "rgba(30, 204, 148, 0.22)"
          : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)"),
        border: "1px solid " + (isRecording
          ? "#1ecc94"
          : (isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)")),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: isRecording ? "#1ecc94" : (isDark ? "#b0b2b8" : "#4b5563"),
        boxShadow: isRecording ? "0 0 12px rgba(30, 204, 148, 0.4)" : "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        userSelect: "none"
      }
    },
      react.createElement("svg", {
        viewBox: "0 0 24 24",
        width: 17,
        height: 17,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2.2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: { pointerEvents: "none" }
      },
        react.createElement("path", { d: "M12 2v20" }),
        react.createElement("path", { d: "M17 6v12" }),
        react.createElement("path", { d: "M7 6v12" }),
        react.createElement("path", { d: "M22 10v4" }),
        react.createElement("path", { d: "M2 10v4" })
      )
    ),

    isOpen && react.createElement("div", {
      style: {
        position: "absolute",
        top: 40,
        left: -10,
        width: 320,
        backgroundColor: isDark ? "rgba(26, 28, 36, 0.96)" : "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(18px)",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 12,
        boxShadow: isDark ? "0 12px 36px rgba(0, 0, 0, 0.65)" : "0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)",
        zIndex: 99999,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        color: isDark ? "#ffffff" : "#1f2937",
        userSelect: "none",
        animation: "fadeIn 0.18s ease-out"
      }
    },
      react.createElement("style", null, `
        @keyframes soundWaveBar {
          0% { height: 6px; }
          50% { height: 26px; }
          100% { height: 6px; }
        }
        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `),

      // 顶部标题与源切换
      react.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.06)",
          paddingBottom: 10
        }
      },
        react.createElement("span", { style: { fontWeight: 600, fontSize: 14 } }, "听歌识曲"),
        react.createElement("div", {
          style: { display: "flex", alignItems: "center", gap: 6 }
        },
          react.createElement("div", {
            onClick: handleTogglePreRoll,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              fontSize: 11,
              color: preRollEnabled ? (isDark ? "#34d399" : "#059669") : (isDark ? "#9ca3af" : "#6b7280"),
              backgroundColor: preRollEnabled
                ? (isDark ? "rgba(30, 204, 148, 0.15)" : "rgba(30, 204, 148, 0.12)")
                : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)"),
              border: "1px solid " + (preRollEnabled
                ? (isDark ? "rgba(30, 204, 148, 0.35)" : "rgba(30, 204, 148, 0.25)")
                : (isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)")),
              borderRadius: 6,
              padding: "2px 6px",
              height: 24,
              boxSizing: "border-box",
              transition: "all 0.15s ease",
              userSelect: "none"
            },
            title: preRollEnabled ? "预内录已开启 (点击关闭)" : "预内录已关闭 (点击开启)"
          },
            react.createElement("span", {
              style: {
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: preRollEnabled ? "#1ecc94" : (isDark ? "#6b7280" : "#9ca3af")
              }
            }),
            react.createElement("span", null, preRollEnabled ? "预录开" : "预录关")
          ),
          react.createElement("select", {
            value: sourceType,
            onChange: e => {
              const val = e.target.value;
              setSourceType(val);
              startRecognition(val);
            },
            style: {
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
              color: isDark ? "#d0d2d6" : "#374151",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: 6,
              fontSize: 11,
              padding: "2px 6px",
              outline: "none",
              cursor: "pointer"
            }
          },
            react.createElement("option", { value: "system", style: { backgroundColor: isDark ? "#1e2028" : "#ffffff", color: isDark ? "#ffffff" : "#111827" } }, "电脑声音 (内录)"),
            react.createElement("option", { value: "mic", style: { backgroundColor: isDark ? "#1e2028" : "#ffffff", color: isDark ? "#ffffff" : "#111827" } }, "物理麦克风")
          ),
          react.createElement("div", {
            style: {
              width: 26,
              height: 26,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: isDark ? "#9ca3af" : "#6b7280",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
              fontSize: 14,
              transition: "all 0.15s ease"
            },
            title: "关闭",
            onClick: closePanel
          }, "✕")
        )
      ),

      // 状态区：录音中
      status === "RECORDING" && react.createElement("div", {
        style: { display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 14 }
      },
        react.createElement("div", {
          style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 32 }
        },
          [0.1, 0.3, 0.5, 0.2, 0.4].map((delay, idx) =>
            react.createElement("div", {
              key: idx,
              style: {
                width: 4,
                backgroundColor: "#1ecc94",
                borderRadius: 2,
                animation: `soundWaveBar 0.9s infinite ease-in-out ${delay}s`
              }
            })
          )
        ),
        react.createElement("div", { style: { textAlign: "center" } },
          react.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: isDark ? "#ffffff" : "#111827" } },
            sourceType === "system" ? "正在聆听电脑声音..." : "正在通过麦克风聆听..."
          ),
          react.createElement("div", { style: { fontSize: 11, color: isDark ? "#8b8e96" : "#6b7280", marginTop: 4 } },
            `已录制 ${recordSec.toFixed(1)}s / 15.0s`
          )
        )
      ),

      // 状态区：分析中
      status === "ANALYZING" && react.createElement("div", {
        style: { display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 0", gap: 12 }
      },
        react.createElement("div", {
          style: {
            width: 28,
            height: 28,
            border: "3px solid rgba(30, 204, 148, 0.2)",
            borderTopColor: "#1ecc94",
            borderRadius: "50%",
            animation: "spinRing 0.8s linear infinite"
          }
        }),
        react.createElement("div", { style: { textAlign: "center" } },
          react.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: isDark ? "#ffffff" : "#111827" } }, "正在匹配曲库信息...")
        )
      ),

      // 状态区：识别成功
      status === "SUCCESS" && result && react.createElement("div", {
        style: { display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }
      },
        react.createElement("div", {
          style: {
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.06)",
            borderRadius: 8,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 6
          }
        },
          react.createElement("div", {
            style: { display: "flex", justifyContent: "space-between", alignItems: "center" }
          },
            react.createElement("span", {
              style: { fontSize: 15, fontWeight: 600, color: isDark ? "#ffffff" : "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
            }, result.title),
            react.createElement("span", {
              style: {
                fontSize: 10,
                color: "#1ecc94",
                backgroundColor: "rgba(30, 204, 148, 0.15)",
                padding: "2px 6px",
                borderRadius: 4,
                flexShrink: 0
              }
            }, typeof result.offsetSeconds === "number" && result.offsetSeconds > 0 ? `${result.offsetSeconds.toFixed(1)}s` : "识别命中")
          ),
          react.createElement("div", {
            style: { fontSize: 12, color: isDark ? "#c4c6cc" : "#4b5563", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
          }, "歌手: " + (result.artist || "未知歌手")),
          result.album && react.createElement("div", {
            style: { fontSize: 11, color: isDark ? "#8b8e96" : "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
          }, "专辑: " + result.album)
        ),
        react.createElement("div", {
          style: { display: "flex", gap: 8, marginTop: 4 }
        },
          react.createElement("button", {
            onClick: handlePlayNow,
            style: {
              flex: 1,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#1ecc94",
              border: "none",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(30, 204, 148, 0.3)"
            }
          }, "立即播放"),
          react.createElement("button", {
            onClick: handleGoSearch,
            style: {
              flex: 1,
              height: 32,
              borderRadius: 16,
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
              color: isDark ? "#d0d2d6" : "#374151",
              fontSize: 12,
              cursor: "pointer"
            }
          }, "前往搜索"),
          react.createElement("button", {
            onClick: () => startRecognition(),
            style: {
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
              color: isDark ? "#8b8e96" : "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            },
            title: "重新识别"
          }, "↻")
        )
      ),

      // 状态区：识别失败
      status === "FAILED" && react.createElement("div", {
        style: { display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 10 }
      },
        react.createElement("div", { style: { fontSize: 13, color: "#f87171", textAlign: "center" } },
          errorMsg || "未能识别到匹配的歌曲"
        ),
        react.createElement("div", { style: { display: "flex", gap: 8, marginTop: 6 } },
          react.createElement("button", {
            onClick: () => startRecognition(),
            style: {
              padding: "6px 16px",
              borderRadius: 16,
              backgroundColor: "#1ecc94",
              border: "none",
              color: "#ffffff",
              fontSize: 12,
              cursor: "pointer"
            }
          }, "重新识别"),
          react.createElement("button", {
            onClick: closePanel,
            style: {
              padding: "6px 16px",
              borderRadius: 16,
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
              border: "none",
              color: isDark ? "#d0d2d6" : "#374151",
              fontSize: 12,
              cursor: "pointer"
            }
          }, "关闭")
        )
      )
    )
  );
};
// ==================== 原生声学特征识别与预内录集成结束 ====================

class TopArea extends react.Component {
  constructor(props) {
    super(props);

    this.emitWindowActionMsg = cmd => {
      (0,bridge/* emitIpcRenderMessage */.D)('window_message', cmd, {
        windowName: src_types/* WindowName.MAIN_WINDOW */.IA.MAIN_WINDOW
      });
    };

    this.onClickMinimize = () => {
      this.emitWindowActionMsg('minimize');
    };

    this.onClickMaximize = () => {
      this.emitWindowActionMsg('maximize');
    };

    this.onClickUnMaximize = () => {
      this.emitWindowActionMsg('unmaximize');
    };

    this.onClickClose = () => {
      try {
        if (typeof external_electron_ !== "undefined" && external_electron_.ipcRenderer) {
          external_electron_.ipcRenderer.send("app-quit-force");
          return;
        }
      } catch (e) {}
      try {
        (0, bridge/* emitIpcRenderMessage */.D)("window_message", "close", {
          windowName: src_types/* WindowName.MAIN_WINDOW */.IA.MAIN_WINDOW
        });
      } catch (e) {}
    };

    this.onClickBack = () => {
      this.props.history.goBack();
    };

    this.onClickForward = () => {
      this.props.history.goForward();
    };

    this.onClickSearch = () => {
      const search = document.getElementById('js_search');
      let value = search.value || '';
      value = utils/* default.myEncode */.ZP.myEncode(utils/* default.entityReplace */.ZP.entityReplace(value)).replace(/^\s*|\s*$/g, '');

      if (!value) {
        popup/* default.show */.Z.show(0, '请输入搜索关键字');
        return;
      }

      this.props.history.push(`/search?query=${value}`);
    };

    this.switchToVisiblePlayMode = () => {
      (0,bridge/* emitIpcRenderMessage */.D)('window_message', 'open_visible_play_window');
    };

    this.state = {
      isMaximize: false
    };
    this.onClickMaximize = this.onClickMaximize.bind(this);
    this.onClickUnMaximize = this.onClickUnMaximize.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
    this.onClickForward = this.onClickForward.bind(this);
    this.onClickSearch = this.onClickSearch.bind(this);
    this.winEvent();
  }

  winEvent() {
    const mainWinId = external_electron_.remote.getGlobal('mainWinId');
    const mainWin = external_electron_.remote.BrowserWindow.fromId(mainWinId);
    mainWin.on('maximize', () => {
      this.setState({
        isMaximize: true
      });
    });
    mainWin.on('unmaximize', () => {
      this.setState({
        isMaximize: false
      });
    });
  }

  render() {
    const {
      onClickClose,
      onClickMinimize,
      onClickBack,
      onClickSearch,
      onClickForward,
      onClickUnMaximize,
      onClickMaximize
    } = this;
    const maxIcon = this.state.isMaximize ? /*#__PURE__*/react.createElement("div", {
      className: "top_oper_img top_oper_img--windowicon c_txt2",
      onClick: onClickUnMaximize
    }, /*#__PURE__*/react.createElement(MinMode, {
      width: 18,
      height: 18
    })) : /*#__PURE__*/react.createElement("div", {
      className: "top_oper_img top_oper_img--windowicon c_txt2",
      onClick: onClickMaximize
    }, /*#__PURE__*/react.createElement(Maximize, {
      width: 18,
      height: 18
    }));
    return /*#__PURE__*/react.createElement("div", {
      className: "top_cont"
    }, /*#__PURE__*/react.createElement("div", {
      className: "top_cont_left c_txt1"
    }, /*#__PURE__*/react.createElement(QQMusicLogo, {
      className: "top_theme"
    })), /*#__PURE__*/react.createElement("div", {
      className: "top_cont_right"
    }, /*#__PURE__*/react.createElement("div", {
      className: "top_oper_cont"
    }, /*#__PURE__*/react.createElement("a", {
      className: "top_oper_img c_txt2",
      onClick: onClickBack
    }, /*#__PURE__*/react.createElement(BackForwardIcon, null)), /*#__PURE__*/react.createElement("a", {
      className: "top_oper_img top_oper_img--right c_txt2",
      onClick: onClickForward
    }, /*#__PURE__*/react.createElement(ForwardBtnIcon, null)), /*#__PURE__*/react.createElement("div", {
      className: "top_oper_search c_btn"
    }, /*#__PURE__*/react.createElement("input", {
      type: "text",
      placeholder: "\u641C\u7D22\u97F3\u4E50",
      className: "top_oper_search__input",
      id: "js_search",
      onKeyDown: e => {
        if (e.keyCode === 13) {
          this.onClickSearch();
        }
      }
    }), /*#__PURE__*/react.createElement("a", {
      className: "top_search_img c_txt2",
      onClick: onClickSearch
    }, /*#__PURE__*/react.createElement(SearchIcon, null))), /*#__PURE__*/react.createElement(RecognizeAudioComp, {
      history: this.props.history
    })), /*#__PURE__*/react.createElement("div", {
      className: "top_cont_user"
    }, /*#__PURE__*/react.createElement(userInfo, null)), /*#__PURE__*/react.createElement("div", {
      className: "top_setting"
    }, /*#__PURE__*/react.createElement(setting_skin, null)), /*#__PURE__*/react.createElement("div", {
      className: "top_setting"
    }, /*#__PURE__*/react.createElement(setting_popup, null)), /*#__PURE__*/react.createElement("div", {
      className: "top_split c_txt2"
    }, /*#__PURE__*/react.createElement(SplitIcon, null)), /*#__PURE__*/react.createElement("div", {
      className: "top_system_cont"
    }, /*#__PURE__*/react.createElement("div", {
      className: "top_oper_img top_oper_img--min c_txt2",
      onClick: onClickMinimize
    }, /*#__PURE__*/react.createElement(Minimize, {
      width: 18,
      height: 18
    })), maxIcon, /*#__PURE__*/react.createElement("div", {
      className: "top_oper_img top_oper_img--close c_txt2",
      onClick: onClickClose
    }, /*#__PURE__*/react.createElement(Close, {
      width: 18,
      height: 18
    })))));
  }

}
// EXTERNAL MODULE: ./src/lib/accelator.ts
var accelator = __webpack_require__(50016);
// EXTERNAL MODULE: ./src/lib/common/history.ts
var common_history = __webpack_require__(1642);
// EXTERNAL MODULE: ./src/pages/cover_player/css/index.less
var css = __webpack_require__(444);
// EXTERNAL MODULE: ./src/pages/cover_player/css/top.css
var css_top = __webpack_require__(60214);
;// CONCATENATED MODULE: ./src/pages/cover_player/compoent/top.tsx





class top_CoverPlayer extends react.Component {
  constructor(props) {
    super(props);

    this.emitWindowActionMsg = cmd => {
      (0,bridge/* emitIpcRenderMessage */.D)('window_message', cmd, {
        windowName: src_types/* WindowName.MAIN_WINDOW */.IA.MAIN_WINDOW
      });
    };

    this.onClickMaximize = () => {
      this.emitWindowActionMsg('maximize');
      this.setState({
        isMaximize: true
      });
      return;
    };

    this.onClickUnMaximize = () => {
      this.emitWindowActionMsg('unmaximize');
      this.setState({
        isMaximize: false
      });
    };

    this.onClickMinimize = () => {
      this.emitWindowActionMsg('minimize');
    };

    this.onClickClose = () => {
      try {
        if (typeof external_electron_ !== "undefined" && external_electron_.ipcRenderer) {
          external_electron_.ipcRenderer.send("app-quit-force");
          return;
        }
      } catch (e) {}
      try {
        (0, bridge/* emitIpcRenderMessage */.D)("window_message", "close", {
          windowName: src_types/* WindowName.MAIN_WINDOW */.IA.MAIN_WINDOW
        });
      } catch (e) {}
    };

    this.onClickToggleShow = () => {
      (0,stook_esm/* mutate */.JG)('IsCoverPlayerVisible', false);
    };

    this.state = {
      isMaximize: false
    };
  }

  render() {
    const maxIcon = this.state.isMaximize ? /*#__PURE__*/react.createElement("img", {
      src: __webpack_require__(52679)/* .default */ .Z,
      className: "top_oper_img top_oper_img--windowicon",
      draggable: false,
      style: { WebkitAppRegion: 'no-drag', cursor: 'pointer', pointerEvents: 'auto', WebkitUserDrag: 'none' },
      onClick: this.onClickUnMaximize,
      title: "还原"
    }) : /*#__PURE__*/react.createElement("img", {
      src: __webpack_require__(24)/* .default */ .Z,
      className: "top_oper_img top_oper_img--windowicon",
      draggable: false,
      style: { WebkitAppRegion: 'no-drag', cursor: 'pointer', pointerEvents: 'auto', WebkitUserDrag: 'none' },
      onClick: this.onClickMaximize,
      title: "最大化"
    });
    return /*#__PURE__*/react.createElement("div", {
      className: "cover_player_page_top_cont_cover",
      style: { WebkitAppRegion: 'no-drag', pointerEvents: 'auto' }
    }, /*#__PURE__*/react.createElement("a", {
      className: "cover_player_page_top_cont left",
      style: { WebkitAppRegion: 'no-drag', cursor: 'pointer', pointerEvents: 'auto' },
      onClick: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.onClickToggleShow();
      },
      title: "收起播放界面"
    }, /*#__PURE__*/react.createElement("img", {
      src: __webpack_require__(3426)/* .default */ .Z,
      className: "top_oper_img top_oper_img--fallback",
      draggable: false,
      style: { pointerEvents: 'none', WebkitUserDrag: 'none' }
    })), /*#__PURE__*/react.createElement("div", {
      className: "cover_player_page_top_drag_handle",
      style: { flex: 1, height: '100%', WebkitAppRegion: 'drag' }
    }), /*#__PURE__*/react.createElement("div", {
      className: "cover_player_page_top_cont right",
      style: { WebkitAppRegion: 'no-drag', pointerEvents: 'auto', display: 'flex', alignItems: 'center', zIndex: 999999 }
    }, /*#__PURE__*/react.createElement("img", {
      src: __webpack_require__(72410)/* .default */ .Z,
      className: "top_oper_img top_oper_img--min",
      draggable: false,
      style: { WebkitAppRegion: 'no-drag', cursor: 'pointer', pointerEvents: 'auto', WebkitUserDrag: 'none' },
      onClick: this.onClickMinimize,
      title: "最小化"
    }), maxIcon, /*#__PURE__*/react.createElement("img", {
      src: __webpack_require__(63126)/* .default */ .Z,
      className: "top_oper_img top_oper_img--close",
      draggable: false,
      style: { WebkitAppRegion: 'no-drag', cursor: 'pointer', pointerEvents: 'auto', zIndex: 999999, WebkitUserDrag: 'none' },
      onClick: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.onClickToggleShow();
      },
      title: "关闭播放界面"
    })));
  }

}
top_CoverPlayer.defaultProps = {
  isShow: false
};
// EXTERNAL MODULE: ./src/pages/lyric/parser/index.ts
var parser = __webpack_require__(8437);
;// CONCATENATED MODULE: ./src/pages/lyric/animate/index.ts
let timer = null;
const animate = (elem, origin, now, time) => {
  const percent = (now - origin) / time;
  timer && clearInterval(timer);
  let count = 0;
  timer = setInterval(() => {
    count++;

    if (count >= time) {
      clearInterval(timer);
    } else {
      origin = origin + percent;
      elem.scrollTop = origin;
    }
  }, 1);
};
// EXTERNAL MODULE: ./src/pages/lyric/css/index.less
var lyric_css = __webpack_require__(39926);
;// CONCATENATED MODULE: ./src/pages/lyric/index.tsx











const DEFAULT_TITLE = 'QQ音乐，让生活充满音乐';
const Lyric = ({
  song,
  currentTime
}) => {
  var _song$album;

  const [lyricList, setLyricList] = (0,react.useState)([]);
  const [currentLyricIdx, setCurrentLyricIdx] = (0,react.useState)(-1);
  const [isTransEnabled, setIsTransEnabled] = (0,react.useState)((typeof localStorage !== "undefined" && localStorage.getItem("qqmusic_show_trans") !== "false"));
  const [hasTrans, setHasTrans] = (0,react.useState)(false);
  const [isMatchedEnabled, setIsMatchedEnabled] = (0,react.useState)(false);
  const [matchedSongInfo, setMatchedSongInfo] = (0,react.useState)("");
  const isManualMatchedRef = (0,react.useRef)((typeof localStorage !== "undefined" && localStorage.getItem("qqmusic_lrc_manual_match") === "true"));
  const localLyricBackupRef = (0,react.useRef)(null);
  const isMatchingRef = (0,react.useRef)(false);
  const lastFallbackLocalTransRef = (0,react.useRef)(false);
  const [isImmersive, setIsImmersive] = (0,react.useState)(false);
  const [showImmersiveBtn, setShowImmersiveBtn] = (0,react.useState)(true);
  const [toastText, setToastText] = (0,react.useState)("");
  const hideTimerRef = (0,react.useRef)(null);
  const toastTimerRef = (0,react.useRef)(null);

  const exitImmersive = () => {
    setIsImmersive(false);
    setShowImmersiveBtn(true);
    setToastText("");
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    try {
      const layout = document.querySelector(".cover_layout");
      if (layout) layout.classList.remove("immersive-mode");
    } catch (err) {}
  };

  const toggleImmersive = () => {
    const next = !isImmersive;
    setIsImmersive(next);
    try {
      const layout = document.querySelector(".cover_layout");
      if (layout) {
        if (next) layout.classList.add("immersive-mode");
        else layout.classList.remove("immersive-mode");
      }
    } catch (e) {}
    if (next) {
      setShowImmersiveBtn(true);
      setToastText("双击或按 ESC 退出沉浸模式");
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setToastText("");
      }, 3000);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setShowImmersiveBtn(false);
      }, 3000);
    } else {
      exitImmersive();
    }
  };

  // 仅在双击鼠标 (dblclick) 或按下 ESC 时退出沉浸模式并恢复显示
  (0,react.useEffect)(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isImmersive) {
        exitImmersive();
      }
    };
    const handleDblClick = (e) => {
      if (isImmersive) {
        exitImmersive();
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("dblclick", handleDblClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("dblclick", handleDblClick);
    };
  }, [isImmersive]);
  const lyricListRef = /*#__PURE__*/react.createRef();
  const lastUserScrollRef = (0,react.useRef)(0);

  // 安全 Base64 解码器
  const decodeBase64 = (b64) => {
    if (!b64 || typeof b64 !== "string") return "";
    try {
      if (typeof Buffer !== "undefined") {
        return Buffer.from(b64, "base64").toString("utf8");
      }
      return decodeURIComponent(escape(atob(b64)));
    } catch (e) {
      try { return atob(b64); } catch (err) { return ""; }
    }
  };

  // 高精度 LRC 解析器
  const parseLrcText = (lrcText) => {
    if (!lrcText || typeof lrcText !== "string") return [];
    const list = [];
    const lines = lrcText.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const matches = [...trimmed.matchAll(/\[(\d{1,2}):(\d{1,2})(?:[\.:](\d{1,3}))?\]/g)];
      if (matches.length > 0) {
        const text = trimmed.replace(/\[\d{1,2}:\d{1,2}(?:[\.:]\d{1,3})?\]/g, "").trim().replace(/&apos;/g, "’");
        if (!text) continue;
        for (const m of matches) {
          const min = parseInt(m[1], 10);
          const sec = parseInt(m[2], 10);
          let ms = 0;
          if (m[3]) {
            ms = parseInt(m[3].padEnd(3, "0").slice(0, 3), 10);
          }
          const time = min * 60000 + sec * 1000 + ms;
          list.push({ time, context: text });
        }
      }
    }
    return list.sort((a, b) => a.time - b.time);
  };

  // 注入现代极简、莫奈色彩与居中对齐样式表
  (0,react.useEffect)(() => {
    if (typeof document !== "undefined" && !document.getElementById("qqmusic_modern_theme_css")) {
      const st = document.createElement("style");
      st.id = "qqmusic_modern_theme_css";
      st.textContent = `
        /* 全局高质量平滑中文字体族优先注入 (Noto Sans CJK SC > Source Han Sans SC > PingFang SC 等) */
        *, *::before, *::after, body, html, button, input, select, textarea, .cover_layout, .layout_page, .lyric-list {
          font-family: "Noto Sans CJK SC", "Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          text-rendering: optimizeLegibility !important;
        }

        /* 仅在全屏播放器激活时消除滚动条 */
        .cover_layout, .cover_layout.immersive-mode {
          overflow: hidden !important;
          max-height: 100vh !important;
          height: 100vh !important;
        }
        .cover_layout ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .cover_layout * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        /* 彻底移除杂乱模糊背景与遮罩 */
        .cover_layout .cover_layout_blur,
        .cover_layout .cover_layout_shadow {
          display: none !important;
        }

        /* 隐藏全屏播放器左下角多余的重复时间文本 */
        .cover_layout .player_time--cover,
        .cover_layout .player_cont_state_tool .player_time,
        .cover_layout .player_cont_state_tool .player_time--cover {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* 将全屏播放器左下角工具栏按钮（评论图标、更多菜单）设为亮色 */
        .cover_layout .player_cont_state_tool .player_cont_state_tool_comment,
        .cover_layout .player_cont_state_tool .player_cont_state_tool_menu {
          background-color: rgba(255, 255, 255, 0.8) !important;
          opacity: 0.85 !important;
          cursor: pointer !important;
          transition: all 0.25s ease !important;
        }
        .cover_layout.theme-light .player_cont_state_tool .player_cont_state_tool_comment,
        .cover_layout.theme-light .player_cont_state_tool .player_cont_state_tool_menu {
          background-color: rgba(255, 255, 255, 0.8) !important;
        }
        .cover_layout .player_cont_state_tool .player_cont_state_tool_comment:hover,
        .cover_layout .player_cont_state_tool .player_cont_state_tool_menu:hover {
          background-color: #1ecc94 !important;
          opacity: 1 !important;
          transform: scale(1.08) !important;
        }

        /* 解决全屏播放页穿透问题与莫奈背景平滑过渡 */
        .cover_layout {
          z-index: 100 !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background-color: var(--play-monet-bg, #1a1c22) !important;
          transition: background-color 0.6s cubic-bezier(0.2, 0, 0, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
          overflow-x: hidden !important;
        }
        
        /* 确保所有弹出的 Popover、右键菜单、播放列表抽屉永远处于最高层级 */
        .ant-popover,
        .ant-popover-placement-top,
        .ant-popover-placement-bottom,
        .ant-dropdown,
        .rc-dropdown,
        .playlist_cont,
        .mod_playlist,
        .menu_wrapper,
        .context_menu,
        .player_mode_popover__content {
          z-index: 10001 !important;
        }

        /* 仅在全屏播放器处于激活展示状态时精准隐藏右下角多余悬浮按钮 */
        body.in-cover-player .btn_position,
        body.in-cover-player .btn_top,
        body.in-cover-player .js_btn_position,
        body.in-cover-player .js_btn_top,
        body.in-cover-player [class*="btn_position"],
        body.in-cover-player [class*="btn_top"],
        body.in-cover-player .scroll_button {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* 浅色主题默认变量 (采用与深色模式一致的莫奈基底，高对比白字与通透歌词) */
        .cover_layout.theme-light {
          --play-text-title: #ffffff;
          --play-text-sub: #e5e7eb;
          --play-lyric-dim: rgba(255, 255, 255, 0.50);
          --play-lyric-hover: rgba(255, 255, 255, 0.90);
          --play-lyric-cur: #1ecc94;
          --play-lyric-trans-dim: rgba(255, 255, 255, 0.40);
          --play-lyric-trans-cur: #1ecc94;
          --play-badge-bg: rgba(255, 255, 255, 0.12);
          --play-badge-border: rgba(255, 255, 255, 0.22);
          --play-badge-text: #ffffff;
          --play-progress-track: rgba(255, 255, 255, 0.18);
          --play-progress-buffer: rgba(255, 255, 255, 0.28);
          --play-progress-fill: #1ecc94;
          --play-progress-dot: #ffffff;
          --play-album-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.4), 0 6px 12px -2px rgba(0, 0, 0, 0.25);
        }

        /* 深色主题默认变量 */
        .cover_layout.theme-dark {
          --play-text-title: #ffffff;
          --play-text-sub: #a1a1aa;
          --play-lyric-dim: rgba(255, 255, 255, 0.45);
          --play-lyric-hover: rgba(255, 255, 255, 0.88);
          --play-lyric-cur: #1ecc94;
          --play-lyric-trans-dim: rgba(255, 255, 255, 0.36);
          --play-lyric-trans-cur: #1ecc94;
          --play-badge-bg: rgba(255, 255, 255, 0.1);
          --play-badge-border: rgba(255, 255, 255, 0.2);
          --play-badge-text: #ffffff;
          --play-progress-track: rgba(255, 255, 255, 0.15);
          --play-progress-buffer: rgba(255, 255, 255, 0.25);
          --play-progress-fill: #1ecc94;
          --play-progress-dot: #ffffff;
          --play-album-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.5), 0 6px 12px -2px rgba(0, 0, 0, 0.35);
        }

        /* 顶部栏与底部栏平滑淡出隐藏动画 */
        .cover_layout .cover_player_page_top_cont_cover,
        .cover_layout .cover_player {
          transition: opacity 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }
        .cover_layout.immersive-mode .cover_player_page_top_cont_cover {
          opacity: 0 !important;
          pointer-events: none !important;
          transform: translateY(-50px) !important;
        }
        .cover_layout.immersive-mode .cover_player {
          opacity: 0 !important;
          pointer-events: none !important;
          transform: translateY(50px) !important;
        }

        /* 顶部栏容器与按钮：保证按钮永远可点击，绝不受 drag 阻断 */
        .top_cont {
          width: 100% !important;
          max-width: 100% !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
          box-sizing: border-box !important;
          -webkit-app-region: drag !important;
        }
        .cover_layout .cover_player_page_top_cont_cover {
          width: 100% !important;
          max-width: 100% !important;
          height: 80px !important;
          padding: 0 40px !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
          box-sizing: border-box !important;
          -webkit-app-region: no-drag !important;
          pointer-events: auto !important;
          z-index: 1000 !important;
        }
        .top_system_cont,
        .top_oper_cont,
        .top_oper_img,
        .top_oper_img--close,
        .top_oper_img--min,
        .top_oper_img--windowicon,
        .cover_layout .cover_player_page_top_cont_cover .cover_player_page_top_cont,
        .cover_layout .cover_player_page_top_cont_cover .top_oper_img {
          -webkit-app-region: no-drag !important;
          pointer-events: auto !important;
          cursor: pointer !important;
          z-index: 99999 !important;
        }

        /* 全屏现代多语言排版字体栈 */
        .cover_layout, .cover_layout * {
          font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Noto Sans", "Noto Sans CJK SC", "Source Han Sans SC", "Noto Sans CJK JP", "Source Han Sans JP", "Noto Sans CJK KR", "Noto Sans SC", system-ui, sans-serif, "Noto Color Emoji" !important;
          -webkit-font-smoothing: antialiased !important;
          text-rendering: optimizeLegibility !important;
        }

        /* 主体内容与底部控制栏：基于黄金比例对称布局 */
        .cover_layout .cover_player_page_main_cont,
        .cover_layout .cover_player {
          width: 100% !important;
          max-width: 100% !important;
          padding-left: clamp(36px, 5.8vw, 110px) !important;
          padding-right: clamp(36px, 5.8vw, 110px) !important;
          box-sizing: border-box !important;
          transition: padding 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }

        /* 主体内容区：等比例扩展，并赋予丝滑缩放动效 */
        .cover_layout .cover_player_page_main_cont {
          flex: 1 !important;
          margin: 0 auto 8px auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: clamp(36px, 5.8vw, 110px) !important;
          overflow: hidden !important;
          transition: gap 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), padding 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }
        .cover_layout.immersive-mode .cover_player_page_main_cont {
          height: 100vh !important;
          max-height: 100vh !important;
          margin: 0 auto !important;
          padding-left: clamp(48px, 7vw, 130px) !important;
          padding-right: clamp(48px, 7vw, 130px) !important;
          gap: clamp(48px, 7vw, 130px) !important;
        }

        /* 封面容器：宽度严格由内部图片决定 (fit-content)，彻底防止任何脱节 */
        .cover_layout .cover_album__wrapper {
          flex: 0 0 auto !important;
          width: fit-content !important;
          max-width: 52% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          justify-content: center !important;
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          margin-top: 4px !important;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }
        .cover_layout .cover_album {
          width: min(38.5vw, 59vh, 880px) !important;
          height: min(38.5vw, 59vh, 880px) !important;
          min-width: 230px !important;
          min-height: 230px !important;
          max-width: 1000px !important;
          max-height: 1000px !important;
          aspect-ratio: 1 / 1 !important;
          object-fit: cover !important;
          flex-shrink: 0 !important;
          border-radius: 7px !important;
          box-shadow: var(--play-album-shadow) !important;
          display: block !important;
          transition: width 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }
        .cover_layout.immersive-mode .cover_album {
          width: min(41vw, 68vh, 1050px) !important;
          height: min(41vw, 68vh, 1050px) !important;
        }

        /* 封面下方歌曲信息容器：两行通栏层叠排版，宽度 100% 恒定等于封面实际宽度 */
        .cover_layout .cover_song_meta {
          width: 100% !important;
          max-width: 100% !important;
          margin-top: 14px !important;
          padding-left: 6px !important;
          padding-right: 6px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          justify-content: flex-start !important;
          user-select: none !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
        }

        /* 跑马灯外层包装容器 */
        .cover_layout .marquee_wrap {
          width: 100% !important;
          max-width: 100% !important;
          overflow: hidden !important;
          position: relative !important;
          box-sizing: border-box !important;
        }

        /* 跑马灯内层移动主体 */
        .cover_layout .marquee_wrap .marquee_inner {
          display: inline-block !important;
          white-space: nowrap !important;
          will-change: transform !important;
          max-width: 100% !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          vertical-align: middle !important;
        }

        /* Hover 触发跑马灯滚动时展开全部文本以平滑平移 */
        .cover_layout .marquee_wrap:hover .marquee_inner {
          overflow: visible !important;
          text-overflow: clip !important;
          max-width: none !important;
        }

        /* 第一行：歌曲标题（整行通栏 100% 宽度，大号粗体白字） */
        .cover_layout .cover_song_title {
          width: 100% !important;
          max-width: 100% !important;
          font-size: clamp(21px, 1.65vw, 26px) !important;
          font-weight: 700 !important;
          line-height: 1.25 !important;
          color: var(--play-text-title, #ffffff) !important;
          letter-spacing: -0.2px !important;
          text-align: left !important;
          margin: 0 0 6px 0 !important;
          cursor: default !important;
        }

        /* 第二行：歌手 · 专辑（整行通栏 100% 宽度） */
        .cover_layout .cover_song_subrow {
          width: 100% !important;
          max-width: 100% !important;
          font-size: clamp(14px, 1.05vw, 16px) !important;
          font-weight: 600 !important;
          line-height: 1.4 !important;
          color: var(--play-text-sub, #a1a1aa) !important;
          cursor: default !important;
        }

        .cover_layout .cover_song_singer {
          font-weight: 600 !important;
          color: var(--play-text-sub, #a1a1aa) !important;
          white-space: nowrap !important;
        }
        .cover_layout .cover_singer_link {
          cursor: pointer !important;
          font-weight: 600 !important;
          transition: color 0.2s ease !important;
        }
        .cover_layout .cover_singer_link:hover {
          color: #1ecc94 !important;
        }

        .cover_layout .cover_song_split {
          margin: 0 6px !important;
          opacity: 0.5 !important;
          user-select: none !important;
        }

        .cover_layout .cover_song_album {
          font-weight: 600 !important;
          color: var(--play-text-sub, #a1a1aa) !important;
          cursor: pointer !important;
          white-space: nowrap !important;
          transition: color 0.2s ease !important;
        }
        .cover_layout .cover_song_album:hover {
          color: #1ecc94 !important;
        }

        /* 歌词列表容器：等比例自适应宽度，全高 */
        .cover_layout .layout_page {
          flex: 1.18 !important;
          width: 100% !important;
          max-width: clamp(460px, 44vw, 860px) !important;
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          transition: max-width 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }
        .cover_layout .lyric-list {
          position: relative !important;
          width: 100% !important;
          overflow-y: auto !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          padding: 0 8px !important;
          box-sizing: border-box !important;
        }
        .cover_layout .lyric-list::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* 歌词条目：窗口模式下基础字号加大 2 号 */
        .cover_layout .lyric-list .item {
          height: auto !important;
          min-height: 32px !important;
          line-height: normal !important;
          margin-top: clamp(14px, 1.3vh, 20px) !important;
          margin-bottom: clamp(14px, 1.3vh, 20px) !important;
          text-align: center !important;
          cursor: pointer !important;
          user-select: none !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease !important;
        }
        .cover_layout .lyric-list .item:hover .lyric_main {
          color: var(--play-lyric-hover, #ffffff) !important;
          transform: scale(1.02) !important;
        }

        /* 普通歌词：窗口模式下加大 2 号 (20px~25px，行高 30px~36px) */
        .cover_layout .lyric_main {
          font-size: clamp(20px, 1.55vw, 25px) !important;
          line-height: clamp(30px, 2.2vw, 36px) !important;
          color: var(--play-lyric-dim, rgba(255, 255, 255, 0.45)) !important;
          font-weight: 500 !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          transition: all 0.25s cubic-bezier(0.2, 0, 0, 1) !important;
        }
        /* 翻译歌词：窗口模式下加大 2 号 (16px~20px，行高 25px~30px) */
        .cover_layout .lyric_trans {
          font-size: clamp(16px, 1.25vw, 20px) !important;
          line-height: clamp(25px, 1.8vw, 30px) !important;
          margin-top: 6px !important;
          color: var(--play-lyric-trans-dim, rgba(255, 255, 255, 0.36)) !important;
          font-weight: normal !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          transition: all 0.25s cubic-bezier(0.2, 0, 0, 1) !important;
        }

        /* 当前高亮播放歌词：窗口模式下加大 2 号 (24px~29px，粗体 700，纯净主题色 #1ecc94) */
        .cover_layout .lyric-list .item.current .lyric_main,
        .cover_layout .lyric-list .item.js_current .lyric_main {
          font-size: clamp(24px, 1.85vw, 29px) !important;
          line-height: clamp(34px, 2.5vw, 42px) !important;
          font-weight: 700 !important;
          color: #1ecc94 !important;
          text-shadow: none !important;
          filter: none !important;
          transform: scale(1.03) !important;
        }
        .cover_layout .lyric-list .item.current .lyric_trans,
        .cover_layout .lyric-list .item.js_current .lyric_trans {
          font-size: clamp(17px, 1.4vw, 22px) !important;
          line-height: clamp(26px, 2.0vw, 32px) !important;
          font-weight: 600 !important;
          color: #1ecc94 !important;
          text-shadow: none !important;
          filter: none !important;
          transform: scale(1.02) !important;
        }

        /* 沉浸模式 Toast 提示 */
        .immersive_toast {
          position: fixed;
          top: 36px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(18, 18, 22, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #ffffff;
          padding: 8px 22px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 500;
          z-index: 99999;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.15);
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        /* 底部播放控制条：严格等比例对称边距 */
        .cover_layout .cover_player {
          height: auto !important;
          background: transparent !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-end !important;
          padding-bottom: 14px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .cover_layout .cover_player .player_box {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }
        .cover_layout .player_process_wrapper {
          width: 100% !important;
          margin-bottom: 6px !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .cover_layout .player_process {
          position: relative !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          height: 14px !important;
          display: flex !important;
          align-items: center !important;
          cursor: pointer !important;
        }
        .cover_layout .player_process .player_process_cont {
          position: relative !important;
          width: 100% !important;
          height: 4px !important;
          border-radius: 2px !important;
          background: var(--play-progress-track, rgba(255, 255, 255, 0.15)) !important;
          overflow: visible !important;
          margin: 0 !important;
          bottom: 0 !important;
          transition: height 0.15s ease !important;
        }
        .cover_layout .player_process:hover .player_process_cont {
          height: 6px !important;
        }
        .cover_layout .player_process_buffer {
          position: absolute !important;
          height: 100% !important;
          border-radius: 2px !important;
          background: var(--play-progress-buffer, rgba(255, 255, 255, 0.25)) !important;
          bottom: 0 !important;
        }
        .cover_layout .player_process_cent {
          position: absolute !important;
          height: 100% !important;
          border-radius: 2px !important;
          background: #1ecc94 !important;
          bottom: 0 !important;
        }
        .cover_layout .player_process_dot {
          position: absolute !important;
          width: 10px !important;
          height: 10px !important;
          border-radius: 5px !important;
          top: -3px !important;
          background: #1ecc94 !important;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4) !important;
          transition: transform 0.15s ease !important;
        }
        .cover_layout .player_process:hover .player_process_dot {
          transform: scale(1.3) !important;
          top: -3px !important;
        }
        .cover_player .svg_icon_btn.voice,
        .cover_layout .svg_icon_btn.voice {
          color: rgba(255, 255, 255, 0.85) !important;
        }
        .cover_player .svg_icon_btn.voice:hover,
        .cover_layout .svg_icon_btn.voice:hover {
          color: #1ecc94 !important;
        }
        .cover_layout .btn_match_switch:hover,
        .cover_layout .btn_trans_switch:hover,
        .cover_layout .btn_immersive_switch:hover {
          transform: scale(1.08) !important;
        }
        .cover_layout .player_process_time_row {
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: center !important;
          width: 100% !important;
          height: 18px !important;
          margin-top: 4px !important;
          margin-bottom: 0 !important;
          font-size: 14px !important;
          line-height: 18px !important;
          font-weight: 700 !important;
          color: var(--play-text-sub, #a1a1aa) !important;
          font-variant-numeric: tabular-nums !important;
          user-select: none !important;
          pointer-events: none !important;
        }
`;
      document.head.appendChild(st);
    }
  }, []);

  const isLocalOrWebDav = !!(song && (song.isLocal || song.isWebDav || song.localFilePath || (typeof song.mid === 'string' && (song.mid.startsWith('local_') || song.mid.startsWith('webdav_')))));

  // Levenshtein 编辑距离相似度
  const getLevenshteinSimilarity = (s1, s2) => {
    if (s1 === s2) return 1.0;
    if (!s1 || !s2) return 0.0;
    const l1 = s1.length;
    const l2 = s2.length;
    const dp = Array.from({ length: l1 + 1 }, () => new Array(l2 + 1).fill(0));
    for (let i = 0; i <= l1; i++) dp[i][0] = i;
    for (let j = 0; j <= l2; j++) dp[0][j] = j;
    for (let i = 1; i <= l1; i++) {
      for (let j = 1; j <= l2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    const maxLen = Math.max(l1, l2);
    return maxLen === 0 ? 1.0 : (1.0 - dp[l1][l2] / maxLen);
  };

  const getKanjiSkeleton = s => String(s || "").replace(/[^\u4e00-\u9fa5]/g, "");

  // 匹配并应用 QQ 官方歌词与翻译（支持时长误差 <= 3s 与歌手-歌名校验，忽略专辑）
  const matchAndApplyOfficialLyric = async (targetSong) => {
    if (!targetSong) return false;
    isMatchingRef.current = true;
    try {
      const netMod = (typeof network !== "undefined" && network?.D) ? network : __webpack_require__(32590);
      const searchMod = (typeof search_api !== "undefined" && search_api?.d$) ? search_api : __webpack_require__(940);
      const toolMod = (typeof tools !== "undefined" && tools?.cv) ? tools : __webpack_require__(32698);
      if (!netMod?.D || !searchMod?.d$ || !toolMod?.cv) return false;

      // 1. 规范化提取歌曲名与纯净主标题
      let rawTitle = String(targetSong.name || targetSong.title || "").trim();
      let cleanTitle = rawTitle.replace(/^\d{1,3}[\.\-_\s]\s*/, "");
      cleanTitle = cleanTitle.replace(/\.(flac|mp3|m4a|wav|ape|ogg|opus|aac|alac)$/i, "").trim();
      let pureTitle = cleanTitle.replace(/\s*[\(\[（【].*?[\)\]）】]\s*$/g, "").trim();

      // 2. 安全提取歌手名（支持数组对象、字符串等复杂结构，杜绝 [object Object]）
      let cleanArtist = "";
      if (Array.isArray(targetSong.singer)) {
        cleanArtist = targetSong.singer.map(s => (typeof s === "string" ? s : (s && (s.name || s.title)) || "")).filter(Boolean).join(" / ");
      } else if (typeof targetSong.singer === "string") {
        cleanArtist = targetSong.singer;
      } else if (typeof targetSong.artist === "string") {
        cleanArtist = targetSong.artist;
      }
      if (cleanArtist === "未知歌手" || cleanArtist === "未知艺术家") cleanArtist = "";
      cleanArtist = cleanArtist.trim();

      // 3. 拆分首要歌手与其他子歌手（防止多歌手分词被热门词稀释）
      const subArtists = cleanArtist.split(/[\/;；、,&+·]/).map(p => p.trim()).filter(Boolean);
      const primaryArtist = subArtists[0] || "";

      // 4. 提取本地歌曲实际时长（支持元数据与底层音频元素双重探测）
      let localDuration = 0;
      if (typeof targetSong.interval === "number" && targetSong.interval > 0) localDuration = targetSong.interval;
      else if (typeof targetSong.duration === "number" && targetSong.duration > 0) localDuration = targetSong.duration;
      else if (targetSong.track && typeof targetSong.track.interval === "number" && targetSong.track.interval > 0) localDuration = targetSong.track.interval;
      if (!localDuration) {
        try {
          const audioEl = document.querySelector('audio');
          if (audioEl && audioEl.duration && !isNaN(audioEl.duration) && isFinite(audioEl.duration)) {
            localDuration = Math.round(audioEl.duration);
          }
        } catch (_) {}
      }

      // 提取本地专辑名
      let localAlbum = "";
      if (typeof targetSong.album === "string") localAlbum = targetSong.album.trim();
      else if (targetSong.album && (targetSong.album.name || targetSong.album.title)) localAlbum = (targetSong.album.name || targetSong.album.title).trim();
      else if (targetSong.track && targetSong.track.album && (targetSong.track.album.name || targetSong.track.album.title)) localAlbum = (targetSong.track.album.name || targetSong.track.album.title).trim();
      else if (typeof targetSong.albumName === "string") localAlbum = targetSong.albumName.trim();

      console.log(`[LrcMatch] 开始匹配: title="${cleanTitle}", pureTitle="${pureTitle}", artist="${cleanArtist}", primaryArtist="${primaryArtist}", album="${localAlbum}", localDuration=${localDuration}s`);

      // 5. 构建多轮检索词列表（优先使用首歌手检索，避免分号堆叠干扰）
      const searchQueries = [];
      if (primaryArtist) {
        searchQueries.push(`${cleanTitle} ${primaryArtist}`);
        if (pureTitle && pureTitle !== cleanTitle) {
          searchQueries.push(`${pureTitle} ${primaryArtist}`);
        }
      }
      if (cleanArtist && cleanArtist !== primaryArtist) {
        searchQueries.push(`${pureTitle || cleanTitle} ${cleanArtist}`);
      }
      searchQueries.push(cleanTitle);
      if (pureTitle && pureTitle !== cleanTitle && !searchQueries.includes(pureTitle)) {
        searchQueries.push(pureTitle);
      }

      if (localAlbum) {
        searchQueries.push(`${cleanTitle} ${localAlbum}`);
      }

      const uinVal = (typeof login !== "undefined" && login?.Z?.musicId) ? `${login.Z.musicId}` : "0";
      const candMap = new Map();

      for (const query of searchQueries) {
        try {
          const searchRes = await (0, netMod.D)({
            search: (0, searchMod.d$)({
              page: 0,
              number: 20,
              query,
              uin: uinVal,
              type: searchMod.VO.SONG
            })
          });

          if (searchRes && searchRes.code === 0 && searchRes.search && searchRes.search.code === 0 && searchRes.search.data) {
            const body = searchRes.search.data.body;
            if (body && Array.isArray(body.item_song)) {
              for (const rawItem of body.item_song) {
                const item = (0, toolMod.cv)(rawItem);
                const itemMid = item.mid || (item.track && item.track.mid);
                if (itemMid && !candMap.has(itemMid)) {
                  candMap.set(itemMid, item);
                }
              }
              console.log(`[LrcMatch] 检索词 "${query}" 累积候选数: ${candMap.size}`);
            }
          }
        } catch (err) {
          console.warn(`[LrcMatch] 检索词 "${query}" 异常:`, err);
        }
        if (candMap.size >= 25) break;
      }

      const candidates = Array.from(candMap.values());
      if (candidates.length === 0) {
        console.warn("[LrcMatch] 官方曲库未检索到任何候选歌曲");
        return false;
      }

      // 6. 归一化比对逻辑（支持编辑距离相似度、汉字骨架与多语言别名识别）
      const norm = s => String(s || "").toLowerCase().replace(/[\(\)\[\]\{\}（）「」【】_·\-\s\.,\/\\!！\?？'":：]/g, "");
      const normCleanTitle = norm(cleanTitle);
      const normPureTitle = norm(pureTitle);
      const normLocalAlbum = norm(localAlbum);
      const kanjiCleanTitle = getKanjiSkeleton(cleanTitle);
      const kanjiPureTitle = getKanjiSkeleton(pureTitle);

      const isTitleMatched = candName => {
        const nc = norm(candName);
        if (!nc) return false;
        if (nc === normCleanTitle || (normPureTitle && nc === normPureTitle)) return true;
        if (normCleanTitle.length >= 2 && (nc.includes(normCleanTitle) || normCleanTitle.includes(nc))) return true;
        if (normPureTitle.length >= 2 && (nc.includes(normPureTitle) || normPureTitle.includes(nc))) return true;
        if (getLevenshteinSimilarity(normPureTitle || normCleanTitle, nc) >= 0.7) return true;
        const kanjiC = getKanjiSkeleton(candName);
        if (kanjiCleanTitle.length >= 2 && kanjiC === kanjiCleanTitle) return true;
        if (kanjiPureTitle.length >= 2 && kanjiC === kanjiPureTitle) return true;
        return false;
      };

      const isArtistMatched = candSingerStr => {
        if (subArtists.length === 0) return true; // 本地无歌手信息时默认放行
        const nc = norm(candSingerStr);
        if (!nc) return false;
        for (const sa of subArtists) {
          const normSa = norm(sa);
          if (normSa.length >= 2 && nc.includes(normSa)) return true;
        }
        return false;
      };

      const isAlbumMatched = candAlbum => {
        if (!normLocalAlbum) return false;
        const nc = norm(candAlbum);
        if (!nc) return false;
        if (nc === normLocalAlbum || nc.includes(normLocalAlbum) || normLocalAlbum.includes(nc)) return true;
        if (getLevenshteinSimilarity(normLocalAlbum, nc) >= 0.6) return true;
        return false;
      };

      // 7. 时长校验与候选分级筛选（直接标题匹配 > 同人音乐同专辑匹配 > 跨语言别名匹配）
      const scoredList = [];
      candidates.forEach((cand, rank) => {
        const candName = (cand.name || cand.title || "").replace(/<[^>]+>/g, "");
        const candSingerStr = (cand.singer || []).map(s => s.name).join(" / ");
        const candAlbumName = cand.album ? (cand.album.name || cand.album.title || "") : "";
        const candDuration = cand.interval || 0;

        let durationDiff = 0;
        if (localDuration > 5) {
          durationDiff = Math.abs(candDuration - localDuration);
          if (durationDiff > 3.0) return; // 时长严格 +-3 秒限制
        }

        const titleMatched = isTitleMatched(candName);
        const artistMatched = isArtistMatched(candSingerStr);
        const albumMatched = isAlbumMatched(candAlbumName);

        let score = 0;
        if (titleMatched && artistMatched) {
          score = 100; // 标题与歌手完全吻合（标准直接匹配）
        } else if (titleMatched && albumMatched) {
          score = 90; // 标题与专辑完全吻合（同人音乐社团名 vs 演唱者，如 FELT vs Vivienne 在 Sevens Head 中）
        } else if (titleMatched && subArtists.length === 0) {
          score = 70; // 本地未标注歌手时标题吻合
        }

        if (score > 0) {
          scoredList.push({
            cand,
            score,
            albumMatched,
            durationDiff,
            rank
          });
        }
      });

      scoredList.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.durationDiff !== b.durationDiff) return a.durationDiff - b.durationDiff;
        return a.rank - b.rank;
      });

      let bestMatch = scoredList.length > 0 ? scoredList[0].cand : null;

      if (!bestMatch) {
        console.warn(`[LrcMatch] 候选列表中未能命中符合条件的歌曲 (title=${cleanTitle}, artist=${cleanArtist})`);
        return false;
      }

      console.log(`[LrcMatch] 最佳匹配命中: "${bestMatch.name}" - "${(bestMatch.singer || []).map(s => s.name).join('/')}" (mid=${bestMatch.mid}, interval=${bestMatch.interval})`);

      // 8. 请求官方原生 PlayLyricInfo 歌词与双语翻译
      const lyricRes = await (0, netMod.D)({
        playLyricInfo: {
          module: "music.musichallSong.PlayLyricInfo",
          method: "GetPlayLyricInfo",
          param: {
            songMID: bestMatch.mid,
            songID: bestMatch.id || 0,
            qrc: 0,
            trans: 1,
            roma: 1,
            isHQ: 1
          }
        }
      });

      let offLrc = "";
      let offTrans = "";
      if (lyricRes && lyricRes.code === 0 && lyricRes.playLyricInfo && lyricRes.playLyricInfo.code === 0 && lyricRes.playLyricInfo.data) {
        const d = lyricRes.playLyricInfo.data;
        if (d.lyric) offLrc = decodeBase64(d.lyric);
        if (d.trans) offTrans = decodeBase64(d.trans);
      }

      if (!offLrc && bestMatch.id) {
        try {
          const oldRes = await (0, netMod.D)({
            getLyric: (0, asset_api/* getSongLyric */.mq)({
              song_id: bestMatch.id
            })
          });
          if (oldRes && oldRes.code === 0 && oldRes.getLyric && oldRes.getLyric.code === 0 && oldRes.getLyric.data) {
            const lyricObj = oldRes.getLyric.data.info.find(item => item.type === "lyric");
            if (lyricObj && lyricObj.content && lyricObj.content[0]) {
              offLrc = lyricObj.content[0].value;
            }
          }
        } catch (_) {}
      }

      if (!offLrc) return false;

      const parsedLrc = parseLrcText(offLrc);
      const origList = (parsedLrc && parsedLrc.length > 0) ? parsedLrc : [{ time: 0, context: "该歌曲暂无歌词" }];
      let transList = offTrans ? parseLrcText(offTrans) : [];
      let cleanTrans = transList.filter(t => t.context && t.context !== "//" && !t.context.includes("享有") && !t.context.includes("大模型"));

      // 若官方未提供翻译，而本地原本具备有效双语翻译，则无缝继承对齐本地翻译，杜绝翻译丢失与隐藏翻译按钮
      let isFallbackLocalTrans = false;
      const localBackup = localLyricBackupRef.current;
      if (cleanTrans.length === 0 && localBackup && localBackup.hasTrans && Array.isArray(localBackup.list)) {
        const localTransCount = localBackup.list.filter(item => item && item.trans && item.trans.trim()).length;
        if (localTransCount > 0) {
          isFallbackLocalTrans = true;
        }
      }
      lastFallbackLocalTransRef.current = isFallbackLocalTrans;

      let hasValidTrans = false;
      const usedSet = new Set();
      const mergedList = origList.map((orig, idx) => {
        let transText = "";
        if (!isFallbackLocalTrans && transList.length > 0) {
          const exactRaw = transList.find(t => t.time === orig.time);
          if (exactRaw) {
            if (exactRaw.context && exactRaw.context !== "//" && !exactRaw.context.includes("享有") && !exactRaw.context.includes("大模型")) {
              transText = exactRaw.context;
              hasValidTrans = true;
              usedSet.add(exactRaw);
            }
          } else if (cleanTrans.length > 0) {
            const candidates = cleanTrans.filter(t => !usedSet.has(t) && Math.abs(t.time - orig.time) <= 1200);
            if (candidates.length > 0) {
              const best = candidates.reduce((prev, curr) => Math.abs(curr.time - orig.time) < Math.abs(prev.time - orig.time) ? curr : prev);
              transText = best.context;
              hasValidTrans = true;
              usedSet.add(best);
            } else if (cleanTrans.length === origList.length && cleanTrans[idx] && !usedSet.has(cleanTrans[idx])) {
              transText = cleanTrans[idx].context;
              hasValidTrans = true;
              usedSet.add(cleanTrans[idx]);
            }
          }
        } else if (isFallbackLocalTrans && localBackup && Array.isArray(localBackup.list)) {
          // 本地翻译多维精准对齐：
          // 1. 原文文本完全匹配（去空白与标点）
          const origClean = (orig.context || "").replace(/[\s\p{P}]/gu, "").toLowerCase();
          const matchedByText = localBackup.list.find(item => {
            if (!item || !item.trans || !item.trans.trim()) return false;
            if (usedSet.has(item)) return false;
            const itemClean = (item.context || "").replace(/[\s\p{P}]/gu, "").toLowerCase();
            return origClean.length > 0 && itemClean === origClean;
          });
          if (matchedByText) {
            transText = matchedByText.trans.trim();
            hasValidTrans = true;
            usedSet.add(matchedByText);
          } else {
            // 2. 时间戳最接近对齐（允许 3 秒误差）
            const timeCandidates = localBackup.list.filter(item => item && item.trans && item.trans.trim() && !usedSet.has(item) && Math.abs(item.time - orig.time) <= 3000);
            if (timeCandidates.length > 0) {
              const best = timeCandidates.reduce((prev, curr) => Math.abs(curr.time - orig.time) < Math.abs(prev.time - orig.time) ? curr : prev);
              transText = best.trans.trim();
              hasValidTrans = true;
              usedSet.add(best);
            } else if (localBackup.list[idx] && localBackup.list[idx].trans && !usedSet.has(localBackup.list[idx])) {
              // 3. 行号下标对齐
              transText = localBackup.list[idx].trans.trim();
              hasValidTrans = true;
              usedSet.add(localBackup.list[idx]);
            }
          }
        }
        return {
          ...orig,
          trans: transText
        };
      });

      setHasTrans(hasValidTrans);
      setLyricList(mergedList);
      setIsMatchedEnabled(true);
      const singerStr = (bestMatch.singer || []).map(s => s.name).join("/");
      setMatchedSongInfo(singerStr ? `${bestMatch.name} - ${singerStr}` : bestMatch.name);
      return true;
    } catch (e) {
      console.warn("matchAndApplyOfficialLyric error:", e);
      return false;
    } finally {
      isMatchingRef.current = false;
    }
  };

  const toggleMatch = async () => {
    if (isMatchedEnabled) {
      isManualMatchedRef.current = false;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("qqmusic_lrc_manual_match", "false");
      }
      setIsMatchedEnabled(false);
      setMatchedSongInfo("");
      if (localLyricBackupRef.current) {
        setLyricList(localLyricBackupRef.current.list);
        setHasTrans(localLyricBackupRef.current.hasTrans);
      }
    } else {
      isManualMatchedRef.current = true;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("qqmusic_lrc_manual_match", "true");
      }
      setIsMatchedEnabled(true);
      const ok = await matchAndApplyOfficialLyric(song);
      if (!ok) {
        setIsMatchedEnabled(false);
        setMatchedSongInfo("");
        setToastText("未找到相符的 QQ 音乐官方歌词");
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToastText(""), 2500);
      } else {
        if (lastFallbackLocalTransRef.current) {
          setToastText("已匹配官方歌词（官方无翻译，已保留本地翻译）");
        } else {
          setToastText("已匹配官方歌词");
        }
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToastText(""), 2500);
      }
    }
  };

  // 通过 QQ 音乐官方原生 PlayLyricInfo 接口直接请求官方歌词与双语翻译
  const getSongLyricList = async () => {
    if (Array.isArray(song && song.qmtuiLyrics) && song.qmtuiLyrics.length > 0) {
      setLyricList(song.qmtuiLyrics);
      setHasTrans(song.qmtuiLyrics.some(item => item.trans));
      setMatchedSongInfo("");
      setIsMatchedEnabled(false);
      return;
    }
    setMatchedSongInfo("");
    setIsMatchedEnabled(false);
    let rawQqLrc = "";
    let rawTrans = "";
    if (isLocalOrWebDav) {
      if (song.lyrics) {
        rawQqLrc = song.lyrics;
      } else if (song.isWebDav && song.webDavHref && song.webDavServerId) {
        try {
          const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                      (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer);
          if (ipc) {
            const fetchedLrc = await ipc.invoke('webdav-get-lyrics', {
              serverId: song.webDavServerId,
              href: song.webDavHref
            });
            if (fetchedLrc && fetchedLrc.trim()) {
              rawQqLrc = fetchedLrc;
              song.lyrics = fetchedLrc;
            }
          }
        } catch (_) {}
      }

      let parsedLocalList = [];
      let hasLocalTrans = false;

      if (rawQqLrc) {
        const rawList = parseLrcText(rawQqLrc);
        if (rawList && rawList.length > 0) {
          const len = rawList.length;
          let i = 0;
          while (i < len) {
            const cur = rawList[i];
            const next = (i + 1 < len) ? rawList[i + 1] : null;
            if (next && Math.abs(next.time - cur.time) <= 200) {
              parsedLocalList.push({
                time: cur.time,
                context: cur.context,
                trans: next.context
              });
              hasLocalTrans = true;
              i += 2;
              continue;
            }
            let origContext = cur.context;
            let transText = "";
            const slashIdx = origContext.indexOf(" / ");
            if (slashIdx > 0 && slashIdx < origContext.length - 3) {
              origContext = cur.context.substring(0, slashIdx).trim();
              transText = cur.context.substring(slashIdx + 3).trim();
              hasLocalTrans = true;
            }
            parsedLocalList.push({
              time: cur.time,
              context: origContext,
              trans: transText
            });
            i += 1;
          }
        }
      }

      const hasLocalLrc = parsedLocalList.length > 0;
      const hasBilingual = hasLocalLrc && hasLocalTrans;

      // 备份本地原始歌词
      localLyricBackupRef.current = {
        list: hasLocalLrc ? parsedLocalList : [{ time: 0, context: song.isWebDav ? "WebDAV 歌曲，暂无歌词" : "本地歌曲，暂无内嵌歌词" }],
        hasTrans: hasLocalTrans
      };

      // 决策是否开启官方歌词匹配：
      // 1. 若已有双语歌词 (hasBilingual)：
      //    - 若用户此前手动开启 (isManualMatchedRef.current === true)，则保持开启并尝试匹配官方歌词；
      //    - 否则（自动开启模式或未开启），自动关闭匹配，直接显示本地双语歌词。
      // 2. 若无歌词或无中文翻译 (!hasBilingual)：
      //    - 自动开启尝试匹配官方歌词。
      const shouldMatch = (!hasBilingual) || (isManualMatchedRef.current === true);

      if (shouldMatch) {
        setMatchedSongInfo("");
        setIsMatchedEnabled(false);
        const matchSuccess = await matchAndApplyOfficialLyric(song);
        if (matchSuccess) {
          return;
        }
        setIsMatchedEnabled(false);
        setMatchedSongInfo("");
        if (hasLocalLrc) {
          setLyricList(parsedLocalList);
          setHasTrans(hasLocalTrans);
        } else {
          setLyricList([{ time: 0, context: song.isWebDav ? "WebDAV 歌曲，暂无歌词" : "本地歌曲，暂无内嵌歌词" }]);
          setHasTrans(false);
        }
        return;
      } else {
        setIsMatchedEnabled(false);
        setMatchedSongInfo("");
        setLyricList(parsedLocalList);
        setHasTrans(hasLocalTrans);
        return;
      }
    }

    // 在线歌曲，重置匹配状态
    setIsMatchedEnabled(false);
    setMatchedSongInfo("");
    const songMid = (song && (song.mid || (song.track && song.track.mid))) || "";
    const songId = (song && (song.id || (song.track && song.track.id))) || 0;

    try {
      const res = await (0,network/* ufetch */.D)({
        playLyricInfo: {
          module: "music.musichallSong.PlayLyricInfo",
          method: "GetPlayLyricInfo",
          param: {
            songMID: songMid,
            songID: songId,
            qrc: 0,
            trans: 1,
            roma: 1,
            isHQ: 1
          }
        }
      });

      if (res && res.code === 0 && res.playLyricInfo && res.playLyricInfo.code === 0 && res.playLyricInfo.data) {
        const d = res.playLyricInfo.data;
        if (d.lyric) {
          rawQqLrc = decodeBase64(d.lyric);
        }
        if (d.trans) {
          rawTrans = decodeBase64(d.trans);
        }
      }
    } catch (e) {
      console.warn("GetPlayLyricInfo error, fallback to legacy API", e);
    }

    // 备用降级老接口
    if (!rawQqLrc && songId) {
      try {
        const oldRes = await (0,network/* ufetch */.D)({
          getLyric: (0,asset_api/* getSongLyric */.mq)({
            song_id: songId
          })
        });
        if (oldRes && oldRes.code === 0 && oldRes.getLyric && oldRes.getLyric.code === 0 && oldRes.getLyric.data) {
          const lyricRes = oldRes.getLyric.data.info.find(item => item.type === "lyric");
          if (lyricRes && lyricRes.content && lyricRes.content[0]) {
            rawQqLrc = lyricRes.content[0].value;
          }
        }
      } catch (err) {}
    }

    const parsedLrc = rawQqLrc ? parseLrcText(rawQqLrc) : [];
    const origList = (parsedLrc && parsedLrc.length > 0) ? parsedLrc : [{ time: 0, context: "该歌曲暂无歌词" }];
    const transList = rawTrans ? parseLrcText(rawTrans) : [];
    const cleanTrans = transList.filter(t => t.context && t.context !== "//" && !t.context.includes("享有") && !t.context.includes("大模型"));

    let hasValidTrans = false;
    const usedSet = new Set();
    const mergedList = origList.map((orig, idx) => {
      let transText = "";
      if (transList.length > 0) {
        const exactRaw = transList.find(t => t.time === orig.time);
        if (exactRaw) {
          if (exactRaw.context && exactRaw.context !== "//" && !exactRaw.context.includes("享有") && !exactRaw.context.includes("大模型")) {
            transText = exactRaw.context;
            hasValidTrans = true;
            usedSet.add(exactRaw);
          }
        } else if (cleanTrans.length > 0) {
          const candidates = cleanTrans.filter(t => !usedSet.has(t) && Math.abs(t.time - orig.time) <= 1200);
          if (candidates.length > 0) {
            const best = candidates.reduce((prev, curr) => Math.abs(curr.time - orig.time) < Math.abs(prev.time - orig.time) ? curr : prev);
            transText = best.context;
            hasValidTrans = true;
            usedSet.add(best);
          } else if (cleanTrans.length === origList.length && cleanTrans[idx] && !usedSet.has(cleanTrans[idx])) {
            transText = cleanTrans[idx].context;
            hasValidTrans = true;
            usedSet.add(cleanTrans[idx]);
          }
        }
      }
      return {
        ...orig,
        trans: transText
      };
    });

    setHasTrans(hasValidTrans);
    setLyricList(mergedList);
  };

  const toggleTrans = () => {
    const nextVal = !isTransEnabled;
    setIsTransEnabled(nextVal);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("qqmusic_show_trans", String(nextVal));
    }
  };

  // 点击某句歌词跳转播放
  const handleLyricClick = (targetTimeMs) => {
    try {
      const player = (typeof window !== "undefined" && window.__QQMUSIC_PLAYER_INSTANCE__);
      if (player && player.audio) {
        player.audio.currentTime = targetTimeMs / 1000;
        if (player.audio.paused) {
          player.audio.play().catch(() => {});
        }
      }
    } catch (e) {
      console.warn("handleLyricClick error:", e);
    }
  };

  // 监听用户滚轮滑动，3 秒内暂停强制居中，允许用户自由浏览歌词
  const handleWheelOrScroll = () => {
    lastUserScrollRef.current = Date.now();
  };

  (0,react.useEffect)(() => {
    if (song && (song.id || song.mid || song.isLocal || song.isWebDav || song.localFilePath || (song.track && (song.track.id || song.track.mid)))) {
      getSongLyricList();
    } else {
      setLyricList([]);
      setHasTrans(false);
    }
  }, [song]);

  (0,react.useEffect)(() => {
    let matchIdx = -1;
    for (let i = 0; i < lyricList.length; i++) {
      const curTime = lyricList[i].time / 1000;
      const nextTime = lyricList[i + 1] ? lyricList[i + 1].time / 1000 : Infinity;
      if (currentTime >= curTime && currentTime < nextTime) {
        matchIdx = i;
        break;
      }
    }
    setCurrentLyricIdx(matchIdx);
  }, [currentTime, lyricList]);

  // 精准居中滚动（若用户近期未滑动滚轮，则平滑自动跟随当前句）
  (0,react.useEffect)(() => {
    if (Date.now() - lastUserScrollRef.current < 2800) {
      return; // 用户正在主动浏览歌词，暂不强制拉回
    }
    const listCont = lyricListRef.current || document.getElementsByClassName("js_list")[0];
    if (listCont) {
      const currentEl = listCont.querySelector(".js_current");
      if (currentEl) {
        const listRect = listCont.getBoundingClientRect();
        const curRect = currentEl.getBoundingClientRect();
        const diff = curRect.top - listRect.top;
        const targetTop = listCont.scrollTop + diff - (listRect.height / 2) + (curRect.height / 2);
        animate(listCont, listCont.scrollTop, targetTop, 50);
      }
    }
  }, [currentLyricIdx]);

  const jumpToAlbumDetail = ev => {
    ev.stopPropagation();
    if (song && song.album && song.album.mid) {
      (0,jump/* default */.Z)(jump/* PAGE_TYPE.ALBUM */.G.ALBUM, {
        mid: song.album.mid
      });
      (0,stook_esm/* mutate */.JG)("IsCoverPlayerVisible", false);
    }
  };

  const jumpSinger = (ev, mid) => {
    ev.stopPropagation();
    if (mid) {
      (0,jump/* default */.Z)(jump/* PAGE_TYPE.SINGER */.G.SINGER, {
        mid
      });
      (0,stook_esm/* mutate */.JG)("IsCoverPlayerVisible", false);
    }
  };

  return /*#__PURE__*/react.createElement("div", {
    className: "layout_page",
    style: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100%", justifyContent: "center" }
  }, /*#__PURE__*/react.createElement("div", {
    className: "lyric-list js_list",
    ref: lyricListRef,
    onWheel: handleWheelOrScroll,
    onTouchMove: handleWheelOrScroll
  }, lyricList.length > 0 && lyricList.map((item, idx) => {
    var _lyricList$currentLyr;
    const isCurrent = item.time === ((_lyricList$currentLyr = lyricList[currentLyricIdx]) === null || _lyricList$currentLyr === void 0 ? void 0 : _lyricList$currentLyr.time);
    return /*#__PURE__*/react.createElement("div", {
      className: `item ${isCurrent ? "current js_current" : ""}`,
      key: `${item.context}_${item === null || item === void 0 ? void 0 : item.time}_${idx}`,
      onClick: () => handleLyricClick(item.time),
      title: "点击跳转播放此句",
      style: {
        height: "auto",
        minHeight: "28px",
        lineHeight: "normal",
        marginTop: "14px",
        marginBottom: "14px",
        textAlign: "center"
      }
    }, /*#__PURE__*/react.createElement("div", {
      className: "lyric_main"
    }, item.context), (isTransEnabled && item.trans) ? /*#__PURE__*/react.createElement("div", {
      className: "lyric_trans"
    }, item.trans) : null);
  })), /*#__PURE__*/react.createElement("div", {
    className: "lyric_action_bar",
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: "10px",
      width: "100%",
      marginTop: "8px",
      paddingRight: "0px",
      boxSizing: "border-box",
      opacity: (!isImmersive || showImmersiveBtn) ? 1 : 0,
      pointerEvents: (!isImmersive || showImmersiveBtn) ? "auto" : "none",
      transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    }
  }, toastText ? /*#__PURE__*/react.createElement("div", {
    className: "immersive_toast"
  }, toastText) : null, isLocalOrWebDav ? /*#__PURE__*/react.createElement("span", {
    className: "btn_match_switch",
    onClick: toggleMatch,
    title: isMatchedEnabled ? (matchedSongInfo ? `已匹配QQ官方歌词: ${matchedSongInfo} (点击还原本地)` : "已匹配QQ官方歌词 (点击还原本地)") : "匹配QQ官方歌词",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      fontSize: "11px",
      fontWeight: "bold",
      cursor: "pointer",
      boxSizing: "border-box",
      border: isMatchedEnabled ? "1.5px solid #1ecc94" : "1.5px solid rgba(255, 255, 255, 0.35)",
      backgroundColor: isMatchedEnabled ? "rgba(30, 204, 148, 0.16)" : "rgba(255, 255, 255, 0.06)",
      color: isMatchedEnabled ? "#1ecc94" : "rgba(255, 255, 255, 0.75)",
      transition: "all 0.2s ease",
      userSelect: "none"
    }
  }, "匹") : null, hasTrans ? /*#__PURE__*/react.createElement("span", {
    className: "btn_trans_switch",
    onClick: toggleTrans,
    title: isTransEnabled ? "关闭歌词翻译" : "开启歌词翻译",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      fontSize: "11px",
      fontWeight: "bold",
      cursor: "pointer",
      boxSizing: "border-box",
      border: isTransEnabled ? "1.5px solid #1ecc94" : "1.5px solid rgba(255, 255, 255, 0.35)",
      backgroundColor: isTransEnabled ? "rgba(30, 204, 148, 0.16)" : "rgba(255, 255, 255, 0.06)",
      color: isTransEnabled ? "#1ecc94" : "rgba(255, 255, 255, 0.75)",
      transition: "all 0.2s ease",
      userSelect: "none"
    }
  }, "译") : null, /*#__PURE__*/react.createElement("span", {
    className: "btn_immersive_switch",
    onClick: toggleImmersive,
    title: isImmersive ? "退出沉浸模式 (ESC)" : "开启沉浸模式",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      cursor: "pointer",
      boxSizing: "border-box",
      border: isImmersive ? "1.5px solid #1ecc94" : "1.5px solid rgba(255, 255, 255, 0.35)",
      backgroundColor: isImmersive ? "rgba(30, 204, 148, 0.16)" : "rgba(255, 255, 255, 0.06)",
      color: isImmersive ? "#1ecc94" : "rgba(255, 255, 255, 0.75)",
      transition: "all 0.2s ease",
      userSelect: "none"
    }
  }, /*#__PURE__*/react.createElement("svg", {
    viewBox: "0 0 24 24",
    width: 14,
    height: 14,
    fill: "none",
    stroke: isImmersive ? "#1ecc94" : "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { display: "block" }
  }, /*#__PURE__*/react.createElement("path", { d: "M4 8V6a2 2 0 0 1 2-2h2" }),
     /*#__PURE__*/react.createElement("path", { d: "M16 4h2a2 2 0 0 1 2 2v2" }),
     /*#__PURE__*/react.createElement("path", { d: "M20 16v2a2 2 0 0 1-2 2h-2" }),
     /*#__PURE__*/react.createElement("path", { d: "M8 20H6a2 2 0 0 1-2-2v-2" })))));
};

;// CONCATENATED MODULE: ./src/pages/cover_player/index.tsx
const cover_player_LogicalPlayer = players/* default.getInstance */.Z.getInstance();
class CoverPlayer extends react.Component {
  constructor(props) {
    super(props);

    this.getThemeMode = () => {
      return isDarkTheme() ? 'theme-dark' : 'theme-light';
    };

    this.syncBodyCoverClass = () => {
      try {
        if (typeof document !== 'undefined' && document.body) {
          if (this.props.isCoverPlayer && this.props.isShow) {
            document.body.classList.add('in-cover-player');
          } else {
            document.body.classList.remove('in-cover-player');
          }
        }
      } catch (e) {}
    };

    // Google Material You (Monet / Celebi Quantization) 高精色彩聚类与活力打分算法
    this.updateMonetBackground = (imgUrl, isDark) => {
      if (!imgUrl) return;
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const size = 64;
          canvas.width = size;
          canvas.height = size;
          ctx.drawImage(img, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size).data;
          
          // 36 个色相区间桶 (每 10 度一个桶: 0°~360°)
          const bins = Array.from({ length: 36 }, () => ({
            count: 0,
            sSum: 0,
            lSum: 0,
            hSum: 0
          }));
          
          let neutralCount = 0;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i] / 255;
            const g = data[i+1] / 255;
            const b = data[i+2] / 255;
            const a = data[i+3];
            if (a < 128) continue;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const l = (max + min) / 2;

            // 过滤极黑与极白 (纯黑白不作为主题色提取源)
            if (l < 0.08 || l > 0.94) continue;

            const d = max - min;
            if (d < 0.08) {
              neutralCount++;
              continue;
            }

            const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            let h = 0;
            if (max === r) {
              h = (g - b) / d + (g < b ? 6 : 0);
            } else if (max === g) {
              h = (b - r) / d + 2;
            } else {
              h = (r - g) / d + 4;
            }
            h *= 60; // 0° ~ 360°

            const binIdx = Math.floor(h / 10) % 36;
            bins[binIdx].count++;
            bins[binIdx].sSum += s;
            bins[binIdx].lSum += l;
            bins[binIdx].hSum += h;
          }

          let bestBin = null;
          let bestScore = -1;

          for (const bin of bins) {
            if (bin.count === 0) continue;
            const avgS = bin.sSum / bin.count;
            // Google Material You 评分公式: 结合色彩鲜活性(S)与画面占比(Count)
            const score = (Math.pow(bin.count, 0.65)) * (Math.pow(avgS, 1.25));
            if (score > bestScore) {
              bestScore = score;
              bestBin = bin;
            }
          }

          let targetHue = 220; // 默认中性优雅冷灰调
          let targetSat = 0.2;

          if (bestBin && bestScore > 0) {
            targetHue = Math.round(bestBin.hSum / bestBin.count);
            targetSat = bestBin.sSum / bestBin.count;
          }

          let monetBg = "";
          if (isDark) {
            // 深色主题: 提取主色相，计算优雅通透的莫奈背景色 (L: 20%, S: 22%~42%)
            const sPct = Math.min(Math.max(Math.round(targetSat * 70), 22), 42);
            const lPct = 20;
            monetBg = `hsl(${targetHue}, ${sPct}%, ${lPct}%)`;
          } else {
            // 浅色主题: 采用同款莫奈取色算法，明度更偏亮色 (L: 29%, S: 24%~44%)，确保所有白色操作按钮具备高对比度
            const sPct = Math.min(Math.max(Math.round(targetSat * 65), 24), 44);
            const lPct = 29;
            monetBg = `hsl(${targetHue}, ${sPct}%, ${lPct}%)`;
          }
          this.setState({ monetBgColor: monetBg });
        } catch (e) {
          console.warn("updateMonetBackground error:", e);
        }
      };
      img.src = imgUrl;
    };

    this.listen = () => {
      const {
        handlePlaying,
        handleTimeUpdate,
        handleClearPlayList
      } = this;
      cover_player_LogicalPlayer.on(types/* PLAY_STATE.PLAYING */.tJ.PLAYING, handlePlaying);
      cover_player_LogicalPlayer.on(types/* PLAY_STATE.TIME_UPDATE */.tJ.TIME_UPDATE, handleTimeUpdate);
      cover_player_LogicalPlayer.on(types/* PLAY_STATE.CLEAR_PLAY_LIST */.tJ.CLEAR_PLAY_LIST, handleClearPlayList);
      
      // 监听系统主题变化
      if (window.matchMedia) {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.themeListener = () => {
          const curTheme = this.getThemeMode();
          this.setState({ themeClass: curTheme });
          if (this.currentImgUrl) {
            this.updateMonetBackground(this.currentImgUrl, curTheme === 'theme-dark');
          }
        };
        this.mediaQuery.addEventListener ? this.mediaQuery.addEventListener('change', this.themeListener) : this.mediaQuery.addListener(this.themeListener);
      }

      // DOM MutationObserver 毫秒级监听主界面右上角皮肤切换
      try {
        this.domObserver = new MutationObserver(() => {
          const curTheme = this.getThemeMode();
          if (curTheme !== this.state.themeClass) {
            this.setState({ themeClass: curTheme });
            if (this.currentImgUrl) {
              this.updateMonetBackground(this.currentImgUrl, curTheme === 'theme-dark');
            }
          }
        });
        const skinStyle = document.querySelector('#js_skin_style');
        if (skinStyle) {
          this.domObserver.observe(skinStyle, { childList: true, characterData: true, subtree: true });
        }
        if (document.head) {
          this.domObserver.observe(document.head, { childList: true, subtree: true });
        }
      } catch (e) {}

      // 定期感知保底
      this.skinObserver = setInterval(() => {
        const curTheme = this.getThemeMode();
        if (curTheme !== this.state.themeClass) {
          this.setState({ themeClass: curTheme });
          if (this.currentImgUrl) {
            this.updateMonetBackground(this.currentImgUrl, curTheme === 'theme-dark');
          }
        }
      }, 500);
    };

    this.removeListener = () => {
      const {
        handlePlaying,
        handleTimeUpdate,
        handleClearPlayList
      } = this;
      cover_player_LogicalPlayer.off(types/* PLAY_STATE.PLAYING */.tJ.PLAYING, handlePlaying);
      cover_player_LogicalPlayer.off(types/* PLAY_STATE.TIME_UPDATE */.tJ.TIME_UPDATE, handleTimeUpdate);
      cover_player_LogicalPlayer.off(types/* PLAY_STATE.CLEAR_PLAY_LIST */.tJ.CLEAR_PLAY_LIST, handleClearPlayList);
      if (this.mediaQuery && this.themeListener) {
        this.mediaQuery.removeEventListener ? this.mediaQuery.removeEventListener('change', this.themeListener) : this.mediaQuery.removeListener(this.themeListener);
      }
      if (this.domObserver) {
        this.domObserver.disconnect();
      }
      if (this.skinObserver) {
        clearInterval(this.skinObserver);
      }
    };

    this.handlePlaying = ({
      song
    }) => {
      var _song$track, _song$track$album, _song$album;
      const themeClass = this.getThemeMode();
      this.setState({
        song,
        themeClass
      });
      const albumMid = (song === null || song === void 0 ? void 0 : (_song$track = song.track) === null || _song$track === void 0 ? void 0 : (_song$track$album = _song$track.album) === null || _song$track$album === void 0 ? void 0 : _song$track$album.mid) || (song === null || song === void 0 ? void 0 : (_song$album = song.album) === null || _song$album === void 0 ? void 0 : _song$album.mid) || null;
      const _tr = (song && song.track) || song || {};
      const _aMid = (song && song.album && song.album.mid) || (_tr.album && _tr.album.mid) || null;
      const _pmid = (song && song.pmid) || (song && song.album && song.album.pmid) || (song && song.vs && song.vs[1]) || (_tr.pmid) || (_tr.album && _tr.album.pmid) || (_tr.vs && _tr.vs[1]) || null;
      const _sMid = (song && song.singer && song.singer[0] && song.singer[0].mid) || (_tr.singer && _tr.singer[0] && _tr.singer[0].mid) || null;
      const _localCover = (song && song.album && (song.album.pic || song.album.picurl)) || (song && (song.pic || song.picurl)) || (_tr && _tr.album && (_tr.album.pic || _tr.album.picurl)) || null;
      const bgImg = _localCover || ((_aMid && _aMid.length > 5) ? utils/* default.getAlbumPic */.ZP.getAlbumPic(_aMid, 1500) : ((_pmid && _pmid.length > 5) ? ("https://y.gtimg.cn/music/photo_new/T062R800x800M000" + _pmid + ".jpg?max_age=2592000") : ((_sMid && _sMid.length > 5) ? ("https://y.gtimg.cn/music/photo_new/T001R1500x1500M000" + _sMid + ".jpg?max_age=2592000") : utils/* default.getAlbumPic */.ZP.getAlbumPic(null, 1500))));
      this.currentImgUrl = bgImg;
      this.updateMonetBackground(bgImg, themeClass === 'theme-dark');
      // 切歌时主动通知主进程修剪未引用图层与执行垃圾回收
      try {
        if (typeof window !== 'undefined' && window.require) {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.send('request-memory-trim', { reason: 'Track Changed' });
        }
      } catch (e) {}
    };

    this.handleTimeUpdate = ({
      timeStamp
    }) => {
      this.setState({
        currentTime: timeStamp
      });
    };

    this.handleClearPlayList = () => {
      this.setState({
        currentTime: 0,
        song: null
      });
    };

    this.handleWindowClick = (e) => {
      if (e && e.target && e.target.closest && (e.target.closest('.player_cont') || e.target.closest('.playlist_cont') || e.target.closest('.ant-popover') || e.target.closest('.menu_wrapper'))) {
        return;
      }
      if ((0,stook_esm/* getState */.y0)('PlayListVisible')) {
        (0,stook_esm/* mutate */.JG)('PlayListVisible', false);
      }
    };

    this.handleToShowPlayList = val => {
      (0,stook_esm/* mutate */.JG)('PlayListVisible', val);
    };

    this.state = {
      song: null,
      currentTime: 0,
      themeClass: this.getThemeMode(),
      monetBgColor: ""
    };
  }

  componentDidMount() {
    this.listen();
    this.syncBodyCoverClass();
    const curTheme = this.getThemeMode();
    this.setState({ themeClass: curTheme });
    this.handleKeyDown = (e) => {
      if (e && e.key === 'Escape') {
        (0,stook_esm/* mutate */.JG)('IsCoverPlayerVisible', false);
      }
    };
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate() {
    this.syncBodyCoverClass();
  }

  componentWillUnmount() {
    this.removeListener();
    if (this.handleKeyDown) {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('in-cover-player');
    }
  }

  render() {
    var _song$track, _song$track$album, _song$album;

    const {
      isShow,
      isCoverPlayer
    } = this.props;
    const {
      song,
      currentTime,
      themeClass,
      monetBgColor
    } = this.state;
    const {
      handleWindowClick,
      handleToShowPlayList
    } = this;

    const albumMid = (song === null || song === void 0 ? void 0 : (_song$track = song.track) === null || _song$track === void 0 ? void 0 : (_song$track$album = _song$track.album) === null || _song$track$album === void 0 ? void 0 : _song$track$album.mid) || (song === null || song === void 0 ? void 0 : (_song$album = song.album) === null || _song$album === void 0 ? void 0 : _song$album.mid) || null;
    const _tr = (song && song.track) || song || {};
      const _aMid = (song && song.album && song.album.mid) || (_tr.album && _tr.album.mid) || null;
      const _pmid = (song && song.pmid) || (song && song.album && song.album.pmid) || (song && song.vs && song.vs[1]) || (_tr.pmid) || (_tr.album && _tr.album.pmid) || (_tr.vs && _tr.vs[1]) || null;
      const _sMid = (song && song.singer && song.singer[0] && song.singer[0].mid) || (_tr.singer && _tr.singer[0] && _tr.singer[0].mid) || null;
      const _localCover = (song && song.album && (song.album.pic || song.album.picurl)) || (song && (song.pic || song.picurl)) || (_tr && _tr.album && (_tr.album.pic || _tr.album.picurl)) || null;
      const bgImg = _localCover || ((_aMid && _aMid.length > 5) ? utils/* default.getAlbumPic */.ZP.getAlbumPic(_aMid, 1500) : ((_pmid && _pmid.length > 5) ? ("https://y.gtimg.cn/music/photo_new/T062R800x800M000" + _pmid + ".jpg?max_age=2592000") : ((_sMid && _sMid.length > 5) ? ("https://y.gtimg.cn/music/photo_new/T001R1500x1500M000" + _sMid + ".jpg?max_age=2592000") : utils/* default.getAlbumPic */.ZP.getAlbumPic(null, 1500))));

    return /*#__PURE__*/react.createElement("div", {
      className: `cover_layout ${isCoverPlayer ? 'cover_layout--show' : ''} ${themeClass || 'theme-dark'}`,
      style: {
        display: `${isShow ? '' : 'none'} `,
        "--play-monet-bg": monetBgColor || (themeClass === 'theme-light' ? '#2f3442' : '#1a1c22')
      },
      onClick: handleWindowClick
    }, /*#__PURE__*/react.createElement(top_CoverPlayer, null), /*#__PURE__*/react.createElement("div", {
      className: "cover_player_page_main_cont"
    }, /*#__PURE__*/react.createElement("div", {
      className: "cover_album__wrapper"
    }, /*#__PURE__*/react.createElement("img", {
      className: "cover_album",
      src: bgImg,
      alt: null,
      style: {
        aspectRatio: "1 / 1",
        borderRadius: "7px",
        border: "none",
        boxShadow: "var(--play-album-shadow)",
        objectFit: "cover",
        display: "block",
        flexShrink: 0,
        transform: "translateZ(0)",
        willChange: "transform",
        transition: "transform 0.3s ease"
      },
      onError: (e) => {
        const curSrc = e.target.src;
        if (curSrc.includes("1500x1500")) {
          e.target.src = curSrc.replace("1500x1500", "1200x1200");
        } else if (curSrc.includes("1200x1200")) {
          e.target.src = curSrc.replace("1200x1200", "800x800");
        } else if (curSrc.includes("800x800")) {
          e.target.src = curSrc.replace("800x800", "500x500");
        } else if (curSrc.includes("T002R") && singerMid) {
          e.target.src = "https://y.gtimg.cn/music/photo_new/T001R1500x1500M000" + singerMid + ".jpg?max_age=2592000";
        }
      }
    }), song && /*#__PURE__*/react.createElement("div", {
      className: "cover_song_meta"
    }, /*#__PURE__*/react.createElement("div", {
      className: "cover_song_title marquee_wrap",
      title: song.title || DEFAULT_TITLE,
      onMouseEnter: (e) => {
        try {
          const wrap = e.currentTarget;
          const inner = wrap.querySelector(".marquee_inner");
          if (!inner) return;
          const diff = inner.scrollWidth - wrap.clientWidth;
          if (diff > 4) {
            const dur = Math.max(2.5, diff / 40);
            inner.style.transition = "transform " + dur + "s linear";
            inner.style.transform = "translateX(-" + (diff + 12) + "px)";
          }
        } catch (err) {}
      },
      onMouseLeave: (e) => {
        try {
          const wrap = e.currentTarget;
          const inner = wrap.querySelector(".marquee_inner");
          if (!inner) return;
          inner.style.transition = "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)";
          inner.style.transform = "translateX(0)";
        } catch (err) {}
      }
    }, /*#__PURE__*/react.createElement("span", {
      className: "marquee_inner"
    }, song.title || DEFAULT_TITLE)), /*#__PURE__*/react.createElement("div", {
      className: "cover_song_subrow marquee_wrap",
      title: (song.singer ? song.singer.map(s => (s.title || '').replace(/<\/?[^>]*>/g, '')).join(' / ') : '') + ((song.album && song.album.name) ? (' · ' + song.album.name) : ''),
      onMouseEnter: (e) => {
        try {
          const wrap = e.currentTarget;
          const inner = wrap.querySelector(".marquee_inner");
          if (!inner) return;
          const diff = inner.scrollWidth - wrap.clientWidth;
          if (diff > 4) {
            const dur = Math.max(2.5, diff / 40);
            inner.style.transition = "transform " + dur + "s linear";
            inner.style.transform = "translateX(-" + (diff + 12) + "px)";
          }
        } catch (err) {}
      },
      onMouseLeave: (e) => {
        try {
          const wrap = e.currentTarget;
          const inner = wrap.querySelector(".marquee_inner");
          if (!inner) return;
          inner.style.transition = "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)";
          inner.style.transform = "translateX(0)";
        } catch (err) {}
      }
    }, /*#__PURE__*/react.createElement("div", {
      className: "marquee_inner",
      style: { display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }
    }, /*#__PURE__*/react.createElement("span", {
      className: "cover_song_singer"
    }, song.singer && song.singer.map((item, idx) => {
      const sName = item.title.replace(/<\/?[^>]*>/g, "");
      return /*#__PURE__*/react.createElement("span", {
        key: idx,
        className: "cover_singer_link",
        onClick: (e) => {
          e.stopPropagation();
          if (item.mid) {
            (0,jump/* default */.Z)(jump/* PAGE_TYPE.SINGER */.G.SINGER, { mid: item.mid });
            (0,stook_esm/* mutate */.JG)("IsCoverPlayerVisible", false);
          }
        }
      }, sName, idx !== song.singer.length - 1 && " / ");
    })), song.album && song.album.name && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("span", {
      className: "cover_song_split"
    }, "·"), /*#__PURE__*/react.createElement("span", {
      className: "cover_song_album",
      onClick: (e) => {
        e.stopPropagation();
        if (song.album.mid) {
          (0,jump/* default */.Z)(jump/* PAGE_TYPE.ALBUM */.G.ALBUM, { mid: song.album.mid });
          (0,stook_esm/* mutate */.JG)("IsCoverPlayerVisible", false);
        }
      }
    }, song.album.name)))))), /*#__PURE__*/react.createElement(Lyric, {
      song: song,
      currentTime: currentTime
    })), /*#__PURE__*/react.createElement("div", {
      className: "cover_player"
    }, /*#__PURE__*/react.createElement(Player, {
      isCoverPlayer: isCoverPlayer,
      onShowPlaylist: handleToShowPlayList
    })));
  }

}
CoverPlayer.defaultProps = {
  isShow: false,
  isCoverPlayer: false
};
// EXTERNAL MODULE: ./src/lib/constant/concern.ts
var concern = __webpack_require__(78383);
;// CONCATENATED MODULE: ./src/entrys/index.tsx
















(0,skin/* changeSkin */.p)(setting/* default.settingInitialValue.theme */.ZP.settingInitialValue.theme);

const App = () => {
  const [isCoverPlayer, setIsCoverPlayer] = (0,react.useState)(true);
  const [isCoverPlayerVisible] = (0,stook_esm/* useStore */.oR)('IsCoverPlayerVisible', false);
  const [showCoverPlayer, setShowCoverPlayer] = (0,react.useState)(isCoverPlayerVisible);

  const activeIpcEvent = () => {
    external_electron_.ipcRenderer.on('check-update', async () => {
      if (!update/* updateUtil.updateConfig */.Td.updateConfig) {
        await update/* updateUtil.init */.Td.init();
      }

      update/* updateUtil.checkUpdate */.Td.checkUpdate();
    });
    (0,bridge/* emitSpdMessage */.a)({
      type: 'end',
      id: concern/* PAGE_SPD_ID.INVOKE_RENDERER */.pz.INVOKE_RENDERER
    });
  };

  (0,react.useEffect)(() => {
    activeIpcEvent();
  }, []);
  /**
   * 显示cover player，从下往上滑出
   * 关闭cover player，从上往下滑出
   * 动画本身由CoverPlayer组件控制，和本组件无关
   */

  (0,react.useEffect)(() => {
    if (isCoverPlayerVisible) {
      setShowCoverPlayer(isCoverPlayerVisible);
      setTimeout(() => {
        setIsCoverPlayer(isCoverPlayerVisible);
      }, 50);
    } else {
      setIsCoverPlayer(isCoverPlayerVisible);
      setTimeout(() => {
        setShowCoverPlayer(isCoverPlayerVisible);
      }, 500);
    }
  }, [isCoverPlayerVisible]);
  return /*#__PURE__*/react.createElement("div", {
    className: "mode_main__wrapper c_bg1"
  }, /*#__PURE__*/react.createElement(CoverPlayer, {
    isShow: showCoverPlayer,
    isCoverPlayer: isCoverPlayer
  }), /*#__PURE__*/react.createElement(TopArea, {
    history: common_history/* default */.Z
  }), /*#__PURE__*/react.createElement("div", {
    className: "main_cont"
  }, /*#__PURE__*/react.createElement(pages_main, {
    history: common_history/* default */.Z
  })));
};

react_dom.render( /*#__PURE__*/react.createElement(react_router/* Router */.F0, {
  history: common_history/* default */.Z
}, /*#__PURE__*/react.createElement(react_router/* Route */.AW, {
  path: "/",
  render: () => {
    return /*#__PURE__*/react.createElement(App, null);
  }
})), document.getElementById('app'));

//# sourceURL=webpack://qqmusic/./src/entrys/index.tsx_+_31_modules?