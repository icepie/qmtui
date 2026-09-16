/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ QQMusicLoading),
/* harmony export */   "N": () => (/* binding */ LoadingComponent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(96632);
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_index_less__WEBPACK_IMPORTED_MODULE_1__);


const QQMusicLoading = ({
  style = {},
  className = ''
}) => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: `${className} mod_loading--part`,
    style: style
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("i", {
    className: "loading__icon c_tx_current",
    style: {
      transform: 'scale(0.8)'
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("i", {
    className: "icon_txt"
  }, "\u6B63\u5728\u52A0\u8F7D\u4E2D"));
};
const LoadingComponent = props => {
  if (props.isLoading) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(QQMusicLoading, {
      style: {
        height: '100%'
      }
    });
  }
  return null;
};

//# sourceURL=webpack://qqmusic/./src/component/loading/qqmusic_loading.tsx?