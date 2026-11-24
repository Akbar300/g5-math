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
    /* Corner label: try the 4 spots around the dot (left/right x above/below) and take the one that stays on
       the board and keeps off the axes and their tick numbers. The side away from the shape's centre wins ties. */
    B.vlabel = (p, c) => {
      const S = G.S, txt = `(${sgn(p.x)}, ${sgn(p.y)})`, wd = txt.length * 6.4 + 2, X = G.px(p.x), Y = G.py(p.y);
      const wantR = p.x >= c.x, wantUp = p.y >= c.y, tick = G.quad ? 22 : 22;
      const hit = (r, q) => r.x0 < q.x1 && r.x1 > q.x0 && r.y0 < q.y1 && r.y1 > q.y0;
      const strips = [{ x0: G.ox - tick, x1: G.ox + 3, y0: -1e3, y1: 1e3 }, { x0: -1e3, x1: 1e3, y0: G.oy - 3, y1: G.oy + 19 }];
      let bestScore = 1e9, bx = X + 7, by = Y - 8, ba = 'start';
      [true, false].forEach((right) => [true, false].forEach((up) => {
        const x = X + (right ? 7 : -7), y = Y + (up ? -8 : 15);
        const r = { x0: right ? x : x - wd, x1: right ? x + wd : x, y0: y - 10, y1: y + 3 };
        let sc = (right === wantR ? 0 : 1) + (up === wantUp ? 0 : 0.5);
        if (r.x0 < 2 || r.x1 > S - 2 || r.y0 < 4 || r.y1 > S - 2) sc += 100;
        strips.forEach((q) => { if (hit(r, q)) sc += 20; });
        if (sc < bestScore) { bestScore = sc; bx = x; by = y; ba = right ? 'start' : 'end'; }
      }));
      const t = mk('text', { x: bx, y: by, class: 'sl-vl', 'text-anchor': ba }, [txt]);
      marks.appendChild(t); return t;
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
      if (t.fourth) t.given.forEach((p) => { B.dot(p); B.vlabel(p, c); });
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
        B.dot(target); B.vlabel(target, centre()); idx++; misses = 0;
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
      pts.forEach((p, i) => { B.dot(p, i === 0 && !closed && m >= 3 ? 'sl-start' : ''); B.vlabel(p, c); });
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

  w.ShapeLab = { guided, free };
})(window);
