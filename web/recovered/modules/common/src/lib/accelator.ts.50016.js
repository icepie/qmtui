/* harmony import */ var mousetrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42441);
/* harmony import */ var mousetrap__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mousetrap__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_tool_bridge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53941);

 // 刷新页面

mousetrap__WEBPACK_IMPORTED_MODULE_0___default().bind('ctrl+f5', () => {
  (0,_src_tool_bridge__WEBPACK_IMPORTED_MODULE_1__/* .emitIpcRenderMessage */ .D)('window_message', 'refreshWindow');
});

//# sourceURL=webpack://qqmusic/./src/lib/accelator.ts?