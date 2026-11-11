import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { actions as commonActions } from '@store/common/reducer'
import { SkripsiRoute } from '../../../../routes'

// Guards the way out of the editor while the document is dirty. Three answers,
// which is why this is not the common ConfirmationModal: save and leave, leave
// anyway, or stay.
export const useLeaveGuard = ({ hasUnsavedChanges, save }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSavingBeforeLeave, setIsSavingBeforeLeave] = useState(false)

  const leave = useCallback(() => navigate(SkripsiRoute.moduleRoute), [navigate])

  const requestLeave = useCallback(() => {
    if (hasUnsavedChanges) {
      setIsDialogOpen(true)
      return
    }

    leave()
  }, [hasUnsavedChanges, leave])

  const saveAndLeave = async () => {
    setIsSavingBeforeLeave(true)
    try {
      await save()
      setIsDialogOpen(false)
      leave()
    } catch (error) {
      // Stay put on failure: leaving now would discard the very changes the
      // student asked to keep.
      dispatch(commonActions.setError(`Gagal menyimpan perubahan: ${error.message}`))
    } finally {
      setIsSavingBeforeLeave(false)
    }
  }

  const leaveWithoutSaving = () => {
    setIsDialogOpen(false)
    leave()
  }

  return {
    isDialogOpen,
    isSavingBeforeLeave,
    requestLeave,
    saveAndLeave,
    leaveWithoutSaving,
    cancelLeave: () => setIsDialogOpen(false),
  }
}
