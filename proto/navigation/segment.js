import { buttons, surround, icons } from './shared.js';
export default function segment() {
  return surround(`<div class="navigation nav-segment" role="group" aria-label="Menu interaction demo">${buttons()}</div>`);
}
