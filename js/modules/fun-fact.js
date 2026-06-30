// Top-right "Fun Fact" widget.
// Anchors to a fixed birth moment for the site and shows a live minute counter
// that keeps ticking for as long as the page is open.

// May 23, 2026, 12:00 noon Manila time (UTC+8). Fixed forever.
const BORN_AT = new Date('2026-05-23T12:00:00+08:00').getTime();

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function fmt(n) {
  return n.toLocaleString('en-US');
}

function bornLabel() {
  const d = new Date(BORN_AT);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function initFunFact() {
  // Don't double-mount if module is somehow imported twice
  if (document.querySelector('.fun-fact')) return;

  const widget = document.createElement('aside');
  widget.className = 'fun-fact';
  widget.setAttribute('aria-label', 'Fun fact about this site');
  widget.innerHTML = `
    <span class="fun-fact__label">[ Fun Fact ]</span>
    <span class="fun-fact__line">
      this site was born <span class="fun-fact__date">${bornLabel()}</span>
    </span>
    <span class="fun-fact__line">
      <span class="fun-fact__num" data-fun-fact-minutes>0</span>
      minutes ago<span class="fun-fact__cursor">_</span>
    </span>
  `;
  document.body.appendChild(widget);

  const numEl = widget.querySelector('[data-fun-fact-minutes]');
  let lastMinutes = -1;

  function tick() {
    const minutes = Math.max(0, Math.floor((Date.now() - BORN_AT) / 60000));
    if (minutes !== lastMinutes) {
      numEl.textContent = fmt(minutes);
      // Tiny flash whenever a new minute clicks over
      if (lastMinutes !== -1) {
        numEl.classList.remove('fun-fact__num--bump');
        // force reflow so the animation restarts
        void numEl.offsetWidth;
        numEl.classList.add('fun-fact__num--bump');
      }
      lastMinutes = minutes;
    }
  }

  tick();
  // Refresh every 5s — accurate enough, cheap, and the cursor blinks via CSS anyway
  setInterval(tick, 5000);
}
