import { useState } from 'react'

// The journal name is edited in place and saved on blur, so each card owns the
// draft of its own field.
export const useDomainCard = ({ item, onUpdateJournalName }) => {
  const [draft, setDraft] = useState(item.journal_name || '')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setDraft(event.target.value)
    setError('')
  }

  const handleBlur = async () => {
    const next = draft.trim()
    const saved = (item.journal_name || '').trim()

    if (next === saved) return

    // Clearing the field would silently drop this domain out of the research
    // filter, so an empty value is rejected and the saved name restored.
    if (!next) {
      setError('Nama jurnal wajib diisi')
      setDraft(item.journal_name || '')
      return
    }

    await onUpdateJournalName(item.id, next)
  }

  return { draft, error, handleChange, handleBlur }
}
