/* SVG visuals for Grade 5 Math Lab. Keep labels stacked for fractions. */
(function (w) {
  const NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs, kids) {
    const n = document.createElementNS(NS, name);
    for (const k in (attrs || {})) n.setAttribute(k, attrs[k]);
    (kids || []).forEach((c) => n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return n;
  }
  function svg(wdt, hgt, attrs) {
    return el('svg', Object.assign({ viewBox: `0 0 ${wdt} ${hgt}`, width: String(wdt), height: String(hgt), role: 'img' }, attrs || {}));
  }
  function wrap(node) {
    const d = document.createElement('div');
    d.className = 'viz';
    d.appendChild(node);
    return d.outerHTML;
  }

  const FILL = {
    '#0fb39c': 'var(--viz-teal)',
    '#6c4ee0': 'var(--viz-violet)',
    '#2f80ed': 'var(--viz-blue)',
    '#ff5a36': 'var(--viz-coral)',
    '#ffc43d': 'var(--viz-gold)',
    '#ff6b9a': 'var(--viz-rose)',
    '#62c918': 'var(--viz-lime)'
  };
  function themeFill(c) {
    if (c == null || c === '') return c;
    const k = String(c).trim().toLowerCase();
    return FILL[k] || c;
  }


  function hundredGrid(shaded, { cols = 10, rows = 10, fill = '#0fb39c', label } = {}) {
    const cell = 16, pad = 8, W = pad * 2 + cols * cell, H = pad * 2 + rows * cell + (label ? 22 : 0);
    const s = svg(W, H);
    s.appendChild(el('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }));
    for (let i = 0; i < rows * cols; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      s.appendChild(el('rect', {
        x: pad + c * cell, y: pad + r * cell, width: cell - 1, height: cell - 1,
        fill: i < shaded ? themeFill(fill) : 'var(--viz-empty)', stroke: 'var(--ink)', 'stroke-width': '1'
      }));
    }
    if (label) svgLabel(s, W / 2, H - 6, label, { 'font-size': 13, fill: 'var(--ink)' });
    return wrap(s);
  }

  function fractionBar(n, d, { fill = '#0fb39c', w = 320, h = 54, label } = {}) {
    const pad = 8, bw = w - pad * 2, bh = 28, s = svg(w, h + (label ? 16 : 0));
    const cw = bw / d;
    for (let i = 0; i < d; i++) {
      s.appendChild(el('rect', {
        x: pad + i * cw, y: 8, width: cw - 1.5, height: bh,
        fill: i < n ? themeFill(fill) : 'var(--viz-empty)', stroke: 'var(--ink)', 'stroke-width': '2'
      }));
    }
    if (label) svgLabel(s, w / 2, h + 10, label, { 'font-size': 13, fill: 'var(--ink)' });
    return wrap(s);
  }


  function parseFracLabel(text) {
    const t = String(text == null ? '' : text).trim();
    let m = t.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (m) return { kind: 'mixed', w: m[1], n: m[2], d: m[3] };
    m = t.match(/^(-?\d+)\s*\/\s*(\d+)$/);
    if (m) return { kind: 'frac', n: m[1], d: m[2] };
    return { kind: 'text', t };
  }
  function svgLabel(parent, x, y, text, attrs) {
    attrs = attrs || {};
    const parsed = parseFracLabel(text);
    const fill = attrs.fill || 'var(--ink)';
    const size = +(attrs['font-size'] || 12);
    const weight = attrs['font-weight'] || '800';
    if (parsed.kind === 'text') {
      /* A label like "1/2 = 2/4 = 0.5": plain text with stacked fractions in place of each a/b. */
      const parts = parsed.t.split(/(-?\d+\s*\/\s*\d+)/).filter((q) => q !== '');
      if (parts.length > 1 && parts.some((q) => /^-?\d+\s*\/\s*\d+$/.test(q))) {
        const fsz = Math.max(9, size - 1), g = el('g', { fill, 'font-weight': weight, 'font-size': String(size) });
        const segs = parts.map((q) => {
          const m = q.match(/^(-?\d+)\s*\/\s*(\d+)$/);
          if (m) return { f: true, n: m[1], d: m[2], w: Math.max(m[1].length, m[2].length) * fsz * 0.62 + 8 };
          const tt = q.trim(); return { f: false, t: tt, w: tt.length * size * 0.6 + (tt.length < q.length ? 8 : 0) };
        });
        const total = segs.reduce((a, q) => a + q.w, 0);
        let cx = +x - total / 2;
        segs.forEach((q) => {
          if (q.f) {
            const mid = cx + q.w / 2, bw = q.w - 6;
            g.appendChild(el('text', { x: mid, y: +y - fsz * 0.55, 'text-anchor': 'middle', 'font-size': String(fsz) }, [q.n]));
            g.appendChild(el('line', { x1: mid - bw / 2, y1: y, x2: mid + bw / 2, y2: y, stroke: fill, 'stroke-width': '1.6', 'stroke-linecap': 'round' }));
            g.appendChild(el('text', { x: mid, y: +y + fsz * 0.95, 'text-anchor': 'middle', 'font-size': String(fsz) }, [q.d]));
          } else {
            g.appendChild(el('text', { x: cx + (/^\s/.test(parts[segs.indexOf(q)]) ? 4 : 0), y: +y + size * 0.3, 'text-anchor': 'start' }, [q.t]));
          }
          cx += q.w;
        });
        parent.appendChild(g);
        return;
      }
      parent.appendChild(el('text', { x, y, 'text-anchor': attrs['text-anchor'] || 'middle', 'font-size': String(size), 'font-weight': weight, fill }, [parsed.t]));
      return;
    }
    const fs = Math.max(9, size - 1);
    const g = el('g', { fill, 'font-weight': weight, 'font-size': String(fs), 'text-anchor': 'middle' });
    const num = parsed.n, den = parsed.d;
    const wide = Math.max(String(num).length, String(den).length) * fs * 0.62 + 4;
    let cx = +x, cy = +y;
    if (parsed.kind === 'mixed') {
      const wOff = String(parsed.w).length * fs * 0.42;
      g.appendChild(el('text', { x: cx - wide / 2 - 1, y: cy + fs * 0.25, 'font-size': String(size), 'dominant-baseline': 'middle' }, [parsed.w]));
      cx = cx + wOff * 0.4;
    }
    g.appendChild(el('text', { x: cx, y: cy - fs * 0.55 }, [num]));
    g.appendChild(el('line', { x1: cx - wide / 2, y1: cy, x2: cx + wide / 2, y2: cy, stroke: fill, 'stroke-width': '1.6', 'stroke-linecap': 'round' }));
    g.appendChild(el('text', { x: cx, y: cy + fs * 0.95 }, [den]));
    parent.appendChild(g);
  }

  function numberLine(min, max, marks, { w = 420, h = 80 } = {}) {
    const L = 24, R = w - 24, span = max - min, ms = marks || [];
    /* Labels that would touch each other step up to a higher row, with a thin leader line down to the dot. */
    const guess = (t) => { const q = parseFracLabel(t); return q.kind === 'text' ? String(t).replace(/(-?\d+)\s*\/\s*(\d+)/g, (m0, a, b) => 'x'.repeat(Math.max(a.length, b.length))).length * 7.4 + 10 : Math.max(String(q.n).length, String(q.d).length) * 8 + 10; };
    const items = ms.map((m) => ({ m, x: L + ((m.pos - min) / span) * (R - L), t: m.label || String(m.pos) })).sort((p, q) => p.x - q.x);
    const ends = []; let rows = 1;
    items.forEach((it) => {
      const wd = guess(it.t); let r = 0;
      while (ends[r] != null && it.x - wd / 2 < ends[r] + 3) r++;
      ends[r] = it.x + wd / 2; it.r = r; rows = Math.max(rows, r + 1);
    });
    const ROW = 28, Y = 36 + (rows - 1) * ROW, H = Math.max(h, Y + 44), s = svg(w, H, { class: 'nl-svg' });
    s.appendChild(el('line', { x1: L, y1: Y, x2: R, y2: Y, stroke: 'var(--ink)', 'stroke-width': '3', 'stroke-linecap': 'round' }));
    const ticks = [];
    const step = span <= 1 ? 0.1 : span <= 2 ? 0.25 : 1;
    for (let v = min; v <= max + 1e-9; v = +(v + step).toFixed(4)) ticks.push(v);
    ticks.forEach((v) => {
      const x = L + ((v - min) / span) * (R - L);
      s.appendChild(el('line', { x1: x, y1: Y - 7, x2: x, y2: Y + 7, stroke: 'var(--ink)', 'stroke-width': '2' }));
      if (Math.abs(v * 10 - Math.round(v * 10)) < 1e-6) {
        svgLabel(s, x, Y + 22, String(v), { 'font-size': 12, fill: 'var(--muted)' });
      }
    });
    items.forEach((it) => {
      const m = it.m, x = it.x, ly = Y - 20 - it.r * ROW;
      if (it.r > 0) s.appendChild(el('line', { x1: x, y1: ly + 7, x2: x, y2: Y - 9, stroke: 'var(--muted)', 'stroke-width': '1.5', 'stroke-dasharray': '3 3' }));
      s.appendChild(el('circle', { cx: x, cy: Y, r: 7, fill: themeFill(m.color || '#ff5a36'), stroke: 'var(--ink)', 'stroke-width': '2' }));
      svgLabel(s, x, ly, it.t, { 'font-size': 13, fill: 'var(--ink)' });
    });
    return wrap(s);
  }

  function placeValue(digits, { headers, highlight } = {}) {
    const heads = headers || (digits.includes('.')
      ? null
      : null);
    // Build columns from a display string like "3.475" or array of {h,v,on}
    let cols;
    if (typeof digits === 'string') {
      const [a, b = ''] = digits.split('.');
      const namesW = ['Hundreds', 'Tens', 'Ones'].slice(-a.length);
      const namesD = ['Tenths', 'Hundredths', 'Thousandths'].slice(0, b.length);
      cols = [];
      a.split('').forEach((ch, i) => cols.push({ h: namesW[i] || '', v: ch, side: 'w' }));
      if (digits.includes('.')) cols.push({ h: '', v: '.', side: 'dot' });
      b.split('').forEach((ch, i) => cols.push({ h: namesD[i] || '', v: ch, side: 'd' }));
    } else cols = digits;
    /* Digit boxes are 70 wide; the decimal point gets a narrow 22-wide slot so it sits close to both sides. */
    const cw = 70, dw = 22, H = 88;
    const widths = cols.map((c) => (c.side === 'dot' ? dw : cw));
    const W = widths.reduce((a, b) => a + b, 0) + 16;
    const s = svg(W, H);
    let x = 8;
    cols.forEach((c, i) => {
      const on = highlight == null ? false : highlight === i || highlight === c.h;
      if (c.side !== 'dot') {
        s.appendChild(el('rect', { x, y: 22, width: cw - 8, height: 58, rx: 10, fill: on ? '#fff4cc' : (c.side === 'd' ? '#e8f8f4' : '#eef4ff'), stroke: 'var(--ink)', 'stroke-width': '2' }));
        if (c.h) s.appendChild(el('text', { x: x + (cw - 8) / 2, y: 16, 'text-anchor': 'middle', 'font-size': '10', 'font-weight': '800', fill: 'var(--muted)' }, [c.h]));
        /* Boxes are always light, so the digit is always dark (readable in dark mode too). */
        s.appendChild(el('text', { x: x + (cw - 8) / 2, y: 62, 'text-anchor': 'middle', 'font-size': '26', 'font-weight': '800', fill: '#1b2437' }, [c.v]));
      } else {
        s.appendChild(el('text', { x: x + dw / 2 - 4, y: 70, 'text-anchor': 'middle', 'font-size': '34', 'font-weight': '800', fill: 'var(--ink)' }, [c.v]));
      }
      x += widths[i];
    });
    return wrap(s);
  }

  function linePlot(values, { title = '', min, max } = {}) {
    const lo = min != null ? min : Math.min(...values);
    const hi = max != null ? max : Math.max(...values);
    const counts = {};
    values.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
    const maxC = Math.max(...Object.values(counts), 1);
    const w = 420, h = 140, L = 28, R = w - 20, Y = 110;
    const s = svg(w, h);
    if (title) s.appendChild(el('text', { x: w / 2, y: 16, 'text-anchor': 'middle', 'font-size': '13', 'font-weight': '800', fill: 'var(--ink)' }, [title]));
    s.appendChild(el('line', { x1: L, y1: Y, x2: R, y2: Y, stroke: 'var(--ink)', 'stroke-width': '3' }));
    for (let v = lo; v <= hi; v++) {
      const x = L + ((v - lo) / Math.max(hi - lo, 1)) * (R - L);
      s.appendChild(el('line', { x1: x, y1: Y - 5, x2: x, y2: Y + 5, stroke: 'var(--ink)', 'stroke-width': '2' }));
      svgLabel(s, x, Y + 18, String(v), { 'font-size': 12, fill: 'var(--muted)' });
      const n = counts[v] || 0;
      for (let i = 0; i < n; i++) {
        s.appendChild(el('circle', { cx: x, cy: Y - 14 - i * 16, r: 6, fill: themeFill('#2f80ed'), stroke: 'var(--ink)', 'stroke-width': '1.5' }));
      }
    }
    return wrap(s);
  }

  function stemLeaf(data, { title = 'Stem-and-Leaf', key } = {}) {
    const rows = {};
    data.forEach((n) => {
      const stem = Math.floor(n / 10), leaf = n % 10;
      (rows[stem] || (rows[stem] = [])).push(leaf);
    });
    Object.keys(rows).forEach((k) => rows[k].sort((a, b) => a - b));
    const stems = Object.keys(rows).map(Number).sort((a, b) => a - b);
    const lines = stems.map((st) => `<tr><td class="st">${st}</td><td class="lf">${rows[st].join(' ')}</td></tr>`).join('');
    const k = key || (data[0] != null ? `Key: ${Math.floor(data[0] / 10)} | ${data[0] % 10} means ${data[0]}` : '');
    return `<div class="viz"><table class="g5t" style="border-collapse:collapse;font-weight:800;background:var(--card);border:2px solid var(--ink);border-radius:10px;overflow:hidden">
      <caption style="font-weight:800;padding:4px">${title}</caption>
      <thead><tr><th style="border:1.5px solid var(--ink);padding:4px 10px;background:var(--chip-bg)">Stem</th><th style="border:1.5px solid var(--ink);padding:4px 10px;background:var(--chip-bg)">Leaf</th></tr></thead>
      <tbody>${lines}</tbody></table><div style="font-size:13px;color:var(--muted);margin-top:4px;font-weight:700">${k}</div></div>`;
  }

  function pie(parts, labels, { size = 200 } = {}) {
    const cx = size / 2, cy = size / 2, R = size / 2 - 8;
    const cols = ['#0fb39c', '#ffc43d', '#2f80ed', '#ff5a36', '#6c4ee0', '#ff6b9a'].map(themeFill);
    const s = svg(size, size);
    let a0 = -Math.PI / 2;
    parts.forEach((p, i) => {
      const a1 = a0 + p / 100 * 2 * Math.PI;
      const large = p > 50 ? 1 : 0;
      const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
      const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
      const am = (a0 + a1) / 2;
      s.appendChild(el('path', {
        d: `M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`,
        fill: cols[i % cols.length], stroke: 'var(--ink)', 'stroke-width': '2'
      }));
      if (labels && labels[i] && p >= 8) {
        svgLabel(s, (cx + (R * 0.55) * Math.cos(am)).toFixed(1), (cy + (R * 0.55) * Math.sin(am) + 4).toFixed(1), labels[i], { 'font-size': 11, fill: 'var(--ink)' });
      }
      a0 = a1;
    });
    return wrap(s);
  }

  function barGraph(cats, vals, { title = '', color = '#2f80ed' } = {}) {
    color = themeFill(color);
    const w = 400, h = 180, L = 36, B = 140, max = Math.max(...vals, 1);
    const s = svg(w, h);
    if (title) s.appendChild(el('text', { x: w / 2, y: 16, 'text-anchor': 'middle', 'font-size': '13', 'font-weight': '800' }, [title]));
    s.appendChild(el('line', { x1: L, y1: 28, x2: L, y2: B, stroke: 'var(--ink)', 'stroke-width': '2' }));
    s.appendChild(el('line', { x1: L, y1: B, x2: w - 10, y2: B, stroke: 'var(--ink)', 'stroke-width': '2' }));
    const bw = (w - L - 20) / cats.length;
    cats.forEach((c, i) => {
      const bh = (vals[i] / max) * 100;
      s.appendChild(el('rect', { x: L + 10 + i * bw, y: B - bh, width: bw - 12, height: bh, fill: color, stroke: 'var(--ink)', 'stroke-width': '1.5' }));
      svgLabel(s, L + 10 + i * bw + (bw - 12) / 2, B + 16, c, { 'font-size': 11, fill: 'var(--ink)' });
      s.appendChild(el('text', { x: L + 10 + i * bw + (bw - 12) / 2, y: B - bh - 4, 'text-anchor': 'middle', 'font-size': '11', 'font-weight': '800' }, [String(vals[i])]));
    });
    return wrap(s);
  }

  /* Coordinate plane. Theme-aware (css .cp-*), arrowed axes, x/y letters, numbered lines, one "0" at the origin.
     points: [{x, y, label, guide}]  guide: draws the across (blue) then up (green) path from the origin.
     opts: quad (four quadrants), n (max value on each axis), size, guide (all points). */
  function planeGeo(quad, n, size) {
    const S = size || 260;
    if (quad) {
      const m = 26, c = (S - 2 * m) / (2 * n);
      return { S, quad, n, c, ox: S / 2, oy: S / 2, px: (x) => S / 2 + x * c, py: (y) => S / 2 - y * c, lo: -n };
    }
    const ox = 34, oy = S - 32, c = (S - ox - 30) / n;
    return { S, quad, n, c, ox, oy, px: (x) => ox + x * c, py: (y) => oy - y * c, lo: 0 };
  }
  function arrowHead(x, y, dir) {
    const a = 7, b = 5;
    const pts = dir === 'r' ? [[x, y], [x - a * 1.4, y - b], [x - a * 1.4, y + b]]
      : dir === 'l' ? [[x, y], [x + a * 1.4, y - b], [x + a * 1.4, y + b]]
      : dir === 'u' ? [[x, y], [x - b, y + a * 1.4], [x + b, y + a * 1.4]]
      : [[x, y], [x - b, y - a * 1.4], [x + b, y - a * 1.4]];
    return el('polygon', { points: pts.map((p) => p.join(',')).join(' '), class: 'cp-arrow' });
  }
  function planeSVG(points, opts) {
    const o = Object.assign({ quad: false, n: 8, size: 260, guide: false, numbers: true }, opts || {});
    const G = planeGeo(o.quad, o.n, o.size);
    const S = G.S, s = svg(S, S, { class: 'cp', 'aria-label': 'Coordinate grid' });
    s.removeAttribute('width'); s.removeAttribute('height');
    const lo = G.lo, n = G.n, x0 = G.px(lo), x1 = G.px(n), y0 = G.py(lo), y1 = G.py(n);
    s.appendChild(el('rect', { x: x0, y: y1, width: x1 - x0, height: y0 - y1, class: 'cp-bg', rx: 3 }));
    const step = G.c < 22 ? 2 : 1;
    for (let i = lo; i <= n; i++) {
      if (i === 0) continue;
      const cls = (i % (o.quad ? 5 : 5) === 0) ? 'cp-major' : 'cp-minor';
      s.appendChild(el('line', { x1: G.px(i), y1: y1, x2: G.px(i), y2: y0, class: cls }));
      s.appendChild(el('line', { x1: x0, y1: G.py(i), x2: x1, y2: G.py(i), class: cls }));
    }
    const ext = 16;
    const g = el('g', { class: 'cp-axes' });
    if (o.quad) {
      g.appendChild(el('line', { x1: x0 - ext + 4, y1: G.oy, x2: x1 + ext - 4, y2: G.oy, class: 'cp-axis cp-axis-x' }));
      g.appendChild(el('line', { x1: G.ox, y1: y0 + ext - 4, x2: G.ox, y2: y1 - ext + 4, class: 'cp-axis cp-axis-y' }));
      g.appendChild(arrowHead(x1 + ext, G.oy, 'r')); g.appendChild(arrowHead(x0 - ext, G.oy, 'l'));
      g.appendChild(arrowHead(G.ox, y1 - ext, 'u')); g.appendChild(arrowHead(G.ox, y0 + ext, 'd'));
    } else {
      g.appendChild(el('line', { x1: G.ox, y1: G.oy, x2: x1 + ext - 4, y2: G.oy, class: 'cp-axis cp-axis-x' }));
      g.appendChild(el('line', { x1: G.ox, y1: G.oy, x2: G.ox, y2: y1 - ext + 4, class: 'cp-axis cp-axis-y' }));
      g.appendChild(arrowHead(x1 + ext, G.oy, 'r')); g.appendChild(arrowHead(G.ox, y1 - ext, 'u'));
    }
    s.appendChild(g);
    /* Axis letters: x at the right tip, y at the top tip. */
    s.appendChild(el('text', { x: x1 + ext - 2, y: G.oy - 9, class: 'cp-letter cp-lx', 'text-anchor': 'middle' }, ['x']));
    s.appendChild(el('text', { x: G.ox + 11, y: y1 - ext + 6, class: 'cp-letter cp-ly', 'text-anchor': 'start' }, ['y']));
    if (o.numbers) {
      for (let i = lo; i <= n; i++) {
        if (i === 0 || i % step) continue;
        const t = i < 0 ? '−' + (-i) : String(i);
        s.appendChild(el('text', { x: G.px(i), y: G.oy + 15, class: 'cp-num', 'text-anchor': 'middle' }, [t]));
        s.appendChild(el('text', { x: G.ox - 6, y: G.py(i) + 4, class: 'cp-num', 'text-anchor': 'end' }, [t]));
      }
      /* The origin gets one 0, tucked below-left of the corner. */
      s.appendChild(el('text', { x: G.ox - 6, y: G.oy + 15, class: 'cp-num cp-zero', 'text-anchor': 'end' }, ['0']));
    }
    const layer = el('g', { class: 'cp-pts' });
    (points || []).forEach((pt) => addPoint(layer, G, pt, o.guide || pt.guide));
    s.appendChild(layer);
    s.__geo = G;
    return s;
  }
  function guidePath(G, x, y, cls) {
    const g = el('g', { class: 'cp-guide ' + (cls || '') });
    if (x) {
      g.appendChild(el('line', { x1: G.ox, y1: G.oy, x2: G.px(x), y2: G.oy, class: 'cp-go-x' }));
      g.appendChild(arrowHead(G.px(x) + (x > 0 ? 1 : -1), G.oy, x > 0 ? 'r' : 'l')).setAttribute('class', 'cp-go-xh');
    }
    if (y) {
      g.appendChild(el('line', { x1: G.px(x), y1: G.oy, x2: G.px(x), y2: G.py(y), class: 'cp-go-y' }));
      g.appendChild(arrowHead(G.px(x), G.py(y) + (y > 0 ? 9 : -9), y > 0 ? 'u' : 'd')).setAttribute('class', 'cp-go-yh');
    }
    return g;
  }
  function addPoint(layer, G, pt, guide) {
    if (guide) layer.appendChild(guidePath(G, pt.x, pt.y));
    const cx = G.px(pt.x), cy = G.py(pt.y);
    layer.appendChild(el('circle', { cx, cy, r: 6.5, class: 'cp-dot' + (pt.cls ? ' ' + pt.cls : '') }));
    if (pt.label) {
      const right = cx < G.S - 64;
      const up = cy > 26;
      layer.appendChild(el('text', { x: cx + (right ? 9 : -9), y: cy + (up ? -9 : 18), class: 'cp-lab', 'text-anchor': right ? 'start' : 'end' }, [pt.label]));
    }
  }

  function plane(points, { quad = false, n, guide = false } = {}) {
    if (n == null) n = quad ? 6 : 8;
    return wrap(planeSVG(points, { quad, n, guide }));
  }

  function angle(deg, { label } = {}) {
    const s = svg(180, 120);
    const cx = 40, cy = 90, R = 80;
    const rad = deg * Math.PI / 180;
    s.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R, y2: cy, stroke: 'var(--ink)', 'stroke-width': '3' }));
    s.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R * Math.cos(rad), y2: cy - R * Math.sin(rad), stroke: 'var(--ink)', 'stroke-width': '3' }));
    const d = `M ${cx + 24} ${cy} A 24 24 0 ${deg > 180 ? 1 : 0} 0 ${cx + 24 * Math.cos(rad)} ${cy - 24 * Math.sin(rad)}`;
    s.appendChild(el('path', { d, fill: 'none', stroke: themeFill('#ff5a36'), 'stroke-width': '3' }));
    s.appendChild(el('text', { x: 90, y: 40, 'font-size': '16', 'font-weight': '800', fill: 'var(--ink)' }, [label || (deg + '°')]));
    return wrap(s);
  }

  function areaRect(l, w, { unit = '', fill = '#0fb39c' } = {}) {
    fill = themeFill(fill);
    const scale = Math.min(200 / Math.max(l, 1), 130 / Math.max(w, 1), 36);
    const W = Math.max(48, l * scale), H = Math.max(36, w * scale);
    const padL = 44, padT = 28, padB = 16, padR = 16;
    const s = svg(W + padL + padR, H + padT + padB);
    s.appendChild(el('rect', { x: padL, y: padT, width: W, height: H, fill, 'fill-opacity': '0.4', stroke: 'var(--ink)', 'stroke-width': '2.5', rx: '4' }));
    s.appendChild(el('text', { x: padL + W / 2, y: padT - 8, 'text-anchor': 'middle', 'font-size': '14', 'font-weight': '800', fill: 'var(--ink)' }, [String(l) + (unit ? ' ' + unit : '')]));
    s.appendChild(el('text', { x: padL - 8, y: padT + H / 2, 'text-anchor': 'end', 'dominant-baseline': 'middle', 'font-size': '14', 'font-weight': '800', fill: 'var(--ink)' }, [String(w) + (unit ? ' ' + unit : '')]));
    const area = (Math.round(l * w * 1000) / 1000);
    s.appendChild(el('text', { x: padL + W / 2, y: padT + H / 2 + 5, 'text-anchor': 'middle', 'font-size': '16', 'font-weight': '800', fill: 'var(--ink)' }, [String(area)]));
    return wrap(s);
  }

  function metricLadder(on) {
    const units = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
    const s = svg(420, 70);
    units.forEach((u, i) => {
      const x = 16 + i * 58;
      const hit = u === on;
      s.appendChild(el('rect', { x, y: 18, width: 50, height: 32, rx: '8', fill: hit ? themeFill('#0fb39c') : 'var(--viz-empty)', stroke: 'var(--ink)', 'stroke-width': '2' }));
      s.appendChild(el('text', { x: x + 25, y: 39, 'text-anchor': 'middle', 'font-size': '13', 'font-weight': '800', fill: hit ? '#072821' : 'var(--ink)' }, [u]));
      if (i < units.length - 1) {
        s.appendChild(el('text', { x: x + 54, y: 14, 'text-anchor': 'middle', 'font-size': '9', 'font-weight': '800', fill: 'var(--muted)' }, ['×10']));
      }
    });
    return wrap(s);
  }

  function cycleSteps(labels) {
    /* Big, readable boxes: the picture is drawn at 340 wide so a phone shows it near 1:1. */
    const n = labels.length, gap = 22, W = 340;
    const bw = (W - 8 - (n - 1) * gap) / n;
    /* Split long labels onto two lines at the best space so the text can stay large. */
    const lines = labels.map((lab) => {
      const t = String(lab);
      if (t.indexOf(' ') < 0 || t.length * 9.8 <= bw - 8) return [t];
      let best = -1, bd = 1e9;
      for (let i = 0; i < t.length; i++) if (t[i] === ' ' && Math.abs(i - t.length / 2) < bd) { bd = Math.abs(i - t.length / 2); best = i; }
      return [t.slice(0, best), t.slice(best + 1)];
    });
    const maxLen = Math.max.apply(null, lines.map((l) => Math.max.apply(null, l.map((x) => x.length))));
    const fs = Math.max(12, Math.min(24, Math.floor((bw - 8) / (maxLen * 0.58))));
    const multi = lines.some((l) => l.length > 1);
    const bh = multi ? Math.max(64, fs * 2 + 26) : Math.max(56, fs + 34), H = bh + 24;
    const s = svg(W, H);
    s.setAttribute('width', '100%');
    s.removeAttribute('height');
    s.setAttribute('style', 'width:100%;max-width:480px');
    labels.forEach((lab, i) => {
      const x = 4 + i * (bw + gap), mid = 12 + bh / 2;
      s.appendChild(el('rect', { x, y: 12, width: bw, height: bh, rx: '12', fill: 'var(--why-bg)', stroke: 'var(--ink)', 'stroke-width': '2.5' }));
      const ls = lines[i];
      ls.forEach((ln, k) => {
        const y = mid + fs * 0.35 + (k - (ls.length - 1) / 2) * (fs * 1.15);
        s.appendChild(el('text', { x: x + bw / 2, y, 'text-anchor': 'middle', 'font-size': String(fs), 'font-weight': '800', fill: 'var(--ink)' }, [ln]));
      });
      if (i < n - 1) {
        const ax = x + bw + 4, ay = mid;
        s.appendChild(el('path', { d: `M ${ax} ${ay} L ${ax + gap - 8} ${ay}`, stroke: 'var(--ink)', 'stroke-width': '2.5', 'stroke-linecap': 'round' }));
        s.appendChild(el('path', { d: `M ${ax + gap - 15} ${ay - 7} L ${ax + gap - 8} ${ay} L ${ax + gap - 15} ${ay + 7}`, fill: 'none', stroke: 'var(--ink)', 'stroke-width': '2.5', 'stroke-linecap': 'round' }));
      }
    });
    return wrap(s);
  }

  w.V = {
    themeFill, hundredGrid, fractionBar, numberLine, placeValue, linePlot, stemLeaf, pie, barGraph, plane, planeSVG, planeGeo, guidePath, angle,
    areaRect, metricLadder, cycleSteps,
    fr(n, d) { return `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`; },
    mixed(w, n, d) { return `<span class="mix">${w}${this.fr(n, d)}</span>`; }
  };
})(window);
