import { cascadePage, reduced } from "./shared.js";

export const cascade = {
  name: "Cascade",
  defaults: {
    duration: 1200,
    ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    stagger: 80,
    offset: 16,
    blur: 4,
    speed: 1,
  },
  controls: ["duration", "ease", "stagger", "offset", "blur", "speed"],
  render: cascadePage,
  css: `
#stage .word {
  display: inline-block;
}

#stage .enter-rise,
#stage .word.cascade-rise {
  transform: translateY(var(--offset));
  filter: blur(var(--blur));
  animation: cascade-settle var(--duration) var(--ease) forwards;
}

#stage .enter-fade {
  opacity: 0;
  animation: cascade-fade var(--duration) var(--ease) forwards;
}

@keyframes cascade-settle {
  to {
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes cascade-fade {
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
