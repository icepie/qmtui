/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ET": () => (/* binding */ noteOnce),
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports warning, note, resetWarned, call, warningOnce */
/* eslint-disable no-console */
var warned = {};
function warning(valid, message) {
  // Support uglify
  if (false) {}
}
function note(valid, message) {
  // Support uglify
  if (false) {}
}
function resetWarned() {
  warned = {};
}
function call(method, valid, message) {
  if (!valid && !warned[message]) {
    method(false, message);
    warned[message] = true;
  }
}
function warningOnce(valid, message) {
  call(warning, valid, message);
}
function noteOnce(valid, message) {
  call(note, valid, message);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (warningOnce);
/* eslint-enable */

//# sourceURL=webpack://qqmusic/./node_modules/rc-util/es/warning.js?