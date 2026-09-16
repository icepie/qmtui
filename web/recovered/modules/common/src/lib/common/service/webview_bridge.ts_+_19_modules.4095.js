
// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ webview_bridge)
});

// EXTERNAL MODULE: ./src/lib/common/utils.ts
var utils = __webpack_require__(31603);
;// CONCATENATED MODULE: ./src/lib/common/service/webiew_manager.ts


class WebviewManager {
  static getInstance() {
    if (!this._instance) {
      this._instance = new WebviewManager();
    }

    return this._instance;
  }

  constructor() {
    this.webviewMap = void 0;
    this.webviewMap = new Map();
  }

  register(key, webview) {
    webview.enableremotemodule = true;
    this.webviewMap.set(key, webview);
  }

  remove(key) {
    if (key && this.webviewMap.has(key)) {
      return this.webviewMap.delete(key);
    }

    return false;
  }

  clear() {
    let flag = true;

    for (const key in this.webviewMap) {
      flag = this.remove(key);
    }

    return flag;
  }

  forEach(func) {
    let idx = 0;

    for (const key in this.webviewMap) {
      func(this.webviewMap.get(key), idx);
      idx += 1;
    }
  }

  normalizeEventParams(data) {
    if (typeof data === 'object') {
      return {
        data: data
      };
    }

    return data;
  }

  dispatchWebviewEvent(event, data, needNormalize = true) {
    const normalizeParams = needNormalize ? this.normalizeEventParams(data) : data;
    const standardEventName = utils/* default.firstUpperCase */.ZP.firstUpperCase(event);
    const jsonParams = JSON.stringify(normalizeParams);
    this.webviewMap.forEach(webview => {
      if (webview && document.contains(webview)) {
        try {
          webview.executeJavaScript(`window.__clientInterForWeb${standardEventName}(${jsonParams})`);
        } catch (e) {
          console.log('error', e);
        }
      }
    });
  }

}

WebviewManager._instance = void 0;
/* harmony default export */ const webiew_manager = (WebviewManager);
;// CONCATENATED MODULE: ./src/lib/common/service/event_manager.ts
class EventHub {
  constructor(event) {
    this.eventName = void 0;
    this.eventMap = void 0;
    this.handlerId = void 0;
    this.eventName = event;
    this.eventMap = {};
    this.handlerId = 0;
  }

  addEventHandler(handler, context) {
    const curId = this.handlerId;
    this.handlerId++;
    this.eventMap[curId] = {
      id: curId,
      eventHandler: handler,
      context
    };
    return curId;
  }

  removeEventHandler(handlerId) {
    if (this.eventMap[handlerId]) {
      delete this.eventMap[handlerId];
    }
  }

  handleEvent(params, context) {
    for (const key in this.eventMap) {
      const _context = Object.assign({}, this.eventMap[key].context, context);

      this.eventMap[key].eventHandler(params, _context);
    }
  }

}

class EventManager {
  static getInstance() {
    if (!this._instance) {
      this._instance = new EventManager();
    }

    return this._instance;
  }

  constructor() {
    this.eventHubs = void 0;
    this.eventHubs = new Map();
  }

  addListener(event, callback) {
    let eventHub;

    if (!this.eventHubs.has(event)) {
      eventHub = new EventHub(event);
      this.eventHubs.set(event, eventHub);
    }

    eventHub.addEventHandler(callback);
  }

  isEventRegistered(event) {
    let isRegistered = true;

    if (!this.eventHubs.has(event)) {
      isRegistered = false;
    }

    return isRegistered;
  }

  sendToClient(webview, callbackName) {
    return params => {
      webview.executeJavaScript(`window.clientCallbackInterface('${callbackName}', '${JSON.stringify(params)}')`);
    };
  }

  handleIpcEvent(ev, webview) {
    const message = JSON.parse(decodeURIComponent(ev.args[0]));
    const {
      cmd = '',
      callback = undefined,
      params
    } = message;

    if (this.isEventRegistered(cmd)) {
      const context = {
        sendToClient: this.sendToClient(webview, callback),
        needCallback: !!callback
      };

      try {
        const eventHub = this.eventHubs.get(cmd);
        eventHub.handleEvent(params, context);
      } catch (err) {
        console.log(`execute event error ${err}`);
      }
    }
  }

}

EventManager._instance = void 0;
/* harmony default export */ const event_manager = (EventManager);
// EXTERNAL MODULE: ./src/hooks/assets.ts
var assets = __webpack_require__(67891);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/album_collect_state_change.ts

var TYPE;

(function (TYPE) {
  TYPE[TYPE["ALBUM"] = 1] = "ALBUM";
  TYPE[TYPE["AUDIO"] = 2] = "AUDIO";
})(TYPE || (TYPE = {}));

var STATE;

(function (STATE) {
  STATE[STATE["COLLECT"] = 1] = "COLLECT";
  STATE[STATE["DIS_COLLECT"] = 2] = "DIS_COLLECT";
})(STATE || (STATE = {}));

class AlbumOrAudioLikeStatusChange {
  constructor() {
    this.eventName = 'albumCollectStatusChange';
  }

