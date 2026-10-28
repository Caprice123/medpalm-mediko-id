import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@store/store'
import { fetchFeatures } from '@store/feature/userAction'
import { fetchPricingPlans } from '@store/pricing/action'
import { fetchPublicConstants } from '@store/constant/userAction'
import { fetchHomeStats } from '@store/home/userAction'

const HOME_CONSTANT_KEYS = [
  'home_hero_badge',
  'home_hero_title',
  'home_hero_subtitle',
  'home_nav_items',
  'home_faq_items',
  'home_event_items',
  'home_challenge_items',
  'home_testimonial_items',
  'home_social_items',

  // Per-feature demo videos shown in the feature tabs. Fetched here because the
  // constants request is central, but read by FeatureDetailSection itself.
  'summary_notes_youtube_url',
  'atlas_youtube_url',
  'mcq_youtube_url',
  'flashcard_youtube_url',
  'chatbot_youtube_url',
  'osce_practice_youtube_url',
  'diagnostic_youtube_url',
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
    dispatch(fetchHomeStats())
  }, [dispatch])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return {
    scrollToSection,
    heroTitle: constants.home_hero_title,
    heroSubtitle: constants.home_hero_subtitle,
    navItems: parseJson(constants.home_nav_items),
    faqItems: parseJson(constants.home_faq_items),
    eventItems: parseJson(constants.home_event_items),
    challengeItems: parseJson(constants.home_challenge_items),
    testimonialItems: parseJson(constants.home_testimonial_items),
    socialItems: parseJson(constants.home_social_items),
  }
}
