import capybaraPointing from '@/assets/landing/hero-capybara-pointing.png'
import uiCards from '@/assets/landing/hero-ui-cards.png'
import {
  ArtBox,
  Mascot,
  TopCardFrame,
  TopCardImage,
  BottomCardFrame,
  BottomCardImage,
} from './HeroArt.styles'

// Paint order follows the Figma child order: the top card sits behind the
// mascot (1:27 before 1:28), the bottom card in front of it (1:50 after).
function HeroArt() {
  return (
    <ArtBox aria-hidden="true">
      <TopCardFrame>
        <TopCardImage src={uiCards} alt="" />
      </TopCardFrame>

      <Mascot src={capybaraPointing} alt="" />

      <BottomCardFrame>
        <BottomCardImage src={uiCards} alt="" />
      </BottomCardFrame>
    </ArtBox>
  )
}

export default HeroArt
