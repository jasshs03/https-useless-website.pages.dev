// Mini Idle Aura — a useless virtual pixel pet.
// Feed Aura cookies, entertain her with games, swat random ad popups.
// All stats slowly decay. She's never satisfied. Just like life.

const STORAGE_KEY = 'useless-idle-aura-pet-v1';
const SAVE_EVERY_MS = 4000;
const TICK_MS = 1000;            // 1 stat-decay tick per second
const RENDER_MS = 80;            // ~12 fps render loop for character
const OFFLINE_CAP_SEC = 60 * 60 * 4; // 4h max offline decay/gain

// --- decay rates (% per second) ---
const DECAY = {
  hunger: 0.18,
  fun:    0.13,
  vibes:  0.10, // baseline; goes higher when an ad is on screen
};
const VIBES_AD_PENALTY = 0.6; // extra %/sec while an ad is up

// --- action effects ---
const FEED_GAIN = 18;
const PLAY_GAIN = 22;
const AD_CLOSE_GAIN = 14;
const FEED_COIN = 1;
const PLAY_COIN = 3;
const AD_COIN = 2;
const PLAY_COOLDOWN_MS = 2200;
const FEED_COOLDOWN_MS = 700;
const COOKIE_PRICE = 10;
const STARTING_COOKIES = 5;

// --- xp / level ---
const XP_PER_ACTION = 1;
const XP_PER_LEVEL  = 25;

// --- ad spawn config ---
const AD_MIN_DELAY_MS = 22000;
const AD_MAX_DELAY_MS = 48000;

const AD_LINES = [
  '🎰 YOU WON A POTATO!',
  '💎 Buy crypto NOW!',
  '🥔 Free WiFi — tap here!',
  '🤑 Earn $1000/day!',
  '💀 5 viruses detected!',
  '🍪 Cookie sale — 99% off!',
  '👽 Aliens hate this trick!',
  '🎁 Claim your free reward!',
  '🦷 Dentists fear this app!',
  '🦄 Hot singles in your radius!',
  '🔥 ONE WEIRD TIP YOU NEED!',
  '📞 Your aunt is calling.',
];

// --- speech lines (mood-based) ---
const SPEECH = {
  happy:  ['(♥‿♥)', 'vibes!', '*purr*', 'so full', 'wheeee'],
  ok:     ['hmm', 'ok', 'mid', '...', 'meh'],
  hungry: ['cookie?', '*tummy growls*', 'feed me', 'pls', 'starving'],
  bored:  ['so bored', 'do something', '*yawn*', 'entertain me'],
  ads:    ['UGH not again', 'close it!!', 'gross popup', 'tap the X', 'no thanks'],
};

// ====================================================
// PIXEL ART — Aura the cat
// ====================================================
// 20 wide x 26 tall, each char = one pixel. Rendered at SCALE px each.
const PALETTE = {
  '_': null,           // transparent
  'k': '#1a0f2e',      // outline / dark fur
  'h': '#5a3a82',      // fur shadow / stripes
  'H': '#b9a8e6',      // main fur (lavender)
  'g': '#7fff8a',      // collar accent (lime)
  's': '#ffc2d4',      // inner ear / nose pink
  'p': '#d49bb8',      // pink shadow
  'e': '#00e5ff',      // eye glow (cyan)
  'E': '#0099bb',      // eye shadow / pupil
  'm': '#ff7a90',      // mouth
  'd': '#2a0a3a',      // dark accent
  'D': '#7c5cff',      // violet accent
  'c': '#00e5ff',      // cyan collar bell
  'B': '#0a0a18',      // paw pads / boots
};

