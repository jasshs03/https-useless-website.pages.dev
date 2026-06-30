// Decorative fake "live visitor map".
// SVG viewBox is 1000x500 (equirectangular, lng -180..180 = x 0..1000,
// lat 90..-90 = y 0..500). Continent silhouette is baked into the HTML.

// Each city: [name, code, lat, lng, dx, dy, anchor]
// dx/dy is the label offset from the dot; anchor is text-anchor.
const FAKE_CITIES = [
  ['Manila',       'PH',  14.6,  121,   8,  4, 'start'],
  ['Tokyo',        'JP',  35.7,  140,   8,  4, 'start'],
  ['Seoul',        'KR',  37.6,  127,  -8,  4, 'end'  ],
  ['New York',     'US',  40.7, -74,    8,  4, 'start'],
  ['Toronto',      'CA',  43.7, -79,   -8, -6, 'end'  ],
  ['Vancouver',    'CA',  49.3, -123,   8,  4, 'start'],
  ['Mexico City',  'MX',  19.4, -99,   -8,  4, 'end'  ],
  ['São Paulo',    'BR', -23.6, -46.6,  8,  4, 'start'],
  ['Buenos Aires', 'AR', -34.6, -58.4,  8, 14, 'start'],
  ['London',       'UK',  51.5,  -0.1, -8, -6, 'end'  ],
  ['Paris',        'FR',  48.9,   2.4,  8, 12, 'start'],
  ['Berlin',       'DE',  52.5,  13.4,  8,  4, 'start'],
  ['Reykjavík',    'IS',  64.1, -21.9,  8, -6, 'start'],
  ['Cairo',        'EG',  30.0,  31.2,  8,  4, 'start'],
  ['Lagos',        'NG',   6.5,   3.4, -8,  4, 'end'  ],
  ['Cape Town',    'ZA', -33.9,  18.4,  8,  4, 'start'],
  ['Mumbai',       'IN',  19.0,  72.8, -8,  4, 'end'  ],
  ['Sydney',       'AU', -33.9, 151.2, -8,  4, 'end'  ],
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
  const vb = (map.getAttribute('viewBox') || '0 0 1000 500').split(/\s+/).map(Number);
  const w = vb[2] || 1000;
  const h = vb[3] || 500;

  const ns = 'http://www.w3.org/2000/svg';

  // The continents are pre-baked in the HTML inside a <g id="continents">.
  // Visitor dots all live in a <g id="dots"> so they sit on top of continents.
  const dotsLayer = map.querySelector('#dots') || map;

  function makeDot(city, isNew = false) {
    const [name, code, lat, lng, dx = 8, dy = 4, anchor = 'start'] = city;
    const [cx, cy] = toXY(lat, lng, w, h);

    const g = document.createElementNS(ns, 'g');
    g.setAttribute('transform', `translate(${cx} ${cy})`);
    if (isNew) g.setAttribute('class', 'dot-new');

    const pulse = document.createElementNS(ns, 'circle');
    pulse.setAttribute('r', '3');
    pulse.setAttribute('class', 'dot-pulse');

    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('r', '3');
    dot.setAttribute('class', 'dot');

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', String(dx));
    label.setAttribute('y', String(dy));
    label.setAttribute('text-anchor', anchor);
    label.setAttribute('class', 'dot-label');
    label.textContent = `${name} (${code})`;

    g.append(pulse, dot, label);
    return g;
  }

  // Lay out the permanent set
  FAKE_CITIES.forEach(c => dotsLayer.appendChild(makeDot(c)));

  // Occasionally spawn a short-lived "incoming visitor" dot in a random spot
  setInterval(() => {
    // Bias toward populated latitudes so dots usually land on/near land
    const lat = (Math.random() * 120) - 50;   // -50..70
    const lng = (Math.random() * 360) - 180;
    const anchor = lng > 120 ? 'end' : 'start';
    const dx = anchor === 'end' ? -8 : 8;
    const visitor = makeDot(['visitor', '??', lat, lng, dx, 4, anchor], true);
    dotsLayer.appendChild(visitor);
    setTimeout(() => visitor.remove(), 5000);
  }, 1800);
}
