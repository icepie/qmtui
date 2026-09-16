/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "kQ": () => (/* binding */ PLAY_STATE_CHANGE),
/* harmony export */   "IA": () => (/* binding */ WindowName)
/* harmony export */ });
/* unused harmony export PlayState */
/* harmony import */ var _client_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88943);

let PlayState;

(function (PlayState) {
  PlayState[PlayState["PAUSED"] = 0] = "PAUSED";
  PlayState[PlayState["PLAYING"] = 1] = "PLAYING";
  PlayState[PlayState["PREPARING"] = 2] = "PREPARING";
  PlayState[PlayState["IDLE"] = 3] = "IDLE";
  PlayState[PlayState["END"] = 4] = "END";
})(PlayState || (PlayState = {}));

// todo 这里是V17定义的枚举和这边不一样，需要做一下转换
const PLAY_STATE_CHANGE = {
  [_client_types__WEBPACK_IMPORTED_MODULE_0__/* .PLAY_STATE.PLAYING */ .tJ.PLAYING]: PlayState.PLAYING,
  [_client_types__WEBPACK_IMPORTED_MODULE_0__/* .PLAY_STATE.PAUSED */ .tJ.PAUSED]: PlayState.PAUSED,
  [_client_types__WEBPACK_IMPORTED_MODULE_0__/* .PLAY_STATE.ENDED */ .tJ.ENDED]: PlayState.END
};
let WindowName;

(function (WindowName) {
  WindowName["MAIN_WINDOW"] = "index";
  WindowName["ABOUT_WINDOW"] = "about";
  WindowName["DOWNLOAD_WINDOW"] = "download_progress";
  WindowName["DESKTOP_LYRIC_WINDOW"] = "lyric";
  WindowName["VISIBLE_PLAY_WINDOW"] = "visible_play";
  WindowName["COMMON_DIALOG"] = "common_dialog";
})(WindowName || (WindowName = {}));

//# sourceURL=webpack://qqmusic/./src/types/index.ts?