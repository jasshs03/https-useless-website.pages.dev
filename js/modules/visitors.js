// Completely fake decorative "live visitor map".
// Generates random dots with city labels. Pure vibes.
const FAKE_CITIES = [
  ['Manila',       'PH',  14, 121],
  ['Tokyo',        'JP',  36, 140],
  ['New York',     'US',  41, -74],
  ['London',       'UK',  52,  -1],
  ['Paris',        'FR',  49,   2],
  ['Berlin',       'DE',  53,  13],
  ['São Paulo',    'BR', -24, -47],
  ['Mexico City',  'MX',  19, -99],
  ['Sydney',       'AU', -34, 151],
  ['Lagos',        'NG',   6,   3],
  ['Cairo',        'EG',  30,  31],
  ['Mumbai',       'IN',  19,  73],
  ['Seoul',        'KR',  38, 127],
  ['Toronto',      'CA',  44, -79],
  ['Vancouver',    'CA',  49, -123],
  ['Cape Town',    'ZA', -34,  18],
  ['Buenos Aires', 'AR', -35, -58],
  ['Reykjavík',    'IS',  64, -22],
];

// Equirectangular projection helpers
function toXY(lat, lng, w, h) {
  const x = ((lng + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return [x, y];
}

export function initVisitorsMap() {
  const map = document.getElementById('visitor-map');
  if (!map) return;

  // Use the SVG's viewBox so coords are independent of how it's scaled on screen
  const vb = (map.getAttribute('viewBox') || '0 0 800 400').split(/\s+/).map(Number);
  const w = vb[2] || 800;
  const h = vb[3] || 400;

  const ns = 'http://www.w3.org/2000/svg';
  function makeDot(city) {
    const [name, code, lat, lng] = city;
    const [cx, cy] = toXY(lat, lng, w, h);

    const g = document.createElementNS(ns, 'g');
    g.setAttribute('transform', `translate(${cx} ${cy})`);

    const pulse = document.createElementNS(ns, 'circle');
    pulse.setAttribute('r', '3');
    pulse.setAttribute('class', 'dot-pulse');

    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('r', '3');
    dot.setAttribute('class', 'dot');

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', '6');
    label.setAttribute('y', '4');
    label.setAttribute('class', 'dot-label');
    label.textContent = `${name} (${code})`;

    g.append(pulse, dot, label);
    return g;
  }

  // Lay out a permanent set
  FAKE_CITIES.forEach(c => map.appendChild(makeDot(c)));

  // Occasionally make a brand-new short-lived "incoming visitor" dot
  setInterval(() => {
    const lat = (Math.random() * 140) - 60;
    const lng = (Math.random() * 360) - 180;
    const dot = makeDot([`visitor`, '??', lat, lng]);
    dot.classList.add('dot-new');
    map.appendChild(dot);
    setTimeout(() => dot.remove(), 5000);
  }, 1800);
}
