using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using QmTui.Models;

namespace QmTui.Utils;

public static partial class LyricParser
{
    /// <summary>
    /// Base64 安全解码为 UTF-8 文本
    /// </summary>
    public static string DecodeBase64(string? b64)
    {
        if (string.IsNullOrWhiteSpace(b64)) return "";
        try
        {
            var bytes = Convert.FromBase64String(b64.Trim());
            return Encoding.UTF8.GetString(bytes);
        }
        catch
        {
            return "";
        }
    }


    // #region QRC（逐字歌词）

    // QQ 音乐 QRC 的 3DES 密钥（24 字节，ECB，每 8 字节一块）

    /// <summary>
    /// 解密 QRC：十六进制密文 -&gt; 3DES/ECB 逐块解密 -&gt; zlib 解压。
    /// </summary>
    public static string DecryptQrc(string? hex) => QrcDes.DecryptQrc(hex);

    /// <summary>QRC 内容被放在 XML 属性里，需要还原实体。</summary>
    private static string UnescapeXml(string value) =>
        value.Replace("&lt;", "<").Replace("&gt;", ">").Replace("&quot;", "\"")
             .Replace("&apos;", "'").Replace("&amp;", "&");

    private static readonly Regex s_qrcLineRegex =
        new(@"(?<![\d\]])\s*\[(\d+),(\d+)\]([^\[]*)", RegexOptions.Compiled);

    private static readonly Regex s_qrcWordRegex =
        new(@"([^()]*)\((\d+),(\d+)\)", RegexOptions.Compiled);

    /// <summary>
    /// 解析 QRC 文本为带词级时间的歌词行。
    /// 行格式：[行开始,行时长]词(开始,时长)词(开始,时长)…（时间单位毫秒）
    /// </summary>
    public static List<LyricLine> ParseQrc(string? qrcText)
    {
        var result = new List<LyricLine>();
        if (string.IsNullOrWhiteSpace(qrcText)) return result;

        foreach (Match lineMatch in s_qrcLineRegex.Matches(qrcText))
        {
            var lineStart = TimeSpan.FromMilliseconds(long.Parse(lineMatch.Groups[1].Value));
            var lineDuration = TimeSpan.FromMilliseconds(long.Parse(lineMatch.Groups[2].Value));
            var body = lineMatch.Groups[3].Value;

            var words = new List<LyricWord>();
            var text = new StringBuilder();
            var firstStart = long.MaxValue;
            foreach (Match wordMatch in s_qrcWordRegex.Matches(body))
            {
                var wordText = UnescapeXml(wordMatch.Groups[1].Value);
                var start = long.Parse(wordMatch.Groups[2].Value);
                var duration = long.Parse(wordMatch.Groups[3].Value);
                firstStart = Math.Min(firstStart, start);
                text.Append(wordText);
                words.Add(new LyricWord(wordText, TimeSpan.FromMilliseconds(start), TimeSpan.FromMilliseconds(start + duration)));
            }

            var lineText = UnescapeXml(text.ToString());
            if (string.IsNullOrWhiteSpace(lineText)) continue;

            // QQ 的词时间通常是绝对毫秒；若明显是从 0 起的行内偏移，则换算成绝对时间。
            if (words.Count > 0 && firstStart + 500 < lineStart.TotalMilliseconds)
            {
                for (int i = 0; i < words.Count; i++)
                {
                    words[i] = words[i] with
                    {
                        Start = lineStart + words[i].Start,
                        End = lineStart + words[i].End,
                    };
                }
            }

            result.Add(new LyricLine(lineStart, lineText, "", words.Count > 0 ? words : null));
        }

        result.Sort((a, b) => a.Timestamp.CompareTo(b.Timestamp));
        return result;
    }

