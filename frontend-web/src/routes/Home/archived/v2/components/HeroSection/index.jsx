import HeroText from './components/HeroText'
import HeroArt from './components/HeroArt'
import { HeroWrapper, HeroGrid } from './HeroSection.styles'

export default function HeroSection({ scrollToSection, badge, title, subtitle }) {
  return (
    <HeroWrapper>
      <HeroGrid>
        <HeroText
          scrollToSection={scrollToSection}
          badge={badge}
          title={title}
          subtitle={subtitle}
        />
        <HeroArt />
      </HeroGrid>
    </HeroWrapper>
  )
}
