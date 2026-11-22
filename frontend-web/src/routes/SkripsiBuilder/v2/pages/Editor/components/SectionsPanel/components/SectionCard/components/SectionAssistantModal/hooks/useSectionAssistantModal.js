import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

// What travels with the request unless the student says otherwise. The case
// and this section's own text are what make an answer about this report; the
// outline and the reference list are bigger and are asked for when needed.
const DEFAULT_CONTEXT = { case: true, section: true, outline: false, citations: false }

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

  const [instruction, setInstruction] = useState('')
  const [result, setResult] = useState('')
  const [context, setContext] = useState(DEFAULT_CONTEXT)
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
    setRevisionView('changes')
    setIsConfirmingReplace(false)
  }, [isOpen, mode])

  // A chip replaces whatever is in the box rather than appending to it: two
  // quick actions at once contradict each other more often than they combine.
  const applyQuickAction = (text) => setInstruction(text)

  const toggleContext = (key) => setContext(previous => ({ ...previous, [key]: !previous[key] }))

  const handleGenerate = async () => {
    if (!instruction.trim()) {
      dispatch(commonActions.setError('Tulis dulu perintah untuk AI'))
      return
    }

    const response = await dispatch(requestSectionAssist(sectionId, {
      mode,
      selectedText,
      instruction: instruction.trim(),
      context,
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
