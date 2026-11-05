import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { fetchOscePerformance } from '@store/oscePractice/userAction'
import { actions } from '@store/oscePractice/v2/reducer'
import { fetchOsceStations } from '@store/oscePractice/v2/userAction'

// The rows are a filter, not a statistic. Clicking a topic narrows the station panel to it,
// which is how a student gets from "aku lemah di Psikiatri" to a station worth opening without
// reading forty case titles.
//
// Performance itself still comes from the engine slice's action: the endpoint and its two
// sources (counters or derived) are unchanged, and only the hub's own reads moved to V2.
export const usePerformanceRows = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchOscePerformance())
  }, [dispatch])

  const selectTopic = useCallback((tagId) => {
    dispatch(actions.updateFilter({ key: 'topicTag', value: tagId }))
    // Page always resets before the fetch: holding page 3 while the filter changes would open
    // the panel on a page that no longer exists for the new filter.
    dispatch(actions.setStationsPagination({ page: 1 }))
    dispatch(fetchOsceStations())
  }, [dispatch])

  return { selectTopic }
}
