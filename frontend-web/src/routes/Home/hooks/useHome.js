import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@store/store'
import { fetchFeatures } from '@store/feature/userAction'
import { fetchPricingPlans } from '@store/pricing/action'
import { fetchPublicConstants } from '@store/constant/userAction'
import { fetchHomeStats, fetchHomeEvents, fetchHomeChallenges } from '@store/home/userAction'

// Two deliberate omissions. `home_hero_badge` is the login page's tagline and
// the rebuilt landing page renders it nowhere. Events and challenges used to be
// retyped into `home_event_items` / `home_challenge_items`; they are now read
// live from their own endpoints, so no constant holds them.
const HOME_CONSTANT_KEYS = [
  'home_hero_title',
  'home_hero_subtitle',
  'home_why_heading',
  'home_why_subtitle',
  'home_why_cards',
  'home_faq_items',
  'home_testimonial_items',
  'home_social_items',

  // Feature section: the heading plus the bullet points under each panel. The
  // tabs themselves need no key here — they come from the features request.
  'home_feature_heading',
  'home_feature_heading_accent',
  'home_feature_subtitle',
  'home_feature_points',
]

// The per-feature demo videos used to be fetched here as individual
// `<feature>_youtube_url` constants. They are not any more: the features
// request below already returns each feature's `youtubeUrl` from those same
// constants, so FeatureDetailSection reads it off the feature itself and a
// newly added feature needs no key added to this list.

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
    dispatch(fetchHomeEvents())
    dispatch(fetchHomeChallenges())
  }, [dispatch])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return {
    scrollToSection,
    heroTitle: constants.home_hero_title,
    heroSubtitle: constants.home_hero_subtitle,
    faqItems: parseJson(constants.home_faq_items),
    testimonialItems: parseJson(constants.home_testimonial_items),
    socialItems: parseJson(constants.home_social_items),
  }
}
