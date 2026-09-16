/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZP": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "AV": () => (/* binding */ EventCtgr)
/* harmony export */ });
/* unused harmony export EventType */
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/* eslint-disable @typescript-eslint/naming-convention */
// 从jsencrypt中剥离出来的代码
// prng4.js - uses Arcfour as a PRNG
var Arcfour = /*#__PURE__*/function () {
  function Arcfour() {
    _classCallCheck(this, Arcfour);

    _defineProperty(this, "i", void 0);

    _defineProperty(this, "j", void 0);

    _defineProperty(this, "S", void 0);

    this.i = 0;
    this.j = 0;
    this.S = [];
  } // Arcfour.prototype.init = ARC4init;
  // Initialize arcfour context from key, an array of ints, each from [0..255]


  _createClass(Arcfour, [{
    key: "init",
    value: function init(key) {
      var i;
      var j;
      var t;

      for (i = 0; i < 256; ++i) {
        this.S[i] = i;
      }

      j = 0;

      for (i = 0; i < 256; ++i) {
        j = j + this.S[i] + key[i % key.length] & 255;
        t = this.S[i];
        this.S[i] = this.S[j];
        this.S[j] = t;
      }

      this.i = 0;
      this.j = 0;
    } // Arcfour.prototype.next = ARC4next;

  }, {
    key: "next",
    value: function next() {
      this.i = this.i + 1 & 255;
      this.j = this.j + this.S[this.i] & 255;
      var t = this.S[this.i];
      this.S[this.i] = this.S[this.j];
      this.S[this.j] = t;
      return this.S[t + this.S[this.i] & 255];
    }
  }]);

  return Arcfour;
}(); // Plug in your RNG constructor here

function prng_newstate() {
  return new Arcfour();
} // Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()

var rng_psize = 256;

var _window$crypto;
var rng_state;
var rng_pool = [];
var rng_pptr = 0; // Initialize the pool with junk if needed.

if ((_window$crypto = window.crypto) !== null && _window$crypto !== void 0 && _window$crypto.getRandomValues) {
  // Extract entropy (2048 bits) from RNG if available
  var z = new Uint32Array(256);
  window.crypto.getRandomValues(z);
  var t;

  for (t = 0; t < z.length; ++t) {
    rng_pool[rng_pptr++] = z[t] & 255;
  }
}

function rng_get_byte() {
  if (rng_state === null || rng_state === undefined) {
    rng_state = prng_newstate(); // At this point, we may not have collected enough entropy.  If not, fall back to Math.random

    while (rng_pptr < rng_psize) {
      var random = Math.floor(65536 * Math.random());
      rng_pool[rng_pptr++] = random & 255;
    }

    rng_state.init(rng_pool);

    for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
      rng_pool[rng_pptr] = 0;
    }

    rng_pptr = 0;
  } // TODO: allow reseeding after first request


  return rng_state.next();
}

var SecureRandom = /*#__PURE__*/function () {
  function SecureRandom() {
    _classCallCheck(this, SecureRandom);
  }

  _createClass(SecureRandom, [{
    key: "nextBytes",
    value: function nextBytes(ba) {
      for (var i = 0; i < ba.length; ++i) {
        ba[i] = rng_get_byte();
      }
    }
  }]);

  return SecureRandom;
}();

var regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && regex.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = "".concat(byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]], "-").concat(byteToHex[arr[offset + 4]]).concat(byteToHex[arr[offset + 5]], "-").concat(byteToHex[arr[offset + 6]]).concat(byteToHex[arr[offset + 7]], "-").concat(byteToHex[arr[offset + 8]]).concat(byteToHex[arr[offset + 9]], "-").concat(byteToHex[arr[offset + 10]]).concat(byteToHex[arr[offset + 11]]).concat(byteToHex[arr[offset + 12]]).concat(byteToHex[arr[offset + 13]]).concat(byteToHex[arr[offset + 14]]).concat(byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

// 从uuidjs中剥离出来的代码

function v4() {
  var rng = new SecureRandom();
  var rnds = new Array(16); // console.log(rnds);

  rng.nextBytes(rnds); // console.log(rnds);
  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;
  return stringify(rnds);
}

var requset = function requset(url, data) {
  var retry = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  data = typeof data === 'string' ? data : JSON.stringify(data);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.timeout = 10000; // 10s超时

  if (retry) {
    xhr.onreadystatechange = function () {
      if (xhr && xhr.readyState === 4) {
        if (xhr.status >= 400) {
          requset(url, data, false);
        }

        xhr = null;
      }
    };

    var onRetry = function onRetry() {
      if (!xhr) {
        return;
      }

      requset(url, data, false);
      xhr = null;
    };

    xhr.onabort = onRetry;
    xhr.onerror = onRetry;
    xhr.ontimeout = onRetry;
  }

  xhr.send(data);
};

// 可能在node环境中被引入
var _ref = window || {},
    location = _ref.location,
    navigator = _ref.navigator;

var ua = (navigator || {}).userAgent;

/* eslint-disable no-plusplus */

/* eslint-disable @typescript-eslint/naming-convention */
// 从jsencrypt中剥离出来的代码
var BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz';
function int2char(n) {
  return BI_RM.charAt(n);
} // #region BIT_OPERATIONS
// (public) this & a

function op_and(x, y) {
  return x & y;
} // (public) this | a

function op_or(x, y) {
  return x | y;
} // (public) this ^ a

function op_xor(x, y) {
  return x ^ y;
} // (public) this & ~a

function op_andnot(x, y) {
  return x & ~y;
} // return index of lowest 1-bit in x, x < 2^31

function lbit(x) {
  if (x == 0) {
    return -1;
  }

  var r = 0;

  if ((x & 0xffff) == 0) {
    x >>= 16;
    r += 16;
  }

  if ((x & 0xff) == 0) {
    x >>= 8;
    r += 8;
  }

  if ((x & 0xf) == 0) {
    x >>= 4;
    r += 4;
  }

  if ((x & 3) == 0) {
    x >>= 2;
    r += 2;
  }

  if ((x & 1) == 0) {
    ++r;
  }

  return r;
} // return number of 1 bits in x

function cbit(x) {
  var r = 0;

  while (x != 0) {
    x &= x - 1;
    ++r;
  }

  return r;
} // #endregion BIT_OPERATIONS

// eslint-disable-next-line max-len

var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1]; // #endregion

