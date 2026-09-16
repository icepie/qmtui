/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "J": () => (/* binding */ Ping)
/* harmony export */ });
/**
 * 点击流上报 lunardai 2018.4.26
 */
//var DOMAIN = 'https://pingforey.qq.com';
var _n = '-';

function send(url) {
  var userOptions = {
    headers: new Headers({
      cookie: document.cookie
    })
  };
  fetch(url, userOptions);
}

function getDomainInfo(url) {
  if (!url) {
    return {};
  }

  var arrUrl = url.split('//');
  var start = arrUrl[1].indexOf('/');
  var dm = arrUrl[1].substring(0, start);
  var url = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符

  if (url.indexOf('?') != -1) {
    url = url.split('?')[0];
  }

  return {
    domain: dm,
    url: url
  };
}

class Ping {
  constructor(url, cookies) {
    this.url = void 0;
    this.cookies = void 0;
    this.url = url;
    this.cookies = cookies;
  }

  init(url) {
    this.url = url;
  }
  /**
   * 指定按钮点击上报//https://pingfore.qq.com/pingd?dm=y.qq.com.hot&url=/&hottag=Y_NEW.INDEX.PLAYLIST.1&hotx=9999&hoty=9999&rand=11912
   * {@link M.ping.pgvSendClick}
   */


  pgvSendClick(hottag) {
 return;   let _url = 'https://pingfore.qq.com/pingd?dm=' + getDomainInfo(this.url).domain + '.hot&url=/&hottag=' + hottag + '&hotx=9999&hoty=9999&rand=' + Math.round(Math.random() * 1e5);

    send(_url);
  }

}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  Ping: Ping
});

//# sourceURL=webpack://qqmusic/./src/lib/common/ping.ts?