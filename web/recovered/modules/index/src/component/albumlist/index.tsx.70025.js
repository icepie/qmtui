/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ AlbumList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var _src_lib_common_jump__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54128);
/* harmony import */ var _src_lib_components_lazy_img__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(30483);
/* harmony import */ var _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(31603);
/* harmony import */ var _src_lib_network__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(32590);
/* harmony import */ var _src_lib_common_user__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(49399);
/* harmony import */ var _src_lib_components_playlist_index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(17349);
/* harmony import */ var _src_lib_components_playlist_index_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_src_lib_components_playlist_index_css__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _src_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(65972);
/* harmony import */ var _src_client_modules_tools_common_action__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(53554);
/* harmony import */ var _src_client__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(21209);











const AlbumListItem = ({
  config,
  containerRef,
  index,
  content,
  children,
  deleteFun
}) => {
  const toAlbum = (ev, mid) => {
    ev.stopPropagation();

    if (mid) {
      (0,_src_lib_common_jump__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z)(_src_lib_common_jump__WEBPACK_IMPORTED_MODULE_1__/* .PAGE_TYPE.ALBUM */ .G.ALBUM, {
        mid
      });
    }
  };

  const deleteAlbum = mid => {
    if (mid && deleteFun) {
      deleteFun(mid, index);
    }
  };

  const playAlbumContent = async mid => {
    if (mid) {
      try {
        const res = await (0,_src_lib_network__WEBPACK_IMPORTED_MODULE_4__/* .ufetch */ .D)({
          getAlbumSongList: (0,_src_lib_network_asset_api__WEBPACK_IMPORTED_MODULE_7__/* .getAlbumInnerSongList */ .EP)({
            albumMid: mid
          })
        });

        if (res && res.code === 0 && res.getAlbumSongList.data) {
          const songlist = (0,_src_client_modules_tools_common_action__WEBPACK_IMPORTED_MODULE_8__/* .formatSongsAndMarkLike */ .L)(res.getAlbumSongList.data.songList.map(item => item.songInfo));
          _src_client__WEBPACK_IMPORTED_MODULE_9__/* .default.playSong */ .Z.playSong({
            songList: songlist,
            playIndex: 0
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const img = _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_3__/* .default.getImg */ .ZP.getImg(content);
  const cover = !(config !== null && config !== void 0 && config.noplay);
  /**
   * 播放按钮
   */

  const renderPlayIcon = () => {
    if (!(config !== null && config !== void 0 && config.noplay)) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("i", {
        className: "play_cover__btn",
        onMouseOver: e => {
          e.target.classList.add('c_bg_skin_linear');
        },
        onMouseLeave: e => {
          e.target.classList.remove('c_bg_skin_linear');
        },
        onClick: e => {
          e.stopPropagation();
          playAlbumContent(content === null || content === void 0 ? void 0 : content.mid);
        }
      }, "\u64AD\u653E");
    }
  };
  /**
   * 购买价格
   */


  const renderPrice = () => {
    if (config !== null && config !== void 0 && config.price && content !== null && content !== void 0 && content.price) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "playlist__info c_tx_thin"
      }, `¥${(content.price / 100).toFixed(2)}`), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        className: "mod_btn c_btn_line playlist__btn",
        onClick: e => {
          e.stopPropagation();
          _src_lib_common_user__WEBPACK_IMPORTED_MODULE_5__/* .default.buyDigitalAlbum */ .Z.buyDigitalAlbum({
            title: '数字专辑购买',
            albumid: content.id,
            actid: content.actid,
            aid: 'pcsczhigou'
          });
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "btn__txt"
      }, "\u7ACB\u5373\u8D2D\u4E70")));
    }
  };
  /**
   * 专辑名
   */


  const renderName = () => {
    if (config !== null && config !== void 0 && config.name && (content !== null && content !== void 0 && content.name || content !== null && content !== void 0 && content.title)) {
      var _content$name, _content$title, _content$name2, _content$title2;

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", {
        className: `playlist__name ${config.delete ? 'delete' : ''}`
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        onClick: ev => toAlbum(ev, content === null || content === void 0 ? void 0 : content.mid),
        title: (content === null || content === void 0 ? void 0 : (_content$name = content.name) === null || _content$name === void 0 ? void 0 : _content$name.replace(/<[^>]+>/g, '')) || (content === null || content === void 0 ? void 0 : (_content$title = content.title) === null || _content$title === void 0 ? void 0 : _content$title.replace(/<[^>]+>/g, ''))
      }, (content === null || content === void 0 ? void 0 : (_content$name2 = content.name) === null || _content$name2 === void 0 ? void 0 : _content$name2.replace(/<[^>]+>/g, '')) || (content === null || content === void 0 ? void 0 : (_content$title2 = content.title) === null || _content$title2 === void 0 ? void 0 : _content$title2.replace(/<[^>]+>/g, ''))), (config === null || config === void 0 ? void 0 : config.delete) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        title: "\u5220\u9664",
        className: "playlist__icon_delete icon_skin c_tx_thin",
        onClick: e => {
          e.stopPropagation();
          deleteAlbum(content === null || content === void 0 ? void 0 : content.mid);
        }
      }));
    }
  };
  /**
   * 专辑描述
   */


  const renderDesc = () => {
    if (config.desc && content.desc) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "playlist__info"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "c_tx_thin",
        title: content === null || content === void 0 ? void 0 : content.desc
      }, content === null || content === void 0 ? void 0 : content.desc));
    }
  };

  const handleClickSinger = (ev, mid) => {
    ev.stopPropagation();
    (0,_src_lib_common_jump__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z)(_src_lib_common_jump__WEBPACK_IMPORTED_MODULE_1__/* .PAGE_TYPE.SINGER */ .G.SINGER, {
      mid
    });
  };
  /**
   * 歌手名字
   */


  const renderSingerName = () => {
    const singerInfo = (content === null || content === void 0 ? void 0 : content.v_singer) || (content === null || content === void 0 ? void 0 : content.singers) || (content === null || content === void 0 ? void 0 : content.vec_singer);

    if (config !== null && config !== void 0 && config.singer && singerInfo) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "playlist__info"
      }, singerInfo.map((item, idx) => {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
          key: `album_singer__${idx}`
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
          className: "c_tx_thin",
          title: item.name,
          onClick: ev => handleClickSinger(ev, item.mid)
        }, item.name), singerInfo.length - 1 > idx ? ' / ' : '');
      }), !singerInfo && content.subtitle && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        onClick: ev => handleClickSinger(ev, content.mid),
        className: "c_tx_thin",
        title: content.subtitle
      }, content.subtitle));
    }
  };
  /**
   * 发行时间
   */


  const renderTime = () => {
    if (config !== null && config !== void 0 && config.time && content !== null && content !== void 0 && content.release_time) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "playlist__info c_tx_thin"
      }, content.release_time);
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    className: "playlist__item adapter__item"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    onClick: ev => toAlbum(ev, content.mid),
    className: `playlist__link${cover ? ' mod_play_cover' : ''}`
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_src_lib_components_lazy_img__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z, {
    container: containerRef,
    className: "playlist__pic",
    origin: img,
    alt: content.name,
    defaultimg: _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_3__/* .default.albumDefaultImg */ .ZP.albumDefaultImg,
    easeInOut: config === null || config === void 0 ? void 0 : config.imgEaseInAndOut
  }), renderPlayIcon()), renderName(), renderDesc(), renderSingerName(), renderPrice(), renderTime(), children);
};

class AlbumList extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      config,
      content,
      report,
      deleteFun,
      className,
      containerRef
    } = this.props;
    const wrapperCls = className ? `mod_playlist ${className}` : 'mod_playlist';
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", {
      className: wrapperCls
    }, content.map((item, index) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(AlbumListItem, {
      containerRef: containerRef,
      deleteFun: deleteFun,
      key: `albumlist_${index}`,
      index: index,
      config: config,
      content: item,
      report: report
    })));
  }

}

//# sourceURL=webpack://qqmusic/./src/component/albumlist/index.tsx?