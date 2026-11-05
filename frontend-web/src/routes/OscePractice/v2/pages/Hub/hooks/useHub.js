import { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '@store/oscePractice/v2/reducer'
import { fetchOsceHub, fetchOsceStations, fetchOsceHistory } from '@store/oscePractice/v2/userAction'

// The page's own state: the three reads the board opens with, and the start gate — which three
// different children can raise (a station row, the live block's not-yet-started session, and a
// history row), so it is owned here rather than in any one of them.
export const useHub = () => {
  const dispatch = useDispatch()
  const [startTarget, setStartTarget] = useState(null)

  useEffect(() => {
    dispatch(fetchOsceHub())
    // Both lists reset to page one on mount: a remembered page from a previous visit would
    // open the board on rows whose neighbours have since shifted.
    dispatch(actions.setStationsPagination({ page: 1 }))
    dispatch(fetchOsceStations())
    dispatch(actions.setHistoryPagination({ page: 1 }))
    dispatch(fetchOsceHistory())
  }, [dispatch])

  const requestStart = useCallback((subject) => {
    // A station has a `title`; a session the student already created carries `topicTitle`. The
    // gate needs to know which, because one has to be created before it can be started.
    setStartTarget(subject.topicTitle
      ? { kind: 'session', session: subject }
      : { kind: 'station', station: subject })
  }, [])

  const closeStartGate = useCallback(() => setStartTarget(null), [])

  return { startTarget, requestStart, closeStartGate }
}
