namespace QmTui.Models;

public record ArtistInfo(string Name, string Mid = "", long Id = 0);

public record Song(
    string Mid,
    string Title,
    string Artist,
    string Album,
    int Duration,
    string MediaMid = "",
    long Id = 0,
    string AlbumMid = ""
)
{
    public long Id { get; set; } = Id;
    public int Duration { get; set; } = Duration;
    public string AlbumMid { get; set; } = AlbumMid;
    public string EffectiveMediaMid => string.IsNullOrEmpty(MediaMid) ? Mid : MediaMid;
    public string FormattedDuration => $"{Duration / 60:D2}:{Duration % 60:D2}";
    public string? PlayUrl { get; set; }
    public string Quality { get; set; } = "标准 128k";
    public string? LocalFilePath { get; set; }
    public bool IsLocal => !string.IsNullOrEmpty(LocalFilePath);
    public string? WebDavServerId { get; set; }
    public string? WebDavHref { get; set; }
    public bool IsWebDav => !string.IsNullOrEmpty(WebDavHref);
    public string? CoverUrl { get; set; }
    public List<ArtistInfo> Singers { get; set; } = [];
}

/// <summary>逐字歌词中的一个词（含起止时间，用于 KTV 效果）</summary>
public record LyricWord(string Text, TimeSpan Start, TimeSpan End);

public record LyricLine(TimeSpan Timestamp, string Text, string Trans = "", List<LyricWord>? Words = null);
