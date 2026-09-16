/**
 * 原生高品质音频下载 (默认保存至 ~/Music)
 */
const DOWNLOAD_SONG = (song, cb) => {
  const getQualities = () => {
    const file = (song && (song.file || (song.track && song.track.file))) || {};
    const hasHires = !!(file.size_hires || file.size_96flac || file.size_24bit || (file.size_new && (file.size_new[11] || file.size_new[13])));
    const hasSQ = !!(file.size_flac || file.size_ape || file.size_dts || (file.size_new && file.size_new[12]));
    const hasHQ = !!(file.size_320mp3 || file.size_320 || (file.size_new && file.size_new[2]));
    
    const triggerDownload = (qualityKey, qualityLabel) => {
      const title = (song.title || song.name || (song.track && (song.track.title || song.track.name)) || '歌曲');
      _lib_common_popup__WEBPACK_IMPORTED_MODULE_0__/* .default.show */ .Z.show(1, '正在开始下载 ' + qualityLabel + '《' + title + '》...');
      
      if (typeof window !== 'undefined' && window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.invoke('download-song-file', { song, quality: qualityKey }).then(res => {
          if (res && res.success) {
            _lib_common_popup__WEBPACK_IMPORTED_MODULE_0__/* .default.show */ .Z.show(1, '✓ 已保存至 ~/Music/qqmusic/' + res.filename);
          } else {
            _lib_common_popup__WEBPACK_IMPORTED_MODULE_0__/* .default.show */ .Z.show(0, (res && res.msg) || '下载失败');
          }
        }).catch(err => {
          _lib_common_popup__WEBPACK_IMPORTED_MODULE_0__/* .default.show */ .Z.show(0, '下载出错: ' + (err && err.message));
        });
      }
      cb === null || cb === void 0 ? void 0 : cb();
    };

    const subList = [];
    if (hasHires) {
      subList.push({
        text: 'Hi-Res (24bit / 96kHz)',
        iconClass: 'operate_menu__icon_hires',
        fn: () => triggerDownload('hires', 'Hi-Res 高解析')
      });
    }
    if (hasSQ) {
      subList.push({
        text: 'SQ 无损 (16bit / 44.1kHz)',
        iconClass: 'operate_menu__icon_flac',
        fn: () => triggerDownload('flac', 'SQ 无损')
      });
    }
    if (hasHQ) {
      subList.push({
        text: 'HQ 高品质 (320kbps MP3)',
        iconClass: 'operate_menu__icon_hq',
        fn: () => triggerDownload('320k', 'HQ 高品质')
      });
    }
    subList.push({
      text: '标准品质 (128kbps MP3)',
      iconClass: 'operate_menu__icon_standard',
      fn: () => triggerDownload('128k', '标准品质')
    });
    return subList;
  };

  return {
    text: '下载',
    iconClass: 'operate_menu__icon_download',
    getSubListCb: callback => callback(getQualities()),
    fn: () => {
      const list = getQualities();
      if (list && list.length > 0 && list[0].fn) list[0].fn();
    }
  };
};

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": () => (/* binding */ showMenu),
/* harmony export */   "q": () => (/* binding */ showPlayListMenu)
/* harmony export */ });
/* harmony import */ var _lib_common_popup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43053);
/* harmony import */ var _src_lib_common_service_commands_show_common_dlg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(36702);
/* harmony import */ var _lib_common_jump__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(54128);
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(21209);
/* harmony import */ var _lib_common_login__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(68010);
/* harmony import */ var _lib_common_dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7273);
/* harmony import */ var _lib_components_add_playlist__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(21599);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(67294);
/* harmony import */ var stook__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(49068);
/* harmony import */ var _client_modules_players__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(35229);
/* harmony import */ var _diy_menu__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(90658);
/* harmony import */ var _src_hooks_assets__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(67891);
/* harmony import */ var _tool_qmfeUnityReport__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(42643);














