# Abstract Systems menu

The menu demo uses four text labels on white: About, Work, Library, Stack.
The selected item has one pale blue fill. Keep the labels, padding, and font
weight consistent so the selection is the first visible difference.

## Menu control

Use `.menu__item` buttons to select an item in this interaction demo. Use real
links when a future page needs navigation to another URL; these buttons do not
open pages.

States: unselected, selected, hover, active, and keyboard focus. About is selected
on load. Exactly one button has `aria-pressed="true"`.

- Selected: `--menu-selected` background and `--menu-ink` text.
- Unselected: transparent background and `--menu-muted` text.
- Hover: `--menu-hover` background and `--menu-ink` text on an unselected item.
- Keyboard focus: a 2px neutral grey outline, offset by 2px. Keep this separate
  from selection.
- Forced colours: use a 2px `Highlight` border inside the selected button and a
  separate `ButtonText` focus outline. System colours keep both states visible.

```html
<!-- Correct: selected state comes from the button attribute. -->
<button class="menu__item" type="button" aria-pressed="true">
  <span>About</span>
</button>

<!-- Incorrect: a label without a button cannot receive keyboard input. -->
<span class="menu__item">About</span>
```

## Materials

`src/style.css` defines the menu tokens. Use these tokens for menu states.

| Token | Value | Use |
| --- | --- | --- |
| `--menu-ink` | `#0a2540` | Selected and hover text |
| `--menu-muted` | `#637488` | Unselected text |
| `--menu-selected` | `#e0edf8` | Selected and active fill |
| `--menu-hover` | `#f3f6f9` | Unselected hover fill |
| `--menu-focus` | `#5f5f5f` | Keyboard focus outline |

- Font: Work Sans, weight 500. Keep the weight unchanged on selection and hover.
- Labels: 16px with a 1.5 line height; 14px at viewport widths up to 24rem.
- Buttons: at least 44px high and 44px wide; 10px vertical and 14px horizontal
  padding. At widths up to 24rem, use 12px horizontal padding.
- Gap between buttons: 4px. Corners: 999px.
- Page: centre the menu with at least 16px horizontal space at each edge.
- At widths too small for one row, wrap and centre the buttons. Keep every label
  visible and each button at least 44px high.

## Behaviour and restraint

Click, Enter, or Space selects a button. Left and Right wrap selection and focus.
Home and End select and focus the first and last button. Keyboard selection
and reduced-motion feedback are immediate.

Pointer selection cross-fades the fills over 150ms. Hover fades over 120ms on
devices with a mouse or other fine pointer. These transitions change opacity
only; buttons and labels keep their positions. Initial page load has no animation.

Pointer presses scale only the label to 0.96 over 120ms. The button's hit area
stays unchanged. Keyboard focus and reduced motion disable this press effect.

Keep icons, credit copy, gradients, layered shadows, and experiment settings out
of this menu. They add visual detail without helping users select a label.
The implementation is in `index.html`, `src/style.css`, and `src/main.js`.
The earlier visual study files are historical references for the original menu.
