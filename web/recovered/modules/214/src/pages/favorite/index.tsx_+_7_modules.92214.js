// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ favorite)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
// EXTERNAL MODULE: ./src/lib/common/login.ts
var login = __webpack_require__(68010);
// EXTERNAL MODULE: ./node_modules/stook/dist/stook.esm.js + 2 modules
var stook_esm = __webpack_require__(49068);
// EXTERNAL MODULE: ./src/component/song_list/index.tsx + 1 modules
var song_list = __webpack_require__(57224);
// EXTERNAL MODULE: ./src/component/albumlist/index.tsx
var albumlist = __webpack_require__(70025);
// EXTERNAL MODULE: ./node_modules/antd/es/pagination/index.js + 92 modules
var pagination = __webpack_require__(9293);
// EXTERNAL MODULE: ./src/hooks/assets.ts
var assets = __webpack_require__(67891);
// EXTERNAL MODULE: ./src/lib/common/popup.tsx
var popup = __webpack_require__(43053);
// EXTERNAL MODULE: ./src/pages/favorite/loading/NoFav.tsx
var NoFav = __webpack_require__(93921);
;// CONCATENATED MODULE: ./src/pages/favorite/album/index.tsx







const AlbumContainer = ({
  albumList,
  searchMode
}) => {
  const deleteFun = async mid => {
    if (mid) {
      (0,assets/* deleteSelfFavAlbumList */.RT)([mid], `${login/* default.musicId */.Z.musicId}`).then(succeedList => {
        popup/* default.show */.Z.show(1, '删除成功');
        (0,assets/* refreshFavAlbumList */.B3)(succeedList, false);
      }).catch(() => {
        popup/* default.show */.Z.show(0, '删除失败');
      });
    }
  };

  const PAGE_SIZE = 30;
  const [currentPage, setCurrentPage] = (0,react.useState)(1);
  const pageRef = /*#__PURE__*/react.createRef();

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const _albumList = (albumList === null || albumList === void 0 ? void 0 : albumList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)) || [];

  return /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont__wrapper",
    ref: pageRef
  }, /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont"
  }, !searchMode && (albumList === null || albumList === void 0 ? void 0 : albumList.length) === 0 && /*#__PURE__*/react.createElement(NoFav/* default */.Z, {
    title: "\u6CA1\u6709\u6536\u85CF\u7684\u4E13\u8F91"
  }), (albumList === null || albumList === void 0 ? void 0 : albumList.length) > 0 && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(albumlist/* default */.Z, {
    className: 'mod_adapter_4-6 album_list',
    content: _albumList,
    config: {
      singer: true,
      subtitle: true,
      name: true,
      delete: true,
      imgEaseInAndOut: !searchMode
    },
    containerRef: pageRef,
    deleteFun: deleteFun
  }), /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont__pagination"
  }, /*#__PURE__*/react.createElement(pagination/* default */.Z, {
    showSizeChanger: false,
    current: currentPage,
    onChange: handlePageChange,
    hideOnSinglePage: true,
    defaultPageSize: PAGE_SIZE,
    defaultCurrent: 1,
    total: (albumList === null || albumList === void 0 ? void 0 : albumList.length) || 0
  })))));
};
// EXTERNAL MODULE: ./src/lib/network/index.ts + 1 modules
var network = __webpack_require__(32590);
// EXTERNAL MODULE: ./src/lib/network/asset_api.ts
var asset_api = __webpack_require__(65972);
;// CONCATENATED MODULE: ./src/pages/favorite/audio/index.tsx







