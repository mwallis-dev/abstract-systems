# London status row: element and interaction study

Reviewed: 20 October 2026.

Source: [Abstract Systems — About](https://www.abstract.systems/).

Scope: only the selected London, weather, and clock row. This document records the current page. No local copy of the element was built.

## Read this first

The row is a small information display with four parts:

**Green pulse → LONDON,UK → weather icon → hours:minutes:seconds**

Its main behavior is automatic. The green ring pulses, the clock digits roll, and the row has an entrance animation. Click tests did not open extra content.

The blue outline and comment marker in the supplied image belong to the browser comment tool. They are not part of the page design.

## 1. Elements

| Part | What is present | What it communicates |
| --- | --- | --- |
| Green dot | A solid green centre with a separate ring around it. | A status signal. Its exact meaning is not stated. Do not assume that it means “online” or “available for work.” |
| Location | The text `London,UK`, displayed in uppercase as `LONDON,UK`. | The location associated with this row. It is plain text. |
| Weather | A small outline SVG. At review time it showed a cloud with dots below it. | A weather symbol. No temperature or written condition was shown. The exact condition and data source were not confirmed. |
| Clock | Three separate number displays, with two fixed colon separators. Example: `09:47:56`. | Hours, minutes, and seconds. Leading zeroes are retained. No AM/PM label is shown. |

## 2. Layout and appearance

These values came from the rendered page structure and computed styles. Minor fractional measurements can result from browser scaling.

| Property | Observed value |
| --- | --- |
| Row layout | A horizontal flex row, with vertical centre alignment. |
| Row height | 40 CSS pixels. |
| Space between the four parts | 8 CSS pixels. The dot container also has a 2-pixel right margin. |
| Row width | Uses the available parent width. The content stays at the left. It does not spread across the row. |
| Surface | Transparent background, no visible border, and no internal padding. |
| Wrapping | The row uses `nowrap`. |
| Location and clock font | `departureMono`, with a monospace fallback. |
| Font size | 12 CSS pixels. |
| Text line height | 16 CSS pixels. The number component adds space for its animation mask. |
| Text and icon colour | Muted blue-grey: `rgb(99, 116, 136)`, or `#637488`. |
| Dot colour | Green: `#31B564`. |
| Solid dot | 6 × 6 CSS pixels. |
| Dot container | 12 × 12 CSS pixels. |
| Ring base size | 12 × 12 CSS pixels, before animation scaling. |
| Weather icon | 12 × 12 CSS pixels, with an 18 × 18 SVG view box. |
| Icon drawing | No fill on the cloud; rounded line ends and joins; stroke width 1.5 SVG units. The dots are filled. |

The full-width selection box in the supplied image is much wider than the visible content. This is consistent with a row that fills its parent while its contents stay at the left.

## 3. Automatic behavior

### Green ring pulse

The centre dot stays in place. A separate ring grows and fades around it.

| Point in cycle | Ring scale | Ring opacity |
| --- | --- | --- |
| Start | 0.5 | 0.6 |
| 70% | 1.5 | 0 |
| End | 1.5 | 0 |

The cycle lasts **2.5 seconds** and repeats without an end. Its timing curve is `cubic-bezier(0, 0, 0.2, 1)`. The last 30% of the cycle leaves the ring invisible before it starts again.

This is a visual pulse. No evidence connected it to a live presence service.

### Clock updates

The clock changed during the review. For example, successive checks showed `09:47:35`, `09:47:41`, and `09:47:56`.

The page uses three `number-flow-react` elements: one each for hours, minutes, and seconds. Each element contains individual digits. Digits move vertically through a masked area as values change. The colons are ordinary text outside those components.

The display supports a rolling number effect rather than a plain text replacement. The exact update interval and animation duration were not measured. The observed seconds are consistent with a clock that updates each second.

The location label suggests London time, but the label alone does not prove that the clock uses `Europe/London`. The time zone calculation was not available in the inspected markup.

### Row entrance

The row sits inside a wrapper with the class `rise-in`. Its CSS defines:

- A start position 16 pixels below the final position.
- A starting blur of 4 pixels.
- A 1.2-second animation with `ease` timing.
- A final position with no vertical offset.

The settled row appeared sharp. This review confirmed the CSS and settled state. It did not record the full entrance from page load. The wrapper does not define an opacity fade in the inspected rule.

### Weather and clock transitions

The weather wrapper defines transitions for opacity and blur, each lasting **0.4 seconds**. The clock wrapper defines the same transition properties, each lasting **0.3 seconds**.

Both were fully visible and sharp when inspected. These rules permit a fade and blur change, but they do not establish its trigger. Loading, weather refresh, and error transitions were not observed.

## 4. User interactions

| Test | Result | Limit |
| --- | --- | --- |
| Click the location text | No navigation, panel, or other visible response. | This records the tested state. |
| Click the weather icon | No forecast, temperature, or tooltip appeared. | The data source remains unknown. |
| Click the clock | No settings or format control appeared. The clock continued to run. | No alternate format was observed. |
| Pointer over tested targets after clicks | No extra content appeared in the captured states. | A separate test of all possible delayed hover behavior was not made. |
| Inspect row controls | No links, buttons, inputs, `tabindex`, explicit roles, title attributes, or ARIA labels were found inside the row. | This does not prove that no JavaScript listener exists. |
| Inspect hover CSS | No matching hover rule was found for the row's descendants in readable page styles. | Runtime behavior can exist without a hover CSS rule. |

There is no evidence of a city selector, weather menu, clock settings, drag action, or other direct control in the selected row.

## 5. Accessibility and motion

- The dot container has `aria-hidden="true"`. The status signal therefore has no text meaning exposed through that element.
- The location is readable text.
- The inspected weather SVG has no accessible condition label or title.
- The clock exposes the active digits in the browser accessibility tree. Inactive digit alternatives use `inert` inside the number components.
- No live-region attribute was found in the row. A local implementation should avoid announcing each second to a screen reader.
- The page has a reduced-motion rule that removes the row's entrance animation, blur, and offset.
- A reduced-motion override for this ring pulse was not found in the inspected CSS. Reduced-motion behavior inside the clock component was not tested.

These are observations and learning notes, not a full accessibility audit.

## 6. What is still unknown

| Question | Evidence needed |
| --- | --- |
| What does the green dot mean? | An explicit label or the original component logic. |
| Is the weather live, cached, simulated, or fixed? | The original data flow or a verified weather response. |
| Which conditions and icons are supported? | The original condition-to-icon mapping. |
| How often does weather refresh? | The original refresh logic or a longer observation. |
| What happens if weather fails to load? | A verified loading or failure state. |
| Does the clock always use London time? | The original time formatting logic. |
| Does the clock handle daylight saving time? | The time zone logic and date-boundary tests. |
| What happens at midnight or after a background tab returns? | A longer observation or the original clock logic. |
| Does the row change on a narrow screen? | A separate viewport test. Only the current browser layout and supplied image were reviewed. |

## 7. How to approach a later local exercise

This is a proposed learning sequence. It does not describe verified internals of the source site.

1. Build the static row first: dot, location, icon, and fixed time. Match spacing and alignment.
2. Add the ring pulse as a separate layer. Keep the centre dot still.
3. Add a clock based on the current time. Use an explicit `Europe/London` time zone if London time is the requirement. Read the current time on each update to prevent accumulated timer error.
4. Add digit motion. The source uses `number-flow-react`; a simpler text clock can establish correct time behavior first.
5. Add the entrance and fade/blur transitions. Define what starts each transition.
6. Use sample weather states first. Add a weather service only after the condition mapping and failure state are defined.
7. Check leading zeroes, minute and hour changes, midnight, daylight saving changes, reduced motion, and a narrow viewport.

Keep automatic display behavior separate from user controls. Add a control only if the later exercise needs one.

## Review method

Evidence came from the supplied image, the live page, its accessibility tree, rendered DOM, computed styles, readable CSS rules, and the clock components' open shadow DOM. Click checks covered the location, weather icon, and hours display. No original application logic or weather service was inspected.

Only this document was added locally. The site implementation was not changed.
