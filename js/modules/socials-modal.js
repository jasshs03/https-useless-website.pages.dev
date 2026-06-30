// "Add me on my game platforms" modal
// Triggered by any element with [data-modal="socials"]
// Closes on: ✕ button, ESC, or backdrop click

const PLATFORMS = [
  {
    id: 'valorant',
    name: 'Valorant',
    handle: 'Letskilljoy #KJKJ',
    color: '#FF4655',
    // SimpleIcons brand SVG (CC0)
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.792 2.152a.252.252 0 00-.098.083L13.075 15.6a.502.502 0 00.392.811h5.717a.604.604 0 00.469-.226l4.143-5.179A.5.5 0 0024 10.69V2.387a.25.25 0 00-.208-.235zM.208 2.152a.25.25 0 00-.208.235v8.302a.5.5 0 00.104.317l4.143 5.18a.6.6 0 00.469.225h5.717a.502.502 0 00.392-.81L.305 2.235a.252.252 0 00-.097-.083z"/></svg>',
  },
  {
    id: 'lol',
    name: 'League of Legends',
    handle: 'Letskilljoy #KJKJ',
    color: '#C8AA6E',
    // Stylized "LoL" monogram inside a hex shield
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.2L2.5 6.5v11L12 22.8l9.5-5.3v-11L12 1.2zm0 2.3l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7L12 3.5zM6.6 8.2v7.5h4.5v-1.4H8.1V8.2H6.6zm5.7 0v7.5h1.5V8.2h-1.5zm3.1 0v7.5h4.1v-1.4H17V8.2h-1.6z"/></svg>',
  },
  {
    id: 'discord',
    name: 'Discord',
    handle: 'Jasshs',
    color: '#5865F2',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419Z"/></svg>',
  },
  {
    id: 'steam',
    name: 'Steam',
    handle: 'Jasshs',
    color: '#66c0f4',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/></svg>',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    handle: 'Letskilljoy03',
    color: '#9146FF',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>',
  },
];

export function initSocialsModal() {
  const triggers = document.querySelectorAll('[data-modal="socials"]');
  if (!triggers.length) return;

  // Build the modal once and append to <body>
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'socials-title');
  modal.hidden = true;

  modal.innerHTML = `
    <div class="modal__backdrop" data-close></div>
    <div class="modal__panel" role="document">
      <header class="modal__header">
        <h2 id="socials-title" class="modal__title">// add me on my game platforms</h2>
        <button class="modal__close" type="button" aria-label="Close" data-close>×</button>
      </header>
      <ul class="socials">
        ${PLATFORMS.map(p => `
          <li class="social" style="--brand: ${p.color};">
            <span class="social__icon" aria-hidden="true">${p.icon}</span>
            <span class="social__text">
              <span class="social__name">${p.name}</span>
              <span class="social__handle">${p.handle}</span>
            </span>
            <button class="social__copy" type="button"
                    data-copy="${p.handle.replace(/"/g, '&quot;')}"
                    aria-label="Copy ${p.name} handle">copy</button>
          </li>
        `).join('')}
      </ul>
      <p class="modal__foot">gg &nbsp;·&nbsp; see you in-game 🎮</p>
    </div>
  `;
  document.body.appendChild(modal);

  let lastFocus = null;

  function open(e) {
    e?.preventDefault();
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    // Focus the close button so ESC/Enter feels natural
    modal.querySelector('.modal__close')?.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  // Wire triggers
  triggers.forEach(t => t.addEventListener('click', open));

  // Close on ✕, backdrop, or ESC
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!modal.hidden && e.key === 'Escape') close();
  });

  // Copy-to-clipboard buttons
  modal.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const value = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(value);
      const original = btn.textContent;
      btn.textContent = 'copied!';
      btn.classList.add('is-copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('is-copied');
      }, 1400);
    } catch {
      btn.textContent = 'copy failed';
    }
  });
}
