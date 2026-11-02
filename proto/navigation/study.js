import raised from './raised.js';
import line from './line.js';
import segment from './segment.js';
import rail from './rail.js';
import compact from './compact.js';
import { icons, labels } from './shared.js';

const variants = [raised, line, segment, rail, compact];
const descriptions = [
  ['Pill', 'The current menu, with your saved settings.'],
  ['Line', 'Text first. A fine line marks the current choice.'],
  ['Group', 'One control. Four clearly separated choices.'],
  ['Rail', 'A vertical list with a marker at the left edge.'],
  ['Fold', 'Show the current choice. Open the list when needed.'],
];
const duration = document.querySelector('#duration');
const speed = document.querySelector('#speed');
function applyMotion() {
  document.documentElement.style.setProperty('--duration', `${Number(duration.value) * Number(speed.value)}ms`);
  document.querySelector('#duration-value').textContent = `${duration.value} ms`;
}
duration.addEventListener('input', applyMotion);
speed.addEventListener('change', applyMotion);
document.querySelector('#motion-form').addEventListener('submit', e => e.preventDefault());
document.querySelector('#copy-config').addEventListener('click', async () => {
  const text = `duration: ${duration.value}ms · speed: ${1 / Number(speed.value)}× · ease: cubic-bezier(0.22, 1, 0.36, 1)`;
  try {
    await navigator.clipboard.writeText(text);
    document.querySelector('#copy-status').textContent = 'Settings copied.';
  } catch {
    document.querySelector('#copy-status').textContent = text;
  }
});
let cleanupVariant = () => {};
function setupVariant(i) {
  cleanupVariant();
  cleanupVariant = () => {};
  document.querySelector('#direction-title').textContent = descriptions[i][0];
  document.querySelector('#direction-note').textContent = descriptions[i][1];
  document.querySelector('#motion-fields').disabled = i === 0 || i === 4;
  document.querySelector('#motion-note').textContent = i === 0 ? 'The current menu keeps your saved settings.' : i === 4 ? 'The list opens at once. No motion to adjust.' : 'Mouse feedback only. Keyboard changes are instant.';
  document.querySelector('#copy-status').textContent = '';
  const frame = stage.querySelector('iframe');
  if (frame) {
    // Keep the actual menu intact; pass only study shortcuts to the outer page.
    frame.addEventListener('load', () => {
      frame.contentDocument.addEventListener('keydown', e => {
        if (/^[1-5rR]$/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
          e.preventDefault();
          document.dispatchEvent(new KeyboardEvent('keydown', { key: e.key, bubbles: true }));
        }
      });
    });
    return;
  }
  const navigation = stage.querySelector('.navigation');
  const choices = [...navigation.querySelectorAll('.nav-choice')];
  const trigger = stage.querySelector('.compact-trigger');
  let selected = 0;
  function closeList(returnFocus = false) {
    if (!trigger) return;
    navigation.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  }
  function select(index, keyboard = false) {
    navigation.toggleAttribute('data-keyboard', keyboard);
    selected = index;
    choices.forEach((button, j) => button.setAttribute('aria-pressed', String(j === index)));
    if (trigger) {
      trigger.querySelector('.trigger-label').innerHTML = `${icons[index]}<span>${labels[index]}</span>`;
      closeList(true);
    }
  }
  choices.forEach((button, index) => {
    button.addEventListener('click', e => select(index, e.detail === 0));
    button.addEventListener('keydown', e => {
      const horizontal = i !== 3 && i !== 4;
      let next;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = choices.length - 1;
      if (e.key === (horizontal ? 'ArrowRight' : 'ArrowDown')) next = (index + 1) % choices.length;
      if (e.key === (horizontal ? 'ArrowLeft' : 'ArrowUp')) next = (index + choices.length - 1) % choices.length;
      if (next !== undefined) {
        e.preventDefault();
        e.stopPropagation();
        choices[next].focus();
        if (!trigger) select(next, true);
      }
      if (trigger && e.key === 'Escape') { e.preventDefault(); closeList(true); }
      // The study picker owns left/right only when focus is outside the specimen.
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopPropagation();
    });
  });
  if (trigger) {
    function openList(last = false) {
      navigation.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      choices[last ? choices.length - 1 : selected].focus();
    }
    trigger.addEventListener('click', () => navigation.hidden ? openList() : closeList());
    trigger.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openList(e.key === 'ArrowUp'); }
      if (e.key === 'Escape') closeList();
    });
    const outside = e => { if (!e.target.closest('.nav-compact')) closeList(); };
    document.addEventListener('pointerdown', outside);
    stage.querySelector('.nav-compact').addEventListener('focusout', e => {
      if (!e.currentTarget.contains(e.relatedTarget)) closeList();
    });
    cleanupVariant = () => document.removeEventListener('pointerdown', outside);
  }
}
// `variants` is an array of render functions, one per variant, in picker order.
const stage = document.getElementById('stage');
const picker = document.querySelector('.proto-picker');
const highlight = picker.querySelector('.proto-picker-highlight');
const items = [...picker.querySelectorAll('.proto-picker-item:not(.proto-picker-replay)')];
const replay = picker.querySelector('.proto-picker-replay');
let current = 0;

function moveHighlight() {
  const el = items[current];
  highlight.style.width = el.offsetWidth + 'px';
  highlight.style.transform = `translateX(${el.offsetLeft}px)`;
}

function mount(i) {
  stage.innerHTML = '';
  // Clear first, render next frame, so entrance animations re-run.
  requestAnimationFrame(() => { stage.innerHTML = variants[i](); setupVariant(i); });
}

function setActive(i) {
  if (i < 0 || i >= variants.length) return;
  current = i;
  items.forEach((el, j) => {
    el.toggleAttribute('data-active', j === i);
    if (j === i) el.setAttribute('aria-current', 'true');
    else el.removeAttribute('aria-current');
  });
  moveHighlight();
  const url = new URL(location);
  url.searchParams.set('v', i + 1);
  history.replaceState(null, '', url);
  mount(i);
}

items.forEach((el, i) => el.addEventListener('click', () => setActive(i)));
replay?.addEventListener('click', () => mount(current));
window.addEventListener('resize', moveHighlight);

document.addEventListener('keydown', (e) => {
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.defaultPrevented) return;
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= variants.length) setActive(num - 1);
  else if (e.key === 'ArrowRight') setActive((current + 1) % variants.length);
  else if (e.key === 'ArrowLeft') setActive((current - 1 + variants.length) % variants.length);
  else if (e.key === 'r' || e.key === 'R') mount(current);
});

const requested = Number(new URLSearchParams(location.search).get('v'));
setActive(Number.isInteger(requested) && requested >= 1 && requested <= variants.length ? requested - 1 : 0);
// Enable the slide only after first paint, so load doesn't animate.
requestAnimationFrame(() => requestAnimationFrame(() => picker.setAttribute('data-ready', '')));
