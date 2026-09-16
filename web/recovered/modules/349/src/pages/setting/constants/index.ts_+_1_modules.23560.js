
// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "A5": () => (/* binding */ getDefaultSetting),
  "JV": () => (/* binding */ getInitialSettingValue),
  "GP": () => (/* binding */ getSettingItemList),
  "oY": () => (/* binding */ lyricConfig),
  "SN": () => (/* binding */ tabList)
});

// UNUSED EXPORTS: THEME_COLORS, getSystemFonts

// EXTERNAL MODULE: ./src/lib/common/event.ts
var common_event = __webpack_require__(67224);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(67294);
;// CONCATENATED MODULE: ./src/pages/setting/components/lyric_preview.tsx




class LyricPreview extends react.Component {
  constructor(props) {
    super(props);

    this.switchSelected = args => {
      const {
        key,
        value
      } = args;

      if (Reflect.has(lyricConfig, key)) {
        this.setState({
          lyricStyle: { ...this.state.lyricStyle,
            ...{
              [Reflect.get(lyricConfig, key)]: value
            }
          }
        });
      }
    };

    this.state = {
      lyricStyle: getInitialSettingValue()
    };
  }

  componentDidMount() {
    common_event/* default.on */.Z.on('app_setting_change', this.switchSelected);
  }

  componentWillUnmount() {
    common_event/* default.removeListener */.Z.removeListener('app_setting_change', this.switchSelected);
  }

  render() {
    const {
      lyricStyle
    } = this.state;
    const {
      textAlign,
      displayedColor,
      playedColor
    } = lyricStyle;
    return /*#__PURE__*/react.createElement("div", {
      className: "lyric_over__wrapper",
      style: {
        textAlign
      }
    }, /*#__PURE__*/react.createElement(LyricPreviewItem, {
      half: true,
      zIndex: 3,
      lyricStyle: lyricStyle,
      color: playedColor
    }), /*#__PURE__*/react.createElement(LyricPreviewItem, {
      zIndex: 2,
      lyricStyle: lyricStyle,
      color: displayedColor
    }));
  }

}

const LyricPreviewItem = ({
  lyricStyle,
  zIndex,
  half,
  color
}) => {
  const {
    fontSize,
    fontFamily,
    border,
    bolder,
    textShadowColor
  } = lyricStyle;
  const halfWidth = half ? '50%' : null;
  return /*#__PURE__*/react.createElement("div", {
    className: "position__wrapper",
    style: {
      zIndex
    }
  }, /*#__PURE__*/react.createElement("div", {
    className: "text__wrapper",
    style: {
      color
    }
  }, /*#__PURE__*/react.createElement("div", {
    className: "inner_wrapper",
    style: half ? {
      width: halfWidth
    } : {}
  }, /*#__PURE__*/react.createElement("span", {
    style: {
      fontSize: `${fontSize}px`,
      fontFamily,
      textShadow: border ? `-1.5px -1.5px 1px ${textShadowColor}` : 'none',
      fontWeight: bolder ? 'bold' : 'normal'
    }
  }, "QQ\u97F3\u4E50\uFF0C\u8BA9\u751F\u6D3B\u5145\u6EE1\u97F3\u4E50"))));
};

/* harmony default export */ const lyric_preview = (LyricPreview);
// EXTERNAL MODULE: ./node_modules/electron-settings/dist/settings.js
var settings = __webpack_require__(44418);
var settings_default = /*#__PURE__*/__webpack_require__.n(settings);
// EXTERNAL MODULE: ./src/pages/setting/constants/types.ts
var types = __webpack_require__(80793);
;// CONCATENATED MODULE: ./src/pages/setting/constants/index.ts





const fontList = __webpack_require__(54538);

