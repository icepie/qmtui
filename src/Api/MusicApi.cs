using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using QmTui.Models;
using QmTui.Utils;

namespace QmTui.Api;

public sealed partial class MusicApi
{
    private static readonly HttpClient s_httpClient = new(new SocketsHttpHandler
    {
        PooledConnectionLifetime = TimeSpan.FromMinutes(10),
        AutomaticDecompression = System.Net.DecompressionMethods.All
    })
    {
        Timeout = TimeSpan.FromSeconds(8)
    };

    private static readonly byte[] s_ag1RequestKey = [189, 48, 95, 16, 208, 255, 116, 182, 239, 84, 218, 184, 53, 181, 225, 207];
    private static readonly byte[] s_ag1ResponseKey = [122, 63, 140, 29, 94, 155, 47, 10, 108, 77, 126, 139, 31, 58, 92, 157, 14, 43, 111, 74, 129];
    private static readonly int[] s_part1Indexes = [23, 14, 6, 36, 16, 40, 7, 19];
    private static readonly int[] s_androidPart1Indexes = [23, 14, 6, 36, 16, 7, 19];
    private static readonly int[] s_part2Indexes = [16, 1, 32, 12, 19, 27, 8, 5];
    private static readonly byte[] s_scrambleValues = [89, 39, 179, 150, 218, 82, 58, 252, 177, 52, 186, 123, 120, 64, 242, 133, 143, 161, 121, 179];

    static MusicApi()
    {
        s_httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        s_httpClient.DefaultRequestHeaders.Referrer = new Uri("https://y.qq.com/");
    }

    /// <summary>
    /// 把网页 bundle 的原始请求转发到 QQ 网关（附带当前会话的 Cookie 鉴权），返回上游原始 JSON。
    /// 供 /api/browser/ufetch 使用：原生页面靠它拿到真实数据。
    /// </summary>
    public static async Task<string?> ForwardToQqAsync(string url, bool useGet, string? body, CancellationToken ct = default)
    {
        try
        {
            using var req = new HttpRequestMessage(useGet ? HttpMethod.Get : HttpMethod.Post, url);
            var cookieHeader = UserSession.Current.GetCookieHeader();
            if (!string.IsNullOrEmpty(cookieHeader))
            {
                req.Headers.TryAddWithoutValidation("Cookie", cookieHeader);
            }
            req.Headers.TryAddWithoutValidation("Origin", "https://y.qq.com");

            if (!useGet && !string.IsNullOrWhiteSpace(body))
            {
                req.Content = new StringContent(body, Encoding.UTF8, "application/json");
            }

            using var resp = await s_httpClient.SendAsync(req, ct).ConfigureAwait(false);
            if (!resp.IsSuccessStatusCode)
            {
                AppLogger.Warn("MusicApi", $"ForwardToQqAsync 上游返回 {(int)resp.StatusCode}: {url}");
                return null;
            }

            return await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            AppLogger.Warn("MusicApi", $"ForwardToQqAsync 失败 {url}: {ex.Message}");
            return null;
        }
    }

    /// <summary>
    /// 计算现代网关 zzc 签名
    /// </summary>
    public static string ComputeZzcSign(string text) => ComputeZzcSign(text, s_part1Indexes);

    /// <summary>
    /// 计算 Android App 网关（musics.fcg）的 zzc 签名（Part1 索引与 AG-1 不同）
    /// </summary>
    public static string ComputeAndroidSign(string text) => ComputeZzcSign(text, s_androidPart1Indexes);

