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
        fill: i < shaded ? fill : '#fff', stroke: '#1b2437', 'stroke-width': '1'
      }));
    }
    if (label) s.appendChild(el('text', { x: W / 2, y: H - 6, 'text-anchor': 'middle', 'font-size': '13', 'font-weight': '800', fill: '#1b2437' }, [label]));
    return wrap(s);
  }

  function fractionBar(n, d, { fill = '#6c4ee0', w = 320, h = 54, label } = {}) {
    const pad = 8, bw = w - pad * 2, bh = 28, s = svg(w, h + (label ? 16 : 0));
    const cw = bw / d;
    for (let i = 0; i < d; i++) {
      s.appendChild(el('rect', {
        x: pad + i * cw, y: 8, width: cw - 1.5, height: bh,
        fill: i < n ? fill : '#fff', stroke: '#1b2437', 'stroke-width': '2'
      }));
    }
    if (label) s.appendChild(el('text', { x: w / 2, y: h + 10, 'text-anchor': 'middle', 'font-size': '13', 'font-weight': '800', fill: '#1b2437' }, [label]));
    return wrap(s);
  }

  function numberLine(min, max, marks, { w = 420, h = 80 } = {}) {
    const L = 24, R = w - 24, Y = 36, s = svg(w, h);
    s.appendChild(el('line', { x1: L, y1: Y, x2: R, y2: Y, stroke: '#1b2437', 'stroke-width': '3', 'stroke-linecap': 'round' }));
    const span = max - min;
    const ticks = [];
    const step = span <= 1 ? 0.1 : span <= 2 ? 0.25 : 1;
    for (let v = min; v <= max + 1e-9; v = +(v + step).toFixed(4)) ticks.push(v);
    ticks.forEach((v) => {
      const x = L + ((v - min) / span) * (R - L);
      s.appendChild(el('line', { x1: x, y1: Y - 7, x2: x, y2: Y + 7, stroke: '#1b2437', 'stroke-width': '2' }));
      if (Math.abs(v * 10 - Math.round(v * 10)) < 1e-6) {
        s.appendChild(el('text', { x, y: Y + 22, 'text-anchor': 'middle', 'font-size': '12', 'font-weight': '800', fill: '#4d5a73' }, [String(v)]));
      }
    });
    (marks || []).forEach((m) => {
      const x = L + ((m.pos - min) / span) * (R - L);
      s.appendChild(el('circle', { cx: x, cy: Y, r: 7, fill: m.color || '#ff5a36', stroke: '#1b2437', 'stroke-width': '2' }));
      s.appendChild(el('text', { x, y: 16, 'text-anchor': 'middle', 'font-size': '13', 'font-weight': '800', fill: '#1b2437' }, [m.label || String(m.pos)]));
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
        s.appendChild(el('rect', { x, y: 22, width: cw - 8, height: 58, rx: 10, fill: on ? '#fff4cc' : (c.side === 'd' ? '#e8f8f4' : '#eef4ff'), stroke: '#1b2437', 'stroke-width': '2' }));
      }
      if (c.h) s.appendChild(el('text', { x: x + (cw - 8) / 2, y: 16, 'text-anchor': 'middle', 'font-size': '10', 'font-weight': '800', fill: '#4d5a73' }, [c.h]));
      s.appendChild(el('text', { x: x + (c.side === 'dot' ? 6 : (cw - 8) / 2), y: 62, 'text-anchor': 'middle', 'font-size': '26', 'font-weight': '800', fill: '#1b2437' }, [c.v]));
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
    if (title) s.appendChild(el('text', { x: w / 2, y: 16, 'text-anchor': 'middle', 'font-size': '13', 'font-weight': '800', fill: '#1b2437' }, [title]));
    s.appendChild(el('line', { x1: L, y1: Y, x2: R, y2: Y, stroke: '#1b2437', 'stroke-width': '3' }));
    for (let v = lo; v <= hi; v++) {
      const x = L + ((v - lo) / Math.max(hi - lo, 1)) * (R - L);
      s.appendChild(el('line', { x1: x, y1: Y - 5, x2: x, y2: Y + 5, stroke: '#1b2437', 'stroke-width': '2' }));
      s.appendChild(el('text', { x, y: Y + 18, 'text-anchor': 'middle', 'font-size': '12', 'font-weight': '800', fill: '#4d5a73' }, [String(v)]));
      const n = counts[v] || 0;
      for (let i = 0; i < n; i++) {
        s.appendChild(el('circle', { cx: x, cy: Y - 14 - i * 16, r: 6, fill: '#2f80ed', stroke: '#1b2437', 'stroke-width': '1.5' }));
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
    return `<div class="viz"><table class="g5t" style="border-collapse:collapse;font-weight:800;background:#fff;border:2px solid #1b2437;border-radius:10px;overflow:hidden">
      <caption style="font-weight:800;padding:4px">${title}</caption>
      <thead><tr><th style="border:1.5px solid #1b2437;padding:4px 10px;background:#fff4cc">Stem</th><th style="border:1.5px solid #1b2437;padding:4px 10px;background:#fff4cc">Leaf</th></tr></thead>
      <tbody>${lines}</tbody></table><div style="font-size:13px;color:#4d5a73;margin-top:4px;font-weight:700">${k}</div></div>`;
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
        fill: cols[i % cols.length], stroke: '#1b2437', 'stroke-width': '2'
      }));
      if (labels && labels[i] && p >= 8) {
        s.appendChild(el('text', {
          x: (cx + (R * 0.55) * Math.cos(am)).toFixed(1),
          y: (cy + (R * 0.55) * Math.sin(am) + 4).toFixed(1),
          'text-anchor': 'middle', 'font-size': '11', 'font-weight': '800', fill: '#1b2437'
        }, [labels[i]]));
      }
      a0 = a1;
    });
    return wrap(s);
  }

  function barGraph(cats, vals, { title = '', color = '#2f80ed' } = {}) {
    const w = 400, h = 180, L = 36, B = 140, max = Math.max(...vals, 1);
    const s = svg(w, h);
    if (title) s.appendChild(el('text', { x: w / 2, y: 16, 'text-anchor': 'middle', 'font-size': '13', 'font-weight': '800' }, [title]));
    s.appendChild(el('line', { x1: L, y1: 28, x2: L, y2: B, stroke: '#1b2437', 'stroke-width': '2' }));
    s.appendChild(el('line', { x1: L, y1: B, x2: w - 10, y2: B, stroke: '#1b2437', 'stroke-width': '2' }));
    const bw = (w - L - 20) / cats.length;
    cats.forEach((c, i) => {
      const bh = (vals[i] / max) * 100;
      s.appendChild(el('rect', { x: L + 10 + i * bw, y: B - bh, width: bw - 12, height: bh, fill: color, stroke: '#1b2437', 'stroke-width': '1.5' }));
      s.appendChild(el('text', { x: L + 10 + i * bw + (bw - 12) / 2, y: B + 16, 'text-anchor': 'middle', 'font-size': '11', 'font-weight': '800' }, [c]));
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
      sEl.appendChild(el('line', { x1: p, y1: 12, x2: p, y2: 228, stroke: '#eadcc6', 'stroke-width': '1' }));
      const q = (quad ? 120 : 220) - i * s;
      sEl.appendChild(el('line', { x1: 12, y1: q, x2: 228, y2: q, stroke: '#eadcc6', 'stroke-width': '1' }));
    }
    if (quad) {
      sEl.appendChild(el('line', { x1: 120, y1: 8, x2: 120, y2: 232, stroke: '#1b2437', 'stroke-width': '2' }));
      sEl.appendChild(el('line', { x1: 8, y1: 120, x2: 232, y2: 120, stroke: '#1b2437', 'stroke-width': '2' }));
    } else {
      sEl.appendChild(el('line', { x1: 28, y1: 220, x2: 28, y2: 12, stroke: '#1b2437', 'stroke-width': '2' }));
      sEl.appendChild(el('line', { x1: 28, y1: 220, x2: 228, y2: 220, stroke: '#1b2437', 'stroke-width': '2' }));
    }
    (points || []).forEach((pt) => {
      const x = quad ? 120 + pt.x * s : 28 + pt.x * s;
      const y = quad ? 120 - pt.y * s : 220 - pt.y * s;
      sEl.appendChild(el('circle', { cx: x, cy: y, r: 6, fill: '#ff5a36', stroke: '#1b2437', 'stroke-width': '2' }));
      if (pt.label) sEl.appendChild(el('text', { x: x + 8, y: y - 8, 'font-size': '11', 'font-weight': '800' }, [pt.label]));
    });
    return wrap(sEl);
  }

  function angle(deg, { label } = {}) {
    const s = svg(180, 120);
    const cx = 40, cy = 90, R = 80;
    const rad = deg * Math.PI / 180;
    s.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R, y2: cy, stroke: '#1b2437', 'stroke-width': '3' }));
    s.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R * Math.cos(rad), y2: cy - R * Math.sin(rad), stroke: '#1b2437', 'stroke-width': '3' }));
    const d = `M ${cx + 24} ${cy} A 24 24 0 ${deg > 180 ? 1 : 0} 0 ${cx + 24 * Math.cos(rad)} ${cy - 24 * Math.sin(rad)}`;
    s.appendChild(el('path', { d, fill: 'none', stroke: '#ff5a36', 'stroke-width': '3' }));
    s.appendChild(el('text', { x: 90, y: 40, 'font-size': '16', 'font-weight': '800', fill: '#1b2437' }, [label || (deg + '°')]));
    return wrap(s);
  }

  w.V = {
    hundredGrid, fractionBar, numberLine, placeValue, linePlot, stemLeaf, pie, barGraph, plane, angle,
    fr(n, d) { return `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`; },
    mixed(w, n, d) { return `<span class="mix">${w}${this.fr(n, d)}</span>`; }
  };
})(window);
