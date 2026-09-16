/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mb": () => (/* binding */ switchLikeState),
/* harmony export */   "mP": () => (/* binding */ addSongListToPlayList),
/* harmony export */   "f$": () => (/* binding */ refreshSelfPlayList),
/* harmony export */   "zG": () => (/* binding */ deleteSelfPlayList),
/* harmony export */   "Vj": () => (/* binding */ getSongListDetailOfPlayList),
/* harmony export */   "sA": () => (/* binding */ getSongListInBatch),
/* harmony export */   "lk": () => (/* binding */ getMvListInBatch),
/* harmony export */   "VA": () => (/* binding */ deleteFavMv),
/* harmony export */   "dN": () => (/* binding */ deleteSelfFavPlayList),
/* harmony export */   "EK": () => (/* binding */ refreshFavPlayList),
/* harmony export */   "RT": () => (/* binding */ deleteSelfFavAlbumList),
/* harmony export */   "B3": () => (/* binding */ refreshFavAlbumList),
/* harmony export */   "dm": () => (/* binding */ getSearchPlayListSongs),
/* harmony export */   "PE": () => (/* binding */ updatePlayListFavStatus),
/* harmony export */   "QS": () => (/* binding */ changeOrderOfPlayList),
/* harmony export */   "As": () => (/* binding */ deleteSongsInPlayList)
/* harmony export */ });
/* unused harmony exports getPlayListContent, getSongInfo */
/* harmony import */ var _lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(65972);
/* harmony import */ var _lib_network__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32590);
/* harmony import */ var _lib_common_popup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43053);
/* harmony import */ var stook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(49068);
/* harmony import */ var _lib_common_login__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(68010);
/* harmony import */ var _src_lib_common_service_dispatch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(24684);
/* harmony import */ var _src_lib_network_search_api__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(940);
/* harmony import */ var _src_client_modules_tools_common_action__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(53554);
/* harmony import */ var _src_lib_common_jump__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(54128);
/* harmony import */ var _src_lib_common_history__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(1642);











/**
 * 切换某首歌曲的喜欢状态
 * 这里涉及的地方主要为所有包含该歌曲的歌单，我喜欢，播放列表，播放器等
 * 考虑到涉及较多页面，因此只对即时显示在页面上的内容进行状态修改，即调用该函数
 * 页面、播放器页面、播放列表，对其他歌单页面，则采用进入重新刷新的方式更新
 * 另外还要通知webview进行喜欢状态切换
 * @param song
 * @param showDialog
 */
const switchLikeState = async (song, showDialog = true) => {
  const currentSong = { ...song
  };
  const actionFunc = currentSong.like ? _lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .unlikeSong */ .Jd : _lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .likeSong */ .Du;
  const popupText = currentSong.like ? '删除成功' : '添加成功';
  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    switchSongLikeStateRes: actionFunc({
      v_songInfo: [{
        songId: currentSong.id
      }]
    })
  });

  if (res.code === 0 && res.switchSongLikeStateRes && res.switchSongLikeStateRes.code === 0) {
    showDialog && _lib_common_popup__WEBPACK_IMPORTED_MODULE_2__/* .default.show */ .Z.show(1, popupText);
    await _updateLikeSongList([currentSong], {
      force: true,
      isLike: !currentSong.like
    });
    (0,_src_lib_common_service_dispatch__WEBPACK_IMPORTED_MODULE_5__/* .changeILikeStatus */ .tj)(currentSong, currentSong.like ? 0 : 1);
    return true;
  }

  return false;
};