    /// <summary>
    /// 把翻译（LRC 文本）按时间戳贴到已解析的歌词行上。
    /// </summary>
    public static List<LyricLine> AttachTranslation(List<LyricLine> lines, string? transLrc)
    {
        if (lines.Count == 0 || string.IsNullOrWhiteSpace(transLrc)) return lines;
        var transItems = ParseLrc(transLrc);
        if (transItems.Count == 0) return lines;

        var cleanTrans = FilterCleanTranslations(transItems);
        if (cleanTrans.Count == 0) return lines;

        var usedSet = new HashSet<(TimeSpan, string)>(cleanTrans.Count);
        for (int i = 0; i < lines.Count; i++)
        {
            if (IsMetaInfoLine(lines[i].Timestamp, lines[i].Text)) continue;

            string transText = MatchTranslationText(lines[i].Timestamp, i, lines.Count, transItems, cleanTrans, usedSet);
            if (transText.Length > 0)
            {
                lines[i] = lines[i] with { Trans = transText };
            }
        }
        return lines;
    }

    /// <summary>
    /// 挑出真正的翻译行：QQ 的 trans 字段里混着版权与“翻译贡献”占位行。
    /// </summary>
    private static List<(TimeSpan Timestamp, string Text)> FilterCleanTranslations(List<(TimeSpan Timestamp, string Text)> transItems) =>
        transItems.FindAll(t =>
            !string.IsNullOrWhiteSpace(t.Text) &&
            t.Text != "//" &&
            !t.Text.Contains("享有") &&
            !t.Text.Contains("大模型") &&
            !t.Text.Contains("翻译贡献"));

    /// <summary>
    /// 给一行原文挑译文：先 80ms 内的精确匹配，再退到 300ms 内时间距最近的候选，
    /// 最后在两边行数一致时按索引兜底。
    /// QRC 逐字歌词与翻译 LRC 来自不同时间轴（前者取行首词时间），只做毫秒精确匹配会让
    /// 绝大多数行贴不上译文——实测某曲 39 行里只有 5 行时间戳恰好相等。
    /// </summary>
    private static string MatchTranslationText(
        TimeSpan timestamp,
        int index,
        int totalLines,
        List<(TimeSpan Timestamp, string Text)> transItems,
        List<(TimeSpan Timestamp, string Text)> cleanTrans,
        HashSet<(TimeSpan, string)> usedSet)
    {
        if (transItems.Count == 0) return "";

        // 1. 精确匹配 (< 80ms)
        var exact = transItems.Find(t => Math.Abs((t.Timestamp - timestamp).TotalMilliseconds) < 80);
        if (!usedSet.Contains(exact) && cleanTrans.Contains(exact))
        {
            usedSet.Add(exact);
            return exact.Text;
        }

        if (cleanTrans.Count == 0) return "";

        // 2. 300ms 紧凑容差候选匹配 (取时间距离最小的候选，避免跨句抢配)
        var candidates = cleanTrans.FindAll(t => !usedSet.Contains(t) && Math.Abs((t.Timestamp - timestamp).TotalMilliseconds) <= 300);
        if (candidates.Count > 0)
        {
            var best = candidates[0];
            double minDiff = Math.Abs((best.Timestamp - timestamp).TotalMilliseconds);
            for (int c = 1; c < candidates.Count; c++)
            {
                double diff = Math.Abs((candidates[c].Timestamp - timestamp).TotalMilliseconds);
                if (diff < minDiff)
                {
                    minDiff = diff;
                    best = candidates[c];
                }
            }
            usedSet.Add(best);
            return best.Text;
        }

        // 3. 总行数完全一致时的同索引保底回退
        if (cleanTrans.Count == totalLines && index < cleanTrans.Count && !usedSet.Contains(cleanTrans[index]))
        {
            usedSet.Add(cleanTrans[index]);
            return cleanTrans[index].Text;
        }

        return "";
    }

    // #endregion

    private static readonly char[] s_lineSeparators = ['\r', '\n'];

