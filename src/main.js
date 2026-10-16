import './style.css';

const menu = document.querySelector('.menu');
const items = [...menu.querySelectorAll('.menu__item')];
const pill = menu.querySelector('.menu__pill');
let selected = items[0];

// Versioned, immutable starting point: reset never overwrites this baseline.
const baseline = Object.freeze({ treatment: 'raised', radius: 999, spacing: 100, duration: 340 });
const storageKey = 'abstract-systems-menu-experiment-v1';
const form = document.querySelector('#menu-config');
const status = document.querySelector('#config-status');
const radiusOptions = [0, 4, 8, 12, 16, 999];
function normalizeConfig(value) {
  const candidate = value && typeof value === 'object' ? value : {};
  return {
    treatment: ['raised', 'flat', 'outline', 'inset'].includes(candidate.treatment) ? candidate.treatment : baseline.treatment,
    radius: radiusOptions.includes(candidate.radius) ? candidate.radius : baseline.radius,
    spacing: Number.isFinite(candidate.spacing) && candidate.spacing >= 50 && candidate.spacing <= 175 && candidate.spacing % 5 === 0 ? candidate.spacing : baseline.spacing,
    duration: Number.isFinite(candidate.duration) && candidate.duration >= 0 && candidate.duration <= 1000 && candidate.duration % 10 === 0 ? candidate.duration : baseline.duration,
  };
}
let config = baseline;
try {
  config = normalizeConfig(JSON.parse(localStorage.getItem(storageKey)));
} catch {
  status.textContent = 'Saved settings could not be read. Showing the baseline.';
}
menu.dataset.treatment = config.treatment;
menu.style.setProperty('--menu-radius', `${config.radius}px`);
menu.style.setProperty('--menu-spacing', config.spacing / 100);
menu.style.setProperty('--menu-duration', `${config.duration}ms`);
for (const [name, value] of Object.entries(config)) form.elements.namedItem(name).value = value;
const isBaseline = Object.keys(baseline).every(name => config[name] === baseline[name]);
if (!status.textContent) status.textContent = isBaseline ? 'Baseline settings applied.' : 'Saved experiment applied.';
form.addEventListener('input', () => { status.textContent = 'Unapplied changes. Press Return to apply and reload.'; });
form.addEventListener('change', () => { status.textContent = 'Unapplied changes. Press Return to apply and reload.'; });
function saveAndReload(value) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
    location.reload();
  } catch {
    status.textContent = 'Settings could not be saved. Allow browser storage, then try again.';
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const values = new FormData(form);
  saveAndReload(normalizeConfig({
    treatment: values.get('treatment'),
    radius: Number(values.get('radius')),
    spacing: Number(values.get('spacing')),
    duration: Number(values.get('duration')),
  }));
});
document.querySelector('#reset-config').addEventListener('click', () => saveAndReload(baseline));
document.addEventListener('keydown', event => {
  if (event.key !== 'Enter' || event.isComposing || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  // Keep native button activation, especially Reset, intact.
  if (event.target.closest('.config-actions button')) return;
  event.preventDefault();
  form.requestSubmit();
});

function positionPill() {
  // Keep one shared pill in the layout, including during interrupted transitions.
  const scale = parseFloat(getComputedStyle(selected).fontSize) / 14;
  pill.style.transform = `translateX(${selected.offsetLeft - 1.35 * scale}px)`;
  pill.style.width = `${selected.getBoundingClientRect().width + 4.7 * scale}px`;
}

function selectItem(item) {
  selected = item;
  for (const button of items) {
    button.setAttribute('aria-pressed', String(button === item));
  }
  positionPill();
}

for (const item of items) {
  item.addEventListener('click', () => selectItem(item));
  item.addEventListener('keydown', (event) => {
    const index = items.indexOf(item);
    let target;
    if (event.key === 'ArrowRight') target = items[(index + 1) % items.length];
    if (event.key === 'ArrowLeft') target = items[(index - 1 + items.length) % items.length];
    if (event.key === 'Home') target = items[0];
    if (event.key === 'End') target = items.at(-1);
    if (!target) return;
    event.preventDefault();
    target.focus();
    selectItem(target);
  });
}

positionPill();
// Wait for the actual font before enabling motion: no animated font-load jump.
document.fonts.ready.then(() => {
  positionPill();
  requestAnimationFrame(() => menu.classList.add('menu--ready'));
});
new ResizeObserver(positionPill).observe(menu);
