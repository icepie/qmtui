using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Terminal.Gui.App;
using Terminal.Gui.Drawing;
using Terminal.Gui.Input;
using Terminal.Gui.ViewBase;
using Terminal.Gui.Views;
using QmTui.Api;
using QmTui.Models;
using QmTui.Player;
using QmTui.Services;
using QmTui.Utils;
using Attribute = Terminal.Gui.Drawing.Attribute;
using Color = Terminal.Gui.Drawing.Color;
using Rectangle = System.Drawing.Rectangle;

namespace QmTui.UI;

public sealed partial class MainWindow
{
    private void HandleWebButtonClicked()
    {
        if (_player is WebPlayer webPlayer)
        {
            ShowWebStatusDialog(webPlayer.Url);
            return;
        }

        if (_standaloneWebServer == null || !_standaloneWebServer.IsRunning)
        {
            StartStandaloneWebServer(openDialog: true);
        }
        else
        {
            ShowWebStatusDialog(_standaloneWebServer.LocalUrl);
        }
    }

    private void StartStandaloneWebServer(bool openDialog = true)
    {
        try
        {
            if (_standaloneWebServer != null && _standaloneWebServer.IsRunning)
            {
                _standaloneWebServer.Stop();
            }

            _standaloneWebServer = new WebPlaybackServer();
            _standaloneWebServer.CurrentSong = _activeSong;
            _standaloneWebServer.CurrentLyrics = _currentLyrics;
            _standaloneWebServer.IsPlaying = _isTuiAudioDisabled ? _isWebPlaying : _player.IsPlaying;
            _standaloneWebServer.Volume = _player.Volume;
            _standaloneWebServer.CurrentPositionSeconds = _isTuiAudioDisabled ? _webVirtualPosition : _player.CurrentPositionSeconds;
            _standaloneWebServer.TotalDurationSeconds = _player.TotalDurationSeconds;
            _standaloneWebServer.IsCurrentSongFavorite = _activeSong != null && _controlBar.IsFavorite;
            _standaloneWebServer.CurrentPlaybackMode = _currentPlaybackMode;
            _standaloneWebServer.ActualQualityTier = _actualQualityTier;
            _standaloneWebServer.PreferredQualityTier = _preferredQualityTier;
            _standaloneWebServer.CurrentPlayUrl = _currentPlayUrl;

            AttachWebServerEvents(_standaloneWebServer);

            var remoteControlOnly = _isWebMode;
            var ok = _standaloneWebServer.Start(_webServerPort, initialAudioOutput: !remoteControlOnly, remoteControlOnly);
            if (ok)
            {
                UpdateTopRightButtonsLayout();

                if (!remoteControlOnly && !Utils.AudioDeviceHelper.HasAudioOutputDevice() && !_isTuiAudioDisabled)
                {
                    _ = SetTuiAudioDisabledAsync(true);
                    _controlBar.UpdateStatus($"Web服务已启动: {_standaloneWebServer.LocalUrl} (无本地音频输出，已自动切换为仅Web播放，15秒无操作息屏)");
                }
                else
                {
                    var mode = remoteControlOnly ? "CLI本地输出音频，Web仅遥控" : "15秒无操作息屏";
                    _controlBar.UpdateStatus($"Web服务已启动: {_standaloneWebServer.LocalUrl} ({mode})");
                }

                EnableWebAodWatchdog();
                if (openDialog)
                {
                    ShowWebStatusDialog(_standaloneWebServer.LocalUrl);
                }
            }
            else
            {
                _controlBar.UpdateStatus($"Web服务启动失败，请检查端口 {_webServerPort} 是否被占用");
            }
        }
        catch (Exception ex)
        {
            AppLogger.Error("MainWindow", "StartStandaloneWebServer error", ex);
        }
    }