var BigInteger = /*#__PURE__*/function () {
  // #endregion FIELDS
  function BigInteger(a, b, c) {
    _classCallCheck(this, BigInteger);

    _defineProperty(this, "s", void 0);

    _defineProperty(this, "t", void 0);

    _defineProperty(this, "DB", void 0);

    _defineProperty(this, "DM", void 0);

    _defineProperty(this, "DV", void 0);

    _defineProperty(this, "FV", void 0);

    _defineProperty(this, "F1", void 0);

    _defineProperty(this, "F2", void 0);

    _defineProperty(this, "am", void 0);

    // (public) Constructor
    // Mozilla/Netscape seems to prefer am3
    var am = am3; // Bits per digit

    var dbits = 28;

    if ( navigator && navigator.appName == 'Microsoft Internet Explorer') {
      am = am2;
      dbits = 30;
    } else if ( navigator && navigator.appName != 'Netscape') {
      am = am1;
      dbits = 26;
    } else {
      // Mozilla/Netscape seems to prefer am3
      am = am3;
      dbits = 28;
    }

    this.am = am;
    this.DB = dbits;
    this.DM = (1 << dbits) - 1;
    this.DV = 1 << dbits;
    var BI_FP = 52;
    this.FV = Math.pow(2, BI_FP);
    this.F1 = BI_FP - dbits;
    this.F2 = 2 * dbits - BI_FP;

    if (a != null) {
      if ('number' === typeof a) {
        if (!!b) {
          this.fromNumber(a, b, c);
        } else {
          this.fromNumber(a, b, c);
        }
      } else if (b == null && 'string' !== typeof a) {
        this.fromString(a, 256);
      } else {
        this.fromString(a, b);
      }
    }
  } // #region PUBLIC
  // BigInteger.prototype.toString = bnToString;
  // (public) return string representation in given radix


  _createClass(BigInteger, [{
    key: "toString",
    value: function toString(b) {
      if (this.s < 0) {
        return "-".concat(this.negate().toString(b));
      }

      var k;

      if (b == 16) {
        k = 4;
      } else if (b == 8) {
        k = 3;
      } else if (b == 2) {
        k = 1;
      } else if (b == 32) {
        k = 5;
      } else if (b == 4) {
        k = 2;
      } else {
        return this.toRadix(b);
      }

      var km = (1 << k) - 1;
      var d;
      var m = false;
      var r = '';
      var i = this.t;
      var p = this.DB - i * this.DB % k;

      if (i-- > 0) {
        if (p < this.DB && (d = this[i] >> p) > 0) {
          m = true;
          r = int2char(d);
        }

        while (i >= 0) {
          if (p < k) {
            d = (this[i] & (1 << p) - 1) << k - p;
            d |= this[--i] >> (p += this.DB - k);
          } else {
            d = this[i] >> (p -= k) & km;

            if (p <= 0) {
              p += this.DB;
              --i;
            }
          }

          if (d > 0) {
            m = true;
          }

          if (m) {
            r += int2char(d);
          }
        }
      }

      return m ? r : '0';
    } // BigInteger.prototype.negate = bnNegate;
    // (public) -this

  }, {
    key: "negate",
    value: function negate() {
      var r = nbi();
      BigInteger.ZERO.subTo(this, r);
      return r;
    } // BigInteger.prototype.abs = bnAbs;
    // (public) |this|

  }, {
    key: "abs",
    value: function abs() {
      return this.s < 0 ? this.negate() : this;
    } // BigInteger.prototype.compareTo = bnCompareTo;
    // (public) return + if this > a, - if this < a, 0 if equal

  }, {
    key: "compareTo",
    value: function compareTo(a) {
      var r = this.s - a.s;

      if (r != 0) {
        return r;
      }

      var i = this.t;
      r = i - a.t;

      if (r != 0) {
        return this.s < 0 ? -r : r;
      }

      while (--i >= 0) {
        if ((r = this[i] - a[i]) != 0) {
          return r;
        }
      }

      return 0;
    } // BigInteger.prototype.bitLength = bnBitLength;
    // (public) return the number of bits in "this"

  }, {
    key: "bitLength",
    value: function bitLength() {
      if (this.t <= 0) {
        return 0;
      }

      return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
    } // BigInteger.prototype.mod = bnMod;
    // (public) this mod a

  }, {
    key: "mod",
    value: function mod(a) {
      var r = nbi();
      this.abs().divRemTo(a, null, r);

      if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
        a.subTo(r, r);
      }

      return r;
    } // BigInteger.prototype.modPowInt = bnModPowInt;
    // (public) this^e % m, 0 <= e < 2^32

  }, {
    key: "modPowInt",
    value: function modPowInt(e, m) {
      var z;

      if (e < 256 || m.isEven()) {
        z = new Classic(m);
      } else {
        z = new Montgomery(m);
      }

      return this.exp(e, z);
    } // BigInteger.prototype.clone = bnClone;
    // (public)

  }, {
    key: "clone",
    value: function clone() {
      var r = nbi();
      this.copyTo(r);
      return r;
    } // BigInteger.prototype.intValue = bnIntValue;
    // (public) return value as integer

  }, {
    key: "intValue",
    value: function intValue() {
      if (this.s < 0) {
        if (this.t == 1) {
          return this[0] - this.DV;
        }

        if (this.t == 0) {
          return -1;
        }
      } else if (this.t == 1) {
        return this[0];
      } else if (this.t == 0) {
        return 0;
      } // assumes 16 < DB < 32


      return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
    } // BigInteger.prototype.byteValue = bnByteValue;
    // (public) return value as byte

  }, {
    key: "byteValue",
    value: function byteValue() {
      return this.t == 0 ? this.s : this[0] << 24 >> 24;
    } // BigInteger.prototype.shortValue = bnShortValue;
    // (public) return value as short (assumes DB>=16)

  }, {
    key: "shortValue",
    value: function shortValue() {
      return this.t == 0 ? this.s : this[0] << 16 >> 16;
    } // BigInteger.prototype.signum = bnSigNum;
    // (public) 0 if this == 0, 1 if this > 0

  }, {
    key: "signum",
    value: function signum() {
      if (this.s < 0) {
        return -1;
      }

      if (this.t <= 0 || this.t == 1 && this[0] <= 0) {
        return 0;
      }

      return 1;
    } // BigInteger.prototype.toByteArray = bnToByteArray;
    // (public) convert to bigendian byte array

  }, {
    key: "toByteArray",
    value: function toByteArray() {
      var i = this.t;
      var r = [];
      r[0] = this.s;
      var p = this.DB - i * this.DB % 8;
      var d;
      var k = 0;

      if (i-- > 0) {
        if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
          r[k++] = d | this.s << this.DB - p;
        }

        while (i >= 0) {
          if (p < 8) {
            d = (this[i] & (1 << p) - 1) << 8 - p;
            d |= this[--i] >> (p += this.DB - 8);
          } else {
            d = this[i] >> (p -= 8) & 0xff;

            if (p <= 0) {
              p += this.DB;
              --i;
            }
          }

          if ((d & 0x80) != 0) {
            d |= -256;
          }

          if (k == 0 && (this.s & 0x80) != (d & 0x80)) {
            ++k;
          }

          if (k > 0 || d != this.s) {
            r[k++] = d;
          }
        }
      }

      return r;
    } // BigInteger.prototype.equals = bnEquals;

  }, {
    key: "equals",
    value: function equals(a) {
      return this.compareTo(a) == 0;
    } // BigInteger.prototype.min = bnMin;

  }, {
    key: "min",
    value: function min(a) {
      return this.compareTo(a) < 0 ? this : a;
    } // BigInteger.prototype.max = bnMax;

  }, {
    key: "max",
    value: function max(a) {
      return this.compareTo(a) > 0 ? this : a;
    } // BigInteger.prototype.and = bnAnd;

  }, {
    key: "and",
    value: function and(a) {
      var r = nbi();
      this.bitwiseTo(a, op_and, r);
      return r;
    } // BigInteger.prototype.or = bnOr;

  }, {
    key: "or",
    value: function or(a) {
      var r = nbi();
      this.bitwiseTo(a, op_or, r);
      return r;
    } // BigInteger.prototype.xor = bnXor;

  }, {
    key: "xor",
    value: function xor(a) {
      var r = nbi();
      this.bitwiseTo(a, op_xor, r);
      return r;
    } // BigInteger.prototype.andNot = bnAndNot;

  }, {
    key: "andNot",
    value: function andNot(a) {
      var r = nbi();
      this.bitwiseTo(a, op_andnot, r);
      return r;
    } // BigInteger.prototype.not = bnNot;
    // (public) ~this

  }, {
    key: "not",
    value: function not() {
      var r = nbi();

      for (var _i = 0; _i < this.t; ++_i) {
        r[_i] = this.DM & ~this[_i];
      }

      r.t = this.t;
      r.s = ~this.s;
      return r;
    } // BigInteger.prototype.shiftLeft = bnShiftLeft;
    // (public) this << n

  }, {
    key: "shiftLeft",
    value: function shiftLeft(n) {
      var r = nbi();

      if (n < 0) {
        this.rShiftTo(-n, r);
      } else {
        this.lShiftTo(n, r);
      }

      return r;
    } // BigInteger.prototype.shiftRight = bnShiftRight;
    // (public) this >> n

  }, {
    key: "shiftRight",
    value: function shiftRight(n) {
      var r = nbi();

      if (n < 0) {
        this.lShiftTo(-n, r);
      } else {
        this.rShiftTo(n, r);
      }

      return r;
    } // BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    // (public) returns index of lowest 1-bit (or -1 if none)

  }, {
    key: "getLowestSetBit",
    value: function getLowestSetBit() {
      for (var _i2 = 0; _i2 < this.t; ++_i2) {
        if (this[_i2] != 0) {
          return _i2 * this.DB + lbit(this[_i2]);
        }
      }

      if (this.s < 0) {
        return this.t * this.DB;
      }

      return -1;
    } // BigInteger.prototype.bitCount = bnBitCount;
    // (public) return number of set bits

  }, {
    key: "bitCount",
    value: function bitCount() {
      var r = 0;
      var x = this.s & this.DM;

      for (var _i3 = 0; _i3 < this.t; ++_i3) {
        r += cbit(this[_i3] ^ x);
      }

      return r;
    } // BigInteger.prototype.testBit = bnTestBit;
    // (public) true iff nth bit is set

  }, {
    key: "testBit",
    value: function testBit(n) {
      var j = Math.floor(n / this.DB);

      if (j >= this.t) {
        return this.s != 0;
      }

      return (this[j] & 1 << n % this.DB) != 0;
    } // BigInteger.prototype.setBit = bnSetBit;
    // (public) this | (1<<n)

  }, {
    key: "setBit",
    value: function setBit(n) {
      return this.changeBit(n, op_or);
    } // BigInteger.prototype.clearBit = bnClearBit;
    // (public) this & ~(1<<n)

  }, {
    key: "clearBit",
    value: function clearBit(n) {
      return this.changeBit(n, op_andnot);
    } // BigInteger.prototype.flipBit = bnFlipBit;
    // (public) this ^ (1<<n)

  }, {
    key: "flipBit",
    value: function flipBit(n) {
      return this.changeBit(n, op_xor);
    } // BigInteger.prototype.add = bnAdd;
    // (public) this + a

  }, {
    key: "add",
    value: function add(a) {
      var r = nbi();
      this.addTo(a, r);
      return r;
    } // BigInteger.prototype.subtract = bnSubtract;
    // (public) this - a

  }, {
    key: "subtract",
    value: function subtract(a) {
      var r = nbi();
      this.subTo(a, r);
      return r;
    } // BigInteger.prototype.multiply = bnMultiply;
    // (public) this * a

  }, {
    key: "multiply",
    value: function multiply(a) {
      var r = nbi();
      this.multiplyTo(a, r);
      return r;
    } // BigInteger.prototype.divide = bnDivide;
    // (public) this / a

  }, {
    key: "divide",
    value: function divide(a) {
      var r = nbi();
      this.divRemTo(a, r, null);
      return r;
    } // BigInteger.prototype.remainder = bnRemainder;
    // (public) this % a

  }, {
    key: "remainder",
    value: function remainder(a) {
      var r = nbi();
      this.divRemTo(a, null, r);
      return r;
    } // BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    // (public) [this/a,this%a]

  }, {
    key: "divideAndRemainder",
    value: function divideAndRemainder(a) {
      var q = nbi();
      var r = nbi();
      this.divRemTo(a, q, r);
      return [q, r];
    } // BigInteger.prototype.modPow = bnModPow;
    // (public) this^e % m (HAC 14.85)

  }, {
    key: "modPow",
    value: function modPow(e, m) {
      var i = e.bitLength();
      var k;
      var r = nbv(1);
      var z;

      if (i <= 0) {
        return r;
      }

      if (i < 18) {
        k = 1;
      } else if (i < 48) {
        k = 3;
      } else if (i < 144) {
        k = 4;
      } else if (i < 768) {
        k = 5;
      } else {
        k = 6;
      }

      if (i < 8) {
        z = new Classic(m);
      } else if (m.isEven()) {
        z = new Barrett(m);
      } else {
        z = new Montgomery(m);
      } // precomputation


      var g = [];
      var n = 3;
      var k1 = k - 1;
      var km = (1 << k) - 1;
      g[1] = z.convert(this);

      if (k > 1) {
        var g2 = nbi();
        z.sqrTo(g[1], g2);

        while (n <= km) {
          g[n] = nbi();
          z.mulTo(g2, g[n - 2], g[n]);
          n += 2;
        }
      }

      var j = e.t - 1;
      var w;
      var is1 = true;
      var r2 = nbi();
      var t;
      i = nbits(e[j]) - 1;

      while (j >= 0) {
        if (i >= k1) {
          w = e[j] >> i - k1 & km;
        } else {
          w = (e[j] & (1 << i + 1) - 1) << k1 - i;

          if (j > 0) {
            w |= e[j - 1] >> this.DB + i - k1;
          }
        }

        n = k;

        while ((w & 1) == 0) {
          w >>= 1;
          --n;
        }

        if ((i -= n) < 0) {
          i += this.DB;
          --j;
        }

        if (is1) {
          // ret == 1, don't bother squaring or multiplying it
          g[w].copyTo(r);
          is1 = false;
        } else {
          while (n > 1) {
            z.sqrTo(r, r2);
            z.sqrTo(r2, r);
            n -= 2;
          }

          if (n > 0) {
            z.sqrTo(r, r2);
          } else {
            t = r;
            r = r2;
            r2 = t;
          }

          z.mulTo(r2, g[w], r);
        }

        while (j >= 0 && (e[j] & 1 << i) == 0) {
          z.sqrTo(r, r2);
          t = r;
          r = r2;
          r2 = t;

          if (--i < 0) {
            i = this.DB - 1;
            --j;
          }
        }
      }

      return z.revert(r);
    } // BigInteger.prototype.modInverse = bnModInverse;
    // (public) 1/this % m (HAC 14.61)

  }, {
    key: "modInverse",
    value: function modInverse(m) {
      var ac = m.isEven();

      if (this.isEven() && ac || m.signum() == 0) {
        return BigInteger.ZERO;
      }

      var u = m.clone();
      var v = this.clone();
      var a = nbv(1);
      var b = nbv(0);
      var c = nbv(0);
      var d = nbv(1);

      while (u.signum() != 0) {
        while (u.isEven()) {
          u.rShiftTo(1, u);

          if (ac) {
            if (!a.isEven() || !b.isEven()) {
              a.addTo(this, a);
              b.subTo(m, b);
            }

            a.rShiftTo(1, a);
          } else if (!b.isEven()) {
            b.subTo(m, b);
          }

          b.rShiftTo(1, b);
        }

        while (v.isEven()) {
          v.rShiftTo(1, v);

          if (ac) {
            if (!c.isEven() || !d.isEven()) {
              c.addTo(this, c);
              d.subTo(m, d);
            }

            c.rShiftTo(1, c);
          } else if (!d.isEven()) {
            d.subTo(m, d);
          }

          d.rShiftTo(1, d);
        }

        if (u.compareTo(v) >= 0) {
          u.subTo(v, u);

          if (ac) {
            a.subTo(c, a);
          }

          b.subTo(d, b);
        } else {
          v.subTo(u, v);

          if (ac) {
            c.subTo(a, c);
          }

          d.subTo(b, d);
        }
      }

      if (v.compareTo(BigInteger.ONE) != 0) {
        return BigInteger.ZERO;
      }

      if (d.compareTo(m) >= 0) {
        return d.subtract(m);
      }

      if (d.signum() < 0) {
        d.addTo(m, d);
      } else {
        return d;
      }

      if (d.signum() < 0) {
        return d.add(m);
      }

      return d;
    } // BigInteger.prototype.pow = bnPow;
    // (public) this^e

  }, {
    key: "pow",
    value: function pow(e) {
      return this.exp(e, new NullExp());
    } // BigInteger.prototype.gcd = bnGCD;
    // (public) gcd(this,a) (HAC 14.54)

  }, {
    key: "gcd",
    value: function gcd(a) {
      var x = this.s < 0 ? this.negate() : this.clone();
      var y = a.s < 0 ? a.negate() : a.clone();

      if (x.compareTo(y) < 0) {
        var t = x;
        x = y;
        y = t;
      }

      var i = x.getLowestSetBit();
      var g = y.getLowestSetBit();

      if (g < 0) {
        return x;
      }

      if (i < g) {
        g = i;
      }

      if (g > 0) {
        x.rShiftTo(g, x);
        y.rShiftTo(g, y);
      }

      while (x.signum() > 0) {
        if ((i = x.getLowestSetBit()) > 0) {
          x.rShiftTo(i, x);
        }

        if ((i = y.getLowestSetBit()) > 0) {
          y.rShiftTo(i, y);
        }

        if (x.compareTo(y) >= 0) {
          x.subTo(y, x);
          x.rShiftTo(1, x);
        } else {
          y.subTo(x, y);
          y.rShiftTo(1, y);
        }
      }

      if (g > 0) {
        y.lShiftTo(g, y);
      }

      return y;
    } // BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
    // (public) test primality with certainty >= 1-.5^t

  }, {
    key: "isProbablePrime",
    value: function isProbablePrime(t) {
      var i;
      var x = this.abs();

      if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
        for (i = 0; i < lowprimes.length; ++i) {
          if (x[0] == lowprimes[i]) {
            return true;
          }
        }

        return false;
      }

      if (x.isEven()) {
        return false;
      }

      i = 1;

      while (i < lowprimes.length) {
        var _m = lowprimes[i];

        var _j = i + 1;

        while (_j < lowprimes.length && _m < lplim) {
          _m *= lowprimes[_j++];
        }

        _m = x.modInt(_m);

        while (i < _j) {
          if (_m % lowprimes[i++] == 0) {
            return false;
          }
        }
      }

      return x.millerRabin(t);
    } // #endregion PUBLIC
    // #region PROTECTED
    // BigInteger.prototype.copyTo = bnpCopyTo;
    // (protected) copy this to r

  }, {
    key: "copyTo",
    value: function copyTo(r) {
      for (var _i4 = this.t - 1; _i4 >= 0; --_i4) {
        r[_i4] = this[_i4];
      }

      r.t = this.t;
      r.s = this.s;
    } // BigInteger.prototype.fromInt = bnpFromInt;
    // (protected) set from integer value x, -DV <= x < DV

  }, {
    key: "fromInt",
    value: function fromInt(x) {
      this.t = 1;
      this.s = x < 0 ? -1 : 0;

      if (x > 0) {
        this[0] = x;
      } else if (x < -1) {
        this[0] = x + this.DV;
      } else {
        this.t = 0;
      }
    } // BigInteger.prototype.fromString = bnpFromString;
    // (protected) set from string and radix

  }, {
    key: "fromString",
    value: function fromString(s, b) {
      var k;

      if (b == 16) {
        k = 4;
      } else if (b == 8) {
        k = 3;
      } else if (b == 256) {
        k = 8;
        /* byte array */
      } else if (b == 2) {
        k = 1;
      } else if (b == 32) {
        k = 5;
      } else if (b == 4) {
        k = 2;
      } else {
        this.fromRadix(s, b);
        return;
      }

      this.t = 0;
      this.s = 0;
      var i = s.length;
      var mi = false;
      var sh = 0;

      while (--i >= 0) {
        var _x = k == 8 ? +s[i] & 0xff : intAt(s, i);

        if (_x < 0) {
          if (s.charAt(i) == '-') {
            mi = true;
          }

          continue;
        }

        mi = false;

        if (sh == 0) {
          this[this.t++] = _x;
        } else if (sh + k > this.DB) {
          this[this.t - 1] |= (_x & (1 << this.DB - sh) - 1) << sh;
          this[this.t++] = _x >> this.DB - sh;
        } else {
          this[this.t - 1] |= _x << sh;
        }

        sh += k;

        if (sh >= this.DB) {
          sh -= this.DB;
        }
      }

      if (k == 8 && (+s[0] & 0x80) != 0) {
        this.s = -1;

        if (sh > 0) {
          this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
        }
      }

      this.clamp();

      if (mi) {
        BigInteger.ZERO.subTo(this, this);
      }
    } // BigInteger.prototype.clamp = bnpClamp;
    // (protected) clamp off excess high words

  }, {
    key: "clamp",
    value: function clamp() {
      var c = this.s & this.DM;

      while (this.t > 0 && this[this.t - 1] == c) {
        --this.t;
      }
    } // BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    // (protected) r = this << n*DB

  }, {
    key: "dlShiftTo",
    value: function dlShiftTo(n, r) {
      var i;

      for (i = this.t - 1; i >= 0; --i) {
        r[i + n] = this[i];
      }

      for (i = n - 1; i >= 0; --i) {
        r[i] = 0;
      }

      r.t = this.t + n;
      r.s = this.s;
    } // BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    // (protected) r = this >> n*DB

  }, {
    key: "drShiftTo",
    value: function drShiftTo(n, r) {
      for (var _i5 = n; _i5 < this.t; ++_i5) {
        r[_i5 - n] = this[_i5];
      }

      r.t = Math.max(this.t - n, 0);
      r.s = this.s;
    } // BigInteger.prototype.lShiftTo = bnpLShiftTo;
    // (protected) r = this << n

  }, {
    key: "lShiftTo",
    value: function lShiftTo(n, r) {
      var bs = n % this.DB;
      var cbs = this.DB - bs;
      var bm = (1 << cbs) - 1;
      var ds = Math.floor(n / this.DB);
      var c = this.s << bs & this.DM;

      for (var _i6 = this.t - 1; _i6 >= 0; --_i6) {
        r[_i6 + ds + 1] = this[_i6] >> cbs | c;
        c = (this[_i6] & bm) << bs;
      }

      for (var _i7 = ds - 1; _i7 >= 0; --_i7) {
        r[_i7] = 0;
      }

      r[ds] = c;
      r.t = this.t + ds + 1;
      r.s = this.s;
      r.clamp();
    } // BigInteger.prototype.rShiftTo = bnpRShiftTo;
    // (protected) r = this >> n

  }, {
    key: "rShiftTo",
    value: function rShiftTo(n, r) {
      r.s = this.s;
      var ds = Math.floor(n / this.DB);

      if (ds >= this.t) {
        r.t = 0;
        return;
      }

      var bs = n % this.DB;
      var cbs = this.DB - bs;
      var bm = (1 << bs) - 1;
      r[0] = this[ds] >> bs;

      for (var _i8 = ds + 1; _i8 < this.t; ++_i8) {
        r[_i8 - ds - 1] |= (this[_i8] & bm) << cbs;
        r[_i8 - ds] = this[_i8] >> bs;
      }

      if (bs > 0) {
        r[this.t - ds - 1] |= (this.s & bm) << cbs;
      }

      r.t = this.t - ds;
      r.clamp();
    } // BigInteger.prototype.subTo = bnpSubTo;
    // (protected) r = this - a

  }, {
    key: "subTo",
    value: function subTo(a, r) {
      var i = 0;
      var c = 0;
      var m = Math.min(a.t, this.t);

      while (i < m) {
        c += this[i] - a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }

      if (a.t < this.t) {
        c -= a.s;

        while (i < this.t) {
          c += this[i];
          r[i++] = c & this.DM;
          c >>= this.DB;
        }

        c += this.s;
      } else {
        c += this.s;

        while (i < a.t) {
          c -= a[i];
          r[i++] = c & this.DM;
          c >>= this.DB;
        }

        c -= a.s;
      }

      r.s = c < 0 ? -1 : 0;

      if (c < -1) {
        r[i++] = this.DV + c;
      } else if (c > 0) {
        r[i++] = c;
      }

      r.t = i;
      r.clamp();
    } // BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.

  }, {
    key: "multiplyTo",
    value: function multiplyTo(a, r) {
      var x = this.abs();
      var y = a.abs();
      var i = x.t;
      r.t = i + y.t;

      while (--i >= 0) {
        r[i] = 0;
      }

      for (i = 0; i < y.t; ++i) {
        r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
      }

      r.s = 0;
      r.clamp();

      if (this.s != a.s) {
        BigInteger.ZERO.subTo(r, r);
      }
    } // BigInteger.prototype.squareTo = bnpSquareTo;
    // (protected) r = this^2, r != this (HAC 14.16)

  }, {
    key: "squareTo",
    value: function squareTo(r) {
      var x = this.abs();
      r.t = 2 * x.t;
      var i = r.t;

      while (--i >= 0) {
        r[i] = 0;
      }

      for (i = 0; i < x.t - 1; ++i) {
        var _c = x.am(i, x[i], r, 2 * i, 0, 1);

        if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, _c, x.t - i - 1)) >= x.DV) {
          r[i + x.t] -= x.DV;
          r[i + x.t + 1] = 1;
        }
      }

      if (r.t > 0) {
        r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
      }

      r.s = 0;
      r.clamp();
    } // BigInteger.prototype.divRemTo = bnpDivRemTo;
    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.

  }, {
    key: "divRemTo",
    value: function divRemTo(m, q, r) {
      var pm = m.abs();

      if (pm.t <= 0) {
        return;
      }

      var pt = this.abs();

      if (pt.t < pm.t) {
        if (q != null) {
          q.fromInt(0);
        }

        if (r != null) {
          this.copyTo(r);
        }

        return;
      }

      if (r == null) {
        r = nbi();
      }

      var y = nbi();
      var ts = this.s;
      var ms = m.s;
      var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus

      if (nsh > 0) {
        pm.lShiftTo(nsh, y);
        pt.lShiftTo(nsh, r);
      } else {
        pm.copyTo(y);
        pt.copyTo(r);
      }

      var ys = y.t;
      var y0 = y[ys - 1];

      if (y0 == 0) {
        return;
      }

      var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
      var d1 = this.FV / yt;
      var d2 = (1 << this.F1) / yt;
      var e = 1 << this.F2;
      var i = r.t;
      var j = i - ys;
      var t = q == null ? nbi() : q;
      y.dlShiftTo(j, t);

      if (r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t, r);
      }

      BigInteger.ONE.dlShiftTo(ys, t);
      t.subTo(y, y); // "negative" y so we can replace sub with am later

      while (y.t < ys) {
        y[y.t++] = 0;
      }

      while (--j >= 0) {
        // Estimate quotient digit
        var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);

        if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
          // Try it out
          y.dlShiftTo(j, t);
          r.subTo(t, r);

          while (r[i] < --qd) {
            r.subTo(t, r);
          }
        }
      }

      if (q != null) {
        r.drShiftTo(ys, q);

        if (ts != ms) {
          BigInteger.ZERO.subTo(q, q);
        }
      }

      r.t = ys;
      r.clamp();

      if (nsh > 0) {
        r.rShiftTo(nsh, r);
      } // Denormalize remainder


      if (ts < 0) {
        BigInteger.ZERO.subTo(r, r);
      }
    } // BigInteger.prototype.invDigit = bnpInvDigit;
    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.

  }, {
    key: "invDigit",
    value: function invDigit() {
      if (this.t < 1) {
        return 0;
      }

      var x = this[0];

      if ((x & 1) == 0) {
        return 0;
      }

      var y = x & 3; // y == 1/x mod 2^2

      y = y * (2 - (x & 0xf) * y) & 0xf; // y == 1/x mod 2^4

      y = y * (2 - (x & 0xff) * y) & 0xff; // y == 1/x mod 2^8

      y = y * (2 - ((x & 0xffff) * y & 0xffff)) & 0xffff; // y == 1/x mod 2^16
      // last step - calculate inverse mod DV directly;
      // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints

      y = y * (2 - x * y % this.DV) % this.DV; // y == 1/x mod 2^dbits
      // we really want the negative inverse, and -DV < y < DV

      return y > 0 ? this.DV - y : -y;
    } // BigInteger.prototype.isEven = bnpIsEven;
    // (protected) true iff this is even

  }, {
    key: "isEven",
    value: function isEven() {
      return (this.t > 0 ? this[0] & 1 : this.s) == 0;
    } // BigInteger.prototype.exp = bnpExp;
    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)

  }, {
    key: "exp",
    value: function exp(e, z) {
      if (e > 0xffffffff || e < 1) {
        return BigInteger.ONE;
      }

      var r = nbi();
      var r2 = nbi();
      var g = z.convert(this);
      var i = nbits(e) - 1;
      g.copyTo(r);

      while (--i >= 0) {
        z.sqrTo(r, r2);

        if ((e & 1 << i) > 0) {
          z.mulTo(r2, g, r);
        } else {
          var t = r;
          r = r2;
          r2 = t;
        }
      }

      return z.revert(r);
    } // BigInteger.prototype.chunkSize = bnpChunkSize;
    // (protected) return x s.t. r^x < DV

  }, {
    key: "chunkSize",
    value: function chunkSize(r) {
      return Math.floor(Math.LN2 * this.DB / Math.log(r));
    } // BigInteger.prototype.toRadix = bnpToRadix;
    // (protected) convert to radix string

  }, {
    key: "toRadix",
    value: function toRadix(b) {
      if (b == null) {
        b = 10;
      }

      if (this.signum() == 0 || b < 2 || b > 36) {
        return '0';
      }

      var cs = this.chunkSize(b);
      var a = Math.pow(b, cs);
      var d = nbv(a);
      var y = nbi();
      var z = nbi();
      var r = '';
      this.divRemTo(d, y, z);

      while (y.signum() > 0) {
        r = (a + z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d, y, z);
      }

      return z.intValue().toString(b) + r;
    } // BigInteger.prototype.fromRadix = bnpFromRadix;
    // (protected) convert from radix string

  }, {
    key: "fromRadix",
    value: function fromRadix(s, b) {
      this.fromInt(0);

      if (b == null) {
        b = 10;
      }

      var cs = this.chunkSize(b);
      var d = Math.pow(b, cs);
      var mi = false;
      var j = 0;
      var w = 0;

      for (var _i9 = 0; _i9 < s.length; ++_i9) {
        var _x2 = intAt(s, _i9);

        if (_x2 < 0) {
          if (s.charAt(_i9) == '-' && this.signum() == 0) {
            mi = true;
          }

          continue;
        }

        w = b * w + _x2;

        if (++j >= cs) {
          this.dMultiply(d);
          this.dAddOffset(w, 0);
          j = 0;
          w = 0;
        }
      }

      if (j > 0) {
        this.dMultiply(Math.pow(b, j));
        this.dAddOffset(w, 0);
      }

      if (mi) {
        BigInteger.ZERO.subTo(this, this);
      }
    } // BigInteger.prototype.fromNumber = bnpFromNumber;
    // (protected) alternate constructor

  }, {
    key: "fromNumber",
    value: function fromNumber(a, b, c) {
      if ('number' === typeof b) {
        // new BigInteger(int,int,RNG)
        if (a < 2) {
          this.fromInt(1);
        } else {
          this.fromNumber(a, c);

          if (!this.testBit(a - 1)) {
            // force MSB set
            this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
          }

          if (this.isEven()) {
            this.dAddOffset(1, 0);
          } // force odd


          while (!this.isProbablePrime(b)) {
            this.dAddOffset(2, 0);

            if (this.bitLength() > a) {
              this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
            }
          }
        }
      } else {
        // new BigInteger(int,RNG)
        var _x3 = [];
        var t = a & 7;
        _x3.length = (a >> 3) + 1;
        b.nextBytes(_x3);

        if (t > 0) {
          _x3[0] &= (1 << t) - 1;
        } else {
          _x3[0] = 0;
        }

        this.fromString(_x3, 256);
      }
    } // BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    // (protected) r = this op a (bitwise)

  }, {
    key: "bitwiseTo",
    value: function bitwiseTo(a, op, r) {
      var i;
      var f;
      var m = Math.min(a.t, this.t);

      for (i = 0; i < m; ++i) {
        r[i] = op(this[i], a[i]);
      }

      if (a.t < this.t) {
        f = a.s & this.DM;

        for (i = m; i < this.t; ++i) {
          r[i] = op(this[i], f);
        }

        r.t = this.t;
      } else {
        f = this.s & this.DM;

        for (i = m; i < a.t; ++i) {
          r[i] = op(f, a[i]);
        }

        r.t = a.t;
      }

      r.s = op(this.s, a.s);
      r.clamp();
    } // BigInteger.prototype.changeBit = bnpChangeBit;
    // (protected) this op (1<<n)

  }, {
    key: "changeBit",
    value: function changeBit(n, op) {
      var r = BigInteger.ONE.shiftLeft(n);
      this.bitwiseTo(r, op, r);
      return r;
    } // BigInteger.prototype.addTo = bnpAddTo;
    // (protected) r = this + a

  }, {
    key: "addTo",
    value: function addTo(a, r) {
      var i = 0;
      var c = 0;
      var m = Math.min(a.t, this.t);

      while (i < m) {
        c += this[i] + a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }

      if (a.t < this.t) {
        c += a.s;

        while (i < this.t) {
          c += this[i];
          r[i++] = c & this.DM;
          c >>= this.DB;
        }

        c += this.s;
      } else {
        c += this.s;

        while (i < a.t) {
          c += a[i];
          r[i++] = c & this.DM;
          c >>= this.DB;
        }

        c += a.s;
      }

      r.s = c < 0 ? -1 : 0;

      if (c > 0) {
        r[i++] = c;
      } else if (c < -1) {
        r[i++] = this.DV + c;
      }

      r.t = i;
      r.clamp();
    } // BigInteger.prototype.dMultiply = bnpDMultiply;
    // (protected) this *= n, this >= 0, 1 < n < DV

  }, {
    key: "dMultiply",
    value: function dMultiply(n) {
      this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
      ++this.t;
      this.clamp();
    } // BigInteger.prototype.dAddOffset = bnpDAddOffset;
    // (protected) this += n << w words, this >= 0

  }, {
    key: "dAddOffset",
    value: function dAddOffset(n, w) {
      if (n == 0) {
        return;
      }

      while (this.t <= w) {
        this[this.t++] = 0;
      }

      this[w] += n;

      while (this[w] >= this.DV) {
        this[w] -= this.DV;

        if (++w >= this.t) {
          this[this.t++] = 0;
        }

        ++this[w];
      }
    } // BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.

  }, {
    key: "multiplyLowerTo",
    value: function multiplyLowerTo(a, n, r) {
      var i = Math.min(this.t + a.t, n);
      r.s = 0; // assumes a,this >= 0

      r.t = i;

      while (i > 0) {
        r[--i] = 0;
      }

      for (var _j2 = r.t - this.t; i < _j2; ++i) {
        r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
      }

      for (var _j3 = Math.min(a.t, n); i < _j3; ++i) {
        this.am(0, a[i], r, i, 0, n - i);
      }

      r.clamp();
    } // BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.

  }, {
    key: "multiplyUpperTo",
    value: function multiplyUpperTo(a, n, r) {
      --n;
      r.t = this.t + a.t - n;
      var i = r.t;
      r.s = 0; // assumes a,this >= 0

      while (--i >= 0) {
        r[i] = 0;
      }

      for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
        r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
      }

      r.clamp();
      r.drShiftTo(1, r);
    } // BigInteger.prototype.modInt = bnpModInt;
    // (protected) this % n, n < 2^26

  }, {
    key: "modInt",
    value: function modInt(n) {
      if (n <= 0) {
        return 0;
      }

      var d = this.DV % n;
      var r = this.s < 0 ? n - 1 : 0;

      if (this.t > 0) {
        if (d == 0) {
          r = this[0] % n;
        } else {
          for (var _i10 = this.t - 1; _i10 >= 0; --_i10) {
            r = (d * r + this[_i10]) % n;
          }
        }
      }

      return r;
    } // BigInteger.prototype.millerRabin = bnpMillerRabin;
    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)

  }, {
    key: "millerRabin",
    value: function millerRabin(t) {
      var n1 = this.subtract(BigInteger.ONE);
      var k = n1.getLowestSetBit();

      if (k <= 0) {
        return false;
      }

      var r = n1.shiftRight(k);
      t = t + 1 >> 1;

      if (t > lowprimes.length) {
        t = lowprimes.length;
      }

      var a = nbi();

      for (var _i11 = 0; _i11 < t; ++_i11) {
        // Pick bases at random, instead of starting at 2
        a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);

        var _y = a.modPow(r, this);

        if (_y.compareTo(BigInteger.ONE) != 0 && _y.compareTo(n1) != 0) {
          var _j4 = 1;

          while (_j4++ < k && _y.compareTo(n1) != 0) {
            _y = _y.modPowInt(2, this);

            if (_y.compareTo(BigInteger.ONE) == 0) {
              return false;
            }
          }

          if (_y.compareTo(n1) != 0) {
            return false;
          }
        }
      }

      return true;
    } // BigInteger.prototype.square = bnSquare;
    // (public) this^2

  }, {
    key: "square",
    value: function square() {
      var r = nbi();
      this.squareTo(r);
      return r;
    } // #region ASYNC
    // Public API method

  }, {
    key: "gcda",
    value: function gcda(a, callback) {
      var x = this.s < 0 ? this.negate() : this.clone();
      var y = a.s < 0 ? a.negate() : a.clone();

      if (x.compareTo(y) < 0) {
        var t = x;
        x = y;
        y = t;
      }

      var i = x.getLowestSetBit();
      var g = y.getLowestSetBit();

      if (g < 0) {
        callback(x);
        return;
      }

      if (i < g) {
        g = i;
      }

      if (g > 0) {
        x.rShiftTo(g, x);
        y.rShiftTo(g, y);
      } // Workhorse of the algorithm, gets called 200 - 800 times per 512 bit keygen.


      var gcda1 = function gcda1() {
        if ((i = x.getLowestSetBit()) > 0) {
          x.rShiftTo(i, x);
        }

        if ((i = y.getLowestSetBit()) > 0) {
          y.rShiftTo(i, y);
        }

        if (x.compareTo(y) >= 0) {
          x.subTo(y, x);
          x.rShiftTo(1, x);
        } else {
          y.subTo(x, y);
          y.rShiftTo(1, y);
        }

        if (!(x.signum() > 0)) {
          if (g > 0) {
            y.lShiftTo(g, y);
          }

          setTimeout(function () {
            callback(y);
          }, 0); // escape
        } else {
          setTimeout(gcda1, 0);
        }
      };

      setTimeout(gcda1, 10);
    } // (protected) alternate constructor

  }, {
    key: "fromNumberAsync",
    value: function fromNumberAsync(a, b, c, callback) {
      if ('number' === typeof b) {
        if (a < 2) {
          this.fromInt(1);
        } else {
          this.fromNumber(a, c);

          if (!this.testBit(a - 1)) {
            this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
          }

          if (this.isEven()) {
            this.dAddOffset(1, 0);
          } // eslint-disable-next-line @typescript-eslint/no-this-alias


          var bnp = this;

          var bnpfn1 = function bnpfn1() {
            bnp.dAddOffset(2, 0);

            if (bnp.bitLength() > a) {
              bnp.subTo(BigInteger.ONE.shiftLeft(a - 1), bnp);
            }

            if (bnp.isProbablePrime(b)) {
              setTimeout(function () {
                callback();
              }, 0); // escape
            } else {
              setTimeout(bnpfn1, 0);
            }
          };

          setTimeout(bnpfn1, 0);
        }
      } else {
        var _x4 = [];
        var t = a & 7;
        _x4.length = (a >> 3) + 1;
        b.nextBytes(_x4);

        if (t > 0) {
          _x4[0] &= (1 << t) - 1;
        } else {
          _x4[0] = 0;
        }

        this.fromString(_x4, 256);
      }
    } // #endregion ASYNC
    // #endregion PROTECTED
    // #region FIELDS
    // #endregion ASYNC
    // #endregion PROTECTED

  }]);

  return BigInteger;
}(); // #region REDUCERS
// #region NullExp

