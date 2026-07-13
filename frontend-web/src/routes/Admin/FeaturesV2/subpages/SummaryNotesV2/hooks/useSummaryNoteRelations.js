import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminMcqTopics } from '@store/mcq/adminAction'
import { fetchPublishedFlashcardDecks } from '@store/flashcard/v2/adminAction'
import {
  fetchSummaryNoteRelations,
  addSummaryNoteRelation,
  removeSummaryNoteRelation,
} from '@store/summaryNotes/adminAction'

const PER_PAGE = 12

export function useSummaryNoteRelations(noteId) {
  const dispatch = useDispatch()
  const { topics: mcqItems, loading: mcqLoading, pagination: mcqPagination } = useSelector(s => s.mcq)

  const [flashcardItems, setFlashcardItems] = useState([])
  const [flashcardPagination, setFlashcardPagination] = useState({ isLastPage: true })
  const [isFlashcardLoading, setIsFlashcardLoading] = useState(false)
  const [flashcardPage, setFlashcardPage] = useState(1)
  const [mcqPage, setMcqPage] = useState(1)
  const [relations, setRelations] = useState([])
  const [isRelationsLoading, setIsRelationsLoading] = useState(false)

  useEffect(() => {
    if (!noteId) return
    loadRelations()
    setFlashcardPage(1)
    setMcqPage(1)
    loadFlashcardDecks(1, false)
    dispatch(fetchAdminMcqTopics({ status: 'published', page: 1, limit: PER_PAGE }))
  }, [noteId])

  const loadFlashcardDecks = async (page, append) => {
    setIsFlashcardLoading(true)
    try {
      const data = await dispatch(fetchPublishedFlashcardDecks({ page, perPage: PER_PAGE }))
      setFlashcardItems(prev => append ? [...prev, ...(data.data || [])] : (data.data || []))
      setFlashcardPagination(data.pagination || { isLastPage: true })
    } finally {
      setIsFlashcardLoading(false)
    }
  }

  const loadRelations = async () => {
    try {
      const data = await dispatch(fetchSummaryNoteRelations(noteId))
      setRelations(data)
    } catch {
      setRelations([])
    }
  }

  const loadMoreFlashcard = () => {
    const next = flashcardPage + 1
    setFlashcardPage(next)
    loadFlashcardDecks(next, true)
  }

  const loadMoreMcq = () => {
    const next = mcqPage + 1
    setMcqPage(next)
    dispatch(fetchAdminMcqTopics({ status: 'published', page: next, limit: PER_PAGE, append: true }))
  }

  const add = async (targetType, item) => {
    if (!item || isRelationsLoading) return
    setIsRelationsLoading(true)
    try {
      await dispatch(addSummaryNoteRelation(noteId, targetType, item.value ?? item.id))
      await loadRelations()
    } catch (e) {
      alert(e?.response?.data?.message || 'Gagal menambahkan relasi')
    } finally {
      setIsRelationsLoading(false)
    }
  }

  const remove = async (id) => {
    if (isRelationsLoading) return
    setIsRelationsLoading(true)
    try {
      await dispatch(removeSummaryNoteRelation(id))
      await loadRelations()
    } catch {
      alert('Gagal menghapus relasi')
    } finally {
      setIsRelationsLoading(false)
    }
  }

  const flashcardRelations = relations.filter(r => r.targetType === 'flashcard_deck')
  const mcqRelations = relations.filter(r => r.targetType === 'mcq_topic')

  return {
    flashcardItems,
    mcqItems,
    flashcardRelations,
    mcqRelations,
    flashcardPagination,
    mcqPagination,
    isFlashcardLoading,
    isMcqLoading: !!mcqLoading?.isTopicsLoading,
    isRelationsLoading,
    loadMoreFlashcard,
    loadMoreMcq,
    add,
    remove,
  }
}
