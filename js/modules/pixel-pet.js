// Tiny spider that lazily follows the cursor and "naps" (Z animation)
// after a few seconds of no movement.
export function initPixelPet() {
  // Don't add the pet on the cat-trail page (would compete with cats)
  if (document.getElementById('cat-stage')) return;

  const pet = document.createElement('div');
  pet.className = 'pet';
  pet.innerHTML = '<span class="pet__body">🕷️</span><span class="pet__zzz">z</span>';
  document.body.appendChild(pet);

  let x = window.innerWidth - 80;
  let y = window.innerHeight - 120;
  let tx = x, ty = y;
  let lastMove = performance.now();
  let napping = false;

  document.addEventListener('pointermove', (e) => {
    // Move toward a point near the cursor, but offset so it doesn't sit ON it
    tx = e.clientX + 24;
    ty = e.clientY + 24;
    lastMove = performance.now();
    if (napping) {
      napping = false;
      pet.classList.remove('pet--nap');
    }
  });

  function tick() {
    // Ease toward target slowly (0.04 = pretty lazy)
    x += (tx - x) * 0.04;
    y += (ty - y) * 0.04;

    // Clamp inside viewport
    x = Math.max(8, Math.min(window.innerWidth - 40, x));
    y = Math.max(8, Math.min(window.innerHeight - 40, y));

    pet.style.transform = `translate(${x}px, ${y}px)`;

    if (!napping && performance.now() - lastMove > 4000) {
      napping = true;
      pet.classList.add('pet--nap');
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
