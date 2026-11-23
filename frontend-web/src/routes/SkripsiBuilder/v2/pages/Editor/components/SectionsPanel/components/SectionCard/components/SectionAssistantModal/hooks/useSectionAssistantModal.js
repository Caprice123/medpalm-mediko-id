import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { requestSectionAssist } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'
import { wordDiff, hasChanges } from '../utils/wordDiff'

// The quick actions. Pressing one writes its wording into the prompt box, so
// what the model is being asked is always the sentence on screen — the student
// can then edit it, add to it, or clear it and write their own.
export const REWRITE_ACTIONS = [
  { label: 'Perbaiki bahasa', text: 'Perbaiki tata bahasa, ejaan dan tanda baca tanpa mengubah makna.' },
  { label: 'Parafrase', text: 'Tulis ulang dengan susunan kalimat dan pilihan kata yang berbeda, dengan makna yang sama.' },
  { label: 'Ringkas', text: 'Ringkas menjadi lebih padat, pertahankan semua poin penting dan angka.' },
  { label: 'Perjelas', text: 'Perjelas dan uraikan agar lebih mudah dipahami, tanpa menambah fakta baru.' },
  { label: 'Ubah menjadi daftar poin', text: 'Ubah menjadi daftar poin yang ringkas, satu poin per baris.' },
]

// Drafting asks for something that does not exist yet, so these name an
// outcome rather than an edit.
export const DRAFT_ACTIONS = [
  { label: 'Tulis draf bagian', text: 'Tulis draf lengkap untuk bagian ini berdasarkan kasus dan konteks yang diberikan.' },
  { label: 'Buat kerangka poin', text: 'Buat kerangka poin-poin yang perlu dibahas di bagian ini, satu poin per baris.' },
  { label: 'Lanjutkan tulisan', text: 'Lanjutkan tulisan yang sudah ada di bagian ini tanpa mengulang isi yang sudah ditulis.' },
  { label: 'Uraikan dari kasus', text: 'Uraikan informasi dari kasus PBL yang relevan untuk bagian ini.' },
]

// What travels with the request unless the student says otherwise. The case is
// what makes an answer about this report rather than about PBL reports, and it
// is small; the reference list is asked for when the answer has to cite.
//
// This section's own text is not a flag here — it is the first row of the same
// section list, ticked on open, so "bagian ini" and "bagian lain" are picked
// the same way and share one cap.
const DEFAULT_CONTEXT = { case: true, citations: false }

// One request, one result, nothing saved.
//
// Two modes behind one modal: `rewrite` revises the text the student
// highlighted, `draft` writes a section that has nothing to highlight yet.
// They differ in what they send and in what accepting the result does — the
// prompt box, the context picker and the loading state are the same.
export const useSectionAssistantModal = ({
  isOpen,
  sectionId,
  mode,
  selectedText,
  onApplyRewrite,
  onApplyDraft,
  onClose,
}) => {
  const dispatch = useDispatch()
  const isGenerating = useSelector(state => state.skripsiV2.loading.isAssistingSection)
  const sections = useSelector(state => state.skripsiV2.sections, shallowEqual)
  // The same two checks the chat panel makes, so a tick that would send an
  // empty string is off and says why in both places.
  const hasCase = useSelector(state => Boolean(state.skripsiV2.currentSet?.caseText))
  const hasCitations = useSelector(state => state.skripsiV2.citations.length > 0)

  const [instruction, setInstruction] = useState('')
  const [result, setResult] = useState('')
  const [context, setContext] = useState(DEFAULT_CONTEXT)
  const [selectedSectionIds, setSelectedSectionIds] = useState([])
  // 'changes' marks what the model altered; 'clean' is the revision as it
  // would land in the document. The marked view is the default because the
  // question a student has in front of a revision is "what did it change".
  const [revisionView, setRevisionView] = useState('changes')
  const [isConfirmingReplace, setIsConfirmingReplace] = useState(false)

  // A reopened modal starts clean rather than showing the previous selection's
  // revision next to a new one.
  useEffect(() => {
    if (!isOpen) return

    setInstruction('')
    setResult('')
    setContext(DEFAULT_CONTEXT)
    setSelectedSectionIds([sectionId])
    setRevisionView('changes')
    setIsConfirmingReplace(false)
  }, [isOpen, mode, sectionId])

  // A chip replaces whatever is in the box rather than appending to it: two
  // quick actions at once contradict each other more often than they combine.
  const applyQuickAction = (text) => setInstruction(text)

  const toggleContext = (key) => setContext(previous => ({ ...previous, [key]: !previous[key] }))

  const toggleSection = (id) => setSelectedSectionIds((previous) => (
    previous.includes(id)
      ? previous.filter(current => current !== id)
      : [...previous, id]
  ))

  const handleGenerate = async () => {
    if (!instruction.trim()) {
      dispatch(commonActions.setError('Tulis dulu perintah untuk AI'))
      return
    }

    const response = await dispatch(requestSectionAssist(sectionId, {
      mode,
      selectedText,
      instruction: instruction.trim(),
      // This section travels as `section` rather than as an id, because the
      // server resolves it from the section being worked on: the client never
      // has to name it, and it is the one that survives the cap.
      context: {
        ...context,
        section: selectedSectionIds.includes(sectionId),
        sectionIds: selectedSectionIds.filter(id => id !== sectionId),
      },
    }))

    if (response?.result) setResult(response.result)
  }

  // What the model actually altered. Two paragraphs of similar prose read as
  // identical side by side, so the difference is marked rather than left for
  // the student to spot. Only a rewrite has an "before" to compare against.
  const diff = useMemo(
    () => (mode === 'rewrite' && result ? wordDiff(selectedText, result) : []),
    [mode, selectedText, result],
  )

  const applyDraft = (replace) => {
    onApplyDraft(result, { replace })
    onClose()
  }

  return {
    diff,
    changed: hasChanges(diff),
    instruction,
    quickActions: mode === 'rewrite' ? REWRITE_ACTIONS : DRAFT_ACTIONS,
    applyQuickAction,
    setInstruction: (event) => setInstruction(event.target.value),
    context,
    toggleContext,
    sections,
    hasCase,
    hasCitations,
    selectedSectionIds,
    toggleSection,
    result,
    revisionView,
    setRevisionView,
    discardResult: () => setResult(''),
    isGenerating,
    canGenerate: Boolean(instruction.trim()),
    handleGenerate,
    handleApplyRewrite: () => {
      onApplyRewrite(result)
      onClose()
    },
    handleAppendDraft: () => applyDraft(false),
    requestReplace: () => setIsConfirmingReplace(true),
    confirmReplace: () => {
      setIsConfirmingReplace(false)
      applyDraft(true)
    },
    cancelReplace: () => setIsConfirmingReplace(false),
    isConfirmingReplace,
  }
}
