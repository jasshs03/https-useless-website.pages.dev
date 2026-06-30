// A fake search engine. Always returns "no results, here's a cat".
const CATS = ['🐱','😺','😸','😹','😻','🙀','😼','😽','🐈','🐈‍⬛'];

const SNARK = [
  'searched the entire internet. found nothing.',
  'we looked everywhere. even under the couch.',
  'no results. have you tried not searching for this?',
  '0 results in 0.42 seconds. impressive.',
  'asked the cat. cat said no.',
  'this query has been forwarded to a stranger named Greg.',
];

export function initFakeSearch() {
  const form = document.getElementById('fake-search-form');
  const input = document.getElementById('fake-search-input');
  const out = document.getElementById('fake-search-results');
  if (!form || !input || !out) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    const cat = CATS[Math.floor(Math.random() * CATS.length)];
    const snark = SNARK[Math.floor(Math.random() * SNARK.length)];

    // Sanitize the query for display (textContent, not innerHTML)
    out.innerHTML = '';
    const heading = document.createElement('div');
    heading.className = 'fake-search-heading';
    heading.textContent = `0 results for "${q}"`;

    const note = document.createElement('p');
    note.className = 'fake-search-note';
    note.textContent = snark;

    const big = document.createElement('div');
    big.className = 'fake-search-cat';
    big.textContent = cat;

    out.append(heading, note, big);
  });
}
