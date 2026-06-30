// Easter egg: visit between 04:20 and 04:21 (local time) → permanent VOID MODE.
// Once unlocked it's saved in localStorage and the site stays pitch-black
// forever (until you clear site data, or type the secret escape: "exit").
const STORAGE_KEY = 'useless-void-mode';
const VOID_HOUR = 4;
const VOID_MINUTE = 20;
const ESCAPE_WORD = 'exit';

function applyVoid() {
  document.documentElement.classList.add('void-mode');
}
function removeVoid() {
  document.documentElement.classList.remove('void-mode');
}

function showToast(text) {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast--stop';
  toast.innerHTML = '<span class="toast__tag">●</span><span class="toast__msg"></span>';
  toast.querySelector('.toast__msg').textContent = text;
  stack.appendChild(toast);
  setTimeout(() => toast.classList.add('toast--leaving'), 4000);
  setTimeout(() => toast.remove(), 4600);
}

export function initVoidMode() {
  // Re-apply if already unlocked in a previous session
  const alreadyOn = localStorage.getItem(STORAGE_KEY) === '1';
  if (alreadyOn) applyVoid();

  // Check the time NOW. If we're inside the magic minute, unlock void mode.
  const now = new Date();
  if (!alreadyOn && now.getHours() === VOID_HOUR && now.getMinutes() === VOID_MINUTE) {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* ignore */ }
    applyVoid();
    // Tiny delay so the toast stack exists / page is settled
    setTimeout(() => showToast('🌑 04:20 — welcome to the void.'), 800);
  }

  // Secret escape: type "exit" while in void mode to turn it off.
  let buf = '';
  document.addEventListener('keydown', (e) => {
    if (!document.documentElement.classList.contains('void-mode')) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-ESCAPE_WORD.length);
    if (buf === ESCAPE_WORD) {
      buf = '';
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
      removeVoid();
      showToast('☀ light restored.');
    }
  });
}
