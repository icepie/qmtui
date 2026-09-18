using Xunit;
using QmTui.Utils;

namespace QmTui.Tests;

public class LyricParserTests
{
    [Fact]
    public void ParseLrc_StandardTimestamps_ParsesCorrectly()
    {
        var lrc = "[00:12.34]第一行歌词\n[01:05.678]第二行歌词";
        var result = LyricParser.ParseLrc(lrc);

        Assert.Equal(2, result.Count);
        Assert.Equal(new TimeSpan(0, 0, 0, 12, 340), result[0].Timestamp);
        Assert.Equal("第一行歌词", result[0].Text);

        Assert.Equal(new TimeSpan(0, 0, 1, 5, 678), result[1].Timestamp);
        Assert.Equal("第二行歌词", result[1].Text);
    }

    [Fact]
    public void ParseLrc_WithoutMilliseconds_ParsesCorrectly()
    {
        var lrc = "[01:30]没有毫秒的歌词行";
        var result = LyricParser.ParseLrc(lrc);

        Assert.Single(result);
        Assert.Equal(new TimeSpan(0, 0, 1, 30, 0), result[0].Timestamp);
        Assert.Equal("没有毫秒的歌词行", result[0].Text);
    }

    [Fact]
    public void ParseLrc_MultipleTimestamps_SplitsCorrectly()
    {
        var lrc = "[00:10.00][00:20.00]副歌重复段落";
        var result = LyricParser.ParseLrc(lrc);

        Assert.Equal(2, result.Count);
        Assert.Equal(new TimeSpan(0, 0, 0, 10, 0), result[0].Timestamp);
        Assert.Equal("副歌重复段落", result[0].Text);

        Assert.Equal(new TimeSpan(0, 0, 0, 20, 0), result[1].Timestamp);
        Assert.Equal("副歌重复段落", result[1].Text);
    }

    [Fact]
    public void ParseLrc_HtmlEntities_ReplacesApos()
    {
        var lrc = "[00:05.00]Don&apos;t go away";
        var result = LyricParser.ParseLrc(lrc);

        Assert.Single(result);
        Assert.Equal("Don’t go away", result[0].Text);
    }

    [Fact]
    public void ParseLrc_EmptyOrComment_Skips()
    {
        var lrc = "\n[ti:Test Title]\n//\n   \n[00:01.00]Valid";
        var result = LyricParser.ParseLrc(lrc);

        Assert.Single(result);
        Assert.Equal("Valid", result[0].Text);
    }

    [Fact]
    public void DecodeBase64_ValidBase64_DecodesSuccessfully()
    {
        var plain = "qmtui 终端播放器";
        var b64 = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(plain));
        var decoded = LyricParser.DecodeBase64(b64);

