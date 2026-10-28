import styled from 'styled-components'
import { colors, media } from '../../theme'

export const HeroWrapper = styled.section`
  position: relative;
  background: ${colors.pageBackground};
  overflow: hidden;
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
  padding-block: 48px 0;
  min-height: 520px;

  ${media.desktop} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  ${media.tablet} {
    grid-template-columns: 1fr;
    min-height: 0;
    padding-block: 36px 0;
  }
`

// Lifts the trust card over the boundary between the hero and the ticker,
// the way the design overlaps them.
export const TrustCardSlot = styled.div`
  position: relative;
  padding-block: 32px 0;

  ${media.tablet} {
    padding-block: 28px 0;
  }
`
