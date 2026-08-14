import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchQuestionSummaryNoteRelations,
  addQuestionSummaryNoteRelation,
  updateQuestionSummaryNoteRelationLabel,
  removeQuestionSummaryNoteRelation,
} from '@store/nodeQuestions'

export function useQuestionSummaryNoteLinks(questionId) {
  const dispatch = useDispatch()

  const [relations, setRelations] = useState([])
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (!questionId) return
    refresh()
  }, [questionId])

  const refresh = async () => {
    const data = await dispatch(fetchQuestionSummaryNoteRelations(questionId))
    setRelations(data)
  }

  const addNote = async (option) => {
    if (!option || isSyncing) return
    setIsSyncing(true)
    try {
      await dispatch(addQuestionSummaryNoteRelation(questionId, option.value, option.label))
      await refresh()
    } catch (e) {
      alert(e?.response?.data?.message || 'Gagal menautkan modul')
    } finally {
      setIsSyncing(false)
    }
  }

  const updateLabel = async (relationId, label) => {
    setIsSyncing(true)
    try {
      await dispatch(updateQuestionSummaryNoteRelationLabel(relationId, label))
      setRelations(prev => prev.map(r => r.id === relationId ? { ...r, label } : r))
    } finally {
      setIsSyncing(false)
    }
  }

  const removeNote = async (relationId) => {
    if (isSyncing) return
    setIsSyncing(true)
    try {
      await dispatch(removeQuestionSummaryNoteRelation(relationId))
      await refresh()
    } finally {
      setIsSyncing(false)
    }
  }

  return { relations, addNote, updateLabel, removeNote, isSyncing }
}
