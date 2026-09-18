import { ArrowLeftIcon, HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import {
	Avatar,
	Box,
	Button,
	Card,
	Flex,
	Grid,
	Heading,
	IconButton,
	Tabs,
	Text,
} from "@radix-ui/themes";
import { type FC, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// qmtui 修改：歌手页（CLI 有歌手接口，网页端原本没有入口）
import { SongCard } from "../../components/SongCard/index.tsx";
import type { Song } from "../../utils/db-client.ts";
import { rawQmtuiSong } from "../../utils/qmtui-library.ts";

interface SingerDetail {
	mid?: string;
	id?: number;
	name?: string;
	brief?: string;
	avatarUrl?: string;
	fansCount?: number;
	songCount?: number;
	albumCount?: number;
}

interface SingerAlbum {
	id?: number;
	mid?: string;
	title?: string;
	songCount?: number;
	coverUrl?: string;
	pubTime?: number;
}

const coverOf = (albumMid?: string): string | undefined =>
	albumMid ? `https://y.qq.com/music/photo_new/T002R300x300M000${albumMid}.jpg` : undefined;

export const Component: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const singerMid = String(params.id ?? "");
	const [detail, setDetail] = useState<SingerDetail | null>(null);
	const [songs, setSongs] = useState<Song[]>([]);
	const [albums, setAlbums] = useState<SingerAlbum[]>([]);
	const [isFavorite, setIsFavorite] = useState(false);
	const [notice, setNotice] = useState("");

	const load = useCallback(async () => {
		if (!singerMid) return;
		try {
			const [detailRes, songsRes, albumsRes, favoriteRes] = await Promise.all([
				fetch(`/api/singer/detail?mid=${encodeURIComponent(singerMid)}`).then((r) => r.json()),
				fetch(`/api/singer/songs?mid=${encodeURIComponent(singerMid)}`).then((r) => r.json()),
				fetch(`/api/singer/albums?mid=${encodeURIComponent(singerMid)}`).then((r) => r.json()),
				fetch(`/api/singer/favorite?mid=${encodeURIComponent(singerMid)}`).then((r) => r.json()),
			]);
			setDetail((detailRes ?? {}) as SingerDetail);
			setIsFavorite(Boolean(favoriteRes?.isFavorite));
			const list = ((songsRes?.songs ?? []) as Array<Record<string, unknown>>).map((item) => {
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
			setSongs(list);
			setAlbums(((albumsRes?.albums ?? []) as SingerAlbum[]) || []);
		} catch {
			setNotice("加载失败");
		}
	}, [singerMid]);

	useEffect(() => {
		void load();
	}, [load]);

	const toggleFavorite = async () => {
		const next = !isFavorite;
		setIsFavorite(next);
		try {
			const response = await fetch("/api/singer/favorite", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ mid: singerMid, favorite: next }),
			});
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
				<Text color="gray">歌手</Text>
			</Flex>

			<Flex gap="5" align="center" mb="5">
				<Avatar
					size="8"
					src={detail?.avatarUrl}
					fallback={(detail?.name ?? "?").slice(0, 1)}
				/>
				<Flex direction="column" gap="2" flexGrow="1" minWidth="0">
					<Heading size="7">{detail?.name || "未知歌手"}</Heading>
					<Flex gap="4" align="center">
						<Text color="gray" size="2">
							{songs.length} 首歌曲 · {albums.length} 张专辑
						</Text>
						<Text color="gray" size="2">
							{notice}
						</Text>
					</Flex>
				</Flex>
				<Button variant={isFavorite ? "solid" : "soft"} onClick={() => void toggleFavorite()}>
					{isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
					{isFavorite ? "已收藏" : "收藏歌手"}
				</Button>
			</Flex>

			{detail?.brief ? (
				<Text as="p" color="gray" size="2" mb="5" style={{ whiteSpace: "pre-wrap" }}>
					{detail.brief}
				</Text>
			) : null}

			<Tabs.Root defaultValue="songs">
				<Tabs.List>
					<Tabs.Trigger value="songs">歌曲</Tabs.Trigger>
					<Tabs.Trigger value="albums">专辑</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="songs">
					<Flex direction="column" mt="3">
						{songs.map((song) => (
							<SongCard key={song.id} song={song} />
						))}
						{songs.length === 0 ? <Text color="gray">暂无歌曲</Text> : null}
					</Flex>
				</Tabs.Content>
				<Tabs.Content value="albums">
					<Grid columns="repeat(auto-fill, minmax(140px, 1fr))" gap="3" mt="3">
						{albums.map((album) => (
							<Card
								key={album.mid}
								style={{ cursor: "pointer" }}
								onClick={() => navigate(`/song/${album.id ?? ""}`)}
							>
								<Flex direction="column" gap="2" align="center">
									<Avatar
										size="8"
										variant="soft"
										src={album.coverUrl || coverOf(album.mid)}
										fallback="♪"
									/>
									<Text align="center" size="2">
										{album.title}
									</Text>
									<Text align="center" size="1" color="gray">
										{album.songCount ?? 0} 首
									</Text>
								</Flex>
							</Card>
						))}
						{albums.length === 0 ? <Text color="gray">暂无专辑</Text> : null}
					</Grid>
				</Tabs.Content>
			</Tabs.Root>
		</Box>
	);
};

Component.displayName = "SingerPage";

export default Component;
