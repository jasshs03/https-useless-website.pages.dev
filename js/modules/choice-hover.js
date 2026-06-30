// Tracks the mouse over .choice cards so the glow follows the cursor.
export function initChoiceHover() {
  const choices = document.querySelectorAll('.choice');
  if (!choices.length) return;

  choices.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', mx + '%');
      el.style.setProperty('--my', my + '%');
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '50%');
      el.style.setProperty('--my', '0%');
    });
  });
}
