/* Unit 5: Decimal Workshop — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 5, Decimal Computation (5.CE.3) */
(function(){
var L = V2L, f = L.fr, mc = L.mc, sg = L.sg, P = L.par;
function nz(a, b){ var x = 0; while(x === 0) x = L.ri(a, b); return x; }
function r3(x){ return Math.round(x * 1000) / 1000; }
/* ---- Rounding decimals (5.CE.3a). Every card has a motion explainer (js/explainers/round.js). ---- */
var PLACE = ['whole number', 'tenth', 'hundredth'], PDIG = ['ones', 'tenths', 'hundredths'];
function rk(K, p){ var u = Math.pow(10, 3 - p), D = Math.floor(K / u) * u, dec = Math.floor((K - D) / (u / 10)); return {u:u, D:D, U:D + u, dec:dec, ans: dec >= 5 ? D + u : D}; }
function fk(K, n){ return (K / 1000).toFixed(n); }
/* Pick a number to round. Mix: plain, a 9 that rolls over, and numbers where "rounding twice" changes the answer. */
function roundPick(p){
  for (var g = 0; g < 300; g++){
    var whole = L.pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 18, 25, 36]);
    var K = whole * 1000 + L.ri(1, 999);
    if (K % 10 === 0) continue;
    var R = rk(K, p), x = fk(K, 3);
    var tIdx = p === 0 ? x.indexOf('.') - 1 : x.indexOf('.') + p;
    var roll = R.dec >= 5 && x[tIdx] === '9';
    var kind = L.pick(['plain', 'plain', 'plain', 'roll', 'up']);
    if (kind === 'roll' && !roll) continue;
    if (kind === 'up' && R.dec < 5) continue;
    if (p === 1 && x[tIdx] === '0' && L.ri(0, 1)) continue;
    return {x:x, K:K, R:R, tIdx:tIdx, roll:roll};
  }
  return {x:'4.738', K:4738, R:rk(4738, p), tIdx:2, roll:false};
}
function genRound(pIn){
  var p = pIn == null ? L.pick([0, 1, 1, 2, 2]) : pIn;
  var o = roundPick(p), x = o.x, R = o.R, right = fk(R.ans, p);
  var dIdx = p === 0 ? x.indexOf('.') + 1 : o.tIdx + 1, dg = +x[dIdx];
  var why = 'The ' + PDIG[p] + ' digit is <b>' + x[o.tIdx] + '</b>. The decider (next digit) is <b>' + dg + '</b>: ' + (dg >= 5 ? '5 or more, bump up' : '4 or less, keep') + '. Drop the rest: <b>' + right + '</b>.';
  var watch = function(ctx){ return {id:'round', x:x, p:p, wrong: ctx && ctx.answer}; };
  if (L.ri(0, 2) === 0) {
    return {type:'num', nocalc:true, fmt:'TYPE IN', q:'Round <b>' + x + '</b> to the nearest <b>' + PLACE[p] + '</b>.', a: +right, why:why, watch:watch, placeholder: p === 0 ? '25' : p === 1 ? '25.4' : '25.35'};
  }
  var wrong = [];
  wrong.push([fk(R.ans === R.D ? R.U : R.D, p), R.ans === R.D ? 'The decider is ' + dg + ', so keep. Do not bump.' : 'Just cutting off digits is not rounding. The decider is ' + dg + ', so bump up.']);
  if (p === 1) wrong.push([fk(Math.floor(o.K / 1000) * 1000, 1), 'That is the whole number with ".0". A tenths answer keeps the tenths digit: look at ' + x[o.tIdx] + ', then the decider.']);
  if (o.roll && p > 0) wrong.push([fk(R.D, p).slice(0, -1) + '10', 'A 9 rolls over like an odometer: it becomes 0 and the next place goes up.']);
  if (p === 0 && o.K >= 10000) wrong.push([String(Math.round(o.K / 10000) * 10), 'That is rounding to the tens. Nearest whole number: look at the tenths digit.']);
  if (p < 2) wrong.push([fk(rk(o.K, p + 1).ans, p + 1), 'Rounded to the wrong place. Nearest ' + PLACE[p] + ' has ' + p + ' decimal place' + (p === 1 ? '' : 's') + '.']);
  if (p > 0) wrong.push([fk(rk(o.K, p - 1).ans, p - 1), 'Rounded to the wrong place. Nearest ' + PLACE[p] + ' keeps the ' + PDIG[p] + ' digit.']);
  var seen = {}; seen[right] = 1;
  wrong = wrong.filter(function(w2){ var k = w2[0]; if (seen[k] || Math.abs(parseFloat(k) - parseFloat(right)) < 1e-9) return false; seen[k] = 1; return true; });
  var it = mc('Round <b>' + x + '</b> to the nearest <b>' + PLACE[p] + '</b>.', right, L.shuffle(wrong).slice(0, 3), why);
  if (!it) return {type:'num', nocalc:true, fmt:'TYPE IN', q:'Round <b>' + x + '</b> to the nearest <b>' + PLACE[p] + '</b>.', a: +right, why:why, watch:watch};
  it.nocalc = true; it.watch = watch; it.fmt = 'MULTIPLE CHOICE';
  return it;
}
window.U5Round = genRound;
var lessons = [
 {id:'u5L0', name:'Round it', icon:'🎯', cards:[
  {t:'Find the place, then the decider', h:'<div class="big">4.7<span class="v2-hl">3</span>8 → nearest tenth</div><p>Underline the digit in the rounding place (the tenths digit, <b>7</b>). The digit right after it (<b>3</b>) is the <b>decider</b>. Nothing else matters.</p>', watch:{id:'round', x:'4.738', p:1}, key:'5 or more: bump up. 4 or less: keep. Then drop every digit after the rounding place.'},
  {t:'A tenths answer keeps the tenths digit', h:'<div class="big">3.062 → 3.1</div><p>The tenths digit is 0, the decider is 6, so bump the 0 up to 1. The answer is not always "something point zero".</p>', trap:'Writing the whole number with ".0" (18.296 → 18.0). Keep the tenths digit 2, the decider 9 bumps it: <b>18.3</b>.', watch:{id:'round', x:'3.062', p:1, wrong:'3.0'}, tr:function(){ return genRound(1); }},
  {t:'Hundredths keep two decimal places', h:'<div class="big">0.865 → 0.87</div><p>Keep 0.86. The decider is the thousandths digit, 5, so bump: <b>0.87</b>.</p>', trap:'Moving digits around: 0.865 is not 0.09. The answer is always one of two neighbors: 0.86 or 0.87.', watch:{id:'round', x:'0.865', p:2, wrong:'0.09'}, tr:function(){ return genRound(2); }},
  {t:'Whole number: the tenths digit decides', h:'<div class="big">25.351 → 25</div><p>The ones digit is 5. The decider is the tenths digit, 3, so keep: <b>25</b>.</p>', trap:'25.351 is not 30. That is rounding to the tens.', watch:{id:'round', x:'25.351', p:0, wrong:'30'}, tr:function(){ return genRound(0); }},
  {t:'When a 9 bumps up', h:'<div class="big">7.96 → 8.0</div><p>Bumping the 9 is like an odometer: it rolls to 0 and the ones go up. Keep the 0, it holds the tenths place.</p>', trap:'7.96 is not 7.10. That is back near 7.', watch:{id:'round', x:'7.96', p:1}},
  {t:'One look, no chain', h:'<div class="big">2.448 → 2.4</div><p>Do not round to hundredths first (2.45) and then again (2.5). Look at the decider once: 4, so keep.</p>', watch:{id:'round', x:'2.448', p:1}, tr:function(){ return genRound(); }}
 ]},
 {id:'u5L1', name:'Line up the point', icon:'➕', cards:[
  {t:'Decimal points stack', h:'<p>When you add or subtract decimals, stack the <b>decimal points</b>, not the right-hand digits.</p><div class="big" style="text-align:right;max-width:200px;margin:auto">&nbsp;&nbsp;4.<span class="v2-hl">7</span>0<br>+ 12.<span class="v2-hl">3</span>5<br>——————<br>17.05</div>', trap:'Lining up the last digits: 4.7 + 12.35 is NOT 12.82.'},
  {t:'Fill in zeros', h:'', steps:['<div class="big">8 − 2.46</div><p>8 has no decimal places showing.</p>', '<div class="big">8.00 − 2.46</div><p>Write the whole number with a decimal point and zeros. Same value!</p>', '<div class="big">= 5.54</div><p>Now regroup like whole numbers.</p>'], tr:{type:'num', nocalc:true, q:'Find 6.3 − 2.85', a:3.45, why:'6.30 − 2.85 = 3.45.'}}
 ]},
 {id:'u5L2', name:'Multiply: estimate first', icon:'✖️', cards:[
  {t:'Ignore the point, then place it', h:'<div class="big">3.4 × 6</div>', steps:['<p>Estimate: 3.4 is about 3, and 3 × 6 = 18. So the answer is near <b>18</b>.</p>', '<p>Multiply like whole numbers: 34 × 6 = 204.</p>', '<p>Place the point so it matches the estimate: 2.04? 20.4? 204? The answer near 18 is <b>20.4</b>.</p>'], key:'Estimate before you place the decimal point. It catches most mistakes.'},
  {t:'Count decimal places too', h:'<p>Another check: count the decimal places in the factors.</p><div class="big">2.35 × 1.2 → 2 + 1 = 3 places</div><p>235 × 12 = 2820, so the product is <b>2.820</b> = 2.82.</p>', tr:{type:'num', nocalc:true, q:'Find 4.6 × 3. Estimate first!', a:13.8, why:'Estimate 5 × 3 = 15. 46 × 3 = 138 → 13.8.'}}
 ]},
 {id:'u5L3', name:'Decimal × decimal', icon:'🟦', cards:[
  {t:'A tenth of a tenth', h:'<p>0.3 × 0.4 means "3 tenths of 4 tenths". On a hundred grid, shade 3 columns and 4 rows. The overlap is the product.</p><div class="big">0.3 × 0.4 = 0.12</div><p>The overlap is 12 small squares: 12 hundredths.</p>', trap:'0.3 × 0.4 is NOT 1.2. Multiplying two numbers less than 1 gives an answer SMALLER than both.'},
  {t:'Smaller than you think', h:'<p>When you multiply by a number <b>less than 1</b>, the answer shrinks: 8 × 0.5 = 4 (half of 8).</p>', tr:mc('Which is the product 0.6 × 0.2?', '0.12', [['1.2', 'Two decimals less than 1 make a smaller product. Count places: 1 + 1 = 2.'], ['0.8', 'That is the sum.'], ['12', 'Place the decimal point: 2 decimal places.']], '6 × 2 = 12, with 2 decimal places → 0.12.')}
 ]},
 {id:'u5L4', name:'Divide by a whole number', icon:'➗', cards:[
  {t:'Point goes straight up', h:'<p>Dividing a decimal by a whole number: put the decimal point in the quotient <b>directly above</b> the point in the dividend, then divide like normal.</p><div class="big">7.65 ÷ 3 = 2.55</div>', steps:['<p>3 into 7 → 2, remainder 1.</p>', '<p>Bring down 6: 16 ÷ 3 = 5 r1. The point goes up above the dividend\'s point.</p>', '<p>Bring down 5: 15 ÷ 3 = 5. Answer: <b>2.55</b>.</p>']},
  {t:'Annex a zero', h:'<p>Sometimes you need one more place: 5.4 ÷ 4.</p><p>5.4 → 5.40. Then 540 ÷ 4 = 135, so the answer is <b>1.35</b>.</p>', tr:{type:'num', nocalc:true, q:'Find 9.6 ÷ 4', a:2.4, why:'96 ÷ 4 = 24, point above → 2.4. Estimate: about 10 ÷ 4 = 2.5 ✓.'}}
 ]},
 {id:'u5L5', name:'Divide by tenths', icon:'🔟', cards:[
  {t:'Make the divisor whole', h:'<div class="big">4.8 ÷ 0.6</div>', steps:['<p>Multiply BOTH numbers by 10. The quotient does not change.</p><div class="big">48 ÷ 6</div>', '<div class="big">= 8</div><p>Check: 0.6 × 8 = 4.8 ✓</p>'], trap:'Dividing by a number less than 1 makes the answer BIGGER. 4.8 ÷ 0.6 is 8, not 0.8.'},
  {t:'Why bigger?', h:'<p>"How many 0.6s fit in 4.8?" Many! Small pieces mean more of them.</p>', tr:mc('3.5 ÷ 0.5 = ?', '7', [['0.7', 'Dividing by a number less than 1 makes the answer bigger.'], ['1.75', 'That is 3.5 ÷ 2.'], ['70', 'Multiply BOTH numbers by 10: 35 ÷ 5.']], '35 ÷ 5 = 7.')}
 ]}
];
var test = [
 {type:'ms', fmt:'SELECT ALL', nocalc:true, q:'Select <b>all</b> expressions equal to 2.4.', ch:['0.6 × 4', '4.8 ÷ 2', '1.2 + 1.2', '0.24 × 0.1', '3 − 0.6'], a:[0,1,2,4], why:'0.24 × 0.1 = 0.024. The others all make 2.4.'},
 mc('A student says 0.4 × 0.2 = 0.8. Which is the correct product?', '0.08', [['0.8', 'Two decimal places in total: 4 × 2 = 8 → 0.08.'], ['8', 'Count the decimal places.'], ['0.6', 'That is the sum.']], '4 × 2 = 8, and 1 + 1 = 2 decimal places → 0.08.'),
 {type:'order', fmt:'DRAG TO ORDER', nocalc:true, q:'Order these <b>answers</b> from least to greatest.', items:['6 × 0.5', '6 ÷ 0.5', '6 × 0.05', '6 ÷ 5'], vals:[3, 12, .3, 1.2], dir:'asc', why:'6 × 0.05 = 0.3, 6 ÷ 5 = 1.2, 6 × 0.5 = 3, 6 ÷ 0.5 = 12.'},
 {type:'multi', fmt:'MULTI-PART', q:'Maya buys 3 notebooks at $2.45 each and pays with a $10 bill.<br>Part A: total cost?<br>Part B: change?', parts:[{label:'A: $', a:7.35},{label:'B: $', a:2.65}], why:'3 × 2.45 = 7.35. 10.00 − 7.35 = 2.65.'},
 {type:'num', fmt:'TYPE IN', nocalc:true, q:'Find 12.6 ÷ 0.3', a:42, why:'Multiply both by 10: 126 ÷ 3 = 42.'},
 mc('Which is the best estimate of 19.8 × 3.1?', '60', [['6', 'Estimate: 20 × 3 = 60.'], ['600', 'Check the size: about 20 groups of 3.'], ['23', 'That is about the sum, not the product.']], '19.8 ≈ 20 and 3.1 ≈ 3, so about 60.'),
 {type:'num', fmt:'TYPE IN', nocalc:true, q:'Find 15 − 6.38', a:8.62, why:'15.00 − 6.38 = 8.62.'}
];
/* bridge: decimals operations → integer operations (Advanced Unit 5) */
var bg = {
  iadd: {name:'Add integers', f:function(lv){
    var a = nz(-12, 12), b = nz(-12, 12); if(a > 0 && b > 0) b = -b; var r = a + b;
    return mc(sg(a) + ' + ' + P(b) + ' = ?', sg(r), [[sg(-r), 'Right size, wrong sign: which side has more?'], [sg(a - b), 'That subtracts. This is addition.'], [sg(r + (r > 0 ? 2 : -2)), 'Recheck: different signs → subtract the sizes.']], 'Start at ' + sg(a) + ' and move ' + Math.abs(b) + (b < 0 ? ' left' : ' right') + ': ' + sg(r) + '.');
  }},
  isub: {name:'Subtract integers', f:function(lv){
    var a = nz(-10, 10), b = nz(-10, 10), r = a - b;
    return mc(sg(a) + ' − ' + P(b) + ' = ?', sg(r), [[sg(a + b), 'Subtracting = adding the opposite: ' + sg(a) + ' + ' + P(-b) + '.'], [sg(-r), 'Check the sign.'], [sg(r + 1), 'Recheck the arithmetic.']], sg(a) + ' + ' + P(-b) + ' = ' + sg(r) + '.');
  }},
  inl: {name:'Integer number line', f:function(lv){
    var a = nz(-8, 8), blo = Math.max(-8, -10 - a), bhi = Math.min(8, 10 - a);
    var b = nz(blo, bhi), r = a + b, guard = 0;
    while ((r < -10 || r > 10 || b === 0) && guard++ < 40) { b = nz(blo, bhi); r = a + b; }
    if (r < -10 || r > 10) { b = a <= 0 ? 1 : -1; r = a + b; }
    return {type:'nline', q:'Slide to the value of <b>' + sg(a) + ' + ' + P(b) + '</b>.', min:-10, max:10, step:1, labels:{0:'−10',10:'0',20:'10'}, a:r, why:'Start at ' + sg(a) + ', move ' + Math.abs(b) + (b < 0 ? ' left' : ' right') + ': ' + sg(r) + '.'};
  }}
};
var bridge = {
  title:'Go Further: integer computation', tab:'🚀 Go Further',
  intro:'The Advanced class does this unit with <b>negative numbers</b> (Advanced Unit 5: Integer Computation). Same idea as decimals: know the place you start, which way you move, and how far.',
  lessons:[{id:'u5B1', name:'Negative numbers', icon:'🌡️', cards:[
    {t:'Below zero', h:'<p>A thermometer goes below 0: −5° is 5 degrees below zero. On a number line, negatives sit to the <b>left</b> of 0.</p><p>−8 &lt; −3, because −8 is farther left. (Colder!)</p>', trap:'−8 is LESS than −3, even though 8 is bigger than 3.'},
    {t:'Add on a number line', h:'<p>Adding a positive: move right. Adding a negative: move left.</p><div class="big">−4 + 6 = 2</div><p>Start at −4, move 6 right.</p>', tr:function(){ return bg.inl.f(); }},
    {t:'Subtract = add the opposite', h:'<div class="big">3 − 7 = 3 + (−7) = −4</div><div class="big">3 − (−7) = 3 + 7 = 10</div><p>Keep, change, flip.</p>', tr:function(){ return bg.isub.f(); }}
  ]}],
  gens:bg, repIds:['iadd','isub','inl'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u5', lessons:lessons, test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u5', num: 5, emoji: '💠', title: 'Decimal Workshop',
  blurb: 'Round decimals, then add, subtract, multiply, and divide them. Place the point with care.', sol: ['5.CE.3'], dates: ['2026-12-07', '2027-01-15'], color: '#0369a1'
}, window.V2, { gUnit: 5, coreStds: ['5.CE.3'] });
/* Rounding practice goes first in both paths (misses offer the rounding explainer). */
(function(){
  if (!window.UNIT || !window.U5Round) return;
  window.UNIT.core.skills.unshift({ id: 'round', name: 'Round decimals', gen: function(){ return window.U5Round(); } });
  window.UNIT.advanced.skills.unshift({ id: 'round-adv', name: 'Round decimals', gen: function(){ return window.U5Round(); } });
})();

