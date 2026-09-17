/**
 * Mutable UI state shared across the bridge modules. Fields are null until the
 * player/runtime are wired up during bootstrap.
 * @type {{
 *   player: unknown;
 *   remote: unknown;
 *   applying: boolean;
 *   source: unknown;
 *   reconnectTimer: ReturnType<typeof setTimeout> | null;
 *   currentSongKey: string;
 *   currentDuration: number;
 *   currentLyricSignature: string;
 *   currentQueueKey: string;
 * lastPlaybackState: unknown;
 * lastPosition: unknown;
 * lastVolume: unknown;
 * lastAudibleVolume: number | null;
 *   lastQualitySignature: string;
 *   lastProgressRenderAt: number;
 *   progressTicker: ReturnType<typeof setInterval> | null;
 *   progressAnchorPosition: number;
 *   progressAnchorTime: number;
 *   favoriteBusy: boolean;
 *   accountKey: string;
 *   account: Record<string, unknown> | null;
 *   pendingFavoriteState: boolean | null;
 *   favoriteResultTimer: ReturnType<typeof setTimeout> | null;
 *   favoriteKeys: Set<string>;
 *   favoriteKeysLoaded: boolean;
 *   favoriteKeysAttempts: number;
 *   favoriteKeysTimer: ReturnType<typeof setTimeout> | null;
 *   lastFavoriteSignature: string;
 *   lastList: { host: Element; songs: import('./media.js').SongPayload[] } | null;
 *   runtime: unknown;
 *   playlists: Map<string, Record<string, unknown>>;
 *   albums: Map<string, import('./media.js').AlbumPayload>;
 *   songs: Map<string, import('./media.js').SongPayload>;
 *   routeToken: number;
 *   loginPoll: ReturnType<typeof setInterval> | null;
 * }}
 */
export const state = {
  player: null,
  remote: null,
  applying: false,
  source: null,
  reconnectTimer: null,
  currentSongKey: '',
  currentDuration: 0,
  currentLyricSignature: '',
  currentQueueKey: '',
  lastPlaybackState: null,
  lastPosition: null,
  lastVolume: null,
  lastAudibleVolume: null,
  lastQualitySignature: '',
  lastProgressRenderAt: 0,
  progressTicker: null,
  progressAnchorPosition: 0,
  progressAnchorTime: 0,
  favoriteBusy: false,
  accountKey: '',
  account: null,
  pendingFavoriteState: null,
  favoriteResultTimer: null,
  favoriteKeys: new Set(),
  favoriteKeysLoaded: false,
  favoriteKeysAttempts: 0,
  favoriteKeysTimer: null,
  lastFavoriteSignature: '',
  lastList: null,
  runtime: null,
  playlists: new Map(),
  albums: new Map(),
  songs: new Map(),
  routeToken: 0,
  loginPoll: null,
};
