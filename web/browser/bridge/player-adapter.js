import { post } from './api.js';
import { modeToQq, qualityKeyToTier } from './config.js';
import { mapSong } from './media.js';
import { state } from './state.js';

// Forward direct `audio.currentTime` assignments to the backend. The recovered
// lyric page's handleLyricClick assigns `player.audio.currentTime` directly,
// bypassing setCurrentTime. Guarded by state.applying (applyState syncs the
// mirror) and seconds > 0 (native playSong resets to 0 on song start).
function wrapAudioSeek(audio) {
  if (!audio || Object.getOwnPropertyDescriptor(audio, 'currentTime')) return;
  const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');
  if (!desc?.get || !desc?.set) return;
  Object.defineProperty(audio, 'currentTime', {
    configurable: true,
    enumerable: true,
    get() {
      return desc.get.call(audio);
    },
    set(value) {
      const seconds = Math.max(0, Number(value) || 0);
      desc.set.call(audio, seconds);
      if (!state.applying && seconds > 0) {
        post(`/api/seek?pos=${seconds.toFixed(2)}`).catch(() => {});
      }
    },
  });
}

export function attachPlayer(logicalPlayer, { applyState, showToast, toggleFavorite }) {
  if (!logicalPlayer || state.player === logicalPlayer) return;
  state.player = logicalPlayer;
  const original = {
    initAudio: logicalPlayer.initAudio.bind(logicalPlayer),
    pause: logicalPlayer.pause.bind(logicalPlayer),
    resume: logicalPlayer.resume.bind(logicalPlayer),
    playNext: logicalPlayer.playNext.bind(logicalPlayer),
    playPrev: logicalPlayer.playPrev.bind(logicalPlayer),
    setCurrentTime: logicalPlayer.setCurrentTime.bind(logicalPlayer),
    setVolume: logicalPlayer.setVolume.bind(logicalPlayer),
    setMode: logicalPlayer.setMode.bind(logicalPlayer),
    setMute:
      typeof logicalPlayer.setMute === 'function'
        ? logicalPlayer.setMute.bind(logicalPlayer)
        : null,
    playAll: logicalPlayer.playAll.bind(logicalPlayer),
    play: typeof logicalPlayer.play === 'function' ? logicalPlayer.play.bind(logicalPlayer) : null,
    generateVKey:
      typeof logicalPlayer.generateVKey === 'function'
        ? logicalPlayer.generateVKey.bind(logicalPlayer)
        : null,
  };

  logicalPlayer.initAudio = async () => {
    // CDN discovery belongs to the Electron client. In the browser, qmtui owns the stream or
    // the CLI owns audio output, so initialization only needs one hidden media element.
    if (!logicalPlayer.audio) {
      const audio = document.createElement('audio');
      audio.style.cssText = 'height:0;width:0;display:none';
      audio.volume = Number.isFinite(logicalPlayer.savedVolume) ? logicalPlayer.savedVolume : 0.8;
      logicalPlayer.audio = audio;
      document.body.appendChild(audio);
      wrapAudioSeek(audio);
    } else {
      // Native initAudio may have run before attach; wrap any existing mirror.
      wrapAudioSeek(logicalPlayer.audio);
    }
    return { song: logicalPlayer.currentSong, songList: logicalPlayer.songList || [] };
  };

  if (typeof logicalPlayer.favorite === 'function') {
    original.favorite = logicalPlayer.favorite.bind(logicalPlayer);
  }
  logicalPlayer.__qmtuiOriginal = original;

  logicalPlayer.pause = (...args) => {
    if (!state.applying) post('/api/toggle').catch(() => {});
    if (state.applying) return original.pause(...args);
  };
  logicalPlayer.resume = (...args) => {
    if (!state.applying) post('/api/toggle').catch(() => {});
    if (state.applying) return original.resume(...args);
  };
  logicalPlayer.playNext = (...args) => {
    if (!state.applying) post('/api/next').catch(() => {});
    if (state.applying) return original.playNext(...args);
  };
  logicalPlayer.playPrev = (...args) => {
    if (!state.applying) post('/api/previous').catch(() => {});
    if (state.applying) return original.playPrev(...args);
  };
  logicalPlayer.setCurrentTime = (value) => {
    if (!state.applying) {
      post(`/api/seek?pos=${Math.max(0, Number(value) || 0).toFixed(2)}`).catch(() => {});
    }
    if (state.applying) return original.setCurrentTime(value);
  };
  logicalPlayer.setVolume = (value) => {
    const vol = Math.round(Math.max(0, Math.min(1, Number(value) || 0)) * 100);
    if (!state.applying) {
      if (vol > 0) state.lastAudibleVolume = vol;
      post('/api/action', { action: 'volume', volume: vol }).catch(() => {});
    }
    if (state.applying) return original.setVolume(value);
  };
  if (original.setMute) {
    logicalPlayer.setMute = (val) => {
      if (!state.applying) {
        // Backend has no "mute" action: mute = volume 0, unmute = restore the
        // last audible volume.
        const volume = val ? 0 : Math.max(1, state.lastAudibleVolume || 80);
        post('/api/action', { action: 'volume', volume }).catch(() => {});
      }
      if (state.applying) return original.setMute(val);
    };
  }
  logicalPlayer.setMode = (mode) => {
    if (!state.applying && mode !== modeToQq[state.remote?.mode]) {
      post('/api/mode').catch(() => {});
    }
    return original.setMode(mode);
  };

  if (original.generateVKey) {
    logicalPlayer.generateVKey = async (songs, targetKey) => {
      const tier = qualityKeyToTier[targetKey];
      if (!state.applying && Number.isInteger(tier)) {
        await post('/api/quality', { tier });
        return [{ url: '', quality: state.remote?.qualityBadge || '标准' }];
      }
      return original.generateVKey(songs, targetKey);
    };
  }
  if (original.favorite) {
    logicalPlayer.favorite = () => {
      if (!state.applying) toggleFavorite();
    };
  }
  logicalPlayer.playAll = (params) => {
    const songs = params?.songList || [];
    const selected = songs[params?.index || params?.playIndex || 0];
    if (state.applying || !selected || selected.qmtuiRemote === false) {
      return original.playAll(params);
    }
    const song = mapSong(selected);
    if (song.mid) {
      post('/api/library/play', {
        song,
        context: songs.map(mapSong).filter((value) => value.mid),
      }).catch((error) => showToast(error.message, true));
    }
  };

  // 播放队列抽屉（原生 play_list 组件）走的是 play({ song }) 而不是 playAll：原生实现会
  // 自己去解析 QQ 播放地址、在浏览器里直接放，CLI 完全不知情——表现就是队列里点了没反应。
  // 与 playAll 一样改派给 /api/library/play，播放与界面状态才会一致。
  if (original.play) {
    logicalPlayer.play = (params, ...rest) => {
      const picked =
        params?.song ||
        params?.track ||
        params?.songList?.[params?.index ?? params?.playIndex ?? 0];
      if (state.applying || !picked || picked.qmtuiRemote === false) {
        return original.play(params, ...rest);
      }
      const song = mapSong(picked);
      if (!song.mid) return original.play(params, ...rest);
      // 队列抽屉点的就是 CLI 的队列本身：上下文优先取 CLI 的队列，顺序与定位才不会错位
      //（原生播放器内部的 playList 顺序可能与队列不同）。
      const remoteQueue = Array.isArray(state.remote?.songList) ? state.remote.songList : [];
      const localQueue =
        (logicalPlayer.playList?.length ? logicalPlayer.playList : logicalPlayer.songList) || [];
      const source = remoteQueue.length ? remoteQueue : localQueue;
      const context = source.map(mapSong).filter((value) => value.mid);
      post('/api/library/play', {
        song,
        context: context.length ? context : [song],
      }).catch((error) => showToast(error.message, true));
    };
  }

  // The recovered bundle reads window.__QQMUSIC_PLAYER_INSTANCE__ for lyric seek
  // (handleLyricClick) and quality probing. It is normally set only inside the
  // native generateVKey, which we override — so point it at the bridged player.
  if (typeof window !== 'undefined' && window.__QQMUSIC_PLAYER_INSTANCE__ !== logicalPlayer) {
    window.__QQMUSIC_PLAYER_INSTANCE__ = logicalPlayer;
  }
  // Native initAudio may have run before attach; wrap any existing mirror now.
  if (logicalPlayer.audio) wrapAudioSeek(logicalPlayer.audio);

  window.__QMTUI_PLAYER__ = logicalPlayer;
  if (state.remote) applyState(state.remote);
}
