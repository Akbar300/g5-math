/* UI smoke check for unit pages (CommonJS so NODE_PATH finds a global playwright).
   Serve the repo first:  python3 -m http.server 8765
   Then:                  NODE_PATH=$(npm root -g) node tools/check-ui.cjs [baseUrl]
   Checks every unit, Core and Advanced, at 390 and 1500 px: clicks every lesson chip and every tab,
   fails on page errors or sideways scroll, and counts lesson chips / card labels without a drawn icon. */
const BASE = process.argv[2] || 'http://localhost:8765';
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: CHROME });
  let bad = 0, chipsNoSvg = 0, labelsNoSvg = 0;
  for (const w of [390, 1500]) for (let n = 1; n <= 12; n++) for (const lvl of ['core', 'advanced']) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    await ctx.addInitScript(([n, lvl]) => localStorage.setItem('g5lab_u' + n, JSON.stringify({ xp: 0, lvl, les: {}, sk: {}, tab: 'learn' })), [n, lvl]);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(`${BASE}/units/unit${n}.html`); await p.waitForTimeout(300);
    const nChips = await p.locator('#chips .lchip').count();
    for (let i = 0; i < nChips; i++) { await p.locator('#chips .lchip').nth(i).click(); await p.waitForTimeout(120); }
    const st = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth - innerWidth,
      noSvg: [...document.querySelectorAll('#chips .lchip')].filter(c => !c.querySelector('.lchip-ico svg')).length,
      lbl: [...document.querySelectorAll('.ls-h')].filter(h => !h.querySelector('svg')).length,
      tabs: [...document.querySelectorAll('#tabs button')].map(t => t.dataset.tab) }));
    for (const t of st.tabs) { await p.click(`#tabs button[data-tab="${t}"]`); await p.waitForTimeout(250);
      const ox = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ox > 0) { bad++; console.log('OX', w, n, lvl, t, ox); } }
    chipsNoSvg += st.noSvg; labelsNoSvg += st.lbl;
    if (errs.length || st.ox > 0) { bad++; console.log('FAIL', w, n, lvl, st.ox, errs.slice(0, 2)); }
    await ctx.close();
  }
  console.log('chips without svg', chipsNoSvg, 'labels without svg', labelsNoSvg, bad ? bad + ' failures' : 'ALL OK');
  process.exitCode = bad || chipsNoSvg || labelsNoSvg ? 1 : 0;
  await b.close();
})();