const _updateLikeSongList = async (songListToUpdate, forceData = {
  force: false,
  isLike: false
}) => {
  const favoriteSingleSongs = (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .getState */ .y0)('FavoriteSingleSongs') || [];
  const collectSingleSongs = (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .getState */ .y0)('CollectSingleSongs') || [];
  const playingInfo = (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .getState */ .y0)('PlayingStore');
  const {
    songList = []
  } = playingInfo;

  let _collectSingleSongs = collectSingleSongs.slice();

  const _songList = songList.slice();

  const _favSingleSongs = [];
  const songIdList = [];
  songListToUpdate.forEach(_song => {
    _favSingleSongs.push({
      songId: _song.id,
      songType: _song.songType
    });

    const collectSongIdx = collectSingleSongs === null || collectSingleSongs === void 0 ? void 0 : collectSingleSongs.findIndex(item => (item === null || item === void 0 ? void 0 : item.id) === (_song === null || _song === void 0 ? void 0 : _song.id) && (item === null || item === void 0 ? void 0 : item.songType) === (_song === null || _song === void 0 ? void 0 : _song.songType));
    const songListIdx = _songList === null || _songList === void 0 ? void 0 : _songList.findIndex(item => (item === null || item === void 0 ? void 0 : item.id) === (_song === null || _song === void 0 ? void 0 : _song.id) && (item === null || item === void 0 ? void 0 : item.id) === (_song === null || _song === void 0 ? void 0 : _song.id));

    if (_song.like && collectSongIdx !== -1) {
      _collectSingleSongs = collectSingleSongs.filter((_, idx) => idx !== collectSongIdx);
    } else if (!_song.like) {
      songIdList.push(_song.id);
    }

    if (songListIdx !== -1) {
      _songList[songListIdx].like = !_song.like;
    }
  });

  if (songIdList.length > 0) {
    const listInfo = (0,_src_client_modules_tools_common_action__WEBPACK_IMPORTED_MODULE_7__/* .formatSongsAndMarkLike */ .L)(await Promise.all(songIdList.map(async id => getSongInfo(id))), forceData);
    _collectSingleSongs = [...listInfo, ..._collectSingleSongs];
  }

  (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('CollectSingleSongs', _collectSingleSongs);
  (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('PlayingStore', { ...playingInfo,
    songList: _songList
  });
  (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('PlayListDetailStore', new Map()); // 批量变更，是相同的，看第一个就行

  if (_favSingleSongs.length > 0) {
    var _songListToUpdate$;

    if ((_songListToUpdate$ = songListToUpdate[0]) !== null && _songListToUpdate$ !== void 0 && _songListToUpdate$.like) {
      (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('FavoriteSingleSongs', favoriteSingleSongs.filter(item => !_favSingleSongs.some(_ => (_ === null || _ === void 0 ? void 0 : _.songId) === (item === null || item === void 0 ? void 0 : item.songId) && (_ === null || _ === void 0 ? void 0 : _.songType) === (item === null || item === void 0 ? void 0 : item.songType))));
    } else {
      (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('FavoriteSingleSongs', [..._favSingleSongs, ...favoriteSingleSongs]);
    }
  }
};

/**
 * 批量的把某些歌曲添加到某歌单中
 * @param params
 */
const addSongListToPlayList = async params => {
  if (!_lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.isLogin */ .Z.isLogin()) {
    _lib_common_popup__WEBPACK_IMPORTED_MODULE_2__/* .default.show */ .Z.show(0, '请先登录！');
    return;
  }

  const _songList = (params === null || params === void 0 ? void 0 : params.songList.map(item => {
    return {
      songType: item.type,
      songId: item.id
    };
  })) || [];

  const _params = { ...params,
    songList: _songList
  };

  if ((params === null || params === void 0 ? void 0 : params.listId) === -1) {
    await _createNewPlayListAndAddSongs(_params);
  } else {
    await _addSongsToPlayList(_params);
  }
};

const _createNewPlayListAndAddSongs = async params => {
  (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    createNewPlayList: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .createNewPlayList */ .iA)({
      dirName: params === null || params === void 0 ? void 0 : params.playListName
    })
  }).then(res => {
    if (res.code === 0 && res.createNewPlayList && res.createNewPlayList.code === 0 && res.createNewPlayList.data) {
      var _res$createNewPlayLis;

      const dirId = (_res$createNewPlayLis = res.createNewPlayList.data.result) === null || _res$createNewPlayLis === void 0 ? void 0 : _res$createNewPlayLis.dirId;

      _addSongsToPlayList({
        listId: dirId,
        songList: (params === null || params === void 0 ? void 0 : params.songList) || []
      }).then(() => {
        refreshSelfPlayList();
      });
    } else if (res.code === 0 && res.createNewPlayList.code === 1000) {
      _lib_common_popup__WEBPACK_IMPORTED_MODULE_2__/* .default.show */ .Z.show(0, '请重新登录');
      _lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.reset */ .Z.reset();
      _lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.loginMiniportal */ .Z.loginMiniportal();
    } else {
      _lib_common_popup__WEBPACK_IMPORTED_MODULE_2__/* .default.show */ .Z.show(0, '添加失败，请检查网络后后再试~');
    }
  }).catch(() => {
    _lib_common_popup__WEBPACK_IMPORTED_MODULE_2__/* .default.show */ .Z.show(0, '添加到歌单失败！');
  });
};
/**
 * 添加歌曲到歌单
 * @param params
 */


const _addSongsToPlayList = async params => {
  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    addSongsToPlayList: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .addSongsToPlayList */ .jd)({
      dirId: params === null || params === void 0 ? void 0 : params.listId,
      v_songInfo: params === null || params === void 0 ? void 0 : params.songList
    })
  });

  if (res.code === 0 && res.addSongsToPlayList && res.addSongsToPlayList.code === 0 && res.addSongsToPlayList.data) {
    _lib_common_popup__WEBPACK_IMPORTED_MODULE_2__/* .default.show */ .Z.show(1, '添加到歌单成功！');

    if ((params === null || params === void 0 ? void 0 : params.listId) === 201) {
      _updateLikeSongList(params.songList.map(_song => {
        return {
          id: _song.songId,
          songType: _song.songType
        };
      }), {
        force: true,
        isLike: true
      });
    }
  } else if (res.code === 0 && res.addSongsToPlayList.code === 1000) {
    _lib_common_popup__WEBPACK_IMPORTED_MODULE_2__/* .default.show */ .Z.show(0, '请重新登录');
    _lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.reset */ .Z.reset();
    _lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.loginMiniportal */ .Z.loginMiniportal();
  } else if ((params === null || params === void 0 ? void 0 : params.songList.length) > 0) {
    _lib_common_popup__WEBPACK_IMPORTED_MODULE_2__/* .default.show */ .Z.show(0, '添加失败，请检查网络后后再试~');
  }
};
/**
 * 更新自建歌单
 */


