using System.Buffers.Binary;
using System.IO.Compression;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using QmTui.Services;
using Xunit;

namespace QmTui.Tests;

public class WebPlaybackServerTests
{
    [Fact]
    public async Task RemoteControlOnly_StateIsPushedOverWebSocketWithoutAudioStreamUrl()
    {
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        int port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();

        using var server = new WebPlaybackServer
        {
            CurrentPlayUrl = "https://example.test/audio.flac",
            IsPlaying = true
        };
        Assert.True(server.Start(port, initialAudioOutput: false, remoteControlOnly: true));

        using var client = new TcpClient();
        await client.ConnectAsync(IPAddress.Loopback, server.Port);
        await using var stream = client.GetStream();

        // RFC 6455 §1.3 的示例握手值：同时锁住 Sec-WebSocket-Accept 的推导。
        await stream.WriteAsync(Encoding.ASCII.GetBytes(
            "GET /api/ws HTTP/1.1\r\nHost: localhost\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n" +
            "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n"));
        await stream.FlushAsync();

        string handshake = await ReadHttpHeaderBlockAsync(stream);
        Assert.StartsWith("HTTP/1.1 101 Switching Protocols\r\n", handshake, StringComparison.Ordinal);
        Assert.Contains("Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=", handshake, StringComparison.Ordinal);

        using var state = JsonDocument.Parse(await ReadWebSocketTextFrameAsync(stream));
        Assert.True(state.RootElement.GetProperty("remoteControlOnly").GetBoolean());
        Assert.Equal(string.Empty, state.RootElement.GetProperty("streamUrl").GetString());
    }

    /// <summary>按字节读取 HTTP 响应头（不能用 StreamReader，避免预读吃掉紧随其后的 WebSocket 帧）。</summary>
    private static async Task<string> ReadHttpHeaderBlockAsync(NetworkStream stream)
    {
        var builder = new StringBuilder();
        var single = new byte[1];
        while (builder.Length < 8192)
        {
            int read = await stream.ReadAsync(single);
            if (read == 0) break;
            builder.Append((char)single[0]);
            if (builder.Length >= 4 && builder.ToString(builder.Length - 4, 4) == "\r\n\r\n") break;
        }
        return builder.ToString();
    }

    /// <summary>读取一个服务端文本帧（服务端帧不掩码）。</summary>
    private static async Task<string> ReadWebSocketTextFrameAsync(NetworkStream stream)
    {
        var header = new byte[2];
        await ReadExactlyAsync(stream, header);
        Assert.Equal(0x81, header[0]);

        int length = header[1] & 0x7F;
        if (length == 126)
        {
            var extended = new byte[2];
            await ReadExactlyAsync(stream, extended);
            length = (extended[0] << 8) | extended[1];
        }
        else if (length == 127)
        {
            var extended = new byte[8];
            await ReadExactlyAsync(stream, extended);
            length = (int)BinaryPrimitives.ReadUInt64BigEndian(extended);
        }

        var payload = new byte[length];
        await ReadExactlyAsync(stream, payload);
        return Encoding.UTF8.GetString(payload);
    }

    private static async Task ReadExactlyAsync(NetworkStream stream, byte[] buffer)
    {
        int offset = 0;
        while (offset < buffer.Length)
        {
            int read = await stream.ReadAsync(buffer.AsMemory(offset));
            if (read == 0) throw new IOException("Stream closed before the expected bytes arrived.");
            offset += read;
        }
    }

    [Fact]
    public async Task LibrarySearch_RequiresQuery()
    {
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        int port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();

        using var server = new WebPlaybackServer();
        Assert.True(server.Start(port));

        using var client = new TcpClient();
        await client.ConnectAsync(IPAddress.Loopback, server.Port);
        await using var stream = client.GetStream();
        await stream.WriteAsync(Encoding.ASCII.GetBytes("GET /api/library/search HTTP/1.1\r\nHost: localhost\r\n\r\n"));
        await stream.FlushAsync();

        using var reader = new StreamReader(stream, Encoding.UTF8, leaveOpen: true);
        Assert.Equal("HTTP/1.1 400 Bad Request", await reader.ReadLineAsync());
    }

    [Fact]
    public async Task LibraryPlay_ForwardsContextToTui()
    {
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        int port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();

        using var server = new WebPlaybackServer();
        WebLibraryPlayRequest? received = null;
        server.LibraryPlayRequested += request => received = request;
        Assert.True(server.Start(port));

        const string body = "{\"song\":{\"mid\":\"mid-1\",\"title\":\"Song\",\"artist\":\"Artist\",\"album\":\"Album\",\"duration\":180},\"context\":[]}";
        using var client = new TcpClient();
        await client.ConnectAsync(IPAddress.Loopback, server.Port);
        await using var stream = client.GetStream();
        var request = $"POST /api/library/play HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: {Encoding.UTF8.GetByteCount(body)}\r\n\r\n{body}";
        await stream.WriteAsync(Encoding.UTF8.GetBytes(request));
        await stream.FlushAsync();

        using var reader = new StreamReader(stream, Encoding.UTF8, leaveOpen: true);
        Assert.Equal("HTTP/1.1 202 Accepted", await reader.ReadLineAsync());
        Assert.NotNull(received);
        Assert.Equal("mid-1", received.Song.Mid);
        Assert.Single(received.Context);
    }

