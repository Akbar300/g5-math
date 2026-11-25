/* Unit 11: Coordinate Quest — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 11, Coordinate Graphing (FCPS; Grade 6 standard, not on the Grade 5 SOL) */
(function(){
var L = V2L, mc = L.mc;
/* Shared themed grid (js/visuals.js): arrowed axes, numbered lines, one 0 at the origin, light + dark. */
function plane(pts, quad){ return V.plane(pts.map(function(p){ return {x:p[0], y:p[1], label:p[2]}; }), {quad:!!quad, n:quad ? 6 : 8}); }
/* Four-quadrant grid with extra marks: segs [[x1,y1,x2,y2]], poly [[x,y],...], mirror 'x' | 'y' (dashed axis).
   Returns HTML (the audit tools stub V, so a string comes back as is). */
function planeDraw(pts, o){
  o = o || {};
  var s = V.planeSVG(pts.map(function(p){ return {x:p[0], y:p[1], label:p[2]}; }), {quad:true, n:o.n || 6});
  if (typeof s === 'string' || !s || !s.__geo) return typeof s === 'string' ? s : '';
  var G = s.__geo, NS = 'http://www.w3.org/2000/svg', top = s.querySelector('.cp-pts');
  function add(tag, at){ var e = document.createElementNS(NS, tag); Object.keys(at).forEach(function(k){ e.setAttribute(k, at[k]); }); s.insertBefore(e, top); return e; }
  if (o.poly) add('polygon', {points:o.poly.map(function(p){ return G.px(p[0]) + ',' + G.py(p[1]); }).join(' '), fill:'var(--ic-soft)', 'fill-opacity':'.75', stroke:'var(--ic)', 'stroke-width':'3', 'stroke-linejoin':'round'});
  if (o.mirror === 'y') add('line', {x1:G.ox, y1:G.py(G.n), x2:G.ox, y2:G.py(-G.n), stroke:'var(--ic)', 'stroke-width':'4', 'stroke-dasharray':'7 6'});
  if (o.mirror === 'x') add('line', {x1:G.px(-G.n), y1:G.oy, x2:G.px(G.n), y2:G.oy, stroke:'var(--ic)', 'stroke-width':'4', 'stroke-dasharray':'7 6'});
  (o.segs || []).forEach(function(g){ add('line', {x1:G.px(g[0]), y1:G.py(g[1]), x2:G.px(g[2]), y2:G.py(g[3]), stroke:'var(--ic)', 'stroke-width':'4', 'stroke-linecap':'round'}); });
  return '<div class="viz">' + s.outerHTML + '</div>';
}
function P2(x, y){ return '(' + L.sg(x) + ', ' + L.sg(y) + ')'; }
var gens = {
  read: {name:'Read a point', f:function(lv){
    var x = L.ri(1, 8), y = L.ri(1, 8); if(x === y) y = (y % 8) + 1;
    return mc('What are the coordinates of point A?' + plane([[x, y, 'A']]), '(' + x + ', ' + y + ')', [['(' + y + ', ' + x + ')', 'Order matters: x (across) first, then y (up).'], ['(' + x + ', ' + (y+1) + ')', 'Count the grid lines carefully from 0.'], ['(' + (x-1) + ', ' + y + ')', 'Start counting at the origin (0, 0).']], 'Across ' + x + ', up ' + y + ': (' + x + ', ' + y + ').');
  }},
  dist: {name:'Distance on a line', f:function(lv){
    var x = L.ri(0, 8), y1 = L.ri(0, 4), y2 = L.ri(5, 12);
    return {type:'num', q:'How far apart are (' + x + ', ' + y1 + ') and (' + x + ', ' + y2 + ')?', a:y2 - y1, why:'Same x, so subtract the y values: ' + y2 + ' − ' + y1 + ' = ' + (y2 - y1) + ' units.'};
  }},
  table: {name:'Points from a table', f:function(lv){
    var m = L.ri(2, 4), b = L.ri(0, 3), xs = [1,2,3,4];
    return mc('A table shows x = 1, 2, 3, 4 and y = ' + xs.map(function(x){ return m*x + b; }).join(', ') + '. Which ordered pair belongs on the graph?', '(5, ' + (5*m + b) + ')', [['(' + (5*m + b) + ', 5)', 'x comes first.'], ['(5, ' + (5*m + b + m) + ')', 'Follow the pattern exactly: each step adds ' + m + '.'], ['(5, ' + (5 + b) + ')', 'The y values grow by ' + m + ' each time.']], 'Pattern: y grows by ' + m + '. When x = 5, y = ' + (5*m + b) + '.');
  }}
};
var lessons = [
 {id:'u11L1', name:'Plotting points', icon:'📍', cards:[
  {t:'Across, then up', h:V.plane([{x:3, y:5, label:'P', guide:true}], {n:8}) + '<div class="big">P = (3, 5)</div><p>The first number (x) tells how far <b>across</b>. The second (y) tells how far <b>up</b>. Start at the origin (0, 0).</p>', trap:'(3, 5) and (5, 3) are different points.'},
  {t:'Your turn', h:'', tr:gens.read.f()}
 ]},
 {id:'u11L2', name:'Graphs that tell stories', icon:'📈', cards:[
  {t:'Patterns make lines', h:'<p>Save $3 each week: (1, 3), (2, 6), (3, 9)… The points line up because the pattern adds the same amount each time.</p>', tr:gens.table.f()}
 ]}
];
var test = [
 {type:'num', fmt:'TYPE IN', q:'Points (2, 3), (7, 3), (7, 8) and (2, 8) form a square. What is its perimeter?', a:20, why:'Each side is 5 units (7 − 2 or 8 − 3). 4 × 5 = 20.'},
 mc('Which point is on the x-axis?', '(6, 0)', [['(0, 6)', 'That one is on the y-axis.'], ['(6, 6)', 'That is off both axes.'], ['(1, 6)', 'Points on the x-axis have y = 0.']], 'Points on the x-axis have y = 0.')
];
var bg = {
  quad: {name:'Four quadrants', f:function(lv){
    var x = L.ri(1, 6) * L.pick([1, -1]), y = L.ri(1, 6) * L.pick([1, -1]);
    var Q = x > 0 && y > 0 ? 'I' : x < 0 && y > 0 ? 'II' : x < 0 ? 'III' : 'IV';
    return mc('Which quadrant is (' + L.sg(x) + ', ' + L.sg(y) + ') in?' + plane([[x, y, '?']], true), 'Quadrant ' + Q, ['Quadrant I','Quadrant II','Quadrant III','Quadrant IV'].filter(function(q){ return q !== 'Quadrant ' + Q; }).map(function(q){ return [q, 'Check the signs: x ' + (x > 0 ? 'positive → right' : 'negative → left') + ', y ' + (y > 0 ? 'positive → up' : 'negative → down') + '.']; }), 'x is ' + (x > 0 ? 'positive' : 'negative') + ', y is ' + (y > 0 ? 'positive' : 'negative') + ': Quadrant ' + Q + '. (Quadrants go I, II, III, IV counterclockwise from top right.)');
  }},
  qdist: {name:'Distance across an axis', f:function(lv, kind){
    /* Two points on the same horizontal or vertical line, usually on opposite sides of an axis. */
    var vert = Math.random() < .5, c = L.ri(-5, 5), a = -L.ri(1, 6), b = L.ri(1, 6), across = true;
    if (Math.random() < .3) { across = false; var sgn = L.pick([1, -1]), u = L.ri(1, 3), v = u + L.ri(2, 3); a = sgn * u; b = sgn * v; }
    var A = vert ? [c, a] : [a, c], B = vert ? [c, b] : [b, c], d = Math.abs(b - a);
    var why = across ? (vert ? 'Same x, so count up and down. ' : 'Same y, so count across. ') + 'They are on opposite sides of the ' + (vert ? 'x' : 'y') + '-axis, so add the distances to the axis: |' + L.sg(a) + '| + |' + L.sg(b) + '| = ' + Math.abs(a) + ' + ' + Math.abs(b) + ' = <b>' + d + '</b>.'
      : 'Same side of the axis, so subtract: |' + L.sg(b) + '| − |' + L.sg(a) + '| = ' + Math.abs(b) + ' − ' + Math.abs(a) + ' = <b>' + d + '</b>.';
    var k = kind != null ? kind : L.pick([0, 0, 1, 1, 2]);
    if (k === 0) return {type:'num', fmt:'TYPE IN', q:'How many units apart are ' + P2(A[0], A[1]) + ' and ' + P2(B[0], B[1]) + '?', a:d, why:why};
    if (k === 1) {
      var wrong = across ? Math.abs(Math.abs(b) - Math.abs(a)) : Math.abs(a) + Math.abs(b);
      return mc('What is the distance between ' + P2(A[0], A[1]) + ' and ' + P2(B[0], B[1]) + '?' + planeDraw([[A[0], A[1], 'A'], [B[0], B[1], 'B']], {segs:[[A[0], A[1], B[0], B[1]]]}), d + ' units', [
        [wrong + ' units', across ? 'They are on opposite sides of the axis. Add the two distances, do not subtract.' : 'They are on the same side. Subtract the distances.'],
        [(d + 1) + ' units', 'Count the spaces (jumps), not the grid lines.'],
        [Math.abs(c) + ' units', L.sg(c) + ' is the coordinate they share. Use the ones that change.']],
        why);
    }
    var x0 = L.ri(-5, 5), y0 = -L.ri(1, 5), up = L.ri(2, 8);
    return {type:'num', fmt:'TYPE IN', q:'A rover starts at ' + P2(x0, y0) + ' and drives straight up to ' + P2(x0, y0 + up) + '. How many units did it drive?', a:up, why:'Same x. ' + (y0 + up > 0 ? 'It crosses the x-axis: ' + Math.abs(y0) + ' up to 0, then ' + (y0 + up) + ' more = <b>' + up + '</b>.' : (y0 + up) + ' − ' + L.par(y0) + ' = <b>' + up + '</b>.')};
  }},
  qpoly: {name:'Polygons in four quadrants', f:function(lv, kind){
    var x1 = -L.ri(1, 5), x2 = L.ri(1, 5), y1 = -L.ri(1, 5), y2 = L.ri(1, 5), w = x2 - x1, h = y2 - y1;
    var V4 = [[x1, y2], [x2, y2], [x2, y1], [x1, y1]], names = ['A', 'B', 'C', 'D'];
    var list = V4.map(function(p){ return P2(p[0], p[1]); }).join(', ');
    var dims = 'Width: ' + x2 + ' − ' + L.par(x1) + ' = ' + w + '. Height: ' + y2 + ' − ' + L.par(y1) + ' = ' + h + '.';
    var k = kind != null ? kind : L.pick([0, 1, 1, 2, 3]);
    if (k === 0) return {type:'num', fmt:'TYPE IN', q:'A rectangle has corners ' + list + '. What is its <b>perimeter</b>?', a:2*(w + h), why:dims + ' Perimeter = ' + w + ' + ' + h + ' + ' + w + ' + ' + h + ' = <b>' + 2*(w + h) + '</b> units.'};
    if (k === 1) return mc('A rectangle has corners ' + list + '. What is its <b>area</b>?' + planeDraw(V4.map(function(p, i){ return [p[0], p[1], names[i]]; }), {poly:V4}), (w*h) + ' square units', [
      [2*(w + h) + ' square units', 'That is the perimeter (around). Area = width × height.'],
      [(x2 * y2) + ' square units', 'That is only the part in Quadrant I. The rectangle crosses both axes: width ' + w + ', height ' + h + '.'],
      [(w + h) + ' square units', 'Multiply width × height, do not add.']],
      dims + ' Area = ' + w + ' × ' + h + ' = <b>' + w*h + '</b> square units.');
    if (k === 2) { var miss = L.ri(0, 3), shown = V4.filter(function(_, i){ return i !== miss; });
      return mc('Three corners of a rectangle are ' + shown.map(function(p){ return P2(p[0], p[1]); }).join(', ') + '. Where is the fourth corner?', P2(V4[miss][0], V4[miss][1]), [
        [P2(V4[miss][1], V4[miss][0]), 'x comes first, then y.'], [P2(-V4[miss][0], V4[miss][1]), 'Match the x of one corner and the y of another.'], [P2(V4[miss][0], -V4[miss][1]), 'Rectangle sides run straight across and straight up and down.']],
        'The missing corner shares its x with one corner and its y with another: ' + P2(V4[miss][0], V4[miss][1]) + '.'); }
    var yt = L.ri(1, 5), xa = -L.ri(1, 5), xb = L.ri(1, 5), ya = -L.ri(1, 5), base = xb - xa, ht = yt - ya;
    if ((base * ht) % 2) { xb = xb < 5 ? xb + 1 : xb - 1; base = xb - xa; if ((base * ht) % 2) return null; }
    return {type:'num', fmt:'TYPE IN', q:'A right triangle has corners ' + P2(xa, ya) + ', ' + P2(xb, ya) + ' and ' + P2(xa, yt) + '. What is its area in square units?', a:base*ht/2, why:'Base: ' + xb + ' − ' + L.par(xa) + ' = ' + base + '. Height: ' + yt + ' − ' + L.par(ya) + ' = ' + ht + '. Area = ½ × ' + base + ' × ' + ht + ' = <b>' + base*ht/2 + '</b>.'};
  }},
  refl: {name:'Reflections', f:function(lv, kind){
    var x = L.ri(1, 6) * L.pick([1, -1]), y = L.ri(1, 6) * L.pick([1, -1]); if (Math.abs(x) === Math.abs(y)) y = y > 0 ? (y % 6) + 1 : -((-y % 6) + 1);
    if (Math.abs(x) === Math.abs(y)) return null;
    var axis = L.pick(['x', 'y']), R = axis === 'y' ? [-x, y] : [x, -y];
    var k = kind != null ? kind : L.pick([0, 0, 1, 2, 3]);
    var rule = axis === 'y' ? 'Over the y-axis, the point flips left ↔ right: x changes sign, y stays.' : 'Over the x-axis, the point flips up ↔ down: y changes sign, x stays.';
    if (k === 0) return mc('Reflect ' + P2(x, y) + ' over the <b>' + axis + '-axis</b>. Where does it land?' + planeDraw([[x, y, 'P']], {mirror:axis}), P2(R[0], R[1]), [
      [axis === 'y' ? P2(x, -y) : P2(-x, y), 'That flips over the other axis.'], [P2(-x, -y), 'Only one coordinate changes sign.'], [P2(y, x), 'A reflection does not swap x and y.']],
      rule + ' ' + P2(x, y) + ' → <b>' + P2(R[0], R[1]) + '</b>.');
    if (k === 1) return mc(P2(x, y) + ' is reflected and lands on ' + P2(R[0], R[1]) + '. Which axis was it reflected over?', 'the ' + axis + '-axis', [
      ['the ' + (axis === 'y' ? 'x' : 'y') + '-axis', 'Look at which coordinate changed sign. ' + (axis === 'y' ? 'x changed, so it flipped across the y-axis.' : 'y changed, so it flipped across the x-axis.')], ['both axes', 'Only one coordinate changed sign.'], ['the origin', 'A reflection over an axis changes one sign.']],
      rule);
    if (k === 2) { var d = axis === 'y' ? 2 * Math.abs(x) : 2 * Math.abs(y);
      return {type:'num', fmt:'TYPE IN', q:'Reflect ' + P2(x, y) + ' over the ' + axis + '-axis. How many units apart are the point and its reflection?', a:d, why:'It lands on ' + P2(R[0], R[1]) + '. Each is ' + (d / 2) + ' units from the ' + axis + '-axis, on opposite sides: ' + (d / 2) + ' + ' + (d / 2) + ' = <b>' + d + '</b>.'}; }
    var cands = L.shuffle([[x, y, 'A'], [-x, y, 'B'], [x, -y, 'C'], [-x, -y, 'D']]);
    return {type:'ms', fmt:'SELECT ALL', q:'Select <b>all</b> the points that are reflections of ' + P2(x, y) + ' over the <b>x-axis or the y-axis</b>.', ch:cands.map(function(p){ return P2(p[0], p[1]); }), a:cands.map(function(p, i){ return (p[2] === 'B' || p[2] === 'C') ? i : -1; }).filter(function(i){ return i >= 0; }),
      why:'Over the y-axis: ' + P2(-x, y) + '. Over the x-axis: ' + P2(x, -y) + '. ' + P2(-x, -y) + ' changes both signs (that is a turn through the origin), and ' + P2(x, y) + ' is the point itself.'};
  }}
};
var bridge = {
  title:'Go Further: all four quadrants', tab:'🚀 Go Further',
  intro:'Advanced Unit 4 uses the <b>whole</b> coordinate plane, with negative numbers on both axes: distance across an axis, polygons in all four quadrants, and reflections.',
  lessons:[{id:'u11B1', name:'Four quadrants', icon:'🗺️', cards:[
    {t:'Negatives go left and down', h:V.plane([{x:3, y:2, label:'A'}, {x:-3, y:2, label:'B'}, {x:-3, y:-4, label:'C'}, {x:5, y:-3, label:'D'}], {quad:true, n:6, qlabels:true}) + '<p class="cp-qnote">Start in the top right with <b>I</b> and go <b>counterclockwise</b>: II, III, IV.</p>' + L.tbl(['Quadrant','Signs'], [['I','(+, +)'],['II','(−, +)'],['III','(−, −)'],['IV','(+, −)']])},
    {t:'Your turn', h:'', tr:bg.quad.f()}
  ]},{id:'u11B2', name:'Distance across an axis', icon:'↔️', cards:[
    {t:'Crossing an axis: add', h:'<p>How far is (−3, 2) from (4, 2)? Same y, so count <b>across</b>.</p>', viz:function(){ return planeDraw([[-3, 2, '(−3, 2)'], [4, 2, '(4, 2)']], {segs:[[-3, 2, 4, 2]]}); },
     steps:['From −3 to the y-axis is 3 units: |−3| = 3.', 'From the y-axis to 4 is 4 units.', '3 + 4 = <b>7 units</b>. Opposite sides of an axis: add the absolute values.'],
     trap:'Subtracting 4 − 3 = 1. The points are on opposite sides of the y-axis, so the distance goes through 0.',
     tr:function(){ return bg.qdist.f('adv', 1); }},
    {t:'Same side: subtract', h:'<p>(2, −1) and (2, −6) are both <b>below</b> the x-axis. Same x, so count up and down.</p><div class="big">|−6| − |−1| = 6 − 1 = 5 units</div>', viz:function(){ return planeDraw([[2, -1, '(2, −1)'], [2, -6, '(2, −6)']], {segs:[[2, -1, 2, -6]]}); },
     key:'Same side of the axis: subtract. Opposite sides: add.',
     tries:[function(){ return bg.qdist.f('adv', 0); }, function(){ return bg.qdist.f('adv', 2); }]}
  ]},{id:'u11B3', name:'Polygons in four quadrants', icon:'▭', cards:[
    {t:'Rectangle across the axes', h:'<p>Corners (−3, 2), (4, 2), (4, −1), (−3, −1).</p>', viz:function(){ return planeDraw([[-3, 2, 'A'], [4, 2, 'B'], [4, -1, 'C'], [-3, -1, 'D']], {poly:[[-3, 2], [4, 2], [4, -1], [-3, -1]]}); },
     steps:['Width (same y): from −3 to 4 = 3 + 4 = 7.', 'Height (same x): from −1 to 2 = 1 + 2 = 3.', 'Perimeter = 7 + 3 + 7 + 3 = 20. Area = 7 × 3 = 21 square units.'],
     trap:'Using 4 − 3 = 1 for the width. The rectangle crosses the y-axis, so add the two parts.',
     tries:[function(){ return bg.qpoly.f('adv', 1); }, function(){ return bg.qpoly.f('adv', 0); }]},
    {t:'Find the missing corner', h:'<p>A rectangle\'s corners share x-values in pairs and y-values in pairs. Three corners: (−2, 3), (5, 3), (5, −4). The fourth takes the x of one and the y of another: <b>(−2, −4)</b>.</p>',
     aap:'Right triangles work too: (−2, −1), (4, −1), (−2, 3) has base 6 and height 4, so area = ½ × 6 × 4 = 12.',
     tries:[function(){ return bg.qpoly.f('adv', 2); }, function(){ return bg.qpoly.f('adv', 3); }]}
  ]},{id:'u11B4', name:'Reflections', icon:'🪞', cards:[
    {t:'Flip over an axis', h:'<p>A reflection is a <b>mirror flip</b>. The axis is the mirror.</p>', viz:function(){ return planeDraw([[3, 2, 'P (3, 2)'], [-3, 2, '(−3, 2)']], {mirror:'y'}); },
     steps:['Over the <b>y-axis</b>: left ↔ right. x changes sign: (3, 2) → (−3, 2).', 'Over the <b>x-axis</b>: up ↔ down. y changes sign: (3, 2) → (3, −2).', 'The point and its image are the same distance from the mirror.'],
     trap:'Changing both signs. (3, 2) → (−3, −2) is not a reflection over one axis.',
     tr:function(){ return bg.refl.f('adv', 0); }},
    {t:'Which axis?', h:L.tbl(['Start','Image','Mirror'], [['(4, −1)','(−4, −1)','y-axis (x changed)'],['(4, −1)','(4, 1)','x-axis (y changed)']]),
     key:'The sign that changes tells you the mirror: x changes → y-axis; y changes → x-axis.',
     aap:'A point and its reflection are 2 × its distance from the mirror apart: (5, 3) and (−5, 3) are 10 units apart.',
     tries:[function(){ return bg.refl.f('adv', 1); }, function(){ return bg.refl.f('adv', 3); }]}
  ]}],
  gens:bg, repIds:['quad','qdist','qpoly','refl'],
  next:'Stay in the Advanced (Go Further) path of this unit for more practice.'
};
window.V2 = {key:'u11', lessons:lessons, gens:gens, repIds:['read','dist','table'], test:test, bridge:bridge};
})();

