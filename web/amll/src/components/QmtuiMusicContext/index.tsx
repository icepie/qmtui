/* qmtui 修改：qmtui 音源组件
 *
 * 与 LocalMusicContext 同构，但数据来自 qmtui 后端：
 *  - 显示（歌名/歌手/专辑/封面/歌词/进度/音量/播放态）来自 /api/ws 状态帧；
 *  - 控制（播放暂停/上下首/进度/音量/模式）回给 CLI，音频始终由 CLI 输出。
 */
import {
	musicAlbumNameAtom,
	musicArtistsAtom,
	musicCoverAtom,
	musicDurationAtom,
	musicIdAtom,
	musicLyricLinesAtom,
	musicNameAtom,
	musicPlayingAtom,
	musicPlayingPositionAtom,
	musicVolumeAtom,
	hideLyricViewAtom,
	isLyricPageOpenedAtom,
	onChangeVolumeAtom,
	onClickControlThumbAtom,
	onCycleRepeatModeAtom,
	onLyricLineClickAtom,
	onPlayOrResumeAtom,
	onRequestNextSongAtom,
	onRequestPrevSongAtom,
	onSeekPositionAtom,
	onToggleShuffleAtom,
} from "@applemusic-like-lyrics/react-full";
import { useStore } from "jotai";
import { type FC, useEffect, useRef } from "react";
import {
	initAudioThread,
	listenQmtuiFrames,
	qmtuiQualityAtom,
	setQmtuiLibraryLookup,
	setQmtuiQueueProvider,
} from "../../utils/player.ts";
// qmtui 修改：播放队列（右键「播放」「下一首播放」与播放列表面板都依赖它）
import { playlistCardOpenedAtom, queueManagerAtom } from "../../states/appAtoms.ts";
import { PlayQueueManager, queuePlaylistAtom } from "../../utils/play-queue-manager.ts";
import { rawQmtuiSong } from "../../utils/qmtui-library.ts";

const post = (path: string, body?: unknown) =>
	fetch(path, {
		method: "POST",
		headers: body ? { "Content-Type": "application/json" } : undefined,
		body: body ? JSON.stringify(body) : undefined,
	}).catch(() => undefined);

const coverOf = (song: Record<string, unknown>) => {
	if (song.picUrl || song.picurl) return String(song.picUrl || song.picurl);
	const albumMid = String(song.albumMid || "");
	const mid = String(song.mid || "");
	// qmtui 修改：优先用 QQ CDN 小图（约 20KB）；/cover 代理会返回 1.6MB 原图
	if (albumMid) return `https://y.qq.com/music/photo_new/T002R500x500M000${albumMid}.jpg`;
	if (mid) return `/cover?mid=${encodeURIComponent(mid)}&albumMid=&size=500`;
	return "";
};

const toLyricLines = (lyrics: unknown) => {
	const source = (Array.isArray(lyrics) ? lyrics : [])
		.map((line) => {
			const raw = line as Record<string, unknown>;
			// qmtui 修改：后端给了词级时间就按词拆，AMLL 会渲染逐字高亮
			const rawWords = Array.isArray(raw.words) ? (raw.words as Record<string, unknown>[]) : [];
			const words = rawWords
				.map((word) => ({
					word: String(word.text ?? ""),
					startTime: Number(word.startMs) || 0,
					endTime: Number(word.endMs) || 0,
				}))
				.filter((word) => word.word.length > 0);
			return {
				start: Number(raw.timeMs) || 0,
				text: String(raw.text || ""),
				trans: String(raw.trans || ""),
				words,
			};
		})
		.filter((line) => line.text.trim().length > 0);
	const lines: Array<Record<string, unknown>> = [];
	for (let i = 0; i < source.length; i++) {
		const start = source[i].start;
		const end = i + 1 < source.length ? source[i + 1].start : start + 5000;
		if (end <= start) continue;
		lines.push({
			// 有词级时间就用它（逐字），否则整行一个字
			words:
				source[i].words.length > 0
					? source[i].words
					: [{ word: source[i].text, startTime: start, endTime: end }],
			startTime: start,
			endTime: end,
			translatedLyric: source[i].trans || undefined,
		});
	}
	return lines;
};

