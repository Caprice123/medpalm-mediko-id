import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { GlobalStyles, LandingContainer } from './Home.styles'
import { ParallaxProvider } from 'react-scroll-parallax'
import { useAppDispatch } from '@store/store'
import { fetchFeatures } from '@store/feature/action'
import { fetchPricingPlans } from '@store/pricing/action'

// Import components
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import PricingSection from './components/PricingSection'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'
import FooterSection from './components/FooterSection'

function Home() {
  const dispatch = useAppDispatch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 500,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 0,
    })

    // Dispatch Redux actions to fetch data
    dispatch(fetchFeatures())
    dispatch(fetchPricingPlans())
  }, [dispatch])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <ParallaxProvider>
      <GlobalStyles />
      <LandingContainer>
        <Navbar
          scrollToSection={scrollToSection}
          toggleMobileMenu={toggleMobileMenu}
          mobileMenuOpen={mobileMenuOpen}
        />

        <HeroSection scrollToSection={scrollToSection} />

        <FeaturesSection />

        <HowItWorksSection />

        <PricingSection />

        <TestimonialsSection />

        <CTASection />

        <FooterSection scrollToSection={scrollToSection} />
      </LandingContainer>
    </ParallaxProvider>
  )
}

export default Home
