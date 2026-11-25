/* Unit 12: Integers Lab (AAP bridge unit). In VA 2023 SOL integers are Grade 6 content that FCPS Advanced pulls into Grade 5.
   Core: what negatives mean, opposites, absolute value, compare and order, add and subtract (moved here from Unit 5 Advanced).
   Advanced: multiply and divide, order of operations with negatives and exponents, integer stories.
   Go Further: negative powers of 10 and scientific notation (Grade 6 preview). */
(function(){
var L = V2L, mc = L.mc, sg = L.sg, P = L.par;
function nz(a, b){ var x = 0; while(x === 0) x = L.ri(a, b); return x; }
function n2(m){ return (Math.random() < .5 ? -1 : 1) * L.ri(2, m); }
function retry(fn){ return function(lv, kind){ for (var t = 0; t < 8; t++) { var it = fn(lv, kind); if (it) return it; } return null; }; }
function nl(min, max, pts){ return (window.V && V.numberLine) ? V.numberLine(min, max, pts.map(function(v){ return {pos:v, label:sg(v)}; })) : ''; }

/* ---- Zero-pair chips: + and − counters that cancel (tap one of each to make a zero pair). ---- */
function zeroPairs(o){
  o = o || {};
  var probs = o.problems || [[5, -3], [-6, 4], [-2, -3], [3, -7]], k = 0;
  var root = document.createElement('div'); root.className = 'viz ix zp';
  var q = document.createElement('div'); q.className = 'zp-q';
  var row = document.createElement('div'); row.className = 'zp-row';
  var fb = document.createElement('div'); fb.className = 'ix-fb zp-fb'; fb.setAttribute('aria-live', 'polite');
  var ctl = document.createElement('div'); ctl.className = 'zp-ctl';
  var all = document.createElement('button'); all.type = 'button'; all.className = 'ix-btn'; all.textContent = 'Pair them all';
  var nx = document.createElement('button'); nx.type = 'button'; nx.className = 'ix-btn'; nx.textContent = 'Next problem';
  ctl.appendChild(all); ctl.appendChild(nx);
  [q, row, fb, ctl].forEach(function(e){ root.appendChild(e); });
  var pick = null;
  function chips(){ return [].slice.call(row.querySelectorAll('.zp-chip:not(.gone)')); }
  function check(){
    var left = chips(), pos = left.filter(function(c){ return c.dataset.s === '+'; }).length, neg = left.length - pos, a = probs[k][0], b = probs[k][1];
    if (pos && neg) { fb.innerHTML = 'Tap a <b>+</b> and a <b>−</b> to make a zero pair (+1 and −1 make 0).'; return; }
    var r = a + b;
    fb.innerHTML = (r === 0 ? 'Every chip found a partner: nothing is left.' : 'No zero pairs left. <b>' + Math.abs(r) + ' ' + (r > 0 ? '+' : '−') + '</b> chip' + (Math.abs(r) === 1 ? ' is' : 's are') + ' left.') +
      ' So <b>' + sg(a) + ' + ' + P(b) + ' = ' + sg(r) + '</b>.';
    all.disabled = true;
  }
  function tap(c){
    if (c.classList.contains('gone')) return;
    if (!pick || pick === c) { if (pick) pick.classList.remove('on'); pick = pick === c ? null : c; if (pick) pick.classList.add('on'); return; }
    if (pick.dataset.s === c.dataset.s) { pick.classList.remove('on'); pick = c; c.classList.add('on'); fb.innerHTML = 'Same sign: a zero pair needs one <b>+</b> and one <b>−</b>.'; return; }
    pick.classList.remove('on'); pick.classList.add('gone'); c.classList.add('gone'); pick.disabled = true; c.disabled = true; pick = null; check();
  }
  function load(){
    var a = probs[k][0], b = probs[k][1]; pick = null; all.disabled = false;
    q.innerHTML = '<b>' + sg(a) + ' + ' + P(b) + '</b>';
    row.innerHTML = '';
    var signs = [];
    [a, b].forEach(function(v){ for (var i = 0; i < Math.abs(v); i++) signs.push(v > 0 ? '+' : '−'); });
    signs.forEach(function(s){
      var c = document.createElement('button'); c.type = 'button'; c.className = 'zp-chip ' + (s === '+' ? 'zp-p' : 'zp-n'); c.dataset.s = s; c.textContent = s;
      c.setAttribute('aria-label', s === '+' ? 'plus one' : 'minus one');
      c.onclick = function(){ tap(c); }; row.appendChild(c);
    });
    check();
  }
  all.onclick = function(){
    var ps = chips().filter(function(c){ return c.dataset.s === '+'; }), ns = chips().filter(function(c){ return c.dataset.s === '−'; });
    for (var i = 0; i < Math.min(ps.length, ns.length); i++) { ps[i].classList.add('gone'); ns[i].classList.add('gone'); ps[i].disabled = ns[i].disabled = true; }
    if (pick) pick.classList.remove('on'); pick = null; check();
  };
  nx.onclick = function(){ k = (k + 1) % probs.length; load(); };
  load();
  return root;
}
/* Static chip rows for a lesson picture (zp-z = crossed-out zero pair). */
function chipRow(pos, neg, pairs){
  var h = '<div class="zp-row zp-static">';
  for (var i = 0; i < pos; i++) h += '<i class="zp-chip zp-p' + (i < (pairs || 0) ? ' zp-z' : '') + '">+</i>';
  for (var j = 0; j < neg; j++) h += '<i class="zp-chip zp-n' + (j < (pairs || 0) ? ' zp-z' : '') + '">−</i>';
  return h + '</div>';
}

/* ======================= Core generators ======================= */
var gens = {
  iwhere: {name:'Integers in real life', f:function(lv){
    var n = L.ri(3, 60), S = L.pick([
      [-1, 'a temperature ' + n + ' degrees below zero'], [-1, 'a diver ' + n + ' feet below sea level'], [-1, 'owing a friend $' + n], [-1, 'a team losing ' + n + ' yards'], [-1, 'a withdrawal of $' + n + ' from a bank account'],
      [1, 'a temperature ' + n + ' degrees above zero'], [1, 'a bird ' + n + ' feet above sea level'], [1, 'a deposit of $' + n], [1, 'a team gaining ' + n + ' yards'], [1, 'earning $' + n]]);
    var v = S[0] * n;
    return mc('Which integer describes <b>' + S[1] + '</b>?', sg(v), [
      [sg(-v), S[0] < 0 ? 'Below zero, owing, losing and taking out are negative.' : 'Above zero, gaining, earning and putting in are positive.'],
      [sg(S[0] * (n + 10)), 'Use the number in the story: ' + n + '.'],
      ['0', '0 means no change. This story has a change of ' + n + '.']],
      (S[0] < 0 ? 'Below, owe, lose and withdraw mean negative: ' : 'Above, gain, earn and deposit mean positive: ') + sg(v) + '.');
  }},
  iabs: {name:'Opposites & absolute value', f:retry(function(lv){
    var n = L.ri(2, 25), k = L.pick([0, 0, 1, 2, 3, 4]);
    if (k === 0) { var v = Math.random() < .6 ? -n : n; return {type:'num', fmt:'TYPE IN', q:'What is <b>|' + sg(v) + '|</b>, the absolute value of ' + sg(v) + '?', a:n, why:'Absolute value is the distance from 0. ' + sg(v) + ' is ' + n + ' steps from 0, so |' + sg(v) + '| = ' + n + '. A distance is never negative.'}; }
    if (k === 1) { var w = Math.random() < .5 ? -n : n; return mc('What is the <b>opposite</b> of ' + sg(w) + '?', sg(-w), [[sg(w), 'That is the same number. The opposite is on the other side of 0.'], ['0', '0 is the middle, not the opposite.'], [sg(w > 0 ? w - 1 : w + 1), 'Opposites are the same distance from 0.']], sg(w) + ' and ' + sg(-w) + ' are both ' + n + ' steps from 0, on opposite sides.'); }
    if (k === 2) return mc('Which two numbers are exactly <b>' + n + '</b> units from 0?', sg(-n) + ' and ' + n, [[n + ' and ' + (2*n), 'Count from 0: one is to the right, one is to the left.'], ['0 and ' + n, '0 is 0 units from 0.'], [sg(-n) + ' and ' + sg(-2*n), sg(-2*n) + ' is ' + 2*n + ' units from 0.']], 'Go ' + n + ' right of 0 to ' + n + ', or ' + n + ' left to ' + sg(-n) + '.');
    if (k === 3) {
      var ch = L.shuffle([n, -n, n + 1, -(n - 1), 0]);
      return {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> the numbers with an absolute value of <b>' + n + '</b>.', ch:ch.map(sg), a:ch.map(function(c, i){ return Math.abs(c) === n ? i : -1; }).filter(function(i){ return i >= 0; }), why:'|' + n + '| = ' + n + ' and |' + sg(-n) + '| = ' + n + '. Both are ' + n + ' steps from 0.'};
    }
    var a = -L.ri(5, 20), b = L.ri(1, Math.abs(a) - 1);
    return mc('Which is greater: <b>|' + sg(a) + '|</b> or <b>|' + b + '|</b>?', '|' + sg(a) + '|', [['|' + b + '|', '|' + sg(a) + '| = ' + (-a) + ' and |' + b + '| = ' + b + '. Compare the distances.'], ['They are equal', (-a) + ' and ' + b + ' are different distances.']], '|' + sg(a) + '| = ' + (-a) + ', which is more than ' + b + '. ' + sg(a) + ' is less than ' + b + ', but it is farther from 0.');
  })},
  icmp: {name:'Compare & order integers', f:retry(function(lv){
    var k = L.pick([0, 1, 2, 2, 3]);
    if (k === 0) { var a = -L.ri(2, 15), b = -L.ri(2, 15); if (a === b) return null; var big = Math.max(a, b), sm = Math.min(a, b);
      return mc('Which is <b>greater</b>: ' + sg(a) + ' or ' + sg(b) + '?', sg(big), [[sg(sm), sg(sm) + ' is farther left, so it is smaller. Think colder.'], ['They are equal', 'They are different places on the number line.'], [String(-sm), 'Choose one of the two numbers given.']], sg(big) + ' is closer to 0, to the right of ' + sg(sm) + '. On a number line, right is greater.'); }
    if (k === 1) { var c = nz(-12, 12), d = nz(-12, 12); if (c === d) return null; var sym = c < d ? '&lt;' : '&gt;', wrong = c < d ? '&gt;' : '&lt;';
      return mc('Which symbol makes this true? <b>' + sg(c) + ' __ ' + sg(d) + '</b>', sym, [[wrong, 'Picture the number line. ' + sg(Math.min(c, d)) + ' is to the left.'], ['=', 'They are different numbers.']], sg(Math.min(c, d)) + ' is left of ' + sg(Math.max(c, d)) + ', so ' + sg(c) + ' ' + sym + ' ' + sg(d) + '.'); }
    if (k === 2) { var s = {}, vals = []; while (vals.length < 5) { var x = nz(-15, 15); if (!s[x]) { s[x] = 1; vals.push(x); } }
      if (vals.filter(function(v){ return v < 0; }).length < 2) return null;
      var sorted = vals.slice().sort(function(p, q){ return p - q; });
      return {type:'order', fmt:'ORDER', q:'Tap the numbers in order from <b>least to greatest</b>.', items:vals.map(sg), order:sorted.map(function(v){ return vals.indexOf(v); }), why:'On a number line from left to right: ' + sorted.map(sg).join(', ') + '. The negative farthest from 0 is the least.'}; }
    var t = -L.ri(2, 8), pool = L.shuffle([t - 3, t - 1, t, t + 1, t + 4, -t]).slice(0, 5);
    if (!pool.some(function(v){ return v < t; }) || pool.every(function(v){ return v < t; })) return null;
    return {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> the numbers less than <b>' + sg(t) + '</b>.', ch:pool.map(sg), a:pool.map(function(v, i){ return v < t ? i : -1; }).filter(function(i){ return i >= 0; }), why:'Less than ' + sg(t) + ' means to the left of it on the number line. ' + sg(t) + ' itself is not less than ' + sg(t) + '.'};
  })},
  iadd: {name:'Add integers', f:function(lv){
    var a = nz(-12, 12), b = nz(-12, 12); if(a > 0 && b > 0) b = -b; var r = a + b;
    return mc(sg(a) + ' + ' + P(b) + ' = ?', sg(r), [[sg(-r), 'Right size, wrong sign: which side has more?'], [sg(a - b), 'That subtracts. This is addition.'], [sg(r + (r > 0 ? 2 : -2)), 'Recheck: different signs → subtract the sizes.']], 'Start at ' + sg(a) + ' and move ' + Math.abs(b) + (b < 0 ? ' left' : ' right') + ': ' + sg(r) + '.');
  }},
  isub: {name:'Subtract integers', f:function(lv){
    if (Math.random() < .3) { var lo = -L.ri(2, 12), hi = L.ri(2, 15);
      return {type:'num', fmt:'TYPE IN', q:'At night it was <b>' + sg(lo) + '°F</b>. By noon it was <b>' + hi + '°F</b>. How many degrees did it warm up?', a:hi - lo, why:'From ' + sg(lo) + ' up to 0 is ' + (-lo) + ', then up to ' + hi + ' is ' + hi + ' more: ' + (-lo) + ' + ' + hi + ' = <b>' + (hi - lo) + '</b>. That is ' + hi + ' − ' + P(lo) + '.'}; }
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

/* ======================= Advanced generators ======================= */
function imulQ(lv, kind){
  var a = n2(9), b = n2(9); if (a > 0 && b > 0) { if (Math.random() < .5) a = -a; else b = -b; }
  var p = a*b, same = (a < 0) === (b < 0), rule = same ? 'Same signs → positive.' : 'Different signs → negative.';
  var k = kind != null ? kind : L.pick([0, 0, 1, 1, 2, 2, 3, 4, 5]);
  if (k === 0) return mc(P(a) + ' × ' + P(b) + ' = ?', sg(p), [
    [sg(-p), 'Right size, wrong sign. ' + rule],
    [sg(a + b), 'That adds. This is multiplication.'],
    [sg(same ? -(Math.abs(p) + Math.abs(a)) : Math.abs(p) + Math.abs(a)), 'Recheck the fact ' + Math.abs(a) + ' × ' + Math.abs(b) + ' and the sign.']],
    Math.abs(a) + ' × ' + Math.abs(b) + ' = ' + Math.abs(p) + '. ' + rule + ' So ' + sg(p) + '.');
  if (k === 1) return mc(P(p) + ' ÷ ' + P(b) + ' = ?', sg(a), [
    [sg(-a), 'Right size, wrong sign. ' + rule],
    [sg(p - b), 'That subtracts. This is division.'],
    [sg(a < 0 ? a - 1 : a + 1), 'Check: ' + P(b) + ' × ' + P(a < 0 ? a - 1 : a + 1) + ' = ' + sg(b * (a < 0 ? a - 1 : a + 1)) + ', not ' + sg(p) + '.']],
    Math.abs(p) + ' ÷ ' + Math.abs(b) + ' = ' + Math.abs(a) + '. ' + rule + ' Check: ' + P(b) + ' × ' + P(a) + ' = ' + sg(p) + '.');
  if (k === 2) {
    var m = -L.ri(2, 9), n = L.ri(2, 9) * (Math.random() < .5 ? -1 : 1), dv = Math.random() < .5;
    if (dv) return {type:'num', fmt:'TYPE IN', q:'Find ' + P(m*n) + ' ÷ ' + P(n), a:m, why:Math.abs(m*n) + ' ÷ ' + Math.abs(n) + ' = ' + Math.abs(m) + '. ' + ((m*n < 0) === (n < 0) ? 'Same signs → positive.' : 'Different signs → negative.') + ' Answer <b>' + sg(m) + '</b>. Check: ' + P(n) + ' × ' + P(m) + ' = ' + sg(m*n) + '.'};
    return {type:'num', fmt:'TYPE IN', q:'Find ' + P(m) + ' × ' + P(n), a:m*n, why:Math.abs(m) + ' × ' + Math.abs(n) + ' = ' + Math.abs(m*n) + '. ' + (n < 0 ? 'Same signs → positive.' : 'Different signs → negative.') + ' Answer <b>' + sg(m*n) + '</b>.'};
  }
  if (k === 3) {
    var rows = [], seen = {}, g = 0;
    while (rows.length < 5 && g++ < 80) {
      var x = n2(9), y = n2(9), d = Math.random() < .4, v = d ? x : x*y, t = d ? P(x*y) + ' ÷ ' + P(y) : P(x) + ' × ' + P(y);
      if (x > 0 && y > 0) continue; if (seen[t]) continue; seen[t] = 1;
      rows.push({t:t, neg:v < 0, why:t + ' = ' + sg(v)});
    }
    if (!rows.some(function(r){ return r.neg; }) || rows.every(function(r){ return r.neg; })) return null;
    return {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> the expressions with a <b>negative</b> answer.', ch:rows.map(function(r){ return r.t; }), a:rows.map(function(r, i){ return r.neg ? i : -1; }).filter(function(i){ return i >= 0; }), why:'Look at the signs only: same signs give a positive, different signs give a negative. ' + rows.map(function(r){ return r.why; }).join('; ') + '.'};
  }
  if (k === 4) {
    var q = [n2(5), n2(5), n2(4)], negs = q.filter(function(z){ return z < 0; }).length;
    if (!negs) { q[0] = -q[0]; negs = 1; }
    var pr = q[0]*q[1]*q[2];
    return mc(q.map(P).join(' × ') + ' = ?', sg(pr), [
      [sg(-pr), 'Count the negatives: ' + negs + '. ' + (negs % 2 ? 'An odd number of negatives → negative.' : 'An even number of negatives → positive.')],
      [sg(q[0] + q[1] + q[2]), 'That adds. Multiply all three.'],
      [sg(q[0]*q[1]), 'Multiply by the third number too.']],
      'Multiply two at a time: ' + P(q[0]) + ' × ' + P(q[1]) + ' = ' + sg(q[0]*q[1]) + ', then × ' + P(q[2]) + ' = ' + sg(pr) + '. ' + negs + ' negative' + (negs > 1 ? 's' : '') + ': ' + (negs % 2 ? 'odd → negative.' : 'even → positive.'));
  }
  var s = -L.ri(2, 6), lines = [3, 2, 1, 0, -1].map(function(i){ return P(i) + ' × ' + P(s) + ' = ' + (i === -1 ? '?' : sg(i*s)); });
  return {type:'num', fmt:'TYPE IN', q:'Follow the pattern. What number goes in the <b>?</b><br>' + lines.join('<br>'), a:-s, why:'Each answer goes <b>up by ' + (-s) + '</b>: ' + [3, 2, 1, 0].map(function(i){ return sg(i*s); }).join(', ') + ', so the next one is ' + (-s) + '. That is why a negative × a negative is positive: ' + P(-1) + ' × ' + P(s) + ' = ' + (-s) + '.'};
}
function iopsQ(lv, kind){
  var k = kind != null ? kind : L.pick([0, 0, 1, 1, 2, 3]);
  if (k === 0) {
    var a = n2(9), b = L.ri(2, 6), c = n2(6), v = a + b*c, ltr = (a + b)*c;
    if (v === ltr) return null;
    return mc(sg(a) + ' + ' + b + ' × ' + P(c) + ' = ?', sg(v), [
      [sg(ltr), 'Multiply before you add, even with negatives: ' + b + ' × ' + P(c) + ' first.'],
      [sg(a - b*c), 'Check the sign of ' + b + ' × ' + P(c) + ': ' + sg(b*c) + '.'],
      [sg(-v), 'Right size, wrong sign. ' + sg(a) + ' + ' + P(b*c) + ' = ' + sg(v) + '.']],
      b + ' × ' + P(c) + ' = ' + sg(b*c) + ' first. Then ' + sg(a) + ' + ' + P(b*c) + ' = <b>' + sg(v) + '</b>.');
  }
  if (k === 1) {
    var pw = L.pick([2, 2, 3]), n = pw === 2 ? L.ri(2, 9) : L.ri(2, 4), inside = Math.random() < .5, sup = '<sup>' + pw + '</sup>', pv = Math.pow(n, pw);
    var spell = Array(pw).fill(n).join(' × '), spellN = Array(pw).fill('(−' + n + ')').join(' × ');
    if (pw === 2) {
      if (inside) return {type:'num', fmt:'TYPE IN', q:'Find <b>(−' + n + ')' + sup + '</b>', a:pv, why:'The exponent is on the whole (−' + n + '): ' + spellN + ' = ' + pv + '. Two negatives → positive.'};
      return mc('What is <b>−' + n + sup + '</b>? (No parentheses.)', sg(-pv), [
        [String(pv), 'Without parentheses, the exponent belongs to the ' + n + ' only: −(' + spell + '). (−' + n + ')' + sup + ' would be ' + pv + '.'],
        [sg(-2*n), 'An exponent of 2 means ' + spell + ', not ' + n + ' × 2.'],
        [String(2*n), n + sup + ' is ' + spell + '.']],
        'Exponents come before the minus sign in front: ' + n + sup + ' = ' + pv + ', then the minus makes it <b>' + sg(-pv) + '</b>. Compare: (−' + n + ')' + sup + ' = ' + pv + '.');
    }
    if (inside) return {type:'num', fmt:'TYPE IN', q:'Find <b>(−' + n + ')' + sup + '</b>', a:-pv, why:spellN + ': three negatives, an odd number, so the answer is negative: <b>' + sg(-pv) + '</b>.'};
    return mc('Which is true about <b>(−' + n + ')' + sup + '</b> and <b>−' + n + sup + '</b>?', 'Both equal ' + sg(-pv), [
      ['(−' + n + ')' + sup + ' = ' + pv + ' and −' + n + sup + ' = ' + sg(-pv), '(−' + n + ')' + sup + ' has three negatives: odd → negative.'],
      ['Both equal ' + pv, 'Count the negatives in ' + spellN + ': three, so negative.'],
      ['(−' + n + ')' + sup + ' = ' + sg(-3*n) + ' and −' + n + sup + ' = ' + sg(-pv), 'An exponent of 3 means ' + spell + ', not ' + n + ' × 3.']],
      '(−' + n + ')' + sup + ' = ' + spellN + ' = ' + sg(-pv) + ' (odd number of negatives). −' + n + sup + ' = −(' + spell + ') = ' + sg(-pv) + '. With an odd exponent they match; with an even one they do not.');
  }
  if (k === 2) {
    var x = L.ri(1, 6), y = x + L.ri(2, 8), z = L.ri(2, 5), r = (x - y)*z;
    return mc('(' + x + ' − ' + y + ') × ' + z + ' = ?', sg(r), [
      [sg(x - y*z), 'Parentheses first: ' + x + ' − ' + y + ' = ' + sg(x - y) + '.'],
      [String(-r), x + ' − ' + y + ' is negative: ' + sg(x - y) + '.'],
      [sg(x - y + z), 'Multiply by ' + z + ', do not add it.']],
      '(' + x + ' − ' + y + ') = ' + sg(x - y) + '. Then ' + P(x - y) + ' × ' + z + ' = <b>' + sg(r) + '</b>.');
  }
  var d = L.ri(2, 6), qn = -L.ri(2, 8), e = L.ri(1, 12), res = qn + e;
  return {type:'num', fmt:'TYPE IN', q:'Find <b>' + P(qn*d) + ' ÷ ' + d + ' + ' + e + '</b>', a:res, why:'Divide first: ' + P(qn*d) + ' ÷ ' + d + ' = ' + sg(qn) + '. Then ' + sg(qn) + ' + ' + e + ' = <b>' + sg(res) + '</b>.'};
}
function istoryQ(lv, kind){
  var k = kind != null ? kind : L.pick([0, 1, 2, 3, 4, 5]);
  if (k === 0) { var lo = -L.ri(2, 15), hi = L.ri(2, 20);
    return mc('At 6 a.m. the temperature was <b>' + sg(lo) + '°F</b>. By noon it was <b>' + hi + '°F</b>. How many degrees did it rise?', (hi - lo) + '°', [
      [(hi + lo) + '°', 'That is ' + hi + ' − ' + (-lo) + '. Count up to 0 first, then keep going: ' + (-lo) + ' + ' + hi + '.'], [sg(lo - hi) + '°', 'It went UP, so the change is positive.'], [hi + '°', 'That is only from 0 to ' + hi + '. It started below 0.']],
      hi + ' − ' + P(lo) + ' = ' + hi + ' + ' + (-lo) + ' = <b>' + (hi - lo) + '°</b>.'); }
  if (k === 1) { var A = L.pick([['A hawk flies', 'meters above sea level', 'A fish swims', 'meters below sea level', 'm', 10, 90, 40], ['A drone flies', 'feet above sea level', 'a submarine is', 'feet below sea level', 'ft', 150, 900, 300]]), up = L.ri(A[5], A[6]), dn = -L.ri(5, A[7]);
    return {type:'num', fmt:'TYPE IN', q:A[0] + ' ' + up + ' ' + A[1] + '. ' + A[2].charAt(0).toUpperCase() + A[2].slice(1) + ' ' + (-dn) + ' ' + A[3] + '. How far apart are they, top to bottom, in ' + (A[4] === 'm' ? 'meters' : 'feet') + '?', a:up - dn, why:'Sea level (0) is between them: ' + up + ' up and ' + (-dn) + ' down. ' + up + ' − ' + P(dn) + ' = <b>' + (up - dn) + '</b> ' + A[4] + '.'}; }
  if (k === 2) { var have = L.ri(3, 15), cost = have + L.ri(2, 12), bal = have - cost;
    return mc('Mia has <b>$' + have + '</b>. She buys a game for <b>$' + cost + '</b> and borrows the rest from her brother. What integer shows her balance now?', sg(bal), [
      [String(-bal), 'She owes money, so her balance is below 0.'], [sg(-(have + cost)), 'That adds both amounts. ' + have + ' − ' + cost + ' = ' + sg(bal) + '.'], ['0', 'She spent more than she had.']],
      have + ' − ' + cost + ' = <b>' + sg(bal) + '</b>: she owes $' + (-bal) + '.'); }
  if (k === 3) { var t0 = L.ri(1, 9), drop = t0 + L.ri(1, 10), t1 = t0 - drop;
    return {type:'num', fmt:'TYPE IN', q:'It is <b>' + t0 + '°C</b>. The temperature drops <b>' + drop + '°</b>. What is the new temperature in °C?', a:t1, why:t0 + ' − ' + drop + ' = <b>' + sg(t1) + '</b>. Down ' + t0 + ' to 0, then ' + (drop - t0) + ' more below 0.'}; }
  if (k === 4) { var h = L.ri(3, 8), d = L.ri(2, 6), T = L.pick([
      ['The temperature drops ' + d + '° each hour for ' + h + ' hours. What is the total change in temperature?', '°', 'hour'],
      ['A diver goes down ' + d + ' meters each minute for ' + h + ' minutes. What is the diver\'s change in height?', ' m', 'minute'],
      ['A team loses ' + d + ' yards on each of ' + h + ' plays. What is the total change in yards?', ' yards', 'play']]);
    return mc(T[0], sg(-d*h) + T[1], [
      [String(d*h) + T[1], 'Going down, dropping or losing is a negative change.'],
      [sg(-(d + h)) + T[1], 'That adds ' + d + ' and ' + h + '. It happens ' + h + ' times: multiply.'],
      [sg(-d) + T[1], 'That is one ' + T[2] + '. It happens ' + h + ' times.']],
      h + ' × ' + P(-d) + ' = <b>' + sg(-d*h) + T[1] + '</b>. A positive times a negative is negative.'); }
  var avg = -L.ri(2, 6), dd = [avg - 2, avg, avg + 2].map(function(v){ return v; }), sum = dd[0] + dd[1] + dd[2];
  return mc('A pond\'s water level changed by ' + dd.map(function(v){ return sg(v); }).join(' cm, ') + ' cm on three days. What was the <b>mean</b> change per day?', sg(avg) + ' cm', [
    [String(-avg) + ' cm', 'The level went down overall, so the mean change is negative.'], [sg(sum) + ' cm', 'That is the total. Divide by 3 days.'], [sg(avg - 2) + ' cm', 'Add all three, then divide by 3.']],
    'Total: ' + dd.map(P).join(' + ') + ' = ' + sg(sum) + '. Mean: ' + P(sum) + ' ÷ 3 = <b>' + sg(avg) + ' cm</b>.');
}
function ten(e){ return '10<sup>' + (e < 0 ? '−' + (-e) : e) + '</sup>'; }
function sciQ(lv, kind){
  var k = kind != null ? kind : L.pick([0, 1, 1, 2, 3, 4]);
  if (k === 0) { var e = -L.ri(1, 4), val = Math.pow(10, e).toFixed(-e);
    return mc('What is ' + ten(e) + ' as a decimal?', val, [[String(Math.pow(10, -e)), 'A negative exponent does not make a big number. Each step down divides by 10.'], [sg(-Math.pow(10, -e)), 'A negative exponent does not make a negative number.'], [Math.pow(10, e - 1).toFixed(1 - e), 'Count the steps: ' + ten(e) + ' has ' + (-e) + ' place' + (e < -1 ? 's' : '') + ' after the point.']],
      '10<sup>0</sup> = 1, and each step down divides by 10: ' + ten(e) + ' = ' + val + '.'); }
  if (k === 1) { var dgt = L.pick([12,13,14,15,16,17,18,19,21,23,24,25,26,27,28,29,31,32,34,35,36,37,38,39,41,42,43,45,46,47,48,49,51,52,53,54,56,57,58,59,61,62,63,64,65,67,68,69,71,72,73,74,75,76,78,79,81,82,83,84,85,86,87,89,91,92,93,94,95,96,97,98]), ex = L.ri(4, 8), n = dgt * Math.pow(10, ex - 1), lead = (dgt / 10).toFixed(1);
    return mc('Write <b>' + n + '</b> in scientific notation.', lead + ' × ' + ten(ex), [[dgt + ' × ' + ten(ex - 1), 'The first part must be at least 1 and less than 10.'], [lead + ' × ' + ten(ex - 1), 'Count the jumps: the point moves ' + ex + ' places.'], [lead + ' × ' + ten(-ex), 'A big number has a positive exponent.']],
      'Put the point after the first digit: ' + lead + '. The point moves ' + ex + ' places, so <b>' + lead + ' × ' + ten(ex) + '</b>.'); }
  if (k === 2) { var d1 = L.ri(2, 9), e2 = -L.ri(2, 4), sm = (d1 * Math.pow(10, e2)).toFixed(-e2);
    return mc('Write <b>' + sm + '</b> in scientific notation.', d1 + ' × ' + ten(e2), [[d1 + ' × ' + ten(-e2), 'A number less than 1 has a negative exponent.'], [d1 + ' × ' + ten(e2 + 1), 'Count the jumps to get to ' + d1 + ': ' + (-e2) + ' places.'], [(d1 * 10) + ' × ' + ten(e2 - 1), 'The first part must be at least 1 and less than 10.']],
      'Move the point ' + (-e2) + ' places right to get ' + d1 + '. Moving right means a negative exponent: <b>' + d1 + ' × ' + ten(e2) + '</b>.'); }
  if (k === 3) { var c = ((L.ri(1, 9) * 10 + L.ri(1, 9)) / 10).toFixed(1), e3 = L.ri(2, 7);
    return mc('Which number is written in <b>scientific notation</b>?', c + ' × ' + ten(e3), [[(+c * 10).toFixed(0) + ' × ' + ten(e3 - 1), 'The first part must be at least 1 and less than 10.'], ['0.' + c.replace('.', '') + ' × ' + ten(e3 + 1), '0.' + c.replace('.', '') + ' is less than 1.'], [c + ' + ' + ten(e3), 'Scientific notation multiplies by a power of 10.']],
      'It needs a number from 1 up to (not including) 10, times a power of 10: ' + c + ' × ' + ten(e3) + '.'); }
  var c4 = L.ri(1, 9) * 10 + L.ri(1, 9), e4 = L.ri(3, 6), lead4 = (c4 / 10).toFixed(1), full = c4 * Math.pow(10, e4 - 1);
  return {type:'num', fmt:'TYPE IN', q:'Write <b>' + lead4 + ' × ' + ten(e4) + '</b> as a standard number.', a:full, why:'× ' + ten(e4) + ' moves the point ' + e4 + ' places right: ' + lead4 + ' → <b>' + full + '</b>.'};
}
var bg = {
  imul: {name:'Multiply & divide integers', f:retry(imulQ)},
  iops: {name:'Order of operations with negatives', f:retry(iopsQ)},
  istory: {name:'Integer stories', f:retry(istoryQ)},
  sci: {name:'Scientific notation (Go Further)', f:retry(sciQ)}
};

/* ======================= Core lessons ======================= */
var lessons = [
 {id:'u12L1', name:'What negatives mean', icon:'🌡️', cards:[
  {t:'Below zero', h:'<p>A thermometer goes below 0: −5° is 5 degrees below zero. On a number line, negatives sit to the <b>left</b> of 0.</p><p>−8 &lt; −3, because −8 is farther left. (Colder!)</p>', trap:'−8 is LESS than −3, even though 8 is bigger than 3.'},
  {t:'Negatives in real life', h:L.tbl(['Story','Integer'], [['8° below zero','−8'],['40 feet below sea level','−40'],['owe $15','−15'],['gain 12 yards','12'],['deposit $25','25']]),
   key:'Below, owe, lose, drop, withdraw → negative. Above, gain, earn, deposit → positive. 0 means no change.',
   tr:function(){ return gens.iwhere.f(); }},
  {t:'Opposites', h:'<p><b>−5</b> and <b>5</b> are opposites: the same distance from 0, on opposite sides.</p>', viz:function(){ return nl(-6, 6, [-5, 5]); },
   steps:['Find the number on the line.', 'Count its steps to 0: −5 is 5 steps away.', 'Go the same number of steps on the other side: 5.'],
   trap:'The opposite of −5 is not −5 or 0. It is 5. And the opposite of 0 is 0.',
   tr:function(){ return gens.iabs.f(); }},
  {t:'Absolute value', h:'<div class="big">|−6| = 6 &nbsp; &nbsp; |6| = 6</div><p>The bars mean <b>absolute value</b>: how far a number is from 0. A distance is never negative.</p>', viz:function(){ return nl(-7, 7, [-6, 0, 6]); },
   trap:'|−6| is not −6. Distance is always 0 or positive.',
   aap:'Advanced: −8 &lt; 5, but |−8| &gt; |5|. A number can be smaller and still be farther from 0.',
   tries:[function(){ return gens.iabs.f(); }, function(){ return gens.iabs.f(); }]}
 ]},
 {id:'u12L2', name:'Compare & order', icon:'↔️', cards:[
  {t:'Farther left is smaller', h:'<p>On a number line, numbers get bigger to the <b>right</b>. So −2 &gt; −7: −2 is closer to 0.</p>', viz:function(){ return (window.IX && IX.lineLab) ? IX.lineLab({mode:'compare', pairs:[[-7, -2], [-1, -4], [3, -5], [-10, -9]], min:-10, max:5}) : nl(-8, 2, [-7, -2]); },
   trap:'Thinking −7 &gt; −2 because 7 &gt; 2. With negatives, the bigger-looking number is smaller.',
   key:'Think temperature: −7° is colder than −2°.',
   tr:function(){ return gens.icmp.f(); }},
  {t:'Least to greatest', h:'<p>Order −1, 5, −6, 0, 3 from least to greatest.</p>', viz:function(){ return nl(-7, 6, [-6, -1, 0, 3, 5]); },
   steps:['Put each number on the line.', 'Read from left to right: −6, −1, 0, 3, 5.', 'The negative farthest from 0 comes first.'],
   trap:'Writing −1, −6 because 1 &lt; 6. −6 is farther left, so it comes first.',
   tries:[function(){ for (var t = 0; t < 8; t++) { var it = gens.icmp.f(); if (it && it.type === 'order') return it; } return gens.icmp.f(); }]},
  {t:'The x-axis is a number line', h:'<p>On a coordinate grid, the <b>x-axis</b> is a number line lying down: negatives go <b>left</b> of 0. The <b>y-axis</b> is a number line standing up: negatives go <b>down</b>.</p><p>(−4, 0) is 4 steps left of 0. (0, −3) is 3 steps down. Plot points in all four quadrants in <b>Coordinate Quest</b> (Advanced level).</p>',
   viz:function(){ return (window.V && V.plane) ? V.plane([{x:-4, y:0, label:'(−4, 0)'}, {x:3, y:0, label:'(3, 0)'}, {x:0, y:-3, label:'(0, −3)'}], {quad:true, n:5}) : ''; },
   trap:'Going right for a negative x. On the x-axis, −4 is 4 steps LEFT of 0, just like on a number line.',
   tries:[function(){ var a = -L.ri(2, 6), b = L.pick([-1, 1]) * L.ri(1, 6); if (a === b) b = a + 2; var lft = Math.min(a, b);
      return mc('Which point is farther <b>left</b> on the x-axis?', '(' + sg(lft) + ', 0)', [['(' + sg(Math.max(a, b)) + ', 0)', 'Farther left means the smaller x: ' + sg(lft) + ' &lt; ' + sg(Math.max(a, b)) + '.'], ['(0, ' + sg(lft) + ')', 'That point is on the y-axis.'], ['(0, 0)', 'The origin is at 0. ' + sg(lft) + ' is to its left.']], sg(lft) + ' is less than ' + sg(Math.max(a, b)) + ', so (' + sg(lft) + ', 0) is farther left.'); },
    function(){ var c = -L.ri(1, 6), d = L.ri(1, 6);
      return mc('Which point is <b>lower</b> on the y-axis?', '(0, ' + sg(c) + ')', [['(0, ' + d + ')', d + ' is above 0. Negative y-values are below 0.'], ['(' + sg(c) + ', 0)', 'That point is on the x-axis.'], ['(0, 0)', '(0, 0) is the origin, above any negative y.']], 'On the y-axis, ' + sg(c) + ' is below 0, so (0, ' + sg(c) + ') is lower.'); }]}
 ]},
 {id:'u12L3', name:'Add integers', icon:'➕', cards:[
  {t:'Zero pairs', h:'<p>A <b>+1</b> chip and a <b>−1</b> chip cancel: together they make <b>0</b>. That is a zero pair.</p><p>To add, put out both groups of chips, take away the zero pairs, and count what is left.</p>', viz:function(){ return zeroPairs(); },
   steps:['5 + (−3): five + chips and three − chips.', 'Make 3 zero pairs. They are worth 0.', 'Two + chips are left: 5 + (−3) = 2.'],
   trap:'Adding the sizes when the signs are different: 5 + (−3) is not 8. The − chips cancel some of the + chips.',
   tr:function(){ return gens.iadd.f(); }},
  {t:'Add on a number line', h:'<p>Adding a positive: move right. Adding a negative: move left.</p><div class="big">−4 + 6 = 2</div><p>Start at −4, move 6 right.</p>', tr:function(){ return gens.inl.f(); }},
  {t:'Same signs, different signs', h:L.tbl(['Signs','What to do','Example'], [['same','add the sizes, keep the sign','−3 + (−4) = −7'],['different','subtract the sizes, keep the sign of the bigger size','−9 + 4 = −5']]),
   trap:'−3 + (−4) is −7, not 7 and not −1. Two negatives added together go farther below 0.',
   tr:function(){ return gens.iadd.f(); }}
 ]},
 {id:'u12L4', name:'Subtract integers', icon:'➖', cards:[
  {t:'Subtract = add the opposite', h:'<div class="big">3 − 7 = 3 + (−7) = −4</div><div class="big">3 − (−7) = 3 + 7 = 10</div><p>Keep, change, flip.</p>', tr:function(){ return gens.isub.f(); }},
  {t:'Subtract with zero pairs', h:'<p><b>2 − 5</b>: you need to take away 5 + chips, but there are only 2.</p>' + chipRow(2, 0) + '<p>Add 3 zero pairs (they are worth 0, so nothing changes):</p>' + chipRow(5, 3) + '<p>Now take away 5 + chips. Three − chips are left: <b>2 − 5 = −3</b>.</p>',
   trap:'Answering 3 because 5 − 2 = 3. Taking away more than you have goes below 0.',
   tr:function(){ return gens.isub.f(); }},
  {t:'How far apart?', h:'<p>From <b>−4°</b> up to <b>7°</b>: 4 degrees up to 0, then 7 more.</p>', viz:function(){ return nl(-5, 8, [-4, 0, 7]); },
   steps:['Count from −4 up to 0: 4.', 'Count from 0 up to 7: 7.', '4 + 7 = 11. That is 7 − (−4) = 11.'],
   trap:'7 − 4 = 3 forgets that −4 is below 0. Cross 0: add the two distances.',
   tr:function(){ return gens.isub.f(); }}
 ]}
];
var test = [
 {type:'num', fmt:'TYPE IN', q:'What is <b>|−14|</b>?', a:14, why:'−14 is 14 steps from 0.'},
 mc('Which integer describes 25 feet below sea level?', '−25', [['25', 'Below sea level is negative.'], ['0', '0 is sea level itself.'], ['−2.5', 'Use the number in the story.']], 'Below sea level → −25.'),
 {type:'order', fmt:'ORDER', q:'Tap the numbers in order from <b>least to greatest</b>.', items:['3', '−8', '0', '−2', '6'], order:[1, 3, 2, 0, 4], why:'Left to right on the number line: −8, −2, 0, 3, 6.'},
 mc('−6 + 10 = ?', '4', [['−16', 'The signs are different: subtract the sizes.'], ['−4', '10 is the bigger size, and it is positive.'], ['16', 'The signs are different: subtract the sizes.']], 'Start at −6 and move 10 right: 4.'),
 mc('5 − (−3) = ?', '8', [['2', 'Subtracting a negative is adding a positive: 5 + 3.'], ['−8', 'Check the sign.'], ['−2', 'Keep, change, flip: 5 + 3.']], '5 + 3 = 8.')
];

/* ======================= Advanced lessons ======================= */
var bridge = {
  title:'Advanced: multiply, divide and stories', tab:'🚀 Go Further',
  intro:'Advanced: multiply and divide integers (and <b>why</b> − × − = +), order of operations with negatives and exponents, and integer stories. Go Further: scientific notation.',
  lessons:[{id:'u12B1', name:'Multiply & divide integers', icon:'✖️', cards:[
    {t:'Groups of negatives', h:'<p><b>3 × (−4)</b> means 3 groups of −4.</p>' + chipRow(0, 4) + chipRow(0, 4) + chipRow(0, 4) + '<p>That is 12 negatives: <b>3 × (−4) = −12</b>.</p>',
     key:'Find the size first (3 × 4 = 12), then decide the sign.',
     trap:'Thinking a product is always bigger and positive. 3 groups of −4 is farther below zero: −12.',
     tr:function(){ return bg.imul.f('adv', 0); }},
    {t:'Why − × − = +', h:'<p>Watch the answers as the first number goes down by 1.</p>' + L.tbl(['Problem','Answer'], [['3 × (−2)','−6'],['2 × (−2)','−4'],['1 × (−2)','−2'],['0 × (−2)','0'],['(−1) × (−2)','<b>2</b>'],['(−2) × (−2)','<b>4</b>']]),
     steps:['Each answer goes <b>up by 2</b>: −6, −4, −2, 0 …', 'Keep the pattern going past 0: 2, then 4.', 'So (−1) × (−2) = 2. A negative times a negative is positive.'],
     key:'"Not not hungry" means hungry. The opposite of an opposite flips back.',
     tr:function(){ return bg.imul.f('adv', 5); }},
    {t:'The sign rules', h:L.tbl(['Signs','Answer','Example'], [['+ and +','positive','3 × 4 = 12'],['− and −','positive','(−3) × (−4) = 12'],['+ and −','negative','3 × (−4) = −12'],['− and +','negative','(−12) ÷ 3 = −4']]) + '<p>Division follows the same rules, because ÷ undoes ×: (−12) ÷ 3 = −4 since 3 × (−4) = −12.</p>',
     trap:'Using the × rule for adding. (−3) + (−4) is −7, not 7. "Two negatives make a positive" is only for × and ÷.',
     tries:[function(){ return bg.imul.f('adv', 1); }, function(){ return bg.imul.f('adv', 3); }]},
    {t:'Many signs', h:'<p>With three or more numbers, multiply two at a time, or just <b>count the negatives</b>.</p>' + L.tbl(['Negatives','Answer'], [['even (2, 4, …)','positive'],['odd (1, 3, …)','negative']]) + '<p>(−1) × (−2) × (−3) = −6: three negatives, odd.</p>',
     tries:[function(){ return bg.imul.f('adv', 4); }, function(){ return bg.imul.f('adv', 2); }]}
  ]},{id:'u12B2', name:'Order of operations with negatives', icon:'🧮', cards:[
    {t:'Same order, signs ride along', h:'<div class="big">−3 + 4 × (−2)</div><p>Multiply first: 4 × (−2) = −8. Then −3 + (−8) = <b>−11</b>.</p>',
     trap:'Going left to right: (−3 + 4) × (−2) = −2. Multiply before you add, even with negatives.',
     tr:function(){ return bg.iops.f('adv', 0); }},
    {t:'Exponents and negatives', h:L.tbl(['Write','Means','Value'], [['(−3)<sup>2</sup>','(−3) × (−3)','9'],['−3<sup>2</sup>','−(3 × 3)','−9'],['(−2)<sup>3</sup>','(−2) × (−2) × (−2)','−8'],['−2<sup>3</sup>','−(2 × 2 × 2)','−8']]) + '<p>Parentheses tell you the minus is part of the number being multiplied. With an odd exponent the two come out the same; with an even one they do not.</p>',
     trap:'Reading −3<sup>2</sup> as 9. Exponents come first, so the minus waits: −(3 × 3) = −9.',
     tr:function(){ return bg.iops.f('adv', 1); }},
    {t:'Parentheses first', h:'<div class="big">(2 − 7) × 3 = (−5) × 3 = −15</div><div class="big">(−12) ÷ 4 + 5 = −3 + 5 = 2</div>',
     tries:[function(){ return bg.iops.f('adv', 2); }, function(){ return bg.iops.f('adv', 3); }]}
  ]},{id:'u12B3', name:'Integer stories', icon:'🏔️', cards:[
    {t:'Rise and fall', h:'<p>"It was −5°F at 6 a.m. and 12°F at noon. How much did it rise?"</p>', viz:function(){ return nl(-6, 13, [-5, 0, 12]); },
     steps:['From −5 up to 0 is 5 degrees.', 'From 0 up to 12 is 12 more.', '5 + 12 = 17. As a subtraction: 12 − (−5) = 17.'],
     trap:'12 − 5 = 7 forgets that −5 is below 0. When you cross 0, add the two parts.',
     tr:function(){ return bg.istory.f('adv', 0); }},
    {t:'Above and below sea level', h:'<p>A hawk at 45 m and a fish at −20 m. Sea level is between them.</p><div class="big">45 − (−20) = 65 m apart</div>',
     key:'Below sea level, owing money and losing yards are negative. Above, earning and gaining are positive.',
     tries:[function(){ return bg.istory.f('adv', 1); }, function(){ return bg.istory.f('adv', 2); }]},
    {t:'Repeated change', h:'<p>"A diver goes down 3 m each minute for 6 minutes."</p><div class="big">6 × (−3) = −18 m</div><p>"Each" and "for 6 minutes" mean multiply.</p>',
     aap:'The mean change of −2, −4 and −6 is (−12) ÷ 3 = −4 per day.',
     tries:[function(){ return bg.istory.f('adv', 4); }, function(){ return bg.istory.f('adv', 5); }]}
  ]},{id:'u12B4', name:'Go Further: scientific notation', icon:'🔭', cards:[
    {t:'Powers of 10 going down', h:L.tbl(['Power','Value'], [['10<sup>3</sup>','1000'],['10<sup>2</sup>','100'],['10<sup>1</sup>','10'],['10<sup>0</sup>','1'],['10<sup>−1</sup>','0.1'],['10<sup>−2</sup>','0.01'],['10<sup>−3</sup>','0.001']]) + '<p>Each step down the table divides by 10. A negative exponent makes a small number, not a negative one.</p>',
     trap:'10<sup>−2</sup> is not −100. It is 0.01.',
     tr:function(){ return bg.sci.f('adv', 0); }},
    {t:'Scientific notation', h:'<div class="big">3200000 = 3.2 × 10<sup>6</sup></div><div class="big">0.004 = 4 × 10<sup>−3</sup></div><p>The first part is <b>at least 1 and less than 10</b>. The exponent counts how many places the point moved.</p>',
     steps:['Put the point after the first nonzero digit: 3.2.', 'Count how far it moved: 6 places.', 'Big number → positive exponent. Small number → negative exponent.'],
     trap:'32 × 10<sup>5</sup> has the right value but is not scientific notation: 32 is not less than 10.',
     tries:[function(){ return bg.sci.f('adv', 1); }, function(){ return bg.sci.f('adv', 2); }]}
  ]}],
  gens:bg, repIds:['imul','iops','istory','sci'],
  next:'Stay in the Advanced path for more practice.'
};
window.V2 = {key:'u12', lessons:lessons, gens:gens, repIds:['iwhere','iabs','icmp','iadd','isub','inl'], test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u12', num: 12, emoji: '🌡️', title: 'Integers Lab',
  blurb: 'Negative numbers: opposites, absolute value, compare and order, add and subtract.', sol: ['6.NS.2', '6.CE.2'], dates: ['2027-06-17', '2027-06-30'], color: '#c9356b'
}, window.V2, {});
