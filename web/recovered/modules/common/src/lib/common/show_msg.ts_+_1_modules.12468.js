
// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ show_msg)
});

// EXTERNAL MODULE: ./src/lib/common/dialog.tsx
var dialog = __webpack_require__(7273);
// EXTERNAL MODULE: ./src/lib/common/cookie.ts
var cookie = __webpack_require__(10045);
// EXTERNAL MODULE: ./src/lib/common/utils.ts
var utils = __webpack_require__(31603);
// EXTERNAL MODULE: ./src/lib/network/index.ts + 1 modules
var network = __webpack_require__(32590);
// EXTERNAL MODULE: ./src/lib/common/popup.tsx
var popup = __webpack_require__(43053);
// EXTERNAL MODULE: ./src/lib/common/service/commands/show_common_dlg.ts
var show_common_dlg = __webpack_require__(36702);
// EXTERNAL MODULE: ./src/lib/common/login.ts
var login = __webpack_require__(68010);
// EXTERNAL MODULE: ./src/lib/common/user.ts
var user = __webpack_require__(49399);
;// CONCATENATED MODULE: ./src/lib/network/singer_api.ts
// 添加歌曲到某个歌单
const focusOnSinger = param => ({
  module: 'Concern.ConcernSystemServer',
  method: 'cgi_concern_user_v2',
  param
});
;// CONCATENATED MODULE: ./src/lib/common/show_msg.ts
/* eslint-disable */

/**
 * 根据歌曲数据 展示受阻消息
 * @method showMsg
 * @desc  消息提示逻辑:
    付费歌曲受阻提示用 alertid  能试听 提示用pc_p  不能试听  提示用pc_p_u   用弹框提示
    非付费歌曲 受阻提示用 msgid    用tips提示  自动消失那种
    如果歌曲能播放完整版 不弹提示

 * @param {object} song 单曲数据
 * @param {string} type 受阻类型  'play':播放受阻   'down':下载受阻
 * @example
    showMsg(musiclist[0],'play');
 */









const GET_MSG_URL = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_alert_info?ids=all&cid=486&rnd=';
const GET_PUBLISH_TIME_URL = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_action_ctrl';

class SongAuthorizeMsgUtil {
  static async getMsg(song, type) {
    const res = await (0,network/* fetch */.h)(`${GET_MSG_URL}${Math.random()}`);

    if (res && res.code === 0) {
      this.msgData = res.data;
      const {
        msgData,
        clientVersion
      } = this;
      let msg;

      const _id = (song === null || song === void 0 ? void 0 : song.alertid) || (song === null || song === void 0 ? void 0 : song.msgid);

      const _type = type || (song !== null && song !== void 0 && song.tryPlay && clientVersion >= 1170 ? 'pc_p' : 'pc_p_u');

      if (song !== null && song !== void 0 && song.alertid) {
        var _msg2, _song$pay, _song$pay2, _song$singer$, _song$album;

        if (!(msgData !== null && msgData !== void 0 && msgData.alertinfo) || !(msgData !== null && msgData !== void 0 && msgData.alertinfo[_id])) {
          return;
        }

        msg = { ...msgData.alertinfo[_id][_type]
        };
        msg.desc = (((_msg2 = msg) === null || _msg2 === void 0 ? void 0 : _msg2.desc) || '该歌曲暂不支持下载该品质！').replace(/%singername/g, song === null || song === void 0 ? void 0 : song.singer[0].name).replace(/%albumname/g, song === null || song === void 0 ? void 0 : song.albumname).replace(/%songname/g, song === null || song === void 0 ? void 0 : song.songname).replace(/%songprice/g, song === null || song === void 0 ? void 0 : (_song$pay = song.pay) === null || _song$pay === void 0 ? void 0 : _song$pay.paytrackprice).replace(/%albumprice/g, song === null || song === void 0 ? void 0 : (_song$pay2 = song.pay) === null || _song$pay2 === void 0 ? void 0 : _song$pay2.payalbumprice);
        msg.btn = (msg.btn || '').replace(/%singername/g, song === null || song === void 0 ? void 0 : (_song$singer$ = song.singer[0]) === null || _song$singer$ === void 0 ? void 0 : _song$singer$.name).replace(/%albumname/g, song === null || song === void 0 ? void 0 : song.albumname).replace(/%songname/g, song === null || song === void 0 ? void 0 : song.songname);
        msg.url = (msg.url || '').replace(/%songid/g, `${song === null || song === void 0 ? void 0 : song.id}`).replace(/%albumid/g, `${song === null || song === void 0 ? void 0 : (_song$album = song.album) === null || _song$album === void 0 ? void 0 : _song$album.id}`);
      } else if (song !== null && song !== void 0 && song.msgid) {
        msg = msgData.msginfo[_id];
      }

      this.msgData = msg;
    }
  }

  static async getSongPublicTime(song) {
    return await (0,network/* fetch */.h)(GET_PUBLISH_TIME_URL, {
      type: 'get',
      data: {
        songids: song === null || song === void 0 ? void 0 : song.id,
        songtypes: song === null || song === void 0 ? void 0 : song.type,
        cmd: 'get_time_public',
        cid: 483
      }
    });
  }

