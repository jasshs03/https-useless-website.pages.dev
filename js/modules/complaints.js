const RESPONSES = [
  'noted. forwarded to /dev/null.',
  'thank you. your complaint has been ignored efficiently.',
  'mhm. and?',
  'we have escalated this to nobody. expected response time: never.',
  'have you tried turning your feelings off and on again?',
  'complaint received. complaint discarded.',
  'we hear you. we just do not care.',
  'this complaint was reviewed by 0 (zero) humans.',
  'thoughts and prayers (not really).',
  'your feedback is incredibly valuable to us. (it is not.)',
  'we have logged this in a notebook we then set on fire.',
  'okay 👍',
];

export function initComplaints() {
  const form = document.getElementById('complaint-form');
  const input = document.getElementById('complaint-input');
  const out = document.getElementById('complaint-out');
  const countEl = document.getElementById('complaint-count');
  if (!form || !input || !out) return;

  let count = 0;
  let last = -1;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;

    let i = Math.floor(Math.random() * RESPONSES.length);
    if (i === last) i = (i + 1) % RESPONSES.length;
    last = i;

    count++;
    if (countEl) countEl.textContent = count;
    out.textContent = '› ' + RESPONSES[i];
    out.classList.remove('flash');
    void out.offsetWidth;
    out.classList.add('flash');
    input.value = '';
    input.focus();
  });
}