// Normal pose — sitting cat facing forward
const POSE_IDLE = [
  '__kk_________kk_____', //  0 ear tips
  '_kHHk_______kHHk____', //  1 ears
  '_kHsHk_____kHsHk____', //  2 ears with pink inside
  '_kHsHHkkkkkHHsHk____', //  3 ears merge into head
  '_kHHHHHHHHHHHHHHk___', //  4 top of head
  '__kHHHHHHHHHHHHHk___', //  5 head
  '__kHHeeHHHHHHeeHHk__', //  6 eyes
  '__kHHEEHHHHHHEEHHk__', //  7 eye shadow / pupil bottom
  '__kHHHHHHmmHHHHHHk__', //  8 nose
  '__kHhHHHHmmHHHHhHk__', //  9 whiskers + mouth
  '__kHHHHHHmmHHHHHHk__', // 10 mouth (overridden)
  '__kHHHHHHHHHHHHHHk__', // 11 chin (overridden)
  '___kHHHHHHHHHHHHk___', // 12 chin narrows
  '____kHHHHHHHHHHk____', // 13 neck
  '____kHHHHHHHHHHk____', // 14 chest
  '___kHHHHHcHHHHHHk___', // 15 collar with bell
  '__kHHHHHHHHHHHHHHk__', // 16 body
  '__kHHHHHHHHHHHHHHk__', // 17 body
  '__kHHHHHHHHHHHHHHk__', // 18 body
  '__kHHHHHHHHHHHHHHk__', // 19 body
  '__kHHHHHHHHHHHHHHk__', // 20 body
  '_kHHHHHHHHHHHHHHHHk_', // 21 body widens
  '_kHHHHHHHHHHHHHHHHk_', // 22 bottom of body
  '_kHHkkkHHHHHHkkkHHk_', // 23 paws gap
  '_kkBBkHHHHHHHHkBBkk_', // 24 paw pads
  '__kkk__________kkk__', // 25 toe edges
];

// Happy pose — eyes squint into ^ ^ shape, mouth widens into a smile
const POSE_HAPPY = POSE_IDLE.map((row, y) => {
  if (y === 6)  return '__kHHkkHHHHHHkkHHk__'; // closed-curve happy eyes
  if (y === 7)  return '__kHHHHHHHHHHHHHHk__'; // clear under eyes
  if (y === 10) return '__kHHHHmmmmmmHHHHk__'; // wide smile
  if (y === 11) return '__kHHHHHmmmmHHHHHk__'; // smile curve
  return row;
});

// Sad pose — eyes droop, mouth frowns
const POSE_SAD = POSE_IDLE.map((row, y) => {
  if (y === 6)  return '__kHHEEHHHHHHEEHHk__'; // dark heavy eyes
  if (y === 7)  return '__kHHeeHHHHHHeeHHk__'; // tears beneath
  if (y === 10) return '__kHHHHHmmmmHHHHHk__'; // wider mouth line
  if (y === 11) return '__kHHHmHHHHHHHHmHHk_'; // frown corners
  return row;
});

// Blink frame — eyes closed (replace eye rows with thin fur lines)
function blinkPose(base) {
  const out = base.slice();
  out[6] = '__kHHhhHHHHHHhhHHk__';
  out[7] = '__kHHHHHHHHHHHHHHk__';
  return out;
}

// ====================================================
// STATE
// ====================================================
function defaultState() {
  return {
    hunger: 75,
    fun: 80,
    vibes: 90,
    coins: 0,
    cookies: STARTING_COOKIES,
    level: 1,
    xp: 0,
    lastSave: Date.now(),
    totalFeeds: 0,
    totalPlays: 0,
    totalAdsClosed: 0,
  };
}

let state = defaultState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const p = JSON.parse(raw);
    return {
      hunger: clamp(Number(p.hunger), 0, 100, 75),
      fun:    clamp(Number(p.fun), 0, 100, 80),
      vibes:  clamp(Number(p.vibes), 0, 100, 90),
      coins:  Math.max(0, Math.floor(Number(p.coins) || 0)),
      cookies: Math.max(0, Math.floor(Number(p.cookies) || 0)),
      level:  Math.max(1, Math.floor(Number(p.level) || 1)),
      xp:     Math.max(0, Math.floor(Number(p.xp) || 0)),
      lastSave: Number(p.lastSave) || Date.now(),
      totalFeeds: Math.max(0, Math.floor(Number(p.totalFeeds) || 0)),
      totalPlays: Math.max(0, Math.floor(Number(p.totalPlays) || 0)),
      totalAdsClosed: Math.max(0, Math.floor(Number(p.totalAdsClosed) || 0)),
    };
  } catch (e) {
    return defaultState();
  }
}

function saveState() {
  state.lastSave = Date.now();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { /* ignore quota issues */ }
}

