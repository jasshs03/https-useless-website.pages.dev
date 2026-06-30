// Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
// Triggers a brief rain of potatoes + cats and shows a secret toast.
const SEQ = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
];

function showToast(text) {
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
  setTimeout(() => toast.classList.add('toast--leaving'), 3500);
  setTimeout(() => toast.remove(), 4100);
}

function rainPotatoes(count = 40) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'potato';
      p.textContent = Math.random() < 0.5 ? '🥔' : '🐱';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      p.style.fontSize = (1.5 + Math.random() * 2.5) + 'rem';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 10000);
    }, i * 60);
  }
}

export function initKonami() {
  let buffer = [];
  document.addEventListener('keydown', (e) => {
    buffer.push(e.key);
    if (buffer.length > SEQ.length) buffer.shift();
    // Case-insensitive match for b/a
    const match = SEQ.every((k, i) => {
      const got = buffer[i];
      if (!got) return false;
      return k.length === 1
        ? got.toLowerCase() === k.toLowerCase()
        : got === k;
    });
    if (match) {
      buffer = [];
      rainPotatoes(40);
      showToast('★ cheat code activated: useless mode ENABLED');
      document.documentElement.classList.add('konami-glow');
      setTimeout(() => document.documentElement.classList.remove('konami-glow'), 4000);
    }
  });
}
