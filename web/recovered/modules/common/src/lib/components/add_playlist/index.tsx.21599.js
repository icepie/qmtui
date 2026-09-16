/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ AddPlayList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31603);
/* harmony import */ var _src_lib_common_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7273);
/* harmony import */ var _src_hooks_assets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(67891);




class AddPlayList extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.maxLen = void 0;
    const defaultDirname = this.props.objArg && this.props.objArg.dirname;
    this.maxLen = 20;
    this.state = {
      dirname: defaultDirname || '',
      tpisDom: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, "\u6700\u591A", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "c_tx_current"
      }, " 15"), "\u5B57")
    };
  }

  componentDidMount() {
    this.showInputMsg();
  }

  handleSubmit() {
    const {
      objArg
    } = this.props;

    if (!objArg) {
      return;
    }

    const {
      songlist
    } = objArg;
    const {
      dirname
    } = this.state;

    if (!this.validate()) {
      return false;
    }

    (0,_src_hooks_assets__WEBPACK_IMPORTED_MODULE_3__/* .addSongListToPlayList */ .mP)({
      songList: songlist,
      playListName: dirname,
      listId: -1
    });
    setTimeout(function () {
      _src_lib_common_dialog__WEBPACK_IMPORTED_MODULE_2__/* .dialog.hide */ .WZ.hide();
    }, 500);
  }

  handleChange(e) {
    this.setState({
      dirname: e.target.value
    }, () => {
      this.showInputMsg();
    });
  }

  checkSpeString(str) {
    if (str.indexOf('?') > -1 || str.indexOf('&') > -1 || str.indexOf('+') > -1 || str.indexOf('"') > -1 || str.indexOf('#') > -1 || str.indexOf('=') > -1 || str.indexOf('%') > -1 || str.indexOf('<') > -1 || str.indexOf('>') > -1 || str.indexOf('\\') > -1 || str.indexOf("'") > -1) {
      return false;
    }

    return true;
  }

  showInputMsg(msg) {
    const {
      dirname
    } = this.state;

    const _len = _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_1__/* .default.getRealLen */ .ZP.getRealLen(dirname);

    const obj = {};

    if (_len == 0) {
      obj.tpisDom = '请输入歌单名称';
    } else if (this.checkSpeString(dirname)) {
      if (_len <= this.maxLen * 2) {
        obj.tpisDom = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, "\u8FD8\u80FD\u8F93\u5165", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
          className: "c_tx_current"
        }, " ", Math.ceil(this.maxLen - Math.round(_len / 2))), "\u4E2A\u5B57");
      } else {
        obj.tpisDom = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
          className: "c_popup__highlight"
        }, " ", `超过${Math.ceil(Math.round(_len / 2) - this.maxLen)}个字，歌单名称最多支持${this.maxLen}个字`);
      }
    } else {
      obj.tpisDom = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "c_popup__highlight"
      }, " ", '不能含有?,+,&,#,%,",\',=,\\,<,>等特殊字符');
    }

    if (!!msg) {
      obj.tpisDom = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "c_popup__highlight"
      }, " ", msg);
    }

    this.setState(obj);
  }

  validate() {
    const {
      dirname
    } = this.state;

    const _len = _src_lib_common_utils__WEBPACK_IMPORTED_MODULE_1__/* .default.getRealLen */ .ZP.getRealLen(dirname);

    if (_len <= 0 || _len > this.maxLen * 2) {
      this.showInputMsg();
      return false;
    }

    if (!this.checkSpeString(dirname)) {
      this.showInputMsg('不能含有?,+,&,#,%,",\',=,\\,<,>等特殊字符');
      return false;
    }

    return true;
  }

  render() {
    const {
      dirname,
      tpisDom
    } = this.state;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "popup__bd c_tx_normal"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "popup__bd_box"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "mod_input_text popup_newlist__input c_bg_normal c_btn_line"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", {
      type: "text",
      value: dirname,
      onChange: e => {
        this.handleChange(e);
      },
      className: "text c_tx_thin",
      placeholder: "\u8BF7\u8F93\u5165\u6B4C\u5355\u540D\u79F0"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "popup_newlist__tips"
    }, tpisDom))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "popup__ft"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
      onClick: () => {
        this.handleSubmit();
      },
      className: "mod_btn c_btn_skin"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
      className: "btn__cover"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
      className: "btn__txt"
    }, "\u786E\u5B9A")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
      onClick: () => {
        _src_lib_common_dialog__WEBPACK_IMPORTED_MODULE_2__/* .dialog.hide */ .WZ.hide();
      },
      className: "mod_btn c_btn"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
      className: "btn__cover"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
      className: "btn__txt"
    }, "\u53D6\u6D88"))));
  }

}

//# sourceURL=webpack://qqmusic/./src/lib/components/add_playlist/index.tsx?