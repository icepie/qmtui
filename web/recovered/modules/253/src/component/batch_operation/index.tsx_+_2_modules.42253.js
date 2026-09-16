// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ component_batch_operation)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
// EXTERNAL MODULE: ./src/lib/common/utils.ts
var utils = __webpack_require__(31603);
// EXTERNAL MODULE: ./src/component/batch_operation/type/index.ts
var type = __webpack_require__(16852);
// EXTERNAL MODULE: ./src/component/batch_operation/index.less
var batch_operation = __webpack_require__(55865);
// EXTERNAL MODULE: ./src/lib/components/button/index.tsx
var components_button = __webpack_require__(32393);
// EXTERNAL MODULE: ./src/component/loading/qqmusic_loading.tsx
var qqmusic_loading = __webpack_require__(4694);
// EXTERNAL MODULE: ./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js + 1 modules
var react_sortable_hoc_esm = __webpack_require__(64140);
// EXTERNAL MODULE: ./src/component/song_list/index.tsx + 1 modules
var song_list = __webpack_require__(57224);
// EXTERNAL MODULE: ./node_modules/react-virtualized/dist/es/index.js + 69 modules
var es = __webpack_require__(80376);
// EXTERNAL MODULE: ./src/lib/common/popup.tsx
var popup = __webpack_require__(43053);
;// CONCATENATED MODULE: ./src/hooks/common.ts


const useWrapperResizeEffect = wrapper => {
  const [wrapperSize, setWrapperSize] = (0,react.useState)({
    width: 0,
    height: 0
  });
  const [hasBindResizeEvent, setHasBindResizeEvent] = (0,react.useState)(false);
  (0,react.useEffect)(() => {
    if (!hasBindResizeEvent && wrapper && wrapper.current) {
      setWrapperSize({
        width: wrapper.current.clientWidth,
        height: wrapper.current.clientHeight
      });
      wrapper.current.addEventListener('resize', handleWrapperResize);
      window.addEventListener('resize', handleWrapperResize);
      setHasBindResizeEvent(true);
    }
  }, [wrapper.current]);
  (0,react.useEffect)(() => {
    handleWrapperResize();
    return () => {
      var _popup$singerPropUpRe, _popup$singerPropUpRe2;

      window.removeEventListener('resize', handleWrapperResize);
      popup/* default */.Z === null || popup/* default */.Z === void 0 ? void 0 : (_popup$singerPropUpRe = popup/* default.singerPropUpRef */.Z.singerPropUpRef) === null || _popup$singerPropUpRe === void 0 ? void 0 : (_popup$singerPropUpRe2 = _popup$singerPropUpRe.current) === null || _popup$singerPropUpRe2 === void 0 ? void 0 : _popup$singerPropUpRe2.hide();
    };
  }, []);

  const handleWrapperResize = () => {
    if (wrapper !== null && wrapper !== void 0 && wrapper.current) {
      setWrapperSize({
        width: wrapper.current.clientWidth,
        height: wrapper.current.clientHeight
      });
    }
  };

  return [wrapperSize];
};
const useIsDark = () => {
  const [theme, setTheme] = useState(false);

  const themeDetect = ev => {
    if (ev.matches) {
      setTheme(true);
    } else {
      setTheme(false);
    }
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(media.matches);
    media.addEventListener('change', themeDetect);
    return () => {
      media.removeEventListener('change', themeDetect);
    };
  }, []);
  return theme;
};
// EXTERNAL MODULE: ./src/component/context_menu/index.tsx
var context_menu = __webpack_require__(77365);
// EXTERNAL MODULE: ./src/hooks/playlist.ts + 1 modules
var playlist = __webpack_require__(27076);
;// CONCATENATED MODULE: ./src/component/batch_operation/component/songlist_batch.tsx








