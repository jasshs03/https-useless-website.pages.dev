export function initRunawayButton() {
  const runaway = document.getElementById('runaway');
  const wrapper = document.getElementById('runaway-wrapper');
  if (!runaway || !wrapper) return;

  // On touch devices, the dodge-on-hover model is unfair (no hover).
  // We let the touch user "win" after a couple of dodges via touchstart.
  const isTouch = matchMedia('(hover: none)').matches;
  let dodges = 0;

  function dodge() {
    const w = wrapper.clientWidth - runaway.offsetWidth;
    const h = wrapper.clientHeight - runaway.offsetHeight;
    runaway.style.left = Math.max(0, Math.random() * w) + 'px';
    runaway.style.top = Math.max(0, Math.random() * h) + 'px';

    dodges++;
    if (dodges > 5) runaway.textContent = 'Nope 🙅';
    if (dodges > 10) runaway.textContent = 'Stop trying 😤';
  }

  if (isTouch) {
    // Dodge on touchstart until the 4th tap — then let them "win"
    runaway.addEventListener('touchstart', (e) => {
      if (dodges < 3) {
        e.preventDefault();
        dodge();
      } else {
        runaway.textContent = 'fine, you win 🏆';
      }
    }, { passive: false });
  } else {
    runaway.addEventListener('mouseenter', dodge);
  }

  runaway.addEventListener('click', () => {
    runaway.textContent = 'You win nothing! 🎉';
  });
}
