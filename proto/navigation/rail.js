import { buttons, surround, icons } from './shared.js';
export default function rail() {
  return surround(`<div class="navigation nav-rail" role="group" aria-label="Menu interaction demo">${buttons()}</div>`);
}
