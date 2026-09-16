/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E": () => (/* binding */ showUploadDialog)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67154);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67294);
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(76282);
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_less__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(73935);
/* harmony import */ var _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(31603);
/* harmony import */ var _src_lib_components_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(32393);
/* harmony import */ var _src_tool_bridge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(53941);







const UpdateDialog = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)((props, ref) => {
  const {
    newVersion,
    currentVersion,
    updateConfig
  } = props;
  const updateLog = ((updateConfig === null || updateConfig === void 0 ? void 0 : updateConfig.pkgDesc) || '').split(';').filter(item => !!item);
  const [isVisible, setVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useImperativeHandle)(ref, () => ({
    show
  }));

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  const handleCloseIconClick = () => {
    hide();
  };

  const handleUpdateConfig = () => {
    var _props$updateConfig, _props$updateConfig2;

    hide();

    if ((_props$updateConfig = props.updateConfig) !== null && _props$updateConfig !== void 0 && _props$updateConfig.pkgUrl && (_props$updateConfig2 = props.updateConfig) !== null && _props$updateConfig2 !== void 0 && _props$updateConfig2.pkgName) {
      var _props$updateConfig3, _props$updateConfig4;

      (0,_src_tool_bridge__WEBPACK_IMPORTED_MODULE_6__/* .emitIpcRenderMessage */ .D)('update_message', 'quit_and_install', {
        pkgUrl: ((_props$updateConfig3 = props.updateConfig) === null || _props$updateConfig3 === void 0 ? void 0 : _props$updateConfig3.pkgUrl) || '',
        pkgName: ((_props$updateConfig4 = props.updateConfig) === null || _props$updateConfig4 === void 0 ? void 0 : _props$updateConfig4.pkgName) || ''
      });
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    className: "update_dialog__mod",
    style: {
      display: isVisible ? 'flex' : 'none'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("i", {
    className: "popup__icon_close close_icon",
    onClick: handleCloseIconClick
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    className: "update_dialog__mod__content"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("p", {
    className: "version__mod c_tx_normal"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
    className: "version__mod__left"
  }, "\u65B0\u7248\u672C: ", newVersion), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", null, "\u5F53\u524D\u7248\u672C: ", currentVersion)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("ul", {
    className: "update_log__mod"
  }, updateLog && updateLog.map((item, idx) => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("li", {
      className: "update_log__item",
      key: idx
    }, item);
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    className: "update_dialog__btn__mod"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_src_lib_components_button__WEBPACK_IMPORTED_MODULE_5__/* .default */ .Z, {
    clickFun: handleUpdateConfig,
    config: {
      type: 'normal',
      text: '一键升级',
      highlight: true,
      extra: 'update_dialog__btn'
    }
  })));
});
const UpdateDialogRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createRef();

const showUploadDialog = data => {
  var _UpdateDialogRef$curr;

  const domId = (0,_src_lib_common_utils__WEBPACK_IMPORTED_MODULE_4__/* .generateDom */ .ZZ)((0,_src_lib_common_utils__WEBPACK_IMPORTED_MODULE_4__/* .generateUid */ .y_)(parseInt(data.newVersion, 10)));
  react_dom__WEBPACK_IMPORTED_MODULE_3__.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(UpdateDialog, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({
    ref: UpdateDialogRef
  }, data)), document.querySelector(`#${domId}`));
  UpdateDialogRef === null || UpdateDialogRef === void 0 ? void 0 : (_UpdateDialogRef$curr = UpdateDialogRef.current) === null || _UpdateDialogRef$curr === void 0 ? void 0 : _UpdateDialogRef$curr.show();
};



//# sourceURL=webpack://qqmusic/./src/pages/update_dialog/index.tsx?