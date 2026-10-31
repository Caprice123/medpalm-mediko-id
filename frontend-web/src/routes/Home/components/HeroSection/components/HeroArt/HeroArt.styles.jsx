import styled from 'styled-components'
import { heroChrome, media } from '../../../../theme'

// The art is laid out against the same reference box Figma uses — the region of
// the 1440x774 hero frame running x 620..1440, y 120..680. Keeping the children
// positioned as percentages of that box preserves where the stat cards sit
// relative to the mascot at every width.
/* The art is the tallest thing in the hero, so it is what has to give when the
   window is short enough that the hero and the ticker cannot both fit.

   Capping its height directly would not work: with an explicit width AND a
   capped height, `aspect-ratio` is overruled and the box simply squashes,
   distorting every percentage-positioned child inside it. Capping the WIDTH
   against the height still available keeps the ratio exact, so the art scales
   down whole. 1.4643 is 820/560, turning leftover height into a width.

   Both terms of that cap vary, and not with the same thing — the column with
   the window's width, the leftover height with the chrome budget in play — so
   each is a custom property and the width itself is written once. */

// The floor under all of that: below roughly two thirds of the 820px Figma
// draws, the mascot and its stat cards stop reading as an illustration and
// start reading as a thumbnail.
const MIN_WIDTH = '520px'

export const ArtBox = styled.div`
  --art-column: 100%;
  --hero-chrome: ${heroChrome.full};

  position: relative;
  aspect-ratio: 820 / 560;

  /* clamp() reads MIN first and MAX last: never below MIN_WIDTH, never wider
     than the column, and the height cap in between. */
  width: clamp(
    ${MIN_WIDTH},
    calc((100vh - var(--hero-chrome)) * 1.4643),
    var(--art-column)
  );

  /* On a short window the cap makes the art narrower than the column it sits
     in. Left-aligned that left a dead strip of background against the right
     edge of the screen; pinned to the end it stays in the corner Figma puts it
     in, and the slack opens up between the copy and the art instead. */
  justify-self: end;

  ${media.shortViewport} {
    --hero-chrome: ${heroChrome.compact};
  }

  /* In Figma the art runs past the 1260px content column into the right
     gutter. HeroWrapper clips the overflow at the viewport edge. */
  @media (min-width: 1200px) {
    --art-column: calc(100% + 90px);
  }

  ${media.tablet} {
    /* The hero is no longer height-constrained here, so the art goes back to
       being sized purely by its column. */
    width: 100%;
    max-width: 560px;
    margin: 0 auto;
    justify-self: center;
  }

  ${media.mobile} {
    /* The stat cards hang off both edges of the mascot, so the art needs room
       inside its column for them rather than bleeding them off-screen. */
    max-width: 440px;
  }
`

// The artwork is square (1750x1750), so height drives it and the leftover
// width on either side is what the stat cards float over.
export const Mascot = styled.img`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`