let lastMode = "list_loop";

export const QmtuiMusicContext: FC = () => {
	const store = useStore();
	// qmtui 修改：放大播放器（歌词页）里的音量控制
	const anchorRef = useRef<{ position: number; timestamp: number } | null>(null);
	const playingRef = useRef(false);
	const lastFramePosRef = useRef(-1);
	const lyricSignatureRef = useRef("");

	useEffect(() => {
		initAudioThread();
		setQmtuiLibraryLookup((id) => rawQmtuiSong(id));
		const toEmit = <T,>(onEmit: T) => ({ onEmit });

		store.set(
			onPlayOrResumeAtom,
			toEmit(() => {
				void post("/api/toggle");
			}),
		);
		store.set(
			onRequestNextSongAtom,
			toEmit(() => {
				void post("/api/next");
			}),
		);
		store.set(
			onRequestPrevSongAtom,
			toEmit(() => {
				void post("/api/previous");
			}),
		);
		store.set(
			onSeekPositionAtom,
			toEmit((time: number) => {
				void post(`/api/seek?pos=${(Math.max(0, Number(time) || 0) / 1000).toFixed(2)}`);
			}),
		);
		store.set(
			onChangeVolumeAtom,
			toEmit((volume: number) => {
				// 框架的音量控件是归一化的 0~1，CLI 收 0~100
				const normalized = Math.max(0, Math.min(1, Number(volume) || 0));
				void post("/api/action", { action: "volume", volume: Math.round(normalized * 100) });
			}),
		);
		store.set(
			onToggleShuffleAtom,
			toEmit(() => {
				lastMode = lastMode === "shuffle" ? "list_loop" : "shuffle";
				void post("/api/action", { action: "set_mode", mode: lastMode });
			}),
		);
		store.set(
			onCycleRepeatModeAtom,
			toEmit(() => {
				lastMode = lastMode === "single_loop" ? "list_loop" : "single_loop";
				void post("/api/action", { action: "set_mode", mode: lastMode });
			}),
		);
		// 专辑图上方那条控制横条：框架文档说明「通常用于关闭歌词页面」，
		// 官方音源都留空，所以点了没反应；这里按本意接上。
		store.set(
			onClickControlThumbAtom,
			toEmit(() => {
				store.set(isLyricPageOpenedAtom, false);
				store.set(hideLyricViewAtom, false);
			}),
		);
		// 点击歌词行定位：框架的 PrebuiltLyricPlayer 已经把内核播放位置跳到该行起点
		// （evt.line.getLine().startTime），这里只需把同一时间同步给 CLI。
		// 用行时间而不是反查文本，副歌里重复的句子才能各自跳到自己那一句。
		store.set(onLyricLineClickAtom, {
			onEmit: (evt) => {
				const startTime = evt?.line?.getLine?.()?.startTime;
				if (typeof startTime !== "number" || !Number.isFinite(startTime)) return;
				void post(`/api/seek?pos=${(Math.max(0, startTime) / 1000).toFixed(2)}`);
			},
		});

		// 专辑图上方那条控制横条：框架文档说明「通常用于关闭歌词页面」，但它的
		// onClickControlThumb 回调在浏览器里不触发，这里直接监听点击。
		const onDocumentClick = (event: MouseEvent) => {
			const target = event.target instanceof Element ? event.target : null;
			if (!target) return;
			// qmtui 修改：框架底部那排按钮里，最后一个 Playlist 没有回调，这里把它接到队列面板。
			// AirPlay 在浏览器里没有对应能力，但保留按钮作为装饰（框架本就没给回调，点了也没副作用）。
			const toggleButtons = Array.from(
				document.querySelectorAll('[class*="toggleIconButton"]'),
			);
			const toggle = target.closest('[class*="toggleIconButton"]');
			if (toggle) {
				const index = toggleButtons.indexOf(toggle);
				if (index === toggleButtons.length - 1) {
					event.preventDefault();
					event.stopPropagation();
					store.set(playlistCardOpenedAtom, true);
					return;
				}
			}
			if (target.closest('[class*="controlThumb"]')) {
				// 上游只有 Esc 一条关闭路径（AMLLWrapper 里的 keydown 监听），
				// 这里复用它的处理逻辑，保证与桌面端一致。
				window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
				store.set(isLyricPageOpenedAtom, false);
				return;
			}
		};
		document.addEventListener("click", onDocumentClick, true);

		const queueManager = new PlayQueueManager(store);
		store.set(queueManagerAtom, queueManager);
		// qmtui 修改：把队列管理器里的真队列交给播放桥（随机播放要在这个范围内随机）
		setQmtuiQueueProvider(() =>
			store
				.get(queuePlaylistAtom)
				.map((song) => rawQmtuiSong(String(song.id)))
				.filter((song): song is Record<string, unknown> => Boolean(song)),
		);
		const queueSignatureRef = { current: "" };

		const unlisten = listenQmtuiFrames((frame) => {
			// qmtui 修改：用 CLI 的队列填充管理器（只填一次），供播放列表面板与
			// 右键菜单的「播放」「下一首播放」使用；CLI 仍是唯一的播放方，
			// 所以只写内部列表，不调用会触发播放的 setQueue。
			// qmtui 修改：把 CLI 的队列同步给播放列表面板。CLI 才是播放方，
			// 所以只写管理器的内部列表并同步原子，不调用会触发播放的 setQueue。
			const queueList = Array.isArray(frame.songList) ? (frame.songList as Record<string, unknown>[]) : [];
			const currentId = String((frame.song as Record<string, unknown> | null)?.id ?? "");
			if (queueList.length > 0) {
				const first = String(queueList[0]?.id ?? "");
				const last = String(queueList[queueList.length - 1]?.id ?? "");
				const signature = `${queueList.length}:${first}:${last}:${currentId}`;
				if (signature !== queueSignatureRef.current) {
					queueSignatureRef.current = signature;
					const queueSongs = queueList.map((item) => ({
						id: String(item.id ?? item.mid ?? ""),
						filePath: "",
						songName: String(item.title ?? ""),
						songArtists: String(item.artist ?? ""),
						songAlbum: String(item.album ?? ""),
						duration: Number(item.duration) || 0,
						lyricFormat: "",
						lyric: "",
						// 面板直接用这个地址显示封面（与 CLI 的取图地址一致）
						coverPath: item.albumMid
							? `https://y.qq.com/music/photo_new/T002R300x300M000${String(item.albumMid)}.jpg`
							: null,
					}));
					const internal = queueManager as unknown as {
						originalList: unknown[];
						playList: unknown[];
						currentIndex: number;
						syncToAtoms?: () => void;
					};
					internal.originalList = [...queueSongs];
					internal.playList = [...queueSongs];
					const index = queueSongs.findIndex((item) => item.id === currentId);
					internal.currentIndex = index >= 0 ? index : 0;
					internal.syncToAtoms?.();
				}
			}
			const song = (frame.song ?? null) as Record<string, unknown> | null;
			if (song) {
				store.set(musicIdAtom, String(song.mid || ""));
				store.set(musicNameAtom, String(song.title || song.name || ""));
				store.set(
					musicArtistsAtom,
					String(song.artist || "")
						.split("/")
						.map((name) => ({ id: "", name: name.trim() }))
						.filter((artist) => artist.name),
				);
				store.set(
					musicAlbumNameAtom,
					typeof song.album === "string" ? song.album : String(song.albumMid || ""),
				);
				store.set(musicCoverAtom, coverOf(song));
				if (Array.isArray(frame.lyrics)) {
					// 只在歌词内容真正变化时写入：每帧写入新数组会让 AMLL 重建整屏歌词（整屏乱跳）
					const lines = frame.lyrics as Array<Record<string, unknown>>;
					const last = lines[lines.length - 1];
					const signature = `${lines.length}:${String(lines[0]?.timeMs ?? "")}:${String(last?.timeMs ?? "")}:${String(lines[0]?.text ?? "").slice(0, 8)}`;
					if (signature !== lyricSignatureRef.current) {
						lyricSignatureRef.current = signature;
						store.set(musicLyricLinesAtom, toLyricLines(frame.lyrics) as never);
					}
				}
			}
			// qmtui 修改：把当前音质与可用档位交给界面
			if (Number.isFinite(Number(frame.qualityTier))) {
				store.set(qmtuiQualityAtom, {
					tier: Number(frame.qualityTier),
					badge: String(frame.qualityBadge || ""),
					available: Array.isArray(frame.availableQualityTiers)
						? (frame.availableQualityTiers as number[]).map((tier) => Number(tier))
						: [],
				});
			}
			if (Number.isFinite(Number(frame.volume))) {
				// 框架的音量控件是 0~1，CLI 给的是 0~100
				store.set(musicVolumeAtom, Math.max(0, Math.min(1, Number(frame.volume) / 100)));
			}
			if (Number(frame.duration) > 0) {
				store.set(musicDurationAtom, (Number(frame.duration) * 1000) | 0);
			}
			if (typeof frame.isPlaying === "boolean") {
				store.set(musicPlayingAtom, Boolean(frame.isPlaying));
			}
			// 只有本组件推进时间轴：状态帧只作为锚点。
			// CLI 侧的 position 是粗粒度的，如果每帧都覆盖，歌词会整体来回跳；
			// 因此仅当偏差超过阈值（真 seek / 换曲 / 长暂停）时才重新对齐。
			const frameMs = ((Number(frame.position) || 0) * 1000) | 0;
			// 后端状态帧较稀疏：只有“明确暂停且没有推进”才停表，其余一律按播放中计时
			const advancing = frameMs > lastFramePosRef.current;
			lastFramePosRef.current = frameMs;
			playingRef.current = advancing || frame.isPlaying !== false;
			const anchor = anchorRef.current;
			const elapsed = anchor ? performance.now() - anchor.timestamp : 0;
			const expected = anchor ? anchor.position + (playingRef.current ? elapsed : 0) : frameMs;
			const drift = frameMs - expected;
			if (!anchor || Math.abs(drift) > 150) {
				// 偏差超过 150ms 就对齐：后端状态帧约 1s 一帧，阈值过松会让歌词稳定慢半拍
				anchorRef.current = { position: frameMs, timestamp: performance.now() };
				store.set(musicPlayingPositionAtom, frameMs);
			}
			if (Number.isFinite(Number(frame.mode))) lastMode = String(frame.mode);
		});

		// 本地位移插值：状态帧是粗粒度的，歌词要按 60fps 平滑推进，否则会一格一格跳。
		let rafId = 0;
		const tick = () => {
			const anchor = anchorRef.current;
			if (anchor) {
				const elapsed = playingRef.current ? performance.now() - anchor.timestamp : 0;
				const duration = store.get(musicDurationAtom);
				// 平滑完全来自这里的 60fps 推进（不再做单调钳制，否则会锁死时间轴）
				const next = anchor.position + elapsed;
				store.set(musicPlayingPositionAtom, duration > 0 ? Math.min(next, duration) : next);
			}
			rafId = requestAnimationFrame(tick);
		};
		rafId = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(rafId);
			document.removeEventListener("click", onDocumentClick, true);
			unlisten();
		};
	}, [store]);

	// qmtui 修改：放大播放器上那层「自动隐藏鼠标」的透明遮罩会吞掉所有点击，
	// 它是点歌词无法定位的根因；它只该隐藏光标，不该拦截指针事件。
	return (
		<style>{"[class*='cursorHiddenOverlay']{pointer-events:none !important;}"}</style>
	);
};
