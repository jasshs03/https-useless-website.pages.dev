const ACTIVITIES = [
  'count the ceiling tiles in this room',
  'organize your sock drawer by emotional value',
  'name every cloud you can see',
  'high-five a stranger (consensually)',
  'write a haiku about cheese',
  'translate "potato" into 5 languages and use them in a sentence',
  'rearrange the contents of your fridge by color',
  'time how long you can stare at a wall',
  'invent a new handshake. practice it alone.',
  'send a heartfelt thank-you note to a sandwich',
  'try eating a yogurt with a fork',
  'compliment a houseplant out loud',
  'see how many times you can say "blueberry" before it stops sounding real',
  'walk backwards from one room to another',
  'wink at yourself in the mirror until it becomes uncomfortable',
  'try to lick your elbow (you will fail. that is the point.)',
  'pretend you are a documentary narrator describing your own life',
  'eat a single grape very, very slowly',
  'arrange your shoes in alphabetical order. by personality.',
  'have a staring contest with a pigeon',
  'write a love letter to your favorite spoon',
  'try to fold a fitted sheet (legally impossible)',
  'memorize the first 20 digits of pi. forget them. repeat.',
  'invent a new walk and use it for the next hour',
];

export function initBored() {
  const out = document.getElementById('bored-out');
  const btn = document.getElementById('bored-btn');
  if (!out || !btn) return;

  let last = -1;
  btn.addEventListener('click', () => {
    let i = Math.floor(Math.random() * ACTIVITIES.length);
    if (i === last) i = (i + 1) % ACTIVITIES.length; // avoid same twice in a row
    last = i;
    out.textContent = '› ' + ACTIVITIES[i];
    out.classList.remove('flash');
    void out.offsetWidth; // restart animation
    out.classList.add('flash');
  });
}