_defineProperty(BigInteger, "ONE", void 0);

_defineProperty(BigInteger, "ZERO", void 0);

var NullExp = /*#__PURE__*/function () {
  function NullExp() {
    _classCallCheck(this, NullExp);
  }

  _createClass(NullExp, [{
    key: "convert",
    // NullExp.prototype.convert = nNop;
    value: function convert(x) {
      return x;
    } // NullExp.prototype.revert = nNop;

  }, {
    key: "revert",
    value: function revert(x) {
      return x;
    } // NullExp.prototype.mulTo = nMulTo;

  }, {
    key: "mulTo",
    value: function mulTo(x, y, r) {
      x.multiplyTo(y, r);
    } // NullExp.prototype.sqrTo = nSqrTo;

  }, {
    key: "sqrTo",
    value: function sqrTo(x, r) {
      x.squareTo(r);
    }
  }]);

  return NullExp;
}(); // #endregion NullExp
// #region Classic


// Modular reduction using "classic" algorithm
var Classic = /*#__PURE__*/function () {
  function Classic(m) {
    _classCallCheck(this, Classic);

    this.m = m;
  } // Classic.prototype.convert = cConvert;


  _createClass(Classic, [{
    key: "convert",
    value: function convert(x) {
      if (x.s < 0 || x.compareTo(this.m) >= 0) {
        return x.mod(this.m);
      }

      return x;
    } // Classic.prototype.revert = cRevert;

  }, {
    key: "revert",
    value: function revert(x) {
      return x;
    } // Classic.prototype.reduce = cReduce;

  }, {
    key: "reduce",
    value: function reduce(x) {
      x.divRemTo(this.m, null, x);
    } // Classic.prototype.mulTo = cMulTo;

  }, {
    key: "mulTo",
    value: function mulTo(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    } // Classic.prototype.sqrTo = cSqrTo;

  }, {
    key: "sqrTo",
    value: function sqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
  }]);

  return Classic;
}(); // #endregion
// #region Montgomery
// Montgomery reduction


