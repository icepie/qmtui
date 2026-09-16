using System.Text.Json;
using QmTui.Models;
using QmTui.Utils;

namespace QmTui.Api;

/// <summary>
/// 带分页信息的搜索结果（total = 服务端估算总数，HasMore = 是否还有下一页）
/// </summary>
public sealed record SearchPage<T>(List<T> Items, int Total, bool HasMore);

public sealed partial class MusicApi
{
    public static async Task<SearchPage<Playlist>> SearchPlaylistsAsync(
        string query,
        int page = 1,
        int pageSize = 25,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(query)) return new SearchPage<Playlist>([], 0, false);

        try
        {
            return await SearchDesktopAsync(query, searchType: 3, page, pageSize, static data =>
            {
                var playlists = new List<Playlist>();
                foreach (var item in EnumerateDesktopSearchList(data, "songlist"))
                {
                    long tid = ReadLong(item, "dissid", "tid", "id");
                    string name = ReadText(item, "dissname", "title", "name");
                    if (tid <= 0 || string.IsNullOrWhiteSpace(name)) continue;

                    int songCount = (int)ReadLong(item, "song_count", "songnum", "songNum");
                    string cover = ReadText(item, "imgurl", "picurl", "logo");
                    playlists.Add(new Playlist(0, StripSearchMarkup(name), songCount, tid, IsFav: true, cover));
                }
                return playlists;
            }, ct).ConfigureAwait(false);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            AppLogger.Error("Search", $"SearchPlaylistsAsync failed for query '{query}'", ex);
            return new SearchPage<Playlist>([], 0, false);
        }
    }

    public static async Task<SearchPage<Album>> SearchAlbumsAsync(
        string query,
        int page = 1,
        int pageSize = 25,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(query)) return new SearchPage<Album>([], 0, false);

        try
        {
            return await SearchDesktopAsync(query, searchType: 2, page, pageSize, static data =>
            {
                var albums = new List<Album>();
                foreach (var item in EnumerateDesktopSearchList(data, "album"))
                {
                    string mid = ReadText(item, "albumMID", "albumMid", "albummid", "mid");
                    string name = ReadText(item, "albumName", "albumname", "title", "name");
                    if (string.IsNullOrWhiteSpace(mid) || string.IsNullOrWhiteSpace(name)) continue;

                    long id = ReadLong(item, "albumID", "albumid", "id");
                    string artist = ReadAlbumArtists(item);
                    string cover = ReadText(item, "albumPic", "pic", "picurl", "picUrl", "logo");
                    long pubTime = ReadPubTime(item);
                    int songCount = (int)ReadLong(item, "song_count", "songnum", "songNum");
                    albums.Add(new Album(id, mid, StripSearchMarkup(name), artist, songCount, cover, pubTime));
                }
                return albums;
            }, ct).ConfigureAwait(false);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            AppLogger.Error("Search", $"SearchAlbumsAsync failed for query '{query}'", ex);
            return new SearchPage<Album>([], 0, false);
        }
    }

    /// <summary>
    /// 桌面端搜索接口（DoSearchForQQMusicDesktop），与歌曲搜索 SearchAsync 及旧项目 SearchDesktopAsync 保持一致。
    /// searchType: 0=歌曲 1=歌手 2=专辑 3=歌单 7=歌词。返回的 data.body.&lt;bucket&gt;.list 由 parser 解析，
    /// 分页信息取自 data.meta.sum/estimate_sum 与 nextpage。
    /// </summary>
    private static async Task<SearchPage<T>> SearchDesktopAsync<T>(
        string query,
        int searchType,
        int page,
        int pageSize,
        Func<JsonElement, List<T>> parser,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(query)) return new SearchPage<T>([], 0, false);

        int normalizedPage = Math.Max(1, page);
        int normalizedSize = Math.Clamp(pageSize, 1, 100);
        var escapedQuery = JsonEncodedText.Encode(query.Trim()).ToString();
        var payload = $$"""
        {
          "music.search.SearchCgiService": {
            "module": "music.search.SearchCgiService",
            "method": "DoSearchForQQMusicDesktop",
            "param": {
              "query": "{{escapedQuery}}",
              "page_num": {{normalizedPage}},
              "num_per_page": {{normalizedSize}},
              "search_type": {{searchType}}
            }
          }
        }
        """;

        string json = await PostAg1Async(payload, ct).ConfigureAwait(false);
        using var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("music.search.SearchCgiService", out var service) ||
            !service.TryGetProperty("data", out var data))
        {
            return new SearchPage<T>([], 0, false);
        }

        var items = parser(data);
        int total = 0;
        int nextPage = -1;
        if (data.TryGetProperty("meta", out var meta) && meta.ValueKind == JsonValueKind.Object)
        {
            total = (int)ReadLong(meta, "sum", "estimate_sum");
            nextPage = (int)ReadLong(meta, "nextpage");
        }
        if (total <= 0) total = items.Count;

        bool hasMore = nextPage > normalizedPage || normalizedPage * normalizedSize < total;
        return new SearchPage<T>(items, total, hasMore);
    }

    private static JsonElement[] EnumerateDesktopSearchList(JsonElement data, string bucketName)
    {
        if (!data.TryGetProperty("body", out var body) || body.ValueKind != JsonValueKind.Object ||
            !body.TryGetProperty(bucketName, out var bucket) || bucket.ValueKind != JsonValueKind.Object ||
            !bucket.TryGetProperty("list", out var list) || list.ValueKind != JsonValueKind.Array)
        {
            return [];
        }
        return list.EnumerateArray().ToArray();
    }

    private static string ReadAlbumArtists(JsonElement item)
    {
        var names = new List<string>();
        if (item.TryGetProperty("singer_list", out var singers) && singers.ValueKind == JsonValueKind.Array)
        {
            foreach (var singer in singers.EnumerateArray())
            {
                var name = ReadText(singer, "name", "title", "singerName");
                if (!string.IsNullOrWhiteSpace(name)) names.Add(StripSearchMarkup(name));
            }
        }
        if (names.Count > 0) return string.Join("/", names);

        var artist = ReadText(item, "singer", "singerName", "artist", "artistName");
        return string.IsNullOrWhiteSpace(artist) ? "未知歌手" : StripSearchMarkup(artist);
    }

    private static long ReadPubTime(JsonElement item)
    {
        if (item.TryGetProperty("publicTime", out var value) && value.ValueKind == JsonValueKind.String)
        {
            if (DateTimeOffset.TryParse(value.GetString(), out var date)) return date.ToUnixTimeSeconds();
        }
        return ReadLong(item, "pubtime", "publish_time", "time_public");
    }

    private static string ReadText(JsonElement item, params string[] names)
    {
        foreach (var name in names)
        {
            if (!item.TryGetProperty(name, out var value)) continue;
            if (value.ValueKind == JsonValueKind.String) return value.GetString() ?? "";
            if (value.ValueKind == JsonValueKind.Number) return value.GetRawText();
        }
        return "";
    }

    private static long ReadLong(JsonElement item, params string[] names)
    {
        foreach (var name in names)
        {
            if (!item.TryGetProperty(name, out var value)) continue;
            if (value.ValueKind == JsonValueKind.Number && value.TryGetInt64(out var number)) return number;
            if (value.ValueKind == JsonValueKind.String && long.TryParse(value.GetString(), out number)) return number;
        }
        return 0;
    }

    private static string StripSearchMarkup(string value)
    {
        if (string.IsNullOrEmpty(value) || !value.Contains('<')) return value;
        var result = new System.Text.StringBuilder(value.Length);
        bool insideTag = false;
        foreach (char ch in value)
        {
            if (ch == '<') insideTag = true;
            else if (ch == '>') insideTag = false;
            else if (!insideTag) result.Append(ch);
        }
        return System.Net.WebUtility.HtmlDecode(result.ToString());
    }
}
