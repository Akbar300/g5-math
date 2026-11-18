/* Word problems — real-life AAP-style problem solving for every Grade 5 unit. */
(function (w) {
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuf = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const simp = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
  const fr = (n, d) => {
    const s = simp(n, d);
    return (w.V && V.fr) ? V.fr(s[0], s[1]) : ('<span class="frac"><span class="n">' + s[0] + '</span><span class="d">' + s[1] + '</span></span>');
  };
  const mixed = (n, d) => {
    const s = simp(n, d); n = s[0]; d = s[1];
    if (d === 1) return String(n);
    if (Math.abs(n) > d) {
      const w0 = Math.trunc(n / d), r = Math.abs(n % d);
      if (!r) return String(w0);
      return (w.V && V.mixed) ? V.mixed(w0, r, d) : (w0 + ' ' + fr(r, d));
    }
    return fr(n, d);
  };
  const usd = (cents) => { cents = Math.round(cents); if (cents < 0) cents = 0; return '$' + (cents / 100).toFixed(2); };
  const NAMES = ['Maya', 'Leo', 'Sofia', 'Omar', 'Ava', 'Ethan', 'Zoe', 'Noah', 'Priya', 'Lucas', 'Nadia', 'Ben', 'Iris', 'Kai', 'Rosa', 'Jamal', 'Elena', 'Theo'];
  const nm = () => pick(NAMES);
  const strip = (s) => String(s == null ? '' : s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  function tbl(headers, rows, cap) {
    let h = '<table class="wp-table">';
    if (cap) h += '<caption>' + cap + '</caption>';
    h += '<thead><tr>' + headers.map((x) => '<th>' + x + '</th>').join('') + '</tr></thead><tbody>';
    rows.forEach((r) => { h += '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>'; });
    return h + '</tbody></table>';
  }
  function why(strategy, text) {
    return '<span class="wp-strat">Strategy: ' + strategy + '</span> ' + text;
  }
  function uniq(arr) {
    const seen = new Set();
    const out = [];
    arr.forEach((x) => {
      const k = strip(x);
      if (!k || k === 'undefined' || k === 'NaN' || seen.has(k)) return;
      seen.add(k);
      out.push(x);
    });
    return out;
  }
  function tag(it) {
    it.wp = true;
    if (it.strategy && it.why && String(it.why).indexOf('wp-strat') < 0) it.why = why(it.strategy, it.why);
    return it;
  }
  function mc(q, ans, wrongs, work, o) {
    o = o || {};
    const ch = uniq([ans].concat(wrongs));
    if (ch.indexOf(ans) < 0) ch.unshift(ans);
    if (ch.length < 3) return null;
    const mixedCh = shuf(ch.slice(0, 5));
    const a = mixedCh.indexOf(ans);
    if (a < 0) return null;
    return tag({ type: 'mc', fmt: 'MULTIPLE CHOICE', q: q, ch: mixedCh, a: a, why: work, nocalc: o.nocalc, sol: o.sol, strategy: o.strategy });
  }
  function ms(q, good, bad, work, o) {
    o = o || {};
    good = uniq(good);
    bad = uniq(bad).filter((x) => good.every((g) => strip(g) !== strip(x)));
    if (!good.length) return null;
    const ch = shuf(good.concat(bad).slice(0, 6));
    const a = ch.map((_, i) => i).filter((i) => good.some((g) => strip(g) === strip(ch[i])));
    if (!a.length) return null;
    return tag({ type: 'ms', fmt: 'SELECT ALL', q: q, ch: ch, a: a, why: work, nocalc: o.nocalc, sol: o.sol, strategy: o.strategy });
  }
  function num(q, acc, work, o) {
    o = o || {};
    const a = Array.isArray(acc) ? acc.map(String) : [String(acc)];
    return tag({ type: 'num', fmt: 'TYPE IN', q: q, a: a, why: work, placeholder: o.ph || '', nocalc: o.nocalc, sol: o.sol, strategy: o.strategy });
  }
  function multi(q, parts, work, o) {
    o = o || {};
    return tag({ type: 'multi', fmt: 'MULTI-PART', q: q, parts: parts, why: work, nocalc: o.nocalc, sol: o.sol, strategy: o.strategy });
  }
  function fracAcc(n, d) {
    const s = simp(n, d);
    const out = [s[0] + '/' + s[1], n + '/' + d, s[0] + ' / ' + s[1]];
    if (s[1] === 1) out.push(String(s[0]));
    if (s[0] > s[1] && (s[0] % s[1])) {
      const w0 = Math.floor(s[0] / s[1]), r = s[0] % s[1];
      out.push(w0 + ' ' + r + '/' + s[1], w0 + ' ' + r + ' / ' + s[1]);
    }
    if (s[1] && (100 % s[1] === 0 || 8 % s[1] === 0 || 5 % s[1] === 0 || 4 % s[1] === 0 || 2 % s[1] === 0 || 10 % s[1] === 0 || 16 % s[1] === 0)) {
      const dec = s[0] / s[1];
      const t = dec.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
      out.push(t);
    }
    return uniq(out);
  }
  function moneyAcc(cents) {
    cents = Math.round(cents);
    const d = (cents / 100).toFixed(2);
    return uniq([usd(cents), d, d.replace(/\.00$/, ''), String(cents / 100)]);
  }
  const S = {
    model: 'Draw a model',
    back: 'Work backward',
    table: 'Make a table',
    eq: 'Write an equation',
    est: 'Estimate first',
    pattern: 'Find a pattern',
    names: 'Use equivalent names',
    parts: 'Break into parts',
    reread: 'Reread the question',
    guess: 'Guess and check'
  };
  const CORE = {};
  const ADV = {};

  /* ---------- Unit 1: Data (5.PS.1, 5.PS.2) ---------- */
  CORE[1] = [
    { id: 'u1_mean_share', f: function () {
      const name = nm(), k = ri(3, 6);
      const vals = []; let sum = 0;
      for (let i = 0; i < k; i++) { const v = ri(2, 12); vals.push(v); sum += v; }
      if (sum % k) { vals[0] += (k - (sum % k)); sum += (k - (sum % k)); }
      const mean = sum / k;
      const things = pick(['stickers', 'shells', 'marbles', 'cards']);
      return num(name + ' and ' + (k - 1) + ' friends have ' + vals.join(', ') + ' ' + things + '. They share them equally. How many does each person get? (This is the mean, or fair share.)',
        [String(mean)], 'Add: ' + vals.join(' + ') + ' = ' + sum + '. Fair share: ' + sum + ' ÷ ' + k + ' = <b>' + mean + '</b>.', { strategy: S.parts, sol: '5.PS.2' });
    }},
    { id: 'u1_range_sports', f: function () {
      const team = pick(['Eagles', 'Wolves', 'Comets', 'Foxes']);
      const games = ['Fri', 'Sat', 'Sun', 'Mon'];
      const scores = games.map(function () { return ri(28, 78); });
      const lo = Math.min.apply(null, scores), hi = Math.max.apply(null, scores), range = hi - lo;
      return num('The ' + team + ' basketball scores are in the table. What is the <b>range</b> of the scores?' + tbl(['Game', 'Points'], games.map(function (g, i) { return [g, scores[i]]; }), team + ' scores'),
        [String(range)], 'Range is greatest minus least: ' + hi + ' − ' + lo + ' = <b>' + range + '</b>.', { strategy: S.table, sol: '5.PS.2' });
    }},
    { id: 'u1_table_total', f: function () {
      const clubs = ['Chess', 'Art', 'Robotics', 'Drama'];
      const votes = clubs.map(function () { return ri(6, 24); });
      const i = ri(0, clubs.length - 1);
      const total = votes.reduce(function (s, v) { return s + v; }, 0);
      const rows = clubs.map(function (c, k) { return [c, votes[k]]; });
      if (Math.random() < 0.5) {
        return num('Students voted for a club fair. How many students voted in all?' + tbl(['Club', 'Votes'], rows, 'Club fair votes'),
          [String(total)], 'Add every category: ' + votes.join(' + ') + ' = <b>' + total + '</b>.', { strategy: S.table, sol: '5.PS.1' });
      }
      return num('Students voted for a club fair. How many chose <b>' + clubs[i] + '</b>?' + tbl(['Club', 'Votes'], rows, 'Club fair votes'),
        [String(votes[i])], 'Read the ' + clubs[i] + ' row: <b>' + votes[i] + '</b> students.', { strategy: S.table, sol: '5.PS.1' });
    }},
    { id: 'u1_median_times', f: function () {
      const n = pick([5, 7]);
      const times = [];
      for (let i = 0; i < n; i++) times.push(ri(8, 28));
      const sorted = times.slice().sort(function (a, b) { return a - b; });
      const med = sorted[(n - 1) / 2];
      return num(nm() + ' recorded jump-rope times (in minutes): ' + times.join(', ') + '. What is the <b>median</b> time?',
        [String(med)], 'Order the data: ' + sorted.join(', ') + '. The middle value is <b>' + med + '</b>.', { strategy: S.table, sol: '5.PS.2' });
    }},
    { id: 'u1_most_cat', f: function () {
      const cats = ['Soccer', 'Basketball', 'Tennis', 'Swimming'];
      const votes = cats.map(function () { return ri(5, 20); });
      let mx = Math.max.apply(null, votes);
      if (votes.filter(function (v) { return v === mx; }).length > 1) votes[0] = mx + ri(2, 5);
      mx = Math.max.apply(null, votes);
      const winner = cats[votes.indexOf(mx)];
      return mc('A survey asked 5th graders for a favorite sport. Which sport got the most votes?' + tbl(['Sport', 'Votes'], cats.map(function (c, i) { return [c, votes[i]]; }), 'Favorite sport'),
        winner, cats.filter(function (c) { return c !== winner; }),
        'Compare the vote counts. ' + winner + ' has ' + mx + ', the greatest.', { strategy: S.table, sol: '5.PS.1' });
    }}
  ];
  ADV[1] = [
    { id: 'u1_mean_extra', f: function () {
      const k = 4, vals = []; let sum = 0;
      for (let i = 0; i < k; i++) { const v = ri(4, 14); vals.push(v); sum += v; }
      if (sum % k) { vals[0] += k - (sum % k); sum += k - (sum % k); }
      const mean = sum / k, unused = ri(15, 30);
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      return num('The table shows pages ' + nm() + ' read and minutes at recess (recess is extra information). What is the <b>mean</b> number of pages read?' + tbl(['Week', 'Pages', 'Recess (min)'], weeks.map(function (w0, i) { return [w0, vals[i], unused + i]; }), 'Reading log'),
        [String(mean)], 'Ignore recess. Pages: ' + vals.join(' + ') + ' = ' + sum + '. Mean = ' + sum + ' ÷ 4 = <b>' + mean + '</b>.', { strategy: S.reread, sol: '5.PS.2' });
    }},
    { id: 'u1_error_mean', f: function () {
      const vals = [ri(4, 8), ri(5, 9), ri(6, 10), ri(7, 12)];
      let sum = vals.reduce(function (s, v) { return s + v; }, 0);
      vals[0] += (4 - (sum % 4)) % 4;
      sum = vals.reduce(function (s, v) { return s + v; }, 0);
      const drop = vals[vals.length - 1];
      if ((sum - drop) % 3) return null;
      const wmean = (sum - drop) / 3, rmean = sum / 4;
      const who = nm();
      return mc(who + ' found the mean of ' + vals.join(', ') + ' and got <b>' + wmean + '</b>. What mistake did ' + who + ' most likely make?',
        'Left out ' + drop + ' and divided by 3 instead of 4.',
        ['Added correctly but divided by 5.', 'Used the range ' + (Math.max.apply(null, vals) - Math.min.apply(null, vals)) + ' as the mean.', 'Multiplied the numbers instead of adding them first.'],
        'The mean uses every value. Sum = ' + sum + '. Correct mean = ' + sum + ' ÷ 4 = <b>' + rmean + '</b>. ' + who + ' added only ' + (sum - drop) + ' and divided by 3.',
        { strategy: S.reread, sol: '5.PS.2' });
    }},
    { id: 'u1_which_q', f: function () {
      return ms('Select <b>all</b> of the questions that need a data cycle (collecting measurements or counts from a group).',
        shuf(['How many hours do 5th graders in our class sleep on a school night?', 'What is the typical number of pets in our class?', 'How do the jump lengths of students in our class compare?']).slice(0, 2),
        shuf(['Who was the first president of the United States?', 'What is the capital of Virginia?', 'What is 8 × 7?']).slice(0, 2),
        'A statistical question is answered by collecting data that can vary. Trivia and single facts do not need a data cycle.',
        { strategy: S.reread, sol: '5.PS.1' });
    }},
    { id: 'u1_two_mmr', f: function () {
      const data = shuf([ri(3, 6), ri(7, 9), ri(10, 12), ri(13, 15), ri(16, 20)]);
      const sorted = data.slice().sort(function (a, b) { return a - b; });
      return multi('A track team recorded sprint times in seconds: ' + data.join(', ') + '.',
        [{ type: 'num', q: 'What is the median time?', a: [String(sorted[2])] }, { type: 'num', q: 'What is the range of the times?', a: [String(sorted[4] - sorted[0])] }],
        'Order: ' + sorted.join(', ') + '. Median = <b>' + sorted[2] + '</b>. Range = ' + sorted[4] + ' − ' + sorted[0] + ' = <b>' + (sorted[4] - sorted[0]) + '</b>.',
        { strategy: S.table, sol: '5.PS.2' });
    }},
    { id: 'u1_strategy_disp', f: function () {
      return mc(nm() + ' asked every 5th grader how many books they read this month. The answers are whole numbers from 0 to 12, and several students read the same number. Which strategy will show both the shape of the data and any clusters?',
        'Make a line plot (dot plot) of the counts.',
        ['Find only the range and stop.', 'Write a single trivia fact about one student.', 'Convert each count to a percent of 1,000.'],
        'A line plot shows every value and how often it occurs, so clusters and gaps are easy to see.',
        { strategy: S.model, sol: '5.PS.1' });
    }},
    { id: 'u1_mean_add', f: function () {
      const n = 4, mean0 = ri(6, 10), sum0 = mean0 * n;
      const newMean = mean0 + pick([-2, -1, -0.5, 0.5, 1, 2]);
      if (newMean <= 0) return null;
      const extra = newMean * 5 - sum0;
      if (extra < 1 || Math.abs(extra - Math.round(extra * 2) / 2) > 1e-9) return null;
      const acc = (newMean === Math.round(newMean)) ? [String(newMean)] : [String(newMean), newMean.toFixed(1), newMean.toFixed(2)];
      return num('Four scores have a mean of ' + mean0 + '. A fifth score of ' + extra + ' is added. What is the new mean?',
        acc, 'The four scores total ' + mean0 + ' × 4 = ' + sum0 + '. New total ' + (sum0 + extra) + '. New mean = ' + (sum0 + extra) + ' ÷ 5 = <b>' + newMean + '</b>.',
        { strategy: S.back, sol: '5.PS.2' });
    }}
  ];

  /* ---------- Unit 2: Patterns & numbers (5.CE.4, 5.NS.2, 5.PFA.1-2) ---------- */
  CORE[2] = [
    { id: 'u2_story_eq', f: function () {
      const name = nm(), each = ri(3, 9), weeks = ri(4, 8), total = each * weeks;
      const eq = each + ' × w = ' + total;
      return mc(name + ' saves $' + each + ' each week. After some weeks, ' + name + ' has $' + total + '. Which equation can be used to find the number of weeks <i>w</i>?',
        eq,
        [total + ' × w = ' + each, 'w + ' + each + ' = ' + total, each + ' + w = ' + total],
        'Each week adds $' + each + ', so ' + each + ' times the weeks equals $' + total + ': <b>' + eq + '</b>. Then w = ' + weeks + '.',
        { strategy: S.eq, sol: '5.PFA.2' });
    }},
    { id: 'u2_allowance', f: function () {
      const start = ri(2, 6), step = ri(3, 8), week = ri(5, 8);
      const val = start + step * (week - 1);
      const seq = [1, 2, 3].map(function (k) { return start + step * (k - 1); });
      return num(nm() + ' is reading pages: Week 1 = ' + seq[0] + ' pages, Week 2 = ' + seq[1] + ' pages, Week 3 = ' + seq[2] + ' pages. The pattern continues by adding ' + step + ' pages each week. How many pages in Week ' + week + '?',
        [String(val)], 'The rule is start at ' + start + ' and add ' + step + ' each week. Week ' + week + ': ' + start + ' + ' + step + ' × ' + (week - 1) + ' = <b>' + val + '</b>.',
        { strategy: S.pattern, sol: '5.PFA.1' });
    }},
    { id: 'u2_oo_shop', f: function () {
      const pack = ri(3, 6), price = ri(2, 8), extra = ri(1, 5);
      const val = pack * price + extra;
      return num(nm() + ' buys ' + pack + ' notebooks that cost $' + price + ' each, then a pencil for $' + extra + '. What is the total cost, in dollars? (No tax.)',
        [String(val), usd(val * 100)].concat(moneyAcc(val * 100)),
        'Multiply first, then add: ' + pack + ' × ' + price + ' = ' + (pack * price) + ', plus ' + extra + ' = <b>' + val + '</b>.',
        { strategy: S.eq, sol: '5.CE.4' });
    }},
    { id: 'u2_array_prime', f: function () {
      const primes = [11, 13, 17, 19, 23, 29];
      const comps = [12, 14, 15, 16, 18, 21, 24, 25, 27];
      const isP = Math.random() < 0.5;
      const n = isP ? pick(primes) : pick(comps);
      const ans = isP ? 'Prime — only 1-by-' + n + ' (or ' + n + '-by-1) arrays' : 'Composite — more than one rectangular array';
      return mc('A teacher has ' + n + ' tiles to make a rectangular array with no leftover tiles. Is ' + n + ' prime or composite, and why?',
        ans,
        isP ? ['Composite — more than one rectangular array', 'Prime — because ' + n + ' is odd', 'Composite — because ' + n + ' is greater than 10']
            : ['Prime — only 1-by-' + n + ' (or ' + n + '-by-1) arrays', 'Prime — because ' + n + ' is odd', 'Composite — because ' + n + ' is even only'],
        isP ? n + ' has only the factors 1 and ' + n + ', so it is <b>prime</b>.' : n + ' has a factor besides 1 and itself, so it is <b>composite</b> and can make more than one array.',
        { strategy: S.model, sol: '5.NS.2' });
    }},
    { id: 'u2_inout', f: function () {
      const m = ri(2, 6), b = ri(1, 5), x = ri(3, 9), y = m * x + b;
      const askOut = Math.random() < 0.5;
      if (askOut) {
        return num('A carnival game uses the rule <b>y = ' + m + 'x + ' + b + '</b>. If the input is ' + x + ', what is the output?',
          [String(y)], 'Substitute: y = ' + m + ' × ' + x + ' + ' + b + ' = ' + (m * x) + ' + ' + b + ' = <b>' + y + '</b>.', { strategy: S.eq, sol: '5.PFA.1' });
      }
      return num('A carnival game uses the rule <b>y = ' + m + 'x + ' + b + '</b>. The output is ' + y + '. What was the input?',
        [String(x)], 'Work backward: ' + y + ' − ' + b + ' = ' + (y - b) + ', then divide by ' + m + ': ' + (y - b) + ' ÷ ' + m + ' = <b>' + x + '</b>.', { strategy: S.back, sol: '5.PFA.1' });
    }}
  ];
  ADV[2] = [
    { id: 'u2_which_eq', f: function () {
      const name = nm(), shirts = ri(8, 16), price = ri(7, 12), coupon = ri(3, 8), taxFreeSnack = ri(2, 5);
      const total = shirts * price - coupon;
      if (total <= 0) return null;
      return mc(name + ' buys ' + shirts + ' team shirts at $' + price + ' each and uses a $' + coupon + ' coupon off the shirt total. ' + name + ' also looks at a $' + taxFreeSnack + ' snack but does not buy it. Which equation gives the amount <i>c</i> ' + name + ' pays for the shirts?',
        'c = ' + shirts + ' × ' + price + ' − ' + coupon,
        ['c = ' + shirts + ' × ' + price + ' + ' + coupon, 'c = ' + shirts + ' × ' + price + ' − ' + coupon + ' + ' + taxFreeSnack, 'c = ' + shirts + ' + ' + price + ' − ' + coupon],
        'The snack was not bought, so ignore $' + taxFreeSnack + '. Multiply, then subtract the coupon: c = ' + shirts + ' × ' + price + ' − ' + coupon + ' = <b>' + total + '</b>.',
        { strategy: S.reread, sol: '5.PFA.2' });
    }},
    { id: 'u2_error_oo', f: function () {
      const a = ri(3, 8), b = ri(2, 6), c = ri(2, 5);
      const right = a + b * c;
      const wrong = (a + b) * c;
      if (right === wrong) return null;
      return mc(nm() + ' evaluated ' + a + ' + ' + b + ' × ' + c + ' and got <b>' + wrong + '</b>. What is the mistake, and what is the correct value?',
        'Added first instead of multiplying first. The correct value is ' + right + '.',
        ['Multiplied first, but the correct value is ' + wrong + '.', 'Forgot to add ' + a + '. The correct value is ' + (b * c) + '.', 'Used ' + a + ' × ' + b + ' × ' + c + ' = ' + (a * b * c) + '.'],
        'Order of operations: multiply before add. ' + b + ' × ' + c + ' = ' + (b * c) + ', then ' + a + ' + ' + (b * c) + ' = <b>' + right + '</b>. Adding first gives the incorrect ' + wrong + '.',
        { strategy: S.eq, sol: '5.CE.4' });
    }},
    { id: 'u2_pattern_nth', f: function () {
      const m = ri(3, 9), b = ri(0, 6), n = ri(8, 12);
      const y = m * n + b;
      const show = [1, 2, 3, 4].map(function (x) { return 'x=' + x + ' → ' + (m * x + b); });
      return num('A table of savings follows a rule. ' + show.join('; ') + '. What is the value when x = ' + n + '?',
        [String(y)], 'The rule is y = ' + m + 'x' + (b ? ' + ' + b : '') + '. When x = ' + n + ', y = ' + m + ' × ' + n + (b ? ' + ' + b : '') + ' = <b>' + y + '</b>.',
        { strategy: S.pattern, sol: '5.PFA.1' });
    }},
    { id: 'u2_two_eval', f: function () {
      const n = ri(4, 9), k = ri(2, 6), extra = ri(3, 12);
      const val = n * k + extra;
      return multi(nm() + ' packs ' + n + ' boxes with ' + k + ' bottles each, then adds ' + extra + ' loose bottles.',
        (function () {
          const expr = n + ' × ' + k + ' + ' + extra;
          const ch = shuf([expr, n + ' + ' + k + ' + ' + extra, n + ' × ' + k + ' × ' + extra, '(' + n + ' + ' + k + ') × ' + extra]);
          return [{ type: 'mc', q: 'Which expression represents the total number of bottles?', ch: ch, a: ch.indexOf(expr) },
         { type: 'num', q: 'How many bottles are there in all?', a: [String(val)] }];
        })(),
        'Expression: ' + n + ' × ' + k + ' + ' + extra + '. Value: ' + (n * k) + ' + ' + extra + ' = <b>' + val + '</b>.',
        { strategy: S.eq, sol: '5.PFA.2' });
    }},
    { id: 'u2_strategy', f: function () {
      return mc(nm() + ' knows the output of a function machine is 47 and the rule is “multiply by 5, then add 2.” Which strategy is the most helpful for finding the input?',
        'Work backward: subtract 2, then divide by 5.',
        ['Make a circle graph of the outputs.', 'Estimate the area of a rectangle.', 'Add 2 first, then multiply by 5 (the same order as the rule).'],
        'To undo “× 5, then + 2,” reverse the steps: subtract 2, then divide by 5. (47 − 2) ÷ 5 = 9.',
        { strategy: S.back, sol: '5.PFA.1' });
    }},
    { id: 'u2_factors_extra', f: function () {
      const n = pick([12, 18, 20, 24, 30, 36]);
      const unused = ri(40, 80);
      const facts = [];
      for (let i = 1; i <= n; i++) if (n % i === 0) facts.push(String(i));
      const distractors = [String(n + 1), String(unused), String(n - 1), String(2 * n + 1)].filter(function (x) { return facts.indexOf(x) < 0; });
      return ms('A box holds ' + n + ' markers. The closet also has a shelf that is ' + unused + ' cm high (extra information). Select <b>all</b> numbers that are factors of ' + n + ' (ways to make equal groups with none left over).',
        facts, distractors.slice(0, 3),
        'Factors of ' + n + ' are ' + facts.join(', ') + '. The shelf height is not used.',
        { strategy: S.reread, sol: '5.NS.2' });
    }}
  ];

  /* ---------- Unit 3: Whole numbers (5.CE.1) ---------- */
  CORE[3] = [
    { id: 'u3_rem_up', f: function () {
      const cap = ri(8, 24), full = ri(4, 12), left = ri(1, cap - 1);
      const total = full * cap + left, need = full + 1;
      const noun = pick(['buses', 'vans', 'boxes', 'cartons']);
      const each = pick({ buses: 'students', vans: 'players', boxes: 'cupcakes', cartons: 'bottles' }[noun] ? {
        buses: ['students', 'a bus'], vans: ['players', 'a van'], boxes: ['cupcakes', 'a box'], cartons: ['bottles', 'a carton']
      }[noun] : ['items', 'a container']);
      const item = { buses: 'students', vans: 'players', boxes: 'cupcakes', cartons: 'bottles' }[noun];
      const one = { buses: 'bus', vans: 'van', boxes: 'box', cartons: 'carton' }[noun];
      return num('Each ' + one + ' holds ' + cap + ' ' + item + '. There are ' + total + ' ' + item + '. How many ' + noun + ' are needed so everyone or everything can go?',
        [String(need)], total + ' ÷ ' + cap + ' = ' + full + ' R ' + left + '. The leftover ' + left + ' still need a ' + one + ', so you need <b>' + need + '</b> ' + noun + '.',
        { strategy: S.reread, sol: '5.CE.1' });
    }},
    { id: 'u3_rem_drop', f: function () {
      const cap = ri(6, 20), full = ri(5, 18), left = ri(1, cap - 1);
      const total = full * cap + left;
      const pack = pick(['pencil packs', 'sticker packs', 'snack packs']);
      return num('A school orders ' + total + ' items in packs of ' + cap + '. How many packs are completely full?',
        [String(full)], total + ' ÷ ' + cap + ' = ' + full + ' R ' + left + '. The question asks for <b>full</b> packs, so drop the remainder: <b>' + full + '</b>.',
        { strategy: S.reread, sol: '5.CE.1' });
    }},
    { id: 'u3_estimate', f: function () {
      const a = ri(180, 620), b = ri(18, 42);
      const ae = Math.round(a / 100) * 100, be = Math.round(b / 10) * 10;
      if (!ae || !be) return null;
      const est = ae * be;
      const traps = uniq([ae * (be / 10), ae * be * 10, a + b, (ae / 10) * be].map(function (v) { return String(Math.round(v)); })).filter(function (x) { return x !== String(est); });
      return mc('Which is the best estimate for ' + a + ' × ' + b + '?',
        String(est), traps.slice(0, 3),
        'Compatible numbers: ' + a + ' ≈ ' + ae + ' and ' + b + ' ≈ ' + be + ', so ' + ae + ' × ' + be + ' = <b>' + est + '</b>.',
        { strategy: S.est, sol: '5.CE.1' });
    }},
    { id: 'u3_fund', f: function () {
      const rows = ri(12, 28), each = ri(15, 36), total = rows * each;
      return num('A theater has ' + rows + ' rows with ' + each + ' seats in each row. How many seats are there in all?',
        [String(total)], rows + ' × ' + each + ' = <b>' + total + '</b>.', { strategy: S.eq, sol: '5.CE.1' });
    }},
    { id: 'u3_two_step', f: function () {
      const packs = ri(6, 14), each = ri(8, 16), used = ri(10, packs * each - 5);
      if (used >= packs * each) return null;
      const left = packs * each - used;
      return num(nm() + ' bought ' + packs + ' boxes of markers with ' + each + ' markers in each box, then used ' + used + ' markers on a mural. How many markers are left?',
        [String(left)], 'First ' + packs + ' × ' + each + ' = ' + (packs * each) + ', then ' + (packs * each) + ' − ' + used + ' = <b>' + left + '</b>.',
        { strategy: S.parts, sol: '5.CE.1' });
    }}
  ];
  ADV[3] = [
    { id: 'u3_theater', f: function () {
      const rows = ri(18, 32), seats = ri(20, 28), sold = ri(400, rows * seats - 50);
      const total = rows * seats;
      if (sold >= total) return null;
      const empty = total - sold, snack = ri(50, 120);
      return multi('A theater has ' + rows + ' rows of ' + seats + ' seats. ' + sold + ' tickets are sold. The snack stand sold ' + snack + ' drinks (extra information).',
        [{ type: 'num', q: 'How many seats are in the theater?', a: [String(total)] }, { type: 'num', q: 'How many seats are empty?', a: [String(empty)] }],
        'Seats: ' + rows + ' × ' + seats + ' = <b>' + total + '</b>. Empty: ' + total + ' − ' + sold + ' = <b>' + empty + '</b>. The drinks are not needed.',
        { strategy: S.parts, sol: '5.CE.1' });
    }},
    { id: 'u3_error_zero', f: function () {
      const a = ri(120, 280), b = 10 * ri(2, 7) + ri(1, 9); /* two-digit */
      const right = a * b;
      const tens = Math.floor(b / 10), ones = b % 10;
      const wrong = a * ones + a * tens; /* forgot the place-value zero on the tens partial product */
      if (wrong === right) return null;
      return mc(nm() + ' computed ' + a + ' × ' + b + ' and got ' + wrong + ' by adding ' + (a * ones) + ' (the ones partial product) to ' + (a * tens) + ' (using ' + tens + ' instead of ' + (tens * 10) + '). What is the correct product, and what was the mistake?',
        String(right) + ' — the tens partial product should be ' + a + ' × ' + (tens * 10) + ' = ' + (a * tens * 10) + '.',
        [String(wrong) + ' is already correct.', String(a * ones) + ' — only the ones digit matters.', String(right * 10) + ' — add an extra zero at the end.'],
        'Partial products: ' + a + ' × ' + ones + ' = ' + (a * ones) + ' and ' + a + ' × ' + (tens * 10) + ' = ' + (a * tens * 10) + '. Sum = <b>' + right + '</b>.',
        { strategy: S.est, sol: '5.CE.1' });
    }},
    { id: 'u3_strategy_est', f: function () {
      return mc('A school needs to know whether 48 boxes of 125 pencils are enough for 6,000 students (1 pencil each). Which strategy should you use first?',
        'Estimate first: 50 × 120 = 6,000, then compute exactly if it is close.',
        ['Add 48 + 125 + 6,000.', 'Find the median of 48, 125, and 6,000.', 'Convert 6,000 pencils to kilograms.'],
        'An estimate shows the product is near 6,000. Then check exactly: 48 × 125 = 6,000, so it is exactly enough.',
        { strategy: S.est, sol: '5.CE.1' });
    }},
    { id: 'u3_work_back', f: function () {
      const cap = ri(12, 24), leftover = ri(3, cap - 2), full = ri(6, 15);
      const start = full * cap + leftover;
      return num(nm() + ' packed bottles into crates that hold ' + cap + ' each. After filling ' + full + ' crates, ' + leftover + ' bottles were left over. How many bottles were there at the start?',
        [String(start)], 'Work backward: ' + full + ' full crates are ' + full + ' × ' + cap + ' = ' + (full * cap) + ', plus the leftover ' + leftover + ' = <b>' + start + '</b>.',
        { strategy: S.back, sol: '5.CE.1' });
    }},
    { id: 'u3_select_enough', f: function () {
      const need = pick([10000, 12000, 15000, 18000]);
      const pairs = [[125, 80], [210, 62], [148, 75], [99, 90], [250, 48], [180, 70]];
      const labeled = pairs.map(function (p) { return { t: p[0] + ' × ' + p[1], v: p[0] * p[1] }; });
      const good = labeled.filter(function (x) { return x.v >= need; }).map(function (x) { return x.t; });
      const bad = labeled.filter(function (x) { return x.v < need; }).map(function (x) { return x.t; });
      if (!good.length || !bad.length) return null;
      return ms('A fundraiser needs at least ' + need.toLocaleString('en-US') + ' points. Select <b>all</b> of the products that meet the goal.',
        good, bad,
        labeled.map(function (x) { return x.t + ' = ' + x.v; }).join('; ') + '. Compare each product with ' + need + '.',
        { strategy: S.est, sol: '5.CE.1' });
    }},
    { id: 'u3_multistep', f: function () {
      const classes = ri(4, 8), each = ri(22, 28), absent = ri(3, 10), unusedBuses = ri(2, 5);
      const going = classes * each - absent;
      if (going <= 0) return null;
      return num('A grade has ' + classes + ' classes of ' + each + ' students. ' + absent + ' students are absent on field-trip day. The school also owns ' + unusedBuses + ' spare buses (extra information). How many students go on the trip?',
        [String(going)], 'Students: ' + classes + ' × ' + each + ' = ' + (classes * each) + ', minus ' + absent + ' absent = <b>' + going + '</b>. The spare buses are not needed for this question.',
        { strategy: S.reread, sol: '5.CE.1' });
    }}
  ];

  /* ---------- Unit 4: Fraction & decimal names (5.NS.1) ---------- */
  const U4 = [
    [1, 2, '0.5', 50], [1, 4, '0.25', 25], [3, 4, '0.75', 75], [1, 5, '0.2', 20], [2, 5, '0.4', 40],
    [3, 5, '0.6', 60], [4, 5, '0.8', 80], [1, 10, '0.1', 10], [3, 10, '0.3', 30], [7, 10, '0.7', 70],
    [1, 8, '0.125', 12.5], [3, 8, '0.375', 37.5], [5, 8, '0.625', 62.5], [1, 20, '0.05', 5]
  ];
  CORE[4] = [
    { id: 'u4_recipe_dec', f: function () {
      const t = pick(U4.filter(function (x) { return x[3] === Math.round(x[3]); }));
      return num('A muffin recipe calls for ' + fr(t[0], t[1]) + ' cup of milk. How is that amount written as a decimal?',
        [t[2], String(t[3] / 100)], fr(t[0], t[1]) + ' = ' + t[3] + ' hundredths = <b>' + t[2] + '</b>.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true, ph: '0.25' });
    }},
    { id: 'u4_money_frac', f: function () {
      const cents = pick([10, 20, 25, 50, 75]);
      const [n, d] = simp(cents, 100);
      return num(nm() + ' has ' + usd(cents) + ' of a dollar. What fraction of a dollar is that? Write it in simplest form.',
        fracAcc(n, d), usd(cents) + ' is ' + cents + '/100, which simplifies to <b>' + n + '/' + d + '</b>.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true, ph: '1/4' });
    }},
    { id: 'u4_sports_pct', f: function () {
      const t = pick([[7, 10, 70], [4, 5, 80], [3, 4, 75], [9, 10, 90], [1, 2, 50], [2, 5, 40]]);
      return num('In a basketball game, ' + nm() + ' made ' + fr(t[0], t[1]) + ' of the free throws. What percent of the free throws went in?',
        [t[2] + '%', String(t[2])], fr(t[0], t[1]) + ' = ' + fr(t[2], 100) + ' = <b>' + t[2] + '%</b>.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true, ph: '70%' });
    }},
    { id: 'u4_ratio_mix', f: function () {
      let a = ri(2, 6), b = ri(3, 8), k = pick([2, 3, 4]);
      if (a === b) b = a + pick([1, 2, 3]);
      const ans = (a * k) + ' : ' + (b * k);
      return mc('A paint mix uses ' + a + ' parts blue to ' + b + ' parts white. Which ratio is equivalent?',
        ans, [a + ' : ' + (b * k), (a * k) + ' : ' + b, (a + k) + ' : ' + (b + k)],
        'Multiply both parts by ' + k + ': ' + a + ' : ' + b + ' = <b>' + ans + '</b>.',
        { strategy: S.names, sol: '5.NS.1' });
    }},
    { id: 'u4_class_pct', f: function () {
      const t = pick([[13, 20, 65], [9, 20, 45], [3, 4, 75], [2, 5, 40], [17, 20, 85], [1, 4, 25]]);
      return num('In a survey, ' + t[0] + ' of ' + t[1] + ' students chose soccer. What percent is that?',
        [t[2] + '%', String(t[2])], fr(t[0], t[1]) + ' = ' + fr(t[2], 100) + ' = <b>' + t[2] + '%</b>.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true, ph: '65%' });
    }}
  ];
  ADV[4] = [
    { id: 'u4_select_names', f: function () {
      const t = pick([[2, 5, '0.4', 40], [3, 4, '0.75', 75], [1, 2, '0.5', 50], [1, 4, '0.25', 25], [7, 10, '0.7', 70]]);
      const good = [fr(t[0], t[1]), fr(t[3], 100), t[2], t[3] + '%'];
      const bad = [fr(t[0], 100), fr(t[3], 10), String((t[3] / 1000))];
      return ms('Select <b>all</b> of the names that are equal to ' + fr(t[3], 100) + '.',
        good, bad,
        t[2] + ' = ' + t[3] + ' hundredths = ' + fr(t[3], 100) + ' = ' + fr(t[0], t[1]) + ' = ' + t[3] + '%.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u4_error_place', f: function () {
      const t = pick([[4, 10, '0.4', '4/100'], [3, 10, '0.3', '3/100'], [7, 10, '0.7', '7/100']]);
      return mc(nm() + ' said ' + t[2] + ' is equal to ' + t[3] + '. What is the mistake, and what is the correct fraction in simplest form?',
        t[2] + ' is ' + t[0] + ' tenths, which equals ' + t[0] + '/10' + (gcd(t[0], 10) > 1 ? ' = ' + fr(t[0], 10) : '') + ', not ' + t[3] + '.',
        [t[2] + ' really is ' + t[3] + '.', t[2] + ' equals ' + t[0] + '/1000.', 'The decimal point in ' + t[2] + ' should move two places to the right to make a fraction.'],
        t[2] + ' means ' + t[0] + ' tenths. ' + t[3] + ' is only ' + (parseInt(t[3], 10) / 100) + '.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u4_scale_recipe', f: function () {
      const a = pick([1, 2, 3]), b = pick([2, 3, 4, 5]);
      if (a === b) return null;
      const k = pick([2, 3, 4]);
      const unused = ri(8, 16);
      const name = nm();
      return num('A smoothie uses ' + a + ' cups of yogurt for every ' + b + ' cups of fruit. ' + name + ' also bought ' + unused + ' bananas (extra information). If ' + name + ' uses ' + (a * k) + ' cups of yogurt and keeps the same ratio, how many cups of fruit are needed?',
        [String(b * k)], 'The ratio ' + a + ' : ' + b + ' scales by ' + k + '. Fruit = ' + b + ' × ' + k + ' = <b>' + (b * k) + '</b>. The bananas are extra information.',
        { strategy: S.table, sol: '5.NS.1' });
    }},
    { id: 'u4_two_names', f: function () {
      const t = pick([[3, 4, '0.75', 75], [1, 5, '0.2', 20], [2, 5, '0.4', 40], [1, 8, '0.125', 12.5]]);
      const pctAcc = (t[3] === Math.round(t[3])) ? [t[3] + '%', String(t[3])] : [String(t[3]) + '%', String(t[3])];
      return multi('A water bottle is ' + fr(t[0], t[1]) + ' full.',
        [{ type: 'num', q: 'Write that amount as a decimal.', a: [t[2]] }, { type: 'num', q: 'Write that amount as a percent.', a: pctAcc }],
        fr(t[0], t[1]) + ' = <b>' + t[2] + '</b> = <b>' + t[3] + '%</b>.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u4_strategy_model', f: function () {
      return mc(nm() + ' wants to show that ' + fr(3, 4) + ' and 0.75 name the same amount. Which strategy is most helpful?',
        'Draw a model (hundredths grid or number line) and mark both names.',
        ['Add the numerator and the denominator.', 'Convert 0.75 to a mixed number greater than 2.', 'Find the mean of 3 and 4.'],
        'A hundredths grid with 75 squares shaded is 75/100, which simplifies to 3/4 and is 0.75.',
        { strategy: S.model, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u4_who_farther', f: function () {
      const a = pick([[3, 4, 0.75, '3/4 mile'], [2, 5, 0.4, '0.4 mile'], [1, 2, 0.5, '1/2 mile']]);
      const b = pick([[4, 5, 0.8, '0.8 mile'], [7, 10, 0.7, '70% of a mile'], [5, 8, 0.625, '5/8 mile']]);
      if (a[2] === b[2]) return null;
      const whoA = nm(), whoB = nm();
      if (whoA === whoB) return null;
      const farther = a[2] > b[2] ? whoA : whoB;
      return mc(whoA + ' ran ' + a[3] + '. ' + whoB + ' ran ' + b[3] + '. Who ran farther?',
        farther, [farther === whoA ? whoB : whoA, 'They ran the same distance.', 'There is not enough information.'],
        'Write both as decimals: ' + a[3] + ' = ' + a[2] + ' and ' + b[3] + ' = ' + b[2] + '. ' + farther + ' ran farther.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }}
  ];

  /* ---------- Unit 5: Decimal computation (5.CE.3) ---------- */
  const PRICE = [125, 150, 175, 199, 225, 250, 275, 299, 325, 350, 399, 425, 450, 499, 550, 625, 750, 800];
  CORE[5] = [
    { id: 'u5_change', f: function () {
      const p1 = pick(PRICE), p2 = pick(PRICE);
      let bill = pick([500, 1000, 2000]);
      const total = p1 + p2;
      if (total >= bill) bill = total >= 1000 ? 2000 : 1000;
      if (total >= bill) bill = 2000;
      if (total >= bill) return null;
      const ch = bill - total;
      const name = nm();
      return num(name + ' buys a snack for ' + usd(p1) + ' and a drink for ' + usd(p2) + ', and pays with ' + usd(bill) + '. How much change should ' + name + ' get?',
        moneyAcc(ch), 'Add: ' + usd(p1) + ' + ' + usd(p2) + ' = ' + usd(total) + '. Change: ' + usd(bill) + ' − ' + usd(total) + ' = <b>' + usd(ch) + '</b>.',
        { strategy: S.parts, sol: '5.CE.3', ph: '$0.00' });
    }},
    { id: 'u5_unit_price', f: function () {
      const p = pick([125, 150, 199, 250, 275, 349]), q = ri(2, 6);
      const total = p * q;
      return num('Pencils cost ' + usd(p) + ' each. ' + nm() + ' buys ' + q + ' of them (no tax). What is the total cost?',
        moneyAcc(total), q + ' × ' + usd(p) + ' = <b>' + usd(total) + '</b>.', { strategy: S.eq, sol: '5.CE.3', ph: '$0.00' });
    }},
    { id: 'u5_split', f: function () {
      const each = pick([125, 150, 175, 200, 250, 275]), n = pick([2, 4, 5]);
      const total = each * n;
      return num('A bill is ' + usd(total) + ' before tax, and ' + n + ' friends split it equally. How much does each person pay?',
        moneyAcc(each), usd(total) + ' ÷ ' + n + ' = <b>' + usd(each) + '</b>.', { strategy: S.parts, sol: '5.CE.3', ph: '$0.00' });
    }},
    { id: 'u5_ribbon', f: function () {
      const start = pick([250, 300, 400, 500, 750]), used = pick([25, 50, 75, 80, 125, 150]);
      if (used >= start) return null;
      const left = start - used;
      const s = (start / 100).toFixed(2).replace(/0$/, '').replace(/\.$/, '');
      const u = (used / 100).toFixed(2).replace(/0$/, '').replace(/\.$/, '');
      const L = (left / 100).toFixed(2).replace(/0$/, '').replace(/\.$/, '');
      return num(nm() + ' has ' + s + ' meters of ribbon and uses ' + u + ' meters for a project. How many meters are left?',
        [L, String(left / 100), (left / 100).toFixed(2)], s + ' − ' + u + ' = <b>' + L + '</b> meters. Line up the decimal points.',
        { strategy: S.parts, sol: '5.CE.3' });
    }},
    { id: 'u5_est_money', f: function () {
      const p = pick([189, 219, 279, 319, 479]), q = pick([3, 4, 5, 6]);
      const estP = Math.round(p / 100) * 100;
      const est = estP * q;
      const exact = p * q;
      return mc('About how much do ' + q + ' items costing ' + usd(p) + ' each cost in all?',
        usd(est), uniq([usd(est / 10), usd(est * 10), usd(Math.round(exact / 100) * 100 + 1000), usd(q * 100)]).filter(function (x) { return x !== usd(est); }).slice(0, 3),
        'Round ' + usd(p) + ' to ' + usd(estP) + ', then ' + q + ' × ' + usd(estP) + ' = <b>' + usd(est) + '</b>. (Exact is ' + usd(exact) + '.)',
        { strategy: S.est, sol: '5.CE.3' });
    }}
  ];
  ADV[5] = [
    { id: 'u5_cart_extra', f: function () {
      const a = pick(PRICE), b = pick(PRICE), c = pick(PRICE), skipped = pick(PRICE);
      let bill = 2000;
      const total = a + b + c;
      if (total >= bill) bill = 5000;
      if (total >= bill) return null;
      const ch = bill - total;
      const name = nm();
      return multi(name + ' puts items priced ' + usd(a) + ', ' + usd(b) + ', and ' + usd(c) + ' in a cart, and looks at a ' + usd(skipped) + ' poster but does not buy it. ' + name + ' pays with ' + usd(bill) + '.',
        [{ type: 'num', q: 'What is the total for the three items that were bought?', a: moneyAcc(total) }, { type: 'num', q: 'How much change should ' + name + ' get?', a: moneyAcc(ch) }],
        'Ignore the poster. Total ' + usd(a) + ' + ' + usd(b) + ' + ' + usd(c) + ' = ' + usd(total) + '. Change ' + usd(bill) + ' − ' + usd(total) + ' = <b>' + usd(ch) + '</b>.',
        { strategy: S.reread, sol: '5.CE.3' });
    }},
    { id: 'u5_error_point', f: function () {
      const p = pick([125, 225, 250, 375]), q = pick([3, 4, 5]);
      const right = p * q;
      const wrong = p * q / 10; /* decimal one place too far left */
      return mc(nm() + ' computed ' + q + ' × ' + usd(p) + ' and wrote ' + usd(wrong) + '. What went wrong, and what is the correct total?',
        'The decimal point was placed one place too far to the left. The correct total is ' + usd(right) + '.',
        ['The decimal point was one place too far to the right. The correct total is ' + usd(wrong / 10) + '.', usd(wrong) + ' is already correct.', 'You should add ' + q + ' and ' + usd(p) + ' instead.'],
        q + ' × ' + (p / 100).toFixed(2) + ' = ' + (right / 100).toFixed(2) + '. Count the decimal places in the factors: two places in the product: <b>' + usd(right) + '</b>.',
        { strategy: S.est, sol: '5.CE.3' });
    }},
    { id: 'u5_rate', f: function () {
      const pack = pick([4, 5, 6]), packPrice = pack * pick([75, 80, 100, 125]);
      const unit = packPrice / pack;
      const want = pack + pick([2, 3, 4]);
      const total = unit * want;
      if (unit !== Math.round(unit) || total !== Math.round(total)) return null;
      return multi('A pack of ' + pack + ' juice boxes costs ' + usd(packPrice) + '. The unit price is the same if boxes are bought separately.',
        [{ type: 'num', q: 'What is the cost of one juice box?', a: moneyAcc(unit) }, { type: 'num', q: 'What is the cost of ' + want + ' juice boxes?', a: moneyAcc(total) }],
        'Unit price: ' + usd(packPrice) + ' ÷ ' + pack + ' = ' + usd(unit) + '. Then ' + want + ' × ' + usd(unit) + ' = <b>' + usd(total) + '</b>.',
        { strategy: S.parts, sol: '5.CE.3' });
    }},
    { id: 'u5_work_back', f: function () {
      const change = pick([25, 50, 75, 100, 125, 150]);
      const bill = pick([1000, 2000]);
      const total = bill - change;
      return num(nm() + ' paid with ' + usd(bill) + ' and got ' + usd(change) + ' back. What was the total cost of the items?',
        moneyAcc(total), 'Work backward: ' + usd(bill) + ' − ' + usd(change) + ' = <b>' + usd(total) + '</b>.',
        { strategy: S.back, sol: '5.CE.3', ph: '$0.00' });
    }},
    { id: 'u5_ms_true', f: function () {
      const p = 250, q = 4, total = 1000;
      return ms('A notebook costs $2.50. Select <b>all</b> of the statements that are true.',
        ['4 notebooks cost $10.00.', '2 notebooks cost $5.00.', 'The cost of 3 notebooks is $7.50.'],
        ['4 notebooks cost $6.50.', '1 notebook costs $0.25.', '10 notebooks cost $2.50.'],
        'Multiply the unit price $2.50 by the number of notebooks. 4 × $2.50 = $10.00, 2 × $2.50 = $5.00, 3 × $2.50 = $7.50.',
        { strategy: S.eq, sol: '5.CE.3' });
    }},
    { id: 'u5_return', f: function () {
      const a = pick([399, 425, 450]), b = pick([199, 225, 250]), c = pick([99, 125, 150]);
      const paid = a + b + c, after = paid - b;
      if (after <= 0) return null;
      const name = nm();
      return num(name + ' bought items priced ' + usd(a) + ', ' + usd(b) + ', and ' + usd(c) + ', then returned the ' + usd(b) + ' item for a full refund. What is the cost of the items ' + name + ' kept?',
        moneyAcc(after), 'First add: ' + usd(paid) + '. Then subtract the returned item: ' + usd(paid) + ' − ' + usd(b) + ' = <b>' + usd(after) + '</b>.',
        { strategy: S.parts, sol: '5.CE.3', ph: '$0.00' });
    }}
  ];

  /* ---------- Unit 6: Metric (5.MG.1) ---------- */
  CORE[6] = [
    { id: 'u6_m_cm', f: function () {
      const m = ri(2, 9);
      return num('A hallway is ' + m + ' meters long. How many centimeters is that? (1 m = 100 cm)',
        [String(m * 100), (m * 100) + ' cm'], 'Bigger unit to smaller unit: multiply. ' + m + ' × 100 = <b>' + (m * 100) + '</b> cm.',
        { strategy: S.eq, sol: '5.MG.1' });
    }},
    { id: 'u6_best_unit', f: function () {
      const items = [
        ['the length of a pencil', 'centimeters', ['kilometers', 'kilograms', 'liters']],
        ['the mass of a student', 'kilograms', ['milligrams', 'kilometers', 'milliliters']],
        ['the distance between two towns', 'kilometers', ['centimeters', 'milligrams', 'milliliters']],
        ['the amount of water in a water bottle', 'milliliters or liters', ['kilometers', 'milligrams', 'centimeters']]
      ];
      const t = pick(items);
      return mc('Which metric unit is the best choice for measuring ' + t[0] + '?',
        t[1], t[2], 'Match the size of the unit to the size of the object: ' + t[0] + ' is measured in ' + t[1] + '.',
        { strategy: S.reread, sol: '5.MG.1' });
    }},
    { id: 'u6_add_len', f: function () {
      const a = ri(15, 80), b = ri(15, 80);
      return num('One board is ' + a + ' cm long and another is ' + b + ' cm long. Placed end to end, how many centimeters long are they together?',
        [String(a + b)], a + ' + ' + b + ' = <b>' + (a + b) + '</b> cm.', { strategy: S.parts, sol: '5.MG.1' });
    }},
    { id: 'u6_kg_g', f: function () {
      const kg = pick([2, 3, 4, 5]);
      return num('A bag of apples has a mass of ' + kg + ' kilograms. How many grams is that? (1 kg = 1,000 g)',
        [String(kg * 1000), (kg * 1000) + ' g'], kg + ' × 1,000 = <b>' + (kg * 1000) + '</b> g.', { strategy: S.eq, sol: '5.MG.1' });
    }},
    { id: 'u6_compare', f: function () {
      const a = ri(3, 8), bCm = pick([a * 100 - 20, a * 100 + 50, a * 100 - 100, a * 100 + 10]);
      if (bCm <= 0) return null;
      const left = a * 100, longer = left > bCm ? a + ' m' : bCm + ' cm', other = left > bCm ? bCm + ' cm' : a + ' m';
      if (left === bCm) return null;
      return mc('Which is longer: a ' + a + ' m rope or a ' + bCm + ' cm rope? (1 m = 100 cm)',
        longer, [other, 'They are the same length.', 'You cannot compare meters and centimeters.'],
        a + ' m = ' + left + ' cm. Compare ' + left + ' cm with ' + bCm + ' cm. <b>' + longer + '</b> is longer.',
        { strategy: S.names, sol: '5.MG.1' });
    }}
  ];
  ADV[6] = [
    { id: 'u6_fence', f: function () {
      const aM = ri(3, 8), bCm = pick([150, 200, 250, 300, 350]);
      const total = aM * 100 + bCm;
      return num('A path has one section that is ' + aM + ' m and another that is ' + bCm + ' cm. What is the total length in centimeters? (1 m = 100 cm)',
        [String(total)], aM + ' m = ' + (aM * 100) + ' cm. Then ' + (aM * 100) + ' + ' + bCm + ' = <b>' + total + '</b> cm.',
        { strategy: S.parts, sol: '5.MG.1' });
    }},
    { id: 'u6_error_op', f: function () {
      const cm = pick([300, 400, 500, 700, 800]);
      const right = cm / 100, wrong = cm * 100;
      return mc(nm() + ' converted ' + cm + ' cm to meters and got ' + wrong + ' m. What was the mistake, and what is the correct number of meters?',
        'Multiplied by 100 instead of dividing. The correct length is ' + right + ' m.',
        ['Divided by 10 instead of 100. The correct length is ' + (cm / 10) + ' m.', wrong + ' m is already correct.', 'The correct length is ' + cm + ' m because the number stays the same.'],
        'Centimeters are smaller, so you need fewer meters: divide by 100. ' + cm + ' ÷ 100 = <b>' + right + '</b> m.',
        { strategy: S.reread, sol: '5.MG.1' });
    }},
    { id: 'u6_table_conv', f: function () {
      const f = 1000;
      const kg = [1, 2, 3, 4];
      const missing = 5;
      const rows = kg.map(function (x) { return [x + ' kg', (x * f) + ' g']; });
      rows.push([missing + ' kg', '?']);
      return num('The table shows a conversion pattern. What number belongs in the ? box?' + tbl(['Kilograms', 'Grams'], rows, 'Mass conversions'),
        [String(missing * f)], 'Each kilogram is 1,000 grams. 5 × 1,000 = <b>5,000</b> g.',
        { strategy: S.table, sol: '5.MG.1' });
    }},
    { id: 'u6_extra_meas', f: function () {
      const m = ri(4, 9), unused = ri(10, 40);
      return num('A banner is ' + m + ' meters long. The pole for hanging it has a mass of ' + unused + ' kg (extra information). How many centimeters long is the banner? (1 m = 100 cm)',
        [String(m * 100)], 'Use only the length. ' + m + ' × 100 = <b>' + (m * 100) + '</b> cm. The mass is not needed.',
        { strategy: S.reread, sol: '5.MG.1' });
    }},
    { id: 'u6_strategy', f: function () {
      return mc('You need to compare 3 m and 280 cm. Which strategy is most helpful?',
        'Rename everything in the same unit (both cm or both m), then compare.',
        ['Add 3 + 280.', 'Find the mean of 3 and 280.', 'Change both measurements to kilograms.'],
        '3 m = 300 cm, and 300 cm > 280 cm, so 3 m is longer.',
        { strategy: S.names, sol: '5.MG.1' });
    }},
    { id: 'u6_two_part', f: function () {
      const startM = ri(4, 8), cutCm = pick([50, 75, 80, 100, 150]);
      const startCm = startM * 100, left = startCm - cutCm;
      if (left <= 0) return null;
      return multi('A roll of fabric is ' + startM + ' m long. ' + nm() + ' cuts off ' + cutCm + ' cm.',
        [{ type: 'num', q: 'How many centimeters long was the roll at the start? (1 m = 100 cm)', a: [String(startCm)] }, { type: 'num', q: 'How many centimeters are left?', a: [String(left)] }],
        startM + ' m = ' + startCm + ' cm. Left: ' + startCm + ' − ' + cutCm + ' = <b>' + left + '</b> cm.',
        { strategy: S.parts, sol: '5.MG.1' });
    }}
  ];

  /* ---------- Unit 7: Compare & percent (5.NS.1) ---------- */
  CORE[7] = [
    { id: 'u7_compare_recipe', f: function () {
      const a = pick([[1, 2, 0.5], [2, 5, 0.4], [3, 8, 0.375], [1, 4, 0.25]]);
      const b = pick([[3, 4, 0.75], [3, 5, 0.6], [2, 3, 2/3], [5, 8, 0.625]]);
      if (a[2] === b[2]) return null;
      const more = a[2] > b[2] ? fr(a[0], a[1]) : fr(b[0], b[1]);
      const less = a[2] > b[2] ? fr(b[0], b[1]) : fr(a[0], a[1]);
      return mc('A recipe can use ' + fr(a[0], a[1]) + ' cup of oil or ' + fr(b[0], b[1]) + ' cup of oil. Which amount is greater?',
        more, [less, 'They are equal.', fr(a[0] + b[0], a[1] + b[1])],
        'Compare with decimals or common denominators: ' + fr(a[0], a[1]) + ' ≈ ' + (Math.round(a[2] * 1000) / 1000) + ' and ' + fr(b[0], b[1]) + ' ≈ ' + (Math.round(b[2] * 1000) / 1000) + '. <b>' + strip(more) + '</b> is greater.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u7_survey_pct', f: function () {
      const t = pick([[13, 20, 65], [7, 20, 35], [9, 10, 90], [3, 5, 60], [4, 5, 80], [11, 20, 55]]);
      return num('In a class survey, ' + t[0] + ' of ' + t[1] + ' students like hiking. What percent is that?',
        [t[2] + '%', String(t[2])], fr(t[0], t[1]) + ' = ' + fr(t[2], 100) + ' = <b>' + t[2] + '%</b>.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true, ph: '65%' });
    }},
    { id: 'u7_order_times', f: function () {
      const times = shuf(['12.08', '12.8', '12.18', '11.9']);
      const ordered = ['11.9', '12.08', '12.18', '12.8'];
      const ans = ordered.join(', ');
      const traps = [times.join(', '), ['12.8', '12.18', '12.08', '11.9'].join(', '), ['11.9', '12.8', '12.18', '12.08'].join(', ')];
      return mc('Four runners finished in ' + times.join(', ') + ' seconds. Which list shows the times in order from fastest (least) to slowest (greatest)?',
        ans, traps.filter(function (x) { return x !== ans; }),
        'Compare place value: 11.9 is least, then 12.08, 12.18, and 12.8 (12.80). Fastest to slowest: <b>' + ans + '</b>.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u7_frac_dec', f: function () {
      const t = pick([[3, 4, 0.75, 0.7], [2, 5, 0.4, 0.5], [1, 8, 0.125, 0.2], [7, 10, 0.7, 0.07]]);
      const fracGreater = t[0] / t[1] > t[3];
      const ans = fracGreater ? fr(t[0], t[1]) : String(t[3]);
      const other = fracGreater ? String(t[3]) : fr(t[0], t[1]);
      return mc('Which is greater, ' + fr(t[0], t[1]) + ' or ' + t[3] + '?',
        ans, [other, 'They are equal.', String(t[0] + t[3])],
        fr(t[0], t[1]) + ' = ' + t[2] + '. Compare ' + t[2] + ' and ' + t[3] + '. <b>' + strip(ans) + '</b> is greater.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u7_pct_class', f: function () {
      const whole = pick([20, 25, 40, 50]);
      const pct = pick([10, 20, 25, 40, 50]);
      const part = whole * pct / 100;
      if (part !== Math.round(part)) return null;
      return num('There are ' + whole + ' students on a field trip. ' + pct + '% of them brought a lunch. How many students brought a lunch?',
        [String(part)], pct + '% = ' + fr(pct, 100) + '. ' + fr(pct, 100) + ' of ' + whole + ' = <b>' + part + '</b>.',
        { strategy: S.model, sol: '5.NS.1' });
    }}
  ];
  ADV[7] = [
    { id: 'u7_who_farther', f: function () {
      const whoA = nm(), whoB = nm();
      if (whoA === whoB) return null;
      const A = pick([['3/5 mile', 0.6], ['0.45 mile', 0.45], ['1/2 mile', 0.5]]);
      const B = pick([['7/10 mile', 0.7], ['65% of a mile', 0.65], ['0.8 mile', 0.8], ['3/4 mile', 0.75]]);
      if (A[1] === B[1]) return null;
      const farther = A[1] > B[1] ? whoA : whoB;
      return mc(whoA + ' biked ' + A[0] + '. ' + whoB + ' biked ' + B[0] + '. Who biked farther?',
        farther, [farther === whoA ? whoB : whoA, 'They biked the same distance.', 'You cannot compare a fraction with a percent.'],
        'Rename as decimals: ' + A[0] + ' = ' + A[1] + ' and ' + B[0] + ' = ' + B[1] + '. ' + farther + ' biked farther.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u7_error_compare', f: function () {
      return mc(nm() + ' said 0.35 is greater than 0.4 because 35 is greater than 4. What is the mistake, and which number is actually greater?',
        'The place values were not lined up. 0.40 is greater than 0.35, so 0.4 is greater.',
        ['0.35 really is greater than 0.4.', 'You cannot compare 0.35 and 0.4.', 'Both numbers are equal to 35/100.'],
        'Write 0.4 as 0.40. Then 40 hundredths > 35 hundredths, so <b>0.4</b> is greater.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u7_ms_between', f: function () {
      return ms('Select <b>all</b> of the numbers that are between 0.3 and 0.5.',
        ['0.4', '2/5', '35%', '3/8'],
        ['0.6', '1/2', '0.25', '3/4'],
        '0.3 = 30/100 and 0.5 = 50/100. 0.4, 2/5 = 0.4, 35% = 0.35, and 3/8 = 0.375 all sit between them. 1/2 = 0.5 is not strictly between.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u7_two_part', f: function () {
      const t = pick([[13, 20, 65], [7, 10, 70], [3, 5, 60]]);
      const unused = ri(4, 9);
      return multi('A team won ' + t[0] + ' of ' + t[1] + ' games and also practiced ' + unused + ' extra days (extra information).',
        [{ type: 'num', q: 'What fraction of the games did the team win? Write it in simplest form.', a: fracAcc(t[0], t[1]) },
         { type: 'num', q: 'What percent of the games did the team win?', a: [t[2] + '%', String(t[2])] }],
        'Ignore practice days. ' + fr(t[0], t[1]) + ' = ' + t[2] + '%.',
        { strategy: S.reread, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u7_strategy', f: function () {
      return mc('You need to order 2/5, 0.45, and 50%. Which strategy is most helpful?',
        'Rename each number as a decimal (or as a percent) and then compare.',
        ['Add the three numbers first.', 'Multiply each number by 2/5.', 'Compare only the digits you see and ignore place value.'],
        '2/5 = 0.4, 50% = 0.5, and 0.45 is already a decimal. The order from least to greatest is 0.4, 0.45, 0.5.',
        { strategy: S.names, sol: '5.NS.1', nocalc: true });
    }},
    { id: 'u7_extra', f: function () {
      const whoA = nm(), whoB = nm();
      const a = pick([0.6, 0.75, 0.8]), b = pick([0.5, 0.65, 0.7]);
      if (a === b) return null;
      const extra = ri(10, 30);
      const farther = a > b ? whoA : whoB;
      return mc(whoA + ' swam  ' + a + ' km. ' + whoB + ' swam ' + b + ' km. The pool is ' + extra + ' m wide (extra information). Who swam farther?',
        farther, [farther === whoA ? whoB : whoA, 'They swam the same distance.', 'You need the width of the pool to decide.'],
        'Compare the swim distances only: ' + a + ' and ' + b + '. The pool width is not needed. ' + farther + ' swam farther.',
        { strategy: S.reread, sol: '5.NS.1', nocalc: true });
    }}
  ];

  /* ---------- Unit 8: Fraction operations (5.CE.2) ---------- */
  CORE[8] = [
    { id: 'u8_add_recipe', f: function () {
      const pairs = [[1, 2, 1, 3, 5, 6], [1, 4, 1, 2, 3, 4], [2, 5, 1, 10, 1, 2], [3, 8, 1, 4, 5, 8], [1, 6, 1, 2, 2, 3], [1, 3, 1, 6, 1, 2]];
      const t = pick(pairs);
      return num('A recipe uses ' + fr(t[0], t[1]) + ' cup of flour and ' + fr(t[2], t[3]) + ' cup of sugar. How many cups is that together? Write the sum in simplest form.',
        fracAcc(t[4], t[5]), 'Use a common denominator. ' + fr(t[0], t[1]) + ' + ' + fr(t[2], t[3]) + ' = <b>' + fr(t[4], t[5]) + '</b>.',
        { strategy: S.model, sol: '5.CE.2', nocalc: true, ph: '5/6' });
    }},
    { id: 'u8_leftover', f: function () {
      const t = pick([[3, 8, 5, 8], [1, 4, 3, 4], [2, 5, 3, 5], [1, 3, 2, 3], [5, 8, 3, 8], [1, 6, 5, 6]]);
      return num('A pan of brownies is a whole. ' + nm() + ' eats ' + fr(t[0], t[1]) + ' of the pan. What fraction of the pan is left?',
        fracAcc(t[2], t[3]), '1 − ' + fr(t[0], t[1]) + ' = ' + fr(t[1], t[1]) + ' − ' + fr(t[0], t[1]) + ' = <b>' + fr(t[2], t[3]) + '</b>.',
        { strategy: S.model, sol: '5.CE.2', nocalc: true });
    }},
    { id: 'u8_wxf', f: function () {
      const t = pick([[3, 4, 12, 9], [2, 5, 15, 6], [1, 4, 20, 5], [2, 3, 12, 8], [3, 8, 16, 6], [1, 2, 18, 9]]);
      return num('There are ' + t[2] + ' muffins. Students take ' + fr(t[0], t[1]) + ' of them. How many muffins is that?',
        [String(t[3])], fr(t[0], t[1]) + ' of ' + t[2] + ' = (' + t[0] + ' × ' + t[2] + ') ÷ ' + t[1] + ' = <b>' + t[3] + '</b>.',
        { strategy: S.model, sol: '5.CE.2', nocalc: true });
    }},
    { id: 'u8_mixed_sub', f: function () {
      const t = pick([[5, 2, 3, 4, 7, 4], [7, 2, 3, 4, 11, 4], [5, 2, 1, 3, 7, 6], [8, 3, 1, 2, 13, 6]]);
      /* 5/2 - 3/4 = 10/4 - 3/4 = 7/4; 7/2-3/4=14/4-3/4=11/4; 5/2-1/3=15/6-2/6=13/6 WAIT I said 7/6. Let me compute carefully in code instead. */
      const n = t[0] * t[3] - t[2] * t[1], d = t[1] * t[3];
      const s = simp(n, d);
      if (n <= 0) return null;
      return num(nm() + ' had ' + mixed(t[0], t[1]) + ' cups of juice and poured ' + fr(t[2], t[3]) + ' cup. How much juice is left? Write the answer as a mixed number or a fraction in simplest form.',
        fracAcc(s[0], s[1]), mixed(t[0], t[1]) + ' − ' + fr(t[2], t[3]) + ' = <b>' + mixed(s[0], s[1]) + '</b>.',
        { strategy: S.parts, sol: '5.CE.2', nocalc: true });
    }},
    { id: 'u8_est_bench', f: function () {
      return mc('About how much is ' + fr(3, 8) + ' + ' + fr(5, 12) + '?',
        'about 3/4',
        ['about 2', 'about 0', 'about 3'],
        fr(3, 8) + ' is a little less than 1/2, and ' + fr(5, 12) + ' is a little less than 1/2, so the sum is about <b>3/4</b> (and less than 1).',
        { strategy: S.est, sol: '5.CE.2', nocalc: true });
    }}
  ];
  ADV[8] = [
    { id: 'u8_remaining', f: function () {
      /* start 1, use 1/2, then 1/3 of what remains (1/2), leftover = 1/2 * 2/3 = 1/3 */
      const firstN = 1, firstD = 2;
      const secondN = 1, secondD = pick([3, 4]);
      const remain1N = firstD - firstN, remain1D = firstD;
      const used2N = secondN * remain1N, used2D = secondD * remain1D;
      const leftN = remain1N * (secondD - secondN), leftD = remain1D * secondD;
      const s = simp(leftN, leftD);
      const name = nm();
      return num(name + ' has a full pitcher. ' + name + ' pours out ' + fr(firstN, firstD) + ' of the pitcher, then pours out ' + fr(secondN, secondD) + ' of <b>what is left</b>. What fraction of the original pitcher remains?',
        fracAcc(s[0], s[1]),
        'After the first pour, ' + fr(remain1N, remain1D) + ' is left. Then ' + fr(secondN, secondD) + ' of that is used, so remaining is ' + fr(secondD - secondN, secondD) + ' of ' + fr(remain1N, remain1D) + ' = <b>' + fr(s[0], s[1]) + '</b>.',
        { strategy: S.model, sol: '5.CE.2', nocalc: true });
    }},
    { id: 'u8_error_lcd', f: function () {
      return mc(nm() + ' computed ' + fr(3, 4) + ' − ' + fr(1, 6) + ' and wrote ' + fr(2, 2) + ' after subtracting the numerators and the denominators. What is the mistake, and what is the correct difference?',
        'You cannot subtract denominators. The correct difference is ' + fr(7, 12) + '.',
        ['The correct difference is ' + fr(2, 2) + '.', 'The correct difference is ' + fr(2, 10) + '.', 'The correct difference is ' + fr(4, 6) + '.'],
        'Use LCD 12: ' + fr(9, 12) + ' − ' + fr(2, 12) + ' = <b>' + fr(7, 12) + '</b>.',
        { strategy: S.model, sol: '5.CE.2', nocalc: true });
    }},
    { id: 'u8_strategy_model', f: function () {
      return mc(nm() + ' needs to find ' + fr(2, 3) + ' of 12 slices of pizza. Which strategy is most helpful?',
        'Draw a model: split 12 into 3 equal groups of 4, then take 2 groups.',
        ['Subtract 2 from 3, then from 12.', 'Add 2/3 and 12.', 'Find the range of 2, 3, and 12.'],
        '12 ÷ 3 = 4, and 2 groups of 4 is 8 slices. So ' + fr(2, 3) + ' of 12 = 8.',
        { strategy: S.model, sol: '5.CE.2', nocalc: true });
    }},
    { id: 'u8_two_part', f: function () {
      const t = pick([[1, 2, 1, 3, 5, 6, 1, 6], [1, 4, 1, 3, 7, 12, 5, 12]]);
      /* used = t0/t1 + t2/t3 = t4/t5, leftover = 1 - that = t6/t7 */
      return multi('A recipe uses ' + fr(t[0], t[1]) + ' cup of milk and ' + fr(t[2], t[3]) + ' cup of oil from a 1-cup measuring set.',
        [{ type: 'num', q: 'How many cups were used in all?', a: fracAcc(t[4], t[5]) },
         { type: 'num', q: 'How much less than 1 cup is that combined amount?', a: fracAcc(t[6], t[7]) }],
        fr(t[0], t[1]) + ' + ' + fr(t[2], t[3]) + ' = ' + fr(t[4], t[5]) + '. 1 − ' + fr(t[4], t[5]) + ' = ' + fr(t[6], t[7]) + '.',
        { strategy: S.parts, sol: '5.CE.2', nocalc: true });
    }},
    { id: 'u8_ms_eq', f: function () {
      return ms('Select <b>all</b> of the expressions that are equal to ' + fr(3, 4) + ' of 8.',
        ['6', fr(3, 4) + ' × 8', '8 × ' + fr(3, 4), '(3 × 8) ÷ 4'],
        [fr(3, 4) + ' + 8', '8 − ' + fr(3, 4), '3'],
        fr(3, 4) + ' of 8 means multiply: (3 × 8) ÷ 4 = 6.',
        { strategy: S.eq, sol: '5.CE.2', nocalc: true });
    }},
    { id: 'u8_extra', f: function () {
      const t = pick([[1, 2, 1, 5, 7, 10], [1, 3, 1, 6, 1, 2], [2, 5, 1, 4, 13, 20]]);
      const unused = ri(3, 9);
      return num('A trail mix uses ' + fr(t[0], t[1]) + ' cup of almonds and ' + fr(t[2], t[3]) + ' cup of raisins. ' + nm() + ' also has ' + unused + ' pretzel bags (extra information). How many cups of almonds and raisins are used together?',
        fracAcc(t[4], t[5]), 'Add the two fractions only: ' + fr(t[0], t[1]) + ' + ' + fr(t[2], t[3]) + ' = <b>' + fr(t[4], t[5]) + '</b>. Ignore the pretzels.',
        { strategy: S.reread, sol: '5.CE.2', nocalc: true });
    }}
  ];

  /* ---------- Unit 9: Shape & measure (5.MG.2, 5.MG.3) ---------- */
  CORE[9] = [
    { id: 'u9_rect_area', f: function () {
      const l = ri(6, 18), w = ri(4, 12);
      return num('A rectangular garden is ' + l + ' feet long and ' + w + ' feet wide. What is its area in square feet?',
        [String(l * w), (l * w) + ' square feet', (l * w) + ' sq ft'],
        'Area of a rectangle = length × width: ' + l + ' × ' + w + ' = <b>' + (l * w) + '</b> square feet.',
        { strategy: S.model, sol: '5.MG.2' });
    }},
    { id: 'u9_tri_area', f: function () {
      const b = pick([6, 8, 10, 12, 14, 16]), h = pick([3, 4, 5, 6, 8, 9]);
      const area = b * h / 2;
      if (area !== Math.round(area)) return null;
      return num('A right-triangle sail has a base of ' + b + ' feet and a height of ' + h + ' feet. What is its area in square feet?',
        [String(area)], 'Area of a right triangle = (1/2) × base × height = (1/2) × ' + b + ' × ' + h + ' = <b>' + area + '</b>.',
        { strategy: S.model, sol: '5.MG.2' });
    }},
    { id: 'u9_volume', f: function () {
      const l = ri(4, 10), w = ri(3, 8), h = ri(2, 6);
      return num('A storage box is ' + l + ' in long, ' + w + ' in wide, and ' + h + ' in tall. What is its volume in cubic inches?',
        [String(l * w * h), (l * w * h) + ' cubic inches'],
        'Volume = length × width × height: ' + l + ' × ' + w + ' × ' + h + ' = <b>' + (l * w * h) + '</b> cubic inches.',
        { strategy: S.model, sol: '5.MG.2' });
    }},
    { id: 'u9_missing_angle', f: function () {
      const a = ri(30, 80), b = ri(30, 80);
      if (a + b >= 170) return null;
      const c = 180 - a - b;
      return num('In triangle TCP, angle T is ' + a + '° and angle C is ' + b + '°. What is the measure of angle P, in degrees?',
        [String(c), c + '°'], 'The angles of a triangle add to 180°. ' + a + ' + ' + b + ' = ' + (a + b) + ', so angle P is 180 − ' + (a + b) + ' = <b>' + c + '</b>°.',
        { strategy: S.eq, sol: '5.MG.3' });
    }},
    { id: 'u9_pav', f: function () {
      const items = [
        ['the fencing needed to go around a garden', 'perimeter'],
        ['the paint needed to cover a wall', 'area'],
        ['the sand that fills a sandbox', 'volume'],
        ['the trim around a bulletin board', 'perimeter'],
        ['the carpet needed to cover a floor', 'area']
      ];
      const t = pick(items);
      return mc('Which measure answers this situation: <b>' + t[0] + '</b>?',
        t[1], ['perimeter', 'area', 'volume'].filter(function (x) { return x !== t[1]; }).concat(['the mean']),
        'Matching the situation to the measure: ' + t[0] + ' is about <b>' + t[1] + '</b>.',
        { strategy: S.reread, sol: '5.MG.2' });
    }}
  ];
  ADV[9] = [
    { id: 'u9_window', f: function () {
      const L = pick([12, 14, 15, 16, 18]), W = pick([8, 9, 10, 12]);
      const wL = pick([2, 3, 4]), wW = pick([2, 3]);
      const wall = L * W, win = wL * wW, paint = wall - win;
      if (paint <= 0) return null;
      return num('A rectangular wall is ' + L + ' ft by ' + W + ' ft and has a window that is ' + wL + ' ft by ' + wW + ' ft. How many square feet of the wall will be painted (the wall not including the window)?',
        [String(paint)], 'Wall: ' + L + ' × ' + W + ' = ' + wall + '. Window: ' + wL + ' × ' + wW + ' = ' + win + '. Paint: ' + wall + ' − ' + win + ' = <b>' + paint + '</b> square feet.',
        { strategy: S.parts, sol: '5.MG.2' });
    }},
    { id: 'u9_boxes', f: function () {
      const sl = ri(2, 4), sw = sl, sh = sl; /* small cube-like */
      const nl = ri(3, 6), nw = ri(2, 5), nh = ri(2, 4);
      const L = sl * nl, W = sw * nw, H = sh * nh;
      const fit = nl * nw * nh;
      return multi('Small boxes are ' + sl + ' cm by ' + sw + ' cm by ' + sh + ' cm. A crate is ' + L + ' cm by ' + W + ' cm by ' + H + ' cm.',
        [{ type: 'num', q: 'What is the volume of the crate, in cubic centimeters?', a: [String(L * W * H)] },
         { type: 'num', q: 'How many small boxes fit in the crate with no leftover space?', a: [String(fit)] }],
        'Crate volume = ' + L + ' × ' + W + ' × ' + H + ' = ' + (L * W * H) + '. Each small box is ' + (sl * sw * sh) + ' cubic cm. ' + (L * W * H) + ' ÷ ' + (sl * sw * sh) + ' = <b>' + fit + '</b>.',
        { strategy: S.parts, sol: '5.MG.2' });
    }},
    { id: 'u9_error_area', f: function () {
      const l = ri(8, 16), w = ri(4, 9);
      const area = l * w, peri = 2 * (l + w);
      return mc(nm() + ' was asked for the area of a ' + l + ' ft by ' + w + ' ft rectangular garden and wrote ' + peri + ' square feet. What was the mistake, and what is the area?',
        'That is the perimeter. The area is ' + area + ' square feet.',
        ['That is the volume. The area is ' + area + ' square feet.', peri + ' square feet is already the area.', 'The area is ' + (l + w) + ' square feet.'],
        'Perimeter = 2 × (' + l + ' + ' + w + ') = ' + peri + ' feet. Area = ' + l + ' × ' + w + ' = <b>' + area + '</b> square feet.',
        { strategy: S.reread, sol: '5.MG.2' });
    }},
    { id: 'u9_strategy', f: function () {
      return mc('You want to know how much soil is needed to fill a raised garden bed. Which strategy is most helpful?',
        'Find the volume of the bed (length × width × height).',
        ['Find only the perimeter of the top.', 'Find only the area of one side.', 'Add the three dimensions.'],
        'Soil fills space, which is volume. Multiply the three edges of the rectangular prism.',
        { strategy: S.model, sol: '5.MG.2' });
    }},
    { id: 'u9_slant_extra', f: function () {
      const b = ri(6, 16), h = ri(4, 12), slant = b + ri(2, 6);
      return num('A parallelogram-shaped patio has base ' + b + ' m, height ' + h + ' m, and a slanted side of ' + slant + ' m (extra information). What is the area of the patio in square meters?',
        [String(b * h)], 'Area of a parallelogram = base × height: ' + b + ' × ' + h + ' = <b>' + (b * h) + '</b>. Do not use the slanted side.',
        { strategy: S.reread, sol: '5.MG.2' });
    }},
    { id: 'u9_ms_true', f: function () {
      const a = 40, b = 70, c = 70;
      return ms('A triangle has angle measures 40°, 70°, and 70°. Select <b>all</b> of the statements that are true.',
        ['The triangle is isosceles.', 'The triangle is acute.', 'The angles add to 180°.'],
        ['The triangle is a right triangle.', 'The triangle is equilateral.', 'The triangle has a 90° angle.'],
        '40 + 70 + 70 = 180. Two angles are equal, so it is isosceles. All angles are less than 90°, so it is acute. It is not right or equilateral.',
        { strategy: S.reread, sol: '5.MG.3' });
    }}
  ];

  /* ---------- Unit 10: Data & chance (5.PS.1-3) ---------- */
  CORE[10] = [
    { id: 'u10_prob_bag', f: function () {
      const red = ri(2, 6), blue = ri(2, 6), yellow = ri(1, 5);
      const total = red + blue + yellow;
      const color = pick(['red', 'blue', 'yellow']);
      const fav = color === 'red' ? red : color === 'blue' ? blue : yellow;
      const s = simp(fav, total);
      return num('A bag has ' + red + ' red, ' + blue + ' blue, and ' + yellow + ' yellow marbles. One marble is drawn at random. What is the probability it is ' + color + '? Write a fraction in simplest form.',
        fracAcc(s[0], s[1]), 'Favorable = ' + fav + ', total = ' + total + '. P = <b>' + fr(s[0], s[1]) + '</b>.',
        { strategy: S.model, sol: '5.PS.3', nocalc: true, ph: '2/9' });
    }},
    { id: 'u10_count_outfits', f: function () {
      const shirts = ri(3, 6), pants = ri(2, 5);
      const name = nm();
      return num(name + ' has ' + shirts + ' shirts and ' + pants + ' pairs of pants. How many different shirt-and-pants outfits can ' + name + ' make?',
        [String(shirts * pants)], 'Fundamental counting principle: ' + shirts + ' × ' + pants + ' = <b>' + (shirts * pants) + '</b> outfits.',
        { strategy: S.table, sol: '5.PS.3' });
    }},
    { id: 'u10_mean_scores', f: function () {
      const n = 4, vals = []; let sum = 0;
      for (let i = 0; i < n; i++) { const v = ri(6, 14); vals.push(v); sum += v; }
      if (sum % n) { vals[0] += n - (sum % n); sum += n - (sum % n); }
      const mean = sum / n;
      return num('A soccer team scored ' + vals.join(', ') + ' goals in four games. What is the mean number of goals?',
        [String(mean)], 'Sum = ' + sum + '. Mean = ' + sum + ' ÷ 4 = <b>' + mean + '</b>.', { strategy: S.parts, sol: '5.PS.2' });
    }},
    { id: 'u10_range_table', f: function () {
      const names = ['Ava', 'Ben', 'Kai', 'Zoe'];
      const pts = names.map(function () { return ri(4, 18); });
      const lo = Math.min.apply(null, pts), hi = Math.max.apply(null, pts);
      return num('The table shows points scored. What is the range?' + tbl(['Player', 'Points'], names.map(function (n0, i) { return [n0, pts[i]]; }), 'Game points'),
        [String(hi - lo)], 'Range = ' + hi + ' − ' + lo + ' = <b>' + (hi - lo) + '</b>.', { strategy: S.table, sol: '5.PS.2' });
    }},
    { id: 'u10_likely', f: function () {
      const red = 5, blue = 2, green = 1, total = 8;
      return mc('A spinner is divided into 5 equal red sections, 2 blue, and 1 green. Which color is the spinner most likely to land on?',
        'red', ['blue', 'green', 'All three colors are equally likely.'],
        'Red has 5 of 8 sections, the greatest probability (' + fr(5, 8) + ').',
        { strategy: S.model, sol: '5.PS.3' });
    }}
  ];
  ADV[10] = [
    { id: 'u10_compound', f: function () {
      const shirts = ri(3, 5), pants = ri(2, 4), total = shirts * pants;
      const fav = shirts; /* all pants with one favorite shirt? or one outfit */
      const one = 1;
      const s = simp(one, total);
      return multi(nm() + ' has ' + shirts + ' shirts and ' + pants + ' pairs of pants and picks an outfit at random.',
        [{ type: 'num', q: 'How many different outfits are possible?', a: [String(total)] },
         { type: 'num', q: 'What is the probability of one particular outfit? Write a fraction in simplest form.', a: fracAcc(s[0], s[1]) }],
        'Outfits: ' + shirts + ' × ' + pants + ' = ' + total + '. P(one outfit) = <b>' + fr(s[0], s[1]) + '</b>.',
        { strategy: S.table, sol: '5.PS.3' });
    }},
    { id: 'u10_error_space', f: function () {
      const flavors = 3, toppings = 2, right = 6;
      const name = nm();
      return mc('Ice cream comes in chocolate, vanilla, and strawberry, with sprinkles or no sprinkles. ' + name + ' listed 5 possible sundaes and said there are 5 outcomes. What is the mistake, and how many outcomes are there?',
        'An outcome was left out. There are 3 × 2 = 6 possible sundaes.',
        ['There are only 5 outcomes; ' + name + ' is correct.', 'There are 3 + 2 = 5 outcomes, so addition is the right rule.', 'There are 3 × 2 × 2 = 12 outcomes.'],
        'Use the counting principle: 3 flavors × 2 topping choices = <b>6</b> outcomes. A list of 5 is incomplete.',
        { strategy: S.table, sol: '5.PS.3' });
    }},
    { id: 'u10_outlier', f: function () {
      const data = [7, 8, 8, 9, 20];
      return mc('A data set of points scored is 7, 8, 8, 9, 20. Which statement is true?',
        '20 is an outlier that increases both the mean and the range.',
        ['20 does not affect the range.', 'The median must be 20.', 'Removing 20 would make the range larger.'],
        'The median of 7, 8, 8, 9, 20 is 8 (the middle value). The range is 20 − 7 = 13, and 20 pulls the mean up. Removing 20 shrinks the range to 9 − 7 = 2.',
        { strategy: S.reread, sol: '5.PS.2' });
    }},
    { id: 'u10_strategy', f: function () {
      return mc('You want to know how many different 3-digit locker codes are possible if the digits can repeat and each digit is 0–9. Which strategy is most helpful?',
        'Use the counting principle: 10 choices for each of the 3 digits.',
        ['Find the mean of the digits.', 'Make a circle graph of locker colors.', 'Add 10 + 10 + 10.'],
        '10 × 10 × 10 = 1,000 possible codes.',
        { strategy: S.table, sol: '5.PS.3' });
    }},
    { id: 'u10_ms_true', f: function () {
      return ms('A bag has 3 red and 1 green marble. A marble is drawn at random. Select <b>all</b> of the true statements.',
        ['P(red) = ' + fr(3, 4), 'P(green) = ' + fr(1, 4), 'Red is more likely than green.'],
        ['P(red) = ' + fr(1, 3), 'P(green) = ' + fr(3, 4), 'Green is certain.'],
        'There are 4 marbles. P(red) = 3/4 and P(green) = 1/4, so red is more likely. Green is not certain.',
        { strategy: S.model, sol: '5.PS.3', nocalc: true });
    }},
    { id: 'u10_extra', f: function () {
      const a = [8, 10, 12, 6];
      const sum = 36, mean = 9;
      const unused = ri(20, 40);
      return num('Team A scored ' + a.join(', ') + ' points in four games. Team B scored ' + unused + ' points in one game (extra information). What is Team A’s mean score?',
        [String(mean)], 'Use only Team A: ' + a.join(' + ') + ' = ' + sum + '. Mean = ' + sum + ' ÷ 4 = <b>' + mean + '</b>.',
        { strategy: S.reread, sol: '5.PS.2' });
    }}
  ];

  /* ---------- Unit 11: Coordinates (6.MG) ---------- */
  CORE[11] = [
    { id: 'u11_distance', f: function () {
      const y = ri(1, 8), x1 = ri(0, 3), x2 = ri(x1 + 2, 9);
      const d = x2 - x1;
      return num('On a map of the school, the office is at (' + x1 + ', ' + y + ') and the library is at (' + x2 + ', ' + y + '). How many units apart are they?',
        [String(d)], 'Same y-coordinate, so subtract the x-values: ' + x2 + ' − ' + x1 + ' = <b>' + d + '</b> units.',
        { strategy: S.model, sol: '6.MG' });
    }},
    { id: 'u11_perimeter', f: function () {
      const x1 = ri(1, 3), y1 = ri(1, 3), side = ri(3, 6);
      const x2 = x1 + side, y2 = y1 + side;
      const peri = 4 * side;
      return num('A square park has corners at (' + x1 + ', ' + y1 + '), (' + x2 + ', ' + y1 + '), (' + x2 + ', ' + y2 + '), and (' + x1 + ', ' + y2 + '). What is its perimeter, in units?',
        [String(peri)], 'Each side is ' + side + ' units. Perimeter = 4 × ' + side + ' = <b>' + peri + '</b>.',
        { strategy: S.model, sol: '6.MG' });
    }},
    { id: 'u11_which_pt', f: function () {
      const pts = { 'soccer field': [2, 6], 'playground': [7, 3], 'cafeteria': [4, 1] };
      const ask = pick(Object.keys(pts));
      const ans = '(' + pts[ask][0] + ', ' + pts[ask][1] + ')';
      const others = Object.keys(pts).filter(function (k) { return k !== ask; }).map(function (k) { return '(' + pts[k][0] + ', ' + pts[k][1] + ')'; });
      const rows = Object.keys(pts).map(function (k) { return [k, '(' + pts[k][0] + ', ' + pts[k][1] + ')']; });
      return mc('The table lists landmarks on a Quadrant I map. What are the coordinates of the ' + ask + '?' + tbl(['Landmark', 'Point'], rows, 'School map'),
        ans, others.concat(['(' + pts[ask][1] + ', ' + pts[ask][0] + ')']),
        'Read the ' + ask + ' row: <b>' + ans + '</b>. x is across, y is up.',
        { strategy: S.table, sol: '6.MG' });
    }},
    { id: 'u11_axis', f: function () {
      return mc('Which of these school-map points is on the x-axis?',
        '(6, 0)', ['(0, 6)', '(6, 6)', '(1, 6)'],
        'Points on the x-axis have y = 0. So <b>(6, 0)</b> is on the x-axis. (0, 6) is on the y-axis.',
        { strategy: S.reread, sol: '6.MG' });
    }},
    { id: 'u11_walk', f: function () {
      const x = ri(1, 4), y = ri(1, 4), dx = ri(2, 4), dy = ri(2, 4);
      const ans = '(' + (x + dx) + ', ' + (y + dy) + ')';
      return mc(nm() + ' starts at (' + x + ', ' + y + '), walks ' + dx + ' units right (east), then ' + dy + ' units up (north). What is the ending point?',
        ans, ['(' + (x + dy) + ', ' + (y + dx) + ')', '(' + x + ', ' + (y + dy) + ')', '(' + (x + dx) + ', ' + y + ')'],
        'Add to x, then add to y: (' + x + ' + ' + dx + ', ' + y + ' + ' + dy + ') = <b>' + ans + '</b>.',
        { strategy: S.model, sol: '6.MG' });
    }}
  ];
  ADV[11] = [
    { id: 'u11_quad_treasure', f: function () {
      const x = ri(2, 6) * pick([1, -1]), y = ri(2, 6) * pick([1, -1]);
      const Q = x > 0 && y > 0 ? 'I' : x < 0 && y > 0 ? 'II' : x < 0 && y < 0 ? 'III' : 'IV';
      const d = Math.abs(x); /* distance from y-axis */
      const pt = '(' + x + ', ' + y + ')';
      return multi('A treasure map uses all four quadrants. A chest is buried at ' + pt + '.',
        (function () {
          const ch = shuf(['I', 'II', 'III', 'IV']);
          return [{ type: 'mc', q: 'In which quadrant is the chest?', ch: ch, a: ch.indexOf(Q) },
         { type: 'num', q: 'How many units is the chest from the y-axis?', a: [String(d)] }];
        })(),
        'Signs: x is ' + (x > 0 ? 'positive' : 'negative') + ', y is ' + (y > 0 ? 'positive' : 'negative') + ', so Quadrant ' + Q + '. Distance to the y-axis is |x| = <b>' + d + '</b>.',
        { strategy: S.model, sol: '6.MG' });
    }},
    { id: 'u11_error_swap', f: function () {
      const x = ri(2, 7), y = ri(2, 7);
      if (x === y) return null;
      return mc(nm() + ' plotted (' + x + ', ' + y + ') by going up ' + x + ' and then right ' + y + ', and landed on (' + y + ', ' + x + '). What was the mistake, and where should the point be?',
        'x and y were swapped. The point belongs at (' + x + ', ' + y + ').',
        ['The point really is at (' + y + ', ' + x + ').', 'The point belongs at the origin.', 'You should only use the x-coordinate.'],
        'The first number is x (across / right). The second is y (up). Go right ' + x + ', then up ' + y + ': <b>(' + x + ', ' + y + ')</b>.',
        { strategy: S.reread, sol: '6.MG' });
    }},
    { id: 'u11_rect_area', f: function () {
      const x1 = ri(1, 4), y1 = ri(1, 4), w = ri(3, 7), h = ri(2, 6);
      const area = w * h;
      return num('A rectangular playground has corners at (' + x1 + ', ' + y1 + '), (' + (x1 + w) + ', ' + y1 + '), (' + (x1 + w) + ', ' + (y1 + h) + '), and (' + x1 + ', ' + (y1 + h) + '). What is its area, in square units?',
        [String(area)], 'Width = ' + w + ' and height = ' + h + '. Area = ' + w + ' × ' + h + ' = <b>' + area + '</b>.',
        { strategy: S.model, sol: '6.MG' });
    }},
    { id: 'u11_strategy', f: function () {
      return mc('You know two points on a horizontal path: (2, 5) and (9, 5). Which strategy finds the distance between them?',
        'Since the y-coordinates are the same, subtract the x-coordinates: 9 − 2.',
        ['Add 2 + 5 + 9 + 5.', 'Multiply 2 × 9.', 'Find the mean of 2 and 9, then add 5.'],
        'A horizontal segment has constant y. Distance = |9 − 2| = 7 units.',
        { strategy: S.model, sol: '6.MG' });
    }},
    { id: 'u11_extra_pt', f: function () {
      const y = ri(2, 6), x1 = 1, x2 = ri(5, 9), unused = [ri(1, 8), ri(1, 8)];
      return num('A walking path runs from (' + x1 + ', ' + y + ') to (' + x2 + ', ' + y + '). A fountain is at (' + unused[0] + ', ' + unused[1] + ') (extra information). How many units long is the path?',
        [String(x2 - x1)], 'Use only the path endpoints. Same y, so ' + x2 + ' − ' + x1 + ' = <b>' + (x2 - x1) + '</b>. The fountain is not needed.',
        { strategy: S.reread, sol: '6.MG' });
    }},
    { id: 'u11_path', f: function () {
      const x = ri(1, 3), y = ri(1, 3), dx = ri(2, 5), dy = ri(2, 5);
      const len = dx + dy;
      return num(nm() + ' walks from (' + x + ', ' + y + ') to (' + (x + dx) + ', ' + y + '), then to (' + (x + dx) + ', ' + (y + dy) + '). How many units is the whole walk?',
        [String(len)], 'First leg: ' + dx + ' units right. Second leg: ' + dy + ' units up. Total = ' + dx + ' + ' + dy + ' = <b>' + len + '</b>.',
        { strategy: S.parts, sol: '6.MG' });
    }}
  ];

  function validate(it) {
    if (!it) return 'null item';
    const text = strip(JSON.stringify(it));
    if (/undefined|NaN|Infinity/.test(text)) return 'bad number in item';
    if (/\$-\d/.test(text)) return 'negative money';
    if (/\$\d+\.\d{3,}/.test(text)) return 'money has more than 2 decimal places';
    if (it.type === 'mc') {
      if (!it.ch || it.ch.length < 2) return 'mc missing choices';
      if (it.a == null || it.a < 0 || it.a >= it.ch.length) return 'mc bad index';
    }
    if (it.type === 'ms') {
      if (!it.ch || !it.a || !it.a.length) return 'ms missing key';
      if (it.a.some(function (i) { return i < 0 || i >= it.ch.length; })) return 'ms bad index';
    }
    if (it.type === 'num') {
      const acc = Array.isArray(it.a) ? it.a : [it.a];
      if (!acc.length || acc.some(function (x) { return x == null || x === ''; })) return 'num missing answer';
    }
    if (it.type === 'multi') {
      if (!it.parts || !it.parts.length) return 'multi missing parts';
      for (let i = 0; i < it.parts.length; i++) {
        const p = it.parts[i];
        const err = validate(Object.assign({ type: p.type || 'num', q: p.q, a: p.a, ch: p.ch, wp: true }));
        if (err) return 'part ' + i + ': ' + err;
      }
    }
    return null;
  }

  function bank(unit, level) {
    const adv = level === 'adv' || level === 'advanced';
    return (adv ? ADV[unit] : CORE[unit]) || [];
  }

  function makeFrom(g) {
    if (!g || typeof g.f !== 'function') return null;
    for (let t = 0; t < 10; t++) {
      let it = null;
      try { it = g.f(); } catch (e) { it = null; }
      if (!it) continue;
      if (it.type === 'multi' && it.parts) {
        it.parts.forEach(function (p) {
          if (p.type === 'mc' && (p.a == null || p.a < 0) && p.ch && p._ans) {
            p.a = p.ch.indexOf(p._ans);
          }
        });
      }
      const err = validate(it);
      if (!err) {
        it.wpId = g.id;
        return it;
      }
    }
    return null;
  }

  function make(unit, level, id) {
    const list = bank(unit, level);
    if (!list.length) return null;
    if (id) {
      const g = list.filter(function (x) { return x.id === id; })[0];
      return makeFrom(g);
    }
    const order = shuf(list);
    for (let i = 0; i < order.length; i++) {
      const it = makeFrom(order[i]);
      if (it) return it;
    }
    return null;
  }

  function skill(unit, level) {
    const adv = level === 'adv' || level === 'advanced';
    return {
      id: adv ? 'wp-adv' : 'wp-core',
      name: 'Word problems',
      gen: function () { return make(unit, adv ? 'adv' : 'std'); }
    };
  }

  function wrapTest(track, unit, level) {
    if (!track) return;
    const orig = track.test;
    track.test = function () {
      const items = typeof orig === 'function' ? orig.call(track) : (orig ? orig.slice() : []);
      const a = make(unit, level);
      const b = make(unit, level);
      if (a) items.splice(Math.min(2, items.length), 0, a);
      if (b) items.splice(Math.min(6, items.length), 0, b);
      return items;
    };
  }

  function attach(UNIT) {
    if (!UNIT || UNIT._wpAttached) return UNIT;
    const n = UNIT.num;
    if (UNIT.core && UNIT.core.skills && !UNIT.core.skills.some(function (s) { return s.id === 'wp-core' || s.id === 'wp'; })) {
      UNIT.core.skills.push(skill(n, 'std'));
      wrapTest(UNIT.core, n, 'std');
    }
    if (UNIT.advanced && UNIT.advanced.skills && !UNIT.advanced.skills.some(function (s) { return s.id === 'wp-adv'; })) {
      UNIT.advanced.skills.push(skill(n, 'adv'));
      wrapTest(UNIT.advanced, n, 'adv');
    }
    UNIT._wpAttached = 1;
    return UNIT;
  }

  function list() {
    const out = [];
    for (let u = 1; u <= 11; u++) {
      (CORE[u] || []).forEach(function (g) { out.push({ unit: u, level: 'core', id: g.id }); });
      (ADV[u] || []).forEach(function (g) { out.push({ unit: u, level: 'adv', id: g.id }); });
    }
    return out;
  }

  w.WP = { make: make, skill: skill, attach: attach, list: list, validate: validate, bank: bank, usd: usd, fracAcc: fracAcc };
})(typeof window !== 'undefined' ? window : globalThis);
