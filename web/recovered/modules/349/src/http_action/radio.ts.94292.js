/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "W": () => (/* binding */ getRadioSongInfo)
/* harmony export */ });
/* harmony import */ var _src_lib_network__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32590);
/* harmony import */ var _src_lib_network_radio__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(37723);
/* harmony import */ var _src_client_modules_tools_common_action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53554);



const getRadioSongInfo = async (id, num = 20) => {
  const fetchRes = await (0,_src_lib_network__WEBPACK_IMPORTED_MODULE_0__/* .ufetch */ .D)({
    getRadioSongInfoRes: (0,_src_lib_network_radio__WEBPACK_IMPORTED_MODULE_2__/* .GET_RADIO_TRACK */ .r)({
      id,
      num
    })
  });
  const result = {
    id,
    songList: []
  };

  if (fetchRes && fetchRes.code === 0 && fetchRes.getRadioSongInfoRes && fetchRes.getRadioSongInfoRes.code === 0 && fetchRes.getRadioSongInfoRes.data) {
    var _fetchRes$getRadioSon;

    result.songList = (0,_src_client_modules_tools_common_action__WEBPACK_IMPORTED_MODULE_1__/* .formatSongsAndMarkLike */ .L)(((_fetchRes$getRadioSon = fetchRes.getRadioSongInfoRes.data) === null || _fetchRes$getRadioSon === void 0 ? void 0 : _fetchRes$getRadioSon.tracks) || []);
  }

  return result;
};

//# sourceURL=webpack://qqmusic/./src/http_action/radio.ts?