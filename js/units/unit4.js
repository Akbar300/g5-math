/* Unit 4: Decimal and Fraction Number Sense Part 1 (FCPS) — 5.NS.1 */
(function () {
  const fr = (...a) => V.fr(...a);
  const mixed = (w, n, d) => V.mixed(w, n, d);

  function gcd(a, b) { return U.gcd(a, b); }
  function simp(n, d) { return U.simp(n, d); }

  const EIGHTHS = [
    [1, 8, '0.125'], [2, 8, '0.25'], [3, 8, '0.375'], [4, 8, '0.5'],
    [5, 8, '0.625'], [6, 8, '0.75'], [7, 8, '0.875']
  ];
  const THIRDS = [
    [1, 3, '0.3̄', ['1/3', '0.333', '0.33', '0.3', '.333']],
    [2, 3, '0.6̄', ['2/3', '0.666', '0.67', '0.6', '.666']]
  ];
  const F100 = [
    [1, 2, '0.5', 50], [1, 4, '0.25', 25], [3, 4, '0.75', 75],
    [1, 5, '0.2', 20], [2, 5, '0.4', 40], [3, 5, '0.6', 60], [4, 5, '0.8', 80],
    [1, 10, '0.1', 10], [3, 10, '0.3', 30], [7, 10, '0.7', 70], [9, 10, '0.9', 90],
    [1, 20, '0.05', 5], [1, 25, '0.04', 4], [1, 50, '0.02', 2],
    [3, 20, '0.15', 15], [7, 20, '0.35', 35], [11, 20, '0.55', 55],
    [1, 100, '0.01', 1], [13, 100, '0.13', 13], [25, 100, '0.25', 25], [99, 100, '0.99', 99]
  ];

  function genF2D() {
    const pool = F100.concat(EIGHTHS.map(([n, d, dec]) => [n, d, dec, Math.round(parseFloat(dec) * 100)]));
    const [n, d, dec] = U.pick(pool);
    const [sn, sd] = simp(n, d);
    const traps = U.shuffle([
      dec,
      dec.replace('0.', '0.0') || ('0.0' + dec.slice(2)),
      String((parseFloat(dec) * 10).toFixed(2)).replace(/0$/, ''),
      '0.' + String(sn) + String(sd)
    ]).filter((x, i, a) => a.findIndex((y) => y === x || U.valuesClose(U.parseChoiceValue(y), U.parseChoiceValue(x))) === i).slice(0, 4);
    if (!traps.some((x) => x === dec || U.valuesClose(U.parseChoiceValue(x), U.parseChoiceValue(dec)))) traps[0] = dec;
    const ch = U.shuffle(traps);
    return {
      type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
      q: `Which decimal is equal to ${fr(sn, sd)}?`,
      ch, a: ch.indexOf(dec),
      why: `${fr(sn, sd)} means ${sn} of ${sd} equal parts. As a decimal that is <b>${dec}</b>.`
    };
  }

  function pushUnique(arr, html, n, d) {
    const k = U.strip(html);
    if (!k || arr.some((x) => U.strip(x.html) === k)) return;
    arr.push({ html, n, d, v: n / d });
  }

  function genD2F() {
    const [n, d, dec, hundred] = U.pick(F100);
    const [sn, sd] = simp(n, d);
    const target = hundred / 100;
    const correct = [];
    pushUnique(correct, fr(sn, sd), sn, sd);
    pushUnique(correct, V.fr(hundred, 100), hundred, 100);
    if (sd !== 10 && 10 % sd === 0) pushUnique(correct, V.fr(sn * (10 / sd), 10), sn * (10 / sd), 10);
    const distractorCands = [
      [sn, sd === 10 ? 100 : 10],
      [sn + 1, sd],
      [hundred, 10],
      [hundred + (hundred >= 10 ? 10 : 1), 100],
      [sd, sn],
      [sn, sd * 10],
      [Math.max(1, hundred - 1), 100]
    ];
    const wrong = [];
    distractorCands.forEach((pair) => {
      const a = pair[0], b = pair[1];
      if (!b || !isFinite(a / b)) return;
      if (Math.abs(a / b - target) < 1e-9) return;
      pushUnique(wrong, V.fr(a, b), a, b);
    });
    if (correct.length >= 2) {
      const R = correct.slice(0, 3);
      const W = U.shuffle(wrong).slice(0, Math.max(2, 5 - R.length));
      const ch = U.shuffle(R.concat(W).map((x) => x.html));
      const a = ch.map((_, i) => i).filter((i) => R.some((r) => U.strip(r.html) === U.strip(ch[i])));
      return {
        type: 'ms', fmt: 'SELECT ALL', nocalc: true, sol: '5.NS.1',
        q: `Select <b>all</b> fractions that are equal to <b>${dec}</b>.`,
        ch, a,
        why: `${dec} is ${hundred} hundredths = ${fr(hundred, 100)} = ${fr(sn, sd)}.`
      };
    }
    const ch = U.shuffle([correct[0].html].concat(U.shuffle(wrong).slice(0, 3).map((x) => x.html)));
    return {
      type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
      q: `Which fraction is equal to <b>${dec}</b>?`,
      ch, a: ch.findIndex((c) => U.strip(c) === U.strip(correct[0].html)),
      why: `${dec} is ${hundred} hundredths = ${fr(hundred, 100)}.`
    };
  }

  function genModel() {
    const [n, d, dec, hundred] = U.pick(F100.filter((x) => x[3] != null && x[3] % 5 === 0));
    const [sn, sd] = simp(n, d);
    const kind = U.pick(['frac', 'dec', 'pct', 'mc-frac']);
    const grid = V.hundredGrid(hundred, { label: hundred + ' squares out of 100' });
    if (kind === 'dec') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `This hundredths grid is shaded. What decimal does it show?` + grid,
        a: [dec, String(hundred / 100)], placeholder: '0.25',
        why: `${hundred} out of 100 is ${fr(hundred, 100)} = <b>${dec}</b>.`
      };
    }
    if (kind === 'pct') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `What percent of this hundredths grid is shaded?` + grid,
        a: [hundred + '%', String(hundred)], placeholder: '25%',
        why: `${hundred} out of 100 is <b>${hundred}%</b>.`
      };
    }
    if (kind === 'mc-frac') {
      const pack = uniqChoices(fr(sn, sd), [fr(hundred, 10), fr(sn, 10), fr(sd, 100), fr(hundred, 1000)]);
      return {
        type: 'mc', fmt: 'MODEL', nocalc: true, sol: '5.NS.1',
        q: `Which fraction in simplest form names the shaded part?` + grid,
        ch: pack.ch, a: pack.a,
        why: `${hundred} out of 100 is ${fr(hundred, 100)} = ${fr(sn, sd)}.`
      };
    }
    return {
      type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
      q: `This hundredths grid shows a decimal. What fraction of the whole is shaded? Write it in simplest form (like 3/4).` + grid,
      a: [sn + '/' + sd, dec, String(hundred) + '/100'],
      placeholder: 'n/d',
      why: `${hundred} out of 100 is ${fr(hundred, 100)}, which simplifies to ${fr(sn, sd)} or ${dec}.`
    };
  }

  function genEighth() {
    const [n, d, dec] = U.pick(EIGHTHS);
    return {
      type: 'mc', fmt: 'MODEL', nocalc: true, sol: '5.NS.1',
      q: `The bar is cut into eighths. What decimal is shaded?` + V.fractionBar(n, 8, { fill: '#0fb39c', label: n + ' of 8 parts' }),
      ch: U.shuffle([dec, '0.' + n, n === 1 ? '0.8' : '0.18', EIGHTHS[(EIGHTHS.indexOf(EIGHTHS.find(x => x[0] === n)) + 1) % 7][2]]),
      why: `${fr(n, 8)} = ${dec}. Eighths are 125 thousandths each.`
    };
  }
  // fix genEighth ch.a after shuffle - need to set a after
  function uniqChoices(correct, wrongs, n) {
    const want = n || 4;
    const out = [];
    const seenText = new Set();
    const seenVal = [];
    const add = (x) => {
      const k = U.strip(String(x));
      if (!k) return false;
      if (seenText.has(k)) return false;
      const v = U.parseChoiceValue(x);
      if (v != null && seenVal.some((s) => U.valuesClose(s, v))) return false;
      seenText.add(k);
      if (v != null) seenVal.push(v);
      out.push(x);
      return true;
    };
    add(correct);
    U.shuffle(wrongs || []).forEach((w) => { if (out.length < want) add(w); });
    if (out.length < want) {
      const v = U.parseChoiceValue(correct);
      if (v != null && isFinite(v)) {
        const extras = [v * 10, v / 10, v + 0.1, v - 0.1, v + 1, v * 2, Number(v.toFixed(2).replace(/0\d$/, '1') || 0)];
        extras.forEach((ev) => {
          if (out.length >= want || ev == null || !isFinite(ev) || ev === 0) return;
          if (U.valuesClose(ev, v)) return;
          if (ev < 0) return;
          const label = (Math.abs(ev - Math.round(ev)) < 1e-9) ? String(Math.round(ev)) : String(Number(ev.toFixed(3)));
          add(label);
        });
      }
    }
    const ch = U.shuffle(out);
    return { ch, a: ch.findIndex((x) => U.strip(String(x)) === U.strip(String(correct))) };
  }

  function genEighthSafe() {
    const [n, d, dec] = U.pick(EIGHTHS);
    const [sn, sd] = simp(n, d);
    const others = EIGHTHS.filter((x) => x[2] !== dec);
    const kind = U.pick(['bar-dec', 'bar-frac', 'type-dec', 'type-frac', 'mc-f2d', 'mc-d2f', 'word', 'eq-sixteenths', 'compare-half']);
    if (kind === 'bar-dec') {
      const pack = uniqChoices(dec, [U.pick(others)[2], n === 1 ? '0.8' : ('0.' + n), '0.1' + n, String(parseFloat(dec) * 10), String(n / 10)]);
      return {
        type: 'mc', fmt: 'MODEL', nocalc: true, sol: '5.NS.1',
        q: `The bar is cut into eighths. What decimal is shaded?` + V.fractionBar(n, 8, { fill: '#0fb39c', label: n + ' of 8 parts' }),
        ch: pack.ch, a: pack.a,
        why: `${fr(n, 8)} = ${dec}. Each eighth is 0.125.`
      };
    }
    if (kind === 'bar-frac') {
      const pack = uniqChoices(fr(sn, sd), [fr(n, 10), fr(n, 80), fr(Math.max(1, n - 1), 8), fr(n, 4), V.fr(n, 8)]);
      return {
        type: 'mc', fmt: 'MODEL', nocalc: true, sol: '5.NS.1',
        q: `The bar is cut into eighths. What fraction of the bar is shaded, in simplest form?` + V.fractionBar(n, 8, { fill: '#0fb39c', label: n + ' of 8 parts' }),
        ch: pack.ch, a: pack.a,
        why: `${fr(n, 8)}${sd !== 8 ? ' simplifies to ' + fr(sn, sd) : ''} = ${dec}.`
      };
    }
    if (kind === 'type-dec') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `Write ${fr(n, 8)} as a decimal.`,
        a: [dec, dec.replace(/^0/, '')], placeholder: '0.125',
        why: `${fr(n, 8)} = ${n} × 0.125 = <b>${dec}</b>.`
      };
    }
    if (kind === 'type-frac') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `Write ${dec} as a fraction in simplest form.`,
        a: [sn + '/' + sd, n + '/8', dec], placeholder: 'n/d',
        why: `${dec} = ${fr(n, 8)}${sd !== 8 ? ' = ' + fr(sn, sd) : ''}.`
      };
    }
    if (kind === 'mc-f2d') {
      const pack = uniqChoices(dec, [U.pick(others)[2], '0.' + n + '8', '0.8' + n, '0.' + n]);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `Which decimal is equal to ${fr(n, 8)}?`,
        ch: pack.ch, a: pack.a,
        why: `${fr(n, 8)} = ${n} × 0.125 = <b>${dec}</b>.`
      };
    }
    if (kind === 'mc-d2f') {
      const pack = uniqChoices(fr(sn, sd), [fr(n, 10), fr(1, n + 8), fr(n, 80), fr(Math.max(1, 8 - n), 8)]);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `Which fraction in simplest form equals <b>${dec}</b>?`,
        ch: pack.ch, a: pack.a,
        why: `${dec} = ${fr(n, 8)}${sd !== 8 ? ' = ' + fr(sn, sd) : ''}.`
      };
    }
    if (kind === 'word') {
      const pack = uniqChoices(dec, [U.pick(others)[2], '0.' + n, '0.8']);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `A pan of brownies is cut into 8 equal pieces. ${n === 1 ? 'One piece is' : n + ' pieces are'} eaten. What decimal names the eaten part?`,
        ch: pack.ch, a: pack.a,
        why: `${fr(n, 8)} = ${dec}.`
      };
    }
    if (kind === 'eq-sixteenths') {
      const k = 2;
      const pack = uniqChoices(fr(n * k, 8 * k), [fr(n, 16), fr(n * k, 8), fr(n + 2, 16), fr(n * k, 10)]);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `Which fraction is equal to ${fr(n, 8)}?`,
        ch: pack.ch, a: pack.a,
        why: `Multiply both parts by ${k}: ${fr(n, 8)} = ${fr(n * k, 8 * k)} = ${dec}.`
      };
    }
    const halfCmp = parseFloat(dec) === 0.5 ? 'equal to' : (parseFloat(dec) > 0.5 ? 'greater than' : 'less than');
    const pack = uniqChoices(halfCmp, ['equal to', 'greater than', 'less than'].filter((x) => x !== halfCmp).concat(['twice']));
    return {
      type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
      q: `Compare: ${fr(n, 8)} is _____ ${fr(1, 2)}.`,
      ch: pack.ch, a: pack.a,
      why: `${fr(n, 8)} = ${dec} and ${fr(1, 2)} = 0.5, so it is ${halfCmp} one half.`
    };
  }

  function genThird() {
    const triples = [];
    for (let k = 1; k <= 10; k++) {
      triples.push({ n: k, d: 3 * k, unit: 1, dec: '0.333', acc: ['1/3', k + '/' + (3 * k), '0.333', '0.33', '0.3', '.333'] });
      triples.push({ n: 2 * k, d: 3 * k, unit: 2, dec: '0.666', acc: ['2/3', (2 * k) + '/' + (3 * k), '0.666', '0.67', '0.6', '.666'] });
    }
    const t = U.pick(triples);
    const [sn, sd] = simp(t.n, t.d);
    const kind = U.pick(['bar-type', 'type-dec', 'type-simp', 'mc-rep', 'mc-eq', 'nline', 'word', 'trap-tenth', 'sixth']);
    if (kind === 'bar-type') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `${fr(t.unit, 3)} as a decimal repeats. Type the fraction OR a decimal rounded to the thousandths (for example 0.333).`
          + V.fractionBar(t.unit, 3, { fill: '#ff5a36', label: t.unit + ' of 3 parts' }),
        a: t.unit === 1 ? ['1/3', '0.333', '0.33', '0.3', '.333'] : ['2/3', '0.666', '0.67', '0.6', '.666'],
        placeholder: '0.333 or 1/3',
        why: `${fr(t.unit, 3)} is a repeating decimal. ${t.unit === 1 ? '0.333…' : '0.666…'} — you may also leave it as a fraction.`
      };
    }
    if (kind === 'type-dec') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `Write ${fr(t.n, t.d)} as a repeating decimal rounded to the thousandths, or as a fraction in simplest form.`,
        a: t.acc, placeholder: t.unit === 1 ? '0.333 or 1/3' : '0.666 or 2/3',
        why: `${fr(t.n, t.d)} = ${fr(sn, sd)} = ${t.unit === 1 ? '0.333…' : '0.666…'}.`
      };
    }
    if (kind === 'type-simp') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `Simplify ${fr(t.n, t.d)}.`,
        a: [sn + '/' + sd, t.acc[0]], placeholder: 'n/d',
        why: `Divide both parts by ${t.n / sn}: ${fr(t.n, t.d)} = ${fr(sn, sd)}.`
      };
    }
    if (kind === 'mc-rep') {
      const right = t.unit === 1 ? '0.333…' : '0.666…';
      const pack = uniqChoices(right, [t.unit === 1 ? '0.3 exactly' : '0.6 exactly', '0.' + t.unit + '3', t.unit + '.3', t.unit === 1 ? '0.13' : '0.23']);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `Which decimal best names ${fr(t.n, t.d)}?`,
        ch: pack.ch, a: pack.a,
        why: `${fr(t.n, t.d)} = ${fr(sn, sd)} = ${right}. The digits repeat.`
      };
    }
    if (kind === 'mc-eq') {
      const pack = uniqChoices(fr(sn, sd), [fr(t.n, t.d + 3), fr(t.unit, 4), fr(t.n, 10), fr(t.unit, 2)]);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `Which fraction in simplest form equals ${fr(t.n, t.d)}?`,
        ch: pack.ch, a: pack.a,
        why: `${fr(t.n, t.d)} = ${fr(sn, sd)}.`
      };
    }
    if (kind === 'nline') {
      const pos = t.unit / 3;
      return {
        type: 'mc', fmt: 'NUMBER LINE', nocalc: true, sol: '5.NS.1',
        q: `Which point shows ${fr(t.n, t.d)}?`
          + V.numberLine(0, 1, [
            { pos, label: 'P', color: '#ff5a36' },
            { pos: t.unit === 1 ? 0.3 : 0.6, label: 'Q', color: '#2f80ed' },
            { pos: t.unit === 1 ? 0.5 : 0.8, label: 'R', color: '#0fb39c' }
          ]),
        ch: ['P', 'Q', 'R'], a: 0,
        why: `${fr(t.n, t.d)} = ${fr(sn, sd)} sits at about ${t.unit === 1 ? '0.333…' : '0.666…'} (point <b>P</b>). Point Q is the one-digit decimal ${t.unit === 1 ? '0.3' : '0.6'}, which is a little too small.`
      };
    }
    if (kind === 'word') {
      const pack = uniqChoices(fr(sn, sd), [fr(t.unit, 4), fr(t.n, 10), fr(3 - t.unit, 3)]);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `A ribbon is cut into ${t.d} equal pieces. ${t.n === 1 ? 'One piece is' : t.n + ' pieces are'} used. What fraction of the ribbon was used, in simplest form?`,
        ch: pack.ch, a: pack.a,
        why: `${fr(t.n, t.d)} = ${fr(sn, sd)}.`
      };
    }
    if (kind === 'trap-tenth') {
      const trap = t.unit === 1 ? '0.3' : '0.6';
      const right = t.unit === 1 ? '0.333… is a little more than 0.3' : '0.666… is a little more than 0.6';
      const pack = uniqChoices(right, [
        trap + ' is exactly ' + fr(sn, sd),
        trap + ' is a little more than ' + fr(sn, sd),
        fr(sn, sd) + ' equals ' + (t.unit === 1 ? '0.13' : '0.23')
      ]);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `Which statement about ${fr(sn, sd)} is true?`,
        ch: pack.ch, a: pack.a,
        why: `${fr(sn, sd)} = ${t.unit === 1 ? '0.333…' : '0.666…'}, which is a little more than the one-digit decimal ${trap}.`
      };
    }
    const sixthN = t.unit === 1 ? 2 : 4;
    const pack = uniqChoices(fr(sn, sd), [fr(sixthN, 5), fr(t.unit, 6), fr(sixthN, 3)]);
    return {
      type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
      q: `Which fraction equals ${fr(sixthN, 6)}?`,
      ch: pack.ch, a: pack.a,
      why: `${fr(sixthN, 6)} = ${fr(sn, sd)}.`
    };
  }

  function genCompareEq() {
    const [n, d, dec, hundred] = U.pick(F100.filter((x) => x[3] != null));
    const [sn, sd] = simp(n, d);
    const target = hundred / 100;
    const equals = [`${dec}`, `${sn}/${sd}`, `${hundred}/100`];
    if (sd !== 10 && 10 % sd === 0) equals.push(`${sn * (10 / sd)}/10`);
    const extras = [
      '0.' + String(sn) + String(sd),
      `${sn}/${sd * 10}`,
      String(Math.round((parseFloat(dec) + 0.1) * 100) / 100),
      `${sn + 1}/${sd}`,
      `${hundred}/10`
    ];
    const seen = new Set();
    const pool = [];
    equals.concat(extras).forEach((t) => {
      const k = String(t);
      if (seen.has(k)) return;
      seen.add(k);
      pool.push(k);
    });
    const rights = pool.filter((t) => U.valuesClose(U.parseChoiceValue(t), target));
    const wrongs = pool.filter((t) => !U.valuesClose(U.parseChoiceValue(t), target));
    const R = rights.slice(0, 3);
    const W = U.shuffle(wrongs).slice(0, Math.max(2, 5 - R.length));
    const ch = U.shuffle(R.concat(W));
    const a = ch.map((_, i) => i).filter((i) => U.valuesClose(U.parseChoiceValue(ch[i]), target));
    return {
      type: a.length > 1 ? 'ms' : 'mc',
      fmt: a.length > 1 ? 'SELECT ALL' : 'MULTIPLE CHOICE',
      nocalc: true, sol: '5.NS.1',
      q: a.length > 1
        ? `Select <b>all</b> of the numbers that are equal to ${fr(sn, sd)}.`
        : `Which number is equal to ${fr(sn, sd)}?`,
      ch, a: a.length > 1 ? a : a[0],
      why: `${fr(sn, sd)} = ${fr(hundred, 100)} = ${dec}. Any name for the same amount counts.`
    };
  }

  function genLine() {
    const pool = EIGHTHS.concat(F100.filter((x) => ['0.25', '0.5', '0.75', '0.2', '0.4', '0.8', '0.1', '0.3', '0.6', '0.9', '0.05', '0.15'].includes(x[2])).map((x) => [x[0], x[1], x[2]]));
    const [n, d, dec] = U.pick(pool);
    const [sn, sd] = simp(n, d);
    const val = parseFloat(dec);
    const labels = U.pick([['P', 'Q', 'R'], ['A', 'B', 'C'], ['X', 'Y', 'Z']]);
    const marks = U.shuffle([
      { pos: val, label: labels[0], color: '#ff5a36', ok: true },
      { pos: Math.max(0, +(val - 0.15).toFixed(2)), label: labels[1], color: '#2f80ed', ok: false },
      { pos: Math.min(1, +(val + 0.2).toFixed(2)), label: labels[2], color: '#0fb39c', ok: false }
    ]);
    const kind = U.pick(['which-point', 'which-value']);
    if (kind === 'which-value') {
      const pack = uniqChoices(fr(sn, sd), [fr(Math.max(1, sn - 1), sd), '0.' + String(sn) + String(sd), fr(sn, 10)]);
      return {
        type: 'mc', fmt: 'NUMBER LINE', nocalc: true, sol: '5.NS.1',
        q: `Point ${labels[0]} is marked on the number line. Which amount is that?`
          + V.numberLine(0, 1, marks.map(({ pos, label, color }) => ({ pos, label, color }))),
        ch: pack.ch, a: pack.a,
        why: `Point ${labels[0]} sits at ${dec}, which is ${fr(sn, sd)}.`
      };
    }
    const ch = marks.map((m) => m.label);
    return {
      type: 'mc', fmt: 'NUMBER LINE', nocalc: true, sol: '5.NS.1',
      q: `Which point on the number line shows ${fr(sn, sd)}?`
        + V.numberLine(0, 1, marks.map(({ pos, label, color }) => ({ pos, label, color }))),
      ch, a: marks.findIndex((m) => m.ok),
      why: `${fr(sn, sd)} = ${dec}, so it sits at point <b>${labels[0]}</b>.`
    };
  }

  // Advanced: ratios and percent names for the same amount
  function genRatio() {
    const a = U.pick([2, 3, 4, 5, 6, 8]);
    const b = U.pick([5, 6, 8, 10, 12]);
    const k = U.ri(2, 4);
    const ch = U.shuffle([`${a * k}:${b * k}`, `${a}:${b + 1}`, `${a * k}:${b}`, `${a}:${b * k}`]);
    return {
      type: 'mc', fmt: 'RATIO', sol: '6.NS / 6.PFA',
      q: `Which ratio is equivalent to <b>${a} : ${b}</b>?`,
      ch, a: ch.indexOf(`${a * k}:${b * k}`),
      why: `Multiply both parts by ${k}: ${a}×${k}=${a * k} and ${b}×${k}=${b * k}. The ratio stays ${a}:${b}.`
    };
  }

  function genRatioTable() {
    const a = U.pick([2, 3, 4, 5]);
    const b = U.pick([3, 5, 6, 8]);
    const cols = [1, 2, 3, 4].map((k) => [a * k, b * k]);
    const hideCol = U.pick([1, 2, 3]);
    const hideRow = U.pick([0, 1]);
    const labels = U.pick([['Red', 'Blue'], ['Juice', 'Water'], ['Wins', 'Losses'], ['Gold', 'Green']]);
    const rows = `<table style="border-collapse:collapse;margin:8px auto;font-weight:800">
      <tr><th style="border:2px solid var(--ink);padding:6px 12px;background:var(--remember-bg)">${labels[0]}</th>${cols.map((c, i) => `<td style="border:2px solid var(--ink);padding:6px 12px;text-align:center">${i === hideCol && hideRow === 0 ? '?' : c[0]}</td>`).join('')}</tr>
      <tr><th style="border:2px solid var(--ink);padding:6px 12px;background:var(--why-bg)">${labels[1]}</th>${cols.map((c, i) => `<td style="border:2px solid var(--ink);padding:6px 12px;text-align:center">${i === hideCol && hideRow === 1 ? '?' : c[1]}</td>`).join('')}</tr>
    </table>`;
    const missing = cols[hideCol][hideRow];
    const k = hideCol + 1;
    return {
      type: 'num', fmt: 'RATIO TABLE',
      q: `The table shows equivalent ratios. What number belongs in the ? box?${rows}`,
      a: missing,
      why: `Every column is a multiple of ${a}:${b}. Column ${k} is ×${k}, so ${labels[hideRow].toLowerCase()} is ${[a, b][hideRow]}×${k}=${missing}.`
    };
  }

  function genPercent() {
    const [n, d, dec, hundred] = U.pick(F100.filter((x) => x[3] != null));
    const [sn, sd] = simp(n, d);
    const pct = hundred + '%';
    const ch = U.shuffle([pct, (hundred + 10) + '%', (Math.floor(hundred / 10)) + '%', (100 - hundred) + '%']).filter((x, i, a) => a.indexOf(x) === i);
    if (!ch.includes(pct)) ch[0] = pct;
    return {
      type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true,
      q: `${fr(sn, sd)} is the same amount as which percent?`,
      ch, a: ch.indexOf(pct),
      why: `${fr(sn, sd)} = ${dec} = ${hundred} hundredths = <b>${pct}</b>. Percent means “out of 100.”`
    };
  }

  function genMixPct() {
    const w = U.pick([1, 2, 3]);
    const [n, d, dec] = U.pick([[1, 4, '0.25'], [1, 2, '0.5'], [3, 4, '0.75'], [1, 5, '0.2'], [2, 5, '0.4'], [1, 10, '0.1']]);
    const val = w + parseFloat(dec);
    const pct = Math.round(val * 100) + '%';
    const kind = U.pick(['type', 'mc', 'gt100']);
    if (kind === 'mc' || kind === 'gt100') {
      const pack = uniqChoices(pct, [(Math.round(val * 10)) + '%', (w * 100 + n) + '%', (Math.round(val * 1000)) + '%', w + d + '%']);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE',
        q: `Write ${mixed(w, n, d)} as a percent.`,
        ch: pack.ch, a: pack.a,
        why: `${mixed(w, n, d)} = ${w}${dec.slice(1)} = ${val} = <b>${pct}</b>.`
      };
    }
    return {
      type: 'num', fmt: 'TYPE IN',
      q: `Write ${mixed(w, n, d)} as a percent.`,
      a: [pct, String(Math.round(val * 100))], placeholder: '175%',
      why: `${mixed(w, n, d)} = ${w}${dec.slice(1)} = ${val} = <b>${pct}</b>.`
    };
  }

  function ratioPair() {
    let a = U.pick([1, 2, 3, 4, 5, 6, 8]);
    let b = U.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
    if (a === b) b = a + U.pick([1, 2, 3]);
    return [a, b];
  }

  function genRatioCore() {
    const [a, b] = ratioPair();
    const ctx = U.pick([
      { x: 'red jerseys', y: 'blue jerseys' },
      { x: 'cups of juice', y: 'cups of water' },
      { x: 'gold beads', y: 'green beads' },
      { x: 'dogs', y: 'cats' },
      { x: 'red tiles', y: 'yellow tiles' },
      { x: 'girls', y: 'boys' },
      { x: 'wins', y: 'losses' }
    ]);
    const kind = U.pick(['write', 'order', 'eq', 'parts', 'word-eq']);
    if (kind === 'write') {
      const pack = uniqChoices(`${a} : ${b}`, [`${b} : ${a}`, `${a} : ${a + b}`, `${a + b} : ${b}`, `${a} : ${b + a}`]);
      return {
        type: 'mc', fmt: 'RATIO', nocalc: true, sol: '5.NS.1 / 6.PFA',
        q: `A box has <b>${a}</b> ${ctx.x} and <b>${b}</b> ${ctx.y}. What is the ratio of ${ctx.x} to ${ctx.y}?`,
        ch: pack.ch, a: pack.a,
        why: `Write the amounts in the same order as the words: <b>${a} : ${b}</b>.`
      };
    }
    if (kind === 'order') {
      const pack = uniqChoices(`${b} : ${a}`, [`${a} : ${b}`, `${a} : ${a + b}`, `${b} : ${a + b}`]);
      return {
        type: 'mc', fmt: 'RATIO', nocalc: true, sol: '5.NS.1 / 6.PFA',
        q: `The ratio of ${ctx.x} to ${ctx.y} is <b>${a} : ${b}</b>. What is the ratio of ${ctx.y} to ${ctx.x}?`,
        ch: pack.ch, a: pack.a,
        why: `Order matters. Flip both parts: ${ctx.y} to ${ctx.x} is <b>${b} : ${a}</b>.`
      };
    }
    if (kind === 'eq' || kind === 'word-eq') {
      const k = U.ri(2, 5);
      const right = `${a * k} : ${b * k}`;
      const pack = uniqChoices(right, [`${a * k} : ${b}`, `${a} : ${b * k}`, `${a + k} : ${b + k}`, `${a * k} : ${b + k}`]);
      return {
        type: 'mc', fmt: 'RATIO', nocalc: true, sol: '5.NS.1 / 6.PFA',
        q: kind === 'word-eq'
          ? `A mix uses ${a} ${ctx.x} for every ${b} ${ctx.y}. Which ratio is equivalent to <b>${a} : ${b}</b>?`
          : `Which ratio is equivalent to <b>${a} : ${b}</b>?`,
        ch: pack.ch, a: pack.a,
        why: `Multiply both parts by ${k}: ${a}×${k}=${a * k} and ${b}×${k}=${b * k}, so ${right}.`
      };
    }
    return {
      type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1 / 6.PFA',
      q: `In the ratio <b>${a} : ${b}</b> (${ctx.x} to ${ctx.y}), how many parts are ${ctx.y}?`,
      a: [String(b), b + ' parts'], placeholder: String(b),
      why: `The second number in ${a} : ${b} is <b>${b}</b>.`
    };
  }

  function genPercentCore() {
    const [n, d, dec, hundred] = U.pick(F100.filter((x) => x[3] != null));
    const [sn, sd] = simp(n, d);
    const pct = hundred + '%';
    const kind = U.pick(['grid', 'mc-dec', 'type-dec', 'mc-frac', 'meaning', 'type-pct']);
    if (kind === 'grid') {
      const pack = uniqChoices(pct, [(hundred + 10) + '%', (100 - hundred) + '%', Math.max(1, Math.floor(hundred / 10)) + '%', hundred + '0%']);
      return {
        type: 'mc', fmt: 'MODEL', nocalc: true, sol: '5.NS.1',
        q: `What percent of this hundredths grid is shaded?` + V.hundredGrid(hundred, { label: hundred + ' squares out of 100' }),
        ch: pack.ch, a: pack.a,
        why: `${hundred} out of 100 is <b>${pct}</b>. Percent means “per hundred.”`
      };
    }
    if (kind === 'mc-dec') {
      const pack = uniqChoices(pct, [(hundred + 10) + '%', (Math.floor(hundred / 10) || 1) + '%', (100 - hundred) + '%', hundred + '0%']);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `What percent is equal to <b>${dec}</b>?`,
        ch: pack.ch, a: pack.a,
        why: `${dec} = ${hundred} hundredths = <b>${pct}</b>.`
      };
    }
    if (kind === 'type-dec') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `Write ${dec} as a percent.`,
        a: [pct, String(hundred)], placeholder: '25%',
        why: `${dec} = ${hundred} hundredths = <b>${pct}</b>.`
      };
    }
    if (kind === 'mc-frac') {
      const pack = uniqChoices(pct, [(sn) + '%', (sd) + '%', (hundred + 5) + '%', (100 - hundred) + '%']);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `What percent is equal to ${fr(sn, sd)}?`,
        ch: pack.ch, a: pack.a,
        why: `${fr(sn, sd)} = ${dec} = ${hundred} hundredths = <b>${pct}</b>.`
      };
    }
    if (kind === 'meaning') {
      const pack = uniqChoices(`${hundred} out of 100`, [`${hundred} out of 10`, `${hundred} out of ${hundred}`, `1 out of ${hundred}`]);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `What does <b>${pct}</b> mean?`,
        ch: pack.ch, a: pack.a,
        why: `Percent means “per hundred,” so ${pct} is ${hundred} out of 100.`
      };
    }
    return {
      type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
      q: `${hundred} hundredths is what percent?`,
      a: [pct, String(hundred)], placeholder: '25%',
      why: `${hundred} hundredths = <b>${pct}</b>.`
    };
  }

  function genF2P() {
    const [n, d, dec, hundred] = U.pick(F100.filter((x) => x[3] != null));
    const [sn, sd] = simp(n, d);
    const pct = hundred + '%';
    const kind = U.pick(['f2p-mc', 'f2p-type', 'p2f-mc', 'p2f-type', 'p2d', 'd2p', 'all-three']);
    if (kind === 'f2p-mc') {
      const pack = uniqChoices(pct, [(sn) + sd + '%', (100 - hundred) + '%', (hundred + 10) + '%', sd + '%']);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `${fr(sn, sd)} is the same amount as which percent?`,
        ch: pack.ch, a: pack.a,
        why: `${fr(sn, sd)} = ${fr(hundred, 100)} = <b>${pct}</b>.`
      };
    }
    if (kind === 'f2p-type') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `Write ${fr(sn, sd)} as a percent.`,
        a: [pct, String(hundred)], placeholder: '25%',
        why: `${fr(sn, sd)} = ${dec} = <b>${pct}</b>.`
      };
    }
    if (kind === 'p2f-mc') {
      const pack = uniqChoices(fr(sn, sd), [fr(hundred, 10), fr(sn, 100), fr(sd, sn || 1), fr(hundred, 1000)]);
      return {
        type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
        q: `Which fraction in simplest form equals <b>${pct}</b>?`,
        ch: pack.ch, a: pack.a,
        why: `${pct} = ${fr(hundred, 100)} = ${fr(sn, sd)}.`
      };
    }
    if (kind === 'p2f-type') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `Write ${pct} as a fraction in simplest form.`,
        a: [sn + '/' + sd, hundred + '/100', dec], placeholder: 'n/d',
        why: `${pct} = ${fr(hundred, 100)} = ${fr(sn, sd)}.`
      };
    }
    if (kind === 'p2d') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `Write ${pct} as a decimal.`,
        a: [dec, dec.replace(/0+$/, '') || dec, String(hundred / 100)], placeholder: '0.25',
        why: `${pct} = ${hundred} hundredths = <b>${dec}</b>.`
      };
    }
    if (kind === 'd2p') {
      return {
        type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
        q: `Write ${dec} as a percent.`,
        a: [pct, String(hundred)], placeholder: '25%',
        why: `${dec} = ${hundred} hundredths = <b>${pct}</b>.`
      };
    }
    const goods = [];
    const addGood = (x) => {
      const k = U.strip(String(x));
      if (!k || goods.some((g) => U.strip(String(g)) === k)) return;
      goods.push(x);
    };
    addGood(fr(sn, sd));
    addGood(dec);
    addGood(pct);
    const target = hundred / 100;
    const wrongs = [
      fr(hundred, 10),
      String(hundred / 10),
      (hundred + 10) + '%',
      (100 - hundred) + '%',
      fr(sn, 10),
      fr(sd, 100)
    ].filter((w) => {
      const k = U.strip(String(w));
      if (!k || goods.some((g) => U.strip(String(g)) === k)) return false;
      const v = U.parseChoiceValue(w);
      if (v != null && U.valuesClose(v, target)) return false;
      return true;
    });
    const ch = U.shuffle(goods.concat(U.shuffle(wrongs).slice(0, Math.max(2, 5 - goods.length))));
    const a = ch.map((_, i) => i).filter((i) => goods.some((g) => U.strip(String(g)) === U.strip(String(ch[i]))));
    return {
      type: 'ms', fmt: 'SELECT ALL', nocalc: true, sol: '5.NS.1',
      q: `Select <b>all</b> names that equal ${fr(hundred, 100)}.`,
      ch, a,
      why: `${fr(hundred, 100)} = ${fr(sn, sd)} = ${dec} = ${pct}.`
    };
  }


  function genPctOf() {
    const nice = [
      [10, 40, 4], [10, 80, 8], [10, 250, 25], [20, 35, 7], [20, 45, 9],
      [20, 50, 10], [25, 40, 10], [25, 60, 15], [25, 80, 20], [5, 80, 4],
      [5, 60, 3], [50, 36, 18], [50, 90, 45], [75, 40, 30], [75, 80, 60],
      [15, 80, 12], [30, 40, 12], [40, 25, 10], [60, 50, 30], [10, 70, 7]
    ];
    const [p, n, ans] = U.pick(nice);
    const watch = (ctx) => (window.EX && EX.pctof && EX.pctof.friendly(p, n) ? { id: 'pctof', p, n, wrong: ctx && ctx.answer } : null);
    const it = genPctOfItem(p, n, ans);
    it.watch = watch;
    return it;
  }
  function genPctOfItem(p, n, ans) {
    const kind = U.pick(['type', 'mc', 'word', 'frac-way']);
    if (kind === 'type' || kind === 'word') {
      const q = kind === 'word'
        ? `A class has <b>${n}</b> students. <b>${p}%</b> of them play an instrument. How many students is that?`
        : `What is ${p}% of ${n}?`;
      return {
        type: 'num', fmt: 'TYPE IN', sol: '5.NS.1',
        q, a: [String(ans), ans + ' students'],
        why: `${p}% = ${p / 100}. ${p / 100} × ${n} = <b>${ans}</b>. Or think ${fr(p, 100)} of ${n}.`
      };
    }
    const pack = uniqChoices(String(ans), [String(p), String(n), String(p + n), String(Math.abs(n - p)), String(ans * 10)]);
    return {
      type: 'mc', fmt: 'MULTIPLE CHOICE', sol: '5.NS.1',
      q: kind === 'frac-way'
        ? `${p}% of ${n} is the same as ${fr(p, 100)} × ${n}. What is the value?`
        : `What is ${p}% of ${n}?`,
      ch: pack.ch, a: pack.a,
      why: `${p}% = ${p / 100}, and ${p / 100} × ${n} = <b>${ans}</b>.`
    };
  }

  function testCore() {
    const items = [
      genF2D(), genD2F(), genModel(), genEighthSafe(), genThird(), genCompareEq(), genLine(),
      genRatioCore(), genPercentCore(), genF2P(), genF2D(), genCompareEq()
    ];
    // Multi-part
    const [n, d, dec, hundred] = U.pick(F100.filter((x) => x[3]));
    const [sn, sd] = simp(n, d);
    items.splice(3, 0, {
      type: 'multi', fmt: 'MULTI-PART', nocalc: true, sol: '5.NS.1',
      q: `A book is ${fr(sn, sd)} of the way finished.`,
      parts: [
        { type: 'num', q: 'Write that amount as a decimal.', a: [dec], why: `${fr(sn, sd)} = ${dec}.` },
        { type: 'num', q: 'How many hundredths is that?', a: [String(hundred), hundred + '/100'], why: `${dec} = ${hundred} hundredths.` }
      ]
    });
    return items.slice(0, 12);
  }

  function testAdv() {
    return [genRatio(), genRatioTable(), genPercent(), genMixPct(), genPctOf(), genF2P(),
      genCompareEq(), genRatioTable(), genPctOf(), genMixPct(), genPercent(), genRatio()];
  }

  window.UNIT = {
    id: 'u4', num: 4, emoji: '🍕',
    title: 'Fraction & Decimal Studio',
    short: 'Fraction–decimal sense',
    sol: ['5.NS.1'],
    blurb: 'Thirds, eighths, and factors of 100 as decimals — plus ratios and percents as more names for the same amount.',
    dates: ['2026-11-16', '2026-12-04'],
    color: '#e85d04',
    core: {
      intro: 'Short lessons on naming the same amount as a fraction, a decimal, a percent, or a ratio. About 5–8 minutes each, no rush.',
      lessons: [
        {
          id: 'u4c1', name: 'Tenths & hundredths', icon: '🟩',
          cards: [
            {
              t: 'One whole, cut into 100',
              html: `<p>This square is one whole. It is cut into 100 equal tiny squares. Each tiny square is one hundredth, or ${fr(1, 100)}, or 0.01.</p>`
            },
            {
              t: 'Twenty hundredths',
              html: `<p>20 tiny squares are shaded. That is 20 hundredths = ${fr(20, 100)} = ${fr(1, 5)} = <b>0.20</b> or <b>0.2</b>.</p>`,
              remember: 'Trailing zeros after the decimal point do not change the value: 0.20 = 0.2.'
            },
            {
              t: 'Tenths sit in the first place',
              html: `<p>In <b>0.47</b>, the 4 is 4 tenths and the 7 is 7 hundredths. Together they are ${fr(47, 100)}.</p>`,
              try: () => genD2F()
            }
          ]
        },
        {
          id: 'u4c2', name: 'Factors of 100', icon: '💯',
          cards: [
            {
              t: 'Friendly denominators',
              html: `<p>When the denominator is a factor of 100 (2, 4, 5, 10, 20, 25, 50, 100), you can rename the fraction as hundredths, then as a decimal.</p>
                     <p>${fr(3, 4)} = ${fr(75, 100)} = <b>0.75</b> because 4 × 25 = 100 and 3 × 25 = 75.</p>`
            },
            {
              t: 'Try the rename',
              html: `<p>${fr(2, 5)}: 5 × 20 = 100, so 2 × 20 = 40. ${fr(2, 5)} = ${fr(40, 100)} = 0.40 = 0.4.</p>`,
              try: () => genF2D(),
              remember: 'Multiply the top and the bottom by the same number until the bottom is 100. Then the top is the decimal’s hundredths.'
            }
          ]
        },
        {
          id: 'u4c3', name: 'Eighths & thirds', icon: '🍰',
          cards: [
            {
              t: 'Eighths have three decimal digits',
              html: `<p>One eighth is 0.125. You can build every eighth from that:</p>
                    <div class="eq-tbl-wrap eq-tbl-split">
                      <table class="eq-tbl">
                        <tbody>
                          <tr><th>Fraction</th><td>${fr(1, 8)}</td><td>${fr(2, 8)}</td><td>${fr(3, 8)}</td><td>${fr(4, 8)}</td></tr>
                          <tr><th>Decimal</th><td>0.125</td><td>0.25</td><td>0.375</td><td>0.5</td></tr>
                        </tbody>
                      </table>
                      <table class="eq-tbl">
                        <tbody>
                          <tr><th>Fraction</th><td>${fr(5, 8)}</td><td>${fr(6, 8)}</td><td>${fr(7, 8)}</td><td>${fr(8, 8)}</td></tr>
                          <tr><th>Decimal</th><td>0.625</td><td>0.75</td><td>0.875</td><td>1</td></tr>
                        </tbody>
                      </table>
                    </div>`,
              remember: 'Eighths stop after three digits. Next card: thirds never stop.'
            },
            {
              t: 'Thirds repeat',
              html: `<p>Thirds are repeating decimals. The 3s and 6s go on forever. On a test you can leave the answer as a fraction, or write three decimal digits.</p>
                    <div class="eq-tbl-wrap"><table class="eq-tbl">
                      <tbody>
                        <tr><th>Fraction</th><td>${fr(1, 3)}</td><td>${fr(2, 3)}</td><td>${fr(3, 3)}</td></tr>
                        <tr><th>Decimal</th><td>0.333…</td><td>0.666…</td><td>1</td></tr>
                      </tbody>
                    </table></div>`
                + V.numberLine(0, 1, [{ pos: 1 / 3, label: '1/3', color: '#ff5a36' }, { pos: 2 / 3, label: '2/3', color: '#2f80ed' }]),
              watch: { id: 'thirds', n: 1 },
              try: () => genThird(),
              remember: 'Eighths end (0.125, 0.375…). Thirds repeat. Both are still exact fractions.'
            }
          ]
        },
        {
          id: 'u4c4', name: 'Same amount, many names', icon: '🔁',
          cards: [
            {
              t: 'A point has more than one name',
              html: V.numberLine(0, 1, [{ pos: 0.75, label: '0.75', color: '#e85d04' }]) +
                    `<p>That same point is also ${fr(3, 4)}, ${fr(6, 8)}, and ${fr(75, 100)}. If two names sit on the same point, they are equal.</p>`,
              try: () => genCompareEq(),
              remember: 'To check equality, rename both as hundredths (or as decimals) and see if they match.'
            }
          ]
        },
        {
          id: 'u4c5', name: 'Ratios', icon: '🔗',
          cards: [
            {
              t: 'Two amounts, in order',
              html: `<p>A ratio compares two amounts, in order. 3 red tiles to 5 blue tiles is <b>3 : 5</b>. You can also write 3 to 5 or ${fr(3, 5)}.</p>
                     <p>Order matters: 3 : 5 is not the same as 5 : 3.</p>`,
              try: () => genRatioCore(),
              remember: 'Write the amounts in the same order as the words.'
            },
            {
              t: 'Equivalent ratios scale together',
              html: `<p>3 : 5, 6 : 10, and 9 : 15 are the same comparison. Multiply (or divide) <b>both</b> parts by the same number.</p>`,
              try: () => genRatioCore(),
              remember: 'If you change only one part, the ratio is no longer equivalent.'
            }
          ]
        },
        {
          id: 'u4c6', name: 'Percents', icon: '💯',
          cards: [
            {
              t: 'Percent means per 100',
              html: `<p>Percent means “per hundred.” ${fr(1, 4)} = 0.25 = 25 hundredths = <b>25%</b>.</p>
                     <p>A hundredths grid makes this easy to see: 25 shaded squares out of 100 is 25%.</p>`,
              try: () => genPercentCore(),
              remember: 'Fraction, decimal, and percent can name the exact same amount. Unit 7 goes further with ordering and circle graphs.'
            },
            {
              t: 'Fraction, decimal, percent',
              html: `<p>To rename a fraction as a percent, write it as hundredths when you can: ${fr(3, 5)} = ${fr(60, 100)} = 0.60 = <b>60%</b>.</p>
                     <p>To go the other way, 40% = ${fr(40, 100)} = ${fr(2, 5)} = 0.4.</p>`,
              try: () => genF2P(),
              remember: 'Move the decimal point two places when you go between a percent and a decimal: 0.4 = 40%, and 7% = 0.07.'
            },
            {
              t: 'Percent of a number: 10% steps',
              html: `<p>30% of 80: the whole bar is 100% = 80. Cut it into 10 parts, so 10% = 80 ÷ 10 = 8. Then 30% is 3 parts: 8 + 8 + 8 = <b>24</b>.</p>`,
              watch: { id: 'pctof', p: 30, n: 80 },
              try: () => genPctOf(),
              remember: 'Find 10% first (divide by 10), then count up the 10% parts you need.'
            },
            {
              t: 'Percent of a number: friendly fractions',
              html: `<p>50% is ${fr(1, 2)}, 25% is ${fr(1, 4)}, 75% is ${fr(3, 4)}. 25% of 80: cut 80 into 4 parts, 20 each, so the answer is <b>20</b>.</p>`,
              watch: { id: 'pctof', p: 25, n: 80, wrong: '25' },
              try: () => genPctOf(),
              remember: '25% of 80 is not 25. The answer is always a part of the whole, so it is less than 80.'
            },
            {
              t: 'Percent of a number: 5% is half of 10%',
              html: `<p>15% of 60: 10% = 6, so 5% = 3. 15% = 10% + 5% = 6 + 3 = <b>9</b>.</p>`,
              watch: { id: 'pctof', p: 15, n: 60 },
              try: () => genPctOf()
            }
          ]
        }
      ],
      skills: [
        { id: 'f2d', name: 'Fraction → decimal', gen: genF2D },
        { id: 'd2f', name: 'Decimal → fraction', gen: genD2F },
        { id: 'model', name: 'Read a model', gen: genModel },
        { id: 'eighth', name: 'Eighths', gen: genEighthSafe },
        { id: 'third', name: 'Thirds', gen: genThird },
        { id: 'equal', name: 'Select equivalents', gen: genCompareEq },
        { id: 'nline', name: 'Number line', gen: genLine },
        { id: 'ratios', name: 'Ratios', gen: genRatioCore },
        { id: 'percents', name: 'Percents', gen: genPercentCore },
        { id: 'f2p', name: 'Fraction ↔ percent', gen: genF2P },
        { id: 'pctof-core', name: 'Percent of a number', gen: genPctOf }
      ],
      test: testCore
    },
    advanced: {
      intro: 'Go Further: equivalent ratios, ratio tables, percent of a number, and fraction–decimal–percent conversions.',
      lessons: [
        {
          id: 'u4a1', name: 'Ratios', icon: '🔗',
          cards: [
            {
              t: 'A ratio compares two amounts',
              html: `<p>If a team has 3 red jerseys and 5 blue ones, the ratio of red to blue is <b>3 : 5</b>. You can also write it as ${fr(3, 5)}.</p>
                     <p>Order matters: 3 : 5 is not the same as 5 : 3.</p>`
            },
            {
              t: 'Equivalent ratios scale together',
              html: `<p>3 : 5, 6 : 10, and 9 : 15 are the same comparison. You multiply (or divide) <b>both</b> parts by the same number.</p>`,
              try: () => genRatio(),
              remember: 'If you change only one part, the ratio is no longer equivalent.'
            }
          ]
        },
        {
          id: 'u4a2', name: 'Ratio tables', icon: '▦',
          cards: [
            {
              t: 'A table of equal ratios',
              html: `<p>Each column is a scaled copy of the first pair. If juice mix is 2 cups concentrate to 5 cups water, then 4 to 10 and 6 to 15 stay tasty in the same way.</p>`,
              try: () => genRatioTable()
            }
          ]
        },
        {
          id: 'u4a3', name: 'Percent as a name', icon: '💯',
          cards: [
            {
              t: 'Out of 100',
              html: `<p>Percent means “per hundred.” ${fr(3, 4)} = 0.75 = 75 hundredths = <b>75%</b>.</p>`,
              remember: 'Fraction, decimal, and percent can name the exact same amount.'
            },
            {
              t: 'Mixed numbers greater than 100%',
              html: `<p>${mixed(1, 1, 2)} = 1.5 = <b>150%</b>. More than one whole is more than 100%.</p>`,
              try: () => genPercent()
            }
          ]
        },
        {
          id: 'u4a4', name: 'Percent of a number', icon: '🧮',
          cards: [
            {
              t: 'A percent of a number',
              html: `<p>25% of 80 means ${fr(25, 100)} of 80, or 0.25 × 80. That is <b>20</b>.</p>
                     <p>Friendly percents help: 50% is half, 25% is one fourth, 10% is one tenth.</p>`,
              watch: { id: 'pctof', p: 75, n: 40 },
              try: () => genPctOf(),
              remember: '25% of 80 is not 25. The percent tells you the share, not the answer by itself.'
            }
          ]
        }
      ],
      skills: [
        { id: 'ratio', name: 'Equivalent ratios', gen: genRatio },
        { id: 'rtable', name: 'Ratio tables', gen: genRatioTable },
        { id: 'pct', name: 'Fraction → percent', gen: genPercent },
        { id: 'mixpct', name: 'Mixed number → percent', gen: genMixPct },
        { id: 'pctof', name: 'Percent of a number', gen: genPctOf },
        { id: 'f2p-adv', name: 'Fraction ↔ percent', gen: genF2P }
      ],
      test: testAdv
    }
  };
})();

