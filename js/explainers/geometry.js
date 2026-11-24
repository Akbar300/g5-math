/* Geometry pictures and explainers for Unit 9 (5.MG.2, 5.MG.3 and Advanced Unit 9).

   GV.* — still pictures for Learn cards (theme-aware SVG, classes .gv-* in css/app.css):
     GV.rtri(b, h, unit)        right triangle with its legs labeled
     GV.triHalf(b, h, unit)     right triangle inside its rectangle: two equal halves
     GV.anyTri(b, h, a, unit)   any triangle in its rectangle, height splits it into two halves
     GV.para(b, h, o, unit)     parallelogram: cut the end triangle off, slide it over → rectangle
     GV.prism(l, w, h, opts)    box of unit cubes, opts.hl = 'base' | 'top' highlights one layer
     GV.pav()                   perimeter (around) vs area (cover) vs volume (fill)
     GV.circle(r, unit)         radius, diameter, center

   Explainers (EX.register, played by js/explain.js; Watch it on Learn cards, Watch how after a miss):
     { id: 'tri-area', b, h, unit, any, a }   why A = ½ × b × h (cut a rectangle corner to corner)
     { id: 'para-area', b, h, o, unit }       why A = b × h (cut and slide into a rectangle)
     { id: 'volume', l, w, h, unit }          rows → layer → stack the layers: V = l × w × h */
