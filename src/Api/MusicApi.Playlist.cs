using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using QmTui.Models;
using QmTui.Utils;

namespace QmTui.Api;

public sealed partial class MusicApi
{
    public static async Task<List<Song>> SearchAsync(string query, int page = 1, int pageSize = 25, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(query)) return [];

        try
        {
            var escapedQuery = JsonEncodedText.Encode(query).ToString();
            var payload = $$"""
            {
              "music.search.SearchCgiService": {
                "module": "music.search.SearchCgiService",
                "method": "DoSearchForQQMusicDesktop",
                "param": {
                  "query": "{{escapedQuery}}",
                  "page_num": {{page}},
                  "num_per_page": {{pageSize}},
                  "search_type": 0
                }
              }
            }
            """;

            var json = await PostAg1Async(payload, ct).ConfigureAwait(false);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (root.TryGetProperty("music.search.SearchCgiService", out var svc) &&
                svc.TryGetProperty("data", out var data) &&
                data.TryGetProperty("body", out var body) &&
                body.TryGetProperty("song", out var songObj) &&
                songObj.TryGetProperty("list", out var songList) &&
                songList.ValueKind == JsonValueKind.Array)
            {
                var list = new List<Song>(songList.GetArrayLength());
                foreach (var item in songList.EnumerateArray())
                {
                    var song = ParseSongFromElement(item);
                    if (song != null)
                    {
                        list.Add(song);
                    }
                }
                return list;
            }

            return [];
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", $"SearchAsync error for '{query}'", ex);
            return [];
        }
    }

    /// <summary>
    /// 并发探测指定歌曲在 4 档品质下的真实可用状态及直链
    /// </summary>

    /// <summary>歌单歌曲的分页结果；Total 与 HasMore 均以服务端返回为准。</summary>
    public sealed record PlaylistSongsResult(List<Song> Songs, int Total, bool HasMore);

    /// <summary>QQ 对 size &gt; 200 的分页请求会退化成只回 20 首，故单次请求上限固定为 200。</summary>
    public const int MaxSongPageSize = 200;

    /// <summary>
    /// 获取“我喜欢”（dirId=201）歌曲，等价于按 dirId 读取歌单。
    /// </summary>
    public static Task<PlaylistSongsResult> GetFavoriteSongsAsync(int page = 1, int pageSize = 100, CancellationToken ct = default)
        => GetPlaylistSongsAsync(new Playlist(201, "我喜欢", 0), page, pageSize, ct);

    /// <summary>
    /// 获取用户每日推荐歌单（每日30首）
    /// </summary>

    public static async Task<List<Playlist>> GetPlaylistsAsync(CancellationToken ct = default)
    {
        if (!UserSession.Current.IsLoggedIn) return [];

        await LoginService.EnsureMusicKeyAsync(ct).ConfigureAwait(false);

        var uin = UserSession.Current.Uin;
        var url = "https://u.y.qq.com/cgi-bin/musicu.fcg";

        var payload = $"{{\"comm\":{{\"uin\":\"{uin}\",\"format\":\"json\",\"ct\":19,\"cv\":1,\"authst\":\"\"}}," +
            $"\"self_playlists\":{{\"module\":\"music.musicasset.PlaylistBaseRead\",\"method\":\"GetPlaylistByUin\",\"param\":{{\"uin\":\"{uin}\"}}}}," +
            $"\"fav_playlists\":{{\"module\":\"music.musicasset.PlaylistFavRead\",\"method\":\"GetPlaylistFavInfo\",\"param\":{{\"uin\":\"{uin}\"}}}}}}";

        try
        {
            using var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Content = new StringContent(payload, Encoding.UTF8, "application/json");

            var cookieHeader = UserSession.Current.GetCookieHeader();
            if (!string.IsNullOrEmpty(cookieHeader))
            {
                req.Headers.Add("Cookie", cookieHeader);
            }

            using var resp = await s_httpClient.SendAsync(req, ct).ConfigureAwait(false);
            var json = await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            var playlists = new List<Playlist>(32);

            if (root.TryGetProperty("self_playlists", out var selfObj) &&
                selfObj.TryGetProperty("data", out var selfData) &&
                selfData.TryGetProperty("v_playlist", out var selfArr) &&
                selfArr.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in selfArr.EnumerateArray())
                {
                    long dirId = item.TryGetProperty("dirId", out var d) ? d.GetInt64() : 0;
                    string name = item.TryGetProperty("dirName", out var n) ? n.GetString() ?? "" : "";
                    int count = item.TryGetProperty("songNum", out var c) ? c.GetInt32() : 0;
                    long tid = item.TryGetProperty("tid", out var t) ? t.GetInt64() : 0;
                    string pic = item.TryGetProperty("picUrl", out var p) ? p.GetString() ?? "" : "";

                    if (dirId > 0 && !string.IsNullOrEmpty(name))
                    {
                        playlists.Add(new Playlist(dirId, name, count, tid, IsFav: false, pic));
                    }
                }
            }

            if (root.TryGetProperty("fav_playlists", out var favObj) &&
                favObj.TryGetProperty("data", out var favData) &&
                favData.TryGetProperty("v_list", out var favArr) &&
                favArr.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in favArr.EnumerateArray())
                {
                    long tid = item.TryGetProperty("tid", out var t) ? t.GetInt64() : 0;
                    long dirId = item.TryGetProperty("dirId", out var d) ? d.GetInt64() : 0;
                    string name = item.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "";
                    int count = item.TryGetProperty("songnum", out var c) ? c.GetInt32() : 0;
                    string logo = item.TryGetProperty("logo", out var l) ? l.GetString() ?? "" : "";

                    if (tid > 0 && !string.IsNullOrEmpty(name))
                    {
                        playlists.Add(new Playlist(dirId, name, count, tid, IsFav: true, logo));
                    }
                }
            }

            return playlists;
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", "GetPlaylistsAsync error", ex);
            return [];
        }
    }

    /// <summary>
    /// 获取指定歌单内的所有歌曲（自建歌单与外部收藏歌单均支持）
    /// </summary>
    public static async Task<PlaylistSongsResult> GetPlaylistSongsAsync(Playlist playlist, int page = 1, int pageSize = 100, CancellationToken ct = default)
    {
        if (!playlist.IsFav)
        {
            if (!UserSession.Current.IsLoggedIn) return new PlaylistSongsResult([], 0, false);
            await LoginService.EnsureMusicKeyAsync(ct).ConfigureAwait(false);

            var uin = UserSession.Current.Uin;
            var size = Math.Clamp(pageSize, 1, MaxSongPageSize);
            var offset = Math.Max(page - 1, 0) * size;
            var url = "https://u.y.qq.com/cgi-bin/musicu.fcg";
            var payload = $"{{\"comm\":{{\"uin\":\"{uin}\",\"format\":\"json\",\"ct\":19,\"cv\":1,\"authst\":\"\"}}," +
                $"\"req_pl\":{{\"module\":\"music.musicasset.PlaylistDetailRead\",\"method\":\"GetUniformSongDetailInfo\"," +
                $"\"param\":{{\"uin\":\"{uin}\",\"dirid\":{playlist.DirId},\"bPaged\":true,\"offset\":{offset},\"size\":{size}}}}}}}";

            try
            {
                using var req = new HttpRequestMessage(HttpMethod.Post, url);
                req.Content = new StringContent(payload, Encoding.UTF8, "application/json");
                var cookieHeader = UserSession.Current.GetCookieHeader();
                if (!string.IsNullOrEmpty(cookieHeader)) req.Headers.Add("Cookie", cookieHeader);

                using var resp = await s_httpClient.SendAsync(req, ct).ConfigureAwait(false);
                var json = await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;
                if (!root.TryGetProperty("req_pl", out var plObj) ||
                    !plObj.TryGetProperty("data", out var dataObj))
                {
                    return new PlaylistSongsResult([], 0, false);
                }

                int total = 0;
                if (dataObj.TryGetProperty("total", out var totalProp) && totalProp.ValueKind == JsonValueKind.Number)
                {
                    total = totalProp.GetInt32();
                }
                else if (dataObj.TryGetProperty("total_song_num", out var tsnProp) && tsnProp.ValueKind == JsonValueKind.Number)
                {
                    total = tsnProp.GetInt32();
                }

                bool? serverHasMore = null;
                if (dataObj.TryGetProperty("hasmore", out var hmProp))
                {
                    if (hmProp.ValueKind == JsonValueKind.Number) serverHasMore = hmProp.GetInt32() != 0;
                    else if (hmProp.ValueKind == JsonValueKind.True) serverHasMore = true;
                    else if (hmProp.ValueKind == JsonValueKind.False) serverHasMore = false;
                }

                int rawCount = 0;
                var list = new List<Song>(size);
                if (dataObj.TryGetProperty("list", out var songArray) && songArray.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in songArray.EnumerateArray())
                    {
                        rawCount++;
                        var song = ParseSongFromElement(item);
                        if (song != null) list.Add(song);
                    }
                }

                // 是否还有下一页必须问服务端：无 mid 的占位条目会被 ParseSongFromElement 丢弃，
                // 按“本页是否满”判断会把中间的空洞页当成最后一页（1470 首曾停在第 9 页）。
                // 故优先用 total 推算，其次用服务端 hasmore，原始条数兜底。
                var hasMore = total > 0
                    ? offset + rawCount < total
                    : serverHasMore ?? rawCount >= size;

                return new PlaylistSongsResult(list, total, hasMore);
            }
            catch (Exception ex)
            {
                AppLogger.Error("MusicApi", $"GetPlaylistSongsAsync (dirId: {playlist.DirId}) error", ex);
                return new PlaylistSongsResult([], 0, false);
            }
        }
        else
        {
            var url = "https://u.y.qq.com/cgi-bin/musicu.fcg";
            var uin = UserSession.Current.IsLoggedIn ? UserSession.Current.Uin : "0";
            var payload = $"{{\"comm\":{{\"uin\":\"{uin}\",\"format\":\"json\",\"ct\":19,\"cv\":1,\"authst\":\"\"}}," +
                $"\"req_diss\":{{\"module\":\"music.srfDissInfo.aiDissInfo\",\"method\":\"uniform_get_Dissinfo\"," +
                $"\"param\":{{\"disstid\":{playlist.Tid},\"userinfo\":1,\"tag\":1}}}}}}";

            try
            {
                using var req = new HttpRequestMessage(HttpMethod.Post, url);
                req.Content = new StringContent(payload, Encoding.UTF8, "application/json");
                var cookieHeader = UserSession.Current.GetCookieHeader();
                if (!string.IsNullOrEmpty(cookieHeader)) req.Headers.Add("Cookie", cookieHeader);

                using var resp = await s_httpClient.SendAsync(req, ct).ConfigureAwait(false);
                var json = await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;
                if (root.TryGetProperty("req_diss", out var dissObj) &&
                    dissObj.TryGetProperty("data", out var dataObj) &&
                    dataObj.TryGetProperty("songlist", out var songArray) &&
                    songArray.ValueKind == JsonValueKind.Array)
                {
                    var list = new List<Song>(songArray.GetArrayLength());
                    foreach (var item in songArray.EnumerateArray())
                    {
                        var song = ParseSongFromElement(item);
                        if (song != null) list.Add(song);
                    }

                    int favTotal = list.Count;
                    if (dataObj.TryGetProperty("total_song_num", out var favTotalProp) && favTotalProp.ValueKind == JsonValueKind.Number)
                    {
                        favTotal = favTotalProp.GetInt32();
                    }

                    // 收藏歌单走 uniform_get_Dissinfo，一次返回全量，无需分页。
                    return new PlaylistSongsResult(list, favTotal, false);
                }
                return new PlaylistSongsResult([], 0, false);
            }
            catch (Exception ex)
            {
                AppLogger.Error("MusicApi", $"GetPlaylistSongsAsync (tid: {playlist.Tid}) error", ex);
                return new PlaylistSongsResult([], 0, false);
            }
        }
    }

    /// <summary>
    /// 添加歌曲到指定歌单（dirId: 201 即为“我喜欢”）
    /// </summary>
    public static async Task<bool> AddSongToPlaylistAsync(long dirId, long songId, CancellationToken ct = default)
    {
        return await AddSongToPlaylistInternalAsync(dirId, songId, canRetryWithRenew: true, ct).ConfigureAwait(false);
    }

    private static async Task<bool> AddSongToPlaylistInternalAsync(long dirId, long songId, bool canRetryWithRenew, CancellationToken ct)
    {
        if (!UserSession.Current.IsLoggedIn || songId <= 0) return false;

        await LoginService.EnsureMusicKeyAsync(false, ct).ConfigureAwait(false);

        if (dirId == 201)
        {
            return await AddSongToPlaylistAndroidAsync(dirId, songId, ct).ConfigureAwait(false);
        }

        var payload = $"{{\"comm\":{{\"ct\":24,\"cv\":0}}," +
            $"\"addSongsToPlayList\":{{\"module\":\"music.musicasset.PlaylistDetailWrite\",\"method\":\"AddSonglist\"," +
            $"\"param\":{{\"dirId\":{dirId},\"v_songInfo\":[{{\"songId\":{songId},\"songType\":0}}]}}}}}}";

        try
        {
            AppLogger.Info("MusicApi", $"AddSongToPlaylistAsync (AG-1) requesting: dirId={dirId}, songId={songId}");
            var json = await PostAg1Async(payload, ct).ConfigureAwait(false);
            AppLogger.Info("MusicApi", $"AddSongToPlaylistAsync (AG-1) response: {json}");

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            if (root.TryGetProperty("addSongsToPlayList", out var addObj))
            {
                int code = -1;
                if (addObj.TryGetProperty("code", out var codeProp) && codeProp.ValueKind == JsonValueKind.Number)
                {
                    code = codeProp.GetInt32();
                }
                else if (addObj.TryGetProperty("subcode", out var subProp) && subProp.ValueKind == JsonValueKind.Number)
                {
                    code = subProp.GetInt32();
                }

                if (code == 0)
                {
                    if (addObj.TryGetProperty("data", out var dataObj))
                    {
                        if (dataObj.TryGetProperty("succ_song_num", out var succProp) && succProp.GetInt32() == 0 &&
                            dataObj.TryGetProperty("fail_song_num", out var failProp) && failProp.GetInt32() > 0)
                        {
                            AppLogger.Warn("MusicApi", $"AddSongToPlaylistAsync: succ_song_num is 0 and fail_song_num is {failProp.GetInt32()}");
                            return false;
                        }
                    }
                    return true;
                }

                if ((code == 1000 || code == 10000) && canRetryWithRenew)
                {
                    AppLogger.Info("MusicApi", $"AddSongToPlaylistAsync returned auth error {code}, attempting credential renewal...");
                    var renewed = await LoginService.EnsureMusicKeyAsync(forceRefresh: true, ct).ConfigureAwait(false);
                    if (renewed)
                    {
                        return await AddSongToPlaylistInternalAsync(dirId, songId, canRetryWithRenew: false, ct).ConfigureAwait(false);
                    }
                }

                AppLogger.Warn("MusicApi", $"AddSongToPlaylistAsync (AG-1) returned non-zero code: {code}");
            }
            return false;
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", $"AddSongToPlaylistAsync (AG-1) exception for dirId={dirId}, songId={songId}", ex);
            return false;
        }
    }

    /// <summary>
    /// 从指定歌单中移除歌曲（dirId: 201 即为“我喜欢”）
    /// </summary>
    public static async Task<bool> RemoveSongFromPlaylistAsync(long dirId, long songId, CancellationToken ct = default)
    {
        return await RemoveSongFromPlaylistInternalAsync(dirId, songId, canRetryWithRenew: true, ct).ConfigureAwait(false);
    }

    private static async Task<bool> RemoveSongFromPlaylistInternalAsync(long dirId, long songId, bool canRetryWithRenew, CancellationToken ct)
    {
        if (!UserSession.Current.IsLoggedIn || songId <= 0) return false;

        await LoginService.EnsureMusicKeyAsync(false, ct).ConfigureAwait(false);

        if (dirId == 201)
        {
            return await RemoveSongFromPlaylistAndroidAsync(dirId, songId, ct).ConfigureAwait(false);
        }

        var payload = $"{{\"comm\":{{\"ct\":24,\"cv\":0}}," +
            $"\"delSongsFromPlayList\":{{\"module\":\"music.musicasset.PlaylistDetailWrite\",\"method\":\"DelSonglist\"," +
            $"\"param\":{{\"dirId\":{dirId},\"v_songInfo\":[{{\"songId\":{songId},\"songType\":0}}]}}}}}}";

        try
        {
            AppLogger.Info("MusicApi", $"RemoveSongFromPlaylistAsync (AG-1) requesting: dirId={dirId}, songId={songId}");
            var json = await PostAg1Async(payload, ct).ConfigureAwait(false);
            AppLogger.Info("MusicApi", $"RemoveSongFromPlaylistAsync (AG-1) response: {json}");

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            if (root.TryGetProperty("delSongsFromPlayList", out var delObj))
            {
                int code = -1;
                if (delObj.TryGetProperty("code", out var codeProp) && codeProp.ValueKind == JsonValueKind.Number)
                {
                    code = codeProp.GetInt32();
                }
                else if (delObj.TryGetProperty("subcode", out var subProp) && subProp.ValueKind == JsonValueKind.Number)
                {
                    code = subProp.GetInt32();
                }

                if (code == 0)
                {
                    return true;
                }

                if ((code == 1000 || code == 10000) && canRetryWithRenew)
                {
                    AppLogger.Info("MusicApi", $"RemoveSongFromPlaylistAsync returned auth error {code}, attempting credential renewal...");
                    var renewed = await LoginService.EnsureMusicKeyAsync(forceRefresh: true, ct).ConfigureAwait(false);
                    if (renewed)
                    {
                        return await RemoveSongFromPlaylistInternalAsync(dirId, songId, canRetryWithRenew: false, ct).ConfigureAwait(false);
                    }
                }

                AppLogger.Warn("MusicApi", $"RemoveSongFromPlaylistAsync (AG-1) returned non-zero code: {code}");
            }
            return false;
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", $"RemoveSongFromPlaylistAsync (AG-1) exception for dirId={dirId}, songId={songId}", ex);
            return false;
        }
    }

    /// <summary>
    /// 通过 Android App 协议（musics.fcg + zzc 签名）添加歌曲到歌单。
    /// 微信登录态下 AG-1 协议对“我喜欢”（dirId=201）返回 80105，需改用此协议。
    /// </summary>
    private static async Task<bool> AddSongToPlaylistAndroidAsync(long dirId, long songId, CancellationToken ct)
    {
        var json = BuildAndroidPlaylistWritePayload("AddSonglist", dirId, songId);

        try
        {
            AppLogger.Info("MusicApi", $"AddSongToPlaylistAsync (Android) requesting: dirId={dirId}, songId={songId}");
            var respJson = await PostAndroidAsync(json, ct).ConfigureAwait(false);
            AppLogger.Info("MusicApi", $"AddSongToPlaylistAsync (Android) response: {respJson}");

            using var doc = JsonDocument.Parse(respJson);
            var root = doc.RootElement;
            if (root.TryGetProperty("req_0", out var req0))
            {
                int code = -1;
                if (req0.TryGetProperty("code", out var codeProp) && codeProp.ValueKind == JsonValueKind.Number)
                {
                    code = codeProp.GetInt32();
                }

                if (code == 0)
                {
                    return true;
                }
                AppLogger.Warn("MusicApi", $"AddSongToPlaylistAsync (Android) returned non-zero code: {code}");
            }
            return false;
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", $"AddSongToPlaylistAsync (Android) exception for dirId={dirId}, songId={songId}", ex);
            return false;
        }
    }

    /// <summary>
    /// 通过 Android App 协议（musics.fcg + zzc 签名）从歌单移除歌曲。
    /// </summary>
    private static async Task<bool> RemoveSongFromPlaylistAndroidAsync(long dirId, long songId, CancellationToken ct)
    {
        var json = BuildAndroidPlaylistWritePayload("DelSonglist", dirId, songId);

        try
        {
            AppLogger.Info("MusicApi", $"RemoveSongFromPlaylistAsync (Android) requesting: dirId={dirId}, songId={songId}");
            var respJson = await PostAndroidAsync(json, ct).ConfigureAwait(false);
            AppLogger.Info("MusicApi", $"RemoveSongFromPlaylistAsync (Android) response: {respJson}");

            using var doc = JsonDocument.Parse(respJson);
            var root = doc.RootElement;
            if (root.TryGetProperty("req_0", out var req0))
            {
                int code = -1;
                if (req0.TryGetProperty("code", out var codeProp) && codeProp.ValueKind == JsonValueKind.Number)
                {
                    code = codeProp.GetInt32();
                }

                if (code == 0)
                {
                    return true;
                }
                AppLogger.Warn("MusicApi", $"RemoveSongFromPlaylistAsync (Android) returned non-zero code: {code}");
            }
            return false;
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", $"RemoveSongFromPlaylistAsync (Android) exception for dirId={dirId}, songId={songId}", ex);
            return false;
        }
    }

    /// <summary>
    /// 构建 Android App 协议的歌单写操作负载（comm + req_0），签名与发送使用同一字节序列。
    /// </summary>
    private static string BuildAndroidPlaylistWritePayload(string method, long dirId, long songId)
    {
        var uin = UserSession.Current.Uin;
        var musicKey = UserSession.Current.MusicKey;
        int tmeLoginType = musicKey.StartsWith("W_X", StringComparison.Ordinal) ? 1 : 2;

        // 手动拼接避免 NativeAOT 下 JsonSerializer 的运行时反射；music_key/uin 均为安全字符集，无需转义。
        return $"{{\"comm\":{{\"ct\":11,\"cv\":14090008,\"v\":14090008,\"chid\":\"10003505\",\"qq\":\"{uin}\",\"authst\":\"{musicKey}\",\"tmeAppID\":\"qqmusic\",\"tmeLoginType\":{tmeLoginType}}}," +
            $"\"req_0\":{{\"module\":\"music.musicasset.PlaylistDetailWrite\",\"method\":\"{method}\"," +
            $"\"param\":{{\"dirId\":{dirId},\"tid\":0,\"bFmtUtf8\":true,\"v_songInfo\":[{{\"songId\":{songId},\"songType\":0}}]}}}}}}";
    }

    /// <summary>
    /// 添加歌曲到指定歌单（Playlist 模型重载）
    /// </summary>
    public static async Task<bool> AddSongToPlaylistAsync(Playlist playlist, Song song, CancellationToken ct = default)
    {
        long songId = song.Id;
        if (songId <= 0 && !string.IsNullOrEmpty(song.Mid))
        {
            songId = await ResolveSongIdAsync(song.Mid, ct).ConfigureAwait(false);
            if (songId > 0) song.Id = songId;
        }
        if (songId <= 0) return false;

        return await AddSongToPlaylistAsync(playlist.DirId, songId, ct).ConfigureAwait(false);
    }

    /// <summary>
    /// 从指定歌单中移除歌曲（Playlist 模型重载）
    /// </summary>
    public static async Task<bool> RemoveSongFromPlaylistAsync(Playlist playlist, Song song, CancellationToken ct = default)
    {
        long songId = song.Id;
        if (songId <= 0 && !string.IsNullOrEmpty(song.Mid))
        {
            songId = await ResolveSongIdAsync(song.Mid, ct).ConfigureAwait(false);
            if (songId > 0) song.Id = songId;
        }
        if (songId <= 0) return false;

        return await RemoveSongFromPlaylistAsync(playlist.DirId, songId, ct).ConfigureAwait(false);
    }

    /// <summary>
    /// 添加歌曲到“我喜欢”
    /// </summary>
    public static async Task<bool> AddSongToFavoriteAsync(Song song, CancellationToken ct = default)
    {
        long songId = song.Id;
        if (songId <= 0 && !string.IsNullOrEmpty(song.Mid))
        {
            songId = await ResolveSongIdAsync(song.Mid, ct).ConfigureAwait(false);
            if (songId > 0) song.Id = songId;
        }
        if (songId <= 0)
        {
            AppLogger.Warn("MusicApi", $"AddSongToFavoriteAsync: Unable to resolve songId for mid={song.Mid}, title={song.Title}");
            return false;
        }

        var ok = await AddSongToPlaylistAsync(201, songId, ct).ConfigureAwait(false);
        AppLogger.Info("MusicApi", $"AddSongToFavoriteAsync: mid={song.Mid}, songId={songId}, title={song.Title}, result={ok}");
        return ok;
    }

    /// <summary>
    /// 从“我喜欢”中移除歌曲
    /// </summary>
    public static async Task<bool> RemoveSongFromFavoriteAsync(Song song, CancellationToken ct = default)
    {
        long songId = song.Id;
        if (songId <= 0 && !string.IsNullOrEmpty(song.Mid))
        {
            songId = await ResolveSongIdAsync(song.Mid, ct).ConfigureAwait(false);
            if (songId > 0) song.Id = songId;
        }
        if (songId <= 0)
        {
            AppLogger.Warn("MusicApi", $"RemoveSongFromFavoriteAsync: Unable to resolve songId for mid={song.Mid}, title={song.Title}");
            return false;
        }

        var ok = await RemoveSongFromPlaylistAsync(201, songId, ct).ConfigureAwait(false);
        AppLogger.Info("MusicApi", $"RemoveSongFromFavoriteAsync: mid={song.Mid}, songId={songId}, title={song.Title}, result={ok}");
        return ok;
    }

    private static int GetCurrentGtk()
    {
        var cookies = UserSession.Current.Cookies;
        if (cookies.TryGetValue("p_skey", out var pskey) && !string.IsNullOrEmpty(pskey))
        {
            return LoginService.GetACSRFToken(pskey);
        }
        if (cookies.TryGetValue("skey", out var skey) && !string.IsNullOrEmpty(skey))
        {
            return LoginService.GetACSRFToken(skey);
        }
        if (cookies.TryGetValue("qm_keyst", out var qmk) && !string.IsNullOrEmpty(qmk))
        {
            return LoginService.GetACSRFToken(qmk);
        }
        if (cookies.TryGetValue("qqmusic_key", out var qk) && !string.IsNullOrEmpty(qk))
        {
            return LoginService.GetACSRFToken(qk);
        }
        return 5381;
    }

    /// <summary>
    /// 创建自建歌单
    /// </summary>
    public static async Task<(bool Success, long DissId, string Message)> CreatePlaylistAsync(string name, CancellationToken ct = default)
    {
        if (!UserSession.Current.IsLoggedIn || string.IsNullOrWhiteSpace(name))
        {
            return (false, 0, "用户未登录或歌单名称为空");
        }

        await LoginService.EnsureMusicKeyAsync(ct).ConfigureAwait(false);

        var escapedName = JsonEncodedText.Encode(name.Trim()).ToString();
        var payload = $$"""
        {
          "comm": { "ct": 24, "cv": 0 },
          "createNewPlayList": {
            "module": "music.musicasset.PlaylistBaseWrite",
            "method": "AddPlaylist",
            "param": {
              "dirName": "{{escapedName}}",
              "dirShow": 1,
              "dirDesc": "",
              "dirPicUrl": "",
              "taglist": ""
            }
          }
        }
        """;

        try
        {
            AppLogger.Info("MusicApi", $"CreatePlaylistAsync requesting: name={name}");
            var json = await PostAg1Async(payload, ct).ConfigureAwait(false);
            AppLogger.Info("MusicApi", $"CreatePlaylistAsync response: {json}");

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            if (root.TryGetProperty("createNewPlayList", out var addObj))
            {
                int code = -1;
                if (addObj.TryGetProperty("code", out var codeProp) && codeProp.ValueKind == JsonValueKind.Number)
                {
                    code = codeProp.GetInt32();
                }

                if (code == 0)
                {
                    long dissId = 0;
                    if (addObj.TryGetProperty("data", out var dataObj) &&
                        dataObj.TryGetProperty("result", out var resObj))
                    {
                        if (resObj.TryGetProperty("dirId", out var dProp) && dProp.ValueKind == JsonValueKind.Number)
                        {
                            dissId = dProp.GetInt64();
                        }
                        else if (resObj.TryGetProperty("tid", out var tProp) && tProp.ValueKind == JsonValueKind.Number)
                        {
                            dissId = tProp.GetInt64();
                        }
                    }
                    return (true, dissId, "创建成功");
                }

                string msg = "";
                if (addObj.TryGetProperty("data", out var dObj) && dObj.TryGetProperty("msg", out var mProp))
                {
                    msg = mProp.GetString() ?? "";
                }
                return (false, 0, string.IsNullOrEmpty(msg) ? $"创建失败 (code={code})" : msg);
            }

            return (false, 0, "创建歌单无响应");
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", $"CreatePlaylistAsync exception for name={name}", ex);
            return (false, 0, ex.Message);
        }
    }

    /// <summary>
    /// 查询当前用户是否收藏指定公开歌单（music.musicasset.PlaylistFavRead/IsPlaylistFan）。
    /// 该接口非加密 CGI，走明文 musicu.fcg + Cookie 鉴权。
    /// </summary>
    public static async Task<(bool Success, bool IsFavorite)> GetPlaylistFavoriteStateAsync(long tid, CancellationToken ct = default)
    {
        if (!UserSession.Current.IsLoggedIn || tid <= 0) return (false, false);

        await LoginService.EnsureMusicKeyAsync(ct).ConfigureAwait(false);
        var payload = $$"""
        {
          "comm": { "ct": 20, "cv": 1770, "tmeAppID": "qqmusic" },
          "checkPlaylistIsCollect": {
            "module": "music.musicasset.PlaylistFavRead",
            "method": "IsPlaylistFan",
            "param": { "v_tid": [{{tid}}] }
          }
        }
        """;

        try
        {
            using var req = new HttpRequestMessage(HttpMethod.Post, "https://u.y.qq.com/cgi-bin/musicu.fcg");
            req.Content = new StringContent(payload, Encoding.UTF8, "application/json");
            var cookieHeader = UserSession.Current.GetCookieHeader();
            if (!string.IsNullOrEmpty(cookieHeader)) req.Headers.TryAddWithoutValidation("Cookie", cookieHeader);

            using var resp = await s_httpClient.SendAsync(req, ct).ConfigureAwait(false);
            var json = await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
            using var doc = JsonDocument.Parse(json);
            if (!doc.RootElement.TryGetProperty("checkPlaylistIsCollect", out var response) ||
                !response.TryGetProperty("code", out var codeProp) || codeProp.ValueKind != JsonValueKind.Number || codeProp.GetInt32() != 0 ||
                !response.TryGetProperty("data", out var data) ||
                !data.TryGetProperty("m_fan", out var fans) || fans.ValueKind != JsonValueKind.Object)
            {
                AppLogger.Warn("MusicApi", $"GetPlaylistFavoriteStateAsync unexpected response for tid={tid}: {json}");
                return (false, false);
            }

            if (!fans.TryGetProperty(tid.ToString(System.Globalization.CultureInfo.InvariantCulture), out var isFavorite))
            {
                return (true, false);
            }
            return (true, isFavorite.ValueKind == JsonValueKind.True ||
                          (isFavorite.ValueKind == JsonValueKind.Number && isFavorite.GetInt32() != 0));
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", $"GetPlaylistFavoriteStateAsync exception for tid={tid}", ex);
            return (false, false);
        }
    }

    /// <summary>
    /// 收藏或取消收藏公开歌单（music.musicasset.PlaylistFavWrite/FavPlaylist|CancelFavPlaylist）。
    /// 属加密 CGI，走 musics.fcg + zzc 签名，鉴权靠 Cookie。
    /// </summary>
    public static async Task<bool> SetPlaylistFavoriteAsync(long tid, bool favorite, CancellationToken ct = default)
    {
        if (!UserSession.Current.IsLoggedIn || tid <= 0) return false;

        await LoginService.EnsureMusicKeyAsync(ct).ConfigureAwait(false);

        // WEB 网关（u6.y.qq.com）对微信登录账号会拒绝歌单收藏写入，
        // 与歌曲收藏同一根因，所以先走 Android App 协议（musics.fcg + zzc 签名）。
        if (await SetPlaylistFavoriteAndroidAsync(tid, favorite, ct).ConfigureAwait(false))
        {
            return true;
        }

        var uin = UserSession.Current.Uin;
        var method = favorite ? "FavPlaylist" : "CancelFavPlaylist";
        // 请求键必须是 updatePlayListFavStatus（与前端 updatePlayListFavStatus 一致）：
        // 用它返回 {code:0, data:{result:0, v_failedPlaylistId:[]}}，换成
        // addFavPlayList/deleteFavPlayList 当键会被网关判为未知请求（code 2000）。
        var payload = $$"""
        {
          "comm": { "uin": "{{uin}}" },
          "updatePlayListFavStatus": {
            "module": "music.musicasset.PlaylistFavWrite",
            "method": "{{method}}",
            "param": { "uin": "{{uin}}", "v_playlistId": [{{tid}}] }
          }
        }
        """;

        try
        {
            AppLogger.Info("MusicApi", $"SetPlaylistFavoriteAsync requesting: tid={tid}, favorite={favorite}");
            var json = await PostWebGatewayAsync(payload, ct).ConfigureAwait(false);
            AppLogger.Info("MusicApi", $"SetPlaylistFavoriteAsync response: {json}");

            using var doc = JsonDocument.Parse(json);
            if (!doc.RootElement.TryGetProperty("updatePlayListFavStatus", out var response) ||
                !response.TryGetProperty("code", out var codeProp) ||
                codeProp.ValueKind != JsonValueKind.Number || codeProp.GetInt32() != 0 ||
                !response.TryGetProperty("data", out var data))
            {
                return false;
            }

            // data.result 非 0 或该 tid 落入 v_failedPlaylistId 均视为失败。
            if (data.TryGetProperty("result", out var resultProp) &&
                resultProp.ValueKind == JsonValueKind.Number && resultProp.GetInt32() != 0)
            {
                return false;
            }
            if (data.TryGetProperty("v_failedPlaylistId", out var failed) && failed.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in failed.EnumerateArray())
                {
                    if (item.ValueKind == JsonValueKind.Number && item.GetInt64() == tid) return false;
                    if (item.ValueKind == JsonValueKind.String && item.GetString() == tid.ToString(System.Globalization.CultureInfo.InvariantCulture)) return false;
                }
            }
            return true;
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", $"SetPlaylistFavoriteAsync exception for tid={tid}, favorite={favorite}", ex);
            return false;
        }
    }

    /// <summary>
    /// 通过 Android App 协议（musics.fcg + zzc 签名）收藏/取消收藏歌单。
    /// </summary>
    private static async Task<bool> SetPlaylistFavoriteAndroidAsync(long tid, bool favorite, CancellationToken ct)
    {
        var uin = UserSession.Current.Uin;
        var musicKey = UserSession.Current.MusicKey;
        int tmeLoginType = musicKey.StartsWith("W_X", StringComparison.Ordinal) ? 1 : 2;
        var method = favorite ? "FavPlaylist" : "CancelFavPlaylist";

        // 手动拼接避免 NativeAOT 下的运行时反射；music_key/uin 均为安全字符集，无需转义。
        var payload = $"{{\"comm\":{{\"ct\":11,\"cv\":14090008,\"v\":14090008,\"chid\":\"10003505\",\"qq\":\"{uin}\",\"authst\":\"{musicKey}\",\"tmeAppID\":\"qqmusic\",\"tmeLoginType\":{tmeLoginType}}}," +
            $"\"req_0\":{{\"module\":\"music.musicasset.PlaylistFavWrite\",\"method\":\"{method}\"," +
            $"\"param\":{{\"uin\":\"{uin}\",\"v_playlistId\":[{tid}]}}}}}}";

        try
        {
            AppLogger.Info("MusicApi", $"SetPlaylistFavoriteAsync (Android) requesting: tid={tid}, favorite={favorite}");
            var respJson = await PostAndroidAsync(payload, ct).ConfigureAwait(false);
            AppLogger.Info("MusicApi", $"SetPlaylistFavoriteAsync (Android) response: {respJson}");

            using var doc = JsonDocument.Parse(respJson);
            if (!doc.RootElement.TryGetProperty("req_0", out var req0)) return false;
            if (!req0.TryGetProperty("code", out var codeProp) ||
                codeProp.ValueKind != JsonValueKind.Number ||
                codeProp.GetInt32() != 0)
            {
                return false;
            }

            if (req0.TryGetProperty("data", out var data))
            {
                if (data.TryGetProperty("result", out var resultProp) &&
                    resultProp.ValueKind == JsonValueKind.Number && resultProp.GetInt32() != 0)
                {
                    return false;
                }
                if (data.TryGetProperty("v_failedPlaylistId", out var failed) && failed.ValueKind == JsonValueKind.Array)
                {
                    foreach (var item in failed.EnumerateArray())
                    {
                        if (item.ValueKind == JsonValueKind.Number && item.GetInt64() == tid) return false;
                        if (item.ValueKind == JsonValueKind.String &&
                            item.GetString() == tid.ToString(System.Globalization.CultureInfo.InvariantCulture)) return false;
                    }
                }
            }
            return true;
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", $"SetPlaylistFavoriteAsync (Android) exception for tid={tid}, favorite={favorite}", ex);
            return false;
        }
    }

    /// <summary>
    /// 删除歌单（自建歌单调用 DelPlaylist，收藏歌单调用 CancelFavPlaylist）
    /// </summary>
    public static async Task<bool> DeletePlaylistAsync(Playlist playlist, CancellationToken ct = default)
    {
        if (!UserSession.Current.IsLoggedIn || playlist.IsMyFavorite)
        {
            return false;
        }

        await LoginService.EnsureMusicKeyAsync(ct).ConfigureAwait(false);

        try
        {
            if (!playlist.IsFav)
            {
                // 自建歌单删除 (music.musicasset.PlaylistBaseWrite/DelPlaylist)
                long dirId = playlist.DirId;
                var payload = $$"""
                {
                  "comm": { "ct": 24, "cv": 0 },
                  "deletePlayList": {
                    "module": "music.musicasset.PlaylistBaseWrite",
                    "method": "DelPlaylist",
                    "param": {
                      "dirId": {{dirId}}
                    }
                  }
                }
                """;

                AppLogger.Info("MusicApi", $"DeletePlaylistAsync (created) requesting: dirId={dirId}");
                var json = await PostAg1Async(payload, ct).ConfigureAwait(false);
                AppLogger.Info("MusicApi", $"DeletePlaylistAsync (created) response: {json}");

                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("deletePlayList", out var delObj) &&
                    delObj.TryGetProperty("code", out var codeProp) && codeProp.ValueKind == JsonValueKind.Number)
                {
                    return codeProp.GetInt32() == 0;
                }
                return false;
            }
            else
            {
                // 收藏外部歌单：取消收藏 (music.musicasset.PlaylistFavWrite/CancelFavPlaylist)
                long dissId = playlist.Tid > 0 ? playlist.Tid : playlist.DirId;
                var payload = $$"""
                {
                  "comm": { "ct": 24, "cv": 0 },
                  "deleteFavPlayList": {
                    "module": "music.musicasset.PlaylistFavWrite",
                    "method": "CancelFavPlaylist",
                    "param": {
                      "dirId": {{dissId}}
                    }
                  }
                }
                """;

                AppLogger.Info("MusicApi", $"DeletePlaylistAsync (fav) requesting: dissId={dissId}");
                var json = await PostAg1Async(payload, ct).ConfigureAwait(false);
                AppLogger.Info("MusicApi", $"DeletePlaylistAsync (fav) response: {json}");

                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("deleteFavPlayList", out var favObj) &&
                    favObj.TryGetProperty("code", out var codeProp) && codeProp.ValueKind == JsonValueKind.Number)
                {
                    return codeProp.GetInt32() == 0;
                }
                return false;
            }
        }
        catch (Exception ex)
        {
            AppLogger.Error("MusicApi", $"DeletePlaylistAsync exception for playlist {playlist.Title}", ex);
            return false;
        }
    }
}
