
/* gens5.js — Grade 5 math question library (VA 2023 Math SOL, FCPS Grade 5).
   Built for FCPS Grade 5: regular Grade 5 Math class, every skill has a standard layer (H=0) and an Advanced layer (H=1).
   One library feeds: daily printables (unit4.js ...), the SOL Practice app, paper SOL checkpoints.
   Item shape: {id, std, cat, unit, nocalc, mode:'mc'|'ms'|'num', q, ch?, ci?, cs?, a, acc?, why?}
     mc  = 4 choices, ci = index of the correct one
     ms  = select all that apply, cs = indices of correct choices
     num = type-in / write-in, acc = accepted answers (strings)
   Usage: G5.seed('2026-10-26'); G5.make('ns1_equiv','adv'); G5.solTest({adv:0.3});
   Released-item styles come from claude/sol-g5-math-notes.md (own look-alikes, never copies). */
var G5=(function(){
'use strict';
const G={};
let RNG=Math.random;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h;}
G.seed=s=>{RNG=mulberry(typeof s==='number'?s:hashStr(String(s)));};
G.setRng=f=>{RNG=f;};
const r=()=>RNG();
const ri=(a,b)=>a+Math.floor(r()*(b-a+1));
const pick=a=>a[Math.floor(r()*a.length)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const sample=(a,k)=>shuf(a).slice(0,k);
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
const lcm=(a,b)=>a/gcd(a,b)*b;
const isPrime=n=>{if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;};
const rnd=x=>Math.round(x*1e6)/1e6;
const fx=x=>String(rnd(x));                         // 0.1+0.2 -> "0.3"
const cm=x=>{const s=fx(x);const neg=s[0]==='-';const [i,d]=s.replace('-','').split('.');return (neg?'-':'')+i.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(d?'.'+d:'');};
const money=x=>'$'+rnd(x).toFixed(2);
const F=(n,d)=>`<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`;
const NAMES=['Maya','Leo','Sofia','Omar','Ava','Ethan','Zoe','Noah','Priya','Lucas','Nadia','Ben','Iris','Kai','Rosa','Jamal'];
const nm=()=>pick(NAMES);
/* fractions as {n,d} (improper allowed) */
const fr=(n,d)=>{const g=gcd(n,d)||1;return {n:n/g,d:d/g};};
const fv=f=>f.n/f.d;
const fadd=(a,b)=>fr(a.n*b.d+b.n*a.d,a.d*b.d);
const fsub=(a,b)=>fr(a.n*b.d-b.n*a.d,a.d*b.d);
/* html for a fraction value in simplest form; mixed numbers by default */
function fh(f,mixed=true){f=fr(f.n,f.d);if(f.d===1)return String(f.n);if(mixed&&f.n>f.d){const w=Math.floor(f.n/f.d),n=f.n%f.d;return n?`${w}${F(n,f.d)}`:String(w);}return F(f.n,f.d);}
/* raw (not simplified) fraction html */
const fhr=(n,d)=>F(n,d);
const mixH=(w,n,d)=>w?`${w}${F(n,d)}`:F(n,d);
const ch=(h,v)=>({h,v});        // choice with numeric value (for de-dup by value)
/* ---- builders ---- */
function mc(q,ans,ds,o={}){
  const N=o.n||4;const A=typeof ans==='object'?ans:{h:String(ans)};
  const bad=h=>!h||/undefined|NaN|Infinity|null/.test(h);
  if(bad(A.h))return null;
  const seen=new Set([A.h]);const out=[];
  for(const d0 of ds){const d=typeof d0==='object'?d0:{h:String(d0)};
    if(bad(d.h)||seen.has(d.h))continue;
    if(A.v!==undefined&&d.v!==undefined&&Math.abs(A.v-d.v)<1e-9)continue;
    if(d.v!==undefined&&out.some(x=>x.v!==undefined&&Math.abs(x.v-d.v)<1e-9))continue;
    if(o.nonneg&&d.v!==undefined&&d.v<0)continue;
    seen.add(d.h);out.push(d);if(out.length===N-1)break;}
  if(out.length<N-1)return null;
  let c=[A,...out];
  if(o.sort==='v')c.sort((x,y)=>x.v-y.v);else if(o.sort==='keep');else c=shuf(c);
  return {mode:'mc',q,ch:c.map(x=>x.h),ci:c.indexOf(A),a:A.h,why:o.why,vis:o.vis,wide:o.wide};
}
function ms(q,right,wrong,o={}){
  const R=right.map(x=>typeof x==='object'?x:{h:String(x)}),W=wrong.map(x=>typeof x==='object'?x:{h:String(x)});
  const all=[...R.map(x=>({...x,ok:1})),...W.map(x=>({...x,ok:0}))];
  const hs=all.map(x=>x.h);if(new Set(hs).size!==hs.length)return null;
  let c=o.sort==='v'?all.slice().sort((x,y)=>x.v-y.v):o.keep?all:shuf(all);
  return {mode:'ms',q,ch:c.map(x=>x.h),cs:c.map((x,i)=>x.ok?i:-1).filter(i=>i>=0),a:c.filter(x=>x.ok).map(x=>x.h).join(', '),why:o.why,vis:o.vis};
}
function num(q,ans,o={}){
  const a=typeof ans==='number'?cm(ans):String(ans);
  const acc=o.acc||[typeof ans==='number'?fx(ans):String(ans)];
  return {mode:'num',q,a:(o.pre||'')+a+(o.post||''),acc:acc.map(String),unit:o.unit,al:o.al,why:o.why,vis:o.vis};
}
/* ---- skill registry ---- */
const SK={};
function S(id,meta,gen){SK[id]=Object.assign({id},meta,{gen});}
G.skills=()=>Object.values(SK).map(s=>({id:s.id,std:s.std,cat:s.cat,unit:s.unit,name:s.name,nocalc:!!s.nocalc,enrich:!!s.enrich,modes:s.modes||null}));
G.make=(id,L)=>{const s=SK[id];if(!s)throw new Error('no skill '+id);const H=(L==='adv'||L===1||L===true)?1:0;
  for(let t=0;t<60;t++){let it=null;try{it=s.gen(H);}catch(e){it=null;if(t===59)throw e;}
    if(it){it.id=id;it.std=s.std;it.cat=s.cat;it.unit=s.unit;it.nocalc=!!(s.nocalc||it.nocalc);it.H=H;it.name=s.name;return it;}}
  throw new Error('skill failed: '+id);};
G.byUnit=u=>Object.values(SK).filter(s=>(Array.isArray(s.unit)?s.unit:[s.unit]).includes(u)).map(s=>s.id);
G.byStd=std=>Object.values(SK).filter(s=>s.std===std&&!s.enrich).map(s=>s.id);
G.util={ri,pick,shuf,sample,gcd,lcm,isPrime,fx,cm,money,F,fr,fv,fh,nm,NAMES};
/* ---- visuals: SVG/HTML strings, print-friendly on white ---- */
const INK='#1b2a41',LINE='#24497a',SH='#7fb0dc',SH2='#f2c94c',DARK='#24497a';
const svgw=(w,h,body,px)=>`<svg class="g5v" viewBox="0 0 ${w} ${h}" style="width:${px||w}px;max-width:100%;height:auto;background:#fff" xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">${body}</svg>`;
const V={};
/* 10x10 grid; shades `k` hundredths column by column */
V.grid=(k,px=120)=>{let b='';const c=10;for(let i=0;i<100;i++){const col=Math.floor(i/10),row=i%10;b+=`<rect x="${2+col*c}" y="${2+row*c}" width="${c}" height="${c}" fill="${i<k?SH:'#fff'}" stroke="${LINE}" stroke-width=".6"/>`;}
  b+=`<rect x="2" y="2" width="100" height="100" fill="none" stroke="${LINE}" stroke-width="1.6"/>`;return svgw(104,104,b,px);};
/* multiplication model: top a rows shaded blue, left b columns yellow, overlap dark */
V.gridMul=(a,b,px=130)=>{let s='';const c=10;for(let col=0;col<10;col++)for(let row=0;row<10;row++){const R=row<a,C=col<b;const f=R&&C?DARK:R?SH:C?SH2:'#fff';s+=`<rect x="${2+col*c}" y="${2+row*c}" width="${c}" height="${c}" fill="${f}" stroke="${LINE}" stroke-width=".6"/>`;}
  s+=`<rect x="2" y="2" width="100" height="100" fill="none" stroke="${LINE}" stroke-width="1.6"/>`;return svgw(104,104,s,px);};
V.bar=(parts,k,px=200)=>{const W=200,H=30,w=W/parts;let b='';for(let i=0;i<parts;i++)b+=`<rect x="${2+i*w}" y="2" width="${w}" height="${H}" fill="${i<k?SH:'#fff'}" stroke="${LINE}" stroke-width="1.4"/>`;return svgw(W+4,H+4,b,px);};
V.pie=(parts,k,px=90)=>{const R=44,cx=47,cy=47;let b='';if(parts===1)return svgw(94,94,`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${k?SH:'#fff'}" stroke="${LINE}" stroke-width="1.6"/>`,px);
  for(let i=0;i<parts;i++){const a0=-Math.PI/2+i*2*Math.PI/parts,a1=a0+2*Math.PI/parts;const x0=cx+R*Math.cos(a0),y0=cy+R*Math.sin(a0),x1=cx+R*Math.cos(a1),y1=cy+R*Math.sin(a1);
    b+=`<path d="M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" fill="${i<k?SH:'#fff'}" stroke="${LINE}" stroke-width="1.4"/>`;}
  return svgw(94,94,b,px);};
V.counters=(rows,cols,px)=>{const d=16;const W=cols*d+4,H=rows*d+4;let b='';for(let i=0;i<rows;i++)for(let j=0;j<cols;j++)b+=`<circle cx="${2+d/2+j*d}" cy="${2+d/2+i*d}" r="6.2" fill="${SH}" stroke="${LINE}" stroke-width="1.2"/>`;return svgw(W,H,b,px||Math.min(W,200));};
/* rectangular prism, oblique drawing with labels */
V.prism=(l,w,h,u='in',px=200)=>{const m=Math.max(l,w*0.6,h);const s=95/m;const L=Math.max(l*s,30),Hh=Math.max(h*s,24),D=Math.max(w*s*0.5,14);
  const x0=12,y0=12+D;const pts=(a)=>a.map(p=>p.join(',')).join(' ');
  const A=[x0,y0+Hh],B=[x0+L,y0+Hh],C=[x0+L,y0],Dd=[x0,y0],E=[x0+D,y0-D],Fp=[x0+L+D,y0-D],Gp=[x0+L+D,y0+Hh-D];
  let b=`<polygon points="${pts([A,B,C,Dd])}" fill="#e3eef8" stroke="${LINE}" stroke-width="1.6"/><polygon points="${pts([Dd,C,Fp,E])}" fill="#cfe0f1" stroke="${LINE}" stroke-width="1.6"/><polygon points="${pts([C,B,Gp,Fp])}" fill="#b9d2ea" stroke="${LINE}" stroke-width="1.6"/>`;
  b+=`<text x="${x0+L/2}" y="${y0+Hh+16}" font-size="13" text-anchor="middle" fill="${INK}">${l} ${u}</text>`;
  b+=`<text x="${x0+L+D/2+6}" y="${y0+Hh-D/2+12}" font-size="13" fill="${INK}">${w} ${u}</text>`;
  b+=`<text x="${x0-4}" y="${y0+Hh/2+4}" font-size="13" text-anchor="end" fill="${INK}">${h} ${u}</text>`;
  const W=x0+L+D+52,H=y0+Hh+22;return svgw(W+20,H,`<g transform="translate(30,0)">${b}</g>`,px);};
V.rtri=(b0,h0,u='cm',px=170)=>{const m=Math.max(b0,h0);const s=100/m;const B=Math.max(b0*s,40),H=Math.max(h0*s,34);const x=40,y=10;
  let b=`<polygon points="${x},${y} ${x},${y+H} ${x+B},${y+H}" fill="#e3eef8" stroke="${LINE}" stroke-width="1.8"/><rect x="${x}" y="${y+H-10}" width="10" height="10" fill="none" stroke="${LINE}" stroke-width="1.2"/>`;
  b+=`<text x="${x+B/2}" y="${y+H+16}" font-size="13" text-anchor="middle" fill="${INK}">${b0} ${u}</text><text x="${x-5}" y="${y+H/2+4}" font-size="13" text-anchor="end" fill="${INK}">${h0} ${u}</text>`;
  return svgw(x+B+12,y+H+22,b,px);};
/* triangle from side lengths a(BC) b(CA) c(AB); labels: array of 3 strings for sides c,a,b (bottom, right, left); opts.right marks a right angle at C... */
V.tri=(a,b,c,o={})=>{const cx=(b*b+c*c-a*a)/(2*c),cy=Math.sqrt(Math.max(b*b-cx*cx,0));const xs=[0,c,cx],ys=[0,0,cy];
  const mnx=Math.min(...xs),mxx=Math.max(...xs),mxy=Math.max(...ys);const s=Math.min(150/(mxx-mnx),90/mxy);const P=xs.map((x,i)=>[30+(x-mnx)*s,22+(mxy-ys[i])*s]);
  const W=60+(mxx-mnx)*s,H=46+mxy*s;
  let g=`<polygon points="${P.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="#e3eef8" stroke="${LINE}" stroke-width="1.8"/>`;
  const lab=(i,j,t)=>{if(!t)return '';const mx=(P[i][0]+P[j][0])/2,my=(P[i][1]+P[j][1])/2;const ccx=(P[0][0]+P[1][0]+P[2][0])/3,ccy=(P[0][1]+P[1][1]+P[2][1])/3;let dx=mx-ccx,dy=my-ccy;const L=Math.hypot(dx,dy)||1;dx/=L;dy/=L;return `<text x="${(mx+dx*17).toFixed(1)}" y="${(my+dy*17+4).toFixed(1)}" font-size="12" text-anchor="middle" fill="${INK}" stroke="#fff" stroke-width="3" paint-order="stroke">${t}</text>`;};
  const L=o.labels||[];g+=lab(0,1,L[0])+lab(1,2,L[1])+lab(2,0,L[2]);
  if(o.angles){const ccx=(P[0][0]+P[1][0]+P[2][0])/3,ccy=(P[0][1]+P[1][1]+P[2][1])/3;o.angles.forEach((t,i)=>{if(!t)return;const dx=ccx-P[i][0],dy=ccy-P[i][1],Ln=Math.hypot(dx,dy);g+=`<text x="${(P[i][0]+dx/Ln*22).toFixed(1)}" y="${(P[i][1]+dy/Ln*22+4).toFixed(1)}" font-size="11.5" text-anchor="middle" fill="${INK}" stroke="#e3eef8" stroke-width="3" paint-order="stroke">${t}</text>`;});}
  if(o.names){o.names.forEach((t,i)=>{const ccx=(P[0][0]+P[1][0]+P[2][0])/3,ccy=(P[0][1]+P[1][1]+P[2][1])/3;const dx=P[i][0]-ccx,dy=P[i][1]-ccy,Ln=Math.hypot(dx,dy);g+=`<text x="${(P[i][0]+dx/Ln*12).toFixed(1)}" y="${(P[i][1]+dy/Ln*12+4).toFixed(1)}" font-size="13" font-weight="bold" text-anchor="middle" fill="${INK}">${t}</text>`;});}
  if(o.rightAt!==undefined){const i=o.rightAt,j=(i+1)%3,k=(i+2)%3;const u1=[(P[j][0]-P[i][0]),(P[j][1]-P[i][1])],u2=[(P[k][0]-P[i][0]),(P[k][1]-P[i][1])];const n1=Math.hypot(...u1),n2=Math.hypot(...u2);const q=9;const p1=[P[i][0]+u1[0]/n1*q,P[i][1]+u1[1]/n1*q],p2=[P[i][0]+u2[0]/n2*q,P[i][1]+u2[1]/n2*q],p3=[p1[0]+u2[0]/n2*q,p1[1]+u2[1]/n2*q];g+=`<polyline points="${p1.join(',')} ${p3.join(',')} ${p2.join(',')}" fill="none" stroke="${LINE}" stroke-width="1.2"/>`;}
  return svgw(W,H,g,o.px||Math.min(W,190));};
V.angle=(deg,o={})=>{const R=70,cx=20,cy=80;const a=deg*Math.PI/180;const x2=cx+R*Math.cos(a),y2=cy-R*Math.sin(a);const W=deg>90?170:110;const ox=deg>90?70:0;
  let g=`<line x1="${cx+ox}" y1="${cy}" x2="${cx+ox+R+10}" y2="${cy}" stroke="${LINE}" stroke-width="2.2"/><line x1="${cx+ox}" y1="${cy}" x2="${(x2+ox).toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${LINE}" stroke-width="2.2"/>`;
  if(deg===90)g+=`<rect x="${cx+ox}" y="${cy-12}" width="12" height="12" fill="none" stroke="${LINE}" stroke-width="1.2"/>`;
  else{const r2=18;g+=`<path d="M${cx+ox+r2},${cy} A${r2},${r2} 0 0 0 ${(cx+ox+r2*Math.cos(a)).toFixed(1)},${(cy-r2*Math.sin(a)).toFixed(1)}" fill="none" stroke="${LINE}" stroke-width="1.2"/>`;}
  if(o.label)g+=`<text x="${cx+ox+26}" y="${cy-8}" font-size="12" fill="${INK}">${o.label}</text>`;
  return svgw(W,90,g,o.px||W);};
/* line plot: labels = tick labels (strings), counts = Xs above each */
V.lineplot=(labels,counts,o={})=>{const n=labels.length,sp=Math.min(44,300/n),W=sp*(n-1)+60,maxc=Math.max(...counts,1),H=40+maxc*15+18;const y0=H-34;
  let g=`<line x1="20" y1="${y0}" x2="${W-20}" y2="${y0}" stroke="${LINE}" stroke-width="1.6"/>`;
  labels.forEach((t,i)=>{const x=30+i*sp;g+=`<line x1="${x}" y1="${y0-5}" x2="${x}" y2="${y0+5}" stroke="${LINE}" stroke-width="1.4"/><text x="${x}" y="${y0+19}" font-size="12" text-anchor="middle" fill="${INK}">${t}</text>`;
    for(let k=0;k<counts[i];k++)g+=`<text x="${x}" y="${y0-9-k*15}" font-size="14" font-weight="bold" text-anchor="middle" fill="${LINE}">X</text>`;});
  if(o.title)g=`<text x="${W/2}" y="13" font-size="12.5" font-weight="bold" text-anchor="middle" fill="${INK}">${o.title}</text>`+g;
  if(o.axis)g+=`<text x="${W/2}" y="${H-2}" font-size="11" text-anchor="middle" fill="${INK}">${o.axis}</text>`;
  return svgw(W,H,g,o.px||Math.min(W,330));};
const stemData=(data)=>{const m={};data.forEach(v=>{const s=Math.floor(v/10);(m[s]=m[s]||[]).push(v%10);});const st=Object.keys(m).map(Number).sort((a,b)=>a-b);const lo=st[0],hi=st[st.length-1];const rows=[];for(let s=lo;s<=hi;s++)rows.push([s,(m[s]||[]).sort((a,b)=>a-b)]);return rows;};
V.stem=(rows,keyStem,keyLeaf,o={})=>{const tr=rows.map(([s,l])=>`<tr><td class="st">${s}</td><td class="lf">${l.join('&nbsp; ')}</td></tr>`).join('');
  return `<table class="g5sl">${o.title?`<caption>${o.title}</caption>`:''}<tr><th>Stem</th><th>Leaf</th></tr>${tr}<tr><td colspan="2" class="key">Key: ${keyStem} | ${keyLeaf} means ${keyStem}${keyLeaf}</td></tr></table>`;};
V.table=(head,rows,o={})=>`<table class="g5t">${o.title?`<caption>${o.title}</caption>`:''}<tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
/* horizontal in/out table */
V.ioTable=(hin,hout,ins,outs)=>`<table class="g5t g5io"><tr><th>${hin}</th>${ins.map(x=>`<td>${x}</td>`).join('')}</tr><tr><th>${hout}</th>${outs.map(x=>`<td>${x}</td>`).join('')}</tr></table>`;
V.spinner=(secs,px=110)=>{const R=48,cx=52,cy=52,n=secs.length;let b='';const fills=['#7fb0dc','#f2c94c','#9fd3c7','#f4a6a6','#c9d6e3','#ffd8a8','#b8e0b0','#e0e0e0'];
  secs.forEach((t,i)=>{const a0=-Math.PI/2+i*2*Math.PI/n,a1=a0+2*Math.PI/n;const am=(a0+a1)/2;b+=`<path d="M${cx},${cy} L${(cx+R*Math.cos(a0)).toFixed(1)},${(cy+R*Math.sin(a0)).toFixed(1)} A${R},${R} 0 0 1 ${(cx+R*Math.cos(a1)).toFixed(1)},${(cy+R*Math.sin(a1)).toFixed(1)} Z" fill="${fills[['Red','Blue','Green','Yellow'].indexOf(t)>=0?[3,0,2,1][['Red','Blue','Green','Yellow'].indexOf(t)]:i%8]}" stroke="${LINE}" stroke-width="1.3"/><text x="${(cx+R*.62*Math.cos(am)).toFixed(1)}" y="${(cy+R*.62*Math.sin(am)+4).toFixed(1)}" font-size="${n>6?8:10}" text-anchor="middle" fill="${INK}">${t}</text>`;});
  b+=`<line x1="${cx}" y1="${cy}" x2="${cx+20}" y2="${cy-24}" stroke="${INK}" stroke-width="2.4"/><circle cx="${cx}" cy="${cy}" r="3.5" fill="${INK}"/>`;return svgw(104,104,b,px);};
G.V=V;
G.css=`.frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1;font-size:.85em;margin:0 2px}.frac i{font-style:normal;padding:0 2px}.frac i:first-child{border-bottom:1.5px solid currentColor}
.g5sl,.g5t{border-collapse:collapse;font-size:.92em;margin:4px 0;background:#fff;color:#1b2a41}.g5sl caption,.g5t caption{font-weight:bold;font-size:.9em;padding-bottom:2px}
.g5sl th,.g5sl td,.g5t th,.g5t td{border:1.3px solid #24497a;padding:2px 9px;text-align:center}.g5sl th,.g5t th{background:#e3eef8}.g5sl td.lf{text-align:left;letter-spacing:.5px;min-width:80px}.g5sl td.key{font-size:.85em;text-align:left;border:none;padding-top:3px}
.g5io td{min-width:34px}.g5v{display:inline-block;vertical-align:middle}`;
/* ================= NUMBER & NUMBER SENSE (5.NS.1, 5.NS.2) ================= */
const Q=(t,vis)=>vis?`${t}<div class="g5vis">${vis}</div>`:t;
const DEC_DENS=[2,4,5,8,10,20,25,50];
function termFrac(dens){for(let t=0;t<50;t++){const d=pick(dens),n=ri(1,d-1);const f=fr(n,d);if(DEC_DENS.concat([100]).includes(f.d))return f;}return {n:1,d:4};}
const decStr=v=>fx(v);
/* ---- NS.1 models ---- */
S('ns1_model',{std:'5.NS.1',cat:'NS',unit:[4,7],name:'Fraction & decimal models',nocalc:1},H=>{
  const k=H?pick([5,6,6,7]):ri(0,4);
  if(k===0){const s=pick([ri(11,99),ri(1,9)]);if(s%10===0)return null;const v=s/100;
    return mc(Q('The grid is 1 whole. What decimal does the <b>shaded</b> part show?',V.grid(s)),ch(fx(v),v),[ch(fx(s/10),s/10),ch(fx(s/1000),s/1000),ch(fx((100-s)/100),(100-s)/100),ch(fx(s/100+0.1),s/100+0.1)],{why:`${s} of 100 squares are shaded: ${s} hundredths = ${fx(v)}.`});}
  if(k===1){const s=pick([10,20,25,30,40,45,50,60,70,75,80,90,35,65,15,85,4,8,12,16,24,28,36,44,48,52,56,64,68,72,76,84,88,92,96]);const f=fr(s,100);const u=fr(100-s,100);
    return mc(Q('The grid is 1 whole. Which fraction is equivalent to the <b>shaded</b> part?',V.grid(s)),ch(fh(f),fv(f)),[ch(fh(u),fv(u)),ch(F(f.n,f.d*10),f.n/(f.d*10)),ch(F(f.d,f.n),f.d/f.n),ch(F(s,1000),s/1000),ch(F(Math.round(s/10)||1,100),(Math.round(s/10)||1)/100)],{why:`${s}/100 simplifies to ${f.n}/${f.d}.`});}
  if(k===2){const s=pick([1,3,5,7,2,6]);const v=s/8;
    return mc(Q('The bar is 1 whole. Which decimal names the <b>shaded</b> part?',V.bar(8,s)),ch(fx(v),v),[ch('0.'+s+'8',+('0.'+s+'8')),ch('0.8'+s,+('0.8'+s)),ch(fx((8-s)/8),(8-s)/8),ch('0.'+s,s/10)],{why:`Each eighth is 0.125, so ${s} eighths = ${s} × 0.125 = ${fx(v)}.`});}
  if(k===3){const p=pick([4,5,2]);const s=ri(1,p-1);const v=s/p;
    return mc(Q('The circle is 1 whole. Which decimal names the <b>shaded</b> part?',V.pie(p,s)),ch(fx(v),v),[ch('0.'+s,s/10),ch('0.'+s+p,+('0.'+s+p)),ch(fx((p-s)/p),(p-s)/p),ch(fx(p/10),p/10)],{why:`${s}/${p} = ${fx(v)}.`});}
  if(k===4){const s=pick([1,2]);const v=s/3;
    return mc(Q('The circle is 1 whole. Which decimal is <b>closest</b> to the shaded part?',V.pie(3,s)),ch(s===1?'0.33':'0.67',v),[ch('0.'+s+'3',+('0.'+s+'3')),ch(s===1?'0.67':'0.33',1-v),ch('0.3',0.3),ch('0.'+s,s/10)],{why:`${s}/3 = ${s===1?'0.333…':'0.666…'}, a repeating decimal, closest to ${s===1?'0.33':'0.67'}.`});}
  if(k===5){const s=ri(11,95);if(s%10===0)return null;const w=ri(1,2);const v=w+s/100;const vis=Array(w).fill(V.grid(100,84)).join(' ')+' '+V.grid(s,84);
    return mc(Q('Each grid is 1 whole. What number do the shaded parts show?',vis),ch(fx(v),v),[ch(fx(s/100),s/100),ch(fx(w+1+s/100),w+1+s/100),ch(fx(w+s/1000),w+s/1000),ch(fx(w*100+s),w*100+s)],{why:`${w} whole grid${w>1?'s':''} + ${s} hundredths = ${fx(v)}.`});}
  /* k 6/7: NOT equivalent */
  const s=pick([20,25,40,50,60,75,80,30,70,90]);const f=fr(s,100);
  const eq=[ch(fx(s/100),1),ch(F(s,100),1),ch(F(f.n,f.d),1),ch(F(f.n*2,f.d*2),1),ch(fx(s/100)+'0',1)];
  const wrongs=[ch(F(f.n,10),0),ch(F(s,10),0),ch(fx(s/1000),0),ch(F(f.d,f.n),0)];
  const W=pick(wrongs.filter(w=>Math.abs(eval(w.h.replace(/<span class="frac"><i>(\d+)<\/i><i>(\d+)<\/i><\/span>/,'$1/$2'))-s/100)>1e-9));if(!W)return null;
  const c=shuf(eq).slice(0,3);if(new Set(c.map(x=>x.h)).size<3)return null;
  return mc(Q('The grid is 1 whole. Which number is <b>NOT</b> equivalent to the shaded part?',V.grid(s)),{h:W.h},c.map(x=>({h:x.h})),{why:`The shaded part is ${fx(s/100)} = ${f.n}/${f.d}. ${W.h.replace(/<[^>]+>/g,' ').trim()} has a different value.`});
});
/* ---- NS.1 equivalents (fraction <-> decimal) ---- */
S('ns1_equiv',{std:'5.NS.1',cat:'NS',unit:[4,7],name:'Fraction ↔ decimal',nocalc:1},H=>{
  const dir=ri(0,1);
  if(dir===0){ // fraction -> decimal
    let f,w=0;if(H){f=termFrac([8,20,25,50,4,5]);if(r()<.5)w=ri(1,3);}else f=termFrac([2,4,5,10,20,25,50,8,100]);
    const v=w+fv(f);const fq=w?`${w}${F(f.n,f.d)}`:F(f.n,f.d);
    const ds=[ch((w||'')+'0.'+f.n+f.d,0),ch(fx(w+f.n/10),w+f.n/10),ch(fx(w+1-fv(f)),w+1-fv(f)),ch(fx(v*10),v*10),ch(fx(v/10),v/10),ch(fx(w+fv(f)+0.1),w+fv(f)+0.1)].map(x=>{x.h=x.h.replace(/^(\d)0\./,'$1.');x.v=+x.h;return x;});
    if(r()<.3) return num(`Write ${fq} as a decimal.`,fx(v),{acc:[fx(v)],why:`${f.n}/${f.d} = ${fx(fv(f))}${w?`, so ${fq} = ${fx(v)}`:''}.`});
    return mc(`Which decimal is equivalent to ${fq}?`,ch(fx(v),v),ds,{why:`${f.n}/${f.d} = ${fx(fv(f))}${w?`; add the ${w} whole${w>1?'s':''}: ${fx(v)}`:''}.`});
  }
  // decimal -> fraction (simplest form)
  let dv;if(H){dv=pick([0.125,0.375,0.625,0.875,0.15,0.35,0.45,0.55,0.65,0.85,0.04,0.08,0.24,0.36,0.48,0.64,0.72,0.96,0.12,0.28]);if(r()<.4)dv+=ri(1,3);}
  else dv=pick([0.5,0.25,0.75,0.2,0.4,0.6,0.8,0.1,0.3,0.7,0.9,0.05,0.35,0.45,0.65,0.95,0.12,0.24,0.08,0.125]);
  dv=rnd(dv);const w=Math.floor(dv),fp=rnd(dv-w);const places=fx(fp).split('.')[1].length,den=10**places,nu=Math.round(fp*den);const f=fr(nu,den);
  const ans=w?`${w}${F(f.n,f.d)}`:F(f.n,f.d);
  const dg=String(nu);const ds=[ch((w?w:'')+F(nu,den/10||1).replace(/^/,''),w+nu/(den/10||1)),ch((w?w:'')+F(nu,den*10),w+nu/(den*10)),ch((w?w:'')+F(f.d,f.n),w+f.d/f.n)];
  if(dg.length===2&&dg[1]!=='0'&&+dg[0]>0)ds.push(ch((w?w:'')+F(+dg[0],+dg[1]),w+(+dg[0])/(+dg[1])));
  ds.push(ch((w?w:'')+F(f.n,f.d+1),w+f.n/(f.d+1)));
  return mc(`Which fraction is equivalent to <b>${fx(dv)}</b>? (simplest form)`,ch(ans,dv),ds,{why:`${fx(fp)} = ${nu}/${den} = ${f.n}/${f.d} in simplest form.`});
});
/* ---- NS.1 select all equal ---- */
S('ns1_same',{std:'5.NS.1',cat:'NS',unit:[4,7],name:'Select all equivalent',nocalc:1},H=>{
  const f=termFrac(H?[8,20,25,4,5]:[2,4,5,10,20]);const v=fv(f);const k=ri(2,4);
  const showDec=r()<.5;const target=showDec?fx(v):F(f.n,f.d);
  const right=[showDec?F(f.n,f.d):fx(v),F(f.n*k,f.d*k)];
  if(fx(v).split('.')[1].length<3)right.push(fx(v)+'0');
  if(f.d!==100&&100%f.d===0&&!right.includes(F(f.n*100/f.d,100))&&F(f.n*k,f.d*k)!==F(f.n*100/f.d,100))right.push(F(f.n*100/f.d,100));
  const wrong=[F(f.d,f.n),'0.'+f.n+f.d,fx(v*10),F(f.n,f.d*10),fx(1-v),F(f.n+1,f.d+1)].filter(h=>{const val=h.includes('frac')?(()=>{const m=h.match(/<i>(\d+)<\/i><i>(\d+)<\/i>/);return m[1]/m[2];})():+h;return Math.abs(val-v)>1e-9;});
  const R=sample(right,Math.min(right.length,H?3:2)),Wr=sample(wrong,6-R.length);
  return ms(`Select <b>ALL</b> the numbers that are equal to ${target}.`,R,Wr,{why:`${F(f.n,f.d)} = ${fx(v)}. Equivalent fractions and decimals with extra zeros at the end have the same value.`});
});
/* ---- NS.1 compare ---- */
function nsVal(H){ // random fraction/decimal with value and html
  const t=ri(0,H?3:2);
  if(t===0){const d=pick([1,2]);const v=d===1?ri(1,9)/10:ri(1,99)/100;return {h:fx(v),v};}
  if(t===1){const f=termFrac([2,4,5,8,10,3]);return {h:F(f.n,f.d),v:fv(f)};}
  if(t===2){const v=ri(1,999)/1000;return {h:fx(v),v};}
  const w=ri(1,2),f=termFrac([2,4,5,8]);return r()<.5?{h:`${w}${F(f.n,f.d)}`,v:w+fv(f)}:{h:F(w*f.d+f.n,f.d),v:w+fv(f)};
}
function trapPair(H){
  const k=ri(0,4);
  if(k===0){const a=ri(2,8),b=ri(10,a*10-1);return [{h:fx(a/10),v:a/10},{h:fx(b/100),v:b/100}];} // 0.4 vs 0.35
  if(k===1){const a=ri(1,9),b=ri(10,99);if(b<a*10+1)return trapPair(H);return [{h:'0.0'+a,v:a/100},{h:fx(b/1000),v:b/1000}];}
  if(k===2){const f=termFrac([4,5,8,3]);let d=Math.round(fv(f)*10)/10;if(Math.abs(d-fv(f))<1e-9)d+=0.1;return [{h:F(f.n,f.d),v:fv(f)},{h:fx(d),v:d}];}
  if(k===3){const a=nsVal(H),b=nsVal(H);return [a,b];}
  const w=ri(1,2),f=termFrac([4,5,8]);const d=rnd(w+fv(f)+pick([-0.05,0.05,-0.1,0.1]));return [{h:F(w*f.d+f.n,f.d),v:w+fv(f)},{h:fx(d),v:d}];
}
const sym=(a,b)=>a<b-1e-9?'&lt;':a>b+1e-9?'&gt;':'=';
const flip=s=>s==='&lt;'?'&gt;':'&lt;';
S('ns1_compare',{std:'5.NS.1',cat:'NS',unit:[4,7],name:'Compare fractions & decimals',nocalc:1},H=>{
  const pairs=[];for(let g=0;pairs.length<4&&g<40;g++){const p=trapPair(H);if(Math.abs(p[0].v-p[1].v)<1e-9||p[0].h===p[1].h)continue;if(pairs.some(q=>q[0].h===p[0].h&&q[1].h===p[1].h))continue;pairs.push(shuf(p));}
  if(pairs.length<4)return null;
  const notQ=H&&r()<.4;
  const st=pairs.map((p,i)=>{const s=sym(p[0].v,p[1].v);const truth=notQ?i!==0:i===0;return `${p[0].h} ${truth?s:flip(s)} ${p[1].h}`;});
  const T=pairs[0];
  return mc(notQ?'Which comparison is <b>NOT</b> true?':'Which comparison is true?',{h:st[0]},st.slice(1).map(h=>({h})),{why:`${T[0].h} = ${fx(T[0].v)} and ${T[1].h} = ${fx(T[1].v)}. Compare place by place from the left.`});
});
/* ---- NS.1 order ---- */
S('ns1_order',{std:'5.NS.1',cat:'NS',unit:[4,7],name:'Order fractions & decimals',nocalc:1},H=>{
  const vals=[];for(let g=0;vals.length<4&&g<80;g++){const x=g<2?(()=>{const f=termFrac(H?[3,8,4,5,20]:[2,4,5,8,10]);return {h:F(f.n,f.d),v:fv(f)};})():nsVal(H);if(vals.some(y=>Math.abs(y.v-x.v)<0.004||y.h===x.h))continue;vals.push(x);}
  if(vals.length<4)return null;
  const desc=r()<.35;const sorted=vals.slice().sort((a,b)=>desc?b.v-a.v:a.v-b.v);
  const L=a=>a.map(x=>x.h).join(', &nbsp;');const key=a=>a.map(x=>x.h).join('|');
  const cands=[];const sw=(a,i,j)=>{a=a.slice();[a[i],a[j]]=[a[j],a[i]];return a;};
  const digitsOrder=vals.slice().sort((a,b)=>(desc?-1:1)*((a.h.length-b.h.length)||(a.v-b.v)));
  cands.push(digitsOrder,sorted.slice().reverse(),sw(sorted,1,2),sw(sorted,0,1),sw(sorted,2,3),sw(sw(sorted,0,1),2,3));
  const seen=new Set([key(sorted)]);const ds=[];for(const c of cands){if(seen.has(key(c)))continue;seen.add(key(c));ds.push({h:L(c)});}
  return mc(`Which list shows these numbers in order from <b>${desc?'greatest to least':'least to greatest'}</b>?<br><span style="white-space:nowrap">${shuf(vals).map(x=>x.h).join(', &nbsp; ')}</span>`,{h:L(sorted)},ds,{why:`As decimals: ${sorted.map(x=>fx(Math.round(x.v*1000)/1000)).join(', ')}.`,wide:1});
});
S('ns1_between',{std:'5.NS.1',cat:'NS',unit:[4,7],name:'Number between two numbers',nocalc:1},H=>{
  const f=termFrac([4,5,8,2]);const lo=fv(f);const hi=rnd(lo+pick([0.1,0.15,0.2,0.125]));if(hi>=1)return null;
  const inside=rnd((lo+hi)/2);const insideH=r()<.5&&Number.isInteger(inside*100)?fx(inside):fx(inside);
  const outs=[{h:fx(lo),v:lo},{h:fx(hi),v:hi},{h:fx(rnd(lo-0.05)),v:lo-0.05},{h:fx(rnd(hi+0.05)),v:hi+0.05},{h:fx(rnd(lo/10)),v:lo/10}];
  return mc(`Which number is <b>between</b> ${F(f.n,f.d)} and ${fx(hi)}?`,{h:insideH,v:inside},outs.filter(o=>o.v>0),{why:`${F(f.n,f.d)} = ${fx(lo)}. ${insideH} is greater than ${fx(lo)} and less than ${fx(hi)}.`});
});
/* ---- NS.2 prime & composite ---- */
const ODDCOMP=[9,15,21,25,27,33,35,39,45,49,51,55,57,63,65,69,75,77,81,85,87,91,93,95,99];
const PRIMES=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
S('ns2_prime',{std:'5.NS.2',cat:'NS',unit:[2],name:'Prime or composite'},H=>{
  const big=H?ODDCOMP.filter(x=>x>30):ODDCOMP;const P=H?PRIMES.filter(x=>x>30):PRIMES.filter(x=>x>10);
  if(r()<.5){const p=pick(P);return mc('Which number is <b>prime</b>?',ch(String(p),p),sample(big,3).map(x=>ch(String(x),x)),{sort:'v',why:`${p} has exactly two factors: 1 and ${p}. The others are odd but composite (e.g. ${sample(big,1)[0]}).`});}
  const c=pick(big);const f=[...Array(c).keys()].slice(2).find(i=>c%i===0);
  return mc('Which number is <b>NOT</b> prime?',ch(String(c),c),sample(P,3).map(x=>ch(String(x),x)),{sort:'v',why:`${c} = ${f} × ${c/f}, so it is composite. Odd does not mean prime!`});
});
S('ns2_select',{std:'5.NS.2',cat:'NS',unit:[2],name:'Select all composite/prime'},H=>{
  const wantComp=r()<.6;const pool=shuf([1,2,...sample(ODDCOMP,3),...sample(PRIMES.filter(x=>x>10),3),...sample([4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98],2)]);
  const set=[];for(const x of pool){if(set.length<6&&!set.includes(x))set.push(x);}if(!set.includes(1)&&H)set[5]=1;
  const ok=x=>wantComp?(x>1&&!isPrime(x)):isPrime(x);const R=set.filter(ok),W=set.filter(x=>!ok(x));if(!R.length||!W.length)return null;
  return ms(`Select <b>ALL</b> the ${wantComp?'composite':'prime'} numbers.`,R.map(x=>ch(String(x),x)),W.map(x=>ch(String(x),x)),{sort:'v',why:`${wantComp?'Composite':'Prime'}: ${R.sort((a,b)=>a-b).join(', ')}. Remember: 1 is neither prime nor composite, and 2 is the only even prime.`});
});
S('ns2_model',{std:'5.NS.2',cat:'NS',unit:[2],name:'Prime models (arrays)'},H=>{
  const p=pick([5,7,11,13]);const comps=shuf([[2,3],[2,4],[3,3],[2,5],[3,4],[2,6],[2,7],[3,5]]).slice(0,3);
  if(new Set(comps.map(c=>c[0]*c[1])).size<3)return null;
  const A={h:V.counters(1,p,p*16+4),v:p};const ds=comps.map(c=>({h:V.counters(c[0],c[1]),v:c[0]*c[1]}));
  return mc('Each model uses <b>all</b> of its counters. Which model shows a <b>prime</b> number of counters?',A,ds,{why:`${p} counters can only make 1 row of ${p}. The other numbers make rectangles with 2 or more rows, so they are composite.`});
});
function primeFactors(n){const f=[];let m=n;for(let p=2;p*p<=m;p++)while(m%p===0){f.push(p);m/=p;}if(m>1)f.push(m);return f;}
S('ns2_pf',{std:'5.NS.2',cat:'NS',unit:[2],name:'Prime factorization'},H=>{
  const pool=[];for(let n=12;n<=100;n++){const f=primeFactors(n);if(f.length>=(H?3:2)&&f.length<=4&&f[f.length-1]<=11)pool.push(n);}
  const n=pick(pool);const f=primeFactors(n);const X=a=>a.join(' × ');
  if(H&&r()<.35)return num(`What number has the prime factorization <b>${X(f)}</b>?`,n,{why:`${X(f)} = ${n}.`});
  const comp=f.length>=2?(()=>{const a=f.slice();const x=a.shift(),y=a.shift();return X([x*y,...a].sort((p,q)=>p-q));})():null;
  const extra=X([...f,pick([2,3])].sort((a,b)=>a-b));const drop=f.length>2?X(f.slice(1)):X([f[0],f[1]+2]);
  const pairs=[];for(let i=2;i*i<=n;i++)if(n%i===0)pairs.push(`${i} × ${n/i}`);
  const ds=[comp,extra,drop,pairs.find(p=>p!==comp)].filter(Boolean).map(h=>({h}));
  return mc(`Which shows the <b>prime factorization</b> of ${n}?`,{h:X(f)},ds,{why:`Keep splitting until every factor is prime: ${n} = ${X(f)}. A factor like ${f.length>=2?f[0]*f[1]:4} is not prime.`});
});
S('ns2_fm',{std:'5.NS.2',cat:'NS',unit:[2],name:'Factors & multiples'},H=>{
  const A=pick([24,36,40,48,60,72,84,90,96]);const B=pick([2,3,4,5,6]);
  const fac=[];for(let i=2;i<A;i++)if(A%i===0)fac.push(i);
  const good=fac.filter(x=>x%B===0&&x!==B);if(!good.length)return null;const ans=pick(good);
  const w1=fac.filter(x=>x%B!==0),w2=[];for(let m=B*2;m<=B*20;m+=B)if(A%m!==0)w2.push(m);
  if(w1.length<1||w2.length<2)return null;
  const ds=[pick(w1),...sample(w2,2),pick(w1.concat(w2))].map(x=>ch(String(x),x));
  return mc(`Which number is a <b>factor</b> of ${A} <b>and</b> a <b>multiple</b> of ${B}?`,ch(String(ans),ans),ds,{sort:'v',why:`${A} ÷ ${ans} = ${A/ans} (factor) and ${ans} = ${B} × ${ans/B} (multiple).`});
});
/* ================= COMPUTATION & ESTIMATION (5.CE.1 - 5.CE.4) ================= */
/* ---- CE.1 whole numbers ---- */
S('ce1_multistep',{std:'5.CE.1',cat:'CE',unit:[3],name:'Multistep whole-number problems'},H=>{
  const n=nm();
  if(!H){const a=ri(12,35),b=ri(12,25),c=ri(5,40);const it=pick(['markers','stickers','crayons','beads','cards']);const T=a*b+c;
    return mc(`${n} has ${a} boxes of ${it} with ${b} ${it} in each box, plus ${c} loose ${it}. How many ${it} does ${n} have in all?`,ch(cm(T),T),[ch(cm(a*b),a*b),ch(cm(a+b+c),a+b+c),ch(cm(a*(b+c)),a*(b+c)),ch(cm(a*b-c),a*b-c)],{sort:'v',why:`${a} × ${b} = ${cm(a*b)}, then + ${c} = ${cm(T)}.`});}
  const a=ri(15,40),b=ri(12,30),c=ri(15,40),d=ri(12,30),e=ri(20,90);const it=pick(['water bottles','juice boxes','apples','notebooks','light bulbs']);const T=a*b+c*d-e;
  return mc(`A store gets ${a} cases of ${it} with ${b} in each case and ${c} cases with ${d} in each case. ${e} ${it} are damaged and thrown away. How many ${it} are left?`,ch(cm(T),T),[ch(cm(a*b+c*d),a*b+c*d),ch(cm(a*b+c*d+e),a*b+c*d+e),ch(cm(a*b-e),a*b-e),ch(cm((a+c)*(b+d)-e),(a+c)*(b+d)-e)],{sort:'v',why:`${a} × ${b} = ${cm(a*b)}; ${c} × ${d} = ${cm(c*d)}; ${cm(a*b)} + ${cm(c*d)} − ${e} = ${cm(T)}.`});
});
S('ce1_remainder',{std:'5.CE.1',cat:'CE',unit:[3],name:'Interpret the remainder'},H=>{
  const d=H?ri(11,25):ri(3,9);const N=H?ri(250,1500):ri(40,400);const q=Math.floor(N/d),rm=N%d;if(!rm)return null;const kind=ri(0,2);
  const T=[[`${cm(N)} pencils are packed in boxes of ${d}. What is the greatest number of <b>full</b> boxes?`,q,`${cm(N)} ÷ ${d} = ${q} R${rm}. Only full boxes count, so drop the remainder: ${q}.`],
    [`${cm(N)} students are going on a trip. Each van holds ${d} students. How many vans are <b>needed</b> so everyone can go?`,q+1,`${cm(N)} ÷ ${d} = ${q} R${rm}. The ${rm} extra students need one more van: ${q+1}.`],
    [`${cm(N)} stickers are shared equally by ${d} friends. How many stickers are <b>left over</b>?`,rm,`${cm(N)} ÷ ${d} = ${q} R${rm}. The remainder ${rm} is left over.`]][kind];
  if(r()<.3)return num(T[0],T[1],{why:T[2]});
  return mc(T[0],ch(cm(T[1]),T[1]),[q,q+1,rm,d,q-1].map(x=>ch(cm(x),x)),{sort:'v',why:T[2]});
});
S('ce1_estimate',{std:'5.CE.1',cat:'CE',unit:[3],name:'Estimate with whole numbers'},H=>{
  const k=ri(0,2);
  if(k===0){const A=ri(2,9)*100,B=ri(2,9)*10;const a=A+ri(-40,40),b=B+ri(-4,4);if(a%100===0||b%10===0)return null;const e=A*B;
    return mc(`Which is the <b>best</b> estimate of ${cm(a)} × ${b}?`,ch(cm(e),e),[ch(cm(e*10),e*10),ch(cm(e/10),e/10),ch(cm((A-100)*(B-10)),(A-100)*(B-10)),ch(cm(A+B),A+B)],{sort:'v',why:`Round: ${cm(a)} ≈ ${A}, ${b} ≈ ${B}. ${A} × ${B} = ${cm(e)}.`});}
  if(k===1){const d=pick([3,4,6,7,8,9]),q=ri(2,9)*(H?100:10);const D=d*q+ri(-q/10+1,q/10-1);if(D%d===0)return null;
    return mc(`Which is the <b>best</b> estimate of ${cm(D)} ÷ ${d}? (Use compatible numbers.)`,ch(cm(q),q),[ch(cm(q*10),q*10),ch(cm(q/10),q/10),ch(cm(q+(H?100:10)*2),q+(H?100:10)*2),ch(cm(Math.round(D/10)),Math.round(D/10))],{sort:'v',why:`${cm(d*q)} is close to ${cm(D)} and divides evenly: ${cm(d*q)} ÷ ${d} = ${cm(q)}.`});}
  const xs=[ri(150,950),ri(150,950),ri(150,950)];const ro=x=>Math.round(x/100)*100;const e=xs.map(ro).reduce((s,x)=>s+x,0);
  return mc(`A school collected ${xs.map(cm).join(', ')} cans over three weeks. Rounding each number to the nearest hundred, about how many cans were collected?`,ch(cm(e),e),[ch(cm(e+100),e+100),ch(cm(e-100),e-100),ch(cm(e+300),e+300),ch(cm(e*10),e*10)],{sort:'v',why:`${xs.map(x=>cm(ro(x))).join(' + ')} = ${cm(e)}.`});
});
S('ce1_compute',{std:'5.CE.1',cat:'CE',unit:[3],name:'Multiply & divide whole numbers'},H=>{
  if(r()<.5){const a=H?ri(102,989):ri(21,99),b=ri(12,H?78:49);const P=a*b;return num(`${a} × ${b} =`,P,{acc:[String(P)],why:`${a} × ${b} = ${cm(P)}.`});}
  const d=H?ri(12,48):ri(3,9);const q=H?ri(25,299):ri(21,199);const rm=r()<.5?0:ri(1,d-1);const N=d*q+rm;if(H&&N>9999)return null;
  return num(`${cm(N)} ÷ ${d} =`,rm?`${q} R${rm}`:q,{acc:rm?[`${q}r${rm}`]:[String(q)],why:`${d} × ${q} = ${cm(d*q)}${rm?`, remainder ${rm}`:''}.`});
});
S('ce1_pages',{std:'5.CE.1',cat:'CE',unit:[3],name:'Table total, then divide'},H=>{
  const who=sample(NAMES,4);const vals=who.map(()=>ri(H?45:15,H?140:60));const S=vals.reduce((a,b)=>a+b,0);const p=H?pick([12,15,16,18,24]):pick([5,6,8,10]);const pages=Math.ceil(S/p);if(S%p===0)return null;
  const it=pick(['stickers','photos','stamps','cards']);
  return num(Q(`Four friends put all their ${it} into one album. Each page holds ${p} ${it}. What is the <b>least</b> number of pages they need?`,V.table(['Name','Number of '+it],who.map((w,i)=>[w,vals[i]]))),pages,{why:`Total = ${vals.join(' + ')} = ${S}. ${S} ÷ ${p} = ${Math.floor(S/p)} R${S%p}, so they need ${pages} pages.`});
});
/* ---- CE.2 fractions ---- */
const FD=[2,3,4,5,6,8,10,12];
const rf=(ds)=>{for(let t=0;t<40;t++){const d=pick(ds||FD),n=ri(1,d-1);if(gcd(n,d)===1)return {n,d};}return {n:1,d:2};};
S('ce2_lcd',{std:'5.CE.2',cat:'CE',unit:[8],name:'Least common denominator',nocalc:0},H=>{
  let a=rf(),b=rf();if(a.d===b.d)return null;const L=lcm(a.d,b.d);if(H&&L===a.d*b.d&&r()<.7)return null;
  return mc(`What is the <b>least common denominator</b> of ${F(a.n,a.d)} and ${F(b.n,b.d)}?`,ch(String(L),L),[a.d*b.d,a.d+b.d,Math.max(a.d,b.d),L*2,Math.min(a.d,b.d)].map(x=>ch(String(x),x)),{sort:'v',why:`Multiples of ${a.d} and ${b.d}: the least one they share is ${L}.`});
});
function ceFracOp(H){
  if(!H){let a=rf(),b=rf();if(a.d===b.d)return null;const add=r()<.55;let x=a,y=b;if(!add&&fv(x)<fv(y))[x,y]=[y,x];if(!add&&Math.abs(fv(x)-fv(y))<1e-9)return null;
    const res=add?fadd(x,y):fsub(x,y);const L=lcm(x.d,y.d);
    return {q:`${F(x.n,x.d)} ${add?'+':'−'} ${F(y.n,y.d)} =`,res,ds:[ch(F(add?x.n+y.n:Math.abs(x.n-y.n),add?x.d+y.d:Math.abs(x.d-y.d)||1),add?(x.n+y.n)/(x.d+y.d):Math.abs(x.n-y.n)/(Math.abs(x.d-y.d)||1)),ch(fh(fr(add?x.n+y.n:Math.abs(x.n-y.n),L)),(add?x.n+y.n:Math.abs(x.n-y.n))/L),ch(fh(fr(res.n*L/res.d+1,L)),fv(res)+1/L),ch(fh(fr(Math.max(res.n*L/res.d-1,1),L)),Math.max(res.n*L/res.d-1,1)/L)],why:`Use ${L} as the common denominator: ${F(x.n*L/x.d,L)} ${add?'+':'−'} ${F(y.n*L/y.d,L)} = ${fh(res)} (simplest form).`};}
  const a=rf(),b=rf();if(a.d===b.d)return null;const w1=ri(2,6),w2=ri(1,3);const add=r()<.5;const X={n:w1*a.d+a.n,d:a.d},Y={n:w2*b.d+b.n,d:b.d};
  if(!add&&fv(X)<=fv(Y))return null;const res=add?fadd(X,Y):fsub(X,Y);const L=lcm(a.d,b.d);
  const wholeOnly=add?fr((w1+w2)*L+Math.abs(a.n*L/a.d-b.n*L/b.d),L):fr((w1-w2)*L+Math.abs(a.n*L/a.d-b.n*L/b.d),L);
  const ds=[ch(fh(wholeOnly),fv(wholeOnly)),ch(fh(fadd(res,{n:1,d:1})),fv(res)+1),ch(fh(fsub(res,{n:1,d:1})),fv(res)-1),ch(fh(fr(res.n*L/res.d+1,L)),fv(res)+1/L),ch(`${add?w1+w2:w1-w2}${F(add?a.n+b.n:Math.abs(a.n-b.n)||1,add?a.d+b.d:Math.abs(a.d-b.d)||1)}`,(add?w1+w2:w1-w2)+(add?a.n+b.n:Math.abs(a.n-b.n)||1)/(add?a.d+b.d:Math.abs(a.d-b.d)||1))];
  return {q:`${w1}${F(a.n,a.d)} ${add?'+':'−'} ${w2}${F(b.n,b.d)} =`,res,ds,why:`Rename with denominator ${L}: ${w1}${F(a.n*L/a.d,L)} ${add?'+':'−'} ${w2}${F(b.n*L/b.d,L)}${!add&&a.n*L/a.d<b.n*L/b.d?' (regroup 1 whole as '+L+'/'+L+')':''} = ${fh(res)}.`};
}
S('ce2_addsub',{std:'5.CE.2',cat:'CE',unit:[8],name:'Add & subtract fractions',nocalc:1},H=>{const o=ceFracOp(H);if(!o)return null;
  return mc(`${o.q} <span style="font-size:.8em">(simplest form)</span>`,ch(fh(o.res),fv(o.res)),o.ds,{nonneg:1,why:o.why});});
S('ce2_model',{std:'5.CE.2',cat:'CE',unit:[8],name:'Fraction models: add/subtract',nocalc:1},H=>{
  const d1=8,d2=pick([4,2]);const a=ri(3,7),b=ri(1,d2-1);const add=r()<.4;const A=fr(a,d1),B=fr(b,d2);if(!add&&fv(A)<=fv(B))return null;if(fv(A)===fv(B))return null;
  const res=add?fadd(A,B):fsub(A,B);
  return mc(Q(`Each circle is 1 whole. What is the <b>${add?'sum':'difference'}</b> of the shaded parts?`,V.pie(d1,a,80)+' &nbsp; '+V.pie(d2,b,80)),ch(fh(res),fv(res)),[ch(F(add?a+b:a-b,d1+d2),(add?a+b:a-b)/(d1+d2)),ch(fh(fr(add?a+b:Math.abs(a-b),d1)),(add?a+b:Math.abs(a-b))/d1),ch(fh(fr(Math.abs(a-b)||1,d2)),(Math.abs(a-b)||1)/d2),ch(fh(fadd(res,{n:1,d:8})),fv(res)+1/8)],{nonneg:1,why:`${F(a,d1)} ${add?'+':'−'} ${F(b,d2)} = ${F(a,8)} ${add?'+':'−'} ${F(b*8/d2,8)} = ${fh(res)}.`});
});
S('ce2_context',{std:'5.CE.2',cat:'CE',unit:[8],name:'Fraction word problems',nocalc:0},H=>{
  const n=nm();
  if(!H){const o=ceFracOp(r()<.5?0:1);if(!o)return null;const add=o.q.includes('+');const parts=o.q.replace(' =','').split(add?' + ':' − ');
    const q=add?`${n} walked ${parts[0]} miles in the morning and ${parts[1]} miles in the afternoon. How many miles did ${n} walk in all?`:`A ribbon is ${parts[0]} feet long. ${n} cuts off ${parts[1]} feet. How many feet of ribbon are left?`;
    return mc(q,ch(fh(o.res)+(add?' miles':' feet'),fv(o.res)),o.ds.map(x=>({h:x.h+(add?' miles':' feet'),v:x.v})),{nonneg:1,why:o.why});}
  const a=rf([2,3,4,6]),b=rf([2,3,4,6]),c=rf([2,3,4,6]),d=rf([2,3,4,6]);const h1={n:62*a.d+a.n,d:a.d},g1=b,h2={n:61*c.d+c.n,d:c.d},g2={n:1*d.d+d.n,d:d.d};
  const A=fadd(h1,g1),B=fadd(h2,g2);if(fv(A)<=fv(B))return null;const D=fsub(A,B);if(fv(D)>=3)return null;const n2=pick(NAMES.filter(x=>x!==n));
  return mc(`At the start of the year ${n} was ${fh(h1)} inches tall and grew ${fh(g1)} inch. ${n2} was ${fh(h2)} inches tall and grew ${fh(g2)} inches. At the end of the year, how much taller is ${n} than ${n2}?`,ch(fh(D)+' in.',fv(D)),[ch(fh(fsub(h1,h2))+' in.',fv(fsub(h1,h2))),ch(fh(fadd(D,{n:1,d:12}))+' in.',fv(D)+1/12),ch(fh(fsub(g2,g1).n>0?fsub(g2,g1):fsub(g1,g2))+' in.',Math.abs(fv(g2)-fv(g1))),ch(fh(fadd(D,{n:1,d:1}))+' in.',fv(D)+1)],{nonneg:1,why:`${n}: ${fh(h1)} + ${fh(g1)} = ${fh(A)}. ${n2}: ${fh(h2)} + ${fh(g2)} = ${fh(B)}. Difference: ${fh(D)} inches.`});
});
S('ce2_wxf',{std:'5.CE.2',cat:'CE',unit:[8],name:'Whole number × fraction',nocalc:1},H=>{
  const b=pick(H?[3,4,6,8]:[2,3,4,5]);const w=b*ri(H?2:1,H?3:3);if(w>12)return null;const a=ri(1,b-1);if(gcd(a,b)!==1)return null;const ans=w*a/b;
  const it=pick([['batch','cup of flour','cups of flour'],['dog','pound of food each day','pounds of food'],['bracelet','yard of string','yards of string'],['plant','liter of water','liters of water']]);
  return mc(`Each ${it[0]} needs ${F(a,b)} ${it[1]}. How many ${it[2]} are needed for ${w} ${it[0]}${it[0]==='batch'?'es':'s'}?`,ch(String(ans),ans),[ch(String(w),w),ch(String(w*a),w*a),ch(String(w/b),w/b),ch(fh(fr(w*a,w*b)),a/b),ch(String(w*b/a),w*b/a)],{sort:'v',why:`${w} × ${F(a,b)} = ${F(w*a,b)} = ${ans}. (${w} ÷ ${b} = ${w/b} groups, × ${a} = ${ans}.)`});
});
const BENCH=[[{n:1,d:8},0],[{n:1,d:10},0],[{n:1,d:12},0],[{n:3,d:8},.5],[{n:5,d:8},.5],[{n:5,d:12},.5],[{n:7,d:12},.5],[{n:4,d:10},.5],[{n:6,d:10},.5],[{n:7,d:8},1],[{n:9,d:10},1],[{n:11,d:12},1],[{n:5,d:6},1],[{n:1,d:2},.5]];
S('ce2_estimate',{std:'5.CE.2',cat:'CE',unit:[8],name:'Estimate with benchmarks',nocalc:0},H=>{
  const a=pick(BENCH),b=pick(BENCH);if(a===b)return null;const add=r()<.6||a[1]<b[1];const e=add?a[1]+b[1]:a[1]-b[1];if(e<0)return null;
  const eh=v=>v===0?'0':fh(fr(Math.round(v*2),2));
  return mc(`Which is the <b>best estimate</b> of ${F(a[0].n,a[0].d)} ${add?'+':'−'} ${F(b[0].n,b[0].d)}? (Use 0, ${F(1,2)}, and 1.)`,ch(eh(e),e),[e+.5,e-.5,e+1,e+1.5].filter(x=>x>=0).map(x=>ch(eh(x),x)),{sort:'v',why:`${F(a[0].n,a[0].d)} is close to ${eh(a[1])} and ${F(b[0].n,b[0].d)} is close to ${eh(b[1])}. ${eh(a[1])} ${add?'+':'−'} ${eh(b[1])} = ${eh(e)}.`});
});
/* ---- CE.3 decimals ---- */
const dstr=(A,p)=>fx(A/10**p);
S('ce3_mult',{std:'5.CE.3',cat:'CE',unit:[5],name:'Multiply decimals',nocalc:1},H=>{
  const k=H?ri(1,2):ri(0,1);let A,pa,B,pb;
  if(k===0){A=ri(11,99);pa=pick([1,2]);B=ri(2,9);pb=pick([0,0,1]);}
  else if(k===1){A=ri(101,999);pa=pick([1,2]);B=ri(2,9);pb=0;}
  else {A=ri(11,99);pa=1;B=ri(11,99);pb=pick([1,1,2]);}
  if(A%10===0||B%10===0)return null;const P=A*B,p=pa+pb;const v=P/10**p;
  const ds=[ch(dstr(P,p-1),P/10**(p-1)),ch(dstr(P,p+1),P/10**(p+1)),ch(dstr(P+10,p),(P+10)/10**p),ch(dstr(P,Math.max(pa,pb)),P/10**Math.max(pa,pb)),ch(dstr(P-1,p),(P-1)/10**p)];
  if(r()<.3)return num(`${dstr(A,pa)} × ${dstr(B,pb)} =`,fx(v),{why:`${A} × ${B} = ${cm(P)}. There ${p===1?'is':'are'} ${p} decimal place${p>1?'s':''} in the factors, so the product is ${fx(v)}.`});
  return mc(`${dstr(A,pa)} × ${dstr(B,pb)} =`,ch(fx(v),v),ds,{sort:'v',why:`${A} × ${B} = ${cm(P)}. Count ${p} decimal place${p>1?'s':''} in the factors: ${fx(v)}.`});
});
S('ce3_grid',{std:'5.CE.3',cat:'CE',unit:[5],name:'Decimal multiplication models',nocalc:1},H=>{
  const a=ri(2,9),b=ri(2,9);if(a===b)return null;const vis=V.gridMul(a,b);
  if(!H||r()<.5)return mc(Q(`The grid is 1 whole. ${a} rows (tenths) and ${b} columns (tenths) are shaded. Which expression does the <b>dark overlap</b> show?`,vis),{h:`0.${a} × 0.${b}`},[{h:`${a} × 0.${b}`},{h:`0.${a} + 0.${b}`},{h:`0.${a} × ${b}`},{h:`${a} × ${b}`}],{why:`The overlap is ${a} tenths of ${b} tenths: 0.${a} × 0.${b} = ${fx(a*b/100)}.`});
  const v=a*b/100;return mc(Q('The grid is 1 whole. What product does the <b>dark overlap</b> show?',vis),ch(fx(v),v),[ch(fx((a+b)/10),(a+b)/10),ch(fx(a*b/10),a*b/10),ch(fx(a*b/1000),a*b/1000),ch(fx((100-a*b)/100),(100-a*b)/100)],{why:`${a} × ${b} = ${a*b} hundredths: 0.${a} × 0.${b} = ${fx(v)}.`});
});
S('ce3_div',{std:'5.CE.3',cat:'CE',unit:[5],name:'Divide decimals',nocalc:1},H=>{
  for(let t=0;t<40;t++){const tenths=H&&r()<.6;const d=tenths?ri(2,9)/10:ri(2,9);const qp=ri(1,2);const Qi=ri(H?11:2,H?999:99);if(Qi%10===0)continue;const q=Qi/10**qp;const D=rnd(q*d);
    const Ds=fx(D);const dp=(Ds.split('.')[1]||'').length;if(dp>2||(!tenths&&qp>dp+1))continue;if(Ds.replace('.','').replace(/^0+/,'').length>4)continue;
    const ds=[ch(fx(q*10),q*10),ch(fx(q/10),q/10),ch(fx(q+1),q+1),ch(fx(rnd(D*d)),D*d),ch(fx(q*100),q*100)];
    const why=tenths?`Multiply both by 10: ${fx(D*10)} ÷ ${fx(d*10)} = ${fx(q)}.`:`${Ds} ÷ ${d} = ${fx(q)}. Check: ${fx(q)} × ${d} = ${Ds}.`;
    if(r()<.3)return num(`${Ds} ÷ ${fx(d)} =`,fx(q),{why});
    return mc(`${Ds} ÷ ${fx(d)} =`,ch(fx(q),q),ds,{sort:'v',why});}
  return null;
});
S('ce3_money',{std:'5.CE.3',cat:'CE',unit:[5],name:'Decimal money problems'},H=>{
  const n=nm();const k=ri(2,H?4:3),p=ri(299,999)/100,c=ri(1299,2999)/100;const tot=rnd(k*p+c);const T=tot<50?50:100;const chg=rnd(T-tot);
  const it=pick([['shirts','shoes'],['notebooks','a backpack'],['books','a board game'],['T-shirts','a hat']]);
  return mc(`${n} buys ${k} ${it[0]} for ${money(p)} each and ${it[1]} for ${money(c)}. ${n} pays with a $${T} bill. How much change should ${n} get?`,ch(money(chg),chg),[ch(money(T-p-c),T-p-c),ch(money(tot),tot),ch(money(T-k*p),T-k*p),ch(money(chg+1),chg+1),ch(money(chg-1),chg-1)],{nonneg:1,sort:'v',why:`${k} × ${money(p)} = ${money(k*p)}; + ${money(c)} = ${money(tot)}; $${T}.00 − ${money(tot)} = ${money(chg)}.`});
});
S('ce3_estimate',{std:'5.CE.3',cat:'CE',unit:[5],name:'Estimate & place the decimal'},H=>{
  if(r()<.5){const a=ri(21,99)/10+ri(1,9)/100,b=ri(21,99)/10;const A=Math.round(a),B=Math.round(b);if(A===B)return null;const e=A*B;
    return mc(`Which is the <b>best estimate</b> of ${fx(a)} × ${fx(b)}?`,ch(String(e),e),[e*10,e/10,(A-1)*(B-1),A+B].map(x=>ch(fx(x),x)),{sort:'v',why:`Round to whole numbers: ${A} × ${B} = ${e}.`});}
  const A=ri(101,999),pa=2,B=ri(11,99),pb=1;if(A%10===0||B%10===0)return null;const P=A*B;const v=P/1000;
  return mc(`${dstr(A,pa)} × ${dstr(B,pb)} has the digits <b>${P}</b>. Use an estimate to place the decimal point. What is the product?`,ch(fx(v),v),[P/10000,P/100,P/10].map(x=>ch(fx(x),x)),{sort:'v',why:`${dstr(A,pa)} × ${dstr(B,pb)} ≈ ${Math.round(A/100)} × ${Math.round(B/10)} = ${Math.round(A/100)*Math.round(B/10)}, so the product is ${fx(v)}.`});
});
S('ce3_addsub',{std:'5.CE.3',cat:'CE',unit:[5],name:'Add & subtract decimals'},H=>{
  const n=nm();const k=ri(0,H?2:1);
  if(k===0){const a=ri(11,99)/10,b=ri(101,999)/100;const s=rnd(a+b);return num(`${n} ran ${fx(a)} km on Monday and ${fx(b)} km on Tuesday. How many kilometers did ${n} run in all?`,fx(s),{post:' km',why:`Line up the decimal points: ${a.toFixed(2)} + ${b.toFixed(2)} = ${s.toFixed(2)}.`});}
  if(k===1){const a=ri(5,20),b=ri(101,a*100-1)/100;const s=rnd(a-b);return num(`A bottle holds ${a} liters. ${n} pours out ${fx(b)} liters. How many liters are left?`,fx(s),{post:' L',why:`${a}.00 − ${b.toFixed(2)} = ${s.toFixed(2)} (annex zeros).`});}
  const a=ri(101,999)/100,b=ri(101,999)/100,c=ri(11,99)/10;const s=rnd(a+b-c);if(s<=0)return null;
  return num(`A bag had ${fx(a)} kg of rice. ${n} adds ${fx(b)} kg, then uses ${fx(c)} kg. How many kilograms are in the bag now?`,fx(s),{post:' kg',why:`${fx(a)} + ${fx(b)} = ${fx(a+b)}; − ${fx(c)} = ${fx(s)}.`});
});
S('ce3_divctx',{std:'5.CE.3',cat:'CE',unit:[5],name:'Decimal division in context'},H=>{
  if(r()<.5){const k=ri(2,6),each=ri(105,995)/100;const T=rnd(k*each);return num(`${money(T)} is shared equally by ${k} friends. How much does each friend get?`,money(each),{acc:[fx(each),each.toFixed(2)],why:`${money(T)} ÷ ${k} = ${money(each)}.`});}
  const piece=pick([0.2,0.25,0.4,0.5,0.3,0.6,0.75]);const cnt=ri(4,H?18:9);const L=rnd(piece*cnt);if(String(L).split('.')[1]?.length>2)return null;
  return num(`A ribbon is ${fx(L)} meters long. It is cut into pieces that are each ${fx(piece)} meter long. How many pieces are there?`,cnt,{why:`${fx(L)} ÷ ${fx(piece)} = ${cnt}.`});
});
/* ---- CE.4 order of operations ---- */
function ooEval(nums,ops,pl,pr,mode){ // mode: 'std' | 'l2r' (ignore precedence, keep parens) | 'flat' (ignore parens & precedence)
  let T=[];nums.forEach((n,i)=>{if(i===pl&&mode!=='flat')T.push('(');T.push(n);if(i===pr&&mode!=='flat')T.push(')');if(i<ops.length)T.push(ops[i]);});
  const steps=[];const ap=(a,o,b)=>o==='+'?a+b:o==='−'?a-b:o==='×'?a*b:(b===0||a%b)?NaN:a/b;
  const reduce=(seg)=>{seg=seg.slice();const lvl=mode==='std'?[['×','÷'],['+','−']]:[['×','÷','+','−']];for(const L of lvl){let i=1;while(i<seg.length){if(L.includes(seg[i])){const v=ap(seg[i-1],seg[i],seg[i+1]);steps.push(`${seg[i-1]} ${seg[i]} ${seg[i+1]}`);seg.splice(i-1,3,v);}else i+=2;}}return seg[0];};
  for(let g=0;g<5;g++){const a=T.indexOf('(');if(a<0)break;const b=T.indexOf(')',a);const v=reduce(T.slice(a+1,b));T.splice(a,b-a+1,v);}
  const v=reduce(T);return {v,steps};
}
function ooExpr(H){
  for(let t=0;t<400;t++){const n=H?ri(4,5):ri(3,4);const nums=Array.from({length:n},()=>ri(2,H?20:12));const ops=Array.from({length:n-1},()=>pick(['+','−','×','÷','+','×']));
    if(!ops.some(o=>o==='×'||o==='÷'))continue;let pl=-1,pr=-1;if(H||r()<.6){pl=ri(0,n-2);pr=ri(pl+1,Math.min(n-1,pl+2));if(pl===0&&pr===n-1)continue;}
    const e=ooEval(nums,ops,pl,pr,'std');if(!Number.isInteger(e.v)||e.v<0||e.v>150)continue;
    const okSteps=(()=>{let ok=true;e.steps.forEach(s=>{const m=s.split(' ');const a=+m[0],b=+m[2];if(a<0||b<0||!Number.isInteger(a)||!Number.isInteger(b))ok=false;if(m[1]==='×'&&(a>12&&b>12))ok=false;if(a>99&&m[1]==='×')ok=false;});return ok;})();if(!okSteps)continue;
    const l2r=ooEval(nums,ops,pl,pr,'l2r');if(l2r.v===e.v)continue;
    const str=nums.map((x,i)=>(i===pl?'(':'')+x+(i===pr?')':'')).reduce((s,x,i)=>s+(i?` ${ops[i-1]} `:'')+x,'');
    return {nums,ops,pl,pr,e,l2r,flat:ooEval(nums,ops,pl,pr,'flat'),str};}
  return null;
}
S('ce4_value',{std:'5.CE.4',cat:'CE',unit:[2],name:'Order of operations: value',nocalc:1},H=>{
  const x=ooExpr(H);if(!x)return null;const ds=[x.l2r.v,x.flat.v,x.e.v+ri(1,4),x.e.v-ri(1,4)].filter(v=>Number.isInteger(v)&&v>=0).map(v=>ch(String(v),v));
  if(r()<.3)return num(`What is the value of <b>${x.str}</b>?`,x.e.v,{why:`Steps: ${x.e.steps.join(' → ')}.`});
  return mc(`What is the value of <b>${x.str}</b>?`,ch(String(x.e.v),x.e.v),ds,{sort:'v',why:`Parentheses first, then × and ÷ left to right, then + and − left to right: ${x.e.steps.join(', then ')}.`});
});
S('ce4_step',{std:'5.CE.4',cat:'CE',unit:[2],name:'Order of operations: which step',nocalc:1},H=>{
  const x=ooExpr(H);if(!x||x.e.steps.length<3)return null;{const outside=x.ops.filter((o,i)=>(o==='×'||o==='÷')&&!(x.pl>=0&&i>=x.pl&&i<x.pr)).length;if(outside>1)return null;}const which=pick(H?[1,2,'last']:[0,1,'last']);const idx=which==='last'?x.e.steps.length-1:which;
  if(x.e.steps.filter(s=>s===x.e.steps[idx]).length>1)return null;const word=which==='last'?'LAST':['FIRST','SECOND','THIRD'][idx];
  const ds=[...x.e.steps.filter((s,i)=>i!==idx),...x.l2r.steps.slice(0,2),`${x.nums[0]} ${x.ops[0]} ${x.nums[1]}`,`${x.nums[1]} ${x.ops[1]} ${x.nums[2]}`].map(h=>({h}));
  return mc(`In <b>${x.str}</b>, which operation is done <b>${word}</b>?`,{h:x.e.steps[idx]},ds,{why:`Order: ${x.e.steps.map((s,i)=>`(${i+1}) ${s}`).join(', ')}.`});
});
S('ce4_parens',{std:'5.CE.4',cat:'CE',unit:[2],name:'Where do the parentheses go?',nocalc:1},H=>{
  for(let t=0;t<200;t++){const nums=Array.from({length:4},()=>ri(2,9));const ops=Array.from({length:3},()=>pick(['+','−','×']));if(!ops.includes('×'))continue;
    const places=[[0,1],[1,2],[2,3],[0,2],[1,3]].map(([a,b])=>{const e=ooEval(nums,ops,a,b,'std');const s=nums.map((x,i)=>(i===a?'(':'')+x+(i===b?')':'')).reduce((s,x,i)=>s+(i?` ${ops[i-1]} `:'')+x,'');const neg=e.steps.some(st=>{const m=st.split(' ');return m[1]==='−'&&+m[0]<+m[2];});return {a,b,v:neg?-1:e.v,s};}).filter(p=>Number.isInteger(p.v)&&p.v>=0);
    const plain=ooEval(nums,ops,-1,-1,'std').v;const good=places.filter(p=>p.v!==plain&&places.filter(q=>q.v===p.v).length===1);if(!good.length)continue;const T=pick(good);
    const others=[];places.filter(p=>p.v!==T.v).forEach(p=>{if(!others.some(q=>q.v===p.v))others.push(p);});if(others.length<3)continue;
    return mc(`Where should parentheses go to make this true?<br><b>${nums.map((x,i)=>x).reduce((s,x,i)=>s+(i?` ${ops[i-1]} `:'')+x,'')} = ${T.v}</b>`,{h:`${T.s} = ${T.v}`},others.map(p=>({h:`${p.s} = ${T.v}`})),{why:`${T.s} = ${T.v}. The other placements give ${others.slice(0,3).map(p=>p.v).join(', ')}.`});}
  return null;
});
/* ================= MEASUREMENT & GEOMETRY (5.MG.1 - 5.MG.3) ================= */
const CONV=[['meter','centimeters',100,'meters','centimeter'],['meter','millimeters',1000,'meters','millimeter'],['centimeter','millimeters',10,'centimeters','millimeter'],['kilometer','meters',1000,'kilometers','meter'],['liter','milliliters',1000,'liters','milliliter'],['kilogram','grams',1000,'kilograms','gram']];
S('mg1_convert',{std:'5.MG.1',cat:'MG',unit:[6],name:'Metric conversions (equivalence given)'},H=>{
  const c=pick(CONV);const [big,smallP,f,bigP]=c;const eq=`<i>(1 ${big} = ${cm(f)} ${smallP})</i>`;const k=H?ri(0,3):ri(0,1);
  if(k===0){const x=pick([ri(2,9),ri(11,99)/10,ri(2,15)]);const y=rnd(x*f);
    return mc(`${eq}<br>${fx(x)} ${bigP} = ___ ${smallP}`,ch(cm(y),y),[y/10,y*10,rnd(x*(f===10?100:10)),rnd(x/f)].map(v=>ch(cm(v),v)),{sort:'v',why:`Bigger unit → smaller unit: multiply by ${cm(f)}. ${fx(x)} × ${cm(f)} = ${cm(y)}.`});}
  if(k===1){const y=pick([ri(2,9)*f/10*ri(1,9),ri(11,99)*f/10]);const x=rnd(y/f);if(!y||x===Math.floor(x)&&r()<.3)return null;
    return mc(`${eq}<br>${cm(y)} ${smallP} = ___ ${bigP}`,ch(fx(x),x),[x*10,x/10,y*f,y-f].filter(v=>v>0).map(v=>ch(cm(v),v)),{sort:'v',why:`Smaller unit → bigger unit: divide by ${cm(f)}. ${cm(y)} ÷ ${cm(f)} = ${fx(x)}.`});}
  if(k===2){const g=pick([['kilogram','grams',1000,'kilograms','bag of apples','bag of oranges'],['liter','milliliters',1000,'liters','pitcher of juice','pitcher of lemonade']]);const a=ri(11,39)*100,b=ri(3,9)*100;const t=(a+b)/g[2];
    return mc(`<i>(1 ${g[0]} = 1,000 ${g[1]})</i><br>A ${g[4]} has ${cm(a)} ${g[1]}. A ${g[5]} has ${b} ${g[1]}. How many <b>${g[3]}</b> are there in all?`,ch(fx(t)+' '+g[3],t),[(a+b),(a+b)/100,t*10,a/1000+b].map(v=>ch(cm(v)+' '+g[3],v)),{sort:'v',why:`${cm(a)} + ${b} = ${cm(a+b)} ${g[1]}; ÷ 1,000 = ${fx(t)} ${g[3]}.`});}
  const L=ri(2,6)*100,p=pick([20,25,40,50]);if(L%p)return null;const n=L/p;
  return num(`<i>(1 meter = 100 centimeters)</i><br>A ribbon is ${fx(L/100)} meters long. It is cut into pieces that are each ${p} centimeters long. How many pieces?`,n,{why:`${fx(L/100)} m = ${L} cm. ${L} ÷ ${p} = ${n} pieces.`});
});
const UNITQ=[['the length of a pencil','centimeters'],['the mass of a bicycle','kilograms'],['the water in a bathtub','liters'],['a dose of cough medicine','milliliters'],['the distance between two cities','kilometers'],['the mass of a paper clip','grams'],['the thickness of a coin','millimeters'],['the height of a door','meters'],['the mass of a dog','kilograms'],['the juice in a small cup','milliliters'],['the length of a soccer field','meters'],['the mass of an apple','grams']];
const UNITS=['millimeters','centimeters','meters','kilometers','grams','kilograms','milliliters','liters'];
S('mg1_unit',{std:'5.MG.1',cat:'MG',unit:[6],name:'Best metric unit / estimate'},H=>{
  if(!H||r()<.5){const it=pick(UNITQ);const fam=it[1].includes('gram')?['grams','kilograms','milligrams']:it[1].includes('liter')?['milliliters','liters']:['millimeters','centimeters','meters','kilometers'];
    const ds=UNITS.filter(u=>u!==it[1]);const near=ds.filter(u=>fam.includes(u));const far=ds.filter(u=>!fam.includes(u));
    return mc(`Which unit is <b>most appropriate</b> to measure ${it[0]}?`,{h:it[1]},[...shuf(near),...shuf(far)].slice(0,3).map(h=>({h})),{why:`${it[1][0].toUpperCase()+it[1].slice(1)} fit the size of ${it[0]}.`});}
  const E=pick([['a paper clip','1 gram',['1 kilogram','100 grams','10 kilograms']],['a large watermelon','5 kilograms',['5 grams','50 grams','500 kilograms']],['a pencil','15 centimeters',['15 millimeters','15 meters','150 centimeters']],['a juice box','200 milliliters',['200 liters','2 milliliters','20 liters']],['a classroom door','2 meters',['2 centimeters','20 meters','2 kilometers']],['a bathtub of water','150 liters',['150 milliliters','15 milliliters','1,500 liters']]]);
  return mc(`Which is the <b>best estimate</b> for ${E[0]}?`,{h:E[1]},E[2].map(h=>({h})),{why:`${E[0][0].toUpperCase()+E[0].slice(1)}: about ${E[1]}.`});
});
S('mg2_volume',{std:'5.MG.2',cat:'MG',unit:[9],name:'Volume of a rectangular prism'},H=>{
  const l=ri(3,H?15:10),w=ri(2,H?9:6),h=ri(2,H?9:6);const u=pick(['in','cm','ft','m']);const V0=l*w*h;
  if(H&&r()<.4){return num(`A box shaped like a rectangular prism has a volume of ${V0} cubic ${u==='in'?'inches':u==='cm'?'centimeters':u==='ft'?'feet':'meters'}. It is ${l} ${u} long and ${w} ${u} wide. How tall is it?`,h,{post:' '+u,why:`V = l × w × h, so ${V0} = ${l} × ${w} × h = ${l*w} × h; h = ${V0} ÷ ${l*w} = ${h}.`});}
  return mc(Q('What is the volume of the rectangular prism?',V.prism(l,w,h,u)),ch(`${V0} cubic ${u}`,V0),[l+w+h,l*w,l*w+h,2*(l*w+l*h+w*h),l*h].map(v=>ch(`${v} cubic ${u}`,v)),{sort:'v',why:`V = l × w × h = ${l} × ${w} × ${h} = ${V0} cubic ${u}.`});
});
S('mg2_3part',{std:'5.MG.2',cat:'MG',unit:[9],name:'Volume, base area & perimeter'},H=>{
  const l=ri(4,10),w=ri(2,7),h=ri(2,6);if(l===w)return null;const V0=l*w*h,A=l*w,P=2*(l+w);if(A===P)return null;const u='ft';
  const f=(v,a,p)=>`Volume: ${v} cu ${u}<br>Area of base: ${a} sq ${u}<br>Perimeter of base: ${p} ${u}`;
  return mc(Q('Which choice shows the volume of the prism, the area of its base, and the perimeter of its base?',V.prism(l,w,h,u)),{h:f(V0,A,P)},[{h:f(V0,P,A)},{h:f(l+w+h,A,P)},{h:f(A*2,A,P)},{h:f(V0,A,l+w)}],{why:`Volume = ${l} × ${w} × ${h} = ${V0}. Base area = ${l} × ${w} = ${A}. Base perimeter = ${l} + ${w} + ${l} + ${w} = ${P}.`});
});
S('mg2_tri',{std:'5.MG.2',cat:'MG',unit:[9],name:'Area of a right triangle'},H=>{
  const b=ri(3,H?20:12),h=ri(3,H?16:10);if((b*h)%2)return null;const A=b*h/2;const u=pick(['cm','in','m']);
  if(H&&r()<.4)return num(`A right triangle has an area of ${A} square ${u==='cm'?'centimeters':u==='in'?'inches':'meters'}. Its base is ${b} ${u}. What is its height?`,h,{post:' '+u,why:`A = ½ × b × h, so ${A} = ½ × ${b} × h; ${b} × h = ${2*A}; h = ${h}.`});
  return mc(Q('What is the area of the right triangle?',V.rtri(b,h,u)),ch(`${A} sq ${u}`,A),[b*h,b+h,2*(b+h),A+b].map(v=>ch(`${v} sq ${u}`,v)),{sort:'v',why:`Area = ½ × base × height = ½ × ${b} × ${h} = ${A} square ${u}.`});
});
const PAV={Perimeter:['the fence needed to go around a garden','the trim around the edge of a bulletin board','the distance around a soccer field','the ribbon to go around the edge of a picture frame','the length of a path around a pond'],
  Area:['the carpet needed to cover a floor','the grass that covers a yard','the paper needed to cover a bulletin board','the tiles to cover a kitchen floor','the paint to cover a wall'],
  Volume:['the sand that fills a sandbox','the water a fish tank holds','the number of cubes that fill a box','the space inside a moving box','the soil that fills a planter']};
S('mg2_pav',{std:'5.MG.2',cat:'MG',unit:[9],name:'Perimeter, area or volume?'},H=>{
  const k=ri(0,2);const K=Object.keys(PAV);
  if(k===0){const t=pick(K);const s=pick(PAV[t]);return mc(`Finding <b>${s}</b> is an example of finding —`,{h:t},K.filter(x=>x!==t).concat(['Mass']).map(h=>({h})),{sort:'keep',why:`${s[0].toUpperCase()+s.slice(1)}: ${t==='Perimeter'?'distance around':t==='Area'?'surface covered':'space filled'} → ${t.toLowerCase()}.`});}
  if(k===1){const t=pick(K);return mc(`Which situation is about <b>${t.toLowerCase()}</b>?`,{h:pick(PAV[t])},K.filter(x=>x!==t).flatMap(x=>sample(PAV[x],2)).map(h=>({h})),{why:`${t}: ${t==='Perimeter'?'the distance around a figure':t==='Area'?'the surface a figure covers':'the space inside a solid'}.`});}
  const t=pick(K);const R=sample(PAV[t],ri(2,3)),W=K.filter(x=>x!==t).flatMap(x=>sample(PAV[x],2)).slice(0,6-R.length);
  return ms(`Select <b>ALL</b> the situations that use <b>${t.toLowerCase()}</b>.`,R,W,{why:`${t} situations: ${R.join('; ')}.`});
});
S('mg2_context',{std:'5.MG.2',cat:'MG',unit:[9],name:'Perimeter/area/volume word problems'},H=>{
  const n=nm();const k=ri(0,2);
  if(k===0){const l=ri(8,30),w=ri(5,20);return num(`${n} puts a fence around a rectangular garden that is ${l} feet long and ${w} feet wide. How many feet of fence are needed?`,2*(l+w),{post:' ft',why:`Perimeter = ${l} + ${w} + ${l} + ${w} = ${2*(l+w)} ft.`});}
  if(k===1){const l=ri(6,15),w=ri(5,12);return num(`A rectangular rug is ${l} feet long and ${w} feet wide. How many square feet of floor does it cover?`,l*w,{post:' sq ft',why:`Area = ${l} × ${w} = ${l*w} sq ft.`});}
  const l=ri(4,12),w=ri(3,8),h=ri(2,6);if(!H)return num(`A toy box is ${l} inches long, ${w} inches wide, and ${h} inches tall. What is its volume?`,l*w*h,{post:' cubic in.',why:`${l} × ${w} × ${h} = ${l*w*h} cubic inches.`});
  const c=ri(2,4);return num(`A fish tank is ${l} inches long, ${w} inches wide, and ${h*c} inches tall. Water fills it only ${h} inches high. How many more cubic inches of water are needed to fill it to the top?`,l*w*(h*c-h),{post:' cubic in.',why:`Full: ${l} × ${w} × ${h*c} = ${l*w*h*c}. Now: ${l} × ${w} × ${h} = ${l*w*h}. More: ${l*w*(h*c-h)}.`});
});
/* ---- MG.3 angles & triangles ---- */
const ANG=['acute','right','obtuse','straight'];
const angType=d=>d<90?'acute':d===90?'right':d<180?'obtuse':'straight';
S('mg3_angle',{std:'5.MG.3',cat:'MG',unit:[9],name:'Classify angles'},H=>{
  const t=pick(ANG);const d=t==='acute'?ri(20,80):t==='right'?90:t==='obtuse'?ri(100,165):180;
  if(H&&r()<.5){const q=r()<.5?`An angle measures <b>${d}°</b>. What type of angle is it?`:`Which could be the measure of an <b>${t}</b> angle?`;
    if(q.startsWith('An'))return mc(q,{h:t[0].toUpperCase()+t.slice(1)},ANG.filter(x=>x!==t).map(x=>({h:x[0].toUpperCase()+x.slice(1)})),{sort:'keep',why:`Acute < 90°, right = 90°, obtuse between 90° and 180°, straight = 180°.`});
    const others=ANG.filter(x=>x!==t).map(x=>x==='acute'?ri(20,80):x==='right'?90:x==='obtuse'?ri(100,165):180);return mc(q,ch(d+'°',d),others.map(v=>ch(v+'°',v)),{sort:'v',why:`A ${t} angle ${t==='acute'?'is less than 90°':t==='right'?'is exactly 90°':t==='obtuse'?'is between 90° and 180°':'is exactly 180°'}.`});}
  return mc(Q('What type of angle is shown?',V.angle(d)),{h:t[0].toUpperCase()+t.slice(1)},ANG.filter(x=>x!==t).map(x=>({h:x[0].toUpperCase()+x.slice(1)})),{sort:'keep',why:`This angle is ${t}: ${t==='acute'?'smaller than a right angle':t==='right'?'a square corner (90°)':t==='obtuse'?'bigger than a right angle but less than a straight line':'a straight line (180°)'}.`});
});
const TRIS={equilateral_acute:[[6,6,6],[8,8,8],[10,10,10],[9,9,9]],isosceles_acute:[[8,8,6],[10,10,7],[9,9,12],[13,13,10],[7,7,5]],isosceles_obtuse:[[6,6,10],[7,7,12],[5,5,9],[8,8,14]],isosceles_right:[[7],[5],[9],[6]],scalene_acute:[[6,7,8],[5,6,7],[7,8,9],[8,9,10]],scalene_right:[[3,4,5],[6,8,10],[5,12,13],[9,12,15]],scalene_obtuse:[[4,6,9],[5,7,10],[6,8,12],[3,5,7]]};
const angOpp=(a,b,c)=>Math.acos((b*b+c*c-a*a)/(2*b*c))*180/Math.PI;
function triPic(type,u){const s=pick(TRIS[type]);let vis,big;
  if(type==='isosceles_right'){const L=s[0];vis=V.tri(L*Math.SQRT2,L,L,{labels:[`${L} ${u}`,'',`${L} ${u}`],rightAt:0});}
  else{const so=s.slice().sort((a,b)=>b-a);const [a,b,c]=so;big=Math.round(angOpp(a,b,c));const right=type.endsWith('right');
    vis=V.tri(a,c,b,{labels:[`${b} ${u}`,`${a} ${u}`,`${c} ${u}`],rightAt:right?0:undefined,angles:!right&&type.endsWith('obtuse')?[big+'°','','']:undefined});}
  return vis;}
S('mg3_triangle',{std:'5.MG.3',cat:'MG',unit:[9],name:'Classify triangles (sides & angles)'},H=>{
  const type=pick(Object.keys(TRIS));const [sd,an]=type.split('_');const u='cm';const vis=triPic(type,u);
  const label=(s,a)=>`${s} and ${a}`;const all=[];['equilateral','isosceles','scalene'].forEach(s=>['acute','right','obtuse'].forEach(a=>{if(!(s==='equilateral'&&a!=='acute'))all.push([s,a]);}));
  const near=all.filter(x=>(x[0]===sd)!==(x[1]===an));const far=all.filter(x=>x[0]!==sd&&x[1]!==an);
  return mc(Q(`Which name describes this triangle by its <b>sides</b> and by its <b>angles</b>?`,vis),{h:label(sd,an)},[...shuf(near).slice(0,2),...shuf(far)].map(x=>({h:label(x[0],x[1])})),{why:`Sides: ${sd==='equilateral'?'all 3 equal':sd==='isosceles'?'2 equal sides':'no equal sides'} → ${sd}. Angles: ${an==='right'?'one right angle':an==='obtuse'?'one obtuse angle':'all angles less than 90°'} → ${an}.`});
});
S('mg3_missing',{std:'5.MG.3',cat:'MG',unit:[9],name:'Missing angle in a triangle'},H=>{
  let A,B;if(r()<.3){A=90;B=ri(28,62);}else{A=ri(30,110);B=ri(30,180-A-28);}const C=180-A-B;if(C<28)return null;
  const s=x=>Math.sin(x*Math.PI/180);const names=sample(['A','B','C','M','N','P','R','S','T','X','Y','Z'],3);
  const vis=V.tri(s(A),s(B),s(C),{angles:[A===90?'':A+'°',B+'°','?'],rightAt:A===90?0:undefined,names});
  const q=Q(`In triangle ${names.join('')}, what is the measure of angle ${names[2]}?`,vis);
  if(r()<.3)return num(q,C,{post:'°',acc:[String(C)],why:`The angles of a triangle add to 180°. 180 − ${A} − ${B} = ${C}.`});
  return mc(q,ch(C+'°',C),[180-A,180-B,90,A+B,A,B,360-A-B].filter(v=>v>0&&v<180).map(v=>ch(v+'°',v)),{sort:'v',why:`180° − ${A}° − ${B}° = ${C}°.`});
});
const TT=['An equilateral triangle is also an isosceles triangle.','A right triangle has exactly one right angle.','A scalene triangle has no congruent sides.','An equilateral triangle has three acute angles.','The angles of any triangle add up to 180°.','An obtuse triangle has exactly one obtuse angle.','An isosceles triangle has at least two congruent sides.'];
const TF=['A triangle can have two right angles.','An obtuse triangle has two obtuse angles.','Every right triangle is scalene.','An isosceles triangle cannot be a right triangle.','A scalene triangle has two congruent sides.','An equilateral triangle can have a right angle.','The angles of a triangle add up to 360°.','An acute triangle has one acute angle and two obtuse angles.'];
S('mg3_true',{std:'5.MG.3',cat:'MG',unit:[9],name:'True statements about triangles'},H=>{
  if(H&&r()<.5){return ms('Select <b>ALL</b> the true statements.',sample(TT,ri(2,3)),sample(TF,3),{why:'Equilateral triangles are also isosceles; a triangle has at most one right or obtuse angle; angles add to 180°.'});}
  const not=r()<.4;if(not)return mc('Which statement is <b>NOT</b> true?',{h:pick(TF)},sample(TT,3).map(h=>({h})),{why:'A triangle can have at most one right or obtuse angle, and its angles add to 180°.'});
  return mc('Which statement is true?',{h:pick(TT)},sample(TF,3).map(h=>({h})),{why:'Check each statement against the triangle facts: 180° total, at most one right/obtuse angle, equilateral is also isosceles.'});
});
/* ================= PROBABILITY & STATISTICS (5.PS.1 - 5.PS.3) ================= */
function stemSet(H){const n=H?ri(12,16):ri(9,12);const lo=pick([2,3,4,5,6]);const span=H?3:2;const d=[];for(let i=0;i<n;i++)d.push(ri(lo*10,(lo+span)*10-1));
  if(r()<.8){d[1]=d[0];}return d;}
S('ps1_stem_read',{std:'5.PS.1',cat:'PS',unit:[10,1],name:'Read a stem-and-leaf plot'},H=>{
  const d=stemSet(H);const rows=stemData(d);const s0=rows[0][0],l0=rows[0][1][0];const ctx=pick([['Quiz Scores','scores'],['Points Scored','games'],['Minutes Read','days'],['Jump-Rope Jumps','students']]);
  const vis=V.stem(rows,s0,l0,{title:ctx[0]});const sorted=d.slice().sort((a,b)=>a-b);const k=ri(0,H?4:3);
  if(k===0){const X=pick(d);const c=d.filter(v=>v>X).length;const c2=d.filter(v=>v>=X).length;if(c===c2)return null;
    return mc(Q(`How many ${ctx[1]} had values <b>greater than</b> ${X}?`,vis),ch(String(c),c),[c2,c+1,d.length-c,c-1].filter(v=>v>=0).map(v=>ch(String(v),v)),{sort:'v',why:`Count the leaves that make numbers above ${X} (not ${X} itself): ${c}.`});}
  if(k===1){const X=pick(d);const c=d.filter(v=>v>=X).length;const c1=d.filter(v=>v>X).length;if(c===c1)return null;
    return mc(Q(`How many ${ctx[1]} had values of <b>at least</b> ${X}?`,vis),ch(String(c),c),[c1,c+1,d.length-c,c-1].filter(v=>v>=0).map(v=>ch(String(v),v)),{sort:'v',why:`"At least ${X}" includes ${X}: ${c}.`});}
  if(k===2){const R=sorted[sorted.length-1]-sorted[0];return num(Q('What is the <b>range</b> of the data?',vis),R,{why:`Greatest ${sorted[sorted.length-1]} − least ${sorted[0]} = ${R}.`});}
  if(k===3){return num(Q('How many data values are shown in the plot?',vis),d.length,{why:`Count every leaf: ${d.length}.`});}
  if(d.length%2===0)d.pop();const rows2=stemData(d);const s2=d.slice().sort((a,b)=>a-b);const med=s2[(s2.length-1)/2];
  return num(Q('What is the <b>median</b> of the data?',V.stem(rows2,rows2[0][0],rows2[0][1][0],{title:ctx[0]})),med,{why:`${s2.length} values in order; the middle one (#${(s2.length+1)/2}) is ${med}.`});
});
S('ps1_stem_build',{std:'5.PS.1',cat:'PS',unit:[10,1],name:'Choose the correct stem-and-leaf plot'},H=>{
  const d=stemSet(0).slice(0,H?10:8);const rows=stemData(d);const k=(x)=>x.map(r=>r[0]+':'+r[1].join('')).join('|');
  const variants=[];const drop=d.slice();const dup=d.findIndex((v,i)=>d.indexOf(v)!==i);if(dup>=0){drop.splice(dup,1);variants.push(stemData(drop));}
  const miss=d.slice();miss.splice(ri(0,miss.length-1),1);variants.push(stemData(miss));
  const shift=d.slice();const j=ri(0,shift.length-1);shift[j]=shift[j]+10;variants.push(stemData(shift));
  const extra=d.concat([ri(rows[0][0]*10,rows[rows.length-1][0]*10+9)]);variants.push(stemData(extra));
  const swap=d.map(v=>v===d[0]?(v%10)*10+Math.floor(v/10):v);if(swap.every(v=>v>=10&&v<100))variants.push(stemData(swap));
  const seen=new Set([k(rows)]);const ds=[];variants.forEach(v=>{if(!seen.has(k(v))){seen.add(k(v));ds.push({h:V.stem(v,rows[0][0],rows[0][1][0])});}});
  const ctx=pick(['pretzels in each bag','pages read each day','points scored in each game','minutes spent practicing']);
  return mc(`The list shows the number of ${ctx}:<br><b>${d.join(', ')}</b><br>Which stem-and-leaf plot shows these data?`,{h:V.stem(rows,rows[0][0],rows[0][1][0])},ds,{why:'Every value needs its own leaf, even repeated values, and the leaves go in order from least to greatest.'});
});
S('ps1_lineplot',{std:'5.PS.1',cat:'PS',unit:[10,1],name:'Line plots'},H=>{
  let labels,vals;if(H&&r()<.5){labels=['0','1/4','1/2','3/4','1'];vals=[0,.25,.5,.75,1];}else{const s=ri(0,3);labels=[];vals=[];for(let i=0;i<6;i++){labels.push(String(s+i));vals.push(s+i);}}
  const cnt=labels.map(()=>ri(0,5));if(cnt.filter(c=>c>0).length<3)return null;const N=cnt.reduce((a,b)=>a+b,0);
  const ctx=vals[1]===.25?['Rainfall (inches)','days of rain','inches of rain']:pick([['Books Read','students','books'],['Goals Scored','games','goals'],['Pets Owned','students','pets']]);
  const vis=V.lineplot(labels,cnt,{title:ctx[0]});const k=ri(0,H?3:2);
  if(k===0)return num(Q(`Each X stands for 1 of the ${ctx[1]}. How many ${ctx[1]} are shown?`,vis),N,{why:`Count all the Xs: ${N}.`});
  if(k===1){const i=cnt.indexOf(Math.max(...cnt));if(cnt.filter(c=>c===cnt[i]).length>1)return null;
    return mc(Q(`Which value appears <b>most often</b>?`,vis),{h:labels[i]},labels.filter((_,j)=>j!==i).map(h=>({h})),{sort:'keep',why:`The tallest stack of Xs is at ${labels[i]} (${cnt[i]} Xs). That value is the mode.`});}
  if(k===2){const i=ri(0,5)%labels.length,j=(i+ri(1,labels.length-1))%labels.length;if(cnt[i]===cnt[j])return null;const [a,b]=cnt[i]>cnt[j]?[i,j]:[j,i];
    return num(Q(`How many more ${ctx[1]} had ${labels[a]} than ${labels[b]}?`,vis),cnt[a]-cnt[b],{why:`${cnt[a]} − ${cnt[b]} = ${cnt[a]-cnt[b]}.`});}
  const tot=cnt.reduce((s,c,i)=>s+c*vals[i],0);const T=vals[1]===.25?fh(fr(Math.round(tot*4),4)):String(tot);
  return mc(Q(`What is the <b>total</b> number of ${ctx[2]} shown on the line plot?`,vis),ch(T,tot),[ch(String(N),N),ch(fh(fr(Math.round(tot*4)+1,4)),tot+.25),ch(String(Math.max(...cnt)),Math.max(...cnt)),ch(fh(fr(Math.round(tot*4)+4,4)),tot+1)],{sort:'v',why:`Add value × number of Xs for each value: total = ${T}.`});
});
/* ---- PS.2 mean, median, mode, range ---- */
function meanSet(n,lo,hi){for(let t=0;t<200;t++){const a=Array.from({length:n},()=>ri(lo,hi));const s=a.reduce((x,y)=>x+y,0);if(s%n===0)return a;}return null;}
const median=a=>{const s=a.slice().sort((x,y)=>x-y);const n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;};
const modes=a=>{const c={};a.forEach(x=>c[x]=(c[x]||0)+1);const m=Math.max(...Object.values(c));return m===1?[]:Object.keys(c).filter(k=>c[k]===m).map(Number);};
S('ps2_mean',{std:'5.PS.2',cat:'PS',unit:[10],name:'Find the mean'},H=>{
  const n=H?ri(5,6):ri(4,5);const a=meanSet(n,H?28:4,H?95:30);if(!a)return null;const m=a.reduce((x,y)=>x+y,0)/n;const S0=m*n;const R=Math.max(...a)-Math.min(...a);const md=median(a);
  const ctx=pick(['points scored in '+n+' games','books read by '+n+' students','minutes of practice on '+n+' days','dollars saved in '+n+' weeks']);
  return mc(`The numbers show ${ctx}:<br><b>${a.join(', ')}</b><br>What is the <b>mean</b>?`,ch(String(m),m),[R,md,S0,m+1,m-1].filter(v=>Number.isInteger(v)).map(v=>ch(String(v),v)),{sort:'v',why:`Sum = ${a.join(' + ')} = ${S0}. ${S0} ÷ ${n} = ${m}.`});
});
const DEF=[['the mean','the fair share: the amount each would get if the total were shared equally'],['the median','the middle number when the data are in order'],['the mode','the number that appears most often'],['the range','the difference between the greatest and least numbers']];
S('ps2_concept',{std:'5.PS.2',cat:'PS',unit:[10],name:'Mean as fair share & vocabulary'},H=>{
  if(r()<.5){const n=nm();const towers=meanSet(4,3,12);if(!towers)return null;const m=towers.reduce((a,b)=>a+b,0)/4;
    return mc(`${n} has 4 towers of cubes with ${towers.join(', ')} cubes. ${n} moves cubes until every tower has the <b>same</b> number of cubes. The number of cubes in each tower now represents the —`,{h:'mean (fair share)'},[{h:'median'},{h:'mode'},{h:'range'}],{sort:'keep',why:`Leveling out to equal amounts is the mean as a fair share: ${towers.reduce((a,b)=>a+b,0)} ÷ 4 = ${m} cubes each.`});}
  const d=pick(DEF);return mc(`Which describes <b>${d[0]}</b> of a set of data?`,{h:d[1][0].toUpperCase()+d[1].slice(1)},DEF.filter(x=>x!==d).map(x=>({h:x[1][0].toUpperCase()+x[1].slice(1)})),{why:`${d[0][0].toUpperCase()+d[0].slice(1)} is ${d[1]}.`});
});
S('ps2_mmr',{std:'5.PS.2',cat:'PS',unit:[10],name:'Median, mode & range'},H=>{
  const n=H?pick([6,7,8]):pick([5,7]);const a=Array.from({length:n},()=>ri(10,60));const k=ri(0,2);const s=a.slice().sort((x,y)=>x-y);
  if(k===0){const m=median(a);if(!Number.isInteger(m*2))return null;return num(`Find the <b>median</b>: ${a.join(', ')}`,fx(m),{why:`In order: ${s.join(', ')}. ${n%2?'The middle number is '+m:'The two middle numbers are '+s[n/2-1]+' and '+s[n/2]+'; halfway between them is '+fx(m)}.`});}
  if(k===1){const M=modes(a);if(M.length>1)return null;const ans=M.length?String(M[0]):'no mode';
    return mc(`What is the <b>mode</b> of these data? ${a.join(', ')}`,{h:ans},[{h:'no mode'},{h:'0'},{h:String(s[Math.floor(n/2)])},{h:String(s[n-1])},{h:String(s[0])}],{why:M.length?`${M[0]} appears most often.`:`Every number appears only once, so there is no mode (not 0).`});}
  const R=s[n-1]-s[0];return mc(`What is the <b>range</b> of these data? ${a.join(', ')}`,ch(String(R),R),[s[n-1],s[0],s[n-1]+s[0],R+10,median(a)].filter(Number.isInteger).map(v=>ch(String(v),v)),{sort:'v',why:`Greatest − least: ${s[n-1]} − ${s[0]} = ${R}.`});
});
S('ps2_select',{std:'5.PS.2',cat:'PS',unit:[10],name:'Select all true statements (data)'},H=>{
  const who=sample(NAMES,4);const a=meanSet(4,1,9);if(!a)return null;const m=a.reduce((x,y)=>x+y,0)/4,R=Math.max(...a)-Math.min(...a),md=median(a);const M=modes(a);
  const t=[`The mean is $${m}.`,`The range is $${R}.`,`If they share all the money equally, each gets $${m}.`];if(Number.isInteger(md))t.push(`The median is $${md}.`);
  const f=[`The mean is $${m+1}.`,`The range is $${R+2}.`,`If they share all the money equally, each gets $${m+2}.`,`The range is $${Math.max(...a)}.`];
  if(M.length===0)t.push('The data have no mode.');else f.push('The data have no mode.');
  return ms(Q('The table shows how much money four friends have. Select <b>ALL</b> the true statements.',V.table(['Friend','Money'],who.map((w,i)=>[w,'$'+a[i]]))),sample(t,ri(2,3)),sample(f,3),{why:`Total $${m*4} ÷ 4 = $${m} (mean / fair share). Range: $${Math.max(...a)} − $${Math.min(...a)} = $${R}.`});
});
S('ps2_missing',{std:'5.PS.2',cat:'PS',unit:[10],name:'Missing value from the mean (Advanced)'},H=>{
  const n=ri(4,5);const m=ri(70,92);const a=Array.from({length:n-1},()=>ri(m-12,m+12));const x=m*n-a.reduce((s,v)=>s+v,0);if(x<50||x>100)return null;
  return num(`${nm()} has ${n} test scores. The mean is <b>${m}</b>. Four... of the scores are ${a.join(', ')}. What is the missing score?`.replace('Four... of the scores',n-1===4?'Four of the scores':'Three of the scores'),x,{why:`Total must be ${m} × ${n} = ${m*n}. ${m*n} − (${a.join(' + ')}) = ${x}.`});
});
/* ---- PS.3 probability & counting ---- */
S('ps3_count',{std:'5.PS.3',cat:'PS',unit:[10],name:'Counting outcomes (FCP)'},H=>{
  const sets=[['shirts',ri(2,4)],['pants',ri(2,3)],['hats',ri(2,3)]];const use=H?sets:sets.slice(0,2);const P=use.reduce((s,x)=>s*x[1],1);if(P>24)return null;const Sm=use.reduce((s,x)=>s+x[1],0);
  const q=H?`${nm()} has ${use.map(x=>x[1]+' '+x[0]).join(', ').replace(/, ([^,]*)$/,' and $1')}. An outfit is 1 shirt, 1 pair of pants, and 1 hat. How many different outfits are possible?`:`A lunch special has ${use[0][1]} sandwiches and ${use[1][1]} drinks. A meal is 1 sandwich and 1 drink. How many different meals are possible?`;
  return mc(q,ch(String(P),P),[Sm,P+use[0][1],use[0][1]*use[0][1],P*2,P-1].map(v=>ch(String(v),v)),{sort:'v',why:`Multiply the choices: ${use.map(x=>x[1]).join(' × ')} = ${P}. (Adding gives ${Sm}, which is not right.)`});
});
S('ps3_list',{std:'5.PS.3',cat:'PS',unit:[10],name:'Sample space lists'},H=>{
  const A=sample(['Red','Blue','Green','Yellow'],ri(2,3)),B=sample(['Reader','Writer','Speaker'],H?3:2);const all=[];A.forEach(a=>B.forEach(b=>all.push(`${a}–${b}`)));
  const L=x=>x.join(', ');const miss=all.slice();miss.splice(ri(0,miss.length-1),1);const one=A.map((a,i)=>`${a}–${B[i%B.length]}`);const dup=all.slice();const di=ri(1,dup.length-1);dup[di]=dup[di-1];
  return mc(`Each team gets one color (${A.join(', ')}) and one job (${B.join(', ')}). Which list shows <b>all</b> the possible combinations?`,{h:L(all)},[{h:L(miss)},{h:L(one)},{h:L(dup)}],{why:`${A.length} colors × ${B.length} jobs = ${all.length} combinations. Only the correct list has all ${all.length}, with no repeats.`});
});
S('ps3_prob',{std:'5.PS.3',cat:'PS',unit:[10],name:'Probability as a fraction'},H=>{
  if(H&&r()<.4){const want=pick(['an even number','a number greater than 4','a 1 or a 2']);const fav=want==='an even number'?3:want==='a number greater than 4'?2:2;const P=fr(fav,12);
    return mc(`A coin is flipped and a number cube (1–6) is rolled. What is the probability of getting <b>heads</b> and ${want}?`,ch(fh(P),fv(P)),[ch(F(fav,6),fav/6),ch(F(1,2),.5),ch(F(fav+1,12),(fav+1)/12),ch(F(1,12),1/12)],{why:`Sample space: 2 × 6 = 12 outcomes. Heads with ${want}: ${fav} outcomes. ${fav}/12 = ${fh(P)}.`});}
  const cols=sample(['Red','Blue','Green','Yellow'],3);const c=cols.map(()=>ri(1,6));const T=c.reduce((a,b)=>a+b,0);const i=ri(0,2);const P=fr(c[i],T);
  if(r()<.5){const it=pick(['marbles','tiles','cubes']);return mc(`A bag has ${cols.map((x,j)=>c[j]+' '+x.toLowerCase()).join(', ').replace(/, ([^,]*)$/,' and $1')} ${it}. ${nm()} picks one without looking. What is the probability it is <b>${cols[i].toLowerCase()}</b>?`,ch(fh(P,false),fv(P)),[ch(F(c[i],T-c[i]),c[i]/(T-c[i])),ch(F(1,3),1/3),ch(F(T-c[i],T),(T-c[i])/T),ch(F(c[i],T+1),c[i]/(T+1))],{why:`${c[i]} ${cols[i].toLowerCase()} out of ${T} in all: ${F(c[i],T)}${gcd(c[i],T)>1?' = '+fh(P,false):''}.`});}
  const n=pick([4,6,8]);const secs=[];const k=ri(1,n-1);for(let j=0;j<n;j++)secs.push(j<k?cols[0]:pick(cols.slice(1)));const sp=shuf(secs);const P2=fr(k,n);
  return mc(Q(`The spinner has ${n} equal sections. What is the probability of spinning <b>${cols[0]}</b>?`,V.spinner(sp)),ch(fh(P2,false),fv(P2)),[ch(F(k,n-k),k/(n-k)),ch(F(1,cols.length),1/cols.length),ch(F(n-k,n),(n-k)/n),ch(F(1,n),1/n)],{why:`${k} of the ${n} equal sections are ${cols[0]}: ${F(k,n)}${gcd(k,n)>1?' = '+fh(P2,false):''}.`});
});
/* ================= PATTERNS, FUNCTIONS & ALGEBRA (5.PFA.1, 5.PFA.2) ================= */
const ordn=n=>n+(n%100>=11&&n%100<=13?'th':(['th','st','nd','rd'][n%10]||'th'));
function patSeq(H){ // single-operation pattern
  const k=ri(0,H?5:3);
  if(k===0){const d=ri(3,H?125:12),s=ri(2,60);return {t:i=>s+i*d,rule:`Add ${d}`,op:'+',d};}
  if(k===1){const d=ri(3,H?125:12),s=d*10+ri(20,400);return {t:i=>s-i*d,rule:`Subtract ${d}`,op:'−',d};}
  if(k===2){const m=pick([2,3]),s=ri(1,5);return {t:i=>s*m**i,rule:`Multiply by ${m}`,op:'×',d:m,geo:1};}
  if(k===3){const m=2,e=ri(3,12);return {t:i=>e*2**(5-i),rule:`Divide by ${m}`,op:'÷',d:m,geo:1,len:5};}
  if(k===4){const d=pick([0.25,0.5,0.75,1.5,0.2,0.4,1.25]),s=pick([0.5,1,1.25,2,2.5,3]);return {t:i=>rnd(s+i*d),rule:`Add ${fx(d)}`,op:'+',d,dec:1};}
  const d=pick([{n:1,d:4},{n:1,d:2},{n:3,d:4},{n:2,d:3},{n:1,d:3}]),s={n:1,d:d.d};return {t:i=>fadd(s,{n:d.n*i,d:d.d}),rule:`Add ${F(d.n,d.d)}`,op:'+',d,frac:1};
}
const showT=(p,i)=>p.frac?fh(p.t(i)):cm(p.t(i));
const valT=(p,i)=>p.frac?fv(p.t(i)):p.t(i);
S('pfa1_term',{std:'5.PFA.1',cat:'PFA',unit:[2],name:'Extend a pattern (nth term)'},H=>{
  const p=patSeq(H);if(p.geo&&!H)return null;const shown=4;const N=p.geo?6:pick([6,7,8,H?10:7]);if(p.geo&&p.op==='÷')return null;
  const v=valT(p,N-1);if(v<0||!isFinite(v))return null;
  const ds=[N-2,N,shown,N+1].map(i=>ch(showT(p,i),valT(p,i)));if(!p.frac&&!p.dec)ds.push(ch(cm(p.op==='−'?p.t(0)+p.d*(N-1):p.t(0)-p.d*(N-1)),p.op==='−'?p.t(0)+p.d*(N-1):-1));
  const seq=[0,1,2,3].map(i=>showT(p,i)).join(', ');
  if(r()<.25&&!p.frac)return num(`The pattern continues in the same way. What is the <b>${ordn(N)}</b> number?<br><b>${seq}, …</b>`,p.dec?fx(v):v,{why:`Rule: ${p.rule}. Keep going to term ${N}: ${[...Array(N).keys()].map(i=>showT(p,i)).join(', ')}.`});
  return mc(`The pattern continues in the same way. What is the <b>${ordn(N)}</b> number?<br><b>${seq}, …</b>`,ch(showT(p,N-1),v),ds,{nonneg:1,sort:'v',why:`Rule: ${p.rule}. Terms: ${[...Array(N).keys()].map(i=>showT(p,i)).join(', ')}.`});
});
S('pfa1_rule',{std:'5.PFA.1',cat:'PFA',unit:[2],name:'Find the rule'},H=>{
  const p=patSeq(H);const L=p.len||5;const seq=[...Array(L).keys()].map(i=>showT(p,i)).join(', ');
  const alt=[];const dd=p.frac?F(p.d.n,p.d.d):fx(p.d);
  if(p.op==='+'){alt.push(`Subtract ${dd}`,`Multiply by ${p.dec||p.frac?2:pick([2,3])}`);}
  if(p.op==='−'){alt.push(`Add ${dd}`,`Divide by 2`);}
  if(p.op==='×'){alt.push(`Add ${p.t(1)-p.t(0)}`,`Divide by ${p.d}`);}
  if(p.op==='÷'){alt.push(`Subtract ${p.t(0)-p.t(1)}`,`Multiply by 2`);}
  if(!p.frac&&!p.dec)alt.push(`${p.op==='−'||p.op==='÷'?'Subtract':'Add'} ${p.op==='×'||p.op==='÷'?p.d+1:p.d+pick([1,2,-1])}`);
  alt.push(`${p.op==='+'?'Add':p.op==='−'?'Subtract':p.op==='×'?'Multiply by':'Divide by'} ${p.frac?F(p.d.n,p.d.d*2):p.dec?fx(p.d*2):p.op==='×'||p.op==='÷'?p.d+2:p.d*2}`);
  return mc(`What is the rule for this pattern?<br><b>${seq}</b>`,{h:p.rule},alt.map(h=>({h})),{why:`Each number ${p.op==='+'?'goes up by':p.op==='−'?'goes down by':p.op==='×'?'is multiplied by':'is divided by'} ${dd}.`});
});
S('pfa1_table',{std:'5.PFA.1',cat:'PFA',unit:[2],name:'Input/output tables in context'},H=>{
  const u=H?pick([1.25,2.5,4.5,6,8,12]):pick([3,4,5,6,8,9]);const ins=[2,3,5];const x=pick([7,8,9]);const last=11;const item=pick([['Pounds of apples','Cost'],['Number of tickets','Cost'],['Packs of cards','Cost']]);
  const vis=V.table([item[0],item[1]],[...ins.map(i=>[i,money(u*i)]),[x,'?'],[last,money(u*last)]]);
  if(r()<.4)return num(Q(`The table shows a rule. What is the cost for <b>${x}</b>?`,vis),money(u*x),{acc:[fx(u*x),(u*x).toFixed(2)],why:`Each one costs ${money(u)} (${money(u*2)} ÷ 2). ${x} × ${money(u)} = ${money(u*x)}.`});
  return mc(Q(`Which is a way to find the cost for <b>${x}</b>?`,vis),{h:`Multiply ${money(u)} by ${x}`},[{h:`Add ${money(u)} to ${money(u*5)}`},{h:`Subtract ${money(u*5)} from ${money(u*last)}`},{h:`Divide ${money(u*5)} by ${x}`},{h:`Multiply ${money(u*2)} by ${x}`}],{why:`The unit price is ${money(u)} (${money(u*2)} ÷ 2), so ${x} cost ${x} × ${money(u)} = ${money(u*x)}.`});
});
S('pfa1_inout',{std:'5.PFA.1',cat:'PFA',unit:[2],name:'Function machine: missing input/output'},H=>{
  const op=pick(['+','−','×','÷']);let d=op==='+'||op==='−'?ri(3,H?45:15):ri(2,H?12:9);if(H&&op==='+'&&r()<.4)d=pick([0.5,1.5,2.25,0.75]);
  const f=x=>op==='+'?rnd(x+d):op==='−'?x-d:op==='×'?x*d:x/d;
  const ins=sample(op==='÷'?[1,2,3,4,5,6,7,8,9,10].map(x=>x*d):[...Array(op==='−'?20:15).keys()].map(x=>x+(op==='−'?d+1:1)),5).sort((a,b)=>a-b);const outs=ins.map(f);
  const miss=ri(0,4);const missIn=H&&r()<.5;const showIn=ins.map((x,i)=>i===miss&&missIn?'?':fx(x)),showOut=outs.map((x,i)=>i===miss&&!missIn?'?':fx(x));
  const rule=`${op==='+'?'Add':op==='−'?'Subtract':op==='×'?'Multiply by':'Divide by'} ${fx(d)}`;
  return num(Q(`The rule is <b>${rule}</b>. What number goes in place of the <b>?</b>`,V.ioTable('Input','Output',showIn,showOut)),fx(missIn?ins[miss]:outs[miss]),{why:missIn?`Work backward: undo "${rule}" on ${fx(outs[miss])} to get ${fx(ins[miss])}.`:`${fx(ins[miss])} → ${rule.toLowerCase()} → ${fx(outs[miss])}.`});
});
/* ---- PFA.2 variables & equations ---- */
const jsOf=s=>s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/(\d)\s*([a-z])/g,'$1*$2');
function eqHolds(eq,v,val){const [L,R]=eq.split('=');const f=x=>Function(v,`return (${jsOf(x)})`)(val);return Math.abs(f(L)-f(R))<1e-9;}
const STORY={
  '÷':(a,b,x,v)=>[`${b} pillows cost $${a} in all. Each pillow costs the same amount. Let <i>${v}</i> be the cost of one pillow.`,`${a} stickers are shared equally among ${b} friends. Let <i>${v}</i> be the number each friend gets.`,`${nm()} mows ${a} lawns over ${b} days, the same number each day. Let <i>${v}</i> be the lawns mowed each day.`],
  '×':(a,b,x,v)=>[`${nm()} buys ${b} packs of cards with ${a} cards in each pack. Let <i>${v}</i> be the total number of cards.`,`There are ${b} rows of chairs with ${a} chairs in each row. Let <i>${v}</i> be the number of chairs.`],
  '+':(a,b,x,v)=>[`${nm()} had ${a} marbles and then got ${b} more. Let <i>${v}</i> be the number of marbles now.`,`A team scored ${a} points in the first half and ${b} points in the second half. Let <i>${v}</i> be the total points.`],
  '−':(a,b,x,v)=>[`${nm()} had ${a} trading cards and gave away ${b}. Let <i>${v}</i> be the number of cards left.`,`A book has ${a} pages. ${nm()} has read ${b} pages. Let <i>${v}</i> be the number of pages left to read.`]};
S('pfa2_equation',{std:'5.PFA.2',cat:'PFA',unit:[2],name:'Story → equation'},H=>{
  const v=pick(['d','n','x','c','p','m']);
  if(H&&r()<.5){const b=ri(8,30),x=ri(10,60);const a=x+b;const who=nm();const eqs=[`${v} − ${b} = ${x}`,`${b} − ${v} = ${x}`,`${v} + ${x} = ${b}`,`${v} = ${x} − ${b}`];
    if(!eqHolds(eqs[0],v,a)||eqs.slice(1).some(e=>eqHolds(e,v,a)))return null;
    return mc(`${who} had some stickers. After giving away ${b} stickers, ${who} had ${x} left. Let <i>${v}</i> be the number of stickers ${who} had at the start. Which equation can be used to find <i>${v}</i>?`,{h:eqs[0]},eqs.slice(1).map(h=>({h})),{why:`Start (${v}) minus ${b} given away equals ${x} left: ${eqs[0]}. So ${v} = ${a}.`});}
  const op=pick(['÷','×','+','−']);let a,b,val;if(op==='÷'){b=ri(3,9);val=ri(4,15);a=b*val;}else if(op==='×'){a=ri(4,15);b=ri(3,9);val=a*b;}else if(op==='+'){a=ri(12,60);b=ri(5,40);val=a+b;}else{a=ri(30,90);b=ri(5,a-5);val=a-b;}
  const st=pick(STORY[op](a,b,0,v));const right=`${v} = ${a} ${op} ${b}`;const others=['÷','×','+','−'].filter(o=>o!==op).map(o=>`${v} = ${o==='÷'||o==='−'?(op==='÷'?a:Math.max(a,b)):a} ${o} ${o==='÷'||o==='−'?(op==='÷'?b:Math.min(a,b)):b}`);
  if(op==='−')others.push(`${v} = ${b} − ${a}`);if(op==='÷')others.push(`${v} = ${b} ÷ ${a}`);
  if(!eqHolds(right,v,val)||others.some(e=>eqHolds(e,v,val)))return null;
  return mc(`${st} Which equation can be used to find <i>${v}</i>?`,{h:right},others.map(h=>({h})),{why:`${right}, so ${v} = ${val}.`});
});
const PHR=[['the product of {a} and a number <i>n</i>',a=>`${a} × n`,a=>[`${a} + n`,`n ÷ ${a}`,`${a} − n`]],['the sum of a number <i>n</i> and {a}',a=>`n + ${a}`,a=>[`n × ${a}`,`n − ${a}`,`${a} − n`]],['{a} less than a number <i>n</i>',a=>`n − ${a}`,a=>[`${a} − n`,`n + ${a}`,`${a} ÷ n`]],['a number <i>n</i> divided by {a}',a=>`n ÷ ${a}`,a=>[`${a} ÷ n`,`n × ${a}`,`n − ${a}`]],['{a} more than a number <i>n</i>',a=>`n + ${a}`,a=>[`n − ${a}`,`${a} × n`,`${a} − n`]],['the quotient of {a} and a number <i>n</i>',a=>`${a} ÷ n`,a=>[`n ÷ ${a}`,`${a} × n`,`${a} − n`]],['a number <i>n</i> decreased by {a}',a=>`n − ${a}`,a=>[`${a} − n`,`n ÷ ${a}`,`n + ${a}`]],['{a} times a number <i>n</i>',a=>`${a}n`,a=>[`${a} + n`,`n − ${a}`,`${a} ÷ n`]]];
S('pfa2_words',{std:'5.PFA.2',cat:'PFA',unit:[2],name:'Words → expression'},H=>{
  const p=pick(PHR),a=ri(3,40);const right=p[1](a);const ds=p[2](a);const val=ri(41,60);
  const evalE=e=>Function('n',`return ${jsOf(e)}`)(val);if(ds.some(d=>Math.abs(evalE(d)-evalE(right))<1e-9))return null;
  return mc(`Which expression means <b>${p[0].replace('{a}',a)}</b>?`,{h:right},ds.map(h=>({h})),{why:`"${p[0].replace('{a}',a).replace(/<[^>]+>/g,'')}" → ${right}.${right.includes('−')||right.includes('÷')?' Order matters for − and ÷.':''}`});
});
S('pfa2_reverse',{std:'5.PFA.2',cat:'PFA',unit:[2],name:'Equation → story'},H=>{
  const op=pick(['÷','×','+','−']);let a,b;if(op==='÷'){b=ri(2,8);a=b*ri(3,12);}else if(op==='−'){a=ri(20,80);b=ri(3,a-5);}else{a=ri(3,20);b=ri(2,12);}if(a===b)return null;
  const v='x';const mk=o=>pick(STORY[o](o==='÷'?a:o==='−'?Math.max(a,b):a,o==='÷'?b:o==='−'?Math.min(a,b):b,0,v));
  const right=mk(op);const others=['÷','×','+','−'].filter(o=>o!==op).map(mk);
  return mc(`Which situation can be represented by <b>${v} = ${a} ${op} ${b}</b>?`,{h:right},others.map(h=>({h})),{why:`${v} = ${a} ${op} ${b} means ${op==='÷'?a+' split into '+b+' equal groups':op==='×'?b+' groups of '+a:op==='+'?a+' and '+b+' more':a+' take away '+b}.`});
});
S('pfa2_solve',{std:'5.PFA.2',cat:'PFA',unit:[2],name:'Solve one-step equations'},H=>{
  const v=pick(['n','m','s','t','y','k']);const k=ri(0,H?5:3);let eq,ans;
  if(k===0){const a=ri(4,40);ans=ri(5,60);eq=`${v} + ${a} = ${ans+a}`;}
  else if(k===1){const a=ri(4,30);ans=ri(a+5,90);eq=`${ans} − ${v} = ${ans-a}`;ans=a;}
  else if(k===2){const a=ri(3,12);ans=ri(3,12);eq=`${a} × ${v} = ${a*ans}`;}
  else if(k===3){const a=ri(3,9);ans=ri(3,12)*a;eq=`${v} ÷ ${a} = ${ans/a}`;}
  else if(k===4){const a=ri(3,9),q=ri(3,12);ans=a;eq=`${a*q} ÷ ${v} = ${q}`;}
  else {const a=pick([1.5,2.5,0.75,3.25]);ans=rnd(ri(2,9)+pick([0.25,0.5,0.75]));eq=`${v} + ${fx(a)} = ${fx(ans+a)}`;}
  if(!eqHolds(eq,v,ans))return null;
  return num(`Solve: <b>${eq}</b>`,fx(ans),{pre:`${v} = `,acc:[fx(ans)],why:`Check: put ${fx(ans)} in for ${v}: ${eq.replace(v,fx(ans))} ✓`});
});
S('pfa2_evaluate',{std:'5.PFA.2',cat:'PFA',unit:[2],name:'Evaluate an expression'},H=>{
  const v=pick(['n','x','b','w']);const val=ri(2,12);const a=ri(2,9),b=ri(1,20);const e=H?pick([`${a}${v} + ${b}`,`${a*val+b} − ${a}${v}`,`(${v} + ${b}) × ${a}`]):pick([`${v} + ${b}`,`${a} × ${v}`,`${a*val} ÷ ${v}`]);
  const res=Function(v,`return ${jsOf(e)}`)(val);if(!Number.isInteger(res)||res<0)return null;
  return num(`What is the value of <b>${e}</b> when <b>${v} = ${val}</b>?`,res,{why:`Replace ${v} with ${val}: ${e.replace(new RegExp(v,'g'),'('+val+')').replace(/(\d)\(/g,'$1 × (')} = ${res}.`});
});
const EQP=[['n + 5',0],['n + 5 = 12',1],['85 − 25',0],['d = 85 − 25',1],['6j + 5',0],['7 + a = 11',1],['3c',0],['6x = 30',1],['30 ÷ x',0],['12 − 5 = 7',1],['9 × m',0],['d = 28 ÷ 4',1],['4n − 6',0],['15 = t − 4',1],['x − 12',0],['2k + 1 = 9',1],['y ÷ 3',0],['40 = 8 × p',1]];
S('pfa2_expreq',{std:'5.PFA.2',cat:'PFA',unit:[2],name:'Expression or equation?'},H=>{
  const it=sample(EQP,6);const R=it.filter(x=>x[1]),W=it.filter(x=>!x[1]);if(!R.length||!W.length)return null;const wantEq=r()<.6;
  return ms(`Select <b>ALL</b> the ${wantEq?'equations':'expressions'}.`,(wantEq?R:W).map(x=>x[0]),(wantEq?W:R).map(x=>x[0]),{keep:0,why:'An equation has an equal sign (=) and says two amounts are the same. An expression has no equal sign.'});
});
/* ================= EXTENSIONS (Oct 24): more metric (Unit 6) + percent enrichment (Unit 7) =================
   enrich:1 = beyond the Grade 5 SOL (Advanced bridge to Grade 6). Enrichment skills are left out of byStd(),
   so SOL tests and checkpoints never pick them; byUnit() still includes them for daily sheets and unit apps. */
const MCONV=[['meter','centimeters',100,'meters','cm','m'],['meter','millimeters',1000,'meters','mm','m'],['centimeter','millimeters',10,'centimeters','mm','cm'],['kilometer','meters',1000,'kilometers','m','km'],['liter','milliliters',1000,'liters','mL','L'],['kilogram','grams',1000,'kilograms','g','kg']];
S('mg1_compare',{std:'5.MG.1',cat:'MG',unit:[6],name:'Compare metric measurements'},H=>{
  const c=pick(MCONV);const [big,smallP,f,bigP,sa,ba]=c;const eq=`<i>(1 ${big} = ${cm(f)} ${smallP})</i>`;
  const k=H?ri(0,2):ri(0,1);
  if(k===0){const x=ri(12,89)/10;const y0=rnd(x*f);const y=y0+pick([-1,1])*pick([f/10,f/100>=1?f/100:f/10,f/20>=1?f/20:f/10]);if(y<=0||Math.abs(y-y0)<1e-9)return null;
    const big1=x*f>y;return mc(`${eq}<br>Which is true?`,{h:`${fx(x)} ${ba} ${big1?'&gt;':'&lt;'} ${cm(y)} ${sa}`},[{h:`${fx(x)} ${ba} ${big1?'&lt;':'&gt;'} ${cm(y)} ${sa}`},{h:`${fx(x)} ${ba} = ${cm(y)} ${sa}`},{h:`${fx(x)} ${ba} = ${cm(rnd(x*(f===10?100:f/10)))} ${sa}`}],{sort:'keep',why:`${fx(x)} ${ba} = ${cm(y0)} ${sa}, and ${cm(y0)} is ${big1?'more':'less'} than ${cm(y)}.`});}
  if(k===1){const x=pick([ri(2,9),ri(11,49)/10]);const y=rnd(x*f);
    const right=[`${cm(y)} ${smallP}`];if(big==='meter')right.push(f===100?`${cm(rnd(x*1000))} millimeters`:`${cm(rnd(x*100))} centimeters`);
    const wrong=[`${cm(rnd(y/10))} ${smallP}`,`${cm(rnd(y*10))} ${smallP}`,`${fx(rnd(x/10))} ${bigP}`,`${cm(rnd(x*f+f))} ${smallP}`];
    return ms(`${eq}<br>Select <b>ALL</b> the measurements that are equal to <b>${fx(x)} ${bigP}</b>.`,right,wrong.slice(0,6-right.length),{why:`${fx(x)} × ${cm(f)} = ${cm(y)}, so ${fx(x)} ${bigP} = ${cm(y)} ${smallP}.${right.length>1?` Also ${right[1]}.`:''}`});}
  const vals=[ri(11,49)/10,ri(11,49)/10,ri(11,49)/10];const asSmall=[0,1,2].map(i=>i===1);const vs=vals.map(v=>rnd(v*f));
  if(new Set(vs).size<3)return null;
  const hs=vals.map((v,i)=>asSmall[i]?`${cm(rnd(v*f))} ${sa}`:`${fx(v)} ${ba}`);const order=[0,1,2].sort((a,b)=>vs[a]-vs[b]);
  const right=order.map(i=>hs[i]).join(', ');const rev=order.slice().reverse().map(i=>hs[i]).join(', ');
  const naive=[0,1,2].sort((a,b)=>(asSmall[a]?vs[a]:vals[a])-(asSmall[b]?vs[b]:vals[b]));const naiveH=naive.map(i=>hs[i]).join(', ');
  const ds=[rev,naiveH,[0,1,2].map(i=>hs[i]).join(', '),[2,0,1].map(i=>hs[i]).join(', ')].filter(x=>x!==right);
  return mc(`${eq}<br>Which list is in order from <b>least to greatest</b>?`,{h:right},ds,{why:`Change all to ${smallP}: ${order.map(i=>cm(vs[i])).join(' < ')}.`});
});
S('mg1_multistep',{std:'5.MG.1',cat:'MG',unit:[6],name:'Metric word problems (multistep)'},H=>{
  const n=nm();const k=ri(0,H?4:2);
  if(k===0){const a=ri(11,29)/10,b=ri(3,9)*100+pick([0,50]);const t=rnd(a*1000+b);
    return num(`<i>(1 kilometer = 1,000 meters)</i><br>${n} walked ${fx(a)} kilometers to the park and then ${cm(b)} meters to the library. How many <b>meters</b> did ${n} walk in all?`,t,{post:' meters',why:`${fx(a)} km = ${cm(a*1000)} m. ${cm(a*1000)} + ${cm(b)} = ${cm(t)} m.`});}
  if(k===1){const L=ri(2,4),cup=pick([200,250,500]);const tot=L*1000;if(tot%cup)return null;const p=tot/cup;
    return mc(`<i>(1 liter = 1,000 milliliters)</i><br>A cooler holds ${L} liters of water. Each cup holds ${cup} milliliters. How many cups can be filled?`,ch(String(p),p),[ch(String(p*10),p*10),ch(String(p*2),p*2),ch(String(tot),tot),ch(String(p+L),p+L),ch(String(p/2),p/2)],{sort:'v',why:`${L} L = ${cm(tot)} mL. ${cm(tot)} ÷ ${cup} = ${p} cups.`});}
  if(k===2){const m=ri(3,8)*100+pick([0,50]),q=ri(2,6);const t=m*q;const kg=rnd(t/1000);
    return mc(`<i>(1 kilogram = 1,000 grams)</i><br>Each book has a mass of ${m} grams. ${n} packs ${q} books in a box. What is the total mass of the books in <b>kilograms</b>?`,ch(fx(kg)+' kg',kg),[ch(cm(t)+' kg',t),ch(fx(rnd(t/100))+' kg',t/100),ch(fx(rnd((m+q)/1000))+' kg',(m+q)/1000),ch(fx(rnd(t/10000))+' kg',t/10000)],{sort:'v',why:`${q} × ${m} g = ${cm(t)} g = ${fx(kg)} kg.`});}
  if(k===3){const L=ri(3,9),pcs=ri(3,6),p=ri(15,45);const left=L*100-pcs*p;if(left<=0)return null;
    return num(`<i>(1 meter = 100 centimeters)</i><br>${n} has a rope that is ${L} meters long. ${n} cuts off ${pcs} pieces that are each ${p} centimeters long. How many <b>centimeters</b> of rope are left?`,left,{post:' cm',why:`${L} m = ${L*100} cm. ${pcs} × ${p} = ${pcs*p} cm. ${L*100} − ${pcs*p} = ${left} cm.`});}
  const a=ri(12,28)*100,b=ri(5,15)*100;const d=a-b;if(d<=0)return null;const kg=rnd(d/1000);
  return mc(`<i>(1 kilogram = 1,000 grams)</i><br>A puppy had a mass of ${fx(b/1000)} kilograms. Now it has a mass of ${cm(a)} grams. How much mass did it gain?`,{h:`${cm(d)} grams`},[{h:`${cm(rnd(a-b/1000))} grams`},{h:`${fx(rnd(a/1000+b/1000))} kilograms`},{h:`${cm(a+b)} grams`},{h:`${fx(rnd(d/100))} kilograms`}],{why:`${fx(b/1000)} kg = ${cm(b)} g. ${cm(a)} − ${cm(b)} = ${cm(d)} g (= ${fx(kg)} kg).`});
});
/* ruler in cm with mm ticks */
function ruler(start,len,units){const W=330,px=W/12,y0=34;const s=start*px+10,e=(start+len)*px+10;let t='';
  for(let i=0;i<=120;i++){const x=10+i*px/10;const h=i%10===0?16:i%5===0?11:6;t+=`<line x1="${x.toFixed(1)}" y1="${y0}" x2="${x.toFixed(1)}" y2="${y0+h}" stroke="#24497a" stroke-width="${i%10===0?1.4:.8}"/>`;if(i%10===0)t+=`<text x="${x.toFixed(1)}" y="${y0+28}" font-size="10" text-anchor="middle" fill="#24497a">${i/10}</text>`;}
  return `<svg class="g5v g5wide" viewBox="0 0 ${W+20} 70" width="${W+20}" height="70"><rect x="${s.toFixed(1)}" y="12" width="${(e-s).toFixed(1)}" height="16" rx="4" fill="#cfe3f3" stroke="#24497a" stroke-width="1.4"/><line x1="${s.toFixed(1)}" y1="10" x2="${s.toFixed(1)}" y2="${y0}" stroke="#24497a" stroke-dasharray="2 2"/><line x1="${e.toFixed(1)}" y1="10" x2="${e.toFixed(1)}" y2="${y0}" stroke="#24497a" stroke-dasharray="2 2"/><rect x="2" y="${y0-2}" width="${W+16}" height="38" fill="none" stroke="#8aa3bd" rx="3"/>${t}<text x="${W+14}" y="${y0+28}" font-size="9" text-anchor="end" fill="#4f6f8c">${units}</text></svg>`;}
S('mg1_ruler',{std:'5.MG.1',cat:'MG',unit:[6],name:'Measure with a centimeter ruler'},H=>{
  const start=H&&r()<.6?ri(1,3):0;const mm=ri(25,85);const len=mm/10;if(start+len>11.5)return null;const vis=ruler(start,len,'cm');
  const askMM=r()<.4;const end=rnd(start+len);
  if(askMM)return mc(Q('How long is the bar, in <b>millimeters</b>?',vis),ch(mm+' mm',mm),[ch(Math.round(end*10)+' mm',Math.round(end*10)),ch(fx(len)+' mm',len),ch(mm*10+' mm',mm*10),ch((mm+1)+' mm',mm+1),ch((mm-5)+' mm',mm-5)],{sort:'v',why:`${start?`Start at ${start} cm, end at ${fx(end)} cm: `:''}${fx(len)} cm = ${mm} mm (each small mark is 1 mm).`,wide:1});
  return mc(Q('How long is the bar, in <b>centimeters</b>?',vis),ch(fx(len)+' cm',len),[ch(fx(end)+' cm',end),ch(mm+' cm',mm),ch(fx(rnd(len+0.5))+' cm',len+0.5),ch(fx(Math.floor(len))+' cm',Math.floor(len)),ch(fx(rnd(len/10))+' cm',len/10)],{sort:'v',why:`${start?`The bar starts at ${start} cm, not 0. ${fx(end)} − ${start} = ${fx(len)} cm.`:`Count whole centimeters, then millimeter marks: ${fx(len)} cm.`}`,wide:1});
});
S('mg1_table',{std:'5.MG.1',cat:'MG',unit:[6,2],name:'Conversion tables (input/output)'},H=>{
  const c=pick(MCONV.slice(0,H?6:4));const [big,smallP,f,bigP,sa,ba]=c;const xs=sample([1,2,3,4,5,6,7,8,9,10,12,15],H?5:4).sort((a,b)=>a-b);const miss=ri(1,xs.length-1);
  const rows=xs.map((x,i)=>`<tr><td>${x}</td><td>${i===miss?'?':cm(x*f)}</td></tr>`).join('');const tbl=`<table class="g5t"><tr><th>${bigP[0].toUpperCase()+bigP.slice(1)}</th><th>${smallP[0].toUpperCase()+smallP.slice(1)}</th></tr>${rows}</table>`;
  if(H&&r()<.5)return mc(Q(`The table shows ${bigP} changed to ${smallP}. Which rule changes ${bigP} to ${smallP}?`,tbl),{h:`Multiply by ${cm(f)}`},[{h:`Add ${cm(f)}`},{h:`Divide by ${cm(f)}`},{h:`Multiply by ${cm(f/10)}`}],{why:`Each ${big} is ${cm(f)} ${smallP}, so multiply the number of ${bigP} by ${cm(f)}.`});
  const y=xs[miss]*f;return mc(Q(`The table shows ${bigP} changed to ${smallP}. What number belongs in place of the <b>?</b>`,tbl),ch(cm(y),y),[ch(cm(y/10),y/10),ch(cm(y*10),y*10),ch(cm(xs[miss]+f),xs[miss]+f),ch(cm(y+f),y+f)],{sort:'v',why:`${xs[miss]} × ${cm(f)} = ${cm(y)}.`});
});
/* ---- percent enrichment (Unit 7): beyond the Grade 5 SOL ---- */
const PCT=[[1,2,50],[1,4,25],[3,4,75],[1,5,20],[2,5,40],[3,5,60],[4,5,80],[1,10,10],[3,10,30],[7,10,70],[9,10,90],[1,20,5],[3,20,15],[1,25,4],[1,50,2],[1,1,100]];
S('ns1_percent',{std:'5.NS.1',cat:'NS',unit:[7],name:'Percent ↔ fraction ↔ decimal (enrichment)',enrich:1},H=>{
  const k=ri(0,H?4:2);
  if(k===0){const s=ri(5,95);return mc(Q('The grid is 1 whole. What <b>percent</b> is shaded?',V.grid(s)),ch(s+'%',s),[ch((100-s)+'%',100-s),ch(fx(s/10)+'%',s/10),ch(s*10+'%',s*10),ch((s+10)+'%',s+10)].filter(x=>x.v<=100),{why:`${s} of 100 squares = ${s} per hundred = ${s}%.`});}
  if(k===1){const [n,d,p]=pick(PCT.slice(0,15));return mc(`Which percent is equal to ${F(n,d)}?`,ch(p+'%',p),[ch(n+d+'%',n+d),ch(n*10+'%',n*10),ch(d+'%',d),ch(Math.round(100/d)+'%',Math.round(100/d))],{why:`${F(n,d)} = ${n*(100/d)}/100 = ${p}%.`});}
  if(k===2){const p=pick([5,8,12,25,30,45,60,75,90,7,3]);return mc(`Which decimal is equal to <b>${p}%</b>?`,ch(fx(p/100),p/100),[ch(fx(p/10),p/10),ch(fx(p/1000),p/1000),ch(String(p),p),ch(fx((100-p)/100),(100-p)/100)],{why:`${p}% = ${p} hundredths = ${fx(p/100)}.`});}
  if(k===3){const a=pick(PCT.slice(0,15)),b=rnd(ri(10,95)/100),c=pick([15,35,45,55,65,85]);const items=[{h:F(a[0],a[1]),v:a[2]/100},{h:fx(b),v:b},{h:c+'%',v:c/100}];if(new Set(items.map(x=>x.v)).size<3)return null;
    const o=items.slice().sort((x,y)=>x.v-y.v);const L=o.map(x=>x.h).join(', ');return mc('Which list is in order from <b>least to greatest</b>?',{h:L},[o.slice().reverse().map(x=>x.h).join(', '),items.map(x=>x.h).join(', '),[items[2],items[0],items[1]].map(x=>x.h).join(', '),[o[1],o[0],o[2]].map(x=>x.h).join(', ')].filter(x=>x!==L).map(h=>({h})),{why:`As decimals: ${o.map(x=>fx(x.v)).join(' < ')}.`});}
  const [n,d,p]=pick(PCT.slice(0,15));const R=[F(n,d),fx(p/100),p+'%'];const W=[fx(p/10),(n+d)+'%',F(n,d*10),fx(p/1000)].filter(x=>!R.includes(x));
  return ms(`Select <b>ALL</b> the numbers equal to ${F(n*2,d*2)}.`,R,W.slice(0,3),{why:`${F(n*2,d*2)} = ${F(n,d)} = ${fx(p/100)} = ${p}%.`});
});
S('ns1_pctof',{std:'5.NS.1',cat:'NS',unit:[7],name:'Percent of a number (enrichment)',enrich:1},H=>{
  const p=pick(H?[10,20,25,40,50,75,30,60,5,15]:[10,50,25,20]);const base=pick([20,40,60,80,100,120,200,36,48,64,90,150]);const v=p*base/100;if(v!==Math.floor(v))return null;
  const n=nm();const k=ri(0,H?2:1);
  if(k===0)return mc(`What is ${p}% of ${base}?`,ch(String(v),v),[ch(String(base-v),base-v),ch(String(p),p),ch(String(base/p*10),base/p*10),ch(String(v*10),v*10),ch(String(base+p),base+p)],{why:`${p}% = ${fr(p,100).n}/${fr(p,100).d}. ${fr(p,100).n}/${fr(p,100).d} of ${base} = ${v}.`});
  if(k===1){const price=base;const off=v;return num(`A game costs $${price}. It is on sale for <b>${p}% off</b>. How many dollars do you save?`,off,{pre:'$',acc:[String(off)],why:`${p}% of $${price} = $${off}.`});}
  const price=base;return num(`A jacket costs $${price}. ${n} buys it at <b>${p}% off</b>. What is the sale price?`,price-v,{pre:'$',acc:[String(price-v)],why:`Save ${p}% of $${price} = $${v}. $${price} − $${v} = $${price-v}.`});
});
/* ================= SOL TEST BUILDER + PAPER RENDERING ================= */
/* Blueprint: 36 scored items. Counts per standard follow the released 2026 Grade 5 set (in standards order). */
G.BLUEPRINT=[['5.NS.1',3],['5.NS.2',3],['5.CE.1',3],['5.CE.2',3],['5.CE.3',3],['5.CE.4',2],['5.MG.1',1],['5.MG.2',3],['5.MG.3',3],['5.PS.1',2],['5.PS.2',3],['5.PS.3',1],['5.PFA.1',3],['5.PFA.2',3]];
G.CATS={NS:'Number and Number Sense',CE:'Computation and Estimation',MG:'Measurement and Geometry',PSPFA:'Probability, Statistics, Patterns, Functions and Algebra'};
G.catOf=it=>it.cat==='PS'||it.cat==='PFA'?'PSPFA':it.cat;
G.UNITS={2:'Unit 2 · Algebraic Reasoning',3:'Unit 3 · Whole Number Computation',4:'Unit 4 · Decimal & Fraction Number Sense',5:'Unit 5 · Decimal Computation',6:'Unit 6 · Metric Measurement',7:'Unit 7 · Percent & Fraction Number Sense',8:'Unit 8 · Fraction Computation',9:'Unit 9 · Geometry & Measurement',10:'Unit 10 · Data & Probability',1:'Unit 1 · Data Cycle'};
/* solTest({adv:0.3, only:['5.NS.1',...], scale:1}) -> array of items in standards order */
G.solTest=(o={})=>{const out=[];const bp=o.only?G.BLUEPRINT.filter(b=>o.only.includes(b[0])):G.BLUEPRINT;const sc=o.scale||1;
  bp.forEach(([std,n])=>{const ids=shuf(G.byStd(std));const k=Math.max(1,Math.round(n*sc));const seen=new Set();
    for(let i=0;i<k;i++){let it,g=0;do{it=G.make(ids[(i+g)%ids.length],r()<(o.adv||0)?'adv':'std');g++;}while((seen.has(it.q)||(o.modes&&!o.modes.includes(it.mode)))&&g<30);seen.add(it.q);out.push(it);}});
  return out;};
/* a mix for one unit (daily/weekly practice) */
G.unitMix=(u,n,o={})=>{const ids=shuf(G.byUnit(u));const out=[];const seen=new Set();for(let i=0;out.length<n&&i<n*6;i++){const it=G.make(ids[i%ids.length],r()<(o.adv||0)?'adv':'std');if(seen.has(it.q))continue;seen.add(it.q);out.push(it);}return out;};
const LET='ABCDEFGH';
G.letters=it=>it.mode==='mc'?LET[it.ci]:it.mode==='ms'?it.cs.map(i=>LET[i]).join(', '):'';
G.keyText=it=>it.mode==='mc'?(/<svg|<table/.test(it.a)?`<b>${LET[it.ci]}</b>`:`<b>${LET[it.ci]}</b> &nbsp;${it.a}`):it.mode==='ms'?`<b>${G.letters(it)}</b>`:`${it.a}`;
/* paper rendering of one item (for printables). o.compact shrinks choices. */
G.paper=(it,n,o={})=>{
  const isPic=c=>/<svg|<table/.test(c);let body='';
  if(it.mode==='mc'||it.mode==='ms'){const pic=it.ch.some(isPic);const long=it.ch.some(c=>c.replace(/<[^>]+>/g,'').length>34);
    const cols=pic?Math.min(it.ch.length,o.picCols||2):long?1:it.ch.length<=4?(o.compact?4:2):3;
    body=`<div class="g5ch" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${it.ch.map((c,i)=>`<div class="g5c"><span class="g5l${it.mode==='ms'?' sq':''}">${LET[i]}</span><span class="g5ct">${c}</span></div>`).join('')}</div>`;
    if(it.mode==='ms')body=`<div class="g5ms">Select all that apply. Check each box.</div>`+body;}
  else body=`<div class="g5ans">${it.pre||''}<u></u>${it.post||''}</div>`;
  return `<div class="g5item${it.nocalc?' nocalc':''}"><div class="g5qrow"><span class="g5n">${n}</span><div class="g5q">${it.q}</div></div>${body}</div>`;};
G.paperCss=`.g5item{display:flex;flex-direction:column;gap:5px;min-height:0}.g5qrow{display:flex;gap:8px;align-items:flex-start}.g5n{flex:0 0 auto;min-width:24px;height:24px;border-radius:7px;background:#24497a;color:#fff;font-weight:800;font-size:13px;display:inline-flex;align-items:center;justify-content:center}
.g5q{font-size:14.5px;line-height:1.35;min-width:0}.g5vis{margin:4px 0 2px;display:flex;flex-wrap:wrap;gap:6px;align-items:flex-end}
.g5ch{display:grid;gap:4px 10px;margin-left:32px}.g5c{display:flex;gap:6px;align-items:flex-start;font-size:14px;line-height:1.3;min-width:0}.g5ct{min-width:0}
.g5l{flex:0 0 auto;width:20px;height:20px;border:1.6px solid #24497a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#24497a}.g5l.sq{border-radius:4px}
.g5ms{margin-left:32px;font-size:11.5px;font-style:italic;color:#4f6f8c}.g5ans{margin-left:32px;display:flex;align-items:flex-end;gap:6px;font-size:14px}.g5ans u{display:block;width:1.6in;border-bottom:1.5px solid #111;height:18px}
.nocalc .g5n::after{content:"";}`;
return G;
})();
if(typeof module!=='undefined')module.exports=G5;
window.G5 = G5;
