/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_http_action_radio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(94292);
/* harmony import */ var _src_client_modules_players__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(35229);
/* harmony import */ var _src_client_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(88943);
/* harmony import */ var _src_lib_common_service_js_bridge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(61887);
/* harmony import */ var _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(31603);
/* harmony import */ var _src_lib_common_service_commands_recommend_radio__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4012);
/* harmony import */ var _tencent_qmfe_ts_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(30366);
/* harmony import */ var _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4095);









class RadioPlayer {
  static getInstance() {
    if (!this._instance) {
      this._instance = new RadioPlayer(_src_client_modules_players__WEBPACK_IMPORTED_MODULE_1__/* .default.getInstance */ .Z.getInstance(), _src_lib_common_service_webview_bridge__WEBPACK_IMPORTED_MODULE_7__/* .default.getInstance */ .Z.getInstance());
    }

    return this._instance;
  }

  constructor(player, webviewBridge) {
    this.player = player;
    this.webviewBridge = webviewBridge;
    this.radioData = void 0;
    this.radioState = {
      song: {
        id: 0,
        songType: 0
      },
      state: _src_client_types__WEBPACK_IMPORTED_MODULE_2__/* .PLAY_STATE.NOT_READY */ .tJ.NOT_READY
    };
    this._onRadioStatusChange = new _tencent_qmfe_ts_core__WEBPACK_IMPORTED_MODULE_6__/* .Emitter */ .Q5();
    this.onRadioStatusChange = this._onRadioStatusChange.event;
    this.player.onPlayStatusChange(data => {
      if (data.playerMode === _src_client_types__WEBPACK_IMPORTED_MODULE_2__/* .PLAYER_MODE.RADIO */ .Ih.RADIO) {
        this._setRadioState({
          song: data.song,
          state: data.state
        });
      } else {
        this._setRadioState({
          state: _src_client_types__WEBPACK_IMPORTED_MODULE_2__/* .PLAY_STATE.PAUSED */ .tJ.PAUSED
        });
      }
    });
    this.player.onPlayIdxWillStep(data => {
      if (data.playerMode === _src_client_types__WEBPACK_IMPORTED_MODULE_2__/* .PLAYER_MODE.RADIO */ .Ih.RADIO) {
        this._handlePlayerIdxStep(data);
      }
    });
    this.onRadioStatusChange(data => {
      this.webviewBridge.dispatchEvent('radioStatusChange', data, false);
    });
  }
  /**
   * 从第一首往前播放或从最后一首往后播放，需要更换一批歌曲，并从第一首开始播放
   * @param data
   * @private
   */


  async _handlePlayerIdxStep(data) {
    const {
      prevIdx,
      step,
      length
    } = data;

    if (prevIdx === 0 && step === -1 || prevIdx === length - 1 && step === 1) {
      this.player.setAllowPlayIdxStep(false);
      this.radioData = await (0,_src_http_action_radio__WEBPACK_IMPORTED_MODULE_0__/* .getRadioSongInfo */ .W)(this.radioData.id);
      this.player.setAllowPlayIdxStep(true);

      this._playNewIdxSong(0);
    }
  }

  _setRadioState(data) {
    var _this$radioState$song, _this$radioState$song2, _this$radioState$song3, _this$radioState$song4;

    const {
      song,
      state
    } = data;

    if ((song === null || song === void 0 ? void 0 : song.id) === ((_this$radioState$song = this.radioState.song) === null || _this$radioState$song === void 0 ? void 0 : _this$radioState$song.id) && (song === null || song === void 0 ? void 0 : song.songType) === ((_this$radioState$song2 = this.radioState.song) === null || _this$radioState$song2 === void 0 ? void 0 : _this$radioState$song2.songType) && state === this.radioState.state) {
      return;
    }

    this.radioState = { ...this.radioState,
      ...data
    };

    this._onRadioStatusChange.fire(_src_lib_common_service_js_bridge__WEBPACK_IMPORTED_MODULE_3__/* .default.generateSuccessRes */ .Z.generateSuccessRes({
      id: this.radioData.id,
      status: this.radioState.state === _src_client_types__WEBPACK_IMPORTED_MODULE_2__/* .PLAY_STATE.PLAYING */ .tJ.PLAYING ? 1 : 0,
      songInfo: { ...this.radioState.song,
        pic: _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_4__/* .default.getAlbumPic */ .ZP.getAlbumPic(((_this$radioState$song3 = this.radioState.song) === null || _this$radioState$song3 === void 0 ? void 0 : (_this$radioState$song4 = _this$radioState$song3.album) === null || _this$radioState$song4 === void 0 ? void 0 : _this$radioState$song4.mid) || '')
      }
    }));
  }

