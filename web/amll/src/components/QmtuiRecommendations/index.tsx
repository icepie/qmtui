import { PlayIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Heading, Tabs, Text } from "@radix-ui/themes";
import { useAtomValue } from "jotai";
import { type FC, useCallback, useEffect, useState } from "react";
// qmtui 修改：每日推荐 / 猜你喜欢（CLI 已有接口，网页端原本没有入口）
import { queueManagerAtom } from "../../states/appAtoms.ts";
import type { Song } from "../../utils/db-client.ts";
import { rawQmtuiSong } from "../../utils/qmtui-library.ts";
import { SongCard } from "../SongCard/index.tsx";

type RecommendKind = "daily" | "guess";

const coverOf = (albumMid?: string): string | undefined =>
	albumMid ? `https://y.qq.com/music/photo_new/T002R300x300M000${albumMid}.jpg` : undefined;

const PREVIEW_COUNT = 10;
// qmtui 修改：推荐接口后端要十几秒，这里用 localStorage 缓存（10 分钟），
// 命中时先渲染缓存再后台刷新，避免每次进主页都等。
const CACHE_TTL_MS = 10 * 60_000;
const cacheKey = (kind: RecommendKind) => `qmtui.recommend.${kind}`;

function readCache(kind: RecommendKind): Song[] | null {
	try {
		const raw = localStorage.getItem(cacheKey(kind));
		if (!raw) return null;
		const data = JSON.parse(raw) as { at?: number; songs?: Song[] };
		if (!data?.at || Date.now() - data.at > CACHE_TTL_MS || !Array.isArray(data.songs)) return null;
		return data.songs;
	} catch {
		return null;
	}
}

function writeCache(kind: RecommendKind, songs: Song[]): void {
	try {
		localStorage.setItem(cacheKey(kind), JSON.stringify({ at: Date.now(), songs }));
	} catch {
		// 忽略配额等问题
	}
}

export const QmtuiRecommendations: FC = () => {
	const queueManager = useAtomValue(queueManagerAtom);
	const [kind, setKind] = useState<RecommendKind>("daily");
	const [list, setList] = useState<Song[]>([]);
	const [loading, setLoading] = useState(false);
	const [notice, setNotice] = useState("");

	const load = useCallback(async (next: RecommendKind) => {
		const cached = readCache(next);
		if (cached && cached.length > 0) {
			// 先用缓存渲染，避免等后端
			setList(cached);
			setLoading(false);
		} else {
			setLoading(true);
		}
		setNotice("");
		try {
			const data = await fetch(`/api/library/recommend/${next}`).then((r) => r.json());
			const songs = ((data?.songs ?? []) as Array<Record<string, unknown>>).map((item) => {
				// 后端歌曲先登记，点击才能播放
				rawQmtuiSong(String(item.id ?? ""));
				return {
					id: String(item.id ?? ""),
					filePath: "",
					songName: String(item.title ?? ""),
					songArtists: String(item.artist ?? ""),
					songAlbum: String(item.album ?? ""),
					duration: Number(item.duration) || 0,
					lyricFormat: "",
					lyric: "",
					coverPath: coverOf(item.albumMid as string | undefined) ?? null,
				} satisfies Song;
			});
			setList(songs);
			writeCache(next, songs);
		} catch {
			if (!cached || cached.length === 0) {
				setNotice("加载失败");
				setList([]);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void load(kind);
	}, [kind, load]);

	return (
		<Box mt="5">
			<Flex align="center" justify="between" mb="2">
				<Heading size="5">
					{kind === "daily" ? "每日推荐" : "猜你喜欢"}
					<Text size="2" color="gray" ml="2">
						{loading ? "加载中…" : `${list.length} 首`}
						{notice ? ` ${notice}` : ""}
					</Text>
				</Heading>
				<Flex gap="2" align="center">
					<Tabs.Root
						value={kind}
						onValueChange={(value) => setKind(value as RecommendKind)}
					>
						<Tabs.List>
							<Tabs.Trigger value="daily">每日推荐</Tabs.Trigger>
							<Tabs.Trigger value="guess">猜你喜欢</Tabs.Trigger>
						</Tabs.List>
					</Tabs.Root>
					<Button
						size="2"
						disabled={list.length === 0}
						onClick={() => {
							// 交给队列管理器：它会同步原子并把播放请求交给 CLI
							queueManager?.setQueue(list);
						}}
					>
						<PlayIcon />
						播放全部
					</Button>
				</Flex>
			</Flex>
			<Flex direction="column">
				{list.slice(0, PREVIEW_COUNT).map((song) => (
					<SongCard key={song.id} song={song} />
				))}
			</Flex>
		</Box>
	);
};
