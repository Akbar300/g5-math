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
    ]).filter((x, i, a) => a.indexOf(x) === i).slice(0, 4);
    if (!traps.includes(dec)) traps[0] = dec;
    const ch = U.shuffle(traps);
    return {
      type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
      q: `Which decimal is equal to ${fr(sn, sd)}?`,
      ch, a: ch.indexOf(dec),
      why: `${fr(sn, sd)} means ${sn} of ${sd} equal parts. As a decimal that is <b>${dec}</b>.`
    };
  }

  function genD2F() {
    const [n, d, dec, hundred] = U.pick(F100);
    const [sn, sd] = simp(n, d);
    const choices = U.shuffle([
      fr(sn, sd),
      fr(sn, sd === 10 ? 100 : 10),
      fr(sn + 1, sd),
      V.fr(hundred, 100)
    ]);
    // unique by text
    const seen = new Set(); const ch = [];
    choices.forEach((c) => { const k = U.strip(c); if (!seen.has(k)) { seen.add(k); ch.push(c); } });
    const ans = fr(sn, sd);
    if (!ch.some((c) => U.strip(c) === U.strip(ans))) ch[0] = ans;
    return {
      type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true, sol: '5.NS.1',
      q: `Which fraction is equal to <b>${dec}</b>?`,
      ch, a: ch.findIndex((c) => U.strip(c) === U.strip(ans)),
      why: `${dec} is ${hundred} hundredths = ${fr(hundred, 100)} = ${fr(sn, sd)}.`
    };
  }

  function genModel() {
    const [n, d, dec, hundred] = U.pick(F100.filter((x) => x[3] != null && x[3] % 5 === 0));
    const [sn, sd] = simp(n, d);
    return {
      type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
      q: `This hundredths grid shows a decimal. What fraction of the whole is shaded? Write it in simplest form (like 3/4).`
        + V.hundredGrid(hundred, { label: hundred + ' squares out of 100' }),
      a: [sn + '/' + sd, dec, String(hundred) + '/100'],
      placeholder: 'n/d',
      why: `${hundred} out of 100 is ${fr(hundred, 100)}, which simplifies to ${fr(sn, sd)} or ${dec}.`
    };
  }

  function genEighth() {
    const [n, d, dec] = U.pick(EIGHTHS);
    return {
      type: 'mc', fmt: 'MODEL', nocalc: true, sol: '5.NS.1',
      q: `The bar is cut into eighths. What decimal is shaded?` + V.fractionBar(n, 8, { fill: '#6c4ee0', label: n + ' of 8 parts' }),
      ch: U.shuffle([dec, '0.' + n, n === 1 ? '0.8' : '0.18', EIGHTHS[(EIGHTHS.indexOf(EIGHTHS.find(x => x[0] === n)) + 1) % 7][2]]),
      why: `${fr(n, 8)} = ${dec}. Eighths are 125 thousandths each.`
    };
  }
  // fix genEighth ch.a after shuffle - need to set a after
  function genEighthSafe() {
    const [n, d, dec] = U.pick(EIGHTHS);
    const wrong = EIGHTHS.filter((x) => x[2] !== dec).map((x) => x[2]);
    const ch = U.shuffle([dec, U.pick(wrong), n === 1 ? '0.8' : ('0.' + n), '0.1' + n]).slice(0, 4);
    if (!ch.includes(dec)) ch[0] = dec;
    return {
      type: 'mc', fmt: 'MODEL', nocalc: true, sol: '5.NS.1',
      q: `The bar is cut into eighths. What decimal is shaded?` + V.fractionBar(n, 8, { fill: '#6c4ee0', label: n + ' of 8 parts' }),
      ch, a: ch.indexOf(dec),
      why: `${fr(n, 8)} = ${dec}. Each eighth is 0.125.`
    };
  }

  function genThird() {
    const [n, d, label, acc] = U.pick(THIRDS);
    return {
      type: 'num', fmt: 'TYPE IN', nocalc: true, sol: '5.NS.1',
      q: `${fr(n, 3)} as a decimal repeats. Type the fraction OR a decimal rounded to the thousandths (for example 0.333).`
        + V.fractionBar(n, 3, { fill: '#ff5a36', label: n + ' of 3 parts' }),
      a: acc, placeholder: '0.333 or 1/3',
      why: `${fr(n, 3)} is a repeating decimal. ${n === 1 ? '0.333…' : '0.666…'} — on the SOL you may also leave it as a fraction.`
    };
  }

  function genCompareEq() {
    // equivalent or not — select all equal to a given number
    const [n, d, dec, hundred] = U.pick(F100.filter((x) => x[3] != null));
    const [sn, sd] = simp(n, d);
    const equals = [`${dec}`, `${sn}/${sd}`, `${hundred}/100`];
    const extras = ['0.' + String(sn) + String(sd), `${sn}/${sd * 10}`, String(parseFloat(dec) + 0.1)];
    const ch = U.shuffle([equals[0], equals[1], extras[0], equals[2], extras[1]]).slice(0, 5);
    const a = ch.map((c, i) => i).filter((i) => {
      const t = ch[i];
      return t === dec || t === (sn + '/' + sd) || t === (hundred + '/100');
    });
    return {
      type: 'ms', fmt: 'SELECT ALL', nocalc: true, sol: '5.NS.1',
      q: `Select <b>all</b> of the numbers that are equal to ${fr(sn, sd)}.`,
      ch, a,
      why: `${fr(sn, sd)} = ${fr(hundred, 100)} = ${dec}. Any name for the same amount counts.`
    };
  }

  function genLine() {
    const [n, d, dec] = U.pick(EIGHTHS.concat(F100.filter((x) => ['0.25', '0.5', '0.75', '0.2', '0.4', '0.8'].includes(x[2])).map((x) => [x[0], x[1], x[2]])));
    const [sn, sd] = simp(n, d);
    return {
      type: 'mc', fmt: 'NUMBER LINE', nocalc: true, sol: '5.NS.1',
      q: `Which point on the number line shows ${fr(sn, sd)}?`
        + V.numberLine(0, 1, [
          { pos: parseFloat(dec), label: 'P', color: '#ff5a36' },
          { pos: Math.max(0, parseFloat(dec) - 0.15), label: 'Q', color: '#2f80ed' },
          { pos: Math.min(1, parseFloat(dec) + 0.2), label: 'R', color: '#0fb39c' }
        ]),
      ch: ['P', 'Q', 'R'], a: 0,
      why: `${fr(sn, sd)} = ${dec}, so it sits at point <b>P</b>.`
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
    const hide = 3; // last
    const rows = `<table style="border-collapse:collapse;margin:8px auto;font-weight:800">
      <tr><th style="border:2px solid #1b2437;padding:6px 12px;background:#fff4cc">Red</th>${cols.map((c, i) => `<td style="border:2px solid #1b2437;padding:6px 12px;text-align:center">${i === hide ? '?' : c[0]}</td>`).join('')}</tr>
      <tr><th style="border:2px solid #1b2437;padding:6px 12px;background:#e8f8f4">Blue</th>${cols.map((c, i) => `<td style="border:2px solid #1b2437;padding:6px 12px;text-align:center">${c[1]}</td>`).join('')}</tr>
    </table>`;
    return {
      type: 'num', fmt: 'RATIO TABLE',
      q: `The table shows equivalent ratios. What number belongs in the ? box?${rows}`,
      a: cols[hide][0],
      why: `Every column is a multiple of ${a}:${b}. The last column is ×4, so red is ${a}×4=${cols[hide][0]}.`
    };
  }

  function genPercent() {
    const [n, d, dec, hundred] = U.pick(F100.filter((x) => x[3] != null));
    const [sn, sd] = simp(n, d);
    const pct = hundred + '%';
    const ch = U.shuffle([pct, (hundred + 10) + '%', (Math.floor(hundred / 10)) + '%', (100 - hundred) + '%']);
    return {
      type: 'mc', fmt: 'MULTIPLE CHOICE', nocalc: true,
      q: `${fr(sn, sd)} is the same amount as which percent?`,
      ch, a: ch.indexOf(pct),
      why: `${fr(sn, sd)} = ${dec} = ${hundred} hundredths = <b>${pct}</b>. Percent means “out of 100.”`
    };
  }

  function genMixPct() {
    const w = U.pick([1, 2]);
    const [n, d, dec] = U.pick([[1, 4, '0.25'], [1, 2, '0.5'], [3, 4, '0.75']]);
    const val = w + parseFloat(dec);
    const pct = Math.round(val * 100) + '%';
    return {
      type: 'num', fmt: 'TYPE IN',
      q: `Write ${mixed(w, n, d)} as a percent.`,
      a: [pct, String(Math.round(val * 100))], placeholder: '175%',
      why: `${mixed(w, n, d)} = ${w}${dec.slice(1)} = ${val} = <b>${pct}</b>.`
    };
  }

  function testCore() {
    const items = [
      genF2D(), genD2F(), genModel(), genEighthSafe(), genThird(), genCompareEq(), genLine(),
      genF2D(), genD2F(), genModel(), genCompareEq(), genEighthSafe()
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
    return [genRatio(), genRatioTable(), genPercent(), genMixPct(), genRatio(), genPercent(),
      genCompareEq(), genF2D(), genD2F(), genRatioTable(), genMixPct(), genPercent()];
  }

  window.UNIT = {
    id: 'u4', num: 4, emoji: '🍕',
    title: 'Fraction & Decimal Studio',
    short: 'Fraction–decimal sense',
    sol: ['5.NS.1'],
    blurb: 'Thirds, eighths, and factors of 100 as decimals — and back again.',
    dates: ['2026-11-16', '2026-12-04'],
    color: '#e85d04',
    core: {
      intro: 'Short lessons on naming the same amount as a fraction or a decimal. About 5–8 minutes each, no rush.',
      lessons: [
        {
          id: 'u4c1', name: 'Tenths & hundredths', icon: '🟩',
          cards: [
            {
              t: 'One whole, cut into 100',
              html: `<p>This square is one whole. It is cut into 100 equal tiny squares. Each tiny square is one hundredth, or ${fr(1, 100)}, or 0.01.</p>` + V.hundredGrid(100, { fill: '#0fb39c', label: '100 / 100 = 1 whole' })
            },
            {
              t: 'Twenty hundredths',
              html: `<p>20 tiny squares are shaded. That is 20 hundredths = ${fr(20, 100)} = ${fr(1, 5)} = <b>0.20</b> or <b>0.2</b>.</p>` + V.hundredGrid(20, { label: '20 hundredths' }),
              remember: 'Trailing zeros after the decimal point do not change the value: 0.20 = 0.2.'
            },
            {
              t: 'Tenths sit in the first place',
              html: V.placeValue('0.47') + `<p>In <b>0.47</b>, the 4 is 4 tenths and the 7 is 7 hundredths. Together they are ${fr(47, 100)}.</p>`,
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
                     <p>${fr(3, 4)} = ${fr(75, 100)} = <b>0.75</b> because 4 × 25 = 100 and 3 × 25 = 75.</p>` + V.fractionBar(3, 4, { fill: '#e85d04', label: '3 of 4 parts' })
            },
            {
              t: 'Try the rename',
              html: `<p>${fr(2, 5)}: 5 × 20 = 100, so 2 × 20 = 40. ${fr(2, 5)} = ${fr(40, 100)} = 0.40 = 0.4.</p>` + V.hundredGrid(40, { fill: '#2f80ed', label: '40 hundredths' }),
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
                    <p>${fr(1, 8)}=0.125 · ${fr(2, 8)}=0.25 · ${fr(3, 8)}=0.375 · ${fr(4, 8)}=0.5<br>${fr(5, 8)}=0.625 · ${fr(6, 8)}=0.75 · ${fr(7, 8)}=0.875</p>`
                + V.fractionBar(3, 8, { fill: '#6c4ee0', label: '3 eighths = 0.375' })
            },
            {
              t: 'Thirds repeat',
              html: `<p>${fr(1, 3)} = 0.333… and ${fr(2, 3)} = 0.666… The 3s and 6s go on forever. On a test you can leave the answer as a fraction, or write three decimal digits.</p>`
                + V.numberLine(0, 1, [{ pos: 1 / 3, label: '1/3', color: '#ff5a36' }, { pos: 2 / 3, label: '2/3', color: '#2f80ed' }]),
              try: () => genEighthSafe(),
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
        }
      ],
      skills: [
        { id: 'f2d', name: 'Fraction → decimal', gen: genF2D },
        { id: 'd2f', name: 'Decimal → fraction', gen: genD2F },
        { id: 'model', name: 'Read a model', gen: genModel },
        { id: 'eighth', name: 'Eighths', gen: genEighthSafe },
        { id: 'third', name: 'Thirds', gen: genThird },
        { id: 'equal', name: 'Select equivalents', gen: genCompareEq },
        { id: 'nline', name: 'Number line', gen: genLine }
      ],
      test: testCore
    },
    advanced: {
      intro: 'Go Further: ratios and percents — more names for the same amount, plus ratio tables.',
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
              html: `<p>Percent means “per hundred.” ${fr(3, 4)} = 0.75 = 75 hundredths = <b>75%</b>.</p>`
                + V.hundredGrid(75, { fill: '#ffc43d', label: '75% of the grid' }),
              remember: 'Fraction, decimal, and percent can name the exact same amount.'
            },
            {
              t: 'Mixed numbers greater than 100%',
              html: `<p>${mixed(1, 1, 2)} = 1.5 = <b>150%</b>. More than one whole is more than 100%.</p>`,
              try: () => genPercent()
            }
          ]
        }
      ],
      skills: [
        { id: 'ratio', name: 'Equivalent ratios', gen: genRatio },
        { id: 'rtable', name: 'Ratio tables', gen: genRatioTable },
        { id: 'pct', name: 'Fraction → percent', gen: genPercent },
        { id: 'mixpct', name: 'Mixed number → percent', gen: genMixPct }
      ],
      test: testAdv
    }
  };
})();
