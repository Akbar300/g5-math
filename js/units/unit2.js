/* Unit 2: Pattern & Number Lab — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 2, Algebraic Reasoning (5.CE.4, 5.NS.2, 5.PFA.1, 5.PFA.2) */
(function(){
var L = V2L, f = L.fr, mc = L.mc;
function isP(n){ if(n < 2) return false; for(var i = 2; i*i <= n; i++) if(n % i === 0) return false; return true; }
/* Two-step equation picture: build x forward (top), undo backward (bottom). Static SVG, theme colors. */
function undoSVG(a, b, op, c, x){
  var un = op === '+' ? '−' : '+', T = function(x0, y, s, sz, w){ return '<text x="' + x0 + '" y="' + y + '" text-anchor="middle" font-size="' + (sz || 18) + '" font-weight="' + (w || 700) + '" fill="currentColor">' + s + '</text>'; };
  var box = function(cx, y, s, hi){ return '<rect x="' + (cx - 32) + '" y="' + (y - 20) + '" width="64" height="40" rx="10" fill="' + (hi ? 'var(--ic-soft)' : 'var(--card)') + '" stroke="' + (hi ? 'var(--ic)' : 'currentColor') + '" stroke-width="2.5"/>' + T(cx, y + 6, s); };
  var ball = function(cx, y, s, hi){ return '<circle cx="' + cx + '" cy="' + y + '" r="19" fill="' + (hi ? 'var(--ic)' : 'var(--card)') + '" stroke="' + (hi ? 'var(--ic)' : 'currentColor') + '" stroke-width="2.5"/>' + (hi ? '<text x="' + cx + '" y="' + (y + 6) + '" text-anchor="middle" font-size="18" font-weight="700" fill="var(--card)">' + s + '</text>' : T(cx, y + 6, s)); };
  var arr = function(x1, x2, y, col){ var d = x2 > x1 ? -7 : 7; return '<path d="M' + x1 + ' ' + y + 'H' + x2 + 'M' + (x2 + d) + ' ' + (y - 6) + 'L' + x2 + ' ' + y + 'L' + (x2 + d) + ' ' + (y + 6) + '" fill="none" stroke="' + col + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'; };
  var top = 52, bot = 132;
  return '<svg viewBox="0 0 340 170" role="img" aria-label="Build x: times ' + a + ', then ' + op + ' ' + b + ', makes ' + c + '. Undo backward: ' + un + ' ' + b + ', then divide by ' + a + ', gives ' + x + '." style="width:100%;max-width:420px;display:block;margin:0 auto">' +
    T(14, 18, 'Build it →', 14, 600).replace('text-anchor="middle"', 'text-anchor="start"') +
    '<g opacity=".6">' + ball(32, top, 'x') + arr(52, 74, top, 'currentColor') + box(112, top, '× ' + a) + arr(146, 176, top, 'currentColor') + box(212, top, op + ' ' + b) + arr(246, 284, top, 'currentColor') + ball(306, top, c) + '</g>' +
    T(326, 98, '← Undo it backward', 14, 700).replace('text-anchor="middle"', 'text-anchor="end"').replace('fill="currentColor"', 'fill="var(--ic)"') +
    ball(32, bot, x, true) + arr(74, 54, bot, 'var(--ic)') + box(112, bot, '÷ ' + a, true) + arr(176, 148, bot, 'var(--ic)') + box(212, bot, un + ' ' + b, true) + arr(284, 248, bot, 'var(--ic)') + ball(306, bot, c) +
    '</svg>';
}
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
  {t:'Pattern families', h:'<p>A pattern grows or shrinks by one rule. The rule is <b>add</b>, <b>subtract</b>, <b>multiply</b> or <b>divide</b>.</p>'},
  {t:'Function machines', h:'<p>A function machine follows <b>one rule</b> for every number you put in. Put numbers in, watch what comes out, and crack the rule.</p>'},
  {t:'Fractions and decimals in patterns', h:'<p>Patterns can use fractions and decimals too. With like denominators, only the numerators change. With decimals, line up the decimal points.</p>'},
  {t:'Patterns in stories', h:'<p>A pattern story gives a <b>start</b> and a <b>change each time</b>. Read carefully: the start is before the first jump.</p>'},
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
  }},
  vocab: {name:'Algebra vocabulary', f:function(lv){
    var a = L.ri(2, 9), b = L.ri(1, 15), v = L.pick(['x','y','n','m']), c = a*L.ri(2, 9) + b;
    var e = a + v + ' + ' + b, k = L.pick(['coef','const','terms','ms','ms']);
    if (k === 'coef') return mc('In <b>' + e + '</b>, what is the <b>coefficient</b>?', String(a), [[String(b), b + ' is the constant (a number alone).'], [v, v + ' is the variable.'], [a + v, a + v + ' is a whole term. The coefficient is just the number in front.']], 'The coefficient is the number that multiplies the variable: ' + a + '.');
    if (k === 'const') return mc('In <b>' + e + '</b>, what is the <b>constant</b>?', String(b), [[String(a), a + ' is the coefficient: it multiplies ' + v + '.'], [v, v + ' is the variable.'], [String(a + b), 'A constant is one term with no variable. Do not add the parts.']], 'The constant is the term with no variable: ' + b + '.');
    if (k === 'terms') { var three = Math.random() < .5, ex = three ? a + v + ' + ' + b + ' − ' + L.ri(1, 9) + v : e;
      return mc('How many <b>terms</b> are in <b>' + ex + '</b>?', three ? '3' : '2', [[three ? '5' : '3', 'Terms are the pieces between + and − signs. ' + a + v + ' is ONE term.'], ['1', 'The + sign separates terms.'], [three ? '2' : '4', 'Count the pieces between the + and − signs.']], 'Terms are separated by + and − signs: ' + (three ? '3 terms.' : a + v + ' and ' + b + ', 2 terms.')); }
    if (b === a) b = a + 1;
    var W = L.pick([['constant', [String(b), String(c)]], ['term', [a + v, String(b), String(c)]]]);
    var ch = L.shuffle([a + v, String(a), v, String(b), String(c)]);
    return {type:'ms', fmt:'SELECT ALL', q:'In <b>' + e + ' = ' + c + '</b>, select <b>all</b> the <b>' + W[0] + 's</b>.', ch:ch, a:ch.map(function(t, i){ return W[1].indexOf(t) >= 0 ? i : -1; }).filter(function(i){ return i >= 0; }),
      why:'Variable: ' + v + '. Coefficient: ' + a + ' (it multiplies ' + v + '). Constants: ' + b + ' and ' + c + ' (numbers alone). Terms: ' + a + v + ', ' + b + ' and ' + c + '.'};
  }},
  two: {name:'Solve two-step equations', f:function(lv, kind){
    for (var tr = 0; tr < 6; tr++) { var it = twoStep(lv, kind); if (it) return it; } return null;
  }}
};
function twoStep(lv, kind){
  {
    /* a·x ± b = c with a whole-number answer. kind forces one question style (Learn cards). */
    var a = L.ri(2, 9), x = L.ri(2, 12), b = L.ri(1, 20), op = Math.random() < .6 ? '+' : '−';
    var c = op === '+' ? a*x + b : a*x - b; if (c <= 0) { op = '+'; c = a*x + b; }
    var E = a + 'x ' + op + ' ' + b + ' = ' + c, un = op === '+' ? '−' : '+', mid = a*x;
    var undo = 'Undo in reverse order. ' + c + ' ' + un + ' ' + b + ' = ' + mid + ', so ' + a + 'x = ' + mid + '. Then ' + mid + ' ÷ ' + a + ' = <b>' + x + '</b>. Check: ' + a + ' × ' + x + ' ' + op + ' ' + b + ' = ' + c + ' ✓';
    var k = kind != null ? kind : L.pick([0, 0, 1, 1, 2, 3, 4, 4, 5, 6]);
    if (k === 0) return {type:'num', fmt:'TYPE IN', q:'Solve for x: <b>' + E + '</b>', a:x, why:undo};
    if (k === 1) {
      var divFirst = op === '+' ? c/a - b : c/a + b, sameOp = op === '+' ? (c + b)/a : (c - b)/a;
      var nice = function(v){ return v > 0 && Math.abs(v*10 - Math.round(v*10)) < 1e-9; };
      var cand = [];
      if (nice(divFirst)) cand.push([L.num(divFirst), 'You divided first. Undo the ' + op + ' ' + b + ' first: it was the last step done to x.']);
      cand.push([String(mid), 'That is ' + a + 'x. One more step: divide by ' + a + '.']);
      if (nice(sameOp)) cand.push([L.num(sameOp), (op === '+' ? 'You added ' + b + '. Undo + ' + b + ' with − ' + b + '.' : 'You subtracted ' + b + '. Undo − ' + b + ' with + ' + b + '.')]);
      [x + 1, x + 2, x - 1].forEach(function(w){ if (w > 0) cand.push([String(w), 'Check it: ' + a + ' × ' + w + ' ' + op + ' ' + b + ' = ' + (op === '+' ? a*w + b : a*w - b) + ', not ' + c + '.']); });
      return mc('What value of x makes <b>' + E + '</b> true?', String(x), cand, undo);
    }
    if (k === 2) {
      var right = (op === '+' ? 'Subtract ' : 'Add ') + b + (op === '+' ? ' from' : ' to') + ' both sides';
      return mc('What is the <b>first</b> step to solve <b>' + E + '</b>?', right, [
        ['Divide both sides by ' + a, 'Undo the last thing done to x first. The ' + op + ' ' + b + ' happened last, so it comes off first.'],
        [(op === '+' ? 'Add ' : 'Subtract ') + b + (op === '+' ? ' to' : ' from') + ' both sides', 'Use the opposite: ' + op + ' ' + b + ' is undone by ' + un + ' ' + b + '.'],
        ['Subtract ' + a + ' from both sides', a + 'x means ' + a + ' times x. Undo it by dividing, after the ' + op + ' ' + b + ' is gone.']],
        'x was multiplied by ' + a + ', then ' + b + ' was ' + (op === '+' ? 'added' : 'subtracted') + '. Undo the last step first: ' + right.toLowerCase() + ', then divide by ' + a + '.');
    }
    if (k === 3) {
      var rows = [], seen = {}, g = 0;
      while (rows.length < 5 && g++ < 60) {
        var p = L.ri(2, 8), q = L.ri(1, 15), o = L.pick(['+', '−']), ok = rows.length < 2 || Math.random() < .35, cc;
        if (ok) cc = o === '+' ? p*x + q : p*x - q;
        else cc = L.pick([o === '+' ? p*(x+1) + q : p*(x+1) - q, o === '+' ? p*(x + q) : p*(x - q), o === '+' ? p*x - q : p*x + q]);
        if (cc <= 0) continue;
        var t = p + 'x ' + o + ' ' + q + ' = ' + cc; if (seen[t]) continue; seen[t] = 1;
        var val = o === '+' ? p*x + q : p*x - q;
        rows.push({t:t, ok:val === cc, chk:p + ' × ' + x + ' ' + o + ' ' + q + ' = ' + val + (val === cc ? ' ✓' : ', not ' + cc)});
      }
      if (rows.length < 5 || rows.every(function(r){ return r.ok; }) || !rows.some(function(r){ return r.ok; })) return null;
      rows = L.shuffle(rows);
      return {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> the equations that are true when <b>x = ' + x + '</b>.', ch:rows.map(function(r){ return r.t; }), a:rows.map(function(r, i){ return r.ok ? i : -1; }).filter(function(i){ return i >= 0; }), why:'Put ' + x + ' in for x and work it out: ' + rows.map(function(r){ return r.chk; }).join('; ') + '.'};
    }
    if (k === 4) {
      var S = L.pick([
        ['Maya buys some packs of stickers for $' + a + ' each and one poster for $' + b + '. She spends $' + (a*x + b) + ' in all. How many packs did she buy?', '+', 'packs'],
        ['A bike rental costs $' + b + ' to start plus $' + a + ' for each hour. Leo paid $' + (a*x + b) + '. How many hours did he ride?', '+', 'hours'],
        ['A class sets up ' + a + ' rows of chairs with the same number in each row, plus ' + b + ' extra chairs at the front. There are ' + (a*x + b) + ' chairs in all. How many chairs are in each row?', '+', 'chairs'],
        ['Tickets cost $' + a + ' each. With a $' + b + ' coupon, a family paid $' + (a*x - b) + '. How many tickets did they buy?', '−', 'tickets']]);
      if (S[1] === '−' && a*x - b <= 0) S = ['Maya buys some packs of stickers for $' + a + ' each and one poster for $' + b + '. She spends $' + (a*x + b) + ' in all. How many packs did she buy?', '+', 'packs'];
      var cc2 = S[1] === '+' ? a*x + b : a*x - b;
      return {type:'num', fmt:'TYPE IN', q:S[0], a:x, why:'Write it: <b>' + a + 'n ' + S[1] + ' ' + b + ' = ' + cc2 + '</b>. Undo in reverse order: ' + cc2 + ' ' + (S[1] === '+' ? '−' : '+') + ' ' + b + ' = ' + a*x + ', then ' + a*x + ' ÷ ' + a + ' = <b>' + x + '</b> ' + S[2] + '.'};
    }
    if (k === 5) {
      var d = L.pick([2, 3, 4, 5]), y = d * L.ri(2, 9), bb = L.ri(1, 12), cc3 = y/d + bb;
      return {type:'num', fmt:'TYPE IN', q:'Solve for x: <b>' + f('x', d) + ' + ' + bb + ' = ' + cc3 + '</b>', a:y, why:'Undo + ' + bb + ' first: ' + cc3 + ' − ' + bb + ' = ' + (cc3 - bb) + '. ' + f('x', d) + ' means x ÷ ' + d + ', so undo it by multiplying: ' + (cc3 - bb) + ' × ' + d + ' = <b>' + y + '</b>.'};
    }
    var tryX = Math.random() < .5 ? x : x + L.pick([1, 2, -1]), v = op === '+' ? a*tryX + b : a*tryX - b, yes = v === c;
    var forgot = op === '+' ? tryX + b : tryX - b;
    var wr = yes ? [
      ['No: ' + tryX + ' ' + op + ' ' + b + ' = ' + forgot + ', not ' + c, a + 'x means ' + a + ' × x. Multiply before you ' + (op === '+' ? 'add' : 'subtract') + '.'],
      ['No: you have to solve it first to know', 'You can always check: put the number in for x.'],
      ['No: the answer is x = ' + (x + 1), 'Put ' + tryX + ' in for x and work it out: it gives ' + c + ', so it works.']
    ] : [
      ['Yes: ' + a + ' × ' + tryX + ' ' + op + ' ' + b + ' = ' + c, 'Work it out: ' + a + ' × ' + tryX + ' = ' + a*tryX + ', and ' + a*tryX + ' ' + op + ' ' + b + ' = ' + v + '.'],
      ['Yes: it is close enough', 'An equation needs both sides exactly equal.'],
      ['You cannot tell without solving', 'You can always check: put the number in for x.']
    ];
    return mc('Ana says x = ' + tryX + ' solves <b>' + E + '</b>. Is she right?', yes ? 'Yes: ' + a + ' × ' + tryX + ' ' + op + ' ' + b + ' = ' + c : 'No: ' + a + ' × ' + tryX + ' ' + op + ' ' + b + ' = ' + v + ', not ' + c, wr,
      'Check by substituting: ' + a + ' × ' + tryX + ' = ' + a*tryX + ', then ' + a*tryX + ' ' + op + ' ' + b + ' = ' + v + '. ' + (yes ? 'That matches ' + c + ', so yes.' : 'That is not ' + c + ', so no. The answer is x = ' + x + '.'));
  }
}
var bridge = {
  title:'Go Further: factors, multiples & inequalities', tab:'🚀 Go Further',
  intro:'You already know prime and composite. Advanced Unit 2 adds <b>GCF</b>, <b>LCM</b>, <b>inequalities</b> and <b>two-step equations</b>, which you will use in fractions all year (LCM = common denominator!).',
  lessons:[{id:'u2B1', name:'GCF & LCM', icon:'🧩', cards:[
    {t:'Greatest common factor', h:'<p>Factors of 18: 1, 2, 3, <b>6</b>, 9, 18<br>Factors of 24: 1, 2, 3, 4, <b>6</b>, 8, 12, 24</p><p>The biggest shared factor is <b>6</b>. Use the GCF to simplify: ' + f(18,24) + ' = ' + f(3,4) + '.</p>'},
    {t:'Least common multiple', h:'<p>Multiples of 4: 4, 8, <b>12</b>, 16…<br>Multiples of 6: 6, <b>12</b>, 18…</p><p>LCM = 12. That is the common denominator for ' + f(1,4) + ' + ' + f(1,6) + '.</p>', trap:'4 × 6 = 24 is a common multiple, but not the LEAST.', tr:bg.lcm.f()}
  ]},{id:'u2B2', name:'Inequalities', icon:'📊', cards:[
    {t:'More than one answer', h:'<p><b>x &gt; 3</b> means "x is greater than 3". 4, 5, 10, 3.5 all work, but 3 does not.</p>' + L.tbl(['Symbol','Read it','Circle on graph'], [['&gt;','greater than','open ○'],['&lt;','less than','open ○'],['≥','greater than or equal','closed ●'],['≤','less than or equal','closed ●']])},
    {t:'Test the values', h:'<p>Plug each number in. Is the statement true?</p>', tr:bg.ineq.f()}
  ]},{id:'u2B3', name:'Two-step rules & jump ahead', icon:'🚀', cards:[
    {t:'Two-step machines', h:'<p>Some machines do <b>two things</b>: multiply n first, then add or subtract. <b>2n − 1</b> with n = 3 is 6 − 1 = 5.</p><div class="big">The number in front of n is the jump.</div>', trap:'Doing the add or subtract first. In 2n + 1, multiply n by 2 first, then add 1.'},
    {t:'Jump ahead with n', h:'<p>To find the <b>10th</b> or <b>20th</b> number, do not list them all. Put the term number in for n.</p><div class="big">3n − 1: the 10th term is 3 × 10 − 1 = 29</div>', trap:'Using n = 9 or 11 by mistake. The 10th term uses n = 10.'},
    {t:'Patterns that grow faster', h:'<p>Some patterns have <b>growing jumps</b> (1, 2, 4, 7, 11, …: +1, +2, +3, +4) or double each time (1, 2, 4, 8, …). The squares (1, 4, 9, 16, …) grow faster still.</p>'}
  ]},{id:'u2B4', name:'Two-step equations', icon:'⚖️', cards:[
    {t:'Words of algebra', h:'<div class="big">3x + 7 = 22</div>' + L.tbl(['Word','Here','Means'], [['variable','x','the unknown number'],['coefficient','3','the number that multiplies x'],['constant','7 and 22','numbers alone'],['term','3x, 7, 22','pieces split by + − ='],['expression','3x + 7','no equals sign'],['equation','3x + 7 = 22','has an equals sign']]),
     trap:'Calling 3x two terms. The 3 and the x are glued together by multiplying: 3x is ONE term.',
     tr:function(){ return bg.vocab.f('adv'); }},
    {t:'Undo in reverse order', h:'<p>To build <b>2x + 3</b>, you take x, multiply by 2, <b>then</b> add 3. To find x, undo those steps <b>backward</b>: take away 3 first, then divide by 2.</p><div class="big">2x + 3 = 11</div>', viz:function(){ return undoSVG(2, 3, '+', 11, 4); },
     steps:['Last thing done to x: + 3. Undo it: 11 − 3 = 8. Now 2x = 8.', 'First thing done to x: × 2. Undo it: 8 ÷ 2 = 4.', 'x = 4.'],
     key:'Like taking off shoes and socks: socks went on first, so they come off last.',
     trap:'Dividing first: 11 ÷ 2 = 5.5, then 5.5 − 3 = 2.5. Check: 2 × 2.5 + 3 = 8, not 11. Undo the + 3 first.',
     tr:function(){ return bg.two.f('adv', 1); }},
    {t:'Same thing to both sides', h:'<p>An equation is a balance. Whatever you do to one side, do to the other side too, and it stays balanced.</p>' + L.tbl(['Step','Left side','Right side'], [['Start','3x − 4','14'],['+ 4 to both','3x','18'],['÷ 3 to both','x','6']]),
     steps:['− 4 is undone with + 4: 14 + 4 = 18, so 3x = 18.', '× 3 is undone with ÷ 3: 18 ÷ 3 = 6.', 'x = 6.'],
     trap:'Subtracting 4 because you see a 4. The opposite of − 4 is + 4.',
     tr:function(){ return bg.two.f('adv', 2); }},
    {t:'Check by substituting', h:'<p>Put your answer back in for x. If both sides match, you are right.</p><div class="big">3 × 6 − 4 = 18 − 4 = 14 ✓</div><p>If they do not match, find the step that went wrong.</p>',
     trap:'Checking with the wrong order: 3 × (6 − 4) = 6. Multiply first, then subtract.',
     tries:[function(){ return bg.two.f('adv', 6); }, function(){ return bg.two.f('adv', 3); }]},
    {t:'Stories with two steps', h:'<p>"Pizza costs $4 a slice plus a $3 drink. Sam spent $23. How many slices?"</p><div class="big">4n + 3 = 23</div><p>23 − 3 = 20, then 20 ÷ 4 = <b>5 slices</b>.</p>',
     key:'The "each" number goes next to n. The one-time amount is added or taken away.',
     aap:'Advanced: ' + f('x', 4) + ' + 2 = 7 means x ÷ 4, then + 2. Undo: 7 − 2 = 5, then 5 × 4 = 20.',
     tries:[function(){ return bg.two.f('adv', 4); }, function(){ return bg.two.f('adv', 5); }]}
  ]}],
  gens:bg, repIds:['gcf','lcm','ineq','vocab','two'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u2', lessons:lessons, gens:gens, repIds:['oo','prime','pat','io','eqn'], test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u2', num: 2, emoji: '🔢', title: 'Pattern & Number Lab',
  blurb: 'Order of operations, primes, patterns, and variables.', sol: ['5.CE.4', '5.NS.2', '5.PFA.1', '5.PFA.2'], dates: ['2026-09-14', '2026-10-02'], color: '#2f80ed'
}, window.V2, { gUnit: 2, coreStds: ['5.CE.4', '5.NS.2', '5.PFA.1', '5.PFA.2'] });