  static buyAction(msgData, song) {
    var _song$album2;

    if (msgData !== null && msgData !== void 0 && msgData.btn && msgData !== null && msgData !== void 0 && msgData.url) {
      if (/^http(s)?:\/\//.test(msgData.url)) {
        if (this.isWeiXin) {
          user/* default.buyVip */.Z.buyVip('buygreen', (msgData === null || msgData === void 0 ? void 0 : msgData.aid) + '$songid' + song.id);
          return;
        }

        utils/* default.jumpWithKey */.ZP.jumpWithKey(msgData.url + '?aid=' + (msgData === null || msgData === void 0 ? void 0 : msgData.aid) + '$songid' + song.id);
      } else if (/^pcqqmusic:\/\//.test(msgData.url)) {
        let cmd = msgData.url.match(/^pcqqmusic:\/\/(\w+)/);

        if (cmd && cmd[1]) {
          switch (cmd[1]) {
            case 'buygreen':
              user/* default.buyVip */.Z.buyVip('buygreen', (msgData === null || msgData === void 0 ? void 0 : msgData.aid) + '$id' + song.id);
              break;

            case 'buysupergreen':
              user/* default.buyVip */.Z.buyVip('buysupergreen', (msgData === null || msgData === void 0 ? void 0 : msgData.aid) + '$id' + song.id);
              break;

            case 'buy8yuan':
              user/* default.buyVip */.Z.buyVip('buy8yuan', (msgData === null || msgData === void 0 ? void 0 : msgData.aid) + '$songid' + song.id);
              break;

            case 'buy12yuan':
              user/* default.buyVip */.Z.buyVip('buy12yuan', (msgData === null || msgData === void 0 ? void 0 : msgData.aid) + '$songid' + song.id);
              break;

            case 'buydigitalalbum':
              let uin = login/* default.musicId */.Z.musicId;

              if (uin < 10001) {
                login/* default.loginMiniportal */.Z.loginMiniportal();
                return;
              }

              user/* default.buyDigitalAlbum */.Z.buyDigitalAlbum({
                title: '购买数字专辑',
                albumid: song === null || song === void 0 ? void 0 : (_song$album2 = song.album) === null || _song$album2 === void 0 ? void 0 : _song$album2.id,
                actid: 0,
                frompage: 'zwsharezuduan',
                aid: 'pczdgm'
              });
              break;
          }
        }
      }

      dialog/* dialog.show */.WZ.show({
        mode: 'common',
        title: 'QQ音乐',
        icon_type: 1,
        sub_title: '如果您已支付成功，请点击“确认支付”按钮。',
        button_info1: {
          highlight: 1,
          title: '确认支付',
          fn: () => {
            setTimeout(() => {
              window.location.reload();
            }, 200);
          }
        },
        button_info2: {
          highlight: 0,
          title: '取消',
          fn: () => {
            dialog/* dialog.hide */.WZ.hide();
          }
        }
      });
    }
  }

  static showMsg(song, type, showFunc, specialFunction) {
    if ((song === null || song === void 0 ? void 0 : song.alertid) <= 0 && (song === null || song === void 0 ? void 0 : song.msgid) <= 0) {
      return;
    }

    if (specialFunction) {
      this.getMsg(song, type).then(() => {
        specialFunction(this.msgData);
      });
    } else {
      this.getMsg(song, type).then(() => {
        if (!this.msgData) {
          return;
        }

        const {
          msgData
        } = this;

        if ((song === null || song === void 0 ? void 0 : song.alertid) > 0) {
          if (showFunc) {
            showFunc({
              type: 1,
              icon: 'icon_hint_warn',
              desc: msgData === null || msgData === void 0 ? void 0 : msgData.desc,
              strbtn: (msgData === null || msgData === void 0 ? void 0 : msgData.btn) || '关闭',
              btnfunc: () => {
                this.buyAction(msgData, song);
              }
            });
          } else {
            var _msgData$url;

            const cmd = msgData === null || msgData === void 0 ? void 0 : (_msgData$url = msgData.url) === null || _msgData$url === void 0 ? void 0 : _msgData$url.match(/^pcqqmusic:\/\/(\w+)/);

            if (cmd && cmd.length > 1 && cmd[1] == 'buydigitalalbum') {
              dialog/* dialog.show */.WZ.show({
                mode: 'rich',
                desc: msgData.desc,
                button_info1: {
                  highlight: 1,
                  title: msgData.btn || '关闭',
                  fn: () => {
                    dialog/* dialog.hide */.WZ.hide();
                    this.buyAction(msgData, song);
                  }
                },
                button_info2: {
                  highlight: 0,
                  title: '取消',
                  fn: () => {
                    dialog/* dialog.hide */.WZ.hide();
                  }
                }
              });
            } else {
              dialog/* dialog.show */.WZ.show({
                mode: 'common',
                title: 'QQ音乐',
                icon_type: 1,
                sub_title: msgData.desc || '您暂时无法听歌或则下载歌曲，如果有疑问请咨询客服',
                desc: ' ',
                //占位
                button_info1: {
                  highlight: 1,
                  title: msgData.btn || '关闭',
                  fn: () => {
                    dialog/* dialog.hide */.WZ.hide();
                    this.buyAction(msgData, song);
                  }
                },
                button_info2: {
                  highlight: 0,
                  title: '取消',
                  fn: () => {
                    dialog/* dialog.hide */.WZ.hide();
                  }
                }
              });
            }
          }
        } else if ((song === null || song === void 0 ? void 0 : song.prePublic) === '1') {
          // 处理预售的歌曲
          this.handlePrePublicSong(song);
        } else if (song !== null && song !== void 0 && song.msgid) {
          //弹出消息
          if (!!song.disabled && song !== null && song !== void 0 && song.vid) {
            (0,show_common_dlg/* showDisableFrame */.f6)(song);
          } else {
            popup/* default.show */.Z.show(1, msgData.desc, '', 2000);
          }
        }
      });
    }
  }

