// Time-on-page milestone toasts.
// Pops a celebratory notification at each threshold while the user lingers.
// Counts from PAGE LOAD (not the site's birth), one toast per threshold per session.

// Each entry: [seconds-since-load, message]
const MILESTONES = [
  [10,    '🎉 Congrats! You have wasted 10 seconds on my website.'],
  [30,    '🏆 30 seconds! impressive commitment to wasting time.'],
  [60,    '🥳 1 whole minute! you could have made a sandwich.'],
  [120,   '💀 2 minutes. ok now this is unhealthy.'],
  [300,   '🤯 5 minutes. i am genuinely concerned for you.'],
  [600,   '🚨 10 minutes. please go outside.'],
  [900,   '📜 15 minutes. you have earned a useless certificate.'],
  [1800,  '🌒 30 minutes. half an hour. of nothing.'],
  [3600,  '👑 1 HOUR. you are the chosen one.'],
  [7200,  '🏛️ 2 hours. legends will speak of you.'],
  [14400, '🪦 4 hours. ok you should really leave now.'],
];

const STORAGE_KEY = 'useless-milestones-fired';

function loadFired() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveFired(set) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore quota / disabled storage */
  }
}

function ensureStack() {
  let stack = document.querySelector('.milestone-stack');
  if (stack) return stack;
  stack = document.createElement('div');
  stack.className = 'milestone-stack';
  stack.setAttribute('aria-live', 'polite');
  stack.setAttribute('aria-atomic', 'false');
  document.body.appendChild(stack);
  return stack;
}

function showToast(message) {
  const stack = ensureStack();
  const toast = document.createElement('div');
  toast.className = 'milestone-toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  stack.appendChild(toast);

  // Slide-in
  requestAnimationFrame(() => toast.classList.add('milestone-toast--in'));

  // Allow click to dismiss early
  toast.addEventListener('click', () => dismiss(toast));

  // Auto-dismiss after 5 seconds
  setTimeout(() => dismiss(toast), 5000);
}

function dismiss(toast) {
  if (!toast || toast.classList.contains('milestone-toast--out')) return;
  toast.classList.remove('milestone-toast--in');
  toast.classList.add('milestone-toast--out');
  setTimeout(() => toast.remove(), 400);
}

export function initMilestones() {
  const startedAt = performance.now();
  const fired = loadFired();

  function check() {
    const elapsed = Math.floor((performance.now() - startedAt) / 1000);
    let updated = false;

    for (const [threshold, message] of MILESTONES) {
      if (elapsed >= threshold && !fired.has(threshold)) {
        fired.add(threshold);
        updated = true;
        showToast(message);
      }
    }

    if (updated) saveFired(fired);

    // Stop checking once every milestone has been triggered
    if (fired.size >= MILESTONES.length) clearInterval(timer);
  }

  // Check every second so 10s/30s fire close to on-time
  const timer = setInterval(check, 1000);
  check();
}
