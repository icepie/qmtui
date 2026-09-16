
// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "J": () => (/* binding */ SongList),
  "F": () => (/* binding */ SongListItem)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
// EXTERNAL MODULE: ./src/pages/main/css/playlist.less
var playlist = __webpack_require__(93128);
// EXTERNAL MODULE: ./node_modules/stook/dist/stook.esm.js + 2 modules
var stook_esm = __webpack_require__(49068);
// EXTERNAL MODULE: ./src/client/index.tsx
var client = __webpack_require__(21209);
// EXTERNAL MODULE: ./src/lib/common/popup.tsx
var popup = __webpack_require__(43053);
// EXTERNAL MODULE: ./src/lib/common/jump.ts
var jump = __webpack_require__(54128);
// EXTERNAL MODULE: ./src/component/context_menu/index.tsx
var context_menu = __webpack_require__(77365);
// EXTERNAL MODULE: ./src/client/modules/players/index.ts + 2 modules
var players = __webpack_require__(35229);
// EXTERNAL MODULE: ./src/hooks/assets.ts
var assets = __webpack_require__(67891);
// EXTERNAL MODULE: ./node_modules/react-virtualized/dist/es/index.js + 69 modules
var es = __webpack_require__(80376);
// EXTERNAL MODULE: ./node_modules/react-virtualized/styles.css
var styles = __webpack_require__(35012);
// EXTERNAL MODULE: ./node_modules/antd/es/popover/index.js + 1 modules
var popover = __webpack_require__(19181);
;// CONCATENATED MODULE: ./src/component/song_list/component/song_info.tsx


const getSize = song => {
  var _song$track;

  const sizeStr = [];
  const file = song.file || (song === null || song === void 0 ? void 0 : (_song$track = song.track) === null || _song$track === void 0 ? void 0 : _song$track.file);

  if (file.size_128mp3 > 0) {
    sizeStr.push(`${Number(file.size_128mp3 / 1024 / 1024).toFixed(2)}M `);
  }

  if (file.size_320mp3 > 0) {
    sizeStr.push(`${Number(file.size_320mp3 / 1024 / 1024).toFixed(2)}M `);
  }

  if (file.size_flac > 0 || file.size_ape > 0) {
    sizeStr.push(`${Number((file.size_flac || file.size_ape) / 1024 / 1024).toFixed(2)}M `);
  }

  if (file.size_dts > 0) {
    sizeStr.push(`${Number(file.size_dts / 1024 / 1024).toFixed(2)}M `);
  }

  return sizeStr.join('/');
};

const SongInfo = props => {
  const {
    song,
    is_new = false,
    is_exclusive = false,
    songname,
    songdesc
  } = props;
  const size = getSize(song);
  const iconArr = [];
  const detailArr = [];

  if (is_new) {
    iconArr.push( /*#__PURE__*/react.createElement("i", {
      className: "tag_new c_bg_skin"
    }));
  } else if (is_exclusive) {
    iconArr.push( /*#__PURE__*/react.createElement("i", {
      className: "tag_exclusive c_bg_skin"
    }));
  }

  detailArr.push( /*#__PURE__*/react.createElement("div", {
    className: "tips_songlist_detail c_popup__thin",
    key: "popup.songdetail"
  }, /*#__PURE__*/react.createElement("ul", {
    className: "tips_songlist_detail__list c_tx_normal"
  }, /*#__PURE__*/react.createElement("li", {
    className: "tips_songlist_detail__item"
  }, "\u5927\u5C0F\uFF1A", size), song.playTime && /*#__PURE__*/react.createElement("li", {
    className: "tips_songlist_detail__item"
  }, "\u65F6\u957F\uFF1A", song.playTime))));
  return /*#__PURE__*/react.createElement("div", {
    className: "popover_songlist c_bg_floor"
  }, /*#__PURE__*/react.createElement("div", {
    className: "tips_songlist__inner"
  }, /*#__PURE__*/react.createElement("div", {
    className: "tips_songlist__hd c_bg_normal"
  }, /*#__PURE__*/react.createElement("div", {
    className: "tips_songlist__song"
  }, /*#__PURE__*/react.createElement("h2", {
    className: "tips_songlist__tit c_tx_normal",
    dangerouslySetInnerHTML: {
      __html: songname
    }
  }), /*#__PURE__*/react.createElement("div", {
    className: "tips_songlist_icon c_tx_thin"
  }, iconArr)), /*#__PURE__*/react.createElement("div", {
    className: "tips_songlist__desc c_tx_thin"
  }, songdesc)), detailArr));
};

