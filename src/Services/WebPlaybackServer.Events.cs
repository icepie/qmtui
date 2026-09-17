using System.Net.Sockets;
using System.Net.WebSockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using QmTui.Models;
using QmTui.UI;
using QmTui.Utils;

namespace QmTui.Services;

public sealed partial class WebPlaybackServer
{
    private async Task HandleWebSocketEventsAsync(TcpClient client, NetworkStream stream, string? secWebSocketKey, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(secWebSocketKey))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "text/plain", "Missing Sec-WebSocket-Key", ct).ConfigureAwait(false);
            return;
        }

        string headers = "HTTP/1.1 101 Switching Protocols\r\n" +
                         "Upgrade: websocket\r\n" +
                         "Connection: Upgrade\r\n" +
                         $"Sec-WebSocket-Accept: {ComputeWebSocketAccept(secWebSocketKey)}\r\n\r\n";

        byte[] headerBytes = Encoding.ASCII.GetBytes(headers);
        using (var initWriteCts = CancellationTokenSource.CreateLinkedTokenSource(ct))
        {
            initWriteCts.CancelAfter(TimeSpan.FromSeconds(3));
            await stream.WriteAsync(headerBytes.AsMemory(0, headerBytes.Length), initWriteCts.Token).ConfigureAwait(false);
            await stream.FlushAsync(initWriteCts.Token).ConfigureAwait(false);
        }

        var socket = WebSocket.CreateFromStream(stream, new WebSocketCreationOptions
        {
            IsServer = true,
            // 由 BCL 按间隔发送 PING 帧：远端/反代链路最怕空闲连接被中间设备掐断。
            KeepAliveInterval = TimeSpan.FromSeconds(30),
        });

        var wsClient = new WebSocketClient(client, socket, ct);
        lock (_wsLock)
        {
            _wsClients.Add(wsClient);
        }

        wsClient.Channel.Writer.TryWrite(BuildStateJson("sync"));

        // 客户端帧不承载语义（控制指令仍走 POST），这个循环负责 PING/PONG 与感知对端关闭。
        _ = Task.Run(async () =>
        {
            var buffer = new byte[512];
            try
            {
                while (!wsClient.Cts.Token.IsCancellationRequested)
                {
                    var result = await socket.ReceiveAsync(buffer.AsMemory(), wsClient.Cts.Token).ConfigureAwait(false);
                    if (result.MessageType == WebSocketMessageType.Close) break;
                }
            }
            catch
            {
            }
            finally
            {
                try { wsClient.Cts.Cancel(); } catch {}
            }
        }, CancellationToken.None);

        try
        {
            var reader = wsClient.Channel.Reader;
            while (await reader.WaitToReadAsync(wsClient.Cts.Token).ConfigureAwait(false))
            {
                while (reader.TryRead(out var message))
                {
                    using var writeCts = CancellationTokenSource.CreateLinkedTokenSource(wsClient.Cts.Token);
                    writeCts.CancelAfter(TimeSpan.FromSeconds(3));
                    await socket.SendAsync(Encoding.UTF8.GetBytes(message).AsMemory(), WebSocketMessageType.Text, endOfMessage: true, writeCts.Token).ConfigureAwait(false);
                }
            }
        }
        catch
        {
        }
        finally
        {
            int remainingClients;
            lock (_wsLock)
            {
                _wsClients.Remove(wsClient);
                remainingClients = _wsClients.Count;
            }

            try
            {
                using var closeCts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
                await socket.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, null, closeCts.Token).ConfigureAwait(false);
            }
            catch
            {
            }

            wsClient.Dispose();

            if (remainingClients == 0 && _listener != null)
            {
                _ = Task.Run(async () =>
                {
                    await Task.Delay(2000).ConfigureAwait(false);
                    lock (_wsLock)
                    {
                        if (_wsClients.Count == 0 && _listener != null)
                        {
                            AppLogger.Info("WebPlaybackServer", "All web clients disconnected.");
                            AllClientsDisconnected?.Invoke();
                        }
                    }
                }, CancellationToken.None);
            }
        }
    }

    private const string WebSocketHandshakeGuid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

    /// <summary>RFC 6455 握手所需：base64(sha1(Sec-WebSocket-Key + 固定 GUID))。</summary>
    private static string ComputeWebSocketAccept(string secWebSocketKey)
    {
        Span<byte> hash = stackalloc byte[20];
        SHA1.HashData(Encoding.ASCII.GetBytes(secWebSocketKey + WebSocketHandshakeGuid), hash);
        return Convert.ToBase64String(hash);
    }

    private void HandleApiAction(string body)
    {
        if (string.IsNullOrWhiteSpace(body)) return;
        try
        {
            using var doc = JsonDocument.Parse(body);
            if (doc.RootElement.TryGetProperty("action", out var actionProp))
            {
                var action = actionProp.GetString();
                switch (action)
                {
                    case "client_close":
                        AppLogger.Info("WebPlaybackServer", "Web client page closed (client_close reported).");
                        AllClientsDisconnected?.Invoke();
                        break;
                    case "next":
                        NextRequested?.Invoke();
                        break;
                    case "prev":
                        PreviousRequested?.Invoke();
                        break;
                    case "toggle":
                        TogglePlayRequested?.Invoke();
                        break;
                    case "favorite":
                    case "toggle_favorite":
                        ToggleFavoriteRequested?.Invoke();
                        break;
                    case "mode":
                    case "toggle_mode":
                        ToggleModeRequested?.Invoke();
                        break;
                    case "set_mode":
                        if (doc.RootElement.TryGetProperty("mode", out var modeProp) &&
                            modeProp.TryGetInt32(out var modeValue) &&
                            Enum.IsDefined(typeof(PlaybackMode), modeValue))
                        {
                            ModeRequested?.Invoke((PlaybackMode)modeValue);
                        }
                        break;
                    case "quality":
                    case "toggle_quality":
                        ToggleQualityRequested?.Invoke();
                        break;
                    case "ended":
                        PlaybackEnded?.Invoke();
                        break;
                    case "toggle_audio":
                        AudioOutputEnabled = !AudioOutputEnabled;
                        AudioOutputToggled?.Invoke(AudioOutputEnabled);
                        BroadcastState("audio_toggled");
                        break;
                    case "set_audio":
                        if (doc.RootElement.TryGetProperty("enabled", out var enProp))
                        {
                            AudioOutputEnabled = enProp.GetBoolean();
                            AudioOutputToggled?.Invoke(AudioOutputEnabled);
                            BroadcastState("audio_toggled");
                        }
                        break;
                    case "seek":
                        if (doc.RootElement.TryGetProperty("position", out var posProp))
                        {
                            var pos = posProp.GetDouble();
                            SeekRequested?.Invoke(pos);
                        }
                        break;
                    case "volume":
                        if (doc.RootElement.TryGetProperty("volume", out var volProp))
                        {
                            var vol = volProp.GetInt32();
                            VolumeRequested?.Invoke(vol);
                        }
                        break;
                }
            }
        }
        catch (Exception ex)
        {
            AppLogger.Debug("WebPlaybackServer", $"Failed to parse action json: {ex.Message}");
        }
    }

    private void HandleApiProgress(string body)
    {
        if (string.IsNullOrWhiteSpace(body)) return;
        try
        {
            using var doc = JsonDocument.Parse(body);
            if (doc.RootElement.TryGetProperty("position", out var posProp))
            {
                double pos = posProp.GetDouble();
                double dur = doc.RootElement.TryGetProperty("duration", out var durProp) ? durProp.GetDouble() : TotalDurationSeconds;
                CurrentPositionSeconds = pos;
                if (dur > 0) TotalDurationSeconds = dur;
                ProgressReported?.Invoke(pos, dur);
            }
        }
        catch (Exception ex)
        {
            AppLogger.Debug("WebPlaybackServer", $"Failed to parse progress json: {ex.Message}");
        }
    }

    public void BroadcastState(string eventType)
    {
        var json = BuildStateJson(eventType);
        BroadcastStateJson(json);
    }
    public string GetStateJson(string eventType) => BuildStateJson(eventType);

    private string BuildStateJson(string eventType)
    {
        var sb = new StringBuilder();
        sb.Append('{');
        sb.Append($"\"type\":\"{eventType}\",");
        sb.Append($"\"isPlaying\":{(IsPlaying ? "true" : "false")},");
        sb.Append($"\"position\":{CurrentPositionSeconds:F2},");
        sb.Append($"\"duration\":{TotalDurationSeconds:F2},");
        sb.Append($"\"volume\":{Volume},");
        sb.Append($"\"audioEnabled\":{(AudioOutputEnabled ? "true" : "false")},");
        sb.Append($"\"remoteControlOnly\":{(RemoteControlOnly ? "true" : "false")},");
        sb.Append($"\"isFavorite\":{(IsCurrentSongFavorite ? "true" : "false")},");

        string modeStr = CurrentPlaybackMode switch
        {
            PlaybackMode.SingleLoop => "single_loop",
            PlaybackMode.Shuffle => "shuffle",
            PlaybackMode.Sequential => "sequential",
            _ => "list_loop"
        };
        sb.Append($"\"mode\":\"{modeStr}\",");
        sb.Append($"\"qualityTier\":{(int)ActualQualityTier},");
        sb.Append($"\"preferredQualityTier\":{(int)PreferredQualityTier},");
        sb.Append($"\"qualityBadge\":\"{AudioQualityHelper.GetBadge(ActualQualityTier)}\",");
        sb.Append("\"availableQualityTiers\":[");
        if (AvailableQualities != null)
        {
            var firstQuality = true;
            foreach (var option in AvailableQualities)
            {
                if (!option.Available) continue;
                if (!firstQuality) sb.Append(',');
                sb.Append((int)option.Tier);
                firstQuality = false;
            }
        }
        sb.Append("],");
        var session = UserSession.Current;
        sb.Append("\"account\":{");
        sb.Append($"\"loggedIn\":{(session.IsLoggedIn ? "true" : "false")},");
        sb.Append($"\"uin\":\"{EscapeJson(session.Uin)}\",");
        sb.Append($"\"nick\":\"{EscapeJson(session.Nick)}\",");
        sb.Append($"\"avatarUrl\":\"{EscapeJson(session.AvatarUrl)}\",");
        sb.Append($"\"isVip\":{(session.IsVip ? "true" : "false")},");
        sb.Append($"\"vipLevel\":{session.VipLevel},");
        sb.Append($"\"musicLevel\":{session.MusicLevel}");
        sb.Append("},");
        string streamUrl = "";
        if (!RemoteControlOnly && AudioOutputEnabled && !string.IsNullOrEmpty(CurrentPlayUrl))
        {
            bool isWebDav = CurrentSong?.IsWebDav == true;
            bool hasCredentials = CurrentPlayUrl.Contains('@') &&
                                 (CurrentPlayUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                                  CurrentPlayUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase));

            if (isWebDav || hasCredentials)
            {
                streamUrl = "/stream/audio";
            }
            else
            {
                streamUrl = (CurrentPlayUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                             CurrentPlayUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
                             ? CurrentPlayUrl : "/stream/audio";
            }
        }
        sb.Append($"\"streamUrl\":\"{EscapeJson(streamUrl)}\",");

        sb.Append("\"song\":");
        if (CurrentSong == null)
        {
            sb.Append("null,");
        }
        else
        {
            AppendSongJson(sb, CurrentSong);
            sb.Append(',');
        }

        IReadOnlyList<Song> queue = PlaybackQueueService.Instance.ActiveSongs;
        int queueIndex = PlaybackQueueService.Instance.CurrentIndex;
        if (queue.Count == 0 && CurrentSong != null)
        {
            queue = new List<Song> { CurrentSong };
            queueIndex = 0;
        }
        sb.Append("\"songList\":[");
        for (int i = 0; i < queue.Count; i++)
        {
            if (i > 0) sb.Append(',');
            AppendSongJson(sb, queue[i]);
        }
        sb.Append("],");
        sb.Append($"\"currentIndex\":{queueIndex},");

        sb.Append("\"lyrics\":[");
        if (CurrentLyrics != null && CurrentLyrics.Count > 0)
        {
            for (int i = 0; i < CurrentLyrics.Count; i++)
            {
                var l = CurrentLyrics[i];
                if (i > 0) sb.Append(',');
                sb.Append('{');
                sb.Append($"\"timeMs\":{(long)l.Timestamp.TotalMilliseconds},");
                sb.Append($"\"text\":\"{EscapeJson(l.Text)}\",");
                sb.Append($"\"trans\":\"{EscapeJson(l.Trans)}\"");
                sb.Append('}');
            }
        }
        sb.Append(']');

        sb.Append('}');
        return sb.ToString();
    }

    private static void AppendSongJson(StringBuilder sb, Song song)
    {
        sb.Append('{');
        sb.Append($"\"id\":{song.Id},");
        sb.Append($"\"mid\":\"{EscapeJson(song.Mid)}\",");
        sb.Append($"\"title\":\"{EscapeJson(song.Title)}\",");
        sb.Append($"\"artist\":\"{EscapeJson(song.Artist)}\",");
        sb.Append($"\"album\":\"{EscapeJson(song.Album)}\",");
        sb.Append($"\"albumMid\":\"{EscapeJson(song.AlbumMid)}\",");
        sb.Append($"\"duration\":{song.Duration},");
        sb.Append($"\"mediaMid\":\"{EscapeJson(song.EffectiveMediaMid)}\",");
        sb.Append($"\"quality\":\"{EscapeJson(song.Quality)}\",");
        sb.Append($"\"isLocal\":{(song.IsLocal ? "true" : "false")}");
        sb.Append('}');
    }

    private static string EscapeJson(string? s)
    {
        if (string.IsNullOrEmpty(s)) return "";
        return s.Replace("\\", "\\\\")
                .Replace("\"", "\\\"")
                .Replace("\r", "")
                .Replace("\n", "\\n");
    }

    private void BroadcastStateJson(string json)
    {
        List<WebSocketClient> targets;
        lock (_wsLock)
        {
            if (_wsClients.Count == 0) return;
            targets = new List<WebSocketClient>(_wsClients);
        }

        foreach (var client in targets)
        {
            client.Channel.Writer.TryWrite(json);
        }
    }
}
