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

  w.IX = { hundredGrid, fractionBar, overlapGrid, stack, decText };
})(window);
