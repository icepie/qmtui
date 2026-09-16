/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cv": () => (/* binding */ formatSongItemData),
/* harmony export */   "nn": () => (/* binding */ isSongAvailable),
/* harmony export */   "TV": () => (/* binding */ shuffle),
/* harmony export */   "Oe": () => (/* binding */ IMG_TYPE),
/* harmony export */   "GR": () => (/* binding */ handleImgLoadErr),
/* harmony export */   "Rk": () => (/* binding */ formatSelfFavPlayListItem),
/* harmony export */   "Pg": () => (/* binding */ formatSelfFavMvListItem)
/* harmony export */ });
/* unused harmony export makePlayTime */
/* harmony import */ var _lib_common_login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(68010);
/* harmony import */ var _src_lib_common_service_commands_show_common_dlg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(36702);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(96486);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(31603);
/* harmony import */ var _src_lib_common_show_msg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12468);
/* harmony import */ var _src_lib_common_popup__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(43053);






const actions = ['none', 'play_lq', // 1.  普通音质播放权限位 （0：不可以播放 1：可以播放）
'play_hq', // 2.  HQ音质播放权限位 （0：不可以播放 1：可以播放）
'play_sq', // 3.  SQ音质播放权限位 （0：不可以播放 1：可以播放）
'down_lq', // 4.  普通音质下载权限位 （0：不可以下载 1：可以下载）
'down_hq', // 5.  HQ音质下载权限位 （0：不可以下载 1：可以下载）
'down_sq', // 6.  SQ音质下载权限位 （0：不可以下载 1：可以下载）
'soso', // 7.  地球展示权限位  （0：库内不展示地球 1：展示地球标志）
'fav', // 8.  收藏权限位  （0：无权限 1：有权限）
'share', // 9.  分享权限位  （0：无权限 1：有权限）
'bgm', // 10. 背景音乐权限位  （0：无权限 1：有权限）
'ring', // 11. 铃声设置权限位  （0：无权限 1：有权限）
'sing', // 12. 唱这首歌权限位  （0：无权限 1：有权限）
'radio', // 13. 单曲电台权限位  （0：无权限 1：有权限）
'try', // 14. 试听权限位 （0：不可以试听 1：可以试听）
'give', // 15. 赠送权限位 （0：不可以赠送 1：可以赠送）
'poster', // 16. 海报制作权限位 （0：不可以 1：可以制作）
'play_5_1', // 17. 5.1音质播放权限位 （0：不可以播放 1：可以播放）
'down_5_1', // 18. 5.1音质下载权限位 （0：不可以下载 1：可以下载）
'bullet', // 19. 弹幕权限位 （0：不可以 1：可以）
'cache_lq', // 20. LQ音质缓存权限位 （0：不可以缓存 1：可以缓存）
'cache_hq', // 21. HQ音质缓存权限位 （0：不可以缓存 1：可以缓存）
'cache_sq', // 22. SQ音质缓存权限位 （0：不可以缓存 1：可以缓存）
'cache_dts', // 23. DTS音质缓存权限位 （0：不可以缓存 1：可以缓存）
'track_pay' // 24. 单曲购买权限位 （0：不可以购买 1：可以购买）
]; // songdata.action.icons 解析 1代表需要某种身份才可以操作 0没有表示限制
// 1: 绿钻豪华（LQ试听）
// 2: 绿钻豪华（HQ试听）
// 3: 绿钻豪华（SQ试听）
// 4: 绿钻豪华（LQ下载）
// 5: 绿钻豪华（HQ下载）
// 6: 绿钻豪华（SQ下载）
// 7: 付费包（LQ试听）
// 8: 付费包（HQ试听）
// 9: 付费包（SQ试听）
// 10: 付费包（LQ下载）
// 11: 付费包（HQ下载）
// 12: 付费包（SQ下载）
// 重新构建数据
// songdata.icons
// 0: 绿钻豪华（LQ下载）
// 1: 绿钻豪华（HQ下载）
// 2: 绿钻豪华（SQ下载）
// 3: 付费包（LQ下载）
// 4: 付费包（HQ下载）
// 5: 付费包（SQ下载）

