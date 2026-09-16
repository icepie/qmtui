/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": () => (/* binding */ useSongIsInView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var stook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49068);


const useSongIsInView = (songList, songListRef) => {
  const [playingInfo] = (0,stook__WEBPACK_IMPORTED_MODULE_1__/* .useStore */ .oR)('PlayingStore');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    focusOnPlayerSong();
  }, [playingInfo]);
  const [focusData, setFocusData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    focusIndex: -1,
    isFocusItemInView: false,
    renderStartIndex: 0,
    renderStopIndex: 0
  });

  const focusOnPlayerSong = () => {
    if (playingInfo.songOnPlaying || playingInfo.songOnPause) {
      const song = playingInfo.songOnPlaying || playingInfo.songOnPause;
      const idx = songList.findIndex(item => (item === null || item === void 0 ? void 0 : item.id) === (song === null || song === void 0 ? void 0 : song.id));
      setFocusData({ ...focusData,
        focusIndex: idx
      });
    } else {
      setFocusData({ ...focusData,
        focusIndex: -1
      });
    }
  };

  const handleRowRenderer = data => {
    setFocusData({ ...focusData,
      isFocusItemInView: focusData.focusIndex <= data.stopIndex && focusData.focusIndex >= data.startIndex,
      renderStartIndex: data.startIndex,
      renderStopIndex: data.stopIndex
    });
  };

  const scrollToRow = idx => {
    var _songListRef$current;

    songListRef === null || songListRef === void 0 ? void 0 : (_songListRef$current = songListRef.current) === null || _songListRef$current === void 0 ? void 0 : _songListRef$current.scrollToRow(idx);
  };

  const focusOnCurrentSong = () => {
    // const song = playingInfo.songOnPlaying || playingInfo.songOnPause;
    // const idx = songList.findIndex(item => item?.id === song?.id);
    // console.log("current index", idx);
    // scrollToRow(idx);
    scrollToRow(focusData.focusIndex);
  };

  const scrollToTop = () => {
    scrollToRow(0);
  };

  const needToShowFocusBtn = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return focusData.focusIndex !== -1 && !focusData.isFocusItemInView;
  }, [focusData]);
  const needToShowToTopBtn = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return focusData.renderStartIndex > 0;
  }, [focusData]);
  return [needToShowFocusBtn, needToShowToTopBtn, focusOnCurrentSong, scrollToTop, handleRowRenderer];
};

//# sourceURL=webpack://qqmusic/./src/hooks/playing_info.ts?