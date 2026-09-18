using System;
using System.Collections.Generic;
using QmTui.Models;
using QmTui.Services;
using Xunit;

namespace QmTui.Tests;

public class MetadataCacheServiceTests
{
    [Fact]
    public void DailyRecommendCache_Roundtrip_WorksCorrectly()
    {
        var testUin = "test_uin_999";
        var testDate = "2026-09-11";
        var songs = new List<Song>
        {
            new Song("mid_01", "Song One", "Artist A", "Album A", 200),
            new Song("mid_02", "Song Two", "Artist B", "Album B", 240)
        };

        MetadataCacheService.SaveDailyRecommend(testUin, testDate, songs);

        var cached = MetadataCacheService.GetDailyRecommend(testUin, testDate);
        Assert.NotNull(cached);
        Assert.Equal(testDate, cached.Date);
        Assert.Equal(testUin, cached.Uin);
        Assert.Equal(2, cached.Songs.Count);
        Assert.Equal("mid_01", cached.Songs[0].Mid);
        Assert.Equal("Song One", cached.Songs[0].Title);

        // 不同日期应未命中
        var wrongDateCache = MetadataCacheService.GetDailyRecommend(testUin, "2026-09-12");
        Assert.Null(wrongDateCache);
    }

    [Fact]
    public void FavoriteCache_Roundtrip_WorksCorrectly()
    {
        var testUin = "test_fav_888";
        var songs = new List<Song>
        {
            new Song("fav_01", "Fav One", "Singer A", "Album A", 180),
            new Song("fav_02", "Fav Two", "Singer B", "Album B", 210)
        };

        MetadataCacheService.SaveFavoriteCache(testUin, 2, "fav_01", songs);

        var cached = MetadataCacheService.GetFavoriteCache(testUin);
        Assert.NotNull(cached);
        Assert.Equal(testUin, cached.Uin);
        Assert.Equal(2, cached.TotalCount);
        Assert.Equal("fav_01", cached.FirstSongMid);
        Assert.Equal(2, cached.Songs.Count);
        Assert.Equal("Fav One", cached.Songs[0].Title);
    }

    [Fact]
    public void LyricsCache_Roundtrip_WorksCorrectly()
    {
        var songMid = "test_lyric_mid_777";
        var lyrics = new List<LyricLine>
        {
            new LyricLine(TimeSpan.FromSeconds(0), "Verse 1", "第一节"),
            new LyricLine(TimeSpan.FromSeconds(15), "Chorus", "副歌")
        };

        MetadataCacheService.SaveLyrics(songMid, lyrics);

        var cached = MetadataCacheService.GetLyrics(songMid);
        Assert.NotNull(cached);
        Assert.Equal(2, cached.Count);
        Assert.Equal("Verse 1", cached[0].Text);
        Assert.Equal("第一节", cached[0].Trans);
        Assert.Equal(TimeSpan.FromSeconds(15), cached[1].Timestamp);
    }
}

public class LyricWordSerializationTests
{
    [Fact]
    public void LyricsWithWords_RoundTripThroughJsonContext()
    {
        var lines = new List<QmTui.Models.LyricLine>
        {
            new(TimeSpan.FromMilliseconds(729), "Lyrics by：John Lennon", "译文",
                [
                    new QmTui.Models.LyricWord("Lyrics ", TimeSpan.FromMilliseconds(729), TimeSpan.FromMilliseconds(881)),
                    new QmTui.Models.LyricWord("by：", TimeSpan.FromMilliseconds(881), TimeSpan.FromMilliseconds(1015)),
                ]),
            new(TimeSpan.FromMilliseconds(1319), "Composed by：John Lennon"),
        };

        var json = System.Text.Json.JsonSerializer.Serialize(lines, QmTui.Utils.AppJsonContext.Default.ListLyricLine);
        Assert.Contains("\"Words\"", json);

        var back = System.Text.Json.JsonSerializer.Deserialize(json, QmTui.Utils.AppJsonContext.Default.ListLyricLine);
        Assert.NotNull(back);
        Assert.NotNull(back![0].Words);
        Assert.Equal(2, back[0].Words!.Count);
        Assert.Equal("Lyrics ", back[0].Words![0].Text);
        Assert.Equal(729, (long)back[0].Words![0].Start.TotalMilliseconds);
        Assert.Equal("译文", back[0].Trans);
        Assert.Null(back[1].Words);
    }
}
