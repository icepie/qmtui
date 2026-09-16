/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Am": () => (/* binding */ getCollectAudioList),
/* harmony export */   "Ee": () => (/* binding */ getCollectAlbumList),
/* harmony export */   "$H": () => (/* binding */ getPlaylistFavInfo),
/* harmony export */   "ng": () => (/* binding */ getCollectSongList),
/* harmony export */   "kk": () => (/* binding */ getMyFavMV),
/* harmony export */   "in": () => (/* binding */ getFavSongList),
/* harmony export */   "Sq": () => (/* binding */ getSongsIsLiked),
/* harmony export */   "g_": () => (/* binding */ getUrlVKey),
/* harmony export */   "NS": () => (/* binding */ getCDNList),
/* harmony export */   "Du": () => (/* binding */ likeSong),
/* harmony export */   "Jd": () => (/* binding */ unlikeSong),
/* harmony export */   "xu": () => (/* binding */ getCreatePlayList),
/* harmony export */   "iA": () => (/* binding */ createNewPlayList),
/* harmony export */   "jd": () => (/* binding */ addSongsToPlayList),
/* harmony export */   "xT": () => (/* binding */ cancelFavAlbum),
/* harmony export */   "kq": () => (/* binding */ cancelFavAudio),
/* harmony export */   "mq": () => (/* binding */ getSongLyric),
/* harmony export */   "jV": () => (/* binding */ deletePlayList),
/* harmony export */   "AH": () => (/* binding */ deleteFavPlayList),
/* harmony export */   "lR": () => (/* binding */ addFavPlayList),
/* harmony export */   "EP": () => (/* binding */ getAlbumInnerSongList),
/* harmony export */   "rD": () => (/* binding */ updateFavMv),
/* harmony export */   "KJ": () => (/* binding */ getSongDetail),
/* harmony export */   "nY": () => (/* binding */ checkPlaylistIsCollect),
/* harmony export */   "LH": () => (/* binding */ seqSongList),
/* harmony export */   "Wi": () => (/* binding */ deleteSongsFromPlayList)
/* harmony export */ });
/* unused harmony exports getHomePageInfo, GET_SONG_LIST_DETAIL_OF_PLAYLIST */
/* harmony import */ var _common_login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(68010);

// 获取收藏的电台
const getCollectAudioList = param => ({
  module: 'music.favorSystemRead.FavorSystem',
  method: 'get_favor_list',
  param
});
const getCollectAlbumList = param => ({
  module: 'music.musicasset.AlbumFavRead',
  method: 'GetAlbumFavInfo',
  param
}); // 获取收藏的歌单

const getPlaylistFavInfo = param => ({
  module: 'music.musicasset.PlaylistFavRead',
  method: 'GetPlaylistFavInfo',
  param
});
/**
 * 这个接口同时也能获取指定歌单下的歌曲，【我喜欢歌单】就是dirId为201的歌单
 * @param param
 */

const getCollectSongList = param => ({
  module: 'music.musicasset.PlaylistDetailRead',
  method: 'GetUniformSongDetailInfo',
  param
});
const getMyFavMV = param => ({
  module: 'music.musicasset.MVFavRead',
  method: 'getMyFavMV',
  param
});
const getHomePageInfo = param => ({
  module: 'music.homepage.HomepageSrv',
  method: 'GetHomepageTabDetail',
  param
});
const getFavSongList = param => ({
  module: 'music.musicasset.SongFavRead',
  method: 'GetFavSonglist',
  param
});
const getSongsIsLiked = param => ({
  module: 'music.musicasset.SongFavRead',
  method: 'IsSongFanByMid',
  param
});
const getUrlVKey = param => ({
  module: 'music.vkey.GetVkey',
  method: 'GetUrl',
  param: {
    uin: `${_common_login__WEBPACK_IMPORTED_MODULE_0__/* .default.musicId */ .Z.musicId}`,
    guid: '5640789320',
    downloadfrom: 1,
    ctx: 1,
    scene: 0,
    nettype: '',
    platform: '20',
    ...param
  }
});
const getCDNList = () => ({
  module: 'CDN.SrfCdnDispatchServer',
  method: 'GetCdnDispatch',
  param: {
    guid: '45CF436FD01D532344A0AD5DE71AA4D1',
    uin: '123'
  }
});
const likeSong = param => ({
  module: 'music.musicasset.PlaylistDetailWrite',
  method: 'AddSonglist',
  param: {
    dirId: 201,
    ...param
  }
});
const unlikeSong = param => ({
  module: 'music.musicasset.PlaylistDetailWrite',
  method: 'DelSonglist',
  param: {
    dirId: 201,
    ...param
  }
}); // 获取自己创建的歌单列表

