import { invoke } from "@tauri-apps/api/core";
import { type EventCallback, listen } from "@tauri-apps/api/event";
import chalk from "chalk";
import { atom } from "jotai";
import { uid } from "uid";

export interface AudioThreadEventMessage<T> {
	callbackId: string;
	data: T;
}

export interface AudioQuality {
	sampleRate?: number;
	bitsPerCodedSample?: number;
	bitsPerSample?: number;
	channels?: number;
	sampleFormat?: string;
	codec?: string;
}

export interface AudioInfo {
	name: string;
	artist: string;
	album: string;
	lyric: string;
	duration: number;
	position: number;
}

export interface SongData {
	filePath: string;
	songId?: string;
}

export type AudioThreadMessageMap = {
	resumeAudio: undefined;
	pauseAudio: undefined;
	resumeOrPauseAudio: undefined;
	seekAudio: {
		position: number;
	};
	playAudio: {
		song: SongData;
	};
	setVolume: {
		volume: number;
	};
	setVolumeRelative: {
		volume: number;
	};
	setAudioOutput: {
		name: string;
	};
	setFFTRange: {
		fromFreq: number;
		toFreq: number;
	};
	setMediaControlsEnabled: {
		enabled: boolean;
	};
	close: undefined;
	updatePlayMode: {
		isShuffling: boolean;
		repeatMode: "off" | "all" | "one";
	};
};

export type AudioThreadMessageKeys = keyof AudioThreadMessageMap;

export type AudioThreadMessagePayloadMap = {
	[T in AudioThreadMessageKeys]: AudioThreadMessageMap[T] extends undefined
		? { type: T }
		: { type: T } & AudioThreadMessageMap[T];
};

export type AudioThreadMessage =
	AudioThreadMessagePayloadMap[AudioThreadMessageKeys];

export type AudioThreadEvent =
	| {
			type: "playPosition";
			data: { position: number };
	  }
	| {
			type: "loadProgress";
			data: { position: number };
	  }
	| {
			type: "loadAudio";
			data: {
				musicId: string;
				musicInfo: AudioInfo;
				quality: AudioQuality;
			};
	  }
	| {
			type: "loadingAudio";
			data: { musicId: string };
	  }
	| {
			type: "audioPlayFinished";
			data: { musicId: string };
	  }
	| {
			type: "trackEnded";
	  }
	| {
			type: "hardwareMediaCommand";
			data: { command: string };
	  }
	| {
			type: "playStatus";
			data: { isPlaying: boolean };
	  }
	| {
			type: "loadError";
			data: { error: string };
	  }
	| {
			type: "playError";
			data: { error: string };
	  }
	| {
			type: "volumeChanged";
			data: { volume: number };
	  }
	| {
			type: "fftData";
			data: { data: number[] };
	  };

const msgTasks = new Map<string, (value: AudioThreadEvent) => void>();
const eventListeners = new Set<
	EventCallback<AudioThreadEventMessage<AudioThreadEvent>>
>();

let isInitialized = false;

export async function initAudioThread() {
	if (isInitialized) {
		return;
	}
	isInitialized = true;
	// qmtui 修改：原来的 Rust 音频线程事件，改用 /api/ws 的状态流合成。
	initQmtuiBridge();
}

export const listenAudioThreadEvent = (
	handler: EventCallback<AudioThreadEventMessage<AudioThreadEvent>>,
): Promise<() => void> => {
	eventListeners.add(handler);
	const unlisten = () => {
		eventListeners.delete(handler);
	};
	return Promise.resolve(unlisten);
};

export async function resolveContentUri(filePath: string): Promise<string> {
	return await invoke("resolve_content_uri", { filePath });
}

export async function readLocalMusicMetadata(filePath: string): Promise<{
	name: string;
	artist: string;
	album: string;
	lyricFormat: string;
	lyric: string;
	coverPath: string;
	duration: number;
}> {
	return await invoke("read_local_music_metadata", { filePath });
}

