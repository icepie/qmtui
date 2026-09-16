var baseIsEqual = __webpack_require__(90939),
    get = __webpack_require__(27361),
    hasIn = __webpack_require__(79095),
    isKey = __webpack_require__(15403),
    isStrictComparable = __webpack_require__(89162),
    matchesStrictComparable = __webpack_require__(42634),
    toKey = __webpack_require__(40327);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


//# sourceURL=webpack://qqmusic/./node_modules/lodash/_baseMatchesProperty.js?