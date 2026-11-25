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

  /* Modes are registered here: a new mode is one function (opts) → DOM node.
     'drop' (place chips like 0.45, 48%, 2/5 on a line) and 'ray' (inequalities) are planned for Batches 2 and 4. */
  const LL_MODES = { round: llRound, hop: llHop, compare: llCompare };
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
  const PS_NAMES = { 3: 'thous', 2: 'hund', 1: 'tens', 0: 'ones', '-1': 'tenths', '-2': 'hund-ths', '-3': 'thou-ths' };
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
      for (let i = 0; i < len; i++) items.push({ p: Nn.e + len - 1 - i, ch: Nn.m[i], key: 'd' + i });
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

  Object.assign(IX, { lineLab, decimalStack, placeShift, fitStrips });
})(window);
