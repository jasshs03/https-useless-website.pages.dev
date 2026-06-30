export function initNothingButton() {
  const nothingBtn = document.getElementById('nothing');
  if (!nothingBtn) return;

  let nothingClicks = 0;
  nothingBtn.addEventListener('click', () => {
    nothingClicks++;
    if (nothingClicks === 10) {
      nothingBtn.textContent = "Okay fine, here's a potato: 🥔";
    } else if (nothingClicks === 20) {
      nothingBtn.textContent = 'Do nothing';
      nothingClicks = 0;
    }
  });
}
