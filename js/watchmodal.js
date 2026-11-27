/* KVoice: pick the most natural English voice this device has (Edge "Natural", Apple Premium/Enhanced,
   Google US English) and skip Apple's novelty/robot voices. KVoice.apply(u) sets voice, lang, pitch. */
(function (w) {
  var synth = w.speechSynthesis, best = null;
  var BAD = /compact|novelty|eloquence|bad news|bells|boing|bubbles|cellos|zarvox|whisper|trinoids|albert|jester|organ|wobble|good news|superstar|grandma|grandpa|rocko|reed|sandy|shelley|flo\b|eddy|junior|ralph|fred/i;
  function score(v) {
    var n = v.name || '', l = (v.lang || '').replace('_', '-'), s = 0;
    if (!/^en/i.test(l)) return -1;
    if (BAD.test(n)) return 0;
    s += /^en-US/i.test(l) ? 40 : /^en-(GB|AU|CA|IE)/i.test(l) ? 25 : 15;
    if (/natural|neural/i.test(n)) s += 70;          // Edge online voices: the best free ones
    else if (/premium/i.test(n)) s += 60;            // Apple downloaded voices
    else if (/enhanced/i.test(n)) s += 50;
    else if (/google us english/i.test(n)) s += 45;  // Chrome
    else if (/google/i.test(n)) s += 30;
    if (/ava|zoe|samantha|aria|jenny|ana\b|allison|evan|nathan|serena|emma|michelle|guy|andrew|brian/i.test(n)) s += 15;
    if (v['default']) s += 2;
    return s;
  }
  function pick() {
    try {
      var vs = (synth && synth.getVoices()) || [], top = -1;
      best = null;
      for (var i = 0; i < vs.length; i++) { var sc = score(vs[i]); if (sc > top) { top = sc; best = vs[i]; } }
    } catch (e) { best = null; }
    return best;
  }
  if (synth) { pick(); try { synth.addEventListener('voiceschanged', pick); } catch (e) { try { synth.onvoiceschanged = pick; } catch (e2) {} } }
  w.KVoice = {
    pick: pick,
    voice: function () { return best || pick(); },
    apply: function (u) {
      var v = best || pick();
      if (v) u.voice = v;
      u.lang = (v && v.lang) || 'en-US';
      /* Raised pitch makes every voice sound more synthetic; natural voices sound best at 1. */
      u.pitch = 1;
      return u;
    },
    available: function () { return !!(synth && w.SpeechSynthesisUtterance); }
  };
})(window);

/* Watch it pop-out + optional narration (Unit 9). Loaded after js/explain.js; the page opts in with window.EX_POPOUT = true.

   EXSpeech  narration through the browser's speechSynthesis. Off by default, the choice is remembered (localStorage
             'g5lab:voice'). Speaks only after a tap (the player only calls speak() from a click or a step that a click
             started). Prefers an English voice. If speech is missing or fails, it reports "done" so the captions carry on.
   EXModal   centered dialog with a dimmed backdrop on screens 700 px and wider; full screen on phones.
             Close: X, Esc, or a click on the backdrop. Focus stays inside while open and returns to the Watch it button.
             The page behind does not scroll. */
