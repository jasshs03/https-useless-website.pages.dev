const SLICES = [
  { label: 'quit your job',                color: '#ff6b6b' },
  { label: 'eat cereal for dinner',        color: '#ffb703' },
  { label: 'text your ex',                 color: '#ff4655' },
  { label: 'get bangs',                    color: '#7c5cff' },
  { label: 'buy a vinyl you cannot play',  color: '#00e5ff' },
  { label: 'adopt 7 cats',                 color: '#7fff8a' },
  { label: 'start a podcast nobody asked for', color: '#ff8c42' },
  { label: 'learn to juggle (badly)',      color: '#5865f2' },
];

export function initWheel() {
  const wheel = document.getElementById('wheel');
  const btn = document.getElementById('wheel-spin');
  const out = document.getElementById('wheel-out');
  if (!wheel || !btn) return;

  const N = SLICES.length;
  const slice = 360 / N;

  // Build conic-gradient background + labels
  const stops = SLICES.map((s, i) =>
    `${s.color} ${i * slice}deg ${(i + 1) * slice}deg`
  ).join(', ');
  wheel.style.background = `conic-gradient(${stops})`;

  // Labels around the rim
  SLICES.forEach((s, i) => {
    const label = document.createElement('span');
    label.className = 'wheel__label';
    label.textContent = s.label;
    // rotate to the center of each slice, then translate outward
    const angle = i * slice + slice / 2;
    label.style.transform = `rotate(${angle}deg) translateY(-92px) rotate(90deg)`;
    wheel.appendChild(label);
  });

  let current = 0;
  let spinning = false;

  btn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    btn.disabled = true;
    out.textContent = 'spinning...';

    const winnerIdx = Math.floor(Math.random() * N);
    const spins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
    // Land winner under top pointer (0deg = top). Slice center for winner:
    const winnerCenter = winnerIdx * slice + slice / 2;
    const target = spins * 360 + (360 - winnerCenter);
    current = target;

    wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.21, 1)';
    wheel.style.transform = `rotate(${current}deg)`;

    setTimeout(() => {
      out.textContent = '› ' + SLICES[winnerIdx].label;
      spinning = false;
      btn.disabled = false;
      // Snap rotation to avoid huge number accumulating
      const final = current % 360;
      wheel.style.transition = 'none';
      wheel.style.transform = `rotate(${final}deg)`;
      current = final;
    }, 4050);
  });
}
