/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_lib_network__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32590);
/* harmony import */ var _src_lib_network_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(39124);
/* harmony import */ var electron_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(44418);
/* harmony import */ var electron_settings__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron_settings__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(58933);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_3__);




var ACCOUNT_TYPE;

(function (ACCOUNT_TYPE) {
  ACCOUNT_TYPE["QQ"] = "QQ";
  ACCOUNT_TYPE["WECHAT"] = "WX";
  ACCOUNT_TYPE["UNKNOWN"] = "unknown";
})(ACCOUNT_TYPE || (ACCOUNT_TYPE = {}));

const isMainProc = process.type === 'browser';
const isDev = "production" == 'development';
let hasLoad = false;

class LoginManager {
  constructor() {
    this.loginData = void 0;
    this.loginWindow = void 0;
    this.initLoginData();
    this.loadLocalLoginData();
  }

  async loginByToken() {
    switch (this.loginData.accountType) {
      case ACCOUNT_TYPE.QQ:
        console.log('QQ login');
        return this.qqLoginByToken();

      case ACCOUNT_TYPE.WECHAT:
        console.log('WX login');
        return this.wechatLoginByToken();

      default:
        return Promise.reject();
    }
  }

  async wechatLoginByToken() {
    const {
      WXOpenId,
      WXAccessToken,
      WXRefreshToken,
      WXUnionid,
      musicId,
      musicKey
    } = this.loginData;
    return (0,_src_lib_network__WEBPACK_IMPORTED_MODULE_0__/* .ufetch */ .D)({
      login: (0,_src_lib_network_api__WEBPACK_IMPORTED_MODULE_1__/* .loginByWechat */ .cq)({
        openid: WXOpenId,
        access_token: WXAccessToken,
        refresh_token: WXRefreshToken,
        str_musicid: `${musicId}`,
        musickey: musicKey,
        unionid: WXUnionid,
        onlyNeedAccessToken: 0,
        forceRefreshToken: 0,
        strAppid: 'wx1a376b527b64b71d'
      }),
      comm: {
        ct: 19,
        cv: 1,
        tmeLoginType: '1'
      }
    }).then(res => {
      if (res.code === 0 && res.login && res.login.code === 0 && res.login.data) {
        return this.handleWechatLoginData(res.login.data);
      } else {
        console.error('WX login by token fail', res);
        return Promise.reject();
      }
    }).catch(() => {
      console.error('WX login request fail');
      return Promise.reject();
    });
  }

  async wechatLoginByCode(code) {
    return (0,_src_lib_network__WEBPACK_IMPORTED_MODULE_0__/* .ufetch */ .D)({
      login: (0,_src_lib_network_api__WEBPACK_IMPORTED_MODULE_1__/* .loginByWechat */ .cq)({
        code,
        onlyNeedAccessToken: 0,
        forceRefreshToken: 0,
        strAppid: 'wx1a376b527b64b71d'
      }),
      comm: {
        tmeLoginType: '1'
      }
    }).then(res => {
      var _res$login;

      if (res.code === 0 && res.login && ((_res$login = res.login) === null || _res$login === void 0 ? void 0 : _res$login.code) === 0 && res.login.data) {
        return this.handleWechatLoginData(res.login.data);
      } else {
        console.error('QQ login by token fail', res);
        return Promise.reject();
      }
    });
  }

  async qqLoginByToken() {
    const {
      QQOpenId,
      QQAccessToken,
      QQRefreshToken,
      musicId,
      musicKey
    } = this.loginData;
    return (0,_src_lib_network__WEBPACK_IMPORTED_MODULE_0__/* .ufetch */ .D)({
      login: (0,_src_lib_network_api__WEBPACK_IMPORTED_MODULE_1__/* .loginByQQ */ .dN)({
        openid: QQOpenId,
        access_token: QQAccessToken,
        refresh_token: QQRefreshToken,
        musicid: musicId,
        musickey: musicKey,
        onlyNeedAccessToken: 0,
        forceRefreshToken: 0
      }),
      comm: {
        ct: 19,
        cv: 1
      }
    }).then(res => {
      var _res$login2;

      if (res.code === 0 && res.login && ((_res$login2 = res.login) === null || _res$login2 === void 0 ? void 0 : _res$login2.code) === 0 && res.login.data) {
        console.log('QQ login success');
        return this.handleQQLoginData(res.login.data);
      } else {
        console.error('QQ login fail');
        return Promise.reject();
      }
    }).catch(() => {
      console.error('QQ login request fail');
      return Promise.reject();
    });
  }

