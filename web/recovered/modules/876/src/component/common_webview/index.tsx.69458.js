/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31603);
/* harmony import */ var _src_component_loading_qqmusic_loading__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4694);
/* harmony import */ var _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4095);




const DEFAULT_STYLE = {
  flex: 1,
  borderWidth: '0px',
  height: '100%'
};

const CommonWebview = props => {
  const {
    style = {},
    id,
    src,
    keepAliveDelayLoading = false
  } = props;
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    var _ref$current, _ref$current2;

    (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.addEventListener('dom-ready', () => {
      var _props$onLoaded;

      setLoading(false);
      props === null || props === void 0 ? void 0 : (_props$onLoaded = props.onLoaded) === null || _props$onLoaded === void 0 ? void 0 : _props$onLoaded.call(props);
      _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_3__/* .default.getInstance */ .Z.getInstance().listen(document.getElementById(id), id);
    });
    ref === null || ref === void 0 ? void 0 : (_ref$current2 = ref.current) === null || _ref$current2 === void 0 ? void 0 : _ref$current2.addEventListener('did-fail-load', () => {
      ref.current.reload();
    });
    return () => {
      _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_3__/* .default.getInstance */ .Z.getInstance().remove(id);
    };
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (loading || keepAliveDelayLoading) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_src_component_loading_qqmusic_loading__WEBPACK_IMPORTED_MODULE_2__/* .QQMusicLoading */ .Z, {
    className: "loading_cover"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("webview", {
 nodeintegration: '', webpreferences: 'contextIsolation=false',    preload: _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_1__/* .default.returnPreload */ .ZP.returnPreload(),
    src: src,
    id: id,
    ref: ref,
    style: { ...DEFAULT_STYLE,
      ...style
    }
  }));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CommonWebview);

//# sourceURL=webpack://qqmusic/./src/component/common_webview/index.tsx?