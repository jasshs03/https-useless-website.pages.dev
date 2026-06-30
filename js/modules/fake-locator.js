// Fake "locating you" loading screen for the visitors page.
// Pretends to obtain your IP, check system config, ping a satellite, etc.
// Then reveals it was a PRANK. The user can RESCAN — and we'll happily
// prank them again, with escalating sass each time.
//
// Runs once per browser session (sessionStorage) so the prank doesn't get
// stale on every refresh.

const SESSION_KEY = 'useless-locator-seen';

const STEPS = [
  { label: 'Obtaining your IP address',           ms: 2200 },
  { label: 'Checking system configuration',       ms: 1800 },
  { label: 'Pinging satellite #7',                ms: 2400 },
  { label: 'Triangulating cell towers',           ms: 1900 },
  { label: 'Cross-referencing potatoes',          ms: 1600 },
  { label: 'Asking your neighbor (politely)',     ms: 1700 },
  { label: 'Decrypting your browser history',     ms: 2100 },
  { label: 'Locating you on the map',             ms: 2300 },
];

// Each entry = one prank reveal. Index = how many scans they've completed.
// After the last one they can still rescan; we'll just repeat the final entry.
const PRANKS = [
  {
    title: 'PRANK!',
    msg:   "walang ganon.",
    button: 'rescan →',
  },
  {
    title: 'PRANK ULIT!',
    msg:   "kulit mo, wala ngang ganon. umiipasa ka pa!",
    button: 'rescan one more time →',
  },
  {
    title: 'GRABE KA!',
    msg:   "ang kulit talaga. sayang yung oras mo, hindi sa amin.",
    button: 'isa pa, sige na →',
  },
  {
    title: 'OKAY SUKO NA AKO.',
    msg:   "ikaw na ang panalo. tingnan mo na lang yung (fake) map.",
    button: 'see the (fake) map →',
  },
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
        '<h2 class="fake-locator__reveal-title"></h2>',
        '<p class="fake-locator__reveal-msg"></p>',
        '<div class="fake-locator__actions">',
          '<button class="fake-locator__rescan" type="button">rescan →</button>',
          '<button class="fake-locator__close"  type="button">see the (fake) map →</button>',
        '</div>',
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

function resetForRescan(overlay) {
  // Hide reveal + show the progress UI again
  overlay.classList.remove('fake-locator--revealed');
  const reveal = overlay.querySelector('.fake-locator__reveal');
  reveal.hidden = true;

  // Clear completed steps and reset the progress bar
  const listEl  = overlay.querySelector('.fake-locator__steps');
  const barFill = overlay.querySelector('.fake-locator__bar-fill');
  listEl.innerHTML = '';
  // Reset bar width without transition flash
  barFill.style.transition = 'none';
  barFill.style.width = '0%';
  // Re-enable transition on next frame
  requestAnimationFrame(() => {
    barFill.style.transition = '';
  });
}

function showPrank(overlay, scanCount, onCloseFinal) {
  const idx = Math.min(scanCount, PRANKS.length - 1);
  const p   = PRANKS[idx];
  const isFinal = idx >= PRANKS.length - 1;

  const reveal    = overlay.querySelector('.fake-locator__reveal');
  const titleEl   = reveal.querySelector('.fake-locator__reveal-title');
  const msgEl     = reveal.querySelector('.fake-locator__reveal-msg');
  const rescanBtn = reveal.querySelector('.fake-locator__rescan');
  const closeBtn  = reveal.querySelector('.fake-locator__close');

  titleEl.textContent = p.title;
  msgEl.textContent   = p.msg;

  // On the final prank: hide rescan, show "see the (fake) map" only
  if (isFinal) {
    rescanBtn.hidden = true;
    closeBtn.hidden  = false;
    closeBtn.textContent = p.button;
  } else {
    rescanBtn.hidden = false;
    rescanBtn.textContent = p.button;
    closeBtn.hidden  = false;
    closeBtn.textContent = 'skip → (fake) map';
  }

  overlay.classList.add('fake-locator--revealed');
  reveal.hidden = false;

  // Restart shake animation for emphasis on each prank
  titleEl.classList.remove('fake-locator__reveal-title--shake');
  void titleEl.offsetWidth;
  titleEl.classList.add('fake-locator__reveal-title--shake');
}

function runLocator(overlay, scanCount, onFinished) {
  const listEl  = overlay.querySelector('.fake-locator__steps');
  const barFill = overlay.querySelector('.fake-locator__bar-fill');

  let i = 0;
  const total = STEPS.length;

  function next() {
    if (i >= total) {
      barFill.style.width = '100%';
      setTimeout(() => showPrank(overlay, scanCount, onFinished), 900);
      return;
    }
    const step = STEPS[i];
    const li = addStep(listEl, step.label);
    const targetPct = Math.round(((i + 1) / total) * 100);
    barFill.style.width = targetPct + '%';

    setTimeout(() => {
      markStepDone(li, true);
      i += 1;
      next();
    }, step.ms);
  }
  next();
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

  let scanCount = 0;

  function dismiss() {
    overlay.classList.add('fake-locator--leaving');
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = prevOverflow;
    }, 350);
  }

  // Wire button handlers once (re-find each click in case of DOM swaps)
  overlay.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.classList.contains('fake-locator__rescan')) {
      scanCount += 1;
      resetForRescan(overlay);
      runLocator(overlay, scanCount, dismiss);
    } else if (t.classList.contains('fake-locator__close')) {
      dismiss();
    }
  });

  // Small delay so the page paints before the overlay locks attention
  requestAnimationFrame(() => {
    overlay.classList.add('fake-locator--in');
    runLocator(overlay, scanCount, dismiss);
  });
}
