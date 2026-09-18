import { invoke } from "@tauri-apps/api/core";
import { type EventCallback, listen } from "@tauri-apps/api/event";
import chalk from "chalk";
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
		qmtuiLastFrame = frame;
		for (const listener of qmtuiFrameListeners) {
			try {
				listener(frame);
			} catch (error) {
				console.error("[qmtui] 状态帧监听失败", error);
			}
		}
		const songList = Array.isArray(frame.songList) ? frame.songList : [];
		for (const item of songList as Record<string, unknown>[]) {
			const key = qmtuiKey(item);
			if (key) qmtuiSongs.set(key, item);
		}
		const song = (frame.song ?? null) as Record<string, unknown> | null;
		const songKey = qmtuiKey(song);
		if (songKey && song) qmtuiSongs.set(songKey, song);

		const isPlaying = Boolean(frame.isPlaying);
		const position = Number(frame.position) || 0;
		const volume = Number(frame.volume);

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
			const cached = qmtuiSongs.get(songKey);
			if (cached) {
				await qmtuiPost("/api/library/play", { song: cached, context: [...qmtuiSongs.values()] });
			}
			break;
		}
		case "setVolume":
			await qmtuiPost("/api/action", {
				action: "volume",
				volume: Math.max(0, Math.min(100, Number(data?.volume) || 0)),
			});
			break;
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
