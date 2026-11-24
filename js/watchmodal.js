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
  function pickVoice() {
    if (!can) return;
    try {
      const vs = synth.getVoices() || [];
      voice = vs.find((v) => /^en[-_]US/i.test(v.lang) && /samantha|google us|aria|jenny|zira|allison|ava/i.test(v.name)) ||
        vs.find((v) => /^en[-_]US/i.test(v.lang)) || vs.find((v) => /^en/i.test(v.lang)) || null;
    } catch (e) { voice = null; }
  }
  if (can) { pickVoice(); try { synth.addEventListener('voiceschanged', pickVoice); } catch (e) {} }

  /* Caption → words a kid hears. "½ × 10 × 12 = 60" → "one half times 10 times 12 equals 60". */
  function speakable(html) {
    let t = String(html || '').replace(/<[^>]+>/g, ' ');
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
        u.lang = 'en-US'; if (voice) u.voice = voice;
        u.rate = (speed || 1) < 1 ? 0.82 : 0.95; u.pitch = 1.05;
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
