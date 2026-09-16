import assert from 'node:assert/strict';
import { test } from 'node:test';

import { api } from '../../web/browser/bridge/api.js';
import {
  albumCover,
  escapeHtml,
  keyOf,
  mapSong,
  query,
  songCover,
} from '../../web/browser/bridge/media.js';

test('media: escapeHtml escapes the five HTML-significant chars and nils', () => {
  assert.equal(
    escapeHtml('<a href="x">&\'</a>'),
    '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;'
  );
  assert.equal(escapeHtml(undefined), '');
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(0), '0');
});

test('media: keyOf prefers mid, then id, then empty string', () => {
  assert.equal(keyOf({ mid: 'abc', id: 7 }), 'abc');
  assert.equal(keyOf({ id: 7 }), '7');
  assert.equal(keyOf({}), '');
  assert.equal(keyOf(null), '');
  assert.equal(keyOf(undefined), '');
});

test('media: query drops null/undefined and URL-encodes values', () => {
  assert.equal(
    query({ a: 1, b: null, c: undefined, d: 'x y&z', zero: 0, enabled: false }),
    'a=1&d=x+y%26z&zero=0&enabled=false'
  );
  assert.equal(query({}), '');
});

test('media: cover URLs encode ids and prefer the flattened album id', () => {
  assert.equal(
    songCover({ mid: 'm&x', albumMid: 'a/b', album: { mid: 'nested' } }, 500),
    '/cover?mid=m%26x&albumMid=a%2Fb&size=500'
  );
  const nested = new URL(songCover({ album: { mid: 'a&b' } }), 'http://localhost');
  assert.equal(nested.searchParams.get('albumMid'), 'a&b');
  const album = new URL(albumCover({ mid: 'a&b' }), 'http://localhost');
  assert.equal(album.searchParams.get('mid'), 'a&b');
  assert.equal(album.searchParams.get('albumMid'), 'a&b');
});

test('media: mapSong normalizes a raw payload', () => {
  assert.deepEqual(
    mapSong({
      mid: 'm1',
      title: 'Song',
      singer: [{ name: 'A' }, { title: 'B' }, {}],
      album: 'Album',
      duration: 200,
      id: '42',
    }),
    {
      mid: 'm1',
      title: 'Song',
      artist: 'A/B',
      album: 'Album',
      duration: 200,
      mediaMid: '',
      id: 42,
      albumMid: '',
    }
  );
});

test('media: mapSong unwraps a { track } wrapper and object album', () => {
  assert.deepEqual(
    mapSong({
      track: {
        songmid: 'm2',
        name: 'Name',
        artist: 'X',
        singer: [{ name: 'Ignored' }],
        album: { title: 'Al', mid: 'al2' },
        interval: '120',
        file: { media_mid: 'file2' },
      },
    }),
    {
      mid: 'm2',
      title: 'Name',
      artist: 'X',
      album: 'Al',
      duration: 120,
      mediaMid: 'file2',
      id: 0,
      albumMid: 'al2',
    }
  );
});

test('api: throws the server error message on non-2xx', async (t) => {
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response(JSON.stringify({ error: 'boom' }), { status: 500 })
  );
  await assert.rejects(api('/x'), { name: 'Error', message: 'boom' });
});

test('api: retains a non-JSON error body instead of a JSON parse failure', async (t) => {
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response('upstream unavailable', { status: 502 })
  );
  await assert.rejects(api('/x'), { name: 'Error', message: 'upstream unavailable' });
});

test('api: falls back to the HTTP status when an error response is empty', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));
  await assert.rejects(api('/x'), { name: 'Error', message: 'HTTP 503' });
});
