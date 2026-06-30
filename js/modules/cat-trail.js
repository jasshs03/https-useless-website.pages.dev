// Spawns a 🐱 wherever the mouse moves. Each cat fades + drifts away
// so the screen doesn't fill up forever (well — almost).
export function initCatTrail() {
  const stage = document.getElementById('cat-stage');
  if (!stage) return;

  const cats = ['🐱', '😺', '😸', '😻', '🙀', '😹', '😼'];
  const counterEl = document.getElementById('cat-count');
  const clearBtn  = document.getElementById('cat-clear');
  const toggleBtn = document.getElementById('cat-toggle');

  let count = 0;
  let enabled = true;
  let lastSpawn = 0;
  const MIN_INTERVAL_MS = 18; // throttle so it doesn't melt your CPU

  function spawnCat(x, y) {
    const cat = document.createElement('span');
    cat.className = 'trail-cat';
    cat.textContent = cats[Math.floor(Math.random() * cats.length)];
    // Random size, rotation, and drift direction for variety
    const size = 1.2 + Math.random() * 1.6;
    const rot  = (Math.random() * 60 - 30).toFixed(1);
    const dx   = (Math.random() * 40 - 20).toFixed(1);
    const dy   = (20 + Math.random() * 40).toFixed(1);
    cat.style.left = x + 'px';
    cat.style.top  = y + 'px';
    cat.style.fontSize = size + 'rem';
    cat.style.setProperty('--rot', rot + 'deg');
    cat.style.setProperty('--dx', dx + 'px');
    cat.style.setProperty('--dy', dy + 'px');
    stage.appendChild(cat);

    count++;
    if (counterEl) counterEl.textContent = count;

    // Remove after the CSS animation completes
    setTimeout(() => cat.remove(), 1600);
  }

  function onPointerMove(e) {
    if (!enabled) return;
    const now = performance.now();
    if (now - lastSpawn < MIN_INTERVAL_MS) return;
    lastSpawn = now;
    spawnCat(e.clientX, e.clientY);
  }

  function onTouch(e) {
    if (!enabled) return;
    for (const t of e.touches) spawnCat(t.clientX, t.clientY);
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('touchmove',   onTouch,       { passive: true });

  clearBtn?.addEventListener('click', () => {
    stage.replaceChildren();
    count = 0;
    if (counterEl) counterEl.textContent = '0';
  });

  toggleBtn?.addEventListener('click', () => {
    enabled = !enabled;
    toggleBtn.textContent = enabled ? 'pause cats' : 'resume cats';
  });
}