export async function saveCoverFromPath(
	songId: string,
	sourcePath: string,
): Promise<string> {
	return await invoke("save_cover_from_path", { songId, sourcePath });
}

export async function restartApp(): Promise<never> {
	return await invoke("restart_app");
}

export async function emitAudioThread<T extends keyof AudioThreadMessageMap>(
	msgType: T,
	...args: AudioThreadMessageMap[T] extends undefined
		? []
		: [data: AudioThreadMessageMap[T]]
): Promise<void> {
	// qmtui 修改：播放器消息翻译成 qmtui 后端接口调用。
	await qmtuiSendMessage(msgType as string, args[0] as Record<string, unknown> | undefined);
}

export function emitAudioThreadRet<T extends keyof AudioThreadMessageMap>(
	msgType: T,
	...args: AudioThreadMessageMap[T] extends undefined
		? []
		: [data: AudioThreadMessageMap[T]]
): Promise<AudioThreadEvent> {
	// qmtui 修改：没有回调式音频线程，直接执行并以当前状态合成回应。
	return qmtuiSendMessage(msgType as string, args[0] as Record<string, unknown> | undefined).then(
		() => qmtuiSynthLoadAudio() ?? ({ type: "trackEnded" } as AudioThreadEvent),
	);
}

/* ===== qmtui 修改：后端桥接（消息 -> /api/*，状态 <- /api/ws） ===== */
const qmtuiSongs = new Map<string, Record<string, unknown>>();
const qmtuiPrev = { songKey: "", isPlaying: false, volume: -1, position: -1 };
// qmtui 修改：缓存最近一帧的原始歌词（含 timeMs），供「点击歌词定位」使用
let qmtuiLyricCache: Array<{ text: string; timeMs: number }> = [];

/**
 * 按歌词文本查时间（毫秒），找不到返回 null。
 * @param occurrence 同一句歌词的第几次出现（从 0 开始，副歌会重复）
 */
export const qmtuiLyricTimeOf = (text: string, occurrence = 0): number | null => {
	const want = text.trim();
	if (!want) return null;
	let seen = 0;
	for (const line of qmtuiLyricCache) {
		if (!line.text || !want.includes(line.text)) continue;
		if (seen === occurrence) return line.timeMs;
		seen++;
	}
	return null;
};
let qmtuiLastFrame: Record<string, unknown> | null = null;
type QmtuiFrameListener = (frame: Record<string, unknown>) => void;
const qmtuiFrameListeners = new Set<QmtuiFrameListener>();

export function listenQmtuiFrames(handler: QmtuiFrameListener): () => void {
	qmtuiFrameListeners.add(handler);
	return () => qmtuiFrameListeners.delete(handler);
}

function qmtuiPost(path: string, body?: unknown): Promise<void> {
	return fetch(path, {
		method: "POST",
		headers: body ? { "Content-Type": "application/json" } : undefined,
		body: body ? JSON.stringify(body) : undefined,
	})
		.then(() => undefined)
		.catch((error) => console.error("[qmtui] 请求失败", path, error));
}

function qmtuiKey(song: Record<string, unknown> | null | undefined): string {
	if (!song) return "";
	return String(song.mid || song.id || "");
}

function qmtuiSynthLoadAudio(): AudioThreadEvent | null {
	const frame = qmtuiLastFrame;
	const song = (frame?.song ?? null) as Record<string, unknown> | null;
	if (!song) return null;
	return {
		type: "loadAudio",
		data: {
			musicId: qmtuiKey(song),
			musicInfo: {
				name: String(song.title || song.name || ""),
				artist: String(song.artist || ""),
				album: typeof song.album === "string" ? song.album : "",
				lyric: "",
				duration: Number(frame?.duration) || 0,
				position: Number(frame?.position) || 0,
			},
			quality: { codec: String(song.quality || "") },
		},
	};
}

function qmtuiDispatch(data: AudioThreadEvent) {
	const evt = {
		payload: { callbackId: "", data },
	} as unknown as AudioThreadEventMessage<AudioThreadEvent>;
	eventListeners.forEach((listener) => {
		try {
			listener(evt as never);
		} catch (error) {
			console.error("[qmtui] 事件派发失败", error);
		}
	});
}

