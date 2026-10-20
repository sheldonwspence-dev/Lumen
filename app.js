// Talks only to our own /api/optimize. The Anthropic API is never called from the browser.
const MESSAGES = {
  loading: 'Optimizing...',
  empty_input: '[PLACEHOLDER error.empty_input: the user pressed the button with nothing pasted]',
  too_long: '[PLACEHOLDER error.too_long: the pasted prompt is over the 4,000 character limit]',
  rate_limited: '[PLACEHOLDER error.rate_limited: the user has made too many requests and should try again later]',
  network: '[PLACEHOLDER error.network: the request never reached the server]',
  generic: '[PLACEHOLDER error.generic: something went wrong on our side and the user can try again]',
};

// The prototype's "before" prompt for each task. Shown in the box by "Try an example";
// never sent to the model on their own (see prompts/optimizer.md).
const EXAMPLES = {
  grant: 'write me a grant proposal',
  donor: 'write a thank you to a donor',
  volunteer: 'help me find volunteers',
};

const form = document.getElementById('form');
const input = document.getElementById('input');
const submit = document.getElementById('submit');
const statusEl = document.getElementById('status');
const result = document.getElementById('result');
const improved = document.getElementById('improved');
const changes = document.getElementById('changes');
const before = document.getElementById('before');
const taskButtons = document.querySelectorAll('.task');
let task = 'grant';

taskButtons.forEach((button) => {
  button.addEventListener('click', () => {
    task = button.dataset.task;
    taskButtons.forEach((b) => {
      b.classList.toggle('selected', b === button);
      b.setAttribute('aria-checked', String(b === button));
    });
  });
});

document.getElementById('example').addEventListener('click', () => {
  input.value = EXAMPLES[task];
  input.focus();
});

// Wraps each highlight phrase in <mark>. Built with DOM nodes, never innerHTML.
function renderHighlighted(el, text, phrases) {
  let parts = [text];
  for (const phrase of phrases) {
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return [part];
      const at = part.indexOf(phrase);
      if (at === -1) return [part];
      const mark = document.createElement('mark');
      mark.textContent = phrase;
      return [part.slice(0, at), mark, part.slice(at + phrase.length)];
    });
  }
  el.replaceChildren(...parts.filter((p) => p !== ''));
}

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
      body: JSON.stringify({ input: input.value, task }),
    });
    const data = await response.json();
    if (!data.ok) {
      statusEl.textContent = MESSAGES[data.error] || MESSAGES.generic;
      return;
    }
    before.textContent = input.value;
    renderHighlighted(improved, data.improved, data.highlights);
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
