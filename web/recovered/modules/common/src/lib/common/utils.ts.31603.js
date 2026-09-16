/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mf": () => (/* binding */ isFunction),
/* harmony export */   "y_": () => (/* binding */ generateUid),
/* harmony export */   "ZZ": () => (/* binding */ generateDom),
/* harmony export */   "xj": () => (/* binding */ translateTime),
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports isObject, isString, isNumber, isBoolean, isPlainObject, isArray, albumDefaultImg, singerDefaultImg, mvDefaultImg, playlistDefaultImg, bannerDefaultImg, extend, filterSameItem, swapListItem */
/* harmony import */ var _cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10045);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12087);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(85622);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);



const isObject = function (obj) {
  return Object.prototype.toString.call(obj) === `[object Object]`;
};
const isString = function (str) {
  return typeof str === 'string';
};
const isNumber = function (num) {
  return typeof num === 'number';
};
const isBoolean = function (bln) {
  return typeof bln === 'boolean';
}; // 是否是空对象

const isPlainObject = function (obj) {
  return isObject(obj) && obj != null && obj != obj.window && Object.getPrototypeOf(obj) == Object.prototype;
};
function isFunction(x) {
  return typeof x === 'function';
}
const isArray = Array.isArray || (x => x && typeof x.length === 'number'); // 专辑默认图 y.qq.com/mediastyle/global/img/album_300.png?max_age=2592000

const albumDefaultImg = 'data:image/png;base64,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'; // 歌手默认图 y.qq.com/mediastyle/global/img/singer_300.png?max_age=2592000

const singerDefaultImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEXLy8u7u7vJycm9vb3Hx8fFxcXCwsLAwMC+vr6/v7/LwEJpAAAACnRSTlMzZjdgO0BHTllUllXTZQAABdJJREFUeNrtncmO01AQRQsTp5sdFwNJ74IaAuww85JBgNglDBLsCEgMO8IksSMIwTZh5m8JYrDxc2L6XcouyDsf0Dqqeq4ql92xBAKBQCAQCAQCgVXmwL3Px9Lk9Jdn13pihovv8Ivk0xUxQf8dfufNQBonug+H5Kk0TDxDGafOSJP0U5SzUWMiYylwMMUiuvV5nR24Vga8xsclzyUsZaOm8xUhyUfgBirYK7XQBjq/inj8GJW8kjpYB9D5npnoZgpUc0tqYBvmJB+vX7j7PMUf0e2JPkNsmROizwi/YySNYw+tjqgzgwdTKWBDa0O0mcBkuCYwGa4ZTIZrDMDgxTjCHHu1awg/dosq++BHotsZ1+HJC9FkDR7oz4Mt+KI7Pqc2sziymcVN+KJ6LbYBWGxAKUxW1CE86UoRE5ULA9FkYrNEHLJ5uFoADM6oazYr13bA4iw4hC9HpEjzdxnaZx5z7N1oxPAmET12ABZHwe3w56GocRaAwfYzgj87JYeV+gDskSLNj4Gq83wET9xmbaRsOYXLxC3GNySPjbGmpJ4a2I2UjPNGirzixLUN/mTdZ1W09oFhKjmsdOqsV6+K1jBo/ftJDFr/ft2KRharfDQDxUnJYWH9XZbF5heUpWsIE4N8cfVmZWL+fT41shbJ5tNV0VqzqdW2ebaMXokt0EgOA+tcdwthZItU2Nn8/82HWQW6izcbi9PimtLMfc+cXZJhZWQuPo0yskYq3GMY6tW5Yd5SU8y1REtNMdcSDXWfRPKYKfMd0WFssZqSKwj3EZmNtfxv9cHQpXhGMuyc+cKJt9IVj0qGoSwWc2hj5HLKg422OBBFrsKT41JC4xvBjWKbNpHGhNg+KK4qXwqB3uKmLFgGskjULM0NiejjYdUVEr5f8zsR/VUEv3zg+yLfD/VXEfy4rP8yxAshICZ6YorXLfP8UKNfT/m7fH61a6OaOjfXNsqWR4XYJXWw3WJ9EGlbvBBFIlTA77X4M2+jI35j0+LRcg5X8xOzzyTYEQK9teBRqYu2vfLwjehXFm3M8b+yaDGHIm2LOZwzs3cdfmPTYg5FYnO19DtjizkU2bTVD3/SMplDkZGdKX7Ld7FTqZsoRSVJT2pnaGcuzbNmY/fgkNq4m95yFndLE6yZzKG0zNXS71om9kdBK2gtImgFraAVtBYStIJW0FrN6bQZrdimVtvU2jTTav71qDJ22LxP3G5tFfidfTaeUS/ZB348Jz/Y/8BvF6jx+O6R5DjMPO7hiRf9tv3VRgvX+qJVZJQSq1Oa0cL3gs83uKRsLS7mcYMr3fNLDvaMeDuXo5UuWUWeJT5AwXF1WS1fJ95Hpzi4tCG3G2rXceqOL+WTWLfG2hVPlk/sETI6xPEirCAlgPAirCq16vdqT1CpVf9nkPopUK1Vt9elFFvXQve2qHIf8NECnoge8Tv4auF1TzJ0E1itpZ/I1h2A0QI+yN+nPwGrhVNuo+I/R8hrIXmqECpSyw0YHypayw0YHypeyw0YHypayw0YHypWqzpgfKh4LT5g/RkUtMiPikYPAD0tJE+IUBFaRMCIUBFaWcDYUPFafMCim4CCFhmweAYoaJEBy0JFa/EBcz+cqq+VDdQeg7GiVjZQE81GTwv4QJx1Rsvj5Fd/UFlfC91bxBWop4XkkZRwA17wWhnvxeEyqtDXwiPi/38VtZJbzj7bg4olpQfdHveP+BUrXW9OkCmsXoDzf24GDyoeF3iylwxW1cMVPlwjEJQ+iiLYk51QioHSz4dtguKo5OH/3gsu5kseClN0uN/urXqEThbodbC8dV44oJhyP69a8XoGWXImAHiyHk2zwRwtPS30mBKvp/WQ+S1aPa0jzInX09rDFFM9rQ7z0956WgnTV/W0cIa5EPW0bjGtR09rKttAoKW1U4YWtXYzA7Oe1l6mbOlpdZj5QU+rKyBQ00LQClpBK2gFraAVtIJW0ApaQStoBa2gFbSCVtAKWkFrVbS+AsQZp+MkLM0OAAAAAElFTkSuQmCCLyogIHx4R3YwMHw3OWMyMDMwOWYxNjNjNjJiM2VmZjYzNTQ5YjQ0NWNmMCAqLw=='; // y.qq.com/mediastyle/global/img/mv_300.png?max_age=2592000

const mvDefaultImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoBAMAAACoBc48AAAAG1BMVEXLy8u8vLy9vb3GxsbBwcHExMS+vr7Dw8PAwMCvp37NAAAACXRSTlMzZl89TUJaRVQOeMoiAAABsElEQVR42u3asU4CQRSF4YtAtvXoKq2rscfGWMobgJWlBB8A3kBMiK8tO0Nix67NcDT/10Jxwlx27s7cAAAAAAAAAAAAAACcVvWpoy6+4gRG6lRHcVWjbldR2kx9PEdZaQn9lnGhfuZRVFtZuzhqvJV0EwWlNbyLDsOm9CoOpIvodCYpStpIl9FpKGkdBW2lj75fK2jZ7z+2KFzzjTSNboPCsSRFv1jnRz4mllWs19udYayRpHu/WA+pibGLtU1N8tQtVqNW7RZL2covVvrB1naxUhd9PXWLFS/am9jFGi5TebnFinEuL7dY8ZjLyy1WbLR3ZRfrUF5usaJKm9DcLVYurxu7WKm8ar9YbXld+8VKHaFfrHFj+WvNJE3sYqX9+s0t1mNuns1iVXJ8yue9595tT0w7de3W2BwKyyzWSK21WXeae9OVWy+fyn1i90KWG2avWEvl/s/srXqm1rPbGcQgPUftDpIqSbXfsVs8Ne+Gh5SuR7rE+oOXKz2voja/i/VfL+5MrzlNL4VNr9BNBw5cxzNMh1lMR39cB6VMx8pch/AAAAAAAAAAAAAAAD++Ad0QYkLovhKaAAAAAElFTkSuQmCCLyogIHx4R3YwMHxjZTlmZGEyN2QwZGE0NjEyYTUzNGI1MTU3ZTk0NGI5ZSAqLw=='; // y.qq.com/mediastyle/global/img/playlist_300.png?max_age=2592000

const playlistDefaultImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAG1BMVEXLy8u8vLzHx8e+vr7BwcHFxcXAwMDJycnDw8OXSXU5AAAACXRSTlMzZjpbTkFUN0fPZ+e5AAADwklEQVR42u3cS3PSUBjG8dcDNCx9CE27BK9dNlbr1tipuiTaUZdGnbFLsF62xXr52gIpc3JpEzPOIe/i+e3aBfMHTk4OyQEhIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiqnT3KMTBseiyl2BlOBU1vJMEa9uihHcSIuOJaOD9DJEzlPaZ3yGKzqVlvd+w/Bf3v79dRg6kVV+PslHHU1kwIRBIO8pRwS+5dAZgJG3Z+wDr8EdmsLV4LO4lsB6+kawIuCltOClE5Y2dj/n6ufPjRIo6wK5Ucxx1OpKy7uYn1DuZKN9G5fQBXzbqIj9NXa236ayLmig7Q8gGnWXmzgreZrOMnTurbTYrTqepRZSmLIOlpyK6sjoA/D+iLStanYK1ZZnV8k5dVhfARF/WDBiKvqw5sKMwKwHeKcxaDi19WT0AU31Zq0WUvqwtIFCY1QGGOrN2FWbdALZ1Zg10Zu0ozJrpzLoB3GQWs5aYxSxmMYtZzGJWilnMYhazmMUsZqWYxawmWXYb1+EPZVnr/REPR5qy7mEtGOnJ6sIaqskyITIeaMmKkTPRkdVLB/vL6ed0t9K2jqzY7o8wERZUZBksvF//kWjJOkP2LlVfS1aUv10c68gyhT3fPR1ZW8U9zHPnWV+fHRwcHk8rs8ZAkO90nOVdYMX/U5UVFW80GrdZXoS15xVZYWmfUuQ0aw7r/NosU95YPXaZ9Q0ZwdRm1e6P6DjMMiGyHl2XtVXeiNB1mBVj6fTlrbcJluJrsjrlO/49d1kGC0E6eb9G6mbdHX/322FnAPyJpF5VZ+1sbjtsmNufGFVllf/vLKufWxVIX8mrNStsIot1jK2kcNh3gUZHoi8ueAD2C2Ot0bwViAvd0hlljEaz/K640Ck93y00OicOxIXyAxs0WkHsiwvz8gOHFeutHbFcfisqKT9w1Gh1OhIXwvLW17jJWj4QJ8Ly8x03+eQzECeu2JE7a/I58Yk4AeB/PlX7U7HaerUMFj5lr0EMxA1Uja36KzYTyXB+JO7XXN+S9fUtyXE9b73716uBkuN6lj//12unBS7PiZVT9xc3X0Gv34XeteuX2uvyJe7WWzMbWncXwx2D4gBP7Ntafc/HqaSwwOyvOls3vuKTz0ha183Pij0lP/LghblV1BzAY1FgnD3W70HHe3h5nhumKXcU/a5JnH57+r539+jyRKdCD0v6fgTmNjJ8FSNrJVL3yzR2/Zt6L4qYI6z4T0WXvQ8hDk71jCsiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIicuYvGi2sI3ounuQAAAAASUVORK5CYIIvKiAgfHhHdjAwfGU5YjUxNzI0ZTU4MmI0MDlkMjZlZDE5MjM1ODg1OWQ1ICov';
const bannerDefaultImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEXLy8seOFHGAAAAAXRSTlMz/za5cAAAAApJREFUCNdjwAsAAB4AAdpxxYoAAAAASUVORK5CYIIvKiAgfHhHdjAwfDdhZGI3NGVkOGJjYjY1YTEzYTE4ODhmMmYxZGU5ZTBlICov';
const playlistPageUrl = 'https://i.y.qq.com/n2/m/share/details/taoge.html?&channelId=10052339&ADTAG=pckhddl&openinqqmusic=1';
/**
 * @method  param2obj
 * @desc param2obj 把url参数形式的字符串 转成object对象
 * @param {string} str
 * @return Object
 * @require zepto
 * @example
    param2obj('a=b&c=3#d=2');
    //{a:'b',c:3}
    */