/* harmony default export */ const song_info = (SongInfo);
// EXTERNAL MODULE: ./src/component/song_list/component/index.less
var component = __webpack_require__(49392);
;// CONCATENATED MODULE: ./src/component/song_list/index.tsx














const player = players/* default.getInstance */.Z.getInstance();

const hasAudioResource = songInfo => {
  var _songInfo$track, _songInfo$track2, _songInfo$track3, _songInfo$track3$mv, _songInfo$mv, _songInfo$track4, _songInfo$track4$mv, _songInfo$mv2;

  return (songInfo === null || songInfo === void 0 ? void 0 : songInfo.disabled) === 1 && !(songInfo !== null && songInfo !== void 0 && (_songInfo$track = songInfo.track) !== null && _songInfo$track !== void 0 && _songInfo$track.tid) && (((songInfo === null || songInfo === void 0 ? void 0 : (_songInfo$track2 = songInfo.track) === null || _songInfo$track2 === void 0 ? void 0 : _songInfo$track2.ov) || (songInfo === null || songInfo === void 0 ? void 0 : songInfo.ov)) == 1 || ((songInfo === null || songInfo === void 0 ? void 0 : (_songInfo$track3 = songInfo.track) === null || _songInfo$track3 === void 0 ? void 0 : (_songInfo$track3$mv = _songInfo$track3.mv) === null || _songInfo$track3$mv === void 0 ? void 0 : _songInfo$track3$mv.vt) || (songInfo === null || songInfo === void 0 ? void 0 : (_songInfo$mv = songInfo.mv) === null || _songInfo$mv === void 0 ? void 0 : _songInfo$mv.vt)) == 0 && !!(songInfo !== null && songInfo !== void 0 && (_songInfo$track4 = songInfo.track) !== null && _songInfo$track4 !== void 0 && (_songInfo$track4$mv = _songInfo$track4.mv) !== null && _songInfo$track4$mv !== void 0 && _songInfo$track4$mv.vid || songInfo !== null && songInfo !== void 0 && (_songInfo$mv2 = songInfo.mv) !== null && _songInfo$mv2 !== void 0 && _songInfo$mv2.vid));
};

