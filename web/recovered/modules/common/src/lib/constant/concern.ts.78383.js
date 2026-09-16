/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pz": () => (/* binding */ PAGE_SPD_ID)
/* harmony export */ });
/* unused harmony exports USER_TYPE, OPER_TYPE, CONCERN_STATUS */
// 关注歌手/用户的相关常量
// 用户类型定义
const USER_TYPE = {
  kUser: 0,
  // 普通用户
  kSinger: 1 // 歌手

}; // 操作类型

const OPER_TYPE = {
  kConcern: 0,
  // 添加关注
  kCancel: 1,
  // 取消关注
  kGetConcernSinger: 2,
  // 拉取关注歌手列表
  kGetConcernUser: 3,
  // 拉取关注用户列表
  kGetFans: 4,
  // 拉取粉丝列表
  kGetConcernStatus: 5,
  // 查询关注状态
  kGetConcernNum: 6 // 查询相关总数

}; // 关注状态定义

const CONCERN_STATUS = {
  kNoConcern: 0,
  // 未关注
  kOnConcern: 1 // 已关注

}; // 页面测速系统ID

const PAGE_SPD_ID = {
  CLIENT_BODY: [1681, 1, 1],
  INVOKE_RENDERER: '20',
  // 渲染进程启动
  LOAD_MUSIC_ROOM_WEBVIEW: '21',
  LOAD_VIDEO_WEBVIEW: '22'
};


//# sourceURL=webpack://qqmusic/./src/lib/constant/concern.ts?