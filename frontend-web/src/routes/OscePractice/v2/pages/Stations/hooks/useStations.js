import { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { actions } from '@store/oscePractice/v2/reducer'
import { fetchOsceStations } from '@store/oscePractice/v2/userAction'

// The page's own state: the one read it opens with, and the start gate — which only the station
// rows raise here, but which the page owns because the gate is a page-level overlay.
export const useStations = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [startTarget, setStartTarget] = useState(null)

  // The hub's performance rows link here carrying the topic they were clicked on, so the list
  // opens already narrowed on the topic the student is weakest at.
  const topicParam = searchParams.get('topic') || ''

  useEffect(() => {
    // The param is the entry point, not a mirror of the filter: arriving without one clears the
    // topic rather than reopening the page on a filter a previous visit left in the slice.
    // Changing the topic from the select below writes the slice only — the URL is not rewritten,
    // so this effect does not re-fire and refetch underneath it.
    dispatch(actions.updateFilter({ key: 'topicTag', value: topicParam }))
    dispatch(actions.setStationsPagination({ page: 1 }))
    dispatch(fetchOsceStations())
  }, [dispatch, topicParam])

  const requestStart = useCallback((station) => setStartTarget({ kind: 'station', station }), [])
  const closeStartGate = useCallback(() => setStartTarget(null), [])

  return { startTarget, requestStart, closeStartGate }
}