(function (w) {
  'use strict';
  const r1 = (x) => Math.round(x * 10) / 10;
  const nf = (x) => String(Math.round(x * 100) / 100);
  const pts = (a) => a.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ');
  const poly = (a, cls, ex) => `<polygon points="${pts(a)}" class="${cls}"${ex ? ' ' + ex : ''}/>`;
  const ln = (a, b, cls, ex) => `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}" class="${cls}"${ex ? ' ' + ex : ''}/>`;
  const tx = (x, y, s, cls, anc, ex) => `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="${anc || 'middle'}" dominant-baseline="middle"${ex ? ' ' + ex : ''}>${s}</text>`;
  const op = (o, inner) => (o <= 0.001 ? '' : o >= 0.999 ? inner : `<g opacity="${o.toFixed(3)}">${inner}</g>`);
  /* right-angle mark at corner c, legs along unit vectors u and v */
  const ra = (c, u, v, k) => { k = k || 11; return `<path class="gv-ra" d="M${r1(c[0] + u[0] * k)} ${r1(c[1] + u[1] * k)} L${r1(c[0] + u[0] * k + v[0] * k)} ${r1(c[1] + u[1] * k + v[1] * k)} L${r1(c[0] + v[0] * k)} ${r1(c[1] + v[1] * k)}"/>`; };
  /* unit-square grid lines inside the rectangle x0,y0 (b × h units of size s) */
  function grid(x0, y0, b, h, s, cls) {
    let g = '';
    for (let i = 1; i < b; i++) g += ln([x0 + i * s, y0], [x0 + i * s, y0 + h * s], cls || 'gv-grid');
    for (let j = 1; j < h; j++) g += ln([x0, y0 + j * s], [x0 + b * s, y0 + j * s], cls || 'gv-grid');
    return g;
  }
  const arrow = (a, b, cls) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, k = 9;
    return ln(a, [b[0] - ux * 4, b[1] - uy * 4], cls || 'gv-arrow') +
      poly([b, [b[0] - ux * k - uy * k * 0.6, b[1] - uy * k + ux * k * 0.6], [b[0] - ux * k + uy * k * 0.6, b[1] - uy * k - ux * k * 0.6]], 'gv-arrowhead');
  };
  const svg = (W, H, inner, label) => `<svg class="gv" viewBox="0 0 ${Math.round(W)} ${Math.round(H)}" width="${Math.round(W)}" style="max-width:100%;height:auto" role="img" aria-label="${label}">${inner}</svg>`;
  const U = (unit) => (unit ? ' ' + unit : '');

  /* isometric projection for a box of l × w × h unit cubes, fitted into maxW × maxH */
  function iso(l, w0, h, maxW, maxH, cap) {
    const c = 0.866, u = Math.min(maxW / ((l + w0) * c), maxH / ((l + w0) * 0.5 + h), cap || 34);
    const ox = w0 * c * u, oy = h * u;
    return { u, W: (l + w0) * c * u, H: ((l + w0) * 0.5 + h) * u, P: (x, y, z) => [ox + (x - y) * c * u, oy + (x + y) * 0.5 * u - z * u] };
  }
  function cube(i, j, k, P, cls) {
    const q = (a) => a.map((p) => P(p[0], p[1], p[2]));
    return `<g class="${cls || 'gv-cube'}">` +
      poly(q([[i, j, k + 1], [i + 1, j, k + 1], [i + 1, j + 1, k + 1], [i, j + 1, k + 1]]), 'gv-ct') +
      poly(q([[i, j + 1, k], [i + 1, j + 1, k], [i + 1, j + 1, k + 1], [i, j + 1, k + 1]]), 'gv-cl') +
      poly(q([[i + 1, j, k], [i + 1, j + 1, k], [i + 1, j + 1, k + 1], [i + 1, j, k + 1]]), 'gv-cr') + '</g>';
  }
  /* cubes in painter order; f(i, j, k) → null (skip) or { cls, dy, o } */
  function cubes(l, w0, h, P, f) {
    const list = [];
    for (let k = 0; k < h; k++) for (let i = 0; i < l; i++) for (let j = 0; j < w0; j++) list.push([i, j, k]);
    list.sort((A, B) => (A[0] + A[1] + A[2]) - (B[0] + B[1] + B[2]) || A[2] - B[2]);
    return list.map(([i, j, k]) => {
      const s = f ? f(i, j, k) : {};
      if (!s) return '';
      const body = cube(i, j, k, P, s.cls);
      const g = s.dy ? `<g transform="translate(0 ${r1(s.dy)})">${body}</g>` : body;
      return op(s.o == null ? 1 : s.o, g);
    }).join('');
  }
  function boxLabels(l, w0, h, P, unit, o) {
    o = o || {};
    let g = '';
    const a = P(l / 2, w0, 0), b = P(l, w0 / 2, 0), c = P(l, 0, h / 2);
    if (o.l !== false) g += tx(a[0] - 10, a[1] + 14, o.l || ('l = ' + l + U(unit)), 'gv-lab', 'end');
    if (o.w !== false) g += tx(b[0] + 10, b[1] + 14, o.w || ('w = ' + w0 + U(unit)), 'gv-lab', 'start');
    if (o.h !== false) g += tx(c[0] + 12, c[1], o.h || ('h = ' + h + U(unit)), 'gv-lab', 'start');
    return g;
  }

  /* ---------- still pictures ---------- */
  const GV = {};
  GV.rtri = function (b, h, unit) {
    const s = Math.min(170 / b, 120 / h, 24), W = b * s, H = h * s, x0 = 70, y0 = 14;
    const A = [x0, y0 + H], B = [x0 + W, y0 + H], C = [x0, y0];
    return svg(W + x0 + 24, H + y0 + 34,
      poly([A, B, C], 'gv-fill') + ra(A, [1, 0], [0, -1]) +
      tx(x0 + W / 2, y0 + H + 18, b + U(unit), 'gv-lab') + tx(x0 - 8, y0 + H / 2, h + U(unit), 'gv-lab', 'end'),
      'Right triangle with legs ' + b + ' and ' + h);
  };
  GV.triHalf = function (b, h, unit) {
    const s = Math.min(190 / b, 120 / h, 24), W = b * s, H = h * s, x0 = 70, y0 = 14;
    const A = [x0, y0 + H], B = [x0 + W, y0 + H], C = [x0, y0], D = [x0 + W, y0];
    const cl = [(A[0] * 2 + B[0]) / 3, (A[1] * 2 + C[1]) / 3 + 0], cu = [(C[0] + D[0] * 2) / 3, (C[1] * 2 + B[1]) / 3];
    return svg(W + x0 + 24, H + y0 + 54,
      poly([C, D, B], 'gv-fill2') + poly([A, B, C], 'gv-fill') + grid(x0, y0, b, h, s) +
      ln(C, B, 'gv-cut') + ra(A, [1, 0], [0, -1]) +
      tx(cl[0], cl[1] + 6, 'half', 'gv-note') + tx(cu[0], cu[1] - 6, 'half', 'gv-note') +
      tx(x0 + W / 2, y0 + H + 18, b + U(unit), 'gv-lab') + tx(x0 - 8, y0 + H / 2, h + U(unit), 'gv-lab', 'end') +
      tx(x0 + W / 2, y0 + H + 42, 'rectangle ' + b + ' × ' + h + ' = ' + (b * h) + ' → triangle = ' + nf(b * h / 2), 'gv-note'),
      'A right triangle is half of a ' + b + ' by ' + h + ' rectangle');
  };
  GV.anyTri = function (b, h, a, unit) {
    const s = Math.min(200 / b, 120 / h, 24), W = b * s, H = h * s, x0 = 30, y0 = 14;
    const A = [x0, y0 + H], B = [x0 + W, y0 + H], T = [x0 + a * s, y0], F = [x0 + a * s, y0 + H];
    return svg(W + x0 + 30, H + y0 + 54,
      poly([A, [x0, y0], T], 'gv-fill2') + poly([T, [x0 + W, y0], B], 'gv-fill2') + poly([A, B, T], 'gv-fill') +
      poly([[x0, y0], [x0 + W, y0], B, A], 'gv-ghost') + ln(T, F, 'gv-alt') + ra(F, [1, 0], [0, -1], 9) +
      tx(F[0] + 8, y0 + H / 2, 'h = ' + h, 'gv-lab c', 'start') + tx(x0 + W / 2, y0 + H + 18, 'b = ' + b + U(unit), 'gv-lab') +
      tx(x0 + W / 2, y0 + H + 42, 'each teal piece = the blue piece next to it', 'gv-note'),
      'Any triangle is half of the rectangle around it');
  };
  GV.para = function (b, h, o, unit) {
    const s = Math.min(200 / (b + o), 110 / h, 24), W = b * s, H = h * s, O = o * s, x0 = 22, y0 = 30, yB = y0 + H;
    const P1 = [x0, yB], P2 = [x0 + W, yB], P3 = [x0 + W + O, y0], P4 = [x0 + O, y0], F = [x0 + O, yB];
    const sl = Math.hypot(o, h), slInt = Math.abs(sl - Math.round(sl)) < 1e-9;
    return svg(W + O + x0 + 40, H + y0 + 54,
      poly([F, P2, P3, P4], 'gv-fill') + poly([P1, F, P4], 'gv-coral') +
      poly([[x0 + W, yB], [x0 + W + O, yB], P3], 'gv-ghostc') +
      poly([P1, P2, P3, P4], 'gv-edgeonly') + ln(P4, F, 'gv-alt') + ra(F, [1, 0], [0, -1], 9) +
      arrow([x0 + O * 0.45, y0 - 12], [x0 + W + O * 0.55, y0 - 12]) +
      tx(F[0] + 8, y0 + H / 2, 'h = ' + h, 'gv-lab c', 'start') +
      (slInt ? tx(x0 + O / 2 - 8, y0 + H / 2, String(Math.round(sl)), 'gv-lab m', 'end') : '') +
      tx(x0 + W / 2, yB + 18, 'b = ' + b + U(unit), 'gv-lab') +
      tx(x0 + (W + O) / 2, yB + 42, 'slide the triangle over → a ' + b + ' × ' + h + ' rectangle', 'gv-note'),
      'Parallelogram: cut the end triangle and slide it to make a rectangle');
  };
  /* after the slide: the b × h rectangle, with the moved triangle still marked */
  GV.paraRect = function (b, h, o, unit) {
    const s = Math.min(200 / b, 110 / h, 24), W = b * s, H = h * s, O = o * s, x0 = 60, y0 = 14, yB = y0 + H;
    return svg(W + x0 + 30, H + y0 + 54,
      `<rect x="${x0}" y="${y0}" width="${r1(W)}" height="${r1(H)}" class="gv-fill"/>` + grid(x0, y0, b, h, s) +
      poly([[x0 + W - O, yB], [x0 + W, yB], [x0 + W, y0]], 'gv-coral') +
      tx(x0 + W / 2, yB + 18, 'b = ' + b + U(unit), 'gv-lab') + tx(x0 - 8, y0 + H / 2, 'h = ' + h, 'gv-lab c', 'end') +
      tx(x0 + W / 2, yB + 42, 'same pieces, now a rectangle: ' + b + ' × ' + h + ' = ' + (b * h), 'gv-note'),
      'After the slide: a ' + b + ' by ' + h + ' rectangle');
  };
  GV.prism = function (l, w0, h, o) {
    o = o || {};
    const I = iso(l, w0, h, 230, 170, 30), pad = 70, top = 14;
    const hl = o.hl === 'top' ? h - 1 : o.hl === 'base' ? 0 : -1;
    const g = cubes(l, w0, h, I.P, (i, j, k) => ({ cls: k === hl ? 'gv-cube hl' : 'gv-cube' }));
    return svg(I.W + pad * 2, I.H + top + 34,
      `<g transform="translate(${pad} ${top})">${g}${boxLabels(l, w0, h, I.P, o.unit)}</g>` +
      (o.note ? tx(pad + I.W / 2, I.H + top + 26, o.note, 'gv-note') : ''),
      'Box ' + l + ' by ' + w0 + ' by ' + h + ' made of unit cubes');
  };
  GV.pav = function () {
    const s = 20, g = [];
    /* perimeter: outline with walking dots */
    const x1 = 22, y1 = 18;
    g.push(poly([[x1, y1], [x1 + 4 * s, y1], [x1 + 4 * s, y1 + 3 * s], [x1, y1 + 3 * s]], 'gv-per'));
    [[x1, y1], [x1 + 4 * s, y1], [x1 + 4 * s, y1 + 3 * s], [x1, y1 + 3 * s]].forEach((p) => g.push(`<circle cx="${p[0]}" cy="${p[1]}" r="4" class="gv-perdot"/>`));
    g.push(tx(x1 + 2 * s, y1 + 3 * s + 22, 'around', 'gv-lab g'), tx(x1 + 2 * s, y1 + 3 * s + 42, 'perimeter · cm', 'gv-note'));
    /* area: covered grid */
    const x2 = 150;
    g.push(`<rect x="${x2}" y="${y1}" width="${4 * s}" height="${3 * s}" class="gv-area"/>` + grid(x2, y1, 4, 3, s, 'gv-areagrid'));
    g.push(tx(x2 + 2 * s, y1 + 3 * s + 22, 'cover', 'gv-lab b'), tx(x2 + 2 * s, y1 + 3 * s + 42, 'area · cm²', 'gv-note'));
    /* volume: filled box */
    const I = iso(2, 2, 2, 90, 70, 20);
    g.push(`<g transform="translate(${282} ${y1 - 6})">` + cubes(2, 2, 2, I.P, () => ({ cls: 'gv-cube vol' })) + '</g>');
    g.push(tx(282 + I.W / 2, y1 + 3 * s + 22, 'fill', 'gv-lab v'), tx(282 + I.W / 2, y1 + 3 * s + 42, 'volume · cm³', 'gv-note'));
    return svg(400, 124, g.join(''), 'Perimeter goes around, area covers, volume fills');
  };
  GV.circle = function (r, unit) {
    const R = 70, cx = 120, cy = 92;
    return svg(260, 190,
      `<circle cx="${cx}" cy="${cy}" r="${R}" class="gv-ring"/>` +
      ln([cx - R, cy], [cx, cy], 'gv-alt') + ln([cx, cy], [cx + R, cy], 'gv-rad') + `<circle cx="${cx}" cy="${cy}" r="4" class="gv-dot"/>` +
      tx(cx + R / 2, cy - 12, 'r = ' + r, 'gv-lab t') + tx(cx - R / 2, cy + 14, 'd = ' + (2 * r), 'gv-lab c') +
      tx(cx, cy + R + 12, 'around = circumference', 'gv-note'),
      'Circle with radius ' + r + ' and diameter ' + (2 * r));
  };
  w.GV = GV;

  /* ---------- explainers ---------- */
  if (!w.EX || !w.EX.register) return;
  const Pm = w.EX.prim;
  const { span, ease, easeOut, lerp, at, pop, shuffle } = Pm;
  const lab = (x, y, s, cls, anc) => tx(x, y, s, 'gv-lab' + (cls ? ' ' + cls : ''), anc);
  const big = (x, y, s, o, cls) => op(o, tx(x, y, s, 'gv-big' + (cls ? ' ' + cls : '')));
  const half = '½';
  const wrongs = (right, cands, unit) => {
    const out = [];
    cands.forEach((c) => { const v = nf(c); if (v !== nf(right) && c > 0 && out.indexOf(v) < 0) out.push(v); });
    for (let k = 1; out.length < 3; k++) { const v = nf(right + k * 2); if (out.indexOf(v) < 0) out.push(v); }
    return out.slice(0, 3).map((v) => v + U(unit));
  };

  /* --- triangle area --- */
  function triExplainer(o) {
    const b = +o.b || 8, h = +o.h || 5, unit = o.sq || 'square units', A = b * h / 2;
    const s = Math.min(230 / b, 140 / h, 26), W = b * s, H = h * s, x0 = 200 - W / 2, y0 = Math.max(34, 112 - H / 2);
    const pA = [x0, y0 + H], pB = [x0 + W, y0 + H], pC = [x0, y0], pD = [x0 + W, y0], ctr = [x0 + W / 2, y0 + H / 2];
    const dims = lab(x0 + W / 2, y0 + H + 16, 'b = ' + b) + lab(x0 - 8, y0 + H / 2, 'h = ' + h, '', 'end');
    const rect = (o2) => op(o2, poly([pC, pD, pB, pA], 'gv-ghost'));
    const scenes = [];
    scenes.push({ dur: 2600, cap: `Start with a rectangle, ${b} by ${h}. It holds ${b} × ${h} = ${b * h} unit squares.`, draw(t) {
      const g = easeOut(span(t, 0, 900)), q = span(t, 700, 1900), p = pop(t, 1800);
      return op(g, `<rect x="${r1(x0)}" y="${r1(y0)}" width="${r1(W)}" height="${r1(H)}" class="gv-fill2"/>`) +
        op(q, grid(x0, y0, b, h, s)) + op(g, dims) + at(200, 14, p.s, p.o, tx(0, 0, b + ' × ' + h + ' = ' + (b * h), 'gv-big b'));
    } });
    scenes.push({ dur: 2600, cap: 'Cut it corner to corner. Now there are two triangles.', draw(t) {
      const c = ease(span(t, 200, 1500)), f = easeOut(span(t, 1400, 2200));
      const end = [lerp(pC[0], pB[0], c), lerp(pC[1], pB[1], c)];
      return `<rect x="${r1(x0)}" y="${r1(y0)}" width="${r1(W)}" height="${r1(H)}" class="gv-fill2"/>` + op(f, poly([pA, pB, pC], 'gv-fill')) +
        grid(x0, y0, b, h, s) + ln(pC, end, 'gv-cut') + dims;
    } });
    scenes.push({ dur: 3600, cap: 'Turn the top triangle around. It lands exactly on the bottom one: the two halves are the same size.', draw(t) {
      const r = ease(span(t, 300, 2000)) * 180, back = ease(span(t, 2700, 3500)) * 180, ang = r - back;
      const lift = Math.sin(Math.PI * ang / 180) * 14;
      return rect(1) + poly([pA, pB, pC], 'gv-fill') + ln(pC, pB, 'gv-cut') + dims +
        `<g transform="translate(0 ${r1(-lift)}) rotate(${r1(ang)} ${r1(ctr[0])} ${r1(ctr[1])})">${poly([pC, pD, pB], 'gv-fill2 solid')}</g>` +
        op(easeOut(span(t, 1900, 2300)) - easeOut(span(t, 2600, 2800)), tx(200, y0 + H + 40, 'a perfect match', 'gv-note'));
    } });
    scenes.push({ dur: 3200, cap: `So one triangle is half of the rectangle: ${b * h} ÷ 2 = ${nf(A)}.`, draw(t) {
      const p = pop(t, 600), q = pop(t, 1600);
      return `<rect x="${r1(x0)}" y="${r1(y0)}" width="${r1(W)}" height="${r1(H)}" class="gv-fill2"/>` + poly([pA, pB, pC], 'gv-fill') + grid(x0, y0, b, h, s) + ln(pC, pB, 'gv-cut') + dims +
        at(200, 14, p.s, p.o, tx(0, 0, b * h + ' ÷ 2 = ' + nf(A), 'gv-big')) +
        at(x0 + W * 0.3, y0 + H * 0.7, q.s, q.o, tx(0, 0, nf(A), 'gv-big t'));
    } });
    if (o.any) {
      const a = Math.max(1, Math.min(b - 1, +o.a || Math.round(b / 3)));
      const T = [x0 + a * s, y0], F = [x0 + a * s, y0 + H];
      scenes.push({ dur: 4200, cap: 'Any triangle works too. The height splits it into two right triangles, and each one is half of its own rectangle.', draw(t) {
        const f1 = easeOut(span(t, 300, 1100)), f2 = easeOut(span(t, 1100, 1900)), f3 = easeOut(span(t, 1900, 2700)), p = pop(t, 2900);
        return poly([pC, pD, pB, pA], 'gv-ghost') + op(f2, poly([pA, pC, T], 'gv-fill2') + poly([T, pD, pB], 'gv-fill2')) +
          poly([pA, pB, T], 'gv-fill') + op(f1, ln(T, F, 'gv-alt')) + op(f3, ln([x0, y0], [x0, y0 + H], 'gv-ghost') + ln(F, T, 'gv-alt')) +
          lab(x0 + W / 2, y0 + H + 16, 'b = ' + b) + op(f1, lab(F[0] + 8, y0 + H / 2, 'h = ' + h, 'c', 'start')) +
          at(200, 14, p.s, p.o, tx(0, 0, 'still half: ' + nf(A), 'gv-big'));
      } });
    }
    scenes.push({ dur: 3000, cap: `The rule: A = ${half} × b × h = ${half} × ${b} × ${h} = ${nf(A)} ${unit}.`, draw(t) {
      const p = pop(t, 200), q = pop(t, 1200);
      return at(200, 70, p.s, p.o, tx(0, 0, 'A = ' + half + ' × b × h', 'gv-big xl')) +
        at(200, 140, q.s, q.o, tx(0, 0, half + ' × ' + b + ' × ' + h + ' = ' + nf(A), 'gv-big t xl'));
    } });
    const wv = o.wrong != null && String(o.wrong).trim() !== '' ? +String(o.wrong).replace(/[^\d.]/g, '') : NaN;
    const trapV = isFinite(wv) && Math.abs(wv - A) > 1e-9 ? wv : b * h;
    scenes.push({ dur: 3000, cap: trapV === b * h ? `Trap: ${b} × ${h} = ${b * h} is the whole rectangle. Don't forget the ${half}.` :
      trapV === b + h ? `Trap: ${b} + ${h} = ${b + h} adds two sides. Area multiplies, then takes half.` : `${nf(trapV)} is not it. Multiply b × h, then take half: ${nf(A)}.`, draw(t) {
      const p = pop(t, 200), st = easeOut(span(t, 900, 1300)), q = pop(t, 1500);
      return at(200, 70, p.s, p.o, tx(0, 0, nf(trapV), 'gv-big c xl')) +
        op(st, ln([150, 70], [250, 70], 'gv-strike')) + at(200, 150, q.s, q.o, tx(0, 0, '✓ ' + nf(A), 'gv-big t xl'));
    } });
    let qb, qh;
    do { qb = 3 + Math.floor(Math.random() * 10); qh = 2 + Math.floor(Math.random() * 9); } while ((qb * qh) % 2 || (qb === b && qh === h));
    const qa = qb * qh / 2;
    return { title: `Why a triangle is ${half} × b × h`, scenes,
      quiz: { q: `Your turn: a right triangle has legs ${qb} and ${qh}. What is its area?`, right: nf(qa), wrong: wrongs(qa, [qb * qh, qb + qh, 2 * (qb + qh), qa + qb]).map((x) => x.trim()),
        yes: `Yes! ${qb} × ${qh} = ${qb * qh}, and half of that is ${nf(qa)}.`, no: `Make the rectangle: ${qb} × ${qh} = ${qb * qh}. The triangle is half: ${nf(qa)}.` } };
  }

  /* --- parallelogram area --- */
  function paraExplainer(o) {
    const b = +o.b || 8, h = +o.h || 4, off = Math.max(1, +o.o || Math.max(1, Math.round(b / 3))), A = b * h;
    const s = Math.min(250 / (b + off), 140 / h, 26), W = b * s, H = h * s, O = off * s, x0 = 200 - (W + O) / 2, y0 = Math.max(34, 112 - H / 2), yB = y0 + H;
    const P1 = [x0, yB], P2 = [x0 + W, yB], P3 = [x0 + W + O, y0], P4 = [x0 + O, y0], F = [x0 + O, yB];
    const sl = Math.hypot(off, h), slS = Math.abs(sl - Math.round(sl)) < 1e-9 ? String(Math.round(sl)) : 'slant';
    const base = lab(x0 + W / 2, yB + 16, 'b = ' + b);
    const scenes = [];
    scenes.push({ dur: 2400, cap: `A parallelogram with base ${b}. Its sides lean over, so it is not a rectangle yet.`, draw(t) {
      const g = easeOut(span(t, 0, 900));
      return op(g, poly([P1, P2, P3, P4], 'gv-fill') + base + lab(x0 + O / 2 - 8, y0 + H / 2, slS, 'm', 'end'));
    } });
    scenes.push({ dur: 3000, cap: 'The height goes straight up from the base, making a square corner. It is not the slanted side.', draw(t) {
      const d = ease(span(t, 200, 1300)), f = easeOut(span(t, 1200, 1700));
      return poly([P1, P2, P3, P4], 'gv-fill') + base + lab(x0 + O / 2 - 8, y0 + H / 2, slS, 'm', 'end') +
        ln(P4, [P4[0], lerp(y0, yB, d)], 'gv-alt') + op(f, ra(F, [1, 0], [0, -1], 9) + lab(F[0] + 8, y0 + H / 2, 'h = ' + h, 'c', 'start'));
    } });
    scenes.push({ dur: 3800, cap: 'Cut off the triangle on the left end and slide it to the right end.', draw(t) {
      const c = easeOut(span(t, 200, 900)), m = ease(span(t, 1100, 3000)) * W;
      return poly([F, P2, P3, P4], 'gv-fill') + op(1 - c * 0.6, poly([P1, F, P4], 'gv-fill')) + op(c, poly([P1, F, P4], 'gv-ghostc')) +
        ln(P4, F, 'gv-alt') + base + lab(F[0] + 8, y0 + H / 2, 'h = ' + h, 'c', 'start') +
        op(c, `<g transform="translate(${r1(m)} 0)">${poly([P1, F, P4], 'gv-coral')}</g>`);
    } });
    scenes.push({ dur: 3200, cap: `Now it is a rectangle, ${b} by ${h}. Nothing was added or lost, so the area is the same: ${b} × ${h} = ${A}.`, draw(t) {
      const g = easeOut(span(t, 300, 1200)), p = pop(t, 1300);
      return `<rect x="${r1(F[0])}" y="${r1(y0)}" width="${r1(W)}" height="${r1(H)}" class="gv-fill"/>` + op(g, grid(F[0], y0, b, h, s)) +
        lab(F[0] + W / 2, yB + 16, 'b = ' + b) + lab(F[0] - 8, y0 + H / 2, 'h = ' + h, 'c', 'end') +
        at(200, 14, p.s, p.o, tx(0, 0, b + ' × ' + h + ' = ' + A, 'gv-big'));
    } });
    scenes.push({ dur: 2600, cap: `The rule: A = b × h. No ${half} here — the ${half} is for triangles.`, draw(t) {
      const p = pop(t, 200), q = pop(t, 1100);
      return at(200, 70, p.s, p.o, tx(0, 0, 'A = b × h', 'gv-big xl')) + at(200, 140, q.s, q.o, tx(0, 0, b + ' × ' + h + ' = ' + A, 'gv-big t xl'));
    } });
    if (slS !== 'slant') {
      scenes.push({ dur: 2800, cap: `Trap: ${b} × ${slS} = ${b * +slS} uses the slanted side. The slant is longer than the height, so that is too big.`, draw(t) {
        const p = pop(t, 200), st = easeOut(span(t, 900, 1300)), q = pop(t, 1500);
        return at(200, 70, p.s, p.o, tx(0, 0, b + ' × ' + slS + ' = ' + (b * +slS), 'gv-big c xl')) + op(st, ln([110, 70], [290, 70], 'gv-strike')) +
          at(200, 150, q.s, q.o, tx(0, 0, '✓ ' + b + ' × ' + h + ' = ' + A, 'gv-big t xl'));
      } });
    }
    let qb, qh; do { qb = 4 + Math.floor(Math.random() * 9); qh = 2 + Math.floor(Math.random() * 8); } while (qb === b && qh === h);
    const qs = qh + 1 + Math.floor(Math.random() * 3);
    return { title: 'Why a parallelogram is b × h', scenes,
      quiz: { q: `Your turn: a parallelogram has base ${qb}, height ${qh} and slanted side ${qs}. What is its area?`, right: String(qb * qh),
        wrong: wrongs(qb * qh, [qb * qs, qb * qh / 2, 2 * (qb + qs)]).map((x) => x.trim()),
        yes: `Yes! Base × height: ${qb} × ${qh} = ${qb * qh}.`, no: `Use the height, not the slanted side: ${qb} × ${qh} = ${qb * qh}.` } };
  }

  /* --- volume --- */
  function volExplainer(o) {
    const l = Math.max(1, Math.min(8, +o.l || 4)), wd = Math.max(1, Math.min(6, +o.w || 3)), h = Math.max(1, Math.min(6, +o.h || 2));
    const B = l * wd, V = B * h, unit = o.unit || '';
    const I = iso(l, wd, h, 250, 165, 30), ox = 200 - I.W / 2, oy = 30;
    const g = (inner) => `<g transform="translate(${r1(ox)} ${r1(oy)})">${inner}</g>`;
    const outline = () => { const P = I.P, q = (a) => a.map((p) => P(p[0], p[1], p[2]));
      return poly(q([[0, 0, h], [l, 0, h], [l, wd, h], [0, wd, h]]), 'gv-ghost') + ln(P(l, wd, 0), P(l, wd, h), 'gv-ghost') + ln(P(0, wd, 0), P(0, wd, h), 'gv-ghost') + ln(P(l, 0, 0), P(l, 0, h), 'gv-ghost'); };
    const scenes = [];
    const rowStep = Math.min(320, 1500 / l);
    scenes.push({ dur: 600 + rowStep * l + 900, cap: `Start with one row along the length: ${l} cube${l > 1 ? 's' : ''}.`, draw(t) {
      const n = Math.min(l, Math.floor(span(t, 300, 300 + rowStep * l) * l + 0.001) + (t > 300 ? 1 : 0));
      return g(outline() + cubes(l, wd, h, I.P, (i, j, k) => (k === 0 && j === wd - 1 && i < n ? { cls: 'gv-cube hl' } : null)) +
        boxLabels(l, wd, h, I.P, unit, { w: false, h: false })) + at(200, 14, 1, n > 0 ? 1 : 0, tx(0, 0, String(n), 'gv-big'));
    } });
    const rStep = Math.min(600, 2400 / wd);
    scenes.push({ dur: 400 + rStep * wd + 1200, cap: `${wd} rows like that cover the bottom: ${l} × ${wd} = ${B} cubes in one layer.`, draw(t) {
      const r = Math.min(wd, 1 + Math.floor(span(t, 300, 300 + rStep * (wd - 1) + 1) * (wd - 1) + 0.001));
      const done = span(t, 300 + rStep * wd, 700 + rStep * wd);
      return g(outline() + cubes(l, wd, h, I.P, (i, j, k) => (k === 0 && j >= wd - r ? { cls: 'gv-cube hl' } : null)) +
        boxLabels(l, wd, h, I.P, unit, { h: false })) + at(200, 14, 1, 1, tx(0, 0, (r < wd ? l * r : B) + (done > 0 ? '  (' + l + ' × ' + wd + ')' : ''), 'gv-big'));
    } });
    const lStep = Math.min(900, 3600 / h);
    scenes.push({ dur: 400 + lStep * h + 1200, cap: `Stack the layers. ${h} layer${h > 1 ? 's' : ''} of ${B}: ${Array.from({ length: h }, (_, k) => B * (k + 1)).join(', ')}.`, draw(t) {
      const tt = Math.max(0, t - 300), L = Math.min(h, 1 + Math.floor(tt / lStep));
      const fr = L > 1 ? easeOut(span(tt - (L - 1) * lStep, 0, lStep * 0.7)) : 1;
      return g(outline() + cubes(l, wd, h, I.P, (i, j, k) => {
        if (k < L - 1 || L === 1 && k === 0) return { cls: 'gv-cube vol' };
        if (k === L - 1) return { cls: 'gv-cube vol', dy: -(1 - fr) * 40, o: fr };
        return null;
      }) + boxLabels(l, wd, h, I.P, unit)) + at(200, 14, 1, 1, tx(0, 0, B * L + (L > 1 ? '  (' + L + ' × ' + B + ')' : ''), 'gv-big v'));
    } });
    scenes.push({ dur: 3200, cap: `The rule: V = l × w × h, or base layer × height. ${l} × ${wd} × ${h} = ${V} cubic units.`, draw(t) {
      const p = pop(t, 200), q = pop(t, 1200);
      return at(200, 60, p.s, p.o, tx(0, 0, 'V = l × w × h = B × h', 'gv-big xl')) +
        at(200, 130, q.s, q.o, tx(0, 0, l + ' × ' + wd + ' × ' + h + ' = ' + V, 'gv-big v xl')) +
        at(200, 190, q.s, q.o, tx(0, 0, B + ' in each layer × ' + h + ' layers', 'gv-note'));
    } });
    const wv = o.wrong != null && String(o.wrong).trim() !== '' ? +String(o.wrong).replace(/[^\d.]/g, '') : NaN;
    const trapV = isFinite(wv) && wv !== V ? wv : l + wd + h;
    scenes.push({ dur: 3000, cap: trapV === l + wd + h ? `Trap: ${l} + ${wd} + ${h} = ${l + wd + h} only adds three edges. Volume counts every cube inside.` :
      trapV === B ? `Trap: ${B} is just the bottom layer. Stack all ${h} layers.` : `${nf(trapV)} is not it. Multiply all three: ${V}.`, draw(t) {
      const p = pop(t, 200), st = easeOut(span(t, 900, 1300)), q = pop(t, 1500);
      return at(200, 70, p.s, p.o, tx(0, 0, nf(trapV), 'gv-big c xl')) + op(st, ln([150, 70], [250, 70], 'gv-strike')) +
        at(200, 150, q.s, q.o, tx(0, 0, '✓ ' + V, 'gv-big v xl'));
    } });
    let a, b2, c; do { a = 2 + Math.floor(Math.random() * 6); b2 = 2 + Math.floor(Math.random() * 4); c = 2 + Math.floor(Math.random() * 5); } while (a === l && b2 === wd && c === h);
    const qv = a * b2 * c;
    return { title: 'Why volume is l × w × h', scenes,
      quiz: { q: `Your turn: a box is ${a} long, ${b2} wide and ${c} tall. How many unit cubes fill it?`, right: String(qv),
        wrong: wrongs(qv, [a + b2 + c, a * b2, a * b2 + c, 2 * (a * b2 + a * c + b2 * c)]).map((x) => x.trim()),
        yes: `Yes! ${a} × ${b2} = ${a * b2} in each layer, × ${c} layers = ${qv}.`, no: `One layer is ${a} × ${b2} = ${a * b2} cubes. ${c} layers: ${a * b2} × ${c} = ${qv}.` } };
  }

  /* pick an explainer from a practice question's text (Watch how after a miss) */
  const plain = (item) => String(item.q || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const N = '(\\d+(?:\\.\\d+)?)';
  function baseHeight(q) {
    let m = new RegExp('legs? (?:of )?' + N + '\\s*[a-z]*\\s*and\\s*' + N, 'i').exec(q);
    if (m) return [+m[1], +m[2]];
    m = new RegExp('base (?:of |is )?' + N + '[\\s\\S]*?height (?:of |is )?' + N, 'i').exec(q);
    if (m) return [+m[1], +m[2]];
    return null;
  }
  w.EX.register('tri-area', {
    build: triExplainer, label: () => 'why a triangle is ½ × b × h', order: 60,
    match(item, ctx) { const q = plain(item); if (!/triangle/i.test(q) || !/area/i.test(q)) return null;
      const bh = baseHeight(q); if (!bh || bh[0] > 20 || bh[1] > 20) return null;
      return { id: 'tri-area', b: bh[0], h: bh[1], any: !/right triangle/i.test(q), wrong: ctx && ctx.answer }; }
  });
  w.EX.register('para-area', {
    build: paraExplainer, label: () => 'why a parallelogram is b × h', order: 61,
    match(item, ctx) { const q = plain(item); if (!/parallelogram/i.test(q) || !/area/i.test(q)) return null;
      const bh = baseHeight(q); if (!bh || bh[0] > 20 || bh[1] > 20) return null;
      return { id: 'para-area', b: bh[0], h: bh[1], wrong: ctx && ctx.answer }; }
  });
  w.EX.register('volume', {
    build: volExplainer, label: () => 'why volume is l × w × h', order: 62,
    match(item, ctx) { const q = plain(item); if (!/volume|cubes? (fill|fit)|how much .* fill/i.test(q)) return null;
      let m = new RegExp(N + '\\s*[a-z]*\\s*long,?\\s*' + N + '\\s*[a-z]*\\s*wide,?\\s*(?:and\\s*)?' + N + '\\s*[a-z]*\\s*(?:tall|high|deep)', 'i').exec(q) ||
        new RegExp(N + '\\s*[a-z]*\\s*(?:by|×)\\s*' + N + '\\s*[a-z]*\\s*(?:by|×)\\s*' + N, 'i').exec(q);
      if (!m) return null; const v = [+m[1], +m[2], +m[3]];
      if (v.some((x) => x !== Math.round(x) || x < 1 || x > 8) || v[0] * v[1] * v[2] > 240) return null;
      return { id: 'volume', l: v[0], w: v[1], h: v[2], wrong: ctx && ctx.answer }; }
  });
  w.EX.geo = { tri: triExplainer, para: paraExplainer, vol: volExplainer };
})(window);
