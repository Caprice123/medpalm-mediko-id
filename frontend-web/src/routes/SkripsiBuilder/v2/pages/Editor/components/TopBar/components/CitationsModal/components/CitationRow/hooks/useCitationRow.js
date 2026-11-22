import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSetCitation, updateSetCitation } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'

const COPIED_FEEDBACK_MS = 2000

// The editable fields, in the order the form shows them. Kept as one list so
// opening the form, submitting it and resetting it cannot drift apart.
const FIELDS = [
  'title', 'authorsText', 'publishedYear', 'containerTitle',
  'publisher', 'volume', 'issue', 'pages',
]

const draftFrom = (citation) => FIELDS.reduce((draft, field) => ({
  ...draft,
  [field]: citation[field] ?? '',
}), { sourceType: citation.sourceType })

// One kept source: copying its in-text marker, editing the fields no registry
// could fill in, and dropping it.
//
// Crossref and PubMed answer for journal articles. A guideline or a faculty PDF
// has no registry to ask and its author is an institution no URL reveals, so
// without this form half of every daftar pustaka would come out authorless.
export const useCitationRow = ({ citation }) => {
  const dispatch = useDispatch()

  const setId = useSelector(state => state.skripsiV2.currentSet?.uniqueId)
  const isSaving = useSelector(state => state.skripsiV2.loading.isUpdatingCitation)
  const isDeleting = useSelector(state => state.skripsiV2.loading.isDeletingCitation)

  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [draft, setDraft] = useState(() => draftFrom(citation))
  const [isCopied, setIsCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // A re-resolve from a second save, or another edit landing, still has to show
  // in a form that is not open.
  useEffect(() => {
    if (!isEditing) setDraft(draftFrom(citation))
  }, [citation, isEditing])

  const setField = (field) => (event) => {
    const { value } = event.target
    setDraft(prev => ({ ...prev, [field]: value }))
  }

  const copyMarker = async () => {
    if (!citation.marker) return

    try {
      await navigator.clipboard.writeText(citation.marker)

      setIsCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
    } catch {
      dispatch(commonActions.setError('Gagal menyalin penanda'))
    }
  }

  const submit = async () => {
    if (!setId) return

    await dispatch(updateSetCitation(setId, citation.id, draft))
    setIsEditing(false)
  }

  const confirmDelete = async () => {
    if (!setId) return

    await dispatch(deleteSetCitation(setId, citation.id))
    setIsConfirmingDelete(false)
  }

  return {
    isEditing,
    startEditing: () => setIsEditing(true),
    cancelEditing: () => {
      setDraft(draftFrom(citation))
      setIsEditing(false)
    },
    draft,
    setField,
    setSourceType: (value) => setDraft(prev => ({ ...prev, sourceType: value })),
    submit,
    isSaving,
    isCopied,
    copyMarker,
    isConfirmingDelete,
    requestDelete: () => setIsConfirmingDelete(true),
    cancelDelete: () => setIsConfirmingDelete(false),
    confirmDelete,
    isDeleting,
  }
}
