import bgLeavesRight from '@/assets/landing/hero-bg-leaves-right.png'
import bgLeavesLeft from '@/assets/landing/hero-bg-leaves-left.png'
import { ContentWidth } from '../../Home.styles'
import HeroCopy from './components/HeroCopy'
import HeroArt from './components/HeroArt'
import TrustCard from './components/TrustCard'
import StatsTicker from './components/StatsTicker'
import {
  HeroWrapper,
  BackgroundLayer,
  BackgroundRight,
  BackgroundLeft,
  HeroGrid,
  TrustCardSlot,
} from './HeroSection.styles'

function HeroSection({ title, subtitle, scrollToSection }) {
  return (
    <>
      <HeroWrapper id="about">
        <BackgroundLayer aria-hidden="true">
          <BackgroundRight src={bgLeavesRight} alt="" />
          <BackgroundLeft src={bgLeavesLeft} alt="" />
        </BackgroundLayer>

        <ContentWidth>
          <HeroGrid>
            <HeroCopy title={title} subtitle={subtitle} scrollToSection={scrollToSection} />
            <HeroArt />
          </HeroGrid>

          <TrustCardSlot>
            <TrustCard />
          </TrustCardSlot>
        </ContentWidth>
      </HeroWrapper>

      <StatsTicker />
    </>
  )
}

export default HeroSection