const AudioContainer = ({
  audioList,
  searchMode = false
}) => {
  const deleteFun = async (mid, index) => {
    const data = {
      cancelFavAudio: (0,asset_api/* cancelFavAudio */.kq)({
        fav_type: 1,
        vec_id: [mid],
        reqtype: 2
      })
    };
    const res = await (0,network/* ufetch */.D)(data);

    if (res.code === 0 && res.cancelFavAudio.code === 0) {
      (0,stook_esm/* mutate */.JG)('collectAudioList', () => {
        const collectAudioList = [...((0,stook_esm/* getState */.y0)('collectAudioList') || [])];
        collectAudioList.splice(index, 1);
        return collectAudioList;
      });
    }
  };

  const PAGE_SIZE = 30;
  const [currentPage, setCurrentPage] = (0,react.useState)(1);
  const pageRef = /*#__PURE__*/react.createRef();

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const _audioList = (audioList === null || audioList === void 0 ? void 0 : audioList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)) || [];

  return /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont__wrapper",
    ref: pageRef
  }, /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont"
  }, !searchMode && (audioList === null || audioList === void 0 ? void 0 : audioList.length) === 0 && /*#__PURE__*/react.createElement(NoFav/* default */.Z, {
    title: "\u6CA1\u6709\u6536\u85CF\u7684\u4E3B\u64AD\u7535\u53F0"
  }), (audioList === null || audioList === void 0 ? void 0 : audioList.length) > 0 && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(albumlist/* default */.Z, {
    classname: 'mod_adapter_4-6 album_list',
    content: _audioList,
    config: {
      singer: true,
      subtitle: true,
      name: true,
      delete: true,
      imgEaseInAndOut: !searchMode
    },
    containerRef: pageRef,
    deleteFun: deleteFun
  }), /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont__pagination"
  }, /*#__PURE__*/react.createElement(pagination/* default */.Z, {
    showSizeChanger: false,
    current: currentPage,
    onChange: handlePageChange,
    hideOnSinglePage: true,
    defaultPageSize: PAGE_SIZE,
    defaultCurrent: 1,
    total: (audioList === null || audioList === void 0 ? void 0 : audioList.length) || 0
  })))));
};
// EXTERNAL MODULE: ./src/client/modules/tools/index.ts
var tools = __webpack_require__(32698);
;// CONCATENATED MODULE: ./src/pages/favorite/actions.ts



const getUserFavAssets = async (musicId, pageSize = 200) => {
  const data = {
    getHomepageTabList: (0,asset_api/* getPlaylistFavInfo */.$H)({
      uin: `${musicId}`
    }),
    getCollectAlbumList: (0,asset_api/* getCollectAlbumList */.Ee)({
      uin: `${musicId}`
    }),
    getCollectAudioList: (0,asset_api/* getCollectAudioList */.Am)({
      userid: `${musicId}`,
      fav_type: 1,
      pic_size: 300
    }),
    getCollectSongList: (0,asset_api/* getCollectSongList */.ng)({
      uin: `${musicId}`,
      dirid: 201,
      bPaged: true,
      offset: 0,
      size: pageSize
    }),
    getMyFavMV: (0,asset_api/* getMyFavMV */.kk)({
      uin: `${musicId}`,
      support: 0,
      num: 1,
      pagesize: pageSize
    })
  };
  const res = await (0,network/* ufetch */.D)(data);
  const resObj = {};

  if (res.code === 0) {
    const {
      getCollectSongList,
      getCollectAlbumList,
      getMyFavMV,
      getCollectAudioList
    } = res;

    if (getCollectSongList.code === 0 && getCollectSongList.data) {
      const {
        list = [],
        hasmore = false,
        total = 0
      } = getCollectSongList.data;
      resObj.collectSongListInfo = {
        list: list.map(item => {
          const _ = { ...item
          };
          _.like = true;
          return (0,tools/* formatSongItemData */.cv)(_);
        }),
        hasMore: hasmore,
        total
      };
    }

    if (getCollectAlbumList.code === 0 && getCollectAlbumList.data) {
      resObj.collectAlbumList = getCollectAlbumList.data.v_list.map(item => {
        return { ...item,
          subtitle: (item.v_singer || []).map(singer => singer.name).join('&') || ''
        };
      });
    }

    if (getCollectAudioList.code === 0 && getCollectAudioList.data) {
      resObj.collectAudioList = getCollectAudioList.data.vec_favor.map(item => {
        const _ = { ...item
        };
        _.subtitle = (item.vec_singer || []).map(singer => singer.name).join('&');
        return _;
      });
    }

    if (getMyFavMV.code === 0 && getMyFavMV.data) {
      var _getMyFavMV$data, _getMyFavMV$data2, _getMyFavMV$data3;

      resObj.collectMvInfo = {
        total: ((_getMyFavMV$data = getMyFavMV.data) === null || _getMyFavMV$data === void 0 ? void 0 : _getMyFavMV$data.total) || 0,
        list: (_getMyFavMV$data2 = getMyFavMV.data) === null || _getMyFavMV$data2 === void 0 ? void 0 : _getMyFavMV$data2.mvlist,
        hasMore: ((_getMyFavMV$data3 = getMyFavMV.data) === null || _getMyFavMV$data3 === void 0 ? void 0 : _getMyFavMV$data3.hasmore) === 1
      };
    }
  }

  return resObj;
};
// EXTERNAL MODULE: ./src/pages/favorite/style/index.less
var style = __webpack_require__(33328);
// EXTERNAL MODULE: ./node_modules/tone/build/esm/index.js + 419 modules
var esm = __webpack_require__(71795);
// EXTERNAL MODULE: ./src/component/playlist/index.tsx
var playlist = __webpack_require__(22865);
// EXTERNAL MODULE: ./src/client/modules/tools/common_action.ts
var common_action = __webpack_require__(53554);
// EXTERNAL MODULE: ./src/client/modules/players/index.ts + 2 modules
var players = __webpack_require__(35229);
;// CONCATENATED MODULE: ./src/pages/favorite/playlist/index.tsx