const param2Obj = function (str) {
  const search = `${str}`.trim().match(/([^?#]*)(#.*)?$/);

  if (!search) {
    return {};
  }

  const searchStr = search[1];
  const searchHash = searchStr.split('&');
  const ret = {};
  searchHash.forEach(function (pair) {
    let temp = '';

    if (temp = pair.split('=', 1)[0]) {
      const key = decodeURIComponent(temp);
      let value = pair.substring(key.length + 1);

      if (value != undefined) {
        value = decodeURIComponent(value);
      }

      if (key in ret) {
        if (ret[key].constructor != Array) {
          ret[key] = [ret[key]];
        }

        ret[key].push(value);
      } else {
        ret[key] = value;
      }
    }
  });
  return ret;
};

const type = function (obj) {
  if (isNaN(obj)) {
    return 'nan';
  } else {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  }
};

const getImg = content => {
  let mid;

  if (content && content.photo && content.photo.pic_mid) {
    mid = content.photo.pic_mid;
  } else if (content && content.pmid) {
    mid = content.pmid;
  } else {
    mid = content.mid;
  }

  if (content.cover) {
    return fixUrl(content.cover);
  } else {
    return getAlbumPic(mid, 300);
  }
};

const param = obj => {
  const resultArr = [];

  const addItem = function (name, value) {
    resultArr.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
  };

  for (const key in obj) {
    const value = obj[key];

    if (typeof value == 'object') {
      addItem(key, param(value));
    } else {
      addItem(key, value);
    }
  }

  return resultArr.join('&').replace(/%20/g, '+');
};
/**
 * 合并对象
 *
 * @param {*} obj 扩展的对象
 * @returns 原生对象
 */


const extend = function (obj, a, b, c) {
  let isDeep = false;
  let targetObj = obj;
  const args = [].slice.call(arguments, 1);

  if (typeof obj == 'boolean') {
    isDeep = obj;
    targetObj = args.shift();
  }

  args.forEach(arg => {
    _extend(targetObj, arg, isDeep);
  });
  return targetObj;

  function _extend(target, source, deep) {
    for (const key in source) {
      const item = source[key];

      if (deep && isPlainObject(item) || Array.isArray(item)) {
        if (isPlainObject(item) && !isPlainObject(target[key])) {
          target[key] = {};
        }

        if (Array.isArray(source[key]) && !Array.isArray(target[key])) {
          target[key] = [];
        }

        _extend(target[key], source[key], deep);
      } else if (item !== undefined) {
        target[key] = item;
      }
    }
  }
};

const fixUrl = url => {
  if (url && Object.prototype.toString.call(url) === '[object String]') {
    if (/^http(s?):\/\//i.test(url)) {
      url = url.replace(/^http(s?):/i, 'https:');
    }

    url = url.replace(/imgcache.qq.com|imgcache.gtimg.cn|y.gtimg.cn/g, 'y.qq.com');

    if (/\.(jpg|png|gif|css|js)$/i.test(url)) {
      url += '?max_age=2592000';
    }
  } else {
    url = 'https://y.qq.com/mediastyle/global/img/banner.png';
  }

  return url;
};

const getAlbumPic = (mid, size) => {
  let url = albumDefaultImg;

  if (typeof mid == 'string' && mid.length >= 14) {
    url = `${'https://y.qq.com/music/photo_new/' + 'T002' + 'R'}${size || 1200}x${size || 1200}M000${mid}.jpg?max_age=2592000`;
  } else {
    url = albumDefaultImg;
  }

  return url;
};
/**
 * 获取默认图
 * @author kevinylzhao
 * @param type
 * @returns {*|string}
 */


const getDefaultImg = imgType => {
  const defaultImg = {
    album: albumDefaultImg,
    singer: singerDefaultImg,
    mv: mvDefaultImg,
    playlist: playlistDefaultImg
  };
  return defaultImg[imgType] || albumDefaultImg;
};
/**
 * 获取url参数
 * @method  getParam
 * @param {string} name 需要获取的url参数名
 * @param {string} url  需要解析的url
 * @return decodeuri之后的参数值
 * @desc 注意: 业务代码从url获取参数后, 务必进行严格的格式和类型校验, 避免xss攻击
 */


const getParam = function (name, url) {
  const u = url || window.location.href;
  const r = new RegExp(`(\\?|&|#)${name}=(.*?)(#|&|$)`, 'i');
  const m = u.match(r);
  return decodeURIComponent(m ? m[2] : '');
};

const paramToUrl = function (parameter) {
  if (!parameter) {
    return;
  }

  if (typeof parameter === 'string') {
    let query = parameter;

    if (parameter.indexOf('?') !== -1) {
      query = parameter.slice(parameter.indexOf('?') + 1);
    }

    const obj = {};
    query.split('&').forEach(elment => {
      const arr = elment.split('=');
      obj[arr[0]] = arr[1];
    });
    return obj;
  } else {
    let url = '';
    Object.keys(parameter).forEach(e => {
      if (!url) {
        url = `${url}${e}=${parameter[e]}`;
      } else {
        url = `${url}&${e}=${parameter[e]}`;
      }
    });
    return url;
  }
};

const returnPreload = function () {
  if (false) {} else {
    return './preload.js';
  }
};

const getVipLogo = function (user, type) {
  let vip;
  let typePath = 'vip'; // vip类型 0：绿钻 1：付费音乐包

  switch (type) {
    case 1:
      typePath = 'pay';
      vip = `sui${user.FfbLevel || '1'}`;

      if (user && user.ieight == 1) {
        vip = `${user.itwelve == 1 ? 's' : ''}${vip}`;

        if (user.Ffbyear == 1 && user.FfbLevel > 0) {
          // 这里豪华付费包的年费标志是y，而普通的是n...
          vip = `${user.itwelve == 1 ? 'y' : 'n'}${vip}`;
        }
      } else {
        vip = `d-${vip}`;
      }

      break;

    case 0:
    default:
      typePath = 'vip';
      vip = `vip${user.iCurLevel || '1'}`;

      if (user && user.vip == 1) {
        vip = `${(user.iYearFlag == 1 && user.iCurLevel > 0 ? 'n' : '') + (user.svip == 1 ? 's' : '')}${vip}`;
      } else {
        vip = `d-${vip}`;
      }

      break;
  }

  return `https://y.qq.com/mediastyle/lv-icon/v10/${typePath}/2x/${vip}.png?max_age=2592000`;
};

const cloneObj = (obj, preventName, notDeep) => {
  if (typeof obj == 'object') {
    const res = Array.isArray(obj) ? [] : {};

    for (const i in obj) {
      if (i != preventName) {
        // @ts-ignore
        res[i] = notDeep ? obj[i] : objectClone(obj[i], preventName, notDeep);
      }
    }

    return res;
  } else if (typeof obj == 'function') {
    const strFunc = obj.toString();
    return notDeep ? obj : new Function(strFunc.substring(strFunc.indexOf('{') + 1, strFunc.length - 1));
  }

  return obj;
};
/**
 * 获取token
 *
 * @param {*} key
 * @returns
 */


const getACSRFToken = function (isCgi) {
  let skey;

  if (isCgi) {
    skey = _cookie__WEBPACK_IMPORTED_MODULE_0__/* .default.get */ .Z.get('qqmusic_key') || _cookie__WEBPACK_IMPORTED_MODULE_0__/* .default.get */ .Z.get('p_skey') || _cookie__WEBPACK_IMPORTED_MODULE_0__/* .default.get */ .Z.get('skey') || _cookie__WEBPACK_IMPORTED_MODULE_0__/* .default.get */ .Z.get('p_lskey') || _cookie__WEBPACK_IMPORTED_MODULE_0__/* .default.get */ .Z.get('lskey');
  } else {
    skey = _cookie__WEBPACK_IMPORTED_MODULE_0__/* .default.get */ .Z.get('skey') || _cookie__WEBPACK_IMPORTED_MODULE_0__/* .default.get */ .Z.get('qqmusic_key');
  }

  let hash = 5381;

  if (skey) {
    for (let i = 0, len = skey.length; i < len; ++i) {
      hash += (hash << 5) + skey.charCodeAt(i);
    }
  }

  return hash & 0x7fffffff;
};

const jumpWithKey = (url, pgv_ref) => {
  url = (url || '').trim();

  if (url.indexOf('http:') < 0 && url.indexOf('https:') < 0) {
    url = location.protocol + url;
  }

  pgv_ref = pgv_ref || '';
  const uin = _cookie__WEBPACK_IMPORTED_MODULE_0__/* .default.get */ .Z.get('qqmusic_uin');
  const key = _cookie__WEBPACK_IMPORTED_MODULE_0__/* .default.get */ .Z.get('qqmusic_key');

  if (uin < 10000) {
    //window.open(url);
    window.open(url);
    return;
  }

  const ptloginUrl = `https://ssl.ptlogin2.qq.com/jump?pgv_ref=${pgv_ref}&keyindex=14&clientuin=${uin}&clientkey=${key}&u1=${encodeURIComponent(url)}`; //window.open(ptloginUrl);

  window.open(ptloginUrl);
};
/**
 * 计算字符串的真实长度
 *
 * @param {string} s 源字符串
 * @param {boolean} [isUTF8=false] 标示是否是utf-8计算
 * @returns {number} 结果长度
 */


const getRealLen = function (s, isUTF8) {
  if (typeof s != 'string') {
    return 0;
  }

  if (!isUTF8) {
    return s.replace(/[^\x00-\xFF]/g, '**').length;
  } else {
    const cc = s.replace(/[\x00-\xFF]/g, '');
    return s.length - cc.length + encodeURI(cc).length / 3;
  }
};

const getBuff = url => {
  const request = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      resolve(request.response);
    };

    request.onerror = error => reject(error);

    request.send();
  });
};
/**
 * 实体替换，把经过html等编码的字符串还原
 *
 * @return {String}
 */


