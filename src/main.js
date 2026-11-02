import './style.css';

const menu = document.querySelector('.menu');
const items = [...menu.querySelectorAll('.menu__item')];

// Set the input mode before selection changes so keyboard feedback stays instant.
document.addEventListener('keydown', () => {
  menu.dataset.input = 'keyboard';
}, { capture: true });

for (const type of ['pointerenter', 'pointermove', 'pointerdown']) {
  menu.addEventListener(type, () => {
    if (menu.dataset.input !== 'pointer') menu.dataset.input = 'pointer';
  });
}

function selectItem(item) {
  for (const button of items) {
    button.setAttribute('aria-pressed', String(button === item));
  }
}

for (const item of items) {
  item.addEventListener('click', (event) => {
    menu.dataset.input = event.detail === 0 ? 'keyboard' : 'pointer';
    selectItem(item);
  });
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