const PlayListBatch = /*#__PURE__*/react.forwardRef((props, ref) => {
  const [isLoading, playListDetail, {
    playSelectedItem,
    deleteSelectedItem,
    handleSwitchCheckState,
    seqPlayListSongList,
    selectedSongs,
    updatePlayListDetail
  }] = (0,playlist/* usePlayListInfo */.I)({
    dissId: `${props.dissId}`,
    isSelfCreate: true,
    isCollect: false
  });
  (0,react.useImperativeHandle)(ref, () => ({
    playSelectedItem,
    deleteSelectedItem,
    invokeAddToMenu
  }));

  const invokeAddToMenu = ev => {
    (0,context_menu/* showPlayListMenu */.q)(ev, selectedSongs[0], selectedSongs, false, dirid => {
      updatePlayListDetail(dirid);
    });
  };

  (0,react.useEffect)(() => {
    var _props$onCheckedOptio;

    props === null || props === void 0 ? void 0 : (_props$onCheckedOptio = props.onCheckedOptionsChange) === null || _props$onCheckedOptio === void 0 ? void 0 : _props$onCheckedOptio.call(props, selectedSongs.length);
  }, [selectedSongs.length]);

  if (isLoading) {
    return /*#__PURE__*/react.createElement(qqmusic_loading/* QQMusicLoading */.Z, null);
  }

  const handleSortEnd = ({
    oldIndex,
    newIndex
  }) => {
    seqPlayListSongList(oldIndex, newIndex);
  };

  return /*#__PURE__*/react.createElement(SortableList, {
    wrapperRef: props.wrapperRef,
    itemList: playListDetail.songlist,
    onSortEnd: handleSortEnd,
    onSwitchCheckState: handleSwitchCheckState
  });
});
const SortableList = (0,react_sortable_hoc_esm/* SortableContainer */.JN)(props => {
  const {
    itemList = [],
    onSwitchCheckState = null,
    wrapperRef
  } = props;
  const virtualListRef = react.useRef();
  const [wrapperSize] = useWrapperResizeEffect(wrapperRef);
  return /*#__PURE__*/react.createElement(es/* List */.aV, {
    ref: virtualListRef,
    scrollToAlignment: 'center',
    rowCount: itemList.length,
    rowHeight: 50,
    autoWidth: true,
    width: wrapperSize.width,
    height: wrapperSize.height,
    rowRenderer: ({
      key,
      index,
      style
    }) => {
      const item = itemList[index];

      if (item) {
        return /*#__PURE__*/react.createElement("div", {
          style: style,
          key: key
        }, /*#__PURE__*/react.createElement(SortableItem, {
          index: index,
          dataIndex: index,
          value: item,
          onSwitchCheckState: onSwitchCheckState
        }));
      }
    }
  });
});
const SortableItem = (0,react_sortable_hoc_esm/* SortableElement */.W8)(props => {
  return /*#__PURE__*/react.createElement(song_list/* SongListItem */.F, {
    songInfo: props === null || props === void 0 ? void 0 : props.value,
    songOnSelected: [],
    index: props.dataIndex,
    onSwitchCheckState: props.onSwitchCheckState,
    config: {
      // 是否展示头部
      header: false,
      // 是否展示排序
      sort: true,
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
      isPlayAll: false,
      isVirtualize: false,
      drag: false
    }
  });
});
/* harmony default export */ const songlist_batch = (PlayListBatch);
// EXTERNAL MODULE: ./src/lib/common/history.ts
var common_history = __webpack_require__(1642);
// EXTERNAL MODULE: ./src/component/animation/index.tsx + 1 modules
var animation = __webpack_require__(23899);
;// CONCATENATED MODULE: ./src/component/batch_operation/index.tsx









