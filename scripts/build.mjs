#!/usr/bin/env node
// Builds navigator/registry.js and CREDITS.md from components/ and design-system/.
// Zero dependencies: needs only Node 18+. The generated files are committed, so
// machines that only browse and copy never run this.
//
//   node scripts/build.mjs           write registry.js and CREDITS.md
//   node scripts/build.mjs --check   lint, and fail if the generated files are stale (CI)
//   node scripts/build.mjs --lint    lint only, write nothing
//   node scripts/build.mjs --lint --registry-out <file>   lint and write the registry to <file> only

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv.includes('--check') ? 'check' : process.argv.includes('--lint') ? 'lint' : 'write';

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const kit = JSON.parse(read('kit.json'));
const categoryIds = kit.groups.flatMap((g) => g.categories.map((c) => c.id));
const RELATIONS = ['original', 'inspired-by', 'adapted-from', 'ported-from'];
const PREVIEWS = ['fill', 'center', 'slide'];

const errors = [];
const warnings = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

function parseHeader(src, file) {
  const m = src.match(/^\s*<!--([\s\S]*?)-->/);
  if (!m) { fail(file, 'missing metadata comment at the top'); return null; }
  const meta = { sources: [] };
  for (const raw of m[1].split('\n')) {
    const line = raw.trim();
    const kv = line.match(/^@([\w-]+)\s+(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    if (key === 'source') {
      const [name, url = '', relation = 'inspired-by'] = value.split('|').map((s) => s.trim());
      meta.sources.push({ name, url, relation });
    } else {
      meta[key] = value.trim();
    }
  }
  return { meta, body: src.slice(m[0].length).replace(/^\s*\n/, '') };
}

function splitBody(body) {
  const css = [];
  const js = [];
  let html = body.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (_, c) => { css.push(dedent(c)); return ''; });
  html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/g, (_, c) => { js.push(dedent(c)); return ''; });
  return { html: html.replace(/\n{3,}/g, '\n\n').trim(), css: css.join('\n\n').trim(), js: js.join('\n\n').trim() };
}

function dedent(s) {
  const lines = s.replace(/^\n+|\s+$/g, '').split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(indent)).join('\n');
}

