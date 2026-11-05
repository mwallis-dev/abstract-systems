export function applyActivitySettings(root, settings) {
  const values = {
    width: `${settings.width}px`,
    height: `${settings.height}px`,
    gap: `${settings.gap}px`,
    radius: `${settings.radius}px`,
    zero: settings.zero,
    low: settings.low,
    medium: settings.medium,
    high: settings.high,
    peak: settings.peak,
    'hover-scale': settings.hoverScale / 100,
    'near-scale': settings.nearScale / 100,
    'far-scale': settings.farScale / 100,
    duration: `${settings.duration}ms`,
    'label-duration': `${settings.labelDuration}ms`,
    easing: settings.easing,
    'enter-duration': `${settings.enterDuration}ms`,
    'enter-spread': `${settings.enterSpread}ms`,
    'enter-easing': settings.enterEasing,
  };

  for (const [name, value] of Object.entries(values)) {
    root.style.setProperty(`--activity-${name}`, value);
  }
}
