import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
if (outIndex >= 0 && (!args[outIndex + 1] || args[outIndex + 1].startsWith('--')))
  throw new Error('--out needs a directory');
const out = path.resolve(outIndex < 0 ? path.join(root, 'www/qqmusic') : args[outIndex + 1]);
const check = args.includes('--check');
const recovered = path.join(root, 'web/recovered');
const manifest = JSON.parse(await readFile(path.join(recovered, 'manifest.json'), 'utf8'));
if (manifest.version !== 1) throw new Error('Unsupported recovered source manifest');
const outputs = new Map();
function safePath(base, name) {
  const target = path.resolve(base, name);
  if (!target.startsWith(`${base}${path.sep}`))
    throw new Error(`Path outside source root: ${name}`);
  return target;
}
async function source(base, name) {
  const file = safePath(base, name);
  const content = await readFile(file);
  return content;
}
function emit(name, content) {
  safePath(out, name);
  if (outputs.has(name)) throw new Error(`Duplicate output ${name}`);
  outputs.set(name, Buffer.isBuffer(content) ? content : Buffer.from(content));
}
async function copyTree(base, prefix = '', relative = '') {
  for (const entry of (await readdir(path.join(base, relative), { withFileTypes: true })).sort(
    (a, b) => a.name.localeCompare(b.name, 'en')
  )) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) await copyTree(base, prefix, name);
    else if (entry.isFile()) emit(`${prefix}${name}`, await source(base, name));
    else throw new Error(`Unsupported source entry ${name}`);
  }
}
for (const chunk of manifest.chunks) {
  const parts = [];
  for (const part of chunk.parts) {
    if (typeof part === 'string') parts.push(part);
    else {
      const body = (await source(recovered, part.source)).toString('utf8');
      if (!['eval', 'factory'].includes(part.encoding))
        throw new Error(`Unsupported module encoding ${part.encoding}`);
      parts.push(
        part.prefix + (part.encoding === 'eval' ? JSON.stringify(body) : body) + part.suffix
      );
    }
  }
  emit(chunk.file, parts.join(''));
}
emit('runtime.js', await source(recovered, 'runtime.js'));
await copyTree(path.join(root, 'web/browser'));
await copyTree(path.join(root, 'web/assets'), 'assets/');

// One version covers the entire graph, not only the entry file. A module edit
// invalidates HTML entries, native ESM imports and webpack's lazy chunk URLs.
const digest = createHash('sha256');
for (const [name, bytes] of [...outputs].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
  digest.update(name).update('\0').update(bytes).update('\0');
}
const version = digest.digest('hex').slice(0, 16);
const versioned = (url) => `${url.split('?')[0]}?v=${version}`;
for (const [name, bytes] of outputs) {
  let text;
  if (name === 'index.html') {
    text = bytes
      .toString('utf8')
      .replace(
        /((?:src|href)=["'])(\.\/[^"']+\.(?:js|css)(?:\?[^"']*)?)(["'])/g,
        (_, before, url, after) => `${before}${versioned(url)}${after}`
      );
  } else if (name === 'qmtui-bridge.js' || name.startsWith('bridge/')) {
    // The maintained modules use static import declarations; only match a
    // declaration at line start, never arbitrary string literals or eval code.
    text = bytes
      .toString('utf8')
      .replace(
        /^(import\s+(?:[^;]*?\s+from\s+)?)(['"])(\.{1,2}\/[^'"\n]+)\2/gm,
        (_, before, quote, url) => `${before}${quote}${versioned(url)}${quote}`
      );
  } else if (name === 'runtime.js') {
    const original = bytes.toString('utf8');
    const marker = '.js?max_age=2592000';
    if (original.split(marker).length !== 2)
      throw new Error('Webpack chunk URL generator changed; update build transform');
    text = original.replace(marker, `.js?v=${version}`);
  }
  if (text !== undefined) outputs.set(name, Buffer.from(text));
}
const outputHashes = Object.fromEntries(
  [...outputs].map(([name, bytes]) => [name, createHash('sha256').update(bytes).digest('hex')])
);
emit('build-manifest.json', `${JSON.stringify({ version, files: outputHashes }, null, 2)}\n`);

let previous = { files: {} };
try {
  previous = JSON.parse(await readFile(path.join(out, 'build-manifest.json'), 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const stale = Object.keys(previous.files).filter((name) => !outputs.has(name));
const changed = [];
for (const [name, bytes] of outputs) {
  let current;
  try {
    current = await readFile(safePath(out, name));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (current?.equals(bytes)) continue;
  changed.push(name);
  if (!check) {
    const destination = safePath(out, name);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, bytes);
  }
}
if (check && (changed.length || stale.length))
  throw new Error(
    `Stale frontend output. Run pnpm build. Changed: ${[...changed, ...stale].join(', ')}`
  );
if (!check) for (const name of stale) await rm(safePath(out, name));
console.log(
  `Frontend ${check ? 'verified' : 'built'}: ${manifest.chunks.length} chunks, ${outputs.size} files, version ${version}${check ? '' : ` (${changed.length} updated)`}`
);