    private void AttachWebServerEvents(WebPlaybackServer server)
    {
        server.NextRequested += () => Application.Invoke(async () =>
        {
            if (_currentViewMode == ViewMode.GuessRecommend)
                await PlayNextRadioTrackAsync();
            else
                await PlayNextInCurrentListAsync();
        });
        server.PreviousRequested += () => Application.Invoke(async () =>
        {
            if (_currentViewMode != ViewMode.GuessRecommend)
                await PlayPrevInCurrentListAsync();
        });
        server.TogglePlayRequested += () => Application.Invoke(async () =>
        {
            await TogglePlayOrPauseAsync();
        });
        server.ToggleFavoriteRequested += () =>
        {
            var targetSong = _activeSong;
            if (targetSong == null) return;
            _ = Task.Run(async () =>
            {
                await ToggleSongFavoriteAsync(targetSong).ConfigureAwait(false);
                server.BroadcastState("favorite_result");
            });
        };
        server.ToggleModeRequested += () => Application.Invoke(() => TogglePlaybackMode());
        server.ToggleQualityRequested += () => Application.Invoke(async () =>
        {
            await CycleQualityTierAsync(allowHiRes: false);
        });
        server.QualityRequested += tier => Application.Invoke(async () =>
        {
            if (server.AvailableQualities?.Any(option => option.Tier == tier && !option.Available) == true)
            {
                server.BroadcastState("quality_unavailable");
                return;
            }
            await SwitchQualityTierAsync(tier);
        });
        server.LibraryPlayRequested += request => Application.Invoke(async () =>
        {
            var queue = request.Context;
            int selectedIndex = queue.FindIndex(song =>
                (!string.IsNullOrEmpty(song.Mid) && song.Mid == request.Song.Mid) ||
                (song.Id > 0 && song.Id == request.Song.Id));
            PlaybackQueueService.Instance.Mode = _currentPlaybackMode;
            PlaybackQueueService.Instance.SetQueue(queue, Math.Max(selectedIndex, 0));
            await PlaySongAsync(request.Song);
        });
        server.SeekRequested += sec =>
        {
            if (_isTuiAudioDisabled || _player is WebPlayer)
            {
                _webVirtualPosition = sec;
                Application.Invoke(() =>
                {
                    UpdateProgress(sec);
                    UpdateLyrics(sec);
                });
            }
            else
            {
                _ = _player.SeekAsync(sec);
            }
        };
        server.VolumeRequested += vol => Application.Invoke(() =>
        {
            var normalized = Math.Clamp(vol, 0, 100);
            server.Volume = normalized;
            _player.SetVolume(normalized);
            UserSession.Current.Volume = normalized;
            UserSession.Current.Save();
            _controlBar.UpdateVolume(normalized, normalized == 0);
            _mprisService.UpdateVolume(normalized);
            server.BroadcastState("volume_change");
        });
        server.ProgressReported += (pos, dur) =>
        {
            if (_isTuiAudioDisabled || _player is WebPlayer)
            {
                _webVirtualPosition = pos;
                Application.Invoke(() =>
                {
                    UpdateProgress(pos);
                    UpdateLyrics(pos);
                });
            }
        };
        server.PlaybackEnded += () =>
        {
            Application.Invoke(async () =>
            {
                if (_currentViewMode == ViewMode.GuessRecommend)
                {
                    await PlayNextRadioTrackAsync();
                }
                else if (_currentPlaybackMode == PlaybackMode.SingleLoop && _activeSong != null)
                {
                    await PlaySongAsync(_activeSong, 0);
                }
                else
                {
                    await PlayNextInCurrentListAsync(isAutoPlayback: true);
                }
            });
        };
            if (server.RemoteControlOnly)
            {
                return;
            }

        server.AllClientsDisconnected += () => Application.Invoke(async () =>
        {
            if (_isTuiAudioDisabled)
            {
                if (_isWebPlaying)
                {
                    _isWebPlaying = false;
                    StopWebVirtualTicker();
                    _controlBar.UpdateStatus("Web 浏览器已全部关闭，已自动暂停播放");
                    AppLogger.Info("MainWindow", "All web clients disconnected in Web-only mode. Playback paused.");
                }
            }
            else if (_player.IsPlaying)
            {
                await TogglePlayOrPauseAsync();
                _controlBar.UpdateStatus("Web 浏览器已全部关闭，已自动暂停播放");
                AppLogger.Info("MainWindow", "All web clients disconnected. Playback paused.");
            }
        });
    }

    private bool RestartStandaloneWebServer(int port)
    {
        try
        {
            _webServerPort = port;
            StartStandaloneWebServer(openDialog: false);
            return _standaloneWebServer?.IsRunning == true;
        }
        catch (Exception ex)
        {
            AppLogger.Error("MainWindow", "RestartStandaloneWebServer error", ex);
            return false;
        }
    }

    private void StopStandaloneWebServer()
    {
        try
        {
            DisableWebAodWatchdog();

            if (_isTuiAudioDisabled)
            {
                _isTuiAudioDisabled = false;
                _isWebPlaying = false;
                StopWebVirtualTicker();
            }

            if (_standaloneWebServer != null)
            {
                if (_standaloneWebServer.IsRunning)
                {
                    _standaloneWebServer.Stop();
                }
                _standaloneWebServer = null;
            }

            UpdateTopRightButtonsLayout();
            _controlBar.UpdateStatus("Web服务已关闭");
        }
        catch (Exception ex)
        {
            AppLogger.Error("MainWindow", "StopStandaloneWebServer error", ex);
        }
    }

    private void DisableWebAodWatchdog()
    {
        if (_aodInactivityTimerToken != null)
        {
            try
            {
                Application.RemoveTimeout(_aodInactivityTimerToken);
            }
            catch { }
            _aodInactivityTimerToken = null;
        }
    }

