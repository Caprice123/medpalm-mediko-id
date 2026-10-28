import { ParallaxProvider } from 'react-scroll-parallax'
import { GlobalStyles, LandingContainer } from './Home.styles'
import { useHome } from './hooks/useHome'

import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import PricingSection from './components/PricingSection'
import FAQSection from './components/FAQSection'
import CTASection from './components/CTASection'
import FooterSection from './components/FooterSection'

function Home() {
  const {
    scrollToSection,
    heroBadge,
    heroTitle,
    heroSubtitle,
    howItWorksYoutubeUrl,
    faqItems,
    socialItems,
  } = useHome()

  return (
    <ParallaxProvider>
      <GlobalStyles />
      <LandingContainer>
        <Navbar scrollToSection={scrollToSection} />

        <HeroSection
          scrollToSection={scrollToSection}
          badge={heroBadge}
          title={heroTitle}
          subtitle={heroSubtitle}
        />

        <FeaturesSection />

        <HowItWorksSection youtubeUrl={howItWorksYoutubeUrl} />

        <PricingSection />

        <FAQSection faqItems={faqItems} />

        <CTASection />

        <FooterSection socialItems={socialItems} />
      </LandingContainer>
    </ParallaxProvider>
  )
}

export default Home
