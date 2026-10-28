import styled from 'styled-components'
import { colors, fonts, gradients, media } from '../../theme'

export const SectionWrapper = styled.section`
  position: relative;
  background: ${colors.eventBackground};
  padding-block: 40px 48px;
  overflow: hidden;
`

export const BackgroundArt = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 489px;
  height: 275px;
  object-fit: cover;
  pointer-events: none;
  user-select: none;

  ${media.desktop} {
    display: none;
  }
`

export const SectionTop = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
`

export const HeaderBlock = styled.div`
  max-width: 520px;
`

// Figma paints the "Free Event" heading with a gradient fill rather than a
// flat colour, so the gradient is clipped to the glyphs.
export const GradientHeading = styled.h2`
  font-family: ${fonts.heading};
  font-weight: 800;
  font-size: 56px;
  line-height: 1.12;
  letter-spacing: -0.52px;
  margin: 0;
  background-image: ${gradients.eventHeading};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

  ${media.tablet} {
    font-size: 42px;
  }

  ${media.mobile} {
    font-size: 34px;
  }
`

export const Description = styled.p`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 18px;
  line-height: 1.7;
  color: ${colors.cardBody};
  margin: 8px 0 0;

  ${media.mobile} {
    font-size: 16px;
  }
`

export const ViewAllLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.11px;
  color: ${colors.brandBlueLight};
  text-decoration: none;
  padding-top: 18px;

  &:hover {
    text-decoration: underline;
  }

  ${media.mobile} {
    display: none;
  }
`

export const ViewAllIcon = styled.img`
  width: 23.5px;
  height: 23.5px;
`

export const CardsArea = styled.div`
  position: relative;
  margin-top: 26px;
  /* Keeps the card row clear of the megaphone mascot on wide screens. */
  padding-left: 200px;

  ${media.desktop} {
    padding-left: 0;
  }
`

export const Mascot = styled.img`
  position: absolute;
  left: 0;
  top: 48px;
  width: 192px;
  height: 192px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;

  ${media.desktop} {
    display: none;
  }
`

export const EventCard = styled.article`
  position: relative;
  background: ${colors.surface};
  border: 0.97px solid ${colors.border};
  border-radius: 15.48px;
  padding: 22px 21px 21px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 92px;
`

export const FreeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 21.3px;
  padding: 0 12.6px;
  border-radius: 999px;
  background: ${colors.freeBadgeBackground};
  color: #fff;
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.16px;
  white-space: nowrap;
`

export const DateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 21.3px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${colors.dateBadgeBackground};
  color: ${colors.dateBadgeText};
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.16px;
  white-space: nowrap;
`

export const Thumbnail = styled.div`
  position: absolute;
  right: 19px;
  top: 17.4px;
  width: 80.3px;
  height: 61px;
  border-radius: 7.74px;
  background: ${colors.imagePlaceholder};
`

export const CardTitle = styled.h3`
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 18.9px;
  line-height: 1.4;
  letter-spacing: -0.2px;
  color: ${colors.cardTitle};
  margin: 24px 0 0;
`

export const CardDescription = styled.p`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 14.67px;
  line-height: 1.65;
  color: ${colors.cardBody};
  margin: 8px 0 0;
  flex: 1;
`

export const CardLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  align-self: flex-start;
  margin-top: 16px;
  height: 37.7px;
  padding: 0 18px;
  border: 1.03px solid ${colors.brandBlue};
  border-radius: 31px;
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 14.45px;
  color: ${colors.brandBlue};
  text-decoration: none;
  transition: background 0.18s ease;

  &:hover {
    background: rgba(30, 115, 170, 0.07);
  }
`

export const CardLinkArrow = styled.img`
  width: 22.7px;
  height: 8px;
`
