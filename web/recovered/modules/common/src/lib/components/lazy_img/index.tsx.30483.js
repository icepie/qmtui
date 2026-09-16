/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31603);


const win = window;
const defaultOption = {
  defaultImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAD0lEQVR4AWM4bYwJh7QgANLSYzmZH3ISAAAAAElFTkSuQmCC',
  threshold: 0,
  // (可选, 默认值:0)发起加载的阈值，为正值则提前加载，像素为单位
  container: win,
  // (可选, 默认值:window)容器，若为局部滚动，可传入对应的container DOM元素/选择器
  isVertical: true,
  // (可选, 默认值:true)是否竖滚
  loadCallback: null,
  // (可选, 默认值:空)图片加载成功时的回调，默认不处理
  errorCallback: null // (可选, 默认值:空)图片加载失败时的回调，默认设置成默认图

};

const LazyImg = props => {
  const {
    container = null,
    className,
    origin,
    alt = '',
    defaultimg,
    easeInOut = false
  } = props;
  let maxErrorNum = 2;
  let hasBindScrollEvent = false;
  let timer = null;
  const [isInView, setIsInView] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [option] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultOption);
  const imgRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createRef();
  const src = isInView ? origin : defaultimg;

  const checkIsInView = (force = false) => {
    if (isInView && !force) {
      return;
    }

    if (imgRef !== null && imgRef !== void 0 && imgRef.current) {
      const _container = (container === null || container === void 0 ? void 0 : container.current) || win;

      if (typeof window.addEventListener === 'undefined') {
        setIsInView(false);
        return;
      }

      const imgOffset = imgRef.current.getBoundingClientRect();
      let containerOffset;

      if (_container instanceof HTMLDivElement && _common_utils__WEBPACK_IMPORTED_MODULE_1__/* .default.isFunction */ .ZP.isFunction(_container.getBoundingClientRect)) {
        containerOffset = _container.getBoundingClientRect();
      } else {
        containerOffset = {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }

      const viewHeight = containerOffset.height;
      const viewTop = containerOffset.top;
      setIsInView(imgRef.current.offsetParent !== null && viewTop + viewHeight >= imgOffset.top + option.threshold);
    }
  };

  const handleContainerScroll = () => {
    if (!timer) {
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        checkIsInView();
      }, 100);
      checkIsInView();
    }
  };

  const handleWindowResize = () => {
    setTimeout(() => {
      checkIsInView();
    }, 200);
  };

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    checkIsInView();
    return () => {
      var _container$current;

      container === null || container === void 0 ? void 0 : (_container$current = container.current) === null || _container$current === void 0 ? void 0 : _container$current.removeEventListener('scroll', handleContainerScroll);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (container !== null && container !== void 0 && container.current && !hasBindScrollEvent) {
      container.current.addEventListener('scroll', handleContainerScroll);
      window.addEventListener('resize', handleWindowResize);
      hasBindScrollEvent = true;
    }
  }, [container]);

  const handleImgLoadErr = ev => {
    if (maxErrorNum > 0) {
      ev.currentTarget.src = defaultimg;
      maxErrorNum--;
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
    src: _common_utils__WEBPACK_IMPORTED_MODULE_1__/* .default.fixUrl */ .ZP.fixUrl(src),
    onError: handleImgLoadErr,
    ref: imgRef,
    className: `${className}${easeInOut ? ' east_in_out_pic' : ''}${isInView ? ' in_view' : ''}`,
    alt: alt
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LazyImg);

//# sourceURL=webpack://qqmusic/./src/lib/components/lazy_img/index.tsx?