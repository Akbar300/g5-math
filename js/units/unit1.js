/* Unit 1: Building Community Through the Data Cycle — 5.PS.1, 5.PS.2 */
(function () {
  const fr = (...a) => V.fr(...a);
  function mean(a) { return a.reduce((s, x) => s + x, 0) / a.length; }
  function median(a) { const b = a.slice().sort((x, y) => x - y); const m = Math.floor(b.length / 2); return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; }
  function mode(a) { const c = {}; a.forEach((x) => c[x] = (c[x] || 0) + 1); let best = a[0], n = 0; Object.keys(c).forEach((k) => { if (c[k] > n) { n = c[k]; best = +k; } }); return n <= 1 ? null : best; }
  function range(a) { return Math.max(...a) - Math.min(...a); }

  function sampleData() {
    const n = U.ri(6, 10);
    return Array.from({ length: n }, () => U.ri(2, 12));
  }

  function genLineRead() {
    const data = sampleData();
    const v = U.pick(data);
    const count = data.filter((x) => x === v).length;
    return {
      type: 'num', fmt: 'TYPE IN', sol: '5.PS.1',
      q: `This line plot shows hours of reading in one week. How many students read for <b>${v}</b> hours?` + V.linePlot(data, { title: 'Hours of Reading' }),
      a: count, why: `Count the dots above ${v}. There ${count === 1 ? 'is 1 dot' : 'are ' + count + ' dots'}.`
    };
  }
  function genLineTotal() {
    const data = sampleData();
    return {
      type: 'num', fmt: 'TYPE IN', sol: '5.PS.1',
      q: `How many students are represented on this line plot?` + V.linePlot(data, { title: 'Jump lengths (feet)' }),
      a: data.length, why: `Each dot is one student. There are ${data.length} dots in all.`
    };
  }
  function genStem() {
    const data = [];
    while (data.length < 10) data.push(U.ri(21, 58));
    const stem = Math.floor(U.pick(data) / 10);
    const count = data.filter((x) => Math.floor(x / 10) === stem).length;
    return {
      type: 'num', fmt: 'TYPE IN', sol: '5.PS.1',
      q: `How many values have a stem of <b>${stem}</b>?` + V.stemLeaf(data, { title: 'Class scores', key: 'Key: 3 | 2 means 32' }),
      a: count, why: `The leaves in the ${stem} row are the ones place. There are ${count} of them.`
    };
  }
  function genMean() {
    const data = [U.ri(2, 5), U.ri(2, 5), U.ri(6, 9), U.ri(6, 9)];
    const m = mean(data);
    const ok = Number.isInteger(m);
    return {
      type: 'num', fmt: 'TYPE IN', sol: '5.PS.2',
      q: `Four friends share ${data.reduce((s, x) => s + x, 0)} stickers so everyone has a fair share. The amounts they started with were ${data.join(', ')}. What is the mean (fair share)?`,
      a: ok ? [String(m)] : [String(m), m.toFixed(1), m.toFixed(2)],
      why: `Add the values: ${data.join(' + ')} = ${data.reduce((s, x) => s + x, 0)}. Divide by 4 (the number of friends): the fair share is <b>${ok ? m : m.toFixed(2)}</b>.`
    };
  }
  function genMedian() {
    const data = sampleData();
    const med = median(data);
    const sorted = data.slice().sort((a, b) => a - b);
    return {
      type: 'num', fmt: 'TYPE IN', sol: '5.PS.2',
      q: `Find the median of this data set: <b>${data.join(', ')}</b>.`,
      a: [String(med)], why: `Order the numbers: ${sorted.join(', ')}. The median is the middle value (or the mean of the two middle values): <b>${med}</b>.`
    };
  }
  function genRange() {
    const data = sampleData();
    return {
      type: 'num', fmt: 'TYPE IN', sol: '5.PS.2',
      q: `What is the range of this data: <b>${data.join(', ')}</b>?`,
      a: range(data),
      why: `Range is greatest minus least: ${Math.max(...data)} − ${Math.min(...data)} = <b>${range(data)}</b>.`
    };
  }
  function genQuestion() {
    const ch = U.shuffle([
      'How many pets do the students in our class have?',
      'What is the capital of Virginia?',
      'How many hours of sleep do 5th graders in our class get?',
      'Who was the first president of the United States?'
    ]);
    const good = ['How many pets do the students in our class have?', 'How many hours of sleep do 5th graders in our class get?'];
    return {
      type: 'ms', fmt: 'SELECT ALL', sol: '5.PS.1',
      q: 'Select <b>all</b> of the questions that need a data cycle (collecting measurements or counts from a group).',
      ch, a: ch.map((c, i) => i).filter((i) => good.includes(ch[i])),
      why: 'A data-cycle question is answered by collecting counts or measures from more than one person or thing — not by recalling a single fact.'
    };
  }
  function genCircle() {
    const parts = U.pick([[50, 30, 20], [40, 40, 20], [25, 25, 50], [70, 20, 10]]);
    const labels = ['Soccer', 'Art', 'Chess'];
    const i = U.ri(0, 2);
    return {
      type: 'num', fmt: 'TYPE IN',
      q: `This circle graph shows club choices for 100 students. How many chose <b>${labels[i]}</b>?` + V.pie(parts, labels.map((c, k) => c + ' ' + parts[k] + '%')),
      a: parts[i], why: `${parts[i]}% of 100 students is <b>${parts[i]}</b> students.`
    };
  }

  function testCore() {
    return [genQuestion(), genLineRead(), genLineTotal(), genStem(), genMean(), genMedian(), genRange(),
      genLineRead(), genStem(), genMean(), genMedian(), genRange()];
  }
  function testAdv() {
    return [genCircle(), genCircle(), genMean(), genMedian(), genRange(), genQuestion(),
      genCircle(), genStem(), genLineRead(), genMean(), genMedian(), genCircle()];
  }

  window.UNIT = {
    id: 'u1', num: 1, emoji: '📊', title: 'Data Detectives', short: 'Data cycle',
    sol: ['5.PS.1', '5.PS.2'], blurb: 'The data cycle, line plots, stem-and-leaf, mean as fair share.',
    dates: ['2026-08-17', '2026-09-11'], color: '#2f80ed',
    core: {
      intro: 'Follow the data cycle: ask, collect, represent, then tell what the data shows. Short lessons, no rush.',
      lessons: [
        {
          id: 'u1c1', name: 'The data cycle', icon: '🔄',
          cards: [
            { t: 'Four steps, every time', html: `<p>A data detective follows one cycle:</p>
              <ol><li><b>Formulate</b> a question that needs data.</li><li><b>Collect</b> counts or measurements (usually 30 or fewer points).</li>
              <li><b>Organize and represent</b> with a line plot or stem-and-leaf plot — title, labels, and a key.</li>
              <li><b>Analyze and communicate</b> what the data shows, and solve problems from it.</li></ol>
              <p>Example: 7 students count the pencils in their backpacks: 3, 3, 4, 5, 5, 5, 7. Most have 5.</p>`,
              remember: 'A good question cannot be answered with one remembered fact. It needs counts or measures from a group.' },
            { t: 'Which questions need data?', html: `<p>"How many minutes do students in our class spend on homework?" needs a survey. "How many minutes are in an hour?" does not — that is a known fact.</p>`, try: () => genQuestion() }
          ]
        },
        {
          id: 'u1c2', name: 'Line plots', icon: '📈',
          cards: [
            { t: 'One dot, one value', html: `<p>A line plot (dot plot) sits on a number line. Each dot is one piece of data. Same value? Stack the dots.</p>` + V.linePlot([3, 3, 4, 5, 5, 5, 7], { title: 'Pencils in backpacks' }),
              remember: 'Always include a title. The number line must be labeled.' },
            { t: 'Read a plot', html: `<p>To find how many jumped 4 feet, count the dots above 4: there are <b>3</b>. To find how many students in all, count every dot.</p>`, try: () => genLineRead() }
          ]
        },
        {
          id: 'u1c3', name: 'Stem-and-leaf', icon: '🌿',
          cards: [
            { t: 'Tens in the stem, ones in the leaf', html: `<p>In a stem-and-leaf plot, 3 | 2 5 5 means 32, 35, and 35. The key tells how to read it.</p>` + V.stemLeaf([32, 35, 35, 41, 44, 50], { title: 'Scores', key: 'Key: 3 | 2 means 32' }),
              remember: 'List leaves from least to greatest. Include a title and a key.' },
            { t: 'Read a stem', html: `<p>Count the leaves in a row to see how many values share that stem.</p>`, try: () => genStem() }
          ]
        },
        {
          id: 'u1c4', name: 'Center and range', icon: '⚖️',
          cards: [
            { t: 'Mean is a fair share', html: `<p>If 3, 5, 7, and 9 stickers are put in one pile and shared equally, each person gets the mean: (3+5+7+9) ÷ 4 = <b>6</b>.</p>`,
              remember: 'Mean = total ÷ how many values.' },
            { t: 'Median, mode, and range', html: `<p>Order the data first. The <b>median</b> is the middle (or the mean of the two middle numbers). The <b>mode</b> is the value that appears most. The <b>range</b> is greatest minus least — how spread out the data is.</p>`,
              try: () => genMedian() }
          ]
        }
      ],
      skills: [
        { id: 'qtype', name: 'Good questions', gen: genQuestion },
        { id: 'lread', name: 'Read a line plot', gen: genLineRead },
        { id: 'ltotal', name: 'Count the dots', gen: genLineTotal },
        { id: 'stem', name: 'Stem-and-leaf', gen: genStem },
        { id: 'mean', name: 'Mean (fair share)', gen: genMean },
        { id: 'median', name: 'Median', gen: genMedian },
        { id: 'range', name: 'Range', gen: genRange }
      ],
      test: testCore
    },
    advanced: {
      intro: 'Go Further: circle graphs — parts of one whole, shown as percents of a circle.',
      lessons: [
        {
          id: 'u1a1', name: 'Circle graphs', icon: '🥧',
          cards: [
            { t: 'Parts of one whole', html: `<p>A circle graph shows how one whole splits into parts. All slices add to 100%.</p>` + V.pie([50, 30, 20], ['Pizza 50%', 'Tacos 30%', 'Pasta 20%']),
              remember: 'Circle graphs only work for parts of a whole. For change over time, use a line graph.' },
            { t: 'From percent to a count', html: `<p>If 20 students are in a club and 35% chose art, that is 0.35 × 20 = 7 students.</p>`, try: () => genCircle() }
          ]
        }
      ],
      skills: [
        { id: 'pie', name: 'Read a circle graph', gen: genCircle },
        { id: 'mean2', name: 'Mean (fair share)', gen: genMean },
        { id: 'median2', name: 'Median', gen: genMedian }
      ],
      test: testAdv
    }
  };

  /* Latest G5 generators (SOL Math Quest, 2026) for 5.PS.1 and Unit 1 fair-share skills. */
  if (window.G5 && window.Adapt && UNIT) {
    const add = (stds) => {
      const have = {};
      (UNIT.core.skills || []).forEach((s) => { have[s.id] = 1; });
      (G5.skills() || []).forEach((s) => {
        if (have[s.id] || s.enrich) return;
        if (stds.indexOf(s.std) < 0) return;
        if (s.std === '5.PS.3') return;
        UNIT.core.skills.push({
          id: s.id, name: s.name,
          gen: function () { return Adapt.toLab(G5.make(s.id, 'std')); }
        });
      });
    };
    add(['5.PS.1', '5.PS.2']);
    const _test = UNIT.core.test;
    UNIT.core.test = function () {
      let items = [];
      try { items = (G5.solTest({ only: ['5.PS.1', '5.PS.2'], scale: 2, adv: 0 }) || []).map(Adapt.toLab); } catch (e) {}
      if (items.length < 12) items = items.concat(_test());
      return items.slice(0, 12);
    };
    const _at = UNIT.advanced.test;
    UNIT.advanced.test = function () {
      let items = [];
      try { items = (G5.unitMix(1, 12, { adv: 0.8 }) || []).map(Adapt.toLab); } catch (e) {}
      if (items.length < 12) items = items.concat(_at());
      return items.slice(0, 12);
    };
  }

})();