const formatSongItemData = item => {
  var _item$track, _item$track$action, _item$action, _item$track2, _item$track3, _item$track3$action, _item$action2, _item$track4, _item$track5, _item$track6, _item$track7, _item$track8, _item$mv, _item$track9, _item$track9$mv, _replaceNCR, _item$track10, _item$track11, _replaceNCR2, _item$track12, _item$track13, _item$album;

  if (item.isFormatted) {
    return item;
  } // 下发icon 1表示需要图标，2表示不用图标


  item.icons = ['0', '0', '0', '0', '0', '0'];
  const icons = (((_item$track = item.track) === null || _item$track === void 0 ? void 0 : (_item$track$action = _item$track.action) === null || _item$track$action === void 0 ? void 0 : _item$track$action.icons) || (item === null || item === void 0 ? void 0 : (_item$action = item.action) === null || _item$action === void 0 ? void 0 : _item$action.icons) || '').toString(2).split('').reverse();
  item.copyRight = icons[0];
  item.icons = [icons[4] || '0', icons[5] || '0', icons[6] || '0', icons[10] || '0', icons[11] || '0', icons[12] || '0']; // 绿钻图标表示位置

  item.vipIcon = icons[18] || '0'; // 预付发布歌曲标识歌曲

  item.prePublic = icons[14] || '0';
  item.mv = (item === null || item === void 0 ? void 0 : (_item$track2 = item.track) === null || _item$track2 === void 0 ? void 0 : _item$track2.mv) || (item === null || item === void 0 ? void 0 : item.mv);
  item.switch = (item === null || item === void 0 ? void 0 : (_item$track3 = item.track) === null || _item$track3 === void 0 ? void 0 : (_item$track3$action = _item$track3.action) === null || _item$track3$action === void 0 ? void 0 : _item$track3$action.switch) || ((_item$action2 = item.action) === null || _item$action2 === void 0 ? void 0 : _item$action2.switch);
  item.type = (item === null || item === void 0 ? void 0 : (_item$track4 = item.track) === null || _item$track4 === void 0 ? void 0 : _item$track4.type) || (item === null || item === void 0 ? void 0 : item.type);

  if (item.type === 1 && (typeof item.switch === 'undefined' || item.switch == 0)) {
    item.switch = 403;
  }

  const song_switch_data = item.switch.toString(2).split('').reverse();
  item.action = (item === null || item === void 0 ? void 0 : item.action) || (item === null || item === void 0 ? void 0 : (_item$track5 = item.track) === null || _item$track5 === void 0 ? void 0 : _item$track5.action) || {};
  actions.forEach((actItem, idx) => {
    item.action[actItem] = parseInt(song_switch_data[idx], 10) || 0;
  });
  item.pay = (item === null || item === void 0 ? void 0 : item.pay) || {};
  item.preview = (item === null || item === void 0 ? void 0 : item.preview) || {};
  item.playTime = makePlayTime((item === null || item === void 0 ? void 0 : (_item$track6 = item.track) === null || _item$track6 === void 0 ? void 0 : _item$track6.interval) || (item === null || item === void 0 ? void 0 : item.interval)) || ''; //到底能不能播(不算试听)

  item.action.play = 0;

  if (item.action.play_lq || item.action.play_hq || item.action.play_sq || item.action.play_5_1) {
    item.action.play = 1;
  }

  item.checked = false; //是否能试听

  item.tryPlay = 0;

  if (item.action['try']) {
    item.tryPlay = 1;
  } //只要有能播的东西  anyPlay就为true


  item.anyPlay = 0;

  if (item.action.play || item.tryPlay) {
    item.anyPlay = 1;
  }

  item.alertid = (item === null || item === void 0 ? void 0 : item.alertid) || item.action && item.action.alert || 0;
  item.msgid = (item === null || item === void 0 ? void 0 : item.msgid) || item.action && item.action.msgid || 0;
  item.tryIcon = 0; //展示试听icon

  item.id = (item === null || item === void 0 ? void 0 : (_item$track7 = item.track) === null || _item$track7 === void 0 ? void 0 : _item$track7.id) || (item === null || item === void 0 ? void 0 : item.id) || 0;
  item.mid = (item === null || item === void 0 ? void 0 : (_item$track8 = item.track) === null || _item$track8 === void 0 ? void 0 : _item$track8.mid) || (item === null || item === void 0 ? void 0 : item.mid);
  item.vid = (item === null || item === void 0 ? void 0 : (_item$mv = item.mv) === null || _item$mv === void 0 ? void 0 : _item$mv.vid) || (item === null || item === void 0 ? void 0 : (_item$track9 = item.track) === null || _item$track9 === void 0 ? void 0 : (_item$track9$mv = _item$track9.mv) === null || _item$track9$mv === void 0 ? void 0 : _item$track9$mv.vid);
  item.disabled = 0; //歌曲置灰
  //这两种都是针对非付费且不能播放的歌曲

  if (!item.action.play && !item.pay.payplay && !item.pay.pay_down) {
    if (item.tryPlay) {
      item.tryIcon = 1;
    } else {
      item.disabled = 1;
    }
  }

  item.name = escapeHtml((_replaceNCR = replaceNCR((item === null || item === void 0 ? void 0 : (_item$track10 = item.track) === null || _item$track10 === void 0 ? void 0 : _item$track10.name) || (item === null || item === void 0 ? void 0 : item.name) || '')) === null || _replaceNCR === void 0 ? void 0 : _replaceNCR.replace(/<[^>]+>/g, '')) || '';
  item.singer = ((item === null || item === void 0 ? void 0 : (_item$track11 = item.track) === null || _item$track11 === void 0 ? void 0 : _item$track11.singer) || (item === null || item === void 0 ? void 0 : item.singer)).map(_singer => {
    _singer.name = replaceNCR(_singer.name);
    _singer.title = replaceNCR(_singer.title);
    return _singer;
  });
  item.title = (_replaceNCR2 = replaceNCR((item === null || item === void 0 ? void 0 : (_item$track12 = item.track) === null || _item$track12 === void 0 ? void 0 : _item$track12.title) || (item === null || item === void 0 ? void 0 : item.title))) === null || _replaceNCR2 === void 0 ? void 0 : _replaceNCR2.replace(/<[^>]+>/g, '');
  item.album = (item === null || item === void 0 ? void 0 : (_item$track13 = item.track) === null || _item$track13 === void 0 ? void 0 : _item$track13.album) || (item === null || item === void 0 ? void 0 : item.album);
  item.albumname = (item === null || item === void 0 ? void 0 : item.albumname) || (item === null || item === void 0 ? void 0 : (_item$album = item.album) === null || _item$album === void 0 ? void 0 : _item$album.name) || '';
  item.songname = (item === null || item === void 0 ? void 0 : item.songname) || (item === null || item === void 0 ? void 0 : item.title);
  item.isFormatted = true;
  item.songType = item.songType || item.type;
  return item;
};
const makePlayTime = time => {
  if (time) {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  }
};

