__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var _src_lib_constant_concern__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(78383);
/* harmony import */ var _src_component_common_webview__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(69458);
/* harmony import */ var _src_tool_bridge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(53941);
/* harmony import */ var _src_component_animation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(23899);







const Musicroom = () => {
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_src_tool_bridge__WEBPACK_IMPORTED_MODULE_3__/* .emitSpdMessage */ .a)({
      type: 'start',
      id: _src_lib_constant_concern__WEBPACK_IMPORTED_MODULE_1__/* .PAGE_SPD_ID.LOAD_MUSIC_ROOM_WEBVIEW */ .pz.LOAD_MUSIC_ROOM_WEBVIEW
    });
  }, []);

  const handleLoaded = () => {
    (0,_src_tool_bridge__WEBPACK_IMPORTED_MODULE_3__/* .emitSpdMessage */ .a)({
      type: 'end',
      id: _src_lib_constant_concern__WEBPACK_IMPORTED_MODULE_1__/* .PAGE_SPD_ID.LOAD_MUSIC_ROOM_WEBVIEW */ .pz.LOAD_MUSIC_ROOM_WEBVIEW
    });
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_src_component_animation__WEBPACK_IMPORTED_MODULE_4__/* .EaseInWrapper */ .W, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_src_component_common_webview__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z, {
    src: 'https://i.y.qq.com/n2/wk_v17/#/musicroom/recommend',
    id: 'music_room',
    onLoaded: handleLoaded
  }));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Musicroom);

//# sourceURL=webpack://qqmusic/./src/pages/musicroom/index.tsx?