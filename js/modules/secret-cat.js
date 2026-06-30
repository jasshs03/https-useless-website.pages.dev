// Easter eggs:
//   Type "cat"      → a slow walking cat strolls across the screen
//   Type "crossini" → a crossini sits and slowly eats a croissant 🥐

const NOM_LINES = ['*nom*', '*munch*', '*chomp*', '*nibble*'];

// ----------------------------------------------------------------
// Walking cat — calm stroll across the screen, no shouting
// ----------------------------------------------------------------
function spawnWalkingCat() {
  const cat = document.createElement('div');
  cat.className = 'walk-cat';

  // Random direction: left→right (default) or right→left
  const reverse = Math.random() < 0.5;
  if (reverse) cat.classList.add('walk-cat--reverse');

  // Random vertical band (keep out of the absolute edges)
  const top = 18 + Math.random() * 65; // 18% – 83%
  cat.style.top = top + 'vh';

  // Random size + slow walking pace (slower than a "dash")
  const scale = 1 + Math.random() * 1.2;
  const duration = (6 + Math.random() * 4).toFixed(2); // 6-10 seconds
  cat.style.setProperty('--walk-scale', scale.toFixed(2));
  cat.style.setProperty('--walk-duration', duration + 's');

  cat.innerHTML = '<span class="walk-cat__cat">🐈</span>';
  document.body.appendChild(cat);

  const lifeMs = Number(duration) * 1000 + 400;
  setTimeout(() => cat.remove(), lifeMs);
}

// ----------------------------------------------------------------
// Crossini eating — sits at a random spot, slowly eats a croissant
// ----------------------------------------------------------------
function spawnEatingCrossini() {
  const wrap = document.createElement('div');
  wrap.className = 'crossini-eat';

  // Position randomly in a comfy seating area
  const leftVW = 8 + Math.random() * 70;   // 8vw – 78vw
  const topVH  = 30 + Math.random() * 45;  // 30vh – 75vh
  wrap.style.left = leftVW + 'vw';
  wrap.style.top  = topVH + 'vh';

  // Random size
  const scale = 1 + Math.random() * 0.6;
  wrap.style.setProperty('--eat-scale', scale.toFixed(2));

  const nom = NOM_LINES[Math.floor(Math.random() * NOM_LINES.length)];

  wrap.innerHTML =
    '<span class="crossini-eat__nom">' + nom + '</span>' +
    '<span class="crossini-eat__food">🥐</span>' +
    '<span class="crossini-eat__cat">🐈</span>';

  document.body.appendChild(wrap);

  // After the croissant is fully eaten (food shrinks via CSS steps() over 6s),
  // swap the chewing caption for a satisfied "*burp*"
  setTimeout(() => {
    const nomEl = wrap.querySelector('.crossini-eat__nom');
    if (nomEl) {
      nomEl.textContent = '*burp*';
      nomEl.classList.add('crossini-eat__nom--done');
    }
  }, 6200);

  // Whole thing fades out at the end of its lifecycle
  setTimeout(() => wrap.remove(), 8200);
}

// ----------------------------------------------------------------
// Wire keyboard triggers
// ----------------------------------------------------------------
const TRIGGERS = [
  { word: 'cat',      spawn: spawnWalkingCat },
  { word: 'crossini', spawn: spawnEatingCrossini },
];
const MAX_LEN = Math.max(...TRIGGERS.map((t) => t.word.length));
// Check longer triggers first so "crossini" wins over any shorter prefix
const SORTED = TRIGGERS.slice().sort((a, b) => b.word.length - a.word.length);

export function initSecretCat() {
  let buffer = '';

  document.addEventListener('keydown', (e) => {
    // Don't fire while typing in form fields (so "cat" in complaints box is safe)
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
      return;
    }
    if (e.key.length !== 1) return; // ignore Shift, arrows, etc.

    buffer = (buffer + e.key.toLowerCase()).slice(-MAX_LEN);

    for (const trig of SORTED) {
      if (buffer.endsWith(trig.word)) {
        buffer = '';
        trig.spawn();
        break;
      }
    }
  });
}
