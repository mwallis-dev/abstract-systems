const styleButtons = document.querySelectorAll('.profile-type-style');

for (const button of styleButtons) {
  button.addEventListener('click', () => {
    const activate = button.getAttribute('aria-pressed') === 'false';

    for (const styleButton of styleButtons) {
      styleButton.setAttribute('aria-pressed', String(activate && styleButton === button));
    }
  });
}
