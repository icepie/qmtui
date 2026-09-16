/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "zk": () => (/* binding */ ShowCommonDialog),
/* harmony export */   "jX": () => (/* binding */ showCommonDlg),
/* harmony export */   "f6": () => (/* binding */ showDisableFrame)
/* harmony export */ });
/* harmony import */ var _src_tool_bridge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53941);

class ShowCommonDialog {
  constructor() {
    this.eventName = 'showFrame';
  }

  handler(params) {
    showCommonDlg(params);
  }

}
/**
 * 写两个是为了兼容之前的代码
 * @param opts
 */

const showCommonDlg = opts => {
  (0,_src_tool_bridge__WEBPACK_IMPORTED_MODULE_0__/* .emitIpcRenderMessage */ .D)('window_message', 'open_common_dialog', opts);
};
/**
 * 打开无版权弹框
 */

const showDisableFrame = song => {
  const recommendURL = 'https://y.qq.com/wk_v17/#/recommendFrame';
  showCommonDlg({
    title: '提示',
    width: 440,
    height: 172,
    openUrl: `${recommendURL}?songid=${song === null || song === void 0 ? void 0 : song.id}`
  });
};

//# sourceURL=webpack://qqmusic/./src/lib/common/service/commands/show_common_dlg.ts?