    private static string ComputeZzcSign(string text, int[] part1Indexes)
    {
        var hashBytes = SHA1.HashData(Encoding.UTF8.GetBytes(text));
        var hex = Convert.ToHexString(hashBytes);

        var p1 = new char[part1Indexes.Length];
        for (int i = 0; i < part1Indexes.Length; i++)
        {
            int idx = part1Indexes[i];
            p1[i] = idx < hex.Length ? hex[idx] : '0';
        }

        var p2 = new char[s_part2Indexes.Length];
        for (int i = 0; i < s_part2Indexes.Length; i++)
        {
            int idx = s_part2Indexes[i];
            p2[i] = idx < hex.Length ? hex[idx] : '0';
        }

        var part3 = new byte[s_scrambleValues.Length];
        for (int i = 0; i < s_scrambleValues.Length; i++)
        {
            byte b = (i * 2 + 1 < hex.Length) ? Convert.ToByte(hex.Substring(i * 2, 2), 16) : (byte)0;
            part3[i] = (byte)(s_scrambleValues[i] ^ b);
        }

        var b64Part = Convert.ToBase64String(part3).Replace("/", "").Replace("+", "").Replace("=", "");
        return $"zzc{new string(p1)}{b64Part}{new string(p2)}".ToLowerInvariant();
    }

    /// <summary>
    /// 对明文 JSON 使用 AG-1（AES-128-GCM）进行载荷加密
    /// </summary>
    public static string EncryptAg1Request(string jsonPayload)
    {
        var plainBytes = Encoding.UTF8.GetBytes(jsonPayload);
        var nonce = new byte[12];
        RandomNumberGenerator.Fill(nonce);

        var ciphertext = new byte[plainBytes.Length];
        var tag = new byte[16];

        using (var aesGcm = new AesGcm(s_ag1RequestKey, 16))
        {
            aesGcm.Encrypt(nonce, plainBytes, ciphertext, tag);
        }

        var finalData = new byte[12 + ciphertext.Length + 16];
        Buffer.BlockCopy(nonce, 0, finalData, 0, 12);
        Buffer.BlockCopy(ciphertext, 0, finalData, 12, ciphertext.Length);
        Buffer.BlockCopy(tag, 0, finalData, 12 + ciphertext.Length, 16);

        return Convert.ToBase64String(finalData);
    }

    /// <summary>
    /// 解密 AG-1 响应密文流
    /// </summary>
    public static string DecryptAg1Response(byte[] responseBytes)
    {
        var decrypted = new byte[responseBytes.Length];
        for (int i = 0; i < responseBytes.Length; i++)
        {
            decrypted[i] = (byte)(responseBytes[i] ^ s_ag1ResponseKey[i % s_ag1ResponseKey.Length]);
        }
        return Encoding.UTF8.GetString(decrypted);
    }

    /// <summary>
    /// 向 u6 安全网关发送 AG-1 加密请求并自动解密返回 JSON
    /// </summary>
    public static async Task<string> PostAg1Async(string jsonPayload, CancellationToken ct = default)
    {
        var sign = ComputeZzcSign(jsonPayload);
        var encryptedBody = EncryptAg1Request(jsonPayload);
        var ts = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var url = $"https://u6.y.qq.com/cgi-bin/musics.fcg?_={ts}&encoding=ag-1&sign={sign}";

        using var req = new HttpRequestMessage(HttpMethod.Post, url);
        req.Content = new StringContent(encryptedBody, Encoding.UTF8, "application/x-www-form-urlencoded");
        req.Headers.TryAddWithoutValidation("Origin", "https://y.qq.com");
        req.Headers.Referrer = new Uri("https://y.qq.com/");

        var cookieHeader = UserSession.Current.GetCookieHeader();
        if (!string.IsNullOrEmpty(cookieHeader))
        {
            req.Headers.Add("Cookie", cookieHeader);
        }

        using var resp = await s_httpClient.SendAsync(req, ct).ConfigureAwait(false);
        var responseBytes = await resp.Content.ReadAsByteArrayAsync(ct).ConfigureAwait(false);
        return DecryptAg1Response(responseBytes);
    }