Adapt.fromV2({
  id: 'u11', num: 11, emoji: '📍', title: 'Coordinate Quest',
  blurb: 'Plot and read points in Quadrant I. (Grade 6 standard.)', sol: ['6.MG'], dates: ['2027-05-17', '2027-06-16'], color: '#0f766e'
}, window.V2, { gUnit: null, coreStds: ['6.MG'] });

/* Pilot tab (js/starpilot.js + js/shapelab.js): Missions, Shape Lab, Free Build.
   Core = Quadrant I, Advanced = all four quadrants. */
var PILOT_MODE = 'missions';
UNIT.game = { tab: '\ud83d\ude80 Pilot', mount: function (host, api) {
  var modes = [['missions', '\ud83d\udef0\ufe0f Missions'], ['shape', '\ud83d\udcd0 Shape Lab'], ['free', '\ud83d\udee0\ufe0f Free Build'], ['tricks', '\ud83e\udde0 Tricks']];
  var bar = document.createElement('div'); bar.className = 'sp-modes'; bar.setAttribute('role', 'tablist');
  var sub = document.createElement('div');
  host.appendChild(bar); host.appendChild(sub);
  function go(m) {
    PILOT_MODE = m; sub.innerHTML = '';
    Array.prototype.forEach.call(bar.children, function (b) { b.classList.toggle('on', b.getAttribute('data-m') === m); b.setAttribute('aria-selected', b.getAttribute('data-m') === m); });
    if (m === 'shape') ShapeLab.guided(sub, api); else if (m === 'free') ShapeLab.free(sub, api); else if (m === 'tricks') ShapeLab.tricks(sub, api); else StarPilot.mount(sub, api);
  }
  modes.forEach(function (m) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ix-btn'; b.setAttribute('data-m', m[0]); b.setAttribute('role', 'tab'); b.textContent = m[1];
    b.onclick = function () { go(m[0]); }; bar.appendChild(b);
  });
  go(PILOT_MODE);
} };

