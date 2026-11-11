import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateSetInfo } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'

// Inline rename of the open set. The draft is local — only a confirmed rename
// reaches the server.
export const useSetTitle = (currentSet) => {
  const dispatch = useDispatch()
  const isUpdating = useSelector(state => state.skripsiV2.loading.isUpdatingSet)

  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const startEditing = () => {
    setDraft(currentSet?.title || '')
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setDraft('')
  }

  const save = async () => {
    const next = draft.trim()

    if (!next) {
      dispatch(commonActions.setError('Judul tidak boleh kosong'))
      return
    }

    if (next === currentSet.title) {
      cancelEditing()
      return
    }

    // The description is sent unchanged: the update service treats a falsy
    // field as "keep what is stored", so omitting it would be fine too, but
    // passing it keeps the call explicit about what it is writing.
    await dispatch(updateSetInfo(currentSet.uniqueId, {
      title: next,
      description: currentSet.description,
    }))

    cancelEditing()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') save()
    if (event.key === 'Escape') cancelEditing()
  }

  return {
    isEditing,
    draft,
    setDraft,
    isUpdating,
    startEditing,
    cancelEditing,
    save,
    handleKeyDown,
  }
}
