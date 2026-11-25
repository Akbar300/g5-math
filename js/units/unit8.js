/* Unit 8: Fraction Workshop — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 8, Fraction Computation (5.CE.2) */
(function(){
var L = V2L, f = L.fr, mc = L.mc;
var lessons = [
 {id:'u8L1', name:'Unlike denominators', icon:'🔀', cards:[
  {t:'Same-size pieces first', h:'<p>You cannot add halves and thirds directly. The pieces are different sizes. Rename both with a <b>common denominator</b> (the LCM).</p>', steps:['<div class="big">' + f(1,2) + ' + ' + f(1,3) + '</div><p>LCM of 2 and 3 is 6.</p>', '<div class="big">' + f(3,6) + ' + ' + f(2,6) + '</div><p>Rename each fraction.</p>', '<div class="big">= ' + f(5,6) + '</div><p>Add the numerators. The denominator stays 6.</p>'], trap:'Adding tops and bottoms: ' + f(1,2) + ' + ' + f(1,3) + ' is NOT ' + f(2,5) + '.'},
  {t:'Your turn', h:'', tr:mc(f(3,4) + ' − ' + f(1,6) + ' = ?', f(7,12), [[f(2,2), 'Never subtract the denominators.'], [f(2,10), 'Never subtract the denominators.'], [f(5,12), 'Rename: ' + f(3,4) + ' = ' + f(9,12) + ' and ' + f(1,6) + ' = ' + f(2,12) + '.']], 'LCM 12: ' + f(9,12) + ' − ' + f(2,12) + ' = ' + f(7,12) + '.')}
 ]},
 {id:'u8L2', name:'Mixed numbers', icon:'🔢', cards:[
  {t:'Wholes with wholes, parts with parts', h:'<p>To add mixed numbers, add in two piles: whole numbers with whole numbers, and fractions with fractions (using a common denominator). If the fractions make a whole or more, move that whole over to the whole-number pile.</p>' + '<div class="big">2 ' + f(3,4) + ' + 1 ' + f(1,2) + '</div>', steps:['<p>Wholes: 2 + 1 = 3.</p>', '<p>Parts: ' + f(3,4) + ' + ' + f(2,4) + ' = ' + f(5,4) + ' = 1 ' + f(1,4) + '.</p>', '<p>Total: 3 + 1 ' + f(1,4) + ' = <b>4 ' + f(1,4) + '</b>.</p>'], trap:'Regrouping with 10 instead of with the denominator. ' + f(5,4) + ' is 1 ' + f(1,4) + ', not 0 ' + f(15,10) + '.'},
  {t:'Subtracting with regrouping', h:'<div class="big">5 ' + f(1,8) + ' − 2 ' + f(5,8) + '</div><p>' + f(1,8) + ' is too small to take ' + f(5,8) + '. Borrow 1 whole = ' + f(8,8) + ': 5 ' + f(1,8) + ' = 4 ' + f(9,8) + '.</p><div class="big">4 ' + f(9,8) + ' − 2 ' + f(5,8) + ' = 2 ' + f(4,8) + ' = 2 ' + f(1,2) + '</div>'}
 ]},
 {id:'u8L3', name:'Whole × fraction', icon:'✖️', cards:[
  {t:'Groups of a fraction', h:'<div class="big">6 × ' + f(2,3) + '</div><p>6 groups of ' + f(2,3) + '. Find ' + f(1,3) + ' of 6 (that is 2), then double it: <b>4</b>.</p>', trap:'6 × ' + f(2,3) + ' is NOT ' + f(12,18) + '. Only the numerator gets multiplied: ' + f('6 × 2', 3) + ' = ' + f(12,3) + ' = 4.'},
  {t:'Your turn', h:'', tr:{type:'num', nocalc:true, q:'Find 8 × ' + f(3,4) + '.', a:6, why:f(1,4) + ' of 8 is 2, so ' + f(3,4) + ' of 8 is 6.'}}
 ]}
];
var test = [
 Object.assign(mc(f(2,3) + ' + ' + f(1,4) + ' = ?', f(11,12), [[f(3,7), 'Never add the denominators.'], [f(3,12), 'Rename BOTH fractions: ' + f(8,12) + ' + ' + f(3,12) + '.'], [f(9,12), 'Check ' + f(2,3) + ' = ' + f(8,12) + '.']], 'LCM 12: ' + f(8,12) + ' + ' + f(3,12) + ' = ' + f(11,12) + '.'), {nocalc:true}),
 {type:'ms', fmt:'SELECT ALL', nocalc:true, q:'Select <b>all</b> sums equal to 1.', ch:[f(1,2) + ' + ' + f(2,4), f(1,3) + ' + ' + f(2,3), f(3,8) + ' + ' + f(1,2), f(2,5) + ' + ' + f(6,10), f(1,4) + ' + ' + f(1,4)], a:[0,1,3], why:f(3,8) + ' + ' + f(4,8) + ' = ' + f(7,8) + '; ' + f(1,4) + ' + ' + f(1,4) + ' = ' + f(1,2) + '.'},
 {type:'multi', fmt:'MULTI-PART', q:'A recipe needs 2 ' + f(1,2) + ' cups of flour. Mia has 1 ' + f(3,4) + ' cups.<br>Part A: how many more cups? Type the decimal.<br>Part B: how many fourths of a cup is that?', parts:[{label:'A:', a:.75},{label:'B:', a:3, unit:'fourths'}], why:'2 ' + f(2,4) + ' − 1 ' + f(3,4) + ' = 1 ' + f(6,4) + ' − 1 ' + f(3,4) + ' = ' + f(3,4) + ' = 0.75.'},
 Object.assign(mc('Which is equal to 10 × ' + f(3,5) + '?', '6', [[f(30,50), 'Only the numerator is multiplied by the whole number.'], [f(13,5), 'That adds 10 to the top.'], ['30', 'Divide by 5 too: ' + f(30,5) + ' = 6.']], f(30,5) + ' = 6.'), {nocalc:true})
];
var bg = {
  fmul: {name:'Fraction × fraction', f:function(lv){
    var a = L.ri(1,5), b = L.ri(a+1,8), c = L.ri(1,5), d = L.ri(c+1,9), s = L.simp(a*c, b*d);
    return mc(f(a,b) + ' × ' + f(c,d) + ' = ?', L.frs(a*c, b*d), [[L.frs(a*d, b*c), 'That is division (flip). For multiplication: tops × tops, bottoms × bottoms.'], [L.frs(a+c, b+d), 'Multiply, do not add.'], [L.frs(a*c+1, b*d), 'Recheck the numerators.']], 'Tops × tops = ' + a*c + ', bottoms × bottoms = ' + b*d + ': ' + f(a*c, b*d) + (s[1] !== b*d ? ' = ' + L.frs(a*c, b*d) : '') + '.');
  }},
  fdiv: {name:'Divide fractions', f:function(lv){
    var n = L.ri(2, 6), d = L.pick([2,3,4]);
    return mc(n + ' ÷ ' + f(1,d) + ' = ?', String(n*d), [[L.frs(n, d), 'That is ' + n + ' × ' + f(1,d) + '. Dividing by a fraction less than 1 makes MORE.'], [String(n + d), 'How many ' + f(1,d) + 's fit in ' + n + '?'], [f(1, n*d), 'Upside down.']], 'Each whole holds ' + d + ' pieces of size ' + f(1,d) + ', so ' + n + ' wholes hold ' + n*d + '.');
  }},
  sfrac: {name:'Signed fractions (Go Further)', f:function(lv, kind){ for (var t = 0; t < 10; t++) { var it = sfQ(lv, kind); if (it) return it; } return null; }},
  mixmd: {name:'Mixed numbers × ÷', f:function(lv, kind){ for (var t = 0; t < 8; t++) { var it = mixQ(lv, kind); if (it) return it; } return null; }},
  bigsm: {name:'Bigger or smaller?', f:function(lv, kind){ for (var t = 0; t < 8; t++) { var it = bsQ(lv, kind); if (it) return it; } return null; }}
};
/* Mixed number helpers: m = [whole, num, den]; imp = improper numerator. */
function mxs(w, n, d){ return n ? (w ? w + ' ' : '') + f(n, d) : String(w); }
function fracAns(N, D){ var g = L.gcd(N, D), n = N / g, d = D / g, w = Math.floor(n / d), r = n - w*d;
  var acc = [n / d, n + '/' + d]; if (w && r) acc.push(w + ' ' + r + '/' + d); if (!r) acc.push(String(w));
  return {a:r ? acc[1] : String(w), acc:acc, html:L.frs(N, D), whole:!r}; }
function mixQ(lv, kind){
  var k = kind != null ? kind : L.pick([0, 0, 1, 1, 2, 3]);
  var D1 = L.pick([2, 3, 4]), w1 = L.ri(1, 3), n1 = L.ri(1, D1 - 1); if (L.gcd(n1, D1) !== 1) return null;
  var I1 = w1*D1 + n1;
  if (k === 0) { /* mixed × mixed */
    var D2 = L.pick([2, 3, 4, 5]), w2 = L.ri(1, 2), n2 = L.ri(1, D2 - 1); if (L.gcd(n2, D2) !== 1) return null;
    var I2 = w2*D2 + n2, A = fracAns(I1*I2, D1*D2), parts = fracAns(w1*w2*D1*D2 + n1*n2, D1*D2);
    if (parts.acc[0] === A.acc[0]) return null;
    return mc(mxs(w1, n1, D1) + ' × ' + mxs(w2, n2, D2) + ' = ?', A.html, [
      [parts.html, 'That multiplies wholes by wholes and parts by parts. Change both to improper fractions first: ' + f(I1, D1) + ' × ' + f(I2, D2) + '.'],
      [L.frs(I1*D2 + I2*D1, D1*D2), 'That adds them. This is multiplication.'],
      [L.frs(I1*I2, D1 + D2), 'Multiply the denominators too: ' + D1 + ' × ' + D2 + '.']],
      'Improper first: ' + f(I1, D1) + ' × ' + f(I2, D2) + ' = ' + f(I1*I2, D1*D2) + ' = <b>' + A.html + '</b>. Estimate check: about ' + Math.round(I1 / D1) + ' × ' + Math.round(I2 / D2) + ' = ' + Math.round(I1 / D1) * Math.round(I2 / D2) + '.');
  }
  if (k === 1) { /* mixed × whole, typed */
    var kk = L.ri(2, 6), B = fracAns(I1*kk, D1);
    return {type:'num', fmt:'TYPE IN', q:'Find <b>' + mxs(w1, n1, D1) + ' × ' + kk + '</b>. Write a fraction or mixed number.', a:B.a, acc:B.acc, placeholder:'n/d', why:mxs(w1, n1, D1) + ' = ' + f(I1, D1) + '. ' + f(I1, D1) + ' × ' + kk + ' = ' + f(I1*kk, D1) + ' = <b>' + B.html + '</b>. (Or: ' + w1 + ' × ' + kk + ' = ' + w1*kk + ' and ' + f(n1, D1) + ' × ' + kk + ' = ' + L.frs(n1*kk, D1) + '.)'};
  }
  if (k === 2) { /* mixed ÷ mixed with a whole answer: how many fit? */
    var D = L.pick([2, 3, 4]), wb = L.ri(1, 2), nb = L.ri(1, D - 1), Ib = wb*D + nb, q = L.ri(2, 4), Ia = Ib*q;
    var wa = Math.floor(Ia / D), na = Ia - wa*D; if (!na) return null;
    var g1 = L.gcd(na, D), g2 = L.gcd(nb, D);
    return mc(mxs(wa, na / g1, D / g1) + ' ÷ ' + mxs(wb, nb / g2, D / g2) + ' = ?', String(q), [
      [L.frs(Ib, Ia), 'That flips the first number. Keep the first, flip the second: ' + f(Ia, D) + ' × ' + f(D, Ib) + '.'],
      [L.frs(Ia*Ib, D*D), 'That multiplies. To divide, multiply by the reciprocal.'],
      [String(Math.max(1, wa - wb)), 'That subtracts the wholes. Ask: how many ' + mxs(wb, nb / g2, D / g2) + ' fit in ' + mxs(wa, na / g1, D / g1) + '?']],
      'Improper first: ' + f(Ia, D) + ' ÷ ' + f(Ib, D) + ' = ' + f(Ia, D) + ' × ' + f(D, Ib) + ' = ' + Ia + ' ÷ ' + Ib + ' = <b>' + q + '</b>. Check: ' + q + ' × ' + mxs(wb, nb / g2, D / g2) + ' = ' + mxs(wa, na / g1, D / g1) + '.');
  }
  /* estimate first */
  var D3 = L.pick([3, 4, 5, 8]), w3 = L.ri(2, 6), n3 = L.ri(1, D3 - 1), w4 = L.ri(2, 5), n4 = L.ri(1, D3 - 1);
  if (L.gcd(n3, D3) !== 1 || L.gcd(n4, D3) !== 1 || 2*n3 === D3 || 2*n4 === D3) return null;
  var r3 = n3 / D3 >= .5 ? w3 + 1 : w3, r4 = n4 / D3 >= .5 ? w4 + 1 : w4, e = r3 * r4;
  return mc('Which is the best <b>estimate</b> for ' + mxs(w3, n3, D3) + ' × ' + mxs(w4, n4, D3) + '?', 'about ' + e, [
    ['about ' + (r3 + r4), 'That adds the rounded numbers. Multiply them.'],
    ['about ' + (w3 * w4 / 2 > 1 ? Math.round(w3 * w4 / 2) : e * 3), 'Round each number to the nearest whole, then multiply.'],
    ['about ' + e * 10, 'Too big: ' + r3 + ' × ' + r4 + ' = ' + e + '.']],
    'Round to the nearest whole: ' + mxs(w3, n3, D3) + ' ≈ ' + r3 + ' and ' + mxs(w4, n4, D3) + ' ≈ ' + r4 + '. ' + r3 + ' × ' + r4 + ' = <b>' + e + '</b>.');
}
function bsQ(lv, kind){
  var k = kind != null ? kind : L.pick([0, 0, 1, 2]);
  var n = L.ri(6, 40), d = L.pick([2, 3, 4, 5, 6, 8]), nu = L.ri(1, d - 1), less1 = Math.random() < .65;
  if (!less1) nu = d + L.ri(1, d - 1);
  if (L.gcd(nu, d) !== 1) return null;
  var F = f(nu, d);
  if (k === 0) { var op = L.pick(['×', '÷']), bigger = (op === '×') !== less1;
    var why = op === '×' ? (less1 ? 'Multiplying by a fraction less than 1 takes only part of ' + n + ', so the answer is smaller.' : 'Multiplying by a number greater than 1 gives more than ' + n + '.') : (less1 ? 'Dividing by a fraction less than 1 asks how many small pieces fit in ' + n + ': more than ' + n + '.' : 'Dividing by a number greater than 1 splits ' + n + ' into bigger shares, so the answer is smaller.');
    return mc('Without computing: is <b>' + n + ' ' + op + ' ' + F + '</b> greater than or less than ' + n + '?', bigger ? 'greater than ' + n : 'less than ' + n, [
      [bigger ? 'less than ' + n : 'greater than ' + n, 'Is ' + F + ' less than 1 or more than 1? ' + why], ['equal to ' + n, 'Only × 1 or ÷ 1 keeps it the same.']], why); }
  if (k === 1) {
    var opts = L.shuffle([[1, 3, '×'], [5, 4, '×'], [2, 5, '×'], [1, 2, '÷'], [7, 3, '×'], [3, 4, '÷'], [3, 2, '÷']]).slice(0, 5);
    var res = opts.map(function(o){ var lt = o[0] < o[1]; return {t:n + ' ' + o[2] + ' ' + f(o[0], o[1]), small:o[2] === '×' ? lt : !lt}; });
    if (!res.some(function(r){ return r.small; }) || res.every(function(r){ return r.small; })) return null;
    return {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> the expressions that are <b>less than ' + n + '</b>. (No computing needed.)', ch:res.map(function(r){ return r.t; }), a:res.map(function(r, i){ return r.small ? i : -1; }).filter(function(i){ return i >= 0; }),
      why:'× a fraction less than 1 → smaller. × a number greater than 1 → bigger. ÷ a fraction less than 1 → bigger. ÷ a number greater than 1 → smaller.'};
  }
  var a1 = L.ri(1, 3), b1 = a1 + L.ri(1, 3), a2 = L.ri(4, 7), b2 = L.ri(2, a2 - 1);
  return mc('Which is greater: <b>' + n + ' × ' + f(a1, b1) + '</b> or <b>' + n + ' × ' + f(a2, b2) + '</b>?', n + ' × ' + f(a2, b2), [
    [n + ' × ' + f(a1, b1), f(a1, b1) + ' is less than 1, so it shrinks ' + n + '. ' + f(a2, b2) + ' is more than 1, so it grows ' + n + '.'], ['They are equal', 'The two fractions are different sizes.']],
    f(a2, b2) + ' &gt; 1 makes the product greater than ' + n + '; ' + f(a1, b1) + ' &lt; 1 makes it less. So ' + n + ' × ' + f(a2, b2) + ' is greater.');
}
/* Go Further: signed fractions (Grade 7 preview): integer sign rules with fraction sizes. */
function sfs(n, d){ return n === 0 ? '0' : (n < 0 ? '−' : '') + L.frs(Math.abs(n), d); }
function sfQ(lv, kind){
  var k = kind != null ? kind : L.pick([0, 1, 1, 2, 3]), d = L.pick([4, 5, 6, 8]), D = L.pick([2, 3, 4]);
  if (k === 0) { var a = L.ri(1, d - 1), b = L.ri(1, d - 1); if (a === b || L.gcd(a, d) !== 1 || L.gcd(b, d) !== 1) return null;
    var big = Math.min(a, b);
    return mc('Which is <b>greater</b>: ' + sfs(-a, d) + ' or ' + sfs(-b, d) + '?', sfs(-big, d), [[sfs(-Math.max(a, b), d), sfs(-Math.max(a, b), d) + ' is farther left of 0, so it is smaller.'], ['They are equal', 'Different distances from 0.'], [sfs(Math.max(a, b), d), 'Pick one of the two numbers given.']], sfs(-big, d) + ' is closer to 0, so it is greater. With negatives, the smaller fraction size is the greater number.'); }
  if (k === 1) { var p = L.ri(1, d - 1) * (Math.random() < .5 ? -1 : 1), q = L.ri(1, d - 1) * (Math.random() < .5 ? -1 : 1); if (p > 0 && q > 0) p = -p; var r = p + q;
    var raw = function(n){ return (n < 0 ? '−' : '') + f(Math.abs(n), d); }, sub = Math.random() < .4, q2 = sub ? -q : q, shown = raw(p) + (sub ? ' − ' : ' + ') + (q2 < 0 ? '(' + raw(q2) + ')' : raw(q2));
    return mc(shown + ' = ?', sfs(r, d), [[sfs(-r, d) === sfs(r, d) ? sfs(r + 1, d) : sfs(-r, d), 'Right size, wrong sign. Which side has more?'], [sfs(p - q, d) === sfs(r, d) ? sfs(r + 2, d) : sfs(p - q, d), sub ? 'Subtracting a number = adding its opposite.' : 'This is addition: move right for positive, left for negative.'], [sfs(r, 2 * d) === sfs(r, d) ? sfs(r - 1, d) : sfs(r, 2 * d), 'Keep the denominator ' + d + ': only the numerators combine.']],
      (sub ? 'Subtract = add the opposite: ' + raw(p) + ' + ' + (q < 0 ? '(' + raw(q) + ')' : raw(q)) + '. ' : '') + 'Same denominator, so combine the numerators like integers: ' + L.sg(p) + ' + ' + L.par(q) + ' = ' + L.sg(r) + '. Answer <b>' + sfs(r, d) + '</b>.'); }
  if (k === 2) { var n1 = 1, d1 = D, n2 = L.ri(1, 3), d2 = n2 + L.ri(1, 3), neg2 = Math.random() < .5, s1 = -1, s2 = neg2 ? -1 : 1, pr = s1 * s2;
    return mc('(' + sfs(-n1, d1) + ') × ' + (neg2 ? '(' + sfs(-n2, d2) + ')' : sfs(n2, d2)) + ' = ?', sfs(pr * n1 * n2, d1 * d2), [[sfs(-pr * n1 * n2, d1 * d2), (pr > 0 ? 'Two negatives make a positive.' : 'Different signs make a negative.')], [sfs(pr * (n1 * d2 + n2 * d1), d1 * d2), 'That adds. Multiply tops and bottoms.'], [sfs(pr * n1 * d2, d1 * n2), 'That divides (flips). This is multiplication.']],
      'Size: ' + f(n1, d1) + ' × ' + f(n2, d2) + ' = ' + L.frs(n1 * n2, d1 * d2) + '. Sign: ' + (pr > 0 ? 'two negatives → positive.' : 'one negative → negative.') + ' Answer <b>' + sfs(pr * n1 * n2, d1 * d2) + '</b>.'); }
  var t0 = L.pick([1, 2, 3]), drop = t0 + L.ri(1, 3), den = 4, res = t0 * den - drop * den - 1;
  return mc('The temperature was ' + t0 + '°. It fell ' + drop + ' ' + f(1, 4) + '°. What is the temperature now?', sfs(res, den) + '°', [[sfs(-res, den) + '°', 'It ended below 0, so the answer is negative.'], [sfs(res + 2, den) + '°', 'Recheck: ' + t0 + ' − ' + drop + ' ' + f(1, 4) + '.'], [sfs(t0 * den + drop * den + 1, den) + '°', 'It fell: subtract.']],
    t0 + ' − ' + drop + ' ' + f(1, 4) + ' = <b>' + sfs(res, den) + '°</b>. Down to 0 takes ' + t0 + '°, then ' + (drop - t0) + ' ' + f(1, 4) + '° more below 0.');
}
var bridge = {
  title:'Go Further: multiply & divide fractions', tab:'🚀 Go Further',
  intro:'Advanced Unit 6 goes past add and subtract into <b>multiplying and dividing</b> fractions and mixed numbers.',
  lessons:[{id:'u8B1', name:'× and ÷ fractions', icon:'✖️', cards:[
    {t:'Fraction of a fraction', h:'<p>' + f(1,2) + ' × ' + f(3,4) + ' means "half of three-fourths".</p><div class="big">' + f(1,2) + ' × ' + f(3,4) + ' = ' + f(3,8) + '</div><p>Tops times tops, bottoms times bottoms. The answer is smaller than both, because you took part of a part.</p>'},
    {t:'How many fit?', h:'<p>3 ÷ ' + f(1,4) + ' asks: how many quarters fit in 3 wholes? 4 in each whole → <b>12</b>.</p>', trap:'Dividing by a fraction less than 1 makes the answer BIGGER.', tr:bg.fdiv.f()}
  ]},{id:'u8B2', name:'Mixed numbers × ÷', icon:'🔢', cards:[
    {t:'Improper first', h:'<div class="big">2 ' + f(1,2) + ' × 1 ' + f(1,3) + '</div><p>Change both to improper fractions, then multiply.</p>',
     steps:['2 ' + f(1,2) + ' = ' + f(5,2) + ' and 1 ' + f(1,3) + ' = ' + f(4,3) + '.', f(5,2) + ' × ' + f(4,3) + ' = ' + f(20,6) + '.', f(20,6) + ' = 3 ' + f(2,6) + ' = <b>3 ' + f(1,3) + '</b>.'],
     trap:'Multiplying wholes by wholes and parts by parts: 2 × 1 = 2 and ' + f(1,2) + ' × ' + f(1,3) + ' = ' + f(1,6) + ' gives 2 ' + f(1,6) + '. Too small! Make improper fractions first.',
     tr:function(){ return bg.mixmd.f('adv', 0); }},
    {t:'Estimate first', h:'<p>Round each mixed number to the nearest whole before you start: 2 ' + f(1,2) + ' ≈ 3 and 1 ' + f(1,3) + ' ≈ 1, so the answer is <b>about 3</b>.</p><p>3 ' + f(1,3) + ' is close to 3. ✓ The estimate catches big mistakes like 2 ' + f(1,6) + ' or 20.</p>',
     key:'Estimate, then compute, then compare.',
     tries:[function(){ return bg.mixmd.f('adv', 3); }, function(){ return bg.mixmd.f('adv', 1); }]},
    {t:'Dividing mixed numbers', h:'<div class="big">3 ' + f(3,4) + ' ÷ 1 ' + f(1,4) + '</div><p>How many 1 ' + f(1,4) + 's fit in 3 ' + f(3,4) + '?</p>',
     steps:['Improper: ' + f(15,4) + ' ÷ ' + f(5,4) + '.', 'Keep, change, flip: ' + f(15,4) + ' × ' + f(4,5) + ' = ' + f(60,20) + '.', f(60,20) + ' = <b>3</b>. Check: 3 × 1 ' + f(1,4) + ' = 3 ' + f(3,4) + ' ✓'],
     trap:'Flipping the first number. Only the divisor (the second number) flips.',
     tr:function(){ return bg.mixmd.f('adv', 2); }}
  ]},{id:'u8B3', name:'Bigger or smaller?', icon:'↕️', cards:[
    {t:'Predict before you compute', h:L.tbl(['Problem','The fraction is','Answer is'], [['12 × ' + f(3,4),'less than 1','<b>smaller</b> than 12 (9)'],['12 × ' + f(5,4),'more than 1','<b>bigger</b> than 12 (15)'],['12 ÷ ' + f(3,4),'less than 1','<b>bigger</b> than 12 (16)'],['12 ÷ ' + f(3,2),'more than 1','<b>smaller</b> than 12 (8)']]),
     key:'× a fraction less than 1 shrinks. ÷ a fraction less than 1 grows.',
     trap:'"Multiplying always makes bigger." That is only true when you multiply by more than 1.',
     tries:[function(){ return bg.bigsm.f('adv', 0); }, function(){ return bg.bigsm.f('adv', 1); }]},
    {t:'Why ÷ can grow', h:'<p>12 ÷ ' + f(1,2) + ' asks: how many halves fit in 12? Each whole holds 2 halves, so <b>24</b>. Small pieces → many of them.</p>',
     aap:'Scaling: a 10 cm photo printed at ' + f(3,2) + ' times the size is 15 cm; at ' + f(1,2) + ' the size it is 5 cm. The factor tells you bigger or smaller before you multiply.',
     tr:function(){ return bg.bigsm.f('adv', 2); }}
  ]},{id:'u8B4', name:'Go Further: signed fractions', icon:'±', cards:[
    {t:'Fractions below zero', h:'<p>Fractions can be negative too. ' + sfs(-3, 4) + ' sits three-fourths of the way from 0 to −1.</p>', viz:function(){ return (window.V && V.numberLine) ? V.numberLine(-2, 2, [{pos:-1.5, label:'−1 ' + '1/2'}, {pos:-0.75, label:'−3/4'}, {pos:0.5, label:'1/2'}]) : ''; },
     trap:'Thinking ' + sfs(-3, 4) + ' is greater than ' + sfs(-1, 4) + ' because 3 &gt; 1. ' + sfs(-3, 4) + ' is farther left, so it is smaller.',
     tr:function(){ return bg.sfrac.f('adv', 0); }},
    {t:'Same sign rules, fraction sizes', h:'<div class="big">' + sfs(-1, 4) + ' + ' + f(3, 4) + ' = ' + f(2, 4) + ' = ' + f(1, 2) + '</div><div class="big">(' + sfs(-1, 2) + ') × (' + sfs(-2, 3) + ') = ' + f(1, 3) + '</div><p>Work out the size with fraction rules. Decide the sign with integer rules.</p>',
     key:'Add and subtract: move on the number line. Multiply and divide: same signs positive, different signs negative.',
     tries:[function(){ return bg.sfrac.f('adv', 1); }, function(){ return bg.sfrac.f('adv', 2); }, function(){ return bg.sfrac.f('adv', 3); }]}
  ]}],
  gens:bg, repIds:['fmul','fdiv','mixmd','bigsm','sfrac'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u8', lessons:lessons, test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u8', num: 8, emoji: '🧩', title: 'Fraction Workshop',
  blurb: 'Unlike denominators, mixed numbers, and a whole times a fraction.', sol: ['5.CE.2'], dates: ['2027-03-01', '2027-03-26'], color: '#9b2226'
}, window.V2, { gUnit: 8, coreStds: ['5.CE.2'] });

