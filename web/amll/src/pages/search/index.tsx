import {
	ArrowLeftIcon,
	Cross2Icon,
	MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
	Avatar,
	Button,
	Card,
	Container,
	Flex,
	Inset,
	Spinner,
	Text,
	TextField,
} from "@radix-ui/themes";
import { atom, useAtom } from "jotai";
import { type ButtonHTMLAttributes, type FC, useCallback, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AppContainer } from "../../components/AppContainer/index.tsx";
import { PlaylistCard } from "../../components/PlaylistCard/index.tsx";
import { SongCard } from "../../components/SongCard/index.tsx";
import { db } from "../../utils/db-client.ts";
import { useDbQuery } from "../../utils/use-db-query.ts";
// qmtui 修改：搜索改为云端（QQ 曲库）优先
import { searchQmtuiCloud, searchQmtuiSingersAndAlbums } from "../../utils/qmtui-library.ts";
import styles from "./index.module.css";

const FilterButton: FC<
	{
		label: string;
	} & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ label, ...props }) => {
	return (
		<button className={styles.filterButton} {...props}>
			{label}
		</button>
	);
};

interface Filter {
	filterType: string;
	keyword: string;
	regexp: RegExp;
}

const filtersAtom = atom([] as Filter[]);
const keywordAtom = atom("");

