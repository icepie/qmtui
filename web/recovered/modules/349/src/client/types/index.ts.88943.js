/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tJ": () => (/* binding */ PLAY_STATE),
/* harmony export */   "kV": () => (/* binding */ PLAY_MODE),
/* harmony export */   "Ih": () => (/* binding */ PLAYER_MODE)
/* harmony export */ });
let PLAY_STATE;

(function (PLAY_STATE) {
  PLAY_STATE["NOT_READY"] = "notReady";
  PLAY_STATE["READY"] = "ready";
  PLAY_STATE["PLAYING"] = "play";
  PLAY_STATE["PAUSED"] = "pause";
  PLAY_STATE["RESUME"] = "resume";
  PLAY_STATE["ENDED"] = "end";
  PLAY_STATE["ERROR"] = "error";
  PLAY_STATE["TIME_UPDATE"] = "timeupdate";
  PLAY_STATE["MODE_CHANGE"] = "modeChange";
  PLAY_STATE["CLEAR_PLAY_LIST"] = "clearPlayList";
})(PLAY_STATE || (PLAY_STATE = {}));

let PLAY_MODE;

(function (PLAY_MODE) {
  PLAY_MODE[PLAY_MODE["RANDOM"] = 1] = "RANDOM";
  PLAY_MODE[PLAY_MODE["SEQUENTIAL"] = 2] = "SEQUENTIAL";
  PLAY_MODE[PLAY_MODE["SINGLE_CYCLE"] = 3] = "SINGLE_CYCLE";
  PLAY_MODE[PLAY_MODE["LIST_CYCLE"] = 4] = "LIST_CYCLE";
})(PLAY_MODE || (PLAY_MODE = {}));

let PLAYER_MODE;

(function (PLAYER_MODE) {
  PLAYER_MODE[PLAYER_MODE["NORMAL"] = 0] = "NORMAL";
  PLAYER_MODE[PLAYER_MODE["RADIO"] = 1] = "RADIO";
})(PLAYER_MODE || (PLAYER_MODE = {}));

//# sourceURL=webpack://qqmusic/./src/client/types/index.ts?