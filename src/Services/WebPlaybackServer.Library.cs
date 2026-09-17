using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using QmTui.Api;
using QmTui.Models;

namespace QmTui.Services;

public sealed record WebLibraryPlayRequest(Song Song, List<Song> Context);
internal sealed record WebPlaylistMutationRequest(long DirId, long Tid, string Name, bool IsFav, Song? Song);
internal sealed record WebCreatePlaylistRequest(string Name);
internal sealed record WebQueueAddRequest(Song Song, bool Next);
internal sealed record WebAlbumMutationRequest(string AlbumMid);
internal sealed record WebPlaylistFavoriteRequest(long Tid, bool Favorite);
internal sealed record WebPlaylistFavoriteResponse(bool IsFavorite);
internal sealed record WebSingerFavoriteRequest(string Mid, bool Favorite);
internal sealed record WebSingerFavoriteResponse(bool IsFavorite);

public sealed partial class WebPlaybackServer
{
    private const int WebLibraryPageSize = 50;

    private static async Task HandleLibrarySearchAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        var query = GetQueryParameter(rawPath, "query");
        int page = ParsePositiveQueryParameter(rawPath, "page", 1);
        if (string.IsNullOrWhiteSpace(query))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"query is required\"}", ct).ConfigureAwait(false);
            return;
        }

        var songs = await MusicApi.SearchAsync(query, page, WebLibraryPageSize, ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibrarySongsResponse(query, page, songs, songs.Count == WebLibraryPageSize), ct).ConfigureAwait(false);
    }

    private static async Task HandleLibraryPlaylistSearchAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        var query = GetQueryParameter(rawPath, "query");
        int page = ParsePositiveQueryParameter(rawPath, "page", 1);
        if (string.IsNullOrWhiteSpace(query))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"query is required\"}", ct).ConfigureAwait(false);
            return;
        }

        var playlists = await MusicApi.SearchPlaylistsAsync(query, page, WebLibraryPageSize, ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibraryPlaylistsResponse(playlists.Items, playlists.HasMore), ct).ConfigureAwait(false);
    }

    private static async Task HandleLibraryAlbumSearchAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        var query = GetQueryParameter(rawPath, "query");
        int page = ParsePositiveQueryParameter(rawPath, "page", 1);
        if (string.IsNullOrWhiteSpace(query))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"query is required\"}", ct).ConfigureAwait(false);
            return;
        }

        var albums = await MusicApi.SearchAlbumsAsync(query, page, WebLibraryPageSize, ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibraryAlbumsResponse(albums.Items, albums.HasMore), ct).ConfigureAwait(false);
    }
    private static async Task HandleSingerSearchAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        var query = GetQueryParameter(rawPath, "query");
        int page = ParsePositiveQueryParameter(rawPath, "page", 1);
        if (string.IsNullOrWhiteSpace(query))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"query is required\"}", ct).ConfigureAwait(false);
            return;
        }

        // 注意：歌手搜索的 num_per_page 有上限——实测 >=45 时该 CGI 直接返回空 singer 列表
        // （code 仍为 0，jsonLen≈908），40 及以下正常。故这里固定用 20，不能沿用 WebLibraryPageSize(50)。
        var singers = await MusicApi.SearchSingersAsync(query, page, 20, ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibrarySingersResponse(singers.Items, singers.HasMore), ct).ConfigureAwait(false);
    }

    private static async Task HandleDailyRecommendationsAsync(NetworkStream stream, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        var songs = await MusicApi.GetDailyRecommendSongsAsync(ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibrarySongsResponse("每日30首", 1, songs, false), ct).ConfigureAwait(false);
    }

    private static async Task HandleGuessRecommendationsAsync(NetworkStream stream, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        var songs = await MusicApi.GetGuessRecommendSongsAsync(WebLibraryPageSize, ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibrarySongsResponse("猜你喜欢", 1, songs, false), ct).ConfigureAwait(false);
    }

    private static async Task HandleFavoriteSongsAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        var playlist = new Playlist(201, "我喜欢", 0);
        int page = ParsePositiveQueryParameter(rawPath, "page", 1);
        var songs = await MusicApi.GetPlaylistSongsAsync(playlist, page, WebLibraryPageSize, ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibrarySongsResponse("我喜欢", page, songs, songs.Count == WebLibraryPageSize), ct).ConfigureAwait(false);
    }


    private static async Task HandleLibraryPlaylistsAsync(NetworkStream stream, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        var playlists = await MusicApi.GetPlaylistsAsync(ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibraryPlaylistsResponse(playlists, false), ct).ConfigureAwait(false);
    }

    private static async Task HandleLibraryPlaylistAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        if (!long.TryParse(GetQueryParameter(rawPath, "dirId"), out var dirId) || dirId <= 0)
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"valid dirId is required\"}", ct).ConfigureAwait(false);
            return;
        }

        var playlist = new Playlist(
            dirId,
            GetQueryParameter(rawPath, "name") ?? "未命名歌单",
            0,
            ParseLongQueryParameter(rawPath, "tid"),
            ParseBooleanQueryParameter(rawPath, "isFav"));
        int page = ParsePositiveQueryParameter(rawPath, "page", 1);
        var songs = await MusicApi.GetPlaylistSongsAsync(playlist, page, WebLibraryPageSize, ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibrarySongsResponse(playlist.Name, page, songs, songs.Count == WebLibraryPageSize), ct).ConfigureAwait(false);
    }

    private static async Task HandleLibraryAlbumAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        var albumMid = GetQueryParameter(rawPath, "mid");
        if (string.IsNullOrWhiteSpace(albumMid))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"album mid is required\"}", ct).ConfigureAwait(false);
            return;
        }

        var detail = await MusicApi.GetAlbumDetailInfoAsync(albumMid, ct).ConfigureAwait(false);
        if (detail is null)
        {
            await SendResponseAsync(stream, 404, "Not Found", "application/json", "{\"error\":\"album not found\"}", ct).ConfigureAwait(false);
            return;
        }
        await SendLibraryJsonAsync(stream, new WebLibraryAlbumDetailResponse(detail), ct).ConfigureAwait(false);
    }

    private static async Task HandleFavoriteAlbumsAsync(NetworkStream stream, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        var albums = await MusicApi.GetFavoriteAlbumsAsync(ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibraryAlbumsResponse(albums, false), ct).ConfigureAwait(false);
    }

    private static async Task HandleSingerDetailAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        string mid = GetQueryParameter(rawPath, "mid") ?? "";
        long id = ParseLongQueryParameter(rawPath, "id");
        string name = GetQueryParameter(rawPath, "name") ?? "";
        if (string.IsNullOrWhiteSpace(mid) && id <= 0 && string.IsNullOrWhiteSpace(name))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"singer mid, id or name is required\"}", ct).ConfigureAwait(false);
            return;
        }

        var detail = await MusicApi.GetSingerDetailAsync(mid, id, name, ct).ConfigureAwait(false);
        if (detail is null)
        {
            await SendResponseAsync(stream, 404, "Not Found", "application/json", "{\"error\":\"singer not found\"}", ct).ConfigureAwait(false);
            return;
        }

        await SendLibraryJsonAsync(stream, new WebSingerDetailResponse(detail.Mid, detail.Id, detail.Name, detail.Brief, detail.Songs), ct).ConfigureAwait(false);
    }

    private static async Task HandleSingerSongsAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        string mid = GetQueryParameter(rawPath, "mid") ?? "";
        if (string.IsNullOrWhiteSpace(mid))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"singer mid is required\"}", ct).ConfigureAwait(false);
            return;
        }

        int begin = (int)Math.Max(0, ParseLongQueryParameter(rawPath, "begin"));
        int pageSize = ParsePositiveQueryParameter(rawPath, "pageSize", 30);
        // order: 1=热门(sort=5), 0=最新(sort=2)。不能用 ParsePositiveQueryParameter——它把 0 视为缺省并回退到 1。
        int order = int.TryParse(GetQueryParameter(rawPath, "order"), out var parsedOrder) && parsedOrder == 0 ? 0 : 1;
        var (songs, total) = await MusicApi.GetSingerSongListAsync(mid, begin, pageSize, order, ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebSingerSongsResponse(songs, total, begin + songs.Count < total), ct).ConfigureAwait(false);
    }

    private static async Task HandleSingerAlbumsAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        string mid = GetQueryParameter(rawPath, "mid") ?? "";
        if (string.IsNullOrWhiteSpace(mid))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"singer mid is required\"}", ct).ConfigureAwait(false);
            return;
        }

        int begin = (int)Math.Max(0, ParseLongQueryParameter(rawPath, "begin"));
        int pageSize = ParsePositiveQueryParameter(rawPath, "pageSize", 30);
        var albums = await MusicApi.GetSingerAlbumListAsync(mid, begin, pageSize, ct).ConfigureAwait(false);
        await SendLibraryJsonAsync(stream, new WebLibraryAlbumsResponse(albums, albums.Count == pageSize), ct).ConfigureAwait(false);
    }

    private static async Task HandleSingerFavoriteStateAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        string mid = GetQueryParameter(rawPath, "mid") ?? "";
        if (string.IsNullOrWhiteSpace(mid))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"singer mid is required\"}", ct).ConfigureAwait(false);
            return;
        }

        bool isFavorite = UserSession.Current.FavoriteSingers.Contains(mid);
        await SendLibraryJsonAsync(stream, new WebSingerFavoriteResponse(isFavorite), WebLibraryJsonContext.Default.WebSingerFavoriteResponse, ct).ConfigureAwait(false);
    }

    private static async Task HandleSingerFavoriteMutationAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        WebSingerFavoriteRequest? request;
        try { request = JsonSerializer.Deserialize(body, WebLibraryJsonContext.Default.WebSingerFavoriteRequest); }
        catch (JsonException) { request = null; }
        if (request is null || string.IsNullOrWhiteSpace(request.Mid))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"singer mid is required\"}", ct).ConfigureAwait(false);
            return;
        }

        // 关注歌手是本地集合（与 TUI 的 UserSession.FavoriteSingers 共用），无服务端 CGI。
        bool ok = request.Favorite
            ? UserSession.Current.FavoriteSingers.Add(request.Mid)
            : UserSession.Current.FavoriteSingers.Remove(request.Mid);
        if (ok) UserSession.Current.Save();

        await SendMutationResultAsync(stream, ok, ok
            ? (request.Favorite ? "已关注" : "已取消关注")
            : (request.Favorite ? "已关注过该歌手" : "尚未关注该歌手"), ct).ConfigureAwait(false);
    }

    private async Task HandleQueueAddAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        WebQueueAddRequest? request;
        try { request = JsonSerializer.Deserialize(body, WebLibraryJsonContext.Default.WebQueueAddRequest); }
        catch (JsonException) { request = null; }
        if (request?.Song is null || (string.IsNullOrWhiteSpace(request.Song.Mid) && request.Song.Id <= 0))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"song is required\"}", ct).ConfigureAwait(false);
            return;
        }

        QueueAddRequested?.Invoke(request.Song, request.Next);
        await SendResponseAsync(stream, 202, "Accepted", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
    }

    private async Task HandleLibraryPlayAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        WebLibraryPlayRequest? request;
        try
        {
            request = JsonSerializer.Deserialize(body, WebLibraryJsonContext.Default.WebLibraryPlayRequest);
        }
        catch (JsonException)
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"invalid play request\"}", ct).ConfigureAwait(false);
            return;
        }

        if (request?.Song is null || string.IsNullOrWhiteSpace(request.Song.Mid))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"song mid is required\"}", ct).ConfigureAwait(false);
            return;
        }

        var context = request.Context ?? [];
        if (context.Count == 0) context.Add(request.Song);
        else if (!context.Any(song => IsSameSong(song, request.Song))) context.Insert(0, request.Song);

        LibraryPlayRequested?.Invoke(new WebLibraryPlayRequest(request.Song, context));
        await SendResponseAsync(stream, 202, "Accepted", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
    }

    private static async Task HandleCreatePlaylistAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        WebCreatePlaylistRequest? request;
        try { request = JsonSerializer.Deserialize(body, WebLibraryJsonContext.Default.WebCreatePlaylistRequest); }
        catch (JsonException) { request = null; }
        if (string.IsNullOrWhiteSpace(request?.Name))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"playlist name is required\"}", ct).ConfigureAwait(false);
            return;
        }

        var result = await MusicApi.CreatePlaylistAsync(request.Name, ct).ConfigureAwait(false);
        int status = result.Success ? 201 : 409;
        var payload = JsonSerializer.Serialize(new WebMutationResponse(result.Success, result.Message, result.DissId), WebLibraryJsonContext.Default.WebMutationResponse);
        await SendResponseAsync(stream, status, result.Success ? "Created" : "Conflict", "application/json", payload, ct).ConfigureAwait(false);
    }

    private static async Task HandleDeletePlaylistAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        var request = ParsePlaylistMutation(body);
        if (request is null || request.DirId <= 0)
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"playlist is required\"}", ct).ConfigureAwait(false);
            return;
        }
        var playlist = ToPlaylist(request);
        bool ok = await MusicApi.DeletePlaylistAsync(playlist, ct).ConfigureAwait(false);
        await SendMutationResultAsync(stream, ok, ok ? "删除成功" : "删除失败", ct).ConfigureAwait(false);
    }

    private static async Task HandlePlaylistFavoriteStateAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        long tid = ParseLongQueryParameter(rawPath, "tid");
        if (tid <= 0)
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"playlist tid is required\"}", ct).ConfigureAwait(false);
            return;
        }

        var state = await MusicApi.GetPlaylistFavoriteStateAsync(tid, ct).ConfigureAwait(false);
        if (!state.Success)
        {
            await SendResponseAsync(stream, 502, "Bad Gateway", "application/json", "{\"error\":\"playlist favorite state unavailable\"}", ct).ConfigureAwait(false);
            return;
        }
        await SendLibraryJsonAsync(stream, new WebPlaylistFavoriteResponse(state.IsFavorite), WebLibraryJsonContext.Default.WebPlaylistFavoriteResponse, ct).ConfigureAwait(false);
    }

    private static async Task HandlePlaylistFavoriteMutationAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        WebPlaylistFavoriteRequest? request;
        try { request = JsonSerializer.Deserialize(body, WebLibraryJsonContext.Default.WebPlaylistFavoriteRequest); }
        catch (JsonException) { request = null; }
        if (request is null || request.Tid <= 0)
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"playlist tid is required\"}", ct).ConfigureAwait(false);
            return;
        }

        bool ok = await MusicApi.SetPlaylistFavoriteAsync(request.Tid, request.Favorite, ct).ConfigureAwait(false);
        await SendMutationResultAsync(stream, ok, ok ? (request.Favorite ? "收藏成功" : "取消收藏成功") : (request.Favorite ? "收藏失败" : "取消收藏失败"), ct).ConfigureAwait(false);
    }

    private static async Task HandlePlaylistSongMutationAsync(NetworkStream stream, string body, bool add, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        var request = ParsePlaylistMutation(body);
        if (request is null || request.DirId <= 0 || request.Song is null)
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"playlist and song are required\"}", ct).ConfigureAwait(false);
            return;
        }
        var playlist = ToPlaylist(request);
        bool ok = add
            ? await MusicApi.AddSongToPlaylistAsync(playlist, request.Song, ct).ConfigureAwait(false)
            : await MusicApi.RemoveSongFromPlaylistAsync(playlist, request.Song, ct).ConfigureAwait(false);
        await SendMutationResultAsync(stream, ok, ok ? (add ? "添加成功" : "移除成功") : (add ? "添加失败" : "移除失败"), ct).ConfigureAwait(false);
    }

    // The recovered web bundle issues playlist mutations through its batched
    // ufetch() POST to u.y.qq.com/cgi-bin/musicu.fcg. qmtui-bootstrap rewrites
    // that XHR to /api/browser/ufetch and forwards the body here so the native
    // "添加到歌单" flow performs a real mutation instead of a blind {code:0}
    // noop that made the bundle throw on res.addSongsToPlayList.code.
    private static async Task HandleBrowserUfetchAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;

        JsonDocument? doc = null;
        try { doc = JsonDocument.Parse(body); }
        catch (JsonException) { /* fall through to noop */ }

        var sb = new StringBuilder(256);
        sb.Append("{\"code\":0");
        if (doc is not null)
        {
            var root = doc.RootElement;
            sb.Append(await BuildUfetchCreatePlaylistAsync(root, ct).ConfigureAwait(false));
            sb.Append(await BuildUfetchSongMutationAsync(root, "addSongsToPlayList", add: true, ct).ConfigureAwait(false));
            sb.Append(await BuildUfetchSongMutationAsync(root, "deleteSongsFromPlayList", add: false, ct).ConfigureAwait(false));
            sb.Append(BuildUfetchReadFragments(root));
        }
        sb.Append('}');
        doc?.Dispose();
        await SendResponseAsync(stream, 200, "OK", "application/json", sb.ToString(), ct).ConfigureAwait(false);
    }

    // `,"createNewPlayList":{"code":0,"data":{"result":{"dirId":N}}}` — the
    // bundle reads data.result.dirId to seed the follow-up AddSonglist call.
    private static async Task<string> BuildUfetchCreatePlaylistAsync(JsonElement root, CancellationToken ct)
    {
        if (!root.TryGetProperty("createNewPlayList", out var op) ||
            !op.TryGetProperty("param", out var param) ||
            !param.TryGetProperty("dirName", out var dirNameEl))
        {
            return string.Empty;
        }

        string name = dirNameEl.GetString() ?? "";
        if (string.IsNullOrWhiteSpace(name)) return string.Empty;

        var (ok, dissId, _) = await MusicApi.CreatePlaylistAsync(name, ct).ConfigureAwait(false);
        return $",\"createNewPlayList\":{{\"code\":{(ok ? "0" : "-1")},\"data\":{{\"result\":{{\"dirId\":{dissId}}}}}}}";
    }

    // `,"<key>":{"code":0,"data":{}}` for add/delete; "" when the batch body
    // does not carry that key. v_songInfo items are {songType, songId, songMid}.
    private static async Task<string> BuildUfetchSongMutationAsync(JsonElement root, string key, bool add, CancellationToken ct)
    {
        if (!root.TryGetProperty(key, out var op) ||
            !op.TryGetProperty("param", out var param) ||
            !param.TryGetProperty("dirId", out var dirIdEl))
        {
            return string.Empty;
        }

        long dirId = dirIdEl.GetInt64();
        if (dirId <= 0 || !param.TryGetProperty("v_songInfo", out var songsEl) || songsEl.ValueKind != JsonValueKind.Array)
        {
            return string.Empty;
        }

        bool ok = true;
        var playlist = new Playlist(dirId, "", 0, 0, false);
        foreach (var item in songsEl.EnumerateArray())
        {
            long songId = item.TryGetProperty("songId", out var idEl) ? idEl.GetInt64() : 0;
            string mid = item.TryGetProperty("songMid", out var midEl) ? midEl.GetString() ?? "" : "";
            if (songId <= 0 && string.IsNullOrEmpty(mid)) continue;
            var song = new Song(mid, "", "", "", 0, Id: songId);
            bool one = add
                ? await MusicApi.AddSongToPlaylistAsync(playlist, song, ct).ConfigureAwait(false)
                : await MusicApi.RemoveSongFromPlaylistAsync(playlist, song, ct).ConfigureAwait(false);
            if (!one) ok = false;
        }

        return $",\"{key}\":{{\"code\":{(ok ? "0" : "-1")},\"data\":{{}}}}";
    }

    // READ keys the recovered favorite page (getUserFavAssets, module 92214)
    // consumes UNGUARDED: it destructures res.getCollectSongList.code === 0
    // directly and throws a TypeError when the key is absent, surfacing
    // "获取用户资产失败，请稍后重试". The bridge renders /like itself via
    // /api/library/* (and hides the native page behind .route_wrap), so the
    // native page only needs a non-throwing, well-formed empty response.
    // Deliberately EXCLUDED: getSelfCreatePLayList / getPlaylistFavInfo /
    // getFavSongList (refreshSelfPlayList) — those are guarded and, if we
    // answered them, would clobber the sidebar stores refreshLibrary already
    // populates from /api/library/playlists.
    private static readonly (string Key, string EmptyData)[] UfetchReadKeys =
    {
        ("getCollectSongList", "{\"list\":[],\"hasmore\":false,\"total\":0}"),
        ("getCollectAlbumList", "{\"v_list\":[]}"),
        ("getCollectAudioList", "{\"vec_favor\":[]}"),
        ("getMyFavMV", "{\"total\":0,\"mvlist\":[],\"hasmore\":0}"),
    };

    // `,"<key>":{"code":0,"data":<EmptyData>}` for each present read key; "" otherwise.
    private static string BuildUfetchReadFragments(JsonElement root)
    {
        var sb = new StringBuilder(128);
        foreach (var (key, emptyData) in UfetchReadKeys)
        {
            if (root.TryGetProperty(key, out _))
                sb.Append(",\"").Append(key).Append("\":{\"code\":0,\"data\":").Append(emptyData).Append('}');
        }
        return sb.ToString();
    }

    private static async Task HandleAlbumFavoriteMutationAsync(NetworkStream stream, string body, bool add, CancellationToken ct)
    {
        if (!await RequireLoginAsync(stream, ct).ConfigureAwait(false)) return;
        WebAlbumMutationRequest? request;
        try { request = JsonSerializer.Deserialize(body, WebLibraryJsonContext.Default.WebAlbumMutationRequest); }
        catch (JsonException) { request = null; }
        if (string.IsNullOrWhiteSpace(request?.AlbumMid))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"album mid is required\"}", ct).ConfigureAwait(false);
            return;
        }
        bool ok = add
            ? await MusicApi.AddAlbumToFavoriteAsync(request.AlbumMid, ct).ConfigureAwait(false)
            : await MusicApi.RemoveAlbumFromFavoriteAsync(request.AlbumMid, ct).ConfigureAwait(false);
        await SendMutationResultAsync(stream, ok, ok ? (add ? "收藏成功" : "取消收藏成功") : "操作失败", ct).ConfigureAwait(false);
    }

    private static WebPlaylistMutationRequest? ParsePlaylistMutation(string body)
    {
        try { return JsonSerializer.Deserialize(body, WebLibraryJsonContext.Default.WebPlaylistMutationRequest); }
        catch (JsonException) { return null; }
    }

    private static Playlist ToPlaylist(WebPlaylistMutationRequest request) =>
        new(request.DirId, string.IsNullOrWhiteSpace(request.Name) ? "未命名歌单" : request.Name, 0, request.Tid, request.IsFav);

    private static async Task<bool> RequireLoginAsync(NetworkStream stream, CancellationToken ct)
    {
        if (UserSession.Current.IsLoggedIn) return true;
        await SendResponseAsync(stream, 401, "Unauthorized", "application/json", "{\"error\":\"login required\"}", ct).ConfigureAwait(false);
        return false;
    }

    private static async Task SendMutationResultAsync(NetworkStream stream, bool ok, string message, CancellationToken ct)
    {
        var payload = JsonSerializer.Serialize(new WebMutationResponse(ok, message, 0), WebLibraryJsonContext.Default.WebMutationResponse);
        await SendResponseAsync(stream, ok ? 200 : 409, ok ? "OK" : "Conflict", "application/json", payload, ct).ConfigureAwait(false);
    }

    private static bool IsSameSong(Song left, Song right) =>
        (!string.IsNullOrEmpty(left.Mid) && left.Mid == right.Mid) || (left.Id > 0 && left.Id == right.Id);

    private static string? GetQueryParameter(string rawPath, string name)
    {
        int separator = rawPath.IndexOf('?');
        if (separator < 0 || separator == rawPath.Length - 1) return null;
        foreach (var pair in rawPath[(separator + 1)..].Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var parts = pair.Split('=', 2);
            if (parts.Length == 2 && parts[0].Equals(name, StringComparison.OrdinalIgnoreCase))
                return Uri.UnescapeDataString(parts[1].Replace('+', ' '));
        }
        return null;
    }

    private static int ParsePositiveQueryParameter(string rawPath, string name, int fallback) =>
        int.TryParse(GetQueryParameter(rawPath, name), out var value) && value > 0 ? value : fallback;
    private static long ParseLongQueryParameter(string rawPath, string name) =>
        long.TryParse(GetQueryParameter(rawPath, name), out var value) ? value : 0;
    private static bool ParseBooleanQueryParameter(string rawPath, string name) =>
        bool.TryParse(GetQueryParameter(rawPath, name), out var value) && value;

    private static async Task SendLibraryJsonAsync<T>(NetworkStream stream, T value, JsonTypeInfo<T> typeInfo, CancellationToken ct)
    {
        var json = JsonSerializer.Serialize(value, typeInfo);
        await SendResponseAsync(stream, 200, "OK", "application/json", json, ct).ConfigureAwait(false);
    }
    private static Task SendLibraryJsonAsync(NetworkStream stream, WebLibrarySongsResponse value, CancellationToken ct) =>
        SendLibraryJsonAsync(stream, value, WebLibraryJsonContext.Default.WebLibrarySongsResponse, ct);
    private static Task SendLibraryJsonAsync(NetworkStream stream, WebLibraryPlaylistsResponse value, CancellationToken ct) =>
        SendLibraryJsonAsync(stream, value, WebLibraryJsonContext.Default.WebLibraryPlaylistsResponse, ct);
    private static Task SendLibraryJsonAsync(NetworkStream stream, WebLibraryAlbumsResponse value, CancellationToken ct) =>
        SendLibraryJsonAsync(stream, value, WebLibraryJsonContext.Default.WebLibraryAlbumsResponse, ct);
    private static Task SendLibraryJsonAsync(NetworkStream stream, WebLibrarySingersResponse value, CancellationToken ct) =>
        SendLibraryJsonAsync(stream, value, WebLibraryJsonContext.Default.WebLibrarySingersResponse, ct);
    private static Task SendLibraryJsonAsync(NetworkStream stream, WebLibraryAlbumDetailResponse value, CancellationToken ct) =>
        SendLibraryJsonAsync(stream, value, WebLibraryJsonContext.Default.WebLibraryAlbumDetailResponse, ct);
    private static Task SendLibraryJsonAsync(NetworkStream stream, WebSingerDetailResponse value, CancellationToken ct) =>
        SendLibraryJsonAsync(stream, value, WebLibraryJsonContext.Default.WebSingerDetailResponse, ct);
    private static Task SendLibraryJsonAsync(NetworkStream stream, WebSingerSongsResponse value, CancellationToken ct) =>
        SendLibraryJsonAsync(stream, value, WebLibraryJsonContext.Default.WebSingerSongsResponse, ct);
}

