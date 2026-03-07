import { useState, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
  fetchResearchDomains,
  createResearchDomain,
  updateResearchDomain,
  deleteResearchDomain
} from '@store/chatbot/adminAction'

const PER_PAGE = 12

export const useResearchDomains = () => {
  const dispatch = useDispatch()
  const [domains, setDomains] = useState([])
  const [pagination, setPagination] = useState({ page: 1, isLastPage: true })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const searchTimeoutRef = useRef(null)

  const load = useCallback(async (page, searchTerm) => {
    setLoading(true)
    try {
      const data = await dispatch(fetchResearchDomains({ page, perPage: PER_PAGE, search: searchTerm }))
      if (data) {
        setDomains(data.domains || [])
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

  const addDomain = useCallback(async (domain) => {
    await dispatch(createResearchDomain(domain))
    await load(1, search)
  }, [dispatch, load, search])

  const toggleDomain = useCallback(async (id, is_active) => {
    await dispatch(updateResearchDomain(id, is_active))
    await load(pagination.page, search)
  }, [dispatch, load, pagination.page, search])

  const removeDomain = useCallback(async (id) => {
    await dispatch(deleteResearchDomain(id))
    // If last item on page > 1, go back one page
    const newPage = domains.length === 1 && pagination.page > 1
      ? pagination.page - 1
      : pagination.page
    await load(newPage, search)
  }, [dispatch, load, domains.length, pagination.page, search])

  return {
    domains,
    pagination,
    search,
    loading,
    initialize,
    handleSearchChange,
    handlePageChange,
    addDomain,
    toggleDomain,
    removeDomain
  }
}
