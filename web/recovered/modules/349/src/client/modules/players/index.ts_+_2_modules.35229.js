// EXPORTS
// [QQMusic Assembler Verified]
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ Player)
});

// EXTERNAL MODULE: ./src/client/types/index.ts
var types = __webpack_require__(88943);
// EXTERNAL MODULE: ./src/lib/network/index.ts + 1 modules
var network = __webpack_require__(32590);
// EXTERNAL MODULE: ./src/lib/network/asset_api.ts
var asset_api = __webpack_require__(65972);
;// CONCATENATED MODULE: ./src/client/modules/players/CDNUtil.ts



class CDNUtil {
  // 歌曲media_id和他请求过的失败的cdn需要存储起来，存储形式采用cdn的索引，节省空间
  static getInstance() {
    if (!this._insance) {
      this._insance = new CDNUtil();
    }

    return this._insance;
  }

  constructor() {
    this.default = ['http://isure.stream.qqmusic.qq.com/', 'http://dl.stream.qqmusic.qq.com'];
    this.activeCdn = void 0;
    this.cdns = [];
    this.testFileWifi = void 0;
    this.raceFinishedCount = 0;
    this.firstRes = void 0;
    this.songBadCdnStore = void 0;
    this.isReady = void 0;

    this.load = event => {
      const audio = event.target;
      this.raceFinishedCount++;

      if (!this.activeCdn) {
        const isError = event.type != 'loadedmetadata';
        const isEnd = this.raceFinishedCount >= this.cdns.length;
        const cdn = audio.getAttribute('data-cdn');
        const index = audio.getAttribute('data-index');
        let res = {
          cdn,
          index
        };

        if (!this.firstRes) {
          this.firstRes = res;
        } else if (isError && isEnd) {
          res = this.firstRes;
        }

        if (!isError || isEnd) {
          this.activeCdn = res.cdn;

          if (parseInt(res.index, 10) > 0) {
            this.cdns.splice(parseInt(res.index, 10), 1);
            this.cdns.unshift(res.cdn);
          }
        }
      }

      audio && document.body.removeChild(audio);
    };

    this.isReady = false;
    this.songBadCdnStore = new Map();
  }

  async init() {
    const res = await (0,network/* ufetch */.D)({
      getCDNList: (0,asset_api/* getCDNList */.NS)()
    });

    if (res.code === 0 && res.getCDNList && res.getCDNList.data) {
      this.cdns = res.getCDNList.data.sip;
      this.testFileWifi = res.getCDNList.data.testfilewifi;
    } else {
      this.cdns = this.default;
    }

    this.race();
  }

  race() {
    if (this.activeCdn) {
      return this.activeCdn;
    }

    if (this.cdns.length === 1) {
      return this.cdns[0];
    }

    this.cdns.forEach((item, index) => {
      const audio = document.createElement('audio');
      audio.style.cssText = 'height:0;width:0;display:none';
      audio.setAttribute('data-index', String(index));
      audio.setAttribute('data-cdn', item);
      audio.addEventListener('abort', this.load);
      audio.addEventListener('error', this.load);
      audio.addEventListener('loadedmetadata', this.load);
      audio.src = item + this.testFileWifi;
      document.body.appendChild(audio);
      audio.load();
    });
  }

  get sortedCdnList() {
    return this.cdns;
  }

  getAvailableCdn(mid) {
    return mid.map(item => {
      let availableCdn;

      if (this.songBadCdnStore.has(item)) {
        const {
          errCount,
          badCdnIdxStore
        } = this.songBadCdnStore.get(item);

        if (badCdnIdxStore.size >= this.cdns.length) {
          badCdnIdxStore.clear();
          this.songBadCdnStore.set(item, {
            errCount,
            badCdnIdxStore
          });
          availableCdn = this.cdns[0];
        } else {
          availableCdn = this.cdns.filter((_, index) => !badCdnIdxStore.has(index))[0];
        }
      } else {
        availableCdn = this.cdns[0];
      }

      return availableCdn;
    });
  }

  checkIsAvailable(mid) {
    var _this$songBadCdnStore;

    return (((_this$songBadCdnStore = this.songBadCdnStore.get(mid)) === null || _this$songBadCdnStore === void 0 ? void 0 : _this$songBadCdnStore.errCount) || 0) >= this.cdns.length * 2;
  }

  addDisabledCdn(mid, fileUrl) {
    const disabledCdnIndex = this.cdns.findIndex(item => fileUrl.indexOf(item) !== -1);
    let set;
    let errCnt;

    if (this.songBadCdnStore.has(mid)) {
      const {
        errCount,
        badCdnIdxStore
      } = this.songBadCdnStore.get(mid);
      set = badCdnIdxStore;
      errCnt = errCount + 1;
    } else {
      set = new Set();
      errCnt = 1;
    }

    set.add(disabledCdnIndex);
    this.songBadCdnStore.set(mid, {
      errCount: errCnt,
      badCdnIdxStore: set
    });
  }

}

CDNUtil._insance = void 0;
/* harmony default export */ const players_CDNUtil = (CDNUtil);
// EXTERNAL MODULE: ./src/main_process/util/setting.ts + 1 modules
var setting = __webpack_require__(62384);
// EXTERNAL MODULE: ./node_modules/tone/build/esm/index.js + 419 modules
var esm = __webpack_require__(71795);
// EXTERNAL MODULE: ./src/client/modules/tools/index.ts
var tools = __webpack_require__(32698);
// EXTERNAL MODULE: ./node_modules/nedb/index.js
var nedb = __webpack_require__(55072);
var nedb_default = /*#__PURE__*/__webpack_require__.n(nedb);
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(85622);
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);
;// CONCATENATED MODULE: ./src/client/modules/local_database/index.ts



class LocalDatabaseManager {
  static updateLocalData(type, data) {
    const {
      db
    } = this;
    db.findOne({
      type
    }, (err, doc) => {
      if (!err && doc) {
        db.update({
          type
        }, {
          $set: { ...data
          }
        });
      } else {
        db.insert({
          type,
          ...data
        });
      }
    });
  }

  static getLocalData(type, cb) {
    const {
      db
    } = this;
    db.findOne({
      type
    }, (err, doc) => {
      if (!err && doc) {
        cb && cb(doc);
      }
    });
  }

}

LocalDatabaseManager.db = new (nedb_default())({
  filename: external_path_default().join(__dirname, 'music_playlist.db'),
  autoload: true
});
/* harmony default export */ const local_database = (LocalDatabaseManager);
// EXTERNAL MODULE: ./src/lib/common/popup.tsx
var popup = __webpack_require__(43053);
// EXTERNAL MODULE: ./src/lib/common/service/dispatch/index.ts
var dispatch = __webpack_require__(24684);
// EXTERNAL MODULE: ./src/types/index.ts
var src_types = __webpack_require__(91713);
// EXTERNAL MODULE: ./src/lib/common/utils.ts
var utils = __webpack_require__(31603);
// EXTERNAL MODULE: ./node_modules/@tencent/qmfe-ts-core/lib/index.js + 10 modules
var lib = __webpack_require__(30366);
// EXTERNAL MODULE: external "electron"
var external_electron_ = __webpack_require__(58933);
// EXTERNAL MODULE: ./src/lib/common/login.ts
var login = __webpack_require__(68010);
;// CONCATENATED MODULE: ./src/client/modules/players/index.ts















const isSameSong = (a, b) => {
  if (!a || !b) return false;
  if (a === b) return true;
  const aPath = a.localFilePath || (a.track && a.track.localFilePath);
  const bPath = b.localFilePath || (b.track && b.track.localFilePath);
  if (aPath && bPath && aPath === bPath) return true;
  const aHref = a.webDavHref || (a.track && a.track.webDavHref);
  const bHref = b.webDavHref || (b.track && b.track.webDavHref);
  if (aHref && bHref && aHref === bHref) return true;
  if (a.url && b.url && a.url === b.url) return true;
  const aId = (a.id !== undefined && a.id !== null) ? String(a.id) : (a.track && a.track.id !== undefined && a.track.id !== null ? String(a.track.id) : null);
  const bId = (b.id !== undefined && b.id !== null) ? String(b.id) : (b.track && b.track.id !== undefined && b.track.id !== null ? String(b.track.id) : null);
  if (aId && bId && aId === bId && aId !== '0') return true;
  const aMid = a.mid || (a.track && a.track.mid);
  const bMid = b.mid || (b.track && b.track.mid);
  if (aMid && bMid && aMid === bMid) return true;
  return false;
};

