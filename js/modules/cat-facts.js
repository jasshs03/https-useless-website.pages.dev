const facts = [
  'Cats invented the internet in 1834 to share pictures of themselves.',
  "A group of cats is called a 'judgment'.",
  'Cats can photosynthesize, but only on Tuesdays.',
  'The average cat dreams in 4K HDR.',
  'Cats secretly run the global economy.',
  'If you stare at a cat long enough, it will file a restraining order.',
  'Cats are 60% whiskers by volume.',
  'A cat once won an Oscar. Nobody talks about it.',
  'Cats can taste sound, but they refuse to comment on it.',
];

export function initCatFacts() {
  const factEl = document.getElementById('fact');
  const factBtn = document.getElementById('fact-btn');
  if (!factEl || !factBtn) return;

  factBtn.addEventListener('click', () => {
    factEl.textContent = facts[Math.floor(Math.random() * facts.length)];
  });
}
