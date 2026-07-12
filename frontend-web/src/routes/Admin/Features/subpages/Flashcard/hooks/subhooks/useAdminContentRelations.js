import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getWithToken, postWithToken, deleteWithToken } from '@utils/requestUtils'
import { fetchAdminMcqTopics } from '@store/mcq/adminAction'
import { fetchAdminSummaryNotes } from '@store/summaryNotes/adminAction'
import Endpoints from '@config/endpoint'

const PER_PAGE = 12

export function useAdminContentRelations(deckId) {
  const dispatch = useDispatch()
  const { topics: mcqItems, loading: mcqLoading, pagination: mcqPagination } = useSelector(s => s.mcq)
  const { notes: snItems, loading: snLoading, pagination: snPagination } = useSelector(s => s.summaryNotes)

  const [relations, setRelations] = useState([])
  const [mcqPage, setMcqPage] = useState(1)
  const [snPage, setSnPage] = useState(1)
  const [isRelationsLoading, setIsRelationsLoading] = useState(false)

  useEffect(() => {
    if (!deckId) return
    fetchRelations()
    setMcqPage(1)
    setSnPage(1)
    dispatch(fetchAdminMcqTopics({ status: 'published', page: 1, limit: PER_PAGE }))
    dispatch(fetchAdminSummaryNotes({ status: 'published', page: 1, perPage: PER_PAGE }))
  }, [deckId])

  const fetchRelations = async () => {
    try {
      const res = await getWithToken(Endpoints.admin.contentRelations, {
        sourceType: 'flashcard_deck',
        sourceId: deckId,
      })
      setRelations(res.data.data || [])
    } catch {
      setRelations([])
    }
  }

  const loadMoreMcq = () => {
    const next = mcqPage + 1
    setMcqPage(next)
    dispatch(fetchAdminMcqTopics({ status: 'published', page: next, limit: PER_PAGE, append: true }))
  }

  const loadMoreSn = () => {
    const next = snPage + 1
    setSnPage(next)
    dispatch(fetchAdminSummaryNotes({ status: 'published', page: next, perPage: PER_PAGE, append: true }))
  }

  const add = async (type, item) => {
    if (!item || isRelationsLoading) return
    setIsRelationsLoading(true)
    try {
      await postWithToken(Endpoints.admin.contentRelations, {
        sourceType: 'flashcard_deck',
        sourceId: deckId,
        targetType: type,
        targetId: item.value ?? item.id,
      })
      await fetchRelations()
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
      await deleteWithToken(`${Endpoints.admin.contentRelations}/${id}`)
      await fetchRelations()
    } catch {
      alert('Gagal menghapus relasi')
    } finally {
      setIsRelationsLoading(false)
    }
  }

  const mcqRelations = relations.filter(r => r.targetType === 'mcq_topic')
  const snRelations = relations.filter(r => r.targetType === 'summary_note')

  return {
    mcqItems,
    snItems,
    mcqRelations,
    snRelations,
    mcqPagination,
    snPagination,
    isMcqLoading: !!mcqLoading?.isTopicsLoading,
    isSnLoading: !!snLoading?.isAdminNotesLoading,
    isRelationsLoading,
    loadMoreMcq,
    loadMoreSn,
    add,
    remove,
  }
}
