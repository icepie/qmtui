import { api, post } from './bridge/api.js';
import { modeToQq, qualityKeyToTier, qualityTierToKey } from './bridge/config.js';
import { albumCover, escapeHtml, keyOf, mapSong, query, songCover } from './bridge/media.js';
import { attachPlayer } from './bridge/player-adapter.js';
import { createRouteController } from './bridge/route-controller.js';
import { state } from './bridge/state.js';

(() => {
  if (window.__qmtuiBridgeInstalled) return;
  window.__qmtuiBridgeInstalled = true;

  /** 该歌曲是否在收藏集合里（mid 与 id 任一命中即算；集合未就绪时返回 false，由调用方决定回退）。 */
  function isFavoriteSong(song) {
    if (!song) return false;
    const mid = song.mid ? String(song.mid) : '';
    const id = Number(song.id) > 0 ? String(song.id) : '';
    return (mid !== '' && state.favoriteKeys.has(mid)) || (id !== '' && state.favoriteKeys.has(id));
  }

  /** 播放态或喜欢操作改变后，同步本地键集合，保持行心形与服务端一致。 */
  function syncFavoriteKey(song, isFavorite) {
    if (!state.favoriteKeysLoaded || !song) return;
    const keys = [song.mid ? String(song.mid) : '', Number(song.id) > 0 ? String(song.id) : ''];
    for (const key of keys) {
      if (!key) continue;
      if (isFavorite) state.favoriteKeys.add(key);
      else state.favoriteKeys.delete(key);
    }
  }

  /** 已渲染列表的心形就地刷新（原生按 singer[]/行顺序渲染，行与歌曲下标一一对应）。 */
  function refreshLoveMarks() {
    const list = state.lastList;
    if (!list || !state.favoriteKeysLoaded) return;
    const rows = [...list.host.querySelectorAll('.songlist__item')];
    rows.forEach((row, index) => {
      const song = list.songs[index];
      const icon = row.querySelector('.songlist__icon_love');
      if (!song || !icon) return;
      song.like = isFavoriteSong(song);
      icon.classList.toggle('loved', song.like);
    });
  }

  /**
   * 拉取收藏集合（后端直接读常驻内存，不请求 QQ）。集合预热完成前后端回 503，
   * 此时按固定间隔重试；`favorites_synced` 播放态事件到达时也会立刻重试一次。
   */
  async function ensureFavoriteKeys(force = false) {
    if (state.favoriteKeysLoaded && !force) return;
    state.favoriteKeysAttempts += 1;
    try {
      const result = await api('/api/library/favorites/ids');
      state.favoriteKeys = new Set(
        [...(result.mids || []), ...(result.ids || [])].map((key) => String(key))
      );
      state.favoriteKeysLoaded = true;
      state.favoriteKeysAttempts = 0;
      clearTimeout(state.favoriteKeysTimer);
      state.favoriteKeysTimer = null;
      refreshLoveMarks();
    } catch {
      // 预热未完成（503）或后端未提供时静默重试，避免刷提示。
      if (state.favoriteKeysAttempts >= 40) return;
      clearTimeout(state.favoriteKeysTimer);
      state.favoriteKeysTimer = setTimeout(() => ensureFavoriteKeys(), 2000);
    }
  }

  function toQqSong(song, liked = false) {
    const mapped = mapSong(song);
    const duration = Number(mapped.duration) || 0;
    // 原生 SongList 直接渲染 songInfo.playTime（见 recovered song_list/index.tsx），需 mm:ss 字符串。
    const playTime = duration
      ? `${String(Math.floor(duration / 60)).padStart(2, '0')}:${String(duration % 60).padStart(2, '0')}`
      : '';
    const cover = songCover(mapped, 500);
    const singers =
      Array.isArray(mapped.singers) && mapped.singers.length
        ? mapped.singers.map((s) => ({
            name: s.name,
            title: s.name,
            mid: s.mid || '',
            id: s.id || 0,
          }))
        : String(mapped.artist || '未知歌手')
            .split('/')
            .filter(Boolean)
            .map((name) => ({ name, title: name }));
    const value = {
      id: Number(mapped.id) || 0,
      mid: mapped.mid || '',
      media_mid: mapped.mediaMid || mapped.mid || '',
      name: mapped.title || '未知曲目',
      title: mapped.title || '未知曲目',
      singer: singers,
      artist: mapped.artist || '未知歌手',
      album: {
        name: mapped.album || '',
        title: mapped.album || '',
        mid: mapped.albumMid || '',
        pic: cover,
        picurl: cover,
      },
      albumMid: mapped.albumMid || '',
      interval: duration,
      duration,
      playTime,
      file: { media_mid: mapped.mediaMid || mapped.mid || '', size_128mp3: 1 },
      action: { play: 1, fav: 1, share: 1 },
      url: '',
      pic: cover,
      picurl: cover,
      like: liked,
      isLocal: false,
      lyrics: Array.isArray(song.lyrics) ? song.lyrics : [],
    };
    // 收藏集合就绪后逐首按真实收藏态渲染心形；未就绪时沿用调用方给的列表级标记（如“我喜欢”页）。
    if (state.favoriteKeysLoaded) value.like = isFavoriteSong(value);
    state.songs.set(keyOf(value), value);
    if (value.id) state.songs.set(String(value.id), value);
    return value;
  }

  function toNativePlaylist(item) {
    const id = Number(item.tid || item.id || item.dirId) || 0;
    const value = {
      ...item,
      id,
      tid: Number(item.tid) || id,
      dirId: Number(item.dirId) || id,
      dirid: Number(item.dirId) || id,
      dissid: id,
      disstid: id,
      dirName: item.name || item.title || '未命名歌单',
      name: item.name || item.title || '未命名歌单',
      title: item.name || item.title || '未命名歌单',
      songNum: Number(item.songCount || item.songNum) || 0,
      songnum: Number(item.songCount || item.songNum) || 0,
      picUrl: item.picUrl || item.picurl || '',
      picurl: item.picUrl || item.picurl || '',
      // 原生 formatSelfFavPlayListItem 会用 item.logo 重建 picurl，没带 isFormat 时
      // 我们传的 picUrl 会被丢掉（封面变默认图）。补 logo 并标记已格式化，两条路都保住封面。
      logo: item.picUrl || item.picurl || '',
      isFormat: true,
      subtitle: `${Number(item.songCount || item.songNum) || 0} 首歌曲`,
      qmtuiRemote: true,
    };
    state.playlists.set(String(id), value);
    state.playlists.set(String(value.dirId), value);
    return value;
  }

  function toNativeAlbum(item) {
    const singers = String(item.artist || '')
      .split('/')
      .filter(Boolean)
      .map((name) => ({ name, title: name }));
    const value = {
      ...item,
      id: Number(item.id) || 0,
      mid: item.mid || '',
      name: item.title || item.name || '未命名专辑',
      title: item.title || item.name || '未命名专辑',
      singer: singers,
      v_singer: singers,
      subtitle: `${Number(item.songCount) || 0} 首歌曲`,
      picurl: albumCover(item),
      qmtuiRemote: true,
    };
    if (value.mid) state.albums.set(value.mid, value);
    if (value.id) state.albums.set(String(value.id), value);
    return value;
  }

  function getRuntime() {
    if (state.runtime) return state.runtime;
    let requireModule = window.__qmtuiWebpack;
    if (!requireModule) {
      const chunkId = 910000 + Math.floor(Math.random() * 80000);
      window.webpackChunkqqmusic = window.webpackChunkqqmusic || [];
      window.webpackChunkqqmusic.push([
        [chunkId],
        {},
        (runtime) => {
          requireModule = runtime;
        },
      ]);
      window.__qmtuiWebpack = requireModule;
    }
    if (!requireModule) return null;
    state.runtime = {
      require: requireModule,
      React: requireModule(67294),
      ReactDOM: requireModule(73935),
      history: requireModule(1642).Z,
      store: requireModule(49068),
      login: requireModule(68010).Z,
      events: requireModule(67224).Z,
      dialog: requireModule(7273).ZP,
      confirm: requireModule(7273).iG,
      SongList: requireModule(57224).J,
      PlaylistList: requireModule(22865).Z,
      AlbumList: requireModule(70025).Z,
      // 原生歌曲右键菜单（recovered context_menu）：A=showMenu(ev, extraData, config)
      showSongMenu: requireModule(77365).A,
    };
    patchOriginalAccountActions();
    return state.runtime;
  }

  const attach = (logicalPlayer) =>
    attachPlayer(logicalPlayer, { applyState, showToast, toggleFavorite });

  function emitProgress(position, duration) {
    if (!state.player) return;
    const safePosition = Math.max(0, Number(position) || 0);
    const safeDuration = Math.max(0, Number(duration) || 0);
    state.player.trigger('timeupdate', {
      timeStamp: safePosition,
      duration: safeDuration,
      buffered: safePosition,
      song: state.player.currentSong,
    });
  }

  function startProgressTicker() {
    if (state.progressTicker) return;
    state.progressTicker = window.setInterval(() => {
      if (!state.remote) return;
      const elapsed = state.remote.isPlaying
        ? Math.max(0, (performance.now() - state.progressAnchorTime) / 1000)
        : 0;
      emitProgress(
        state.progressAnchorPosition + elapsed,
        state.currentDuration || state.remote.duration
      );
    }, 250);
  }

  function updateRouteLayout() {
    // ?raw=1 时保留原生布局（见 route-controller 里的逃生舱）
    if (new URLSearchParams(state.runtime?.history?.location?.search || '').has('raw')) return;
    const route = document.querySelector('.route_cont');
    const host = document.getElementById('qmtui-route-host');
    if (!route || !host) return;
    route.classList.add('qmtui-route-active');
  }

  async function toggleFavorite() {
    if (state.favoriteBusy || !state.remote?.song) return;
    state.favoriteBusy = true;
    state.pendingFavoriteState = !state.remote.isFavorite;
    clearTimeout(state.favoriteResultTimer);
    state.favoriteResultTimer = setTimeout(() => {
      if (state.pendingFavoriteState !== null) {
        state.pendingFavoriteState = null;
        state.favoriteBusy = false;
        showToast('喜欢操作超时', true);
      }
    }, 12000);
    try {
      await post('/api/favorite');
    } catch (error) {
      clearTimeout(state.favoriteResultTimer);
      state.pendingFavoriteState = null;
      state.favoriteBusy = false;
      showToast(error.message, true);
    }
  }

  function applyState(remote) {
    if (remote.type === 'favorites_synced') {
      // 后端全量预热完成：此前收藏集合接口一直回 503，这里立刻补拉一次。
      ensureFavoriteKeys(true);
    }
    // 当前歌曲的收藏态变化时同步键集合并就地刷新可见列表的心形。
    const favoriteSignature = `${keyOf(remote.song)}:${Boolean(remote.isFavorite)}`;
    if (favoriteSignature !== state.lastFavoriteSignature) {
      state.lastFavoriteSignature = favoriteSignature;
      syncFavoriteKey(remote.song, Boolean(remote.isFavorite));
      refreshLoveMarks();
    }
    if (state.pendingFavoriteState !== null && remote.type === 'favorite_result') {
      if (Boolean(remote.isFavorite) === state.pendingFavoriteState) {
        showToast(remote.isFavorite ? '已添加到我喜欢' : '已取消喜欢');
        refreshLibrary();
      } else {
        showToast(remote.isFavorite ? '取消喜欢失败' : '添加喜欢失败', true);
      }
      state.pendingFavoriteState = null;
      clearTimeout(state.favoriteResultTimer);
      state.favoriteBusy = false;
    }
    state.remote = remote;
    document.documentElement.dataset.qmtuiBridge = 'connected';
    renderAccount(remote.account);
    const qualityName = remote.qualityBadge || '标准';
    if (window.__CURRENT_PLAYING_QUALITY__ !== qualityName) {
      window.__CURRENT_PLAYING_QUALITY__ = qualityName;
      window.dispatchEvent(new CustomEvent('qqmusic_quality_change', { detail: qualityName }));
    }
    const qualityKeys = Object.values(qualityTierToKey);
    const availableTiers = Array.isArray(remote.availableQualityTiers)
      ? new Set(remote.availableQualityTiers.map(Number))
      : null;
    const preferredKey = qualityTierToKey[Number(remote.preferredQualityTier)] || '128k';
    const preferredIndex = qualityKeys.indexOf(preferredKey);
    const qualities = qualityKeys.map((key, index) => ({
      key,
      isAvailable: availableTiers
        ? availableTiers.has(qualityKeyToTier[key])
        : index >= preferredIndex,
    }));
    const qualitySignature = qualities.map((item) => (item.isAvailable ? item.key : '')).join('|');
    if (qualitySignature !== state.lastQualitySignature) {
      state.lastQualitySignature = qualitySignature;
      window.dispatchEvent(new CustomEvent('qqmusic_qualities_probed', { detail: { qualities } }));
    }
    if (!state.player) return;
    state.applying = true;
    try {
      const songKey = keyOf(remote.song);
      const duration = Math.max(0, Number(remote.duration || remote.song?.duration) || 0);
      const lyricSignature = (remote.lyrics || [])
        .map((line) => `${Number(line.timeMs) || 0}:${line.text || ''}:${line.trans || ''}`)
        .join('\n');
      let metadataChanged = false;
      if (remote.song && songKey) {
        const song = toQqSong(
          {
            ...remote.song,
            duration,
            lyrics: remote.lyrics || [],
          },
          Boolean(remote.isFavorite)
        );
        song.qmtuiLyrics = (remote.lyrics || []).map((line) => ({
          time: Number(line.timeMs) || 0,
          context: line.text || '',
          trans: line.trans || '',
        }));
        metadataChanged =
          songKey !== state.currentSongKey ||
          duration !== state.currentDuration ||
          lyricSignature !== state.currentLyricSignature ||
          state.player.currentSong?.like !== song.like;
        state.currentSongKey = songKey;
        state.currentDuration = duration;
        state.currentLyricSignature = lyricSignature;

        const queueKey = (remote.songList || []).map((s) => keyOf(s)).join('|');
        const queueChanged = queueKey !== state.currentQueueKey;
        if (metadataChanged || queueChanged) {
          state.currentQueueKey = queueKey;
          state.player.currentSong = song;
          const queue = (remote.songList || []).length
            ? remote.songList.map((s) =>
                keyOf(s) === songKey
                  ? song
                  : toQqSong({ ...s, duration: Number(s.duration) || 0 }, false)
              )
            : [song];
          state.player.songList = queue;
          state.player.playList = queue;
          state.player.index = Number.isInteger(remote.currentIndex)
            ? remote.currentIndex
            : queue.findIndex((s) => s.mid === song.mid);
          if (state.player.index < 0) state.player.index = 0;
          // Native queue panel reads PlayingStore, whose songList only updates
          // on PLAYING events (PAUSED carries no list). Sync it directly so the
          // full queue renders even while paused.
          const store = state.runtime?.store;
          if (store && typeof store.JG === 'function') {
            store.JG('PlayingStore', {
              songOnPlaying: remote.isPlaying ? song : null,
              songOnPause: remote.isPlaying ? null : song,
              songList: queue,
            });
          }
        }
      }
      const mode = modeToQq[remote.mode];
      if (mode && state.player.mode !== mode) state.player.__qmtuiOriginal.setMode(mode);
      const volume = Math.max(0, Math.min(1, (Number(remote.volume) || 0) / 100));
      if (state.player.audio) state.player.audio.volume = volume;
      if (Number(remote.volume) > 0) state.lastAudibleVolume = Number(remote.volume);
      if (state.lastVolume !== volume) {
        state.lastVolume = volume;
        state.player.trigger('VOLUME_CHANGE', volume);
      }
      const position = Math.max(0, Number(remote.position) || 0);
      state.progressAnchorPosition = position;
      state.progressAnchorTime = performance.now();
      state.remote = remote;
      if (state.player.audio && Math.abs((state.player.audio.currentTime || 0) - position) > 0.35) {
        try {
          state.player.audio.currentTime = position;
        } catch {}
      }
      const playbackState = remote.isPlaying ? 'play' : 'pause';
      const playbackChanged = state.lastPlaybackState !== playbackState;
      state.lastPlaybackState = playbackState;
      if (metadataChanged || playbackChanged) {
        state.player.setState(playbackState, {
          song: state.player.currentSong,
          songList: state.player.songList || [],
        });
      }
      if (
        metadataChanged ||
        state.lastPosition === null ||
        Math.abs(state.lastPosition - position) > 0.05
      ) {
        state.lastPosition = position;
        state.player.trigger('timeupdate', {
          timeStamp: position,
          duration,
          buffered: position,
          song: state.player.currentSong,
        });
      }
    } finally {
      state.applying = false;
    }
  }

  function connect() {
    state.source?.close();
    const scheme = location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${scheme}://${location.host}/api/ws`);
    state.source = socket;
    socket.onmessage = (event) => {
      try {
        applyState(JSON.parse(event.data));
      } catch {}
    };
    socket.onopen = () => {
      state.reconnectDelay = 1000;
      document.documentElement.dataset.qmtuiBridge = 'connected';
      // Re-assert the authoritative account on (re)connect: the UserInfo
      // component may have re-mounted while the socket was down, resetting its
      // display state that only renderAccount restores.
      api('/api/account')
        .then(renderAccount)
        .catch(() => {});
    };
    socket.onclose = () => {
      document.documentElement.dataset.qmtuiBridge = 'disconnected';
      clearTimeout(state.reconnectTimer);
      // 远端/反代链路常会静默断开，退避重连避免频繁握手打爆上游。
      state.reconnectDelay = Math.min(state.reconnectDelay * 2, 15000);
      state.reconnectTimer = setTimeout(connect, state.reconnectDelay);
    };
    socket.onerror = () => socket.close();
  }

  function findReactInstance(root, name) {
    const key = Object.keys(root || {}).find(
      (value) => value.startsWith('__reactInternalInstance$') || value.startsWith('__reactFiber$')
    );
    let fiber = key ? root[key] : null;
    const queue = fiber ? [fiber] : [];
    const seen = new Set();
    while (queue.length) {
      fiber = queue.shift();
      if (!fiber || seen.has(fiber)) continue;
      seen.add(fiber);
      if (fiber.type?.name === name && fiber.stateNode) return fiber.stateNode;
      if (fiber.child) queue.push(fiber.child);
      if (fiber.sibling) queue.push(fiber.sibling);
    }
    return null;
  }

  function patchOriginalAccountActions() {
    const runtime = state.runtime;
    if (!runtime || runtime.login.__qmtuiPatched) return;
    runtime.login.__qmtuiPatched = true;
    runtime.login.loginMiniportal = showLoginDialog;
    runtime.login.reset = () => {
      post('/api/logout')
        .then(() => renderAccount({ loggedIn: false }))
        .catch(() => renderAccount({ loggedIn: false }));
    };
    // The recovered bundle drops the whole login UI on `loginStatus:false`:
    // UserInfo resets its display to "点击登录", and Main clears the sidebar
    // playlists and navigates to /musicroom. qmtui owns the session, so while
    // the authoritative account is still logged in, suppress that stale
    // "logged out" signal. Real logout flows through login.reset above, which
    // never emits loginStatus.
    const events = runtime.events;
    const originalEmit = events.emit.bind(events);
    events.emit = (name, ...args) => {
      if (name === 'loginStatus' && !args[0] && state.account?.loggedIn) {
        return true;
      }
      return originalEmit(name, ...args);
    };
  }

  function renderAccount(account) {
    if (!account) return;
    state.account = account;
    const runtime = getRuntime();
    if (!runtime) return;
    const accountKey = account.loggedIn
      ? `${account.uin}:${account.nick}:${account.avatarUrl}`
      : 'logged-out';
    runtime.login.loginData = {
      ...runtime.login.loginData,
      accountType: account.loggedIn ? 'QQ' : 'unknown',
      musicId: account.loggedIn ? String(account.uin || '') : '',
      musicKey: account.loggedIn ? 'qmtui-local-session' : '',
    };
    const userInfo = findReactInstance(document.querySelector('.top_cont_user'), 'UserInfo');
    if (userInfo) {
      userInfo.switchAccount = () => {
        post('/api/logout')
          .then(() => {
            renderAccount({ loggedIn: false });
            showLoginDialog();
          })
          .catch((error) => showToast(error.message, true));
      };
      userInfo.loginout = userInfo.switchAccount;
      userInfo.setState({
        isLogin: Boolean(account.loggedIn),
        name: account.loggedIn ? account.nick || account.uin || 'QQ音乐用户' : '',
        avatar: account.loggedIn ? account.avatarUrl || '' : '',
        vipInfo: account.loggedIn
          ? {
              iVipFlag: account.isVip ? 1 : 0,
              iSuperVip: account.isVip ? 1 : 0,
              iCurLevel: Number(account.vipLevel) || 0,
              vip: account.isVip ? 1 : 0,
              ieight: 0,
            }
          : null,
      });
    }
    if (state.accountKey === accountKey) return;
    state.accountKey = accountKey;
    // Keep the legacy bundle logged out internally. Its login listener performs direct QQ
    // requests; qmtui owns credentials and populates the stores below instead.
    runtime.store.JG('uin', null);
    if (account.loggedIn) refreshLibrary();
    else {
      runtime.store.JG('CollectSingleSongs', []);
      runtime.store.JG('collectAlbumList', []);
      runtime.store.JG('SelfCreatePlayList', []);
      runtime.store.JG('SelfFavPlayList', []);
    }
  }

  function showLoginDialog() {
    const runtime = getRuntime();
    if (!runtime) return;
    clearTimeout(state.loginPoll);
    const { React, dialog } = runtime;

    function LoginContent() {
      const [qr, setQr] = React.useState(null);
      const [message, setMessage] = React.useState('选择扫码方式，或使用 Cookie 登录');
      const [cookie, setCookie] = React.useState('');
      const [busy, setBusy] = React.useState(false);
      const [method, setMethod] = React.useState('qq');

      const poll = () => {
        clearTimeout(state.loginPoll);
        state.loginPoll = setTimeout(async () => {
          try {
            const result = await api('/api/login/status');
            setMessage(result.message || '等待扫码');
            if (result.account?.loggedIn || result.event === 'done') {
              renderAccount(result.account);
              dialog.hide();
              showToast('登录成功');
              return;
            }
            if (['expired', 'refused', 'error'].includes(result.event)) return;
          } catch {}
          poll();
        }, 1200);
      };

      const startQr = async (type) => {
        setMethod(type);
        setQr(null);
        setBusy(true);
        setMessage('正在获取二维码…');
        try {
          const result = await post('/api/login/start', { type });
          setQr(`data:${result.mimeType};base64,${result.imageBase64}`);
          setMessage(result.message || '请使用手机扫码');
          poll();
        } catch (error) {
          setMessage(error.message);
        } finally {
          setBusy(false);
        }
      };

      const cookieLogin = async () => {
        if (!cookie.trim()) return;
        setBusy(true);
        try {
          const result = await post('/api/login/cookie', { cookie });
          renderAccount(result.account);
          dialog.hide();
          showToast('登录成功');
        } catch (error) {
          setMessage(error.message);
        } finally {
          setBusy(false);
        }
      };

      const methods = [
        ['qq', 'QQ 扫码'],
        ['wechat', '微信扫码'],
        ['app', 'QQ音乐 APP'],
        ['cookie', 'Cookie'],
      ];
      return React.createElement(
        'div',
        { className: 'qmtui-login-body' },
        React.createElement(
          'div',
          { className: 'qmtui-login-methods', role: 'tablist' },
          methods.map(([type, label]) =>
            React.createElement(
              'button',
              {
                'aria-selected': method === type,
                className: `qmtui-login-tab${method === type ? ' active' : ''}`,
                disabled: busy,
                key: type,
                onClick: () => {
                  clearTimeout(state.loginPoll);
                  setMethod(type);
                  setQr(null);
                  setMessage(type === 'cookie' ? '粘贴 Cookie 后登录' : `点击获取${label}二维码`);
                },
                role: 'tab',
              },
              label
            )
          )
        ),
        method === 'cookie'
          ? React.createElement(
              'div',
              { className: 'qmtui-login-panel qmtui-login-cookie', role: 'tabpanel' },
              React.createElement('textarea', {
                className: 'qmtui-native-input c_btn',
                rows: 5,
                placeholder: '粘贴 QQ 音乐 Cookie（只提交到本机 QmTui）',
                value: cookie,
                onChange: (event) => setCookie(event.target.value),
              }),
              React.createElement(
                'button',
                {
                  className: 'mod_btn c_btn_skin qmtui-login-submit',
                  disabled: busy || !cookie.trim(),
                  onClick: cookieLogin,
                },
                React.createElement('span', { className: 'btn__txt' }, '登录')
              )
            )
          : React.createElement(
              'div',
              { className: 'qmtui-login-panel qmtui-login-scan', role: 'tabpanel' },
              qr
                ? React.createElement('img', {
                    className: 'qmtui-login-qr',
                    src: qr,
                    alt: '登录二维码',
                  })
                : React.createElement(
                    'button',
                    {
                      className: 'qmtui-login-placeholder c_btn',
                      disabled: busy,
                      onClick: () => startQr(method),
                    },
                    busy ? '正在获取二维码…' : '获取二维码'
                  ),
              React.createElement('p', { className: 'qmtui-login-status c_tx_thin' }, message)
            )
      );
    }

    dialog.show({
      mode: 'custom',
      title: '登录 QQ 音乐',
      width: 500,
      component: React.createElement(LoginContent),
    });
  }

  function showCreatePlaylistDialog() {
    const runtime = getRuntime();
    if (!runtime) return;
    const { React, dialog } = runtime;

    function CreatePlaylistContent() {
      const [name, setName] = React.useState('');
      const [busy, setBusy] = React.useState(false);
      const create = async () => {
        if (!name.trim()) return;
        setBusy(true);
        try {
          await post('/api/library/playlist/create', { name });
          dialog.hide();
          showToast('歌单创建成功');
          refreshLibrary();
        } catch (error) {
          showToast(error.message, true);
          setBusy(false);
        }
      };
      return React.createElement(
        'div',
        { className: 'qmtui-create-playlist' },
        React.createElement('input', {
          autoFocus: true,
          className: 'qmtui-native-input c_btn',
          placeholder: '歌单名称',
          value: name,
          onChange: (event) => setName(event.target.value),
          onKeyDown: (event) => event.key === 'Enter' && create(),
        }),
        React.createElement(
          'button',
          { className: 'mod_btn c_btn_skin', disabled: busy, onClick: create },
          React.createElement('span', { className: 'btn__txt' }, '创建')
        )
      );
    }

    dialog.show({
      mode: 'custom',
      title: '创建歌单',
      width: 420,
      component: React.createElement(CreatePlaylistContent),
    });
  }

  async function refreshLibrary() {
    const runtime = getRuntime();
    if (!runtime || !state.account?.loggedIn) return;
    try {
      const playlistResult = await api('/api/library/playlists');
      const playlists = (playlistResult.playlists || []).map(toNativePlaylist);
      const favorite = playlists.find((item) => item.dirId === 201);
      const [songResult, albumResult] = await Promise.all([
        api('/api/library/favorites/songs'),
        api('/api/library/albums/favorite'),
      ]);
      const likedSongs = (songResult.songs || []).map((song) => toQqSong(song, true));
      const albums = (albumResult.albums || []).map(toNativeAlbum);
      runtime.store.JG('CollectSingleSongs', likedSongs);
      runtime.store.JG('FavoriteSingleSongs', likedSongs);
      runtime.store.JG('collectAlbumList', albums);
      runtime.store.JG(
        'SelfCreatePlayList',
        playlists.filter((item) => !item.isFav)
      );
      runtime.store.JG(
        'SelfFavPlayList',
        playlists.filter((item) => item.isFav)
      );
      if (location.hash.startsWith('#/like')) {
        setTimeout(() => {
          runtime.store.JG('CollectSingleSongs', likedSongs);
          runtime.store.JG('collectAlbumList', albums);
        }, 350);
      }
    } catch (error) {
      if (!/login required/i.test(error.message)) showToast(error.message, true);
    }
  }

  // 原生皮肤（霜茶白/玄潭黑）写在 #js_skin_style 里，我们的自建界面看不到它的类名，
  // 所以把当前皮肤镜像到 :root[data-qmtui-skin]，供 qmtui-bridge.css 取色。
  function watchSkin() {
    const style = document.querySelector('#js_skin_style');
    if (!style) {
      setTimeout(watchSkin, 300);
      return;
    }
    const apply = () => {
      const css = style.textContent || '';
      const light = css.includes('#f8f9fc') && !css.includes('#1e2028');
      document.documentElement.dataset.qmtuiSkin = light ? 'light' : 'dark';
    };
    apply();
    new MutationObserver(apply).observe(style, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  function showToast(message, error = false) {
    document.querySelector('.qmtui-toast')?.remove();
    const node = document.createElement('div');
    node.className = `qmtui-toast${error ? ' error' : ''}`;
    node.textContent = message;
    document.body.append(node);
    setTimeout(() => node.remove(), 2600);
  }

  function clearRouteHost() {
    const host = document.getElementById('qmtui-route-host');
    if (host) {
      try {
        state.runtime?.ReactDOM.unmountComponentAtNode(host);
      } catch {}
      host.remove();
    }
    document.querySelector('.route_cont')?.classList.remove('qmtui-route-active');
    for (const node of document.querySelectorAll('.qmtui-search-active')) {
      node.classList.remove('qmtui-search-active');
    }
    for (const node of document.querySelectorAll('.shadow_window')) node.remove();
  }

  function visibleRouteWrap() {
    return document.querySelector('.route_cont');
  }

  function createRouteHost(search = false) {
    clearRouteHost();
    const wrap = visibleRouteWrap();
    if (!wrap) return null;
    const host = document.createElement('div');
    host.id = 'qmtui-route-host';
    if (search) {
      wrap.classList.add('qmtui-search-active');
      host.className = 'qmtui-search-results';
    } else {
      host.className = 'qmtui-native-route inner__content column_flex';
    }
    wrap.append(host);
    updateRouteLayout();
    return host;
  }
  function clearRenderedContent(host) {
    const runtime = getRuntime();
    if (runtime && host.hasChildNodes()) {
      try {
        runtime.ReactDOM.unmountComponentAtNode(host);
      } catch {}
    }
    host.replaceChildren();
  }

  function renderReact(host, element) {
    const runtime = getRuntime();
    if (!runtime || !host) return;
    runtime.ReactDOM.render(element, host);
  }

  // 服务端返回的 total 与本地已列出条数可能相差几首“无音频”占位条目（mid 为空、无音频档，
  // 服务端列得出来但我们播不了），文案里如实说明，避免看起来像少了几首。
  function songsCountText(total, loaded, hasMore, suffix = '首歌曲') {
    if (total <= 0) return `${loaded}${hasMore ? '+' : ''} ${suffix}`;
    if (hasMore) return `共 ${total} ${suffix}（已载入 ${loaded} 首）`;
    const missing = total - loaded;
    return missing > 0
      ? `共 ${total} ${suffix}（其中 ${missing} 首无音频，暂不可播放）`
      : `共 ${total} ${suffix}`;
  }

  function renderSongList(host, songs, options = {}) {
    const runtime = getRuntime();
    if (!runtime) return;
    const nativeSongs = songs.map((song) =>
      song.qmtuiRemote ? song : toQqSong(song, options.liked)
    );
    const wrapper = { current: host };
    renderReact(
      host,
      runtime.React.createElement(runtime.SongList, {
        wrapper,
        songList: nativeSongs,
        config: {
          header: true,
          songname: true,
          singer: true,
          album: true,
          time: true,
          quality: true,
          eventActive: false,
          isVirtualize: false,
          isPlayAll: true,
        },
      })
    );
    setTimeout(() => {
      bindSongRows(host, nativeSongs, options);
      state.lastList = { host, songs: nativeSongs };
      refreshLoveMarks();
    }, 0);
  }

  function bindSongRows(host, songs, options) {
    const rows = [...host.querySelectorAll('.songlist__item')];
    rows.forEach((row, index) => {
      const song = songs[index];
      if (!song) return;
      const play = () => playSong(song, songs);
      row.ondblclick = play;
      const playButton = row.querySelector('.songname_menu__play');
      if (playButton) playButton.onclick = play;
      // 原生按 singer[] 顺序渲染每个歌手名 anchor，故下标一一对应，可精确取到 mid。
      const authorLinks = [...row.querySelectorAll('.songlist__author a')];
      authorLinks.forEach((authorLink, singerIndex) => {
        authorLink.classList.add('qmtui-singer-link');
        authorLink.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
          const list = Array.isArray(song.singer) ? song.singer : [];
          const entry = list[singerIndex];
          const label = (authorLink.getAttribute('title') || authorLink.textContent || '').trim();
          const mid = entry?.mid || '';
          const name = (entry?.name || label.split('/')[0] || '').trim();
          if (!mid && !name) return;
          const target = mid
            ? `mid=${encodeURIComponent(mid)}`
            : `name=${encodeURIComponent(name)}`;
          getRuntime()?.history.push(`/singer_detail?${target}`);
        };
      });
      const addButton = row.querySelector('.songname_menu__add');
      if (addButton) addButton.onclick = () => openSongContextMenu({}, song, songs, index, options);
      // 行内 ⋯ 入口（与播放栏同款图标）：点开原生菜单。桌面也可直接右键；触屏/发现性靠这个。
      const menuHost =
        row.querySelector('.songlist_name__icon') || row.querySelector('.songlist__songname');
      if (menuHost) {
        const more = document.createElement('a');
        more.className = 'qmtui-row-menu';
        more.title = '更多操作';
        more.setAttribute('role', 'button');
        more.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
          openSongContextMenu(event, song, songs, index, options);
        };
        menuHost.append(more);
      }
      row.oncontextmenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        openSongContextMenu(event, song, songs, index, options);
      };
    });
  }

  // 桌面端 QQ 音乐（以及我们绑定的行）靠双击播放，触屏上双击很别扭。
  // 触屏上把单击合成为一次 dblclick：我们绑的 ondblclick 与原生 SongList 的
  // onDoubleClick 都会收到，于是单击即播放。行内控件（播放钮/歌手/收藏/更多）自己
  // 有点击语义，不参与合成。
  function enableTapToPlay() {
    if (!window.matchMedia) return;
    const touchLike =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      'ontouchstart' in window;
    if (!touchLike) return;
    const INNER_CONTROL =
      'a, button, input, select, textarea, [class*="menu"], [class*="oper"], [class*="icon"], [class*="btn"]';
    let lastRow = null;
    let lastAt = 0;
    document.addEventListener(
      'click',
      (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const row = target?.closest('.songlist__item');
        if (!row || target.closest(INNER_CONTROL)) return;
        const now = Date.now();
        // 触屏双击时浏览器还会补一次原生 dblclick，去重避免同一行重复起播
        if (row === lastRow && now - lastAt < 700) return;
        lastRow = row;
        lastAt = now;
        row.dispatchEvent(
          new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window, detail: 2 })
        );
      },
      true
    );
  }

  async function playSong(song, songs) {
    try {
      await post('/api/library/play', {
        song: mapSong(song),
        context: songs.map(mapSong),
      });
      showToast(`开始播放：${song.title || song.name}`);
    } catch (error) {
      showToast(error.message, true);
    }
  }

  // 复用原生歌曲右键菜单（recovered context_menu.showMenu）。菜单项全部是原生实现：
  //  播放 → 原生 player.playAll；查看评论 → jump(PAGE_TYPE.SONG)；
  //  添加到 → addPlaylistMenu 读 store.SelfCreatePlayList，落库走 ufetch(addSongsToPlayList)
  //          → 后端 /api/browser/ufetch；下载 → ipc('download-song-file') → /api/download；
  //  删除 → deleteSongsInPlayList → ufetch → 后端；复制信息/分享 → 剪贴板。
  // 传整个列表 + 行下标，让「播放」按原生语义播放整列；songOnSelected 只放当前首，使完整菜单项展开。
  // 可写入的自建歌单：排除特殊集合「我喜欢」(201)、「最近播放」(202) 与外部收藏歌单。
  function isWritablePlaylist(playlist) {
    if (!playlist) return false;
    const dirId = Number(playlist.dirId) || 0;
    return dirId > 0 && dirId !== 201 && dirId !== 202 && !playlist.isFav;
  }

  // 在原生右键菜单里追加队列两项。DiyMenu 直接用 setState({menuContentData}) 渲染，
  // 所以跟着往 state 追加即可被原生样式渲染并扛住后续 re-render（直接插 DOM 会被冲掉）。
  function appendQueueMenuItems(song) {
    const runtime = getRuntime();
    const menu = runtime?.require?.(90658)?.current;
    const current = menu?.state?.menuContentData;
    if (!menu?.setState || !Array.isArray(current) || current.some((item) => item?.qmtuiQueueItem))
      return;

    const queueAction = (next) => () =>
      post('/api/queue/add', { song: mapSong(song), next })
        .then(() => showToast(next ? '已设为下一首播放' : '已加入播放队列'))
        .catch((error) => showToast(error.message, true));

    menu.setState({
      menuContentData: [
        ...current,
        {
          text: '下一首播放',
          iconClass: 'operate_menu__icon_play',
          fn: queueAction(true),
          qmtuiQueueItem: true,
        },
        {
          text: '添加到播放队列',
          iconClass: 'operate_menu__icon_add',
          fn: queueAction(false),
          qmtuiQueueItem: true,
        },
      ],
    });
  }

  function openSongContextMenu(event, song, songs, index, options = {}) {
    const runtime = getRuntime();
    if (!runtime?.showSongMenu) return;
    const playlist = options.playlist;
    // 「删除」只在可写入的自建歌单出现。
    const removable = isWritablePlaylist(playlist);
    try {
      runtime.showSongMenu(
        event,
        {
          songList: Array.isArray(songs) && songs.length ? songs : [song],
          songOnSelected: [song],
          index: Number.isInteger(index) ? index : 0,
          playListDetail: removable ? { dirid: Number(playlist.dirId) } : null,
          eventListener: {
            onDelete: () => options.onRemove?.(),
          },
        },
        { showDelete: Boolean(removable) }
      );
      appendQueueMenuItems(song);
    } catch (error) {
      showToast(error.message, true);
    }
  }

  function detailHeader({
    image,
    title,
    subtitle,
    subtitleHtml,
    playAll,
    favorite,
    unfavorite,
    follow,
    unfollow,
  }) {
    return `
      <div class="mod_detail album">
        <div class="detail__inner">
          <div class="detail__cover"><img src="${escapeHtml(image)}" alt="" class="detail__cover_pic"></div>
          <div class="detail__info">
            <h1 class="detail__title c_tx_normal">${escapeHtml(title)}</h1>
            <div class="mod_detail_about c_tx_thin"><div class="detail__para">${subtitleHtml || escapeHtml(subtitle || '')}</div></div>
            <div class="mod_detail_operation qmtui-detail-actions">
              <a class="mod_btn c_btn_skin" data-detail-action="play"><span class="btn__cover"></span><span class="btn__txt">播放全部</span></a>
              ${favorite ? '<a class="mod_btn c_btn" data-detail-action="favorite"><span class="btn__cover"></span><span class="btn__txt">收藏</span></a>' : ''}
              ${unfavorite ? '<a class="mod_btn c_btn" data-detail-action="unfavorite"><span class="btn__cover"></span><span class="btn__txt">取消收藏</span></a>' : ''}
              ${follow ? '<a class="mod_btn c_btn" data-detail-action="follow"><span class="btn__cover"></span><span class="btn__txt">关注</span></a>' : ''}
              ${unfollow ? '<a class="mod_btn c_btn" data-detail-action="unfollow"><span class="btn__cover"></span><span class="btn__txt">已关注</span></a>' : ''}
            </div>
          </div>
        </div>
      </div>`;
  }

  function detailTabs(songHref, commentHref, commentsActive) {
    return `<nav class="mod_tab mod_normal_nav"><div class="layout_cont">
      <a class="tab__item c_tx_normal ${commentsActive ? '' : 'c_tx_current'}" href="${escapeHtml(songHref)}"><span class="tab__label">歌曲</span></a>
      <a class="tab__item c_tx_normal ${commentsActive ? 'c_tx_current' : ''}" href="${escapeHtml(commentHref)}"><span class="tab__label">评论</span></a>
    </div></nav>`;
  }

  async function renderPlaylistRoute(playlist) {
    const token = ++state.routeToken;
    const host = createRouteHost();
    if (!host) return;
    host.innerHTML = '<div class="qmtui-loading">正在加载歌单…</div>';

    const id = playlist.tid || playlist.id || playlist.dirId;
    const dirId = Number(playlist.dirId) || 0;
    const commentsActive = location.hash.includes('/comment');

    const fetchPage = async (page) => {
      const result = await api(
        `/api/library/playlist?${query({
          dirId: playlist.dirId,
          tid: playlist.tid,
          isFav: playlist.isFav,
          name: playlist.name,
          page,
        })}`
      );
      return token === state.routeToken ? result : null;
    };

    try {
      const first = await fetchPage(1);
      if (!first) return;
      const songsState = {
        items: first.songs || [],
        page: 1,
        hasMore: !!first.hasMore,
        total: Number(first.total) || 0,
        loading: false,
      };

      // playlist.isFav 语义重载：/api/library/playlists 里 true=外部收藏歌单、false=自建歌单，
      // 而搜索结果一律置 true。故“可收藏”只排除「我喜欢」与自建歌单，其余以 IsPlaylistFan 实测为准。
      const canFavorite = Number(id) > 0 && dirId !== 201 && !(dirId > 0 && !playlist.isFav);
      const favoriteState = canFavorite
        ? await api(`/api/library/playlist/favorite?tid=${encodeURIComponent(id)}`)
        : { isFavorite: false };
      if (token !== state.routeToken) return;
      const isFavorite = Boolean(favoriteState.isFavorite);

      const headerHtml = (fav) =>
        detailHeader({
          image: playlist.picUrl || playlist.picurl || songCover(songsState.items[0]),
          title: playlist.name,
          subtitle: songsCountText(songsState.total, songsState.items.length, songsState.hasMore),
          playAll: true,
          favorite: canFavorite && !fav,
          unfavorite: canFavorite && fav,
        });

      host.innerHTML = `<div class="layout_detail column_flex playlist_detail">
        ${headerHtml(isFavorite)}
        ${detailTabs(`#/playlist_detail/${id}`, `#/playlist_detail/${id}/comment`, commentsActive)}
        <div class="main_cont song" id="qmtui-detail-body"></div>
      </div>`;
      const body = host.querySelector('#qmtui-detail-body');

      const renderList = () => {
        clearRenderedContent(body);
        if (!songsState.items.length) {
          body.innerHTML = '<div class="qmtui-empty">歌单里没有歌曲</div>';
          return;
        }
        // options.playlist 使右键菜单给出原生「删除」；onRemove 删除成功后只刷新列表，避免整页重载丢分页。
        renderSongList(body, songsState.items, { playlist, onRemove: reloadSongs });
      };

      // 移除后重新拉第一页：歌单可能因此变短，直接重置分页状态最稳。
      async function reloadSongs() {
        const result = await fetchPage(1);
        if (!result) return;
        songsState.items = result.songs || [];
        songsState.page = 1;
        songsState.hasMore = !!result.hasMore;
        songsState.total = Number(result.total) || songsState.total;
        renderList();
        const header = host.querySelector('.mod_detail.album');
        if (header) header.outerHTML = headerHtml(isFavorite);
        rebindHeader();
      }

      const loadMore = async () => {
        if (songsState.loading || !songsState.hasMore) return;
        songsState.loading = true;
        try {
          const result = await fetchPage(songsState.page + 1);
          if (!result) return;
          songsState.items = songsState.items.concat(result.songs || []);
          songsState.page += 1;
          songsState.hasMore = !!result.hasMore;
          songsState.total = Number(result.total) || songsState.total;
          renderList();
        } catch (error) {
          showToast(error.message, true);
        } finally {
          songsState.loading = false;
        }
      };

      const updateFavorite = async (favorite) => {
        await post('/api/library/playlist/favorite', { tid: Number(id), favorite });
        showToast(favorite ? '歌单已收藏' : '已取消收藏');
        await refreshLibrary();
        renderPlaylistRoute(playlist);
      };

      function rebindHeader() {
        const playButton = host.querySelector('[data-detail-action="play"]');
        if (playButton)
          playButton.onclick = () => {
            if (songsState.items.length) playSong(songsState.items[0], songsState.items);
          };
        const favoriteButton = host.querySelector('[data-detail-action="favorite"]');
        const unfavoriteButton = host.querySelector('[data-detail-action="unfavorite"]');
        if (favoriteButton)
          favoriteButton.onclick = () =>
            updateFavorite(true).catch((error) => showToast(error.message, true));
        if (unfavoriteButton)
          unfavoriteButton.onclick = () =>
            updateFavorite(false).catch((error) => showToast(error.message, true));
      }

      rebindHeader();

      body.addEventListener('scroll', () => {
        if (body.scrollHeight - body.scrollTop - body.clientHeight < 400) loadMore();
      });

      if (commentsActive) renderComments(body, Number(id), 3);
      else renderList();
    } catch (error) {
      host.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
    }
  }

  async function renderAlbumRoute(album) {
    const token = ++state.routeToken;
    const host = createRouteHost();
    if (!host) return;
    host.innerHTML = '<div class="qmtui-loading">正在加载专辑…</div>';
    try {
      const result = await api(`/api/library/album?mid=${encodeURIComponent(album.mid)}`);
      if (token !== state.routeToken) return;
      const detail = result.album;
      const songs = detail.songs || [];
      const commentsActive = location.hash.includes('/comment');
      host.innerHTML = `<div class="layout_detail column_flex playlist_detail">
        ${detailHeader({
          image: albumCover(album),
          title: detail.name,
          subtitleHtml: [
            singerLinks(detail.artist),
            detail.publishDate ? escapeHtml(detail.publishDate) : '',
            detail.company ? escapeHtml(detail.company) : '',
          ]
            .filter(Boolean)
            .join(' · '),
          playAll: true,
          favorite: true,
          unfavorite: true,
        })}
        ${detailTabs(`#/album_detail?mid=${encodeURIComponent(album.mid)}`, `#/album_detail/comment?mid=${encodeURIComponent(album.mid)}`, commentsActive)}
        <div class="main_cont song" id="qmtui-detail-body"></div>
      </div>`;
      host.querySelector('[data-detail-action="play"]').onclick = () => {
        if (songs.length) playSong(songs[0], songs);
      };
      host.querySelector('[data-detail-action="favorite"]').onclick = () =>
        post('/api/library/album/favorite', { albumMid: album.mid })
          .then(() => {
            showToast('专辑已收藏');
            refreshLibrary();
          })
          .catch((error) => showToast(error.message, true));
      host.querySelector('[data-detail-action="unfavorite"]').onclick = () =>
        post('/api/library/album/unfavorite', { albumMid: album.mid })
          .then(() => {
            showToast('已取消收藏');
            refreshLibrary();
          })
          .catch((error) => showToast(error.message, true));
      const body = host.querySelector('#qmtui-detail-body');
      if (commentsActive) renderComments(body, Number(album.id), 2);
      else if (songs.length) renderSongList(body, songs);
      else body.innerHTML = '<div class="qmtui-empty">专辑里没有歌曲</div>';
    } catch (error) {
      host.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
    }
  }

  function singerCover(mid) {
    return mid
      ? `https://y.qq.com/music/photo_new/T001R300x300M000${encodeURIComponent(mid)}.jpg?max_age=2592000`
      : '';
  }

  // 把 "A/B" 形态的歌手串渲染为可点击链接（点击由 bindOriginalUi 的委托监听处理）。
  function singerLinks(text) {
    return String(text || '')
      .split('/')
      .map((part) => part.trim())
      .filter(Boolean)
      .map(
        (name) =>
          `<a class="qmtui-singer-link" data-singer-name="${escapeHtml(name)}">${escapeHtml(name)}</a>`
      )
      .join(' / ');
  }

  // 歌手搜索结果没有原生列表组件（recovered 里只有歌单/专辑/歌曲列表），故用卡片网格渲染。
  function renderSingerCards(container, singers) {
    container.innerHTML = `<div class="qmtui-card-grid">${singers
      .map((s) => {
        const cover = s.picUrl || singerCover(s.mid);
        const meta = s.songCount ? `${s.songCount} 首歌` : '';
        return `<div class="qmtui-card" data-singer-mid="${escapeHtml(s.mid || '')}" data-singer-id="${Number(s.id) || 0}">
            <div class="qmtui-card__cover qmtui-card__cover--round"><img src="${escapeHtml(cover)}" alt="" loading="lazy"></div>
            <div class="qmtui-card__title c_tx_normal">${escapeHtml(s.name || '')}</div>
            <div class="qmtui-card__subtitle c_tx_thin">${escapeHtml(meta)}</div>
          </div>`;
      })
      .join('')}</div>`;
    for (const node of container.querySelectorAll('[data-singer-mid]')) {
      node.onclick = () => {
        const mid = node.dataset.singerMid;
        const id = Number(node.dataset.singerId) || 0;
        if (!mid && !id) return;
        const target = mid ? `mid=${encodeURIComponent(mid)}` : `id=${id}`;
        getRuntime()?.history.push(`/singer_detail?${target}`);
      };
    }
  }

  async function renderSingerRoute({ mid, id, name }) {
    const token = ++state.routeToken;
    const host = createRouteHost();
    if (!host) return;
    host.innerHTML = '<div class="qmtui-loading">正在加载歌手…</div>';
    try {
      const detail = await api(`/api/singer/detail?${query({ mid, id, name })}`);
      if (token !== state.routeToken) return;
      const resolvedMid = detail.mid || mid || '';
      const brief = String(detail.brief || '')
        .replace(/\s+/g, ' ')
        .trim();
      const favoriteState = resolvedMid
        ? await api(`/api/singer/favorite?mid=${encodeURIComponent(resolvedMid)}`)
        : { isFavorite: false };
      if (token !== state.routeToken) return;
      let isFollowed = Boolean(favoriteState.isFavorite);

      const headerHtml = (followed) =>
        detailHeader({
          image: singerCover(resolvedMid),
          title: detail.name || '未知歌手',
          subtitle: brief,
          playAll: true,
          follow: !followed,
          unfollow: followed,
        });

      host.innerHTML = `<div class="layout_detail column_flex playlist_detail">
        ${headerHtml(isFollowed)}
        <nav class="mod_tab mod_normal_nav"><div class="layout_cont">
          <a class="tab__item c_tx_normal c_tx_current" data-singer-tab="songs"><span class="tab__label">歌曲</span></a>
          <a class="tab__item c_tx_normal" data-singer-tab="albums"><span class="tab__label">专辑</span></a>
        </div></nav>
        <div class="qmtui-singer-toolbar" id="qmtui-singer-toolbar"></div>
        <div class="main_cont song" id="qmtui-detail-body"></div>
      </div>`;
      const body = host.querySelector('#qmtui-detail-body');

      let activeTab = 'songs';
      const songsState = {
        items: [],
        total: 0,
        order: 1,
        hasMore: true,
        loading: false,
        loaded: false,
      };
      const albumsState = { items: [], hasMore: true, loading: false, loaded: false };

      // 关注歌手：本地集合，与 TUI 的 UserSession.FavoriteSingers 共用同一份持久化数据。
      const toggleFollow = async (favorite) => {
        try {
          await post('/api/singer/favorite', { mid: resolvedMid, favorite });
          isFollowed = favorite;
          host.querySelector('.mod_detail.album').outerHTML = headerHtml(isFollowed);
          bindHeader();
          showToast(favorite ? '已关注该歌手' : '已取消关注');
        } catch (error) {
          showToast(error.message, true);
        }
      };

      function bindHeader() {
        const playButton = host.querySelector('[data-detail-action="play"]');
        if (playButton)
          playButton.onclick = () => {
            if (songsState.items.length) playSong(songsState.items[0], songsState.items);
          };
        const followButton = host.querySelector('[data-detail-action="follow"]');
        const unfollowButton = host.querySelector('[data-detail-action="unfollow"]');
        if (followButton) followButton.onclick = () => toggleFollow(true);
        if (unfollowButton) unfollowButton.onclick = () => toggleFollow(false);
      }

      const renderToolbar = () => {
        const bar = host.querySelector('#qmtui-singer-toolbar');
        if (!bar) return;
        if (activeTab !== 'songs') {
          bar.classList.remove('qmtui-singer-toolbar--active');
          bar.innerHTML = '';
          return;
        }
        const s = songsState;
        bar.classList.add('qmtui-singer-toolbar--active');
        bar.innerHTML = `
          <a class="qmtui-singer-order__item${s.order === 1 ? ' active' : ''}" data-singer-order="1">热门</a>
          <a class="qmtui-singer-order__item${s.order === 0 ? ' active' : ''}" data-singer-order="0">最新</a>
          <span class="qmtui-singer-order__count c_tx_thin">共 ${s.total || 0} 首</span>`;
        for (const node of bar.querySelectorAll('[data-singer-order]')) {
          node.onclick = () => {
            const order = Number(node.dataset.singerOrder);
            if (order === s.order) return;
            s.order = order;
            s.items = [];
            s.total = 0;
            s.hasMore = true;
            s.loaded = false;
            body.scrollTop = 0;
            loadSongs(true);
          };
        }
      };

      const renderSongs = () => {
        const s = songsState;
        clearRenderedContent(body);
        if (!s.loaded) {
          body.innerHTML = '<div class="qmtui-loading">正在加载…</div>';
          return;
        }
        if (!s.items.length) {
          body.innerHTML = '<div class="qmtui-empty">暂无歌曲</div>';
          return;
        }
        renderSongList(body, s.items);
      };

      const loadSongs = async (reset) => {
        const s = songsState;
        if (s.loading || (!reset && !s.hasMore)) return;
        s.loading = true;
        if (reset) renderSongs();
        const begin = reset ? 0 : s.items.length;
        try {
          const result = await api(
            `/api/singer/songs?${query({ mid: resolvedMid, begin, pageSize: 50, order: s.order })}`
          );
          if (token !== state.routeToken) return;
          const page = result.songs || [];
          s.items = reset ? page : s.items.concat(page);
          s.total = Number(result.total) || s.items.length;
          s.hasMore = !!result.hasMore;
          s.loaded = true;
          if (activeTab === 'songs') {
            renderToolbar();
            renderSongs();
          }
        } catch (error) {
          if (token !== state.routeToken) return;
          if (reset || s.items.length === 0) {
            body.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
          } else {
            showToast(error.message, true);
          }
        } finally {
          s.loading = false;
        }
      };

      const renderAlbums = () => {
        clearRenderedContent(body);
        if (albumsState.items.length) {
          renderReact(
            body,
            getRuntime().React.createElement(getRuntime().AlbumList, {
              containerRef: { current: body },
              content: albumsState.items.map(toNativeAlbum),
              config: { singer: true, subtitle: true, name: true, noplay: true },
            })
          );
        } else {
          body.innerHTML = '<div class="qmtui-empty">暂无专辑</div>';
        }
      };

      const loadAlbums = async (reset) => {
        if (albumsState.loading || (!reset && !albumsState.hasMore)) return;
        albumsState.loading = true;
        const begin = reset ? 0 : albumsState.items.length;
        try {
          const result = await api(
            `/api/singer/albums?${query({ mid: resolvedMid, begin, pageSize: 30 })}`
          );
          if (token !== state.routeToken) return;
          const albums = result.albums || [];
          albumsState.items = reset ? albums : albumsState.items.concat(albums);
          albumsState.hasMore = !!result.hasMore;
          albumsState.loaded = true;
          if (activeTab === 'albums') renderAlbums();
        } catch (error) {
          if (token !== state.routeToken) return;
          if (albumsState.items.length === 0) {
            body.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
          } else {
            showToast(error.message, true);
          }
        } finally {
          albumsState.loading = false;
        }
      };

      const tabs = [...host.querySelectorAll('[data-singer-tab]')];
      for (const node of tabs) {
        node.onclick = () => {
          const target = node.dataset.singerTab;
          if (activeTab === target) return;
          activeTab = target;
          for (const n of tabs) n.classList.toggle('c_tx_current', n === node);
          body.scrollTop = 0;
          renderToolbar();
          if (target === 'songs') {
            if (songsState.loaded) renderSongs();
            else loadSongs(true);
          } else if (albumsState.loaded) {
            renderAlbums();
          } else {
            loadAlbums(true);
          }
        };
      }

      body.addEventListener('scroll', () => {
        if (body.scrollHeight - body.scrollTop - body.clientHeight >= 400) return;
        if (activeTab === 'songs') loadSongs(false);
        else loadAlbums(false);
      });

      bindHeader();
      renderToolbar();
      loadSongs(true);
    } catch (error) {
      host.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
    }
  }

  function openSongComments(song) {
    const value = song.qmtuiRemote ? song : toQqSong(song);
    const id = Number(value.id);
    if (!id) {
      showToast('当前歌曲没有可用的评论 ID', true);
      return;
    }
    state.songs.set(String(id), value);
    getRuntime()?.history.push(`/song_detail/comment?id=${id}`);
  }

  function renderSongCommentRoute(song) {
    const host = createRouteHost();
    if (!host) return;
    const id = Number(song.id);
    host.innerHTML = `<div class="layout_detail column_flex playlist_detail">
      ${detailHeader({
        image: songCover(song),
        title: song.title || song.name,
        subtitle: [
          song.artist || song.singer?.map((item) => item.name).join('/'),
          song.album?.name || song.album,
        ]
          .filter(Boolean)
          .join(' · '),
        playAll: true,
      })}
      <nav class="mod_tab mod_normal_nav"><div class="layout_cont"><a class="tab__item c_tx_normal c_tx_current"><span class="tab__label">评论</span></a></div></nav>
      <div class="main_cont song" id="qmtui-detail-body"></div>
    </div>`;
    host.querySelector('[data-detail-action="play"]').onclick = () => playSong(song, [song]);
    renderComments(host.querySelector('#qmtui-detail-body'), id, 1);
  }

  async function renderComments(body, bizId, bizType) {
    if (!bizId) {
      body.innerHTML = '<div class="qmtui-empty">当前内容没有可用的评论 ID</div>';
      return;
    }
    const pageState = { items: [], page: 1, hasMore: true, loading: false, total: 0, cursor: '' };
    body.innerHTML = '<div class="qmtui-loading">正在加载评论…</div>';

    const commentItem = (comment) => `<li class="comment__list_item c_b_normal">
                <div class="comment__avatar"><img src="${escapeHtml(comment.avatar || '')}" alt=""></div>
                <h4 class="comment__title c_tx_current">${escapeHtml(comment.nick || 'QQ音乐用户')}</h4>
                <p class="comment__text c_tx_normal">${escapeHtml(comment.content)}</p>
                <div class="comment__opt c_tx_thin">赞 ${Number(comment.praiseCount) || 0}${comment.isSelf ? ` <a class="qmtui-comment-delete c_tx_current" data-comment-id="${escapeHtml(comment.id)}">删除</a>` : ''}</div>
              </li>`;

    const bindDelete = () => {
      for (const button of body.querySelectorAll('[data-comment-id]')) {
        button.onclick = async () => {
          if (!confirm('确定删除这条评论？')) return;
          try {
            await post('/api/comments/delete', { commentId: button.dataset.commentId });
            showToast('评论已删除');
            renderComments(body, bizId, bizType);
          } catch (error) {
            showToast(error.message, true);
          }
        };
      }
    };

    const renderList = () => {
      const list = body.querySelector('.comment__list');
      if (!list) return;
      list.innerHTML =
        pageState.items.map(commentItem).join('') || '<li class="qmtui-empty">暂无评论</li>';
      bindDelete();
    };

    const renderShell = () => {
      body.innerHTML = `<div class="qmtui-comment-editor">
          <textarea class="qmtui-native-input c_btn" id="qmtui-comment-text" placeholder="写评论"></textarea>
          <a class="mod_btn c_btn_skin" id="qmtui-comment-send"><span class="btn__cover"></span><span class="btn__txt">发布</span></a>
        </div>
        <h3 class="qmtui-comment-title c_tx_normal">评论 ${pageState.total}</h3>
        <div class="mod_comment qmtui-comment-list"><ul class="comment__list"></ul></div>`;
      body.querySelector('#qmtui-comment-send').onclick = async () => {
        const editor = body.querySelector('#qmtui-comment-text');
        if (!editor.value.trim()) return;
        try {
          await post('/api/comments/add', {
            bizId,
            bizType,
            content: editor.value,
            replyCommentId: '',
          });
          showToast('评论成功');
          renderComments(body, bizId, bizType);
        } catch (error) {
          showToast(error.message, true);
        }
      };
      renderList();
    };

    const load = async (reset) => {
      if (pageState.loading || (!reset && !pageState.hasMore)) return;
      pageState.loading = true;
      const targetPage = reset ? 1 : pageState.page + 1;
      try {
        const result = await api(
          `/api/comments?${query({ bizId, bizType, sort: 'hot', page: targetPage, cursor: pageState.cursor })}`
        );
        const raw = result.comments || [];
        pageState.items = reset ? raw : pageState.items.concat(raw);
        pageState.page = targetPage;
        if (result.total) pageState.total = Number(result.total);
        pageState.hasMore = !!result.hasMore && pageState.items.length < pageState.total;
        if (result.cursor) pageState.cursor = result.cursor;
        if (reset) renderShell();
        else renderList();
      } catch (error) {
        if (reset || pageState.items.length === 0) {
          body.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
        } else {
          showToast(error.message, true);
        }
      } finally {
        pageState.loading = false;
      }
    };

    const onScroll = () => {
      if (
        pageState.hasMore &&
        !pageState.loading &&
        body.scrollHeight - body.scrollTop - body.clientHeight < 400
      ) {
        load(false);
      }
    };
    if (body.__qmtuiCommentScroll) body.removeEventListener('scroll', body.__qmtuiCommentScroll);
    body.__qmtuiCommentScroll = onScroll;
    body.addEventListener('scroll', onScroll);

    load(true);
  }

  async function renderSearchRoute(path, search) {
    const token = ++state.routeToken;
    const host = createRouteHost(true);
    if (!host) return;
    const text = new URLSearchParams(search).get('query') || '';
    if (!text) {
      host.innerHTML = '<div class="qmtui-empty">在顶部搜索框输入歌曲、歌手、歌单或专辑</div>';
      return;
    }

    const TABS = [
      { id: 'song', label: '歌曲' },
      { id: 'singer', label: '歌手' },
      { id: 'playlist', label: '歌单' },
      { id: 'album', label: '专辑' },
    ];
    const initial = TABS.some((t) => path.endsWith(`/${t.id}`))
      ? TABS.find((t) => path.endsWith(`/${t.id}`)).id
      : 'song';

    host.innerHTML = `
      <header class="qmtui-search-head">
        <div class="qmtui-search-word">搜索 “${escapeHtml(text)}”</div>
        <div class="qmtui-page__tabs">
          ${TABS.map((t) => `<a class="qmtui-page__tab${t.id === initial ? ' active' : ''}" data-search-tab="${t.id}">${t.label}</a>`).join('')}
        </div>
      </header>
      <div class="qmtui-search-body"><div class="qmtui-loading">正在加载…</div></div>`;

    const body = host.querySelector('.qmtui-search-body');
    const tabState = {};
    for (const t of TABS) {
      tabState[t.id] = { items: [], page: 1, hasMore: true, loading: false, loaded: false };
    }

    const endpointOf = (id) =>
      id === 'song'
        ? '/api/library/search'
        : id === 'singer'
          ? '/api/library/search/singers'
          : id === 'playlist'
            ? '/api/library/search/playlists'
            : '/api/library/search/albums';

    const playPlaylist = async (playlist) => {
      const detail = await api(
        `/api/library/playlist?${query({
          dirId: playlist.dirId,
          tid: playlist.tid,
          isFav: playlist.isFav,
          name: playlist.name,
        })}`
      );
      if (detail.songs?.length) playSong(detail.songs[0], detail.songs);
    };

    function renderItems(id, resetScroll = false) {
      const s = tabState[id];
      clearRenderedContent(body);
      if (!s.loaded) {
        body.innerHTML = '<div class="qmtui-loading">正在加载…</div>';
        return;
      }
      if (s.items.length === 0) {
        body.innerHTML = '<div class="qmtui-empty">没有找到相关内容</div>';
        return;
      }
      if (id === 'song') {
        renderSongList(body, s.items);
      } else if (id === 'singer') {
        renderSingerCards(body, s.items);
      } else if (id === 'playlist') {
        renderReact(
          body,
          getRuntime().React.createElement(getRuntime().PlaylistList, {
            wrapper: { current: body },
            list: s.items.map(toNativePlaylist),
            config: { user: false, delete: false, info: true, listen: false },
            onPlay: playPlaylist,
          })
        );
      } else {
        renderReact(
          body,
          getRuntime().React.createElement(getRuntime().AlbumList, {
            containerRef: { current: body },
            content: s.items.map(toNativeAlbum),
            config: { singer: true, subtitle: true, name: true, noplay: true },
          })
        );
      }
      if (resetScroll) host.scrollTop = 0;
    }

    async function loadPage(id, reset) {
      const s = tabState[id];
      if (s.loading || (!reset && !s.hasMore)) return;
      s.loading = true;
      const targetPage = reset ? 1 : s.page + 1;
      try {
        const result = await api(
          `${endpointOf(id)}?query=${encodeURIComponent(text)}&page=${targetPage}`
        );
        if (token !== state.routeToken) return;
        const raw =
          id === 'song'
            ? result.songs || []
            : id === 'singer'
              ? result.singers || []
              : id === 'playlist'
                ? result.playlists || []
                : result.albums || [];
        s.items = reset ? raw : s.items.concat(raw);
        s.page = targetPage;
        s.hasMore = !!result.hasMore;
        s.loaded = true;
        renderItems(id, reset);
      } catch (error) {
        if (reset || s.items.length === 0) {
          body.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
        } else {
          showToast(error.message, true);
        }
      } finally {
        s.loading = false;
      }
    }

    const tabNodes = [...host.querySelectorAll('[data-search-tab]')];
    let active = initial;
    for (const node of tabNodes) {
      node.onclick = () => {
        const id = node.dataset.searchTab;
        if (active === id) return;
        active = id;
        for (const n of tabNodes) n.classList.toggle('active', n === node);
        if (tabState[active].loaded) renderItems(active, true);
        else loadPage(active, true);
      };
    }

    host.addEventListener('scroll', () => {
      const s = tabState[active];
      if (s.hasMore && !s.loading && host.scrollHeight - host.scrollTop - host.clientHeight < 400) {
        loadPage(active, false);
      }
    });

    loadPage(initial, true);
  }

  function renderPageShell(title, subtitle, tabs = []) {
    const host = createRouteHost();
    if (!host) return null;
    host.innerHTML = `<section class="qmtui-page">
      <header class="qmtui-page__head">
        <h1 class="c_tx_normal">${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="c_tx_thin">${escapeHtml(subtitle)}</p>` : ''}
        ${tabs.length ? `<div class="qmtui-page__tabs">${tabs.map((tab, index) => `<a class="qmtui-page__tab c_tx_normal${index === 0 ? ' active' : ''}" data-page-tab="${index}">${escapeHtml(tab)}</a>`).join('')}</div>` : ''}
      </header>
      <div class="qmtui-page__body" id="qmtui-page-body"><div class="qmtui-loading">正在加载…</div></div>
    </section>`;
    return { host, body: host.querySelector('#qmtui-page-body') };
  }

  function renderPageSongs(body, songs, emptyText, options = {}) {
    if (songs.length) renderSongList(body, songs, options);
    else body.innerHTML = `<div class="qmtui-empty">${escapeHtml(emptyText)}</div>`;
  }

  // 网页模式无法提供的页面：给出明确说明，避免点进去是白屏。
  function renderUnavailablePage(route, reason) {
    const page = renderPageShell('暂不可用', '', []);
    if (!page) return;
    const box = document.createElement('div');
    box.className = 'qmtui-empty qmtui-unavailable';
    box.innerHTML = `<p class="c_tx_normal">/${escapeHtml(route)} 在网页模式下暂不可用</p>
      <p class="c_tx_thin">${escapeHtml(reason)}</p>`;
    page.body.append(box);
  }

  async function renderProfilePage() {
    const token = ++state.routeToken;
    const page = renderPageShell('个人主页', '', []);
    if (!page) return;
    page.body.innerHTML = '<div class="qmtui-loading">正在加载个人资料…</div>';
    try {
      const account = await api('/api/account');
      if (token !== state.routeToken) return;
      if (!account.loggedIn) {
        page.body.innerHTML = '<div class="qmtui-empty">请先登录 QQ 音乐</div>';
        return;
      }
      const avatar = account.avatarUrl || '';
      page.body.innerHTML = `<div class="qmtui-profile">
        <div class="qmtui-profile__avatar">${avatar ? `<img src="${escapeHtml(avatar)}" alt="">` : ''}</div>
        <div class="qmtui-profile__name">${escapeHtml(account.nick || account.uin || 'QQ音乐用户')}</div>
        <div class="qmtui-profile__uin">QQ号：${escapeHtml(account.uin || '')}</div>
        <div class="qmtui-profile__stats">
          <span>音乐等级 <b>${Number(account.musicLevel) || 0}</b></span>
          <span>${account.isVip ? 'VIP会员' : '普通用户'}${account.vipLevel ? ` · ${Number(account.vipLevel)}级` : ''}</span>
        </div>
      </div>`;
    } catch (error) {
      if (token === state.routeToken)
        page.body.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
    }
  }

  // 官方推荐 feed（music.recommend.RecommendFeed）：客户端只在远程页面里调用它，
  // 这里经 /api/browser/ufetch 带会话直接取用。返回 [{title, cards:[{id,title,subtitle,cover}]}]。
  async function fetchRecommendShelves() {
    const uin = String(state.account?.uin || '');
    const target = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
    const result = await post(`/api/browser/ufetch?url=${encodeURIComponent(target)}&method=POST`, {
      comm: { uin, format: 'json', ct: 19, cv: 1, authst: '' },
      req_feed: {
        module: 'music.recommend.RecommendFeed',
        method: 'get_recommend_feed',
        param: { uin, direction: 0, page: 1 },
      },
    });
    // 该接口把字符串字段再 JSON 编码了一层（"\"123\""），这里剥掉。
    const decode = (value) => {
      if (typeof value !== 'string') return value == null ? '' : String(value);
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'string' ? parsed : value;
      } catch {
        return value;
      }
    };
    return (result?.req_feed?.data?.v_shelf || [])
      .map((shelf) => {
        const niche = (shelf.v_niche || [])[0] || {};
        const cards = (niche.v_card || [])
          .map((card) => ({
            id: decode(card.id),
            title: decode(card.title),
            subtitle: decode(card.miscellany?.cnt_content),
            cover: decode(card.cover),
          }))
          .filter((card) => card.id && card.cover);
        return { title: decode(niche.title_content), cards };
      })
      .filter((shelf) => shelf.cards.length > 0);
  }

  async function renderRecommendPage() {
    const token = ++state.routeToken;
    const page = renderPageShell('推荐', '根据你的音乐偏好生成', [
      '为你推荐',
      '每日30首',
      '猜你喜欢',
    ]);
    if (!page) return;

    const loadFeed = async () => {
      clearRenderedContent(page.body);
      page.body.innerHTML = '<div class="qmtui-loading">正在加载推荐…</div>';
      try {
        const shelves = await fetchRecommendShelves();
        if (token !== state.routeToken) return;
        if (!shelves.length) {
          page.body.innerHTML = '<div class="qmtui-empty">暂时没有推荐内容</div>';
          return;
        }
        page.body.innerHTML = '';
        for (const shelf of shelves) {
          const section = document.createElement('section');
          section.className = 'qmtui-recommend-shelf';
          if (shelf.title) {
            const heading = document.createElement('h2');
            heading.className = 'qmtui-recommend-shelf__title c_tx_normal';
            heading.textContent = shelf.title;
            section.append(heading);
          }
          const grid = document.createElement('div');
          grid.className = 'qmtui-card-grid';
          for (const card of shelf.cards) {
            const node = document.createElement('a');
            node.className = 'qmtui-card';
            node.innerHTML = `<div class="qmtui-card__cover"><img src="${escapeHtml(card.cover)}" alt="" loading="lazy"></div>
              <p class="qmtui-card__title c_tx_normal">${escapeHtml(card.title)}</p>
              <p class="qmtui-card__subtitle c_tx_thin">${escapeHtml(card.subtitle)}</p>`;
            node.onclick = (event) => {
              event.preventDefault();
              const target = `/playlist_detail/${encodeURIComponent(card.id)}?name=${encodeURIComponent(card.title)}`;
              getRuntime()?.history.push(target);
            };
            grid.append(node);
          }
          section.append(grid);
          page.body.append(section);
        }
      } catch (error) {
        page.body.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
      }
    };

    const load = async (type) => {
      clearRenderedContent(page.body);
      page.body.innerHTML = '<div class="qmtui-loading">正在加载推荐歌曲…</div>';
      try {
        const result = await api(`/api/library/recommend/${type}`);
        if (token !== state.routeToken) return;
        renderPageSongs(page.body, result.songs || [], '暂时没有推荐歌曲');
      } catch (error) {
        page.body.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
      }
    };
    const tabs = [...page.host.querySelectorAll('[data-page-tab]')];
    tabs.forEach((tab, index) => {
      tab.onclick = () => {
        for (const item of tabs) item.classList.toggle('active', item === tab);
        if (index === 0) loadFeed();
        else load(index === 1 ? 'daily' : 'guess');
      };
    });
    loadFeed();
  }

  async function renderMusicHallPage() {
    const token = ++state.routeToken;
    const page = renderPageShell('音乐馆', '发现歌曲、歌单和专辑', ['精选歌单', '新歌', '新专辑']);
    if (!page) return;
    let loadGeneration = 0;
    const load = async (index) => {
      const generation = ++loadGeneration;
      clearRenderedContent(page.body);
      page.body.innerHTML = '<div class="qmtui-loading">正在加载音乐馆…</div>';
      try {
        if (index === 0) {
          const result = await api('/api/library/search/playlists?query=热门');
          if (token !== state.routeToken || generation !== loadGeneration) return;
          const playlists = (result.playlists || []).map(toNativePlaylist);
          if (playlists.length)
            renderReact(
              page.body,
              getRuntime().React.createElement(getRuntime().PlaylistList, {
                wrapper: { current: page.body },
                list: playlists,
                config: { user: false, delete: false, info: true, listen: false },
              })
            );
          else page.body.innerHTML = '<div class="qmtui-empty">暂时没有精选歌单</div>';
        } else if (index === 1) {
          const result = await api('/api/library/search?query=新歌');
          if (token !== state.routeToken || generation !== loadGeneration) return;
          renderPageSongs(page.body, result.songs || [], '暂时没有新歌');
        } else {
          const result = await api('/api/library/search/albums?query=新专辑');
          if (token !== state.routeToken || generation !== loadGeneration) return;
          const albums = (result.albums || []).map(toNativeAlbum);
          if (albums.length)
            renderReact(
              page.body,
              getRuntime().React.createElement(getRuntime().AlbumList, {
                containerRef: { current: page.body },
                content: albums,
                config: { singer: true, subtitle: true, name: true, noplay: true },
              })
            );
          else page.body.innerHTML = '<div class="qmtui-empty">暂时没有新专辑</div>';
        }
      } catch (error) {
        if (generation === loadGeneration)
          page.body.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
      }
    };
    const tabs = [...page.host.querySelectorAll('[data-page-tab]')];
    tabs.forEach((tab, index) => {
      tab.onclick = () => {
        for (const item of tabs) item.classList.toggle('active', item === tab);
        load(index);
      };
    });
    load(0);
  }

  const handleRoute = createRouteController({
    clearRouteHost,
    getRuntime,
    renderAlbumRoute,
    renderMusicHallPage,
    renderPlaylistRoute,
    renderProfilePage,
    renderRecommendPage,
    renderSearchRoute,
    renderSingerRoute,
    renderSongCommentRoute,
    renderUnavailablePage,
    showToast,
    resolveSong: () => (state.remote?.song ? toQqSong(state.remote.song) : null),
  });

  function bindOriginalUi() {
    const runtime = getRuntime();
    if (!runtime || window.__qmtuiOriginalUiBound) return;
    window.__qmtuiOriginalUiBound = true;
    runtime.history.listen(() => setTimeout(handleRoute, 0));

    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Enter' || event.target?.id !== 'js_search') return;
        const value = event.target.value.trim();
        if (!value) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        runtime.history.push(`/search/song?query=${encodeURIComponent(value)}`);
      },
      true
    );

    document.addEventListener(
      'click',
      (event) => {
        const loginTarget = event.target.closest('.top_cont_user__name,.top_cont_user__img');
        if (loginTarget && !state.remote?.account?.loggedIn) {
          event.preventDefault();
          event.stopImmediatePropagation();
          showLoginDialog();
          return;
        }
        if (event.target.closest('.top_search_img')) {
          const input = document.getElementById('js_search');
          const value = input?.value.trim();
          if (!value) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          runtime.history.push(`/search/song?query=${encodeURIComponent(value)}`);
          return;
        }
        const createButton = event.target.closest('.tab_item_icon');
        const title = createButton?.closest('.tab_item_title');
        if (
          title?.textContent.includes('我创建的歌单') &&
          createButton === title.querySelector('.tab_item_icon')
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
          showCreatePlaylistDialog();
          return;
        }
        // 播放队列抽屉的垃圾桶：原生按钮只改本地 store，服务端队列不会变，这里接管。
        if (event.target.closest('.playlist_cont .delete_icon')) {
          event.preventDefault();
          event.stopImmediatePropagation();
          post('/api/queue/clear')
            .then(() => showToast('已清空待播歌曲'))
            .catch((error) => showToast(error.message, true));
          return;
        }
        if (event.target.closest('.player_cont_state_tool_love')) {
          event.preventDefault();
          event.stopImmediatePropagation();
          toggleFavorite();
          return;
        }
        // 在全屏播放器里点「评论/歌手/专辑」应先收起播放器，否则新页面会被封面浮层盖住。
        // 原生组件自身本来就会 JG('IsCoverPlayerVisible', false)，但下面的分支为了接管跳转
        // 调了 stopImmediatePropagation，把原生 onClick 掐掉了，故这里显式补上。
        const fromCoverPlayer = Boolean(event.target.closest('.cover_layout'));
        const closeCoverPlayer = () => {
          if (!fromCoverPlayer) return;
          try {
            runtime.store?.JG('IsCoverPlayerVisible', false);
          } catch {
            // 状态未初始化时忽略
          }
        };
        // 播放栏与全屏封面的歌手名可点击进入歌手页（原生按歌手逐个渲染 span，
        // 分隔符 '/' 会挂在相邻 span 尾部，故剥离后再跳转）。
        const singerNode = event.target.closest(
          '.player_cont_state_inline_desc, .cover_singer_link'
        );
        if (singerNode) {
          const singer = (singerNode.textContent || '').replace(/[\s/、,，·]+$/, '').trim();
          if (singer) {
            event.preventDefault();
            event.stopImmediatePropagation();
            closeCoverPlayer();
            runtime.history.push(`/singer_detail?name=${encodeURIComponent(singer)}`);
            return;
          }
        }
        // 详情页头部里由 singerLinks() 生成的歌手名。
        const singerLinkNode = event.target.closest('[data-singer-name]');
        if (singerLinkNode) {
          const singer = singerLinkNode.dataset.singerName;
          if (singer) {
            event.preventDefault();
            event.stopImmediatePropagation();
            runtime.history.push(`/singer_detail?name=${encodeURIComponent(singer)}`);
            return;
          }
        }
        if (event.target.closest('.player_cont_state_tool_comment')) {
          event.preventDefault();
          event.stopImmediatePropagation();
          closeCoverPlayer();
          if (state.remote?.song?.id) {
            openSongComments(toQqSong(state.remote.song, Boolean(state.remote.isFavorite)));
          } else {
            showToast('当前歌曲没有可用的评论 ID', true);
          }
          return;
        }
        const qualityOption = event.target.closest('.quality_popover_content > div');
        if (qualityOption && qualityOption.style.cursor === 'pointer') {
          const key = qualityOption.querySelector('span')?.textContent?.trim();
          const tier =
            qualityKeyToTier[
              {
                标准: '128k',
                HQ: '320k',
                SQ: 'flac',
                'Hi-Res': 'hires',
                杜比: 'dolby',
                7.1: 'atmos71',
                5.1: 'atmos51',
                臻品: 'deluxe',
                母带: 'master',
              }[key]
            ];
          if (Number.isInteger(tier)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            post('/api/quality', { tier }).catch((error) => showToast(error.message, true));
            return;
          }
        }
      },
      true
    );

    document.addEventListener(
      'contextmenu',
      (event) => {
        const link = event.target.closest('a[href*="/playlist_detail/"]');
        if (!link) return;
        const id = link.getAttribute('href')?.match(/playlist_detail\/([^?]+)/)?.[1];
        const playlist = state.playlists.get(String(id));
        if (!playlist || playlist.isFav || playlist.dirId === 201) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        runtime.confirm(`确定删除歌单“${playlist.name}”吗？`, null, '删除', async () => {
          try {
            await post('/api/library/playlist/delete', playlist);
            showToast('歌单已删除');
            refreshLibrary();
            if (runtime.history.location.pathname.includes(String(id)))
              runtime.history.push('/like');
          } catch (error) {
            showToast(error.message, true);
          }
        });
      },
      true
    );
  }

  // ── 设置 ────────────────────────────────────────────────
  // 头像下拉里的「设置」入口。原生浮层由 React 按需渲染（每次开关都重建），故用
  // MutationObserver 注入，节点结构照抄原生项（.user_info_popover__content__item）。
  function setupSettingsEntry() {
    const inject = () => {
      const ul = document.querySelector('.user_info_popover__content');
      if (!ul || ul.querySelector('[data-qmtui-settings]')) return;
      const item = document.createElement('a');
      item.className = 'user_info_popover__content__item';
      item.setAttribute('data-qmtui-settings', '1');
      item.innerHTML =
        '<span class="icon setting__icon_tool"></span><a class="act_button">设置</a><div class="common_hover__bg c_bg_normal"></div>';
      item.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        // 先关掉原生浮层（点遮罩即收起），再开我们的设置弹窗。
        document.querySelector('.shadow_window')?.click();
        showSettingsDialog();
      };
      ul.append(item);
    };
    inject();
    new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
  }

  // 设置面板：全部项都对应真实后端能力——音质写 preferredQualityTier、模式写 PlaybackMode、
  // 音量与声音输出走 /api/action。值来自 SSE 推送的 state.remote，不额外拉接口。
  function showSettingsDialog() {
    const runtime = getRuntime();
    if (!runtime) return;
    const { React, dialog } = runtime;

    // 档位名称与 AudioQualityHelper.GetQualityName 对齐；取值范围跟随当前曲目可用档位，
    // 否则用户已选的档位（如 4=臻品母带）不在列表里会显示成"没有选中"。
    const QUALITY_LABELS = {
      0: 'Hi-Res',
      1: 'SQ 无损',
      2: 'HQ 高品质',
      3: '标准音质',
      4: '臻品母带',
      5: '臻品音质',
      6: '臻品全景声 5.1',
      7: '臻品全景声 7.1',
      8: '杜比全景声',
    };
    const availableTiers = Array.isArray(state.remote?.availableQualityTiers)
      ? state.remote.availableQualityTiers.map(Number)
      : [];
    const QUALITY_CHOICES = (availableTiers.length ? availableTiers : [1, 2, 3]).map((tier) => ({
      tier,
      label: QUALITY_LABELS[tier] || `档位 ${tier}`,
    }));
    const MODE_STRING_TO_INT = { list_loop: 0, single_loop: 1, shuffle: 2, sequential: 3 };
    const MODE_CHOICES = [
      { value: 0, label: '列表循环' },
      { value: 1, label: '单曲循环' },
      { value: 2, label: '随机播放' },
      { value: 3, label: '顺序播放' },
    ];

    function SettingsContent() {
      const remote = state.remote || {};
      const [quality, setQuality] = React.useState(Number(remote.preferredQualityTier) || 1);
      const [mode, setMode] = React.useState(MODE_STRING_TO_INT[remote.mode] ?? 0);
      const [volume, setVolume] = React.useState(Number(remote.volume) || 80);
      const [audioEnabled, setAudioEnabled] = React.useState(remote.audioEnabled !== false);
      const [error, setError] = React.useState('');

      const run = (promise) => promise.catch((e) => setError(e.message));

      const pickQuality = (tier) => {
        setQuality(tier);
        run(post('/api/quality', { tier }));
      };
      const pickMode = (value) => {
        setMode(value);
        run(post('/api/action', { action: 'set_mode', mode: value }));
      };
      const changeVolume = (value) => {
        setVolume(value);
        run(post('/api/action', { action: 'volume', volume: value }));
      };
      const pickOutput = (enabled) => {
        setAudioEnabled(enabled);
        run(post('/api/action', { action: 'set_audio', enabled }));
      };

      const row = (label, hint, ...controls) =>
        React.createElement(
          'div',
          { className: 'qmtui-setting' },
          React.createElement(
            'div',
            { className: 'qmtui-setting__label' },
            React.createElement('span', null, label),
            hint
              ? React.createElement('span', { className: 'qmtui-setting__hint c_tx_thin' }, hint)
              : null
          ),
          React.createElement('div', { className: 'qmtui-setting__control' }, ...controls)
        );

      const chips = (choices, current, onPick) =>
        choices.map((choice) =>
          React.createElement(
            'a',
            {
              key: String(choice.tier ?? choice.value),
              className: `qmtui-setting__chip${(choice.tier ?? choice.value) === current ? ' active' : ''}`,
              onClick: () => onPick(choice.tier ?? choice.value),
            },
            choice.label
          )
        );

      return React.createElement(
        'div',
        { className: 'qmtui-settings' },
        row('默认音质', '新播放歌曲优先使用的档位', chips(QUALITY_CHOICES, quality, pickQuality)),
        row('播放模式', '', chips(MODE_CHOICES, mode, pickMode)),
        row(
          '音量',
          '',
          React.createElement('input', {
            className: 'qmtui-setting__range',
            type: 'range',
            min: 0,
            max: 100,
            value: volume,
            onChange: (event) => changeVolume(Number(event.target.value)),
          }),
          React.createElement('span', { className: 'qmtui-setting__value' }, `${volume}`)
        ),
        row(
          '声音输出',
          '「本机出声」由运行 qmtui 的机器播放；「仅遥控」只同步状态，声音在你正在听的设备上',
          chips(
            [
              { value: 1, label: '本机出声' },
              { value: 0, label: '仅遥控' },
            ],
            audioEnabled ? 1 : 0,
            (value) => pickOutput(value === 1)
          )
        ),
        error ? React.createElement('div', { className: 'qmtui-setting__error' }, error) : null
      );
    }

    dialog.show({
      mode: 'custom',
      title: '设置',
      width: 460,
      component: React.createElement(SettingsContent),
    });
  }

  function setupCoverLyricToggle() {
    const MOBILE_MAX = 768;

    const reset = () => {
      for (const el of document.querySelectorAll('.cover_layout.qmtui-show-lyric')) {
        el.classList.remove('qmtui-show-lyric');
      }
    };

    document.addEventListener('click', (event) => {
      if (window.innerWidth > MOBILE_MAX) return;
      const target = event.target instanceof Element ? event.target : event.target.parentElement;
      if (!target) return;
      const layout = target.closest('.cover_layout.cover_layout--show');
      if (!layout) return;
      if (target.closest('.cover_album__wrapper')) {
        // 歌手/专辑链接自身跳转，不触发切换
        if (target.closest('.cover_singer_link, .cover_song_album')) return;
        layout.classList.add('qmtui-show-lyric');
      } else if (target.closest('.layout_page')) {
        // 点击歌词句跳转播放，不触发切换
        if (target.closest('.lyric-list .item')) return;
        layout.classList.remove('qmtui-show-lyric');
      }
    });

    // 播放器关闭时重置，下次打开默认显示封面
    const observer = new MutationObserver(() => {
      if (!document.body.classList.contains('in-cover-player')) reset();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  function setupMobileSidebar() {
    const MOBILE_MAX = 768;

    const ensureButton = () => {
      if (window.innerWidth > MOBILE_MAX) return;
      const topCont = document.querySelector('.top_cont');
      if (!topCont || topCont.querySelector('.qmtui-sidebar-toggle')) return;
      const btn = document.createElement('a');
      btn.className = 'qmtui-sidebar-toggle';
      btn.title = '侧边栏';
      btn.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('.main_cont')?.classList.toggle('qmtui-sidebar-open');
      });
      topCont.insertBefore(btn, topCont.firstChild);
    };

    document.addEventListener('click', (event) => {
      if (window.innerWidth > MOBILE_MAX) return;
      const mainCont = document.querySelector('.main_cont');
      if (!mainCont || !mainCont.classList.contains('qmtui-sidebar-open')) return;
      if (event.target.closest('.qmtui-sidebar-toggle')) return;
      if (!event.target.closest('.main')) {
        mainCont.classList.remove('qmtui-sidebar-open');
        return;
      }
      if (event.target.closest('a, .nav_item')) {
        mainCont.classList.remove('qmtui-sidebar-open');
      }
    });

    const removeButton = () => {
      document.querySelector('.qmtui-sidebar-toggle')?.remove();
    };

    window.addEventListener('resize', () => {
      if (window.innerWidth <= MOBILE_MAX) ensureButton();
      else removeButton();
    });

    ensureButton();
  }

  function boot() {
    const runtime = getRuntime();
    if (!runtime) {
      setTimeout(boot, 50);
      return;
    }
    bindOriginalUi();
    enableTapToPlay();
    watchSkin();
    setupCoverLyricToggle();
    setupMobileSidebar();
    setupSettingsEntry();
    startProgressTicker();
    api('/api/account')
      .then(renderAccount)
      .catch(() => {});
    ensureFavoriteKeys();
    handleRoute();
  }

  window.addEventListener('qmtui-player-ready', () => window.__QMTUI_ATTACH_PLAYER__?.(attach));
  window.__QMTUI_ATTACH_PLAYER__?.(attach);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  connect();
})();