var Montgomery = /*#__PURE__*/function () {
  function Montgomery(m) {
    _classCallCheck(this, Montgomery);

    this.m = m;

    _defineProperty(this, "mp", void 0);

    _defineProperty(this, "mpl", void 0);

    _defineProperty(this, "mph", void 0);

    _defineProperty(this, "um", void 0);

    _defineProperty(this, "mt2", void 0);

    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << m.DB - 15) - 1;
    this.mt2 = 2 * m.t;
  }

  _createClass(Montgomery, [{
    key: "convert",
    // Montgomery.prototype.convert = montConvert;
    // xR mod m
    value: function convert(x) {
      var r = nbi();
      x.abs().dlShiftTo(this.m.t, r);
      r.divRemTo(this.m, null, r);

      if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
        this.m.subTo(r, r);
      }

      return r;
    } // Montgomery.prototype.revert = montRevert;
    // x/R mod m

  }, {
    key: "revert",
    value: function revert(x) {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    } // Montgomery.prototype.reduce = montReduce;
    // x = x/R mod m (HAC 14.32)

  }, {
    key: "reduce",
    value: function reduce(x) {
      while (x.t <= this.mt2) {
        // pad x so am has enough room later
        x[x.t++] = 0;
      }

      for (var _i12 = 0; _i12 < this.m.t; ++_i12) {
        // faster way of calculating u0 = x[i]*mp mod DV
        var _j5 = x[_i12] & 0x7fff;

        var u0 = _j5 * this.mpl + ((_j5 * this.mph + (x[_i12] >> 15) * this.mpl & this.um) << 15) & x.DM; // use am to combine the multiply-shift-add into one call

        _j5 = _i12 + this.m.t;
        x[_j5] += this.m.am(0, u0, x, _i12, 0, this.m.t); // propagate carry

        while (x[_j5] >= x.DV) {
          x[_j5] -= x.DV;
          x[++_j5]++;
        }
      }

      x.clamp();
      x.drShiftTo(this.m.t, x);

      if (x.compareTo(this.m) >= 0) {
        x.subTo(this.m, x);
      }
    } // Montgomery.prototype.mulTo = montMulTo;
    // r = "xy/R mod m"; x,y != r

  }, {
    key: "mulTo",
    value: function mulTo(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    } // Montgomery.prototype.sqrTo = montSqrTo;
    // r = "x^2/R mod m"; x != r

  }, {
    key: "sqrTo",
    value: function sqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
  }]);

  return Montgomery;
}(); // #endregion Montgomery
// #region Barrett
// Barrett modular reduction


