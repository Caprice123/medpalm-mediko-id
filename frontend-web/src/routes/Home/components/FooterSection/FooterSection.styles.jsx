import styled from 'styled-components'
import { colors, fonts, media } from '../../theme'

export const FooterWrapper = styled.footer`
  background: ${colors.surface};
  border-top: 1px solid ${colors.border};
  padding-block: 44px 28px;
`

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 40px;
  align-items: start;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`

// Same lockup as the header, a little smaller — see Navbar.styles.
export const Brand = styled.div`
  img {
    height: 36px;
    width: auto;
    display: block;
  }
`

export const Tagline = styled.p`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 15.5px;
  line-height: 1.7;
  color: ${colors.bodyText};
  margin: 12px 0 0;
  max-width: 380px;
`

export const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
`

export const SocialCard = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid ${colors.border};
  border-radius: 14px;
  background: ${colors.surface};
  text-decoration: none;
  transition: border-color 0.18s ease, transform 0.18s ease;

  &:hover {
    border-color: ${colors.brandBlueLight};
    transform: translateY(-1px);
  }
`

export const SocialIcon = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(props) => props.$background || colors.chipBackground};
  color: ${(props) => props.$color || colors.headingDark};

  svg {
    width: 20px;
    height: 20px;
    display: block;
  }
`

export const SocialPlatform = styled.div`
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 14.5px;
  color: ${colors.headingDark};
`

export const SocialHandle = styled.div`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 13px;
  color: ${colors.metaText};
`

export const Copyright = styled.div`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 13.5px;
  color: ${colors.metaText};
  border-top: 1px solid ${colors.border};
  margin-top: 36px;
  padding-top: 20px;
  text-align: center;
`
