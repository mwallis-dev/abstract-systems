import { buttons, surround, icons } from './shared.js';
export default function compact() {
  return surround(`<div class="nav-compact"><button type="button" class="compact-trigger" aria-expanded="false" aria-controls="compact-choices"><span class="trigger-label">${icons[0]}<span>About</span></span><svg class="chevron" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 9 6 6 6-6"/></svg></button><div id="compact-choices" class="navigation compact-choices" role="group" aria-label="Menu interaction demo" hidden>${buttons()}</div></div>`);
}
