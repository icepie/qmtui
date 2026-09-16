/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);

const icons = {
  normal: 'mod_btn',
  play: 'mod_btn mod_btn_icon mod_btn_play',
  down: 'mod_btn mod_btn_icon mod_btn_down',
  batch: 'mod_btn mod_btn_icon mod_btn_batch',
  focus: 'mod_btn mod_btn_icon mod_btn_focus',
  done: 'mod_btn mod_btn_icon mod_btn_done',
  radio: 'mod_btn mod_btn_icon mod_btn_radio',
  loved: 'mod_btn mod_btn_icon mod_btn_loved',
  love: 'mod_btn mod_btn_icon mod_btn_love',
  more: 'mod_btn mod_btn_icon mod_btn_more',
  share: 'mod_btn mod_btn_icon mod_btn_share'
};
class Button extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  /**
      @type       按钮类型           string(按钮类型见下)
      @highlight  按钮是否高亮背景    true || false
      @stroke     按钮是否为空心      true || false
      @disable    按钮是否禁用        true || false
      @extra      额外的类名          string
      @text       按钮内容            string
       normal: 普通按钮
      play  : 播放
      down  : 下载
      batch : 批量
      focus : 关注
      done  : 已关注
      radio : 电台
      love  : 喜欢
      loved : 已喜欢
      more  : 更多
      share : 分享
   **/
  render() {
    const {
      config,
      style = {},
      disabled,
      disabledStyle = {}
    } = this.props;
    if (!config.type) config.type = 'normal';
    const type = icons[config.type];
    const highlight = config.highlight ? ' c_btn_skin' : config.stroke ? ' ' : ' c_btn';
    const stroke = config.highlight ? '' : config.stroke ? ' c_btn_line' : ''; // 有c_btn_skin的就不要c_btn_line

    const disable = config.disable ? ' c_b tn_disable' : '';
    const extra = config.extra ? ` ${config.extra.trim()}` : '';
    const text = config.text ? config.text : '按钮';
    const {
      clickFun
    } = this.props;

    const _style = disabled ? { ...style,
      ...disabledStyle
    } : style;

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
      className: type + highlight + stroke + disable + extra,
      onClick: ev => {
        if (disabled) {
          ev.preventDefault();
          ev.stopPropagation();
          return;
        }

        clickFun && clickFun(ev);
      },
      style: _style
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
      className: "btn__cover"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
      className: "btn__txt"
    }, text));
  }

}

//# sourceURL=webpack://qqmusic/./src/lib/components/button/index.tsx?