internal sealed record WebLibrarySongsResponse(string Title, int Page, List<Song> Songs, bool HasMore);
internal sealed record WebLibraryPlaylistsResponse(List<Playlist> Playlists, bool HasMore);
internal sealed record WebLibraryAlbumsResponse(List<Album> Albums, bool HasMore);
internal sealed record WebLibrarySingersResponse(List<SingerSummary> Singers, bool HasMore);
internal sealed record WebLibraryAlbumDetailResponse(AlbumDetail Album);
internal sealed record WebSingerDetailResponse(string Mid, long Id, string Name, string Brief, List<Song> Songs);
internal sealed record WebSingerSongsResponse(List<Song> Songs, int Total, bool HasMore);
internal sealed record WebMutationResponse(bool Ok, string Message, long Id);

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase, PropertyNameCaseInsensitive = true, UnmappedMemberHandling = JsonUnmappedMemberHandling.Skip)]
[JsonSerializable(typeof(WebLibraryPlayRequest))]
[JsonSerializable(typeof(WebPlaylistMutationRequest))]
[JsonSerializable(typeof(WebCreatePlaylistRequest))]
[JsonSerializable(typeof(WebQueueAddRequest))]
[JsonSerializable(typeof(WebAlbumMutationRequest))]
[JsonSerializable(typeof(WebPlaylistFavoriteRequest))]
[JsonSerializable(typeof(WebPlaylistFavoriteResponse))]
[JsonSerializable(typeof(WebSingerFavoriteRequest))]
[JsonSerializable(typeof(WebSingerFavoriteResponse))]
[JsonSerializable(typeof(WebLibrarySongsResponse))]
[JsonSerializable(typeof(WebLibraryPlaylistsResponse))]
[JsonSerializable(typeof(WebLibraryAlbumsResponse))]
[JsonSerializable(typeof(WebLibrarySingersResponse))]
[JsonSerializable(typeof(WebLibraryAlbumDetailResponse))]
[JsonSerializable(typeof(WebSingerDetailResponse))]
[JsonSerializable(typeof(WebSingerSongsResponse))]
[JsonSerializable(typeof(WebMutationResponse))]
internal sealed partial class WebLibraryJsonContext : JsonSerializerContext
{
}
