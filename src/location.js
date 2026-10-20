const clock = document.querySelector('.location-time');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Each digit has its own window. The colons stay outside those windows.
const digits = [];
const display = document.createElement('span');
display.className = 'clock-display';
display.setAttribute('aria-hidden', 'true');

for (const character of '00:00:00') {
  const slot = document.createElement('span');
  if (character === ':') {
    slot.className = 'clock-separator';
    slot.textContent = ':';
  } else {
    slot.className = 'clock-digit';
    digits.push(slot);
  }
  display.append(slot);
}

clock.replaceChildren(display);

// The named time zone includes UK daylight saving changes.
const londonTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

let previousUpdate;

function updateClock(animate = true) {
  // Read the current time each time. Do not add seconds to an old value.
  const now = new Date();
  const time = londonTime.format(now);
  // Skip motion after a delayed timer or a system clock change.
  const elapsed = now - previousUpdate;
  const shouldRoll = animate && !reducedMotion.matches && elapsed > 0 && elapsed < 1500;
  const values = time.replaceAll(':', '');

  digits.forEach((slot, index) => {
    const next = values[index];
    const previous = slot.dataset.value;
    if (previous === next && shouldRoll) return;

    const track = document.createElement('span');
    track.className = 'clock-digit-track';

    // Two stacked numbers move together: the old one out, the new one in.
    const rolling = shouldRoll && previous !== undefined && previous !== next;
    const characters = rolling ? [previous, next] : [next];
    for (const character of characters) {
      const value = document.createElement('span');
      value.className = 'clock-digit-value';
      value.textContent = character;
      track.append(value);
    }
    if (rolling) track.classList.add('clock-digit-track--rolling');
    slot.replaceChildren(track);
    slot.dataset.value = next;
  });

  clock.dateTime = time;
  clock.setAttribute('aria-label', `London time: ${time}`);
  previousUpdate = now;
}

updateClock(false);
setInterval(() => {
  if (!document.hidden) updateClock();
}, 1000);

// Background tabs can delay timers. Refresh as soon as the page is visible.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateClock(false);
});

// Stop any current roll if the system motion preference changes.
reducedMotion.addEventListener('change', () => updateClock(false));
