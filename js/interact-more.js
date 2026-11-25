/* Small See it widgets (load after interact-num.js; they join window.IX):
     IX.percentBar    shade parts of a bar: 30% of 80
     IX.sorter        tap a card, tap a bucket
     IX.opsStepper    tap the operation that goes next (order of operations)
     IX.tapeDiagram   part-whole bar with an unknown; metric "same unit first" version
     IX.levelBars     move blocks until the stacks are even (mean as fair share)
     IX.divTester     divisibility tests on a number; 'digitsum' mode
     IX.arrayMaker    every rectangle of n squares; 'pairs' mode for shared factors / GCF
     IX.powerBuilder  repeated multiplication ↔ power ↔ value
     IX.compatPicker  choose friendly numbers to estimate a quotient
     IX.remainderStory  what the remainder means in the story
     IX.treeBuilder   grow a tree diagram, count the outcomes
     IX.checkTap      check a division: divisor × quotient + remainder = dividend
     IX.squareTest    type a number: last-digit test, then light up its neighbor squares
   House rules as interact-num.js: root "viz ix ix-col", ix-btn buttons, ix-fb feedback,
   44 px targets, first state already shows the card's numbers. */
(function (w) {
  const IX = w.IX = w.IX || {};
  const NS = 'http://www.w3.org/2000/svg';
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const btn = (label, onClick, cls) => { const b = h('button', 'ix-btn' + (cls ? ' ' + cls : ''), label); b.type = 'button'; b.onclick = onClick; return b; };
  const sv = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); if (parent) parent.appendChild(e); return e; };
  const calm = () => !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const fr = (n, d) => `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`;
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const nice = (v) => String(+(+v).toFixed(4));
  const shell = (cls) => { const root = h('div', 'viz ix ix-col xm ' + cls), fb = h('div', 'ix-fb'); return { root, fb }; };
  const say = (fb, ok, html) => { fb.className = 'ix-fb ' + (ok === true ? 'ok' : ok === false ? 'no' : ''); fb.innerHTML = html; };
  const shake = (el) => { if (calm()) return; el.classList.remove('xm-shake'); void el.offsetWidth; el.classList.add('xm-shake'); };
  const row = (cls) => h('div', 'xm-row' + (cls ? ' ' + cls : ''));

  /* ======================= percentBar { whole:80, parts:10, target:30, cuts:[10,4,2] } ======================= */
  function percentBar(o) {
    const { root, fb } = shell('xm-pct');
    const whole = o.whole || 100, cuts = o.cuts || [10, 4, 2];
    let parts = o.parts || 10, k = 0;
    if (o.target) root.appendChild(h('div', 'xm-q', `Shade <b>${o.target}%</b> of ${whole}.`));
    const top = row('xm-scale'), bar = h('div', 'xm-bar'), bot = row('xm-scale');
    root.appendChild(top); root.appendChild(bar); root.appendChild(bot);
    const cutRow = row(); root.appendChild(cutRow);
    const draw = () => {
      bar.innerHTML = ''; top.innerHTML = ''; bot.innerHTML = '';
      const nb = o.bars || 1; bar.className = nb > 1 ? 'xm-bars' : 'xm-bar';
      for (let j = 0; j < nb; j++) {
        const one = nb > 1 ? h('div', 'xm-bar') : bar; if (nb > 1) { bar.appendChild(h('div', 'xm-cap', `whole ${j + 1}: ${j * 100}% to ${(j + 1) * 100}%`)); bar.appendChild(one); }
        for (let q = 0; q < parts; q++) {
          const i = j * parts + q;
          const c = h('button', 'xm-cell' + (i < k ? ' on' : '')); c.type = 'button';
          c.setAttribute('aria-label', `Shade ${i + 1} of ${parts * nb} parts`);
          c.onclick = () => { k = (k === i + 1) ? i : i + 1; draw(); read(); };
          one.appendChild(c);
        }
      }
      if ((o.bars || 1) === 1) {
        top.appendChild(h('span', '', '0%')); top.appendChild(h('span', '', '50%')); top.appendChild(h('span', '', '100%'));
        bot.appendChild(h('span', '', '0')); bot.appendChild(h('span', '', nice(whole / 2))); bot.appendChild(h('span', '', String(whole)));
      }
      cutRow.innerHTML = '';
      cuts.forEach((n) => cutRow.appendChild(btn(`${n} parts`, () => { parts = n; k = 0; draw(); read(); }, n === parts ? 'on' : '')));
    };
    const read = () => {
      const each = whole / parts, pct = k * 100 / parts, val = k * each;
      if (!k) { say(fb, null, `Each part is ${nice(100 / parts)}% and worth ${nice(each)}. Tap parts to shade them.`); return; }
      const line = `${k} part${k > 1 ? 's' : ''} × ${nice(each)} = ${nice(val)}, so <b>${nice(pct)}% of ${whole} = ${nice(val)}</b>.`;
      if (o.target == null) say(fb, null, line);
      else if (Math.abs(pct - o.target) < 1e-9) say(fb, true, '✓ ' + line);
      else say(fb, false, `That is ${nice(pct)}%. You need ${o.target}%.` + (100 % (o.target || 1) && (o.target * parts) % 100 ? ' Try a different cut.' : ''));
    };
    draw(); read(); root.appendChild(fb);
    root.appendChild(row().appendChild(btn('↺ Reset', () => { parts = o.parts || 10; k = 0; draw(); read(); })).parentNode);
    return root;
  }

  /* ======================= sorter { buckets:['A','B'], cards:[{t, b, why}] } ======================= */
  function sorter(o) {
    const { root, fb } = shell('xm-sort');
    let sel = null, right = 0;
    const deck = row('xm-deck'), bins = row('xm-bins'), score = h('div', 'xm-chip');
    root.appendChild(h('div', 'xm-q', 'Tap a card, then tap the bucket it belongs in.'));
    root.appendChild(deck); root.appendChild(bins);
    const lists = o.buckets.map((name, bi) => {
      const box = h('div', 'xm-bin'), head = btn(name, () => drop(bi), 'xm-binb'), list = h('div', 'xm-binlist');
      box.appendChild(head); box.appendChild(list); bins.appendChild(box); return list;
    });
    const cards = o.cards.map((c) => {
      const b = btn(c.t, () => { if (b.disabled) return; cards.forEach((x) => x.classList.remove('on')); b.classList.add('on'); sel = { c, b }; say(fb, null, 'Now tap a bucket.'); }, 'xm-card');
      deck.appendChild(b); return b;
    });
    const upd = () => { score.textContent = `${right} of ${o.cards.length}`; };
    function drop(bi) {
      if (!sel) { say(fb, null, 'Tap a card first.'); return; }
      const { c, b } = sel;
      if (c.b === bi) {
        b.classList.remove('on'); b.disabled = true; b.remove();
        lists[bi].appendChild(h('div', 'xm-done', '✓ ' + c.t)); right++; sel = null; upd();
        say(fb, true, right === o.cards.length ? `All ${right} sorted!` + (o.end ? ' ' + o.end : '') : '✓ ' + (c.why || 'Right bucket.'));
      } else { shake(b); say(fb, false, c.why || 'Not that one. Think again.'); }
    }
    upd();
    const ctr = row(); ctr.appendChild(score); ctr.appendChild(btn('↺ Reset', () => { const n = sorter(o); root.replaceWith(n); }));
    root.appendChild(fb); root.appendChild(ctr); say(fb, null, 'Tap a card first.');
    return root;
  }

  /* ======================= opsStepper { expr:'24 ÷ 4 × 2 + 3' } ======================= */
  const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
  const supStr = (e) => String(e).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join('');
  function tokens(expr) {
    const out = []; let i = 0; const s = expr.replace(/\s+/g, '');
    while (i < s.length) {
      const ch = s[i];
      if (/[0-9.]/.test(ch)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; const t = { t: 'n', v: +s.slice(i, j) }; i = j;
        let e = ''; while (i < s.length && SUP[s[i]] != null) { e += SUP[s[i]]; i++; }
        if (s[i] === '^') { i++; let j2 = i; while (j2 < s.length && /[0-9]/.test(s[j2])) j2++; e = s.slice(i, j2); i = j2; }
        if (e !== '') t.e = +e; out.push(t); continue; }
      if ('+-−×*÷/'.includes(ch)) { out.push({ t: 'o', v: ch === '-' ? '−' : ch === '*' ? '×' : ch === '/' ? '÷' : ch }); i++; continue; }
      if (ch === '(' || ch === ')') { out.push({ t: ch }); i++; continue; }
      i++;
    }
    return out;
  }
  const ap = (a, op, b) => (op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b);
  /* index of the token that must be done next: a number with an exponent, or an operator; plus the reason */
  function nextStep(T) {
    let lo = 0, hi = T.length - 1, inParen = false;
    let depth = 0, best = -1, bestD = 0;
    T.forEach((t, i) => { if (t.t === '(') { depth++; if (depth > bestD) { bestD = depth; best = i; } } if (t.t === ')') depth--; });
    if (best >= 0) { lo = best + 1; hi = lo; while (T[hi].t !== ')') hi++; hi--; inParen = true; }
    for (let i = lo; i <= hi; i++) if (T[i].t === 'n' && T[i].e != null) return { i, kind: 'pow', inParen };
    for (let i = lo; i <= hi; i++) if (T[i].t === 'o' && (T[i].v === '×' || T[i].v === '÷')) return { i, kind: 'md', inParen };
    for (let i = lo; i <= hi; i++) if (T[i].t === 'o') return { i, kind: 'as', inParen };
    return null;
  }
  function opsStepper(o) {
    const { root, fb } = shell('xm-ops');
    let T = tokens(o.expr), done = false;
    const line = row('xm-expr'), log = h('ol', 'xm-log');
    root.appendChild(h('div', 'xm-q', 'Tap the operation that goes next.'));
    root.appendChild(line); root.appendChild(fb); root.appendChild(log);
    const tidy = () => { /* drop parentheses around a single number */
      for (let i = 0; i + 2 < T.length; i++) if (T[i].t === '(' && T[i + 1].t === 'n' && T[i + 2].t === ')') { T.splice(i + 2, 1); T.splice(i, 1); i = -1; }
    };
    const show = () => T.map((t) => (t.t === 'n' ? nice(t.v) + (t.e != null ? supStr(t.e) : '') : t.t === 'o' ? t.v : t.t)).join(' ').replace(/\( /g, '(').replace(/ \)/g, ')');
    const draw = () => {
      line.innerHTML = '';
      T.forEach((t, i) => {
        if (t.t === 'n') {
          const label = nice(t.v) + (t.e != null ? `<sup>${t.e}</sup>` : '');
          if (t.e != null && !done) line.appendChild(btn(label, () => tap(i), 'xm-tok xm-pow'));
          else line.appendChild(h('span', 'xm-num', label));
        } else if (t.t === 'o') line.appendChild(done ? h('span', 'xm-num', t.v) : btn(t.v, () => tap(i), 'xm-tok'));
        else line.appendChild(h('span', 'xm-par', t.t));
      });
    };
    function tap(i) {
      const nx = nextStep(T); if (!nx) return;
      if (i !== nx.i) {
        const t = T[i], want = T[nx.i];
        let why;
        if (nx.inParen && !(isInside(i))) why = 'Parentheses first: work inside ( ) before anything else.';
        else if (nx.kind === 'pow') why = 'Powers come right after parentheses. Do ' + nice(want.v) + supStr(want.e) + ' first.';
        else if (nx.kind === 'md' && t.t === 'o' && (t.v === '+' || t.v === '−')) why = '× and ÷ come before + and −.';
        else if (nx.kind === 'md') why = '× and ÷ are partners. Go left to right: ' + want.v + ' comes first here.';
        else why = '+ and − are partners. Go left to right: ' + want.v + ' comes first here.';
        say(fb, false, why); return;
      }
      const before = show();
      if (nx.kind === 'pow') { const t = T[i]; const v = Math.pow(t.v, t.e); log.appendChild(h('li', '', `${nice(t.v)}${supStr(t.e)} = ${Array(t.e).fill(nice(t.v)).join(' × ')} = <b>${nice(v)}</b>`)); T[i] = { t: 'n', v }; }
      else { const a = T[i - 1].v, b = T[i + 1].v, v = ap(a, T[i].v, b); log.appendChild(h('li', '', `${nice(a)} ${T[i].v} ${nice(b)} = <b>${nice(v)}</b>`)); T.splice(i - 1, 3, { t: 'n', v }); }
      tidy();
      if (T.length === 1) { done = true; say(fb, true, `✓ ${o.expr} = <b>${nice(T[0].v)}</b>`); }
      else say(fb, true, `✓ ${before} → ${show()}`);
      draw();
    }
    function isInside(i) { let d = 0; for (let j = 0; j < i; j++) { if (T[j].t === '(') d++; if (T[j].t === ')') d--; } return d > 0; }
    draw(); say(fb, null, o.hint || 'Parentheses, then powers, then × ÷ left to right, then + − left to right.');
    const ctr = row(); ctr.appendChild(btn('↺ Start over', () => { T = tokens(o.expr); done = false; log.innerHTML = ''; draw(); say(fb, null, 'Tap the operation that goes next.'); }));
    root.appendChild(ctr);
    return root;
  }

  /* ======================= tapeDiagram ======================= */
  /* { total:42, parts:[{v:'p'},{v:15}], unit:'' }  or metric { total:'2 m', convert:'200 cm', whole:200, cut:45, unit:'cm' } */
  function tapeDiagram(o) {
    const { root, fb } = shell('xm-tape');
    const tape = h('div', 'xm-tapebar'), brace = h('div', 'xm-brace'), ctr = row();
    root.appendChild(brace); root.appendChild(tape); root.appendChild(fb); root.appendChild(ctr);
    if (o.convert) {
      let stage = 0; const u = o.unit || '';
      const draw = () => {
        tape.innerHTML = ''; ctr.innerHTML = '';
        if (stage === 0) { brace.textContent = o.total; const s = h('div', 'xm-seg', o.total); s.style.flex = '1'; tape.appendChild(s);
          say(fb, null, `The cut is in ${u}, but the ${o.total} is not. Same unit first.`); ctr.appendChild(btn('Same unit first ▶', () => { stage = 1; draw(); }, 'go')); }
        else if (stage === 1) { brace.textContent = `${o.total} = ${o.convert}`; const s = h('div', 'xm-seg', o.convert); s.style.flex = '1'; tape.appendChild(s);
          say(fb, true, `✓ ${o.total} = ${o.convert}. Now both are in ${u}.`); ctr.appendChild(btn(`Cut ${o.cut} ${u} ▶`, () => { stage = 2; draw(); }, 'go')); }
        else { brace.textContent = o.convert; const left = o.whole - o.cut;
          const a = h('div', 'xm-seg xm-cut', `${o.cut} ${u}`), b = h('div', 'xm-seg', `${left} ${u}`); a.style.flex = String(o.cut); b.style.flex = String(left);
          tape.appendChild(a); tape.appendChild(b); say(fb, true, `✓ ${o.whole} − ${o.cut} = <b>${left} ${u}</b> left.`);
          ctr.appendChild(btn('↺ Again', () => { stage = 0; draw(); })); }
      };
      draw(); return root;
    }
    const known = o.parts.filter((p) => typeof p.v === 'number').reduce((s, p) => s + p.v, 0);
    const unk = o.parts.find((p) => typeof p.v !== 'number'), ans = o.total - known, u = o.unit ? ' ' + o.unit : '';
    brace.textContent = `${o.total}${u} in all`;
    o.parts.forEach((p) => {
      const isU = typeof p.v !== 'number', size = isU ? Math.max(ans, o.total * 0.15) : p.v;
      const s = isU ? btn(`${p.v} = ?`, () => { s.innerHTML = `${p.v} = <b>${ans}</b>`; s.classList.add('on');
        say(fb, true, `✓ ${o.total} − ${known} = <b>${ans}</b>, so ${p.v} = ${ans}. Check: ${ans} + ${known} = ${o.total}.`); }, 'xm-seg xm-unk')
        : h('div', 'xm-seg', `${p.v}${u}`);
      s.style.flex = String(size); tape.appendChild(s);
    });
    say(fb, null, (o.eq ? `Equation: <b>${o.eq}</b>. ` : '') + `Tap the ${unk ? unk.v : '?'} part to find it.`);
    return root;
  }

  /* ======================= levelBars { values:[3,7,5,9], label:'stickers' } ======================= */
  function levelBars(o) {
    const { root, fb } = shell('xm-level');
    let vals = o.values.slice(), from = -1;
    const total = vals.reduce((a, b) => a + b, 0), n = vals.length, mean = total / n, maxV = Math.max(...vals);
    const stage = row('xm-stacks'), ctr = row();
    root.appendChild(h('div', 'xm-q', 'Tap a tall stack, then a short stack, to move one block over.'));
    root.appendChild(stage); root.appendChild(fb); root.appendChild(ctr);
    const even = () => vals.every((v) => v === vals[0]);
    const draw = () => {
      stage.innerHTML = '';
      vals.forEach((v, i) => {
        const col = h('button', 'xm-stack' + (i === from ? ' on' : '')); col.type = 'button';
        col.style.height = (maxV * 22 + 30) + 'px';
        for (let k = 0; k < v; k++) col.appendChild(h('span', 'xm-block'));
        col.appendChild(h('span', 'xm-cnt', String(v)));
        col.onclick = () => pick(i); stage.appendChild(col);
      });
      if (even() && Number.isInteger(mean)) { const line = h('div', 'xm-meanline'); line.style.bottom = (mean * 22 + 24) + 'px'; stage.appendChild(line); }
    };
    function pick(i) {
      if (from < 0) { if (!vals[i]) return; from = i; draw(); say(fb, null, 'Now tap a shorter stack.'); return; }
      if (i === from) { from = -1; draw(); return; }
      vals[from]--; vals[i]++; from = -1; draw();
      if (even()) say(fb, true, `✓ Everyone has ${vals[0]}. ${total} ÷ ${n} = ${nice(mean)}, the <b>mean</b>.`);
      else say(fb, null, 'Keep going until every stack is the same.');
    }
    ctr.appendChild(btn('Pile and share', () => {
      if (Number.isInteger(mean)) vals = vals.map(() => mean); draw();
      say(fb, true, `Pile: ${o.values.join(' + ')} = ${total}. Share among ${n}: ${total} ÷ ${n} = <b>${nice(mean)}</b> each.`);
    }));
    ctr.appendChild(btn('↺ Reset', () => { vals = o.values.slice(); from = -1; draw(); say(fb, null, 'Tap a tall stack first.'); }));
    draw(); say(fb, null, `${o.values.join(', ')}${o.label ? ' ' + o.label : ''}. Tap a tall stack first.`);
    return root;
  }

  /* ======================= divTester { n:51, tests:[2,3,5] } or { mode:'digitsum', n:2026, by:9 } ======================= */
  const digitsOf = (n) => String(n).split('').map(Number);
  function divTester(o) {
    const { root, fb } = shell('xm-div');
    const big = h('div', 'xm-bignum'), ctr = row();
    root.appendChild(big); root.appendChild(ctr); root.appendChild(fb);
    const paint = (n, hiCount, hiAll) => { const s = String(n); big.innerHTML = s.split('').map((d, i) => `<span class="${hiAll || i >= s.length - hiCount ? 'hi' : ''}">${d}</span>`).join(''); };
    if (o.mode === 'digitsum') {
      let cur = o.n; const by = o.by || 9, chain = [o.n];
      paint(cur, 0, false);
      const step = btn('Add the digits ▶', () => {
        const ds = digitsOf(cur), s = ds.reduce((a, b) => a + b, 0);
        const line = `${ds.join(' + ')} = ${s}`; cur = s; chain.push(s); paint(cur, 0, true);
        if (cur < 10) {
          const r = cur % by, q = (o.n - (o.n % by)) / by;
          step.disabled = true;
          say(fb, true, `${line}. ${chain.join(' → ')}. ${o.n} ÷ ${by} has <b>remainder ${o.n % by}</b>` + (r === o.n % by ? '' : '') + `. Check: ${by} × ${q} = ${by * q}, and ${by * q} + ${o.n % by} = ${o.n}.`);
        } else say(fb, null, `${line}. Still more than one digit: add again.`);
      }, 'go');
      ctr.appendChild(step); ctr.appendChild(btn('↺ Reset', () => { const nw = divTester(o); root.replaceWith(nw); }));
      say(fb, null, `Remainder trick for ÷ ${by}: add the digits until one digit is left.`);
      return root;
    }
    let n = o.n; paint(n, 0, false);
    const test = (d) => {
      const s = String(n), last = +s.slice(-1), ds = digitsOf(n), sum = ds.reduce((a, b) => a + b, 0), ok = n % d === 0;
      let hiC = 1, hiAll = false, why;
      if (d === 2) why = `Last digit ${last} is ${last % 2 ? 'odd' : 'even'}.`;
      else if (d === 5) why = `Last digit ${last} ${last === 0 || last === 5 ? 'is' : 'is not'} 0 or 5.`;
      else if (d === 10) why = `Last digit ${last} ${last === 0 ? 'is' : 'is not'} 0.`;
      else if (d === 4) { hiC = 2; why = `Last two digits ${+s.slice(-2)} ${(+s.slice(-2)) % 4 ? 'are not' : 'are'} a multiple of 4.`; }
      else if (d === 8) { hiC = 3; why = `Last three digits ${+s.slice(-3)} ${(+s.slice(-3)) % 8 ? 'are not' : 'are'} a multiple of 8.`; }
      else if (d === 3 || d === 9) { hiAll = true; why = `Digit sum ${ds.join(' + ')} = ${sum}${sum % d ? ' is not' : ' is'} a multiple of ${d}.`; }
      else if (d === 6) { hiAll = true; why = `÷ 6 needs ÷ 2 and ÷ 3: ${n % 2 ? 'odd' : 'even'}, digit sum ${sum}${sum % 3 ? ' (not ÷ 3)' : ' (÷ 3)'}.`; }
      else { hiAll = true; why = `${n} ÷ ${d} = ${nice(n / d)}.`; }
      paint(n, hiC, hiAll); say(fb, ok, `${ok ? '✓' : '✗'} ÷ ${d}: ${why} So ${n} <b>${ok ? 'is' : 'is not'}</b> divisible by ${d}.`);
    };
    (o.tests || [2, 3, 5]).forEach((d) => ctr.appendChild(btn('÷ ' + d, () => test(d))));
    if (o.more && o.more.length) { let mi = 0; ctr.appendChild(btn('Next number ▶', () => { mi = (mi + 1) % (o.more.length + 1); n = mi ? o.more[mi - 1] : o.n; paint(n, 0, false); say(fb, null, `Test ${n}.`); })); }
    say(fb, null, 'Tap a test. Watch which digits it looks at.');
    return root;
  }

  /* ======================= arrayMaker { n:12, pick:true } or { mode:'pairs', a:18, b:24 } ======================= */
  const factorsOf = (n) => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };
  function rectSvg(r, c) {
    const cell = Math.max(6, Math.min(16, Math.floor(150 / Math.max(r, c)))), W = c * cell + 2, H = r * cell + 2;
    const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'xm-arr' });
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) sv('rect', { x: 1 + j * cell, y: 1 + i * cell, width: cell - 1.5, height: cell - 1.5, rx: 2, fill: 'var(--teal)', stroke: 'var(--ink)', 'stroke-width': '1' }, s);
    return s;
  }
  function arrayMaker(o) {
    const { root, fb } = shell('xm-arrays');
    if (o.mode === 'pairs') {
      const A = factorsOf(o.a), B = factorsOf(o.b), shared = A.filter((x) => B.includes(x)), g = Math.max(...shared), got = new Set();
      root.appendChild(h('div', 'xm-q', `Tap every factor that ${o.a} and ${o.b} share.`));
      const mk = (n, F) => { const r = row('xm-flist'); r.appendChild(h('b', 'xm-lab', n + ':'));
        F.forEach((x) => r.appendChild(btn(String(x), (e) => tapF(x, e.currentTarget), 'xm-f'))); return r; };
      const ra = mk(o.a, A), rb = mk(o.b, B); root.appendChild(ra); root.appendChild(rb); root.appendChild(fb);
      function tapF(x, el) {
        if (!shared.includes(x)) { shake(el); say(fb, false, `${x} is not a factor of ${A.includes(x) ? o.b : o.a}.`); return; }
        got.add(x); root.querySelectorAll('.xm-f').forEach((b) => { if (+b.textContent.replace('👑', '') === x) b.classList.add('on'); });
        if (got.size === shared.length) {
          root.querySelectorAll('.xm-f').forEach((b) => { if (+b.textContent === g) b.innerHTML = '👑' + g; });
          say(fb, true, `✓ Shared: ${shared.join(', ')}. The greatest is the <b>GCF ${g}</b>.` + (o.simplify !== false ? ` So ${fr(o.a, o.b)} = ${fr(o.a / g, o.b / g)}.` : ''));
        } else say(fb, true, `✓ ${x} is shared. ${shared.length - got.size} more.`);
      }
      say(fb, null, 'Tap the shared factors.');
      return root;
    }
    let n = o.n || 12;
    const head = row(), box = row('xm-rects');
    root.appendChild(head); root.appendChild(box); root.appendChild(fb);
    const draw = () => {
      head.innerHTML = '';
      if (o.pick !== false) head.appendChild(btn('−', () => { if (n > 1) { n--; draw(); } }));
      head.appendChild(h('b', 'xm-n', `${n} squares`));
      if (o.pick !== false) head.appendChild(btn('+', () => { if (n < 30) { n++; draw(); } }));
      box.innerHTML = ''; const F = factorsOf(n), pairs = F.filter((x) => x * x <= n);
      pairs.forEach((r) => { const c = n / r, cell = h('div', 'xm-rect'); cell.appendChild(rectSvg(r, c)); cell.appendChild(h('div', 'xm-cap', `${r} × ${c}`)); box.appendChild(cell); });
      const kind = n === 1 ? '<b>neither</b> prime nor composite (only one factor)' : F.length === 2 ? '<b>prime</b>: only one rectangle' : `<b>composite</b>: ${pairs.length} rectangles`;
      say(fb, n === 1 ? null : true, `Factors of ${n}: ${F.join(', ')}. ${n} is ${kind}.`);
    };
    draw(); return root;
  }

  /* ======================= powerBuilder { base:10, exp:3, bases:[10], swap:false, max:6 } ======================= */
  function powerBuilder(o) {
    const { root, fb } = shell('xm-pow');
    let base = o.base || 10, e = o.exp || 3; const max = o.max || 6, bases = o.bases || [base];
    const out = h('div', 'xm-powout'), ctr = row(), bctr = row();
    root.appendChild(out); root.appendChild(ctr); if (bases.length > 1) root.appendChild(bctr); root.appendChild(fb);
    const draw = () => {
      const v = Math.pow(base, e);
      out.innerHTML = `<div class="xm-rep">${Array(e).fill(base).join(' × ')}</div><div class="xm-eq">= ${base}<sup>${e}</sup> = <b>${v}</b></div>`;
      ctr.innerHTML = ''; ctr.appendChild(btn('− 1', () => { if (e > 1) { e--; draw(); } })); ctr.appendChild(h('b', 'xm-n', `exponent ${e}`)); ctr.appendChild(btn('+ 1', () => { if (e < max) { e++; draw(); } }));
      bctr.innerHTML = ''; bases.forEach((b) => bctr.appendChild(btn('base ' + b, () => { base = b; draw(); }, b === base ? 'on' : '')));
      if (o.swap) bctr.appendChild(btn('Swap ⇄', () => { const a = base, c = e; if (c > max || !bases.includes(c)) { say(fb, false, 'Pick a base and exponent that can swap.'); return; } base = c; e = a; draw();
        say(fb, true, `${a}<sup>${c}</sup> = ${Math.pow(a, c)} but ${c}<sup>${a}</sup> = ${Math.pow(c, a)}. Swapping changes the value.`); }));
      if (base === 10) say(fb, null, `The exponent ${e} is the number of 10s multiplied, and the number of zeros: ${v}.`);
      else say(fb, null, `${base}<sup>${e}</sup> means ${e} factors of ${base}, not ${base} × ${e} = ${base * e}.`);
    };
    draw(); return root;
  }

  /* ======================= compatPicker { a:3196, b:38, as:[3000,3200,3600], bs:[35,40], exact:'84 R4' } ======================= */
  function compatPicker(o) {
    const { root, fb } = shell('xm-compat');
    let A = null, B = null;
    root.appendChild(h('div', 'xm-q', `Estimate <b>${o.a} ÷ ${o.b}</b>. Pick a friendly number for each.`));
    const ra = row('xm-flist'), rb = row('xm-flist');
    ra.appendChild(h('b', 'xm-lab', `${o.a} ≈`)); rb.appendChild(h('b', 'xm-lab', `${o.b} ≈`));
    const pick = (r, list, set) => list.forEach((v) => r.appendChild(btn(String(v), (ev) => { r.querySelectorAll('.ix-btn').forEach((x) => x.classList.remove('on')); ev.currentTarget.classList.add('on'); set(v); check(); })));
    pick(ra, o.as, (v) => { A = v; }); pick(rb, o.bs, (v) => { B = v; });
    root.appendChild(ra); root.appendChild(rb); root.appendChild(fb);
    function check() {
      if (A == null || B == null) { say(fb, null, 'Now pick the other one.'); return; }
      if (A % B === 0) say(fb, true, `✓ ${A} ÷ ${B} = <b>${A / B}</b>, a friendly estimate.` + (o.exact ? ` The exact answer is ${o.exact}: close ✓` : ''));
      else { const good = o.as.find((x) => o.bs.some((y) => x % y === 0)), gy = o.bs.find((y) => good % y === 0);
        say(fb, false, `${A} ÷ ${B} is not friendly. Try ${good} with ${gy}.`); }
    }
    say(fb, null, 'Pick one number from each row.');
    return root;
  }

  /* ======================= remainderStory { a:130, b:24, unit:'bus', units:'buses', item:'students' } ======================= */
  function remainderStory(o) {
    const { root, fb } = shell('xm-rem');
    const q = Math.floor(o.a / o.b), r = o.a % o.b, unit = o.unit || 'bus', units = o.units || unit + 's', item = o.item || 'students';
    root.appendChild(h('div', 'xm-q', `${o.a} ${item}, ${o.b} per ${unit}: ${o.a} ÷ ${o.b} = <b>${q} R${r}</b>`));
    const lot = row('xm-lot');
    for (let i = 0; i < q; i++) lot.appendChild(h('div', 'xm-veh full', `<span>${o.b}</span>`));
    if (r) lot.appendChild(h('div', 'xm-veh part', `<span>${r}</span>`));
    root.appendChild(lot);
    const asks = o.asks || [
      { q: `${units[0].toUpperCase() + units.slice(1)} needed?`, a: q + (r ? 1 : 0), why: `Round up: the ${r} left over still need a ${unit}.` },
      { q: `Full ${units}?`, a: q, why: `Drop the remainder: only ${q} ${units} are full.` },
      { q: `${item[0].toUpperCase() + item.slice(1)} on the last ${unit}?`, a: r, why: `The remainder is the answer: ${r} ${item}.` }
    ];
    const qr = row(), inp = h('input', 'xm-in'); inp.type = 'number'; inp.setAttribute('inputmode', 'numeric'); inp.setAttribute('aria-label', 'Your answer');
    let cur = null; const ans = row();
    asks.forEach((k) => qr.appendChild(btn(k.q, (ev) => { qr.querySelectorAll('.ix-btn').forEach((x) => x.classList.remove('on')); ev.currentTarget.classList.add('on'); cur = k; inp.value = ''; inp.focus(); say(fb, null, k.q + ' Type the number.'); })));
    const check = () => { if (!cur) { say(fb, null, 'Pick a question first.'); return; } const v = +inp.value;
      if (inp.value === '') return; if (v === cur.a) say(fb, true, `✓ ${cur.a}. ${cur.why}`); else say(fb, false, `Not ${v}. ${cur.why}`); };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
    ans.appendChild(inp); ans.appendChild(btn('Check', check, 'go'));
    root.appendChild(qr); root.appendChild(ans); root.appendChild(fb);
    if (o.checkLine !== false) root.appendChild(h('div', 'xm-cap', `Check: ${o.b} × ${q} + ${r} = ${o.b * q} + ${r} = ${o.a}`));
    say(fb, null, 'Same division, three questions. Pick one.');
    return root;
  }

  /* ======================= treeBuilder { stages:[['H','T'],['red','blue','green']] } ======================= */
  function treeBuilder(o) {
    const { root, fb } = shell('xm-tree');
    const stages = o.stages; let depth = o.start != null ? o.start : 1;
    const box = h('div', 'xm-treebox'), outs = h('div', 'xm-outs'), ctr = row();
    root.appendChild(box); root.appendChild(ctr); root.appendChild(fb); root.appendChild(outs);
    const draw = () => {
      const leaves = []; const walk = (path, d) => { if (d === depth) { leaves.push(path); return; } stages[d].forEach((x) => walk(path.concat(x), d + 1)); }; walk([], 0);
      const W = 340, colW = W / (depth + 1), H = Math.max(80, leaves.length * 26 + 10);
      const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'xm-treesvg', role: 'img', 'aria-label': 'Tree diagram' });
      const place = (d, idx, count) => ({ x: 20 + d * colW, y: (idx + 0.5) * H / count });
      sv('circle', { cx: 20, cy: H / 2, r: 6, fill: 'var(--ink)' }, s);
      for (let d = 1; d <= depth; d++) {
        let count = 1; for (let k = 0; k < d; k++) count *= stages[k].length;
        const per = stages[d - 1].length;
        for (let i = 0; i < count; i++) {
          const p = place(d, i, count), parent = place(d - 1, Math.floor(i / per), count / per);
          sv('line', { x1: parent.x, y1: parent.y, x2: p.x, y2: p.y, stroke: 'var(--muted)', 'stroke-width': '2' }, s);
          const t = sv('text', { x: p.x + 4, y: p.y + 4, 'font-size': '13', 'font-weight': '800', fill: 'var(--ink)' }, s); t.textContent = stages[d - 1][i % per];
        }
      }
      box.innerHTML = ''; box.appendChild(s);
      const counts = stages.slice(0, depth).map((x) => x.length);
      outs.innerHTML = depth ? '<b>Outcomes:</b> ' + leaves.map((p) => p.join('-')).join(', ') : '';
      if (depth === 0) say(fb, null, 'Tap Grow to branch the first choice.');
      else if (depth === stages.length) say(fb, true, `${counts.join(' × ')} = <b>${leaves.length}</b> outcomes ✓ Multiply the choices at each step.`);
      else say(fb, null, `${leaves.length} branches so far. Tap Grow: each one splits into ${stages[depth].length}.`);
      ctr.innerHTML = '';
      if (depth < stages.length) ctr.appendChild(btn('Grow ▶', () => { depth++; draw(); }, 'go'));
      ctr.appendChild(btn('↺ Reset', () => { depth = o.start != null ? o.start : 1; draw(); }));
    };
    draw(); return root;
  }

  /* ======================= checkTap { a:130, b:24 } ======================= */
  function checkTap(o) {
    const { root, fb } = shell('xm-check');
    const a = o.a, b = o.b, q = Math.floor(a / b), r = a % b, p = b * q;
    root.appendChild(h('div', 'xm-q', `${a} ÷ ${b} = <b>${q} R${r}</b>. Is it right? Work backward.`));
    const line = h('div', 'xm-expr xm-chkline'), opts = row('xm-flist'), log = h('ol', 'xm-log');
    root.appendChild(line); root.appendChild(opts); root.appendChild(fb); root.appendChild(log);
    const steps = [
      { ask: `Step 1: multiply the divisor by the quotient. ${b} × ${q} = ?`, a: p, wrong: [p - b, p + b], why: `${b} × ${q} = ${p}.`, show: `${b} × ${q} = <b>${p}</b>` },
      { ask: `Step 2: add the remainder. ${p} + ${r} = ?`, a: p + r, wrong: [p - r, p + r + 10], why: `${p} + ${r} = ${p + r}.`, show: `${p} + ${r} = <b>${p + r}</b>` }
    ];
    let k = 0;
    const draw = () => {
      opts.innerHTML = '';
      line.innerHTML = `${b} × ${k > 0 ? q : '<span class="hi">' + q + '</span>'} ${k >= 1 ? '+ <span class="' + (k === 1 ? 'hi' : '') + '">' + r + '</span>' : ''} ${k >= 2 ? '= ' + a : ''}`;
      if (k === steps.length) {
        say(fb, true, `✓ ${b} × ${q} + ${r} = <b>${a}</b>, the number we started with. And ${r} &lt; ${b}, so the remainder is not too big. The answer checks out.`);
        opts.appendChild(btn('↺ Again', () => { k = 0; log.innerHTML = ''; draw(); }));
        return;
      }
      const st = steps[k], choices = st.wrong.slice(); choices.splice((k + 1) % 3, 0, st.a);
      say(fb, null, st.ask);
      choices.forEach((v) => opts.appendChild(btn(String(v), (ev) => {
        if (v === st.a) { log.appendChild(h('li', '', st.show)); k++; draw(); }
        else { shake(ev.currentTarget); say(fb, false, `Not ${v}. ${st.ask.split('. ')[1]}`); }
      })));
    };
    draw(); return root;
  }

  /* ======================= squareTest { max:20, start:150 } ======================= */
  function squareTest(o) {
    const max = o.max || 20, { root, fb } = shell('xm-sqtest');
    const ans = row(), inp = h('input', 'xm-in'); inp.type = 'number'; inp.setAttribute('inputmode', 'numeric'); inp.setAttribute('aria-label', 'Number to test');
    if (o.start != null) inp.value = o.start;
    root.appendChild(h('div', 'xm-q', `Is it a perfect square? Type a number up to ${max * max}.`));
    ans.appendChild(inp); ans.appendChild(btn('Test', () => test(true), 'go'));
    root.appendChild(ans); root.appendChild(fb);
    const gal = h('div', '', w.V && w.V.squaresGallery ? w.V.squaresGallery(max) : ''); root.appendChild(gal);
    const tiles = () => gal.querySelectorAll('.sq-tile');
    function test(user) {
      tiles().forEach((t) => t.classList.remove('hl'));
      const x = Math.round(+inp.value);
      if (inp.value === '' || !(x >= 1)) { say(fb, null, 'Type a whole number first.'); return; }
      if (x > max * max) { say(fb, false, `Keep it at ${max * max} or less so it fits the list.`); return; }
      const r = Math.floor(Math.sqrt(x) + 1e-9), last = x % 10;
      const lightUp = (n) => { const t = tiles()[n - 1]; if (t) { t.classList.add('hl'); if (user && !calm() && t.scrollIntoView) t.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } };
      if (r * r === x) { lightUp(r); say(fb, true, `✓ Yes! ${r} × ${r} = <b>${x}</b>, so √${x} = ${r}.`); return; }
      const digit = [2, 3, 7, 8].indexOf(last) >= 0 ? `Quick test: it ends in ${last}, and no square ends in 2, 3, 7 or 8. ` : `It ends in ${last}, so the last-digit test can't rule it out. Check the neighbors. `;
      if (r >= 1) lightUp(r); lightUp(r + 1);
      say(fb, null, `${digit}${r ? r + '² = ' + r * r + ' &lt; ' : ''}<b>${x}</b> &lt; ${r + 1}² = ${(r + 1) * (r + 1)}. It sits between two squares, so <b>not</b> a perfect square.`);
    }
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') test(true); });
    if (o.start != null) test(); else say(fb, null, 'Type a number and tap Test.');
    return root;
  }

  Object.assign(IX, { percentBar, sorter, opsStepper, tapeDiagram, levelBars, divTester, arrayMaker, powerBuilder, compatPicker, remainderStory, treeBuilder, checkTap, squareTest });
})(window);
