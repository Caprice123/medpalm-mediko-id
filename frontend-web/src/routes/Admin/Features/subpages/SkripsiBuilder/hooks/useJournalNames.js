import { useState, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchAdminSkripsiJournals,
  createAdminSkripsiJournal,
  updateAdminSkripsiJournal,
  deleteAdminSkripsiJournal
} from '@store/skripsi/adminAction'

const PER_PAGE = 20

export const useJournalNames = () => {
  const dispatch = useDispatch()
  const [journals, setJournals] = useState([])
  const [pagination, setPagination] = useState({ page: 1, isLastPage: true })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const searchTimeoutRef = useRef(null)

  const load = useCallback(async (page, searchTerm) => {
    setLoading(true)
    try {
      const data = await dispatch(fetchAdminSkripsiJournals({ page, perPage: PER_PAGE, search: searchTerm }))
      if (data) {
        setJournals(data.journals || [])
        setPagination(data.pagination || { page: 1, isLastPage: true })
      }
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const initialize = useCallback(() => {
    setSearch('')
    load(1, '')
  }, [load])

  const handleSearchChange = (value) => {
    setSearch(value)
    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => load(1, value), 350)
  }

  const handlePageChange = (page) => load(page, search)

  const addJournal = useCallback(async (name) => {
    await dispatch(createAdminSkripsiJournal(name))
    await load(1, search)
  }, [dispatch, load, search])

  const toggleJournal = useCallback(async (id, is_active) => {
    await dispatch(updateAdminSkripsiJournal(id, { is_active }))
    await load(pagination.page, search)
  }, [dispatch, load, pagination.page, search])

  const removeJournal = useCallback(async (id) => {
    await dispatch(deleteAdminSkripsiJournal(id))
    const newPage = journals.length === 1 && pagination.page > 1
      ? pagination.page - 1
      : pagination.page
    await load(newPage, search)
  }, [dispatch, load, journals.length, pagination.page, search])

  return {
    journals,
    pagination,
    search,
    loading,
    initialize,
    handleSearchChange,
    handlePageChange,
    addJournal,
    toggleJournal,
    removeJournal
  }
}
