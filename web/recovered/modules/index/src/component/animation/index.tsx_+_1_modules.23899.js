
// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "W": () => (/* reexport */ animation_EaseInWrapper)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
;// CONCATENATED MODULE: ./src/component/animation/EaseInWrapper.tsx


const EaseInWrapper = props => {
  const {
    className = '',
    children
  } = props;
  return /*#__PURE__*/react.createElement("div", {
    className: "animation__wrapper"
  }, /*#__PURE__*/react.createElement("div", {
    className: `inner__content ${className}`
  }, children));
};

/* harmony default export */ const animation_EaseInWrapper = (EaseInWrapper);
// EXTERNAL MODULE: ./src/component/animation/index.less
var animation = __webpack_require__(55482);
;// CONCATENATED MODULE: ./src/component/animation/index.tsx




//# sourceURL=webpack://qqmusic/./src/component/animation/index.tsx_+_1_modules?