class Player {
  // songlist代表传入播放器的歌单列表，playlist是对songlist做了洗牌等操作的列表，两者会有区别，但是都要存下来
  constructor() {
    this.audio = void 0;
    this.currentSong = void 0;
    this.eventHandler = void 0;
    this.index = void 0;
    this.mode = types/* PLAY_MODE.LIST_CYCLE */.kV.LIST_CYCLE;
    this.playerMode = types/* PLAYER_MODE.NORMAL */.Ih.NORMAL;
    this.songList = void 0;
    this.playList = void 0;
    this.resourceCacheMap = void 0;
    this.state = void 0;
    this.timeStamp = void 0;
    this.cdnUtil = void 0;
    this._onPlayStatusChange = new lib/* Emitter */.Q5();
    this.onPlayStatusChange = this._onPlayStatusChange.event;
    this._onPlayIdxWillStep = new lib/* Emitter */.Q5();
    this.onPlayIdxWillStep = this._onPlayIdxWillStep.event;
    this.allowPlayIdxStep = true;

    this.isReady = () => this.state !== types/* PLAY_STATE.NOT_READY */.tJ.NOT_READY;

    this.state = types/* PLAY_STATE.NOT_READY */.tJ.NOT_READY;
    this.resourceCacheMap = new Map();
    this.cdnUtil = players_CDNUtil.getInstance();
    this.eventHandler = new Map();
    this.savedSeekTime = 0;
    this.savedSeekSong = null;
    this.isResumeIntent = false;
    this.index = 0;
    this.getLocalPlayerData();
    this.bindMediaSessionEvent();
  }

  setCurrentTime(val) {
    if (this.audio) {
      this.audio.currentTime = val;
    }
    this.savePlaybackState({ currentTime: val });
    try {
      const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                  (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer);
      if (ipc) ipc.send('mpris_update_position', { position: val, seeked: true });
    } catch (e) {}
  }

  setVolume(value) {
    if (this.audio) {
      this.audio.volume = value;
    }
    this.savedVolume = value;
    this.savePlaybackState({ volume: value });
  }

  static getInstance() {
    return this._instance;
  }
  /**
   * 创建mediaElement，这里暂时采用如下方案
   * <audio>实现播放与解析，audioContext.createMediaElementSource创建source分发音频信息与增加控制节点
   * 这样即可双向控制，并且保持对外部的信息分发
   * 后续考虑采用
   */


