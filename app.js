// Talks only to our own /api/optimize. The Anthropic API is never called from the browser.
const MESSAGES = {
  loading: '[PLACEHOLDER status.loading: shown while the prompt is being improved]',
  empty_input: '[PLACEHOLDER error.empty_input: the user pressed the button with nothing pasted]',
  too_long: '[PLACEHOLDER error.too_long: the pasted prompt is over the 4,000 character limit]',
  rate_limited: '[PLACEHOLDER error.rate_limited: the user has made too many requests and should try again later]',
  network: '[PLACEHOLDER error.network: the request never reached the server]',
  generic: '[PLACEHOLDER error.generic: something went wrong on our side and the user can try again]',
};

const form = document.getElementById('form');
const input = document.getElementById('input');
const submit = document.getElementById('submit');
const statusEl = document.getElementById('status');
const result = document.getElementById('result');
const improved = document.getElementById('improved');
const changes = document.getElementById('changes');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  result.hidden = true;
  if (input.value.trim() === '') {
    statusEl.textContent = MESSAGES.empty_input;
    return;
  }
  statusEl.textContent = MESSAGES.loading;
  submit.disabled = true;
  try {
    const response = await fetch('/api/optimize', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: input.value }),
    });
    const data = await response.json();
    if (!data.ok) {
      statusEl.textContent = MESSAGES[data.error] || MESSAGES.generic;
      return;
    }
    improved.textContent = data.improved;
    changes.replaceChildren(...data.changes.map((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
    statusEl.textContent = '';
    result.hidden = false;
  } catch {
    statusEl.textContent = MESSAGES.network;
  } finally {
    submit.disabled = false;
  }
});
