/* Unit 9: Shape & Measure Lab — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 9, Geometry & Measurement (5.MG.2, 5.MG.3) */
window.EX_POPOUT = true;   /* Unit 9: Watch it pops out on big screens (js/watchmodal.js) */
(function(){
var L = V2L, f = L.fr, mc = L.mc;
/* Circle area picture: 8 wedges re-stacked into a near-rectangle, pi x r long and r tall (arc coordinates computed, 45° sectors). */
var WEDGES = '<svg viewBox="0 0 340 150" role="img" aria-label="A circle cut into 8 wedges. The wedges lined up point up, point down make a shape close to a rectangle about pi times r long and r tall." style="width:100%;max-width:440px;display:block;margin:0 auto"><path d="M62 80L62.0 30.0A50 50 0 0 1 97.4 44.6Z" fill="currentColor" fill-opacity=".45" stroke="currentColor" stroke-width="1.5"/><path d="M62 80L97.4 44.6A50 50 0 0 1 112.0 80.0Z" fill="var(--ic-soft)" stroke="currentColor" stroke-width="1.5"/><path d="M62 80L112.0 80.0A50 50 0 0 1 97.4 115.4Z" fill="currentColor" fill-opacity=".45" stroke="currentColor" stroke-width="1.5"/><path d="M62 80L97.4 115.4A50 50 0 0 1 62.0 130.0Z" fill="var(--ic-soft)" stroke="currentColor" stroke-width="1.5"/><path d="M62 80L62.0 130.0A50 50 0 0 1 26.6 115.4Z" fill="currentColor" fill-opacity=".45" stroke="currentColor" stroke-width="1.5"/><path d="M62 80L26.6 115.4A50 50 0 0 1 12.0 80.0Z" fill="var(--ic-soft)" stroke="currentColor" stroke-width="1.5"/><path d="M62 80L12.0 80.0A50 50 0 0 1 26.6 44.6Z" fill="currentColor" fill-opacity=".45" stroke="currentColor" stroke-width="1.5"/><path d="M62 80L26.6 44.6A50 50 0 0 1 62.0 30.0Z" fill="var(--ic-soft)" stroke="currentColor" stroke-width="1.5"/><path d="M140.0 105A50 50 0 0 0 178.3 105L159.1 55Z" fill="currentColor" fill-opacity=".45" stroke="currentColor" stroke-width="1.5"/><path d="M159.1 55A50 50 0 0 1 197.4 55L178.3 105Z" fill="var(--ic-soft)" stroke="currentColor" stroke-width="1.5"/><path d="M178.3 105A50 50 0 0 0 216.5 105L197.4 55Z" fill="currentColor" fill-opacity=".45" stroke="currentColor" stroke-width="1.5"/><path d="M197.4 55A50 50 0 0 1 235.7 55L216.5 105Z" fill="var(--ic-soft)" stroke="currentColor" stroke-width="1.5"/><path d="M216.5 105A50 50 0 0 0 254.8 105L235.7 55Z" fill="currentColor" fill-opacity=".45" stroke="currentColor" stroke-width="1.5"/><path d="M235.7 55A50 50 0 0 1 273.9 55L254.8 105Z" fill="var(--ic-soft)" stroke="currentColor" stroke-width="1.5"/><path d="M254.8 105A50 50 0 0 0 293.1 105L273.9 55Z" fill="currentColor" fill-opacity=".45" stroke="currentColor" stroke-width="1.5"/><path d="M273.9 55A50 50 0 0 1 312.2 55L293.1 105Z" fill="var(--ic-soft)" stroke="currentColor" stroke-width="1.5"/><path d="M62 80H112" stroke="var(--ic)" stroke-width="3" stroke-linecap="round"/><text x="87" y="73" text-anchor="middle" font-size="18" font-weight="800" fill="var(--ic)">r</text><path d="M118 80h12M125 75l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 40H312M140 35v10M312 35v10" fill="none" stroke="var(--ic)" stroke-width="2.5" stroke-linecap="round"/><text x="226" y="28" text-anchor="middle" font-size="19" font-weight="800" fill="var(--ic)">about π × r</text><path d="M326 55V105M321 55h10M321 105h10" fill="none" stroke="var(--ic)" stroke-width="2.5" stroke-linecap="round"/><text x="326" y="128" text-anchor="middle" font-size="18" font-weight="800" fill="var(--ic)">r</text></svg>';
function tri(b, h){ return GV.rtri(b, h, 'cm'); }
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
  carea: {name:'Circle area', f:function(lv, kind){
    /* A = 3.14 × r × r. Traps: circumference instead of area, the diameter squared, r × 2 for r². */
    var r2 = function(x){ return Math.round(x * 100) / 100; }, r = L.ri(3, 10), A = r2(3.14 * r * r), u = L.pick(['cm', 'm', 'in', 'ft']);
    var k = kind != null ? kind : L.pick([0, 0, 1, 2, 2, 3, 4, 5]);
    if (k === 0) return {type:'num', fmt:'TYPE IN', q:'A circle has a radius of ' + r + ' ' + u + '. Using π ≈ 3.14, what is its area in ' + u + '²?', a:A, why:'A = π × r × r = 3.14 × ' + r + ' × ' + r + ' = 3.14 × ' + r*r + ' = <b>' + A + ' ' + u + '²</b>.'};
    if (k === 1) return mc('A circle has a <b>diameter</b> of ' + 2*r + ' ' + u + '. What is its area? (π ≈ 3.14)', A + ' ' + u + '²', [
      [r2(3.14 * 4 * r * r) + ' ' + u + '²', 'That uses the diameter in r × r. Halve it first: r = ' + r + '.'],
      [r2(3.14 * 2 * r) + ' ' + u + '²', 'That is the circumference (π × d). Area uses r × r.'],
      [r*r + ' ' + u + '²', 'That is only ' + r + ' × ' + r + '. Multiply by π ≈ 3.14 too.']],
      'r = ' + 2*r + ' ÷ 2 = ' + r + '. A = 3.14 × ' + r + ' × ' + r + ' = <b>' + A + ' ' + u + '²</b>.');
    if (k === 2) return mc('Find the area of a circle with radius ' + r + ' ' + u + ' (π ≈ 3.14).', A + ' ' + u + '²', [
      [r2(3.14 * 2 * r) + ' ' + u + '²', 'That is the circumference. Area = π × r × r.'],
      [r2(3.14 * 4 * r * r) + ' ' + u + '²', 'Use the RADIUS, not the diameter.'],
      [r*r + ' ' + u + '²', 'That is only ' + r + ' × ' + r + '. Multiply by π ≈ 3.14 too.']],
      'A = 3.14 × ' + r + ' × ' + r + ' = <b>' + A + ' ' + u + '²</b>.');
    if (k === 3) { u = L.pick(['m', 'ft']); var C = r2(3.14 * 2 * r), cover = Math.random() < .5, T = L.pick([['a round garden', 'fence goes around', 'grass covers'], ['a round rug', 'trim goes around the edge of', 'floor is covered by'], ['a round pool cover', 'rope goes around', 'cloth makes']]);
      return mc('A circle has radius ' + r + ' ' + u + '. How much ' + (cover ? T[2].split(' ')[0] + ' ' + T[2].split(' ').slice(1).join(' ') : T[1].split(' ')[0] + ' ' + T[1].split(' ').slice(1).join(' ')) + ' ' + T[0] + '? (π ≈ 3.14)', cover ? A + ' ' + u + '²' : C + ' ' + u, [
        [cover ? C + ' ' + u : A + ' ' + u + '²', cover ? 'That is the distance around. Covering the inside is area: π × r × r.' : 'That is the area inside. Going around is the circumference: π × d.'],
        [cover ? A + ' ' + u : C + ' ' + u + '²', cover ? 'Area is in square units (' + u + '²).' : 'A distance around is in plain units (' + u + ').'],
        [cover ? C + ' ' + u + '²' : A + ' ' + u, 'Pick the right formula AND the right units.']],
        cover ? 'Covering = area: 3.14 × ' + r + ' × ' + r + ' = <b>' + A + ' ' + u + '²</b>.' : 'Around = circumference: 3.14 × ' + 2*r + ' = <b>' + C + ' ' + u + '</b>.'); }
    if (k === 4) { var e = 3 * r * r;
      return mc('Estimate the area of a circle with radius ' + r + ' ' + u + '. Use π ≈ 3.', 'about ' + e + ' ' + u + '²', [
        ['about ' + 6*r + ' ' + u + '²', 'That is about the circumference (3 × d). Area: 3 × r × r.'],
        ['about ' + 12*r*r + ' ' + u + '²', 'That squares the diameter. Use the radius.'],
        ['about ' + r*r + ' ' + u + '²', 'That is one r × r square. A circle holds about 3 of them.']],
        '3 × ' + r + ' × ' + r + ' = ' + e + ', so about <b>' + e + ' ' + u + '²</b> (exact with 3.14: ' + A + ').'); }
    var rr = 2 * L.ri(1, 5), half = r2(3.14 * rr * rr / 2);
    return {type:'num', fmt:'TYPE IN', q:'A <b>half circle</b> has a radius of ' + rr + ' ' + u + '. What is its area in ' + u + '²? (π ≈ 3.14)', a:half, why:'Whole circle: 3.14 × ' + rr + ' × ' + rr + ' = ' + r2(3.14 * rr * rr) + '. Half of it: <b>' + half + ' ' + u + '²</b>.'};
  }},
  cyl: {name:'Cylinder volume (Go Further)', f:function(lv, kind){
    var k = kind != null ? kind : L.pick([0, 1, 1, 2]);
    var r2 = function(x){ return Math.round(x * 100) / 100; }, r = L.ri(k === 1 ? 3 : 1, 5), h = L.ri(2, 10), u = k === 1 ? L.pick(['cm', 'in']) : L.pick(['cm', 'in', 'm']), V = r2(3.14 * r * r * h);
    if (k === 0) return {type:'num', fmt:'TYPE IN', q:'A cylinder has a radius of ' + r + ' ' + u + ' and a height of ' + h + ' ' + u + '. Using π ≈ 3.14, what is its volume in ' + u + '³?', a:V, why:'Base area: 3.14 × ' + r + ' × ' + r + ' = ' + r2(3.14 * r * r) + ' ' + u + '². Volume = base area × height = ' + r2(3.14 * r * r) + ' × ' + h + ' = <b>' + V + ' ' + u + '³</b>.'};
    if (k === 1) return mc('A can is ' + 2*r + ' ' + u + ' across (diameter) and ' + h + ' ' + u + ' tall. What is its volume? (π ≈ 3.14)', V + ' ' + u + '³', [
      [r2(3.14 * 4 * r * r * h) + ' ' + u + '³', 'That uses the diameter in r × r. Halve it first: r = ' + r + '.'],
      [r2(3.14 * r * r) + ' ' + u + '³', 'That is only the base (one circle). Multiply by the height, ' + h + '.'],
      [r2(3.14 * 2 * r * h) + ' ' + u + '³', 'That uses the circumference. Volume needs the base AREA: π × r × r.']],
      'r = ' + r + '. V = 3.14 × ' + r + ' × ' + r + ' × ' + h + ' = <b>' + V + ' ' + u + '³</b>.');
    var e = 3 * r * r * h;
    return mc('Estimate the volume of a cylinder with radius ' + r + ' ' + u + ' and height ' + h + ' ' + u + '. Use π ≈ 3.', 'about ' + e + ' ' + u + '³', [
      ['about ' + 3 * r * r + ' ' + u + '³', 'That is the base only. Multiply by the height.'], ['about ' + 3 * 2 * r * h + ' ' + u + '³', 'That uses the diameter instead of r × r.'], ['about ' + r * r * h + ' ' + u + '³', 'Do not forget π (about 3).']],
      '3 × ' + r + ' × ' + r + ' × ' + h + ' = <b>' + e + '</b>, so about ' + e + ' ' + u + '³ (exact: ' + V + ').');
  }},
  anytri: {name:'Area of any triangle', f:function(lv){
    var b = L.ri(4, 16), h = L.ri(2, 12); if ((b * h) % 2) b++;
    var s = h + L.ri(1, 4);
    return mc('A triangle has base ' + b + ' cm, height ' + h + ' cm and a slanted side of ' + s + ' cm. What is its area?', b*h/2 + ' cm²', [[b*h + ' cm²', 'That is the whole rectangle. A triangle is half of it.'], [b*s/2 + ' cm²', 'Use the HEIGHT (straight up), not the slanted side.'], [(b + h + s) + ' cm²', 'Adding sides gives a perimeter-type number, not an area.']], 'A = ' + f(1,2) + ' × ' + b + ' × ' + h + ' = ' + b*h/2 + ' cm².');
  }},
  cap: {name:'Which box holds more?', f:function(lv){
    var u = ['in', 'cm', 'ft'][L.ri(0, 2)], un = {in:'cubic inches', cm:'cubic centimeters', ft:'cubic feet'}[u], A, B, va, vb, g = 0;
    do { A = [L.ri(2, 8), L.ri(2, 6), L.ri(2, 6)]; B = [L.ri(2, 8), L.ri(2, 6), L.ri(2, 6)]; va = A[0]*A[1]*A[2]; vb = B[0]*B[1]*B[2]; }
    while ((va === vb || Math.abs(va - vb) > 60 || (A[0]+A[1]+A[2] - B[0]-B[1]-B[2]) === (va - vb)) && g++ < 200);
    var big = va > vb ? 'A' : 'B', sm = big === 'A' ? 'B' : 'A', d = Math.abs(va - vb), sa = A[0]+A[1]+A[2], sb = B[0]+B[1]+B[2];
    return mc('Box A is ' + A.join(' ' + u + ' × ') + ' ' + u + '. Box B is ' + B.join(' ' + u + ' × ') + ' ' + u + '. Which box holds more, and how much more?',
      'Box ' + big + ', ' + d + ' ' + un + ' more', [
        ['Box ' + sm + ', ' + d + ' ' + un + ' more', 'Find each volume first: A = ' + va + ', B = ' + vb + '.'],
        ['Box ' + big + ', ' + (d + (d % 2 ? 1 : 2)) + ' ' + un + ' more', 'Check the subtraction: ' + Math.max(va, vb) + ' − ' + Math.min(va, vb) + '.'],
        ['Box ' + (sa > sb ? 'A' : 'B') + ', ' + Math.max(1, Math.abs(sa - sb)) + ' ' + un + ' more', 'Adding the edges does not give the space inside. Multiply l × w × h.']],
      'Volume A = ' + A.join(' × ') + ' = ' + va + '. Volume B = ' + B.join(' × ') + ' = ' + vb + '. Box ' + big + ' holds ' + d + ' ' + un + ' more.');
  }},
  est: {name:'Estimate first', f:function(lv){
    if (Math.random() < .6) {
      var l = [9, 11, 19, 21, 29, 31][L.ri(0, 5)], w = L.ri(2, 5), h = L.ri(3, 6), lr = Math.round(l / 10) * 10, e = lr * w * h;
      return mc('A box is ' + l + ' in long, ' + w + ' in wide and ' + h + ' in tall. Which is the best <b>estimate</b> of its volume?', 'about ' + e + ' cubic inches', [
        ['about ' + (lr + w + h) + ' cubic inches', 'That adds the edges. Volume multiplies them.'],
        ['about ' + (lr * w) + ' cubic inches', 'That is only the bottom layer. Multiply by the height too.'],
        ['about ' + (e * 2) + ' cubic inches', 'Too big: ' + l + ' is close to ' + lr + ', so ' + lr + ' × ' + w + ' × ' + h + ' = ' + e + '.']],
        l + ' is close to ' + lr + '. ' + lr + ' × ' + w + ' × ' + h + ' = ' + e + ', so about ' + e + ' cubic inches (exact: ' + l*w*h + ').');
    }
    var b = [19, 21, 29, 31, 39, 41][L.ri(0, 5)], hh = 2 * L.ri(2, 6), br = Math.round(b / 10) * 10, ea = br * hh / 2;
    return mc('A triangle has a base of ' + b + ' cm and a height of ' + hh + ' cm. Which is the best <b>estimate</b> of its area?', 'about ' + ea + ' cm²', [
      ['about ' + br * hh + ' cm²', 'That is the whole rectangle. A triangle is half of it.'],
      ['about ' + (br + hh) + ' cm²', 'Area multiplies base × height, then takes half.'],
      ['about ' + ea / 2 + ' cm²', 'You took half twice. ½ × ' + br + ' × ' + hh + ' = ' + ea + '.']],
      b + ' is close to ' + br + '. ½ × ' + br + ' × ' + hh + ' = ' + ea + ', so about ' + ea + ' cm² (exact: ' + b*hh/2 + ').');
  }},
  unit: {name:'Which unit?', f:function(lv){
    var u = [['inches','square inches','cubic inches'], ['feet','square feet','cubic feet'], ['centimeters','square centimeters','cubic centimeters'], ['meters','square meters','cubic meters']][L.ri(0, 3)];
    var S = [[0, 'the length of ribbon around the edge of a picture frame'], [0, 'the fence needed to go around a garden'], [0, 'the distance around a soccer field'],
             [1, 'the carpet needed to cover a floor'], [1, 'the paper needed to cover a bulletin board'], [1, 'the grass that covers a yard'],
             [2, 'the water a fish tank holds'], [2, 'the sand that fills a sandbox'], [2, 'the number of cubes that fill a box']][L.ri(0, 8)];
    var why = ['A distance around is a length.', 'Covering a flat surface counts squares.', 'Filling a space counts cubes.'];
    return mc('Which unit would you use to measure ' + S[1] + '?', u[S[0]], [0, 1, 2].filter(function (i) { return i !== S[0]; }).map(function (i) { return [u[i], why[i] + ' This one is about ' + ['going around', 'covering', 'filling'][S[0]] + '.']; }).concat([[u[S[0]].replace(/s$/, '') + ' per second', 'That measures speed, not size.']]),
      why[S[0]] + ' So use ' + u[S[0]] + '.');
  }},
  para: {name:'Parallelogram area', f:function(lv){
    var b = L.ri(3, 15), h = L.ri(2, 12), s = h + L.ri(1, 4);
    return mc('A parallelogram has base ' + b + ' cm, height ' + h + ' cm and slanted side ' + s + ' cm. What is its area?', b*h + ' cm²', [[b*s + ' cm²', 'Use the HEIGHT (straight up), not the slanted side.'], [b*h/2 + ' cm²', 'That is a triangle. A parallelogram is a full rectangle in disguise.'], [2*(b+s) + ' cm²', 'That is the perimeter.']], 'A = b × h = ' + b + ' × ' + h + ' = ' + b*h + ' cm².');
  }}
};
var lessons = [
 {id:'u9L1', name:'Angles & triangles', icon:'📐', cards:[
  {t:'Name the angle', h:L.tbl(['Angle','Size'], [['acute','less than 90°'],['right','exactly 90°'],['obtuse','between 90° and 180°'],['straight','exactly 180°']]) + '<p>The three angles inside any triangle add up to <b>180°</b>.</p>', key:'Missing angle: 180 − (the two you know).'},
  {t:'Classify triangles two ways', h:'<p>Every triangle gets two names: one for its <b>angles</b> and one for its <b>sides</b>. Find the biggest angle first, then count the equal sides.</p>' + L.tbl(['By angles','By sides'], [['acute: all angles &lt; 90°','equilateral: 3 equal sides'],['right: one 90° angle','isosceles: at least 2 equal sides'],['obtuse: one angle &gt; 90°','scalene: no equal sides']]), trap:'An equilateral triangle IS also isosceles (it has at least 2 equal sides).', tr:{type:'num', q:'A triangle has angles of 47° and 68°. What is the third angle in degrees?', a:65, why:'180 − 47 − 68 = 65°.'}},
  {t:'Angle pairs (a grade up)', h:'<p>Angles can team up. This card goes a grade beyond the Grade 5 test, and it makes the 180° triangle rule easier to see.</p><div class="big">straight line = 180° &nbsp;·&nbsp; square corner = 90°</div>', key:'Complementary angles add to 90°. Supplementary angles add to 180°.'}
 ]},
 {id:'u9L4', name:'Perimeter & area', icon:'▭', cards:[
  {t:'Around or cover?', h:GV.rectPA(7, 4) + '<p><b>Perimeter</b> is the distance <b>around</b> the edge: add the sides. <b>Area</b> is how many unit squares <b>cover</b> the inside: rows × squares in a row.</p><div class="big">P = 2 × (l + w) &nbsp;·&nbsp; A = l × w</div>', key:'Perimeter is a length (units). Area counts squares (square units).', watch:{id:'rect-pa', l:7, w:4}, tr:function(){ var a = L.ri(4, 12), b = L.ri(2, 9), A = Math.random() < .5; return {type:'num', q:'A rectangle is ' + a + ' cm long and ' + b + ' cm wide. What is its ' + (A ? 'area in cm²' : 'perimeter in cm') + '?', a:A ? a*b : 2*(a+b), why:A ? a + ' × ' + b + ' = ' + a*b + ' cm².' : '2 × (' + a + ' + ' + b + ') = ' + 2*(a+b) + ' cm.'}; }},
  {t:'Squares', h:GV.rectPA(5, 5) + '<p>A square has 4 equal sides, so you only need one number, the side <b>s</b>.</p><div class="big">P = 4 × s &nbsp;·&nbsp; A = s × s = s²</div>', trap:'s² means s × s, not 2 × s. A side of 6 has area 36, not 12.', watch:{id:'rect-pa', l:5, w:5}, tr:function(){ var q = L.ri(3, 12); return {type:'num', q:'A square has sides of ' + q + ' m. What is its area in m²?', a:q*q, why:q + ' × ' + q + ' = ' + q*q + ' m².'}; }},
  {t:'Find the missing side', h:'<p>Work backward, undoing each step.</p><div class="big">A = 48, l = 8 → w = 48 ÷ 8 = 6</div><div class="big">P = 30, l = 9 → l + w = 30 ÷ 2 = 15 → w = 15 − 9 = 6</div>', trap:'For a missing side from the perimeter, cut the perimeter in half first. 30 − 9 = 21 is two widths and a length, not one width.', tr:function(){ var a = L.ri(5, 12), b = L.ri(2, 9), P = Math.random() < .5; return P ? {type:'num', q:'A rectangle has a perimeter of ' + 2*(a+b) + ' ft. Its length is ' + a + ' ft. What is its width in feet?', a:b, why:2*(a+b) + ' ÷ 2 = ' + (a+b) + ', and ' + (a+b) + ' − ' + a + ' = ' + b + ' ft.'} : {type:'num', q:'A rectangle has an area of ' + a*b + ' ft². Its length is ' + a + ' ft. What is its width in feet?', a:b, why:a*b + ' ÷ ' + a + ' = ' + b + ' ft.'}; }},
  {t:'L-shapes: split or subtract', h:GV.lshape(9, 7, 4, 3) + '<p>There is no L formula. Split it into two rectangles and add, or take the whole rectangle and subtract the missing corner. Both give the same answer.</p><div class="big">5 × 3 + 9 × 4 = 15 + 36 = 51 &nbsp;or&nbsp; 9 × 7 − 4 × 3 = 63 − 12 = 51</div>', watch:{id:'lshape', W:9, H:7, cw:4, ch:3}, tr:function(){ var W = L.ri(6, 11), H = L.ri(5, 9), cw = L.ri(2, W - 3), ch = L.ri(2, H - 2); return {type:'num', q:'A ' + W + ' by ' + H + ' rectangle has a ' + cw + ' by ' + ch + ' corner cut out. What is the area of the L-shape?', a:W*H - cw*ch, why:W + ' × ' + H + ' − ' + cw + ' × ' + ch + ' = ' + (W*H) + ' − ' + (cw*ch) + ' = ' + (W*H - cw*ch) + '.'}; }},
  {t:'Polygons: walk around', h:'<p>For any polygon, the perimeter is all the sides added. If all the sides are equal (a <b>regular</b> polygon), multiply instead.</p><div class="big">regular hexagon, sides 5: P = 6 × 5 = 30</div>', trap:'Count the sides first: pentagon 5, hexagon 6, octagon 8.', watch:{id:'poly-perim', n:6, s:5}, tr:function(){ var n = [5, 6, 8][L.ri(0, 2)], q = L.ri(2, 12), nm = {5:'pentagon', 6:'hexagon', 8:'octagon'}[n]; return {type:'num', q:'A regular ' + nm + ' has sides of ' + q + ' in. What is its perimeter in inches?', a:n*q, why:'A ' + nm + ' has ' + n + ' sides: ' + n + ' × ' + q + ' = ' + n*q + ' in.'}; }}
 ]},
 {id:'u9L2', name:'Triangles & parallelograms', icon:'🔺', cards:[
  {t:'Half a rectangle', h:GV.rtri(12, 7, 'm') + '<p>A right triangle is exactly half of a rectangle.</p><div class="big">A = ' + f(1,2) + ' × b × h = ' + f(1,2) + ' × 12 × 7 = 42 m²</div>', trap:'Forgetting the ½. 12 × 7 = 84 is the whole rectangle.', watch:{id:'tri-area', b:12, h:7}},
  {t:'Your turn', h:tri(6, 9), watch:{id:'tri-area', b:6, h:9}, tr:{type:'num', q:'Find the area of the right triangle above in cm².', a:27, why:f(1,2) + ' × 6 × 9 = 27 cm².'}},
    {t:'Any triangle is half a rectangle', h:GV.anyTri(10, 6, 3) + '<p>Draw the height straight up from the base. It splits the triangle into two right triangles, and each one is half of its own rectangle. So the whole triangle is half of the big rectangle.</p><div class="big">A = ' + f(1,2) + ' × b × h</div>', trap:'The height must make a square corner with the base. A slanted side is not the height.', watch:{id:'tri-area', b:10, h:6, a:3, any:true}, tr:function(){ return bg.anytri.f(); }},
    {t:'Parallelogram = rectangle in disguise', h:GV.para(8, 4, 3) + '<p>Slice a triangle off one side and slide it to the other: you get a rectangle with the same base and height.</p><div class="big">A = b × h</div>', trap:'Use the straight-up height, not the slanted side.', watch:{id:'para-area', b:8, h:4, o:3}, tr:function(){ return bg.para.f(); }},
    {t:'A parallelogram is two triangles', h:GV.paraDiag(8, 4, 3) + '<p>Cut a parallelogram corner to corner and you get two triangles that match exactly. Each one has the same base and height as the parallelogram, so each is half of it.</p><div class="big">parallelogram b × h → triangle ' + f(1,2) + ' × b × h</div>', key:'Rectangle and parallelogram: b × h. Any triangle: half of that.'}
 ]},
 {id:'u9L5', name:'Circles', icon:'⚫', cards:[
    {t:'Parts of a circle', h:L.tbl(['Part','Meaning'], [['radius (r)','center to edge'],['diameter (d)','edge to edge through the center = 2r'],['circumference (C)','distance around']]) + '<p>For every circle, C ÷ d ≈ <b>3.14</b>. That number is π (pi).</p><div class="big">C = π × d</div><p>Example: radius 5 cm, so diameter 10 cm, and C ≈ 3.14 × 10 = 31.4 cm.</p>'},
    {t:'Around the circle: π', h:'<p>Roll a circle one full turn and measure the line it makes with the diameter. It always fits <b>3 times and a little more</b>: about 3.14 times. That number is <b>π</b>.</p><div class="big">C = π × d = 2 × π × r</div>', trap:'Using the radius in C = π × d. Double the radius first.', watch:{id:'circle', r:4}, tr:function(){ return bg.circ.f(); }},
    {t:'Circle area: wedges make a rectangle', h:'<p>Cut a circle into thin wedges. Line them up, point up, point down. They make a shape close to a <b>rectangle</b>.</p>', viz:function(){ return WEDGES; },
     steps:['The long side is half the way around the circle (half of 2 × π × r): about π × r.', 'The short side is the radius: r.', 'Rectangle area = long × short = π × r × r.'],
     key:'A = π × r × r (also written π r²). Use π ≈ 3.14.',
     trap:'Using the circumference formula (π × d) for area. Area covers the inside, so it needs r × r.',
     tr:function(){ return bg.carea.f('adv', 0); }},
    {t:'Radius, not diameter', h:'<p>A circle is <b>10 cm across</b>. Find its area.</p><div class="big">r = 10 ÷ 2 = 5</div><div class="big">A = 3.14 × 5 × 5 = 78.5 cm²</div>',
     trap:'Using the diameter: 3.14 × 10 × 10 = 314 cm² is 4 times too big. Halve the diameter first.',
     aap:'A half circle (semicircle) with radius 4 has area 3.14 × 4 × 4 ÷ 2 = 25.12.',
     tries:[function(){ return bg.carea.f('adv', 1); }, function(){ return bg.carea.f('adv', 2); }]},
    {t:'Around or cover?', h:L.tbl(['Question','Formula','Units'], [['fence around a round garden','C = π × d','cm, m, ft'],['grass to cover a round garden','A = π × r × r','cm², m², ft²']]) + '<p>Radius 3 m: around is 3.14 × 6 = 18.84 m. Cover is 3.14 × 3 × 3 = 28.26 m².</p>',
     trap:'Mixing up the units. Area is in square units (m²); the distance around is plain units (m).',
     tries:[function(){ return bg.carea.f('adv', 3); }, function(){ return bg.carea.f('adv', 4); }]}
 ]},
 {id:'u9L3', name:'Volume', icon:'📦', cards:[
  {t:'Layers of cubes', h:GV.prism(4, 3, 2, {hl:'base', note:'bottom layer: 4 × 3 = 12 cubes'}) + '<p>Volume counts the cubes that fill a box. A box 4 long, 3 wide and 2 tall holds 4 × 3 = 12 cubes in each layer, and there are 2 layers.</p><div class="big">V = l × w × h = 4 × 3 × 2 = 24 cubic units</div>', key:'V = base area × height: (cubes in one layer) × (number of layers).', watch:{id:'volume', l:4, w:3, h:2}},
  {t:'Cubes: s × s × s', h:GV.prism(3, 3, 3, {hl:'top', note:'3 layers of 3 × 3 = 9 → 27'}) + '<p>A cube has every edge the same length. It is a box where l, w and h are all s.</p><div class="big">V = s × s × s = s³</div>', key:'s³ ("s cubed") means s × s × s, not 3 × s.', watch:{id:'volume', l:3, w:3, h:3}, tr:function(){ var c = L.ri(2, 6); return {type:'num', q:'A cube has edges of ' + c + ' cm. What is its volume in cm³?', a:c*c*c, why:c + ' × ' + c + ' × ' + c + ' = ' + c*c*c + ' cm³.'}; }},
  {t:'Perimeter, area or volume?', h:GV.pav() + L.tbl(['Question asks about…','Use','Units'], [['a fence around a yard','perimeter','cm, m'],['carpet to cover a floor','area','cm², m²'],['water to fill a tank','volume','cm³, m³']]), tr:mc('Which measure tells how much sand fills a sandbox?', 'volume', [['area', 'Area covers a flat surface. Filling a box takes space in 3 directions.'], ['perimeter', 'Perimeter is the distance around.'], ['mass', 'Not one of the three measures here.']], 'Filling a 3-D space = volume.')}
 ]},
];
var cylLesson = {id:'u9G1', name:'Go Further: cylinders', icon:'🥫', cards:[
  {t:'A stack of circles', h:'<p>A cylinder is like a box with a <b>circle</b> for its base. Volume = base area × height.</p><div class="big">V = π × r × r × h</div>', viz:function(){ return '<svg viewBox="0 0 200 170" role="img" aria-label="A cylinder with radius r and height h" style="width:100%;max-width:230px;display:block;margin:0 auto"><path d="M40 40v90a60 18 0 0 0 120 0V40" fill="var(--ic-soft)" stroke="currentColor" stroke-width="3"/><ellipse cx="100" cy="40" rx="60" ry="18" fill="var(--ic-soft)" stroke="currentColor" stroke-width="3"/><path d="M40 130a60 18 0 0 1 120 0" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 5" opacity=".6"/><path d="M100 40H160" stroke="var(--ic)" stroke-width="3"/><text x="130" y="62" text-anchor="middle" font-size="18" font-weight="800" fill="var(--ic)">r</text><path d="M176 40v90M171 40h10M171 130h10" stroke="var(--ic)" stroke-width="3"/><text x="186" y="92" font-size="18" font-weight="800" fill="var(--ic)">h</text><circle cx="100" cy="40" r="3.5" fill="currentColor"/></svg>'; },
   steps:['Radius 3, height 5: the base is 3.14 × 3 × 3 = 28.26.', 'Stack 5 layers: 28.26 × 5 = 141.3.', 'Volume ≈ 141.3 cubic units.'],
   key:'Same rule as a box: (area of the base) × (height).',
   tries:[function(){ return bg.cyl.f('adv', 0); }, function(){ return bg.cyl.f('adv', 2); }]},
  {t:'Watch the radius', h:'<p>A can is 6 cm across and 10 cm tall. Across is the <b>diameter</b>, so r = 3.</p><div class="big">3.14 × 3 × 3 × 10 = 282.6 cm³</div>',
   trap:'Using 6 for r: 3.14 × 6 × 6 × 10 = 1130.4 is 4 times too big. Or stopping at the base area (28.26) and forgetting the height.',
   tr:function(){ return bg.cyl.f('adv', 1); }}
]};
var bridge = {
  title:'All shapes together', tab:'🚀 Go Further',
  intro:'Angles, perimeter and area, triangles and parallelograms, circles and volume, all in one path.',
  lessons:lessons.concat([cylLesson]),
  gens:bg, repIds:['circ','carea','cyl','para','anytri','cap','est','unit'],
  next:'Try the Geometry Lab tab to practice every shape with pictures.'
};
window.V2 = {key:'u9', lessons:lessons, test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u9', num: 9, emoji: '📐', title: 'Shape & Measure Lab',
  blurb: 'Angles, triangles, area, perimeter and volume, plus the Geometry Lab.', sol: ['5.MG.2', '5.MG.3'], dates: ['2027-03-29', '2027-04-30'], color: '#1d4ed8'
}, window.V2, { gUnit: 9, coreStds: ['5.MG.2', '5.MG.3'] });
/* Unit 9 teaches every shape together: Core practice also gets circles, parallelograms and any triangle.
   Circle area practice stays Advanced (AAP; the Circles lesson cards show it to everyone). */
