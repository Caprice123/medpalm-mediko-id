import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { GlobalStyles, LandingContainer } from './Home.styles'
import { ParallaxProvider } from 'react-scroll-parallax'
import { useAppDispatch } from '@store/store'
import { useSelector } from 'react-redux'
import { fetchFeatures } from '@store/feature/userAction'
import { fetchPricingPlans } from '@store/pricing/action'
import { fetchPublicConstants } from '@store/constant/userAction'

// Import components
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import PricingSection from './components/PricingSection'
import CTASection from './components/CTASection'
import FAQSection from './components/FAQSection'
import FooterSection from './components/FooterSection'

const HOME_CONSTANT_KEYS = [
  'home_hero_badge',
  'home_hero_title',
  'home_hero_subtitle',
  'home_hero_slides',
  'home_how_it_works_youtube_url',
  'home_faq_items',
  'home_social_items',
]

function parseJson(value) {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null
  } catch {
    return null
  }
}

function Home() {
  const dispatch = useAppDispatch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const constants = useSelector(state => state.constant.constants)

  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 0,
    })

    dispatch(fetchFeatures())
    dispatch(fetchPricingPlans())
    dispatch(fetchPublicConstants(HOME_CONSTANT_KEYS))
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

        <HeroSection
          scrollToSection={scrollToSection}
          badge={constants.home_hero_badge}
          title={constants.home_hero_title}
          subtitle={constants.home_hero_subtitle}
          slides={parseJson(constants.home_hero_slides)}
        />

        <FeaturesSection />

        <HowItWorksSection youtubeUrl={constants.home_how_it_works_youtube_url} />

        <PricingSection />

        <FAQSection faqItems={parseJson(constants.home_faq_items)} />

        <CTASection />

        <FooterSection socialItems={parseJson(constants.home_social_items)} />
      </LandingContainer>
    </ParallaxProvider>
  )
}

export default Home
