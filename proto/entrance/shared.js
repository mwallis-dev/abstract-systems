const flask = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/></svg>`;

export const copy = {
  status: "Abstract Systems Lab",
  name: "Mark Wallis",
  role: "Interface design and prototyping",
  statement: "I build small prototypes to make complex things feel simple.",
  paragraphs: [
    "Product designer with many years of experience thinking through the details and designing software that makes sense. I specialise in systems and AI-powered experiences that help people understand, trust, and work alongside AI agents.",
    "I’m a systems thinker who loves getting my hands-on the interface, combining product thinking, interaction design, and AI-assisted engineering to create working products.",
    "The abstract systems lab is where I test the details. I work as simply as I can when it come to web tech: I use plain HTML, CSS and JavaScript so I can understand how each part works and adjust it as I go.",
  ],
};

export function enter(n, html) {
  return `<div class="enter" style="--n:${n}">${html}</div>`;
}

export function rise(delayMs, html) {
  return `<div class="enter enter-rise" style="animation-delay:${delayMs}ms">${html}</div>`;
}

export function fade(delayMs, html) {
  return `<div class="enter enter-fade" style="animation-delay:${delayMs}ms">${html}</div>`;
}

/** abstract.systems profile entrance — rise above the fold, fade for bio blocks. */
export function sitePage() {
  return `<main class="profile" data-face="areal" aria-labelledby="profile-name">
    ${rise(0, `<div class="profile-status">${flask}<span>${copy.status}</span></div>`)}
    <header class="profile-header">
      ${rise(60, `<h1 id="profile-name">${copy.name}</h1>`)}
      ${rise(120, `<p class="profile-role">${copy.role}</p>`)}
    </header>
    <div class="profile-bio">
      ${fade(180, `<h2>${copy.statement}</h2>`)}
      ${fade(220, `<p>${copy.paragraphs[0]}</p>`)}
      ${fade(260, `<p>${copy.paragraphs[1]}</p>`)}
      ${fade(290, `<p>${copy.paragraphs[2]}</p>`)}
    </div>
  </main>`;
}

export function words(text, startN) {
  const parts = text.split(/\s+/);
  return {
    html: parts
      .map((word, i) => `<span class="word" style="--n:${startN + i}">${word}</span>`)
      .join(" "),
    next: startN + parts.length,
  };
}

export function blockPage() {
  return `<main class="profile" data-face="areal" aria-labelledby="profile-name">
    ${enter(0, `<div class="profile-status">${flask}<span>${copy.status}</span></div>`)}
    <header class="profile-header">
      ${enter(1, `<h1 id="profile-name">${copy.name}</h1>`)}
      ${enter(2, `<p class="profile-role">${copy.role}</p>`)}
    </header>
    <div class="profile-bio">
      ${enter(3, `<h2>${copy.statement}</h2>`)}
      ${enter(4, `<p>${copy.paragraphs[0]}</p>`)}
      ${enter(5, `<p>${copy.paragraphs[1]}</p>`)}
      ${enter(6, `<p>${copy.paragraphs[2]}</p>`)}
    </div>
  </main>`;
}

export function wordPage() {
  const name = words(copy.name, 1);
  const statement = words(copy.statement, 4);
  const bioStart = statement.next;

  return `<main class="profile" data-face="areal" aria-labelledby="profile-name">
    ${enter(0, `<div class="profile-status">${flask}<span>${copy.status}</span></div>`)}
    <header class="profile-header">
      <h1 id="profile-name">${name.html}</h1>
      ${enter(3, `<p class="profile-role">${copy.role}</p>`)}
    </header>
    <div class="profile-bio">
      <h2>${statement.html}</h2>
      ${enter(bioStart, `<p>${copy.paragraphs[0]}</p>`)}
      ${enter(bioStart + 1, `<p>${copy.paragraphs[1]}</p>`)}
      ${enter(bioStart + 2, `<p>${copy.paragraphs[2]}</p>`)}
    </div>
  </main>`;
}

/** Name ripples word-by-word; everything else follows Match delays and block enters. */
export function cascadePage() {
  const nameHtml = copy.name
    .split(/\s+/)
    .map(
      (word, i) =>
        `<span class="word cascade-rise" style="animation-delay:calc(60ms + ${i} * var(--stagger))">${word}</span>`,
    )
    .join(" ");

  return `<main class="profile" data-face="areal" aria-labelledby="profile-name">
    ${rise(0, `<div class="profile-status">${flask}<span>${copy.status}</span></div>`)}
    <header class="profile-header">
      <h1 id="profile-name">${nameHtml}</h1>
      ${rise(120, `<p class="profile-role">${copy.role}</p>`)}
    </header>
    <div class="profile-bio">
      ${fade(180, `<h2>${copy.statement}</h2>`)}
      ${fade(220, `<p>${copy.paragraphs[0]}</p>`)}
      ${fade(260, `<p>${copy.paragraphs[1]}</p>`)}
      ${fade(290, `<p>${copy.paragraphs[2]}</p>`)}
    </div>
  </main>`;
}

export const reduced = `
@media (prefers-reduced-motion: reduce) {
  #stage .enter,
  #stage .enter-rise,
  #stage .enter-fade,
  #stage .word {
    animation: none;
    opacity: 1;
    transform: none;
    filter: none;
    clip-path: none;
  }
}
`;
