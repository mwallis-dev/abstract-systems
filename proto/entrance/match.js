import { reduced, sitePage } from "./shared.js";

export const match = {
  name: "Match",
  defaults: {
    duration: 1200,
    ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    stagger: 60,
    offset: 16,
    blur: 4,
    speed: 1,
  },
  controls: ["duration", "ease", "offset", "blur", "speed"],
  render: sitePage,
  css: `
#stage .enter-rise {
  transform: translateY(var(--offset));
  filter: blur(var(--blur));
  animation: match-settle var(--duration) var(--ease) forwards;
}

#stage .enter-fade {
  opacity: 0;
  animation: match-fade var(--duration) var(--ease) forwards;
}

@keyframes match-settle {
  to {
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes match-fade {
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
