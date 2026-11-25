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

  function genMode() {
    const sets = [[3, 5, 5, 7, 8, 8, 8], [2, 4, 4, 6, 9], [6, 6, 7, 9, 9, 9, 10], [1, 3, 3, 3, 5, 8], [11, 12, 12, 14, 15]];
    const d = U.shuffle(U.pick(sets).slice());
    const m = mode(d);
    return { type: 'num', fmt: 'TYPE IN', sol: '5.PS.2', q: `What is the <b>mode</b> of this data: <b>${d.join(', ')}</b>?`, a: m,
      why: `Count how often each value shows up. <b>${m}</b> appears ${d.filter((x) => x === m).length} times, more than any other value.` };
  }
  function genCenterMix() {
    const d = sampleData().slice(0, 5); const m = mean(d), md = median(d), mo = mode(d), r = range(d);
    const ch = [`range = ${r}`, `median = ${md}`, `mean = ${+m.toFixed(2)}`, `range = ${r + 2}`, `median = ${md + 1}`];
    return { type: 'ms', fmt: 'SELECT ALL', sol: '5.PS.2', q: `Data: <b>${d.join(', ')}</b>. Select <b>all</b> true statements.`, ch, a: [0, 1, 2],
      why: `Ordered: ${d.slice().sort((a, b) => a - b).join(', ')}. Median ${md}, mean ${d.reduce((s, x) => s + x, 0)} ÷ ${d.length} = ${+m.toFixed(2)}, range ${Math.max(...d)} − ${Math.min(...d)} = ${r}${mo == null ? ', no mode' : ', mode ' + mo}.` };
  }
  function genBarRead() {
    const cats = U.pick([['Apple', 'Banana', 'Grape', 'Orange'], ['Dogs', 'Cats', 'Fish', 'Birds'], ['Mon', 'Tue', 'Wed', 'Thu']]);
    const vals = cats.map(() => U.ri(2, 12));
    let i = U.ri(0, 3), j = (i + U.ri(1, 3)) % 4; if (vals[i] === vals[j]) vals[i] += 2;
    const big = vals[i] > vals[j] ? i : j, sm = big === i ? j : i;
    return { type: 'num', fmt: 'TYPE IN', sol: '5.PS.1', q: `How many more votes did <b>${cats[big]}</b> get than <b>${cats[sm]}</b>?` + V.barGraph(cats, vals, { title: 'Class votes' }),
      a: vals[big] - vals[sm], why: `${cats[big]} ${vals[big]} − ${cats[sm]} ${vals[sm]} = <b>${vals[big] - vals[sm]}</b>.` };
  }
  function genDoubleBar() {
    const a = [U.ri(4, 12), U.ri(4, 12)], b = [U.ri(4, 12), U.ri(4, 12)]; if (a[1] === b[1]) a[1]++;
    const big = a[1] > b[1] ? 'Grade 4' : 'Grade 5';
    const tbl = `<table class="g5t"><tr><th>Books read</th><th>Week 1</th><th>Week 2</th></tr><tr><td>Grade 4</td><td>${a[0]}</td><td>${a[1]}</td></tr><tr><td>Grade 5</td><td>${b[0]}</td><td>${b[1]}</td></tr></table>`;
    return { type: 'num', fmt: 'TYPE IN', sol: '5.PS.1', q: `A double bar graph shows this data. In Week 2, how many more books did <b>${big}</b> read?` + tbl,
      a: Math.abs(a[1] - b[1]), why: `Week 2: ${Math.max(a[1], b[1])} − ${Math.min(a[1], b[1])} = <b>${Math.abs(a[1] - b[1])}</b>.` };
  }
  function genLineGraph() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']; const ys = [U.ri(1, 4)]; for (let k = 1; k < 5; k++) ys.push(ys[k - 1] + U.ri(0, 4));
    let bi = 1; for (let k = 2; k < 5; k++) if (ys[k] - ys[k - 1] > ys[bi] - ys[bi - 1]) bi = k;
    const tbl = `<table class="g5t"><tr>${days.map((d) => `<th>${d}</th>`).join('')}</tr><tr>${ys.map((v) => `<td>${v}</td>`).join('')}</tr></table>`;
    return { type: 'num', fmt: 'TYPE IN', sol: '5.PS.1', q: `A line graph shows plant height (cm) each day. How many cm did it grow from <b>${days[bi - 1]}</b> to <b>${days[bi]}</b>?` + tbl,
      a: ys[bi] - ys[bi - 1], why: `${ys[bi]} − ${ys[bi - 1]} = <b>${ys[bi] - ys[bi - 1]}</b> cm. On the graph, that is the steepest climb.` };
  }
  function genWhichGraph() {
    const items = [['the temperature every hour from 8 a.m. to 3 p.m.', 'Line graph'], ['the favorite sport of each student, by sport', 'Bar graph'],
      ['what percent of the class budget goes to each activity', 'Circle graph'], ['test scores like 72, 85, 88, 91, keeping every score', 'Stem-and-leaf plot'],
      ['how many siblings each student has (0 to 5)', 'Line plot']];
    const [what, right] = U.pick(items);
    const ch = U.shuffle(['Line graph', 'Bar graph', 'Circle graph', 'Stem-and-leaf plot', 'Line plot']);
    return { type: 'mc', fmt: 'MULTIPLE CHOICE', sol: '5.PS.1', q: `Which graph is best to show <b>${what}</b>?`, ch, a: ch.indexOf(right),
      why: `${right}: ${{ 'Line graph': 'change over time', 'Bar graph': 'comparing categories', 'Circle graph': 'parts of one whole', 'Stem-and-leaf plot': 'two-digit data, every value kept', 'Line plot': 'how often each small number shows up' }[right]}.` };
  }

  function testCore() {
    return [genQuestion(), genLineRead(), genLineTotal(), genStem(), genMean(), genMedian(), genRange(),
      genLineRead(), genStem(), genMean(), genMedian(), genRange(), genMode(), genBarRead(), genLineGraph(), genWhichGraph()];
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
            { t: 'Median: the middle', html: `<p>Put the data <b>in order</b>, then find the middle.</p>
              <p>Odd count: 4, 7, 2, 9, 5 → 2, 4, <b>5</b>, 7, 9. The median is <b>5</b>.</p>
              <p>Even count: 3, 10, 5, 8 → 3, <b>5, 8</b>, 10. Two middle values, so take their mean: (5 + 8) ÷ 2 = <b>6.5</b>.</p>`,
              remember: 'Order first. Cross off one from each end until the middle is left.', try: () => genMedian() },
            { t: 'Mode: the most common', html: `<p>The <b>mode</b> is the value that appears most often.</p>
              <p>3, 5, 5, 7, 8, 8, 8 → <b>8</b> appears 3 times, so the mode is 8.</p>
              <p>2, 2, 6, 9, 9 → 2 and 9 tie: <b>two modes</b>. 1, 4, 6, 7 → every value once: <b>no mode</b>.</p>`,
              remember: 'A data set can have one mode, more than one mode, or no mode.', try: () => genMode() },
            { t: 'Range: the spread', html: `<p>The <b>range</b> is greatest minus least. It tells how spread out the data is.</p>
              <p>Plant heights 12, 19, 7, 15 cm: greatest 19, least 7. Range = 19 − 7 = <b>12</b> cm.</p>`,
              remember: 'Range is one number: a difference, not "7 to 19".', try: () => genRange() },
            { t: 'All four on one data set', html: `<p>Data: <b>2, 3, 3, 5, 7</b> (points scored in 5 games).</p>` +
              `<table class="g5t"><tr><th>Measure</th><th>Question it answers</th><th>How</th><th>Answer</th></tr>
              <tr><td><b>Mean</b></td><td>Fair share?</td><td>20 ÷ 5</td><td><b>4</b></td></tr>
              <tr><td><b>Median</b></td><td>Middle value?</td><td>2, 3, <b>3</b>, 5, 7</td><td><b>3</b></td></tr>
              <tr><td><b>Mode</b></td><td>Most common?</td><td>3 shows twice</td><td><b>3</b></td></tr>
              <tr><td><b>Range</b></td><td>How spread out?</td><td>7 − 2</td><td><b>5</b></td></tr></table>`,
              remember: 'Mean, median, and mode describe the center. Range describes the spread.', try: () => genCenterMix() }
          ]
        },
        {
          id: 'u1c5', name: 'Bar & line graphs', icon: '📊',
          cards: [
            { t: 'Bar graphs compare groups', html: `<p>A <b>bar graph</b> compares categories. Read the top of each bar against the scale.</p>
              <p>Favorite fruit: Apple 8, Banana 5, Grape 9, Orange 3. Grape is greatest. Grape has 9 − 3 = <b>6</b> more votes than Orange.</p>`,
              remember: 'Check the scale first: it may count by 2s or 5s.', try: () => genBarRead() },
            { t: 'Double bar graphs', html: `<p>A <b>double bar graph</b> compares two groups side by side, with a key.</p>
              <p>Books read: Grade 4 vs Grade 5. Week 1: 6 and 8. Week 2: 10 and 7. In Week 2, Grade 4 read 10 − 7 = <b>3</b> more.</p>`,
              remember: 'Use the key to tell which bar is which group.', try: () => genDoubleBar() },
            { t: 'Line graphs show change over time', html: `<p>A <b>line graph</b> connects points in time order, so you can see the trend.</p>
              <p>Plant height (cm): Mon 2, Tue 4, Wed 5, Thu 8, Fri 9. Thursday to Friday it grew 9 − 8 = 1 cm. The biggest jump is Wed to Thu: <b>3</b> cm.</p>`,
              remember: 'Up = increase, down = decrease, flat = no change.', try: () => genLineGraph() },
            { t: 'Pick the right graph', html: `<table class="g5t"><tr><th>Graph</th><th>Best for</th></tr>
              <tr><td>Line plot</td><td>How often each number shows up (small data set)</td></tr>
              <tr><td>Stem-and-leaf</td><td>Two-digit data, keeping every value</td></tr>
              <tr><td>Bar graph</td><td>Comparing categories</td></tr>
              <tr><td>Line graph</td><td>Change over time</td></tr>
              <tr><td>Circle graph</td><td>Parts of one whole (percents)</td></tr></table>`,
              remember: 'Ask: categories? change over time? parts of a whole? numbers on a line?', try: () => genWhichGraph() }
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
        { id: 'range', name: 'Range', gen: genRange },
        { id: 'mode', name: 'Mode', gen: genMode },
        { id: 'center', name: 'Mean, median, mode, range', gen: genCenterMix },
        { id: 'bars', name: 'Bar & double bar graphs', gen: () => (Math.random() < 0.5 ? genBarRead() : genDoubleBar()) },
        { id: 'lineg', name: 'Line graphs', gen: genLineGraph },
        { id: 'which', name: 'Pick the right graph', gen: genWhichGraph }
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
