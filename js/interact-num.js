/* Number widgets for See it (load after interact.js; they join window.IX):
     IX.lineLab(opts)      number line: modes 'round', 'hop', 'compare' (drop and ray: add to LL_MODES)
     IX.decimalStack(opts) line up the points, fill zeros, add or subtract column by column
     IX.placeShift(opts)   digits slide on a place-value strip: modes 'pair' (make the divisor whole), 'shift'
     IX.fitStrips(opts)    how many pieces fit in a whole (4.8 ÷ 0.6, 3 ÷ 1/4)
   Same house rules as interact.js: root "viz ix", ix-btn buttons, ix-fb feedback, 44 px targets,
   first state already shows the card's numbers, prefers-reduced-motion skips the slides. */
(function (w) {
  const IX = w.IX = w.IX || {};
  const NS = 'http://www.w3.org/2000/svg';
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const btn = (label, onClick, cls) => { const b = h('button', 'ix-btn' + (cls ? ' ' + cls : ''), label); b.type = 'button'; b.onclick = onClick; return b; };
  const sv = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); if (parent) parent.appendChild(e); return e; };
  const txt = (parent, x, y, s, attrs) => { const t = sv('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': '14', 'font-weight': '800', fill: 'var(--ink)' }, attrs || {}), parent); t.textContent = s; return t; };
  const calm = () => !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const fr = (n, d) => `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`;
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const neg = (v) => (v < 0 ? '−' + (-v) : String(v));
  const paren = (v) => (v < 0 ? '(' + neg(v) + ')' : String(v));

  /* Decimal strings as scaled integers: '4.738' → { n: 4738, dp: 3 }. */
  const pdec = (v) => { const t = String(v).trim(); const i = t.indexOf('.'); return { s: t, n: +t.replace('.', ''), dp: i < 0 ? 0 : t.length - i - 1 }; };
  /* integer v with k implied decimals, written with exactly `places` decimals (v must divide evenly) */
  function fmtScaled(v, k, places) {
    const q = Math.round(v / Math.pow(10, k - places));
    if (!places) return String(q);
    let s = String(Math.abs(q)).padStart(places + 1, '0');
    return (q < 0 ? '−' : '') + s.slice(0, -places) + '.' + s.slice(-places);
  }
  const trimDec = (s) => (s.indexOf('.') < 0 ? s : s.replace(/0+$/, '').replace(/\.$/, ''));
  const PLACE = { '-3': 'thousands', '-2': 'hundreds', '-1': 'tens', 0: 'ones', 1: 'tenths', 2: 'hundredths', 3: 'thousandths' };

  /* ======================= lineLab ======================= */
  const LL_W = 360;
  function axisSvg(H) { const s = sv('svg', { viewBox: `0 0 ${LL_W} ${H}`, class: 'll-svg', role: 'img' }); return s; }

  /* --- round: { x:'4.738', place:1, wrong:'4.8', more:['3.15', ...] } --- */
  function llRound(o) {
    const root = h('div', 'viz ix ix-col ix-ll');
    let x = String(o.x), more = (o.more || []).slice(), mi = 0;
    function build() {
      root.innerHTML = '';
      const p = +o.place || 0, X0 = pdec(x);
      const k = Math.max(X0.dp, p + 1), X = X0.n * Math.pow(10, k - X0.dp), U = Math.pow(10, k - p);
      const lo = Math.floor(X / U) * U, hi = lo + U, half = lo + U / 2;
      const all = fmtScaled(X, k, k);                       /* x written with k decimals */
      const intLen = all.indexOf('.') < 0 ? all.length : all.indexOf('.');
      const charIdx = (place) => (place <= 0 ? intLen - 1 + place : intLen + place); /* index in `all` of a place */
      const rIdx = charIdx(p), dIdx = charIdx(p + 1);
      const decider = +all[dIdx], up = decider >= 5, ans = up ? hi : lo;
      const L = (v) => fmtScaled(v, k, p);
      const shownX = x;
      /* chain trap: round to the next place first, then again */
      const U2 = U / 10, roundTo = (v, u) => Math.floor(v / u) * u + ((v % u) >= u / 2 ? u : 0);
      const r1 = U2 >= 1 && k >= p + 2 ? roundTo(X, U2) : X, chainVal = roundTo(r1, U);
      const chain = k >= p + 2 && chainVal !== ans ? { mid: r1, end: chainVal } : null;

      /* the number, big, with the rounding digit gold and the decider peach */
      const num = h('div', 'll-num');
      const digs = [];
      shownX.split('').forEach((ch, i) => {
        const allI = i; /* shownX and all share positions up to shownX's length */
        const cls = 'll-d' + (allI === rIdx ? ' rd' : allI === dIdx ? ' dc' : allI > dIdx && ch !== '.' ? ' rest' : '') + (ch === '.' ? ' pt' : '');
        const sp = h('span', cls, ch);
        if (allI === rIdx) sp.dataset.tag = PLACE[p];
        if (allI === dIdx) sp.dataset.tag = 'decider';
        digs.push(sp); num.appendChild(sp);
      });
      if (dIdx >= shownX.length) { /* decider is an implied 0 */ const sp = h('span', 'll-d dc ghost', '0'); sp.dataset.tag = 'decider'; num.appendChild(sp); }
      const arrow = h('span', 'll-arrow', '→');
      const res = h('span', 'll-res', '?');
      num.appendChild(arrow); num.appendChild(res);
      root.appendChild(num);
      root.appendChild(h('div', 'ix-q ll-ask', `Round to the nearest <b>${p === 0 ? 'whole number' : PLACE[p].replace(/s$/, '')}</b>. Which neighbor is ${shownX} closer to?`));

      /* the number line between the two neighbors */
      const H = 118, Y = 74, x0 = 34, x1 = LL_W - 34;
      const pos = (v) => x0 + (v - lo) / (hi - lo) * (x1 - x0);
      const s = axisSvg(H);
      sv('line', { x1: x0, y1: Y, x2: x1, y2: Y, stroke: 'var(--ink)', 'stroke-width': '3.5', 'stroke-linecap': 'round' }, s);
      for (let i = 0; i <= 10; i++) {
        const v = lo + i * U / 10, big = i === 0 || i === 10, mid = i === 5;
        sv('line', { x1: pos(v), y1: Y - (big ? 12 : mid ? 16 : 6), x2: pos(v), y2: Y + (big ? 12 : mid ? 0 : 6), stroke: 'var(--ink)', 'stroke-width': big ? 3 : 1.6, 'stroke-dasharray': mid ? '3 3' : '' }, s);
      }
      sv('line', { x1: pos(half), y1: Y - 40, x2: pos(half), y2: Y + 14, stroke: 'var(--viz-coral)', 'stroke-width': '2', 'stroke-dasharray': '5 4' }, s);
      txt(s, pos(half), Y + 30, 'halfway ' + fmtScaled(half, k, p + 1), { 'font-size': '12.5', fill: 'var(--muted)' });
      const dist = sv('g', { class: 'll-dist' }, s);
      const dot = sv('g', { class: 'll-dot' + (calm() ? ' calm' : '') }, s);
      sv('line', { x1: 0, y1: Y - 30, x2: 0, y2: Y - 9, stroke: 'var(--ink)', 'stroke-width': '1.5' }, dot);
      sv('circle', { cx: 0, cy: Y, r: 9, fill: 'var(--viz-coral)', stroke: 'var(--ink)', 'stroke-width': '2.5' }, dot);
      txt(dot, 0, Y - 35, shownX, { 'font-size': '15' });
      dot.style.transform = `translateX(${pos(X)}px)`;
      root.appendChild(h('div', 'll-stage')).appendChild(s);

      /* the two neighbors are the answer buttons */
      const pick = h('div', 'll-pick');
      const bLo = btn(L(lo), () => choose(lo), 'll-nb'), bHi = btn(L(hi), () => choose(hi), 'll-nb');
      bLo.setAttribute('aria-label', 'Rounds to ' + L(lo)); bHi.setAttribute('aria-label', 'Rounds to ' + L(hi));
      pick.appendChild(bLo); pick.appendChild(h('span', 'll-or', 'or')); pick.appendChild(bHi);
      root.appendChild(pick);
      const fb = h('div', 'ix-fb', '');
      root.appendChild(fb);
      const bar = h('div', 'ix-ctr ll-bar');
      root.appendChild(bar);
      if (o.wrong && o.wrong !== L(lo) && o.wrong !== L(hi)) bar.appendChild(btn(`What about ${o.wrong}?`, () => {
        fb.className = 'ix-fb no';
        fb.innerHTML = `<b>${o.wrong}</b> is not one of the two neighbors, so it can't be the answer. To the nearest ${p === 0 ? 'whole number' : PLACE[p].replace(/s$/, '')}, ${shownX} lands on <b>${L(lo)}</b> or <b>${L(hi)}</b>. Keep the digits where they are.`;
      }, 'ghost'));
      const dLo = fmtScaled(X - lo, k, k), dHi = fmtScaled(hi - X, k, k);
      function showDist() {
        dist.innerHTML = '';
        const yb = Y + 46;
        [[lo, X, dLo], [X, hi, dHi]].forEach(([a, b, lab], i) => {
          if (b - a <= 0) return;
          sv('path', { d: `M ${pos(a) + 2} ${yb - 6} V ${yb} H ${pos(b) - 2} V ${yb - 6}`, fill: 'none', stroke: i ? 'var(--viz-blue)' : 'var(--viz-teal)', 'stroke-width': '2.5' }, dist);
        });
        s.setAttribute('viewBox', `0 0 ${LL_W} ${H + 26}`);
        txt(dist, (pos(lo) + pos(X)) / 2, Y + 66, trimDec(dLo), { 'font-size': '12.5', fill: 'var(--viz-teal)' });
        txt(dist, (pos(X) + pos(hi)) / 2, Y + 66, trimDec(dHi), { 'font-size': '12.5', fill: 'var(--viz-blue)' });
      }
      const rule = up ? `${decider} is 5 or more, so bump the ${all[rIdx]} up` : `${decider} is 4 or less, so keep the ${all[rIdx]}`;
      let done = false;
      function choose(v) {
        if (done) return;
        if (v === ans) {
          done = true;
          dot.style.transform = `translateX(${pos(ans)}px)`;
          digs.forEach((sp, i) => { if (i > rIdx && (p === 0 || !sp.classList.contains('pt'))) sp.classList.add('gone'); });
          (v === lo ? bLo : bHi).classList.add('on');
          [bLo, bHi].forEach((b) => { b.disabled = true; });
          /* odometer roll for the digits that change */
          const out = L(ans);
          res.innerHTML = '';
          out.split('').forEach((ch, i) => {
            const old = all[i] != null ? all[i] : ch;
            if (old !== ch && ch !== '.' && /\d/.test(old)) { const r = h('span', 'll-roll' + (calm() ? ' calm' : ''), `<span><i>${old}</i><i>${ch}</i></span>`); res.appendChild(r); requestAnimationFrame(() => requestAnimationFrame(() => r.classList.add('go'))); }
            else res.appendChild(h('span', '', ch));
          });
          res.classList.add('ok');
          const roll = up && all[rIdx] === '9';
          let say = `Yes! The decider is <b>${decider}</b>: ${rule}. ${shownX} → <b>${out}</b>.`;
          if (X === half) say += ' It sits exactly on the halfway mark, and 5 always bumps up.';

          if (roll) say += ` The 9 rolls over like an odometer: 9 + 1 = 10, write 0 and carry 1.${p > 0 ? ' <b>Keep the 0</b>: it holds the ' + PLACE[p] + ' place.' : ''}`;
          say += ' Then drop the rest.';
          fb.className = 'ix-fb ok'; fb.innerHTML = say;
          if (more.length) bar.appendChild(btn('Another one ▶', () => { x = more[mi++ % more.length]; build(); }, 'go'));
          return;
        }
        showDist();
        let say = `${L(v)} is farther away: ${shownX} is ${trimDec(v === lo ? dLo : dHi)} from it, but only ${trimDec(v === lo ? dHi : dLo)} from ${L(ans)}. The decider is <b>${decider}</b>: ${rule}.`;
        if (X === half) say = `${shownX} sits exactly on the halfway mark. The rule settles it: the decider is <b>5</b>, and 5 or more bumps up.`;
        if (chain && v === chain.end) say = `That rounds twice: ${shownX} → ${fmtScaled(chain.mid, k, p + 1)} → ${L(chain.end)}. Look once: the decider is <b>${decider}</b>, so ${up ? 'bump up' : 'keep'}. The dot is on the ${up ? 'right' : 'left'} side of halfway.`;
        if (p > 0 && up && L(lo).slice(-1) === '0' && v === lo) say += ' The answer is not always “point zero”.';
        fb.className = 'ix-fb no'; fb.innerHTML = say;
      }
    }
    build();
    return root;
  }

  /* --- shared integer / fraction axis for hop and compare --- */
  function makeAxis(o, H, Y) {
    const D = o.den || 1, lo = o.min, hi = o.max;           /* lo, hi in numerators over D */
    const x0 = 22, x1 = LL_W - 22, pos = (v) => x0 + (v - lo) / (hi - lo) * (x1 - x0);
    const s = axisSvg(H);
    sv('line', { x1: x0 - 8, y1: Y, x2: x1 + 8, y2: Y, stroke: 'var(--ink)', 'stroke-width': '3', 'stroke-linecap': 'round' }, s);
    sv('path', { d: `M ${x0 - 4} ${Y - 6} L ${x0 - 12} ${Y} L ${x0 - 4} ${Y + 6} M ${x1 + 4} ${Y - 6} L ${x1 + 12} ${Y} L ${x1 + 4} ${Y + 6}`, fill: 'none', stroke: 'var(--ink)', 'stroke-width': '2.5', 'stroke-linecap': 'round' }, s);
    const wholeSpan = (hi - lo) / D, every = wholeSpan <= 12 ? 1 : wholeSpan <= 24 ? 2 : 5;
    for (let v = lo; v <= hi; v++) {
      const whole = v % D === 0;
      sv('line', { x1: pos(v), y1: Y - (whole ? 8 : 4), x2: pos(v), y2: Y + (whole ? 8 : 4), stroke: 'var(--ink)', 'stroke-width': whole ? (v === 0 ? 3 : 2) : 1.3 }, s);
      if (whole && ((v / D) % every === 0 || v === 0)) txt(s, pos(v), Y + 26, neg(v / D), { 'font-size': v === 0 ? '15' : '13', fill: v === 0 ? 'var(--ink)' : 'var(--muted)' });
    }
    return { s, pos, D };
  }

  /* --- hop: { problems:[{a:-4, op:'+', b:6}, {a:3, op:'−', b:-7}], min:-8, max:12 }
           fractions: { problems:[{groups:6, step:{n:2,d:3}}], min:0, max:5 } --- */
  function llHop(o) {
    const root = h('div', 'viz ix ix-col ix-ll');
    const probs = o.problems || [{ a: o.start || 0, op: '+', b: (o.hops || [1])[0] }];
    let pi = 0;
    const tabs = h('div', 'ix-ctr ll-tabs');
    const exprEl = h('div', 'll-expr');
    const kcf = h('div', 'ix-ctr ll-kcf');
    const stage = h('div', 'll-stage');
    const read = h('div', 'ix-read ll-read');
    const ctl = h('div', 'ix-ctr');
    [tabs, exprEl, kcf, stage, read, ctl].forEach((x) => root.appendChild(x));
    const tabBtns = probs.map((p, i) => { const b = btn(label(p), () => { pi = i; load(); }, 'll-tab'); tabs.appendChild(b); return b; });
    if (probs.length < 2) tabs.style.display = 'none';
    function label(p) { return p.groups ? `${p.groups} × ${p.step.n}/${p.step.d}` : `${neg(p.a)} ${p.op} ${paren(p.b)}`; }

    let P, flips, hopsDone, ax, arcs, here, D;
    function load() {
      P = probs[pi]; flips = 0; hopsDone = 0;
      tabBtns.forEach((b, i) => b.classList.toggle('on', i === pi));
      D = P.groups ? P.step.d : 1;
      const H = 120, Y = 82;
      ax = makeAxis({ min: (o.min != null ? o.min : -10) * D, max: (o.max != null ? o.max : 10) * D, den: D }, H, Y);
      stage.innerHTML = ''; stage.appendChild(ax.s);
      arcs = sv('g', {}, ax.s);
      here = P.groups ? 0 : P.a;
      dotAt(here, P.groups ? '0' : 'start ' + neg(P.a), 'start');
      draw();
    }
    const subNeedsFlip = () => !P.groups && P.op === '−' && flips < 3;
    const addend = () => (P.op === '−' ? -P.b : P.b);
    function dotAt(v, lab, cls) {
      const g = sv('g', { class: 'll-pin ' + (cls || '') }, ax.s);
      sv('circle', { cx: ax.pos(v), cy: 82, r: 8, fill: cls === 'start' ? 'var(--viz-gold)' : 'var(--viz-coral)', stroke: 'var(--ink)', 'stroke-width': '2.5' }, g);
      void lab;
      return g;
    }
    function arc(from, to, lab) {
      const xa = ax.pos(from), xb = ax.pos(to), mid = (xa + xb) / 2, hgt = Math.min(46, 16 + Math.abs(xb - xa) * 0.25), Y = 82;
      const dir = xb > xa ? 1 : -1;
      const path = sv('path', { d: `M ${xa} ${Y - 8} Q ${mid} ${Y - 8 - hgt * 2} ${xb} ${Y - 9}`, fill: 'none', stroke: dir > 0 ? 'var(--viz-teal)' : 'var(--viz-coral)', 'stroke-width': '3.5', 'stroke-linecap': 'round', class: 'll-arc' + (calm() ? ' calm' : '') }, arcs);
      sv('path', { d: `M ${xb - dir * 10} ${Y - 18} L ${xb} ${Y - 9} L ${xb - dir * 12} ${Y - 6}`, fill: 'none', stroke: dir > 0 ? 'var(--viz-teal)' : 'var(--viz-coral)', 'stroke-width': '3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, arcs);
      if (lab) {
        const t = txt(arcs, mid, Y - 14 - hgt, '', { 'font-size': '14', fill: 'var(--ink)', 'paint-order': 'stroke', stroke: 'var(--card)', 'stroke-width': '4' });
        t.textContent = lab;
      }
    }
    function draw() {
      kcf.innerHTML = ''; ctl.innerHTML = '';
      const fracTxt = (v) => (v % D === 0 ? neg(v / D) : (Math.abs(v) > D ? `${Math.floor(v / D)} ${fr(v % D, D)}` : fr(v, D)));
      if (P.groups) {
        exprEl.innerHTML = `${P.groups} × ${fr(P.step.n, P.step.d)}`;
        const sum = hopsDone * P.step.n;
        read.innerHTML = hopsDone === 0
          ? `<div class="ix-note">${P.groups} groups of ${fr(P.step.n, P.step.d)}: make ${P.groups} hops of ${fr(P.step.n, P.step.d)} from 0.</div>`
          : `<div class="ix-eq">${Array(hopsDone).fill(fr(P.step.n, P.step.d)).join(' + ')} = ${fr(sum, D)}${sum % D === 0 || sum > D ? ' = <b>' + fracTxt(sum) + '</b>' : ''}</div>` + (hopsDone === P.groups ? `<div class="ix-note">${P.groups} hops of ${fr(P.step.n, P.step.d)} land on <b>${fracTxt(sum)}</b>. So ${P.groups} × ${fr(P.step.n, P.step.d)} = ${fracTxt(sum)}.</div>` : '');
        if (hopsDone < P.groups) ctl.appendChild(btn('Next hop ▶', () => { const from = hopsDone * P.step.n; hopsDone++; arc(from, from + P.step.n, ''); dotAt(from + P.step.n); draw(); }, 'go'));
        ctl.appendChild(btn('↺ Again', load, 'ghost'));
        return;
      }
      const a = P.a, b = P.b;
      /* subtraction: keep, change, flip */
      if (P.op === '−') {
        const steps = [['Keep', neg(a)], ['Change', '− to +'], ['Flip', `${paren(b)} → ${paren(-b)}`]];
        steps.forEach(([k, t], i) => { const c = btn(`<b>${k}</b> ${t}`, () => { if (i === flips) { flips++; draw(); } }, 'll-kc' + (i < flips ? ' on' : i === flips ? ' next' : '')); c.disabled = i !== flips; kcf.appendChild(c); });
      }
      const opShown = P.op === '−' && flips >= 2 ? '+' : P.op;
      const bShown = P.op === '−' && flips >= 3 ? -b : b;
      exprEl.innerHTML = `<span class="${flips >= 1 ? 'kept' : ''}">${neg(a)}</span> <span class="${flips >= 2 ? 'chg' : ''}">${opShown}</span> <span class="${flips >= 3 ? 'chg' : ''}">${paren(bShown)}</span>`;
      const ad = addend(), r = a + ad;
      if (subNeedsFlip()) {
        read.innerHTML = `<div class="ix-note">Subtracting is adding the opposite. Tap <b>Keep</b>, <b>Change</b>, <b>Flip</b> to rewrite it.</div>`;
      } else if (hopsDone === 0) {
        read.innerHTML = `<div class="ix-note">Start at <b>${neg(a)}</b>. Adding ${paren(ad)} means ${Math.abs(ad)} step${Math.abs(ad) === 1 ? '' : 's'} to the <b>${ad > 0 ? 'right →' : 'left ←'}</b>.</div>`;
        ctl.appendChild(btn(`Hop ${Math.abs(ad)} ${ad > 0 ? '→' : '←'}`, () => { hopsDone = 1; arc(a, r, (ad > 0 ? '+' : '−') + Math.abs(ad)); dotAt(r); draw(); }, 'go'));
      } else {
        read.innerHTML = `<div class="ix-eq">${neg(a)} ${P.op} ${paren(b)}${P.op === '−' ? ' = ' + neg(a) + ' + ' + paren(-b) : ''} = <b>${neg(r)}</b></div><div class="ix-note">${ad > 0 ? 'Adding a positive moves right.' : 'Adding a negative moves left.'} You land on <b>${neg(r)}</b>.${P.op === '−' && b < 0 ? ' Two minuses in a row became a plus.' : ''}</div>`;
      }
      ctl.appendChild(btn('↺ Again', load, 'ghost'));
    }
    load();
    return root;
  }

  /* --- compare: { pairs:[[-8,-3],[-2,-6]], min:-10, max:5 } which is smaller? --- */
  function llCompare(o) {
    const root = h('div', 'viz ix ix-col ix-ll');
    const pairs = o.pairs || [[-8, -3]];
    let k = 0, streak = 0;
    const ask = h('div', 'ix-q ll-ask');
    const stage = h('div', 'll-stage');
    const pick = h('div', 'll-pick');
    const fb = h('div', 'ix-fb', '');
    const bar = h('div', 'ix-ctr ll-bar');
    [ask, stage, pick, fb, bar].forEach((x) => root.appendChild(x));
    function load() {
      const [a, b] = pairs[k % pairs.length];
      const ax = makeAxis({ min: o.min != null ? o.min : -10, max: o.max != null ? o.max : 5 }, 112, 70);
      txt(ax.s, 30, 20, '← colder', { 'text-anchor': 'start', 'font-size': '12.5', fill: 'var(--viz-blue)' });
      txt(ax.s, LL_W - 30, 20, 'warmer →', { 'text-anchor': 'end', 'font-size': '12.5', fill: 'var(--viz-coral)' });
      [a, b].forEach((v) => { sv('circle', { cx: ax.pos(v), cy: 70, r: 9, fill: 'var(--viz-gold)', stroke: 'var(--ink)', 'stroke-width': '2.5' }, ax.s); txt(ax.s, ax.pos(v), 50, neg(v), { 'font-size': '16' }); });
      stage.innerHTML = ''; stage.appendChild(ax.s);
      ask.innerHTML = `Which is <b>smaller</b> (colder): ${neg(a)} or ${neg(b)}?`;
      pick.innerHTML = ''; fb.className = 'ix-fb'; fb.innerHTML = ''; bar.innerHTML = '';
      const small = Math.min(a, b), big = Math.max(a, b);
      [a, b].forEach((v) => pick.appendChild(btn(neg(v), () => {
        if (v === small) {
          streak++;
          fb.className = 'ix-fb ok';
          fb.innerHTML = `Yes! <b>${neg(small)} &lt; ${neg(big)}</b>. ${neg(small)} is farther left, so it is smaller.${streak > 1 ? ' ' + streak + ' in a row!' : ''}`;
          [...pick.children].forEach((x) => { x.disabled = true; x.classList.toggle('on', x.textContent === neg(small)); });
          if (pairs.length > 1) bar.appendChild(btn('Next pair ▶', () => { k++; load(); }, 'go'));
        } else {
          streak = 0;
          fb.className = 'ix-fb no';
          fb.innerHTML = small < 0 && big < 0
            ? `${neg(v)} is to the <b>right</b> of ${neg(small)}, so it is bigger. ${Math.abs(small)} is more than ${Math.abs(big)}, but with the minus sign that means farther below zero.`
            : `${neg(v)} is to the right of ${neg(small)}. Farther left is smaller.`;
        }
      }, 'll-nb')));
    }
    load();
    return root;
  }

  /* stacked fraction inside an SVG (labels never say "3/4" on one line) */
  function svgFrac(parent, x, y, n, d, attrs) {
    const a = Object.assign({ 'font-size': '13', fill: 'var(--ink)' }, attrs || {}), fs = +a['font-size'];
    const g = sv('g', { 'font-weight': '800', fill: a.fill, 'font-size': String(fs), 'text-anchor': 'middle' }, parent);
    const wd = Math.max(String(n).length, String(d).length) * fs * 0.62 + 4;
    sv('text', { x, y: y - fs * 0.25 }, g).textContent = n;
    sv('line', { x1: x - wd / 2, y1: y, x2: x + wd / 2, y2: y, stroke: a.fill, 'stroke-width': '1.6' }, g);
    sv('text', { x, y: y + fs * 0.95 }, g).textContent = d;
    return g;
  }
  /* a chip: '0.45', '48%', or { n:2, d:5 } → value, HTML label, SVG drawer, decimal name */
  function chipOf(c, places) {
    if (c && typeof c === 'object') return { v: c.n / c.d, html: fr(c.n, c.d), draw: (p, x, y, at) => svgFrac(p, x, y, c.n, c.d, at), key: c.n + '/' + c.d, dec: (c.n / c.d).toFixed(places) };
    const t = String(c).trim();
    if (/%$/.test(t)) { const v = parseFloat(t) / 100; return { v, html: t, draw: (p, x, y, at) => txt(p, x, y + 5, t, at), key: t, dec: v.toFixed(places) }; }
    const v = parseFloat(t); return { v, html: t, draw: (p, x, y, at) => txt(p, x, y + 5, t, at), key: t, dec: v.toFixed(places) };
  }

  /* --- drop: { rounds:[{ chips:[{n:3,d:4},'0.75'], min:0, max:1, step:0.05 }] } (or chips/min/max/step at the top)
     Tap a name, then tap where it sits on the line. Keyboard: focus the line, arrow keys move, Enter places. --- */
  function llDrop(o) {
    const rounds = o.rounds || [{ chips: o.chips, min: o.min, max: o.max, step: o.step }];
    let ri = 0;
    const root = h('div', 'viz ix ix-col ix-ll');
    const ask = h('div', 'ix-q ll-ask');
    const chipRow = h('div', 'ix-ctr ll-chips');
    const stage = h('div', 'll-stage');
    const fb = h('div', 'ix-fb', '');
    const bar = h('div', 'ix-ctr ll-bar');
    [ask, chipRow, stage, fb, bar].forEach((x) => root.appendChild(x));
    function load() {
      const R = rounds[ri], min = R.min != null ? R.min : 0, max = R.max != null ? R.max : 1, step = R.step || 0.1;
      const places = Math.max(0, Math.round(-Math.log10(step) + 0.3));
      const chips = R.chips.map((c) => chipOf(c, Math.max(2, places)));
      const placed = [], N = Math.round((max - min) / step);
      let sel = null, cursor = Math.round(N / 2);
      fb.className = 'ix-fb'; fb.innerHTML = ''; bar.innerHTML = '';
      ask.innerHTML = 'Tap a name, then tap the spot on the line where it sits.';
      const x0 = 24, x1 = LL_W - 24, pos = (v) => x0 + (v - min) / (max - min) * (x1 - x0);
      let SH = 140, Y = 96;
      function draw() {
        chipRow.innerHTML = '';
        chips.forEach((c, i) => {
          if (placed.includes(i)) return;
          const b = btn(c.html, () => { sel = i; draw(); fb.className = 'ix-fb'; fb.innerHTML = ''; }, 'll-chip' + (sel === i ? ' on' : ''));
          b.setAttribute('aria-label', 'Place ' + c.key);
          chipRow.appendChild(b);
        });
        if (!chipRow.children.length) chipRow.style.display = 'none'; else chipRow.style.display = '';
        const stackNow = Math.max(1, ...placed.map((i) => placed.filter((j) => Math.abs(chips[j].v - chips[i].v) < 1e-9).length));
        SH = 52 + stackNow * 36 + 52; Y = SH - 52;
        const s = axisSvg(SH);
        s.setAttribute('tabindex', '0'); s.setAttribute('role', 'slider'); s.setAttribute('aria-label', 'Number line: arrow keys move, Enter places the chosen name');
        s.setAttribute('aria-valuemin', String(min)); s.setAttribute('aria-valuemax', String(max)); s.setAttribute('aria-valuenow', (min + cursor * step).toFixed(places));
        s.classList.add('ll-tap');
        sv('line', { x1: x0, y1: Y, x2: x1, y2: Y, stroke: 'var(--ink)', 'stroke-width': '3', 'stroke-linecap': 'round' }, s);
        const labEvery = Math.max(1, Math.round((max - min) / step / 10));
        for (let k = 0; k <= N; k++) {
          const v = min + k * step, big = k % labEvery === 0;
          sv('line', { x1: pos(v), y1: Y - (big ? 9 : 5), x2: pos(v), y2: Y + (big ? 9 : 5), stroke: 'var(--ink)', 'stroke-width': big ? 2 : 1.2 }, s);
          if (big) txt(s, pos(v), Y + 26, trimDec(v.toFixed(places)), { 'font-size': '12', fill: 'var(--muted)' });
        }
        /* placed chips: stack names that share a point */
        const seen = {};
        placed.forEach((i) => {
          const c = chips[i], kx = c.v.toFixed(4), row = seen[kx] = (seen[kx] || 0) + 1, x = pos(c.v);
          if (row === 1) sv('circle', { cx: x, cy: Y, r: 8, fill: 'var(--viz-teal)', stroke: 'var(--ink)', 'stroke-width': '2.5' }, s);
          c.draw(s, x, Y - 24 - (row - 1) * 36, { 'font-size': '14' });
        });
        if (sel != null) { const cx = pos(min + cursor * step); sv('path', { d: `M ${cx - 7} ${Y + 42} L ${cx} ${Y + 32} L ${cx + 7} ${Y + 42} Z`, fill: 'var(--viz-gold)', stroke: 'var(--ink)', 'stroke-width': '1.5' }, s); }
        sv('rect', { x: 0, y: 0, width: LL_W, height: SH, fill: 'transparent' }, s);
        s.addEventListener('pointerdown', (e) => {
          const r = s.getBoundingClientRect(), x = (e.clientX - r.left) * LL_W / r.width;
          cursor = Math.max(0, Math.min(N, Math.round((x - x0) / (x1 - x0) * N)));
          place();
        });
        s.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cursor = Math.min(N, cursor + 1);
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cursor = Math.max(0, cursor - 1);
          else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); place(); return; }
          else return;
          e.preventDefault(); draw(); stage.querySelector('svg').focus();
        });
        stage.innerHTML = ''; stage.appendChild(s);
      }
      function place() {
        if (sel == null) { fb.className = 'ix-fb no'; fb.innerHTML = 'Tap one of the names first.'; return; }
        const c = chips[sel], v = min + cursor * step;
        if (Math.abs(v - c.v) < step / 2 + 1e-9) {
          placed.push(sel); sel = null; fb.className = 'ix-fb ok';
          fb.innerHTML = /^[\d.]+$/.test(c.key) ? `Yes: <b>${c.key}</b> sits right there.` : `Yes: ${c.html} = <b>${c.dec}</b> sits right there.`;
          if (placed.length === chips.length) finish();
        } else {
          fb.className = 'ix-fb no';
          fb.innerHTML = `Not there: you tapped ${trimDec(v.toFixed(places))}. Rename it first: ${c.html} = <b>${c.dec}</b>.`;
        }
        draw();
      }
      function finish() {
        const same = chips.every((c) => Math.abs(c.v - chips[0].v) < 1e-9);
        const order = chips.map((c, i) => i).sort((a, b) => chips[a].v - chips[b].v);
        fb.className = 'ix-fb ok';
        fb.innerHTML = same ? `All ${chips.length} names sit on one point, so ${chips.map((c) => c.html).join(' = ')}.`
          : `In order: ${order.map((i) => chips[i].html).join(' &lt; ')}. As decimals: ${order.map((i) => trimDec(chips[i].dec) === '' ? '0' : chips[i].dec).join(', ')}.`;
        if (rounds.length > 1) bar.appendChild(btn(ri < rounds.length - 1 ? 'Next set ▶' : 'Start over ↺', () => { ri = (ri + 1) % rounds.length; load(); }, 'go'));
      }
      draw();
    }
    load();
    return root;
  }

  /* --- ray: { op:'>', v:3, min:-2, max:8, tests:[4, 5, 10, 3.5, 3], add:0 }
     Inequality on a line: symbol chips redraw the circle (open/closed) and the ray. With add:5, rhs:8 it reads n + 5 > 8. --- */
  const RAY_OPS = { '>': (a, b) => a > b, '<': (a, b) => a < b, '≥': (a, b) => a >= b, '≤': (a, b) => a <= b };
  const RAY_WORD = { '>': 'greater than', '<': 'less than', '≥': 'greater than or equal to', '≤': 'less than or equal to' };
  function llRay(o) {
    let op = o.op || '>';
    const v = o.v != null ? o.v : 3, add = o.add || 0, rhs = add ? (o.rhs != null ? o.rhs : v + add) : v, letter = o.letter || (add ? 'n' : 'x');
    const tests = o.tests || [v + 1, v + 2, v + 7, v + 0.5, v];
    let tried = [];
    const root = h('div', 'viz ix ix-col ix-ll');
    const opRow = h('div', 'ix-ctr ll-ops');
    const expr = h('div', 'll-expr');
    const stage = h('div', 'll-stage');
    const tRow = h('div', 'ix-ctr ll-tests');
    const fb = h('div', 'ix-fb', '');
    [opRow, expr, stage, tRow, fb].forEach((x) => root.appendChild(x));
    const lhsTxt = add ? `${letter} + ${add}` : letter;
    function draw() {
      opRow.innerHTML = '';
      if (o.ops !== false) Object.keys(RAY_OPS).forEach((k) => { const b = btn(k, () => { op = k; tried = []; fb.className = 'ix-fb'; fb.innerHTML = ''; draw(); }, 'll-op' + (k === op ? ' on' : '')); b.setAttribute('aria-label', RAY_WORD[k]); opRow.appendChild(b); });
      expr.innerHTML = add ? `${lhsTxt} ${op} ${rhs} <span class="ll-then">→ ${letter} ${op} ${v}</span>` : `${letter} ${op} ${v}`;
      const ax = makeAxis({ min: o.min != null ? o.min : v - 5, max: o.max != null ? o.max : v + 5 }, 110, 64);
      const s = ax.s, x = ax.pos(v), right = op === '>' || op === '≥', end = right ? LL_W - 12 : 12, closed = op === '≥' || op === '≤';
      sv('line', { x1: x, y1: 64, x2: end, y2: 64, stroke: 'var(--viz-blue)', 'stroke-width': '8', 'stroke-linecap': 'round', opacity: '.75' }, s);
      sv('path', { d: right ? `M ${end - 14} 54 L ${end} 64 L ${end - 14} 74` : `M ${end + 14} 54 L ${end} 64 L ${end + 14} 74`, fill: 'none', stroke: 'var(--viz-blue)', 'stroke-width': '5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
      sv('circle', { cx: x, cy: 64, r: 10, fill: closed ? 'var(--viz-blue)' : 'var(--viz-empty)', stroke: 'var(--viz-blue)', 'stroke-width': '4' }, s);
      tried.forEach((t) => { const ok = RAY_OPS[op](t + add, rhs); sv('circle', { cx: ax.pos(t), cy: 30, r: 7, fill: ok ? 'var(--viz-teal)' : 'var(--viz-coral)', stroke: 'var(--ink)', 'stroke-width': '2' }, s); txt(s, ax.pos(t), 18, String(t), { 'font-size': '12' }); });
      stage.innerHTML = ''; stage.appendChild(s);
      tRow.innerHTML = '';
      tRow.appendChild(h('span', 'ix-lab', `Test ${letter} =`));
      tests.forEach((t) => tRow.appendChild(btn(String(t), () => test(t), 'll-test')));
      const f = h('form', 'll-own'); f.setAttribute('novalidate', '');
      const inp = h('input', 'ix-num'); inp.type = 'text'; inp.inputMode = 'decimal'; inp.setAttribute('aria-label', 'Test your own number'); inp.placeholder = '?';
      f.appendChild(inp); const go = btn('Test', () => {}, 'go'); go.type = 'submit'; f.appendChild(go);
      f.onsubmit = (e) => { e.preventDefault(); const t = parseFloat(String(inp.value).replace('−', '-')); if (isFinite(t)) test(t); };
      tRow.appendChild(f);
    }
    function test(t) {
      if (!tried.includes(t)) tried.push(t);
      const val = t + add, ok = RAY_OPS[op](val, rhs);
      const plug = add ? `${t} + ${add} = ${val}. Is ${val} ${op} ${rhs}? ` : `Is ${t} ${op} ${v}? `;
      fb.className = ok ? 'ix-fb ok' : 'ix-fb no';
      let why = '';
      if (!ok && val === rhs) why = ` ${rhs} is not ${RAY_WORD[op]} itself, so the circle is <b>open</b>: ${v} is not a solution.`;
      else if (ok && val === rhs) why = ` The “or equal” part counts it, so the circle is <b>closed</b>.`;
      else if (ok) why = ` ${t} is on the shaded ray, so it is a solution.`;
      else why = ` ${t} is off the ray, so it is not a solution.`;
      fb.innerHTML = plug + (ok ? '<b>Yes</b>.' : '<b>No</b>.') + why;
      draw();
    }
    draw();
    return root;
  }

  /* Modes are registered here: a new mode is one function (opts) → DOM node.
     drop: place names like 0.45, 48% and 2/5 on a line. ray: inequalities with open or closed circles. */
  const LL_MODES = { round: llRound, hop: llHop, compare: llCompare, drop: llDrop, ray: llRay };
  function lineLab(opts) {
    const o = Object.assign({ mode: 'round' }, opts || {});
    const make = LL_MODES[o.mode];
    if (!make) { const n = h('div', 'viz ix ix-col'); n.appendChild(h('div', 'ix-tip', 'This number line mode is coming soon.')); return n; }
    return make(o);
  }
  lineLab.modes = LL_MODES;

  const DSP = { '-4': 'thousands', '-3': 'hundreds', '-2': 'tens', '-1': 'ones', 1: 'tenths', 2: 'hundredths', 3: 'thousandths' };
  /* ======================= decimalStack =======================
     { op:'+', a:'4.7', b:'12.35' } or { op:'−', a:'8', b:'2.46' }. The bottom number starts lined up on the right
     (the classic mistake). Slide it until the points stack, fill the empty places with 0, then step the columns. */
  function decimalStack(opts) {
    const o = Object.assign({ op: '+', a: '4.7', b: '12.35' }, opts || {});
    const sub = o.op === '−' || o.op === '-';
    const opS = sub ? '−' : '+';
    const parts = (t) => { const i = t.indexOf('.'); return { s: t, int: i < 0 ? t : t.slice(0, i), fr: i < 0 ? '' : t.slice(i + 1), pt: i >= 0 }; };
    const A = parts(String(o.a)), B = parts(String(o.b));
    const fd = Math.max(A.fr.length, B.fr.length);
    const rightOf = (N) => (N.pt ? N.fr.length : -1);
    const s0 = rightOf(A) - rightOf(B);                       /* bottom offset when right edges line up */
    const range = [Math.min(s0, 0) - 1, Math.max(s0, 0) + 1];
    const intLen = Math.max(A.int.length, B.int.length) + 1;  /* +1 for a carry digit */
    const cMin = Math.min(-intLen, -B.int.length + range[0], -A.int.length) , cMax = Math.max(fd, B.fr.length + range[1], A.fr.length);
    const cols = []; for (let c = cMin; c <= cMax; c++) cols.push(c);
    let shift = s0, locked = false, filled = {}, upto = 0, wrongShown = false;
    const needFill = []; /* places to fill: implied point, then zeros */
    [['a', A], ['b', B]].forEach(([key, N]) => {
      if (!N.pt && fd) needFill.push({ key, c: 0, ch: '.' });
      for (let c = N.fr.length + 1; c <= fd; c++) needFill.push({ key, c, ch: '0' });
    });
    const full = (N) => N.int + '.' + N.fr.padEnd(fd, '0');
    const digitAt = (N, c, withFill, key) => { /* char of N in column c (aligned frame) */
      if (c === 0) return N.pt || (withFill && filled[key + ':0']) ? '.' : '';
      if (c < 0) { const i = N.int.length + c; return i >= 0 ? N.int[i] : ''; }
      if (c <= N.fr.length) return N.fr[c - 1];
      return withFill && filled[key + ':' + c] ? '0' : '';
    };

    /* column steps, right to left (aligned, zeros filled) */
    const steps = [];
    (function plan() {
      const top = {}, bot = {}, res = {}, marks = {};
      for (let c = cMin; c <= cMax; c++) { if (c === 0) continue; top[c] = digitAt({ int: A.int, fr: A.fr.padEnd(fd, '0'), pt: true }, c) || ''; bot[c] = digitAt({ int: B.int, fr: B.fr.padEnd(fd, '0'), pt: true }, c) || ''; }
      const leftMost = -Math.max(A.int.length, B.int.length);
      let carry = 0;
      const order = []; for (let c = fd; c >= leftMost; c--) if (c !== 0) order.push(c);
      order.forEach((c, idx) => {
        if (c === -1 && fd) steps.push({ kind: 'pt', cap: `<b>Bring the point straight down</b> into the answer, right under the other points.` });
        const t = +(top[c] || 0), b = +(bot[c] || 0), nm = DSP[c];
        if (!sub) {
          const sum = t + b + carry, cin = carry;
          carry = sum >= 10 ? 1 : 0;
          const last = idx === order.length - 1;
          const st = { kind: 'col', c, write: { [c]: String(sum % 10) }, carry: carry ? { c: c === 1 ? -1 : c - 1, v: 1 } : null };
          if (last && carry) { st.write[c - 1] = '1'; st.carry = null; }
          const lone = (top[c] === '' || bot[c] === '') && !cin;
          st.cap = lone ? `<b>${nm}:</b> only one digit here, ${sum}. Write ${sum}.` : `<b>${nm}:</b> ${t} + ${b}${cin ? ' + 1 carried' : ''} = <b>${sum}</b>. ` + (lone ? '' : sum >= 10 ? (last ? `Write ${sum}.` : `Write ${sum % 10}, carry 1 to the ${DSP[c === 1 ? -1 : c - 1]}.`) : `Write ${sum}.`);
          steps.push(st);
        } else {
          const st = { kind: 'col', c, write: {}, regroup: [] };
          let cap = '';
          let tv = +(marks[c] != null ? marks[c] : t);
          if (tv < b) {
            /* borrow from the nearest nonzero place to the left */
            let j = c - 1; if (j === 0) j = -1;
            const chain = [];
            while (+(marks[j] != null ? marks[j] : top[j] || 0) === 0) { chain.push(j); j--; if (j === 0) j = -1; }
            const from = +(marks[j] != null ? marks[j] : top[j]);
            marks[j] = from - 1; st.regroup.push({ c: j, v: from - 1 });
            const words = [`${from} ${DSP[j]} → ${from - 1} ${DSP[j]} and 10 ${DSP[chain.length ? chain[chain.length - 1] : c]}`];
            chain.reverse().forEach((q, qi) => {
              marks[q] = 9; st.regroup.push({ c: q, v: 9 });
              const nextPlace = qi + 1 < chain.length ? chain[qi + 1] : c;
              words.push(`10 ${DSP[q]} → 9 ${DSP[q]} and 10 ${DSP[nextPlace]}`);
            });
            tv += 10; marks[c] = tv; st.regroup.push({ c, v: tv });
            cap = `<b>${nm}:</b> ${t} − ${b}? Too small. <b>Regroup:</b> ${words.join('; ')}. `;
          }
          cap += `${cap ? 'Now ' : '<b>' + nm + ':</b> '}${tv} − ${b} = <b>${tv - b}</b>.`;
          st.write[c] = String(tv - b); st.cap = cap;
          steps.push(st);
        }
      });
      void res;
    })();
    const exact = (() => { const k = Math.pow(10, fd); const va = Math.round(parseFloat(A.s) * k), vb = Math.round(parseFloat(B.s) * k); return fmtScaled(sub ? va - vb : va + vb, fd, fd); })();
    steps.push({ kind: 'done', cap: `<b>${full(A).replace(/\.$/, '')} ${opS} ${full(B)} = ${exact}</b>. Check: about ${Math.round(parseFloat(A.s))} ${opS} ${Math.round(parseFloat(B.s))} = ${sub ? Math.round(parseFloat(A.s)) - Math.round(parseFloat(B.s)) : Math.round(parseFloat(A.s)) + Math.round(parseFloat(B.s))} ✓` });

    const root = h('div', 'viz ix ix-col ix-ds');
    root.style.setProperty('--ds-n', cols.length);
    const head = h('div', 'ix-q ds-ask');
    const board = h('div', 'ds-board');
    const cap = h('div', 'ix-read ix-cap ds-cap');
    const slide = h('div', 'ix-ctr ds-slide');
    const ctl = h('div', 'ix-ctr');
    const fb = h('div', 'ix-fb', '');
    [head, board, slide, cap, ctl, fb].forEach((x) => root.appendChild(x));
    const bL = btn('◀ Slide', () => move(-1), ''), bR = btn('Slide ▶', () => move(1), '');
    bL.setAttribute('aria-label', 'Slide the bottom number one place left'); bR.setAttribute('aria-label', 'Slide the bottom number one place right');
    slide.appendChild(bL); slide.appendChild(bR);
    const bGo = btn(sub ? 'Subtract' : 'Add', () => goPress(), 'go');
    const bBack = btn('◀ Back', () => { upto = Math.max(0, upto - 1); draw(); }, 'ghost');
    const bNext = btn('Next ▶', () => { upto = Math.min(steps.length, upto + 1); draw(); }, 'go');
    const bReset = btn('↺ Reset', () => { shift = s0; locked = false; filled = {}; upto = 0; wrongShown = false; fb.className = 'ix-fb'; fb.innerHTML = ''; draw(); }, 'ghost');
    function move(d) {
      if (locked) return;
      shift = Math.max(range[0], Math.min(range[1], shift + d));
      wrongShown = false; fb.className = 'ix-fb'; fb.innerHTML = '';
      if (shift === 0) locked = true;
      draw();
    }
    const allFilled = () => needFill.every((f) => filled[f.key + ':' + f.c]);
    function goPress() {
      if (shift !== 0) {
        fb.className = 'ix-fb no';
        if (shift === s0) {
          const da = A.int + A.fr, db = B.int + B.fr, places = Math.max(A.fr.length, B.fr.length);
          const wv = sub ? (+da) - (+db) : (+da) + (+db);
          if (wv < 0) fb.innerHTML = `Lined up on the right, ${A.s} sits over the ${B.s.slice(-1)} as if it were ${fmtScaled(+da, places, places)}. That is not ${A.s}! Line up the points first.`;
          else { wrongShown = fmtScaled(wv, places, places); fb.innerHTML = `Lined up on the right you get <s>${wrongShown}</s>. That adds tenths to hundredths. Slide until the points stack.`; }
        } else fb.innerHTML = 'The points are not in one column yet. Keep sliding.';
        draw();
        return;
      }
      if (!allFilled()) { fb.className = 'ix-fb no'; fb.innerHTML = `Fill the empty places first: tap each dashed box. ${needFill.some((f) => f.ch === '.') ? `A whole number has a hidden point: ${A.pt ? B.s : A.s} = ${full(A.pt ? B : A)}.` : `Same value: ${(A.fr.length < fd ? A : B).s} = ${full(A.fr.length < fd ? A : B)}.`}`; draw(); return; }
      fb.className = 'ix-fb'; fb.innerHTML = '';
      upto = 1; draw();
    }
    function draw() {
      const ready = shift === 0 && allFilled();
      const started = upto > 0;
      head.innerHTML = shift !== 0 ? `The points are not lined up. <b>Slide</b> the bottom number until the points stack.`
        : !allFilled() ? `Points stacked ✓ Now tap the dashed boxes to fill the empty places.`
        : started ? `${sub ? 'Subtract' : 'Add'} one column at a time, right to left.` : `Ready! Press <b>${sub ? 'Subtract' : 'Add'}</b>.`;
      /* board */
      board.innerHTML = '';
      board.classList.toggle('aligned', shift === 0);
      const band = h('div', 'ds-band'); band.style.setProperty('--ds-pc', String(-cMin + 1)); board.appendChild(band);
      const done = steps.slice(0, upto), now = upto ? steps[upto - 1] : null;
      const wr = {}, carries = {}, reg = {};
      let ptDown = false;
      done.forEach((st) => { Object.assign(wr, st.write || {}); if (st.carry) carries[st.carry.c] = st.carry.v; (st.regroup || []).forEach((r) => { reg[r.c] = r.v; }); if (st.kind === 'pt') ptDown = true; });
      const hot = now && now.kind === 'col' ? now.c : null;
      const mkRow = (cls) => { const r = h('div', 'ds-row ' + cls); board.appendChild(r); return r; };
      const cell = (row, c, ch, extra) => { const e = h('span', 'ds-c' + (c === 0 ? ' ptc' : '') + (c === hot ? ' hot' : '') + (extra ? ' ' + extra : ''), ch); e.style.gridColumn = String(c - cMin + 2); row.appendChild(e); return e; };
      /* carry / regroup row */
      const rc = mkRow('ds-carry');
      cols.forEach((c) => { if (carries[c] != null) cell(rc, c, '1', 'cy'); else if (reg[c] != null) cell(rc, c, String(reg[c]), 'rg'); });
      /* top number */
      const ra = mkRow('ds-a');
      cols.forEach((c) => {
        const ch = digitAt(A, c, true, 'a');
        const need = needFill.find((f) => f.key === 'a' && f.c === c);
        if (need && !filled['a:' + c] && shift === 0) { const bx = cell(ra, c, '', 'blank'); bx.tabIndex = 0; bx.setAttribute('role', 'button'); bx.setAttribute('aria-label', 'Fill this place'); bx.onclick = () => { filled['a:' + c] = 1; draw(); }; bx.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bx.onclick(); } }; return; }
        if (!ch && c === 0 && !A.pt && fd) { cell(ra, c, '.', 'ghostpt'); return; }
        if (ch) cell(ra, c, ch, (need ? 'fill' : '') + (reg[c] != null ? ' struck' : ''));
      });
      /* bottom number (slides) */
      const rb = mkRow('ds-b');
      const sign = h('span', 'ds-c ds-sign', opS); sign.style.gridColumn = '1'; rb.appendChild(sign);
      const strip = h('div', 'ds-strip' + (calm() ? ' calm' : ''));
      strip.style.transform = `translateX(calc(var(--ds-cw) * ${shift}))`;
      rb.appendChild(strip);
      cols.forEach((c) => {
        const ch = digitAt(B, c, true, 'b');
        const need = needFill.find((f) => f.key === 'b' && f.c === c);
        const put = (t, cls) => { const e = h('span', 'ds-c' + (c === 0 ? ' ptc' : '') + (c === hot && shift === 0 ? ' hot' : '') + ' ' + (cls || ''), t); e.style.gridColumn = String(c - cMin + 1); strip.appendChild(e); return e; };
        if (need && !filled['b:' + c] && shift === 0) { const bx = put('', 'blank'); bx.tabIndex = 0; bx.setAttribute('role', 'button'); bx.setAttribute('aria-label', 'Fill this place'); bx.onclick = () => { filled['b:' + c] = 1; draw(); }; bx.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bx.onclick(); } }; return; }
        if (!ch && c === 0 && !B.pt && fd) { put('.', 'ghostpt'); return; }
        if (ch) put(ch, need ? 'fill' : '');
      });
      mkRow('ds-rule');
      /* answer */
      const rr = mkRow('ds-r');
      if (wrongShown && shift !== 0) { const e = h('span', 'ds-wrong', wrongShown + ' ✗'); e.style.gridColumn = `2 / span ${cols.length}`; rr.appendChild(e); }
      else cols.forEach((c) => { if (c === 0 && ptDown) cell(rr, c, '.', 'ans'); else if (wr[c] != null) cell(rr, c, wr[c], 'ans'); });
      /* controls */
      slide.style.display = locked ? 'none' : '';
      bL.disabled = shift <= range[0]; bR.disabled = shift >= range[1];
      ctl.innerHTML = '';
      if (!started) { ctl.appendChild(bGo); }
      else { bBack.disabled = upto <= 1; bNext.disabled = upto >= steps.length; ctl.appendChild(bBack); ctl.appendChild(bNext); }
      ctl.appendChild(bReset);
      cap.style.display = started ? '' : 'none';
      if (now) cap.innerHTML = now.cap;
      if (upto >= steps.length && started) { fb.className = 'ix-fb ok'; fb.innerHTML = `Points stacked, places filled, columns done: <b>${exact}</b>.`; }
      void ready;
    }
    draw();
    return root;
  }

  /* ======================= placeShift =======================
     A place-value strip; the decimal point stays still and the DIGITS slide (× 10 = one place left).
     { mode:'pair', a:'4.8', b:'0.6' }  make the divisor whole: "× 10 both", plus a "× 10 only the divisor" trap.
     { mode:'shift', v:'3.5', max:3 }   × 10 / ÷ 10 buttons on one number (Unit 3 powers of 10; metric mode builds on it). */
  const PS_NAMES = { 3: '1000s', 2: '100s', 1: 'tens', 0: 'ones', '-1': 'tenths', '-2': '100ths', '-3': '1000ths' };
  function psNum(t) { const p = pdec(t); let m = String(p.n), e = -p.dp; while (m.length > 1 && m[0] === '0') m = m.slice(1); return { m, e }; } /* value = m × 10^e */
  const psVal = (N) => { const v = +N.m * Math.pow(10, N.e); return trimDec(v.toFixed(Math.max(0, -N.e))); };
  function psStrip(N, hi, lo, label) {
    const wrap = h('div', 'ps-strip');
    const n = hi - lo + 1;
    wrap.style.setProperty('--ps-n', n);
    wrap.style.setProperty('--ps-ones', hi);
    if (label) wrap.appendChild(h('div', 'ps-lab', label));
    const heads = h('div', 'ps-heads');
    for (let p = hi; p >= lo; p--) heads.appendChild(h('span', 'ps-h' + (p === 0 ? ' ones' : ''), PS_NAMES[p] || ''));
    wrap.appendChild(heads);
    const lane = h('div', 'ps-lane');
    for (let p = hi; p >= lo; p--) lane.appendChild(h('span', 'ps-slot' + (p === 0 ? ' ones' : '')));
    lane.appendChild(h('span', 'ps-pt'));
    const tiles = [];
    for (let i = 0; i < 6; i++) { const t = h('span', 'ps-tile' + (calm() ? ' calm' : '')); lane.appendChild(t); tiles.push(t); }
    wrap.appendChild(lane);
    const val = h('div', 'ps-val');
    wrap.appendChild(val);
    function set(Nn, extra) {
      /* digits of m at places e .. e+len-1; placeholder zeros between the last digit and the ones; a leading 0 for values under 1 */
      const items = [];
      const len = Nn.m.length;
      for (let i = 0; i < len; i++) { const p = Nn.e + len - 1 - i; items.push({ p, ch: Nn.m[i], key: 'd' + i, cls: p < 0 && /^0+$/.test(Nn.m.slice(i)) ? 'trail' : '' }); }
      for (let p = Nn.e - 1; p >= 0; p--) items.push({ p, ch: '0', key: 'z' + p, cls: 'hold' });
      if (Nn.e + len - 1 < 0) items.push({ p: 0, ch: '0', key: 'lead', cls: 'lead' });
      tiles.forEach((t) => { t.style.opacity = '0'; t.dataset.on = ''; });
      items.forEach((it, i) => {
        const t = tiles[i]; if (!t) return;
        t.textContent = it.ch; t.className = 'ps-tile' + (calm() ? ' calm' : '') + (it.cls ? ' ' + it.cls : '');
        t.style.opacity = it.p > hi || it.p < lo ? '0' : '1';
        t.style.setProperty('--col', String(hi - it.p));
      });
      val.innerHTML = psVal(Nn) + (extra || '');
    }
    return { el: wrap, set };
  }
  function placeShift(opts) {
    const o = Object.assign({ mode: 'pair', a: '4.8', b: '0.6' }, opts || {});
    const root = h('div', 'viz ix ix-col ix-ps');
    if (o.mode === 'metric') {
      /* { mode:'metric', units:['m','cm'], v:'3.5', from:'m' }: tap a unit; the digits slide one place per power of 10 */
      const EXP = { km: 3, m: 0, dm: -1, cm: -2, mm: -3, kg: 3, g: 0, mg: -3, L: 0, mL: -3 };
      const units = o.units || ['m', 'cm'], from = o.from || units[0], N0 = psNum(o.v || '1');
      let u = from, N = N0;
      const top0 = N0.e + N0.m.length - 1, ups = units.map((x) => EXP[from] - EXP[x]);
      const hi = Math.min(3, Math.max(0, top0 + Math.max(...ups))), lo = Math.max(-3, Math.min(-1, N0.e + Math.min(...ups)));
      const ladder = h('div', 'ps-ladder');
      const st = psStrip(N, hi, lo, '');
      const read = h('div', 'ix-read ps-read');
      [h('div', 'ix-q ps-ask', `Change <b>${o.v} ${from}</b> to another unit. Tap a unit.`), ladder, st.el, read].forEach((x) => root.appendChild(x));
      function draw() {
        ladder.innerHTML = '';
        units.forEach((x, i) => {
          if (i) { const g = EXP[units[i - 1]] - EXP[x]; ladder.appendChild(h('span', 'ps-rung', (g > 0 ? '× ' : '÷ ') + Math.pow(10, Math.abs(g)) + ' →')); }
          ladder.appendChild(btn(x, () => { const k = EXP[u] - EXP[x]; N = { m: N.m, e: N.e + k }; u = x; draw(); }, 'ps-unit' + (x === u ? ' on' : '')));
        });
        st.set(N, ' ' + u);
        const k = EXP[from] - EXP[u], f = Math.pow(10, Math.abs(k));
        read.innerHTML = k === 0 ? `<div class="ix-note">A smaller unit needs more of them, so the digits slide left. A bigger unit needs fewer, so they slide right.</div>`
          : `<div class="ix-eq">${o.v} ${from} = <b>${psVal(N)} ${u}</b></div><div class="ix-note">${k > 0 ? `Smaller unit → more of them → <b>multiply</b> by ${f}` : `Bigger unit → fewer of them → <b>divide</b> by ${f}`}. Every digit slid ${Math.abs(k)} place${Math.abs(k) === 1 ? '' : 's'} ${k > 0 ? 'left' : 'right'}.</div>`;
      }
      draw();
      return root;
    }
    if (o.mode === 'shift') {
      let N = psNum(o.v || '3.5'), times = 0;
      const max = o.max || 3;
      const hi = Math.max(0, N.e + N.m.length - 1) + max, lo = Math.min(-1, N.e) - (o.down ? max : 0);
      const st = psStrip(N, Math.min(hi, 3), Math.max(lo, -3), '');
      const read = h('div', 'ix-read ps-read');
      const ctl = h('div', 'ix-ctr');
      const up = btn('× 10', () => { if (times < max) { times++; N = { m: N.m, e: N.e + 1 }; draw(); } }, 'go');
      const dn = btn('÷ 10', () => { if (times > (o.down ? -max : 0)) { times--; N = { m: N.m, e: N.e - 1 }; draw(); } }, '');
      ctl.appendChild(up); ctl.appendChild(dn); ctl.appendChild(btn('↺ Reset', () => { N = psNum(o.v || '3.5'); times = 0; draw(); }, 'ghost'));
      [st.el, read, ctl].forEach((x) => root.appendChild(x));
      function draw() {
        st.set(N);
        const f = Math.pow(10, Math.abs(times));
        read.innerHTML = times === 0 ? `<div class="ix-note">Press × 10 and watch the digits slide one place left. The point never moves.</div>`
          : `<div class="ix-eq">${o.v} ${times > 0 ? '×' : '÷'} ${f} = <b>${psVal(N)}</b></div><div class="ix-note">Every digit slid ${Math.abs(times)} place${Math.abs(times) === 1 ? '' : 's'} ${times > 0 ? 'left' : 'right'}.</div>`;
        up.disabled = times >= max; dn.disabled = times <= (o.down ? -max : 0);
      }
      draw();
      return root;
    }
    /* pair */
    const A0 = psNum(o.a), B0 = psNum(o.b);
    const need = Math.max(0, -B0.e);                        /* × 10 steps to make the divisor whole */
    const hi = Math.max(0, A0.e + A0.m.length - 1, B0.e + B0.m.length - 1) + need, lo = Math.min(-1, A0.e, B0.e);
    let A = A0, B = B0, times = 0, broken = false;
    const sA = psStrip(A, Math.min(hi, 3), Math.max(lo, -3), 'dividend');
    const sB = psStrip(B, Math.min(hi, 3), Math.max(lo, -3), 'divisor');
    const ask = h('div', 'ix-q ps-ask');
    const read = h('div', 'ix-read ps-read');
    const ctl = h('div', 'ix-ctr');
    const fb = h('div', 'ix-fb', '');
    const both = btn('× 10 both', () => { if (broken || -B.e <= 0) return; times++; A = { m: A.m, e: A.e + 1 }; B = { m: B.m, e: B.e + 1 }; draw(); }, 'go');
    const trap = btn('× 10 only the divisor', () => { if (broken || -B.e <= 0) return; broken = true; B = { m: B.m, e: B.e + 1 }; draw(); }, 'ghost');
    ctl.appendChild(both); ctl.appendChild(trap); ctl.appendChild(btn('↺ Reset', () => { A = A0; B = B0; times = 0; broken = false; draw(); }, 'ghost'));
    [ask, sA.el, sB.el, read, ctl, fb].forEach((x) => root.appendChild(x));
    const q = (X, Y) => trimDec((+psVal(X) / +psVal(Y)).toFixed(6));
    const ans = q(A0, B0);
    function draw() {
      const whole = B.e >= 0;
      sA.set(A); sB.set(B, whole ? ' <span class="ps-whole">whole ✓</span>' : '');
      sB.el.classList.toggle('glow', whole && !broken);
      sB.el.classList.toggle('broke', broken);
      ask.innerHTML = `${o.a} ÷ ${o.b}: make the <b>divisor</b> a whole number.`;
      const f = Math.pow(10, times);
      if (broken) {
        read.innerHTML = `<div class="ix-eq">${psVal(A)} ÷ ${psVal(B)} = <b>${q(A, B)}</b> ✗</div>`;
        fb.className = 'ix-fb no'; fb.innerHTML = `The answer changed! ${o.a} ÷ ${o.b} = ${ans}, but ${psVal(A)} ÷ ${psVal(B)} = ${q(A, B)}. Scaling only one number changes the problem. <b>Scale both.</b>`;
      } else if (!times) {
        read.innerHTML = `<div class="ix-eq">${o.a} ÷ ${o.b} = <b>?</b></div><div class="ix-note">The divisor ${o.b} has ${need} decimal place${need === 1 ? '' : 's'}. Each × 10 slides every digit one place left.</div>`;
        fb.className = 'ix-fb'; fb.innerHTML = '';
      } else {
        read.innerHTML = `<div class="ix-eq">${o.a} ÷ ${o.b} → ${psVal(A)} ÷ ${psVal(B)}${whole ? ' = <b>' + q(A, B) + '</b>' : ''}</div><div class="ix-note">Both numbers × ${f}. ${whole ? `Same answer: ${o.a} ÷ ${o.b} = ${ans} too. Check: ${o.b} × ${ans} = ${o.a} ✓` : 'The divisor is not whole yet.'}</div>`;
        fb.className = whole ? 'ix-fb ok' : 'ix-fb'; fb.innerHTML = whole ? `The divisor is whole. Now it is an easy division: <b>${psVal(A)} ÷ ${psVal(B)} = ${ans}</b>.` : '';
      }
      both.disabled = broken || whole; trap.disabled = broken || whole;
    }
    draw();
    return root;
  }

  /* ======================= fitStrips =======================
     { whole:'4.8', piece:'0.6' } or { whole:3, piece:{n:1,d:4} }: how many pieces fit? */
  function fitStrips(opts) {
    const o = Object.assign({ whole: '4.8', piece: '0.6' }, opts || {});
    const rat = (v) => { if (v && typeof v === 'object') return [v.n, v.d]; const p = pdec(v); return [p.n, Math.pow(10, p.dp)]; };
    const [wn, wd] = rat(o.whole), [pn, pd] = rat(o.piece);
    const Dn = wd * pd / gcd(wd, pd), W = wn * Dn / wd, P = pn * Dn / pd;   /* in units of 1/Dn */
    const count = Math.floor(W / P), left = W - count * P;
    const lab = (v) => (typeof v === 'object' ? fr(v.n, v.d) : String(v));
    const svgLab = (v) => (typeof v === 'object' ? v.n + '/' + v.d : String(v));
    const wholeNum = wn / wd;
    let laid = 0, guess = null;
    const root = h('div', 'viz ix ix-col ix-fs');
    const ask = h('div', 'ix-q fs-ask', `How many <b>${lab(o.piece)}</b>s fit in <b>${lab(o.whole)}</b>?`);
    const gRow = h('div', 'ix-ctr fs-guess');
    const stage = h('div', 'll-stage');
    const read = h('div', 'ix-read fs-read');
    const ctl = h('div', 'ix-ctr');
    [ask, gRow, stage, read, ctl].forEach((x) => root.appendChild(x));
    const opts3 = o.guesses || (typeof o.piece === 'object' ? [Math.max(1, Math.round(count / 4)), count, count * 2] : [trimDec((count / 10).toFixed(2)), count, count * 10]).map(String);
    if (o.guess !== false) {
      gRow.appendChild(h('span', 'ix-lab', 'Guess first:'));
      opts3.forEach((g) => gRow.appendChild(btn(g, () => { guess = g; [...gRow.querySelectorAll('.ix-btn')].forEach((b) => b.classList.toggle('on', b.textContent === g)); draw(); }, 'ghost')));
    }
    const x0 = 16, x1 = LL_W - 16, sc = (x1 - x0) / W, Y = 34, BH = 30;
    function draw() {
      const s = axisSvg(124);
      /* the whole */
      sv('rect', { x: x0, y: Y, width: W * sc, height: BH, rx: 6, fill: 'var(--viz-empty)', stroke: 'var(--ink)', 'stroke-width': '2.5' }, s);
      for (let k = 0; k <= Math.floor(wholeNum); k++) {
        const xx = x0 + k * Dn * sc;
        sv('line', { x1: xx, y1: Y - 6, x2: xx, y2: Y + BH, stroke: 'var(--ink)', 'stroke-width': '1.5' }, s);
        txt(s, xx, Y - 10, String(k), { 'font-size': '12', fill: 'var(--muted)' });
      }
      if (W % Dn) txt(s, x1, Y - 10, svgLab(o.whole), { 'font-size': '12.5', fill: 'var(--ink)' });
      txt(s, (x0 + x1) / 2, Y + BH / 2 + 5, laid ? '' : svgLab(o.whole), { 'font-size': '15' });
      /* the strips */
      const tints = ['var(--viz-teal)', 'var(--viz-blue)'];
      for (let i = 0; i < laid; i++) {
        const xx = x0 + i * P * sc, ww = P * sc;
        const g = sv('g', { class: 'fs-strip' + (calm() ? ' calm' : '') + (i === laid - 1 ? ' new' : '') }, s);
        sv('rect', { x: xx + 1, y: Y + BH + 10, width: ww - 2, height: 26, rx: 5, fill: tints[i % 2], 'fill-opacity': '.55', stroke: 'var(--ink)', 'stroke-width': '1.8' }, g);
        if (ww > 30 && typeof o.piece !== 'object') txt(g, xx + ww / 2, Y + BH + 28, svgLab(o.piece), { 'font-size': '11.5' });
        txt(g, xx + ww / 2, Y + BH + 54, String(i + 1), { 'font-size': ww > 16 ? '12.5' : '9', fill: 'var(--muted)' });
      }
      if (laid === count && left) sv('rect', { x: x0 + count * P * sc + 1, y: Y + BH + 10, width: left * sc - 2, height: 26, rx: 5, fill: 'none', stroke: 'var(--viz-coral)', 'stroke-width': '2', 'stroke-dasharray': '4 3' }, s);
      stage.innerHTML = ''; stage.appendChild(s);
      const sofar = (laid * pn / pd);
      if (!laid) read.innerHTML = `<div class="ix-note">Lay ${lab(o.piece)} strips along the ${lab(o.whole)} bar and count them.</div>`;
      else if (laid < count) read.innerHTML = `<div class="ix-eq">${laid} × ${lab(o.piece)} = ${typeof o.piece === 'object' ? fr(laid * pn, pd) : trimDec(sofar.toFixed(4))}</div><div class="ix-note">Keep going: there is still room.</div>`;
      else {
        const big = count > wholeNum && count > pn / pd;
        read.innerHTML = `<div class="ix-eq">${count} strips fit: ${lab(o.whole)} ÷ ${lab(o.piece)} = <b>${count}</b>${left ? ' with a bit left over' : ''}</div><div class="ix-note">${big ? 'The answer is <b>bigger than both numbers</b>. Small pieces mean more of them: dividing by a number less than 1 makes a bigger answer.' : ''}${guess != null ? (guess === String(count) ? ' You guessed ' + guess + ' ✓' : ' You guessed ' + guess + '.') : ''}</div>`;
      }
      ctl.innerHTML = '';
      if (laid < count) { ctl.appendChild(btn('Lay one ▶', () => { laid++; draw(); }, 'go')); ctl.appendChild(btn('Fill', () => { laid = count; draw(); }, '')); }
      ctl.appendChild(btn('↺ Clear', () => { laid = 0; draw(); }, 'ghost'));
    }
    draw();
    return root;
  }

  /* ======================= ratioTiles =======================
     Tiles: { a:3, b:5, la:'red', lb:'blue', unit:'tiles' }: × 2 / × 3 copy whole boxed groups, a "+1 red only" trap,
     and Swap ("order matters").
     Table: { mode:'table', top:'m', bottom:'cm', cols:[[1,100],[2,200],[5,500],[7,700]], blank:{c:2, r:1} }:
     arrows show the scale factor from the first column; tap the blank and pick its value. A column with a 1 is the unit rate. */
  function ratioTiles(opts) {
    const o = Object.assign({ mode: 'tiles', a: 3, b: 5, la: 'red', lb: 'blue', unit: '' }, opts || {});
    const root = h('div', 'viz ix ix-col ix-rt');
    if (o.mode === 'table') {
      const cols = o.cols, bl = o.blank || { c: cols.length - 1, r: 1 }, base = cols[0];
      let solved = false;
      const fac = (c) => { const f = cols[c][0] / base[0]; return f >= 1 ? '× ' + trimDec(f.toFixed(3)) : '÷ ' + trimDec((1 / f).toFixed(3)); };
      const right = cols[bl.c][bl.r], f = cols[bl.c][1 - bl.r] / base[1 - bl.r];
      const addWrong = base[bl.r] + (cols[bl.c][1 - bl.r] - base[1 - bl.r]);
      const otherWrong = f > 1 ? right + base[bl.r] : base[bl.r] * Math.round(1 / f);
      const choices = [...new Set([right, addWrong, otherWrong])].filter((x) => x > 0).sort((x, y) => x - y);
      const unitCol = cols.findIndex((p) => p[0] === 1 || p[1] === 1);
      const ask = h('div', 'ix-q', `Every column is the same ratio. Find the <b>?</b>`);
      const wrap = h('div', 'rt-twrap');
      const pick = h('div', 'ix-ctr');
      const fb = h('div', 'ix-fb', '');
      [ask, wrap, pick, fb].forEach((x) => root.appendChild(x));
      function draw() {
        let t = '<table class="g5t rt-table"><tr class="rt-fac"><th></th>' + cols.map((p, c) => `<td>${c ? '<span>' + fac(c) + '</span>' : ''}</td>`).join('') + '</tr>';
        [0, 1].forEach((r) => {
          t += `<tr><th>${r ? o.bottom : o.top}</th>` + cols.map((p, c) => {
            const isB = c === bl.c && r === bl.r;
            return `<td class="${c === unitCol ? 'unit' : ''}${isB ? ' blank' : ''}">${isB ? (solved ? '<b>' + right + '</b>' : '?') : p[r]}</td>`;
          }).join('') + '</tr>';
        });
        t += '</table>';
        wrap.innerHTML = t + (unitCol >= 0 ? `<div class="ix-note rt-unit">Unit rate: <b>${cols[unitCol][1 - (cols[unitCol][0] === 1 ? 0 : 1)]} ${cols[unitCol][0] === 1 ? o.bottom : o.top}</b> for every <b>1 ${cols[unitCol][0] === 1 ? o.top : o.bottom}</b></div>` : '');
        pick.innerHTML = '';
        if (!solved) choices.forEach((v) => pick.appendChild(btn(String(v), () => choose(v), 'rt-ch')));
      }
      function choose(v) {
        if (v === right) {
          solved = true; fb.className = 'ix-fb ok';
          fb.innerHTML = `Yes! ${base[1 - bl.r]} ${fac(bl.c)} = ${cols[bl.c][1 - bl.r]}, so ${base[bl.r]} ${fac(bl.c)} = <b>${right}</b>. Both rows scale by the same number.`;
        } else if (v === addWrong) {
          fb.className = 'ix-fb no';
          fb.innerHTML = `That adds the same amount to both rows (${base[1 - bl.r]} → ${cols[bl.c][1 - bl.r]} is +${cols[bl.c][1 - bl.r] - base[1 - bl.r]}). Ratios <b>multiply</b>: look at the arrow, ${fac(bl.c)}.`;
        } else {
          fb.className = 'ix-fb no';
          fb.innerHTML = `Check the arrow: this column is ${fac(bl.c)}. Use that same step on the other row.`;
        }
        draw();
      }
      draw();
      return root;
    }
    /* tiles */
    let k = 1, extra = 0, swapped = false;
    const rows = h('div', 'rt-rows');
    const read = h('div', 'ix-read rt-read');
    const ctl = h('div', 'ix-ctr');
    [rows, read, ctl].forEach((x) => root.appendChild(x));
    const kb = [1, 2, 3].map((n) => btn(n === 1 ? `${o.a} : ${o.b}` : '× ' + n, () => { k = n; extra = 0; draw(); }, 'rt-k'));
    kb.forEach((b) => ctl.appendChild(b));
    const bExtra = btn(`+1 ${o.la} only`, () => { extra = 1; draw(); }, 'ghost');
    const bSwap = btn('Swap ⇄', () => { swapped = !swapped; draw(); }, 'ghost');
    ctl.appendChild(bExtra); ctl.appendChild(bSwap);
    /* group columns: each column is one boxed copy of a : b, so the groups line up */
    function tiles(n, cls, odd) { const box = h('span', 'rt-box' + (odd ? ' odd' : '')); for (let j = 0; j < n; j++) box.appendChild(h('i', 'rt-t ' + cls)); return box; }
    function paint() {
      rows.innerHTML = '';
      const top = swapped ? ['b', o.lb, 'cb'] : ['a', o.la, 'ca'], bot = swapped ? ['a', o.la, 'ca'] : ['b', o.lb, 'cb'];
      const na0 = o.a * k + extra, nb0 = o.b * k;
      rows.appendChild(h('div', 'rt-legend', `<span><i class="rt-t ${top[2]}"></i>${top[1]}: <b>${swapped ? nb0 : na0}</b></span><span><i class="rt-t ${bot[2]}"></i>${bot[1]}: <b>${swapped ? na0 : nb0}</b></span>`));
      const g = h('div', 'rt-groups');
      for (let i = 0; i < k; i++) { const c = h('div', 'rt-gcol'); c.appendChild(tiles(o[top[0]], top[2])); c.appendChild(tiles(o[bot[0]], bot[2])); g.appendChild(c); }
      if (extra) { const c = h('div', 'rt-gcol'); const t = tiles(1, 'ca', true), e = h('span', 'rt-box empty'); if (swapped) { c.appendChild(e); c.appendChild(t); } else { c.appendChild(t); c.appendChild(e); } g.appendChild(c); }
      rows.appendChild(g);
    }
    function draw() {
      kb.forEach((b, i) => b.classList.toggle('on', i + 1 === k && !extra));
      paint();
      const na = o.a * k + extra, nb = o.b * k;
      const first = swapped ? nb : na, second = swapped ? na : nb, l1 = swapped ? o.lb : o.la, l2 = swapped ? o.la : o.lb;
      let html = `<div class="ix-eq">${l1} : ${l2} = <b>${first} : ${second}</b> = ${fr(first, second)}</div>`;
      if (extra) html += `<div class="ix-note rt-bad">The mix changed! ${na} : ${nb} is not the same as ${o.a} : ${o.b}. Adding to one part only breaks the ratio: multiply <b>both</b> parts.</div>`;
      else if (swapped) html += `<div class="ix-note">Order matters: ${first} ${l1} for every ${second} ${l2} is a different ratio from ${o.a} : ${o.b}.</div>`;
      else if (k > 1) html += `<div class="ix-note">${k} boxed groups of ${o.a} : ${o.b}. Both parts × ${k}, so ${o.a * k} : ${o.b * k} is equivalent to ${o.a} : ${o.b}.</div>`;
      else html += `<div class="ix-note">${o.a} ${o.la} for every ${o.b} ${o.lb}${o.unit ? ' ' + o.unit : ''}. Try × 2 and × 3.</div>`;
      read.innerHTML = html;
    }
    draw();
    return root;
  }

  /* ======================= dotPlot =======================
     { mode:'build'|'read'|'balance'|'outlier', values:[...], min, max, title, unit }
     build: drop one dot per value from the list (cycle:true adds Ask/Collect/Show/Tell chips, question:'...').
     read: tap a value to count its dots; ask:4 asks "how many at 4?"; Count all numbers every dot.
     balance: slide the ▲ until the line balances; it balances at the mean.
     outlier: toggle the far value and watch the mean and median move (outlier:80). */
  function dotPlot(opts) {
    const o = Object.assign({ mode: 'read', values: [2, 4, 4, 4, 6, 6, 8], title: '' }, opts || {});
    const vals = o.values.slice();
    const lo = o.min != null ? o.min : Math.min(...vals) - 1, hi = o.max != null ? o.max : Math.max(...vals) + 1;
    const span = hi - lo, small = span <= 14, R = small ? 8 : 5, GAP = R * 2 + 2;
    const x0 = 24, x1 = LL_W - 24, pos = (v) => x0 + (v - lo) / span * (x1 - x0);
    const tick = small ? 1 : span <= 30 ? 2 : 2, lab = small ? 1 : span <= 30 ? 5 : 10;
    const sum = (a) => a.reduce((s, x) => s + x, 0);
    const median = (a) => { const b = a.slice().sort((x, y) => x - y), n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; };
    const r1 = (x) => trimDec(x.toFixed(1));
    const root = h('div', 'viz ix ix-col ix-dp');
    const head = h('div', 'ix-q dp-ask');
    const stage = h('div', 'll-stage');
    const pad = h('div', 'ix-ctr dp-pad');
    const read = h('div', 'ix-read dp-read');
    const ctl = h('div', 'ix-ctr');
    const fb = h('div', 'ix-fb', '');
    [head, stage, pad, read, ctl, fb].forEach((x) => root.appendChild(x));
    /* draw the plot: shown = values with dots; opts: tilt (deg), fulcrum, marks [{v, cls, label}], faded value, numbered */
    function plot(shown, d) {
      d = d || {};
      const counts = {}; shown.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
      const tall = Math.max(1, ...Object.values(counts), d.room || 1);
      const top = 26 + (o.title ? 18 : 0), Y = top + tall * GAP + 8, H = Y + (d.fulcrum != null ? 64 : d.marks ? 66 : 36);
      const s = axisSvg(H);
      if (o.title) txt(s, LL_W / 2, 16, o.title, { 'font-size': '14' });
      const g = sv('g', { class: 'dp-beam' + (calm() ? ' calm' : '') }, s);
      if (d.tilt != null) { g.style.transformOrigin = `${pos(d.fulcrum)}px ${Y}px`; g.style.transform = `rotate(${d.tilt}deg)`; }
      sv('line', { x1: x0 - 8, y1: Y, x2: x1 + 8, y2: Y, stroke: 'var(--ink)', 'stroke-width': '3', 'stroke-linecap': 'round' }, g);
      for (let v = lo; v <= hi; v++) {
        if ((v - lo) % tick && v % tick) continue;
        sv('line', { x1: pos(v), y1: Y - 5, x2: pos(v), y2: Y + 5, stroke: 'var(--ink)', 'stroke-width': '1.6' }, g);
        if (v % lab === 0 || small) txt(g, pos(v), Y + 21, String(v), { 'font-size': '12.5', fill: d.hot === v ? 'var(--ink)' : 'var(--muted)' });
      }
      const seen = {}; let num = 0;
      shown.slice().sort((a, b) => a - b).forEach((v) => {
        const i = seen[v] = (seen[v] || 0) + 1, cy = Y - 4 - R - (i - 1) * GAP;
        const c = sv('circle', { cx: pos(v), cy, r: R, fill: d.faded === v ? 'var(--viz-empty)' : d.hot === v ? 'var(--viz-gold)' : 'var(--viz-blue)', stroke: 'var(--ink)', 'stroke-width': '1.8', class: d.drop === v && i === counts[v] ? 'dp-new' + (calm() ? ' calm' : '') : '' }, g);
        if (d.faded === v) c.setAttribute('stroke-dasharray', '3 2');
        if (d.numbered) { num++; txt(g, pos(v), cy + 4, String(num), { 'font-size': small ? '10' : '8', fill: '#fff' }); }
      });
      if (d.hot != null && counts[d.hot]) txt(g, pos(d.hot), Y - 4 - counts[d.hot] * GAP - 4, counts[d.hot] + ' dot' + (counts[d.hot] === 1 ? '' : 's'), { 'font-size': '13', fill: 'var(--viz-coral)' });
      (d.marks || []).forEach((m, i) => {
        const x = pos(m.v), yy = Y + 30 + i * 18;
        sv('path', { d: `M ${x - 6} ${yy} L ${x + 6} ${yy} L ${x} ${yy - 9} Z`, fill: m.color, stroke: 'var(--ink)', 'stroke-width': '1.2' }, s);
        txt(s, x + (x > LL_W - 80 ? -10 : 10), yy, m.label, { 'font-size': '12.5', fill: 'var(--ink)', 'text-anchor': x > LL_W - 80 ? 'end' : 'start' });
      });
      if (d.fulcrum != null) {
        const fx = pos(d.fulcrum);
        sv('path', { d: `M ${fx} ${Y + 4} L ${fx - 16} ${Y + 32} L ${fx + 16} ${Y + 32} Z`, fill: 'var(--viz-gold)', stroke: 'var(--ink)', 'stroke-width': '2' }, s);
      }
      stage.innerHTML = ''; stage.appendChild(s);
    }
    const valueButtons = (onTap, cls) => { pad.innerHTML = ''; for (let v = lo; v <= hi; v++) pad.appendChild(btn(String(v), () => onTap(v), 'dp-v' + (cls ? ' ' + cls(v) : ''))); };

    if (o.mode === 'build') {
      let placed = 0, stage4 = o.cycle ? 0 : 2;
      const steps = ['Ask', 'Collect', 'Show', 'Tell'];
      const chips = h('div', 'ix-chips dp-cycle');
      if (o.cycle) root.insertBefore(chips, head);
      function draw(drop) {
        chips.innerHTML = '';
        steps.forEach((t, i) => chips.appendChild(h('span', 'ix-chip' + (i === stage4 ? ' on dp-on' : ''), `<b>${i + 1}</b> ${t}`)));
        const list = vals.map((v, i) => `<span class="dp-tally${i < placed ? ' done' : i === placed ? ' now' : ''}">${v}</span>`).join('');
        ctl.innerHTML = ''; pad.innerHTML = '';
        if (stage4 === 0) { head.innerHTML = `<b>Ask:</b> ${o.question || 'What do we want to find out?'}`; plot([], { room: 3 }); read.innerHTML = '<div class="ix-note">A data question needs a count or a measure from a group.</div>'; ctl.appendChild(btn('Collect the data ▶', () => { stage4 = 1; draw(); }, 'go')); return; }
        if (stage4 === 1) { head.innerHTML = '<b>Collect:</b> here is what we found.'; plot([], { room: 3 }); read.innerHTML = `<div class="dp-list">${list}</div>`; ctl.appendChild(btn('Show it on a line plot ▶', () => { stage4 = 2; draw(); }, 'go')); return; }
        if (placed < vals.length) {
          head.innerHTML = `<b>Show:</b> dot ${placed + 1} of ${vals.length}. Tap <b>${vals[placed]}</b> in the number row under the line.`;
          read.innerHTML = `<div class="dp-list">${list}</div>`;
          plot(vals.slice(0, placed), { drop, room: 3 });
          valueButtons((v) => {
            if (v === vals[placed]) { placed++; if (placed === vals.length && o.cycle) stage4 = 3;
              const left = vals.slice(placed).filter((x) => x === v).length;
              draw(v); fb.className = 'ix-fb ok'; fb.innerHTML = `✓ Dot at ${v}.` + (left ? ` ${left} more ${v}${left === 1 ? '' : 's'} to go: the dots stack.` : ''); }
            else { fb.className = 'ix-fb no'; fb.innerHTML = `That's ${v}. This value is <b>${vals[placed]}</b>: find ${vals[placed]} on the line.`; }
          });
          read.querySelectorAll('.dp-tally').forEach((t) => { t.onclick = () => { const b = [...pad.children].find((x) => x.textContent === String(vals[placed]));
            fb.className = 'ix-fb'; fb.innerHTML = `This list is the data. Tap <b>${vals[placed]}</b> in the number row above it.`;
            if (b) { b.classList.remove('dp-hint'); void b.offsetWidth; b.classList.add('dp-hint'); } }; });
          return;
        }
        const counts = {}; vals.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
        const most = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
        head.innerHTML = o.cycle ? '<b>Tell:</b> what does the plot show?' : 'All the dots are in.';
        plot(vals, { hot: +most });
        read.innerHTML = `<div class="ix-note">${vals.length} values, ${vals.length} dots. The tallest stack is at <b>${most}</b>: ${o.tell || 'the most common value (the mode) is ' + most + '.'}</div>`;
        ctl.appendChild(btn('↺ Again', () => { placed = 0; stage4 = o.cycle ? 0 : 2; fb.className = 'ix-fb'; fb.innerHTML = ''; draw(); }, 'ghost'));
      }
      draw();
      return root;
    }
    if (o.mode === 'read') {
      let hot = null, numbered = false;
      function draw() {
        head.innerHTML = o.ask != null ? `How many are at <b>${o.ask}</b>? Tap ${o.ask} under the line.` : 'Tap a value to count its dots.';
        plot(vals, { hot, numbered });
        valueButtons((v) => {
          hot = v; numbered = false;
          const n = vals.filter((x) => x === v).length;
          if (o.ask != null && v === o.ask) { fb.className = 'ix-fb ok'; fb.innerHTML = `Yes: <b>${n} dots</b> above ${v}, so ${n} ${o.unit || 'values'} at ${v}. The height of a stack is a count.`; }
          else { fb.className = 'ix-fb'; fb.innerHTML = `${n} dot${n === 1 ? '' : 's'} above ${v}.` + (o.ask != null ? ` Now find ${o.ask}.` : ''); }
          draw();
        }, (v) => (v === hot ? 'on' : ''));
        ctl.innerHTML = '';
        ctl.appendChild(btn('Count all', () => { numbered = true; hot = null; fb.className = 'ix-fb ok'; fb.innerHTML = `${vals.length} dots, so <b>${vals.length}</b> ${o.unit || 'values'} in all. Range: ${Math.max(...vals)} − ${Math.min(...vals)} = ${Math.max(...vals) - Math.min(...vals)}.`; draw(); }, ''));
      }
      draw();
      return root;
    }
    if (o.mode === 'balance') {
      const mean = sum(vals) / vals.length, stepB = Number.isInteger(mean) ? 1 : 0.5;
      let f = o.start != null ? o.start : lo + 1;
      function draw() {
        const left = vals.filter((v) => v < f).map((v) => f - v), right = vals.filter((v) => v > f).map((v) => v - f);
        const tq = sum(right) - sum(left), tilt = Math.max(-14, Math.min(14, tq * 1.2));
        head.innerHTML = 'Slide the ▲ until the line balances like a seesaw.';
        plot(vals, { fulcrum: f, tilt });
        pad.innerHTML = '';
        const bl = btn('◀', () => { f = Math.max(lo, f - stepB); draw(); }, ''), br = btn('▶', () => { f = Math.min(hi, f + stepB); draw(); }, '');
        bl.setAttribute('aria-label', 'Move the balance point left'); br.setAttribute('aria-label', 'Move the balance point right');
        pad.appendChild(bl); pad.appendChild(h('b', 'dp-f', r1(f))); pad.appendChild(br);
        read.innerHTML = `<div class="ix-note">Left side pulls ${left.length ? left.join(' + ') + ' = ' + sum(left) : '0'} · Right side pulls ${right.length ? right.join(' + ') + ' = ' + sum(right) : '0'}</div>`;
        if (tq === 0) { fb.className = 'ix-fb ok'; fb.innerHTML = `Balanced at <b>${r1(f)}</b>! That is the mean: (${vals.join(' + ')}) ÷ ${vals.length} = ${sum(vals)} ÷ ${vals.length} = ${r1(mean)}.`; }
        else { fb.className = 'ix-fb'; fb.innerHTML = `It tips ${tq > 0 ? 'right' : 'left'}: move the ▲ ${tq > 0 ? 'right' : 'left'}.`; }
      }
      draw();
      return root;
    }
    /* outlier */
    const far = o.outlier != null ? o.outlier : vals.slice().sort((a, b) => Math.abs(b - median(vals)) - Math.abs(a - median(vals)))[0];
    let incl = true;
    const rest = vals.slice(); rest.splice(rest.indexOf(far), 1);
    const mA = sum(vals) / vals.length, mB = sum(rest) / rest.length, dA = median(vals), dB = median(rest);
    function draw() {
      head.innerHTML = `Is <b>${far}</b> far from the rest? Toggle it and watch the mean and median.`;
      const use = incl ? vals : rest;
      plot(vals, { faded: incl ? null : far, marks: [{ v: incl ? mA : mB, color: 'var(--viz-coral)', label: 'mean ' + r1(incl ? mA : mB) }, { v: incl ? dA : dB, color: 'var(--viz-teal)', label: 'median ' + r1(incl ? dA : dB) }] });
      void use;
      ctl.innerHTML = '';
      ctl.appendChild(btn(incl ? `Take out ${far}` : `Put ${far} back`, () => { incl = !incl; draw(); }, 'go'));
      read.innerHTML = `<table class="g5t dp-tab"><tr><th></th><th>With ${far}</th><th>Without</th></tr><tr><th>mean</th><td>${r1(mA)}</td><td>${r1(mB)}</td></tr><tr><th>median</th><td>${r1(dA)}</td><td>${r1(dB)}</td></tr></table><div class="ix-note">The mean moved ${r1(Math.abs(mA - mB))}; the median moved ${r1(Math.abs(dA - dB))}. One far value pulls the mean much more than the median.</div>`;
    }
    draw();
    return root;
  }

  /* ======================= mixedPiles =======================
     { op:'+', a:{w:2,n:3,d:4}, b:{w:1,n:1,d:2} } or { op:'−', a:{w:5,n:1,d:8}, b:{w:2,n:5,d:8} }.
     Two trays: wholes and parts. Rename to same-size pieces, trade a full set of parts for a whole (add),
     or borrow a whole as parts before taking away (subtract). */
  function mixedPiles(opts) {
    const o = Object.assign({ op: '+', a: { w: 2, n: 3, d: 4 }, b: { w: 1, n: 1, d: 2 } }, opts || {});
    const sub = o.op === '−' || o.op === '-', A = o.a, B = o.b;
    const D = A.d * B.d / gcd(A.d, B.d), pa = A.n * D / A.d, pb = B.n * D / B.d;
    const mixed = (w, n, d) => { const g = gcd(n, d); return n === 0 ? `<b>${w}</b>` : `${w ? '<b>' + w + '</b>' : ''}${fr(n, d)}${g > 1 ? ' = ' + (w ? '<b>' + w + '</b>' : '') + fr(n / g, d / g) : ''}`; };
    const show = (x) => `${x.w}${fr(x.n, x.d)}`;
    let renamed = A.d === B.d, traded = false, borrowed = false, taken = false;
    const root = h('div', 'viz ix ix-col ix-mp');
    const head = h('div', 'll-expr mp-expr', `${show(A)} ${sub ? '−' : '+'} ${show(B)}`);
    const trays = h('div', 'mp-trays');
    const read = h('div', 'ix-read mp-read');
    const ctl = h('div', 'ix-ctr');
    const fb = h('div', 'ix-fb', '');
    [head, trays, read, ctl, fb].forEach((x) => root.appendChild(x));
    const piece = (d, cls) => { const e = h('i', 'mp-p ' + cls); e.style.setProperty('--pw', String(1 / d)); return e; };
    function tray(name, kids) { const t = h('div', 'mp-tray'); t.appendChild(h('div', 'mp-tlab', name)); const b = h('div', 'mp-tb'); kids.forEach((k) => b.appendChild(k)); t.appendChild(b); return t; }
    function draw() {
      trays.innerHTML = ''; ctl.innerHTML = '';
      const W = [], P = [];
      if (!sub) {
        for (let i = 0; i < A.w; i++) W.push(h('span', 'mp-w ca', '1'));
        for (let i = 0; i < B.w; i++) W.push(h('span', 'mp-w cb', '1'));
        if (traded) W.push(h('span', 'mp-w traded', '1'));
        const na = renamed ? pa : A.n, da = renamed ? D : A.d, nb = renamed ? pb : B.n, db = renamed ? D : B.d;
        let skip = traded ? D : 0;
        for (let i = 0; i < na; i++) { if (skip > 0) { skip--; continue; } P.push(piece(da, 'ca')); }
        for (let i = 0; i < nb; i++) { if (skip > 0) { skip--; continue; } P.push(piece(db, 'cb')); }
        trays.appendChild(tray('Wholes', W)); trays.appendChild(tray('Parts', P.length ? P : [h('span', 'mp-none', '0')]));
        const wsum = A.w + B.w, psum = pa + pb;
        if (!renamed) {
          read.innerHTML = `<div class="ix-eq">Wholes: ${A.w} + ${B.w} = ${wsum}</div><div class="ix-note">Parts: ${fr(A.n, A.d)} + ${fr(B.n, B.d)}: the pieces are not the same size yet.</div>`;
          ctl.appendChild(btn(`Cut all parts into ${D}ths`, () => { renamed = true; draw(); }, 'go'));
        } else if (psum >= D && !traded) {
          read.innerHTML = `<div class="ix-eq">Wholes: ${wsum} · Parts: ${fr(pa, D)} + ${fr(pb, D)} = ${fr(psum, D)}</div><div class="ix-note">${fr(psum, D)} is more than 1 whole: ${D} pieces make ${fr(D, D)} = 1.</div>`;
          ctl.appendChild(btn(`Trade ${D}/${D} for 1 whole`, () => { traded = true; draw(); }, 'go mp-glow'));
        } else {
          const wf = wsum + (traded ? 1 : 0), pf = psum - (traded ? D : 0);
          read.innerHTML = `<div class="ix-eq">${show(A)} + ${show(B)} = ${mixed(wf, pf, D)}</div><div class="ix-note">Wholes with wholes, parts with parts${traded ? ', and a full set of parts became 1 whole' : ''}.</div>`;
          ctl.appendChild(btn('↺ Again', () => { renamed = A.d === B.d; traded = false; draw(); }, 'ghost'));
        }
        return;
      }
      /* subtract: only the first number is in the trays; the second is taken away */
      const wA = A.w - (borrowed ? 1 : 0), nA = (renamed ? pa : A.n) + (borrowed ? (renamed ? D : A.d) : 0), dA = renamed ? D : A.d;
      for (let i = 0; i < wA; i++) W.push(h('span', 'mp-w ca' + (taken && i >= wA - B.w ? ' gone' : ''), '1'));
      if (borrowed) W.push(h('span', 'mp-w broke', '1 → ' + fr(dA, dA)));
      const takeN = renamed ? pb : B.n;
      for (let i = 0; i < nA; i++) P.push(piece(dA, (borrowed && i >= nA - dA ? 'cb' : 'ca') + (taken && i < takeN ? ' gone' : '')));
      trays.appendChild(tray('Wholes', W)); trays.appendChild(tray('Parts', P));
      if (!renamed) {
        read.innerHTML = `<div class="ix-note">Take away ${show(B)}. The parts are not the same size yet.</div>`;
        ctl.appendChild(btn(`Cut into ${D}ths`, () => { renamed = true; draw(); }, 'go'));
        return;
      }
      if (taken) {
        const wf = wA - B.w, pf = nA - pb;
        read.innerHTML = `<div class="ix-eq">${show(A)} − ${show(B)} = ${mixed(wf, pf, D)}</div><div class="ix-note">${borrowed ? `We traded 1 whole for ${fr(D, D)}, so ${show(A)} became ${A.w - 1}${fr(nA, D)}. ` : ''}Then wholes minus wholes, parts minus parts.</div>`;
        ctl.appendChild(btn('↺ Again', () => { renamed = A.d === B.d; borrowed = false; taken = false; fb.className = 'ix-fb'; fb.innerHTML = ''; draw(); }, 'ghost'));
        return;
      }
      read.innerHTML = `<div class="ix-eq">Parts: ${fr(nA, D)} − ${fr(pb, D)}?</div><div class="ix-note">${nA < pb ? `${fr(nA, D)} is too small to take ${fr(pb, D)} from.` : `There are enough parts to take ${fr(pb, D)}.`}</div>`;
      if (nA < pb) ctl.appendChild(btn(`Borrow 1 whole = ${D}/${D}`, () => { borrowed = true; fb.className = 'ix-fb'; fb.innerHTML = ''; draw(); }, 'go mp-glow'));
      ctl.appendChild(btn(`Take away ${B.w} ${B.n}/${B.d}`, () => {
        if (nA < pb) { fb.className = 'ix-fb no'; fb.innerHTML = `Only ${fr(nA, D)} in the parts tray, and you need to take ${fr(pb, D)}. <b>Borrow 1 whole</b> first: it becomes ${fr(D, D)}.`; return; }
        taken = true; fb.className = 'ix-fb'; fb.innerHTML = ''; draw();
      }, nA < pb ? 'ghost' : 'go'));
    }
    draw();
    return root;
  }

  Object.assign(IX, { lineLab, decimalStack, placeShift, fitStrips, ratioTiles, dotPlot, mixedPiles });
})(window);
