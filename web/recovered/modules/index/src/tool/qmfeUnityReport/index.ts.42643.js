/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AL": () => (/* binding */ ELEMENT_ID),
/* harmony export */   "qt": () => (/* binding */ PAGE_HASH),
/* harmony export */   "eF": () => (/* binding */ CLICK_ID),
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tencent_qmfe_unity_report__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53765);
 // 创建上报实例

const unityReport = new _tencent_qmfe_unity_report__WEBPACK_IMPORTED_MODULE_0__/* .default */ .ZP(); // 元素id

const ELEMENT_ID = {
  SONG_MENU_EXPOSURE: 'electron_song_menu_exposure',
  PLAY_QUEUE_EXPOSURE: 'electron_play_queue_exposure'
}; // 页面hash

const PAGE_HASH = {
  ELECTRON_INIT: 'electron.init',
  SONG_PLAY_PAGE_EXPOSURE: 'electron_song_play_page_exposure',
  ELECTRON_COMMENT_PAGE: 'electron_comment_page',
  ELECTRON_SEARCH_PAGE_EXPOSURE: 'electron_search_page_exposure'
};
const CLICK_ID = {
  ELECTRON_CREATE_PLAYLIST_CLICK: 'electron_create_playlist_click',
  ELECTRON_FAVORITE_CLICK: 'electron_favorite_click',
  ELECTRON_RECOMMEND_CLICK: 'electron_recommend_click',
  ELECTRON_MUSIC_ROOM_CLICK: 'electron_music_room_click',
  ELECTRON_VIDEO_CLICK: 'electron_video_click'
};
const URL = 'y.qq.com/electron/index.html';

class QmfeUnityReport {
  // 曝光上报
  reportExposure(options) {
    console.log('report', options, URL);
    unityReport.reportExposure(options);
  } // 元素曝光


  reportExposureElement(elementId) {
    this.reportExposure({
      event_category: _tencent_qmfe_unity_report__WEBPACK_IMPORTED_MODULE_0__/* .EventCtgr.ELEEXP */ .AV.ELEEXP,
      element_id: elementId,
      url: URL
    });
  } // 页面曝光


  reportExposurePage(hash) {
    console.log('report', hash, URL);
    this.reportExposure({
      event_category: _tencent_qmfe_unity_report__WEBPACK_IMPORTED_MODULE_0__/* .EventCtgr.PGEXP */ .AV.PGEXP,
      hash,
      url: URL
    });
  } // 点击上报


  reportClick(elementId, content_string = '', ext = '') {
    unityReport.reportClick({
      event_category: _tencent_qmfe_unity_report__WEBPACK_IMPORTED_MODULE_0__/* .EventCtgr.ELECLICK */ .AV.ELECLICK,
      element_id: elementId,
      content_string,
      url: URL,
      ext: ext && JSON.stringify(ext) || ext
    });
  }

}

const report = new QmfeUnityReport();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (report);

//# sourceURL=webpack://qqmusic/./src/tool/qmfeUnityReport/index.ts?