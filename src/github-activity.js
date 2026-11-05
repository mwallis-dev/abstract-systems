import settings from '../lab/config/github-activity.json';
import { applyActivitySettings } from './github-activity-settings.js';
import { fetchContributions } from './github-activity-data.js';

applyActivitySettings(document.documentElement, settings);

if (import.meta.hot) {
  import.meta.hot.accept('../lab/config/github-activity.json', (updated) => {
    if (updated) applyActivitySettings(document.documentElement, updated.default);
  });
}

const strip = document.querySelector('.activity-strip');
const days = document.querySelector('.activity-days');
const total = document.querySelector('.activity-total');
const detail = document.querySelector('.activity-detail');
const detailText = document.createElement('span');
detail.append(detailText);

const narrow = window.matchMedia('(max-width: 24rem)');
const shortDate = new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fullDate = new Intl.DateTimeFormat('en-IE', { dateStyle: 'long', timeZone: 'UTC' });
const retry = document.querySelector('.activity-retry');
function contributions(count) {
  return `${count} ${count === 1 ? 'contribution' : 'contributions'}`;
}

let hovered;
let focused;
let tapped;
let selected;

function positionDetail() {
  if (!selected) return;

  const bounds = strip.getBoundingClientRect();
  const tile = selected.getBoundingClientRect();
  const width = detail.offsetWidth;
  const center = tile.left - bounds.left + tile.width / 2;
  detail.style.left = `${Math.max(0, Math.min(center - width / 2, bounds.width - width))}px`;
}

function updateDetail() {
  selected?.removeAttribute('data-selected');
  selected = narrow.matches ? null : hovered ?? focused ?? tapped;
  strip.toggleAttribute('data-hover', Boolean(hovered && selected === hovered));
  detail.hidden = !selected;
  if (!selected) return;

  selected.setAttribute('data-selected', '');
  detailText.textContent = selected.dataset.detail;
  positionDetail();
}

function renderDays(activity) {
  dismissDetail();
  days.replaceChildren();
  for (const [index, day] of activity.entries()) {
    const { count } = day;
    const isToday = index === activity.length - 1;
    const date = new Date(`${day.date}T00:00:00Z`);
    const countLabel = contributions(count);

    const item = document.createElement('li');
    item.className = 'activity-day';
    item.style.setProperty('--day-index', String(index));
    item.dataset.level = String([0, 2, 5, 8].filter((threshold) => count > threshold).length);

    const label = `${isToday ? 'Today, ' : ''}${fullDate.format(date)}, ${countLabel}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.dataset.detail = `${shortDate.format(date)}: ${countLabel}`;

    const text = document.createElement('span');
    text.className = 'activity-day-text';
    text.textContent = label;

    button.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      hovered = button;
      updateDetail();
    });
    button.addEventListener('focus', () => {
      if (!button.matches(':focus-visible')) return;
      hovered = null;
      focused = button;
      updateDetail();
    });
    button.addEventListener('blur', () => {
      if (focused === button) focused = null;
      updateDetail();
    });
    button.addEventListener('click', (event) => {
      if (event.pointerType === 'mouse') return;
      if (event.detail === 0) {
        focused = button;
      } else {
        hovered = null;
        tapped = tapped === button ? null : button;
      }
      updateDetail();
    });

    item.append(button, text);
    days.append(item);
  }

  days.style.setProperty('--day-last-index', String(activity.length - 1));
  days.dataset.enterPower = String(settings.enterPower ?? 2);
  days.setAttribute('data-enter', '');
}

strip.addEventListener('pointerleave', (event) => {
  if (event.pointerType !== 'mouse') return;
  hovered = null;
  updateDetail();
});

function dismissDetail() {
  hovered = focused = tapped = null;
  updateDetail();
}

document.addEventListener('pointerdown', (event) => {
  if (!strip.contains(event.target)) dismissDetail();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') dismissDetail();
});

narrow.addEventListener('change', dismissDetail);
new ResizeObserver(positionDetail).observe(strip);

async function loadActivity() {
  retry.hidden = true;
  days.setAttribute('aria-busy', 'true');
  total.textContent = 'Loading…';
  try {
    const activity = await fetchContributions();
    renderDays(activity.days);
    const count = activity.days.reduce((sum, day) => sum + day.count, 0);
    total.textContent = contributions(count);
  } catch (error) {
    total.textContent = error.name === 'TimeoutError'
      ? 'GitHub took too long to respond. Try again.'
      : error instanceof TypeError
        ? 'Could not connect to GitHub. Check your connection and try again.'
        : error.message;
    retry.hidden = false;
  } finally {
    days.setAttribute('aria-busy', 'false');
  }
}

retry.addEventListener('click', loadActivity);
loadActivity();
