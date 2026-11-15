/* Grade 5 Math Lab engine: Learn → Practice → Test Lab, Core/Advanced, print, paper work. */
(function (w) {
  const fr = (n, d) => (w.V && V.fr) ? V.fr(n, d) : `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`;
  w.fr = fr;

  const U = {
    gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; },
    simp(n, d) { const g = this.gcd(n, d); return [n / g, d / g]; },
    frs(n, d) { const s = this.simp(n, d); return fr(s[0], s[1]); },
    shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    strip(s) { return String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); },
    today() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); },
    eqNum(got, want) {
      const g = String(got).trim().toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ');
      const acc = Array.isArray(want) ? want : [want];
      return acc.some((w) => {
        const t = String(w).trim().toLowerCase().replace(/,/g, '');
        if (g === t) return true;
        const ng = Number(g), nw = Number(t);
        if (!isNaN(ng) && !isNaN(nw) && Math.abs(ng - nw) < 1e-9) return true;
        // mixed "1 3/4" or "7/4"
        const mix = g.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
        const frac = g.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
        if (mix) { const v = +mix[1] + ((mix[1][0] === '-') ? -1 : 1) * (+mix[2] / +mix[3]); if (!isNaN(nw) && Math.abs(v - nw) < 1e-9) return true; }
        if (frac) { const v = +frac[1] / +frac[2]; if (!isNaN(nw) && Math.abs(v - nw) < 1e-9) return true; }
        return false;
      });
    },
    valuesClose(a, b) {
      return a != null && b != null && isFinite(a) && isFinite(b) && Math.abs(a - b) < 1e-9;
    },
    /* A single number-name: fraction, mixed number, decimal, percent, or a:b ratio. Expressions and words return null. */
    parseChoiceValue(html) {
      if (html == null) return null;
      let t = String(html);
      if (/<(svg|table|img)\b/i.test(t)) return null;
      t = t.replace(/<span class="mix">\s*(-?\d+)\s*<span class="frac"><span class="n">(-?\d+)<\/span>\s*<span class="d">(-?\d+)<\/span><\/span>\s*<\/span>/g, ' $1 $2/$3 ');
      t = t.replace(/<span class="frac"><span class="n">(-?\d+)<\/span>\s*<span class="d">(-?\d+)<\/span><\/span>/g, ' $1/$2 ');
      t = t.replace(/<[^>]+>/g, ' ');
      t = t.replace(/&nbsp;|&#160;/gi, ' ').replace(/&minus;|−/g, '-').replace(/&times;|×/g, '×');
      t = t.replace(/\s+/g, ' ').trim();
      if (!t) return null;
      if (/[A-Za-z]/.test(t)) return null;
      if (/[<>≤≥=×÷+]/.test(t)) return null;
      if (/(?:^| )- /.test(t)) return null;
      let m;
      if ((m = t.match(/^(-?\d+(?:\.\d+)?)\s*%$/))) return Number(m[1]) / 100;
      if ((m = t.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/))) {
        const w = Number(m[1]), n = Number(m[2]), d = Number(m[3]);
        if (!d) return null;
        return w + (w < 0 ? -1 : 1) * (n / d);
      }
      if ((m = t.match(/^(-?\d+)\s*\/\s*(-?\d+)$/))) {
        const d = Number(m[2]);
        if (!d) return null;
        return Number(m[1]) / d;
      }
      if ((m = t.match(/^(-?\d+)\s*:\s*(-?\d+)$/))) {
        const d = Number(m[2]);
        if (!d) return null;
        return Number(m[1]) / d;
      }
      if ((m = t.match(/^-?\d+(?:\.\d+)?$/))) return Number(m[0]);
      return null;
    },
    expandCorrectChoices(ch, marked) {
      const idx = (Array.isArray(marked) ? marked : [marked]).map(Number).filter((i) => i >= 0 && i < ch.length);
      const vals = ch.map((c) => this.parseChoiceValue(c));
      const keys = idx.map((i) => vals[i]).filter((v) => v != null);
      if (!keys.length) return idx.slice().sort((a, b) => a - b);
      const out = [];
      for (let i = 0; i < ch.length; i++) {
        if (idx.indexOf(i) >= 0) { out.push(i); continue; }
        if (vals[i] != null && keys.some((k) => this.valuesClose(k, vals[i]))) out.push(i);
      }
      return out.sort((a, b) => a - b);
    },
    normalizeChoiceItem(item) {
      if (!item || !item.ch || !item.ch.length) return item;
      if (item.type && item.type !== 'mc' && item.type !== 'ms') return item;
      const marked = item.a != null ? item.a : item.ci;
      if (marked == null) return item;
      const idx = this.expandCorrectChoices(item.ch, marked);
      if (idx.length > 1) {
        return Object.assign({}, item, { type: 'ms', fmt: 'SELECT ALL', a: idx });
      }
      if (item.type === 'ms') return Object.assign({}, item, { a: idx });
      return item;
    }
  };
  w.U = U;


  function fracHTML(n, d) {
    return `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`;
  }
  function mixedHTML(w, n, d) {
    return `<span class="mix">${w}${fracHTML(n, d)}</span>`;
  }

  /* Display-only: turn 7/20 and 2 1/3 into stacked markup. Never used on answer keys for checking. */
  function formatFractionString(str) {
    let s = String(str);
    const slots = [];
    const stash = (re) => {
      s = s.replace(re, (m) => {
        slots.push(m);
        return '\0' + (slots.length - 1) + '\0';
      });
    };
    stash(/\bhttps?:\/\/[^\s<]+/gi);
    stash(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g);
    stash(/\b\d{4}\/\d{1,2}\/\d{1,2}\b/g);
    stash(/\b\d{1,4}\/\d{1,2}\/\d{1,4}\b/g);
    s = s.replace(/(-?\d+)\s+(\d+)\s*\/\s*(\d+)/g, (_, w, n, d) => mixedHTML(w, n, d));
    s = s.replace(/(-?\d+)\s*\/\s*(\d+)/g, (_, n, d) => fracHTML(n, d));
    s = s.replace(/\0(\d+)\0/g, (_, i) => slots[+i]);
    return s;
  }

  function formatFractionsIn(root) {
    if (!root) return root;
    const skipSel = 'script,style,textarea,input,svg,code,.frac,.mix,.paper,.ldiv,.paper-wrap';
    const walk = (node) => {
      if (node.nodeType === 1) {
        if (node.matches && node.matches(skipSel)) return;
        if (node.classList && (node.classList.contains('frac') || node.classList.contains('mix'))) return;
        const kids = [...node.childNodes];
        kids.forEach(walk);
        return;
      }
      if (node.nodeType !== 3) return;
      const t = node.nodeValue;
      if (!t || !/\d\s*\/\s*\d/.test(t)) return;
      const html = formatFractionString(t);
      if (html === t) return;
      const holder = document.createElement('span');
      holder.innerHTML = html;
      const parent = node.parentNode;
      while (holder.firstChild) parent.insertBefore(holder.firstChild, node);
      parent.removeChild(node);
    };
    walk(root);
    return root;
  }

  function formatHTML(html) {
    const box = document.createElement('div');
    box.innerHTML = String(html == null ? '' : html);
    formatFractionsIn(box);
    return box.innerHTML;
  }


  /* One tap = one action. Swallow the click that follows touchend, but allow a real second tap. */
  function bindTap(el, fn) {
    /* Fire on the real tap. Ignore only the leftover click that some browsers
       send after touchend — a second genuine tap still gets through. */
    let ignoreClick = false;
    el.addEventListener('touchend', (e) => {
      if (e.cancelable) e.preventDefault();
      ignoreClick = true;
      setTimeout(() => { ignoreClick = false; }, 700);
      if (el.disabled) return;
      fn(e);
    }, { passive: false });
    el.addEventListener('click', (e) => {
      if (ignoreClick) { e.preventDefault(); e.stopPropagation(); return; }
      if (el.disabled) return;
      fn(e);
    });
  }

  function isShortAnswer(raw) {
    const html = String(raw == null ? '' : raw);
    if (/class="(?:frac|mix)"/.test(html) && U.strip(html).length <= 18 && !/[A-Za-z]{3,}/.test(U.strip(html))) return true;
    const t = U.strip(html);
    if (!t) return false;
    if (/^-?\d+(\.\d+)?%?$/.test(t)) return true;
    if (/^-?\d+\s+\d+\s*\/\s*\d+$/.test(t)) return true;
    if (/^-?\d+\s*\/\s*\d+$/.test(t)) return true;
    if (/^-?\d+\s*[Rr]\s*-?\d+$/.test(t)) return true;
    if (/^-?\d+\s*:\s*-?\d+$/.test(t)) return true;
    if (t.length <= 8 && !/\s/.test(t)) return true;
    return false;
  }

  function optsLayout(options) {
    const texts = options.map((o) => U.strip(o));
    const n = texts.length || 1;
    const short = options.every(isShortAnswer);
    const maxLen = Math.max(...texts.map((t) => t.length), 0);
    const stage = document.querySelector('.stage');
    const width = Math.max(200, (stage ? stage.clientWidth : document.documentElement.clientWidth) - 48);
    const chipMin = short ? 68 : (maxLen > 28 ? 200 : 140);
    const maxPerRow = Math.max(1, Math.floor((width + 8) / (chipMin + 8)));
    let cols;
    if (!short && maxLen > 42) cols = 1;
    else if (short) {
      if (n <= maxPerRow) cols = n;
      else {
        cols = 1;
        for (let c = Math.min(maxPerRow, n); c >= 2; c--) {
          const last = n % c;
          if (last === 0 || last >= 2) { cols = c; break; }
        }
      }
    } else if (n === 3 && maxPerRow < 3) cols = 1;
    else cols = Math.min(2, maxPerRow, n);
    let cls = 'opts-col';
    if (cols === n && short) cls = 'opts-row';
    else if (cols >= 2) cls = 'opts-grid';
    return { cls, cols };
  }

  function optsClass(options) {
    return optsLayout(options).cls;
  }

  function store(key, val) {
    if (arguments.length === 1) {
      try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
    }
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* ---------- Paper work areas ---------- */
  function paperMultiply(a, b) {
    const A = String(a), B = String(b);
    const digitsA = A.split('').map(Number);
    const digitsB = B.split('').map(Number);
    const width = String(a * b).length + 1;
    const partials = [];
    let carryNote = [];
    digitsB.slice().reverse().forEach((db, j) => {
      let carry = 0, row = [];
      digitsA.slice().reverse().forEach((da) => {
        const p = da * db + carry;
        row.push(p % 10);
        carry = Math.floor(p / 10);
      });
      if (carry) row.push(carry);
      // pad for place shift
      const val = (a * db) * Math.pow(10, j);
      partials.push({ val, shift: j, db });
    });
    const ans = a * b;
    const wrap = document.createElement('div');
    wrap.className = 'paper-wrap';
    const table = document.createElement('div');
    table.className = 'paper';
    const cols = width;
    const mkCell = (cls, opts) => {
      const inp = document.createElement('input');
      inp.className = 'cell' + (cls ? ' ' + cls : '');
      inp.maxLength = 1;
      inp.inputMode = 'numeric';
      inp.dataset.expect = opts.expect != null ? String(opts.expect) : '';
      if (opts.fixed != null) { inp.value = opts.fixed; inp.readOnly = true; inp.classList.add('ghost'); }
      inp.addEventListener('input', () => {
        inp.value = inp.value.replace(/\D/g, '').slice(0, 1);
        if (inp.value && inp.nextElementSibling && inp.nextElementSibling.matches && inp.nextElementSibling.matches('input.cell') && !inp.nextElementSibling.readOnly) {
          /* stay; user tabs */
        }
      });
      return inp;
    };
    const rowOf = (numStr, { prefix, carryRow, expect } = {}) => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = `24px repeat(${cols}, 28px)`;
      row.style.justifyContent = 'center';
      row.style.gap = '0 2px';
      const lab = document.createElement('div'); lab.className = 'lbl'; lab.textContent = prefix || '';
      row.appendChild(lab);
      const pad = cols - numStr.length;
      for (let i = 0; i < cols; i++) {
        const ch = i >= pad ? numStr[i - pad] : '';
        const cell = mkCell(carryRow ? 'carry' : '', expect ? { expect: ch } : { fixed: ch });
        if (expect && !ch) { cell.style.visibility = 'hidden'; }
        row.appendChild(cell);
      }
      return row;
    };
    // factor rows (shown, not editable)
    table.appendChild(rowOf(A, { prefix: '' }));
    table.appendChild(rowOf(B, { prefix: '×' }));
    const bar1 = document.createElement('div');
    bar1.style.display = 'grid';
    bar1.style.gridTemplateColumns = `24px repeat(${cols}, 28px)`;
    bar1.style.justifyContent = 'center';
    bar1.style.gap = '0 2px';
    bar1.appendChild(document.createElement('div'));
    for (let i = 0; i < cols; i++) {
      const d = document.createElement('div'); d.className = 'bar'; d.style.height = '4px'; bar1.appendChild(d);
    }
    table.appendChild(bar1);
    // typeable partial products
    const expectRows = [];
    digitsB.slice().reverse().forEach((db, j) => {
      const val = String((a * db) * Math.pow(10, j));
      const r = rowOf(val, { prefix: j === 0 ? '' : '+', expect: true });
      expectRows.push(r);
      table.appendChild(r);
    });
    if (digitsB.length > 1) {
      const bar2 = bar1.cloneNode(true);
      table.appendChild(bar2);
      const ansRow = rowOf(String(ans), { prefix: '', expect: true });
      expectRows.push(ansRow);
      table.appendChild(ansRow);
    }
    wrap.appendChild(table);
    wrap.check = () => {
      const cells = [...wrap.querySelectorAll('input.cell[data-expect]')].filter((c) => c.dataset.expect !== '' && c.style.visibility !== 'hidden');
      let ok = true;
      cells.forEach((c) => {
        if (c.value !== c.dataset.expect) { ok = false; c.classList.add('wrong'); } else { c.classList.remove('wrong'); c.classList.add('right'); }
      });
      return ok && cells.length > 0;
    };
    wrap.reveal = () => {
      wrap.querySelectorAll('input.cell[data-expect]').forEach((c) => { if (c.dataset.expect) c.value = c.dataset.expect; });
    };
    return wrap;
  }

