import '@applemusic-like-lyrics/core/style.css';
import { BackgroundRender, LyricPlayer, MeshGradientRenderer } from '@applemusic-like-lyrics/core';
import './style.css';

const el = (id) => document.getElementById(id);
const ui = {
  bg: el('bg'),
  cover: el('cover'),
  title: el('title'),
  artist: el('artist'),
  lyrics: el('lyrics'),
  pos: el('pos'),
  dur: el('dur'),
  seek: el('seek'),
  toggle: el('toggle'),
  prev: el('prev'),
  next: el('next'),
};

// 歌词与动态背景都由 AMLL（AGPL-3.0）渲染；这里只做“遥控 + 显示”，音频仍由 CLI 输出。
const lyricPlayer = new LyricPlayer();
ui.lyrics.append(lyricPlayer.getElement());

const bg = BackgroundRender.new(MeshGradientRenderer);
bg.setFPS(30);
ui.bg.append(bg.getElement());

const state = {
  position: 0,
  duration: 0,
  isPlaying: false,
  song: null,
  lyricSignature: '',
  lyricLines: [],
  anchorWall: 0,
  anchorPos: 0,
  seeking: false,
};

function currentTime() {
  if (!state.isPlaying) return state.position;
  return state.anchorPos + (performance.now() - state.anchorWall) / 1000;
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const post = (path, body) =>
  fetch(path, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }).then((response) => response.text());

// 后端的歌词是行级的（timeMs/text/trans），转成 AMLL 的逐行结构；后续拿到逐字 QRC 时只需换这里。
function toAmllLines(lyrics) {
  const source = (Array.isArray(lyrics) ? lyrics : [])
    .map((line) => ({
      start: Number(line.timeMs) || 0,
      text: String(line.text || ''),
      trans: String(line.trans || ''),
    }))
    .filter((line) => line.text.trim().length > 0);

  const lines = [];
  for (let i = 0; i < source.length; i++) {
    const start = source[i].start;
    const end = i + 1 < source.length ? source[i + 1].start : start + 5000;
    if (end <= start) continue;
    lines.push({
      words: [{ word: source[i].text, startTime: start, endTime: end }],
      startTime: start,
      endTime: end,
      translatedLyric: source[i].trans || undefined,
    });
  }
  return lines;
}

function applyLyrics(force) {
  const signature = state.lyricLines
    .map((line) => `${line.startTime}:${line.words[0].word}`)
    .join('|');
  if (!force && signature === state.lyricSignature) return;
  state.lyricSignature = signature;
  lyricPlayer.setLyricLines(state.lyricLines, Math.max(0, currentTime() * 1000));
}

function applySong() {
  const song = state.song;
  if (!song) return;
  const album = typeof song.album === 'string' ? null : song.album;
  const albumMid = song.albumMid || album?.mid || '';
  const cover =
    song.picUrl ||
    song.picurl ||
    album?.picurl ||
    (albumMid
      ? `/cover?mid=${encodeURIComponent(song.mid || '')}&albumMid=${encodeURIComponent(albumMid)}&size=500`
      : '');
  ui.title.textContent = song.title || song.name || '未在播放';
  const singers = (song.singer || song.singers || []).map((item) => item.name).filter(Boolean);
  ui.artist.textContent = song.artist || singers.join(' / ') || '';
  if (cover && ui.cover.getAttribute('src') !== cover) {
    ui.cover.src = cover;
    ui.cover.style.visibility = 'visible';
    bg.setAlbum(cover).catch(() => {});
  } else if (!cover) {
    ui.cover.style.visibility = 'hidden';
  }
}

function apply(frame) {
  if (!frame || typeof frame !== 'object') return;
  const song = frame.song || null;
  const songChanged = Boolean(song) && (!state.song || song.mid !== state.song.mid);

  const wasPlaying = state.isPlaying;
  if (Number(frame.duration) > 0) state.duration = Number(frame.duration);
  state.isPlaying = Boolean(frame.isPlaying);
  state.position = Number(frame.position) || 0;
  state.anchorPos = state.position;
  state.anchorWall = performance.now();
  if (song) state.song = song;
  if (Array.isArray(frame.lyrics)) {
    state.lyricLines = toAmllLines(frame.lyrics);
  }

  if (songChanged) applySong();
  applyLyrics(songChanged || wasPlaying !== state.isPlaying || Array.isArray(frame.lyrics));
  if (state.isPlaying) lyricPlayer.resume();
  else lyricPlayer.pause();
  syncProgress();
}

function syncProgress() {
  if (state.seeking) return;
  const now = Math.min(currentTime(), state.duration || currentTime());
  ui.pos.textContent = formatTime(now);
  ui.dur.textContent = formatTime(state.duration);
  ui.toggle.textContent = state.isPlaying ? '⏸' : '▶';
  if (state.duration > 0) ui.seek.value = String(Math.round((now / state.duration) * 1000));
}

function connect() {
  const scheme = location.protocol === 'https:' ? 'wss' : 'ws';
  const socket = new WebSocket(`${scheme}://${location.host}/api/ws`);
  socket.onmessage = (event) => {
    try {
      apply(JSON.parse(event.data));
    } catch (error) {
      console.error('[amll] 状态帧处理失败', error);
    }
  };
  socket.onclose = () => setTimeout(connect, 1500);
}

ui.toggle.onclick = () => post('/api/toggle').catch(() => {});
ui.prev.onclick = () => post('/api/previous').catch(() => {});
ui.next.onclick = () => post('/api/next').catch(() => {});

ui.seek.addEventListener('input', () => {
  state.seeking = true;
  ui.pos.textContent = formatTime((Number(ui.seek.value) / 1000) * state.duration);
});

ui.seek.addEventListener('change', () => {
  const target = (Number(ui.seek.value) / 1000) * state.duration;
  state.seeking = false;
  post(`/api/seek?pos=${target.toFixed(2)}`)
    .then(() => {
      state.position = target;
      state.anchorPos = target;
      state.anchorWall = performance.now();
      applyLyrics(true);
    })
    .catch(() => {});
});

let lastFrame = performance.now();
function tick() {
  const now = performance.now();
  const delta = now - lastFrame;
  lastFrame = now;
  // AMLL 只在 update() 里构建/定位歌词行；暂停时给最小步进保证仍渲染当前行，
  // 并在播放态切换时用真实时间重新对齐（避免暂停期间累积漂移）。
  lyricPlayer.update(state.isPlaying ? delta : 1);
  syncProgress();
  requestAnimationFrame(tick);
}

window.__amllDebug = { lyricPlayer, bg, state };

fetch('/api/account')
  .then((response) => response.json())
  .catch(() => null)
  .finally(() => {
    connect();
    requestAnimationFrame(tick);
  });
