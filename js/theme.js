/* Shared light/dark theme: remembered, else follows prefers-color-scheme. */
(function (w) {
  const KEY = 'g5lab_theme';

  function systemTheme() {
    return (w.matchMedia && w.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function storedTheme() {
    try {
      const t = localStorage.getItem(KEY);
      if (t === 'light' || t === 'dark') return t;
    } catch (e) {}
    return null;
  }

  function current() {
    return document.documentElement.getAttribute('data-theme') || storedTheme() || systemTheme();
  }

  function apply(t) {
    if (t !== 'light' && t !== 'dark') t = systemTheme();
    document.documentElement.setAttribute('data-theme', t);
    if (document.body) document.body.setAttribute('data-theme', t);
    sync();
  }

  function set(t) {
    try { localStorage.setItem(KEY, t); } catch (e) {}
    apply(t);
  }

  function toggle() {
    set(current() === 'dark' ? 'light' : 'dark');
  }

  function sync() {
    const dark = current() === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', dark ? 'true' : 'false');
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      b.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
      b.innerHTML = dark
        ? '<span class="theme-ico" aria-hidden="true">☀</span><span class="theme-lbl">Light</span>'
        : '<span class="theme-ico" aria-hidden="true">☾</span><span class="theme-lbl">Dark</span>';
    });
  }

  apply(storedTheme() || systemTheme());

  if (w.matchMedia) {
    const mq = w.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (!storedTheme()) apply(systemTheme()); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (!b) return;
    e.preventDefault();
    toggle();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync);
  } else {
    sync();
  }

  w.G5Theme = { toggle, set, current, sync, apply };
})(window);
