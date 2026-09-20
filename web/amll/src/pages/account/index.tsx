import { ArrowLeftIcon, ExitIcon } from "@radix-ui/react-icons";
import {
	AlertDialog,
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Heading,
	IconButton,
	Text,
} from "@radix-ui/themes";
import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// qmtui 修改：个人主页（CLI 提供 /api/account，网页端原本没有入口）

interface AccountInfo {
	loggedIn?: boolean;
	uin?: string;
	nick?: string;
	avatarUrl?: string;
	isVip?: boolean;
	vipLevel?: number;
	musicLevel?: number;
}

interface PlaylistBrief {
	tid?: number;
	dirId?: number;
	name?: string;
	songCount?: number;
	isMyFavorite?: boolean;
}

export const Component: FC = () => {
	const navigate = useNavigate();
	const [account, setAccount] = useState<AccountInfo | null>(null);
	const [playlists, setPlaylists] = useState<PlaylistBrief[]>([]);
	const [albums, setAlbums] = useState<number | null>(null);
	const [notice, setNotice] = useState("");

	useEffect(() => {
		let alive = true;
		void Promise.all([
			fetch("/api/account").then((r) => r.json()),
			fetch("/api/library/playlists").then((r) => r.json()),
			fetch("/api/library/albums/favorite").then((r) => r.json()),
		])
			.then(([acc, list, favAlbums]) => {
				if (!alive) return;
				setAccount(acc as AccountInfo);
				setPlaylists(((list?.playlists ?? []) as PlaylistBrief[]) || []);
				setAlbums((favAlbums?.albums ?? []).length);
			})
			.catch(() => {
				if (alive) setNotice("加载账号信息失败");
			});
		return () => {
			alive = false;
		};
	}, []);

	const favorite = playlists.find((item) => item.isMyFavorite || item.dirId === 201);
	const created = playlists.filter((item) => item.dirId !== 201 && !item.isMyFavorite);

	return (
		<Box p="5">
			<Flex align="center" gap="3" mb="4">
				<IconButton variant="soft" onClick={() => history.back()}>
					<ArrowLeftIcon />
				</IconButton>
				<Text color="gray">我的</Text>
			</Flex>

			<Flex gap="5" align="center" mb="5">
				<Avatar size="8" src={account?.avatarUrl} fallback={(account?.nick || "?").slice(0, 1)} />
				<Flex direction="column" gap="2" flexGrow="1" minWidth="0">
					<Heading size="7">{account?.nick || "未登录"}</Heading>
					<Flex gap="2" align="center" wrap="wrap">
						{account?.isVip ? <Badge color="gold">VIP {account.vipLevel ?? ""}</Badge> : null}
						{account?.musicLevel ? <Badge variant="soft">音乐等级 {account.musicLevel}</Badge> : null}
						<Text color="gray" size="2">
							{account?.loggedIn ? `uin ${account.uin ?? ""}` : "未登录"}
						</Text>
						<Text color="gray" size="2">
							{notice}
						</Text>
					</Flex>
				</Flex>
				{account?.loggedIn ? (
					<AlertDialog.Root>
						<AlertDialog.Trigger>
							<Button variant="soft" color="red">
								<ExitIcon />
								退出登录
							</Button>
						</AlertDialog.Trigger>
						<AlertDialog.Content maxWidth="420px">
							<AlertDialog.Title>退出登录</AlertDialog.Title>
							<AlertDialog.Description size="2">
								退出后 CLI 将失去登录态，需要重新登录才能播放与同步歌单。
							</AlertDialog.Description>
							<Flex gap="3" mt="4" justify="end">
								<AlertDialog.Cancel>
									<Button variant="soft" color="gray">
										取消
									</Button>
								</AlertDialog.Cancel>
								<AlertDialog.Action>
									<Button
										color="red"
										onClick={() => {
											void fetch("/api/logout", { method: "POST" }).then(() => {
												setNotice("已退出登录");
												setAccount({ loggedIn: false });
											});
										}}
									>
										确认退出
									</Button>
								</AlertDialog.Action>
							</Flex>
						</AlertDialog.Content>
					</AlertDialog.Root>
				) : null}
			</Flex>

			<Flex gap="3" wrap="wrap">
				<Card
					style={{ cursor: favorite ? "pointer" : "default", minWidth: "160px" }}
					onClick={() => {
						if (favorite) navigate(`/playlist/${favorite.tid ?? favorite.dirId}`);
					}}
				>
					<Flex direction="column" gap="1">
						<Text color="gray" size="2">
							我喜欢
						</Text>
						<Heading size="6">{favorite?.songCount ?? 0}</Heading>
						<Text color="gray" size="1">
							首歌曲
						</Text>
					</Flex>
				</Card>
				<Card style={{ minWidth: "160px" }}>
					<Flex direction="column" gap="1">
						<Text color="gray" size="2">
							我的歌单
						</Text>
						<Heading size="6">{created.length}</Heading>
						<Text color="gray" size="1">
							个（含收藏 {playlists.length - created.length} 个）
						</Text>
					</Flex>
				</Card>
				<Card style={{ minWidth: "160px" }}>
					<Flex direction="column" gap="1">
						<Text color="gray" size="2">
							收藏的专辑
						</Text>
						<Heading size="6">{albums ?? "—"}</Heading>
						<Text color="gray" size="1">
							张
						</Text>
					</Flex>
				</Card>
			</Flex>
		</Box>
	);
};

Component.displayName = "AccountPage";

export default Component;
