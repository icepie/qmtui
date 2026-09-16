__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(16550);
/* harmony import */ var _src_lib_constant_concern__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(78383);
/* harmony import */ var _src_component_common_webview__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(69458);
/* harmony import */ var _src_tool_bridge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(53941);
/* harmony import */ var _src_component_animation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(23899);







class Video extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent {
  constructor(props) {
    super(props);

    this.handleLoaded = () => {
      (0,_src_tool_bridge__WEBPACK_IMPORTED_MODULE_3__/* .emitSpdMessage */ .a)({
        type: 'end',
        id: _src_lib_constant_concern__WEBPACK_IMPORTED_MODULE_1__/* .PAGE_SPD_ID.LOAD_VIDEO_WEBVIEW */ .pz.LOAD_VIDEO_WEBVIEW
      });
    };

    (0,_src_tool_bridge__WEBPACK_IMPORTED_MODULE_3__/* .emitSpdMessage */ .a)({
      type: 'start',
      id: _src_lib_constant_concern__WEBPACK_IMPORTED_MODULE_1__/* .PAGE_SPD_ID.LOAD_VIDEO_WEBVIEW */ .pz.LOAD_VIDEO_WEBVIEW
    });
  }

  render() {
    const {
      handleLoaded
    } = this;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_src_component_animation__WEBPACK_IMPORTED_MODULE_4__/* .EaseInWrapper */ .W, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_src_component_common_webview__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z, {
      onLoaded: handleLoaded,
      src: 'https://i.y.qq.com/n2/wk_v17/#/mv/recommend',
      id: 'mv_recommend'
    }));
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .withRouter */ .EN)(Video));

//# sourceURL=webpack://qqmusic/./src/pages/video/index.tsx?