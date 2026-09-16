/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;


//# sourceURL=webpack://qqmusic/./node_modules/lodash/_freeGlobal.js?