    [Fact]
    public async Task LibraryPlay_HandlesBodySplitAcrossNetworkReads()
    {
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        int port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();

        using var server = new WebPlaybackServer();
        WebLibraryPlayRequest? received = null;
        server.LibraryPlayRequested += request => received = request;
        Assert.True(server.Start(port));

        const string body = "{\"song\":{\"mid\":\"split-mid\",\"title\":\"Song\",\"artist\":\"Artist\",\"album\":\"Album\",\"duration\":180},\"context\":[]}";
        using var client = new TcpClient();
        await client.ConnectAsync(IPAddress.Loopback, server.Port);
        await using var stream = client.GetStream();
        var headers = $"POST /api/library/play HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: {Encoding.UTF8.GetByteCount(body)}\r\n\r\n";
        await stream.WriteAsync(Encoding.UTF8.GetBytes(headers + body[..20]));
        await stream.FlushAsync();
        await Task.Delay(20);
        await stream.WriteAsync(Encoding.UTF8.GetBytes(body[20..]));
        await stream.FlushAsync();

        using var reader = new StreamReader(stream, Encoding.UTF8, leaveOpen: true);
        Assert.Equal("HTTP/1.1 202 Accepted", await reader.ReadLineAsync());
        Assert.NotNull(received);
        Assert.Equal("split-mid", received.Song.Mid);
    }

    [Fact]
    public async Task Comments_RequiresValidBusinessId()
    {
        int port = ReservePort();
        using var server = new WebPlaybackServer();
        Assert.True(server.Start(port));

        using var client = new TcpClient();
        await client.ConnectAsync(IPAddress.Loopback, server.Port);
        await using var stream = client.GetStream();
        await stream.WriteAsync(Encoding.ASCII.GetBytes("GET /api/comments HTTP/1.1\r\nHost: localhost\r\n\r\n"));
        await stream.FlushAsync();

        using var reader = new StreamReader(stream, Encoding.UTF8, leaveOpen: true);
        Assert.Equal("HTTP/1.1 400 Bad Request", await reader.ReadLineAsync());
    }

    [Fact]
    public async Task AddComment_RequiresLoginBeforeMutation()
    {
        int port = ReservePort();
        using var server = new WebPlaybackServer();
        Assert.True(server.Start(port));

        const string body = "{\"bizId\":1,\"bizType\":1,\"content\":\"test\",\"replyCommentId\":\"\"}";
        using var client = new TcpClient();
        await client.ConnectAsync(IPAddress.Loopback, server.Port);
        await using var stream = client.GetStream();
        var request = $"POST /api/comments/add HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: {Encoding.UTF8.GetByteCount(body)}\r\n\r\n{body}";
        await stream.WriteAsync(Encoding.UTF8.GetBytes(request));
        await stream.FlushAsync();

        using var reader = new StreamReader(stream, Encoding.UTF8, leaveOpen: true);
        Assert.Equal("HTTP/1.1 401 Unauthorized", await reader.ReadLineAsync());
    }

    [Fact]
    public async Task ProgressReport_UpdatesStateAndRaisesEvent()
    {
        int port = ReservePort();
        using var server = new WebPlaybackServer
        {
            TotalDurationSeconds = 240,
            IsPlaying = true
        };
        double? reportedPosition = null;
        double? reportedDuration = null;
        server.ProgressReported += (position, duration) =>
        {
            reportedPosition = position;
            reportedDuration = duration;
        };
        Assert.True(server.Start(port));

        const string body = "{\"position\":37.5,\"duration\":241}";
        using var client = new TcpClient();
        await client.ConnectAsync(IPAddress.Loopback, server.Port);
        await using var stream = client.GetStream();
        var request = $"POST /api/progress HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: {Encoding.UTF8.GetByteCount(body)}\r\n\r\n{body}";
        await stream.WriteAsync(Encoding.UTF8.GetBytes(request));
        await stream.FlushAsync();

        using var reader = new StreamReader(stream, Encoding.UTF8, leaveOpen: true);
        Assert.Equal("HTTP/1.1 200 OK", await reader.ReadLineAsync());
        Assert.Equal(37.5, server.CurrentPositionSeconds);
        Assert.Equal(241, server.TotalDurationSeconds);
        Assert.Equal(37.5, reportedPosition);
        Assert.Equal(241, reportedDuration);
    }

