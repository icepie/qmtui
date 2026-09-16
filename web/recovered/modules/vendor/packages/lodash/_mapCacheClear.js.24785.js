var Hash = __webpack_require__(1989),
    ListCache = __webpack_require__(38407),
    Map = __webpack_require__(57071);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


//# sourceURL=webpack://qqmusic/./node_modules/lodash/_mapCacheClear.js?