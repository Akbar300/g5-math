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
  {t:'Partial products', h:'<div class="big">246 × 35</div>', steps:['<p>246 × <b>5</b> = 1230</p>', '<p>246 × <b>30</b> = 7380 &nbsp;(not 738! the 3 is 3 tens)</p>', '<p>1230 + 7380 = <b>8610</b>. Estimate: 250 × 35 ≈ 8750 ✓</p>'], trap:'Forgetting the placeholder zero on the tens row. 246 × 3 tens = 7380.'},
  {t:'Try one', h:'<p>Show your work on paper, then type the answer.</p>', tr:{type:'num', q:'Find 318 × 24. (Estimate first: about 300 × 25.)', a:7632, why:'318 × 4 = 1272; 318 × 20 = 6360; 1272 + 6360 = 7632. Estimate 7500 ✓.'}}
 ]},
 {id:'u3L3', name:'Divide by 2 digits', icon:'➗', cards:[
  {t:'Estimate each digit of the quotient', h:'<div class="big">1554 ÷ 42</div>', steps:['<p>How many 42s in 155? Think 40 into 150 → about <b>3</b>. 3 × 42 = 126. 155 − 126 = 29.</p>', '<p>Bring down 4 → 294. Think 40 into 290 → about 7. 7 × 42 = 294 exactly.</p>', '<p>Answer: <b>37</b>. Check: 37 × 42 = 1554 ✓</p>'], key:'Divide, Multiply, Subtract, Bring down. If the subtraction is bigger than the divisor, your digit was too small.'},
  {t:'Try one', h:'', tr:{type:'num', q:'Find 1932 ÷ 23.', a:84, why:'23 × 84 = 1932. Estimate: 2000 ÷ 25 = 80 ✓.'}}
 ]},
 {id:'u3L4', name:'What to do with remainders', icon:'🧩', cards:[
  {t:'The story decides', h:'<p>130 students ride buses that hold 24 each. 130 ÷ 24 = 5 r10.</p>' + L.tbl(['Question','Answer','Why'], [['How many buses are needed?','<b>6</b>','The 10 extra kids still need a bus: round UP'],['How many buses are full?','<b>5</b>','Drop the remainder'],['How many kids on the last bus?','<b>10</b>','The remainder IS the answer']]), trap:'Writing "5 r10 buses". Buses come in whole numbers, so reread the question.'},
  {t:'Your turn', h:'', tr:mc('Each box holds 15 cupcakes. There are 100 cupcakes. How many boxes are needed to hold all of them?', '7', [['6', '6 boxes hold 90. The other 10 cupcakes need another box.'], ['6 r10', 'Boxes are whole things. What does the remainder mean here?'], ['10', 'That is the leftover cupcakes, not the boxes.']], '100 ÷ 15 = 6 r10, so you need 7 boxes.')}
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
    var b = L.ri(2, 6), e = L.ri(2, 3), v = Math.pow(b, e);
    return mc(b + '<sup>' + e + '</sup> = ?', String(v), [[String(b*e), 'Not ' + b + ' × ' + e + '. Multiply ' + b + ' by itself ' + e + ' times.'], [String(Math.pow(e, b)), 'That swaps the base and exponent.'], [String(b+e), 'Repeated multiplication, not addition.']], Array(e).fill(b).join(' × ') + ' = ' + v + '.');
  }},
  sq: {name:'Perfect squares', f:function(lv){
    var n = L.ri(2, 20);
    return {type:'num', q:'What is ' + n + '<sup>2</sup>?', a:n*n, why:n + ' × ' + n + ' = ' + n*n + '.'};
  }}
};
var bridge = {
  title:'Go Further: powers of 10 & exponents', tab:'🚀 Go Further',
  intro:'Multiplying by 10, 100 and 1000 is the doorway to <b>exponents</b> and <b>perfect squares</b>, which is what the Advanced class is starting right now (Advanced Unit 5).',
  lessons:[{id:'u3B1', name:'Exponents', icon:'⚡', cards:[
    {t:'A shortcut for repeated multiplication', h:'<div class="big">10 × 10 × 10 = 10<sup>3</sup> = 1000</div><p>The exponent counts how many times the base is multiplied. 10<sup>3</sup> has 3 zeros.</p>', trap:'10<sup>3</sup> is not 30.'},
    {t:'Perfect squares', h:'<p>7<sup>2</sup> = 7 × 7 = 49. Picture 7 rows of 7: a perfect square shape.</p><p>Know 1<sup>2</sup> through 20<sup>2</sup>: they show up all through Advanced math.</p>', tr:bg.sq.f()}
  ]}],
  gens:bg, repIds:['p10','expo','sq'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u3', lessons:lessons, test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u3', num: 3, emoji: '✖️', title: 'Whole Number Workshop',
  blurb: 'Estimate, then multiply and divide big numbers — including remainders.', sol: ['5.CE.1'], dates: ['2026-10-05', '2026-11-13'], color: '#e85d04'
}, window.V2, { gUnit: 3, coreStds: ['5.CE.1'] });

