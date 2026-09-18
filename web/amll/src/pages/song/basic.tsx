import { toDuration } from "@applemusic-like-lyrics/react-full";
import { CopyIcon } from "@radix-ui/react-icons";
import { Button, Code, DataList, Flex, IconButton, Select, Text } from "@radix-ui/themes";
import { useAtomValue } from "jotai";
import { type FC, useContext, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
// qmtui 修改：播放音质选择（帧里带当前档位与可用档位）
import {
	QMTUI_QUALITY_LABELS,
	qmtuiQualityAtom,
	qmtuiSetQuality,
} from "../../utils/player.ts";
// qmtui 修改：下载（CLI 的导出接口，网页端原本没有入口）
import { rawQmtuiSong } from "../../utils/qmtui-library.ts";
import { SongContext } from "./song-ctx.ts";

export const BasicTabContent: FC = () => {
	const song = useContext(SongContext);
	useTranslation();
	const quality = useAtomValue(qmtuiQualityAtom);
	const [downloadTier, setDownloadTier] = useState("current");
	const [downloading, setDownloading] = useState(false);
	const [downloadNotice, setDownloadNotice] = useState("");
	return (
		<DataList.Root>
			<DataList.Item>
				<DataList.Label>
					<Trans i18nKey="page.song.basic.musicId">音乐 ID</Trans>
				</DataList.Label>
				<DataList.Value>{song?.id || "未知"}</DataList.Value>
			</DataList.Item>
			<DataList.Item>
				<DataList.Label>
					<Trans i18nKey="page.song.basic.musicFilePath">音乐文件路径</Trans>
				</DataList.Label>
				<DataList.Value>
					<Flex align="center" gap="2">
						<Code variant="ghost">{song?.filePath}</Code>
						<IconButton
							size="1"
							aria-label="Copy value"
							color="gray"
							variant="ghost"
							onClick={() => {
								navigator.clipboard.writeText(song?.filePath || "");
							}}
						>
							<CopyIcon />
						</IconButton>
					</Flex>
				</DataList.Value>
			</DataList.Item>
			<DataList.Item>
				<DataList.Label>
					<Trans i18nKey="page.song.basic.musicDuration">音乐时长</Trans>
				</DataList.Label>
				<DataList.Value>{toDuration(song?.duration || 0)}</DataList.Value>
			</DataList.Item>
			{/* qmtui 修改：播放音质（CLI 支持多档，网页端原本没有入口） */}
			<DataList.Item>
				<DataList.Label>播放音质</DataList.Label>
				<DataList.Value>
					<Flex align="center" gap="2">
						<Select.Root
							value={String(quality.tier)}
							onValueChange={(value) => {
								void qmtuiSetQuality(Number(value));
							}}
						>
							<Select.Trigger />
							<Select.Content>
								{QMTUI_QUALITY_LABELS.map((option) => {
									const usable =
										quality.available.length === 0 ||
										quality.available.includes(option.tier);
									return (
										<Select.Item
											key={option.tier}
											value={String(option.tier)}
											disabled={!usable}
										>
											{option.label}
											{usable ? "" : "（当前账号不可用）"}
										</Select.Item>
									);
								})}
							</Select.Content>
						</Select.Root>
						<Code variant="ghost">{quality.badge || "—"}</Code>
					</Flex>
				</DataList.Value>
			</DataList.Item>
			{/* qmtui 修改：下载（音质可选，默认跟随当前播放档位） */}
			<DataList.Item>
				<DataList.Label>下载</DataList.Label>
				<DataList.Value>
					<Flex align="center" gap="2">
						<Select.Root value={downloadTier} onValueChange={setDownloadTier}>
							<Select.Trigger />
							<Select.Content>
								<Select.Item value="current">当前档位</Select.Item>
								{QMTUI_QUALITY_LABELS.filter(
									(option) =>
										quality.available.length === 0 ||
										quality.available.includes(option.tier),
								).map((option) => (
									<Select.Item key={option.tier} value={String(option.tier)}>
										{option.label}
									</Select.Item>
								))}
							</Select.Content>
						</Select.Root>
						<Button
							disabled={downloading || !song}
							onClick={() => {
								const raw = song ? rawQmtuiSong(String(song.id)) : undefined;
								if (!raw) {
									setDownloadNotice("找不到歌曲数据");
									return;
								}
								const tier =
									downloadTier === "current"
										? quality.tier
										: Number(downloadTier);
								setDownloading(true);
								setDownloadNotice("下载中…");
								void fetch("/api/download", {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({
										song: raw,
										quality: QMTUI_QUALITY_KEYS[tier] || "128k",
									}),
								})
									.then((response) => response.json())
									.then((result: { success?: boolean; filename?: string; message?: string }) => {
										setDownloadNotice(
											result?.success
												? `已保存：${result.filename || ""}`
												: result?.message || "下载失败",
										);
									})
									.catch(() => setDownloadNotice("下载失败"))
									.finally(() => setDownloading(false));
							}}
						>
							{downloading ? "下载中…" : "下载"}
						</Button>
						<Text size="1" color="gray">
							{downloadNotice}
						</Text>
					</Flex>
				</DataList.Value>
			</DataList.Item>
		</DataList.Root>
	);
};
