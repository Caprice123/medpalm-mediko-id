import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@store/store'
import { fetchFeatures } from '@store/feature/userAction'
import { fetchPricingPlans } from '@store/pricing/action'
import { fetchPublicConstants } from '@store/constant/userAction'

const HOME_CONSTANT_KEYS = [
  'home_hero_badge',
  'home_hero_title',
  'home_hero_subtitle',
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

export function useHome() {
  const dispatch = useAppDispatch()
  const constants = useSelector((state) => state.constant.constants)

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
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return {
    scrollToSection,
    heroBadge: constants.home_hero_badge,
    heroTitle: constants.home_hero_title,
    heroSubtitle: constants.home_hero_subtitle,
    howItWorksYoutubeUrl: constants.home_how_it_works_youtube_url,
    faqItems: parseJson(constants.home_faq_items),
    socialItems: parseJson(constants.home_social_items),
  }
}
