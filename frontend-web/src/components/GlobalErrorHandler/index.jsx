import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { actions as summaryNotesActions } from '@store/summaryNotes/reducer'

function GlobalErrorHandler() {
  const dispatch = useDispatch()

  // Watch error states from different reducers
  const summaryNotesError = useSelector(state => state.summaryNotes?.error)

  // Handle summaryNotes errors
  useEffect(() => {
    if (summaryNotesError) {
      toast.error(summaryNotesError)
      dispatch(summaryNotesActions.clearError())
    }
  }, [summaryNotesError, dispatch])

  return null
}

export default GlobalErrorHandler
