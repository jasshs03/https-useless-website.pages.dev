export function initPotatoes() {
  setInterval(() => {
    const potato = document.createElement('div');
    potato.className = 'potato';
    potato.textContent = '🥔';
    potato.style.left = Math.random() * 100 + 'vw';
    potato.style.animationDuration = 5 + Math.random() * 6 + 's';
    potato.style.fontSize = 1 + Math.random() * 2.5 + 'rem';
    document.body.appendChild(potato);
    setTimeout(() => potato.remove(), 12000);
  }, 700);
}
