#!/usr/bin/env node
// Optional, author machine only: screenshot components for a visual check.
// Needs Playwright and Google Chrome; nothing else in the kit depends on this.
//
//   NODE_PATH=<dir containing playwright> node scripts/snap.mjs [filter] [--theme house] [--width 1280] [--out dir]
//
// Renders each matching component standalone (tokens + theme + base + component)
// and writes <out>/<category>__<slug>.png. Prints console errors from the page.

import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : dflt; };
const filter = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--'))) || '';
const theme = opt('theme', 'house');
const width = Number(opt('width', 1280));
const out = opt('out', join(ROOT, '.snaps'));
mkdirSync(out, { recursive: true });

const src = readFileSync(join(ROOT, 'navigator/registry.js'), 'utf8');
const R = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
const list = R.components.filter((c) => c.id.includes(filter));

const PREVIEW = `.okp--center{min-height:100vh;display:grid;place-items:center;padding:32px}.okp--slide{display:grid;place-items:center;background:var(--ds-panel)}`;
const browser = await chromium.launch({ channel: 'chrome' });
for (const c of list) {
  const page = await browser.newPage({ viewport: { width, height: c.preview === 'slide' ? Math.round(width * 9 / 16) : c.height } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${R.tokens}\n${R.themes[theme]}\n${R.base}\n${PREVIEW}</style><style>${c.css}</style></head><body class="okp okp--${c.preview}">${c.html}<script>${c.js}<\/script></body></html>`);
  await page.waitForTimeout(c.replay ? 2600 : 400);
  const file = join(out, `${c.category}__${c.slug}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`${errs.length ? 'ERR ' : 'ok  '}${file}${errs.length ? `\n    ${errs.join('\n    ')}` : ''}`);
  await page.close();
}
await browser.close();
