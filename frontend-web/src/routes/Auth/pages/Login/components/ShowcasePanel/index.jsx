import capybaraDoctor from '@/assets/landing/capybara-doctor-cheering.webp'
import uiCards from '@/assets/landing/hero-ui-cards.png'
import {
  PanelRoot,
  Headline,
  HeadlineAccent,
  Lede,
  Art,
  ProductFrame,
  Mascot,
} from './ShowcasePanel.styles'
import { useShowcasePanel } from './hooks/useShowcasePanel'

function ShowcasePanel() {
  const { firstLine, accentLines, lede } = useShowcasePanel()

  return (
    <PanelRoot>
      <Headline>
        {firstLine}
        {accentLines.map((line) => (
          <HeadlineAccent key={line}>{line}</HeadlineAccent>
        ))}
      </Headline>

      <Lede>{lede}</Lede>

      {/* Decoration: the real product UI, with the mascot cheering beside it. */}
      <Art aria-hidden="true">
        <ProductFrame>
          <img src={uiCards} alt="" />
        </ProductFrame>
        <Mascot src={capybaraDoctor} alt="" />
      </Art>
    </PanelRoot>
  )
}

export default ShowcasePanel