const refreshSelfPlayList = async () => {
  const uin = `${_lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.musicId */ .Z.musicId}`;
  const req = {
    getSelfCreatePLayList: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .getCreatePlayList */ .xu)({
      uin
    }),
    getPlaylistFavInfo: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .getPlaylistFavInfo */ .$H)({
      uin
    }),
    getFavSongList: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .getFavSongList */ .in)({
      uin
    })
  };
  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)(req);

  if (res.code === 0) {
    if (res.getSelfCreatePLayList && res.getSelfCreatePLayList.code === 0 && res.getSelfCreatePLayList.data) {
      (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('SelfCreatePlayList', res.getSelfCreatePLayList.data.v_playlist);
    }

    if (res.getPlaylistFavInfo && res.getPlaylistFavInfo.code === 0 && res.getPlaylistFavInfo.data) {
      (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('SelfFavPlayList', res.getPlaylistFavInfo.data.v_list.map(item => {
        return { ...item,
          dirName: item.dirId === 201 ? '我喜欢' : item.name
        };
      }));
    }

    if (res.getFavSongList && res.getFavSongList.code === 0 && res.getFavSongList.data) {
      (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('FavoriteSingleSongs', res.getFavSongList.data.songlist.v_songinfo);
    }
  }
};
/**
 * 删除了歌单，需要跳转到新歌单对应的路由
 * @param playListItem
 * @param idx
 */

const deleteSelfPlayList = async (playListItem, idx) => {
  if (playListItem !== null && playListItem !== void 0 && playListItem.dirId) {
    const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
      deletePlayList: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .deletePlayList */ .jV)({
        dirId: playListItem.dirId
      })
    });

    if (res && res.code === 0 && res.deletePlayList && res.deletePlayList.code === 0 && res.deletePlayList.data.retCode === 0) {
      let tid;
      let queryParams = '';

      if (_src_lib_common_history__WEBPACK_IMPORTED_MODULE_9__/* .default.location.pathname.split */ .Z.location.pathname.split('/').some(item => item === `${playListItem.tid}`)) {
        const selfCreatePlayList = (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .getState */ .y0)('SelfCreatePlayList');
        const selfFavPlayList = (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .getState */ .y0)('SelfFavPlayList');

        if (idx <= 3) {
          tid = selfCreatePlayList[2].tid;
          queryParams = 'create=1';
        } else if (idx > 3 && idx < selfCreatePlayList.length) {
          tid = selfCreatePlayList[idx - 1].tid;
          queryParams = 'create=1';
        } else if (idx < selfFavPlayList.length) {
          queryParams = 'create=0';
          tid = selfFavPlayList[idx - 1].tid;
        }
      }

      refreshSelfPlayList().then(() => {
        if (tid) {
          _src_lib_common_history__WEBPACK_IMPORTED_MODULE_9__/* .default.push */ .Z.push({
            pathname: `/playlist_detail/${tid}`,
            search: queryParams
          });
        } else {
          (0,_src_lib_common_jump__WEBPACK_IMPORTED_MODULE_8__/* .default */ .Z)(_src_lib_common_jump__WEBPACK_IMPORTED_MODULE_8__/* .PAGE_TYPE.MUSICHALL */ .G.MUSICHALL);
        }
      });
    }
  }
};
/**
 * 分页默认200
 * @param dirid
 * @param uin
 * @param offset
 * @param pageSize
 */

