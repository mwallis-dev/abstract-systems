/** Harvest reads lab/config/profile-type.json — never copy values from the panel by eye. */

const SAVE_PATH = 'lab/config/profile-type.json';

const defaultConfig = {
  face: 'areal',
  textDisplayPx: 40,
  textLeadPx: 26,
  textBodyPx: 18,
  textCaptionPx: 13,
  nameWeight: 600,
  nameLineHeightPct: 110,
  nameLetterSpacingEm: -25,
  roleWeight: 400,
  roleLineHeightPct: 140,
  statementWeight: 400,
  statementLineHeightPct: 130,
  statementLetterSpacingEm: -15,
  bioWeight: 400,
  bioLineHeightPct: 155,
  blockGapPx: 28,
  bioGapPx: 16,
  headerGapPx: 8,
};

const preview = document.getElementById('profile-preview');
const saveButton = document.getElementById('save-config');
const saveStatus = document.getElementById('save-status');

const styleButtons = {
  caption: document.querySelector('.profile-type-style[data-for="caption"]'),
  name: document.querySelector('.profile-type-style[data-for="name"]'),
  role: document.querySelector('.profile-type-style[data-for="role"]'),
  statement: document.querySelector('.profile-type-style[data-for="statement"]'),
  bio: document.querySelector('.profile-type-style[data-for="bio"]'),
};

const bindings = [...document.querySelectorAll('[data-bind]')];

function pxValue(px) {
  return `${px}px`;
}

function letterSpacingEm(thousandths) {
  return `${thousandths / 1000}em`;
}

function lineHeightFromPct(pct) {
  return (pct / 100).toFixed(2);
}

function fontsForFace(face) {
  switch (face) {
    case 'system':
      return { body: 'System', mono: 'System Mono' };
    case 'arimo':
      return { body: 'Arimo', mono: 'System Mono' };
    default:
      return { body: 'ABC Areal', mono: 'ABC Areal Mono' };
  }
}

function readConfig() {
  const config = { ...defaultConfig };
  for (const el of bindings) {
    const key = el.dataset.bind;
    if (el.tagName === 'SELECT') config[key] = el.value;
    else config[key] = Number(el.value);
  }
  return config;
}

function syncOutputs(config) {
  for (const output of document.querySelectorAll('output[data-for]')) {
    const key = output.dataset.for;
    const value = config[key];
    if (key === 'face') output.textContent = value;
    else if (key.endsWith('LetterSpacingEm')) output.textContent = `${value}‰`;
    else if (key.endsWith('LineHeightPct')) output.textContent = `${(value / 100).toFixed(2)}`;
    else output.textContent = String(value);
  }
}

function updateStyleLabels(config) {
  const { body, mono } = fontsForFace(config.face);
  styleButtons.caption.textContent = `Font: ${mono} | Size: ${config.textCaptionPx} | Italic: 0 | Weight: 400 | Uppercase`;
  styleButtons.name.textContent = `Font: ${body} | Size: ${config.textDisplayPx} | Italic: 0 | Weight: ${config.nameWeight}`;
  styleButtons.role.textContent = `Font: ${body} | Size: ${config.textBodyPx} | Italic: 0 | Weight: ${config.roleWeight}`;
  styleButtons.statement.textContent = `Font: ${body} | Size: ${config.textLeadPx} | Italic: 0 | Weight: ${config.statementWeight} | Heading 2`;
  styleButtons.bio.textContent = `Font: ${body} | Size: ${config.textBodyPx} | Italic: 0 | Weight: ${config.bioWeight}`;
}

