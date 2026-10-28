import styled from 'styled-components'
import { colors, fonts, media } from '../../theme'

export const SectionWrapper = styled.section`
  position: relative;
  background: ${colors.pageBackground};
  padding-block: 50px 56px;
  overflow: hidden;
`

export const HeaderBlock = styled.div`
  position: relative;
  /* Wide enough to keep the heading on one line, as in Figma. */
  max-width: 880px;
`

export const Description = styled.p`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 18px;
  line-height: 1.7;
  color: ${colors.bodyText};
  margin: 10px 0 0;

  ${media.mobile} {
    font-size: 16px;
  }
`

// Anchored to the section rather than the header block, matching the Figma
// position 124px in from the right edge of the frame.
export const Mascot = styled.img`
  position: absolute;
  right: 124px;
  top: 32px;
  width: 174px;
  height: 184px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;

  ${media.desktop} {
    display: none;
  }
`

export const TestimonialCard = styled.article`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 18px;
  filter: drop-shadow(0 8px 12px rgba(20, 40, 55, 0.05));
  padding: 31px 24px 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const QuoteRow = styled.div`
  display: flex;
  gap: 7px;
  align-items: flex-start;
`

export const QuoteMark = styled.img`
  width: 22px;
  height: 18.34px;
  flex-shrink: 0;
`

export const QuoteText = styled.p`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 15.5px;
  line-height: 1.7;
  color: ${colors.bodyText};
  margin: 0;
`

export const Divider = styled.div`
  height: 1px;
  background: ${colors.hairline};
  margin: 22px 2px 0;
`

export const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
`

export const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background: ${colors.avatarBackground};
  border: 1px solid ${colors.avatarBorder};
  flex-shrink: 0;
`

export const AuthorName = styled.div`
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 14.5px;
  line-height: 1.65;
  color: ${colors.headingDark};
`

export const AuthorDetail = styled.div`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 13px;
  line-height: 1.65;
  color: ${colors.metaText};
`
