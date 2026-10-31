import styled from 'styled-components'
import { colors, fonts, media } from '../../../../../../theme'

// Each card floats over the art, anchored by percentages of the art box so the
// three keep their positions relative to the mascot at every width.
export const CardRoot = styled.div`
  position: absolute;
  left: ${(props) => props.$left};
  top: ${(props) => props.$top};
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 18px 13px 14px;
  border-radius: 18px;
  background: ${colors.surface};
  box-shadow: 0 0 0 1px rgba(14, 42, 56, 0.05), 0 18px 38px -22px rgba(14, 42, 56, 0.45);
  white-space: nowrap;

  ${media.desktop} {
    padding: 11px 15px 11px 12px;
    gap: 10px;
    border-radius: 16px;
  }

  ${media.mobile} {
    padding: 9px 12px 9px 10px;
    gap: 8px;
    border-radius: 14px;
  }
`

export const IconChip = styled.span`
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$background};
  color: ${(props) => props.$color};

  svg {
    width: 19px;
    height: 19px;
    display: block;
  }

  ${media.desktop} {
    width: 33px;
    height: 33px;
    border-radius: 10px;

    svg {
      width: 17px;
      height: 17px;
    }
  }

  ${media.mobile} {
    width: 28px;
    height: 28px;
    border-radius: 9px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`

export const Value = styled.div`
  font-family: ${fonts.body};
  font-weight: 800;
  font-size: 23px;
  line-height: 1.15;
  letter-spacing: -0.7px;
  /* Same dark as the sign-in card's figures, so the two surfaces that show
     these counts show them identically. */
  color: ${colors.headingDark};
  /* The digits change every frame while counting; tabular figures stop the
     card from twitching wider and narrower as they do. */
  font-variant-numeric: tabular-nums;

  ${media.desktop} {
    font-size: 20px;
  }

  ${media.mobile} {
    font-size: 17px;
  }
`

export const Label = styled.div`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 12px;
  line-height: 1.25;
  color: ${colors.textSecondary};
  margin-top: 2px;

  ${media.mobile} {
    font-size: 10.5px;
  }
`
