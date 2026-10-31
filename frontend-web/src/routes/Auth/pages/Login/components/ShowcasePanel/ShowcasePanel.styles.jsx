import styled from 'styled-components'
import { colors, fonts, media } from '@routes/Home/theme'

export const PanelRoot = styled.div`
  ${media.tablet} {
    text-align: center;
  }
`

export const Headline = styled.h1`
  margin: 0;
  /* Capped independently of the column: the grid track is wide enough for the
     art, which would otherwise stretch the headline into a single long line. */
  max-width: 540px;
  /* Matched to the landing hero's Title, value for value — same face, size,
     leading and tracking, so the two headings read as one typeface decision
     rather than two near-misses. */
  font-family: ${fonts.heading};
  font-weight: 800;
  font-size: 54px;
  line-height: 1.12;
  letter-spacing: -0.5px;
  color: ${colors.headingDark};

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

// The headline's later lines, in brand blue and tracked slightly wider —
// the same two-tone treatment the landing hero gives `home_hero_title`.
export const HeadlineAccent = styled.span`
  display: block;
  color: ${colors.brandBlue};
  letter-spacing: 1.2px;
`

export const Lede = styled.p`
  margin: 20px 0 0;
  max-width: 460px;
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 18px;
  line-height: 1.65;
  color: ${colors.textSecondary};

  ${media.tablet} {
    margin-inline: auto;
    font-size: 16.5px;
  }
`

// The mascot and the real product UI together, the way the landing hero pairs
// them. Fixed height because both children are absolutely positioned against
// it.
export const Art = styled.div`
  position: relative;
  /* The two children overlap and share a baseline, so the box is sized to the
     mascot — the tallest of them — rather than to the pair stacked. */
  height: 276px;
  max-width: 580px;
  margin-top: 30px;

  ${media.desktop} {
    height: 238px;
  }

  ${media.tablet} {
    height: 226px;
    margin-inline: auto;
  }

  ${media.small} {
    height: 176px;
  }
`

// Overlaps the mascot's shoulder rather than sitting clear of it, so the pair
// reads as one object instead of two things that happen to share a row.
export const ProductFrame = styled.div`
  position: absolute;
  left: 38%;
  top: 6%;
  width: 62%;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(21, 36, 46, 0.1), 0 26px 54px rgba(21, 36, 46, 0.15);

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`

// The artwork is square (1750x1750) with the raised arms near its top edge, so
// the width sets the height too — anything wider than this and the cheer
// collides with the product frame beside it.
export const Mascot = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 44%;
  min-width: 190px;
  height: auto;
  pointer-events: none;
  user-select: none;

  ${media.small} {
    min-width: 150px;
  }
`
