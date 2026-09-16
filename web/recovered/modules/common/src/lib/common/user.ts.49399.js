/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_lib_common_service_commands_show_common_dlg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(36702);
/* harmony import */ var _cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10045);
/* harmony import */ var _login__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(68010);
// 用户行为相关的方法集成与此



const user = {
  /**
   * 开通VIP
   *
   * @param {string} aid 开通来源
   * @param {string} cm 开通方式
   * @param {string} cm 开通方式
   * @param {string} target：self——给自己开通（默认）；send：给好友开通
   */
  buyVip(buyType = 'buygreen', aid = '', cm = '', defaultmonth = '', target = 'self') {
    const url = `https://y.qq.com/wk_v17/#/minipay?buytype=${buyType}&aid=${aid}&cm=${cm}&defaultmonth=${defaultmonth}&target=${target}`;
    const uin = _cookie__WEBPACK_IMPORTED_MODULE_1__/* .default.get */ .Z.get('qqmusic_uin');
    const key = _cookie__WEBPACK_IMPORTED_MODULE_1__/* .default.get */ .Z.get('qqmusic_key');
    const ptloginUrl = `https://ssl.ptlogin2.qq.com/jump?pgv_ref=&keyindex=14&clientuin=${uin}&clientkey=${key}&u1=${encodeURIComponent(url)}`;
    (0,_src_lib_common_service_commands_show_common_dlg__WEBPACK_IMPORTED_MODULE_0__/* .showCommonDlg */ .jX)({
      title: '开通服务',
      openUrl: ptloginUrl,
      width: 690,
      height: 621
    });
  },

  /**
   * 购买数字专辑
   * @param {object} obj
   */
  buyDigitalAlbum({
    title = '',
    albumid = 0,
    actid = 0,
    frompage = 'zwsharezuduan',
    aid = ''
  }) {
    // 获得uin
    if (_login__WEBPACK_IMPORTED_MODULE_2__/* .default.musicId */ .Z.musicId < 10000) {
      _login__WEBPACK_IMPORTED_MODULE_2__/* .default.loginMiniportal */ .Z.loginMiniportal();
      return false;
    }

    const url = `https://y.qq.com/wk_v17/#/minipay?title=${title}&albumid=${albumid}&actid=${actid}&frompage=${frompage}&pagetype=digitalalbum` + `&aid=${aid}`;
    const uin = _cookie__WEBPACK_IMPORTED_MODULE_1__/* .default.get */ .Z.get('qqmusic_uin');
    const key = _cookie__WEBPACK_IMPORTED_MODULE_1__/* .default.get */ .Z.get('qqmusic_key');
    const ptloginUrl = `https://ssl.ptlogin2.qq.com/jump?pgv_ref=&keyindex=14&clientuin=${uin}&clientkey=${key}&u1=${encodeURIComponent(url)}`;
    (0,_src_lib_common_service_commands_show_common_dlg__WEBPACK_IMPORTED_MODULE_0__/* .showCommonDlg */ .jX)({
      title: '购买数字专辑',
      width: 690,
      height: 451,
      openUrl: ptloginUrl
    });
  }

};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (user);

//# sourceURL=webpack://qqmusic/./src/lib/common/user.ts?