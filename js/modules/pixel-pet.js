// Spider pixel pet that REPLACES the OS mouse cursor.
// Snaps to the exact pointer position, naps after a few seconds of no movement.
// Easter egg: click 10 times (anywhere) to permanently unlock the GOLDEN spider. ✨
const CLICK_KEY  = 'useless-spider-clicks';
const GOLDEN_KEY = 'useless-spider-golden';
const GOLDEN_AT  = 10;

function showSpiderToast(text) {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast--warn';
  toast.innerHTML = '<span class="toast__tag">★</span><span class="toast__msg"></span>';
  toast.querySelector('.toast__msg').textContent = text;
  stack.appendChild(toast);
  setTimeout(() => toast.classList.add('toast--leaving'), 3000);
  setTimeout(() => toast.remove(), 3600);
}

export function initPixelPet() {
  // Don't add the pet on the cat-trail page (would compete with cats)
  if (document.getElementById('cat-stage')) return;

  const pet = document.createElement('div');
  pet.className = 'pet';
  pet.innerHTML = '<span class="pet__body">🕷️</span><span class="pet__zzz">z</span>';
  document.body.appendChild(pet);

  // Mark <html> so CSS can hide the native cursor everywhere
  document.documentElement.classList.add('spider-cursor');

  // Restore golden state if already unlocked in a previous visit
  let golden = localStorage.getItem(GOLDEN_KEY) === '1';
  let clicks = Number(localStorage.getItem(CLICK_KEY)) || 0;
  if (golden) pet.classList.add('pet--golden');

  // Center the spider glyph on the pointer (measured once after mount)
  let halfW = 12, halfH = 12;
  requestAnimationFrame(() => {
    const r = pet.getBoundingClientRect();
    if (r.width)  halfW = r.width  / 2;
    if (r.height) halfH = r.height / 2;
  });

  let lastMove = performance.now();
  let napping = false;
  let visible = false;

  function place(clientX, clientY) {
    pet.style.transform = `translate(${clientX - halfW}px, ${clientY - halfH}px)`;
    if (!visible) {
      pet.style.opacity = '1';
      visible = true;
    }
  }

  document.addEventListener('pointermove', (e) => {
    place(e.clientX, e.clientY);
    lastMove = performance.now();
    if (napping) {
      napping = false;
      pet.classList.remove('pet--nap');
    }
  }, { passive: true });

  // Count any click toward the golden-spider unlock.
  // (Spider has pointer-events:none, so clicks pass through — but the spider
  // IS the cursor, so every click feels like "clicking" it.)
  document.addEventListener('click', () => {
    if (golden) return;
    clicks += 1;
    try { localStorage.setItem(CLICK_KEY, String(clicks)); } catch (e) { /* ignore */ }

    // Tiny squish animation on every click so the spider feels reactive
    pet.classList.remove('pet--squish');
    void pet.offsetWidth;
    pet.classList.add('pet--squish');

    if (clicks >= GOLDEN_AT) {
      golden = true;
      try { localStorage.setItem(GOLDEN_KEY, '1'); } catch (e) { /* ignore */ }
      pet.classList.add('pet--golden');
      showSpiderToast('✨ GOLDEN SPIDER unlocked — still useless.');
    }
  });

  // Hide spider when the cursor leaves the window
  document.addEventListener('pointerleave', () => {
    pet.style.opacity = '0';
    visible = false;
  });
  document.addEventListener('pointerenter', (e) => {
    place(e.clientX, e.clientY);
  });

  // Nap check (cheap setInterval, no rAF needed since position is event-driven)
  setInterval(() => {
    if (!napping && performance.now() - lastMove > 4000) {
      napping = true;
      pet.classList.add('pet--nap');
    }
  }, 500);
}