const tabList = [{
  label: '常规设置',
  id: types/* TAB_LIST_ITEM_KEY.NORMAL */.Z.NORMAL
}];
const DEFAULT_SETTING = {
  normal: {
    boost: {
      remember_window_size: true
    },
    play: {
      music_ease_in_out: true,
      auto_open_desktop_lyric: false,
      remember_voice: true
    }
  },
  desktop_lyric: {
    text_align: 'center',
    font_family: 'Microsoft YaHei, MicrosoftJhengHei',
    font_size: 36,
    color: {
      theme: '',
      played_text_color: 'rgb(220, 230, 30)',
      displayed_text_color: 'rgb(55, 175, 255)'
    },
    font_style: {
      border: false,
      bolder: false,
      text_shadow_color: 'rgba(0,0,0,1)'
    }
  }
};
const getDefaultSetting = key => {
  return key.split('.').reduce((previousValue, currentValue) => {
    return previousValue[currentValue];
  }, DEFAULT_SETTING);
};
const lyricConfig = {
  'desktop_lyric.text_align': 'textAlign',
  'desktop_lyric.font_family': 'fontFamily',
  'desktop_lyric.font_size': 'fontSize',
  'desktop_lyric.color.played_text_color': 'playedColor',
  'desktop_lyric.color.displayed_text_color': 'displayedColor',
  'desktop_lyric.font_style.bolder': 'bolder',
  'desktop_lyric.font_style.border': 'border',
  'desktop_lyric.font_style.text_shadow_color': 'textShadowColor'
};
const getInitialSettingValue = () => {
  const initialSettingValue = {};

  for (const key in lyricConfig) {
    if (settings_default().getSync(key) !== undefined) {
      initialSettingValue[Reflect.get(lyricConfig, key)] = settings_default().getSync(key);
    } else {
      initialSettingValue[Reflect.get(lyricConfig, key)] = getDefaultSetting(key);
    }
  }

  return initialSettingValue;
};
const THEME_COLORS = {
  'light green': ['rgb(220,230,30)', 'rgb(60,195,35)'],
  'cute pink': ['rgb(220,230,30)', 'rgb(205,70,195)'],
  'deep blue': ['rgb(220,230,30)', 'rgb(55,175,255)'],
  'gentle gray': ['rgb(55,175,255)', 'rgb(215,215,215)'],
  'light yellow': ['rgb(0,255,255)', 'rgb(255,175,0)'],
  customized: null
}; // export const SETTING_ITEM_LIST: Array<SettingItem> = [
//     {
//         identityKey: TAB_LIST_ITEM_KEY.NORMAL,
//         label: '常规设置',
//         items: [
//             {
//                 identityKey: 'boost',
//                 label: '启动',
//                 contents: [
//                     {
//                         onClick: (value: string) => {
//                             event.emit('app_setting_change', {
//                                 key: 'normal.boost.remember_window_size',
//                                 value
//                             });
//                         },
//                         identityKey: 'normal.boost.remember_window_size',
//                         label: '记住窗口大小',
//                         type: SETTING_ITEM_TYPE.SQUARE_RADIO
//                     }
//                 ]
//             },
//             {
//                 identityKey: 'play',
//                 label: '播放',
//                 contents: [
//                     {
//                         identityKey: 'normal.play.music_ease_in_out',
//                         label: '开启音乐渐进渐出',
//                         type: SETTING_ITEM_TYPE.SQUARE_RADIO,
//                         onClick: (value: boolean) => {
//                             event.emit('app_setting_change', {
//                                 key: 'normal.play.music_ease_in_out',
//                                 value
//                             });
//                         }
//                     },
//                     {
//                         identityKey: 'normal.play.auto_open_desktop_lyric',
//                         onClick: (value: boolean) => {
//                             event.emit('app_setting_change', {
//                                 key: 'normal.play.auto_open_desktop_lyric',
//                                 value
//                             });
//                         },
//                         label: '自动打开歌词',
//                         type: SETTING_ITEM_TYPE.SQUARE_RADIO
//                     },
//                     {
//                         identityKey: 'normal.play.remember_voice',
//                         onClick: (value: boolean) => {
//                             event.emit('app_setting_change', {
//                                 key: 'normal.play.remember_voice',
//                                 value
//                             });
//                         },
//                         label: '记住音量',
//                         type: SETTING_ITEM_TYPE.SQUARE_RADIO
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         identityKey: TAB_LIST_ITEM_KEY.DESKTOP_LYRIC,
//         label: '桌面歌词设置',
//         items: [
//             {
//                 identityKey: 'desktop_lyric.text_align',
//                 label: '对齐',
//                 contents: [
//                     {
//                         value: 'center',
//                         onClick: (value: string) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.text_align',
//                                 value
//                             });
//                         },
//                         identityKey: 'desktop_lyric.text_align',
//                         label: '居中对齐',
//                         type: SETTING_ITEM_TYPE.CIRCLE_RADIO
//                     },
//                     {
//                         value: 'left',
//                         onClick: (value: string) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.text_align',
//                                 value
//                             });
//                         },
//                         identityKey: 'desktop_lyric.text_align',
//                         label: '左对齐',
//                         type: SETTING_ITEM_TYPE.CIRCLE_RADIO
//                     },
//                     {
//                         value: 'right',
//                         onClick: (value: boolean) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.text_align',
//                                 value
//                             });
//                         },
//                         identityKey: 'desktop_lyric.text_align',
//                         label: '右对齐',
//                         type: SETTING_ITEM_TYPE.CIRCLE_RADIO
//                     }
//                 ]
//             },
//             {
//                 identityKey: 'font_family',
//                 label: '字体字号',
//                 contents: [
//                     {
//                         identityKey: 'desktop_lyric.font_family',
//                         onSelectChange: (value: string) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.font_family',
//                                 value
//                             });
//                         },
//                         type: SETTING_ITEM_TYPE.SELECT,
//                         options: []
//                     },
//                     {
//                         identityKey: 'desktop_lyric.font_size',
//                         type: SETTING_ITEM_TYPE.SELECT,
//                         options: (function (): Array<SelectOption> {
//                             const arr = [];
//                             for (let i = 18; i <= 60; i++) {
//                                 arr.push({
//                                     label: i,
//                                     value: i
//                                 });
//                             }
//                             return arr;
//                         })(),
//                         onSelectChange: (value: number) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.font_size',
//                                 value
//                             });
//                         }
//                     }
//                 ]
//             },
//             {
//                 identityKey: 'desktop_lyric.color',
//                 label: '颜色',
//                 contents: [
//                     {
//                         identityKey: 'desktop_lyric.color.theme',
//                         type: SETTING_ITEM_TYPE.SELECT,
//                         onSelectChange: (value: string) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.color.theme',
//                                 value
//                             });
//                             const themeColor = THEME_COLORS[value];
//                             if (themeColor) {
//                                 event.emit('app_setting_change', {
//                                     key: 'desktop_lyric.color.played_text_color',
//                                     value: themeColor[0]
//                                 });
//                                 event.emit('app_setting_change', {
//                                     key: 'desktop_lyric.color.displayed_text_color',
//                                     value: themeColor[1]
//                                 });
//                             }
//                         },
//                         options: [
//                             {
//                                 label: '清新绿',
//                                 value: 'light green'
//                             },
//                             {
//                                 label: '可爱粉',
//                                 value: 'cute pink'
//                             },
//                             {
//                                 label: '深邃蓝',
//                                 value: 'deep blue'
//                             },
//                             {
//                                 label: '高雅灰',
//                                 value: 'gentle gray'
//                             },
//                             {
//                                 label: '活力黄',
//                                 value: 'light yellow'
//                             },
//                             {
//                                 label: '自定义',
//                                 value: 'customized'
//                             }
//                         ]
//                     },
//                     {
//                         identityKey: 'desktop_lyric.color.played_text_color',
//                         type: SETTING_ITEM_TYPE.COLOR_PICK,
//                         label: '已播放字色',
//                         onColorChange: (value: string) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.color.played_text_color',
//                                 value
//                             });
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.color.theme',
//                                 value: 'customized'
//                             });
//                         }
//                     },
//                     {
//                         identityKey: 'desktop_lyric.color.displayed_text_color',
//                         type: SETTING_ITEM_TYPE.COLOR_PICK,
//                         label: '未播放字色',
//                         onColorChange: (value: string) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.color.displayed_text_color',
//                                 value
//                             });
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.color.theme',
//                                 value: 'customized'
//                             });
//                         }
//                     }
//                 ]
//             },
//             {
//                 identityKey: 'desktop_lyric.font_style',
//                 label: '文字样式',
//                 contents: [
//                     {
//                         identityKey: 'desktop_lyric.font_style.border',
//                         label: '边框',
//                         type: SETTING_ITEM_TYPE.SQUARE_RADIO,
//                         onClick: (value: boolean) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.font_style.border',
//                                 value
//                             });
//                         }
//                     },
//                     {
//                         identityKey: 'desktop_lyric.font_style.text_shadow_color',
//                         label: '边框色',
//                         type: SETTING_ITEM_TYPE.COLOR_PICK,
//                         onColorChange: (value: string) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.font_style.text_shadow_color',
//                                 value
//                             });
//                         }
//                     },
//                     {
//                         identityKey: 'desktop_lyric.font_style.bolder',
//                         label: '粗体',
//                         type: SETTING_ITEM_TYPE.SQUARE_RADIO,
//                         onClick: (value: boolean) => {
//                             event.emit('app_setting_change', {
//                                 key: 'desktop_lyric.font_style.bolder',
//                                 value
//                             });
//                         }
//                     }
//                 ]
//             },
//             {
//                 identityKey: 'desktop_lyric.preview',
//                 label: '效果预览',
//                 contents: [
//                     {
//                         DIY: true,
//                         component: LyricPreview
//                     }
//                 ]
//             }
//         ]
//     }
// ];

