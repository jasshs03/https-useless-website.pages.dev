// "Fun Fact" widget — sits directly under the Letskilljoy | Uselesswebsite credit.
// Anchors to a fixed birth moment for the site and shows a live counter
// (minutes + seconds) that keeps ticking for as long as the page is open.

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
  widget.innerHTML = [
    '<div class="fun-fact__line fun-fact__line--header">',
      '<span class="label">Fun Fact:</span> ',
      '<span class="text">This useless website was Born:</span>',
    '</div>',
    `<div class="fun-fact__line"><span class="date">${bornLabel()}</span></div>`,
    '<div class="fun-fact__line">',
      '<span class="num" data-fun-fact-days>0</span> Days',
    '</div>',
    '<div class="fun-fact__line">',
      '<span class="num" data-fun-fact-minutes>0</span> min ',
      '<span class="num" data-fun-fact-seconds>0</span> sec',
      '<span class="cursor">_</span>',
    '</div>'
  ].join('');

  // Anchor to the site-credit element so it sits right below "Letskilljoy | Uselesswebsite"
  const credit = document.querySelector('.site-credit');
  if (credit && credit.parentNode) {
    credit.insertAdjacentElement('afterend', widget);
  } else {
    document.body.appendChild(widget);
  }

  const minEl = widget.querySelector('[data-fun-fact-minutes]');
  const secEl = widget.querySelector('[data-fun-fact-seconds]');
  const dayEl = widget.querySelector('[data-fun-fact-days]');
  let lastMinutes = -1;
  let lastDays = -1;

  function tick() {
    const totalSeconds = Math.max(0, Math.floor((Date.now() - BORN_AT) / 1000));
    const days = Math.floor(totalSeconds / 86400);
    // Total minutes since birth (keeps climbing forever, independent of days)
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    secEl.textContent = fmt(seconds);
    if (minutes !== lastMinutes) {
      minEl.textContent = fmt(minutes);
      // Tiny flash whenever a new minute clicks over
      if (lastMinutes !== -1) {
        minEl.classList.remove('num--bump');
        // force reflow so the animation restarts
        void minEl.offsetWidth;
        minEl.classList.add('num--bump');
      }
      lastMinutes = minutes;
    }
    if (days !== lastDays) {
      dayEl.textContent = fmt(days);
      if (lastDays !== -1) {
        dayEl.classList.remove('num--bump');
        void dayEl.offsetWidth;
        dayEl.classList.add('num--bump');
      }
      lastDays = days;
    }
  }

  tick();
  // Tick every second so the seconds counter stays accurate
  setInterval(tick, 1000);
}