const getPlayListContent = async (dirid, uin, offset, pageSize) => {
  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    getSongListByDirIdAndUin: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .getCollectSongList */ .ng)({
      uin,
      dirid,
      bPaged: true,
      offset,
      size: pageSize
    })
  });

  if (res.code === 0 && res.getSongListByDirIdAndUin && res.getSongListByDirIdAndUin.code === 0 && res.getSongListByDirIdAndUin.data) {
    const {
      list = [],
      hasmore = false,
      total = 0
    } = res.getSongListByDirIdAndUin.data;
    return {
      list,
      hasMore: hasmore,
      total
    };
  }
};
/**
 * @param tid
 */

const getSongListDetailOfPlayList = async tid => {
  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    getSongListByDirIdAndUin: (0,_src_lib_network_search_api__WEBPACK_IMPORTED_MODULE_6__/* .getSearchPlayListSongInfo */ .ek)({
      userinfo: 1,
      tag: 1,
      disstid: tid
    })
  });

  if (res.code === 0 && res.getSongListByDirIdAndUin && res.getSongListByDirIdAndUin.code === 0 && res.getSongListByDirIdAndUin.data) {
    var _res$getSongListByDir;

    return (0,_src_client_modules_tools_common_action__WEBPACK_IMPORTED_MODULE_7__/* .formatSongsAndMarkLike */ .L)(((_res$getSongListByDir = res.getSongListByDirIdAndUin.data) === null || _res$getSongListByDir === void 0 ? void 0 : _res$getSongListByDir.songlist) || []);
  }
}; // export const getSongListDetailGraphQL = async (): Promise<any> => {
//     const res = await ufetch({
//         getSongListByDirIdAndUin: {
//             method:"graphQL",
//             module:"music.dissGraphQL.aiDissInfo",
//             param: {
//                 statement: `
//                 {diss
//                     (id:4522472313)
//                     {
//                         code,
//                         msg,
//                         songlist
//                         {
//                             id,
//                             name,
//                             mv {
//                                 id,
//                                 vid
//                             },
//                             file {
//                                 media_mid
//                             }
//                         }
//                     }
//                 }
//                 `
//             }
//         }
//     });
//     console.log(JSON.parse(res.getSongListByDirIdAndUin.data.Result));
// };

