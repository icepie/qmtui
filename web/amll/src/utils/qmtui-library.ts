/* qmtui 修改：库数据层
 *
 * 上游的数据层（src/utils/db-client.ts）通过 Tauri 命令读写 Rust 侧的 SQLite。
 * 浏览器里没有那层，这里用 qmtui 的 HTTP 接口实现同一批命令：
 *   get_all_playlists / get_playlist / get_playlist_songs / get_song / get_songs_by_ids
 *   create_playlist / delete_playlist / add_songs_to_playlist / remove_song_from_playlist
 * 其余命令（本地文件夹扫描、歌词库、任务栏等）一律安全空实现。
 *
 * 歌单与歌曲在首次使用时整体同步一次，之后走内存缓存；快照还会存进
 * localStorage（带 TTL），这样刷新页面不必重取整个曲库（1457 首要 12+ 次分页请求）。
 */

type QmtuiSong = Record<string, unknown> & { mid?: string; id?: number };

export interface LibSong {
	id: string;
	filePath: string;
	songName: string;
	songArtists: string;
	songAlbum: string;
	duration: number;
	lyricFormat: string;
	lyric: string;
	translatedLrc: null;
	romanLrc: null;
	coverPath: string | null;
	modifiedAt: null;
}

export interface LibPlaylist {
	id: number;
	name: string;
	createTime: number;
	updateTime: number;
	playTime: number;
	coverPath: string | null;
	songIds: string[];
}

const songs = new Map<string, LibSong>();
const rawSongs = new Map<string, QmtuiSong>();
const playlists = new Map<number, LibPlaylist>();
let syncPromise: Promise<void> | null = null;

// qmtui 修改：曲库快照跨页面复用，避免每次打开都全量同步
const SNAPSHOT_KEY = "qmtui.library.snapshot";
const SNAPSHOT_TTL_MS = 60_000;
const SNAPSHOT_MAX_BYTES = 4 * 1024 * 1024;

function saveSnapshot(): void {
	try {
		const payload = JSON.stringify({
			at: Date.now(),
			songs: [...songs.entries()],
			raw: [...rawSongs.entries()],
			playlists: [...playlists.entries()],
		});
		// localStorage 一般只有 5MB，曲库过大时宁可不缓存也不要写坏
		if (payload.length > SNAPSHOT_MAX_BYTES) return;
		localStorage.setItem(SNAPSHOT_KEY, payload);
	} catch (error) {
		console.warn("[qmtui] 曲库快照保存失败", error);
	}
}

function loadSnapshot(): boolean {
	try {
		const raw = localStorage.getItem(SNAPSHOT_KEY);
		if (!raw) return false;
		const data = JSON.parse(raw) as {
			at?: number;
			songs?: Array<[string, LibSong]>;
			raw?: Array<[string, QmtuiSong]>;
			playlists?: Array<[number, LibPlaylist]>;
		};
		if (!data?.at || Date.now() - data.at > SNAPSHOT_TTL_MS) return false;
		for (const [key, value] of data.playlists ?? []) playlists.set(key, value);
		for (const [key, value] of data.songs ?? []) songs.set(key, value);
		for (const [key, value] of data.raw ?? []) rawSongs.set(key, value);
		return playlists.size > 0;
	} catch (error) {
		console.warn("[qmtui] 曲库快照读取失败", error);
		return false;
	}
}

function dropSnapshot(): void {
	try {
		localStorage.removeItem(SNAPSHOT_KEY);
	} catch {
		// 忽略
	}
}

const coverUrl = (song: QmtuiSong) => {
	const albumMid = String(song.albumMid || "");
	const mid = String(song.mid || "");
	if (!albumMid && !mid) return null;
	return `/cover?mid=${encodeURIComponent(mid)}&albumMid=${encodeURIComponent(albumMid)}&size=300`;
};

function toLibSong(song: QmtuiSong): LibSong {
	const id = String(song.id ?? song.mid ?? "");
	const value: LibSong = {
		id,
		// filePath 在桌面端是本地路径；这里用 mid 作为不透明句柄（播放时回传给 CLI）
		filePath: String(song.mid || id),
		songName: String(song.title || song.name || ""),
		songArtists: String(song.artist || ""),
		songAlbum: typeof song.album === "string" ? song.album : "",
		duration: Number(song.duration) || 0,
		lyricFormat: "",
		lyric: "",
		translatedLrc: null,
		romanLrc: null,
		coverPath: coverUrl(song),
		modifiedAt: null,
	};
	songs.set(id, value);
	rawSongs.set(id, song);
	if (song.mid) rawSongs.set(String(song.mid), song);
	return value;
}

