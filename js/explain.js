/* Motion explainers: short animated scenes that play inside the page (no video files).
   Pattern from the motion-explainers prototype, generalized:
   - EX.player(host, spec) mounts a player. spec = { title, scenes: [{ dur, cap, draw(t) }], quiz }
   - Each scene's draw(t) returns SVG markup for time t (ms). The player redraws every frame.
   - The last step is a tap-to-answer question (checks on tap, no Check button).
   - Explainers are built from parameters, so one explainer covers many fractions:
       EX.build({ id: 'scale100', n: 4, d: 25 })   4/25 → 16/100 → 0.16 → 16%
       EX.build({ id: 'eighths', n: 5 })           1/8 by halving, count by 0.125, 5/8 = 1/2 + 1/8
   - EX.forItem(item, { answer }) picks an explainer for a practice question (used after a miss).
   - EX.register(id, def) adds an explainer; see the registry section and js/explainers/. */
(function (w) {
  'use strict';
  const doc = w.document;
  const reduced = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const SPEEDS = [0.75, 1, 1.5];
  /* Pacing. PACE stretches every scene (1× plays at 1/PACE of the authored speed).
     In Auto mode the player waits on each finished scene long enough to read its caption. */
  const PACE = 1.35;
  const HOLD_MIN = 2200, HOLD_MAX = 6500, MS_PER_WORD = 300;

  /* ---------- tiny math + easing ---------- */
  const clamp = (t, a, b) => Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, t));
  const span = (t, a, b) => clamp((t - a) / Math.max(1, b - a));
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const back = (t) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  /* ---------- HTML + SVG helpers ---------- */
  const fr = (n, d) => (w.V && w.V.fr) ? w.V.fr(n, d) : `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`;
  const r1 = (x) => Math.round(x * 10) / 10;

  /* Group placed at (x, y) with scale s and opacity o. Content is drawn around 0,0. */
  function at(x, y, s, o, inner) {
    if (o <= 0.001) return '';
    return `<g transform="translate(${r1(x)} ${r1(y)}) scale(${Math.max(0.001, s).toFixed(3)})" opacity="${clamp(o).toFixed(3)}">${inner}</g>`;
  }
  /* Stacked fraction centered at 0,0 (bar on the middle line). */
  function sfrac(n, d, fs, cls) {
    const len = Math.max(String(n).length, String(d).length);
    const half = (len * fs * 0.6 + 10) / 2;
    return `<g class="${cls || 'ex-ink'}">` +
      `<text x="0" y="${r1(-fs * 0.18)}" font-size="${fs}" text-anchor="middle" class="ex-num">${n}</text>` +
      `<rect x="${r1(-half)}" y="${r1(-fs * 0.05)}" width="${r1(half * 2)}" height="${r1(Math.max(2, fs * 0.08))}" rx="1.5" class="ex-bar"/>` +
      `<text x="0" y="${r1(fs * 0.86)}" font-size="${fs}" text-anchor="middle" class="ex-num">${d}</text></g>`;
  }
  /* Stacked fraction followed by "= rhs", centered as a unit at 0,0. */
  function feq(n, d, rhs, fs, cls) {
    const fw = Math.max(String(n).length, String(d).length) * fs * 0.6 + 10;
    const rw = String(rhs).length * fs * 0.58;
    const x0 = -(fw + 8 + rw) / 2;
    return `<g class="${cls || 'ex-ink'}"><g transform="translate(${r1(x0 + fw / 2)} ${r1(-fs * 0.2)})">${sfrac(n, d, fs * 0.82, cls)}</g>` +
      `<text x="${r1(x0 + fw + 8)}" y="0" font-size="${fs}" dominant-baseline="middle" class="${cls || 'ex-ink'}">${rhs}</text></g>`;
  }
  function txt(s, fs, cls, anchor) {
    return `<text x="0" y="0" font-size="${fs}" text-anchor="${anchor || 'middle'}" dominant-baseline="middle" class="${cls || 'ex-ink'}">${s}</text>`;
  }
  /* Pop-in helper: returns { s, o } for a pop that starts at a and lasts ms. */
  function pop(t, a, ms) {
    const p = span(t, a, a + (ms || 420));
    return { s: lerp(0.6, 1, back(p)), o: easeOut(p) };
  }
  function dec2(x) { // 0.16, 0.5 → "0.50"? keep what a 5th grader writes: drop trailing zero unless hundredths matter
    let s = (Math.round(x * 1000) / 1000).toString();
    if (s.indexOf('.') < 0) return s;
    return s;
  }

  /* ---------- Explainer: scale to 100 ---------- */
  /* Block shape (rows × cols) of one part inside a 10×10 grid, for each friendly denominator. */
  const BLOCK = { 2: [5, 10], 4: [5, 5], 5: [2, 10], 10: [1, 10], 20: [1, 5], 25: [2, 2], 50: [1, 2], 100: [1, 1] };

  function scale100(n, d) {
    const k = 100 / d;
    const hund = n * k;
    const [bh, bw] = BLOCK[d];
    const perRow = 10 / bw;
    const groupOf = (r, c) => Math.floor(r / bh) * perRow + Math.floor(c / bw);
    const G = { x: 14, y: 14, s: 212 }; // grid box
    const cell = G.s / 10;
    const decStr = dec2(hund / 100);
    const decTwo = (hund / 100).toFixed(2);

    function grid(opts) {
      // opts: filled(g) → 0..1 fill amount for group g; outline (0..1); labels (0..1 per group); dimEmpty
      let out = `<rect x="${G.x - 3}" y="${G.y - 3}" width="${G.s + 6}" height="${G.s + 6}" rx="8" class="ex-frame"/>`;
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const g = groupOf(r, c);
          const f = opts.filled ? opts.filled(g) : 0;
          const x = G.x + c * cell, y = G.y + r * cell;
          out += `<rect x="${r1(x + 0.8)}" y="${r1(y + 0.8)}" width="${r1(cell - 1.6)}" height="${r1(cell - 1.6)}" rx="2" class="${f > 0.5 ? 'ex-on' : 'ex-off'}"/>`;
        }
      }
      const ol = opts.outline == null ? 1 : opts.outline;
      if (ol > 0.01 && d < 100) {
        for (let g = 0; g < d; g++) {
          const br = Math.floor(g / perRow), bc = g % perRow;
          out += `<rect x="${r1(G.x + bc * bw * cell)}" y="${r1(G.y + br * bh * cell)}" width="${r1(bw * cell)}" height="${r1(bh * cell)}" rx="3" class="ex-part" opacity="${ol.toFixed(2)}"/>`;
        }
      }
      if (opts.labels) {
        const fs = Math.min(18, Math.max(10, Math.min(bw, bh) * cell * 0.62));
        for (let g = 0; g < n; g++) {
          const a = opts.labels(g);
          if (a <= 0) continue;
          const br = Math.floor(g / perRow), bc = g % perRow;
          const cx = G.x + (bc + 0.5) * bw * cell, cy = G.y + (br + 0.5) * bh * cell;
          out += at(cx, cy, lerp(0.5, 1, back(a)), a, txt(k, fs, 'ex-onlabel'));
        }
      }
      return out;
    }
    const RX = 318; // right panel center

    const scenes = [
      {
        dur: 3400,
        cap: `${fr(n, d)} means ${n} of ${d} equal parts.`,
        draw(t) {
          const fillT = span(t, 900, 2900);
          const p = pop(t, 200);
          return grid({ filled: (g) => (g < n && fillT * n > g ? 1 : 0), outline: easeOut(span(t, 0, 700)) }) +
            at(RX, 104, p.s, p.o, sfrac(n, d, 54)) +
            at(RX, 190, 1, easeOut(span(t, 1400, 1900)), txt(`${n} of ${d} parts`, 17, 'ex-muted'));
        }
      },
      {
        dur: 600 + n * Math.max(140, Math.min(420, 2600 / n)) + 1200,
        cap: d === 100 ? 'Each part is already one hundredth.' : `Each part is ${k} small square${k > 1 ? 's' : ''}. Count them.`,
        draw(t) {
          const step = Math.max(140, Math.min(420, 2600 / n));
          const shown = clamp((t - 500) / step, 0, n);
          const count = Math.min(n, Math.floor(shown)) * k;
          return grid({ filled: (g) => (g < n ? 1 : 0), outline: 1, labels: (g) => clamp(shown - g) }) +
            at(RX, 70, 1, 1, sfrac(n, d, 40)) +
            at(RX, 136, 1, easeOut(span(t, 300, 700)), txt(`${n} parts × ${k}`, 18, 'ex-muted')) +
            at(RX, 180, 1, easeOut(span(t, 400, 800)), txt(`${count}`, 40, 'ex-big')) +
            at(RX, 214, 1, easeOut(span(t, 400, 800)), txt(`squares`, 15, 'ex-muted'));
        }
      },
      {
        dur: 4200,
        cap: d === 100 ? `It is already out of 100.` : `Multiply the top and the bottom by ${k}.`,
        draw(t) {
          const a = span(t, 500, 1300), b = span(t, 1700, 2700);
          const top = b > 0.5 ? hund : n, bot = b > 0.5 ? 100 : d;
          const flip = b > 0 && b < 1 ? Math.abs(Math.cos(b * Math.PI)) : 1;
          const ex = (s, y) => at(RX, y, lerp(0.6, 1, back(a)), a * (1 - span(t, 2800, 3300)), txt(s, 20, 'ex-coral'));
          return grid({ filled: (g) => (g < n ? 1 : 0), outline: 1 - ease(span(t, 2200, 3200)) }) +
            `<g transform="translate(${RX} 112) scale(1 ${flip.toFixed(3)})">${sfrac(top, bot, 52, b >= 1 ? 'ex-teal' : 'ex-ink')}</g>` +
            (d === 100 ? '' : ex(`× ${k}`, 40) + ex(`× ${k}`, 186)) +
            at(RX, 206, 1, easeOut(span(t, 3000, 3500)), txt(`${hund} of 100 squares`, 16, 'ex-muted'));
        }
      },
      {
        dur: 4400,
        cap: 'Hundredths give the decimal. Per cent means “per 100.”',
        draw(t) {
          const p1 = pop(t, 100), p2 = pop(t, 1100), p3 = pop(t, 2300);
          const glow = 0.5 + 0.5 * Math.sin(t / 260);
          return grid({ filled: (g) => (g < n ? 1 : 0), outline: 0 }) +
            at(RX, 52, p1.s, p1.o, sfrac(hund, 100, 34)) +
            at(RX, 118, p2.s, p2.o, txt(decStr === decTwo ? decStr : `${decTwo} = ${decStr}`, decStr === decTwo ? 36 : 26, 'ex-big')) +
            at(RX, 180, p3.s, p3.o, txt(`${hund}%`, 46, 'ex-teal')) +
            at(RX, 222, 1, span(t, 2900, 3300) * (0.65 + 0.35 * glow), txt(`all the same amount`, 14, 'ex-muted'));
        }
      }
    ];

    // Quiz: a sibling fraction with the same denominator.
    const sibs = [];
    for (let m = 1; m < d; m++) if (m !== n && gcd(m, d) === 1 || (m !== n && d <= 5)) sibs.push(m);
    const near = sibs.filter((x) => x * k <= 99).sort((a, b) => Math.abs(a - n) - Math.abs(b - n)).slice(0, 3);
    const m = near.length ? pick(near) : (sibs.length ? pick(sibs) : n);
    const right = `${m * k}%`;
    const wrongs = [`${m}${d}%`, `${m}%`, `${m * k + k}%`, `${Math.max(1, m * k - k)}%`, `${d * m / 10}%`]
      .filter((x, i, arr) => x !== right && arr.indexOf(x) === i && !/\.\d{2,}/.test(x));
    return {
      title: `${fr(n, d)} → ${hund}%`,
      scenes,
      quiz: {
        q: `Your turn: ${fr(m, d)} is what percent?`,
        right, wrong: wrongs.slice(0, 3),
        yes: `Yes! ${m} × ${k} = ${m * k}, so ${fr(m, d)} = ${fr(m * k, 100)} = ${m * k}%.`,
        no: `Each part is ${k} squares. ${m} parts × ${k} = ${m * k} squares out of 100.`
      }
    };
  }

  /* ---------- Explainer: eighths ---------- */
  const E_DEC = ['0', '0.125', '0.25', '0.375', '0.5', '0.625', '0.75', '0.875', '1'];
  const E_PCT = ['0%', '12.5%', '25%', '37.5%', '50%', '62.5%', '75%', '87.5%', '100%'];
  const TRICK = {
    1: { from: 2, sign: -1, cap: `${fr(1, 8)} is half of ${fr(1, 4)}.`, line: 'half of 0.25 = 0.125' },
    2: { simp: [1, 4] }, 4: { simp: [1, 2] }, 6: { simp: [3, 4] },
    3: { from: 2, sign: 1, cap: `${fr(3, 8)} = ${fr(1, 4)} + ${fr(1, 8)}`, line: '0.25 + 0.125 = 0.375' },
    5: { from: 4, sign: 1, cap: `${fr(5, 8)} = ${fr(1, 2)} + ${fr(1, 8)}`, line: '0.5 + 0.125 = 0.625' },
    7: { from: 8, sign: -1, cap: `${fr(7, 8)} = 1 − ${fr(1, 8)}`, line: '1 − 0.125 = 0.875' }
  };

  function eighths(n) {
    const B = { x: 20, y: 16, w: 360, h: 40 }; // bar
    const L = { x: 20, y: 176, w: 360 };       // number line
    const px = (i) => L.x + (L.w * i) / 8;

    function bar(cuts, hi, labels) {
      // cuts: array of { at: fraction 0..1, a: 0..1 }, hi: [from,to,amount], labels: [{x, y, html, o}]
      let out = `<rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="8" class="ex-off ex-barbox"/>`;
      if (hi && hi[2] > 0) out += `<rect x="${r1(B.x + B.w * hi[0])}" y="${B.y}" width="${r1(B.w * (hi[1] - hi[0]) * hi[2])}" height="${B.h}" rx="8" class="ex-on"/>`;
      cuts.forEach((c) => {
        if (c.a <= 0) return;
        const x = B.x + B.w * c.at;
        out += `<line x1="${r1(x)}" x2="${r1(x)}" y1="${r1(B.y + B.h / 2 - (B.h / 2) * c.a)}" y2="${r1(B.y + B.h / 2 + (B.h / 2) * c.a)}" class="ex-cut"/>`;
      });
      return out;
    }
    function nline(t, o) {
      o = o || {};
      let out = `<line x1="${L.x}" x2="${L.x + L.w}" y1="${L.y}" y2="${L.y}" class="ex-axis"/>`;
      for (let i = 0; i <= 8; i++) {
        const show = o.ticks ? o.ticks(i) : 1;
        const anchor = i === 0 || i === 2 || i === 4 || i === 6 || i === 8;
        out += `<line x1="${r1(px(i))}" x2="${r1(px(i))}" y1="${L.y - (anchor ? 10 : 7)}" y2="${L.y + (anchor ? 10 : 7)}" class="ex-axis"/>`;
        if (show > 0 && o.dec) out += at(px(i), L.y + 24, 1, show, txt(E_DEC[i], i === 0 || i === 8 ? 15 : 13, anchor ? 'ex-blue' : 'ex-mono'));
        if (show > 0 && o.fr && i > 0 && i < 8) out += at(px(i), L.y - 56, 1, show, sfrac(i, 8, 13, anchor ? 'ex-blue' : 'ex-ink'));
      }
      return out;
    }
    function hop(i0, i1, p, cls) { // arc from tick i0 toward i1, drawn p of the way
      if (p <= 0) return '';
      const x0 = px(i0), x1 = px(i1), y = L.y - 4;
      const steps = 14, pts = [];
      for (let s = 0; s <= steps * p; s++) {
        const u = s / steps;
        pts.push(`${r1(lerp(x0, x1, u))},${r1(y - Math.sin(u * Math.PI) * 22)}`);
      }
      return `<polyline points="${pts.join(' ')}" class="${cls || 'ex-hop'}"/>`;
    }
    const dot = (i, s, cls) => at(px(i), L.y, s, 1, `<circle r="8" class="${cls || 'ex-dot'}"/>`);

    const tr = TRICK[n];
    const scenes = [
      {
        dur: 4800,
        cap: `Cut in half, then in half again, then once more.`,
        draw(t) {
          const c1 = ease(span(t, 300, 900)), c2 = ease(span(t, 1500, 2100)), c3 = ease(span(t, 2700, 3300));
          const hi = t < 1500 ? [0, 0.5, c1] : t < 2700 ? [0, 0.25 + 0.25 * (1 - c2), 1] : [0, 0.125 + 0.125 * (1 - c3), 1];
          const lab = (y, a, d, rhs, fs, cls) => at(200, y, 1, a, feq(1, d, rhs, fs, cls));
          return bar([{ at: 0.5, a: c1 }, { at: 0.25, a: c2 }, { at: 0.125, a: c3 }], hi) +
            lab(92, c1 * (1 - c2 * 0.55), 2, '= 0.5', 18) +
            lab(132, c2 * (1 - c3 * 0.55), 4, '= 0.25', 18) +
            at(200, 180, pop(t, 3300).s, pop(t, 3300).o, feq(1, 8, '= 0.125', 28, 'ex-teal')) +
            at(200, 224, 1, easeOut(span(t, 3700, 4200)), txt('half of 0.25 is 0.125', 15, 'ex-muted'));
        }
      },
      {
        dur: 6000,
        cap: `Count up by 0.125. You already know ${fr(1, 4)}, ${fr(1, 2)}, and ${fr(3, 4)}.`,
        draw(t) {
          const per = 560;
          const k = clamp((t - 300) / per, 0, 8);
          let hops = '';
          for (let i = 0; i < 8; i++) hops += hop(i, i + 1, clamp(k - i), 'ex-hop');
          const now = Math.min(8, Math.ceil(k));
          return bar(Array.from({ length: 7 }, (_, i) => ({ at: (i + 1) / 8, a: 1 })), [0, Math.min(1, k / 8), 1]) +
            nline(t, { dec: true, fr: true, ticks: (i) => clamp(k - i + 1) }) + hops +
            (k > 0 ? dot(Math.max(0, Math.floor(k)), 1) : '') +
            at(200, 84, 1, span(t, 300, 600) * (now ? 1 : 0), txt(now ? `${now} × 0.125 = ${E_DEC[now]}` : '', 18, 'ex-ink'));
        }
      }
    ];

    if (tr && tr.simp) {
      const [a, b] = tr.simp;
      scenes.push({
        dur: 3800,
        cap: `${fr(n, 8)} simplifies to ${fr(a, b)}, a friend you know.`,
        draw(t) {
          const p = pop(t, 1400);
          return bar(Array.from({ length: 7 }, (_, i) => ({ at: (i + 1) / 8, a: 1 - ease(span(t, 600, 1300)) * (((i + 1) % (8 / b)) ? 1 : 0) })), [0, n / 8, 1]) +
            nline(t, { dec: true }) + dot(n, pop(t, 200).s, 'ex-dot-big') +
            at(150, 98, 1, 1, sfrac(n, 8, 28)) + at(200, 98, 1, easeOut(span(t, 900, 1300)), txt('=', 26, 'ex-muted')) +
            at(250, 98, p.s, p.o, sfrac(a, b, 28, 'ex-teal')) +
            at(300, 98, 1, easeOut(span(t, 2200, 2700)), txt(`= ${E_DEC[n]}`, 20, 'ex-teal', 'start'));
        }
      });
    } else if (tr) {
      scenes.push({
        dur: 5200,
        cap: tr.cap,
        draw(t) {
          const anchorP = pop(t, 200);
          const h = ease(span(t, 1300, 2400));
          const land = pop(t, 2400);
          const step = (i, a) => at(200, 96, 1, a, txt(tr.line, 22, 'ex-ink'));
          return bar(Array.from({ length: 7 }, (_, i) => ({ at: (i + 1) / 8, a: 1 })), [0, n / 8, span(t, 2400, 2900)]) +
            nline(t, { dec: true }) +
            dot(tr.from, anchorP.s, 'ex-dot-anchor') +
            (tr.sign > 0 ? hop(tr.from, tr.from + 1, h, 'ex-hop-big') : hop(tr.from, tr.from - 1, h, 'ex-hop-big')) +
            (t > 2400 ? dot(n, land.s, 'ex-dot-big') : '') +
            step(0, easeOut(span(t, 2700, 3300))) +
            at(px(tr.from), L.y + 50, 1, anchorP.o * (1 - span(t, 2400, 2800)), txt('you know this one', 13, 'ex-blue'));
        }
      });
    }

    scenes.push({
      dur: 3800,
      cap: `As a percent, eighths keep the half: 12.5%, 37.5%, 62.5%, 87.5%.`,
      draw(t) {
        const p1 = pop(t, 100), p2 = pop(t, 900), p3 = pop(t, 1700);
        return at(92, 112, p1.s, p1.o, sfrac(n, 8, 56)) +
          at(170, 112, 1, p2.o, txt('=', 34, 'ex-muted')) +
          at(250, 112, p2.s, p2.o, txt(E_DEC[n], 38, 'ex-big')) +
          at(200, 196, p3.s, p3.o, txt(`= ${E_PCT[n]}`, 40, 'ex-teal'));
      }
    });

    const pool = [1, 3, 5, 7].filter((x) => x !== n);
    const m = pick(pool);
    const right = E_DEC[m];
    const wrongs = shuffle([`0.${m}`, `0.${m}8`, E_DEC[m + 1 > 7 ? m - 1 : m + 1], (m / 10).toString(), `0.${m}5`])
      .filter((x, i, a) => x !== right && a.indexOf(x) === i);
    const how = TRICK[m];
    return {
      title: `${fr(n, 8)} = ${E_DEC[n]}`,
      scenes,
      quiz: {
        q: `Your turn: what decimal is ${fr(m, 8)}?`,
        right, wrong: wrongs.slice(0, 3),
        yes: `Yes! ${how.line}.`,
        no: `${how.cap}: ${how.line}.`
      }
    };
  }

  /* ---------- registry (the explainer engine) ----------
     Every explainer registers itself:
       EX.register(id, {
         build(o)        → spec { title, scenes, quiz }   (required)
         label(o)        → short HTML label for Watch buttons
         match(item, ctx)→ o or null: pick this explainer for a practice item (used after a miss)
         order           → lower runs first when several matchers could fit (default 50)
       })
     New explainers live in js/explainers/<name>.js, load after this file, and use EX.prim
     (shared drawing + timing helpers). Items can also pick an explainer directly:
       item.watch = { id: 'round', x: '3.062', p: 1 }            fixed
       item.watch = (ctx) => ({ id: 'round', x, p, wrong: ctx.answer })   uses the student's wrong answer
       item.watch = false                                         never offer one */
  const REG = {};
  function register(id, def) {
    if (!id || !def || typeof def.build !== 'function') return;
    REG[id] = Object.assign({ order: 50 }, def, { id: id });
  }
  function build(o) {
    if (!o || !REG[o.id]) return null;
    try { return REG[o.id].build(o); } catch (e) { if (w.console) console.warn('EX build failed', o, e); return null; }
  }
  function label(o) {
    if (!o || !REG[o.id] || !REG[o.id].label) return '';
    try { return REG[o.id].label(o); } catch (e) { return ''; }
  }
  /* Pick an explainer for a practice item. ctx.answer = the student's wrong answer (text), when known. */
  function forItem(item, ctx) {
    ctx = ctx || {};
    if (!item || item.watch === false) return null;
    if (typeof item.watch === 'function') { try { return item.watch(ctx) || null; } catch (e) { return null; } }
    if (item.watch) return item.watch;
    const list = Object.keys(REG).map((k) => REG[k]).filter((r) => r.match).sort((a, b) => a.order - b.order);
    for (let i = 0; i < list.length; i++) {
      try { const o = list[i].match(item, ctx); if (o) return o; } catch (e) {}
    }
    return null;
  }

  /* Built-in explainers: fraction → decimal → percent. */
  register('scale100', {
    build: (o) => scale100(o.n, o.d),
    label: (o) => `${fr(o.n, o.d)} → ${o.n * 100 / o.d}%`,
    order: 80,
    match: matchFraction
  });
  register('eighths', {
    build: (o) => eighths(o.n),
    label: (o) => `${fr(o.n, 8)} → ${E_DEC[o.n]}`
  });
  /* Fraction matcher: the first stacked fraction in the question decides; if the question has none,
     the first one in the explanation. Answer choices are ignored, so a wrong option never picks the explainer. */
  function matchFraction(item) {
      const re = /<span class="n">\s*(\d+)\s*<\/span>\s*<span class="d">\s*(\d+)\s*<\/span>/;
      const mt = re.exec(String(item.q || '')) || re.exec(String(item.why || ''));
      if (!mt) return null;
      let n = +mt[1], d = +mt[2];
      if (!(n > 0 && n < d)) return null;
      if (d === 8) return { id: 'eighths', n };
      const g = gcd(n, d); n /= g; d /= g;
      if (d === 8) return { id: 'eighths', n };
      if (BLOCK[d] && d !== 100 && d !== 10) return { id: 'scale100', n, d };
      return null;
  }

  /* ---------- player ---------- */
  function readMode() { try { return localStorage.getItem('ex-mode') === 'auto' ? 'auto' : 'step'; } catch (e) { return 'step'; } }
  function saveMode(v) { try { localStorage.setItem('ex-mode', v); } catch (e) {} }
  function readSpeed() { try { const v = +localStorage.getItem('ex-speed'); return SPEEDS.indexOf(v) >= 0 ? v : 1; } catch (e) { return 1; } }
  function saveSpeed(v) { try { localStorage.setItem('ex-speed', String(v)); } catch (e) {} }

  function player(host, spec, opts) {
    opts = opts || {};
    if (!spec) return null;
    const root = doc.createElement('div');
    root.className = 'ex';
    root.innerHTML =
      `<div class="ex-top"><span class="ex-title"></span><span class="ex-dots" role="tablist" aria-label="Scenes"></span></div>` +
      `<div class="ex-mode" role="group" aria-label="How scenes advance">` +
        `<button type="button" class="ex-mode-b" data-m="step" title="Each scene plays once, then waits for Next">👣 Step</button>` +
        `<button type="button" class="ex-mode-b" data-m="auto" title="Plays every scene, with a pause to read each one">⏩ Auto</button>` +
      `</div>` +
      `<div class="ex-stage"><svg viewBox="0 0 400 240" role="img" aria-label="Animated explainer" preserveAspectRatio="xMidYMid meet"></svg></div>` +
      `<p class="ex-cap" aria-live="polite"></p>` +
      `<div class="ex-quiz" hidden></div>` +
      `<div class="ex-ctl">` +
        `<button type="button" class="btn ex-b" data-k="back" aria-label="Back">«<span class="ex-w"> Back</span></button>` +
        `<button type="button" class="btn ex-b ex-play" data-k="play" aria-label="Pause">❚❚<span class="ex-w"> Pause</span></button>` +
        `<button type="button" class="btn ex-b" data-k="next" aria-label="Next"><span class="ex-w">Next </span>»</button>` +
        `<button type="button" class="btn ex-b" data-k="replay" aria-label="Replay this scene">↺<span class="ex-w"> Replay</span></button>` +
        `<button type="button" class="btn ex-b ex-speed" data-k="speed" aria-label="Speed"></button>` +
      `</div>`;
    host.appendChild(root);
    const $ = (s) => root.querySelector(s);
    const svg = $('svg'), cap = $('.ex-cap'), dots = $('.ex-dots'), quizEl = $('.ex-quiz');
    const btnPlay = $('[data-k="play"]'), btnSpeed = $('[data-k="speed"]');
    $('.ex-title').innerHTML = spec.title || '';
    const N = spec.scenes.length + (spec.quiz ? 1 : 0);
    for (let i = 0; i < N; i++) {
      const b = doc.createElement('button');
      b.type = 'button'; b.className = 'ex-dot-btn'; b.setAttribute('aria-label', (i === N - 1 && spec.quiz) ? 'Your turn' : 'Scene ' + (i + 1));
      b.addEventListener('click', () => go(i));
      dots.appendChild(b);
    }
    const st = { i: 0, t: 0, playing: true, speed: readSpeed(), mode: readMode(), last: 0, raf: 0, drawn: -1, ended: false };

    function isQuiz(i) { return spec.quiz && i === spec.scenes.length; }
    function dur(i) { return reduced ? 1 : spec.scenes[i].dur * PACE; }
    /* Auto mode: time to read the caption after the animation ends (real ms, not scaled by speed). */
    function hold(i) {
      const words = String(spec.scenes[i].cap || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
      return clamp(words * MS_PER_WORD, HOLD_MIN, HOLD_MAX);
    }
    function paintControls() {
      const fwd = st.ended && !isQuiz(st.i);   // scene finished: Play moves on instead of replaying
      btnPlay.innerHTML = st.playing ? '❚❚<span class="ex-w"> Pause</span>' : fwd ? '▶<span class="ex-w"> Next</span>' : '▶<span class="ex-w"> Play</span>';
      btnPlay.setAttribute('aria-label', st.playing ? 'Pause' : fwd ? 'Next scene' : 'Play');
      $('[data-k="next"]').classList.toggle('ex-wait', st.ended && !st.playing && st.i < N - 1);
      root.querySelectorAll('.ex-mode-b').forEach((b) => { const on = b.dataset.m === st.mode; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      btnSpeed.textContent = st.speed + '×';
      btnSpeed.setAttribute('aria-label', 'Speed, ' + st.speed + ' times');
      Array.from(dots.children).forEach((b, k) => { b.classList.toggle('on', k === st.i); b.classList.toggle('seen', k < st.i); });
      $('[data-k="back"]').disabled = st.i === 0;
      $('[data-k="next"]').disabled = st.i >= N - 1;
      btnPlay.disabled = isQuiz(st.i);
    }
    function frame() {
      if (isQuiz(st.i)) return;
      const sc = spec.scenes[st.i];
      const t = reduced ? sc.dur : Math.min(st.t / PACE, sc.dur);
      svg.innerHTML = sc.draw(t);
      if (st.drawn !== st.i) {
        cap.innerHTML = sc.cap;
        st.drawn = st.i;
      }
    }
    function showQuiz() {
      const q = spec.quiz;
      cap.innerHTML = q.q;
      st.drawn = st.i;
      // keep last scene's final frame on the stage
      const last = spec.scenes[spec.scenes.length - 1];
      svg.innerHTML = last.draw(last.dur);
      quizEl.hidden = false;
      quizEl.innerHTML = '';
      const row = doc.createElement('div'); row.className = 'ex-opts';
      const fb = doc.createElement('p'); fb.className = 'ex-fb';
      shuffle([q.right].concat(q.wrong)).forEach((c) => {
        const b = doc.createElement('button');
        b.type = 'button'; b.className = 'btn ex-opt'; b.innerHTML = c;
        b.addEventListener('click', () => {
          if (b.disabled) return;
          const ok = c === q.right;
          if (ok) {
            row.querySelectorAll('button').forEach((x) => { x.disabled = true; });
            b.classList.add('right');
            fb.className = 'ex-fb ok'; fb.innerHTML = '✅ ' + q.yes;
            if (opts.onDone) opts.onDone(true);
          } else {
            b.disabled = true; b.classList.add('wrong');
            fb.className = 'ex-fb no'; fb.innerHTML = '💡 ' + q.no;
          }
        });
        row.appendChild(b);
      });
      quizEl.appendChild(row); quizEl.appendChild(fb);
    }
    function go(i) {
      st.i = clamp(i, 0, N - 1); st.t = 0; st.drawn = -1; st.ended = false; st.wait = 0;
      quizEl.hidden = true;
      if (isQuiz(st.i)) { st.playing = false; showQuiz(); }
      else { st.playing = true; frame(); }
      paintControls();
      kick();
    }
    function tick(now) {
      st.raf = 0;
      if (!root.isConnected) return;
      const dt = st.last ? Math.min(64, now - st.last) : 16;
      st.last = now;
      if (st.playing && !isQuiz(st.i)) {
        if (!st.ended) {
          st.t += dt * st.speed;
          frame();
          if (st.t >= dur(st.i)) {
            st.ended = true;
            if (st.mode === 'step') { st.playing = false; paintControls(); return; }   // wait for Next
          }
        } else {
          st.wait += dt;                                   // Auto: pause to read, then move on
          if (st.wait >= hold(st.i)) { go(st.i + 1); return; }
        }
      }
      if (st.playing) st.raf = w.requestAnimationFrame(tick);
    }
    function kick() { st.last = 0; if (!st.raf && st.playing) st.raf = w.requestAnimationFrame(tick); }

    root.querySelector('.ex-ctl').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      const k = b.dataset.k;
      if (k === 'play') {
        if (!st.playing && st.ended) { go(st.i + 1); return; }   // finished scene: go forward, never replay
        st.playing = !st.playing; paintControls(); kick();
      }
      else if (k === 'back') go(st.i - 1);
      else if (k === 'next') go(st.i + 1);
      else if (k === 'replay') go(st.i);
      else if (k === 'speed') { st.speed = SPEEDS[(SPEEDS.indexOf(st.speed) + 1) % SPEEDS.length]; saveSpeed(st.speed); paintControls(); }
    });
    root.querySelector('.ex-mode').addEventListener('click', (e) => {
      const b = e.target.closest('.ex-mode-b'); if (!b) return;
      st.mode = b.dataset.m; saveMode(st.mode);
      if (st.mode === 'auto' && st.ended && !st.playing && !isQuiz(st.i)) { st.playing = true; st.wait = 0; kick(); }
      paintControls();
    });
    doc.addEventListener('visibilitychange', () => { if (doc.hidden && st.playing) { st.playing = false; paintControls(); } });

    /* Test hook: jump to scene i at time t (ms) and hold there. */
    root.exSeek = (i, t) => { go(i); if (!isQuiz(st.i)) { st.playing = false; st.t = t * PACE; frame(); paintControls(); } };
    root.exState = () => ({ i: st.i, t: st.t, playing: st.playing, ended: st.ended, mode: st.mode });
    go(0);
    if (opts.scroll) requestAnimationFrame(() => { try { root.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} });
    return root;
  }

  /* A compact "Watch" button that opens the player in place (toggle). */
  function watchButton(o, opts) {
    opts = opts || {};
    const wrap = doc.createElement('div');
    wrap.className = 'ex-watch' + (opts.cls ? ' ' + opts.cls : '');
    const b = doc.createElement('button');
    b.type = 'button';
    b.className = 'btn ex-watch-btn';
    const lab = opts.text || ('▶ Watch: ' + label(o));
    b.innerHTML = lab + (opts.secs !== false ? ' <span class="ex-secs">· about 30 sec</span>' : '');
    let box = null;
    b.addEventListener('click', () => {
      if (box) { box.remove(); box = null; b.innerHTML = lab + (opts.secs !== false ? ' <span class="ex-secs">· about 30 sec</span>' : ''); return; }
      box = doc.createElement('div');
      wrap.appendChild(box);
      player(box, build(o), { scroll: true });
      b.textContent = '✕ Close';
    });
    wrap.appendChild(b);
    return wrap;
  }

  /* Shared helpers for explainer files (js/explainers/*.js). */
  const prim = { clamp, span, ease, easeOut, back, lerp, gcd, shuffle, pick, fr, r1, at, sfrac, feq, txt, pop, reduced };
  w.EX = { build, player, watchButton, forItem, label, register, prim, list: () => Object.keys(REG), _scale100: scale100, _eighths: eighths };
})(window);
