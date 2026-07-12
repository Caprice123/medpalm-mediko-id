import { useState, useEffect } from 'react'
import { getWithToken, postWithToken, deleteWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'

export function useContentRelations(deckId) {
  const [relations, setRelations] = useState([])
  const [mcqItems, setMcqItems] = useState([])
  const [snItems, setSnItems] = useState([])
  const [selectedType, setSelectedType] = useState('mcq_topic')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!deckId) return
    fetchRelations()
    fetchOptions()
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

  const fetchAllPages = async (url, pageParam, limitParam, limitValue, extraParams = {}) => {
    const all = []
    let page = 1
    while (true) {
      const res = await getWithToken(url, { [pageParam]: page, [limitParam]: limitValue, ...extraParams })
      const items = res.data.data || []
      all.push(...items)
      if (res.data.pagination?.isLastPage !== false) break
      page++
    }
    return all
  }

  const fetchOptions = async () => {
    try {
      const [mcqAll, snAll] = await Promise.all([
        fetchAllPages(Endpoints.admin.mcq + '/topics', 'page', 'limit', 100, { status: 'published' }),
        fetchAllPages(Endpoints.admin.summaryNotes, 'page', 'perPage', 100, { status: 'published' }),
      ])
      setMcqItems(mcqAll)
      setSnItems(snAll)
    } catch {
      /* noop */
    }
  }

  const add = async (type, item) => {
    const resolvedType = type ?? selectedType
    const resolvedItem = item ?? selectedItem
    if (!resolvedItem || isLoading) return
    setIsLoading(true)
    try {
      await postWithToken(Endpoints.admin.contentRelations, {
        sourceType: 'flashcard_deck',
        sourceId: deckId,
        targetType: resolvedType,
        targetId: resolvedItem.value ?? resolvedItem.id,
      })
      setSelectedItem(null)
      await fetchRelations()
    } catch (e) {
      alert(e?.response?.data?.message || 'Gagal menambahkan relasi')
    } finally {
      setIsLoading(false)
    }
  }

  const remove = async (id) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      await deleteWithToken(`${Endpoints.admin.contentRelations}/${id}`)
      await fetchRelations()
    } catch {
      alert('Gagal menghapus relasi')
    } finally {
      setIsLoading(false)
    }
  }

  const linkedMcqIds = new Set(relations.filter(r => r.targetType === 'mcq_topic').map(r => r.targetId))
  const linkedSnIds = new Set(relations.filter(r => r.targetType === 'summary_note').map(r => r.targetId))

  // {value, label} format kept for V1 dropdown compatibility
  const mcqOptions = mcqItems.map(t => ({ value: t.id, label: t.title }))
  const snOptions = snItems.map(n => ({ value: n.id, label: n.title }))
  const availableMcqOptions = mcqOptions.filter(o => !linkedMcqIds.has(o.value))
  const availableSnOptions = snOptions.filter(o => !linkedSnIds.has(o.value))
  const availableOptions = selectedType === 'mcq_topic' ? availableMcqOptions : availableSnOptions

  const mcqRelations = relations.filter(r => r.targetType === 'mcq_topic')
  const snRelations = relations.filter(r => r.targetType === 'summary_note')

  return {
    relations,
    mcqRelations,
    snRelations,
    mcqItems,
    snItems,
    mcqOptions,
    snOptions,
    availableOptions,
    availableMcqOptions,
    availableSnOptions,
    selectedType,
    setSelectedType,
    selectedItem,
    setSelectedItem,
    add,
    remove,
    isLoading,
  }
}
