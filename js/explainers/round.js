/* Explainer: round a decimal to the nearest whole number, tenth, or hundredth.
   EX.build({ id: 'round', x: '3.062', p: 1 })            p: 0 whole, 1 tenth, 2 hundredth
   EX.build({ id: 'round', x: '25.351', p: 1, wrong: '25.0' })   wrong = the student's answer (optional)

   Scenes are assembled from the number itself, so one builder covers every case:
     find the place + the decider digit → keep or bump? → zoom number line with halfway mark
     → the rule → [9 rollover] → [don't round twice] → [trap: why the tempting answer is wrong]
     → final answer with leftover digits gone (and a needed zero kept) → your turn.
   All math is done in whole thousandths, so there are no floating-point surprises. */
(function (w) {
  'use strict';
  if (!w.EX || !w.EX.register) return;
  const P = w.EX.prim;
  const { span, ease, easeOut, lerp, at, txt, pop, shuffle, pick } = P;
  const r1 = P.r1;

  const PLACE = ['whole number', 'tenth', 'hundredth'];
  const PLACE_DIGIT = ['ones', 'tenths', 'hundredths'];
  const DEC_NAME = ['tenths', 'hundredths', 'thousandths'];

  /* ---------- number helpers (thousandths) ---------- */
  function toK(x) { return Math.round(parseFloat(String(x).replace(/[^\d.\-]/g, '')) * 1000); }
  function decimalsOf(x) { const s = String(x); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; }
  function fmt(K, places) { return (K / 1000).toFixed(places); }
  /* Show x with at least `min` decimals (pads with zeros so the decider digit is visible). */
  function show(x, min) { const K = toK(x); return fmt(K, Math.max(min, Math.min(3, decimalsOf(x)))); }
  function roundK(K, p) {
    const u = Math.pow(10, 3 - p);
    const D = Math.floor(K / u) * u, U = D + u;
    const dec = Math.floor((K - D) / (u / 10));
    return { u, D, U, dec, up: dec >= 5, ans: dec >= 5 ? U : D };
  }
  function rounded(x, p) { const K = toK(x); return fmt(roundK(K, p).ans, p); }
  /* Rounding twice (to the next place first, then to p) — the classic mistake. */
  function chainK(K, p) {
    let k = K;
    for (let q = Math.min(2, decimalsOf(fmt(K, 3).replace(/0+$/, '')) - 1); q >= p; q--) k = roundK(k, q).ans;
    return k;
  }
  function info(x, p) {
    const K = toK(x);
    const R = roundK(K, p);
    const s = show(x, p + 1);
    const dot = s.indexOf('.');
    const tIdx = p === 0 ? dot - 1 : dot + p;          // index of the rounding-place digit in s
    const dIdx = p === 0 ? dot + 1 : tIdx + 1;          // index of the decider digit
    const tDigit = +s[tIdx];
    const roll = R.up && tDigit === 9;
    const ch = chainK(K, p);
    return Object.assign(R, { K, s, dot, tIdx, dIdx, tDigit, roll, chain: ch !== R.ans && decimalsOf(s) >= p + 2 ? ch : null,
      ansS: fmt(R.ans, p), DS: fmt(R.D, p), US: fmt(R.U, p), halfS: fmt(R.D + R.u / 2, p + 1) });
  }

  /* Pick the tempting wrong answer to show in the trap scene. */
  function trapFor(I, p, wrong) {
    if (wrong != null && String(wrong).trim() !== '') {
      const wk = toK(wrong);
      if (isFinite(wk) && wk !== I.ans) return { kind: 'answer', K: wk, S: String(wrong).trim() };
    }
    if (I.roll && p > 0) {
      const S = I.DS.slice(0, -1) + '10';
      return { kind: 'roll10', K: toK(S), S };
    }
    if (I.chain != null) return null;   // the "don't round twice" scene is the trap
    if (p === 1) {
      const dz = Math.floor(I.K / 1000) * 1000;
      if (dz !== I.ans) return { kind: 'dotzero', K: dz, S: fmt(dz, 1) };
    }
    if (p === 0) {
      const tens = Math.round(I.K / 10000) * 10000;
      if (tens !== I.ans && I.K >= 10000) return { kind: 'tens', K: tens, S: fmt(tens, 0) };
    }
    if (I.up) return { kind: 'chop', K: I.D, S: I.DS };
    return null;
  }

  /* ---------- drawing ---------- */
  /* Digit row centered at (cx, cy). hl: { t: 0..1 target glow, d: 0..1 decider ring, dim: 0..1 dim right of decider,
     cut: 0..1 fade digits right of the rounding place } */
  function digitRow(s, cx, cy, size, I, hl) {
    hl = hl || {};
    const n = s.length;
    const cw = size, dw = size * 0.45;
    const widths = s.split('').map((c) => (c === '.' ? dw : cw));
    const total = widths.reduce((a, b) => a + b, 0);
    let x = cx - total / 2;
    let out = '';
    for (let i = 0; i < n; i++) {
      const c = s[i], wdt = widths[i], mx = x + wdt / 2;
      x += wdt;
      if (c === '.') { out += at(mx, cy, 1, 1, txt('.', size * 0.95, 'ex-big')); continue; }
      let o = 1;
      if (I && i > I.dIdx) o = 1 - 0.65 * (hl.dim || 0);
      if (I && i > I.tIdx && hl.cut) o *= 1 - hl.cut;
      const isT = I && i === I.tIdx, isD = I && i === I.dIdx;
      let box = `<rect x="${r1(-cw / 2 + 2)}" y="${r1(-size * 0.62)}" width="${r1(cw - 4)}" height="${r1(size * 1.24)}" rx="7" class="ex-dbox"/>`;
      if (isT && hl.t > 0) box += `<rect x="${r1(-cw / 2 + 2)}" y="${r1(-size * 0.62)}" width="${r1(cw - 4)}" height="${r1(size * 1.24)}" rx="7" class="ex-tgt" opacity="${hl.t.toFixed(2)}"/>`;
      if (isD && hl.d > 0) box += `<rect x="${r1(-cw / 2 + 2)}" y="${r1(-size * 0.62)}" width="${r1(cw - 4)}" height="${r1(size * 1.24)}" rx="7" class="ex-decider" opacity="${hl.d.toFixed(2)}"/>`;
      out += at(mx, cy, 1, o, box + txt(c, size * 0.78, isT && hl.t > 0.5 ? 'ex-teal ex-digit' : 'ex-big'));
    }
    return out;
  }
  /* x position of digit i in a row (same layout as digitRow). */
  function digitX(s, cx, size, i) {
    const cw = size, dw = size * 0.45;
    let x = cx - s.split('').reduce((a, c) => a + (c === '.' ? dw : cw), 0) / 2;
    for (let k = 0; k < i; k++) x += s[k] === '.' ? dw : cw;
    return x + (s[i] === '.' ? dw : cw) / 2;
  }
  function card(label, value, cls, on) {
    const wdt = Math.max(84, String(value).length * 15 + 26);
    return `<rect x="${r1(-wdt / 2)}" y="-24" width="${r1(wdt)}" height="48" rx="10" class="${on ? 'ex-card-on' : 'ex-card'}"/>` +
      `<text x="0" y="-34" font-size="12" text-anchor="middle" class="ex-muted">${label}</text>` +
      `<text x="0" y="1" font-size="24" text-anchor="middle" dominant-baseline="middle" class="${cls || 'ex-big'}">${value}</text>`;
  }
  /* Zoomed number line from D to U with 10 ticks and a halfway mark. */
  const NL = { x0: 44, x1: 356, y: 176 };
  function zoomLine(I, p, o) {
    o = o || {};
    const X = (k) => lerp(NL.x0, NL.x1, (k - I.D) / I.u);
    let out = `<line x1="${NL.x0}" x2="${NL.x1}" y1="${NL.y}" y2="${NL.y}" class="ex-axis"/>`;
    for (let i = 0; i <= 10; i++) {
      const big = i === 0 || i === 10, half = i === 5;
      const xx = lerp(NL.x0, NL.x1, i / 10);
      const hgt = big ? 12 : half ? 14 : 6;
      out += `<line x1="${r1(xx)}" x2="${r1(xx)}" y1="${NL.y - hgt}" y2="${NL.y + hgt}" class="${half ? 'ex-half' : 'ex-axis'}"${half ? ` opacity="${(o.half == null ? 1 : o.half).toFixed(2)}"` : ''}/>`;
    }
    out += at(NL.x0, NL.y + 28, 1, 1, txt(I.DS, 17, 'ex-big'));
    out += at(NL.x1, NL.y + 28, 1, 1, txt(I.US, 17, 'ex-big'));
    if (o.half == null || o.half > 0) out += at((NL.x0 + NL.x1) / 2, NL.y + 28, 1, o.half == null ? 1 : o.half, txt('halfway ' + I.halfS, 12, 'ex-coral-t'));
    return { svg: out, X };
  }
  function dotAt(x, y, cls, s) { return at(x, y, s == null ? 1 : s, 1, `<circle r="8" class="${cls || 'ex-dot-big'}"/>`); }
  function arrow(x0, x1, y, a, cls) {
    if (a <= 0) return '';
    const xe = lerp(x0, x1, a), dir = x1 >= x0 ? 1 : -1;
    return `<g class="${cls || 'ex-arrow'}"><line x1="${r1(x0)}" x2="${r1(xe)}" y1="${y}" y2="${y}"/>` +
      (a > 0.6 ? `<path d="M${r1(xe)} ${y} l${-9 * dir} -6 l0 12 z" class="ex-arrowhead"/>` : '') + '</g>';
  }
  const cross = (x, y, s, a) => a > 0 ? at(x, y, 1, a, `<line x1="${-s}" y1="${-s * 0.6}" x2="${s}" y2="${s * 0.6}" class="ex-strike"/><line x1="${-s}" y1="${s * 0.6}" x2="${s}" y2="${-s * 0.6}" class="ex-strike"/>`) : '';

  /* ---------- the explainer ---------- */
  function roundExplainer(o) {
    const p = Math.max(0, Math.min(2, +o.p || 0));
    const I = info(o.x, p);
    const s = I.s;
    const place = PLACE[p], pd = PLACE_DIGIT[p];
    const size = Math.min(46, 330 / (s.length - 0.55));
    const twoCap = p === 0 ? `There are only two choices: keep <b>${I.DS}</b> or bump up to <b>${I.US}</b>.`
      : `There are only two choices: keep the ${I.tDigit} (<b>${I.DS}</b>) or bump it up (<b>${I.US}</b>).`;
    const trap = trapFor(I, p, o.wrong);
    const scenes = [];

    /* 1. find the rounding place and the decider */
    scenes.push({
      dur: 4600,
      cap: `Round ${s} to the nearest <b>${place}</b>. Find the ${pd} digit: <b>${I.tDigit}</b>. The digit right after it, <b>${s[I.dIdx]}</b>, decides.`,
      draw(t) {
        const a = pop(t, 100), tg = easeOut(span(t, 900, 1500)), dc = easeOut(span(t, 2100, 2700)), dm = easeOut(span(t, 3000, 3600));
        const tx = digitX(s, 200, size, I.tIdx), dx = digitX(s, 200, size, I.dIdx);
        return at(200, 100, a.s, a.o, digitRow(s, 0, 0, size, I, { t: tg, d: dc, dim: dm })) +
          at(tx, 100 - size * 0.62 - 16, 1, tg, txt(pd + ' place', 14, 'ex-teal-t')) +
          at(dx, 100 + size * 0.62 + 18, 1, dc, txt('decider', 14, 'ex-coral-t')) +
          (dm > 0 ? at(200, 206, 1, dm, txt('digits after the decider don’t matter', 14, 'ex-muted')) : '');
      }
    });

    /* 2. only two choices */
    scenes.push({
      dur: 4000,
      cap: twoCap,
      draw(t) {
        const a = pop(t, 500), b = pop(t, 1300);
        return at(200, 54, 0.78, 1, digitRow(s, 0, 0, size, I, { t: 1, d: 1, dim: 1 })) +
          at(112, 160, a.s, a.o, card(p === 0 ? 'keep' : 'keep', I.DS)) +
          at(200, 160, 1, Math.min(a.o, b.o), txt('or', 18, 'ex-muted')) +
          at(288, 160, b.s, b.o, card('bump up', I.US));
      }
    });

    /* 3. number line zoom */
    const pos = (I.K - I.D) / I.u;
    const exactHalf = I.K - I.D === I.u / 2;
    const side = exactHalf ? `${s} is exactly halfway. Halfway rounds up, so <b>${I.ansS}</b>.`
      : I.up ? `${s} is past the halfway mark, so it is closer to <b>${I.ansS}</b>.`
        : `${s} is before the halfway mark, so it is closer to <b>${I.ansS}</b>.`;
    scenes.push({
      dur: 5600,
      cap: side,
      draw(t) {
        const L = zoomLine(I, p, { half: easeOut(span(t, 900, 1500)) });
        const fall = easeOut(span(t, 1700, 2400));
        const xs = L.X(I.K);
        const xe = I.up ? NL.x1 : NL.x0;
        const slide = ease(span(t, 3300, 4300));
        const dotX = lerp(xs, xe, slide);
        return at(200, 46, 0.7, 1, digitRow(s, 0, 0, size, I, { t: 1, d: 1, dim: 1 })) +
          L.svg +
          (fall > 0 ? at(xs, NL.y - 42, 1, fall * (1 - slide * 0.6), txt(s, 15, 'ex-mono')) : '') +
          (fall > 0 ? dotAt(xs, lerp(NL.y - 60, NL.y, fall), 'ex-dot-ink', 0.8) : '') +
          arrow(xs, xe, NL.y - 22, slide, 'ex-arrow') +
          (slide >= 1 ? dotAt(xe, NL.y, 'ex-dot-big', pop(t, 4300).s) : '') +
          (pos > 0 && slide > 0.9 ? at(xe, NL.y - 46, 1, easeOut(span(t, 4300, 4700)), txt(I.ansS, 20, 'ex-teal')) : '');
      }
    });

    /* 4. the rule */
    const dg = +s[I.dIdx];
    scenes.push({
      dur: 4200,
      cap: dg >= 5 ? `The rule says the same thing: the decider is ${dg}. <b>5 or more → bump up.</b>` : `The rule says the same thing: the decider is ${dg}. <b>4 or less → keep.</b>`,
      draw(t) {
        const a = pop(t, 200), b = pop(t, 1100), c = pop(t, 2100);
        return at(200, 46, 0.7, 1, digitRow(s, 0, 0, size, I, { t: 1, d: 1, dim: 1 })) +
          at(120, 134, a.s, a.o, `<rect x="-44" y="-44" width="88" height="88" rx="14" class="ex-decider-fill"/>` + txt(String(dg), 52, 'ex-big')) +
          at(120, 194, 1, a.o, txt('decider', 14, 'ex-coral-t')) +
          at(268, 104, b.s, b.o, txt(dg >= 5 ? '5, 6, 7, 8, 9' : '0, 1, 2, 3, 4', 20, 'ex-mono')) +
          at(268, 136, b.s, b.o, txt(dg >= 5 ? '→ bump up' : '→ keep', 22, dg >= 5 ? 'ex-teal' : 'ex-blue')) +
          at(268, 196, c.s, c.o, card('', I.ansS, 'ex-teal', true));
      }
    });

    /* 5. 9 rollover (only when bumping a 9) */
    if (I.roll) {
      const from = I.DS, to = I.US;
      const len = Math.max(from.length, to.length);
      const A = from.padStart(len, ' '), B = to.padStart(len, ' ');
      const sz = Math.min(48, 300 / len);
      scenes.push({
        dur: 5400,
        cap: `Bumping a 9 is like an odometer: the 9 rolls to 0 and the next place goes up. ${from} → <b>${to}</b>.`,
        draw(t) {
          let out = '';
          const cw = sz, dw = sz * 0.45;
          const widths = B.split('').map((c) => (c === '.' ? dw : cw));
          let x = 200 - widths.reduce((a2, b2) => a2 + b2, 0) / 2;
          let order = 0;
          for (let i = len - 1; i >= 0; i--) if (A[i] !== B[i]) order++;
          let k = 0;
          const ranks = {};
          for (let i = len - 1; i >= 0; i--) if (A[i] !== B[i]) ranks[i] = k++;
          for (let i = 0; i < len; i++) {
            const wd = widths[i], mx = x + wd / 2; x += wd;
            if (B[i] === '.') { out += at(mx, 110, 1, 1, txt('.', sz, 'ex-big')); continue; }
            if (A[i] === B[i]) { out += at(mx, 110, 1, 1, txt(B[i], sz * 0.85, 'ex-big')); continue; }
            const st = 900 + ranks[i] * 900;
            const r = ease(span(t, st, st + 650));
            const oldY = 110 - r * 44, newY = 110 + (1 - r) * 44;
            out += `<g clip-path="url(#exroll)">` +
              (A[i] !== ' ' ? at(mx, oldY, 1, 1 - r, txt(A[i], sz * 0.85, 'ex-big')) : '') +
              at(mx, newY, 1, r, txt(B[i], sz * 0.85, r > 0.5 ? 'ex-teal' : 'ex-big')) + '</g>';
            if (r > 0 && r < 1) out += at(mx, 110 + sz * 0.75, 1, 1 - Math.abs(r - 0.5) * 2, txt('+1', 13, 'ex-coral-t'));
          }
          return `<defs><clipPath id="exroll"><rect x="0" y="${110 - sz * 0.62}" width="400" height="${r1(sz * 1.24)}"/></clipPath></defs>` +
            `<rect x="${r1(200 - (len * sz) / 2 - 12)}" y="${r1(110 - sz * 0.7)}" width="${r1(len * sz + 24)}" height="${r1(sz * 1.4)}" rx="12" class="ex-dbox"/>` + out +
            at(200, 196, 1, easeOut(span(t, 900 + order * 900, 1400 + order * 900)), txt(p === 0 ? 'still a whole number' : p === 1 ? `keep the tenths place: ${to}` : `keep two decimal places: ${to}`, 15, 'ex-muted'));
        }
      });
    }

    /* 6. don't round twice (only when it changes the answer) */
    if (I.chain != null) {
      const midP = p + 1;
      const mid = fmt(roundK(I.K, midP).ans, midP);
      const chainS = fmt(I.chain, p);
      scenes.push({
        dur: 5600,
        cap: `Don’t round twice! ${s} → ${mid} → ${chainS} is a trap. Look at the decider only once: <b>${I.ansS}</b>.`,
        draw(t) {
          const a = pop(t, 200), b = pop(t, 1000), c = pop(t, 1800), x = easeOut(span(t, 2600, 3000)), d = pop(t, 3600);
          return at(80, 80, a.s, a.o, txt(s, 22, 'ex-big')) +
            at(140, 80, 1, b.o, txt('→', 22, 'ex-muted')) +
            at(200, 80, b.s, b.o, txt(mid, 22, 'ex-big')) +
            at(260, 80, 1, c.o, txt('→', 22, 'ex-muted')) +
            at(320, 80, c.s, c.o, txt(chainS, 22, 'ex-coral-t')) +
            cross(320, 80, 17, x) +
            at(200, 168, d.s, d.o, txt(`${s} → ${I.ansS}`, 30, 'ex-teal')) +
            at(200, 206, 1, d.o, txt(`one look: the decider ${s[I.dIdx]} says ${I.up ? 'bump' : 'keep'}`, 15, 'ex-muted'));
        }
      });
    }

    /* 7. trap: the tempting wrong answer, placed on a wider number line */
    if (trap) {
      const vals = [I.K, I.ans, trap.K];
      let lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
      const step = Math.pow(10, 3 - p);
      lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step;
      if (hi - lo < step * 2) hi = lo + step * 2;
      const padK = (hi - lo) * 0.08;
      const X = (k) => lerp(40, 360, (k - (lo - padK)) / ((hi + padK) - (lo - padK)));
      const capT = {
        dotzero: `Careful: ${trap.S} is not the tenths answer. It sits way back here, far from ${s}. Keep the tenths digit and check the decider: <b>${I.ansS}</b>.`,
        chop: `Just cutting off digits gives ${trap.S}, but ${s} is closer to <b>${I.ansS}</b>.`,
        tens: `${trap.S} is rounding to the tens. Nearest whole number means look at the ones: <b>${I.ansS}</b>.`,
        answer: `Where is ${trap.S}? Over here. ${s} is closest to <b>${I.ansS}</b>.`,
        roll10: `${trap.S} is a trap: it sits back near ${fmt(Math.floor(I.K / 1000) * 1000, 0)}. A 9 rolls over to the next place: <b>${I.ansS}</b>.`
      }[trap.kind];
      scenes.push({
        dur: 5200,
        cap: capT,
        draw(t) {
          const a = easeOut(span(t, 200, 700)), b = pop(t, 900), c = pop(t, 1900), d = pop(t, 2900), x = easeOut(span(t, 3500, 3900));
          const near = Math.abs(X(trap.K) - X(I.ans)) < 46;
          return (a > 0 ? `<line x1="40" x2="360" y1="150" y2="150" class="ex-axis" opacity="${a.toFixed(2)}"/>` : '') +
            at(X(I.K), 150, 1, b.o, `<circle r="7" class="ex-dot-ink"/>`) + at(X(I.K), 120, b.s, b.o, txt(s, 15, 'ex-mono')) +
            dotAt(X(I.ans), 150, 'ex-dot-big', c.s) + at(X(I.ans), 184, c.s, c.o, txt(I.ansS + ' ✓', 18, 'ex-teal')) +
            dotAt(X(trap.K), 150, 'ex-dot-coral', d.s) + at(X(trap.K), near ? 92 : 184, d.s, d.o, txt(trap.S + ' ✗', 18, 'ex-coral-t')) +
            cross(X(trap.K), 150, 13, x) +
            at(200, 46, 1, a, txt(trap.kind === 'answer' ? 'your answer vs. the right one' : 'the tempting answer', 15, 'ex-muted'));
        }
      });
    }

    /* 8. clean finish */
    const zeroNote = /\.\d*0$/.test(I.ansS) ? `Keep the 0: ${I.ansS} shows you rounded to the ${place}.` : '';
    scenes.push({
      dur: 4200,
      cap: `Keep or bump, then <b>stop</b>: drop every digit after the ${pd} place. ${s} → <b>${I.ansS}</b>. ${zeroNote}`,
      draw(t) {
        const cut = ease(span(t, 500, 1500)), b = pop(t, 1700);
        return at(200, 26, 1, 1, txt('start', 13, 'ex-muted')) +
          at(200, 66, 0.8, 1, digitRow(s, 0, 0, size, I, { t: 0, d: 1 - cut, cut: cut * 0.8 })) +
          at(200, 150, b.s, b.o, txt('→ ' + I.ansS, 44, 'ex-teal')) +
          (zeroNote ? at(200, 206, 1, easeOut(span(t, 2500, 2900)), txt('the 0 holds the ' + pd + ' place', 15, 'ex-muted')) : '');
      }
    });

    /* your turn: same place, same flavor when possible */
    const q = quizFor(p, I);
    return {
      title: `Round ${s} · nearest ${place}`,
      scenes,
      quiz: q
    };
  }

  function makeX(p, flavor) {
    for (let g = 0; g < 400; g++) {
      const whole = pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 18, 24, 31]);
      const K = whole * 1000 + 1 + Math.floor(Math.random() * 998);
      const x = fmt(K, 3);
      const I = info(x, p);
      if (/0$/.test(x)) continue;
      if (flavor === 'roll' && !I.roll) continue;
      if (flavor === 'chain' && I.chain == null) continue;
      if (flavor === 'plain' && (I.roll || I.chain != null)) continue;
      return x;
    }
    return '4.738';
  }
  function quizFor(p, I0) {
    const flavor = I0.roll ? 'roll' : I0.chain != null ? 'chain' : 'plain';
    let x = makeX(p, flavor);
    if (x === I0.s) x = makeX(p, flavor);
    const I = info(x, p);
    const right = I.ansS;
    /* most telling mistakes first (the player shuffles the order on screen) */
    const cands = [];
    if (I.chain != null) cands.push(fmt(I.chain, p));
    if (I.roll && p > 0) cands.push(I.DS.slice(0, -1) + '10');
    if (p === 1) cands.push(fmt(Math.floor(I.K / 1000) * 1000, 1));
    cands.push(I.DS === right ? I.US : I.DS);
    if (p < 2) cands.push(fmt(roundK(I.K, p + 1).ans, p + 1));
    if (p > 0) cands.push(fmt(roundK(I.K, p - 1).ans, p - 1));
    cands.push(x);
    const pool = cands.filter((c, i, a) => c !== right && a.indexOf(c) === i && toK(c) !== I.ans);
    for (let k = 1; pool.length < 3 && k < 6; k++) {
      [I.ans + k * I.u, I.ans - k * I.u].forEach((v) => { const c = fmt(v, p); if (v >= 0 && pool.indexOf(c) < 0 && c !== right) pool.push(c); });
    }
    const wrong = pool.slice(0, 3);
    const R = I;
    return {
      q: `Your turn: round <b>${x}</b> to the nearest ${PLACE[p]}.`,
      right, wrong,
      yes: `Yes! The ${PLACE_DIGIT[p]} digit is ${R.tDigit}, the decider is ${x[R.dIdx]}, so ${R.up ? 'bump up' : 'keep'}: ${right}.`,
      no: `Find the ${PLACE_DIGIT[p]} digit (${R.tDigit}). The decider is ${x[R.dIdx]}: ${+x[R.dIdx] >= 5 ? '5 or more, bump up' : '4 or less, keep'}. Then drop the rest: ${right}.`
    };
  }

  /* "Round 25.351 to the nearest tenth" in a question → this explainer. */
  function match(item, ctx) {
    const q = String(item.q || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const m = /round\s+(\d+\.\d+)\s+to\s+the\s+nearest\s+(whole(?:\s+number)?|tenth|hundredth)/i.exec(q);
    if (!m) return null;
    const p = /tenth/i.test(m[2]) ? 1 : /hundredth/i.test(m[2]) ? 2 : 0;
    return { id: 'round', x: m[1], p, wrong: ctx && ctx.answer };
  }

  w.EX.register('round', {
    build: roundExplainer,
    label: (o) => `round ${o.x} to the nearest ${PLACE[+o.p || 0]}`,
    match,
    order: 20
  });
  /* exposed for tests and for question generators */
  w.EX.round = { info, rounded, trapFor, makeX, toK, fmt };
})(window);
