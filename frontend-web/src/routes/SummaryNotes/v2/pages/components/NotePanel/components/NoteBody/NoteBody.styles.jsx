import styled, { keyframes, css } from 'styled-components'

// Travels left to right across the reserved box. Kept slow: this sits beside body text the
// reader is already reading, so it has to say "still coming" without pulling the eye off the
// paragraph.
const shimmer = keyframes`
  from { background-position: 150% 0; }
  to { background-position: -50% 0; }
`

// The placeholder a figure shows until its bytes arrive.
//
// It is painted on the `<img>` itself rather than on a wrapper, because an image whose request
// has not finished still paints its own CSS background — and the picture covers it the instant
// it decodes, with no class to swap and no second element to unmount.
const loadingPlaceholder = css`
  /* One reserved height for every figure, not each picture's own. The real dimensions are not
     in the note's JSON — only previewWidth is — so the alternative is reserving nothing and
     letting the page jump by the full height of each figure as it lands. A uniform box absorbs
     most of that, and what is left is the difference between this height and the real one.

     Only while loading: the moment the picture arrives the attribute goes, this rule stops
     applying, and the figure takes its natural size. Holding the box afterwards would letterbox
     a short diagram or crop a tall one, and clinical figures are read for their detail. */
  min-height: 220px;

  /* A fallback, not an override: BlockNote writes the width from previewWidth as an inline
     style, which wins over this. It only applies to a figure that was saved without one, where
     an unloaded image would otherwise be zero pixels wide and show no placeholder at all. */
  width: 100%;

  background-color: var(--color-gray-100);
  background-image: linear-gradient(
    100deg,
    transparent 25%,
    var(--color-surface) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
  background-repeat: no-repeat;
  animation: ${shimmer} 1.5s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    /* The reserved box and its tint stay — they are the part that carries the meaning. Only
       the travelling highlight goes. */
    animation: none;
  }
`

export const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;

  /* BlockNote ships its own typography sized for an editor, not for long-form
     reading, and it has no font-size API. Scaling it here — rather than zooming the
     whole pane — keeps the toolbar, the outline and the chrome fixed while only the
     prose grows. */
  .bn-editor {
    padding-inline: 0;
    background: transparent;
  }

  .bn-block-content {
    font-size: calc(1.0625rem * var(--reader-font-scale));
    line-height: 1.75;
    color: var(--color-gray-800);
  }

  .bn-editor h1 { font-size: calc(1.625rem * var(--reader-font-scale)); }
  .bn-editor h2 { font-size: calc(1.3125rem * var(--reader-font-scale)); }
  .bn-editor h3 { font-size: calc(1.0625rem * var(--reader-font-scale)); }

  .bn-editor h1,
  .bn-editor h2,
  .bn-editor h3 {
    line-height: 1.3;
    color: var(--color-gray-900);
  }

  /* Headings need air above them so a new section reads as a break rather than as
     the next paragraph — but not on the first block, which already sits under the
     note's description.

     Margin rather than padding on purpose: the outline measures this very element to
     decide where to scroll and which entry is current, and a border box includes its
     padding but not its margin. As padding, this 1.25rem was added to every jump,
     landing each heading that much below where the outline aimed. */
  .bn-block-outer:not(:first-child) > .bn-block > .bn-block-content[data-content-type="heading"] {
    margin-top: 1.25rem;
  }

  img {
    border-radius: 8px;
  }

  /* Set by useImageLoadingState, cleared on the image's own load or error event. */
  img[data-loading] {
    ${loadingPlaceholder}
  }
`
