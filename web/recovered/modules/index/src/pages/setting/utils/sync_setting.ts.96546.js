/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E5": () => (/* binding */ syncSetting),
/* harmony export */   "bR": () => (/* binding */ listenOnAppSettingChange),
/* harmony export */   "xI": () => (/* binding */ removeAppSettingListener)
/* harmony export */ });
/* harmony import */ var _lib_common_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67224);
/* harmony import */ var electron_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(44418);
/* harmony import */ var electron_settings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron_settings__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _src_tool_bridge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(53941);



const syncSetting = args => {
  const {
    key,
    value
  } = args;
  electron_settings__WEBPACK_IMPORTED_MODULE_1___default().setSync(key, value);
  console.log(electron_settings__WEBPACK_IMPORTED_MODULE_1___default().getSync(key));
  (0,_src_tool_bridge__WEBPACK_IMPORTED_MODULE_2__/* .emitIpcRenderMessage */ .D)('player_message', 'app_setting_change', args);
};
const listenOnAppSettingChange = () => {
  _lib_common_event__WEBPACK_IMPORTED_MODULE_0__/* .default.on */ .Z.on('app_setting_change', syncSetting);
};
const removeAppSettingListener = () => {
  _lib_common_event__WEBPACK_IMPORTED_MODULE_0__/* .default.removeListener */ .Z.removeListener('app_setting_change', syncSetting);
};

//# sourceURL=webpack://qqmusic/./src/pages/setting/utils/sync_setting.ts?