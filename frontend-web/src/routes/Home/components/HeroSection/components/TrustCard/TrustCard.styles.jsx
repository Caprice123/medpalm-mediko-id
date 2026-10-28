import styled from 'styled-components'
import { colors, fonts, media } from '../../../../theme'

export const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: ${colors.surface};
  border-radius: 28px;
  padding: 23px 15px;
  box-shadow: 0 18px 40px -28px rgba(14, 42, 56, 0.35);

  ${media.mobile} {
    grid-template-columns: 1fr;
    padding: 8px 16px;
  }
`

export const TrustItem = styled.div`
  position: relative;
  text-align: center;
  padding: 0 34px;

  /* Figma separates the items with a hairline rule rather than a border. */
  & + &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 71px;
    background: ${colors.divider};
  }

  ${media.mobile} {
    padding: 16px 0;

    & + &::before {
      left: 0;
      right: 0;
      top: 0;
      transform: none;
      width: 100%;
      height: 1px;
    }
  }
`

export const TrustValue = styled.div`
  font-family: ${fonts.body};
  font-weight: 800;
  font-size: 40px;
  line-height: 1.26;
  letter-spacing: -1.4px;
  color: ${colors.headingDarker};

  ${media.tablet} {
    font-size: 32px;
  }
`

export const TrustLabel = styled.div`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 14.72px;
  line-height: 1.25;
  color: ${colors.textSecondary};
  margin-top: 6px;
`
