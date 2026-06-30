// Fake "locating you" loading screen for the visitors page.
// Pretends to obtain your IP, check system config, ping a satellite, etc.
// Then reveals it was a PRANK. Just like the visitor map itself.
//
// Runs once per browser session (sessionStorage) so the prank doesn't get
// stale on every refresh.

const SESSION_KEY = 'useless-locator-seen';

const STEPS = [
  { label: 'Obtaining your IP address',  ms: 900 },
  { label: 'Checking system config',     ms: 750 },
  { label: 'Pinging satellite #7',       ms: 850 },
  { label: 'Cross-referencing potatoes', ms: 650 },
  { label: 'Locating you on the map',    ms: 950 },
];

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function buildOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'fake-locator';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.innerHTML = [
    '<div class="fake-locator__box">',
      '<div class="fake-locator__title">',
        '<span class="fake-locator__brand">[locator.exe]</span>',
        '<span class="fake-locator__spinner" aria-hidden="true"></span>',
      '</div>',
      '<ul class="fake-locator__steps"></ul>',
      '<div class="fake-locator__bar" aria-hidden="true">',
        '<div class="fake-locator__bar-fill"></div>',
      '</div>',
      '<p class="fake-locator__hint">do not close this window. (you can, actually.)</p>',
      '<div class="fake-locator__reveal" hidden>',
        '<h2 class="fake-locator__reveal-title">PRANK!</h2>',
        '<p class="fake-locator__reveal-msg">walang ganon.<br>you\'ve just wasted another few seconds of your life.</p>',
        '<button class="fake-locator__close" type="button">see the (fake) map →</button>',
      '</div>',
    '</div>',
  ].join('');
  return overlay;
}

function addStep(listEl, text) {
  const li = document.createElement('li');
  li.className = 'fake-locator__step';
  li.innerHTML =
    '<span class="fake-locator__step-icon" aria-hidden="true"></span>' +
    '<span class="fake-locator__step-text">' + escapeHTML(text) + '</span>';
  listEl.appendChild(li);
  return li;
}

function markStepDone(li, ok = true) {
  li.classList.add(ok ? 'fake-locator__step--done' : 'fake-locator__step--fail');
}

function runLocator(overlay, onFinished) {
  const listEl = overlay.querySelector('.fake-locator__steps');
  const barFill = overlay.querySelector('.fake-locator__bar-fill');
  const reveal  = overlay.querySelector('.fake-locator__reveal');
  const closeBtn = overlay.querySelector('.fake-locator__close');

  let i = 0;
  const total = STEPS.length;

  function next() {
    if (i >= total) {
      // Final "successful" beat, then reveal the prank
      barFill.style.width = '100%';
      setTimeout(() => {
        overlay.classList.add('fake-locator--revealed');
        reveal.hidden = false;
      }, 350);
      return;
    }
    const step = STEPS[i];
    const li = addStep(listEl, step.label);
    // Animate progress bar partially during this step
    const targetPct = Math.round(((i + 1) / total) * 100);
    barFill.style.width = targetPct + '%';

    setTimeout(() => {
      markStepDone(li, true);
      i += 1;
      next();
    }, step.ms);
  }
  next();

  closeBtn.addEventListener('click', () => {
    overlay.classList.add('fake-locator--leaving');
    setTimeout(() => {
      overlay.remove();
      if (typeof onFinished === 'function') onFinished();
    }, 350);
  });
}

export function initFakeLocator() {
  // Only on the visitors page
  if (!document.getElementById('visitor-map')) return;

  // Don't replay on every refresh in the same session
  try {
    if (sessionStorage.getItem(SESSION_KEY) === '1') return;
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch (e) { /* ignore quota / privacy mode */ }

  const overlay = buildOverlay();
  document.body.appendChild(overlay);

  // Lock scroll while the prank is on screen
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  // Small delay so the page paints before the overlay locks attention
  requestAnimationFrame(() => {
    overlay.classList.add('fake-locator--in');
    runLocator(overlay, () => {
      document.body.style.overflow = prevOverflow;
    });
  });
}