const BatchOperation = ({
  location
}) => {
  const [operationData, setOperationData] = (0,react.useState)({
    type: type/* OPERATION_TYPE.PLAYLIST */.f.PLAYLIST,
    data: null
  });
  const [checkedNum, setCheckedNum] = (0,react.useState)(0);
  const wrapperRef = /*#__PURE__*/react.createRef();
  const playListBatchComponentRef = react.useRef();
  (0,react.useEffect)(() => {
    getUrlParams();
  }, [location.search]);

  const getUrlParams = () => {
    const pageType = utils/* default.getParam */.ZP.getParam('type', location.search);

    if (pageType) {
      switch (pageType) {
        case type/* OPERATION_TYPE.PLAYLIST */.f.PLAYLIST:
          setOperationData({
            type: type/* OPERATION_TYPE.PLAYLIST */.f.PLAYLIST,
            data: {
              dissId: parseInt(utils/* default.getParam */.ZP.getParam('dissId', location.search), 10)
            }
          });
          break;
      }
    }
  };

  const renderContent = () => {
    var _operationData$data;

    switch (operationData.type) {
      case type/* OPERATION_TYPE.PLAYLIST */.f.PLAYLIST:
        return ((_operationData$data = operationData.data) === null || _operationData$data === void 0 ? void 0 : _operationData$data.dissId) && /*#__PURE__*/react.createElement(songlist_batch, {
          ref: playListBatchComponentRef,
          wrapperRef: wrapperRef,
          dissId: operationData.data.dissId,
          onCheckedOptionsChange: handleCheckedOptionsChange
        });

      default:
        return null;
    }
  };

  const handleCheckedOptionsChange = val => {
    setCheckedNum(val);
  };

  const handlePlayAll = () => {
    var _playListBatchCompone;

    playListBatchComponentRef === null || playListBatchComponentRef === void 0 ? void 0 : (_playListBatchCompone = playListBatchComponentRef.current) === null || _playListBatchCompone === void 0 ? void 0 : _playListBatchCompone.playSelectedItem();
  };

  const handleDelete = () => {
    var _playListBatchCompone2;

    playListBatchComponentRef === null || playListBatchComponentRef === void 0 ? void 0 : (_playListBatchCompone2 = playListBatchComponentRef.current) === null || _playListBatchCompone2 === void 0 ? void 0 : _playListBatchCompone2.deleteSelectedItem();
  };

  const handleAdd = ev => {
    var _playListBatchCompone3;

    playListBatchComponentRef === null || playListBatchComponentRef === void 0 ? void 0 : (_playListBatchCompone3 = playListBatchComponentRef.current) === null || _playListBatchCompone3 === void 0 ? void 0 : _playListBatchCompone3.invokeAddToMenu(ev);
  };

  const handleQuit = () => {
    common_history/* default.goBack */.Z.goBack();
  };

  const disabled = checkedNum === 0;
  const disabledStyle = checkedNum === 0 ? {
    opacity: 0.6
  } : {};
  return /*#__PURE__*/react.createElement(animation/* EaseInWrapper */.W, {
    className: "column_flex"
  }, /*#__PURE__*/react.createElement("div", {
    className: "column_flex batch_operation__mod"
  }, /*#__PURE__*/react.createElement("div", {
    className: "batch_operation_header__mod"
  }, /*#__PURE__*/react.createElement(components_button/* default */.Z, {
    disabled: disabled,
    clickFun: handlePlayAll,
    style: {
      verticalAlign: 'top'
    },
    config: {
      highlight: true,
      stroke: true,
      type: 'play',
      text: '播放'
    },
    disabledStyle: disabledStyle
  }), /*#__PURE__*/react.createElement(components_button/* default */.Z, {
    disabled: disabled,
    clickFun: handleDelete,
    config: {
      type: 'normal',
      text: '删除'
    },
    disabledStyle: disabledStyle
  }), /*#__PURE__*/react.createElement(components_button/* default */.Z, {
    disabled: disabled,
    clickFun: handleAdd,
    disabledStyle: disabledStyle,
    config: {
      type: 'normal',
      text: '添加到'
    }
  }), /*#__PURE__*/react.createElement(components_button/* default */.Z, {
    clickFun: handleQuit,
    style: {
      marginLeft: 'auto'
    },
    config: {
      type: 'normal',
      text: '退出批量操作'
    }
  })), /*#__PURE__*/react.createElement("div", {
    className: "batch_operation_body__mod",
    ref: wrapperRef
  }, renderContent())));
};

/* harmony default export */ const component_batch_operation = (BatchOperation);

//# sourceURL=webpack://qqmusic/./src/component/batch_operation/index.tsx_+_2_modules?