function clamp(n, lo, hi, fallback = lo) {
  if (!Number.isFinite(n)) return fallback;
  return Math.min(hi, Math.max(lo, n));
}

// ====================================================
// DOM refs
// ====================================================
let canvas, ctx, room, adLayer, speechEl;
let levelEl, coinsEl, cookiesEl;
let barFill = {}, barPct = {};
let actionBtns = {};
let resetBtn;
let activeAd = null;        // currently visible ad node
let nextAdTimer = null;
let lastPlayAt = 0, lastFeedAt = 0;
let speechTimer = null;

// ====================================================
// Render — character
// ====================================================
let bobPhase = 0;
let blinkUntil = 0;
let nextBlinkAt = 0;
let currentMood = 'ok';
let SCALE = 5; // pixel scale, recalc on resize

function resizeCanvas() {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width  = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  // Choose scale so 20px wide art fits with margin
  SCALE = Math.max(3, Math.floor(canvas.width / 24));
  ctx.imageSmoothingEnabled = false;
}

function pickPose() {
  // Mood from current stats; updated each render
  const avg = (state.hunger + state.fun + state.vibes) / 3;
  if (state.hunger < 25 || state.vibes < 20) return POSE_SAD;
  if (avg > 75) return POSE_HAPPY;
  return POSE_IDLE;
}

function moodKey() {
  if (state.hunger < 25) return 'hungry';
  if (state.fun < 25)    return 'bored';
  if (state.vibes < 25)  return 'ads';
  const avg = (state.hunger + state.fun + state.vibes) / 3;
  if (avg > 75) return 'happy';
  return 'ok';
}

