/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WZ": () => (/* binding */ dialog),
/* harmony export */   "iG": () => (/* binding */ confirm),
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export Dialog */
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67154);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67294);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(73935);
/* harmony import */ var _components_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(32393);


/**
 * Dialog组件
 * 默认初始化一个实例dialog
 * 普通模式
 * @example
 * dialog.show({
 *       mode: "common",
 *       title: "QQ音乐",
 *       icon_type: 1,
 *       sub_title: '啊啊啊',
 *       desc: '啊啊啊',
 *       button_info1:...,
 *       button_info2:...
 *   });
 * rich模式 数专用
 * @example
 * dialog.show({
 *       mode: 'rich',
 *       desc: '啊啊啊',
 *       button_info1:...,
 *       button_info2:...
 * });
 * 自定义模式
 * @example
 * dialog.show({
 *       mode: "custom",
 *       title: "标题",
 *       component:<div style={{height:'250px',textAlign:'center',lineHeight:'250px'}}></div>
 *});
 * iframe模式已弃用
 *更具体参数参考组件中注释
 */




class CommonDialog extends react__WEBPACK_IMPORTED_MODULE_1__.PureComponent {
  render() {
    const {
      popup_class,
      title,
      content,
      closeFn
    } = this.props;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "mod_popup_box"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: `mod_popup c_popup__bg ${popup_class}`
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "popup__hd c_b_normal"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("h2", {
      className: "popup__tit c_tx_normal"
    }, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
      onClick: closeFn,
      className: "popup__close",
      title: "\u5173\u95ED"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("i", {
      className: "popup__icon_close"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("i", {
      className: "icon_txt"
    }, "\u5173\u95ED"))), content));
  }

}

class RichDialog extends react__WEBPACK_IMPORTED_MODULE_1__.PureComponent {
  render() {
    const {
      desc,
      closeFn,
      button_onclick1,
      button_onclick2,
      button_show1,
      button_show2,
      button_title1,
      button_title2
    } = this.props;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "mod_popup_box"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "mod_popup c_popup__bg popup_media"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "popup__bd c_tx_normal"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("img", {
      src: "//y.qq.com/mediastyle/music_v13/extra/mp_media_1.jpg",
      alt: "",
      className: "popup_media__img"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
      onClick: closeFn,
      className: "popup__close",
      title: "\u5173\u95ED"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("i", {
      className: "popup__icon_close"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("i", {
      className: "icon_txt"
    }, "\u5173\u95ED"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "popup__bd_box c_tx_normal"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("p", null, desc)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "popup__ft"
    }, button_show1 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_button__WEBPACK_IMPORTED_MODULE_3__/* .default */ .Z, {
      config: {
        highlight: true,
        stroke: false,
        disable: false,
        text: button_title1
      },
      clickFun: button_onclick1
    }) : '', button_show2 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_button__WEBPACK_IMPORTED_MODULE_3__/* .default */ .Z, {
      config: {
        highlight: false,
        stroke: false,
        disable: false,
        text: button_title2
      },
      clickFun: button_onclick2
    }) : '')));
  }

}

class Content extends react__WEBPACK_IMPORTED_MODULE_1__.PureComponent {
  render() {
    const {
      class_icon,
      sub_title,
      desc,
      need_footer,
      button_show1,
      button_show2,
      button_title1,
      button_title2,
      button_onclick1,
      button_onclick2
    } = this.props;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "popup__bd"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "popup__bd_inner"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: `popup__icon_tips ${class_icon} c_tx_current`
    }), sub_title ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("h3", {
      className: "popup__subtit c_tx_normal"
    }, sub_title) : null, desc ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("p", {
      className: "popup__desc c_tx_thin"
    }, desc) : null)), need_footer ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "popup__ft"
    }, button_show1 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_button__WEBPACK_IMPORTED_MODULE_3__/* .default */ .Z, {
      config: {
        highlight: true,
        stroke: false,
        disable: false,
        text: button_title1
      },
      clickFun: button_onclick1
    }) : '', button_show2 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_button__WEBPACK_IMPORTED_MODULE_3__/* .default */ .Z, {
      config: {
        highlight: false,
        stroke: false,
        disable: false,
        text: button_title2
      },
      clickFun: button_onclick2
    }) : '') : null);
  }

}

