import { useState } from 'react'
import { useQuestionSummaryNoteLinks } from './useQuestionSummaryNoteLinks'

export function useQuestionBlock(questionId) {
  const {
    relations: linkedNotes,
    addNote,
    updateLabel,
    removeNote,
    isSyncing: isSyncingNotes,
  } = useQuestionSummaryNoteLinks(questionId)

  const [notePickerOpen, setNotePickerOpen] = useState(false)
  const [labelDrafts, setLabelDrafts] = useState({})
  const [collapsed, setCollapsed] = useState(false)

  const commitLabel = (relation, value) => {
    setLabelDrafts(d => { const next = { ...d }; delete next[relation.id]; return next })
    if (value !== (relation.label || '')) updateLabel(relation.id, value)
  }

  const handleSelectNote = async (option) => {
    await addNote(option)
    setNotePickerOpen(false)
  }

  return {
    linkedNotes, removeNote, isSyncingNotes,
    notePickerOpen, setNotePickerOpen, handleSelectNote,
    labelDrafts, setLabelDrafts, commitLabel,
    collapsed, setCollapsed,
  }
}
