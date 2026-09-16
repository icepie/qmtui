using System.Net.Sockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using QmTui.Api;
using QmTui.Models;

namespace QmTui.Services;

internal sealed record WebAccountResponse(bool LoggedIn, string Uin, string Nick, string AvatarUrl, bool IsVip, int VipLevel, int MusicLevel);
internal sealed record WebLoginStartRequest(string Type);
internal sealed record WebLoginStartResponse(bool Ok, string Message, string Type, string MimeType, string ImageBase64);
internal sealed record WebLoginStatusResponse(string Event, string Message, WebAccountResponse Account);
internal sealed record WebLoginCookieRequest(string Cookie);

public sealed partial class WebPlaybackServer
{
    private readonly object _loginLock = new();
    private CancellationTokenSource? _loginCts;
    private LoginService.PollStatus? _loginStatus;

    private static WebAccountResponse BuildAccountResponse()
    {
        var session = UserSession.Current;
        return new WebAccountResponse(session.IsLoggedIn, session.Uin, session.Nick, session.AvatarUrl, session.IsVip, session.VipLevel, session.MusicLevel);
    }

    private static async Task HandleAccountAsync(NetworkStream stream, CancellationToken ct)
    {
        var payload = JsonSerializer.Serialize(BuildAccountResponse(), WebAccountJsonContext.Default.WebAccountResponse);
        await SendResponseAsync(stream, 200, "OK", "application/json", payload, ct).ConfigureAwait(false);
    }

    private async Task HandleLoginStartAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        WebLoginStartRequest? request;
        try { request = JsonSerializer.Deserialize(body, WebAccountJsonContext.Default.WebLoginStartRequest); }
        catch (JsonException) { request = null; }

        var type = request?.Type?.Trim().ToLowerInvariant() switch
        {
            "wechat" => LoginService.QrLoginType.WeChat,
            "app" => LoginService.QrLoginType.OfficialApp,
            _ => LoginService.QrLoginType.Qq
        };

        CancellationTokenSource loginCts;
        lock (_loginLock)
        {
            try { _loginCts?.Cancel(); } catch { }
            _loginCts?.Dispose();
            _loginCts = CancellationTokenSource.CreateLinkedTokenSource(_cts?.Token ?? ct);
            loginCts = _loginCts;
            _loginStatus = new LoginService.PollStatus(LoginService.QrLoginEvent.Waiting, 408, "正在获取二维码...");
        }

        var qr = await LoginService.FetchQrCodeAsync(type, loginCts.Token).ConfigureAwait(false);
        if (qr is null)
        {
            lock (_loginLock) _loginStatus = new LoginService.PollStatus(LoginService.QrLoginEvent.Error, -1, "二维码获取失败");
            var failed = new WebLoginStartResponse(false, "二维码获取失败", type.ToString().ToLowerInvariant(), "", "");
            await SendAccountJsonAsync(stream, failed, WebAccountJsonContext.Default.WebLoginStartResponse, 502, "Bad Gateway", ct).ConfigureAwait(false);
            return;
        }

        lock (_loginLock) _loginStatus = new LoginService.PollStatus(LoginService.QrLoginEvent.Waiting, 408, "等待手机扫码...");
        _ = Task.Run(() => MonitorLoginAsync(qr, loginCts.Token), CancellationToken.None);

