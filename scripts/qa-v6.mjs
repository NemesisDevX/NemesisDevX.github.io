// Portfolio smoke tests — real Chromium, same files published on GitHub Pages.
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const root = process.cwd();
const output = path.join(root, 'qa-screenshots');
fs.mkdirSync(output, { recursive: true });
const pages = [
  { file: 'index.html', lang: 'en', kind: 'home' },
  { file: 'index-ar.html', lang: 'ar', kind: 'home' },
  { file: 'work.html', lang: 'en', kind: 'work' },
  { file: 'work-ar.html', lang: 'ar', kind: 'work' }
];
const viewports = [
  [320, 700], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]
];
const expected = ['195564', '6349', '6373', '6301', '75', '6337', '6332', '6324'];
let errors = [];
let tests = 0;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const p of pages) {
    for (const [width, height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
      const page = await context.newPage();
      const runtimeErrors = [];
      page.on('pageerror', e => runtimeErrors.push(e.message));
      await page.goto(pathToFileURL(path.join(root, p.file)).href, { waitUntil: 'load' });
      await page.locator('.proof-row').first().waitFor();
      const info = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
        h1: document.querySelector('h1')?.getBoundingClientRect().toJSON(),
        background: getComputedStyle(document.body).backgroundColor,
        hasImage: !!document.querySelector('img'),
        lang: document.documentElement.lang,
        rows: document.querySelectorAll('.proof-row').length,
        all: [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(decodeURIComponent(a.hash.slice(1)))),
        appLinks: [...document.querySelectorAll('a[href*="play.google.com/store/apps/details"]')].length,
        badTargets: [...document.querySelectorAll('a[href]')].filter(a => a.getAttribute('href') === '#' || !a.getAttribute('href').trim()).length,
        cssLoaded: !!document.styleSheets.length
      }));
      const key = p.file + ':' + width;
      const broken = [];
      if (info.scroll > info.client + 1) broken.push('overflow=' + (info.scroll - info.client) + 'px');
      if (!info.h1 || info.h1.width <= 0) broken.push('missing h1');
      if (info.h1 && (info.h1.left < -2 || info.h1.right > width + 2)) broken.push('h1 clipped');
      if (info.rows !== 8) broken.push('proofRows=' + info.rows);
      const visibleOrder = await page.locator('.proof-row').evaluateAll(nodes => nodes.map(el => (el.getAttribute('href').match(/\/pull\/(\d+)/) || [])[1]));
      if (visibleOrder.join(',') !== expected.join(',')) broken.push('priority order=' + visibleOrder.join(','));
      if (p.kind === 'work') {
        const caseOrder = await page.locator('section.case-block[id="flutter"],section.case-block[id="dtd"],section.case-block[id="ci"]').evaluateAll(nodes => nodes.map(el => el.id));
        if (caseOrder.join(',') !== 'flutter,dtd,ci') broken.push('case study order=' + caseOrder.join(','));
      }

      if (info.hasImage) broken.push('unexpected image');
      if (!info.appLinks || info.appLinks !== 1) broken.push('Google Play link count=' + info.appLinks);
      if (!info.all) broken.push('broken in-page anchor');
      if (info.badTargets) broken.push('placeholder links');
      if (!info.cssLoaded) broken.push('CSS not loaded');
      if (info.lang !== p.lang) broken.push('wrong lang');
      if (runtimeErrors.length) broken.push('JS error: ' + runtimeErrors.join('; '));
      for (const n of expected) {
        if (!(await page.locator('.proof-row[href*="/pull/' + n + '"]').count())) broken.push('missing PR #' + n);
      }
      if (await page.locator('.community').count()) broken.push('unwanted community directory section');
      if (broken.length) errors.push(key + ': ' + broken.join(', '));
      if ((width === 390 || width === 1440) && ['index.html','index-ar.html','work.html'].includes(p.file)) {
        await page.screenshot({ path: path.join(output, p.file.replace('.html', '') + '-' + width + '.png'), fullPage: false });
      }
      console.log((broken.length ? 'FAIL ' : 'PASS ') + key + ' scroll=' + info.scroll + ' client=' + info.client + (broken.length ? ' / ' + broken.join(', ') : ''));
      tests++;
      await context.close();
    }
  }
} finally { await browser.close(); }
console.log('QA SUMMARY: ' + (tests - errors.length) + '/' + tests + ' passed.');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
