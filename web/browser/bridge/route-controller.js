import { state } from './state.js';

export function createRouteController({
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
    if (pathname.startsWith('/playlist_detail/') && !pathname.includes('/recent')) {
      const id = pathname.split('/').filter(Boolean)[1];
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
      const id = new URLSearchParams(search).get('id');
      const song = state.songs.get(String(id)) || resolveSong();
      if (song) setTimeout(() => renderSongCommentRoute(song), 40);
      return;
    }
    clearRouteHost();
  };
}