const entityReplace = function (str) {
  return str.replace(/&#38;?/g, '&amp;').replace(/&amp;/g, '&').replace(/&#(\d+);?/g, function (_, b) {
    return String.fromCharCode(b);
  }).replace(/´/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&acute;/gi, "'").replace(/&nbsp;/g, ' ').replace(/&#13;/g, '\n').replace(/(&#10;)|(&#x\w*;)/g, '').replace(/&amp;/g, '&');
};
/**
 * 对字符串中的单引号和双引号转换成对应的中文字符
 *
 * @return {String}
 */


const myEncode = function (str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\/, '＼').replace(/\'/g, '’').replace(/\"/g, '“').replace(/&#39;/g, '’').replace(/&quot;/g, '“').replace(/&acute;/g, '’').replace(/\%/g, '％').replace(/\(/g, '（').replace(/\)/g, '）').replace(/\n/g, '');
};

const formatDate = unixTime => {
  const curDate = new Date();
  const curDate_y = curDate.getFullYear();
  const curDate_m = curDate.getMonth() + 1;
  const curDate_d = curDate.getDate();

  if (unixTime > 0) {
    const _unixTime = new Date(unixTime * 1000);

    if (_unixTime.toString() == 'Invalid Date') {
      return '';
    }

    const y = _unixTime.getFullYear();

    const m = _unixTime.getMonth() + 1;

    const d = _unixTime.getDate();

    const h = _unixTime.getHours();

    const mm = _unixTime.getMinutes();

    let str = '';

    if (y != curDate_y) {
      str += `${y}年`;
    }

    if (y != curDate_y || m != curDate_m || d != curDate_d) {
      str += `${m}月${d}日 `;
    }

    return `${str + (h < 10 ? `0${h}` : h)}:${mm < 10 ? `0${mm}` : mm}`;
  }

  return '';
};

