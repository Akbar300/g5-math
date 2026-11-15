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
  {t:'Wholes with wholes, parts with parts', h:'<div class="big">2 ' + f(3,4) + ' + 1 ' + f(1,2) + '</div>', steps:['<p>Wholes: 2 + 1 = 3.</p>', '<p>Parts: ' + f(3,4) + ' + ' + f(2,4) + ' = ' + f(5,4) + ' = 1 ' + f(1,4) + '.</p>', '<p>Total: 3 + 1 ' + f(1,4) + ' = <b>4 ' + f(1,4) + '</b>.</p>'], trap:'Regrouping with 10 instead of with the denominator. ' + f(5,4) + ' is 1 ' + f(1,4) + ', not 0 ' + f(15,10) + '.'},
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
  }}
};
var bridge = {
  title:'Go Further: multiply & divide fractions', tab:'🚀 Go Further',
  intro:'Advanced Unit 6 goes past add and subtract into <b>multiplying and dividing</b> fractions and mixed numbers.',
  lessons:[{id:'u8B1', name:'× and ÷ fractions', icon:'✖️', cards:[
    {t:'Fraction of a fraction', h:'<p>' + f(1,2) + ' × ' + f(3,4) + ' means "half of three-fourths".</p><div class="big">' + f(1,2) + ' × ' + f(3,4) + ' = ' + f(3,8) + '</div><p>Tops times tops, bottoms times bottoms. The answer is smaller than both, because you took part of a part.</p>'},
    {t:'How many fit?', h:'<p>3 ÷ ' + f(1,4) + ' asks: how many quarters fit in 3 wholes? 4 in each whole → <b>12</b>.</p>', trap:'Dividing by a fraction less than 1 makes the answer BIGGER.', tr:bg.fdiv.f()}
  ]}],
  gens:bg, repIds:['fmul','fdiv'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u8', lessons:lessons, test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u8', num: 8, emoji: '🧩', title: 'Fraction Workshop',
  blurb: 'Unlike denominators, mixed numbers, and a whole times a fraction.', sol: ['5.CE.2'], dates: ['2027-03-01', '2027-03-26'], color: '#9b2226'
}, window.V2, { gUnit: 8, coreStds: ['5.CE.2'] });

