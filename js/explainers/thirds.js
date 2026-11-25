/* Explainer: thirds are repeating decimals.
   EX.build({ id: 'thirds', n: 1 })   → 1/3 = 0.333…
   EX.build({ id: 'thirds', n: 2 })   → 2/3 = 0.666…
   EX.build({ id: 'thirds', n: 1, wrong: '0.3' })   → also shows where the student's answer lands

   Scenes: n/3 is n ÷ 3 on a bar → divide n.000 by 3, the same remainder keeps coming back
   → so the digit repeats forever (0.333… = 0.3 with a bar) → trap: 0.3 (or 0.6) stops a little short
   → eighths stop, thirds don't → your turn (the other third). */
(function (w) {
  'use strict';
  if (!w.EX || !w.EX.register) return;
  const P = w.EX.prim;
  const { span, ease, easeOut, at, txt, sfrac, pop, shuffle } = P;
  const r1 = P.r1;

  const B = { x: 30, y: 60, w: 340, h: 40 };

  function bar(n, cut, fill) {
    let s = `<rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="8" class="ex-off ex-barbox"/>`;
    if (fill > 0) s += `<rect x="${B.x}" y="${B.y}" width="${r1(B.w * (n / 3) * fill)}" height="${B.h}" rx="8" class="ex-on"/>`;
    for (let j = 1; j <= 2; j++) {
      if (cut <= 0) break;
      const x = B.x + (B.w * j) / 3;
      s += `<line x1="${r1(x)}" x2="${r1(x)}" y1="${r1(B.y + B.h / 2 - (B.h / 2) * cut)}" y2="${r1(B.y + B.h / 2 + (B.h / 2) * cut)}" class="ex-cut"/>`;
    }
    return s;
  }

  /* Number line from lo to hi (in thousandths), used for the zoom trap. */
  function zoomLine(lo, hi, marks) {
    const L = { x: 30, y: 130, w: 340 };
    const px = (k) => L.x + (L.w * (k - lo)) / (hi - lo);
    let s = `<line x1="${L.x}" x2="${L.x + L.w}" y1="${L.y}" y2="${L.y}" class="ex-axis"/>`;
    const stepK = (hi - lo) / 10;
    for (let i = 0; i <= 10; i++) {
      const k = lo + i * stepK;
      const big = k === lo || k === hi;
      s += `<line x1="${r1(px(k))}" x2="${r1(px(k))}" y1="${L.y - (big ? 10 : 6)}" y2="${L.y + (big ? 10 : 6)}" class="ex-axis"/>`;
    }
    s += at(px(lo), L.y + 26, 1, 1, txt((lo / 1000).toFixed(2), 15, 'ex-mono'));
    s += at(px(hi), L.y + 26, 1, 1, txt((hi / 1000).toFixed(2), 15, 'ex-mono'));
    marks.forEach((m) => { if (m.o > 0) s += m.draw(px(m.k), L.y); });
    return s;
  }

  function thirdsExplainer(o) {
    const n = +o.n === 2 ? 2 : 1;
    const dig = n === 1 ? '3' : '6';
    const rep = `0.${dig}${dig}${dig}…`;
    const exactK = n === 1 ? 333.333 : 666.667;
    const scenes = [];

    /* 1. n/3 means n ÷ 3 */
    scenes.push({
      dur: 4200,
      cap: `${n === 1 ? 'One third' : 'Two thirds'} means ${n} ÷ 3: cut 1 whole into 3 equal parts and take ${n}.`,
      draw(t) {
        const c = ease(span(t, 300, 1200)), f = ease(span(t, 1500, 2300)), p = pop(t, 2500);
        return bar(n, c, f) +
          at(200, 150, p.s, p.o, sfrac(n, 3, 34, 'ex-teal')) +
          at(200, 206, 1, easeOut(span(t, 3000, 3500)), txt(`= ${n} ÷ 3`, 22, 'ex-ink'));
      }
    });

    /* 2. divide: the same remainder keeps coming back */
    const q = n === 1 ? 3 : 6;
    scenes.push({
      dur: 7200,
      cap: `Divide ${n}.000 by 3. ${n * 10} ÷ 3 = ${q}, with <b>${n}</b> left over. Bring down a 0: ${n * 10} again. The leftover is always ${n}.`,
      draw(t) {
        let s = at(200, 30, 1, 1, txt(`${n} ÷ 3 = ?`, 20, 'ex-muted'));
        const shownQ = '0.' + dig.repeat(Math.max(0, Math.min(3, Math.floor((t - 600) / 1800) + 1)));
        s += at(200, 66, 1, 1, txt(t < 600 ? '0.' : shownQ, 34, 'ex-big'));
        for (let i = 0; i < 3; i++) {
          const a = pop(t, 600 + i * 1800);
          if (a.o <= 0) continue;
          const y = 112 + i * 40;
          s += at(150, y, a.s, a.o, txt(`${n * 10} ÷ 3 = ${q}`, 20, 'ex-ink'));
          s += at(262, y, a.s, a.o, txt('left over', 15, 'ex-muted'));
          const r = pop(t, 1200 + i * 1800);
          s += at(330, y, r.s, r.o, `<circle r="15" class="ex-dot-coral"/>` + txt(String(n), 18, 'ex-big'));
        }
        return s;
      }
    });

    /* 3. so it repeats forever */
    scenes.push({
      dur: 4800,
      cap: `The leftover never reaches 0, so the ${dig}s never stop. A bar over the ${dig} means "repeats forever."`,
      draw(t) {
        const a = pop(t, 200), b = pop(t, 1600), c = pop(t, 3000);
        return at(200, 54, a.s, a.o, sfrac(n, 3, 30)) +
          at(200, 118, b.s, b.o, txt(`= ${rep}`, 34, 'ex-big')) +
          at(200, 186, c.s, c.o,
            txt('= 0.' + dig, 34, 'ex-teal') +
            `<line x1="${r1(34 * 0.55)}" x2="${r1(34 * 1.2)}" y1="-20" y2="-20" stroke-width="3" class="ex-axis"/>`);
      }
    });

    /* 4. trap: stopping at one digit is a little short */
    const w0 = o.wrong != null ? String(o.wrong).trim() : '';
    const wK = Math.round(parseFloat(w0.replace(/[^\d.]/g, '')) * 1000);
    const useWrong = w0 && isFinite(wK) && Math.abs(wK - exactK) <= 100 && Math.abs(wK - exactK) > 0.5;
    const trapK = useWrong ? wK : (n === 1 ? 300 : 600);
    const trapLab = useWrong ? w0 : (trapK / 1000).toFixed(1);
    const lo = Math.floor(Math.min(trapK, exactK) / 10) * 10;
    const hi = Math.ceil(Math.max(trapK, exactK) / 10) * 10 + (Math.max(trapK, exactK) % 10 ? 0 : 10);
    scenes.push({
      dur: 5600,
      cap: `${useWrong ? 'Your answer ' + trapLab : trapLab} is a little ${trapK < exactK ? 'less' : 'more'} than ${n === 1 ? 'one third' : 'two thirds'}. Zoom in to see the gap. The exact decimal is ${rep}`,
      draw(t) {
        const a = easeOut(span(t, 400, 1000)), b = easeOut(span(t, 1600, 2300));
        return at(200, 40, 1, 1, txt(`Is ${trapLab} the same as `, 18, 'ex-muted', 'end')) +
          at(228, 34, 1, 1, sfrac(n, 3, 16, 'ex-muted')) + at(244, 40, 1, 1, txt('?', 18, 'ex-muted', 'start')) +
          zoomLine(lo, hi, [
            { k: trapK, o: a, draw: (x, y) => at(x, y, 1, a, `<circle r="8" class="ex-dot-coral"/>`) + at(x, y - 26, 1, a, txt(trapLab, 15, 'ex-coral-t')) },
            { k: exactK, o: b, draw: (x, y) => at(x, y, pop(t, 1600).s, b, `<circle r="9" class="ex-dot-big"/>`) + at(x, y + 52, 1, b, txt(rep, 16, 'ex-teal-t')) }
          ]) +
          at(200, 220, 1, easeOut(span(t, 3200, 3800)), txt('close, but not exact', 16, 'ex-coral-t'));
      }
    });

    /* 5. eighths stop, thirds don't */
    scenes.push({
      dur: 4600,
      cap: `Eighths stop: ${'1 ÷ 8'} runs out at 0.125. Thirds never run out. On a test, write the fraction or three digits (${'0.' + dig.repeat(3)}).`,
      draw(t) {
        const a = pop(t, 200), b = pop(t, 1600);
        return at(110, 60, a.s, a.o, sfrac(1, 8, 26, 'ex-ink')) +
          at(110, 124, a.s, a.o, txt('0.125', 26, 'ex-ink')) +
          at(110, 168, 1, easeOut(span(t, 800, 1300)), txt('stops', 16, 'ex-muted')) +
          at(290, 60, b.s, b.o, sfrac(n, 3, 26, 'ex-teal')) +
          at(290, 124, b.s, b.o, txt(rep, 26, 'ex-teal')) +
          at(290, 168, 1, easeOut(span(t, 2200, 2700)), txt('repeats', 16, 'ex-teal-t'));
      }
    });

    /* quiz: the other third */
    const m = n === 1 ? 2 : 1;
    const md = m === 1 ? '3' : '6';
    const right = `0.${md}${md}${md}…`;
    const wrong = shuffle(m === 1 ? ['0.3 exactly', '0.13', '3.1'] : ['0.6 exactly', '0.23', '2.3']);
    return {
      title: `${P.fr(n, 3)} = ${rep}`,
      scenes,
      quiz: {
        q: `Your turn: which decimal equals ${P.fr(m, 3)}?`,
        right, wrong,
        yes: `Yes! ${m} ÷ 3 leaves ${m} over every time, so the ${md}s repeat.`,
        no: `${m} ÷ 3: ${m * 10} ÷ 3 = ${m === 1 ? 3 : 6} with ${m} left over, again and again. So it is ${right}`
      }
    };
  }

  /* Pick this explainer for a decimal question about thirds (not for adding fractions). */
  function match(item) {
    const q = String(item.q || '') + ' ' + String(item.why || '');
    if (!/decimal|repeat/i.test(q)) return null;
    const re = /<span class="n">\s*(\d+)\s*<\/span>\s*<span class="d">\s*(\d+)\s*<\/span>/;
    const mt = re.exec(String(item.q || '')) || re.exec(String(item.why || ''));
    if (!mt) return null;
    const a = +mt[1], b = +mt[2];
    if (!(a > 0 && a < b) || b % 3) return null;
    const k = b / 3;
    if (a % k) return null;
    const n = a / k;
    return n === 1 || n === 2 ? { id: 'thirds', n } : null;
  }

  w.EX.register('thirds', {
    build: thirdsExplainer,
    label: (o) => `${P.fr(+o.n === 2 ? 2 : 1, 3)} → ${+o.n === 2 ? '0.666…' : '0.333…'}`,
    match,
    order: 30
  });
})(window);