const filterSameItem = list => {
  const set = new Set();
  return list.map(item => {
    if (set.has(item.id)) return null;
    set.add(item.id);
    return item;
  }).filter(item => item !== null);
};
const swapListItem = (list, p, q) => {
  const temp = list[p];
  list[p] = list[q];
  list[q] = temp;
  return [...list];
};
const generateUid = pre => `divPopup_${pre || ''}`;
const generateDom = id => {
  const e = document.querySelector(`#${id}`);

  if (!e) {
    const div = document.createElement('div');
    div.id = id;
    const content = document.body;
    content.appendChild(div);
  }

  return id;
};

const firstUpperCase = str => str.replace(/^\S/, item => item.toUpperCase());
/**
 * 添加url参数
 * @method addParam
 * @param {object|string} obj  需要添加的参数 可以是对象 也可以是字符串
 * @param {string} url 需要操作的url
 * @return 添加url参数之后的url
 */


const addParam = function (obj, url) {
  url = url || window.location.href;

  if (typeof obj !== 'object' && !obj) {
    return url;
  }

  let p = obj;

  if (typeof obj === 'object') {
    p = [];
    Object.keys(obj).forEach(key => {
      p.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    });
    p = p.join('&');
  }

  if (!/\?/.test(url) && !/#/.test(url)) {
    url = `${url}?${p}`;
  } else if (/\?/.test(url) && !/#/.test(url)) {
    url = `${url}&${p}`;
  } else if (!/\?/.test(url) && /#/.test(url)) {
    url = url.replace('#', `?${p}#`);
  } else {
    url = url.replace('?', `?${p}&`);
  }

  return url;
};
/**
 * 字符串正规化
 * @param {*} data
 * @param {*} isSecurityCGI
 * @returns
 */


