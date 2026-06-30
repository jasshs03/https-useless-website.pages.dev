// Boot sequence shown ONLY on the landing page, once per session.
// Plays fake terminal output, then fades out.
const KEY = 'useless-booted';

const LINES = [
  { t: 60,  text: 'BIOS v1.0.4 ... OK' },
  { t: 220, text: 'mounting /dev/potato ... OK' },
  { t: 380, text: 'loading useless.exe ...' },
  { t: 540, text: 'allocating 0 bytes of purpose ...' },
  { t: 700, text: 'spawning cats in background ...' },
  { t: 860, text: 'connecting to /dev/null ... OK' },
  { t: 1020, text: 'ready_' },
];

export function initBootSequence() {
  // Only on landing page (presence of .menu-grid)
  const isLanding = !!document.querySelector('.menu-grid');
  if (!isLanding) return;
  if (sessionStorage.getItem(KEY)) return;
  sessionStorage.setItem(KEY, '1');

  const overlay = document.createElement('div');
  overlay.className = 'boot';
  overlay.innerHTML = `
    <pre class="boot__log" aria-hidden="true"></pre>
    <button class="boot__skip" type="button">[skip]</button>
  `;
  document.body.appendChild(overlay);

  const log = overlay.querySelector('.boot__log');
  const skipBtn = overlay.querySelector('.boot__skip');
  const timers = [];

  LINES.forEach(({ t, text }) => {
    timers.push(setTimeout(() => {
      log.textContent += '> ' + text + '\n';
      log.scrollTop = log.scrollHeight;
    }, t));
  });

  function finish() {
    timers.forEach(clearTimeout);
    overlay.classList.add('boot--leaving');
    setTimeout(() => overlay.remove(), 500);
  }

  // Auto-finish after the last line, or on skip/key
  timers.push(setTimeout(finish, 1500));
  skipBtn.addEventListener('click', finish);
  document.addEventListener('keydown', finish, { once: true });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) finish();
  });
}
