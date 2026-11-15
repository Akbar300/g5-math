/* Unit 7: Compare & Percent Studio — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 7, Percent and Fraction Number Sense (FCPS unit; percent is enrichment, NS.1 on SOL) */
(function(){
var L = V2L, f = L.fr, mc = L.mc;
var lessons = [
 {id:'u7L1', name:'What percent means', icon:'💯', cards:[
  {t:'Per hundred', h:L.grid100(40) + '<div class="big">40 out of 100 = ' + f(40,100) + ' = 0.40 = 40%</div><p>"Percent" literally means "per hundred" (cent = 100, like a century).</p>'},
  {t:'Benchmarks to know cold', h:L.tbl(['Percent','Fraction','Decimal'], [['100%','1 whole','1.0'],['50%',f(1,2),'0.5'],['25%',f(1,4),'0.25'],['75%',f(3,4),'0.75'],['10%',f(1,10),'0.1'],['20%',f(1,5),'0.2']]), trap:'5% is 0.05, not 0.5. 50% is 0.5.', tr:mc('Which is equal to 30%?', '0.3', [['0.03', '0.03 is 3%. 30% = 30 hundredths.'], ['3.0', 'That is 300%.'], [f(1,3), f(1,3) + ' ≈ 33%.']], '30% = ' + f(30,100) + ' = 0.30.')}
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
  }}
};
var bridge = {
  title:'Go Further: circle graphs', tab:'🚀 Go Further',
  intro:'The Advanced class opens the year with <b>circle graphs</b> (Advanced Unit 1) and comes back to them in Unit 10. A circle graph is just percents of a whole circle, so you are ready.',
  lessons:[{id:'u7B1', name:'Reading circle graphs', icon:'🥧', cards:[
    {t:'The whole circle is 100%', h:'<svg viewBox="0 0 200 200" width="180" height="180" style="display:block;margin:auto"><circle cx="100" cy="100" r="80" fill="#0d1728" stroke="#1f4a6e" stroke-width="2"/><path d="M100 100 L100 20 A80 80 0 0 1 180 100 Z" fill="#00d9b5"/><path d="M100 100 L180 100 A80 80 0 0 1 100 180 Z" fill="#b6ff3c" opacity=".8"/><path d="M100 100 L100 180 A80 80 0 1 1 100 20 Z" fill="#00f6ff" opacity=".45"/><text x="125" y="70" fill="#03110d" font-weight="800" font-size="15">25%</text><text x="120" y="140" fill="#03110d" font-weight="800" font-size="15">25%</text><text x="45" y="105" fill="#eafffa" font-weight="800" font-size="15">50%</text></svg><p>Each slice is a percent of the total. All the slices add to 100%.</p>'},
    {t:'From percent to people', h:'<p>40 students. The "Art" slice is 25%. 25% = ' + f(1,4) + ', and ' + f(1,4) + ' of 40 = <b>10 students</b>.</p>', tr:bg.cg.f()}
  ]}],
  gens:bg, repIds:['cg','pof'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u7', lessons:lessons, test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u7', num: 7, emoji: '💯', title: 'Compare & Percent Studio',
  blurb: 'Compare and order fractions and decimals. Percents as another name.', sol: ['5.NS.1'], dates: ['2027-02-08', '2027-02-26'], color: '#c1121f'
}, window.V2, { gUnit: 7, coreStds: ['5.NS.1'] });

