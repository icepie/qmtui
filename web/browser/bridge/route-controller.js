import { state } from './state.js';

// 最近播放：与服务端特殊歌单同源的固定 dirid（201=我喜欢、202=最近播放）。
const RECENT_PLAY_DIR_ID = 202;

export function createRouteController({
  clearRouteHost,
  getRuntime,
  recoverPlaylistRoute,
  renderAlbumRoute,
  renderLikePage,
  renderMusicHallPage,
  renderPlaylistRoute,
  renderProfilePage,
  renderRecommendPage,
  renderSearchRoute,
  renderSingerRoute,
  renderSongCommentRoute,
  resolveSong,
}) {
  return function handleRoute() {
    const runtime = getRuntime();
    if (!runtime) return;
    const { pathname, search } = runtime.history.location;

    if (pathname === '/recommend') {
      setTimeout(renderRecommendPage, 40);
      return;
    }
    if (pathname === '/musicroom') {
      setTimeout(renderMusicHallPage, 40);
      return;
    }
    if (pathname === '/like') {
      setTimeout(renderLikePage, 40);
      return;
    }
    if (pathname.startsWith('/search')) {
      setTimeout(() => renderSearchRoute(pathname, search), 40);
      return;
    }
    if (pathname.startsWith('/profile')) {
      setTimeout(renderProfilePage, 40);
      return;
    }

    if (pathname.startsWith('/playlist_detail/')) {
      const id = pathname.split('/').filter(Boolean)[1];
      // 最近播放：原生页在 web 端拿不到数据（只会停在骨架屏/空态），改用我们自己的歌单渲染，
      // 数据源是 dirid=202 的 GetUniformSongDetailInfo（与「我喜欢」同一接口）。
      if (id === 'recent' || id === String(RECENT_PLAY_DIR_ID)) {
        setTimeout(
          () =>
            renderPlaylistRoute({
              dirId: RECENT_PLAY_DIR_ID,
              tid: RECENT_PLAY_DIR_ID,
              id: RECENT_PLAY_DIR_ID,
              name: '最近播放',
              isFav: false,
            }),
          40
        );
        return;
      }
      const playlist = state.playlists.get(String(id));
      if (playlist) setTimeout(() => renderPlaylistRoute(playlist), 40);
      else setTimeout(() => recoverPlaylistRoute(id), 40);
      return;
    }
    if (pathname.startsWith('/album_detail')) {
      const params = new URLSearchParams(search);
      let mid = params.get('mid');
      if (!mid) {
        const url = params.get('url');
        if (url) {
          try {
            const inner = new URL(decodeURIComponent(url));
            mid = new URLSearchParams(inner.hash.split('?')[1] || '').get('mid');
          } catch {}
        }
      }
      if (!mid) return;
      const album = state.albums.get(String(mid));
      if (album) setTimeout(() => renderAlbumRoute(album), 40);
      else setTimeout(() => renderAlbumRoute({ mid }), 40);
      return;
    }
    if (pathname.startsWith('/song_detail')) {
      const params = new URLSearchParams(search);
      let id = params.get('id');
      // 原生 jump(PAGE_TYPE.SONG) 传的是嵌套 url（.../song_detail?id=ID&songtype=N），需解出 id。
      if (!id) {
        const url = params.get('url');
        if (url) {
          try {
            const inner = new URL(decodeURIComponent(url));
            id = new URLSearchParams(inner.hash.split('?')[1] || '').get('id');
          } catch {}
        }
      }
      const song = state.songs.get(String(id)) || resolveSong();
      if (song) setTimeout(() => renderSongCommentRoute(song), 40);
      return;
    }
    if (pathname.startsWith('/singer_detail')) {
      const params = new URLSearchParams(search);
      let mid = params.get('mid');
      const id = params.get('id');
      let name = params.get('name');
      // 原生 jump(PAGE_TYPE.SINGER) 传的是嵌套 url（.../singer_detail?singermid=MID），需解出 singermid。
      if (!mid && !id && !name) {
        const url = params.get('url');
        if (url) {
          try {
            const inner = new URL(decodeURIComponent(url));
            const innerParams = new URLSearchParams(inner.hash.split('?')[1] || '');
            mid = innerParams.get('singermid') || innerParams.get('mid');
            name = innerParams.get('name');
          } catch {}
        }
      }
      if (mid || id || name) setTimeout(() => renderSingerRoute({ mid, id, name }), 40);
      return;
    }
    clearRouteHost();
  };
}
