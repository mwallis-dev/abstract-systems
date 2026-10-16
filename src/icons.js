const input = document.querySelector('#search');
const grid = document.querySelector('#icons');
const status = document.querySelector('#status');
let icons = [];
let copiedButton;

document.querySelector('form').addEventListener('submit', (event) => event.preventDefault());
input.addEventListener('input', render);

function render() {
  const words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = icons.filter((icon) => words.every((word) => icon.search.includes(word)));
  const visible = matches.slice(0, 240);
  status.textContent = matches.length
    ? `${matches.length.toLocaleString()} icons${matches.length > 240 ? ' — showing the first 240. Search to narrow results.' : '. Click an icon to copy its ID.'}`
    : 'No icons found. Try a different name, such as book or user.';
  grid.replaceChildren(...visible.map((icon) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.title = icon.id;
    button.setAttribute('aria-label', `Copy ${icon.id}`);
    const img = document.createElement('img');
    img.src = `data:image/svg+xml,${encodeURIComponent(icon.svg)}`;
    img.alt = '';
    img.loading = 'lazy';
    const name = document.createElement('span');
    name.textContent = icon.name;
    const collection = document.createElement('small');
    collection.textContent = `${icon.collection} · ${icon.style}`;
    button.append(img, name, collection);
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(icon.id);
        if (copiedButton) {
          delete copiedButton.dataset.copied;
          copiedButton.querySelector('span').textContent = copiedButton.dataset.name;
        }
        button.dataset.name = icon.name;
        button.dataset.copied = '';
        name.textContent = 'Copied!';
        copiedButton = button;
        status.textContent = `Copied ${icon.id}`;
      } catch {
        status.textContent = `Copy unavailable. Icon ID: ${icon.id}`;
        window.prompt('Copy this icon ID:', icon.id);
      }
    });
    return button;
  }));
}

try {
  const response = await fetch('/icon-review/catalog.json');
  if (!response.ok) throw new Error('Could not load icons');
  icons = await response.json();
  render();
} catch {
  status.textContent = 'Could not load the local icons. Refresh the page to try again.';
}