export const Component: FC = () => {
	const navigate = useNavigate();
	const [filters, setFilters] = useAtom(filtersAtom);
	const [keyword, setKeyword] = useAtom(keywordAtom);
	const trimmedKeyword = keyword.trim();
	const { t } = useTranslation();
	const inputRef = useRef<HTMLInputElement>(null);
	// qmtui 修改：关键词添加成筛选项后输入框会被清空，云端搜索要从 filters 里取词
	const searchKeyword = [
		...new Set(
			filters
				.map((filter) => (filter.keyword || "").trim())
				.filter((word) => word.length > 0),
		),
	].join(" ");

	const { data: songsData, loading: songsLoading } = useDbQuery(
		async () => {
			if (filters.length === 0) return [];
			// qmtui 修改：先搜云端，本地库作为补充
			const cloud = await searchQmtuiCloud(searchKeyword);
			const allPlaylists = await db.playlists.getAll();
			const allSongIds = [...new Set(allPlaylists.flatMap((p) => p.songIds))];
			if (allSongIds.length === 0) return [];
			const allSongs = await db.songs.getByIds(allSongIds);
			const cloudIds = new Set(cloud.songs.map((song) => song.id));
			return [...cloud.songs, ...allSongs.filter((song) => !cloudIds.has(song.id))]
				.filter((song) => {
					for (const filter of filters) {
						switch (filter.filterType) {
							case "songName":
								if (!filter.regexp.test(song.songName)) return false;
								break;
							case "artistName":
								if (!filter.regexp.test(song.songArtists)) return false;
								break;
							case "albumName":
								if (!filter.regexp.test(song.songAlbum)) return false;
								break;
							case "lyricContent":
								if (!filter.regexp.test(song.lyric)) return false;
								break;
							default:
								break;
						}
					}
					return true;
				})
				.slice(0, 20);
		},
		[filters, searchKeyword],
		[],
		["songs", "playlists", "playlist_songs"],
	);

	const { data: playlistsData, loading: playlistsLoading } = useDbQuery(
		async () => {
			if (filters.length === 0) return [];
			// qmtui 修改：歌单同样云端优先
			const cloud = await searchQmtuiCloud(searchKeyword);
			const allPlaylists = await db.playlists.getAll();
			const cloudIds = new Set(cloud.playlists.map((playlist) => playlist.id));
			return [...cloud.playlists, ...allPlaylists.filter((playlist) => !cloudIds.has(playlist.id))]
				.filter((playlist) => {
					for (const filter of filters) {
						switch (filter.filterType) {
							case "playlistName":
								if (!filter.regexp.test(playlist.name)) return false;
								break;
							default:
								break;
						}
					}
					return true;
				})
				.slice(0, 20);
		},
		[filters],
		[],
		["playlists", "playlist_songs"],
	);

	// qmtui 修改：歌手 / 专辑结果
	const { data: extraData } = useDbQuery(
		async () => {
			if (filters.length === 0) return { singers: [], albums: [] };
			return await searchQmtuiSingersAndAlbums(searchKeyword);
		},
		[filters, searchKeyword],
		{ singers: [], albums: [] },
		["songs", "playlists"],
	);

	const addFilter = useCallback(
		(filterType: string) => {
			setFilters((prev) => [
				...prev,
				{
					filterType,
					keyword: trimmedKeyword,
					regexp: new RegExp(trimmedKeyword, "i"),
				},
			]);
			setKeyword("");
			inputRef.current?.focus();
		},
		[trimmedKeyword, setFilters, setKeyword],
	);

	return (
		<AppContainer>
			<Container mx="4">
				<Flex align="end" pt="6">
					<Button variant="soft" onClick={() => history.back()}>
						<ArrowLeftIcon />
						<Trans i18nKey="common.page.back">返回</Trans>
					</Button>
				</Flex>
				<TextField.Root
					placeholder={t(
						"page.search.filter.placeholder",
						"搜索歌单、歌名、歌手等信息……",
					)}
					mt="2"
					value={keyword}
					onChange={(evt) => setKeyword(evt.target.value)}
					onKeyUp={(evt) => {
						if (evt.key === "Enter" && trimmedKeyword !== "") {
							addFilter("songName");
						} else if (evt.key === "Backspace" && keyword === "") {
							setFilters((prev) => prev.slice(0, -1));
						}
					}}
					ref={inputRef}
				>
					<TextField.Slot>
						<MagnifyingGlassIcon />
						{filters.map(({ filterType, keyword }, i) => (
							<Button
								key={`filter-tag-${i}`}
								variant="soft"
								radius="full"
								size="1"
								onClick={() => {
									setFilters((prev) => prev.filter((_, index) => index !== i));
								}}
							>
								{filterType === "songName" &&
									t("page.search.filter.songName", "歌曲名 : {keyword}", {
										keyword,
									})}
								{filterType === "artistName" &&
									t("page.search.filter.artistName", "歌手名 : {keyword}", {
										keyword,
									})}
								{filterType === "albumName" &&
									t("page.search.filter.albumName", "专辑名 : {keyword}", {
										keyword,
									})}
								{filterType === "playlistName" &&
									t(
										"page.search.filter.playlistName",
										"播放列表名 : {keyword}",
										{
											keyword,
										},
									)}
								{filterType === "lyricContent" &&
									t("page.search.filter.lyricContent", "歌词内容 : {keyword}", {
										keyword,
									})}
								<Cross2Icon />
							</Button>
						))}
					</TextField.Slot>
				</TextField.Root>
				{trimmedKeyword.length > 0 && (
					<Card mt="2">
						<Inset>
							<FilterButton
								label={t(
									"page.search.filter.candidate.songName",
									"歌曲名 包含 {keyword}",
									{
										keyword: trimmedKeyword,
									},
								)}
								onClick={() => addFilter("songName")}
							/>
							<FilterButton
								label={t(
									"page.search.filter.candidate.artistName",
									"歌手名 包含 {keyword}",
									{
										keyword: trimmedKeyword,
									},
								)}
								onClick={() => addFilter("artistName")}
							/>
							<FilterButton
								label={t(
									"page.search.filter.candidate.albumName",
									"专辑名 包含 {keyword}",
									{
										keyword: trimmedKeyword,
									},
								)}
								onClick={() => addFilter("albumName")}
							/>
							<FilterButton
								label={t(
									"page.search.filter.candidate.playlistName",
									"播放列表名称 包含 {keyword}",
									{
										keyword: trimmedKeyword,
									},
								)}
								onClick={() => addFilter("playlistName")}
							/>
							<FilterButton
								label={t(
									"page.search.filter.candidate.lyricContent",
									"歌词内容 包含 {keyword}",
									{
										keyword: trimmedKeyword,
									},
								)}
								onClick={() => addFilter("lyricContent")}
							/>
						</Inset>
					</Card>
				)}
				{filters.length === 0 ? (
					<Text as="div" color="gray" mt="4" align="center">
						<Trans i18nKey="page.search.placeholder">
							搜索歌曲、歌手、专辑、歌词、播放列表等信息
						</Trans>
					</Text>
				) : (
					<>
						{songsLoading && (
							<Flex
								m="4"
								direction="column"
								gap="4"
								justify="center"
								align="center"
							>
								<Spinner />
								<Text color="gray">搜索歌曲中</Text>
							</Flex>
						)}
						{!songsLoading && songsData.length > 0 && (
							<>
								<Text as="div" mt="4">
									{t(
										"page.search.searchSongResultAmount",
										"搜索到 {amount} 首歌曲",
										{
											amount: songsData.length,
										},
									)}
								</Text>

								{songsData.map((song) => (
									<SongCard
										song={song}
										key={`search-result-song-${song.id}`}
									></SongCard>
								))}
							</>
						)}
						{!songsLoading && songsData.length === 0 && (
							<Text color="gray" align="center">
								<Trans i18nKey="page.search.noSongResult">无歌曲结果</Trans>
							</Text>
						)}
						{playlistsLoading && (
							<Flex
								m="4"
								direction="column"
								gap="4"
								justify="center"
								align="center"
							>
								<Spinner />
								<Text color="gray">
									<Trans i18nKey="page.search.searchingPlaylist">
										搜索播放列表中
									</Trans>
								</Text>
							</Flex>
						)}
						{!playlistsLoading && playlistsData.length === 0 && (
							<Text>
								<Trans i18nKey="page.search.noPlaylistResult">
									无播放列表结果
								</Trans>
							</Text>
						)}
						{!playlistsLoading && playlistsData.length > 0 && (
							<>
								<Text as="div" mt="4">
									{t(
										"page.search.searchPlaylistResultAmount",
										"搜索到 {amount} 个播放列表",
										{
											amount: playlistsData.length,
										},
									)}
								</Text>

								{playlistsData.map((playlist) => (
									<PlaylistCard
										playlist={playlist}
										key={`search-result-playlist-${playlist.id}`}
									></PlaylistCard>
								))}
							</>
						)}

						{/* qmtui 修改：歌手 / 专辑结果（点进歌手页与专辑页） */}
						{extraData.singers.length > 0 && (
							<>
								<Text as="div" mt="4">
									搜索到 {extraData.singers.length} 位歌手
								</Text>
								<Flex gap="3" wrap="wrap" mt="2">
									{extraData.singers.slice(0, 12).map((singer) => (
										<Card
											key={`search-result-singer-${singer.mid}`}
											style={{ cursor: "pointer", width: "120px" }}
											onClick={() => navigate(`/singer/${singer.mid}`)}
										>
											<Flex direction="column" align="center" gap="2">
												<Avatar size="6" src={singer.picUrl} fallback={singer.name.slice(0, 1)} />
												<Text size="2" align="center">
													{singer.name}
												</Text>
											</Flex>
										</Card>
									))}
								</Flex>
							</>
						)}

						{extraData.albums.length > 0 && (
							<>
								<Text as="div" mt="4">
									搜索到 {extraData.albums.length} 张专辑
								</Text>
								<Flex gap="3" wrap="wrap" mt="2">
									{extraData.albums.slice(0, 12).map((album) => (
										<Card
											key={`search-result-album-${album.mid}`}
											style={{ cursor: "pointer", width: "120px" }}
											onClick={() => navigate(`/album/${album.mid}`)}
										>
											<Flex direction="column" align="center" gap="2">
												<Avatar
													size="6"
													variant="soft"
													src={
														album.coverUrl ||
														`https://y.qq.com/music/photo_new/T002R300x300M000${album.mid}.jpg`
													}
													fallback="♪"
												/>
												<Text size="2" align="center">
													{album.title}
												</Text>
												<Text size="1" color="gray" align="center">
													{album.artist}
												</Text>
											</Flex>
										</Card>
									))}
								</Flex>
							</>
						)}
					</>
				)}
			</Container>
		</AppContainer>
	);
};

Component.displayName = "SearchPage";

export default Component;
