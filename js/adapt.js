/* Adapt V2 lessons + G5 generators into Lab UNIT objects. */
(function (w) {
  function toLab(it) {
    if (!it) return null;
    if (it.type === 'paper-mul' || it.type === 'paper-div' || it.type === 'order') return it;
    if (it.type === 'multi') {
      const parts = (it.parts || []).map((p, i) => ({
        type: p.type || (p.ch ? 'mc' : 'num'),
        q: p.q || p.label || ('Part ' + String.fromCharCode(65 + i)),
        a: p.a, acc: p.acc, ch: p.ch, why: p.why, fmt: p.fmt
      }));
      return Object.assign({}, it, { parts: parts });
    }
    if (it.mode) {
      const q = (it.vis ? it.vis : '') + (it.q || '');
      const base = {
        q: q, why: it.why, nocalc: !!it.nocalc, sol: it.std,
        fmt: it.mode === 'mc' ? 'MULTIPLE CHOICE' : it.mode === 'ms' ? 'SELECT ALL' : 'TYPE IN'
      };
      if (it.mode === 'mc') return Object.assign(base, { type: 'mc', ch: it.ch, a: it.ci });
      if (it.mode === 'ms') return Object.assign(base, { type: 'ms', ch: it.ch, a: it.cs });
      const text = String(it.q || '').replace(/,/g, '');
      let m;
      if (it.id === 'ce1_compute' && (m = text.match(/(\d+)\s*×\s*(\d+)\s*=/))) {
        return Object.assign(base, { type: 'paper-mul', a: +m[1], b: +m[2], fmt: 'PAPER' });
      }
      if (it.id === 'ce1_compute' && (m = text.match(/(\d+)\s*÷\s*(\d+)\s*=/))) {
        return Object.assign(base, { type: 'paper-div', a: +m[1], b: +m[2], fmt: 'PAPER' });
      }
      return Object.assign(base, { type: 'num', a: it.acc && it.acc.length ? it.acc : it.a });
    }
    return it;
  }

  function asTryFn(x) {
    return function () {
      const it = typeof x === 'function' ? x() : x;
      return toLab(it) || it;
    };
  }
  function cardify(c) {
    const rawTry = c.tries || c.try || c.tr;
    const tryList = rawTry ? (Array.isArray(rawTry) ? rawTry : [rawTry]).filter(Boolean).map(asTryFn) : undefined;
    return {
      t: c.t,
      html: c.h || c.html || '',
      viz: c.viz,
      steps: c.steps,
      example: c.example,
      trap: c.trap,
      aap: c.aap,
      remember: c.key || undefined,
      try: tryList && tryList.length === 1 ? tryList[0] : undefined,
      tries: tryList && tryList.length ? tryList : undefined
    };
  }

  function skillList(unit, stds, wantEnrich) {
    if (!w.G5 || !G5.skills) return [];
    const out = [], seen = {};
    G5.skills().forEach(function (s) {
      if (seen[s.id]) return;
      const units = Array.isArray(s.unit) ? s.unit : [s.unit];
      const okUnit = unit != null && units.indexOf(unit) >= 0;
      const okStd = stds && stds.indexOf(s.std) >= 0;
      if (!okUnit && !okStd) return;
      if (wantEnrich && !s.enrich) return;
      if (!wantEnrich && s.enrich) return;
      if (unit === 4 && /compare|order|between/.test(s.id)) return;
      if (unit === 7 && /equiv$|model$|same$/.test(s.id) && !/percent|pct|compare|order|between/.test(s.id)) {
        /* Unit 7 keeps compare/order/percent; equivalence stays in Unit 4. */
        if (!/compare|order|between|percent|pct/.test(s.id)) return;
      }
      seen[s.id] = 1;
      out.push({
        id: s.id,
        name: s.name,
        gen: function () { return toLab(G5.make(s.id, wantEnrich ? 'adv' : 'std')); }
      });
    });
    return out;
  }

  function v2Skills(gens, ids) {
    if (!gens) return [];
    const keys = ids && ids.length ? ids : Object.keys(gens);
    return keys.map(function (id) {
      const g = gens[id];
      if (!g || !g.f) return null;
      return { id: id, name: g.name || id, gen: function () { return toLab(g.f('std')); } };
    }).filter(Boolean);
  }

  w.Adapt = {
    toLab: toLab,
    fromV2: function (meta, V2, opts) {
      opts = opts || {};
      const coreLessons = (V2.lessons || []).filter(function (L) { return /L\d/.test(L.id || ''); }).map(function (L) {
        return { id: L.id, name: L.name, icon: L.icon, cards: (L.cards || []).map(cardify) };
      });
      const bridge = V2.bridge || {};
      const advLessons = (bridge.lessons || []).map(function (L) {
        return { id: L.id, name: L.name, icon: L.icon, cards: (L.cards || []).map(cardify) };
      });

      let coreSkills = skillList(opts.gUnit, opts.coreStds, false);
      if (!coreSkills.length) coreSkills = v2Skills(V2.gens, V2.repIds);

      if (meta.num === 3) {
        coreSkills = [
          { id: 'pmul', name: 'Paper multiply', gen: function () {
            const a = U.ri(120, 986), b = U.ri(13, 48);
            return { type: 'paper-mul', fmt: 'PAPER', sol: '5.CE.1', q: 'Multiply <b>' + a + ' × ' + b + '</b> on the paper grid. Estimate first.', a: a, b: b, why: a + ' × ' + b + ' = <b>' + (a * b) + '</b>.' };
          }},
          { id: 'pdiv', name: 'Paper divide', gen: function () {
            const b = U.ri(12, 36), q = U.ri(15, 89), r = U.ri(0, b - 1), a = b * q + r;
            return { type: 'paper-div', fmt: 'PAPER', sol: '5.CE.1', q: 'Divide <b>' + a + ' ÷ ' + b + '</b> on the paper grid.' + (r ? ' A remainder is OK.' : ''), a: a, b: b, why: a + ' ÷ ' + b + ' = <b>' + q + (r ? ' R ' + r : '') + '</b>.' };
          }}
        ].concat(coreSkills);
      }

      let advSkills = v2Skills(bridge.gens, bridge.repIds).map(function (s) {
        return { id: 'adv-' + s.id, name: s.name, gen: function () {
          const g = bridge.gens[s.id.replace(/^adv-/, '')] || (V2.bridge && V2.bridge.gens && V2.bridge.gens[s.id]);
          /* s.id already prefixed; look up original */
          const rawId = s.id;
          const orig = (bridge.gens || {})[rawId] || (bridge.gens || {})[rawId.replace(/^adv-/, '')];
          return toLab((orig && orig.f) ? orig.f('adv') : s.gen());
        }};
      });
      /* redo advSkills cleanly from bridge.gens */
      advSkills = [];
      if (bridge.gens) {
        (bridge.repIds || Object.keys(bridge.gens)).forEach(function (id) {
          const g = bridge.gens[id];
          if (!g || !g.f) return;
          advSkills.push({ id: 'adv-' + id, name: g.name || id, gen: function () { return toLab(g.f('adv')); } });
        });
      }
      skillList(opts.gUnit, opts.coreStds, true).forEach(function (s) { advSkills.push(s); });
      if (w.G5 && opts.gUnit) {
        (G5.byUnit(opts.gUnit) || []).forEach(function (id) {
          const info = (G5.skills() || []).filter(function (x) { return x.id === id; })[0];
          if (info && !info.enrich) {
            advSkills.push({ id: 'h-' + id, name: (info.name || id) + ' · challenge', gen: function () { return toLab(G5.make(id, 'adv')); } });
          }
        });
      }
      if (!advSkills.length) advSkills = coreSkills.slice();

      function pack(level) {
        const items = [];
        if (w.G5) {
          try {
            let raw = [];
            if (opts.coreStds && opts.coreStds.length && level === 'core') {
              raw = G5.solTest({ only: opts.coreStds, scale: 2, adv: 0 }) || [];
            } else if (opts.gUnit != null) {
              raw = G5.unitMix(opts.gUnit, 12, { adv: level === 'advanced' ? 0.85 : 0 }) || [];
            }
            raw.forEach(function (it) { const x = toLab(it); if (x) items.push(x); });
          } catch (e) {}
        }
        const bank = level === 'advanced' ? advSkills : coreSkills;
        let i = 0, guard = 0;
        while (items.length < 12 && bank.length && guard++ < 48) {
          try { const it = bank[i++ % bank.length].gen(); if (it) items.push(it); } catch (e) {}
        }
        if (items.length < 12 && V2.test) {
          V2.test.forEach(function (it) { if (items.length < 12) { const x = toLab(it); if (x) items.push(x); } });
        }
        return items.slice(0, 12);
      }

      const introCore = meta.blurb || 'Short lesson cards, then one try-it. About 5–8 minutes. No rush.';
      let introAdv = bridge.intro || 'Go Further: a deeper look at this unit, with its own lessons and practice.';
      introAdv = String(introAdv).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      w.UNIT = {
        id: meta.id, num: meta.num, emoji: meta.emoji, title: meta.title,
        short: meta.short || meta.title, sol: meta.sol, blurb: meta.blurb,
        dates: meta.dates, color: meta.color,
        core: { intro: introCore, lessons: coreLessons, skills: coreSkills, test: function () { return pack('core'); } },
        advanced: {
          intro: introAdv,
          lessons: advLessons.length ? advLessons : coreLessons.slice(0, 1),
          skills: advSkills,
          test: function () { return pack('advanced'); }
        }
      };
      return w.UNIT;
    }
  };
})(window);
