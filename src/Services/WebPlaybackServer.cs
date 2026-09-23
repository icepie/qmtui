using System.Collections.Concurrent;
using System.Globalization;
using System.IO.Compression;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Channels;
using QmTui.Models;
using QmTui.UI;
using QmTui.Utils;

namespace QmTui.Services;

/// <summary>
/// Web 播放与协同控制服务
/// </summary>
public sealed partial class WebPlaybackServer : IDisposable
{
    private sealed class WebSocketClient : IDisposable
    {
        public TcpClient Client { get; }
        public WebSocket Socket { get; }
        public Channel<string> Channel { get; }
        public CancellationTokenSource Cts { get; }

        public WebSocketClient(TcpClient client, WebSocket socket, CancellationToken parentToken)
        {
            Client = client;
            Socket = socket;
            Channel = System.Threading.Channels.Channel.CreateBounded<string>(new BoundedChannelOptions(32)
            {
                FullMode = BoundedChannelFullMode.DropOldest,
                SingleReader = true,
                SingleWriter = false
            });
            Cts = CancellationTokenSource.CreateLinkedTokenSource(parentToken);
        }

        public void Dispose()
        {
            try { Cts.Cancel(); } catch { }
            try { Cts.Dispose(); } catch { }
            try { Socket.Dispose(); } catch { }
            try { Client.Dispose(); } catch { }
        }
    }

    private TcpListener? _listener;
    private CancellationTokenSource? _cts;
    private readonly object _lock = new();
    private bool _isDisposed;

    private readonly List<WebSocketClient> _wsClients = new();
    private readonly object _wsLock = new();

    public int Port { get; private set; }
    public string LocalUrl => Port > 0 ? $"http://0.0.0.0:{Port}/" : "";
    public string DisplayUrl => Port > 0 ? $"http://{GetLocalLanIp() ?? "127.0.0.1"}:{Port}/" : "";
    public bool IsRunning => _listener != null && !_isDisposed && (_cts?.IsCancellationRequested == false);

    public static string? GetLocalLanIp()
    {
        try
        {
            using var socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, 0);
            socket.Connect("223.5.5.5", 65530);
            if (socket.LocalEndPoint is IPEndPoint endPoint && !IPAddress.IsLoopback(endPoint.Address))
            {
                return endPoint.Address.ToString();
            }
        }
        catch {}

        try
        {
            string? fallbackIp = null;
            foreach (var ni in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (ni.OperationalStatus != OperationalStatus.Up ||
                    ni.NetworkInterfaceType == NetworkInterfaceType.Loopback)
                {
                    continue;
                }

                var ipProps = ni.GetIPProperties();
                foreach (var unicast in ipProps.UnicastAddresses)
                {
                    if (unicast.Address.AddressFamily != AddressFamily.InterNetwork ||
                        IPAddress.IsLoopback(unicast.Address))
                    {
                        continue;
                    }

                    var ipStr = unicast.Address.ToString();
                    if (ipStr.StartsWith("169.254.", StringComparison.Ordinal))
                    {
                        continue;
                    }

                    if (ipStr.StartsWith("192.168.", StringComparison.Ordinal) ||
                        ipStr.StartsWith("10.", StringComparison.Ordinal) ||
                        (ipStr.StartsWith("172.", StringComparison.Ordinal) &&
                         int.TryParse(ipStr.Split('.')[1], out var second) && second is >= 16 and <= 31))
                    {
                        return ipStr;
                    }

                    fallbackIp ??= ipStr;
                }
            }

            if (!string.IsNullOrEmpty(fallbackIp))
            {
                return fallbackIp;
            }
        }
        catch {}

