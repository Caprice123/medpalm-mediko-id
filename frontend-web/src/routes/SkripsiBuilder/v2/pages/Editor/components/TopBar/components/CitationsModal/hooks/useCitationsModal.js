import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateBibliography } from '@store/skripsi/v2'
import { actions } from '@store/skripsi/v2/reducer'
import { bibliographySectionId } from '../../../../../utils/bibliographySectionId'

// The collected sources, and the one action that turns them into the report's
// daftar pustaka.
//
// Generating replaces the reference section's content, because a daftar pustaka
// is a complete list and generating twice must not leave two of them. A section
// that already has something in it therefore asks first — that confirmation is
// the only thing standing between this button and a student's own typing.
export const useCitationsModal = ({ onClose }) => {
  const dispatch = useDispatch()

  const setId = useSelector(state => state.skripsiV2.currentSet?.uniqueId)
  const sections = useSelector(state => state.skripsiV2.sections)
  const style = useSelector(state => state.skripsiV2.citationStyle)
  const isGenerating = useSelector(state => state.skripsiV2.loading.isGeneratingBibliography)

  // Modal visibility is the one piece of state that stays local by convention.
  const [isConfirmingOverwrite, setIsConfirmingOverwrite] = useState(false)

  // Which section the list will be written into — the same rule the server
  // follows, so what the modal names is what the generate actually rewrites.
  const targetId = bibliographySectionId(sections)
  const target = sections.find(section => section.id === targetId) ?? null
  const hasContent = Boolean(target?.content?.replace(/<[^>]*>/g, '').trim())

  const run = async () => {
    if (!setId) return

    await dispatch(generateBibliography(setId, { style }))
    onClose?.()
  }

  const handleGenerate = () => {
    if (hasContent) {
      setIsConfirmingOverwrite(true)
      return
    }

    run()
  }

  const confirmOverwrite = async () => {
    await run()
    setIsConfirmingOverwrite(false)
  }

  return {
    style,
    // Picking a style only moves the dropdown; the server stores it when the
    // list is actually generated.
    setStyle: (value) => dispatch(actions.setCitationStyle(value)),
    target,
    isGenerating,
    handleGenerate,
    isConfirmingOverwrite,
    confirmOverwrite,
    cancelOverwrite: () => setIsConfirmingOverwrite(false),
  }
}