  setRadioData(data) {
    this.radioData = { ...this.radioData,
      ...data
    };
  }

  setRadioState(data) {
    this._setRadioState(data);
  }

  handleRadioCmd(params) {
    switch (params.cmd) {
      case _src_lib_common_service_commands_recommend_radio__WEBPACK_IMPORTED_MODULE_5__/* .RADIO_CMD.PLAY */ .Tr.PLAY:
        this._playRadioData();

        break;

      case _src_lib_common_service_commands_recommend_radio__WEBPACK_IMPORTED_MODULE_5__/* .RADIO_CMD.PAUSE */ .Tr.PAUSE:
        this._pause();

        break;

      case _src_lib_common_service_commands_recommend_radio__WEBPACK_IMPORTED_MODULE_5__/* .RADIO_CMD.REMOVE */ .Tr.REMOVE:
        this._removeCurrentSong();

        break;

      case _src_lib_common_service_commands_recommend_radio__WEBPACK_IMPORTED_MODULE_5__/* .RADIO_CMD.NEXT */ .Tr.NEXT:
        this._next();

        break;
    }
  }

  _playRadioData() {
    if (this.player.isRadioMode && this.player.isPaused) {
      this.player.resume();
    } else {
      this.player.playAll({
        songList: this.radioData.songList,
        playerMode: _src_client_types__WEBPACK_IMPORTED_MODULE_2__/* .PLAYER_MODE.RADIO */ .Ih.RADIO,
        index: 0
      });
    }
  }

  _pause() {
    this.player.pause();
  }

  async _removeCurrentSong() {
    const index = this.currentSongIndex;

    if (index !== -1) {
      let newIdx = index;

      if (index === this.radioData.songList.length - 1) {
        // 换一批电台歌曲
        this.radioData = await (0,_src_http_action_radio__WEBPACK_IMPORTED_MODULE_0__/* .getRadioSongInfo */ .W)(this.radioData.id);
        newIdx = 0;
      } else {
        this.radioData.songList = [...this.radioData.songList.slice(0, index), ...this.radioData.songList.slice(index + 1)];
      }

      this._setRadioState({
        song: this.radioData.songList[newIdx]
      });

      if (this.player.isRadioMode) {
        this._playNewIdxSong(newIdx);
      }
    }
  }

  _playNewIdxSong(idx) {
    this.player.playAll({
      songList: this.radioData.songList,
      index: idx,
      playerMode: _src_client_types__WEBPACK_IMPORTED_MODULE_2__/* .PLAYER_MODE.RADIO */ .Ih.RADIO
    });
  }

  get currentSongIndex() {
    const {
      song
    } = this.radioState;
    return this.radioData.songList.findIndex(item => (item === null || item === void 0 ? void 0 : item.id) === (song === null || song === void 0 ? void 0 : song.id) && (item === null || item === void 0 ? void 0 : item.songType) === (song === null || song === void 0 ? void 0 : song.songType));
  }

  async _next() {
    const index = this.currentSongIndex;
    let newIdx = index + 1;

    if (index === this.radioData.songList.length - 1) {
      this.radioData = await (0,_src_http_action_radio__WEBPACK_IMPORTED_MODULE_0__/* .getRadioSongInfo */ .W)(this.radioData.id);
      newIdx = 0;
    }

    this._playNewIdxSong(newIdx);
  }

}

RadioPlayer._instance = void 0;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RadioPlayer);

//# sourceURL=webpack://qqmusic/./src/pages/recommend/module/RadioPlayer.ts?