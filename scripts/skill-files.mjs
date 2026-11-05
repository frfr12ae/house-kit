#!/usr/bin/env node
// Embed a skill's markdown files into its card, so people can copy each file without downloading anything.
// Usage: node scripts/skill-files.mjs   (updates every components/skills/*.html that has a data-skill-dir)
// Run it after editing anything in skills/<name>/, then run scripts/build.mjs.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : n.endsWith('.md') ? [p] : [];
});

// SKILL.md first, then README, then references and the rest alphabetically.
const rank = (rel) => (rel.endsWith('/SKILL.md') ? 0 : rel.endsWith('/README.md') ? 1 : rel.includes('/references/') ? 2 : 3);

const cardsDir = join(ROOT, 'components/skills');
for (const f of readdirSync(cardsDir).filter((n) => n.endsWith('.html'))) {
  const file = join(cardsDir, f);
  let src = readFileSync(file, 'utf8');
  const m = src.match(/data-skill-dir="([^"]+)"/);
  if (!m) continue;
  const skillDir = join(ROOT, m[1]);
  const name = basename(skillDir);
  const files = walk(skillDir)
    .map((p) => ({ p, rel: `${name}/${relative(skillDir, p)}` }))
    .sort((a, b) => rank(a.rel) - rank(b.rel) || a.rel.localeCompare(b.rel));
  const tabs = files.map((x, i) => `        <button class="tab" type="button" role="tab" aria-selected="${i === 0}">${esc(x.rel.slice(name.length + 1))}</button>`).join('\n');
  const panels = files.map((x, i) => [
    `      <div class="panel" role="tabpanel" data-path="${esc(x.rel)}"${i ? ' hidden' : ''}>`,
    `        <div class="bar"><span>Save as <code>${esc(x.rel)}</code></span><button class="btn" type="button" data-copy-file>Copy file</button></div>`,
    `        <pre>${esc(readFileSync(x.p, 'utf8').replace(/\s+$/, ''))}</pre>`,
    `      </div>`,
  ].join('\n')).join('\n');
  const block = `<!-- skill-files:start -->\n      <div class="tabs" role="tablist" aria-label="Skill files">\n${tabs}\n      </div>\n${panels}\n      <!-- skill-files:end -->`;
  src = src.replace(/<!-- skill-files:start -->[\s\S]*?<!-- skill-files:end -->/, block);
  writeFileSync(file, src);
  console.log(`${f}: ${files.length} files embedded`);
}
