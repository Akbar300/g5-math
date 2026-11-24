/* Geometry Lab: Unit 9 game tab (UNIT.game in js/units/unit9.js).
   Ported from the Neon Geometry Lab artifact. Learn (formulas shown), Missions (find the missing side,
   with variables) and Pick it (perimeter, area or volume word problems). Shapes are drawn to scale and
   animate: perimeter walks the edge and adds the sides, area fills unit squares row by row,
   volume stacks cube layers.
   Color code (theme-aware, css/app.css "Geometry Lab"): given = teal, perimeter = green,
   area = blue, volume = violet, unknown = orange.
   Every shape at every level (Unit 9 teaches them together): rectangle, square, right triangle, polygon,
   L-shape, box, cube, circle, any triangle, parallelogram; Mix picks one. Pick it tells a story about the
   chosen shape. Learn and Missions show a "Why does it work?" card that plays the matching explainer
   (js/explainers/geometry.js) with the shape's own numbers.
   Saved on this device in localStorage g5lab_u9:geo. A Practice/Test question can open the lab on a
   matching shape through window.__glPreset = {shape, mode}. */
var GeoLab = (function () {
"use strict";
var KEY = 'g5lab_u9:geo';
var S = {mode: 'learn', shape: 'rect', aap: true, solved: 0, clean: 0};   /* Unit 9 shows every shape together */
try { var SV = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  if (['learn', 'mission', 'pick'].indexOf(SV.mode) >= 0) S.mode = SV.mode;
  if (SV.shape) S.shape = SV.shape; S.solved = +SV.solved || 0; S.clean = +SV.clean || 0; } catch (e) {}
function persist() { try { localStorage.setItem(KEY, JSON.stringify({mode: S.mode, shape: S.shape, solved: S.solved, clean: S.clean})); } catch (e) {} }
var CPID = 'glcp0', CPN = 0;
var rand=function(a,b){return a+Math.floor(Math.random()*(b-a+1));};
var pick=function(a){return a[Math.floor(Math.random()*a.length)];};
var r2=function(x){return Math.round(x*100)/100;};
var nf=function(x){return String(r2(x));};
var sp=function(c){return function(t){return '<span class="'+c+'">'+t+'</span>';};};
var cy=sp('cy'),gr=sp('gr'),ar=sp('ar'),vi=sp('vi'),un=sp('un');
var lbl=function(t,c){return {t:t,c:c||'cyan'};};
var Q=function(t){return lbl(t,'orange');};
var CHECK=' <span class="gr">✓</span>';

var SHAPES=[
  {id:'rect',name:'Rectangle'},{id:'square',name:'Square'},{id:'rtri',name:'Right triangle'},
  {id:'poly',name:'Polygon'},{id:'lshape',name:'L-shape'},{id:'box',name:'Box'},{id:'cube',name:'Cube'},
  {id:'circle',name:'Circle',aap:true},
  {id:'tri',name:'Any triangle',aap:true},{id:'para',name:'Parallelogram',aap:true},
  {id:'mix',name:'Mix'}
];
function available(){return SHAPES.filter(function(s){return s.id!=='mix'&&(!s.aap||S.aap);});}

var F={
  rect:['P = 2 × (L + W)','A = L × W'],
  square:['P = 4 × s','A = s × s = s²'],
  rtri:['P = add all 3 sides','A = ½ × b × h'],
  poly:['P = add all the sides','Equal sides: P = n × s'],
  lshape:['P = add all 6 sides','A = split into 2 rectangles, then add'],
  box:['Base area B = l × w','V = l × w × h = B × h'],
  cube:['V = s × s × s = s³'],
  circle:['d = 2 × r','C = π × d','A = π × r²','π ≈ 3.14'],
  tri:['P = add all 3 sides','A = ½ × b × h (h goes straight up)'],
  para:['P = 2 × (b + slanted side)','A = b × h (h goes straight up)']
};

/* ---------- ask + problem builders ---------- */
function ask(o){var a={type:'num',hints:[],wrongs:[],fallback:'Not quite. Try a hint if you like.'};for(var k in o)a[k]=o[k];return a;}
function known(list,unk,legend){return '<span>'+cy('Known:')+' '+list.join(', ')+'</span><span>'+un('Unknown:')+' '+unk+'</span>'+(legend?'<small>'+legend+'</small>':'');}
function U(u){return u==='feet'?{len:'feet',sq:'square feet',cu:'cubic feet',ab:' ft'}:{len:'units',sq:'square units',cu:'cubic units',ab:''};}
function missedSides(P,sides,n){return sides.map(function(s){return [P-s,'You missed a side. This shape has '+n+' sides.'];});}

/* rectangle asks */
function askPerimRect(L,H,u,hn){
  hn=hn||'W';var P=2*(L+H),X=U(u);
  return ask({label:'P =',ans:P,unit:X.len,mission:'Now find the '+gr('perimeter')+': the distance around.',
    bar:gr('P')+' = 2 × ('+cy('L')+' + '+cy(hn)+')',
    hints:[{bar:'P = '+L+' + '+H+' + '+L+' + '+H,text:'Perimeter is the distance around all 4 sides. Opposite sides match, so P = L + '+hn+' + L + '+hn+', which is the same as 2 × (L + '+hn+').',vis:{pulse:true}},
           {bar:'P = 2 × ('+L+' + '+H+') = 2 × '+(L+H),text:'Add inside the parentheses first: '+L+' + '+H+' = '+(L+H)+'. Then double it.',vis:{dim:[0,3]}}],
    wrongs:[[L+H,'That is one length plus one '+(hn==='H'?'height':'width')+'. Perimeter goes all the way around, so double it.'],[L*H,'That is the area (the squares inside). Perimeter is the distance around the edge.'],
            [2*L+H,'You missed a side. A rectangle has 4 sides.'],[L+2*H,'You missed a side. A rectangle has 4 sides.']],
    fallback:'Not quite. Walk around all 4 sides and add them up. Try a hint if you like.',
    done:{msg:'Correct! P = 2 × ('+L+' + '+H+') = '+P+' '+X.len,bar:gr('P')+' = 2 × ('+L+' + '+H+') = '+gr(P),keep:{outline:'green'},flash:{trace:true}}});
}
function askAreaRect(L,H,u,hn){
  hn=hn||'W';var A=L*H,X=U(u);
  return ask({label:'A =',ans:A,unit:X.sq,mission:'Now find the '+ar('area')+': how many unit squares cover the inside?',
    bar:ar('A')+' = '+cy('L')+' × '+cy(hn),
    hints:[{bar:'A = '+L+' × '+H,text:'Area counts the unit squares inside. There are '+H+' rows with '+L+' squares in each row, so A = L × '+hn+'.',vis:{grid:true}}],
    wrongs:[[2*(L+H),'That is the perimeter (the distance around). Area counts the squares inside.'],[L+H,'Adding gives part of the edge. For area, multiply: rows × squares in each row.']],
    done:{msg:'Correct! A = '+L+' × '+H+' = '+A+' '+X.sq,bar:ar('A')+' = '+L+' × '+H+' = '+ar(A),keep:{fill:true}}});
}

/* ---------- generators ---------- */
function gRect(mode){
  var H=rand(2,8),L=H+rand(2,5),P=2*(L+H),A=L*H;
  var geo={type:'poly',aria:'Rectangle',pts:[[0,0],[L,0],[L,H],[0,H]],sides:[L,H,L,H],labels:[null,lbl('W = '+H),lbl('L = '+L),null],gridOK:true};
  if(mode==='learn')return {geo:geo,base:{grid:true},mission:'This rectangle is '+L+' units long and '+H+' units wide. Find its '+gr('perimeter')+', then its '+ar('area')+'.',asks:[askPerimRect(L,H),askAreaRect(L,H)]};
  geo.labels[1]=Q('W = ?');
  var reveal=function(g){g.labels[1]=lbl('W = '+H);};
  if(Math.random()<0.5){
    return {geo:geo,mission:'The '+gr('perimeter is '+P)+'. The '+cy('length is '+L)+'. Find the missing '+un('width')+'.',
      known:known(['P = '+P,'L = '+L],'W','P = perimeter, L = length, W = width'),
      asks:[ask({label:'W =',ans:H,unit:'units',
        hints:[{bar:P+' = 2 × ('+L+' + '+un('W')+')',text:'Perimeter is the distance around all 4 sides: P = 2 × (L + W). Put in what we know.',vis:{pulse:true}},
               {bar:L+' + '+un('W')+' = '+P+' ÷ 2 = '+(P/2),text:'Undo the "× 2" by cutting the perimeter in half. That leaves one length and one width: '+L+' + W = '+(P/2)+'.',vis:{dim:[0,3]}},
               {bar:un('W')+' = '+(P/2)+' − '+L,text:'Undo the "+ '+L+'" by subtracting '+L+'. Now you can solve it!',vis:{dim:[0,2,3],hl:{1:'orange'}}}],
        wrongs:[[P/2,'That is L + W together ('+(P/2)+'). Subtract the length '+L+' to get W on its own.'],[L,'That is the length. The question asks for the width, W.'],
                [P-L,'Taking away one length leaves 2 widths and 1 length. Cut the perimeter in half first.'],[P,'That is the whole perimeter. The width is only part of it.']],
        fallback:'Not quite. Check it: 2 × ('+L+' + your number) should equal '+P+'. Try a hint if you like.',
        done:{msg:'Correct! Check: 2 × ('+L+' + '+H+') = '+P+' ✓',bar:'2 × ('+L+' + '+H+') = '+gr(P)+CHECK,reveal:reveal,keep:{outline:'green'},flash:{trace:true}}}),
        askAreaRect(L,H)]};
  }
  return {geo:geo,mission:'The '+ar('area is '+A+' square units')+'. The '+cy('length is '+L)+'. Find the missing '+un('width')+'.',
    known:known(['A = '+A,'L = '+L],'W','A = area, L = length, W = width'),
    asks:[ask({label:'W =',ans:H,unit:'units',
      hints:[{bar:A+' = '+L+' × '+un('W'),text:'Area = L × W. Put in what we know.'},
             {bar:un('W')+' = '+A+' ÷ '+L,text:'Undo the "× '+L+'" by dividing. Or think: '+L+' × what = '+A+'?'}],
      wrongs:[[A-L,'Area uses multiplication, so undo it with division, not subtraction.'],[A,'That is the area. The question asks for the width.'],[L,'That is the length. The question asks for the width.']],
      fallback:'Not quite. Check it: '+L+' × your number should equal '+A+'.',
      done:{msg:'Correct! Check: '+L+' × '+H+' = '+A+' ✓',bar:L+' × '+H+' = '+ar(A)+CHECK,reveal:reveal,keep:{fill:true}}}),
      askPerimRect(L,H)]};
}

function askPerimSq(s){
  var P=4*s;
  return ask({label:'P =',ans:P,unit:'units',mission:'Now find the '+gr('perimeter')+': the distance around.',bar:gr('P')+' = 4 × '+cy('s'),
    hints:[{bar:'P = '+s+' + '+s+' + '+s+' + '+s+' = 4 × '+s,text:'All 4 sides of a square are equal, so P = s + s + s + s = 4 × s.',vis:{pulse:true}}],
    wrongs:[[s*s,'That is the area. Perimeter is the distance around.'],[2*s,'That is only 2 sides. A square has 4.'],[3*s,'You missed a side. A square has 4 sides.'],[s+4,'Multiply by 4, do not add 4.']],
    done:{msg:'Correct! P = 4 × '+s+' = '+P+' units',bar:gr('P')+' = 4 × '+s+' = '+gr(P),keep:{outline:'green'},flash:{trace:true}}});
}
function askAreaSq(s){
  var A=s*s;
  return ask({label:'A =',ans:A,unit:'square units',mission:'Now find the '+ar('area')+': how many unit squares cover the inside?',bar:ar('A')+' = s × s = s²',
    hints:[{bar:'A = '+s+' × '+s,text:'s² ("s squared") means s × s. It is called squared because it makes a square!',vis:{grid:true}}],
    wrongs:[[2*s,'s² means s × s, not 2 × s.'],[4*s,'That is the perimeter. Area is s × s.'],[s+2,'The little 2 means multiply s by itself.']],
    done:{msg:'Correct! A = '+s+' × '+s+' = '+A+' square units',bar:ar('A')+' = '+s+' × '+s+' = '+ar(A),keep:{fill:true}}});
}
function gSquare(mode){
  var s=rand(3,10),P=4*s,A=s*s;
  var geo={type:'poly',aria:'Square',pts:[[0,0],[s,0],[s,s],[0,s]],sides:[s,s,s,s],labels:[null,null,lbl('s = '+s),null],gridOK:true};
  if(mode==='learn')return {geo:geo,base:{grid:true},mission:'Each side of this square is '+s+' units. Find its '+gr('perimeter')+', then its '+ar('area')+'.',asks:[askPerimSq(s),askAreaSq(s)]};
  geo.labels[2]=Q('s = ?');
  var reveal=function(g){g.labels[2]=lbl('s = '+s);};
  if(Math.random()<0.55){
    return {geo:geo,mission:'The '+gr('perimeter is '+P)+'. Find the '+un('side length')+' of the square.',known:known(['P = '+P],'s','P = perimeter, s = side'),
      asks:[ask({label:'s =',ans:s,unit:'units',
        hints:[{bar:P+' = 4 × '+un('s'),text:'A square has 4 equal sides: P = 4 × s. Put in what we know.',vis:{pulse:true}},
               {bar:un('s')+' = '+P+' ÷ 4',text:'Undo the "× 4" by dividing by 4. Or think: 4 × what = '+P+'?',vis:{dim:[0,1,3],hl:{2:'orange'}}}],
        wrongs:[[P/2,'That is half the perimeter, which covers 2 sides. A square has 4 equal sides.'],[P-4,'Undo "× 4" with "÷ 4", not "− 4".'],[P,'That is the whole perimeter. One side is only part of it.']],
        fallback:'Not quite. Check it: 4 × your number should equal '+P+'.',
        done:{msg:'Correct! Check: 4 × '+s+' = '+P+' ✓',bar:'4 × '+s+' = '+gr(P)+CHECK,reveal:reveal,keep:{outline:'green'},flash:{trace:true}}}),askAreaSq(s)]};
  }
  return {geo:geo,mission:'The '+ar('area is '+A+' square units')+'. Find the '+un('side length')+' of the square.',known:known(['A = '+A],'s','A = area, s = side'),
    asks:[ask({label:'s =',ans:s,unit:'units',
      hints:[{bar:A+' = '+un('s')+' × '+un('s'),text:'A = s × s. So s × s = '+A+'.'},
             {bar:un('s')+' × '+un('s')+' = '+A,text:'Which number times itself makes '+A+'? Think of square numbers: 9, 16, 25, 36, 49, 64, 81, 100.'}],
      wrongs:[[A/2,'s² is s × s, not 2 × s. Find a number times itself.'],[A/4,'Dividing by 4 works for perimeter, not area. Find a number times itself.']],
      fallback:'Not quite. Check it: your number × your number should equal '+A+'.',
      done:{msg:'Correct! Check: '+s+' × '+s+' = '+A+' ✓',bar:s+'² = '+ar(A)+CHECK,reveal:reveal,keep:{fill:true}}}),askPerimSq(s)]};
}

/* triangle asks */
function askPerimTri(sides,missionTxt){
  var P=sides.reduce(function(a,b){return a+b;},0);
  return ask({label:'P =',ans:P,unit:'units',mission:missionTxt||'Now find the '+gr('perimeter')+': the distance around.',bar:gr('P')+' = add all 3 sides',
    hints:[{bar:'P = '+sides.join(' + '),text:'Perimeter is the distance around: add all 3 sides.',vis:{pulse:true}}],
    wrongs:missedSides(P,sides,3),
    done:{msg:'Correct! P = '+sides.join(' + ')+' = '+P+' units',bar:gr('P')+' = '+sides.join(' + ')+' = '+gr(P),keep:{outline:'green'},flash:{trace:true}}});
}
function askAreaTri(b,h,slants){
  var A=b*h/2,SL='Use the height that makes a square corner with the base, not the slanted side.';
  var w=[[b*h,'That is the whole rectangle. A triangle is half of it, so divide by 2.'],[b+h,'Multiply b × h, then take half.']];
  slants.forEach(function(s){w.push([s*b/2,SL],[s*h/2,SL],[s*b,SL]);});
  return ask({label:'A =',ans:A,unit:'square units',mission:'Now find the '+ar('area')+': how many unit squares cover the inside?',bar:ar('A')+' = ½ × '+cy('b')+' × '+cy('h'),
    hints:[{bar:'rectangle = '+b+' × '+h+' = '+(b*h),text:'A triangle is exactly half of a rectangle. Look at the dashed rectangle around it.',vis:{ghost:true,grid:true}},
           {bar:'A = ½ × '+b+' × '+h+' = '+(b*h)+' ÷ 2',text:'Take half of the rectangle.',vis:{ghost:true,grid:true}}],
    wrongs:w,
    done:{msg:'Correct! A = ½ × '+b+' × '+h+' = '+A+' square units',bar:ar('A')+' = ½ × '+b+' × '+h+' = '+ar(A),keep:{fill:true}}});
}
function askHfromAtri(b,h,reveal){
  var A=b*h/2;
  return ask({label:'h =',ans:h,unit:'units',
    hints:[{bar:A+' = ½ × '+b+' × '+un('h'),text:'Area of a triangle = ½ × b × h. Put in what we know.',vis:{ghost:true}},
           {bar:(2*A)+' = '+b+' × '+un('h'),text:'Undo the ½ by doubling: 2 × '+A+' = '+(2*A)+'.',vis:{ghost:true}},
           {bar:un('h')+' = '+(2*A)+' ÷ '+b,text:'Undo the "× '+b+'" by dividing.'}],
    wrongs:[[A/b,'You forgot to undo the ½. Double the area first.'],[A-b,'Area uses multiplication, so undo it with division.'],[2*A,'That is the full rectangle. Now divide by the base.']],
    fallback:'Not quite. Check it: ½ × '+b+' × your number should equal '+A+'.',
    done:{msg:'Correct! Check: ½ × '+b+' × '+h+' = '+A+' ✓',bar:'½ × '+b+' × '+h+' = '+ar(A)+CHECK,reveal:reveal,keep:{fill:true}}});
}
function gRtri(mode){
  var t=pick([[3,4,5],[4,3,5],[6,8,10],[8,6,10],[5,12,13],[12,5,13],[9,12,15],[12,9,15]]),b=t[0],h=t[1],c=t[2],A=b*h/2,P=b+h+c;
  var geo={type:'poly',aria:'Right triangle',pts:[[0,0],[0,h],[b,h]],sides:[h,b,c],labels:[lbl('h = '+h),lbl('b = '+b),lbl('c = '+c)],rightAngle:1,ghost:[[0,0],[b,0],[b,h],[0,h]],gridOK:true};
  if(mode==='learn')return {geo:geo,base:{grid:true},mission:'Find the '+gr('perimeter')+' and the '+ar('area')+' of this right triangle. The square corner is between b and h.',asks:[askPerimTri([h,b,c]),askAreaTri(b,h,[c])]};
  geo.labels[0]=Q('h = ?');
  var reveal=function(g){g.labels[0]=lbl('h = '+h);};
  if(Math.random()<0.5){
    return {geo:geo,mission:'The '+gr('perimeter is '+P)+'. Two sides are '+cy(b)+' and '+cy(c)+'. Find the missing '+un('height')+'.',known:known(['P = '+P,'b = '+b,'c = '+c],'h'),
      asks:[ask({label:'h =',ans:h,unit:'units',
        hints:[{bar:P+' = '+b+' + '+c+' + '+un('h'),text:'Perimeter = all 3 sides added. Put in what we know.',vis:{pulse:true}},
               {bar:un('h')+' = '+P+' − '+b+' − '+c,text:'Undo the adding: subtract both sides you know.',vis:{dim:[1,2],hl:{0:'orange'}}}],
        wrongs:[[P-b,'Subtract both sides you know, not just one.'],[P-c,'Subtract both sides you know, not just one.'],[P,'That is the whole perimeter.']],
        done:{msg:'Correct! Check: '+b+' + '+c+' + '+h+' = '+P+' ✓',bar:b+' + '+c+' + '+h+' = '+gr(P)+CHECK,reveal:reveal,keep:{outline:'green'},flash:{trace:true}}}),
        askAreaTri(b,h,[c])]};
  }
  return {geo:geo,mission:'The '+ar('area is '+A+' square units')+'. The '+cy('base is '+b)+'. Find the missing '+un('height')+'.',known:known(['A = '+A,'b = '+b],'h'),
    asks:[askHfromAtri(b,h,reveal),askPerimTri([h,b,c])]};
}
function gTri(mode){
  var T=pick([{h:4,p:[[3,5],[3,5]]},{h:8,p:[[6,10],[6,10]]},{h:12,p:[[5,13],[9,15]]},{h:12,p:[[9,15],[5,13]]},{h:12,p:[[5,13],[5,13]]},{h:3,p:[[4,5],[4,5]]},{h:6,p:[[8,10],[8,10]]}]);
  var h=T.h,x=T.p[0][0],b=x+T.p[1][0],s1=T.p[0][1],s2=T.p[1][1],A=b*h/2;
  var geo={type:'poly',aria:'Triangle',pts:[[x,0],[b,h],[0,h]],sides:[s2,b,s1],labels:[lbl(String(s2)),lbl('b = '+b),lbl(String(s1))],
    alt:{from:[x,0],to:[x,h],L:lbl('h = '+h)},ghost:[[0,0],[b,0],[b,h],[0,h]],gridOK:true};
  if(mode==='learn')return {geo:geo,base:{grid:true},mission:'Find the '+gr('perimeter')+' and the '+ar('area')+'. The dashed line is the height: it goes straight up from the base.',asks:[askPerimTri([s1,b,s2]),askAreaTri(b,h,[s1,s2])]};
  if(Math.random()<0.5){
    var Pt=s1+b+s2;geo.labels[0]=Q('?');
    return {geo:geo,mission:'The '+gr('perimeter is '+Pt)+'. Two sides are '+cy(s1)+' and '+cy(b)+'. Find the '+un('missing side')+', then the '+ar('area')+'.',known:known(['P = '+Pt,'sides '+s1+' and '+b],'one side'),
      asks:[ask({label:'? =',ans:s2,unit:'units',
        hints:[{bar:Pt+' = '+s1+' + '+b+' + '+un('?'),text:'Perimeter = all 3 sides added. Put in what we know.',vis:{pulse:true}},
               {bar:un('?')+' = '+Pt+' − '+s1+' − '+b,text:'Undo the adding: subtract both sides you know.',vis:{hl:{0:'orange'},dim:[1,2]}}],
        wrongs:[[Pt-s1,'Subtract both sides you know, not just one.'],[Pt-b,'Subtract both sides you know, not just one.'],[h,'That is the height. The question asks for the slanted side.'],[Pt,'That is the whole perimeter.']],
        done:{msg:'Correct! Check: '+s1+' + '+b+' + '+s2+' = '+Pt+' ✓',bar:s1+' + '+b+' + '+s2+' = '+gr(Pt)+CHECK,reveal:function(g){g.labels[0]=lbl(String(s2));},keep:{outline:'green'},flash:{trace:true}}}),
        askAreaTri(b,h,[s1,s2])]};
  }
  geo.alt.L=Q('h = ?');
  return {geo:geo,mission:'The '+ar('area is '+A+' square units')+'. The '+cy('base is '+b)+'. Find the '+un('height')+' (the dashed line).',known:known(['A = '+A,'b = '+b],'h'),
    asks:[askHfromAtri(b,h,function(g){g.alt.L=lbl('h = '+h);}),askPerimTri([s1,b,s2])]};
}

var PNAME={5:'pentagon',6:'hexagon',8:'octagon'};
function regPts(n){var R=2.5/Math.sin(Math.PI/n),o=[];for(var k=0;k<n;k++){var t=Math.PI/2-Math.PI/n+2*Math.PI*k/n;o.push([R*Math.cos(t),R*Math.sin(t)]);}return o;}
function gPoly(mode){
  var regular=Math.random()<0.5;
  if(regular){
    var n=pick([5,6,8]),s=rand(2,9),P=n*s,nm=PNAME[n];
    var geo={type:'poly',aria:'Regular '+nm,pts:regPts(n),sides:regPts(n).map(function(){return s;}),labels:[lbl('s = '+s)],note:'All '+n+' sides are equal.'};
    for(var i=1;i<n;i++)geo.labels.push(null);
    if(mode==='learn')return {geo:geo,mission:'This regular '+nm+' has sides of '+s+' units. Find its '+gr('perimeter')+'.',
      asks:[ask({label:'P =',ans:P,unit:'units',bar:gr('P')+' = number of sides × '+cy('s'),
        hints:[{bar:'P = '+n+' × s',text:'A regular '+nm+' has '+n+' equal sides. Count them!',vis:{pulse:true}},{bar:'P = '+n+' × '+s,text:'Multiply the number of sides by the side length.'}],
        wrongs:[[4*s,'Count the sides again. A '+nm+' has '+n+' sides, not 4.'],[(n-1)*s,'You missed one side.'],[n+s,'Multiply the number of sides by the side length. Do not add.']],
        done:{msg:'Correct! P = '+n+' × '+s+' = '+P+' units',bar:gr('P')+' = '+n+' × '+s+' = '+gr(P),keep:{outline:'green'},flash:{trace:true}}})]};
    geo.labels[0]=Q('s = ?');
    return {geo:geo,mission:'A regular '+nm+' has a '+gr('perimeter of '+P)+'. Find the '+un('side length')+'.',known:known(['P = '+P,'n = '+n+' sides'],'s'),
      asks:[ask({label:'s =',ans:s,unit:'units',
        hints:[{bar:P+' = '+n+' × '+un('s'),text:'A regular '+nm+' has '+n+' equal sides: P = '+n+' × s.',vis:{pulse:true}},{bar:un('s')+' = '+P+' ÷ '+n,text:'Undo the "× '+n+'" by dividing.'}],
        wrongs:[[P-n,'Undo "× '+n+'" with "÷ '+n+'", not "−".'],[P/4,'A '+nm+' has '+n+' sides, not 4.'],[P,'That is the whole perimeter.']],
        done:{msg:'Correct! Check: '+n+' × '+s+' = '+P+' ✓',bar:n+' × '+s+' = '+gr(P)+CHECK,reveal:function(g){g.labels[0]=lbl('s = '+s);},keep:{outline:'green'},flash:{trace:true}}})]};
  }
  var n2=pick([5,6]),nm2=PNAME[n2],sides=[];for(var j=0;j<n2;j++)sides.push(rand(2,12));
  var P2=sides.reduce(function(a,b){return a+b;},0);
  var geo2={type:'poly',aria:'Irregular '+nm2,pts:regPts(n2),sides:sides,labels:sides.map(function(v){return lbl(String(v));}),note:'Not drawn to scale.'};
  if(mode==='learn')return {geo:geo2,mission:'Find the '+gr('perimeter')+' of this '+nm2+'.',
    asks:[ask({label:'P =',ans:P2,unit:'units',bar:gr('P')+' = add all '+n2+' sides',
      hints:[{bar:'P = '+sides.join(' + '),text:'Add every side. Touch each side as you count so you do not skip one.',vis:{pulse:true}}],
      wrongs:missedSides(P2,sides,n2),
      done:{msg:'Correct! P = '+P2+' units',bar:gr('P')+' = '+sides.join(' + ')+' = '+gr(P2),keep:{outline:'green'},flash:{trace:true}}})]};
  var m=rand(0,n2-1),kn=sides.filter(function(v,i){return i!==m;}),sumK=kn.reduce(function(a,b){return a+b;},0);
  geo2.labels[m]=Q('?');
  var hl={};hl[m]='orange';
  return {geo:geo2,mission:'The '+gr('perimeter is '+P2)+'. Find the '+un('missing side')+'.',known:known(['P = '+P2],'one side'),
    asks:[ask({label:'? =',ans:sides[m],unit:'units',
      hints:[{bar:P2+' = '+kn.join(' + ')+' + '+un('?'),text:'Perimeter = all sides added. Put in what we know.',vis:{pulse:true}},
             {bar:un('?')+' = '+P2+' − ('+kn.join(' + ')+')',text:'Add the sides you know, then subtract that total from the perimeter.',vis:{hl:hl}}],
      wrongs:[[sumK,'That is the total of the sides you know. Subtract it from the perimeter.'],[P2,'That is the whole perimeter.']],
      done:{msg:'Correct! Check: '+sides.join(' + ')+' = '+P2+' ✓',bar:sides.join(' + ')+' = '+gr(P2)+CHECK,reveal:function(g){g.labels[m]=lbl(String(sides[m]));},keep:{outline:'green'},flash:{trace:true}}})]};
}

function gL(mode){
  var W=rand(6,11),Ht=rand(5,9),cw=rand(2,W-3),ch=rand(2,Ht-2),a=W-cw,r=Ht-ch;
  var sides=[a,ch,cw,r,W,Ht],P=2*(W+Ht),A=a*ch+W*r;
  var geo={type:'poly',aria:'L-shape',pts:[[0,0],[a,0],[a,ch],[W,ch],[W,Ht],[0,Ht]],sides:sides,labels:sides.map(function(v){return lbl(String(v));}),gridOK:true,
    split:{a:[[0,0],[a,0],[a,ch],[0,ch]],b:[[0,ch],[W,ch],[W,Ht],[0,Ht]],line:[[0,ch],[a,ch]]}};
  var askP=ask({label:'P =',ans:P,unit:'units',mission:'Now find the '+gr('perimeter')+': go all the way around.',bar:gr('P')+' = add all 6 sides',
    hints:[{bar:'P = '+sides.join(' + '),text:'Start at one corner and go around once, adding all 6 sides.',vis:{pulse:true}}],
    wrongs:missedSides(P,sides,6).concat([[A,'That is the area. Perimeter is the distance around.']]),
    done:{msg:'Correct! P = '+P+' units',bar:gr('P')+' = '+sides.join(' + ')+' = '+gr(P),keep:{outline:'green'},flash:{trace:true}}});
  var askA=ask({label:'A =',ans:A,unit:'square units',mission:'Now find the '+ar('area')+'. Tip: split the L into two rectangles.',bar:ar('A')+' = rectangle 1 + rectangle 2',
    hints:[{bar:'A = '+a+' × '+ch+' + '+W+' × '+r,text:'Cut the L into two rectangles along the dashed line. Find the area of each one.',vis:{split:true}},
           {bar:'A = '+(a*ch)+' + '+(W*r),text:'Now add the two areas together.',vis:{split:true}}],
    wrongs:[[W*Ht,'That counts the cut-out corner too. Split the L into two rectangles instead.'],[a*ch,'That is only the top part. Add the bottom rectangle too.'],
            [W*r,'That is only the bottom part. Add the top rectangle too.'],[P,'That is the perimeter. Area counts the squares inside.']],
    done:{msg:'Correct! A = '+(a*ch)+' + '+(W*r)+' = '+A+' square units',bar:ar('A')+' = '+(a*ch)+' + '+(W*r)+' = '+ar(A),keep:{fill:true,split:false}}});
  if(mode==='learn')return {geo:geo,base:{grid:true},mission:'Find the '+gr('perimeter')+' and the '+ar('area')+' of this L-shape.',asks:[askP,askA]};
  geo.labels[0]=Q('?');
  var hl1={0:'orange',2:'orange',4:'orange'};
  return {geo:geo,mission:'One side is missing. Find the '+un('top side')+', then the '+gr('perimeter')+' and the '+ar('area')+'.',known:known(['bottom = '+W,'notch = '+cw],'top side'),
    asks:[ask({label:'? =',ans:a,unit:'units',
      hints:[{bar:un('?')+' + '+cw+' = '+W,text:'The top side plus the notch is as long as the whole bottom.',vis:{hl:hl1,dim:[1,3,5]}},
             {bar:un('?')+' = '+W+' − '+cw,text:'Undo the adding: subtract.',vis:{hl:{0:'orange'},dim:[1,3,5]}}],
      wrongs:[[W,'That is the whole bottom. The top is shorter because of the notch.'],[W+cw,'Subtract the notch, do not add it.'],[cw,'That is the notch. The top side is the other part.']],
      done:{msg:'Correct! '+a+' + '+cw+' = '+W+' ✓',bar:a+' + '+cw+' = '+W+CHECK,reveal:function(g){g.labels[0]=lbl(String(a));}}}),askP,askA]};
}

function gPara(mode){
  var t=pick([[3,4,5],[4,3,5],[6,8,10],[8,6,10]]),o=t[0],h=t[1],s=t[2],b=rand(o+2,Math.min(o+7,13)),A=b*h,P=2*(b+s);
  var geo={type:'poly',aria:'Parallelogram',pts:[[o,0],[o+b,0],[b,h],[0,h]],sides:[b,s,b,s],labels:[null,null,lbl('b = '+b),lbl(String(s))],
    alt:{from:[o,0],to:[o,h],L:lbl('h = '+h)},ghost:[[o,0],[o+b,0],[o+b,h],[o,h]],gridOK:true};
  var askP=ask({label:'P =',ans:P,unit:'units',mission:'Now find the '+gr('perimeter')+': the distance around.',bar:gr('P')+' = 2 × ('+cy('b')+' + slanted side)',
    hints:[{bar:'P = 2 × ('+b+' + '+s+')',text:'Opposite sides match, just like a rectangle. For perimeter, use the slanted side, because that is the edge.',vis:{pulse:true}}],
    wrongs:[[2*(b+h),'The height is inside the shape. For perimeter, use the slanted edge.'],[b+s,'That is only half the way around. Double it.'],[b*h,'That is the area.']],
    done:{msg:'Correct! P = 2 × ('+b+' + '+s+') = '+P+' units',bar:gr('P')+' = 2 × ('+b+' + '+s+') = '+gr(P),keep:{outline:'green'},flash:{trace:true}}});
  var askAP=ask({label:'A =',ans:A,unit:'square units',mission:'Now find the '+ar('area')+'.',bar:ar('A')+' = '+cy('b')+' × '+cy('h'),
      hints:[{bar:'cut + slide = rectangle',text:'Cut the triangle off the left end and slide it to the right end. It makes a rectangle!',vis:{ghost:true,grid:true}},
             {bar:'A = '+b+' × '+h,text:'Use the straight-up height (the dashed line), not the slanted side.',vis:{ghost:true}}],
      wrongs:[[b*s,'You used the slanted side. Area needs the straight-up height.'],[b*h/2,'No ½ here. The ½ is for triangles.'],[P,'That is the perimeter.']],
      done:{msg:'Correct! A = '+b+' × '+h+' = '+A+' square units',bar:ar('A')+' = '+b+' × '+h+' = '+ar(A),keep:{fill:true}}});
  if(mode==='mission'&&Math.random()<0.5){
    geo.labels[3]=Q('s = ?');
    return {geo:geo,mission:'The '+gr('perimeter is '+P)+'. The '+cy('base is '+b)+'. Find the '+un('slanted side')+', then the '+ar('area')+'.',known:known(['P = '+P,'b = '+b,'h = '+h],'s'),
      asks:[ask({label:'s =',ans:s,unit:'units',
        hints:[{bar:P+' = 2 × ('+b+' + '+un('s')+')',text:'Opposite sides match: P = 2 × (b + s). Put in what we know.',vis:{pulse:true}},
               {bar:b+' + '+un('s')+' = '+P+' ÷ 2 = '+(P/2),text:'Undo the "× 2" by cutting the perimeter in half.',vis:{dim:[0,1]}},
               {bar:un('s')+' = '+(P/2)+' − '+b,text:'Undo the "+ '+b+'" by subtracting.',vis:{dim:[0,1,2],hl:{3:'orange'}}}],
        wrongs:[[P/2,'That is b + s together. Subtract the base to get s.'],[P-b,'Cut the perimeter in half first.'],[h,'That is the height. The slanted side is the edge.'],[P,'That is the whole perimeter.']],
        done:{msg:'Correct! Check: 2 × ('+b+' + '+s+') = '+P+' ✓',bar:'2 × ('+b+' + '+s+') = '+gr(P)+CHECK,reveal:function(g){g.labels[3]=lbl(String(s));},keep:{outline:'green'},flash:{trace:true}}}),
        askAP]};
  }
  if(mode==='learn')return {geo:geo,base:{grid:true},mission:'Find the '+gr('perimeter')+' and the '+ar('area')+' of this parallelogram. The dashed line is the height.',
    asks:[askP,ask({label:'A =',ans:A,unit:'square units',mission:'Now find the '+ar('area')+'.',bar:ar('A')+' = '+cy('b')+' × '+cy('h'),
      hints:[{bar:'cut + slide = rectangle',text:'Cut the triangle off the left end and slide it to the right end. It makes a rectangle!',vis:{ghost:true,grid:true}},
             {bar:'A = '+b+' × '+h,text:'Use the straight-up height (the dashed line), not the slanted side.',vis:{ghost:true}}],
      wrongs:[[b*s,'You used the slanted side. Area needs the straight-up height.'],[b*h/2,'No ½ here. The ½ is for triangles.'],[P,'That is the perimeter.']],
      done:{msg:'Correct! A = '+b+' × '+h+' = '+A+' square units',bar:ar('A')+' = '+b+' × '+h+' = '+ar(A),keep:{fill:true}}})]};
  geo.alt.L=Q('h = ?');
  return {geo:geo,mission:'The '+ar('area is '+A+' square units')+'. The '+cy('base is '+b)+'. Find the '+un('height')+' (the dashed line).',known:known(['A = '+A,'b = '+b],'h'),
    asks:[ask({label:'h =',ans:h,unit:'units',
      hints:[{bar:A+' = '+b+' × '+un('h'),text:'Area = b × h. Put in what we know.',vis:{ghost:true}},{bar:un('h')+' = '+A+' ÷ '+b,text:'Undo the "× '+b+'" by dividing.'}],
      wrongs:[[s,'That is the slanted side. The height goes straight up.'],[A-b,'Undo multiplication with division.']],
      done:{msg:'Correct! Check: '+b+' × '+h+' = '+A+' ✓',bar:b+' × '+h+' = '+ar(A)+CHECK,reveal:function(g){g.alt.L=lbl('h = '+h);},keep:{fill:true}}}),askP]};
}

/* circles (stretch) */
function gCircle(mode){
  var r=rand(1,10),d=2*r,C=r2(3.14*d),A=r2(3.14*r*r);
  var geo={type:'circle',aria:'Circle',r:r,lab:lbl('r = '+r),diam:false,gridOK:true};
  var askC=ask({label:'C =',ans:C,unit:'units',dec:true,mission:'Find the '+gr('circumference')+': the distance around the circle.',bar:gr('C')+' = π × d',
    hints:[{bar:'C = 3.14 × d',text:'Circumference is the perimeter of a circle. Use π ≈ 3.14 and the diameter d (all the way across).',vis:{pulse:true}},
           {bar:'d = 2 × '+r+' = '+d+'  →  C = 3.14 × '+d,text:'The diameter is 2 × the radius. Then multiply by 3.14.',vis:{diam:true}}],
    wrongs:[[3.14*r,'That uses the radius. Circumference uses the diameter: d = 2 × r.'],[3.14*r*r,'That is the area.'],[d,'That is the diameter, the distance across. Circumference goes around.']],
    done:{msg:'Correct! C = 3.14 × '+d+' = '+nf(C)+' units',bar:gr('C')+' = 3.14 × '+d+' = '+gr(nf(C)),keep:{outline:'green'},flash:{trace:true}}});
  var askA=ask({label:'A =',ans:A,unit:'square units',dec:true,mission:'Now find the '+ar('area')+' of the circle.',bar:ar('A')+' = π × r × r',
    hints:[{bar:'A = 3.14 × '+r+' × '+r,text:'Area of a circle = π × r × r, with π ≈ 3.14. (r × r can also be written r².)',vis:{grid:true}},
           {bar:'A = 3.14 × '+(r*r),text:'First '+r+' × '+r+' = '+(r*r)+'. Then multiply by 3.14.',vis:{grid:true}}],
    wrongs:[[3.14*d,'That is π × d, the circumference.'],[3.14*d*d,'Use the radius in r², not the diameter.'],[r*r,'Multiply by π (3.14) too.'],[3.14*r*2,'r² means r × r, not r × 2.']],
    done:{msg:'Correct! A = 3.14 × '+(r*r)+' = '+nf(A)+' square units',bar:ar('A')+' = 3.14 × '+r+'² = '+ar(nf(A)),keep:{fill:true}}});
  if(mode==='learn')return {geo:geo,base:{grid:true},mission:'This circle has a radius of '+r+(r===1?' unit':' units')+'. Find its '+gr('circumference')+', then its '+ar('area')+'. Use π ≈ 3.14.',asks:[askC,askA]};
  geo.lab=Q('r = ?');
  var reveal=function(g){g.lab=lbl('r = '+r);};
  if(Math.random()<0.5){
    return {geo:geo,mission:'The '+gr('circumference is '+nf(C))+' units. Find the '+un('radius')+'. Use π ≈ 3.14.',known:known(['C = '+nf(C),'π ≈ 3.14'],'r'),
      asks:[ask({label:'r =',ans:r,unit:'units',
        hints:[{bar:nf(C)+' = 3.14 × '+un('d'),text:'C = π × d. Put in what we know.',vis:{pulse:true}},
               {bar:un('d')+' = '+nf(C)+' ÷ 3.14 = '+d,text:'Undo "× 3.14" by dividing: the diameter is '+d+'.',vis:{diam:true}},
               {bar:un('r')+' = '+d+' ÷ 2',text:'The radius is half the diameter.',vis:{diam:true}}],
        wrongs:[[d,'That is the diameter. The radius is half of it.'],[r2(C/3.14),'That is the diameter. The radius is half of it.']],
        done:{msg:'Correct! Check: 3.14 × '+d+' = '+nf(C)+' ✓',bar:'3.14 × '+d+' = '+gr(nf(C))+CHECK,reveal:reveal,keep:{outline:'green'},flash:{trace:true}}}),askA]};
  }
  return {geo:geo,mission:'The '+ar('area is '+nf(A)+' square units')+'. Find the '+un('radius')+'. Use π ≈ 3.14.',known:known(['A = '+nf(A),'π ≈ 3.14'],'r'),
    asks:[ask({label:'r =',ans:r,unit:'units',
      hints:[{bar:nf(A)+' = 3.14 × '+un('r')+' × '+un('r'),text:'A = π × r × r. Put in what we know.'},
             {bar:un('r')+'² = '+nf(A)+' ÷ 3.14 = '+(r*r),text:'Undo "× 3.14" by dividing. Now r × r = '+(r*r)+'.'},
             {bar:un('r')+' × '+un('r')+' = '+(r*r),text:'Which number times itself makes '+(r*r)+'?'}],
      wrongs:[[r*r,'That is r². Now find the number that times itself makes it.'],[r2(r*r/2),'r² is r × r, not 2 × r.']],
      done:{msg:'Correct! Check: 3.14 × '+r+'² = '+nf(A)+' ✓',bar:'3.14 × '+r+' × '+r+' = '+ar(nf(A))+CHECK,reveal:reveal,keep:{fill:true}}}),askC]};
}

/* boxes */
function askVol(l,w,h,u){
  var V=l*w*h,X=U(u);
  return ask({label:'V =',ans:V,unit:X.cu,mission:'Now find the '+vi('volume')+': how many cubes fill the box?',bar:vi('V')+' = '+cy('l')+' × '+cy('w')+' × '+cy('h')+' = B × h',
    hints:[{bar:'V = '+l+' × '+w+' × '+h+' = '+(l*w)+' × '+h,text:'Each layer has '+l+' × '+w+' = '+(l*w)+' cubes, and there are '+h+' layers. V = base area × height.',vis:{layerHl:0}}],
    wrongs:[[l+w+h,'Adding gives a length. Volume multiplies all three.'],[l*w,'That is only the bottom layer. Stack all the layers.'],[l*w+h,'Multiply by the height, do not add it.'],
            [2*(l*w+l*h+w*h),'That counts the outside faces. Volume counts the cubes inside.']],
    done:{msg:'Correct! V = '+l+' × '+w+' × '+h+' = '+V+' '+X.cu,bar:vi('V')+' = '+l+' × '+w+' × '+h+' = '+vi(V),keep:{fill:true,layerHl:null,solid:false}}});
}
function gBox(mode){
  var l=rand(2,6),w=rand(2,4),h=rand(2,5),V=l*w*h;
  var geo={type:'iso',aria:'Box',l:l,w:w,h:h,labels:{l:lbl('l = '+l),w:lbl('w = '+w),h:lbl('h = '+h)}};
  if(mode==='learn')return {geo:geo,mission:'This box is built from unit cubes. Find the '+cy('base area')+', then the '+vi('volume')+'.',
    asks:[ask({label:'B =',ans:l*w,unit:'square units',bar:'B = '+cy('l')+' × '+cy('w'),
      hints:[{bar:'B = '+l+' × '+w,text:'The bottom layer is a rectangle of cubes. Its area is length × width.',vis:{layerHl:0}}],
      wrongs:[[l+w,'Multiply length × width, do not add.'],[2*(l+w),'That is the perimeter of the bottom.'],[V,'That is the whole volume. Just the bottom layer for now.']],
      done:{msg:'Correct! The bottom layer has '+(l*w)+' cubes.',bar:'B = '+l+' × '+w+' = '+(l*w)+CHECK,keep:{layerHl:0}}}),askVol(l,w,h)]};
  geo.labels.h=Q('h = ?');
  return {geo:geo,base:{solid:true},mission:'The '+vi('volume is '+V+' cubic units')+'. The box is '+cy(l)+' long and '+cy(w)+' wide. Find the '+un('height')+'.',known:known(['V = '+V,'l = '+l,'w = '+w],'h'),
    asks:[ask({label:'h =',ans:h,unit:'units',
      hints:[{bar:V+' = '+l+' × '+w+' × '+un('h'),text:'Volume = l × w × h. Put in what we know.'},
             {bar:V+' = '+(l*w)+' × '+un('h'),text:'Multiply what you know: '+l+' × '+w+' = '+(l*w)+'. That is one layer of cubes.'},
             {bar:un('h')+' = '+V+' ÷ '+(l*w),text:'How many layers of '+(l*w)+' make '+V+'? Divide.'}],
      wrongs:[[V-l-w,'Volume uses multiplication, so undo it with division.'],[l*w,'That is one layer ('+(l*w)+' cubes). How many layers stack up to '+V+'?'],
              [V/l,'Divide by both l and w ('+l+' × '+w+' = '+(l*w)+').'],[V/w,'Divide by both l and w ('+l+' × '+w+' = '+(l*w)+').']],
      fallback:'Not quite. Check it: '+l+' × '+w+' × your number should equal '+V+'.',
      done:{msg:'Correct! Check: '+l+' × '+w+' × '+h+' = '+V+' ✓',bar:l+' × '+w+' × '+h+' = '+vi(V)+CHECK,reveal:function(g){g.labels.h=lbl('h = '+h);},keep:{fill:true,solid:false}}})]};
}
function gCube(mode){
  var s=rand(2,5),V=s*s*s;
  var geo={type:'iso',aria:'Cube',l:s,w:s,h:s,labels:{l:lbl('s = '+s),w:null,h:null}};
  if(mode==='learn')return {geo:geo,mission:'Every edge of this cube is '+s+' units. Find its '+vi('volume')+'.',
    asks:[ask({label:'V =',ans:V,unit:'cubic units',bar:vi('V')+' = s³ = s × s × s',
      hints:[{bar:'V = '+s+' × '+s+' × '+s,text:'Multiply the edge 3 times: s × s × s (you may see it written s³, "s cubed").',vis:{layerHl:0}},
             {bar:'V = '+(s*s)+' × '+s,text:'One layer is '+s+' × '+s+' = '+(s*s)+' cubes. Stack '+s+' layers.',vis:{layerHl:0}}],
      wrongs:[[3*s,'s³ means s × s × s, not 3 × s.'],[s*s,'That is one layer. Stack all the layers.'],[s+3,'The little 3 means multiply s by itself 3 times.']],
      done:{msg:'Correct! V = '+s+' × '+s+' × '+s+' = '+V+' cubic units',bar:vi('V')+' = '+s+' × '+s+' × '+s+' = '+vi(V),keep:{fill:true,layerHl:null}}})]};
  geo.labels.l=Q('s = ?');
  return {geo:geo,base:{solid:true},mission:'This cube has a '+vi('volume of '+V+' cubic units')+'. Find the '+un('edge length')+'.',known:known(['V = '+V],'s'),
    asks:[ask({label:'s =',ans:s,unit:'units',
      hints:[{bar:un('s')+' × '+un('s')+' × '+un('s')+' = '+V,text:'V = s × s × s.'},{bar:un('s')+' × '+un('s')+' × '+un('s')+' = '+V,text:'Which number times itself 3 times makes '+V+'? Try 2 × 2 × 2, then 3 × 3 × 3, and so on.'}],
      wrongs:[[V/3,'s³ is not 3 × s. Find a number multiplied by itself 3 times.'],[V,'That is the volume. The edge is much shorter.']],
      done:{msg:'Correct! Check: '+s+' × '+s+' × '+s+' = '+V+' ✓',bar:s+' × '+s+' × '+s+' = '+vi(V)+CHECK,reveal:function(g){g.labels.l=lbl('s = '+s);},keep:{fill:true,solid:false}}})]};
}

/* pick-the-measure word problems */
var PICK=[
  {m:'Perimeter',t:function(a,b){return 'Maya is putting a fence around a garden that is '+a+' feet long and '+b+' feet wide. How much fence does she need?';}},
  {m:'Perimeter',t:function(a,b){return 'Leo is gluing ribbon around the edge of a poster '+a+' feet long and '+b+' feet wide. How much ribbon does he need?';}},
  {m:'Perimeter',t:function(a,b){return 'A string of lights goes all the way around a window '+a+' feet wide and '+b+' feet tall. How long is the string?';}},
  {m:'Perimeter',t:function(a,b){return 'Ms. Patel puts border trim around a bulletin board '+a+' feet long and '+b+' feet wide. How much trim does she need?';}},
  {m:'Area',t:function(a,b){return 'Sam needs carpet to cover a bedroom floor that is '+a+' feet long and '+b+' feet wide. How much carpet?';}},
  {m:'Area',t:function(a,b){return 'Grass seed will cover a yard '+a+' feet long and '+b+' feet wide. How much ground does it cover?';}},
  {m:'Area',t:function(a,b){return 'Square tiles will cover a patio '+a+' feet long and '+b+' feet wide. How many square feet of tile?';}},
  {m:'Area',t:function(a,b){return 'Ava is painting a wall '+a+' feet wide and '+b+' feet tall. How much wall will she cover?';}},
  {m:'Volume',t:function(a,b,c){return 'Sand will fill a sandbox '+a+' feet long, '+b+' feet wide and '+c+' feet deep. How much sand?';}},
  {m:'Volume',t:function(a,b,c){return 'Water will fill a fish tank '+a+' feet long, '+b+' feet wide and '+c+' feet tall. How much water?';}},
  {m:'Volume',t:function(a,b,c){return 'Soil will fill a planter box '+a+' feet long, '+b+' feet wide and '+c+' feet deep. How much soil?';}},
  {m:'Volume',t:function(a,b,c){return 'How many 1-foot cubes fill a storage box '+a+' feet long, '+b+' feet wide and '+c+' feet tall?';}}
];
var CLUE={Perimeter:'Yes! Going around the edge means '+gr('perimeter')+'.',Area:'Yes! Covering a flat surface means '+ar('area')+'.',Volume:'Yes! Filling a 3-D space means '+vi('volume')+'.'};
var GEN={rect:gRect,square:gSquare,rtri:gRtri,poly:gPoly,lshape:gL,box:gBox,cube:gCube,circle:gCircle,tri:gTri,para:gPara};

/* ---------- Pick it: story problems for the chosen shape ---------- */
/* numbers of a generated shape, read back from its drawing */
function dims(shape, g) {
  var sd = g.sides || [], al = g.alt ? g.alt.to[1] - g.alt.from[1] : 0;
  switch (shape) {
    case 'rect': return {l: sd[0], w: sd[1]};
    case 'square': return {s: sd[0]};
    case 'rtri': return {b: sd[1], h: sd[0], c: sd[2]};
    case 'tri': return {b: sd[1], h: al, a: g.alt.from[0], s1: sd[2], s2: sd[0]};
    case 'poly': return {sides: sd.slice(), reg: sd.every(function (x) { return x === sd[0]; }), n: sd.length};
    case 'lshape': return {a: sd[0], ch: sd[1], cw: sd[2], r: sd[3], W: sd[4], H: sd[5]};
    case 'para': return {b: sd[0], s: sd[1], h: al, o: g.alt.from[0]};
    case 'circle': return {r: g.r};
    case 'box': return {l: g.l, w: g.w, h: g.h};
    case 'cube': return {s: g.l};
  }
  return {};
}
/* the explainer that shows why this shape's formula works, with its own numbers */
function whyFor(shape, g) {
  var d = dims(shape, g);
  switch (shape) {
    case 'rect': return {id: 'rect-pa', l: d.l, w: d.w};
    case 'square': return {id: 'rect-pa', l: d.s, w: d.s};
    case 'rtri': return {id: 'tri-area', b: d.b, h: d.h};
    case 'tri': return {id: 'tri-area', b: d.b, h: d.h, a: d.a, any: true, s1: d.s1, s2: d.s2};
    case 'poly': return d.reg ? {id: 'poly-perim', n: d.n, s: d.sides[0]} : {id: 'poly-perim', sides: d.sides};
    case 'lshape': return {id: 'lshape', W: d.W, H: d.H, cw: d.cw, ch: d.ch};
    case 'para': return {id: 'para-area', b: d.b, h: d.h, o: d.o};
    case 'circle': return {id: 'circle', r: d.r};
    case 'box': return {id: 'volume', l: d.l, w: d.w, h: d.h};
    case 'cube': return {id: 'volume', l: d.s, w: d.s, h: d.s};
  }
  return null;
}
var NAMES = [['Maya', 'she'], ['Leo', 'he'], ['Ava', 'she'], ['Sam', 'he'], ['Ms. Patel', 'she'], ['Omar', 'he'], ['Zoe', 'she'], ['Mr. Kim', 'he']];
var FLAT_P = [['puts a fence around', 'garden', 'How many feet of fence does {he} need?'], ['glues ribbon around the edge of', 'poster', 'How many feet of ribbon does {he} need?'],
  ['puts border trim around', 'bulletin board', 'How many feet of trim does {he} need?'], ['walks once around the edge of', 'park', 'How many feet does {he} walk?']];
var FLAT_A = [['needs carpet to cover', 'floor', 'How many square feet of carpet does {he} need?'], ['spreads grass seed over', 'yard', 'How many square feet does the seed cover?'],
  ['lays square tiles over', 'patio', 'How many square feet of tile does {he} need?'], ['paints', 'wall', 'How many square feet will the paint cover?']];
var CIRC_P = [['puts a fence around', 'garden', 'How many feet of fence does {he} need? Use π ≈ 3.14.'], ['sews trim around the edge of', 'rug', 'How many feet of trim does {he} need? Use π ≈ 3.14.']];
var CIRC_A = [['spreads mulch over', 'garden', 'How many square feet does the mulch cover? Use π ≈ 3.14.'], ['buys a cover for', 'pool', 'How many square feet does the cover need? Use π ≈ 3.14.']];
var BOX_P = [['puts tape all the way around the top edge of', 'How many feet of tape does {he} need?']];
var BOX_A = [['puts a mat on the bottom of', 'How many square feet of mat does {he} need?'], ['paints the bottom of', 'How many square feet does {he} paint?']];
var BOX_V = [['fills', 'How many cubic feet of sand does {he} need?', ' with sand'], ['packs 1-foot cubes into', 'How many cubes fill it?', '']];
function fill(t, who) { return t.replace(/\{he\}/g, who[1]); }

function gPick(shape) {
  var g = GEN[shape]('learn'), d = dims(shape, g.geo), who = pick(NAMES), geo = g.geo;
  if (shape === 'poly' && !d.reg && Math.random() < 0.6) { for (var tries = 0; tries < 20 && !d.reg; tries++) { g = GEN.poly('learn'); geo = g.geo; d = dims('poly', geo); } }
  var M = {};   /* measure -> {ans, bar, hint, sent} */
  var iso3 = shape === 'box' || shape === 'cube';
  var L0 = iso3 ? (shape === 'cube' ? d.s : d.l) : 0, W0 = iso3 ? (shape === 'cube' ? d.s : d.w) : 0, H0 = iso3 ? (shape === 'cube' ? d.s : d.h) : 0;
  var desc;
  if (shape === 'rect') { desc = function (n) { return 'a rectangular ' + n + ' ' + d.l + ' feet long and ' + d.w + ' feet wide'; };
    M.Perimeter = {ans: 2 * (d.l + d.w), bar: 'P = 2 × (' + d.l + ' + ' + d.w + ')', hint: 'Going around: add all 4 sides, or 2 × (l + w).'};
    M.Area = {ans: d.l * d.w, bar: 'A = ' + d.l + ' × ' + d.w, hint: 'Covering: rows × squares in a row, l × w.'}; }
  else if (shape === 'square') { desc = function (n) { return 'a square ' + n + ' ' + d.s + ' feet on each side'; };
    M.Perimeter = {ans: 4 * d.s, bar: 'P = 4 × ' + d.s, hint: 'Going around: 4 equal sides, 4 × s.'};
    M.Area = {ans: d.s * d.s, bar: 'A = ' + d.s + ' × ' + d.s, hint: 'Covering: s × s.'}; }
  else if (shape === 'rtri') { desc = function (n) { return 'a triangle-shaped ' + n + ' with sides of ' + d.h + ', ' + d.b + ' and ' + d.c + ' feet. The ' + d.b + '-foot and ' + d.h + '-foot sides meet in a square corner'; };
    M.Perimeter = {ans: d.b + d.h + d.c, bar: 'P = ' + d.h + ' + ' + d.b + ' + ' + d.c, hint: 'Going around: add all 3 sides.'};
    M.Area = {ans: d.b * d.h / 2, bar: 'A = ½ × ' + d.b + ' × ' + d.h, hint: 'Covering: a right triangle is half a rectangle, ½ × b × h. Use the two sides at the square corner.'}; }
  else if (shape === 'tri') { desc = function (n) { return 'a triangle-shaped ' + n + ' with sides of ' + d.s1 + ', ' + d.b + ' and ' + d.s2 + ' feet. Its height from the ' + d.b + '-foot base is ' + d.h + ' feet'; };
    M.Perimeter = {ans: d.s1 + d.b + d.s2, bar: 'P = ' + d.s1 + ' + ' + d.b + ' + ' + d.s2, hint: 'Going around: add the 3 sides. The height is inside the shape, so it is not part of the edge.'};
    M.Area = {ans: d.b * d.h / 2, bar: 'A = ½ × ' + d.b + ' × ' + d.h, hint: 'Covering: ½ × base × height. Use the straight-up height, not a slanted side.'}; }
  else if (shape === 'para') { desc = function (n) { return 'a ' + n + ' shaped like a parallelogram. Its base is ' + d.b + ' feet, its slanted sides are ' + d.s + ' feet, and its height is ' + d.h + ' feet'; };
    M.Perimeter = {ans: 2 * (d.b + d.s), bar: 'P = 2 × (' + d.b + ' + ' + d.s + ')', hint: 'Going around: the edges are the base and the slanted side, twice each.'};
    M.Area = {ans: d.b * d.h, bar: 'A = ' + d.b + ' × ' + d.h, hint: 'Covering: base × straight-up height (cut and slide makes a rectangle).'}; }
  else if (shape === 'lshape') { desc = function (n) { return 'an L-shaped ' + n + '. The picture shows its sides in feet'; };
    M.Perimeter = {ans: 2 * (d.W + d.H), bar: 'P = add all 6 sides', hint: 'Going around: add all 6 sides (shortcut: 2 × (' + d.W + ' + ' + d.H + ')).'};
    M.Area = {ans: d.a * d.ch + d.W * d.r, bar: 'A = ' + d.a + ' × ' + d.ch + ' + ' + d.W + ' × ' + d.r, hint: 'Covering: split the L into two rectangles and add.'}; }
  else if (shape === 'circle') { desc = function (n) { return 'a round ' + n + ' with a radius of ' + d.r + ' feet'; };
    M.Perimeter = {ans: r2(3.14 * 2 * d.r), bar: 'C = 3.14 × ' + (2 * d.r), hint: 'Going around a circle: circumference, C = π × d. The diameter is 2 × ' + d.r + ' = ' + (2 * d.r) + '.', dec: true, lab: 'C ='};
    M.Area = {ans: r2(3.14 * d.r * d.r), bar: 'A = 3.14 × ' + d.r + ' × ' + d.r, hint: 'Covering a circle: A = π × r × r.', dec: true}; }
  else if (shape === 'poly') { var nm = {5: 'pentagon', 6: 'hexagon', 8: 'octagon'}[d.n] || 'polygon', T = rand(4, 15);
    desc = d.reg ? function (n) { return 'a ' + n + ' shaped like a regular ' + nm + ', with ' + d.n + ' equal sides of ' + d.sides[0] + ' feet'; } : function (n) { return 'a ' + n + ' shaped like a ' + nm + '. The picture shows its sides in feet'; };
    M.Perimeter = {ans: d.sides.reduce(function (a, b) { return a + b; }, 0), bar: d.reg ? 'P = ' + d.n + ' × ' + d.sides[0] : 'P = ' + d.sides.join(' + '), hint: 'Going around: add every side.'};
    if (d.reg) M.Area = {ans: d.n * T, bar: 'A = ' + d.n + ' × ' + T, hint: 'Covering: the ' + nm + ' is made of ' + d.n + ' equal triangles of ' + T + ' square feet each.', extra: ' It is made of ' + d.n + ' equal triangles, each covering ' + T + ' square feet.'}; }
  else { desc = shape === 'cube' ? function () { return 'a cube-shaped box ' + d.s + ' feet on each edge'; } : function () { return 'a box ' + d.l + ' feet long, ' + d.w + ' feet wide and ' + d.h + ' feet tall'; };
    M.Perimeter = {ans: 2 * (L0 + W0), bar: 'P = 2 × (' + L0 + ' + ' + W0 + ')', hint: 'Going around the top edge: it is a ' + L0 + ' by ' + W0 + ' rectangle, so 2 × (l + w).'};
    M.Area = {ans: L0 * W0, bar: 'B = ' + L0 + ' × ' + W0, hint: 'Covering the bottom: the base area, l × w.'};
    M.Volume = {ans: L0 * W0 * H0, bar: 'V = ' + L0 + ' × ' + W0 + ' × ' + H0, hint: 'Filling: one layer is ' + L0 + ' × ' + W0 + ' = ' + L0 * W0 + ' cubes, times ' + H0 + ' layers.'}; }
  var keys = Object.keys(M), m = pick(keys), it = M[m], sent;
  if (iso3) { var tp = pick(m === 'Perimeter' ? BOX_P : m === 'Area' ? BOX_A : BOX_V); sent = who[0] + ' ' + tp[0] + ' ' + desc() + (tp[2] || '') + '. ' + fill(tp[1], who); }
  else { var tpl = pick(shape === 'circle' ? (m === 'Perimeter' ? CIRC_P : CIRC_A) : (m === 'Perimeter' ? FLAT_P : FLAT_A)); sent = who[0] + ' ' + tpl[0] + ' ' + desc(tpl[1]) + '.' + (it.extra || '') + ' ' + fill(tpl[2], who); }
  var choice = ask({type: 'choice', label: 'Which do you need?', ans: m, options: ['Perimeter', 'Area', 'Volume'],
    hints: [{bar: 'Clue words', text: 'Look for the clue. "Around" or "edge" means perimeter. "Cover" means area. "Fill" means volume.'}],
    wrongs: [['Perimeter', 'Perimeter is the distance around the edge. Is this about going around?'], ['Area', 'Area covers a flat surface. Is this about covering?'], ['Volume', iso3 ? 'Volume fills a 3-D space. Is this about filling?' : 'Volume is for 3-D shapes you can fill. This shape is flat.']],
    done: {msg: CLUE[m]}});
  var X = {Perimeter: {lab: 'P =', u: 'feet', keep: iso3 ? {} : {outline: 'green'}, flash: iso3 ? null : {trace: true}, name: 'perimeter'},
    Area: {lab: 'A =', u: 'square feet', keep: iso3 ? {layerHl: 0} : {fill: true}, name: 'area'},
    Volume: {lab: 'V =', u: 'cubic feet', keep: {fill: true, solid: false}, name: 'volume'}}[m];
  var wr = keys.filter(function (k) { return k !== m; }).map(function (k) { return [M[k].ans, 'That is the ' + k.toLowerCase() + '. The story asks about ' + (m === 'Perimeter' ? 'going around' : m === 'Area' ? 'covering' : 'filling') + '.']; });
  var col = m === 'Perimeter' ? gr : m === 'Area' ? ar : vi;
  var calc = ask({label: it.lab || X.lab, ans: it.ans, unit: '', dec: !!it.dec, mission: 'Now find the ' + col(m.toLowerCase()) + '.', bar: col(it.bar.split(' = ')[0]) + ' = ' + it.bar.split(' = ').slice(1).join(' = '),
    hints: [{bar: it.bar, text: it.hint}], wrongs: wr,
    done: {msg: 'Correct! ' + it.bar + ' = ' + nf(it.ans) + '.', bar: col(it.bar.split(' = ')[0]) + ' = ' + it.bar.split(' = ').slice(1).join(' = ') + ' = ' + col(nf(it.ans)), keep: X.keep, flash: X.flash}});
  var UN = {Perimeter: 'feet', Area: 'square feet', Volume: 'cubic feet'};
  var unitAsk = ask({type: 'choice', label: 'Which unit goes with ' + nf(it.ans) + '?', ans: UN[m], options: ['feet', 'square feet', 'cubic feet'],
    mission: 'Last step: name the unit.', bar: col(nf(it.ans)) + ' … what?',
    hints: [{bar: 'around → feet · cover → square feet · fill → cubic feet', text: 'A distance around is a length (feet). Covering counts squares (square feet). Filling counts cubes (cubic feet).'}],
    wrongs: [['feet', 'Feet measure a length, like a distance around.'], ['square feet', 'Square feet count squares that cover a flat surface.'], ['cubic feet', 'Cubic feet count cubes that fill a space.']],
    done: {msg: 'Yes! ' + nf(it.ans) + ' ' + UN[m] + '.', bar: col(nf(it.ans) + ' ' + UN[m]) + CHECK, keep: X.keep}});
  return {geo: geo, mission: sent, known: 'Which measurement fits: ' + gr('perimeter') + ', ' + ar('area') + ' or ' + vi('volume') + '?', asks: [choice, calc, unitAsk]};
}

/* ---------- drawing ---------- */
function inside(pt,pts){var c=false;for(var i=0,j=pts.length-1;i<pts.length;j=i++){var xi=pts[i][0],yi=pts[i][1],xj=pts[j][0],yj=pts[j][1];
  if(((yi>pt[1])!==(yj>pt[1]))&&(pt[0]<(xj-xi)*(pt[1]-yi)/(yj-yi)+xi))c=!c;}return c;}
function textAt(x,y,nx,ny,L,extra){var anc=nx>0.45?'start':nx<-0.45?'end':'middle',bl=ny>0.45?'hanging':ny<-0.45?'alphabetic':'middle';
  return '<text class="lb '+L.c+(extra||'')+'" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" text-anchor="'+anc+'" dominant-baseline="'+bl+'">'+L.t+'</text>';}
function polySVG(g,v){
  var xs=g.pts.map(function(p){return p[0];}),ys=g.pts.map(function(p){return p[1];});
  var minx=Math.min.apply(0,xs),maxx=Math.max.apply(0,xs),miny=Math.min.apply(0,ys),maxy=Math.max.apply(0,ys);
  var w=maxx-minx,h=maxy-miny,s=Math.min(270/w,200/h,44),pX=70,pY=40;
  var walking=!!(v.trace&&g.sides),STEP=0.5;
  var VW=w*s+2*pX,VH=h*s+2*pY+(g.note?22:0)+(walking?30:0);
  var tx=function(x){return pX+(x-minx)*s;},ty=function(y){return pY+(y-miny)*s;};
  var ps=function(pts){return pts.map(function(p){return tx(p[0]).toFixed(1)+','+ty(p[1]).toFixed(1);}).join(' ');};
  var o=['<defs><clipPath id="'+CPID+'"><polygon points="'+ps(g.pts)+'"/></clipPath></defs>'],n=g.pts.length,i;
  if(v.split&&g.split)o.push('<g clip-path="url(#'+CPID+')"><polygon class="reg-a" points="'+ps(g.split.a)+'"/><polygon class="reg-b" points="'+ps(g.split.b)+'"/></g>');
  if(g.gridOK&&(v.grid||v.fill)){
    var cells=[];
    for(var y=Math.floor(miny);y<maxy;y++)for(var x=Math.floor(minx);x<maxx;x++)
      cells.push('<rect class="cell'+(v.fill?' on':'')+'" style="--d:'+((y-miny)*0.12).toFixed(2)+'s" x="'+tx(x).toFixed(1)+'" y="'+ty(y).toFixed(1)+'" width="'+s.toFixed(1)+'" height="'+s.toFixed(1)+'"/>');
    o.push('<g clip-path="url(#'+CPID+')">'+cells.join('')+'</g>');
  }
  if(v.split&&g.split){var L1=g.split.line;o.push('<line class="splitline" x1="'+tx(L1[0][0])+'" y1="'+ty(L1[0][1])+'" x2="'+tx(L1[1][0])+'" y2="'+ty(L1[1][1])+'"/>');}
  if(v.ghost&&g.ghost)o.push('<polygon class="ghost" points="'+ps(g.ghost)+'"/>');
  for(i=0;i<n;i++){var a=g.pts[i],b=g.pts[(i+1)%n],cls=(v.hl&&v.hl[i])||(v.outline==='green'?'green':'');
    if(v.dim&&v.dim.indexOf(i)>=0)cls+=' dim';if(v.pulse)cls+=' pulse';if(walking)cls+=' faint';
    o.push('<line class="edge '+cls+'" x1="'+tx(a[0]).toFixed(1)+'" y1="'+ty(a[1]).toFixed(1)+'" x2="'+tx(b[0]).toFixed(1)+'" y2="'+ty(b[1]).toFixed(1)+'"/>');}
  if(v.trace&&!walking)o.push('<polygon class="trace" pathLength="100" points="'+ps(g.pts)+'"/>');
  if(walking)for(i=0;i<n;i++){var wa=g.pts[i],wb=g.pts[(i+1)%n],len=Math.hypot(tx(wb[0])-tx(wa[0]),ty(wb[1])-ty(wa[1])).toFixed(1);
    o.push('<line class="walk" style="--len:'+len+';--d:'+(i*STEP).toFixed(2)+'s" x1="'+tx(wa[0]).toFixed(1)+'" y1="'+ty(wa[1]).toFixed(1)+'" x2="'+tx(wb[0]).toFixed(1)+'" y2="'+ty(wb[1]).toFixed(1)+'"/>');}
  var mark=function(P,u1,u2){var k=11,p=[tx(P[0]),ty(P[1])];return '<path class="ra" d="M'+(p[0]+u1[0]*k)+' '+(p[1]+u1[1]*k)+' L'+(p[0]+u1[0]*k+u2[0]*k)+' '+(p[1]+u1[1]*k+u2[1]*k)+' L'+(p[0]+u2[0]*k)+' '+(p[1]+u2[1]*k)+'"/>';};
  var unit=function(A,B){var dx=B[0]-A[0],dy=B[1]-A[1],l=Math.hypot(dx,dy);return [dx/l,dy/l];};
  if(g.rightAngle!=null){var k0=g.rightAngle,P0=g.pts[k0];o.push(mark(P0,unit(P0,g.pts[(k0+n-1)%n]),unit(P0,g.pts[(k0+1)%n])));}
  if(g.alt){var f=g.alt.from,t=g.alt.to;o.push('<line class="alt" x1="'+tx(f[0])+'" y1="'+ty(f[1])+'" x2="'+tx(t[0])+'" y2="'+ty(t[1])+'"/>');
    o.push(mark(t,unit(t,f),[1,0]));}
  var LBS=[];
  for(i=0;i<n;i++){var Lb=g.labels[i];if(!Lb)continue;var A2=g.pts[i],B2=g.pts[(i+1)%n],mx=(A2[0]+B2[0])/2,my=(A2[1]+B2[1])/2,d=unit(A2,B2),nx=d[1],ny=-d[0];
    var eps=0.04*Math.max(w,h);if(inside([mx+nx*eps,my+ny*eps],g.pts)){nx=-nx;ny=-ny;}
    LBS.push({i:i,L:Lb,bx:tx(mx),by:ty(my),nx:nx,ny:ny,off:14,len:Math.hypot(tx(B2[0])-tx(A2[0]),ty(B2[1])-ty(A2[1]))});}
  /* labels near an inner corner can collide: approximate each as a box and push the pair apart along their own normals */
  var box=function(q){var x=q.bx+q.nx*q.off,y=q.by+q.ny*q.off,W=String(q.L.t).length*10+8,H=22;
    var x0=q.nx>0.45?x:q.nx<-0.45?x-W:x-W/2,y0=q.ny>0.45?y:q.ny<-0.45?y-H:y-H/2;return [x0,y0,x0+W,y0+H];};
  for(var it=0;it<8;it++){var moved=false;
    for(var p1=0;p1<LBS.length;p1++)for(var p2=p1+1;p2<LBS.length;p2++){var b1=box(LBS[p1]),b2=box(LBS[p2]);
      if(b1[0]<b2[2]+3&&b2[0]<b1[2]+3&&b1[1]<b2[3]+3&&b2[1]<b1[3]+3){LBS[p1].off+=7;LBS[p2].off+=7;moved=true;}}
    if(!moved)break;}
  if(g.alt){/* height label: right of the dashed line, or left of it if a side label is in the way */
    var af=g.alt.from,at=g.alt.to,ax=tx(af[0]),aw=String(g.alt.L.t).length*10+8,hit=function(x0,ay){var b=[x0,ay-11,x0+aw,ay+11];
      return LBS.some(function(q){var c=box(q);return b[0]<c[2]+3&&c[0]<b[2]+3&&b[1]<c[3]+3&&c[1]<b[3]+3;});};
    var C=[[.72,1],[.72,-1],[.5,1],[.5,-1],[.25,1],[.25,-1]].map(function(c){return {ay:ty(af[1])+(ty(at[1])-ty(af[1]))*c[0],sd:c[1]};});
    var ch=C.filter(function(c){return !hit(c.sd>0?ax+8:ax-8-aw,c.ay);})[0]||C[0];
    o.push(textAt(ch.sd>0?ax+8:ax-8,ch.ay,ch.sd,0,g.alt.L));}
  LBS.forEach(function(q){o.push(textAt(q.bx+q.nx*q.off,q.by+q.ny*q.off,q.nx,q.ny,q.L,walking?' walkl" style="--d:'+(q.i*STEP+0.4).toFixed(2)+'s':''));});
  if(walking){var tot=0,ts=g.sides.map(function(sv,k){tot+=sv;return '<tspan class="run" style="--d:'+(k*STEP+0.4).toFixed(2)+'s">'+(k?' + ':'')+sv+'</tspan>';}).join('');
    ts+='<tspan class="run" style="--d:'+(n*STEP+0.2).toFixed(2)+'s"> = '+r2(tot)+'</tspan>';
    o.push('<text class="runline" x="'+(VW/2)+'" y="'+(VH-(g.note?30:10))+'" text-anchor="middle">'+ts+'</text>');}
  if(g.note)o.push('<text class="note" x="'+(VW/2)+'" y="'+(VH-8)+'" text-anchor="middle">'+g.note+'</text>');
  return '<svg viewBox="0 0 '+VW.toFixed(0)+' '+VH.toFixed(0)+'" role="img" aria-label="'+g.aria+'">'+o.join('')+'</svg>';
}
function circleSVG(g,v){
  var r=g.r,s=Math.max(Math.min(95/r,40),62/r),R=r*s,p=60,VW=2*R+2*p,VH=2*R+2*p,cx=VW/2,cy0=VH/2,o=[];
  o.push('<defs><clipPath id="'+CPID+'"><circle cx="'+cx+'" cy="'+cy0+'" r="'+R+'"/></clipPath></defs>');
  if(v.grid&&!v.fill){var cells=[];for(var y=-r;y<r;y++)for(var x=-r;x<r;x++)
    cells.push('<rect class="cell" x="'+(cx+x*s).toFixed(1)+'" y="'+(cy0+y*s).toFixed(1)+'" width="'+s.toFixed(1)+'" height="'+s.toFixed(1)+'"/>');
    o.push('<g clip-path="url(#'+CPID+')">'+cells.join('')+'</g>');}
  /* area = the space the radius sweeps out: a pie that grows as the radius turns once */
  if(v.fill)o.push('<circle class="sweep" cx="'+cx+'" cy="'+cy0+'" r="'+(R/2).toFixed(1)+'" pathLength="100" style="stroke-width:'+R.toFixed(1)+'px" transform="rotate(-90 '+cx+' '+cy0+')"/>');
  o.push('<circle class="edge ring '+(v.outline==='green'?'green':'')+(v.pulse?' pulse':'')+'" cx="'+cx+'" cy="'+cy0+'" r="'+R+'"/>');
  if(v.trace){o.push('<circle class="trace" pathLength="100" cx="'+cx+'" cy="'+cy0+'" r="'+R+'" transform="rotate(-90 '+cx+' '+cy0+')"/>');
    /* a pen-dot leads the trace once around, clockwise from the top */
    o.push('<circle class="pen" r="7" cx="0" cy="0"><animateMotion dur="1.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1" path="M'+cx+' '+(cy0-R)+' A'+R+' '+R+' 0 1 1 '+cx+' '+(cy0+R)+' A'+R+' '+R+' 0 1 1 '+cx+' '+(cy0-R)+'"/></circle>');}
  if(v.diam){o.push('<line class="alt" x1="'+(cx-R)+'" y1="'+cy0+'" x2="'+(cx+R)+'" y2="'+cy0+'"/>');
    o.push(textAt(cx,cy0+12,0,1,lbl('d = 2 × r','orange')));}
  o.push('<line class="rad" x1="'+cx+'" y1="'+cy0+'" x2="'+(cx+R)+'" y2="'+cy0+'"/><circle class="dot" cx="'+cx+'" cy="'+cy0+'" r="3.5"/>');
  if(v.fill)o.push('<line class="rad sweeparm" style="transform-origin:'+cx+'px '+cy0+'px" x1="'+cx+'" y1="'+cy0+'" x2="'+(cx+R)+'" y2="'+cy0+'"/>');
  o.push(textAt(cx+R/2,cy0-10,0,-1,g.lab));
  return '<svg viewBox="0 0 '+VW.toFixed(0)+' '+VH.toFixed(0)+'" role="img" aria-label="Circle">'+o.join('')+'</svg>';
}
function isoSVG(g,v){
  var l=g.l,w=g.w,h=g.h,c=0.866,u=Math.min(230/((l+w)*c),170/((l+w)*0.5+h),38);
  var minX=-w*c*u,maxX=l*c*u,minY=-h*u,maxY=(l+w)*0.5*u,pX=78,pY=36,VW=maxX-minX+2*pX,VH=maxY-minY+2*pY;
  var P3=function(x,y,z){return [pX-minX+(x-y)*c*u,pY-minY+(x+y)*0.5*u-z*u];};
  var ps=function(a){return a.map(function(p){var q=P3(p[0],p[1],p[2]);return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' ');};
  var o=[];
  if(v.solid&&!v.fill){
    o.push('<g class="solid"><polygon class="ft" points="'+ps([[0,0,h],[l,0,h],[l,w,h],[0,w,h]])+'"/><polygon class="fl" points="'+ps([[0,w,0],[l,w,0],[l,w,h],[0,w,h]])+'"/><polygon class="fr" points="'+ps([[l,0,0],[l,w,0],[l,w,h],[l,0,h]])+'"/></g>');
  }else{
    var cubes=[];for(var k=0;k<h;k++)for(var i=0;i<l;i++)for(var j=0;j<w;j++)cubes.push([i,j,k]);
    cubes.sort(function(A,B){return (A[0]+A[1]+A[2])-(B[0]+B[1]+B[2]);});
    cubes.forEach(function(q){var i=q[0],j=q[1],k=q[2],cls='cube'+(v.fill?' on':'')+(v.layerHl===k&&!v.fill?' hl':'');
      o.push('<g class="'+cls+'" style="--d:'+(k*0.3).toFixed(1)+'s">'+
        '<polygon class="ft" points="'+ps([[i,j,k+1],[i+1,j,k+1],[i+1,j+1,k+1],[i,j+1,k+1]])+'"/>'+
        '<polygon class="fl" points="'+ps([[i,j+1,k],[i+1,j+1,k],[i+1,j+1,k+1],[i,j+1,k+1]])+'"/>'+
        '<polygon class="fr" points="'+ps([[i+1,j,k],[i+1,j+1,k],[i+1,j+1,k+1],[i+1,j,k+1]])+'"/></g>');});
  }
  var L=g.labels,m;
  if(L.l){m=P3(l/2,w,0);o.push(textAt(m[0]-10,m[1]+12,-0.6,0.6,L.l));}
  if(L.w){m=P3(l,w/2,0);o.push(textAt(m[0]+10,m[1]+12,0.6,0.6,L.w));}
  if(L.h){m=P3(l,0,h/2);o.push(textAt(m[0]+12,m[1],1,0,L.h));}
  return '<svg viewBox="0 0 '+VW.toFixed(0)+' '+VH.toFixed(0)+'" role="img" aria-label="'+g.aria+'">'+o.join('')+'</svg>';
}
function draw(g,v){CPID='glcp'+(++CPN);var h=g.type==='iso'?isoSVG(g,v):g.type==='circle'?circleSVG(g,v):polySVG(g,v);
  /* never blow a small drawing up past 1.7x, so labels stay label-sized on big screens */
  var m=/viewBox="0 0 (\d+) (\d+)"/.exec(h);return m?h.replace('<svg ','<svg style="max-width:'+Math.round(m[1]*1.7)+'px" '):h;}
/* ---------- flow ---------- */
var root = null, API = {}, P = null, token = 0;
var $ = function (id) { return root ? root.querySelector('#gl-' + id) : null; };
var BASE = {outline: 'cyan', grid: false, fill: false, hl: null, dim: null, pulse: false, ghost: false, split: false, trace: false, layerHl: null, solid: false, diam: false};
function merge() { var o = {}; for (var i = 0; i < arguments.length; i++) { var a = arguments[i]; if (a) for (var k in a) o[k] = a[k]; } return o; }
function newProblem() {
  token++;
  var shape = S.shape, av = available();
  if (!av.some(function (s) { return s.id === shape; }) && shape !== 'mix') shape = S.shape = 'rect';
  if (shape === 'mix') shape = pick(av).id;
  var p = S.mode === 'pick' ? gPick(shape) : GEN[shape](S.mode);
  p.shape = shape; p.i = 0; p.hintN = 0; p.usedHint = false; p.steps = []; p.fb = null; p.locked = false; p.fin = false;
  p.base = merge(BASE, p.base); p.vis = merge(p.base); p.bar = p.known || p.asks[0].bar || '';
  P = p; renderAll(); renderWhy();
}
function isRight(a, raw) {
  if (a.type === 'choice') return raw === a.ans;
  return Math.abs(Number(raw) - a.ans) < (a.dec ? 0.011 : 1e-9);
}
function submit(raw) {
  if (!P || P.locked || P.fin) return;
  var a = P.asks[P.i];
  if (a.type !== 'choice') { raw = String(raw == null ? '' : raw).replace(/,/g, '').trim(); if (raw === '' || isNaN(Number(raw))) { P.fb = {html: 'Type a number first.', cls: 'no'}; renderStage(); return; } }
  if (!isRight(a, raw)) {
    var g = a.type === 'choice' ? raw : Number(raw), hit = null;
    for (var i = 0; i < a.wrongs.length; i++) { var wv = a.wrongs[i][0];
      var same = a.type === 'choice' ? wv === g : Math.abs(wv - g) < 0.011 && Math.abs(wv - a.ans) > 0.011;
      if (same) { hit = a.wrongs[i][1]; break; } }
    P.fb = {html: hit || a.fallback, cls: 'no'}; renderStage(); return;
  }
  var d = a.done || {};
  if (d.reveal) d.reveal(P.geo);
  P.base = merge(P.base, d.keep); P.vis = merge(P.base, d.flash);
  if (d.bar) P.bar = d.bar;
  P.steps = [];
  if (P.i === P.asks.length - 1) {
    P.fin = true; S.solved++; if (!P.usedHint) S.clean++; persist();
    var xp = P.usedHint ? 5 : 8; if (API.addXP) API.addXP(xp);
    P.fb = {html: (d.msg ? d.msg + '<br>' : '') + '🎉 Mission complete! +' + xp + ' XP' + (P.usedHint ? '' : ' (no hints)'), cls: 'ok'}; renderAll(); return;
  }
  P.locked = true; P.lastVal = raw; P.fb = {html: d.msg || 'Correct!', cls: 'ok'}; renderStage(); renderAnswer();
  var wait = (d.flash && d.flash.trace && P.geo.sides) ? P.geo.sides.length * 500 + 1300 : 1500;
  if (matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) wait = 900;
  var tk = token; setTimeout(function () { if (tk === token && P.locked && root && root.isConnected) advance(); }, wait);
}
function advance() {
  P.i++; P.hintN = 0; P.locked = false; P.vis = merge(P.base);
  var a = P.asks[P.i]; if (a.bar) P.bar = a.bar; if (a.mission) P.mission = a.mission; P.fb = null;
  renderStage(); renderAnswer(); focusInput(); if (S.mode === 'pick' && P.i === 1) renderWhy();
}
function hint() {
  if (!P || P.locked || P.fin) return;
  var a = P.asks[P.i]; if (P.hintN >= a.hints.length) return;
  var h = a.hints[P.hintN++]; P.usedHint = true;
  P.vis = merge(P.base, h.vis); if (h.bar) P.bar = h.bar;
  P.steps.push('<b>Hint ' + P.hintN + ' of ' + a.hints.length + ':</b> ' + h.text);
  renderStage();
}
function focusInput() {
  var i = $('ans'); if (!i || i.disabled) return;
  if (matchMedia && matchMedia('(pointer: coarse)').matches) return; /* no surprise keyboard on phones */
  try { i.focus({preventScroll: true}); } catch (e) {}
}

/* ---------- formula card (Learn) and letter key (all modes) ----------
   One row per formula; the row for the current step is full strength, finished rows get a check. */
var FT = {P: ['PERIMETER', 'per'], A: ['AREA', 'area'], V: ['VOLUME', 'vol'], C: ['CIRCUMFERENCE', 'per'], B: ['BASE AREA', 'area'], d: ['DIAMETER', 'giv']};
var FROWS = {
  rect: [['P', 'P = 2 × (L + W)', 'add all 4 sides'], ['A', 'A = L × W', 'rows × squares in a row']],
  square: [['P', 'P = 4 × s', '4 equal sides'], ['A', 'A = s × s', 'also written s²']],
  rtri: [['P', 'P = add all 3 sides'], ['A', 'A = ½ × b × h', 'b and h meet at the square corner']],
  tri: [['P', 'P = add all 3 sides'], ['A', 'A = ½ × b × h', 'h goes straight up']],
  poly: [['P', 'P = add all the sides', 'equal sides: P = n × s']],
  lshape: [['P', 'P = add all 6 sides', 'shortcut: 2 × (big L + big W)'], ['A', 'A = rectangle 1 + rectangle 2', 'or whole rectangle − missing corner']],
  box: [['B', 'B = l × w', 'cubes in the bottom layer'], ['V', 'V = l × w × h = B × h', 'layers × cubes in a layer']],
  cube: [['V', 'V = s × s × s', 'also written s³']],
  circle: [['d', 'd = 2 × r'], ['C', 'C = π × d', 'π ≈ 3.14'], ['A', 'A = π × r × r', 'π ≈ 3.14']],
  para: [['P', 'P = 2 × (b + slanted side)'], ['A', 'A = b × h', 'h goes straight up']]
};
var LETTER = {P: 'perimeter (distance around)', A: 'area (space inside)', V: 'volume (space filled)', C: 'circumference (around a circle)', B: 'base area (bottom layer)',
  L: 'length', W: 'width', l: 'length', w: 'width', h: 'height (straight up)', b: 'base', s: 'side', r: 'radius (center to edge)', d: 'diameter (across the middle)', n: 'number of sides', 'π': 'pi ≈ 3.14'};
var KEYS = {rect: ['P', 'A', 'L', 'W'], square: ['P', 'A', 's'], rtri: ['P', 'A', 'b', 'h'], tri: ['P', 'A', 'b', 'h'], poly: ['P', 's', 'n'], lshape: ['P', 'A'],
  box: ['B', 'V', 'l', 'w', 'h'], cube: ['V', 's'], circle: ['C', 'A', 'r', 'd', 'π'], para: ['P', 'A', 'b', 'h']};
var LCOL = {P: 'gr', C: 'gr', A: 'ar', B: 'ar', V: 'vi'};
function unitsLine(shape) {
  return shape === 'box' || shape === 'cube' ? 'units: base area in <b>square units</b> · volume in <b>cubic units</b>'
    : 'units: ' + (shape === 'circle' ? 'circumference' : 'perimeter') + ' in <b>units</b> · area in <b>square units</b>';
}
function keyHtml(shape) {
  var k = KEYS[shape] || [];
  var chips = k.map(function (x) { return '<span class="gl-kc"><b class="' + (LCOL[x] || 'cy') + '">' + x + '</b> ' + LETTER[x] + '</span>'; }).join('');
  var wide = KEYOPEN != null ? KEYOPEN : (!window.matchMedia || matchMedia('(min-width: 700px)').matches);
  return '<details class="gl-keyd"' + (wide ? ' open' : '') + '><summary>What do the letters mean?</summary><div class="gl-keys">' + chips + '</div><div class="gl-units">' + unitsLine(shape) + '</div></details>';
}
var KEYOPEN = null;
function stepLetter(a) { var m = /^([PAVCB])\s*=/.exec(a.label || ''); return m ? m[1] : null; }
function renderFormula() {
  var box = $('formula'), rows = FROWS[P.shape];
  if (!rows || S.mode === 'pick' && P.shape === 'pick') { box.hidden = true; return; }
  box.hidden = false;
  if (S.mode !== 'learn') { box.className = 'gl-fcard keyonly'; box.innerHTML = keyHtml(P.shape); return; }
  var cur = P.fin ? null : stepLetter(P.asks[P.i]), done = {};
  for (var i = 0; i < P.asks.length; i++) { var L = stepLetter(P.asks[i]); if (L && (i < P.i || P.fin || (i === P.i && P.locked))) done[L] = 1; }
  var html = rows.map(function (r) {
    var st = done[r[0]] ? 'done' : r[0] === cur ? 'cur' : (r[0] === 'd' ? 'aid' : 'dim');
    return '<div class="gl-frow k-' + FT[r[0]][1] + ' ' + st + '"><span class="gl-ftag">' + FT[r[0]][0] + '</span><span class="gl-ff">' + r[1] + '</span>' +
      (r[2] ? '<span class="gl-fnote">' + r[2] + '</span>' : '') + '<span class="gl-fok" aria-hidden="true">' + (done[r[0]] ? '✓' : '') + '</span></div>';
  }).join('');
  box.className = 'gl-fcard';
  box.innerHTML = '<div class="gl-frows">' + html + '</div>' + keyHtml(P.shape);
}

/* ---------- render ---------- */
var MODES = [['learn', '📖 Learn'], ['mission', '🎯 Missions'], ['pick', '🧩 Pick it']];
var MODE_TIP = {
  learn: 'The formulas are shown. Solve each step and watch the shape light up.',
  mission: 'Something is missing. Use what you know to find the unknown, then keep going.',
  pick: 'A story about this shape. Is it about going around, covering, or filling? Pick, then solve it. Mix picks a shape for you.'
};
function renderChrome() {
  Array.prototype.forEach.call($('modes').children, function (b) {
    var on = b.getAttribute('data-mode') === S.mode; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
  $('tip').textContent = MODE_TIP[S.mode];
  var ch = $('shapes');
  ch.innerHTML = SHAPES.filter(function (s) { return !s.aap || S.aap; }).map(function (s) {
    return '<button type="button" class="chip' + (S.shape === s.id ? ' on' : '') + '" data-shape="' + s.id + '" aria-pressed="' + (S.shape === s.id) + '">' + s.name + '</button>'; }).join('');
  $('solved').textContent = S.solved; $('clean').textContent = S.clean;
}
function renderStage() {
  if (!P || !root) return;
  var a = P.asks[P.i];
  $('mission').innerHTML = P.mission;
  renderFormula();
  $('stepnum').textContent = P.asks.length > 1 ? 'Step ' + (P.i + 1) + ' of ' + P.asks.length : '';
  $('stepnum').hidden = P.asks.length < 2;
  $('eq').innerHTML = /^<span>/.test(P.bar) ? P.bar : '<span>' + P.bar + '</span>';
  $('board').innerHTML = draw(P.geo, P.vis);
  var fb = $('fb'); fb.className = 'fb' + (P.fb && P.fb.cls ? ' ' + P.fb.cls : ''); fb.innerHTML = P.fb ? P.fb.html : '';
  $('steps').innerHTML = P.steps.map(function (s) { return '<div class="gl-step">' + s + '</div>'; }).join('');
  var hb = $('hint'); if (hb) { var left = a.hints.length - P.hintN; hb.disabled = left <= 0 || P.locked || P.fin; hb.textContent = left > 0 ? '💡 Hint (' + left + ' left)' : 'No more hints'; }
  var vb = $('verify'); if (vb) vb.disabled = P.locked || P.fin;
  var inp = $('ans'); if (inp) inp.disabled = P.locked || P.fin;
  Array.prototype.forEach.call(root.querySelectorAll('.gl-pick'), function (b) { b.disabled = P.locked || P.fin; });
}
function renderAnswer() {
  var a = P.asks[P.i], box = $('answer');
  box.hidden = P.fin; $('next').hidden = !P.fin;
  if (P.fin) { box.innerHTML = ''; renderStage(); return; }
  var hintBtn = '<button type="button" class="btn ghost gl-help" id="gl-hint">💡 Hint</button>';
  if (a.type === 'choice') {
    box.innerHTML = '<div class="gl-asklab">' + a.label + '</div><div class="opts-row">' +
      a.options.map(function (o) { return '<button type="button" class="btn ghost gl-pick gl-k-' + o.toLowerCase() + '" data-v="' + o + '">' + o + '</button>'; }).join('') +
      '</div><div class="row-btns">' + hintBtn + '</div>';
  } else {
    box.innerHTML = '<div class="num-in"><label for="gl-ans" class="gl-asklab">' + a.label + '</label>' +
      '<input type="text" inputmode="decimal" id="gl-ans" placeholder="?" autocomplete="off" enterkeyhint="done"><span class="gl-unit">' + a.unit + '</span></div>' +
      '<div class="row-btns"><button type="button" class="btn teal" id="gl-verify">Check</button>' + hintBtn + '</div>';
    if (P.locked && P.lastVal != null) { $('ans').value = P.lastVal; $('ans').classList.add('gl-right'); }
  }
  renderStage();
}
function renderAll() { renderChrome(); renderAnswer(); }
/* "Why does it work?" — the matching explainer, built from this shape's numbers */
var WHY_TXT = {rect: 'Why P = 2 × (l + w) and A = l × w', square: 'Why P = 4 × s and A = s × s', rtri: 'Why a triangle is ½ × b × h', tri: 'Why any triangle is ½ × b × h',
  poly: 'Why perimeter = add the sides', lshape: 'Split or subtract: L-shape area', para: 'Why a parallelogram is b × h', circle: 'Why C = π × d', box: 'Why V = l × w × h', cube: 'Why V = s × s × s'};
function renderWhy() {
  var box = $('why'); if (!box) return; box.innerHTML = '';
  var o = window.EX && whyFor(P.shape, P.geo);
  if (!o || (S.mode === 'pick' && P.i === 0)) { box.hidden = true; return; }   /* in Pick it, the formula would give the answer away */
  box.hidden = false;
  box.innerHTML = '<div class="gl-whyh"><span>🎬 Why does it work?</span><small>' + WHY_TXT[P.shape] + ', with these numbers</small></div>';
  box.appendChild(window.EX.watchButton(o, {text: '▶ Watch it'}));
}

function legend() {
  return '<span class="gl-key cy">given</span><span class="gl-key gr">perimeter</span><span class="gl-key ar">area</span><span class="gl-key vi">volume</span><span class="gl-key un">unknown</span>';
}

/* ---------- mount ---------- */
function mount(host, api) {
  API = api || {}; token++;
  var pre = window.__glPreset; window.__glPreset = null;
  if (pre) { if (pre.mode) S.mode = pre.mode; if (pre.shape) S.shape = pre.shape; }
  root = document.createElement('div'); root.className = 'gl';
  root.innerHTML =
    '<div class="gl-head"><h2>📐 Geometry Lab</h2>' +
    '<div class="gl-legend" aria-label="Color code">' + legend() + '</div></div>' +
    '<div class="gl-top"><div class="seg" id="gl-modes" role="tablist" aria-label="Mode">' +
      MODES.map(function (m) { return '<button type="button" role="tab" data-mode="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      '<span class="stat">🏁 Missions <b id="gl-solved">0</b></span><span class="stat">✨ No hints <b id="gl-clean">0</b></span></div>' +
    '<p class="lede gl-tip" id="gl-tip"></p>' +
    '<div class="gl-chips" id="gl-shapes" aria-label="Shape"></div>' +
    '<div class="gl-wrap">' +
      '<div class="gl-left"><div class="gl-board" id="gl-board"></div><div class="gl-why" id="gl-why" hidden></div></div>' +
      '<div class="gl-side">' +
        '<div class="gl-mission" id="gl-mission" aria-live="polite"></div>' +
        '<div class="gl-fcard" id="gl-formula" hidden></div>' +
        '<div class="gl-stepnum" id="gl-stepnum"></div>' +
        '<div class="gl-eq" id="gl-eq" aria-live="polite"></div>' +
        '<div class="gl-answer" id="gl-answer"></div>' +
        '<div class="fb" id="gl-fb" aria-live="polite"></div>' +
        '<div class="gl-steps" id="gl-steps"></div>' +
        '<button type="button" class="btn teal gl-next" id="gl-next" hidden>Next mission →</button>' +
      '</div>' +
    '</div>' +
    '<p class="gl-foot">Every shape in one place: the Grade 5 SOL shapes (5.MG.2, 5.MG.3: rectangles, squares, right triangles, boxes) plus polygons, L-shapes, any triangle, parallelograms and circles (π ≈ 3.14).</p>';
  host.appendChild(root);

  $('modes').addEventListener('click', function (e) { var b = e.target.closest('[data-mode]'); if (!b) return; S.mode = b.getAttribute('data-mode'); persist(); newProblem(); });
  $('shapes').addEventListener('click', function (e) { var b = e.target.closest('[data-shape]'); if (!b) return; S.shape = b.getAttribute('data-shape'); persist(); newProblem(); });
  $('answer').addEventListener('click', function (e) { var t = e.target.closest('button'); if (!t || t.disabled) return;
    if (t.id === 'gl-verify') submit($('ans').value); else if (t.id === 'gl-hint') hint(); else if (t.getAttribute('data-v')) submit(t.getAttribute('data-v')); });
  $('answer').addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.id === 'gl-ans') { e.preventDefault(); submit(e.target.value); } });
  $('next').addEventListener('click', function () { newProblem(); focusInput(); });
  $('formula').addEventListener('toggle', function (e) { if (e.target.classList && e.target.classList.contains('gl-keyd')) KEYOPEN = e.target.open; }, true);
  newProblem();
}

return {mount: mount, GEN: GEN, get P() { return P; }, S: S, submit: submit, hint: hint, newProblem: newProblem,
  advance: function () { if (P && P.locked) advance(); },
  set: function (mode, shape) { S.mode = mode; if (shape) S.shape = shape; newProblem(); }};
})();
