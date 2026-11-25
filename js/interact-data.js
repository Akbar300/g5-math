/* interact-data.js — data-unit See it widgets (loaded after interact-more.js)
     IX.centerLab    one data set, four tabs: mean / median / mode / range; "New data" to explore
     IX.stemBuilder  build a stem-and-leaf plot leaf by leaf; 'read' mode taps a stem row
     IX.barLab       bar graph or double bar graph; read (tap bars, compare) or build (tap a height)
     IX.lineGraph    line graph over time; read (tap two points: change) or build (plot each point)
     IX.circleLab    circle graph: tap a slice, see percent → count; switch the total
*/
(function (w) {
  'use strict';
  const IX = w.IX = w.IX || {};
  const NS = 'http://www.w3.org/2000/svg';
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const btn = (label, onClick, cls) => { const b = h('button', 'ix-btn' + (cls ? ' ' + cls : ''), label); b.type = 'button'; b.onclick = onClick; return b; };
  const sv = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); if (parent) parent.appendChild(e); return e; };
  const txt = (p, x, y, s, a) => { const t = sv('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': '12.5', 'font-weight': '800', fill: 'var(--ink)' }, a || {}), p); t.textContent = s; return t; };
  const calm = () => !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const shell = (cls) => { const root = h('div', 'viz ix ix-col xm xd ' + cls), fb = h('div', 'ix-fb'); return { root, fb }; };
  const say = (fb, ok, html) => { fb.className = 'ix-fb ' + (ok === true ? 'ok' : ok === false ? 'no' : ''); fb.innerHTML = html; };
  const row = (cls) => h('div', 'xm-row' + (cls ? ' ' + cls : ''));
  const nice = (v) => String(+(+v).toFixed(2));
  const sortN = (a) => a.slice().sort((x, y) => x - y);
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const tabs = (names, cur, onPick) => { const r = row('xd-tabs'); names.forEach((n, i) => { const b = btn(n, () => onPick(i), i === cur ? 'on' : ''); b.setAttribute('aria-pressed', i === cur ? 'true' : 'false'); r.appendChild(b); }); return r; };

  /* ======================= centerLab { values, show:'mean'|'median'|'mode'|'range', unit } ======================= */
  function centerLab(o) {
    const { root, fb } = shell('xd-center');
    const NAMES = ['Mean', 'Median', 'Mode', 'Range'], KEYS = ['mean', 'median', 'mode', 'range'];
    let vals = (o.values || [4, 7, 2, 9, 5]).slice(), tab = Math.max(0, KEYS.indexOf(o.show || 'mean'));
    let ordered = false, crossed = 0, meanStep = 0;
    const tb = h('div'), q = h('div', 'xm-q'), chips = row('xd-chips'), work = h('div', 'xd-work'), ctl = row();
    [tb, q, chips, work, ctl, fb].forEach((x) => root.appendChild(x));
    const reset = () => { ordered = false; crossed = 0; meanStep = 0; };
    const counts = () => { const c = {}; vals.forEach((v) => { c[v] = (c[v] || 0) + 1; }); return c; };
    function drawChips(opt) {
      opt = opt || {}; chips.innerHTML = '';
      const list = ordered ? sortN(vals) : vals, n = list.length;
      list.forEach((v, i) => {
        let cls = 'xd-chip';
        if (opt.cross && (i < opt.cross || i >= n - opt.cross)) cls += ' x';
        if (opt.mid && opt.mid.indexOf(i) >= 0) cls += ' mid';
        if (opt.hot && opt.hot.indexOf(v) >= 0) cls += ' hot';
        if (opt.ends && (i === 0 || i === n - 1)) cls += ' end';
        chips.appendChild(h('span', cls, String(v)));
      });
    }
    function draw() {
      tb.innerHTML = ''; tb.appendChild(tabs(NAMES, tab, (i) => { tab = i; reset(); say(fb, null, ''); draw(); }));
      ctl.innerHTML = ''; work.innerHTML = '';
      const n = vals.length, s = sortN(vals), total = vals.reduce((a, b) => a + b, 0);
      const orderBtn = () => btn('Put in order ▶', () => { ordered = true; draw(); }, 'go');
      if (tab === 0) { /* mean */
        q.innerHTML = '<b>Mean</b> = fair share. Add them all, then share equally.';
        drawChips();
        if (meanStep >= 1) work.innerHTML = `<div class="xd-line">Add: ${vals.join(' + ')} = <b>${total}</b></div>`;
        if (meanStep >= 2) work.innerHTML += `<div class="xd-line">Share among ${n}: ${total} ÷ ${n} = <b>${nice(total / n)}</b></div>`;
        if (meanStep === 0) { ctl.appendChild(btn('Add them up ▶', () => { meanStep = 1; draw(); }, 'go')); say(fb, null, 'Step 1: find the total.'); }
        else if (meanStep === 1) { ctl.appendChild(btn(`Divide by ${n} ▶`, () => { meanStep = 2; draw(); }, 'go')); say(fb, null, `Step 2: there are ${n} values, so divide by ${n}.`); }
        else say(fb, true, `✓ The mean is <b>${nice(total / n)}</b>. If everyone shared evenly, each gets ${nice(total / n)}.`);
      } else if (tab === 1) { /* median */
        q.innerHTML = '<b>Median</b> = the middle value, after the numbers are in order.';
        const maxCross = Math.floor((n - 1) / 2), done = ordered && crossed >= maxCross;
        const mid = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2];
        drawChips({ cross: ordered ? crossed : 0, mid: done ? mid : null });
        if (!ordered) { ctl.appendChild(orderBtn()); say(fb, null, 'The median only works on ordered data. Put them in order first.'); }
        else if (!done) { ctl.appendChild(btn('Cross off one from each end ✂', () => { crossed++; draw(); }, 'go')); say(fb, null, `Ordered ✓ Now cross off the smallest and the greatest together.`); }
        else if (n % 2) say(fb, true, `✓ One value is left in the middle: the median is <b>${s[mid[0]]}</b>.`);
        else { work.innerHTML = `<div class="xd-line">Two in the middle: (${s[mid[0]]} + ${s[mid[1]]}) ÷ 2 = <b>${nice((s[mid[0]] + s[mid[1]]) / 2)}</b></div>`; say(fb, true, `✓ An even count leaves two middle values. The median is their mean: <b>${nice((s[mid[0]] + s[mid[1]]) / 2)}</b>.`); }
      } else if (tab === 2) { /* mode */
        q.innerHTML = '<b>Mode</b> = the value that shows up most often.';
        ordered = true;
        const c = counts(), top = Math.max(...Object.values(c)), modes = Object.keys(c).filter((k) => c[k] === top).map(Number);
        drawChips({ hot: top > 1 ? modes : [] });
        const tally = sortN(Object.keys(c).map(Number)).map((v) => `<span class="xd-tally${c[v] === top && top > 1 ? ' hot' : ''}"><b>${v}</b>${'●'.repeat(c[v])}</span>`).join('');
        work.innerHTML = `<div class="xd-tallies">${tally}</div>`;
        if (top === 1) say(fb, true, 'Every value shows up once, so there is <b>no mode</b>.');
        else if (modes.length > 1) say(fb, true, `✓ Tie: ${modes.join(' and ')} each show up ${top} times. This data has <b>two modes</b>.`);
        else say(fb, true, `✓ ${modes[0]} shows up ${top} times, more than any other value. The mode is <b>${modes[0]}</b>.`);
      } else { /* range */
        q.innerHTML = '<b>Range</b> = greatest − least. It tells how spread out the data is.';
        drawChips({ ends: ordered });
        if (!ordered) { ctl.appendChild(orderBtn()); say(fb, null, 'Order the data so the least and greatest are at the ends.'); }
        else {
          const lo = s[0], hi = s[n - 1], W = 320, x = (v) => 20 + (v - lo) / Math.max(1, hi - lo) * (W - 40);
          const svg = sv('svg', { viewBox: `0 0 ${W} 58`, class: 'xd-span', role: 'img', 'aria-label': `Range from ${lo} to ${hi}` });
          sv('line', { x1: 10, y1: 34, x2: W - 10, y2: 34, stroke: 'var(--muted)', 'stroke-width': '2' }, svg);
          vals.forEach((v) => sv('circle', { cx: x(v), cy: 34, r: 5, fill: 'var(--viz-blue)', stroke: 'var(--ink)', 'stroke-width': '1.4' }, svg));
          sv('path', { d: `M ${x(lo)} 18 L ${x(lo)} 12 L ${x(hi)} 12 L ${x(hi)} 18`, fill: 'none', stroke: 'var(--viz-coral)', 'stroke-width': '3' }, svg);
          txt(svg, (x(lo) + x(hi)) / 2, 9, `${hi} − ${lo} = ${hi - lo}`, { fill: 'var(--viz-coral)', 'font-size': '11' });
          txt(svg, x(lo), 54, String(lo)); txt(svg, x(hi), 54, String(hi));
          work.appendChild(svg);
          say(fb, true, `✓ Greatest ${hi} − least ${lo} = <b>${hi - lo}</b>. ${hi - lo <= 3 ? 'Small range: the values are close together.' : 'The values spread across ' + (hi - lo) + '.'}`);
        }
      }
      ctl.appendChild(btn('🎲 New data', () => { const k = ri(5, 8); vals = Array.from({ length: k }, () => ri(1, 12)); reset(); draw(); }));
    }
    draw(); return root;
  }

  /* ======================= stemBuilder { values, title, mode:'build'|'read', ask } ======================= */
  function stemBuilder(o) {
    const { root, fb } = shell('xd-stem');
    const vals = o.values.slice(), mode = o.mode || 'build';
    const stems = []; const lo = Math.floor(Math.min(...vals) / 10), hi = Math.floor(Math.max(...vals) / 10);
    for (let s = lo; s <= hi; s++) stems.push(s);
    const k0 = vals.slice().sort((a, b) => a - b)[0];
    let placed = mode === 'build' ? 0 : vals.length, picked = null;
    const q = h('div', 'xm-q'), list = row('xd-chips'), tw = h('div', 'sl-scroll'), key = h('div', 'sl-key', o.key || `Key: ${Math.floor(k0 / 10)} | ${k0 % 10} means ${k0}`), ctl = row();
    [q, list, tw, key, fb, ctl].forEach((x) => root.appendChild(x));
    function draw(fresh) {
      const leaves = {}; stems.forEach((s) => { leaves[s] = []; });
      vals.slice(0, placed).forEach((v) => leaves[Math.floor(v / 10)].push(v % 10));
      stems.forEach((s) => leaves[s].sort((a, b) => a - b));
      const t = h('table', 'g5t sl-tbl xd-stemtbl');
      t.innerHTML = (o.title ? `<caption>${o.title}</caption>` : '') + '<thead><tr><th>Stem</th><th>Leaf</th></tr></thead>';
      const tb = h('tbody'); t.appendChild(tb);
      stems.forEach((s) => {
        const tr = h('tr', 'xd-srow' + (picked === s ? ' on' : ''));
        let freshDone = false;
        const lf = leaves[s].map((l) => { const isNew = !freshDone && fresh && fresh.s === s && fresh.l === l; if (isNew) freshDone = true; return `<span class="xd-leaf${isNew && !calm() ? ' new' : ''}">${l}</span>`; }).join(' ');
        tr.innerHTML = `<td class="st"><button type="button" class="ix-btn xd-stembtn">${s}</button></td><td class="lf">${lf || '<span class="xd-empty">·</span>'}</td>`;
        tr.querySelector('button').onclick = () => tapStem(s);
        tb.appendChild(tr);
      });
      tw.innerHTML = ''; tw.appendChild(t);
      list.innerHTML = mode === 'build' ? vals.map((v, i) => `<span class="xd-chip${i < placed ? ' x' : i === placed ? ' now' : ''}">${v}</span>`).join('') : '';
      ctl.innerHTML = '';
      if (mode === 'build') {
        if (placed < vals.length) { const v = vals[placed]; q.innerHTML = `Value ${placed + 1} of ${vals.length}: <b>${v}</b>. Its tens digit is the stem. Tap the stem row it goes in.`; }
        else { q.innerHTML = 'Plot done!'; say(fb, true, `✓ ${vals.length} values, ${vals.length} leaves. Each row's leaves go least to greatest, and the key tells how to read them.`); ctl.appendChild(btn('↺ Build again', () => { placed = 0; picked = null; say(fb, null, ''); draw(); })); }
      } else {
        q.innerHTML = o.ask != null ? `How many values have a stem of <b>${o.ask}</b>? Tap that stem.` : 'Tap a stem to read its row.';
      }
    }
    function tapStem(s) {
      if (mode === 'build') {
        if (placed >= vals.length) return;
        const v = vals[placed], want = Math.floor(v / 10);
        if (s === want) { placed++; picked = null; say(fb, true, `✓ ${v} → stem ${s}, leaf ${v % 10}.`); draw({ s, l: v % 10 }); }
        else say(fb, false, `${v} has ${want} tens, so it goes in the <b>${want}</b> row, not ${s}.`);
        return;
      }
      picked = s; draw();
      const rowVals = vals.filter((v) => Math.floor(v / 10) === s).sort((a, b) => a - b);
      const msg = rowVals.length ? `Stem ${s}: ${rowVals.join(', ')}. That is <b>${rowVals.length}</b> value${rowVals.length === 1 ? '' : 's'}.` : `Stem ${s} has no leaves: no values in the ${s * 10}s.`;
      if (o.ask != null) say(fb, s === o.ask ? true : null, (s === o.ask ? '✓ ' : '') + msg + (s === o.ask ? '' : ` Now find stem ${o.ask}.`));
      else say(fb, true, msg);
    }
    draw(); if (mode === 'build') say(fb, null, 'Split each number: tens in the stem, ones in the leaf.');
    return root;
  }

  /* shared chart frame for bar / line graphs */
  function frame(o, nCats, H) {
    const W = 340, L = 38, R = 10, T = o.title ? 26 : 12, B = H - 34;
    const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'xd-chart', role: 'img', 'aria-label': o.title || 'graph' });
    if (o.title) txt(s, W / 2, 16, o.title, { 'font-size': '13.5' });
    const max = o.max, step = o.step, y = (v) => B - v / max * (B - T);
    for (let v = 0; v <= max; v += step) {
      sv('line', { x1: L, y1: y(v), x2: W - R, y2: y(v), stroke: 'var(--line)', 'stroke-width': v ? '1' : '2' }, s);
      txt(s, L - 6, y(v) + 4, String(v), { 'text-anchor': 'end', 'font-size': '11', fill: 'var(--muted)' });
    }
    sv('line', { x1: L, y1: T - 4, x2: L, y2: B, stroke: 'var(--ink)', 'stroke-width': '2' }, s);
    sv('line', { x1: L, y1: B, x2: W - R, y2: B, stroke: 'var(--ink)', 'stroke-width': '2' }, s);
    const colW = (W - L - R) / nCats, cx = (i) => L + colW * (i + 0.5);
    return { s, W, L, R, T, B, y, colW, cx };
  }
  const SERIES = ['var(--viz-blue)', 'var(--viz-gold)'];

  /* ======================= barLab { title, cats, series:[{name, vals}], max, step, mode:'read'|'build', unit } ======================= */
  function barLab(o) {
    const { root, fb } = shell('xd-bar');
    const ser = o.series, nS = ser.length, mode = o.mode || 'read', unit = o.unit || '';
    const cur = ser.map((s) => (mode === 'build' ? s.vals.map(() => 0) : s.vals.slice()));
    let picks = [];
    const q = h('div', 'xm-q'), legend = row('xd-legend'), box = h('div', 'xd-chartbox'), tbl = h('div', 'xd-tbl'), ctl = row();
    [q, legend, box, tbl, ctl, fb].forEach((x) => root.appendChild(x));
    if (nS > 1) legend.innerHTML = ser.map((s, i) => `<span><i style="background:${SERIES[i]}"></i>${s.name}</span>`).join('');
    if (mode === 'build') tbl.innerHTML = `<table class="g5t xd-mini"><tr><th></th>${o.cats.map((c) => `<th>${c}</th>`).join('')}</tr>${ser.map((s) => `<tr><td>${s.name || 'Value'}</td>${s.vals.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
    function draw() {
      const F = frame(o, o.cats.length, 230), bw = Math.min(40, F.colW * 0.7 / nS);
      o.cats.forEach((c, i) => {
        txt(F.s, F.cx(i), F.B + 16, c, { 'font-size': '11.5' });
        ser.forEach((sr, j) => {
          const v = cur[j][i], x = F.cx(i) - (nS * bw) / 2 + j * bw, on = picks.some((p) => p.i === i && p.j === j);
          if (mode === 'build') { /* tap column to set height */
            const hit = sv('rect', { x, y: F.T, width: bw, height: F.B - F.T, fill: 'transparent', class: 'xd-hit' }, F.s);
            hit.addEventListener('click', (ev) => { const r = F.s.getBoundingClientRect(), vy = (ev.clientY - r.top) / r.height * 230;
              const raw = (F.B - vy) / (F.B - F.T) * o.max, sn = Math.max(0, Math.min(o.max, Math.round(raw / (o.step / 2)) * (o.step / 2))); cur[j][i] = sn; check(); draw(); });
          }
          const b = sv('rect', { x: x + 1, y: F.y(v), width: bw - 2, height: Math.max(0, F.B - F.y(v)), fill: SERIES[j], stroke: on ? 'var(--viz-coral)' : 'var(--ink)', 'stroke-width': on ? '3.5' : '1.6', class: 'xd-barr' + (mode === 'read' ? ' tap' : '') }, F.s);
          if (mode === 'read') b.addEventListener('click', () => tap(i, j));
          if (on || mode === 'build') {
            if (on) sv('line', { x1: F.L, y1: F.y(v), x2: x, y2: F.y(v), stroke: 'var(--viz-coral)', 'stroke-width': '2', 'stroke-dasharray': '4 3' }, F.s);
            if (v || on) txt(F.s, x + bw / 2, F.y(v) - 4, String(v), { 'font-size': '11.5' });
          }
        });
      });
      box.innerHTML = ''; box.appendChild(F.s);
    }
    function tap(i, j) {
      picks = picks.length >= 2 ? [] : picks; picks.push({ i, j });
      const name = (p) => `${o.cats[p.i]}${nS > 1 ? ' (' + ser[p.j].name + ')' : ''}`, val = (p) => ser[p.j].vals[p.i];
      if (picks.length === 1) say(fb, null, `${name(picks[0])}: the bar reaches <b>${val(picks[0])}</b>${unit ? ' ' + unit : ''}. Tap another bar to compare.`);
      else { const [a, b] = picks, d = Math.abs(val(a) - val(b)), big = val(a) >= val(b) ? a : b, sm = big === a ? b : a;
        say(fb, true, d ? `${name(big)} − ${name(sm)} = ${val(big)} − ${val(sm)} = <b>${d}</b> more${unit ? ' ' + (d === 1 ? unit.replace(/s$/, '') : unit) : ''}.` : `Same height: both are ${val(a)}.`); }
      draw();
    }
    function check() {
      const wrong = []; ser.forEach((sr, j) => sr.vals.forEach((v, i) => { if (cur[j][i] !== v) wrong.push(o.cats[i] + (nS > 1 ? ' ' + sr.name : '')); }));
      if (!wrong.length) say(fb, true, '✓ Every bar matches the table. Read the top of each bar against the scale.');
      else say(fb, null, `${wrong.length} bar${wrong.length === 1 ? '' : 's'} to go: ${wrong.slice(0, 3).join(', ')}${wrong.length > 3 ? '…' : ''}. Tap inside a column at the right height.`);
    }
    q.innerHTML = mode === 'build' ? `Build it: tap inside each column to set the bar's height. Match the table.` : (nS > 1 ? 'A <b>double bar graph</b> compares two groups. Tap a bar to read it, then another to compare.' : 'Tap a bar to read its height. Tap a second bar to compare.');
    ctl.appendChild(btn('↺ Reset', () => { picks = []; ser.forEach((s, j) => { cur[j] = mode === 'build' ? s.vals.map(() => 0) : s.vals.slice(); }); say(fb, null, ''); draw(); }));
    draw(); if (mode === 'build') check();
    return root;
  }

  /* ======================= lineGraph { title, xs, ys, max, step, mode:'read'|'build', unit } ======================= */
  function lineGraph(o) {
    const { root, fb } = shell('xd-line');
    const mode = o.mode || 'read', unit = o.unit || '';
    const cur = mode === 'build' ? o.ys.map(() => null) : o.ys.slice();
    let picks = [];
    const q = h('div', 'xm-q'), box = h('div', 'xd-chartbox'), tbl = h('div', 'xd-tbl'), ctl = row();
    [q, box, tbl, ctl, fb].forEach((x) => root.appendChild(x));
    if (mode === 'build') tbl.innerHTML = `<table class="g5t xd-mini"><tr>${o.xs.map((c) => `<th>${c}</th>`).join('')}</tr><tr>${o.ys.map((v) => `<td>${v}</td>`).join('')}</tr></table>`;
    function draw() {
      const F = frame(o, o.xs.length, 230);
      o.xs.forEach((c, i) => {
        txt(F.s, F.cx(i), F.B + 16, c, { 'font-size': '11.5' });
        if (mode === 'build') {
          const hit = sv('rect', { x: F.cx(i) - F.colW / 2, y: F.T, width: F.colW, height: F.B - F.T, fill: 'transparent', class: 'xd-hit' }, F.s);
          hit.addEventListener('click', (ev) => { const r = F.s.getBoundingClientRect(), vy = (ev.clientY - r.top) / r.height * 230;
            const raw = (F.B - vy) / (F.B - F.T) * o.max; cur[i] = Math.max(0, Math.min(o.max, Math.round(raw / (o.step / 2)) * (o.step / 2))); check(); draw(); });
        }
      });
      const pts = cur.map((v, i) => (v == null ? null : [F.cx(i), F.y(v)]));
      let d = ''; pts.forEach((p, i) => { if (!p) return; d += (d && pts[i - 1] ? ' L ' : ' M ') + p[0] + ' ' + p[1]; });
      if (d) sv('path', { d, fill: 'none', stroke: 'var(--viz-blue)', 'stroke-width': '3', 'stroke-linejoin': 'round' }, F.s);
      pts.forEach((p, i) => { if (!p) return; const on = picks.indexOf(i) >= 0;
        const c = sv('circle', { cx: p[0], cy: p[1], r: on ? 8 : 6, fill: on ? 'var(--viz-gold)' : 'var(--viz-blue)', stroke: 'var(--ink)', 'stroke-width': '1.8', class: mode === 'read' ? 'xd-pt' : '' }, F.s);
        if (mode === 'read') { const hit = sv('circle', { cx: p[0], cy: p[1], r: 16, fill: 'transparent', class: 'xd-pt' }, F.s); hit.addEventListener('click', () => tap(i)); c.addEventListener('click', () => tap(i)); }
        if (on || mode === 'build') txt(F.s, p[0], p[1] - 11, String(cur[i]), { 'font-size': '11.5' });
      });
      box.innerHTML = ''; box.appendChild(F.s);
    }
    function tap(i) {
      picks = picks.length >= 2 ? [] : picks; picks.push(i); picks.sort((a, b) => a - b);
      if (picks.length === 1) say(fb, null, `${o.xs[i]}: <b>${o.ys[i]}</b>${unit ? ' ' + unit : ''}. Tap another point to see the change.`);
      else { const [a, b] = picks, d = o.ys[b] - o.ys[a];
        say(fb, true, `From ${o.xs[a]} to ${o.xs[b]}: ${o.ys[b]} − ${o.ys[a]} = ${d > 0 ? '<b>up ' + d + '</b>' : d < 0 ? '<b>down ' + (-d) + '</b>' : '<b>no change</b>'}${unit ? ' ' + unit : ''}. ${d > 0 ? 'The line goes up.' : d < 0 ? 'The line goes down.' : 'The line is flat.'}`); }
      draw();
    }
    function check() {
      const left = o.ys.filter((v, i) => cur[i] !== v).length;
      if (!left) { say(fb, true, '✓ All points plotted. Connect them in order: the line shows the change over time.'); }
      else say(fb, null, `${left} point${left === 1 ? '' : 's'} to go. Tap in each column at the value from the table.`);
    }
    q.innerHTML = mode === 'build' ? 'Plot each point: tap in the column at the right height.' : 'A <b>line graph</b> shows change over time. Tap two points to find the change.';
    ctl.appendChild(btn('↺ Reset', () => { picks = []; o.ys.forEach((v, i) => { cur[i] = mode === 'build' ? null : v; }); say(fb, null, ''); draw(); }));
    if (mode === 'read') ctl.appendChild(btn('Biggest jump?', () => { let bi = 1, bd = -Infinity; for (let i = 1; i < o.ys.length; i++) { const dd = Math.abs(o.ys[i] - o.ys[i - 1]); if (dd > bd) { bd = dd; bi = i; } } picks = [bi - 1]; tap(bi); }));
    draw(); if (mode === 'build') check();
    return root;
  }

  /* ======================= circleLab { parts:[{name, pct}], total, totals:[20,40,60] } ======================= */
  function circleLab(o) {
    const { root, fb } = shell('xd-circle');
    const COLS = ['var(--viz-blue)', 'var(--viz-gold)', 'var(--teal)', 'var(--viz-coral)', '#6c4ee0'];
    let total = o.total || 20, pick = null;
    const q = h('div', 'xm-q'), wrap = row('xd-pie'), ctl = row(), legend = h('div', 'xd-plist');
    [q, wrap, ctl, fb].forEach((x) => root.appendChild(x));
    function draw() {
      const S = 200, c = S / 2, R = 88; const svg = sv('svg', { viewBox: `0 0 ${S} ${S}`, class: 'xd-piesvg', role: 'img', 'aria-label': 'Circle graph' });
      let a0 = -Math.PI / 2;
      o.parts.forEach((p, i) => {
        const a1 = a0 + p.pct / 100 * Math.PI * 2, am = (a0 + a1) / 2, off = pick === i ? 8 : 0, dx = Math.cos(am) * off, dy = Math.sin(am) * off;
        const P = (a) => `${(c + dx + R * Math.cos(a)).toFixed(1)} ${(c + dy + R * Math.sin(a)).toFixed(1)}`;
        const path = sv('path', { d: `M ${c + dx} ${c + dy} L ${P(a0)} A ${R} ${R} 0 ${p.pct > 50 ? 1 : 0} 1 ${P(a1)} Z`, fill: COLS[i % COLS.length], stroke: 'var(--ink)', 'stroke-width': pick === i ? '3' : '1.8', class: 'xd-slice' }, svg);
        path.addEventListener('click', () => { pick = i; draw(); show(); });
        txt(svg, c + dx + R * 0.62 * Math.cos(am), c + dy + R * 0.62 * Math.sin(am) + 4, p.pct + '%', { 'font-size': '12', fill: '#10202c' });
        a0 = a1;
      });
      legend.innerHTML = o.parts.map((p, i) => `<button type="button" class="ix-btn xd-pkey${pick === i ? ' on' : ''}" data-i="${i}"><i style="background:${COLS[i % COLS.length]}"></i>${p.name}</button>`).join('');
      legend.querySelectorAll('button').forEach((b) => { b.onclick = () => { pick = +b.dataset.i; draw(); show(); }; });
      wrap.innerHTML = ''; wrap.appendChild(svg); wrap.appendChild(legend);
      q.innerHTML = `A <b>circle graph</b>: ${total} students in all. Slices add to 100%. Tap a slice.`;
      ctl.innerHTML = '<b class="xm-lab">Total:</b>';
      (o.totals || [20, 40, 60]).forEach((t) => ctl.appendChild(btn(String(t), () => { total = t; draw(); if (pick != null) show(); }, t === total ? 'on' : '')));
    }
    function show() { const p = o.parts[pick], n = p.pct / 100 * total;
      say(fb, true, `${p.name}: ${p.pct}% of ${total} = ${nice(p.pct / 100)} × ${total} = <b>${nice(n)}</b> student${n === 1 ? '' : 's'}.`); }
    draw(); say(fb, null, `Check: ${o.parts.map((p) => p.pct + '%').join(' + ')} = ${o.parts.reduce((s, p) => s + p.pct, 0)}%.`);
    return root;
  }

  Object.assign(IX, { centerLab, stemBuilder, barLab, lineGraph, circleLab });
})(window);
