import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchCardSummaryNoteRelations,
  addCardSummaryNoteRelation,
  updateCardSummaryNoteRelationLabel,
  removeCardSummaryNoteRelation,
} from '@store/nodeCards'

export function useCardSummaryNoteLinks(cardId) {
  const dispatch = useDispatch()

  const [relations, setRelations] = useState([])
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (!cardId) return
    refresh()
  }, [cardId])

  const refresh = async () => {
    const data = await dispatch(fetchCardSummaryNoteRelations(cardId))
    setRelations(data)
  }

  const addNote = async (option) => {
    if (!option || isSyncing) return
    setIsSyncing(true)
    try {
      await dispatch(addCardSummaryNoteRelation(cardId, option.value, option.label))
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
      await dispatch(updateCardSummaryNoteRelationLabel(relationId, label))
      setRelations(prev => prev.map(r => r.id === relationId ? { ...r, label } : r))
    } finally {
      setIsSyncing(false)
    }
  }

  const removeNote = async (relationId) => {
    if (isSyncing) return
    setIsSyncing(true)
    try {
      await dispatch(removeCardSummaryNoteRelation(relationId))
      await refresh()
    } finally {
      setIsSyncing(false)
    }
  }

  return { relations, addNote, updateLabel, removeNote, isSyncing }
}