const player = players/* default.getInstance */.Z.getInstance();

const PlayListContainer = ({
  playList,
  searchMode = false
}) => {
  const PAGE_SIZE = 30;
  const [currentPage, setCurrentPage] = (0,react.useState)(1);
  const pageRef = /*#__PURE__*/react.createRef();

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const _selfFavPlayList = (playList === null || playList === void 0 ? void 0 : playList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(tools/* formatSelfFavPlayListItem */.Rk)) || [];

  const handlePlay = item => {
    (0,assets/* getSongListDetailOfPlayList */.Vj)(item.id).then(res => {
      if (res.length > 0) {
        player.playAll({
          songList: (0,common_action/* formatSongsAndMarkLike */.L)(res),
          index: 0
        });
      } else {
        popup/* default.show */.Z.show(0, '该歌单中没有歌曲');
      }
    });
  };

  const handleDelete = item => {
    if (item !== null && item !== void 0 && item.id) {
      (0,assets/* deleteSelfFavPlayList */.dN)([item.id]).then(() => {
        popup/* default.show */.Z.show(1, '删除成功');
        (0,assets/* refreshFavPlayList */.EK)();
      }).catch(() => {
        popup/* default.show */.Z.show(0, '删除失败');
      });
    }
  };

  return /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont__wrapper",
    ref: pageRef
  }, /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont"
  }, !searchMode && (playList === null || playList === void 0 ? void 0 : playList.length) === 0 && /*#__PURE__*/react.createElement(NoFav/* default */.Z, {
    title: "\u6CA1\u6709\u6536\u85CF\u7684\u6B4C\u5355"
  }), (playList === null || playList === void 0 ? void 0 : playList.length) > 0 && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(playlist/* default */.Z, {
    className: "mod_adapter_4-6",
    config: {
      imgEaseInAndOut: !searchMode
    },
    wrapper: pageRef,
    list: _selfFavPlayList,
    onDelete: handleDelete,
    onPlay: handlePlay
  }), /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont__pagination"
  }, /*#__PURE__*/react.createElement(pagination/* default */.Z, {
    showSizeChanger: false,
    current: currentPage,
    onChange: handlePageChange,
    hideOnSinglePage: true,
    defaultPageSize: PAGE_SIZE,
    defaultCurrent: 1,
    total: (playList === null || playList === void 0 ? void 0 : playList.length) || 0
  })))));
};

/* harmony default export */ const favorite_playlist = (PlayListContainer);
;// CONCATENATED MODULE: ./src/pages/favorite/types/index.ts
let TAB_KEY;

(function (TAB_KEY) {
  TAB_KEY["SONGS"] = "songs";
  TAB_KEY["PLAY_LIST"] = "play_list";
  TAB_KEY["ALBUMS"] = "albums";
  TAB_KEY["AUDIO"] = "audio";
  TAB_KEY["VIDEO"] = "video";
})(TAB_KEY || (TAB_KEY = {}));
// EXTERNAL MODULE: ./src/lib/components/lazy_img/index.tsx
var lazy_img = __webpack_require__(30483);
// EXTERNAL MODULE: ./src/lib/common/utils.ts
var utils = __webpack_require__(31603);
// EXTERNAL MODULE: ./src/lib/common/jump.ts
var jump = __webpack_require__(54128);
;// CONCATENATED MODULE: ./src/component/mv_list/index.tsx




const DEFAULT_IMG = `${location.protocol}//y.qq.com/mediastyle/global/img/mv_300.png?max_age=2592000`;

