

var utils = __webpack_require__(64867);
var bind = __webpack_require__(91849);
var Axios = __webpack_require__(30321);
var mergeConfig = __webpack_require__(47185);
var defaults = __webpack_require__(45655);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(65263);
axios.CancelToken = __webpack_require__(14972);
axios.isCancel = __webpack_require__(26502);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(8713);

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(16268);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


//# sourceURL=webpack://qqmusic/./node_modules/axios/lib/axios.js?