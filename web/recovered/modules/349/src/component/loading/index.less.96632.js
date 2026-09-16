var api = __webpack_require__(93379);
            var content = __webpack_require__(75224);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.id, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

//# sourceURL=webpack://qqmusic/./src/component/loading/index.less?