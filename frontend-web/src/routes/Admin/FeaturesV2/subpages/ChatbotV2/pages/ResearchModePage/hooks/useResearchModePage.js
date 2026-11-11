import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateConstants } from '@store/constant/action'
import { fetchResearchImplementations } from '@store/chatbot/v2/adminAction'

// Picks which implementation answers a research message.
//
// The options are served by the backend registry, never hardcoded here, so the
// panel cannot offer a key the backend would reject. The value is stored as an
// ordinary constant, which is why saving goes through the shared constants
// endpoint rather than a bespoke one.
export const useResearchModePage = () => {
  const dispatch = useDispatch()
  const { constantKey, current, options } = useSelector(
    state => state.chatbotAdminV2.researchImplementations
  )
  const isLoading = useSelector(
    state => state.chatbotAdminV2.loading.isFetchingResearchImplementations
  )
  const isSaving = useSelector(state => state.constant.loading.isUpdateConstantLoading)

  const [selected, setSelected] = useState(null)
  const [savedAt, setSavedAt] = useState(null)

  useEffect(() => {
    dispatch(fetchResearchImplementations())
  }, [dispatch])

  // Seed the choice from the server once it is known, without clobbering a
  // selection the admin has already made.
  useEffect(() => {
    setSelected(prev => prev ?? current)
  }, [current])

  const isDirty = Boolean(selected) && selected !== current

  const handleSave = async () => {
    if (!isDirty || !constantKey) return

    await dispatch(updateConstants({ [constantKey]: selected }, () => {
      setSavedAt(Date.now())
    }))

    // Re-read so `current` reflects what the backend now resolves, which is the
    // real answer to "what will the next research message use".
    await dispatch(fetchResearchImplementations())
  }

  return {
    options,
    current,
    selected,
    setSelected,
    isDirty,
    isLoading,
    isSaving,
    savedAt,
    handleSave,
  }
}
