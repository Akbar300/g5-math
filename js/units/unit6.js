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
  }}
};
var bridge = {
  title:'Go Further: conversions are ratios', tab:'🚀 Go Further',
  intro:'Every metric conversion is a <b>ratio</b>: 1 m : 100 cm. Advanced Unit 8 (Proportional Reasoning) builds on exactly this with <b>unit rates</b> and <b>ratio tables</b>. Proportions and the better buy are in Unit 4 Advanced, with the other ratio lessons.',
  lessons:[{id:'u6B1', name:'Unit rates', icon:'⚡', cards:[
    {t:'A conversion table is a ratio table', h:L.tbl(['m','1','2','5','7'], [['cm','100','200','500','700']]) + '<p>Each column is the same ratio. "100 cm per 1 m" is a <b>unit rate</b>.</p>'},
    {t:'Rates for one', h:'<p>A car drives 180 km in 3 hours. Unit rate: 180 ÷ 3 = <b>60 km per hour</b>.</p>', tr:bg.urate.f()}

  ]}],
  gens:bg, repIds:['urate','rtab'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u6', lessons:lessons, test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u6', num: 6, emoji: '⚖️', title: 'Metric Lab',
  blurb: 'Length, mass, and liquid volume in metric units, including conversions.', sol: ['5.MG.1'], dates: ['2027-01-19', '2027-02-05'], color: '#0a7a4b'
}, window.V2, { gUnit: 6, coreStds: ['5.MG.1'] });

