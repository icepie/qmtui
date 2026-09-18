import { ArrowLeftIcon, HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { Avatar, Box, Button, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { type FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// qmtui 修改：专辑页（CLI 有专辑接口，网页端原本没有入口）
import { SongCard } from "../../components/SongCard/index.tsx";
import type { Song } from "../../utils/db-client.ts";
import { rawQmtuiSong } from "../../utils/qmtui-library.ts";

interface AlbumDetail {
	mid?: string;
	name?: string;
	artist?: string;
	publishDate?: string;
	company?: string;
	description?: string;
	songs?: Array<Record<string, unknown>>;
}

const coverOf = (albumMid?: string): string | undefined =>
	albumMid ? `https://y.qq.com/music/photo_new/T002R300x300M000${albumMid}.jpg` : undefined;

export const Component: FC = () => {
	const params = useParams();
	const albumMid = String(params.id ?? "");
	const [album, setAlbum] = useState<AlbumDetail | null>(null);
	const [songs, setSongs] = useState<Song[]>([]);
	const [isFavorite, setIsFavorite] = useState(false);
	const [notice, setNotice] = useState("");

	const load = useCallback(async () => {
		if (!albumMid) return;
		try {
			const [detail, favoriteList] = await Promise.all([
				fetch(`/api/library/album?mid=${encodeURIComponent(albumMid)}`).then((r) => r.json()),
				fetch("/api/library/albums/favorite").then((r) => r.json()),
			]);
			const data = (detail?.album ?? {}) as AlbumDetail;
			setAlbum(data);
			setIsFavorite(
				((favoriteList?.albums ?? []) as Array<{ mid?: string }>).some(
					(item) => item.mid === albumMid,
				),
			);
			setSongs(
				(data.songs ?? []).map((item) => {
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
						coverPath: coverOf(albumMid) ?? null,
					} satisfies Song;
				}),
			);
		} catch {
			setNotice("加载失败");
		}
	}, [albumMid]);

	useEffect(() => {
		void load();
	}, [load]);

	const toggleFavorite = async () => {
		const next = !isFavorite;
		setIsFavorite(next);
		try {
			const response = await fetch(
				`/api/library/album/${next ? "favorite" : "unfavorite"}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ albumMid }),
				},
			);
			const result = (await response.json()) as { ok?: boolean; message?: string };
			if (!result?.ok) {
				setIsFavorite(!next);
				setNotice(result?.message || "操作失败");
			} else {
				setNotice(next ? "已收藏" : "已取消收藏");
			}
		} catch {
			setIsFavorite(!next);
			setNotice("操作失败");
		}
	};

	return (
		<Box p="5">
			<Flex align="center" gap="3" mb="4">
				<IconButton variant="soft" onClick={() => history.back()}>
					<ArrowLeftIcon />
				</IconButton>
				<Text color="gray">专辑</Text>
			</Flex>

			<Flex gap="5" align="center" mb="5">
				<Avatar size="8" variant="soft" src={coverOf(albumMid)} fallback="♪" />
				<Flex direction="column" gap="2" flexGrow="1" minWidth="0">
					<Heading size="7">{album?.name || "未知专辑"}</Heading>
					<Flex gap="4" align="center" wrap="wrap">
						<Text color="gray" size="2">
							{album?.artist || ""}
						</Text>
						{album?.publishDate ? (
							<Text color="gray" size="2">
								{album.publishDate}
							</Text>
						) : null}
						<Text color="gray" size="2">
							{songs.length} 首歌曲
						</Text>
						<Text color="gray" size="2">
							{notice}
						</Text>
					</Flex>
				</Flex>
				<Button variant={isFavorite ? "solid" : "soft"} onClick={() => void toggleFavorite()}>
					{isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
					{isFavorite ? "已收藏" : "收藏专辑"}
				</Button>
			</Flex>

			{album?.description ? (
				<Text as="p" color="gray" size="2" mb="5" style={{ whiteSpace: "pre-wrap" }}>
					{album.description}
				</Text>
			) : null}

			<Flex direction="column">
				{songs.map((song) => (
					<SongCard key={song.id} song={song} />
				))}
				{songs.length === 0 ? <Text color="gray">暂无歌曲</Text> : null}
			</Flex>
		</Box>
	);
};

Component.displayName = "AlbumPage";

export default Component;
