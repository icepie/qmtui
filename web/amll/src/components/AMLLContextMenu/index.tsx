import {
	hideLyricViewAtom,
	isLyricPageOpenedAtom,
	musicIdAtom,
	onPlayOrResumeAtom,
	onRequestNextSongAtom,
	onRequestPrevSongAtom,
} from "@applemusic-like-lyrics/react-full";
import { ContextMenu } from "@radix-ui/themes";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import type { FC } from "react";
import { Trans } from "react-i18next";
import { router } from "../../router.tsx";

export const AMLLContextMenuContent: FC = () => {
	const [hideLyricView, setHideLyricView] = useAtom(hideLyricViewAtom);
	const setLyricPageOpened = useSetAtom(isLyricPageOpenedAtom);
	const onRequestPrevSong = useAtomValue(onRequestPrevSongAtom).onEmit;
	const onRequestNextSong = useAtomValue(onRequestNextSongAtom).onEmit;
	const onPlayOrResume = useAtomValue(onPlayOrResumeAtom).onEmit;
	const musicId = useAtomValue(musicIdAtom);

	return (
		<ContextMenu.Content>
			<ContextMenu.Item onClick={onRequestPrevSong} shortcut="Ctrl Alt ←">
				<Trans i18nKey="amll.contextMenu.rewindSong">上一首</Trans>
			</ContextMenu.Item>
			<ContextMenu.Item onClick={onPlayOrResume} shortcut="Ctrl Alt P">
				<Trans i18nKey="amll.contextMenu.pauseOrResume">暂停 / 继续</Trans>
			</ContextMenu.Item>
			<ContextMenu.Item onClick={onRequestNextSong} shortcut="Ctrl Alt →">
				<Trans i18nKey="amll.contextMenu.forwardSong">下一首</Trans>
			</ContextMenu.Item>
			<ContextMenu.Separator />
			{/* qmtui 修改：网页端没有 Tauri 窗口，全屏改用浏览器原生 API（窗口置顶无对应能力，去掉） */}
			<ContextMenu.Item
				onClick={async () => {
					if (document.fullscreenElement) {
						await document.exitFullscreen().catch(() => undefined);
					} else {
						await document.documentElement.requestFullscreen().catch(() => undefined);
					}
					setSystemTitlebarFullscreen(Boolean(document.fullscreenElement));
				}}
			>
				<Trans i18nKey="amll.contextMenu.toggleFullscreen">
					全屏 / 取消全屏
				</Trans>
			</ContextMenu.Item>
			<ContextMenu.Separator />
			<ContextMenu.CheckboxItem
				checked={!hideLyricView}
				onCheckedChange={(e) => setHideLyricView(!e)}
			>
				<Trans i18nKey="amll.contextMenu.toggleLyrics">显示歌词</Trans>
			</ContextMenu.CheckboxItem>
			<ContextMenu.Item
				onClick={() => {
					setLyricPageOpened(false);
					router.navigate(`/song/${musicId}`);
				}}
			>
				<Trans i18nKey="amll.contextMenu.editMusicOverrideMessage">
					编辑歌曲覆盖信息
				</Trans>
			</ContextMenu.Item>
			{/* qmtui 修改：捕获面板与截图工具依赖桌面端能力，网页端去掉 */}
			<ContextMenu.Separator />
			<ContextMenu.Item
				onClick={() => {
					setLyricPageOpened(false);
				}}
			>
				<Trans i18nKey="amll.contextMenu.exitLyricPage">退出歌词页面</Trans>
			</ContextMenu.Item>
		</ContextMenu.Content>
	);
};