const getSongListInBatch = async (dirid, uin, total, offset, pageSize, resArr) => {
  // 如果拉过数据，并且还有更多，初始偏移量就是当前PAGE_SIZE
  if (resArr.length >= total) {
    return resArr;
  }

  const res = await getPlayListContent(dirid, uin, offset, pageSize);

  if (res !== null && res !== void 0 && res.hasMore) {
    return resArr.concat((await getSongListInBatch(dirid, uin, total, offset + ((res === null || res === void 0 ? void 0 : res.list) || []).length, pageSize, resArr)) || []);
  }

  return resArr.concat((res === null || res === void 0 ? void 0 : res.list) || []);
};

const getMvList = async (uin, num, pagesize) => {
  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    getMyFavMV: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .getMyFavMV */ .kk)({
      uin,
      support: 0,
      num,
      pagesize
    })
  });

  if (res.code === 0 && res.getMyFavMV && res.getMyFavMV.code === 0 && res.getMyFavMV.data) {
    const {
      mvlist,
      hasmore = false,
      total = 0
    } = res.getMyFavMV.data;
    return {
      list: mvlist,
      hasMore: hasmore,
      total
    };
  }
};
/**
 * 分批获取mv
 * @param uin
 * @param total
 * @param offset
 * @param pageSize
 * @param resArr
 */


const getMvListInBatch = async (uin, total, offset, pageSize, resArr) => {
  // 如果拉过数据，并且还有更多，初始偏移量就是当前PAGE_SIZE
  if (resArr.length >= total) {
    return resArr;
  }

  const res = await getMvList(`${uin}`, Math.floor(offset / pageSize) + 1, pageSize);

  if (res !== null && res !== void 0 && res.hasMore) {
    return resArr.concat((await getMvListInBatch(uin, total, offset + ((res === null || res === void 0 ? void 0 : res.list) || []).length, pageSize, resArr)) || []);
  }

  return resArr.concat((res === null || res === void 0 ? void 0 : res.list) || []);
};
/**
 * 删除MV
 * @param mvidlist
 * @param uin
 */

const deleteFavMv = async (mvidlist, uin) => {
  var _res$deleteFavMv, _res$deleteFavMv2;

  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    deleteFavMv: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .updateFavMv */ .rD)({
      uin,
      mvidlist: mvidlist.join(','),
      cmdtype: 1,
      mvidtype: 0,
      reqtype: 1,
      OpenUDID: '',
      OpenUDID2: '',
      wid: ''
    })
  });

  if (res.code === 0 && res !== null && res !== void 0 && res.deleteFavMv && ((_res$deleteFavMv = res.deleteFavMv) === null || _res$deleteFavMv === void 0 ? void 0 : _res$deleteFavMv.code) === 0 && (_res$deleteFavMv2 = res.deleteFavMv) !== null && _res$deleteFavMv2 !== void 0 && _res$deleteFavMv2.data) {
    setTimeout(() => {
      const prevFavMvList = (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .getState */ .y0)('SelfFavMvList') || [];
      const idSet = new Set(mvidlist);
      (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('SelfFavMvList', prevFavMvList.filter(item => !idSet.has(item === null || item === void 0 ? void 0 : item.vid)));
    }, 15);
    return true;
  }
};
/**
 * 取消收藏歌单 批量
 * @param idList
 */

const deleteSelfFavPlayList = async idList => {
  var _res$deleteFavPlayLis;

  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    deleteFavPlayList: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .deleteFavPlayList */ .AH)({
      v_playlistId: idList
    }),
    comm: {
      uin: `${_lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.musicId */ .Z.musicId}`
    }
  });

  if ((res === null || res === void 0 ? void 0 : res.code) === 0 && (res === null || res === void 0 ? void 0 : (_res$deleteFavPlayLis = res.deleteFavPlayList) === null || _res$deleteFavPlayLis === void 0 ? void 0 : _res$deleteFavPlayLis.code) === 0) {
    var _res$deleteFavPlayLis2, _res$deleteFavPlayLis3;

    // 全部处理成功
    if ((res === null || res === void 0 ? void 0 : (_res$deleteFavPlayLis2 = res.deleteFavPlayList) === null || _res$deleteFavPlayLis2 === void 0 ? void 0 : (_res$deleteFavPlayLis3 = _res$deleteFavPlayLis2.data) === null || _res$deleteFavPlayLis3 === void 0 ? void 0 : _res$deleteFavPlayLis3.result) === 0) {
      return idList;
    } else {
      const failedSet = new Set(res.deleteFavPlayList.data.v_failedPlaylistId);
      return idList.filter(_ => !failedSet.has(_));
    }
  }
};
/**
 * 刷新收藏的歌单
 */

