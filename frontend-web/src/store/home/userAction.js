import { actions } from '@store/home/reducer'
import Endpoints from '@config/endpoint'
import { getPublic } from '../../utils/requestUtils'

const { setLoading, setStats, setEvents, setChallenges } = actions

// The landing page is reachable logged-out, so this goes through getPublic —
// no Authorization header.
export const fetchHomeStats = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingStats', value: true }))
    const response = await getPublic(Endpoints.api.homeStatsV2)
    const { data } = response.data
    dispatch(setStats(data))
    return data
  } finally {
    dispatch(setLoading({ key: 'isFetchingStats', value: false }))
  }
}

// Events and challenges come from the ordinary user endpoints, whose list
// routes are readable without a token. They are fetched into the home store
// rather than the webinar/challenge stores so the landing page cannot clobber
// the filters and pagination those stores hold for their own pages.
//
// A failure is swallowed on purpose: a landing page that renders an honest
// empty state beats one that breaks because an optional list did not load.
export const fetchHomeEvents = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingEvents', value: true }))
    const response = await getPublic(Endpoints.api.events, {
      // Registration already open, plus the ones opening within the next week.
      // The backend caps that window; the card badge counts the days down.
      // Three is what the landing row fits across.
      registrationStatus: 'open_or_upcoming',
      perPage: 3,
    })
    dispatch(setEvents(response.data.data || []))
  } catch (err) {
    console.error('Failed to load landing events:', err)
    dispatch(setEvents([]))
  } finally {
    dispatch(setLoading({ key: 'isFetchingEvents', value: false }))
  }
}

export const fetchHomeChallenges = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingChallenges', value: true }))
    const response = await getPublic(Endpoints.api.challenges, {
      // Running now, plus the ones starting within the next week.
      tab: 'ongoing_or_upcoming',
      perPage: 2,
    })
    dispatch(setChallenges(response.data.data || []))
  } catch (err) {
    console.error('Failed to load landing challenges:', err)
    dispatch(setChallenges([]))
  } finally {
    dispatch(setLoading({ key: 'isFetchingChallenges', value: false }))
  }
}