const json = async (path: string): Promise<Record<string, unknown>> => {
	const response = await fetch(path);
	if (!response.ok) throw new Error(`${path} -> ${response.status}`);
	return (await response.json()) as Record<string, unknown>;
};

const post = async (path: string, body?: unknown): Promise<void> => {
	await fetch(path, {
		method: "POST",
		headers: body ? { "Content-Type": "application/json" } : undefined,
		body: body ? JSON.stringify(body) : undefined,
	});
};

/** 并发上限内按序执行（本地接口很快，但别一次打太多）。 */
async function mapLimit<T, R>(
	items: T[],
	limit: number,
	worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let cursor = 0;
	const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
		while (true) {
			const index = cursor++;
			if (index >= items.length) return;
			results[index] = await worker(items[index], index);
		}
	});
	await Promise.all(runners);
	return results;
}

async function fetchPlaylistSongs(
	dirId: number,
	tid: number,
	isFav: boolean,
	songCount = 0,
): Promise<LibSong[]> {
	const page = (index: number) => `dirId=${dirId}&tid=${tid}&isFav=${isFav}&page=${index}`;
	const first = await json(`/api/library/playlist?${page(1)}`);
	const firstList = (first.songs as QmtuiSong[]) || [];
	const collected: LibSong[] = firstList.map((song) => toLibSong(song));
	if (!first.hasMore || firstList.length === 0) return collected;

	// 已知总数就能直接算出页数，剩下的页并发拉取（原来是一页页等）
	const pageSize = firstList.length;
	const totalPages = songCount > 0 ? Math.ceil(songCount / pageSize) : 2;
	const rest = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => i + 2);
	const pages = await mapLimit(rest, 8, async (index) => {
		try {
			return (await json(`/api/library/playlist?${page(index)}`)).songs as QmtuiSong[];
		} catch (error) {
			console.error("[qmtui] 拉取歌单分页失败", dirId, tid, index, error);
			return [] as QmtuiSong[];
		}
	});
	for (const list of pages) {
		for (const song of list || []) collected.push(toLibSong(song));
	}
	return collected;
}

/** 同步歌单与其全部歌曲；重复调用复用同一次同步。 */
export function syncQmtuiLibrary(): Promise<void> {
	if (syncPromise) return syncPromise;
	// 快照还新鲜就直接用，省掉整个曲库的同步请求
	if (playlists.size === 0 && loadSnapshot()) {
		syncPromise = Promise.resolve();
		return syncPromise;
	}
	syncPromise = (async () => {
		const data = await json("/api/library/playlists");
		const list = (data.playlists as Array<Record<string, unknown>>) || [];
		// 歌单之间也并发处理（每个歌单内部的分页同样并发）
		await mapLimit(list, 4, async (item) => {
			const dirId = Number(item.dirId) || 0;
			const tid = Number(item.tid) || 0;
			const isFav = Boolean(item.isFav);
			const id = tid || dirId;
			let songIds: string[] = [];
			try {
				const count = Number(item.songCount) || 0;
				songIds = (await fetchPlaylistSongs(dirId, tid, isFav, count)).map((song) => song.id);
			} catch (error) {
				console.error("[qmtui] 同步歌单失败", item.name, error);
			}
			playlists.set(id, {
				id,
				name: String(item.name || "未命名歌单"),
				createTime: 0,
				updateTime: 0,
				playTime: 0,
				coverPath: (item.picUrl as string) || null,
				songIds,
			});
		});
		saveSnapshot();
	})();
	return syncPromise;
}

/** 库内歌曲的原始载荷（播放时交给 CLI）。 */
export function rawQmtuiSong(id: string): QmtuiSong | undefined {
	return rawSongs.get(id);
}

export function qmtuiLibrarySongs(): QmtuiSong[] {
	return [...rawSongs.values()];
}

/** 供播放器接缝使用：把库内歌曲登记进播放解析表。 */
export function registerQmtuiSongs(register: (id: string, song: QmtuiSong) => void) {
	for (const [key, song] of rawSongs) if (key) register(key, song);
}

