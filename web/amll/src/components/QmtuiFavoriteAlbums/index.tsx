import { Box, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// qmtui 修改：收藏的专辑（CLI 有该接口，网页端原本没有入口）

interface FavoriteAlbum {
	mid?: string;
	title?: string;
	artist?: string;
	songCount?: number;
	coverUrl?: string;
}

const coverOf = (album?: FavoriteAlbum): string =>
	album?.coverUrl ||
	(album?.mid ? `https://y.qq.com/music/photo_new/T002R300x300M000${album.mid}.jpg` : "");

export const QmtuiFavoriteAlbums: FC = () => {
	const navigate = useNavigate();
	const [albums, setAlbums] = useState<FavoriteAlbum[]>([]);
	const [error, setError] = useState("");

	useEffect(() => {
		let alive = true;
		void fetch("/api/library/albums/favorite")
			.then((response) => response.json())
			.then((data: { albums?: FavoriteAlbum[] }) => {
				if (alive) setAlbums(data?.albums ?? []);
			})
			.catch(() => {
				if (alive) setError("加载失败");
			});
		return () => {
			alive = false;
		};
	}, []);

	if (albums.length === 0) return null;

	return (
		<Box mt="6">
			<Heading size="5" mb="2">
				收藏的专辑
				<Text size="2" color="gray" ml="2">
					{albums.length} 张
					{error ? ` ${error}` : ""}
				</Text>
			</Heading>
			<Grid columns="repeat(auto-fill, minmax(150px, 1fr))" gap="3">
				{albums.map((album) => (
					<Card
						key={album.mid}
						style={{ cursor: "pointer" }}
						onClick={() => {
							if (album.mid) navigate(`/album/${album.mid}`);
						}}
					>
						<Flex direction="column" gap="2" align="center">
							<img
								src={coverOf(album)}
								alt=""
								style={{
									width: "100%",
									aspectRatio: "1 / 1",
									objectFit: "cover",
									borderRadius: "var(--radius-3)",
								}}
								onError={(event) => {
									(event.target as HTMLImageElement).style.visibility = "hidden";
								}}
							/>
							<Text size="2" align="center" style={{ wordBreak: "break-word" }}>
								{album.title}
							</Text>
							<Text size="1" color="gray" align="center">
								{album.artist} · {album.songCount ?? 0} 首
							</Text>
						</Flex>
					</Card>
				))}
			</Grid>
		</Box>
	);
};