const getCreatePlayList = param => ({
  module: 'music.musicasset.PlaylistBaseRead',
  method: 'GetPlaylistByUin',
  param
}); // 创建新的歌单

const createNewPlayList = param => {
  const defaultParams = {
    dirName: '新建歌单1',
    dirShow: 1,
    dirDesc: '',
    dirPicUrl: '',
    taglist: ''
  };
  return {
    module: 'music.musicasset.PlaylistBaseWrite',
    method: 'AddPlaylist',
    param: { ...defaultParams,
      ...param
    }
  };
}; // 添加歌曲到某个歌单

const addSongsToPlayList = param => ({
  module: 'music.musicasset.PlaylistDetailWrite',
  method: 'AddSonglist',
  param
}); // 取消收藏专辑

const cancelFavAlbum = param => ({
  module: 'music.musicasset.AlbumFavWrite',
  method: 'CancelFavAlbum',
  param
}); // 取消收藏长音频专辑

const cancelFavAudio = param => ({
  module: 'music.favor_system_write',
  method: 'do_favor',
  param
});
// 这个接口在jce没找到，就自己定义了
const getSongLyric = param => ({
  method: 'get_song_detail',
  module: 'music.pf_song_detail_svr',
  param
});
/**
 * 删除歌单
 * @param param
 */

const deletePlayList = param => ({
  module: 'music.musicasset.PlaylistBaseWrite',
  method: 'DelPlaylist',
  param
});
/**
 * 取消收藏喜欢的歌单
 * @param param
 */

const deleteFavPlayList = param => ({
  module: 'music.musicasset.PlaylistFavWrite',
  method: 'CancelFavPlaylist',
  param
});
/**
 * 取消收藏喜欢的歌单
 * @param param
 */

const addFavPlayList = param => ({
  module: 'music.musicasset.PlaylistFavWrite',
  method: 'FavPlaylist',
  param
});
const getAlbumInnerSongList = param => ({
  module: 'music.musichallAlbum.AlbumSongList',
  method: 'GetAlbumSongList',
  param: { ...param,
    begin: 0,
    num: -1,
    order: 2
  }
});
const updateFavMv = param => ({
  module: 'music.musicasset.MVFavWrite',
  method: 'AddDelFavMV',
  param
});
const getSongDetail = param => ({
  module: 'music.pf_song_detail_svr',
  method: 'get_song_detail',
  param
});
const checkPlaylistIsCollect = param => ({
  module: 'music.musicasset.PlaylistFavRead',
  method: 'IsPlaylistFan',
  param
});
const seqSongList = param => ({
  module: 'music.musicasset.PlaylistDetailWrite',
  method: 'SeqSonglist',
  param
});
const deleteSongsFromPlayList = param => ({
  module: 'music.musicasset.PlaylistDetailWrite',
  method: 'DelSonglist',
  param
});
const GET_SONG_LIST_DETAIL_OF_PLAYLIST = param => ({
  module: 'music.musicasset.PlaylistDetailRead',
  method: 'GetSongDetailInfoListByDirId',
  param
});

//# sourceURL=webpack://qqmusic/./src/lib/network/asset_api.ts?