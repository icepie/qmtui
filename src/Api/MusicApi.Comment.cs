using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using QmTui.Models;
using QmTui.Utils;

namespace QmTui.Api;

public enum CommentBizType
{
    Song = 1,
    Album = 2,
    Playlist = 3,
    Mv = 4,
    SpecialAudio = 15
}

public sealed record MusicComment(
    string Id,
    string Sequence,
    string Nick,
    string Avatar,
    string Content,
    long PublishedAt,
    int PraiseCount,
    int ReplyCount,
    bool IsPraised,
    bool IsSelf);

public sealed record MusicCommentPage(List<MusicComment> Comments, bool HasMore, int Total, string Cursor);
public sealed record CommentMutationResult(bool Success, string Message, string CommentId = "");

public sealed partial class MusicApi
{
    public static Task<MusicCommentPage> GetHotCommentsAsync(long bizId, CommentBizType bizType, int page = 1, int pageSize = 20, string cursor = "", CancellationToken ct = default) =>
        GetCommentsAsync(bizId, bizType, "GetHotCommentList", page, pageSize, cursor, ct);

    public static Task<MusicCommentPage> GetNewCommentsAsync(long bizId, CommentBizType bizType, int page = 1, int pageSize = 20, string cursor = "", CancellationToken ct = default) =>
        GetCommentsAsync(bizId, bizType, "GetNewCommentList", page, pageSize, cursor, ct);

    private static async Task<MusicCommentPage> GetCommentsAsync(long bizId, CommentBizType bizType, string method, int page, int pageSize, string cursor, CancellationToken ct)
    {
        if (bizId <= 0) return new([], false, 0, "");
        int size = Math.Clamp(pageSize, 1, 50);
        int pageNum = Math.Max(0, page - 1);
        bool hot = method == "GetHotCommentList";

        // c.y.qq.com 的 fcg_global_comment_h5.fcg 会被限流（HTTP 500），改用
        // u.y.qq.com/cgi-bin/musicu.fcg 的 music.globalComment.CommentReadServer。
        // 该接口用 PageNum（0-based）直接翻页，无需 cursor；热门需 HotType=1。
        var param = new CommentReadParams(
            (int)bizType,
            bizId.ToString(),
            "",
            size,
            pageNum,
            hot ? 1 : null,
            hot ? 0 : null,
            hot ? null : "",
            hot ? null : 0);
        var payload = new CommentReadGatewayRequest(
            CreateCommentGatewayCommon(),
            new CommentReadRequest(
                "music.globalComment.CommentReadServer",
                hot ? "GetHotCommentList" : "GetNewCommentList",
                param));

        try
        {
            using var doc = JsonDocument.Parse(await PostMusicuAsync(payload, ct).ConfigureAwait(false));
            var root = doc.RootElement;
            if (!root.TryGetProperty("getCmtList", out var container) ||
                ReadCommentInt(container, "code") != 0 ||
                !container.TryGetProperty("data", out var data) ||
                !data.TryGetProperty("CommentList", out var commentList) ||
                !commentList.TryGetProperty("Comments", out var comments) ||
                comments.ValueKind != JsonValueKind.Array)
            {
                return new([], false, 0, "");
            }

            int total = ReadCommentInt(commentList, "Total");
            bool hasMore = ReadCommentInt(commentList, "HasMore") != 0;
            var result = new List<MusicComment>(comments.GetArrayLength());
            foreach (var item in comments.EnumerateArray())
            {
                string id = ReadCommentText(item, "CmId");
                result.Add(new MusicComment(
                    id,
                    id,
                    ReadCommentText(item, "Nick"),
                    ReadCommentText(item, "Avatar"),
                    ReadCommentText(item, "Content"),
                    ReadCommentLong(item, "PubTime"),
                    ReadCommentInt(item, "PraiseNum"),
                    ReadCommentInt(item, "ReplyCnt"),
                    ReadCommentInt(item, "IsPraised") != 0,
                    ReadCommentInt(item, "IsSelf") != 0));
            }
            return new(result, hasMore, total, "");
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            AppLogger.Error("Comment", $"{method} failed for {bizType}/{bizId}", ex);
            return new([], false, 0, "");
        }
    }

    public static async Task<CommentMutationResult> AddCommentAsync(long bizId, CommentBizType bizType, string content, string? replyCommentId = null, CancellationToken ct = default)
    {
        if (!UserSession.Current.IsLoggedIn) return new(false, "请先登录");
        if (bizId <= 0 || string.IsNullOrWhiteSpace(content)) return new(false, "评论对象或内容无效");
        await LoginService.EnsureMusicKeyAsync(ct).ConfigureAwait(false);

        var param = new CommentWriteParams(
            content.Trim(),
            (int)bizType,
            bizId.ToString(),
            bizType == CommentBizType.Song ? 2 : null,
            string.IsNullOrWhiteSpace(replyCommentId) ? null : replyCommentId,
            null);
        var payload = new CommentWriteGatewayRequest(
            CreateCommentGatewayCommon(),
            new CommentWriteRequest(
                "music.globalComment.CommentWriteServer",
                "AddComment",
                param));

        try
        {
            using var doc = JsonDocument.Parse(await PostMusicuAsync(payload, ct).ConfigureAwait(false));
            if (!doc.RootElement.TryGetProperty("comment", out var response)) return new(false, "评论服务无响应");
            int code = ReadCommentInt(response, "code");
            var data = response.TryGetProperty("data", out var value) ? value : response;
            int subCode = ReadCommentInt(data, "SubCode");
            string message = ReadCommentText(data, "Msg");
            string id = ReadCommentText(data, "AddedCmId");
            bool ok = code == 0 && subCode == 0;
            return new(ok, string.IsNullOrWhiteSpace(message) ? (ok ? "评论成功" : $"评论失败 ({code}/{subCode})") : message, id);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            AppLogger.Error("Comment", $"AddCommentAsync failed for {bizType}/{bizId}", ex);
            return new(false, ex.Message);
        }
    }