    /// <summary>
    /// 向 Web 网关（musicu.fcg）发送明文 JSON + zzc 签名请求，返回响应 JSON。
    /// 带 Cookie（登录态）时该网关可直接读写“收藏的歌单”等资源；注意上层的
    /// “收藏/取消收藏歌单”接口只存在于 musicu.fcg，Android 网关（musics.fcg）
    /// 会把它当成未知请求（code 2000）。
    /// </summary>
    public static async Task<string> PostWebGatewayAsync(string jsonPayload, CancellationToken ct = default)
    {
        var sign = ComputeZzcSign(jsonPayload);
        var ts = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var url = $"https://u6.y.qq.com/cgi-bin/musicu.fcg?_={ts}&sign={sign}";

        using var req = new HttpRequestMessage(HttpMethod.Post, url);
        req.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
        req.Headers.TryAddWithoutValidation("User-Agent", "QQMusic 14090008(android 15)");
        req.Headers.TryAddWithoutValidation("Origin", "https://y.qq.com");
        req.Headers.Referrer = new Uri("https://y.qq.com/");

        var cookieHeader = UserSession.Current.GetCookieHeader();
        if (!string.IsNullOrEmpty(cookieHeader))
        {
            req.Headers.Add("Cookie", cookieHeader);
        }

        using var resp = await s_httpClient.SendAsync(req, ct).ConfigureAwait(false);
        return await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
    }

    /// <summary>
    /// 向 Android App 网关（musics.fcg）发送明文 JSON + zzc 签名请求，返回响应 JSON。
    /// 微信登录态下“我喜欢”（dirId=201）的写操作必须走此协议（AG-1 会返回 80105）。
    /// </summary>
    public static async Task<string> PostAndroidAsync(string jsonPayload, CancellationToken ct = default)
    {
        var sign = ComputeAndroidSign(jsonPayload);
        var ts = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var url = $"https://u.y.qq.com/cgi-bin/musics.fcg?_={ts}&sign={sign}";

        using var req = new HttpRequestMessage(HttpMethod.Post, url);
        req.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
        req.Headers.TryAddWithoutValidation("User-Agent", "QQMusic 14090008(android 15)");
        req.Headers.TryAddWithoutValidation("Origin", "https://y.qq.com");
        req.Headers.Referrer = new Uri("https://y.qq.com/");
        // 不要加 Cookie：实测带上登录 Cookie 后服务端仍回 code=0，但 data.result 是
        // dirId=0/tid=0/updateTime=0 的空壳，写入被静默丢弃（微信登录态下必现）。
        // 身份完全由 comm.authst=music_key + comm.qq=uin + zzc 签名承载。

        using var resp = await s_httpClient.SendAsync(req, ct).ConfigureAwait(false);
        return await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
    }

    /// <summary>
    /// 搜索歌曲（支持分页，每页默认 25 首）
    /// </summary>

