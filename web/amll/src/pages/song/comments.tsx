import { Avatar, Box, Button, Card, Flex, Heading, Text, TextArea } from "@radix-ui/themes";
import { type FC, useCallback, useEffect, useState } from "react";

/** qmtui 修改：歌曲评论（CLI 有评论接口，网页端原本没有入口）。 */

interface QmtuiComment {
	id: string;
	nick: string;
	avatar: string;
	content: string;
	publishedAt: number;
	praiseCount: number;
	replyCount: number;
	isSelf: boolean;
}

interface CommentPage {
	comments?: QmtuiComment[];
	hasMore?: boolean;
	total?: number;
	cursor?: string;
}

const fetchComments = async (
	bizId: number,
	sort: "hot" | "new",
	page: number,
): Promise<CommentPage> => {
	const query = new URLSearchParams({
		bizId: String(bizId),
		bizType: "1",
		sort,
		page: String(page),
	});
	const response = await fetch(`/api/comments?${query.toString()}`);
	if (!response.ok) return {};
	return (await response.json()) as CommentPage;
};

const formatTime = (value: number): string => {
	if (!value) return "";
	// 接口给的是秒，毫秒值则原样使用
	const milliseconds = value > 1e12 ? value : value * 1000;
	const date = new Date(milliseconds);
	const pad = (value: number) => String(value).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const CommentsSection: FC<{ songId: string | number }> = ({ songId }) => {
	const bizId = Number(songId);
	const [sort, setSort] = useState<"hot" | "new">("hot");
	const [comments, setComments] = useState<QmtuiComment[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);
	const [draft, setDraft] = useState("");
	const [notice, setNotice] = useState("");

	const load = useCallback(
		async (nextSort: "hot" | "new", append: boolean) => {
			if (!Number.isFinite(bizId) || bizId <= 0) return;
			const nextPage = append ? page + 1 : 1;
			setLoading(true);
			try {
				const result = await fetchComments(bizId, nextSort, nextPage);
				const list = result.comments ?? [];
				setComments((prev) => {
					if (!append) return list;
					const seen = new Set(prev.map((item) => item.id));
					return [...prev, ...list.filter((item) => !seen.has(item.id))];
				});
				setTotal(result.total ?? 0);
				setPage(nextPage);
				setHasMore(Boolean(result.hasMore));
			} catch {
				if (!append) setComments([]);
			} finally {
				setLoading(false);
			}
		},
		[bizId, page],
	);

	useEffect(() => {
		void load(sort, false);
		// 仅在歌曲或排序变化时重新拉取
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bizId, sort]);

	const submit = async () => {
		const content = draft.trim();
		if (!content || !Number.isFinite(bizId) || bizId <= 0) return;
		setNotice("");
		try {
			const response = await fetch("/api/comments/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ bizId, bizType: 1, content, replyCommentId: "" }),
			});
			const result = (await response.json()) as { ok?: boolean; message?: string };
			if (result?.ok) {
				setDraft("");
				setSort("new");
				await load("new", false);
			} else {
				setNotice(result?.message || "发送失败");
			}
		} catch {
			setNotice("发送失败");
		}
	};

	return (
		<Box mt="6">
			<Flex align="center" justify="between" mb="3">
				<Flex align="center" gap="3">
					<Heading size="5">评论</Heading>
					<Text color="gray" size="2">
						{total > 0 ? `${total} 条` : ""}
					</Text>
				</Flex>
				<Flex gap="2">
					<Button
						size="1"
						variant={sort === "hot" ? "solid" : "soft"}
						onClick={() => setSort("hot")}
					>
						热门
					</Button>
					<Button
						size="1"
						variant={sort === "new" ? "solid" : "soft"}
						onClick={() => setSort("new")}
					>
						最新
					</Button>
				</Flex>
			</Flex>

			<Card mb="4">
				<Flex direction="column" gap="2">
					<TextArea
						placeholder="说点什么…"
						value={draft}
						onChange={(event) => setDraft(event.target.value)}
						rows={2}
					/>
					<Flex align="center" justify="between">
						<Text color="gray" size="2">
							{notice}
						</Text>
						<Button size="2" disabled={!draft.trim()} onClick={() => void submit()}>
							发表
						</Button>
					</Flex>
				</Flex>
			</Card>

			<Flex direction="column" gap="3">
				{comments.map((comment) => (
					<Card key={comment.id}>
						<Flex gap="3">
							<Avatar size="3" src={comment.avatar} fallback={comment.nick.slice(0, 1)} />
							<Flex direction="column" gap="1" flexGrow="1" minWidth="0">
								<Flex align="center" gap="2">
									<Text weight="medium">{comment.nick}</Text>
									<Text color="gray" size="1">
										{formatTime(comment.publishedAt)}
									</Text>
									{comment.isSelf ? (
										<Text color="gray" size="1">
											（我）
										</Text>
									) : null}
								</Flex>
								<Text style={{ whiteSpace: "pre-wrap" }}>{comment.content}</Text>
								<Flex gap="3" align="center">
									<Text color="gray" size="1">
										♥ {comment.praiseCount}
									</Text>
									{comment.replyCount > 0 ? (
										<Text color="gray" size="1">
											回复 {comment.replyCount}
										</Text>
									) : null}
								</Flex>
							</Flex>
						</Flex>
					</Card>
				))}

				{comments.length === 0 ? (
					<Text color="gray">{loading ? "加载中…" : "暂无评论"}</Text>
				) : null}

				{hasMore ? (
					<Flex justify="center">
						<Button
							variant="soft"
							disabled={loading}
							onClick={() => void load(sort, true)}
						>
							{loading ? "加载中…" : "加载更多"}
						</Button>
					</Flex>
				) : null}
			</Flex>
		</Box>
	);
};
