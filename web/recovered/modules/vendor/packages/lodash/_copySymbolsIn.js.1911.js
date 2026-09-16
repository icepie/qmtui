var copyObject = __webpack_require__(98363),
    getSymbolsIn = __webpack_require__(51442);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


//# sourceURL=webpack://qqmusic/./node_modules/lodash/_copySymbolsIn.js?