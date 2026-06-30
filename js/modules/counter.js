const messages = [
  'Press me, I beg you',
  'Again?',
  'Why are you doing this?',
  'Please stop',
  'Okay this is just sad',
  "I'm telling your mom",
  'Fine, keep going',
  '🥔',
];

export function initCounter() {
  const counterEl = document.getElementById('counter');
  const pressBtn = document.getElementById('press-me');
  if (!counterEl || !pressBtn) return;

  let count = 0;
  pressBtn.addEventListener('click', () => {
    count++;
    counterEl.textContent = count;
    pressBtn.textContent = messages[Math.min(count, messages.length - 1)];
  });
}