  async qqLoginByCode(code) {
    return (0,_src_lib_network__WEBPACK_IMPORTED_MODULE_0__/* .ufetch */ .D)({
      login: (0,_src_lib_network_api__WEBPACK_IMPORTED_MODULE_1__/* .loginByQQ */ .dN)({
        onlyNeedAccessToken: 0,
        forceRefreshToken: 0,
        appid: 100497308,
        code
      }),
      comm: {
        ct: 19,
        cv: 1
      }
    }).then(res => {
      var _res$login3;

      if (res.code === 0 && res.login && ((_res$login3 = res.login) === null || _res$login3 === void 0 ? void 0 : _res$login3.code) === 0 && res.login.data) {
        console.log('QQ login success');
        return this.handleQQLoginData(res.login.data);
      } else {
        console.error('QQ login fail');
        return Promise.reject();
      }
    });
  }

  handleQQLoginData(result) {
    const {
      musicid,
      openid,
      refresh_token,
      unionid,
      access_token,
      expired_at,
      musickey
    } = result;
    this.loginData = { ...this.loginData,
      accountType: ACCOUNT_TYPE.QQ,
      musicId: musicid,
      QQOpenId: openid,
      QQRefreshToken: refresh_token,
      QQUnionid: unionid,
      QQAccessToken: access_token,
      tokenExpired: expired_at,
      musicKey: musickey
    };
    this.saveLoginData();
    return this.setCookies();
  }

  handleWechatLoginData(result) {
    const {
      str_musicid,
      openid,
      refresh_token,
      access_token,
      expired_at,
      unionid,
      musickey
    } = result;
    this.loginData = { ...this.loginData,
      accountType: ACCOUNT_TYPE.WECHAT,
      musicId: str_musicid,
      WXOpenId: openid,
      WXRefreshToken: refresh_token,
      WXAccessToken: access_token,
      tokenExpired: expired_at,
      WXUnionid: unionid,
      musicKey: musickey
    };
    this.saveLoginData();
    return this.setCookies();
  }

  loadLocalLoginData() {
    if (!hasLoad) {
      hasLoad = true;
      this.getLocalData();
      this.autoLoad();
    }
  }
  /**
   * 四小时换一次key?
   * todo 这是之前的逻辑，要再斟酌一下
   */


  autoLoad() {
    setInterval(() => {
      const data = electron_settings__WEBPACK_IMPORTED_MODULE_2___default().getSync('login_data');

      if (data) {
        this.loginByToken();
      }
    }, 1000 * 60 * 60 * 4);
  }

  saveLoginData() {
    electron_settings__WEBPACK_IMPORTED_MODULE_2___default().setSync('login_data', this.loginData);
  }

  reload() {
    this.getLocalData();
  }

  getLocalData() {
    const data = electron_settings__WEBPACK_IMPORTED_MODULE_2___default().getSync('login_data');

    if (data) {
      this.loginData = { ...this.loginData,
        ...data
      };
    }
  }

  get musicId() {
    return this.loginData.musicId;
  }

  get accountType() {
    return this.loginData.accountType;
  }

  isLogin() {
    const {
      accountType
    } = this.loginData;
    return accountType === ACCOUNT_TYPE.WECHAT || accountType === ACCOUNT_TYPE.QQ;
  }
  /**
   * 设置渲染进程的cookies
   */