const MvItem = props => {
  const {
    content,
    config,
    wrapper,
    onPlay = null,
    onDelete = null
  } = props;
  const [isImgOnHover, setIsImgOnHover] = (0,react.useState)(false);

  const handleMvItemClick = () => {
    onPlay && onPlay(content);
  };

  const toDeleteItem = () => {
    onDelete && onDelete(content);
  };

  const handleSingerNameClick = mid => {
    if (mid) {
      (0,jump/* default */.Z)(jump/* PAGE_TYPE.SINGER */.G.SINGER, {
        mid
      });
    }
  };

  const renderListen = () => {
    const listenUpdate = '刚刚更新';
    const playcnt = content.playcnt >= 10000 ? `${(content.playcnt / 10000).toFixed(1)}万` : content.playcnt || '刚刚更新';

    if (playcnt === listenUpdate) {
      return /*#__PURE__*/react.createElement("span", {
        className: "mv_list__listen"
      }, listenUpdate);
    } else {
      return /*#__PURE__*/react.createElement("span", {
        className: "mv_list__listen mod_btn_icon"
      }, playcnt);
    }
  };

  const renderName = () => {
    return /*#__PURE__*/react.createElement("h3", {
      className: `mv_list__name ${config.delete ? 'delete' : ''}`
    }, /*#__PURE__*/react.createElement("a", {
      title: content.name,
      className: "mv_list__title",
      style: {
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      },
      onClick: handleMvItemClick
    }, content.name), config.delete && /*#__PURE__*/react.createElement("a", {
      title: "\u5220\u9664",
      className: "mv_list__icon_delete icon_skin c_tx_thin",
      onClick: toDeleteItem
    }));
  };

  const renderUser = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "mv_list__info c_tx_thin"
    }, (content === null || content === void 0 ? void 0 : content.singers) && /*#__PURE__*/react.createElement(react.Fragment, null, utils/* default.isArray */.ZP.isArray(content.singers) && content.singers.map((item, i) => {
      return /*#__PURE__*/react.createElement(react.Fragment, {
        key: `mvitem_${i}`
      }, /*#__PURE__*/react.createElement("a", {
        className: "c_tx_thin",
        onClick: () => handleSingerNameClick(item === null || item === void 0 ? void 0 : item.mid)
      }, item.name), i === content.singers.length - 1 ? '' : ' / ');
    })));
  };

  const img = content && content.picurl ? utils/* default.fixUrl */.ZP.fixUrl(content.picurl) : DEFAULT_IMG;
  return /*#__PURE__*/react.createElement("li", {
    className: "mv_list__item adapter__item"
  }, /*#__PURE__*/react.createElement("a", {
    className: "mv_list__link mod_play_cover",
    onClick: handleMvItemClick
  }, /*#__PURE__*/react.createElement(lazy_img/* default */.Z, {
    container: wrapper,
    className: "mv_list__pic",
    origin: img,
    defaultimg: DEFAULT_IMG,
    easeInOut: config.imgEaseInAndOut
  }), /*#__PURE__*/react.createElement("i", {
    className: `play_cover__btn ${isImgOnHover ? 'c_bg_skin_linear' : ''}`,
    onMouseOver: () => setIsImgOnHover(true),
    onMouseLeave: () => setIsImgOnHover(false)
  }, "\u64AD\u653E"), config.listen && renderListen()), config.name && renderName(), config.user && renderUser());
};

const DEFAULT_CONFIG = {
  listen: true,
  name: true,
  user: true,
  delete: true,
  imgEaseInAndOut: true
};
class MvList extends react.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      className = '',
      list = [],
      config = {},
      wrapper,
      onDelete = null,
      onPlay = null
    } = this.props;
    const _config = { ...DEFAULT_CONFIG,
      ...config
    };
    return /*#__PURE__*/react.createElement("ul", {
      className: `mod_mv_list ${className}`
    }, list.length > 0 && list.map((item, index) => /*#__PURE__*/react.createElement(MvItem, {
      key: `${item === null || item === void 0 ? void 0 : item.id}_${index}`,
      wrapper: wrapper,
      content: item,
      config: _config,
      onPlay: onPlay,
      onDelete: onDelete
    })));
  }

}
// EXTERNAL MODULE: ./src/client/index.tsx
var client = __webpack_require__(21209);
// EXTERNAL MODULE: ./src/lib/common/dialog.tsx
var dialog = __webpack_require__(7273);
;// CONCATENATED MODULE: ./src/pages/favorite/mv_list/index.tsx











const likeSongs = (0,stook_esm/* getState */.y0)('FavoriteSingleSongs') || [];
const likeSet = new Set();
likeSongs.forEach(item => likeSet.add(`${item.songId}`));

