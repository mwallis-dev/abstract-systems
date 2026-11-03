# Component rebuild context

## Agreed technology stack

Mark agreed to this stack on 20 October 2026. Use it for every component rebuild in this project unless Mark requests a different stack.

| Technology | Purpose |
| --- | --- |
| Plain HTML | Define the page structure and content. |
| Plain CSS | Define appearance, layout, spacing, and alignment. |
| Plain JavaScript | Add behavior when the exercise needs it. |
| Existing Vite setup | Run the local development server and build the pages. |
| Inline SVG | Draw small icons directly in the HTML. |

## Keep the code easy to learn

- Use standard browser features and clear class names.
- Keep HTML, CSS, and JavaScript in separate files.
- Use a root HTML page for each exercise. Put its CSS and JavaScript in `src`.
- For the location exercise, use `location.html`, `src/location.css`, and, when behavior is needed, `src/location.js`.
- A static exercise does not need a JavaScript file.
- Use plain CSS for new rebuilds. Do not add Tailwind utility classes to them.
- Do not add React, a UI framework, a component library, or an animation library unless Mark requests it.
- Use short comments to explain decisions that help Mark learn. Avoid extra abstraction.

## Work in small steps

- Start with the static HTML and CSS. Match the reference spacing and alignment first.
- Add behavior and motion in later steps when requested.
- State any known difference from the reference, such as a substitute font.
- Keep rebuild styles separate from the existing menu demo styles.
- Keep the existing project dependencies and menu demo unless a requested change requires an update.
- Add each new root HTML page to the existing Vite build entries so that it is included in the build output.

## Local commands

- `pnpm dev` starts the local development server.
- `pnpm build` builds the registered HTML pages.
- `pnpm preview` serves the build output for review.

The existing Vite configuration still supports Tailwind for the menu demo. New component rebuilds use the plain CSS stack defined above.

## Current location exercise

- `location.html` and `src/location.css` contain the row. `src/location.js` adds the live clock.
- The clock shows London time as `HH:MM:SS`, with leading zeroes. It uses `Intl.DateTimeFormat` with `Europe/London` and a 24-hour cycle starting at `00`.
- The clock reads the current time on load, each second while visible, and when the tab becomes visible. The dot and weather icon are static.
- Changed clock digits roll upward through separate clipped windows. The colons stay still. Plain CSS animates two stacked values for 300ms with `cubic-bezier(0.16, 1, 0.3, 1)`.
- Initial load, return to the tab, delayed updates, and reduced motion show the current digits at once. The complete time is exposed through the time element's accessible label; the visual digit tracks are hidden from screen readers.
- The row uses a system monospace font with tabular figures. The reference uses Departure Mono, so letter shapes and text width can still differ.
- The row uses the measured 40px height, 8px gaps, 12px icon, and 6px dot inside a 12px container.
