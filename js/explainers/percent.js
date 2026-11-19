/* Explainer: percent of a number, on a percent bar (a double number line).
   EX.build({ id: 'pctof', p: 25, n: 80 })                 → 25% of 80
   EX.build({ id: 'pctof', p: 25, n: 80, wrong: '25' })    → also shows where the student's answer lands

   The strategy comes from the percent, so one builder covers every friendly case:
     50%            → half:     cut into 2 parts
     25%, 75%       → quarters: cut into 4 parts
     10%, 20%, ...  → tenths:   cut into 10 parts, each 10%
     5%, 15%, 35%…  → tenths, then half of one tenth (5% = half of 10%)
   Scenes: the question → the whole bar is 100% and n → cut into equal parts → shade p% and count up
   → the answer, with a multiplication check → trap (the tempting or the student's answer) → your turn. */
(function (w) {
  'use strict';
  if (!w.EX || !w.EX.register) return;
  const P = w.EX.prim;
  const { span, ease, easeOut, lerp, at, txt, pop, shuffle, pick, clamp } = P;
  const r1 = P.r1;

  const BAR = { x0: 30, x1: 370, y: 104, h: 40 };
  const BW = BAR.x1 - BAR.x0;

  function strategy(p, n) {
    if (p === 50) return 'half';
    if (p === 25 || p === 75) return 'quarter';
    if (p % 20 === 0 && p < 100 && n != null && n % 10 !== 0 && n % 5 === 0) return 'fifth';
    if (p % 10 === 0 && p > 0 && p <= 100) return 'tenth';
    if (p % 5 === 0 && p > 0 && p < 100) return 'five';
    return null;
  }
  const PARTS = { half: 2, quarter: 4, fifth: 5, tenth: 10, five: 10 };
  /* Does this pair work with whole-number steps? */
  function friendly(p, n) {
    const s = strategy(p, n);
    if (!s || !(n > 0)) return false;
    if (s === 'five') return n % 20 === 0;
    return n % PARTS[s] === 0;
  }
  const num = (v) => String(Math.round(v * 100) / 100);

  function bar(o) {
    /* o: { show (0..1 outline), fill (0..1 of the whole), parts, cut (0..1 how many cut lines drawn),
            halfCut (0..1, five-strategy split line), labels } */
    let s = '';
    const a = o.show == null ? 1 : o.show;
    s += `<rect x="${BAR.x0}" y="${BAR.y}" width="${BW}" height="${BAR.h}" rx="8" class="ex-pbar" opacity="${a.toFixed(2)}"/>`;
    if (o.fill > 0) s += `<rect x="${BAR.x0}" y="${BAR.y}" width="${r1(BW * clamp(o.fill, 0, 1))}" height="${BAR.h}" rx="8" class="ex-pfill"/>`;
    if (o.parts && o.cut > 0) {
      const shown = Math.floor((o.parts - 1) * clamp(o.cut, 0, 1) + 1e-6);
      for (let j = 1; j <= shown; j++) {
        const x = BAR.x0 + (BW * j) / o.parts;
        s += `<line x1="${r1(x)}" x2="${r1(x)}" y1="${BAR.y}" y2="${BAR.y + BAR.h}" class="ex-pcut"/>`;
      }
    }
    if (o.halfAt != null && o.halfCut > 0) {
      const x = BAR.x0 + BW * o.halfAt;
      s += at(x, BAR.y + BAR.h / 2, 1, o.halfCut, `<line x1="0" x2="0" y1="${-BAR.h / 2}" y2="${BAR.h / 2}" class="ex-pcut ex-pcut-half"/>`);
    }
    s += `<rect x="${BAR.x0}" y="${BAR.y}" width="${BW}" height="${BAR.h}" rx="8" class="ex-pbar-edge" opacity="${a.toFixed(2)}"/>`;
    return s;
  }
  /* Percent labels above the bar, values below. */
  const topLab = (frac, label, o, cls) => at(BAR.x0 + BW * frac, BAR.y - 14, 1, o, txt(label, 14, cls || 'ex-muted'));
  const botLab = (frac, label, o, cls, dy) => at(BAR.x0 + BW * frac, BAR.y + BAR.h + 20 + (dy || 0), 1, o, txt(label, 15, cls || 'ex-big'));
  const tick = (frac, o) => o > 0 ? `<line x1="${r1(BAR.x0 + BW * frac)}" x2="${r1(BAR.x0 + BW * frac)}" y1="${BAR.y - 6}" y2="${BAR.y + BAR.h + 6}" class="ex-ptick" opacity="${o.toFixed(2)}"/>` : '';

  function pctExplainer(o) {
    const p = +o.p, n = +o.n;
    const s = strategy(p, n);
    const ans = (p * n) / 100;
    const parts = PARTS[s];
    const partVal = n / parts, partPct = 100 / parts;
    const k = p / partPct;                          // parts to shade (may end in .5 for the five strategy)
    const scenes = [];
    const F = p / 100;

    /* 1. the question */
    scenes.push({
      dur: 3800,
      cap: `What is <b>${p}% of ${n}</b>? ${p}% means ${p} out of every 100. Let's find that share of ${n} on a bar.`,
      draw(t) {
        const a = pop(t, 100), b = easeOut(span(t, 900, 1700));
        return at(200, 46, a.s, a.o, txt(`${p}% of ${n} = ?`, 30, 'ex-big')) +
          bar({ show: b }) +
          botLab(1, String(n), b, 'ex-big') + at(200, BAR.y + BAR.h + 52, 1, b, txt(`the whole is ${n}`, 14, 'ex-muted'));
      }
    });

    /* 2. the whole is 100% */
    scenes.push({
      dur: 4000,
      cap: `The whole bar is <b>100%</b>, and the whole bar is <b>${n}</b>. 0% is 0.`,
      draw(t) {
        const a = easeOut(span(t, 300, 900)), b = easeOut(span(t, 1200, 1800));
        return at(200, 40, 1, 1, txt(`${p}% of ${n} = ?`, 22, 'ex-muted')) + bar({}) +
          tick(0, a) + tick(1, a) +
          topLab(0, '0%', a) + topLab(1, '100%', a, 'ex-teal-t') +
          botLab(0, '0', b) + botLab(1, String(n), b);
      }
    });

    /* 3. cut into equal parts */
    const cutCap = {
      half: `50% is one half. Cut the bar into <b>2 equal parts</b>: ${n} ÷ 2 = <b>${num(partVal)}</b> in each.`,
      fifth: `20% is one fifth. Cut the bar into <b>5 equal parts</b>: ${n} ÷ 5 = <b>${num(partVal)}</b> in each.`,
      quarter: `25% is one fourth. Cut the bar into <b>4 equal parts</b>: ${n} ÷ 4 = <b>${num(partVal)}</b> in each.`,
      tenth: `Cut the bar into <b>10 equal parts</b>. Each part is 10%, and ${n} ÷ 10 = <b>${num(partVal)}</b>.`,
      five: `Cut the bar into <b>10 equal parts</b>: each is 10%, worth ${n} ÷ 10 = <b>${num(partVal)}</b>. Half a part is 5%, worth <b>${num(partVal / 2)}</b>.`
    }[s];
    scenes.push({
      dur: 5600,
      cap: cutCap,
      draw(t) {
        const c = ease(span(t, 300, 2400)), lab = easeOut(span(t, 2500, 3200));
        const pw = BW / parts;
        let out = at(200, 40, 1, 1, txt(`${p}% of ${n} = ?`, 22, 'ex-muted')) + bar({ parts, cut: c }) +
          tick(0, 1) + tick(1, 1) + topLab(0, '0%', 1) + topLab(1, '100%', 1, 'ex-teal-t') + botLab(0, '0', 1) + botLab(1, String(n), 1);
        if (lab > 0) {
          for (let j = 0; j < parts; j++) {
            const cx = BAR.x0 + pw * (j + 0.5);
            out += at(cx, BAR.y + BAR.h / 2, 1, lab, txt(num(partVal), pw > 40 ? 16 : 13, 'ex-big'));
          }
          out += at(BAR.x0 + pw / 2, BAR.y - 32, 1, lab, txt(num(partPct) + '% each', 13, 'ex-teal-t'));
        }
        if (s === 'five') {
          const h = easeOut(span(t, 3600, 4300));
          out += h > 0 ? at(200, 212, 1, h, txt(`5% = half of 10% = ${num(partVal / 2)}`, 16, 'ex-coral-t')) : '';
        }
        return out;
      }
    });

    /* 4. shade p% and count up */
    const full = Math.floor(k), half = k - full > 0.01;
    const steps = [];
    for (let j = 1; j <= full; j++) steps.push(j * partVal);
    if (half) steps.push(full * partVal + partVal / 2);
    const addLine = steps.length <= 4
      ? Array(full).fill(num(partVal)).concat(half ? [num(partVal / 2)] : []).join(' + ') + ' = ' + num(ans)
      : (half ? `${full} × ${num(partVal)} + ${num(partVal / 2)} = ${num(ans)}` : `${full} × ${num(partVal)} = ${num(ans)}`);
    const shadeCap = s === 'five'
      ? `${p}% is ${full} full part${full === 1 ? '' : 's'} (10% each) and half a part (5%): <b>${addLine}</b>.`
      : full === 1 ? `${p}% is exactly <b>1 part</b>: <b>${num(ans)}</b>.`
        : `${p}% is <b>${full} parts</b>. Count up: <b>${addLine}</b>.`;
    const stepMs = Math.max(380, Math.min(800, 3200 / Math.max(1, steps.length)));
    scenes.push({
      dur: 1200 + steps.length * stepMs + 1800,
      cap: shadeCap,
      draw(t) {
        const pw = BW / parts;
        const prog = clamp((t - 600) / (steps.length * stepMs), 0, 1);
        const done = prog * steps.length;               // how many count-up steps are visible
        const fillFrac = Math.min(F, (Math.min(done, full) * partPct + (half && done > full ? (done - full) * partPct / 2 : 0)) / 100);
        let out = at(200, 40, 1, 1, txt(`${p}% of ${n} = ?`, 22, 'ex-muted')) +
          bar({ parts, cut: 1, fill: fillFrac, halfAt: half ? (full + 0.5) / parts : null, halfCut: half ? easeOut(span(t, 400, 900)) : 0 }) +
          topLab(0, '0%', 1) + topLab(1, '100%', 1, 'ex-muted') + botLab(0, '0', 1) + botLab(1, String(n), 1, 'ex-muted');
        for (let j = 0; j < steps.length; j++) {
          const o2 = clamp(done - j, 0, 1);
          if (o2 <= 0) continue;
          const fx = Math.min(F, (j < full ? (j + 1) * partPct : full * partPct + partPct / 2) / 100);
          const last = j === steps.length - 1;
          const lastFx = Math.min(F, (steps.length - 1 < full ? steps.length * partPct : full * partPct + partPct / 2) / 100);
          const crowded = !last && (lastFx - fx) * BW < 26 && done >= steps.length - 0.01;
          const dense = crowded || (steps.length > 5 && !last && j % 2 === (steps.length % 2 === 0 ? 0 : 1));
          if (!dense) out += botLab(fx, num(steps[j]), o2, last ? 'ex-teal' : 'ex-muted', last ? 0 : -2);
          out += tick(fx, o2 * 0.7);
        }
        const endO = easeOut(span(t, 600 + steps.length * stepMs, 1100 + steps.length * stepMs));
        out += topLab(F, p + '%', endO, 'ex-teal-t');
        return out;
      }
    });

    /* 5. the answer + check */
    scenes.push({
      dur: 4600,
      cap: `<b>${p}% of ${n} = ${num(ans)}</b>. Check with multiplication: ${p}% = ${num(F)}, and ${num(F)} × ${n} = ${num(ans)}.`,
      draw(t) {
        const a = pop(t, 300), b = easeOut(span(t, 1500, 2100));
        return bar({ parts, cut: 1, fill: F }) + tick(F, 1) +
          topLab(0, '0%', 1) + topLab(F, p + '%', 1, 'ex-teal-t') + topLab(1, '100%', 1) +
          botLab(0, '0', 1) + botLab(F, num(ans), 1, 'ex-teal') + botLab(1, String(n), 1) +
          at(200, 46, a.s, a.o, txt(`${p}% of ${n} = ${num(ans)}`, 30, 'ex-teal')) +
          at(200, 216, 1, b, txt(`check: ${num(F)} × ${n} = ${num(ans)}`, 17, 'ex-mono'));
      }
    });

    /* 6. trap */
    let trap = null;
    const wv = o.wrong != null && String(o.wrong).trim() !== '' ? parseFloat(String(o.wrong).replace(/[^\d.\-]/g, '')) : NaN;
    if (isFinite(wv) && Math.abs(wv - ans) > 1e-9) trap = { v: wv, kind: 'answer' };
    else if (p !== ans) trap = { v: p, kind: 'percent' };
    if (trap) {
      const v = trap.v;
      let why;
      if (Math.abs(v - p) < 1e-9) why = `${p} is the <b>percent</b>, not the answer. The answer is a part of ${n}: ${p}% lands at <b>${num(ans)}</b>.`;
      else if (Math.abs(v - (n - ans)) < 1e-9) why = `${num(v)} is the part that is <b>not</b> shaded (${100 - p}%). ${p}% of ${n} is <b>${num(ans)}</b>.`;
      else if (v > n && p <= 100) why = `${num(v)} is more than the whole! ${p}% is less than 100%, so the answer has to be less than ${n}: <b>${num(ans)}</b>.`;
      else if (Math.abs(v - ans * 10) < 1e-9 || Math.abs(v - ans / 10) < 1e-9) why = `${num(v)} is off by a place. ${p}% = ${num(F)}, and ${num(F)} × ${n} = <b>${num(ans)}</b>.`;
      else why = `Where does ${num(v)} land? Over here. ${p}% of ${n} is <b>${num(ans)}</b>.`;
      const hi = Math.max(n, v) * 1.0;
      const X = (val) => lerp(36, 364, val / hi);
      scenes.push({
        dur: 5200,
        cap: why,
        draw(t) {
          const a = easeOut(span(t, 200, 700)), b = pop(t, 900), c = pop(t, 1900), x = easeOut(span(t, 2700, 3100));
          const near = Math.abs(X(v) - X(ans)) < 40;
          return at(200, 40, 1, a, txt(trap.kind === 'answer' ? 'your answer vs. the right one' : 'the tempting answer', 15, 'ex-muted')) +
            (a > 0 ? `<line x1="36" x2="364" y1="150" y2="150" class="ex-axis" opacity="${a.toFixed(2)}"/>` : '') +
            at(36, 178, 1, a, txt('0', 14, 'ex-muted')) + at(X(n), 178, 1, a, txt(String(n), 14, 'ex-muted')) +
            at(X(n), 150, 1, a, '<line x1="0" x2="0" y1="-8" y2="8" class="ex-axis"/>') +
            at(X(ans), 150, b.s, b.o, '<circle r="8" class="ex-dot-big"/>') + at(X(ans), 120, b.s, b.o, txt(num(ans) + ' ✓', 18, 'ex-teal')) +
            at(X(v), 150, c.s, c.o, '<circle r="8" class="ex-dot-coral"/>') + at(X(v), near ? 206 : 120, c.s, c.o, txt(num(v) + ' ✗', 18, 'ex-coral-t')) +
            (x > 0 ? at(X(v), 150, 1, x, '<line x1="-12" y1="-8" x2="12" y2="8" class="ex-strike"/><line x1="-12" y1="8" x2="12" y2="-8" class="ex-strike"/>') : '');
        }
      });
    }

    return { title: `${p}% of ${n}`, scenes, quiz: quizFor(s, p, n) };
  }

  /* friendly pairs for the "your turn" question, same strategy as the one just shown */
  function pairFor(s) {
    const P2 = { half: [50], quarter: [25, 75], fifth: [20, 40, 60, 80], tenth: [10, 20, 30, 40, 60, 70, 80, 90], five: [5, 15, 35, 45] }[s];
    for (let g = 0; g < 200; g++) {
      const p = pick(P2);
      const n = s === 'fifth' ? pick([15, 25, 35, 45, 55, 65, 75, 85]) : s === 'five' ? pick([20, 40, 60, 80, 100, 120, 140, 160, 200]) : s === 'tenth' ? pick([20, 30, 40, 50, 60, 70, 80, 90, 120, 150, 200, 250]) :
        s === 'quarter' ? pick([12, 16, 20, 24, 28, 36, 40, 48, 60, 64, 80, 100]) : pick([14, 18, 24, 30, 36, 46, 50, 64, 90, 120]);
      if (friendly(p, n)) return [p, n];
    }
    return [25, 80];
  }
  function quizFor(s, p0, n0) {
    let p, n;
    for (let g = 0; g < 20; g++) { [p, n] = pairFor(s); if (p !== p0 || n !== n0) break; }
    const ans = (p * n) / 100;
    const cand = [p, n - ans, ans * 10, n + p, ans / 10, Math.abs(n - p), ans + n / 10];
    const wrong = [];
    cand.forEach((v) => { const sv = num(v); if (v > 0 && Math.abs(v - ans) > 1e-9 && wrong.indexOf(sv) < 0 && wrong.length < 3 && Number.isInteger(v)) wrong.push(sv); });
    for (let d = 1; wrong.length < 3; d++) { const sv = num(ans + d * (n / 10)); if (wrong.indexOf(sv) < 0) wrong.push(sv); }
    const parts = PARTS[s], pv = n / parts;
    return {
      q: `Your turn: what is <b>${p}% of ${n}</b>?`,
      right: num(ans), wrong,
      yes: `Yes! ${s === 'five' ? `10% of ${n} is ${num(pv)}, 5% is ${num(pv / 2)}` : `Each ${num(100 / parts)}% part is ${num(pv)}`}, so ${p}% of ${n} = ${num(ans)}.`,
      no: s === 'five' ? `Find 10% first: ${n} ÷ 10 = ${num(pv)}. Then 5% is half of that, ${num(pv / 2)}. Add up to ${p}%.`
        : `Cut ${n} into ${parts} equal parts (${num(pv)} each). ${p}% is ${p / (100 / parts)} of them.`
    };
  }

  /* "What is 25% of 80?", "25% of $80", "A class has 40 students. 25% of them..." (not sale-price questions) */
  function match(item, ctx) {
    const q = String(item.q || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (/sale price|percent of this|what percent|grid/i.test(q)) return null;
    let m = /(\d+)\s*%\s*of\s*(?:the\s+)?\$?(\d+)/i.exec(q);
    let p, n;
    if (m) { p = +m[1]; n = +m[2]; }
    else {
      m = /(\d+)\s*%/.exec(q);
      if (!m) return null;
      p = +m[1];
      const others = (q.replace(m[0], ' ').match(/\$?\b\d+\b/g) || []).map((x) => +x.replace('$', '')).filter((x) => x > 0);
      if (!others.length) return null;
      n = others[0];
    }
    if (!friendly(p, n)) return null;
    return { id: 'pctof', p, n, wrong: ctx && ctx.answer };
  }

  w.EX.register('pctof', {
    build: pctExplainer,
    label: (o) => `${o.p}% of ${o.n}`,
    match,
    order: 30
  });
  w.EX.pctof = { strategy, friendly, pairFor };
})(window);