const MvListContainer = ({
  mvList,
  searchMode = false
}) => {
  const PAGE_SIZE = 20;
  const [currentPage, setCurrentPage] = (0,react.useState)(1);
  const pageRef = /*#__PURE__*/react.createRef();

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const _selfFavMvList = (mvList === null || mvList === void 0 ? void 0 : mvList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(tools/* formatSelfFavMvListItem */.Pg)) || [];

  const handlePlay = item => {
    if (item !== null && item !== void 0 && item.mid) {
      client/* default.playMV */.Z.playMV({
        vid: (item === null || item === void 0 ? void 0 : item.vid) || ''
      });
    }
  };

  const handleDelete = item => {
    if (item !== null && item !== void 0 && item.id) {
      dialog/* default.show */.ZP.show({
        mode: 'common',
        title: 'QQ音乐',
        icon_type: 1,
        sub_title: '确定要取消收藏该视频？',
        button_info1: {
          highlight: 1,
          title: '确定',
          fn: () => {
            (0,assets/* deleteFavMv */.VA)([item.vid], `${login/* default.musicId */.Z.musicId}`).then(res => {
              if (res) {
                popup/* default.show */.Z.show(1, '删除成功');
              } else {
                popup/* default.show */.Z.show(0, '删除失败');
              }
            }).catch(() => {
              popup/* default.show */.Z.show(0, '删除失败');
            });
            dialog/* default.hide */.ZP.hide();
          }
        },
        button_info2: {
          highlight: 0,
          title: '取消',
          fn: () => {
            dialog/* default.hide */.ZP.hide();
          }
        }
      });
    }
  };

  return /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont__wrapper",
    ref: pageRef
  }, /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont"
  }, !searchMode && (mvList === null || mvList === void 0 ? void 0 : mvList.length) === 0 && /*#__PURE__*/react.createElement(NoFav/* default */.Z, {
    title: "\u6CA1\u6709\u6536\u85CF\u7684\u4E13\u8F91"
  }), (mvList === null || mvList === void 0 ? void 0 : mvList.length) > 0 && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(MvList, {
    className: "mod_adapter_3-5",
    config: {
      imgEaseInAndOut: !searchMode
    },
    wrapper: pageRef,
    list: _selfFavMvList,
    onDelete: handleDelete,
    onPlay: handlePlay
  }), /*#__PURE__*/react.createElement("div", {
    className: "fav_album__cont__pagination"
  }, /*#__PURE__*/react.createElement(pagination/* default */.Z, {
    showSizeChanger: false,
    current: currentPage,
    onChange: handlePageChange,
    hideOnSinglePage: true,
    defaultPageSize: PAGE_SIZE,
    defaultCurrent: 1,
    total: (mvList === null || mvList === void 0 ? void 0 : mvList.length) || 0
  })))));
};

/* harmony default export */ const mv_list = (MvListContainer);
// EXTERNAL MODULE: ./src/hooks/playing_info.ts
var playing_info = __webpack_require__(84376);
// EXTERNAL MODULE: ./src/component/scroll_button/index.tsx
var scroll_button = __webpack_require__(32659);
// EXTERNAL MODULE: ./src/component/loading/qqmusic_loading.tsx
var qqmusic_loading = __webpack_require__(4694);
;// CONCATENATED MODULE: ./src/pages/favorite/index.tsx



















const TabItems = [{
  key: TAB_KEY.SONGS,
  text: '歌曲'
}, {
  key: TAB_KEY.PLAY_LIST,
  text: '歌单'
}, {
  key: TAB_KEY.ALBUMS,
  text: '专辑'
}, {
  key: TAB_KEY.AUDIO,
  text: '主播电台'
}];
const ProfileSongListConfig = {
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
  isPlayAll: true,
  isVirtualize: true
};
const cacheData = {
  [TAB_KEY.SONGS]: [],
  [TAB_KEY.ALBUMS]: [],
  [TAB_KEY.AUDIO]: []
}; // 【我喜欢】目前歌曲容量取10000，视频取1000

const USER_MAX_FAV_SONGS_NUMBER_TO_SHOW = 10000;
const USER_MAX_FAV_MV_NUMBER_TO_SHOW = 1000;
const PAGE_SIZE = 200;

