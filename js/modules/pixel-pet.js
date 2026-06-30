// Spider pixel pet that REPLACES the OS mouse cursor.
// Snaps to the exact pointer position, naps after a few seconds of no movement.
export function initPixelPet() {
  // Don't add the pet on the cat-trail page (would compete with cats)
  if (document.getElementById('cat-stage')) return;

  const pet = document.createElement('div');
  pet.className = 'pet';
  pet.innerHTML = '<span class="pet__body">🕷️</span><span class="pet__zzz">z</span>';
  document.body.appendChild(pet);

  // Mark <html> so CSS can hide the native cursor everywhere
  document.documentElement.classList.add('spider-cursor');

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
