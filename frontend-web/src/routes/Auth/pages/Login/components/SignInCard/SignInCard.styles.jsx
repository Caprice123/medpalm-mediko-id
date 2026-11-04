import styled from 'styled-components'
import { colors, fonts, media } from '@routes/Home/theme'

export const Card = styled.div`
  width: 100%;
  padding: 40px;
  border-radius: 26px;
  background: ${colors.surface};
  /* Hairline as a shadow ring plus a real offset elevation, rather than a 1px
     border and a flat halo. */
  box-shadow: 0 0 0 1px rgba(21, 36, 46, 0.09), 0 32px 64px rgba(21, 36, 46, 0.13);

  ${media.tablet} {
    max-width: 440px;
    margin-inline: auto;
  }

  ${media.small} {
    padding: 28px 20px;
    border-radius: 22px;
  }
`

export const Title = styled.h2`
  margin: 0;
  font-family: ${fonts.heading};
  font-weight: 800;
  font-size: 31px;
  line-height: 1.16;
  letter-spacing: -0.5px;
  color: ${colors.headingDark};

  ${media.small} {
    font-size: 27px;
  }
`

export const Subtitle = styled.p`
  margin: 10px 0 0;
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 15px;
  line-height: 1.65;
  color: ${colors.textSecondary};
`

// Google renders its own button inside an iframe, so its chrome can't be
// restyled — only sized and shaped through the component's props, and only
// `size`, `text` and `width` are set here. The themed variants were tried and
// dropped: `filled_blue` paints it Google's #1a73e8 against the brand's
// var(--color-brand-blue), and two blues that close together read as a mistake. The default
// outline is also the button users have been trained to look for.
export const GoogleSlot = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  width: 100%;

  > div {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
  }

  iframe {
    margin: 0 auto !important;
  }
`

export const Note = styled.p`
  margin: 18px 0 0;
  font-family: ${fonts.body};
  font-weight: 400;
  font-size: 13.5px;
  line-height: 1.6;
  color: ${colors.textSecondary};
  text-align: center;
`

export const CountRow = styled.dl`
  margin: 26px 0 0;
  padding-top: 20px;
  display: flex;
  box-shadow: inset 0 1px 0 rgba(21, 36, 46, 0.08);
`

export const CountItem = styled.div`
  flex: 1;
  text-align: center;
`

export const CountValue = styled.dd`
  margin: 0;
  font-family: ${fonts.display};
  font-weight: 600;
  font-size: 20px;
  line-height: 1.2;
  /* Dark, not brand blue. The page now runs on exactly two text colours —
     headingDark for anything that carries weight, textSecondary for the rest —
     and a third applied to three figures read as an accident. */
  color: ${colors.headingDark};
  /* The digits change every frame while the counter sweeps; tabular figures
     stop the three columns twitching wider and narrower as they do. */
  font-variant-numeric: tabular-nums;
`

export const CountLabel = styled.dt`
  margin-top: 2px;
  font-family: ${fonts.body};
  font-weight: 500;
  font-size: 11.5px;
  line-height: 1.4;
  color: ${colors.textSecondary};
`