const getSettingItemList = async () => {
  const font = await getSystemFonts();
  return [{
    identityKey: types/* TAB_LIST_ITEM_KEY.NORMAL */.Z.NORMAL,
    label: '常规设置',
    items: [{
      identityKey: 'boost',
      label: '启动',
      contents: [{
        onClick: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'normal.boost.remember_window_size',
            value
          });
        },
        identityKey: 'normal.boost.remember_window_size',
        label: '记住窗口大小',
        type: types/* SETTING_ITEM_TYPE.SQUARE_RADIO */.X.SQUARE_RADIO
      }]
    }, {
      identityKey: 'play',
      label: '播放',
      contents: [{
        identityKey: 'normal.play.music_ease_in_out',
        label: '开启音乐渐进渐出',
        type: types/* SETTING_ITEM_TYPE.SQUARE_RADIO */.X.SQUARE_RADIO,
        onClick: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'normal.play.music_ease_in_out',
            value
          });
        }
      }, {
        identityKey: 'normal.play.remember_voice',
        onClick: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'normal.play.remember_voice',
            value
          });
        },
        label: '记住音量',
        type: types/* SETTING_ITEM_TYPE.SQUARE_RADIO */.X.SQUARE_RADIO
      }]
    }]
  }, {
    identityKey: types/* TAB_LIST_ITEM_KEY.DESKTOP_LYRIC */.Z.DESKTOP_LYRIC,
    label: '桌面歌词设置',
    items: [{
      identityKey: 'desktop_lyric.text_align',
      label: '对齐',
      contents: [{
        value: 'center',
        onClick: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.text_align',
            value
          });
        },
        identityKey: 'desktop_lyric.text_align',
        label: '居中对齐',
        type: types/* SETTING_ITEM_TYPE.CIRCLE_RADIO */.X.CIRCLE_RADIO
      }, {
        value: 'left',
        onClick: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.text_align',
            value
          });
        },
        identityKey: 'desktop_lyric.text_align',
        label: '左对齐',
        type: types/* SETTING_ITEM_TYPE.CIRCLE_RADIO */.X.CIRCLE_RADIO
      }, {
        value: 'right',
        onClick: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.text_align',
            value
          });
        },
        identityKey: 'desktop_lyric.text_align',
        label: '右对齐',
        type: types/* SETTING_ITEM_TYPE.CIRCLE_RADIO */.X.CIRCLE_RADIO
      }]
    }, {
      identityKey: 'font_family',
      label: '字体字号',
      contents: [{
        identityKey: 'desktop_lyric.font_family',
        onSelectChange: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.font_family',
            value
          });
        },
        type: types/* SETTING_ITEM_TYPE.SELECT */.X.SELECT,
        options: font
      }, {
        identityKey: 'desktop_lyric.font_size',
        type: types/* SETTING_ITEM_TYPE.SELECT */.X.SELECT,
        options: function () {
          const arr = [];

          for (let i = 18; i <= 60; i++) {
            arr.push({
              label: i,
              value: i
            });
          }

          return arr;
        }(),
        onSelectChange: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.font_size',
            value
          });
        }
      }]
    }, {
      identityKey: 'desktop_lyric.color',
      label: '颜色',
      contents: [{
        identityKey: 'desktop_lyric.color.theme',
        type: types/* SETTING_ITEM_TYPE.SELECT */.X.SELECT,
        onSelectChange: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.color.theme',
            value
          });
          const themeColor = THEME_COLORS[value];

          if (themeColor) {
            common_event/* default.emit */.Z.emit('app_setting_change', {
              key: 'desktop_lyric.color.played_text_color',
              value: themeColor[0]
            });
            common_event/* default.emit */.Z.emit('app_setting_change', {
              key: 'desktop_lyric.color.displayed_text_color',
              value: themeColor[1]
            });
          }
        },
        options: [{
          label: '清新绿',
          value: 'light green'
        }, {
          label: '可爱粉',
          value: 'cute pink'
        }, {
          label: '深邃蓝',
          value: 'deep blue'
        }, {
          label: '高雅灰',
          value: 'gentle gray'
        }, {
          label: '活力黄',
          value: 'light yellow'
        }, {
          label: '自定义',
          value: 'customized'
        }]
      }, {
        identityKey: 'desktop_lyric.color.played_text_color',
        type: types/* SETTING_ITEM_TYPE.COLOR_PICK */.X.COLOR_PICK,
        label: '已播放字色',
        onColorChange: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.color.played_text_color',
            value
          });
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.color.theme',
            value: 'customized'
          });
        }
      }, {
        identityKey: 'desktop_lyric.color.displayed_text_color',
        type: types/* SETTING_ITEM_TYPE.COLOR_PICK */.X.COLOR_PICK,
        label: '未播放字色',
        onColorChange: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.color.displayed_text_color',
            value
          });
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.color.theme',
            value: 'customized'
          });
        }
      }]
    }, {
      identityKey: 'desktop_lyric.font_style',
      label: '文字样式',
      contents: [{
        identityKey: 'desktop_lyric.font_style.border',
        label: '边框',
        type: types/* SETTING_ITEM_TYPE.SQUARE_RADIO */.X.SQUARE_RADIO,
        onClick: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.font_style.border',
            value
          });
        }
      }, {
        identityKey: 'desktop_lyric.font_style.text_shadow_color',
        label: '边框色',
        type: types/* SETTING_ITEM_TYPE.COLOR_PICK */.X.COLOR_PICK,
        onColorChange: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.font_style.text_shadow_color',
            value
          });
        }
      }, {
        identityKey: 'desktop_lyric.font_style.bolder',
        label: '粗体',
        type: types/* SETTING_ITEM_TYPE.SQUARE_RADIO */.X.SQUARE_RADIO,
        onClick: value => {
          common_event/* default.emit */.Z.emit('app_setting_change', {
            key: 'desktop_lyric.font_style.bolder',
            value
          });
        }
      }]
    }, {
      identityKey: 'desktop_lyric.preview',
      label: '效果预览',
      contents: [{
        DIY: true,
        component: lyric_preview
      }]
    }]
  }];
};
const getSystemFonts = async () => {
  const systemFontList = (await fontList.getFonts()) || [];

  if (systemFontList.length > 0) {
    return systemFontList.map(item => {
      let value = item;

      if (item.indexOf('"') === 0) {
        value = item.replace(/^"|"$/g, '');
      }

      return {
        label: value,
        value
      };
    });
  }

  return [];
};

//# sourceURL=webpack://qqmusic/./src/pages/setting/constants/index.ts_+_1_modules?