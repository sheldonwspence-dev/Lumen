// Talks only to our own /api/optimize. The Anthropic API is never called from the browser.
const MESSAGES = {
  loading: 'Optimizing...',
  empty_input: 'No prompt yet! Please type in something.',
  too_long: 'Character limit reached, try shortening a bit.',
  rate_limited: 'Too much use, come back in a few minutes.',
  network: 'Internet down.',
  generic: 'Unknown error.',
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
const exampleButton = document.getElementById('example');
const taskButtons = document.querySelectorAll('.task');
let task = 'grant';

taskButtons.forEach((button) => {
  button.addEventListener('click', () => {
    task = button.dataset.task;
    // "Anything else" has no example prompt, so the example button is hidden for it.
    exampleButton.hidden = !(task in EXAMPLES);
    taskButtons.forEach((b) => {
      b.classList.toggle('selected', b === button);
      b.setAttribute('aria-checked', String(b === button));
    });
  });
});

const copyButton = document.getElementById('copy');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(improved.textContent);
  } catch {
    return; // clipboard blocked; leave the label alone rather than claim it copied
  }
  copyButton.textContent = 'Copied';
  setTimeout(() => { copyButton.textContent = 'Copy'; }, 1500);
});

exampleButton.addEventListener('click', () => {
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
  // No maxlength on the textarea: it would silently cut a long paste, so this message could never show.
  if (input.value.length > 4000) {
    statusEl.textContent = MESSAGES.too_long;
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