(function (w) {
  'use strict';
  const doc = w.document;
  const KEY = 'g5lab:voice';

  /* ---------- narration ---------- */
  const synth = w.speechSynthesis;
  const can = !!(synth && w.SpeechSynthesisUtterance);
  let on = false, voice = null, guard = 0;
  try { on = localStorage.getItem(KEY) === '1'; } catch (e) {}
  function pickVoice() { voice = w.KVoice ? w.KVoice.pick() : null; }
  if (can) { pickVoice(); try { synth.addEventListener('voiceschanged', pickVoice); } catch (e) {} }

  const DEN = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['fourth', 'fourths'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'],
    7: ['seventh', 'sevenths'], 8: ['eighth', 'eighths'], 9: ['ninth', 'ninths'], 10: ['tenth', 'tenths'], 12: ['twelfth', 'twelfths'],
    16: ['sixteenth', 'sixteenths'], 20: ['twentieth', 'twentieths'], 25: ['twenty-fifth', 'twenty-fifths'], 50: ['fiftieth', 'fiftieths'],
    100: ['hundredth', 'hundredths'], 1000: ['thousandth', 'thousandths'] };
  function fracWords(n, d) {
    const w2 = DEN[+d];
    return w2 ? n + ' ' + (+n === 1 ? w2[0] : w2[1]) : n + ' over ' + d;
  }
  /* Caption → words a kid hears. "½ × 10 × 12 = 60" → "one half times 10 times 12 equals 60". */
  function speakable(html) {
    let t = String(html || '');
    /* Stacked fractions → "3 fourths", mixed numbers → "2 and 1 half". */
    t = t.replace(/<span class="mix">\s*(\d+)\s*<span class="frac"><span class="n">(\d+)<\/span>\s*<span class="d">(\d+)<\/span><\/span>\s*<\/span>/g, (m, a, n, d) => ' ' + a + ' and ' + fracWords(n, d) + ' ');
    t = t.replace(/<span class="frac"><span class="n">(\d+)<\/span>\s*<span class="d">(\d+)<\/span><\/span>/g, (m, n, d) => ' ' + fracWords(n, d) + ' ');
    t = t.replace(/<[^>]+>/g, ' ');
    t = t.replace(/\b(\d+)\s*\/\s*(\d+)\b/g, (m, n, d) => fracWords(n, d));
    t = t.replace(/(\d)\s*%/g, '$1 percent');
    t = t.replace(/(\d+)\.(\d+)/g, (m, a, b) => a + ' point ' + b.split('').join(' '));
    t = t.replace(/½/g, ' one half ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/≈/g, ' about ')
      .replace(/=/g, ' equals ').replace(/[−–]/g, ' minus ').replace(/\+/g, ' plus ').replace(/π/g, ' pie ')
      .replace(/²/g, ' squared ').replace(/³/g, ' cubed ').replace(/→/g, ', ').replace(/[()"“”]/g, ' ')
      .replace(/\b(\d+) by (\d+)\b/g, '$1 by $2');
    return t.replace(/\s+/g, ' ').replace(/\s+([.,!?])/g, '$1').trim();
  }
  const EXSpeech = {
    available: () => can,
    on: () => can && on,
    set(v) { on = !!v; try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {} if (!on) this.cancel(); },
    speak(text, speed, done) {
      const words = speakable(text);
      let fired = false;
      const finish = () => { if (fired) return; fired = true; clearTimeout(guard); done && done(); };
      if (!this.on() || !words) { finish(); return; }
      try {
        synth.cancel();
        const u = new w.SpeechSynthesisUtterance(words);
        u.lang = 'en-US'; if (voice) u.voice = voice; if (w.KVoice) w.KVoice.apply(u);
        u.rate = (speed || 1) < 1 ? 0.82 : 0.95;
        u.onend = finish; u.onerror = finish;
        /* Some browsers never fire onend; never let the lesson stall waiting for it. */
        guard = setTimeout(finish, 2500 + words.split(' ').length * 520 / Math.min(1, speed || 1));
        synth.speak(u);
      } catch (e) { finish(); }
    },
    cancel() { clearTimeout(guard); if (can) { try { synth.cancel(); } catch (e) {} } },
    speakable
  };

  /* ---------- pop-out ---------- */
  let cur = null;
  const wide = () => !w.matchMedia || w.matchMedia('(min-width: 700px)').matches;
  const FOCUSABLE = 'button:not([disabled]),[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  function close() {
    if (!cur) return;
    const c = cur; cur = null;
    try { const p = c.box.querySelector('.ex'); if (p && p.exStop) p.exStop(); } catch (e) {}
    EXSpeech.cancel();
    doc.removeEventListener('keydown', c.onKey, true);
    c.back.remove();
    doc.documentElement.style.overflow = c.htmlOv; doc.body.style.overflow = c.bodyOv;
    if (c.opener && c.opener.isConnected && !c.keepFocus) { try { c.opener.focus({ preventScroll: true }); } catch (e) {} }
  }
  function open(spec, opener, popts) {
    close();
    const back = doc.createElement('div');
    back.className = 'wm-back';
    back.innerHTML = '<div class="wm" role="dialog" aria-modal="true" aria-labelledby="wm-t">' +
      '<div class="wm-head"><h2 id="wm-t" class="wm-title"></h2><button type="button" class="wm-x" aria-label="Close">✕</button></div>' +
      '<div class="wm-body"></div></div>';
    doc.body.appendChild(back);
    const dlg = back.querySelector('.wm'), box = back.querySelector('.wm-body');
    back.querySelector('.wm-title').innerHTML = '🎬 ' + (spec.title || 'Watch it');
    const c = cur = { back, box, opener, htmlOv: doc.documentElement.style.overflow, bodyOv: doc.body.style.overflow };
    doc.documentElement.style.overflow = 'hidden'; doc.body.style.overflow = 'hidden';
    c.onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const f = Array.prototype.filter.call(dlg.querySelectorAll(FOCUSABLE), (x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (doc.activeElement === first || !dlg.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (doc.activeElement === last || !dlg.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
    };
    doc.addEventListener('keydown', c.onKey, true);
    back.addEventListener('mousedown', (e) => { if (e.target === back) c.downOnBack = true; });
    back.addEventListener('click', (e) => { if (e.target === back && c.downOnBack) close(); c.downOnBack = false; });
    back.querySelector('.wm-x').addEventListener('click', close);
    const o = Object.assign({}, popts || {});
    if (o.tryIt) { const t = o.tryIt; o.tryIt = () => { c.keepFocus = true; t(); }; }
    w.EX.player(box, spec, o);
    try { back.querySelector('.wm-x').focus({ preventScroll: true }); } catch (e) {}
    return back;
  }

  w.EXSpeech = EXSpeech;
  w.EXModal = { open, close, wide, isOpen: () => !!cur };
})(window);