const QMTUI_COMMANDS = new Set([
	"get_all_playlists", "get_playlist", "get_playlist_songs", "get_song", "get_songs_by_ids",
	"create_playlist", "delete_playlist", "add_songs_to_playlist", "remove_song_from_playlist",
	"upsert_songs", "update_song", "update_playlist", "refresh_playlist", "scan_and_create_playlist",
	"link_playlist_folder", "unlink_playlist_folder", "get_playlist_folders", "cleanup_orphaned_covers",
	"save_playlist_cover", "clear_playlist_cover", "sync_lyrics", "search_lyrics", "get_lyric_detail",
	"migrate_songs_batch", "migrate_playlists_batch", "set_media_controls_enabled",
]);

// qmtui 修改：其它 Tauri 命令统一吞掉，返回 undefined（上层按可空处理）
const noop = async () => undefined;

export const isQmtuiCommand = (command: string) => QMTUI_COMMANDS.has(command);

/** 把上游的 Tauri 数据命令映射到 qmtui 接口。返回 undefined 表示“不是库命令”。 */
export async function runQmtuiCommand(
	command: string,
	args?: Record<string, unknown>,
): Promise<unknown> {
	switch (command) {
		case "get_all_playlists":
			await syncQmtuiLibrary();
			return [...playlists.values()];

		case "get_playlist":
			await syncQmtuiLibrary();
			return playlists.get(Number(args?.id) || 0);

		case "get_playlist_songs": {
			await syncQmtuiLibrary();
			const playlist = playlists.get(Number(args?.playlistId) || 0);
			return (playlist?.songIds || []).map((id) => songs.get(id)).filter(Boolean);
		}

		case "get_song":
			await syncQmtuiLibrary();
			return songs.get(String(args?.id || ""));

		case "get_songs_by_ids": {
			await syncQmtuiLibrary();
			const ids = (args?.ids as string[]) || [];
			return ids.map((id) => songs.get(id)).filter(Boolean);
		}

		case "create_playlist": {
			await post("/api/library/playlist/create", { name: String(args?.name || "新建歌单") });
			syncPromise = null;
			dropSnapshot();
			await syncQmtuiLibrary();
			return [...playlists.values()].slice(-1)[0]?.id ?? 0;
		}

		case "delete_playlist": {
			const playlist = playlists.get(Number(args?.id) || 0);
			if (playlist) {
				await post("/api/library/playlist/delete", { dirId: playlist.id, tid: playlist.id });
			}
			return undefined;
		}

		case "add_songs_to_playlist": {
			const playlist = playlists.get(Number(args?.playlistId) || 0);
			const ids = (args?.songIds as string[]) || [];
			if (playlist) {
				for (const id of ids) {
					const song = rawSongs.get(id);
					if (song) {
						await post("/api/library/playlist/song/add", {
							dirId: playlist.id,
							tid: playlist.id,
							song,
						});
					}
				}
			}
			return undefined;
		}

		case "remove_song_from_playlist": {
			const playlist = playlists.get(Number(args?.playlistId) || 0);
			const song = rawSongs.get(String(args?.songId || ""));
			if (playlist && song) {
				await post("/api/library/playlist/song/remove", {
					dirId: playlist.id,
					tid: playlist.id,
					song,
				});
			}
			return undefined;
		}

		// 写入型/本地能力：Web 端无对应实现，安全空实现即可
		case "upsert_songs":
		case "update_song":
		case "update_playlist":
		case "refresh_playlist":
		case "scan_and_create_playlist":
		case "link_playlist_folder":
		case "unlink_playlist_folder":
		case "get_playlist_folders":
		case "cleanup_orphaned_covers":
		case "save_playlist_cover":
		case "clear_playlist_cover":
		case "sync_lyrics":
		case "search_lyrics":
		case "get_lyric_detail":
		case "migrate_songs_batch":
		case "migrate_playlists_batch":
		case "set_media_controls_enabled":
		case "open_taskbar_lyric":
		case "close_taskbar_lyric":
		case "open_taskbar_lyric_devtools":
		case "open_screenshot_window":
		case "take_screenshot":
		case "restart_app":
		case "extension_window_mark_ready":
		case "ws_broadcast_payload":
		case "ws_close_connection":
		case "ws_reopen_connection":
		case "set_window_always_on_top":
			await noop();
			return command === "get_playlist_folders" ? [] : undefined;

		default:
			return undefined;
	}
}

