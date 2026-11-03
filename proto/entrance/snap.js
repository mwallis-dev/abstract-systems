import { reduced, sitePage } from "./shared.js";

export const snap = {
  name: "Snap",
  defaults: {
    duration: 900,
    ease: "cubic-bezier(0.23, 1, 0.32, 1)",
    stagger: 60,
    offset: 14,
    blur: 3,
    speed: 1,
  },
  controls: ["duration", "ease", "offset", "blur", "speed"],
  render: sitePage,
  css: `
#stage .enter-rise {
  transform: translateY(var(--offset));
  filter: blur(var(--blur));
  animation: snap-settle var(--duration) var(--ease) forwards;
}

#stage .enter-fade {
  opacity: 0;
  animation: snap-fade var(--duration) var(--ease) forwards;
}

@keyframes snap-settle {
  to {
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes snap-fade {
  from {
    opacity: 0;
    transform: translateY(var(--offset));
    filter: blur(var(--blur));
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
${reduced}
`,
};
