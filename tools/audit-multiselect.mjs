/**
 * Audit every practice/test generator: if more than one option is numerically
 * equivalent to a keyed correct answer, the item must be type 'ms' (select all)
 * and the key must include the full correct set. Single-correct items stay 'mc'.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function makeEl(tag) {
  const el = {
    tagName: String(tag || 'div').toUpperCase(),
    style: {},
    className: '',
    attributes: {},
    childNodes: [],
    parentNode: null,
    textContent: '',
    nodeType: 1,
    setAttribute(k, v) { this.attributes[k] = String(v); if (k === 'class') this.className = String(v); },
    getAttribute(k) { return this.attributes[k]; },
    appendChild(c) { if (c) { c.parentNode = this; this.childNodes.push(c); } return c; },
    insertBefore(c, ref) {
      if (!c) return c;
      c.parentNode = this;
      const i = this.childNodes.indexOf(ref);
      if (i >= 0) this.childNodes.splice(i, 0, c); else this.childNodes.push(c);
      return c;
    },
    removeChild(c) {
      const i = this.childNodes.indexOf(c);
      if (i >= 0) this.childNodes.splice(i, 1);
      return c;
    },
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    matches() { return false; },
    classList: {
      _el: null,
      add(...xs) { const e = this._el; e.className = [...new Set((e.className || '').split(/\s+/).concat(xs).filter(Boolean))].join(' '); },
      remove(...xs) { const e = this._el; const drop = new Set(xs); e.className = (e.className || '').split(/\s+/).filter((x) => !drop.has(x)).join(' '); },
      toggle(x, on) { if (on === false) this.remove(x); else if (on === true) this.add(x); else if ((this._el.className || '').split(/\s+/).includes(x)) this.remove(x); else this.add(x); },
      contains(x) { return (this._el.className || '').split(/\s+/).includes(x); }
    },
    get innerHTML() {
      return this.childNodes.map((c) => c.nodeType === 3 ? c.nodeValue : (c.outerHTML || '')).join('');
    },
    set innerHTML(v) {
      this.childNodes = [];
      this._html = String(v == null ? '' : v);
    },
    get outerHTML() {
      const attrs = Object.entries(this.attributes).map(([k, v]) => ` ${k}="${v}"`).join('');
      const cls = this.className ? ` class="${this.className}"` : '';
      const body = this._html != null ? this._html : this.childNodes.map((c) => c.nodeType === 3 ? c.nodeValue : (c.outerHTML || '')).join('');
      return `<${tag}${cls}${attrs}>${body}</${tag}>`;
    }
  };
  el.classList._el = el;
  return el;
}

function makeCtx() {
  const document = {
    createElement(tag) { return makeEl(tag); },
    createElementNS(_ns, tag) { return makeEl(tag); },
    createTextNode(t) { return { nodeType: 3, nodeValue: String(t), parentNode: null }; },
    querySelector() { return null; },
    querySelectorAll() { return []; }
  };
  const ctx = {
    console,
    Math,
    Date,
    Number,
    String,
    Array,
    Object,
    Set,
    Map,
    Error,
    JSON,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    Infinity,
    NaN,
    RegExp,
    undefined,
    Promise,
    setTimeout,
    clearTimeout,
    document,
    window: null
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  ctx.self = ctx;
  return ctx;
}

function load(ctx, rel) {
  const file = path.join(root, rel);
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
}

function loadShared() {
  const ctx = makeCtx();
  // stub visuals that need a real DOM; keep fr/mixed identical to visuals.js
  const vizStub = () => '<div class="viz"></div>';
  ctx.V = new Proxy({
    fr(n, d) { return `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`; },
    mixed(w, n, d) { return `<span class="mix">${w}${this.fr(n, d)}</span>`; }
  }, { get(t, k) { if (k in t) return t[k]; if (k === 'then') return undefined; return vizStub; } });
  load(ctx, 'js/engine.js');
  load(ctx, 'js/gens5.js');
  load(ctx, 'js/v2lib.js');
  load(ctx, 'js/adapt.js');
  load(ctx, 'js/wordprob.js');
  return ctx;
}

function summarize(it) {
  if (!it) return { type: 'null' };
  const type = it.type || it.mode || 'unknown';
  const ch = it.ch || [];
  const marked = type === 'ms' || it.mode === 'ms'
    ? (it.a != null && it.a.length !== undefined && typeof it.a !== 'string' ? it.a : (it.cs || []))
    : (it.a != null && typeof it.a === 'number' ? [it.a] : (it.ci != null ? [it.ci] : []));
  return { type, fmt: it.fmt, q: it.q && String(it.q).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80), ch: ch.map((c) => String(c).replace(/<[^>]+>/g, '/').replace(/\/+/g, '/').trim()), marked };
}

function auditItem(U, raw, source) {
  const issues = [];
  if (!raw) return issues;
  const it = raw.mode ? (raw.mode === 'mc' ? Object.assign({}, raw, { type: 'mc', a: raw.ci }) : raw.mode === 'ms' ? Object.assign({}, raw, { type: 'ms', a: raw.cs }) : raw) : raw;
  if (!it.ch || !it.ch.length) return issues;
  if (it.type && it.type !== 'mc' && it.type !== 'ms') return issues;
  const marked = it.a != null ? it.a : it.ci;
  if (marked == null) {
    issues.push({ kind: 'missing-key', source, item: summarize(it) });
    return issues;
  }
  const idx = U.expandCorrectChoices(it.ch, marked);
  const orig = (Array.isArray(marked) ? marked : [marked]).map(Number).filter((i) => i >= 0);
  const type = it.type;
  if (idx.length > 1 && type !== 'ms') {
    issues.push({ kind: 'should-be-ms', source, expected: idx, gotType: type, gotKey: orig, item: summarize(it) });
  }
  if (type === 'ms') {
    const got = orig.slice().sort((a, b) => a - b).join(',');
    const want = idx.slice().sort((a, b) => a - b).join(',');
    if (got !== want) {
      issues.push({ kind: 'incomplete-ms-key', source, expected: idx, got: orig, item: summarize(it) });
    }
    if (idx.length < 1) issues.push({ kind: 'ms-empty-key', source, item: summarize(it) });
  }
  if (type === 'mc' && orig.length !== 1 && !(idx.length <= 1)) {
    issues.push({ kind: 'mc-key-shape', source, item: summarize(it) });
  }
  // keyed index out of range
  orig.forEach((i) => {
    if (i < 0 || i >= it.ch.length) issues.push({ kind: 'key-oob', source, i, item: summarize(it) });
  });
  return issues;
}

const N = 80;
const issues = [];
const stats = { generators: 0, items: 0, ms: 0, mc: 0, other: 0, promotedWouldCatch: 0 };

// --- G5 library ---
{
  const ctx = loadShared();
  const G5 = ctx.G5;
  const U = ctx.U;
  const skills = G5.skills();
  for (const s of skills) {
    for (const level of ['std', 'adv']) {
      stats.generators++;
      let made = 0, fails = 0;
      for (let i = 0; i < N; i++) {
        let it = null;
        try { it = G5.make(s.id, level); } catch (e) { fails++; continue; }
        if (!it) { fails++; continue; }
        made++;
        stats.items++;
        const lab = ctx.Adapt.toLab(it);
        const t = lab.type || lab.mode;
        if (t === 'ms') stats.ms++;
        else if (t === 'mc') stats.mc++;
        else stats.other++;
        issues.push(...auditItem(U, lab, `G5:${s.id}:${level}`));
      }
      if (made === 0) issues.push({ kind: 'skill-failed', source: `G5:${s.id}:${level}`, fails });
    }
  }
}

// --- each unit's skills + test packs ---
const unitFiles = [
  'js/units/unit1.js', 'js/units/unit2.js', 'js/units/unit3.js', 'js/units/unit4.js',
  'js/units/unit5.js', 'js/units/unit6.js', 'js/units/unit7.js', 'js/units/unit8.js',
  'js/units/unit9.js', 'js/units/unit10.js', 'js/units/unit11.js'
];

for (const uf of unitFiles) {
  const ctx = loadShared();
  load(ctx, uf);
  const UNIT = ctx.UNIT;
  if (ctx.WP && UNIT) ctx.WP.attach(UNIT);
  if (!UNIT) {
    issues.push({ kind: 'unit-missing', source: uf });
    continue;
  }
  for (const level of ['core', 'advanced']) {
    const T = UNIT[level];
    if (!T) continue;
    const skills = T.skills || [];
    for (const s of skills) {
      if (!s || typeof s.gen !== 'function') continue;
      stats.generators++;
      let made = 0;
      for (let i = 0; i < N; i++) {
        let it = null;
        try { it = s.gen(); } catch (e) { continue; }
        if (!it) continue;
        made++;
        stats.items++;
        const t = it.type;
        if (t === 'ms') stats.ms++;
        else if (t === 'mc') stats.mc++;
        else stats.other++;
        issues.push(...auditItem(ctx.U, it, `${UNIT.id || uf}:${level}:${s.id || s.name}`));
      }
      if (made === 0) issues.push({ kind: 'skill-failed', source: `${UNIT.id}:${level}:${s.id || s.name}` });
    }
    if (typeof T.test === 'function') {
      stats.generators++;
      for (let pack = 0; pack < 20; pack++) {
        let items = [];
        try { items = T.test() || []; } catch (e) {
          issues.push({ kind: 'test-failed', source: `${UNIT.id}:${level}:test`, error: String(e) });
          break;
        }
        items.forEach((it, i) => {
          if (!it) return;
          stats.items++;
          if (it.type === 'ms') stats.ms++;
          else if (it.type === 'mc') stats.mc++;
          else stats.other++;
          issues.push(...auditItem(ctx.U, it, `${UNIT.id}:${level}:test#${pack}.${i}`));
          if (it.type === 'multi' && it.parts) {
            it.parts.forEach((p, j) => {
              issues.push(...auditItem(ctx.U, p, `${UNIT.id}:${level}:test#${pack}.${i}p${j}`));
            });
          }
        });
      }
    }
  }
}

// parseChoiceValue + grading + normalize fixtures
{
  const ctx = loadShared();
  const U = ctx.U;
  const fr = (n, d) => `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`;
  const cases = [
    [fr(7, 10), 0.7],
    [fr(70, 100), 0.7],
    [fr(7, 100), 0.07],
    ['0.7', 0.7],
    ['70%', 0.7],
    ['1 1/2', 1.5],
    [ctx.V.mixed(1, 1, 2), 1.5],
    ['1' + fr(1, 12), 1 + 1/12],
    [fr(11, 12), 11/12],
    ['2' + fr(1, 4), 2.25],
    ['4:10', 0.4],
    ['0.6 × 4', null],
    ['equilateral', null],
    ['4500 g', null]
  ];
  for (const [html, want] of cases) {
    const got = U.parseChoiceValue(html);
    const ok = want == null ? got == null : U.valuesClose(got, want);
    if (!ok) issues.push({ kind: 'parse-fixture', source: String(html).slice(0, 40), got, expected: want });
  }
  const oldBug = {
    type: 'mc', fmt: 'MULTIPLE CHOICE',
    q: 'Which fraction is equal to 0.7?',
    ch: [fr(70, 100), fr(7, 100), fr(7, 10), fr(8, 10)],
    a: 2
  };
  const fixed = U.normalizeChoiceItem(oldBug);
  if (fixed.type !== 'ms' || String(fixed.a) !== '0,2') {
    issues.push({ kind: 'normalize-fixture', source: '0.7 mc fixture', item: { type: fixed.type, a: fixed.a } });
  }
  function gradeMS(selected, want) {
    return [...selected].sort().join(',') === want.slice().sort().join(',');
  }
  const sel = new Set();
  sel.add(0); // toggle 70/100 on
  if (gradeMS(sel, [0, 2])) issues.push({ kind: 'grade-logic', source: 'partial should fail' });
  sel.add(2); // toggle 7/10 on
  if (!gradeMS(sel, [0, 2])) issues.push({ kind: 'grade-logic', source: 'full set should pass' });
  sel.delete(0); // toggle off
  if (gradeMS(sel, [0, 2])) issues.push({ kind: 'grade-logic', source: 'toggle-off should fail' });
  sel.add(0); sel.add(1); // extra wrong
  if (gradeMS(sel, [0, 2])) issues.push({ kind: 'grade-logic', source: 'superset should fail' });
  console.log('fixture tests done');
}

// Simulate the reported 0.7 item on current genD2F
{
  const ctx = loadShared();
  load(ctx, 'js/units/unit4.js');
  const d2f = (ctx.UNIT.core.skills || []).find((s) => s.id === 'd2f');
  const eq = (ctx.UNIT.core.skills || []).find((s) => s.id === 'equal');
  const counts = { ms: 0, mc: 0, twoPlus: 0, included710and70100: 0 };
  for (let i = 0; i < 200; i++) {
    const it = d2f.gen();
    if (it.type === 'ms') counts.ms++; else if (it.type === 'mc') counts.mc++;
    const vals = (it.ch || []).map((c) => ctx.U.parseChoiceValue(c));
    const rights = (it.type === 'ms' ? it.a : [it.a]).map((k) => vals[k]);
    if ((it.type === 'ms' ? it.a.length : 1) >= 2) counts.twoPlus++;
    const texts = (it.ch || []).map((c) => ctx.U.strip(c));
    if (texts.includes('710') && texts.includes('70100')) counts.included710and70100++;
    if (it.type === 'mc' && texts.includes('710') && texts.includes('70100')) {
      issues.push({ kind: 'regression-07', source: 'd2f', item: summarize(it) });
    }
  }
  console.log('d2f sample (200):', counts);
  const eqCounts = { ms: 0, mc: 0, minRights: 99, maxRights: 0 };
  for (let i = 0; i < 200; i++) {
    const it = eq.gen();
    if (it.type === 'ms') eqCounts.ms++; else eqCounts.mc++;
    const n = it.type === 'ms' ? it.a.length : 1;
    eqCounts.minRights = Math.min(eqCounts.minRights, n);
    eqCounts.maxRights = Math.max(eqCounts.maxRights, n);
  }
  console.log('equal sample (200):', eqCounts);
}

const byKind = {};
for (const x of issues) byKind[x.kind] = (byKind[x.kind] || 0) + 1;
console.log('STATS', stats);
console.log('ISSUES BY KIND', byKind);
console.log('ISSUE COUNT', issues.length);
if (issues.length) {
  const shown = issues.slice(0, 25);
  for (const x of shown) {
    console.log('---', x.kind, x.source);
    console.log(JSON.stringify({ expected: x.expected, got: x.got, gotType: x.gotType, gotKey: x.gotKey, item: x.item, fails: x.fails, error: x.error }, null, 0));
  }
  if (issues.length > 25) console.log(`... and ${issues.length - 25} more`);
  process.exitCode = 1;
} else {
  console.log('ALL CLEAR');
}
