import '@fontsource/inter/latin-500.css';
import './style.css';

const menu = document.querySelector('.menu');
const items = [...menu.querySelectorAll('.menu__item')];
const pill = menu.querySelector('.menu__pill');
let selected = items[0];

function positionPill() {
  // Keep one shared pill in the layout, including during interrupted transitions.
  pill.style.transform = `translateX(${selected.offsetLeft - 1.35}px)`;
  pill.style.width = `${selected.getBoundingClientRect().width + 4.7}px`;
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
