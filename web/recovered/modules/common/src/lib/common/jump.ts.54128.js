/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "G": () => (/* binding */ PAGE_TYPE),
/* harmony export */   "Z": () => (/* binding */ jump)
/* harmony export */ });
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1642);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31603);
/* harmony import */ var stook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(49068);



let PAGE_TYPE;

(function (PAGE_TYPE) {
  PAGE_TYPE[PAGE_TYPE["SINGER"] = 0] = "SINGER";
  PAGE_TYPE[PAGE_TYPE["SONG"] = 1] = "SONG";
  PAGE_TYPE[PAGE_TYPE["PLAYLIST"] = 2] = "PLAYLIST";
  PAGE_TYPE[PAGE_TYPE["ALBUM"] = 3] = "ALBUM";
  PAGE_TYPE[PAGE_TYPE["TOPLIST"] = 4] = "TOPLIST";
  PAGE_TYPE[PAGE_TYPE["CATEGORY"] = 5] = "CATEGORY";
  PAGE_TYPE[PAGE_TYPE["ILIKE"] = 6] = "ILIKE";
  PAGE_TYPE[PAGE_TYPE["MUSICHALL"] = 7] = "MUSICHALL";
  PAGE_TYPE[PAGE_TYPE["VIDEO"] = 8] = "VIDEO";
  PAGE_TYPE[PAGE_TYPE["HISTORY"] = 9] = "HISTORY";
  PAGE_TYPE[PAGE_TYPE["PROFILE"] = 10] = "PROFILE";
  PAGE_TYPE[PAGE_TYPE["MUSICSTUDIO"] = 11] = "MUSICSTUDIO";
  PAGE_TYPE[PAGE_TYPE["SETTING"] = 12] = "SETTING";
  PAGE_TYPE[PAGE_TYPE["BATCH_OPERATION"] = 13] = "BATCH_OPERATION";
})(PAGE_TYPE || (PAGE_TYPE = {}));

