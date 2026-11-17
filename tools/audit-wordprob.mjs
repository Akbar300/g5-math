/**
 * Generate many items from every Word problems skill and check:
 * answers present and in range, no negative money, clean money decimals,
 * no NaN/undefined, and each named generator usually succeeds.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
function makeEl(tag) {
  const el = { tagName: String(tag || 'div').toUpperCase(), style: {}, className: '', attributes: {}, childNodes: [], parentNode: null, textContent: '', nodeType: 1,
    setAttribute(k, v) { this.attributes[k] = String(v); }, getAttribute(k) { return this.attributes[k]; },
    appendChild(c) { if (c) this.childNodes.push(c); return c; }, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; },
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } } };
  return el;
}
const document = { createElement(tag) { return makeEl(tag); }, createElementNS(_n, tag) { return makeEl(tag); }, createTextNode(t) { return { nodeType: 3, nodeValue: String(t) }; }, querySelector() { return null; }, querySelectorAll() { return []; }, documentElement: { setAttribute() {}, getAttribute() { return ''; }, style: {} } };
const ctx = { console, Math, Date, Number, String, Array, Object, Set, Map, Error, JSON, parseInt, parseFloat, isNaN, isFinite, Infinity, NaN, RegExp, undefined, Promise, setTimeout, clearTimeout, document, window: null };
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
ctx.V = { fr(n, d) { return `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`; }, mixed(w, n, d) { return `<span class="mix">${w}${this.fr(n, d)}</span>`; } };
for (const rel of ['js/engine.js', 'js/gens5.js', 'js/v2lib.js', 'js/adapt.js', 'js/wordprob.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, rel), 'utf8'), ctx, { filename: rel });
}
const WP = ctx.WP;
const list = WP.list();
const issues = [];
const stats = { generators: list.length, items: 0, ok: 0, fail: 0, money: 0 };
for (const g of list) {
  let ok = 0;
  for (let i = 0; i < 40; i++) {
    const it = WP.make(g.unit, g.level, g.id);
    if (!it) { stats.fail++; continue; }
    stats.items++;
    const err = WP.validate(it);
    const text = JSON.stringify(it);
    if (/\$-\d/.test(text)) issues.push({ kind: 'negative-money', gen: g.id, unit: g.unit });
    if (/\$\d+\.\d{3,}/.test(text)) issues.push({ kind: 'messy-money', gen: g.id, unit: g.unit, sample: text.match(/\$\d+\.\d{3,}/)[0] });
    if (/\$\d+\.\d{2}/.test(text)) stats.money++;
    if (err) { issues.push({ kind: 'invalid', gen: g.id, unit: g.unit, level: g.level, err }); stats.fail++; }
    else { ok++; stats.ok++; }
  }
  if (ok < 20) issues.push({ kind: 'unreliable', gen: g.id, unit: g.unit, level: g.level, ok });
}
console.log('WP GENERATORS', stats.generators);
console.log('ITEMS ok/fail', stats.ok, stats.fail, 'money-tagged', stats.money);
console.log('ISSUES', issues.length);
if (issues.length) {
  issues.slice(0, 20).forEach((x) => console.log(JSON.stringify(x)));
  process.exitCode = 1;
} else {
  console.log('ALL WORD-PROBLEM CHECKS CLEAR');
}
console.log('COUNT BY UNIT');
const by = {};
for (const g of list) {
  const k = 'U' + g.unit + ' ' + g.level;
  by[k] = (by[k] || 0) + 1;
}
console.log(by);
