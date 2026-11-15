/* Unit 9: Shape & Measure Lab — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 9, Geometry & Measurement (5.MG.2, 5.MG.3) */
(function(){
var L = V2L, f = L.fr, mc = L.mc;
function tri(b, h){ var W = 220, H = 150, s = Math.min(170 / b, 110 / h), x0 = 30, y0 = 130; return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="220" height="150" style="display:block;margin:6px auto"><polygon points="' + x0 + ',' + y0 + ' ' + (x0 + b*s) + ',' + y0 + ' ' + x0 + ',' + (y0 - h*s) + '" fill="rgba(0,217,181,.25)" stroke="#00f6ff" stroke-width="2.5"/><rect x="' + x0 + '" y="' + (y0 - 12) + '" width="12" height="12" fill="none" stroke="#b6ff3c" stroke-width="1.5"/><text x="' + (x0 + b*s/2) + '" y="' + (y0 + 17) + '" text-anchor="middle" fill="#eafffa" font-size="14" font-weight="700">' + b + ' cm</text><text x="' + (x0 - 6) + '" y="' + (y0 - h*s/2) + '" text-anchor="end" fill="#eafffa" font-size="14" font-weight="700">' + h + ' cm</text></svg>'; }
var lessons = [
 {id:'u9L1', name:'Angles & triangles', icon:'📐', cards:[
  {t:'Name the angle', h:L.tbl(['Angle','Size'], [['acute','less than 90°'],['right','exactly 90°'],['obtuse','between 90° and 180°'],['straight','exactly 180°']]) + '<p>The three angles inside any triangle add up to <b>180°</b>.</p>', key:'Missing angle: 180 − (the two you know).'},
  {t:'Classify triangles two ways', h:L.tbl(['By angles','By sides'], [['acute: all angles &lt; 90°','equilateral: 3 equal sides'],['right: one 90° angle','isosceles: at least 2 equal sides'],['obtuse: one angle &gt; 90°','scalene: no equal sides']]), trap:'An equilateral triangle IS also isosceles (it has at least 2 equal sides).', tr:{type:'num', q:'A triangle has angles of 47° and 68°. What is the third angle in degrees?', a:65, why:'180 − 47 − 68 = 65°.'}}
 ]},
 {id:'u9L2', name:'Area of a right triangle', icon:'🔺', cards:[
  {t:'Half a rectangle', h:tri(8, 5) + '<p>A right triangle is exactly half of a rectangle.</p><div class="big">A = ' + f(1,2) + ' × b × h = ' + f(1,2) + ' × 8 × 5 = 20 cm²</div>', trap:'Forgetting the ½. 8 × 5 = 40 is the whole rectangle.'},
  {t:'Your turn', h:tri(6, 9), tr:{type:'num', q:'Find the area of the right triangle above in cm².', a:27, why:f(1,2) + ' × 6 × 9 = 27 cm².'}}
 ]},
 {id:'u9L3', name:'Volume', icon:'📦', cards:[
  {t:'Layers of cubes', h:'<p>Volume counts the cubes that fill a box. A box 4 long, 3 wide and 2 tall holds 4 × 3 = 12 cubes per layer, and 2 layers.</p><div class="big">V = l × w × h = 4 × 3 × 2 = 24 cubic units</div>'},
  {t:'Perimeter, area or volume?', h:L.tbl(['Question asks about…','Use','Units'], [['a fence around a yard','perimeter','cm, m'],['carpet to cover a floor','area','cm², m²'],['water to fill a tank','volume','cm³, m³']]), tr:mc('Which measure tells how much sand fills a sandbox?', 'volume', [['area', 'Area covers a flat surface. Filling a box takes space in 3 directions.'], ['perimeter', 'Perimeter is the distance around.'], ['mass', 'Not one of the three measures here.']], 'Filling a 3-D space = volume.')}
 ]}
];
var test = [
 {type:'multi', fmt:'MULTI-PART', q:'A box is 6 cm long, 4 cm wide and 5 cm tall.<br>Part A: area of the base (cm²)?<br>Part B: volume (cm³)?', parts:[{label:'A:', a:24},{label:'B:', a:120}], why:'Base 6 × 4 = 24 cm². Volume 24 × 5 = 120 cm³.'},
 {type:'ms', fmt:'SELECT ALL', q:'A triangle has sides 7 cm, 7 cm and 7 cm. Select <b>all</b> names that fit.', ch:['equilateral', 'isosceles', 'scalene', 'acute', 'right'], a:[0,1,3], why:'3 equal sides → equilateral and isosceles; all angles are 60° → acute.'},
 {type:'num', fmt:'TYPE IN', q:'A right triangle has legs of 12 m and 7 m. What is its area in m²?', a:42, why:f(1,2) + ' × 12 × 7 = 42 m².'},
 mc('An angle measures 105°. What kind of angle is it?', 'obtuse', [['acute', 'Acute is less than 90°.'], ['right', 'Right is exactly 90°.'], ['straight', 'Straight is 180°.']], '105° is between 90° and 180°.')
];
var bg = {
  circ: {name:'Circumference', f:function(lv){
    var r = L.ri(2, 10), useD = Math.random() < .5, C = Math.round(2 * 3.14 * r * 100) / 100;
    return {type:'num', q:'A circle has a ' + (useD ? 'diameter of ' + 2*r : 'radius of ' + r) + ' cm. Using π ≈ 3.14, what is its circumference in cm?', a:C, tol:.02, why:'C = π × d = 3.14 × ' + 2*r + ' = ' + C + ' cm.' + (useD ? '' : ' (diameter = 2 × radius = ' + 2*r + ')')};
  }},
  para: {name:'Parallelogram area', f:function(lv){
    var b = L.ri(3, 15), h = L.ri(2, 12), s = h + L.ri(1, 4);
    return mc('A parallelogram has base ' + b + ' cm, height ' + h + ' cm and slanted side ' + s + ' cm. What is its area?', b*h + ' cm²', [[b*s + ' cm²', 'Use the HEIGHT (straight up), not the slanted side.'], [b*h/2 + ' cm²', 'That is a triangle. A parallelogram is a full rectangle in disguise.'], [2*(b+s) + ' cm²', 'That is the perimeter.']], 'A = b × h = ' + b + ' × ' + h + ' = ' + b*h + ' cm².');
  }}
};
var bridge = {
  title:'Go Further: circles & parallelograms', tab:'🚀 Go Further',
  intro:'Advanced Unit 9 covers <b>circles</b> (radius, diameter, circumference, π) and the area of <b>parallelograms and all triangles</b>.',
  lessons:[{id:'u9B1', name:'Circles & π', icon:'⚫', cards:[
    {t:'Parts of a circle', h:L.tbl(['Part','Meaning'], [['radius (r)','center to edge'],['diameter (d)','edge to edge through the center = 2r'],['circumference (C)','distance around']]) + '<p>For every circle, C ÷ d ≈ <b>3.14</b>. That number is π (pi).</p><div class="big">C = π × d</div>'},
    {t:'Parallelogram = rectangle in disguise', h:'<p>Slice a triangle off one side and slide it to the other: you get a rectangle with the same base and height.</p><div class="big">A = b × h</div>', trap:'Use the straight-up height, not the slanted side.', tr:bg.para.f()}
  ]}],
  gens:bg, repIds:['circ','para'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u9', lessons:lessons, test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u9', num: 9, emoji: '📐', title: 'Shape & Measure Lab',
  blurb: 'Angles, triangles, right-triangle area, and volume.', sol: ['5.MG.2', '5.MG.3'], dates: ['2027-03-29', '2027-04-30'], color: '#1d4ed8'
}, window.V2, { gUnit: 9, coreStds: ['5.MG.2', '5.MG.3'] });

