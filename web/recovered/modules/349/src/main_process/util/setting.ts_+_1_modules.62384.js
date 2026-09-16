
// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "cB": () => (/* binding */ INIT_PARAM),
  "ZP": () => (/* binding */ setting)
});

// UNUSED EXPORTS: DARK_SKIN_USER_AGENT_CONFIG, LIGHT_SKIN_USER_AGENT_CONFIG, SETTING

// EXTERNAL MODULE: ./node_modules/electron-settings/dist/settings.js
var settings = __webpack_require__(44418);
var settings_default = /*#__PURE__*/__webpack_require__.n(settings);
// EXTERNAL MODULE: ./src/pages/setting/constants/index.ts + 1 modules
var constants = __webpack_require__(23560);
;// CONCATENATED MODULE: ./src/main_process/module/browser_window/BrowserWindowManager.ts
class BrowserWindowManager {
  constructor() {
    this.windowStore = void 0;
    this.windowStore = new Map();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new BrowserWindowManager();
    }

    return this.instance;
  }

  createWindow(windowName, factory, options, extraInfo) {
    const browserWindow = factory.create(options, windowName, this, extraInfo);
    this.windowStore.set(windowName, browserWindow);
    return browserWindow;
  }

  destroyWindow(windowName) {
    if (this.windowStore.has(windowName)) {
      var _this$windowStore$get;

      (_this$windowStore$get = this.windowStore.get(windowName)) === null || _this$windowStore$get === void 0 ? void 0 : _this$windowStore$get.destroy();
      this.windowStore.delete(windowName);
    }
  }

  getWindow(windowName) {
    if (this.windowStore.has(windowName) && this.windowStore.get(windowName)) {
      return this.windowStore.get(windowName);
    }
  }

  isBrowserWindowCreated(windowName) {
    var _this$windowStore$get2;

    return this.windowStore.has(windowName) && !((_this$windowStore$get2 = this.windowStore.get(windowName)) !== null && _this$windowStore$get2 !== void 0 && _this$windowStore$get2.isDestroyed());
  }

  closeAllWindow() {
    this.windowStore.forEach(_browserWindow => {
      _browserWindow === null || _browserWindow === void 0 ? void 0 : _browserWindow.close();
    });
  }

}

BrowserWindowManager.instance = void 0;
/* harmony default export */ const browser_window_BrowserWindowManager = (BrowserWindowManager);
// EXTERNAL MODULE: ./src/types/index.ts
var types = __webpack_require__(91713);
;// CONCATENATED MODULE: ./src/main_process/util/setting.ts




let INIT_PARAM;

(function (INIT_PARAM) {
  INIT_PARAM["WINDOW_SIZE"] = "window_size";
  INIT_PARAM["VOLUME"] = "volume";
  INIT_PARAM["THEME"] = "theme";
})(INIT_PARAM || (INIT_PARAM = {}));

const LIGHT_SKIN_USER_AGENT_CONFIG = 'SkinId/10001|1ecc94|144|1|||1fd4af';
const DARK_SKIN_USER_AGENT_CONFIG = 'SkinId/10209|1ecc94|144|0|||1fd4af';
let SETTING;

(function (SETTING) {
  SETTING["REMEMBER_WINDOW_SIZE"] = "normal.boost.remember_window_size";
  SETTING["MUSIC_EASE_IN_AND_OUT"] = "normal.play.music_ease_in_out";
  SETTING["AUTO_OPEN_DESKTOP_LYRIC"] = "normal.play.auto_open_desktop_lyric";
  SETTING["REMEMBER_VOICE"] = "normal.play.remember_voice";
})(SETTING || (SETTING = {}));

const DefaultSetting = {
  window_size: [1000, 750],
  volume: 50,
  theme: 'dark'
};

class SettingUtil {
  constructor() {
    this.settingInitialValue = {};
    this.settingValue = {};
    this.getInitialSettingValue();
    this.getInitialSetting();
  }

  getInitialSettingValue() {
    for (const initparamKey in INIT_PARAM) {
      const key = Reflect.get(INIT_PARAM, initparamKey);

      if (settings_default().hasSync(key)) {
        Reflect.set(this.settingInitialValue, key, settings_default().getSync(key));
      } else {
        Reflect.set(this.settingInitialValue, key, Reflect.get(DefaultSetting, key));
      }
    }
  }

  getInitialSetting() {
    for (const initparamKey in SETTING) {
      const key = Reflect.get(SETTING, initparamKey);

      if (settings_default().hasSync(key)) {
        Reflect.set(this.settingValue, initparamKey, settings_default().getSync(key));
      } else {
        Reflect.set(this.settingValue, initparamKey, (0,constants/* getDefaultSetting */.A5)(key));
      }
    }
  }

  applySettingInMainProcess() {
    const {
      settingValue
    } = this;

    if (settingValue.REMEMBER_WINDOW_SIZE) {
      const mainWindow = browser_window_BrowserWindowManager.getInstance().getWindow(types/* WindowName.MAIN_WINDOW */.IA.MAIN_WINDOW);
      mainWindow.on('resize', () => {
        settings_default().setSync(INIT_PARAM.WINDOW_SIZE, mainWindow.getSize());
      });
    }

    if (settingValue.AUTO_OPEN_DESKTOP_LYRIC) {
      const desktopLyricWindow = browser_window_BrowserWindowManager.getInstance().getWindow(types/* WindowName.DESKTOP_LYRIC_WINDOW */.IA.DESKTOP_LYRIC_WINDOW); // setTimeout(() => {

      desktopLyricWindow === null || desktopLyricWindow === void 0 ? void 0 : desktopLyricWindow.show(); // }, 5000);
    }
  }

}

/* harmony default export */ const setting = (new SettingUtil());

//# sourceURL=webpack://qqmusic/./src/main_process/util/setting.ts_+_1_modules?