const player = _client_modules_players__WEBPACK_IMPORTED_MODULE_9__/* .default.getInstance */ .Z.getInstance();
/**
 * 右键-播放
 * 播放指的是将当前列表作为播放列表加入到播放器，并播放当前索引的歌曲
 * @param songlist
 * @param index
 * @param cb
 * @constructor
 */

const PLAY_THIS_SONG = (songlist, index, cb) => {
  return {
    text: '播放',
    iconClass: 'operate_menu__icon_play',
    fn: () => {
      player.playAll({
        songList: songlist,
        index
      });
      cb === null || cb === void 0 ? void 0 : cb();
    },
    groupend: index === songlist.length ? 0 : 1
  };
};
/**
 * 播放MV
 * @constructor
 */


const PLAY_MV = (song, cb) => ({
  text: '播放MV',
  iconClass: 'operate_menu__icon_mv',
  fn: () => {
    var _song$mv;

    if (song !== null && song !== void 0 && (_song$mv = song.mv) !== null && _song$mv !== void 0 && _song$mv.vid) {
      _client__WEBPACK_IMPORTED_MODULE_3__/* .default.playMV */ .Z.playMV({
        vid: song.mv.vid
      });
      cb === null || cb === void 0 ? void 0 : cb();
    }
  }
});
/**
 * 添加到
 * @param song
 * @param selectedList
 * @param skipFavList
 * @param cb
 * @constructor
 */


const ADD_TO = (song, selectedList, skipFavList = false, cb) => ({
  text: '添加到',
  iconClass: 'operate_menu__icon_add',
  // 这里是为了生成一个包含当前其拥有的歌单的sublist
  getSubListCb: callback => callback(addPlaylistMenu([], song, selectedList, skipFavList, cb))
});
/**
 * 分享歌曲
 * @param song
 * @param cb
 * @constructor
 */


const SHARE = (song, cb) => ({
  text: '分享',
  iconClass: 'operate_menu__icon_share',
  fn: () => {
    const mid = (song && (song.mid || (song.track && song.track.mid))) || '';
    const id = (song && (song.id || (song.track && song.track.id))) || '';
    const songUrl = mid ? 'https://y.qq.com/n/ryqq/songDetail/' + mid : 'https://i.y.qq.com/v8/playsong.html?songid=' + id;
    try {
      if (typeof window !== 'undefined' && window.require) {
        const { clipboard } = window.require('electron');
        clipboard.writeText(songUrl);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(songUrl);
      } else {
        const handler = (e) => {
          e.clipboardData.setData('text/plain', songUrl);
          e.preventDefault();
        };
        document.addEventListener('copy', handler, { once: true });
        document.execCommand('copy');
      }
      _lib_common_popup__WEBPACK_IMPORTED_MODULE_0__/* .default.show */ .Z.show(1, '已复制歌曲链接');
    } catch (err) {
      console.error('[Share] Copy failed:', err);
    }
    cb === null || cb === void 0 ? void 0 : cb();
  }
});

const BUY_SONG = (song, cb) => ({
  text: '单曲购买',
  fn: () => {
    var _song$track;

    (0,_src_lib_common_service_commands_show_common_dlg__WEBPACK_IMPORTED_MODULE_1__/* .showCommonDlg */ .jX)({
      title: '单曲购买',
      width: 440,
      height: 519,
      openUrl: `https://y.qq.com/wk_v17/#/buysong?songid=${(song === null || song === void 0 ? void 0 : song.id) || ((_song$track = song.track) === null || _song$track === void 0 ? void 0 : _song$track.id)}`
    });
    cb === null || cb === void 0 ? void 0 : cb();
  }
});
/**
 *
 */


const SHOW_MUSIC_SCORE = () => null;

const SHOW_DETAIL = (song, cb) => ({
  text: '查看评论',
  iconClass: 'operate_menu__icon_comment',

  fn() {
    (0,_lib_common_jump__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z)(_lib_common_jump__WEBPACK_IMPORTED_MODULE_2__/* .PAGE_TYPE.SONG */ .G.SONG, {
      id: song.id,
      type: song.type
    });
    cb === null || cb === void 0 ? void 0 : cb();
  }

});
/**
 * 复制歌曲信息
 * @param song
 * @param cb
 * @constructor
 */


