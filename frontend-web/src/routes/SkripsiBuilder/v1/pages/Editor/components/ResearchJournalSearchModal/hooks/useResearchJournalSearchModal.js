import { useState, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSetResearchSettings, updateSetResearchSettings, searchSkripsiJournals } from '@store/skripsi/userAction'

const PER_PAGE = 10
const MAX_JOURNALS = 20
const CURRENT_YEAR = new Date().getFullYear()

export function useResearchJournalSearchModal({ isOpen, onClose, setUniqueId }) {
  const dispatch = useDispatch()

  const [saving, setSaving] = useState(false)
  const [domainFilterEnabled, setDomainFilterEnabled] = useState(true)
  const [myJournals, setMyJournals] = useState([]) // unified list — from search or pre-existing (already cleaned up server-side)

  // Year filter state — no "all years" option; narrowest reasonable default is 5 years
  const [yearMode, setYearMode] = useState('latest5') // 'latest5' | 'latest10' | 'custom'
  const [latestYears, setLatestYears] = useState(null)
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')

  // Live search state
  const [journalSearch, setJournalSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchPagination, setSearchPagination] = useState({ page: 1, perPage: PER_PAGE, isLastPage: true })
  const [searching, setSearching] = useState(false)
  const searchTimeoutRef = useRef(null)

  const loadSearch = useCallback(async (page, query) => {
    setSearching(true)
    try {
      const result = await dispatch(searchSkripsiJournals({ query, page, perPage: PER_PAGE }))
      setSearchResults(result.data || [])
      setSearchPagination(result.pagination || { page, perPage: PER_PAGE, isLastPage: true })
    } finally {
      setSearching(false)
    }
  }, [dispatch])

  const resetOnOpen = useCallback(() => {
    if (!isOpen || !setUniqueId) return

    setJournalSearch('')
    loadSearch(1, '') // browse top journals immediately — no need to type first

    dispatch(fetchSetResearchSettings(setUniqueId)).then(data => {
      if (!data) return

      setDomainFilterEnabled(data.domainFilterEnabled)
      const merged = [...new Set([...(data.selectedJournals ?? []), ...(data.customJournals ?? [])])]
      setMyJournals(merged)

      if (data.latestYears) {
        setLatestYears(data.latestYears)
        setYearMode(`latest${data.latestYears}`)
        setYearFrom('')
        setYearTo('')
      } else if (data.yearFrom || data.yearTo) {
        setYearMode('custom')
        setLatestYears(null)
        setYearFrom(data.yearFrom ? String(data.yearFrom) : '')
        setYearTo(data.yearTo ? String(data.yearTo) : '')
      } else {
        // No saved preference yet — default to the last 5 years rather than
        // unrestricted "all years".
        setYearMode('latest5')
        setLatestYears(5)
        setYearFrom('')
        setYearTo('')
      }
    })
  }, [isOpen, setUniqueId, dispatch, loadSearch])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setJournalSearch(value)
    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => loadSearch(1, value), 350)
  }

  const handleSearchPageChange = (page) => loadSearch(page, journalSearch)

  const atLimit = myJournals.length >= MAX_JOURNALS

  const addJournal = (name) => {
    if (myJournals.includes(name) || atLimit) return
    setMyJournals(prev => [...prev, name])
  }

  const removeJournal = (name) => {
    setMyJournals(prev => prev.filter(j => j !== name))
  }

  const selectAllResults = () => {
    setMyJournals(prev => {
      const merged = [...new Set([...prev, ...searchResults.map(r => r.name)])]
      return merged.slice(0, MAX_JOURNALS)
    })
  }

  const clearAllJournals = () => setMyJournals([])

  const handleSave = async () => {
    let saveLatestYears = null
    let saveYearFrom = null
    let saveYearTo = null

    if (yearMode === 'custom') {
      saveYearFrom = yearFrom ? parseInt(yearFrom) : null
      saveYearTo = yearTo ? parseInt(yearTo) : null
    } else {
      saveLatestYears = latestYears
    }

    setSaving(true)
    try {
      await dispatch(updateSetResearchSettings(setUniqueId, {
        domainFilterEnabled,
        selectedJournals: myJournals,
        customJournals: [],
        latestYears: saveLatestYears,
        yearFrom: saveYearFrom,
        yearTo: saveYearTo,
      }))
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return {
    isSaving: saving,
    domainFilterEnabled,
    setDomainFilterEnabled,
    yearMode,
    setYearMode,
    latestYears,
    setLatestYears,
    yearFrom,
    setYearFrom,
    yearTo,
    setYearTo,
    currentYear: CURRENT_YEAR,
    myJournals,
    maxJournals: MAX_JOURNALS,
    atLimit,
    journalSearch,
    searchResults,
    searchPagination,
    searching,
    resetOnOpen,
    handleSearchChange,
    handleSearchPageChange,
    addJournal,
    removeJournal,
    selectAllResults,
    clearAllJournals,
    handleSave,
  }
}
