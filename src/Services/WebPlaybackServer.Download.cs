using System.IO;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using QmTui.Models;
using QmTui.Utils;

namespace QmTui.Services;

public sealed partial class WebPlaybackServer
{
    private static async Task HandleDownloadAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        Song? song = null;
        AudioQualityTier tier = AudioQualityTier.Standard;
        try
        {
            using var doc = JsonDocument.Parse(body);
            var root = doc.RootElement;
            if (root.TryGetProperty("song", out var songEl))
            {
                song = ParseDownloadSong(songEl);
            }
            if (root.TryGetProperty("quality", out var qEl) && qEl.ValueKind == JsonValueKind.String)
            {
                tier = ParseDownloadTier(qEl.GetString());
            }
        }
        catch (JsonException)
        {
        }

        if (song == null)
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json",
                "{\"success\":false,\"filename\":\"\",\"message\":\"无效的歌曲数据\"}", ct).ConfigureAwait(false);
            return;
        }

        var result = await AudioExportService.ExportSongAsync(song, tier, null, ct).ConfigureAwait(false);
        string filename = result.FilePath != null ? Path.GetFileName(result.FilePath) : "";
        var sb = new StringBuilder();
        sb.Append('{');
        sb.Append($"\"success\":{(result.Success ? "true" : "false")},");
        sb.Append($"\"filename\":\"{EscapeJson(filename)}\",");
        sb.Append($"\"message\":\"{EscapeJson(result.Message)}\"");
        sb.Append('}');
        await SendResponseAsync(stream, result.Success ? 200 : 500, result.Success ? "OK" : "Error",
            "application/json", sb.ToString(), ct).ConfigureAwait(false);
    }

    private static Song ParseDownloadSong(JsonElement el)
    {
        string mid = GetJsonString(el, "mid");
        string title = GetJsonString(el, "title");
        if (string.IsNullOrEmpty(title)) title = "未知曲目";
        string artist = GetJsonString(el, "artist");
        if (string.IsNullOrEmpty(artist)) artist = "未知歌手";
        string album = GetJsonString(el, "album");
        int duration = GetJsonInt(el, "duration");
        string mediaMid = GetJsonString(el, "mediaMid");
        if (string.IsNullOrEmpty(mediaMid)) mediaMid = mid;
        long id = GetJsonLong(el, "id");
        string albumMid = GetJsonString(el, "albumMid");
        return new Song(mid, title, artist, album, duration, mediaMid, id, albumMid);
    }

    private static AudioQualityTier ParseDownloadTier(string? key) => key switch
    {
        "hires" => AudioQualityTier.HiRes,
        "flac" => AudioQualityTier.SQ,
        "320k" => AudioQualityTier.HQ,
        "128k" => AudioQualityTier.Standard,
        _ => AudioQualityTier.Standard
    };

    private static string GetJsonString(JsonElement el, string prop)
    {
        return el.TryGetProperty(prop, out var v) && v.ValueKind == JsonValueKind.String ? v.GetString() ?? "" : "";
    }

    private static int GetJsonInt(JsonElement el, string prop)
    {
        if (!el.TryGetProperty(prop, out var v)) return 0;
        if (v.ValueKind == JsonValueKind.Number && v.TryGetInt32(out var i)) return i;
        if (v.ValueKind == JsonValueKind.String && int.TryParse(v.GetString(), out i)) return i;
        return 0;
    }

    private static long GetJsonLong(JsonElement el, string prop)
    {
        if (!el.TryGetProperty(prop, out var v)) return 0;
        if (v.ValueKind == JsonValueKind.Number && v.TryGetInt64(out var l)) return l;
        if (v.ValueKind == JsonValueKind.String && long.TryParse(v.GetString(), out l)) return l;
        return 0;
    }
}
