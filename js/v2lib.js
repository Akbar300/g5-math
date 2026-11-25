/* V2 authoring helpers, shared by every unit data file */
(function(){
var L = {};
L.ri = function(a, b){ return a + Math.floor(Math.random() * (b - a + 1)); };
L.pick = function(a){ return a[Math.floor(Math.random() * a.length)]; };
L.gcd = function(a, b){ a = Math.abs(a); b = Math.abs(b); while(b){ var t = b; b = a % b; a = t; } return a; };
L.lcm = function(a, b){ return a / L.gcd(a, b) * b; };
L.fr = function(n, d){ return '<span class="frac"><span class="n">'+n+'</span><span class="d">'+d+'</span></span>'; };
L.mixed = function(w, n, d){ return (w ? w + ' ' : '') + (n ? L.fr(n, d) : ''); };
L.simp = function(n, d){ var g = L.gcd(n, d); return [n/g, d/g]; };
/* fraction html in simplest form, as mixed number when improper */
L.frs = function(n, d){ var s = L.simp(n, d); n = s[0]; d = s[1]; if(d === 1) return String(n); if(Math.abs(n) > d){ var w = Math.trunc(n/d), r = Math.abs(n % d); return w + ' ' + L.fr(r, d); } return (n < 0 ? '−' : '') + L.fr(Math.abs(n), d); };
L.num = function(x){ var s = (Math.round(x * 1e6) / 1e6).toString(); return s.replace('-', '−'); };
L.sg = function(x){ return x < 0 ? '−' + Math.abs(x) : String(x); };
L.par = function(x){ return x < 0 ? '(−' + Math.abs(x) + ')' : String(x); };
L.strip = function(s){ return String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); };
L.shuffle = function(a){ a = a.slice(); for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
/* mc(question, correctHtml, [distractor | [distractor, trapHint]], why) */
L.mc = function(q, right, wrong, why){
  var seen = {}, opts = [{h:right, ok:true}];
  seen[L.strip(right)] = 1;
  wrong.forEach(function(w){ var h = Array.isArray(w) ? w[0] : w, t = Array.isArray(w) ? w[1] : null; var k = L.strip(h); if(!seen[k]){
    if (window.U && U.parseChoiceValue) {
      var rv = U.parseChoiceValue(right), dv = U.parseChoiceValue(h);
      if (rv != null && dv != null && U.valuesClose(rv, dv)) return;
    }
    seen[k] = 1; opts.push({h:h, t:t});
  } });
  if(opts.length < 3) return null;
  opts = L.shuffle(opts.slice(0, 4));
  var traps = {}; opts.forEach(function(o, i){ if(o.t) traps[i] = o.t; });
  return {type:'mc', q:q, ch:opts.map(function(o){ return o.h; }), a:opts.findIndex(function(o){ return o.ok; }), traps:traps, why:why};
};
/* fixed-order mc (for ordered choices like A-D lists) */
L.mcFixed = function(q, ch, a, why, traps){ return {type:'mc', q:q, ch:ch, a:a, why:why, traps:traps || {}}; };
L.grid100 = function(k){ var h = '<div class="v2-grid100">'; for(var i = 0; i < 100; i++) h += '<i class="' + (i < k ? 'f' : '') + '"></i>'; return h + '</div>'; };
L.gridOverlap = function(cols, rows){ var h = '<div class="v2-grid100">'; for(var i = 0; i < 100; i++){ var c = Math.floor(i/10), r = i % 10, a = c < cols, b = r < rows; h += '<i style="background:' + (a && b ? '#b6ff3c' : a ? 'rgba(0,246,255,.45)' : b ? 'rgba(182,255,60,.28)' : '') + '"></i>'; } return h + '</div>'; };
L.counters = function(total, filled, groups){
  if(groups){ var per = total / groups, h = '<div class="v2-counters grp">', c = 0; for(var g = 0; g < groups; g++){ h += '<div class="g">'; for(var i = 0; i < per; i++){ h += '<i class="' + (c < filled ? 'f' : '') + '"></i>'; c++; } h += '</div>'; } return h + '</div>'; }
  var s = '<div class="v2-counters">'; for(var j = 0; j < total; j++) s += '<i class="' + (j < filled ? 'f' : '') + '"></i>'; return s + '</div>';
};
L.tbl = function(head, rows){ var sl = head[0] === 'Stem'; var h = (sl ? '<div class="sl-scroll">' : '') + '<table class="v2-tbl' + (sl ? ' sl-tbl' : '') + '"><tr>' + head.map(function(x){ return '<th>' + x + '</th>'; }).join('') + '</tr>'; rows.forEach(function(r){ h += '<tr>' + r.map(function(x){ return x === '?' ? '<td class="q">?</td>' : '<td>' + x + '</td>'; }).join('') + '</tr>'; }); return h + '</table>' + (sl ? '</div>' : ''); };
L.chips = function(pos, neg, zeroPairs){ var h = '<div class="v2-chipsrow">'; for(var i = 0; i < pos; i++) h += '<i class="p' + (i < (zeroPairs || 0) ? ' z' : '') + '">+</i>'; for(var j = 0; j < neg; j++) h += '<i class="n' + (j < (zeroPairs || 0) ? ' z' : '') + '">−</i>'; return h + '</div>'; };
window.V2L = L;
})();