        var response = new WebLoginStartResponse(true, "等待手机扫码", type.ToString().ToLowerInvariant(), qr.MimeType, Convert.ToBase64String(qr.ImageBytes));
        await SendAccountJsonAsync(stream, response, WebAccountJsonContext.Default.WebLoginStartResponse, 200, "OK", ct).ConfigureAwait(false);
    }

    private async Task MonitorLoginAsync(LoginService.QrCodeResult qr, CancellationToken ct)
    {
        LoginService.PollStatus status;
        if (qr.Type == LoginService.QrLoginType.OfficialApp)
        {
            status = await LoginService.WaitForOfficialAppQrLoginAsync(qr, update => SetLoginStatus(update), ct).ConfigureAwait(false);
            SetLoginStatus(status);
            return;
        }

        do
        {
            status = await LoginService.PollQrStatusAsync(qr, ct).ConfigureAwait(false);
            SetLoginStatus(status);
            if (status.Event is LoginService.QrLoginEvent.Done or LoginService.QrLoginEvent.Expired or LoginService.QrLoginEvent.Refused or LoginService.QrLoginEvent.Error) break;
            await Task.Delay(1200, ct).ConfigureAwait(false);
        } while (!ct.IsCancellationRequested);
    }

    private void SetLoginStatus(LoginService.PollStatus status)
    {
        lock (_loginLock) _loginStatus = status;
        if (status.Event == LoginService.QrLoginEvent.Done)
        {
            BroadcastState("account");
        }
    }

    private async Task HandleLoginStatusAsync(NetworkStream stream, CancellationToken ct)
    {
        LoginService.PollStatus status;
        lock (_loginLock)
        {
            status = _loginStatus ?? new LoginService.PollStatus(
                UserSession.Current.IsLoggedIn ? LoginService.QrLoginEvent.Done : LoginService.QrLoginEvent.Waiting,
                UserSession.Current.IsLoggedIn ? 0 : 408,
                UserSession.Current.IsLoggedIn ? "已登录" : "未开始登录");
        }
        var response = new WebLoginStatusResponse(status.Event.ToString().ToLowerInvariant(), status.Message, BuildAccountResponse());
        await SendAccountJsonAsync(stream, response, WebAccountJsonContext.Default.WebLoginStatusResponse, 200, "OK", ct).ConfigureAwait(false);
    }

    private async Task HandleCookieLoginAsync(NetworkStream stream, string body, CancellationToken ct)
    {
        WebLoginCookieRequest? request;
        try { request = JsonSerializer.Deserialize(body, WebAccountJsonContext.Default.WebLoginCookieRequest); }
        catch (JsonException) { request = null; }
        if (string.IsNullOrWhiteSpace(request?.Cookie))
        {
            await SendResponseAsync(stream, 400, "Bad Request", "application/json", "{\"error\":\"cookie is required\"}", ct).ConfigureAwait(false);
            return;
        }

        bool ok = LoginService.ImportCookieString(request.Cookie) && await LoginService.EnsureMusicKeyAsync(ct).ConfigureAwait(false);
        if (ok) await MusicApi.RefreshCurrentUserProfileAsync(ct).ConfigureAwait(false);
        var status = new LoginService.PollStatus(ok ? LoginService.QrLoginEvent.Done : LoginService.QrLoginEvent.Error, ok ? 0 : -1, ok ? "登录成功" : "Cookie 无效");
        SetLoginStatus(status);
        var response = new WebLoginStatusResponse(status.Event.ToString().ToLowerInvariant(), status.Message, BuildAccountResponse());
        await SendAccountJsonAsync(stream, response, WebAccountJsonContext.Default.WebLoginStatusResponse, ok ? 200 : 401, ok ? "OK" : "Unauthorized", ct).ConfigureAwait(false);
    }

    private async Task HandleLogoutAsync(NetworkStream stream, CancellationToken ct)
    {
        lock (_loginLock)
        {
            try { _loginCts?.Cancel(); } catch { }
            _loginCts?.Dispose();
            _loginCts = null;
            _loginStatus = null;
        }
        LoginService.Logout();
        BroadcastState("account");
        await SendResponseAsync(stream, 200, "OK", "application/json", "{\"ok\":true}", ct).ConfigureAwait(false);
    }

    private static async Task SendAccountJsonAsync<T>(NetworkStream stream, T value, JsonTypeInfo<T> typeInfo, int status, string statusText, CancellationToken ct)
    {
        var json = JsonSerializer.Serialize(value, typeInfo);
        await SendResponseAsync(stream, status, statusText, "application/json", json, ct).ConfigureAwait(false);
    }
}

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase, PropertyNameCaseInsensitive = true, UnmappedMemberHandling = JsonUnmappedMemberHandling.Skip)]
[JsonSerializable(typeof(WebAccountResponse))]
[JsonSerializable(typeof(WebLoginStartRequest))]
[JsonSerializable(typeof(WebLoginStartResponse))]
[JsonSerializable(typeof(WebLoginStatusResponse))]
[JsonSerializable(typeof(WebLoginCookieRequest))]
internal sealed partial class WebAccountJsonContext : JsonSerializerContext
{
}