UNIT.advanced.skills.filter(function (s) { return /^adv-/.test(s.id) && s.id !== 'adv-carea' && s.id !== 'adv-cyl'; }).forEach(function (s) { UNIT.core.skills.push(s); });
UNIT.core.intro = 'Angles, perimeter and area, triangles and parallelograms, circles and volume, all together.';


/* Geometry Lab tab (js/geolab.js): Learn, Missions and Pick it, shapes drawn to scale.
   Every shape at every level; Mix picks a shape, Pick it tells a story about the chosen shape. */
UNIT.game = { tab: '\ud83d\udcd0 Geo<span class="gl-tabx">metry</span> Lab', mount: function (host, api) { GeoLab.mount(host, api); } };

/* After a Practice or Test Lab question about perimeter, area or volume, offer the same idea in the Geometry Lab. */
window.G5ItemHook = function (item, box) {
  try {
    if (box.querySelector('.gl-try')) return;
    var t = String(item.q || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]*>/g, ' ').toLowerCase();
    if (!/perimeter|area|volume|circumference|fence|cover|fill|cubic|square (units|feet|meters|centimeters|inches|cm|m|in|ft)|cm²|m²|cm³|m³/.test(t)) return;
    var shape = null, mode = 'learn';
    if (/perimeter, area,? or volume|which (measure|measurement)|is an example of finding|situations? (is|that use)/.test(t)) mode = 'pick';
    else if (/circle|circumference|radius|diameter/.test(t)) shape = 'circle';
    else if (/parallelogram/.test(t)) shape = 'para';
    else if (/\bcube\b/.test(t) && !/unit cubes?|cubes? (fill|fit)/.test(t)) shape = 'cube';
    else if (/box|prism|tank|sandbox|planter|volume|cubic/.test(t)) shape = 'box';
    else if (/right triangle/.test(t)) shape = 'rtri';
    else if (/triangle/.test(t)) shape = 'tri';
    else if (/l-shape|l shape|l-shaped/.test(t)) shape = 'lshape';
    else if (/pentagon|hexagon|octagon|polygon/.test(t)) shape = 'poly';
    else if (/\ba square\b|square (garden|tile|room|patio|board|rug)|each side/.test(t)) shape = 'square';
    else if (/rectang|garden|floor|yard|room|board|fence|carpet|rug|wall|field|patio/.test(t)) shape = 'rect';
    if (!shape && mode !== 'pick') return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost gl-try';
    b.textContent = '\ud83d\udcd0 Try it in Geometry Lab';
    b.onclick = function () {
      window.__glPreset = mode === 'pick' ? { mode: 'pick' } : { mode: 'learn', shape: shape };
      var tb = document.querySelector('#tabs button[data-tab="game"]'); if (tb) tb.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    var row = document.createElement('div'); row.className = 'q-gl'; row.appendChild(b);
    var act = box.querySelector('.q-actions'); if (act) box.insertBefore(row, act); else box.appendChild(row);
  } catch (e) {}
};