var Barrett = /*#__PURE__*/function () {
  function Barrett(m) {
    _classCallCheck(this, Barrett);

    this.m = m;

    _defineProperty(this, "r2", void 0);

    _defineProperty(this, "q3", void 0);

    _defineProperty(this, "mu", void 0);

    // setup Barrett
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
  }

  _createClass(Barrett, [{
    key: "convert",
    // Barrett.prototype.convert = barrettConvert;
    value: function convert(x) {
      if (x.s < 0 || x.t > 2 * this.m.t) {
        return x.mod(this.m);
      }

      if (x.compareTo(this.m) < 0) {
        return x;
      }

      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    } // Barrett.prototype.revert = barrettRevert;

  }, {
    key: "revert",
    value: function revert(x) {
      return x;
    } // Barrett.prototype.reduce = barrettReduce;
    // x = x mod m (HAC 14.42)

  }, {
    key: "reduce",
    value: function reduce(x) {
      x.drShiftTo(this.m.t - 1, this.r2);

      if (x.t > this.m.t + 1) {
        x.t = this.m.t + 1;
        x.clamp();
      }

      this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
      this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);

      while (x.compareTo(this.r2) < 0) {
        x.dAddOffset(1, this.m.t + 1);
      }

      x.subTo(this.r2, x);

      while (x.compareTo(this.m) >= 0) {
        x.subTo(this.m, x);
      }
    } // Barrett.prototype.mulTo = barrettMulTo;
    // r = x*y mod m; x,y != r

  }, {
    key: "mulTo",
    value: function mulTo(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    } // Barrett.prototype.sqrTo = barrettSqrTo;
    // r = x^2 mod m; x != r

  }, {
    key: "sqrTo",
    value: function sqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
  }]);

  return Barrett;
}(); // #endregion
// #endregion REDUCERS
// return new, unset BigInteger


