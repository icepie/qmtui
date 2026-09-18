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
import { initAudioThread, listenQmtuiFrames, setQmtuiLibraryLookup } from "../../utils/player.ts";
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
	if (!albumMid && !mid) return "";
	return `/cover?mid=${encodeURIComponent(mid)}&albumMid=${encodeURIComponent(albumMid)}&size=500`;
};

const toLyricLines = (lyrics: unknown) => {
	const source = (Array.isArray(lyrics) ? lyrics : [])
		.map((line) => ({
			start: Number((line as Record<string, unknown>).timeMs) || 0,
			text: String((line as Record<string, unknown>).text || ""),
			trans: String((line as Record<string, unknown>).trans || ""),
		}))
		.filter((line) => line.text.trim().length > 0);
	const lines: Array<Record<string, unknown>> = [];
	for (let i = 0; i < source.length; i++) {
		const start = source[i].start;
		const end = i + 1 < source.length ? source[i + 1].start : start + 5000;
		if (end <= start) continue;
		lines.push({
			words: [{ word: source[i].text, startTime: start, endTime: end }],
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
				void post("/api/action", { action: "volume", volume });
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
		store.set(
			onLyricLineClickAtom,
			toEmit((line: { startTime?: number } | number) => {
				const ms = typeof line === "number" ? line : Number(line?.startTime) || 0;
				void post(`/api/seek?pos=${(Math.max(0, ms) / 1000).toFixed(2)}`);
			}),
		);

		// 专辑图上方那条控制横条：框架文档说明「通常用于关闭歌词页面」，但它的
		// onClickControlThumb 回调在浏览器里不触发，这里直接监听点击。
		const onDocumentClick = (event: MouseEvent) => {
			const target = event.target instanceof Element ? event.target : null;
			if (!target?.closest('[class*="controlThumb"]')) return;
			// 上游只有 Esc 一条关闭路径（AMLLWrapper 里的 keydown 监听），
			// 这里复用它的处理逻辑，保证与桌面端一致。
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
			store.set(isLyricPageOpenedAtom, false);
		};
		document.addEventListener("click", onDocumentClick, true);

		const unlisten = listenQmtuiFrames((frame) => {
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

	return null;
};
