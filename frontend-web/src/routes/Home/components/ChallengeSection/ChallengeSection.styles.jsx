import styled from 'styled-components'
import { colors, fonts, media } from '../../theme'

export const SectionWrapper = styled.section`
  position: relative;
  background: ${colors.surface};
  padding-block: 40px 48px;
  overflow: hidden;
`

export const BackgroundArt = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 551px;
  height: 532px;
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
  max-width: 460px;
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
  margin-top: 30px;
  /* Reserves the left strip Figma gives the trophy mascot. */
  padding-left: 296px;

  ${media.desktop} {
    padding-left: 0;
  }
`

export const Mascot = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 261px;
  height: 257px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;

  ${media.desktop} {
    display: none;
  }
`

export const ChallengeCard = styled.article`
  background: ${colors.surface};
  border: 1.88px solid ${colors.border};
  border-radius: 18.8px;
  padding: 27px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  height: 26.3px;
  padding: 0 11.3px;
  border-radius: 999px;
  background: ${colors.statusBadgeBackground};
  border: 0.94px solid ${colors.statusBadgeText};
  color: ${colors.statusBadgeText};
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 11.75px;
  letter-spacing: 0.19px;
  white-space: nowrap;
`

export const CardTitle = styled.h3`
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 19.3px;
  line-height: 1.4;
  letter-spacing: -0.2px;
  color: ${colors.cardTitle};
  margin: 22px 0 0;
`

export const CardDescription = styled.p`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 16px;
  line-height: 1.45;
  color: ${colors.cardBody};
  margin: 10px 0 0;
  flex: 1;
`

export const StatRow = styled.div`
  display: flex;
  gap: 56px;
  border-top: 0.94px solid ${colors.statDivider};
  margin-top: 20px;
  padding-top: 19px;

  ${media.small} {
    gap: 28px;
  }
`

export const StatValue = styled.div`
  font-family: ${fonts.body};
  font-weight: 800;
  font-size: 18.8px;
  line-height: 1.65;
  letter-spacing: -0.47px;
  color: ${colors.cardTitle};
`

export const StatLabel = styled.div`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 11.75px;
  line-height: 1.65;
  color: ${colors.statLabel};
`
