/* Extra Learn content: visual, worked example, common trap, AAP stretch, try-its. */
(function (w) {
  const fr = (n, d) => (w.V && V.fr) ? V.fr(n, d) : (n + '/' + d);
  const mixed = (a, b, c) => (w.V && V.mixed) ? V.mixed(a, b, c) : (a + ' ' + b + '/' + c);
  const L = w.V2L || {};
  const mc = function (q, right, wrong, why) {
    if (L.mc) return L.mc(q, right, wrong, why);
    return { type: 'mc', q, ch: [right].concat(wrong.map((x) => Array.isArray(x) ? x[0] : x)), a: 0, why };
  };
  const num = (q, a, why) => ({ type: 'num', fmt: 'TYPE IN', q, a, why });
  const ms = (q, ch, a, why) => ({ type: 'ms', fmt: 'SELECT ALL', q, ch, a, why });
  const nline = (q, a, why, min, max) => ({ type: 'nline', q, a, why, min: min == null ? 0 : min, max: max == null ? 10 : max, step: 1 });
  /* Hands-on widgets from js/interact.js, with a static fallback. */
  const ixGrid = (o) => (w.IX ? w.IX.hundredGrid(o) : V.hundredGrid(o.start || 0, { fill: o.fill }));
  const ixBar = (o) => (w.IX ? w.IX.fractionBar(o) : V.fractionBar(o.n || 0, o.d || 4, { fill: o.fill }));
  /* Number widgets from js/interact-num.js (and the decimal stepper). No widget, no See it. */
  const ix = (name, o) => (w.IX && w.IX[name] ? w.IX[name](o) : '');
  const ixStep = (kind, o) => (w.IX && w.IX.stepper ? w.IX.stepper(kind, o) : '');

  const pack = {
    /* ---------- Unit 1 ---------- */
    u1c1: {
      'Four steps, every time': {
        viz: () => V.cycleSteps(['Ask', 'Collect', 'Show', 'Tell']),
        steps: ['Start with a question that needs a count or a measure.', 'Collect the points — usually 30 or fewer.', 'Show them on a line plot or stem-and-leaf with a title and labels.', 'Tell what the data shows, using the display.'],
        trap: 'A remembered fact (“how many minutes in an hour?”) is not a data-cycle question. The cycle needs a group to measure.',
        aap: 'AAP: after you tell what the data shows, add one follow-up: “What would change if we measured a different class or a different week?”',
        tries: [
          () => mc('Which is the last step of the data cycle?', 'Analyze and communicate what the data shows', [['Collect the data', 'Collecting comes second.'], ['Write a title only', 'A title is part of representing, not the last step.'], ['Pick a favorite number', 'The cycle is about the data, not a guess.']], 'Ask → collect → represent → tell what it shows.'),
          () => mc('About how many data points does this class usually collect?', '30 or fewer', [['Hundreds', 'Keep the set small enough to plot by hand.'], ['Exactly 100', '100 is a percent whole, not the usual sample size here.'], ['2', 'Two points are not enough to see a pattern.']], 'Plan for 30 or fewer points so a line plot stays readable.')
        ]
      },
      'Which questions need data?': {
        viz: () => V.cycleSteps(['Need data', 'or', 'Known fact']),
        steps: ['Read the question.', 'Ask: would I need to survey or measure a group?', 'If one remembered fact answers it, it is not a data question.'],
        trap: '“How many days are in a week?” is a fact. “How many days were students absent this week?” needs data.',
        aap: 'AAP: write one statistical question and one non-statistical question about the same topic (for example, sleep).',
        tries: [
          () => mc('Which question needs data from a group?', 'How many pages did students in this class read last night?', [['How many inches are in a foot?', 'That is a known fact.'], ['What is 7 + 8?', 'That is arithmetic, not a survey.'], ['How many hours are in a day?', 'That is a fact.']], 'A data question cannot be answered from memory alone.'),
          () => ms('Select all questions that need data.', ['How tall are the plants in the class garden?', 'How many centimeters are in a meter?', 'How many pets do students in this class have?', 'Who was the first president of the United States?'], [0, 2], 'The garden heights and the pet counts need measuring or a survey. The other two are known facts.')
        ]
      }
    },
    u1c2: {
      'One dot, one value': {
        viz: () => V.linePlot([3, 3, 4, 5, 5, 5, 7], { title: 'Pencils in backpacks' }),
        steps: ['Draw a number line and give the plot a title.', 'Put one dot above each value.', 'If two people have the same value, stack the dots.'],
        trap: 'Do not stretch a stacked column into a bar. Each mark is still one person.',
        aap: 'AAP: if a new point 6 is added, say how the mode and the range change (or if they stay the same).',
        tries: [
          () => num('On a line plot of 3, 3, 4, 5, 5, 5, 7, how many dots are above 5?', 3, 'Three values are 5, so three dots stack above 5.'),
          () => num('How many values are shown in all on a plot of 3, 3, 4, 5, 5, 5, 7?', 7, 'Count every dot: 7 data points.')
        ]
      },
      'Read a plot': {
        viz: () => V.linePlot([2, 4, 4, 4, 6, 6, 8], { title: 'Jump lengths (feet)' }),
        steps: ['To find “how many jumped 4 feet,” count the dots above 4: 3 dots.', 'To find “how many in all,” count every dot.', 'The range is the greatest value minus the least.'],
        trap: 'The height of a stack is a count of people, not the value on the number line.',
        aap: 'AAP: find the median of the jump-length plot. Order the seven values first.',
        tries: [
          () => num('On a plot of 2, 4, 4, 4, 6, 6, 8, how many dots are above 4?', 3, 'Three values are 4, so three dots sit above 4.'),
          () => num('What is the range of 2, 4, 4, 4, 6, 6, 8?', 6, 'Greatest minus least: 8 − 2 = 6.')
        ]
      }
    },
    u1c3: {
      'Tens in the stem, ones in the leaf': {
        viz: () => V.stemLeaf([32, 35, 35, 41, 44, 50], { title: 'Scores', key: 'Key: 3 | 2 means 32' }),
        steps: ['Split each number: tens go in the stem, ones in the leaf.', 'List leaves in each row from least to greatest.', 'Write a title and a key, such as “3 | 2 means 32.”'],
        trap: '3 | 2 5 is 32 and 35, not 3.25 and not 325.',
        aap: 'AAP: add 39 to the plot. Which row gets the new leaf, and where in that row does it sit?',
        tries: [
          () => num('In the plot with key “3 | 2 means 32,” how many values have a stem of 3 if the leaves are 2, 5, 5?', 3, 'Three leaves in the 3-row mean three values: 32, 35, 35.'),
          () => mc('What does 4 | 1 mean if the key is “4 | 1 means 41”?', '41', [['4.1', 'The key says tens and ones, not tenths.'], ['14', 'The stem is the tens place.'], ['411', 'One leaf is one ones digit.']], 'Stem 4 and leaf 1 make 41.')
        ]
      },
      'Read a stem': {
        viz: () => V.stemLeaf([21, 23, 28, 30, 31, 31, 42], { title: 'Times (seconds)', key: 'Key: 2 | 1 means 21' }),
        steps: ['Find the stem you were asked about.', 'Count the leaves in that row.', 'Each leaf is one value.'],
        trap: 'Do not count the stem itself as a data value.',
        aap: 'AAP: what is the range of this plot? Greatest leaf-value minus least.',
        tries: [
          () => num('How many values have stem 3 in 31, 32, 35, 40, 44?', 3, '31, 32, and 35 share stem 3 — three leaves.'),
          () => mc('What does 5 | 0 mean if the key is “5 | 0 means 50”?', '50', [['5', 'The stem plus a 0 leaf is 50, not 5.'], ['0.5', 'This is tens and ones, not tenths.'], ['500', 'One leaf is one ones digit.']], 'Stem 5 and leaf 0 make 50.')
        ]
      }
    },
    u1c4: {
      'Mean is a fair share': {
        viz: () => V.barGraph(['A', 'B', 'C', 'D'], [3, 5, 7, 9], { title: 'Stickers to share', color: '#2f80ed' }),
        steps: ['Add the values: 3 + 5 + 7 + 9 = 24.', 'Count how many values: 4.', 'Divide: 24 ÷ 4 = 6. Each fair share is 6.'],
        trap: 'Do not divide by the greatest value. Divide by how many numbers you added.',
        aap: 'AAP: if a fifth person with 11 stickers joins, what is the new mean? 35 ÷ 5 = 7.',
        tries: [
          () => num('The amounts 2, 4, 6, and 8 are shared equally. What is the mean?', 5, '2 + 4 + 6 + 8 = 20, and 20 ÷ 4 = 5.'),
          () => num('Four scores add to 36. What is the mean?', 9, 'Mean = total ÷ how many: 36 ÷ 4 = 9.')
        ]
      },
      'Median, mode, and range': {
        viz: () => V.linePlot([2, 3, 3, 5, 8], { title: 'A small data set' }),
        steps: ['Order the data: 2, 3, 3, 5, 8.', 'Median is the middle value: 3. (If there are two middle values, use their mean.)', 'Mode is the value that appears most: 3. Range is greatest minus least: 8 − 2 = 6.'],
        trap: 'Find the median only after you put the numbers in order. The middle of the unordered list is a common miss.',
        aap: 'AAP: for an even count like 2, 3, 5, 8, the median is the mean of the two middle numbers: (3 + 5) ÷ 2 = 4.',
        tries: [
          () => num('What is the median of 2, 3, 3, 5, 8?', 3, 'The data is already ordered. The middle value is 3.'),
          () => num('What is the range of 2, 3, 3, 5, 8?', 6, '8 − 2 = 6.')
        ]
      }
    },
    u1a1: {
      'Parts of one whole': {
        viz: () => V.pie([50, 30, 20], ['Pizza 50%', 'Tacos 30%', 'Pasta 20%']),
        steps: ['A circle graph is one whole: all slices add to 100%.', 'A bigger slice means a bigger share.', 'Use it for parts of one group, not for change over time.'],
        trap: 'Slices must add to 100%. If they add to 90% or 110%, something was left out or counted twice.',
        aap: 'AAP: if “other” is 15% and the rest is split equally among 5 clubs, what percent is each club? (85 ÷ 5 = 17%.)',
        tries: [
          () => num('A circle graph has slices 40%, 35%, and one more. What percent is the last slice?', 25, 'The whole is 100%. 100 − 40 − 35 = 25.'),
          () => mc('When is a circle graph the right display?', 'Parts of one whole', [['Change over many months', 'Use a line graph for change over time.'], ['A list of names', 'That is not a part-to-whole comparison.'], ['One single count', 'You need parts that add to a whole.']], 'Circle graphs show how one whole splits into parts.')
        ]
      },
      'From percent to a count': {
        watch: { id: 'pctof', p: 35, n: 20 },
        viz: () => V.hundredGrid(35, { fill: '#ffc43d', label: '35% of 20 students = 7' }),
        steps: ['35% means 35 per 100, or 0.35.', 'Multiply the percent (as a decimal) by the total: 0.35 × 20 = 7.', 'Check: 7 out of 20 is 35% because 7 ÷ 20 = 0.35.'],
        trap: 'Do not just drop the percent sign (35% of 20 is not 35).',
        aap: 'AAP: 15% of 80 students is 0.15 × 80 = 12. Try 12.5% of 80 as a stretch (10).',
        tries: [
          () => num('35% of 20 students is how many students?', 7, '0.35 × 20 = 7.'),
          () => num('25% of 40 is how many?', 10, '0.25 × 40 = 10, or one fourth of 40.')
        ]
      }
    },

    /* ---------- Unit 2 ---------- */
    u2L1: {
      'The order': {
        viz: () => V.cycleSteps(['( )', '× and ÷', '+ and −']),
        steps: ['Parentheses first.', 'Then multiply and divide, left to right — they are partners.', 'Then add and subtract, left to right — they are partners too.'],
        trap: '“Multiply always before divide” is wrong. In 24 ÷ 4 × 2 you divide first because it comes first from the left.',
        aap: 'AAP: simplify 18 + 36 ÷ (3 × 2) − 4. Parentheses first: 3 × 2 = 6, then 36 ÷ 6 = 6, then 18 + 6 − 4 = 20.',
        tries: [
          () => mc('What is the first step in 8 + 3 × (6 − 2)?', '6 − 2', [['8 + 3', 'Parentheses come before addition.'], ['3 × 6', 'Finish the parentheses first.'], ['8 + 3 × 6', 'Do not skip the ( ).']], 'Parentheses first: 6 − 2 = 4.'),
          () => num('Simplify: 5 + 2 × 3', 11, 'Multiply first: 2 × 3 = 6, then 5 + 6 = 11. Not 21.')
        ]
      },
      'Left to right, step by step': {
        viz: () => V.cycleSteps(['24 ÷ 4', '6 × 2', '12 + 3']),
        steps: ['24 ÷ 4 × 2 + 3', '÷ comes first from the left: 6 × 2 + 3', 'Then multiply: 12 + 3 = 15'],
        trap: 'Doing 4 × 2 first (and getting 24 ÷ 8 + 3) is the classic miss. Left to right for × and ÷.',
        aap: 'AAP: try 100 − 40 ÷ 5 × 2. Left to right: 40 ÷ 5 = 8, 8 × 2 = 16, 100 − 16 = 84.',
        tries: [
          () => num('Simplify: 24 ÷ 4 × 2', 12, 'Left to right: 24 ÷ 4 = 6, then 6 × 2 = 12.'),
          () => num('Simplify: 9 − 3 + 2', 8, 'Left to right: 9 − 3 = 6, then 6 + 2 = 8.')
        ]
      }
    },
    u2L2: {
      'Two kinds of numbers': {
        viz: () => V.numberLine(0, 12, [{ pos: 1, label: 'neither' }, { pos: 7, label: 'prime' }, { pos: 12, label: 'composite' }]),
        steps: ['A prime has exactly two factors: 1 and itself (7: 1 and 7).', 'A composite has more than two factors (12: 1, 2, 3, 4, 6, 12).', 'The number 1 is neither prime nor composite.'],
        trap: 'Odd does not mean prime. 9, 15, 21, 25, 27, 35, 45, 49, and 51 are all composite.',
        aap: 'AAP: is 91 prime? 91 = 7 × 13, so it is composite — a frequent challenge number.',
        tries: [
          () => ms('Select all the prime numbers.', ['2', '9', '11', '15', '17'], [0, 2, 4], '2, 11, and 17 have exactly two factors. 9 = 3 × 3 and 15 = 3 × 5.'),
          () => mc('Which statement is true?', '1 is neither prime nor composite', [['1 is prime', 'A prime needs exactly two factors. 1 has only one.'], ['Every odd number is prime', '9 is odd and composite.'], ['2 is composite', '2 has exactly two factors: 1 and 2.']], '1 is a special case: neither prime nor composite.')
        ]
      },
      'Quick tests': {
        viz: () => V.barGraph(['Ends 0,2,4,6,8', 'Digits sum ×3', 'Ends 0 or 5'], [2, 3, 5], { title: 'Divisibility tests', color: '#0fb39c' }),
        steps: ['Even last digit → divisible by 2.', 'Digits add to a multiple of 3 → divisible by 3. (51: 5 + 1 = 6.)', 'Ends in 0 or 5 → divisible by 5.'],
        trap: 'A number can fail the “looks prime” test and still be composite. Always try 3 and 7 on two-digit odds.',
        aap: 'AAP: test 87. 8 + 7 = 15, so 3 divides it: 87 = 3 × 29. Composite.',
        tries: [
          () => mc('Why is 51 composite?', '3 divides it: 51 = 3 × 17', [['It is odd, so it cannot be prime', 'Odd does not decide this.'], ['It ends in 1, so it is prime', 'The last digit 1 does not make a number prime.'], ['It is greater than 50', 'Size is not the test.']], '5 + 1 = 6, so 3 divides 51.'),
          () => mc('Why is 27 composite?', '3 divides it: 27 = 3 × 9', [['It is odd', 'Odd does not mean prime or composite by itself.'], ['It is less than 30', 'Size is not the test.'], ['It ends in 7, so it is prime', 'The last digit 7 does not make a number prime.']], '2 + 7 = 9, so 3 divides 27.')
        ]
      }
    },
    u2L3: {
      'Find the rule, test it twice': {
        viz: () => (w.IX ? w.IX.patternBuilder({ start: 3, jump: 4, kind: 'add' }) : V.hops(['3', '7', '11', '15', '?'], { rule: '+ 4' })),
        steps: ['3, 7, 11, 15, … Check every jump: each one adds 4.', 'The nth term is start + jump × (n − 1). The first term has no jump yet.', 'The 7th term is 3 + 4 × 6 = 27.'],
        trap: 'Do not check only the first jump. A rule has to work on every step.',
        aap: 'Stretch: a multiply pattern 2, 6, 18, 54, … times 3 each step. The 6th term is 2 × 3⁵ = 486. Growing-jump patterns (1, 2, 4, 7, 11, …) add one more each time.',
        tries: [
          () => num('The pattern 5, 12, 19, 26, … continues. What is the 6th term?', 40, '+7 each time: 5 + 7 × 5 = 40.'),
          () => mc('What is the rule for 3, 6, 12, 24, …?', '× 2', [['+ 3', 'The jumps get bigger: +3, +6, +12.'], ['+ 6', 'That only fits one jump.'], ['× 3', '3 × 3 = 9, not 6.']], 'Each term is two times the one before: 3 × 2 = 6, 6 × 2 = 12.')
        ]
      },
      'Pattern families': {
        viz: () => V.patternGallery([
          { name: 'Add', rule: '+ 4', hops: '+4', terms: [3, 7, 11, 15, 19] },
          { name: 'Subtract', rule: '− 5', hops: '−5', terms: [40, 35, 30, 25, 20] },
          { name: 'Multiply', rule: '× 2', hops: '×2', terms: [3, 6, 12, 24, 48] },
          { name: 'Divide', rule: '÷ 2', hops: '÷2', terms: [96, 48, 24, 12, 6] },
          { name: 'Growing jumps', rule: 'jumps grow', hops: ['+1', '+2', '+3', '+4'], terms: [1, 2, 4, 7, 11], star: 1 },
          { name: 'Squares', rule: 'n × n', hops: ['+3', '+5', '+7', '+9'], terms: [1, 4, 9, 16, 25], star: 1 }
        ]),
        steps: ['Add or subtract: the jump is the same size every step (+4, −5).', 'Multiply or divide: the jumps change size, but the multiplier stays the same (× 2, ÷ 2).', 'Check the first two jumps. If the differences are not equal, try multiplying or dividing.'],
        trap: '2, 4, 8, 16 is not "add 2 each time". The jumps are +2, +4, +8, so look for × 2.',
        aap: 'Stretch ★: growing jumps (1, 2, 4, 7, 11, …) add one more each step. Squares (1, 4, 9, 16, 25, …) add the next odd number.',
        tries: [
          () => mc('What is the rule for 96, 48, 24, 12, …?', 'Divide by 2', [['Subtract 48', 'The jump is 48, then 24, then 12: not the same each time.'], ['Subtract 24', 'That only fits one jump.'], ['Divide by 4', '96 ÷ 4 = 24, not 48.']], '96 ÷ 2 = 48, 48 ÷ 2 = 24, and so on.'),
          () => num('What comes next? 45, 38, 31, 24, …', 17, 'Subtract 7 each time: 24 − 7 = 17.')
        ]
      },
      'Function machines': {
        viz: () => (w.IX ? w.IX.machine() : V.ioTable('In', 'Out', ['2', '4', '5'], ['6', '12', '15'])),
        steps: ['A machine follows one rule for every number you put in.', 'Run at least two numbers and write each pair: in → out.', 'Test your guess on every pair. A rule must work for all of them.'],
        trap: 'Checking the rule on only one pair. × 2 and + 4 both turn 4 into 8, but only one of them turns 5 into 10.',
        aap: 'Stretch: two-step machines. Multiply by 3, then add 1: 4 goes in, 4 × 3 = 12, then 12 + 1 = 13 comes out.',
        tries: [
          () => num('A machine adds 6. What comes out when 9 goes in?', 15, '9 + 6 = 15.'),
          () => mc('A machine turns 3 into 12 and 5 into 20. What is the rule?', 'Multiply by 4', [['Add 9', '3 + 9 = 12, but 5 + 9 = 14, not 20.'], ['Multiply by 3', '3 × 3 = 9, not 12.'], ['Add 4', '3 + 4 = 7, not 12.']], '3 × 4 = 12 and 5 × 4 = 20.')
        ]
      },
      'Fractions and decimals in patterns': {
        viz: () => (w.IX ? w.IX.stack(V.hops(['1/8', '3/8', '5/8', '7/8', '?'], { rule: '+ 2/8' }), V.hops(['2.35', '2.50', '2.65', '2.80', '?'], { rule: '+ 0.15' })) : V.hops(['1/8', '3/8', '5/8', '7/8', '?'], { rule: '+ 2/8' })),
        steps: ['Like denominators: add or subtract only the numerators. 1/8 + 2/8 = 3/8.', 'Decimals: line up the decimal points. 2.35 + 0.15 = 2.50.', 'Find the jump from the first two terms, then check it on the next one.'],
        trap: 'Adding the denominators too (1/8 + 2/8 = 3/16). The denominator stays 8.',
        aap: 'Stretch: a decreasing mixed-number pattern 3, 2¾, 2½, … subtracts ¼ each time. Keep each answer in simplest form.',
        tries: [
          () => num('What comes next? 2.35, 2.50, 2.65, 2.80, …', 2.95, 'Add 0.15 each time: 2.80 + 0.15 = 2.95.'),
          () => mc('What comes next? ' + fr(3, 12) + ', ' + fr(5, 12) + ', ' + fr(7, 12) + ', ' + fr(9, 12) + ', …', fr(11, 12), [[fr(10, 12), 'The jump is 2 twelfths, not 1.'], [fr(9, 24), 'The denominator stays 12.'], [fr(13, 12), 'That skips a term. Add only one jump of 2 twelfths.']], 'Add ' + fr(2, 12) + ' each time: ' + fr(9, 12) + ' + ' + fr(2, 12) + ' = ' + fr(11, 12) + '.')
        ]
      },
      'Patterns in stories': {
        viz: () => V.hops(['$5', '$8', '$11', '$14', '?'], { rule: '+ $3', labels: ['start', 'week 1', 'week 2', 'week 3', 'week 4'] }),
        steps: ['A jar starts with $5 and $3 is added each week.', 'After 1 week: 5 + 3 = 8. After 4 weeks: 5 + 3 × 4 = 17.', 'Count the jumps, not the terms. If row 1 is the start, row n has n − 1 jumps.'],
        trap: 'Counting the start as a week. After 4 weeks there are 4 jumps. But if row 1 is the first term, row 6 has only 5 jumps.',
        aap: 'Stretch: a decreasing story. Maya has $60 and spends $7.50 each week. After 4 weeks: 60 − 7.50 × 4 = $30.',
        tries: [
          () => num('A garden has 8 flowers in row 1. Each row has 4 more flowers than the row before. How many flowers are in row 6?', 28, 'Row 1 is the start, so row 6 has 5 jumps: 8 + 4 × 5 = 28.'),
          () => num('Maya has $60. She spends $7.50 every week. How many dollars does she have after 4 weeks?', 30, '$7.50 × 4 = $30. $60 − $30 = $30.')
        ]
      },
      'Missing input': {
        viz: () => V.ioTable('In', 'Out', ['2', '5', '?'], ['8', '20', '36']),
        steps: ['The outputs 8, 20, 36 came from a × 4 rule.', 'To find a missing input, undo the rule.', '36 ÷ 4 = 9.'],
        trap: 'If the input is missing, do not apply the rule forward to the output (36 × 4). Undo it.',
        aap: 'Stretch: a machine does × 3, then + 1. If the output is 16, undo it in reverse order: 16 − 1 = 15, then 15 ÷ 3 = 5.',
        tries: [
          () => num('A machine multiplies by 4. The output is 36. What was the input?', 9, 'Undo the rule: 36 ÷ 4 = 9.'),
          () => num('A machine adds 7. The output is 20. What was the input?', 13, 'Undo: 20 − 7 = 13.')
        ]
      }
    },
    u2B3: {
      'Two-step machines': {
        viz: () => (w.IX ? w.IX.stack(V.ioTable('n', '3n + 1', ['1', '2', '3', '4', '5'], ['4', '7', '10', '13', '16']), V.hops(['4', '7', '10', '13', '16'], { rule: '+ 3', labels: ['n = 1', 'n = 2', 'n = 3', 'n = 4', 'n = 5'] })) : V.ioTable('n', '3n + 1', ['1', '2', '3', '4', '5'], ['4', '7', '10', '13', '16'])),
        steps: ['Multiply n first, then add or subtract: 3n + 1 with n = 2 is 3 × 2 + 1 = 7.', 'The outputs jump by 3, the number in front of n: 4, 7, 10, 13, …', 'Cheat code: 2n gives the evens, and 2n − 1 and 2n + 1 give the odds.'],
        trap: 'Doing the add or subtract first. In 2n + 1, multiply n by 2 first, then add 1.',
        tries: [
          () => num('A machine follows 3n + 1. What comes out when n = 6?', 19, '3 × 6 = 18, then 18 + 1 = 19.'),
          () => mc('Which rule makes 3, 5, 7, 9 when n = 1, 2, 3, 4?', '2n + 1', [['2n − 1', 'That gives 1, 3, 5, 7.'], ['3n', 'That gives 3, 6, 9, 12.'], ['n + 2', 'That gives 3, 4, 5, 6.']], 'The jump is 2, and n = 1 gives 3: 2 × 1 + 1 = 3.')
        ]
      },
      'Jump ahead with n': {
        viz: () => V.hops(['2', '5', '8', '…', '29'], { rule: ['+3', '+3', '+3', '+3'], labels: ['1st', '2nd', '3rd', '…', '10th'] }),
        steps: ['Rule 3n − 1. The 1st term is 3 × 1 − 1 = 2, the 2nd is 5, the 3rd is 8.', 'Do not list ten terms. Put 10 in for n: 3 × 10 − 1 = 29.', 'Check with the jump: 2 + 3 × 9 = 29 too.'],
        trap: 'Using n = 9 or 11. The 10th term uses n = 10.',
        tries: [
          () => num('The rule is 4n + 2. What is term number 10?', 42, '4 × 10 + 2 = 42.'),
          () => num('The rule is 5n − 3. What is the 20th term?', 97, '5 × 20 − 3 = 97.')
        ]
      },
      'Patterns that grow faster': {
        viz: () => V.patternGallery([
          { name: 'Growing jumps', rule: 'jumps grow', hops: ['+1', '+2', '+3', '+4'], terms: [1, 2, 4, 7, 11] },
          { name: 'Doubling', rule: '× 2', hops: '×2', terms: [1, 2, 4, 8, 16] },
          { name: 'Squares', rule: 'n × n', hops: ['+3', '+5', '+7', '+9'], terms: [1, 4, 9, 16, 25] }
        ]),
        steps: ['Write the jumps between terms. If the jumps are all the same, it is add or subtract.', 'If the jumps grow by the same amount (+1, +2, +3, …), the next jump is one bigger.', 'Doubling multiplies each time. Squares add the next odd number.'],
        trap: 'Assuming every pattern adds the same number. Check the jumps first.',
        tries: [
          () => num('What comes next? 1, 2, 4, 7, 11, …', 16, 'The jumps are +1, +2, +3, +4, so the next jump is +5: 11 + 5 = 16.'),
          () => num('What comes next? 1, 4, 9, 16, 25, …', 36, 'These are squares: 6 × 6 = 36.')
        ]
      }
    },
    u2L4: {
      'Expression vs equation': {
        viz: () => V.cycleSteps(['n + 7', 'has no =', 'n + 7 = 12']),
        steps: ['An expression is a phrase: n + 7. No equals sign.', 'An equation is a sentence: n + 7 = 12.', 'A variable is a letter for an unknown number.'],
        trap: 'Solving is for equations. You do not “solve” n + 7 by itself.',
        aap: 'AAP: write two different equations that both have the solution n = 5, such as n + 3 = 8 and 2n = 10.',
        tries: [
          () => mc('Which is an equation?', 'n + 7 = 12', [['n + 7', 'That is an expression — no equals sign.'], ['12 − 7', 'That is an expression.'], ['the number 12', 'A single number is not an equation.']], 'An equation has an equals sign.'),
          () => num('Solve n + 7 = 12. What is n?', 5, 'Use the opposite operation: 12 − 7 = 5.')
        ]
      },
      'Story to equation': {
        viz: () => V.barGraph(['Start p', 'Plus 15', 'Total 42'], [27, 15, 42], { title: 'Pages read', color: '#2f80ed' }),
        steps: ['“Some pages, then 15 more, 42 in all.”', 'Write p + 15 = 42.', 'Opposite operation: p = 42 − 15 = 27.'],
        trap: 'If the story says “got more,” do not start with subtraction in the equation. Subtract when you solve.',
        aap: 'AAP: “4 bags with n apples each make 36.” The equation is 4 × n = 36, so n = 9. Match the operation to the story.',
        tries: [
          () => mc('“Some pages, then 15 more, 42 in all.” Which equation?', 'p + 15 = 42', [['p − 15 = 42', 'The story adds pages, then you subtract to solve.'], ['15 × p = 42', 'Nothing is in equal groups here.'], ['p = 42 + 15', 'That adds 15 twice.']], 'Start + 15 = 42, so p + 15 = 42.'),
          () => num('Solve p + 15 = 42. What is p?', 27, '42 − 15 = 27.')
        ]
      }
    },
    u2B1: {
      'Greatest common factor': {
        viz: () => V.cycleSteps(['18: 1,2,3,6,9,18', '24: 1,2,3,4,6,8,12,24', 'GCF 6']),
        steps: ['List the factors of each number: 18 has 1, 2, 3, 6, 9, 18 and 24 has 1, 2, 3, 4, 6, 8, 12, 24.', 'Circle the factors they share: 1, 2, 3, 6.', 'The greatest one is the GCF: 6.'],
        trap: 'Do not confuse GCF with LCM. The GCF is a factor (it divides both). The LCM is a multiple (both divide it).',
        aap: 'AAP: GCF(24, 36, 60). Shared factors include 12. For three numbers, check the candidate on all three.',
        tries: [
          () => mc('What is the GCF of 12 and 18?', '6', [['36', 'That is a common multiple, not a factor.'], ['3', '3 is common, but 6 is greater.'], ['12', '12 does not divide 18.']], 'Shared factors: 1, 2, 3, 6. The greatest is 6.'),
          () => num('What is the GCF of 8 and 12?', 4, 'Shared factors: 1, 2, 4.')
        ]
      },
      'Least common multiple': {
        viz: () => V.numberLine(0, 24, [{ pos: 4, label: '4' }, { pos: 6, label: '6' }, { pos: 12, label: 'LCM' }, { pos: 24, label: '24' }]),
        steps: ['List multiples of each number.', 'The first one they share is the LCM.', '4: 4, 8, 12… and 6: 6, 12… so LCM(4, 6) = 12.'],
        trap: 'Multiplying the two numbers always gives a common multiple, but not always the least (4 × 6 = 24, but 12 is smaller).',
        aap: 'AAP: LCM(8, 12). 8 × 12 = 96, but the least common multiple is 24.',
        tries: [
          () => mc('What is the LCM of 4 and 6?', '12', [['24', '24 is a common multiple, but not the least.'], ['2', 'That is the GCF.'], ['10', '10 is a sum, not a multiple of both.']], 'The first shared multiple is 12.'),
          () => num('What is the LCM of 3 and 5?', 15, '3 and 5 share no smaller common multiple than 15.')
        ]
      }
    },
    u2B2: {
      'More than one answer': {
        viz: () => ix('lineLab', { mode: 'ray', op: '>', v: 3, min: -2, max: 10, tests: [4, 5, 10, 3.5, 3] }),
        steps: ['An inequality like n > 3 has many solutions: 4, 5, 6, …', 'On a number line, an open circle means the endpoint is not included.', 'A closed circle means it is included (≥ or ≤).'],
        trap: 'For n > 3, 3 itself is not a solution. The inequality is strict.',
        aap: 'AAP: integers that satisfy −2 < n ≤ 1 are −1, 0, and 1. List them all.',
        tries: [
          () => ms('Select all integer solutions of n > 3 from this list.', ['3', '4', '5', '2'], [1, 2], '4 and 5 are greater than 3. 3 is not, and 2 is not.'),
          () => mc('Which describes n ≥ 2?', '2 is included, and every number to the right', [['2 is not included', '≥ means “or equal.”'], ['Only 2', 'Every greater number is also a solution.'], ['Only numbers less than 2', 'The arrow goes to the right.']], '≥ includes the endpoint and everything larger.')
        ]
      },
      'Test the values': {
        viz: () => ix('lineLab', { mode: 'ray', op: '>', v: 3, add: 5, rhs: 8, ops: false, min: -2, max: 10, tests: [2, 3, 4, 6] }),
        steps: ['To test a value, substitute it into the inequality.', 'Keep the inequality direction the same when you add or subtract on both sides.', 'If you multiply or divide both sides by a negative, flip the sign.'],
        trap: 'Forgetting to flip the sign when multiplying or dividing by a negative is the classic AAP-level miss.',
        aap: 'AAP: solve −2n > 6. Divide by −2 and flip: n < −3.',
        tries: [
          () => mc('Does n = 2 satisfy n + 5 > 8?', 'No, 7 is not greater than 8', [['Yes, 2 is greater than 8', 'Substitute into the whole inequality.'], ['Yes, because 2 is positive', 'Sign alone is not the test.'], ['Cannot tell', 'You can test it directly.']], '2 + 5 = 7, and 7 is not greater than 8.'),
          () => num('Solve n + 4 ≥ 10. What is the smallest integer n that works?', 6, 'n ≥ 6. The smallest integer is 6.')
        ]
      }
    },

    /* ---------- Unit 3 ---------- */
    u3L1: {
      'Your safety net': {
        viz: () => V.roundRows([{ n: 387, place: 2 }, { n: 42, place: 1 }]),
        steps: ['Pick the place you are rounding to. Look at the digit just to its right.', '5 or more: round up. 4 or less: stay. 387 → 400 and 42 → 40.', 'Compute the estimate first: 400 × 40 = 16000. After the exact answer (16254), check: is it close?'],
        trap: 'An estimate that is 10 times too big or too small usually means a place-value slip, not a rounding slip.',
        aap: 'AAP: estimate 39 × 21 two ways (40 × 20 = 800, and 40 × 21 = 840) and say which is closer before you multiply exactly.',
        tries: [
          () => mc('Best estimate for 4785 ÷ 61?', '80', [['8', '4800 ÷ 60 is about 80, not 8.'], ['800', 'That is ten times too big.'], ['50', '61 is near 60, and 4785 is near 4800.']], 'Compatible numbers: 4800 ÷ 60 = 80.'),
          () => mc('Best estimate for 19 × 31?', '600', [['50', 'That is near 19 + 31.'], ['190', '31 is about 30, not 10.'], ['6000', '19 × 31 is near 20 × 30 = 600.']], '20 × 30 = 600.')
        ]
      },
      'Compatible numbers for division': {
        viz: () => V.cycleSteps(['3196 ≈ 3200', '38 ≈ 40', '3200 ÷ 40 = 80']),
        steps: ['Look for nearby numbers that divide cleanly.', '3196 is near 3200, 38 is near 40.', '3200 ÷ 40 = 80. The exact answer, 84 R4, is close, so it checks out.'],
        trap: 'Rounding both numbers up (or both down) can push the estimate the same way. Watch the size.',
        aap: 'AAP: 8124 ÷ 28. Compatible: 8400 ÷ 28 = 300, or 8100 ÷ 27 = 300. The exact quotient should be near 300.',
        tries: [
          () => num('Use compatible numbers: about how many is 3600 ÷ 59? Enter your estimate.', 60, '3600 ÷ 60 = 60. Any close estimate (around 60) is the idea; 60 is the compatible-number value.'),
          () => mc('Which pair is most compatible for 247 ÷ 5?', '250 ÷ 5', [['200 ÷ 10', 'The divisor changed too much.'], ['247 ÷ 1', 'That ignores the 5.'], ['300 ÷ 50', 'Both numbers jumped too far.']], '250 ÷ 5 = 50, and 247 is right next to 250.')
        ]
      }
    },
    u3L2: {
      'Multiply top to bottom': {
        viz: () => (w.IX ? w.IX.stepper('mul', { a: 246, b: 35 }) : V.stackMul(246, 35)),
        steps: ['Estimate first: 250 × 35 is about 8,750.', 'Ones digit: 246 × 5 = 1,230. Carry as you go (the small circles).', 'Tens digit: write a 0 in the ones place first, then 246 × 3 = 738, so the row reads 7,380.', 'Add the two rows: 1,230 + 7,380 = 8,610. It is close to the estimate ✓.'],
        trap: 'Forgetting the placeholder zero on the tens row. 246 × 3 tens = 7,380, not 738.',
        aap: 'Stretch: 482 × 316 has three rows. The tens row has one placeholder zero and the hundreds row has two. Estimate first: 500 × 300 = 150,000.',
        tries: [
          () => num('What is 24 × 13?', 312, '24 × 3 = 72; 24 × 10 = 240; 72 + 240 = 312.'),
          () => mc('In 246 × 35, what does the 7,380 row stand for?', '246 × 30', [['246 × 3', 'The 3 is in the tens place, so it is 30. That is what the placeholder zero is for.'], ['246 × 5', 'That is the first row, 1,230.'], ['246 + 35', 'This is multiplication, not addition.']], '3 tens is 30, so the row is 246 × 30 = 7,380.')
        ]
      },
      'Why it works: the box picture': {
        viz: () => V.areaModel(23, 15),
        steps: ['Split each number by place value: 23 = 20 + 3 and 15 = 10 + 5.', 'Each box is one partial product: 20 × 10, 20 × 5, 3 × 10 and 3 × 5.', 'Add the boxes: 200 + 100 + 30 + 15 = 345.', 'The top-to-bottom rows are the same boxes added in two groups: 23 × 5 = 100 + 15 = 115 and 23 × 10 = 200 + 30 = 230.'],
        trap: 'Losing a place value in a box: 20 × 10 is 200, not 20.',
        aap: 'Stretch: split 246 × 35 into six boxes (200, 40, 6 by 30, 5). The six boxes add up to the same 8,610 as the two rows.',
        tries: [
          () => num('What is 12 × 15? Use either way.', 180, '12 × 5 = 60; 12 × 10 = 120; total 180.'),
          () => mc('In 23 × 15, what is the box 20 × 10?', '200', [['20', 'Keep the place value: 20 tens is 200.'], ['23', 'That is a factor, not a box.'], ['30', 'That is 3 × 10.']], '20 × 10 = 200.')
        ]
      },
      'Try one': {
        viz: () => (w.IX ? w.IX.stepper('mul', { a: 318, b: 24 }) : V.stackMul(318, 24)),
        steps: ['Estimate: 300 × 25 = 7,500.', 'Ones digit: 318 × 4 = 1,272.', 'Tens digit: write a 0 first, then 318 × 2 = 636, so the row reads 6,360.', 'Add: 1,272 + 6,360 = 7,632. Close to 7,500 ✓.'],
        trap: 'Adding the factors (318 + 24) is not multiplication.',
        aap: 'Stretch: 36 × 25. Use × 100 ÷ 4: 36 × 100 = 3,600, then 3,600 ÷ 4 = 900.',
        tries: [
          () => num('What is 14 × 12?', 168, '14 × 2 = 28; 14 × 10 = 140; total 168.'),
          () => num('What is 15 × 11?', 165, '15 × 1 = 15; 15 × 10 = 150; total 165.')
        ]
      }
    },
    u3L3: {
      'Estimate each digit of the quotient': {
        viz: () => (w.IX ? w.IX.stepper('div', { a: 1554, b: 42 }) : V.cycleSteps(['Divide', 'Multiply', 'Subtract', 'Bring down'])),
        steps: ['42 does not fit in 1 or in 15, so start with the first three digits: 155.', 'Divide: about 3 (think 40 into 150). Multiply: 3 × 42 = 126. Subtract: 155 − 126 = 29. Bring down the 4 to make 294.', 'Divide: about 7 (40 into 290). Multiply: 7 × 42 = 294. Subtract: 0. Nothing is left to bring down.', 'The answer is 37. Check: 37 × 42 = 1554 ✓.'],
        trap: 'A too-big estimate (7 × 23 = 161, which is larger than 156) means you drop the digit by 1 and try again.',
        aap: 'AAP: 748 ÷ 32. 32 × 20 = 640, 32 × 23 = 736, so the quotient is 23 with a small remainder.',
        tries: [
          () => mc('In 156 ÷ 23, what is the best first-digit try?', '6, because 23 × 6 = 138', [['9, because 23 is near 20', '23 × 9 = 207, which is too big.'], ['2, because 2 × 23 = 46', 'That is far too small for 156.'], ['23', 'The quotient digit is not the divisor.']], '23 × 6 = 138, which fits; 23 × 7 = 161, which does not.'),
          () => num('How many 15s fit in 90?', 6, '15 × 6 = 90.')
        ]
      },
      'Try one': {
        viz: () => (w.IX ? w.IX.stepper('div', { a: 1932, b: 23 }) : V.cycleSteps(['Divide', 'Multiply', 'Subtract', 'Bring down'])),
        steps: ['19 is too small for 23, so start with 193. Divide: 9 × 23 = 207 is too big, so use 8. Multiply: 8 × 23 = 184. Subtract: 9.', 'Bring down the 2 to make 92. Divide: 92 ÷ 23 = 4. Multiply: 4 × 23 = 92. Subtract: 0.', 'If a 0 shows up in the quotient, still bring the next digit down. Check by multiplying: 84 × 23 = 1932 ✓.'],
        trap: 'Skipping a 0 in the quotient shifts every later digit one place left.',
        aap: 'AAP: 1001 ÷ 7 = 143. Watch the middle 0 in the work, even though the quotient here has no 0.',
        tries: [
          () => num('How many 12s fit in 84?', 7, '12 × 7 = 84.'),
          () => mc('In 84 ÷ 12, the first (and only) quotient digit is', '7', [['8', '12 × 8 = 96, which is too big.'], ['6', '12 × 6 = 72; one more 12 fits.'], ['12', '12 is the divisor, not the quotient.']], '12 × 7 = 84.')
        ]
      }
    },
    u3L4: {
      'The story decides': {
        viz: () => V.cycleSteps(['Divide', 'Look at R', 'What does R mean?']),
        steps: ['Compute the quotient and remainder.', 'Read the story: do you need whole groups only, leftover items, or a mixed number?', 'The remainder never stays bigger than the divisor.'],
        trap: 'Ignoring the remainder when the story is about leftover seats, or keeping it when the story needs another whole van.',
        aap: 'AAP: 50 ÷ 8 could be 6 R 2, or 6.25, or “7 vans if everyone must ride.” The story picks the form.',
        tries: [
          () => mc('25 students, 6 per van. How many vans are needed so everyone rides?', '5 vans', [['4 vans', '4 × 6 = 24, so one student is left out.'], ['6 vans', 'That is more than needed.'], ['25 vans', 'That would be one student per van.']], '4 vans hold 24; one more van is needed. 5 vans.'),
          () => num('What is the remainder when 29 is divided by 5?', 4, '5 × 5 = 25, and 29 − 25 = 4. 4 is less than 5.')
        ]
      },
      'Your turn': {
        viz: () => V.cycleSteps(['Quotient', 'Remainder', 'Check: d × q + R']),
        steps: ['Write the remainder as R, as a fraction, or by rounding up — whatever the story needs.', 'Check: divisor × quotient + remainder = dividend.', 'The remainder must be smaller than the divisor.'],
        trap: 'A remainder equal to the divisor means you can take one more full group.',
        aap: 'AAP: rewrite 17 ÷ 5 as 3 R 2, as ' + mixed(3, 2, 5) + ', and as 3.4. All three name the same division.',
        tries: [
          () => num('What is the remainder when 17 is divided by 5?', 2, '5 × 3 = 15, and 17 − 15 = 2.'),
          () => mc('17 ÷ 5 as a mixed number is', mixed(3, 2, 5), [['3', 'That drops the remainder.'], [fr(2, 5), 'That is only the leftover part.'], ['5 R 2', 'The divisor and remainder were swapped.']], '3 wholes and 2 fifths left: 3 2/5.')
        ]
      }
    },
    u3L6: {
      'A shortcut for repeated multiplication': {
        viz: () => V.cycleSteps(['10 × 10 × 10', '10³', '1000']),
        steps: ['An exponent counts how many times the base is a factor: 10³ = 10 × 10 × 10 = 1000.', 'The base is the number being multiplied (10 here). The exponent is the small number up high.', 'With base 10, the answer is a 1 followed by that many zeros: 10³ = 1000 and 10⁵ = 100000.'],
        trap: '10³ is not 10 × 3 = 30. It is three factors of 10, which is 1000.',
        aap: 'Stretch: other bases. 2⁵ = 2 × 2 × 2 × 2 × 2 = 32 and 3⁴ = 81. Only base 10 just adds zeros; other bases need the repeated multiplication.',
        tries: [
          () => num('What is 10 to the 4th power (10⁴)?', 10000, '10 × 10 × 10 × 10 = 10000, a 1 with four zeros.'),
          () => mc('What is 10²?', '100', [['20', 'That is 10 × 2. The exponent counts factors of 10.'], ['1000', 'That would be 10³. 10² has two factors of 10.'], ['102', 'The 2 is an exponent, not a digit.']], '10 × 10 = 100.')
        ]
      },
      'Perfect squares': {
        viz: () => V.squaresGallery(20),
        steps: ['A perfect square is a whole number times itself: 6 × 6 = 36, written 6².', 'Picture n rows of n. The tiles above are drawn to scale, so you can see each square grow.', 'Each square is the last one plus the next odd number: 6² + 13 = 49 = 7².', 'Squares only end in 0, 1, 4, 5, 6 or 9. A number ending in 2, 3, 7 or 8 is never a perfect square.', 'Know 1² to 12² cold. Recognize the rest up to 20² = 400.'],
        trap: '8² is 64, not 16. Square means the number times itself, not twice the number.',
        aap: 'Stretch: is 324 a perfect square? 18 × 18 = 324, yes. Is 250? 15² = 225 and 16² = 256, so 250 sits between two squares and is not one. Square root undoes squaring: √144 = 12.',
        tries: [
          () => num('What is 9 squared (9 × 9)?', 81, '9 × 9 = 81.'),
          () => mc('Which is a perfect square?', '49', [['48', '48 is 6 × 8, not a number times itself.'], ['18', '18 is 9 × 2, not a number times itself. The squares go 16, 25, 36.'], ['99', '9 × 11, not a square.']], '7 × 7 = 49.')
        ]
      },
      'Powers of 10: count the zeros': {
        viz: () => V.cycleSteps(['10 × 10 × 10', '10³', '1000']),
        steps: ['Write the power of 10 as repeated multiplication.', 'The exponent is the number of zeros: 10⁴ has 4 zeros.', 'To multiply by 10³, move the digits 3 places (add 3 zeros).'],
        trap: '10³ is not 30. It is 1 followed by three zeros: 1000.',
        aap: 'Stretch: 10⁶ = 1000000 (one million). 10⁹ is one billion.',
        tries: [
          () => num('What is 10⁴?', 10000, '10 × 10 × 10 × 10 = 10000, a 1 with four zeros.'),
          () => mc('What is 6 × 10³?', '6000', [['60', 'That is 6 × 10.'], ['18', 'That is 6 × 3.'], ['600', 'That is 6 × 10². Count three zeros.']], '10³ = 1000, so 6 × 1000 = 6000.')
        ]
      }
    },
    u3B1: {
      'Three digits by three digits': {
        viz: () => (w.IX ? w.IX.stepper('mul', { a: 482, b: 316 }) : V.stackMul(482, 316)),
        steps: ['Estimate first: 500 × 300 = 150,000.', 'Ones: 482 × 6 = 2,892. Tens: write one 0, then 482 × 1 = 482, so 4,820. Hundreds: write two 0s, then 482 × 3 = 1,446, so 144,600.', 'Add the three rows: 2,892 + 4,820 + 144,600 = 152,312. Close to the estimate ✓.'],
        trap: 'A hundreds row needs two placeholder zeros. Writing 1,446 instead of 144,600 makes the answer 100 times too small.',
        tries: [
          () => num('What is 123 × 211?', 25953, '123 × 1 = 123; 123 × 10 = 1230; 123 × 200 = 24600; total 25953.'),
          () => mc('Best estimate for 389 × 412?', '160000', [['16000', 'Count the zeros: 400 × 400 = 160000.'], ['1600000', 'Count the zeros: 400 × 400 = 160000.'], ['800', 'That is about the sum.']], '400 × 400 = 160000.')
        ]
      },
      'Remainder as a decimal': {
        viz: () => V.cycleSteps(['357 ÷ 8', '44 R5', 'bring down 0s', '44.625']),
        steps: ['357 ÷ 8 = 44 with 5 left over.', 'Put a decimal point after the 44 and a 0 after 357. Now 50 ÷ 8 = 6 R2.', 'Bring down another 0: 20 ÷ 8 = 2 R4. Again: 40 ÷ 8 = 5, nothing left.', 'So 357 ÷ 8 = 44.625.'],
        trap: 'Writing 44.5 for 44 R5. The 5 left over is 5 whole units still to divide, not 5 tenths.',
        tries: [
          () => num('Find 7 ÷ 4 as a decimal.', 1.75, '7 ÷ 4 = 1 R3. 30 ÷ 4 = 7 R2, then 20 ÷ 4 = 5. So 1.75.'),
          () => num('Find 18 ÷ 5 as a decimal.', 3.6, '18 ÷ 5 = 3 R3. 30 ÷ 5 = 6. So 3.6.')
        ]
      }
    },
    u3B2: {
      'Square roots undo squaring': {
        viz: () => V.squaresGallery(20, { highlight: [15] }),
        steps: ['Squaring multiplies a number by itself: 15² = 225.', 'A square root goes the other way: √225 = 15.', 'Find the number in the list, then read its root: 289 → 17, 361 → 19.'],
        trap: '√49 is 7, not 24.5. A square root is not half.',
        tries: [
          () => num('What is √81?', 9, '9 × 9 = 81.'),
          () => num('What is √324?', 18, '18 × 18 = 324.')
        ]
      },
      'Is it a perfect square?': {
        viz: () => V.cycleSteps(['12² = 144', '150', '13² = 169']),
        steps: ['Check the last digit: a square never ends in 2, 3, 7 or 8.', 'Then find its neighbors in the list: 144 < 150 < 169.', 'If it falls strictly between two squares, it is not a perfect square.'],
        trap: 'Ending in 5 does not make it a square. 65 ends in 5, but 8² = 64 and 9² = 81.',
        tries: [
          () => mc('Is 196 a perfect square?', 'Yes, 14 × 14', [['No, it ends in 6', 'Squares can end in 6 (16, 36). 14 × 14 = 196.'], ['No, 196 is even', 'Even squares are common: 4, 16, 36.'], ['Yes, 13 × 15', '13 × 15 = 195, which is one less.']], '14 × 14 = 196.')
        ]
      }
    },
    u3B3: {
      'Other bases grow fast': {
        viz: () => V.cycleSteps(['2⁶ = 64', '2⁷ = 128', '2⁸ = 256']),
        steps: ['Base 10 only adds zeros. Other bases need the repeated multiplication.', 'Each time the exponent goes up by 1, multiply by the base once more: 2⁴ = 16, 2⁵ = 32, 2⁶ = 64, 2⁷ = 128, 2⁸ = 256.', 'Swapping base and exponent changes the value: 3⁵ = 243 but 5³ = 125.'],
        trap: 'Thinking a power is a product: 3⁵ is not 15.',
        tries: [
          () => num('What is 2⁸?', 256, '2 × 2 = 4, 8, 16, 32, 64, 128, 256.'),
          () => num('What is 3⁴?', 81, '3 × 3 = 9; 9 × 3 = 27; 27 × 3 = 81.')
        ]
      },
      'Powers come right after parentheses': {
        viz: () => V.cycleSteps(['( )', 'powers', '× ÷', '+ −']),
        steps: ['Parentheses first.', 'Then powers: 2² = 4.', 'Then × and ÷ from left to right: 4 × 5 = 20.', 'Last + and − from left to right: 3 + 20 = 23.'],
        trap: 'Doing 3 + 2 first. Powers and multiplication beat addition, so 3 + 2² × 5 is 23, not 125.',
        tries: [
          () => num('What is 4 + 3² × 2?', 22, '3² = 9; 9 × 2 = 18; 4 + 18 = 22.'),
          () => num('What is (2 + 3)² − 5?', 20, '2 + 3 = 5; 5² = 25; 25 − 5 = 20.')
        ]
      }
    }
    ,

    /* ---------- Unit 4 ---------- */
    u4c1: {
      'Fraction–decimal sense': {
        viz: () => V.hundredGrid(10, { fill: '#0fb39c', label: '10 hundredths = 1 tenth' }),
        steps: ['Tenths are the first place to the right of the point.', 'Hundredths are the second place.', fr(1, 10) + ' = 0.1 and ' + fr(1, 100) + ' = 0.01.'],
        trap: '0.10 and 0.1 are the same amount. The extra zero does not make it ten times smaller.',
        aap: 'AAP: compare 0.09 and 0.1. 0.10 is 10 hundredths, so 0.1 > 0.09 even though 9 looks bigger than 1.',
        tries: [
          () => mc('Which decimal equals ' + fr(3, 10) + '?', '0.3', [['0.03', 'That is 3 hundredths.'], ['3.0', 'That is 3 wholes.'], ['0.003', 'That is thousandths.']], '3 tenths is 0.3.'),
          () => num('How many hundredths are in one tenth?', 10, '10 hundredths make 1 tenth: 0.10 = 0.1.')
        ]
      },
      'One whole, cut into 100': {
        viz: () => ixGrid({ start: 100, fill: '#0fb39c', tip: 'Clear it, then shade it back. Every square is 0.01.' }),
        steps: ['A 10-by-10 grid is one whole.', 'Each small square is ' + fr(1, 100) + ' or 0.01.', 'All 100 squares make 1.'],
        trap: 'Shaded 1 row is 10 squares: 0.10, not 0.01 and not 0.1 of a single square.',
        aap: 'AAP: 1000 thousandths also make one whole. 0.250 = 250 thousandths = 25 hundredths = ' + fr(1, 4) + '.',
        tries: [
          () => num('How many small squares make one whole hundredths grid?', 100, 'A 10-by-10 grid has 100 hundredths.'),
          () => mc('If 7 squares are shaded on a hundredths grid, what decimal is that?', '0.07', [['0.7', 'That would be 70 squares.'], ['7', '7 wholes would be 7 grids.'], ['0.007', 'That is thousandths.']], '7 hundredths is 0.07.')
        ]
      },
      'Twenty hundredths': {
        viz: () => ixGrid({ start: 20, fill: '#0fb39c', challenges: [{ n: 1, d: 5 }, { n: 1, d: 10 }, { n: 3, d: 10 }, { n: 2, d: 5 }, { n: 1, d: 20 }] }),
        steps: [fr(20, 100) + ' is 20 hundredths, or 0.20.', 'Simplify: divide 20 and 100 by 20 to get ' + fr(1, 5) + '.', '0.20 = 0.2 = ' + fr(1, 5) + '.'],
        trap: '20/100 is not 20. The denominator tells the size of each piece.',
        aap: 'AAP: ' + fr(45, 100) + ' = 0.45 = ' + fr(9, 20) + '. Find a second name besides the decimal.',
        tries: [
          () => mc('Which is equal to ' + fr(20, 100) + '?', fr(1, 5), [[fr(1, 20), 'Simplify by 20, not by 5 only on the top.'], [fr(20, 10), 'Do not drop a zero from only one part.'], ['20', '20 hundredths is less than one whole.']], '20 and 100 divide by 20: ' + fr(1, 5) + '.'),
          () => num('What decimal equals 20 hundredths?', 0.2, '20 hundredths is 0.20, which is 0.2.')
        ]
      },
      'Tenths sit in the first place': {
        viz: () => (w.IX ? w.IX.stack(V.placeValue('0.47'), ixGrid({ start: 47, fill: '#2f80ed', tip: 'Full rows are tenths. Single squares are hundredths.', challenges: [{ dec: '0.4' }, { dec: '0.04' }, { dec: '0.74' }, { dec: '0.09' }, { dec: '0.6' }] })) : V.placeValue('0.47')),
        steps: ['Read the places from the point: tenths, then hundredths.', 'In 0.47, the 4 is 4 tenths and the 7 is 7 hundredths.', '0.47 = ' + fr(47, 100) + '.'],
        trap: 'The first digit after the point is tenths, not hundredths. 0.4 is much larger than 0.04.',
        aap: 'AAP: in 3.05 the 5 is hundredths (the tenths place is 0). 3.05 = 3 + ' + fr(5, 100) + '.',
        tries: [
          () => mc('In 0.47, what does the 4 mean?', '4 tenths', [['4 hundredths', 'Hundredths is the second place.'], ['4 ones', 'The ones place is left of the point.'], ['4 tenths and 4 hundredths', 'Each digit has one place.']], 'The first place to the right is tenths.'),
          () => num('Write ' + fr(9, 10) + ' as a decimal.', 0.9, '9 tenths is 0.9.')
        ]
      }
    },
    u4c2: {
      'Friendly denominators': {
        watch: { id: 'scale100', n: 3, d: 4 },
        viz: () => ixBar({ d: 4, n: 3, dens: [2, 4, 5, 10, 20], fill: '#e85d04', tip: 'Try 4 parts, then 5, then 20. Watch the hundredths name.' }),
        steps: ['Factors of 100 (2, 4, 5, 10, 20, 25, 50) rename easily as hundredths.', fr(1, 4) + ' = ' + fr(25, 100) + ' = 0.25.', fr(3, 5) + ' = ' + fr(60, 100) + ' = 0.60.'],
        trap: 'To rename, multiply the numerator and the denominator by the same number. Changing only one part breaks the value.',
        aap: 'AAP: ' + fr(7, 20) + ' = ' + fr(35, 100) + ' = 0.35. For 8ths you need thousandths: ' + fr(1, 8) + ' = 0.125.',
        tries: [
          () => mc('Which is equal to ' + fr(1, 4) + '?', '0.25', [['0.14', 'That just writes the digits 1 and 4.'], ['0.4', 'That is 4 tenths, or ' + fr(2, 5) + '.'], ['1.4', 'That is more than one whole.']], fr(1, 4) + ' = ' + fr(25, 100) + ' = 0.25.'),
          () => num('What decimal equals ' + fr(3, 5) + '?', 0.6, fr(3, 5) + ' = ' + fr(60, 100) + ' = 0.6.')
        ]
      },
      'Try the rename': {
        watch: { id: 'scale100', n: 4, d: 25 },
        viz: () => ixGrid({ start: 0, fill: '#ffc43d', challenges: [{ n: 2, d: 5 }, { n: 3, d: 4 }, { n: 7, d: 20 }, { n: 1, d: 4 }, { n: 9, d: 10 }, { n: 1, d: 2 }, { n: 11, d: 25 }] }),
        steps: ['Write the fraction with a denominator of 100 when you can.', '40 hundredths is 0.40 = 0.4 and also ' + fr(2, 5) + '.', 'Check by simplifying or by multiplying back.'],
        trap: '0.75 is not 75 and not ' + fr(75, 10) + '. The 75 sits in the hundredths.',
        aap: 'AAP: rename ' + fr(11, 25) + ' as a decimal. 25 × 4 = 100, so ' + fr(44, 100) + ' = 0.44.',
        tries: [
          () => mc('Which equals ' + fr(3, 4) + '?', '0.75', [['0.34', 'Do not glue the digits 3 and 4.'], ['0.3', 'That is 3 tenths, or 3/10.'], ['3.4', 'That is more than three wholes.']], '3/4 = 75/100 = 0.75.'),
          () => num('What decimal equals ' + fr(1, 5) + '?', 0.2, '1/5 = 20/100 = 0.2.')
        ]
      }
    },
    u4c3: {
      'Eighths have three decimal digits': {
        watch: { id: 'eighths', n: 5 },
        viz: () => ixBar({ d: 8, n: 3, dens: [2, 4, 8], fill: '#0fb39c', tip: 'Shade eighths one at a time. Each one adds 0.125.' }),
        steps: [fr(1, 8) + ' = 0.125 because 8 × 125 = 1,000 (thousandths).', 'The eighths to memorize: 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875.', fr(1, 4) + ' is also 2 eighths, so 0.25.'],
        trap: fr(1, 8) + ' is not 0.8 or 0.18. It needs three decimal digits.',
        aap: 'AAP: ' + fr(3, 8) + ' = 0.375 and ' + fr(7, 8) + ' = 0.875. Halfway between 0.75 and 1 is 0.875, not 0.8.',
        tries: [
          () => mc('What decimal equals ' + fr(1, 8) + '?', '0.125', [['0.8', 'That is 8 tenths.'], ['0.18', 'That just writes 1 and 8.'], ['0.12', 'Keep going to thousandths: 0.125.']], '8 × 0.125 = 1.'),
          () => num('What decimal equals ' + fr(3, 8) + '?', 0.375, '3 × 0.125 = 0.375.')
        ]
      },
      'Thirds repeat': {
        viz: () => (w.IX ? w.IX.stack(w.IX.stepper('div', { a: 1000, b: 3, dp: 3, own: false }), ixBar({ d: 3, n: 1, dens: [3, 6, 9, 2, 4], fill: '#ff5a36', tip: 'Thirds, sixths and ninths repeat. Halves and fourths stop.' })) : ixBar({ d: 3, n: 1, dens: [3, 6, 9, 2, 4], fill: '#ff5a36' })),
        steps: [fr(1, 3) + ' means 1 ÷ 3. Divide 1.000 by 3 and watch the remainder: it is 1 every time.', fr(1, 3) + ' = 0.333… (the 3s keep going) and ' + fr(2, 3) + ' = 0.666… (the 6s keep going).', 'A bar over the repeating digit is a precise way to write it. On a test you can give the fraction or three decimal digits.'],
        trap: '0.3 is 3 tenths, which is a little less than ' + fr(1, 3) + '. Do not stop at one digit and call it exact.',
        aap: 'AAP: ' + fr(1, 6) + ' = 0.1666… and ' + fr(1, 9) + ' = 0.111…. Repeating decimals are still exact fractions.',
        tries: [
          () => mc('Which best names ' + fr(1, 3) + '?', '0.333…', [['0.3 exactly', '0.3 is 3 tenths, a little small.'], ['0.13', 'That writes 1 and 3.'], ['3.0', 'That is 3 wholes.']], 'Dividing 1 by 3 repeats forever: 0.333…'),
          () => mc('What decimal equals ' + fr(2, 3) + '?', '0.666…', [['0.23', 'That writes the digits 2 and 3.'], ['0.6 exactly', '0.6 is 3/5, a little small.'], ['2.3', 'That is more than two wholes.']], '2 ÷ 3 = 0.666…')
        ]
      }
    },
    u4c4: {
      'A point has more than one name': {
        viz: () => ix('lineLab', { mode: 'drop', rounds: [{ chips: [{ n: 3, d: 4 }, { n: 6, d: 8 }, { n: 75, d: 100 }, '0.75'], min: 0, max: 1, step: 0.05 }, { chips: [{ n: 1, d: 2 }, { n: 2, d: 4 }, '0.5'], min: 0, max: 1, step: 0.05 }] }),
        steps: ['The same point can be ' + fr(3, 4) + ', ' + fr(6, 8) + ', ' + fr(75, 100) + ', and 0.75.', 'Multiply or divide the numerator and denominator by the same number.', 'Select every name that sits on that same point.'],
        trap: 'Changing only the numerator (or only the denominator) moves the point. Both parts have to scale together.',
        aap: 'AAP: ' + mixed(1, 1, 2) + ' = 1.5 = ' + fr(3, 2) + ' = 150%. Mixed numbers, improper fractions, decimals, and percents can all match.',
        tries: [
          () => ms('Select all names for ' + fr(1, 2) + '.', [fr(2, 4), fr(3, 5), '0.5', fr(50, 100), '0.05'], [0, 2, 3], fr(2, 4) + ', 0.5, and ' + fr(50, 100) + ' are the same point. ' + fr(3, 5) + ' is 0.6, and 0.05 is 5 hundredths.'),
          () => mc('Which is equal to 0.25?', fr(1, 4), [[fr(1, 25), '1/25 is 0.04, not 0.25.'], [fr(2, 5), 'That is 0.4.'], ['0.025', 'That is 25 thousandths.']], '0.25 = ' + fr(25, 100) + ' = ' + fr(1, 4) + '.')
        ]
      }
    },
    u4a1: {
      'A ratio compares two amounts': {
        viz: () => V.barGraph(['Red', 'Blue'], [3, 5], { title: '3 to 5 jerseys', color: '#0fb39c' }),
        steps: ['3 red jerseys to 5 blue jerseys is the ratio 3 : 5, two amounts in order.', 'It can also be written 3 to 5 or ' + fr(3, 5) + '.', 'Order matters: 3 : 5 is not 5 : 3.'],
        trap: 'Flipping the order changes the comparison. 3 : 5 is not the same as 5 : 3.',
        aap: 'AAP: a ratio can compare part to part or part to whole. 2 : 5 juice to water is not 2 : 7 unless you mean juice to the total mix.',
        tries: [
          () => mc('Which ratio matches 3 cups red to 5 cups blue?', '3 : 5', [['5 : 3', 'The order is red first, then blue.'], ['3 : 8', 'That would be red to the total.'], ['8 : 3', 'That adds the parts in the wrong order.']], 'Write the amounts in the same order as the words: 3 : 5.'),
          () => num('In the ratio 3 : 5, how many parts are in the second amount?', 5, 'The second number in 3 : 5 is 5.')
        ]
      },
      'Equivalent ratios scale together': {
        viz: () => V.barGraph(['3:5', '6:10', '9:15'], [3, 6, 9], { title: 'Both parts × 2, then × 3', color: '#0fb39c' }),
        steps: ['3 : 5, 6 : 10, and 9 : 15 are equivalent.', 'Multiply (or divide) both parts by the same number.', 'A table of equal ratios is just this scaling, column by column.'],
        trap: 'If you change only one part, the ratio is no longer equivalent.',
        aap: 'AAP: simplify 12 : 18 by dividing both parts by 6 to get 2 : 3, then build 8 : 12 as another equivalent.',
        tries: [
          () => mc('Which ratio is equivalent to 2 : 5?', '6 : 15', [['3 : 5', 'Only the first part changed.'], ['2 : 10', 'Only the second part changed.'], ['7 : 10', 'That adds 5 to each part.']], 'Both parts × 3: 6 : 15.'),
          () => num('2 : 5 is scaled by 4. What is the second number in the new ratio?', 20, '5 × 4 = 20. The new ratio is 8 : 20.')
        ]
      }
    },
    u4a2: {
      'A table of equal ratios': {
        viz: () => V.barGraph(['×1', '×2', '×3'], [2, 4, 6], { title: 'Concentrate cups', color: '#0fb39c' }),
        steps: ['Each column is a scaled copy of the first pair.', 'If 2 cups concentrate go with 5 cups water, then 4 go with 10 and 6 go with 15.', 'Find a missing entry by using the same scale factor on both rows.'],
        trap: 'Adding the same number to both parts (2 : 5 → 3 : 6) does not keep the ratio. You must multiply.',
        aap: 'AAP: if 8 is in the concentrate row and the first column is 2 to 5, the scale is ×4, so water is 20.',
        tries: [
          () => num('A mix is 2 to 5. If you use 6 cups of the first amount, how many cups of the second?', 15, '6 is 2 × 3, so 5 × 3 = 15.'),
          () => mc('Which column belongs with 2 : 5?', '8 : 20', [['8 : 10', 'Only the first part was scaled by 4.'], ['7 : 10', 'That adds 5 to each part.'], ['2 : 20', 'Only the second part was scaled.']], 'Both parts × 4: 8 : 20.')
        ]
      }
    },
    u4a3: {
      'Out of 100': {
        watch: { id: 'scale100', n: 3, d: 4 },
        viz: () => ixGrid({ start: 75, pct: true, fill: '#ffc43d', challenges: [{ pct: 25 }, { pct: 60 }, { n: 1, d: 2 }, { pct: 5 }, { dec: '0.35' }, { n: 4, d: 5 }] }),
        steps: ['Percent means “per hundred.”', fr(3, 4) + ' = 0.75 = 75 hundredths = 75%.', 'The same amount has a fraction name, a decimal name, and a percent name.'],
        trap: '75% is 0.75, not 75 and not 7.5. Move the point two places when you go between a percent and a decimal.',
        aap: 'AAP: 4% is 0.04, not 0.4. 150% is 1.5, more than one whole.',
        tries: [
          () => mc('What percent equals ' + fr(3, 4) + '?', '75%', [['34%', 'Do not just write the digits 3 and 4.'], ['3.4%', 'That would be a tiny amount.'], ['25%', 'That is ' + fr(1, 4) + '.']], fr(3, 4) + ' = ' + fr(75, 100) + ' = 75%.'),
          () => num('What percent equals 0.2?', 20, '0.20 is 20 hundredths, or 20%.')
        ]
      },
      'Mixed numbers greater than 100%': {
        viz: () => V.fractionBar(3, 2, { fill: '#0fb39c', label: '3/2 = 1 1/2 = 150%' }),
        steps: [mixed(1, 1, 2) + ' = 1.5 = 150%.', 'More than one whole is more than 100%.', 'Two wholes would be 200%.'],
        trap: mixed(1, 1, 2) + ' is not 1.12 and not 11%. The whole and the fraction both count.',
        aap: 'AAP: ' + mixed(2, 1, 4) + ' = 2.25 = 225%. A growth of 125% means you now have 225% of the start.',
        tries: [
          () => mc('What percent equals ' + mixed(1, 1, 2) + '?', '150%', [['15%', '1 1/2 is one and a half wholes.'], ['51%', 'Do not glue the 1 and 1/2 digits.'], ['115%', '1/2 is 50%, not 15%.']], '1.5 = 150%.'),
          () => num('What percent equals 2 wholes?', 200, 'Two wholes are 200%.')
        ]
      }
    },

    u4c5: {
      'Two amounts, in order': {
        viz: () => V.barGraph(['Red', 'Blue'], [3, 5], { title: '3 to 5 tiles', color: '#0fb39c' }),
        steps: ['A ratio 3 : 5 compares two amounts in order.', 'It can also be written 3 to 5 or ' + fr(3, 5) + '.', 'Order matters: 3 : 5 is not the same as 5 : 3.'],
        trap: 'Flipping the order changes the comparison. 3 : 5 is not 5 : 3, and 3 : 8 would be red to the total, not red to blue.',
        aap: 'A ratio can compare part to part or part to whole. 3 : 5 red to blue is not 3 : 8 unless you mean red to all the tiles.',
        tries: [
          () => mc('Which ratio matches 3 cups red to 5 cups blue?', '3 : 5', [['5 : 3', 'The order is red first, then blue.'], ['3 : 8', 'That would be red to the total.'], ['8 : 3', 'That adds the parts in the wrong order.']], 'Write the amounts in the same order as the words: 3 : 5.'),
          () => num('In the ratio 3 : 5, how many parts are in the second amount?', 5, 'The second number in 3 : 5 is 5.')
        ]
      },
      'Equivalent ratios scale together': {
        viz: () => V.barGraph(['3:5', '6:10', '9:15'], [3, 6, 9], { title: 'Both parts × 2, then × 3', color: '#0fb39c' }),
        steps: ['3 : 5, 6 : 10, and 9 : 15 are equivalent.', 'Multiply (or divide) both parts by the same number.', 'Changing only one part breaks the ratio.'],
        trap: 'Adding the same number to both parts (3 : 5 → 4 : 6) does not keep the ratio. You must multiply or divide.',
        aap: 'Simplify 12 : 18 by dividing both parts by 6 to get 2 : 3, then build 8 : 12 as another equivalent.',
        tries: [
          () => mc('Which ratio is equivalent to 2 : 5?', '6 : 15', [['3 : 5', 'Only the first part changed.'], ['2 : 10', 'Only the second part changed.'], ['7 : 10', 'That adds 5 to each part.']], 'Both parts × 3: 6 : 15.'),
          () => num('2 : 5 is scaled by 4. What is the second number in the new ratio?', 20, '5 × 4 = 20. The new ratio is 8 : 20.')
        ]
      }
    },
    u4c6: {
      'Percent means per 100': {
        watch: { id: 'scale100', n: 1, d: 4 },
        viz: () => ixGrid({ start: 25, pct: true, fill: '#ffc43d', challenges: [{ pct: 25 }, { pct: 50 }, { n: 1, d: 4 }, { pct: 10 }, { dec: '0.4' }] }),
        steps: ['Percent means “per hundred.”', fr(1, 4) + ' = 0.25 = 25 hundredths = 25%.', 'A hundredths grid shows this directly: 25 shaded squares are 25%.'],
        trap: '25% is 0.25, not 25 and not 2.5. Move the point two places when you go between a percent and a decimal.',
        aap: '4% is 0.04, not 0.4. 150% is 1.5, more than one whole.',
        tries: [
          () => mc('What percent equals ' + fr(1, 4) + '?', '25%', [['14%', 'Do not just write the digits 1 and 4.'], ['4%', 'That would be 4 hundredths.'], ['75%', 'That is ' + fr(3, 4) + '.']], fr(1, 4) + ' = ' + fr(25, 100) + ' = 25%.'),
          () => num('What percent equals 0.4?', 40, '0.40 is 40 hundredths, or 40%.')
        ]
      },
      'Fraction, decimal, percent': {
        watch: { id: 'scale100', n: 3, d: 5 },
        viz: () => ixGrid({ start: 60, pct: true, fill: '#0fb39c', challenges: [{ n: 3, d: 5 }, { pct: 75 }, { dec: '0.2' }, { n: 1, d: 2 }, { pct: 5 }] }),
        steps: ['Write the fraction as hundredths when you can: ' + fr(3, 5) + ' = ' + fr(60, 100) + ' = 0.60 = 60%.', 'The other way: 40% = ' + fr(40, 100) + ' = ' + fr(2, 5) + ' = 0.4.', 'All three names can sit on the same point.'],
        trap: '0.4 is 40%, not 4%. 7% is 0.07, not 0.7.',
        aap: '12.5% is 0.125, which is also ' + fr(1, 8) + '. Percents can have a decimal, just like other numbers.',
        tries: [
          () => mc('Which is equal to ' + fr(3, 5) + '?', '60%', [['35%', 'Do not glue the digits 3 and 5.'], ['3.5%', 'That would be a tiny amount.'], ['0.3%', '0.3 is 30%, and 3/5 is larger.']], fr(3, 5) + ' = ' + fr(60, 100) + ' = 60%.'),
          () => num('Write 40% as a decimal.', 0.4, '40% = 40 hundredths = 0.40 = 0.4.')
        ]
      }
    },
    u4a4: {
      'A percent of a number': {
        viz: () => ixGrid({ start: 25, pct: true, fill: '#2f80ed', tip: '25% of a 100-square grid is 25 squares. 25% of 80 is the same share of 80.' }),
        steps: ['25% of 80 means ' + fr(25, 100) + ' of 80, or 0.25 × 80.', '0.25 × 80 = 20. You can also take one fourth of 80.', 'Friendly percents: 50% is half, 10% is one tenth, 25% is one fourth.'],
        trap: '25% of 80 is not 25. The percent is the share, not the answer by itself.',
        aap: '15% of 80 is 0.15 × 80 = 12. Try 12.5% of 80 as a stretch (10).',
        tries: [
          () => num('What is 25% of 80?', 20, '0.25 × 80 = 20, or one fourth of 80.'),
          () => mc('What is 10% of 40?', '4', [['10', '10% is one tenth, not 10 itself.'], ['40', 'That is the whole amount.'], ['14', 'Do not add 10 and 4.']], '10% = 0.10, and 0.10 × 40 = 4.')
        ]
      }
    },

        /* ---------- Unit 5 ---------- */
    u5L0: {
      'Find the place, then the decider': { viz: () => ix('lineLab', { mode: 'round', x: '4.738', place: 1, more: ['6.251', '3.47', '9.815'] }) },
      'A tenths answer keeps the tenths digit': { viz: () => ix('lineLab', { mode: 'round', x: '3.062', place: 1, wrong: '3.0', more: ['18.296', '5.07', '12.041'] }) },
      'Hundredths keep two decimal places': { viz: () => ix('lineLab', { mode: 'round', x: '0.865', place: 2, wrong: '0.09', more: ['2.314', '0.738', '4.096'] }) },
      'Whole number: the tenths digit decides': { viz: () => ix('lineLab', { mode: 'round', x: '25.351', place: 0, wrong: '30', more: ['8.62', '13.49', '40.5'] }) },
      'When a 9 bumps up': { viz: () => ix('lineLab', { mode: 'round', x: '7.96', place: 1, wrong: '7.10', more: ['3.97', '12.95', '0.98'] }) },
      'One look, no chain': { viz: () => ix('lineLab', { mode: 'round', x: '2.448', place: 1, more: ['5.347', '1.449', '7.046'] }) }
    },
    u5L1: {
      'Decimal points stack': {
        viz: () => ix('decimalStack', { op: '+', a: '4.7', b: '12.35' }),
        steps: ['Line the decimal points up, one under the other.', 'Fill the empty place with a zero: 4.7 = 4.70. Then add like whole numbers.', 'Bring the point straight down into the answer: 4.70 + 12.35 = 17.05.'],
        trap: 'Lining up the last digits instead of the points: 4.7 + 12.35 done that way gives 12.82, which adds 7 tenths to 5 hundredths.',
        aap: 'AAP: 4.5 + 0.75 + 12 = 17.25. The whole number 12 is 12.00 when you line the points up.',
        tries: [
          () => num('Find 1.2 + 0.35', 1.55, 'Line up the points: 1.20 + 0.35 = 1.55.'),
          () => mc('When adding 3.4 and 12.05, which digits share a column?', 'The 4 and the 0 (tenths)', [['The 4 and the 5', 'Those are tenths and hundredths.'], ['The 3 and the 5', 'Different places.'], ['The 3 and the 0', '3 is ones; 0 is tenths.']], 'Stack the points. Tenths sit under tenths.')
        ]
      },
      'Fill in zeros': {
        viz: () => ix('decimalStack', { op: '−', a: '8', b: '2.46' }),
        steps: ['8 has no decimal places showing, so write 8.00 when you subtract 2.46.', 'The value is unchanged.', 'Then subtract: 8.00 − 2.46 = 5.54.'],
        trap: 'Writing 8 − 2.46 as 6.46 (subtracting only the whole numbers and tacking on .46) skips regrouping.',
        aap: 'AAP: 6.3 − 2.85. Annex a zero: 6.30 − 2.85 = 3.45.',
        tries: [
          () => num('Find 8 − 2.46', 5.54, 'Write 8.00 − 2.46 = 5.54.'),
          () => num('Find 6.3 − 2.85', 3.45, 'Write 6.30 − 2.85 = 3.45.')
        ]
      }
    },
    u5L2: {
      'Ignore the point, then place it': {
        viz: () => ixStep('mul', { a: '3.4', b: '6', focus: 'estimate' }),
        steps: ['Estimate first: 3.4 × 6 is near 3 × 6 = 18.', 'Multiply 34 × 6 = 204 as whole numbers.', '3.4 has one decimal place, so the product is 20.4. It is close to 18.'],
        trap: 'Copying the point from one factor without counting. 3.4 × 6 and 3.4 × 0.6 both start as 34 × 6 = 204, but they end as 20.4 and 2.04. Count the places in both factors, then check against the estimate.',
        aap: 'AAP: 1.2 × 0.4 = 0.48 (two places in all). Estimate: a little less than half of 1.2.',
        tries: [
          () => num('Find 3.4 × 6', 20.4, '34 × 6 = 204, and 3.4 has one decimal place: 20.4.'),
          () => mc('Best estimate for 1.9 × 3.1?', '6', [['60', '1.9 is near 2, not 20.'], ['2', 'Too small: 1.9 is about 2 and 3.1 is about 3, so the product is about 2 × 3.'], ['9', 'A little high: 2 × 3 = 6.']], '2 × 3 = 6.')
        ]
      },
      'Count decimal places too': {
        viz: () => ixStep('mul', { a: '2.35', b: '1.2', focus: 'count' }),
        steps: ['Count the decimal places in both factors and add those counts.', '2.35 has 2, 1.2 has 1, so the product has 3 places.', '235 × 12 = 2820, so the product is 2.820 = 2.82.'],
        trap: 'Counting only one factor’s places leaves the point one place off (28.20 or 0.282).',
        aap: 'AAP: 0.25 × 0.4 = 0.100 = 0.1 (three places, with a trailing zero you can drop).',
        tries: [
          () => num('Find 1.5 × 0.2', 0.3, '15 × 2 = 30, and two decimal places make 0.30 = 0.3.'),
          () => mc('2.35 × 1.2 has how many decimal places in the product (before dropping zeros)?', '3', [['2', 'Count both factors: 2 + 1 = 3.'], ['1', '1.2 has one place, but 2.35 has two more.'], ['0', 'There are decimal factors here.']], '2 + 1 = 3 places: 2.820.')
        ]
      }
    },
    u5L3: {
      'A tenth of a tenth': {
        viz: () => (w.IX ? w.IX.overlapGrid({ a: 3, b: 4 }) : V.hundredGrid(12, { fill: '#0fb39c', label: '0.3 × 0.4 = 0.12' })),
        steps: ['0.3 × 0.4 is 3 tenths of 4 tenths: the overlap is 12 squares, 0.12.', 'Each factor has one decimal place, so the product has two.', '0.12 is smaller than both 0.3 and 0.4.'],
        trap: '0.1 × 0.1 is not 0.1 and not 0.2. Multiplication by a tenth makes a number smaller.',
        aap: 'AAP: 0.1 × 0.1 × 0.1 = 0.001 (thousandths). Watch the places pile up.',
        tries: [
          () => num('What is 0.3 × 0.4?', 0.12, '3 × 4 = 12, and two decimal places make 0.12.'),
          () => mc('Which is 0.2 × 0.3?', '0.06', [['0.6', 'Two places in all, not one.'], ['0.5', 'That is a sum.'], ['6', 'The point belongs in the product.']], '2 × 3 = 6, and two decimal places make 0.06.')
        ]
      },
      'Smaller than you think': {
        viz: () => (w.IX ? w.IX.overlapGrid({ a: 2, b: 3, tip: 'Try 0.1 × 0.1, then 0.5 × 0.5. Is the overlap ever bigger than a factor?' }) : V.hundredGrid(6, { fill: '#0fb39c', label: '0.2 × 0.3 = 0.06' })),
        steps: ['A decimal less than 1 shrinks the other factor.', '0.2 × 0.3 = 0.06, which is less than both 0.2 and 0.3.', 'Estimate: a little less than 1/4 of 0.3, or a little more than 1/5 of 0.3.'],
        trap: 'Thinking “multiplication always makes a bigger number” is true for wholes greater than 1, not for tenths.',
        aap: 'AAP: 0.04 × 0.5 = 0.020 = 0.02. Half of 4 hundredths is 2 hundredths.',
        tries: [
          () => num('Find 0.2 × 0.4', 0.08, '2 × 4 = 8, and two places make 0.08.'),
          () => mc('0.5 × 0.5 equals', '0.25', [['1', 'A half of a half is a fourth, not a whole.'], ['0.5', 'Multiplying by 0.5 halves the other factor.'], ['2.5', 'That would be 5 × 0.5.']], '1/2 × 1/2 = 1/4 = 0.25.')
        ]
      }
    },
    u5L4: {
      'Point goes straight up': {
        viz: () => ixStep('div', { a: '7.65', b: 3 }),
        steps: ['When you divide a decimal by a whole number, the point in the quotient sits straight above the point in the dividend.', '7.65 ÷ 3: 7.65 is 765 hundredths, 765 ÷ 3 = 255 hundredths, so 2.55.', 'Estimate: between 6 ÷ 3 = 2 and 9 ÷ 3 = 3.'],
        trap: 'Dropping the point and then guessing (765 ÷ 3 = 255, so the answer is 255) forgets the hundredths.',
        aap: 'AAP: 7.5 ÷ 5 = 1.5. Check: 5 × 1.5 = 7.5.',
        tries: [
          () => num('Find 7.65 ÷ 3', 2.55, 'The point rises straight up: 7.65 ÷ 3 = 2.55.'),
          () => num('Find 8.4 ÷ 2', 4.2, '8.4 ÷ 2 = 4.2. Check: 2 × 4.2 = 8.4.')
        ]
      },
      'Annex a zero': {
        viz: () => ixStep('div', { a: '5.4', b: 4, annex: true }),
        steps: ['Sometimes you need one more place: 5.4 ÷ 4.', 'Write 5.4 as 5.40. Then 540 ÷ 4 = 135, so 1.35.', 'Estimate: about 4 ÷ 4 = 1, or 8 ÷ 4 = 2, so 1.35 fits.'],
        trap: 'Stopping at 1.3 because “5.4 ended in one digit” leaves a remainder you could have kept dividing.',
        aap: 'AAP: 1 ÷ 8 = 0.125. Annex zeros until the remainder is 0 (or a pattern appears).',
        tries: [
          () => num('Find 5.4 ÷ 4', 1.35, '5.40 ÷ 4 = 1.35.'),
          () => num('Find 9.6 ÷ 4', 2.4, '96 ÷ 4 = 24, with the point above: 2.4.')
        ]
      }
    },
    u5L5: {
      'Make the divisor whole': {
        viz: () => ix('placeShift', { mode: 'pair', a: '4.8', b: '0.6' }),
        steps: ['To divide by a decimal, multiply dividend and divisor by the same power of 10 until the divisor is whole.', '4.8 ÷ 0.6 → 48 ÷ 6 = 8.', 'The quotient does not change because both numbers were scaled the same way.'],
        trap: 'Moving the point in only one number (4.8 ÷ 0.6 → 4.8 ÷ 6 = 0.8) makes the answer 10 times too small.',
        aap: 'AAP: 0.84 ÷ 0.12 → 84 ÷ 12 = 7. Two places in each, so ×100 on both.',
        tries: [
          () => num('Find 4.8 ÷ 0.6', 8, 'Multiply both by 10: 48 ÷ 6 = 8.'),
          () => num('Find 1.2 ÷ 0.2', 6, '12 ÷ 2 = 6.')
        ]
      },
      'Why bigger?': {
        viz: () => ix('fitStrips', { whole: '4.8', piece: '0.6' }),
        steps: ['4.8 ÷ 0.6 asks how many 0.6s fit in 4.8.', 'Eight of them fit, so the quotient is 8 — larger than both numbers.', 'Dividing by a number less than 1 makes a larger result.'],
        trap: 'Expecting a smaller answer because “division makes smaller” — that is for divisors greater than 1.',
        aap: 'AAP: 3 ÷ 0.05 = 60. Think: how many nickels (0.05) fit in 3 dollars? 60.',
        tries: [
          () => num('Find 4.8 ÷ 0.6', 8, 'How many 0.6s fit in 4.8? Eight of them. Or 48 ÷ 6 = 8.'),
          () => num('Find 3 ÷ 0.5', 6, 'How many halves fit in 3? Six.')
        ]
      }
    },
    u5B1: {
      'Below zero': {
        viz: () => ix('lineLab', { mode: 'compare', pairs: [[-8, -3], [-2, -6], [-5, 1], [-10, -9]], min: -10, max: 5 }),
        steps: ['Negative numbers sit to the left of 0 on the number line.', '−8 is less than −3, because −8 is farther left.', 'The farther left you go, the smaller the number.'],
        trap: 'Thinking “8 is bigger than 3, so −8 is bigger than −3.” The sign flips the comparison.',
        aap: 'AAP: order −4, 1, −1, 0, −6 from least to greatest: −6, −4, −1, 0, 1.',
        tries: [
          () => mc('Which is smaller, −8 or −3?', '−8', [['−3', '−8 is farther left, so it is smaller.'], ['They are equal', 'They are different places on the line.'], ['8', 'The question is about the negatives.']], 'On the line, −8 is to the left of −3.'),
          () => nline('Slide to −4.', -4, '−4 is four units left of 0.', -8, 8)
        ]
      },
      'Add on a number line': {
        viz: () => ix('lineLab', { mode: 'hop', problems: [{ a: -4, op: '+', b: 6 }, { a: -3, op: '+', b: -2 }], min: -8, max: 8 }),
        steps: ['Start at the first number.', 'Adding a positive: move right. Adding a negative: move left.', '−4 + 6 = 2: start at −4, move 6 right.'],
        trap: 'Adding a negative is not the same as adding the absolute values. −4 + (−3) = −7, not −1.',
        aap: 'AAP: −2 + (−5) + 9 = 2. Combine the negatives first: −7 + 9 = 2.',
        tries: [
          () => num('Find −4 + 6', 2, 'Start at −4, move 6 right: 2.'),
          () => num('Find −3 + (−2)', -5, 'Start at −3, move 2 left: −5.')
        ]
      },
      'Subtract = add the opposite': {
        viz: () => ix('lineLab', { mode: 'hop', problems: [{ a: 3, op: '−', b: 7 }, { a: 3, op: '−', b: -7 }], min: -6, max: 12 }),
        steps: ['Subtracting is adding the opposite.', '3 − 7 = 3 + (−7) = −4.', '3 − (−7) = 3 + 7 = 10. Two minuses in a row become a plus.'],
        trap: '3 − (−7) is not −4. The two minus signs make addition.',
        aap: 'AAP: −5 − (−8) = −5 + 8 = 3. Keep, change, flip.',
        tries: [
          () => num('Find 3 − 7', -4, '3 + (−7) = −4.'),
          () => num('Find 3 − (−7)', 10, '3 + 7 = 10.')
        ]
      }
    },

    /* ---------- Unit 6 ---------- */
    u6L1: {
      'Everything is powers of 10': {
        viz: () => V.metricLadder('m'),
        steps: ['Metric units sit on a ladder of powers of 10.', 'Each step to the right is ×10. Each step to the left is ÷10.', 'From km to m is three steps: ×1000.'],
        trap: 'Treating 1 km as 100 m (two steps) instead of 1000 m (three steps). Count the jumps on the ladder.',
        aap: 'AAP: 1 km = 1000 m = 100,000 cm = 1,000,000 mm. Write one length three ways.',
        tries: [
          () => num('How many meters are in 1 kilometer?', 1000, 'km → hm → dam → m is three ×10 jumps: ×1000.'),
          () => num('How many centimeters are in 1 meter?', 100, 'm → dm → cm is two jumps: ×100.')
        ]
      },
      'Big unit → small unit: multiply': {
        viz: () => ix('placeShift', { mode: 'metric', units: ['m', 'cm', 'mm'], v: '3.5', from: 'm' }),
        steps: ['Going to a smaller unit means more of them, so you multiply.', '3.5 m = 3.5 × 100 = 350 cm (×100).', '2 km = 2000 m (×1000).'],
        trap: 'Dividing when you go to a smaller unit gives a tiny, impossible length (3 m is not 0.03 cm).',
        aap: 'AAP: 2.4 km = 2400 m = 240,000 cm. Keep the 2.4 and move the point with the zeros.',
        tries: [
          () => num('Convert 3.5 meters to centimeters.', 350, '×100: 3.5 m = 350 cm.'),
          () => num('Convert 2 kilometers to meters.', 2000, '×1000: 2 km = 2000 m.')
        ]
      },
      'Small unit → big unit: divide': {
        viz: () => ix('placeShift', { mode: 'metric', units: ['kg', 'g'], v: '2400', from: 'g' }),
        steps: ['Going to a bigger unit means fewer of them, so you divide.', '2400 g = 2400 ÷ 1000 = 2.4 kg (÷1000).', '300 cm = 3 m (÷100).'],
        trap: 'Multiplying when you go to a bigger unit makes a huge, impossible length (300 cm is not 30,000 m).',
        aap: 'AAP: 450 cm = 4.5 m, not 45 m and not 0.45 m. Two places for × or ÷ 100.',
        tries: [
          () => num('Convert 400 centimeters to meters.', 4, '÷100: 400 cm = 4 m.'),
          () => num('Convert 3000 meters to kilometers.', 3, '÷1000: 3000 m = 3 km.')
        ]
      }
    },
    u6L2: {
      'Benchmarks': {
        viz: () => V.barGraph(['mm (thin card)', 'cm (finger width)', 'm (a long step)', 'km (a long walk)'], [1, 10, 1000, 1000000], { title: 'Sense of size', color: '#2f80ed' }),
        steps: ['A millimeter is about the thickness of a dime or a thin card.', 'A centimeter is about a finger width. A meter is a long step.', 'A kilometer is a long walk (about 12 city blocks, or a 10-minute walk).'],
        trap: 'Measuring a room in kilometers, or a road in millimeters, is a units mismatch — even if the conversion is arithmetically possible.',
        aap: 'AAP: a bathtub is about 200 liters, not 200 milliliters. Capacity has its own ladder (kL, L, mL).',
        tries: [
          () => mc('Best unit for the length of a pencil?', 'centimeters', [['kilometers', 'A pencil is not a long walk.'], ['meters', 'A pencil is much shorter than a step.'], ['kilograms', 'That measures mass, not length.']], 'A pencil is about 15–20 cm.'),
          () => mc('Best unit for the distance between two towns?', 'kilometers', [['centimeters', 'Far too small.'], ['millimeters', 'Far too small.'], ['grams', 'That measures mass.']], 'Towns are usually several kilometers apart.')
        ]
      },
      'Pick the best unit': {
        viz: () => V.metricLadder('m'),
        steps: ['Match the unit to the size of what you measure.', 'Room length: meters. Book width: centimeters. Coin thickness: millimeters.', 'If the number would be huge or tiny, switch units.'],
        trap: 'A “reasonable” number is usually not in the millions or in thousandths for everyday objects.',
        aap: 'AAP: 0.75 m = 75 cm = 750 mm. Pick the unit that keeps the number friendly for the job.',
        tries: [
          () => mc('Best unit for the height of a door?', 'meters', [['kilometers', 'A door is not a long walk.'], ['millimeters', 'The number would be huge.'], ['liters', 'That measures capacity.']], 'A door is about 2 meters tall.'),
          () => mc('Best unit for the width of a book?', 'centimeters', [['kilometers', 'Far too big.'], ['meters', 'A book is much shorter than a meter wide.'], ['grams', 'That measures mass.']], 'A book is usually 15–25 cm wide.')
        ]
      }
    },
    u6L3: {
      'Convert first, then compute': {
        viz: () => V.cycleSteps(['2 m', '→ 200 cm', '− 45 cm', '= 155 cm']),
        steps: ['Put every measurement in the same unit before you add or subtract.', '2 m = 200 cm, minus 45 cm is 155 cm.', '155 cm is also 1.55 m.'],
        trap: 'Subtracting 45 − 2 because the units were ignored (2 m − 45 cm is not 43 of anything useful).',
        aap: 'AAP: 2 hours 15 minutes is not 2.15 hours. Convert minutes first: 2 + 15/60 = 2.25 hours, or stay in minutes (135).',
        tries: [
          () => num('A 2 m ribbon has 45 cm cut off. How many centimeters are left?', 155, '2 m = 200 cm, and 200 − 45 = 155 cm.'),
          () => num('2 m + 30 cm, in centimeters?', 230, '2 m = 200 cm, plus 30 cm is 230 cm.')
        ]
      },
      'Your turn': {
        viz: () => ix('placeShift', { mode: 'metric', units: ['km', 'm'], v: '1', from: 'km' }),
        steps: ['Underline the units in the problem.', 'Convert to one unit.', 'Compute, then (if asked) convert the answer back.'],
        trap: 'Converting only one of the two amounts, then subtracting, leaves the units mixed.',
        aap: 'AAP: a 1.2 km run plus a 300 m walk is 1500 m, or 1.5 km. Report both if the problem asks for two units.',
        tries: [
          () => num('1 km + 250 m, in meters?', 1250, '1 km = 1000 m, plus 250 m is 1250 m.'),
          () => num('3 m − 40 cm, in centimeters?', 260, '3 m = 300 cm, minus 40 cm is 260 cm.')
        ]
      }
    },
    u6B1: {
      'A conversion table is a ratio table': {
        viz: () => V.barGraph(['1 m', '2 m', '5 m', '7 m'], [100, 200, 500, 700], { title: 'Centimeters', color: '#0fb39c' }),
        steps: ['Each column scales both rows by the same factor.', '1 m : 100 cm, 2 m : 200 cm, 5 m : 500 cm, 7 m : 700 cm.', 'A missing entry is an equivalent ratio.'],
        trap: 'Filling 1, 2, 3 in one row and 100, 101, 102 in the other (adding 1) instead of multiplying.',
        aap: 'AAP: 2.5 m is the 2.5 column: 250 cm. Scale factors can be decimals.',
        tries: [
          () => num('If 1 m = 100 cm, how many centimeters are 4 meters?', 400, '×4 on both parts: 400 cm.'),
          () => num('If 1 km = 1000 m, how many kilometers are 5000 m?', 5, '5000 ÷ 1000 = 5.')
        ]
      },
      'Rates for one': {
        viz: () => V.cycleSteps(['180 km', 'in 3 h', '60 km in 1 h']),
        steps: ['A unit rate tells the amount for one of something.', '180 km in 3 hours is 180 ÷ 3 = 60 km per hour.', 'Divide both parts of the rate by the same number so the second part becomes 1.'],
        trap: 'Dividing the wrong way (3 ÷ 180) gives hours per kilometer, which is a different unit rate.',
        aap: 'AAP: 3 packs for $12 is $4 per pack, or 0.25 pack per dollar. Name the unit clearly.',
        tries: [
          () => num('180 km in 3 hours is how many kilometers per hour?', 60, '180 ÷ 3 = 60.'),
          () => num('3 packs cost $12. What is the dollar cost per pack?', 4, '12 ÷ 3 = 4.')
        ]
      }
    }


    ,

    /* ---------- Unit 7 ---------- */
    u7L1: {
      'Per hundred': {
        viz: () => ixGrid({ start: 40, pct: true, fill: '#ffc43d', challenges: [{ pct: 8 }, { pct: 65 }, { pct: 1 }, { pct: 100 }, { pct: 30 }] }),
        steps: ['Percent means per hundred: 40% is 40 out of 100.', 'That is also ' + fr(40, 100) + ' = ' + fr(2, 5) + ' = 0.40.', 'A hundredths grid is a picture of every percent from 1 to 100.'],
        trap: '40% is not 40 and not 0.040. Between a percent and a decimal, the point moves two places.',
        aap: 'AAP: 8% of a number is 0.08 times that number, not 0.8. 250% is 2.5 times the number.',
        tries: [
          () => mc('What decimal equals 40%?', '0.4', [['4', '40% is less than one whole.'], ['0.04', 'That is 4%.'], ['40', 'That dropped the percent meaning.']], '40% = 40 hundredths = 0.40 = 0.4.'),
          () => num('How many squares on a hundredths grid show 1%?', 1, 'Each small square is 1 out of 100, or 1%.')
        ]
      },
      'Benchmarks to know cold': {
        viz: () => ixBar({ d: 2, n: 1, dens: [2, 3, 4, 5, 8, 10], pct: true, fill: '#0fb39c' }),
        steps: [fr(1, 2) + ' = 0.5 = 50%. ' + fr(1, 4) + ' = 0.25 = 25%. ' + fr(3, 4) + ' = 0.75 = 75%.', fr(1, 5) + ' = 0.2 = 20%. ' + fr(1, 10) + ' = 0.1 = 10%.', 'These benchmarks help you estimate other percents quickly.'],
        trap: fr(1, 3) + ' is not 30%. It is about 33%, or 33.3…%. 30% is 3/10.',
        aap: 'AAP: 12.5% is ' + fr(1, 8) + '. 37.5% is ' + fr(3, 8) + '. The eighths sit halfway between the quarter benchmarks.',
        tries: [
          () => mc('Which equals 25%?', fr(1, 4), [[fr(1, 25), '1/25 is 4%.'], [fr(2, 5), 'That is 40%.'], ['0.025', 'That is 2.5%.']], '25% = ' + fr(25, 100) + ' = ' + fr(1, 4) + '.'),
          () => num('What percent equals ' + fr(1, 2) + '?', 50, fr(1, 2) + ' = 50%.')
        ]
      }
    },
    u7L2: {
      'The triangle of names': {
        viz: () => V.cycleSteps(['fraction', 'decimal', 'percent']),
        steps: ['You can move among all three names.', 'Fraction → decimal: divide. Decimal → percent: ×100 (move the point two places).', 'Percent → decimal: ÷100. Decimal → fraction: read the place, then simplify.'],
        trap: 'Moving the point the wrong way: 0.2 as 0.02% or 200%. 0.2 = 20%.',
        aap: 'AAP: ' + fr(3, 8) + ' = 0.375 = 37.5%. Percents can have a decimal in them.',
        tries: [
          () => mc('What percent equals 0.2?', '20%', [['2%', 'Move two places: 0.20 is 20 hundredths.'], ['0.2%', 'That would be 0.002 as a decimal.'], ['200%', 'That is 2.0.']], '0.20 = 20 hundredths = 20%.'),
          () => num('Write 7% as a decimal.', 0.07, '7% = 7 hundredths = 0.07.')
        ]
      },
      'Your turn': {
        viz: () => ixGrid({ start: 0, pct: true, fill: '#0fb39c', challenges: [{ n: 3, d: 5 }, { dec: '0.08' }, { pct: 45 }, { n: 7, d: 10 }, { n: 1, d: 4 }] }),
        steps: ['Pick one name you know.', 'Convert to the other two.', 'Check by converting back.'],
        trap: fr(3, 5) + ' is 60%, not 35% (do not just glue the digits together).',
        aap: 'AAP: 0.08 = 8% = ' + fr(2, 25) + '. 8 hundredths simplify by 4.',
        tries: [
          () => mc('Which equals ' + fr(3, 5) + '?', '60%', [['35%', 'Do not glue the digits 3 and 5.'], ['3.5%', 'That is far too small.'], ['15%', '3 to 5 is not 15%.']], '3/5 = 0.6 = 60%.'),
          () => num('Write 0.08 as a percent (just the number, no % sign).', 8, '0.08 = 8 hundredths = 8%.')
        ]
      }
    },
    u7L3: {
      'Same form, then compare': {
        viz: () => ix('lineLab', { mode: 'drop', chips: ['0.45', '48%', { n: 2, d: 5 }], min: 0.35, max: 0.5, step: 0.01 }),
        steps: ['Rename everything as decimals (or as percents, or as fractions with a common denominator).', 'Then compare: 0.40, 0.45, and 0.48.', 'The largest decimal is the largest amount.'],
        trap: 'Comparing 2/5 and 48% by looking at 2, 5, and 48 as if they were all whole numbers.',
        aap: 'AAP: order ' + fr(2, 3) + ', 70%, and 0.6. 2/3 ≈ 0.667, so 0.6, 70% (0.70), then 2/3.',
        tries: [
          () => mc('Which is greatest: ' + fr(2, 5) + ', 0.45, or 48%?', '48%', [[fr(2, 5), '2/5 = 0.40, less than 0.48.'], ['0.45', '0.45 is less than 0.48.'], ['They are equal', '0.40, 0.45, and 0.48 are different.']], '48% = 0.48 is the largest.'),
          () => mc('Which is least: 0.3, ' + fr(1, 4) + ', or 20%?', '20%', [['0.3', '0.3 = 30%.'], [fr(1, 4), '1/4 = 0.25 = 25%.'], ['They are equal', '20%, 25%, and 30% differ.']], '20% = 0.20, which is less than 0.25 and 0.30.')
        ]
      }
    },
    u7B1: {
      'The whole circle is 100%': {
        viz: () => V.pie([25, 25, 50], ['25%', '25%', '50%']),
        steps: ['Every slice is a part of one whole, so the percents add to 100%.', 'A larger slice means a larger share of the group.', 'If a slice is missing from the labels, you can find it by subtracting from 100%.'],
        trap: 'Reading a slice as a count without knowing the total (50% is not “50 people” unless the whole is 100 people).',
        aap: 'AAP: if art is 40% of 80 students, that is 0.40 × 80 = 32 students, not 40.',
        tries: [
          () => num('Slices are 25% and 25%. What percent is the rest?', 50, '100 − 25 − 25 = 50.'),
          () => mc('A circle graph is the right choice to show', 'how one class’s votes split among three choices', [['how rainfall changed month by month', 'Use a line graph for change over time.'], ['the height of each student', 'That is not parts of one whole.'], ['a single score', 'You need parts that add to 100%.']], 'Circle graphs show parts of one whole.')
        ]
      },
      'From percent to people': {
        watch: { id: 'pctof', p: 25, n: 40, wrong: '25' },
        viz: () => V.hundredGrid(25, { fill: '#ffc43d', label: '25% of 40 students = 10' }),
        steps: ['Change the percent to a decimal: 25% = 0.25.', 'Multiply by the total: 0.25 × 40 = 10.', 'Check: 10 out of 40 is 25%.'],
        trap: 'Using the percent as a count (25% of 40 is not 25 students).',
        aap: 'AAP: 15% of 80 is 12. 12.5% of 80 is 10. Half of 25% is 12.5%.',
        tries: [
          () => num('15% of 80 students is how many students?', 12, '0.15 × 80 = 12.'),
          () => num('50% of 36 is how many?', 18, 'Half of 36 is 18.')
        ]
      }
    },

    /* ---------- Unit 8 ---------- */
    u8L1: {
      'Same-size pieces first': {
        viz: () => V.fractionBar(3, 4, { fill: '#0fb39c', label: '3/4 = 9/12' }),
        steps: ['You can add or subtract fractions only when the pieces are the same size.', 'Find a common denominator (often the LCM).', fr(3, 4) + ' − ' + fr(1, 6) + ': LCM 12, so ' + fr(9, 12) + ' − ' + fr(2, 12) + ' = ' + fr(7, 12) + '.'],
        trap: 'Never add or subtract the denominators (3/4 − 1/6 is not 2/10). The denominator is the size of a piece, not a count to combine.',
        aap: 'AAP: ' + fr(5, 6) + ' + ' + fr(3, 8) + ' uses 24: ' + fr(20, 24) + ' + ' + fr(9, 24) + ' = ' + fr(29, 24) + ' = ' + mixed(1, 5, 24) + '.',
        tries: [
          () => mc('What is ' + fr(3, 4) + ' − ' + fr(1, 6) + '?', fr(7, 12), [[fr(2, 2), 'Do not subtract the denominators.'], [fr(2, 10), 'Do not subtract the denominators.'], [fr(5, 12), '3/4 = 9/12, not 7/12.']], 'LCM 12: 9/12 − 2/12 = 7/12.'),
          () => num('What common denominator works for 4ths and 6ths?', 12, 'The least common multiple of 4 and 6 is 12.')
        ]
      },
      'Your turn': {
        viz: () => V.fractionBar(1, 2, { fill: '#0fb39c', label: '1/2 = 3/6' }),
        steps: ['Rename both fractions.', 'Add or subtract the numerators only.', 'Simplify if you can.'],
        trap: 'Adding numerators and denominators: 1/2 + 1/3 is not 2/5. It is 5/6.',
        aap: 'AAP: 5/6 − 1/4 = 10/12 − 3/12 = 7/12. Estimate first: a little more than 1/2.',
        tries: [
          () => mc('What is ' + fr(1, 2) + ' + ' + fr(1, 3) + '?', fr(5, 6), [[fr(2, 5), 'Do not add the denominators.'], [fr(1, 5), 'Do not add and then keep one denominator.'], [fr(2, 6), '1/2 = 3/6, not 1/6.']], '3/6 + 2/6 = 5/6.'),
          () => num('What common denominator works for halves and thirds?', 6, 'The least common multiple of 2 and 3 is 6.')
        ]
      }
    },
    u8L2: {
      'Wholes with wholes, parts with parts': {
        viz: () => V.fractionBar(3, 4, { fill: '#0fb39c', label: '3/4 + 2/4 = 5/4 = 1 1/4' }),
        steps: ['Add (or subtract) the whole numbers, then the fractions.', 'If the fractions need a common denominator, rename them first.', mixed(2, 3, 4) + ' + ' + mixed(1, 1, 2) + ': wholes 2 + 1 = 3, parts ' + fr(3, 4) + ' + ' + fr(2, 4) + ' = ' + fr(5, 4) + ' = ' + mixed(1, 1, 4) + ', so ' + mixed(4, 1, 4) + '.'],
        trap: 'Adding the whole to the numerator (2 1/2 as 3/2 is right, but 2 1/2 as 21/2 is a place-value slip).',
        aap: 'AAP: convert to improper fractions when it is cleaner: ' + mixed(2, 1, 3) + ' = ' + fr(7, 3) + '.',
        tries: [
          () => mc('What is ' + mixed(2, 3, 4) + ' + ' + mixed(1, 1, 2) + '?', mixed(4, 1, 4), [[mixed(3, 4, 6), 'Do not add the denominators.'], [mixed(3, 1, 4), '5/4 is more than a whole: move 1 whole to the whole pile.'], ['4', 'A little more than 4: 4 and 1/4.']], 'Wholes: 3. Parts: 3/4 + 2/4 = 5/4 = 1 1/4. Total 4 1/4.'),
          () => num('How many fourths are in ' + mixed(2, 3, 4) + '?', 11, mixed(2, 3, 4) + ' = 8/4 + 3/4 = 11/4, so eleven fourths.')
        ]
      },
      'Subtracting with regrouping': {
        viz: () => V.fractionBar(1, 8, { fill: '#0fb39c', label: '1/8 is too small: 5 1/8 = 4 9/8' }),
        steps: ['If the top fraction is too small, regroup one whole as a fraction.', mixed(5, 1, 8) + ' − ' + mixed(2, 5, 8) + ': trade 1 whole for 8/8, so ' + mixed(4, 9, 8) + ' − ' + mixed(2, 5, 8) + ' = ' + mixed(2, 4, 8) + ' = ' + mixed(2, 1, 2) + '.'],
        trap: 'Subtracting the smaller fraction from the larger one regardless of order (3/4 − 1/4 the wrong way).',
        aap: 'AAP: 3 − 1 2/5 = 2 5/5 − 1 2/5 = 1 3/5. A whole number may need a regroup too.',
        tries: [
          () => mc('What is 2 − ' + fr(1, 4) + '?', mixed(1, 3, 4), [[fr(1, 4), 'That is only the part you subtracted.'], ['2', 'You did take a fourth away.'], [mixed(2, 1, 4), 'That would be addition.']], 'Regroup: 1 4/4 − 1/4 = 1 3/4.'),
          () => num('How many fourths are in 1 whole?', 4, '4/4 = 1, so four fourths.')
        ]
      }
    },
    u8L3: {
      'Groups of a fraction': {
        viz: () => V.fractionBar(2, 3, { fill: '#0fb39c', label: '6 groups of 2/3 = 12/3 = 4' }),
        steps: ['6 × ' + fr(2, 3) + ' means six groups of two thirds.', 'A whole times a fraction: multiply the whole by the numerator, keep the denominator.', '6 × ' + fr(2, 3) + ' = ' + fr(12, 3) + ' = 4.'],
        trap: 'Multiplying both the numerator and the denominator by the whole (6 × 2/3 = 12/18) makes the amount smaller, not larger.',
        aap: 'AAP: 10 × 3/5 = 30/5 = 6. A friendly denominator lets the whole cancel.',
        tries: [
          () => mc('What is 6 × ' + fr(2, 3) + '?', '4', [[fr(12, 18), 'Multiply only the numerator by 6.'], [fr(8, 3), 'That added 6 to the numerator.'], ['12', '12/3 is 4, not 12.']], '6 × 2/3 = 12/3 = 4.'),
          () => num('What is 4 × ' + fr(1, 2) + '?', 2, 'Four halves make 2 wholes.')
        ]
      },
      'Your turn': {
        viz: () => V.areaRect(3, 1),
        steps: ['Picture 3 groups of the fraction, or a jump on a number line.', 'Multiply, then rename as a mixed number if it is improper.', 'Check with an estimate: 3 × 2/5 is a little more than 3 × 1/2? No — 2/5 is a little less than 1/2, so a little less than 1 1/2.'],
        trap: 'Estimating 3 × 2/5 as 6 because 3 × 2 = 6, forgetting the fifths.',
        aap: 'AAP: 12 × 3/4 = 9. Think: 12 quarters is 3 wholes, times 3 is 9. Or (12 ÷ 4) × 3.',
        tries: [
          () => num('What is 5 × ' + fr(1, 2) + '?', 2.5, 'Five halves make 2 1/2, or 2.5.'),
          () => mc('What is 6 × ' + fr(2, 3) + '?', '4', [[fr(12, 18), 'Multiply only the numerator by 6, then simplify 12/3 = 4.'], ['12', '6 × 2 = 12, but those are thirds: 12/3 = 4.'], [fr(8, 3), '6 × 2/3 = 12/3 = 4.']], '6 × 2/3 = 12/3 = 4.')
        ]
      }
    },
    u8B1: {
      'Fraction of a fraction': {
        viz: () => V.fractionBar(3, 8, { fill: '#0fb39c', label: '1/2 of 3/4 = 3/8' }),
        steps: ['“Of” means multiply: ' + fr(1, 2) + ' of ' + fr(3, 4) + ' is ' + fr(1, 2) + ' × ' + fr(3, 4) + '.', 'Multiply numerators, then denominators: ' + fr(3, 8) + '.', 'A fraction times a fraction less than 1 is smaller than either factor.'],
        trap: 'Adding instead of multiplying when you see “of,” or adding denominators.',
        aap: 'AAP: 2/3 × 3/5 = 6/15 = 2/5. A common factor (3) can be canceled before you multiply.',
        tries: [
          () => mc('What is ' + fr(1, 2) + ' × ' + fr(3, 4) + '?', fr(3, 8), [[fr(4, 6), 'Do not add.'], [fr(3, 6), 'Multiply 1×3 and 2×4.'], [fr(1, 4), 'That would be 1/2 of 1/2.']], '1/2 × 3/4 = 3/8.'),
          () => num('What is ' + fr(1, 2) + ' of 10?', 5, 'Half of 10 is 5.')
        ]
      },
      'How many fit?': {
        viz: () => V.cycleSteps(['3 ÷ 1/4', 'how many 1/4s', '4 in each whole × 3', '12']),
        steps: ['Dividing by a fraction asks how many of those pieces fit.', '3 ÷ ' + fr(1, 4) + ' = 12, because four fourths fit in each of the 3 wholes.', 'A shortcut: multiply by the reciprocal. 3 ÷ 1/4 = 3 × 4/1 = 12.'],
        trap: '3 ÷ 1/4 is not 3/4 and not 3/5. Dividing by a unit fraction gives a whole number larger than 1.',
        aap: 'AAP: 3/4 ÷ 1/8 = 3/4 × 8/1 = 6. How many eighths fit in 3/4? Six of them.',
        tries: [
          () => num('How many fourths fit in 3 wholes?', 12, '3 ÷ 1/4 = 3 × 4 = 12.'),
          () => num('How many eighths fit in ' + fr(3, 4) + '?', 6, '3/4 ÷ 1/8 = 3/4 × 8 = 6.')
        ]
      }
    },

    /* ---------- Unit 9 ---------- */
    u9L1: {
      'Name the angle': {
        viz: () => (w.IX ? w.IX.angleLab({ modes: ['make', 'target'], start: 50 }) : V.angle(90, { label: '90° right' })),
        steps: ['Acute: less than 90°. Right: exactly 90°. Obtuse: between 90° and 180°. Straight: 180°.', 'A square corner is a right angle. A protractor reads the opening in degrees: line the base up with 0°, then read where the other ray crosses the scale.', 'Use the tick marks: every long tick is 30° or 90°, every short tick is 10°, the tiniest are 5°.'],
        trap: 'Calling every “sharp-looking” angle acute, even when it is a little over 90° (obtuse).',
        aap: 'Stretch: angles on a straight line add to 180°. If one angle is 70°, the one next to it is 110°. See the next cards.',
        tries: [
          () => mc('What kind of angle is 90°?', 'right', [['acute', 'Acute is less than 90°.'], ['obtuse', 'Obtuse is more than 90° and less than 180°.'], ['straight', 'Straight is 180°.']], 'A right angle is exactly 90°.'),
          () => mc('What kind of angle is 130°?', 'obtuse', [['acute', '130° is greater than 90°.'], ['right', 'Right is exactly 90°.'], ['straight', 'Straight is 180°.']], '130° is between 90° and 180°.')
        ]
      },
      'Classify triangles two ways': {
        viz: () => (w.IX ? w.IX.triangleLab() : V.angle(60, { label: '60°' })),
        steps: ['By sides: equilateral (3 equal), isosceles (at least 2 equal), scalene (no equal sides).', 'By angles: acute, right, or obtuse (named for the largest angle).', 'A triangle can be both isosceles and acute, for example. The three angles always add to 180°.'],
        trap: 'Thinking isosceles cannot be equilateral. Equilateral is a special isosceles: all three sides equal.',
        aap: 'Stretch: a 7-7-7 triangle is equilateral, isosceles, and acute (all angles 60°). Select every name that fits.',
        tries: [
          () => ms('A triangle has sides 7, 7, and 7. Select all names that fit.', ['equilateral', 'isosceles', 'scalene', 'acute', 'right'], [0, 1, 3], 'Three equal sides: equilateral and isosceles. All angles are 60°, so acute.'),
          () => mc('A triangle has a 90° angle. What kind is it (by angles)?', 'right', [['acute', 'A 90° angle is not acute.'], ['obtuse', 'Obtuse would be greater than 90°.'], ['equilateral', 'That is a side name, and 90° cannot appear in an equilateral triangle.']], 'One 90° angle makes it a right triangle.')
        ]
      },
      'Angle pairs (a grade up)': {
        viz: () => (w.IX ? w.IX.angleLab({ modes: ['pair'], mode: 'pair', start: 65 }) : V.angle(65, { label: '65°' })),
        steps: ['Two angles that fill a <b>straight line</b> add to 180° (supplementary). If one is 65°, the other is 180 − 65 = 115°.', 'Two angles that fill a <b>square corner</b> add to 90° (complementary). If one is 35°, the other is 90 − 35 = 55°.', 'When two straight lines cross, the angles directly across from each other (vertical angles) are equal, and neighbors add to 180°.'],
        trap: 'Mixing up the two totals. Corner = 90° = complementary. Straight line = 180° = supplementary. (C comes before S, and 90 comes before 180.)',
        aap: 'Stretch: algebra with angles. Two supplementary angles are x and 2x. Then x + 2x = 180, so x = 60° and 2x = 120°.',
        tries: [
          () => num('Two angles make a straight line. One is 65°. How many degrees is the other?', 115, '180 − 65 = 115°.'),
          () => mc('Two angles make a square corner. One is 35°. What is the other?', '55°', [['145°', 'That uses 180°. A square corner is 90°.'], ['65°', '90 − 35 = 55, not 65.'], ['35°', 'They would be equal only if each were 45°.']], '90 − 35 = 55°.'),
          () => num('Two straight lines cross. One angle is 40°. How many degrees is the angle directly across from it?', 40, 'Vertical angles (across from each other) are equal.')
        ]
      }
    },
    u9L2: {
      'Half a rectangle': {
        viz: () => GV.triHalf(12, 7, 'm'),
        steps: ['A right triangle is half of a rectangle (or half of a square).', 'Area = ' + fr(1, 2) + ' × base × height.', 'For legs 12 m and 7 m: ' + fr(1, 2) + ' × 12 × 7 = 42 m².'],
        trap: 'Forgetting the 1/2 and reporting 84, which is the rectangle, not the triangle.',
        aap: 'AAP: the 1/2 works for any triangle if the height is perpendicular to the base, not only for right triangles.',
        tries: [
          () => num('A right triangle has legs 12 m and 7 m. What is its area in square meters?', 42, '1/2 × 12 × 7 = 42.'),
          () => num('A right triangle has legs 8 cm and 5 cm. What is its area in square centimeters?', 20, '1/2 × 8 × 5 = 20.')
        ]
      },
      'Your turn': {
        viz: () => GV.triHalf(6, 9, 'cm'),
        steps: ['Identify the two legs (the sides that meet at the right angle).', 'They are the base and the height.', 'Multiply, then take half.'],
        trap: 'Using a slanted side as the height. The height must be perpendicular to the base.',
        aap: 'AAP: a triangle with base 9 and height 4 has area 18, even if it is not a right triangle.',
        tries: [
          () => num('A right triangle has legs 10 cm and 6 cm. What is its area in square centimeters?', 30, '1/2 × 10 × 6 = 30.'),
          () => num('A triangle has base 9 and height 4. What is its area?', 18, '1/2 × 9 × 4 = 18.')
        ]
      }
    },
    u9L3: {
      'Layers of cubes': {
        viz: () => GV.prism(4, 3, 2, { hl: 'top', note: '2 layers of 4 × 3 = 12 cubes → 24' }),
        steps: ['Volume of a rectangular prism is length × width × height, or base area × height.', 'A 4 by 3 by 2 box: base 4 × 3 = 12 square units, times 2 = 24 cubic units.', 'You can picture 2 layers of 12 cubes.'],
        trap: 'Adding the three edges (4+3+2=9) or finding only the surface. Volume is a fill, in cubic units.',
        aap: 'AAP: if one edge doubles, the volume doubles. If all three edges double, the volume is 8 times as big.',
        tries: [
          () => num('A box is 4 cm by 3 cm by 2 cm. What is the volume in cubic centimeters?', 24, '4 × 3 × 2 = 24.'),
          () => num('The base of a box is 10 cm² and the height is 3 cm. What is the volume in cubic centimeters?', 30, 'Base area × height: 10 × 3 = 30.')
        ]
      },
      'Perimeter, area or volume?': {
        viz: () => GV.pav(),
        steps: ['Perimeter is the distance around (units).', 'Area is the space on a face (square units).', 'Volume is the space inside (cubic units).'],
        trap: 'Reporting a volume with cm², or an area with cm. The unit tells you which measure you found.',
        aap: 'AAP: a 6-by-4-by-5 box has volume 120 cm³ and a base area of 24 cm². The perimeter of the base is 20 cm — three different measures.',
        tries: [
          () => mc('The space inside a box is its', 'volume', [['perimeter', 'Perimeter is the distance around a face.'], ['area', 'Area is the space on a face.'], ['height', 'Height is one edge, not the fill.']], 'Volume is the fill, in cubic units.'),
          () => mc('cm² is a unit of', 'area', [['volume', 'Volume uses cubic units (cm³).'], ['length', 'Length uses cm, not cm².'], ['mass', 'Mass uses grams.']], 'A square unit measures area.')
        ]
      }
    },
    u9B1: {
      'Parts of a circle': {
        viz: () => GV.circle(5),
        steps: ['Radius is from the center to the edge. Diameter is all the way across (2 × radius).', 'Circumference is the distance around: C = π × diameter, or 2 × π × radius.', 'π is a little more than 3, or about 3.14.'],
        trap: 'Using the radius in C = πd (or the diameter in 2πr) without converting. Diameter is twice the radius.',
        aap: 'AAP: a circle with radius 5 has diameter 10 and circumference about 31.4. Area (πr²) is a later AAP extension: about 78.5.',
        tries: [
          () => num('A circle has radius 6 cm. What is the diameter in centimeters?', 12, 'Diameter is twice the radius: 2 × 6 = 12.'),
          () => mc('If the diameter is 10, the circumference is about', '31.4', [['13', 'That is near 10 + 3, not π × 10.'], ['20', 'That is 2 × 10, missing π.'], ['100', 'That would be 10 × 10.']], 'C = π × 10 ≈ 3.14 × 10 = 31.4.')
        ]
      },
      'Parallelogram = rectangle in disguise': {
        viz: () => GV.paraRect(8, 5, 3),
        steps: ['A parallelogram has the same area as a rectangle with the same base and height.', 'Area = base × height, where the height is perpendicular to the base.', 'A slanted side is not the height unless it is already perpendicular.'],
        trap: 'Multiplying the two side lengths (the slanted side and the base) instead of base × height.',
        aap: 'AAP: if a parallelogram has base 9 and area 36, the height is 4. Area ÷ base = height.',
        tries: [
          () => num('A parallelogram has base 8 cm and height 5 cm. What is its area in square centimeters?', 40, 'Base × height: 8 × 5 = 40.'),
          () => num('A parallelogram has area 36 and base 9. What is the height?', 4, 'Area ÷ base: 36 ÷ 9 = 4.')
        ]
      }
    },

    /* ---------- Unit 10 ---------- */
    u10L1: {
      'Even it out': {
        viz: () => V.barGraph(['3', '7', '5', '9'], [3, 7, 5, 9], { title: 'Share equally → mean 6', color: '#2f80ed' }),
        steps: ['The mean is a fair share: dump everything into one pile, then split equally.', 'Add, then divide by how many values.', '3, 7, 5, 9: total 24, mean 24 ÷ 4 = 6.'],
        trap: 'Dividing by the wrong count (forgetting one value, or dividing by the greatest value).',
        aap: 'AAP: if the mean of four numbers is 9, the total is 36. A missing number is 36 minus the other three.',
        tries: [
          () => num('What is the mean of 4, 6, and 8?', 6, '4 + 6 + 8 = 18, and 18 ÷ 3 = 6.'),
          () => num('Four numbers have a mean of 6. What is their total?', 24, 'Mean × how many: 6 × 4 = 24.')
        ]
      },
      'Median, mode, range': {
        viz: () => V.linePlot([1, 2, 2, 4, 7], { title: 'Order first' }),
        steps: ['Order the data before you find the median.', 'Mode is the most frequent value. Range is greatest minus least.', 'If two values are tied for most frequent, the set can have two modes — or you can say there is no single mode, depending on the problem’s wording.'],
        trap: 'The median of an unordered list (picking the middle position before sorting).',
        aap: 'AAP: for 1, 2, 4, 7 the median is (2+4)÷2 = 3. Even counts need the mean of the two middle numbers.',
        tries: [
          () => num('What is the median of 1, 2, 2, 4, 7?', 2, 'The middle of the ordered list is 2.'),
          () => num('What is the mode of 1, 2, 2, 4, 7?', 2, '2 appears most often.')
        ]
      }
    },
    u10L2: {
      'Stem-and-leaf plots': {
        viz: () => V.stemLeaf([21, 24, 24, 28, 30, 35, 42], { title: 'Scores', key: 'Key: 2 | 1 means 21' }),
        steps: ['The stem is the tens. The leaves are the ones, written in order.', 'A key is required: “2 | 1 means 21.”', 'You can still find mean, median, mode, and range from the plot.'],
        trap: 'Reading 2 | 1 4 as 2.14 or as 214. Each leaf is a ones digit on that stem.',
        aap: 'AAP: from the plot, the median is the middle leaf when all leaves are listed in order across the rows.',
        tries: [
          () => num('In 2 | 1 4 4 8 with key “2 | 1 means 21,” how many values are in that row?', 4, 'Four leaves: 21, 24, 24, and 28.'),
          () => mc('What is the range of 21, 24, 24, 28, 30, 35, 42?', '21', [['2', 'That is a stem, not the range.'], ['42', 'Range is greatest minus least.'], ['20', '42 − 21 = 21.']], '42 − 21 = 21.')
        ]
      },
      'Your turn': {
        viz: () => V.linePlot([12, 15, 15, 19, 20, 23, 23, 23, 31], { title: 'The same data on a line plot' }),
        steps: ['A line plot and a stem-and-leaf plot can show the same set.', 'Use the plot to count, to find the cluster, and to find the range.', 'Titles and labels still matter.'],
        trap: 'Counting the tick marks on the number line instead of the dots.',
        aap: 'AAP: if an outlier 60 is added to this data, the range jumps from 19 to 48 and the mean rises more than the median.',
        tries: [
          () => num('On the line plot above, how many dots are above 23?', 3, 'Three values are 23.'),
          () => num('What is the range of 12, 15, 15, 19, 20, 23, 23, 23, 31?', 19, '31 − 12 = 19.')
        ]
      }
    },
    u10L3: {
      'Tree diagrams': {
        viz: () => V.cycleSteps(['coin: H or T', '× spinner: red, blue, green', '2 × 3 = 6 outcomes']),
        steps: ['A tree (or the counting principle) lists every path.', 'A coin has 2 results and the spinner has 3 colors, so there are 2 × 3 = 6 outcomes.', 'Multiply the number of choices at each step.'],
        trap: 'Adding the choices (2 + 3 = 5 outcomes) instead of multiplying.',
        aap: 'AAP: 3 shirts, 2 pants, 2 hats: 3 × 2 × 2 = 12 outfits. Each new independent choice multiplies the total.',
        tries: [
          () => num('Flip a coin and spin a 3-color spinner: how many outcomes?', 6, '2 × 3 = 6.'),
          () => mc('For 4 flavors and 3 toppings, how many sundaes?', '12', [['7', 'That adds 4 + 3.'], ['4', 'That counts only flavors.'], ['3', 'That counts only toppings.']], '4 × 3 = 12.')
        ]
      },
      'Probability is a fraction': {
        viz: () => V.fractionBar(3, 8, { fill: '#0fb39c', label: '3 red out of 8 parts' }),
        steps: ['P(event) = (favorable outcomes) ÷ (total equally likely outcomes).', '3 red out of 8 equal parts: P(red) = ' + fr(3, 8) + '.', 'Probability 0 never happens; 1 always happens.'],
        trap: 'Using the unfavorable count in the denominator, or writing 3 without the 8.',
        aap: 'AAP: P(not red) = 1 − 3/8 = 5/8. Complementary events add to 1.',
        tries: [
          () => mc('A spinner has 3 red parts out of 8 equal parts. P(red) is', fr(3, 8), [[fr(3, 5), 'The total is 8, not the 5 non-red parts alone as a denominator with 3? 3/5 would ignore the total.'], ['3', 'A probability names a part of the total, not just the count.'], [fr(8, 3), 'That is upside down.']], 'Favorable over total: 3/8.'),
          () => num('A fair coin: how many equally likely outcomes are there?', 2, 'Heads or tails — two outcomes. P(heads) = 1/2.')
        ]
      }
    },
    u10B1: {
      'The mean balances the data': {
        viz: () => V.numberLine(0, 10, [{ pos: 2, label: '2' }, { pos: 4, label: '4' }, { pos: 6, label: 'mean 6' }, { pos: 8, label: '8' }, { pos: 10, label: '10' }]),
        steps: ['Think of the mean as a balance point on a number line.', 'Values below the mean and values above it “balance.”', '2 and 10 balance around 6 (each is 4 away), and so do 4 and 8 (each is 2 away).'],
        trap: 'Moving one point and expecting the mean to stay put. The balance point shifts toward the move.',
        aap: 'AAP: if 2, 5, 8 has mean 5, changing 8 to 14 shifts the mean to 7. The total rose by 6, and 6 ÷ 3 = 2.',
        tries: [
          () => num('What is the mean of 2, 4, 6, 8, and 10?', 6, '2 + 4 + 6 + 8 + 10 = 30, and 30 ÷ 5 = 6. It is also the balance point.'),
          () => mc('If one value rises and the others stay, the mean', 'rises a little', [['stays the same', 'The total changed, so the mean changes.'], ['becomes that new value', 'The other values still count.'], ['always doubles', 'It shifts by (the change) ÷ (how many values).']], 'The mean moves toward the value that changed, by a fraction of the change.')
        ]
      },
      'Outliers': {
        viz: () => V.linePlot([2, 3, 3, 4, 4, 5, 20], { title: 'One far-away point' }),
        steps: ['An outlier sits far from the cluster.', 'It pulls the mean more than the median.', 'Always ask whether the outlier is a real value or a recording mistake.'],
        trap: 'Dropping an outlier without a reason, or letting one typo (a 20 instead of a 2.0) secretly run the mean.',
        aap: 'AAP: for 2, 3, 3, 4, 4, 5, 20 the median is still 4, but the mean is 41 ÷ 7 ≈ 5.9. Report both and mention the 20.',
        tries: [
          () => mc('An outlier pulls which measure the most?', 'the mean', [['the median', 'The median stays near the cluster.'], ['the mode', 'The mode is the most frequent cluster value.'], ['the title', 'The title does not change.']], 'A far-away point changes the total, so it moves the mean.'),
          () => num('For 2, 3, 3, 4, 20, what is the median?', 3, 'Ordered, the middle value is 3. The 20 does not move the median much.')
        ]
      }
    },

    /* ---------- Unit 11 ---------- */
    u11L1: {
      'Across, then up': {
        viz: () => (w.IX && IX.coordPlane) ? IX.coordPlane({ n: 8, start: { x: 3, y: 2 }, tip: 'Tap any crossing point. The path shows across first, then up.' }) : V.plane([{ x: 3, y: 2, label: '(3, 2)', guide: true }], { n: 8 }),
        steps: ['A point is an ordered pair (x, y).', 'x is across (horizontal). y is up (vertical).', 'From the origin (0, 0), go 3 right, then 2 up to plot (3, 2).'],
        trap: 'Plotting (3, 2) as 3 up and 2 across — swapping the coordinates.',
        aap: 'AAP: the points (2, 5) and (5, 2) are different. Order in the pair matters just as it does in a ratio.',
        tries: [
          () => mc('To plot (4, 1), you go', '4 right, then 1 up', [['1 right, then 4 up', 'That would be (1, 4).'], ['4 up, then 1 right', 'Across first: x, then y.'], ['4 right and 4 up', 'The y-coordinate is 1.']], 'x first (across), then y (up).'),
          () => num('In the point (7, 2), what is the x-coordinate?', 7, 'The first number is x, the across value.')
        ]
      },
      'Your turn': {
        viz: () => (w.IX && IX.coordPlane) ? IX.coordPlane({ n: 8, challenges: [[2, 5], [5, 2], [4, 0], [0, 6], [7, 3]], tip: 'Plot each point. Across first, then up.' }) : V.plane([{ x: 2, y: 5, label: '(2, 5)' }, { x: 5, y: 2, label: '(5, 2)' }], { n: 8 }),
        steps: ['Read x, then y.', 'Mark a small dot and label the pair.', 'Check by reading back from the axes, not from memory.'],
        trap: 'Starting from 1 instead of from the origin, or counting the grid lines instead of the spaces.',
        aap: 'AAP: (0, 4) sits on the y-axis. (5, 0) sits on the x-axis. A 0 in one coordinate lands on an axis.',
        tries: [
          () => mc('The point (0, 5) sits on the', 'y-axis', [['x-axis', 'x = 0 is the y-axis. (5, 0) is on the x-axis.'], ['origin', 'The origin is (0, 0).'], ['line y = x', 'That would be (5, 5).']], 'When x is 0, the point is on the y-axis.'),
          () => num('In (5, 0), what is the y-coordinate?', 0, 'The second number is y. This point sits on the x-axis.')
        ]
      }
    },
    u11L2: {
      'Patterns make lines': {
        viz: () => V.plane([{ x: 1, y: 3, label: '(1, 3)' }, { x: 2, y: 6, label: '(2, 6)' }, { x: 3, y: 9, label: '(3, 9)' }], { n: 10 }),
        steps: ['A table of (x, y) pairs can follow a rule. Saving $3 a week gives (week, dollars) pairs that follow y = 3x.', '(1, 3), (2, 6), (3, 9) sit on a straight line.', 'The graph of a constant rate is a line through those points.'],
        trap: 'Plotting the points and then connecting them in the order of the table when a point was mistyped — check that they follow the rule first.',
        aap: 'AAP: if y = 3x + 1, the points are (1, 4), (2, 7), (3, 10). The “+1” shifts every y-value up by 1.',
        tries: [
          () => num('Save $3 each week. How many dollars after week 4?', 12, '3 × 4 = 12. The point is (4, 12).'),
          () => mc('The points (1, 3), (2, 6), (3, 9) follow which rule?', 'y = 3x', [['y = x + 2', 'That works for (1, 3) but gives (2, 4), not (2, 6).'], ['y = x', 'That would give (1, 1).'], ['x = 3y', 'That would swap the roles.']], 'Each y is 3 times x.')
        ]
      }
    },
    u11B1: {
      'Negatives go left and down': {
        viz: () => V.plane([{ x: -3, y: 2, label: '(−3, 2)' }, { x: 3, y: -2, label: '(3, −2)' }], { quad: true, n: 6 }),
        steps: ['Negative x is to the left of the origin. Negative y is down.', 'The four quadrants: I (+,+), II (−,+), III (−,−), IV (+,−).', '(−3, 2) is left 3 and up 2, in Quadrant II.'],
        trap: 'Moving left for a negative y, or down for a negative x. x is still across; y is still the vertical direction.',
        aap: 'AAP: the point (−4, −1) is Quadrant III. Signs tell the quadrant before you even plot.',
        tries: [
          () => mc('Where is the point (−3, 2)?', 'left 3, up 2', [['right 3, up 2', 'Negative x is left.'], ['left 3, down 2', 'The y-coordinate is positive.'], ['left 2, up 3', 'Do not swap x and y.']], 'x = −3 (left), y = 2 (up).'),
          () => mc('Which quadrant is (3, −2) in?', 'IV', [['I', 'Quadrant I is (+, +).'], ['II', 'Quadrant II is (−, +).'], ['III', 'Quadrant III is (−, −).']], 'Positive x and negative y: Quadrant IV.')
        ]
      },
      'Your turn': {
        viz: () => (w.IX && IX.coordPlane) ? IX.coordPlane({ quad: true, n: 6, challenges: [[-2, -3], [-4, 2], [3, -5], [5, 4]], tip: 'Negative x goes left. Negative y goes down.' }) : V.plane([{ x: -2, y: -3, label: '(−2, −3)' }], { quad: true, n: 6 }),
        steps: ['Start at the origin.', 'Move x first (right or left), then y (up or down).', 'Name the quadrant from the signs.'],
        trap: 'Plotting both negatives as down-and-right, which would be a Quadrant IV habit from only practicing ( +, − ).',
        aap: 'AAP: reflections: (3, 2) reflected over the y-axis is (−3, 2). Over the x-axis it is (3, −2).',
        tries: [
          () => mc('The point (−2, −3) is in Quadrant', 'III', [['I', 'Quadrant I is (+, +).'], ['II', 'Quadrant II is (−, +).'], ['IV', 'Quadrant IV is (+, −).']], 'Both coordinates are negative: Quadrant III.'),
          () => mc('(3, 2) reflected over the y-axis is', '(−3, 2)', [['(3, −2)', 'That is a reflection over the x-axis.'], ['(−3, −2)', 'That would flip both signs.'], ['(2, 3)', 'That swaps the coordinates.']], 'Over the y-axis, x changes sign: (−3, 2).')
        ]
      }
    }

  };

  /* Unit 9 teaches every shape in one path: circles and parallelograms moved out of u9B1. */
  pack.u9L5 = pack.u9B1;
  pack.u9L2['Parallelogram = rectangle in disguise'] = pack.u9B1['Parallelogram = rectangle in disguise'];

  w.G5Learn = {
    forCard: function (lesson, card) {
      const id = (lesson && lesson.id) || '';
      const t = (card && card.t) || '';
      return (pack[id] && pack[id][t]) || null;
    },
    /* filled below for units 4–11 */
    _pack: pack
  };
})(window);