function initQmtuiBridge() {
	const frameHandler = (frame: Record<string, unknown>) => {
		// 进度帧是增量的（位置/播放态/音量），合并进上一帧：qmtuiSynthLoadAudio 等
		// 消费方读的是这份状态，直接替换会让歌曲信息在下一个进度帧后消失。
		qmtuiLastFrame = qmtuiLastFrame ? { ...qmtuiLastFrame, ...frame } : frame;
		const state = qmtuiLastFrame;
		for (const listener of qmtuiFrameListeners) {
			try {
				listener(state);
			} catch (error) {
				console.error("[qmtui] 状态帧监听失败", error);
			}
		}
		const songList = Array.isArray(state.songList) ? state.songList : [];
		for (const item of songList as Record<string, unknown>[]) {
			const key = qmtuiKey(item);
			if (key) qmtuiSongs.set(key, item);
		}
		const song = (state.song ?? null) as Record<string, unknown> | null;
		const songKey = qmtuiKey(song);
		if (songKey && song) qmtuiSongs.set(songKey, song);

		const isPlaying = Boolean(state.isPlaying);
		const position = Number(state.position) || 0;
		const volume = Number(state.volume);

		if (Array.isArray(frame.lyrics)) {
			qmtuiLyricCache = (frame.lyrics as Array<Record<string, unknown>>)
				.map((line) => ({ text: String(line.text ?? "").trim(), timeMs: Number(line.timeMs) || 0 }))
				.filter((line) => line.text.length > 0);
		}
		if (songKey && songKey !== qmtuiPrev.songKey) {
			qmtuiPrev.songKey = songKey;
			const load = qmtuiSynthLoadAudio();
			if (load) qmtuiDispatch(load);
		}
		if (isPlaying !== qmtuiPrev.isPlaying) {
			qmtuiPrev.isPlaying = isPlaying;
			qmtuiDispatch({ type: "playStatus", data: { isPlaying } });
		}
		if (Number.isFinite(volume) && volume !== qmtuiPrev.volume) {
			qmtuiPrev.volume = volume;
			qmtuiDispatch({ type: "volumeChanged", data: { volume } });
		}
		if (position !== qmtuiPrev.position) {
			qmtuiPrev.position = position;
			// UI/AMLL 侧的时间单位是毫秒
			qmtuiDispatch({ type: "playPosition", data: { position: position * 1000 } });
		}
	};

	const connect = () => {
		const scheme = window.location.protocol === "https:" ? "wss" : "ws";
		const socket = new WebSocket(`${scheme}://${window.location.host}/api/ws`);
		socket.onmessage = (event) => {
			try {
				frameHandler(JSON.parse(event.data));
			} catch {
				/* 忽略非状态帧 */
			}
		};
		socket.onclose = () => setTimeout(connect, 1500);
	};
	connect();
}

let qmtuiLibraryLookup: ((id: string) => Record<string, unknown> | undefined) | null = null;
// qmtui 修改：当前播放队列由上下文提供（队列管理器里的真队列），
// 播放时作为 CLI 的队列上下文——否则随机播放会在整个曲库里随机。
let qmtuiQueueProvider: (() => Array<Record<string, unknown>>) | null = null;

export function setQmtuiQueueProvider(provider: (() => Array<Record<string, unknown>>) | null) {
	qmtuiQueueProvider = provider;
}

export function setQmtuiLibraryLookup(lookup: (id: string) => Record<string, unknown> | undefined) {
	qmtuiLibraryLookup = lookup;
}
const qmtuiLookupLibrarySong = (id: string) => qmtuiLibraryLookup?.(id);