function drawPose(pixels) {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const artW = 20 * SCALE;
  const artH = pixels.length * SCALE;
  const offX = Math.floor((canvas.width - artW) / 2);
  const bob = Math.sin(bobPhase) > 0 ? 1 : 0;
  const offY = Math.floor((canvas.height - artH) - 4) + bob * SCALE;

  // shadow oval under character
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  const shX = offX + artW / 2;
  const shY = offY + artH + SCALE;
  ctx.beginPath();
  ctx.ellipse(shX, shY, artW * 0.32, SCALE * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();

  for (let y = 0; y < pixels.length; y++) {
    const row = pixels[y];
    for (let x = 0; x < row.length; x++) {
      const color = PALETTE[row[x]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(offX + x * SCALE, offY + y * SCALE, SCALE, SCALE);
    }
  }
}

function renderCharacter(now) {
  bobPhase += 0.06;
  let pose = pickPose();
  if (now < blinkUntil) pose = blinkPose(pose);
  else if (now > nextBlinkAt) {
    blinkUntil = now + 110;
    nextBlinkAt = now + 2200 + Math.random() * 2500;
  }
  drawPose(pose);
}

// ====================================================
// Render — bars / HUD
// ====================================================
function renderHUD() {
  if (levelEl)   levelEl.textContent = state.level;
  if (coinsEl)   coinsEl.textContent = formatCoins(state.coins);
  if (cookiesEl) cookiesEl.textContent = '×' + state.cookies + ' cookies';

  setBar('hunger', state.hunger);
  setBar('fun',    state.fun);
  setBar('vibes',  state.vibes);
}

function setBar(stat, val) {
  const f = barFill[stat], p = barPct[stat];
  if (!f || !p) return;
  const v = Math.max(0, Math.min(100, val));
  f.style.height = v + '%';
  p.textContent = Math.round(v) + '%';
  f.classList.toggle('aura-bar__fill--low', v < 25);
}

function formatCoins(n) {
  if (n < 1000) return n.toString().padStart(3, '0');
  if (n < 1000000) return (n / 1000).toFixed(n < 10000 ? 1 : 0) + 'K';
  return (n / 1000000).toFixed(2) + 'M';
}

// ====================================================
// Speech bubble
// ====================================================
function say(text, ms = 1800) {
  if (!speechEl) return;
  speechEl.textContent = text;
  speechEl.hidden = false;
  speechEl.classList.remove('aura-speech--show');
  void speechEl.offsetWidth;
  speechEl.classList.add('aura-speech--show');
  clearTimeout(speechTimer);
  speechTimer = setTimeout(() => {
    speechEl.classList.remove('aura-speech--show');
    setTimeout(() => { if (speechEl) speechEl.hidden = true; }, 250);
  }, ms);
}

function moodSay() {
  const arr = SPEECH[moodKey()] || SPEECH.ok;
  say(arr[Math.floor(Math.random() * arr.length)]);
}

// ====================================================
// Actions
// ====================================================
function doFeed() {
  const now = performance.now();
  if (now - lastFeedAt < FEED_COOLDOWN_MS) return;
  if (state.cookies <= 0) { say('out of cookies!'); flash('feed', false); return; }
  lastFeedAt = now;
  state.cookies -= 1;
  state.hunger = Math.min(100, state.hunger + FEED_GAIN);
  state.coins  += FEED_COIN;
  state.totalFeeds += 1;
  awardXP(1);
  flash('feed', true);
  say('*munch*');
  renderHUD();
  saveState();
}

function doPlay() {
  const now = performance.now();
  if (now - lastPlayAt < PLAY_COOLDOWN_MS) return;
  lastPlayAt = now;
  state.fun = Math.min(100, state.fun + PLAY_GAIN);
  state.coins += PLAY_COIN;
  state.totalPlays += 1;
  awardXP(1);
  flash('play', true);
  say('wheee!');
  renderHUD();
  saveState();
}

function doShop() {
  if (state.coins < COOKIE_PRICE) {
    say('need ' + COOKIE_PRICE + ' coins');
    flash('shop', false);
    return;
  }
  state.coins -= COOKIE_PRICE;
  state.cookies += 1;
  flash('shop', true);
  say('+1 cookie');
  renderHUD();
  saveState();
}

function awardXP(amount) {
  state.xp += amount;
  while (state.xp >= XP_PER_LEVEL * state.level) {
    state.xp -= XP_PER_LEVEL * state.level;
    state.level += 1;
    say('LEVEL UP! 🎉', 2400);
  }
}

function flash(action, ok) {
  const btn = actionBtns[action];
  if (!btn) return;
  btn.classList.remove('aura-action--ok', 'aura-action--bad');
  void btn.offsetWidth;
  btn.classList.add(ok ? 'aura-action--ok' : 'aura-action--bad');
  setTimeout(() => {
    btn.classList.remove('aura-action--ok', 'aura-action--bad');
  }, 360);
}

// ====================================================
// Ad popups
// ====================================================
function scheduleNextAd() {
  clearTimeout(nextAdTimer);
  const delay = AD_MIN_DELAY_MS + Math.random() * (AD_MAX_DELAY_MS - AD_MIN_DELAY_MS);
  nextAdTimer = setTimeout(spawnAd, delay);
}

function spawnAd() {
  if (!adLayer || activeAd) {
    // already one up — try again later
    scheduleNextAd();
    return;
  }
  const ad = document.createElement('div');
  ad.className = 'aura-ad';
  const text = AD_LINES[Math.floor(Math.random() * AD_LINES.length)];
  ad.innerHTML = `
    <span class="aura-ad__bar">⚠ AD</span>
    <span class="aura-ad__text">${text}</span>
    <button class="aura-ad__close" type="button" aria-label="Close ad">×</button>
  `;
  // Random position within the room (relative to ad layer)
  const layerRect = adLayer.getBoundingClientRect();
  const adW = 180, adH = 64;
  const padX = 12, padY = 36;
  const maxX = Math.max(0, layerRect.width  - adW - padX * 2);
  const maxY = Math.max(0, layerRect.height - adH - padY * 2);
  ad.style.left = (padX + Math.random() * maxX) + 'px';
  ad.style.top  = (padY + Math.random() * maxY) + 'px';
  // Random tilt
  const tilt = (Math.random() * 8 - 4).toFixed(1);
  ad.style.setProperty('--tilt', tilt + 'deg');
  adLayer.appendChild(ad);
  activeAd = ad;
  // Hide after entry animation
  requestAnimationFrame(() => ad.classList.add('aura-ad--in'));

  ad.querySelector('.aura-ad__close').addEventListener('click', (e) => {
    e.stopPropagation();
    closeAd(ad, true);
  });
  // Clicking the ad itself does nothing useful (it's an ad)
  ad.addEventListener('click', () => say('tap the X →'));
  moodSay();
}

function closeAd(ad, byUser) {
  if (!ad) return;
  ad.classList.add('aura-ad--out');
  setTimeout(() => { if (ad.parentNode) ad.parentNode.removeChild(ad); }, 250);
  if (activeAd === ad) activeAd = null;
  if (byUser) {
    state.vibes = Math.min(100, state.vibes + AD_CLOSE_GAIN);
    state.coins += AD_COIN;
    state.totalAdsClosed += 1;
    awardXP(1);
    say('+' + AD_CLOSE_GAIN + ' vibes');
    renderHUD();
    saveState();
  }
  scheduleNextAd();
}

// ====================================================
// Tick — decay
// ====================================================
function tick(deltaSec) {
  state.hunger = Math.max(0, state.hunger - DECAY.hunger * deltaSec);
  state.fun    = Math.max(0, state.fun    - DECAY.fun    * deltaSec);
  let vDecay = DECAY.vibes;
  if (activeAd) vDecay += VIBES_AD_PENALTY;
  state.vibes  = Math.max(0, state.vibes  - vDecay * deltaSec);
  renderHUD();
}

// ====================================================
// Reset
// ====================================================
function resetGame() {
  if (!window.confirm('reset Aura back to nothing? her trauma stays though.')) return;
  state = defaultState();
  if (activeAd) closeAd(activeAd, false);
  renderHUD();
  saveState();
  say('rebooted.', 1500);
}

// ====================================================
// Boot
// ====================================================
export function initIdleAura() {
  canvas   = document.getElementById('aura-character');
  if (!canvas) return; // not on idle-aura page

  ctx      = canvas.getContext('2d');
  room     = document.getElementById('aura-room');
  adLayer  = document.getElementById('aura-ad-layer');
  speechEl = document.getElementById('aura-speech');
  levelEl  = document.getElementById('aura-level');
  coinsEl  = document.getElementById('aura-coins');
  cookiesEl= document.getElementById('aura-cookies');
  resetBtn = document.getElementById('aura-reset');

  ['hunger', 'fun', 'vibes'].forEach((s) => {
    barFill[s] = document.getElementById('bar-' + s + '-fill');
    barPct[s]  = document.getElementById('bar-' + s + '-pct');
  });

  document.querySelectorAll('[data-action]').forEach((btn) => {
    actionBtns[btn.dataset.action] = btn;
  });

  // Wire actions
  if (actionBtns.feed) actionBtns.feed.addEventListener('click', doFeed);
  if (actionBtns.play) actionBtns.play.addEventListener('click', doPlay);
  if (actionBtns.shop) actionBtns.shop.addEventListener('click', doShop);
  if (resetBtn) resetBtn.addEventListener('click', resetGame);

  // Load state and apply offline decay
  state = loadState();
  const now = Date.now();
  const offline = Math.min((now - state.lastSave) / 1000, OFFLINE_CAP_SEC);
  if (offline > 0) {
    state.hunger = Math.max(0, state.hunger - DECAY.hunger * offline);
    state.fun    = Math.max(0, state.fun    - DECAY.fun    * offline);
    state.vibes  = Math.max(0, state.vibes  - DECAY.vibes  * offline);
    if (offline > 30) {
      setTimeout(() => say('you left me for ' + Math.round(offline / 60) + ' min!', 2400), 600);
    }
  }
  state.lastSave = now;

  // Initial render
  resizeCanvas();
  renderHUD();

  // Render loop
  let lastTick = performance.now();
  function loop() {
    const t = performance.now();
    renderCharacter(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Stat decay tick
  setInterval(() => {
    tick(TICK_MS / 1000);
  }, TICK_MS);

  // Periodic save
  setInterval(saveState, SAVE_EVERY_MS);

  // Resize handling
  window.addEventListener('resize', resizeCanvas);

  // Schedule the first ad
  scheduleNextAd();

  // Save on hide/unload
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveState();
  });
  window.addEventListener('beforeunload', saveState);

  // Welcome message
  setTimeout(moodSay, 400);
}
