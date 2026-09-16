import { createHash } from 'node:crypto';
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'acorn';

// Static extraction only: never execute the Electron bundle or its eval payloads.
// Keep factory scope and eval semantics; the assembler re-encodes readable bodies.
const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`${name} needs a path`);
  return args[index + 1];
}
const from = path.resolve(option('--from', 'www/qqmusic'));
const out = path.resolve(option('--out', 'web/recovered'));
try {
  await access(out);
  throw new Error(
    `Refusing to overwrite editable sources: ${out}. Use --out with a new directory.`
  );
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const hash = (text) => createHash('sha256').update(text).digest('hex');
function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (typeof node.type === 'string') visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) walk(child, visit);
    } else if (value && typeof value === 'object') walk(value, visit);
  }
}
function sourcePath(sourceUrl, id) {
  const original =
    sourceUrl?.replace(/^webpack:\/\/qqmusic\//, '').split('?')[0] || `external/${id}`;
  const segments = original.split('/').filter((part) => part && part !== '.' && part !== '..');
  return segments
    .map((part) => (part === 'node_modules' ? 'packages' : part.replace(/[^\w.+@-]/g, '_')))
    .join('/');
}
const files = (await readdir(from))
  .filter((name) => /^(?:\d+|index|vendor|common)\.js$/.test(name))
  .sort();
if (!files.includes('index.js') || !files.includes('vendor.js'))
  throw new Error('Expected QQ Music webpack chunks');
const manifest = {
  version: 1,
  provenance: 'Recovered from the modified qmtui browser distribution; not original TypeScript.',
  chunks: [],
};
const pending = new Map();
let moduleCount = 0;
for (const file of files) {
  const text = await readFile(path.join(from, file), 'utf8');
  const ast = parse(text, { ecmaVersion: 'latest', sourceType: 'script' });
  const registrations = [];
  walk(ast, (node) => {
    if (
      node.type === 'CallExpression' &&
      node.callee.type === 'MemberExpression' &&
      node.callee.property.name === 'push' &&
      node.arguments[0]?.type === 'ArrayExpression' &&
      node.arguments[0].elements[1]?.type === 'ObjectExpression'
    )
      registrations.push(node.arguments[0]);
  });
  if (registrations.length !== 1) throw new Error(`${file}: expected one chunk registration`);
  const registration = registrations[0];
  const chunk = {
    file,
    originalSha256: hash(text),
    chunkIds: registration.elements[0].elements.map((id) => id.value),
    parts: [],
  };
  let cursor = 0;
  for (const property of registration.elements[1].properties) {
    const factory = property.value;
    if (!['ArrowFunctionExpression', 'FunctionExpression'].includes(factory.type))
      throw new Error(`${file}: unsupported module factory`);
    const id = String(property.key.value ?? property.key.name);
    const evals = [];
    walk(factory, (node) => {
      if (node.type === 'CallExpression' && node.callee.name === 'eval') evals.push(node);
    });
    if (evals.length > 1) throw new Error(`${file}:${id}: multiple evals need explicit handling`);
    let body;
    let sourceUrl;
    let prefix = '';
    let suffix = '';
    if (evals.length) {
      const literal = evals[0].arguments[0];
      if (literal.type !== 'Literal' || typeof literal.value !== 'string')
        throw new Error(`${file}:${id}: dynamic eval is unsupported`);
      body = literal.value;
      sourceUrl = body.match(/\/\/# sourceURL=(.*)/)?.[1];
      prefix = text.slice(factory.start, literal.start);
      suffix = text.slice(literal.end, factory.end);
      // Parse for corruption without executing code. Some webpack modules use
      // return at eval scope, so allow it just as webpack's module loader does.
      parse(body, {
        ecmaVersion: 'latest',
        sourceType: 'script',
        allowReturnOutsideFunction: true,
      });
    } else {
      body = text.slice(factory.start, factory.end);
    }
    const source = `modules/${file.slice(0, -3)}/${sourcePath(sourceUrl, id)}.${id}.js`;
    if (pending.has(source)) throw new Error(`Duplicate recovered path ${source}`);
    pending.set(source, body);
    chunk.parts.push(text.slice(cursor, factory.start));
    chunk.parts.push({
      id,
      source,
      sourceUrl: sourceUrl ?? null,
      encoding: evals.length ? 'eval' : 'factory',
      prefix,
      suffix,
      recoveredSha256: hash(body),
    });
    cursor = factory.end;
    moduleCount++;
  }
  chunk.parts.push(text.slice(cursor));
  manifest.chunks.push(chunk);
}
const runtime = await readFile(path.join(from, 'runtime.js'), 'utf8');
parse(runtime, { ecmaVersion: 'latest', sourceType: 'script' });
manifest.runtimeSha256 = hash(runtime);
pending.set('runtime.js', runtime);
pending.set('manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
for (const [name, content] of pending) {
  const destination = path.join(out, name);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content);
}
console.log(`Recovered ${moduleCount} editable modules from ${files.length} chunks into ${out}`);
