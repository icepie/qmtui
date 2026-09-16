/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var CODE;

(function (CODE) {
  CODE[CODE["SUCCESS"] = 0] = "SUCCESS";
})(CODE || (CODE = {}));

class JSBridge {
  static generateSuccessRes(data) {
    return {
      code: CODE.SUCCESS,
      data
    };
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JSBridge);

//# sourceURL=webpack://qqmusic/./src/lib/common/service/js_bridge.ts?