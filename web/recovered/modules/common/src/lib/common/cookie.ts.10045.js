/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const doc = document ? document : {
  cookie: ''
};
const cookie = {
  /**
   * 设置一个cookie,还有一点需要注意的，在qq.com下是无法获取qzone.qq.com的cookie，反正qzone.qq.com下能获取到qq.com的所有cookie.
   * 简单得说，子域可以获取根域下的cookie, 但是根域无法获取子域下的cookie.
   *
   * @param {String} name cookie名称
   * @param {String} value cookie值
   * @param {String} domain 所在域名
   * @param {String} path 所在路径
   * @param {Number} hour 存活时间，单位:小时
   * @return {Boolean} 是否成功
   * @example
   *  cookie.set('value1',$('t1').value,"qzone.qq.com","/v5",24); // 设置cookie
   */
  set(name, value, domain, path, hour) {
    if (hour) {
      var expire = new Date();
      expire.setTime(expire.getTime() + 3600000 * hour);
    }

    doc.cookie = `${name}=${value}; ${expire ? `expires=${expire.toUTCString()};` : ''}domain=${domain || window.location.host};` + `path=${path || '/'};`;
  },

  /**
   * 获取指定名称的cookie值
   *
   * @param {String} name cookie名称
   * @return {String} 获取到的cookie值
   * @example
   *  cookie.get('value1'); // 获取cookie
   */
  get(name) {
    const filterXSS = function (e) {
      if (!e) return e;

      for (; e != decodeURIComponent(e);) {
        e = decodeURIComponent(e);
      }

      const r = ['<', '>', "'", '"', '%3c', '%3e', '%27', '%22', '%253c', '%253e', '%2527', '%2522'];
      const n = ['&#x3c;', '&#x3e;', '&#x27;', '&#x22;', '%26%23x3c%3B', '%26%23x3e%3B', '%26%23x27%3B', '%26%23x22%3B', '%2526%2523x3c%253B', '%2526%2523x3e%253B', '%2526%2523x27%253B', '%2526%2523x22%253B'];

      for (let i = 0; i < r.length; i++) {
        e = e.replace(new RegExp(r[i], 'gi'), n[i]);
      }

      return e;
    };

    let a;
    return filterXSS((a = doc.cookie.match(RegExp(`(^|;\\s*)${name}=([^;]*)(;|$)`))) ? decodeURIComponent(a[2]) : '');
  },

  /**
   * 删除指定cookie,复写为过期
   *
   * @param {String} name cookie名称
   * @param {String} domain 所在域
   * @param {String} path 所在路径
   * @example
   *    cookie.del('value1'); // 删除cookie
   */
  del(name, domain, path) {
    doc.cookie = `${name}=; expires=Mon, 26 Jul 1997 05:00:00 GMT;${path ? `path=${path}; ` : 'path=/; '}domain=${domain || window.location.host};`;
  }

};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cookie);

//# sourceURL=webpack://qqmusic/./src/lib/common/cookie.ts?