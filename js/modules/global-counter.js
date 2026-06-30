// Per-browser visit counter using localStorage.
// (To make this global across all users, swap in a fetch() to a
// Cloudflare Pages Function backed by KV. See README.)
const KEY = 'useless-visits';

export function initGlobalCounter() {
  const el = document.querySelector('[data-counter="visits"]');
  if (!el) return;

  let n = parseInt(localStorage.getItem(KEY) || '0', 10);
  if (Number.isNaN(n)) n = 0;
  n += 1;
  localStorage.setItem(KEY, String(n));

  // Slot machine count-up animation
  const duration = 800;
  const start = performance.now();
  const from = Math.max(0, n - 1);
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(from + (n - from) * eased).toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = n.toLocaleString();
  }
  requestAnimationFrame(tick);
}