const SongListItem = /*#__PURE__*/react.forwardRef((props, ref) => {
  var _playingInfo$songOnPl, _playingInfo$songOnPa;

  (0,react.useImperativeHandle)(ref, () => ({
    reset
  }));

  const reset = () => {// todo
  };

  const {
    index,
    songInfo,
    config,
    onPlaySong,
    onSelectSong,
    onShowMenu,
    onSwitchCollectState,
    onPlayMv,
    onAddTo,
    songOnSelected
  } = props;
  const {
    like = false
  } = songInfo;
  let oldEvent;
  const songListItemRef = /*#__PURE__*/react.createRef();
  const [playingInfo] = (0,stook_esm/* useStore */.oR)('PlayingStore', {
    songOnPlaying: null,
    songOnPause: null,
    songList: []
  });
  let stateClass = 'songlist__item c_b_normal';
  let playIconClass = 'songname_menu__item icon_skin c_tx_thin';
  const loveIconClass = `songlist__icon_love icon_skin c_tx_thin ${like ? 'loved' : ''}`;
  const songlistItemBoxClass = `songlist__item_box ${hasAudioResource(songInfo) ? 'songlist__item_box--nosound' : ''}`;

  if (songOnSelected && songOnSelected.findIndex(item => item.id === songInfo.id) !== -1) {
    stateClass += ' current';
    playIconClass += ' songname_menu__play';
  }

  if (playingInfo.songOnPlaying && songInfo.id === ((_playingInfo$songOnPl = playingInfo.songOnPlaying) === null || _playingInfo$songOnPl === void 0 ? void 0 : _playingInfo$songOnPl.id)) {
    stateClass += ' play c_tx_current';
    playIconClass += ' songname_menu__pause';
  }

  if (playingInfo.songOnPause && songInfo.id === ((_playingInfo$songOnPa = playingInfo.songOnPause) === null || _playingInfo$songOnPa === void 0 ? void 0 : _playingInfo$songOnPa.id)) {
    stateClass += ' pause c_tx_current';
    playIconClass += ' songname_menu__play';
  } else {
    playIconClass += ' songname_menu__play';
  }
  /**
   * 音质icon
   */


  const renderQualityIcon = () => {
    var _songInfo$track5;

    if (songInfo !== null && songInfo !== void 0 && (_songInfo$track5 = songInfo.track) !== null && _songInfo$track5 !== void 0 && _songInfo$track5.file || songInfo !== null && songInfo !== void 0 && songInfo.file) {
      var _songInfo$track6;

      const file = (songInfo === null || songInfo === void 0 ? void 0 : (_songInfo$track6 = songInfo.track) === null || _songInfo$track6 === void 0 ? void 0 : _songInfo$track6.file) || (songInfo === null || songInfo === void 0 ? void 0 : songInfo.file);

      if ((file === null || file === void 0 ? void 0 : file.size_dts) > 0) {
        return /*#__PURE__*/react.createElement("i", {
          className: "tag_51 icon_skin c_bg_skin js_quality_icon",
          "data-type": "3"
        });
      } else if ((file === null || file === void 0 ? void 0 : file.size_ape) > 0 || (file === null || file === void 0 ? void 0 : file.size_flac) > 0) {
        return /*#__PURE__*/react.createElement("i", {
          className: "tag_sq icon_skin js_quality_icon",
          "data-type": "2"
        });
      } else if ((file === null || file === void 0 ? void 0 : file.size_320mp3) > 0) {
        return /*#__PURE__*/react.createElement("i", {
          className: "tag_hq icon_skin c_bg_skin js_quality_icon",
          "data-type": "1"
        });
      }
    }
  };
  /**
   * 根据是否有Subtitle来渲染
   */


  const renderDesc = () => {
    var _songInfo$track7, _songInfo$track8;

    return songInfo !== null && songInfo !== void 0 && (_songInfo$track7 = songInfo.track) !== null && _songInfo$track7 !== void 0 && _songInfo$track7.subtitle ? /*#__PURE__*/react.createElement("span", {
      className: "c_tx_thin"
    }, songInfo === null || songInfo === void 0 ? void 0 : (_songInfo$track8 = songInfo.track) === null || _songInfo$track8 === void 0 ? void 0 : _songInfo$track8.subtitle) : null;
  };
  /**
   * 播放歌曲
   */


  const handleToPlaySong = () => {
    config.eventActive && (onPlaySong === null || onPlaySong === void 0 ? void 0 : onPlaySong(index));
  };
  /**
   * 添加歌曲
   */


  const handleToAddSong = ev => {
    config.eventActive && (onAddTo === null || onAddTo === void 0 ? void 0 : onAddTo(index, ev));
    ev.persist();
    ev.preventDefault();
  };

  const handleToShowMenu = ev => {
    config.eventActive && (onShowMenu === null || onShowMenu === void 0 ? void 0 : onShowMenu(index, ev));
    ev.preventDefault();
  };

  const handleSwitchCollectionState = ev => {
    ev.stopPropagation();
    ev.preventDefault();
    config.eventActive && (onSwitchCollectState === null || onSwitchCollectState === void 0 ? void 0 : onSwitchCollectState(songInfo, index));
  };

  const playMv = () => {
    var _songInfo$mv3;

    if (songInfo !== null && songInfo !== void 0 && (_songInfo$mv3 = songInfo.mv) !== null && _songInfo$mv3 !== void 0 && _songInfo$mv3.vid && config.eventActive) {
      onPlayMv(songInfo.mv.vid);
    }
  };

  const renderSongInfo = () => {
    if (config.eventActive) {
      var _songInfo$track9, _songInfo$track10, _songInfo$track11;

      const data = {
        song: songInfo,
        songname: songInfo.name,
        songdesc: (songInfo === null || songInfo === void 0 ? void 0 : (_songInfo$track9 = songInfo.track) === null || _songInfo$track9 === void 0 ? void 0 : _songInfo$track9.subtitle) || (songInfo === null || songInfo === void 0 ? void 0 : songInfo.subtitle),
        file: (songInfo === null || songInfo === void 0 ? void 0 : (_songInfo$track10 = songInfo.track) === null || _songInfo$track10 === void 0 ? void 0 : _songInfo$track10.file) || (songInfo === null || songInfo === void 0 ? void 0 : songInfo.file),
        interval: (songInfo === null || songInfo === void 0 ? void 0 : (_songInfo$track11 = songInfo.track) === null || _songInfo$track11 === void 0 ? void 0 : _songInfo$track11.interval) || (songInfo === null || songInfo === void 0 ? void 0 : songInfo.interval)
      };
      return /*#__PURE__*/react.createElement(song_info, data);
    }
  };
  /**
   * 筛选，不能禁用
   */


  const handleCheckInputClick = ev => {
    ev.stopPropagation();
    props === null || props === void 0 ? void 0 : props.onSwitchCheckState(index, songInfo);
  };

  const renderSort = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "songlist__sort c_tx_thin"
    }, /*#__PURE__*/react.createElement("input", {
      readOnly: true,
      checked: songInfo.checked,
      className: "form__checkbox",
      type: "checkbox",
      name: "choose_like",
      onClick: handleCheckInputClick
    }));
  };

  const renderSongNameTitle = () => {
    const innerContent = /*#__PURE__*/react.createElement("div", {
      className: "songlist_name___tit"
    }, songInfo.title, renderDesc());

    if (config.eventActive) {
      return /*#__PURE__*/react.createElement(popover/* default */.Z, {
        trigger: "hover",
        content: renderSongInfo,
        placement: "right"
      }, innerContent);
    }

    return innerContent;
  };
  /**
   * 名字
   */


  const renderSongName = () => {
    if (config !== null && config !== void 0 && config.songname) {
      var _songInfo$mv4;

      return /*#__PURE__*/react.createElement("div", {
        className: "songlist__songname"
      }, /*#__PURE__*/react.createElement("div", {
        className: "mod_songlist_name"
      }, /*#__PURE__*/react.createElement("div", {
        className: `songlist_name__txt ${hasAudioResource(songInfo) ? 'c_tx_disabled' : ''}`
      }, (config === null || config === void 0 ? void 0 : config.sort) && renderSort(), /*#__PURE__*/react.createElement("a", {
        onClick: handleSwitchCollectionState,
        className: loveIconClass
      }, /*#__PURE__*/react.createElement("span", {
        className: "icon_txt"
      }, "\u6536\u85CF")), /*#__PURE__*/react.createElement("div", {
        className: "songlist_name___cont"
      }, /*#__PURE__*/react.createElement("div", {
        className: "songlist_name__cont_box"
      }, renderSongNameTitle(), /*#__PURE__*/react.createElement("div", {
        className: "songlist_name__icon"
      }))))), config.eventActive && /*#__PURE__*/react.createElement("div", {
        className: "mod_songname_menu"
      }, /*#__PURE__*/react.createElement("a", {
        className: playIconClass,
        title: "\u64AD\u653E",
        onClick: handleToPlaySong
      }, /*#__PURE__*/react.createElement("span", {
        className: "icon_txt"
      }, "\u64AD\u653E")), /*#__PURE__*/react.createElement("a", {
        className: "songname_menu__item songname_menu__add icon_skin c_tx_thin",
        title: "\u6DFB\u52A0\u5230",
        onClick: handleToAddSong
      }, /*#__PURE__*/react.createElement("span", {
        className: "icon_txt"
      }, "\u6DFB\u52A0\u5230")), /*#__PURE__*/react.createElement("a", {
        className: "songname_menu__item songname_menu__more icon_skin c_tx_thin",
        title: "\u66F4\u591A\u64CD\u4F5C",
        "aria-haspopup": "true",
        onClick: handleToShowMenu
      }, /*#__PURE__*/react.createElement("span", {
        className: "icon_txt"
      }, "\u66F4\u591A\u64CD\u4F5C"))));
    }
  };

  const jumpSinger = (ev, mid) => {
    ev.stopPropagation();

    if (mid && config.eventActive) {
      (0,jump/* default */.Z)(jump/* PAGE_TYPE.SINGER */.G.SINGER, {
        mid
      });
    }
  };
  /**
   *  搜索的时候，后台返回了匹配的加粗字段
   */


  const handleTextWithHtmlTag = str => {
    if (str) {
      return str.replace(/<em>/, '<strong>');
    }
  };

  const renderSingerInfo = () => {
    if (config !== null && config !== void 0 && config.singer) {
      var _songInfo$track12;

      const singerInfo = (songInfo === null || songInfo === void 0 ? void 0 : songInfo.singer) || (songInfo === null || songInfo === void 0 ? void 0 : (_songInfo$track12 = songInfo.track) === null || _songInfo$track12 === void 0 ? void 0 : _songInfo$track12.singer) || [];
      return /*#__PURE__*/react.createElement("div", {
        className: "songlist__author"
      }, /*#__PURE__*/react.createElement("span", {
        className: "songlist__txt"
      }, singerInfo.length > 0 && singerInfo.map((item, idx) => {
        return /*#__PURE__*/react.createElement(react.Fragment, {
          key: `${item.mid || item.id || item.name || item.title}_${idx}`
        }, /*#__PURE__*/react.createElement("a", {
          dangerouslySetInnerHTML: {
            __html: handleTextWithHtmlTag(item.title || item.name)
          },
          title: item.title || item.name,
          className: !item.mid ? 'c_tx_disabled' : '',
          onClick: e => jumpSinger(e, item.mid)
        }), idx < singerInfo.length - 1 ? ' / ' : '');
      })));
    }
  };

  const renderSongPlayTime = () => {
    if (config !== null && config !== void 0 && config.time) {
      return /*#__PURE__*/react.createElement("div", {
        className: "songlist__time"
      }, songInfo.playTime);
    }
  };

  const jumpToAlbumDetail = (ev, mid) => {
    ev.stopPropagation();

    if (mid && config.eventActive) {
      (0,jump/* default */.Z)(jump/* PAGE_TYPE.ALBUM */.G.ALBUM, {
        mid
      });
    }
  };
  /**
   * 专辑信息
   */


  const renderAlbumInfo = () => {
    if (config !== null && config !== void 0 && config.album) {
      var _songInfo$track13;

      const albumInfo = (songInfo === null || songInfo === void 0 ? void 0 : (_songInfo$track13 = songInfo.track) === null || _songInfo$track13 === void 0 ? void 0 : _songInfo$track13.album) || (songInfo === null || songInfo === void 0 ? void 0 : songInfo.album);

      if (albumInfo) {
        return /*#__PURE__*/react.createElement("div", {
          className: "songlist__album"
        }, /*#__PURE__*/react.createElement("span", {
          className: "songlist__txt"
        }, /*#__PURE__*/react.createElement("a", {
          title: albumInfo.name,
          onClick: e => jumpToAlbumDetail(e, albumInfo.mid)
        }, albumInfo.name)));
      }
    }
  };
  /**
   * 单击，选中
   * @param ev
   */


  const handleSongItemClick = ev => {
    if (songInfo.disabled !== 1) {
      onSelectSong === null || onSelectSong === void 0 ? void 0 : onSelectSong(index, ev);
    }
  };

  const handleSongItemDoubleClick = ev => {
    if (config.eventActive) {
      onPlaySong(index);
      ev.preventDefault();
    }
  };

  const handleInvokeContextMenu = ev => {
    if (config.eventActive) {
      if (ev.pageX) {
        oldEvent = ev;
      }

      ev.preventDefault();
      onShowMenu && onShowMenu(index, oldEvent);
    }
  };

  return /*#__PURE__*/react.createElement("li", {
    style: (props === null || props === void 0 ? void 0 : props.style) || {},
    ref: songListItemRef,
    className: stateClass,
    onClick: handleSongItemClick,
    onDoubleClick: handleSongItemDoubleClick,
    onContextMenu: handleInvokeContextMenu
  }, /*#__PURE__*/react.createElement("div", {
    className: songlistItemBoxClass
  }, renderSongName(), renderSingerInfo(), renderAlbumInfo(), renderSongPlayTime(), config.quality && /*#__PURE__*/react.createElement("div", {
    className: "songlist__quality"
  })), /*#__PURE__*/react.createElement("div", {
    className: "songlist__item_bg c_bg_normal"
  }));
});
const defaultConfig = {
  // 是否展示头部
  header: true,
  // 是否展示排序
  sort: false,
  // 展示number
  number: false,
  // 排名
  rank: false,
  // 速度
  speed: false,
  // 歌曲名字
  songname: true,
  // 歌手
  singer: true,
  // 专辑
  album: true,
  // 日期
  date: false,
  // 时长
  time: false,
  // 云
  cloud: false,
  // 电台
  isAudio: false,
  // 指数
  isExp: false,
  layoutVertical: false,
  isClassic: false,
  isSwipe: false,
  isPlayAll: true,
  isVirtualize: true,
  drag: false,
  eventActive: true,
  contextMenuDelete: false,
  audio: false,
  noLove: true,
  listenNum: false,
  quality: true
};
const SONG_LIST_HEADER_HEIGHT = 35;
const SongList = /*#__PURE__*/react.forwardRef((props, ref) => {
  const {
    config,
    songList,
    wrapper
  } = props; // isCtrlKeyActive和songOnSelected是用于选择歌曲的

  let isCtrlKeyActive = false;
  let hasBindResizeEvent = false;
  let hasSetSongList = false;
  const [wrapperSize, setWrapperSize] = (0,react.useState)({
    width: 0,
    height: 0
  });
  /**
   * 注入到ref的方法
   */

  (0,react.useImperativeHandle)(ref, () => ({
    scrollToRow,
    resize
  }));
  const [songOnSelected, setSongOnSelected] = (0,react.useState)([]);
  const [playingInfo] = (0,stook_esm/* useStore */.oR)('PlayingStore');
  const songListRef = /*#__PURE__*/react.createRef();
  const virtualListRef = /*#__PURE__*/react.createRef();
  const {
    layoutVertical,
    isAudio,
    header,
    sort,
    rank,
    number,
    speed,
    songname,
    singer,
    album,
    time,
    cloud,
    quality,
    isVirtualize
  } = { ...defaultConfig,
    ...config
  };
  let modClass = isAudio ? 'mod_audiolist' : 'mod_songlist';

  if (layoutVertical && isAudio) {
    modClass += ' mod_audiolist--vertical';
  }

  (0,react.useEffect)(() => {
    if (!hasBindResizeEvent && wrapper && wrapper.current) {
      setWrapperSize({
        width: wrapper.current.clientWidth,
        height: wrapper.current.clientHeight
      });
      wrapper.current.addEventListener('resize', handleWrapperResize);
      window.addEventListener('resize', handleWrapperResize);
      hasBindResizeEvent = true;
    }
  }, [wrapper]);
  (0,react.useEffect)(() => {
    handleWrapperResize();
    return () => {
      var _popup$singerPropUpRe, _popup$singerPropUpRe2;

      window.removeEventListener('resize', handleWrapperResize);
      popup/* default */.Z === null || popup/* default */.Z === void 0 ? void 0 : (_popup$singerPropUpRe = popup/* default.singerPropUpRef */.Z.singerPropUpRef) === null || _popup$singerPropUpRe === void 0 ? void 0 : (_popup$singerPropUpRe2 = _popup$singerPropUpRe.current) === null || _popup$singerPropUpRe2 === void 0 ? void 0 : _popup$singerPropUpRe2.hide();
    };
  }, []);

  const resize = () => {
    handleWrapperResize();
  };

  const handleWrapperResize = () => {
    if (wrapper !== null && wrapper !== void 0 && wrapper.current) {
      setWrapperSize({
        width: wrapper.current.clientWidth,
        height: wrapper.current.clientHeight
      });
    }
  };

  const scrollToRow = idx => {
    if (idx >= 0 && idx <= (songList === null || songList === void 0 ? void 0 : songList.length)) {
      var _virtualListRef$curre;

      (_virtualListRef$curre = virtualListRef.current) === null || _virtualListRef$curre === void 0 ? void 0 : _virtualListRef$curre.scrollToRow(idx);
    }
  };

  const renderSongListHeader = () => {
    if (header) {
      return /*#__PURE__*/react.createElement("div", {
        className: "songlist__header c_tx_thin c_b_normal",
        style: {
          height: `${SONG_LIST_HEADER_HEIGHT}px`
        }
      }, /*#__PURE__*/react.createElement("ul", null, sort ? /*#__PURE__*/react.createElement("li", {
        className: "songlist_header_sort"
      }) : '', rank ? /*#__PURE__*/react.createElement("li", {
        className: "songlist__header_rank"
      }) : '', number ? /*#__PURE__*/react.createElement("li", {
        className: "songlist__header_number"
      }) : '', speed ? /*#__PURE__*/react.createElement("li", {
        className: "songlist__header_speed"
      }) : '', songname ? /*#__PURE__*/react.createElement("li", {
        className: "songlist__header_name"
      }, isAudio ? '作品' : '歌曲') : '', singer ? /*#__PURE__*/react.createElement("li", {
        className: "songlist__header_author"
      }, isAudio ? '主播' : '歌手') : '', album ? /*#__PURE__*/react.createElement("li", {
        className: "songlist__header_album"
      }, isAudio ? '电台' : '专辑') : '', time ? /*#__PURE__*/react.createElement("li", {
        className: "songlist__header_time"
      }, "\u65F6\u957F") : '', cloud ? /*#__PURE__*/react.createElement("li", {
        className: "songlist__header_cloud"
      }) : '', quality ? /*#__PURE__*/react.createElement("li", {
        className: "songlist__header_quality"
      }) : ''));
    }
  };
  /**
   * 选择歌曲
   * @param index
   * @param ev
   */


  const handleSelectSong = (index = 0, ev) => {
    var _playingInfo$songOnPa2, _playingInfo$songOnPl2;

    if (songList[index].id === (playingInfo === null || playingInfo === void 0 ? void 0 : (_playingInfo$songOnPa2 = playingInfo.songOnPause) === null || _playingInfo$songOnPa2 === void 0 ? void 0 : _playingInfo$songOnPa2.id) || songList[index].id === (playingInfo === null || playingInfo === void 0 ? void 0 : (_playingInfo$songOnPl2 = playingInfo.songOnPlaying) === null || _playingInfo$songOnPl2 === void 0 ? void 0 : _playingInfo$songOnPl2.id)) {// setSongOnPlaying(null);
      // setSongOnPause(null);
    }

    if (ev.ctrlKey || isCtrlKeyActive) {
      setSongOnSelected([...songOnSelected, songList[index]]);
      isCtrlKeyActive = true;
    } else {
      isCtrlKeyActive = false;
      setSongOnSelected([]);
    }
  };
  /**
   * play mv
   * @param vid
   */


  const handlePlayMv = vid => {
    client/* default.playMV */.Z.playMV({
      vid
    });
  };
  /**
   * 播放歌曲
   * @param index
   */


  const handlePlaySong = index => {
    var _playingInfo$songOnPl3, _playingInfo$songOnPa3;

    const songToAction = songList[index];

    if ((playingInfo === null || playingInfo === void 0 ? void 0 : (_playingInfo$songOnPl3 = playingInfo.songOnPlaying) === null || _playingInfo$songOnPl3 === void 0 ? void 0 : _playingInfo$songOnPl3.id) === (songToAction === null || songToAction === void 0 ? void 0 : songToAction.id)) {
      player.pause();
    } else if ((playingInfo === null || playingInfo === void 0 ? void 0 : (_playingInfo$songOnPa3 = playingInfo.songOnPause) === null || _playingInfo$songOnPa3 === void 0 ? void 0 : _playingInfo$songOnPa3.id) === (songToAction === null || songToAction === void 0 ? void 0 : songToAction.id)) {
      player.resume();
    } else if (!hasSetSongList) {
      hasSetSongList = true;

      const _songListToPlay = config !== null && config !== void 0 && config.isPlayAll ? songList : [songList[index]];

      const _idx = config !== null && config !== void 0 && config.isPlayAll ? index : 0;

      player.playAll({
        songList: _songListToPlay,
        index: _idx
      });
    } else {
      player.play({
        index
      });
    }

    setSongOnSelected([]);
  };
  /**
   * 展示菜单窗口
   * @param index
   * @param ev
   */


  const handleShowMenu = (index, ev) => {
    var _popup$singerPropUpRe3, _popup$singerPropUpRe4;

    const _songOnSelected = [...songOnSelected, songList[index]];
    popup/* default */.Z === null || popup/* default */.Z === void 0 ? void 0 : (_popup$singerPropUpRe3 = popup/* default.singerPropUpRef */.Z.singerPropUpRef) === null || _popup$singerPropUpRe3 === void 0 ? void 0 : (_popup$singerPropUpRe4 = _popup$singerPropUpRe3.current) === null || _popup$singerPropUpRe4 === void 0 ? void 0 : _popup$singerPropUpRe4.hide();
    (0,context_menu/* showMenu */.A)(ev, {
      songList,
      songOnSelected: _songOnSelected,
      index,
      playListDetail: props === null || props === void 0 ? void 0 : props.playListDetail,
      eventListener: {
        onDelete: props === null || props === void 0 ? void 0 : props.onDeleteSong
      }
    }, {
      isPlayAll: config === null || config === void 0 ? void 0 : config.isPlayAll,
      showPlay: true,
      showDelete: config === null || config === void 0 ? void 0 : config.contextMenuDelete
    });
  };
  /**
   * 添加到
   * @param index
   * @param ev
   */


  const handleAddTo = (index, ev) => {
    (0,context_menu/* showPlayListMenu */.q)(ev, songList[index], [songList[index]]);
  };
  /**
   * 切换喜欢状态
   * @param song
   * @param index
   */


  const handleSwitchCollectState = (song, index) => {
    const _song = { ...song
    };
    (0,assets/* switchLikeState */.Mb)(song).then(isSuccess => {
      var _props$onSwitchCollec;

      isSuccess && (props === null || props === void 0 ? void 0 : (_props$onSwitchCollec = props.onSwitchCollectState) === null || _props$onSwitchCollec === void 0 ? void 0 : _props$onSwitchCollec.call(props, _song, index));
    });
  };

  const handleVirtualRowRendered = rows => {
    (props === null || props === void 0 ? void 0 : props.onRowRenderer) && props.onRowRenderer({
      startIndex: rows.startIndex,
      stopIndex: rows.stopIndex
    });
  };

  const handleVirtualListScroll = params => {
    var _props$onVirtualListS;

    (_props$onVirtualListS = props.onVirtualListScroll) === null || _props$onVirtualListS === void 0 ? void 0 : _props$onVirtualListS.call(props, params);
  };

  const renderVirtualListContent = () => {
    const contStyle = isAudio ? 'audiolist_cont' : 'songlist_cont';
    return /*#__PURE__*/react.createElement("div", {
      className: contStyle,
      ref: songListRef
    }, /*#__PURE__*/react.createElement(es/* List */.aV, {
      ref: virtualListRef,
      scrollToAlignment: 'center',
      onScroll: handleVirtualListScroll,
      rowCount: songList.length,
      rowHeight: 50,
      onRowsRendered: handleVirtualRowRendered,
      autoWidth: true,
      width: wrapperSize.width,
      height: wrapperSize.height - 5 < SONG_LIST_HEADER_HEIGHT ? 0 : wrapperSize.height - SONG_LIST_HEADER_HEIGHT - 5,
      rowRenderer: ({
        key,
        index,
        style
      }) => {
        const item = songList[index];

        if (item) {
          return /*#__PURE__*/react.createElement(SongListItem, {
            key: key,
            style: style,
            songInfo: item,
            songOnSelected: songOnSelected,
            index: index,
            config: { ...defaultConfig,
              ...config
            },
            onSelectSong: handleSelectSong,
            onPlayMv: handlePlayMv,
            onPlaySong: handlePlaySong,
            onShowMenu: handleShowMenu,
            onAddTo: handleAddTo,
            onSwitchCollectState: handleSwitchCollectState
          });
        }
      }
    }));
  };

  const renderNormalContent = () => {
    return /*#__PURE__*/react.createElement("ul", null, songList.map((item, index) => {
      return /*#__PURE__*/react.createElement(SongListItem, {
        key: `${item === null || item === void 0 ? void 0 : item.id}_${index}`,
        songInfo: item,
        songOnSelected: songOnSelected,
        index: index,
        config: { ...defaultConfig,
          ...config
        },
        onSelectSong: handleSelectSong,
        onPlayMv: handlePlayMv,
        onPlaySong: handlePlaySong,
        onShowMenu: handleShowMenu,
        onAddTo: handleAddTo,
        onSwitchCollectState: handleSwitchCollectState
      });
    }));
  };

  return /*#__PURE__*/react.createElement("div", {
    className: modClass
  }, renderSongListHeader(), isVirtualize ? renderVirtualListContent() : renderNormalContent());
});


//# sourceURL=webpack://qqmusic/./src/component/song_list/index.tsx_+_1_modules?