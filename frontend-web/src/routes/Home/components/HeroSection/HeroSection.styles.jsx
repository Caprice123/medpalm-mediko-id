import styled from 'styled-components'
import { ContentWidth } from '../../Home.styles'
import { colors, layout, media } from '../../theme'

export const HeroWrapper = styled.section`
  position: relative;
  background: ${colors.pageBackground};
  overflow: hidden;

  /* The hero and the ticker together fill the first screen, the way Figma
     draws them: on its 774px-tall frame the header covers 0..75, the hero
     plate runs to 685 and the ticker closes the frame at 774.
     min-height rather than height, so a window too short for even the
     compressed hero scrolls instead of clipping it. */
  min-height: calc(100vh - ${layout.headerHeight} - ${layout.tickerHeight});
  display: flex;
  flex-direction: column;

  /* ContentWidth is the hero's only in-flow child — the background plates are
     absolutely positioned — so it has to pass the height down for HeroGrid to
     take up the slack. */
  ${ContentWidth} {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  ${media.tablet} {
    /* Stacked, the hero is taller than a phone screen on its own. Forcing it
       into one would squash the art and the copy to nothing. */
    min-height: 0;
  }
`

// The two pastel leaf plates Figma puts behind the hero. They are decoration
// only — never let them swallow clicks or get announced to screen readers.
export const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
`

// This plate is the whole backdrop, not just a right-hand panel: the blob and
// the leaves live on its right, but its left half carries the soft waves that
// are supposed to run underneath the headline. Squeezing it into the 84.5% the
// Figma frame measures pushed those waves off the copy and left a seam where
// the left plate ended, so it spans the hero instead.
//
// It is also the ONLY plate. A second image used to be layered over the first
// 27.7%, and because both were `cover`-scaled to a hero whose height changes,
// the two never agreed on scale — they met in a visible vertical seam. This
// one already carries the left-hand waves, so the overlap bought nothing.
export const BackgroundRight = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right top;
`

export const HeroGrid = styled.div`
  position: relative;
  display: grid;
  /* Figma lays the headline out in a column exactly 507px wide (x 144..651),
     which is what keeps it to two lines. Pin that width and let the art take
     the rest, rather than splitting the row by ratio. */
  grid-template-columns: 507px minmax(0, 1fr);
  align-items: center;
  gap: 24px;
  padding-block: 40px 0;

  /* Takes the whole hero plate now that the trust card no longer sits under
     it. The art inside caps itself against the same budget, so on a short
     window the hero scales down instead of pushing the ticker off screen. */
  flex: 1;
  min-height: 0;

  /* Half the top padding, handed to the art. See heroChrome in the theme —
     this is one of the terms its compact total counts. */
  ${media.shortViewport} {
    padding-block: 20px 0;
  }

  ${media.desktop} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  ${media.tablet} {
    grid-template-columns: 1fr;
    padding-block: 36px 0;
    flex: none;
  }
`

// The hero plate needs a band of its own background between the art and the
// ticker — Figma ends the plate 37px below the card that used to sit here.
// With the figures moved onto the art, that band is all this is.
export const HeroFloor = styled.div`
  height: 37px;
  flex: none;

  ${media.shortViewport} {
    height: 22px;
  }
`
