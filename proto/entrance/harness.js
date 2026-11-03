import { cascade } from "./cascade.js";
import { match } from "./match.js";
import { quiet } from "./quiet.js";
import { snap } from "./snap.js";

const variants = [match, quiet, snap, cascade];

const easeLabels = {
  "cubic-bezier(0.25, 0.1, 0.25, 1)": "ease",
  "cubic-bezier(0.32, 0.72, 0, 1)": "enter",
  "cubic-bezier(0.215, 0.61, 0.355, 1)": "out-cubic",
  "cubic-bezier(0.165, 0.84, 0.44, 1)": "out-quart",
  "cubic-bezier(0.23, 1, 0.32, 1)": "out-quint",
  "cubic-bezier(0.19, 1, 0.22, 1)": "out-expo",
};

const stage = document.getElementById("stage");
const picker = document.querySelector(".proto-picker");
const highlight = picker.querySelector(".proto-picker-highlight");
const items = [...picker.querySelectorAll(".proto-picker-item:not(.proto-picker-replay)")];
const replay = picker.querySelector(".proto-picker-replay");
const panel = document.querySelector(".proto-controls");
const copyButton = panel.querySelector(".proto-controls-copy");

let current = 0;
let values = { ...variants[0].defaults };
let copyReset;

const fields = {
  duration: panel.querySelector('[data-field="duration"]'),
  ease: panel.querySelector('[data-field="ease"]'),
  stagger: panel.querySelector('[data-field="stagger"]'),
  offset: panel.querySelector('[data-field="offset"]'),
  blur: panel.querySelector('[data-field="blur"]'),
  speed: panel.querySelector('[data-field="speed"]'),
};

const inputs = {
  duration: panel.querySelector("#ctrl-duration"),
  ease: panel.querySelector("#ctrl-ease"),
  stagger: panel.querySelector("#ctrl-stagger"),
  offset: panel.querySelector("#ctrl-offset"),
  blur: panel.querySelector("#ctrl-blur"),
};

function format(key, value) {
  if (key === "duration" || key === "stagger") return `${value}ms`;
  if (key === "offset" || key === "blur") return `${value}px`;
  if (key === "speed") return `${value}x`;
  if (key === "ease") return easeLabels[value] ?? value;
  return String(value);
}

function writeVars() {
  const duration = values.duration / values.speed;
  const stagger = values.stagger / values.speed;
  stage.style.setProperty("--duration", `${duration}ms`);
  stage.style.setProperty("--stagger", `${stagger}ms`);
  stage.style.setProperty("--ease", values.ease);
  stage.style.setProperty("--offset", `${values.offset}px`);
  stage.style.setProperty("--blur", `${values.blur}px`);
}

function syncPanel() {
  const active = variants[current].controls;
  for (const [key, row] of Object.entries(fields)) {
    row.hidden = !active.includes(key);
  }
  inputs.duration.value = String(values.duration);
  inputs.ease.value = values.ease;
  inputs.stagger.value = String(values.stagger);
  inputs.offset.value = String(values.offset);
  inputs.blur.value = String(values.blur);
  panel.querySelectorAll('input[name="speed"]').forEach((input) => {
    input.checked = Number(input.value) === values.speed;
  });
  panel.querySelector('[data-field="duration"] output').textContent = format("duration", values.duration);
  panel.querySelector('[data-field="stagger"] output').textContent = format("stagger", values.stagger);
  panel.querySelector('[data-field="offset"] output').textContent = format("offset", values.offset);
  panel.querySelector('[data-field="blur"] output').textContent = format("blur", values.blur);
}

function configLine() {
  return variants[current].controls
    .map((key) => `${key}: ${key === "ease" ? values.ease : format(key, values[key])}`)
    .join(" · ");
}

function moveHighlight() {
  const el = items[current];
  highlight.style.width = el.offsetWidth + "px";
  highlight.style.transform = `translateX(${el.offsetLeft}px)`;
}

function mount(i) {
  stage.innerHTML = "";
  document.getElementById("variant-style")?.remove();
  requestAnimationFrame(() => {
    const style = document.createElement("style");
    style.id = "variant-style";
    style.textContent = variants[i].css;
    document.head.appendChild(style);
    writeVars();
    stage.innerHTML = variants[i].render();
  });
}

function setActive(i) {
  if (i < 0 || i >= variants.length) return;
  current = i;
  values = { ...variants[i].defaults };
  items.forEach((el, j) => {
    el.toggleAttribute("data-active", j === i);
    if (j === i) el.setAttribute("aria-current", "true");
    else el.removeAttribute("aria-current");
  });
  moveHighlight();
  const url = new URL(location);
  url.searchParams.set("v", i + 1);
  history.replaceState(null, "", url);
  syncPanel();
  mount(i);
}

inputs.duration.addEventListener("input", () => {
  values.duration = Number(inputs.duration.value);
  panel.querySelector('[data-field="duration"] output').textContent = format("duration", values.duration);
  writeVars();
});
inputs.stagger.addEventListener("input", () => {
  values.stagger = Number(inputs.stagger.value);
  panel.querySelector('[data-field="stagger"] output').textContent = format("stagger", values.stagger);
  writeVars();
});
inputs.offset.addEventListener("input", () => {
  values.offset = Number(inputs.offset.value);
  panel.querySelector('[data-field="offset"] output').textContent = format("offset", values.offset);
  writeVars();
});
inputs.blur.addEventListener("input", () => {
  values.blur = Number(inputs.blur.value);
  panel.querySelector('[data-field="blur"] output').textContent = format("blur", values.blur);
  writeVars();
});
inputs.ease.addEventListener("change", () => {
  values.ease = inputs.ease.value;
  writeVars();
});
panel.querySelectorAll('input[name="speed"]').forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) {
      values.speed = Number(input.value);
      writeVars();
    }
  });
});

copyButton.addEventListener("click", async () => {
  const line = configLine();
  try {
    await navigator.clipboard.writeText(line);
  } catch {
    return;
  }
  copyButton.textContent = "Copied";
  clearTimeout(copyReset);
  copyReset = setTimeout(() => {
    copyButton.textContent = "Copy values";
  }, 1500);
});

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