/* Proportions & better buy (Advanced, after Ratio tables). Built in Unit 6 first, moved here in rev 4:
   proportions and the better buy are ratio reasoning. Unit rates stay in Unit 6 (linked from the first card). */
(function () {
  if (!window.UNIT || !window.V2L) return;
  var L = V2L, mc = L.mc;
  function propQ(lv, kind){
    {
      /* Missing value in a proportional table, "is it proportional?", equivalent ratios. Whole-number unit rates. */
      var C = L.pick([['hours','miles'],['packs','cards'],['minutes','pages'],['bags','apples'],['days','dollars saved']]);
      var k = kind != null ? kind : L.pick([0, 0, 1, 1, 2, 2, 3]);
      if (k === 0 || k === 1) {
        var r = L.ri(2, 12), a = L.ri(2, 5), b = a + L.ri(2, 6), add = b*r - a*r, addTrap = a*r + (b - a);
        var tb = L.tbl([C[0], String(a), String(b)], [[C[1], String(a*r), '?']]);
        if (k === 0) return {type:'num', fmt:'TYPE IN', q:'This table is proportional. What is the missing value?' + tb, a:b*r, why:'Unit rate: ' + a*r + ' ÷ ' + a + ' = ' + r + ' ' + C[1] + ' per 1. Then ' + b + ' × ' + r + ' = <b>' + b*r + '</b>.'};
        return mc('This table is proportional. What is the missing value?' + tb, String(b*r), [
          [String(addTrap), 'That adds ' + (b - a) + ' to the top AND the bottom. Proportional means multiply by the same rate: ' + r + ' ' + C[1] + ' per 1.'],
          [String(r), 'That is the unit rate (for 1). Now multiply by ' + b + '.'],
          [String(b*r + r), 'Check: ' + b + ' × ' + r + ' = ' + b*r + '.']],
          a*r + ' ÷ ' + a + ' = ' + r + ' per 1, so ' + b + ' × ' + r + ' = <b>' + b*r + '</b>.');
      }
      if (k === 2) {
        var m = L.ri(2, 8), x0 = L.ri(1, 3), xs = [x0, x0 + 1, x0 + 3, x0 + 5], yes = Math.random() < .5, plus = L.ri(1, 5);
        var ys = xs.map(function(x){ return yes ? m*x : m*x + plus; });
        return mc('Is this table proportional?' + L.tbl(['x'].concat(xs), [['y'].concat(ys)]), yes ? 'Yes: y ÷ x is ' + m + ' every time' : 'No: y ÷ x changes', [
          [yes ? 'No: y ÷ x changes' : 'Yes: y ÷ x is ' + m + ' every time', 'Divide y ÷ x for EVERY column. ' + (yes ? 'They all equal ' + m + '.' : ys[0] + ' ÷ ' + xs[0] + ' and ' + ys[2] + ' ÷ ' + xs[2] + ' are different.')],
          ['Yes: y always goes up', 'Going up is not enough. y ÷ x has to stay the same.'],
          ['No: the x-values skip numbers', 'Skipping is fine. Check y ÷ x in each column.']],
          yes ? 'Every y ÷ x = ' + m + ', so it is proportional (y = ' + m + ' × x).' : 'y ÷ x is not the same in every column (each y has ' + plus + ' extra), so it is not proportional.');
      }
      var u = L.ri(2, 9), ch = [], seen = {};
      [1, 2, 3, 4, 5, 6, 7, 8].forEach(function(n){ if (ch.length < 5 && Math.random() < .6) { var right = ch.filter(function(c){ return c.ok; }).length < 3 && Math.random() < .55, top = right ? u*n : u*n + L.pick([1, -1, u]); if (top > 0 && !seen[top + ':' + n]) { seen[top + ':' + n] = 1; ch.push({t:top + ' : ' + n, ok:top === u*n}); } } });
      if (ch.length < 4 || !ch.some(function(c){ return c.ok; }) || ch.every(function(c){ return c.ok; })) return null;
      ch = L.shuffle(ch);
      return {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> the ratios that match a unit rate of <b>' + u + ' per 1</b>.', ch:ch.map(function(c){ return c.t; }), a:ch.map(function(c, i){ return c.ok ? i : -1; }).filter(function(i){ return i >= 0; }), why:'Divide the first number by the second: it must be ' + u + '. ' + ch.map(function(c){ var p = c.t.split(' : '); return c.t + (c.ok ? ' → ' + u + ' ✓' : ' → not ' + u); }).join('; ') + '.'};
    }
  }
  function buyQ(lv, kind){
    {
      /* Unit prices in whole cents, so every answer is exact money. */
      var I = L.pick([['notebooks','notebook'],['granola bars','granola bar'],['juice boxes','juice box'],['markers','marker'],['ounces of cereal','ounce']]);
      var n1 = L.ri(2, 6), n2 = n1 + L.ri(2, 6), c1 = 5 * L.ri(6, 40), d = 5 * L.ri(1, 4) * (Math.random() < .5 ? -1 : 1), c2 = c1 + d;
      if (c2 <= 0) return null;
      var p1 = c1 * n1, p2 = c2 * n2, usd = function(c){ return '$' + (c / 100).toFixed(2); }, best = c1 < c2 ? 'A' : 'B';
      var k = kind != null ? kind : L.pick([0, 0, 1, 2]);
      var stores = 'Store A: <b>' + n1 + ' ' + I[0] + ' for ' + usd(p1) + '</b>. Store B: <b>' + n2 + ' ' + I[0] + ' for ' + usd(p2) + '</b>.';
      var why = 'Price for one: A ' + usd(p1) + ' ÷ ' + n1 + ' = ' + usd(c1) + ', B ' + usd(p2) + ' ÷ ' + n2 + ' = ' + usd(c2) + '. The lower price for one is the better buy.';
      if (k === 0) {
        var lowerTotal = p1 < p2 ? 'A' : 'B';
        return mc(stores + ' Which is the better buy?', 'Store ' + best + ' (' + usd(Math.min(c1, c2)) + ' each)', [
          ['Store ' + (best === 'A' ? 'B' : 'A') + ' (' + usd(Math.max(c1, c2)) + ' each)', 'Compare the price for ONE, not the total.'],
          lowerTotal !== best ? ['Store ' + lowerTotal + ', because it costs less in all', 'A lower total buys fewer ' + I[0] + '. Compare the price for one.'] : best === 'A' ? ['Store B, because you get more', 'More ' + I[0] + ' is not always cheaper. Compare the price for one.'] : null,
          ['They are the same deal', 'Find each price for one: ' + usd(c1) + ' and ' + usd(c2) + '.']].filter(Boolean), why);
      }
      if (k === 1) { var w = Math.random() < .5 ? 1 : 2, nn = w === 1 ? n1 : n2, pp = w === 1 ? p1 : p2, cc = w === 1 ? c1 : c2, v = cc / 100;
        return {type:'num', fmt:'TYPE IN', q:(w === 1 ? 'Store A' : 'Store B') + ' sells <b>' + nn + ' ' + I[0] + ' for ' + usd(pp) + '</b>. What is the price for one ' + I[1] + ', in dollars?', a:v, acc:[v, v.toFixed(2), '$' + v.toFixed(2), '$' + L.num(v)], placeholder:'$0.00', why:usd(pp) + ' ÷ ' + nn + ' = <b>' + usd(cc) + '</b> per ' + I[1] + '.'}; }
      var save = Math.abs(c1 - c2) / 100;
      return {type:'num', fmt:'TYPE IN', q:stores + ' How much do you save on <b>each</b> ' + I[1] + ' at the better store, in dollars?', a:save, acc:[save, save.toFixed(2), '$' + save.toFixed(2), '$' + L.num(save)], placeholder:'$0.00', why:why + ' ' + usd(Math.max(c1, c2)) + ' − ' + usd(Math.min(c1, c2)) + ' = <b>' + usd(Math.abs(c1 - c2)) + '</b> saved on each.'};
    }
  }
  var gens = {
    prop: {name:'Proportions', f:function(lv, kind){ for (var t = 0; t < 8; t++) { var it = propQ(lv, kind); if (it) return it; } return null; }},
    buy: {name:'Better buy', f:function(lv, kind){ return buyQ(lv, kind); }}
  };
  var lesson = {id:'u4a5', name:'Proportions & better buy', icon:'🏷️', cards:[
    {t:'Missing value: find the rate for one', html:L.tbl(['hours','2','5','8'], [['miles','90','?','?']]) + '<p>Rate for one: 90 ÷ 2 = <b>45 miles per hour</b>. Then 5 × 45 = 225 and 8 × 45 = 360.</p>' + '<p class="note">The rate for one is a <b>unit rate</b>. More practice: <a href="unit6.html">Unit 6, Advanced: Unit rates</a>.</p>',
     steps:['Find the rate for 1: divide the bottom by the top in a full column.', 'Multiply that rate by the new top number.', 'Check: 225 ÷ 5 = 45, the same rate.'],
     trap:'Adding instead of multiplying: 2 → 5 is + 3, but 90 + 3 = 93 is wrong. A proportion keeps the same rate, not the same difference.',
     tries:[function(){ return gens.prop.f('adv', 0); }, function(){ return gens.prop.f('adv', 1); }]},
    {t:'Is it proportional?', html:'<p>A table is <b>proportional</b> when y ÷ x is the <b>same in every column</b>.</p>' + L.tbl(['x','1','2','4'], [['y','3','6','12']]) + '<p>3 ÷ 1 = 6 ÷ 2 = 12 ÷ 4 = 3. Yes! On a graph it is a straight line through (0, 0).</p>',
     trap:'A table that always goes up is not automatically proportional. x = 1, 2, 3 with y = 5, 7, 9 goes up, but 5 ÷ 1 is not 7 ÷ 2.',
     tries:[function(){ return gens.prop.f('adv', 2); }, function(){ return gens.prop.f('adv', 3); }]},
    {t:'Better buy: price for one', html:'<p>Store A: 3 notebooks for $2.40. Store B: 5 notebooks for $3.75.</p>' + L.tbl(['Store','Price for one'], [['A','$2.40 ÷ 3 = $0.80'],['B','$3.75 ÷ 5 = <b>$0.75</b>']]) + '<p>B costs less for each notebook, so <b>B is the better buy</b>.</p>',
     remember:'Better buy = lower price for ONE. Divide the price by how many.',
     trap:'Picking the smaller total. $2.40 is less than $3.75, but it buys fewer notebooks.',
     aap:'Compare without dividing. Make the amounts match: 15 notebooks cost 5 × $2.40 = $12 at A, and 3 × $3.75 = $11.25 at B.',
     tries:[function(){ return gens.buy.f('adv', 0); }, function(){ return gens.buy.f('adv', 1); }]}
  ]};
  var adv = UNIT.advanced, at = adv.lessons.findIndex(function (x) { return x.id === 'u4a2'; });
  adv.lessons.splice(at >= 0 ? at + 1 : adv.lessons.length, 0, lesson);
  var sk = adv.skills.findIndex(function (x) { return x.id === 'rtable'; });
  adv.skills.splice(sk >= 0 ? sk + 1 : adv.skills.length, 0,
    { id: 'prop', name: 'Proportions', gen: function () { return gens.prop.f('adv'); } },
    { id: 'buy', name: 'Better buy', gen: function () { return gens.buy.f('adv'); } });
  adv.intro = 'Go Further: equivalent ratios, ratio tables, proportions and the better buy, percent of a number, and fraction–decimal–percent conversions.';
})();

/* Graphs of rates (Advanced, after Proportions & better buy). Tier 2, rev 4: a ratio table plotted on the
   grid makes a straight line through (0, 0); the point (1, r) shows the unit rate. */
(function () {
  if (!window.UNIT || !window.V2L) return;
  var L = V2L, mc = L.mc;
  /* Quadrant I grid with optional rays from (x0, y0) through slope m. Returns HTML (the audit stubs V). */
  function graph(pts, lines, n) {
    var s = V.planeSVG(pts.map(function (p) { return { x: p[0], y: p[1], label: p[2] }; }), { n: n || 10 });
    if (typeof s === 'string' || !s || !s.__geo) return typeof s === 'string' ? s : '';
    var G = s.__geo, NS = 'http://www.w3.org/2000/svg', top = s.querySelector('.cp-pts');
    (lines || []).forEach(function (l) {
      var x1 = l.x2 != null ? l.x2 : Math.min(G.n, (G.n - l.b) / l.m), y1 = l.b + l.m * x1;
      var e = document.createElementNS(NS, 'line');
      [['x1', G.px(0)], ['y1', G.py(l.b)], ['x2', G.px(x1)], ['y2', G.py(y1)], ['stroke', l.color || 'var(--ic)'], ['stroke-width', '3.5'], ['stroke-linecap', 'round']].concat(l.dash ? [['stroke-dasharray', '7 6']] : []).forEach(function (a) { e.setAttribute(a[0], a[1]); });
      s.insertBefore(e, top);
    });
    return '<div class="viz">' + s.outerHTML + '</div>';
  }
  function rgraphQ(lv, kind) {
    var k = kind != null ? kind : L.pick([0, 0, 1, 1, 2, 3]);
    var m = L.ri(2, 4), C = L.pick([['hours', 'miles'], ['packs', 'stickers'], ['minutes', 'laps'], ['tickets', 'dollars']]);
    var xs = [1, 2, 3].map(function (x) { return x; }), pts = xs.map(function (x) { return [x, m * x, '(' + x + ', ' + m * x + ')']; });
    if (k === 0) return { type: 'num', fmt: 'TYPE IN', q: 'The graph shows ' + C[1] + ' for ' + C[0] + '. How many ' + C[1] + ' for <b>1</b> ' + C[0].replace(/s$/, '') + '? (the unit rate)' + graph(pts, [{ m: m, b: 0 }], 10), a: m, why: 'Find x = 1 on the line: the point is (1, ' + m + '). That is <b>' + m + ' ' + C[1] + ' per ' + C[0].replace(/s$/, '') + '</b>. Every step right 1 goes up ' + m + '.' };
    if (k === 1) { var X = L.ri(5, 9);
      return mc('The points (1, ' + m + '), (2, ' + 2 * m + '), (3, ' + 3 * m + ') lie on a straight line through (0, 0). Which point is also on the line?', '(' + X + ', ' + m * X + ')', [
        ['(' + X + ', ' + (m * 3 + (X - 3)) + ')', 'That adds 1 each step. Each step right 1 goes up ' + m + '.'],
        ['(' + m * X + ', ' + X + ')', 'x comes first, then y.'],
        ['(' + X + ', ' + (m * X + m) + ')', 'Check: ' + X + ' × ' + m + ' = ' + m * X + '.']],
        'y = ' + m + ' × x on this line. For x = ' + X + ': y = ' + m * X + '.'); }
    if (k === 2) { var prop = Math.random() < .5, b = prop ? 0 : L.ri(1, 3), pp = [1, 2].map(function (x) { return [x, m * x + b, '']; });
      return mc('Is the relationship in this graph <b>proportional</b>?' + graph(pp, [{ m: m, b: b }], 12), prop ? 'Yes: a straight line through (0, 0)' : 'No: the line does not start at (0, 0)', [
        [prop ? 'No: the line does not start at (0, 0)' : 'Yes: a straight line through (0, 0)', prop ? 'Look where the line starts: it starts at the origin.' : 'At x = 0 the line is at y = ' + b + ', not 0.'],
        ['Yes: it is a straight line', 'Straight is not enough. A proportional graph also goes through (0, 0).'],
        ['No: it goes up', 'Going up is fine. Check the start and the straightness.']].filter(function (w) { return !(prop && w[0] === 'Yes: it is a straight line'); }),
        prop ? 'Straight line through (0, 0): proportional, y = ' + m + ' × x.' : 'The line starts at (0, ' + b + '), so y ÷ x is not the same for every point: not proportional.'); }
    var X2 = L.ri(4, 8);
    return { type: 'num', fmt: 'TYPE IN', q: 'A straight line goes through (0, 0) and (2, ' + 2 * m + '). What is y when x = ' + X2 + '?', a: m * X2, why: 'Unit rate: ' + 2 * m + ' ÷ 2 = ' + m + ' per 1. So y = ' + m + ' × ' + X2 + ' = <b>' + m * X2 + '</b>.' };
  }
  var gens = { rgraph: { name: 'Graphs of rates', f: function (lv, kind) { for (var t = 0; t < 6; t++) { var it = rgraphQ(lv, kind); if (it) return it; } return null; } } };
  var lesson = { id: 'u4a6', name: 'Graphs of rates', icon: '📈', cards: [
    { t: 'Plot a ratio table', html: L.tbl(['hours', '0', '1', '2', '3'], [['miles', '0', '3', '6', '9']]) + '<p>Each column is a point: (1, 3), (2, 6), (3, 9). Plot them and they line up.</p>',
      viz: function () { return graph([[1, 3, '(1, 3)'], [2, 6, '(2, 6)'], [3, 9, '(3, 9)']], [{ m: 3, b: 0 }], 10); },
      steps: ['Each pair (x, y) from the table becomes a point.', '0 hours means 0 miles, so the line starts at (0, 0).', 'Every step right 1 goes up 3: the unit rate.'],
      trap: 'Starting the line at (1, 3). A ratio table includes (0, 0): no time, no miles.',
      tries: [function () { return gens.rgraph.f('adv', 0); }, function () { return gens.rgraph.f('adv', 1); }] },
    { t: 'Proportional means through (0, 0)', html: '<p>Two plans: Plan A costs $2 per game. Plan B costs $2 per game <b>plus</b> a $3 sign-up fee.</p>',
      viz: function () { return graph([[2, 4, 'A'], [2, 7, 'B']], [{ m: 2, b: 0 }, { m: 2, b: 3, dash: true }], 12); },
      steps: ['Plan A (solid) is a straight line through (0, 0): proportional, y = 2 × x.', 'Plan B (dashed) is straight but starts at (0, 3): not proportional.', 'Test any point: on A, y ÷ x is always 2. On B it changes.'],
      remember: 'Proportional graph = straight line through (0, 0). Both parts matter.',
      tries: [function () { return gens.rgraph.f('adv', 2); }, function () { return gens.rgraph.f('adv', 3); }] }
  ] };
  var adv = UNIT.advanced, at = adv.lessons.findIndex(function (x) { return x.id === 'u4a5'; });
  adv.lessons.splice(at >= 0 ? at + 1 : adv.lessons.length, 0, lesson);
  var sk = adv.skills.findIndex(function (x) { return x.id === 'buy'; });
  adv.skills.splice(sk >= 0 ? sk + 1 : adv.skills.length, 0, { id: 'rgraph', name: 'Graphs of rates', gen: function () { return gens.rgraph.f('adv'); } });
  adv.intro = 'Go Further: equivalent ratios, ratio tables, proportions and the better buy, graphs of rates, percent of a number, and fraction–decimal–percent conversions.';
})();

/* Go Further: y = m × x (Tier 3, rev 4: Unit 4 after proportions and graphs of rates). Grade 6 / 7 preview. */
(function () {
  if (!window.UNIT || !window.V2L) return;
  var L = V2L, mc = L.mc;
  function slopeQ(lv, kind) {
    var m = L.ri(2, 9), k = kind != null ? kind : L.pick([0, 1, 2, 3]);
    if (k === 0) return mc('A proportional table has (1, ' + m + '), (2, ' + 2 * m + '), (3, ' + 3 * m + '). Which equation fits?', 'y = ' + m + 'x', [
      ['y = x + ' + m, 'Check (2, ' + 2 * m + '): 2 + ' + m + ' = ' + (2 + m) + ', not ' + 2 * m + '. Proportional means multiply.'],
      ['x = ' + m + 'y', 'y is the output: y = ' + m + ' × x.'],
      ['y = ' + 2 * m + 'x', 'Use the y-value when x = 1: that is ' + m + '.']],
      'y ÷ x = ' + m + ' for every pair, so <b>y = ' + m + 'x</b>. The ' + m + ' is the unit rate (the slope).');
    if (k === 1) { var x = L.ri(4, 12);
      return { type: 'num', fmt: 'TYPE IN', q: 'Use <b>y = ' + m + 'x</b>. What is y when x = ' + x + '?', a: m * x, why: m + ' × ' + x + ' = <b>' + m * x + '</b>.' }; }
    if (k === 2) { var X = L.ri(2, 6);
      return { type: 'num', fmt: 'TYPE IN', q: 'A line through (0, 0) also goes through (' + X + ', ' + m * X + '). In y = mx, what is m?', a: m, why: 'm = y ÷ x = ' + m * X + ' ÷ ' + X + ' = <b>' + m + '</b>: up ' + m + ' for every 1 across.' }; }
    var a = L.ri(2, 5), b = a + L.ri(1, 4), C = L.pick([['Pump A', 'Pump B', 'liters per minute'], ['Rider A', 'Rider B', 'miles per hour']]);
    return mc(C[0] + ' follows y = ' + a + 'x. ' + C[1] + ' follows y = ' + b + 'x. Which line is steeper on a graph?', C[1] + ' (y = ' + b + 'x)', [
      [C[0] + ' (y = ' + a + 'x)', 'The bigger m goes up faster for each step across.'], ['They are equally steep', 'Different m-values make different steepness.']],
      'The steeper line has the bigger m: ' + b + ' &gt; ' + a + '. ' + C[1] + ' goes up ' + b + ' ' + C[2].split(' per ')[0] + ' for each ' + C[2].split(' per ')[1] + '.');
  }
  var gens = { slope: { name: 'y = mx (Go Further)', f: function (lv, kind) { return slopeQ(lv, kind); } } };
  var lesson = { id: 'u4a7', name: 'Go Further: y = mx', icon: '📐', cards: [
    { t: 'The rule of a proportional graph', html: L.tbl(['x', '1', '2', '3', '4'], [['y', '3', '6', '9', '12']]) + '<p>Every y is 3 times x: <b>y = 3x</b>. The number in front of x is the <b>slope</b>: up 3 for every 1 across. It is also the unit rate.</p>',
      steps: ['Find y when x = 1: that is m.', 'Check another pair: 6 ÷ 2 = 3 ✓.', 'Write y = m × x, usually written y = mx.'],
      trap: 'Writing y = x + 3. That works for (1, 4), not (1, 3). A proportional rule multiplies.',
      tries: [function () { return gens.slope.f('adv', 0); }, function () { return gens.slope.f('adv', 1); }] },
    { t: 'Bigger m, steeper line', html: '<p>y = 2x goes up 2 for each step across. y = 5x goes up 5. The bigger m, the <b>steeper</b> the line, the faster the rate.</p>',
      tries: [function () { return gens.slope.f('adv', 2); }, function () { return gens.slope.f('adv', 3); }] }
  ] };
  var adv = UNIT.advanced, at = adv.lessons.findIndex(function (x) { return x.id === 'u4a6'; });
  adv.lessons.splice(at >= 0 ? at + 1 : adv.lessons.length, 0, lesson);
  var sk = adv.skills.findIndex(function (x) { return x.id === 'rgraph'; });
  adv.skills.splice(sk >= 0 ? sk + 1 : adv.skills.length, 0, { id: 'slope', name: 'y = mx (Go Further)', gen: function () { return gens.slope.f('adv'); } });
})();
