import { toDuration } from "@applemusic-like-lyrics/react-full";
import { Avatar, Box, Card, ContextMenu, Flex, Text } from "@radix-ui/themes";
import { useAtomValue } from "jotai";
import {
	type CSSProperties,
	type FC,
	forwardRef,
	type PropsWithChildren,
	useEffect,
	useState,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { router } from "../../router.tsx";
import { queueManagerAtom } from "../../states/appAtoms.ts";
import type { Song } from "../../utils/db-client.ts";
import { useSongCover } from "../../utils/use-song-cover.ts";
// qmtui 修改：新 UI 原本没有收藏入口，这里接上 CLI 的「喜欢」
import {
	qmtuiFavoriteMids,
	qmtuiSetSongFavorite,
	rawQmtuiSong,
} from "../../utils/qmtui-library.ts";

export const useSongFavorite = (songId: string | number) => {
	const [isFavorite, setIsFavorite] = useState<boolean | null>(null);

	useEffect(() => {
		let alive = true;
		void qmtuiFavoriteMids().then((mids) => {
			const raw = rawQmtuiSong(String(songId));
			if (alive) setIsFavorite(raw ? mids.has(String(raw.mid)) : false);
		});
		return () => {
			alive = false;
		};
	}, [songId]);

	const toggle = () => {
		const next = !isFavorite;
		setIsFavorite(next);
		const raw = rawQmtuiSong(String(songId));
		if (raw) void qmtuiSetSongFavorite(raw, next);
	};

	return { isFavorite, toggle };
};

/** qmtui 修改：歌曲收藏（新 UI 原本没有入口）。 */
export const FavoriteButton: FC<{ song: Song }> = ({ song }) => {
	const { isFavorite, toggle } = useSongFavorite(song.id);
	return (
		<button
			type="button"
			title={isFavorite ? "取消喜欢" : "喜欢"}
			onClick={(event) => {
				event.stopPropagation();
				toggle();
			}}
			style={{
				marginLeft: "auto",
				marginRight: "0.5rem",
				background: "none",
				border: "none",
				cursor: "pointer",
				fontSize: "1.1rem",
				lineHeight: 1,
				color: isFavorite ? "#ff4d6d" : "#8b8b8b",
				padding: "0 0.25rem",
			}}
		>
			{isFavorite ? "♥" : "♡"}
		</button>
	);
};

export const SongCard = forwardRef<
	HTMLDivElement,
	PropsWithChildren<{
		song: Song;
		style?: CSSProperties;
	}>
>(({ song, style, children }, ref) => {
	const songImgUrl = useSongCover(song);
	const { t } = useTranslation();
	const queueManager = useAtomValue(queueManagerAtom);

	return (
		<Box py="1" style={style} ref={ref}>
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<Card onClick={() => {}}>
						<Flex p="1" align="center" gap="4">
							<Avatar size="5" fallback={<div />} src={songImgUrl} />
							<Flex
								direction="column"
								justify="center"
								flexGrow="1"
								minWidth="0"
							>
								<Text wrap="nowrap" truncate>
									{song.songName ||
										song.filePath ||
										t(
											"page.playlist.music.unknownSongName",
											"未知歌曲 ID {id}",
											{
												id: song.id,
											},
										)}
								</Text>
								<Text wrap="nowrap" truncate color="gray">
									{song.songArtists || ""}
								</Text>
							</Flex>
							<Text wrap="nowrap">
								{song.duration ? toDuration(song.duration) : ""}
							</Text>
							{children}
							<FavoriteButton song={song} />
						</Flex>
					</Card>
				</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item
						onClick={() => {
							queueManager?.replaceQueueAndPlay(song);
						}}
					>
						<Trans i18nKey="amll.contextMenu.play">播放</Trans>
					</ContextMenu.Item>
					<ContextMenu.Item
						onClick={() => {
							router.navigate(`/song/${song.id}`);
						}}
					>
						<Trans i18nKey="amll.contextMenu.editMusicOverrideMessage">
							编辑歌曲覆盖信息
						</Trans>
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Root>
		</Box>
	);
});
