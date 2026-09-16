using System.Net.Sockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using QmTui.Api;

namespace QmTui.Services;

internal sealed record WebCommentRequest(long BizId, CommentBizType BizType, string Content, string ReplyCommentId);
internal sealed record WebDeleteCommentRequest(string CommentId);
internal sealed record WebCommentPageResponse(List<MusicComment> Comments, bool HasMore, int Total, string Cursor);
internal sealed record WebCommentMutationResponse(bool Ok, string Message, string CommentId);

public sealed partial class WebPlaybackServer
{
    private static async Task HandleCommentsAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        if (!long.TryParse(GetQueryParameter(rawPath, "bizId"), out var bizId) || bizId <= 0)
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"valid bizId is required\"}", ct).ConfigureAwait(false);
            return;
        }
        int rawType = ParsePositiveQueryParameter(rawPath, "bizType", (int)CommentBizType.Song);
        if (!Enum.IsDefined(typeof(CommentBizType), rawType)) rawType = (int)CommentBizType.Song;
        var bizType = (CommentBizType)rawType;
        int page = ParsePositiveQueryParameter(rawPath, "page", 1);
        var cursor = GetQueryParameter(rawPath, "cursor") ?? "";
        bool hot = !string.Equals(GetQueryParameter(rawPath, "sort"), "new", StringComparison.OrdinalIgnoreCase);
        var comments = hot
            ? await MusicApi.GetHotCommentsAsync(bizId, bizType, page, 20, cursor, ct).ConfigureAwait(false)
            : await MusicApi.GetNewCommentsAsync(bizId, bizType, page, 20, cursor, ct).ConfigureAwait(false);
        var response = new WebCommentPageResponse(comments.Comments, comments.HasMore, comments.Total, comments.Cursor);
        var json = JsonSerializer.Serialize(response, WebCommentJsonContext.Default.WebCommentPageResponse);
        await SendResponseAsync(stream, 200, "OK", "application/json", json, ct).ConfigureAwait(false);
    }

    private static async Task HandleAddCommentAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        WebCommentRequest? request;
        try { request = JsonSerializer.Deserialize(body, WebCommentJsonContext.Default.WebCommentRequest); }
        catch (JsonException) { request = null; }
        if (request is null || request.BizId <= 0 || string.IsNullOrWhiteSpace(request.Content))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"comment target and content are required\"}", ct).ConfigureAwait(false);
            return;
        }
        var result = await MusicApi.AddCommentAsync(request.BizId, request.BizType, request.Content, request.ReplyCommentId, ct).ConfigureAwait(false);
        await SendCommentMutationAsync(stream, result, ct).ConfigureAwait(false);
    }

    private static async Task HandleDeleteCommentAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        WebDeleteCommentRequest? request;
        try { request = JsonSerializer.Deserialize(body, WebCommentJsonContext.Default.WebDeleteCommentRequest); }
        catch (JsonException) { request = null; }
        if (string.IsNullOrWhiteSpace(request?.CommentId))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"comment id is required\"}", ct).ConfigureAwait(false);
            return;
        }
        var result = await MusicApi.DeleteCommentAsync(request.CommentId, ct).ConfigureAwait(false);
        await SendCommentMutationAsync(stream, result, ct).ConfigureAwait(false);
    }

    private static async Task SendCommentMutationAsync(NetworkStream stream, CommentMutationResult result, CancellationToken ct)
    {
        var response = new WebCommentMutationResponse(result.Success, result.Message, result.CommentId);
        var json = JsonSerializer.Serialize(response, WebCommentJsonContext.Default.WebCommentMutationResponse);
        await SendResponseAsync(stream, result.Success ? 200 : 409, result.Success ? "OK" : "Conflict", "application/json", json, ct).ConfigureAwait(false);
    }
}

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase, PropertyNameCaseInsensitive = true, UnmappedMemberHandling = JsonUnmappedMemberHandling.Skip)]
[JsonSerializable(typeof(WebCommentRequest))]
[JsonSerializable(typeof(WebDeleteCommentRequest))]
[JsonSerializable(typeof(WebCommentPageResponse))]
[JsonSerializable(typeof(WebCommentMutationResponse))]
internal sealed partial class WebCommentJsonContext : JsonSerializerContext
{
}
