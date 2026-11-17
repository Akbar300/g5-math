/* Star Pilot: a calm coordinate mini-game for Unit 11. No timer.
   Missions alternate: FLY (tap where to fly) and SCAN (read where the planet is).
   The ship always moves across first (x, blue trail), then up or down (y, green trail). */
(function (w) {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (n, a, kids) => { const e = document.createElementNS(NS, n); for (const k in (a || {})) e.setAttribute(k, a[k]); (kids || []).forEach((c) => e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)); return e; };
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const btn = (label, fn, cls) => { const b = h('button', 'ix-btn' + (cls ? ' ' + cls : ''), label); b.type = 'button'; b.onclick = fn; return b; };
  const sgn = (v) => (v < 0 ? '−' + (-v) : String(v));
  const pair = (x, y) => `(<span class="xv">${sgn(x)}</span>, <span class="yv">${sgn(y)}</span>)`;
  const KEY = 'g5lab_u11_starpilot';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const keep = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };
  const calm = () => w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PLANETS = ['var(--viz-violet)', 'var(--viz-gold)', 'var(--viz-rose)', 'var(--viz-teal)', 'var(--viz-blue)', 'var(--viz-lime)'];
  const ROUND = 8;

  function rocket() {
    const g = mk('g', { class: 'cp-ship' });
    const body = mk('g', { class: 'body', transform: 'translate(0 13)' });
    body.appendChild(mk('polygon', { class: 'flame', points: '-3,9 3,9 0,17', visibility: 'hidden' }));
    body.appendChild(mk('polygon', { class: 'fin', points: '-5,2 -10,10 -4,8' }));
    body.appendChild(mk('polygon', { class: 'fin', points: '5,2 10,10 4,8' }));
    body.appendChild(mk('path', { class: 'hull', d: 'M0,-13 C7,-6 7,4 4,9 L-4,9 C-7,4 -7,-6 0,-13 Z' }));
    body.appendChild(mk('circle', { class: 'win', cx: 0, cy: -3, r: 2.8 }));
    g.appendChild(body);
    return g;
  }
  function planet(cx, cy, color) {
    const g = mk('g', { class: 'cp-planet cp-pop' });
    g.appendChild(mk('circle', { cx, cy, r: 8, fill: color }));
    g.appendChild(mk('ellipse', { class: 'ring', cx, cy, rx: 13, ry: 4, transform: `rotate(-20 ${cx} ${cy})` }));
    return g;
  }
  function star(cx, cy) {
    const p = [];
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 4.5 : 11, a = -Math.PI / 2 + i * Math.PI / 5; p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
    return mk('polygon', { class: 'cp-star cp-pop', points: p.join(' ') });
  }

  function mount(host, api) {
    api = api || {};
    const adv = api.lvl === 'advanced';
    const quad = adv, n = adv ? 6 : 8, lo = quad ? -n : 0;
    const best = load();
    const bestKey = adv ? 'adv' : 'core';
    host.innerHTML = `<h2>🚀 Star Pilot · ${adv ? 'All four quadrants' : 'Quadrant I'}</h2>
      <p class="lede">Your ship starts at the origin (0, 0). It always flies <b style="color:var(--cp-x)">across first</b>, then <b style="color:var(--cp-y)">${adv ? 'up or down' : 'up'}</b>. ${ROUND} missions, no timer.${adv ? '' : ' Switch to <b>Advanced</b> for negative numbers.'}</p>`;
    const wrap = h('div', 'sp-wrap');
    const board = h('div', 'sp-board');
    const s = V.planeSVG([], { quad, n });
    const G = s.__geo;
    const fx = s.querySelector('.cp-pts');
    const trails = mk('g'); s.insertBefore(trails, fx);
    const hov = mk('circle', { r: 9, class: 'cp-hover', visibility: 'hidden' }); s.insertBefore(hov, fx);
    const ship = rocket(); s.appendChild(ship);
    const zone = mk('rect', { x: G.px(lo) - G.c / 2, y: G.py(n) - G.c / 2, width: (n - lo + 1) * G.c, height: (n - lo + 1) * G.c, class: 'cp-tapzone' });
    s.appendChild(zone);
    board.appendChild(s);
    wrap.appendChild(board);

    const side = h('div', 'sp-side');
    const hud = h('div', 'sp-hud');
    const mission = h('div', 'sp-mission');
    const pick = h('div', 'sp-pick');
    const row = h('div', 'ix-ctr');
    const fb = h('div', 'ix-fb');
    side.appendChild(hud); side.appendChild(mission); side.appendChild(pick); side.appendChild(row); side.appendChild(fb);
    wrap.appendChild(side);
    host.appendChild(wrap);

    let k = 0, stars = 0, streak = 0, tries = 0, cur = null, busy = false, aim = null, sx = 0, sy = 0, used = {};
    const place = (gx, gy, rot) => ship.setAttribute('transform', `translate(${G.px(gx)} ${G.py(gy)}) rotate(${rot || 0}) scale(${G.c < 22 ? 0.85 : 1})`);
    const flame = (on) => ship.querySelector('.flame').setAttribute('visibility', on ? 'visible' : 'hidden');

    function newTarget() {
      let x, y, t = 0;
      do {
        x = lo + Math.floor(Math.random() * (n - lo + 1));
        y = lo + Math.floor(Math.random() * (n - lo + 1));
        t++;
      } while (t < 50 && ((x === 0 && y === 0) || used[x + ',' + y] || (!quad && (x === 0 || y === 0) && Math.random() < 0.7) || (quad && k < 4 && (x === 0 || y === 0))));
      used[x + ',' + y] = 1;
      return { x, y, type: k % 2 ? 'scan' : 'fly', color: PLANETS[k % PLANETS.length] };
    }
    function drawHud() {
      hud.innerHTML = `<span>Mission ${Math.min(k + 1, ROUND)} / ${ROUND}</span><span class="sp-stars">⭐ ${stars}</span>${streak > 1 ? `<span>🔥 ${streak} in a row</span>` : ''}${best[bestKey] != null ? `<span>Best ${best[bestKey]} / ${ROUND}</span>` : ''}`;
    }
    function clearBoard() {
      while (fx.firstChild) fx.removeChild(fx.firstChild);
      while (trails.firstChild) trails.removeChild(trails.firstChild);
      place(0, 0, 90); flame(false);
    }
    function start() {
      cur = newTarget(); tries = 0; aim = null; sx = 0; sy = 0; busy = false;
      clearBoard(); drawHud(); fb.className = 'ix-fb'; fb.innerHTML = '';
      if (cur.type === 'fly') {
        mission.innerHTML = `<div class="k">🛰️ Fly mission</div><div class="t">Fly to ${pair(cur.x, cur.y)}</div><div class="ix-note">Tap the spot on the grid, then press Launch.</div>`;
        pick.innerHTML = '';
      } else {
        fx.appendChild(planet(G.px(cur.x), G.py(cur.y), cur.color));
        mission.innerHTML = `<div class="k">🔭 Scan mission</div><div class="t">A planet appeared! Where is it?</div><div class="ix-note">Set the coordinates, then send the ship.</div>`;
        drawPick();
      }
      row.innerHTML = '';
      row.appendChild(btn(cur.type === 'fly' ? 'Launch 🚀' : 'Send ship 🚀', go, 'go'));
    }
    function drawPick() {
      pick.innerHTML = '';
      const mkStep = (lab, get, set, color) => {
        const l = h('div', 'ix-lab', `<span style="color:${color}">${lab}</span>`);
        const st = h('div', 'sp-step');
        const v = h('span', 'ix-val', sgn(get()));
        v.style.color = color;
        st.appendChild(btn('−', () => { set(Math.max(lo, get() - 1)); v.textContent = sgn(get()); preview(); }));
        st.appendChild(v);
        st.appendChild(btn('+', () => { set(Math.min(n, get() + 1)); v.textContent = sgn(get()); preview(); }));
        pick.appendChild(l); pick.appendChild(st);
      };
      mkStep('x (across)', () => sx, (v) => { sx = v; }, 'var(--cp-x)');
      mkStep(quad ? 'y (up/down)' : 'y (up)', () => sy, (v) => { sy = v; }, 'var(--cp-y)');
      preview();
    }
    function preview() {
      hov.setAttribute('cx', G.px(sx)); hov.setAttribute('cy', G.py(sy)); hov.setAttribute('visibility', 'visible');
    }
    const snap = (e) => {
      const p = IX.svgPoint(s, e.clientX, e.clientY); if (!p) return null;
      const c = (v) => Math.max(lo, Math.min(n, v));
      return { x: c(Math.round((p.x - G.ox) / G.c)), y: c(Math.round((G.oy - p.y) / G.c)) };
    };
    zone.addEventListener('pointermove', (e) => {
      if (busy || !cur || cur.type !== 'fly' || aim) return;
      const q = snap(e); if (!q) return;
      hov.setAttribute('cx', G.px(q.x)); hov.setAttribute('cy', G.py(q.y)); hov.setAttribute('visibility', 'visible');
    });
    zone.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (busy || !cur || cur.type !== 'fly') return;
      const q = snap(e); if (!q) return;
      aim = q;
      hov.setAttribute('cx', G.px(q.x)); hov.setAttribute('cy', G.py(q.y)); hov.setAttribute('visibility', 'visible');
      mission.querySelector('.ix-note').innerHTML = `Target set at ${pair(q.x, q.y)}. Press Launch, or tap a different spot.`;
    });

    function fly(tx, ty, done) {
      const legs = [];
      if (tx) legs.push({ axis: 'x', from: 0, to: tx });
      if (ty) legs.push({ axis: 'y', from: 0, to: ty });
      let gx = 0, gy = 0;
      const per = calm() ? 0 : 130;
      flame(true);
      const runLeg = (i) => {
        if (i >= legs.length) { flame(false); place(gx, gy, ty > 0 ? 0 : ty < 0 ? 180 : (tx < 0 ? -90 : 90)); return done(gx, gy); }
        const L = legs[i];
        const rot = L.axis === 'x' ? (L.to > 0 ? 90 : -90) : (L.to > 0 ? 0 : 180);
        const line = mk('line', { class: 'cp-trail ' + L.axis, x1: G.px(gx), y1: G.py(gy), x2: G.px(gx), y2: G.py(gy) });
        trails.appendChild(line);
        const dur = Math.max(per ? 320 : 0, Math.abs(L.to) * per);
        const t0 = performance.now();
        const step = (now) => {
          const f = dur ? Math.min(1, (now - t0) / dur) : 1;
          const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
          const v = L.from + (L.to - L.from) * e;
          const cx = L.axis === 'x' ? v : gx, cy = L.axis === 'y' ? v : gy;
          place(cx, cy, rot);
          line.setAttribute('x2', G.px(cx)); line.setAttribute('y2', G.py(cy));
          if (f < 1) requestAnimationFrame(step);
          else { if (L.axis === 'x') gx = L.to; else gy = L.to; setTimeout(() => runLeg(i + 1), per ? 120 : 0); }
        };
        requestAnimationFrame(step);
      };
      runLeg(0);
    }

    function go() {
      if (busy) return;
      let tx, ty;
      if (cur.type === 'fly') {
        if (!aim) { fb.className = 'ix-fb no'; fb.innerHTML = 'Tap a spot on the grid first.'; return; }
        tx = aim.x; ty = aim.y;
      } else { tx = sx; ty = sy; }
      busy = true; tries++;
      hov.setAttribute('visibility', 'hidden');
      while (trails.firstChild) trails.removeChild(trails.firstChild);
      fx.querySelectorAll('.ghost,.cp-star,.cp-land').forEach((n) => n.remove());
      place(0, 0, 90);
      fly(tx, ty, (gx, gy) => land(gx, gy));
    }

    function land(gx, gy) {
      const spot = mk('circle', { cx: G.px(gx), cy: G.py(gy), r: 4.5, class: 'cp-dot cp-land cp-pop' });
      fx.appendChild(spot);
      const ok = gx === cur.x && gy === cur.y;
      if (ok) {
        if (cur.type === 'fly') fx.appendChild(planet(G.px(cur.x), G.py(cur.y), cur.color));
        fx.appendChild(star(G.px(cur.x), G.py(cur.y) + (cur.y < 0 ? 20 : -20)));
        fx.appendChild(spot);
        const first = tries === 1;
        if (first) { stars++; streak++; if (api.addXP) api.addXP(2); } else streak = 0;
        fb.className = 'ix-fb ok';
        fb.innerHTML = (first ? '⭐ Perfect landing! ' : 'Landed! ') + `${pair(cur.x, cur.y)} means ${moveText(cur.x, cur.y)}.`;
        drawHud();
        row.innerHTML = '';
        row.appendChild(btn(k + 1 >= ROUND ? 'Finish round' : 'Next mission →', () => { k++; k >= ROUND ? finish() : start(); }, 'go'));
        return;
      }
      busy = false; streak = 0; drawHud();
      fb.className = 'ix-fb no';
      const tx = cur.x, ty = cur.y;
      if (gx === ty && gy === tx) fb.innerHTML = `The ship went to ${pair(gx, gy)}. The numbers got swapped! <span class="xv">First number = across</span>, <span class="yv">second = ${quad ? 'up/down' : 'up'}</span>.`;
      else if (gy === ty) fb.innerHTML = `Good ${quad ? 'up/down' : 'up'} move! Check <b>across</b>: the ${cur.type === 'fly' ? 'target' : 'planet'} is at x = <span class="xv">${sgn(tx)}</span>.`;
      else if (gx === tx) fb.innerHTML = `Good across move! Check <b>${quad ? 'up/down' : 'up'}</b>: the ${cur.type === 'fly' ? 'target' : 'planet'} is at y = <span class="yv">${sgn(ty)}</span>.`;
      else fb.innerHTML = `Not there yet. Count from (0, 0): ${moveText(tx, ty)}.`;
      if (tries >= 2 && cur.type === 'fly') {
        fx.appendChild(mk('circle', { cx: G.px(tx), cy: G.py(ty), r: 9, class: 'cp-dot ghost' }));
        fb.innerHTML += ' The dashed circle shows the target.';
      }
      if (cur.type === 'fly') aim = null;
      mission.querySelector('.ix-note').innerHTML = cur.type === 'fly' ? 'Tap a new spot, then Launch again.' : 'Fix the numbers, then send the ship again.';
    }
    function moveText(x, y) {
      const a = x === 0 ? 'no across move' : `<span class="xv">${Math.abs(x)} ${x > 0 ? 'right' : 'left'}</span>`;
      const b = y === 0 ? 'no up/down move' : `<span class="yv">${Math.abs(y)} ${y > 0 ? 'up' : 'down'}</span>`;
      return `${a}, then ${b}`;
    }
    function finish() {
      if (api.addXP) api.addXP(5);
      if (best[bestKey] == null || stars > best[bestKey]) { best[bestKey] = stars; keep(best); }
      clearBoard();
      hov.setAttribute('visibility', 'hidden');
      const msg = stars === ROUND ? 'Flawless flight! Every landing on the first try.' : stars >= ROUND - 2 ? 'Ace pilot! Just a couple of bumpy landings.' : 'Mission log saved. Each round makes the pattern easier.';
      mission.innerHTML = `<div class="k">🏁 Round complete (+5 XP)</div><div class="t">⭐ ${stars} / ${ROUND} perfect landings</div><div class="ix-note">${msg}</div>`;
      pick.innerHTML = ''; fb.className = 'ix-fb'; fb.innerHTML = '';
      drawHud();
      row.innerHTML = '';
      row.appendChild(btn('Fly again 🚀', () => { k = 0; stars = 0; streak = 0; used = {}; start(); }, 'go'));
    }
    start();
  }

  w.StarPilot = { mount };
})(window);