function jump(type, opts) {
  if (type == PAGE_TYPE.SINGER) {
    if (!opts.mid) {
      console.warn('æå¼æ­æè¯¦æé¡µé¢ï¼ä½æ¯æ²¡æä¼ émidåæ°');
      return;
    }

    const url = `https://y.qq.com/wk_v17/#/singer_detail?singermid=${opts.mid}`;
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/singer_detail',
      search: _utils__WEBPACK_IMPORTED_MODULE_1__/* .default.paramToUrl */ .ZP.paramToUrl({
        url: encodeURIComponent(url)
      })
    });
  } else if (type == PAGE_TYPE.SONG) {
    (0,stook__WEBPACK_IMPORTED_MODULE_2__/* .mutate */ .JG)('IsCoverPlayerVisible', false); // console.log('opt', opts);

    if (!opts.id) {
      console.warn('æå¼æ­æ²è¯¦æé¡µé¢ï¼ä½æ¯æ²¡æä¼ éidåæ°');
      return;
    }

    const url = `https://y.qq.com/wk_v17/#/song_detail?id=${opts.id}&songtype=${opts.type || 0}`;
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/song_detail',
      search: _utils__WEBPACK_IMPORTED_MODULE_1__/* .default.paramToUrl */ .ZP.paramToUrl({
        url: encodeURIComponent(url)
      })
    });
  } else if (type == PAGE_TYPE.PLAYLIST) {
    if (!opts.id) {
      console.warn('打开歌单详情页面，但是没有传递id参数');
      return;
    }

    const selfCreatePlayList = (0,stook__WEBPACK_IMPORTED_MODULE_2__/* .getState */ .y0)('SelfCreatePlayList') || [];
    const selfFavPlayList = (0,stook__WEBPACK_IMPORTED_MODULE_2__/* .getState */ .y0)('SelfFavPlayList') || [];

    const _selfCreatePlayListIdx = Array.isArray(selfCreatePlayList)
      ? selfCreatePlayList.findIndex(item => String(item.tid) === String(opts.id) || String(item.dirid) === String(opts.id))
      : -1;

    if (_selfCreatePlayListIdx !== -1 && selfCreatePlayList[_selfCreatePlayListIdx]) {
      _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
        pathname: `/playlist_detail/${selfCreatePlayList[_selfCreatePlayListIdx].tid || opts.id}`
      });
      return;
    }

    const _selfFavPlayListIdx = Array.isArray(selfFavPlayList)
      ? selfFavPlayList.findIndex(item => String(item.tid) === String(opts.id) || String(item.dirid) === String(opts.id))
      : -1;

    if (_selfFavPlayListIdx !== -1 && selfFavPlayList[_selfFavPlayListIdx]) {
      _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
        pathname: `/playlist_detail/${selfFavPlayList[_selfFavPlayListIdx].tid || opts.id}`
      });
      return;
    }

    // 在线搜索、推荐等非自建歌单：直接导航至原生歌单详情路由
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: `/playlist_detail/${opts.id}`
    });
  } else if (type == PAGE_TYPE.ALBUM) {
    if (!opts.mid) {
      console.warn('æ‰“å¼€ä¸“è¾‘è¯¦æƒ…é¡µé ¢ï¼Œä½†æ˜¯æ²¡æœ‰ä¼ é€’midå ‚æ•°');
      return;
    }

    const url = `https://y.qq.com/wk_v17/#/album_detail?mid=${opts.mid}`;
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/album_detail',
      search: _utils__WEBPACK_IMPORTED_MODULE_1__/* .default.paramToUrl */ .ZP.paramToUrl({
        url: encodeURIComponent(url)
      })
    });
  } else if (type == PAGE_TYPE.TOPLIST) {
    if (!opts.id || opts.period) {
      console.warn('æå¼æè¡æ¦è¯¦æé¡µé¢ï¼ä½æ¯æ²¡æä¼ éidæperiodåæ°');
      return;
    }

    const url = `https://y.qq.com/wk_v17/#/toplist_detail?topid=${opts.id}&period=${opts.period}`;
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/toplist_detail',
      search: _utils__WEBPACK_IMPORTED_MODULE_1__/* .default.paramToUrl */ .ZP.paramToUrl({
        url: encodeURIComponent(url)
      })
    });
  } else if (type == PAGE_TYPE.CATEGORY) {
    if (!opts.id) {
      console.warn('æå¼åç±»è¯¦æé¡µé¢ï¼ä½æ¯æ²¡æä¼ éidåæ°');
      return;
    }

    const url = `https://y.qq.com/wk_v17/#/category_detail?category_id=${opts.id}`;
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/category_detail',
      search: _utils__WEBPACK_IMPORTED_MODULE_1__/* .default.paramToUrl */ .ZP.paramToUrl({
        url: encodeURIComponent(url)
      })
    });
  } else if (type == PAGE_TYPE.MUSICHALL) {
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/musicroom'
    });
  } else if (type == PAGE_TYPE.VIDEO) {
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/video'
    });
  } else if (type == PAGE_TYPE.ILIKE) {
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/like'
    });
  } else if (type == PAGE_TYPE.HISTORY) {
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/history'
    });
  } else if (type == PAGE_TYPE.PROFILE) {
    const url = `https://y.qq.com/wk_v17/#/profile?${opts.id ? `uin=${opts.id}` : ''}`;
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/profile',
      search: _utils__WEBPACK_IMPORTED_MODULE_1__/* .default.paramToUrl */ .ZP.paramToUrl({
        url: encodeURIComponent(url)
      })
    });
  } else if (type == PAGE_TYPE.MUSICSTUDIO) {
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: `/music_studio`,
      search: `index=${opts.index}`
    });
  } else if (type == PAGE_TYPE.SETTING) {
    // 设置页面已废弃移除
    return;
  } else if (type == PAGE_TYPE.BATCH_OPERATION) {
    _history__WEBPACK_IMPORTED_MODULE_0__/* .default.push */ .Z.push({
      pathname: '/batch_operation',
      search: _utils__WEBPACK_IMPORTED_MODULE_1__/* .default.paramToUrl */ .ZP.paramToUrl(opts.data)
    });
  } else {
    console.warn('æªç¥çè·³è½¬é¡µé¢');
  }
}

//# sourceURL=webpack://qqmusic/./src/lib/common/jump.ts?