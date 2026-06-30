// Easter egg: type "cat" anywhere → a cat dashes across the screen
// shouting "crossini!". Stacks if you spam it. Pure chaos.
const TRIGGER = 'cat';
const SHOUTS = [
  'crossini!',
  'crossini!!',
  'CROSSINI~',
  'meow meow',
  'sprintcat.exe',
  '*zoomies*',
];

function spawnCrossiniCat() {
  const cat = document.createElement('div');
  cat.className = 'crossini';

  // Random direction: -1 = right→left, 1 = left→right
  const dir = Math.random() < 0.5 ? -1 : 1;
  if (dir === -1) cat.classList.add('crossini--reverse');

  // Random vertical band (avoid the very top/bottom so it doesn't hide)
  const top = 12 + Math.random() * 70; // 12% – 82%
  cat.style.top = top + 'vh';

  // Random size + speed
  const scale = 1 + Math.random() * 1.6;
  const duration = (2.2 + Math.random() * 1.8).toFixed(2);
  cat.style.setProperty('--crossini-scale', scale.toFixed(2));
  cat.style.setProperty('--crossini-duration', duration + 's');

  const shout = SHOUTS[Math.floor(Math.random() * SHOUTS.length)];
  cat.innerHTML =
    '<span class="crossini__cat">🐈</span>' +
    '<span class="crossini__shout">' + shout + '</span>';

  document.body.appendChild(cat);

  // Clean up after the animation finishes (with a little buffer)
  const lifeMs = Number(duration) * 1000 + 400;
  setTimeout(() => cat.remove(), lifeMs);
}

export function initSecretCat() {
  let buffer = '';

  document.addEventListener('keydown', (e) => {
    // Ignore typing inside form fields so people can still write "cat" in the
    // complaints box without summoning the apocalypse.
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
      return;
    }
    if (e.key.length !== 1) return; // ignore Shift, Arrow, etc.

    buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
    if (buffer === TRIGGER) {
      buffer = '';
      spawnCrossiniCat();
    }
  });
}
