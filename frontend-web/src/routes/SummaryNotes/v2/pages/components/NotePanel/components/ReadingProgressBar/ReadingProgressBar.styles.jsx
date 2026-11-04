import styled from 'styled-components'

export const ProgressTrack = styled.div`
  flex-shrink: 0;
  height: 2px;
  background: var(--color-gray-100);
  overflow: hidden;
`

// Full width and scaled horizontally, with no transition: the scale is rewritten
// once per animation frame from the scroll position, so any easing would make the
// bar lag behind the scroll rather than smooth it. The changing value is set as an
// inline transform rather than interpolated into this template, which would make
// styled-components generate and inject a fresh class for every distinct value.
export const ProgressFill = styled.div`
  height: 100%;
  width: 100%;
  transform: scaleX(0);
  transform-origin: left center;
  background: var(--color-brand-blue);
  will-change: transform;
`