  async initAudio() {
    if (this.audio) {
      return {
        song: this.currentSong,
        songList: this.songList
      };
    }
    const audio = document.createElement('audio');
    audio.style.cssText = 'height:0;width:0;display:none';
    // audio.crossOrigin removed to avoid CORS media errors
    if (this.savedVolume !== undefined && this.savedVolume !== null) {
      audio.volume = this.savedVolume;
    } else {
      audio.volume = setting/* default.settingInitialValue.volume */.ZP.settingInitialValue.volume / 100;
    }
    audio.setAttribute('autoplay', '');
    audio.addEventListener('canplay', () => {
      this.setState(types/* PLAY_STATE.READY */.tJ.READY, {
        song: this.currentSong,
        songList: this.songList
      });
    });
    audio.addEventListener('playing', () => {
      this.setState(types/* PLAY_STATE.PLAYING */.tJ.PLAYING, {
        song: this.currentSong,
        songList: this.songList
      });
      (0,dispatch/* playStatusChange */.RP)(this.currentSong, src_types/* PLAY_STATE_CHANGE */.kQ[types/* PLAY_STATE.PLAYING */.tJ.PLAYING]);
      external_electron_.ipcRenderer.send('player_play', {
        song: this.currentSong,
        playStatus: src_types/* PLAY_STATE_CHANGE */.kQ[types/* PLAY_STATE.PLAYING */.tJ.PLAYING]
      });
      try {
        const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                    (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer);
        if (ipc) ipc.send('mpris_update_playback', { status: 'Playing' });
      } catch (e) {}
      this.setMediaSession();
    });
    audio.addEventListener('pause', () => {
      this.setState(types/* PLAY_STATE.PAUSED */.tJ.PAUSED, {
        song: this.currentSong
      });
      this.savePlaybackState({ currentTime: audio.currentTime });
      (0,dispatch/* playStatusChange */.RP)(this.currentSong, src_types/* PLAY_STATE_CHANGE */.kQ[types/* PLAY_STATE.PAUSED */.tJ.PAUSED]);
      try {
        const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                    (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer);
        if (ipc) ipc.send('mpris_update_playback', { status: 'Paused' });
      } catch (e) {}
      try {
        if (typeof navigator !== 'undefined' && navigator.mediaSession) {
          navigator.mediaSession.playbackState = 'paused';
        }
      } catch (e) {}
    });
    audio.addEventListener('ended', () => {
      this.setState(types/* PLAY_STATE.ENDED */.tJ.ENDED);
      this.playNext(true);
      (0,dispatch/* playStatusChange */.RP)(this.currentSong, src_types/* PLAY_STATE_CHANGE */.kQ[types/* PLAY_STATE.ENDED */.tJ.ENDED]);
    });
    audio.addEventListener('durationchange', () => {
      try {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
          const curSong = this.currentSong;
          if (curSong && (!curSong.interval || curSong.interval <= 0)) {
            curSong.interval = Math.round(audio.duration);
          }
          this.trigger(types/* PLAY_STATE.TIME_UPDATE */.tJ.TIME_UPDATE, {
            timeStamp: audio.currentTime,
            duration: audio.duration,
            buffered: 0,
            song: this.currentSong
          });
        }
      } catch (_) {}
    });
    audio.addEventListener('timeupdate', ev => {
      const timeRanges = ev.srcElement.buffered;
      const len = timeRanges.length - 1 >= 0 ? timeRanges.length - 1 : 0;

      try {
        this.trigger(types/* PLAY_STATE.TIME_UPDATE */.tJ.TIME_UPDATE, {
          timeStamp: ev.currentTarget.currentTime,
          duration: ev.currentTarget.duration,
          buffered: timeRanges.end(len),
          song: this.currentSong
        });
      } catch {}
      try {
        const now = Date.now();
        if (!this._lastMprisPosTime || now - this._lastMprisPosTime > 1500) {
          this._lastMprisPosTime = now;
          const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                      (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer);
          if (ipc && ev.currentTarget) {
            ipc.send('mpris_update_position', { position: ev.currentTarget.currentTime || 0, seeked: false });
          }
        }
      } catch (e) {}
      try {
        if (typeof navigator !== 'undefined' && navigator.mediaSession && navigator.mediaSession.setPositionState && ev.currentTarget.duration) {
          navigator.mediaSession.setPositionState({
            duration: ev.currentTarget.duration || 0,
            playbackRate: ev.currentTarget.playbackRate || 1,
            position: ev.currentTarget.currentTime || 0
          });
        }
      } catch (e) {}
      try {
        const curSong = this.currentSong;
        if (curSong && curSong.isWebDav && curSong.webDavHref && curSong.webDavServerId) {
          const currentTime = (ev.currentTarget && ev.currentTarget.currentTime) || 0;
          if (this._lastWebDavSongId !== curSong.id) {
            this._lastWebDavSongId = curSong.id;
            this._webdavReported = false;
          }
          if (!this._webdavReported && currentTime >= 30) {
            this._webdavReported = true;
            const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                        (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer);
            if (ipc) {
              ipc.invoke('webdav-report-playback', {
                serverId: curSong.webDavServerId,
                href: curSong.webDavHref,
                duration: currentTime
              }).catch(() => {});
            }
          }
        }
      } catch (e) {}
    });
    audio.addEventListener('error', () => {
      if (this.audio.src && this.cdnUtil.sortedCdnList) {
        var _this$currentSong;

        if (this.cdnUtil.checkIsAvailable((_this$currentSong = this.currentSong) === null || _this$currentSong === void 0 ? void 0 : _this$currentSong.mid)) {
          var _this$currentSong2;

          this.cdnUtil.addDisabledCdn((_this$currentSong2 = this.currentSong) === null || _this$currentSong2 === void 0 ? void 0 : _this$currentSong2.mid, this.audio.src);
          this.play({
            index: this.index
          });
        } else {
          popup/* default.show */.Z.show(0, '播放失败');
          this.playNext();
        }
      }

      this.playNext(false, 0);
    });
    this.audio = audio;
    document.body.appendChild(this.audio);
    this.ensureAudioDownmix(this.audio);
    await this.cdnUtil.init();
    return {
      song: this.currentSong,
      songList: this.songList
    };
  }

  ensureAudioDownmix(audioElement) {
    if (typeof window === "undefined" || !audioElement || this._downmixInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      this._audioCtx = ctx;

      const resumeCtx = () => {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      };
      ['click', 'keydown', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, resumeCtx, { once: true });
      });

      const sourceNode = ctx.createMediaElementSource(audioElement);
      ctx.destination.channelCount = 2;
      ctx.destination.channelCountMode = 'explicit';
      ctx.destination.channelInterpretation = 'speakers';

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-1.0, ctx.currentTime);
      compressor.knee.setValueAtTime(30, ctx.currentTime);
      compressor.ratio.setValueAtTime(12, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);

      sourceNode.connect(compressor);
      compressor.connect(ctx.destination);
      this._downmixInitialized = true;
    } catch (e) {}
  }

  pause() {
    var _this$audio;

    (_this$audio = this.audio) === null || _this$audio === void 0 ? void 0 : _this$audio.pause();
  }

  async play(params, config = {
    showDisableDialog: true,
    up: true,
    noAutoSkip: false
  }) {
    let song = (params && params.song) ? params.song : ((params && params.index !== undefined && this.playList) ? this.playList[params.index] : undefined);
    if (!song && this.currentSong) {
      song = this.currentSong;
    }
    const isLocalSong = !!(song && (song.isLocal || song.isWebDav || song.localFilePath || (song.url && (song.url.indexOf('file:') === 0 || song.url.indexOf('http://127.0.0.1:') === 0))));
    if (!isLocalSong && !login/* default.isLogin */.Z.isLogin()) {
      popup/* default.show */.Z.show(0, '请先登录！');
      login/* default.loginMiniportal */.Z.loginMiniportal();
      return;
    } // 是否准备完毕


    const {
      showDisableDialog,
      up,
      noAutoSkip
    } = config;

    if (!this.audio) {
      await this.initAudio();
    }

    const foundIdx = this.playList ? this.playList.findIndex(item => isSameSong(item, song)) : -1;
    if (foundIdx !== -1) {
      this.index = foundIdx;
    } else if (params && typeof params.index === 'number') {
      this.index = params.index;
    } // 是否是相同的正在播放的歌曲以及检查是否能播放
    // if (this.sameSongOnPlaying(song?.id)) {
    //     return;
    // }

    if (!(0,tools/* isSongAvailable */.nn)(song, showDisableDialog)) {
      return;
    }

    this.currentSong = song;
    try {
      if (song && (song.id || song.mid)) {
        const _KEY = '__qqmusic_recent_play__';
        let _list = [];
        try { _list = JSON.parse(localStorage.getItem(_KEY) || '[]'); } catch(e) {}
        _list = _list.filter(item => item && (item.id !== song.id || item.mid !== song.mid));
        _list.unshift(song);
        if (_list.length > 300) _list = _list.slice(0, 300);
        localStorage.setItem(_KEY, JSON.stringify(_list));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('qqmusic_recent_update'));
        }
      }
    } catch(e) {}

    let seekAfterCanPlay = 0;
    if (this.isResumeIntent && this.savedSeekSong && isSameSong(song, this.savedSeekSong) && this.savedSeekTime > 0) {
      seekAfterCanPlay = this.savedSeekTime;
    }
    this.isResumeIntent = false;
    this.savedSeekTime = 0;
    this.savedSeekSong = null;
    if (seekAfterCanPlay > 0) {
      const onSeekCanPlay = () => {
        this.audio.removeEventListener('canplay', onSeekCanPlay);
        try {
          this.audio.currentTime = seekAfterCanPlay;
        } catch (_) {}
      };
      this.audio.addEventListener('canplay', onSeekCanPlay);
    } else {
      this.audio.currentTime = 0;
    }
    this.savePlaybackState({
      currentSong: song,
      index: this.index,
      songList: this.songList,
      playList: this.playList,
      currentTime: seekAfterCanPlay > 0 ? seekAfterCanPlay : 0
    });
    if (song && (song.isLocal || song.isWebDav || song.localFilePath || (song.url && (song.url.indexOf('file:') === 0 || song.url.indexOf('blob:') === 0 || song.url.indexOf('http://127.0.0.1:') === 0)))) {
      const localUrl = song.url || ('file://' + encodeURI(song.localFilePath));
      this.audio.src = localUrl;
      this.audio.load();
      try {
        const p = this.audio.play();
        if (p && p.catch) { p.catch(e => console.error('[LocalPlay] error:', e)); }
      } catch(e) { console.error('[LocalPlay] sync error:', e); }

      // 1. 本地与 WebDAV 音质与实际码率计算
      const computeLocalMetrics = (curSong) => {
        try {
          if (!curSong) return;
          const rawHref = curSong.webDavHref || curSong.localFilePath || curSong.url || '';
          const cleanPath = rawHref.split('?')[0];
          const ext = cleanPath.split('.').pop().toLowerCase();
          const isLossless = ['flac', 'wav', 'ape', 'dts', 'dsd', 'dsf', 'dff'].includes(ext);
          const f = curSong.file || (curSong.track && curSong.track.file) || {};
          const isHires = Boolean(
            curSong.isHires ||
            (Number(f.size_hires) > 0) ||
            (Number(f.size_96flac) > 0) ||
            (Number(f.size_24bit) > 0) ||
            (Number(f.hires_bitdepth) > 16) ||
            (Number(f.hires_sample) > 48000) ||
            (Number(curSong.bitDepth) > 16) ||
            (Number(curSong.sampleRate) > 48000)
          );

          const duration = curSong.interval || (this.audio && this.audio.duration) || 0;
          const fileSize = curSong.contentLength || curSong.fileSize || Number(f.size) || 0;
          let calculatedKbps = 0;
          if (fileSize > 0 && duration > 0) {
            calculatedKbps = Math.round((fileSize * 8) / (duration * 1000));
          }

          let qName = '标准';
          let bitrateStr = '128kbps';
          if (isHires) {
            qName = 'Hi-Res';
            bitrateStr = calculatedKbps > 0 ? `${calculatedKbps}kbps` : '24bit/96kHz';
          } else if (isLossless) {
            qName = 'SQ';
            bitrateStr = calculatedKbps > 0 ? `${calculatedKbps}kbps` : '16bit/44.1kHz';
          } else if (calculatedKbps >= 280 || (rawHref.toLowerCase().includes('320k'))) {
            qName = 'HQ';
            bitrateStr = calculatedKbps > 0 ? `${calculatedKbps}kbps` : '320kbps';
          } else {
            qName = '标准';
            bitrateStr = calculatedKbps > 0 ? `${calculatedKbps}kbps` : '128kbps';
          }

          const targetMid = (curSong.track && curSong.track.mid) || curSong.mid || (curSong.id ? String(curSong.id) : '');
          const metrics = {
            codec: isLossless ? ext.toUpperCase() : 'MP3',
            bitrate: calculatedKbps,
            bitrateStr,
            quality: qName,
            song: curSong,
            songMid: targetMid,
            hasHires: qName === 'Hi-Res',
            hasSQ: qName === 'SQ' || qName === 'Hi-Res',
            hasHQ: qName === 'HQ' || qName === 'SQ' || qName === 'Hi-Res',
            hasStandard: true,
            isLocalOrWebDav: true
          };

          if (typeof window !== 'undefined') {
            window.__CURRENT_AUDIO_METRICS__ = metrics;
            window.__CURRENT_PLAYING_QUALITY__ = qName;
            window.dispatchEvent && window.dispatchEvent(new CustomEvent('qqmusic_metrics_update', { detail: metrics }));
            window.dispatchEvent && window.dispatchEvent(new CustomEvent('qqmusic_quality_change', { detail: qName }));
          }
        } catch (_) {}
      };

      computeLocalMetrics(song);

      if (this.audio) {
        const onMeta = () => {
          this.audio.removeEventListener('loadedmetadata', onMeta);
          computeLocalMetrics(this.currentSong || song);
        };
        this.audio.addEventListener('loadedmetadata', onMeta);
      }

      // 2. 针对 WebDAV 曲目，点播时即时读取完整头部提取封面与歌词，热更新当前歌曲
      if (song.isWebDav && song.webDavHref && song.webDavServerId) {
        const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                    (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer);
        if (ipc && ipc.invoke) {
          ipc.invoke('webdav-enrich-song', {
            serverId: song.webDavServerId,
            href: song.webDavHref
          }).then(enriched => {
            if (enriched && this.currentSong && (this.currentSong.webDavHref === song.webDavHref || this.currentSong.id === song.id)) {
              if (enriched.title) {
                this.currentSong.title = enriched.title;
                this.currentSong.name = enriched.title;
              }
              if (enriched.singer) this.currentSong.singer = enriched.singer;
              if (enriched.album) this.currentSong.album = enriched.album;
              if (enriched.interval > 0) this.currentSong.interval = enriched.interval;
              const coverPic = enriched.pictureUrl || enriched.pic || enriched.picurl || (enriched.album && (enriched.album.pic || enriched.album.picurl));
              if (coverPic) {
                this.currentSong.pic = coverPic;
                this.currentSong.picurl = coverPic;
                if (!this.currentSong.album) {
                  this.currentSong.album = { id: 0, mid: '', name: 'WebDAV 云音乐', title: 'WebDAV 云音乐' };
                }
                this.currentSong.album.pic = coverPic;
                this.currentSong.album.picurl = coverPic;
              }
              if (enriched.lyrics) this.currentSong.lyrics = enriched.lyrics;

              // 重新计算并刷新音质指标
              computeLocalMetrics(this.currentSong);

              this.trigger(types/* PLAY_STATE.PLAYING */.tJ.PLAYING, {
                song: this.currentSong,
                songList: this.songList
              });
              this.setState(types/* PLAY_STATE.PLAYING */.tJ.PLAYING, {
                song: this.currentSong,
                songList: this.songList
              });
              (0,dispatch/* playStatusChange */.RP)(this.currentSong, src_types/* PLAY_STATE_CHANGE */.kQ[types/* PLAY_STATE.PLAYING */.tJ.PLAYING]);
              if (external_electron_ && external_electron_.ipcRenderer) {
                external_electron_.ipcRenderer.send('player_play', {
                  song: this.currentSong,
                  playStatus: src_types/* PLAY_STATE_CHANGE */.kQ[types/* PLAY_STATE.PLAYING */.tJ.PLAYING]
                });
              }
              this.setMediaSession();
            }
          }).catch(() => {});
        }
      }
      return;
    }
    const [response] = await this.generateVKey([song]);

    if (response.code === 1000) {
      console.log('无cookies，不执行切歌操作');
      return;
    }

    if (response.url) {
      this.audio.src = response.url;
      this.audio.load();
    } else if (noAutoSkip) {
      // noAutoSkip 场景（如恢复播放）：URL 获取失败时不自动跳曲，只提示
      popup/* default.show */.Z.show(1, '歌曲资源获取失败，请重试');
    } else if (this.songList.length > 1) {
      popup/* default.show */.Z.show(1, '歌曲暂无资源，已自动为您切换下一首');

      if (up) {
        this.playNext();
      } else {
        this.playPrev();
      }
    } else {
      popup/* default.show */.Z.show(1, '歌曲暂无资源');
    }
  }
  /**
   * 播放全部，随机播放模式需要将列表洗牌，并将当前项放置为播放列表的第一项
   * @param params
   */


  playAll(params) {
    this.isResumeIntent = false;
    this.savedSeekTime = 0;
    this.savedSeekSong = null;
    const {
      songList,
      index = 0,
      playerMode = types/* PLAYER_MODE.NORMAL */.Ih.NORMAL
    } = params;
    this.songList = songList;
    this.index = index;
    this.playerMode = playerMode;

    if (playerMode === types/* PLAYER_MODE.RADIO */.Ih.RADIO && this.mode !== types/* PLAY_MODE.SEQUENTIAL */.kV.SEQUENTIAL && this.mode !== types/* PLAY_MODE.SINGLE_CYCLE */.kV.SINGLE_CYCLE) {
      this.setMode(types/* PLAY_MODE.SEQUENTIAL */.kV.SEQUENTIAL);
    }

    let songToPlay;

    switch (this.mode) {
      case types/* PLAY_MODE.RANDOM */.kV.RANDOM:
        this.playList = (0,tools/* shuffle */.TV)(songList, this.index);
        this.index = 0;
        songToPlay = this.playList[0];
        break;

      default:
        this.playList = this.songList;
        songToPlay = this.playList[this.index];
        break;
    }

    this.savePlayList();
    return this.play({
      song: songToPlay
    });
  }

  async playNext(auto = false, badSongNumber = 0) {
    if (!login/* default.isLogin */.Z.isLogin() && !(this.currentSong && (this.currentSong.isLocal || this.currentSong.isWebDav || this.currentSong.localFilePath))) {
      return;
    }

    if (auto) {
      const {
        index,
        mode
      } = this;

      if (mode === types/* PLAY_MODE.SINGLE_CYCLE */.kV.SINGLE_CYCLE) {
        this.play({
          index
        });
        return;
      }
    }

    if (badSongNumber >= this.playList.length) {
      // 播放列表所有的歌都不能播放，直接return
      return;
    }

    const prevIdx = this.index;
    const {
      index,
      playList,
      mode
    } = this;

    if (playList.length !== 0) {
      switch (mode) {
        case types/* PLAY_MODE.SEQUENTIAL */.kV.SEQUENTIAL:
          this.index = index < playList.length - 1 ? index + 1 : index;
          break;

        default:
          {
            this.index = index < playList.length - 1 ? index + 1 : 0;
            break;
          }
      }
    }

    if (!(0,tools/* isSongAvailable */.nn)(this.playList[this.index], false)) {
      this.playNext(true, badSongNumber + 1);
    } else {
      const _ev = lib/* Event.toPromise */.ju.toPromise(this._onPlayIdxWillStep.event);

      this._onPlayIdxWillStep.fire({
        length: this.playList.length,
        prevIdx,
        step: 1,
        playerMode: this.playerMode
      });

      await _ev;

      if (!this.allowPlayIdxStep) {
        this.index = prevIdx;
        return;
      }

      this.play({
        index: this.index
      }, {
        showDisableDialog: false,
        up: true
      });
      return;
    }
  }

  async playPrev(badSongNumber = 0) {
    if (!login/* default.isLogin */.Z.isLogin() && !(this.currentSong && (this.currentSong.isLocal || this.currentSong.isWebDav || this.currentSong.localFilePath))) {
      return;
    }

    if (badSongNumber >= this.playList.length) {
      // 播放列表所有的歌都不能播放，直接return
      return;
    }

    const {
      index,
      playList,
      mode
    } = this;
    const prevIdx = this.index;

    if (playList.length === 0) {
      return;
    } else if (playList.length === 1) {
      this.index = 0;
    } else if (mode === types/* PLAY_MODE.SEQUENTIAL */.kV.SEQUENTIAL) {
      this.index = index === 0 ? 0 : index - 1;
    } else {
      this.index = index === 0 ? playList.length - 1 : index - 1;
    }

    if (!(0,tools/* isSongAvailable */.nn)(this.playList[this.index], false)) {
      this.playPrev(badSongNumber + 1);
    } else {
      const _ev = lib/* Event.toPromise */.ju.toPromise(this._onPlayIdxWillStep.event);

      this._onPlayIdxWillStep.fire({
        length: this.playList.length,
        prevIdx,
        step: -1,
        playerMode: this.playerMode
      });

      await _ev;

      if (!this.allowPlayIdxStep) {
        this.index = prevIdx;
        return;
      }

      this.play({
        index: this.index
      }, {
        showDisableDialog: false,
        up: false
      });
    }
  }
  /**
   * 清空播放列表
   */


  clearPlayList() {
    this.pause();
    this.songList = [];
    this.playList = [];
    this.currentSong = null;
    this.index = 0;
    this.savedSeekTime = 0;
    this.savePlaybackState({
      songList: [],
      playList: [],
      currentSong: null,
      index: 0,
      currentTime: 0,
      duration: 0
    });
    this.trigger(types/* PLAY_STATE.CLEAR_PLAY_LIST */.tJ.CLEAR_PLAY_LIST);
  }

  resume(song) {
    if (!song) {
      song = this.currentSong;
    }

    this.isResumeIntent = true;

    // 已暂停且 audio.src 有效：直接恢复，无需重新获取 URL
    if (this.state === types/* PLAY_STATE.PAUSED */.tJ.PAUSED && this.audio && this.audio.src) {
      this.isResumeIntent = false;
      return this.audio.play();
    }

    if (song && (song.id || song.mid || song.localFilePath || song.webDavHref || song.url || (song.track && (song.track.id || song.track.mid)))) {
      const doPlay = () => {
        // 1. 优先在实际播放队列 this.playList 中查找目标歌曲下标
        let playIdx = -1;
        if (this.playList && this.playList.length > 0) {
          playIdx = this.playList.findIndex(item => isSameSong(item, song));
        }

        if (playIdx !== -1) {
          // noAutoSkip=true：URL 获取失败时不自动跳曲
          this.play({ song: this.playList[playIdx] || song, index: playIdx }, { showDisableDialog: true, up: true, noAutoSkip: true });
          return;
        }

        // 2. 若 playList 中未找到，检查原始歌单 this.songList
        let songIdx = -1;
        if (this.songList && this.songList.length > 0) {
          songIdx = this.songList.findIndex(item => isSameSong(item, song));
        }

        if (songIdx !== -1) {
          if (!this.playList || this.playList.length === 0) {
            this.playList = [...this.songList];
          }
          this.play({ song: this.songList[songIdx] || song, index: songIdx }, { showDisableDialog: true, up: true, noAutoSkip: true });
        } else if (this.songList && this.songList.length > 0) {
          this.playAll({
            songList: [song, ...this.songList],
            index: 0
          });
        } else {
          this.playAll({
            songList: [song],
            index: 0
          });
        }
      };

      // 冷启动场景：audio 未初始化，先 initAudio 再播，保证 savedSeekTime 有效
      if (!this.audio) {
        this.initAudio().then(() => doPlay());
      } else {
        doPlay();
      }
    }
  }

  savePlaybackState(updates = {}) {
    try {
      if (typeof localStorage === 'undefined') return;
      let prevState = {};
      try {
        const raw = localStorage.getItem('__qqmusic_playback_state__');
        if (raw) prevState = JSON.parse(raw);
      } catch (_) {}

      const curTime = (this.audio && !isNaN(this.audio.currentTime) && this.audio.currentTime > 0)
        ? this.audio.currentTime
        : (updates.currentTime !== undefined ? updates.currentTime : (this.savedSeekTime || prevState.currentTime || 0));

      const curDur = (this.audio && !isNaN(this.audio.duration) && this.audio.duration > 0)
        ? this.audio.duration
        : (this.currentSong && (this.currentSong.interval || (this.currentSong.track && this.currentSong.track.interval)))
          || prevState.duration || 0;

      const curVol = (this.audio && typeof this.audio.volume === 'number')
        ? this.audio.volume
        : (this.savedVolume !== undefined ? this.savedVolume : (prevState.volume !== undefined ? prevState.volume : 0.8));

      const newState = {
        songList: (this.songList || []).slice(0, 500),
        playList: (this.playList || []).slice(0, 500),
        index: typeof this.index === 'number' ? this.index : 0,
        currentSong: this.currentSong || null,
        currentTime: curTime,
        duration: curDur,
        volume: curVol,
        mode: this.mode !== undefined ? this.mode : 1,
        ...updates
      };
      localStorage.setItem('__qqmusic_playback_state__', JSON.stringify(newState));
      if (typeof curVol === 'number') {
        localStorage.setItem('qqmusic_saved_volume', String(curVol));
      }
    } catch (e) {
      console.error('[PlaybackState] savePlaybackState error:', e);
    }
  }

  savePlayList() {
    this.savePlaybackState();
  }

  getLocalPlayerData() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('__qqmusic_playback_state__') : null;
      if (raw) {
        const res = JSON.parse(raw);
        this.songList = Array.isArray(res.songList) ? res.songList : [];
        this.playList = Array.isArray(res.playList) ? res.playList : [...this.songList];
        this.index = typeof res.index === 'number' ? res.index : 0;
        if (this.index > this.playList.length - 1 || this.index < 0) {
          this.index = 0;
        }
        this.currentSong = res.currentSong || this.songList[this.index] || this.playList[this.index] || null;
        if (typeof res.currentTime === 'number' && res.currentTime > 0) {
          this.savedSeekTime = res.currentTime;
          this.savedSeekSong = this.currentSong;
        } else {
          this.savedSeekTime = 0;
          this.savedSeekSong = null;
        }
        if (typeof res.duration === 'number' && res.duration > 0) {
          this.savedDuration = res.duration;
        }
        if (typeof res.mode === 'number') {
          this.mode = res.mode;
        }
        if (typeof res.volume === 'number' && res.volume >= 0 && res.volume <= 1) {
          this.savedVolume = res.volume;
        }
        return;
      }
    } catch (e) {
      console.error('[PlaybackState] getLocalPlayerData error:', e);
    }

    this.playList = [];
    this.songList = [];
    this.index = 0;
    this.currentSong = null;
  }
  /**
   * 绑定小组件播放事件
   */


  bindMediaSessionEvent() {
    if (typeof navigator !== 'undefined' && navigator.mediaSession) {
      navigator.mediaSession.setActionHandler('play', () => {
        this.resume();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        this.pause();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.playNext();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.playPrev();
      });
      try {
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details && details.seekTime !== undefined && this.audio) {
            this.setCurrentTime(details.seekTime);
          }
        });
      } catch (e) {}
    }

    try {
      const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                  (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer);
      if (ipc && !this._mprisBound) {
        this._mprisBound = true;
        ipc.on('mpris_cmd', (_, msg) => {
          if (!msg) return;
          const cmd = msg.command;
          const args = msg.args;
          switch (cmd) {
            case 'play':
              this.resume();
              break;
            case 'pause':
              this.pause();
              break;
            case 'play_pause':
              if (this.isPaused) {
                this.resume();
              } else {
                this.pause();
              }
              break;
            case 'next':
              this.playNext();
              break;
            case 'prev':
              this.playPrev();
              break;
            case 'stop':
              this.pause();
              break;
            case 'seek':
              if (typeof args === 'number' && this.audio) {
                this.setCurrentTime(Math.max(0, this.getCurrentProcess() + args));
              }
              break;
            case 'set_position':
              if (typeof args === 'number' && this.audio) {
                this.setCurrentTime(Math.max(0, args));
              }
              break;
            case 'set_mode':
              if (typeof args === 'number') {
                this.setMode(args);
              }
              break;
            case 'set_volume':
              if (typeof args === 'number') {
                const vol = Math.max(0, Math.min(100, Math.round(args * 100)));
                this.setVolume(vol / 100);
              }
              break;
          }
        });
      }
    } catch (e) {}
  }

  setMode(mode) {
    this.mode = mode;

    if (mode === types/* PLAY_MODE.RANDOM */.kV.RANDOM) {
      this.playList = (0,tools/* shuffle */.TV)(this.songList, this.index);
      this.index = 0;
    } else {
      this.playList = this.songList;
    }

    this.trigger(types/* PLAY_STATE.MODE_CHANGE */.tJ.MODE_CHANGE, {
      mode
    });
    this.savePlaybackState({
      mode,
      playList: this.playList,
      index: this.index
    });
    try {
      const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                  (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer);
      if (ipc) {
        ipc.send('player_mode_change', { mode });
        ipc.send('mpris_update_mode', { mode });
      }
    } catch (e) {}
  }

  setState(state, args) {
    this.state = state;
    this.trigger(state, args);
  }

  trigger(eventName, args) {
    const {
      eventHandler
    } = this;

    this._onPlayStatusChange.fire({
      state: this.state,
      song: this.currentSong,
      playerMode: this.playerMode
    });

    if (eventName && (0,esm/* isString */.t5)(eventName)) {
      const eventHandlerList = eventHandler.get(eventName);

      if (eventHandlerList && (0,esm/* isArray */.kJ)(eventHandlerList)) {
        eventHandlerList.forEach(_handler => _handler(args));
      }
    }
  }
  /**
   * 生成请求音频资源的key，基于cdn链接拼接url
   * @param song
   */


  getUserUin() {
    try {
      if (typeof window !== 'undefined') {
        if (window.__LOGIN_INSTANCE__ && typeof window.__LOGIN_INSTANCE__.getUin === 'function') {
          const u = window.__LOGIN_INSTANCE__.getUin();
          if (u && String(u) !== '0') return String(u);
        }
      }
      try {
        const settings = typeof require === 'function' && require('electron-settings');
        if (settings && typeof settings.getSync === 'function') {
          const loginData = settings.getSync('login_data');
          if (loginData && loginData.musicId) {
            return String(loginData.musicId);
          }
        }
      } catch (e) {}

      if (typeof document !== 'undefined' && document.cookie) {
        const m = document.cookie.match(/(?:^|;\s*)(?:uin|login_uin|wxuin|qqmusic_uin|o_cookie)=o?(\d+)/i);
        if (m && m[1] && m[1] !== '0') return m[1];
      }

      if (typeof localStorage !== 'undefined') {
        for (const key of ['uin', 'login_uin', 'user_uin', 'musicId']) {
          const val = localStorage.getItem(key);
          if (val) {
            const num = val.replace(/\D/g, '');
            if (num && num !== '0') return num;
          }
        }
      }
    } catch (e) {}
    return '0';
  }

  async probeSongQualities(targetSong) {
    if (!targetSong) return [];
    const targetMid = (targetSong.track && targetSong.track.mid) || targetSong.mid || '';
    const mediaMid = (targetSong.track && targetSong.track.file && targetSong.track.file.media_mid) ||
                     (targetSong.file && targetSong.file.media_mid) ||
                     targetMid;
    if (!targetMid) return [];

    const qualitiesDef = [
      { key: 'master',     name: '母带',       badge: '母带',   prefix: 'AI00', ext: '.flac', sizeIndex: 0,  defaultBitrate: 4608 },
      { key: 'deluxe',     name: '臻品',       badge: '臻品',   prefix: 'Q000', ext: '.flac', sizeIndex: 1,  defaultBitrate: 1720 },
      { key: 'atmos51',    name: '5.1',        badge: '5.1',    prefix: 'Q001', ext: '.flac', sizeIndex: 2,  defaultBitrate: 2800 },
      { key: 'atmos71',    name: '7.1',        badge: '7.1',    prefix: 'Q003', ext: '.ogg',  sizeIndex: 3,  defaultBitrate: 3200 },
      { key: 'dolby',      name: '杜比',       badge: '杜比',   prefix: 'D004', ext: '.mp4',  sizeIndex: -1, defaultBitrate: 768 },
      { key: 'hires',      name: 'Hi-Res',     badge: 'Hi-Res', prefix: 'RS01', ext: '.flac', sizeIndex: 11, defaultBitrate: 2304 },
      { key: 'flac',       name: 'SQ',         badge: 'SQ',     prefix: 'F000', ext: '.flac', sizeIndex: 12, defaultBitrate: 860 },
      { key: '320k',       name: 'HQ',         badge: 'HQ',     prefix: 'M800', ext: '.mp3',  sizeIndex: 3,  defaultBitrate: 320 },
      { key: '128k',       name: '标准',       badge: '标准',   prefix: 'M500', ext: '.mp3',  sizeIndex: 1,  defaultBitrate: 128 }
    ];

    const userUin = this.getUserUin();
    const reqPayload = {
      comm: {
        uin: userUin,
        format: 'json',
        ct: 19,
        cv: 1,
        authst: ''
      },
      songinfo: {
        module: 'music.pf_song_detail_svr',
        method: 'get_song_detail_yqq',
        param: { song_mid: targetMid }
      }
    };

    qualitiesDef.forEach((q, idx) => {
      reqPayload['req_' + idx] = {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
          guid: '10000',
          songmid: [targetMid],
          filename: [q.prefix + mediaMid + q.ext],
          songtype: [0],
          uin: userUin,
          loginflag: 1,
          platform: '20'
        }
      };
    });

    try {
      const res = await (0,network/* ufetch */.D)(reqPayload, false);
      if (!res) return [];

      const trackInfo = (res.songinfo && res.songinfo.data && res.songinfo.data.track_info) || {};
      const fileObj = trackInfo.file || (targetSong.file || (targetSong.track && targetSong.track.file)) || {};
      const interval = trackInfo.interval || (targetSong.interval || (targetSong.track && targetSong.track.interval)) || 0;
      const sizeNew = Array.isArray(fileObj.size_new) ? fileObj.size_new : [];
      const sizeDolby = Number(fileObj.size_dolby) || 0;
      const sizeHires = Number(fileObj.size_hires) || Number(fileObj.size_96flac) || Number(fileObj.size_24bit) || 0;
      const sizeFlac = Number(fileObj.size_flac) || Number(fileObj.size_ape) || Number(fileObj.size_dts) || 0;
      const size320 = Number(fileObj.size_320mp3) || 0;
      const size128 = Number(fileObj.size_128mp3) || 0;

      const probedList = qualitiesDef.map((q, idx) => {
        const reqData = res['req_' + idx] && res['req_' + idx].data;
        let playUrl = '';
        if (reqData && reqData.midurlinfo && reqData.midurlinfo.length > 0) {
          const purl = reqData.midurlinfo[0].purl;
          const sip = (reqData.sip && reqData.sip[0]) || 'http://isure.stream.qqmusic.qq.com/';
          if (purl && purl.length > 5 && !purl.includes('404')) {
            playUrl = sip + purl;
          }
        }

        let fileSize = 0;
        if (q.key === 'dolby') {
          fileSize = sizeDolby || (Number(sizeNew[17]) || 0);
        } else if (q.key === 'master') {
          fileSize = Number(sizeNew[0]) || Number(sizeNew[13]) || 0;
        } else if (q.key === 'deluxe') {
          fileSize = Number(sizeNew[1]) || Number(sizeNew[14]) || 0;
        } else if (q.key === 'atmos51') {
          fileSize = Number(sizeNew[2]) || Number(sizeNew[15]) || 0;
        } else if (q.key === 'atmos71') {
          fileSize = Number(sizeNew[3]) || Number(sizeNew[16]) || 0;
        } else if (q.key === 'hires') {
          fileSize = sizeHires > 0 ? sizeHires : (Number(sizeNew[11]) || 0);
        } else if (q.key === 'flac') {
          fileSize = sizeFlac > 0 ? sizeFlac : (Number(sizeNew[12]) || 0);
        } else if (q.key === '320k') {
          fileSize = size320 > 0 ? size320 : (Number(sizeNew[3]) || 0);
        } else if (q.key === '128k') {
          fileSize = size128 || (Number(sizeNew[1]) || 0);
        }

        const requiresFileSize = ['master', 'deluxe', 'atmos51', 'atmos71', 'dolby', 'hires', 'flac'].includes(q.key);
        const isAvailable = Boolean(playUrl && playUrl.length > 15 && !playUrl.includes('404') && (!requiresFileSize || fileSize > 0));
        let realBitrate = q.defaultBitrate;
        if (fileSize > 0 && interval > 0) {
          realBitrate = Math.round((fileSize * 8) / interval / 1000);
        }

        return {
          ...q,
          fileSize,
          bitrate: realBitrate,
          bitrateStr: realBitrate + 'kbps',
          isAvailable,
          playUrl: isAvailable ? playUrl : ''
        };
      });

      this._probedQualitiesCache = this._probedQualitiesCache || new Map();
      this._probedQualitiesCache.set(targetMid, probedList);
      if (typeof window !== 'undefined') {
        window.__PROBED_QUALITIES_MAP__ = window.__PROBED_QUALITIES_MAP__ || {};
        window.__PROBED_QUALITIES_MAP__[targetMid] = probedList;
        window.dispatchEvent && window.dispatchEvent(new CustomEvent('qqmusic_qualities_probed', {
          detail: { songMid: targetMid, qualities: probedList }
        }));
      }
      return probedList;
    } catch (err) {
      return [];
    }
  }

  async generateVKey(song, targetQuality = null) {
    if (typeof window !== "undefined") {
      window.__QQMUSIC_PLAYER_INSTANCE__ = this;
    }
    const userPref = targetQuality || (typeof localStorage !== 'undefined' && localStorage.getItem('qqmusic_quality')) || 'flac';
    const targetSong = song[0];
    const file = (targetSong && (targetSong.file || (targetSong.track && targetSong.track.file))) || {};
    const targetMid = (targetSong && (targetSong.mid || (targetSong.track && targetSong.track.mid))) || '';

    // 权威精准判定各音质在服务器中是否存在 (兼容扁平与嵌套结构)
    const hasHires = Boolean(
      (Number(file.size_hires) > 0) ||
      (Number(targetSong?.size_hires) > 0) ||
      (Number(file.size_96flac) > 0) ||
      (Number(file.size_24bit) > 0) ||
      (Number(file.hires_bitdepth) > 16) ||
      (Number(file.hires_sample) > 48000) ||
      (Array.isArray(file.size_new) && (Number(file.size_new[11]) > 0 || Number(file.size_new[13]) > 0))
    );
    const hasSQ = Boolean(
      (Number(file.size_flac) > 0) ||
      (Number(targetSong?.sizeflac) > 0) ||
      (Number(targetSong?.size_flac) > 0) ||
      (Number(file.size_ape) > 0) ||
      (Number(file.size_dts) > 0) ||
      (Array.isArray(file.size_new) && Number(file.size_new[12]) > 0) ||
      hasHires
    );
    const hasHQ = Boolean(
      (Number(file.size_320mp3) > 0) ||
      (Number(targetSong?.size320) > 0) ||
      (Number(targetSong?.size_320mp3) > 0) ||
      (Array.isArray(file.size_new) && Number(file.size_new[3]) > 0) ||
      hasSQ
    );

    // 0. 优先检测本地磁盘是否有完整音频缓存 (0 网络往返，10ms 秒开)
    let localCacheHit = null;
    try {
      const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                  (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer) ||
                  (typeof window !== 'undefined' && window.ipcRenderer);
      if (ipc && typeof ipc.invoke === 'function') {
        localCacheHit = await ipc.invoke('query-audio-cache', { mid: targetMid, tier: userPref });
      }
    } catch (e) {}

    if (localCacheHit && localCacheHit.hit && localCacheHit.fileUrl) {
      const hitTier = localCacheHit.tier || userPref;
      const hitBadge = hitTier === 'master' ? '母带'
                     : hitTier === 'deluxe' ? '臻品'
                     : hitTier === 'atmos51' ? '5.1'
                     : hitTier === 'atmos71' ? '7.1'
                     : hitTier === 'dolby' ? '杜比'
                     : hitTier === 'hires' ? 'Hi-Res'
                     : hitTier === 'flac' ? 'SQ'
                     : hitTier === '320k' ? 'HQ' : '标准';

      if (typeof window !== 'undefined') {
        window.__CURRENT_PLAYING_QUALITY__ = hitBadge;
        window.dispatchEvent && window.dispatchEvent(new CustomEvent('qqmusic_quality_change', { detail: hitBadge }));

        const durationSec = (targetSong && (targetSong.interval || (targetSong.track && targetSong.track.interval))) || 0;
        let bitrate = 0;
        let bitrateStr = '';
        if (localCacheHit.fileSize > 0 && durationSec > 0) {
          bitrate = Math.round((localCacheHit.fileSize * 8) / durationSec / 1000);
          bitrateStr = bitrate + 'kbps';
        }

        const metrics = {
          codec: localCacheHit.filePath.endsWith('.flac') ? 'FLAC' : localCacheHit.filePath.endsWith('.ogg') ? 'OGG' : localCacheHit.filePath.endsWith('.mp4') ? 'MP4' : 'MP3',
          bitrate: bitrate || 1411,
          bitrateStr: bitrateStr || '已缓存',
          quality: hitBadge,
          qualityKey: hitTier,
          song: targetSong,
          songMid: targetMid,
          isCached: true
        };
        window.__CURRENT_AUDIO_METRICS__ = metrics;
        window.dispatchEvent && window.dispatchEvent(new CustomEvent('qqmusic_metrics_update', { detail: metrics }));
      }

      this.probeSongQualities(targetSong).catch(() => {});

      return [{
        url: localCacheHit.fileUrl,
        codes: null,
        quality: hitBadge,
        tierKey: hitTier,
        isCached: true
      }];
    }

    // 1. 优先调用复合批量探测 (单次网络往返直接获知 9 档可用性与直链)
    let probedList = this._probedQualitiesCache && this._probedQualitiesCache.get(targetMid);
    if (!probedList || probedList.length === 0) {
      probedList = await this.probeSongQualities(targetSong);
    }

    // 2. 构建 9 档平滑降级链
    const fallbackMap = {
      master: ['master', 'deluxe', 'atmos71', 'atmos51', 'hires', 'flac', '320k', '128k'],
      deluxe: ['deluxe', 'master', 'atmos71', 'atmos51', 'hires', 'flac', '320k', '128k'],
      atmos51: ['atmos51', 'atmos71', 'deluxe', 'master', 'hires', 'flac', '320k', '128k'],
      atmos71: ['atmos71', 'atmos51', 'deluxe', 'master', 'hires', 'flac', '320k', '128k'],
      dolby: ['dolby', 'atmos71', 'atmos51', 'deluxe', 'hires', 'flac', '320k', '128k'],
      hires: ['hires', 'flac', '320k', '128k'],
      flac: ['flac', '320k', '128k'],
      '320k': ['320k', '128k'],
      '128k': ['128k']
    };
    const preferenceChain = fallbackMap[userPref] || ['flac', '320k', '128k'];

    // 3. 若有探测结果，提取首选或最高可用项
    let chosenItem = null;
    if (probedList && probedList.length > 0) {
      for (const prefKey of preferenceChain) {
        const found = probedList.find(item => item.key === prefKey && item.isAvailable && item.playUrl);
        if (found) {
          chosenItem = found;
          break;
        }
      }
      if (!chosenItem) {
        chosenItem = probedList.find(item => item.isAvailable && item.playUrl);
      }
    }

    if (chosenItem && chosenItem.playUrl) {
      // 启动后台渐进式流式边播边存
      try {
        const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                    (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer) ||
                    (typeof window !== 'undefined' && window.ipcRenderer);
        if (ipc && typeof ipc.invoke === 'function') {
          ipc.invoke('start-progressive-audio-cache', {
            mid: targetMid,
            tier: chosenItem.key,
            cdnUrl: chosenItem.playUrl
          }).catch(() => {});
        }
      } catch (e) {}

      if (typeof window !== 'undefined') {
        window.__CURRENT_PLAYING_QUALITY__ = chosenItem.badge;
        window.dispatchEvent && window.dispatchEvent(new CustomEvent('qqmusic_quality_change', { detail: chosenItem.badge }));

        const metrics = {
          codec: (chosenItem.ext === '.flac') ? 'FLAC' : (chosenItem.ext === '.ogg') ? 'OGG' : (chosenItem.ext === '.mp4') ? 'MP4' : 'MP3',
          bitrate: chosenItem.bitrate,
          bitrateStr: chosenItem.bitrateStr,
          quality: chosenItem.badge,
          qualityKey: chosenItem.key,
          song: targetSong,
          songMid: targetMid,
          hasMaster: probedList.some(item => item.key === 'master' && item.isAvailable),
          hasDeluxe: probedList.some(item => item.key === 'deluxe' && item.isAvailable),
          hasAtmos51: probedList.some(item => item.key === 'atmos51' && item.isAvailable),
          hasAtmos71: probedList.some(item => item.key === 'atmos71' && item.isAvailable),
          hasDolby: probedList.some(item => item.key === 'dolby' && item.isAvailable),
          hasHires: probedList.some(item => item.key === 'hires' && item.isAvailable),
          hasSQ: probedList.some(item => item.key === 'flac' && item.isAvailable),
          hasHQ: probedList.some(item => item.key === '320k' && item.isAvailable),
          hasStandard: true,
          probedQualities: probedList
        };
        window.__CURRENT_AUDIO_METRICS__ = metrics;
        window.dispatchEvent && window.dispatchEvent(new CustomEvent('qqmusic_metrics_update', { detail: metrics }));
      }

      return [{
        url: chosenItem.playUrl,
        codes: null,
        quality: chosenItem.badge,
        tierKey: chosenItem.key
      }];
    }

    // 4. 网络异常时传统单次取链兜底 (严加 hasHires / hasSQ 守卫，杜绝无资源时虚假请求 RS01)
    const mids = song.map(item => {
      return (item && item.track && item.track.mid) || (item && item.mid) || '';
    });

    const fallbackCandidateList = [];
    if (userPref === 'master') fallbackCandidateList.push({ prefix: 'AI00', ext: '.flac', name: '母带' });
    if (userPref === 'deluxe') fallbackCandidateList.push({ prefix: 'Q000', ext: '.flac', name: '臻品' });
    if (userPref === 'atmos51') fallbackCandidateList.push({ prefix: 'Q001', ext: '.flac', name: '5.1' });
    if (userPref === 'atmos71') fallbackCandidateList.push({ prefix: 'Q003', ext: '.ogg', name: '7.1' });
    if (userPref === 'dolby') fallbackCandidateList.push({ prefix: 'D004', ext: '.mp4', name: '杜比' });
    if (hasHires) {
      fallbackCandidateList.push({ prefix: 'RS01', ext: '.flac', name: 'Hi-Res' });
    }
    if (hasSQ) {
      fallbackCandidateList.push({ prefix: 'F000', ext: '.flac', name: 'SQ' });
    }
    if (hasHQ) {
      fallbackCandidateList.push({ prefix: 'M800', ext: '.mp3', name: 'HQ' });
    }
    fallbackCandidateList.push(
      { prefix: 'M500', ext: '.mp3', name: '标准' },
      { prefix: 'C400', ext: '.m4a', name: '标准' }
    );

    let finalResult = null;
    for (const q of fallbackCandidateList) {
      const param = {
        songmid: [],
        filename: []
      };

      song.forEach(item => {
        const sm = (item && item.track && item.track.mid) || (item && item.mid) || '';
        const mm = (item && item.track && item.track.file && item.track.file.media_mid) ||
                   (item && item.file && item.file.media_mid) ||
                   sm;
        param.songmid.push(sm);
        param.filename.push(q.prefix + mm + q.ext);
      });

      try {
        const res = await (0,network/* ufetch */.D)({
          getVKey: (0,asset_api/* getUrlVKey */.g_)(param)
        }, true);

        if (res && res.code === 0 && res.getVKey && res.getVKey.code === 0 && res.getVKey.data && res.getVKey.data.midurlinfo) {
          const firstInfo = res.getVKey.data.midurlinfo[0];
          const firstPurl = firstInfo && firstInfo.purl;
          
          if (firstPurl && typeof firstPurl === 'string' && firstPurl.length > 5) {
            const availableCDN = this.cdnUtil.getAvailableCdn(mids);
            
            if (typeof window !== 'undefined') {
              window.__CURRENT_PLAYING_QUALITY__ = q.name;
              window.dispatchEvent && window.dispatchEvent(new CustomEvent('qqmusic_quality_change', { detail: q.name }));
              
              const durationSec = (targetSong && (targetSong.interval || (targetSong.track && targetSong.track.interval))) || 0;
              let bitrate = 128;
              let bitrateStr = '128kbps';
              if (q.name === 'Hi-Res') {
                const size = file.size_hires || file.size_96flac || file.size_24bit || (file.size_new && (file.size_new[11] || file.size_new[13])) || 0;
                bitrate = (size > 0 && durationSec > 0) ? Math.round((size * 8) / durationSec / 1000) : 2968;
                bitrateStr = bitrate + 'kbps';
              } else if (q.name === 'SQ') {
                const size = file.size_flac || file.size_ape || file.size_dts || (file.size_new && file.size_new[12]) || 0;
                bitrate = (size > 0 && durationSec > 0) ? Math.round((size * 8) / durationSec / 1000) : 860;
                bitrateStr = bitrate + 'kbps';
              } else if (q.name === 'HQ') {
                bitrate = 320;
                bitrateStr = '320kbps';
              } else {
                bitrate = 128;
                bitrateStr = '128kbps';
              }

              const metrics = {
                codec: (q.name === 'Hi-Res' || q.name === 'SQ') ? 'FLAC' : 'MP3',
                bitrate,
                bitrateStr,
                quality: q.name,
                song: targetSong,
                songMid: targetMid,
                hasStandard: true
              };
              window.__CURRENT_AUDIO_METRICS__ = metrics;
              window.dispatchEvent && window.dispatchEvent(new CustomEvent('qqmusic_metrics_update', { detail: metrics }));
            }

            finalResult = [firstInfo].map((item, idx) => {
              let cdnHost = availableCDN[idx] || 'http://isure.stream.qqmusic.qq.com/';
              return {
                url: cdnHost + item.purl,
                codes: null,
                quality: q.name
              };
            });
            break;
          }
        }
      } catch (err) {}
    }

    if (finalResult && finalResult.length > 0) {
      return finalResult;
    }
    return [{ url: '', code: -1, quality: '标准' }];
  }

  on(eventName, listener) {
    const {
      eventHandler
    } = this;

    if (eventName && (0,esm/* isFunction */.mf)(listener)) {
      if (eventHandler.has(eventName)) {
        eventHandler.set(eventName, [...eventHandler.get(eventName), listener]);
      } else {
        eventHandler.set(eventName, [listener]);
      }
    }
  }

  off(eventName, listener) {
    const {
      eventHandler
    } = this;

    if (eventName && (0,esm/* isFunction */.mf)(listener) && eventHandler.has(eventName)) {
      const handlers = eventHandler.get(eventName) || [];
      const idx = handlers.findIndex(item => item === listener);

      if (idx !== -1) {
        handlers.splice(idx, 1);
      }
    }
  }

  setMute(val) {
    this.audio.muted = val;
  }

  getCurrentProcess() {
    return this.audio.currentTime;
  }

  setMediaSession(customCoverUrl, customCoverSize) {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
    const song = this.currentSong;
    if (!song) return;

    let singerName = '';
    if (Array.isArray(song.singer) && song.singer[0]) {
      singerName = song.singer[0].name || (song.singer[0].title || '').replace(/<\/?[^>]*>/g, '');
    } else if (song.track && Array.isArray(song.track.singer) && song.track.singer[0]) {
      singerName = song.track.singer[0].name || (song.track.singer[0].title || '').replace(/<\/?[^>]*>/g, '');
    }

    const albumName = (song.album && song.album.name) || (song.track && song.track.album && song.track.album.name) || '';
    const songTitle = song.title || '';

    let coverUrl = customCoverUrl || '';
    let coverSize = customCoverSize || '';

    if (!coverUrl) {
      const _tr = song.track || song || {};
      const _aMid = (song.album && song.album.mid) || (_tr.album && _tr.album.mid) || null;
      const _pmid = song.pmid || (song.album && song.album.pmid) || (song.vs && song.vs[1]) || _tr.pmid || (_tr.album && _tr.album.pmid) || (_tr.vs && _tr.vs[1]) || null;
      const _sMid = (song.singer && song.singer[0] && song.singer[0].mid) || (_tr.singer && _tr.singer[0] && _tr.singer[0].mid) || null;
      const _localCover = (song.album && (song.album.pic || song.album.picurl)) || (song.pic || song.picurl) || (_tr.album && (_tr.album.pic || _tr.album.picurl)) || null;

      if (_localCover) {
        coverUrl = _localCover;
        coverSize = '1200x1200';
      } else if (_aMid && _aMid.length > 5) {
        coverUrl = utils/* default.getAlbumPic */.ZP.getAlbumPic(_aMid, 1500);
        coverSize = '1500x1500';
      } else if (_pmid && _pmid.length > 5) {
        coverUrl = "https://y.gtimg.cn/music/photo_new/T062R800x800M000" + _pmid + ".jpg?max_age=2592000";
        coverSize = '800x800';
      } else if (_sMid && _sMid.length > 5) {
        coverUrl = "https://y.gtimg.cn/music/photo_new/T001R1500x1500M000" + _sMid + ".jpg?max_age=2592000";
        coverSize = '1500x1500';
      } else {
        coverUrl = utils/* default.getAlbumPic */.ZP.getAlbumPic(null, 1500);
        coverSize = '1500x1500';
      }
    } else if (!coverSize) {
      if (coverUrl.includes('1500x1500') || coverUrl.includes('T001R1500')) {
        coverSize = '1500x1500';
      } else if (coverUrl.includes('800x800') || coverUrl.includes('T062R800')) {
        coverSize = '800x800';
      } else if (coverUrl.includes('1200x1200')) {
        coverSize = '1200x1200';
      } else {
        coverSize = '1200x1200';
      }
    }

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: songTitle,
        artist: singerName,
        album: albumName,
        artwork: [{
          src: coverUrl,
          sizes: coverSize,
          type: 'image/jpeg'
        }]
      });
      navigator.mediaSession.playbackState = 'playing';
    } catch (e) {}

    try {
      const ipc = (typeof external_electron_ !== 'undefined' && external_electron_.ipcRenderer) ||
                  (typeof window !== 'undefined' && window.require && window.require('electron').ipcRenderer);
      if (ipc) {
        const _duration = (song.track && song.track.interval) || song.interval || (this.audio && this.audio.duration) || 0;
        ipc.send('mpris_update_metadata', {
          title: songTitle,
          artist: singerName,
          album: albumName,
          artUrl: coverUrl,
          duration: _duration
        });
        ipc.send('mpris_update_playback', { status: 'Playing' });
        ipc.send('mpris_update_mode', { mode: this.mode });
      }
    } catch (e) {}
  }

  getAudioElement() {
    return this.audio;
  }

  get isPaused() {
    return this.state === types/* PLAY_STATE.PAUSED */.tJ.PAUSED;
  }

  get isRadioMode() {
    return this.playerMode === types/* PLAYER_MODE.RADIO */.Ih.RADIO;
  }

  setAllowPlayIdxStep(value = false) {
    this.allowPlayIdxStep = value;
  }

}
Player._instance = new Player();

//# sourceURL=webpack://qqmusic/./src/client/modules/players/index.ts_+_2_modules?