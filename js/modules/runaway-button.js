export function initRunawayButton() {
  const runaway = document.getElementById('runaway');
  const wrapper = document.getElementById('runaway-wrapper');
  if (!runaway || !wrapper) return;

  let dodges = 0;

  runaway.addEventListener('mouseenter', () => {
    const w = wrapper.clientWidth - runaway.offsetWidth;
    const h = wrapper.clientHeight - runaway.offsetHeight;
    runaway.style.left = Math.max(0, Math.random() * w) + 'px';
    runaway.style.top = Math.max(0, Math.random() * h) + 'px';

    dodges++;
    if (dodges > 5) runaway.textContent = 'Nope 🙅';
    if (dodges > 10) runaway.textContent = 'Stop trying 😤';
  });

  runaway.addEventListener('click', () => {
    runaway.textContent = 'You win nothing! 🎉';
  });
}