  handler(params) {
    if ((params === null || params === void 0 ? void 0 : params.albumType) === TYPE.ALBUM) {
      (params === null || params === void 0 ? void 0 : params.id) && (params === null || params === void 0 ? void 0 : params.state) && (0,assets/* refreshFavAlbumList */.B3)([params.id], params.state === STATE.COLLECT);
    }
  }

}
// EXTERNAL MODULE: ./src/tool/bridge/index.ts
var bridge = __webpack_require__(53941);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/close_client_dialog.ts

class CloseClientDialog {
  constructor() {
    this.eventName = 'closeClientDialog';
  }

  handler() {
    (0,bridge/* emitIpcRenderMessage */.D)('window_message', 'close_focus_window');
  }

}
// EXTERNAL MODULE: external "electron"
var external_electron_ = __webpack_require__(58933);
// EXTERNAL MODULE: ./src/client/modules/players/index.ts + 2 modules
var players = __webpack_require__(35229);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/control_play_state.ts


class ControlPlayState {
  constructor() {
    this.eventName = 'controlPlayState';
  }

  handler(params) {
    const LogicalPlayer = players/* default.getInstance */.Z.getInstance();
    params.action === 'pause' ? external_electron_.ipcRenderer.send('player_pause') : '';
    params.action === 'pause' ? LogicalPlayer.pause() : LogicalPlayer.resume();
  }

}
;// CONCATENATED MODULE: ./src/lib/common/service/commands/copy_info.ts
class CopyInfo {
  constructor() {
    this.eventName = 'copyInfo';
  }

  handler(params) {
    document.addEventListener('copy', ev => {
      ev.clipboardData.setData('text/plain', params.info);
      ev.preventDefault(); // default behaviour is to copy any selected text
    });
    document.execCommand('copy');
  }

}
// EXTERNAL MODULE: ./src/lib/common/event.ts
var common_event = __webpack_require__(67224);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/login.ts

class Login {
  constructor() {
    this.eventName = 'login';
  }

  handler(params) {
    if (params.recode == '-6002') {
      common_event/* default.emit */.Z.emit('launchLogin');
    } else {
      console.warn('未知情况'); // console.log(params);
    }
  }

}
// EXTERNAL MODULE: ./src/client/index.tsx
var client = __webpack_require__(21209);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/open_url.ts

class OpenUrl {
  constructor() {
    this.eventName = 'openUrl';
  }

  handler(params) {
    client/* default.openUrl */.Z.openUrl(params);
  }

}
;// CONCATENATED MODULE: ./src/lib/common/service/commands/play_song.ts

class PlaySong {
  constructor() {
    this.eventName = 'playSong';
  }

  handler(params) {
    client/* default.playSong */.Z.playSong(params);
  }

}
// EXTERNAL MODULE: ./node_modules/stook/dist/stook.esm.js + 2 modules
var stook_esm = __webpack_require__(49068);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/query_like_state.ts

class QueryLikeState {
  constructor() {
    this.eventName = 'querySongsILikeState';
  }

  handler(params, context) {
    const likeSongs = (0,stook_esm/* getState */.y0)('FavoriteSingleSongs') || [];
    const likeSet = new Set();
    likeSongs.forEach(item => likeSet.add(`${item.songId}`));
    const ids = params.ids.split(',');
    const likes = new Array(ids.length);

    for (let i = 0; i < likes.length; i++) {
      likes[i] = likeSet.has(ids[i]);
    }

    context.sendToClient({
      code: 0,
      data: {
        state: likes
      }
    });
  }

}
// EXTERNAL MODULE: ./src/types/index.ts
var types = __webpack_require__(91713);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/query_play_status.ts


class QueryPlayStatus {
  constructor() {
    this.eventName = 'queryPlayStatus';
  }

  handler(_, context) {
    const player = players/* default.getInstance */.Z.getInstance();

    if (player.currentSong) {
      context.sendToClient({
        code: 0,
        data: {
          songId: player.currentSong.id,
          songType: player.currentSong.type,
          playStatus: Reflect.get(types/* PLAY_STATE_CHANGE */.kQ, player.state)
        }
      });
    }
  }

}
;// CONCATENATED MODULE: ./src/lib/common/service/commands/set_client_info.ts

class SetClientInfo {
  constructor() {
    this.eventName = 'setClientInfo';
  }

  handler(params) {
    (0,bridge/* emitIpcRenderMessage */.D)('window_message', 'set_current_window_size', {
      width: params.width,
      height: params.height
    });
  }

}
;// CONCATENATED MODULE: ./src/lib/common/service/commands/set_frame_info.ts

class SetFrameInfo {
  constructor() {
    this.eventName = 'setFrameInfo';
  }

  handler(params) {
    (0,bridge/* emitIpcRenderMessage */.D)('window_message', 'set_current_window_size', {
      width: params.width,
      height: params.height
    });
  }

}
;// CONCATENATED MODULE: ./src/lib/common/service/commands/set_full_screen.ts

class SetFullScreen {
  constructor() {
    this.eventName = 'setFullScreen';
  }