// Every selector must sit under the component's root class, so pasting never leaks styles.
function lintCssScope(css, root, file) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const keyframeBlocks = [];
  const noKeyframes = stripped.replace(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, (k) => { keyframeBlocks.push(k); return ''; });
  for (const name of keyframeBlocks.map((k) => k.match(/@keyframes\s+([\w-]+)/)?.[1])) {
    if (name && !name.startsWith(root.slice(1))) fail(file, `@keyframes ${name} must be prefixed with ${root.slice(1)}`);
  }
  // Document-wide at-rules reach outside the component: an unnamed @page reformats the host's print layout.
  for (const m of noKeyframes.matchAll(/@page\s*([\w-]*)\s*[{:]/g)) {
    if (!m[1].startsWith(root.slice(1))) fail(file, `@page must be a named page starting with ${root.slice(1)} (assign it with "page: ${root.slice(1)}" on the slides), or it reformats every page the host prints`);
  }
  if (/@import\b/.test(noKeyframes)) fail(file, '@import pulls in outside CSS; components carry their own styles');
  for (const m of noKeyframes.matchAll(/([^{};]+)\{/g)) {
    const sel = m[1].trim();
    if (!sel || sel.startsWith('@')) continue;
    for (const part of sel.split(',')) {
      if (!part.includes(root)) fail(file, `selector "${part.trim()}" is not scoped under ${root}`);
    }
  }
}

function lintText(text, file) {
  if (/[\u2013\u2014]/.test(text)) fail(file, 'contains an en or em dash; use a comma, colon or full stop');
}

const declared = [...new Set([read('design-system/tokens.css'), read('design-system/themes/house.css')].join('\n').match(/--ds-[a-z0-9-]+(?=\s*:)/g))];

const components = [];
for (const cat of readdirSync(join(ROOT, 'components')).sort()) {
  const dir = join(ROOT, 'components', cat);
  if (!statSync(dir).isDirectory()) continue;
  if (!categoryIds.includes(cat)) { fail(`components/${cat}`, `unknown category; add it to kit.json`); continue; }
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.html')).sort()) {
    const file = `components/${cat}/${f}`;
    const src = read(file);
    lintText(src, file);
    const parsed = parseHeader(src, file);
    if (!parsed) continue;
    const { meta, body } = parsed;
    const slug = basename(f, '.html');
    for (const req of ['title', 'description', 'added']) if (!meta[req]) fail(file, `missing @${req}`);
    if (meta.added && !/^\d{4}-\d{2}-\d{2}$/.test(meta.added)) fail(file, '@added must be YYYY-MM-DD');
    const preview = meta.preview || 'fill';
    if (!PREVIEWS.includes(preview)) fail(file, `@preview must be one of ${PREVIEWS.join(', ')}`);
    const catGroups = kit.groups.flatMap((g) => g.categories).find((c) => c.id === cat)?.groups;
    if (meta.group && catGroups && !catGroups.includes(meta.group)) fail(file, `@group "${meta.group}" must be one of: ${catGroups.join(', ')}`);
    for (const s of meta.sources) {
      if (!RELATIONS.includes(s.relation)) fail(file, `@source relation "${s.relation}" must be one of ${RELATIONS.join(', ')}`);
      if (s.url && !/^https?:\/\//.test(s.url)) fail(file, `@source url "${s.url}" must start with http(s)://`);
      if (s.relation !== 'inspired-by' && !meta.license) fail(file, `code that is ${s.relation} another work needs an explicit @license`);
    }
    const parts = splitBody(body);
    const root = `.c-${slug}`;
    if (!new RegExp(`class="[^"]*\\bc-${slug}\\b`).test(parts.html)) fail(file, `root element needs class "c-${slug}"`);
    if (parts.css) lintCssScope(parts.css, root, file);
    for (const m of (parts.css + parts.html).matchAll(/(--ds-[a-z0-9-]+)\s*:/g)) {
      if (!declared.includes(m[1])) fail(file, `${m[1]} is not a design-system token; name component-local variables without the --ds- prefix`);
    }
    if (parts.js && !/^\(\s*(\(\)\s*=>|function)/.test(parts.js)) warn(file, 'wrap the script in an IIFE so it leaves no globals');
    if (parts.js && !/dataset\.ok\w+\)\s*return/.test(parts.js)) fail(file, "the script must skip roots it already set up (if (root.dataset.okInit) return; root.dataset.okInit = '1';), or pasting the component twice binds every handler twice");
    if (/#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(parts.css.replace(/\/\*[\s\S]*?\*\//g, ''))) warn(file, 'hardcoded colour in CSS; use a --ds-* token');
    // A name ending in "-" is built at runtime ('--ds-series-' + i): expand it to every token with that prefix.
    const tokens = [...new Set(((parts.css + parts.html + parts.js).match(/--ds-[a-z0-9-]+/g) || [])
      .flatMap((t) => (t.endsWith('-') ? declared.filter((d) => d.startsWith(t)) : [t])))].sort();
    components.push({
      id: `${cat}/${slug}`,
      slug,
      category: cat,
      title: meta.title,
      description: meta.description,
      group: meta.group || '',
      tags: (meta.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      added: meta.added,
      preview,
      height: Number(meta.height) || (preview === 'center' ? 320 : 480),
      replay: meta.replay === 'true',
      featured: meta.featured === 'true',
      author: meta.author || kit.author,
      license: meta.license || kit.defaultLicense,
      sources: meta.sources,
      tokens,
      ...parts,
    });
  }
}

function contrast(a, b) {
  const lum = (rgb) => {
    const [r, g, bl] = rgb.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const tokensCss = read('design-system/tokens.css');
const themes = {};
for (const f of readdirSync(join(ROOT, 'design-system/themes')).filter((n) => n.endsWith('.css') && !n.startsWith('_')).sort()) {
  themes[basename(f, '.css')] = read(`design-system/themes/${f}`);
}
const houseKeys = [...themes.house.matchAll(/(--ds-[\w-]+)\s*:/g)].map((m) => m[1]);
for (const [name, css] of Object.entries(themes)) {
  lintText(css, `design-system/themes/${name}.css`);
  const missing = houseKeys.filter((k) => !new RegExp(`${k}\\s*:`).test(css));
  if (missing.length) fail(`design-system/themes/${name}.css`, `missing tokens: ${missing.join(', ')}`);
  // Text tokens must stay readable (WCAG AA, 4.5:1) on every ground a component puts them on.
  // Pairs come from token names, so a value the check cannot read fails instead of passing.
  const decl = Object.fromEntries([...(tokensCss + '\n' + css).matchAll(/(--ds-[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  const colour = (k, depth = 0) => {
    const v = decl[k];
    if (!v || depth > 6) return null;
    const ref = v.match(/^var\((--ds-[\w-]+)\)$/);
    if (ref) return colour(ref[1], depth + 1);
    let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) return m[1].length === 3 ? [...m[1]].map((c) => parseInt(c + c, 16)) : [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
    m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*1(?:\.0*)?\s*)?\)$/i);
    return m ? [m[1], m[2], m[3]].map(Number) : null;
  };
  const grounds = ['--ds-bg', '--ds-surface', '--ds-panel', '--ds-raised', ...houseKeys.filter((k) => k.endsWith('-fill'))];
  const pairs = [['--ds-on-action', ['--ds-action']], ...['--ds-ink', '--ds-text', '--ds-muted'].map((k) => [k, grounds])];
  for (const [fg, bgs] of pairs) for (const bg of bgs) {
    const a = colour(fg), b = colour(bg);
    if (!a || !b) { fail(`design-system/themes/${name}.css`, `cannot check ${fg} on ${bg}: use an opaque hex or rgb() colour, or var() of one`); continue; }
    const r = contrast(a, b);
    if (r < 4.5) fail(`design-system/themes/${name}.css`, `${fg} on ${bg} is ${r.toFixed(2)}:1; text needs 4.5:1`);
  }
}

const registry = {
  kit,
  tokens: read('design-system/tokens.css'),
  base: read('design-system/base.css'),
  themes,
  components,
};
const registryJs = `// GENERATED by scripts/build.mjs. Do not edit; edit components/ and design-system/ instead.\nwindow.OK_REGISTRY = ${JSON.stringify(registry, null, 1)};\n`;

function creditsMd() {
  const rel = { 'inspired-by': 'Inspired by', 'adapted-from': 'Adapted from', 'ported-from': 'Ported from' };
  const rows = components.map((c) => {
    const src = c.sources.length
      ? c.sources.map((s) => `${rel[s.relation]} ${s.url ? `[${s.name}](${s.url})` : s.name}`).join('; ')
      : 'Original';
    return `| [${c.title}](components/${c.id}.html) | ${c.category} | ${src} | ${c.author} | ${c.license} |`;
  });
  return [
    '# Credits',
    '',
    'Generated by `scripts/build.mjs` from each component\'s metadata. Do not edit by hand.',
    '',
    'Every component records where its idea or code came from. "Inspired by" means the design idea came from the source and the code was written from scratch. "Adapted from" and "Ported from" mean code was reused, under the license shown.',
    '',
    '## Navigator',
    '',
    'The sidebar-and-grid browsing layout is inspired by the component browser at [21st.dev](https://21st.dev/community/components). No code was copied.',
    '',
    '## Upstream licenses',
    '',
    'Code adapted from other projects keeps its license. The full texts are in [LICENSES/](LICENSES/).',
    '',
    '## Components',
    '',
    '| Component | Category | Source | Author | License |',
    '|---|---|---|---|---|',
    ...rows,
    '',
  ].join('\n');
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
if (errors.length) { console.error(`\n${errors.length} error(s)`); process.exit(1); }

const outputs = { 'navigator/registry.js': registryJs, 'CREDITS.md': creditsMd() };
if (mode === 'check') {
  const stale = Object.entries(outputs).filter(([p, c]) => !existsSync(join(ROOT, p)) || read(p) !== c).map(([p]) => p);
  if (stale.length) { console.error(`stale: ${stale.join(', ')}. Run: node scripts/build.mjs`); process.exit(1); }
  console.log(`ok: ${components.length} components, generated files are current`);
} else if (mode === 'lint') {
  const i = process.argv.indexOf('--registry-out');
  if (i > 0) writeFileSync(process.argv[i + 1], registryJs);
  console.log(`ok: ${components.length} components lint clean`);
} else {
  for (const [p, c] of Object.entries(outputs)) writeFileSync(join(ROOT, p), c);
  console.log(`built ${components.length} components across ${new Set(components.map((c) => c.category)).size} categories, ${Object.keys(themes).length} themes`);
}
