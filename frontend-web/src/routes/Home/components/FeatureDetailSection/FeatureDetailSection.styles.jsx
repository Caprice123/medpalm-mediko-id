import styled, { keyframes } from 'styled-components'
import { colors, fonts, media } from '../../theme'

// AOS only fires when an element scrolls into view, so it cannot animate the
// panel when the reader switches tabs without scrolling. This runs on mount
// instead, and the panel is remounted on every tab change.
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
`

export const SectionWrapper = styled.section`
  position: relative;
  background: ${colors.eventBackground};
  padding-block: 44px 56px;
  overflow: hidden;
`

export const FrameLeft = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 287px;
  height: 644px;
  object-fit: cover;
  transform: rotate(180deg);
  pointer-events: none;
  user-select: none;

  ${media.desktop} {
    display: none;
  }
`

export const Heading = styled.h2`
  position: relative;
  font-family: ${fonts.heading};
  font-weight: 800;
  font-size: 46.66px;
  line-height: 1.12;
  letter-spacing: -0.43px;
  color: #000;
  margin: 0;

  /* Figma tints the whole second line brand blue. */
  span {
    display: block;
    color: ${colors.brandBlue};
  }

  ${media.tablet} {
    font-size: 36px;
  }

  ${media.mobile} {
    font-size: 28px;
  }
`

export const Description = styled.p`
  position: relative;
  font-family: ${fonts.body};
  font-weight: 500;
  font-size: 20.44px;
  line-height: 1.66;
  color: #39464d;
  margin: 18px 0 0;

  ${media.tablet} {
    font-size: 17px;
  }
`

export const TabRow = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 11px;
  margin-top: 36px;
`

export const Tab = styled.button`
  min-width: 157px;
  /* The labels are feature names straight from the admin panel, so they run as
     long as "Flashcard Belajar Interaktif". A fixed 45px height clipped those
     once they wrapped inside a narrow pill; min-height keeps Figma's 45px for
     every single-line label and lets the rest grow instead. */
  min-height: 45px;
  padding: 10px 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 30px;
  cursor: pointer;
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 14.5px;
  line-height: 1.25;
  transition: filter 0.18s ease, border-color 0.18s ease;

  ${(props) =>
    props.$active
      ? `
    background: linear-gradient(105.99deg, ${colors.brandBlue} 0%, ${colors.brandBlueLight} 100%);
    border: 2px solid #4fb6ec;
    color: #fff;

    &:hover { filter: brightness(1.05); }
  `
      : `
    background: ${colors.surface};
    border: 2px solid ${colors.border};
    color: ${colors.textNav};

    &:hover { border-color: ${colors.brandBlueLight}; }
  `}

  ${media.small} {
    min-width: 0;
    flex: 1 1 calc(50% - 11px);
  }
`

export const PanelGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 515px) minmax(0, 1fr);
  gap: 55px;
  align-items: center;
  margin-top: 40px;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`

export const Illustration = styled.div`
  position: relative;
  overflow: hidden;
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  border-radius: 18px;
  min-height: 264px;
  /* Figma draws the frame at 515x264; 16:9 keeps the embedded video undistorted
     while staying close to that shape. */
  aspect-ratio: 515 / 264;
  animation: ${fadeUp} 0.45s ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const VideoFrame = styled.iframe`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
`

// Figma bounds the panel copy at x=1234 so it stops short of the mascot
// cluster in the bottom-right corner.
export const PanelBody = styled.div`
  max-width: 565px;

  /* Each child eases in slightly after the one above it. */
  > * {
    animation: ${fadeUp} 0.45s ease-out both;
  }
  > *:nth-child(2) { animation-delay: 0.07s; }
  > *:nth-child(3) { animation-delay: 0.14s; }

  @media (prefers-reduced-motion: reduce) {
    > * { animation: none; }
  }
`

export const PanelTitle = styled.h3`
  font-family: ${fonts.body};
  font-weight: 700;
  font-size: 28.84px;
  line-height: 1.2;
  letter-spacing: -0.29px;
  color: ${colors.headingDark};
  margin: 0;

  ${media.mobile} {
    font-size: 23px;
  }
`

export const PanelDescription = styled.p`
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 17.83px;
  line-height: 1.65;
  color: ${colors.bodyText};
  margin: 14px 0 0;

  ${media.mobile} {
    font-size: 16px;
  }
`

export const PointList = styled.ul`
  list-style: none;
  margin: 24px 0 0;
  padding: 0;
  display: grid;
  gap: 2px;
`

export const PointItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 13px;
  min-height: 28.4px;
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 17.24px;
  line-height: 1.65;
  color: ${colors.bodyText};
`

export const PointIcon = styled.img`
  width: 19.4px;
  height: 19.4px;
  flex-shrink: 0;
  margin-top: 4px;
`

export const Decoration = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 360px;
  height: 300px;
  pointer-events: none;
  user-select: none;

  ${media.desktop} {
    display: none;
  }
`

export const BlobUnion = styled.img`
  position: absolute;
  right: -68px;
  bottom: 0;
  width: 344px;
  height: 271px;
`

export const DecorMascot = styled.img`
  position: absolute;
  right: -42px;
  bottom: 57px;
  width: 230px;
  height: 242px;
  object-fit: contain;
`