    [Fact]
    public void BroadcastState_ContainsCurrentProgressAndPlaybackState()
    {
        using var server = new WebPlaybackServer
        {
            IsPlaying = true,
            CurrentPositionSeconds = 12.5,
            TotalDurationSeconds = 180
        };

        using var state = JsonDocument.Parse(server.GetStateJson("progress"));
        Assert.Equal("progress", state.RootElement.GetProperty("type").GetString());
        Assert.True(state.RootElement.GetProperty("isPlaying").GetBoolean());
        Assert.Equal(12.5, state.RootElement.GetProperty("position").GetDouble());
        Assert.Equal(180, state.RootElement.GetProperty("duration").GetDouble());

        // 进度帧每 400ms 一次：只带易变字段，歌词与队列只在变化时全量下发。
        Assert.False(state.RootElement.TryGetProperty("lyrics", out _));
        Assert.False(state.RootElement.TryGetProperty("songList", out _));

        using var full = JsonDocument.Parse(server.GetStateJson("song_change"));
        Assert.True(full.RootElement.TryGetProperty("lyrics", out _));
        Assert.True(full.RootElement.TryGetProperty("songList", out _));
    }

    [Fact]
    public async Task StaticAssets_RevalidateWithETagAndAreImmutableWhenVersioned()
    {
        var entry = await SendRequestAsync("GET /amll/index.html HTTP/1.1\r\nHost: localhost\r\n\r\n");
        Assert.StartsWith("HTTP/1.1 200 OK\r\n", entry.Headers, StringComparison.Ordinal);
        Assert.Contains("Cache-Control: no-cache\r\n", entry.Headers, StringComparison.Ordinal);

        string etag = HeaderValue(entry.Headers, "ETag");
        Assert.NotEmpty(etag);

        var revalidated = await SendRequestAsync($"GET /amll/index.html HTTP/1.1\r\nHost: localhost\r\nIf-None-Match: {etag}\r\n\r\n");
        Assert.StartsWith("HTTP/1.1 304 Not Modified\r\n", revalidated.Headers, StringComparison.Ordinal);
        Assert.Empty(revalidated.Body);

        // 带 ?v=<构建版本> 的 URL 内容随版本变化，可以长缓存不再回源。
        var versioned = await SendRequestAsync("GET /shim.js?v=deadbeef HTTP/1.1\r\nHost: localhost\r\n\r\n");
        Assert.Contains("Cache-Control: public, max-age=31536000, immutable\r\n", versioned.Headers, StringComparison.Ordinal);
    }

    [Fact]
    public async Task StaticAssets_NegotiateCompressionWithoutChangingContent()
    {
        var plain = await SendRequestAsync("GET /amll/index.html HTTP/1.1\r\nHost: localhost\r\nAccept-Encoding: identity\r\n\r\n");
        Assert.DoesNotContain("Content-Encoding:", plain.Headers, StringComparison.Ordinal);

        var brotli = await SendRequestAsync("GET /amll/index.html HTTP/1.1\r\nHost: localhost\r\nAccept-Encoding: gzip, br\r\n\r\n");
        Assert.Contains("Content-Encoding: br\r\n", brotli.Headers, StringComparison.Ordinal);
        Assert.True(brotli.Body.Length < plain.Body.Length);

        using (var input = new MemoryStream(brotli.Body))
        using (var decompressor = new BrotliStream(input, CompressionMode.Decompress))
        using (var output = new MemoryStream())
        {
            await decompressor.CopyToAsync(output);
            Assert.Equal(plain.Body, output.ToArray());
        }

        var gzip = await SendRequestAsync("GET /amll/index.html HTTP/1.1\r\nHost: localhost\r\nAccept-Encoding: gzip\r\n\r\n");
        Assert.Contains("Content-Encoding: gzip\r\n", gzip.Headers, StringComparison.Ordinal);
    }

    /// <summary>起一个临时服务，发一个请求，把响应头和正文完整读回来。</summary>
    private static async Task<(string Headers, byte[] Body)> SendRequestAsync(string request)
    {
        using var server = new WebPlaybackServer();
        Assert.True(server.Start(ReservePort()));

        using var client = new TcpClient();
        await client.ConnectAsync(IPAddress.Loopback, server.Port);
        await using var stream = client.GetStream();
        await stream.WriteAsync(Encoding.ASCII.GetBytes(request));
        await stream.FlushAsync();

        string headers = await ReadHttpHeaderBlockAsync(stream);
        var body = new byte[HeaderLength(headers)];
        if (body.Length > 0) await ReadExactlyAsync(stream, body);
        return (headers, body);
    }

    private static int HeaderLength(string headers)
    {
        foreach (var line in headers.Split("\r\n"))
        {
            if (line.StartsWith("Content-Length:", StringComparison.OrdinalIgnoreCase))
            {
                return int.TryParse(line["Content-Length:".Length..].Trim(), out int length) ? length : 0;
            }
        }
        return 0;
    }

    private static string HeaderValue(string headers, string name)
    {
        foreach (var line in headers.Split("\r\n"))
        {
            if (line.StartsWith(name + ":", StringComparison.OrdinalIgnoreCase))
            {
                return line[(name.Length + 1)..].Trim();
            }
        }
        return "";
    }

    private static int ReservePort()
    {
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        int port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();
        return port;
    }

}
