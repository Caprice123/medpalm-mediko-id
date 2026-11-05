import { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '@store/oscePractice/v2/reducer'
import { fetchOsceHub, fetchOsceHistory } from '@store/oscePractice/v2/userAction'

// The page's own state: the two reads it opens with, and the start gate — which both the live
// block's not-yet-started session and a history row can raise, so it is owned here rather than
// in either of them. Stations are read by `/osce-practice/stations`, not here.
export const useHub = () => {
  const dispatch = useDispatch()
  const [startTarget, setStartTarget] = useState(null)

  useEffect(() => {
    dispatch(fetchOsceHub())
    // History resets to page one on mount: a remembered page from a previous visit would open
    // the panel on rows whose neighbours have since shifted.
    dispatch(actions.setHistoryPagination({ page: 1 }))
    dispatch(fetchOsceHistory())
  }, [dispatch])

  // Everything startable from this page is a session the student already created; only the
  // catalogue hands over a station that still needs one. The gate reads the kind to know
  // whether it has to create before it can start.
  const requestStart = useCallback((session) => {
    setStartTarget({ kind: 'session', session })
  }, [])

  const closeStartGate = useCallback(() => setStartTarget(null), [])

  return { startTarget, requestStart, closeStartGate }
}
