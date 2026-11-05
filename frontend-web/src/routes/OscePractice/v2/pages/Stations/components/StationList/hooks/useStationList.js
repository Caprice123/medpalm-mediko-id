import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { loadMoreOsceStations } from '@store/oscePractice/v2/userAction'

// The thunk advances the page in the reducer itself and refetches with `append`, so the list
// never decides which page it is on.
export const useStationList = () => {
  const dispatch = useDispatch()

  const loadMore = useCallback(() => dispatch(loadMoreOsceStations()), [dispatch])

  return { loadMore }
}