function nbi() {
  return new BigInteger(null);
}
function parseBigInt(str, r) {
  return new BigInteger(str, r);
} // am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.
// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)

function am1(i, x, w, j, c, n) {
  while (--n >= 0) {
    var v = x * this[i++] + w[j] + c;
    c = Math.floor(v / 0x4000000);
    w[j++] = v & 0x3ffffff;
  }

  return c;
} // am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)


function am2(i, x, w, j, c, n) {
  var xl = x & 0x7fff;
  var xh = x >> 15;

  while (--n >= 0) {
    var l = this[i] & 0x7fff;
    var h = this[i++] >> 15;

    var _m2 = xh * l + h * xl;

    l = xl * l + ((_m2 & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
    c = (l >>> 30) + (_m2 >>> 15) + xh * h + (c >>> 30);
    w[j++] = l & 0x3fffffff;
  }

  return c;
} // Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.


function am3(i, x, w, j, c, n) {
  var xl = x & 0x3fff;
  var xh = x >> 14;

  while (--n >= 0) {
    var l = this[i] & 0x3fff;
    var h = this[i++] >> 14;

    var _m3 = xh * l + h * xl;

    l = xl * l + ((_m3 & 0x3fff) << 14) + w[j] + c;
    c = (l >> 28) + (_m3 >> 14) + xh * h;
    w[j++] = l & 0xfffffff;
  }

  return c;
} // Digit conversions


var BI_RC = [];
var rr;
var vv;
rr = '0'.charCodeAt(0);

for (vv = 0; vv <= 9; ++vv) {
  BI_RC[rr++] = vv;
}

rr = 'a'.charCodeAt(0);

for (vv = 10; vv < 36; ++vv) {
  BI_RC[rr++] = vv;
}

rr = 'A'.charCodeAt(0);

for (vv = 10; vv < 36; ++vv) {
  BI_RC[rr++] = vv;
}

function intAt(s, i) {
  var c = BI_RC[s.charCodeAt(i)];
  return c == null ? -1 : c;
} // return bigint initialized to value

function nbv(i) {
  var r = nbi();
  r.fromInt(i);
  return r;
} // returns bit length of the integer x

function nbits(x) {
  var r = 1;
  var t;

  if ((t = x >>> 16) != 0) {
    x = t;
    r += 16;
  }

  if ((t = x >> 8) != 0) {
    x = t;
    r += 8;
  }

  if ((t = x >> 4) != 0) {
    x = t;
    r += 4;
  }

  if ((t = x >> 2) != 0) {
    x = t;
    r += 2;
  }

  if ((t = x >> 1) != 0) {
    x = t;
    r += 1;
  }

  return r;
} // "constants"

BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

/* eslint-disable no-param-reassign */

var modulus = '00D950477671A500894A74F50F029A2B17643EBECBC75BF44203D153419C2287CA40E8AD6EABD738FCBF479B437E5EFEE7788868C5636637F1A61AAED4BB849BE70863E4649046CD16479F5F0B3D2E9AEA9655AE0164031546D5160ACE3647DD3017205DBFA6ABABFD5AB364F513BCB9C43289E752801852363E383ECF355C64D3';
var publicExponent = '010001';
var n = parseBigInt(modulus, 16);
var e = parseInt(publicExponent, 16);
var maxLen = n.bitLength() + 7 >> 3; // PKCS#1 (type 2, random) pad input string s to len bytes, and return a bigint

function pkcs1pad2(s, len) {
  if (len < s.length + 11) {
    console.error('Message too long for RSA');
    return null;
  }

  var ba = [];
  var i = s.length - 1;

  while (i >= 0 && len > 0) {
    var c = s.charCodeAt(i--);

    if (c < 128) {
      // encode using utf-8
      ba[--len] = c;
    } else if (c > 127 && c < 2048) {
      ba[--len] = c & 63 | 128;
      ba[--len] = c >> 6 | 192;
    } else {
      ba[--len] = c & 63 | 128;
      ba[--len] = c >> 6 & 63 | 128;
      ba[--len] = c >> 12 | 224;
    }
  }

  ba[--len] = 0;
  var rng = new SecureRandom();
  var x = [];

  while (len > 2) {
    // random non-zero pad
    x[0] = 0;

    while (x[0] == 0) {
      rng.nextBytes(x);
    }

    ba[--len] = x[0];
  }

  ba[--len] = 2;
  ba[--len] = 0;
  return new BigInteger(ba);
} // #region PROTECTED
// protected
// RSAKey.prototype.doPublic = RSADoPublic;
// Perform raw public operation on "x": return x^e (mod n)


var doPublic = function doPublic(x) {
  return x.modPowInt(e, n);
};

var encrypt = function encrypt(text) {
  var m = pkcs1pad2(text, maxLen);

  if (m == null) {
    return null;
  }

  var c = doPublic(m);

  if (c == null) {
    return null;
  }

  var h = c.toString(16);
  var totalLen = maxLen * 2;
  var _h = h,
      length = _h.length; // 不足位数前面补 0

  for (var i = 0; i < totalLen - length; i++) {
    h = "0".concat(h);
  }

  return h;
};

var longEncrypt = function longEncrypt(text) {
  var i;
  var j;
  var tempStr = []; // 这里加密chunk长度如果太长，服务端解密失败，未清楚原因

  var chunk = maxLen - 20;

  if (chunk <= 0) {
    return '';
  }

  for (i = 0, j = text.length; i < j; i += chunk) {
    var hex = encrypt(text.substring(i, i + chunk)) || '';
    tempStr.push(hex);
  } // 竖线进行分割，方便后端切片解密


  return tempStr.join('|');
};

/**
 * 判断 `value` 是 `null` 或者 `undefined`.
 *
 * @method Music.isNil
 * @static
 * @since 1.0.0
 * @see https://github.com/lodash/lodash/blob/master/isNull.js
 * @param {any} value 要检查的值
 * @returns {boolean}
 * @example
 *
 * Music.isNil(null)
 * // => true
 *
 * Music.isNil(void 0)
 * // => true
 *
 * Music.isNil(NaN)
 * // => false
 */
function isNil(value) {
  return value === null || value === undefined;
}

/**
 *
 * 过滤掉输入值的xss非法字符
 *
 * @method Music.filterXSS
 * @since 2.0.0
 * @static
 * @param {string} value 需要处理的值
 * @returns {string} 返回处理后的字符串
 */
function filterXSS(value) {
  var e = value;
  if (!e) return e;

  if (e !== decodeURIComponent(e)) {
    e = decodeURIComponent(e);
  }

  var r = ['<', '>', '\'', '"', '%3c', '%3e', '%27', '%22', '%253c', '%253e', '%2527', '%2522'];
  var n = ['&#x3c;', '&#x3e;', '&#x27;', '&#x22;', '%26%23x3c%3B', '%26%23x3e%3B', '%26%23x27%3B', '%26%23x22%3B', '%2526%2523x3c%253B', '%2526%2523x3e%253B', '%2526%2523x27%253B', '%2526%2523x22%253B'];

  for (var i = 0; i < r.length; i += 1) {
    e = e.replace(new RegExp(r[i], 'gi'), n[i]);
  }

  return e;
}

/** 是否是在手机QQ音乐中打开 */
// mac客户端不算，没有musicReady等接口

var isMusic = !/Macintosh/.test(ua) && /\bQQMusic\//i.test(ua);

/**
 * 等待客户端JSBridge初始化完成
 */

function musicReady(callback) {
  if (isMusic) {
    if (window.WebViewJavascriptBridge) {
      // qq音乐客户端webview已初始化
      callback();
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', callback);
    }
  } else {
    console.error('musicReady can only run on qqmusic');
  }
}

/* eslint-disable no-mixed-operators */
/**
 * 执行客户端调用
 * @param {string} ns 模块名
 * @param {string} method 方法名
 * @param {Function} callback 回调逻辑
 * @param {*} args 参数
 */

function invokeClient(ns, method, callback, args) {
  musicReady(function () {
    var _M, _M$client;

    var timer = window.setTimeout(function () {
      timer = 0;
      callback({});
    }, 3000);
    (_M = M) === null || _M === void 0 ? void 0 : (_M$client = _M.client) === null || _M$client === void 0 ? void 0 : _M$client.invoke(ns, method, args || {}, function (ret) {
      if (timer) {
        clearTimeout(timer);
        callback(ret && ret.code === 0 && ret.data || {});
      }
    });
  });
}

var privacyReportCache = [];
var timer;

var privacyReport = function privacyReport(data) {
  if (Array.isArray(data) && data.length) {
    privacyReportCache = privacyReportCache.concat(data);
  } else if (!Array.isArray(data) && _typeof(data) === 'object') {
    // 支持传对象
    privacyReportCache = privacyReportCache.concat([data]);
  }

  var report = function report() {
    timer && clearTimeout(timer);
    timer = null;
    invokeClient('core', 'support', function (res) {
      if (res && +res.code === 0 && res.data && +res.data.isSupport === 1) {
        invokeClient('other', 'privacyReport', function () {
          console.log('privacyReportCache', JSON.stringify(privacyReportCache));
          privacyReportCache = [];
        }, {
          reportArray: privacyReportCache
        });
      } else {
        // 不支持的情况下要清空缓存。
        privacyReportCache = [];
      }
    }, {
      apiName: 'other.privacyReport'
    });
  }; // 1s报一次


  timer && clearTimeout(timer);
  timer = window.setTimeout(report, 1000);
};

var hasReport = false;

/**
 * @namespace Music.cookie
 */
var cookie = {
  /**
     * 设置一个cookie，还有一点需要注意的，在qq.com下是无法获取qzone.qq.com的cookie，反正qzone.qq.com下能获取到qq.com的所有cookie.
     * 简单得说，子域可以获取根域下的cookie, 但是根域无法获取子域下的cookie.
     * @method Music.cookie.set
     * @param {string} name cookie名称
     * @param {string} value cookie值
     * @param {string} domain 所在域名
     * @param {string} path 所在路径
     * @param {number} hour 存活时间，单位:小时
     * @example
     *
     * Music.cookie.set('name', value, 'qzone.qq.com', '/v5', 24);
     * // 设置cookie
     */
  set: function set(opts) {
    var name = opts.name,
        value = opts.value,
        domain = opts.domain,
        _opts$path = opts.path,
        path = _opts$path === void 0 ? '/' : _opts$path,
        hour = opts.hour,
        date = opts.date;

    if (typeof document === 'undefined') {
      return;
    }

    var expire;

    if (hour || date) {
      expire = typeof date === 'string' ? new Date(date) : new Date();

      if (hour) {
        expire.setTime(expire.getTime() + 3600000 * hour);
      }
    }

    var expireStr = '';

    if (expire) {
      expireStr = "expires=".concat(expire.toUTCString(), ";");
    }

    document.cookie = "".concat(name, "=").concat(value, ";").concat(expireStr, "domain=").concat(isNil(domain) ? location.host : domain, ";path=").concat(path, ";");
  },

  /**
     * 获取指定名称的cookie值
     * @method Music.cookie.get
     * @param {String} name cookie名称
     * @return {String} 获取到的cookie值
     * @example
     *
     * Music.cookie.get('name');
     * // 获取cookie
     */
  get: function get(name) {
    if (typeof document === 'undefined') {
      return '';
    }

    if (!hasReport) {
      hasReport = true;
      privacyReport({
        id: 203,
        purpose_id: 5,
        scene_id: 5,
        content: '用户cookie'
      });
    }

    var m = document.cookie.match(RegExp("(^|;\\s*)".concat(name, "=([^;]*)(;|$)")));
    return filterXSS(m ? decodeURIComponent(m[2]) : '');
  },

  /**
     * 删除指定cookie，复写为过期
     *
     * @method Music.cookie.del
     * @param {String} name cookie名称
     * @param {String} domain 所在域
     * @param {String} path 所在路径
     * @example
     *
     * Music.cookie.del('name');
     * // 删除cookie
     */
  // eslint-disable-next-line object-shorthand
  del: function del(name, domain) {
    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';
    document.cookie = "".concat(name, "=; expires=Mon, 26 Jul 1997 05:00:00 GMT;path=").concat(path, ";domain=").concat(isNil(domain) ? location.host : domain, ";");
  }
};

var tcssName = 'pgv_pvid'; // 自定义cookie 设备标志ID，常驻

var qmfeName = 'fqm_pvqid'; // 浏览器关闭，此cookie消失，用于统计一次访问期间，用户访问的多个页面的情况

var sessionName = 'fqm_sessionid';

function getDomain(url) {
  var strArr = url.split('.');
  var r = 'qq.com';

  if (strArr.length > 2) {
    strArr = strArr.slice(strArr.length - 2);
  }

  if (strArr.length == 2) {
    r = strArr.join('.');
  }

  return r;
}

var setIdCookie = function setIdCookie(name, getId, date) {
  var id = cookie.get(name) || '';

  if (!id) {
    id += getId();
    cookie.set({
      name: name,
      date: date,
      value: id,
      domain: getDomain(location.hostname)
    });
  }

  return id;
};

var genId = function genId() {
  var s = new Date().getUTCMilliseconds();
  var id = Math.round(Math.abs(Math.random() - 1) * 2147483647) * s % 1e10;
  return "".concat(id);
}; // tcss生成的cookie设备标识，常驻


var getPvid = function getPvid() {
  return setIdCookie(tcssName, genId, 'Mon, 18 Jan 2038 00:00:00 GMT');
}; // 自定义cookie 设备标志ID，常驻


var getQpvid = function getQpvid() {
  return setIdCookie(qmfeName, v4, 'Mon, 18 Jan 2038 00:00:00 GMT');
}; // 浏览器关闭，此cookie消失，用于统计一次访问期间，用户访问的多个页面的情况


var getSessionId = function getSessionId() {
  return setIdCookie(sessionName, v4);
};

var hasReport$1 = false;

var detect = function detect() {
  var _version;

  var ua$1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ua;
  var platform = '';
  var version;

  if (version = ua$1.match(/(?:Android);?[\s/]+([\d.]+)?/)) {
    platform = 'android';

    if (!ua$1.match(/Mobile/)) {
      platform = 'androidpad';
    }
  } else if (version = ua$1.match(/(?:iPad).*OS\s([\d_]+)/)) {
    platform = 'ipad';
  } else if (version = ua$1.match(/(?:iPhone\sOS)\s([\d_]+)/)) {
    platform = 'iphone';
  } else if (version = ua$1.match(/(?:iPod)(?:.*OS\s([\d_]+))?/)) {
    platform = 'ipod';
  } else if (/Macintosh/.test(ua$1) && (version = ua$1.match(/OS X ([\d_.]+)/))) {
    platform = 'mac';
  } else if (/Win\d|Windows/.test(ua$1) && (version = ua$1.match(/Windows NT ([\d.]+)/))) {
    platform = 'windows';
  } else if (/Linux/.test(ua$1)) {
    platform = 'linux';
  }

  var os = {
    platform: platform || 'other',
    version: ((_version = version) === null || _version === void 0 ? void 0 : _version[1]) || ''
  };

  if (!hasReport$1) {
    hasReport$1 = true; // 获取操作系统版本上报

    os.version && privacyReport({
      id: 309,
      purpose_id: 17,
      scene_id: 5,
      content: os.version
    });
  }

  return os;
};

var detect$1 = function detect() {
  var _version;

  var ua$1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ua;
  var client = '';
  var version;

  if (version = ua$1.match(/QQMUSIC\/(\d[.\d]*)/i)) {
    client = 'music';

    if (/Macintosh/.test(ua$1)) {
      client = 'macmusic';
    }
  } else if (version = ua$1.match(/pcqqmusic\/(\d[.\d]*)/i)) {
    client = 'pcmusic';
  } else if (version = ua$1.match(/\bBLACKKEY\/(\d[.\d]*)/i)) {
    client = 'moo';
  } else if (version = ua$1.match(/\bQQMUSICLITE\/(\d[.\d]*)/i)) {
    client = 'xiaomimusiclite';
  } else if (version = ua$1.match(/\bQQMUSICLIGHT\/(\d[.\d]*)/i)) {
    // Q音简洁版
    client = 'musiclight';
  } else if (version = ua$1.match(/\bQMfanlive\/(\d[.\d]*)/i)) {
    // 直播qmlive
    client = 'qmlive';
  } else if (version = ua$1.match(/\blazyaudio\/(\d[.\d]*)/i)) {
    // 懒人畅听
    client = 'lazyaudio';
  } else if (version = ua$1.match(/\bKWMusic\/(\d[.\d]*)/i)) {
    // 酷我
    client = 'kuwo';
  } else if (version = ua$1.match(/\bkucy\/(\d[.\d]*)/i)) {
    // 酷次元
    client = 'kucy';
  } else if (version = ua$1.match(/\bFanxing2\/(\d[.\d]*)/i)) {
    // !important: 需要注意这里的顺序，fanxing 的判断一定要在 kuwo 之后，因为 kuwo 低版本存在 fanxing 的标识
    // 酷狗繁星
    client = 'fanxing';
  } else if (version = ua$1.match(/\bKGBrowser\/(\d[.\d]*)/i) || ua$1.match(/\bKugouBrowser\/(\d[.\d]*)/i)) {
    // 酷狗音乐
    client = 'kugou';
  } else if (version = ua$1.match(/MicroMessenger\/(\d[.\d]*)/i)) {
    client = 'weixin';
  } else if (version = ua$1.match(/(?:iPad|iPhone|iPod).*? (?:IPad)?QQ\/([\d.]+)/) || ua$1.match(/\bV1_AND_SQI?_(?:[\d.]+)(?:.*? QQ\/([\d.]+))?/)) {
    client = 'mqq';
  } else if (version = ua$1.match(/\bqmkege\/(\d[.\d]*)/i)) {
    client = 'qmkege';
  } else if (version = ua$1.match(/Weibo \(.*weibo__([\d.]+)/i)) {
    client = 'weibo';
  } else if (version = ua$1.match(/^.*wxwork\/([\d.]+).*$/i)) {
    client = 'wxwork';
  } else if (version = ua$1.match(/\/[\w. ]+MQQBrowser\/([\d.]+)/i)) {
    client = 'mqqbrowser';
  } else if (version = ua$1.match(/Qzone\/V1_(?:AND|IPH)_QZ_([\d._]*\d)/i)) {
    client = 'qzone';
  } else if (/WeSecure|MQQSecure/.test(ua$1)) {
    client = 'tcs';
  } else {
    // 如果不属于以上的客户端，那当作普通浏览器进行识别
    if (version = ua$1.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)) {
      client = 'safari';
    } else if (version = ua$1.match(/\/[\w. ]+QQBrowser\/([\d.]+)/i)) {
      client = 'qqbrowser';
    } else if (version = ua$1.match(/Edge\/([\d.]+)/i)) {
      client = 'edge';
    } else if (version = ua$1.match(/MSIE\s([\d.]+)/) || ua$1.match(/Trident\/[\d](?=[^?]+).*rv:([0-9.]*)/)) {
      client = 'ie';
    } else if (version = ua$1.match(/Firefox\/([\d.]+)/)) {
      client = 'firefox';
    } else if (version = ua$1.match(/Chrome\/([\d.]+)/) || ua$1.match(/CriOS\/([\d.]+)/)) {
      client = 'chrome';
    }
  }

  return {
    client: client || 'other',
    version: ((_version = version) === null || _version === void 0 ? void 0 : _version[1]) || ''
  };
};

// 0：无账号 1：QQ 2：微信 3：FaceBook 4：手机号 5：微博
var AccountSource; // 是否是实时上报，0 No; 1 Yes

(function (AccountSource) {
  AccountSource[AccountSource["NO"] = 0] = "NO";
  AccountSource[AccountSource["QQ"] = 1] = "QQ";
  AccountSource[AccountSource["WX"] = 2] = "WX";
  AccountSource[AccountSource["FB"] = 3] = "FB";
  AccountSource[AccountSource["MBN"] = 4] = "MBN";
  AccountSource[AccountSource["WB"] = 5] = "WB";
})(AccountSource || (AccountSource = {}));

var EventType; // 上报事件类别
// 页面加载 event_pgload
// 页面曝光 event_pgexp
// 页面结束曝光 event_pgdexp
// 元素曝光 event_eleexp
// 元素结束曝光 event_eledexp
// 元素点击 event_eleclick
// 投票 event_vote
// 分享 event_share
// 收藏 event_favorite
// 播放 event_play
// 进出房 event_inout
// 发布内容 event_publish
// app分享 event_appshare

(function (EventType) {
  EventType[EventType["NO"] = 0] = "NO";
  EventType[EventType["YES"] = 1] = "YES";
})(EventType || (EventType = {}));

var EventCtgr;

(function (EventCtgr) {
  EventCtgr["PGLOAD"] = "pgload";
  EventCtgr["PGEXP"] = "event_pgexp";
  EventCtgr["PGDEXP"] = "event_pgdexp";
  EventCtgr["ELEEXP"] = "event_eleexp";
  EventCtgr["ELEDEXP"] = "event_eledexp";
  EventCtgr["ELECLICK"] = "event_eleclick";
  EventCtgr["VOTE"] = "event_vote";
  EventCtgr["SHARE"] = "event_share";
  EventCtgr["FAV"] = "event_favorite";
  EventCtgr["PLAY"] = "event_play";
  EventCtgr["INOUT"] = "event_inout";
  EventCtgr["PUB"] = "event_publish";
  EventCtgr["APPSHARE"] = "event_appshare";
})(EventCtgr || (EventCtgr = {}));

/**
 * 从cookie中获取用户的明文uin
 *
 * 微信的登录态 uin是19位,  如果是微信登录态 返回的是字符串类型 , 如果是正常登录态, 返回的是数字类型, 即QQ号
 * cookie中有login_type，用以区分不同的登录态类型：0-未登录；1-qq登录；2-微信登录
 *
 * @private
 * @returns {string|number}
 */

var getUin = function getUin() {
  var uin = 0; // p_uin是登录态隔离后登录时设置的

  var wxopenid = cookie.get('wxopenid');

  if (!!wxopenid) {
    // 微信登录态下优先取wxuin
    uin = cookie.get('wxuin');
  } else {
    uin = cookie.get('uin');
  }

  uin = uin || cookie.get('p_uin') || cookie.get('qqmusic_uin') || '';

  if (uin.indexOf('o') === 0) {
    uin = uin.substring(1, uin.length);
  }

  if (!/^\d+$/.test(uin)) {
    // 不合法
    uin = 0;
  } else if (uin.length < 14) {
    // QQ号
    uin = parseInt(uin, 10);
  } // 大于14位的微信登录的musicid不转为整型，否则会丢失精度


  return (uin || '').toString();
};

var getUser = function getUser() {
  var wxopenid = cookie.get('wxopenid') || '';
  var wxunionid = cookie.get('wxunionid') || '';
  var qqopenid = cookie.get('psrf_qqopenid') || '';
  var uin = getUin();
  var uid = cookie.get('uid') || ''; // const isWxLogin = !!wxunionid || !!wxopenid || !!(cookie.get('wxuin') || cookie.get('lwxuin'));
  // const isQQlogin = !!(qqopenid && cookie.get('psrf_qqaccess_token'));

  var accSource = AccountSource.NO;

  if (uin && uin.length >= 14) {
    accSource = AccountSource.WX;
  } else if (uin && uin.length < 14) {
    accSource = AccountSource.QQ;
  }

  return {
    uid: uid,
    uin: uin,
    wxopenid: wxopenid,
    wxunionid: wxunionid,
    qqopenid: qqopenid,
    accSource: accSource
  };
}; // 获取用户的数字藏品id


var getNftId = function getNftId() {
  return cookie.get('nft_uin');
};

/**
 * @method getNetType
 * @desc 获取网络类型，2G,3G,4G,WIFI，unknown 五种类型（具体跟客户端的ua有关）。支持QQ音乐客户端，手Q，微信，其他环境暂不支持
 * @return 2G,3G,4G,WIFI，unknown
 */

function getNetType() {
  var netType = ua.match(/\bNetType\/(\w+)/i);
  return netType ? netType[1] : 'unknown';
}

/**
 * 获取url参数 (不包括hash)
 * @method  getParam
 * @param {string} name 需要获取的url参数名
 * @param {string} url  需要解析的url
 * @return decodeuri之后的参数值
 * @desc 注意: 业务代码从url获取参数后, 务必进行严格的格式和类型校验, 避免xss攻击
 */

function getParam(name) {
  var u = location.href.split('#')[0]; // 去掉hash

  var m = u.match(new RegExp("(\\?|&)".concat(name, "=(.*?)(#|&|$)"), 'i'));
  return decodeURIComponent(m ? m[2] : '');
}

var INFO_TYPE; // https://i.y.qq.com/n2/m/api/server?app=am#device.getDeviceInfo

(function (INFO_TYPE) {
  INFO_TYPE["DEVICE"] = "getDeviceInfo";
  INFO_TYPE["GUID"] = "getGuid";
})(INFO_TYPE || (INFO_TYPE = {}));

var getInfo = function getInfo(type) {
  return new Promise(function (resolve) {
    invokeClient('device', type, function (data) {
      resolve(data || {});
    });
  });
};

var getClientInfo = function getClientInfo() {
  return Promise.all([getInfo(INFO_TYPE.DEVICE), getInfo(INFO_TYPE.GUID)]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        deviceInfo = _ref2[0],
        guidInfo = _ref2[1];

    return {
      c_idfv: deviceInfo.identifier || '',
      c_idfa: deviceInfo.idfa || '',
      c_is_rooted: deviceInfo.isBroken || '0',
      c_device_model: deviceInfo.model || '',
      c_imsi: guidInfo.imsi || '',
      c_imei1: guidInfo.imei || '',
      c_uuid: guidInfo.uid || '',
      // 数据(mengqiliao, shawqian)反馈，需要的是uid(getSession下发的)
      c_udid: guidInfo.uuid || '',
      // 数据(mengqiliao, shawqian)反馈
      c_operator_name: guidInfo.isp || ''
    };
  });
};

window.fqm_visit_id = window.fqm_visit_id || v4();

var UnityReport = function UnityReport() {
  var _this = this,
      _window2,
      _window2$__fqm_config;

  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, UnityReport);

  _defineProperty(this, "pageUrl", void 0);

  _defineProperty(this, "statUrl", 'https://stat6.y.qq.com/h5/');

  _defineProperty(this, "version", "1.4.14");

  _defineProperty(this, "com", void 0);

  _defineProperty(this, "items", []);

  _defineProperty(this, "timer", void 0);

  _defineProperty(this, "getShareParam", function () {
    var sessionId = getSessionId();
    return {
      share_origin_id: getParam('share_origin_id') || sessionId,
      share_session_id: sessionId
    };
  });

  _defineProperty(this, "reportExposure", function () {
    var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isImediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _this.reportEvent(_objectSpread2(_objectSpread2({}, item), {}, {
      event_category: item.event_category || (item.element_id ? EventCtgr.ELEEXP : EventCtgr.PGEXP)
    }), isImediate);
  });

  _defineProperty(this, "reportEleExposure", function () {
    var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isImediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _this.reportEvent(_objectSpread2(_objectSpread2({}, item), {}, {
      event_category: item.event_category || EventCtgr.ELEEXP
    }), isImediate);
  });

  _defineProperty(this, "reportClick", function (item) {
    var isImediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _this.reportEvent(_objectSpread2(_objectSpread2({}, item), {}, {
      event_category: item.event_category || EventCtgr.ELECLICK
    }), isImediate);
  });

  _defineProperty(this, "reportEvent", function (item) {
    var _window;

    var isImediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    Object.keys(item || {}).forEach(function (k) {
      var key = k;
      var i = item[key];

      if (typeof i !== 'string') {
        console.error("".concat(key, " must be string"));
        item[key] = _typeof(i) === 'object' ? JSON.stringify(i) : (i || '').toString();
      }
    });

    var newItem = _objectSpread2(_objectSpread2({
      event_id: v4()
    }, item), {}, {
      hash: item.hash || "".concat(location.hash),
      search: encodeURIComponent((item.search || "".concat(location.search)).slice(0, 258)),
      event_category: item.event_category || EventCtgr.PGEXP,
      app_trace_id: item.app_trace_id || ((_window = window) === null || _window === void 0 ? void 0 : _window.app_trace_id) || '',
      adtag: item.adtag || getParam('ADTAG'),
      share_from_uin: (item === null || item === void 0 ? void 0 : item.share_from_uin) || getParam('share_from_uin') || getParam('hosteuin') || '',
      operate_time: item.operate_time || Math.floor(new Date().getTime() / 1000).toString(),
      url: item.url || _this.pageUrl
    });

    /* disabled */

    /* disabled */
  });

  _defineProperty(this, "reportShare", function () {
    var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isImediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _this.reportEvent(_objectSpread2(_objectSpread2(_objectSpread2({}, _this.getShareParam()), item), {}, {
      event_category: item.event_category || EventCtgr.APPSHARE
    }), isImediate);
  });

  _defineProperty(this, "reportPlay", function (item) {
    var isImediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _this.reportEvent(_objectSpread2(_objectSpread2({}, item), {}, {
      event_category: item.event_category || EventCtgr.PLAY
    }), isImediate);
  });

  _defineProperty(this, "clearSendTimer", function () {
    if (_this.timer) {
      clearTimeout(_this.timer);
      _this.timer = void 0;
    }
  });

  _defineProperty(this, "send", function () {
    var isImediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _this.clearSendTimer();

    var report = function report() {
      _this.clearSendTimer();

      if (!_this.items || _this.items.length <= 0) {
        return;
      }

      var data = _objectSpread2(_objectSpread2({}, _this.com), {}, {
        items: _toConsumableArray(_this.items)
      });

      var str = window.encodeURIComponent(JSON.stringify(data));
      var encryptData = longEncrypt(str); // 清除原来的发送数据

      _this.items = [];
      requset(_this.statUrl, encryptData);
    };

    if (isImediate) {
      report();
      return;
    }

    _this.timer = window.setTimeout(report, 200);
  });

  var _opts$statUrl = opts.statUrl,
      statUrl = _opts$statUrl === void 0 ? '' : _opts$statUrl,
      virtualUrl = opts.virtualUrl,
      _opts$com = opts.com,
      com = _opts$com === void 0 ? {} : _opts$com;
  this.statUrl = statUrl || this.statUrl;
  this.pageUrl = virtualUrl || "".concat(location.hostname).concat(location.pathname);
  var os = detect();
  var browser = detect$1();
  var user = getUser();
  this.com = _objectSpread2({
    c_appid: 'qqmusich5',
    c_key: 'landing',
    c_fqm_id: ((_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$__fqm_config = _window2.__fqm_config__) === null || _window2$__fqm_config === void 0 ? void 0 : _window2$__fqm_config.appId) || 'bcbc9157-72b0-4676-b1fb-dd9cd9a99358',
    c_app_name: 'QQ音乐',
    c_app_name_en: 'qqmusic',
    c_event_type: EventType.NO,
    c_uid: user.uid || '',
    c_uin: user.uin || '',
    c_nft_id: getNftId() || '',
    c_account_source: user.accSource,
    c_qq_openid: user.qqopenid,
    c_wx_openid: user.wxopenid,
    c_wx_unionid: user.wxunionid,
    c_pgv_pvid: getPvid(),
    c_pvqid: getQpvid(),
    c_session_id: getSessionId(),
    c_visit_id: window.fqm_visit_id,
    c_network_type: getNetType(),
    c_client_type: browser.client,
    c_client_version: browser.version,
    c_platform_type: os.platform,
    c_os_version: os.version,
    c_sdk_version: this.version,
    c_share_origin_id: getParam('share_origin_id'),
    c_share_from_session_id: getParam('share_session_id')
  }, com);

  if (isMusic) {
    getClientInfo().then(function (clientInfo) {
      _this.com = _objectSpread2(_objectSpread2({}, _this.com), clientInfo);
    });
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UnityReport);



//# sourceURL=webpack://qqmusic/./node_modules/@tencent/qmfe-unity-report/es/index.js?