const COPY_SONG_INFO = (song, cb) => ({
  text: '复制信息',
  iconClass: 'operate_menu__icon_copy',

  fn() {
    var _song$album;

    const arrSingerName = ((song === null || song === void 0 ? void 0 : song.singer) || []).map(item => item.name);
    const copyInfo = [];
    copyInfo.push(`歌曲名：${song.name}`);

    if (arrSingerName.length > 0) {
      copyInfo.push(`歌手名：${arrSingerName.join('/')}`);
    }

    if (song !== null && song !== void 0 && (_song$album = song.album) !== null && _song$album !== void 0 && _song$album.title && song.album.title.replace(/\s/g, '')) {
      copyInfo.push(`专辑名：${song.album.title}`);
    }

    document.addEventListener('copy', e => {
      e.clipboardData.setData('text/plain', copyInfo.join(', '));
      e.preventDefault();
    });
    document.execCommand('copy');
    cb === null || cb === void 0 ? void 0 : cb();
  }

});
/**
 * 删除
 * @param song
 * @param playListDetail
 * @param cb
 * @constructor
 */


const DELETE = (song, playListDetail, cb) => ({
  text: '删除',
  iconClass: 'operate_menu__icon_delete',
  fn: () => {
    _lib_common_dialog__WEBPACK_IMPORTED_MODULE_5__/* .default.show */ .ZP.show({
      mode: 'common',
      title: '删除歌曲',
      sub_title: `确定要将这首歌曲从当前歌单删除吗`,
      button_info1: {
        highlight: 1,
        title: '确定',
        fn: () => {
          _lib_common_dialog__WEBPACK_IMPORTED_MODULE_5__/* .default.hide */ .ZP.hide();

          if (playListDetail !== null && playListDetail !== void 0 && playListDetail.dirid) {
            (0,_src_hooks_assets__WEBPACK_IMPORTED_MODULE_11__/* .deleteSongsInPlayList */ .As)(playListDetail.dirid, [{
              songType: song.type,
              songId: song.id
            }]).then(isSuccess => {
              if (!isSuccess) {
                _lib_common_popup__WEBPACK_IMPORTED_MODULE_0__/* .default.show */ .Z.show(0, '删除失败，请检查网络后再试');
              } else {
                _lib_common_popup__WEBPACK_IMPORTED_MODULE_0__/* .default.show */ .Z.show(1, '删除成功');
                cb === null || cb === void 0 ? void 0 : cb();
              }
            });
          }
        }
      }
    });
  }
});
/**
 *
 * @param subList 这个是菜单的subItemList
 * @param songInfo 点击右键时，悬停的歌曲信息
 * @param currentList 已经选中的歌曲列表
 * @param skipFavorPlayList 是否跳过我喜欢歌单
 * @param cb
 */


const addPlaylistMenu = (subList, songInfo, currentList, skipFavorPlayList = true, cb) => {
  // 这个playlists代表用户创建的和收藏的歌单
  const selfCreatePlayList = (0,stook__WEBPACK_IMPORTED_MODULE_8__/* .getState */ .y0)('SelfCreatePlayList') || [];

  let _subList = subList.slice();

  if (_lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.isLogin */ .Z.isLogin()) {
    _subList.push({
      text: '添加到新歌单',
      iconClass: 'operate_menu__icon_add',
      fn: () => {
        var _songInfo$track;

        const opt = {
          dirname: (songInfo === null || songInfo === void 0 ? void 0 : songInfo.title) || ((_songInfo$track = songInfo.track) === null || _songInfo$track === void 0 ? void 0 : _songInfo$track.title),
          songlist: currentList
        };
        _lib_common_dialog__WEBPACK_IMPORTED_MODULE_5__/* .default.show */ .ZP.show({
          mode: 'custom',
          title: '添加到新歌单',
          component: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7__.createElement(_lib_components_add_playlist__WEBPACK_IMPORTED_MODULE_6__/* .default */ .Z, {
            objArg: opt
          })
        });
      }
    });

    const _selfCreatePlayList = selfCreatePlayList.map(item => {
      if (item.dirId === 201 && skipFavorPlayList) {
        return null;
      }

      return {
        text: item.dirName,
        iconClass: item.dirId === 201 ? 'operate_menu__icon_loved' : '',
        fn: () => {
          (0,_src_hooks_assets__WEBPACK_IMPORTED_MODULE_11__/* .addSongListToPlayList */ .mP)({
            listId: item.dirId,
            songList: currentList
          }).then(() => {
            cb === null || cb === void 0 ? void 0 : cb(item.dirId);
          });
        }
      };
    }).filter(item => !!item);

    _subList = [..._subList, ..._selfCreatePlayList];
  } else {
    _subList.push({
      text: '登录后添加到歌单',

      fn() {
        _lib_common_login__WEBPACK_IMPORTED_MODULE_4__/* .default.loginMiniportal */ .Z.loginMiniportal();
      }

    });
  }

  return _subList;
};