const refreshFavPlayList = () => {
  const uin = `${_lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.musicId */ .Z.musicId}`;
  if (!uin) return;
  const req = {
    getPlaylistFavInfo: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .getPlaylistFavInfo */ .$H)({
      uin
    })
  };
  (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)(req).then(res => {
    if (res.code === 0) {
      if (res.getPlaylistFavInfo && res.getPlaylistFavInfo.code === 0 && res.getPlaylistFavInfo.data) {
        (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('SelfFavPlayList', res.getPlaylistFavInfo.data.v_list.map(item => {
          return { ...item,
            dirName: item.dirId === 201 ? '我喜欢' : item.name
          };
        }).filter(item => item === null || item === void 0 ? void 0 : item.dirId));
      }
    }
  });
};
/**
 * 取消收藏专辑 批量
 * @param midList
 * @param uin
 */

const deleteSelfFavAlbumList = async (midList, uin) => {
  var _res$cancelFavAlbum, _res$cancelFavAlbum2;

  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    cancelFavAlbum: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .cancelFavAlbum */ .xT)({
      uin,
      v_albumMid: midList
    })
  });

  if ((res === null || res === void 0 ? void 0 : res.code) === 0 && (res === null || res === void 0 ? void 0 : (_res$cancelFavAlbum = res.cancelFavAlbum) === null || _res$cancelFavAlbum === void 0 ? void 0 : _res$cancelFavAlbum.code) === 0 && res !== null && res !== void 0 && (_res$cancelFavAlbum2 = res.cancelFavAlbum) !== null && _res$cancelFavAlbum2 !== void 0 && _res$cancelFavAlbum2.data) {
    var _res$cancelFavAlbum3, _res$cancelFavAlbum3$;

    // 全部处理成功
    if ((res === null || res === void 0 ? void 0 : (_res$cancelFavAlbum3 = res.cancelFavAlbum) === null || _res$cancelFavAlbum3 === void 0 ? void 0 : (_res$cancelFavAlbum3$ = _res$cancelFavAlbum3.data) === null || _res$cancelFavAlbum3$ === void 0 ? void 0 : _res$cancelFavAlbum3$.result) === 0) {
      return midList;
    } else {
      const failedSet = new Set(res.cancelFavAlbum.data.v_failedAlbumMid);
      return midList.filter(_ => !failedSet.has(_));
    }
  }
};
/**
 * 刷新收藏的专辑
 * @param midList
 * @param add
 */

