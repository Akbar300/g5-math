/* Grade 5 Math Lab engine: Learn → Practice → Test Lab, Core/Advanced, print, paper work. */
(function (w) {
  const fr = (n, d) => (w.V && V.fr) ? V.fr(n, d) : `<span class="frac"><span class="n">${n}</span><span class="d">${d}</span></span>`;
  w.fr = fr;

  /* House rule: no thousands commas anywhere (write 4372, not 4,372). Strip them from visible text only. */
  const TH_RE = /(^|[^\d.,])(\d{1,3})((?:,\d{3})+)(?!\d|,\d)/g;
  function stripThousands(root) {
    if (!root) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let n;
    while ((n = tw.nextNode())) {
      const p = n.parentNode && n.parentNode.nodeName;
      if (p === 'SCRIPT' || p === 'STYLE') continue;
      const t = n.nodeValue;
      if (t && /\d,\d{3}/.test(t)) {
        const v = t.replace(TH_RE, (m, a, b, c) => a + b + c.replace(/,/g, ''));
        if (v !== t) n.nodeValue = v;
      }
    }
  }
  if (typeof MutationObserver !== 'undefined') {
    const startTH = () => {
      stripThousands(document.body);
      new MutationObserver((ms) => ms.forEach((m) => {
        if (m.type === 'characterData') stripThousands(m.target.parentNode);
        else m.addedNodes.forEach((x) => { if (x.nodeType === 3) stripThousands(x.parentNode); else if (x.nodeType === 1) stripThousands(x); });
      })).observe(document.body, { childList: true, subtree: true, characterData: true });
    };
    if (document.body) startTH(); else document.addEventListener('DOMContentLoaded', startTH);
  }

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

  function optsLayout(options, widthEl) {
    const texts = options.map((o) => U.strip(o));
    const n = texts.length || 1;
    const short = options.every(isShortAnswer);
    const maxLen = Math.max(...texts.map((t) => t.length), 0);
    const stage = document.querySelector('.stage');
    const width = (widthEl && widthEl.clientWidth)
      ? Math.max(200, widthEl.clientWidth - 24)
      : Math.max(200, (stage ? stage.clientWidth : document.documentElement.clientWidth) - 48);
    /* Long numbers (1600000, 25953) need a wider chip so the digits never wrap onto a second line. */
    const chipMin = short ? Math.max(68, Math.ceil(maxLen * 15) + 34) : (maxLen > 28 ? 200 : 140);
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
    } else {
      /* Word choices: two side by side only if the longest one fits in half the width on about one line.
         Otherwise one full-width row per choice (phones), so words never get squeezed into a thin column. */
      const textLen = (o) => U.strip(String(o).replace(/<span class="(?:frac|mix)"[\s\S]*?<\/span>\s*<\/span>/g, 'xxx')).length;
      const longest = Math.max(...options.map(textLen), 0);
      const half = (width - 8) / 2;
      cols = (n !== 3 && longest * 10.5 + 72 <= half) ? Math.min(2, n) : 1;
    }
    let cls = 'opts-col';
    if (cols === n && short && width >= 520) cls = 'opts-row';
    else if (cols >= 2) { cls = 'opts-grid'; cols = Math.min(cols, n); }
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
    /* Check / Next live in one action bar at the end of the card (sticky on phones in Practice and Test Lab). */
    const actions = document.createElement('div'); actions.className = 'q-actions';
    box.appendChild(meta); box.appendChild(q); box.appendChild(body); box.appendChild(fb); box.appendChild(why); box.appendChild(actions);
    if (opts.sticky) box.classList.add('sticky-actions');
    if (opts.cls) box.classList.add(opts.cls);
    formatFractionsIn(q);
    if (item.why) formatFractionsIn(why);
    host.appendChild(box);

    let done = false, tries = 0, lastOk = false;
    /* After a miss, offer a short motion explainer when one fits this question (js/explain.js). */
    const offerWatch = () => {
      if (!w.EX || opts.noWatch || box.querySelector('.ex-watch')) return;
      /* Pass the student's wrong answer so an explainer can show where it lands (e.g. 25.0 vs 25.4). */
      let answer = '';
      const inp = body.querySelector('.num-in input');
      if (inp) answer = String(inp.value || '').trim();
      else {
        const bad = body.querySelectorAll('.opt.wrong');
        if (bad.length) answer = U.strip(bad[bad.length - 1].querySelector('.opt-t') ? bad[bad.length - 1].querySelector('.opt-t').innerHTML : bad[bad.length - 1].innerHTML);
      }
      const o = w.EX.forItem(item, { answer: answer });
      if (!o) return;
      fb.after(w.EX.watchButton(o, { text: '🎬 Watch how: ' + w.EX.label(o), cls: 'ex-after-miss' }));
    };
    /* Any wrong attempt turns the feedback line to "fb no" — offer the explainer right then. */
    if (w.EX && !opts.noWatch && w.MutationObserver) {
      new MutationObserver(() => { if (fb.classList.contains('no')) offerWatch(); }).observe(fb, { attributes: true, attributeFilter: ['class'] });
    }
    const offerAdvance = (ok) => {
      lastOk = !!ok;
      if (!opts.onNext && (ok || done)) return; // no Next in grid cards / sub-parts once finished
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
            box.classList.add('is-done');
            if (item.why) why.classList.add('show');
            offerWatch();
            if (opts.onDone) opts.onDone(false, tries, false);
          }
          if (opts.onNext) opts.onNext(lastOk, tries);
          else row.remove();
        });
        row.appendChild(b);
        actions.appendChild(row);
      }
      const b = row.querySelector('[data-advance]');
      b.textContent = opts.onNext ? (opts.nextLabel || (lastOk ? 'Next' : 'Try another')) : (opts.giveUpLabel || 'Show answer');
      if (!opts.noScroll) requestAnimationFrame(() => { try { b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {} });
    };
    /* ok = right on the first try (what scoring uses). correct = the final answer is right. */
    const finish = (ok, correct) => {
      if (done) return;
      done = true;
      box.classList.add('is-done');
      correct = correct !== false;
      lastOk = !!ok || correct;
      fb.className = 'fb ' + (correct ? 'ok' : 'no');
      fb.innerHTML = ok ? '✅ First try!' : (correct ? '✅ Got it! That one counts as a second try.' : 'Not quite — look at the sample below.');
      formatFractionsIn(fb);
      if (item.why) why.classList.add('show');
      if (!ok) offerWatch();
      if (w.G5ItemHook) w.G5ItemHook(item, box);
      if (opts.onDone) opts.onDone(ok, tries, correct);
      offerAdvance(lastOk);
    };
    /* Exam mode (Test Lab): answers are only recorded while the student works. box.__exam.grade() runs on Submit
       and shows right/wrong and the explanation, like the real test. Practice never sets opts.exam. */
    const ex = {};
    if (opts.exam) box.__exam = ex;
    const examReveal = (correct, note) => {
      done = true;
      box.classList.add('is-done', correct ? 'exam-ok' : 'exam-no');
      fb.className = 'fb ' + (correct ? 'ok' : 'no');
      fb.innerHTML = correct ? '✅ Correct' : '❌ Not quite' + (note ? ' — ' + note : '');
      formatFractionsIn(fb);
      if (item.why) why.classList.add('show');
      const fl = box.querySelector('.q-flag'); if (fl) fl.disabled = true;
      if (w.G5ItemHook) w.G5ItemHook(item, box);
      return correct;
    };
    if (opts.exam) {
      const fl = document.createElement('button'); fl.type = 'button'; fl.className = 'q-flag'; fl.setAttribute('aria-pressed', 'false'); fl.textContent = '🚩 Flag for review';
      fl.addEventListener('click', () => {
        ex.flagged = !ex.flagged; box.classList.toggle('flagged', ex.flagged);
        fl.setAttribute('aria-pressed', ex.flagged ? 'true' : 'false'); fl.textContent = ex.flagged ? '🚩 Flagged' : '🚩 Flag for review';
      });
      meta.appendChild(fl);
    }

    if (item.type === 'mc' || item.type === 'ms') {
      const ch = item.ch.slice();
      let order = ch.map((_, i) => i);
      if (!item.fixed) order = U.shuffle(order);
      const shown = order.map((i) => ch[i]);
      const layout = optsLayout(shown, box);
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
        hint.textContent = opts.exam ? 'Select all that apply.' : 'Select all that apply. Tap every correct answer, then press Check.';
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
        const mark = (isMS || cls === 'opts-row' || (cls === 'opts-grid' && optionsAreShort))
          ? ''
          : `<span class="let">${letters[k]}</span>`;
        b.innerHTML = mark + '<span class="opt-t">' + formatHTML(html) + '</span>';
        if (isMS) b.setAttribute('aria-label', (isMS ? 'Toggle: ' : '') + U.strip(html));
        bindTap(b, () => {
          if (done) return;
          if (opts.exam && !isMS) { selected.clear(); selected.add(k); paintSel(); return; }
          if (isMS) {
            b.classList.remove('wrong');
            if (selected.has(k)) selected.delete(k);
            else selected.add(k);
            paintSel();
            return;
          }
          if (b.classList.contains('wrong')) return;
          selected.clear();
          selected.add(k);
          paintSel();
          gradeChoices();
        });
        wrap.appendChild(b);
      });
      body.appendChild(wrap);
      /* Re-measure once the card is in the page: the first pass ran before the card had a width, so it sized the
         choices against the whole stage and jammed them into one narrow row inside a column card. */
      const applyLayout = (L) => {
        wrap.className = L.cls + (isMS ? ' opts-ms' : '');
        if (L.cols) wrap.style.setProperty('--opts-cols', String(L.cols)); else wrap.style.removeProperty('--opts-cols');
        const noLet = isMS || L.cls === 'opts-row' || (L.cls === 'opts-grid' && optionsAreShort);
        wrap.querySelectorAll('.opt').forEach((el, k) => {
          const has = el.querySelector('.let');
          if (noLet && has) has.remove();
          else if (!noLet && !has) { const sp = document.createElement('span'); sp.className = 'let'; sp.textContent = letters[k]; el.insertBefore(sp, el.firstChild); }
        });
      };
      if (window.ResizeObserver) {
        let raf = 0;
        new ResizeObserver(() => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => { if (box.clientWidth) applyLayout(optsLayout(shown, box)); });
        }).observe(box);
      }
      const gradeChoices = () => {
        if (done) return;
        if (selected.size === 0) {
          fb.className = 'fb no';
          fb.textContent = isMS ? 'Select every right one — then press Check.' : 'Tap a choice to check it.';
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
      };
      if (isMS && !opts.exam) {
        const chk = document.createElement('button');
        chk.className = 'btn teal';
        chk.type = 'button';
        chk.textContent = 'Check';
        bindTap(chk, gradeChoices);
        actions.appendChild(chk);
      }
      if (opts.exam) {
        ex.answered = () => selected.size > 0;
        ex.grade = () => {
          const opts_ = wrap.querySelectorAll('.opt');
          if (isMS) {
            const wantArr = (Array.isArray(item.a) ? item.a : [item.a]);
            const want = wantArr.slice().sort().join(','), got = [...selected].map((k) => order[k]).sort().join(',');
            opts_.forEach((el, k) => { const isRight = wantArr.indexOf(order[k]) >= 0; if (isRight) el.classList.add('right'); else if (selected.has(k)) el.classList.add('wrong'); });
            return examReveal(got === want, got === want ? '' : 'select every right one, and only those');
          }
          const sel = selected.size ? order[[...selected][0]] : null;
          const wantArr = Array.isArray(item.a) ? item.a : [item.a];
          const correct = sel != null && wantArr.indexOf(sel) >= 0;
          opts_.forEach((el, k) => { if (wantArr.indexOf(order[k]) >= 0) el.classList.add('right'); else if (selected.has(k)) el.classList.add('wrong'); });
          const trap = !correct && sel != null && item.traps && item.traps[sel] ? formatHTML(item.traps[sel]) : '';
          return examReveal(correct, correct ? '' : (sel == null ? 'no answer chosen' : trap));
        };
      }
    } else if (item.type === 'num') {
      const row = document.createElement('div'); row.className = 'num-in';
      const inp = document.createElement('input'); inp.type = 'text'; inp.inputMode = item.inputMode || 'decimal';
      inp.setAttribute('aria-label', 'Your answer');
      if (item.placeholder) inp.placeholder = item.placeholder;
      const chk = document.createElement('button'); chk.className = 'btn teal'; chk.textContent = 'Check';
      const go = () => {
        if (done) return;
        if (!String(inp.value).trim()) { try { inp.focus(); } catch (e) {} return; }
        if (U.eqNum(inp.value, item.a != null ? (item.acc || item.a) : item.acc)) finish(tries === 0);
        else { tries++; fb.className = 'fb no'; fb.textContent = 'Not yet — try a different form or re-check the work.'; if (tries >= 2) why.classList.add('show'); offerAdvance(false); }
      };
      if (opts.exam) {
        row.appendChild(inp); body.appendChild(row);
        ex.answered = () => String(inp.value).trim() !== '';
        ex.grade = () => {
          const ok = U.eqNum(inp.value, item.a != null ? (item.acc || item.a) : item.acc);
          inp.readOnly = true;
          return examReveal(ok, ok || item.a == null ? '' : 'answer: ' + formatHTML(String(item.a)));
        };
      } else {
        bindTap(chk, go);
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
        row.appendChild(inp); row.appendChild(chk);
        body.appendChild(row);
      }
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
      if (opts.exam) {
        let touched = false;
        range.addEventListener('input', () => { touched = true; });
        ex.answered = () => touched;
        ex.grade = () => { const ok = U.eqNum(range.value, item.a); range.disabled = true; return examReveal(ok, ok ? '' : 'answer: ' + item.a); };
      } else actions.appendChild(chk);
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
            if (opts.exam) return;
            const ok = seq.every((v, k) => v === item.order[k]);
            if (ok) finish(tries === 0);
            else { tries++; fb.className = 'fb no'; fb.textContent = 'That order is not quite right. Tap a selected chip to undo, or Reset and try again.'; seq.length = 0; pool.querySelectorAll('.opt').forEach((x) => { x.classList.remove('sel'); }); if (tries >= 2) why.classList.add('show'); offerAdvance(false); }
          }
        });
        pool.appendChild(b);
      });
      const reset = document.createElement('button'); reset.className = 'btn ghost'; reset.textContent = 'Reset';
      bindTap(reset, () => { if (done) return; seq.length = 0; pool.querySelectorAll('.opt').forEach((x) => { x.classList.remove('sel'); }); });
      body.appendChild(pool); actions.appendChild(reset);
      ex.answered = () => seq.length === (item.items || []).length;
      ex.grade = () => { const ok = ex.answered() && seq.every((v, k) => v === item.order[k]); return examReveal(ok, ok ? '' : 'check the order'); };
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
      if (opts.exam) {
        ex.answered = () => true;
        ex.grade = () => { const ok = widget.check(); if (!ok && widget.reveal) widget.reveal(); return examReveal(ok, ok ? '' : 'see the worked steps'); };
      } else actions.appendChild(chk);
    } else if (item.type === 'multi') {
      const parts = item.parts || [];
      let left = parts.length, missed = 0, wrongEnd = 0;
      const subs = [];
      parts.forEach((p, i) => {
        const sub = document.createElement('div');
        sub.className = 'q-part';
        subs.push(renderItem(sub, p, {
          label: 'Part ' + String.fromCharCode(65 + i),
          noScroll: opts.noScroll,
          exam: opts.exam,
          onDone: (ok, t, correct) => { left--; if (!ok) missed++; if (correct === false) wrongEnd++; if (left === 0) finish(missed === 0 && tries === 0, wrongEnd === 0); }
        }));
        body.appendChild(sub);
      });
      if (opts.exam) {
        ex.answered = () => subs.every((b) => b.__exam && b.__exam.answered && b.__exam.answered());
        ex.grade = () => { let ok = true; subs.forEach((b) => { if (!(b.__exam && b.__exam.grade && b.__exam.grade())) ok = false; }); done = true; box.classList.add('is-done', ok ? 'exam-ok' : 'exam-no'); return ok; };
      }
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

  /* Rebuild el's content without the page jumping: hold its height and the scroll spot. */
  function keepPlace(el, rebuild, exact) {
    const y = window.scrollY;
    const h0 = el.offsetHeight;
    el.style.minHeight = h0 + 'px';
    rebuild();
    window.scrollTo(0, y);
    requestAnimationFrame(function () {
      el.style.minHeight = '';
      window.scrollTo(0, y);
      /* If the new question now starts above the screen, nudge up just enough to see its start. */
      if (exact) return;
      const top = el.getBoundingClientRect().top;
      if (top < 0) window.scrollTo(0, Math.max(0, window.scrollY + top - 12));
    });
  }

  /* ---------- Fresh questions: no repeats within a session ---------- */
  const SEEN = new Set();
  function itemKey(it) {
    try {
      let a = it.a != null ? it.a : (it.acc != null ? it.acc : '');
      if (Array.isArray(it.ch)) {
        const idx = Array.isArray(it.a) ? it.a : [it.a];
        a = idx.map((k) => U.strip(it.ch[k] != null ? it.ch[k] : k)).sort().join('|');
      }
      const parts = it.parts ? it.parts.map((p) => String(p.q || p.label || '') + JSON.stringify(p.a != null ? p.a : '')).join('/') : '';
      return [it.type || '', String(it.q || it.label || ''), JSON.stringify(a), it.b != null ? it.b : '', parts].join('#');
    } catch (e) { return String(Math.random()); }
  }
  /* groups: arrays of makers in priority order. Returns the first unseen item; else the first one built. */
  function freshFrom(groups, perGroup) {
    let fallback = null;
    for (const g of groups) {
      const makers = (g || []).filter((f) => typeof f === 'function');
      if (!makers.length) continue;
      const tries = Math.max(perGroup || 14, makers.length * 3);
      for (let t = 0; t < tries; t++) {
        let it = null;
        try { it = U.pick(makers)(); } catch (e) { it = null; }
        if (!it) continue;
        if (!fallback) fallback = it;
        const k = itemKey(it);
        if (!SEEN.has(k)) { SEEN.add(k); return it; }
      }
    }
    if (fallback) SEEN.add(itemKey(fallback));
    return fallback;
  }
  const genName = (s) => (s && s.gen && s.gen.name && s.gen.name !== 'gen' ? s.gen.name : '');
  function fnSource(list) {
    return (list || []).map((f) => (typeof f === 'function' ? String(f) : '')).join(' ');
  }
  /* Skill generators that a card / lesson points at, by name (e.g. try: () => genD2F()). */
  function gensIn(src, skills) {
    return skills.filter((s) => {
      const n = genName(s);
      return n && new RegExp('\\b' + n + '\\b').test(src);
    }).map((s) => s.gen);
  }
  function gensByWords(text, skills) {
    const words = (String(text).toLowerCase().match(/[a-z]{4,}/g) || []).filter((x) => !/^(with|from|that|this|then|into|your|what|more|same|many|name|names|make|sit|first|place|tryit)$/.test(x));
    return skills.filter((s) => {
      const sw = String(s.name || '').toLowerCase().match(/[a-z]{4,}/g) || [];
      return sw.some((x) => words.some((y) => y.slice(0, 5) === x.slice(0, 5)));
    }).map((s) => s.gen);
  }

  function section(cls, icon, label) {
    const sec = document.createElement('section');
    sec.className = 'ls ' + cls;
    const hd = document.createElement('div');
    hd.className = 'ls-h';
    hd.innerHTML = `<span class="ls-ico" aria-hidden="true">${icon}</span><span>${label}</span>`;
    const bd = document.createElement('div');
    bd.className = 'ls-b';
    sec.appendChild(hd); sec.appendChild(bd);
    return { sec, bd };
  }

  /* Wide screens: the idea + pictures stay on the left, the try-its on the right. The worked example, trap and
     stretch go wherever they make the two columns closest in height. The default is worked example left, trap and
     stretch right. */
  function balanceLesson(body) {
    if (!body || !document.body.contains(body)) return;
    const main = body.querySelector(':scope > .lesson-main'), side = body.querySelector(':scope > .lesson-side');
    if (!main || !side || !(w.matchMedia && w.matchMedia('(min-width: 1100px)').matches)) return;
    const work = body.querySelector('.ls-work'), pair = body.querySelector('.ls-pair');
    if (!work && !pair) return;
    const GAP = 14, hw = work ? work.offsetHeight : 0, hp = pair ? pair.offsetHeight : 0;
    const inMain = (el) => !!el && el.parentNode === main;
    let L = main.offsetHeight, R = side.offsetHeight;
    if (work) { if (inMain(work)) L -= hw + GAP; else R -= hw + GAP; }
    if (pair) { if (inMain(pair)) L -= hp + GAP; else R -= hp + GAP; }
    const add = (base, h) => base + (h ? (base > 0 ? GAP : 0) + h : 0);
    /* [work to the left?, pair to the left?] in order of preference when two layouts tie */
    const opts = [[1, 0], [0, 0], [1, 1], [0, 1]];
    let best = null;
    opts.forEach(([wl, pl]) => {
      let l = Math.max(0, L), r = Math.max(0, R);
      if (work) { if (wl) l = add(l, hw); else r = add(r, hw); }
      if (pair) { if (pl) l = add(l, hp); else r = add(r, hp); }
      const d = Math.abs(l - r);
      if (!best || d < best.d - 40) best = { d, wl, pl };
    });
    if (work) (best.wl ? main : side).appendChild(work);
    if (pair) (best.pl ? main : side).appendChild(pair);
  }
  function balanceSoon(body) {
    const go = () => balanceLesson(body);
    requestAnimationFrame(go);
    setTimeout(go, 350);
    let t = 0;
    const onResize = () => {
      if (!document.body.contains(body)) { window.removeEventListener('resize', onResize); return; }
      clearTimeout(t); t = setTimeout(go, 200);
    };
    window.addEventListener('resize', onResize);
  }

  function playLesson(host, lesson, onDone, ctx) {
    ctx = ctx || {};
    const skills = (ctx.skills || []).filter((s) => s && typeof s.gen === 'function');
    const allGens = skills.map((s) => s.gen);
    const lessonSrc = fnSource([].concat(...lesson.cards.map((c) => [].concat(c.try || [], c.tries || []))));
    const lessonGens = [...new Set(gensIn(lessonSrc, skills).concat(gensByWords(lesson.name + ' ' + lesson.cards.map((c) => c.t || '').join(' '), skills)))];
    host.innerHTML = '';
    const card = document.createElement('div'); card.className = 'lesson-card';
    host.appendChild(card);
    let i = 0;
    const draw = () => {
      const raw = lesson.cards[i];
      const c = decorateCard(lesson, raw);
      card.innerHTML = '';
      const head = document.createElement('div');
      head.className = 'lesson-head';
      const title = document.createElement('h3');
      title.innerHTML = c.t || lesson.name;
      const step = document.createElement('span');
      step.className = 'lesson-step';
      step.textContent = 'Card ' + (i + 1) + ' of ' + lesson.cards.length;
      head.appendChild(title); head.appendChild(step);
      card.appendChild(head);
      const hasTries = !!(c.tries && c.tries.length);
      const body = document.createElement('div');
      body.className = 'lesson-body' + (hasTries ? ' lesson-split' : '');
      const main = document.createElement('div');
      main.className = 'lesson-main';
      const sideItems = [];
      const place = (el) => { if (hasTries) sideItems.push(el); else main.appendChild(el); };

      if (c.html || c.remember) {
        const s1 = section('ls-idea', '💡', 'Big idea');
        if (c.html) {
          const explain = document.createElement('div');
          explain.className = 'lesson-explain';
          explain.innerHTML = c.html;
          s1.bd.appendChild(explain);
        }
        if (c.remember) {
          const r = document.createElement('div'); r.className = 'remember'; r.innerHTML = '<span class="callout-k">Remember</span>' + c.remember; s1.bd.appendChild(r);
        }
        main.appendChild(s1.sec);
      }
      if (c.watch && w.EX) {
        const sw = section('ls-see ls-watch', '🎬', 'Watch it');
        sw.bd.appendChild(w.EX.watchButton(c.watch));
        main.appendChild(sw.sec);
      }
      if (c.viz) {
        const s2 = section('ls-see', '👀', 'See it');
        mountViz(s2.bd, c.viz);
        if (s2.bd.querySelector('.ix')) s2.sec.querySelector('.ls-h span:last-child').textContent = 'See it · tap to explore';
        if (s2.bd.childNodes.length) main.appendChild(s2.sec);
      }
      if ((c.steps && c.steps.length) || c.example) {
        const s3 = section('ls-work', '✏️', 'Worked example');
        if (c.steps && c.steps.length) s3.bd.innerHTML = '<ol class="steps">' + c.steps.map((x) => '<li>' + x + '</li>').join('') + '</ol>';
        if (c.example) { const ex = document.createElement('div'); ex.innerHTML = c.example; s3.bd.appendChild(ex); }
        main.appendChild(s3.sec);
      }
      if (c.trap || c.aap || c.stretch) {
        const pair = document.createElement('div');
        pair.className = 'ls-pair';
        if (c.trap) {
          const s4 = section('ls-trap', '⚠️', 'Common trap');
          s4.bd.innerHTML = c.trap;
          pair.appendChild(s4.sec);
        }
        if (c.aap || c.stretch) {
          const s5 = section('ls-aap', '🚀', 'Advanced stretch');
          const stretch = c.stretch || c.aap;
          const aapHtml = typeof stretch === 'string' ? stretch : (stretch.html || stretch.text || '');
          s5.bd.innerHTML = aapHtml.replace(/^\s*(AAP|Advanced):\s*/i, '');
          pair.appendChild(s5.sec);
        }
        place(pair);
      }
      body.appendChild(main);

      if (hasTries) {
        const cardGens = gensIn(fnSource([].concat(raw.try || [], raw.tries || [])), skills);
        const prac = document.createElement('aside');
        prac.className = 'lesson-practice';
        const ph = document.createElement('div');
        ph.className = 'ls-h';
        ph.innerHTML = `<span class="ls-ico" aria-hidden="true">🎯</span><span>${c.tries.length === 1 ? 'Try it' : 'Try these'}</span>`;
        prac.appendChild(ph);
        c.tries.forEach((fn, k) => {
          const slot = document.createElement('div');
          slot.className = 'try-slot';
          let first = true;
          const load = () => {
            slot.innerHTML = '';
            /* First: this card's own question. After that: fresh questions from the same skill, then the lesson, then the unit. */
            const groups = [[fn], [...new Set(cardGens.concat(lessonGens))], allGens];
            /* The first view of a card always shows the card's own try-it (never swapped for a random unit question). */
            let it = null;
            if (first) { try { it = fn(); } catch (e) { it = null; } if (it) SEEN.add(itemKey(it)); }
            if (!it) it = freshFrom(groups, first ? 4 : 10);
            first = false;
            if (!it) return;
            renderItem(slot, it, {
              label: 'Try ' + (k + 1),
              nextLabel: 'Try another →',
              onNext: () => keepPlace(slot, load)
            });
            formatFractionsIn(slot);
          };
          load();
          prac.appendChild(slot);
        });
        const side = document.createElement('div');
        side.className = 'lesson-side';
        side.appendChild(prac);
        sideItems.forEach((x) => side.appendChild(x));
        body.appendChild(side);
      }
      card.appendChild(body);
      if (hasTries) balanceSoon(body);
      const nav = document.createElement('div'); nav.className = 'row-btns lesson-nav';
      if (i > 0) {
        const back = document.createElement('button'); back.className = 'btn ghost'; back.textContent = 'Back';
        back.onclick = () => { i--; keepPlace(card, draw, true); }; nav.appendChild(back);
      }
      const dots = document.createElement('div'); dots.className = 'dots';
      lesson.cards.forEach((_, k) => { const d = document.createElement('i'); if (k === i) d.classList.add('on'); dots.appendChild(d); });
      nav.appendChild(dots);
      const next = document.createElement('button'); next.className = 'btn';
      next.textContent = i < lesson.cards.length - 1 ? 'Next card' : 'Lesson complete';
      next.onclick = () => {
        if (i < lesson.cards.length - 1) { i++; keepPlace(card, draw, true); }
        else if (onDone) onDone();
      };
      nav.appendChild(next);
      card.appendChild(nav);
      formatFractionsIn(card);
    };
    draw();
  }

  /* Wide screens (sidebar tabs) show several question cards at once. */
  const WIDE_MQ = '(min-width: 1100px)';
  const isWide = () => !!(w.matchMedia && w.matchMedia(WIDE_MQ).matches);
  const perPage = () => ((w.innerWidth || 0) >= 1500 ? 6 : 4);

  /* ---------- Main mount ---------- */
  const BREAKS = [
    { e: '🤸', t: 'Stand up and do 8 slow stretches, then come back ready.' },
    { e: '🧘', t: 'Take four slow breaths. In for 3, out for 3.' },
    { e: '✋', t: 'Trace a big infinity sign in the air with your finger, eight times.' },
    { e: '🔢', t: 'Skip-count by 7s out loud while marching in place.' },
    { e: '👀', t: 'Look out a window for 20 seconds, then blink slowly 5 times.' }
  ];

  function mount(UNIT) {
    if (w.WP && typeof WP.attach === 'function') WP.attach(UNIT);
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
        ${UNIT.game ? '<button data-tab="game">' + UNIT.game.tab + '</button>' : ''}
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
      else if (tab === 'game' && UNIT.game) UNIT.game.mount(stage, { lvl: M.lvl, addXP: (n) => { M.xp += n; save(); setXP(); } });
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
        }, { skills: T.skills || [] });
      };
      const first = T.lessons.findIndex((L) => !M.les[L.id]);
      open(first < 0 ? 0 : first);
    }

    /* ---- Review queue: missed Test Lab questions come back in Practice after 1, 3 and 7 days ---- */
    const RQK = key + ':rq', RQ_STEPS = [1, 3, 7];
    let RQ = store(RQK) || [];
    const rqSave = () => store(RQK, RQ);
    const dayN = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 864e5); };
    const rqLevel = () => RQ.filter((e) => e.lvl === M.lvl);
    const rqDue = () => rqLevel().filter((e) => e.due <= dayN());
    const rqAdd = (it) => {
      let bad = false, copy = null;
      try { copy = JSON.parse(JSON.stringify(it, (k, v) => { if (typeof v === 'function') { bad = true; return undefined; } return v; })); } catch (e) { bad = true; }
      if (bad || !copy) return;
      const k = itemKey(copy);
      const hit = RQ.find((e) => e.k === k && e.lvl === M.lvl);
      if (hit) { hit.step = 0; hit.due = dayN(); }
      else RQ.push({ k, lvl: M.lvl, it: copy, step: 0, due: dayN() });
      if (RQ.length > 60) RQ = RQ.slice(RQ.length - 60);
      rqSave();
    };
    const rqResolve = (k, ok) => {
      const e = RQ.find((x) => x.k === k && x.lvl === M.lvl); if (!e) return;
      if (ok) { e.step++; if (e.step > RQ_STEPS.length) RQ = RQ.filter((x) => x !== e); else e.due = dayN() + RQ_STEPS[e.step - 1]; }
      else { e.step = 0; e.due = dayN() + 1; }
      rqSave();
    };
    let goReview = false;

    function showPractice() {
      const T = track();
      const skills = T.skills || [];
      stage.innerHTML = `<h2>Practice · ${M.lvl === 'advanced' ? 'Advanced' : 'Core'}</h2>
        <p class="lede">Fresh questions every time. Tap a choice to check it right away. For typed answers, press Check or Enter. A skill earns a ⭐ after 3 right answers on 2 different days.</p>
        <div class="practice-top">
          <div class="seg" id="skillSeg"></div>
          <div class="seg" id="nSeg"></div>
          <span class="stat" id="stSolved">0 solved</span>
          <span class="stat" id="stStreak">streak 0</span>
        </div>
        <div id="pHost" class="stage-host"></div>`;
      let skill = 'all', n = 5, nChoice = 5, solved = 0, streak = 0, qi = 0, cur = null, lastSkill = null, revSeen = new Set();
      const skillSeg = stage.querySelector('#skillSeg');
      function startFresh() {
        qi = 0; solved = 0; streak = 0; lastSkill = null; cur = null; revSeen = new Set();
        n = skill === '__rev' ? Math.max(1, Math.min(nChoice || 99, rqLevel().length)) : nChoice;
        const solEl = stage.querySelector('#stSolved');
        const stEl = stage.querySelector('#stStreak');
        if (solEl) solEl.textContent = '0 solved';
        if (stEl) stEl.textContent = 'streak 0';
        next();
      }
      const allBtn = document.createElement('button'); allBtn.className = 'on'; allBtn.textContent = 'All skills';
      allBtn.onclick = () => { skill = 'all'; [...skillSeg.children].forEach((x) => x.classList.remove('on')); allBtn.classList.add('on'); startFresh(); };
      skillSeg.appendChild(allBtn);
      let revBtn = null;
      if (rqLevel().length) {
        revBtn = document.createElement('button'); revBtn.textContent = '🔁 Review (' + rqLevel().length + ')';
        revBtn.title = 'Questions you missed before. They come back after 1, 3 and 7 days.';
        revBtn.onclick = () => { skill = '__rev'; [...skillSeg.children].forEach((x) => x.classList.remove('on')); revBtn.classList.add('on'); startFresh(); };
        skillSeg.appendChild(revBtn);
      }
      skills.forEach((s) => {
        const b = document.createElement('button'); b.textContent = s.name;
        b.onclick = () => { skill = s.id; [...skillSeg.children].forEach((x) => x.classList.remove('on')); b.classList.add('on'); startFresh(); };
        skillSeg.appendChild(b);
      });
      const nSeg = stage.querySelector('#nSeg');
      [5, 10, 20, 0].forEach((k) => {
        const b = document.createElement('button'); b.textContent = k ? String(k) : '∞'; if (k === 5) b.classList.add('on');
        b.onclick = () => { nChoice = k; n = k; [...nSeg.children].forEach((x) => x.classList.remove('on')); b.classList.add('on'); startFresh(); };
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
      function revPick() {
        const pool = (skill === '__rev' ? rqLevel() : rqDue()).filter((e) => !revSeen.has(e.k));
        if (!pool.length) return null;
        pool.sort((a, b) => a.due - b.due || a.step - b.step);
        const e = pool[0]; revSeen.add(e.k);
        const it = JSON.parse(JSON.stringify(e.it)); it.__rq = e.k; it.skill = '__rev';
        return { s: { id: '__rev', name: '🔁 Review' }, it };
      }
      function makeItem() {
        if (skill === '__rev') { const r = revPick(); if (r) return r; }
        else if (skill === 'all' && rqDue().length && Math.random() < 0.3) { const r = revPick(); if (r) return r; }
        let s = pickSkill();
        if (skill === 'all' && skills.length > 1 && lastSkill && s.id === lastSkill) s = pickSkill();
        lastSkill = s.id;
        const it = freshFrom([[s.gen]], 30);
        if (it) it.skill = s.id;
        return { s, it };
      }
      const onScore = (s, it) => (ok) => {
        if (s.id === '__rev') rqResolve(it && it.__rq, ok); else credit(s.id, ok);
        if (ok) { solved++; streak++; }
        else { streak = 0; }
        stage.querySelector('#stSolved').textContent = solved + ' solved';
        stage.querySelector('#stStreak').textContent = 'streak ' + streak;
      };
      function roundDone() {
        host.innerHTML = `<div class="remember round-done">🎉 Round complete: <b>${solved}</b> solved, streak ${streak}. Nice calm work.</div>`;
        const b = document.createElement('button'); b.className = 'btn'; b.textContent = 'Another round';
        b.onclick = () => { qi = 0; solved = 0; keepPlace(host, next); }; host.appendChild(b);
      }
      /* Wide screens: a set of question cards at once, each with its own Check. */
      function nextSet() {
        if (n && qi >= n) { roundDone(); return; }
        const per = perPage();
        const count = n ? Math.min(per, n - qi) : per;
        host.innerHTML = '';
        const cap = document.createElement('div'); cap.className = 'set-cap';
        cap.innerHTML = `<b>Questions ${qi + 1}–${qi + count}${n ? ' of ' + n : ''}</b><span>Tap a choice to check it, or press Check on a typed answer. Go in any order.</span>`;
        host.appendChild(cap);
        const grid = document.createElement('div'); grid.className = 'qgrid';
        host.appendChild(grid);
        const nav = document.createElement('div'); nav.className = 'row-btns set-nav';
        const nb = document.createElement('button'); nb.className = 'btn ghost'; nb.type = 'button';
        const last = n && qi + count >= n;
        nb.textContent = last ? 'Finish round' : 'Next set →';
        let left = count;
        const status = document.createElement('span'); status.className = 'set-left';
        const paint = () => {
          status.textContent = left ? left + ' left in this set' : 'Set done!';
          nb.className = 'btn ' + (left ? 'ghost' : 'teal');
        };
        for (let j = 0; j < count; j++) {
          const cell = document.createElement('div'); cell.className = 'qcell';
          grid.appendChild(cell);
          const { s, it } = makeItem();
          if (!it) { cell.innerHTML = '<div class="remember">Could not build a question for this skill.</div>'; left--; continue; }
          const score = onScore(s, it);
          renderItem(cell, it, {
            label: 'Q' + (qi + j + 1) + ' · ' + s.name,
            noScroll: true,
            onDone: (ok) => { score(ok); left--; paint(); }
          });
          if (cell.querySelector('.paper-wrap')) cell.classList.add('span-all');
        }
        qi += count;
        nb.onclick = () => { if (last) roundDone(); else nextSet(); try { host.scrollIntoView({ block: 'start', inline: 'nearest' }); } catch (e) {} };
        nav.appendChild(status); nav.appendChild(nb);
        host.appendChild(nav);
        paint();
        formatFractionsIn(host);
      }
      /* Phones and tablets: one question at a time with a sticky Check / Next bar. */
      function nextOne() {
        if (n && qi >= n) { roundDone(); return; }
        const { s, it } = makeItem();
        if (!it) {
          host.innerHTML = '<div class="remember">Could not build a question for this skill. Try another skill.</div>';
          return;
        }
        host.innerHTML = '';
        const cap = document.createElement('div'); cap.className = 'lede'; cap.textContent = `Question ${qi + 1}${n ? ' of ' + n : ''} · ${s.name}`;
        host.appendChild(cap);
        const holder = document.createElement('div'); host.appendChild(holder);
        renderItem(holder, it, {
          sticky: true,
          nextLabel: n && qi + 1 >= n ? 'Finish round' : 'Next',
          onDone: onScore(s, it),
          onNext: () => { qi++; keepPlace(host, next); }
        });
      }
      function next() { if (isWide()) nextSet(); else nextOne(); }
      if (goReview && revBtn) { goReview = false; revBtn.click(); } else next();
    }

    function showTest() {
      const T = track();
      const items = (typeof T.test === 'function' ? T.test() : (T.test || [])).slice();
      items.forEach((it) => SEEN.add(itemKey(it)));
      const wide = isWide(), N = items.length;
      stage.innerHTML = `<h2>Test Lab · ${M.lvl === 'advanced' ? 'Advanced' : 'Core'}</h2>
        <p class="lede">SOL-style formats, like the real test: answer every question, then press <b>Submit test</b>. You'll see what was right and why only after you finish. ${wide ? 'All questions are on the page — answer them in any order.' : 'One question at a time — you can go back to change an answer.'}</p>
        <label class="tm-tog"><input type="checkbox" id="tmOn"${M.timer ? ' checked' : ''}> ⏱ Show a timer <span>(optional, counts up, no pressure)</span></label>
        <div class="tm-pill" id="tmPill" hidden></div>
        <div id="tHost" class="stage-host"></div>`;
      const host = stage.querySelector('#tHost');
      const t0 = Date.now(); let tEnd = 0;
      const tmPill = stage.querySelector('#tmPill'), tmOn = stage.querySelector('#tmOn');
      const fmtT = (ms) => { const sec = Math.floor(ms / 1000); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); };
      const tmPaint = () => {
        tmPill.hidden = !M.timer;
        if (M.timer) tmPill.textContent = '⏱ ' + fmtT((tEnd || Date.now()) - t0) + ' · a calm pace is about ' + Math.max(1, Math.round(N * 1.5)) + ' min in all';
      };
      tmOn.onchange = () => { M.timer = tmOn.checked; save(); tmPaint(); };
      const tmIv = setInterval(() => { if (!document.body.contains(tmPill) || tEnd) { clearInterval(tmIv); return; } tmPaint(); }, 1000);
      tmPaint();
      const grid = document.createElement('div'); grid.className = wide ? 'qgrid' : 'qpager';
      host.appendChild(grid);
      const cells = [], boxes = [];
      items.forEach((it, k) => {
        const cell = document.createElement('div'); cell.className = 'qcell';
        grid.appendChild(cell); cells.push(cell);
        boxes.push(renderItem(cell, it, { label: 'Q' + (k + 1) + ' of ' + N, noScroll: true, noWatch: true, exam: true }));
        if (cell.querySelector('.paper-wrap')) cell.classList.add('span-all');
      });
      const nav = document.createElement('div'); nav.className = 'row-btns set-nav exam-nav';
      const status = document.createElement('span'); status.className = 'set-left';
      const dots = document.createElement('div'); dots.className = 'q-dots';
      if (!wide) host.insertBefore(dots, grid);
      host.appendChild(nav);
      let cur = 0, submitted = false, warned = false, flagCur = -1;
      const isAns = (b) => !b.__exam || !b.__exam.answered || b.__exam.answered();
      const answeredCount = () => boxes.filter(isAns).length;
      const mkBtn = (label, cls, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (cls || ''); b.textContent = label; bindTap(b, fn); return b; };
      const flaggedList = () => boxes.map((b, k) => (b.__exam && b.__exam.flagged ? k : -1)).filter((k) => k >= 0);
      function paint() {
        if (submitted) return;
        const n = answeredCount(), fl = flaggedList();
        status.textContent = (wide ? (n + ' of ' + N + ' answered') : ('Question ' + (cur + 1) + ' of ' + N + ' · ' + n + ' answered')) + (fl.length ? ' · 🚩 ' + fl.length : '');
        if (!wide) {
          cells.forEach((c, k) => { c.style.display = k === cur ? '' : 'none'; });
          dots.innerHTML = '';
          boxes.forEach((b, k) => {
            const d = document.createElement('button'); d.type = 'button';
            d.className = 'q-dot' + (isAns(b) ? ' on' : '') + (k === cur ? ' cur' : '') + (b.__exam && b.__exam.flagged ? ' flag' : '');
            d.textContent = k + 1; d.setAttribute('aria-label', 'Go to question ' + (k + 1));
            bindTap(d, () => { cur = k; warned = false; paint(); });
            dots.appendChild(d);
          });
        }
        nav.innerHTML = '';
        if (!wide) { const back = mkBtn('Back', 'ghost', () => { if (cur > 0) { cur--; paint(); } }); back.disabled = cur === 0; nav.appendChild(back); }
        nav.appendChild(status);
        if (fl.length) nav.appendChild(mkBtn('🚩 Next flagged', 'ghost', () => {
          const after = fl.find((k) => k > (wide ? flagCur : cur)); const k = after != null ? after : fl[0]; flagCur = k;
          if (wide) { try { cells[k].scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} } else { cur = k; paint(); }
        }));
        if (!wide && cur < N - 1) nav.appendChild(mkBtn('Next', '', () => { cur++; paint(); }));
        if (wide || cur === N - 1 || warned) nav.appendChild(mkBtn('Submit test', 'teal', submit));
      }
      function submit() {
        if (submitted) return;
        const left = N - answeredCount(), fls = flaggedList().length;
        if ((left || fls) && !warned) {
          warned = true;
          const msg = [left ? left + ' unanswered' : '', fls ? fls + ' flagged for review' : ''].filter(Boolean).join(' · ') + ' — press Submit test again to finish anyway.';
          status.textContent = msg;
          if (!wide) { let first = boxes.findIndex((b) => !isAns(b)); if (first < 0) first = flaggedList()[0]; if (first >= 0) { cur = first; paint(); status.textContent = msg; } }
          return;
        }
        submitted = true; tEnd = Date.now(); tmPaint();
        let right = 0; const missed = [];
        boxes.forEach((b, k) => { const g = b.__exam && b.__exam.grade ? b.__exam.grade() : false; if (g) right++; else missed.push(k + 1); });
        cells.forEach((c) => { c.style.display = ''; });
        grid.className = wide ? 'qgrid' : 'qpager review';
        dots.remove(); nav.remove();
        formatFractionsIn(host);
        const box = document.createElement('div'); box.className = 'test-done';
        const pct = N ? Math.round(100 * right / N) : 0;
        box.innerHTML = `<div class="remember">🧪 Test complete: <b>${right} / ${N}</b> correct (${pct}%). ${right >= Math.ceil(N * 0.8) ? 'Strong work.' : 'Read the explanations below, review the lessons, then try a fresh pack.'}</div>`;
        const timeNote = M.timer ? ' Time: ' + fmtT(tEnd - t0) + '.' : '';
        if (timeNote) box.firstChild.insertAdjacentHTML('beforeend', timeNote);
        /* Results by topic */
        const topicOf = (it) => { try { if (typeof UNIT.topicOf === 'function') return UNIT.topicOf(it) || 'Mixed'; } catch (e) {} return it.topic || null; };
        const tally = {}; items.forEach((it, k) => { const t = topicOf(it); if (!t) return; const r = tally[t] || (tally[t] = { n: 0, c: 0 }); r.n++; if (!missed.includes(k + 1)) r.c++; });
        const tnames = Object.keys(tally);
        if (tnames.length >= 2) {
          const tb = document.createElement('div'); tb.className = 'topic-res';
          tb.innerHTML = '<div class="tr-h">By topic</div>' + tnames.sort((a, b) => (tally[a].c / tally[a].n) - (tally[b].c / tally[b].n)).map((t) => {
            const r = tally[t], pc = Math.round(100 * r.c / r.n);
            return '<div class="tr-row' + (r.c < r.n ? ' weak' : '') + '"><span class="tr-n">' + t + '</span><span class="tr-bar"><i style="width:' + pc + '%"></i></span><span class="tr-s">' + r.c + '/' + r.n + '</span></div>';
          }).join('');
          box.appendChild(tb);
        }
        const fl = boxes.map((b, k) => (b.__exam && b.__exam.flagged ? k + 1 : 0)).filter(Boolean);
        if (fl.length) { const fn = document.createElement('div'); fn.className = 'ix-note'; fn.textContent = '🚩 You flagged ' + fl.map((q) => 'Q' + q).join(', ') + ' (' + fl.filter((q) => !missed.includes(q)).length + ' of them turned out right).'; box.appendChild(fn); }
        /* Missed questions go into the review queue for Practice (back after 1, 3 and 7 days). */
        missed.forEach((q) => rqAdd(items[q - 1]));
        if (missed.length) {
          const row = document.createElement('div'); row.className = 'row-btns exam-missed';
          const lab = document.createElement('span'); lab.className = 'set-left'; lab.textContent = 'Review the ones to learn from:'; row.appendChild(lab);
          missed.forEach((q) => row.appendChild(mkBtn('Q' + q, 'ghost', () => { try { cells[q - 1].scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {} })));
          box.appendChild(row);
        }
        const acts = document.createElement('div'); acts.className = 'row-btns';
        if (missed.length && rqLevel().length) acts.appendChild(mkBtn('🔁 Practice the ones I missed', 'teal', () => { goReview = true; show('practice'); }));
        acts.appendChild(mkBtn('New checkpoint', '', () => showTest()));
        box.appendChild(acts);
        host.insertBefore(box, host.firstChild);
        M.xp += right * 4; save(); setXP();
        try { stage.scrollIntoView({ block: 'start' }); w.scrollTo(0, 0); } catch (e) {}
      }
      const refresh = () => setTimeout(() => { if (!submitted) { warned = false; paint(); } }, 0);
      ['click', 'input', 'pointerup', 'keyup'].forEach((ev) => host.addEventListener(ev, (e) => { const path = e.composedPath ? e.composedPath() : []; if (path.some((x) => x.classList && (x.classList.contains('exam-nav') || x.classList.contains('q-dots')))) return; refresh(); }));
      paint();
      formatFractionsIn(host);
    }

    let wasWide = isWide();
    if (w.matchMedia) {
      const mq = w.matchMedia(WIDE_MQ);
      const onChange = () => {
        if (isWide() === wasWide) return;
        wasWide = isWide();
        if (M.tab === 'practice' || M.tab === 'test') show(M.tab);
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
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

  /* 4 columns when short options fit in a row, 2 when crowded, 1 only for long text. */
  function printOptsClass(ch) {
    const opts = ch || [];
    if (!opts.length) return 'print-opts-1';
    const texts = opts.map((o) => U.strip(o).replace(/\s+/g, ' '));
    const maxLen = Math.max.apply(null, texts.map((t) => t.length).concat([0]));
    const allVeryShort = opts.every(isShortAnswer) && maxLen <= 12;
    const compact = opts.every((o, i) => isShortAnswer(o) || (texts[i].length <= 18 && !/[A-Za-z]{8,}/.test(texts[i])));
    if (allVeryShort && opts.length <= 6) return 'print-opts-4';
    if (compact && maxLen <= 24) return 'print-opts-2';
    return 'print-opts-1';
  }

  function printSkillPool(UNIT, lvl) {
    const core = (UNIT.core && UNIT.core.skills) || [];
    const adv = (UNIT.advanced && UNIT.advanced.skills) || [];
    if (lvl === 'advanced') return (adv.length ? adv : core).slice();
    // Core pack: medium–hard. Prefer advanced / challenge skills, keep core topics in the mix.
    const seen = {};
    const out = [];
    adv.concat(core).forEach((s) => {
      if (!s || !s.gen) return;
      const k = s.id || s.name;
      if (seen[k]) return;
      seen[k] = 1;
      out.push(s);
    });
    return out.length ? out : core.slice();
  }

  function makePrintItem(skill) {
    const once = () => {
      if (w.G5 && w.Adapt && skill.id) {
        const gid = String(skill.id).replace(/^adv-/, '').replace(/^h-/, '');
        try {
          const raw = G5.make(gid, 'adv');
          if (raw) return U.normalizeChoiceItem(Adapt.toLab(raw));
        } catch (e) {}
      }
      let it = null;
      try { it = skill.gen('adv'); } catch (e) { it = null; }
      if (!it) try { it = skill.gen(); } catch (e) { it = null; }
      return it ? U.normalizeChoiceItem(it) : null;
    };
    for (let t = 0; t < 24; t++) {
      const it = once();
      if (it) return { skill: skill.name, it: it };
    }
    return null;
  }

  function keyText(it) {
    if (!it) return '';
    if (it.type === 'mc') return 'ABCDEFGH'[it.a] + '. ' + formatHTML((it.ch || [])[it.a] || '');
    if (it.type === 'ms') return (it.a || []).map((k) => 'ABCDEFGH'[k] + '. ' + formatHTML((it.ch || [])[k] || '')).join(' ');
    if (it.type === 'num') return formatHTML(String(Array.isArray(it.a) ? it.a[0] : it.a));
    if (it.type === 'paper-mul') return String(it.a * it.b);
    if (it.type === 'paper-div') return String(Math.floor(it.a / it.b)) + (it.a % it.b ? ' R' + (it.a % it.b) : '');
    if (it.type === 'multi' && it.parts) {
      return it.parts.map((p, j) => 'ABCDEFGH'[j] + '. ' + formatHTML(String(Array.isArray(p.a) ? p.a[0] : (p.a != null ? p.a : '')))).join(' ');
    }
    return it.why ? U.strip(it.why).slice(0, 80) : '';
  }

  function renderQuestionEl(pack, i) {
    const it = pack.it || {};
    const el = document.createElement('div');
    el.className = 'pq';
    const ms = it.type === 'ms';
    let body = '<div class="qn"><span class="pq-num">' + (i + 1) + '</span><span class="pq-skill">' + (pack.skill || '') + '</span></div>';
    if (ms) body += '<div class="print-ms">Select all that apply.</div>';
    body += '<div class="q">' + (it.q || it.label || '') + '</div>';
    if (it.type === 'mc' || it.type === 'ms') {
      const cls = printOptsClass(it.ch);
      body += '<div class="print-opts ' + cls + '">' + (it.ch || []).map((c, k) =>
        '<div class="print-opt"><span class="print-bubble">' + 'ABCDEFGH'[k] + '</span><span class="print-opt-t">' + c + '</span></div>'
      ).join('') + '</div>';
    } else if (it.type === 'multi' && it.parts) {
      body += it.parts.map((p, j) =>
        '<div class="print-part"><b>Part ' + 'ABCDEFGH'[j] + '.</b> ' + (p.q || p.label || '') + '<div class="print-line"></div></div>'
      ).join('');
    } else {
      body += '<div class="print-line"></div><div class="print-line"></div>';
    }
    el.innerHTML = body;
    formatFractionsIn(el);
    return el;
  }

  function renderKeyEl(pack, i) {
    const el = document.createElement('div');
    el.className = 'pq';
    const it = pack.it || {};
    let html = '<div class="qn"><span class="pq-num">' + (i + 1) + '</span></div><b>' + keyText(it) + '</b>';
    if (it.wp && it.why) html += '<div class="print-work">' + it.why + '</div>';
    el.innerHTML = html;
    formatFractionsIn(el);
    return el;
  }

  function pageOverflows(page) {
    const box = page.getBoundingClientRect();
    const foot = page.querySelector('.print-foot');
    const limit = foot ? foot.getBoundingClientRect().top : box.bottom;
    if (page.scrollHeight > page.clientHeight + 2) return true;
    const nodes = page.querySelectorAll('.pq, .print-head');
    for (let i = 0; i < nodes.length; i++) {
      const r = nodes[i].getBoundingClientRect();
      if (r.bottom > limit + 1) return true;
      if (r.right > box.right + 2) return true;
    }
    return false;
  }

  function makeMeasureHost() {
    let host = document.getElementById('print-measure');
    if (host) host.remove();
    host = document.createElement('div');
    host.id = 'print-measure';
    document.body.appendChild(host);
    return host;
  }

  function startPage(kind, headHTML) {
    const page = document.createElement('section');
    page.className = 'print-page' + (kind === 'key' ? ' print-key' : '');
    page.innerHTML = '<div class="print-head">' + headHTML + '</div><div class="print-grid"><div class="print-col"></div><div class="print-col"></div></div><div class="print-foot"><span class="print-pnum"></span></div>';
    return page;
  }

  function shorterCol(page) {
    const cols = page.querySelectorAll('.print-col');
    if (cols.length < 2) return page.querySelector('.print-grid') || page;
    return cols[0].offsetHeight <= cols[1].offsetHeight ? cols[0] : cols[1];
  }

  function fillPages(host, items, kind, headFn) {
    const pages = [];
    let i = 0;
    let page = null;
    let grid = null;
    const ensurePage = () => {
      if (page) return;
      page = startPage(kind, headFn(pages.length));
      host.appendChild(page);
      grid = shorterCol(page);
      void page.offsetHeight;
    };
    const commitPage = () => {
      if (page) pages.push(page);
      page = null;
      grid = null;
    };
    while (i < items.length) {
      ensurePage();
      grid = shorterCol(page);
      const el = kind === 'key' ? renderKeyEl(items[i], i) : renderQuestionEl(items[i], i);
      grid.appendChild(el);
      void page.offsetHeight;
      if (pageOverflows(page)) {
        grid.removeChild(el);
        if (!grid.querySelector('.pq')) {
          /* First item is taller than the page — keep it rather than drop it. */
          grid.appendChild(el);
          i++;
          commitPage();
          continue;
        }
        commitPage();
        continue;
      }
      i++;
    }
    if (page) commitPage();
    pages.forEach((pg, p) => {
      const n = pg.querySelector('[data-page-num]');
      const t = pg.querySelector('[data-page-total]');
      if (n) n.textContent = String(p + 1);
      if (t) t.textContent = String(pages.length);
    });
    return pages;
  }

  /* Try candidates until one fits; stop when none of the pool fits the remaining space. */
  function growPage(page, used, nextItem, kind) {
    const colOf = () => shorterCol(page);
    const pool = [];
    const refill = () => {
      let g = 0;
      while (pool.length < 10 && g < 40) {
        g++;
        const pack = nextItem();
        if (pack) pool.push(pack);
        else break;
      }
    };
    for (let step = 0; step < 48; step++) {
      refill();
      if (!pool.length) break;
      let best = -1;
      for (let i = 0; i < pool.length; i++) {
        const el = kind === 'key' ? renderKeyEl(pool[i], used.length) : renderQuestionEl(pool[i], used.length);
        const grid = colOf();
        grid.appendChild(el);
        void page.offsetHeight;
        const ok = !pageOverflows(page);
        grid.removeChild(el);
        if (ok) { best = i; break; }
      }
      if (best < 0) {
        const firstCol = page.querySelector('.print-col, .print-grid');
        if (firstCol && !page.querySelector('.pq') && pool.length) {
          const pack = pool.shift();
          used.push(pack);
          firstCol.appendChild(kind === 'key' ? renderKeyEl(pack, used.length - 1) : renderQuestionEl(pack, used.length - 1));
        }
        break;
      }
      const pack = pool.splice(best, 1)[0];
      used.push(pack);
      colOf().appendChild(kind === 'key' ? renderKeyEl(pack, used.length - 1) : renderQuestionEl(pack, used.length - 1));
    }
  }

  function buildPrint(UNIT, lvl) {
    const root = getPrintRoot();
    const skills = printSkillPool(UNIT, lvl);
    const levelName = lvl === 'advanced' ? 'Advanced' : 'Core';
    const seenQ = {};
    let si = 0;
    const nextItem = () => {
      if (!skills.length) return null;
      for (let n = 0; n < Math.max(skills.length * 8, 16); n++) {
        const s = skills[si++ % skills.length];
        const pack = makePrintItem(s);
        if (!pack || !pack.it) continue;
        const sig = U.strip(pack.it.q || '') + '|' + (pack.it.ch || []).join('|');
        if (seenQ[sig]) continue;
        seenQ[sig] = 1;
        return pack;
      }
      return null;
    };

    const accent = UNIT.color || '#2f80ed';
    const host = makeMeasureHost();
    host.style.setProperty('--print-accent', accent);
    root.style.setProperty('--print-accent', accent);

    const qHead = '<h1>' + UNIT.emoji + ' ' + UNIT.title + ' · ' + levelName + ' Practice</h1><div class="print-head-meta">Grade 5 · US Letter</div>';
    const items = [];
    const practicePages = [];
    const addPracticePage = () => {
      const page = startPage('q', qHead);
      host.appendChild(page);
      void page.offsetHeight;
      const before = items.length;
      growPage(page, items, nextItem, 'q');
      if (page.querySelector('.pq') && items.length > before) {
        practicePages.push(page);
        return true;
      }
      page.remove();
      return false;
    };
    addPracticePage();
    addPracticePage();
    /* Duplex: answer key must start on an odd (front) page, so practice sides stay even. Prefer more questions, not a blank. */
    while (practicePages.length % 2 === 1) {
      if (!addPracticePage()) break;
    }
    if (!items.length) {
      host.remove();
      root.innerHTML = '<section class="print-page"><div class="print-head"><h1>' + UNIT.emoji + ' ' + UNIT.title + '</h1></div><p>No practice items were ready. Close this dialog and try Print pack again.</p></section>';
      openPrintDialog();
      return;
    }
    let qi = 0;
    practicePages.forEach((pg) => {
      pg.querySelectorAll('.pq').forEach((card) => {
        const num = card.querySelector('.pq-num');
        if (num) num.textContent = String(++qi);
      });
    });

    const keyPages = fillPages(host, items, 'key', () =>
      '<h1>Answer Key · ' + UNIT.title + ' · ' + levelName + '</h1><div class="print-head-meta">Keep this page separate</div>'
    );

    const allPages = practicePages.concat(keyPages);
    allPages.forEach((pg, p) => {
      pg.classList.toggle('print-odd', p % 2 === 0);
      pg.classList.toggle('print-even', p % 2 === 1);
      const foot = pg.querySelector('.print-pnum');
      if (foot) foot.textContent = String(p + 1);
    });

    root.innerHTML = '';
    root.style.setProperty('--print-accent', accent);
    allPages.forEach((pg) => root.appendChild(pg));
    host.remove();
    root.dataset.qcount = String(items.length);
    openPrintDialog();
  }


  w.Lab = { mount, renderItem, playLesson, U, optsClass, optsLayout, formatHTML, formatFractionsIn, formatFractionString, isShortAnswer, buildPrint, getPrintRoot };
})(window);