const replaceNCR = str => {
  const reg = /&#(\d+);/g;

  if (str) {
    return str.replace(reg, (_match, $1) => String.fromCharCode($1));
  }
};

const escapeHtml = str => {
  if (str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  }
};

const isSongAvailable = (song, showDisableDialog = true) => {
  if (!song) return false;
  if (song.isLocal || song.isWebDav || song.localFilePath) return true;
  const mid = (song.track && song.track.mid) || song.mid;
  if (!mid) {
    if (showDisableDialog) {
      _src_lib_common_popup__WEBPACK_IMPORTED_MODULE_5__/* .default.show */ .Z.show(0, '暂不支持播放');
    }
    return false;
  }
  return true;
};

const shuffle = (arr, currentIndex) => {
  const item = arr[currentIndex];

  const _arr = arr.filter(_ => _ !== item);

  return [item, ...(0,lodash__WEBPACK_IMPORTED_MODULE_2__.shuffle)(_arr)];
};
let IMG_TYPE;

(function (IMG_TYPE) {
  IMG_TYPE["ALBUM"] = "album";
})(IMG_TYPE || (IMG_TYPE = {}));

const handleImgLoadErr = (key, ev) => {
  switch (key) {
    case IMG_TYPE.ALBUM:
      ev.currentTarget.src = _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_3__/* .default.albumDefaultImg */ .ZP.albumDefaultImg;
  }
};
const formatSelfFavPlayListItem = item => {
  if (item !== null && item !== void 0 && item.isFormat) {
    return item;
  } else {
    return {
      id: item.tid,
      title: item.name,
      dirid: item.dirId,
      picurl: item.logo,
      creator: {
        nick: item.nickname,
        uin: item.uin
      },
      updatetime: item.updateTime,
      readtime: item.readtime,
      uin: (item === null || item === void 0 ? void 0 : item.uin) || '',
      isFormat: true
    };
  }
};
const formatSelfFavMvListItem = item => {
  if (item !== null && item !== void 0 && item.isFormat) {
    return item;
  } else {
    return { ...item,
      name: (item === null || item === void 0 ? void 0 : item.name) || (item === null || item === void 0 ? void 0 : item.mv_name) || '',
      singers: (item === null || item === void 0 ? void 0 : item.singer) || [],
      picurl: (item === null || item === void 0 ? void 0 : item.mv_picurl) || '',
      isFormat: true,
      playcnt: (item === null || item === void 0 ? void 0 : item.playcount) || 0
    };
  }
};

//# sourceURL=webpack://qqmusic/./src/client/modules/tools/index.ts?