  static handlePrePublicSong(song) {
    this.getSongPublicTime(song).then(res => {
      if (res.code === 0) {
        let time = parseInt(res.data.get_time_public.time_public) * 1000,
            now = new Date(),
            publicTime = new Date(time),
            _msg = '歌曲还未发布呢，关注歌手后我们第一时间告诉你';

        if (time != 0) {
          // 不在一年的
          if (now.getFullYear() != publicTime.getFullYear()) {
            _msg = '歌曲将于' + publicTime.getFullYear() + '年' + (publicTime.getMonth() + 1) + '月' + publicTime.getDate() + '日' + getHourAndMinutes(publicTime) + '发布，关注歌手后第一时间告诉你';
          } else if (now.getMonth() != publicTime.getMonth() || now.getDate() != publicTime.getDate()) {
            _msg = '歌曲将于' + (publicTime.getMonth() + 1) + '月' + publicTime.getDate() + '日' + getHourAndMinutes(publicTime) + '发布，关注歌手后第一时间告诉你';
          } else {
            _msg = '歌曲将于今天' + getHourAndMinutes(publicTime) + '发布，关注歌手后第一时间告诉你';
          } // 大于一天
          // 不在一年的


          dialog/* dialog.show */.WZ.show({
            mode: 'common',
            title: 'QQ音乐',
            icon_type: 1,
            sub_title: _msg,
            button_info1: {
              highlight: 1,
              title: '关注',
              fn: () => {
                focusSinger(song.singer[0].mid);
                dialog/* dialog.hide */.WZ.hide();
              }
            },
            button_info2: {
              highlight: 0,
              title: '取消',
              fn: () => {
                dialog/* dialog.hide */.WZ.hide();
              }
            }
          });
        }

        dialog/* dialog.show */.WZ.show({
          mode: 'common',
          title: 'QQ音乐',
          icon_type: 1,
          sub_title: _msg,
          button_info1: {
            highlight: 1,
            title: '关注',
            fn: () => {
              var _song$track;

              focusSinger(((song === null || song === void 0 ? void 0 : song.singer) || (song === null || song === void 0 ? void 0 : (_song$track = song.track) === null || _song$track === void 0 ? void 0 : _song$track.singer))[0].mid);
              dialog/* dialog.hide */.WZ.hide();
            }
          },
          button_info2: {
            highlight: 0,
            title: '取消',
            fn: () => {
              dialog/* dialog.hide */.WZ.hide();
            }
          }
        });
      }
    });
  }

} // 时间转化


SongAuthorizeMsgUtil.msgData = void 0;
SongAuthorizeMsgUtil.clientVersion = parseInt(cookie/* default.get */.Z.get('qqmusic_version') || 0, 10) * 100 + parseInt(cookie/* default.get */.Z.get('qqmusic_miniversion') || 0, 10);
SongAuthorizeMsgUtil.isWeiXin = !!cookie/* default.get */.Z.get('wxopenid');

const getHourAndMinutes = time => {
  const hour = time.getHours();
  const minutes = time.getMinutes();

  const _hour = hour < 10 ? '0' + hour : hour;

  const _minutes = minutes < 10 ? '0' + minutes : minutes;

  return '' + _hour + ':' + _minutes;
}; // 关注歌手


const focusSinger = async mid => {
  const res = await (0,network/* ufetch */.D)({
    focusSinger: focusOnSinger({
      opertype: 0,
      source: 0,
      userinfo: {
        usertype: 1,
        userid: mid
      }
    })
  });

  if (res && res.focusSinger && res.focusSinger.code == 0 && res.focusSinger.data && res.focusSinger.data.code == 0) {
    popup/* default.show */.Z.show(0, '关注歌手成功', '', 2000);
  }
};

/* harmony default export */ const show_msg = (SongAuthorizeMsgUtil);

//# sourceURL=webpack://qqmusic/./src/lib/common/show_msg.ts_+_1_modules?