var CONTEXT_MENU;

(function (CONTEXT_MENU) {
  CONTEXT_MENU["PLAY_SONG"] = "PlaySong";
  CONTEXT_MENU["PLAY_MV"] = "PlayMv";
  CONTEXT_MENU["ADD_TO"] = "AddTo";
  CONTEXT_MENU["SHARE"] = "Share";
  CONTEXT_MENU["BUY_SONG"] = "BuySong";
  CONTEXT_MENU["SHOW_DETAIL"] = "ShowDetail";
  CONTEXT_MENU["COPY_SONG_INFO"] = "CopySongInfo";
  CONTEXT_MENU["MUSIC_SCORE"] = "ShowMusicScore";
  CONTEXT_MENU["DELETE"] = "Delete";
  CONTEXT_MENU["DOWNLOAD"] = "DownloadSong";
})(CONTEXT_MENU || (CONTEXT_MENU = {}));

const MenuContentMap = {
  [CONTEXT_MENU.PLAY_SONG]: PLAY_THIS_SONG,
  [CONTEXT_MENU.PLAY_MV]: PLAY_MV,
  [CONTEXT_MENU.ADD_TO]: ADD_TO,
  [CONTEXT_MENU.SHARE]: SHARE,
  [CONTEXT_MENU.BUY_SONG]: BUY_SONG,
  [CONTEXT_MENU.SHOW_DETAIL]: SHOW_DETAIL,
  [CONTEXT_MENU.COPY_SONG_INFO]: COPY_SONG_INFO,
  [CONTEXT_MENU.DELETE]: DELETE,
  [CONTEXT_MENU.DOWNLOAD]: DOWNLOAD_SONG,
  [CONTEXT_MENU.MUSIC_SCORE]: SHOW_MUSIC_SCORE
};
const DEFAULT_CONFIG = {
  isPlayAll: true,
  showPlay: true,
  showDelete: false,
  skipFavSong: false
};
const _defaultEventListener = {
  onPlayMv: null,
  onPlaySong: null,
  onDelete: null,
  onBuySong: null,
  onAddTo: null,
  onCopySongInfo: null,
  onShare: null,
  onShowDetail: null
};
const showMenu = (ev, extraData, config) => {
  var _songInfo$mv, _diyMenuRef$current;

  const {
    songList = [],
    songOnSelected = [],
    index = 0,
    playListDetail = null,
    eventListener = {}
  } = extraData;
  const _config = { ...DEFAULT_CONFIG,
    ...(config || {})
  };
  const songInfo = songList[index];
  const isSelected = songOnSelected.findIndex(item => (item === null || item === void 0 ? void 0 : item.id) === (songInfo === null || songInfo === void 0 ? void 0 : songInfo.id)) !== -1;

  if (songInfo.disabled === 1 && !_config.showDelete) {
    _lib_common_popup__WEBPACK_IMPORTED_MODULE_0__/* .default.show */ .Z.show(0, '无版权歌曲暂不支持此操作', '', 300);
    return;
  } else {
    _tool_qmfeUnityReport__WEBPACK_IMPORTED_MODULE_12__/* .default.reportExposureElement */ .ZP.reportExposureElement(_tool_qmfeUnityReport__WEBPACK_IMPORTED_MODULE_12__/* .ELEMENT_ID.SONG_MENU_EXPOSURE */ .AL.SONG_MENU_EXPOSURE);
  }

  const isNet = songInfo.songType === 1 || songInfo.songType === 11;
  const onlyOne = isSelected && songOnSelected.length === 1;
  const _eventListener = { ..._defaultEventListener,
    ...eventListener
  };
  const menuList = [_config.showPlay && MenuContentMap[CONTEXT_MENU.PLAY_SONG](_config !== null && _config !== void 0 && _config.isPlayAll ? songList : [songList[index]], _config !== null && _config !== void 0 && _config.isPlayAll ? index : 0, _eventListener['onPlaySong']), null, onlyOne && songInfo.type === 0 && songInfo.action.track_pay === 1 ? MenuContentMap[CONTEXT_MENU.BUY_SONG](songInfo, _eventListener['onBuySong']) : null, onlyOne && !isNet ? MenuContentMap[CONTEXT_MENU.SHOW_DETAIL](songInfo, _eventListener['onShowDetail']) : null, onlyOne && MenuContentMap[CONTEXT_MENU.COPY_SONG_INFO](songInfo, _eventListener['onCopySongInfo']), MenuContentMap[CONTEXT_MENU.ADD_TO](songInfo, songOnSelected, _config.skipFavSong, _eventListener['onAddTo']), onlyOne && MenuContentMap[CONTEXT_MENU.DOWNLOAD](songInfo),
    onlyOne && MenuContentMap[CONTEXT_MENU.SHARE](songInfo), null, _config.showDelete && (playListDetail === null || playListDetail === void 0 ? void 0 : playListDetail.dirid) && MenuContentMap[CONTEXT_MENU.DELETE](songInfo, playListDetail, _eventListener['onDelete'])];
  const isLocalOrWebDav = !!(songInfo && (songInfo.isLocal || songInfo.isWebDav || songInfo.localFilePath || (typeof songInfo.mid === 'string' && (songInfo.mid.startsWith('local_') || songInfo.mid.startsWith('webdav_')))));
  let finalMenuList = menuList.filter(item => !!item);
  if (isLocalOrWebDav) {
    finalMenuList = finalMenuList.filter(item => item && (item.text === '播放' || item.text === '复制信息'));
    if (finalMenuList.length > 0) {
      finalMenuList[0].groupend = 0;
    }
  }
  _diy_menu__WEBPACK_IMPORTED_MODULE_10__/* .default */ .Z === null || _diy_menu__WEBPACK_IMPORTED_MODULE_10__/* .default */ .Z === void 0 ? void 0 : (_diyMenuRef$current = _diy_menu__WEBPACK_IMPORTED_MODULE_10__/* .default.current */ .Z.current) === null || _diyMenuRef$current === void 0 ? void 0 : _diyMenuRef$current.showMenu(ev, finalMenuList);
};
const showPlayListMenu = (ev, songInfo, currentSongList, skipFavorPlayList = true, cb) => {
  var _diyMenuRef$current2;

  const subList = addPlaylistMenu([], songInfo, currentSongList, skipFavorPlayList, cb);
  _diy_menu__WEBPACK_IMPORTED_MODULE_10__/* .default */ .Z === null || _diy_menu__WEBPACK_IMPORTED_MODULE_10__/* .default */ .Z === void 0 ? void 0 : (_diyMenuRef$current2 = _diy_menu__WEBPACK_IMPORTED_MODULE_10__/* .default.current */ .Z.current) === null || _diyMenuRef$current2 === void 0 ? void 0 : _diyMenuRef$current2.showMenu(ev, subList, {
    overflowY: 'scroll'
  });
};

//# sourceURL=webpack://qqmusic/./src/component/context_menu/index.tsx?