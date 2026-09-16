// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "I": () => (/* binding */ usePlayListInfo)
});

// EXTERNAL MODULE: ./src/lib/network/index.ts + 1 modules
var network = __webpack_require__(32590);
// EXTERNAL MODULE: ./src/lib/network/search_api.ts
var search_api = __webpack_require__(940);
// EXTERNAL MODULE: ./src/client/modules/tools/common_action.ts
var common_action = __webpack_require__(53554);
// EXTERNAL MODULE: ./src/lib/common/utils.ts
var utils = __webpack_require__(31603);
// EXTERNAL MODULE: ./src/lib/network/asset_api.ts
var asset_api = __webpack_require__(65972);
;// CONCATENATED MODULE: ./src/component/play_list_detail/action.ts





const getPlayListDetail = async (req, isSelfCreate = false) => {
  var _res$getPlayListDetai, _res$getPlayListDetai2, _res$checkPlaylistIsC, _res$checkPlaylistIsC2;

  const {
    dirid = null,
    dissid = null
  } = req;
  const numDissId = typeof dissid === 'number' ? dissid : parseInt(dissid, 10);
  const res = await (0,network/* ufetch */.D)({
    getPlayListDetail: (0,search_api/* getSearchPlayListSongInfo */.ek)({
      disstid: numDissId,
      userinfo: 1,
      tag: 1,
      dirid
    }),
    checkPlaylistIsCollect: (0,asset_api/* checkPlaylistIsCollect */.nY)({
      v_tid: [dissid]
    })
  });
  let resObj = {
    songlist: [],
    detailContent: null
  };

  if (res.code === 0 && ((_res$getPlayListDetai = res.getPlayListDetail) === null || _res$getPlayListDetai === void 0 ? void 0 : _res$getPlayListDetai.code) === 0 && (_res$getPlayListDetai2 = res.getPlayListDetail) !== null && _res$getPlayListDetai2 !== void 0 && _res$getPlayListDetai2.data) {
    var _res$getPlayListDetai3, _data$dirinfo, _data$dirinfo2, _data$dirinfo3, _data$dirinfo4, _data$dirinfo5, _data$dirinfo6, _data$dirinfo7, _data$dirinfo8, _data$dirinfo9, _data$dirinfo10, _data$dirinfo11, _data$dirinfo11$tag;

    const data = (_res$getPlayListDetai3 = res.getPlayListDetail) === null || _res$getPlayListDetai3 === void 0 ? void 0 : _res$getPlayListDetai3.data;
    resObj = {
      songlist: (0,common_action/* formatSongsAndMarkLike */.L)(data.songlist),
      detailContent: {
        img: utils/* default.fixUrl */.ZP.fixUrl((data === null || data === void 0 ? void 0 : (_data$dirinfo = data.dirinfo) === null || _data$dirinfo === void 0 ? void 0 : _data$dirinfo.picurl) || ''),
        name: (data === null || data === void 0 ? void 0 : (_data$dirinfo2 = data.dirinfo) === null || _data$dirinfo2 === void 0 ? void 0 : _data$dirinfo2.title) || '',
        user: {
          img: (data === null || data === void 0 ? void 0 : (_data$dirinfo3 = data.dirinfo) === null || _data$dirinfo3 === void 0 ? void 0 : _data$dirinfo3.headurl) || '',
          link: `/profile?uin=${(data === null || data === void 0 ? void 0 : (_data$dirinfo4 = data.dirinfo) === null || _data$dirinfo4 === void 0 ? void 0 : _data$dirinfo4.encrypt_uin) || ''}`,
          encryptUin: data === null || data === void 0 ? void 0 : (_data$dirinfo5 = data.dirinfo) === null || _data$dirinfo5 === void 0 ? void 0 : _data$dirinfo5.encrypt_uin,
          name: data === null || data === void 0 ? void 0 : (_data$dirinfo6 = data.dirinfo) === null || _data$dirinfo6 === void 0 ? void 0 : _data$dirinfo6.host_nick
        },
        disstype: (data === null || data === void 0 ? void 0 : (_data$dirinfo7 = data.dirinfo) === null || _data$dirinfo7 === void 0 ? void 0 : _data$dirinfo7.disstype) || 0,
        dirid: (data === null || data === void 0 ? void 0 : (_data$dirinfo8 = data.dirinfo) === null || _data$dirinfo8 === void 0 ? void 0 : _data$dirinfo8.dirid) || 0,
        desc: (data === null || data === void 0 ? void 0 : (_data$dirinfo9 = data.dirinfo) === null || _data$dirinfo9 === void 0 ? void 0 : _data$dirinfo9.desc) || '',
        id: data === null || data === void 0 ? void 0 : (_data$dirinfo10 = data.dirinfo) === null || _data$dirinfo10 === void 0 ? void 0 : _data$dirinfo10.id,
        dissid,
        tag: data === null || data === void 0 ? void 0 : (_data$dirinfo11 = data.dirinfo) === null || _data$dirinfo11 === void 0 ? void 0 : (_data$dirinfo11$tag = _data$dirinfo11.tag) === null || _data$dirinfo11$tag === void 0 ? void 0 : _data$dirinfo11$tag.map(item => item.name),
        total_song_num: (data === null || data === void 0 ? void 0 : data.total_song_num) || data.songlist.length || 0,
        isCollect: false,
        isSelfCreate
      }
    };
  }

  if (res.code === 0 && ((_res$checkPlaylistIsC = res.checkPlaylistIsCollect) === null || _res$checkPlaylistIsC === void 0 ? void 0 : _res$checkPlaylistIsC.code) === 0 && (_res$checkPlaylistIsC2 = res.checkPlaylistIsCollect) !== null && _res$checkPlaylistIsC2 !== void 0 && _res$checkPlaylistIsC2.data) {
    var _res$checkPlaylistIsC3, _res$checkPlaylistIsC4;

    resObj.detailContent = { ...resObj.detailContent,
      isCollect: ((_res$checkPlaylistIsC3 = res.checkPlaylistIsCollect) === null || _res$checkPlaylistIsC3 === void 0 ? void 0 : (_res$checkPlaylistIsC4 = _res$checkPlaylistIsC3.data) === null || _res$checkPlaylistIsC4 === void 0 ? void 0 : _res$checkPlaylistIsC4.m_fan[dissid]) || false
    };
  }

  return resObj;
};
const checkPlaylistCollect = async tid => {
  var _res$checkPlaylistIsC5, _res$checkPlaylistIsC6;

  const res = await ufetch({
    checkPlaylistIsCollect: checkPlaylistIsCollect({
      v_tid: [tid]
    })
  });

  if (res.code === 0 && ((_res$checkPlaylistIsC5 = res.checkPlaylistIsCollect) === null || _res$checkPlaylistIsC5 === void 0 ? void 0 : _res$checkPlaylistIsC5.code) === 0 && (_res$checkPlaylistIsC6 = res.checkPlaylistIsCollect) !== null && _res$checkPlaylistIsC6 !== void 0 && _res$checkPlaylistIsC6.data) {
    var _res$checkPlaylistIsC7;

    const data = (_res$checkPlaylistIsC7 = res.checkPlaylistIsCollect) === null || _res$checkPlaylistIsC7 === void 0 ? void 0 : _res$checkPlaylistIsC7.data;
    return (data === null || data === void 0 ? void 0 : data.m_fan[tid]) || false;
  }
};
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
// EXTERNAL MODULE: ./node_modules/stook/dist/stook.esm.js + 2 modules
var stook_esm = __webpack_require__(49068);
// EXTERNAL MODULE: ./src/hooks/assets.ts
var assets = __webpack_require__(67891);
// EXTERNAL MODULE: ./node_modules/array-move/index.js
var array_move = __webpack_require__(80454);
var array_move_default = /*#__PURE__*/__webpack_require__.n(array_move);
// EXTERNAL MODULE: ./src/lib/common/popup.tsx
var popup = __webpack_require__(43053);
// EXTERNAL MODULE: ./src/client/index.tsx
var client = __webpack_require__(21209);
;// CONCATENATED MODULE: ./src/hooks/playlist.ts







