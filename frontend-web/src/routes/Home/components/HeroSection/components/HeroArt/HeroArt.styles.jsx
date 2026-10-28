import styled from 'styled-components'
import { media } from '../../../../theme'

// The art is laid out against the same reference box Figma uses — the region of
// the 1440x774 hero frame running x 620..1440, y 120..680. Keeping the children
// positioned as percentages of that box preserves the overlap between the
// mascot and the two floating UI cards at every width.
export const ArtBox = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 820 / 560;

  /* In Figma the art runs past the 1260px content column into the right
     gutter. HeroWrapper clips the overflow at the viewport edge. */
  @media (min-width: 1200px) {
    width: calc(100% + 90px);
  }

  ${media.tablet} {
    max-width: 560px;
    margin: 0 auto;
  }
`

export const Mascot = styled.img`
  position: absolute;
  left: 12.44%;
  top: 7.32%;
  width: 59.87%;
  height: 90%;
  max-width: 100%;
  object-fit: contain;
`

// Both cards are crops of one exported sprite, so each sits in an
// overflow-hidden frame with the shared image offset inside it.
const CardFrame = styled.div`
  position: absolute;
  overflow: hidden;
  pointer-events: none;
`

export const TopCardFrame = styled(CardFrame)`
  left: 52.8%;
  top: 2.14%;
  width: 38.93%;
  height: 50.18%;
`

export const TopCardImage = styled.img`
  position: absolute;
  top: 0;
  left: -95.19%;
  width: 195.19%;
  height: 100%;
  max-width: none;
`

export const BottomCardFrame = styled(CardFrame)`
  left: 3.78%;
  top: 46.96%;
  width: 29.39%;
  height: 21.27%;
`

export const BottomCardImage = styled.img`
  position: absolute;
  top: -95.31%;
  left: -6.31%;
  width: 214.03%;
  height: 195.31%;
  max-width: none;
`
