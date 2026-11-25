/* Unit 7: Compare & Percent Studio — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 7, Percent and Fraction Number Sense (FCPS unit; percent is enrichment, NS.1 on SOL) */
(function(){
var L = V2L, f = L.fr, mc = L.mc;
var lessons = [
 {id:'u7L1', name:'What percent means', icon:'💯', cards:[
  {t:'Per hundred', h:'<div class="big">40 out of 100 = ' + f(40,100) + ' = 0.40 = 40%</div><p>"Percent" literally means "per hundred" (cent = 100, like a century).</p>'},
  {t:'Benchmarks to know cold', h:'<p>These few percents, fractions and decimals show up everywhere. Know them by heart and you can compare and estimate fast.</p>' + L.tbl(['Percent','Fraction','Decimal'], [['100%','1 whole','1.0'],['50%',f(1,2),'0.5'],['25%',f(1,4),'0.25'],['75%',f(3,4),'0.75'],['10%',f(1,10),'0.1'],['20%',f(1,5),'0.2']]), trap:'5% is 0.05, not 0.5. 50% is 0.5.', tr:mc('Which is equal to 30%?', '0.3', [['0.03', '0.03 is 3%. 30% = 30 hundredths.'], ['3.0', 'That is 300%.'], [f(1,3), f(1,3) + ' ≈ 33%.']], '30% = ' + f(30,100) + ' = 0.30.')}
 ]},
 {id:'u7L2', name:'Convert all three', icon:'🔁', cards:[
  {t:'The triangle of names', h:'', steps:['<p><b>Fraction → decimal:</b> rename to tenths or hundredths. ' + f(3,20) + ' = ' + f(15,100) + ' = 0.15</p>', '<p><b>Decimal → percent:</b> how many hundredths? 0.15 = 15%</p>', '<p><b>Percent → fraction:</b> put it over 100 and simplify. 15% = ' + f(15,100) + ' = ' + f(3,20) + '</p>']},
  {t:'Your turn', h:'', tr:{type:'num', q:'Write ' + f(7,25) + ' as a percent. (Type the number only.)', a:28, why:f(7,25) + ' = ' + f(28,100) + ' = 28%.'}}
 ]},
 {id:'u7L3', name:'Compare everything', icon:'⚖️', cards:[
  {t:'Same form, then compare', h:'<div class="big">0.45 &nbsp; 48% &nbsp; ' + f(2,5) + '</div><p>All as decimals: 0.45, 0.48, 0.40. So ' + f(2,5) + ' &lt; 0.45 &lt; 48%.</p>', tr:{type:'order', q:'Order from <b>least to greatest</b>.', items:['0.6', '55%', f(5,8), f(1,2)], vals:[.6,.55,.625,.5], dir:'asc', why:'0.5, 0.55, 0.6, 0.625.'}}
 ]}
];
var test = [
 {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> values equal to ' + f(3,4) + '.', ch:['75%', '0.34', '0.75', f(75,100), '34%'], a:[0,2,3], why:f(3,4) + ' = ' + f(75,100) + ' = 0.75 = 75%. 0.34 glues the digits.'},
 {type:'order', fmt:'DRAG TO ORDER', q:'Order from <b>greatest to least</b>.', items:['9%', '0.2', f(3,10), '0.25'], vals:[.09,.2,.3,.25], dir:'desc', why:f(3,10) + ' = 0.30, 0.25, 0.20, 9% = 0.09.'},
 mc('In a survey, 13 of 20 students like soccer. What percent is that?', '65%', [['13%', 'The whole is 20, not 100. Rename: ' + f(13,20) + ' = ' + f(65,100) + '.'], ['35%', 'That is the students who do NOT like soccer.'], ['0.65%', '0.65 = 65%.']], f(13,20) + ' = ' + f(65,100) + ' = 65%.'),
 {type:'multi', fmt:'MULTI-PART', q:'A grid has 36 of its 100 squares shaded.<br>Part A: decimal for the shaded part?<br>Part B: percent NOT shaded?', parts:[{label:'A:', a:.36},{label:'B:', a:64, unit:'%'}], why:'0.36 shaded; 100 − 36 = 64% not shaded.'}
];
var bg = {
  cg: {name:'Circle graphs', f:function(lv){
    var parts = L.shuffle([[50,25,25],[40,30,20,10],[50,30,20],[60,25,15],[45,35,20]])[0], cats = L.shuffle(['Soccer','Swim','Art','Chess','Coding']).slice(0, parts.length), tot = L.pick([20,40,60,200]);
    var i = L.ri(0, parts.length - 1), n = parts[i] * tot / 100;
    if(n % 1) return null;
    var key = cats.map(function(c, k){ return c + ' ' + parts[k] + '%'; }).join(', ');
    return {type:'num', q:'A circle graph shows how ' + tot + ' students chose a club: ' + key + '. How many students chose <b>' + cats[i] + '</b>?', a:n, why:parts[i] + '% of ' + tot + ' = ' + f(parts[i],100) + ' × ' + tot + ' = ' + n + '.'};
  }},
  pof: {name:'Percent of a number', f:function(lv){
    var p = L.pick([10,20,25,50,75,30,40]), n = L.pick([20,40,60,80,120,200]); var v = p*n/100; if(v % 1) return null;
    return mc('What is ' + p + '% of ' + n + '?', String(v), [[String(n - v), 'That is the part left over.'], [String(p*n/10), 'Percent means out of 100.'], [String(p + n), 'Find a part of ' + n + ', do not add.']], p + '% = ' + f(p,100) + '; ' + f(p,100) + ' of ' + n + ' = ' + v + '.');
  }},
  cgmake: {name:'Make a circle graph', f:function(lv, kind){ for (var t = 0; t < 10; t++) { var it = cgQ(lv, kind); if (it) return it; } return null; }}
};
/* Make a circle graph: counts → fraction of the total → percent → slice (degrees for the stretch). */
function cgQ(lv, kind){
  var tot = L.pick([20, 25, 40, 50]), sets = {20:[[10,5,3,2],[8,6,4,2],[12,4,4],[9,7,4]], 25:[[10,10,5],[15,5,5],[12,8,5],[11,9,5]], 40:[[20,10,6,4],[16,12,8,4],[14,14,8,4]], 50:[[25,15,10],[20,15,10,5],[30,10,5,5]]};
  var cnt = L.pick(sets[tot]), cats = L.shuffle(['Soccer','Swim','Art','Chess','Coding']).slice(0, cnt.length), pct = cnt.map(function(c){ return c * 100 / tot; });
  var data = cats.map(function(c, i){ return c + ': ' + cnt[i]; }).join(', ');
  var k = kind != null ? kind : L.pick([0, 0, 1, 2, 3]), i = L.ri(0, cnt.length - 1);
  if (k === 0) return {type:'num', fmt:'TYPE IN', q:tot + ' students chose a club. ' + data + '. What percent of the circle graph should the <b>' + cats[i] + '</b> slice be?', a:pct[i], acc:[pct[i], pct[i] + '%'], placeholder:'%', why:cats[i] + ' is ' + cnt[i] + ' out of ' + tot + ': ' + f(cnt[i], tot) + ' = ' + f(pct[i], 100) + ' = <b>' + pct[i] + '%</b>.'};
  if (k === 1) {
    var right = cats.map(function(c, j){ return c + ' ' + pct[j] + '%'; }).join(', ');
    var asCount = cats.map(function(c, j){ return c + ' ' + cnt[j] + '%'; }).join(', ');
    if (asCount === right) return null;
    var off = pct.slice(); off[0] += 5; off[off.length - 1] -= 5; if (off[off.length - 1] <= 0) return null;
    var offTxt = cats.map(function(c, j){ return c + ' ' + off[j] + '%'; }).join(', ');
    var even = Math.round(100 / cnt.length), evenTxt = cats.map(function(c){ return c + ' ' + even + '%'; }).join(', ');
    return mc(tot + ' students chose a club. ' + data + '. Which percents make the circle graph?', right, [
      [asCount, 'Those are the counts, not percents. Divide each count by ' + tot + ' first.' + (tot === 100 ? '' : '')],
      [offTxt, 'Check ' + cats[0] + ': ' + cnt[0] + ' ÷ ' + tot + ' = ' + pct[0] + '%.'],
      [evenTxt, 'Equal slices only work when every group has the same count.']],
      cats.map(function(c, j){ return c + ' ' + f(cnt[j], tot) + ' = ' + pct[j] + '%'; }).join('; ') + '. Total: 100%.');
  }
  if (k === 2) { var p5 = L.pick([10, 20, 25, 30, 40, 50, 75, 15, 35]), deg = p5 * 360 / 100;
    return {type:'num', fmt:'TYPE IN', q:'A slice is <b>' + p5 + '%</b> of a circle graph. How many degrees is its angle? (A whole circle is 360°.)', a:deg, acc:[deg, deg + '°'], why:p5 + '% of 360° = ' + f(p5, 100) + ' × 360 = <b>' + deg + '°</b>.' + (p5 === 25 ? ' A quarter of the circle: a right angle.' : '')}; }
  var known = pct.slice(0, pct.length - 1), miss = 100 - known.reduce(function(a, b){ return a + b; }, 0), sumK = 100 - miss;
  return mc('A circle graph has slices ' + cats.slice(0, -1).map(function(c, j){ return c + ' ' + known[j] + '%'; }).join(', ') + ', and <b>' + cats[cats.length - 1] + '</b>. What percent is the ' + cats[cats.length - 1] + ' slice?', miss + '%', [
    [sumK + '%', 'That adds the other slices. The whole circle is 100%: 100 − ' + sumK + '.'], [(miss + 10) + '%', 'Recheck: 100 − ' + sumK + ' = ' + miss + '.'], [Math.round(100 / cats.length) + '%', 'Slices are not always equal.']],
    'All slices add to 100%. 100 − ' + sumK + ' = <b>' + miss + '%</b>.');
}
var bridge = {
  title:'Go Further: circle graphs', tab:'🚀 Go Further',
  intro:'The Advanced class opens the year with <b>circle graphs</b> (Advanced Unit 1) and comes back to them in Unit 10. A circle graph is just percents of a whole circle, so you are ready to read one and to make one from data.',
  lessons:[{id:'u7B1', name:'Reading circle graphs', icon:'🥧', cards:[
    {t:'The whole circle is 100%', h:'<svg viewBox="0 0 200 200" width="180" height="180" style="display:block;margin:auto"><circle cx="100" cy="100" r="80" fill="#0d1728" stroke="#1f4a6e" stroke-width="2"/><path d="M100 100 L100 20 A80 80 0 0 1 180 100 Z" fill="#00d9b5"/><path d="M100 100 L180 100 A80 80 0 0 1 100 180 Z" fill="#b6ff3c" opacity=".8"/><path d="M100 100 L100 180 A80 80 0 1 1 100 20 Z" fill="#00f6ff" opacity=".45"/><text x="125" y="70" fill="#03110d" font-weight="800" font-size="15">25%</text><text x="120" y="140" fill="#03110d" font-weight="800" font-size="15">25%</text><text x="45" y="105" fill="#eafffa" font-weight="800" font-size="15">50%</text></svg><p>Each slice is a percent of the total. All the slices add to 100%.</p>'},
    {t:'From percent to people', h:'<p>40 students. The "Art" slice is 25%. 25% = ' + f(1,4) + ', and ' + f(1,4) + ' of 40 = <b>10 students</b>.</p>', tr:bg.cg.f()}
  ]},{id:'u7B2', name:'Make a circle graph', icon:'🥧', cards:[
    {t:'Counts → percents', h:'<p>20 students chose a club.</p>' + L.tbl(['Club','Count','Fraction','Percent'], [['Soccer','10',f(10,20),'50%'],['Art','5',f(5,20),'25%'],['Chess','3',f(3,20),'15%'],['Swim','2',f(2,20),'10%']]) + '<p>The percents add to <b>100%</b>: the whole circle.</p>',
     steps:['Find the total: 10 + 5 + 3 + 2 = 20.', 'Each group: count ÷ total. 5 out of 20 = ' + f(5,20) + ' = ' + f(25,100) + ' = 25%.', 'Check: 50 + 25 + 15 + 10 = 100.'],
     trap:'Using the counts as percents. 10 students is not 10% when there are 20 students; it is 50%.',
     tries:[function(){ return bg.cgmake.f('adv', 0); }, function(){ return bg.cgmake.f('adv', 1); }]},
    {t:'Percents → slices', h:'<p>Draw a slice for each percent. 50% is half the circle, 25% is a quarter.</p>', viz:function(){ return (window.V && V.pie) ? V.pie([50, 25, 15, 10], ['Soccer', 'Art', 'Chess', 'Swim']) : ''; },
     key:'Biggest group, biggest slice. All the slices together make 100%.',
     aap:'Use degrees to draw exact slices: a circle is 360°, so 25% is 90° and 10% is 36°.',
     tries:[function(){ return bg.cgmake.f('adv', 3); }, function(){ return bg.cgmake.f('adv', 2); }]}
  ]}],
  gens:bg, repIds:['cg','pof','cgmake'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u7', lessons:lessons, test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u7', num: 7, emoji: '💯', title: 'Compare & Percent Studio',
  blurb: 'Compare and order fractions and decimals. Percents as another name.', sol: ['5.NS.1'], dates: ['2027-02-08', '2027-02-26'], color: '#c1121f'
}, window.V2, { gUnit: 7, coreStds: ['5.NS.1'] });

