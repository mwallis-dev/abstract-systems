import './lab.css';

const experiments = [
  { name: 'Menu', page: './index.html', updated: '2026-11-02', tag: 'Navigation' },
  { name: 'Location clock', page: './location.html', updated: '2026-10-20', tag: 'Time' },
  { name: 'Text', page: './profile.html', updated: '2026-11-03', tag: 'Typography' },
  { name: 'Fade-in animation', page: './fade-in.html', updated: '2026-11-03', tag: 'Motion' },
];

const list = document.querySelector('#experiment-list');
const frame = document.querySelector('#preview-frame');
const date = document.querySelector('#updated-date');
const category = document.querySelector('#category');
const tag = document.querySelector('#category-tag');
const dateFormat = new Intl.DateTimeFormat('en-IE', { dateStyle: 'long', timeZone: 'UTC' });

frame.addEventListener('load', () => {
  const preview = frame.contentDocument;
  if (!preview?.body) return;

  preview.documentElement.style.setProperty('background', 'white', 'important');
  preview.body.style.setProperty('background', 'white', 'important');

  const layout = preview.createElement('style');
  layout.textContent = `
    body {
      box-sizing: border-box;
      display: grid;
      place-content: start;
      padding-block-start: 100px;
      padding-inline-start: 100px;
    }

    @media (max-width: 40rem) {
      body {
        padding-block-start: 1rem;
        padding-inline-start: 1rem;
      }
    }

    :root body > main {
      min-height: 0;
      min-width: 0;
      margin: 0;
      padding: 0;
    }
  `;
  preview.head.append(layout);
});

function experimentPageKey(experiment) {
  return experiment.page.replace(/^\.\//, '');
}

function experimentFromLocation() {
  let key;
  try {
    key = decodeURIComponent(location.hash.slice(1));
  } catch (error) {
    if (error instanceof URIError) return null;
    throw error;
  }
  if (!key) return null;
  return experiments.find((item) => experimentPageKey(item) === key) ?? null;
}

function syncLocationHash(experiment) {
  const hash = `#${experimentPageKey(experiment)}`;
  if (location.hash !== hash) {
    history.replaceState(null, '', hash);
  }
}

function selectExperiment(experiment, button) {
  const current = list.querySelector('[aria-current="true"]');
  if (current === button) return;

  current?.removeAttribute('aria-current');
  button.setAttribute('aria-current', 'true');
  frame.title = `${experiment.name} live preview`;
  frame.src = experiment.page;
  date.dateTime = experiment.updated;
  date.textContent = dateFormat.format(new Date(experiment.updated));
  category.hidden = !experiment.tag;
  tag.textContent = experiment.tag ?? '';
  syncLocationHash(experiment);
}

for (const experiment of experiments) {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = experiment.name;
  button.addEventListener('click', () => selectExperiment(experiment, button));
  item.append(button);
  list.append(item);
}

const buttons = [...list.querySelectorAll('button')];
const initial =
  experimentFromLocation() ??
  experiments[0];
const initialIndex = experiments.indexOf(initial);
selectExperiment(initial, buttons[initialIndex]);

window.addEventListener('hashchange', () => {
  const experiment = experimentFromLocation();
  if (!experiment) return;
  const index = experiments.indexOf(experiment);
  selectExperiment(experiment, buttons[index]);
});
