/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67154);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67294);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(73935);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(31603);




let Utils = {
  html(el, content) {
    if (!!content) {
      el.innerHTML = content;
    } else {
      return el.innerHTML;
    }
  },

  addClass(el, className) {
    if (el.classList) el.classList.add(className);else el.className += ` ${className}`;
  },

  removeClass(el, className) {
    if (el.classList) el.classList.remove(className);else el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');
  },

  width(el) {
    return el && el.getBoundingClientRect().width;
  },

  height(el) {
    return el && el.getBoundingClientRect().height;
  },

  css(el, key, value) {
    let cssTxt = '';

    if (_utils__WEBPACK_IMPORTED_MODULE_3__/* .default.isObject */ .ZP.isObject(key)) {
      for (const k in key) {
        cssTxt += `${k}:${key[k]};`;
      }
    } else if (_utils__WEBPACK_IMPORTED_MODULE_3__/* .default.isString */ .ZP.isString(key) && value !== undefined) {
      cssTxt = `${key}:${value};`;
    }

    el.style.cssText = el.style.cssText + cssTxt;
  }

};
let wH = document.documentElement.clientHeight || document.body.clientHeight;
let wW = document.documentElement.clientWidth || document.body.clientWidth;
const class_icon_list = ['popup_tips__warn', 'popup_tips__wright'];
Utils = Object.assign({}, Utils, _utils__WEBPACK_IMPORTED_MODULE_3__/* .default */ .ZP); // 监测窗口变化

window.addEventListener('resize', function () {
  wH = document.documentElement.clientHeight || document.body.clientHeight;
  wW = document.documentElement.clientWidth || document.body.clientWidth;
});

class Popup extends react__WEBPACK_IMPORTED_MODULE_1__.Component {
  constructor(props) {
    super(props);
    this._timerTips = void 0;
    this.state = {
      type: props.type == undefined ? 1 : props.type,
      title: props.title || '',
      desc: props.desc || '',
      timeout: props.timeout || 1200,
      classPopup: 'mod_popup_tips',
      showPopup: true
    };
    this._timerTips = null;
  } // 显示不同的


  _position() {
    // Utils.addClass(document.querySelector('#' + domId), 'js_popup');
    // 计算定位
    wH = document.documentElement.clientHeight || document.body.clientHeight;
    wW = document.documentElement.clientWidth || document.body.clientWidth;
    const $pop = document.querySelector(`.${this.state.classPopup}`);

    if ($pop) {
      const w = Utils.width($pop);
      const h = Utils.height($pop);
      const l = (wW - w) / 2;
      const t = (wH - h) / 2;
      Utils.css($pop, {
        left: `${l}px`,
        top: `${t}px`
      }); // 关闭提示

      if (this._timerTips) {
        clearTimeout(this._timerTips);
        this._timerTips = null;
      }

      this._timerTips = setTimeout(() => {
        this.setState({
          showPopup: false
        });
      }, this.state.timeout);
    }
  }

  show() {
    this.setState({
      showPopup: true
    });
  }

  hide() {
    this.setState({
      showPopup: false
    });
  }

  componentDidMount() {
    this._position();
  }

  componentDidUpdate() {
    this._position();
  }

  static getDerivedStateFromProps(props) {
    return {
      type: props.type,
      title: props.title,
      desc: props.desc,
      timeout: props.timeout || 1200
    };
  }

  render() {
    const {
      showPopup,
      classPopup,
      type,
      title,
      desc
    } = this.state;

    if (showPopup) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classPopup,
        style: {
          zIndex: 100000
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "popup_tips__inner"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("i", {
        className: `popup_tips__icon ${class_icon_list[type]}`
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        className: 'popup_tips__tit',
        style: {
          display: title ? '' : 'none'
        }
      }, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("p", {
        className: 'popup_tips__desc',
        style: {
          display: desc ? '' : 'none'
        }
      }, desc)));
    } else {
      return null;
    }
  }

}

