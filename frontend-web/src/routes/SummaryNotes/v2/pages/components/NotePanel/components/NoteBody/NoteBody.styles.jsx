import styled from 'styled-components'

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
`
