/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": () => (/* binding */ emitIpcRenderMessage),
/* harmony export */   "a": () => (/* binding */ emitSpdMessage)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(58933);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);

const emitIpcRenderMessage = (module, method, data) => {
  electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('render-process-message', {
    module,
    method,
    data
  });
};
const emitSpdMessage = data => {
  emitIpcRenderMessage('report_message', 'spd_message', data);
};

//# sourceURL=webpack://qqmusic/./src/tool/bridge/index.ts?