    public static async Task<CommentMutationResult> DeleteCommentAsync(string commentId, CancellationToken ct = default)
    {
        if (!UserSession.Current.IsLoggedIn) return new(false, "请先登录");
        if (string.IsNullOrWhiteSpace(commentId)) return new(false, "评论 ID 无效");
        await LoginService.EnsureMusicKeyAsync(ct).ConfigureAwait(false);
        var payload = new CommentWriteGatewayRequest(
            CreateCommentGatewayCommon(),
            new CommentWriteRequest(
                "music.globalComment.CommentWriteServer",
                "DelComment",
                new CommentWriteParams(null, 0, null, null, null, commentId)));

        try
        {
            using var doc = JsonDocument.Parse(await PostMusicuAsync(payload, ct).ConfigureAwait(false));
            if (!doc.RootElement.TryGetProperty("comment", out var response)) return new(false, "评论服务无响应");
            var data = response.TryGetProperty("data", out var value) ? value : response;
            int subCode = ReadCommentInt(data, "SubCode");
            string message = ReadCommentText(data, "Msg");
            bool ok = ReadCommentInt(response, "code") == 0 && subCode == 0;
            return new(ok, string.IsNullOrWhiteSpace(message) ? (ok ? "删除成功" : "删除失败") : message, commentId);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            AppLogger.Error("Comment", $"DeleteCommentAsync failed for {commentId}", ex);
            return new(false, ex.Message);
        }
    }

    private static CommentGatewayCommon CreateCommentGatewayCommon()
    {
        var session = UserSession.Current;
        var uin = string.IsNullOrWhiteSpace(session.EncryptedUin) ? session.Uin : session.EncryptedUin;
        return new CommentGatewayCommon(uin, "json", 19, 2009, session.MusicKey);
    }

    private static Task<string> PostMusicuAsync(CommentReadGatewayRequest payload, CancellationToken ct) =>
        PostMusicuAsync(JsonContent.Create(payload, CommentApiJsonContext.Default.CommentReadGatewayRequest), ct);

    private static Task<string> PostMusicuAsync(CommentWriteGatewayRequest payload, CancellationToken ct) =>
        PostMusicuAsync(JsonContent.Create(payload, CommentApiJsonContext.Default.CommentWriteGatewayRequest), ct);

    private static async Task<string> PostMusicuAsync(HttpContent content, CancellationToken ct)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://u.y.qq.com/cgi-bin/musicu.fcg") { Content = content };
        request.Headers.TryAddWithoutValidation("Origin", "https://y.qq.com");
        request.Headers.Referrer = new Uri("https://y.qq.com/");
        var cookies = UserSession.Current.GetCookieHeader();
        if (!string.IsNullOrWhiteSpace(cookies)) request.Headers.TryAddWithoutValidation("Cookie", cookies);
        using var response = await s_httpClient.SendAsync(request, ct).ConfigureAwait(false);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
    }

    private static string ReadCommentText(JsonElement source, string name)
    {
        if (!source.TryGetProperty(name, out var value)) return "";
        return value.ValueKind == JsonValueKind.String ? value.GetString() ?? "" : value.ValueKind == JsonValueKind.Number ? value.GetRawText() : "";
    }

    private static long ReadCommentLong(JsonElement source, string name)
    {
        var text = ReadCommentText(source, name);
        return long.TryParse(text, out var result) ? result : 0;
    }

    private static int ReadCommentInt(JsonElement source, string name)
    {
        var number = ReadCommentLong(source, name);
        return number > int.MaxValue ? int.MaxValue : (int)number;
    }
}

internal sealed record CommentReadGatewayRequest(
    [property: JsonPropertyName("comm")] CommentGatewayCommon Comm,
    [property: JsonPropertyName("getCmtList")] CommentReadRequest GetCmtList);
internal sealed record CommentWriteGatewayRequest(
    [property: JsonPropertyName("comm")] CommentGatewayCommon Comm,
    [property: JsonPropertyName("comment")] CommentWriteRequest Comment);
internal sealed record CommentGatewayCommon(string Uin, string Format, int Ct, int Cv, string Authst);
internal sealed record CommentReadRequest(
    [property: JsonPropertyName("module")] string Module,
    [property: JsonPropertyName("method")] string Method,
    [property: JsonPropertyName("param")] CommentReadParams Param);
internal sealed record CommentWriteRequest(
    [property: JsonPropertyName("module")] string Module,
    [property: JsonPropertyName("method")] string Method,
    [property: JsonPropertyName("param")] CommentWriteParams Param);
internal sealed record CommentReadParams(
    int BizType,
    string BizId,
    string LastCommentSeqNo,
    int PageSize,
    int PageNum,
    int? HotType,
    int? WithAirborne,
    string? FromCommentId,
    int? WithHot);
internal sealed record CommentWriteParams(
    string? Content,
    int BizType,
    string? BizId,
    int? BizSubType,
    string? RepliedCmId,
    string? CommentId);

[JsonSourceGenerationOptions(DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull)]
[JsonSerializable(typeof(CommentReadGatewayRequest))]
[JsonSerializable(typeof(CommentGatewayCommon))]
[JsonSerializable(typeof(CommentWriteGatewayRequest))]
[JsonSerializable(typeof(CommentReadParams))]
[JsonSerializable(typeof(CommentWriteParams))]
internal sealed partial class CommentApiJsonContext : JsonSerializerContext
{
}