async function qmtuiSendMessage(type: string, data?: Record<string, unknown>): Promise<void> {
	const rawSong = data?.song as Record<string, unknown> | undefined;
	const songKey = rawSong ? String(rawSong.songId || rawSong.filePath || "") : "";
	switch (type) {
		case "resumeAudio":
			if (!qmtuiPrev.isPlaying) await qmtuiPost("/api/toggle");
			break;
		case "pauseAudio":
			if (qmtuiPrev.isPlaying) await qmtuiPost("/api/toggle");
			break;
		case "resumeOrPauseAudio":
			await qmtuiPost("/api/toggle");
			break;
		case "seekAudio":
			await qmtuiPost(`/api/seek?pos=${Math.max(0, Number(data?.position) || 0).toFixed(2)}`);
			break;
		case "playAudio": {
			// 库内选中的歌（来自歌单/搜索）也要能解析
			const fromLibrary = qmtuiLookupLibrarySong(songKey);
			if (fromLibrary) qmtuiSongs.set(songKey, fromLibrary);
			const cached = qmtuiSongs.get(songKey);
			if (cached) {
				// 队列上下文：优先用真实队列（歌单/搜索的结果集），拿不到才退回已知歌曲
				const queue = qmtuiQueueProvider?.() ?? [];
				const context =
					queue.length > 0 ? [...queue] : [...qmtuiSongs.values()];
				const hasCurrent = context.some(
					(item) =>
						String(item.id) === String(cached.id) ||
						(cached.mid && String(item.mid) === String(cached.mid)),
				);
				if (!hasCurrent) context.unshift(cached);
				await qmtuiPost("/api/library/play", { song: cached, context });
			}
			break;
		}
		case "setVolume": {
			// 框架传 0~1，CLI 收 0~100（也兼容直接传 0~100 的调用）
			const raw = Number(data?.volume) || 0;
			const percent = raw <= 1 ? raw * 100 : raw;
			await qmtuiPost("/api/action", {
				action: "volume",
				volume: Math.max(0, Math.min(100, Math.round(percent))),
			});
			break;
		}
		case "setVolumeRelative": {
			const base = qmtuiPrev.volume < 0 ? 50 : qmtuiPrev.volume;
			await qmtuiPost("/api/action", {
				action: "volume",
				volume: Math.max(0, Math.min(100, base + (Number(data?.volume) || 0))),
			});
			break;
		}
		case "updatePlayMode": {
			const repeat = String(data?.repeatMode || "off");
			const mode = data?.isShuffling
				? "shuffle"
				: repeat === "one"
					? "single_loop"
					: repeat === "all"
						? "list_loop"
						: "sequential";
			await qmtuiPost("/api/action", { action: "set_mode", mode });
			break;
		}
		default:
			break;
	}
}

/** qmtui 修改：当前播放音质（来自状态帧），供界面展示与切换。 */
export const qmtuiQualityAtom = atom<{
	tier: number;
	badge: string;
	available: number[];
}>({ tier: 3, badge: "标准", available: [] });

/** 音质档位与 CLI 的徽标一致（AudioQualityHelper.GetBadge）。 */
export const QMTUI_QUALITY_LABELS: Array<{ tier: number; label: string }> = [
	{ tier: 0, label: "Hi-Res" },
	{ tier: 1, label: "SQ" },
	{ tier: 2, label: "HQ" },
	{ tier: 3, label: "标准" },
	{ tier: 4, label: "母带" },
	{ tier: 5, label: "臻品" },
	{ tier: 6, label: "5.1" },
	{ tier: 7, label: "7.1" },
	{ tier: 8, label: "杜比" },
];

/** 请求切换音质档位。 */
export async function qmtuiSetQuality(tier: number): Promise<void> {
	await fetch("/api/quality", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ tier }),
	}).catch(() => undefined);
}

/** 音质档位 -> 下载接口的音质键（与 AudioQualityHelper / 旧前端一致）。 */
export const QMTUI_QUALITY_KEYS: Record<number, string> = {
	0: "hires",
	1: "flac",
	2: "320k",
	3: "128k",
	4: "master",
	5: "deluxe",
	6: "atmos51",
	7: "atmos71",
	8: "dolby",
};
