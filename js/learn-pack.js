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
        steps: ['To find “how many scored 4,” count the dots above 4.', 'To find “how many in all,” count every dot.', 'The range is the greatest value minus the least.'],
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
        viz: () => V.hundredGrid(35, { fill: '#ffc43d', label: '35% of the grid' }),
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
        viz: () => V.numberLine(0, 12, [{ pos: 1, label: 'neither' }, { pos: 7, label: 'prime' }, { pos: 9, label: 'composite' }]),
        steps: ['A prime has exactly two factors: 1 and itself (7: 1 and 7).', 'A composite has more than two factors (9: 1, 3, 9).', 'The number 1 is neither prime nor composite.'],
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
        viz: () => V.numberLine(0, 28, [{ pos: 3, label: '1st' }, { pos: 7, label: '2nd' }, { pos: 11, label: '3rd' }, { pos: 27, label: '7th' }]),
        steps: ['3, 7, 11, 15, … Check every jump: each adds 4.', 'The nth term is start + jump × (n − 1).', 'The 7th term is 3 + 4 × 6 = 27.'],
        trap: 'Do not check only the first jump. A rule has to work on every step.',
        aap: 'AAP: a geometric pattern 2, 6, 18, 54, … multiplies by 3. The 6th term is 2 × 3⁵ = 486.',
        tries: [
          () => num('The pattern 5, 12, 19, 26, … continues. What is the 6th term?', 40, '+7 each time: 5 + 7 × 5 = 40.'),
          () => mc('What is the rule for 3, 6, 12, 24, …?', '× 3', [['+ 3', 'The jumps get bigger: +3, +6, +12.'], ['+ 6', 'That only fits one jump.'], ['× 2 then + 0', 'Each term is three times the one before.']], 'Each term multiplies the one before by 3.')
        ]
      },
      'Missing input': {
        viz: () => V.barGraph(['In 2', 'In 5', 'In ?'], [8, 20, 36], { title: 'Output of a × 4 machine', color: '#0fb39c' }),
        steps: ['The outputs 8, 20, 36 came from a × 4 rule.', 'To find a missing input, undo the rule.', '36 ÷ 4 = 9.'],
        trap: 'If the input is missing, do not apply the rule forward to the output (36 × 4). Undo it.',
        aap: 'AAP: a machine does × 3, then + 1. If the output is 16, undo: 16 − 1 = 15, 15 ÷ 3 = 5.',
        tries: [
          () => num('A machine multiplies by 4. The output is 36. What was the input?', 9, 'Undo the rule: 36 ÷ 4 = 9.'),
          () => num('A machine adds 7. The output is 20. What was the input?', 13, 'Undo: 20 − 7 = 13.')
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
        viz: () => V.barGraph(['Start n', 'Plus 15', 'Total 42'], [27, 15, 42], { title: 'Pages read', color: '#2f80ed' }),
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
        viz: () => V.cycleSteps(['12: 1,2,3,4,6,12', '18: 1,2,3,6,9,18', 'GCF 6']),
        steps: ['List the factors of each number.', 'Circle the factors they share.', 'The greatest one is the GCF.'],
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
        viz: () => V.numberLine(-2, 8, [{ pos: 3, label: '3' }, { pos: 4, label: '4' }, { pos: 5, label: '5…' }]),
        steps: ['An inequality like n > 3 has many solutions: 4, 5, 6, …', 'On a number line, an open circle means the endpoint is not included.', 'A closed circle means it is included (≥ or ≤).'],
        trap: 'For n > 3, 3 itself is not a solution. The inequality is strict.',
        aap: 'AAP: integers that satisfy −2 < n ≤ 1 are −1, 0, and 1. List them all.',
        tries: [
          () => ms('Select all integer solutions of n > 3 from this list.', ['3', '4', '5', '2'], [1, 2], '4 and 5 are greater than 3. 3 is not, and 2 is not.'),
          () => mc('Which describes n ≥ 2?', '2 is included, and every number to the right', [['2 is not included', '≥ means “or equal.”'], ['Only 2', 'Every greater number is also a solution.'], ['Only numbers less than 2', 'The arrow goes to the right.']], '≥ includes the endpoint and everything larger.')
        ]
      },
      'Test the values': {
        viz: () => V.numberLine(-4, 6, [{ pos: 0, label: '0' }, { pos: 2, label: '2?' }]),
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
        viz: () => V.placeValue('4785'),
        steps: ['Round each number to something easy.', 'Compute the estimate first: 4800 ÷ 60 = 80.', 'After the exact answer, check: is it close to 80?'],
        trap: 'An estimate that is 10 times too big or too small usually means a place-value slip, not a rounding slip.',
        aap: 'AAP: estimate 39 × 21 two ways (40 × 20 = 800, and 40 × 21 = 840) and say which is closer before you multiply exactly.',
        tries: [
          () => mc('Best estimate for 4785 ÷ 61?', '80', [['8', '4800 ÷ 60 is about 80, not 8.'], ['800', 'That is ten times too big.'], ['50', '61 is near 60, and 4785 is near 4800.']], 'Compatible numbers: 4800 ÷ 60 = 80.'),
          () => mc('Best estimate for 19 × 31?', '600', [['50', 'That is near 19 + 31.'], ['190', '31 is about 30, not 10.'], ['6000', '19 × 31 is near 20 × 30 = 600.']], '20 × 30 = 600.')
        ]
      },
      'Compatible numbers for division': {
        viz: () => V.cycleSteps(['4785 ≈ 4800', '61 ≈ 60', '4800 ÷ 60 = 80']),
        steps: ['Look for nearby numbers that divide cleanly.', '4785 is near 4800, 61 is near 60.', '4800 ÷ 60 = 80. Use that as a check on every digit of the quotient.'],
        trap: 'Rounding both numbers up (or both down) can push the estimate the same way. Watch the size.',
        aap: 'AAP: 8124 ÷ 28. Compatible: 8400 ÷ 28 = 300, or 8100 ÷ 27 = 300. The exact quotient should be near 300.',
        tries: [
          () => num('Use compatible numbers: about how many is 3600 ÷ 59? Enter your estimate.', 60, '3600 ÷ 60 = 60. Any close estimate (around 60) is the idea; 60 is the compatible-number value.'),
          () => mc('Which pair is most compatible for 247 ÷ 5?', '250 ÷ 5', [['200 ÷ 10', 'The divisor changed too much.'], ['247 ÷ 1', 'That ignores the 5.'], ['300 ÷ 50', 'Both numbers jumped too far.']], '250 ÷ 5 = 50, and 247 is right next to 250.')
        ]
      }
    },
    u3L2: {
      'Partial products': {
        viz: () => V.areaRect(23, 15, { unit: '' }),
        steps: ['Think of 23 × 15 as an area: (20 + 3) × (10 + 5).', 'Four partial products: 20×10, 20×5, 3×10, 3×5.', 'Add them: 200 + 100 + 30 + 15 = 345.'],
        trap: 'A missing place-value zero on a partial-product row (writing 20 × 5 as 10) throws the sum off by a factor of 10.',
        aap: 'AAP: 123 × 45 has six partial products if you split all place values. Estimate first: 120 × 50 = 6,000.',
        tries: [
          () => num('What is 12 × 15? Use partial products if you want.', 180, '10×15 = 150, 2×15 = 30, total 180.'),
          () => mc('In 23 × 15, what is the partial product 20 × 10?', '200', [['20', 'Keep the place value: 20 tens is 200.'], ['23', 'That is a factor, not the partial product.'], ['30', 'That is 3 × 10.']], '20 × 10 = 200.')
        ]
      },
      'Try one': {
        viz: () => V.areaRect(14, 12),
        steps: ['Estimate: 14 × 12 is near 10 × 12 = 120, or 15 × 12 = 180.', 'Partial products: 10×12 + 4×12 = 120 + 48 = 168.', 'Check: 14 × 10 + 14 × 2 = 140 + 28 = 168.'],
        trap: 'Adding the factors (14 + 12 = 26) is not multiplication.',
        aap: 'AAP: 36 × 25. Use ×100 ÷ 4: 36 × 100 = 3,600, then 3,600 ÷ 4 = 900.',
        tries: [
          () => num('What is 14 × 12?', 168, '14 × 10 = 140, 14 × 2 = 28, total 168.'),
          () => num('What is 15 × 11?', 165, '15 × 10 = 150, 15 × 1 = 15, total 165.')
        ]
      }
    },
    u3L3: {
      'Estimate each digit of the quotient': {
        viz: () => V.cycleSteps(['How many 23s', 'in 156?', 'Try 6']),
        steps: ['Look at the first digits of the dividend and the divisor.', 'Ask: how many 23s fit in 156? About 6, because 23 × 6 = 138.', 'Write that digit, subtract, and bring down the next digit.'],
        trap: 'A too-big estimate (7 × 23 = 161, which is larger than 156) means you drop the digit by 1 and try again.',
        aap: 'AAP: 748 ÷ 32. 32 × 20 = 640, 32 × 23 = 736, so the quotient is 23 with a small remainder.',
        tries: [
          () => mc('In 156 ÷ 23, what is the best first-digit try?', '6, because 23 × 6 = 138', [['9, because 23 is near 20', '23 × 9 = 207, which is too big.'], ['2, because 2 × 23 = 46', 'That is far too small for 156.'], ['23', 'The quotient digit is not the divisor.']], '23 × 6 = 138, which fits; 23 × 7 = 161, which does not.'),
          () => num('How many 15s fit in 90?', 6, '15 × 6 = 90.')
        ]
      },
      'Try one': {
        viz: () => V.cycleSteps(['Divide', 'Multiply', 'Subtract', 'Bring down']),
        steps: ['Use the same four steps in every column.', 'If a 0 appears in the quotient, still bring the next digit down.', 'Check by multiplying the quotient by the divisor and adding any remainder.'],
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
        viz: () => V.cycleSteps(['2 × 2 × 2', '2³', '8']),
        steps: ['An exponent counts how many times the base is a factor: 2³ = 2 × 2 × 2 = 8.', 'The base is the number being multiplied.', 'The exponent is the small number up high, not a times-table partner.'],
        trap: '2³ is not 2 × 3 = 6. It is three factors of 2.',
        aap: 'Stretch: 10⁴ = 10000 (four zeros). 2⁵ = 32. Powers of 10 and of 2 are worth knowing cold.',
        tries: [
          () => num('What is 2 to the 4th power (2⁴)?', 16, '2 × 2 × 2 × 2 = 16.'),
          () => mc('What is 5³?', '125', [['15', 'That is 5 × 3.'], ['8', 'That would be 2³.'], ['53', 'The 3 is an exponent, not a tens digit.']], '5 × 5 × 5 = 125.')
        ]
      },
      'Perfect squares': {
        viz: () => V.areaRect(6, 6),
        steps: ['A perfect square is a whole number times itself: 6 × 6 = 36.', 'You can picture it as a square array.', 'Learn the squares through 12 × 12 (144) and 15 × 15 (225).'],
        trap: '8² is 64, not 16. Square means the number times itself, not twice the number.',
        aap: 'Stretch: 11² = 121 and 12² = 144. Learn 15² = 225 and 25² = 625 too.',
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
      'Powers grow fast': {
        viz: () => V.cycleSteps(['2⁴ = 16', '2⁵ = 32', '2⁶ = 64']),
        steps: ['Each time the exponent goes up by 1, the value is multiplied by the base again.', '2⁴ = 16, 2⁵ = 32, 2⁶ = 64, 2⁷ = 128, 2⁸ = 256.', 'Swapping base and exponent changes the value: 3⁵ = 243 but 5³ = 125.'],
        trap: 'Thinking a power is just a product: 3⁵ is not 15.',
        tries: [
          () => num('What is 2⁸?', 256, '2 × 2 = 4, 8, 16, 32, 64, 128, 256.'),
          () => num('What is 2³ + 3²?', 17, '2³ = 8 and 3² = 9. 8 + 9 = 17.')
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
        steps: ['Write the fraction with a denominator of 100 when you can.', '75 hundredths is 0.75 and also ' + fr(3, 4) + '.', 'Check by simplifying or by multiplying back.'],
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
        viz: () => ixBar({ d: 3, n: 1, dens: [3, 6, 9, 2, 4], fill: '#ff5a36', tip: 'Thirds, sixths and ninths repeat. Halves and fourths stop.' }),
        steps: [fr(1, 3) + ' = 0.333… (the 3s keep going).', fr(2, 3) + ' = 0.666…', 'A bar over the repeating digit is a precise way to write it.'],
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
        viz: () => V.numberLine(0, 1, [{ pos: 0.5, label: '1/2 = 2/4 = 0.5' }]),
        steps: ['The same point can be ' + fr(1, 2) + ', ' + fr(2, 4) + ', ' + fr(3, 6) + ', and 0.5.', 'Multiply or divide the numerator and denominator by the same number.', 'Select every name that sits on that same point.'],
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
        viz: () => V.barGraph(['Juice', 'Water'], [2, 5], { title: '2 to 5 mix', color: '#0fb39c' }),
        steps: ['A ratio 2 : 5 compares two amounts in order.', 'It can also be written 2 to 5 or ' + fr(2, 5) + '.', 'Order matters: 2 : 5 is not 5 : 2.'],
        trap: 'Flipping the order changes the comparison. 3 : 5 is not the same as 5 : 3.',
        aap: 'AAP: a ratio can compare part to part or part to whole. 2 : 5 juice to water is not 2 : 7 unless you mean juice to the total mix.',
        tries: [
          () => mc('Which ratio matches 3 cups red to 5 cups blue?', '3 : 5', [['5 : 3', 'The order is red first, then blue.'], ['3 : 8', 'That would be red to the total.'], ['8 : 3', 'That adds the parts in the wrong order.']], 'Write the amounts in the same order as the words: 3 : 5.'),
          () => num('In the ratio 2 : 5, how many parts are in the second amount?', 5, 'The second number in 2 : 5 is 5.')
        ]
      },
      'Equivalent ratios scale together': {
        viz: () => V.barGraph(['2:5', '4:10', '6:15'], [2, 4, 6], { title: 'Both parts × 2, then × 3', color: '#0fb39c' }),
        steps: ['2 : 5, 4 : 10, and 6 : 15 are equivalent.', 'Multiply (or divide) both parts by the same number.', 'A table of equal ratios is just this scaling, column by column.'],
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
          () => num('In the ratio 2 : 5, how many parts are in the second amount?', 5, 'The second number in 2 : 5 is 5.')
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
    u5L1: {
      'Decimal points stack': {
        viz: () => V.placeValue('12.40'),
        steps: ['Line the decimal points up, one under the other.', 'Then add or subtract like whole numbers.', 'Bring the point straight down into the answer.'],
        trap: 'Lining up the last digits instead of the points (12.4 + 3.25 as if they were 124 + 325) is the classic miss.',
        aap: 'AAP: 4.5 + 0.75 + 12 = 17.25. The whole number 12 is 12.00 when you line the points up.',
        tries: [
          () => num('Find 1.2 + 0.35', 1.55, 'Line up the points: 1.20 + 0.35 = 1.55.'),
          () => mc('When adding 3.4 and 12.05, which digits share a column?', 'The 4 and the 0 (tenths)', [['The 4 and the 5', 'Those are tenths and hundredths.'], ['The 3 and the 5', 'Different places.'], ['The 3 and the 0', '3 is ones; 0 is tenths.']], 'Stack the points. Tenths sit under tenths.')
        ]
      },
      'Fill in zeros': {
        viz: () => V.placeValue('8.00'),
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
        viz: () => V.areaRect(12, 3),
        steps: ['Estimate first: 1.2 × 3 is near 1 × 3 = 3, or 1.2 × 3 = a bit more than 3.', 'Multiply 12 × 3 = 36 as whole numbers.', '1.2 has one decimal place, so the product is 3.6.'],
        trap: 'Putting the point in the same place as one of the factors (12 × 3 = 36, then “1.2 so 3.6” is right here — but 1.2 × 0.3 is 0.36, not 3.6). Count all the places.',
        aap: 'AAP: 1.2 × 0.4 = 0.48 (two places in all). Estimate: a little less than half of 1.2.',
        tries: [
          () => num('Find 1.2 × 3', 3.6, '12 × 3 = 36, and 1.2 has one decimal place: 3.6.'),
          () => mc('Best estimate for 1.9 × 3.1?', '6', [['60', '1.9 is near 2, not 20.'], ['2', 'That is near the sum, not the product? Actually near 2+3.'], ['9', 'A little high: 2 × 3 = 6.']], '2 × 3 = 6.')
        ]
      },
      'Count decimal places too': {
        viz: () => V.cycleSteps(['2.35 (2)', '× 1.2 (1)', '3 places → 2.820']),
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
        steps: ['0.1 × 0.1 is one tenth of one tenth: 0.01, a hundredth.', 'Each factor has one decimal place, so the product has two.', 'A tenth of a tenth is smaller than a tenth.'],
        trap: '0.1 × 0.1 is not 0.1 and not 0.2. Multiplication by a tenth makes a number smaller.',
        aap: 'AAP: 0.1 × 0.1 × 0.1 = 0.001 (thousandths). Watch the places pile up.',
        tries: [
          () => num('What is 0.1 × 0.1?', 0.01, 'A tenth of a tenth is one hundredth: 0.01.'),
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
        viz: () => V.placeValue('5.40'),
        steps: ['When you divide a decimal by a whole number, the point in the quotient sits straight above the point in the dividend.', '5.4 ÷ 3: 5.4 is 54 tenths, 54 ÷ 3 = 18 tenths, so 1.8.', 'Estimate: a little less than 6 ÷ 3 = 2.'],
        trap: 'Dropping the point and then guessing (54 ÷ 3 = 18, so the answer is 18) forgets the tenths.',
        aap: 'AAP: 7.5 ÷ 5 = 1.5. Check: 5 × 1.5 = 7.5.',
        tries: [
          () => num('Find 5.4 ÷ 3', 1.8, 'The point rises straight up: 5.4 ÷ 3 = 1.8.'),
          () => num('Find 8.4 ÷ 2', 4.2, '8.4 ÷ 2 = 4.2. Check: 2 × 4.2 = 8.4.')
        ]
      },
      'Annex a zero': {
        viz: () => V.cycleSteps(['5.4', '5.40', '540 ÷ 4 = 135 → 1.35']),
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
        viz: () => V.cycleSteps(['5.4 ÷ 0.3', '×10 both', '54 ÷ 3 = 18']),
        steps: ['To divide by a decimal, multiply dividend and divisor by the same power of 10 until the divisor is whole.', '5.4 ÷ 0.3 → 54 ÷ 3 = 18.', 'The quotient does not change because both numbers were scaled the same way.'],
        trap: 'Moving the point in only one number (5.4 ÷ 0.3 → 5.4 ÷ 3) makes the answer 10 times too small.',
        aap: 'AAP: 0.84 ÷ 0.12 → 84 ÷ 12 = 7. Two places in each, so ×100 on both.',
        tries: [
          () => num('Find 5.4 ÷ 0.3', 18, 'Multiply both by 10: 54 ÷ 3 = 18.'),
          () => num('Find 1.2 ÷ 0.2', 6, '12 ÷ 2 = 6.')
        ]
      },
      'Why bigger?': {
        viz: () => V.fractionBar(1, 1, { fill: '#0fb39c', label: 'How many 0.2s fit in 1.2?' }),
        steps: ['1.2 ÷ 0.2 asks how many two-tenths fit in 1.2.', 'Six of them fit, so the quotient is 6 — larger than both numbers.', 'Dividing by a number less than 1 makes a larger result.'],
        trap: 'Expecting a smaller answer because “division makes smaller” — that is for divisors greater than 1.',
        aap: 'AAP: 3 ÷ 0.05 = 60. Think: how many nickels (0.05) fit in 3 dollars? 60.',
        tries: [
          () => num('Find 1.2 ÷ 0.2', 6, 'How many 0.2s fit in 1.2? Six of them. Or 12 ÷ 2 = 6.'),
          () => num('Find 3 ÷ 0.5', 6, 'How many halves fit in 3? Six.')
        ]
      }
    },
    u5B1: {
      'Below zero': {
        viz: () => V.numberLine(-8, 4, [{ pos: -5, label: '−5' }, { pos: 0, label: '0' }, { pos: 3, label: '3' }]),
        steps: ['Negative numbers sit to the left of 0 on the number line.', '−8 is less than −3, because −8 is farther left.', 'The farther left you go, the smaller the number.'],
        trap: 'Thinking “8 is bigger than 3, so −8 is bigger than −3.” The sign flips the comparison.',
        aap: 'AAP: order −4, 1, −1, 0, −6 from least to greatest: −6, −4, −1, 0, 1.',
        tries: [
          () => mc('Which is smaller, −8 or −3?', '−8', [['−3', '−8 is farther left, so it is smaller.'], ['They are equal', 'They are different places on the line.'], ['8', 'The question is about the negatives.']], 'On the line, −8 is to the left of −3.'),
          () => nline('Slide to −4.', -4, '−4 is four units left of 0.', -8, 8)
        ]
      },
      'Add on a number line': {
        viz: () => V.numberLine(-6, 6, [{ pos: -4, label: 'start' }, { pos: 2, label: '−4 + 6' }]),
        steps: ['Start at the first number.', 'Adding a positive: move right. Adding a negative: move left.', '−4 + 6 = 2: start at −4, move 6 right.'],
        trap: 'Adding a negative is not the same as adding the absolute values. −4 + (−3) = −7, not −1.',
        aap: 'AAP: −2 + (−5) + 9 = 2. Combine the negatives first: −7 + 9 = 2.',
        tries: [
          () => num('Find −4 + 6', 2, 'Start at −4, move 6 right: 2.'),
          () => num('Find −3 + (−2)', -5, 'Start at −3, move 2 left: −5.')
        ]
      },
      'Subtract = add the opposite': {
        viz: () => V.numberLine(-6, 12, [{ pos: 3, label: '3' }, { pos: -4, label: '3−7' }, { pos: 10, label: '3−(−7)' }]),
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
        viz: () => V.metricLadder('cm'),
        steps: ['Going to a smaller unit means more of them, so you multiply.', '3 m = 300 cm (×100).', '2 km = 2000 m (×1000).'],
        trap: 'Dividing when you go to a smaller unit gives a tiny, impossible length (3 m is not 0.03 cm).',
        aap: 'AAP: 2.4 km = 2400 m = 240,000 cm. Keep the 2.4 and move the point with the zeros.',
        tries: [
          () => num('Convert 3 meters to centimeters.', 300, '×100: 3 m = 300 cm.'),
          () => num('Convert 2 kilometers to meters.', 2000, '×1000: 2 km = 2000 m.')
        ]
      },
      'Small unit → big unit: divide': {
        viz: () => V.metricLadder('km'),
        steps: ['Going to a bigger unit means fewer of them, so you divide.', '300 cm = 3 m (÷100).', '2000 m = 2 km (÷1000).'],
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
        viz: () => V.cycleSteps(['1.5 km', '→ 1500 m', '+ 800 m', '= 2300 m']),
        steps: ['Put every measurement in the same unit before you add or subtract.', '1.5 km = 1500 m, plus 800 m is 2300 m.', '2300 m is also 2.3 km.'],
        trap: 'Adding 1.5 + 800 because the units were ignored (1.5 km + 800 m is not 801.5 of anything useful).',
        aap: 'AAP: 2 hours 15 minutes is not 2.15 hours. Convert minutes first: 2 + 15/60 = 2.25 hours, or stay in minutes (135).',
        tries: [
          () => num('1.5 km + 500 m, in meters?', 2000, '1.5 km = 1500 m, plus 500 m is 2000 m.'),
          () => num('2 m + 30 cm, in centimeters?', 230, '2 m = 200 cm, plus 30 cm is 230 cm.')
        ]
      },
      'Your turn': {
        viz: () => V.metricLadder('m'),
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
        viz: () => V.barGraph(['1 m', '2 m', '3 m'], [100, 200, 300], { title: 'Centimeters', color: '#0fb39c' }),
        steps: ['Each column scales both rows by the same factor.', '1 m : 100 cm, 2 m : 200 cm, 3 m : 300 cm.', 'A missing entry is an equivalent ratio.'],
        trap: 'Filling 1, 2, 3 in one row and 100, 101, 102 in the other (adding 1) instead of multiplying.',
        aap: 'AAP: 2.5 m is the 2.5 column: 250 cm. Scale factors can be decimals.',
        tries: [
          () => num('If 1 m = 100 cm, how many centimeters are 4 meters?', 400, '×4 on both parts: 400 cm.'),
          () => num('If 1 km = 1000 m, how many kilometers are 5000 m?', 5, '5000 ÷ 1000 = 5.')
        ]
      },
      'Rates for one': {
        viz: () => V.cycleSteps(['120 km', 'in 2 h', '60 km in 1 h']),
        steps: ['A unit rate tells the amount for one of something.', '120 km in 2 hours is 60 km per hour.', 'Divide both parts of the rate by the same number so the second part becomes 1.'],
        trap: 'Dividing the wrong way (2 ÷ 120) gives hours per kilometer, which is a different unit rate.',
        aap: 'AAP: 3 packs for $12 is $4 per pack, or 0.25 pack per dollar. Name the unit clearly.',
        tries: [
          () => num('120 km in 2 hours is how many kilometers per hour?', 60, '120 ÷ 2 = 60.'),
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
        viz: () => V.numberLine(0, 1, [{ pos: 0.4, label: '2/5' }, { pos: 0.45, label: '45%' }, { pos: 0.5, label: '0.5' }]),
        steps: ['Rename everything as decimals (or as percents, or as fractions with a common denominator).', 'Then compare: 0.4, 0.45, and 0.5.', 'The largest decimal is the largest amount.'],
        trap: 'Comparing 2/5 and 45% by looking at 2, 5, and 45 as if they were all whole numbers.',
        aap: 'AAP: order ' + fr(2, 3) + ', 70%, and 0.6. 2/3 ≈ 0.667, so 0.6, 70% (0.70), then 2/3.',
        tries: [
          () => mc('Which is greatest: ' + fr(2, 5) + ', 45%, or 0.5?', '0.5', [[fr(2, 5), '2/5 = 0.4, less than 0.5.'], ['45%', '45% = 0.45, less than 0.5.'], ['They are equal', '0.4, 0.45, and 0.5 are different.']], '0.5 = 50% is the largest.'),
          () => mc('Which is least: 0.3, ' + fr(1, 4) + ', or 20%?', '20%', [['0.3', '0.3 = 30%.'], [fr(1, 4), '1/4 = 0.25 = 25%.'], ['They are equal', '20%, 25%, and 30% differ.']], '20% = 0.20, which is less than 0.25 and 0.30.')
        ]
      }
    },
    u7B1: {
      'The whole circle is 100%': {
        viz: () => V.pie([40, 35, 25], ['40%', '35%', '25%']),
        steps: ['Every slice is a part of one whole, so the percents add to 100%.', 'A larger slice means a larger share of the group.', 'If a slice is missing from the labels, you can find it by subtracting from 100%.'],
        trap: 'Reading a slice as a count without knowing the total (40% is not “40 people” unless the whole is 100 people).',
        aap: 'AAP: if art is 40% of 80 students, that is 0.40 × 80 = 32 students, not 40.',
        tries: [
          () => num('Slices are 40% and 35%. What percent is the rest?', 25, '100 − 40 − 35 = 25.'),
          () => mc('A circle graph is the right choice to show', 'how one class’s votes split among three choices', [['how rainfall changed month by month', 'Use a line graph for change over time.'], ['the height of each student', 'That is not parts of one whole.'], ['a single score', 'You need parts that add to 100%.']], 'Circle graphs show parts of one whole.')
        ]
      },
      'From percent to people': {
        watch: { id: 'pctof', p: 35, n: 20, wrong: '35' },
        viz: () => V.hundredGrid(35, { fill: '#ffc43d', label: '35% of 20 students = 7' }),
        steps: ['Change the percent to a decimal: 35% = 0.35.', 'Multiply by the total: 0.35 × 20 = 7.', 'Check: 7 out of 20 is 35%.'],
        trap: 'Using the percent as a count (35% of 20 is not 35 students).',
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
        viz: () => V.fractionBar(5, 2, { fill: '#0fb39c', label: '2 1/2 = 5/2' }),
        steps: ['Add (or subtract) the whole numbers, then the fractions.', 'If the fractions need a common denominator, rename them first.', mixed(1, 1, 2) + ' + ' + mixed(1, 1, 4) + ' = 2 + ' + fr(3, 4) + ' = ' + mixed(2, 3, 4) + '.'],
        trap: 'Adding the whole to the numerator (2 1/2 as 3/2 is right, but 2 1/2 as 21/2 is a place-value slip).',
        aap: 'AAP: convert to improper fractions when it is cleaner: ' + mixed(2, 1, 3) + ' = ' + fr(7, 3) + '.',
        tries: [
          () => mc('What is ' + mixed(1, 1, 2) + ' + ' + mixed(1, 1, 4) + '?', mixed(2, 3, 4), [[mixed(2, 2, 6), 'Do not add the denominators.'], [mixed(2, 1, 6), 'Common denominator 4: 2/4 + 1/4 = 3/4.'], ['3', 'A little less than 3: 2 and 3/4.']], 'Wholes: 2. Parts: 1/2 + 1/4 = 3/4.'),
          () => num('How many halves are in ' + mixed(2, 1, 2) + '?', 5, mixed(2, 1, 2) + ' = 5/2, so five halves.')
        ]
      },
      'Subtracting with regrouping': {
        viz: () => V.fractionBar(7, 4, { fill: '#0fb39c', label: '1 3/4 = 7/4' }),
        steps: ['If the top fraction is too small, regroup one whole as a fraction.', mixed(2, 1, 4) + ' − ' + fr(3, 4) + ': trade 1 whole for 4/4, so ' + mixed(1, 5, 4) + ' − ' + fr(3, 4) + ' = ' + mixed(1, 2, 4) + ' = ' + mixed(1, 1, 2) + '.'],
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
        viz: () => V.fractionBar(3, 4, { fill: '#0fb39c', label: '3 × 1/4 = 3/4' }),
        steps: ['4 × ' + fr(1, 3) + ' means four groups of one third: ' + fr(4, 3) + ' = ' + mixed(1, 1, 3) + '.', 'A whole times a fraction: multiply the whole by the numerator, keep the denominator.', '3 × ' + fr(2, 5) + ' = ' + fr(6, 5) + ' = ' + mixed(1, 1, 5) + '.'],
        trap: 'Multiplying both the numerator and the denominator by the whole (3 × 2/5 = 6/15) makes the amount smaller, not larger.',
        aap: 'AAP: 10 × 3/5 = 30/5 = 6. A friendly denominator lets the whole cancel.',
        tries: [
          () => mc('What is 3 × ' + fr(2, 5) + '?', mixed(1, 1, 5), [[fr(6, 15), 'Multiply only the numerator by 3.'], [fr(5, 6), 'That flipped and added.'], ['6', '6/5 is 1 1/5, not 6.']], '3 × 2/5 = 6/5 = 1 1/5.'),
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
        viz: () => V.cycleSteps(['1 ÷ 1/4', 'how many 1/4s', '4']),
        steps: ['Dividing by a fraction asks how many of those pieces fit.', '1 ÷ ' + fr(1, 4) + ' = 4, because four fourths make a whole.', 'A shortcut: multiply by the reciprocal. 1 ÷ 1/4 = 1 × 4/1 = 4.'],
        trap: '1 ÷ 1/4 is not 1/4 and not 1/5. Dividing by a unit fraction gives a whole number larger than 1.',
        aap: 'AAP: 3/4 ÷ 1/8 = 3/4 × 8/1 = 6. How many eighths fit in 3/4? Six of them.',
        tries: [
          () => num('How many fourths fit in 1 whole?', 4, '1 ÷ 1/4 = 4.'),
          () => num('How many eighths fit in ' + fr(3, 4) + '?', 6, '3/4 ÷ 1/8 = 3/4 × 8 = 6.')
        ]
      }
    },

    /* ---------- Unit 9 ---------- */
    u9L1: {
      'Name the angle': {
        viz: () => V.angle(90, { label: '90° right' }),
        steps: ['Acute: less than 90°. Right: exactly 90°. Obtuse: between 90° and 180°. Straight: 180°.', 'A square corner is a right angle.', 'Use a protractor or a square-corner test when you can.'],
        trap: 'Calling every “sharp-looking” angle acute, even when it is a little over 90° (obtuse).',
        aap: 'AAP: angles in a triangle add to 180°. If two angles are 40° and 70°, the third is 70° (isosceles).',
        tries: [
          () => mc('What kind of angle is 90°?', 'right', [['acute', 'Acute is less than 90°.'], ['obtuse', 'Obtuse is more than 90° and less than 180°.'], ['straight', 'Straight is 180°.']], 'A right angle is exactly 90°.'),
          () => mc('What kind of angle is 130°?', 'obtuse', [['acute', '130° is greater than 90°.'], ['right', 'Right is exactly 90°.'], ['straight', 'Straight is 180°.']], '130° is between 90° and 180°.')
        ]
      },
      'Classify triangles two ways': {
        viz: () => V.angle(60, { label: '60°' }),
        steps: ['By sides: equilateral (3 equal), isosceles (at least 2 equal), scalene (no equal sides).', 'By angles: acute, right, or obtuse (named for the largest angle).', 'A triangle can be both isosceles and acute, for example.'],
        trap: 'Thinking isosceles cannot be equilateral. Equilateral is a special isosceles: all three sides equal.',
        aap: 'AAP: a 7-7-7 triangle is equilateral, isosceles, and acute (all angles 60°). Select every name that fits.',
        tries: [
          () => ms('A triangle has sides 7, 7, and 7. Select all names that fit.', ['equilateral', 'isosceles', 'scalene', 'acute', 'right'], [0, 1, 3], 'Three equal sides: equilateral and isosceles. All angles are 60°, so acute.'),
          () => mc('A triangle has a 90° angle. What kind is it (by angles)?', 'right', [['acute', 'A 90° angle is not acute.'], ['obtuse', 'Obtuse would be greater than 90°.'], ['equilateral', 'That is a side name, and 90° cannot appear in an equilateral triangle.']], 'A 90° angle makes a right triangle.')
        ]
      }
    },
    u9L2: {
      'Half a rectangle': {
        viz: () => V.areaRect(12, 7, { unit: 'm' }),
        steps: ['A right triangle is half of a rectangle (or half of a square).', 'Area = ' + fr(1, 2) + ' × base × height.', 'For legs 12 m and 7 m: ' + fr(1, 2) + ' × 12 × 7 = 42 m².'],
        trap: 'Forgetting the 1/2 and reporting 84, which is the rectangle, not the triangle.',
        aap: 'AAP: the 1/2 works for any triangle if the height is perpendicular to the base, not only for right triangles.',
        tries: [
          () => num('A right triangle has legs 12 m and 7 m. What is its area in square meters?', 42, '1/2 × 12 × 7 = 42.'),
          () => num('A right triangle has legs 8 cm and 5 cm. What is its area in square centimeters?', 20, '1/2 × 8 × 5 = 20.')
        ]
      },
      'Your turn': {
        viz: () => V.areaRect(10, 6, { unit: 'cm' }),
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
        viz: () => V.cycleSteps(['base 6×4', '× height 5', 'volume 120']),
        steps: ['Volume of a rectangular prism is length × width × height, or base area × height.', 'A 6 cm by 4 cm by 5 cm box: base 24 cm², times 5 = 120 cm³.', 'You can picture 5 layers of 24 cubes.'],
        trap: 'Adding the three edges (6+4+5=15) or finding only the surface. Volume is a fill, in cubic units.',
        aap: 'AAP: if one edge doubles, the volume doubles. If all three edges double, the volume is 8 times as big.',
        tries: [
          () => num('A box is 6 cm by 4 cm by 5 cm. What is the volume in cubic centimeters?', 120, '6 × 4 × 5 = 120.'),
          () => num('The base of a box is 10 cm² and the height is 3 cm. What is the volume in cubic centimeters?', 30, 'Base area × height: 10 × 3 = 30.')
        ]
      },
      'Perimeter, area or volume?': {
        viz: () => V.areaRect(6, 4, { unit: 'cm' }),
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
        viz: () => V.angle(180, { label: 'diameter' }),
        steps: ['Radius is from the center to the edge. Diameter is all the way across (2 × radius).', 'Circumference is the distance around: C = π × diameter, or 2 × π × radius.', 'π is a little more than 3, or about 3.14.'],
        trap: 'Using the radius in C = πd (or the diameter in 2πr) without converting. Diameter is twice the radius.',
        aap: 'AAP: a circle with radius 5 has diameter 10 and circumference about 31.4. Area (πr²) is a later AAP extension: about 78.5.',
        tries: [
          () => num('A circle has radius 6 cm. What is the diameter in centimeters?', 12, 'Diameter is twice the radius: 2 × 6 = 12.'),
          () => mc('If the diameter is 10, the circumference is about', '31.4', [['13', 'That is near 10 + 3, not π × 10.'], ['20', 'That is 2 × 10, missing π.'], ['100', 'That would be 10 × 10.']], 'C = π × 10 ≈ 3.14 × 10 = 31.4.')
        ]
      },
      'Parallelogram = rectangle in disguise': {
        viz: () => V.areaRect(8, 5, { unit: 'cm' }),
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
        viz: () => V.barGraph(['2', '4', '6', '8'], [2, 4, 6, 8], { title: 'Share equally → mean 5', color: '#2f80ed' }),
        steps: ['The mean is a fair share: dump everything into one pile, then split equally.', 'Add, then divide by how many values.', '2, 4, 6, 8: total 20, mean 20 ÷ 4 = 5.'],
        trap: 'Dividing by the wrong count (forgetting one value, or dividing by the greatest value).',
        aap: 'AAP: if the mean of four numbers is 9, the total is 36. A missing number is 36 minus the other three.',
        tries: [
          () => num('What is the mean of 4, 6, and 8?', 6, '4 + 6 + 8 = 18, and 18 ÷ 3 = 6.'),
          () => num('Four numbers have a mean of 5. What is their total?', 20, 'Mean × how many: 5 × 4 = 20.')
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
        viz: () => V.stemLeaf([31, 32, 35, 40, 44, 51], { title: 'Scores', key: 'Key: 3 | 1 means 31' }),
        steps: ['The stem is the tens. The leaves are the ones, written in order.', 'A key is required: “3 | 1 means 31.”', 'You can still find mean, median, mode, and range from the plot.'],
        trap: 'Reading 3 | 1 2 as 3.12 or as 312. Each leaf is a ones digit on that stem.',
        aap: 'AAP: from the plot, the median is the middle leaf when all leaves are listed in order across the rows.',
        tries: [
          () => num('In 3 | 1 2 5 with key “3 | 1 means 31,” how many values are in that row?', 3, 'Three leaves: 31, 32, and 35.'),
          () => mc('What is the range of 31, 32, 35, 40, 44, 51?', '20', [['3', 'That is a stem, not the range.'], ['51', 'Range is greatest minus least.'], ['10', '51 − 31 = 20.']], '51 − 31 = 20.')
        ]
      },
      'Your turn': {
        viz: () => V.linePlot([2, 2, 3, 3, 3, 5, 8], { title: 'A line plot of the same data idea' }),
        steps: ['A line plot and a stem-and-leaf plot can show the same set.', 'Use the plot to count, to find the cluster, and to find the range.', 'Titles and labels still matter.'],
        trap: 'Counting the tick marks on the number line instead of the dots.',
        aap: 'AAP: if a new outlier 12 is added to 2, 2, 3, 3, 3, 5, 8, the range jumps and the mean rises more than the median.',
        tries: [
          () => num('On a line plot of 2, 2, 3, 3, 3, 5, 8, how many dots are above 3?', 3, 'Three values are 3.'),
          () => num('What is the range of 2, 2, 3, 3, 3, 5, 8?', 6, '8 − 2 = 6.')
        ]
      }
    },
    u10L3: {
      'Tree diagrams': {
        viz: () => V.cycleSteps(['shirt', '× pants', '× hat', 'outfits']),
        steps: ['A tree (or the counting principle) lists every path.', 'If there are 3 shirts and 2 pants, there are 3 × 2 = 6 outfits.', 'Multiply the number of choices at each step.'],
        trap: 'Adding the choices (3 + 2 = 5 outfits) instead of multiplying.',
        aap: 'AAP: 3 shirts, 2 pants, 2 hats: 3 × 2 × 2 = 12 outfits. Each new independent choice multiplies the total.',
        tries: [
          () => num('3 shirts and 2 pants: how many outfits?', 6, '3 × 2 = 6.'),
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
        viz: () => V.numberLine(0, 10, [{ pos: 2, label: '2' }, { pos: 5, label: 'mean' }, { pos: 8, label: '8' }]),
        steps: ['Think of the mean as a balance point on a number line.', 'Values below the mean and values above it “balance.”', '2 and 8 balance around 5: each is 3 away.'],
        trap: 'Moving one point and expecting the mean to stay put. The balance point shifts toward the move.',
        aap: 'AAP: if 2, 5, 8 has mean 5, changing 8 to 14 shifts the mean to 7. The total rose by 6, and 6 ÷ 3 = 2.',
        tries: [
          () => num('What is the mean of 2, 5, and 8?', 5, '2 + 5 + 8 = 15, and 15 ÷ 3 = 5. It is also the balance point.'),
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
        viz: () => V.plane([{ x: 1, y: 2, label: '(1, 2)' }, { x: 2, y: 4, label: '(2, 4)' }, { x: 3, y: 6, label: '(3, 6)' }], { n: 8 }),
        steps: ['A table of (x, y) pairs can follow a rule, like y = 2x.', '(1, 2), (2, 4), (3, 6) sit on a straight line.', 'The graph of a constant rate is a line through those points.'],
        trap: 'Plotting the points and then connecting them in the order of the table when a point was mistyped — check that they follow the rule first.',
        aap: 'AAP: if y = 2x + 1, the points are (1, 3), (2, 5), (3, 7). The “+1” shifts every y-value up by 1.',
        tries: [
          () => num('If y = 2x, what is y when x = 4?', 8, '2 × 4 = 8. The point is (4, 8).'),
          () => mc('The points (1, 2), (2, 4), (3, 6) follow which rule?', 'y = 2x', [['y = x + 2', 'That would give (1, 3).'], ['y = x', 'That would give (1, 1).'], ['x = 2y', 'That would swap the roles.']], 'Each y is twice x.')
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