  handler(params) {
    (0,bridge/* emitIpcRenderMessage */.D)('window_message', 'set_full_screen', {
      isFull: (params === null || params === void 0 ? void 0 : params.isFull) === 1
    });
  }

}
// EXTERNAL MODULE: ./src/lib/common/service/commands/show_common_dlg.ts
var show_common_dlg = __webpack_require__(36702);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/song_like_status_change.ts

class SongLikeStatusChange {
  constructor() {
    this.eventName = 'songLikeStatusChange';
  }

  handler(params) {
    (0,assets/* switchLikeState */.Mb)({
      id: params.id,
      like: params.state === 0,
      songType: params.type
    }, false);
  }

}
// EXTERNAL MODULE: ./src/lib/common/history.ts
var common_history = __webpack_require__(1642);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/toggle_page.ts



const parseHashParams = hashUrl => {
  const obj = {};
  const index = hashUrl.indexOf('#');

  if (index > 0) {
    const questionIndex = hashUrl.indexOf('?', index);

    if (questionIndex > 0) {
      obj.path = hashUrl.substr(index + 1, questionIndex - index - 1);
      obj.query = hashUrl.substr(questionIndex + 1);
    } else {
      obj.path = hashUrl.substr(index + 1);
    }
  }

  return obj;
};

class TogglePage {
  constructor() {
    this.eventName = 'togglePage';
  }

  handler(params) {
    const res = parseHashParams(params.url);

    if (res.path == '/playlist_detail') {
      const tid = parseInt(utils/* default.getParam */.ZP.getParam('id', params.url));
      common_history/* default.push */.Z.push({
        pathname: `/playlist_detail/${tid}`
      });
    } else {
      common_history/* default.push */.Z.push({
        pathname: res.path,
        search: utils/* default.paramToUrl */.ZP.paramToUrl({
          url: encodeURIComponent(params.url)
        })
      });
    }
  }

}
// EXTERNAL MODULE: ./src/lib/common/service/commands/play_mv.ts
var play_mv = __webpack_require__(41923);
// EXTERNAL MODULE: ./src/lib/common/jump.ts
var jump = __webpack_require__(54128);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/navigate_local_play_list.ts

class NavigateLocalPlayList {
  constructor() {
    this.eventName = 'navigateLocalPlayList';
  }

  handler(params) {
    (0,jump/* default */.Z)(jump/* PAGE_TYPE.PLAYLIST */.G.PLAYLIST, {
      id: params.dirid
    });
  }

}
;// CONCATENATED MODULE: ./src/lib/common/service/commands/add_song_to_play_list.ts

class AddSongToPlayList {
  constructor() {
    this.eventName = 'addPlayList';
  }

  handler(params) {
    (0,assets/* addSongListToPlayList */.mP)(params);
  }

}
// EXTERNAL MODULE: ./src/lib/common/service/commands/recommend_radio.ts
var recommend_radio = __webpack_require__(4012);
;// CONCATENATED MODULE: ./src/lib/common/service/commands/index.ts



















const EventHandlers = [AlbumOrAudioLikeStatusChange, CloseClientDialog, ControlPlayState, CopyInfo, Login, OpenUrl, PlaySong, QueryLikeState, QueryPlayStatus, SetClientInfo, SetFullScreen, show_common_dlg/* ShowCommonDialog */.zk, SongLikeStatusChange, TogglePage, SetFrameInfo, play_mv/* PlayMv */.f, NavigateLocalPlayList, AddSongToPlayList, recommend_radio/* RadioEventHandler */.VP, recommend_radio/* RadioCmdHandler */.U7];

;// CONCATENATED MODULE: ./src/lib/common/service/webview_bridge.ts




class WebviewBridge {
  static getInstance() {
    if (!this._instance) {
      this._instance = new WebviewBridge();
    }

    return this._instance;
  }

  constructor() {
    this.webviewManager = void 0;
    this.eventManager = void 0;
    this.webviewManager = webiew_manager.getInstance();
    this.eventManager = event_manager.getInstance();
    EventHandlers.forEach(constructor => {
      this.registerHandler(Reflect.construct(constructor, []));
    });
  }

  dispatchEvent(eventName, data, needNormalize = true) {
    this.webviewManager.dispatchWebviewEvent(eventName, data, needNormalize);
  }

  addEventListener(eventName, callback) {
    this.eventManager.addListener(eventName, callback);
  }

  listen(webview, key) {
    webview.addEventListener('ipc-message', ev => {
      try {
        this.eventManager.handleIpcEvent(ev, webview);
      } catch (err) {
        console.log(`execute event error ${err}`);
      }
    });
    this.webviewManager.register(key, webview);
  }

  remove(key) {
    this.webviewManager.remove(key);
  }

  registerHandler(handler) {
    this.eventManager.addListener(handler.eventName, handler.handler.bind(handler));
  }

}

WebviewBridge._instance = void 0;
/* harmony default export */ const webview_bridge = (WebviewBridge);

//# sourceURL=webpack://qqmusic/./src/lib/common/service/webview_bridge.ts_+_19_modules?