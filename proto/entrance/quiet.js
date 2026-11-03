import { reduced, sitePage } from "./shared.js";

export const quiet = {
  name: "Quiet",
  defaults: {
    duration: 1200,
    ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    stagger: 60,
    offset: 8,
    blur: 4,
    speed: 1,
  },
  controls: ["duration", "ease", "offset", "blur", "speed"],
  render: sitePage,
  css: `
#stage .enter-rise {
  filter: blur(var(--blur));
  animation: quiet-sharpen var(--duration) var(--ease) forwards;
}

#stage .enter-fade {
  opacity: 0;
  filter: blur(var(--blur));
  animation: quiet-fade var(--duration) var(--ease) forwards;
}

@keyframes quiet-sharpen {
  to {
    filter: blur(0);
  }
}

@keyframes quiet-fade {
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
