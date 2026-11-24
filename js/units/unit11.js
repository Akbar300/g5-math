/* Unit 11: Coordinate Quest — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 11, Coordinate Graphing (FCPS; Grade 6 standard, not on the Grade 5 SOL) */
(function(){
var L = V2L, mc = L.mc;
/* Shared themed grid (js/visuals.js): arrowed axes, numbered lines, one 0 at the origin, light + dark. */
function plane(pts, quad){ return V.plane(pts.map(function(p){ return {x:p[0], y:p[1], label:p[2]}; }), {quad:!!quad, n:quad ? 6 : 8}); }
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
  }}
};
var bridge = {
  title:'Go Further: all four quadrants', tab:'🚀 Go Further',
  intro:'Advanced Unit 4 uses the <b>whole</b> coordinate plane, with negative numbers on both axes.',
  lessons:[{id:'u11B1', name:'Four quadrants', icon:'🗺️', cards:[
    {t:'Negatives go left and down', h:plane([[3, 2, 'A'], [-4, 3, 'B'], [-2, -5, 'C'], [5, -3, 'D']], true) + L.tbl(['Quadrant','Signs'], [['I','(+, +)'],['II','(−, +)'],['III','(−, −)'],['IV','(+, −)']])},
    {t:'Your turn', h:'', tr:bg.quad.f()}
  ]}],
  gens:bg, repIds:['quad'],
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
  var modes = [['missions', '\ud83d\udef0\ufe0f Missions'], ['shape', '\ud83d\udcd0 Shape Lab'], ['free', '\ud83d\udee0\ufe0f Free Build']];
  var bar = document.createElement('div'); bar.className = 'sp-modes'; bar.setAttribute('role', 'tablist');
  var sub = document.createElement('div');
  host.appendChild(bar); host.appendChild(sub);
  function go(m) {
    PILOT_MODE = m; sub.innerHTML = '';
    Array.prototype.forEach.call(bar.children, function (b) { b.classList.toggle('on', b.getAttribute('data-m') === m); b.setAttribute('aria-selected', b.getAttribute('data-m') === m); });
    if (m === 'shape') ShapeLab.guided(sub, api); else if (m === 'free') ShapeLab.free(sub, api); else StarPilot.mount(sub, api);
  }
  modes.forEach(function (m) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ix-btn'; b.setAttribute('data-m', m[0]); b.setAttribute('role', 'tab'); b.textContent = m[1];
    b.onclick = function () { go(m[0]); }; bar.appendChild(b);
  });
  go(PILOT_MODE);
} };
