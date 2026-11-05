import './menu-alt-2.css';

const items = document.querySelectorAll('.menu__item');

for (const item of items) {
  item.addEventListener('click', () => {
    for (const button of items) {
      button.setAttribute('aria-pressed', String(button === item));
    }
  });
}
