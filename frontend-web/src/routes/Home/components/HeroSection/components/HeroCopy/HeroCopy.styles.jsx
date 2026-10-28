import styled from 'styled-components'
import { colors, fonts, gradients, media } from '../../../../theme'

export const CopyBlock = styled.div`
  max-width: 507px;
`

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 21px;
  border-radius: 14px;
  background: ${colors.eyebrowBackground};
  color: ${colors.brandBlueDeep};
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 13.24px;
  text-transform: capitalize;
  white-space: nowrap;

  ${media.small} {
    font-size: 12px;
    padding: 0 14px;
    white-space: normal;
    height: auto;
    padding-block: 7px;
  }
`

export const Title = styled.h1`
  font-family: ${fonts.heading};
  font-weight: 800;
  font-size: 54px;
  line-height: 1.12;
  letter-spacing: -0.5px;
  color: ${colors.headingDark};
  margin: 18px 0 0;

  /* Figma colours the second line in brand blue and tracks it slightly wider. */
  span {
    display: block;
    color: ${colors.brandBlue};
    letter-spacing: 1.2px;
  }

  ${media.desktop} {
    font-size: 46px;
  }

  ${media.tablet} {
    font-size: 40px;
  }

  ${media.small} {
    font-size: 32px;
  }
`

export const Description = styled.p`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 17.27px;
  line-height: 1.46;
  color: ${colors.brandBlueDeep};
  margin: 20px 0 0;

  ${media.small} {
    font-size: 15px;
  }
`

export const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 33px;
`

export const PrimaryCta = styled.button`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 16.87px;
  color: #fff;
  background: ${gradients.cta};
  border: 1.12px solid transparent;
  border-radius: 13.49px;
  height: 54px;
  padding: 0 28px;
  cursor: pointer;
  transition: filter 0.18s ease, transform 0.18s ease;

  &:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }
`

export const SecondaryCta = styled.button`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 16.87px;
  color: ${colors.headingDark};
  background: ${colors.surface};
  border: 1.12px solid ${colors.border};
  border-radius: 13.49px;
  height: 54px;
  padding: 0 28px;
  cursor: pointer;
  transition: border-color 0.18s ease, transform 0.18s ease;

  &:hover {
    border-color: ${colors.brandBlueLight};
    transform: translateY(-1px);
  }
`
