// Click the author's name → escalating annoyed toasts. 😤
// Sequence: index 0 first, then 1, then "kulit" spam for a few clicks,
// then "Stop" forever.
const messages = [
  'there\u2019s nothing here //',
  'I said nothing here.',
  'kulit mo, wala ngang meron dito!',
  'kulit mo, wala ngang meron dito!!',
  'kulit mo, wala ngang meron dito!!!',
  'Stop.',
];

export function initCreditPrompt() {
  const author = document.querySelector('.site-credit .author');
  if (!author) return;

  // Single shared toast stack, top-left under the credit
  const stack = document.createElement('div');
  stack.className = 'toast-stack';
  document.body.appendChild(stack);

  let clicks = 0;

  function showToast(text, intensity) {
    const toast = document.createElement('div');
    toast.className = 'toast toast--' + intensity;

    const tag = document.createElement('span');
    tag.className = 'toast__tag';
    tag.textContent = '!';

    const msg = document.createElement('span');
    msg.className = 'toast__msg';
    msg.textContent = text;

    toast.append(tag, msg);
    stack.appendChild(toast);

    // Cap stack so the screen can't fill with toasts forever
    while (stack.children.length > 4) stack.firstElementChild.remove();

    // Slide/fade out, then remove
    setTimeout(() => toast.classList.add('toast--leaving'), 2400);
    setTimeout(() => toast.remove(), 3000);
  }

  author.addEventListener('click', (e) => {
    e.preventDefault();
    const i = Math.min(clicks, messages.length - 1);
    const intensity =
      i === 0 ? 'info' :
      i === 1 ? 'warn' :
      i === messages.length - 1 ? 'stop' : 'angry';
    showToast(messages[i], intensity);
    clicks++;
  });
}