/* Unit 11 helpers for Practice and Test Lab:
   - topic labels for the Test Lab results breakdown
   - a "Try it in Shape Lab" button after a question that names coordinate points */
UNIT.topicOf = function (it) {
  var t = String((it && it.q) || '').replace(/<[^>]*>/g, ' ').toLowerCase();
  if (/perimeter/.test(t)) return 'Perimeter';
  if (/\barea\b/.test(t)) return 'Area';
  if (/quadrant/.test(t)) return 'Quadrants';
  if (/distance|how many (steps|units)|how far|how long|length/.test(t)) return 'Distance and steps';
  if (/table|pattern|rule|each (week|day)/.test(t)) return 'Tables and patterns';
  if (/axis|ordered pair|plot|point|coordinate|graph/.test(t)) return 'Reading and plotting points';
  return 'Mixed';
};
(function () {
  var NUM = '([\\u2212-]?\\d+)';
  var RE = new RegExp('\\(\\s*' + NUM + '\\s*,\\s*' + NUM + '\\s*\\)', 'g');
  var toN = function (s) { return parseInt(String(s).replace('\u2212', '-'), 10); };
  window.G5ItemHook = function (item, box) {
    try {
      if (box.querySelector('.sl-try')) return;
      var text = String(item.q || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]*>/g, ' ');
      var pts = [], m, seen = {};
      RE.lastIndex = 0;
      while ((m = RE.exec(text))) { var k = m[1] + ',' + m[2]; if (!seen[k]) { seen[k] = 1; pts.push({ x: toN(m[1]), y: toN(m[2]) }); } }
      if (pts.length < 2 || pts.length > 8) return;
      if (/\?\s*\)/.test(text) && /\(\s*\?/.test(text)) return;
      var adv = !!document.querySelector('.lvl-toggle button.on[data-l="advanced"]');
      var n = adv ? 6 : 8, lo = adv ? -6 : 0;
      for (var i = 0; i < pts.length; i++) if (pts[i].x < lo || pts[i].x > n || pts[i].y < lo || pts[i].y > n) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost sl-try';
      b.textContent = '\ud83d\udcd0 Try it in Shape Lab';
      b.onclick = function () {
        window.__slPreset = { pts: pts }; PILOT_MODE = 'free';
        var t = document.querySelector('#tabs button[data-tab="game"]'); if (t) t.click();
      };
      var row = document.createElement('div'); row.className = 'q-sl'; row.appendChild(b);
      var act = box.querySelector('.q-actions'); if (act) box.insertBefore(row, act); else box.appendChild(row);
    } catch (e) {}
  };
})();
