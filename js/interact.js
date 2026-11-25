/* Hands-on Learn widgets: a tappable hundredths grid and a tappable fraction bar.
   Both return a DOM node (class "viz ix") that engine.mountViz drops into a lesson card. */
(function (w) {
  const paintFill = (c) => (w.V && V.themeFill) ? V.themeFill(c) : c;
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const fr = (n, d) => `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`;
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const btn = (label, onClick, cls) => { const b = h('button', 'ix-btn' + (cls ? ' ' + cls : ''), label); b.type = 'button'; b.onclick = onClick; return b; };

  /* Decimal text for n/d: exact up to thousandths, else three digits and "…". */
  function decText(n, d) {
    if (n === 0) return '0';
    const whole = Math.floor(n / d);
    let rem = n % d;
    let digits = '';
    for (let k = 0; k < 3 && rem; k++) { rem *= 10; digits += Math.floor(rem / d); rem %= d; }
    if (!digits) return String(whole);
    return whole + '.' + digits + (rem ? '…' : '');
  }

  /* Paint-by-drag on a set of cells. get(i) / set(i, on) handle state. */
  function paintable(container, cellSel, idxOf, get, set, after) {
    let painting = null;
    container.style.touchAction = 'none';
    const hit = (x, y) => {
      const el = document.elementFromPoint(x, y);
      return el && el.closest ? el.closest(cellSel) : null;
    };
    container.addEventListener('pointerdown', (e) => {
      const c = e.target.closest(cellSel);
      if (!c || !container.contains(c)) return;
      e.preventDefault();
      const i = idxOf(c);
      painting = !get(i);
      set(i, painting);
      after();
    });
    container.addEventListener('pointermove', (e) => {
      if (painting == null) return;
      const c = hit(e.clientX, e.clientY);
      if (!c || !container.contains(c)) return;
      const i = idxOf(c);
      if (get(i) !== painting) { set(i, painting); after(); }
    });
    const stop = () => { painting = null; };
    w.addEventListener('pointerup', stop);
    w.addEventListener('pointercancel', stop);
  }

  /* ---------------- Hundredths grid ----------------
     opts: start (squares shaded at first), fill, pct (show percent), tip (one line under the grid),
           challenges: array of {n,d} | {dec:'0.4'} | {pct:35}  (adds a "Shade this" game). */
  function hundredGrid(opts) {
    const o = Object.assign({ start: 0, fill: '#0fb39c', pct: false, tip: '', challenges: null }, opts || {});
    const on = new Array(100).fill(false);
    for (let i = 0; i < Math.min(100, o.start); i++) on[i] = true;

    const root = h('div', 'viz ix ix-hg');
    root.style.setProperty('--ix-fill', paintFill(o.fill));
    const left = h('div', 'ix-left');
    const grid = h('div', 'ix-grid');
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Hundredths grid. Tap or drag to shade squares.');
    const cells = [];
    for (let i = 0; i < 100; i++) { const c = h('div', 'ix-cell'); c.dataset.i = i; cells.push(c); grid.appendChild(c); }
    left.appendChild(grid);
    left.appendChild(h('div', 'ix-tip', o.tip || 'Tap or drag across squares to shade them.'));
    root.appendChild(left);

    const side = h('div', 'ix-side');
    const read = h('div', 'ix-read');
    side.appendChild(read);

    const count = () => on.reduce((s, x) => s + (x ? 1 : 0), 0);
    const setN = (n) => {
      n = Math.max(0, Math.min(100, n));
      /* Keep shading tidy: fill row by row from the top. */
      for (let i = 0; i < 100; i++) on[i] = i < n;
      draw();
    };

    const ctr = h('div', 'ix-ctr');
    ctr.appendChild(btn('+1 row', () => setN(Math.floor(count() / 10) * 10 + 10)));
    ctr.appendChild(btn('−1 row', () => setN(Math.ceil(count() / 10) * 10 - 10)));
    ctr.appendChild(btn('+1', () => setN(count() + 1)));
    ctr.appendChild(btn('−1', () => setN(count() - 1)));
    ctr.appendChild(btn('Clear', () => setN(0), 'ghost'));
    side.appendChild(ctr);

    let game = null;
    if (o.challenges && o.challenges.length) game = buildGame(side);
    root.appendChild(side);

    function draw() {
      cells.forEach((c, i) => c.classList.toggle('on', on[i]));
      const n = count();
      const g = gcd(n, 100);
      const tenths = Math.floor(n / 10), hund = n % 10;
      let html = `<div class="ix-big">${n} <small>of 100 squares</small></div>`;
      html += `<div class="ix-eq">${fr(n, 100)}`;
      if (n && g > 1 && n !== 100) html += ` = ${fr(n / g, 100 / g)}`;
      const dec = n === 100 ? '1' : (n === 0 ? '0' : '0.' + String(n).padStart(2, '0'));
      html += ` = <b>${dec}</b>`;
      if (n % 10 === 0 && n > 0 && n < 100) html += ` = <b>${dec.slice(0, -1)}</b>`;
      if (o.pct) html += ` = <b>${n}%</b>`;
      html += '</div>';
      if (n === 100) html += '<div class="ix-note">All 100 hundredths make <b>1 whole</b>.</div>';
      else if (n) {
        const parts = [];
        if (tenths) parts.push(`${tenths} tenth${tenths === 1 ? '' : 's'} (full row${tenths === 1 ? '' : 's'})`);
        if (hund) parts.push(`${hund} hundredth${hund === 1 ? '' : 's'}`);
        html += `<div class="ix-note">${parts.join(' + ')}</div>`;
      }
      else html += '<div class="ix-note">Nothing shaded yet.</div>';
      read.innerHTML = html;
      if (game) game.changed();
    }

    function targetOf(t) {
      if (t.pct != null) return { n: t.pct, label: `<b>${t.pct}%</b>` };
      if (t.dec != null) return { n: Math.round(parseFloat(t.dec) * 100), label: `<b>${t.dec}</b>` };
      return { n: Math.round(t.n / t.d * 100), label: fr(t.n, t.d), d: t.d, fn: t.n };
    }

    function buildGame(host) {
      const box = h('div', 'ix-game');
      const q = h('div', 'ix-q');
      const fb = h('div', 'ix-fb');
      const row = h('div', 'ix-ctr');
      let k = 0, tries = 0, cur = null;
      const load = () => {
        cur = targetOf(o.challenges[k % o.challenges.length]);
        tries = 0;
        q.innerHTML = `<span class="ix-tag">Shade it</span> Shade ${cur.label} of the grid.`;
        fb.className = 'ix-fb'; fb.innerHTML = '';
      };
      const check = () => {
        const n = count();
        tries++;
        if (n === cur.n) {
          fb.className = 'ix-fb ok';
          fb.innerHTML = `Yes! ${cur.label} = ${fr(cur.n, 100)} = ${cur.n === 100 ? '1' : '0.' + String(cur.n).padStart(2, '0')}${o.pct ? ' = ' + cur.n + '%' : ''}.`;
          return;
        }
        fb.className = 'ix-fb no';
        let hint = n < cur.n ? `You have ${n}. Shade ${cur.n - n} more.` : `You have ${n}. That is ${n - cur.n} too many.`;
        if (tries >= 2 && cur.d && 100 % cur.d === 0) {
          const per = 100 / cur.d;
          hint += ` Hint: ${cur.d} × ${per} = 100, so each ${fr(1, cur.d)} is ${per} squares. ${cur.fn} × ${per} = ${cur.n}.`;
        } else if (tries >= 2) {
          hint += ` Hint: ${cur.n} hundredths is ${Math.floor(cur.n / 10)} full rows and ${cur.n % 10} more squares.`;
        }
        fb.innerHTML = hint;
      };
      row.appendChild(btn('Check', check, 'go'));
      row.appendChild(btn('Next one', () => { k++; setN(0); load(); }, 'ghost'));
      box.appendChild(q); box.appendChild(row); box.appendChild(fb);
      host.appendChild(box);
      load();
      return { changed: () => { if (fb.classList.contains('ok') && count() !== cur.n) { fb.className = 'ix-fb'; fb.innerHTML = ''; } } };
    }

    paintable(grid, '.ix-cell', (c) => +c.dataset.i, (i) => on[i], (i, v) => { on[i] = v; }, draw);
    draw();
    return root;
  }

  /* ---------------- Fraction bar ----------------
     opts: d (start denominator), n (start shaded), dens (denominator buttons), fill, pct. */
  function fractionBar(opts) {
    const o = Object.assign({ d: 4, n: 1, dens: [2, 3, 4, 5, 8, 10], fill: '#0fb39c', pct: false, tip: '' }, opts || {});
    let d = o.d;
    let on = new Array(d).fill(false).map((_, i) => i < o.n);

    const root = h('div', 'viz ix ix-fb-bar');
    root.style.setProperty('--ix-fill', paintFill(o.fill));
    const seg = h('div', 'ix-dens');
    seg.appendChild(h('span', 'ix-lab', 'Cut into'));
    const segBtns = o.dens.map((k) => {
      const b = btn(String(k), () => { d = k; on = new Array(d).fill(false); draw(); });
      seg.appendChild(b);
      return [k, b];
    });
    seg.appendChild(h('span', 'ix-lab', 'parts'));
    root.appendChild(seg);
    const bar = h('div', 'ix-bar');
    root.appendChild(bar);
    const ticks = h('div', 'ix-ticks', '<span>0</span><span>1</span>');
    root.appendChild(ticks);
    const read = h('div', 'ix-read ix-read-bar');
    root.appendChild(read);
    root.appendChild(h('div', 'ix-tip', o.tip || 'Pick how many parts, then tap or drag to shade pieces.'));

    function draw() {
      segBtns.forEach(([k, b]) => b.classList.toggle('on', k === d));
      if (bar.children.length !== d) {
        bar.innerHTML = '';
        for (let i = 0; i < d; i++) { const p = h('div', 'ix-piece'); p.dataset.i = i; bar.appendChild(p); }
      }
      [...bar.children].forEach((p, i) => p.classList.toggle('on', !!on[i]));
      const n = on.filter(Boolean).length;
      const g = gcd(n, d);
      let html = `<div class="ix-eq">${fr(n, d)}`;
      if (n && g > 1 && n !== d) html += ` = ${fr(n / g, d / g)}`;
      if (n && 100 % d === 0 && d !== 100) html += ` = ${fr(n * 100 / d, 100)}`;
      const dec = decText(n, d);
      html += ` = <b>${dec}</b>`;
      if (o.pct) html += ` = <b>${dec.indexOf('…') >= 0 ? (Math.floor(n * 1000 / d) / 10) + '…' : +(n * 100 / d).toFixed(1)}%</b>`;
      html += '</div>';
      let note = '';
      if (n === d) note = `All ${d} parts make <b>1 whole</b>.`;
      else if (dec.indexOf('…') >= 0) note = `The digits keep going forever: ${fr(n, d)} is a repeating decimal.`;
      else if (d === 8) note = `Each eighth is 0.125, so ${n} eighth${n === 1 ? '' : 's'} = ${n} × 0.125 = ${dec}.`;
      else if (100 % d === 0 && n) note = `${d} × ${100 / d} = 100, so each part is ${100 / d} hundredths.`;
      read.innerHTML = html + (note ? `<div class="ix-note">${note}</div>` : '');
    }

    paintable(bar, '.ix-piece', (c) => +c.dataset.i, (i) => !!on[i], (i, v) => { on[i] = v; }, draw);
    draw();
    return root;
  }


  /* ---------------- Decimal × decimal area model ----------------
     First factor = shaded columns (tenths), second = shaded rows. The overlap is the product. */
  function overlapGrid(opts) {
    const o = Object.assign({ a: 3, b: 4, tip: '' }, opts || {});
    let a = o.a, b = o.b;
    const tenth = (k) => (k === 10 ? '1' : '0.' + k);
    const hund = (n) => (n === 100 ? '1' : n === 0 ? '0' : '0.' + String(n).padStart(2, '0'));
    const root = h('div', 'viz ix ix-ov');
    const left = h('div', 'ix-left');
    const grid = h('div', 'ix-grid');
    grid.setAttribute('aria-label', 'Area model. Tap a square to set both factors.');
    const cells = [];
    for (let i = 0; i < 100; i++) { const c = h('div', 'ix-cell'); c.dataset.i = i; cells.push(c); grid.appendChild(c); }
    left.appendChild(grid);
    left.appendChild(h('div', 'ix-tip', o.tip || 'Tap or drag to a square: columns are the first factor, rows are the second.'));
    root.appendChild(left);
    const side = h('div', 'ix-side');
    const read = h('div', 'ix-read');
    side.appendChild(read);
    const stepper = (name, get, set) => {
      const row = h('div', 'ix-ctr ix-step');
      row.appendChild(h('span', 'ix-lab', name));
      row.appendChild(btn('−', () => { set(Math.max(1, get() - 1)); draw(); }));
      const val = h('b', 'ix-val');
      row.appendChild(val);
      row.appendChild(btn('+', () => { set(Math.min(10, get() + 1)); draw(); }));
      side.appendChild(row);
      return val;
    };
    const va = stepper('Columns (1st factor)', () => a, (v) => { a = v; });
    const vb = stepper('Rows (2nd factor)', () => b, (v) => { b = v; });
    root.appendChild(side);

    function draw() {
      cells.forEach((c, i) => {
        const r = Math.floor(i / 10), col = i % 10;
        const inA = col < a, inB = r < b;
        c.className = 'ix-cell' + (inA && inB ? ' ov' : inA ? ' ca' : inB ? ' rb' : '');
      });
      va.textContent = tenth(a); vb.textContent = tenth(b);
      const n = a * b;
      let html = `<div class="ix-eq">${tenth(a)} × ${tenth(b)} = <b>${hund(n)}</b>${n % 10 === 0 && n < 100 && n ? ' = <b>' + hund(n).slice(0, -1) + '</b>' : ''}</div>`;
      html += `<div class="ix-note">The overlap is ${a} × ${b} = <b>${n}</b> small square${n === 1 ? '' : 's'}: ${n} hundredth${n === 1 ? '' : 's'}.`;
      if (a < 10 && b < 10) html += ` That is smaller than both ${tenth(a)} and ${tenth(b)}.`;
      else if (a === 10 || b === 10) html += ' Multiplying by 1 keeps the other factor the same.';
      read.innerHTML = html + '</div>';
    }
    let dragging = false;
    grid.style.touchAction = 'none';
    const pick = (x, y) => {
      const el = document.elementFromPoint(x, y);
      const c = el && el.closest ? el.closest('.ix-cell') : null;
      if (!c || !grid.contains(c)) return;
      const i = +c.dataset.i;
      const na = (i % 10) + 1, nb = Math.floor(i / 10) + 1;
      if (na !== a || nb !== b) { a = na; b = nb; draw(); }
    };
    grid.addEventListener('pointerdown', (e) => { e.preventDefault(); dragging = true; pick(e.clientX, e.clientY); });
    grid.addEventListener('pointermove', (e) => { if (dragging) pick(e.clientX, e.clientY); });
    w.addEventListener('pointerup', () => { dragging = false; });
    draw();
    return root;
  }

  /* Wrap several viz nodes or HTML strings into one block. */
  function stack() {
    const box = h('div', 'viz ix ix-stack');
    [...arguments].forEach((x) => {
      if (!x) return;
      if (x instanceof Node) box.appendChild(x);
      else { const s = h('div', 'ix-static'); s.innerHTML = String(x); box.appendChild(s); }
    });
    return box;
  }

  /* ---------------- Coordinate plane: tap to plot ----------------
     opts: quad, n, start {x,y}, challenges ([[x,y],...] or a number for random ones), tip. */
  const sgn = (v) => (v < 0 ? '−' + (-v) : String(v));
  const pair = (x, y) => `(<span class="xv">${sgn(x)}</span>, <span class="yv">${sgn(y)}</span>)`;
  function svgPoint(svgEl, cx, cy) {
    const p = svgEl.createSVGPoint(); p.x = cx; p.y = cy;
    const m = svgEl.getScreenCTM(); if (!m) return null;
    return p.matrixTransform(m.inverse());
  }
  function moveWords(x, y) {
    const ax = x === 0 ? 'stay at 0 across' : `go <span class="xv">${Math.abs(x)} ${x > 0 ? 'right →' : 'left ←'}</span>`;
    const ay = y === 0 ? 'stay on the x-axis' : `<span class="yv">${Math.abs(y)} ${y > 0 ? 'up ↑' : 'down ↓'}</span>`;
    return `From (0, 0): ${ax}, then ${y === 0 ? ay : ay}.`;
  }
  function coordPlane(opts) {
    const o = Object.assign({ quad: false, n: 8, start: null, challenges: null, tip: '' }, opts || {});
    const lo = o.quad ? -o.n : 0;
    const root = h('div', 'viz ix ix-cp');
    const left = h('div', 'ix-left');
    const s = V.planeSVG([], { quad: o.quad, n: o.n });
    const G = s.__geo;
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
    const hov = mk('circle', { r: 9, class: 'cp-hover', visibility: 'hidden' });
    const pts = s.querySelector('.cp-pts');
    s.insertBefore(hov, pts);
    const zone = mk('rect', { x: G.px(lo) - G.c / 2, y: G.py(o.n) - G.c / 2, width: (o.n - lo + 1) * G.c, height: (o.n - lo + 1) * G.c, class: 'cp-tapzone' });
    s.appendChild(zone);
    left.appendChild(s);
    left.appendChild(h('div', 'ix-tip', o.tip || 'Tap any spot where grid lines cross.'));
    root.appendChild(left);

    const side = h('div', 'ix-side');
    const read = h('div', 'ix-read');
    side.appendChild(read);
    const ctr = h('div', 'ix-ctr');
    let P = o.start ? { x: o.start.x, y: o.start.y } : null;
    const clamp = (v) => Math.max(lo, Math.min(o.n, v));
    const nudge = (dx, dy) => { P = P || { x: 0, y: 0 }; P = { x: clamp(P.x + dx), y: clamp(P.y + dy) }; draw(); };
    ctr.appendChild(btn('← 1', () => nudge(-1, 0)));
    ctr.appendChild(btn('1 →', () => nudge(1, 0)));
    ctr.appendChild(btn('↓ 1', () => nudge(0, -1)));
    ctr.appendChild(btn('1 ↑', () => nudge(0, 1)));
    ctr.appendChild(btn('Clear', () => { P = null; draw(); }, 'ghost'));
    side.appendChild(ctr);
    const key = h('div', 'cp-key', '<span><i style="background:var(--cp-x)"></i>across = x (first)</span><span><i style="background:var(--cp-y)"></i>up/down = y (second)</span>');
    side.appendChild(key);
    let game = null;
    if (o.challenges) game = buildGame(side);
    root.appendChild(side);

    const snap = (e) => {
      const p = svgPoint(s, e.clientX, e.clientY); if (!p) return null;
      return { x: clamp(Math.round((p.x - G.ox) / G.c)), y: clamp(Math.round((G.oy - p.y) / G.c)) };
    };
    let down = false;
    zone.addEventListener('pointerdown', (e) => { e.preventDefault(); down = true; const q = snap(e); if (q) { P = q; draw(); } });
    zone.addEventListener('pointermove', (e) => {
      const q = snap(e); if (!q) return;
      if (down) { if (!P || P.x !== q.x || P.y !== q.y) { P = q; draw(); } return; }
      hov.setAttribute('cx', G.px(q.x)); hov.setAttribute('cy', G.py(q.y)); hov.setAttribute('visibility', 'visible');
    });
    zone.addEventListener('pointerleave', () => hov.setAttribute('visibility', 'hidden'));
    w.addEventListener('pointerup', () => { down = false; });

    function draw(extra) {
      while (pts.firstChild) pts.removeChild(pts.firstChild);
      (extra || []).forEach((n) => pts.appendChild(n));
      if (P) {
        pts.appendChild(V.guidePath(G, P.x, P.y));
        const d = mk('circle', { cx: G.px(P.x), cy: G.py(P.y), r: 7, class: 'cp-dot' });
        pts.appendChild(d);
        read.innerHTML = `<div class="cp-read">${pair(P.x, P.y)}</div><div class="cp-say">${moveWords(P.x, P.y)}</div>` +
          (P.x === 0 && P.y === 0 ? '<div class="ix-note">This is the <b>origin</b>, where the axes meet.</div>'
            : P.y === 0 ? '<div class="ix-note">y = 0, so the point sits right on the <b>x-axis</b>.</div>'
            : P.x === 0 ? '<div class="ix-note">x = 0, so the point sits right on the <b>y-axis</b>.</div>' : '');
      } else {
        read.innerHTML = '<div class="cp-read">( ?, ? )</div><div class="ix-note">Tap the grid, or use the arrow buttons. Watch the path: across first, then ' + (o.quad ? 'up or down' : 'up') + '.</div>';
      }
      if (game) game.changed();
    }

    function buildGame(host) {
      const list = Array.isArray(o.challenges) ? o.challenges.slice() : [];
      const rnd = () => {
        let x, y;
        do { x = lo + Math.floor(Math.random() * (o.n - lo + 1)); y = lo + Math.floor(Math.random() * (o.n - lo + 1)); } while (x === y || (o.quad && (x === 0 || y === 0)));
        return [x, y];
      };
      const box = h('div', 'ix-game');
      const q = h('div', 'ix-q'); const fb = h('div', 'ix-fb'); const row = h('div', 'ix-ctr');
      let k = 0, cur = null, won = 0;
      const load = () => {
        cur = list.length ? list[k % list.length] : rnd();
        q.innerHTML = `<span class="ix-tag">Plot it</span> Put a point at <b class="cp-say">${pair(cur[0], cur[1])}</b>`;
        fb.className = 'ix-fb'; fb.innerHTML = '';
      };
      const check = () => {
        if (!P) { fb.className = 'ix-fb no'; fb.innerHTML = 'Tap the grid to place your point first.'; return; }
        const [tx, ty] = cur;
        if (P.x === tx && P.y === ty) {
          won++;
          fb.className = 'ix-fb ok';
          fb.innerHTML = `Nailed it! ${moveWords(tx, ty)} ${won > 1 ? '⭐ × ' + won : '⭐'}`;
          return;
        }
        fb.className = 'ix-fb no';
        const ghost = mk('circle', { cx: G.px(tx), cy: G.py(ty), r: 8, class: 'cp-dot ghost' });
        if (P.x === ty && P.y === tx) fb.innerHTML = `You plotted ${pair(P.x, P.y)}: the numbers got swapped. The <span class="xv">first number goes across</span>, the <span class="yv">second goes up</span>.`;
        else if (P.x !== tx && P.y === ty) fb.innerHTML = `Up/down is right. Check <b>across</b>: you need x = <span class="xv">${sgn(tx)}</span>, you have ${sgn(P.x)}.`;
        else if (P.x === tx) fb.innerHTML = `Across is right. Check <b>up/down</b>: you need y = <span class="yv">${sgn(ty)}</span>, you have ${sgn(P.y)}.`;
        else fb.innerHTML = `Not yet. Start at (0, 0). ${moveWords(tx, ty)} The dashed circle shows the spot.`;
        draw([ghost]);
      };
      row.appendChild(btn('Check', check, 'go'));
      row.appendChild(btn('Next point', () => { k++; P = null; load(); draw(); }, 'ghost'));
      box.appendChild(q); box.appendChild(row); box.appendChild(fb);
      host.appendChild(box);
      load();
      return { changed: () => { if (fb.classList.contains('ok') && (!P || P.x !== cur[0] || P.y !== cur[1])) { fb.className = 'ix-fb'; fb.innerHTML = ''; } } };
    }

    draw();
    return root;
  }


  /* ---------------- Step-through paper work: multiplication and long division ----------------
     kind 'mul' (a × b, top to bottom) or 'div' (a ÷ b with Divide, Multiply, Subtract, Bring down).
     Back / Next / Auto / Reset, plus "try your own numbers". */
  function stepper(kind, opts) {
    const isMul = kind === 'mul';
    const o = Object.assign({ a: isMul ? 246 : 1554, b: isMul ? 35 : 42 }, opts || {});
    let a = o.a, b = o.b, model = null, upto = 0, timer = null;
    const dp = o.dp || 0;
    const root = h('div', 'viz ix ix-stepper');
    const chips = h('div', 'ix-chips');
    const PH = [['D', 'Divide'], ['M', 'Multiply'], ['S', 'Subtract'], ['B', 'Bring down']];
    const chipEls = {};
    if (!isMul) PH.forEach(([k, name]) => { const c = h('span', 'ix-chip ix-chip-' + k, `<b>${k}</b> ${name}`); chipEls[k] = c; chips.appendChild(c); });
    const host = h('div', 'ix-svg');
    const cap = h('div', 'ix-read ix-cap');
    const prog = h('div', 'ix-prog');
    const ctl = h('div', 'ix-ctr ix-stepctl');
    const bBack = btn('◀ Back', () => { stop(); go(-1); }, 'ghost');
    const bNext = btn('Next ▶', () => { stop(); go(1); }, 'go');
    const bAuto = btn('▶ Auto', () => { timer ? stop() : play(); }, '');
    const bReset = btn('↺ Reset', () => { stop(); upto = 0; draw(); }, 'ghost');
    [bBack, bNext, bAuto, bReset].forEach((x) => ctl.appendChild(x));
    const own = h('form', 'ix-own');
    own.setAttribute('novalidate', '');
    const mk = (val, min, max, label) => { const i = h('input', 'ix-num'); i.type = 'number'; i.inputMode = 'numeric'; i.step = '1'; i.min = String(min); i.max = String(max); i.value = String(val); i.setAttribute('aria-label', label); return i; };
    const inA = isMul ? mk(a, 10, 999, 'first number') : mk(a, 10, 9999, 'dividend');
    const inB = isMul ? mk(b, 10, 999, 'second number') : mk(b, 2, 99, 'divisor');
    const goBtn = btn('Go', () => {}, 'go'); goBtn.type = 'submit';
    own.appendChild(h('span', 'ix-lab', 'Try your own'));
    own.appendChild(inA); own.appendChild(h('span', 'ix-op', isMul ? '×' : '÷')); own.appendChild(inB); own.appendChild(goBtn);
    const msg = h('div', 'ix-tip', '');
    own.onsubmit = (e) => {
      e.preventDefault();
      const x = Math.floor(+inA.value), y = Math.floor(+inB.value);
      const ok = isMul ? (x >= 10 && x <= 999 && y >= 10 && y <= 999) : (x >= 10 && x <= 9999 && y >= 2 && y <= 99);
      if (!ok) { msg.textContent = isMul ? 'Use whole numbers from 10 to 999.' : 'Use a dividend from 10 to 9999 and a divisor from 2 to 99.'; return; }
      msg.textContent = ''; stop(); a = x; b = y; build();
    };
    [chips, host, cap, prog, ctl, own, msg].forEach((x) => root.appendChild(x));
    if (isMul) chips.style.display = 'none';
    if (o.own === false) { own.style.display = 'none'; msg.style.display = 'none'; }

    function stop() { if (timer) { clearInterval(timer); timer = null; } bAuto.textContent = '▶ Auto'; }
    function play() {
      if (upto >= model.steps.length) upto = 0;
      bAuto.textContent = '⏸ Pause';
      const tick = () => {
        if (!document.body.contains(root) || upto >= model.steps.length) { stop(); return; }
        upto++; draw();
        if (upto >= model.steps.length) stop();
      };
      tick(); timer = setInterval(tick, 1400);
    }
    function go(d) { upto = Math.max(0, Math.min(model.steps.length, upto + d)); draw(); }
    function build() { model = isMul ? V.stackMulModel(a, b) : V.longDivModel(a, b, { dp }); upto = 0; draw(); }
    function draw() {
      host.innerHTML = '';
      host.appendChild(model.render(upto));
      const st = upto > 0 ? model.steps[upto - 1] : null;
      cap.innerHTML = st ? st.cap : model.intro;
      prog.textContent = upto === 0 ? `${model.steps.length} steps` : `Step ${upto} of ${model.steps.length}`;
      Object.keys(chipEls).forEach((k) => chipEls[k].classList.toggle('on', !!st && st.kind === k));
      bBack.disabled = upto === 0;
      bNext.disabled = upto >= model.steps.length;
    }
    build();
    return root;
  }


  /* ---------------- Pattern builder: pick a start, a rule and a jump; see the hops; find any term ---------------- */
  function patternBuilder(opts) {
    const o = Object.assign({ start: 3, jump: 4, kind: 'add' }, opts || {});
    let start = o.start, jump = o.jump, kind = o.kind;
    const root = h('div', 'viz ix ix-pb');
    const kinds = [['add', 'Add'], ['sub', 'Subtract'], ['mul', 'Multiply']];
    const kindBtns = {};
    const seg = h('div', 'ix-ctr');
    kinds.forEach(([k, name]) => { const b = btn(name, () => { kind = k; if (k === 'mul') { jump = Math.min(jump, 3); if (jump < 2) jump = 2; start = Math.min(start, 6); } if (k === 'sub') start = Math.max(start, 30); fix(); draw(); }); kindBtns[k] = b; seg.appendChild(b); });
    const stepRow = (label, get, set, lo, hi) => {
      const row = h('div', 'ix-ctr ix-step');
      const val = h('span', 'ix-stepval', '');
      row.appendChild(h('span', 'ix-lab', label));
      row.appendChild(btn('−', () => { set(Math.max(lo(), get() - 1)); fix(); draw(); }));
      row.appendChild(val);
      row.appendChild(btn('+', () => { set(Math.min(hi(), get() + 1)); fix(); draw(); }));
      return { row, val };
    };
    const sRow = stepRow('Start', () => start, (v) => { start = v; }, () => 1, () => (kind === 'mul' ? 9 : 60));
    const jRow = stepRow('Jump', () => jump, (v) => { jump = v; }, () => (kind === 'mul' ? 2 : 1), () => (kind === 'mul' ? 5 : 15));
    const hopHost = h('div', 'ix-svg');
    const read = h('div', 'ix-read ix-cap');
    const ask = h('form', 'ix-own');
    ask.setAttribute('novalidate', '');
    const inN = h('input', 'ix-num'); inN.type = 'number'; inN.inputMode = 'numeric'; inN.min = '1'; inN.max = '30'; inN.value = '7'; inN.setAttribute('aria-label', 'term number');
    const ans = h('div', 'ix-askans', '');
    ask.appendChild(h('span', 'ix-lab', 'Find term number')); ask.appendChild(inN); ask.appendChild(btn('Find it', () => {}, 'go')); ask.lastChild.type = 'submit';
    ask.onsubmit = (e) => { e.preventDefault(); draw(); };
    [seg, sRow.row, jRow.row, hopHost, read, ask, ans].forEach((x) => root.appendChild(x));
    const ord = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'));
    function term(i) { return kind === 'add' ? start + jump * i : kind === 'sub' ? start - jump * i : start * Math.pow(jump, i); }
    function fix() { if (kind === 'sub') { start = Math.max(start, jump * 5); } }
    function draw() {
      Object.keys(kindBtns).forEach((k) => kindBtns[k].classList.toggle('on', k === kind));
      sRow.val.textContent = start; jRow.val.textContent = jump;
      const N = (w.innerWidth || 1000) < 600 ? 4 : 5, t = []; for (let i = 0; i < N; i++) t.push(String(term(i)));
      t.push('…');
      const sym = kind === 'add' ? '+' : kind === 'sub' ? '−' : '×';
      hopHost.innerHTML = '';
      hopHost.appendChild(V.hopsSvg(t, { rule: sym + ' ' + jump, labels: ['1st', '2nd', '3rd', '4th', '5th', ''].slice(0, N).concat(['']) }));
      const rule = kind === 'add' ? `Each term <b>adds ${jump}</b>.` : kind === 'sub' ? `Each term <b>subtracts ${jump}</b>.` : `Each term is <b>multiplied by ${jump}</b>.`;
      read.innerHTML = rule + (kind === 'mul' ? ' Doubling or tripling makes numbers grow fast.' : ' Check every jump, not just the first one.');
      const n = Math.max(1, Math.min(30, Math.floor(+inN.value) || 1));
      const v = term(n - 1);
      let how;
      if (kind === 'add') how = `${start} + ${jump} × ${n - 1} = <b>${v}</b>`;
      else if (kind === 'sub') how = `${start} − ${jump} × ${n - 1} = <b>${v}</b>`;
      else how = n === 1 ? `<b>${start}</b>` : `${start} × ${Array(Math.min(n - 1, 6)).fill(jump).join(' × ')}${n - 1 > 6 ? ' × …' : ''} = <b>${v}</b>`;
      ans.innerHTML = `The <b>${ord(n)}</b> term: ${how}` + (kind !== 'mul' ? `<div class="ix-note">Start + jump × (n − 1): the first term has zero jumps, so use n − 1.</div>` : '');
    }
    fix(); draw();
    return root;
  }

  /* ---------------- Mystery function machine ---------------- */
  function machine(opts) {
    const o = Object.assign({}, opts || {});
    let rule = null, log = [], solved = false;
    const root = h('div', 'viz ix ix-mach');
    const stage = h('div', 'ix-mstage');
    const inBox = h('div', 'ix-mbox', '<span class="ix-ml">IN</span><b class="ix-mv">?</b>');
    const core = h('div', 'ix-mcore', '<span class="ix-gear">⚙️</span><span class="ix-rule">RULE ?</span>');
    const outBox = h('div', 'ix-mbox', '<span class="ix-ml">OUT</span><b class="ix-mv">?</b>');
    [inBox, h('div', 'ix-marrow', '→'), core, h('div', 'ix-marrow', '→'), outBox].forEach((x) => stage.appendChild(x));
    const chips = h('div', 'ix-ctr ix-mchips');
    const form = h('form', 'ix-own'); form.setAttribute('novalidate', '');
    const inp = h('input', 'ix-num'); inp.type = 'number'; inp.inputMode = 'numeric'; inp.setAttribute('aria-label', 'number to put in');
    const runB = btn('Run', () => {}, 'go'); runB.type = 'submit';
    form.appendChild(h('span', 'ix-lab', 'Put in')); form.appendChild(inp); form.appendChild(runB);
    const table = h('div', 'ix-mlog');
    const guess = h('div', 'ix-game');
    const fb = h('div', 'ix-fb', '');
    const bar = h('div', 'ix-ctr ix-mbar');
    const bNew = btn('New machine', () => fresh(), 'ghost');
    const bShow = btn('Show the rule', () => { solved = true; paintRule(true); }, 'ghost');
    bar.appendChild(bNew); bar.appendChild(bShow);
    [stage, chips, form, table, guess, fb, bar].forEach((x) => root.appendChild(x));
    const fnOf = (r) => (x) => (r.op === '+' ? x + r.d : r.op === '−' ? x - r.d : x * r.d);
    const label = (r) => r.op + ' ' + r.d;
    function fresh() {
      const op = o.op || pick(['+', '×', '−', '+', '×']);
      rule = op === '×' ? { op, d: pick([2, 3, 4, 5, 6]) } : op === '+' ? { op, d: pick([2, 3, 4, 5, 6, 7, 8, 9]) } : { op, d: pick([2, 3, 4, 5, 6]) };
      if (o.rule) rule = o.rule;
      log = []; solved = false; fb.className = 'ix-fb'; fb.textContent = '';
      chips.innerHTML = '';
      (rule.op === '−' ? [8, 10, 12, 15, 20, 25] : [1, 2, 3, 5, 7, 10]).forEach((n) => chips.appendChild(btn(String(n), () => run(n), 'ghost')));
      inBox.querySelector('.ix-mv').textContent = '?'; outBox.querySelector('.ix-mv').textContent = '?';
      paintRule(false); paintLog(); paintGuess();
    }
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    function paintRule(show) { core.querySelector('.ix-rule').textContent = show ? 'RULE ' + label(rule) : 'RULE ?'; core.classList.toggle('on', !!show); }
    function run(n) {
      n = Math.floor(+n);
      if (!isFinite(n) || n < 0 || n > 999) { fb.className = 'ix-fb no'; fb.textContent = 'Type a whole number from 0 to 999.'; return; }
      const out = fnOf(rule)(n);
      if (out < 0) { fb.className = 'ix-fb no'; fb.textContent = 'That would go below zero. Try a bigger number.'; return; }
      fb.className = 'ix-fb'; fb.textContent = '';
      core.classList.remove('spin'); void core.offsetWidth; core.classList.add('spin');
      inBox.querySelector('.ix-mv').textContent = n; outBox.querySelector('.ix-mv').textContent = out;
      if (!log.some((p) => p[0] === n)) log.push([n, out]);
      paintLog(); paintGuess();
    }
    function paintLog() {
      if (!log.length) { table.innerHTML = '<div class="ix-tip">Tap a number or type one, then press Run. Run at least 2 numbers.</div>'; return; }
      const rows = log.slice(-6);
      table.innerHTML = '<table class="g5t"><tr><th>In</th>' + rows.map((p) => `<td>${p[0]}</td>`).join('') + '</tr><tr><th>Out</th>' + rows.map((p) => `<td>${p[1]}</td>`).join('') + '</tr></table>';
    }
    function paintGuess() {
      guess.innerHTML = '';
      if (log.length < 2 || solved) return;
      const right = label(rule), opts = new Set([right]);
      const d = rule.d;
      [['+', d], ['×', d], ['−', d], ['+', d + 1], ['×', d + 1], ['+', d * 2], ['×', Math.max(2, d - 1)]].forEach(([op, k]) => { if (opts.size < 4 && !(op === rule.op && k === d)) opts.add(op + ' ' + k); });
      const list = [...opts].sort(() => Math.random() - 0.5);
      guess.appendChild(h('div', 'ix-q', 'What is the rule? Check it on <b>every</b> pair.'));
      const row = h('div', 'ix-ctr');
      list.forEach((t) => row.appendChild(btn(t, () => {
        if (t === right) { solved = true; paintRule(true); fb.className = 'ix-fb ok'; fb.textContent = 'Yes! Rule ' + right + '. It works on every pair in the table.'; guess.innerHTML = ''; }
        else { fb.className = 'ix-fb no'; fb.textContent = 'Not quite. Test ' + t + ' on each pair: does it give the same output every time?'; }
      }, 'ghost')));
      guess.appendChild(row);
    }
    form.onsubmit = (e) => { e.preventDefault(); run(inp.value); inp.value = ''; };
    fresh();
    return root;
  }


  /* ---------------- Angle lab: drag the ray, read the degrees ----------------
     Modes: make (free), target (hit a given angle), pair (two angles that add to 180 or 90). */
  const SVGNS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attrs, parent) => { const e = document.createElementNS(SVGNS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); if (parent) parent.appendChild(e); return e; };
  const RAD = Math.PI / 180;
  function angleName(a) { return a <= 0 ? 'closed' : a < 90 ? 'acute' : a === 90 ? 'right' : a < 180 ? 'obtuse' : 'straight'; }
  const ANGLE_NOTE = { closed: 'The ray is lying on the base. Open it up!', acute: 'Less than a square corner (less than 90°).', right: 'Exactly a square corner: 90°.', obtuse: 'Wider than a square corner but not a straight line (between 90° and 180°).', straight: 'A straight line: exactly 180°.' };

  function angleLab(opts) {
    const o = Object.assign({ mode: 'make', modes: ['make', 'target', 'pair'], start: 50 }, opts || {});
    let mode = o.mode, total = 180, ang = o.start, target = 0, streak = 0, solved = false, dragging = false;
    const W = 360, H = 212, vx = 180, vy = 190, R = 150;
    const root = h('div', 'viz ix ix-al');
    const NAMES = { make: 'Make an angle', target: 'Hit the target', pair: 'Angle pairs ★' };
    const tabs = h('div', 'ix-ctr ix-altabs'), tabBtns = {};
    o.modes.forEach((m) => { tabBtns[m] = btn(NAMES[m], () => { mode = m; solved = false; fb.className = 'ix-fb'; fb.textContent = ''; if (m === 'target') newTarget(); if (m === 'pair' && ang > total) ang = total; draw(); }, 'ghost'); tabs.appendChild(tabBtns[m]); });
    if (o.modes.length < 2) tabs.style.display = 'none';
    const goal = h('div', 'ix-q ix-al-goal');
    const sub = h('div', 'ix-ctr ix-al-sub');
    const subBtns = { 180: btn('Straight line · 180°', () => { total = 180; draw(); }, 'ghost'), 90: btn('Square corner · 90°', () => { total = 90; ang = Math.min(ang, 90); draw(); }, 'ghost') };
    sub.appendChild(subBtns[180]); sub.appendChild(subBtns[90]);
    const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'ix-al-svg', role: 'slider', tabindex: '0', 'aria-label': 'Angle: drag the ray, or use the arrow keys' });
    svg.style.touchAction = 'none';
    const stage = h('div', 'ix-al-stage'); stage.appendChild(svg);
    const read = h('div', 'ix-read ix-al-read');
    const quick = h('div', 'ix-ctr ix-al-quick');
    const ctl = h('div', 'ix-ctr');
    const bCheck = btn('Check', () => check(), 'go'), bNew = btn('New target', () => { newTarget(); draw(); }, 'ghost');
    ctl.appendChild(bCheck); ctl.appendChild(bNew);
    const fb = h('div', 'ix-fb', '');
    [tabs, goal, sub, stage, read, quick, ctl, fb].forEach((x) => root.appendChild(x));

    const P = (deg, r) => [vx + r * Math.cos(deg * RAD), vy - r * Math.sin(deg * RAD)];
    const pt = (e) => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
    function fromPointer(e) {
      const [x, y] = pt(e), dx = x - vx, dy = vy - y;
      let a = Math.atan2(dy, dx) / RAD;
      if (dy < 0) a = dx >= 0 ? 0 : 180;
      ang = Math.max(0, Math.min(total, Math.round(a)));
      solved = false; fb.className = 'ix-fb'; fb.textContent = '';
      draw();
    }
    svg.addEventListener('pointerdown', (e) => { dragging = true; try { svg.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); fromPointer(e); });
    svg.addEventListener('pointermove', (e) => { if (dragging) fromPointer(e); });
    const stop = () => { dragging = false; };
    svg.addEventListener('pointerup', stop); svg.addEventListener('pointercancel', stop);
    svg.addEventListener('keydown', (e) => {
      const k = e.key, st = e.shiftKey ? 10 : 1;
      if (k === 'ArrowLeft' || k === 'ArrowUp') ang = Math.min(total, ang + st);
      else if (k === 'ArrowRight' || k === 'ArrowDown') ang = Math.max(0, ang - st);
      else return;
      e.preventDefault(); solved = false; draw(); svg.focus();
    });

    function newTarget() { let t; do { t = 15 + 5 * Math.floor(Math.random() * 32); } while (Math.abs(t - ang) < 15); target = t; solved = false; fb.className = 'ix-fb'; fb.textContent = ''; }
    function check() {
      const d = ang - target;
      if (Math.abs(d) <= 2) { const nm = angleName(ang), art = /^[aeiou]/.test(nm) ? 'an' : 'a'; solved = true; streak++; fb.className = 'ix-fb ok'; fb.innerHTML = `Yes! ${ang}° is ${art} <b>${nm}</b> angle.` + (streak > 1 ? ' ' + streak + ' in a row!' : ''); }
      else { streak = 0; fb.className = 'ix-fb no'; fb.textContent = `That is ${ang}°, about ${Math.abs(d)}° too ${d < 0 ? 'small' : 'big'}. Use the tick marks and try again.`; }
    }
    function quickSet(v) { ang = Math.min(total, v); solved = false; fb.className = 'ix-fb'; fb.textContent = ''; draw(); }

    function draw() {
      Object.keys(tabBtns).forEach((m) => tabBtns[m].classList.toggle('on', m === mode));
      sub.style.display = mode === 'pair' ? '' : 'none';
      [180, 90].forEach((t) => subBtns[t].classList.toggle('on', total === t));
      ctl.style.display = mode === 'target' ? '' : 'none';
      bNew.style.display = solved ? '' : 'none';
      bCheck.style.display = solved ? 'none' : '';
      goal.style.display = mode === 'target' ? '' : 'none';
      if (mode === 'target') goal.innerHTML = `Make a <b>${target}°</b> angle. Drag the ray, then press Check.`;
      const T = mode === 'pair' ? total : 180;
      svg.setAttribute('aria-valuemin', '0'); svg.setAttribute('aria-valuemax', String(T)); svg.setAttribute('aria-valuenow', String(ang));
      svg.innerHTML = '';
      const cls = angleName(ang);
      const COL = { closed: '#9aa7bd', acute: '#0fb39c', right: '#ffc43d', obtuse: '#ff5a36', straight: '#2f80ed' };
      /* protractor */
      sv('path', { d: `M ${P(0, 118)[0]} ${P(0, 118)[1]} A 118 118 0 0 0 ${P(180, 118)[0]} ${P(180, 118)[1]}`, fill: 'none', stroke: 'var(--ink)', 'stroke-opacity': '.35', 'stroke-width': '2' }, svg);
      for (let d = 0; d <= 180; d += 5) {
        const len = d % 90 === 0 ? 17 : d % 10 === 0 ? 11 : 6, a1 = P(d, 118), a2 = P(d, 118 + len);
        sv('line', { x1: a1[0], y1: a1[1], x2: a2[0], y2: a2[1], stroke: 'var(--ink)', 'stroke-opacity': '.5', 'stroke-width': d % 30 === 0 ? 2 : 1 }, svg);
        if (d % 30 === 0) { const lp = P(d, 104); const tx = sv('text', { x: lp[0], y: lp[1] + 4, 'text-anchor': 'middle', 'font-size': '11.5', 'font-weight': '800', fill: 'var(--muted)' }, svg); tx.textContent = d; }
      }
      /* wedges */
      const wedge = (a0, a1, color, op) => { if (a1 - a0 <= 0) return; const s0 = P(a0, 92), s1 = P(a1, 92); sv('path', { d: `M ${vx} ${vy} L ${s0[0]} ${s0[1]} A 92 92 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${s1[0]} ${s1[1]} Z`, fill: color, 'fill-opacity': op || '.38', stroke: color, 'stroke-width': '1.5' }, svg); };
      if (mode === 'pair') {
        wedge(0, ang, '#0fb39c', '.4'); wedge(ang, total, '#ff6b9a', '.4');
        const lp = P(total, R); sv('line', { x1: vx, y1: vy, x2: lp[0], y2: lp[1], stroke: 'var(--ink)', 'stroke-width': '4', 'stroke-linecap': 'round' }, svg);
        if (total === 180) { const rp = P(180, R); sv('line', { x1: vx, y1: vy, x2: rp[0], y2: rp[1], stroke: 'var(--ink)', 'stroke-width': '4', 'stroke-linecap': 'round' }, svg); }
      } else wedge(0, ang, COL[cls], '.38');
      const bp = P(0, R); sv('line', { x1: vx, y1: vy, x2: bp[0], y2: bp[1], stroke: 'var(--ink)', 'stroke-width': '4', 'stroke-linecap': 'round' }, svg);
      /* right-angle square */
      if ((mode !== 'pair' && ang === 90) || (mode === 'pair' && total === 90)) sv('path', { d: `M ${vx + 24} ${vy} L ${vx + 24} ${vy - 24} L ${vx} ${vy - 24}`, fill: 'none', stroke: 'var(--ink)', 'stroke-width': '2.5' }, svg);
      /* moving ray + handle */
      const ep = P(ang, R);
      sv('line', { x1: vx, y1: vy, x2: ep[0], y2: ep[1], stroke: '#ff5a36', 'stroke-width': '5', 'stroke-linecap': 'round' }, svg);
      sv('circle', { cx: vx, cy: vy, r: 6, fill: 'var(--ink)' }, svg);
      sv('circle', { cx: ep[0], cy: ep[1], r: 13, fill: '#ffc43d', stroke: 'var(--ink)', 'stroke-width': '3' }, svg);
      /* degree labels */
      const label = (a0, a1, txt) => { const m = P((a0 + a1) / 2, 66); const t = sv('text', { x: m[0], y: m[1] + 6, 'text-anchor': 'middle', 'font-size': '19', 'font-weight': '800', fill: 'var(--ink)', 'paint-order': 'stroke', stroke: 'var(--btn-face)', 'stroke-width': '4' }, svg); t.textContent = txt; };
      if (mode === 'pair') { if (ang > 8) label(0, ang, ang + '°'); if (total - ang > 8) label(ang, total, (total - ang) + '°'); }
      else if (ang > 10) label(0, ang, ang + '°');
      /* readout */
      if (mode === 'pair') {
        const b = total - ang, nm = total === 180 ? 'supplementary' : 'complementary';
        read.innerHTML = `<div class="ix-eq"><b>${ang}°</b> + <b>${b}°</b> = <b>${total}°</b></div><div class="ix-note">${total === 180 ? 'Two angles on a straight line add to 180°.' : 'Two angles in a square corner add to 90°.'} They are called <b>${nm}</b> angles. Drag the ray: when one gets bigger, the other gets smaller.</div>`;
      } else {
        read.innerHTML = `<div class="ix-al-big"><span class="ix-al-deg">${ang}°</span><span class="ix-al-chip c-${cls}">${cls}</span></div><div class="ix-note">${ANGLE_NOTE[cls]}</div>`;
      }
      /* quick buttons */
      quick.innerHTML = '';
      const set = mode === 'pair' ? (total === 180 ? [25, 45, 65, 90, 130, 150] : [20, 35, 45, 60, 75]) : [30, 45, 60, 90, 120, 135, 150, 180];
      set.forEach((v) => quick.appendChild(btn(v + '°', () => quickSet(v), 'ghost')));
    }
    if (mode === 'target') newTarget();
    draw();
    return root;
  }

  /* ---------------- Triangle lab: drag a corner, the triangle names itself ---------------- */
  function triangleLab(opts) {
    const W = 360, H = 232;
    const PRE = {
      equilateral: [[90, 200], [270, 200], [180, 44]],
      isosceles: [[80, 200], [280, 200], [180, 60]],
      right: [[90, 200], [270, 200], [90, 62]],
      obtuse: [[50, 200], [250, 200], [125, 152]],
      scalene: [[60, 200], [290, 200], [215, 55]]
    };
    let pts = (opts && opts.preset ? PRE[opts.preset] : PRE.scalene).map((q) => q.slice()), drag = -1;
    const root = h('div', 'viz ix ix-tl');
    const presets = h('div', 'ix-ctr');
    [['Equilateral', 'equilateral'], ['Isosceles', 'isosceles'], ['Right', 'right'], ['Obtuse', 'obtuse'], ['Scalene', 'scalene']].forEach(([l, k]) => presets.appendChild(btn(l, () => { pts = PRE[k].map((q) => q.slice()); draw(); }, 'ghost')));
    const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'ix-al-svg', role: 'img', 'aria-label': 'A triangle you can reshape by dragging its corners' });
    svg.style.touchAction = 'none';
    const stage = h('div', 'ix-al-stage'); stage.appendChild(svg);
    const read = h('div', 'ix-read ix-al-read');
    root.appendChild(h('div', 'ix-q', 'Drag any corner to reshape the triangle.'));
    [presets, stage, read].forEach((x) => root.appendChild(x));
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const ptr = (e) => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
    svg.addEventListener('pointerdown', (e) => {
      const p = ptr(e); let best = -1, bd = 34;
      pts.forEach((q, i) => { const d = dist(p, q); if (d < bd) { bd = d; best = i; } });
      if (best >= 0) { drag = best; try { svg.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); }
    });
    svg.addEventListener('pointermove', (e) => {
      if (drag < 0) return;
      const p = ptr(e), np = [Math.max(18, Math.min(W - 18, p[0])), Math.max(18, Math.min(H - 18, p[1]))];
      const old = pts[drag]; pts[drag] = np;
      const area = Math.abs((pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) - (pts[2][0] - pts[0][0]) * (pts[1][1] - pts[0][1])) / 2;
      const minSide = Math.min(dist(pts[0], pts[1]), dist(pts[1], pts[2]), dist(pts[2], pts[0]));
      if (area < 1500 || minSide < 46) pts[drag] = old;
      draw();
    });
    const end = () => { drag = -1; };
    svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);

    function draw() {
      svg.innerHTML = '';
      const [A, B, C] = pts;
      const a = dist(B, C), b = dist(C, A), c = dist(A, B);
      const ang = (x, y, z) => Math.acos(Math.max(-1, Math.min(1, (y * y + z * z - x * x) / (2 * y * z)))) / RAD;
      const A1 = ang(a, b, c), B1 = ang(b, c, a), C1 = ang(c, a, b);
      let ra = Math.round(A1), rb = Math.round(B1), rc = 180 - ra - rb;
      const mx = Math.max(A1, B1, C1);
      const byAngle = Math.abs(mx - 90) <= 1.5 ? 'right' : mx > 90 ? 'obtuse' : 'acute';
      const eq = (x, y) => Math.abs(x - y) <= 0.035 * Math.max(x, y);
      const e1 = eq(a, b), e2 = eq(b, c), e3 = eq(c, a);
      const bySide = (e1 && e2 && e3) ? 'equilateral' : (e1 || e2 || e3) ? 'isosceles' : 'scalene';
      const COL = { acute: '#0fb39c', right: '#ffc43d', obtuse: '#ff5a36' };
      sv('polygon', { points: pts.map((q) => q.join(',')).join(' '), fill: COL[byAngle], 'fill-opacity': '.28', stroke: 'var(--ink)', 'stroke-width': '4', 'stroke-linejoin': 'round' }, svg);
      /* angle labels (inside, along the bisector) and right-angle mark */
      const verts = [[A, B, C, ra, A1], [B, C, A, rb, B1], [C, A, B, rc, C1]];
      verts.forEach(([v, p, q, deg, raw]) => {
        const u1 = [(p[0] - v[0]) / dist(p, v), (p[1] - v[1]) / dist(p, v)], u2 = [(q[0] - v[0]) / dist(q, v), (q[1] - v[1]) / dist(q, v)];
        if (Math.abs(raw - 90) <= 1.5) sv('path', { d: `M ${v[0] + u1[0] * 18} ${v[1] + u1[1] * 18} L ${v[0] + (u1[0] + u2[0]) * 18} ${v[1] + (u1[1] + u2[1]) * 18} L ${v[0] + u2[0] * 18} ${v[1] + u2[1] * 18}`, fill: 'none', stroke: 'var(--ink)', 'stroke-width': '2.5' }, svg);
        const bx = u1[0] + u2[0], by = u1[1] + u2[1], bl = Math.hypot(bx, by) || 1;
        const lp = [v[0] + bx / bl * 34, v[1] + by / bl * 34];
        const t = sv('text', { x: lp[0], y: lp[1] + 5, 'text-anchor': 'middle', 'font-size': '15', 'font-weight': '800', fill: 'var(--ink)', 'paint-order': 'stroke', stroke: 'var(--btn-face)', 'stroke-width': '3.5' }, svg); t.textContent = deg + '°';
      });
      /* side lengths (30 px = 1 unit) and equal-side tick marks */
      const sides = [[B, C, a], [C, A, b], [A, B, c]];
      const eqs = [e1 || e3 ? 1 : 0, e1 || e2 ? 1 : 0, e2 || e3 ? 1 : 0];
      const cen = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
      sides.forEach(([p, q, len], i) => {
        const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], out = [m[0] - cen[0], m[1] - cen[1]], ol = Math.hypot(out[0], out[1]) || 1;
        const t = sv('text', { x: m[0] + out[0] / ol * 15, y: m[1] + out[1] / ol * 15 + 4, 'text-anchor': 'middle', 'font-size': '12.5', 'font-weight': '800', fill: 'var(--muted)' }, svg); t.textContent = (len / 30).toFixed(1);
        if (bySide !== 'scalene' && ((bySide === 'equilateral') || eqs[i])) { const d = [(q[0] - p[0]) / len, (q[1] - p[1]) / len], nrm = [-d[1], d[0]]; sv('line', { x1: m[0] + nrm[0] * 7, y1: m[1] + nrm[1] * 7, x2: m[0] - nrm[0] * 7, y2: m[1] - nrm[1] * 7, stroke: 'var(--ink)', 'stroke-width': '3' }, svg); }
      });
      pts.forEach((q) => { sv('circle', { cx: q[0], cy: q[1], r: 11, fill: '#ffc43d', stroke: 'var(--ink)', 'stroke-width': '3' }, svg); });
      read.innerHTML = `<div class="ix-al-big"><span class="ix-al-chip c-${byAngle}">${byAngle}</span><span class="ix-al-chip c-side">${bySide}</span></div>`
        + `<div class="ix-eq">${ra}° + ${rb}° + ${rc}° = <b>180°</b></div>`
        + `<div class="ix-note">By angles: ${byAngle === 'right' ? 'one 90° angle' : byAngle === 'obtuse' ? 'one angle over 90°' : 'every angle under 90°'}. By sides: ${bySide === 'equilateral' ? '3 equal sides (so it is isosceles too)' : bySide === 'isosceles' ? '2 equal sides (matching tick marks)' : 'no equal sides'}. The three angles of any triangle always add up to 180°.</div>`;
    }
    draw();
    return root;
  }

  w.IX = { angleLab, triangleLab, patternBuilder, machine, stepper, hundredGrid, fractionBar, overlapGrid, stack, decText, coordPlane, pair, sgn, svgPoint, moveWords };
})(window);
