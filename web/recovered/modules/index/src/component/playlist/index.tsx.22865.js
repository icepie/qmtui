/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export PlayListMore */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var _src_lib_components_lazy_img__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30483);
/* harmony import */ var _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(31603);
/* harmony import */ var _src_lib_common_jump__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(54128);




const DEFAULT_PLAYLIST_IMG = 'https://y.qq.com/mediastyle/global/img/playlist_300.png';

const PlayListItem = props => {
  const {
    style,
    config,
    container,
    content,
    onDelete = null,
    onPlay = null
  } = props;
  const [isMouseOver, setIsMouseOver] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  const jumpToPlayList = () => {
    if (content !== null && content !== void 0 && content.id) {
      (0,_src_lib_common_jump__WEBPACK_IMPORTED_MODULE_3__/* .default */ .Z)(_src_lib_common_jump__WEBPACK_IMPORTED_MODULE_3__/* .PAGE_TYPE.PLAYLIST */ .G.PLAYLIST, {
        id: content.id
      });
    }
  };

  const handleDelete = ev => {
    ev.stopPropagation();
    onDelete && onDelete(content);
  };

  const handlePlay = ev => {
    ev.stopPropagation();
    onPlay && onPlay(content);
  };

  const renderListen = () => {
    if (content !== null && content !== void 0 && content.listeners) {
      const playCnt = content.listeners >= 10000 ? `${(content.listeners / 10000).toFixed(1)}万` : content.listeners || '刚刚更新';
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "playlist__listen mod_btn_icon"
      }, playCnt);
    }
  };

  const renderName = () => {
    if (content !== null && content !== void 0 && content.title) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", {
        className: `playlist__name ${config !== null && config !== void 0 && config.delete ? 'delete' : ''}`
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        draggable: false,
        title: content.title.replace(/<[^>]+>/g, ''),
        onClick: jumpToPlayList
      }, content.title.replace(/<[^>]+>/g, '')), (config === null || config === void 0 ? void 0 : config.delete) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        draggable: false,
        title: "\u5220\u9664",
        onClick: handleDelete,
        className: "playlist__icon_delete icon_skin c_tx_thin"
      }));
    }
  };

  const renderUser = () => {
    var _content$creator;

    if (content !== null && content !== void 0 && (_content$creator = content.creator) !== null && _content$creator !== void 0 && _content$creator.nick) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "playlist__info"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        draggable: false,
        className: "c_tx_thin",
        title: content.creator.nick,
        onClick: ev => {
          var _content$creator2;

          ev.stopPropagation();
          (0,_src_lib_common_jump__WEBPACK_IMPORTED_MODULE_3__/* .default */ .Z)(_src_lib_common_jump__WEBPACK_IMPORTED_MODULE_3__/* .PAGE_TYPE.PROFILE */ .G.PROFILE, {
            id: (_content$creator2 = content.creator) === null || _content$creator2 === void 0 ? void 0 : _content$creator2.uin
          });
        }
      }, content.creator.nick));
    }
  };

  const renderInfo = () => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "playlist__info"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
      className: "c_tx_thin",
      title: (content === null || content === void 0 ? void 0 : content.info) || (content === null || content === void 0 ? void 0 : content.subtitle)
    }, (content === null || content === void 0 ? void 0 : content.info) || (content === null || content === void 0 ? void 0 : content.subtitle)));
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    style: style,
    className: "playlist__item adapter__item"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    draggable: false,
    className: "playlist__link mod_play_cover ",
    onClick: jumpToPlayList
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_src_lib_components_lazy_img__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z, {
    className: "playlist__pic",
    container: container,
    origin: _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_2__/* .default.fixUrl */ .ZP.fixUrl((content === null || content === void 0 ? void 0 : content.picurl) || DEFAULT_PLAYLIST_IMG),
    easeInOut: config === null || config === void 0 ? void 0 : config.imgEaseInAndOut,
    alt: content === null || content === void 0 ? void 0 : content.title,
    defaultimg: `${location.protocol}//y.qq.com/mediastyle/global/img/playlist_300.png?max_age=2592000`
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("i", {
    className: `play_cover__btn ${isMouseOver ? 'c_bg_skin_linear' : ''}`,
    onMouseOver: () => {
      setIsMouseOver(true);
    },
    onMouseLeave: () => {
      setIsMouseOver(false);
    },
    onClick: handlePlay
  }, "\u64AD\u653E"), (config === null || config === void 0 ? void 0 : config.listen) && renderListen()), (config === null || config === void 0 ? void 0 : config.name) && renderName(), (config === null || config === void 0 ? void 0 : config.user) && renderUser(), (config === null || config === void 0 ? void 0 : config.info) && renderInfo());
};

const DEFAULT_CONFIG = {
  user: true,
  name: true,
  delete: true,
  info: true,
  listen: true,
  imgEaseInAndOut: true
};

const PlayList = props => {
  const {
    wrapper = null,
    list,
    config,
    className,
    onPlay = null,
    onDelete = null
  } = props;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", {
    className: `mod_playlist ${className}`
  }, list && list.map((item, index) => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(PlayListItem, {
      key: `${item === null || item === void 0 ? void 0 : item.dirid}_${index}`,
      content: item,
      config: { ...config,
        ...DEFAULT_CONFIG
      },
      container: wrapper,
      onDelete: onDelete,
      onPlay: onPlay
    });
  }));
};

const PlayListMore = ({
  children,
  className = ''
}) => /*#__PURE__*/React.createElement("div", {
  className: `mod_playlist_box ${className}`
}, children);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PlayList);

//# sourceURL=webpack://qqmusic/./src/component/playlist/index.tsx?