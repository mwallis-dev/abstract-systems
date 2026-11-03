# MY DRAFT PLAN

**Chosen entrance:** Match (rise + fade split, 1200ms ease). Lives on `fade-in.html` / `src/fade-in.css` only — not on `profile.html`. Other variants stay in `proto/entrance/` for comparison.

Using fade-in.html build a local demo of the entrance animation on https://www.abstract.systems/.   

Match the motion and timing.   

Use this project’s existing stack.

Implement two CSS keyframe animations. Both run once for 1,200 ms with the CSS keyword `ease` (`cubic-bezier(0.25, 0.1, 0.25, 1)`) and `animation-fill-mode: forwards`.

1. **Rise and sharpen.** Give `.rise-in` a base `transform: translateY(16px)` and `filter: blur(4px)`. Keep opacity at `1` throughout, including during the delay. Use a `rise-settle` keyframe with a `to` state of `transform: translateY(0)` and `filter: blur(0px)`. Let the base styles supply the start state.
2. **Fade, rise, and sharpen.** Give `.fade-in` a base `opacity: 0` so delayed elements stay hidden. Animate from `opacity: 0`, `transform: translateY(16px)`, and `filter: blur(4px)` to `opacity: 1`, `transform: translateY(0)`, and `filter: blur(0px)`. Animate all three properties together over the full duration.

Put each animation class on its own wrapper.   
  
Keep the wrappers in normal layout so their space is reserved from the first paint.   

Keep the overlaps.   
  
Let CSS start the sequence on page load, including for content below the fold.   
  
Use a reload to replay it.   
  
Keep the motion on the wrappers so the layout stays fixed and each page element moves as a unit.

Under `prefers-reduced-motion: reduce`, disable both animations and set both wrapper types to `opacity: 1`, `transform: none`, and `filter: none`.   
  
All content must be clear and visible immediately.  
  
On reload, check that delayed intro blocks are visible but blurred and offset, and that delayed fade wrappers are hidden until their start time. 