    /// <summary>
    /// 解析标准及多时间戳 LRC 文本
    /// </summary>
    public static List<(TimeSpan Timestamp, string Text)> ParseLrc(string? lrcText)
    {
        if (string.IsNullOrWhiteSpace(lrcText)) return [];

        var lines = lrcText.Split(s_lineSeparators, StringSplitOptions.RemoveEmptyEntries);
        var list = new List<(TimeSpan Timestamp, string Text, int Order)>(lines.Length);
        int lineOrder = 0;
        foreach (var line in lines)
        {
            var trimmed = line.Trim();
            if (string.IsNullOrEmpty(trimmed)) continue;

            var matches = TimestampRegex().Matches(trimmed);
            if (matches.Count == 0) continue;

            // 剥离时间戳提取正文
            var content = TimestampRegex().Replace(trimmed, "").Trim().Replace("&apos;", "’");
            if (string.IsNullOrEmpty(content) || content == "//") continue;

            foreach (Match m in matches)
            {
                var min = int.Parse(m.Groups[1].Value);
                var sec = int.Parse(m.Groups[2].Value);
                var msStr = m.Groups[3].Value.PadRight(3, '0');
                if (msStr.Length > 3) msStr = msStr[..3];
                var ms = int.Parse(msStr);

                var ts = new TimeSpan(0, 0, min, sec, ms);
                list.Add((ts, content, lineOrder++));
            }
        }

        // 稳定排序：时间戳相同时保留 LRC 文件中的原始相对先后排版顺序
        list.Sort((a, b) =>
        {
            int cmp = a.Timestamp.CompareTo(b.Timestamp);
            return cmp != 0 ? cmp : a.Order.CompareTo(b.Order);
        });

        var result = new List<(TimeSpan Timestamp, string Text)>(list.Count);
        foreach (var item in list)
        {
            result.Add((item.Timestamp, item.Text));
        }
        return result;
    }

    /// <summary>
    /// 解析本地 LRC 文本为 LyricLine 列表（智能识别同时间戳双语原歌词与中文翻译）
    /// </summary>
    public static List<LyricLine> ParseSingleLrc(string? lrcText)
    {
        var items = ParseLrc(lrcText);
        if (items.Count == 0) return [];

        var result = new List<LyricLine>(items.Count);
        for (int i = 0; i < items.Count; i++)
        {
            var curr = items[i];

            // 查找所有与当前行时间戳相同（<= 50ms）的候选行
            int j = i + 1;
            while (j < items.Count && Math.Abs((items[j].Timestamp - curr.Timestamp).TotalMilliseconds) <= 50)
            {
                j++;
            }

            // 若同一时间戳有多行且不含制作人员/标题元信息，进行双语对齐归并
            if (j > i + 1)
            {
                bool anyMeta = false;
                for (int k = i; k < j; k++)
                {
                    if (IsMetaInfoLine(items[k].Timestamp, items[k].Text))
                    {
                        anyMeta = true;
                        break;
                    }
                }

                if (!anyMeta)
                {
                    // 若只有 2 行，第二行直接作为译文；若有多行，优先找含汉字中文的行作为译文
                    int transIdx = i + 1;
                    if (j - i > 2)
                    {
                        for (int k = i + 1; k < j; k++)
                        {
                            if (HasChinese(items[k].Text))
                            {
                                transIdx = k;
                                break;
                            }
                        }
                    }

                    var transText = items[transIdx].Text;
                    result.Add(new LyricLine(curr.Timestamp, curr.Text, transText));
                    i = j - 1; // 跳过同时间戳的所有附加行
                    continue;
                }
            }

            result.Add(new LyricLine(curr.Timestamp, curr.Text));
        }

        return result;
    }

    private static bool HasChinese(string s)
    {
        if (string.IsNullOrEmpty(s)) return false;
        foreach (var c in s)
        {
            if (c >= 0x4e00 && c <= 0x9fa5) return true;
        }
        return false;
    }

