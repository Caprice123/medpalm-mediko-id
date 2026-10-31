import styled from 'styled-components'
import { colors, fonts, media } from '../../theme'

// z-index rather than plain `position: relative`: it opens a stacking context
// so Decoration can sit at a negative layer — behind the cards and the heading,
// but still in front of this section's own white background.
export const SectionWrapper = styled.section`
  position: relative;
  z-index: 0;
  background: ${colors.surface};
  padding-block: 44px 56px;
  overflow: hidden;
`

export const Subheading = styled.p`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 18.23px;
  line-height: 1.65;
  color: ${colors.sectionSubheading};
  margin: 6px 0 0;

  ${media.mobile} {
    font-size: 16px;
  }
`

export const CardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-top: 34px;
  /* Leave room for the mascot cluster Figma parks on the right edge. */
  max-width: 976px;

  ${media.desktop} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: none;
  }

  ${media.small} {
    grid-template-columns: 1fr;
  }
`

export const FeatureCard = styled.div`
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  border-radius: 12px;
  padding: 16px 18px 20px;
  min-height: 171px;
  display: flex;
  flex-direction: column;
`

export const CardNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${colors.cardNumberBackground};
  color: ${colors.cardNumber};
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 20.48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

// Figma centres the title over a left-aligned description, which only holds
// together while every title fits on one line. The real titles don't, so the
// card ended up with a centred two-line heading sitting above left-aligned body
// copy and a left-aligned number. Everything shares one edge instead.
export const CardTitle = styled.h3`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 20.48px;
  line-height: 1.35;
  color: #000;
  margin: 14px 0 0;
`

export const CardDescription = styled.p`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 15.57px;
  line-height: 1.41;
  color: #000;
  margin: 6px 0 0;
`

// Decorative blob cluster + mascot anchored to the right edge of the section.
export const Decoration = styled.div`
  position: absolute;
  z-index: -1;
  right: 0;
  top: -18px;
  width: 420px;
  height: 420px;
  pointer-events: none;
  user-select: none;

  ${media.desktop} {
    display: none;
  }
`

export const BlobUnion = styled.img`
  position: absolute;
  right: -106px;
  top: 0;
  width: 301px;
  height: 418px;
`

export const EllipseSmall = styled.img`
  position: absolute;
  right: -106px;
  top: 304px;
  width: 122px;
  height: 122px;
`

export const EllipseLarge = styled.img`
  position: absolute;
  right: -208px;
  top: 226px;
  width: 320px;
  height: 320px;
`

export const DecorMascot = styled.img`
  position: absolute;
  right: 85px;
  top: 146px;
  width: 304px;
  height: 272px;
  object-fit: contain;
`
