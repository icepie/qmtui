/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);


class ScrollItem extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent {
  constructor(props) {
    super(props);

    this.handleReLoad = () => {// todo
    };

    this.scrollToTop = () => {
      var _this$props$scrollToT, _this$props;

      (_this$props$scrollToT = (_this$props = this.props).scrollToTopFunc) === null || _this$props$scrollToT === void 0 ? void 0 : _this$props$scrollToT.call(_this$props);
    };

    this.scrollToSong = () => {
      var _this$props$scrollToS, _this$props2;

      (_this$props$scrollToS = (_this$props2 = this.props).scrollToSong) === null || _this$props$scrollToS === void 0 ? void 0 : _this$props$scrollToS.call(_this$props2);
    };
  }

  render() {
    const {
      config,
      focusBtnVisible = false,
      scrollToTopBtnVisible = false
    } = this.props;
    const {
      handleReLoad,
      scrollToTop,
      scrollToSong
    } = this;
    const _config = { ...ScrollItem.defaultProps.config,
      ...config
    };
    const songStyle = {
      display: config.show ? '' : 'none'
    };
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "fast_side_bar",
      style: {
        position: 'absolute'
      }
    }, _config.reload && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
      onClick: handleReLoad,
      className: "btn_refresh c_popup__bg icon_skin_before c_tx_link",
      title: "\u5237\u65B0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("i", {
      className: "icon_txt"
    }, "\u5237\u65B0")), _config.show && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, focusBtnVisible && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
      className: "btn_position c_popup__bg icon_skin_before c_tx_link js_btn_position",
      title: "\u5B9A\u4F4D\u5F53\u524D\u64AD\u653E\u6B4C\u66F2",
      style: songStyle,
      onClick: scrollToSong
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("i", {
      className: "icon_txt"
    }, "\u5B9A\u4F4D\u5F53\u524D\u64AD\u653E\u6B4C\u66F2")), scrollToTopBtnVisible && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
      className: "btn_top c_popup__bg icon_skin_before c_tx_link js_btn_top",
      title: "\u8FD4\u56DE\u9876\u90E8",
      onClick: scrollToTop
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("i", {
      className: "icon_txt"
    }, "\u8FD4\u56DE\u9876\u90E8"))));
  }

}

ScrollItem.defaultProps = {
  config: {
    reload: false,
    show: true
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScrollItem);

//# sourceURL=webpack://qqmusic/./src/component/scroll_button/index.tsx?