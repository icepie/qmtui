/** @typedef {{ name?: string | null; title?: string | null }} SingerPayload */
/** @typedef {{ id?: string | number | null; mid?: string | null; name?: string | null; title?: string | null }} AlbumPayload */
/**
 * Fields consumed from QQ Music responses and qmtui's flattened song objects.
 * A track wrapper may contain the same payload under `track`.
 * @typedef {object} SongPayload
 * @property {SongPayload | null} [track]
 * @property {string | null} [mid]
 * @property {string | null} [songmid]
 * @property {string | number | null} [id]
 * @property {string | null} [title]
 * @property {string | null} [name]
 * @property {string | null} [artist]
 * @property {SingerPayload[] | null} [singer]
 * @property {string | AlbumPayload | null} [album]
 * @property {string | null} [albumname]
 * @property {string | null} [albumMid]
 * @property {string | number | null} [duration]
 * @property {string | number | null} [interval]
 * @property {string | null} [mediaMid]
 * @property {string | null} [media_mid]
 * @property {{ media_mid?: string | null } | null} [file]
 */

/**
 * HTML-escape a value for safe insertion into innerHTML templates.
 * @param {unknown} value
 * @returns {string}
 */
export const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) =>
      /** @type {Record<string, string>} */ ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char]
  );

/**
 * Stable identity key for a song object; prefers `mid`, falls back to `id`.
 * @param {SongPayload | null | undefined} song
 * @returns {string}
 */
export const keyOf = (song) => String(song?.mid || song?.id || '');

/**
 * Serialize a params object into a query string, dropping null/undefined values.
 * @param {Record<string, unknown>} params
 * @returns {string}
 */
export const query = (params) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) search.set(key, String(value));
  }
  return search.toString();
};

/** @param {SongPayload | null | undefined} song @param {number} [size] */
export const songCover = (song, size = 300) => {
  const album = typeof song?.album === 'string' ? undefined : song?.album;
  return `/cover?mid=${encodeURIComponent(song?.mid || '')}&albumMid=${encodeURIComponent(song?.albumMid || album?.mid || '')}&size=${size}`;
};

/** @param {AlbumPayload | null | undefined} album */
export const albumCover = (album) =>
  `/cover?mid=${encodeURIComponent(album?.mid || '')}&albumMid=${encodeURIComponent(album?.mid || '')}&size=300`;

/** @typedef {{ mid: string; title: string; artist: string; album: string; duration: number; mediaMid: string; id: number; albumMid: string }} MappedSong */

/**
 * Normalize a QQ Music track payload into a flat, stable song shape for the UI.
 * Accepts either the raw payload or a `{ track }` wrapper.
 * @param {SongPayload | null | undefined} item
 * @returns {MappedSong}
 */
export function mapSong(item) {
  const source = item?.track || item || {};
  const album = typeof source.album === 'string' ? undefined : source.album;
  return {
    mid: source.mid || source.songmid || '',
    title: source.title || source.name || '',
    artist:
      source.artist ||
      (source.singer || [])
        .map((value) => value.name || value.title)
        .filter(Boolean)
        .join('/'),
    album:
      typeof source.album === 'string'
        ? source.album
        : source.album?.name || source.album?.title || source.albumname || '',
    duration: Number(source.duration || source.interval) || 0,
    mediaMid: source.mediaMid || source.media_mid || source.file?.media_mid || '',
    id: Number(source.id) || 0,
    albumMid: source.albumMid || album?.mid || '',
  };
}
