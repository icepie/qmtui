
// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ popover)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(22122);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
// EXTERNAL MODULE: ./node_modules/antd/es/tooltip/index.js + 4 modules
var tooltip = __webpack_require__(29135);
// EXTERNAL MODULE: ./node_modules/antd/es/config-provider/context.js + 4 modules
var context = __webpack_require__(86032);
;// CONCATENATED MODULE: ./node_modules/antd/es/_util/getRenderPropValue.js
var getRenderPropValue = function getRenderPropValue(propValue) {
  if (!propValue) {
    return null;
  }

  var isRenderFunction = typeof propValue === 'function';

  if (isRenderFunction) {
    return propValue();
  }

  return propValue;
};
// EXTERNAL MODULE: ./node_modules/antd/es/_util/motion.js
var motion = __webpack_require__(33603);
;// CONCATENATED MODULE: ./node_modules/antd/es/popover/index.js


var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};






var Popover = /*#__PURE__*/react.forwardRef(function (_a, ref) {
  var customizePrefixCls = _a.prefixCls,
      title = _a.title,
      content = _a.content,
      otherProps = __rest(_a, ["prefixCls", "title", "content"]);

  var _React$useContext = react.useContext(context/* ConfigContext */.E_),
      getPrefixCls = _React$useContext.getPrefixCls;

  var getOverlay = function getOverlay(prefixCls) {
    return /*#__PURE__*/react.createElement(react.Fragment, null, title && /*#__PURE__*/react.createElement("div", {
      className: "".concat(prefixCls, "-title")
    }, getRenderPropValue(title)), /*#__PURE__*/react.createElement("div", {
      className: "".concat(prefixCls, "-inner-content")
    }, getRenderPropValue(content)));
  };

  var prefixCls = getPrefixCls('popover', customizePrefixCls);
  var rootPrefixCls = getPrefixCls();
  return /*#__PURE__*/react.createElement(tooltip/* default */.Z, (0,esm_extends/* default */.Z)({}, otherProps, {
    prefixCls: prefixCls,
    ref: ref,
    overlay: getOverlay(prefixCls),
    transitionName: (0,motion/* getTransitionName */.m)(rootPrefixCls, 'zoom-big', otherProps.transitionName)
  }));
});
Popover.displayName = 'Popover';
Popover.defaultProps = {
  placement: 'top',
  trigger: 'hover',
  mouseEnterDelay: 0.1,
  mouseLeaveDelay: 0.1,
  overlayStyle: {}
};
/* harmony default export */ const popover = (Popover);

//# sourceURL=webpack://qqmusic/./node_modules/antd/es/popover/index.js_+_1_modules?