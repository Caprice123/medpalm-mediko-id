import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '@store/oscePractice/v2/reducer'
import { fetchOsceHistory, loadMoreOsceHistory } from '@store/oscePractice/v2/userAction'

// The history panel's counted chips and its load-more. Filtering happens on the server; the
// accumulated list is never sliced client-side.
export const useHistoryPanel = () => {
  const dispatch = useDispatch()

  const selectStatus = useCallback((status) => {
    dispatch(actions.updateHistoryFilter({ key: 'status', value: status }))
    // Back to page one: the accumulated list belongs to the old filter.
    dispatch(actions.setHistoryPagination({ page: 1 }))
    dispatch(fetchOsceHistory())
  }, [dispatch])

  const loadMore = useCallback(() => dispatch(loadMoreOsceHistory()), [dispatch])

  return { selectStatus, loadMore }
}