function applyConfig(config) {
  preview.dataset.face = config.face;
  preview.style.setProperty('--lab-text-display', pxValue(config.textDisplayPx));
  preview.style.setProperty('--lab-text-lead', pxValue(config.textLeadPx));
  preview.style.setProperty('--lab-text-body', pxValue(config.textBodyPx));
  preview.style.setProperty('--lab-text-caption', pxValue(config.textCaptionPx));
  preview.style.setProperty('--lab-name-weight', String(config.nameWeight));
  preview.style.setProperty('--lab-name-leading', lineHeightFromPct(config.nameLineHeightPct));
  preview.style.setProperty('--lab-name-tracking', letterSpacingEm(config.nameLetterSpacingEm));
  preview.style.setProperty('--lab-role-weight', String(config.roleWeight));
  preview.style.setProperty('--lab-role-leading', lineHeightFromPct(config.roleLineHeightPct));
  preview.style.setProperty('--lab-statement-weight', String(config.statementWeight));
  preview.style.setProperty('--lab-statement-leading', lineHeightFromPct(config.statementLineHeightPct));
  preview.style.setProperty('--lab-statement-tracking', letterSpacingEm(config.statementLetterSpacingEm));
  preview.style.setProperty('--lab-bio-weight', String(config.bioWeight));
  preview.style.setProperty('--lab-bio-leading', lineHeightFromPct(config.bioLineHeightPct));
  preview.style.setProperty('--lab-block-gap', `${config.blockGapPx}px`);
  preview.style.setProperty('--lab-bio-gap', `${config.bioGapPx}px`);
  preview.style.setProperty('--lab-header-gap', `${config.headerGapPx}px`);

  syncOutputs(config);
  updateStyleLabels(config);
}

function buildExport(config) {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    target: {
      html: 'profile.html',
      css: 'src/profile.css',
    },
    config,
    css: {
      customProperties: {
        '--text-display': pxValue(config.textDisplayPx),
        '--text-lead': pxValue(config.textLeadPx),
        '--text-body': pxValue(config.textBodyPx),
        '--text-caption': pxValue(config.textCaptionPx),
      },
      profileRoot: {
        gap: `${config.blockGapPx}px`,
        dataFace: config.face === 'system' ? null : config.face,
      },
      blocks: {
        name: {
          fontWeight: config.nameWeight,
          lineHeight: lineHeightFromPct(config.nameLineHeightPct),
          letterSpacing: letterSpacingEm(config.nameLetterSpacingEm),
        },
        role: {
          fontWeight: config.roleWeight,
          lineHeight: lineHeightFromPct(config.roleLineHeightPct),
        },
        statement: {
          fontWeight: config.statementWeight,
          lineHeight: lineHeightFromPct(config.statementLineHeightPct),
          letterSpacing: letterSpacingEm(config.statementLetterSpacingEm),
        },
        bio: {
          fontWeight: config.bioWeight,
          lineHeight: lineHeightFromPct(config.bioLineHeightPct),
          gap: `${config.bioGapPx}px`,
        },
        header: {
          gap: `${config.headerGapPx}px`,
        },
      },
    },
  };
}

function initControls() {
  for (const el of bindings) {
    const key = el.dataset.bind;
    const value = defaultConfig[key];
    if (el.tagName === 'SELECT') el.value = value;
    else el.value = String(value);
    el.addEventListener('input', () => applyConfig(readConfig()));
  }
}

async function saveConfig() {
  const payload = buildExport(readConfig());
  const json = `${JSON.stringify(payload, null, 2)}\n`;

  saveButton.disabled = true;
  saveStatus.hidden = false;
  saveStatus.textContent = 'Saving…';

  try {
    const response = await fetch('/__lab/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: SAVE_PATH, contents: json }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();
    saveStatus.textContent = `Saved ${result.path}`;
  } catch {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'profile-type.json';
    link.click();
    URL.revokeObjectURL(url);
    saveStatus.textContent = `Dev server offline — downloaded JSON. Place at ${SAVE_PATH} for harvest.`;
  } finally {
    saveButton.disabled = false;
  }
}

initControls();
applyConfig(readConfig());
saveButton.addEventListener('click', () => saveConfig());
