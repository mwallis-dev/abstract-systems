const flask = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/></svg>`;

const copy = {
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

function fontsForFace(face) {
  switch (face) {
    case "system":
      return { body: "System", mono: "System Mono" };
    case "arimo":
      return { body: "Arimo", mono: "System Mono" };
    default:
      return { body: "ABC Areal", mono: "ABC Areal Mono" };
  }
}

function styleRowsFor(face) {
  const { body, mono } = fontsForFace(face);
  return [
    { for: "caption", label: `Font: ${mono} | Size: 13 | Italic: 0 | Weight: 400 | Uppercase`, ariaLabel: "Highlight caption" },
    { for: "name", label: `Font: ${body} | Size: 40 | Italic: 0 | Weight: 600`, ariaLabel: "Highlight name" },
    { for: "role", label: `Font: ${body} | Size: 18 | Italic: 0 | Weight: 400`, ariaLabel: "Highlight role" },
    { for: "statement", label: `Font: ${body} | Size: 26 | Italic: 0 | Weight: 400 | Heading 2`, ariaLabel: "Highlight statement" },
    { for: "bio", label: `Font: ${body} | Size: 18 | Italic: 0 | Weight: 400`, ariaLabel: "Highlight bio" },
  ];
}

const variants = ["areal", "system", "arimo"].map((face) => () => page(face));

function page(face) {
  const rows = styleRowsFor(face)
    .map(
      ({ for: block, label, ariaLabel }) =>
        `<li><button type="button" class="profile-type-style" data-for="${block}" aria-label="${ariaLabel}">${label}</button></li>`,
    )
    .join("");
  const paragraphs = copy.paragraphs
    .map((text) => `<p data-type-block="bio">${text}</p>`)
    .join("");

  return `<main class="profile" data-face="${face}" aria-labelledby="profile-name">
    <div class="profile-status" data-type-block="caption">${flask}<span>${copy.status}</span></div>
    <header class="profile-header">
      <h1 id="profile-name" data-type-block="name">${copy.name}</h1>
      <p class="profile-role" data-type-block="role">${copy.role}</p>
    </header>
    <div class="profile-bio">
      <h2 data-type-block="statement">${copy.statement}</h2>
      ${paragraphs}
    </div>
    <section class="profile-type" aria-labelledby="profile-type-heading">
      <h2 id="profile-type-heading">Styles used above</h2>
      <ul class="profile-type-styles">${rows}</ul>
    </section>
  </main>`;
}

const stage = document.getElementById("stage");
const picker = document.querySelector(".proto-picker");
const highlight = picker.querySelector(".proto-picker-highlight");
const items = [...picker.querySelectorAll(".proto-picker-item:not(.proto-picker-replay)")];
const replay = picker.querySelector(".proto-picker-replay");
let current = 0;

function moveHighlight() {
  const el = items[current];
  highlight.style.width = el.offsetWidth + "px";
  highlight.style.transform = `translateX(${el.offsetLeft}px)`;
}

function mount(i) {
  stage.innerHTML = "";
  requestAnimationFrame(() => {
    stage.innerHTML = variants[i]();
  });
}

function setActive(i) {
  if (i < 0 || i >= variants.length) return;
  current = i;
  items.forEach((el, j) => {
    el.toggleAttribute("data-active", j === i);
    if (j === i) el.setAttribute("aria-current", "true");
    else el.removeAttribute("aria-current");
  });
  moveHighlight();
  const url = new URL(location);
  url.searchParams.set("v", i + 1);
  history.replaceState(null, "", url);
  mount(i);
}

items.forEach((el, i) => el.addEventListener("click", () => setActive(i)));
replay?.addEventListener("click", () => mount(current));
window.addEventListener("resize", moveHighlight);

document.addEventListener("keydown", (e) => {
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= variants.length) setActive(num - 1);
  else if (e.key === "ArrowRight") setActive((current + 1) % variants.length);
  else if (e.key === "ArrowLeft") setActive((current - 1 + variants.length) % variants.length);
  else if (e.key === "r" || e.key === "R") mount(current);
});

setActive((parseInt(new URLSearchParams(location.search).get("v"), 10) || 1) - 1);
requestAnimationFrame(() => requestAnimationFrame(() => picker.setAttribute("data-ready", "")));
