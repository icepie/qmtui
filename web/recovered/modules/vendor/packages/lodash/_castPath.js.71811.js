var isArray = __webpack_require__(1469),
    isKey = __webpack_require__(15403),
    stringToPath = __webpack_require__(55514),
    toString = __webpack_require__(79833);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


//# sourceURL=webpack://qqmusic/./node_modules/lodash/_castPath.js?