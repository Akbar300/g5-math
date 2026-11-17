/* Unit 10: Data & Chance Lab — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 10, Data & Probability (5.PS.1-3). Pre-teach: FCPS teaches it after/during the SOL window. */
(function(){
var L = V2L, f = L.fr, mc = L.mc;
function stats(a){ var s = a.slice().sort(function(x,y){return x-y;}), n = s.length, sum = s.reduce(function(p,c){return p+c;},0), med = n % 2 ? s[(n-1)/2] : (s[n/2-1] + s[n/2]) / 2, cnt = {}, mode = [], mx = 0; s.forEach(function(v){ cnt[v] = (cnt[v]||0)+1; }); Object.keys(cnt).forEach(function(k){ if(cnt[k] > mx){ mx = cnt[k]; mode = [+k]; } else if(cnt[k] === mx) mode.push(+k); }); return {s:s, mean:sum/n, med:med, mode:mx > 1 && mode.length < Object.keys(cnt).length ? mode : [], range:s[n-1]-s[0], sum:sum}; }
var gens = {
  mean: {name:'Mean (fair share)', f:function(lv){
    var n = L.pick([4,5,6]), m = L.ri(5, 20), a = []; for(var i = 0; i < n - 1; i++) a.push(m + L.ri(-5, 5)); var last = m*n - a.reduce(function(p,c){return p+c;},0); if(last < 1) return null; a.push(last); a = L.shuffle(a);
    var st = stats(a);
    return mc('Find the <b>mean</b> of: ' + a.join(', '), String(m), [[String(st.med) === String(m) ? String(m+1) : String(st.med), 'That is the middle number (median). Mean = total ÷ how many.'], [String(st.sum), 'That is the total. Now share it equally among ' + n + '.'], [String(st.range), 'That is the range.']], 'Total ' + st.sum + ' ÷ ' + n + ' = ' + m + '. Each gets an equal share of ' + m + '.');
  }},
  median: {name:'Median, mode, range', f:function(lv){
    var n = L.pick([5,7,6]), a = []; for(var i = 0; i < n; i++) a.push(L.ri(10, 40)); if(Math.random() < .6) a[1] = a[3];
    var st = stats(a), k = L.pick(['med','range','mode']);
    if(k === 'med'){ if(st.med % 1) return null; return mc('Find the <b>median</b> of: ' + a.join(', '), String(st.med), [[String(a[Math.floor(n/2)]) === String(st.med) ? String(st.med + 2) : String(a[Math.floor(n/2)]), 'Put the numbers IN ORDER first, then find the middle.'], [String(Math.round(st.mean*10)/10) === String(st.med) ? String(st.med-1) : String(Math.round(st.mean*10)/10), 'That is about the mean.'], [String(st.range), 'That is the range.']], 'In order: ' + st.s.join(', ') + '. The middle is ' + st.med + '.'); }
    if(k === 'range') return {type:'num', q:'Find the <b>range</b> of: ' + a.join(', '), a:st.range, why:'Greatest − least = ' + st.s[n-1] + ' − ' + st.s[0] + ' = ' + st.range + '.'};
    return mc('What is the <b>mode</b> of: ' + a.join(', ') + '?', st.mode.length ? st.mode.join(' and ') : 'no mode', [[st.mode.length ? 'no mode' : '0', st.mode.length ? 'Look for a number that appears more than once.' : '"No mode" is not the same as 0.'], [String(st.med), 'That is the median.'], [String(st.range), 'That is the range.']], st.mode.length ? 'It appears most often.' : 'Every value appears once, so there is no mode (not 0).');
  }},
  count: {name:'Counting principle', f:function(lv){
    var a = L.ri(2, 5), b = L.ri(2, 4), c = lv === 'adv' ? L.ri(2, 3) : 1;
    var q = 'A lunch has ' + a + ' sandwich choices and ' + b + ' drink choices' + (c > 1 ? ' and ' + c + ' fruit choices' : '') + '. How many different lunches can be made?';
    return mc(q, String(a*b*c), [[String(a+b+c-(c>1?0:1)), 'Each sandwich pairs with EVERY drink: multiply, do not add.'], [String(a*b*c*2), 'Recheck: multiply the number of choices for each part.'], [String(a*b*c - 1), 'Count every combination.']], 'Fundamental Counting Principle: ' + a + ' × ' + b + (c > 1 ? ' × ' + c : '') + ' = ' + a*b*c + '.');
  }},
  prob: {name:'Probability', f:function(lv){
    var r = L.ri(1, 6), b = L.ri(1, 6), g = L.ri(0, 4), t = r + b + g;
    return mc('A bag has ' + r + ' red, ' + b + ' blue' + (g ? ' and ' + g + ' green' : '') + ' marbles. What is the probability of picking <b>blue</b>?', f(b, t), [[f(b, t - b), 'The bottom number is ALL the marbles, not the ones that are not blue.'], [f(1, t), 'There are ' + b + ' blue marbles, not 1.'], [f(r, t), 'That is red.']], b + ' blue out of ' + t + ' total = ' + f(b, t) + '.');
  }}
};
var lessons = [
 {id:'u10L1', name:'Mean as fair share', icon:'⚖️', cards:[
  {t:'Even it out', h:'<p>Four friends have 3, 7, 5 and 9 stickers. If they share fairly, everyone gets the same number. That number is the <b>mean</b>.</p>', steps:['<p>Total: 3 + 7 + 5 + 9 = 24.</p>', '<p>Share among 4: 24 ÷ 4 = <b>6</b> each.</p>', '<p>Check: 3 gets 3 more, 9 gives 3 away. Balanced!</p>'], key:'Mean = total ÷ number of values.'},
  {t:'Median, mode, range', h:L.tbl(['Measure','How'], [['median','order the values, take the middle (average the 2 middles if even)'],['mode','the value that appears most (could be "no mode")'],['range','greatest − least']]), trap:'Finding the median without putting the numbers in order first.', tr:gens.median.f()}
 ]},
 {id:'u10L2', name:'Line plots & stem-and-leaf', icon:'📈', cards:[
  {t:'Stem-and-leaf plots', h:L.tbl(['Stem','Leaf'], [['2','1 4 4 8'],['3','0 5'],['4','2']]) + '<p>Key: 2 | 1 = 21. The data: 21, 24, 24, 28, 30, 35, 42.</p>', trap:'"At least 30" includes 30. Count 30, 35 and 42 → 3 values.'},
  {t:'Your turn', h:L.tbl(['Stem','Leaf'], [['1','2 5 5 9'],['2','0 3 3 3'],['3','1']]) + '<p>Key: 1 | 2 = 12</p>', tr:mc('What is the mode of this data?', '23', [['15', '15 appears twice, but 23 appears three times.'], ['3', 'The mode is a data value: stem 2 with leaf 3 = 23.'], ['no mode', 'Look for repeated leaves.']], '23 appears three times (stem 2, leaves 3 3 3).')}
 ]},
 {id:'u10L3', name:'Sample space & probability', icon:'🎲', cards:[
  {t:'Tree diagrams', h:'<p>Flip a coin and spin a 3-color spinner. Each coin result branches into 3 colors.</p>' + L.tbl(['Coin','Outcomes'], [['Heads','H-red, H-blue, H-green'],['Tails','T-red, T-blue, T-green']]) + '<div class="big">2 × 3 = 6 outcomes</div>', key:'Fundamental Counting Principle: multiply the choices for each step.'},
  {t:'Probability is a fraction', h:'<p>P(event) = favorable outcomes ÷ total outcomes. It goes from 0 (impossible) to 1 (certain).</p>', trap:'Adding instead of multiplying when counting combinations.', tr:gens.count.f('std')}
 ]}
];
var test = [
 {type:'num', fmt:'TYPE IN', q:'The mean of 5 test scores is 84. Four scores are 80, 90, 76 and 88. What is the fifth score?', a:86, why:'Total must be 84 × 5 = 420. 80 + 90 + 76 + 88 = 334. 420 − 334 = 86.'},
 {type:'ms', fmt:'SELECT ALL', q:'Data: 4, 7, 7, 9, 13. Select <b>all</b> true statements.', ch:['mode = 7', 'median = 7', 'mean = 8', 'range = 13', 'mean = 7'], a:[0,1,2], why:'Mode 7, median 7, mean 40 ÷ 5 = 8, range 13 − 4 = 9.'},
 mc('Pizza: 3 crusts, 4 toppings, 2 sizes (one of each). How many different pizzas?', '24', [['9', 'Multiply the choices: 3 × 4 × 2.'], ['12', 'Do not forget the sizes.'], ['48', 'Recheck: 3 × 4 × 2.']], '3 × 4 × 2 = 24.'),
 {type:'multi', fmt:'MULTI-PART', q:'A spinner has 8 equal parts: 3 red, 4 blue, 1 yellow.<br>Part A: P(blue) as a decimal?<br>Part B: P(not red) as a decimal?', parts:[{label:'A:', a:.5},{label:'B:', a:.625}], why:'P(blue) = ' + f(4,8) + ' = 0.5. Not red = 5 of 8 = 0.625.'}
];
var bg = {
  outl: {name:'Outliers & effects', f:function(lv){
    var base = []; var c = L.ri(20, 40); for(var i = 0; i < 5; i++) base.push(c + L.ri(-4, 4)); var out = c + L.ri(30, 50); var a = L.shuffle(base.concat([out]));
    return mc('Data: ' + a.join(', ') + '. Which measure changes the MOST if the outlier ' + out + ' is removed?', 'the mean', [['the median', 'The median barely moves: it only cares about the middle position.'], ['the mode', 'The mode depends on repeated values, not extreme ones.'], ['none of them', 'Removing an extreme value pulls the mean a lot.']], 'Outliers pull the mean toward them. The median and mode resist outliers.');
  }},
  bal: {name:'Mean as balance point', f:function(lv){
    var m = L.ri(4, 10), d = L.ri(1, 3), a = [m - 2*d, m - d, m, m + d, m + 2*d];
    var add = m + L.pick([-3, 4, 5]);
    return mc('The mean of ' + a.join(', ') + ' is ' + m + '. If ' + add + ' is added to the data, the mean will…', add > m ? 'go up' : 'go down', [[add > m ? 'go down' : 'go up', 'A value ' + (add > m ? 'above' : 'below') + ' the balance point tips it that way.'], ['stay the same', 'Only a value exactly equal to the mean keeps it the same.']], 'The mean is the balance point. A new value ' + (add > m ? 'above' : 'below') + ' it tips the balance.');
  }}
};
var bridge = {
  title:'Go Further: outliers & the balance point', tab:'🚀 Go Further',
  intro:'Advanced Units 1 and 10 go deeper on the mean: it is the <b>balance point</b> of a line plot, and <b>outliers</b> can pull it far away.',
  lessons:[{id:'u10B1', name:'Balance & outliers', icon:'🎯', cards:[
    {t:'The mean balances the data', h:'<p>Put the data on a line plot like weights on a seesaw. The mean is where it balances.</p><p>2, 4, 6, 8, 10 → balance point 6.</p>'},
    {t:'Outliers', h:'<p>An <b>outlier</b> is far from the rest: 31, 33, 30, 34, <b>80</b>.</p>' + L.tbl(['','With 80','Without 80'], [['mean','41.6','32'],['median','33','32']]) + '<p>The mean jumped almost 10; the median moved 1.</p>', tr:bg.outl.f()}
  ]}],
  gens:bg, repIds:['outl','bal'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u10', lessons:lessons, test:test, bridge:bridge, gens:gens, repIds:['mean','median','count','prob']};
})();

Adapt.fromV2({
  id: 'u10', num: 10, emoji: '🎲', title: 'Data & Chance Lab',
  blurb: 'Probability, the counting principle, and a fresh look at center and range.', sol: ['5.PS.1', '5.PS.2', '5.PS.3'], dates: ['2027-05-03', '2027-05-14'], color: '#0e7490'
}, window.V2, { gUnit: 10, coreStds: ['5.PS.1', '5.PS.2', '5.PS.3'] });

