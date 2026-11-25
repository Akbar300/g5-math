/**
 * Audit every Learn card: the Big idea, the See it picture and the Worked example
 * should use the same example. For each card in UNIT.core.lessons and
 * UNIT.advanced.lessons (units 1-11), pull the numbers out of:
 *   - the Big idea text (card.html),
 *   - the See it (viz output text, including SVG labels),
 *   - the Worked example (steps + example).
 * Warn when the Big idea and the See it share no number, or the Big idea and the
 * steps share no number. Skips "Your turn" / "Try one" practice cards and Unit 9
 * cards without a See it. Exits nonzero if any warning remains.
 *
 * Cards listed in NEEDS_WIDGET have a See it that needs a different kind of
 * picture (not just new numbers). They print in their own table and do not fail
 * the run; pass --strict to fail on them too. Remove an entry once its widget ships.
 *
 * Usage: node tools/audit-seeit.mjs [--json] [--strict]
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

/* Playwright may be installed globally (NODE_PATH); require() finds it there, a bare ESM import does not. */
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

/* Runs in the page: collect the three text sources for every card. */
const collect = () => {
  const out = [];
  /* Join text nodes with spaces so separate SVG labels, table cells and the two halves of a stacked
     fraction stay separate numbers (axis ticks 2 3 4 must not read as 234). */
  const nodeText = (n) => {
    const parts = [], tw = document.createTreeWalker(n, NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) parts.push(tw.currentNode.nodeValue);
    return parts.join(' ');
  };
  const textOf = (html) => { const d = document.createElement('div'); d.innerHTML = html || ''; return nodeText(d); };
  for (const lvl of ['core', 'advanced']) {
    const lessons = (UNIT[lvl] && UNIT[lvl].lessons) || [];
    lessons.forEach((les) => (les.cards || []).forEach((card) => {
      const ex = (window.G5Learn && G5Learn.forCard(les, card)) || {};
      const c = Object.assign({}, card, ex);
      let viz = '';
      if (c.viz) {
        try {
          const o = typeof c.viz === 'function' ? c.viz() : c.viz;
          if (o instanceof Node) viz = nodeText(o);
          else viz = textOf(String(o));
        } catch (e) { viz = 'ERROR ' + e.message; }
      }
      out.push({
        lvl, lesson: les.id, title: card.t || '', hasViz: !!c.viz,
        big: textOf(card.html || card.h || ''),
        viz,
        steps: (c.steps || []).map(textOf).join(' ') + ' ' + textOf(c.example || '')
      });
    }));
  }
  return out;
};

/* Numbers as written: 3.4, 12, 0.75. "12.40" and "12.4" count as the same. */
function nums(s) {
  const set = new Set();
  const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
  const t = String(s || '').replace(/(\d),(?=\d{3}\b)/g, '$1').replace(/−/g, '-')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => ' ' + [...m].map((c) => SUP[c]).join('') + ' '); /* 10³ is 10 and 3, not 103 */
  for (const m of t.matchAll(/\d+(?:\.\d+)?/g)) set.add(String(+m[0]));
  return set;
}
/* 0, 1 and powers of 10 turn up on almost every card ("× 10", "1 whole"), so they don't count as a match. */
const COMMON = new Set(['0', '1', '10', '100', '1000']);
const plain = (set) => new Set([...set].filter((x) => !COMMON.has(x)));
const shares = (a, b) => {
  const a2 = plain(a), b2 = plain(b);
  if (!a2.size || !b2.size) return [...a].some((x) => b.has(x)); /* a powers-of-10 card: compare everything */
  return [...a2].some((x) => b2.has(x));
};
const show = (set) => [...set].slice(0, 8).join(' ') + (set.size > 8 ? ' …' : '');

/* lesson|title|where → why the picture itself has to change. */
const NEEDS_WIDGET = {
  'u6L1|Big unit → small unit: multiply|See it': 'metricLadder has no amounts; needs 3.5 m moving to 350 cm on the ladder.',
  'u6L1|Small unit → big unit: divide|See it': 'metricLadder shows length only; the example is 2400 g → 2.4 kg.',
  'u6L2|Benchmarks|See it': 'Bar graph used for benchmarks; needs real-object benchmark pictures.',
  'u9L5|Parts of a circle|See it': 'Big idea is the C = π × d rule with no example; a circle with d and C measured would match it.',
  'u10B1|Outliers|See it': 'A line plot of 30 to 80 is too wide for linePlot; needs a scaled plot that shows the mean and median shift.',
};
const browser = await chromium.launch();
const warnings = [];
const errors = [];
for (let u = 1; u <= 11; u++) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(`unit${u}: ${e.message}`));
  await page.goto(`${base}/units/unit${u}.html`);
  await page.waitForFunction(() => window.UNIT && window.G5Learn, null, { timeout: 10000 });
  const cards = await page.evaluate(collect);
  const seen = new Set();
  for (const c of cards) {
    if (/^(your turn|try one)\b/i.test(c.title)) continue;
    if (u === 9 && !c.hasViz) continue;
    const key = c.lesson + '|' + c.title;
    if (seen.has(key)) continue; /* Unit 9 Advanced reuses the Core lessons */
    seen.add(key);
    const B = nums(c.big), Vz = nums(c.viz), S = nums(c.steps);
    if (!plain(B).size && ![...B].some((x) => x !== '0' && x !== '1')) continue; /* Big idea has no example numbers */
    if (c.hasViz && Vz.size && !shares(B, Vz)) warnings.push({ unit: u, lvl: c.lvl, lesson: c.lesson, title: c.title, where: 'See it', big: show(B), other: show(Vz) });
    if (S.size && !shares(B, S)) warnings.push({ unit: u, lvl: c.lvl, lesson: c.lesson, title: c.title, where: 'Worked example', big: show(B), other: show(S) });
  }
  await page.close();
}
await browser.close();
server.close();

const strict = process.argv.includes('--strict');
warnings.forEach((w) => { w.needsWidget = NEEDS_WIDGET[`${w.lesson}|${w.title}|${w.where}`] || null; });
const open = warnings.filter((w) => strict || !w.needsWidget);
const known = warnings.filter((w) => w.needsWidget);
const row = (w) => `| ${w.unit} | ${w.lvl === 'core' ? 'Core' : 'Adv'} | ${w.lesson} | ${w.title} | ${w.where} | ${w.big} | ${w.other} |`;
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ warnings, errors }, null, 2));
} else {
  if (errors.length) { console.log('Page errors:'); errors.forEach((e) => console.log('  ' + e)); }
  const fixable = warnings.filter((w) => !w.needsWidget);
  if (!fixable.length) console.log('audit-seeit: no number mismatches to fix.');
  else {
    console.log(`audit-seeit: ${fixable.length} warning(s)\n`);
    console.log('| Unit | Level | Lesson | Card | Mismatch | Big idea numbers | Other numbers |');
    console.log('|---|---|---|---|---|---|---|');
    fixable.forEach((w) => console.log(row(w)));
  }
  if (known.length) {
    console.log(`\nNeeds a new widget (${known.length}, not counted as failures${strict ? ' — except with --strict' : ''}):\n`);
    console.log('| Unit | Level | Lesson | Card | Mismatch | Big idea numbers | Other numbers |');
    console.log('|---|---|---|---|---|---|---|');
    known.forEach((w) => console.log(row(w) + '\n  → ' + w.needsWidget));
  }
}
if (open.length || errors.length) process.exitCode = 1;
