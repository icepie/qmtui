var baseCreate = __webpack_require__(3118),
    getPrototype = __webpack_require__(85924),
    isPrototype = __webpack_require__(25726);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


//# sourceURL=webpack://qqmusic/./node_modules/lodash/_initCloneObject.js?