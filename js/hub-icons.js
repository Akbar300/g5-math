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
    u4: S(`<circle cx="30" cy="32" r="22" fill="var(--card)"/><path d="M30 32V10A22 22 0 0 1 52 32Z" fill="currentColor" opacity=".35" stroke="none"/><path d="M30 32L45.6 47.6A22 22 0 0 0 52 32Z" fill="currentColor" opacity=".35" stroke="none"/><path d="M30 10v44M8 32h44M14.4 16.4l31.2 31.2M45.6 16.4L14.4 47.6" stroke-width="2.5"/><circle cx="30" cy="32" r="22"/><circle cx="57" cy="54" r="3" fill="currentColor" stroke="none"/>`),
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
    /* Arenas */
    mul: S(`<path d="M18 18l28 28M46 18L18 46" stroke-width="7"/>`),
    div: S(`<path d="M14 32h36" stroke-width="7"/><circle cx="32" cy="16" r="5" fill="currentColor" stroke="none"/><circle cx="32" cy="48" r="5" fill="currentColor" stroke="none"/>`)
  };
})();