    /// 从任意 JSON 元素解析标准 Song 对象（自适应 track 嵌套结构与标准结构）
    /// </summary>
    public static Song? ParseSongFromElement(JsonElement item)
    {
        var track = item.TryGetProperty("track", out var tr) ? tr : item;

        var mid = track.TryGetProperty("mid", out var m) ? m.GetString() ?? "" : "";
        if (string.IsNullOrEmpty(mid) && track.TryGetProperty("songmid", out var sm))
        {
            mid = sm.GetString() ?? "";
        }

        var title = track.TryGetProperty("title", out var t) ? t.GetString() ?? "" : "";
        if (string.IsNullOrEmpty(title) && track.TryGetProperty("name", out var n))
        {
            title = n.GetString() ?? "";
        }
        if (string.IsNullOrEmpty(title) && track.TryGetProperty("songname", out var songNameProp))
        {
            title = songNameProp.GetString() ?? "";
        }

        long songId = 0;
        if (track.TryGetProperty("id", out var idProp))
        {
            if (idProp.ValueKind == JsonValueKind.Number) songId = idProp.GetInt64();
            else if (idProp.ValueKind == JsonValueKind.String && long.TryParse(idProp.GetString(), out var parsedId)) songId = parsedId;
        }
        else if (track.TryGetProperty("songid", out var sidProp))
        {
            if (sidProp.ValueKind == JsonValueKind.Number) songId = sidProp.GetInt64();
            else if (sidProp.ValueKind == JsonValueKind.String && long.TryParse(sidProp.GetString(), out var parsedId)) songId = parsedId;
        }

        string albumName = "";
        string albumMid = "";
        if (track.TryGetProperty("album", out var albumElem))
        {
            if (albumElem.ValueKind == JsonValueKind.Object)
            {
                if (albumElem.TryGetProperty("name", out var an)) albumName = an.GetString() ?? "";
                if (albumElem.TryGetProperty("mid", out var am)) albumMid = am.GetString() ?? "";
                else if (albumElem.TryGetProperty("pmid", out var apm)) albumMid = apm.GetString() ?? "";
            }
            else if (albumElem.ValueKind == JsonValueKind.String)
            {
                albumName = albumElem.GetString() ?? "";
            }
        }
        if (string.IsNullOrEmpty(albumName) && track.TryGetProperty("albumname", out var anProp))
        {
            albumName = anProp.GetString() ?? "";
        }
        if (string.IsNullOrEmpty(albumMid) && track.TryGetProperty("albummid", out var amidProp))
        {
            albumMid = amidProp.GetString() ?? "";
        }

        int duration = 0;
        if (track.TryGetProperty("interval", out var dProp) && dProp.ValueKind == JsonValueKind.Number)
        {
            duration = dProp.GetInt32();
        }

        bool hasSingers = track.TryGetProperty("singer", out var singerArray) && singerArray.ValueKind == JsonValueKind.Array;
        int singerCount = hasSingers ? singerArray.GetArrayLength() : 0;
        var artists = new List<string>(singerCount);
        var singerList = new List<ArtistInfo>(singerCount);
        if (hasSingers)
        {
            foreach (var singer in singerArray.EnumerateArray())
            {
                var sName = "";
                if (singer.TryGetProperty("name", out var sNameProp)) sName = sNameProp.GetString() ?? "";
                else if (singer.TryGetProperty("singer_name", out var snp)) sName = snp.GetString() ?? "";
                else if (singer.TryGetProperty("singerName", out var snp2)) sName = snp2.GetString() ?? "";

                var sMid = "";
                if (singer.TryGetProperty("mid", out var sMidProp)) sMid = sMidProp.GetString() ?? "";
                else if (singer.TryGetProperty("singer_mid", out var smp)) sMid = smp.GetString() ?? "";
                else if (singer.TryGetProperty("singerMID", out var smp2)) sMid = smp2.GetString() ?? "";
                else if (singer.TryGetProperty("pmid", out var pmp)) sMid = pmp.GetString() ?? "";

                long sId = 0;
                if (singer.TryGetProperty("id", out var sIdProp) ||
                    singer.TryGetProperty("singer_id", out sIdProp) ||
                    singer.TryGetProperty("singerID", out sIdProp))
                {
                    if (sIdProp.ValueKind == JsonValueKind.Number) sId = sIdProp.GetInt64();
                    else if (sIdProp.ValueKind == JsonValueKind.String && long.TryParse(sIdProp.GetString(), out var pId)) sId = pId;
                }

                if (!string.IsNullOrWhiteSpace(sName))
                {
                    artists.Add(sName);
                    singerList.Add(new ArtistInfo(sName, sMid, sId));
                }
            }
        }
        var artistStr = artists.Count > 0 ? string.Join("/", artists) : "未知歌手";

        string mediaMid = mid;
        if (track.TryGetProperty("file", out var fileElem) && fileElem.TryGetProperty("media_mid", out var mmProp))
        {
            mediaMid = mmProp.GetString() ?? mid;
        }
        else if (track.TryGetProperty("strMediaMid", out var smmProp))
        {
            mediaMid = smmProp.GetString() ?? mid;
        }
        if (string.IsNullOrEmpty(mediaMid)) mediaMid = mid;

        if (!string.IsNullOrEmpty(mid) && !string.IsNullOrEmpty(title))
        {
            return new Song(mid, title, artistStr, albumName, duration, mediaMid, songId, albumMid)
            {
                Singers = singerList
            };
        }

        return null;
    }

    /// <summary>
}
