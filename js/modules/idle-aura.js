// Mini Idle Aura — a useless idle/incremental game.
// You tap an orb, generate aura, buy weird generators, watch numbers grow.
// All progress saves to localStorage. Offline gain is capped (no exploits).

const STORAGE_KEY = 'useless-idle-aura-v1';
const SAVE_INTERVAL_MS = 5000;
const TICK_INTERVAL_MS = 100;     // 10 ticks/sec for smooth numbers
const OFFLINE_CAP_SECONDS = 4 * 60 * 60; // 4 hours max offline gain
const COST_SCALE = 1.15;

// Generator definitions. Each generator can be bought many times; cost grows
// by COST_SCALE per purchase. Rate is "aura per second" each unit produces.
const GENERATORS = [
  { id: 'moon',  icon: '🌙',  name: 'Moonbeam Whisper', baseCost: 5,        rate: 0.1 },
  { id: 'crys',  icon: '🔮',  name: 'Crystal Hum',      baseCost: 50,       rate: 1 },
  { id: 'cat',   icon: '🐈',  name: 'Mystic Cat Purr',  baseCost: 500,      rate: 8 },
  { id: 'slime', icon: '🌌',  name: 'Cosmic Slime',     baseCost: 5000,     rate: 45 },
  { id: 'spud',  icon: '🥔',  name: 'Sentient Potato',  baseCost: 50000,    rate: 250 },
  { id: 'tach',  icon: '⚡',  name: 'Tachyon Ripple',   baseCost: 500000,   rate: 1400 },
  { id: 'hole',  icon: '🕳️',  name: 'Black Hole',       baseCost: 5000000,  rate: 8000 },
  { id: 'brain', icon: '🧠',  name: 'Galaxy Brain',     baseCost: 50000000, rate: 50000 },
];

// Tap upgrades are one-time purchases that multiply your per-tap aura.
const TAP_UPGRADES = [
  { id: 'finger', icon: '🤏', name: 'Sharper Fingertip', cost: 100,     mult: 2 },
  { id: 'lazer',  icon: '🔦', name: 'Lazer Tap',         cost: 5000,    mult: 5 },
  { id: 'thumb',  icon: '👍', name: 'Cosmic Thumb',      cost: 500000,  mult: 4 },
];

// ----- state -----
let state = {
  aura: 0,
  totalEarned: 0,
  totalTaps: 0,
  gens: {},   // id -> count
  taps: {},   // id -> true if owned
  lastSave: Date.now(),
};

// ----- helpers -----
function defaultState() {
  return {
    aura: 0,
    totalEarned: 0,
    totalTaps: 0,
    gens: {},
    taps: {},
    lastSave: Date.now(),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      aura: Number(parsed.aura) || 0,
      totalEarned: Number(parsed.totalEarned) || 0,
      totalTaps: Number(parsed.totalTaps) || 0,
      gens: parsed.gens && typeof parsed.gens === 'object' ? parsed.gens : {},
      taps: parsed.taps && typeof parsed.taps === 'object' ? parsed.taps : {},
      lastSave: Number(parsed.lastSave) || Date.now(),
    };
  } catch (e) {
    return defaultState();
  }
}

function save() {
  state.lastSave = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* quota / privacy mode — ignore */ }
}

function genCost(g) {
  const owned = state.gens[g.id] || 0;
  return Math.ceil(g.baseCost * Math.pow(COST_SCALE, owned));
}

function totalRate() {
  let r = 0;
  for (const g of GENERATORS) {
    const owned = state.gens[g.id] || 0;
    r += owned * g.rate;
  }
  return r;
}

function tapPower() {
  let p = 1;
  for (const u of TAP_UPGRADES) {
    if (state.taps[u.id]) p *= u.mult;
  }
  return p;
}