    private void EnableWebAodWatchdog()
    {
        if (_aodInactivityTimerToken != null) return;
        _lastUserActivityTick = Environment.TickCount64;
        _aodInactivityTimerToken = Application.AddTimeout(TimeSpan.FromSeconds(1), () =>
        {
            if (_standaloneWebServer == null || !_standaloneWebServer.IsRunning)
            {
                _aodInactivityTimerToken = null;
                return false;
            }

            if (!_isAodMode && Environment.TickCount64 - _lastUserActivityTick >= 15000)
            {
                Application.Invoke(EnterAodMode);
            }
            return true;
        });
    }

    private async Task TogglePlayOrPauseAsync()
    {
        if (_activeSong != null && !_player.IsPlaying && !_isWebPlaying && _player.TotalDurationSeconds <= 0)
        {
            await PlaySongAsync(_activeSong, UserSession.Current.LastPlaybackPositionSeconds);
            return;
        }

        if (_isTuiAudioDisabled)
        {
            _isWebPlaying = !_isWebPlaying;
            if (_isWebPlaying)
            {
                if (_activeSong != null) StartWebVirtualTicker(_activeSong.Duration);
            }
            else
            {
                StopWebVirtualTicker();
            }

            if (_standaloneWebServer != null && _standaloneWebServer.IsRunning)
            {
                _standaloneWebServer.IsPlaying = _isWebPlaying;
                _standaloneWebServer.BroadcastState(_isWebPlaying ? "play" : "pause");
            }
            UpdatePlayerStatus();
        }
        else
        {
            await _player.TogglePauseAsync();
            if (_standaloneWebServer != null && _standaloneWebServer.IsRunning)
            {
                _standaloneWebServer.IsPlaying = _player.IsPlaying;
                _standaloneWebServer.BroadcastState(_player.IsPlaying ? "play" : "pause");
            }
            UpdatePlayerStatus();
        }
    }

    private async Task SetTuiAudioDisabledAsync(bool disabled)
    {
        _isTuiAudioDisabled = disabled;
        if (_isTuiAudioDisabled)
        {
            try
            {
                await _player.StopAsync();
            }
            catch (Exception ex)
            {
                AppLogger.Debug("MainWindow", $"Player stop error while disabling audio: {ex.Message}");
            }

            if (_standaloneWebServer != null && _standaloneWebServer.IsRunning && _activeSong != null)
            {
                _isWebPlaying = true;
                _standaloneWebServer.IsPlaying = true;
                _standaloneWebServer.BroadcastState("play");
                StartWebVirtualTicker(_activeSong.Duration);
            }
        }
        else
        {
            StopWebVirtualTicker();
            if (_activeSong != null)
            {
                double currentPos = _standaloneWebServer != null && _standaloneWebServer.CurrentPositionSeconds > 0
                    ? _standaloneWebServer.CurrentPositionSeconds
                    : (_webVirtualPosition > 0 ? _webVirtualPosition : _player.CurrentPositionSeconds);

                string? playUrl = _standaloneWebServer?.CurrentPlayUrl;
                if (string.IsNullOrEmpty(playUrl))
                {
                    try
                    {
                        var res = await MusicApi.GetPlayUrlForTierAsync(_activeSong.Mid, _activeSong.EffectiveMediaMid, _actualQualityTier);
                        playUrl = res.Url;
                    }
                    catch (Exception ex)
                    {
                        AppLogger.Warn("MainWindow", $"Failed to fetch play url during restore: {ex.Message}");
                    }
                }

                if (!string.IsNullOrEmpty(playUrl))
                {
                    try
                    {
                        await _player.PlayAsync(playUrl, _activeSong.Duration, currentPos);
                    }
                    catch (Exception ex)
                    {
                        AppLogger.Warn("MainWindow", $"Failed to restore local player: {ex.Message}");
                    }
                }
            }
            _isWebPlaying = false;
        }
        UpdatePlayerStatus();
    }

    private void StartWebVirtualTicker(double duration)
    {
        StopWebVirtualTicker();
        _webVirtualTickerToken = Application.AddTimeout(TimeSpan.FromMilliseconds(500), () =>
        {
            if (!_isTuiAudioDisabled || !_isWebPlaying) return false;

            _webVirtualPosition += 0.5;
            if (duration > 0 && _webVirtualPosition >= duration)
            {
                _webVirtualPosition = duration;
                Application.Invoke(async () =>
                {
                    if (_currentViewMode == ViewMode.GuessRecommend)
                        await PlayNextRadioTrackAsync();
                    else if (_currentPlaybackMode == PlaybackMode.SingleLoop && _activeSong != null)
                        await PlaySongAsync(_activeSong, 0);
                    else
                        await PlayNextInCurrentListAsync();
                });
                return false;
            }

            Application.Invoke(() =>
            {
                UpdateProgress(_webVirtualPosition);
                UpdateLyrics(_webVirtualPosition);
            });
            return true;
        });
    }

    private void StopWebVirtualTicker()
    {
        if (_webVirtualTickerToken != null)
        {
            Application.RemoveTimeout(_webVirtualTickerToken);
            _webVirtualTickerToken = null;
        }
    }

}
