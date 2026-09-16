module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};


//# sourceURL=webpack://qqmusic/./node_modules/isarray/index.js?