// Pretty number formatter: 1.2K, 4.5M, 1.23B, etc.
function fmt(n) {
  if (!isFinite(n)) return '∞';
  if (n < 1000) {
    if (n < 10) return n.toFixed(2);
    if (n < 100) return n.toFixed(1);
    return Math.floor(n).toString();
  }
  const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  let u = -1;
  let val = n;
  while (val >= 1000 && u < units.length - 1) {
    val /= 1000;
    u++;
  }
  return val.toFixed(2) + units[u];
}

function fmtRate(n) {
  if (n < 10) return n.toFixed(1);
  return fmt(n);
}

// ----- rendering -----
let totalEl, rateEl, tapEl, orbEl, popLayer, genShop, tapShop, resetBtn, savedHint;

function renderStats() {
  totalEl.textContent = fmt(state.aura);
  rateEl.textContent = fmtRate(totalRate());
  tapEl.textContent = '+' + fmt(tapPower());
}

function buildShop() {
  // Generators
  genShop.innerHTML = '';
  for (const g of GENERATORS) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'aura-item';
    item.dataset.kind = 'gen';
    item.dataset.id = g.id;
    item.innerHTML = `
      <span class="aura-item__icon">${g.icon}</span>
      <span class="aura-item__body">
        <span class="aura-item__name">${g.name}</span>
        <span class="aura-item__rate">+${fmtRate(g.rate)} /sec each</span>
      </span>
      <span class="aura-item__meta">
        <span class="aura-item__count" data-count>×0</span>
        <span class="aura-item__cost" data-cost>${fmt(g.baseCost)}</span>
      </span>
    `;
    item.addEventListener('click', () => buyGen(g.id));
    genShop.appendChild(item);
  }

  // Tap upgrades
  tapShop.innerHTML = '';
  for (const u of TAP_UPGRADES) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'aura-item';
    item.dataset.kind = 'tap';
    item.dataset.id = u.id;
    item.innerHTML = `
      <span class="aura-item__icon">${u.icon}</span>
      <span class="aura-item__body">
        <span class="aura-item__name">${u.name}</span>
        <span class="aura-item__rate">×${u.mult} tap power</span>
      </span>
      <span class="aura-item__meta">
        <span class="aura-item__count" data-count>—</span>
        <span class="aura-item__cost" data-cost>${fmt(u.cost)}</span>
      </span>
    `;
    item.addEventListener('click', () => buyTap(u.id));
    tapShop.appendChild(item);
  }
}

function refreshShop() {
  // Update each generator card affordability + cost + count
  for (const g of GENERATORS) {
    const node = genShop.querySelector(`[data-id="${g.id}"]`);
    if (!node) continue;
    const cost = genCost(g);
    const owned = state.gens[g.id] || 0;
    node.querySelector('[data-cost]').textContent = fmt(cost);
    node.querySelector('[data-count]').textContent = '×' + owned;
    node.classList.toggle('aura-item--locked', state.aura < cost);
  }
  // Update tap upgrades
  for (const u of TAP_UPGRADES) {
    const node = tapShop.querySelector(`[data-id="${u.id}"]`);
    if (!node) continue;
    const owned = !!state.taps[u.id];
    node.classList.toggle('aura-item--bought', owned);
    node.classList.toggle('aura-item--locked', !owned && state.aura < u.cost);
    node.querySelector('[data-count]').textContent = owned ? 'owned' : '—';
    if (owned) node.querySelector('[data-cost]').textContent = '✓';
  }
}

// ----- actions -----
function buyGen(id) {
  const g = GENERATORS.find(x => x.id === id);
  if (!g) return;
  const cost = genCost(g);
  if (state.aura < cost) {
    flashLocked(genShop.querySelector(`[data-id="${id}"]`));
    return;
  }
  state.aura -= cost;
  state.gens[id] = (state.gens[id] || 0) + 1;
  renderStats();
  refreshShop();
  save();
}

function buyTap(id) {
  const u = TAP_UPGRADES.find(x => x.id === id);
  if (!u) return;
  if (state.taps[id]) return;
  if (state.aura < u.cost) {
    flashLocked(tapShop.querySelector(`[data-id="${id}"]`));
    return;
  }
  state.aura -= u.cost;
  state.taps[id] = true;
  renderStats();
  refreshShop();
  save();
}