  setCookies() {
    if (this.loginData.accountType === ACCOUNT_TYPE.UNKNOWN) {
      return Promise.resolve();
    }

    const {
      musicId,
      musicKey,
      QQOpenId,
      QQAccessToken,
      accountType,
      WXOpenId,
      WXRefreshToken
    } = this.loginData;
    const cookies = [{
      name: 'uin',
      value: `${musicId}`
    }, {
      name: 'qqmusic_uin',
      value: `${musicId}`
    }, {
      name: 'qqmusic_key',
      value: musicKey
    }, {
      name: 'qqmusic_version',
      value: '17'
    }, {
      name: 'qqmusic_miniversion',
      value: '70'
    }];

    if (accountType === ACCOUNT_TYPE.QQ) {
      cookies.push({
        name: 'psrf_qqopenid',
        value: QQOpenId
      }, {
        name: 'psrf_qqaccess_token',
        value: QQAccessToken
      });
    } else if (accountType === ACCOUNT_TYPE.WECHAT) {
      cookies.push({
        name: 'wxopenid',
        value: WXOpenId
      }, {
        name: 'wxrefresh_token',
        value: WXRefreshToken
      });
    }

    return Promise.all(cookies.map(item => {
      // 判断是主进程还是渲染进程。
      if (isMainProc) {
        electron__WEBPACK_IMPORTED_MODULE_3__.session.defaultSession.cookies.set({
          url: 'https://u.y.qq.com/cgi-bin/musics.fcg',
          name: item.name,
          value: item.value,
          secure: true,
          path: '/',
          domain: 'qq.com',
 sameSite: 'no_restriction'
        });
      } else {
        electron__WEBPACK_IMPORTED_MODULE_3__.remote.session.defaultSession.cookies.set({
          url: 'https://u.y.qq.com/cgi-bin/musics.fcg',
          name: item.name,
          value: item.value,
          secure: true,
          path: '/',
          domain: 'qq.com',
 sameSite: 'no_restriction'
        });
      }
    })).then(() => {
      console.log('cookie set success');
    }).catch(error => {
      console.log('cookie set fail');
    });
  }

  initLoginData() {
    this.loginData = {
      accountType: ACCOUNT_TYPE.UNKNOWN,
      musicId: '',
      musicKey: '',
      QQAccessToken: '',
      QQRefreshToken: '',
      QQOpenId: '',
      QQUnionid: '',
      WXOpenId: '',
      WXAccessToken: '',
      WXRefreshToken: '',
      WXUnionid: '',
      tokenExpired: 0
    };
  }

  reset() {
    this.initLoginData();
    electron_settings__WEBPACK_IMPORTED_MODULE_2___default().unsetSync('login_data');

    if (isMainProc) {
      electron__WEBPACK_IMPORTED_MODULE_3__.session.defaultSession.clearStorageData({
        storages: ['cookies']
      });
    } else {
      electron__WEBPACK_IMPORTED_MODULE_3__.remote.session.defaultSession.clearStorageData({
        storages: ['cookies']
      });
    }
  }

  getUin() {
    return this.loginData.musicId;
  }

  loginMiniportal() {
    if (this.loginWindow && !this.loginWindow.isDestroyed()) {
      // 如果登录窗口已存在且未被销毁，则显示它
      this.loginWindow.show();
      return;
    }

    const mainWinId = electron__WEBPACK_IMPORTED_MODULE_3__.remote.getGlobal('mainWinId');
    const mainWin = electron__WEBPACK_IMPORTED_MODULE_3__.remote.BrowserWindow.fromId(mainWinId);
    this.loginWindow = new electron__WEBPACK_IMPORTED_MODULE_3__.remote.BrowserWindow({
      title: 'QQ音乐',
      width: 540,
      height: 440,
      webPreferences: {
 nodeIntegration: !0, devTools: !0, contextIsolation: false,        webviewTag: true,
        webSecurity: false,
        enableRemoteModule: true,
        nodeIntegration: true
      },
      minimizable: false,
      maximizable: false,
      show: true,
      parent: mainWin
    });
    this.loginWindow.removeMenu();
    this.loginWindow.on('close', event => {
      event.preventDefault(); // 阻止默认关闭行为

      this.loginWindow.hide(); // 隐藏窗口而不是关闭
    });

    if (isDev) {
      this.loginWindow.loadURL('http://localhost:9000/login.html');
      this.loginWindow.webContents.openDevTools();
    } else {
      this.loginWindow.loadFile('login.html');
    }
  }

}

const LoginMgr = new LoginManager();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LoginMgr);

//# sourceURL=webpack://qqmusic/./src/lib/common/login.ts?