function paperDivide(dividend, divisor) {
    const q = Math.floor(dividend / divisor);
    const rem = dividend % divisor;
    const D = String(dividend);
    const n = D.length;
    const digits = D.split('').map(Number);

    // Simulate the paper algorithm; record the column of each quotient digit.
    const qCols = Array(n).fill('');
    const steps = [];
    let cur = 0, pos = 0, started = false;
    while (pos < n) {
      cur = cur * 10 + digits[pos];
      const col = pos;
      pos++;
      if (cur < divisor && !started && pos < n) continue;
      const qd = Math.floor(cur / divisor);
      qCols[col] = String(qd);
      started = true;
      const prod = qd * divisor;
      const diff = cur - prod;
      steps.push({
        col, qd, prod, diff, cur,
        prodStr: String(prod),
        diffStr: String(diff),
        bring: pos < n ? digits[pos] : null
      });
      cur = diff;
    }
    if (qCols.join('').replace(/^0+/, '') !== String(q) && String(q) !== qCols.join('').replace(/^0+/, '0')) {
      // Fallback: right-align the known quotient if simulation drifted.
      const Q = String(q);
      for (let i = 0; i < n; i++) qCols[i] = (i >= n - Q.length) ? Q[i - (n - Q.length)] : '';
    }

    const wrap = document.createElement('div');
    wrap.className = 'paper-wrap';
    const paper = document.createElement('div');
    paper.className = 'paper ldiv';
    paper.style.display = 'grid';
    paper.style.gridTemplateColumns = 'auto .55em repeat(' + n + ', var(--ldiv-cell)) auto';
    paper.style.columnGap = 'var(--ldiv-gap)';
    paper.style.gridTemplateRows = 'auto 6px auto';
    paper.setAttribute('aria-label', 'Long division of ' + dividend + ' divided by ' + divisor);

    const mkCell = (expect, extra) => {
      const inp = document.createElement('input');
      inp.className = 'cell';
      inp.maxLength = extra && extra.full ? 3 : 1;
      inp.inputMode = 'numeric';
      inp.dataset.expect = String(expect);
      if (extra && extra.full) inp.dataset.full = '1';
      if (extra && extra.width) inp.style.width = extra.width;
      inp.addEventListener('input', () => {
        inp.value = extra && extra.full ? inp.value.replace(/\D/g, '').slice(0, 3) : inp.value.replace(/\D/g, '').slice(0, 1);
      });
      return inp;
    };
    const place = (el, col, row, span) => {
      // col: -2 divisor, -1 bracket, 0..n-1 digits, n remainder
      el.style.gridColumn = (col + 3) + (span && span > 1 ? ' / span ' + span : '');
      el.style.gridRow = String(row);
      paper.appendChild(el);
    };

    // Row 1: quotient digits, aligned over the dividend.
    qCols.forEach((ch, i) => {
      if (ch === '') {
        const spacer = document.createElement('div');
        place(spacer, i, 1);
        return;
      }
      const inp = mkCell(ch);
      place(inp, i, 1);
    });
    if (rem) {
      const rbox = document.createElement('div');
      rbox.className = 'ldiv-r';
      rbox.appendChild(document.createTextNode('R'));
      rbox.appendChild(mkCell(rem, { full: true, width: '40px' }));
      place(rbox, n, 1);
    }

    // Overline + ) curve sit on the dividend row (row 3), same as the original arena sign.
    const bar = document.createElement('div');
    bar.className = 'ldiv-bar';
    bar.style.gridColumn = '2 / span ' + (n + 1);
    bar.style.gridRow = '3';
    paper.appendChild(bar);

    const divL = document.createElement('div');
    divL.className = 'ldiv-divisor';
    divL.textContent = String(divisor);
    place(divL, -2, 3);

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 10 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('ldiv-bracket');
    svg.style.gridColumn = '2';
    svg.style.gridRow = '3';
    const path = document.createElementNS(svgNS, 'path');
    // Original arena sign: ) curve (quadratic bulge toward the dividend) + overline.
    path.setAttribute('d', 'M0 0 Q20 52 0 104');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '3.5');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    paper.appendChild(svg);

    D.split('').forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ldiv-d';
      s.textContent = ch;
      place(s, i, 3);
    });

    // Work rows: product, underline, difference (+ brought-down digit on the same row).
    let row = 4;
    steps.forEach((step) => {
      const pStr = step.prodStr;
      const pStart = step.col - pStr.length + 1;
      const minus = document.createElement('div');
      minus.className = 'ldiv-minus';
      minus.textContent = '−';
      place(minus, -1, row);
      pStr.split('').forEach((ch, i) => {
        const inp = mkCell(ch);
        place(inp, pStart + i, row);
      });
      row++;
      const line = document.createElement('div');
      line.className = 'ldiv-minusbar';
      const lineStart = Math.max(0, pStart);
      const lineLen = step.col - lineStart + 1;
      line.style.gridColumn = (lineStart + 3) + ' / span ' + lineLen;
      line.style.gridRow = String(row);
      paper.appendChild(line);
      row++;
      const dStr = step.diffStr;
      const dStart = step.col - dStr.length + 1;
      dStr.split('').forEach((ch, i) => {
        const inp = mkCell(ch);
        place(inp, dStart + i, row);
      });
      if (step.bring != null) {
        const inp = mkCell(step.bring);
        place(inp, step.col + 1, row);
      }
      row++;
    });

    wrap.appendChild(paper);
    wrap.check = () => {
      const cells = [...wrap.querySelectorAll('input.cell[data-expect]')];
      let ok = true;
      cells.forEach((c) => {
        if (c.value !== c.dataset.expect) { ok = false; c.classList.add('wrong'); c.classList.remove('right'); }
        else { c.classList.remove('wrong'); c.classList.add('right'); }
      });
      return ok && cells.length > 0;
    };
    wrap.reveal = () => {
      wrap.querySelectorAll('input.cell[data-expect]').forEach((c) => { if (c.dataset.expect) c.value = c.dataset.expect; });
    };
    return wrap;
  }

  w.Paper = { multiply: paperMultiply, divide: paperDivide };

  /* ---------- Item renderer ---------- */
  function renderItem(host, item, opts) {
    opts = opts || {};
    if (!item.type && (item.a != null || item.acc != null)) {
      item = Object.assign({}, item, { type: 'num', q: item.q || item.label || '' });
    }
    if (item.q == null) item = Object.assign({}, item, { q: item.label || '' });
    if (item.type === 'mc' || item.type === 'ms') item = U.normalizeChoiceItem(item);
    const box = document.createElement('div');
    box.className = 'q-card';
    const meta = document.createElement('div');
    meta.className = 'q-meta';
    if (opts.label) meta.innerHTML += `<span class="tag">${opts.label}</span>`;
    if (item.fmt) meta.innerHTML += `<span class="tag">${item.fmt}</span>`;
    if (item.nocalc) meta.innerHTML += `<span class="tag warn">NO CALCULATOR</span>`;
    if (item.sol) meta.innerHTML += `<span class="tag">${item.sol}</span>`;
    const q = document.createElement('div');
    q.className = 'q-text';
    q.innerHTML = item.q;
    const body = document.createElement('div');
    const fb = document.createElement('div'); fb.className = 'fb';
    const why = document.createElement('div'); why.className = 'why';
    if (item.why) why.innerHTML = item.why;
    box.appendChild(meta); box.appendChild(q); box.appendChild(body); box.appendChild(fb); box.appendChild(why);
    formatFractionsIn(q);
    if (item.why) formatFractionsIn(why);
    host.appendChild(box);

    let done = false, tries = 0, lastOk = false;
    const offerAdvance = (ok) => {
      lastOk = !!ok;
      if (!opts.onNext && ok) return; // sub-parts: no extra Next after a correct check
      let row = box.querySelector('.advance-row');
      if (!row) {
        row = document.createElement('div');
        row.className = 'row-btns advance-row';
        const b = document.createElement('button');
        b.className = 'btn';
        b.type = 'button';
        b.dataset.advance = '1';
        bindTap(b, () => {
          if (!done) {
            done = true;
            if (item.why) why.classList.add('show');
            if (opts.onDone) opts.onDone(false, tries);
          }
          if (opts.onNext) opts.onNext(lastOk, tries);
        });
        row.appendChild(b);
        fb.insertAdjacentElement('afterend', row);
      }
      const b = row.querySelector('[data-advance]');
      b.textContent = opts.nextLabel || (opts.onNext ? (lastOk ? 'Next' : 'Try another') : 'Continue');
      requestAnimationFrame(() => { try { b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {} });
    };
    const finish = (ok) => {
      if (done) return;
      done = true;
      lastOk = !!ok;
      fb.className = 'fb ' + (ok ? 'ok' : 'no');
      fb.innerHTML = ok ? (tries === 0 ? '✅ First try!' : '✅ Got it!') : 'Not quite — look at the sample below.';
      formatFractionsIn(fb);
      if (item.why) why.classList.add('show');
      if (opts.onDone) opts.onDone(ok, tries);
      offerAdvance(ok);
    };

    if (item.type === 'mc' || item.type === 'ms') {
      const ch = item.ch.slice();
      let order = ch.map((_, i) => i);
      if (!item.fixed) order = U.shuffle(order);
      const shown = order.map((i) => ch[i]);
      const layout = optsLayout(shown);
      const cls = layout.cls;
      const optionsAreShort = shown.every(isShortAnswer);
      const wrap = document.createElement('div');
      wrap.className = cls;
      if (layout.cols) wrap.style.setProperty('--opts-cols', String(layout.cols));
      const letters = 'ABCDEFGH';
      const selected = new Set();
      const isMS = item.type === 'ms';
      if (isMS) {
        wrap.classList.add('opts-ms');
        const hint = document.createElement('div');
        hint.className = 'ms-hint';
        hint.textContent = 'Select all that apply. Tap every correct answer, then press Check.';
        body.appendChild(hint);
      }
      const paintSel = () => {
        wrap.querySelectorAll('.opt').forEach((el, k) => {
          const on = selected.has(k);
          el.classList.toggle('sel', on);
          el.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      };
      shown.forEach((html, k) => {
        const b = document.createElement('button');
        b.className = 'opt';
        b.type = 'button';
        b.setAttribute('aria-pressed', 'false');
        const mark = isMS
          ? `<span class="let chk" aria-hidden="true"></span>`
          : ((cls === 'opts-row' || (cls === 'opts-grid' && optionsAreShort)) ? '' : `<span class="let">${letters[k]}</span>`);
        b.innerHTML = mark + formatHTML(html);
        bindTap(b, () => {
          if (done) return;
          b.classList.remove('wrong');
          if (isMS) {
            if (selected.has(k)) selected.delete(k);
            else selected.add(k);
          } else if (selected.has(k)) {
            selected.delete(k);
          } else {
            selected.clear();
            selected.add(k);
          }
          paintSel();
        });
        wrap.appendChild(b);
      });
      body.appendChild(wrap);
      const chk = document.createElement('button');
      chk.className = 'btn teal';
      chk.type = 'button';
      chk.textContent = 'Check';
      bindTap(chk, () => {
        if (done) return;
        if (selected.size === 0) {
          fb.className = 'fb no';
          fb.textContent = isMS ? 'Select every right one — then press Check.' : 'Select an answer, then press Check.';
          return;
        }
        if (isMS) {
          const want = (Array.isArray(item.a) ? item.a : [item.a]).slice().sort().join(',');
          const got = [...selected].map((k) => order[k]).sort().join(',');
          if (got === want) {
            wrap.querySelectorAll('.opt').forEach((el, k) => { if (selected.has(k)) el.classList.add('right'); });
            finish(tries === 0);
          } else {
            tries++;
            fb.className = 'fb no';
            fb.textContent = 'Select every right one — and only those.';
            if (tries >= 2) why.classList.add('show');
            offerAdvance(false);
          }
        } else {
          const pick = order[[...selected][0]];
          const correct = pick === item.a || (Array.isArray(item.a) && item.a.includes(pick));
          const btn = wrap.querySelectorAll('.opt')[[...selected][0]];
          if (correct) {
            if (btn) btn.classList.add('right');
            finish(tries === 0);
          } else {
            if (btn) btn.classList.add('wrong');
            tries++;
            fb.className = 'fb no';
            fb.innerHTML = (item.traps && item.traps[pick]) ? '💡 ' + formatHTML(item.traps[pick]) : 'Not quite — look at the sample below.';
            formatFractionsIn(fb);
            if (tries >= 2) why.classList.add('show');
            offerAdvance(false);
          }
        }
      });
      body.appendChild(chk);
    } else if (item.type === 'num') {
      const row = document.createElement('div'); row.className = 'num-in';
      const inp = document.createElement('input'); inp.type = 'text'; inp.inputMode = item.inputMode || 'decimal';
      inp.setAttribute('aria-label', 'Your answer');
      if (item.placeholder) inp.placeholder = item.placeholder;
      const chk = document.createElement('button'); chk.className = 'btn teal'; chk.textContent = 'Check';
      const go = () => {
        if (done) return;
        if (U.eqNum(inp.value, item.a != null ? (item.acc || item.a) : item.acc)) finish(tries === 0);
        else { tries++; fb.className = 'fb no'; fb.textContent = 'Not yet — try a different form or re-check the work.'; if (tries >= 2) why.classList.add('show'); offerAdvance(false); }
      };
      bindTap(chk, go);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
      row.appendChild(inp); row.appendChild(chk);
      body.appendChild(row);
    } else if (item.type === 'nline') {
      const min = item.min != null ? +item.min : 0;
      const max = item.max != null ? +item.max : 10;
      const step = item.step != null ? +item.step : 1;
      const wrap = document.createElement('div');
      wrap.className = 'nline-wrap';
      const viz = document.createElement('div');
      viz.className = 'viz';
      wrap.appendChild(viz);
      const ctrl = document.createElement('div');
      ctrl.className = 'nline-ctrl';
      const range = document.createElement('input');
      range.type = 'range';
      range.min = String(min);
      range.max = String(max);
      range.step = String(step);
      range.value = String(min);
      range.setAttribute('aria-label', 'Number line value');
      const out = document.createElement('span');
      out.className = 'nline-val';
      const paint = () => {
        const val = range.value;
        out.textContent = val;
        viz.innerHTML = '';
        if (w.V && V.numberLine) {
          viz.innerHTML = V.numberLine(min, max, [{ pos: +val, label: val }]);
        }
      };
      range.addEventListener('input', paint);
      paint();
      ctrl.appendChild(range);
      ctrl.appendChild(out);
      wrap.appendChild(ctrl);
      body.appendChild(wrap);
      const chk = document.createElement('button');
      chk.className = 'btn teal';
      chk.type = 'button';
      chk.textContent = 'Check';
      bindTap(chk, () => {
        if (done) return;
        if (U.eqNum(range.value, item.a)) finish(tries === 0);
        else {
          tries++;
          fb.className = 'fb no';
          fb.textContent = 'Not yet — slide to a different mark and check again.';
          if (tries >= 2) why.classList.add('show');
          offerAdvance(false);
        }
      });
      body.appendChild(chk);
    } else if (item.type === 'order') {

      const wrap = document.createElement('div');
      wrap.className = 'opts-row';
      const seq = [];
      const pool = document.createElement('div'); pool.className = 'opts-row';
      (item.items || []).forEach((html, i) => {
        const b = document.createElement('button'); b.className = 'opt'; b.type = 'button'; b.innerHTML = formatHTML(html);
        bindTap(b, () => {
          if (done) return;
          if (seq.length && seq[seq.length - 1] === i && b.classList.contains('sel')) {
            seq.pop(); b.disabled = false; b.classList.remove('sel');
            return;
          }
          if (b.classList.contains('sel')) return;
          seq.push(i); b.classList.add('sel');
          if (seq.length === item.items.length) {
            const ok = seq.every((v, k) => v === item.order[k]);
            if (ok) finish(tries === 0);
            else { tries++; fb.className = 'fb no'; fb.textContent = 'That order is not quite right. Tap a selected chip to undo, or Reset and try again.'; seq.length = 0; pool.querySelectorAll('.opt').forEach((x) => { x.classList.remove('sel'); }); if (tries >= 2) why.classList.add('show'); offerAdvance(false); }
          }
        });
        pool.appendChild(b);
      });
      const reset = document.createElement('button'); reset.className = 'btn ghost'; reset.textContent = 'Reset';
      bindTap(reset, () => { if (done) return; seq.length = 0; pool.querySelectorAll('.opt').forEach((x) => { x.classList.remove('sel'); }); });
      body.appendChild(pool); body.appendChild(reset);
    } else if (item.type === 'paper-mul' || item.type === 'paper-div') {
      const widget = item.type === 'paper-mul' ? paperMultiply(item.a, item.b) : paperDivide(item.a, item.b);
      body.appendChild(widget);
      const row = document.createElement('div'); row.className = 'row-btns';
      const chk = document.createElement('button'); chk.className = 'btn teal'; chk.textContent = 'Check my paper';
      bindTap(chk, () => {
        if (done) return;
        if (widget.check()) finish(tries === 0);
        else { tries++; fb.className = 'fb no'; fb.textContent = 'A digit is off. Check carries, place-value zeros, and the last add (or remainder).'; if (tries >= 2) { widget.reveal(); why.classList.add('show'); } offerAdvance(false); }
      });
      row.appendChild(chk); body.appendChild(row);
    } else if (item.type === 'multi') {
      const parts = item.parts || [];
      let left = parts.length, missed = 0;
      parts.forEach((p, i) => {
        const sub = document.createElement('div');
        sub.style.margin = '6px 0';
        renderItem(sub, p, {
          label: 'Part ' + String.fromCharCode(65 + i),
          onDone: (ok) => { left--; if (!ok) missed++; if (left === 0) finish(missed === 0 && tries === 0); }
        });
        body.appendChild(sub);
      });
    }

    return box;
  }

  /* ---------- Learn player ---------- */
  function normalizeTries(raw) {
    if (!raw) return [];
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr.filter(Boolean).map((x) => (typeof x === 'function' ? x : () => x));
  }

  function mountViz(host, viz) {
    if (!viz) return;
    let out = typeof viz === 'function' ? viz() : viz;
    if (out == null || out === '') return;
    if (out instanceof Node) {
      if (out.classList && out.classList.contains('viz')) { host.appendChild(out); return; }
      const box = document.createElement('div'); box.className = 'viz'; box.appendChild(out); host.appendChild(box); return;
    }
    const box = document.createElement('div');
    box.className = 'viz';
    box.innerHTML = String(out);
    if (box.children.length === 1 && box.firstElementChild.classList && box.firstElementChild.classList.contains('viz')) {
      host.appendChild(box.firstElementChild);
      return;
    }
    host.appendChild(box);
  }

  function decorateCard(lesson, card) {
    const extra = (w.G5Learn && typeof w.G5Learn.forCard === 'function') ? w.G5Learn.forCard(lesson, card) : null;
    const out = extra ? Object.assign({}, card, extra) : Object.assign({}, card);
    if (extra && extra.html == null && card.html) out.html = card.html;
    const fromCard = normalizeTries(card.tries || card.try);
    const fromPack = extra ? normalizeTries(extra.tries || extra.try) : [];
    out.tries = fromCard.concat(fromPack).slice(0, 3);
    if (!out.trap && card.trap) out.trap = card.trap;
    if (!out.steps && card.steps) out.steps = card.steps;
    if (!out.remember && card.remember) out.remember = card.remember;
    return out;
  }

  function playLesson(host, lesson, onDone) {
    host.innerHTML = '';
    const card = document.createElement('div'); card.className = 'lesson-card';
    host.appendChild(card);
    let i = 0;
    const draw = () => {
      const c = decorateCard(lesson, lesson.cards[i]);
      card.innerHTML = '';
      const title = document.createElement('h3');
      title.innerHTML = c.t || lesson.name;
      card.appendChild(title);
      const body = document.createElement('div');
      body.className = 'lesson-body' + ((c.tries && c.tries.length) ? ' lesson-split' : '');
      const main = document.createElement('div');
      main.className = 'lesson-main';
      if (c.html) {
        const explain = document.createElement('div');
        explain.className = 'lesson-explain';
        explain.innerHTML = c.html;
        main.appendChild(explain);
      }
      mountViz(main, c.viz);
      if (c.steps && c.steps.length) {
        const ex = document.createElement('div');
        ex.className = 'worked';
        ex.innerHTML = '<div class="worked-label">Worked example</div><ol class="steps">' +
          c.steps.map((s) => '<li>' + s + '</li>').join('') + '</ol>';
        main.appendChild(ex);
      }
      if (c.example) {
        const ex = document.createElement('div');
        ex.className = 'worked';
        ex.innerHTML = '<div class="worked-label">Worked example</div>' + c.example;
        main.appendChild(ex);
      }
      if (c.trap) {
        const t = document.createElement('div');
        t.className = 'trap';
        t.innerHTML = '<span class="callout-k">Common trap</span> ' + c.trap;
        main.appendChild(t);
      }
      if (c.aap) {
        const t = document.createElement('div');
        t.className = 'aap';
        const aapHtml = typeof c.aap === 'string' ? c.aap : (c.aap.html || c.aap.text || '');
        t.innerHTML = '<span class="callout-k">AAP stretch</span> ' + aapHtml;
        main.appendChild(t);
      }
      if (c.remember) {
        const r = document.createElement('div'); r.className = 'remember'; r.innerHTML = c.remember; main.appendChild(r);
      }
      body.appendChild(main);
      if (c.tries && c.tries.length) {
        const prac = document.createElement('div');
        prac.className = 'lesson-practice';
        const ph = document.createElement('h4');
        ph.textContent = c.tries.length === 1 ? 'Try it' : 'Try these';
        prac.appendChild(ph);
        c.tries.forEach((fn, k) => {
          const slot = document.createElement('div');
          slot.className = 'try-slot';
          const load = () => {
            slot.innerHTML = '';
            let it = null;
            for (let t = 0; t < 16 && !it; t++) {
              try { it = fn(); } catch (e) { it = null; }
            }
            if (!it) return;
            renderItem(slot, it, {
              label: 'Try ' + (k + 1),
              nextLabel: 'Try another',
              onNext: load
            });
            formatFractionsIn(slot);
          };
          load();
          prac.appendChild(slot);
        });
        body.appendChild(prac);
      }
      card.appendChild(body);
      const nav = document.createElement('div'); nav.className = 'row-btns';
      if (i > 0) {
        const back = document.createElement('button'); back.className = 'btn ghost'; back.textContent = 'Back';
        back.onclick = () => { i--; draw(); }; nav.appendChild(back);
      }
      const dots = document.createElement('div'); dots.className = 'dots';
      lesson.cards.forEach((_, k) => { const d = document.createElement('i'); if (k === i) d.classList.add('on'); dots.appendChild(d); });
      nav.appendChild(dots);
      const next = document.createElement('button'); next.className = 'btn';
      next.textContent = i < lesson.cards.length - 1 ? 'Next' : 'Lesson complete';
      next.onclick = () => {
        if (i < lesson.cards.length - 1) { i++; draw(); }
        else if (onDone) onDone();
      };
      nav.appendChild(next);
      card.appendChild(nav);
      formatFractionsIn(card);
      requestAnimationFrame(function () {
        try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
      });
    };
    draw();
  }

  /* ---------- Main mount ---------- */
  const BREAKS = [
    { e: '🤸', t: 'Stand up and do 8 slow stretches, then come back ready.' },
    { e: '🧘', t: 'Take four slow breaths. In for 3, out for 3.' },
    { e: '✋', t: 'Trace a big infinity sign in the air with your finger, eight times.' },
    { e: '🔢', t: 'Skip-count by 7s out loud while marching in place.' },
    { e: '👀', t: 'Look out a window for 20 seconds, then blink slowly 5 times.' }
  ];

  function mount(UNIT) {
    const root = document.getElementById('app');
    const key = 'g5lab_' + UNIT.id;
    let M = store(key) || { xp: 0, lvl: 'core', les: {}, sk: {}, tab: 'learn' };
    const save = () => store(key, M);

    const shell = document.createElement('div');
    shell.className = 'app-shell';
    shell.innerHTML = `
      <div class="app-bar">
        <a class="back" href="../index.html">← Lab</a>
        <h1><span>${UNIT.emoji}</span> ${UNIT.title}</h1>
        <div class="grow"></div>
        <div class="lvl-toggle" title="Core or Advanced lessons and practice">
          <button data-l="core" class="${M.lvl !== 'advanced' ? 'on' : ''}">Core</button>
          <button data-l="advanced" class="${M.lvl === 'advanced' ? 'on' : ''}">Advanced</button>
        </div>
        <button type="button" class="icon-btn theme-toggle" data-theme-toggle></button>
        <button class="icon-btn" id="printBtn">Print pack</button>
        <div class="xp" id="xp">⭐ ${M.xp} XP</div>
      </div>
      <nav class="tabs" id="tabs">
        <button data-tab="learn" class="on">Learn</button>
        <button data-tab="practice">Practice</button>
        <button data-tab="test">Test Lab</button>
      </nav>
      <main class="stage" id="stage"></main>
      <button class="brain" id="brain">Brain break</button>
      <div class="overlay" id="break"><div class="modal"><div class="emo" id="bE"></div><p id="bT"></p><button class="btn" id="bC">I'm ready</button></div></div>
    `;
    root.innerHTML = '';
    root.appendChild(shell);
    if (w.G5Theme) G5Theme.sync();

    const stage = shell.querySelector('#stage');
    const setXP = () => { shell.querySelector('#xp').textContent = '⭐ ' + M.xp + ' XP'; };
    const track = () => (M.lvl === 'advanced' ? UNIT.advanced : UNIT.core);

    shell.querySelectorAll('.lvl-toggle button').forEach((b) => {
      b.onclick = () => {
        M.lvl = b.dataset.l; save();
        shell.querySelectorAll('.lvl-toggle button').forEach((x) => x.classList.toggle('on', x === b));
        show(M.tab);
      };
    });
    shell.querySelectorAll('#tabs button').forEach((b) => {
      b.onclick = () => show(b.dataset.tab);
    });
    shell.querySelector('#brain').onclick = () => {
      const br = U.pick(BREAKS);
      shell.querySelector('#bE').textContent = br.e;
      shell.querySelector('#bT').textContent = br.t;
      shell.querySelector('#break').classList.add('show');
    };
    shell.querySelector('#bC').onclick = () => shell.querySelector('#break').classList.remove('show');
    shell.querySelector('#printBtn').onclick = () => buildPrint(UNIT, M.lvl);

    function show(tab) {
      M.tab = tab; save();
      shell.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
      stage.innerHTML = '';
      if (tab === 'learn') showLearn();
      else if (tab === 'practice') showPractice();
      else showTest();
    }

    function showLearn() {
      const T = track();
      stage.innerHTML = `<h2>Learn · ${M.lvl === 'advanced' ? 'Advanced' : 'Core'}</h2>
        <p class="lede">${T.intro || 'Short lesson cards, then one try-it. About 5–8 minutes. No rush.'}</p>
        <div class="lesson-chips" id="chips"></div><div id="lessonHost" class="stage-host"></div>`;
      const chips = stage.querySelector('#chips');
      const host = stage.querySelector('#lessonHost');
      const open = (k) => {
        chips.innerHTML = '';
        T.lessons.forEach((L, i) => {
          const b = document.createElement('button');
          b.className = 'chip' + (i === k ? ' on' : '');
          b.innerHTML = `${L.icon || '📘'} ${L.name}` + (M.les[L.id] ? ' <span class="st">✓</span>' : '');
          b.onclick = () => open(i);
          chips.appendChild(b);
        });
        playLesson(host, T.lessons[k], () => {
          M.les[T.lessons[k].id] = 1; M.xp += 15; save(); setXP();
          host.innerHTML = `<div class="remember">🎉 Lesson complete (+15 XP). ${k < T.lessons.length - 1 ? 'Next up: <b>' + T.lessons[k + 1].name + '</b>.' : 'All lessons in this level are done. Head to Practice.'}</div>`;
          if (k < T.lessons.length - 1) {
            const nb = document.createElement('button'); nb.className = 'btn'; nb.textContent = 'Start ' + T.lessons[k + 1].name + ' →';
            nb.onclick = () => open(k + 1); host.appendChild(nb);
          } else {
            const nb = document.createElement('button'); nb.className = 'btn teal'; nb.textContent = 'Go to Practice →';
            nb.onclick = () => show('practice'); host.appendChild(nb);
          }
        });
      };
      const first = T.lessons.findIndex((L) => !M.les[L.id]);
      open(first < 0 ? 0 : first);
    }

    function showPractice() {
      const T = track();
      const skills = T.skills || [];
      stage.innerHTML = `<h2>Practice · ${M.lvl === 'advanced' ? 'Advanced' : 'Core'}</h2>
        <p class="lede">Fresh questions every time. A skill earns a ⭐ after 3 right answers on 2 different days. Multi-step computation uses a paper work area.</p>
        <div class="practice-top">
          <div class="seg" id="skillSeg"></div>
          <div class="seg" id="nSeg"></div>
          <span class="stat" id="stSolved">0 solved</span>
          <span class="stat" id="stStreak">streak 0</span>
        </div>
        <div id="pHost" class="stage-host"></div>`;
      let skill = 'all', n = 5, solved = 0, streak = 0, qi = 0, cur = null;
      const skillSeg = stage.querySelector('#skillSeg');
      const allBtn = document.createElement('button'); allBtn.className = 'on'; allBtn.textContent = 'All skills';
      allBtn.onclick = () => { skill = 'all'; [...skillSeg.children].forEach((x) => x.classList.remove('on')); allBtn.classList.add('on'); next(); };
      skillSeg.appendChild(allBtn);
      skills.forEach((s) => {
        const b = document.createElement('button'); b.textContent = s.name;
        b.onclick = () => { skill = s.id; [...skillSeg.children].forEach((x) => x.classList.remove('on')); b.classList.add('on'); next(); };
        skillSeg.appendChild(b);
      });
      const nSeg = stage.querySelector('#nSeg');
      [5, 10, 20, 0].forEach((k) => {
        const b = document.createElement('button'); b.textContent = k ? String(k) : '∞'; if (k === 5) b.classList.add('on');
        b.onclick = () => { n = k; [...nSeg.children].forEach((x) => x.classList.remove('on')); b.classList.add('on'); qi = 0; next(); };
        nSeg.appendChild(b);
      });
      const host = stage.querySelector('#pHost');
      function pickSkill() {
        if (skill !== 'all') return skills.find((s) => s.id === skill) || skills[0];
        const open = skills.filter((s) => {
          const rec = (M.sk[s.id] || { c: 0, d: [] });
          return !(rec.c >= 3 && rec.d.length >= 2);
        });
        return U.pick(open.length ? open : skills);
      }
      function credit(id, ok) {
        const rec = M.sk[id] || (M.sk[id] = { c: 0, n: 0, d: [] });
        rec.n++; if (ok) { rec.c++; const t = U.today(); if (rec.d.indexOf(t) < 0) rec.d.push(t); M.xp += 5; }
        save(); setXP();
      }
      function next() {
        if (n && qi >= n) {
          host.innerHTML = `<div class="remember">Round complete: ${solved} solved, streak ${streak}. Nice calm work.</div>`;
          const b = document.createElement('button'); b.className = 'btn'; b.textContent = 'Another round';
          b.onclick = () => { qi = 0; solved = 0; next(); }; host.appendChild(b);
          return;
        }
        const s = pickSkill();
        cur = null;
        for (let t = 0; t < 24 && !cur; t++) cur = s.gen();
        if (!cur) {
          host.innerHTML = '<div class="remember">Could not build a question for this skill. Try another skill.</div>';
          return;
        }
        cur.skill = s.id;
        host.innerHTML = '';
        const cap = document.createElement('div'); cap.className = 'lede'; cap.textContent = `Question ${qi + 1}${n ? ' of ' + n : ''} · ${s.name}`;
        host.appendChild(cap);
        const holder = document.createElement('div'); host.appendChild(holder);
        renderItem(holder, cur, {
          nextLabel: n ? 'Next' : 'Try another',
          onDone: (ok) => {
            credit(s.id, ok);
            if (ok) { solved++; streak++; }
            else { streak = 0; }
            stage.querySelector('#stSolved').textContent = solved + ' solved';
            stage.querySelector('#stStreak').textContent = 'streak ' + streak;
          },
          onNext: () => { qi++; next(); }
        });
      }
      next();
    }

    function showTest() {
      const T = track();
      const items = (typeof T.test === 'function' ? T.test() : (T.test || [])).slice();
      stage.innerHTML = `<h2>Test Lab · ${M.lvl === 'advanced' ? 'Advanced' : 'Core'}</h2>
        <p class="lede">SOL-style formats. Every part must be right. One question at a time — take all the time you need.</p>
        <div id="tHost" class="stage-host"></div>`;
      const host = stage.querySelector('#tHost');
      let i = 0, right = 0;
      const draw = () => {
        if (i >= items.length) {
          host.innerHTML = `<div class="remember">🧪 Checkpoint done: <b>${right} / ${items.length}</b> correct. ${right >= Math.ceil(items.length * 0.8) ? 'Strong work.' : 'Review the lessons, then try a fresh pack.'}</div>`;
          const b = document.createElement('button'); b.className = 'btn'; b.textContent = 'New checkpoint';
          b.onclick = () => showTest(); host.appendChild(b);
          M.xp += right * 4; save(); setXP();
          return;
        }
        host.innerHTML = '';
        renderItem(host, items[i], {
          label: 'Q' + (i + 1) + ' of ' + items.length,
          nextLabel: i === items.length - 1 ? 'See results' : 'Next question',
          onDone: (ok) => { if (ok) right++; },
          onNext: () => { i++; draw(); }
        });
      };
      draw();
    }

    show(M.tab || 'learn');
  }

  function getPrintRoot() {
    let root = document.getElementById('print-root');
    if (root && root.parentElement !== document.body) {
      root.remove();
      root = null;
    }
    if (!root) {
      root = document.createElement('div');
      root.id = 'print-root';
      document.body.appendChild(root);
    }
    return root;
  }

  function openPrintDialog() {
    const cleanup = () => document.body.classList.remove('is-printing');
    document.body.classList.add('is-printing');
    window.addEventListener('afterprint', cleanup, { once: true });
    const fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    fonts.catch(() => {}).then(() => new Promise((r) => setTimeout(r, 80))).then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { try { w.print(); } catch (e) { cleanup(); } });
      });
    });
  }

  function buildPrint(UNIT, lvl) {
    const root = getPrintRoot();
    const T = (lvl === 'advanced' ? UNIT.advanced : UNIT.core);
    const items = [];
    const skills = T.skills || [];
    // Fill two US Letter pages, 2-col, ~10 per page
    let guard = 0;
    while (items.length < 20 && guard < 80) {
      guard++;
      const s = skills[items.length % Math.max(skills.length, 1)] || skills[0];
      if (!s) break;
      try {
          let it = null;
          for (let t = 0; t < 24 && !it; t++) it = s.gen();
          if (it) items.push({ skill: s.name, it: U.normalizeChoiceItem(it) });
        } catch (e) {}
    }
    const pages = [items.slice(0, 10), items.slice(10, 20)];
    const renderQ = (pack, i) => {
      const it = pack.it;
      let body = `<div class="q">${it.q}</div>`;
      if (it.type === 'mc' || it.type === 'ms') {
        body += '<div>' + (it.ch || []).map((c, k) => `<div>☐ ${'ABCDEFGH'[k]}. ${c}</div>`).join('') + '</div>';
      } else {
        body += '<div style="margin-top:18px;border-bottom:1.5px solid #bbb"></div><div style="margin-top:18px;border-bottom:1.5px solid #bbb"></div>';
      }
      return `<div class="pq"><div class="qn">${i + 1}. ${pack.skill || ''}</div>${body}</div>`;
    };
    const keyItems = items.map((pack, i) => {
      let ans = '';
      const it = pack.it;
      if (it.type === 'mc') ans = 'ABCDEFGH'[it.a] + '. ' + formatHTML((it.ch || [])[it.a] || '');
      else if (it.type === 'ms') ans = (it.a || []).map((k) => 'ABCDEFGH'[k] + '. ' + formatHTML((it.ch || [])[k] || '')).join(' ');
      else if (it.type === 'num') ans = formatHTML(String(Array.isArray(it.a) ? it.a[0] : it.a));
      else if (it.type === 'paper-mul') ans = String(it.a * it.b);
      else if (it.type === 'paper-div') ans = String(Math.floor(it.a / it.b)) + (it.a % it.b ? ' R' + (it.a % it.b) : '');
      else ans = it.why ? U.strip(it.why).slice(0, 80) : '';
      return `<div class="pq"><div class="qn">${i + 1}.</div><b>${ans}</b></div>`;
    });
    const levelName = lvl === 'advanced' ? 'Advanced' : 'Core';
    if (!items.length) {
      root.innerHTML = `<section class="print-page"><div class="print-head"><h1>${UNIT.emoji} ${UNIT.title}</h1></div><p>No practice items were ready. Close this dialog and try Print pack again.</p></section>`;
    } else {
      const filled = pages.filter((pg) => pg.length);
      root.innerHTML = filled.map((pg, p) => `
        <section class="print-page">
          <div class="print-head"><h1>${UNIT.emoji} ${UNIT.title} · ${levelName} Practice</h1><div>Grade 5 · Page ${p + 1} of ${filled.length}</div></div>
          <div class="print-grid">${pg.map((pack, i) => renderQ(pack, i + p * 10)).join('')}</div>
        </section>`).join('') + `
        <section class="print-page print-key">
          <div class="print-head"><h1>Answer Key · ${UNIT.title} · ${levelName}</h1><div>Keep this page separate</div></div>
          <div class="print-grid">${keyItems.join('')}</div>
        </section>`;
    }
    formatFractionsIn(root);
    openPrintDialog();
  }

  w.Lab = { mount, renderItem, playLesson, U, optsClass, optsLayout, formatHTML, formatFractionsIn, formatFractionString, isShortAnswer, buildPrint, getPrintRoot };
})(window);
