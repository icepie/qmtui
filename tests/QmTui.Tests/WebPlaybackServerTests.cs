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
    public async Task RemoteControlOnly_SseStateDoesNotExposeOrPlayAudioStream()
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
        await client.ConnectAsync(IPAddress.Loopback, port);
        await using var stream = client.GetStream();
        await stream.WriteAsync(Encoding.ASCII.GetBytes("GET /api/events HTTP/1.1\r\nHost: localhost\r\n\r\n"));
        await stream.FlushAsync();

        using var reader = new StreamReader(stream, Encoding.UTF8, leaveOpen: true);
        string? line;
        do
        {
            line = await reader.ReadLineAsync();
        } while (line is not null && !line.StartsWith("data: ", StringComparison.Ordinal));

        Assert.NotNull(line);
        using var state = JsonDocument.Parse(line!["data: ".Length..]);
        Assert.True(state.RootElement.GetProperty("remoteControlOnly").GetBoolean());
        Assert.Equal(string.Empty, state.RootElement.GetProperty("streamUrl").GetString());
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
        await client.ConnectAsync(IPAddress.Loopback, port);
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
        await client.ConnectAsync(IPAddress.Loopback, port);
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
        await client.ConnectAsync(IPAddress.Loopback, port);
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
        await client.ConnectAsync(IPAddress.Loopback, port);
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
        await client.ConnectAsync(IPAddress.Loopback, port);
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
        await client.ConnectAsync(IPAddress.Loopback, port);
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
