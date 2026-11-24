/* Shape Lab (Unit 11, Pilot tab). Two sections that sit beside Star Pilot missions:
   1. Shape Lab: a rectangle or square is described by its corner coordinates. The student taps each
      corner on the grid, connects them, then works out the area or perimeter. Some missions give only
      3 corners and ask for the 4th. Afterwards the rocket flies the path and counts the distance.
   2. Free Build: tap or type points to build any shape, close it, measure it (when its sides run
      across or up/down), and fly the rocket around it.
   No timer. Core = Quadrant I, Advanced = all four quadrants. Reuses the Star Pilot rocket and grid. */
(function (w) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (n, a, kids) => { const e = document.createElementNS(NS, n); for (const k in (a || {})) e.setAttribute(k, a[k]); (kids || []).forEach((c) => e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)); return e; };
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const btn = (label, fn, cls) => { const b = h('button', 'ix-btn' + (cls ? ' ' + cls : ''), label); b.type = 'button'; b.onclick = fn; return b; };
  const sgn = (v) => (v < 0 ? '−' + (-v) : String(v));
  const pair = (x, y) => `(<span class="xv">${sgn(x)}</span>, <span class="yv">${sgn(y)}</span>)`;
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const eq = (a, b) => a.x === b.x && a.y === b.y;
  const calm = () => w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dirOf = (a, b) => (a.y === b.y ? 'x' : a.x === b.x ? 'y' : 'd');
  const paren = (v) => (v < 0 ? '(' + sgn(v) + ')' : String(v));
  const diffText = (a, b) => `${sgn(b)} − ${paren(a)} = ${Math.abs(b - a)}`;
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = ri(0, i); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const KEY = 'g5lab_u11_shapelab';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const keep = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };
  const LETTERS = 'ABCDEFGHIJKL';
  const see = (el) => { try { el.scrollIntoView({ block: 'nearest', behavior: calm() ? 'auto' : 'smooth' }); } catch (e) {} };

  function moveText(x, y) {
    const a = x === 0 ? 'no across move' : `<span class="xv">${Math.abs(x)} ${x > 0 ? 'right' : 'left'}</span>`;
    const b = y === 0 ? 'no up/down move' : `<span class="yv">${Math.abs(y)} ${y > 0 ? 'up' : 'down'}</span>`;
    return `${a}, then ${b}`;
  }

  /* ---------- shared board: grid, layers, rocket, snapping, flying ---------- */
  function makeBoard(host, quad, n) {
    const lo = quad ? -n : 0;
    const wrap = h('div', 'sp-wrap');
    const board = h('div', 'sp-board sl-board');
    const s = V.planeSVG([], { quad, n, size: w.matchMedia && w.matchMedia('(min-width:900px)').matches ? 400 : 260 });
    const G = s.__geo;
    const fx = s.querySelector('.cp-pts');
    const cells = mk('g'); s.insertBefore(cells, s.querySelector('line'));
    const edges = mk('g'), trails = mk('g');
    s.insertBefore(edges, fx); s.insertBefore(trails, fx);
    const hov = mk('circle', { r: 9, class: 'cp-hover', visibility: 'hidden' }); s.insertBefore(hov, fx);
    const marks = mk('g'); s.appendChild(marks);
    const ship = StarPilot.parts.rocket(); s.appendChild(ship);
    const zone = mk('rect', { x: G.px(lo) - G.c / 2, y: G.py(n) - G.c / 2, width: (n - lo + 1) * G.c, height: (n - lo + 1) * G.c, class: 'cp-tapzone' });
    s.appendChild(zone);
    board.appendChild(s); wrap.appendChild(board);
    const side = h('div', 'sp-side'); wrap.appendChild(side);
    host.appendChild(wrap);

    const clamp = (v) => Math.max(lo, Math.min(n, v));
    const place = (gx, gy, rot) => ship.setAttribute('transform', `translate(${G.px(gx)} ${G.py(gy)}) rotate(${rot || 0}) scale(${G.c < 22 ? 0.85 : G.S > 300 ? 1.25 : 1})`);
    const flame = (on) => ship.querySelector('.flame').setAttribute('visibility', on ? 'visible' : 'hidden');
    const snap = (e) => {
      const p = IX.svgPoint(s, e.clientX, e.clientY); if (!p) return null;
      return { x: clamp(Math.round((p.x - G.ox) / G.c)), y: clamp(Math.round((G.oy - p.y) / G.c)) };
    };
    const empty = (g) => { while (g.firstChild) g.removeChild(g.firstChild); };
    const B = { s, G, lo, n, quad, side, fx, cells, edges, trails, hov, marks, ship, zone, place, flame, snap, empty };

    B.park = () => { place(0, 0, 90); flame(false); };
    B.showHover = (p) => { hov.setAttribute('cx', G.px(p.x)); hov.setAttribute('cy', G.py(p.y)); hov.setAttribute('visibility', 'visible'); };
    B.hideHover = () => hov.setAttribute('visibility', 'hidden');
    B.dot = (p, cls) => { const c = mk('circle', { cx: G.px(p.x), cy: G.py(p.y), r: 4.5, class: 'cp-dot cp-pop' + (cls ? ' ' + cls : '') }); fx.appendChild(c); return c; };
    B.ring = (p) => { const c = mk('circle', { cx: G.px(p.x), cy: G.py(p.y), r: 9, class: 'sl-ring' }); marks.appendChild(c); return c; };
    B.ghost = (p) => fx.appendChild(mk('circle', { cx: G.px(p.x), cy: G.py(p.y), r: 9, class: 'cp-dot ghost' }));
    /* Corner label: try spots around the dot (right / left / centred, above / below, near / lifted) and take the one
       that stays on the board, keeps off the axes and their tick numbers, and does not cover other labels or corner
       dots. The side away from the shape's centre wins ties. `others` = every corner of the shape. */
    B.vlabel = (p, c, others) => {
      const S = G.S, txt = `(${sgn(p.x)}, ${sgn(p.y)})`, wd = txt.length * 6.4 + 2, X = G.px(p.x), Y = G.py(p.y);
      const wantR = p.x >= c.x, wantUp = p.y >= c.y;
      const hit = (r, q) => r.x0 < q.x1 && r.x1 > q.x0 && r.y0 < q.y1 && r.y1 > q.y0;
      const strips = [{ x0: G.ox - 22, x1: G.ox + 3, y0: -1e3, y1: 1e3 }, { x0: -1e3, x1: 1e3, y0: G.oy - 3, y1: G.oy + 19 }];
      const placed = Array.prototype.map.call(marks.querySelectorAll('.sl-vl'), (e) => e.__r).filter(Boolean);
      const dots = (others || []).map((o) => ({ x0: G.px(o.x) - 7, x1: G.px(o.x) + 7, y0: G.py(o.y) - 7, y1: G.py(o.y) + 7 }));
      let best = 1e9, pick = null;
      ['r', 'l', 'm'].forEach((mode) => [true, false].forEach((up) => [0, 13].forEach((lift) => {
        const x = X + (mode === 'r' ? 7 : mode === 'l' ? -7 : 0), y = up ? Y - 8 - lift - (mode === 'm' ? 3 : 0) : Y + 15 + lift + (mode === 'm' ? 3 : 0);
        const x0 = mode === 'r' ? x : mode === 'l' ? x - wd : x - wd / 2, r = { x0, x1: x0 + wd, y0: y - 10, y1: y + 3 };
        let sc = (mode === 'm' ? 0.7 : (mode === 'r') === wantR ? 0 : 1) + (up === wantUp ? 0 : 0.5) + (lift ? 2 : 0);
        if (r.x0 < 2 || r.x1 > S - 2 || r.y0 < 4 || r.y1 > S - 2) sc += 100;
        strips.forEach((q) => { if (hit(r, q)) sc += 20; });
        placed.forEach((q) => { if (hit(r, q)) sc += 40; });
        dots.forEach((q) => { if (hit(r, q)) sc += 25; });
        if (sc < best) { best = sc; pick = { x, y, r, anchor: mode === 'r' ? 'start' : mode === 'l' ? 'end' : 'middle' }; }
      })));
      const t = mk('text', { x: pick.x, y: pick.y, class: 'sl-vl', 'text-anchor': pick.anchor }, [txt]);
      t.__r = pick.r; marks.appendChild(t); return t;
    };
    B.edge = (a, b, fresh) => {
      const len = Math.hypot(G.px(b.x) - G.px(a.x), G.py(b.y) - G.py(a.y));
      const l = mk('line', { x1: G.px(a.x), y1: G.py(a.y), x2: G.px(b.x), y2: G.py(b.y), class: 'sl-edge ' + dirOf(a, b) + (fresh ? ' fresh' : '') });
      l.style.setProperty('--len', len.toFixed(1));
      edges.appendChild(l); return l;
    };
    B.sideLabel = (a, b, c) => {
      const d = dirOf(a, b), len = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      let x = G.px(mx), y = G.py(my), anchor = 'middle';
      if (d === 'x') y += my >= c.y ? -8 : 17;
      else { x += mx >= c.x ? 9 : -9; y += 5; anchor = mx >= c.x ? 'start' : 'end'; }
      const t = mk('text', { x, y, class: 'sl-len ' + d, 'text-anchor': anchor }, [String(len)]);
      marks.appendChild(t); return t;
    };
    B.shade = (list) => {
      list.forEach((c, i) => {
        const r = mk('rect', { x: G.px(c.x), y: G.py(c.y + 1), width: G.c, height: G.c, class: 'sl-cell' });
        if (!calm()) r.style.animationDelay = Math.min(900, i * 22) + 'ms';
        cells.appendChild(r);
      });
    };
    B.clearAll = () => { [cells, edges, trails, fx, marks].forEach(empty); B.park(); B.hideHover(); };

    /* Fly the rocket through pts. The first `skip` legs are the takeoff (across, then up) and are not counted. */
    B.fly = (pts, opt, done) => {
      opt = opt || {};
      const skip = opt.skip || 0, per = calm() ? 0 : 105;
      empty(trails);
      const heading = (a, b) => Math.atan2(G.px(b.x) - G.px(a.x), -(G.py(b.y) - G.py(a.y))) * 180 / Math.PI;
      if (pts.length < 2) { done && done(0); return; }
      flame(true);
      place(pts[0].x, pts[0].y, heading(pts[0], pts[1]));
      let total = 0;
      const leg = (i) => {
        if (i >= pts.length - 1) { flame(false); done && done(total); return; }
        const a = pts[i], b = pts[i + 1], len = Math.hypot(b.x - a.x, b.y - a.y), rot = heading(a, b);
        const line = mk('line', { class: 'cp-trail ' + (i < skip ? 'to' : dirOf(a, b)), x1: G.px(a.x), y1: G.py(a.y), x2: G.px(a.x), y2: G.py(a.y) });
        trails.appendChild(line);
        const dur = per ? Math.max(320, len * per) : 0, t0 = performance.now();
        const step = (now) => {
          const f = dur ? Math.min(1, (now - t0) / dur) : 1;
          const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
          const gx = a.x + (b.x - a.x) * e, gy = a.y + (b.y - a.y) * e;
          place(gx, gy, rot);
          line.setAttribute('x2', G.px(gx)); line.setAttribute('y2', G.py(gy));
          if (f < 1) requestAnimationFrame(step);
          else {
            place(b.x, b.y, rot);
            if (i >= skip) { total += len; opt.onLeg && opt.onLeg(i - skip, a, b, len, total); }
            setTimeout(() => leg(i + 1), per ? 170 : 0);
          }
        };
        requestAnimationFrame(step);
      };
      leg(0);
    };
    /* Takeoff from the origin (across first, then up) to the first corner, then around the shape. */
    B.route = (loop) => {
      const p0 = loop[0], prefix = [{ x: 0, y: 0 }];
      if (p0.x !== 0) prefix.push({ x: p0.x, y: 0 });
      if (p0.y !== 0) prefix.push({ x: p0.x, y: p0.y });
      return { pts: prefix.concat(loop.slice(1)), skip: prefix.length - 1 };
    };
    B.legLine = (a, b, len, total) => {
      const d = dirOf(a, b);
      const words = d === 'x' ? `${len} ${b.x > a.x ? 'right ➡️' : 'left ⬅️'}` : d === 'y' ? `${len} ${b.y > a.y ? 'up ⬆️' : 'down ⬇️'}` : 'a slanted leg';
      const tot = d === 'd' ? '' : ` &nbsp;·&nbsp; total <b>${total}</b>`;
      return `<span class="${d}">${words}</span>${tot}`;
    };
    return B;
  }

  /* =====================================================================
     1. SHAPE LAB: tap the corners, connect them, measure
     ===================================================================== */
  const KINDS = ['area', 'perim', 'area', 'perim', 'fourth-area', 'fourth-perim'];

  function guided(host, api) {
    const adv = api.lvl === 'advanced';
    const quad = adv, n = adv ? 6 : 8, lo = quad ? -n : 0, ROUND = KINDS.length;
    const best = load(), bestKey = 'g' + (adv ? 'adv' : 'core');
    host.innerHTML = `<h2>📐 Shape Lab · ${adv ? 'All four quadrants' : 'Quadrant I'}</h2>
      <p class="lede">Tap each corner on the grid, <b>connect</b> them, then work out the answer. Some missions give only three corners. ${ROUND} shapes, no timer.</p>`;
    const B = makeBoard(host, quad, n);
    const hud = h('div', 'sp-hud'), mission = h('div', 'sp-mission'), chips = h('div', 'sl-chips'), ans = h('div', 'sl-ans');
    const row = h('div', 'ix-ctr'), fb = h('div', 'ix-fb'), log = h('ul', 'sl-log');
    [hud, mission, chips, ans, row, fb, log].forEach((e) => B.side.appendChild(e));

    let k = 0, stars = 0, streak = 0, used = {};
    let t, phase, idx, chain, edgesDone, from, ringEl, tries, misses, labelsOn, busy, flown;

    function makeRect(i) {
      let w0, h0, x1, y1, tt = 0, sq;
      do {
        tt++; sq = Math.random() < 0.25;
        w0 = ri(2, 7); h0 = sq ? w0 : ri(2, 6);
        if (w0 > n - lo || h0 > n - lo) continue;
        x1 = ri(lo, n - w0); y1 = ri(lo, n - h0);
        if (!quad && (x1 < 1 || y1 < 1) && Math.random() < 0.85) continue;
        if (quad && i >= 2 && !((x1 < 0 && x1 + w0 > 0) || (y1 < 0 && y1 + h0 > 0))) continue;
        if (!sq && w0 === h0) continue;
        break;
      } while (tt < 200);
      if (x1 == null) { w0 = 4; h0 = 3; x1 = lo + 1; y1 = lo + 1; }
      return { x1, y1, x2: x1 + w0, y2: y1 + h0 };
    }
    function makeTask(i) {
      const kind = KINDS[i];
      let R, key, tt = 0;
      do { R = makeRect(i); key = [R.x1, R.y1, R.x2, R.y2].join(','); tt++; } while (used[key] && tt < 60);
      used[key] = 1;
      const ccw = [{ x: R.x1, y: R.y1 }, { x: R.x2, y: R.y1 }, { x: R.x2, y: R.y2 }, { x: R.x1, y: R.y2 }];
      let order = ccw.slice();
      if (Math.random() < 0.5) order = shuffle(order); else { const r = ri(0, 3); order = order.slice(r).concat(order.slice(0, r)); }
      const fourth = kind.indexOf('fourth') === 0, wd = R.x2 - R.x1, ht = R.y2 - R.y1;
      return {
        R, ccw, order, fourth, wd, ht, ask: /area$/.test(kind) ? 'area' : 'perim', name: wd === ht ? 'square' : 'rectangle',
        given: fourth ? order.slice(0, 3) : [], toPlot: fourth ? [order[3]] : order
      };
    }
    const askWord = () => (t.ask === 'area' ? 'area' : 'perimeter');
    const answer = () => (t.ask === 'area' ? t.wd * t.ht : 2 * (t.wd + t.ht));
    const centre = () => ({ x: (t.R.x1 + t.R.x2) / 2, y: (t.R.y1 + t.R.y2) / 2 });

    function drawHud() {
      hud.innerHTML = `<span>Shape ${Math.min(k + 1, ROUND)} / ${ROUND}</span><span class="sp-stars">⭐ ${stars}</span>${streak > 1 ? `<span>🔥 ${streak} in a row</span>` : ''}${best[bestKey] != null ? `<span>Best ${best[bestKey]} / ${ROUND}</span>` : ''}`;
    }
    function setNote(html) { const e = mission.querySelector('.ix-note'); if (e) e.innerHTML = html; }
    function drawChips() {
      chips.innerHTML = '';
      if (t.fourth) {
        t.given.forEach((p) => chips.appendChild(h('span', 'sl-chip done', pair(p.x, p.y))));
        chips.appendChild(h('span', 'sl-chip q' + (phase === 'plot' ? ' now' : ' done'), phase === 'plot' ? '(?, ?)' : pair(t.toPlot[0].x, t.toPlot[0].y)));
      } else {
        t.order.forEach((p, i) => chips.appendChild(h('span', 'sl-chip' + (i < idx ? ' done' : i === idx && phase === 'plot' ? ' now' : ''), pair(p.x, p.y))));
      }
    }
    function start() {
      t = makeTask(k); phase = 'plot'; idx = 0; chain = []; edgesDone = []; from = null; ringEl = null;
      tries = 0; misses = 0; labelsOn = false; busy = false; flown = false;
      B.clearAll(); drawHud();
      fb.className = 'ix-fb'; fb.innerHTML = ''; log.innerHTML = ''; ans.innerHTML = ''; row.innerHTML = '';
      const c = centre();
      if (t.fourth) t.given.forEach((p) => { B.dot(p); B.vlabel(p, c, t.ccw); });
      mission.innerHTML = t.fourth
        ? `<div class="k">🧩 Find the 4th corner</div><div class="t">Three corners of a ${t.name} are shown. Find the ${askWord()}.</div><div class="ix-note"></div>`
        : `<div class="k">📐 Plot, connect, measure</div><div class="t">A ${t.name} has these corners. Find its ${askWord()}.</div><div class="ix-note"></div>`;
      drawChips();
      setNote(t.fourth ? 'Tap the missing 4th corner on the grid.' : `Tap ${pair(t.toPlot[0].x, t.toPlot[0].y)} on the grid.`);
    }

    /* ---- taps ---- */
    B.zone.addEventListener('pointermove', (e) => {
      if (busy || (phase !== 'plot' && phase !== 'connect')) return;
      const q = B.snap(e); if (q) B.showHover(q);
    });
    B.zone.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (busy) return;
      const q = B.snap(e); if (!q) return;
      B.showHover(q);
      if (phase === 'plot') tapPlot(q); else if (phase === 'connect') tapConnect(q);
    });

    function tapPlot(q) {
      const target = t.toPlot[idx];
      if (eq(q, target)) {
        B.dot(target); B.vlabel(target, centre(), t.ccw); idx++; misses = 0;
        fb.className = 'ix-fb ok'; fb.innerHTML = `✓ ${pair(target.x, target.y)}: ${moveText(target.x, target.y)}.`;
        if (idx >= t.toPlot.length) {
          phase = 'connect'; B.hideHover(); drawChips();
          setNote('All four corners are on the grid! Now <b>connect</b> them: tap a corner, then the corner right next to it, and keep going around.');
        } else { drawChips(); setNote(`Next: tap ${pair(t.toPlot[idx].x, t.toPlot[idx].y)}.`); }
        return;
      }
      misses++;
      fb.className = 'ix-fb no';
      let msg;
      if (q.x === target.y && q.y === target.x) msg = `You tapped ${pair(q.x, q.y)}. The numbers got swapped! <span class="xv">First number = across</span>, <span class="yv">second = ${quad ? 'up/down' : 'up'}</span>.`;
      else if (q.x === target.x) msg = `Across is right! Check the <b>${quad ? 'up/down' : 'up'}</b> number: y = <span class="yv">${sgn(target.y)}</span>.`;
      else if (q.y === target.y) msg = `${quad ? 'Up/down' : 'Up'} is right! Check <b>across</b>: x = <span class="xv">${sgn(target.x)}</span>.`;
      else msg = `You tapped ${pair(q.x, q.y)}. Count from (0, 0): ${t.fourth ? 'look at the three corners. ' : moveText(target.x, target.y) + '.'}`;
      if (t.fourth) msg += ' <b>Clue:</b> the 4th corner uses the x that shows up <b>once</b> and the y that shows up <b>once</b> among the three corners.';
      if (misses >= 3) { B.ghost(target); msg += ' The dashed circle shows the spot.'; }
      fb.innerHTML = msg;
    }

    function cornerIndex(q) { return t.ccw.findIndex((p) => eq(p, q)); }
    function tapConnect(q) {
      const i = cornerIndex(q);
      if (i < 0) { fb.className = 'ix-fb no'; fb.innerHTML = 'Tap one of the corner dots.'; return; }
      if (from == null) {
        from = i; chain = [i]; setRing(i);
        fb.className = 'ix-fb'; fb.innerHTML = '';
        setNote('Good. Now tap the corner <b>next to it</b> (not across the middle).');
        return;
      }
      if (i === from) { from = null; chain = edgesDone.length ? chain : []; clearRing(); setNote('Tap a corner to start connecting.'); return; }
      const a = t.ccw[from], b = t.ccw[i];
      if (a.x !== b.x && a.y !== b.y) {
        fb.className = 'ix-fb no';
        fb.innerHTML = 'That line cuts <b>across the middle</b> (a diagonal). Sides of a rectangle join corners that are <b>side by side</b>: they share the same x or the same y.';
        return;
      }
      const key = Math.min(from, i) + '-' + Math.max(from, i);
      if (edgesDone.indexOf(key) >= 0) { fb.className = 'ix-fb no'; fb.innerHTML = 'That side is already drawn. Pick a corner that is still unconnected.'; return; }
      edgesDone.push(key); chain.push(i);
      B.edge(a, b, true);
      from = i; setRing(i);
      fb.className = 'ix-fb ok'; fb.innerHTML = `${edgesDone.length} of 4 sides drawn.`;
      if (edgesDone.length >= 4) toMeasure();
    }
    function setRing(i) { clearRing(); ringEl = B.ring(t.ccw[i]); }
    function clearRing() { if (ringEl && ringEl.parentNode) ringEl.parentNode.removeChild(ringEl); ringEl = null; }

    /* ---- measure ---- */
    function toMeasure() {
      phase = 'measure'; clearRing(); B.hideHover(); from = null;
      const pts = t.ccw.map((p) => G(p)).join(' ');
      B.edges.insertBefore(mk('polygon', { points: pts, class: 'sl-fill' }), B.edges.firstChild);
      fb.className = 'ix-fb ok'; fb.innerHTML = `🎉 It is a <b>${t.name}</b>! All four corners are joined.`;
      setNote(t.ask === 'area' ? 'Find the <b>area</b>: how many square units fit inside?' : 'Find the <b>perimeter</b>: the distance all the way around.');
      ans.innerHTML = '';
      const lab = h('div', 'ix-lab', t.ask === 'area' ? 'Area (square units)' : 'Perimeter (units)');
      const inp = h('input', 'sl-in'); inp.type = 'number'; inp.step = 'any'; inp.setAttribute('inputmode', 'numeric'); inp.setAttribute('aria-label', 'Your answer');
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(inp); });
      const go = btn('Check', () => check(inp), 'go');
      const hint = btn('💡 Show side lengths', () => { showLabels(); }, 'ghost');
      const line = h('div', 'sl-ansrow'); line.appendChild(inp); line.appendChild(go);
      ans.appendChild(lab); ans.appendChild(line); ans.appendChild(hint); see(ans);
    }
    function G(p) { return B.G.px(p.x) + ',' + B.G.py(p.y); }
    function showLabels() {
      if (labelsOn) return; labelsOn = true;
      const c = centre();
      for (let i = 0; i < 4; i++) B.sideLabel(t.ccw[i], t.ccw[(i + 1) % 4], c);
    }
    function allCells() {
      const out = [];
      for (let x = t.R.x1; x < t.R.x2; x++) for (let y = t.R.y1; y < t.R.y2; y++) out.push({ x, y });
      return out;
    }
    function check(inp) {
      if (busy) return;
      const v = parseFloat(inp.value);
      if (isNaN(v)) { fb.className = 'ix-fb no'; fb.innerHTML = 'Type a number first.'; return; }
      tries++;
      const right = answer(), area = t.wd * t.ht, per = 2 * (t.wd + t.ht);
      if (v === right) return success();
      fb.className = 'ix-fb no';
      let msg;
      if (t.ask === 'area' && v === per) msg = `${v} is the <b>perimeter</b> (the way around). <b>Area</b> counts the squares <b>inside</b>: length × width.`;
      else if (t.ask === 'perim' && v === area) msg = `${v} is the <b>area</b> (squares inside). <b>Perimeter</b> is the distance <b>around</b>: add all four sides.`;
      else if (t.ask === 'perim' && v === t.wd + t.ht) msg = `That is only <b>half</b> way around. A ${t.name} has two lengths and two widths.`;
      else msg = t.ask === 'area' ? 'Not yet. Area = length × width. Count how far across and how far up, then multiply.' : 'Not yet. Perimeter = add up all four sides.';
      if (tries >= 2 && !labelsOn) { showLabels(); msg += ' The side lengths are on the grid now.'; }
      fb.innerHTML = msg; see(fb);
    }
    function success() {
      const first = tries === 1;
      if (first) { stars++; streak++; if (api.addXP) api.addXP(2); } else streak = 0;
      showLabels(); drawHud(); busy = false;
      const R = t.R;
      const dims = `Across: ${diffText(R.x1, R.x2)}. Up: ${diffText(R.y1, R.y2)}.`;
      fb.className = 'ix-fb ok';
      fb.innerHTML = t.ask === 'area'
        ? `${first ? '⭐ Perfect! ' : 'Yes! '}${dims}<br>Area = ${t.wd} × ${t.ht} = <b>${t.wd * t.ht}</b> square units (the shaded squares).`
        : `${first ? '⭐ Perfect! ' : 'Yes! '}${dims}<br>Perimeter = 2 × (${t.wd} + ${t.ht}) = <b>${2 * (t.wd + t.ht)}</b> units. Press Fly to count it with the rocket.`;
      if (t.ask === 'area') B.shade(allCells());
      phase = 'done'; ans.innerHTML = '';
      drawChips(); setNote('Nice work. Fly the path, or go to the next shape.');
      buttons(); see(row);
    }
    function buttons() {
      row.innerHTML = '';
      row.appendChild(btn(flown ? 'Fly it again 🚀' : 'Fly the path 🚀', flyIt, 'ghost'));
      row.appendChild(btn(k + 1 >= ROUND ? 'Finish round' : 'Next shape →', () => { k++; k >= ROUND ? finish() : start(); }, 'go'));
    }
    function flyIt() {
      if (busy) return;
      busy = true; flown = true; log.innerHTML = '';
      row.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      const loop = chain.map((i) => t.ccw[i]);
      const r = B.route(loop);
      B.fly(r.pts, {
        skip: r.skip,
        onLeg: (i, a, b, len, total) => { log.appendChild(h('li', '', B.legLine(a, b, len, total))); }
      }, (total) => {
        log.appendChild(h('li', 'sum', `🏁 Flew <b>${total}</b> units all the way around. That is the <b>perimeter</b>.`));
        busy = false; buttons();
      });
    }
    function finish() {
      if (api.addXP) api.addXP(5);
      if (best[bestKey] == null || stars > best[bestKey]) { best[bestKey] = stars; keep(best); }
      B.clearAll(); chips.innerHTML = ''; ans.innerHTML = ''; log.innerHTML = '';
      const msg = stars === ROUND ? 'Flawless! Every answer on the first try.' : stars >= ROUND - 2 ? 'Ace pilot! Just a bump or two.' : 'Round saved. Each one makes the pattern easier.';
      mission.innerHTML = `<div class="k">🏁 Round complete (+5 XP)</div><div class="t">⭐ ${stars} / ${ROUND} first-try answers</div><div class="ix-note">${msg}</div>`;
      fb.className = 'ix-fb'; fb.innerHTML = ''; drawHud();
      row.innerHTML = '';
      row.appendChild(btn('Play again 📐', () => { k = 0; stars = 0; streak = 0; used = {}; start(); }, 'go'));
    }
    start();
  }

  /* =====================================================================
     2. FREE BUILD: place points, close the shape, measure it, fly it
     ===================================================================== */
  function segInter(p1, p2, p3, p4) {
    const o = (a, b, c) => Math.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
    const on = (a, b, c) => Math.min(a.x, b.x) <= c.x && c.x <= Math.max(a.x, b.x) && Math.min(a.y, b.y) <= c.y && c.y <= Math.max(a.y, b.y);
    const o1 = o(p1, p2, p3), o2 = o(p1, p2, p4), o3 = o(p3, p4, p1), o4 = o(p3, p4, p2);
    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && on(p1, p2, p3)) return true;
    if (o2 === 0 && on(p1, p2, p4)) return true;
    if (o3 === 0 && on(p3, p4, p1)) return true;
    if (o4 === 0 && on(p3, p4, p2)) return true;
    return false;
  }
  function isSimple(pts) {
    const m = pts.length;
    for (let i = 0; i < m; i++) {
      const a = pts[i], b = pts[(i + 1) % m];
      for (let j = i + 1; j < m; j++) {
        const c = pts[j], d = pts[(j + 1) % m];
        const adjacent = j === i + 1 || (i === 0 && j === m - 1);
        if (adjacent) {
          /* neighbours may only touch at the shared corner: reject a fold-back along the same line */
          const s = j === i + 1 ? [a, b, d] : [b, a, c];
          const cr = (s[1].x - s[0].x) * (s[2].y - s[1].y) - (s[1].y - s[0].y) * (s[2].x - s[1].x);
          const dt = (s[1].x - s[0].x) * (s[2].x - s[1].x) + (s[1].y - s[0].y) * (s[2].y - s[1].y);
          if (cr === 0 && dt < 0) return false;
          continue;
        }
        if (segInter(a, b, c, d)) return false;
      }
    }
    return true;
  }
  function inside(pts, px, py) {
    let c = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const a = pts[i], b = pts[j];
      if ((a.y > py) !== (b.y > py) && px < (b.x - a.x) * (py - a.y) / (b.y - a.y) + a.x) c = !c;
    }
    return c;
  }
  function shapeName(pts) {
    const m = pts.length;
    const q = pts.filter((p, i) => {
      const a = pts[(i + m - 1) % m], b = pts[(i + 1) % m];
      return (p.x - a.x) * (b.y - p.y) - (p.y - a.y) * (b.x - p.x) !== 0;
    });
    const c = q.length;
    if (c === 3) return 'triangle';
    if (c === 4) {
      const v = q.map((p, i) => { const r = q[(i + 1) % 4]; return { x: r.x - p.x, y: r.y - p.y }; });
      const len = (a) => a.x * a.x + a.y * a.y, dot = (a, b) => a.x * b.x + a.y * b.y, cr = (a, b) => a.x * b.y - a.y * b.x;
      const para = v[0].x + v[2].x === 0 && v[0].y + v[2].y === 0 && v[1].x + v[3].x === 0 && v[1].y + v[3].y === 0;
      if (para) { const rt = dot(v[0], v[1]) === 0, side = len(v[0]) === len(v[1]); return rt ? (side ? 'square' : 'rectangle') : (side ? 'rhombus' : 'parallelogram'); }
      if (cr(v[0], v[2]) === 0 || cr(v[1], v[3]) === 0) return 'trapezoid';
      return 'quadrilateral';
    }
    return ({ 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' })[c] || (c + '-sided shape');
  }

  function free(host, api) {
    const adv = api.lvl === 'advanced';
    const quad = adv, n = adv ? 6 : 8, lo = quad ? -n : 0, MAXP = 12;
    host.innerHTML = `<h2>🛠️ Free Build · ${adv ? 'All four quadrants' : 'Quadrant I'}</h2>
      <p class="lede">Build your own shape. <b>Tap the grid</b> to add corners, or type coordinates. Tap the <b>first dot</b> again to close it. Then measure it and send the rocket around the edge.</p>`;
    const B = makeBoard(host, quad, n);
    const info = h('div', 'sp-mission');
    const chips = h('div', 'sl-chips');
    const pick = h('div', 'sp-pick');
    const row1 = h('div', 'ix-ctr'), row2 = h('div', 'ix-ctr');
    const meas = h('div', 'sl-meas');
    const fb = h('div', 'ix-fb'), log = h('ul', 'sl-log');
    const more = h('details', 'sl-more'); more.appendChild(h('summary', '', '⌨️ Type coordinates instead')); more.appendChild(pick);
    [info, chips, row1, fb, meas, log, row2, more].forEach((e) => B.side.appendChild(e));

    let pts = [], closed = false, busy = false, sx = Math.min(2, n), sy = Math.min(2, n), info2 = null;

    const centre = () => {
      if (!pts.length) return { x: (lo + n) / 2, y: (lo + n) / 2 };
      return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
    };
    const rectilinear = () => pts.every((p, i) => { const q = pts[(i + 1) % pts.length]; return p.x === q.x || p.y === q.y; });

    function render(freshIdx) {
      [B.cells, B.edges, B.fx, B.marks, B.trails].forEach(B.empty);
      B.park();
      const c = centre(), m = pts.length;
      if (closed && m >= 3) B.edges.appendChild(mk('polygon', { points: pts.map((p) => B.G.px(p.x) + ',' + B.G.py(p.y)).join(' '), class: 'sl-fill' }));
      for (let i = 0; i < m - 1; i++) B.edge(pts[i], pts[i + 1], i + 1 === freshIdx);
      if (closed && m >= 3) B.edge(pts[m - 1], pts[0], true);
      pts.forEach((p, i) => { B.dot(p, i === 0 && !closed && m >= 3 ? 'sl-start' : ''); B.vlabel(p, c, pts); });
      drawChips(); drawInfo(); drawButtons();
    }
    function drawChips() {
      chips.innerHTML = '';
      pts.forEach((p, i) => chips.appendChild(h('span', 'sl-chip', `${LETTERS[i]} ${pair(p.x, p.y)}`)));
    }
    function drawInfo() {
      if (!pts.length) info.innerHTML = '<div class="k">🛠️ Your shape</div><div class="t">Tap the grid to start.</div><div class="ix-note">Each tap adds a corner. Corners are joined in the order you place them.</div>';
      else if (!closed) info.innerHTML = `<div class="k">🛠️ Building</div><div class="t">${pts.length} corner${pts.length > 1 ? 's' : ''} placed</div><div class="ix-note">${pts.length >= 3 ? 'Tap the first dot, or press Close shape.' : 'Keep adding corners. You need at least 3 to make a shape.'}</div>`;
      else info.innerHTML = `<div class="k">✅ Closed shape</div><div class="t">${shapeName(pts)[0].toUpperCase() + shapeName(pts).slice(1)}</div><div class="ix-note">${pts.length} corners, ${pts.length} sides.</div>`;
    }
    function drawButtons() {
      row1.innerHTML = ''; row2.innerHTML = '';
      const u = btn('↶ Undo', undo, 'ghost'), cl = btn('🗑 Clear', clear, 'ghost'), cs = btn('✔ Close shape', close, 'go'), fl = btn('Fly the path 🚀', flyIt, 'go');
      u.disabled = !pts.length || busy; cl.disabled = !pts.length || busy; cs.disabled = closed || pts.length < 3 || busy; fl.disabled = pts.length < 2 || busy;
      row1.appendChild(u); row1.appendChild(cl); row1.appendChild(cs); row1.appendChild(fl);
      row2.appendChild(h('span', 'ix-lab', 'Quick shapes:'));
      [['▭ Rectangle', 'rect'], ['◼ Square', 'sq'], ['L-shape', 'L']].forEach(([l, id]) => { const b = btn(l, () => preset(id), 'ghost'); b.disabled = busy; row2.appendChild(b); });
    }
    function drawPick() {
      pick.innerHTML = '';
      const mkStep = (lab, get, set, color) => {
        const l = h('div', 'ix-lab', `<span style="color:${color}">${lab}</span>`), st = h('div', 'sp-step');
        const v = h('span', 'ix-val', sgn(get())); v.style.color = color;
        st.appendChild(btn('−', () => { set(Math.max(lo, get() - 1)); v.textContent = sgn(get()); B.showHover({ x: sx, y: sy }); }));
        st.appendChild(v);
        st.appendChild(btn('+', () => { set(Math.min(n, get() + 1)); v.textContent = sgn(get()); B.showHover({ x: sx, y: sy }); }));
        pick.appendChild(l); pick.appendChild(st);
      };
      mkStep('x (across)', () => sx, (v) => { sx = v; }, 'var(--cp-x)');
      mkStep(quad ? 'y (up/down)' : 'y (up)', () => sy, (v) => { sy = v; }, 'var(--cp-y)');
      const add = btn('Add this point', () => addPoint({ x: sx, y: sy }), 'ghost'); add.style.gridColumn = '1 / -1';
      pick.appendChild(add);
    }

    function note(html, cls) { fb.className = 'ix-fb' + (cls ? ' ' + cls : ''); fb.innerHTML = html || ''; }
    function resetResults() { meas.innerHTML = ''; log.innerHTML = ''; info2 = null; }

    function addPoint(p) {
      if (busy) return;
      if (closed) { note('The shape is closed. Press Undo to reopen it, or Clear to start over.', 'no'); return; }
      if (pts.length >= 3 && eq(p, pts[0])) return close();
      if (pts.some((q) => eq(q, p))) { note('There is already a corner at ' + pair(p.x, p.y) + '.', 'no'); return; }
      if (pts.length >= MAXP) { note(`That is ${MAXP} corners, the most this builder holds. Close the shape.`, 'no'); return; }
      pts.push(p); resetResults();
      render(pts.length - 1);
      note(`Added ${LETTERS[pts.length - 1]} ${pair(p.x, p.y)}.`, 'ok');
    }
    function undo() { if (busy || !pts.length) return; if (closed) closed = false; else pts.pop(); resetResults(); render(); note(''); }
    function clear() { if (busy) return; pts = []; closed = false; resetResults(); render(); note(''); }
    function close() {
      if (busy || closed || pts.length < 3) return;
      if (!isSimple(pts)) { note('Some sides would <b>cross</b> each other. Press Undo and place the corners so the sides only meet at corners.', 'no'); return; }
      closed = true; resetResults(); render(); B.hideHover();
      note('Shape closed!', 'ok');
      showMeasure();
    }
    function preset(id) {
      if (busy) return;
      let w0, h0;
      const span = n - lo;
      if (id === 'rect') { w0 = ri(3, 6); h0 = ri(2, 4); if (w0 === h0) w0++; }
      else if (id === 'sq') { w0 = h0 = ri(2, 4); }
      else { w0 = 4; h0 = 4; }
      w0 = Math.min(w0, span); h0 = Math.min(h0, span);
      const x = ri(lo, n - w0), y = ri(lo, n - h0);
      pts = id === 'L'
        ? [{ x, y }, { x: x + w0, y }, { x: x + w0, y: y + 2 }, { x: x + 2, y: y + 2 }, { x: x + 2, y: y + h0 }, { x, y: y + h0 }]
        : [{ x, y }, { x: x + w0, y }, { x: x + w0, y: y + h0 }, { x, y: y + h0 }];
      closed = true; resetResults(); render(); B.hideHover(); note('');
      showMeasure();
    }

    /* ---- measuring ---- */
    function cellsInside() {
      const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y), out = [];
      for (let x = Math.min.apply(null, xs); x < Math.max.apply(null, xs); x++) for (let y = Math.min.apply(null, ys); y < Math.max.apply(null, ys); y++) if (inside(pts, x + 0.5, y + 0.5)) out.push({ x, y });
      return out;
    }
    function sides() { return pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; return Math.abs(q.x - p.x) + Math.abs(q.y - p.y); }); }
    function showMeasure() {
      meas.innerHTML = '';
      if (!closed) return;
      if (!rectilinear()) {
        meas.appendChild(h('div', 'ix-note', 'This shape has <b>slanted</b> sides, so you cannot measure it by counting grid squares yet. That comes in later grades. Try a shape whose sides go straight across or straight up and down to measure area and perimeter. You can still fly it!'));
        return;
      }
      const cells = cellsInside(), sd = sides(), per = sd.reduce((a, b) => a + b, 0), area = cells.length;
      const st = { a: false, p: false };
      const mkRow = (label, kind, right, reveal) => {
        const r = h('div', 'sl-mrow');
        r.appendChild(h('div', 'ix-lab', label));
        const inp = h('input', 'sl-in'); inp.type = 'number'; inp.step = 'any'; inp.setAttribute('inputmode', 'numeric'); inp.setAttribute('aria-label', label);
        const chk = () => {
          const v = parseFloat(inp.value);
          if (isNaN(v)) { note('Type a number first.', 'no'); return; }
          if (v === right) { reveal(); }
          else if (kind === 'a' && v === per) note(`${v} is the perimeter. <b>Area</b> counts the squares <b>inside</b>.`, 'no');
          else if (kind === 'p' && v === area) note(`${v} is the area. <b>Perimeter</b> is the distance <b>around</b>.`, 'no');
          else note(kind === 'a' ? 'Not yet. Count the squares inside, or split the shape into rectangles.' : 'Not yet. Add up the length of every side.', 'no');
        };
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') chk(); });
        const b = btn('Check', chk, 'go');
        const line = h('div', 'sl-ansrow'); line.appendChild(inp); line.appendChild(b);
        r.appendChild(line);
        r.__done = (html) => { r.innerHTML = `<div class="sl-said">${html}</div>`; };
        return r;
      };
      const rowA = mkRow('Area (square units)', 'a', area, () => revealA());
      const rowP = mkRow('Perimeter (units)', 'p', per, () => revealP());
      const revealA = () => {
        if (st.a) return; st.a = true;
        B.shade(cells);
        const rt = pts.length === 4 ? `${sd[0]} × ${sd[1]} = ` : '';
        rowA.__done(`<b>Area = ${rt}${area}</b> square units`);
        note('✓ Area found. The shaded squares are the square units inside.', 'ok');
      };
      const revealP = () => {
        if (st.p) return; st.p = true;
        const c = centre(); for (let i = 0; i < pts.length; i++) B.sideLabel(pts[i], pts[(i + 1) % pts.length], c);
        rowP.__done(`<b>Perimeter = ${sd.join(' + ')} = ${per}</b> units`);
        note('✓ Perimeter found. Each side length is on the grid.', 'ok');
      };
      meas.appendChild(h('div', 'ix-note', 'Measure your shape. Guess first, then check!'));
      meas.appendChild(rowA); meas.appendChild(rowP);
      meas.appendChild(btn('Show me both', () => { revealA(); revealP(); }, 'ghost'));
      info2 = { area, per };
    }

    /* ---- flying ---- */
    function flyIt() {
      if (busy || pts.length < 2) return;
      busy = true; log.innerHTML = ''; drawButtons();
      const loop = closed ? pts.concat([pts[0]]) : pts.slice();
      const r = B.route(loop);
      const rect = loop.every((p, i) => i === 0 || dirOf(loop[i - 1], p) !== 'd');
      B.fly(r.pts, { skip: r.skip, onLeg: (i, a, b, len, total) => log.appendChild(h('li', '', B.legLine(a, b, len, total))) }, (total) => {
        log.appendChild(h('li', 'sum', rect
          ? (closed ? `🏁 Flew <b>${total}</b> units all the way around. That is the <b>perimeter</b>.` : `🏁 Flew <b>${total}</b> units along your path.`)
          : '🏁 Landed! Slanted legs are longer than they look, so we do not count them yet.'));
        busy = false; drawButtons();
      });
    }

    /* ---- grid taps ---- */
    B.zone.addEventListener('pointermove', (e) => { if (busy || closed) return; const q = B.snap(e); if (q) B.showHover(q); });
    B.zone.addEventListener('pointerdown', (e) => { e.preventDefault(); if (busy) return; const q = B.snap(e); if (!q) return; B.showHover(q); addPoint(q); });

    drawPick(); render();
  }

  /* =====================================================================
     3. TRICKS: count steps and measure rectangles from the numbers alone
     ===================================================================== */
  const gap = (a, b) => {
    const d = Math.abs(b - a);
    const how = a * b < 0 ? `${Math.abs(a)} + ${Math.abs(b)} = ${d} <i>(opposite signs: you pass through 0, so ADD)</i>`
      : `${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${d}`;
    return { d, how };
  };
  function stepsExplain(p, q) {
    const horiz = p.y === q.y, a = horiz ? p.x : p.y, b = horiz ? q.x : q.y, g = gap(a, b);
    const same = horiz ? `y = ${sgn(p.y)}` : `x = ${sgn(p.x)}`, ax = horiz ? 'x' : 'y';
    return { d: g.d, ax, a, b, html: `${horiz ? 'The y is the same' : 'The x is the same'} (${same}), so the points are lined up ${horiz ? 'flat across' : 'straight up and down'}. Only look at <b>${ax}</b>: ${sgn(a)} to ${sgn(b)}.<br><b>${g.how}</b>` };
  }
  /* Number line with one hop per step. Hops before 0 are blue and after 0 green when the trip crosses zero. */
  function nline(a, b, axis) {
    const lo = Math.min(a, b, 0) - 1, hi = Math.max(a, b, 0) + 1, W = 340, pad = 16, span = hi - lo;
    const sx = (v) => pad + (v - lo) * (W - 2 * pad) / span, Y = 74, cross = a * b < 0, dir = b > a ? 1 : -1, d = Math.abs(b - a);
    const s = mk('svg', { viewBox: `0 0 ${W} 112`, class: 'sl-nl', role: 'img', 'aria-label': `Number line from ${a} to ${b}` });
    s.appendChild(mk('line', { x1: pad - 6, y1: Y, x2: W - pad + 6, y2: Y, class: 'sl-nax' }));
    for (let v = lo; v <= hi; v++) {
      s.appendChild(mk('line', { x1: sx(v), y1: Y - 5, x2: sx(v), y2: Y + 5, class: 'sl-ntk' + (v === 0 ? ' z' : '') }));
      s.appendChild(mk('text', { x: sx(v), y: Y + 22, class: 'sl-nt' + (v === a || v === b || v === 0 ? ' on' : ''), 'text-anchor': 'middle' }, [sgn(v)]));
    }
    s.appendChild(mk('text', { x: W - 4, y: Y - 9, class: 'sl-nt ax', 'text-anchor': 'end' }, [axis + '-numbers']));
    for (let i = 0, v = a; i < d; i++, v += dir) {
      const x1 = sx(v), x2 = sx(v + dir), after = cross && (dir > 0 ? v >= 0 : v <= 0);
      const arc = mk('path', { d: `M${x1},${Y} Q${(x1 + x2) / 2},${Y - 30} ${x2},${Y}`, class: 'sl-hop ' + (after ? 'g' : 'b') });
      arc.style.setProperty('--d', (i * 85) + 'ms'); s.appendChild(arc);
      if (d <= 12) { const t = mk('text', { x: (x1 + x2) / 2, y: Y - 24, class: 'sl-hopn ' + (after ? 'g' : 'b'), 'text-anchor': 'middle' }, [String(i + 1)]); t.style.setProperty('--d', (i * 85 + 120) + 'ms'); s.appendChild(t); }
    }
    s.appendChild(mk('circle', { cx: sx(a), cy: Y, r: 5.5, class: 'cp-dot' }));
    s.appendChild(mk('circle', { cx: sx(b), cy: Y, r: 5.5, class: 'cp-dot sl-end' }));
    if (cross) {
      s.appendChild(mk('text', { x: sx(a / 2), y: 14, class: 'sl-cr ' + (a < 0 ? 'b' : 'g'), 'text-anchor': 'middle' }, [String(Math.abs(a))]));
      s.appendChild(mk('text', { x: sx(0), y: 14, class: 'sl-cr', 'text-anchor': 'middle' }, ['+']));
      s.appendChild(mk('text', { x: sx(b / 2), y: 14, class: 'sl-cr ' + (b < 0 ? 'b' : 'g'), 'text-anchor': 'middle' }, [String(Math.abs(b))]));
    }
    return s;
  }
  function miniGrid(pts, labels, quad, n) {
    const s = V.planeSVG([], { quad, n, size: 260 }), G = s.__geo, fx = s.querySelector('.cp-pts'), g = mk('g');
    s.insertBefore(g, fx);
    if (pts.length > 1) for (let i = 0; i < pts.length; i++) { if (pts.length === 2 && i === 1) break; const a = pts[i], b = pts[(i + 1) % pts.length]; const l = mk('line', { x1: G.px(a.x), y1: G.py(a.y), x2: G.px(b.x), y2: G.py(b.y), class: 'sl-edge ' + dirOf(a, b) }); g.appendChild(l); }
    pts.forEach((p, i) => { fx.appendChild(mk('circle', { cx: G.px(p.x), cy: G.py(p.y), r: 4.5, class: 'cp-dot' })); fx.appendChild(mk('text', { x: G.px(p.x) + 8, y: G.py(p.y) - 7, class: 'sl-vl' }, [labels[i]])); });
    const d = h('div', 'sl-mini'); d.appendChild(s); return d;
  }

  function tricks(host, api) {
    const adv = api.lvl === 'advanced', quad = adv, n = adv ? 6 : 8, lo = quad ? -n : 0;
    const best = load(), bestKey = 't' + (adv ? 'adv' : 'core'), NAMES = 'ABCD';
    host.innerHTML = `<h2>🧠 No-Grid Tricks · ${adv ? 'All four quadrants' : 'Quadrant I'}</h2>
      <p class="lede">Count steps and measure rectangles from the <b>numbers alone</b>, no grid needed. Try each one your own way first, then see the trick.</p>`;
    const bar = h('div', 'sp-modes'), area = h('div', 'sl-tr'); host.appendChild(bar); host.appendChild(area);

    function pline(kind, horiz) {
      if (horiz == null) horiz = Math.random() < 0.5;
      let a, b, tt = 0;
      do {
        tt++;
        if (kind === 'cross') { a = ri(1, n); b = -ri(1, n); }
        else if (kind === 'neg') { a = -ri(1, n); b = -ri(1, n); }
        else { a = ri(quad ? 1 : 0, n); b = ri(quad ? 1 : 0, n); }
        if (Math.random() < 0.5) { const t = a; a = b; b = t; }
      } while ((Math.abs(a - b) < 2) && tt < 100);
      const f = ri(lo, n);
      const p = horiz ? { x: a, y: f } : { x: f, y: a }, q = horiz ? { x: b, y: f } : { x: f, y: b };
      return { type: 'steps', p, q, ex: stepsExplain(p, q) };
    }
    function rectItem(type) {
      const w0 = ri(2, Math.min(7, n - lo)); let h0 = ri(2, Math.min(6, n - lo)); if (w0 === h0) h0 = h0 < 6 ? h0 + 1 : h0 - 1;
      const x1 = ri(lo, n - w0), y1 = ri(lo, n - h0), x2 = x1 + w0, y2 = y1 + h0, rot = ri(0, 3);
      const ccw = [{ x: x1, y: y1 }, { x: x2, y: y1 }, { x: x2, y: y2 }, { x: x1, y: y2 }];
      const c = ccw.slice(rot).concat(ccw.slice(0, rot)), it = { type, pts: c, R: { x1, y1, x2, y2 }, w0, h0 };
      if (type === 'side') { it.idx = ri(0, 3); it.P = c[it.idx]; it.Q = c[(it.idx + 1) % 4]; it.lab = NAMES[it.idx] + NAMES[(it.idx + 1) % 4]; it.ans = Math.abs(it.P.x - it.Q.x) + Math.abs(it.P.y - it.Q.y); }
      if (type === 'perim') it.ans = 2 * (w0 + h0);
      if (type === 'area') it.ans = w0 * h0;
      if (type === 'fourth') it.ans = c[3];
      return it;
    }
    const learnItems = () => {
      const L = [
        Object.assign(pline('pos', true), { title: '📘 Trick 1 · What is the same?', intro: 'Two points. Look for the number that <b>matches</b>. Try it your own way first.' }),
        Object.assign(pline('pos', false), { title: '📘 Trick 2 · Up and down works the same', intro: 'This time the <b>x</b> matches. Which number do you look at now?' })
      ];
      if (adv) {
        L.push(Object.assign(pline('cross', Math.random() < 0.5), { title: '📘 Trick 3 · Crossing zero', intro: 'One number is negative, one is positive. Think: steps <b>to 0</b>, then steps <b>past 0</b>.' }));
        L.push(Object.assign(pline('neg', Math.random() < 0.5), { title: '📘 Trick 4 · Both negative', intro: 'Same side of zero: ignore the minus signs, then subtract.' }));
      }
      L.push(Object.assign(rectItem('perim'), { title: '📘 Trick ' + (adv ? 5 : 3) + ' · Rectangles have two x\'s and two y\'s', intro: 'Corners are listed in order around the rectangle. Find the two different x\'s and the two different y\'s.' }));
      return L;
    };
    const PRACTICE = ['steps', 'steps', 'steps', 'side', 'steps', 'perim', 'area', 'steps', 'fourth', 'side'];
    const practiceItems = () => PRACTICE.map((t) => t === 'steps' ? pline(quad ? ['cross', 'cross', 'neg', 'pos'][ri(0, 3)] : 'pos') : rectItem(t));

    const pairH = (p) => pair(p.x, p.y);
    const chipRow = (it) => it.pts.map((p, k) => `<span class="sl-chip">${NAMES[k]} ${pairH(p)}</span>`).join(' ');
    function qHtml(it) {
      if (it.type === 'steps') return `How many steps from <b>P</b> ${pairH(it.p)} to <b>Q</b> ${pairH(it.q)}?`;
      if (it.type === 'side') return `A rectangle's corners, in order, are below. How long is side <b>${it.lab}</b>?`;
      if (it.type === 'perim') return 'A rectangle\'s corners, in order, are below. Find its <b>perimeter</b>.';
      if (it.type === 'area') return 'A rectangle\'s corners, in order, are below. Find its <b>area</b>.';
      return 'Three corners of a rectangle are below. Find corner <b>D</b>.';
    }
    function hintOf(it) {
      if (it.type === 'steps') return 'Which number is the <b>same</b> in both points? Ignore it, and count steps between the <b>other</b> numbers.';
      if (it.type === 'side') return 'Neighbors share an x or a y. Ignore the shared number and find the gap between the other two.';
      if (it.type === 'fourth') return 'The missing corner uses the x that shows up <b>once</b> and the y that shows up <b>once</b>.';
      return 'Length = gap between the two different x\'s. Width = gap between the two different y\'s.';
    }
    function trickHtml(it, box) {
      if (it.type === 'steps') { box.appendChild(h('div', '', it.ex.html)); box.appendChild(nline(it.ex.a, it.ex.b, it.ex.ax)); return [[it.p, it.q], ['P', 'Q']]; }
      if (it.type === 'side') {
        const e = stepsExplain(it.P, it.Q);
        box.appendChild(h('div', '', `Side <b>${it.lab}</b>: ${e.html}`)); box.appendChild(nline(e.a, e.b, e.ax)); return [it.pts, ['A', 'B', 'C', 'D']];
      }
      const R = it.R, gx = gap(R.x1, R.x2), gy = gap(R.y1, R.y2);
      if (it.type === 'fourth') {
        const D = it.pts[3], xs = it.pts.slice(0, 3).map((p) => p.x), ys = it.pts.slice(0, 3).map((p) => p.y);
        box.appendChild(h('div', '', `x's: ${xs.map(sgn).join(', ')}. The one that shows up <b>once</b> is <b>${sgn(D.x)}</b>.<br>y's: ${ys.map(sgn).join(', ')}. The one that shows up <b>once</b> is <b>${sgn(D.y)}</b>.<br>So D = ${pairH(D)}.`));
        return [it.pts, ['A', 'B', 'C', 'D']];
      }
      box.appendChild(h('div', '', `Only two different x's (<b>${sgn(R.x1)}</b> and <b>${sgn(R.x2)}</b>) and two different y's (<b>${sgn(R.y1)}</b> and <b>${sgn(R.y2)}</b>).<br>Length: <b>${gx.how}</b><br>Width: <b>${gy.how}</b><br>${it.type === 'area' ? `Area = ${it.w0} × ${it.h0} = <b>${it.w0 * it.h0}</b> square units` : `Perimeter = 2 × (${it.w0} + ${it.h0}) = <b>${2 * (it.w0 + it.h0)}</b> units`}`));
      box.appendChild(nline(R.x1, R.x2, 'x')); box.appendChild(nline(R.y1, R.y2, 'y'));
      return [it.pts, ['A', 'B', 'C', 'D']];
    }

    function run(items, learn) {
      let i = 0, stars = 0, streak = 0;
      area.innerHTML = '';
      const hud = h('div', 'sp-hud'), card = h('div', 'sl-trcard'); area.appendChild(hud); area.appendChild(card);
      const drawHud = () => {
        hud.innerHTML = learn ? `<span>Trick ${Math.min(i + 1, items.length)} / ${items.length}</span>`
          : `<span>Question ${Math.min(i + 1, items.length)} / ${items.length}</span><span class="sp-stars">⭐ ${stars}</span>${streak > 1 ? `<span>🔥 ${streak} in a row</span>` : ''}${best[bestKey] != null ? `<span>Best ${best[bestKey]} / ${items.length}</span>` : ''}`;
      };
      function show() {
        const it = items[i]; let tries = 0, done = false, fx = 0, fy = 0; drawHud(); card.innerHTML = '';
        const m = h('div', 'sp-mission'); m.innerHTML = `<div class="k">${learn ? it.title : '🧠 No-grid question'}</div><div class="t">${qHtml(it)}</div>${learn ? `<div class="ix-note">${it.intro}</div>` : ''}`;
        card.appendChild(m);
        if (it.pts) card.appendChild(h('div', 'sl-chips', it.type === 'fourth' ? it.pts.slice(0, 3).map((p, k) => `<span class="sl-chip">${NAMES[k]} ${pairH(p)}</span>`).join(' ') : chipRow(it)));
        const inRow = h('div', 'sl-ansrow'), fb = h('div', 'ix-fb'), trick = h('div', 'sl-trick ph', '<div class="k">✨ The trick</div><div>Give it a try first. The trick shows up here.</div>'), nav = h('div', 'ix-ctr');
        let inp = null, inY = null;
        if (it.type === 'fourth') {
          const mkStep = (lab, get, set, color) => {
            const w1 = h('div', 'sp-step'), v = h('span', 'ix-val', sgn(get())); v.style.color = color;
            w1.appendChild(h('span', 'ix-lab', `<span style="color:${color}">${lab}</span>`));
            w1.appendChild(btn('−', () => { set(Math.max(lo, get() - 1)); v.textContent = sgn(get()); })); w1.appendChild(v); w1.appendChild(btn('+', () => { set(Math.min(n, get() + 1)); v.textContent = sgn(get()); }));
            inRow.appendChild(w1);
          };
          mkStep('D x', () => fx, (v) => { fx = v; }, 'var(--cp-x)'); mkStep('D y', () => fy, (v) => { fy = v; }, 'var(--cp-y)');
        } else {
          inp = h('input', 'sl-in'); inp.type = 'number'; inp.step = 'any'; inp.setAttribute('inputmode', 'numeric'); inp.setAttribute('aria-label', 'Your answer');
          inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
          inRow.appendChild(h('div', 'ix-lab', it.type === 'area' ? 'Area (square units)' : it.type === 'perim' ? 'Perimeter (units)' : 'Steps')); inRow.appendChild(inp);
        }
        const go = btn('Check', check, 'go'); inRow.appendChild(go);
        card.appendChild(inRow); card.appendChild(fb); card.appendChild(trick); card.appendChild(nav);
        function reveal() {
          done = true; inRow.querySelectorAll('button,input').forEach((e) => { e.disabled = true; });
          trick.classList.remove('ph'); trick.innerHTML = ''; trick.appendChild(h('div', 'k', '✨ The trick'));
          const g = trickHtml(it, trick);
          const gridBox = h('div', 'sl-gridbox');
          trick.appendChild(btn('Show it on the grid 🗺️', function () { if (gridBox.firstChild) { gridBox.innerHTML = ''; this.textContent = 'Show it on the grid 🗺️'; } else { gridBox.appendChild(miniGrid(g[0], g[1], quad, n)); this.textContent = 'Hide the grid'; } }, 'ghost'));
          trick.appendChild(gridBox);
          nav.innerHTML = '';
          nav.appendChild(btn(i + 1 >= items.length ? (learn ? 'Go to practice 🏋️' : 'Finish round') : 'Next →', () => { i++; if (i >= items.length) finish(); else show(); }, 'go'));
          see(nav);
        }
        function check() {
          if (done) return;
          let ok, shown;
          if (it.type === 'fourth') { ok = fx === it.ans.x && fy === it.ans.y; }
          else {
            const v = parseFloat(inp.value); if (isNaN(v)) { fb.className = 'ix-fb no'; fb.innerHTML = 'Type a number first.'; return; }
            const right = it.type === 'steps' ? it.ex.d : it.ans; ok = v === right;
          }
          tries++;
          if (ok) {
            const first = tries === 1;
            if (!learn) { if (first) { stars++; streak++; if (api.addXP) api.addXP(2); } else streak = 0; }
            fb.className = 'ix-fb ok'; fb.innerHTML = learn ? (first ? '✓ You got it your own way! Here is the trick that works for any size.' : '✓ Yes! Here is the trick that works for any size.') : (first ? '⭐ Perfect!' : '✓ Yes!');
            drawHud(); reveal();
          } else if (learn || tries >= 2) {
            if (!learn) { streak = 0; drawHud(); }
            fb.className = 'ix-fb no'; fb.innerHTML = learn ? 'Not quite. Here is the trick:' : 'Not this time. Here is the trick, so it sticks:'; reveal();
          } else {
            fb.className = 'ix-fb no'; fb.innerHTML = '💡 ' + hintOf(it); see(fb);
          }
        }
        see(m);
      }
      function finish() {
        if (learn) { setTab('practice'); return; }
        if (api.addXP) api.addXP(5);
        if (best[bestKey] == null || stars > best[bestKey]) { best[bestKey] = stars; keep(best); }
        card.innerHTML = ''; drawHud();
        const msg = stars === items.length ? 'Flawless! Every answer on the first try.' : stars >= items.length - 2 ? 'Sharp! Just a bump or two.' : 'Round saved. The tricks get easier every time.';
        const m = h('div', 'sp-mission'); m.innerHTML = `<div class="k">🏁 Round complete (+5 XP)</div><div class="t">⭐ ${stars} / ${items.length} on the first try</div><div class="ix-note">${msg}</div>`;
        card.appendChild(m);
        const row = h('div', 'ix-ctr'); row.appendChild(btn('Practice again 🏋️', () => run(practiceItems(), false), 'go')); row.appendChild(btn('Review the tricks 📘', () => setTab('learn'), 'ghost')); card.appendChild(row);
      }
      show();
    }
    function setTab(m) {
      Array.prototype.forEach.call(bar.children, (b) => b.classList.toggle('on', b.getAttribute('data-m') === m));
      if (m === 'learn') run(learnItems(), true); else run(practiceItems(), false);
    }
    [['learn', '📘 Learn the tricks'], ['practice', '🏋️ Practice']].forEach((m) => { const b = btn(m[1], () => setTab(m[0])); b.setAttribute('data-m', m[0]); bar.appendChild(b); });
    setTab('learn');
  }

  w.ShapeLab = { guided, free, tricks };

})(window);
