// Every repeating list on this page, described in one place.
//
// Each entry names the constant the list is stored in and the blank row the
// "Tambah" button appends. Holding them here instead of spreading a useState,
// a parseJson call and a JSON.stringify line per section across the page means
// a new section is wired up by adding a row below plus its component.
//
// Several landing page sections are deliberately not here. The navbar's targets
// must be ids of sections that actually exist, so an editable list could only
// produce links that scroll nowhere. Events and challenges are read live from
// the webinar and challenge listings. The hero's content counters are computed
// from how much content exists. None of those are settings.
export const LIST_SECTIONS = {
  whyCards: {
    constantKey: 'home_why_cards',
    template: { title: '', description: '' },
  },

  testimonials: {
    constantKey: 'home_testimonial_items',
    template: { quote: '', name: '', detail: '' },
  },

  faqs: {
    constantKey: 'home_faq_items',
    template: { question: '', answer: '' },
  },

  socials: {
    constantKey: 'home_social_items',
    template: { platform: '', type: 'instagram', handle: '', desc: '', url: '' },
  },

  // Drives the left panel of the login page, not the landing page.
  loginSlides: {
    constantKey: 'home_hero_slides',
    template: { icon: '', label: '', title: '', desc: '' },
  },
}

// The feature bullet points are not a free list: there is exactly one row per
// feature, so they are held as a map keyed by the feature's `sessionType`
// rather than as rows an admin can add and remove.
export const FEATURE_POINTS_KEY = 'home_feature_points'

// Plain text constants, each edited by a single input.
export const TEXT_KEYS = [
  'home_hero_title',
  'home_hero_subtitle',
  'home_why_heading',
  'home_why_subtitle',
  'home_feature_heading',
  'home_feature_heading_accent',
  'home_feature_subtitle',
  'home_hero_badge',
  'login_signin_title',
  'login_signin_subtitle',
]

export const CONSTANT_KEYS = [
  ...TEXT_KEYS,
  FEATURE_POINTS_KEY,
  ...Object.values(LIST_SECTIONS).map((section) => section.constantKey),
]

// A saved constant holding an empty array is indistinguishable from one that
// was never set, so both open the form on a single blank row.
export function decodeList(sectionKey, rawValue) {
  const section = LIST_SECTIONS[sectionKey]
  const blank = [{ ...section.template }]
  if (!rawValue) return blank

  let parsed
  try {
    parsed = JSON.parse(rawValue)
  } catch {
    return blank
  }
  if (!Array.isArray(parsed) || parsed.length === 0) return blank

  return parsed.map((item) => ({ ...section.template, ...item }))
}

// Stored as [{ sessionType, points: [...] }]; edited as one point per line,
// which is far less fiddly than a numbered field per bullet.
export function decodeFeaturePoints(rawValue) {
  if (!rawValue) return {}

  let parsed
  try {
    parsed = JSON.parse(rawValue)
  } catch {
    return {}
  }
  if (!Array.isArray(parsed)) return {}

  const bySessionType = {}
  parsed.forEach((entry) => {
    if (!entry?.sessionType) return
    bySessionType[entry.sessionType] = Array.isArray(entry.points) ? entry.points.join('\n') : ''
  })
  return bySessionType
}

// Features whose textarea is empty are dropped rather than stored as an entry
// with no points — an absent entry and an empty one mean the same thing to the
// landing page, and the shorter payload is easier to read in the database.
export function encodeFeaturePoints(bySessionType) {
  const entries = Object.entries(bySessionType)
    .map(([sessionType, text]) => ({
      sessionType,
      points: (text || '')
        .split('\n')
        .map((point) => point.trim())
        .filter(Boolean),
    }))
    .filter((entry) => entry.points.length > 0)

  return JSON.stringify(entries)
}
