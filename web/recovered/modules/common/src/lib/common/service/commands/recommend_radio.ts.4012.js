/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VP": () => (/* binding */ RadioEventHandler),
/* harmony export */   "U7": () => (/* binding */ RadioCmdHandler),
/* harmony export */   "Tr": () => (/* binding */ RADIO_CMD)
/* harmony export */ });
/* harmony import */ var _src_http_action_radio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(94292);
/* harmony import */ var _src_pages_recommend_module_RadioPlayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(40292);
/* harmony import */ var _src_client_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(88943);




class RadioEventHandler {
  constructor() {
    this.eventName = 'queryRadioSongInfo';
    this.radioPlayer = void 0;
  }

  async handler(params) {
    if (!this.radioPlayer) {
      this.radioPlayer = _src_pages_recommend_module_RadioPlayer__WEBPACK_IMPORTED_MODULE_1__/* .default.getInstance */ .Z.getInstance();
    }

    if (params !== null && params !== void 0 && params.id) {
      const radioInfo = await (0,_src_http_action_radio__WEBPACK_IMPORTED_MODULE_0__/* .getRadioSongInfo */ .W)(params.id);
      this.radioPlayer.setRadioData(radioInfo);

      if (radioInfo.songList.length > 0) {
        this.radioPlayer.setRadioState({
          song: radioInfo.songList[0],
          state: _src_client_types__WEBPACK_IMPORTED_MODULE_2__/* .PLAY_STATE.NOT_READY */ .tJ.NOT_READY
        });
      }
    }
  }

}

var RADIO_CMD;

(function (RADIO_CMD) {
  RADIO_CMD[RADIO_CMD["PAUSE"] = 0] = "PAUSE";
  RADIO_CMD[RADIO_CMD["PLAY"] = 1] = "PLAY";
  RADIO_CMD[RADIO_CMD["NEXT"] = 3] = "NEXT";
  RADIO_CMD[RADIO_CMD["REMOVE"] = 4] = "REMOVE";
})(RADIO_CMD || (RADIO_CMD = {}));

class RadioCmdHandler {
  constructor() {
    this.eventName = 'radioCmd';
    this.radioPlayer = void 0;
  }

  handler(params) {
    if (!this.radioPlayer) {
      this.radioPlayer = _src_pages_recommend_module_RadioPlayer__WEBPACK_IMPORTED_MODULE_1__/* .default.getInstance */ .Z.getInstance();
    }

    this.radioPlayer.handleRadioCmd(params);
  }

}



//# sourceURL=webpack://qqmusic/./src/lib/common/service/commands/recommend_radio.ts?