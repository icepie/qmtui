/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_players__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(35229);
/* harmony import */ var _src_lib_common_service_commands_play_mv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(41923);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(58933);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);




class QQMusicClient {
  constructor() {
    this.player = void 0;
  }

  playMV(param) {}

  playSong(data) {
    if (!this.player) {
      this.player = _modules_players__WEBPACK_IMPORTED_MODULE_0__/* .default.getInstance */ .Z.getInstance();
    }

    this.player.playAll({
      songList: data.songList,
      index: (data === null || data === void 0 ? void 0 : data.playIndex) || 0
    });
  }

  openUrl(data) {
    if (data !== null && data !== void 0 && data.url) {
      electron__WEBPACK_IMPORTED_MODULE_2__.shell.openExternal(data.url);
    }
  }

}

window.__isQQMusicElectron = 1;
const client = new QQMusicClient();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (client);

//# sourceURL=webpack://qqmusic/./src/client/index.tsx?