import { buttons, surround, icons } from './shared.js';
export default function line() {
  return surround(`<div class="navigation nav-line" role="group" aria-label="Menu interaction demo">${buttons(false)}</div>`);
}
