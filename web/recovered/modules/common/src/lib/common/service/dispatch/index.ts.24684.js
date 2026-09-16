/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RP": () => (/* binding */ playStatusChange),
/* harmony export */   "tj": () => (/* binding */ changeILikeStatus),
/* harmony export */   "e6": () => (/* binding */ videoFullScreen)
/* harmony export */ });
/* harmony import */ var _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4095);

/**
 * 通知webview进行歌曲状态的切换
 * @param song
 * @param playStatus
 */

const playStatusChange = (song, playStatus) => {
  _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_0__/* .default.getInstance */ .Z.getInstance().dispatchEvent('playStatusChange', {
    playStatus,
    songId: song === null || song === void 0 ? void 0 : song.id,
    songType: song === null || song === void 0 ? void 0 : song.type
  });
};
/**
 * 通知webview进行喜欢状态的切换
 * @param song
 * @param state
 */

const changeILikeStatus = (song, state) => {
  _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_0__/* .default.getInstance */ .Z.getInstance().dispatchEvent('playStatusChange', {
    state,
    mid: song === null || song === void 0 ? void 0 : song.mid,
    songtype: song.type
  });
};
/**
 * @description 全屏事件
 * @export
 * @param {number} state 0 非全屏 1 全屏
 */

const videoFullScreen = state => {
  _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_0__/* .default.getInstance */ .Z.getInstance().dispatchEvent('videoFullScreen', state);
};

//# sourceURL=webpack://qqmusic/./src/lib/common/service/dispatch/index.ts?