function flashLocked(node) {
  if (!node) return;
  node.classList.remove('aura-item--shake');
  void node.offsetWidth;
  node.classList.add('aura-item--shake');
}

function spawnPop(x, y, amount) {
  if (!popLayer) return;
  const pop = document.createElement('span');
  pop.className = 'aura-pop';
  pop.textContent = '+' + fmt(amount);
  // Random horizontal jitter so multiple pops fan out
  const jitter = (Math.random() - 0.5) * 30;
  pop.style.left = (x + jitter) + 'px';
  pop.style.top = y + 'px';
  popLayer.appendChild(pop);
  // Cleanup after animation
  setTimeout(() => pop.remove(), 1100);
}

function handleTap(ev) {
  const power = tapPower();
  state.aura += power;
  state.totalEarned += power;
  state.totalTaps += 1;
  renderStats();
  refreshShop();

  // Pop animation positioned relative to the orb wrap
  const wrap = popLayer.parentElement;
  const rect = wrap.getBoundingClientRect();
  const x = (ev.clientX || (rect.left + rect.width / 2)) - rect.left;
  const y = (ev.clientY || (rect.top + rect.height / 2)) - rect.top;
  spawnPop(x, y, power);

  // Orb pulse
  orbEl.classList.remove('aura-orb--pulse');
  void orbEl.offsetWidth;
  orbEl.classList.add('aura-orb--pulse');
}

function tick() {
  const gained = totalRate() * (TICK_INTERVAL_MS / 1000);
  if (gained > 0) {
    state.aura += gained;
    state.totalEarned += gained;
    renderStats();
    refreshShop();
  }
}

function resetGame() {
  const ok = window.confirm('really reset your aura? all progress will vanish into the void.');
  if (!ok) return;
  state = defaultState();
  save();
  renderStats();
  refreshShop();
  if (savedHint) {
    savedHint.textContent = 'wiped. back to nothing.';
    setTimeout(() => { savedHint.textContent = 'auto-saves to your browser'; }, 2500);
  }
}

// ----- bootstrap -----
export function initIdleAura() {
  totalEl = document.getElementById('aura-total');
  rateEl = document.getElementById('aura-rate');
  tapEl = document.getElementById('aura-tap');
  orbEl = document.getElementById('aura-orb');
  popLayer = document.getElementById('aura-pop-layer');
  genShop = document.getElementById('aura-generators');
  tapShop = document.getElementById('aura-tap-upgrades');
  resetBtn = document.getElementById('aura-reset');
  savedHint = document.getElementById('aura-saved');

  // No-op if not on the idle-aura page.
  if (!orbEl || !genShop || !tapShop) return;

  // Load saved state and grant offline gain.
  state = load();
  const now = Date.now();
  const offlineSec = Math.min((now - state.lastSave) / 1000, OFFLINE_CAP_SECONDS);
  const offlineGain = totalRate() * Math.max(offlineSec, 0);
  if (offlineGain > 0) {
    state.aura += offlineGain;
    state.totalEarned += offlineGain;
    // Tiny welcome-back message via the saved hint
    setTimeout(() => {
      if (savedHint) {
        savedHint.textContent = `welcome back — you idled +${fmt(offlineGain)} aura`;
        setTimeout(() => { savedHint.textContent = 'auto-saves to your browser'; }, 4500);
      }
    }, 200);
  }
  state.lastSave = now;

  buildShop();
  renderStats();
  refreshShop();

  orbEl.addEventListener('click', handleTap);
  resetBtn.addEventListener('click', resetGame);

  // Game loop
  setInterval(tick, TICK_INTERVAL_MS);
  setInterval(save, SAVE_INTERVAL_MS);

  // Save when the user navigates away or hides the tab
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') save();
  });
  window.addEventListener('beforeunload', save);
}