    /// <summary>
    /// 高精度双语时间轴智能对齐算法
    /// </summary>
    public static List<LyricLine> MergeLyrics(string rawLyric, string rawTrans)
    {
        var origItems = ParseLrc(rawLyric);
        if (origItems.Count == 0)
        {
            origItems = [(TimeSpan.Zero, "暂无歌词")];
        }

        var transItems = ParseLrc(rawTrans);
        var cleanTrans = FilterCleanTranslations(transItems);

        var usedSet = new HashSet<(TimeSpan, string)>(cleanTrans.Count);
        var result = new List<LyricLine>(origItems.Count);

        for (int i = 0; i < origItems.Count; i++)
        {
            var orig = origItems[i];
            string transText = IsMetaInfoLine(orig.Timestamp, orig.Text)
                ? ""
                : MatchTranslationText(orig.Timestamp, i, origItems.Count, transItems, cleanTrans, usedSet);

            result.Add(new LyricLine(orig.Timestamp, orig.Text, transText));
        }

        return result;
    }

    /// <summary>
    /// 判断是否为无需挂载歌词翻译的标题行或幕后制作人员元信息行
    /// </summary>
    private static bool IsMetaInfoLine(TimeSpan ts, string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return true;
        var t = text.Trim();

        // 0 秒且包含连字符的标题行（例如 "Breathe - Machico (マチコ)/LIN"）
        if (ts.TotalSeconds <= 0.05 && t.Contains(" - "))
        {
            return true;
        }

        // 制作人员常见标识
        if (t.StartsWith("词：") || t.StartsWith("词:") || t.StartsWith("作词：") || t.StartsWith("作词:") ||
            t.StartsWith("曲：") || t.StartsWith("曲:") || t.StartsWith("作曲：") || t.StartsWith("作曲:") ||
            t.StartsWith("编曲：") || t.StartsWith("编曲:") || t.StartsWith("制作：") || t.StartsWith("制作:") ||
            t.StartsWith("制作人：") || t.StartsWith("制作人:") || t.StartsWith("监制：") || t.StartsWith("监制:") ||
            t.StartsWith("混音：") || t.StartsWith("混音:") || t.StartsWith("录音：") || t.StartsWith("录音:") ||
            t.StartsWith("母带：") || t.StartsWith("母带:") || t.StartsWith("出品：") || t.StartsWith("出品:") ||
            t.StartsWith("企划：") || t.StartsWith("企划:") || t.StartsWith("OP：") || t.StartsWith("OP:") ||
            t.StartsWith("SP：") || t.StartsWith("SP:"))
        {
            return true;
        }

        return false;
    }

    /// <summary>
    /// 判断当前歌词列表中是否包含有效翻译
    /// </summary>
    public static bool HasTranslation(IEnumerable<LyricLine>? lyrics)
    {
        if (lyrics == null) return false;
        foreach (var l in lyrics)
        {
            if (!string.IsNullOrWhiteSpace(l.Trans)) return true;
        }
        return false;
    }

    /// <summary>
    /// 判断歌词是否主要为外文（日韩文或英文等），确实需要中文辅助翻译
    /// </summary>
    public static bool NeedsTranslation(IEnumerable<LyricLine>? lyrics)
    {
        if (lyrics == null) return false;
        int hanziCount = 0;
        int foreignCharCount = 0;

        foreach (var line in lyrics)
        {
            if (string.IsNullOrWhiteSpace(line.Text)) continue;
            if (IsMetaInfoLine(line.Timestamp, line.Text)) continue;

            foreach (var ch in line.Text)
            {
                // 日文假名 (平假名 \u3040-\u309F, 片假名 \u30A0-\u30FF)
                if (ch >= 0x3040 && ch <= 0x30FF)
                {
                    return true;
                }
                // 韩文音节 (\uAC00-\uD7AF)
                if (ch >= 0xAC00 && ch <= 0xD7AF)
                {
                    return true;
                }
                // 汉字
                if (ch >= 0x4E00 && ch <= 0x9FA5)
                {
                    hanziCount++;
                }
                // 拉丁字母
                else if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z'))
                {
                    foreignCharCount++;
                }
            }
        }

        // 若通篇拉丁字母数量远超汉字（如英文歌曲），判定为外文歌需要翻译
        return foreignCharCount > 20 && foreignCharCount > hanziCount * 2;
    }

    [GeneratedRegex(@"\[(\d{1,2}):(\d{1,2})(?:[\.:](\d{1,3}))?\]")]
    private static partial Regex TimestampRegex();
}
