/**
 * Render every Print pack at print media, write US Letter PDFs, extract text, and snapshot pages.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = process.env.PRINT_OUT || '/tmp/g5-print-verify';
const BASE = process.env.PRINT_BASE || 'http://127.0.0.1:8777';
const CHROME = process.env.CHROME || '/usr/bin/google-chrome-stable';

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const units = [
  [1, 'unit1'], [2, 'unit2'], [3, 'unit3'], [4, 'unit4'], [5, 'unit5'],
  [6, 'unit6'], [7, 'unit7'], [8, 'unit8'], [9, 'unit9'], [10, 'unit10'], [11, 'unit11'], [12, 'unit12']
];

function pdfInfo(pdfPath) {
  const txtPath = pdfPath.replace(/\.pdf$/, '.txt');
  execSync(`pdftotext -layout ${JSON.stringify(pdfPath)} ${JSON.stringify(txtPath)}`);
  const text = fs.readFileSync(txtPath, 'utf8');
  const pages = text.split('\f');
  const words = text.replace(/\s+/g, ' ').trim();
  const nPages = (execSync(`pdfinfo ${JSON.stringify(pdfPath)} | awk -F: '/Pages/ {print $2}'`).toString().trim()) || String(pages.length);
  return { text, words, nPages: +nPages, hasAnswerKey: /Answer Key/i.test(text), hasPractice: /Practice|Grade 5/i.test(text), chars: words.length };
}

function renderPng(pdfPath, tag) {
  const prefix = path.join(OUT, tag);
  execSync(`pdftoppm -png -r 110 ${JSON.stringify(pdfPath)} ${JSON.stringify(prefix)}`);
  return fs.readdirSync(OUT).filter((f) => f.startsWith(path.basename(tag)) && f.endsWith('.png')).sort()
    .map((f) => path.join(OUT, f));
}

const issues = [];
const results = [];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
});

async function runCase({ url, label, theme, viewport, level }) {
  const page = await browser.newPage();
  await page.setViewport(viewport || { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  page.on('pageerror', (e) => issues.push({ label, kind: 'pageerror', msg: String(e) }));
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForFunction(() => window.UNIT && window.Lab, { timeout: 20000 });
  if (theme === 'dark') {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('g5-theme', 'dark'); } catch (e) {}
    });
  }
  await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
  if (level === 'advanced') {
    await page.evaluate(() => {
      const b = document.querySelector('.lvl-toggle [data-l="advanced"]');
      if (b) b.click();
    });
    await page.waitForTimeout ? page.waitForTimeout(200) : new Promise((r) => setTimeout(r, 200));
  }
  const btn = await page.$('#printBtn');
  if (!btn) {
    issues.push({ label, kind: 'no-print-button' });
    await page.close();
    return;
  }
  await btn.click();
  await page.waitForFunction(() => document.querySelectorAll('#print-root .print-page').length > 0, { timeout: 20000 });
  // allow delayed print() to fire and fonts to settle
  await new Promise((r) => setTimeout(r, 250));
  const loc = await page.evaluate(() => {
    const root = document.getElementById('print-root');
    const shell = document.querySelector('.app-shell');
    return {
      parentIsBody: !!(root && root.parentElement === document.body),
      insideShell: !!(shell && root && shell.contains(root)),
      pages: root ? root.querySelectorAll('.print-page').length : 0,
      key: !!(root && root.querySelector('.print-key')),
      printed: window.__printed,
      isPrinting: document.body.classList.contains('is-printing')
    };
  });
  if (!loc.parentIsBody || loc.insideShell) issues.push({ label, kind: 'print-root-location', loc });
  if (loc.pages < 2) issues.push({ label, kind: 'too-few-pages', loc });
  if (!loc.key) issues.push({ label, kind: 'missing-answer-key', loc });

  await page.emulateMediaType('print');
  const vis = await page.evaluate(() => {
    const cs = (el) => el ? getComputedStyle(el) : null;
    const root = document.getElementById('print-root');
    const shell = document.querySelector('.app-shell');
    const body = document.body;
    const r = cs(root), s = cs(shell), b = cs(body);
    const first = root && root.querySelector('.print-head h1, .pq');
    const fc = first ? getComputedStyle(first).color : '';
    const bg = r ? r.backgroundColor : '';
    return {
      rootDisplay: r && r.display,
      rootVis: r && r.visibility,
      shellDisplay: s && s.display,
      /* a hidden parent (body > #app) hides the shell without changing its own computed display */
      shellRendered: !!(shell && shell.getClientRects().length),
      bodyBg: b && b.backgroundColor,
      bodyColor: b && b.color,
      rootColor: r && r.color,
      firstColor: fc,
      rootBg: bg,
      width: root ? root.scrollWidth : 0,
      height: root ? root.scrollHeight : 0
    };
  });
  if (vis.rootDisplay === 'none' || vis.rootVis === 'hidden') issues.push({ label, kind: 'print-root-hidden', vis });
  if (vis.shellRendered) issues.push({ label, kind: 'shell-visible-in-print', vis });
  if (vis.height < 200) issues.push({ label, kind: 'print-root-short', vis });

  const pdfPath = path.join(OUT, `${label}.pdf`);
  await page.pdf({
    path: pdfPath,
    format: 'letter',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 } // @page already has .5in; avoid double margin? 
    // actually page.pdf margin is in addition to @page. Use preferred:
  });
  // Use CSS page margins from @page by setting preferCSSPageSize
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });

  const info = pdfInfo(pdfPath);
  if (info.chars < 200) issues.push({ label, kind: 'pdf-too-little-text', chars: info.chars, sample: info.words.slice(0, 200) });
  if (!info.hasAnswerKey) issues.push({ label, kind: 'pdf-missing-key', sample: info.words.slice(0, 200) });
  if (!info.hasPractice) issues.push({ label, kind: 'pdf-missing-practice', sample: info.words.slice(0, 200) });
  const pngs = renderPng(pdfPath, label);
  results.push({ label, loc, vis, pages: info.nPages, chars: info.chars, hasKey: info.hasAnswerKey, pngs, pdfPath });
  await page.emulateMediaType('screen');
  await page.close();
}

const iphone = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const desktop = { width: 1280, height: 900, deviceScaleFactor: 1 };

try {
  for (const [num, id] of units) {
    const url = `${BASE}/units/${id}.html`;
    await runCase({ url, label: `${id}-core-iphone`, viewport: iphone, level: 'core' });
    await runCase({ url, label: `${id}-advanced-iphone`, viewport: iphone, level: 'advanced' });
  }
  await runCase({ url: `${BASE}/units/unit4.html`, label: 'unit4-core-dark-iphone', viewport: iphone, level: 'core', theme: 'dark' });
  await runCase({ url: `${BASE}/units/unit4.html`, label: 'unit4-core-desktop', viewport: desktop, level: 'core' });
} finally {
  await browser.close();
}

fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ results, issues }, null, 2));
console.log(JSON.stringify({
  cases: results.length,
  issues: issues.length,
  issueKinds: issues.reduce((a, x) => { a[x.kind] = (a[x.kind] || 0) + 1; return a; }, {}),
  summary: results.map((r) => ({ label: r.label, pages: r.pages, chars: r.chars, rootH: r.vis.height, shell: r.vis.shellDisplay, rootDisp: r.vis.rootDisplay }))
}, null, 2));
if (issues.length) {
  console.log('ISSUES', JSON.stringify(issues, null, 2));
  process.exitCode = 1;
} else {
  console.log('ALL PRINT PACKS OK');
}
