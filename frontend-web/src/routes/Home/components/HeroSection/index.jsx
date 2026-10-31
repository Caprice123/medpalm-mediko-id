import bgLeavesRight from '@/assets/landing/hero-bg-leaves-right.png'
import { ContentWidth } from '../../Home.styles'
import HeroCopy from './components/HeroCopy'
import HeroArt from './components/HeroArt'
import StatsTicker from './components/StatsTicker'
import {
  HeroWrapper,
  BackgroundLayer,
  BackgroundRight,
  HeroGrid,
  HeroFloor,
} from './HeroSection.styles'

function HeroSection({ title, subtitle, scrollToSection }) {
  return (
    <>
      <HeroWrapper id="about">
        <BackgroundLayer aria-hidden="true">
          <BackgroundRight src={bgLeavesRight} alt="" />
        </BackgroundLayer>

        <ContentWidth>
          <HeroGrid>
            <HeroCopy title={title} subtitle={subtitle} scrollToSection={scrollToSection} />
            <HeroArt />
          </HeroGrid>

          <HeroFloor />
        </ContentWidth>
      </HeroWrapper>

      <StatsTicker />
    </>
  )
}

export default HeroSection
