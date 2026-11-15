/* Unit 2: Pattern & Number Lab — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 2, Algebraic Reasoning (5.CE.4, 5.NS.2, 5.PFA.1, 5.PFA.2) */
(function(){
var L = V2L, f = L.fr, mc = L.mc;
function isP(n){ if(n < 2) return false; for(var i = 2; i*i <= n; i++) if(n % i === 0) return false; return true; }
var TRAPS = [9,15,21,25,27,33,35,39,45,49,51,57,63,69,77,81,87,91];
var gens = {
  oo: {name:'Order of operations', f:function(lv){
    var a = L.ri(2,12), b = L.ri(2,9), c = L.ri(2,9), d = L.ri(2,9), k = L.pick([0,1,2,3]);
    if(k === 0){ var v = a + b*c; return Object.assign(mc(a + ' + ' + b + ' × ' + c + ' = ?', String(v), [[String((a+b)*c), 'Multiply BEFORE you add, even though + comes first.'], [String(a+b+c), 'There is a multiplication here.'], [String(v+b), 'Recheck ' + b + ' × ' + c + '.']], b + ' × ' + c + ' = ' + b*c + ', then ' + a + ' + ' + b*c + ' = ' + v + '.'), {nocalc:true}); }
    if(k === 1){ var p = b*c; var w = p / c * d; return Object.assign(mc(p + ' ÷ ' + c + ' × ' + d + ' = ?', String(w), [[String(Number.isInteger(p/(c*d)) ? p/(c*d) : b*d + c), 'Multiply and divide go LEFT TO RIGHT. Divide first here.'], [String(w + d), 'Recheck each step.'], [String(p + c + d), 'Those are not additions.']], 'Left to right: ' + p + ' ÷ ' + c + ' = ' + b + ', then × ' + d + ' = ' + w + '.'), {nocalc:true}); }
    if(k === 2){ var z = (a + b) * c - d; if(z < 0) return null; return Object.assign(mc('(' + a + ' + ' + b + ') × ' + c + ' − ' + d + ' = ?', String(z), [[String(a + b*c - d), 'Parentheses first: add ' + a + ' + ' + b + '.'], [String((a+b)*(c-d) >= 0 ? (a+b)*(c-d) : z+7), 'Multiply before you subtract.'], [String(z + 2*d), 'Subtract ' + d + ' at the end.']], '(' + (a+b) + ') × ' + c + ' = ' + (a+b)*c + ', minus ' + d + ' = ' + z + '.'), {nocalc:true}); }
    var e = a*b + c*d; return Object.assign(mc(a + ' × ' + b + ' + ' + c + ' × ' + d + ' = ?', String(e), [[String((a*b + c)*d), 'Both multiplications come before the addition.'], [String(a*(b+c)*d), 'There are no parentheses around ' + b + ' + ' + c + '.'], [String(e - 1), 'Recheck the facts.']], a*b + ' + ' + c*d + ' = ' + e + '.'), {nocalc:true});
  }},
  prime: {name:'Prime or composite', f:function(lv){
    var ps = [], cs = [], used = {};
    while(ps.length < 2){ var x = L.ri(2, 97); if(isP(x) && !used[x]){ used[x] = 1; ps.push(x); } }
    while(cs.length < 3){ var y = Math.random() < .7 ? L.pick(TRAPS) : L.ri(4, 99); if(!isP(y) && y > 1 && !used[y]){ used[y] = 1; cs.push(y); } }
    var ch = L.shuffle(ps.concat(cs));
    return {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> the prime numbers.', ch:ch.map(String), a:ch.map(function(v, i){ return isP(v) ? i : -1; }).filter(function(i){ return i >= 0; }), why:cs.map(function(c){ for(var i = 2; i < c; i++) if(c % i === 0) return c + ' = ' + i + ' × ' + (c/i); }).join(', ') + ', so those are composite. Odd does not mean prime!'};
  }},
  pat: {name:'Patterns', f:function(lv){
    var s = L.ri(1, 20), d = L.ri(2, 12), op = L.pick(['+','×']);
    if(op === '×'){ s = L.ri(1,4); d = L.pick([2,3]); }
    var seq = [s]; for(var i = 1; i < 6; i++) seq.push(op === '+' ? seq[i-1] + d : seq[i-1] * d);
    var ask = lv === 'adv' ? 6 : 5; var nth = op === '+' ? s + d*(ask) : seq[seq.length-1]*d;
    if(lv === 'adv'){ var t7 = op === '+' ? s + d*6 : s*Math.pow(d,6); return {type:'num', q:'The pattern ' + seq.slice(0,4).join(', ') + ', … continues the same way. What is the <b>7th</b> term?', a:t7, why:'The rule is ' + op + ' ' + d + '. Keep going: ' + (op === '+' ? Array.from({length:7}, function(_, i){ return s + d*i; }) : Array.from({length:7}, function(_, i){ return s*Math.pow(d,i); })).join(', ') + '.'}; }
    return mc('What is the rule for ' + seq.slice(0,5).join(', ') + ', …?', op + ' ' + d, [[(op === '+' ? '×' : '+') + ' ' + d, 'Check it on every step, not just the first one.'], [op + ' ' + (d+1), 'Check the jump between terms.'], ['+ ' + (seq[1] + seq[0]), 'Find the change from one term to the next.']], 'Each term ' + (op === '+' ? 'adds ' : 'multiplies by ') + d + '.');
  }},
  io: {name:'Input / output', f:function(lv){
    var op = L.pick(['+','−','×']), k = op === '×' ? L.ri(2,9) : L.ri(3,25), ins = L.shuffle([1,2,3,4,5,6,7,8,9,10,11,12]).slice(0,4).sort(function(a,b){return a-b;});
    function F(x){ return op === '+' ? x + k : op === '−' ? x - k : x * k; }
    if(op === '−') ins = ins.map(function(x){ return x + k; });
    var hideIn = Math.random() < .5, row = ins.map(F), hi = 3;
    var tIn = ins.map(function(x, i){ return i === hi && hideIn ? '?' : x; }), tOut = row.map(function(x, i){ return i === hi && !hideIn ? '?' : x; });
    return {type:'num', q:'The rule is the same for every pair. Find the missing number.' + L.tbl(['Input'].concat(tIn), [['Output'].concat(tOut)]), a:hideIn ? ins[hi] : row[hi], why:'The rule is ' + op + ' ' + k + '. ' + (hideIn ? 'Work backward: undo the rule on ' + row[hi] + '.' : 'Apply it to ' + ins[hi] + '.')};
  }},
  eqn: {name:'Story → equation', f:function(lv){
    var a = L.ri(5, 40), b = L.ri(3, 30), T = L.pick(['stickers','cards','points','coins']);
    return mc('Ana had some ' + T + '. She got ' + b + ' more and now has ' + (a+b) + '. Which equation finds how many she had at first (n)?', 'n + ' + b + ' = ' + (a+b), [['n − ' + b + ' = ' + (a+b), 'She GOT more, so it is addition.'], [b + ' × n = ' + (a+b), 'Nothing is being multiplied here.'], ['n = ' + (a+b) + ' + ' + b, 'That adds the ' + b + ' twice.']], 'Start (n) + ' + b + ' more = ' + (a+b) + ' total. So n = ' + a + '.');
  }}
};
var lessons = [
 {id:'u2L1', name:'Order of operations', icon:'➗', cards:[
  {t:'The order', h:'<div class="big">( ) → × ÷ → + −</div><p>Parentheses first. Then multiply and divide <b>left to right</b>. Then add and subtract <b>left to right</b>.</p>', trap:'"Multiply always before divide" is WRONG. They are partners: go left to right.'},
  {t:'Left to right, step by step', h:'', steps:['<div class="big">24 ÷ 4 × 2 + 3</div>', '<div class="big">6 × 2 + 3</div><p>÷ comes first reading left to right.</p>', '<div class="big">12 + 3 = 15</div>'], tr:gens.oo.f()}
 ]},
 {id:'u2L2', name:'Prime & composite', icon:'🔢', cards:[
  {t:'Two kinds of numbers', h:'<p>A <b>prime</b> has exactly 2 factors: 1 and itself (7: 1, 7). A <b>composite</b> has more (12: 1, 2, 3, 4, 6, 12). The number <b>1</b> is neither.</p>', trap:'Odd does not mean prime. 9, 15, 21, 25, 27, 35, 45, 49 and 51 are all composite.'},
  {t:'Quick tests', h:L.tbl(['Test','Means'], [['Ends in 0, 2, 4, 6, 8','divisible by 2'],['Digits add to a multiple of 3','divisible by 3'],['Ends in 0 or 5','divisible by 5']]) + '<p>51: 5 + 1 = 6, so 3 divides it: 51 = 3 × 17. Composite!</p>', tr:gens.prime.f()}
 ]},
 {id:'u2L3', name:'Patterns & machines', icon:'📈', cards:[
  {t:'Find the rule, test it twice', h:'<p>3, 7, 11, 15, … Each term adds 4. Check every jump, not just the first one.</p><p>The SOL also asks for terms further on: the 7th term is 3 + 4 × 6 = 27.</p>', key:'Term number n: start + jump × (n − 1).'},
  {t:'Missing input', h:L.tbl(['In','2','5','?'], [['Out','8','20','36']]) + '<p>Rule: × 4. To find a missing INPUT, undo the rule: 36 ÷ 4 = <b>9</b>.</p>', trap:'Applying the rule forward to the output (36 × 4) when the INPUT is missing.', tr:gens.io.f()}
 ]},
 {id:'u2L4', name:'Variables & equations', icon:'🔤', cards:[
  {t:'Expression vs equation', h:L.tbl(['Expression','Equation'], [['n + 7','n + 7 = 12'],['no equals sign','has an equals sign']]) + '<p>A variable is a letter that stands for an unknown number.</p>'},
  {t:'Story to equation', h:'<p>"Tom read some pages, then 15 more. He read 42 in all."</p><div class="big">p + 15 = 42</div><p>Then solve with the opposite operation: p = 42 − 15 = 27.</p>', tr:gens.eqn.f()}
 ]}
];
var test = [
 {type:'ms', fmt:'SELECT ALL', nocalc:true, q:'Select <b>all</b> composite numbers.', ch:['51', '53', '57', '59', '91'], a:[0,2,4], why:'51 = 3 × 17, 57 = 3 × 19, 91 = 7 × 13. 53 and 59 are prime.'},
 Object.assign(mc('Which is the FIRST step to simplify 36 ÷ 4 × 3 − 2?', '36 ÷ 4', [['4 × 3', 'Multiply and divide go left to right. ÷ comes first here.'], ['3 − 2', 'Subtraction comes last.']], 'Left to right: 36 ÷ 4 = 9, then 9 × 3 = 27, then 27 − 2 = 25.'), {nocalc:true}),
 {type:'num', fmt:'TYPE IN', nocalc:true, q:'Simplify: 50 − (6 + 4) × 3', a:20, why:'(10) × 3 = 30. 50 − 30 = 20.'},
 {type:'num', fmt:'TYPE IN', q:'The pattern 5, 12, 19, 26, … continues. What is the 9th term?', a:61, why:'+7 each time: 5 + 7 × 8 = 61.'},
 mc('Which situation matches 4 × n = 36?', 'Four friends share 36 crackers equally. How many does each get?', [['A box had 36 crackers and 4 were eaten.', 'That is 36 − 4.'], ['Ben has 4 crackers and gets 36 more.', 'That is 4 + 36.']], '4 groups of n make 36.')
];
/* bridge: Advanced Unit 2, Integers and Inequalities (LCM, GCF, inequalities) */
var bg = {
  gcf: {name:'Greatest common factor', f:function(lv){
    var g = L.pick([2,3,4,5,6,8,9,12]), x = L.ri(2,7), y = L.ri(2,7); if(L.gcd(x,y) !== 1) return null; if(x === y) return null;
    var a = g*x, b = g*y;
    return mc('What is the greatest common factor (GCF) of ' + a + ' and ' + b + '?', String(g), [[String(a*b/g), 'That is the least common MULTIPLE.'], [String(g > 2 ? g/ (g%2 === 0 ? 2 : g) : 1), 'That is a common factor, but not the greatest.'], [String(Math.min(a,b)), Math.min(a,b) + ' is not a factor of ' + Math.max(a,b) + '.']], 'Factors of ' + a + ' and ' + b + ' in common: the biggest is ' + g + '.');
  }},
  lcm: {name:'Least common multiple', f:function(lv){
    var a = L.ri(2,12), b = L.ri(2,12); if(a === b) return null; var m = L.lcm(a,b);
    return mc('What is the least common multiple (LCM) of ' + a + ' and ' + b + '?', String(m), [[String(a*b === m ? m*2 : a*b), a*b === m ? 'That is a common multiple, but not the least.' : 'Multiplying always gives a common multiple, but not always the LEAST one.'], [String(L.gcd(a,b)), 'That is the greatest common FACTOR.'], [String(a+b), 'Multiples, not sums.']], 'List multiples: the first one both share is ' + m + '.');
  }},
  ineq: {name:'Inequality solutions', f:function(lv){
    var k = L.ri(-3, 9), op = L.pick(['&gt;','&lt;','≥','≤']), vals = L.shuffle([k-2, k-1, k, k+1, k+3]);
    function ok(v){ return op === '&gt;' ? v > k : op === '&lt;' ? v < k : op === '≥' ? v >= k : v <= k; }
    return {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> values of x that make <b>x ' + op + ' ' + L.sg(k) + '</b> true.', ch:vals.map(L.sg), a:vals.map(function(v, i){ return ok(v) ? i : -1; }).filter(function(i){ return i >= 0; }), why:(op === '≥' || op === '≤' ? 'The line under the symbol means ' + L.sg(k) + ' itself counts (closed circle).' : L.sg(k) + ' itself does NOT count (open circle).') + ' Test each value.'};
  }}
};
var bridge = {
  title:'Go Further: factors, multiples & inequalities', tab:'🚀 Go Further',
  intro:'You already know prime and composite. Advanced Unit 2 adds <b>GCF</b>, <b>LCM</b> and <b>inequalities</b>, which you will use in fractions all year (LCM = common denominator!).',
  lessons:[{id:'u2B1', name:'GCF & LCM', icon:'🧩', cards:[
    {t:'Greatest common factor', h:'<p>Factors of 18: 1, 2, 3, <b>6</b>, 9, 18<br>Factors of 24: 1, 2, 3, 4, <b>6</b>, 8, 12, 24</p><p>The biggest shared factor is <b>6</b>. Use the GCF to simplify: ' + f(18,24) + ' = ' + f(3,4) + '.</p>'},
    {t:'Least common multiple', h:'<p>Multiples of 4: 4, 8, <b>12</b>, 16…<br>Multiples of 6: 6, <b>12</b>, 18…</p><p>LCM = 12. That is the common denominator for ' + f(1,4) + ' + ' + f(1,6) + '.</p>', trap:'4 × 6 = 24 is a common multiple, but not the LEAST.', tr:bg.lcm.f()}
  ]},{id:'u2B2', name:'Inequalities', icon:'📊', cards:[
    {t:'More than one answer', h:'<p><b>x &gt; 3</b> means "x is greater than 3". 4, 5, 10, 3.5 all work, but 3 does not.</p>' + L.tbl(['Symbol','Read it','Circle on graph'], [['&gt;','greater than','open ○'],['&lt;','less than','open ○'],['≥','greater than or equal','closed ●'],['≤','less than or equal','closed ●']])},
    {t:'Test the values', h:'<p>Plug each number in. Is the statement true?</p>', tr:bg.ineq.f()}
  ]}],
  gens:bg, repIds:['gcf','lcm','ineq'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u2', lessons:lessons, gens:gens, repIds:['oo','prime','pat','io','eqn'], test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u2', num: 2, emoji: '🔢', title: 'Pattern & Number Lab',
  blurb: 'Order of operations, primes, patterns, and variables.', sol: ['5.CE.4', '5.NS.2', '5.PFA.1', '5.PFA.2'], dates: ['2026-09-14', '2026-10-02'], color: '#2f80ed'
}, window.V2, { gUnit: 2, coreStds: ['5.CE.4', '5.NS.2', '5.PFA.1', '5.PFA.2'] });

