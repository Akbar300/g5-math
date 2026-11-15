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

  function hundredGrid(shaded, { cols = 10, rows = 10, fill = '#0fb39c', label } = {}) {
    const cell = 16, pad = 8, W = pad * 2 + cols * cell, H = pad * 2 + rows * cell + (label ? 22 : 0);
    const s = svg(W, H);
    s.appendChild(el('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }));
    for (let i = 0; i < rows * cols; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      s.appendChild(el('rect', {
        x: pad + c * cell, y: pad + r * cell, width: cell - 1, height: cell - 1,
        fill: i < shaded ? fill : 'var(--viz-empty)', stroke: 'var(--ink)', 'stroke-width': '1'
      }));
    }
    if (label) svgLabel(s, W / 2, H - 6, label, { 'font-size': 13, fill: 'var(--ink)' });
    return wrap(s);
  }

  function fractionBar(n, d, { fill = '#6c4ee0', w = 320, h = 54, label } = {}) {
    const pad = 8, bw = w - pad * 2, bh = 28, s = svg(w, h + (label ? 16 : 0));
    const cw = bw / d;
    for (let i = 0; i < d; i++) {
      s.appendChild(el('rect', {
        x: pad + i * cw, y: 8, width: cw - 1.5, height: bh,
        fill: i < n ? fill : 'var(--viz-empty)', stroke: 'var(--ink)', 'stroke-width': '2'
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
    const L = 24, R = w - 24, Y = 36, s = svg(w, h);
    s.appendChild(el('line', { x1: L, y1: Y, x2: R, y2: Y, stroke: 'var(--ink)', 'stroke-width': '3', 'stroke-linecap': 'round' }));
    const span = max - min;
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
    (marks || []).forEach((m) => {
      const x = L + ((m.pos - min) / span) * (R - L);
      s.appendChild(el('circle', { cx: x, cy: Y, r: 7, fill: m.color || '#ff5a36', stroke: 'var(--ink)', 'stroke-width': '2' }));
      svgLabel(s, x, 16, m.label || String(m.pos), { 'font-size': 13, fill: 'var(--ink)' });
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
    const cw = 70, W = cols.length * cw + 16, H = 88;
    const s = svg(W, H);
    cols.forEach((c, i) => {
      const x = 8 + i * cw;
      const on = highlight == null ? false : highlight === i || highlight === c.h;
      if (c.side !== 'dot') {
        s.appendChild(el('rect', { x, y: 22, width: cw - 8, height: 58, rx: 10, fill: on ? 'var(--remember-bg)' : (c.side === 'd' ? '#e8f8f4' : '#eef4ff'), stroke: 'var(--ink)', 'stroke-width': '2' }));
      }
      if (c.h) s.appendChild(el('text', { x: x + (cw - 8) / 2, y: 16, 'text-anchor': 'middle', 'font-size': '10', 'font-weight': '800', fill: 'var(--muted)' }, [c.h]));
      s.appendChild(el('text', { x: x + (c.side === 'dot' ? 6 : (cw - 8) / 2), y: 62, 'text-anchor': 'middle', 'font-size': '26', 'font-weight': '800', fill: 'var(--ink)' }, [c.v]));
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
        s.appendChild(el('circle', { cx: x, cy: Y - 14 - i * 16, r: 6, fill: '#2f80ed', stroke: 'var(--ink)', 'stroke-width': '1.5' }));
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
    const cols = ['#0fb39c', '#ffc43d', '#2f80ed', '#ff5a36', '#6c4ee0', '#ff6b9a'];
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

  function plane(points, { quad = false, n = 8 } = {}) {
    const W = 240, o = quad ? 120 : 28, s = quad ? 18 : 24;
    const svgW = 240, sEl = svg(svgW, svgW);
    const max = quad ? n : n;
    for (let i = (quad ? -n : 0); i <= n; i++) {
      const p = o + i * s;
      sEl.appendChild(el('line', { x1: p, y1: 12, x2: p, y2: 228, stroke: 'var(--line)', 'stroke-width': '1' }));
      const q = (quad ? 120 : 220) - i * s;
      sEl.appendChild(el('line', { x1: 12, y1: q, x2: 228, y2: q, stroke: 'var(--line)', 'stroke-width': '1' }));
    }
    if (quad) {
      sEl.appendChild(el('line', { x1: 120, y1: 8, x2: 120, y2: 232, stroke: 'var(--ink)', 'stroke-width': '2' }));
      sEl.appendChild(el('line', { x1: 8, y1: 120, x2: 232, y2: 120, stroke: 'var(--ink)', 'stroke-width': '2' }));
    } else {
      sEl.appendChild(el('line', { x1: 28, y1: 220, x2: 28, y2: 12, stroke: 'var(--ink)', 'stroke-width': '2' }));
      sEl.appendChild(el('line', { x1: 28, y1: 220, x2: 228, y2: 220, stroke: 'var(--ink)', 'stroke-width': '2' }));
    }
    (points || []).forEach((pt) => {
      const x = quad ? 120 + pt.x * s : 28 + pt.x * s;
      const y = quad ? 120 - pt.y * s : 220 - pt.y * s;
      sEl.appendChild(el('circle', { cx: x, cy: y, r: 6, fill: '#ff5a36', stroke: 'var(--ink)', 'stroke-width': '2' }));
      if (pt.label) sEl.appendChild(el('text', { x: x + 8, y: y - 8, 'font-size': '11', 'font-weight': '800', fill: 'var(--ink)' }, [pt.label]));
    });
    return wrap(sEl);
  }

  function angle(deg, { label } = {}) {
    const s = svg(180, 120);
    const cx = 40, cy = 90, R = 80;
    const rad = deg * Math.PI / 180;
    s.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R, y2: cy, stroke: 'var(--ink)', 'stroke-width': '3' }));
    s.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R * Math.cos(rad), y2: cy - R * Math.sin(rad), stroke: 'var(--ink)', 'stroke-width': '3' }));
    const d = `M ${cx + 24} ${cy} A 24 24 0 ${deg > 180 ? 1 : 0} 0 ${cx + 24 * Math.cos(rad)} ${cy - 24 * Math.sin(rad)}`;
    s.appendChild(el('path', { d, fill: 'none', stroke: '#ff5a36', 'stroke-width': '3' }));
    s.appendChild(el('text', { x: 90, y: 40, 'font-size': '16', 'font-weight': '800', fill: 'var(--ink)' }, [label || (deg + '°')]));
    return wrap(s);
  }

  function areaRect(l, w, { unit = '', fill = '#0fb39c' } = {}) {
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
      s.appendChild(el('rect', { x, y: 18, width: 50, height: 32, rx: '8', fill: hit ? '#0fb39c' : 'var(--viz-empty)', stroke: 'var(--ink)', 'stroke-width': '2' }));
      s.appendChild(el('text', { x: x + 25, y: 39, 'text-anchor': 'middle', 'font-size': '13', 'font-weight': '800', fill: hit ? '#072821' : 'var(--ink)' }, [u]));
      if (i < units.length - 1) {
        s.appendChild(el('text', { x: x + 54, y: 14, 'text-anchor': 'middle', 'font-size': '9', 'font-weight': '800', fill: 'var(--muted)' }, ['×10']));
      }
    });
    return wrap(s);
  }

  function cycleSteps(labels) {
    const n = labels.length, W = 440, H = 78, bw = Math.min(96, (W - 20 - (n - 1) * 24) / n);
    const s = svg(W, H);
    labels.forEach((lab, i) => {
      const x = 10 + i * (bw + 24);
      s.appendChild(el('rect', { x, y: 16, width: bw, height: 46, rx: '10', fill: 'var(--why-bg)', stroke: 'var(--ink)', 'stroke-width': '2' }));
      s.appendChild(el('text', { x: x + bw / 2, y: 44, 'text-anchor': 'middle', 'font-size': '11', 'font-weight': '800', fill: 'var(--ink)' }, [lab]));
      if (i < n - 1) {
        s.appendChild(el('path', { d: `M ${x + bw + 3} 39 L ${x + bw + 18} 39`, stroke: 'var(--ink)', 'stroke-width': '2', 'stroke-linecap': 'round' }));
        s.appendChild(el('path', { d: `M ${x + bw + 12} 33 L ${x + bw + 18} 39 L ${x + bw + 12} 45`, fill: 'none', stroke: 'var(--ink)', 'stroke-width': '2', 'stroke-linecap': 'round' }));
      }
    });
    return wrap(s);
  }

  w.V = {
    hundredGrid, fractionBar, numberLine, placeValue, linePlot, stemLeaf, pie, barGraph, plane, angle,
    areaRect, metricLadder, cycleSteps,
    fr(n, d) { return `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`; },
    mixed(w, n, d) { return `<span class="mix">${w}${this.fr(n, d)}</span>`; }
  };
})(window);
