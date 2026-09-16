/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VO": () => (/* binding */ SEARCH_TYPE),
/* harmony export */   "d$": () => (/* binding */ searchQQMusicAsset),
/* harmony export */   "ek": () => (/* binding */ getSearchPlayListSongInfo)
/* harmony export */ });
/* unused harmony exports GET_RECOMMEND_FEED, GET_TRACK_INFO */
let SEARCH_TYPE;

(function (SEARCH_TYPE) {
  SEARCH_TYPE[SEARCH_TYPE["SONG"] = 0] = "SONG";
  SEARCH_TYPE[SEARCH_TYPE["SINGER"] = 1] = "SINGER";
  SEARCH_TYPE[SEARCH_TYPE["ALBUM"] = 2] = "ALBUM";
  SEARCH_TYPE[SEARCH_TYPE["PLAYLIST"] = 3] = "PLAYLIST";
})(SEARCH_TYPE || (SEARCH_TYPE = {}));

const searchQQMusicAsset = param => ({
  module: 'music.search.SearchBrokerCgiServer',
  method: 'DoSearchForQQMusicMobile',
  param: {
    grp: 1,
    num_per_page: param.number || 15,
    page_num: param.page + 1 || 1,
    query: param.query,
    search_type: param.type,
    uin: param.uin,
    remoteplace: 'search.linux.keyboard',
    searchid: Math.random().toString().substr(2) + param.uin
  }
});
const getSearchPlayListSongInfo = param => ({
  module: 'music.srfDissInfo.aiDissInfo',
  method: 'uniform_get_Dissinfo',
  param
});
const GET_RECOMMEND_FEED = param => ({
  module: 'music.recommend.RecommendFeed',
  method: 'get_recommend_feed',
  param
});
const GET_TRACK_INFO = param => ({
  module: 'track_info.UniformRuleCtrlServer',
  method: 'GetTrackInfo',
  param
});

//# sourceURL=webpack://qqmusic/./src/lib/network/search_api.ts?