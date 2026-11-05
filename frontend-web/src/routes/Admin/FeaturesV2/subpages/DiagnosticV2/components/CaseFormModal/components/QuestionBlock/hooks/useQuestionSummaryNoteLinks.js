import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchDiagnosticQuestionSummaryNoteRelations,
  addDiagnosticQuestionSummaryNoteRelation,
  updateDiagnosticQuestionSummaryNoteRelationLabel,
  removeDiagnosticQuestionSummaryNoteRelation,
} from '@store/diagnosticNodes/adminAction'

export function useQuestionSummaryNoteLinks(questionId) {
  const dispatch = useDispatch()

  const [relations, setRelations] = useState([])
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (!questionId) return
    refresh()
  }, [questionId])

  const refresh = async () => {
    const data = await dispatch(fetchDiagnosticQuestionSummaryNoteRelations(questionId))
    setRelations(data)
  }

  const addNote = async (option) => {
    if (!option || isSyncing) return
    setIsSyncing(true)
    try {
      await dispatch(addDiagnosticQuestionSummaryNoteRelation(questionId, option.value, option.label))
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
      await dispatch(updateDiagnosticQuestionSummaryNoteRelationLabel(relationId, label))
      setRelations(prev => prev.map(r => r.id === relationId ? { ...r, label } : r))
    } finally {
      setIsSyncing(false)
    }
  }

  const removeNote = async (relationId) => {
    if (isSyncing) return
    setIsSyncing(true)
    try {
      await dispatch(removeDiagnosticQuestionSummaryNoteRelation(relationId))
      await refresh()
    } finally {
      setIsSyncing(false)
    }
  }

  return { relations, addNote, updateLabel, removeNote, isSyncing }
}
