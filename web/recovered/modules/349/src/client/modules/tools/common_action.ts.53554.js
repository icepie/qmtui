/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": () => (/* binding */ formatSongsAndMarkLike)
/* harmony export */ });
/* harmony import */ var _src_client_modules_tools_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32698);
/* harmony import */ var stook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49068);



/**
 * 格式化歌单内部的歌曲信息并且播放
 * @param list
 * @param force
 */
const formatSongsAndMarkLike = (list, force) => {
  if (force !== null && force !== void 0 && force.force) {
    return list.map(_src_client_modules_tools_index__WEBPACK_IMPORTED_MODULE_0__/* .formatSongItemData */ .cv).map(item => ({ ...item,
      like: force.isLike
    }));
  }

  const likeSongs = (0,stook__WEBPACK_IMPORTED_MODULE_1__/* .getState */ .y0)('FavoriteSingleSongs') || [];
  const likeSet = new Set();
  likeSongs.forEach(item => likeSet.add(`${item.songId}`));
  return list.map(_src_client_modules_tools_index__WEBPACK_IMPORTED_MODULE_0__/* .formatSongItemData */ .cv).map(item => ({ ...item,
    like: likeSet.has(`${item.id}`)
  }));
};

//# sourceURL=webpack://qqmusic/./src/client/modules/tools/common_action.ts?