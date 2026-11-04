import styled from 'styled-components'
import { colors, fonts, media } from '../../theme'

// Section staging only — heading block, mascot and background. The pricing
// card itself is `@components/common/PricingPlanCard`, shared with /topup.

export const SectionWrapper = styled.section`
  position: relative;
  background: ${colors.surface};
  padding-block: 40px 56px;
  overflow: hidden;
`

export const HeaderBlock = styled.div`
  position: relative;
  max-width: 820px;
`

export const Description = styled.p`
  font-family: ${fonts.body};
  font-weight: 500;
  font-size: 20.44px;
  line-height: 1.66;
  color: ${colors.bodyText};
  margin: 8px 0 0;

  ${media.tablet} {
    font-size: 17px;
  }
`

// Anchored to the section, not the header block — Figma parks it 12px from the
// right edge of the 1440px frame, well outside the text column.
export const Mascot = styled.img`
  position: absolute;
  right: 12px;
  top: 10px;
  width: 283px;
  height: 196px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;

  ${media.desktop} {
    display: none;
  }
`
