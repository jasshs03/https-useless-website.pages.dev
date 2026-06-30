const loaderMessages = [
  'Initializing potato matrix...',
  'Convincing electrons to cooperate...',
  'Reticulating splines...',
  'Asking the cat for permission...',
  'Almost there...',
  'Just kidding, starting over.',
  'Buffering vibes...',
  'Downloading more RAM...',
];

export function initLoader() {
  const bar = document.getElementById('bar');
  const loaderText = document.getElementById('loader-text');
  if (!bar || !loaderText) return;

  let progress = 0;
  setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 0;
      loaderText.textContent =
        loaderMessages[Math.floor(Math.random() * loaderMessages.length)];
    }
    bar.style.width = progress + '%';
  }, 600);
}
