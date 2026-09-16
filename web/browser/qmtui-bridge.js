import { api, post } from './bridge/api.js';
import { modeToQq, qualityKeyToTier, qualityTierToKey } from './bridge/config.js';
import { albumCover, escapeHtml, keyOf, mapSong, query, songCover } from './bridge/media.js';
import { attachPlayer } from './bridge/player-adapter.js';
import { createRouteController } from './bridge/route-controller.js';
import { state } from './bridge/state.js';

(() => {
  if (window.__qmtuiBridgeInstalled) return;
  window.__qmtuiBridgeInstalled = true;

  function toQqSong(song, liked = false) {
    const mapped = mapSong(song);
    const duration = Number(mapped.duration) || 0;
    const cover = songCover(mapped, 500);
    const singers = String(mapped.artist || '未知歌手')
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
      file: { media_mid: mapped.mediaMid || mapped.mid || '', size_128mp3: 1 },
      action: { play: 1, fav: 1, share: 1 },
      url: '',
      pic: cover,
      picurl: cover,
      like: liked,
      isLocal: false,
      lyrics: Array.isArray(song.lyrics) ? song.lyrics : [],
    };
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
    };
    patchOriginalAccountActions();
    return state.runtime;
  }

  const attach = (logicalPlayer) =>
    attachPlayer(logicalPlayer, { applyState, showToast, toggleFavorite });

  function visibleElement(selector) {
    return [...document.querySelectorAll(selector)].find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  }

  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  }

  function renderProgress(position, duration) {
    const safeDuration = Math.max(0, Number(duration) || 0);
    const safePosition = Math.max(
      0,
      Math.min(Number(position) || 0, safeDuration || Number.POSITIVE_INFINITY)
    );
    const percent = safeDuration > 0 ? Math.min(100, (safePosition / safeDuration) * 100) : 0;
    const current = visibleElement('.player_time_cur');
    const total = visibleElement('.player_time_total');
    const played = visibleElement('.player_process_cent');
    const buffered = visibleElement('.player_process_buffer');
    const dot = visibleElement('.player_process_dot');
    if (current) current.textContent = formatTime(safePosition);
    if (total) total.textContent = formatTime(safeDuration);
    if (played) played.style.width = `${percent}%`;
    if (buffered) buffered.style.width = `${percent}%`;
    if (dot) dot.style.left = `${percent}%`;
  }

  function startProgressTicker() {
    if (state.progressTicker) return;
    state.progressTicker = window.setInterval(() => {
      if (!state.remote) return;
      const elapsed = state.remote.isPlaying
        ? Math.max(0, (performance.now() - state.progressAnchorTime) / 1000)
        : 0;
      renderProgress(
        state.progressAnchorPosition + elapsed,
        state.currentDuration || state.remote.duration
      );
    }, 250);
  }

  function updateRouteLayout() {
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
        if (metadataChanged) {
          state.player.currentSong = song;
          state.player.songList = [song];
          state.player.playList = state.player.songList;
          state.player.index = 0;
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
      renderProgress(position, duration);
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
    state.source = new EventSource('/api/events');
    state.source.onmessage = (event) => {
      try {
        applyState(JSON.parse(event.data));
      } catch {}
    };
    state.source.onopen = () => {
      document.documentElement.dataset.qmtuiBridge = 'connected';
      // Re-assert the authoritative account on (re)connect: the UserInfo
      // component may have re-mounted while the EventSource was down, resetting
      // its display state that only renderAccount restores.
      api('/api/account')
        .then(renderAccount)
        .catch(() => {});
    };
    state.source.onerror = () => {
      state.source?.close();
      document.documentElement.dataset.qmtuiBridge = 'disconnected';
      clearTimeout(state.reconnectTimer);
      state.reconnectTimer = setTimeout(connect, 1800);
    };
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
    setTimeout(() => bindSongRows(host, nativeSongs, options), 0);
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
      const addButton = row.querySelector('.songname_menu__add');
      if (addButton) addButton.onclick = () => choosePlaylistForSong(song);
      const menu = row.querySelector('.mod_songname_menu');
      if (menu) {
        const comment = document.createElement('a');
        comment.className = 'songname_menu__item c_txt_thin qmtui-extra-action';
        comment.textContent = '评论';
        comment.title = '评论';
        comment.onclick = () => openSongComments(song);
        menu.append(comment);
        if (options.playlist && !options.playlist.isFav && options.playlist.dirId > 0) {
          const remove = document.createElement('a');
          remove.className = 'songname_menu__item c_txt_thin qmtui-extra-action';
          remove.textContent = '移除';
          remove.title = '从歌单移除';
          remove.onclick = () => removeSongFromPlaylist(options.playlist, song);
          menu.append(remove);
        }
      }
    });
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

  async function choosePlaylistForSong(song) {
    try {
      const result = await api('/api/library/playlists');
      const choices = (result.playlists || []).filter(
        (item) => !item.isFav && Number(item.dirId) > 0 && Number(item.dirId) !== 201
      );
      if (!choices.length) {
        showToast('没有可写入的自建歌单', true);
        return;
      }
      const selected = prompt(
        `输入目标歌单序号：\n${choices.map((item, index) => `${index + 1}. ${item.name}`).join('\n')}`,
        '1'
      );
      const playlist = choices[Number(selected) - 1];
      if (!playlist) return;
      await post('/api/library/playlist/song/add', { ...playlist, song: mapSong(song) });
      showToast(`已加入：${playlist.name}`);
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function removeSongFromPlaylist(playlist, song) {
    if (!confirm(`确定从“${playlist.name}”移除“${song.title || song.name}”？`)) return;
    try {
      await post('/api/library/playlist/song/remove', { ...playlist, song: mapSong(song) });
      showToast('已从歌单移除');
      renderPlaylistRoute(playlist);
    } catch (error) {
      showToast(error.message, true);
    }
  }

  function detailHeader({ image, title, subtitle, playAll, favorite, unfavorite }) {
    return `
      <div class="mod_detail album">
        <div class="detail__inner">
          <div class="detail__cover"><img src="${escapeHtml(image)}" alt="" class="detail__cover_pic"></div>
          <div class="detail__info">
            <h1 class="detail__title c_tx_normal">${escapeHtml(title)}</h1>
            <div class="mod_detail_about c_tx_thin"><div class="detail__para">${escapeHtml(subtitle || '')}</div></div>
            <div class="mod_detail_operation qmtui-detail-actions">
              <a class="mod_btn c_btn_skin" data-detail-action="play"><span class="btn__cover"></span><span class="btn__txt">播放全部</span></a>
              ${favorite ? '<a class="mod_btn c_btn" data-detail-action="favorite"><span class="btn__cover"></span><span class="btn__txt">收藏</span></a>' : ''}
              ${unfavorite ? '<a class="mod_btn c_btn" data-detail-action="unfavorite"><span class="btn__cover"></span><span class="btn__txt">取消收藏</span></a>' : ''}
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

  async function recoverPlaylistRoute(id) {
    try {
      const result = await api('/api/library/playlists');
      const playlists = (result.playlists || []).map(toNativePlaylist);
      const playlist = state.playlists.get(String(id));
      if (playlist) renderPlaylistRoute(playlist);
      else if (playlists.length) showToast('未找到对应歌单', true);
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function renderPlaylistRoute(playlist) {
    const token = ++state.routeToken;
    const host = createRouteHost();
    if (!host) return;
    host.innerHTML = '<div class="qmtui-loading">正在加载歌单…</div>';
    try {
      const result = await api(
        `/api/library/playlist?${query({
          dirId: playlist.dirId,
          tid: playlist.tid,
          isFav: playlist.isFav,
          name: playlist.name,
        })}`
      );
      if (token !== state.routeToken) return;
      const songs = result.songs || [];
      const id = playlist.tid || playlist.id || playlist.dirId;
      const commentsActive = location.hash.includes('/comment');
      host.innerHTML = `<div class="layout_detail column_flex playlist_detail">
        ${detailHeader({
          image: playlist.picUrl || playlist.picurl || songCover(songs[0]),
          title: playlist.name,
          subtitle: `${songs.length || playlist.songCount || 0} 首歌曲`,
          playAll: true,
        })}
        ${detailTabs(`#/playlist_detail/${id}`, `#/playlist_detail/${id}/comment`, commentsActive)}
        <div class="main_cont song" id="qmtui-detail-body"></div>
      </div>`;
      host.querySelector('[data-detail-action="play"]').onclick = () => {
        if (songs.length) playSong(songs[0], songs);
      };
      const body = host.querySelector('#qmtui-detail-body');
      if (commentsActive) renderComments(body, Number(id), 3);
      else if (songs.length) renderSongList(body, songs, { playlist });
      else body.innerHTML = '<div class="qmtui-empty">歌单里没有歌曲</div>';
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
          subtitle: [detail.artist, detail.publishDate, detail.company].filter(Boolean).join(' · '),
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
    body.innerHTML = '<div class="qmtui-loading">正在加载评论…</div>';
    try {
      const result = await api(`/api/comments?${query({ bizId, bizType, sort: 'hot' })}`);
      body.innerHTML = `<div class="qmtui-comment-editor">
          <textarea class="qmtui-native-input c_btn" id="qmtui-comment-text" placeholder="写评论"></textarea>
          <a class="mod_btn c_btn_skin" id="qmtui-comment-send"><span class="btn__cover"></span><span class="btn__txt">发布</span></a>
        </div>
        <h3 class="qmtui-comment-title c_tx_normal">评论 ${Number(result.total) || 0}</h3>
        <div class="mod_comment qmtui-comment-list"><ul class="comment__list">
          ${
            (result.comments || [])
              .map(
                (comment) => `<li class="comment__list_item c_b_normal">
                <div class="comment__avatar"><img src="${escapeHtml(comment.avatar || '')}" alt=""></div>
                <h4 class="comment__title c_tx_current">${escapeHtml(comment.nick || 'QQ音乐用户')}</h4>
                <p class="comment__text c_tx_normal">${escapeHtml(comment.content)}</p>
                <div class="comment__opt c_tx_thin">赞 ${Number(comment.praiseCount) || 0}${comment.isSelf ? ` <a class="qmtui-comment-delete c_tx_current" data-comment-id="${escapeHtml(comment.id)}">删除</a>` : ''}</div>
              </li>`
              )
              .join('') || '<li class="qmtui-empty">暂无评论</li>'
          }
        </ul></div>`;
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
    } catch (error) {
      body.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
    }
  }

  async function renderSearchRoute(path, search) {
    const token = ++state.routeToken;
    const host = createRouteHost(true);
    if (!host) return;
    const text = new URLSearchParams(search).get('query') || '';
    if (!text) {
      host.innerHTML = '<div class="qmtui-empty">在顶部搜索框输入歌曲、歌单或专辑</div>';
      return;
    }

    const TABS = [
      { id: 'song', label: '歌曲' },
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

  async function renderRecommendPage() {
    const token = ++state.routeToken;
    const page = renderPageShell('推荐', '根据你的音乐偏好生成', ['每日30首', '猜你喜欢']);
    if (!page) return;
    const load = async (type) => {
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
        load(index === 0 ? 'daily' : 'guess');
      };
    });
    load('daily');
  }

  async function renderLikePage() {
    const token = ++state.routeToken;
    const page = renderPageShell('我喜欢', '', ['歌曲', '歌单', '专辑']);
    if (!page) return;

    let playlists = [];
    let albums = [];
    const songsState = { items: [], page: 1, hasMore: true, loading: false, loaded: false };
    let activeTab = 0;

    const loadCollections = async () => {
      try {
        const [playlistResult, albumResult] = await Promise.all([
          api('/api/library/playlists'),
          api('/api/library/albums/favorite'),
        ]);
        if (token !== state.routeToken) return;
        playlists = (playlistResult.playlists || [])
          .filter((item) => item.isFav)
          .map(toNativePlaylist);
        albums = (albumResult.albums || []).map(toNativeAlbum);
      } catch (error) {
        if (token === state.routeToken) showToast(error.message, true);
      }
    };

    const renderSongs = (resetScroll = false) => {
      const s = songsState;
      if (!s.loaded) {
        page.body.innerHTML = '<div class="qmtui-loading">正在加载…</div>';
        return;
      }
      if (s.items.length === 0) {
        page.body.innerHTML = '<div class="qmtui-empty">还没有喜欢的歌曲</div>';
        return;
      }
      renderSongList(page.body, s.items, { liked: true });
      if (resetScroll) page.body.scrollTop = 0;
    };

    const loadSongs = async (reset) => {
      const s = songsState;
      if (s.loading || (!reset && !s.hasMore)) return;
      s.loading = true;
      const targetPage = reset ? 1 : s.page + 1;
      try {
        const result = await api(`/api/library/favorites/songs?page=${targetPage}`);
        if (token !== state.routeToken) return;
        const raw = result.songs || [];
        s.items = reset ? raw : s.items.concat(raw);
        s.page = targetPage;
        s.hasMore = !!result.hasMore;
        s.loaded = true;
        if (activeTab === 0) renderSongs(reset);
      } catch (error) {
        if (token !== state.routeToken) return;
        if (reset || s.items.length === 0) {
          page.body.innerHTML = `<div class="qmtui-empty">${escapeHtml(error.message)}</div>`;
        } else {
          showToast(error.message, true);
        }
      } finally {
        s.loading = false;
      }
    };

    const show = (index) => {
      activeTab = index;
      clearRenderedContent(page.body);
      page.body.scrollTop = 0;
      if (index === 0) {
        if (songsState.loaded) renderSongs(true);
        else {
          page.body.innerHTML = '<div class="qmtui-loading">正在加载…</div>';
          loadSongs(true);
        }
      } else if (index === 1) {
        if (playlists.length)
          renderReact(
            page.body,
            getRuntime().React.createElement(getRuntime().PlaylistList, {
              wrapper: { current: page.body },
              list: playlists,
              config: { user: false, delete: false, info: true, listen: false },
            })
          );
        else page.body.innerHTML = '<div class="qmtui-empty">还没有收藏的歌单</div>';
      } else if (index === 2) {
        if (albums.length)
          renderReact(
            page.body,
            getRuntime().React.createElement(getRuntime().AlbumList, {
              containerRef: { current: page.body },
              content: albums,
              config: { singer: true, subtitle: true, name: true, noplay: true },
            })
          );
        else page.body.innerHTML = '<div class="qmtui-empty">还没有收藏的专辑</div>';
      }
    };

    page.body.addEventListener('scroll', () => {
      if (activeTab !== 0) return;
      const s = songsState;
      if (
        s.hasMore &&
        !s.loading &&
        page.body.scrollHeight - page.body.scrollTop - page.body.clientHeight < 400
      ) {
        loadSongs(false);
      }
    });

    const tabs = [...page.host.querySelectorAll('[data-page-tab]')];
    tabs.forEach((tab, index) => {
      tab.onclick = () => {
        for (const item of tabs) item.classList.toggle('active', item === tab);
        show(index);
      };
    });

    loadCollections();
    show(0);
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
    recoverPlaylistRoute,
    renderAlbumRoute,
    renderLikePage,
    renderMusicHallPage,
    renderPlaylistRoute,
    renderRecommendPage,
    renderSearchRoute,
    renderSongCommentRoute,
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
        if (event.target.closest('.player_cont_state_tool_love')) {
          event.preventDefault();
          event.stopImmediatePropagation();
          toggleFavorite();
          return;
        }
        if (event.target.closest('.player_cont_state_tool_comment')) {
          event.preventDefault();
          event.stopImmediatePropagation();
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

  function boot() {
    const runtime = getRuntime();
    if (!runtime) {
      setTimeout(boot, 50);
      return;
    }
    bindOriginalUi();
    startProgressTicker();
    api('/api/account')
      .then(renderAccount)
      .catch(() => {});
    handleRoute();
  }

  window.addEventListener('qmtui-player-ready', () => window.__QMTUI_ATTACH_PLAYER__?.(attach));
  window.__QMTUI_ATTACH_PLAYER__?.(attach);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  connect();
})();
