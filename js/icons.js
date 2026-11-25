/* Hub icons: hand-drawn SVGs, one per unit and arena. 64x64, 2-tone.
   currentColor = the unit's ink; var(--ic-soft) = its pale fill. No emoji, so it looks the same on every device. */
window.HUB_ICONS = (function () {
  const S = (body) => `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const soft = 'fill="var(--ic-soft)"';
  return {
    /* Data Detectives: bar graph under a magnifying glass */
    u1: S(`<path d="M8 54h44"/><rect x="11" y="34" width="8" height="20" rx="2" ${soft}/><rect x="23" y="24" width="8" height="30" rx="2" ${soft}/><rect x="35" y="40" width="8" height="14" rx="2" ${soft}/><circle cx="43" cy="20" r="10" fill="var(--card)"/><path d="M50 27l7 7"/><path d="M38 22l4-5 4 3" stroke-width="3"/>`),
    /* Pattern & Number Lab: a growing pattern 1, 3, 5 */
    u2: S(`<g fill="currentColor" stroke="none"><circle cx="12" cy="44" r="4"/><circle cx="26" cy="44" r="4"/><circle cx="26" cy="32" r="4"/><circle cx="26" cy="20" r="4" opacity=".35"/><circle cx="42" cy="44" r="4"/><circle cx="42" cy="32" r="4"/><circle cx="42" cy="20" r="4"/><circle cx="54" cy="44" r="4"/><circle cx="54" cy="32" r="4"/></g><path d="M8 55h50" stroke-width="3" stroke-dasharray="1 7"/>`),
    /* Whole Number Workshop: a 4 by 3 array with a times sign */
    u3: S(`<rect x="7" y="13" width="36" height="28" rx="5" ${soft}/><g fill="currentColor" stroke="none"><circle cx="15" cy="21" r="3"/><circle cx="25" cy="21" r="3"/><circle cx="35" cy="21" r="3"/><circle cx="15" cy="31" r="3"/><circle cx="25" cy="31" r="3"/><circle cx="35" cy="31" r="3"/></g><path d="M7 49h36"/><path d="M47 40l10 10M57 40L47 50"/>`),
    /* Fraction & Decimal Studio: a circle in eighths, 3 shaded, with 0.375 hint */
    u4: S(`<circle cx="30" cy="32" r="22" fill="var(--card)"/><path d="M30 32V10A22 22 0 0 1 52 32Z" fill="currentColor" opacity=".5" stroke="none"/><path d="M30 32L45.6 47.6A22 22 0 0 0 52 32Z" fill="currentColor" opacity=".5" stroke="none"/><path d="M30 10v44M8 32h44M14.4 16.4l31.2 31.2M45.6 16.4L14.4 47.6" stroke-width="2.5"/><circle cx="30" cy="32" r="22"/><circle cx="57" cy="54" r="3" fill="currentColor" stroke="none"/>`),
    /* Decimal Workshop: two digit boxes with a big point between */
    u5: S(`<rect x="6" y="16" width="20" height="30" rx="5" ${soft}/><rect x="38" y="16" width="20" height="30" rx="5" ${soft}/><circle cx="32" cy="42" r="4.5" fill="currentColor" stroke="none"/><path d="M14 24l3-2v18M44 26a4 4 0 1 1 6 3l-6 11h8" stroke-width="3.5"/>`),
    /* Metric Lab: a measuring beaker */
    u6: S(`<path d="M16 10h32M20 10v38a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V10"/><path d="M22 32h20v16a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4Z" ${soft} stroke="none"/><path d="M44 20h-7M44 28h-5M44 36h-7M44 44h-5" stroke-width="3"/>`),
    /* Compare & Percent Studio: two bars with a compare sign and a percent */
    u7: S(`<rect x="6" y="12" width="30" height="10" rx="4" ${soft}/><rect x="6" y="28" width="20" height="10" rx="4" ${soft}/><circle cx="44" cy="44" r="5"/><circle cx="56" cy="56" r="5"/><path d="M58 40L42 60"/><path d="M44 14l10 6-10 6" stroke-width="3.5"/>`),
    /* Fraction Workshop: fraction bars, 1/2 plus 1/3 */
    u8: S(`<rect x="6" y="9" width="52" height="12" rx="3"/><rect x="6" y="26" width="26" height="12" rx="3" ${soft}/><rect x="32" y="26" width="26" height="12" rx="3"/><rect x="6" y="43" width="17.3" height="12" rx="3" ${soft}/><rect x="23.3" y="43" width="17.3" height="12" rx="3"/><rect x="40.6" y="43" width="17.4" height="12" rx="3"/>`),
    /* Shape & Measure Lab: a protractor measuring an angle */
    u9: S(`<path d="M6 46a26 26 0 0 1 52 0Z" ${soft}/><path d="M32 46L50 24"/><path d="M32 46H58"/><path d="M42 46a10 10 0 0 0-3.6-7.7" stroke-width="3"/><path d="M12 38l4 2M20 26l3 3M32 20v4M44 26l-3 3" stroke-width="2.5"/><circle cx="32" cy="46" r="3" fill="currentColor" stroke="none"/>`),
    /* Data & Chance Lab: a die and a spinner */
    u10: S(`<rect x="6" y="20" width="30" height="30" rx="7" ${soft} transform="rotate(-8 21 35)"/><g fill="currentColor" stroke="none" transform="rotate(-8 21 35)"><circle cx="14" cy="28" r="3"/><circle cx="21" cy="35" r="3"/><circle cx="28" cy="42" r="3"/></g><circle cx="47" cy="22" r="11"/><path d="M47 11v22M36 22h22" stroke-width="2.5"/><path d="M47 22l6-7" stroke-width="3.5"/>`),
    /* Coordinate Quest: axes with a plotted point */
    u11: S(`<path d="M10 6v48h48"/><path d="M10 42h44M10 30h44M10 18h44M22 6v48M34 6v48M46 6v48" stroke-width="1.5" opacity=".45"/><path d="M34 54V30H10" stroke-width="2.5" stroke-dasharray="3 4"/><circle cx="34" cy="30" r="6" fill="currentColor" stroke="var(--card)" stroke-width="3"/>`),
    /* Integers Lab (AAP bridge): a minus chip and a plus chip on either side of 0 */
    u12: S(`<path d="M6 50h52"/><path d="M14 46v8M50 46v8" stroke-width="3"/><path d="M32 42v16"/><circle cx="18" cy="24" r="11" ${soft}/><path d="M12 24h12"/><circle cx="46" cy="24" r="11" fill="currentColor" stroke="none"/><path d="M46 18v12M40 24h12" stroke="var(--card)"/>`),
    /* Arenas */
    mul: S(`<path d="M18 18l28 28M46 18L18 46" stroke-width="7"/>`),
    div: S(`<path d="M14 32h36" stroke-width="7"/><circle cx="32" cy="16" r="5" fill="currentColor" stroke="none"/><circle cx="32" cy="48" r="5" fill="currentColor" stroke="none"/>`)
  };
})();

/* ---------- Shared icon set for unit pages (2026-11-25) ----------
   Same rules as the hub icons: 64x64 viewBox, stroke 4, round caps, two tones.
   currentColor = ink (the unit color), var(--ic-soft) = pale fill, var(--card) = punch-out.
   G5I.unit   : the 11 unit icons + arenas (same as HUB_ICONS)
   G5I.ui     : tabs, card labels, buttons
   G5I.concept: one icon per math idea; lessons point at these through G5I.lesson
   G5I.get(name) returns SVG markup or ''. G5I.forLesson(L) returns the lesson's SVG or ''. */
window.G5I = (function () {
  const S = (body, sw) => `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="${sw || 4}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const soft = 'fill="var(--ic-soft)"';
  const ink = 'fill="currentColor" stroke="none"';
  const dot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 3}" ${ink}/>`;

  const ui = {
    back: S(`<path d="M38 14L20 32l18 18"/>`, 6),
    home: S(`<path d="M10 30L32 12l22 18"/><path d="M16 26v24h32V26" ${soft}/><path d="M27 50V38h10v12"/>`),
    learn: S(`<path d="M8 14c8-3 16-3 24 3 8-6 16-6 24-3v36c-8-3-16-3-24 3-8-6-16-6-24-3Z" ${soft}/><path d="M32 17v36"/>`),
    practice: S(`<path d="M50 24A20 20 0 1 0 52 38" /><path d="M52 12v12H40"/>${dot(32, 32, 5)}`),
    test: S(`<path d="M24 8h16M27 8v16L12 50a4 4 0 0 0 3.5 6h33a4 4 0 0 0 3.5-6L37 24V8"/><path d="M18 40h28l5 10a2 2 0 0 1-2 3H15a2 2 0 0 1-2-3Z" ${soft} stroke="none"/>${dot(28, 46, 3)}${dot(37, 48, 2.5)}`),
    game: S(`<rect x="8" y="20" width="48" height="28" rx="14" ${soft}/><path d="M20 30v8M16 34h8"/>${dot(42, 31)}${dot(48, 37)}`),
    print: S(`<path d="M18 22V8h28v14"/><rect x="8" y="22" width="48" height="22" rx="6" ${soft}/><path d="M18 36h28v20H18Z" fill="var(--card)"/><path d="M24 44h16M24 50h10" stroke-width="3"/>`),
    star: S(`<path d="M32 6l7.6 16.4L57 24.6 44 37l3.4 18L32 46.4 16.6 55 20 37 7 24.6l17.4-2.2Z" ${ink}/>`),
    check: S(`<path d="M14 34l12 12 24-26"/>`, 7),
    idea: S(`<path d="M22 40c-6-4-9-10-9-16a19 19 0 0 1 38 0c0 6-3 12-9 16v6H22Z" ${soft}/><path d="M24 52h16M27 58h10"/><path d="M32 46V32l-5-5M32 32l5-5" stroke-width="3"/>`),
    watch: S(`<rect x="6" y="12" width="52" height="40" rx="10" ${soft}/><path d="M26 22v20l17-10Z" ${ink}/>`),
    see: S(`<path d="M4 32c8-13 18-20 28-20s20 7 28 20c-8 13-18 20-28 20S12 45 4 32Z" ${soft}/><circle cx="32" cy="32" r="10" fill="var(--card)"/>${dot(32, 32, 5)}`),
    worked: S(`<path d="M42 8l14 14-28 28H14V36Z" ${soft}/><path d="M36 14l14 14"/><path d="M8 58h48" stroke-width="3"/>`),
    trap: S(`<path d="M32 8L58 54H6Z" ${soft}/><path d="M32 24v14"/>${dot(32, 46, 3.5)}`),
    stretch: S(`<path d="M32 6c10 8 14 20 12 32H20c-2-12 2-24 12-32Z" ${soft}/><circle cx="32" cy="24" r="5" fill="var(--card)"/><path d="M20 38l-8 10 10-2M44 38l8 10-10-2"/><path d="M28 46v8M36 46v8" stroke-width="3"/>`),
    tryit: S(`<circle cx="32" cy="32" r="24" ${soft}/><circle cx="32" cy="32" r="14" fill="var(--card)"/>${dot(32, 32, 6)}`),
    brain: S(`<path d="M32 12c-6-6-18-3-18 6-7 2-9 12-3 17-3 8 4 16 12 14 3 5 9 5 9 0Z" ${soft}/><path d="M32 12c6-6 18-3 18 6 7 2 9 12 3 17 3 8-4 16-12 14-3 5-9 5-9 0Z" ${soft}/><path d="M32 12v37"/>`)
  };

  const c = {
    /* ---- data ---- */
    cycle: S(`<path d="M32 8a24 24 0 0 1 22 15M56 36a24 24 0 0 1-17 19M26 56A24 24 0 0 1 8 38M10 24A24 24 0 0 1 22 10"/><path d="M50 13l4 10-10 1M43 58l-9-4 6-8M10 50l-2-12 10 2M16 6l6 4-6 7" stroke-width="3"/><circle cx="32" cy="32" r="9" ${soft}/>`),
    lineplot: S(`<path d="M6 50h52"/><path d="M14 50v4M26 50v4M38 50v4M50 50v4" stroke-width="3"/><path d="M11 39l6 6M17 39l-6 6M23 39l6 6M29 39l-6 6M23 27l6 6M29 27l-6 6M23 15l6 6M29 15l-6 6M35 39l6 6M41 39l-6 6M35 27l6 6M41 27l-6 6M47 39l6 6M53 39l-6 6" stroke-width="3"/>`),
    stemleaf: S(`<path d="M24 8v48"/><path d="M8 18h48M8 32h48M8 46h48" stroke-width="1.5" opacity=".35"/><rect x="8" y="10" width="12" height="44" rx="3" ${soft} stroke="none"/><g ${ink}><circle cx="32" cy="18" r="3"/><circle cx="41" cy="18" r="3"/><circle cx="32" cy="32" r="3"/><circle cx="41" cy="32" r="3"/><circle cx="50" cy="32" r="3"/><circle cx="32" cy="46" r="3"/></g><path d="M12 18h4M12 32h4M12 46h4" stroke-width="3"/>`),
    balance: S(`<path d="M32 10v42M18 56h28"/><path d="M10 20h44"/><path d="M10 20L4 36h12ZM54 20l-6 16h12Z" ${soft}/>${dot(32, 10, 4)}`),
    bargraph: S(`<path d="M8 8v48h48"/><rect x="14" y="34" width="9" height="22" rx="2" ${soft}/><rect x="28" y="22" width="9" height="34" rx="2" ${soft}/><rect x="42" y="28" width="9" height="28" rx="2" ${soft}/><path d="M14 30L30 14l10 8 14-12" stroke-width="3"/>`),
    pie: S(`<circle cx="32" cy="32" r="24" ${soft}/><path d="M32 32V8a24 24 0 0 1 22.8 31.4Z" ${ink} opacity=".85"/><path d="M32 32L12 45" /><circle cx="32" cy="32" r="24"/>`),
    /* make a circle graph: a bar of counts turning into a pie */
    piemake: S(`<rect x="6" y="40" width="10" height="16" rx="2" ${soft}/><rect x="18" y="30" width="10" height="26" rx="2" ${soft}/><path d="M28 18h8M32 14l4 4-4 4" stroke-width="3"/><circle cx="48" cy="38" r="12" ${soft}/><path d="M48 38V26a12 12 0 0 1 12 12Z" ${ink}/><circle cx="48" cy="38" r="12"/>`),
    mean: S(`<path d="M6 56h52"/><rect x="10" y="26" width="12" height="30" rx="2" ${soft}/><rect x="26" y="38" width="12" height="18" rx="2" ${soft}/><rect x="42" y="32" width="12" height="24" rx="2" ${soft}/><path d="M6 34h52" stroke-dasharray="4 5" stroke-width="3"/>`),
    outlier: S(`<path d="M6 50h52"/><g ${ink}><circle cx="12" cy="40" r="3.5"/><circle cx="20" cy="40" r="3.5"/><circle cx="20" cy="31" r="3.5"/><circle cx="28" cy="40" r="3.5"/><circle cx="28" cy="31" r="3.5"/><circle cx="28" cy="22" r="3.5"/><circle cx="36" cy="40" r="3.5"/></g><circle cx="53" cy="40" r="6" ${soft}/>${dot(53, 40, 3.5)}`),
    /* data changes: a balance beam with a new weight dropping in */
    meanshift: S(`<path d="M6 44h52"/><path d="M32 44l-6 12h12Z" ${soft}/><rect x="10" y="30" width="10" height="14" rx="2" ${soft}/><rect x="24" y="30" width="10" height="14" rx="2" ${soft}/><rect x="44" y="16" width="10" height="10" rx="2" ${ink}/><path d="M49 30v8M45 34l4 4 4-4" stroke-width="3"/>`),
    chance: S(`<path d="M32 10v12M32 22L16 38M32 22l16 16M16 38L10 52M16 38l6 14M48 38l-6 14M48 38l6 14" stroke-width="3"/><circle cx="32" cy="10" r="5" ${soft}/><circle cx="16" cy="38" r="5" ${soft}/><circle cx="48" cy="38" r="5" ${soft}/>${dot(10, 54, 4)}${dot(22, 54, 4)}${dot(42, 54, 4)}${dot(54, 54, 4)}`),
    /* ---- number sense / patterns ---- */
    orderops: S(`<path d="M18 8c-8 8-8 40 0 48M46 8c8 8 8 40 0 48"/><rect x="22" y="24" width="20" height="16" rx="4" ${soft}/><path d="M32 18v-8M28 14h8" stroke-width="3"/><path d="M27 32h10" stroke-width="3"/>`),
    prime: S(`<g ${ink}><circle cx="10" cy="14" r="4"/><circle cx="22" cy="14" r="4"/><circle cx="34" cy="14" r="4"/><circle cx="46" cy="14" r="4"/><circle cx="58" cy="14" r="4"/></g><rect x="6" y="28" width="44" height="30" rx="6" ${soft} stroke="none"/><g ${ink} opacity=".75"><circle cx="16" cy="36" r="3.5"/><circle cx="28" cy="36" r="3.5"/><circle cx="40" cy="36" r="3.5"/><circle cx="16" cy="50" r="3.5"/><circle cx="28" cy="50" r="3.5"/><circle cx="40" cy="50" r="3.5"/></g>`),
    machine: S(`<rect x="18" y="16" width="28" height="32" rx="6" ${soft}/><path d="M4 32h10M50 32h10"/><path d="M10 27l5 5-5 5M56 27l5 5-5 5" stroke-width="3"/><path d="M26 28h12M32 22v12M26 40h12" stroke-width="3"/>`),
    variable: S(`<rect x="6" y="16" width="24" height="32" rx="6" ${soft}/><path d="M12 28c2-3 6-3 8 0l-8 12c2 3 6 3 8 0" stroke-width="0"/><path d="M13 26v16M13 32c2-6 10-6 10 0v10" stroke-width="3.5"/><path d="M36 28h8M36 36h8" stroke-width="3.5"/><path d="M50 22a5 5 0 1 1 6 5c-2 1-3 2-3 5" stroke-width="3.5"/>${dot(53, 42, 2.5)}`),
    venn: S(`<circle cx="24" cy="32" r="16" ${soft}/><circle cx="40" cy="32" r="16"/><path d="M32 18.1a16 16 0 0 1 0 27.8 16 16 0 0 1 0-27.8Z" ${ink} opacity=".6"/>`),
    compare: S(`<path d="M26 16L10 32l16 16"/><path d="M38 16l16 16-16 16" opacity=".35"/><rect x="38" y="44" width="18" height="0" />`, 6),
    jump: S(`<path d="M6 50h52"/><path d="M8 50c2-14 14-14 16 0M24 50c2-14 14-14 16 0M40 50c2-20 16-20 18 0" ${soft}/><path d="M54 40l4 10-10-2" stroke-width="3"/>${dot(8, 50, 4)}${dot(24, 50, 4)}${dot(40, 50, 4)}`),
    /* two-step equation: two steps forward (faded), undone backward (bold) */
    twostep: S(`<path d="M12 12h38M44 7l6 5-6 5" stroke-width="3" opacity=".4"/><rect x="6" y="22" width="22" height="20" rx="5" ${soft}/><rect x="36" y="22" width="22" height="20" rx="5" ${soft}/><path d="M13 28l8 8M21 28l-8 8M47 26v12M41 32h12" stroke-width="3"/><path d="M52 52H12M18 46l-6 6 6 6"/>`),
    /* flip the sign: a > turning into a < around a curved arrow */
    flipsign: S(`<path d="M10 14l14 10-14 10" stroke-width="5"/><path d="M54 30L40 40l14 10" stroke-width="5"/><path d="M30 12c14-4 22 4 22 10M48 18l4 4 4-4" stroke-width="3"/>`),
    /* ---- whole-number operations ---- */
    estimate: S(`<circle cx="32" cy="32" r="24" ${soft}/><path d="M20 28c4-4 8-4 12 0s8 4 12 0M20 38c4-4 8-4 12 0s8 4 12 0" stroke-width="4"/>`),
    multiply: S(`<rect x="6" y="10" width="36" height="28" rx="5" ${soft}/><g ${ink}><circle cx="14" cy="18" r="3"/><circle cx="24" cy="18" r="3"/><circle cx="34" cy="18" r="3"/><circle cx="14" cy="30" r="3"/><circle cx="24" cy="30" r="3"/><circle cx="34" cy="30" r="3"/></g><path d="M44 42l12 12M56 42L44 54" stroke-width="5"/>`),
    divide: S(`<rect x="4" y="30" width="10" height="16" rx="3" ${soft}/><path d="M20 22h38"/><path d="M20 22c5 7 5 26 0 32"/><rect x="26" y="30" width="9" height="16" rx="2" ${soft}/><rect x="38" y="30" width="9" height="16" rx="2" ${soft}/><rect x="50" y="30" width="8" height="16" rx="2" ${soft}/><rect x="38" y="6" width="9" height="12" rx="2" ${ink} opacity=".6"/><rect x="50" y="6" width="8" height="12" rx="2" ${ink} opacity=".6"/>`),
    remainder: S(`<rect x="6" y="10" width="18" height="18" rx="4" ${soft}/><rect x="28" y="10" width="18" height="18" rx="4" ${soft}/><rect x="6" y="34" width="18" height="18" rx="4" ${soft}/><rect x="28" y="34" width="18" height="18" rx="4" ${soft}/>${dot(54, 44, 4.5)}${dot(54, 56, 3)}`),
    divisible: S(`<path d="M34 6L16 36h14l-4 22 22-32H34Z" ${soft}/>`),
    exponent: S(`<rect x="6" y="20" width="32" height="36" rx="6" ${soft}/><path d="M14 30h16M22 30v18" stroke-width="3.5"/><rect x="42" y="6" width="16" height="18" rx="4" fill="var(--card)"/><path d="M46 12a4 4 0 1 1 6 3l-6 6h8" stroke-width="3"/>`),
    bigcalc: S(`<rect x="6" y="6" width="52" height="52" rx="8" ${soft}/><path d="M14 22h36M14 38h36M32 10v44" stroke-width="2.5" opacity=".5"/><path d="M18 14v4M16 16h4M40 14l4 4M44 14l-4 4M17 30h4M17 46h4M40 46h4M42 28v4" stroke-width="3"/>`),
    square: S(`<rect x="8" y="8" width="36" height="36" rx="3" ${soft}/><path d="M20 8v36M32 8v36M8 20h36M8 32h36" stroke-width="2"/><path d="M40 52l4 6 6-18h10" stroke-width="3.5"/>`),
    /* ---- fractions, decimals, percents ---- */
    tenths: S(`<rect x="8" y="10" width="48" height="44" rx="3" fill="var(--card)"/><rect x="8.0" y="10" width="4.8" height="44" fill="currentColor" stroke="none" opacity=".42"/><rect x="12.8" y="10" width="4.8" height="44" fill="currentColor" stroke="none" opacity=".42"/><rect x="17.6" y="10" width="4.8" height="44" fill="currentColor" stroke="none" opacity=".42"/><rect x="22.4" y="10" width="4.8" height="44" fill="currentColor" stroke="none" opacity=".42"/><rect x="27.2" y="10" width="4.8" height="44" fill="currentColor" stroke="none" opacity=".42"/><rect x="32.0" y="10" width="4.8" height="44" fill="currentColor" stroke="none" opacity=".42"/><rect x="36.8" y="10" width="4.8" height="44" fill="currentColor" stroke="none" opacity=".42"/><path d="M12.8 10v44 M17.6 10v44 M22.4 10v44 M27.2 10v44 M32.0 10v44 M36.8 10v44 M41.6 10v44 M46.4 10v44 M51.2 10v44" stroke-width="1.4" opacity=".55"/><rect x="8" y="10" width="48" height="44" rx="3"/>`),
    hundred: S(`<rect x="6" y="20" width="52" height="24" rx="4" fill="var(--card)"/><rect x="6" y="20" width="39" height="24" rx="4" fill="currentColor" stroke="none" opacity=".42"/><path d="M19 20v24M32 20v24M45 20v24" stroke-width="2.5"/><rect x="6" y="20" width="52" height="24" rx="4"/><path d="M6 52h39" stroke-width="3"/><path d="M6 49v6M45 49v6" stroke-width="3"/>`),
    eighths: '', /* filled below from the unit 4 icon */
    eighthsthirds: S(`<circle cx="17" cy="32" r="14" fill="var(--card)"/><path d="M17 32V18A14 14 0 0 1 26.9 41.9Z" fill="currentColor" stroke="none" opacity=".6"/><path d="M17 32 L17.0 18.0 M17 32 L26.9 22.1 M17 32 L31.0 32.0 M17 32 L26.9 41.9 M17 32 L17.0 46.0 M17 32 L7.1 41.9 M17 32 L3.0 32.0 M17 32 L7.1 22.1" stroke-width="2"/><circle cx="17" cy="32" r="14" stroke-width="3.5"/><circle cx="47" cy="32" r="14" fill="var(--card)"/><path d="M47 32V18A14 14 0 0 1 59.1 39.0Z" fill="currentColor" stroke="none" opacity=".6"/><path d="M47 32V18M47 32L59.1 39.0M47 32L34.9 39.0" stroke-width="2.5"/><circle cx="47" cy="32" r="14" stroke-width="3.5"/>`),
    samename: S(`<rect x="4" y="12" width="40" height="14" rx="3" fill="var(--card)"/><rect x="4" y="12" width="20" height="14" rx="3" fill="currentColor" stroke="none" opacity=".42"/><path d="M24 12v14" stroke-width="2.5"/><rect x="4" y="12" width="40" height="14" rx="3"/><rect x="4" y="38" width="40" height="14" rx="3" fill="var(--card)"/><rect x="4" y="38" width="20" height="14" fill="currentColor" stroke="none" opacity=".42"/><path d="M12 38v14M20 38v14M28 38v14M36 38v14" stroke-width="2"/><rect x="4" y="38" width="40" height="14" rx="3"/><path d="M50 27h10M50 37h10" stroke-width="4"/>`),
    ratio: S(`<g ${ink}><circle cx="10" cy="20" r="5"/><circle cx="22" cy="20" r="5"/><circle cx="10" cy="34" r="5"/><circle cx="22" cy="34" r="5"/></g><rect x="40" y="15" width="10" height="10" rx="2" ${soft}/><rect x="40" y="29" width="10" height="10" rx="2" ${soft}/>${dot(32, 23, 2.5)}${dot(32, 33, 2.5)}<path d="M8 50h48" stroke-width="3" stroke-dasharray="1 6"/>`),
    ratiotable: S(`<rect x="6" y="10" width="52" height="34" rx="5" ${soft}/><path d="M6 27h52M23 10v34M40 10v34" stroke-width="2.5"/><path d="M14 50c8 8 18 8 26 0" stroke-width="3"/><path d="M38 46l3 5-6 1" stroke-width="3"/>`),
    /* graph of a rate: points on a straight line through the origin */
    rategraph: S(`<path d="M8 8v48h48"/><path d="M8 56L54 12" stroke-width="3"/>${dot(20, 44.5, 4.5)}${dot(31, 34, 4.5)}${dot(42, 23.5, 4.5)}`),
    /* y = mx: two lines from the origin, the steeper one bold */
    slope: S(`<path d="M8 8v48h48"/><path d="M8 56L56 32" stroke-width="3" opacity=".45"/><path d="M8 56L34 8" stroke-width="4.5"/><path d="M20 34h6v-11" stroke-width="2.5" stroke-dasharray="3 3"/>`),
    percent: S(`<circle cx="18" cy="18" r="9" ${soft}/><circle cx="46" cy="46" r="9" ${soft}/><path d="M50 10L14 54" stroke-width="5"/>`),
    percentof: S(`<rect x="4" y="38" width="56" height="16" rx="5" fill="var(--card)"/><rect x="4" y="38" width="21" height="16" rx="5" ${soft} stroke="none"/><rect x="4" y="38" width="56" height="16" rx="5"/><path d="M25 38v16" stroke-width="3"/><circle cx="17" cy="12" r="5"/><circle cx="35" cy="26" r="5"/><path d="M38 8L14 30" stroke-width="3.5"/>`),
    convert: S(`<path d="M32 8L56 50H8Z" ${soft}/><circle cx="32" cy="8" r="6" fill="var(--card)"/><circle cx="56" cy="50" r="6" fill="var(--card)"/><circle cx="8" cy="50" r="6" fill="var(--card)"/>${dot(32, 8, 2.5)}${dot(56, 50, 2.5)}${dot(8, 50, 2.5)}`),
    /* ---- decimals ---- */
    round: S(`<path d="M6 46h52"/><path d="M10 40v12M54 40v12M32 42v8" stroke-width="3"/><path d="M40 34c0-12 14-14 14-2" ${soft}/><path d="M50 28l4 6 4-6" stroke-width="3"/>${dot(40, 46, 4)}`),
    lineup: S(`<rect x="10" y="6" width="44" height="52" rx="6" ${soft}/><path d="M32 6v52" stroke-dasharray="3 5" stroke-width="2.5"/>${dot(32, 20, 3.5)}${dot(32, 36, 3.5)}<path d="M16 46h32" stroke-width="3"/><path d="M18 20h8M38 20h8M18 36h8M38 36h8" stroke-width="3"/>`),
    areagrid: S(`<rect x="8" y="8" width="48" height="48" rx="4" fill="var(--card)"/><rect x="8" y="8" width="28.8" height="48" ${soft} stroke="none"/><rect x="8" y="27.2" width="48" height="28.8" ${soft} stroke="none" opacity=".6"/><rect x="8" y="27.2" width="28.8" height="28.8" ${ink} opacity=".55"/><rect x="8" y="8" width="48" height="48" rx="4"/>`),
    divwhole: S(`<rect x="4" y="30" width="10" height="16" rx="3" ${soft}/><path d="M20 22h38"/><path d="M20 22c5 7 5 26 0 32"/><rect x="26" y="30" width="10" height="16" rx="2" ${soft}/><rect x="46" y="30" width="12" height="16" rx="2" ${soft}/>${dot(41, 44, 3)}<rect x="30" y="6" width="9" height="12" rx="2" ${ink} opacity=".6"/>${dot(44, 16, 3)}<rect x="49" y="6" width="9" height="12" rx="2" ${ink} opacity=".6"/>`),
    tenthtiles: S(`<rect x="6" y="14" width="10" height="36" rx="3" ${soft}/><rect x="20" y="14" width="10" height="36" rx="3" ${soft}/><rect x="34" y="14" width="10" height="36" rx="3" ${soft}/><rect x="48" y="14" width="10" height="36" rx="3" stroke-dasharray="3 4"/>`),
    negative: S(`<path d="M26 10a6 6 0 0 1 12 0v30a11 11 0 1 1-12 0Z" fill="var(--card)"/><path d="M29 36h6v8h-6Z" ${ink} opacity=".7"/><circle cx="32" cy="48" r="6" ${ink} opacity=".7"/><path d="M26 10a6 6 0 0 1 12 0v30a11 11 0 1 1-12 0Z"/><path d="M42 24h14" stroke-width="3"/><path d="M8 30h12" stroke-width="5"/><path d="M42 14h8M42 34h8" stroke-width="2.5"/>`),
    /* ---- integers (Unit 12) ---- */
    intorder: S(`<path d="M6 44h52"/><path d="M32 37v14"/><path d="M14 40v8M50 40v8" stroke-width="2.5"/>${dot(12, 44, 4)}${dot(22, 44, 4)}${dot(46, 44, 4)}<path d="M12 22h38M44 16l6 6-6 6" stroke-width="3.5"/>`),
    zeropair: S(`<rect x="7" y="6" width="26" height="52" rx="13" stroke-dasharray="4 5" stroke-width="2.5"/><circle cx="20" cy="20" r="9" ${ink}/><circle cx="44" cy="20" r="9" ${ink}/><path d="M20 15v10M15 20h10M44 15v10M39 20h10" stroke="var(--card)" stroke-width="3"/><circle cx="20" cy="44" r="9" ${soft}/><path d="M15 44h10" stroke-width="3"/>`),
    addopp: S(`<rect x="4" y="18" width="22" height="28" rx="6" ${soft}/><path d="M10 32h10"/><path d="M30 32h10M35 26l6 6-6 6" stroke-width="3"/><rect x="40" y="18" width="20" height="28" rx="6" ${ink}/><path d="M50 26v12M44 32h12" stroke="var(--card)"/>`),
    intmul: S(`<circle cx="15" cy="20" r="10" ${soft}/><path d="M10 20h10" stroke-width="3"/><circle cx="49" cy="20" r="10" ${soft}/><path d="M44 20h10" stroke-width="3"/><path d="M29 16l6 8M35 16l-6 8" stroke-width="3"/><rect x="16" y="38" width="32" height="20" rx="10" ${ink}/><path d="M32 42v12M26 48h12" stroke="var(--card)" stroke-width="3.5"/>`),
    elevation: S(`<path d="M6 36h52" stroke-width="3" opacity=".55"/><path d="M8 36L22 12l14 24Z" ${soft}/><path d="M48 42v14M42 50l6 6 6-6" stroke-width="3.5"/>${dot(48, 42, 4)}`),
    /* ---- measurement ---- */
    ladder: S(`<path d="M16 6v52M48 6v52"/><path d="M16 14h32M16 28h32M16 42h32M16 56h32" stroke-width="3"/><rect x="18" y="16" width="28" height="10" ${soft} stroke="none"/><path d="M56 22l4-6M56 22l-4-6M56 22V8" stroke-width="2.5"/>`),
    ruler: S(`<rect x="4" y="22" width="56" height="20" rx="4" ${soft}/><path d="M12 22v8M20 22v5M28 22v8M36 22v5M44 22v8M52 22v5" stroke-width="2.5"/>`),
    steps: S(`<path d="M6 56h14V44h14V32h14V20h10" ${soft}/><path d="M48 20V6l10 4-10 4"/>${dot(13, 50, 3)}`),
    rate: S(`<path d="M8 44a24 24 0 0 1 48 0" ${soft}/><path d="M32 44L46 24" /><path d="M14 44h4M46 44h4M32 22v4" stroke-width="3"/>${dot(32, 44, 4)}`),
    /* better buy: a price tag with a check */
    betterbuy: S(`<path d="M8 32L30 10h22v22L30 54Z" ${soft}/><circle cx="43" cy="19" r="4" fill="var(--card)"/><path d="M20 33l7 7 13-13" stroke-width="5"/>`),
    /* ---- fractions ---- */
    unlike: S(`<rect x="6" y="12" width="52" height="16" rx="3"/><rect x="6" y="12" width="26" height="16" rx="3" ${soft}/><rect x="6" y="36" width="52" height="16" rx="3"/><rect x="6" y="36" width="17.3" height="16" rx="3" ${soft}/><path d="M40.6 36v16" stroke-width="2.5"/><path d="M32 4v56" stroke-dasharray="2 5" stroke-width="2"/>`),
    mixed: S(`<circle cx="18" cy="32" r="13" ${ink} opacity=".8"/><circle cx="46" cy="32" r="13" ${soft}/><path d="M46 32V19A13 13 0 0 1 59 32Z" ${ink} opacity=".8"/><path d="M46 19v26M33 32h26" stroke-width="2"/><circle cx="46" cy="32" r="13"/>`),
    wholefrac: S(`<path d="M6 18l8 8M14 18l-8 8" stroke-width="3.5"/><rect x="20" y="14" width="38" height="14" rx="3"/><rect x="20" y="14" width="9.5" height="14" rx="3" ${soft}/><rect x="6" y="38" width="52" height="14" rx="3"/><rect x="6" y="38" width="39" height="14" rx="3" ${soft}/><path d="M19 38v14M32 38v14" stroke-width="2"/>`),
    fracops: S(`<rect x="6" y="6" width="52" height="52" rx="6" fill="var(--card)"/><rect x="6" y="6" width="34.7" height="52" ${soft} stroke="none"/><rect x="6" y="6" width="52" height="26" ${soft} stroke="none" opacity=".6"/><rect x="6" y="6" width="34.7" height="26" ${ink} opacity=".55"/><path d="M23.3 6v52M40.7 6v52M6 32h52" stroke-width="2"/><rect x="6" y="6" width="52" height="52" rx="6"/>`),
    /* mixed numbers times: one whole circle and a half, times */
    mixmul: S(`<circle cx="14" cy="32" r="10" ${ink}/><path d="M36 22a10 10 0 0 1 0 20Z" ${ink}/><circle cx="36" cy="32" r="10"/><path d="M50 26l8 12M58 26l-8 12" stroke-width="4"/>`),
    /* bigger or smaller: one bar grows, one shrinks, from the same start */
    bigsmall: S(`<path d="M4 36h56" stroke-dasharray="4 5" stroke-width="2.5"/><rect x="8" y="8" width="20" height="48" rx="3" ${soft}/><path d="M18 30V16M12 22l6-6 6 6" stroke-width="3.5"/><rect x="36" y="44" width="20" height="12" rx="3" ${ink}/><path d="M46 18v16M40 28l6 6 6-6" stroke-width="3.5"/>`),
    /* signed fractions: a number line with a half step left of 0 and a half step right */
    signedfrac: S(`<path d="M6 40h52"/><path d="M32 32v16" stroke-width="4"/><path d="M14 36v8M50 36v8" stroke-width="2.5"/>${dot(23, 40, 5)}<path d="M38 22h12M44 16v12" stroke-width="3.5"/><path d="M14 22h12" stroke-width="3.5"/>`),
    /* ---- geometry ---- */
    angle: S(`<path d="M10 52h46M10 52L44 14"/><path d="M28 52a18 18 0 0 0-5.6-13" ${soft} stroke-width="3"/>${dot(10, 52, 4)}`),
    perimarea: S(`<rect x="8" y="14" width="48" height="36" rx="2" ${soft} stroke-dasharray="0"/><path d="M20 14v36M32 14v36M44 14v36M8 26h48M8 38h48" stroke-width="1.5" opacity=".5"/><rect x="8" y="14" width="48" height="36" rx="2" stroke-width="5"/>`),
    triangle: S(`<path d="M24 12H58L40 52" stroke-dasharray="4 5" stroke-width="3" opacity=".55"/><path d="M6 52L24 12L40 52Z" ${soft}/><path d="M24 12v40" stroke-dasharray="3 4" stroke-width="2.5"/><path d="M24 46h6v6" stroke-width="2.5"/>`),
    circle: S(`<circle cx="32" cy="32" r="24" ${soft}/><path d="M32 32h24"/>${dot(32, 32, 4)}`),
    /* cylinder: base circle times height */
    cylinder: S(`<path d="M12 16v32a20 7 0 0 0 40 0V16" ${soft}/><ellipse cx="32" cy="16" rx="20" ry="7" ${soft}/><path d="M32 16h20" stroke-width="3"/>${dot(32, 16, 2.5)}`),
    volume: S(`<path d="M10 22L32 12l22 10v24L32 56 10 46Z" ${soft}/><path d="M10 22l22 10 22-10M32 32v24"/><path d="M21 17l22 10M21 27v24M43 27v24M10 34l22 10 22-10" stroke-width="1.8" opacity=".55"/>`),
    /* ---- coordinates ---- */
    plot: '', /* filled below from the unit 11 icon */
    story: S(`<path d="M8 8v48h48"/><path d="M8 50l12-16h12l8-18 14 6" ${soft} stroke="none" opacity="0"/><path d="M8 50l12-16h12l8-18 14 6"/>${dot(20, 34)}${dot(32, 34)}${dot(40, 16)}`),
    /* distance across an axis: two dots on a line through the y-axis */
    axisdist: S(`<path d="M32 6v52" stroke-width="3" opacity=".5"/><path d="M6 44h52" stroke-width="3" opacity=".5"/><path d="M12 24h40" stroke-width="5"/>${dot(12, 24, 6)}${dot(52, 24, 6)}<path d="M12 32v6M32 32v6M52 32v6" stroke-width="2.5"/>`),
    /* polygon in four quadrants: a rectangle across both axes */
    quadpoly: S(`<path d="M32 4v56M4 32h56" stroke-width="3" opacity=".5"/><rect x="12" y="16" width="40" height="28" rx="2" ${soft}/>${dot(12, 16, 4)}${dot(52, 16, 4)}${dot(52, 44, 4)}${dot(12, 44, 4)}`),
    /* reflection: a point and its mirror image across a dashed axis */
    reflect: S(`<path d="M32 6v52" stroke-dasharray="5 5" stroke-width="3"/><path d="M8 40L22 18v22Z" ${ink}/><path d="M56 40L42 18v22Z" ${soft}/><path d="M24 50h16M36 46l4 4-4 4M28 46l-4 4 4 4" stroke-width="2.5"/>`),
    /* symmetry: a regular hexagon with a dashed fold line */
    symmetry: S(`<path d="M32 8L52.8 20v24L32 56 11.2 44V20Z" ${soft}/><path d="M32 4v56" stroke-dasharray="5 5" stroke-width="3"/>`),
    /* dilation: a small square and its scaled copy from a corner point */
    dilate: S(`<rect x="8" y="34" width="14" height="14" rx="2" ${ink}/><rect x="8" y="14" width="40" height="34" rx="3" ${soft}/><rect x="8" y="34" width="14" height="14" rx="2" ${ink}/><path d="M22 34L48 14" stroke-dasharray="4 4" stroke-width="2.5"/>${dot(8, 48, 4)}`),
    quadrants: S(`<path d="M32 6v52M6 32h52"/><rect x="34" y="8" width="22" height="22" rx="3" ${soft} stroke="none"/><rect x="8" y="34" width="22" height="22" rx="3" ${soft} stroke="none" opacity=".6"/>${dot(45, 19, 4)}${dot(19, 45, 4)}<path d="M15 15l8 8M23 15l-8 8M41 41l8 8M49 41l-8 8" stroke-width="2.5" opacity=".6"/>`)
  };
  const H = window.HUB_ICONS || {};
  c.eighths = H.u4; c.plot = H.u11; c.dataview = H.u1;

  /* Lesson id -> concept. Lessons with the same id in Core and Advanced share one icon. */
  const lesson = {
    u1c1: 'cycle', u1c2: 'lineplot', u1c3: 'stemleaf', u1c4: 'balance', u1c5: 'bargraph', u1a1: 'pie',
    u2L1: 'orderops', u2L2: 'prime', u2L3: 'machine', u2L4: 'variable', u2B1: 'venn', u2B2: 'compare', u2B3: 'jump', u2B4: 'twostep', u2B5: 'flipsign',
    u3L1: 'estimate', u3L2: 'multiply', u3L3: 'divide', u3L4: 'remainder', u3L5: 'divisible', u3L6: 'exponent',
    u3B1: 'bigcalc', u3B2: 'square', u3B3: 'exponent',
    u4c1: 'tenths', u4c2: 'hundred', u4c3: 'eighthsthirds', u4c4: 'samename', u4c5: 'ratio', u4c6: 'percent',
    u4a1: 'ratio', u4a2: 'ratiotable', u4a5: 'betterbuy', u4a6: 'rategraph', u4a7: 'slope', u4a3: 'percent', u4a4: 'percentof',
    u5L0: 'round', u5L1: 'lineup', u5L2: 'estimate', u5L3: 'areagrid', u5L4: 'divwhole', u5L5: 'tenthtiles',
    u6L1: 'ladder', u6L2: 'ruler', u6L3: 'steps', u6B1: 'rate',
    u7L1: 'percent', u7L2: 'convert', u7L3: 'compare', u7B1: 'pie', u7B2: 'piemake',
    u8L1: 'unlike', u8L2: 'mixed', u8L3: 'wholefrac', u8B1: 'fracops', u8B2: 'mixmul', u8B3: 'bigsmall', u8B4: 'signedfrac',
    u9L1: 'angle', u9L4: 'perimarea', u9L2: 'triangle', u9L5: 'circle', u9L3: 'volume', u9G1: 'cylinder',
    u10L1: 'mean', u10L2: 'lineplot', u10L3: 'chance', u10B1: 'outlier', u10B2: 'meanshift',
    u11L1: 'plot', u11L2: 'story', u11B1: 'quadrants', u11B2: 'axisdist', u11B3: 'quadpoly', u11B4: 'reflect', u11B5: 'symmetry', u11B6: 'dilate',
    u12L1: 'negative', u12L2: 'intorder', u12L3: 'zeropair', u12L4: 'addopp',
    u12B1: 'intmul', u12B2: 'orderops', u12B3: 'elevation', u12B4: 'exponent'
  };

  const unit = Object.assign({}, H);
  const get = (n) => ui[n] || c[n] || unit[n] || '';
  return {
    S, ui, concept: c, unit, lesson, get,
    forLesson: (L) => (L && (c[L.iconKey] || c[lesson[L.id]])) || ''
  };
})();
