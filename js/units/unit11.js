/* Unit 11: Coordinate Quest — ported from latest Math Lab V2 lessons + G5 generators */
/* V2 data: Regular Unit 11, Coordinate Graphing (FCPS; Grade 6 standard, not on the Grade 5 SOL) */
(function(){
var L = V2L, mc = L.mc;
function plane(pts, quad){ var n = quad ? 6 : 8, W = 240, o = quad ? 120 : 20, s = quad ? 18 : 25, h = '<svg viewBox="0 0 240 240" width="230" height="230" style="display:block;margin:6px auto">';
  for(var i = -n; i <= n; i++){ if(!quad && i < 0) continue; var p = o + i*s; h += '<line x1="' + p + '" y1="' + (quad ? 12 : 20) + '" x2="' + p + '" y2="' + (quad ? 228 : 220) + '" stroke="#163050"/>'; var q = (quad ? 120 : 220) - i*s; h += '<line x1="' + (quad ? 12 : 20) + '" y1="' + q + '" x2="' + (quad ? 228 : 220) + '" y2="' + q + '" stroke="#163050"/>'; }
  h += quad ? '<line x1="120" y1="8" x2="120" y2="232" stroke="#00f6ff" stroke-width="2"/><line x1="8" y1="120" x2="232" y2="120" stroke="#00f6ff" stroke-width="2"/>' : '<line x1="20" y1="220" x2="20" y2="10" stroke="#00f6ff" stroke-width="2"/><line x1="20" y1="220" x2="230" y2="220" stroke="#00f6ff" stroke-width="2"/>';
  if(!quad) for(var k = 0; k <= 8; k += 2){ h += '<text x="' + (20 + k*25) + '" y="235" text-anchor="middle" fill="#7ea3ac" font-size="11">' + k + '</text><text x="12" y="' + (224 - k*25) + '" text-anchor="middle" fill="#7ea3ac" font-size="11">' + k + '</text>'; }
  pts.forEach(function(p){ var x = (quad ? 120 : 20) + p[0]*s, y = (quad ? 120 : 220) - p[1]*s; h += '<circle cx="' + x + '" cy="' + y + '" r="5" fill="#b6ff3c"/><text x="' + (x + 7) + '" y="' + (y - 6) + '" fill="#b6ff3c" font-size="13" font-weight="800">' + p[2] + '</text>'; });
  return h + '</svg>'; }
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
  {t:'Across, then up', h:plane([[3, 5, 'P']]) + '<div class="big">P = (3, 5)</div><p>The first number (x) tells how far <b>across</b>. The second (y) tells how far <b>up</b>. Start at the origin (0, 0).</p>', trap:'(3, 5) and (5, 3) are different points.'},
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