const dataToNormalizeStr = function (data, isSecurityCGI) {
  let str = JSON.stringify(data); // 匹配中文、unicode<128、以及常见中文标点符号：— ‘ ’ “ ” … 、 。〈 〉 《 》 「 」『 』【 】〔 〕﹃ ﹄ ﹏ ！ （ ） ， ： ； ？ ～ ￥

  const normarRegx = /[^\u4e00-\u9fa5|\u0000-\u0080|\u2014|\u2018|\u2019|\u201c|\u201d|\u2026|\u3001|\u3002|\u3008-\u3011|\u3014|\u3015|\ufe43|\ufe44|\ufe4f|\uff01|\uff08|\uff09|\uff0c|\uff1a|\uff1b|\uff1f|\uff5e|\uffe5]/;

  if (isSecurityCGI && String.prototype.normalize && normarRegx.test(str)) {
    str = str.normalize('NFC');
  }

  return str;
};

const utils = {
  swapListItem,
  getRealLen,
  jumpWithKey,
  cloneObj,
  isArray,
  isString,
  isObject,
  isNumber,
  isBoolean,
  albumDefaultImg,
  singerDefaultImg,
  bannerDefaultImg,
  getDefaultImg,
  param,
  param2Obj,
  getACSRFToken,
  extend,
  isPlainObject,
  type,
  fixUrl,
  getAlbumPic,
  getVipLogo,
  getParam,
  paramToUrl,
  returnPreload,
  isFunction,
  getImg,
  getBuff,
  entityReplace,
  myEncode,
  filterSameItem,
  formatDate,
  playlistPageUrl,
  firstUpperCase,
  addParam,
  dataToNormalizeStr
};
const translateTime = time => {
  let minute = Math.floor(time / 60);
  let second = Math.floor(time) % 60;
  if (minute < 10) minute = `0${minute}`;
  if (second < 10) second = `0${second}`;
  return `${minute}:${second}`;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (utils);

//# sourceURL=webpack://qqmusic/./src/lib/common/utils.ts?