class Dialog extends react__WEBPACK_IMPORTED_MODULE_1__.Component {
  constructor(props) {
    super(props);
    this.defaultOpts = void 0;
    this.classIconList = void 0;
    this._timerTips = void 0;
    this.defaultOpts = {
      mode: 'common',
      //模式， common：普通模式;iframe：加载页面;bigpage：大页面;rich: 富态浮层，数专用;custom 自定义模式;默认common
      title: '',
      //标题，必填
      icon_type: 0,
      //图标类型，取值0-2[0：成功，1：警告，2：帮助]
      sub_title: '',
      //小标题，common模式下有效
      desc: '',
      //描述，common模式下有效
      width: 420,
      //宽度，默认420
      button_info1: null,
      //按钮1，common模式下有效，{highlight : 是否高亮, fn : "绑定按钮事件", title : "按钮标题"}
      button_info2: null,
      //按钮2
      url: '',
      //iframe模式下有效，子页面url
      //    objArg: null,				//iframe模式下有效，中间变量
      timeout: null,
      //多长时间后提示消失（毫秒数，默认不消失）
      need_footer: false,
      //是否需要底部
      popup_class: '',
      //弹框自定义的类，不传则为空,
      component: null //自定义内容，custom下有效

    };
    this.classIconList = ['icon_popup_note', 'icon_popup_warn', ''];
    this._timerTips = null;
    this.state = {
      isShow: 0,
      //控制dialog显示
      opts: Object.assign({}, this.defaultOpts),
      //最近一次show的opts
      richData: {},
      //富态浮层下的渲染数据
      content: null,
      //dialog的content
      style: {}
    };
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show(opts) {
    const _opts = Object.assign({}, this.defaultOpts, opts);

    let content = null;
    const data = {};
    this.setState({
      style: {
        position: 'fixed',
        zIndex: '10',
        top: '-1000px',
        margin: '10px'
      },
      opts: _opts
    });

    const _show = () => {
      if (_opts.mode == 'iframe') {
        document.domain = 'qq.com';
        content = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("iframe", {
          src: _opts.url,
          frameBorder: "0",
          width: "100%;",
          height: "100%;",
          scrolling: "no"
        });
      } else if (_opts.mode == 'bigpage') {
        content = _opts.desc;
      } else if (_opts.mode == 'custom') {
        content = _opts.component;
      } else {
        data.desc = _opts.desc || '';
        data.need_footer = !!(_opts.button_info1 || _opts.button_info2);
        [1, 2].forEach(i => {
          const buttonInfo = `button_info${i}`;

          if (_opts[buttonInfo]) {
            data[`button_class${i}`] = _opts[buttonInfo].highlight ? 'c_popup__btn_skin' : 'c_popup__btn';
            data[`button_onclick${i}`] = _opts[buttonInfo].fn || '';
            data[`button_title${i}`] = _opts[buttonInfo].title || '';
            data[`button_show${i}`] = 1;
          } else {
            data[`button_show${i}`] = 0;
          }
        });

        if (_opts.mode == 'rich') {
          this.setState({
            richData: data
          });
        } else {
          if (_opts.icon_type >= 0 && _opts.icon_type <= 2) {
            data.class_icon = this.classIconList[_opts.icon_type];
          }

          data.sub_title = _opts.sub_title || '';
          content = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Content, data);
        }
      }

      this.setState({
        opts: _opts,
        content
      }, () => {
        this.setState({
          isShow: 1,
          style: Object.assign({}, this.state.style, {
            width: _opts.width && _opts.width > 0 ? _opts.width : 420,
            height: _opts.height && _opts.height > 0 ? _opts.height : 'auto',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)'
          })
        }, () => {
          if (_opts.mode == 'iframe') {//此时content==inframe
            // setTimeout(() => {
            //     if (content.contentWindow) {
            //         content.contentWindow.focus();
            //     } else if (content.contentDocument && content.contentDocument.documentElement) {
            //         content.contentDocument.documentElement.focus();
            //     }
            // }, 0);
          }
        });

        if (_opts.timeout) {
          this._timerTips = setTimeout(() => {
            this.hide();
          }, _opts.timeout);
        }
      });
    };

    _show(); // if (Dialog.cssLoaded) {
    //     _show();
    // } else {
    //     loadUrl(window.location.protocol + '//y.qq.com/mediastyle/music_v15/popup_20aab0ea.css?max_age=2592000&v=20170314', () => {
    //         Dialog.cssLoaded = 1;
    //         _show();
    //     });
    // }

  }

  hide() {
    this.setState({
      isShow: 0,
      richData: {},
      opts: Object.assign({}, this.defaultOpts),
      content: null
    });

    if (this._timerTips != null) {
      clearTimeout(this._timerTips);
      this._timerTips = null;
    }
  }

  render() {
    const {
      isShow,
      opts,
      richData,
      style,
      content
    } = this.state;
    const {
      mode,
      popup_class,
      title
    } = opts;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      style: { ...style,
        ...{
          display: isShow ? 'block' : 'none',
          zIndex: 10000
        }
      }
    }, mode == 'rich' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(RichDialog, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({
      closeFn: this.hide
    }, richData)) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(CommonDialog, {
      closeFn: this.hide,
      popup_class: popup_class,
      title: title,
      content: content
    }));
  } // 获取


  getArg() {
    return this.state.opts.objArg;
  }

}

const div = document.createElement('div');
document.body.appendChild(div);
const dialog = react_dom__WEBPACK_IMPORTED_MODULE_2__.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Dialog, null), div);

function confirm(title, desc, btn, cb) {
  dialog.show({
    mode: 'common',
    title: 'QQ音乐',
    icon_type: 1,
    sub_title: title,
    desc,
    button_info1: {
      highlight: 1,
      title: btn || '确定',
      fn: () => {
        dialog.hide();
        cb && cb();
      }
    },
    button_info2: {
      highlight: 0,
      title: '取消',
      fn: () => {
        dialog.hide();
      }
    }
  });
}

window.__dialog = dialog;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dialog);

//# sourceURL=webpack://qqmusic/./src/lib/common/dialog.tsx?