const refreshFavAlbumList = (midList, add) => {
  if (add) {
    (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
      getCollectAlbumList: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .getCollectAlbumList */ .Ee)({
        uin: `${_lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.musicId */ .Z.musicId}`
      })
    }).then(res => {
      var _res$getCollectAlbumL, _res$getCollectAlbumL2, _res$getCollectAlbumL3;

      if (((_res$getCollectAlbumL = res.getCollectAlbumList) === null || _res$getCollectAlbumL === void 0 ? void 0 : _res$getCollectAlbumL.code) === 0 && res !== null && res !== void 0 && (_res$getCollectAlbumL2 = res.getCollectAlbumList) !== null && _res$getCollectAlbumL2 !== void 0 && (_res$getCollectAlbumL3 = _res$getCollectAlbumL2.data) !== null && _res$getCollectAlbumL3 !== void 0 && _res$getCollectAlbumL3.v_list) {
        (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('collectAlbumList', res === null || res === void 0 ? void 0 : res.getCollectAlbumList.data.v_list.map(item => {
          return { ...item,
            subtitle: (item.v_singer || []).map(singer => singer.name).join('&') || ''
          };
        }));
      }
    });
  } else {
    const _set = new Set(midList);

    const selfFavAlbumList = (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .getState */ .y0)('collectAlbumList');
    (0,stook__WEBPACK_IMPORTED_MODULE_3__/* .mutate */ .JG)('collectAlbumList', selfFavAlbumList.filter(item => !_set.has(item === null || item === void 0 ? void 0 : item.mid)));
  }
};
const getSearchPlayListSongs = async dissid => {
  const numDissId = typeof dissid === 'number' ? dissid : parseInt(dissid, 10);
  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    getSearchPlayListSongs: (0,_src_lib_network_search_api__WEBPACK_IMPORTED_MODULE_6__/* .getSearchPlayListSongInfo */ .ek)({
      disstid: numDissId,
      userinfo: 1,
      tag: 1
    })
  });

  if (res.code === 0 && res.getSearchPlayListSongs && res.getSearchPlayListSongs.code === 0 && res.getSearchPlayListSongs.data) {
    return (0,_src_client_modules_tools_common_action__WEBPACK_IMPORTED_MODULE_7__/* .formatSongsAndMarkLike */ .L)(res.getSearchPlayListSongs.data.songlist);
  }
};
const getSongInfo = async songId => {
  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    getSongDetail: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .getSongDetail */ .KJ)({
      song_id: songId
    })
  });

  if (res.code === 0 && res.getSongDetail && res.getSongDetail.code === 0 && res.getSongDetail.data) {
    return res.getSongDetail.data.track_info;
  }
};
/**
 * 切换歌单的收藏状态
 * @param tid
 * @param isCollect
 */

const updatePlayListFavStatus = async (tid, isCollect) => {
  const actionCGI = isCollect ? _lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .deleteFavPlayList */ .AH : _lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .addFavPlayList */ .lR;
  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    updatePlayListFavStatus: actionCGI({
      uin: `${_lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.getUin */ .Z.getUin()}`,
      v_playlistId: [tid]
    })
  });
  return !!(res.code === 0 && res.updatePlayListFavStatus && res.updatePlayListFavStatus.code === 0 && res.updatePlayListFavStatus.data);
};
/**
 * 改变歌单中的歌曲顺序
 * @param dirId
 * @param songItemList
 */

const changeOrderOfPlayList = async (dirId, songItemList) => {
  var _res$seqPlayList, _res$seqPlayList2;

  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    seqPlayList: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .seqSongList */ .LH)({
      dirId,
      v_songPair: songItemList
    })
  });
  return !!(res.code === 0 && (res === null || res === void 0 ? void 0 : (_res$seqPlayList = res.seqPlayList) === null || _res$seqPlayList === void 0 ? void 0 : _res$seqPlayList.code) === 0 && ((_res$seqPlayList2 = res.seqPlayList) === null || _res$seqPlayList2 === void 0 ? void 0 : _res$seqPlayList2.data.retCode) === 0);
};
/**
 * 改变歌单中的歌曲顺序
 * @param dirId
 * @param songItemList
 */

const deleteSongsInPlayList = async (dirId, songItemList) => {
  var _res$deleteSongsInPla, _res$deleteSongsInPla2;

  const res = await (0,_lib_network__WEBPACK_IMPORTED_MODULE_1__/* .ufetch */ .D)({
    deleteSongsInPlayList: (0,_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_0__/* .deleteSongsFromPlayList */ .Wi)({
      dirId,
      v_songInfo: songItemList
    })
  });
  return !!(res.code === 0 && (res === null || res === void 0 ? void 0 : (_res$deleteSongsInPla = res.deleteSongsInPlayList) === null || _res$deleteSongsInPla === void 0 ? void 0 : _res$deleteSongsInPla.code) === 0 && ((_res$deleteSongsInPla2 = res.deleteSongsInPlayList) === null || _res$deleteSongsInPla2 === void 0 ? void 0 : _res$deleteSongsInPla2.data.retCode) === 0);
};

//# sourceURL=webpack://qqmusic/./src/hooks/assets.ts?