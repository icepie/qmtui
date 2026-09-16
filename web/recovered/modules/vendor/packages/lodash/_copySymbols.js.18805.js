var copyObject = __webpack_require__(98363),
    getSymbols = __webpack_require__(99551);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


//# sourceURL=webpack://qqmusic/./node_modules/lodash/_copySymbols.js?