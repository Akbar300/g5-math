/* Unit 3: Whole Number Workshop — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 3, Whole Number Computation (5.CE.1) */
(function(){
var L = V2L, mc = L.mc;
var lessons = [
 {id:'u3L1', name:'Estimate first', icon:'🎯', cards:[
  {t:'Your safety net', h:'<p>Before any big problem, make a quick estimate. If your exact answer is far from it, something slipped.</p><div class="big">387 × 42 ≈ 400 × 40 = 16000</div><p>The exact answer is 16254, close to 16000 ✓.</p>', key:'Estimate → compute → compare. Three steps, every time.'},
  {t:'Compatible numbers for division', h:'<p>For division, pick numbers that divide nicely, not just rounded ones.</p><div class="big">3196 ÷ 38 ≈ 3200 ÷ 40 = 80</div><p>The exact answer is 84 r4, close to 80 ✓.</p>', trap:'Skipping the estimate. Most "silly mistakes" (a missing zero, a place-value slip) get caught here.', tr:mc('Which is the best estimate for 612 × 29?', '18000', [['1800', 'Count zeros: 600 × 30 = 18000.'], ['180000', 'Count zeros: 600 × 30 = 18000.'], ['641', 'That is about the sum.']], '600 × 30 = 18000.')}
 ]},
 {id:'u3L2', name:'Multiply big numbers', icon:'✖️', cards:[
  {t:'Multiply top to bottom', h:'<div class="big">246 × 35</div><p>Multiply by the ones digit first. Then put a <b>0</b> in the ones place and multiply by the tens digit. Add the two rows.</p>', trap:'Forgetting the placeholder zero on the tens row. 246 × 3 tens = 7380, not 738.'},
  {t:'Why it works: the box picture', h:'<p>The rows you write are the same pieces as an area picture, added in two groups.</p>'},
  {t:'Try one', h:'<p>Show your work on paper, then type the answer.</p>', tr:{type:'num', q:'Find 318 × 24. (Estimate first: about 300 × 25.)', a:7632, why:'318 × 4 = 1272; 318 × 20 = 6360; 1272 + 6360 = 7632. Estimate 7500 ✓.'}}
 ]},
 {id:'u3L3', name:'Divide by 2 digits', icon:'➗', cards:[
  {t:'Estimate each digit of the quotient', h:'<p>Long division is one short loop, repeated for every digit: <b>Divide, Multiply, Subtract, Bring down</b>. Each time you only ask: how many of the divisor fit into this part of the number?</p>' + '<div class="big">1554 ÷ 42</div>', steps:['<p>How many 42s in 155? Think 40 into 150 → about <b>3</b>. 3 × 42 = 126. 155 − 126 = 29.</p>', '<p>Bring down 4 → 294. Think 40 into 290 → about 7. 7 × 42 = 294 exactly.</p>', '<p>Answer: <b>37</b>. Check: 37 × 42 = 1554 ✓</p>'], key:'Divide, Multiply, Subtract, Bring down. If the subtraction is bigger than the divisor, your digit was too small.'},
  {t:'Try one', h:'', tr:{type:'num', q:'Find 1932 ÷ 23.', a:84, why:'23 × 84 = 1932. Estimate: 2000 ÷ 25 = 80 ✓.'}}
 ]},
 {id:'u3L4', name:'What to do with remainders', icon:'🧩', cards:[
  {t:'The story decides', h:'<p>130 students ride buses that hold 24 each. 130 ÷ 24 = 5 r10.</p>' + L.tbl(['Question','Answer','Why'], [['How many buses are needed?','<b>6</b>','The 10 extra kids still need a bus: round UP'],['How many buses are full?','<b>5</b>','Drop the remainder'],['How many kids on the last bus?','<b>10</b>','The remainder IS the answer']]), trap:'Writing "5 r10 buses". Buses come in whole numbers, so reread the question.'},
  {t:'Your turn', h:'', tr:mc('Each box holds 15 cupcakes. There are 100 cupcakes. How many boxes are needed to hold all of them?', '7', [['6', '6 boxes hold 90. The other 10 cupcakes need another box.'], ['6 r10', 'Boxes are whole things. What does the remainder mean here?'], ['10', 'That is the leftover cupcakes, not the boxes.']], '100 ÷ 15 = 6 r10, so you need 7 boxes.')}
 ]},
 {id:'u3L5', name:'Divisibility shortcuts', icon:'🔢', cards:[
  {t:'Test before you divide', h:'<p>You can often tell whether a number divides evenly without doing the division. Check the last digit or the digit sum.</p>' + L.tbl(['Divisible by','Check','Example'], [['2','Last digit is even','348 ends in 8 ✓'],['5','Last digit is 0 or 5','1365 ends in 5 ✓'],['10','Last digit is 0','7240 ends in 0 ✓'],['4','Last two digits divisible by 4','1316 → 16 ✓'],['8','Last three digits divisible by 8','5128 → 128 ✓'],['3','Digit sum divisible by 3','741 → 7+4+1 = 12 ✓'],['9','Digit sum divisible by 9','2016 → 2+0+1+6 = 9 ✓'],['6','Divisible by both 2 and 3','348: even, and 3+4+8 = 15 ✓']]), key:'Check the digits first. If a test fails, the number does not divide evenly, and you can skip the division.'},
  {t:'The digit sum and remainders', h:'<p>For 9 (and 3), the digit sum also gives the remainder. Keep adding digits until one digit is left.</p><div class="big">2026 → 2+0+2+6 = 10 → 1+0 = 1</div><p>So 2026 ÷ 9 leaves remainder <b>1</b>. Check: 9 × 225 = 2025, plus 1.</p>', trap:'Stopping at 10. Keep adding until one digit is left.'},
  {t:'Your turn', h:'', tr:mc('Is 4617 divisible by 9?', 'Yes', [['No', 'Recheck the digit sum: 4 + 6 + 1 + 7 = 18, and 18 is divisible by 9.'], ['Only by 3', '18 is divisible by 9 too, so both tests pass.'], ['Only by 2', '4617 ends in 7, so it is odd. It is not divisible by 2.']], '4 + 6 + 1 + 7 = 18, and 9 × 513 = 4617. Yes.')},
  {t:'Try one', h:'', tr:{type:'num', q:'Find the remainder when 2026 is divided by 9.', a:1, why:'Digit sum 2+0+2+6 = 10, then 1+0 = 1. Check: 9 × 225 = 2025.'}}
 ]},
 {id:'u3L6', name:'Exponents', icon:'⚡', cards:[
  {t:'A shortcut for repeated multiplication', h:'<div class="big">10 × 10 × 10 = 10<sup>3</sup> = 1000</div><p>The exponent counts how many times the base is multiplied. 10<sup>3</sup> has 3 zeros.</p>', trap:'10<sup>3</sup> is not 10 × 3 = 30. It is three factors of 10.'},
  {t:'Perfect squares', h:'<p>7<sup>2</sup> = 7 × 7 = 49. Picture 7 rows of 7: a perfect square shape.</p><p>Know 1<sup>2</sup> through 12<sup>2</sup> cold, and recognize the squares up to 20<sup>2</sup> = 400.</p>', tr:{type:'num', q:'What is 6<sup>2</sup>?', a:36, why:'6 × 6 = 36.'}},
  {t:'Powers of 10: count the zeros', h:'<p>Multiplying by 10, 100 and 1000 is the same as multiplying by 10<sup>1</sup>, 10<sup>2</sup> and 10<sup>3</sup>.</p>' + L.tbl(['Power','Means','Value'], [['10<sup>2</sup>','10 × 10','100'],['10<sup>3</sup>','10 × 10 × 10','1000'],['10<sup>4</sup>','10 × 10 × 10 × 10','10000']]), key:'The exponent on 10 tells you how many zeros the answer has.'}
 ]}
];
var test = [
 mc('A school orders 1020 pencils in packs of 24. How many packs are completely full?', '42', [['43', 'The question asks for FULL packs, so drop the remainder.'], ['42 r12', 'Answer with whole packs.'], ['12', 'That is the leftover pencils.']], '1020 ÷ 24 = 42 r12. 42 packs are full.'),
 {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> products greater than 20000.', ch:['412 × 52', '389 × 49', '512 × 41', '298 × 68', '610 × 35'], a:[0,2,4], why:''},
 {type:'multi', fmt:'MULTI-PART', q:'A theater has 28 rows of 36 seats. 815 tickets are sold.<br>Part A: total seats?<br>Part B: empty seats?', parts:[{label:'A:', a:1008},{label:'B:', a:193}], why:'28 × 36 = 1008. 1008 − 815 = 193.'},
 mc('Which is the best estimate for 4785 ÷ 61?', '80', [['8', 'Check the size: 4800 ÷ 60 = 80.'], ['800', 'Check the size: 4800 ÷ 60 = 80.'], ['4724', 'That is about the difference.']], '4800 ÷ 60 = 80 (compatible numbers).'),
 {type:'num', fmt:'TYPE IN', q:'Find 2496 ÷ 32.', a:78, why:'32 × 78 = 2496.'}
];
/* fix the select-all key honestly: compute it */
(function(){ var t = test[1], vals = t.ch.map(function(s){ var p = s.split(' × '); return +p[0] * +p[1]; }); t.a = vals.map(function(v, i){ return v > 20000 ? i : -1; }).filter(function(i){ return i >= 0; }); t.why = t.ch.map(function(s, i){ return s + ' = ' + vals[i]; }).join(', ') + '. Estimate first, then check the close ones exactly.'; })();
var bg = {
  p10: {name:'Powers of 10', f:function(lv){
    var e = L.ri(1, 5), c = L.ri(2, 9), v = c * Math.pow(10, e);
    return mc(c + ' × 10<sup>' + e + '</sup> = ?', String(v), [[String(c * 10 * e), '10<sup>' + e + '</sup> is not 10 × ' + e + '. It is ' + e + ' tens multiplied: ' + Math.pow(10, e) + '.'], [String(v * 10), 'Count the zeros: exactly ' + e + '.'], [String(v / 10), 'Count the zeros: exactly ' + e + '.']], '10<sup>' + e + '</sup> = ' + Math.pow(10, e) + ', so ' + c + ' × ' + Math.pow(10, e) + ' = ' + v + '.');
  }},
  expo: {name:'Exponents', f:function(lv){
    var e = L.ri(2, 6), v = Math.pow(10, e);
    return mc('10<sup>' + e + '</sup> = ?', String(v), [[String(10 * e), 'Not 10 × ' + e + '. Multiply 10 by itself ' + e + ' times.'], [String(v * 10), 'Count the zeros: exactly ' + e + '.'], [String(v / 10), 'Count the zeros: exactly ' + e + '.']], Array(e).fill(10).join(' × ') + ' = ' + v + '.');
  }},
  read: {name:'Exponents: read it and write it', f:function(lv){
    var b = L.ri(2, 9), e = L.ri(3, 6), rep = Array(e).fill(b).join(' × ');
    if (L.ri(0, 1)) {
      return {type:'num', q:'Write <b>' + rep + '</b> as a power. What is the exponent?', a:e, why:'Count the ' + b + 's: there are ' + e + ', so it is ' + b + '<sup>' + e + '</sup>. The exponent is ' + e + '.'};
    }
    return {type:'num', q:'In <b>' + b + '<sup>' + e + '</sup></b>, how many times is ' + b + ' used as a factor?', a:e, why:'The exponent tells how many copies of the base are multiplied: ' + rep + '.'};
  }},
  sq: {name:'Perfect squares', f:function(lv){
    var n = L.ri(2, 12);
    return {type:'num', q:'What is ' + n + '<sup>2</sup>?', a:n*n, why:n + ' × ' + n + ' = ' + n*n + '.'};
  }},
  sqstory: {name:'Squares in real life', f:function(lv){
    var n = L.ri(4, 12);
    return {type:'num', q:'A square patio is ' + n + ' tiles long and ' + n + ' tiles wide. How many tiles cover it?', a:n*n, why:'A square has equal sides, so ' + n + ' × ' + n + ' = ' + n + '<sup>2</sup> = ' + n*n + ' tiles.'};
  }}
};
var bgAdv = {
  big3: {name:'Three-digit multiplication', f:function(lv){
    var a = L.ri(112, 489), b = L.ri(112, 389);
    var p1 = a * (b % 10), p2 = a * (Math.floor(b / 10) % 10) * 10, p3 = a * Math.floor(b / 100) * 100;
    var est = (Math.round(a / 100) * 100) * (Math.round(b / 100) * 100);
    return {type:'num', q:'Find <b>' + a + ' × ' + b + '</b>. (Estimate first: about ' + est + '.)', a:a * b, why:a + ' × ' + (b % 10) + ' = ' + p1 + '; ' + a + ' × ' + (Math.floor(b / 10) % 10 * 10) + ' = ' + p2 + '; ' + a + ' × ' + (Math.floor(b / 100) * 100) + ' = ' + p3 + '. Total ' + (a * b) + '.'};
  }},
  div5: {name:'Divide a five-digit number', f:function(lv){
    var d = L.ri(12, 48), lo = Math.ceil(10000 / d), hi = Math.min(999, Math.floor(99999 / d)), q = L.ri(lo, hi), n = d * q;
    return {type:'num', q:'Find <b>' + n + ' ÷ ' + d + '</b>.', a:q, why:d + ' × ' + q + ' = ' + n + '. Check by multiplying back.'};
  }},
  decq: {name:'Remainder as a decimal', f:function(lv){
    var d = L.pick([2, 4, 5, 8, 20, 25]), n;
    do { n = L.ri(101, 999); } while (n % d === 0);
    var v = Math.round(n / d * 1000) / 1000;
    return {type:'num', q:'Find <b>' + n + ' ÷ ' + d + '</b> as a decimal.', a:v, why:n + ' ÷ ' + d + ' = ' + Math.floor(n / d) + ' R' + (n % d) + '. Put a decimal point after the quotient, add zeros to the dividend, and keep dividing: ' + L.num(v) + '.'};
  }},
  pow: {name:'Powers with other bases', f:function(lv){
    var b = L.pick([2, 3, 4, 5, 6, 7]), e = b === 2 ? L.ri(5, 9) : (b <= 4 ? L.ri(3, 5) : L.ri(3, 4)), v = Math.pow(b, e);
    return {type:'num', q:'What is ' + b + '<sup>' + e + '</sup>?', a:v, why:Array(e).fill(b).join(' × ') + ' = ' + v + '.'};
  }},
  sq20: {name:'Squares up to 20²', f:function(lv){
    var n = L.ri(13, 20);
    return {type:'num', q:'What is ' + n + '<sup>2</sup>?', a:n * n, why:n + ' × ' + n + ' = ' + (n * n) + '.'};
  }},
  sqroot: {name:'Square roots', f:function(lv){
    var n = L.ri(6, 20), v = n * n;
    return mc('What is √' + v + '?', String(n), [[String(Math.round(v / 2)), 'That is half of ' + v + '. A square root is the number that multiplies by itself to make ' + v + '.'], [String(n + 1), (n + 1) + ' × ' + (n + 1) + ' = ' + ((n + 1) * (n + 1)) + ', which is too big.'], [String(n - 1), (n - 1) + ' × ' + (n - 1) + ' = ' + ((n - 1) * (n - 1)) + ', which is too small.']], n + ' × ' + n + ' = ' + v + ', so √' + v + ' = ' + n + '.');
  }},
  between: {name:'Between two squares', f:function(lv){
    var n = L.ri(7, 19), lo = n * n, hi = (n + 1) * (n + 1), x = L.ri(lo + 2, hi - 2);
    return mc('Which two perfect squares is <b>' + x + '</b> between?', lo + ' and ' + hi, [[((n - 1) * (n - 1)) + ' and ' + lo, x + ' is bigger than ' + lo + ', so it is past this pair.'], [hi + ' and ' + ((n + 2) * (n + 2)), x + ' is smaller than ' + hi + '.'], [lo + ' and ' + ((n + 2) * (n + 2)), 'Those are not neighbors: ' + hi + ' sits in between them.']], n + '<sup>2</sup> = ' + lo + ' and ' + (n + 1) + '<sup>2</sup> = ' + hi + '. ' + x + ' is between them, so it is not a perfect square.');
  }},
  oop: {name:'Order of operations with powers', f:function(lv){
    var t = L.ri(0, 2), a, b, c, d, v, q, why;
    if (t === 0) { a = L.ri(2, 9); b = L.ri(2, 5); c = L.ri(2, 6); v = a + b * b * c; q = a + ' + ' + b + '<sup>2</sup> × ' + c; why = b + '<sup>2</sup> = ' + (b * b) + ' first. Then ' + (b * b) + ' × ' + c + ' = ' + (b * b * c) + '. Then ' + a + ' + ' + (b * b * c) + ' = ' + v + '.'; }
    else if (t === 1) { a = L.ri(1, 5); b = L.ri(1, 4); c = L.ri(2, 9); v = (a + b) * (a + b) - c; q = '(' + a + ' + ' + b + ')<sup>2</sup> − ' + c; why = 'Parentheses first: ' + a + ' + ' + b + ' = ' + (a + b) + '. Then ' + (a + b) + '<sup>2</sup> = ' + ((a + b) * (a + b)) + '. Then subtract ' + c + ': ' + v + '.'; }
    else { b = L.ri(2, 3); c = L.ri(2, 6); d = L.ri(2, 5); v = c * Math.pow(b, 3) - d; q = c + ' × ' + b + '<sup>3</sup> − ' + d; why = b + '<sup>3</sup> = ' + Math.pow(b, 3) + ' first. Then ' + c + ' × ' + Math.pow(b, 3) + ' = ' + (c * Math.pow(b, 3)) + '. Then subtract ' + d + ': ' + v + '.'; }
    return {type:'num', q:'What is <b>' + q + '</b>?', a:v, why:why};
  }}
};
var bridge = {
  title:'Go Further: Grade 6 moves', tab:'🚀 Go Further',
  intro:'Core uses base 10 for exponents. This goes up a grade: bigger whole-number computation, decimal quotients, square roots, other bases, and powers inside expressions.',
  lessons:[
    {id:'u3B1', name:'Bigger computation', icon:'🚀', cards:[
      {t:'Three digits by three digits', h:'<div class="big">482 × 316</div><p>Same top-to-bottom steps, just one more row. Each new row starts with one more placeholder zero than the row above it.</p>', trap:'A hundreds row needs two zeros. 482 × 3 hundreds = 144600, not 1446.', tr:{type:'num', q:'Find 214 × 132. (Estimate first: 200 × 130 = 26000.)', a:28248, why:'214 × 2 = 428; 214 × 30 = 6420; 214 × 100 = 21400; 428 + 6420 + 21400 = 28248.'}},
      {t:'Remainder as a decimal', h:'<div class="big">357 ÷ 8 = 44 R5 = 44.625</div><p>A remainder can also keep dividing. Put a decimal point after the quotient, add zeros to the dividend, and bring them down one at a time.</p>', trap:'Writing 44.5 for 44 R5. The 5 is 5 left to divide, not 5 tenths.', tr:{type:'num', q:'Find 63 ÷ 5 as a decimal.', a:12.6, why:'63 ÷ 5 = 12 R3. Bring down a 0: 30 ÷ 5 = 6. So 12.6.'}}
    ]},
    {id:'u3B2', name:'Squares & square roots', icon:'🟦', cards:[
      {t:'Square roots undo squaring', h:'<div class="big">15<sup>2</sup> = 225 &nbsp;→&nbsp; √225 = 15</div><p>A square root asks: what number times itself makes this? Every square in the gallery gives you a root for free.</p>', trap:'√49 is 7, not 24.5. Do not halve.', tr:bgAdv.sqroot.f()},
      {t:'Is it a perfect square?', h:'<p>Two quick tests: a square never ends in 2, 3, 7 or 8, and a non-square sits between two neighbors in the list.</p><div class="big">150 is between 12<sup>2</sup> = 144 and 13<sup>2</sup> = 169</div>', trap:'Ending in 1, 4, 5, 6, 9 or 0 does not make it a square. 65 ends in 5 but 8² = 64 and 9² = 81.', tr:bgAdv.between.f()}
    ]},
    {id:'u3B3', name:'Other bases & expressions', icon:'⚡', cards:[
      {t:'Other bases grow fast', h:'<div class="big">2<sup>8</sup> = 256 &nbsp;&nbsp; 3<sup>5</sup> = 243</div><p>Base 10 only adds zeros. Any other base needs the repeated multiplication, and the numbers grow fast.</p>', trap:'3<sup>5</sup> and 5<sup>3</sup> are different. Swapping the base and exponent changes the answer.', tr:bgAdv.pow.f()},
      {t:'Powers come right after parentheses', h:'<div class="big">3 + 2<sup>2</sup> × 5 = 3 + 4 × 5 = 23</div><p>Order: parentheses, then powers, then × and ÷ left to right, then + and − left to right.</p>', trap:'Doing 3 + 2 first. Powers and multiplication beat addition.', tr:bgAdv.oop.f()}
    ]}
  ],
  gens:bgAdv, repIds:['big3','div5','decq','pow','sq20','sqroot','between','oop'],
  next:'Core has the exponent lesson. Come back here for the Grade 6 stretch problems.'
};
window.V2 = {key:'u3', lessons:lessons, test:test, bridge:bridge, gens:bg, repIds:['expo','read','sq','sqstory','p10']};
})();

Adapt.fromV2({
  id: 'u3', num: 3, emoji: '✖️', title: 'Whole Number Workshop',
  blurb: 'Estimate, then multiply and divide big numbers — including remainders.', sol: ['5.CE.1'], dates: ['2026-10-05', '2026-11-13'], color: '#e85d04'
}, window.V2, { gUnit: 3, coreStds: ['5.CE.1'] });