// 歌手信息
class SingerInfo extends react__WEBPACK_IMPORTED_MODULE_1__.Component {
  constructor(props) {
    super(props);
    this.timer = void 0;
    this.state = {
      zIndex: 500,
      isShow: true
    };
  }

  hide() {
    clearTimeout(this.timer);
    this.setState({
      isShow: false
    });
  }

  show() {
    this.timer = setTimeout(() => {
      this.setState({
        isShow: true
      });
    }, 500);
  }

  render() {
    const singerhtml = [];
    let separator = '';
    const {
      data
    } = this.props;
    const {
      zIndex,
      isShow
    } = this.state;
    let left = this.props.x;
    let top = this.props.y + 20; // const height = Utils.height(document.querySelector('.js_singerinfo_popup'));

    const width = Utils.width(document.querySelector('.js_singerinfo_popup'));

    if (wH < this.props.y + 70) {
      // 浮层可能出现不完，则从鼠标上方展现浮层
      top = this.props.y - 40;
    }

    if (wW < this.props.x + width + 30) {
      // 浮层可能出现不完，则左侧与浏览器左边界-20px处对齐
      left = wW - width - 30;
    }

    if (!isShow) {
      return null;
    }

    data.singer.forEach((item, idx) => {
      separator = idx == 0 ? '' : ' / ';
      singerhtml.push(separator);
      singerhtml.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
        className: "c_tx_thin",
        key: `pop_singer${item.name}`
      }, item.name));
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "js_singerinfo_popup mod_hover_tips c_bg_floor",
      style: {
        position: 'absolute',
        left,
        top,
        zIndex
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
      className: "hover_tips__inner"
    }, singerhtml));
  }

}

const popupRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createRef();
const singerPropUpRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createRef();
/**
 *
 * @param type 0显示感叹号图标，1显示√图标
 * @param title
 * @param desc
 * @param timeout
 */

const show = (type, title, desc, timeout) => {
  var _popupRef$current;

  const domId = (0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .generateDom */ .ZZ)((0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .generateUid */ .y_)(0));
  Utils.addClass(document.querySelector(`#${domId}`), 'js_popup');
  react_dom__WEBPACK_IMPORTED_MODULE_2__.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Popup, {
    type: type,
    title: title,
    desc: desc,
    timeout: timeout,
    ref: popupRef
  }), document.querySelector(`#${domId}`));
  popupRef === null || popupRef === void 0 ? void 0 : (_popupRef$current = popupRef.current) === null || _popupRef$current === void 0 ? void 0 : _popupRef$current.show();
};

const showSinger = opt => {
  var _singerPropUpRef$curr, _singerPropUpRef$curr2, _singerPropUpRef$curr3;

  const domId = (0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .generateDom */ .ZZ)((0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .generateUid */ .y_)(2));
  Utils.addClass(document.querySelector(`#${domId}`), 'js_popup');
  react_dom__WEBPACK_IMPORTED_MODULE_2__.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(SingerInfo, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, opt, {
    ref: singerPropUpRef
  })), document.querySelector(`#${domId}`));
  singerPropUpRef === null || singerPropUpRef === void 0 ? void 0 : (_singerPropUpRef$curr = singerPropUpRef.current) === null || _singerPropUpRef$curr === void 0 ? void 0 : _singerPropUpRef$curr.show();
  return {
    show: singerPropUpRef === null || singerPropUpRef === void 0 ? void 0 : (_singerPropUpRef$curr2 = singerPropUpRef.current) === null || _singerPropUpRef$curr2 === void 0 ? void 0 : _singerPropUpRef$curr2.show.bind(singerPropUpRef),
    hide: singerPropUpRef === null || singerPropUpRef === void 0 ? void 0 : (_singerPropUpRef$curr3 = singerPropUpRef.current) === null || _singerPropUpRef$curr3 === void 0 ? void 0 : _singerPropUpRef$curr3.hide.bind(singerPropUpRef)
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  show,
  showSinger,
  singerPropUpRef
});

//# sourceURL=webpack://qqmusic/./src/lib/common/popup.tsx?