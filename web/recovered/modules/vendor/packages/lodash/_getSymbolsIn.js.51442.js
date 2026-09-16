var arrayPush = __webpack_require__(62488),
    getPrototype = __webpack_require__(85924),
    getSymbols = __webpack_require__(99551),
    stubArray = __webpack_require__(70479);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


//# sourceURL=webpack://qqmusic/./node_modules/lodash/_getSymbolsIn.js?