/** 云端搜索（QQ 曲库）：返回与库内同构的歌曲/歌单，并登记歌曲以便点击即播。 */
export async function searchQmtuiCloud(keyword: string): Promise<{
	songs: LibSong[];
	playlists: LibPlaylist[];
}> {
	const query = keyword.trim();
	if (!query) return { songs: [], playlists: [] };
	const encoded = encodeURIComponent(query);
	const songs: LibSong[] = [];
	try {
		const data = await json(`/api/library/search?query=${encoded}&page=1`);
		for (const item of (data.songs as QmtuiSong[]) || []) songs.push(toLibSong(item));
	} catch (error) {
		console.error("[qmtui] 云端搜索歌曲失败", error);
	}
	const playlists: LibPlaylist[] = [];
	try {
		const data = await json(`/api/library/search/playlists?query=${encoded}`);
		for (const item of (data.playlists as Array<Record<string, unknown>>) || []) {
			playlists.push({
				id: Number(item.tid || item.dirId) || 0,
				name: String(item.name || ""),
				createTime: 0,
				updateTime: 0,
				playTime: 0,
				coverPath: (item.picUrl as string) || null,
				songIds: [],
			});
		}
	} catch (error) {
		console.error("[qmtui] 云端搜索歌单失败", error);
	}
	return { songs, playlists };
}

/** 当前「我喜欢」里的歌曲 mid 集合（用于判断某首歌是否已收藏）。 */
export async function qmtuiFavoriteMids(): Promise<Set<string>> {
	try {
		const data = await json("/api/library/favorites/ids");
		return new Set(((data.mids as string[]) || []).map((mid) => String(mid)));
	} catch (error) {
		console.error("[qmtui] 读取收藏列表失败", error);
		return new Set();
	}
}

/** 设置某首歌的「喜欢」状态（交给 CLI 的收藏接口处理）。 */
export async function qmtuiSetSongFavorite(song: QmtuiSong, favorite: boolean): Promise<boolean> {
	try {
		const response = await fetch("/api/library/song/favorite", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ song, favorite }),
		});
		return response.ok;
	} catch (error) {
		console.error("[qmtui] 收藏失败", error);
		return false;
	}
}

/** 歌单是否已收藏。 */
export async function qmtuiPlaylistFavorite(tid: number): Promise<boolean> {
	try {
		const data = await json(`/api/library/playlist/favorite?tid=${tid}`);
		return Boolean(data.isFavorite ?? data.IsFavorite);
	} catch (error) {
		console.error("[qmtui] 读取歌单收藏状态失败", error);
		return false;
	}
}

/** 收藏 / 取消收藏歌单。 */
export async function qmtuiSetPlaylistFavorite(tid: number, favorite: boolean): Promise<boolean> {
	try {
		const response = await fetch("/api/library/playlist/favorite", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ tid, favorite }),
		});
		return response.ok;
	} catch (error) {
		console.error("[qmtui] 收藏歌单失败", error);
		return false;
	}
}

export interface QmtuiSingerHit {
	mid: string;
	name: string;
	picUrl: string;
}

export interface QmtuiAlbumHit {
	mid: string;
	title: string;
	artist: string;
	coverUrl: string;
	songCount: number;
}

/** 云端搜索歌手与专辑（用于搜索页的歌手/专辑结果）。 */
export async function searchQmtuiSingersAndAlbums(keyword: string): Promise<{
	singers: QmtuiSingerHit[];
	albums: QmtuiAlbumHit[];
}> {
	const query = keyword.trim();
	if (!query) return { singers: [], albums: [] };
	const encoded = encodeURIComponent(query);
	const singers: QmtuiSingerHit[] = [];
	const albums: QmtuiAlbumHit[] = [];
	try {
		const data = await json(`/api/library/search/singers?query=${encoded}`);
		for (const item of (data.singers as Array<Record<string, unknown>>) || []) {
			if (!item.mid) continue;
			singers.push({
				mid: String(item.mid),
				name: String(item.name || item.title || ""),
				picUrl: String(item.picUrl || ""),
			});
		}
	} catch (error) {
		console.error("[qmtui] 搜索歌手失败", error);
	}
	try {
		const data = await json(`/api/library/search/albums?query=${encoded}`);
		for (const item of (data.albums as Array<Record<string, unknown>>) || []) {
			if (!item.mid) continue;
			albums.push({
				mid: String(item.mid),
				title: String(item.title || item.name || ""),
				artist: String(item.artist || ""),
				coverUrl: String(item.coverUrl || ""),
				songCount: Number(item.songCount) || 0,
			});
		}
	} catch (error) {
		console.error("[qmtui] 搜索专辑失败", error);
	}
	return { singers, albums };
}
