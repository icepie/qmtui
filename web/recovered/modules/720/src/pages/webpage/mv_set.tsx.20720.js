__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(16550);
/* harmony import */ var _lib_common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31603);
/* harmony import */ var _src_component_common_webview__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(69458);





const Mv_set = () => {
  const url = decodeURIComponent(_lib_common_utils__WEBPACK_IMPORTED_MODULE_1__/* .default.getParam */ .ZP.getParam('url'));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_src_component_common_webview__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z, {
    src: url,
    id: 'mv_set_webview'
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__/* .withRouter */ .EN)(Mv_set));

//# sourceURL=webpack://qqmusic/./src/pages/webpage/mv_set.tsx?