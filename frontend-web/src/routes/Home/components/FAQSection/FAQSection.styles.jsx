import styled from 'styled-components'
import { colors, fonts, media } from '../../theme'

export const SectionWrapper = styled.section`
  position: relative;
  background: ${colors.surface};
  padding-block: 56px 64px;
  overflow: hidden;
`

// The mascot is a real column rather than an absolutely positioned overlay with
// a padding-left reserved for it. That padding was a fixed 200px while the
// gutter it had to clear grows with the window, so between 1200px and ~1600px
// the mascot ran straight over the heading.
export const Layout = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 250px) minmax(0, 400px) minmax(0, 1fr);
  column-gap: 48px;
  align-items: start;

  ${media.desktop} {
    grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
    gap: 36px;
  }

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 16px;
  border-radius: 999px;
  background: ${colors.brandBlueLight};
  color: #fff;
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 12.1px;
  letter-spacing: 0.19px;
`

export const Heading = styled.h2`
  font-family: ${fonts.heading};
  font-weight: 800;
  font-size: 40px;
  line-height: 1;
  letter-spacing: -0.52px;
  color: ${colors.headingDark};
  margin: 20px 0 0;

  ${media.mobile} {
    font-size: 30px;
  }
`

export const Description = styled.p`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 17.4px;
  line-height: 1.65;
  color: ${colors.bodyText};
  margin: 18px 0 0;
`

export const ContactLink = styled.a`
  display: inline-block;
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 15px;
  line-height: 1.65;
  color: ${colors.brandBlueLight};
  text-decoration: none;
  margin-top: 16px;

  &:hover {
    text-decoration: underline;
  }
`

export const AccordionList = styled.div`
  border-top: 1px solid ${colors.border};
`

export const AccordionItem = styled.div`
  border-bottom: 1px solid ${colors.border};
`

export const AccordionTrigger = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 77px;
  padding: 18px 15px 18px 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;

  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 17px;
  line-height: 1.5;
  color: ${colors.headingDark};
`

export const ToggleChip = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: ${colors.chipBackground};
`

export const ToggleBar = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 1px;
  transform: translate(-50%, -50%);
`

// The vertical stroke is removed when the row opens, turning the "+" into "−".
export const ToggleBarVertical = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 10px;
  transform: translate(-50%, -50%);
  opacity: ${(props) => (props.$open ? 0 : 1)};
  transition: opacity 0.18s ease;
`

export const AccordionAnswer = styled.div`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 15.5px;
  line-height: 1.7;
  color: ${colors.bodyText};
  padding: 0 60px 22px 0;
`

// Sized by its own grid column, so the copy next to it can never be overlapped
// no matter how wide the window's gutters get.
export const Mascot = styled.img`
  width: 100%;
  height: auto;
  align-self: center;
  object-fit: contain;
  pointer-events: none;
  user-select: none;

  ${media.desktop} {
    display: none;
  }
`
