/* Unit 6: Metric Lab — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 6, Metric Measurement (5.MG.1) */
(function(){
var L = V2L, mc = L.mc;
var lessons = [
 {id:'u6L1', name:'The metric ladder', icon:'🪜', cards:[
  {t:'Everything is powers of 10', h:L.tbl(['Unit','How many'], [['1 kilometer (km)','1000 meters'],['1 meter (m)','100 centimeters'],['1 centimeter (cm)','10 millimeters'],['1 kilogram (kg)','1000 grams'],['1 liter (L)','1000 milliliters']]) + '<p><b>kilo</b> = 1000, <b>centi</b> = one hundredth, <b>milli</b> = one thousandth.</p>', key:'On the SOL the equivalence is given to you (like 1 m = 100 cm). Your job is to use it the right way.'},
  {t:'Big unit → small unit: multiply', h:'<p>Going to a <b>smaller</b> unit, you need <b>more</b> of them, so multiply.</p><div class="big">3.5 m = 3.5 × 100 = 350 cm</div>', trap:'Dividing when you should multiply. Ask: should the number get bigger or smaller?'},
  {t:'Small unit → big unit: divide', h:'<div class="big">2400 g = 2400 ÷ 1000 = 2.4 kg</div><p>Fewer of the big units, so the number gets smaller.</p>', tr:{type:'num', q:'1 kilogram = 1000 grams. How many kilograms is 3750 grams?', a:3.75, why:'Small → big: divide. 3750 ÷ 1000 = 3.75 kg.'}}
 ]},
 {id:'u6L2', name:'Choose the unit', icon:'📏', cards:[
  {t:'Benchmarks', h:'<p>A benchmark is a real thing you already know the size of. Use it to judge whether an answer is reasonable and to pick the right unit.</p>' + L.tbl(['About…','is'], [['1 millimeter','the thickness of a dime'],['1 centimeter','the width of a fingernail'],['1 meter','a big step / a doorknob\'s height'],['1 kilometer','a 12-minute walk'],['1 gram','a paper clip'],['1 kilogram','a textbook'],['1 milliliter','a few drops'],['1 liter','a big water bottle']])},
  {t:'Pick the best unit', h:'', tr:mc('Which unit is best for the mass of a dog?', 'kilograms', [['grams', 'A dog is much heavier than a paper clip. Grams would be a huge number.'], ['liters', 'Liters measure liquid volume, not mass.'], ['centimeters', 'That measures length.']], 'A dog weighs about as much as 10-30 textbooks, so kilograms.')}
 ]},
 {id:'u6L3', name:'Multi-step problems', icon:'🧩', cards:[
  {t:'Convert first, then compute', h:'<p>A ribbon is 2 m long. Kai cuts off 45 cm. How much is left? (1 m = 100 cm)</p>', steps:['<p>Same units first: 2 m = 200 cm.</p>', '<p>200 − 45 = <b>155 cm</b>.</p>'], trap:'Subtracting 45 from 2. The units must match before you compute.'},
  {t:'Your turn', h:'', tr:{type:'num', q:'A jug holds 2 L of juice. Each cup is 250 mL. How many cups can be filled? (1 L = 1000 mL)', a:8, why:'2 L = 2000 mL. 2000 ÷ 250 = 8 cups.'}}
 ]}
];
var test = [
 {type:'num', fmt:'TYPE IN', q:'1 meter = 100 centimeters. A shelf is 1.8 meters long. How many centimeters is that?', a:180, why:'Big → small: multiply. 1.8 × 100 = 180 cm.'},
 {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> measurements equal to 4.5 kilograms. (1 kg = 1000 g)', ch:['4500 g', '450 g', '4.5 kg', '45000 g', '4500 kg'], a:[0,2], why:'4.5 × 1000 = 4500 g.'},
 {type:'order', fmt:'DRAG TO ORDER', q:'Order these lengths from <b>shortest to longest</b>. (1 m = 100 cm, 1 cm = 10 mm)', items:['1.2 m', '95 cm', '1500 mm', '1 m'], vals:[120, 95, 150, 100], dir:'asc', why:'In cm: 95, 100, 120, 150.'},
 {type:'multi', fmt:'MULTI-PART', q:'A runner jogs 1.5 km, then walks 800 m. (1 km = 1000 m)<br>Part A: total meters?<br>Part B: total kilometers?', parts:[{label:'A:', a:2300, unit:'m'},{label:'B:', a:2.3, unit:'km'}], why:'1.5 km = 1500 m. 1500 + 800 = 2300 m = 2.3 km.'},
 mc('Which is the most reasonable volume of a bathtub?', '200 liters', [['200 milliliters', 'That is less than a juice box.'], ['2 liters', 'That is just one big bottle.'], ['200 kilograms', 'Kilograms measure mass, not liquid volume.']], 'A bathtub holds about 100 big water bottles: 200 L.')
];
var bg = {
  urate: {name:'Unit rates', f:function(lv){
    var r = L.ri(2, 12), q = L.ri(3, 9), T = L.pick([['meters','seconds'],['dollars','pounds'],['pages','minutes'],['milliliters','cups']]);
    return {type:'num', q:r*q + ' ' + T[0] + ' in ' + q + ' ' + T[1] + '. How many ' + T[0] + ' per ONE ' + T[1].replace(/s$/,'') + '?', a:r, why:r*q + ' ÷ ' + q + ' = ' + r + '. That is the unit rate.'};
  }},
  rtab: {name:'Conversion tables', f:function(lv){
    var k = L.pick([[100,'m','cm'],[1000,'kg','g'],[1000,'L','mL'],[10,'cm','mm']]), a = L.ri(2, 9);
    return {type:'num', q:'Finish the ratio table.' + L.tbl([k[1], '1', '2', String(a)], [[k[2], String(k[0]), String(2*k[0]), '?']]), a:a*k[0], why:'Every row keeps the same ratio: 1 ' + k[1] + ' : ' + k[0] + ' ' + k[2] + '. ' + a + ' × ' + k[0] + ' = ' + a*k[0] + '.'};
  }},
  prop: {name:'Proportions', f:function(lv, kind){
    for (var t = 0; t < 8; t++) { var it = propQ(lv, kind); if (it) return it; } return null;
  }},
  buy: {name:'Better buy', f:function(lv, kind){ return buyQ(lv, kind); }}
};
function propQ(lv, kind){
  {
    /* Missing value in a proportional table, "is it proportional?", equivalent ratios. Whole-number unit rates. */
    var C = L.pick([['hours','miles'],['packs','cards'],['minutes','pages'],['bags','apples'],['days','dollars saved']]);
    var k = kind != null ? kind : L.pick([0, 0, 1, 1, 2, 2, 3]);
    if (k === 0 || k === 1) {
      var r = L.ri(2, 12), a = L.ri(2, 5), b = a + L.ri(2, 6), add = b*r - a*r, addTrap = a*r + (b - a);
      var tb = L.tbl([C[0], String(a), String(b)], [[C[1], String(a*r), '?']]);
      if (k === 0) return {type:'num', fmt:'TYPE IN', q:'This table is proportional. What is the missing value?' + tb, a:b*r, why:'Unit rate: ' + a*r + ' ÷ ' + a + ' = ' + r + ' ' + C[1] + ' per 1. Then ' + b + ' × ' + r + ' = <b>' + b*r + '</b>.'};
      return mc('This table is proportional. What is the missing value?' + tb, String(b*r), [
        [String(addTrap), 'That adds ' + (b - a) + ' to the top AND the bottom. Proportional means multiply by the same rate: ' + r + ' ' + C[1] + ' per 1.'],
        [String(r), 'That is the unit rate (for 1). Now multiply by ' + b + '.'],
        [String(b*r + r), 'Check: ' + b + ' × ' + r + ' = ' + b*r + '.']],
        a*r + ' ÷ ' + a + ' = ' + r + ' per 1, so ' + b + ' × ' + r + ' = <b>' + b*r + '</b>.');
    }
    if (k === 2) {
      var m = L.ri(2, 8), x0 = L.ri(1, 3), xs = [x0, x0 + 1, x0 + 3, x0 + 5], yes = Math.random() < .5, plus = L.ri(1, 5);
      var ys = xs.map(function(x){ return yes ? m*x : m*x + plus; });
      return mc('Is this table proportional?' + L.tbl(['x'].concat(xs), [['y'].concat(ys)]), yes ? 'Yes: y ÷ x is ' + m + ' every time' : 'No: y ÷ x changes', [
        [yes ? 'No: y ÷ x changes' : 'Yes: y ÷ x is ' + m + ' every time', 'Divide y ÷ x for EVERY column. ' + (yes ? 'They all equal ' + m + '.' : ys[0] + ' ÷ ' + xs[0] + ' and ' + ys[2] + ' ÷ ' + xs[2] + ' are different.')],
        ['Yes: y always goes up', 'Going up is not enough. y ÷ x has to stay the same.'],
        ['No: the x-values skip numbers', 'Skipping is fine. Check y ÷ x in each column.']],
        yes ? 'Every y ÷ x = ' + m + ', so it is proportional (y = ' + m + ' × x).' : 'y ÷ x is not the same in every column (each y has ' + plus + ' extra), so it is not proportional.');
    }
    var u = L.ri(2, 9), ch = [], seen = {};
    [1, 2, 3, 4, 5, 6, 7, 8].forEach(function(n){ if (ch.length < 5 && Math.random() < .6) { var right = ch.filter(function(c){ return c.ok; }).length < 3 && Math.random() < .55, top = right ? u*n : u*n + L.pick([1, -1, u]); if (top > 0 && !seen[top + ':' + n]) { seen[top + ':' + n] = 1; ch.push({t:top + ' : ' + n, ok:top === u*n}); } } });
    if (ch.length < 4 || !ch.some(function(c){ return c.ok; }) || ch.every(function(c){ return c.ok; })) return null;
    ch = L.shuffle(ch);
    return {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> the ratios that match a unit rate of <b>' + u + ' per 1</b>.', ch:ch.map(function(c){ return c.t; }), a:ch.map(function(c, i){ return c.ok ? i : -1; }).filter(function(i){ return i >= 0; }), why:'Divide the first number by the second: it must be ' + u + '. ' + ch.map(function(c){ var p = c.t.split(' : '); return c.t + (c.ok ? ' → ' + u + ' ✓' : ' → not ' + u); }).join('; ') + '.'};
  }
}
function buyQ(lv, kind){
  {
    /* Unit prices in whole cents, so every answer is exact money. */
    var I = L.pick([['notebooks','notebook'],['granola bars','granola bar'],['juice boxes','juice box'],['markers','marker'],['ounces of cereal','ounce']]);
    var n1 = L.ri(2, 6), n2 = n1 + L.ri(2, 6), c1 = 5 * L.ri(6, 40), d = 5 * L.ri(1, 4) * (Math.random() < .5 ? -1 : 1), c2 = c1 + d;
    if (c2 <= 0) return null;
    var p1 = c1 * n1, p2 = c2 * n2, usd = function(c){ return '$' + (c / 100).toFixed(2); }, best = c1 < c2 ? 'A' : 'B';
    var k = kind != null ? kind : L.pick([0, 0, 1, 2]);
    var stores = 'Store A: <b>' + n1 + ' ' + I[0] + ' for ' + usd(p1) + '</b>. Store B: <b>' + n2 + ' ' + I[0] + ' for ' + usd(p2) + '</b>.';
    var why = 'Price for one: A ' + usd(p1) + ' ÷ ' + n1 + ' = ' + usd(c1) + ', B ' + usd(p2) + ' ÷ ' + n2 + ' = ' + usd(c2) + '. The lower price for one is the better buy.';
    if (k === 0) {
      var lowerTotal = p1 < p2 ? 'A' : 'B';
      return mc(stores + ' Which is the better buy?', 'Store ' + best + ' (' + usd(Math.min(c1, c2)) + ' each)', [
        ['Store ' + (best === 'A' ? 'B' : 'A') + ' (' + usd(Math.max(c1, c2)) + ' each)', 'Compare the price for ONE, not the total.'],
        lowerTotal !== best ? ['Store ' + lowerTotal + ', because it costs less in all', 'A lower total buys fewer ' + I[0] + '. Compare the price for one.'] : best === 'A' ? ['Store B, because you get more', 'More ' + I[0] + ' is not always cheaper. Compare the price for one.'] : null,
        ['They are the same deal', 'Find each price for one: ' + usd(c1) + ' and ' + usd(c2) + '.']].filter(Boolean), why);
    }
    if (k === 1) { var w = Math.random() < .5 ? 1 : 2, nn = w === 1 ? n1 : n2, pp = w === 1 ? p1 : p2, cc = w === 1 ? c1 : c2, v = cc / 100;
      return {type:'num', fmt:'TYPE IN', q:(w === 1 ? 'Store A' : 'Store B') + ' sells <b>' + nn + ' ' + I[0] + ' for ' + usd(pp) + '</b>. What is the price for one ' + I[1] + ', in dollars?', a:v, acc:[v, v.toFixed(2), '$' + v.toFixed(2), '$' + L.num(v)], placeholder:'$0.00', why:usd(pp) + ' ÷ ' + nn + ' = <b>' + usd(cc) + '</b> per ' + I[1] + '.'}; }
    var save = Math.abs(c1 - c2) / 100;
    return {type:'num', fmt:'TYPE IN', q:stores + ' How much do you save on <b>each</b> ' + I[1] + ' at the better store, in dollars?', a:save, acc:[save, save.toFixed(2), '$' + save.toFixed(2), '$' + L.num(save)], placeholder:'$0.00', why:why + ' ' + usd(Math.max(c1, c2)) + ' − ' + usd(Math.min(c1, c2)) + ' = <b>' + usd(Math.abs(c1 - c2)) + '</b> saved on each.'};
  }
}
var bridge = {
  title:'Go Further: conversions are ratios', tab:'🚀 Go Further',
  intro:'Every metric conversion is a <b>ratio</b>: 1 m : 100 cm. Advanced Unit 8 (Proportional Reasoning) builds on exactly this with <b>unit rates</b>, <b>ratio tables</b>, <b>proportions</b> and the <b>better buy</b>.',
  lessons:[{id:'u6B1', name:'Unit rates', icon:'⚡', cards:[
    {t:'A conversion table is a ratio table', h:L.tbl(['m','1','2','5','7'], [['cm','100','200','500','700']]) + '<p>Each column is the same ratio. "100 cm per 1 m" is a <b>unit rate</b>.</p>'},
    {t:'Rates for one', h:'<p>A car drives 180 km in 3 hours. Unit rate: 180 ÷ 3 = <b>60 km per hour</b>.</p>', tr:bg.urate.f()}
  ]},{id:'u6B2', name:'Proportions & better buy', icon:'🏷️', cards:[
    {t:'Missing value: find the rate for one', h:L.tbl(['hours','2','5','8'], [['miles','90','?','?']]) + '<p>Rate for one: 90 ÷ 2 = <b>45 miles per hour</b>. Then 5 × 45 = 225 and 8 × 45 = 360.</p>',
     steps:['Find the rate for 1: divide the bottom by the top in a full column.', 'Multiply that rate by the new top number.', 'Check: 225 ÷ 5 = 45, the same rate.'],
     trap:'Adding instead of multiplying: 2 → 5 is + 3, but 90 + 3 = 93 is wrong. A proportion keeps the same rate, not the same difference.',
     tries:[function(){ return bg.prop.f('adv', 0); }, function(){ return bg.prop.f('adv', 1); }]},
    {t:'Is it proportional?', h:'<p>A table is <b>proportional</b> when y ÷ x is the <b>same in every column</b>.</p>' + L.tbl(['x','1','2','4'], [['y','3','6','12']]) + '<p>3 ÷ 1 = 6 ÷ 2 = 12 ÷ 4 = 3. Yes! On a graph it is a straight line through (0, 0).</p>',
     trap:'A table that always goes up is not automatically proportional. x = 1, 2, 3 with y = 5, 7, 9 goes up, but 5 ÷ 1 is not 7 ÷ 2.',
     tries:[function(){ return bg.prop.f('adv', 2); }, function(){ return bg.prop.f('adv', 3); }]},
    {t:'Better buy: price for one', h:'<p>Store A: 3 notebooks for $2.40. Store B: 5 notebooks for $3.75.</p>' + L.tbl(['Store','Price for one'], [['A','$2.40 ÷ 3 = $0.80'],['B','$3.75 ÷ 5 = <b>$0.75</b>']]) + '<p>B costs less for each notebook, so <b>B is the better buy</b>.</p>',
     key:'Better buy = lower price for ONE. Divide the price by how many.',
     trap:'Picking the smaller total. $2.40 is less than $3.75, but it buys fewer notebooks.',
     aap:'Compare without dividing. Make the amounts match: 15 notebooks cost 5 × $2.40 = $12 at A, and 3 × $3.75 = $11.25 at B.',
     tries:[function(){ return bg.buy.f('adv', 0); }, function(){ return bg.buy.f('adv', 1); }]}
  ]}],
  gens:bg, repIds:['urate','rtab','prop','buy'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u6', lessons:lessons, test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u6', num: 6, emoji: '⚖️', title: 'Metric Lab',
  blurb: 'Length, mass, and liquid volume in metric units, including conversions.', sol: ['5.MG.1'], dates: ['2027-01-19', '2027-02-05'], color: '#0a7a4b'
}, window.V2, { gUnit: 6, coreStds: ['5.MG.1'] });