const usePlayListInfo = playListBaseInfo => {
  const {
    dissId,
    isSelfCreate
  } = playListBaseInfo;
  let _isLoading = false;
  const [isLoading, setIsLoading] = (0,react.useState)(false);
  const [playListCache, setPlayListCache] = (0,stook_esm/* useStore */.oR)('PlayListDetailStore', new Map());
  const [currentPlayListInfo, setCurrentPlayListInfo] = (0,react.useState)({
    detailContent: null,
    songlist: []
  });

  const getData = async (needLoading = false, force = false) => {
    if (_isLoading) return;

    if (dissId === 'recent') {
      try {
        const _KEY = '__qqmusic_recent_play__';
        let _local = [];
        try { _local = JSON.parse(localStorage.getItem(_KEY) || '[]'); } catch(e) {}
        const common_action = __webpack_require__(53554);
        const formatFn = common_action.L || common_action.formatSongsAndMarkLike;
        const songlist = formatFn ? formatFn(_local) : _local;

        let userNick = '我的音乐';
        let userAvatar = '//y.gtimg.cn/mediastyle/global/img/person_300.png';
        let loginUin = '';
        try {
          const cached = JSON.parse(localStorage.getItem('__qqmusic_user_profile__') || '{}');
          if (cached.name) userNick = cached.name;
          if (cached.img) userAvatar = cached.img;
          if (cached.uin) loginUin = cached.uin;
        } catch(e) {}

        try {
          const loginMod = __webpack_require__(68010).Z || __webpack_require__(68010).default;
          if (loginMod && loginMod.musicId) {
            loginUin = String(loginMod.musicId);
            if (!userAvatar || userAvatar.indexOf('person_300') !== -1) {
              userAvatar = 'https://thirdqq.qlogo.cn/g?b=qq&nk=' + loginUin + '&s=100';
            }
          }
        } catch(e) {}

        let coverUrl = 'https://y.qq.com/mediastyle/global/img/cover_playlist.png';
        if (songlist.length > 0) {
          const s0 = songlist[0];
          const p = (s0.album && (s0.album.pic || s0.album.picurl)) || s0.pic || s0.picurl;
          if (p) coverUrl = p;
          else if (s0.album && s0.album.mid) {
            coverUrl = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + s0.album.mid + '.jpg';
          }
        }

        const recentData = {
          detailContent: {
            dissid: 'recent',
            name: '最近播放',
            img: coverUrl,
            user: {
              img: userAvatar,
              name: userNick,
              encryptUin: loginUin
            },
            desc: '记录在本地最近播放的音乐轨迹…',
            total_song_num: songlist.length,
            tag: ['最近播放', '听歌历史'],
            isSelfCreate: true,
            isCollect: false,
            disstype: 1
          },
          songlist: songlist
        };
        setCurrentPlayListInfo(recentData);
        updatePlayListCache(recentData);

        if (loginUin && (!userNick || userNick === '我的音乐')) {
          try {
            const network = __webpack_require__(18446);
            const api = __webpack_require__(39124);
            const ufetchFn = network.D || network.ufetch;
            const getBaseFn = api.Gr || api.getUserBaseInfo;
            if (ufetchFn && getBaseFn) {
              ufetchFn({ base: getBaseFn({ vec_uin: [loginUin] }) }).then(res => {
                if (res && res.base && res.base.code === 0 && res.base.data && res.base.data.map_userinfo && res.base.data.map_userinfo[loginUin]) {
                  const uInfo = res.base.data.map_userinfo[loginUin];
                  const freshNick = uInfo.nick || userNick;
                  const freshAvatar = uInfo.headurl || userAvatar;
                  try {
                    localStorage.setItem('__qqmusic_user_profile__', JSON.stringify({
                      name: freshNick,
                      img: freshAvatar,
                      uin: loginUin
                    }));
                  } catch(e) {}
                  setCurrentPlayListInfo(prev => {
                    if (!prev || !prev.detailContent || prev.detailContent.dissid !== 'recent') return prev;
                    return {
                      ...prev,
                      detailContent: {
                        ...prev.detailContent,
                        user: {
                          ...prev.detailContent.user,
                          img: freshAvatar,
                          name: freshNick
                        }
                      }
                    };
                  });
                }
              }).catch(() => {});
            }
          } catch(e) {}
        }
      } catch(e) {
        console.error('[RecentPlay] load error:', e);
      }
      return;
    }

    if (playListCache.has(dissId) && playListCache.get(dissId) && !force) {
      setCurrentPlayListInfo(playListCache.get(dissId));
    } else {
      if (needLoading) {
        setIsLoading(true);
      }

      _isLoading = true;

      _invokeCgiAndHandleData({
        dissid: parseInt(dissId, 10),
        _isSelfCreate: isSelfCreate
      });
    }
  };

  const _invokeCgiAndHandleData = (args, timeout = 200) => {
    const {
      dissid = null,
      dirid = null,
      _isSelfCreate = false
    } = args;
    getPlayListDetail({
      dissid,
      dirid
    }, _isSelfCreate).then(res => {
      if (res) {
        setCurrentPlayListInfo(res);
        updatePlayListCache(res);
        _isLoading = false;
        setTimeout(() => {
          setIsLoading(false);
        }, timeout);
      }
    });
  };

  const updatePlayListCache = newVal => {
    var _newVal$detailContent;

    playListCache.set(`${newVal === null || newVal === void 0 ? void 0 : (_newVal$detailContent = newVal.detailContent) === null || _newVal$detailContent === void 0 ? void 0 : _newVal$detailContent.dissid}`, newVal);
    setPlayListCache(playListCache);
  };

  const isPlaylistInfoChange = (oldVal, newVal) => {
    var _oldVal$detailContent, _newVal$detailContent2, _oldVal$songlist, _newVal$songlist;

    return ((_oldVal$detailContent = oldVal.detailContent) === null || _oldVal$detailContent === void 0 ? void 0 : _oldVal$detailContent.isCollect) !== ((_newVal$detailContent2 = newVal.detailContent) === null || _newVal$detailContent2 === void 0 ? void 0 : _newVal$detailContent2.isCollect) || ((_oldVal$songlist = oldVal.songlist) === null || _oldVal$songlist === void 0 ? void 0 : _oldVal$songlist.length) !== (newVal === null || newVal === void 0 ? void 0 : (_newVal$songlist = newVal.songlist) === null || _newVal$songlist === void 0 ? void 0 : _newVal$songlist.length);
  };

  const updatePlayListDetail = dirid => {
    var _currentPlayListInfo$;

    if (dirid && dirid !== (currentPlayListInfo === null || currentPlayListInfo === void 0 ? void 0 : (_currentPlayListInfo$ = currentPlayListInfo.detailContent) === null || _currentPlayListInfo$ === void 0 ? void 0 : _currentPlayListInfo$.dirid)) {
      playListCache.clear();
      setPlayListCache(playListCache);
    } else {
      getData(false, true);
    }
  };

  (0,react.useEffect)(() => {
    if (playListCache.has(dissId) && playListCache.get(dissId)) {
      const newVal = playListCache.get(dissId);
      isPlaylistInfoChange(currentPlayListInfo, newVal) && setCurrentPlayListInfo(newVal);
    } else {
      getData(false);
    }
  }, [playListCache]);
  (0,react.useEffect)(() => {
    if (dissId) {
      getData(!playListCache.has(dissId) || !playListCache.get(dissId), true);
    }
    if (dissId === 'recent') {
      const handleRecentUpdate = () => {
        playListCache.delete('recent');
        setPlayListCache(playListCache);
        getData(true, true);
      };
      window.addEventListener('qqmusic_recent_update', handleRecentUpdate);
      return () => window.removeEventListener('qqmusic_recent_update', handleRecentUpdate);
    }
  }, [dissId]);

  const switchPlayListLikeSongs = (song, index) => {
    const _songList = currentPlayListInfo.songlist.slice();

    _songList[index] = { ..._songList[index],
      like: !song.like
    };
    setCurrentPlayListInfo(val => {
      const newState = { ...val,
        songlist: _songList
      };
      playListCache.set(`${currentPlayListInfo.detailContent.dissid}`, newState);
      setPlayListCache(playListCache);
      return newState;
    });
  };

  const switchCollectState = async newCollectVal => {
    await (0,assets/* refreshSelfPlayList */.f$)();
    setCurrentPlayListInfo(val => {
      const newState = { ...val,
        detailContent: { ...val.detailContent,
          isCollect: newCollectVal
        }
      };
      playListCache.set(`${currentPlayListInfo.detailContent.dissid}`, newState);
      setPlayListCache(playListCache);
      return newState;
    });
  };

  const seqPlayListSongList = (oldIndex, newIndex) => {
    if (newIndex !== oldIndex) {
      var _currentPlayListInfo$2;

      const oldList = [...currentPlayListInfo.songlist];
      const newList = array_move_default()(oldList, oldIndex, newIndex);
      (0,assets/* changeOrderOfPlayList */.QS)(currentPlayListInfo === null || currentPlayListInfo === void 0 ? void 0 : (_currentPlayListInfo$2 = currentPlayListInfo.detailContent) === null || _currentPlayListInfo$2 === void 0 ? void 0 : _currentPlayListInfo$2.dirid, newList.map(item => ({
        songId: item.id,
        songType: item.songType
      }))).then(res => {
        if (res) {
          setCurrentPlayListInfo(val => {
            const oldList = [...val.songlist];
            const newList = array_move_default()(oldList, oldIndex, newIndex);
            return { ...val,
              songlist: newList
            };
          });
          updatePlayListCache({ ...currentPlayListInfo,
            songlist: newList
          });
        } else {
          popup/* default.show */.Z.show(0, '操作失败，请检查网络稍后再试');
          setCurrentPlayListInfo(currentPlayListInfo => ({ ...currentPlayListInfo,
            songlist: oldList
          }));
        }
      });
    }
  };

  const handleSwitchCheckState = index => {
    setCurrentPlayListInfo(val => {
      const _songList = [...val.songlist];
      _songList[index].checked = !_songList[index].checked;
      return { ...val,
        songlist: _songList
      };
    });
  };

  const selectedSongs = (0,react.useMemo)(() => {
    return currentPlayListInfo.songlist.filter(item => item === null || item === void 0 ? void 0 : item.checked);
  }, [currentPlayListInfo]);

  const clearSelectedItems = () => {
    setCurrentPlayListInfo(val => {
      const newVal = { ...val,
        songlist: val.songlist.map(item => ({ ...item,
          checked: false
        }))
      };
      updatePlayListCache(newVal);
      return { ...val,
        songlist: val.songlist.map(item => ({ ...item,
          checked: false
        }))
      };
    });
  };

  const deleteSelectedItem = () => {
    (0,assets/* deleteSongsInPlayList */.As)(currentPlayListInfo.detailContent.dirid, selectedSongs.map(item => ({
      songId: item.id,
      songType: item.type
    }))).then(isSuccess => {
      if (!isSuccess) {
        popup/* default.show */.Z.show(0, '删除失败，请检查网络后再试');
      } else {
        clearSelectedItems();
        const newSongList = currentPlayListInfo.songlist.filter(item => !item.checked);
        updatePlayListCache({ ...currentPlayListInfo,
          songlist: newSongList
        });
        setCurrentPlayListInfo(val => ({ ...val,
          songlist: newSongList
        }));
      }
    });
  };

  const playSelectedItem = () => {
    client/* default.playSong */.Z.playSong({
      songList: selectedSongs,
      playIndex: 0
    });
    clearSelectedItems();
  };

  return [isLoading, currentPlayListInfo, {
    updatePlayListDetail,
    seqPlayListSongList,
    playSelectedItem,
    deleteSelectedItem,
    switchCollectState,
    switchPlayListLikeSongs,
    handleSwitchCheckState,
    selectedSongs
  }];
};

//# sourceURL=webpack://qqmusic/./src/hooks/playlist.ts_+_1_modules?