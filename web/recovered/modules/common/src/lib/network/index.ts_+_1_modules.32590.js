
// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "h": () => (/* binding */ fetch),
  "D": () => (/* binding */ ufetch)
});

// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__(9669);
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);
// EXTERNAL MODULE: ./src/lib/common/utils.ts
var utils = __webpack_require__(31603);
// EXTERNAL MODULE: ./src/lib/common/cookie.ts
var cookie = __webpack_require__(10045);
;// CONCATENATED MODULE: ./src/lib/constant/api_methods.ts
// 加密api
const SECURITY_METHODS = {
  DEL_SONGLIST: 'switchSongLikeStateRes',
  ADD_SONGLIST: 'addSongsToPlayList',
  ADD_PLAYLIST: 'createNewPlayList',
  GET_URL: 'getVKey',
  CANCEL_FAV_ALBUM: 'cancelFavAlbum',
  DEL_PLAYLIST: 'deletePlayList',
  CANCEL_FAV_PLAYLIST: 'deleteFavPlayList',
  FAV_PLAYLIST: 'addFavPlayList',
  ADD_DEL_FAV_MV: 'deleteFavMv',
  SEQ_SONGLIST: 'seqSongList'
};

;// CONCATENATED MODULE: ./src/lib/network/index.ts





const getSecuritySign = __webpack_require__(22572);

const params = {
  data: {
    g_tk_new_20200303: utils/* default.getACSRFToken */.ZP.getACSRFToken(true),
    g_tk: utils/* default.getACSRFToken */.ZP.getACSRFToken(),
    uin: cookie/* default.get */.Z.get('qqmusic_uin') || 0,
    format: 'json',
    //默认是json  但是由于历史原因  部分个别cgi比较奇葩  需要改成 jsonp
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'electron',
    needNewCode: 1,
    ct: 20,
    cv: 1770
  },
  timeout: 10000,
  // 默认10秒超时
  withCredentials: 1,
  //让ajax支持cookie传递
  cache: false //目前用的zepto版本 默认是true  这里ajax默认为false   如果是调用$.ajax 还是默认true

};
function fetch(url, opts = {
  type: 'get'
}) {
  opts = utils/* default.extend */.ZP.extend(opts, params);

  if (opts.type == 'post') {
    return axios_default().post(url, opts.data, {
      withCredentials: true
    }).then(res => {
      if (res.status == 200) {
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res);
      }
    }).catch(err => {
      return Promise.reject(err);
    });
  } else {
    if (opts.data) {
      url = `${url}?${utils/* default.paramToUrl */.ZP.paramToUrl(opts.data)}`;
    }

    return axios_default().get(url, {
      withCredentials: true
    }).then(res => {
      if (res.status == 200) {
        return res.data;
      } else {
        return Promise.reject(res);
      }
    }).catch(err => {
      return Promise.reject(err);
    });
  }
}
function ufetch(params, isSecurityCGI) {
  let url;

  if (params.comm) {
    !params.comm.ct && (params.comm.ct = 19);
    !params.comm.cv && (params.comm.cv = 1);
    params.comm.tmeAppID = 'qqmusic';
  } else {
    params.comm = {
      ct: 20,
      cv: 1770,
      tmeAppID: 'qqmusic'
    };
  } // 直接检查 params 中的字段是否在 SECURITY_METHODS 中


  const shouldEncrypt = Object.keys(params).some(key => Object.values(SECURITY_METHODS).includes(key));
  /* params log suppressed */ // cgi-bin/musics.fcg 增加加密签名

  if (isSecurityCGI || shouldEncrypt) {
    url = 'https://u.y.qq.com/cgi-bin/musics.fcg';
    const normalizeParamStr = utils/* default.dataToNormalizeStr */.ZP.dataToNormalizeStr(params, true);
    url = utils/* default.addParam */.ZP.addParam({
      sign: getSecuritySign(normalizeParamStr)
    }, url);
  } else {
    url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
  }

  return axios_default().post(url, params, {
    withCredentials: true
  }).then(res => {
    if (res.status == 200) {
      return Promise.resolve(res.data);
    } else {
      return Promise.reject(res);
    }
  }).catch(err => {
    return Promise.reject(err);
  });
}

//# sourceURL=webpack://qqmusic/./src/lib/network/index.ts_+_1_modules?