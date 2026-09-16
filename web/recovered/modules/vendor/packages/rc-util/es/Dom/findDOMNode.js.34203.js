/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ findDOMNode)
/* harmony export */ });
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73935);

/**
 * Return if a node is a DOM node. Else will return by `findDOMNode`
 */

function findDOMNode(node) {
  if (node instanceof HTMLElement) {
    return node;
  }

  return react_dom__WEBPACK_IMPORTED_MODULE_0__.findDOMNode(node);
}

//# sourceURL=webpack://qqmusic/./node_modules/rc-util/es/Dom/findDOMNode.js?