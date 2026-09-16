

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


//# sourceURL=webpack://qqmusic/./node_modules/axios/lib/cancel/isCancel.js?