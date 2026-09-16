/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67294);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(73935);
/* harmony import */ var tone__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(71795);



const diyMenuRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createRef();

class DiyMenu extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.headerDom = null;
    this.footDom = null;
    this.menuPageX = void 0;
    this.menuPageY = void 0;
    this.clientY = void 0;
    this.menuWrapperRef = void 0;
    this.globalSubListItemIndex = void 0;
    this.sublistItemRefArr = void 0;

    this.setPosition = () => {
      var _menuWrapperRef$curre, _menuWrapperRef$curre2;

      const {
        menuPageX,
        menuPageY,
        clientY,
        menuWrapperRef
      } = this;
      const windowWidth = document.body.clientWidth;
      const windowHeight = document.body.clientHeight;
      const menuWidth = menuWrapperRef === null || menuWrapperRef === void 0 ? void 0 : (_menuWrapperRef$curre = menuWrapperRef.current) === null || _menuWrapperRef$curre === void 0 ? void 0 : _menuWrapperRef$curre.offsetWidth;
      const menuHeight = menuWrapperRef === null || menuWrapperRef === void 0 ? void 0 : (_menuWrapperRef$curre2 = menuWrapperRef.current) === null || _menuWrapperRef$curre2 === void 0 ? void 0 : _menuWrapperRef$curre2.offsetHeight;
      let left = menuPageX;
      let top = menuPageY;

      if (menuWidth + menuPageX > windowWidth) {
        left = menuPageX - menuWidth;
      }

      if (menuHeight + 90 + clientY > windowHeight) {
        top = menuPageY - menuHeight < 0 ? 10 : menuPageY - menuHeight;
      }

      this.setState({
        style: {
          height: 'auto',
          display: '',
          left,
          top
        }
      });
    };

    this.setSubPosition = (superDom, idx) => {
      var _this$menuWrapperRef$;

      const subDom = this.sublistItemRefArr[idx];
      if (!subDom || !superDom) return;

      const menuContainer = (_this$menuWrapperRef$ = this.menuWrapperRef.current) === null || _this$menuWrapperRef$ === void 0 ? void 0 : _this$menuWrapperRef$;
      if (!menuContainer) return;

      const rect = superDom.getBoundingClientRect();
      const menuRect = menuContainer.getBoundingClientRect();
      const subMenuWidth = subDom.offsetWidth || 180;
      const subMenuHeight = subDom.offsetHeight || 120;
      const windowWidth = document.body.clientWidth;
      const windowHeight = document.body.clientHeight;
      const itemHeight = superDom.offsetHeight || 36;

      // 左右：默认向右展开，右侧空间不足则向左展开
      let left = 0;
      if (rect.left + subMenuWidth + 4 > windowWidth) {
        left = -subMenuWidth - 4;
      }

      // 触发行在主菜单容器内的 Y 偏移（.operate_menu_sub 相对菜单容器绝对定位）
      const triggerOffsetInMenu = rect.top - menuRect.top;

      // 底边对齐：子菜单底边 = 触发行底边
      let top = triggerOffsetInMenu + itemHeight - subMenuHeight;

      // 防止超出视口顶部
      const subMenuAbsTop = menuRect.top + top;
      if (subMenuAbsTop < 10) {
        top += (10 - subMenuAbsTop);
      }
      // 防止超出视口底部
      if (menuRect.top + top + subMenuHeight > windowHeight - 10) {
        top = windowHeight - 10 - menuRect.top - subMenuHeight;
      }

      const data = this.state.menuContentData.slice();
      data[idx].subListStyle = { left, top };
      if (!data[idx].subListStyle.left) delete data[idx].subListStyle.left;

      this.setState({ menuContentData: data });
    };

    this.showMenu = (ev, menuContentList, subStyle) => {
      this.menuPageX = ev.pageX;
      this.menuPageY = ev.pageY;
      this.clientY = ev.clientY;

      if ((0,tone__WEBPACK_IMPORTED_MODULE_2__/* .isArray */ .kJ)(menuContentList)) {
        this.setState({
          menuContentData: menuContentList,
          style: {
            display: ''
          },
          subStyle
        }, () => {
          this.setPosition();
        });
      }
    };

    this.hide = () => {
      this.setState({
        style: {
          display: 'none'
        }
      });
      this.sublistItemRefArr = [];
    };

    this.handleSubmenuItemClick = item => {
      item.fn && item.fn();
      this.hide();
    };

    this.switchFocusStateOnSubmenuItem = (isFocus, superIndex, subIndex) => {
      const data = this.state.menuContentData.slice();

      if (data[superIndex] && data[superIndex].sublist && data[superIndex].sublist[subIndex]) {
        data[superIndex].sublist[subIndex].focus = isFocus;
        this.setState({
          menuContentData: data
        });
      }
    };

    this.renderSubList = (menuListItem, superIndex) => {
      var _menuListItem$sublist;

      const {
        handleSubmenuItemClick,
        switchFocusStateOnSubmenuItem
      } = this;
      const subList = menuListItem === null || menuListItem === void 0 ? void 0 : (_menuListItem$sublist = menuListItem.sublist) === null || _menuListItem$sublist === void 0 ? void 0 : _menuListItem$sublist.map((item, index) => {
        if (item) {
          const subMenuClassName = `c_b_normal${item.groupend ? ' operate_menu__item--line' : ''}`;
          const anchorClassName = `operate_menu__link c_tx_normal c_popup__link ${item.fn ? '' : 'c_tx_disabled'} ${item.iconClass}${item.focus ? ' c_bg_normal' : ''}`;
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
            className: subMenuClassName,
            key: index
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
            className: anchorClassName,
            onClick: () => handleSubmenuItemClick(item),
            onMouseEnter: () => switchFocusStateOnSubmenuItem(true, superIndex, index),
            onMouseLeave: () => switchFocusStateOnSubmenuItem(false, superIndex, index)
          }, item.text));
        }
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", {
        className: "sub_list__wrapper",
        style: menuListItem === null || menuListItem === void 0 ? void 0 : menuListItem.style,
        onWheel: ev => ev.stopPropagation()
      }, menuListItem === null || menuListItem === void 0 ? void 0 : menuListItem.header, subList, menuListItem === null || menuListItem === void 0 ? void 0 : menuListItem.footDom);
    };

    this.handleMenuContentItemClick = (ev, item) => {
      item && item.fn && item.fn(ev);

      if (!(item !== null && item !== void 0 && item.getSubListCb)) {
        this.hide();
      }
    };

    this.handleMouseEnterMenuContentItem = (ev, item, idx) => {
      const data = this.state.menuContentData.slice();
      const dom = ev.target;
      data.forEach((_, _idx) => {
        if (_) {
          _.focus = _idx === idx;
          // 切换时关闭其他项的子菜单（防止"添加到"和"下载"子菜单同时显示）
          if (_idx !== idx) {
            _.hover = false;
          }
        }
      });

      if (item !== null && item !== void 0 && item.getSubListCb) {
        if (!(item !== null && item !== void 0 && item.sublist)) {
          item.getSubListCb((list, header, footDom) => {
            data[idx].sublist = list;
            data[idx].header = header;
            data[idx].hover = true;
            data[idx].footDom = footDom;
          });
        } else {
          data[idx].hover = true;
        }

        this.setState({
          menuContentData: data
        }, () => {
          this.setSubPosition(dom, idx);
        });
        this.globalSubListItemIndex = idx;
      } else {
        this.setState({
          menuContentData: data
        });
      }
    };

    this.handleMouseLeaveMenuContentItem = idx => {
      const data = this.state.menuContentData.slice();
      data[idx].focus = false;
      this.setState({
        menuContentData: data
      });
    };

    this.state = {
      menuClassName: '',
      style: {},
      disabledClassName: ' c_tx_disabled',
      moreMenuClassName: ' operate_menu__icon_more ',
      menuContentData: [],
      subStyle: {}
    };
    this.menuWrapperRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createRef();
    this.menuPageX = 0;
    this.menuPageY = 0;
    this.clientY = 0;
    this.globalSubListItemIndex = 0;
    this.sublistItemRefArr = [];
  }

  render() {
    const {
      menuContentData,
      menuClassName,
      style,
      subStyle,
      disabledClassName,
      moreMenuClassName
    } = this.state;
    const {
      headerDom,
      footDom,
      menuWrapperRef,
      renderSubList,
      handleMenuContentItemClick,
      handleMouseEnterMenuContentItem,
      handleMouseLeaveMenuContentItem
    } = this;
    const _menuClassName = `mod_operate_menu c_bg_floor ${menuClassName || ''}`;
    const fixHtml = [];
    const menuLIElementContent = [];
    menuContentData.map((item, idx) => {
      const _subClass = `operate_menu_sub c_bg_floor ${(item === null || item === void 0 ? void 0 : item.subClass) || ''}`;
      const url = (item === null || item === void 0 ? void 0 : item.url) || '';
      const isDisabled = !!(item && item.disabled) || (!(item !== null && item !== void 0 && item.fn) && url === '' && !(item !== null && item !== void 0 && item.getSubListCb));
      const subMenuWrapper = (!isDisabled && item !== null && item !== void 0 && item.getSubListCb) ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: _subClass,
        ref: ref => {
          this.sublistItemRefArr[idx] = ref;
        },
        style: item === null || item === void 0 ? void 0 : item.subListStyle
      }, renderSubList(item, idx)) : '';
      const iconClass = (item === null || item === void 0 ? void 0 : item.iconClass) || '';

      if (!(item !== null && item !== void 0 && item.isFix)) {
        const liClassName = `operate_menu_item ${isDisabled ? disabledClassName : ' '} ${item !== null && item !== void 0 && item.groupend ? ' operate_menu__item--line c_b_normal' : ''}${subMenuWrapper ? ' hover' : ''}${item !== null && item !== void 0 && item.hover ? ' hover' : ''}`;
        const operateClassName = `operate_menu__link c_b_normal ${isDisabled ? disabledClassName : ' '} ${subMenuWrapper ? moreMenuClassName : ' '}${iconClass}${item !== null && item !== void 0 && item.focus ? ' c_bg_normal' : ''}`;
        menuLIElementContent.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
          className: liClassName,
          key: idx
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
          className: operateClassName,
          style: {
            pointerEvents: isDisabled ? 'none' : 'auto'
          },
          onClick: ev => handleMenuContentItemClick(ev, item),
          onMouseEnter: ev => !isDisabled && handleMouseEnterMenuContentItem(ev, item, idx),
          onMouseLeave: () => !isDisabled && handleMouseLeaveMenuContentItem(idx)
        }, item === null || item === void 0 ? void 0 : item.text), item !== null && item !== void 0 && item.hover ? subMenuWrapper : ''));
      } else {
        const operateClass = `operate_menu__link c_popup__link ${iconClass}`;
        fixHtml.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
          key: idx,
          className: operateClass
        }, item.text));
      }
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      ref: menuWrapperRef,
      className: _menuClassName,
      style: style,
      onWheel: ev => ev.stopPropagation()
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "operate_menu_main"
    }, headerDom, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", {
      className: "operate_menu_main_ul",
      style: subStyle
    }, menuLIElementContent), fixHtml, footDom));
  }

}

const div = document.createElement('div');
document.body.appendChild(div);
react_dom__WEBPACK_IMPORTED_MODULE_1__.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DiyMenu, {
  ref: diyMenuRef
}), div);
document.body.addEventListener('click', () => {
  var _diyMenuRef$current;

  (_diyMenuRef$current = diyMenuRef.current) === null || _diyMenuRef$current === void 0 ? void 0 : _diyMenuRef$current.hide();
});
document.body.addEventListener('mousewheel', ev => {
  if (document.querySelector('.operate_menu_main') && !document.querySelector('.operate_menu_main').contains(ev.target) && document.querySelector('.operate_menu_sub') && !document.querySelector('.operate_menu_sub').contains(ev.target)) {
    var _diyMenuRef$current2;

    (_diyMenuRef$current2 = diyMenuRef.current) === null || _diyMenuRef$current2 === void 0 ? void 0 : _diyMenuRef$current2.hide();
  } else {
    ev.stopPropagation();
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (diyMenuRef);

//# sourceURL=webpack://qqmusic/./src/component/diy_menu/index.tsx?