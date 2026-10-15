---
name: "Abstract Systems menu demo"
description: "Faithful compact light navigation from Figma node 1:3."
colors:
  page: "#ffffff"
  menu-ink: "#0a2540"
  menu-muted: "#637488"
  menu-focus: "#1f70ba"
  selection: "#e0edf8"
  hover: "rgb(10 37 64 / 3%)"
typography:
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "13.7px"
    fontWeight: 500
    lineHeight: "20px"
  helper:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    lineHeight: "20px"
rounded:
  menu: "999px"
spacing:
  icon-label: "6px"
  items: "8px"
  button-inset: "6px 10px"
  menu-inset: "2px 4px"
components:
  menu-button:
    backgroundColor: "transparent"
    textColor: "{colors.menu-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.menu}"
    padding: "{spacing.button-inset}"
    height: "32px"
  menu-button-selected:
    textColor: "{colors.menu-ink}"
  menu-button-hover:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.menu-ink}"
---

# Design System: Abstract Systems menu demo

## Overview

**Creative North Star: "Compact light navigation"**

A faithful interaction study of Figma file X3eGd5JYkmFCCoQPi8thX2, node 1:3. The supplied compact light menu is the visual authority: preserve its proportions, original icons, label hierarchy, and layered blue-gray selection pill. This is a narrow demo, not a broader brand system.

**Key Characteristics:**
- Compact horizontal navigation on white.
- Original 16 × 16 SVGs and medium-weight Inter labels.
- One shared layered pill, with restrained hover and visible keyboard focus.

## Colors

The palette is quiet blue-gray on white. Menu ink identifies the selected label; muted ink serves the remaining labels. Focus blue is reserved for the keyboard outline. The selected pill's translucent gradient stops and shading are recorded verbatim in the sidecar, rather than expanded into an invented color scale.

## Typography

Inter with a sans-serif fallback supplies the medium-weight menu labels. The label token is the About baseline; the observed optical size adjustments are Work (13.9px), Library (13.8px), and Stack (13.5px). Keep the supplied capitalization. The helper is a subordinate demo instruction, not a new heading or brand type scale.

## Layout

The menu is one intrinsic-width horizontal row. Its four buttons retain their order: About, Work, Library, Stack. Use the frontmatter's item gap, icon gap, and insets; each original icon occupies a fixed square (16px). The pill is absolutely positioned with a height of (32px) and top inset of (2px); its horizontal position is the selected button's offset minus (1.35px), and its width is that button's measured width plus (4.7px).

The demo centers the menu and helper in the viewport, with horizontal page padding (32px) and menu-to-helper spacing (28px). This surrounding white canvas is presentation scaffolding. There are no layout breakpoints or mobile rearrangements in this scope.

## Elevation & Depth

Depth belongs to the selected pill. Translucent radial and linear gradients, fine outer and inset shadows, and two subtle overlay layers reproduce its light blue-gray material. Keep the complete gradient and shadow recipe in `.impeccable/design.json`; a flat fill or heavier generic shadow changes the reference.

## Shapes

Use the menu radius token for buttons and pill. The row itself has no visible enclosing border or card. Original SVG artwork retains its path geometry, fills, and group opacity.

## Components

### Navigation

About starts selected. The controls are native buttons in a labeled group, each exposing selection with `aria-pressed`; they do not navigate. Selecting another item moves the single shared pill, preserving sibling layout. Initialize the pill after measuring and enable motion only after the font is ready; keep it aligned when dimensions change.

The pill transitions position and width together over (340ms), using `cubic-bezier(0.22, 1, 0.36, 1)`. Unselected hover darkens the label and adds the faint hover fill on hover-capable devices; label and background transitions use (160ms) `ease-out`. Keyboard focus uses the focus color with an outline (2px) and offset (3px). Reduced-motion preference removes transitions.

Tab reaches each button; Enter or Space activates it. Left/Right arrows wrap selection and focus, and Home/End select and focus the first/last item. The sidecar snippets preview visual states; the live app owns selection behavior.

Evidence: `.impeccable/review/figma-reference.png`, `desktop.png`, `menu-about.png`, and `menu-work-focus.png` in the same review directory.

## Do's and Don'ts

### Do:
- Do preserve the original SVG paths, fills, opacity, and 16 × 16 dimensions.
- Do move one shared pill and retain fixed sibling positions.
- Do preserve hover, keyboard focus, and reduced-motion states.

### Don't:
- Don't invent a new visual identity or add decorative surfaces.
- Don't turn the demo buttons into real navigation.
- Don't introduce dark mode, a mobile rearrangement, or a responsive redesign.
