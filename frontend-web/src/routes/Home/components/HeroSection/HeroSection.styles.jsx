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

export const BackgroundRight = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 84.5%;
  height: 100%;
  object-fit: cover;
  object-position: right top;
`

export const BackgroundLeft = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 27.7%;
  height: 100%;
  object-fit: cover;
  object-position: left top;
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

  /* Takes whatever the trust card leaves. The art inside caps itself against
     the same budget, so on a short window the whole hero scales down together
     instead of pushing the ticker off the screen. */
  flex: 1;
  min-height: 0;

  ${media.desktop} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  ${media.tablet} {
    grid-template-columns: 1fr;
    padding-block: 36px 0;
    flex: none;
  }
`

// The trust card sits inside the hero, not across its boundary: Figma puts the
// card at y 521..648 and ends the hero plate at 685, so 37px of hero background
// runs underneath it before the ticker starts. The ticker then butts straight
// against that edge with no margin of its own.
//
// This used to have no bottom padding at all, which left the card touching the
// ticker.
export const TrustCardSlot = styled.div`
  position: relative;
  padding-block: 32px 37px;

  ${media.tablet} {
    padding-block: 28px 28px;
  }
`
