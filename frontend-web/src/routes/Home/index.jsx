// Grid primitives only — NOT the full Bootstrap stylesheet. Vite injects any
// imported CSS globally, and Bootstrap's reset/typography would restyle the
// admin panel and every other page. bootstrap-grid ships just the container,
// row, column and breakpoint rules, which nothing else in the app uses.
import 'bootstrap/dist/css/bootstrap-grid.min.css'

import { GlobalStyles, LandingContainer } from './Home.styles'
import { useHome } from './hooks/useHome'

import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import WhyMedPalSection from './components/WhyMedPalSection'
import FeatureDetailSection from './components/FeatureDetailSection'
import PricingSection from './components/PricingSection'
import EventSection from './components/EventSection'
import ChallengeSection from './components/ChallengeSection'
import TestimonialSection from './components/TestimonialSection'
import FAQSection from './components/FAQSection'
import CTASection from './components/CTASection'
import FooterSection from './components/FooterSection'

function Home() {
  const {
    scrollToSection,
    heroTitle,
    heroSubtitle,
    faqItems,
    testimonialItems,
    socialItems,
  } = useHome()

  return (
    <>
      <GlobalStyles />
      <LandingContainer>
        <Navbar scrollToSection={scrollToSection} />

        <HeroSection
          title={heroTitle}
          subtitle={heroSubtitle}
          scrollToSection={scrollToSection}
        />

        <WhyMedPalSection />

        <FeatureDetailSection />

        <PricingSection />

        <EventSection />

        <ChallengeSection />

        <TestimonialSection testimonialItems={testimonialItems} />

        <FAQSection faqItems={faqItems} />

        <CTASection />

        <FooterSection socialItems={socialItems} />
      </LandingContainer>
    </>
  )
}

export default Home
