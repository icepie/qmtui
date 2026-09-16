/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LU": () => (/* binding */ MusicAPI),
/* harmony export */   "dN": () => (/* binding */ loginByQQ),
/* harmony export */   "cq": () => (/* binding */ loginByWechat),
/* harmony export */   "vc": () => (/* binding */ getUserVipInfo),
/* harmony export */   "Gr": () => (/* binding */ getUserBaseInfo)
/* harmony export */ });
const MusicAPI = {
  queryUpdate: cv => {
    return {
      updateMsg: {
        module: 'platform.uniteUpdate.UniteUpdateSvr',
        method: 'QueryUpdate',
        param: {}
      },
      comm: {
        ct: 31,
        cv
      }
    };
  }
};
/**
 * QQ登录
 * @param param
 * @constructor
 */

const loginByQQ = param => ({
  module: 'QQConnectLogin.LoginServer',
  method: 'QQLogin',
  param
});
/**
 * 微信登录
 * @param param
 */

const loginByWechat = param => ({
  module: 'tme_music.Login.LoginServer',
  method: 'Login',
  param
});
/**
 * 获取用户vip信息
 * @param param
 */

const getUserVipInfo = param => ({
  module: 'userInfo.VipQueryServer',
  method: 'SRFVipQuery_V2',
  param
});
/**
 * 获取用户基础信息
 * @param param
 */

const getUserBaseInfo = param => ({
  module: 'userInfo.BaseUserInfoServer',
  method: 'get_user_baseinfo_v2',
  param
});

//# sourceURL=webpack://qqmusic/./src/lib/network/api.ts?