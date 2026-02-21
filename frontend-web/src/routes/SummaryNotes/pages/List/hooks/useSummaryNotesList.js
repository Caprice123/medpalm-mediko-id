import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSummaryNotes } from '@store/summaryNotes/userAction'
import { fetchTags } from '@store/tags/userAction'
import { actions } from '@store/summaryNotes/reducer'
import { actions as tagActions } from '@store/tags/reducer'

export const useSummaryNotesList = () => {
  const dispatch = useDispatch()
  const { loading, pagination, notes } = useSelector(state => state.summaryNotes)

  useEffect(() => {
    dispatch(fetchSummaryNotes())
    dispatch(tagActions.updateFilter({ key: 'tagGroupNames', value: ['university', 'semester', 'topic', 'department'] }))
    dispatch(fetchTags())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchSummaryNotes())
  }

  return { loading, pagination, notes, handlePageChange }
}