const Profile = () => {
  let isOnComposition = false;
  const mainContentWrapper = /*#__PURE__*/react.createRef();
  const [currentTab, setTab] = (0,react.useState)(TAB_KEY.SONGS);
  const [collectSingleSongs, setCollectSingleSongs] = (0,stook_esm/* useStore */.oR)('CollectSingleSongs', []);
  const [collectAlbumList, setCollectAlbumList] = (0,stook_esm/* useStore */.oR)('collectAlbumList', []);
  const [selfFavPlayList] = (0,stook_esm/* useStore */.oR)('SelfFavPlayList', []);
  const [selfFavMvList, setSelfFavMvList] = (0,stook_esm/* useStore */.oR)('SelfFavMvList', []);
  const [collectAudioList, setCollectAudioList] = (0,stook_esm/* useStore */.oR)('collectAudioList', []);
  const [onLoading, setLoading] = (0,react.useState)(false);
  const [showSearchInput, setShowSearchInput] = (0,react.useState)(false); // 批量操作

  const [uin] = (0,stook_esm/* useStore */.oR)('uin', null);
  const [searchText, setSearchText] = (0,react.useState)('');
  const songListRef = (0,react.useRef)();
  const [needToShowFocusBtn, needToShowToTopBtn, focusOnCurrentSong, scrollToTop, handleRowRenderer] = (0,playing_info/* useSongIsInView */.b)(collectSingleSongs, songListRef);
  const needToShowSearchActionBtn = (0,react.useMemo)(() => {
    var _TAB_KEY$SONGS$TAB_KE;

    return ((_TAB_KEY$SONGS$TAB_KE = {
      [TAB_KEY.SONGS]: collectSingleSongs,
      [TAB_KEY.VIDEO]: selfFavMvList,
      [TAB_KEY.PLAY_LIST]: selfFavPlayList,
      [TAB_KEY.ALBUMS]: collectAlbumList,
      [TAB_KEY.AUDIO]: collectAudioList
    }[currentTab]) === null || _TAB_KEY$SONGS$TAB_KE === void 0 ? void 0 : _TAB_KEY$SONGS$TAB_KE.length) !== 0;
  }, [currentTab, collectSingleSongs, selfFavPlayList, collectAlbumList, collectAudioList, selfFavMvList]); // 设置不同tab对应的过滤

  const filterConfig = (0,react.useMemo)(() => ({
    [TAB_KEY.SONGS]: {
      filterFn: (data, key) => {
        var _data$track, _data$track2, _data$albumname;

        const singerInfo = (data === null || data === void 0 ? void 0 : (_data$track = data.track) === null || _data$track === void 0 ? void 0 : _data$track.singer) || (data === null || data === void 0 ? void 0 : data.singer) || [];
        const name = (data === null || data === void 0 ? void 0 : data.name) || (data === null || data === void 0 ? void 0 : (_data$track2 = data.track) === null || _data$track2 === void 0 ? void 0 : _data$track2.name) || '';
        const matched = singerInfo.some(singer => {
          var _singer$name;

          return singer === null || singer === void 0 ? void 0 : (_singer$name = singer.name) === null || _singer$name === void 0 ? void 0 : _singer$name.includes(key);
        });
        return name.includes(key) || (data === null || data === void 0 ? void 0 : (_data$albumname = data.albumname) === null || _data$albumname === void 0 ? void 0 : _data$albumname.includes(key)) || matched;
      }
    },
    [TAB_KEY.ALBUMS]: {
      filterFn: (data, key) => {
        const {
          v_singer = [],
          name,
          subtitle
        } = data;
        const matched = v_singer.some(singer => singer.name.includes(key));
        return name.includes(key) || subtitle.includes(key) || matched;
      }
    },
    [TAB_KEY.PLAY_LIST]: {
      filterFn: (data, key) => {
        var _data$name, _data$nickname;

        return (data === null || data === void 0 ? void 0 : (_data$name = data.name) === null || _data$name === void 0 ? void 0 : _data$name.includes(key)) || (data === null || data === void 0 ? void 0 : (_data$nickname = data.nickname) === null || _data$nickname === void 0 ? void 0 : _data$nickname.includes(key));
      }
    },
    [TAB_KEY.VIDEO]: {
      filterFn: (data, key) => {
        var _data$mv_name;

        const singerInfo = (data === null || data === void 0 ? void 0 : data.singer) || [];
        return (data === null || data === void 0 ? void 0 : (_data$mv_name = data.mv_name) === null || _data$mv_name === void 0 ? void 0 : _data$mv_name.includes(key)) || singerInfo.some(singer => {
          var _singer$name2;

          return singer === null || singer === void 0 ? void 0 : (_singer$name2 = singer.name) === null || _singer$name2 === void 0 ? void 0 : _singer$name2.includes(key);
        });
      }
    },
    [TAB_KEY.AUDIO]: {
      filterFn: (data, key) => {
        const {
          vec_singer = [],
          title,
          subtitle
        } = data;
        const matched = vec_singer.some(singer => singer.name.includes(key));
        return title.includes(key) || subtitle.includes(key) || matched;
      }
    }
  }), []);
  (0,react.useEffect)(() => {
    getInitData();
  }, [uin]);
  (0,react.useEffect)(() => {
    getInitData();
  }, []);
  /**
   * 拉取我喜欢歌单同其他歌单，需要分批次拉取
   * 201这个dirId代表【我喜欢】歌单
   */

  const getInitData = () => {
    if (login/* default.musicId */.Z.musicId) {
      setLoading(true);
      getUserFavAssets(login/* default.musicId */.Z.musicId, PAGE_SIZE).then(({
        collectSongListInfo,
        collectAlbumList: albumList,
        collectMvInfo,
        collectAudioList: audioList
      }) => {
        setCollectSingleSongs((collectSongListInfo === null || collectSongListInfo === void 0 ? void 0 : collectSongListInfo.list) || []);
        setCollectAlbumList(albumList);
        setCollectAudioList(audioList);
        cacheData[TAB_KEY.ALBUMS] = albumList;
        cacheData[TAB_KEY.AUDIO] = audioList;
        setLoading(false);

        if (collectSongListInfo.hasMore) {
          const _total = collectSongListInfo.total < USER_MAX_FAV_SONGS_NUMBER_TO_SHOW ? collectSongListInfo.total : USER_MAX_FAV_SONGS_NUMBER_TO_SHOW;

          setCollectSingleSongs(collectSongListInfo.list.concat(new Array(_total - PAGE_SIZE).fill(null)));
          (0,assets/* getSongListInBatch */.sA)(201, `${login/* default.musicId */.Z.musicId}`, _total, PAGE_SIZE, PAGE_SIZE, (collectSongListInfo === null || collectSongListInfo === void 0 ? void 0 : collectSongListInfo.list) || []).then(_totalList => {
            if ((0,esm/* isArray */.kJ)(_totalList)) {
              setLoading(false);
              const formattedList = (0,common_action/* formatSongsAndMarkLike */.L)(_totalList, {
                force: true,
                isLike: true
              });
              setCollectSingleSongs(formattedList);
              cacheData[TAB_KEY.SONGS] = formattedList;
            }
          });
        } else {
          setCollectSingleSongs((collectSongListInfo === null || collectSongListInfo === void 0 ? void 0 : collectSongListInfo.list) || []);
          setLoading(false);
          cacheData[TAB_KEY.SONGS] = (collectSongListInfo === null || collectSongListInfo === void 0 ? void 0 : collectSongListInfo.list) || [];
        }

        if (collectMvInfo.hasMore) {
          const _total = collectMvInfo.total < USER_MAX_FAV_MV_NUMBER_TO_SHOW ? collectMvInfo.total : USER_MAX_FAV_MV_NUMBER_TO_SHOW;

          (0,assets/* getMvListInBatch */.lk)(login/* default.musicId */.Z.musicId, _total, PAGE_SIZE, PAGE_SIZE, collectMvInfo.list).then(_totalList => {
            if ((0,esm/* isArray */.kJ)(_totalList)) {
              setSelfFavMvList(_totalList);
              setLoading(false);
            }
          });
        } else {
          setSelfFavMvList(collectMvInfo.list);
        }
      }).catch(() => {
        popup/* default.show */.Z.show(1, '获取用户资产失败，请稍后重试');
      });
    }
  };

  const handleTabSelect = key => {
    setTab(key);
  };
  /**
   * 展示搜索输入框
   */


  const toShowSearchInput = value => {
    setShowSearchInput(value);

    if (value === false) {
      setSearchText(null);
    }
  };

  const filter = (data, searchText) => {
    if (searchText === '' || searchText === null) {
      return data;
    } else {
      const {
        filterFn
      } = filterConfig[currentTab];
      isOnComposition = false;
      return data.filter(item => filterFn(item, searchText));
    }
  };

  const handleInputChange = ev => {
    const target = ev.target;

    if (target !== null && target !== void 0 && target.value) {
      if (!isOnComposition) {
        setSearchText(target.value);
      }
    } else if (!isOnComposition) {
      setSearchText(null);
    }
  }; // 该函数主要处理中文输入法与输入框同步的问题


  const handleComposition = ev => {
    var _ev$target;

    isOnComposition = ev.type === 'compositionstart' || ev.type === 'compositionupdate';

    if (ev.type === 'compositionend') {
      isOnComposition = false;
    }

    const target = ev.target;

    if (!isOnComposition) {
      setSearchText(target === null || target === void 0 ? void 0 : target.value);
    }

    if (!((_ev$target = ev.target) !== null && _ev$target !== void 0 && _ev$target.value)) {
      setSearchText(null);
    }
  };

  const playAllSongs = () => {
    client/* default.playSong */.Z.playSong({
      songList: collectSingleSongs,
      playIndex: 0
    });
  };

  const renderActionBtn = () => {
    return /*#__PURE__*/react.createElement("div", {
      className: "action__mod"
    }, currentTab === TAB_KEY.SONGS && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
      className: "action__btn play",
      onClick: playAllSongs
    }, /*#__PURE__*/react.createElement("span", {
      className: "action__btn__icon play_all"
    }), "\u64AD\u653E\u5168\u90E8")), needToShowSearchActionBtn && (showSearchInput ? /*#__PURE__*/react.createElement("div", {
      className: `action__btn c_btn search float_right ${showSearchInput ? 'input' : ''}`
    }, /*#__PURE__*/react.createElement("input", {
      autoFocus: true,
      onChange: handleInputChange,
      onCompositionStart: handleComposition,
      onCompositionUpdate: handleComposition,
      onCompositionEnd: handleComposition
    }), /*#__PURE__*/react.createElement("span", {
      className: "action__btn__icon search_close",
      onClick: () => toShowSearchInput(false)
    })) : /*#__PURE__*/react.createElement("div", {
      className: "action__btn search normal float_right c_btn",
      onClick: () => toShowSearchInput(true)
    }, /*#__PURE__*/react.createElement("span", {
      className: "action__btn__icon search"
    }), /*#__PURE__*/react.createElement("span", {
      className: "c_txt1"
    }, "\u641C\u7D22"))));
  };

  const renderMainContent = () => {
    let innerContent;

    switch (currentTab) {
      case TAB_KEY.SONGS:
        innerContent = /*#__PURE__*/react.createElement(song_list/* SongList */.J, {
          ref: songListRef,
          wrapper: mainContentWrapper,
          songList: filter(collectSingleSongs, searchText),
          config: ProfileSongListConfig,
          onRowRenderer: handleRowRenderer
        });
        break;

      case TAB_KEY.ALBUMS:
        innerContent = /*#__PURE__*/react.createElement(AlbumContainer, {
          albumList: filter(collectAlbumList, searchText),
          searchMode: showSearchInput
        });
        break;

      case TAB_KEY.PLAY_LIST:
        innerContent = /*#__PURE__*/react.createElement(favorite_playlist, {
          playList: filter(selfFavPlayList, searchText),
          searchMode: showSearchInput
        });
        break;

      case TAB_KEY.VIDEO:
        innerContent = /*#__PURE__*/react.createElement(mv_list, {
          mvList: filter(selfFavMvList, searchText),
          searchMode: showSearchInput
        });
        break;

      case TAB_KEY.AUDIO:
        innerContent = /*#__PURE__*/react.createElement(AudioContainer, {
          audioList: filter(collectAudioList, searchText),
          searchMode: showSearchInput
        });
        break;
    }

    return /*#__PURE__*/react.createElement("div", {
      className: "fav_main_cont__wrapper",
      ref: mainContentWrapper
    }, innerContent);
  };

  const renderCornerActionBtn = () => {
    return /*#__PURE__*/react.createElement(scroll_button/* default */.Z, {
      config: {
        show: true,
        reload: false
      },
      scrollToTopBtnVisible: needToShowToTopBtn,
      focusBtnVisible: needToShowFocusBtn,
      scrollToSong: focusOnCurrentSong,
      scrollToTopFunc: scrollToTop
    });
  };

  const renderLoadingIcon = () => {
    return /*#__PURE__*/react.createElement(qqmusic_loading/* QQMusicLoading */.Z, {
      className: "fav_main_cont_loading__wrapper"
    });
  };

  if (!login/* default.isLogin */.Z.isLogin()) {
    return /*#__PURE__*/react.createElement("div", {
      className: "fav_cont"
    }, /*#__PURE__*/react.createElement("div", {
      className: "fav_tips"
    }, "\u8BF7\u5148\u767B\u5F55"));
  }

  return /*#__PURE__*/react.createElement("div", {
    className: "my_favorite_page__wrapper"
  }, /*#__PURE__*/react.createElement("div", {
    className: "favorite__header"
  }, /*#__PURE__*/react.createElement("span", {
    className: "favorite__header_title"
  }, "\u6211\u559C\u6B22")), /*#__PURE__*/react.createElement("div", {
    className: "favorite__body"
  }, /*#__PURE__*/react.createElement("nav", {
    className: "mod_tab mod_top_nav"
  }, TabItems.map(item => {
    const {
      key,
      text
    } = item;
    return /*#__PURE__*/react.createElement("a", {
      key: key,
      className: `tab__item c_tx_normal ${currentTab === key ? 'c_tx_current' : ''}`,
      onClick: () => handleTabSelect(key)
    }, /*#__PURE__*/react.createElement("span", {
      className: "tab__label"
    }, text));
  })), !onLoading && renderActionBtn(), onLoading ? renderLoadingIcon() : renderMainContent()), !onLoading && !showSearchInput && currentTab === TAB_KEY.SONGS && renderCornerActionBtn());
};

/* harmony default export */ const favorite = (Profile);

//# sourceURL=webpack://qqmusic/./src/pages/favorite/index.tsx_+_7_modules?