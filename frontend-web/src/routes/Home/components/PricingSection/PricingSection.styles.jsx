import styled from 'styled-components'
import { colors, fonts, media } from '../../theme'

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

export const PlanCard = styled.div`
  position: relative;
  background: ${colors.surface};
  border: ${(props) => (props.$popular ? `2px solid ${colors.brandBlueLight}` : `1px solid ${colors.border}`)};
  border-radius: 18px;
  padding: 24px 23px 22px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const PopularBadge = styled.div`
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  height: 21px;
  min-width: 147px;
  padding: 0 14px;
  border-radius: 10.5px;
  background: linear-gradient(98.13deg, ${colors.brandBlue} 0%, ${colors.brandBlueLight} 100%);
  color: #fff;
  font-family: ${fonts.body};
  font-weight: 800;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`

export const PlanLabel = styled.div`
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 12px;
  line-height: 1.65;
  letter-spacing: 1.44px;
  text-transform: uppercase;
  color: ${colors.metaText};
`

export const PlanCredits = styled.div`
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 26px;
  line-height: 1.2;
  letter-spacing: -0.26px;
  color: ${colors.headingDark};
  text-align: center;
  margin-top: 18px;
`

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  min-height: 29px;
`

export const PlanPrice = styled.div`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 21.13px;
  line-height: 1.2;
  letter-spacing: -0.21px;
  color: #424f57;
  white-space: nowrap;
`

export const DiscountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 29.3px;
  min-width: 92px;
  padding: 0 10px;
  border: 1px solid #43a2e0;
  border-radius: 6px;
  color: ${colors.brandBlue};
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 10.83px;
  white-space: nowrap;
`

export const Divider = styled.div`
  height: 1px;
  background: ${colors.border};
  margin-top: 14px;
`

export const FeatureList = styled.ul`
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  gap: 16px;
  flex: 1;
`

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 14.5px;
  line-height: 1.5;
  color: ${colors.bodyText};
`

export const CheckIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 3px;
`

export const PlanButton = styled.button`
  width: 100%;
  height: 42px;
  border-radius: 12px;
  margin-top: 20px;
  cursor: pointer;
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 14px;
  transition: filter 0.18s ease, border-color 0.18s ease;

  ${(props) =>
    props.$popular
      ? `
    background: linear-gradient(100.71deg, ${colors.brandBlue} 0%, ${colors.brandBlueLight} 100%);
    border: 1px solid ${colors.border};
    color: #fff;

    &:hover { filter: brightness(1.06); }
  `
      : `
    background: ${colors.surface};
    border: 1px solid ${colors.border};
    color: ${colors.headingDark};

    &:hover { border-color: ${colors.brandBlueLight}; }
  `}
`