        Assert.Equal(plain, decoded);
    }

    [Fact]
    public void DecodeBase64_InvalidBase64_ReturnsEmptyString()
    {
        var decoded = LyricParser.DecodeBase64("This is not base64!!!");
        Assert.Equal("", decoded);
    }

    [Fact]
    public void ParseQrc_AbsoluteWordTimes_KeptAsIs()
    {
        // 行从 1.0s 开始，词时间是绝对毫秒（与 QQ 返回一致）
        var qrc = "[1000,900]Lyrics (1000,200)by：(1200,150)John (1350,250)";
        var lines = LyricParser.ParseQrc(qrc);

        var line = Assert.Single(lines);
        Assert.Equal(TimeSpan.FromMilliseconds(1000), line.Timestamp);
        Assert.Equal("Lyrics by：John ", line.Text);
        Assert.NotNull(line.Words);
        Assert.Equal(3, line.Words!.Count);
        Assert.Equal("Lyrics ", line.Words[0].Text);
        Assert.Equal(TimeSpan.FromMilliseconds(1000), line.Words[0].Start);
        Assert.Equal(TimeSpan.FromMilliseconds(1200), line.Words[0].End);
        Assert.Equal(TimeSpan.FromMilliseconds(1350), line.Words[2].Start);
        Assert.Equal(TimeSpan.FromMilliseconds(1600), line.Words[2].End);
    }

    [Fact]
    public void ParseQrc_RelativeWordTimes_ShiftedByLineStart()
    {
        // 词时间明显从 0 起（行内偏移）时应换算成绝对时间
        var qrc = "[30000,2000]风(0,400)继续(400,600)吹(1000,500)";
        var lines = LyricParser.ParseQrc(qrc);

        var line = Assert.Single(lines);
        Assert.Equal("风继续吹", line.Text);
        Assert.NotNull(line.Words);
        Assert.Equal(TimeSpan.FromMilliseconds(30000), line.Words![0].Start);
        Assert.Equal(TimeSpan.FromMilliseconds(30400), line.Words[1].Start);
        Assert.Equal(TimeSpan.FromMilliseconds(31000), line.Words[2].Start);
        Assert.Equal(TimeSpan.FromMilliseconds(31500), line.Words[2].End);
    }

    [Fact]
    public void AttachTranslation_MatchesByTimestamp_AndUnescapesXml()
    {
        var qrc = "[1000,900]&quot;Hello&quot; (1000,200)world (1200,300)";
        var lines = LyricParser.ParseQrc(qrc);
        Assert.Equal("\"Hello\" world ", lines[0].Text);

        var merged = LyricParser.AttachTranslation(lines, "[00:01.00]你好 世界");
        Assert.Equal("你好 世界", merged[0].Trans);
    }

    [Fact]
    public void DecryptQrc_RealPayload_YieldsWords()
    {
        // 真实响应（qrc:1 时 lyric 字段为十六进制密文），期望解出与官方一致的词级时间
        const string encrypted = "ED27466EA5DD15AD42D65C9D65699E32098221D54CF7C90C7C17905468ADAECE4D69E116103C9DFC5D6B8F3BDEB488A4C9BBAD9016BA0853DF1AC25194987E38009B7B8ABF055B5012C97773BAEB59DD5A69DB4F85DD8868432B87E0D8CAEDFB383D71DCB51043E87179F375C5BDF157AF0BBA46515B3D422EF88B3D8AD0BF40339D712B9844479F88AEFF2EFDC1F5E4242A9D943B6DE9DE0AF51F3EF7631C4E71AD36C88052876CDD7454A6843920CA656E30A9B31840B028D58D4B82FA6B284781BB31CCE36ACE2CFEF2CB54F0EB9060F87C684945D918CF74813CE5A7DC3C7E407E67E4056D66E190BCDBC4FDFF955E58C123DD63F2B721CC481C884BF4776DDB551EC7A86ECA6A85D7D7E33A72A74A693DEC26B63B534DC3FC1BBCAFF7C4C1DC8686DC0DA6921AFEBF63A6E0E0FCE6B2583992E02DE7BCD70E53EB9795477E1459CF85D530FFF0F5CE519C7DEBF2CA8B78A5BF21AD1E881EE309F99268B81B656209C281731AA6CAE90A150652ACF1DB6393E24BCDB58C75ED8C68F3A610ECFB4CBA01F302046C9863BC8E6EDEA183A19F657F7D068AAC5C77968C3DB0E06A1828D803F234487AE9B943C1188A772CA5833513D2AEDC3391BD37C92B7A9D283EF54072C10EB9E385F87DD6F3DA35658ACD766E7BAAD92F40BB36D3A02100192441BE32FAF98E55A16A5B0D9675A5602F9C6832B6CF8FB3675081C03481037B6216ED5EC6AC097EB9E701E1B87E5A94B86A578720F135791A89E21F7EDF3ED423EBE2EDA8F5B92E9BDF290C4D3650C4EAAEA9C5A5EBEBE7B2A19D3A1FFA543DA462B07B286D203526B53DB5F403F901BC2D64E9AB23ADB3B3643551828B79BBAE63005C737D9C27098A1E65D88F0E94299BE3E204889197DFFB5020BD4B928D4963E08E5521741D2FBC55D4A4DA569747B6123838BFF5C69057424AED9E6302BCE1E7774390C49B5112FBAE4D06EE2BF3BCB75232E11730684A774064CC8A12F27B2FAA92AE88981575BC29667D9A9B4CFC94578589522BED0725F733A17AF2BA5260C242E5BB0C8B5DD1D3EE1DA9B876B5A3A490968B7A3E03E2990ADB6C991105B4CC2105CB01ECBF7A6140DA82D32482F35FF5DDBBE3D9F196E6D5888AF8A89DDEA5862A4ADF8D9B6A560E621414C814ED56B3BBC1143B214E7DABC8E11A7E77FE3D8631A620A4762A9CA01ECD25567C578B137E0B8FBDFC645307C279CCB4801BE87A9440186C86544BA0EFF16F2AADD30376271EF499B497B42D84ABAE5B369D1E457DEA16F52CD7B683EAD7E32B0800A6BF4C8DD276474703300E3F3BCDD1DDE8564E97FFF4E01FF97F83F5C05EF24C1107DF85415C8B744E809F0A956BFE608F8380D6FE0F6691742A30630D9B096AFC79FEA47B0127EDEB7C6F074A7C664784EF684366257240F0EFA6C072DE05BDFBC373CA20C72B7132A814E7C98C16E9C845F0940FE27F7DD21CBBD8C45A73BB13CBFC90C541E2169B5EFBF1FC3243F41610655BDD4E8B52F699C65FD6DD6C2C20781EB566DEB16E4D54C96DC50D31C92113D622955EC11B360629486CB6940D891FA4DE9E768284DFB21C7BEA07AA0B3B59064729994D1BBF24FF607C8B1531FFE42BC9154C47814B0A17146BDB3274863F31BFEA3C63B4F3F413544E428F2E609C4391379A77E1977BF912681ED1C265EFA17D0D0C6C50992B6663D4C9AF562732423BC364BC3C46E4CFDDA173AF2273F81B027C8029ED863938AB6B0578D7C6C480740467EF2769190509493E6CC644A3BAE500657C7DB692E5D7B7021356538D3C9B161B264CDD2285BD3F5E655E4857110A278297E44BFE93D71572B32C3A120C4405F162DEEC317EE20FE004A4FEDC7D3B90E9D6D3F81AEA59D4C5A318156C7DF13C49679DE6239F7A963535E841F7E41009DE76DCD73B2B852DB523228AFE99A43861B7ECED08401F833830B8338214CFD4802DDE21AF198FEA6EBE5C6785BEBE112CE72AB8D33BFD3DBAFE622CFF6D3ECC68D17AD985D0E28B02CC5B9766450FF6DAF84709A53CF8F0F1ED5DA096485E012BB6D64CFFD176752A1F8D78467E34C39DA9D64DAC0E10F8C1479CFD8DA7A2AE4E89E3B4C84FD6DAA6B16D92C3928C614A496D3E3A205D71E22C3F4B59CEF708A29847D4A75D7F8844871BF8E839D55D2CC1CCCC2EEB9509B2BCCBFF38A02516F766C119DF025F6C2EA52B16AA04D5A24C2FDC01D2D55E0C8973AACD42FD0733C117A577905BCA549833DBD1C1518A8E8F4E00C3F6509B5011A643BADA0D78";

        var decrypted = LyricParser.DecryptQrc(encrypted);
        Assert.StartsWith("<?xml", decrypted);
        Assert.Contains("LyricContent=", decrypted);

        var lines = LyricParser.ParseQrc(decrypted);
        Assert.True(lines.Count > 20, $"只解析出 {lines.Count} 行");

        var withWords = lines.Where(l => l.Words is { Count: > 0 }).ToList();
        Assert.NotEmpty(withWords);

        // 与官方解密结果对齐：该行的词时间为 729/881/1015/1159（毫秒）
        var line = withWords.First(l => l.Text.Trim() == "Lyrics by：John Lennon");
        Assert.Equal("Lyrics ", line.Words![0].Text);
        Assert.Equal(729, (long)line.Words[0].Start.TotalMilliseconds);
        Assert.Equal(881, (long)line.Words[0].End.TotalMilliseconds);
        Assert.Equal(1159, (long)line.Words[3].Start.TotalMilliseconds);
    }
}