        return null;
    }

    // 当前状态
    public Song? CurrentSong { get; set; }
    public List<LyricLine>? CurrentLyrics { get; set; }
    public string? CurrentPlayUrl { get; set; }
    public double TotalDurationSeconds { get; set; }
    public double CurrentPositionSeconds { get; set; }
    public bool IsPlaying { get; set; }
    public int Volume { get; set; } = 80;
    public bool AudioOutputEnabled { get; set; } = true;
    public bool IsCurrentSongFavorite { get; set; }

    /// <summary>
    /// 收藏歌曲 mid/id 集合的提供者（由宿主在集合锁内复制一份）；返回 null 表示尚未同步完成，
    /// 此时不对外暴露，避免前端把“还没拉到”当成“未收藏”。行内“喜欢”状态依据这份集合渲染。
    /// </summary>
    public Func<(List<string> Mids, List<long> Ids)?>? FavoriteKeysProvider { get; set; }
    public PlaybackMode CurrentPlaybackMode { get; set; } = PlaybackMode.ListLoop;
    public AudioQualityTier PreferredQualityTier { get; set; } = AudioQualityTier.SQ;
    public AudioQualityTier ActualQualityTier { get; set; } = AudioQualityTier.SQ;
    public IReadOnlyList<QualityOption>? AvailableQualities { get; set; }
    /// <summary>
    /// When enabled, the browser is a state display and remote control only; it never receives an audio stream.
    /// </summary>
    public bool RemoteControlOnly { get; private set; }


    // 回调事件
    public event Action? NextRequested;
    public event Action? PreviousRequested;
    public event Action? TogglePlayRequested;
    public event Action? ToggleFavoriteRequested;
    public event Action? ToggleModeRequested;
    /// <summary>直接指定播放模式（设置面板用；ToggleModeRequested 只做轮换）。</summary>
    public event Action<PlaybackMode>? ModeRequested;
    public event Action? ToggleQualityRequested;
    public event Action<AudioQualityTier>? QualityRequested;
    public event Action? PlaybackEnded;
    /// <summary>把歌曲加入播放队列(bool = true 表示插到下一首,false 表示追加到队尾)。</summary>
    public event Action<Song, bool>? QueueAddRequested;
    /// <summary>清空播放队列中待播的歌曲（保留当前播放曲目），对应播放队列抽屉的垃圾桶。</summary>
    public event Action? QueueClearRequested;
    public event Action<double>? SeekRequested;
    public event Action<int>? VolumeRequested;
    public event Action<double, double>? ProgressReported;
    public event Action<bool>? AudioOutputToggled;
    public event Action? AllClientsDisconnected;

    public event Action<WebLibraryPlayRequest>? LibraryPlayRequested;

    public bool Start(int preferredPort = 9999, bool initialAudioOutput = true, bool remoteControlOnly = false)
    {
        lock (_lock)
        {
            if (_isDisposed) return false;
            if (IsRunning) return true;

            RemoteControlOnly = remoteControlOnly;
            AudioOutputEnabled = initialAudioOutput;
            _cts = new CancellationTokenSource();

            try
            {
                _listener = new TcpListener(IPAddress.Any, preferredPort);
                try { _listener.Server.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true); } catch {}
                _listener.Start(128);
                Port = preferredPort;
                AppLogger.Info("WebPlaybackServer", $"Started Web playback server on preferred port {Port}");
            }
            catch (Exception ex)
            {
                AppLogger.Info("WebPlaybackServer", $"Preferred port {preferredPort} unavailable ({ex.Message}), falling back to dynamic port");
                try
                {
                    _listener = new TcpListener(IPAddress.Any, 0);
                    try { _listener.Server.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true); } catch {}
                    _listener.Start(128);
                    Port = ((IPEndPoint)_listener.LocalEndpoint).Port;
                    AppLogger.Info("WebPlaybackServer", $"Started Web playback server on dynamic port {Port}");
                }
                catch (Exception fallbackEx)
                {
                    AppLogger.Error("WebPlaybackServer", "Failed to start Web playback listener on dynamic port", fallbackEx);
                    _listener = null;
                    return false;
                }
            }

            _ = Task.Run(() => AcceptLoopAsync(_cts.Token));
            return true;
        }
    }

    private async Task AcceptLoopAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested && _listener != null)
        {
            try
            {
                var client = await _listener.AcceptTcpClientAsync(ct).ConfigureAwait(false);
                _ = Task.Run(() => HandleClientAsync(client, ct), ct);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (ObjectDisposedException)
            {
                break;
            }
            catch (Exception ex)
            {
                if (!ct.IsCancellationRequested)
                {
                    AppLogger.Error("WebPlaybackServer", "AcceptTcpClient exception", ex);
                    try
                    {
                        await Task.Delay(100, ct).ConfigureAwait(false);
                    }
                    catch (OperationCanceledException)
                    {
                        break;
                    }
                }
            }
        }
    }

    private async Task HandleClientAsync(TcpClient client, CancellationToken ct)
    {
        try
        {
            client.NoDelay = true;
            client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.KeepAlive, true);
            client.LingerState = new LingerOption(enable: false, seconds: 0);
        }
        catch {}

        bool keepAliveForWebSocket = false;
        var stream = client.GetStream();

        try
        {
            byte[] buffer = new byte[4096];
            using var readTimeoutCts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            readTimeoutCts.CancelAfter(TimeSpan.FromSeconds(5));

            int bytesRead;
            try
            {
                bytesRead = await stream.ReadAsync(buffer.AsMemory(0, buffer.Length), readTimeoutCts.Token).ConfigureAwait(false);
            }
            catch (OperationCanceledException) when (!ct.IsCancellationRequested)
            {
                return;
            }

            if (bytesRead <= 0) return;

            string requestText = Encoding.UTF8.GetString(buffer, 0, bytesRead);
            var headerEnd = requestText.IndexOf("\r\n\r\n", StringComparison.Ordinal);
            if (headerEnd < 0) return;
            string headerPart = requestText[..headerEnd];
            string bodyPart = "";

            string[] lines = headerPart.Split("\r\n");
            if (lines.Length == 0) return;

            string firstLine = lines[0];
            string[] parts = firstLine.Split(' ');
            if (parts.Length < 2) return;

            string method = parts[0].ToUpperInvariant();
            string rawPath = parts[1];
            string path = rawPath.Split('?')[0];

            int contentLength = 0;
            // Extract request metadata needed by byte-sensitive request bodies.
            string? rangeHeader = null;
            string? webSocketKey = null;
            foreach (var line in lines)
            {
                if (line.StartsWith("Range:", StringComparison.OrdinalIgnoreCase))
                {
                    rangeHeader = line["Range:".Length..].Trim();
                }
                else if (line.StartsWith("Content-Length:", StringComparison.OrdinalIgnoreCase))
                {
                    int.TryParse(line["Content-Length:".Length..].Trim(), out contentLength);
                }
                else if (line.StartsWith("Sec-WebSocket-Key:", StringComparison.OrdinalIgnoreCase))
                {
                    webSocketKey = line["Sec-WebSocket-Key:".Length..].Trim();
                }
                else if (line.StartsWith("Accept-Encoding:", StringComparison.OrdinalIgnoreCase))
                {
                    RequestPreferences.AcceptEncoding = line["Accept-Encoding:".Length..].Trim();
                }
                else if (line.StartsWith("If-None-Match:", StringComparison.OrdinalIgnoreCase))
                {
                    RequestPreferences.IfNoneMatch = line["If-None-Match:".Length..].Trim();
                }
            }

            if (method == "POST" && contentLength > 0)
            {
                const int maxRequestBodyBytes = 512 * 1024;
                if (contentLength > maxRequestBodyBytes)
                {
                    await SendResponseAsync(stream, 413, "Payload Too Large", "application/json", "{\"error\":\"request body too large\"}", ct).ConfigureAwait(false);
                    return;
                }

                var bodyBytes = new byte[contentLength];
                int bodyOffset = headerEnd + 4;
                int copied = Math.Min(contentLength, bytesRead - bodyOffset);
                if (copied > 0)
                {
                    buffer.AsSpan(bodyOffset, copied).CopyTo(bodyBytes);
                }

                while (copied < contentLength)
                {
                    int read = await stream.ReadAsync(bodyBytes.AsMemory(copied, contentLength - copied), readTimeoutCts.Token).ConfigureAwait(false);
                    if (read == 0) return;
                    copied += read;
                }

                bodyPart = Encoding.UTF8.GetString(bodyBytes);
            }

            // 纯读取的列表/详情接口允许 60 秒短缓存；收藏态这类会立刻变化的端点直接跳过缓存。
            if (method == "GET" &&
                (path.StartsWith("/api/library/", StringComparison.Ordinal) || path.StartsWith("/api/singer/", StringComparison.Ordinal)) &&
                path != "/api/library/playlist/favorite" &&
                path != "/api/singer/favorite")
            {
                RequestPreferences.CacheKey = rawPath;
            }

            if (method == "GET" && RequestPreferences.CacheKey != null &&
                await TrySendCachedLibraryJsonAsync(stream, ct).ConfigureAwait(false))
            {
                return;
            }

            if (method == "GET")
            {
                // 带 ?v=<构建版本> 的 URL 与 vite 产物目录（文件名内含内容哈希）可以长缓存：
                // 内容变化必然伴随 URL 变化，见 scripts/build-web.mjs 的全局版本号。
                bool versionedAsset = rawPath.Contains("?v=", StringComparison.Ordinal);

                if (path == "/" || path == "/index.html")
                {
                    await SendAssetAsync(stream, "qqmusic/index.html", "text/html; charset=utf-8", immutable: false, ct).ConfigureAwait(false);
                }
                else if (path == "/amll" || path == "/amll/" || path == "/amll/index.html")
                {
                    // 独立的 Apple Music 风格歌词页（AMLL 渲染内核），与主界面互不影响。
                    await SendAssetAsync(stream, "amll/index.html", "text/html; charset=utf-8", immutable: false, ct).ConfigureAwait(false);
                }
                else if (path.StartsWith("/amll/", StringComparison.Ordinal))
                {
                    // 无扩展名即 SPA 路由（/amll/settings、/amll/playlist/123），回退到入口页。
                    bool spaRoute = !Path.HasExtension(path);
                    bool immutable = !spaRoute && path.StartsWith("/amll/assets/", StringComparison.Ordinal);
                    await SendAssetAsync(
                        stream,
                        path.TrimStart('/'),
                        spaRoute ? "text/html; charset=utf-8" : GetStaticContentType(path),
                        immutable,
                        ct,
                        fallbackKey: spaRoute ? "amll/index.html" : null).ConfigureAwait(false);
                }
                else if (path.StartsWith("/assets/", StringComparison.Ordinal) ||
                         path.EndsWith(".js", StringComparison.OrdinalIgnoreCase) ||
                         path.EndsWith(".css", StringComparison.OrdinalIgnoreCase))
                {
                    string relativePath = path.TrimStart('/');
                    await SendAssetAsync(stream, $"qqmusic/{relativePath}", GetStaticContentType(path), versionedAsset, ct).ConfigureAwait(false);
                }
                else if (path == "/cover")
                {
                    await HandleCoverRequestAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/stream/audio")
                {
                    await HandleAudioStreamAsync(stream, rangeHeader, ct).ConfigureAwait(false);
                }
                else if (path == "/api/ws")
                {
                    keepAliveForWebSocket = true;
                    await HandleWebSocketEventsAsync(client, stream, webSocketKey, ct).ConfigureAwait(false);
                    return;
                }
                else if (path == "/api/account")
                {
                    await HandleAccountAsync(stream, ct).ConfigureAwait(false);
                }
                else if (path == "/api/login/status")
                {
                    await HandleLoginStatusAsync(stream, ct).ConfigureAwait(false);
                }
                else if (path == "/api/browser/noop")
                {
                    await SendResponseAsync(stream, 200, "OK", "application/json", "{\"code\":0}", ct).ConfigureAwait(false);
                }
                else if (path == "/api/browser/ufetch")
                {
                    // bundle 里对 c.y.qq.com 的 GET 也会被改写到这里（原 URL 在 query 里）
                    await HandleBrowserUfetchAsync(stream, rawPath, string.Empty, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/search")
                {
                    await HandleLibrarySearchAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/search/playlists")
                {
                    await HandleLibraryPlaylistSearchAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/search/albums")
                {
                    await HandleLibraryAlbumSearchAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/search/singers")
                {
                    await HandleSingerSearchAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/recommend/daily")
                {
                    await HandleDailyRecommendationsAsync(stream, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/recommend/guess")
                {
                    await HandleGuessRecommendationsAsync(stream, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/favorites/songs")
                {
                    await HandleFavoriteSongsAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/favorites/ids")
                {
                    await HandleFavoriteKeysAsync(stream, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/playlists")
                {
                    await HandleLibraryPlaylistsAsync(stream, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/local")
                {
                    await HandleLibraryLocalSongsAsync(stream, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/playlist")
                {
                    await HandleLibraryPlaylistAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/playlist/favorite")
                {
                    await HandlePlaylistFavoriteStateAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/album")
                {
                    await HandleLibraryAlbumAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/library/albums/favorite")
                {
                    await HandleFavoriteAlbumsAsync(stream, ct).ConfigureAwait(false);
                }
                else if (path == "/api/comments")
                {
                    await HandleCommentsAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/singer/detail")
                {
                    await HandleSingerDetailAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/singer/songs")
                {
                    await HandleSingerSongsAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/singer/albums")
                {
                    await HandleSingerAlbumsAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else if (path == "/api/singer/favorite")
                {
                    await HandleSingerFavoriteStateAsync(stream, rawPath, ct).ConfigureAwait(false);
                }
                else
                {
                    await SendResponseAsync(stream, 404, "Not Found", "text/plain", "Not Found", ct).ConfigureAwait(false);
                }
            }
                else if (method == "POST")
                {
                    // 写操作一律让读缓存失效；换账号同样会改变可见曲库。
                    if (path.StartsWith("/api/library/", StringComparison.Ordinal) ||
                        path == "/api/logout" ||
                        path == "/api/login/cookie")
                    {
                        InvalidateLibraryReadCache();
                    }

                    if (path == "/api/browser/noop")
                    {
                        await SendResponseAsync(stream, 200, "OK", "application/json", "{\"code\":0}", ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/browser/ufetch")
                    {
                        await HandleBrowserUfetchAsync(stream, rawPath, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/action")
                    {
                        HandleApiAction(bodyPart);
                        await SendResponseAsync(stream, 200, "OK", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/toggle")
                    {
                        TogglePlayRequested?.Invoke();
                        await SendResponseAsync(stream, 200, "OK", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/favorite")
                    {
                        ToggleFavoriteRequested?.Invoke();
                        await SendResponseAsync(stream, 202, "Accepted", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/mode")
                    {
                        ToggleModeRequested?.Invoke();
                        await SendResponseAsync(stream, 200, "OK", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/quality")
                    {
                        AudioQualityTier? requestedTier = null;
                        try
                        {
                            using var doc = JsonDocument.Parse(bodyPart);
                            if (doc.RootElement.TryGetProperty("tier", out var tierProp) && tierProp.TryGetInt32(out var tierValue) &&
                                Enum.IsDefined(typeof(AudioQualityTier), tierValue))
                            {
                                requestedTier = (AudioQualityTier)tierValue;
                            }
                        }
                        catch (JsonException) when (string.IsNullOrWhiteSpace(bodyPart))
                        {
                        }

                        if (requestedTier.HasValue)
                        {
                            QualityRequested?.Invoke(requestedTier.Value);
                        }
                        else
                        {
                            ToggleQualityRequested?.Invoke();
                        }
                        await SendResponseAsync(stream, 202, "Accepted", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/next")
                    {
                        NextRequested?.Invoke();
                        await SendResponseAsync(stream, 200, "OK", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/previous" || path == "/api/prev")
                    {
                        PreviousRequested?.Invoke();
                        await SendResponseAsync(stream, 200, "OK", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/seek")
                    {
                        double targetPos = 0;
                        var queryIndex = rawPath.IndexOf("pos=", StringComparison.OrdinalIgnoreCase);
                        if (queryIndex >= 0)
                        {
                            var posStr = rawPath[(queryIndex + 4)..].Split('&')[0];
                            double.TryParse(posStr, System.Globalization.CultureInfo.InvariantCulture, out targetPos);
                        }
                        else if (!string.IsNullOrWhiteSpace(bodyPart) && bodyPart.Contains("position"))
                        {
                            try
                            {
                                using var doc = JsonDocument.Parse(bodyPart);
                                if (doc.RootElement.TryGetProperty("position", out var pProp)) targetPos = pProp.GetDouble();
                            }
                            catch {}
                        }
                        SeekRequested?.Invoke(targetPos);
                        await SendResponseAsync(stream, 200, "OK", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/progress")
                    {
                        HandleApiProgress(bodyPart);
                        await SendResponseAsync(stream, 200, "OK", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/library/play")
                    {
                        await HandleLibraryPlayAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/queue/add")
                    {
                        await HandleQueueAddAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/queue/clear")
                    {
                        await HandleQueueClearAsync(stream, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/download")
                    {
                        await HandleDownloadAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/login/start")
                    {
                        await HandleLoginStartAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/login/cookie")
                    {
                        await HandleCookieLoginAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/logout")
                    {
                        await HandleLogoutAsync(stream, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/library/playlist/create")
                    {
                        await HandleCreatePlaylistAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/library/playlist/delete")
                    {
                        await HandleDeletePlaylistAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/library/playlist/favorite")
                    {
                        await HandlePlaylistFavoriteMutationAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/library/song/favorite")
                    {
                        await HandleSongFavoriteMutationAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/singer/favorite")
                    {
                        await HandleSingerFavoriteMutationAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/library/playlist/song/add")
                    {
                        await HandlePlaylistSongMutationAsync(stream, bodyPart, add: true, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/library/playlist/song/remove")
                    {
                        await HandlePlaylistSongMutationAsync(stream, bodyPart, add: false, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/library/album/favorite")
                    {
                        await HandleAlbumFavoriteMutationAsync(stream, bodyPart, add: true, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/library/album/unfavorite")
                    {
                        await HandleAlbumFavoriteMutationAsync(stream, bodyPart, add: false, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/comments/add")
                    {
                        await HandleAddCommentAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else if (path == "/api/comments/delete")
                    {
                        await HandleDeleteCommentAsync(stream, bodyPart, ct).ConfigureAwait(false);
                    }
                    else
                    {
                        await SendResponseAsync(stream, 404, "Not Found", "text/plain", "Not Found", ct).ConfigureAwait(false);
                    }
                }
                else if (method == "OPTIONS")
                {
                    await SendCorsHeadersAsync(stream, ct).ConfigureAwait(false);
                }
                else
                {
                    await SendResponseAsync(stream, 405, "Method Not Allowed", "text/plain", "Method Not Allowed", ct).ConfigureAwait(false);
                }
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                AppLogger.Debug("WebPlaybackServer", $"Client socket handling finished: {ex.Message}");
            }
            finally
            {
                if (!keepAliveForWebSocket)
                {
                    try { stream.Dispose(); } catch {}
                    try { client.Dispose(); } catch {}
                }
            }
        }

    private async Task HandleCoverRequestAsync(NetworkStream stream, string rawPath, CancellationToken ct)
    {
        string? mid = null;
        string? albumMid = null;

        var qIdx = rawPath.IndexOf('?');
        if (qIdx >= 0 && qIdx + 1 < rawPath.Length)
        {
            var qs = rawPath[(qIdx + 1)..].Split('&');
            foreach (var param in qs)
            {
                var kv = param.Split('=');
                if (kv.Length == 2)
                {
                    var k = kv[0];
                    var v = Uri.UnescapeDataString(kv[1]);
                    if (k.Equals("mid", StringComparison.OrdinalIgnoreCase)) mid = v;
                    else if (k.Equals("albumMid", StringComparison.OrdinalIgnoreCase)) albumMid = v;
                }
            }
        }

        string? coverFile = null;
        try
        {
            if (!string.IsNullOrWhiteSpace(albumMid))
            {
                coverFile = await TerminalImageHelper.EnsureAlbumCoverAsync(albumMid, ct).ConfigureAwait(false);
            }

            if (string.IsNullOrEmpty(coverFile) && CurrentSong != null)
            {
                coverFile = await TerminalImageHelper.EnsureSongCoverAsync(CurrentSong, ct).ConfigureAwait(false);
            }

            if (string.IsNullOrEmpty(coverFile) && !string.IsNullOrWhiteSpace(mid))
            {
                var tempSong = new Song(mid, "", "", "", 0, AlbumMid: albumMid ?? "");
                coverFile = await TerminalImageHelper.EnsureSongCoverAsync(tempSong, ct).ConfigureAwait(false);
            }
        }
        catch (Exception ex)
        {
            AppLogger.Debug("WebPlaybackServer", $"EnsureSongCoverAsync exception: {ex.Message}");
        }

        if (!string.IsNullOrEmpty(coverFile) && File.Exists(coverFile))
        {
            try
            {
                byte[] bytes = await File.ReadAllBytesAsync(coverFile, ct).ConfigureAwait(false);
                string contentType = coverFile.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ? "image/png" : "image/jpeg";
                
                string headers = $"HTTP/1.1 200 OK\r\n" +
                                 $"Content-Type: {contentType}\r\n" +
                                 $"Content-Length: {bytes.Length}\r\n" +
                                 $"Cache-Control: public, max-age=86400\r\n" +
                                 $"Access-Control-Allow-Origin: *\r\n" +
                                 $"Connection: close\r\n\r\n";
                byte[] headerBytes = Encoding.ASCII.GetBytes(headers);
                await stream.WriteAsync(headerBytes.AsMemory(0, headerBytes.Length), ct).ConfigureAwait(false);
                await stream.WriteAsync(bytes.AsMemory(0, bytes.Length), ct).ConfigureAwait(false);
                await stream.FlushAsync(ct).ConfigureAwait(false);
                return;
            }
            catch (Exception ex)
            {
                AppLogger.Debug("WebPlaybackServer", $"Failed to read cover file: {ex.Message}");
            }
        }

        await SendResponseAsync(stream, 404, "Not Found", "text/plain", "Cover not available", ct).ConfigureAwait(false);
    }

    private async Task HandleAudioStreamAsync(NetworkStream stream, string? rangeHeader, CancellationToken ct)
    {
        string? url = CurrentPlayUrl;
        if (string.IsNullOrEmpty(url))
        {
            await SendResponseAsync(stream, 404, "Not Found", "text/plain", "No audio URL", ct).ConfigureAwait(false);
            return;
        }

        // WebDAV 歌曲处理：若本地已有完整缓存，直接输出本地文件；否则服务端透明代理转发 WebDAV 流
        if (CurrentSong?.IsWebDav == true)
        {
            var server = WebDavService.GetActiveServer();
            if (server != null && !string.IsNullOrEmpty(CurrentSong.WebDavHref))
            {
                var localCache = WebDavService.GetLocalCachePath(server, CurrentSong.WebDavHref);
                if (File.Exists(localCache) && new FileInfo(localCache).Length > 4096)
                {
                    url = localCache;
                }
                else
                {
                    await ProxyWebDavStreamAsync(stream, server, CurrentSong.WebDavHref, rangeHeader, ct).ConfigureAwait(false);
                    return;
                }
            }
        }

        // 携带嵌入凭据的远程地址严禁直接重定向给浏览器
        if ((url.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || url.StartsWith("https://", StringComparison.OrdinalIgnoreCase)) && !url.Contains('@'))
        {
            await SendRedirectAsync(stream, url, ct).ConfigureAwait(false);
            return;
        }

        string filePath = url.StartsWith("file://", StringComparison.OrdinalIgnoreCase) ? new Uri(url).LocalPath : url;
        if (!File.Exists(filePath))
        {
            await SendResponseAsync(stream, 404, "Not Found", "text/plain", "Local file not found", ct).ConfigureAwait(false);
            return;
        }

        var fileInfo = new FileInfo(filePath);
        long totalLength = fileInfo.Length;
        long start = 0;
        long end = totalLength - 1;
        bool isRange = false;

        if (!string.IsNullOrEmpty(rangeHeader) && rangeHeader.StartsWith("bytes=", StringComparison.OrdinalIgnoreCase))
        {
            var rangeSpec = rangeHeader["bytes=".Length..].Trim();
            var parts = rangeSpec.Split('-');
            if (long.TryParse(parts[0], out var s))
            {
                start = Math.Clamp(s, 0, totalLength - 1);
            }
            if (parts.Length > 1 && long.TryParse(parts[1], out var e))
            {
                end = Math.Clamp(e, start, totalLength - 1);
            }
            isRange = true;
        }

        long contentLength = end - start + 1;
        string contentType = filePath.EndsWith(".flac", StringComparison.OrdinalIgnoreCase) ? "audio/flac"
                           : filePath.EndsWith(".ogg", StringComparison.OrdinalIgnoreCase) ? "audio/ogg"
                           : filePath.EndsWith(".m4a", StringComparison.OrdinalIgnoreCase) ? "audio/mp4"
                           : filePath.EndsWith(".wav", StringComparison.OrdinalIgnoreCase) ? "audio/wav"
                           : "audio/mpeg";

        int statusCode = isRange ? 206 : 200;
        string statusText = isRange ? "Partial Content" : "OK";

        string headers = $"HTTP/1.1 {statusCode} {statusText}\r\n" +
                         $"Content-Type: {contentType}\r\n" +
                         $"Accept-Ranges: bytes\r\n" +
                         (isRange ? $"Content-Range: bytes {start}-{end}/{totalLength}\r\n" : "") +
                         $"Content-Length: {contentLength}\r\n" +
                         $"Access-Control-Allow-Origin: *\r\n" +
                         $"Connection: close\r\n\r\n";

        byte[] headerBytes = Encoding.ASCII.GetBytes(headers);
        await stream.WriteAsync(headerBytes.AsMemory(0, headerBytes.Length), ct).ConfigureAwait(false);

        using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 64 * 1024, useAsync: true);
        if (start > 0)
        {
            fs.Seek(start, SeekOrigin.Begin);
        }

        byte[] chunk = new byte[64 * 1024];
        long remaining = contentLength;
        while (remaining > 0 && !ct.IsCancellationRequested)
        {
            int toRead = (int)Math.Min(chunk.Length, remaining);
            int bytesRead = await fs.ReadAsync(chunk.AsMemory(0, toRead), ct).ConfigureAwait(false);
            if (bytesRead <= 0) break;
            await stream.WriteAsync(chunk.AsMemory(0, bytesRead), ct).ConfigureAwait(false);
            remaining -= bytesRead;
        }
        await stream.FlushAsync(ct).ConfigureAwait(false);
    }

    private static async Task ProxyWebDavStreamAsync(NetworkStream stream, WebDavServer server, string relativeHref, string? rangeHeader, CancellationToken ct)
    {
        try
        {
            using var resp = await WebDavService.OpenAudioStreamAsync(server, relativeHref, rangeHeader, ct).ConfigureAwait(false);
            if (!resp.IsSuccessStatusCode && resp.StatusCode != HttpStatusCode.PartialContent)
            {
                await SendResponseAsync(stream, (int)resp.StatusCode, resp.ReasonPhrase ?? "WebDAV Error", "text/plain", $"WebDAV server returned {resp.StatusCode}", ct).ConfigureAwait(false);
                return;
            }

            int statusCode = (int)resp.StatusCode;
            string statusText = resp.ReasonPhrase ?? (statusCode == 206 ? "Partial Content" : "OK");
            string contentType = resp.Content.Headers.ContentType?.ToString() ?? "audio/mpeg";
            long? contentLength = resp.Content.Headers.ContentLength;
            string? contentRange = resp.Content.Headers.ContentRange?.ToString();

            var sb = new StringBuilder();
            sb.Append($"HTTP/1.1 {statusCode} {statusText}\r\n");
            sb.Append($"Content-Type: {contentType}\r\n");
            sb.Append("Accept-Ranges: bytes\r\n");
            if (!string.IsNullOrEmpty(contentRange))
            {
                sb.Append($"Content-Range: {contentRange}\r\n");
            }
            if (contentLength.HasValue)
            {
                sb.Append($"Content-Length: {contentLength.Value}\r\n");
            }
            sb.Append("Access-Control-Allow-Origin: *\r\n");
            sb.Append("Connection: close\r\n\r\n");

            byte[] headerBytes = Encoding.ASCII.GetBytes(sb.ToString());
            await stream.WriteAsync(headerBytes.AsMemory(0, headerBytes.Length), ct).ConfigureAwait(false);

            await using var remoteStream = await resp.Content.ReadAsStreamAsync(ct).ConfigureAwait(false);
            byte[] chunk = new byte[64 * 1024];
            int bytesRead;
            while ((bytesRead = await remoteStream.ReadAsync(chunk.AsMemory(0, chunk.Length), ct).ConfigureAwait(false)) > 0)
            {
                if (ct.IsCancellationRequested) break;
                await stream.WriteAsync(chunk.AsMemory(0, bytesRead), ct).ConfigureAwait(false);
            }
            await stream.FlushAsync(ct).ConfigureAwait(false);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            AppLogger.Warn("WebPlaybackServer", $"ProxyWebDavStreamAsync error: {ex.Message}");
        }
    }

    /// <summary>
    /// 当前连接的响应协商信息（Accept-Encoding / If-None-Match / 读缓存键）。
    /// 每个连接一个独立 Task，用 AsyncLocal 传递即可，无需给几十个 handler 逐个加参数。
    /// </summary>
    private static class RequestPreferences
    {
        private static readonly AsyncLocal<string?> s_acceptEncoding = new();
        private static readonly AsyncLocal<string?> s_ifNoneMatch = new();
        private static readonly AsyncLocal<string?> s_cacheKey = new();

        public static string? AcceptEncoding
        {
            get => s_acceptEncoding.Value;
            set => s_acceptEncoding.Value = value;
        }

        public static string? IfNoneMatch
        {
            get => s_ifNoneMatch.Value;
            set => s_ifNoneMatch.Value = value;
        }

        /// <summary>非 null 表示这个 GET 的响应可以按原样路径（含查询串）进短缓存。</summary>
        public static string? CacheKey
        {
            get => s_cacheKey.Value;
            set => s_cacheKey.Value = value;
        }
    }

    /// <summary>
    /// 构建产物在进程生命周期内不会变化，按资源键缓存原文、ETag 与压缩结果：
    /// 免去每个请求重复读盘（在线曲库页首屏有近百个资源），压缩也只做一次。
    /// </summary>
    private sealed class StaticAsset
    {
        private readonly Lazy<byte[]> _gzip;
        private readonly Lazy<byte[]> _brotli;

        public StaticAsset(byte[] raw, string contentType)
        {
            Raw = raw;
            ContentType = contentType;
            // ETag 取内容摘要：构建产物同名不同内容时仍能正确失效。
            ETag = '"' + Convert.ToHexString(SHA256.HashData(raw).AsSpan(0, 8)) + '"';
            _gzip = new Lazy<byte[]>(() => Compress(raw, brotli: false), LazyThreadSafetyMode.ExecutionAndPublication);
            _brotli = new Lazy<byte[]>(() => Compress(raw, brotli: true), LazyThreadSafetyMode.ExecutionAndPublication);
        }

        public byte[] Raw { get; }
        public string ContentType { get; }
        public string ETag { get; }
        public byte[] Gzip => _gzip.Value;
        public byte[] Brotli => _brotli.Value;
    }

    private const int MinCompressibleBytes = 1024;

    private static readonly ConcurrentDictionary<string, StaticAsset> s_staticAssets = new(StringComparer.Ordinal);

    private static StaticAsset? LoadStaticAsset(string assetKey, string contentType)
    {
        if (s_staticAssets.TryGetValue(assetKey, out var cached)) return cached;

        byte[] raw = StaticResourceHelper.LoadStaticBytes(assetKey);
        // 未命中不落缓存：部署时新增的文件不应被一次早期请求钉死。
        if (raw.Length == 0) return null;

        var asset = new StaticAsset(raw, contentType);
        s_staticAssets[assetKey] = asset;
        return asset;
    }

    private static byte[] Compress(byte[] data, bool brotli)
    {
        using var output = new MemoryStream(Math.Max(64, data.Length / 4));
        using (Stream compressor = brotli
                   ? new BrotliStream(output, CompressionLevel.Fastest, leaveOpen: true)
                   : new GZipStream(output, CompressionLevel.Fastest, leaveOpen: true))
        {
            compressor.Write(data, 0, data.Length);
        }
        return output.ToArray();
    }

    /// <summary>按扩展名判断是否值得压缩；图片/字体已经是压缩格式，再套一层只会更大。</summary>
    private static bool IsCompressible(string contentType) =>
        contentType.StartsWith("text/", StringComparison.OrdinalIgnoreCase) ||
        contentType.StartsWith("application/javascript", StringComparison.OrdinalIgnoreCase) ||
        contentType.StartsWith("application/json", StringComparison.OrdinalIgnoreCase) ||
        contentType.StartsWith("image/svg", StringComparison.OrdinalIgnoreCase);

    /// <summary>按 Accept-Encoding 逐个 token 比对（含 q=0 拒绝），避免 Contains("br") 这类误判。</summary>
    private static bool AcceptsEncoding(string? header, string token)
    {
        if (string.IsNullOrEmpty(header)) return false;

        foreach (var part in header.Split(','))
        {
            string[] segments = part.Split(';');
            if (!segments[0].Trim().Equals(token, StringComparison.OrdinalIgnoreCase)) continue;

            foreach (var parameter in segments.Skip(1))
            {
                string trimmed = parameter.Trim();
                if (trimmed.StartsWith("q=", StringComparison.OrdinalIgnoreCase) &&
                    double.TryParse(trimmed[2..], NumberStyles.Float, CultureInfo.InvariantCulture, out double quality) &&
                    quality <= 0)
                {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /// <summary>优先 brotli，其次 gzip；两者都没有或压缩后更大时返回原文。</summary>
    private static (byte[] Body, string? Encoding) NegotiateEncoding(string contentType, byte[] raw, Func<byte[]> gzip, Func<byte[]> brotli)
    {
        if (raw.Length < MinCompressibleBytes || !IsCompressible(contentType)) return (raw, null);

        string? accept = RequestPreferences.AcceptEncoding;
        byte[]? compressed = null;
        string? encoding = null;
        if (AcceptsEncoding(accept, "br")) { compressed = brotli(); encoding = "br"; }
        else if (AcceptsEncoding(accept, "gzip")) { compressed = gzip(); encoding = "gzip"; }

        return compressed != null && compressed.Length < raw.Length ? (compressed, encoding) : (raw, null);
    }

    private static async Task SendAssetAsync(NetworkStream stream, string assetKey, string contentType, bool immutable, CancellationToken ct, string? fallbackKey = null)
    {
        var asset = LoadStaticAsset(assetKey, contentType);
        if (asset == null && fallbackKey != null)
        {
            asset = LoadStaticAsset(fallbackKey, "text/html; charset=utf-8");
        }

        if (asset == null)
        {
            await SendResponseAsync(stream, 404, "Not Found", "text/plain", "Not Found", ct).ConfigureAwait(false);
            return;
        }

        string cacheControl = immutable ? "public, max-age=31536000, immutable" : "no-cache";
        string? ifNoneMatch = RequestPreferences.IfNoneMatch;
        if (!string.IsNullOrEmpty(ifNoneMatch) && ifNoneMatch.Contains(asset.ETag, StringComparison.Ordinal))
        {
            byte[] notModified = Encoding.ASCII.GetBytes(
                "HTTP/1.1 304 Not Modified\r\n" +
                $"ETag: {asset.ETag}\r\n" +
                $"Cache-Control: {cacheControl}\r\n" +
                "Access-Control-Allow-Origin: *\r\n" +
                "Connection: close\r\n\r\n");
            await stream.WriteAsync(notModified.AsMemory(), ct).ConfigureAwait(false);
            await stream.FlushAsync(ct).ConfigureAwait(false);
            return;
        }

        var (body, encoding) = NegotiateEncoding(asset.ContentType, asset.Raw, () => asset.Gzip, () => asset.Brotli);

        var sb = new StringBuilder(320);
        sb.Append("HTTP/1.1 200 OK\r\n");
        sb.Append("Content-Type: ").Append(asset.ContentType).Append("\r\n");
        sb.Append("Content-Length: ").Append(body.Length).Append("\r\n");
        sb.Append("ETag: ").Append(asset.ETag).Append("\r\n");
        sb.Append("Cache-Control: ").Append(cacheControl).Append("\r\n");
        if (encoding != null) sb.Append("Content-Encoding: ").Append(encoding).Append("\r\n");
        if (IsCompressible(asset.ContentType)) sb.Append("Vary: Accept-Encoding\r\n");
        sb.Append("Access-Control-Allow-Origin: *\r\n");
        sb.Append("Connection: close\r\n\r\n");

        byte[] headerBytes = Encoding.ASCII.GetBytes(sb.ToString());
        await stream.WriteAsync(headerBytes.AsMemory(), ct).ConfigureAwait(false);
        await stream.WriteAsync(body.AsMemory(), ct).ConfigureAwait(false);
        await stream.FlushAsync(ct).ConfigureAwait(false);
    }

    private static string GetStaticContentType(string path) => Path.GetExtension(path).ToLowerInvariant() switch
    {
        ".js" or ".mjs" => "application/javascript; charset=utf-8",
        ".css" => "text/css; charset=utf-8",
        ".html" or ".htm" => "text/html; charset=utf-8",
        ".json" or ".map" => "application/json; charset=utf-8",
        ".svg" => "image/svg+xml",
        ".png" => "image/png",
        ".jpg" or ".jpeg" => "image/jpeg",
        ".gif" => "image/gif",
        ".webp" => "image/webp",
        ".woff" => "font/woff",
        ".woff2" => "font/woff2",
        ".ttf" => "font/ttf",
        _ => "application/octet-stream"
    };

    private static async Task SendResponseAsync(NetworkStream stream, int statusCode, string statusText, string contentType, string content, CancellationToken ct)
    {
        byte[] body = Encoding.UTF8.GetBytes(content);
        var (encoded, encoding) = NegotiateEncoding(contentType, body, () => Compress(body, brotli: false), () => Compress(body, brotli: true));

        var sb = new StringBuilder(256);
        sb.Append("HTTP/1.1 ").Append(statusCode).Append(' ').Append(statusText).Append("\r\n");
        sb.Append("Content-Type: ").Append(contentType).Append("\r\n");
        sb.Append("Content-Length: ").Append(encoded.Length).Append("\r\n");
        sb.Append("Access-Control-Allow-Origin: *\r\n");
        sb.Append("Connection: close\r\n");
        if (encoding != null) sb.Append("Content-Encoding: ").Append(encoding).Append("\r\n");
        if (IsCompressible(contentType)) sb.Append("Vary: Accept-Encoding\r\n");
        sb.Append("Cache-Control: no-cache, no-store, must-revalidate\r\n\r\n");

        byte[] headerBytes = Encoding.ASCII.GetBytes(sb.ToString());
        await stream.WriteAsync(headerBytes.AsMemory(), ct).ConfigureAwait(false);
        await stream.WriteAsync(encoded.AsMemory(), ct).ConfigureAwait(false);
        await stream.FlushAsync(ct).ConfigureAwait(false);
    }

    private static async Task SendRedirectAsync(NetworkStream stream, string locationUrl, CancellationToken ct)
    {
        string headers = "HTTP/1.1 302 Found\r\n" +
                         $"Location: {locationUrl}\r\n" +
                         "Content-Length: 0\r\n" +
                         "Access-Control-Allow-Origin: *\r\n" +
                         "Connection: close\r\n\r\n";

        byte[] headerBytes = Encoding.ASCII.GetBytes(headers);
        await stream.WriteAsync(headerBytes.AsMemory(0, headerBytes.Length), ct).ConfigureAwait(false);
        await stream.FlushAsync(ct).ConfigureAwait(false);
    }

    private static async Task SendCorsHeadersAsync(NetworkStream stream, CancellationToken ct)
    {
        string headers = "HTTP/1.1 204 No Content\r\n" +
                         "Access-Control-Allow-Origin: *\r\n" +
                         "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n" +
                         "Access-Control-Allow-Headers: Content-Type, Range\r\n" +
                         "Connection: close\r\n\r\n";

        byte[] headerBytes = Encoding.ASCII.GetBytes(headers);
        await stream.WriteAsync(headerBytes.AsMemory(0, headerBytes.Length), ct).ConfigureAwait(false);
        await stream.FlushAsync(ct).ConfigureAwait(false);
    }



    public void Stop()
    {
        lock (_lock)
        {
            if (_listener == null) return;
            try
            {
                IsPlaying = false;
                BroadcastState("stop");
            }
            catch {}

            try
            {
                try { _loginCts?.Cancel(); } catch { }
                _cts?.Cancel();
            }
            catch {}

            lock (_wsLock)
            {
                foreach (var client in _wsClients)
                {
                    try { client.Dispose(); } catch {}
                }
                _wsClients.Clear();
            }

            try
            {
                _listener.Stop();
                AppLogger.Info("WebPlaybackServer", $"Stopped Web playback server on port {Port}");
            }
            catch (Exception ex)
            {
                AppLogger.Error("WebPlaybackServer", "Error stopping listener", ex);
            }
            finally
            {
                _listener = null;
                _cts?.Dispose();
                _cts = null;
                Port = 0;
            }
        }
    }

    public void Dispose()
    {
        lock (_lock)
        {
            if (_isDisposed) return;
            _isDisposed = true;
            Stop();
        }
    }
}
